import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  email: {
    type: String,
  },
  notificationType: {
    type: String,
    default: 'Appointment',
  },
  appointmentId: {
    type: String,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema); // creating a collection (table) by checking with notificationSchema

export default Notification;
