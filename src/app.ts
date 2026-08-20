import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import shipmentRoutes from "./modules/shipments/routes/shipments.routes";
import { errorHandler } from "./core/middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";



const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Modules
app.use("/api/v1/shipments", shipmentRoutes);

// API Modules
app.use("/api/v1/shipments", shipmentRoutes);

// Global error handler
app.use(errorHandler);

export default app;
