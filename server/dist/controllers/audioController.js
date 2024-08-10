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
exports.serveAudio = exports.getAudios = exports.uploadAudio = void 0;
const Audio_1 = __importDefault(require("../models/Audio"));
// post audio handler
const uploadAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, audioName, category } = req.body;
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (req.user) {
        if (!filePath) {
            return res.status(400).json({ message: 'Audio file upload failed' });
        }
        const audio = new Audio_1.default({ userId, audioName, category, filePath });
        try {
            yield audio.save();
            res.status(201).json({ message: 'Audio uploaded successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error saving audio', error });
        }
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
});
exports.uploadAudio = uploadAudio;
// get audio handler
const getAudios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        try {
            const audios = yield Audio_1.default.find({ userId: req.user.id }); // Fetch all audio documents
            res.status(200).json(audios);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching audios', error });
        }
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
});
exports.getAudios = getAudios;
// serve audio file handler
const serveAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fs = require('fs');
    if (req.user) {
        try {
            const audio = yield Audio_1.default.findById(req.params.id);
            if (!audio) {
                return res.status(404).send('Audio file not found');
            }
            if (fs.existsSync(audio.filePath)) {
                res.sendFile(audio.filePath);
            }
            else {
                res.status(404).send('File not found');
            }
        }
        catch (error) {
            console.error('Error fetching audio file:', error);
            res.status(500).send('Error fetching audio file');
        }
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
});
exports.serveAudio = serveAudio;
