import request from "supertest";
import mongoose from "mongoose";
import app from "../../../../app";
import { Shipment } from "../../models/shipments.model";
import { afterEach } from "node:test";
import { ShipmentService } from "../../services/shipments.service";

describe("Shipment API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  });

  afterEach(async () => {
    await Shipment.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all shipments", async () => {
    await Shipment.create({
      trackingNumber: "API200001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    await Shipment.create({
      trackingNumber: "API200002",
      senderAddress: "Malmö, Sweden",
      destinationAddress: "Uppsala, Sweden",
      weightInKg: 5,
      estimatedDelivery: new Date("2026-08-26"),
    });

    const response = await request(app).get("/api/v1/shipments");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.shipments).toHaveLength(2);
  });

  it("should get a shipment by id", async () => {
    const createdShipment = await Shipment.create({
      trackingNumber: "API300001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 12.5,
      estimatedDelivery: new Date("2026-08-25"),
    });

    const response = await request(app).get(
      `/api/v1/shipments/${createdShipment._id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.shipment).toBeDefined();
    expect(response.body.data.shipment.trackingNumber).toBe("API300001");
    expect(response.body.data.shipment.weightInKg).toBe(12.5);
  });

  it("should return 404 when shipment is not found", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(app).get(
      `/api/v1/shipments/${nonExistingId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Shipment not found");
  });

  it("should update a shipment", async () => {
    const createdShipment = await Shipment.create({
      trackingNumber: "API400001",
      senderAddress: "Stockholm, Sweden",
      destinationAddress: "Gothenburg, Sweden",
      weightInKg: 10,
      estimatedDelivery: new Date("2026-08-25"),
    });

    const response = await request(app)
      .patch(`/api/v1/shipments/${createdShipment._id}`)
      .send({
        weightInKg: 15,
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.shipment).toBeDefined();
    expect(response.body.data.shipment.weightInKg).toBe(15);
    expect(response.body.data.shipment.trackingNumber).toBe("API400001");
  });

  it("should return 4oo when updating with invalid data", async () => {
    const createdShipment = await Shipment.create({
       trackingNumber: "API400002",
        senderAddress: "Stockholm, Sweden",
        destinationAddress: "Gothenburg, Sweden",
        weightInKg: 10,
        estimatedDelivery: new Date("2026-08-25"), 
    });

    const response = await request(app)
    .patch(`/api/v1/shipments/${createdShipment._id} `)
    .send({
        weightInKg: -5,
    });

    expect(response.status).toBe(400)
    expect(response.body.status).toBe("fail");
  });

  it("should delete a shipment", async () => {
    const createdShipment = await Shipment.create({
        trackingNumber: "API500001",
        senderAddress: "Stockholm, Sweden",
        destinationAddress: "Gothenburg, Sweden",
        weightInKg: 10,
        estimatedDelivery: new Date("2026-08-25"),
    });

    const response = await request(app)
    .delete(`/api/v1/shipments/${createdShipment._id} `);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Shipment deleted successfully");

    const deletedShipment = await Shipment.findById(createdShipment._id);

    expect(deletedShipment).toBeNull();
  });

  it("should return 404 when deleting a shipment that does not exist", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(app)
    .delete(`/api/v1/shipments/${nonExistingId}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Shipment not found");
  });
});
