export type ShipmentStatus = 
| "PENDING"
| "IN_TRANSIT"
| "DELAYED"
| "DELIVERED";

export interface ShipmentData {
    trackingNumber: string;
    status: ShipmentStatus;
    senderAddress: string;
    destinationAddress: string;
    weightInKg: number;
    estimatedDelivery: Date;
}