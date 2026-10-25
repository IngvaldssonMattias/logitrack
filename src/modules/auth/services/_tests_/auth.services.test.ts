import argon2 from "argon2";

import { db } from "../../../../db";
import { register } from "../auth.register.services";

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

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([
          {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            passwordHash: "hashed-password",
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      }),
    } as never);

    const user = await register({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123!",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.role).toBe("USER");
  });

  it("should hash the password", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    let insertedPasswordHash = "";

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockImplementation((data) => {
        insertedPasswordHash = data.passwordHash;

        return {
          returning: jest.fn().mockResolvedValue([
            {
              id: "123",
              name: "John Doe",
              email: "john@example.com",
              passwordHash: data.passwordHash,
              role: "USER",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        };
      }),
    } as never);

    const password = "SecurePassword123!";

    const user = await register({
      name: "John Doe",
      email: "john@example.com",
      password,
    });

    expect(insertedPasswordHash).toBeDefined();
    expect(insertedPasswordHash).not.toBe(password);
    expect(insertedPasswordHash).toMatch(/^\$argon2/);

    const isValidPassword = await argon2.verify(
      user.passwordHash,
      password,
    );

    expect(isValidPassword).toBe(true);
  });

  it("should not store the plain text password", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    let insertedPasswordHash = "";

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockImplementation((data) => {
        insertedPasswordHash = data.passwordHash;

        return {
          returning: jest.fn().mockResolvedValue([
            {
              id: "123",
              name: "John Doe",
              email: "john@example.com",
              passwordHash: data.passwordHash,
              role: "USER",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        };
      }),
    } as never);

    const password = "SecurePassword123!";

    await register({
      name: "John Doe",
      email: "john@example.com",
      password,
    });

    expect(insertedPasswordHash).toBeDefined();
    expect(insertedPasswordHash).not.toBe(password);
  });

  it("should reject an already registered email", async () => {
    const existingUser = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "existing-hash",
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(db.query.users.findFirst).mockResolvedValue(existingUser);

    await expect(
      register({
        name: "Jane Doe",
        email: "john@example.com",
        password: "AnotherSecure123!",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Email is already registered",
    });
  });

  it("should always assign the USER role", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    let insertedRole = "";

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockImplementation((data) => {
        insertedRole = data.role;

        return {
          returning: jest.fn().mockResolvedValue([
            {
              id: "123",
              name: "John Doe",
              email: "john@example.com",
              passwordHash: "hashed-password",
              role: data.role,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        };
      }),
    } as never);

    await register({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123!",
    });

    expect(insertedRole).toBe("USER");
  });
});