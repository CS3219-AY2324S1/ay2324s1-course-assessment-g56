# Setup instructions

Step 1: Build the docker image for question_service and run the container.

Create a .env file in the `backend/question_service` directory, then copy and paste the contents from Assignment2-questionServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/question_service

npm install --prefix .

npm start
```

Step 2: Build the docker image for user_service and run the container.

Create a .env file in the `backend/user_service` directory, then copy and paste the contents from Assignment2-userServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/user_service

npm install --prefix .

npm start
```

Step 3: Build the docker image for frontend_service and run the container.

Create a .env file in the `frontend` directory, then copy and paste the contents from Assignment2-frontendServiceEnvironmentVariables.txt into this .env file.

```bash
cd frontend

npm install --prefix .

npm run dev
```

Demo:

 1. email we are using is <peerpreptestacc1@gmail.com>
 2. show that there are no entry for <peerpreptestacc1@gmail.com> in the backend
 3. use new email for login
 4. shows login is through magic link
 5. show that there is a new entry for <peerpreptestacc1@gmail.com> and the profile data is all empty for that email
 6. show onboarding process
 7. show that backend has been updated
 8. show the edit profile page
 9. makes edit to the profile page on the frontend and show the result in the backend
 10. show the functions calling the API endpoints on the backend
 11. show the API endpoints on the backend for question_service
 12. perform a CRUD operation using the frontend