import { Request, Response, NextFunction } from "express";
import { ShipmentService } from "../services/shipments.service";

export const createShipmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipment = await ShipmentService.createShipment(req.body);

    res.status(201).json({
      status: "success",
      data: {
        shipment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getShipmentHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipments = await ShipmentService.getAllShipment();

    res.status(201).json({
      status: "success",
      data: {
        shipments,
      },
    });
  } catch (error) {
    next(error);
  }
};
