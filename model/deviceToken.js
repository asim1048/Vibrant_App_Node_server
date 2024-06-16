import mongoose from 'mongoose'

const deviceTokenSchema = mongoose.Schema({
    
    email: {
        type: String,

    },
    token: {
        type: String,

    },
    islogin:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const devicetoken = mongoose.model('devicetoken', deviceTokenSchema); //creating a  collection(table) by checking with UserSchema

export default devicetoken;