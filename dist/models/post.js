"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: { type: Date },
    title: { type: String },
    message: { type: String },
    img: [{ type: String }],
    coords: { type: String },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: [true, 'The user is necessary'] }
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
;
exports.Post = mongoose_1.model('Post', postSchema);
