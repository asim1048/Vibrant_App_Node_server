import mongoose from 'mongoose'

const appointmentPaymentSchema = mongoose.Schema({
    userEmail:{
        type: String,
    },
    paidAmount: {
        type: Number,
    },
    appointmentDetails: {
        type:Object,
    },
}, {
    timestamps: true
});

const AppointmentPayment = mongoose.model('appointmentPayment', appointmentPaymentSchema);

export default AppointmentPayment;