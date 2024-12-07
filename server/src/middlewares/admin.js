import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const api_key = process.env.ADMIN_SECRET_API;
export const adminMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if (!token) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }
    try {
        const decoded = jwt.verify(token, api_key);
        if (decoded.role !== 'ADMIN') {
            console.log("Admin verification failed")
            res.status(403).json({
                message: "Unauthorized"
            })
            return
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

}