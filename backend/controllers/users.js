const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const db = require('../db-config');

exports.signup = (req, res, next) => {
    const file = req.files ? req.files[0] : undefined;
    const postObject = file ?
    {
        ...req.body,
        pictureUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`
    } : {...req.body};
    if (postObject.email == null || postObject.username == null) {
        res.status(401).json({ error: 'Veuillez précisez un email et un username' });
    } else {
        bcrypt.hash(postObject.password, 10)
        .then(hash => {
                let sql = `INSERT INTO users (email, passwordhash, username, pictureUrl, userRole) VALUES (?, ?, ?, ?, ?)`;
                db.query(sql, [postObject.email, hash, postObject.username, postObject.pictureUrl, postObject.userRole], (err, result) => {
                    if (err) {
                        res.status(401).json({ error: err, message: 'Cette adresse email est déjà utilisée' });
                    }
                    res.send(result);
                });
        })
        .catch(error => res.status(500).json({ error }));
    }
};

exports.login = (req, res, next) => {
    let sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [req.body.email], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(401).json({ message: 'Utilisateur non trouvé !' });
        } else {
            bcrypt.compare(req.body.password, result[0].passwordhash)
                .then(valid => {
                    if (!valid) {
                        res.status(401).json({ message: 'Mot de passe incorrect !' });
                    } else {
                        res.status(200).json({
                            userId: result[0].id,
                            token: jwt.sign(
                                { userId: result[0].id },
                                process.env.TOKEN_KEY,
                                { expiresIn: '24h' }
                            ),
                            pictureUrl: result[0].pictureUrl,
                            username: result[0].username,
                            userRole: result[0].userRole
                        });
                    }
                })
        }
    })
};

exports.modifyProfile = (req, res, next) => {
    const file = req.files ? req.files[0] : undefined;
    const postObject = file ?
    {
        ...req.body,
        pictureUrl: `${req.protocol}://${req.get('host')}/images/${file.filename}`
    } : {...req.body};
    let sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [req.body.userId], (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.status(404).json({ message: 'Utilisateur inexistant !', action: 0 });
        }
        // if (result[0].id !== req.body.userId && req.body.userRole !== "admin") {
        //     res.status(403).json({ message: 'Requête non authorisée !', action: 0 });
        // }     
        if (!file && postObject.username == null) {
            res.status(400).json({ message: "Il faut au moins une image ou du nom d'utilisateur pour modifier le profil", action: 0 });
        } else {
            const username = postObject.username ? postObject.username : result[0].username;
            if (!file) {
                sql = `UPDATE users SET username = ? WHERE id = ?`;
                db.query(sql, [username, req.body.userId], (err, results) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'Utilisateur modifié !',
                                            action: 1,
                                            pictureUrl: result[0].pictureUrl,
                                            username: username })
                })
            } else {   
                if (result[0].pictureUrl == null) {
                    sql = `UPDATE users SET username = ?, pictureUrl = ? WHERE id = ?`;
                        db.query(sql, [username, postObject.pictureUrl, req.body.userId], (err, result) => {
                            if (err) throw err;
                            res.status(201).json({ message: 'Utilisateur modifié !',
                                                    action: 1,
                                                    pictureUrl: postObject.pictureUrl,
                                                    username: username })
                        });
                } else {
                    const filename = result[0].pictureUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        sql = `UPDATE users SET username = ?, pictureUrl = ? WHERE id = ?`;
                        db.query(sql, [username, postObject.pictureUrl, req.body.userId], (err, result) => {
                            if (err) throw err;
                            res.status(201).json({ message: 'Utilisateur modifié !',
                                                    action: 1,
                                                    pictureUrl: postObject.pictureUrl,
                                                    username: username })
                        });
                    });
                }
            }
        }
    });
};

