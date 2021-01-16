module.exports.sendStatus =
    function sendStatus (res, statusCode, message) {
        const status = {
            status: {
                statusCode: statusCode,
                message: message
            }
        }
        res.status(statusCode);
        res.send(status);
    }

module.exports.sendBadRequest =
    function sendBadRequest (res) {
        this.sendStatus(res, 400, 'Bad Request.');
    }

module.exports.sendOK =
    function sendBadRequest (res, message) {
        this.sendStatus(res, 200, message);
    }

module.exports.sendCreated =
    function sendBadRequest (res, message) {
        this.sendStatus(res, 201, message);
    }

module.exports.sendNoContent =
    function sendNoContent (res, message) {
        this.sendStatus(res, 204, message);
    }

module.exports.sendConflict =
    function sendConflict (res, message) {
        this.sendStatus(res, 409, message);
    }

module.exports.sendNotFound =
    function sendNotFound (res, message) {
        this.sendStatus(res, 404, message);
    }

module.exports.sendForbidden =
    function sendForbidden (res, message) {
        this.sendStatus(res, 403, message);
    }
