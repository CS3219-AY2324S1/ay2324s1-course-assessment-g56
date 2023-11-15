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

Files relevant for Assignment 2

User profile management:

  Frontend:
    Read, update, delete for user data
    - Form for user data: frontend\src\componenets\form
    - Hook for obtaining user data: frontend\src\hooks\useUserData.ts
    - Handles view when deleting account: frontend\src\components\modal\AccountDeletionModal.tsx
    - Calls the API endpoint for deletion: frontend\src\app\auth\delete\route.ts
    Create user data:
     - New accounts are created by Supabase in the backend, onboarding process gives users ability to configure their profile upon first login
     - On boarding page: frontend\src\app\onboarding\page.tsx
     - On boarding form: frontend\src\components\form\OnboardingForm.tsx
     - Update profile during on boarding: frontend\src\components\form\OnboardingProfileForm.tsx

  Backend:

- API endpoint for frontend to interact with: backend\user_service\src\app.ts

  Notes:

- New accounts are created by Supabase in the backend, onboarding process gives users ability to configure their profile upon first login

Question service:

  Frontend

- Calls the function for creating question: frontend\src\hooks\useCreateQuestionMutation.ts
- Calls the function for deleting question: frontend\src\hooks\useDeleteQuestionMutation.ts
- Calls the function for updating question: frontend\src\hooks\useUpdateQuestionMutation.ts
- Calls the function for getting all the questions: frontend\src\hooks\useQuestionListData.ts
- Contains functiosn that call the API endpoint for performing CRUD on the question_service: frontend\src\lib\questions.ts
- Page with list of questions obtained in table form: frontend\src\app\home\page.tsx

  Backend

- API endpoint for frontend to interact with: backend\question_service\src\app.ts
