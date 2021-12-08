const router = require('express').Router();
const verifyApiKey = require('../middlewares/verify-apikey');
const AirqData = require('../models/airq_data');


router.get('/', (req, res, next) => {

    res.send("Check documentation for endpoints");
});

//Add data
router.post('/newData', verifyApiKey, (req, res, next) => {
    if (!req.body.qualityIndex || !req.body.deviceId || !req.body.latitude || !req.body.longitude || !req.body.timestamp) {
        return res.status(400).json({ success: false, msg: "Some parameters are missing.  Check documentation" });

    }
    const currIndex = req.body.qualityIndex
    var safety = "";
    var colorCode = "";
    if (currIndex > 300) {
        safety = "Hazardous"
        colorCode = "Maroon"
    } else if (currIndex > 200) {
        safety = "Very Unhealthy	"
        colorCode = "Purple"
    } else if (currIndex > 150) {
        safety = "Unhealthy"
        colorCode = "Red"
    } else if (currIndex > 100) {
        safety = "Unhealthy for Sensitive Groups"
        colorCode = "Orange"
    } else if (currIndex > 50) {
        safety = "Moderate"
        colorCode = "Yellow"
    } else if (currIndex > 0) {
        safety = "Good"
        colorCode = "Green"
    } else {
        return res.status(400).json({ success: false, msg: "Invalid air quality index" });
    }
    const newAirqData = new AirqData({
        qualityIndex: req.body.qualityIndex,
        deviceId: req.body.deviceId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        timestamp: req.body.timestamp,
        safety: safety,
        colorCode: colorCode
    });
    newAirqData.save().then((newData) => {
        console.log("New data added");

        return res.status(200).json({
            success: true,
            data: newData
        });
    });





});



module.exports = router;