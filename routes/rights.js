var express = require('express');
var router = express.Router();
var rights = require('../controllers/rightsControllers')
router.get('/', rights.getRights)

module.exports = router;
