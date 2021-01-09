const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const User = require('../model/User');
const Tag = require('../model/Tag');
const Subscription = require('../model/Subscription');
const path = require('path');
const responseUtils = require('./ResponseUtils');

const db = require('../database/Database');
const { emitWarning } = require('process');

const sessionConfig = {
    secret: 'feedibus',
    resave: false,
    saveUninitialized: false
}

module.exports = class Server {
    /**
     * @param {number} port
     */
    constructor(port) {
        this.jsonBodyParser = bodyParser.json();
        this.urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
        this.app = express();
        this.app.use(expressSession(sessionConfig))
        this.app.use(this.loadUserFromSession);
        this.app.use(express.static(path.resolve(__dirname, '../../public')));

        this.app.post('/login', this.jsonBodyParser, this.login);
        this.app.post('/register', this.jsonBodyParser, this.register);
        this.app.get('/user', this.jsonBodyParser, this.getSessionUser);

        this.app.get('/tags', this.jsonBodyParser, this.getTags);
        this.app.post('/tags', this.jsonBodyParser, this.createTag);
        this.app.delete('/tags', this.jsonBodyParser, this.deleteTag);

        this.app.get('/subscriptions', this.jsonBodyParser, this.getSubscriptions);
        this.app.post('/subscriptions', this.jsonBodyParser, this.createSubscription);
        this.app.delete('/subscriptions', this.jsonBodyParser, this.deleteSubscription);

        this.app.get('/jobs', this.jsonBodyParser, this.getJobs);
        this.app.post('/jobs', this.jsonBodyParser, this.createJob);
        this.app.delete('/jobs', this.jsonBodyParser, this.deleteJob);

        this.app.get('/messages', this.jsonBodyParser, this.getMessages);

        this.app.get('/test', function (req, res) {
            res.send('hello world');
        });

        this.app.listen(port);
    }

    async login(req, res) {
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
                responseUtils.sendOK(res, 'User "' + user.name + '" was logged in successfully.');
                return;
            } else {
                responseUtils.sendNotFound(res, 'User does not exist or the entered password is invalid.');
            }
        }
        responseUtils.sendBadRequest(res);
        res.send('logout')
    }

    async register(req, res) {
        console.log(req.body);
        if (
            'name' in req.body && typeof req.body.name === 'string' &&
            'email' in req.body && typeof req.body.email === 'string' &&
            'password' in req.body && typeof req.body.password === 'string'
        ) {
            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const user = await db.getUserByEmail(email);
            if (user === undefined) {
                const newUser = await db.createUser(name, email, password);
                console.log(newUser);
                if (newUser instanceof User) {
                    responseUtils.sendCreated(res, "Created user with id: " + newUser.id);
                    //res.redirect('/index.html')
                    return;
                }
            } else {
                responseUtils.sendConflict(res, "User with id: '" + user.id + "' already exists.");
            }
        }
        responseUtils.sendBadRequest(res);
        // console.log(req);
        //  res.redirect('/register.html');
    }

    async getTags(req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, "You are not logged in");
            return;
        }
        
        const tags = await db.getAllTableRows('tag');
        tags.filter(tag => tag.id === req.user.id);
        console.log(tags);
        res.send(tags);
    }

    async createTag(req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, "You are not logged in");
            return;
        }

        if (
            'name' in req.body && typeof req.body.name === 'string' &&
            'color' in req.body && typeof req.body.color === 'string'
        ) {
            const name = req.body.name;
            const color = req.body.color;
            const userId = req.user.id;
            console.log(userId);

            const newTag = await db.createTag(name, color, userId);
            if (newTag instanceof Tag) {
                responseUtils.sendCreated(res, "Created tag with id: " + newTag.id);
                return;
            }
            else {
                responseUtils.sendConflict(res, "Tag with id: '" + newTag.id + "' already exists.");
            }
            // console.log(req);
        }
        responseUtils.sendBadRequest(res);
    }

    async deleteTag(req, res) {
        if (
            'id' in req.query
        ) {
            const id = req.query.id;
            db.deleteTableRowById('tag', id);
            responseUtils.sendNoContent("Deleted tag with id '" + id + "' successfully.");
        }
        responseUtils.sendBadRequest(res);
    }

    async getJobs(req, res) {
        const jobs = await db.getAllTableRows('job');
        console.log(jobs);
        res.send(jobs);
    }

    async createJob(req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, "You are not logged in");
            return;
        }

        if (
            'type' in req.body && typeof req.body.type === 'string' &&
            'url' in req.body && typeof req.body.url === 'string'
        ) {
            const type = req.body.type;
            const url = req.body.url;

            const newJob = await db.createJob(type, url);
            if (newJob instanceof Job) {
                responseUtils.sendCreated(res, "Created job with id: " + newJob.id);
                return;
            }
            else {
                responseUtils.sendConflict(res, "Job with id: '" + newJob.id + "' already exists.");
            }
            // console.log(req);
        }
        responseUtils.sendBadRequest(res);
    }

    async deleteJob(req, res) {
        if (
            'id' in req.query
        ) {
            const id = req.query.id;
            db.deleteTableRowById('job', id);
            responseUtils.sendNoContent("Deleted job with id '" + id + "' successfully.");
        }
        responseUtils.sendBadRequest(res);
    }

    async getSubscriptions(req, res) {
        const subscriptions = await db.getAllTableRows('subscription');
        console.log(subscriptions);
        res.send(subscriptions);
    }

    async createSubscription(req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, "You are not logged in");
            return;
        }

        if (
            'type' in req.body && typeof req.body.type === 'string'
        ) {
            const type = req.body.type;
            const userId = req.user.id;
            console.log(userId);

            const newSubcription = await db.createSubscription(type, userId);
            if (newSubcription instanceof Subscription) {
                responseUtils.sendCreated(res, "Created subscription with id: " + newSubcription.id);
                return;
            } else {
                responseUtils.sendConflict(res, "Subscription with id: '" + newUser.id + "' already exists.");
            }
            // console.log(req);
        }
        responseUtils.sendBadRequest(res);
    }

    async deleteSubscription(req, res) {
        if (
            'id' in req.query
        ) {
            const id = req.query.id;
            db.deleteTableRowById('subscription', id);
            responseUtils.sendNoContent("Deleted subscription with id '" + id + "' successfully.");
        }
        responseUtils.sendBadRequest(res);
    }

    async getMessages(req, res) {
        const subscriptions = await db.getAllTableRows('message');
        console.log(subscriptions);
        res.send(subscriptions);
    }

    async getSessionUser(req, res) {
        const user = req.user;
        if (user) {
            res.send(
                {
                    "user": {
                        "name": user.name,
                        "email": user.email
                    }
                });
        }
        responseUtils.sendNotFound(res, "No user is currently logged in.");
    }

    async loadUserFromSession(req, res, next) {
        if ('user' in req.session && typeof req.session.user === 'number') {
            const user = await db.getUserById(req.session.user);
            if (user !== undefined) {
                req.user = user;
                console.log(user);
            }
        }
        next();
    }
}
