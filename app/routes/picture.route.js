const express = require("express");

const picture = require("../controllers/picture.controller");

const router = express.Router();

router.route("/")
    .get(picture.findAll)
    .post(picture.create)
    .delete(picture.deleteAll);

router.route("/favorite")
    .get(picture.findAllFavorite);

router.route("/:id")
    .get(picture.findOne)
    .put(picture.update)
    .delete(picture.delete);

module.exports = router;