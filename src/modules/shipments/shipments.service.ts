import { CreateShipmentInput } from './shipments.schema';
import { Shipment } from './Shipments';

export class ShipmentService {
  static async createShipment(data: CreateShipmentInput) {
    return await Shipment.create({
      ...data,
      status: 'PENDING',
    });
  }

  static async getAllShipments() {
    return await Shipment.find();
  }
}