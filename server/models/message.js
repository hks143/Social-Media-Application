import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    sender: String,
    conversationId: String,
    receiver: String,
    text:String,
    seen:Boolean,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var Message = mongoose.model('Message', messageSchema);

export default Message;