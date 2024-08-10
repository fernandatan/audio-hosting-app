import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import upload from './middleware/upload';
import { getAudios, serveAudio, uploadAudio } from './controllers/audioController';
import { createUser, deleteUser, getUsers, updateUser } from './controllers/userController';

// Define a custom interface extending the existing Request interface
export interface UserPayload {
  id: string;
  username: string;
  password: string;
}

export interface CustomRequest extends Request {
  user?: UserPayload
}


dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;
const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');
const app = express();

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in the .env file');
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function authenticateToken(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }
    req.user = user as UserPayload;
    next();
  });
}

// MongoDB connection
mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

// Define routes
app.get('/', (req, res) => res.send('Server is running'));

// Use auth routes
app.use('/api/auth', authRoutes);

// get users
app.get('/api/user/get', authenticateToken, getUsers);

// create user
app.post('/api/user/post', authenticateToken, createUser);

// update user
app.put('/api/user/put/:id', authenticateToken, updateUser);

// delete user
app.delete('/api/user/delete/:id', authenticateToken, deleteUser);

// upload audio files
app.post('/api/audio/post', authenticateToken, upload, uploadAudio);

// fetch audio files
app.get('/api/audio/get', authenticateToken, getAudios);

// serve audio file
app.get('/api/audio/get/:id', authenticateToken, serveAudio);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
