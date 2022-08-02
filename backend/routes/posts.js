const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', postsCtrl.getAllPosts);
router.get('/:id', postsCtrl.getOnePost);
router.post('/', multer, postsCtrl.createPost);
router.put('/:id', auth, multer, postsCtrl.updatePost);
router.delete('/:id', auth, postsCtrl.deletePost);
router.post('/:id/like', auth, postsCtrl.likePost);
router.post('/:id/comment', auth, postsCtrl.commentPost);
router.delete('/:id/comment', auth, postsCtrl.deleteComment);
router.put('/:id/comment', auth, postsCtrl.updateComment);

module.exports = router;