import request from "supertest";
import app from "../../../../app";
import { ShipmentService } from "../../services/shipments.service";

jest.mock("../../../auth/middleware/authMiddleware", () => ({
  authenticate: (
    req: { user?: { userId: string; role: "USER" | "ADMIN" } },
    _res: unknown,
    next: () => void,
  ) => {
    req.user = {
      userId: "user-123",
      role: "USER",
    };

    next();
  },

  requireRole: () => {
    return (
      _req: unknown,
      _res: unknown,
      next: () => void,
    ) => {
      next();
    };
  },
}));

jest.mock("../../services/shipments.service", () => ({
  ShipmentService: {
    createShipment: jest.fn(),
    getAllShipment: jest.fn(),
    getShipmentById: jest.fn(),
    updateShipment: jest.fn(),
    deleteShipment: jest.fn(),
  },
}));

describe("ShipmentController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/shipments", () => {
    it("should create a shipment", async () => {
      jest.mocked(ShipmentService.createShipment).mockResolvedValue({
        id: "shipment-123",
        trackingNumber: "LT123456",
        createdByUserId: "user-123",
        status: "CREATED",
        senderAddress: "Stockholm",
        destinationAddress: "Gothenburg",
        weightInKg: "2.50",
        estimatedDelivery: new Date("2026-09-01"),
        description: "Test shipment",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post("/api/v1/shipments")
        .send({
          trackingNumber: "LT123456",
          senderAddress: "Stockholm",
          destinationAddress: "Gothenburg",
          weightInKg: 2.5,
          estimatedDelivery: "2026-09-01",
          description: "Test shipment",
        });

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        status: "success",
        data: {
          shipment: {
            id: "shipment-123",
            trackingNumber: "LT123456",
            createdByUserId: "user-123",
            status: "CREATED",
          },
        },
      });

      expect(ShipmentService.createShipment).toHaveBeenCalledWith(
        expect.objectContaining({
          trackingNumber: "LT123456",
          senderAddress: "Stockholm",
          destinationAddress: "Gothenburg",
          weightInKg: 2.5,
          description: "Test shipment",
        }),
        "user-123",
      );
    });
  });
});