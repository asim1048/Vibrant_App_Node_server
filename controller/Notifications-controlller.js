import admin from 'firebase-admin'
import crypto from 'crypto';
import request from 'request';

import Devicetoken from "../model/deviceToken.js";


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
        "private_key_id": "82f42b605d1a39fd0f19198c77077f831cc0a575",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCZE+2YyTJFsw9w\nQnA3PUPtlv5aewHskSizBOvin+CZKjNTU9ufcuzNx4S0qA7+h8ku11cSXYmL68mk\nj0D5HegqyYmoxjG6VjE92TkK9brB8qZ4hobs/vgXqPJld15TTQkNk1NVp6HENJe2\nKcWO+HIqEmBUk8lgPaV0ZrEVU1+55ewc7fdqtJlP2xuKJX5tV22Hp99Y4v9LlBlo\nxSnOU0zYCKJowxsSYNcuyQf38mPU2yG3ygid4Xp7wZag7VG0HpXu6qHLExekbLr0\n6BaR3Jp2j4bqlfKv7y5BO6xsnHAbAOLqA1E0N33m9hc5E91GOBCSIyGi2g8pyJ4o\n1IJuKVidAgMBAAECggEAB8ViN3JnUfCAJSPKTJOYojQbH37FHzxTQ5tJWkzhewUQ\na/eC27pa2St6yi0J7dP4257k9bK369mBeBAprTvecGWgzmeZWKtNfqVLZwoIfBYU\na2Pw75EWCSVzgMEpkbMEdaL4BQ4ogSxmU0IVnGdybD5Yk5KZE4CtqJYaAUolPuug\nCDMrWX1RIgmL4LTzXD33dc5mwokLs7c2jo0TbX1nVpcswolvXSSgZyE2pUdHCQnn\n/gCpQZIEPIqLzFJEFkYVuWI1qkPvsGnTaM0qvyTjBOMvxa0A6XQzVHq+TlwsPT7c\nfPpWO01g2iMvwhOc9PSMudV3gTi9O15kpsRjRl1LgQKBgQDS5ySao1f4/nWLLnn7\nmyzWmUfbE/wdN84+xWzcbhBaJdJrDvV7iiRn63RpGxHU8JkbdOQSi99gyA2YeNQR\ni/T4shNB20R0iwPapILfblYu4N80sa/ADouAVISwJQ02AVtt6bwx7uH6Vn61FPFI\nmjByBUnSKVBPHX/M0LjSX1K7PQKBgQC5z27BJJG/h+Y5d2JAyUraWn7AaE/lezHx\nR0TCcdF3Mqwl1ElcPJlERNJx42xsFm5rh4+bkFU3l1OhSvNI4yDrYQLYeZJQlgXc\nMAibYC/X3Ypps5GWs8VXOx4IbdeCoNVC2DPK430NaYdRuzqV3AFVk1/dALa6k5Wv\nebsKQgpo4QKBgQC+z/3gIvUPBDoY6L3YlHam2huW7KfnT3w8cqahcLs+tIWB8xDK\n6xsxImg6SBGEFQKRQtqupPo/OACE+Jz2GyhScdrWdKmkv7mG8dyuhcdXtoB7zl9y\nZjZ0rwM10u/28pdkBFsO2lB+DA+rif0bcNVv87TsfhB44/mitxzgyPmzCQKBgBOl\nI8+V3zcB1kyDG8c/wQM/CCGtpazcjpY088cfI4dXuy2wuSTgX1ABesKBygfPg1Mp\nHPzUkL306Omns/sj0GoycouSpu6QPgReq7pJvCU1jhnI2360eQvU+0Lm4h80g/ey\nRh+QV7tgSedRRUts3FNA5qTGG4u0aOIJm8Xk35bhAoGBALvOjp0hujSCzzpCZf0j\nL/83d6b74oL2lAfOUmvrxRkO03cqiDKa9CLbn947dKjXkwrgFfTuVp3cSH6Pg/6g\nxJdJIUwuCJUxhMEKD8JbIFuyMAvRhPrCWaLHhgl7sI8gb/Z6CG5gIk+R31fEhOLd\n2Cmaz8jNJLjR60wT0ozmDDfu\n-----END PRIVATE KEY-----\n",
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
        const token ='cDEqeAP8SjS1aQ4d87vC3G:APA91bHNevOuIHO1U7Fr2-kBiOCAPhYAKOliEMSFsoui8KL6APmIJivUsYdbpFOV4j_wOVGw1ldsbPFXU9ZA-nyMPdk3ORqlElCkvHonKne-bmLu9evN7ShCk3mqVzptqHr4Lcp1MI0D';

        const response=  await admin.messaging().sendMulticast({
          tokens: [
            "cMtN9tqWSHCpPmSOwHenQe:APA91bEfYbmo-qCd_XVybJXhaC-wsUjXYKGkHDZigdbs92F0f7LwpZXc1Gj6emkzmABkOuiLI1FpuLZ2J0QsJ9SzmjGuoPp8JBo2rKYrvAgY1qMwWvTdCC94jVLXIv5RXgTv9kfihuuc"
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
                  appointments(first: 18, locationId: $locationId) {
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
                    return {
                        title: `Reminder for ${service.service.name}`,
                        message: `You have an appointment for ${service.service.name} on ${new Date(service.startAt).toLocaleString()}.`,
                        email: email
                    };
                });
            }).flat();


            for (const notification of notifications) {
              const { email, title, message } = notification;

              const userToken = devicetokens.find(token => token.email === email);
              if (userToken) {
                  const response = await admin.messaging().sendMulticast({
                      tokens: [userToken.token],
                      notification: {
                          title: title,
                          body: message,
                          // imageUrl: 'https://my-cdn.com/app-logo.png',

                      },
                  });

                  //console.log(`Notification sent to ${email}: `, response);
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