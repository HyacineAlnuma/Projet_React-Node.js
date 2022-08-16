const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/signup', multer, usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.put('/modify', multer, usersCtrl.modifyProfile);

module.exports = router;