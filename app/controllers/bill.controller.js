const BillService = require("../services/bill.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req , res, next) => {
    if (!req.body?.userId) {
        return next(new ApiError(400, "UserId can not be empty"));
    }
    
    try {
        const billService = new BillService(MongoDB.client);
        const document = await billService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500,"An error orccurred while creating the bill")
        );
    }
};

// Retrieve all bills of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
    const billService = new BillService(MongoDB.client);
    const { userId } = req.query;
    if (userId) {
        documents = await billService.findByUserId(userId);
    } else {
        documents = await billService.find({});
    } 
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving bills")
        );
    }
    return res.send(documents);
};

// Find a single bill with an id
exports.findOne = async (req, res, next) => {
    try {
        const billService = new BillService(MongoDB.client);
        const document = await billService.findById(req.params.id);
        if (!document) {
            return next (new ApiError(404, "bill not found" ));
        }
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError (500,`Error retrieving bill with id=${req.params.id}`)
        );
    }
};

// Update a bill by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError (400, "Data to update can not be empty"));
    }

    try {
        const billService = new BillService(MongoDB.client);
        const document = await billService.findById(req.params.id);
        if (!document) {
            return next (new ApiError (404, "bill not found")); 
        }
        await billService.update(req.params.id, req.body);
        return res.send({ message: "bill was updated successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Error updating bill with id=${req.params.id}`)
        );
    }
};

// Delete a bill with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const billService = new BillService(MongoDB.client);
        const document = await billService.findById(req.params.id);
        if (!document) {
            return next(new ApiError (404, "bill not found" ));
        }
        await billService.delete(req.params.id);
        return res.send({ message: "bill was deleted successfully" });
    } catch (error) {
        return next (
            new ApiError(500,`Could not delete bill with id=${req.params.id}`)
        );
    }
};

exports.findAllAccept = async (_rea, res, next) => {
    try {
        const billService = new BillService (MongoDB.client);
        const documents = await billService. findAccept();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500,`An error occurred while retrieving accept bills`)
        );
    }
};

// Delete all bills of a user from the database
exports.deleteAll = async (_req, res, next) => {
    try {
        const billService = new BillService(MongoDB.client);
        const deletedCount = await billService.deleteAll();
        return res.send({message: `${deletedCount} bills were deleted successfully`,});
    } catch (error) {
        return next(
            new ApiError (500, "An error occurred while removing all bills")
        );
    }
};