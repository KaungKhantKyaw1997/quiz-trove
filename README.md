# QuizTrove

QuizTrove is an online quiz application that allows users to create quizzes, add questions, and test their knowledge.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KaungKhantKyaw1997/quiz-trove.git
   cd quiz-trove
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB URI, JWT secret, token expiration time, and Node environment.

### Running the Application

To start the server, run:

```bash
npm start
```

### API Documentation

The API is documented using **Swagger**. You can access the documentation at:

```bash
http://localhost:5001/api-docs
```

### API Endpoints

**User Authentication**

- **Register a new user**
  - `POST /api/v1/auth/register`
- **Log in a user**
  - `POST /api/v1/auth/login`
- **Update user information**
  - `PUT /api/v1/auth/users/me`
- **Delete a user**
  - `DELETE /api/v1/auth/users/me`

**Quizzes**

- **Create a new quiz**
  - `POST /api/v1/quizzes`
- **Get all quizzes**
  - `GET /api/v1/quizzes`
- **Get a quiz by ID**
  - `GET /api/v1/quizzes/{id}`
- **Update a quiz**
  - `PUT /api/v1/quizzes/{id}`
- **Delete a quiz**
  - `DELETE /api/v1/quizzes/{id}`

**Questions**

- **Add a question to a quiz**
  - `POST /api/v1/quizzes/{quizId}/questions`
- **Get all questions of a quiz**
  - `GET /api/v1/quizzes/{quizId}/questions?page={page}&limit={limit}`
- **Update a question in a quiz**
  - `PUT /api/v1/quizzes/{quizId}/questions/{questionId}`
- **Delete a question from a quiz**
  - `DELETE /api/v1/quizzes/{quizId}/questions/{questionId}`
