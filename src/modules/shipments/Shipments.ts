import { Schema, model, Document } from 'mongoose';

export interface IShipment extends Document {
  trackingNumber: string;
  status: 'In Transit' | 'Delayed' | 'Delivered';
  destinationCity: string;
  estimatedDelivery: Date;
  weightInKg: number;
}

const shipmentSchema = new Schema<IShipment>({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true, enum: ['In Transit', 'Delayed', 'Delivered'] },
  destinationCity: { type: String, required: true },
  estimatedDelivery: { type: Date, required: true },
  weightInKg: { type: Number, required: true }
}, { timestamps: true });

export const Shipment = model<IShipment>('Shipment', shipmentSchema);