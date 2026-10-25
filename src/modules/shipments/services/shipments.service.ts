import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { shipments } from "../../../db/schema";
import { AppError } from "../../../core/errors/AppError";
import {
  CreateShipmentInput,
  updateShipmentInput,
} from "../schemas/shipments.schema";

export class ShipmentService {
  static async createShipment(
    data: CreateShipmentInput,
    createdByUserId: string,
  ) {
    const existingShipment = await db.query.shipments.findFirst({
      where: eq(shipments.trackingNumber, data.trackingNumber),
    });

    if (existingShipment) {
      throw new AppError("Tracking number already exists", 409);
    }

    const [shipment] = await db
      .insert(shipments)
      .values({
        trackingNumber: data.trackingNumber,
        createdByUserId,
        senderAddress: data.senderAddress,
        destinationAddress: data.destinationAddress,
        weightInKg: data.weightInKg.toString(),
        estimatedDelivery: data.estimatedDelivery,
        description: data.description,
        status: "CREATED",
      })
      .returning();

    return shipment;
  }

  static async getAllShipment(
  userId: string,
  role: "USER" | "ADMIN",
) {
  if (role === "ADMIN") {
    return await db
      .select()
      .from(shipments);
  }

  return await db
    .select()
    .from(shipments)
    .where(eq(shipments.createdByUserId, userId));
}

  static async getShipmentById(id: string) {
    const shipment = await db.query.shipments.findFirst({
      where: eq(shipments.id, id),
    });

    if (!shipment) {
      throw new AppError("Shipment not found", 404);
    }

    return shipment;
  }

  static async updateShipment(
    id: string,
    data: updateShipmentInput,
  ) {
    const existingShipment = await db.query.shipments.findFirst({
      where: eq(shipments.id, id),
    });

    if (!existingShipment) {
      throw new AppError("Shipment not found", 404);
    }

    const [shipment] = await db
      .update(shipments)
      .set({
        ...data,
        weightInKg:
          data.weightInKg !== undefined
            ? data.weightInKg.toString()
            : undefined,
        updatedAt: new Date(),
      })
      .where(eq(shipments.id, id))
      .returning();

    return shipment;
  }

  static async deleteShipment(id: string) {
    const existingShipment = await db.query.shipments.findFirst({
      where: eq(shipments.id, id),
    });

    if (!existingShipment) {
      throw new AppError("Shipment not found", 404);
    }

    const [shipment] = await db
      .delete(shipments)
      .where(eq(shipments.id, id))
      .returning();

    return shipment;
  }
}