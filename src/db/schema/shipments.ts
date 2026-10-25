import {
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "ARRIVED_AT_FACILITY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "CANCELLED",
]);

export const shipments = pgTable(
  "shipments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    trackingNumber: text("tracking_number").notNull().unique(),

    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    status: shipmentStatusEnum("status")
      .notNull()
      .default("CREATED"),

    senderAddress: text("sender_address").notNull(),

    destinationAddress: text("destination_address").notNull(),

    weightInKg: numeric("weight_in_kg", { precision: 10, scale: 2, }).notNull(),

    estimatedDelivery: timestamp("estimated_delivery", {
      withTimezone: true,
    }).notNull(),

    description: text("description"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    createdByUserIdIndex: index(
      "shipments_created_by_user_id_idx",
    ).on(table.createdByUserId),

    statusIndex: index("shipments_status_idx").on(table.status),

    estimatedDeliveryIndex: index(
      "shipments_estimated_delivery_idx",
    ).on(table.estimatedDelivery),
  }),
);