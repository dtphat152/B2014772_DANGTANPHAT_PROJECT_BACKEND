const {ObjectId} = require("mongodb");

class BillService {
    constructor(client) {
        this.bill = client.db().collection("bill");
    }

    //Dinh nghia cac phuong thuc truy xuat CSDL su dung Mongodb API
    extractConactData (payload){
        const bill = {
            userId: payload.userId,
            // mang nhung san pham duoc them vao 
            products: payload.products,
            accept: payload.accept,
        };

        Object.keys(bill).forEach(
            (key) => bill[key] === undefined && delete bill[key]
        );
        return bill;
    }

    async create(payload) {
        const bill = this.extractConactData(payload);
        const result = await this.bill.findOneAndUpdate(
            { userId: bill.userId },
            { $set: { products: bill.products, accept: bill.accept === false } },
            { returnDocument: "after", upsert: false }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.bill.find(filter);
        return await cursor.toArray();
        }
        async findByUserId(userId) {
        return await this.find({
        userId: { $regex: new RegExp(userId), $options: "i" },
        });
    }

    async findById(id) {
        return await this.bill.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.bill.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.bill.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

// Find all accept bills of a user
    async findAccept() {
        return await this.find({ accept: true });
    }

    async deleteAll() {
        const result = await this.bill.deleteMany({});
        return result.deletedCount;
    }
        
        
        
}


module.exports = BillService;