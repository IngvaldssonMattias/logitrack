import request from "supertest";

import app from "../../../../app";
import { db } from "../../../../db";

jest.mock("../../../../db", () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(),
  },
}));

describe("POST /auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    const insertReturning = jest.fn().mockResolvedValue([
      {
        id: "123",
        name: "John Doe",
        email: "john@example.com",
        passwordHash: "hashed-password",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: insertReturning,
      }),
    } as never);

    const response = await request(app)
      .post("/api/v1/auth/register")
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