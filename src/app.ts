import  express from "express";
import cors from "cors";
import helmet from "helmet";
import shipmentRoutes from "./modules/shipments/routes/shipments.routes";
import { errorHandler } from "./core/middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// API Modules
app.use("/api/v1/shipments", shipmentRoutes);

// Global error handler
app.use(errorHandler);

export default app;
