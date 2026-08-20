import { registerSchema } from "../auth.schemas";

describe("registerSchema", () => {
  it("should accept valid registration data", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123!",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should normalize the email to lowercase", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "JOHN@EXAMPLE.COM",
        password: "SecurePassword123!",
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.body.email).toBe("john@example.com");
    }
  });

  it("should reject a password shorter than 12 characters", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "Short1!",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password without an uppercase letter", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword123!",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password without a lowercase letter", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SECUREPASSWORD123!",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password without a number", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword!",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject a password without a special character", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject an invalid email", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "John Doe",
        email: "not-an-email",
        password: "SecurePassword123!",
      },
    });

    expect(result.success).toBe(false);
  });

  it("should reject a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "J",
        email: "john@example.com",
        password: "SecurePassword123!",
      },
    });

    expect(result.success).toBe(false);
  });
});