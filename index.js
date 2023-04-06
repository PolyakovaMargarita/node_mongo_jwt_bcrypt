require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const router = require("./routers/index")
const PORT = process.env.PORT || 8000

const app = express()
const DB_URL = `mongodb+srv://snowingSnake:7yzaQmwteF2BOn62@cluster0.fazqyip.mongodb.net/auth_jwt_crypto?retryWrites=true&w=majority`

app.use(express.json())
app.use("/", router)

const start = async () => {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`Server start on PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()