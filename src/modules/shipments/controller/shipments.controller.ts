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
    next: NextFunction
): Promise<void> => {
    try {
        const shipment = await ShipmentService.getShipmentById(req.params.id);

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
    next: NextFunction
): Promise<void> => {
    try {
        const shipment = await ShipmentService.updateShipment(
            req.params.id,
            req.body
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
  next: NextFunction
): Promise<void> => {
  try {
    const shipment = await ShipmentService.deleteShipment(req.params.id);

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