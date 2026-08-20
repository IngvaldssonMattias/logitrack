import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "LogiTrack API",
      version: "1.0.0",
      description: "API for managing shipments",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
  },

  apis: [
    "./src/modules/shipments/docs/*.ts",
  ],

  failOnErrors: true,
};

export const swaggerSpec = swaggerJSDoc(options)