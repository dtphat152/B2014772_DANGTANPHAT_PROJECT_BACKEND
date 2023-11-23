
const {ObjectId} = require("mongodb");

class CartService {
    constructor(client) {
        this.cart = client.db().collection("cart");
    }

    extractCartData(payload){
        const cartItem = {
            pictureId: payload.pictureId,
            quantity: payload.quantity,
            price: payload.price,
        };

        Object.keys(cartItem).forEach(
            (key) => cartItem[key] === undefined && delete cartItem[key]
        );
        return cartItem;
    }

    async add(payload) {
        const cartItem = this.extractCartData(payload);
        const result = await this.cart.findOneAndUpdate(
            { pictureId: cartItem.pictureId },
            { $set: { quantity: cartItem.quantity, price: cartItem.price } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }   

    async find(filter) {
        const cursor = await this.cart.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.cart.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractCartData(payload);
        const result = await this.cart.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.cart.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async calculateTotal() {
        const cartItems = await this.find({});
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    async deleteAll() {
        const result = await this.cart.deleteMany({});
        return result.deletedCount;
        // const result = await this.Cart.findOneAndDelete({});
        // return result.value;

    }
}

module.exports = CartService;
