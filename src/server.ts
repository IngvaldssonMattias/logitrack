import app from "./app";
import { env } from "./config/env";


const startServer = async (): Promise<void> => {
    try {

        app.listen(Number(env.PORT), () => {
            console.log(
                `LogiTrack API is running on port ${env.PORT} in ${env.NODE_ENV}-mode`
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

void startServer();