import { z } from "zod";

const shipmentStatusSchema = z.enum([
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED_AT_FACILITY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "CANCELLED",
]);

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

    description: z
      .string()
      .max(1000, "Description must be at most 1000 characters")
      .optional(),
  }),
});

export const updateShipmentSchema = z.object({
  body: z
    .object({
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

      estimatedDelivery: z.coerce
        .date({
          message: "Estimated delivery must be a valid date",
        })
        .optional(),

      description: z
        .string()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),

      status: shipmentStatusSchema.optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required to update a shipment",
      },
    ),
});

export const shipmentIdSchema = z.object({
  params: z.object({
    id: z.uuid("Shipment id must be a valid UUID"),
  }),
});

export const updateShipmentRequestSchema = z.object({
  params: z.object({
    id: z.uuid("Shipment id must be a valid UUID"),
  }),

  body: updateShipmentSchema.shape.body,
});

export type CreateShipmentInput = z.infer<
  typeof createShipmentSchema
>["body"];

export type updateShipmentInput = z.infer<
  typeof updateShipmentSchema
>["body"];

export type UpdateShipmentRequestInput = z.infer<
  typeof updateShipmentRequestSchema
>;