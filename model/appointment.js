import mongoose from 'mongoose'

const appointmentSchema = mongoose.Schema({
    userEmail:{
        type: String,
    },
    appointmentId: {
        type: String,
    },
    tip:{
        type: String,
    },
    isPaid:{
        type: Boolean,
        default:false,
    },
    paidAmount: {
        type: String,
    },
    appointmentDetails: {
        type:Object,
    },
}, {
    timestamps: true
});

const Appointment = mongoose.model('appointment', appointmentSchema);

export default Appointment;