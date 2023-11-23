const express = require("express");

const bill = require("../controllers/bill.controller");

const router = express.Router();

router.route("/")
    .get(bill.findAll)
    .post(bill.create)
    .delete(bill.deleteAll);

router.route("/favorite")
    .get(bill.findAllAccept);

router.route("/:id")
    .get(bill.findOne)
    .put(bill.update)
    .delete(bill.delete);

module.exports = router;