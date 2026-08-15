import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async () => {
    await connectDB();


    app.listen(env.PORT, () => {
        console.log(`logitrack API is running on port ${env.PORT} in ${env.NODE_ENV}-mode`);
    });
};

startServer();