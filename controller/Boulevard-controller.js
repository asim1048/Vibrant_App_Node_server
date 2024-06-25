import crypto from 'crypto';
import request from 'request';
import axios from 'axios';



const API_KEY = 'c545e74b-5ddc-4ebc-b706-26073b2d04f1';
const SECRET_KEY = 'ODFue3QbsLKGq+9g/ZXuzoGmQe6uBeqFVD/9pGi/b98=';
const BUSINESS_ID = '49fcc618-b077-49cc-8666-3efc31348cac';
let http_basic_header = "";
const generateAuthClientHeaderToken = () => {
    // Concatenate the API_KEY with a colon
    const httpBasicPayload = `${API_KEY}:`;

    // Base64 encode the resulting string
    const httpBasicCredentials = Buffer.from(httpBasicPayload).toString('base64');

    // Create the Authorization header
    const httpBasicHeader = `Basic ${httpBasicCredentials}`;

    return httpBasicHeader;
};

const generateAuthTokenOneTime = () => {
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
    http_basic_header = `Basic ${http_basic_credentials}`;


};
generateAuthTokenOneTime()
const generateAuthToken = () => {
    return http_basic_header;
}
// console.log("http_basic_header", http_basic_header)




export const getlocationAppointments = async (req, res) => {
    try {
        const { locationid, email } = req.body;
        console.log("SALAM");

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
                                    appointmentCount
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

        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to fetch appointments",
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array
                const appointments = parsedData.data.appointments.edges.map(edge => edge.node);

                // Step 3: Filter the appointments based on the provided email
                const filteredAppointments = appointments.filter(appointment => appointment.client.email === email);
                // Step 4: Transform the filtered appointments into an easy format
                const simplifiedAppointments = filteredAppointments.map(appointment => ({
                    client: appointment.client,
                    services: appointment.appointmentServices,
                    clientid: appointment.clientId,
                    id: appointment.id
                }));

                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Appointments fetched successfully",
                    data: simplifiedAppointments
                };
                console.log("ress", ress);
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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

export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId, notes, reason } = req.body;

        // Validate inputs
        if (!appointmentId) {
            return res.status(400).json({ status: false, message: "Appointment ID is required." });
        }



        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query: `mutation cancelAppointment($input: CancelAppointmentInput!) {
                    cancelAppointment(input: $input) {
                        appointment {
                            id
                            cancelled
                        }
                    }
                }`,
                variables: {
                    input: {
                        id: appointmentId,
                        reason: "CLIENT_CANCEL", // Specify a valid cancellation reason here
                        notes: notes || '' // Optional notes
                    }
                }
            })
        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to fetch appointments",
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Appointments canceled successfully",
                    data: parsedData
                };
                console.log("ress", ress);
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
        });


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Something went wrong in the backend", error: error.message });
    }
};
export const getAvailableRescheduleDates = async (req, res) => {
    try {
        const { appointmentId, searchRangeLower, searchRangeUpper, tz } = req.body;

        // Validate inputs
        if (!appointmentId || !searchRangeLower || !searchRangeUpper) {
            return res.status(400).json({ status: false, message: "Appointment ID, search range lower and upper dates are required." });
        }

        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query: `mutation getAvailableRescheduleDates($input: AppointmentRescheduleAvailableDatesInput!) {
                    appointmentRescheduleAvailableDates(input: $input) {
                        availableDates {
                            date
                        }
                    }
                }`,
                variables: {
                    input: {
                        appointmentId,
                        searchRangeUpper,
                        searchRangeLower
                    }
                }
            })
        };

        request(options, function (error, response) {
            if (error) {
                console.log("error", error);
                let ress = {
                    status: false,
                    message: "Failed to fetch available reschedule dates",
                };
                return res.status(200).json(ress);
            }

            try {
                const parsedData = JSON.parse(response.body);

                let ress = {
                    status: true,
                    message: "Available reschedule dates fetched successfully",
                    data: parsedData,
                };
                console.log("ress", ress);
                return res.status(200).json(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Something went wrong in the backend", error: error.message });
    }
};
export const getAvailableRescheduleTimes = async (req, res) => {
    try {
        const { appointmentId, date, tz } = req.body;

        // Validate inputs
        if (!appointmentId || !date) {
            return res.status(400).json({ status: false, message: "Appointment ID and date are required." });
        }

        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query: `mutation getAvailableRescheduleTimes($input: AppointmentRescheduleAvailableTimesInput!) {
                    appointmentRescheduleAvailableTimes(input: $input) {
                        availableTimes {
                            bookableTimeId
                            startTime
                        }
                    }
                }`,
                variables: {
                    input: {
                        appointmentId,
                        date,
                        tz
                    }
                }
            })
        };

        request(options, function (error, response) {
            if (error) {
                console.log("error", error);
                let ress = {
                    status: false,
                    message: "Failed to fetch available reschedule times",
                };
                return res.status(200).json(ress);
            }

            try {
                const parsedData = JSON.parse(response.body);

                let ress = {
                    status: true,
                    message: "Available reschedule times fetched successfully",
                    data: parsedData,
                };
                console.log("ress", ress);
                return res.status(200).json(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Something went wrong in the backend", error: error.message });
    }
};
export const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId, bookableTimeId, sendNotification } = req.body;
        console.log(typeof bookableTimeId)

        // Validate inputs
        if (!appointmentId || !bookableTimeId || sendNotification === undefined) {
            return res.status(400).json({ status: false, message: "Appointment ID, bookable time ID, and sendNotification are required." });
        }

        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query: `mutation rescheduleAppointment($input: AppointmentRescheduleInput!) {
                    appointmentReschedule(input: $input) {
                        appointment {
                            id
                            startAt
                            endAt
                        }
                    }
                }`,
                variables: {
                    input: {
                        appointmentId,
                        bookableTimeId,
                        sendNotification
                    }
                }
            })
        };

        request(options, function (error, response) {
            if (error) {
                console.log("error", error);
                let ress = {
                    status: false,
                    message: "Failed to reschedule appointment",
                };
                return res.status(200).json(ress);
            }

            try {
                const parsedData = JSON.parse(response.body);

                let ress = {
                    status: true,
                    message: "Appoinment updated successfully",
                    data: parsedData,
                };
                console.log("ress", ress);
                return res.status(200).json(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Something went wrong in the backend", error: error.message });
    }
};

export const appoinmentCheckinArrived = async (req, res) => {
    try {
        const { id, notes, state, customFields } = req.body;

        const mutation = `
        mutation updateAppointment($input: UpdateAppointmentInput!) {
          updateAppointment(input: $input) {
            appointment {
              id
              notes
              state
              
            }
          }
        }`;
    
        const variables = {
            input: {
                id,
                notes,
                state
            }
        };

        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query: mutation, variables })
        };

        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to fetch appointments",
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array
               
                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Appointments fetched successfully",
                    data: parsedData
                };
                console.log("ress", ress);
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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





