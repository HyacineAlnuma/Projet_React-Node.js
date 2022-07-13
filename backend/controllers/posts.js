const db = require('../db');
const fs = require('fs');

exports.getAllPosts = (req, res, next) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
    });
};

exports.getOnePost = (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
    });
};

exports.createPost = (req, res, next) => {
    let postObject = req.body;
    let sql = `INSERT INTO posts (userId, textpost, imageUrl, likes) VALUES ('${postObject.userId}', '${postObject.textpost}', '${postObject.imageUrl}', '0')`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Post enregistré !'})
    });
};

exports.updatePost = (req, res, next) => {
    const postObject = req.file ?
    {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        if (!result) {
            res.status(404).json({ error: new Error('Post inexistante !') });
        }
        // if (result[0].userId !== req.auth.userId) {
        //     res.status(403).json({ error: new Error('Requête non authorisée !') });
        // } 
        if (!req.file) {
            sql = `UPDATE posts SET textpost = '${postObject.textpost}' WHERE id = '${req.params.id}'`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post modifié !'})
            })
        } else {
            const filename = result.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql = `UPDATE posts SET textpost = '${postObject.textpost}', imageUrl = '${postObject.imageUrl}' WHERE id = '${req.params.id}'`;
                let query = db.query(sql, (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post modifié !'})
                });
            });
        }
    });
};

exports.deletePost = (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (!result) {
            res.status(404).json({ error: new Error('Sauce inexistante !') });
        }
        // if (result[0].userId !== req.auth.userId) {
        //     res.status(403).json({ error: new Error('Requête non authorisée !') });
        // } 
        if (result[0].imageUrl !== null) {
            const filename = result.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sql = `DELETE FROM posts WHERE id = '${req.params.id}'`;
                let query = db.query(sql, (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Post supprimé !'})
                });
            });
        } else {
            sql = `DELETE FROM posts WHERE id = '${req.params.id}'`;
            let query = db.query(sql, (err, result) => {
                if (err) throw err;
                res.status(201).json({ message: 'Post supprimé !'})
            });
        }
    });
};

exports.likePost = (req, res, next) => {

};