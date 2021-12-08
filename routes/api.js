const router = require('express').Router();
const verifyApiKey = require('../middlewares/verify-apikey');



router.get('/', (req, res, next) => {

    res.send("Check documentation for endpoints");
});





module.exports = router;