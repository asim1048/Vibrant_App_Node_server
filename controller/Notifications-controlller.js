import admin from 'firebase-admin'
import crypto from 'crypto';
import request from 'request';

import Devicetoken from "../model/deviceToken.js";
import Notification from '../model/notification.js'


const API_KEY = 'c545e74b-5ddc-4ebc-b706-26073b2d04f1';
const SECRET_KEY = 'ODFue3QbsLKGq+9g/ZXuzoGmQe6uBeqFVD/9pGi/b98=';
const BUSINESS_ID = '49fcc618-b077-49cc-8666-3efc31348cac';

const generateAuthToken = () => {
  // Generate a token payload
  const prefix = 'blvd-admin-v1';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const token_payload = `${prefix}${BUSINESS_ID}${timestamp}`;

  // Sign the payload
  const raw_key = Buffer.from(SECRET_KEY, 'base64');
  const hmac = crypto.createHmac('sha256', raw_key);
  hmac.update(token_payload);
  const raw_mac = hmac.digest();
  const signature = raw_mac.toString('base64');

  // Concatenate signature and payload
  const token = `${signature}${token_payload}`;

  // Create HTTP credentials
  const http_basic_payload = `${API_KEY}:${token}`;
  const http_basic_credentials = Buffer.from(http_basic_payload).toString('base64');

  // Create HTTP Authorization header
  const http_basic_header = `Basic ${http_basic_credentials}`;

  return http_basic_header;
};

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "vibrant-life-spa",
        "private_key_id": "6d3d131e93387eaa3492993584bff6fcb3fb78fa",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDK0Sazm3bq27lX\nguop7f4mquMBq5PD6hasUO4tA7cxxulRl9vj0fojvXfCUS3v5TS1bPlt4Z2Fh22m\ne+ai2oabbsXNJL7yxd21RAZme+wKtP88ECSYWjqzMRGo00fFEfiXiJNoPRNc4rcL\nRRQ8FNsI6UbdKxaW6KCU5befokETEHUWnAsW9k9FZ08ZOtwCL4feY1IbtKrdPHwH\nPtiTYTG3VoxsGbn5k0ln1QHtFTiSN3uZZtTuCqMRNwo57n21ISTzmL6ozevBh93F\nTQFJZ1PlR03PJslqUr7yCYbXVu/35PdPNuivJ5j4e+VJ5S39btF5FULQhhyPTonP\nMTaA5uGZAgMBAAECggEAGO9KUAoUvm6ZlIf4lIOZO7VGN/IZdlxtAa3oflnG18SR\n8lFWfCWYWHUGiHoVCPmXt5doegkjJeO+yBlTA2IU6v6dLGmwXSYU6iBtHgPtwuo6\nN+7vJNjw/w9REb26BOE+/BhTMR1TKFgKM4VAZduVizys1OujeRWsCmpMn0BiOj7T\nbgsNk3VERZlBg9F59wZ+1gFEuPH18oU45tcTZNDMc+F0Qo8jaFweFG0bRkaSQ0Tm\nvNqXxhnX2YCu9jZklthGZLkPbJIln3vD3MfK5IKfiIAHpKOMKlunxfkrtYW5ef+o\nMZEq5PAZa2wybt6jsLccVqbE6V9S+ZbCS86aOVHJIQKBgQDp+cIh9szQ5UwLMCv4\nSYIDAjEv71/2X2A+Mt33zxMLtTelqJ/diOTC/3hJa0Lz8k5JoBrC3ktul74RoyXC\n6JberaBfAG+ArUbcKTmLWcjRJic0hS3eWb6HQeHZHxNxqILlRW81JILF8GA6jjB0\nSFGMCFLprmmAJWs8g/F/s5Oa0QKBgQDd6IvLOixIR2Ly2yZkbJ+TQMzwOk4VeGHQ\n7Uv87cMurziPsLWmeXM/RnqMgXoM1kTHkzeSuf8uRJHwAXknS4IDlSgx2nCyf/Vw\noz5nYemq4SLPkCr7clE4hJ7N5DEAc52TEVKSoTXnFmLbqzzMODr8IfezSqFYkuox\nOooqD0r8SQKBgD3rmzTh29Js3HMZjIlo6r9hFSNadkr9crsDOzsZ0jCHBPMSbTxz\nvhbdBTho6o8k0RMrC+oGanAaOHLyekvawhKsYITD2L51HQum3VPDryGqtzVvCXSO\ny52AEgUj9EFgF0QV3Bh0USeRNeZJOwmLGgm1KjwtrD39qSOax47EN4wBAoGBALaE\nAQ7LLwbX6DOVOlOY3/sObkEbw4N3OwTLWBeVO1cXeS7+Cbn95GNjxYHxMICEb5ey\npx/AaXkVnu7HV22RdkMaGDBA2TaHdkkJi1ceukD44VfU3PVpRhJ1SeRQTllvvmfq\n9H5zp9EEoZTJl7zkdudPzNqjhGdEluicnG0RnPw5AoGALXrfJTBEdn4nVaxtDJcb\n4BtEu4jEqgIMKBfTZPrjUoYL+u0nKZ0twPsejKS77/j7PtF+vLNMV95YnUVuxc1Z\nbltEIp3aPXXmfGC4h18aZ+joydr3TKrdKx2s/onUZDTfTeipBD16WVglLCPbamQd\nOwr4N/GTuRO3RgjAGv3uZpw=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-9m8d9@vibrant-life-spa.iam.gserviceaccount.com",
        "client_id": "112560602078692847479",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9m8d9%40vibrant-life-spa.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      }
      )
  });


  export const sendNotifications = async (req, res) => {
    try {
        const token ='dEEvoLDfQty3q7kqIyPOJw:APA91bGHtxFHpW1-zT1TsvF2xlroiP_6b0LPuzUmwQ1hAj1JbjWZt5ZU8Ag1uNSIbhr61vrXPvOzWEj3ChnngqXDSFRZexve4rXWhoTRsvz-MRbMERHN9kvO0PIe4xFt2-AhpItgjVAT';

        const response=  await admin.messaging().sendMulticast({
          tokens: [
            token
          ], // ['token_1', 'token_2', ...]
          notification: {
            title: 'Basic Notification',
            body: 'This is a basic notification sent from the server!',
            imageUrl: 'https://img1.wsimg.com/isteam/ip/d0906e9b-1241-41aa-a892-de5df678e4bf/blob-1757602.png/:/rs=w:151,h:151,cg:true,m/cr=w:151,h:151/qt=q:95',
          },
        });

    //const response = await admin.messaging().send(message);
    return res.status(200).json({
        status: true,
        message: "Sent",
        data:response
    });
    } catch (error) {
        console.log(error);
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).json(ress);
    }
};


