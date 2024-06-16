import mongoose from 'mongoose'

const userScheme = mongoose.Schema({
    fName: {
        type: String,
    },
    lName: {
        type: String,
    },
    email: {
        type: String,

    },
    number: {
        type: String,

    },
    password: {
        type: String,

    },
    image: {
        type: String,
        default:"/uploads/dps/Default_DP.png"

    },
    fbUser:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const user = mongoose.model('user', userScheme); //creating a  collection(table) by checking with UserSchema

export default user;