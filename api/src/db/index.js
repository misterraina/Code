import mongoose from 'mongoose'

async function connectDb(uri) {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.mongodbUri}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('Error connecting MongoDb', error)
        process.exit(1)
    }
}

export default connectDb