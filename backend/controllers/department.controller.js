import { Department } from "../models/department.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerDepartment = async (req, res) => {
    try {
     
        const { departmentName } = req.body;
        console.log(req.body);
        if (!departmentName) {
            return res.status(400).json({
                message: " Department name is required.",
                success: false
            });
        }
        let department = await Department.findOne({ name: departmentName });
        if (department) {
            return res.status(400).json({
                message: "You can't register same department.",
                success: false
            })
        };
        department = await Department.create({
            name: departmentName,
            userId: req.id
        });

        return res.status(201).json({
            message: " Department registered successfully.",
            department,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getDepartment = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const department = await Department.find({ userId });
        if (!department) {
            return res.status(404).json({
                message: "Department not found.",
                success: false
            })
        }
        return res.status(200).json({
            department,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get department by id
export const getDepartmentById = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({
                message: "Department not found.",
                success: false
            })
        }
        return res.status(200).json({
            department,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params; // Extract the department ID from the route parameters
        const { name, description } = req.body;

        // Validate the ID
        if (!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid or missing department ID.",
                success: false
            });
        }

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({
                message: "Name and description are required.",
                success: false
            });
        }

        // Handle file upload if a file is provided
        let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        // Prepare the update data
        const updateData = { name, description };
        if (logo) updateData.logo = logo;

        // Update the department
        const department = await Department.findByIdAndUpdate(id, updateData, { new: true });

        if (!department) {
            return res.status(404).json({
                message: "Department not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Department information updated successfully.",
            success: true,
            department
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params; // Extract the department ID from the route parameters

        // Validate the ID
        if (!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid or missing department ID.",
                success: false
            });
        }
        let result = await Department.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Department information deleted successfully.",
            result,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
};