import { Router } from "express";
import { validateRequest } from "../core/middleware/validateRequest";
import { createShipmentSchema } from "../modules/shipments/shipments.schema";
import { createShipmentHandler, getShipmentHandler } from "../modules/shipments/shipments.controller";

const router = Router();

router.post("/", validateRequest(createShipmentSchema), createShipmentHandler);
router.post("/", getShipmentHandler);

export default router
