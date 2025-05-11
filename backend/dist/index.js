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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("yash is devootee of radha rani");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
const jwt = jsonwebtoken_1.default;
app.use(express_1.default.json());
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const hashed = yield bcrypt_1.default.hash(password, 4);
    try {
        yield client.user.create({
            data: {
                username: username,
                password: hashed,
                email: email
            }
        });
        res.json({
            message: "signed up complete !!"
        });
    }
    catch (_a) {
        res.json({
            message: " !! couldn't signedup !!"
        });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const resp = yield client.user.findFirst({
            where: {
                username: username
            }
        });
        const matched = yield bcrypt_1.default.compare(password, resp === null || resp === void 0 ? void 0 : resp.password);
        if (matched) {
            const token = jwt.sign({ id: resp === null || resp === void 0 ? void 0 : resp.id }, config_1.Jwt_secret);
            res.json({
                token: token
            });
        }
        else {
            res.json({
                message: " wrong password "
            });
        }
    }
    catch (_a) {
        res.json({
            message: "try again !!"
        });
    }
}));
app.listen(3000, () => {
    console.log("server is running !!");
});
