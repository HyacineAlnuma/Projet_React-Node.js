const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', postsCtrl.getAllPosts);
router.get('/:id', postsCtrl.getOnePost);
router.post('/', postsCtrl.createPost);
router.put('/:id', postsCtrl.updatePost);
router.delete('/:id', postsCtrl.deletePost);
router.post('/:id', postsCtrl.likePost);

module.exports = router;