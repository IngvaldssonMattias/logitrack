import { db } from "../../../../db";
import { ShipmentService } from "../shipments.service";

jest.mock("../../../../db", () => ({
  db: {
    query: {
      shipments: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("ShipmentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createShipment", () => {
    it("should create a shipment", async () => {
      jest.mocked(db.query.shipments.findFirst).mockResolvedValue(undefined);

      jest.mocked(db.insert).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
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
            },
          ]),
        }),
      } as never);

      const shipment = await ShipmentService.createShipment(
        {
          trackingNumber: "LT123456",
          senderAddress: "Stockholm",
          destinationAddress: "Gothenburg",
          weightInKg: 2.5,
          estimatedDelivery: new Date("2026-09-01"),
          description: "Test shipment",
        },
        "user-123",
      );

      expect(shipment).toBeDefined();
      expect(shipment.id).toBe("shipment-123");
      expect(shipment.trackingNumber).toBe("LT123456");
      expect(shipment.createdByUserId).toBe("user-123");
      expect(shipment.status).toBe("CREATED");
    });

    it("should reject a duplicate tracking number", async () => {
      jest.mocked(db.query.shipments.findFirst).mockResolvedValue({
        id: "existing-shipment",
        trackingNumber: "LT123456",
        createdByUserId: "user-123",
        status: "CREATED",
        senderAddress: "Stockholm",
        destinationAddress: "Gothenburg",
        weightInKg: "2.50",
        estimatedDelivery: new Date("2026-09-01"),
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        ShipmentService.createShipment(
          {
            trackingNumber: "LT123456",
            senderAddress: "Stockholm",
            destinationAddress: "Gothenburg",
            weightInKg: 2.5,
            estimatedDelivery: new Date("2026-09-01"),
          },
          "user-123",
        ),
      ).rejects.toMatchObject({
        statusCode: 409,
        message: "Tracking number already exists",
      });
    });
  });

  describe("getAllShipment", () => {
    it("should return only the user's shipments when the user is a USER", async () => {
      const userShipments = [
        {
          id: "shipment-123",
          trackingNumber: "LT123456",
          createdByUserId: "user-123",
          status: "CREATED",
          senderAddress: "Stockholm",
          destinationAddress: "Gothenburg",
          weightInKg: "2.50",
          estimatedDelivery: new Date("2026-09-01"),
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const where = jest.fn().mockResolvedValue(userShipments);
      const from = jest.fn().mockReturnValue({
        where,
      });

      jest.mocked(db.select).mockReturnValue({
        from,
      } as never);

      const result = await ShipmentService.getAllShipment(
        "user-123",
        "USER",
      );

      expect(result).toEqual(userShipments);
      expect(where).toHaveBeenCalledTimes(1);
    });

    it("should return all shipments when the user is an ADMIN", async () => {
      const allShipments = [
        {
          id: "shipment-123",
          trackingNumber: "LT123456",
          createdByUserId: "user-123",
          status: "CREATED",
          senderAddress: "Stockholm",
          destinationAddress: "Gothenburg",
          weightInKg: "2.50",
          estimatedDelivery: new Date("2026-09-01"),
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "shipment-456",
          trackingNumber: "LT654321",
          createdByUserId: "user-456",
          status: "IN_TRANSIT",
          senderAddress: "Malmö",
          destinationAddress: "Uppsala",
          weightInKg: "5.00",
          estimatedDelivery: new Date("2026-09-03"),
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const from = jest.fn().mockResolvedValue(allShipments);

      jest.mocked(db.select).mockReturnValue({
        from,
      } as never);

      const result = await ShipmentService.getAllShipment(
        "admin-123",
        "ADMIN",
      );

      expect(result).toEqual(allShipments);
      expect(from).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when the user has no shipments", async () => {
      const where = jest.fn().mockResolvedValue([]);
      const from = jest.fn().mockReturnValue({
        where,
      });

      jest.mocked(db.select).mockReturnValue({
        from,
      } as never);

      const result = await ShipmentService.getAllShipment(
        "user-999",
        "USER",
      );

      expect(result).toEqual([]);
      expect(where).toHaveBeenCalledTimes(1);
    });
  });

  describe("getShipmentById", () => {
    it("should return a shipment by id", async () => {
      jest.mocked(db.query.shipments.findFirst).mockResolvedValue({
        id: "shipment-123",
        trackingNumber: "LT123456",
        createdByUserId: "user-123",
        status: "CREATED",
        senderAddress: "Stockholm",
        destinationAddress: "Gothenburg",
        weightInKg: "2.50",
        estimatedDelivery: new Date("2026-09-01"),
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const shipment = await ShipmentService.getShipmentById(
        "shipment-123",
      );

      expect(shipment.id).toBe("shipment-123");
      expect(shipment.trackingNumber).toBe("LT123456");
    });

    it("should throw when shipment does not exist", async () => {
      jest.mocked(db.query.shipments.findFirst).mockResolvedValue(undefined);

      await expect(
        ShipmentService.getShipmentById("missing-shipment"),
      ).rejects.toMatchObject({
        statusCode: 404,
        message: "Shipment not found",
      });
    });
  });

  describe("deleteShipment", () => {
    it("should delete a shipment", async () => {
      jest.mocked(db.query.shipments.findFirst).mockResolvedValue({
        id: "shipment-123",
        trackingNumber: "LT123456",
        createdByUserId: "user-123",
        status: "CREATED",
        senderAddress: "Stockholm",
        destinationAddress: "Gothenburg",
        weightInKg: "2.50",
        estimatedDelivery: new Date("2026-09-01"),
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.mocked(db.delete).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: "shipment-123",
            },
          ]),
        }),
      } as never);

      const shipment = await ShipmentService.deleteShipment(
        "shipment-123",
      );

      expect(shipment.id).toBe("shipment-123");
    });
  });
});