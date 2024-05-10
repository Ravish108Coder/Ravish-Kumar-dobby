import express from 'express'
export const app = express()
import cookieParser from 'cookie-parser';
import cors from "cors"
import dotenv from 'dotenv'
dotenv.config()
import userRoutes from './routes/user.route.js'
import imageRoutes from './routes/image.route.js'

app.use(
    cors({
      origin: process.env.FRONTEND_URI,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use(express.json()); // use for parsing application/json
app.use(express.urlencoded({ extended: true })); // use for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // use for parsing cookies

app.use('/api/user', userRoutes)
app.use('/api/image', imageRoutes)

app.get('/', (req, res) => {
    res.send('Hello World')
})
app.get('/bolo', (req, res) => {
    res.send('Bolo World')
})