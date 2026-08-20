import mongoose from "mongoose";
import { CreateShipmentInput, updateShipmentInput } from "../schemas/shipments.schema";
import { Shipment } from "../models/shipments.model";
import { AppError } from "../../../core/errors/AppError";

export class ShipmentService {
  static async createShipment(data: CreateShipmentInput) {
    return await Shipment.create(data);
  }

  static async getAllShipment() {
    return await Shipment.find();
  }

  static async getShipmentById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid shipment ID", 400);
    }

    const shipment = await Shipment.findById(id);

    if (!shipment) {
      throw new AppError("Shipment not found", 404);
    }

    return shipment;
  }

  static async updateShipment(id: string, data: updateShipmentInput) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid shipment ID", 400);
    }

    const shipment = await Shipment.findByIdAndUpdate(
      id,
      data,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!shipment) {
      throw new AppError("Shipment not found", 404);
    }

    return shipment;
  }

  static async deleteShipment(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Invalid shipment ID", 400);
    }

    const shipment = await Shipment.findByIdAndDelete(id);

    if (!shipment) {
      throw new AppError("Shipment not found", 404);
    }

    return shipment;
  }
}

