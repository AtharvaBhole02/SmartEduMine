const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add a new student
router.post('/', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const student = await newStudent.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a student
router.put('/:id', async (req, res) => {
    try {
        let student = await Student.findOne({ studentId: req.params.id });
        if (!student) {
            // Try finding by _id if studentId fails
            student = await Student.findById(req.params.id);
            if (!student) return res.status(404).json({ msg: 'Student not found' });
        }

        student = await Student.findOneAndUpdate(
            { _id: student._id },
            { $set: req.body },
            { new: true }
        );

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ studentId: req.params.id });
        if (!student) {
            // Try finding by _id if studentId fails
            const studentById = await Student.findByIdAndDelete(req.params.id);
            if (!studentById) return res.status(404).json({ msg: 'Student not found' });
        }
        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Bulk Import
// Bulk Import
router.post('/bulk', async (req, res) => {
    try {
        const students = req.body;
        console.log('📦 RAW REQ.BODY TYPE:', typeof students);
        console.log('📦 RAW REQ.BODY IS_ARRAY:', Array.isArray(students));
        console.log('📦 RAW REQ.BODY LENGTH:', students ? students.length : 'null');
        if (students && students.length > 0) {
            console.log('📦 FIRST STUDENT SAMPLE:', JSON.stringify(students[0], null, 2));
        }

        if (!students || !Array.isArray(students) || students.length === 0) {
            console.error('❌ No student data received in body!');
            return res.status(400).json({
                success: false,
                message: 'No student data received. Check request body format and size.'
            });
        }

        // Try insertMany without ordered option first
        console.log('🧪 Attempting insertMany...');
        const result = await Student.insertMany(students);
        console.log('✅ InsertMany result:', result.length, 'students inserted');

        if (result.length === 0) {
            // No students inserted - likely all duplicates
            return res.status(207).json({
                success: false,
                insertedCount: 0,
                errorCount: students.length,
                message: `Failed to import all ${students.length} students. Likely all duplicates (emails or IDs already exist).`
            });
        }

        res.json({
            success: true,
            insertedCount: result.length,
            message: `Successfully imported ${result.length} students`
        });
    } catch (err) {
        console.error('❌ BULK IMPORT ERROR:', err.name);
        console.error('❌ ERROR MESSAGE:', err.message);

        // Handle partial success (some inserted,some failed)
        if (err.name === 'MongoServerError' || err.name === 'MongoBulkWriteError') {
            const insertedCount = err.insertedDocs ? err.insertedDocs.length : 0;
            const errorCount = err.writeErrors ? err.writeErrors.length : 0;

            console.log(`📊 Partial Result: ${insertedCount} inserted, ${errorCount} failed`);

            if (err.writeErrors && err.writeErrors.length > 0) {
                console.log('📋 First 3 errors:');
                err.writeErrors.slice(0, 3).forEach((e, i) => {
                    console.log(`  ${i + 1}. Code ${e.code}: ${e.errmsg}`);
                });
            }

            res.status(207).json({
                success: false,
                insertedCount,
                errorCount,
                message: `Imported ${insertedCount} students. Failed to import ${errorCount} students due to duplicates.`,
                errors: err.writeErrors ? err.writeErrors.slice(0, 5).map(e => ({
                    index: e.index,
                    code: e.code,
                    errmsg: e.errmsg
                })) : []
            });
        } else {
            console.error('❌ UNEXPECTED ERROR:', err);
            res.status(500).json({ message: 'Server Error during bulk import', error: err.message });
        }
    }
});

// Delete all students
router.delete('/all/students', async (req, res) => {
    try {
        const result = await Student.deleteMany({});
        res.json({ msg: 'All students removed', count: result.deletedCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
