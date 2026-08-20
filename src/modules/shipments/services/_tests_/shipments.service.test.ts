import mongoose from "mongoose";
import { ShipmentService } from "../shipments.service";
import { Shipment } from "../../models/shipments.model";

describe("ShipmentService", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  });

  beforeEach(async () => {
    await Shipment.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a shipment", async () => {
    const shipment = await ShipmentService.createShipment({
      trackingNumber: "TEST123456",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    expect(shipment).toBeDefined();
    expect(shipment.trackingNumber).toBe("TEST123456");
    expect(shipment.senderAddress).toBe("Stockholm, Sweden");
    expect(shipment.destinationAddress).toBe("Gothenburg, Sweden");
    expect(shipment.weightInKg).toBe(10);
    expect(shipment.status).toBe("PENDING");
  });

  it("should get all shipments", async () => {
    await ShipmentService.createShipment({
      trackingNumber: "TEST100001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    await ShipmentService.createShipment({
      trackingNumber: "TEST100002",
      senderAddress: "Malmö, Sweden",
      destinationAddress: "Uppsala, Sweden",
      weightInKg: 5,
      estimatedDelivery: new Date("2026-08-26"),
    });

    const shipments = await ShipmentService.getAllShipment();

    expect(shipments).toHaveLength(2);
    expect(shipments[0].trackingNumber).toBe("TEST100001");
    expect(shipments[1].trackingNumber).toBe("TEST100002");
  });

  it("should get a shipment by id", async () => {
    const createShipment = await ShipmentService.createShipment({
      trackingNumber: "TEST200001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    const shipment = await ShipmentService.getShipmentById(
      createShipment._id.toString(),
    );

    expect(shipment).toBeDefined();
    expect(shipment?.trackingNumber).toBe("TEST200001");
    expect(shipment?.senderAddress).toBe("Stockholm, Sweden");
    expect(shipment?.destinationAddress).toBe("Gothenburg, Sweden");
  });

  it("should throw AppError for an invalid shipment id", async () => {
    await expect(ShipmentService.getShipmentById("abc")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid shipment ID",
    });
  });

  it("should update a shipment", async () => {
    const createShipment = await ShipmentService.createShipment({
      trackingNumber: "TEST300001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    const updatedShipment = await ShipmentService.updateShipment(
      createShipment._id.toString(),
      {
        weightInKg: 15,
      },
    );

    expect(updatedShipment).toBeDefined();
    expect(updatedShipment?.weightInKg).toBe(15);
    expect(updatedShipment?.trackingNumber).toBe("TEST300001");
  });

  it("should throw AppError when updating with an invalid shipment id", async () => {
    await expect(
      ShipmentService.updateShipment("abc", {
        weightInKg: 15,
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid shipment ID",
    });
  });

  it("should delete a shipment", async () => {
    const createdShipment = await ShipmentService.createShipment({
      trackingNumber: "TEST400001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    const deletedShipment = await ShipmentService.deleteShipment(
      createdShipment._id.toString(),
    );

    expect(deletedShipment).toBeDefined();
    expect(deletedShipment?.trackingNumber).toBe("TEST400001");

    await expect(
      ShipmentService.getShipmentById(createdShipment._id.toString()),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Shipment not found",
    });
  });

  it("should throw AppError when deleting with an invalid shipment id", async () => {
    await expect(ShipmentService.deleteShipment("abc")).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid shipment ID",
    });
  });

  it("should throw AppError when updating a shipment that does not exist", async () => {
    const validId = new mongoose.Types.ObjectId().toString();

    await expect(
      ShipmentService.updateShipment(validId, {
        weightInKg: 15,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Shipment not found",
    });
  });

  it("should throw AppError when deleting a shipment that does not exits", async () => {
    const validId = new mongoose.Types.ObjectId().toString();

    await expect(
      ShipmentService.deleteShipment(validId),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Shipment not found",
    });
  });
  
});
