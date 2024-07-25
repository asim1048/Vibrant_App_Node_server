import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    adminID: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    
}, {
    timestamps: true
});

const Admin = mongoose.model('admin', adminSchema); //creating a  collection(table) by checking with UserSchema

export default Admin;