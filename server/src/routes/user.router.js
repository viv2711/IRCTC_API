import express, { Router } from "express";
import { userMiddleware } from "../middlewares/user.js";
import client from '../../db/src/index.js'
import { BookTicketSchema, checkSeatSchema} from "../types/index.js";

const userRouter = Router();
userRouter.use(express.json());
export default userRouter;
userRouter.use(userMiddleware);

/**
Get Seat Availability
Create an endpoint for the users where they can enter the source and destination and fetch all the trains between that route with their
availabilities
**/

userRouter.get('/getTrains', async (req, res) => {
    const parsedData = checkSeatSchema.safeParse(req.body);
    //console.log(parsedData)
    const { sourceStationName, destinationStationName } = parsedData.data;
    try {
        const trains = await client.train.findMany({
            where: {
                sourceStation: sourceStationName,
                destinationStation: destinationStationName,
            },
            select: {
                name: true,
                availableSeats: true,
            }
        })
        //console.log("trains", trains)
        res.status(200).json({
            trains: trains
        });
    } catch (error) {
        console.error('Error fetching trains:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// book tickets
userRouter.post('/bookTickets', async (req, res) => {
    const parsedData = BookTicketSchema.safeParse(req.body);
    const { sourceStationName, destinationStationName, date } = parsedData.data;

    try {
        // console.log("trainId", trains[index].id)
        let booking = await client.$transaction(async (tx) => {
            const trains = await client.train.findMany({
                where: {
                    sourceStation: sourceStationName,
                    destinationStation: destinationStationName,
                },
                select: {
                    name: true,
                    availableSeats: true,
                    id: true
                }
            })
            if (trains.length === 0) {
                return res.status(404).json({ error: "No trains available" })
            }
            let index = -1;
            for (const train of trains) {
                if (train.availableSeats > 0) {
                    index = trains.indexOf(train);
                    break;
                }
            }
            if (index === -1) {
                return res.status(404).json({ error: "All seats are full" })
            }
            const trainID = trains[0].id
            const train = await tx.$queryRaw`SELECT * FROM "Train" WHERE id=${trainID}`;
            const seatNo = train[0].availableSeats - 1;
            const booking = await tx.booking.create({
                data: {
                    userId: req.userId,
                    trainId: trains[index].id,
                    date: new Date(date),
                    status: "CONFIRMED",
                    seatNumber: seatNo,
                }
            })
            await tx.train.update({
                where: {
                    id: trains[index].id
                },
                data: {
                    availableSeats: seatNo
                }
            })

            return booking;
        })
        res.status(200).json({
            bookingId: booking
        })
    }
    catch (error) {
        console.log(error)
    }
})

//get specific booking details
userRouter.get('/getBookingDetails', async (req, res) => {
    const userId = req.userId;
    try {
        const user = await client.user.findUnique({
            where: {
                id: userId
            },
            select:{
                bookings: true
            }
        })
        console.log("user", user)
        res.status(200).json({
            bookings: user.bookings
        })
    } catch (error) {
        console.log(error)
    }
})

