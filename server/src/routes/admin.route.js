import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.js";
import client from '../../db/src/index.js'
import { AddTrainSchema } from "../types/index.js";
const adminRouter = Router();
export default adminRouter;
adminRouter.use(adminMiddleware);
adminRouter.post('/addTrain', async (req, res) => {
    // Validation for the incoming data
    const parsedData = AddTrainSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: 'Validation failed' });
    }
    const { trainName, sourceStationName, destinationStationName, totalSeats, availableSeats } = parsedData.data;
    try {
        // Create the new train
        const newTrain = await client.train.create({
            data: {
                name: trainName,
                totalSeats,
                availableSeats,
                sourceStation: sourceStationName,
                destinationStation: destinationStationName
            }
        });
        console.log("new train", newTrain)
        // Respond with the newly created train
        res.status(201).json({ trainId: newTrain.id });
    } catch (error) {
        console.error('Error adding train:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
