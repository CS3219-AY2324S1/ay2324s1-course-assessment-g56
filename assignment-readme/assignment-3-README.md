# Setup instructions

Step 1: Build the docker image for question_service and run the container.

Create a .env file in the `backend/question_service` directory, then copy and paste the contents from Assignment2-questionServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/question_service

docker build -t peerprep/question_service .

docker run --env-file ./.env -p 5001:5001 peerprep/question_service
```

Step 2: Build the docker image for user_service and run the container.

Create a .env file in the `backend/user_service` directory, then copy and paste the contents from Assignment2-userServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/user_service

docker build -t peerprep/user_service .

docker run --env-file ./.env -p 5005:5005 peerprep/user_service
```

Step 3: Build the docker image for frontend_service and run the container.

Create a .env file in the `frontend` directory, then copy and paste the contents from Assignment2-frontendServiceEnvironmentVariables.txt into this .env file.

```bash
cd frontend

yarn install

yarn dev
```

Demo:

  Authenticated users should not be allowed to access the questions

  1. Show that unauthorised and unauthenticated users will get error messages based on the code
  2. Perform CRUD using Postman and see the messages being shown

  Session Management

  1. Login using the email <peerpreptestacc1@gmail.com>
  2. Open a new tab and go to localhost:3000
  3. Show that it will redirect
  4. Change the profile details in 1 tab and show that other tab will reflect the changes

  Authorization of users using roles to create and update question

  1. Show that a user with "Maintainer" role have add question and update question pages
  2. Perform adding and updating of questions
  3. Show that a user with "User" role does not have add question and update question pages

Files relevant for Assignment 3

Question Service:

  Backend:

- Middleware used to check for unauthorised and unauthenticated users accessing the service: backend\question_service\src\middleware\authMiddleware.ts

Session Management:
  
  It is handled by Supabase

  Frontend:

- Manages sessions: frontend\src\contexts\SupabaseProvider.tsx
