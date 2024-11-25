import express from 'express'
import authRouter from './routes/authRoute.js'
import ProtectedRoute from './routes/protectedRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/protected', ProtectedRoute);

export default app