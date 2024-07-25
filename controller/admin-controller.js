import Admin from "../model/admin.js";
import bcrypt from 'bcrypt';
export const createWebAdmin = async (request, response) => {
    try {
        const { adminID, name,email,password } = request.body;

        let exist = await Admin.findOne({ email });
        if (exist) {
            let res = {
                status: false,
                message: "admin already exists with email",
            };
            return response.status(200).json(res);
        }
        let exist1 = await Admin.findOne({ adminID });
        if (exist1) {
            let res = {
                status: false,
                message: "admin already exists with admin ID",
            };
            return response.status(200).json(res);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user with hashed password
        const newUser = new Admin({
            ...request.body,
            password: hashedPassword
        });

        await newUser.save();
        let res = {
            status: true,
            message: "Admin created successfully",
            data: newUser
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
export const webAdminLogin = async (request, response) => {
    try {
        const { emailOrAdminID, password } = request.body;

        let user = await Admin.findOne({ 
            $or: [
                { email: emailOrAdminID },
                { adminID: emailOrAdminID }
            ]
        });
        if (!user) {
            let res = {
                status: false,
                message: "Admin not found",
            };
            return response.status(200).json(res);
        }

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            let res = {
                status: false,
                message: "Invalid password"
            };
            return response.status(401).json(res);
        }

        let res = {
            status: true,
            message: "Login successful",
            data: user
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