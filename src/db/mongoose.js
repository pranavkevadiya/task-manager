const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL
const mongoPort = process.env.MONGO_PORT


mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })