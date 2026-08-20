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
      _id: "123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER" as const,
      passwordHash: "hashed-password",
    };

    const safeUser = {
      _id: "123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER" as const,
    };

    jest.spyOn(LoginService, "login").mockResolvedValue({
      toObject: () => user,
    } as never);

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
        user: safeUser,
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
      _id: "123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER" as const,
      passwordHash: "hashed-password",
    };

    const safeUser = {
      _id: "123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER" as const,
    };

    jest.spyOn(RegisterService, "register").mockResolvedValue({
      toObject: () => user,
    } as never);

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
        user: safeUser,
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
