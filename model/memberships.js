import mongoose from 'mongoose'

const membershipSchema = mongoose.Schema({
    membershipId: {
        type: String,
    },
    name:{
        type: String,
    },
    services:{
        type: Array,
    }
}, {
    timestamps: true
});

const Membership = mongoose.model('membership', membershipSchema);

export default Membership;