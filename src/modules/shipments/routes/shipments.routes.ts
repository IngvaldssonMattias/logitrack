import { Router } from "express";
import { createShipmentHandler, getShipmentHandler } from "../controller/shipments.controller";
import { validateRequest } from "../../../core/middleware/validateRequest";
import { createShipmentSchema } from "../schemas/shipments.schema";

const router = Router();

router.post("/", validateRequest(createShipmentSchema), createShipmentHandler);

router.get("/", getShipmentHandler);

export default router;