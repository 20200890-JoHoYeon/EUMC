var express = require('express');
var router = express.Router();

router.get('/', (req, res) => res.end('200 OK'));

module.exports = router;
