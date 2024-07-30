import AppoinmentRating from "../model/appoinmentRating.js";
export const addAppoinmentRating = async (request, response) => {
    try {
        const { appoinmentid,rating, appoinmentDetails,issue,tip } = request.body;

        let exist = await AppoinmentRating.findOne({ appoinmentid });
        if (exist) {
            exist.rating = rating;
            exist.appoinmentDetails = appoinmentDetails;
            exist.issue = issue;
            exist.tip = tip;
            await exist.save();

            let res = {
                status: true,
                message: "Rating Updated successfully",
                data:exist

            };
            return response.status(200).json(res);
        }

        // Hash the password
        
        const newRating = new AppoinmentRating({
            appoinmentid:appoinmentid,
            rating:rating,
            appoinmentDetails:appoinmentDetails,
            issue:issue,
            tip:tip
        });

        await newRating.save();
        let res = {
            status: true,
            message: "Rating added successfully",
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
export const customRatingsList = async (request, response) => {
    try {
        // Find all questions
        const ratings = await AppoinmentRating.find();

        if (ratings.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No Rating exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All ratings retrieved successfully",
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