const {ObjectId} = require("mongodb");

class PictureService {
    constructor(client) {
        this.picture = client.db().collection("picture");
    }

    //Dinh nghia cac phuong thuc truy xuat CSDL su dung Mongodb API
    extractConactData (payload){
        const picture = {
            name: payload.name,
            image: payload.image,
            auth: payload.auth,
            price: payload.price,
            favorite: payload.favorite,
        };

        Object.keys(picture).forEach(
            (key) => picture[key] === undefined && delete picture[key]
        );
        return picture;
    }

    async create(payload) {
        const picture = this.extractConactData(payload);
        const result = await this.picture.findOneAndUpdate(
            picture,
            { $set: { favorite: picture.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.picture.find(filter);
        return await cursor.toArray();
        }
        async findByName(name) {
        return await this.find({
        name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.picture.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.picture.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.picture.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

// Find all favorite pictures of a user
    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.picture.deleteMany({});
        return result.deletedCount;
    }
        
        
        
}


module.exports = PictureService;