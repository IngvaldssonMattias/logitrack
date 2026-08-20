import argon2 from "argon2";
import { User } from "../../users/models/users.models";
import { LoginInput } from "../schemas/auth.schemas";
import { AppError } from "../../../core/errors/AppError";

export const login = async (data: LoginInput) => {
const user = await User.findOne({
email: data.email,
}).select("+passwordHash");

if (!user) {
throw new AppError("Invalid email or password", 401);
}

const isPasswordValid = await argon2.verify(
user.passwordHash,
data.password,
);

if (!isPasswordValid) {
throw new AppError("Invalid email or password", 401);
}

return user;
};