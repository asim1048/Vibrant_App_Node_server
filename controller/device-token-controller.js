import Devicetoken from "../model/deviceToken.js";

export const addToken = async (request, response) => {
    try {
        const { email, token,islogin } = request.body;

        let exist = await Devicetoken.findOne({ email });
        if (exist) {
            exist.token = token;
            exist.islogin = islogin;
            await exist.save();

            let res = {
                status: true,
                message: "Token Updated successfully",
                data:exist

            };
            return response.status(200).json(res);
        }

        // Hash the password
        
        const newToken = new Devicetoken({
            email:email,
            token:token,
            islogin:islogin
        });

        await newToken.save();
        let res = {
            status: true,
            message: "Token created successfully",
            data: newToken
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