export const getlocations = async (req, res) => {
    try {

        var options = {
            'method': 'POST',
            'url': `https://dashboard.boulevard.io/api/2020-01/admin`,
            'headers': {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query: `query {
              
                  locations(first: 10) {
                    edges {
                      node {
                        id
                        name
                        phone
              
                        
                      }
                    }
                  }
                
              }`,
                variables: {}
            })
        };

        request(options, function (error, response) {
            if (error) {
                let ress = {
                    status: false,
                    message: "Failed to fetch locations",
                    data: response.body
                };
                return res.status(200).json(ress);
            }
            let ress = {
                status: true,
                message: "Locations fetched successfully",
                data: response.body
            };
            return res.status(200).json(ress);
        });


    } catch (error) {
        console.log(error)
        let res = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return response.status(500).json(res);
    }
}

export const getAppoinmentManageURL = async (req, res) => {
    try {
        const appointmentId = req.body.appointmentId;

        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query: `query { 
                    appointment(id: "${appointmentId}") {
                        appointmentServiceOptions {
                            serviceOptionId
                            id
                            appointmentServiceId
                        }
                        appointmentServices {
                            service {
                                name
                                serviceOptionGroups {
                                    name
                                    serviceOptions {
                                        name
                                        id
                                    }
                                }
                            }
                        }
                        manageUrl
                        orderId
                    }
                }`,
                variables: {}
            })
        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to fetch appointments",
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Appointments fetched successfully",
                    data: parsedData
                };
                console.log("ress", ress);
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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


//Book Appoinments////

