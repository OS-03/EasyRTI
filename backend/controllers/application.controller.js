import { Application } from "../models/application.model.js";
import { Request } from "../models/request.model.js";

export const applyRequest = async (req, res) => {
    try {
        const userId = req.id;
        const requestId = req.params.id;
        if (!requestId) {
            return res.status(400).json({
                message: "Request id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ request: requestId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have your request already",
                success: false
            });
        }

        // check if the jobs exists
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({
                message: "Request not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            request:requestId,
            applicant:userId,
        });

        request.applications.push(newApplication._id);
        await request.save();
        return res.status(201).json({
            message:"Request submitted successfully wait for few seconds to load.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }

};


export const getAppliedRequests = async (req, res) => {
    try {
        const userId = req.id; // Logged-in user ID
        const applications = await Application.find({ applicant: userId })// Ensure status is included in the query
            .sort({ createdAt: 1 }) // Sort in ascending order to get the first submitted request first
            .populate({
                path: 'request',
                populate: {
                    path: 'department', // Populate department inside request
                },
            });

        if (!applications || applications.length === 0) {
            return res.status(200).json({
                message: "No applications found.",
                application: [],
                success: true,
            });
        }

        return res.status(200).json({
            application: applications.map(app => ({
                _id: app._id,
                createdAt: app.createdAt,
                status: app.status, // Ensure status is included
                request: {
                    title: app.request?.title,
                    department: {
                        name: app.request?.department?.name || "N/A"
                    }
                }
            })),
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false,
        });
    }
};


// fetch all applicants without specifying a request ID
export const getApplicants = async (req, res) => {
    try {
        const applications = await Application.find()
            .sort({ createdAt: -1 }) // Sort by most recent applications
            .populate({
                path: 'applicant',
            })
            .populate({
                path: 'request',
                populate: {
                    path: 'department', // Populate department inside request
                },
            });

        if (!applications || applications.length === 0) {
            return res.status(200).json({
                message: "No applications found.",
                applicants: [],
                success: true,
            });
        }

        return res.status(200).json({
            applicants: applications.map(app => ({
                _id: app._id,
                createdAt: app.createdAt,
                status: app.status,
                applicant: {
                    fullname: app.applicant?.fullname,
                    email: app.applicant?.email,
                },
                request: {
                    title: app.request?.title,
                    department: {
                        name: app.request?.department?.name,
                    },
                    summary: app.request?.summary,
                },
            })),
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false,
        });
    }
};


export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}