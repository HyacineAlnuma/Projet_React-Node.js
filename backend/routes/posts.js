const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

module.exports = router;