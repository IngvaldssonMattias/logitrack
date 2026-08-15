import  express from "express";
import cors from "cors";
import helmet from "helmet";
import shipmentRoutes from "./routes/shipments.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// API Modules
app.use("/api/v1/shipments", shipmentRoutes);

export default app;
