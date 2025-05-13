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
const middleware_1 = require("./middleware");
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
app.post('/profile', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bio, role, image } = req.body;
    try {
        yield client.profile.create({
            data: {
                bio: bio,
                role: role,
                image: image,
                user: {
                    connect: {
                        id: req.id
                    }
                }
            }
        });
        res.json({
            message: "updated the profile "
        });
    }
    catch (_a) {
        res.json({
            message: "something went wrong !!"
        });
    }
}));
app.get('/profile', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield client.profile.findFirst({
            where: {
                userId: req.id
            }
        });
        res.json({
            profile: profile
        });
    }
    catch (_a) {
        res.json({
            message: " cannot get profile !! "
        });
    }
}));
app.post('/tag', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    try {
        yield client.tag.create({
            data: {
                name: name,
            }
        });
        const tagId = yield client.tag.findFirst({
            where: {
                name: name
            }
        });
        yield client.userTag.create({
            data: {
                userId: req.id,
                tagId: tagId === null || tagId === void 0 ? void 0 : tagId.id
            }
        });
        res.json({
            message: "tag added !!"
        });
    }
    catch (_a) {
        res.json({
            message: " couldn't update !!"
        });
    }
}));
app.get('/tag', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield client.userTag.findMany({
            where: {
                //@ts-ignore
                userId: req.id
            }, include: {
                tag: true
            },
        });
        const tagname = tags.map(entry => entry.tag.name);
        res.json({
            tags: tagname
        });
    }
    catch (_a) {
        res.json({
            message: "coudn't find any tag!!"
        });
    }
}));
app.delete('/tag', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    try {
        const tag = yield client.tag.findUnique({
            where: {
                name: name
            }
        });
        yield client.userTag.delete({
            where: {
                userId_tagId: {
                    userId: req.id,
                    tagId: tag === null || tag === void 0 ? void 0 : tag.id
                }
            }
        });
        res.json({
            message: "deleted tag"
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            message: "cannot deleted tag"
        });
    }
}));
app.listen(3000, () => {
    console.log("server is running !!");
});
