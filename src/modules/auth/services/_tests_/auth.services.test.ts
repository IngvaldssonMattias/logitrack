import argon2 from "argon2";
import { register } from "../auth.register.services";
import { User } from "../../../users/models/users.models";


  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should register a new user", async () => {
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
    const password = "SecurePassword123!";

    const user = await register({
      name: "John Doe",
      email: "john@example.com",
      password,
    });

    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBe(password);
    expect(user.passwordHash).toMatch(/^\$argon2/);

    const isValidPassword = await argon2.verify(
      user.passwordHash,
      password,
    );

    expect(isValidPassword).toBe(true);
  });

  it("should not store the plain text password", async () => {
    const password = "SecurePassword123!";

    const user = await register({
      name: "John Doe",
      email: "john@example.com",
      password,
    });

    const storedUser = await User.findById(user._id).select("+passwordHash");

    expect(storedUser).toBeDefined();
    expect(storedUser?.passwordHash).not.toBe(password);
  });

  it("should reject an already registered email", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123!",
    };

    await register(userData);

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
    const user = await register({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123!",
    });

    expect(user.role).toBe("USER");
  });