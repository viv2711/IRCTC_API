import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/index.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
})

app.use('/irctc/api', router)

