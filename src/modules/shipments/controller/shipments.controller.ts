import { Request, Response, NextFunction } from "express";
import {
  CreateShipmentInput,
  updateShipmentInput,
} from "../schemas/shipments.schema";
import { ShipmentService } from "../services/shipments.service";

export const createShipmentHandler = async (
  req: Request<unknown, unknown, CreateShipmentInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "fail",
        message: "Authentication required",
      });

      return;
    }

    const shipment = await ShipmentService.createShipment(
      req.body,
      req.user.userId,
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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: "fail",
        message: "Authentication required",
      });

      return;
    }

    const shipments = await ShipmentService.getAllShipment(
      req.user.userId,
      req.user.role,
    );

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
    const shipment = await ShipmentService.getShipmentById(
      req.params.id,
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

export const updateShipmentHandler = async (
  req: Request<
    { id: string },
    unknown,
    updateShipmentInput
  >,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const shipment = await ShipmentService.updateShipment(
      req.params.id,
      req.body,
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
      req.params.id,
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