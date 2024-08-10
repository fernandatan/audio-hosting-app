import { Response } from 'express';
import User from "../models/User";
import { CustomRequest } from "../server";
import bcrypt from 'bcryptjs';

// get all users handler
export const getUsers = async (req: CustomRequest, res: Response) => {
    if (req.user) {
        try {
          const users = await User.find();
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching users', error });
        }
    } else {
    res.sendStatus(401)
    }
};

// Create a new user
export const createUser = async (req: CustomRequest, res: Response) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
  
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: 'Error creating new user', error });
    }
};
  
  // Update a user
  export const updateUser = async (req: CustomRequest, res: Response) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newReq = req.body;
    newReq.username = username;
    newReq.password = hashedPassword;

    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, newReq, { new: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error });
    }
  };
  
  // Delete a user
  export const deleteUser = async (req: CustomRequest, res: Response) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  };