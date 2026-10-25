import argon2 from "argon2";

import { db } from "../../../../db";
import { login } from "../auth.login.services";
import { AppError } from "../../../../core/errors/AppError";

jest.mock("../../../../db", () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
  },
}));

jest.mock("../../../../core/utils/jwt", () => ({
  signAccessToken: jest.fn(() => "mock-access-token"),
}));

jest.mock("../auth.refreshToken.services", () => ({
  createRefreshToken: jest.fn(() => "mock-refresh-token"),
}));

describe("login", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("should login a user with valid credentials", async () => {
    const password = "SecurePassword123!";
    const passwordHash = await argon2.hash(password);

    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      passwordHash,
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .mocked(db.query.users.findFirst)
      .mockResolvedValue(user);

    const result = await login({
      email: "john@example.com",
      password,
    });

    expect(result.user).toEqual(user);
    expect(result.accessToken).toBe("mock-access-token");
    expect(result.refreshToken).toBe("mock-refresh-token");
  });

  it("should throw 401 when user does not exist", async () => {
    jest
      .mocked(db.query.users.findFirst)
      .mockResolvedValue(undefined);

    await expect(
      login({
        email: "unknown@example.com",
        password: "SecurePassword123!",
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });
  });

  it("should throw 401 when password is incorrect", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "stored-password-hash",
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .mocked(db.query.users.findFirst)
      .mockResolvedValue(user);

    jest.spyOn(argon2, "verify").mockResolvedValue(false);

    await expect(
      login({
        email: "john@example.com",
        password: "WrongPassword123!",
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });

    expect(argon2.verify).toHaveBeenCalledWith(
      user.passwordHash,
      "WrongPassword123!",
    );
  });

  it("should find the user by email", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "stored-password-hash",
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .mocked(db.query.users.findFirst)
      .mockResolvedValue(user);

    jest.spyOn(argon2, "verify").mockResolvedValue(true);

    await login({
      email: "john@example.com",
      password: "SecurePassword123!",
    });

    expect(db.query.users.findFirst).toHaveBeenCalledTimes(1);
  });

  it("should verify the password with Argon2", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "stored-password-hash",
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .mocked(db.query.users.findFirst)
      .mockResolvedValue(user);

    const verify = jest
      .spyOn(argon2, "verify")
      .mockResolvedValue(true);

    await login({
      email: "john@example.com",
      password: "SecurePassword123!",
    });

    expect(verify).toHaveBeenCalledWith(
      user.passwordHash,
      "SecurePassword123!",
    );
  });
});