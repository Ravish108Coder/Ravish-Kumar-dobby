import { Image } from "../models/image.model.js"
import cloudinary from "../utils/cloudinary.js";

export const uploadController = async (req, res) => {
    try {
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' })
        };
        const { name } = req.body
        // console.log(req.file.path)
        const result = await cloudinary.uploader.upload(req.file.path);
        // console.log(result)
        const user = req.user;

        const newImage = await Image.create({
            name,
            userId: user._id,
            imageUrl: result.url
        })


        return res.status(200).json({
            success: true,
            message: "Image Uploaded Successfully",
            data: { result, newImage },
            user: user
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error in uploading image"
        });
    }
}

export const getAllUploadedImagesController = async (req, res) => {
    try {
        const user = req.user;
        const images = await Image.find({ userId: user._id });
        return res.status(200).json({
            success: true,
            message: "All Images",
            data: images
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error in fetching images"
        });
    }
}

export const getFilteredImagesController = async (req, res) => {
    try {
        const user = req.user;
        const { name } = req.params;

        let images;

        if (name === "###") {
            images = await Image.find({ userId: user._id });
        } else {
            // Use regular expression to search for name containing the keyword
            images = await Image.find({ userId: user._id, name: { $regex: name, $options: 'i' } });
        }

        return res.status(200).json({
            success: true,
            message: `Filtered Images for ${name} keyword`,
            data: images
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error in fetching images"
        });
    }
};