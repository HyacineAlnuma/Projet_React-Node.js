const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', postsCtrl.getAllPosts);
router.get('/:id', postsCtrl.getOnePost);
router.post('/', multer, postsCtrl.createPost);
router.put('/:id', multer, postsCtrl.updatePost);
router.delete('/:id', postsCtrl.deletePost);
router.post('/:id/like', postsCtrl.likePost);
router.post('/:id/comment', postsCtrl.commentPost);

module.exports = router;