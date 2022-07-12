const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', postsCtrl.getAllPosts);
router.post('/', postsCtrl.createPost);

module.exports = router;