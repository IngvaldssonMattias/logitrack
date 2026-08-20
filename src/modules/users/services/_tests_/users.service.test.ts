import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { UserService } from "../users.service";
import { User } from "../../models/users.models";

describe("UserService", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a user", async () => {
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
    const password = "SecurePassword!123";

    const user = await UserService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password,
    });

    expect(user.passwordHash).not.toBe(password);
    expect(user.passwordHash).toBeDefined();

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    expect(passwordMatches).toBe(true);
  });

  it("should always create new users with the USER role", async () => {
    const user = await UserService.createUser({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword!123",
    });

    expect(user.role).toBe("USER");
  });

  it("should throw AppError when email already exists", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword!123",
    };

    await UserService.createUser(userData);

    await expect(
      UserService.createUser({
        ...userData,
        name: "Jane Doe",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Email already exists",
    });
  });
});