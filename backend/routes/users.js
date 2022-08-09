const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');
const multer = require('../middlewares/multer-config');

router.post('/signup', multer, usersCtrl.signup);
router.post('/login', usersCtrl.login);

module.exports = router;