import AppoinmentTip from "../model/appointmentTip.js";
export const addAppoinmentTip = async (request, response) => {
    try {
        const { appoinmentid, appoinmentDetails,tip } = request.body;

        let exist = await AppoinmentTip.findOne({ appoinmentid });
        if (exist) {
            exist.appoinmentDetails = appoinmentDetails;
            exist.tip = tip;
            await exist.save();

            let res = {
                status: true,
                message: "Tip Updated successfully",
                data:exist

            };
            return response.status(200).json(res);
        }

        // Hash the password
        
        const newRating = new AppoinmentTip({
            appoinmentid:appoinmentid,
            appoinmentDetails:appoinmentDetails,
            tip:tip
        });

        await newRating.save();
        let res = {
            status: true,
            message: "Tip added successfully",
            data: newRating
        };
        return response.status(200).json(res);
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}
export const appoinmentTipCheck = async (request, response) => {
    try {
        const { appoinmentid } = request.body;

        let exist = await AppoinmentTip.findOne({ appoinmentid });
        if (exist) {
           
          

            let res = {
                status: true,
                message: "Tip exists",
                data:exist

            };
            return response.status(200).json(res);
        }
        else {
            let res = {
                status: false,
                message: "Tip not exists",

            };
            return response.status(200).json(res); 
        }

        
    } catch (error) {
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}
export const customTipsList = async (request, response) => {
    try {
        // Find all questions
        const ratings = await AppoinmentTip.find();

        if (ratings.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No Tip exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All Tips retrieved successfully",
            data: ratings
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};