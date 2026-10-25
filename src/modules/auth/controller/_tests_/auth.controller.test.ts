import { Request, Response } from "express";
import { registerHandler, loginHandler } from "../auth.controller";
import * as RegisterService from "../../services/auth.register.services";
import * as LoginService from "../../services/auth.login.services";

describe("AuthController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should login a user and return 200", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER" as const,
      passwordHash: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const accessToken = "access-token";
    const refreshToken = "refresh-token";

    jest.spyOn(LoginService, "login").mockResolvedValue({
      user,
      accessToken,
      refreshToken,
    });

    const req = {
      body: {
        email: "john@example.com",
        password: "SecurePassword123!",
      },
    } as Request;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as unknown as Response;

    const next = jest.fn();

    await loginHandler(req, res, next);

    expect(LoginService.login).toHaveBeenCalledWith(req.body);
    expect(status).toHaveBeenCalledWith(200);

    expect(json).toHaveBeenCalledWith({
      status: "success",
      data: {
        user: {
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass login service errors to next", async () => {
    const error = Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });

    jest.spyOn(LoginService, "login").mockRejectedValue(error);

    const req = {
      body: {
        email: "john@example.com",
        password: "WrongPassword123!",
      },
    } as Request;

    const res = {} as Response;
    const next = jest.fn();

    await loginHandler(req, res, next);

    expect(LoginService.login).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should register a user and return 201", async () => {
    const user = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER" as const,
      passwordHash: "hashed-password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(RegisterService, "register").mockResolvedValue(user);

    const req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123!",
      },
    } as Request;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as unknown as Response;

    const next = jest.fn();

    await registerHandler(req, res, next);

    expect(RegisterService.register).toHaveBeenCalledWith(req.body);
    expect(status).toHaveBeenCalledWith(201);

    expect(json).toHaveBeenCalledWith({
      status: "success",
      data: {
        user: {
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should pass service errors to next", async () => {
    const error = new Error("Database failure");

    jest.spyOn(RegisterService, "register").mockRejectedValue(error);

    const req = {
      body: {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123!",
      },
    } as Request;

    const res = {} as Response;
    const next = jest.fn();

    await registerHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});