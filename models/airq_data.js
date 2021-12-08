const mongoose = require('mongoose')

const Schema = mongoose.Schema

const airqSchema = new Schema({
    qualityIndex: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },

    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    safety: {
        type: String,
        required: true
    }
})

const AirqData = mongoose.model('airqdata', airqSchema)

module.exports = AirqData