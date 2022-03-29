"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gone = exports.Forbidden = exports.UnAuthorized = exports.NotFound = exports.BadRequest = exports.default = void 0;
const http_status_codes_1 = require("http-status-codes");
class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
    getErrorCode() {
        if (this instanceof BadRequest) {
            return http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
        if (this instanceof NotFound) {
            return http_status_codes_1.StatusCodes.NOT_FOUND;
        }
        if (this instanceof UnAuthorized) {
            return http_status_codes_1.StatusCodes.UNAUTHORIZED;
        }
        if (this instanceof Forbidden) {
            return http_status_codes_1.StatusCodes.FORBIDDEN;
        }
        if (this instanceof Gone) {
            return http_status_codes_1.StatusCodes.GONE;
        }
        return 500;
    }
}
exports.default = GeneralError;
class BadRequest extends GeneralError {
}
exports.BadRequest = BadRequest;
class NotFound extends GeneralError {
}
exports.NotFound = NotFound;
class UnAuthorized extends GeneralError {
}
exports.UnAuthorized = UnAuthorized;
class Forbidden extends GeneralError {
}
exports.Forbidden = Forbidden;
class Gone extends GeneralError {
}
exports.Gone = Gone;
