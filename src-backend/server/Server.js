const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const User = require('../model/User');
const Tag = require('../model/Tag');
const Job = require('../model/Job');
const path = require('path');
const responseUtils = require('./ResponseUtils');

const db = require('../database/Database');
const runnerMap = require('../runner/RunnerMap');

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
            res.redirect('/index.html');
        })
        this.app.post('/register', this.jsonBodyParser, (req, res) => {
            this.register(req, res)
        });
        this.app.get('/user', this.jsonBodyParser, (req, res) => {
            this.getSessionUser(req, res);
        });

        this.app.get('/tags', this.jsonBodyParser, (req, res) => {
            this.getTags(req, res);
        });
        this.app.post('/tags', this.jsonBodyParser, (req, res) => {
            this.createTag(req, res);
        });
        this.app.delete('/tags', this.jsonBodyParser, (req, res) => {
            this.deleteTag(req, res);
        });

        this.app.get('/subscriptions', this.jsonBodyParser, (req, res) => {
            this.getSubscriptions(req, res);
        });
        this.app.post('/subscriptions', this.jsonBodyParser, (req, res) => {
            this.createNewSubscription(req, res);
        });
        this.app.delete('/subscriptions', this.jsonBodyParser, (req, res) => {
            this.deleteSubscription(req, res);
        });

        this.app.get('/jobs', this.jsonBodyParser, (req, res) => {
            this.getJobs(req, res);
        });
        this.app.post('/jobs', this.jsonBodyParser, (req, res) => {
            this.createJob(req, res);
        });
        this.app.delete('/jobs', this.jsonBodyParser, (req, res) => {
            this.deleteJob(req, res);
        });

        this.app.get('/messages', this.jsonBodyParser, (req, res) => {
            this.getMessages(req, res);
        });

        this.app.get('/test', function (req, res) {
            res.send('hello world');
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
                responseUtils.sendOK(res, 'User "' + user.name + '" was logged in successfully.');
                return;
            } else {
                responseUtils.sendNotFound(res, 'User does not exist or the entered password is invalid.');
                return;
            }
        }
        responseUtils.sendBadRequest(res);
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
            if (user === undefined) {
                const newUser = await db.createUser(name, email, password);
                if (newUser instanceof User) {
                    responseUtils.sendCreated(res, '');
                    return;
                }
            } else {
                responseUtils.sendConflict(res, "User with email: '" + email + "' already exists.");
                return;
            }
            res.status(500);
            res.send('Nutzer konnte nicht angelegt werden');
            return;
        }
        responseUtils.sendBadRequest(res);
    }

    async getTags (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        const tags = await db.getTableRowsByUserId('tag', req.user.id);
        res.send(tags);
    }

    async createTag (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        if (
            'name' in req.body && typeof req.body.name === 'string' &&
            'color' in req.body && typeof req.body.color === 'string'
        ) {
            const name = req.body.name;
            const color = req.body.color;
            const userId = req.user.id;

            const newTag = await db.createTag(name, color, userId);
            if (newTag instanceof Tag) {
                responseUtils.sendCreated(res, 'Created tag with id: ' + newTag.id);
                return;
            } else {
                responseUtils.sendConflict(res, 'Tag could not be created.');
                return;
            }
        }
        responseUtils.sendBadRequest(res);
    }

    async deleteTag (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        if (
            'id' in req.query
        ) {
            const id = req.query.id;
            db.deleteTableRowByIdAndUserId('tag', id, req.user.id);
            responseUtils.sendNoContent(res, "Deleted tag with id '" + id + "' successfully.");
            return;
        }
        responseUtils.sendBadRequest(res);
    }

    async getJobs (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        const jobs = await db.getJobsByUserId(req.user.id);
        res.send(jobs);
    }

    async createJob (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        if (
            'type' in req.body && typeof req.body.type === 'string' &&
            'url' in req.body && typeof req.body.url === 'string'
        ) {
            const type = req.body.type;
            const url = req.body.url;

            if (!Object.keys(runnerMap).includes(type)) {
                responseUtils.sendConflict(res, "Job type '" + type + "' doesn't exist.");
                return;
            }
            const job = await db.getJobByTypeAndUrl(type, url);
            if (job !== null) {
                responseUtils.sendConflict(res, "Job with url: '" + url + "' already exists.");
                return;
            }
            const newJob = await db.createJob(type, url);
            if (newJob instanceof Job) {
                responseUtils.sendCreated(res, 'Created job with id: ' + newJob.id);
                return;
            }
        }
        responseUtils.sendBadRequest(res);
    }

    async deleteJob (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        if (
            'id' in req.query
        ) {
            const id = req.query.id;
            const jobs = db.getJobsByUserId(req.user.id);
            const jobIds = jobs.map(job => job.id);
            if (jobIds.includes(id)) {
                db.deleteTableRowById('job', id);
                db.deleteSubscriptionByJobId(id);
            } else {
                responseUtils.sendNotFound(res, 'Could not find job with the specified id.');
                return;
            }
            responseUtils.sendNoContent(res, "Deleted job with id '" + id + "' successfully.");
            return;
        }
        responseUtils.sendBadRequest(res);
    }

    async getSubscriptions (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        const subscriptions = await db.getTableRowsByUserId('subscription', req.user.id);
        res.send(subscriptions);
    }

    async deleteSubscription (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        if (
            'id' in req.query
        ) {
            const id = req.query.id;
            db.deleteTableRowByIdAndUserId('subscription', id, req.user.id);
            responseUtils.sendNoContent(res, "Deleted subscription with id '" + id + "' successfully.");
            return;
        }
        responseUtils.sendBadRequest(res);
    }

    async getMessages (req, res) {
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        const messages = await db.getMessagesByUserId(req.user.id);
        if (messages && messages.length > 0) {
            res.send(messages);
        } else {
            responseUtils.sendNotFound(res, 'Could not find any message for the specified user.');
        }
    }

    async getSessionUser (req, res) {
        const user = req.user;
        if (user) {
            res.send(
                {
                    user: {
                        name: user.name,
                        email: user.email
                    }
                });
        }
        responseUtils.sendNotFound(res, 'No user is currently logged in.');
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
        if (!req.user) {
            responseUtils.sendForbidden(res, 'You are not logged in');
            return;
        }

        if (
            'type' in req.body && typeof req.body.type === 'string' &&
            'url' in req.body && typeof req.body.url === 'string' &&
            'user' in req && req.user instanceof User
        ) {
            const user = req.user;
            const type = req.body.type;
            const url = req.body.url;
            if (!Object.keys(runnerMap).includes(type)) {
                responseUtils.sendConflict(res, "Job type '" + type + "' doesn't exist.");
                return;
            }
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
        responseUtils.sendBadRequest(res);
    }
}
