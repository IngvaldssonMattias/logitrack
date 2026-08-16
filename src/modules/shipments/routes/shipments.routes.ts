import { Router } from "express";
import { createShipmentHandler, getShipmentHandler, getShipmentByIdHandler } from "../controller/shipments.controller";
import { validateRequest } from "../../../core/middleware/validateRequest";
import { createShipmentSchema } from "../schemas/shipments.schema";

const router = Router();

router.post("/", validateRequest(createShipmentSchema), createShipmentHandler);

router.get("/", getShipmentHandler);
router.get("/:id", getShipmentByIdHandler);

export default router;