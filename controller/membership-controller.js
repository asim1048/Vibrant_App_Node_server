import Membership from "../model/memberships.js";
export const createOrUpdateMembership = async (req, res) => {
    const { membershipId, name, services } = req.body;

    try {
        
        let membership = await Membership.findOne({ membershipId });

        if (membership) {
            // Update the existing service
            membership.name = name || membership.name;
            membership.services = services;
            await membership.save();
            res.status(200).json({status:true, message: 'Membership updated successfully',data: membership });
        } else {
            // Create a new service
            membership = new Membership({
                membershipId,
                name,
                services,
            });
            await membership.save();
            res.status(201).json({status:true, message: 'Membership created successfully',data: membership });
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
export const findCustomMembership = async (request, response) => {
    try {
        const { membershipId } = request.body;

        const membership = await Membership.findOne({ membershipId });

        if (membership) {
            return response.status(200).json({
                status: true,
                message: "Membership exists",
                data: membership
            });
        } else {
            return response.status(200).json({
                status: false,
                message: "Membership not exists"
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
export const customMembershipList = async (request, response) => {
    try {
        // Find all questions
        const memberships = await Membership.find();

        if (memberships.length === 0) {
            return response.status(200).json({
                status: false,
                message: "No membership exist"
            });
        }

        return response.status(200).json({
            status: true,
            message: "All memberships retrieved successfully",
            data: memberships
        });
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: "Something went wrong in the backend",
            error: error.message
        });
    }
};