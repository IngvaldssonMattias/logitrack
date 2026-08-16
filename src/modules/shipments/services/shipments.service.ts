import mongoose from "mongoose";
import { CreateShipmentInput, updateShipmentInput } from "../schemas/shipments.schema";
import { Shipment } from "../models/shipments.model";

export class ShipmentService {
  static async createShipment(data: CreateShipmentInput) {
    return await Shipment.create(data);
  }

  static async getAllShipment() {
    return await Shipment.find();
  }

  static async getShipmentById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }
    return await Shipment.findById(id);
  }

  static async updateShipment(id: string, data: updateShipmentInput) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await Shipment.findByIdAndUpdate(
      id,
      data,
      { 
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  static async deleteShipment(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return null;
    }

    return await Shipment.findByIdAndDelete(id);
  }
}