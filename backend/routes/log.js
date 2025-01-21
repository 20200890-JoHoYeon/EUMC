var express = require('express');
var router = express.Router();

router.post('/deptArrive', (req, res) => res.end('200 OK'));
router.post('/exception-notification-kiosk', (req, res) => res.end('200 OK'));
router.post('/numberTicket', (req, res) => res.end('200 OK'));
router.post('/payment', (req, res) => res.end('200 OK'));
router.post('/tcp-connection', (req, res) => res.end('200 OK'));
router.post('/paymentAlimtalk', (req, res) => res.end('200 OK'));

router.get('*', (req, res) => res.status(404).end());

module.exports = router;
