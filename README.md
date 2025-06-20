# Community Events Platform
- HOSTED FRONTEND (Netlify):https://community-events-platform.netlify.app/
- HOSTED BACKEND  (Render) :https://events-platform-backend-yutm.onrender.com

## Project Summary
This project is a community events platform built to allow users to browse, sign up for, and add events to their personal Google Calendars.
Staff members have additional privileges to create and manage events.
The app implements secure authentication and role-based access control, ensuring only staff can create or delete events.

## The platform uses:
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
- Supabase project set up with credentials
- Google Cloud Console configured for Google OAuth and Google Calendar API access
- An .env file with the following variables in the events-platform-backend folder:
  - DATABASE_URL
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_ANON_KEY
- An .env file with the following variables in the events-platform-frontend folder:
  - VITE_BACKEND_URL
  - VITE_GOOGLE_CLIENT_ID
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_CLIENT
## Installation:
- git clone this-repo
- cd this-repo
  - cd events-platform-backend
  - npm install
  - npm run dev
  - cd events-platform-frontend
  - npm install
  - npm run dev
  - NOTE:
    - Regular users can sign up and login using Google OAuth.
    - Use the /make-staff API endpoint to assign staff role to your email after signing up
    
## Test account access details:
Regular User:
- GMAIL:testCommunityUser82@gmail.com
- PASSWORD: TestUser82!
  
Staff User:
- GMAIL:testStaffUser82@gmail.com
- PASSWORD:TestStaff82!
  

  