//1. Choose location
//2. Creat Cart
//4. Add an Item to the Cart
//5. Fetch Time Slots against the desired date
//
export const createAppoinmentCart = async (req, res) => {
    try {
        const { locationId } = req.body;


        const query = `
    mutation {
        createCart(input: {
            locationId: "${locationId}"
        }) {
            cart {
                id
                availableCategories {
                    name
                    availableItems {
                        id
                        name
                    }
                }
            }
        }
    }
`;


        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Cart Created successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const addClientInfoToAppoinmentCart = async (req, res) => {
    try {
        const { cartId,clientInformation } = req.body;


        const query = `
            mutation {
                updateCart(input: {
                    id: "${cartId}",
                    clientInformation: {
                        email: "${clientInformation.email}",
                        firstName: "${clientInformation.firstName}",
                        lastName: "${clientInformation.lastName}",
                        phoneNumber: "${clientInformation.phoneNumber}"
                    }
                }) {
                    cart {
                        id
                    }
                }
            }
`;


        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Client info added to cart successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const addItemtoAppoinmentCart = async (req, res) => {
    try {
        const { cartId, itemId, itemStaffVariantId } = req.body;

        // Construct the mutation dynamically
        const query = `
        mutation {
            addCartSelectedBookableItem(input: {
                id: "${cartId}",
                itemId: "${itemId}",
                ${itemStaffVariantId ? `itemStaffVariantId: "${itemStaffVariantId}"` : ''}
            }) {
                cart {
                    id
                }
            }
        }
    `;


        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Item added to cart successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const appointmentAvailableTimeSlots = async (req, res) => {
    try {
        const { cartId, date } = req.body;

        const query = `query {
            cartBookableTimes(
                id: "${cartId}",
                searchDate: "${date}",
                tz: "America/Los_Angeles"
            ) {
                id
                score
                startTime
            }
        }`;



        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Time slots fetched successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const addSelectedTimeToCart = async (req, res) => {
    try {
        const { cartId, bookableTimeId } = req.body;

        const query = `mutation {
            reserveCartBookableItems(input: {
                id: "${cartId}",
                bookableTimeId: "${bookableTimeId}"
            }) {
                cart {
                    id
                }
            }
        }`;



        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Time slot added to cart successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const addPaymentMethodToAppoinmentCart = async (req, res) => {
    try {
        const { cardDetails, cartId } = req.body;

        const tokenizationUrl = 'https://vault-sandbox.joinblvd.com/cards/tokenize';
        const tokenizationResponse = await axios.post(tokenizationUrl, { card: cardDetails });
        const dataa = tokenizationResponse.data;
        console.log("cardDetails",tokenizationResponse)

        let ress = {
            status: true,
            message: "Card details added successfully",
            data: dataa
        };
        return res.status(200).send(ress);

        


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
export const addPaymentTokenToCart = async (req, res) => {
    try {
        const { paymentToken, cartId } = req.body;

        

        const query = `mutation {
  addCartCardPaymentMethod(input: {
    id: "${cartId}",
    token: "${paymentToken}",
    select: true
  }) {
    cart {
      id
    }
  }
}`;



        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Card Token added successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const checkoutAppoinmentCart = async (req, res) => {
    try {
        const { cartId } = req.body;

        const query = `mutation {
  checkoutCart(input: {
    id: "${cartId}"
  }) {
    cart {
      id
      completedAt
    }
  }
}`;



        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Appoinment created successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const locationServices = async (req, res) => {
    try {
        const { id } = req.body;

        const query = `query {
  location(id: "${id}") {
    id
    name
    businessName
    services {
      edges {
        node {
          id
          name
          categoryId
          category {
            id
            name
          }
          duration
          price
          description
          availableStaff {
            edges {
              node {
                id
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
}
`;



        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({ query })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Services fetched successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
//   User Authentication
//1. Login
export const createCartforUser = async (req, res) => {
    try {
        const { clientInformation, locationId } = req.body;

        const query = `
        mutation createCart($input: CreateCartInput!) {
            createCart(input: $input) {
                cart {
                    id
                    clientInformation {
                        email
                        externalId
                        firstName
                        lastName
                        phoneNumber
                    }
                    
                }
            }
        }
    `;

        const variables = {
            input: {
                clientInformation,
                locationId
            }
        };



        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query,
                variables
            })

        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Cart Created successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const sendOTPforLoginViaNumber = async (req, res) => {
    try {
        const { mobilePhone } = req.body;

        const query = `
        mutation sendCartOwnershipCodeBySms($input: SendCartOwnershipCodeBySmsInput!) {
            sendCartOwnershipCodeBySms(input: $input) {
                cartOwnershipCodeId
            }
        }
    `;

        const variables = {
            input: {
                mobilePhone: mobilePhone
            }
        };

        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query,
                variables
            })
        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "OTP sent successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const sendOTPforLoginViaEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const query = `
        mutation sendCartOwnershipCodeByEmail($input: SendCartOwnershipCodeByEmailInput!) {
            sendCartOwnershipCodeByEmail(input: $input) {
                cartOwnershipCodeId
            }
        }
    `;

        const variables = {
            input: {
                email: email
            }
        };

        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query,
                variables
            })
        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "OTP sent successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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
export const verifyLoginUsingOTP = async (req, res) => {
    try {
        const { cartId, cartOwnershipCodeId, cartOwnershipCodeValue } = req.body;

        const query = `
        mutation takeCartOwnershipByCode($input: TakeCartOwnershipByCodeInput!) {
            takeCartOwnershipByCode(input: $input) {
                cart {
                    id
                    clientInformation {
                        email
                        firstName
                        lastName
                        phoneNumber
                    }
                }
            }
        }
    `;

        const variables = {
            input: {
                cartId,
                cartOwnershipCodeId,
                cartOwnershipCodeValue
            }
        };


        const options = {
            method: 'POST',
            url: `https://dashboard.boulevard.io/api/2020-01/${BUSINESS_ID}/client`,
            headers: {
                'Authorization': generateAuthClientHeaderToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query,
                variables
            })
        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to create cart",
                    error: error,
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Signin successfully",
                    data: parsedData
                };
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
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

//2. createclient
export const createClient = async (req, res) => {
    try {
        const { dob, email, externalId, firstName, lastName, mobilePhone, pronoun } = req.body;

        // Define the GraphQL mutation
        const query = `mutation {
            createClient(input: {
                dob: "${dob}",
                email: "${email}",
                externalId: "${externalId}",
                firstName: "${firstName}",
                lastName: "${lastName}",
                mobilePhone: "${mobilePhone}",
                pronoun: "${pronoun}"
            }) {
                client {
                    id
                    dob
                    email
                    externalId
                    firstName
                    lastName
                    mobilePhone
                    pronoun
                }
            }
        }`;
        // Send the mutation using fetch
        const options = {
            method: 'POST',
            url: 'https://dashboard.boulevard.io/api/2020-01/admin',
            headers: {
                'Authorization': generateAuthToken(),
                'Content-Type': 'application/json',
                'Cookie': '_sched_cookie=QTEyOEdDTQ.mHsjUNLA3eGUf6OmzUPJlNoEg227-wXF8K5Cb2FDnd5BWY7-PPIQNqdoe4g.NQZg_DkYRfNNTnUt.lS9dUheX7017zTzgniU528Sy5i5a-btIbuUHVfAwFkk_fKzLSuC2qCO1EyR-8thrXff1.u_QbKX6kddDkOr8fS2oY2g'
            },
            body: JSON.stringify({
                query,
                variables: {}
            })
        };
        request(options, function (error, response) {
            if (error) {
                console.log("error", error)
                let ress = {
                    status: false,
                    message: "Failed to fetch appointments",
                };
                return res.status(200).json(ress);
            }

            try {
                // Step 1: Parse the JSON string inside the response body
                const parsedData = JSON.parse(response.body);

                // Step 2: Navigate to the appointments array


                // Now `simplifiedAppointments` contains the array of simplified appointment nodes
                let ress = {
                    status: true,
                    message: "Client created successfully",
                    data: parsedData
                };
                console.log("ress", ress);
                return res.status(200).send(ress);
            } catch (parseError) {
                let ress = {
                    status: false,
                    message: "Failed to parse response",
                    error: parseError.message
                };
                return res.status(500).json(ress);
            }
        });

    } catch (error) {
        console.log(error);
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error.message,
        };
        return res.status(500).json(ress);
    }
};