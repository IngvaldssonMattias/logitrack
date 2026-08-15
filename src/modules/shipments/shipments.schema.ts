import { create } from "domain";
import { z } from "zod";

export const createShipmentSchema = z.object({
  body: z.object({
    trackingNumber: z.string().min(6, "Trackingnumber is required"),
    senderAddress: z.string().min(1, "Receiver address is needed"),
    destinationAddress: z.string().min(1, "Destination address is needed"),
    weightInKg: z.number().positive("Weight needs to be heavier than 0"),
  }),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>["body"];