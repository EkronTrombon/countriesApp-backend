import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    lastName: { type: String, required: [true, 'Last Name is required'] },
    userName: { type: String, required: [true, 'User NickName is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    country: { type: String, required: false },
    img: { type: String, default: '', required: [false] }
});

userSchema.method('comparePassword', function(pwd: string = ''): boolean {
    if (bcrypt.compareSync(pwd, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface IUser extends Document {
    name: string;
    lastName: string;
    userName: string;
    password: string;
    country: string;
    img: string;
    comparePassword(pwd: string): boolean;
};

export const User = model<IUser>('User', userSchema);