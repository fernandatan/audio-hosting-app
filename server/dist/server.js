"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const upload_1 = __importDefault(require("./middleware/upload"));
const audioController_1 = require("./controllers/audioController");
const userController_1 = require("./controllers/userController");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
// const JWT_SECRET = process.env.JWT_SECRET as string;
const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');
const app = (0, express_1.default)();
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in the .env file');
}
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use('/uploads', express_1.default.static('uploads'));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}
// MongoDB connection
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error(err));
// Define routes
app.get('/', (req, res) => res.send('Server is running'));
// Use auth routes
app.use('/api/auth', authRoutes_1.default);
// get users
app.get('/api/user/get', authenticateToken, userController_1.getUsers);
// create user
app.post('/api/user/post', authenticateToken, userController_1.createUser);
// update user
app.put('/api/user/put/:id', authenticateToken, userController_1.updateUser);
// delete user
app.delete('/api/user/delete/:id', authenticateToken, userController_1.deleteUser);
// upload audio files
app.post('/api/audio/post', authenticateToken, upload_1.default, audioController_1.uploadAudio);
// fetch audio files
app.get('/api/audio/get', authenticateToken, audioController_1.getAudios);
// serve audio file
app.get('/api/audio/get/:id', authenticateToken, audioController_1.serveAudio);
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
