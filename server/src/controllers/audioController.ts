import { Request, Response } from 'express';
import Audio from '../models/Audio';
import { CustomRequest } from '../server';

// post audio handler
export const uploadAudio = async (req: CustomRequest, res: Response) => {
    const { userId, audioName, category } = req.body;
    const filePath = req.file?.path;
    if (req.user) {
      if (!filePath) {
        return res.status(400).json({ message: 'Audio file upload failed' });
      }

      const audio = new Audio({ userId, audioName, category, filePath });
      try {
          await audio.save();
          res.status(201).json({ message: 'Audio uploaded successfully' });
      } catch (error) {
          res.status(500).json({ message: 'Error saving audio', error });
      }
    } else {
      res.sendStatus(401)
    }
};

// get audio handler
export const getAudios = async (req: CustomRequest, res: Response) => {
  if (req.user) {
    try {
      const audios = await Audio.find({ userId: req.user.id });
      res.status(200).json(audios);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching audios', error });
    }
  } else {
    res.sendStatus(401)
  }
};

// serve audio file handler
export const serveAudio = async (req: CustomRequest, res: Response) => {
    const fs = require('fs');
    if (req.user) {
      try {
          const audio = await Audio.findById(req.params.id);
          if (!audio) {
            return res.status(404).send('Audio file not found');
          }
          if (fs.existsSync(audio.filePath)) {
            res.sendFile(audio.filePath);
          } else {
            res.status(404).send('File not found');
          }
      } catch (error) {
          console.error('Error fetching audio file:', error);
          res.status(500).send('Error fetching audio file');
      }
    } else {
      res.sendStatus(401)
    }
  };