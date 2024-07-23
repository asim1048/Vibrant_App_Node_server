import Service from "../model/services.js";
export const createOrUpdate = async (req, res) => {
    const { serviceId, name, description,image } = req.body;

    try {
        let service = await Service.findOne({ serviceId });

        if (service) {
            // Update the existing service
            service.name = name || service.name;
            service.description = description || service.description;
            service.image = image;
            await service.save();
            res.status(200).json({status:true, message: 'Service updated successfully',data: service });
        } else {
            // Create a new service
            service = new Service({
                serviceId,
                name,
                description,
                image: image 
            });
            await service.save();
            res.status(201).json({status:true, message: 'Service created successfully',data: service });
        }
    } catch (error) {
        let ress = {
            status: false,
            message: "Something went wrong in the backend",
            error: error,
        };
        return res.status(500).json(ress);
    }
}
export const findCustomService = async (request, response) => {
    try {
        const { serviceId } = request.body;

        const service = await Service.findOne({ serviceId });

        if (service) {
            return response.status(200).json({
                status: true,
                message: "Service exists",
                data: service
            });
        } else {
            return response.status(200).json({
                status: false,
                message: "service not exists"
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
export const customServicesList = async (request, response) => {
    try {
        // Find all questions
        const services = await Service.find();

        if (services.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No service exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All services retrieved successfully",
            data: services
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};