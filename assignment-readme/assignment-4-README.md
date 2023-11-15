# Setup instructions

Step 1: Build the docker image for question_service

Create a .env file in the `backend/question_service` directory, then copy and paste the contents from Assignment4-questionServiceEnvironmentVariables.txt into this .env file.

```
cd backend/question_service

docker build -t peerprep/question_service

docker run --env-file .env -p 5005:5005 peerprep/question_service

```

Step 2: Build and run the docker image for user_service

```
Create a .env file in the `backend/user_service` directory, then copy and paste the contents from Assignment4-userServiceEnvironmentVariables.txt into this .env file.

cd backend/user_service

docker build -t peerprep/user_service

docker run --env-file .env -p 5005:5005 peerprep/user_service
```

Step 3: Run frontend

```
Create a .env file in the `frontend` directory, then copy and paste the contents from Assignment4-frontendEnvironmentVariables.txt into this .env file.

cd frontend

npm install

npm run build

npm start

```

Step 4: Verify that question_service and user_service are working

Sign in and configure preferred interview language. After this step, you will be shown the `Start Matching!` screen. However, for this assignment, the matching service will not be run so you are unable to continue. To go to our home screen with the questions, you will need to click your user icon on the top right to sign out and sign in again as a returning user.

In the home screen, all the questions in our database will be displayed. These questions are obtained by making a GET request to the peerprep/question_service container, **demonstrating that the question_service is containerised**.

Click on Settings on the left side bar and delete your account. The user_service will handle the deletion. When you try to sign in again, you will be treated as a new user and need to configure your preferred interview language again, **demonstrating that the user_service is containerised**.

