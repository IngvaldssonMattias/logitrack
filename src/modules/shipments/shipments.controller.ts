import { Request, Response, NextFunction } from "express";
import { ShipmentService } from "./shipments.service";

export const createShipmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shipment = await ShipmentService.createShipment(req.body);
        return res.status(201).json({stattus: "success", data: { shipment } });
    } catch (error) {
        return next(error);
    }
};

export const getShipmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shipments = await ShipmentService.getAllShipments();
        return res.status(200).json({ status: "success", data: { shipments } });
    } catch (error) {
        return next(error);
    }
};