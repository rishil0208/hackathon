const express = require('express');
const subscriberController = require('../controllers/subscriberController');

const router = express.Router();

router.post('/subscribe', subscriberController.addSubscriber);

module.exports = router;
