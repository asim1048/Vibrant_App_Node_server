import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  email: {
    type: String,
  },
  notificationType: {
    type: String,
    default: 'Appointment',//Appointment: for Reminder(Present,past,future)-------Appointment-Booking: For New Booked Appoinment-----Appointment-FillForm:to Fill Form --------Appointment-Resch: For Successfully resch----Appointment-Cancel: After successfully cancel
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
