import { Router } from "express";

import {
  createShipmentHandler,
  getShipmentHandler,
  getShipmentByIdHandler,
  updateShipmentHandler,
  deleteShipmentHandler,
} from "../controller/shipments.controller";

import {
  createShipmentSchema,
  shipmentIdSchema,
  updateShipmentRequestSchema,
} from "../schemas/shipments.schema";

import { validateRequest } from "../../../core/middleware/validateRequest";

const router = Router();

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
  "/:id",
  validateRequest(updateShipmentRequestSchema),
  updateShipmentHandler,
);

router.delete(
  "/:id",
  validateRequest(shipmentIdSchema),
  deleteShipmentHandler,
);

export default router;