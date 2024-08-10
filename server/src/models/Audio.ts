import mongoose, { Document, Schema } from 'mongoose';

interface AudioFile extends Document {
  userId: string;
  filePath: string;
  audioName: string;
  category: string;
}

const audioSchema: Schema = new Schema({
  userId: { type: String, required: true },
  filePath: { type: String, required: true },
  audioName: { type: String, required: true },
  category: { type: String, required: true }
});

const Audio = mongoose.model<AudioFile>('Audio', audioSchema);

export default Audio;
