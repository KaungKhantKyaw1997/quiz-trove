const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const errorHandler = require("./utils/errorHandler");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const port = 5001;

const app = express();

app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz Trove",
      version: "1.0.0",
      description: "API documentation for Quiz Trove",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://quiz-trove.onrender.com"
            : `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/quizzes", questionRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
