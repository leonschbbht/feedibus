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
     * @param jobId
     */
    _newJobCallback (jobId) {
        console.log('New Job ', jobId);
    }

    /**
     * @param {function} callback
     */
    setNewJobCallback (callback) {
        if (typeof callback === 'function') {
            this._newJobCallback = callback;
        } else {
            console.log('callback is not an function');
        }
    }

    /**
     * @param {number} port
     */
    run (port) {
        this.jsonBodyParser = bodyParser.json();
        this.urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
        this.app = express();
        this.app.use(expressSession(sessionConfig))
        this.app.use(this.loadUserFromSession);
        this.app.get('/index.html', (req, res, next) => {
            if ('user' in req && req.user instanceof User) {
                res.redirect('/home.html');
                return;
            }
            next();
        });
        this.app.get('/home.html', (req, res, next) => {
            if ('user' in req && req.user instanceof User) {
                next();
                return;
            }
            res.redirect('/index.html');
        });
        this.app.post('/login', this.jsonBodyParser, (req, res) => {
            this.login(req, res)
        });
        this.app.get('/logout', (req, res) => {
            delete req.session.user;
            res.status(200);
            res.send('');
        })
        this.app.post('/register', this.jsonBodyParser, (req, res) => {
            this.register(req, res)
        });
        this.app.post('/subscribe', this.urlencodedBodyParser, (req, res) => {
            this.createNewSubscription(req, res)
        });

        this.app.use(express.static(path.resolve(__dirname, '../../public')));
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
                req.session.user = user.id;
                res.status(200);
                res.send('');
                return;
            }
        }
        res.send('Login nicht erfolgreich!')
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
            if (user !== undefined) {
                res.status(404);
                res.send('Unzulässige Email');
                return;
            }
            const newUser = await db.createUser(name, email, password);
            if (newUser instanceof User) {
                res.status(200);
                res.send('');
                return;
            }
            res.status(500);
            res.send('Nutzer konnte nicht angelegt werden');
            return;
        }
        res.status(400);
        res.send('Bad Request');
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

    async createNewSubscription (req, res) {
        if (
            'type' in req.body && typeof req.body.type === 'string' &&
            'url' in req.body && typeof req.body.url === 'string' &&
            'user' in req && req.user instanceof User
        ) {
            const user = req.user;
            const type = req.body.type;
            const url = req.body.url;
            let job = await db.getJobByTypeAndUrl(type, url);
            if (job === null) {
                job = await db.createJob(type, url);
                if (job !== null) {
                    this._newJobCallback(job.id);
                }
            }
            if (job !== null) {
                let subscription = await db.getSubscriptionByUserIdAndJobId(user.id, job.id);
                if (subscription === null) {
                    subscription = await db.createSubscription(user.id, job.id);
                }
                if (subscription !== null) {
                    res.json({
                        id: subscription.id
                    });
                    return;
                }
            }
        }
        // todo richtiger error im Fehlerfall
        res.redirect('/index.html');
    }
}
