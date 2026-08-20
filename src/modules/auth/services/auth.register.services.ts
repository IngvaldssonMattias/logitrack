import argon2 from "argon2";
import { User } from "../../users/models/users.models";
import { RegisterInput } from "../schemas/auth.schemas";
import { AppError } from "../../../core/errors/AppError";


export const register = async (data: RegisterInput) => {
const existingUser = await User.findOne({
email: data.email,
});

if (existingUser) {
throw new AppError("Email is already registered", 409);
}

const passwordHash = await argon2.hash(data.password);

const user = await User.create({
name: data.name,
email: data.email,
passwordHash,
role: "USER",
});

return user;
};