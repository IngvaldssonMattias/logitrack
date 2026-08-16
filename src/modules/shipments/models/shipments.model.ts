import { Schema, model, Document } from 'mongoose';
import { ShipmentStatus } from '../types/shipments.types';

export interface iShipment extends Document {
  trackingNumber: string;
  status: ShipmentStatus;
  senderAddress: string;
  destinationAddress: string;
  weightInKg: number;
  estimatedDelivery: Date;
}

const shipmentSchema = new Schema<iShipment>(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["PENDING", "IN_TRANSIT", "DELAYED", "DELIVERED"],
      default: "PENDING",
    },

    senderAddress: {
      type: String,
      required: true,
    },

    destinationAddress: {
      type: String,
      required: true,
    },

    weightInKg: {
      type: Number,
      required: true,
    },

    estimatedDelivery: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Shipment = model<iShipment>("Shipment", shipmentSchema);