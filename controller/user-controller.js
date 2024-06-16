import User from "../model/user.js"
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'

const SMTP_Email = "asimm1048@gmail.com";
const SMTP_PASSWORD = "swii cnnx anbm cjxl";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SMTP_Email,
        pass: SMTP_PASSWORD,
    },
});

export const signUp = async (request, response) => {
    try {
        const { email, password } = request.body;

        let exist = await User.findOne({ email });
        if (exist) {
            let res = {
                status: false,
                message: "User already exists"
            };
            return response.status(200).json(res);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user with hashed password
        const newUser = new User({
            ...request.body,
            password: hashedPassword
        });

        await newUser.save();
        let res = {
            status: true,
            message: "User created successfully",
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

export const sendOTpForSignUp = async (request, response) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({ email });
        console.log(email)

        if (user) {
            return response.status(200).json({
                status: true,
                message: "Your account already exists",
                data: user
            });
        }


        // Generate a random 6-digit OTP
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const otp = generateOTP();
        

        //Email sending 
        const mailOptions = {
            from: SMTP_Email,
            to: email,
            subject: "Vibrant Life SPA App OTP",
            text: `Hello,\n\nThank you for signing up for Vibrant App. Your OTP (One-Time Password) for account verification is: ${otp}\n\nIf you didn't request this OTP, please ignore this email.\n\nBest regards,\nVirant App Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                response.json({
                    status: true,
                    message: 'OTP sent successfully',
                    otp: otp,
                });
            }
        });


    } catch (error) {
        console.error('Error sending OTP: ', error);
        response.status(500).json({
            status: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};
export const sendOTpForForgotPassword = async (request, response) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(200).json({
                status: false,
                message: "Your do not have an accont for this email",
            });
        }

        // Generate a random 6-digit OTP
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const otp = generateOTP();
        // Send the OTP to the user's phone number via SMS
        // await client.messages.create({
        //     body: `Your OTP for Rescue Meal is ${otp}`,
        //     from: TWNumber,
        //     to: number
        // });
        // response.json({
        //     status: true,
        //     message: 'OTP sent successfully',
        //     otp: otp,
        // });

        const mailOptions = {
            from: SMTP_Email,
            to: email,
            subject: "Vibrant Life SPA App OTP",
            text: `Hello,\n\nYou are receiving this email because you requested to reset your password for Vibrant App. Your OTP (One-Time Password) for password reset is: ${otp}\n\nIf you didn't request this OTP, please ignore this email.\n\nBest regards,\nVibrant App Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                response.json({
                    status: true,
                    message: 'OTP sent successfully',
                    otp: otp,
                });
            }
        });
    } catch (error) {
        console.error('Error sending OTP: ', error);
        response.status(500).json({
            status: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};
export const logIn = async (request, response) => {
    try {
        const { email, password } = request.body;

        const user = await User.findOne({ email });

        if (!user) {
            let res = {
                status: false,
                message: "User not found against this number"
            };
            return response.status(404).json(res);
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
export const checkUser = async (request, response) => {
    try {
        const { email } = request.body;

        const user = await User.findOne({ number });

        if (user) {
            return response.status(200).json({
                status: true,
                message: "User exists",
                data: user
            });
        } else {
            return response.status(404).json({
                status: false,
                message: "User does not exist"
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
export const userInfoByID = async (request, response) => {
    try {
        const { id } = request.body;

        const user = await User.findById(id);

        if (user) {
            return response.status(200).json({
                status: true,
                message: "User exists",
                data: user
            });
        } else {
            return response.status(404).json({
                status: false,
                message: "User does not exist"
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
export const updatePassword = async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });

        if (!user) {
            let res = {
                status: false,
                message: "User not found"
            };
            return response.status(404).json(res);
        }

        const hashedNewPassword = await bcrypt.hash(password, 10);

        user.password = hashedNewPassword;
        await user.save();

        let res = {
            status: true,
            message: "Password updated successfully",
            data:user
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



export const usersList = async (request, response) => {
    try {
        // Find all questions
        const allUsers = await User.find();

        if (allUsers.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No user exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All users retrieved successfully",
            data: allUsers
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
export const deleteUser = async (request, response) => {
    try {
        const { email } = request.body;

        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return response.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return response.status(200).json({
            status: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};
