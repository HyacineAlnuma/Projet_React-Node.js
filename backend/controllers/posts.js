const db = require('../db-config');
const fs = require('fs');

exports.getAllPosts = (req, res, next) => {
    let sql = 'SELECT * FROM posts';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
    });
};

exports.getOnePost = (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
};

exports.createPost = (req, res, next) => {
    const file = req.files ? req.files[0] : undefined;
    const postObject = file ?
    {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`
    } : {...req.body};
    let sql = `INSERT INTO posts (userId, textpost, imageUrl, likes) VALUES (?, ?, ?, '0')`;
    db.query(sql, [postObject.userId, postObject.textpost, postObject.imageUrl], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Post enregistré !'})
    });
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
            res.status(404).json({ error: new Error('Post inexistante !') });
        }
        if (result[0].userId !== req.auth.userId || req.body.userRole == "admin") {
            res.status(403).json({ error: new Error('Requête non authorisée !') });
        } 
        if (!file) {
            sql = `UPDATE posts SET textpost = ? WHERE id = ?`;
            db.query(sql, [postObject.textpost, req.params.id], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post modifié !'})
            })
        } else {
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql = `UPDATE posts SET textpost = ?, imageUrl = ? WHERE id = ?`;
                db.query(sql, [postObject.textpost, postObject.imageUrl, req.params.id], (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post modifié !'})
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
        if (result[0].userId !== req.auth.userId || req.body.userRole == "admin") {
            res.status(403).json({ error: new Error('Requête non authorisée !') });
        } 
        if (result[0].imageUrl !== null && result[0].imageUrl != "undefined") {
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql = `DELETE FROM posts WHERE id = ?`;
                db.query(sql, [req.params.id], (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post supprimé !'})
                });
            });
        } else {
            sql = `DELETE FROM posts WHERE id = ?`;
            db.query(sql, [req.params.id], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post supprimé !'})
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
        sql = `SELECT * FROM likes WHERE userId = ? AND postId = ?`
        db.query(sql, [req.body.userId, result[0].id], (err, response) => {
            if (err) throw err;
            if (response.length > 0) {
                sql = `DELETE FROM likes WHERE id = ?`;
                db.query(sql, [response[0].id], (err, resp) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post disliké !', action: 0});
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

exports.commentPost = (req, res, next) => {
    const commentObject = req.body;
    let sql = `SELECT * FROM posts WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result.lenght < 1) {
            res.status(404).json({ error: new Error('Post inexistant !') });
        } else {
            sql = `INSERT INTO comments (userId, postId, comment) VALUES (?, ?, ?)`;
            db.query(sql, [req.body.userId, result[0].id, commentObject.comment], (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post commenté !'});
            })
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
        if (result[0].userId !== req.auth.userId || req.body.userRole == "admin") {
            res.status(403).json({ error: new Error('Requête non authorisée !') });
        } else {
            sql = `DELETE FROM comments WHERE id = ?`;
            db.query(sql, [req.params.id], (err, response) => {
                if (err) throw err;
                res.status(201).json({ message: 'Commentaire supprimé !', action: 0});
            })
        }
    })
};

exports.updateComment = (req, res, next) => {
    const putObject = req.body;
    let sql = `SELECT * FROM comments WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        if (result[0].userId !== req.auth.userId || req.body.userRole !== "admin") {
            res.status(403).json({ error: 'Requête non authorisée !' });
        } else {
            sql = `UPDATE comments SET comment = ? WHERE id = ?`;
            db.query(sql, [putObject.comment, req.params.id], (err, response) => {
                if (err) throw err;
                res.status(201).json({ message: 'Commentaire mis à jour !', action: 1});
            })
        }
    })
};