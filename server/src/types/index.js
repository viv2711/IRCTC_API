import z from 'zod'

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(["user", "admin"]),
});

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export const AddTrainSchema = z.object({
    trainName: z.string(),
    sourceStationName: z.string(),
    destinationStationName: z.string(),
    totalSeats: z.number().positive(),
    availableSeats: z.number().positive(),
});

export const checkSeatSchema = z.object({
    sourceStationName: z.string(),
    destinationStationName: z.string(),
    //travelDate: z.string().datetime(),
})

export const BookTicketSchema = z.object({
    sourceStationName: z.string(),
    destinationStationName: z.string(),
    date: z.string().datetime()
})

