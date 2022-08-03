const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db-config');

const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');

const app = express();

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Connection à MySql réussie !');
    }
});

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', usersRoutes);
app.use('/api/posts', postsRoutes);

module.exports = app;