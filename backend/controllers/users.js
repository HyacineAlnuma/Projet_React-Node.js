const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db-config');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
            let sql = `INSERT INTO users (email, passwordhash, username, pictureUrl, userRole) VALUES (?, ?, ?, ?, ?)`;
            db.query(sql, [req.body.email, hash, req.body.username, req.body.pictureUrl, req.body.role], (err, result) => {
                if (err) throw err;
                console.log(result);
                res.send(result);
            });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    let sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [req.body.email], (err, result) => {
        if (err) throw err;
        if (!result) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, result[0].passwordhash)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: result[0].id,
                    token: jwt.sign(
                        { userId: result[0].id },
                        process.env.TOKEN_KEY,
                        { expiresIn: '24h' }
                    )
                });
            })
    })
};