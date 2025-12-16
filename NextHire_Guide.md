# NextHire: A-Z Project Guide (Student Edition) 🎓

**Welcome, Macha!** This guide is designed to help you teach this project to anyone from scratch. It covers everything from "What is this?" to "How does the AI work?".

---

## 1. Project Overview 🚀
**Name**: NextHire
**Type**: AI-Powered Recruitment Platform (Job Board)
**Tech Stack**: MERN (MongoDB, Express, React, Node.js)

**Core Idea**:
A website where Recruiters post jobs and Candidates apply. The "Magic" feature is **AI Resume Screening**—the system automatically reads PDFs and scores candidates out of 100 based on how well they fit the job description.

---

## 2. Prerequisites 🛠️
Before starting, the student needs:
1.  **Node.js** (Installed)
2.  **MongoDB** (Local or Atlas URL)
3.  **VS Code** (Code Editor)
4.  **Google Cloud API Key** (For Gemini AI)
5.  **Gmail App Password** (For Email Notifications)

---

## 3. Project Structure 📂
Explain that the project is split into two worlds:

### 🖥️ Client (Frontend)
*   **Where**: `/client` folder
*   **Tech**: React, Vite, Tailwind/CSS.
*   **Job**: What the user **sees** (Pages, Buttons, Forms).
*   **Key Files**:
    *   `src/pages`: All the screens (Home, Dashboard, Jobs).
    *   `src/context`: Stores "Global Data" like User Login info.

### ⚙️ Server (Backend)
*   **Where**: `/server` folder
*   **Tech**: Node.js, Express, MongoDB.
*   **Job**: What the user **doesn't see** (Saving data, AI processing, sending emails).
*   **Key Files**:
    *   `models`: Defines how data looks (User, Job, Candidate).
    *   `routes`: API endpoints (like traffic controllers).
    *   `controllers`: The actual logic (e.g., code to "Save Job").

---

## 4. Key Features & How They Work 🧠

### A. Authentication (Login/Signup)
*   **Concept**: We use **JWT (JSON Web Tokens)**.
*   **Flow**: User logs in -> Server checks DB -> Server gives a "Token" (ID Card) -> Frontend saves it -> Frontend shows "Dashboard".

### B. AI Resume Analysis (The Cool Part) ✨
1.  Candidate uploads PDF.
2.  Server receives file (`multer`).
3.  Server reads text from PDF (`pdf-parse`).
4.  Server sends text + Job Description to **Google Gemini AI**.
5.  Gemini returns a Score (0-100) and Summary.
6.  We show this score to the Recruiter.

### C. Email Notifications 📧
*   **Tool**: `Nodemailer`.
*   **Trigger**: When an Interview is scheduled.
*   **Action**: Server logs into Gmail (via App Password) and sends a nicely formatted email to the candidate.

---

## 5. Step-by-Step Setup Guide 📝

### Step 1: Install Dependencies
Open terminal in root folder:
```bash
cd server
npm install
cd ../client
npm install
```

### Step 2: Environment Variables (.env)
Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=secret_key_123
GEMINI_API_KEY=your_google_ai_key
# Email Settings
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Step 3: Run the Project
We need two terminals:
1.  **Backend**: `cd server` -> `npm run dev` (Runs on port 5000)
2.  **Frontend**: `cd client` -> `npm run dev` (Runs on port 5173)

---

## 6. Common Viva Questions 🎤

**Q: Why is the Resume Analysis slow?**
A: Because it's "Real-time AI". The server actually reads the PDF and talks to Google's supercomputer instantly. It takes 2-3 seconds to "think".

**Q: Where are resumes saved?**
A: In the `server/uploads` folder. We serve them statically so they can be downloaded via a link.

**Q: How is this "Responsive"?**
A: We used CSS Media Queries. On mobile, the Navbar becomes a hamburger menu, and grids turn into vertical stacks.

---

**Good luck teaching! You got this!** 😎
