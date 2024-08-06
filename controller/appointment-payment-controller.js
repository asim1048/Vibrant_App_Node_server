import Appointment from "../model/appointmentPayment.js";
export const createOrUpdateAppoinmentPayment = async (req, res) => {
    const { userEmail, paidAmount,appointmentDetails } = req.body;

    try {
        
            // Create a new service
           const appointment = new Appointment({
                userEmail,
                 paidAmount,
                 appointmentDetails
            });
            await appointment.save();
            res.status(201).json({status:true, message: 'Appointment Payment created successfully',data: appointment });
       
    } catch (error) {
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).json(ress);
    }
}

export const customAppointmentPaymentList = async (request, response) => {
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
export const customAppointmentPaymentUserList = async (request, response) => {
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