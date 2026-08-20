import argon2 from "argon2";
import { User } from "../../../users/models/users.models";
import { login } from "../auth.login.services";

describe("login", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should login a user with valid credentials", async () => {
    const password = "SecurePassword123!";
    const passwordHash = await argon2.hash(password);

    const user = {
      _id: "123",
      name: "John Doe",
      email: "john@example.com",
      passwordHash,
      role: "USER" as const,
    };

    const select = jest.fn().mockResolvedValue(user);

    jest.spyOn(User, "findOne").mockReturnValue({
      select,
    } as never);

    const result = await login({
      email: "john@example.com",
      password,
    });

    expect(result).toBe(user);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john@example.com",
    });

    expect(select).toHaveBeenCalledWith("+passwordHash");
  });

  it("should throw 401 when user does not exist", async () => {
    const select = jest.fn().mockResolvedValue(null);

    jest.spyOn(User, "findOne").mockReturnValue({
      select,
    } as never);

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
      _id: "123",
      name: "John Doe",
      email: "[john@example.com](mailto:john@example.com)",
      passwordHash: "stored-password-hash",
      role: "USER" as const,
    };

    const select = jest.fn().mockResolvedValue(user);

    jest.spyOn(User, "findOne").mockReturnValue({
      select,
    } as never);

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
      _id: "123",
      name: "John Doe",
      email: "[john@example.com](mailto:john@example.com)",
      passwordHash: "stored-password-hash",
      role: "USER" as const,
    };

    const select = jest.fn().mockResolvedValue(user);

    jest.spyOn(User, "findOne").mockReturnValue({
      select,
    } as never);

    jest.spyOn(argon2, "verify").mockResolvedValue(true);

    await login({
      email: "john@example.com",
      password: "SecurePassword123!",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john@example.com",
    });
  });

  it("should verify the password with Argon2", async () => {
    const user = {
      _id: "123",
      name: "John Doe",
      email: "[john@example.com](mailto:john@example.com)",
      passwordHash: "stored-password-hash",
      role: "USER" as const,
    };

    const select = jest.fn().mockResolvedValue(user);

    jest.spyOn(User, "findOne").mockReturnValue({
      select,
    } as never);

    const verify = jest.spyOn(argon2, "verify").mockResolvedValue(true);

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
