var express = require("express");
var router = express.Router();
const {
  getAllFoodItems,
  getFoodItemsByClient,
  getFoodItemsByVendor,
  createNewFoodItem,
  updateFoodItem,
  deleteFoodItem,
  foodItemClaimStatus
} = require("../db/queries/foodItemsQueries.js");

router.get("/", getAllFoodItems);
router.get("/client/:id", getFoodItemsByClient);
router.get("/vendor/:id", getFoodItemsByVendor);
router.post("/", createNewFoodItem);
router.patch("/:id", updateFoodItem);
router.patch('/claimstatus/:id', foodItemClaimStatus)
router.delete("/:id", deleteFoodItem);

module.exports = router;
