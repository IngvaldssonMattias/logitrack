import { CreateShipmentInput } from "../schemas/shipments.schema";
import { Shipment } from "../models/shipments.model";

export class ShipmentService {
  static async createShipment(data: CreateShipmentInput) {
    return await Shipment.create(data);
  }

  static async getAllShipment() {
    return await Shipment.find();
  }
}