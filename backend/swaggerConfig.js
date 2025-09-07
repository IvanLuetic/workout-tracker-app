import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Workout Tracker API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            userGuid: { type: "string" },
            email: { type: "string", format: "email" },
            username: { type: "string" },
            isAdmin: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        WorkoutTemplate: {
          type: "object",
          properties: {
            templateGuid: { type: "string" },
            userGuid: { type: "string" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            TemplateExercises: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TemplateExercise",
              },
            },
          },
        },
        TemplateExercise: {
          type: "object",
          properties: {
            exerciseGuid: { type: "string" },
            templateGuid: { type: "string" },
            name: { type: "string" },
            exercise_order: { type: "integer" },
          },
        },
        WorkoutSession: {
          type: "object",
          properties: {
            sessionGuid: { type: "string" },
            userGuid: { type: "string" },
            date: { type: "string", format: "date-time" },
            notes: { type: "string" },
            templateName: { type: "string" },
            templateGuid: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            SessionExercises: {
              type: "array",
              items: {
                $ref: "#/components/schemas/SessionExercise",
              },
            },
          },
        },
        SessionExercise: {
          type: "object",
          properties: {
            exerciseGuid: { type: "string" },
            sessionGuid: { type: "string" },
            name: { type: "string" },
            exercise_number: { type: "integer" },
            SessionSets: {
              type: "array",
              items: {
                $ref: "#/components/schemas/SessionSet",
              },
            },
          },
        },
        SessionSet: {
          type: "object",
          properties: {
            setGuid: { type: "string" },
            sessionExerciseGuid: { type: "string" },
            weight: { type: "number" },
            reps: { type: "integer" },
            rir: { type: "integer" },
            set_number: { type: "integer" },
            notes: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const specs = swaggerJSDoc(options);
export default specs;
