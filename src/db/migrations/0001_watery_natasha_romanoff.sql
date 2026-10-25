CREATE TYPE "public"."shipment_status" AS ENUM('CREATED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED_AT_FACILITY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELAYED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_number" text NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"status" "shipment_status" DEFAULT 'CREATED' NOT NULL,
	"sender_address" text NOT NULL,
	"destination_address" text NOT NULL,
	"weight_in_kg" numeric(10, 2) NOT NULL,
	"estimated_delivery" timestamp with time zone NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shipments_created_by_user_id_idx" ON "shipments" USING btree ("created_by_user_id");--> statement-breakpoint
CREATE INDEX "shipments_status_idx" ON "shipments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "shipments_estimated_delivery_idx" ON "shipments" USING btree ("estimated_delivery");