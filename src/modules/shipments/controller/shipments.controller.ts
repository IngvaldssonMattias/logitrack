import { Request, Response, NextFunction } from "express";
import { ShipmentService } from "../services/shipments.service";
import { CreateShipmentInput, updateShipmentInput } from "../schemas/shipments.schema";

export const createShipmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipment = await ShipmentService.createShipment(
      req.validated!.body as CreateShipmentInput,
    );

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

    res.status(200).json({
      status: "success",
      data: {
        shipments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getShipmentByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipment = await ShipmentService.getShipmentById( req.validated!.params!.id, );

    if (!shipment) {
      res.status(404).json({
        status: "fail",
        message: "Shipment not found",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        shipment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateShipmentHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipment = await ShipmentService.updateShipment(
      (req.validated!.params as { id: string }).id,
      req.validated!.body as updateShipmentInput,
    );

    if (!shipment) {
      res.status(404).json({
        status: "fail",
        message: "Shipment not found",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        shipment,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShipmentHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipment = await ShipmentService.deleteShipment(
      (req.validated!.params as { id: string }).id,
    );

    if (!shipment) {
      res.status(404).json({
        status: "fail",
        message: "Shipment not found",
      });

      return;
    }

    res.status(200).json({
      status: "success",
      message: "Shipment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
