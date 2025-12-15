# API Testing Guide - Step by Step

This guide explains how to manually test your backend API using a tool like **Postman**, **Insomnia**, or even **Thunder Client** (VS Code Extension).

## Step 1: Register (Get your first Token)

First, you need to create a user. This will give you a token immediately.

*   **URL**: `http://localhost:5000/api/auth/register`
*   **Method**: `POST`
*   **Body** (Select `JSON` format):
    ```json
    {
      "name": "Test Recruiter",
      "email": "test@example.com",
      "password": "password123",
      "role": "recruiter"
    }
    ```
*   **Response**:
    You will see something like this:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

**Action**: Copy that long string inside `"token"`. You need it for the next steps.

---

## Step 2: Login (If you lost your token)

If you come back later, you log in to get a new token.

*   **URL**: `http://localhost:5000/api/auth/login`
*   **Method**: `POST`
*   **Body** (JSON):
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
*   **Response**: You get a `{ "success": true, "token": "..." }` response again.
*   **Action**: Copy the `token`.

---

## Step 3: Accessing Protected Routes (Using the Token)

Now, let's try to create a Job. This requires you to be logged in.

*   **URL**: `http://localhost:5000/api/jobs`
*   **Method**: `POST`
*   **Auth / Headers**:
    *   Go to the **Headers** tab matching your request.
    *   Add a new key: `Authorization`
    *   Set the value: `Bearer <PASTE_YOUR_TOKEN_HERE>`
        *   *Note: There is a space between "Bearer" and your token.*
*   **Body** (JSON):
    ```json
    {
      "title": "Software Engineer",
      "description": "We need a developer...",
      "location": "Remote",
      "skills": ["React", "Node.js"],
      "minExperience": 2,
      "jobType": "Full-time"
    }
    ```
*   **Send**. You should get a success response with the job details.

---

## Step 4: Verify It Works

To check if your token is working correctly without creating data, simply get your own user details.

*   **URL**: `http://localhost:5000/api/auth/me`
*   **Method**: `GET`
*   **Headers**: Add the same `Authorization: Bearer <token>` header.
*   **Response**: You should see your user details (`id`, `name`, `email`).

## Summary

1.  **POST** to `/register` or `/login`.
2.  **Copy** the `token` from the response.

---

## Step 5: The "Balance" Features - Candidates & Interviews

You also have robust features for **hiring**.

### A. Add a Candidate (with AI Resume Parsing)
This is special because you need to upload a **PDF**.

*   **URL**: `http://localhost:5000/api/jobs/<JOB_ID_FROM_STEP_3>/candidates`
*   **Method**: `POST`
*   **Body** (Select `form-data`):
    *   Key: `resume` (Type: File) -> Select a dummy PDF file.
    *   Key: `name` -> "John Doe"
    *   Key: `email` -> "john@example.com"
*   **Auth**: Bearer Token required.
*   **Note**: This triggers the AI service to parse the resume and calculate a match score against the job description!

### B. Schedule Interview
Once you have a Candidate ID (from the previous step response) and a Job ID.

*   **URL**: `http://localhost:5000/api/interviews`
*   **Method**: `POST`
*   **Body** (JSON):
    ```json
    {
      "jobId": "<JOB_ID>",
      "candidateId": "<CANDIDATE_ID>",
      "scheduledAt": "2023-12-25T10:00:00.000Z",
      "mode": "Virtual",
      "meetingLink": "zoom.us/j/123456"
    }
    ```

### C. Add Feedback
After the interview, you can rate the candidate.

*   **URL**: `http://localhost:5000/api/interviews/<INTERVIEW_ID>/feedback`
*   **Method**: `PUT`
*   **Body** (JSON):
    ```json
    {
      "rating": 9,
      "comments": "Great technical skills, good fit.",
      "decision": "Hired"
    }
    ```
