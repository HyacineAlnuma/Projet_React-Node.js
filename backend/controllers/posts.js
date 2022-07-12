const db = require('../db');

exports.getAllPosts = (req, res, next) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
};

exports.getOnePost = (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
};

exports.createPost = (req, res, next) => {
    let postObject = req.body;
    res.send(postObject);
    // let sql = `INSERT INTO `posts` (`userId`, `textpost`, `imageUrl`, `likes`) VALUES (`${postObject.userId}`, `${postObject.textpost}`, `${postObject.imageUrl}`, `0`)`';
    // let query = db.query(sql, (err, result) => {
    //     if (err) throw err;
    //     console.log(result);
    //     res.send(result);
    // })
}

exports.updatePost = (req, res, next) => {
    let sql = 'UPDATE `posts` SET '
};

exports.deletePost = (req, res, next) => {

};

exports.likePost = (req, res, next) => {

};