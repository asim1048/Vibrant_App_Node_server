import mongoose from 'mongoose'

const serviceSchema = mongoose.Schema({
    serviceId: {
        type: String,
    },
    name:{
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type:String,
        default:"/uploads/services/default_service.png"
    },
}, {
    timestamps: true
});

const Service = mongoose.model('service', serviceSchema);

export default Service;