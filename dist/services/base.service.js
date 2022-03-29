"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class BaseService {
    constructor(user) {
        this.repo = (0, typeorm_1.getManager)().getRepository(user);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.find();
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = this.repo.create(data);
            return yield this.repo.save(resource);
        });
    }
}
exports.default = BaseService;
