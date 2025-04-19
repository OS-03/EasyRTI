import { Department } from "../models/department.model.js";
import { Request } from "../models/request.model.js";
import axios from 'axios';
import pkg from 'lodash';
const { debounce } = pkg;
const isProd = false;
// citizen will post a request
export const postRequest = async (req, res) => {
    try {
        const { title, description, address, typeofration, department, location, ratiocardnumber } = req.body; // Removed 'requirements'
        const userId = req.id;

        if (!title || !description || !address || !typeofration || !location || !department ) { // Fixed validation
            return res.status(400).json({
                message: "Some fields are missing.",
                success: false
            });
        }

        // Resolve department name to ObjectId
        const departmentDoc = await Department.findOne({ name: department });
        if (!departmentDoc) {
            return res.status(400).json({
                message: "Invalid department name.",
                success: false,
            });
        }

        const request = await Request.create({
            title,
            description,
            address,
            typeofration,
            department: departmentDoc._id, // Use ObjectId
            location,
            ratiocardnumber,
            created_by: userId
        });

        return res.status(201).json({
            message: "Request created successfully.",
            request,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// admin k liye
export const getAllRequest = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const request = await Request.find(query).populate({
            path: "department"
        }).sort({ createdAt: -1 });
        if (!request) {
            return res.status(404).json({
                message: "Request not found.",
                success: false
            })
        };
        return res.status(200).json({
            request,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// ciitizen checking its request
export const getRequestById = async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await Request.findById(requestId).populate({
            path:"applications"
        });
        if (!request) {
            return res.status(404).json({
                message: "Requests not found.",
                success: false
            })
        };
        return res.status(200).json({ request, success: true });
    } catch (error) {
        console.log(error);
    }
}

// admin kitne  create kra hai abhi tk
export const getAdminRequests = async (req, res) => {
    try {
        const adminId = req.id;
        const requests = await Request.find({ created_by: adminId }).populate({
            path:'department',
            createdAt:-1
        });

        if (!requests) {
            return res.status(404).json({
                message: "RTI Requests not found.",
                success: false
            })
        };
        return res.status(200).json({
            requests,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Fetch requests submitted by the logged-in user
export const getUserRequests = async (req, res) => {
    try {
        const userId = req.id; // Ensure this is set by authentication middleware
        if (!userId) {
            return res.status(403).json({
                message: "Unauthorized access. User ID is missing.",
                success: false,
            });
        }
        const requests = await Request.find({ created_by: userId }).populate("department").sort({ createdAt: -1 });
       
        try {

            for (const request of requests) {
               
                if (!request.summary) {
                    const response = await axios.post('http://127.0.0.1:8000/text-summarize-response', {
                        text: request.description,
                    });
        
                    console.log(response.data);
        
                    if (response.status === 200) {
                        const data = response.data;
                        request.summary = data.generated_response_summary;
                        await request.save();
                    }
                    }
            }
        } catch (e) {
            console.error("Error while summarizing requests:", e);
        }

        if (!requests || requests.length === 0) {
            return res.status(200).json({
            message: "No requests found.",
            requests: [],
            success: true,
            });
        }

        return res.status(200).json({
            message: "Requests fetched successfully.",
            requests,
            success: true,
        });
        } catch (error) {
        console.error("Error in getUserRequests:", error.message);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false,
        });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const requestId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
                success: false,
            });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Request not found.",
                success: false,
            });
        }

        request.status = status.toLowerCase();
        await request.save();

        return res.status(200).json({
            message: "Request status updated successfully.",
            success: true,
            request,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false,
        });
    }
};



