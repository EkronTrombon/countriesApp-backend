import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({
    created: { type: Date },
    title: { type: String },
    message: { type: String },
    img: [{ type: String }],
    coords: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [ true, 'The user is necessary' ] }
});

postSchema.pre<IPost>('save', function(next) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    title: string;
    message: string;
    img: string[];
    coords: string;
    user: string;
};

export const Post = model<IPost>('Post', postSchema);