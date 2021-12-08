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
        geometry: { type: "Point", coordinates: [req.body.longitude, req.body.latitude] },
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

//get data
//Get Persons
router.get('/getDeviceData', verifyApiKey, (req, res, next) => {
    if (!req.query.deviceId) {
        return res.status(400).json({ success: false, msg: "No device id found" });
    }
    AirqData.find({ deviceId: req.query.deviceId }).then((currentDeviceData) => {
        if (!currentDeviceData) {
            console.log(err)
            return res.status(500).json({ success: false, msg: "No data found" });
        }

        res.json({ success: true, data: currentDeviceData });
    });
});

router.get('/getLocationData', verifyApiKey, (req, res, next) => {
    if (!req.query.lat || !req.query.lng) {
        return res.status(400).json({ success: false, msg: "Invalid latitude or longitude" });
    }
    AirqData.aggregate([{
        $geoNear: {
            near: {
                type: 'Point',
                coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
            },
            spherical: true,
            maxDistance: 100000,
            distanceField: "dist.calculated"
        }
    }]).then(function (results) {
        res.json({ success: true, data: results });
    })

});



module.exports = router;