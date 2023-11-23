const PictureService = require("../services/picture.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req , res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    
    try {
        const pictureService = new PictureService(MongoDB.client);
        const document = await pictureService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500,"An error orccurred while creating the picture")
        );
    }
};

// Retrieve all pictures of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
    const pictureService = new PictureService(MongoDB.client);
    const { name } = req.query;
    if (name) {
        documents = await pictureService.findByName(name);
    } else {
        documents = await pictureService.find({});
    } 
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving pictures")
        );
    }
    return res.send(documents);
};

// Find a single picture with an id
exports.findOne = async (req, res, next) => {
    try {
        const pictureService = new PictureService(MongoDB.client);
        const document = await pictureService.findById(req.params.id);
        if (!document) {
            return next (new ApiError(404, "picture not found" ));
        }
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError (500,`Error retrieving picture with id=${req.params.id}`)
        );
    }
};

// Update a picture by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError (400, "Data to update can not be empty"));
    }

    try {
        const pictureService = new PictureService(MongoDB.client);
        const document = await pictureService.findById(req.params.id);
        if (!document) {
            return next (new ApiError (404, "picture not found")); 
        }
        await pictureService.update(req.params.id, req.body);
        return res.send({ message: "picture was updated successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Error updating picture with id=${req.params.id}`)
        );
    }
};

// Delete a picture with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const pictureService = new PictureService(MongoDB.client);
        const document = await pictureService.findById(req.params.id);
        if (!document) {
            return next(new ApiError (404, "picture not found" ));
        }
        await pictureService.delete(req.params.id);
        return res.send({ message: "picture was deleted successfully" });
    } catch (error) {
        return next (
            new ApiError(500,`Could not delete picture with id=${req.params.id}`)
        );
    }
};

exports.findAllFavorite = async (_rea, res, next) => {
    try {
        const pictureService = new PictureService (MongoDB.client);
        const documents = await pictureService. findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500,`An error occurred while retrieving favorite pictures`)
        );
    }
};

// Delete all pictures of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const pictureService = new PictureService(MongoDB.client);
        const deletedCount = await pictureService.deleteAll();
        return res.send({message: `${deletedCount} pictures were deleted successfully`,});
    } catch (error) {
        return next(
            new ApiError (500, "An error occurred while removing all pictures")
        );
    }
};