# 🚀 Quick Test - Explainable AI (2 Minutes)

## Step-by-Step Visual Guide

### 1️⃣ Start ML Service (30 seconds)

```bash
cd ml_service
python3 api_server.py
```

**Look for:**
```
Model loaded successfully
 * Running on http://127.0.0.1:5001
```

---

### 2️⃣ Open Your App (10 seconds)

```
http://localhost:3000/dashboard
```

---

### 3️⃣ Check Console (10 seconds)

Press `F12` → Console tab

**Look for:**
```
ML Service Status: Connected ✅
```

**If you see "ML Service not available" ❌**
→ Go back to Step 1

---

### 4️⃣ Click Any Student (5 seconds)

Click on a student card in the dashboard

---

### 5️⃣ Find Prediction Panel (5 seconds)

Scroll down to find:
```
┌─────────────────────────────────┐
│ 🤖 AI Dropout Risk Prediction   │
│                                 │
│  [Predict Dropout Risk]         │
└─────────────────────────────────┘
```

---

### 6️⃣ Click "Predict Dropout Risk" (5 seconds)

Click the button and wait 2-3 seconds

---

### 7️⃣ Verify Results (30 seconds)

You should see:

#### ✅ Basic Prediction (Already existed):
```
Risk Level: [HIGH] 🔴
Dropout Risk: 75.3% ████████░░
Graduate Probability: 22.1% ██░░░░░░░░
📚 Academic Risk: 68.2%
👥 Socioeconomic Risk: 72.5%
```

#### ⭐ NEW: Explainable AI Section:
```
┌──────────────────────────────────────────┐
│ Why is Student_1 at HIGH Risk?           │
├──────────────────────────────────────────┤
│                                          │
│ 🔴 Key Concerns                          │
│   • Academic Performance                 │
│   • Financial Issues                     │
│                                          │
│ ⚠️ Risk Factors                          │
│   • Low course completion rate: 45.2%    │
│   • Low grades in semester 2: 8.5/20     │
│   • Outstanding debt                     │
│   • Tuition fees not up to date          │
│                                          │
│ ✅ Protective Factors                    │
│   • Scholarship holder                   │
│                                          │
│ 💡 Recommended Actions                   │
│   → Consider academic tutoring           │
│   → Connect with financial aid office    │
│   → Urgent: Address tuition payment      │
│   → Immediate counselor intervention     │
└──────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] ML Service running (Step 1)
- [ ] Console shows "Connected" (Step 3)
- [ ] Prediction panel appears (Step 5)
- [ ] Prediction loads (Step 6)
- [ ] **Explainable AI section shows** (Step 7) ⭐

---

## 🎯 What to Look For

### The NEW Explainable AI section should have:

1. **Heading**: "Why is [Name] at [RISK] Risk?"
2. **Key Concerns**: Red badges with main issues
3. **Risk Factors**: List with bullet points
4. **Protective Factors**: Green checkmarks
5. **Recommendations**: Blue box with action items

---

## 🐛 Quick Fixes

### Not seeing Explainable AI section?

**Check 1:** ML Service Running?
```bash
curl http://localhost:5001/health
```

**Check 2:** Console Errors?
Press F12 → Look for red errors

**Check 3:** Prediction Successful?
Network tab → Look for `/predict` request → Check response has `explanations`

---

## 🎉 You're Done!

If you see the Explainable AI section with risk factors and recommendations, **it's working!** 🚀

---

## 📸 What It Should Look Like

```
┌─────────────────────────────────────────────────┐
│ Student Detail Modal                            │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Student Info]                                  │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ 🤖 AI Dropout Risk Prediction           │   │
│ │                                         │   │
│ │ Risk Level: HIGH 🔴                     │   │
│ │ Dropout Risk: 75% ████████░░            │   │
│ │ Academic Risk: 68%                      │   │
│ │ Socioeconomic Risk: 72%                 │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ ⭐ Why is Student at HIGH Risk?         │   │ ← NEW!
│ │                                         │   │
│ │ 🔴 Key Concerns                         │   │
│ │   • Academic Performance                │   │
│ │   • Financial Issues                    │   │
│ │                                         │   │
│ │ ⚠️ Risk Factors                         │   │
│ │   • Low grades                          │   │
│ │   • Outstanding debt                    │   │
│ │                                         │   │
│ │ 💡 Recommendations                      │   │
│ │   → Academic tutoring                   │   │
│ │   → Financial aid                       │   │
│ └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

**Total Time: 2 minutes** ⏱️

**If you see the Explainable AI section, you're all set!** ✅
