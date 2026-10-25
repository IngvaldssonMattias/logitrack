import { Router } from "express";
import { createShipmentHandler, getShipmentHandler, getShipmentByIdHandler, updateShipmentHandler, deleteShipmentHandler, } from "../controller/shipments.controller";
import { createShipmentSchema, shipmentIdSchema, updateShipmentRequestSchema } from "../schemas/shipments.schema";
import { validateRequest } from "../../../core/middleware/validateRequest";
import { authenticate, requireRole } from "../../auth/middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validateRequest(createShipmentSchema),
  createShipmentHandler,
);

router.get("/", getShipmentHandler);

router.get(
  "/:id",
  validateRequest(shipmentIdSchema),
  getShipmentByIdHandler,
);

router.patch(
  "/:id", requireRole("ADMIN"),
  validateRequest(updateShipmentRequestSchema),
  updateShipmentHandler,
);

router.delete(
  "/:id", requireRole("ADMIN"), validateRequest(shipmentIdSchema),
  deleteShipmentHandler,
);

export default router;