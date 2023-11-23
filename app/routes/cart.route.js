
const express = require("express");

const cart = require("../controllers/cart.controller");

const router = express.Router();

router.route("/")
    .get(cart.findAll)
    .post(cart.add)
    .delete(cart.deleteAll);
router.route("/:id")
    .put(cart.update)
    .delete(cart.delete);

router.route("/total")
    .get(cart.calculateTotal);

module.exports = router;
