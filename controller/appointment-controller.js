import Appointment from "../model/appointment.js";
export const createOrUpdateAppoinment = async (req, res) => {
    const { appointmentId,userEmail,tip, isPaid, paidAmount,appointmentDetails } = req.body;

    try {
        let appointment = await Appointment.findOne({ appointmentId });

        if (appointment) {
            // Update the existing service
            appointment.appointmentId = appointmentId ;
            appointment.userEmail = userEmail;
            appointment.tip = tip;
            appointment.isPaid = isPaid;
            appointment.paidAmount = paidAmount;
            appointment.appointmentDetails = appointmentDetails;
            await appointment.save();
            res.status(200).json({status:true, message: 'Appointment updated successfully',data: appointment });
        } else {
            // Create a new service
            appointment = new Appointment({
                appointmentId,userEmail,tip, isPaid, paidAmount,appointmentDetails
            });
            await appointment.save();
            res.status(201).json({status:true, message: 'Appointment created successfully',data: appointment });
        }
    } catch (error) {
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).json(ress);
    }
}
export const findCustomAppoinment = async (request, response) => {
    try {
        const { appointmentId } = request.body;

        const appointment = await Appointment.findOne({ appointmentId });

        if (appointment) {
            return response.status(200).json({
                status: true,
                message: "Appointment exists",
                data: appointment
            });
        } else {
            return response.status(200).json({
                status: false,
                message: "Appointment not exists"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
}
export const customAppointmentList = async (request, response) => {
    try {
        // Find all questions
        const appointments = await Appointment.find();

        if (appointments.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No Appointment exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All appointments retrieved successfully",
            data: appointments
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
export const customAppointmentUserList = async (request, response) => {
    try {
        // Find all questions
        const { userEmail } = request.body;

        const appointments = await Appointment.find({ userEmail: userEmail });

        if (appointments.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No Appointment exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All appointments retrieved successfully",
            data: appointments
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};