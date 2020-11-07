const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const User = require('../model/User');
const path = require('path');

const db = require('../database/Database');

const sessionConfig = {
    secret: 'feedibus',
    resave: false,
    saveUninitialized: false
}

module.exports = class Server {
    /**
     * @param {number} port
     */
    constructor (port) {
        this.jsonBodyParser = bodyParser.json();
        this.urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
        this.app = express();
        this.app.use(expressSession(sessionConfig))
        this.app.use(this.loadUserFromSession);
        this.app.use(express.static(path.resolve(__dirname, '../../public')));
        this.app.post('/login', this.urlencodedBodyParser, this.login);
        this.app.post('/register', this.urlencodedBodyParser, this.register);

        this.app.listen(port);
    }

    async login (req, res) {
        if (
            'email' in req.body && typeof req.body.email === 'string' &&
            'password' in req.body && typeof req.body.password === 'string'
        ) {
            const email = req.body.email;
            const password = req.body.password;
            const user = await db.getUserByEmail(email)
            if (user instanceof User && await user.validatePassword(password)) {
                console.log(req.sessionID, req.session.id, req.session.cookie, req.session.user)
                req.session.user = user.id;
                res.send('login' + email + password);
                return;
            }
        }
        res.send('logout')
    }

    async register (req, res) {
        if (
            'name' in req.body && typeof req.body.name === 'string' &&
            'email' in req.body && typeof req.body.email === 'string' &&
            'password' in req.body && typeof req.body.password === 'string'
        ) {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const user = await db.getUserByEmail(email);
            console.log(user);
            if (user === undefined) {
                const newUser = await db.createUser(name, email, password);
                if (newUser instanceof User) {
                    res.redirect('/index.html')
                    return;
                }
            }
        }
        // console.log(req);
        res.redirect('/register.html');
    }

    async loadUserFromSession (req, res, next) {
        if ('user' in req.session && typeof req.session.user === 'number') {
            const user = await db.getUserById(req.session.user);
            if (user !== undefined) {
                req.user = user;
            }
        }
        next();
    }
}
