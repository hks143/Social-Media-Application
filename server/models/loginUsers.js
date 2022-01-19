import mongoose from 'mongoose';

const loginSchema = mongoose.Schema({

    id: String,
    firstname: String,
    lastname: String,
    email: String,
    when: {
        type: Date,
        default: new Date(),
    },
    follower: { type: [String], default: [] },
    following: { type: [String], default: [] }
})

var loginUsers = mongoose.model('loginUsers', loginSchema);

export default loginUsers;