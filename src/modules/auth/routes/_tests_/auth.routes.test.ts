import request from "supertest";
import app from "../../../../app";
import { User } from "../../../users/models/users.models";

describe("POST /auth/register", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123!",
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      status: "success",
      data: {
        user: {
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
        },
      },
    });

    expect(response.body.data.user.passwordHash).toBeUndefined();
  });
});