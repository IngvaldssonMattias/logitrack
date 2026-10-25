import argon2 from "argon2";

import { db } from "../../../../db";
import { UserService } from "../users.service";

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

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([
          {
            id: "user-123",
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

    const user = await UserService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword!123",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.role).toBe("USER");
  });

  it("should store a hashed password instead of the original password", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    let insertedPasswordHash = "";

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockImplementation((data) => {
        insertedPasswordHash = data.passwordHash;

        return {
          returning: jest.fn().mockResolvedValue([
            {
              id: "user-123",
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

    const password = "SecurePassword!123";

    const user = await UserService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password,
    });

    expect(insertedPasswordHash).toBeDefined();
    expect(insertedPasswordHash).not.toBe(password);
    expect(insertedPasswordHash).toMatch(/^\$argon2/);

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      password,
    );

    expect(passwordMatches).toBe(true);
  });

  it("should always create new users with the USER role", async () => {
    jest.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

    let insertedRole = "";

    jest.mocked(db.insert).mockReturnValue({
      values: jest.fn().mockImplementation((data) => {
        insertedRole = data.role;

        return {
          returning: jest.fn().mockResolvedValue([
            {
              id: "user-123",
              name: "John Doe",
              email: "john@example.com",
              passwordHash: data.passwordHash,
              role: data.role,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]),
        };
      }),
    } as never);

    await UserService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword!123",
    });

    expect(insertedRole).toBe("USER");
  });

  it("should throw AppError when email already exists", async () => {
    const existingUser = {
      id: "existing-user",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "existing-hash",
      role: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.mocked(db.query.users.findFirst).mockResolvedValue(existingUser);

    await expect(
      UserService.createUser({
        name: "Jane Doe",
        email: "john@example.com",
        password: "SecurePassword!123",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Email already exists",
    });
  });
});