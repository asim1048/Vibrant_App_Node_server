import mongoose from 'mongoose'

const appoinmentRatingSchema = mongoose.Schema({
    
    appoinmentid: {
        type: String,
    },
    issue: {
        type: String,
    },
    rating: {
        type: Number,
    },
    appoinmentDetails: {
        type: Object,

    },
}, {
    timestamps: true
});

const appoinmentRating = mongoose.model('appoinmentRating', appoinmentRatingSchema);

export default appoinmentRating;