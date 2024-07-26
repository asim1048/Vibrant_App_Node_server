import express from 'express';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_0LCkeYaoLBJUzPSBsgNLXxu6');

//Users
import { signUp,sendOTpForSignUp,sendOTpForForgotPassword, logIn,userInfoByID, updatePassword, checkUser, usersList, deleteUser } from '../controller/user-controller.js';

//Boulevard
import { getlocationAppointments,cancelAppointment,getAvailableRescheduleDates,getAvailableRescheduleTimes,rescheduleAppointment,appoinmentCheckinArrived,getlocations,getAppoinmentManageURL,locationServices,createAppoinmentCart,addClientInfoToAppoinmentCart,addItemtoAppoinmentCart ,appointmentAvailableTimeSlots,addSelectedTimeToCart,addPaymentMethodToAppoinmentCart,addPaymentTokenToCart,checkoutAppoinmentCart} from '../controller/Boulevard-controller.js';
import {createCartforUser, sendOTPforLoginViaNumber ,sendOTPforLoginViaEmail,verifyLoginUsingOTP,createClient,getClientInfo,updateClient} from '../controller/Boulevard-controller.js';
import { cartItemswithAdons ,getStafsList,getAllStafs,addStaffToCart} from '../controller/Boulevard-controller.js';
import { getMemberships,getMyMemberships,pauseMembership,unpauseMembership,cancelMembership } from '../controller/Boulevard-controller.js';
import { getServices,getProducts,createMembershipCart ,addProdutToMembershipCart,addClientInfoMembershipCart,addPaymentMethodToMembershipCart,addPaymentTokenToMembershipCart,checkoutMembershipCart} from '../controller/Boulevard-controller.js';
import { clientEnrollmentinLoyality } from '../controller/Boulevard-controller.js';
//Token
import { addToken } from '../controller/device-token-controller.js';

import { sendNotifications ,userNotifications,addNotification} from '../controller/Notifications-controlller.js';
import { addAppoinmentRating } from '../controller/appoinment-rating-controller.js';

import { createOrUpdate,findCustomService ,customServicesList} from '../controller/service-controller.js';
import { createWebAdmin,webAdminLogin } from '../controller/admin-controller.js';
import upload from '../middleware/multer.js';



const route = express.Router();

route.get("/", (req, res) => {
    res.send("Hi, This is Vibrant App Server Developed by Asim");
});
route.post('/signUp', signUp)
route.post('/sendOTpForSignUp', sendOTpForSignUp)
route.post('/sendOTpForForgotPassword', sendOTpForForgotPassword)
route.post('/logIn', logIn)
route.post('/userInfoByID', userInfoByID)
route.post('/updatePassword', updatePassword)
route.post('/checkUser', checkUser)
route.get('/usersList', usersList)
route.post('/deleteUser', deleteUser)

route.post('/sendOTp', async (req, res) => {
    try {

        // Generate a random 6-digit OTP
        const generateOTP = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const { phoneNumber } = req.body;
        const otp = generateOTP();

        // Send the OTP to the user's phone number via SMS
      
        res.json({
            status: true,
            message: 'OTP sent successfully',
            otp: otp,
        });
    } catch (error) {
        console.error('Error sending OTP: ', error);
        res.status(500).json({
            status: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
});

route.post('/uploadDP', upload.single('image'), async (request, response) => {
    try {
        const { number } = request.body;
        const user = await User.findOne({ number });

        if (!user) {
            return response.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // Update the user's image path
        user.image = request.file ? request.file.path : user.image;
        await user.save();

        // Construct the image URL using the base URL and the user's image path
        const imageUrl = `${request.protocol}://${request.get('host')}/${user.image}`;

        return response.status(200).json({
            status: true,
            message: "Profile image uploaded successfully",
            data: {
                ...user.toObject(),
                image: imageUrl
            }
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
});


// Boulevard 

route.post('/getlocationAppoinments', getlocationAppointments)
route.post('/cancelAppointment', cancelAppointment)
route.post('/getAvailableRescheduleDates', getAvailableRescheduleDates)
route.post('/getAvailableRescheduleTimes', getAvailableRescheduleTimes)
route.post('/rescheduleAppointment', rescheduleAppointment)
route.post('/appoinmentCheckinArrived', appoinmentCheckinArrived)
route.get('/getlocations', getlocations)
route.post('/getAppoinmentManageURL', getAppoinmentManageURL)
route.post('/locationServices', locationServices)


//Creating Appoinment
route.post('/createAppoinmentCart', createAppoinmentCart)
route.post('/addItemtoAppoinmentCart', addItemtoAppoinmentCart)
route.post('/appointmentAvailableTimeSlots', appointmentAvailableTimeSlots)
route.post('/addSelectedTimeToCart', addSelectedTimeToCart)
route.post('/addPaymentMethodToAppoinmentCart', addPaymentMethodToAppoinmentCart)
route.post('/addPaymentTokenToCart', addPaymentTokenToCart)
route.post('/checkoutAppoinmentCart', checkoutAppoinmentCart)
route.post('/cartItemswithAdons', cartItemswithAdons)
route.post('/getStafsList', getStafsList)
route.post('/getAllStafs', getAllStafs)
route.post('/addStaffToCart', addStaffToCart);


//User Auth Boulevard
route.post('/createCartforUser', createCartforUser)
route.post('/addClientInfoToAppoinmentCart', addClientInfoToAppoinmentCart)
route.post('/sendOTPforLoginViaNumber', sendOTPforLoginViaNumber)
route.post('/sendOTPforLoginViaEmail', sendOTPforLoginViaEmail)
route.post('/verifyLoginUsingOTP', verifyLoginUsingOTP)
//For signup Blb
route.post('/createClient', createClient)
route.post('/getClientInfo', getClientInfo)
route.post('/updateClient', updateClient)


//Memberships
route.get('/getMemberships', getMemberships)
route.post('/getMyMemberships', getMyMemberships)
route.post('/pauseMembership', pauseMembership)
route.post('/unpauseMembership', unpauseMembership)
route.post('/cancelMembership', cancelMembership)

route.get('/getProducts', getProducts)
route.post('/createMembershipCart', createMembershipCart)
route.post('/addProdutToMembershipCart', addProdutToMembershipCart)
route.post('/addClientInfoMembershipCart', addClientInfoMembershipCart)
route.post('/addPaymentMethodToMembershipCart', addPaymentMethodToMembershipCart)
route.post('/addPaymentTokenToMembershipCart', addPaymentTokenToMembershipCart)
route.post('/checkoutMembershipCart', checkoutMembershipCart)

//Loyality
route.post('/clientEnrollmentinLoyality', clientEnrollmentinLoyality)


//services
route.get('/getServices', getServices)





route.get('/sendNotifications', sendNotifications)
route.post('/userNotifications', userNotifications)
route.post('/addNotification', addNotification)


route.post('/addToken', addToken)

//custom appoinmentRating
route.post('/addAppoinmentRating', addAppoinmentRating);

//custom service handling
route.post('/createOrUpdate',  createOrUpdate);
route.post('/findCustomService',  findCustomService);
route.get('/customServicesList',  customServicesList);

//Create Web Admin

route.post('/createWebAdmin',  createWebAdmin);
route.post('/webAdminLogin',  webAdminLogin);


// STRIPE----------------

route.post('/create-payment-intent',  async(req,res)=>{
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: 1099,
            currency: 'usd',
          });
          res.status(200).json(paymentIntent)
    }catch(error){
        res.status(505).send(json.stringify(error))
    }
});


export default route;
