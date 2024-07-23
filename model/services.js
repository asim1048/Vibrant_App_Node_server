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
        default:"https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
}, {
    timestamps: true
});

const Service = mongoose.model('service', serviceSchema);

export default Service;