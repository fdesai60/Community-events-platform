# Community Events Platform
## Contents
- [Hosted Links](#hosted-links)
- [Test account access details](#test-account-access-details)
- [Project Summary](#project-summary)
- [Tech Stack](#tech-stack)
- [Authentication and Authorization Details](#authentication-and-authorization-details)
- [How to Run Locally](#how-to-run-locally)
- [Setting Up Environment Variables](#setting-up-environment-variables)
  - [Step 1: Setup Google Cloud Console Project](#step-1-setup-google-cloud-console-project)
  - [Step 2: Configure OAuth Consent Screen](#step-2-configure-oauth-consent-screen)
  - [Step 3: Add OAuth Scopes](#step-3-add-oauth-scopes)
  - [Step 4: Create OAuth Credentials](#step-4-create-oauth-credentials)
  - [Step 5: Setup Supabase Project](#step-5-setup-supabase-project)
  - [Step 6: Update .env.example in Backend](#step-6-update-envexample-in-backend)
  - [Step 7: Configure Google OAuth in Supabase](#step-7-configure-google-oauth-in-supabase)
  - [Step 8: Complete OAuth Redirect URI Setup](#step-8-complete-oauth-redirect-uri-setup)
  - [Step 9: Finalise Environment Variables](#step-9-finalise-environment-variables)
  - [Step 10: Make the Staff User a Staff](#step-10-make-the-staff-user-a-staff)

## Hosted links
- HOSTED FRONTEND (Netlify):https://community-events-platform.netlify.app/
- HOSTED BACKEND  (Render) :https://events-platform-backend-yutm.onrender.com

## Test account access details:
Regular User:
- GMAIL:testCommunityUser82@gmail.com
- PASSWORD: TestUser82!
  
Staff User:
- GMAIL:testStaffUser82@gmail.com
- PASSWORD:TestStaff82!

## Project Summary
This project is a community events platform built to allow users to browse, sign up for, and add events to their personal Google Calendars.
Staff members have additional privileges to create and manage events.
The app implements secure authentication and role-based access control, ensuring only staff can create or delete events.

## Tech Stack:
- React with Vite for the frontend
- Node.js with Express for the backend API
- Supabase for user authentication and database management (PostgreSQL).
- Google OAuth via Supabase enables secure user login with Google accounts. 

## Authentication and Authorization Details:
- Google OAuth via Supabase: Users sign in securely using Google accounts.
- User Roles: Users have roles stored in their user_metadata on Supabase auth.
- Role Management API: An Express route (/make-staff) is implemented to assign staff roles by email.
- Middleware: Two middleware functions requireUser and requireStaff verify JWT tokens and user roles for protected routes.

## How to Run Locally:
Prerequisites:
- Node.js and npm installed

Setup steps:
1) clone the repository
```
git clone <your-repo-url>
cd <your-repo-folder>
```

2) Install backend dependencies:
```
cd events-platform-backend
npm install
```

3) In a new terminal, install frontend dependencies:
```
cd events-platform-frontend
npm install
```   

## Setting Up Environment Variables
- Since the .env files contain sensitive information and are not included in the repo, you will need to create your own environment variables by setting up a Google Cloud project and a Supabase project.
- If you'd prefer to skip the full setup process, feel free to email me at fdesai60@gmail.com, and I can privately share the required .env files with you.
- Otherwise, follow the steps below to set everything up yourself.

### Step 1: Setup Google Cloud Console Project
1. Go to console.cloud.google.com
2. Create a new project 
3. Give it a Project Name (e.g. Community-events-platform)
3. Leave the organization as “No organization” (default)
4. Open the Navigation Menu → APIs & Services → Enabled APIs and services
5. Click Enable APIs and services
6. Search for Google Calendar API and enable it
  

  
### Step 2: Configure OAuth Consent Screen
1. In the Navigation Menu, select OAuth consent screen
2. Click Get started
3. Provide an App name and User support email
4. Under Audience, choose External for the User type 
5. Fill out the contact information and agree to data policies
6. Under Branding, skip the logo and app domain fields for now (The authorised domain should be filled out automatically later on when we add an Authorised redirect URI)
7. For Test users, add the emails above, ie:  
  - testCommunityUser82@gmail.com
  - testStaffUser82@gmail.com  
  (Ignore any popup warnings)

### Step 3: Add OAuth Scopes
1. Still in OAuth consent screen, go to Data Access
2. Select the following scopes:
  - ../auth/userinfo.email
  - ../auth/userinfo.profile
  - openid
  - Search for and select https://www.googleapis.com/auth/calendar

### Step 4: Create OAuth Credentials
1. Navigate to APIs & Services → Credentials
2. Click Create Credentials → OAuth client ID
3. Select Application type of Web application
4. Name your client (e.g. Community-Events-Web-Client)
5. Add Authorized JavaScript origins:
  http://localhost:5173
6. Do not add redirect URIs yet — this comes after Supabase setup
7. Click Create and download the JSON credentials file
8. From the JSON file, copy the client ID
9. In the events-platform-frontend .env.example file, replace the placeholder value of VITE_GOOGLE_CLIENT_ID to be the client id

### Step 5: Setup Supabase Project
1. Go to app.supabase.com and create a new project
2. Give it a name and password — remember this password!
3. Navigate to SQL Editor
4. Click New SQL Snippet
5. Copy the SQL schema from events-platform-backend/db/db.setup.sql into the editor and run it
6. Click Connect (near the top), scroll down to find the transaction pooler connection string (you may HAVE to use the downwards arrow key for this)

### Step 6: Update .env.example in Backend
1. Open events-platform-backend/.env.example
2. Replace the placeholder DATABASE_URL with the connection string from Supabase (update the password to the one you created)

### Step 7: Configure Google OAuth in Supabase
1. Go to Authentication → Sign In/Providers
2. Enable the Google provider toggle
3. Paste your Client ID and Client Secret from Google Cloud Console

### Step 8: Complete OAuth Redirect URI Setup
1. Copy the callback URL for OAuth from supabase (where u had pasted in the Client ID and Client Secret )
2. Go back to Google Cloud Console → APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID → Add the Authorized redirect URI from Supabase (that we just copied in step 1 ie the callback URL for OAuth)

### Step 9: Finalise Environment Variables
1. In your Supabase project, navigate to Project Settings > Data API:
2. Copy the project URL
- Paste it as the value of SUPABASE_URL in your backend .env.example
- Also paste it as the value of VITE_SUPABASE_URL in your frontend .env.example 
3. In your Supabase project, go to Project Settings > API Keys:
4. Copy the anon public key
- Paste it as the value of SUPABASE_ANON_KEY in your backend .env.example
- Also paste it as the value of VITE_SUPABASE_CLIENT in your frontend .env.example 
5. Copy the service role secret and paste it as the value of SUPABASE_SERVICE_ROLE_KEY in your backend .env.example
6. Finally, rename both .env.example files in backend and frontend folders to just .env

### Step 10: Make the Staff User a Staff
1. Run your backend and frontend locally:
```
# Backend
cd events-platform-backend
npm run dev 

# Frontend (in new terminal)
cd ../events-platform-frontend
npm run dev
```
2.Open Insomnia or any API client
3. Make a POST request to: http://localhost:5001/api/admin/make-staff
4. Set the request body (JSON):
```
{
  "email": "testStaffUser82@gmail.com"
}
```
5. Send the request — this will assign the staff role to the test staff user
6. You can now log using the Test account access details above as:
- A Regular User
- A Staff User (create/delete events!)
