import { Router } from "express";
import { createShipmentHandler, getShipmentHandler, getShipmentByIdHandler, updateShipmentHandler } from "../controller/shipments.controller";
import { validateRequest } from "../../../core/middleware/validateRequest";
import { createShipmentSchema, updateShipmentSchema } from "../schemas/shipments.schema";

const router = Router();

router.post("/", validateRequest(createShipmentSchema), createShipmentHandler);

router.get("/", getShipmentHandler);
router.get("/:id", getShipmentByIdHandler);

router.patch("/:id", validateRequest(updateShipmentSchema), updateShipmentHandler);

export default router;