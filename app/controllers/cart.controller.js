
const CartService = require("../services/cart.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.add = async (req , res, next) => {
    if (!req.body?.pictureId || !req.body?.quantity || !req.body?.price) {
        return next(new ApiError(400, "Picture ID, quantity, and price cannot be empty"));
    }
    
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.add(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500,"An error occurred while adding the item to the cart")
        );
    }
};

// Retrieve all items in the cart from the database
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
    const cartService = new CartService(MongoDB.client);
    const { pictureId } = req.query;
    if (pictureId) {
        documents = await cartService.findByPictureId(pictureId);
    } else {
        documents = await cartService.find({});
    } 
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving cart items")
        );
    }
    return res.send(documents);
};


// Update a cart item by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError (400, "Data to update can not be empty"));
    }

    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findById(req.params.id);
        if (!document) {
            return next (new ApiError (404, "Cart item not found")); 
        }
        await cartService.update(req.params.id, req.body);
        return res.send({ message: "Cart item was updated successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Error updating cart item with id=${req.params.id}`)
        );
    }
};

// Delete a cart item with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findById(req.params.id);
        if (!document) {
            return next(new ApiError (404, "Cart item not found" ));
        }
        await cartService.delete(req.params.id);
        return res.send({ message: "Cart item was deleted successfully" });
    } catch (error) {
        return next (
            new ApiError(500,`Could not delete cart item with id=${req.params.id}`)
        );
    }
};

exports.calculateTotal = async (_req, res, next) => {
    try {
        const cartService = new CartService (MongoDB.client);
        const total = await cartService.calculateTotal();
        return res.send({ total: total });
    } catch (error) {
        return next(
            new ApiError(500,`An error occurred while calculating the total price`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const deletedCount = await cartService.deleteAll();
        return res.send({message: `${deletedCount} carts were deleted successfully`,});
    } catch (error) {
        return next(
            new ApiError (500, "An error occurred while removing all carts")
        );
    }
};