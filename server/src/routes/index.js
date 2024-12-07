import express from 'express'
import bcrypt from 'bcrypt'
import { SignupSchema, SigninSchema } from '../types/index.js';
import client from '../../db/src/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import adminRouter from './admin.route.js'
import userRouter from './user.router.js';
dotenv.config()
export const router = express.Router()
const jwt_secret = process.env.JWT_SECRET;
const api_key = process.env.ADMIN_SECRET_API;

router.post('/signup', async (req, res) => {
    const parseData = SignupSchema.safeParse(req.body);
    console.log(parseData)
    if (!parseData.success) {
        res.status(400).json({
            message: "Validation Failed",
        })
        return
    }
    const hashedPassword = bcrypt.hashSync(parseData.data.password, 10);
    try {
        const user = await client.user.create({
            data: {
                username: parseData.data.username,
                password: hashedPassword,
                role: parseData.data.type === 'admin' ? 'ADMIN' : 'USER'
            }
        })
        res.json({
            userId: user.id
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "User already in use" })
    }
})

router.post('/signin', async (req, res) => {
    const parseData = SigninSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(403).json({
            message: "Validation Failed",
        })
        return
    }
    try {
        const user = await client.user.findUnique({
            where: {
                username: parseData.data.username
            }
        })
        if (!user) {
            res.status(403).json({ message: "User not found" })
            return
        }
        const isValid = await bcrypt.compare(parseData.data.password, user.password);
        if (!isValid) {
            res.status(403).json({ message: "Wrong Password" })
            return
        }
        //creating a jwt token for user
        if (user.role === 'USER') {
            const token = jwt.sign({ userId: user.id, role: user.role }, jwt_secret)
            res.json({
                token: token
            })
        }
        //creating separate jwt for admin
        if(user.role === 'ADMIN'){
            const token = jwt.sign({ userId: user.id, role: user.role }, api_key)
            res.json({
                token: token
            })
        }

    } catch (error) {
        res.status(403).json({ message: "Internal Server Error" })
    }
})

router.use('/admin', adminRouter)
router.use('/user', userRouter)