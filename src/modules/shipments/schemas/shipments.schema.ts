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

export const updateShipmentSchema = z.object({
    body: z.object({
        senderAddress: z
        .string()
        .min(1, "Sender address is required")
        .optional(),

        destinationAddress: z
        .string()
        .min(1, "Destination address is required")
        .optional(),

        weightInKg: z
        .number()
        .positive("Weight must be greater than 0")
        .optional(),

        estimatedDelivery: z.coerce.date({
            message: "Estimated delivery must be a valid date",
        }).optional(),

        status: z
        .enum(["PENDING", "IN_TRANSIT", "DELAYED", "DELIVERED"])
        .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required to update a shipment",
        }
    ),
});

export type updateShipmentInput = z.infer<
typeof updateShipmentSchema
>["body"];

export type CreateShipmentInput = z.infer<
    typeof createShipmentSchema
>["body"];