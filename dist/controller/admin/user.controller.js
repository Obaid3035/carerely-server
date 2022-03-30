"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AdminUserController {
    constructor() {
        this.path = "/admin";
        this.router = (0, express_1.Router)();
    }
}
exports.default = AdminUserController;
