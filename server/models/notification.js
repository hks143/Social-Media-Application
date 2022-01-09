import mongoose from 'mongoose';

const NotificationSchema = mongoose.Schema({
    id:String,
    notification:String,
    createdAt:{
        type:Date,
        default:new Date()
    },
    seen:Boolean
    
})

var Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;