import { z } from "zod";

export const createShipmentSchema = z.object({
    body: z.object({
        trackingNumber: z
            .string()
            .min(6, "Tracking number must be at least 6 characters"),

        senderAddress: z
            .string()
            .min(1, "Sender address is required"),

        destinationAddress: z
            .string()
            .min(1, "Destination address is required"),

        weightInKg: z
            .number()
            .positive("Weight must be greater than 0"),

        estimatedDelivery: z.coerce.date({
            message: "Estimated delivery must be a valid date",
        }),
    }),
});

export type CreateShipmentInput = z.infer<
    typeof createShipmentSchema
>["body"];