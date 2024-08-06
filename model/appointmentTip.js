import mongoose from 'mongoose'

const appointmentTipSchema = mongoose.Schema({

    appoinmentid: {
        type: String,
    },
    tip: {
        type: Number,
    },
    appoinmentDetails: {
        type: Object,

    },
}, {
    timestamps: true
});

const appoinmentTip = mongoose.model('appoinmentTip', appointmentTipSchema);

export default appoinmentTip;