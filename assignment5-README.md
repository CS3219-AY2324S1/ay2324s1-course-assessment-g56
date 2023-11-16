# Setup instructions

Step 1: Build the docker image for question_service and run the container.

Create a .env file in the `backend/question_service` directory, then copy and paste the contents from Assignment5-questionServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/question_service

docker build -t peerprep/question_service .

docker run --env-file ./.env -p 5001:5001 peerprep/question_service
```

Step 2: Build the docker image for user_service and run the container.

Create a .env file in the `backend/user_service` directory, then copy and paste the contents from Assignment5-userServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/user_service

docker build -t peerprep/user_service .

docker run --env-file ./.env -p 5005:5005 peerprep/user_service
```

Step 3: Build the docker image for matching_service and run the container.

Create a .env file in the `backend/matching_service` directory, then copy and paste the contents from Assignment5-matchingServiceEnvironmentVariables.txt into this .env file.

```bash
cd backend/matching_service

docker build -t peerprep/matching_service .

docker run --env-file ./.env -p 6006:6006 peerprep/matching_service
```

Step 4: Run frontend.

Create a .env file in the `frontend` directory, then copy and paste the contents from Assignment5-frontendServiceEnvironmentVariables.txt into this .env file.

```bash
cd frontend

npm install --prefix .

npm run dev
```