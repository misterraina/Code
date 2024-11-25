import dotenv from 'dotenv'
import connectDb from './db/index.js'
import app from './app.js'

dotenv.config()

const port = process.env.port || 3000;

connectDb()

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
