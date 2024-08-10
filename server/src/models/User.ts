import mongoose, { Document, Schema } from 'mongoose';

interface UserDetails extends Document {
  username: string;
  password: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model<UserDetails>('User', userSchema);

export default User;
