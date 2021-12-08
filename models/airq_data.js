const mongoose = require('mongoose')

const Schema = mongoose.Schema
const GeoSchema = new Schema({
    type: {
        type: String,
        default: "Point"

    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});

const airqSchema = new Schema({
    qualityIndex: {
        type: Number,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },

    geometry: GeoSchema,
    safety: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    colorCode: {
        type: String,
        required: true
    }
})

const AirqData = mongoose.model('airqdata', airqSchema)

module.exports = AirqData