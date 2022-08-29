const db = require('../db-config');
const fs = require('fs');

exports.getAllPosts = (req, res, next) => {
    let sql = 'SELECT p.*, u.email, u.username, u.pictureUrl FROM posts p INNER JOIN users u ON p.userId = u.id ORDER BY p.id DESC';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(201).json({ results });
    });
};

exports.getOnePost = (req, res, next) => {
    let sql = `SELECT p.*, u.email, u.username, u.pictureUrl FROM posts p INNER JOIN users u ON p.userId = u.id WHERE p.id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.status(201).json({ result })
    });
};

exports.createPost = (req, res, next) => {
    const file = req.files ? req.files[0] : undefined;
    const postObject = file ?
    {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`
    } : {...req.body};
    if (!file && postObject.textpost == null) {
        res.status(400).json({ message: 'Il faut au moins une image ou du texte pour créer un post', action: 0 });
    } else {
        let sql = `INSERT INTO posts (userId, textpost, imageUrl, likes) VALUES (?, ?, ?, '0')`;
        db.query(sql, [postObject.userId, postObject.textpost, postObject.imageUrl], (err, result) => {
            if (err) throw err;
            res.status(201).json({ message: 'Post enregistré !', action: 1 })
        });
    }
};

exports.updatePost = (req, res, next) => {
    const file = req.files ? req.files[0] : undefined;
    const postObject = file ?
    {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`
    } : {...req.body};
    let sql = `SELECT * FROM posts WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.status(404).json({ message: 'Post inexistant !', action: 0 });
        }
        if (result[0].userId !== req.auth.userId && req.body.userRole !== "admin") {
            res.status(403).json({ message: 'Requête non authorisée !', action: 0 });
        } 
        if (!file) {
            sql = `UPDATE posts SET textpost = ? WHERE id = ?`;
            db.query(sql, [postObject.textpost, req.params.id], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post modifié !', action: 1 })
            })
        }
        if (!file && postObject.textpost == null) {
            res.status(400).json({ message: 'Il faut au moins une image ou du texte pour modifier un post', action: 0 });
        } else {
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql = `UPDATE posts SET textpost = ?, imageUrl = ? WHERE id = ?`;
                db.query(sql, [postObject.textpost, postObject.imageUrl, req.params.id], (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post modifié !', action: 1 })
                });
            });
        }
    });
};

exports.deletePost = (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (!result) {
            res.status(404).json({ error: new Error('Post inexistant !') });
        }
        if (result[0].userId !== req.auth.userId && req.body.userRole !== "admin") {
            res.status(403).json({ message: 'Requête non authorisée !', action: 0 });
        } 
        if (result[0].imageUrl !== null && result[0].imageUrl != "undefined") {
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql = `DELETE FROM posts WHERE id = ?`;
                db.query(sql, [req.params.id], (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post supprimé !', action: 1 })
                });
            });
        } else {
            sql = `DELETE FROM posts WHERE id = ?`;
            db.query(sql, [req.params.id], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post supprimé !', action: 1 })
            });
        }
    });
};

exports.likePost = (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.status(404).json({ error: new Error('Post inexistant !') });
        } 
        sql = `SELECT * FROM likes WHERE userId = ? AND postId = ?`;
        db.query(sql, [req.body.userId, result[0].id], (err, response) => {
            if (err) throw err;
            if (response.length > 0) {
                sql = `DELETE FROM likes WHERE id = ?`;
                db.query(sql, [response[0].id], (err, resp) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post disliké !', action: 1});
                })
            } else {
            sql = `INSERT INTO likes (userId, postId) VALUES (?, ?)`;
            db.query(sql, [req.body.userId ,result[0].id], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post liké !', action: 1});
            })
            }
        })
    })
};

exports.getPostComments = (req, res, next) => {
    let sql = 'SELECT c.*, u.email, u.username, u.pictureUrl FROM comments c INNER JOIN users u ON c.userId = u.id WHERE c.postId = ? ORDER BY c.id ASC';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.status(201).json({ result });
    })
}

exports.commentPost = (req, res, next) => {
    const commentObject = req.body[0];
    console.log(req.body);
    let sql = `SELECT * FROM posts WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.lenght < 1) {
            res.status(404).json({ error: new Error('Post inexistant !') });
        } else {
            sql = `INSERT INTO comments (userId, postId, comment) VALUES (?, ?, ?)`;
            db.query(sql, [commentObject.userId, result[0].id, commentObject.comment], (err, response) => {
                if (err) throw err;
                sql = `UPDATE posts SET commentsNumber = commentsNumber + 1 WHERE id = ?`;
                db.query(sql, [result[0].id], (err, resp) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Commentaire ajouté !', action: 1 });
                })
            });
        }
    })
};

exports.deleteComment = (req, res, next) => {
    let sql = `SELECT * FROM comments WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.lenght < 1) {
            res.status(404).json({ error: new Error('Commentaire inexistant !') });
        } 
        if (result[0].userId !== req.auth.userId && req.body.userRole !== "admin") {
            res.status(403).json({ message: 'Requête non authorisée !', action: 0 });
        } else {
            sql = `DELETE FROM comments WHERE id = ?`;
            db.query(sql, [req.params.id], (err, response) => {
                if (err) throw err;
                sql = `UPDATE posts SET commentsNumber = commentsNumber - 1 WHERE id = ?`;
                db.query(sql, [result[0].id], (err, resp) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Commentaire supprimé !', action: 1 });
                })
            })
        }
    })
};

exports.updateComment = (req, res, next) => {
    const putObject = req.body;
    let sql = `SELECT * FROM comments WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.lenght < 1) {
            res.status(404).json({ error: new Error('Commentaire inexistant !') });
        } 
        if (result[0].userId !== req.auth.userId && req.body.userRole !== "admin") {
            res.status(403).json({ error: 'Requête non authorisée !', action: 0});
        } else {
            sql = `UPDATE comments SET comment = ? WHERE id = ?`;
            db.query(sql, [putObject.comment, req.params.id], (err, response) => {
                if (err) throw err;
                res.status(201).json({ message: 'Commentaire mis à jour !', action: 1});
            })
        }
    })
};