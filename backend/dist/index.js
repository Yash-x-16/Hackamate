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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
const jwt = jsonwebtoken_1.default;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email } = req.body;
    const salt = yield bcrypt_1.default.genSalt(4);
    const hashed = yield bcrypt_1.default.hash(password, salt);
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
app.post('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email } = req.body;
    try {
        const existingUserByUsername = yield client.user.findUnique({
            where: {
                username: String(username) // assuming usernames are stored lowercase
            }
        });
        const existingUserByEmail = yield client.user.findUnique({
            where: {
                email: String(email), // same with email
            }
        });
        if (existingUserByUsername || existingUserByEmail) {
            res.status(401).json({
                message: "User already exists",
                usernameTaken: !!existingUserByUsername,
                emailTaken: !!existingUserByEmail
            });
        }
        else {
            res.json({
                message: "OK"
            });
        }
    }
    catch (_a) {
        res.json({
            message: "some error occured"
        });
    }
}));
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const resp = yield client.user.findFirst({
            where: {
                email: email
            }
        });
        if (!resp) {
            res.json({
                message: "invalid email or password "
            });
        }
        const matched = yield bcrypt_1.default.compare(password, resp === null || resp === void 0 ? void 0 : resp.password);
        if (matched) {
            const token = jwt.sign({ id: resp === null || resp === void 0 ? void 0 : resp.id }, config_1.Jwt_secret);
            res.json({
                token: token
            });
        }
    }
    catch (e) {
        console.log(e);
        res.json({
            message: "Try again !!"
        });
    }
}));
app.get('/ischecking', middleware_1.Middleware, (req, res) => {
    try {
        //@ts-ignore
        res.json(req.user);
    }
    catch (_a) {
        res.json({
            message: "unautorized user !!"
        });
    }
});
app.get('/user', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    try {
        const user = yield client.user.findUnique({
            where: {
                username: username
            }
        });
        res.json({
            message: "found user",
            id: user === null || user === void 0 ? void 0 : user.id
        });
    }
    catch (_a) {
        res.json({
            message: "coudn't found user !!!"
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
app.post('/messages', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, recieverId } = req.body;
    try {
        yield client.message.create({
            data: {
                content: content,
                recieverId: recieverId, //@ts-ignore 
                senderId: req.id
            }
        });
        res.json({
            message: "message sent !"
        });
    }
    catch (_a) {
        res.json({
            message: "message not sent !"
        });
    }
}));
app.get('/messages', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield client.message.findMany({
            where: {
                //@ts-ignore
                id: req.id
            }
        });
        const content = message.map(x => x.content);
        res.json({
            message: content
        });
    }
    catch (_a) {
        res.json({
            message: "message not found !"
        });
    }
}));
app.post('/hackathon', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, placement, year } = req.body;
    try {
        yield client.hackathon.create({
            data: {
                name: name,
                placement: placement,
                year: year, //@ts-ignore
                user: req.id
            }
        });
        res.json({
            message: "updated hackathon"
        });
    }
    catch (_a) {
        res.json({
            message: "try again !!"
        });
    }
}));
app.get('/hackathon', middleware_1.Middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hack = yield client.hackathon.findMany({
            where: {
                userid: req.id
            }
        });
        const hacked = hack.map(x => x);
        res.json({
            hack: hacked
        });
    }
    catch (_a) {
        res.json({
            message: "didn't found hacks!!"
        });
    }
}));
app.listen(3000, () => {
    console.log("server is running !!");
});
