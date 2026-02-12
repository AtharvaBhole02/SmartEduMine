const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Store the process reference if needed, though for now we just fire and forget
// or we could check if it's running.
let mlProcess = null;

router.post('/start', (req, res) => {
    try {
        const mlServicePath = path.join(__dirname, '../../ml_service/api_server.py');

        console.log('Attempting to start ML service at:', mlServicePath);

        // Use 'python' which should point to the venv python if active, or system python
        const pythonCommand = 'python';

        // Spawn the python process
        // Detached: true allows the child process to run independently of the parent
        // stdio: 'ignore' or 'pipe' depending on if we want logs. Let's pipe for debug.
        mlProcess = spawn(pythonCommand, [mlServicePath], {
            detached: false, // Keep attached so we can see output in dev
            stdio: 'pipe'
        });

        mlProcess.stdout.on('data', (data) => {
            console.log(`ML Service stdout: ${data}`);
        });

        mlProcess.stderr.on('data', (data) => {
            console.error(`ML Service stderr: ${data}`);
        });

        mlProcess.on('close', (code) => {
            console.log(`ML Service exited with code ${code}`);
            mlProcess = null;
        });

        // Give it a moment to fail if it's going to fail immediately
        setTimeout(() => {
            if (mlProcess && mlProcess.exitCode === null) {
                res.json({ success: true, message: 'ML Service started successfully' });
            } else {
                res.status(500).json({ success: false, message: 'ML Service failed to start immediately' });
            }
        }, 2000);

    } catch (error) {
        console.error('Error starting ML service:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/stop', (req, res) => {
    try {
        // Try to kill by port 5001 regardless of who started it
        const { exec } = require('child_process');

        // Command to find PID on port 5001 and kill it
        // lsof -t -i:5001 returns the PID
        // xargs kill -9 kills that PID
        const killCommand = 'lsof -t -i:5001 | xargs kill -9';

        exec(killCommand, (error, stdout, stderr) => {
            if (error) {
                // If error code is 1, it usually means no process was found (which is fine, it's already stopped)
                // If code is 123, it might be xargs specific, but generally non-zero means issue or no process
                if (error.code === 1) {
                    console.log('No process found on port 5001');
                    mlProcess = null;
                    return res.json({ success: true, message: 'ML Service was not running' });
                }
                console.warn('Error killing process (might not exist):', error.message);
            }

            console.log('ML Service stopped via port kill');
            mlProcess = null;
            res.json({ success: true, message: 'ML Service stopped successfully' });
        });

    } catch (error) {
        console.error('Error stopping ML service:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
