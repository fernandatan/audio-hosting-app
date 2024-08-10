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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// get all users handler
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            const users = yield User_1.default.find(); // Fetch all user documents
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
});
exports.getUsers = getUsers;
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = new User_1.default({ username, password: hashedPassword });
    try {
        const newUser = yield user.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating new user', error });
    }
});
exports.createUser = createUser;
// Update a user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newReq = req.body;
    newReq.username = username;
    newReq.password = hashedPassword;
    try {
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.params.id, newReq, { new: true });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});
exports.updateUser = updateUser;
// Delete a user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUser = deleteUser;