export const sendNotificationsScheduled = async () => {
  try {
     const locationid="urn:blvd:Location:90184c75-0c8b-48d8-8a8a-39c9a22e6099"
     const devicetokens = await Devicetoken.find({ islogin: true });

      const options = {
          method: 'POST',
          url: 'https://dashboard.boulevard.io/api/2020-01/admin',
          headers: {
              'Authorization': generateAuthToken(),
              'Content-Type': 'application/json',
              'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
          },
          body: JSON.stringify({
              query: `query($locationId: ID!) {
                  appointments(first: 1000, locationId: $locationId) {
                      edges {
                          node {
                              id
                              clientId
                              client {
                                  name
                                  createdAt
                                  email
                                  mobilePhone
                                  notes {
                                      createdAt
                                      id
                                      text
                                  }
                                  tags {
                                      id
                                      name
                                      symbol
                                  }
                              }
                              appointmentServices {
                                  staffId
                                  startAt
                                  price
                                  service {
                                      name
                                      id
                                  }
                              }
                          }
                      }
                  }
              }`,
              variables: { locationId: locationid }
          })
      };
     
      request(options,async function (error, response) {
          if (error) {
              console.log("error",error)
              
          }

          try {
              // Step 1: Parse the JSON string inside the response body
              const parsedData = JSON.parse(response.body);

              // Step 2: Navigate to the appointments array
              const appointments = parsedData.data.appointments.edges.map(edge => edge.node);

              // Step 4: Transform the filtered appointments into an easy format
              const simplifiedAppointments = appointments.map(appointment => ({
                  client: appointment.client,
                  services: appointment.appointmentServices,
                  clientid:appointment.clientId,
                  id:appointment.id
              }));

              const notifications = simplifiedAppointments.map(appointment => {
                const email = appointment.client.email;
                return appointment.services.map(service => {
                    const appointmentDate = new Date(service.startAt);
                    const currentDate = new Date();
                    const isFutureAppointment = appointmentDate > currentDate;
                
                    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
                    const formattedDate = appointmentDate.toLocaleString('en-US', options);
                
                    const message = isFutureAppointment 
                        ? `You have an upcoming appointment for ${service.service.name} on ${formattedDate}.`
                        : `You had an appointment for ${service.service.name} on ${formattedDate}.`;
                
                    return {
                        id: appointment.id,
                        title: `Appoinment for ${service.service.name}`,
                        message: message,
                        email: email
                    };
                });
                
            }).flat();


            for (const notification of notifications) {
              const { email, title, message,id } = notification;

              const userToken = devicetokens.find(token => token.email === email);
              const notificationn=await Notification.findOneAndUpdate(
                { appointmentId: id }, // Search criteria
                { email, title, message, appointmentId: id }, // Data to update
                { upsert: true, new: true } // Options: create if not exists, return the new document
              );
             await notificationn.save();
              if (userToken) {
                  const response = await admin.messaging().sendMulticast({
                      tokens: [userToken.token],
                      notification: {
                          title: title,
                          body: message,
                          // imageUrl: 'https://my-cdn.com/app-logo.png',

                      },
                  });

                  console.log(`Notification sent to ${email}: `, response);
              }
          }
                          
           //   console.log("ress", ress);
                             console.log("scheduled notification ");

              
          } catch (parseError) {
             
          }
      });
  } catch (error) {
      console.log(error);
      
  }
};
export const userNotifications = async (request, response) => {
    try {
        const { email } = request.body;

        const notifications = await Notification.find({ email: email });
        
            return response.status(200).json({
                status: true,
                message: "Notifications fetched",
                data: notifications
            });
        
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
}
export const addNotification = async (request, response) => {
    try {
        const {email,notificationType,appoinmentid, title, message } = request.body;
        const deviceToken = await Devicetoken.findOne({ email: email });
        console.log(deviceToken.token)

        
        const newNotification = new Notification({
            email:email,
            notificationType:notificationType,
            title:title,
            appointmentId:appoinmentid,
            message:message
        });

        await newNotification.save();

        const firebaseresponse = await admin.messaging().sendMulticast({
            tokens: [deviceToken.token],
            notification: {
                title: title,
                body: message,
                // imageUrl: 'https://my-cdn.com/app-logo.png',

            },
        });

        let res = {
            status: true,
            message: "Notification created successfully",
            data: newNotification,
            firebaseresponse:firebaseresponse,
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