import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { Shipment } from './models/Shipment';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();

app.get('/api/v1/shipments', async (req: Request, res: Response): Promise<void> => {
    try {
        const shipments = await Shipment.find({});
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({message: "Server Error", error});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});