import bcrypt from "bcrypt";
import { User } from "../models/users.models";
import { AppError } from "../../../core/errors/AppError";
import { CreateUserInput } from "../schemas/users.schema";

const SALT_ROUNDS = 12;

export class UserService {
    static async createUser(data: CreateUserInput) {
        const existingUser = await User.findOne({
            email: data.email,
        });

        if(existingUser) {
            throw new AppError("Email already exists", 409);
        }

        const passwordHash = await bcrypt.hash(
            data.password,
            SALT_ROUNDS,
        );

        const user = await User.create({
            name: data.name,
            email: data.email,
            passwordHash,
            role: "USER",
        });

        return user;
    }
}