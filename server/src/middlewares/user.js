import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;
export const userMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    if (!token) {
        res.status(403).json({
            message: "Unauthorized"
        })
        return
    }
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }
}