import express from "express";
import {
  createGuest,
  deleteGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
} from "../controllers/guests";
import {
  createItem,
  discontinueItem,
  getAllItems,
  getItemById,
  updateItem,
} from "../controllers/items";

import {
  completeOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOpenOrders,
  getOrderById,
  placeOrder,
  updateOrder,
} from "../controllers/orders";

const router = express.Router();

router.get("/guests", getAllGuests);
router.get("/guests/:id", getGuestById);
router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.get("/orders", getAllOrders);
router.get("/orders/open", getOpenOrders);
router.get("/orders/:id", getOrderById);

router.post("/orders/place", placeOrder);
router.post("/orders/complete/:id", completeOrder);
router.post("/orders/create", createOrder);
router.post("/guests/create", createGuest);
router.post("/items/create", createItem);

router.patch("/orders/:id", updateOrder);
router.patch("/guests/:id", updateGuest);
router.patch("/items/:id", updateItem);
router.patch("/items/discontinue/:id", discontinueItem);

router.delete("/orders/:id", deleteOrder);
router.delete("/guests/:id", deleteGuest);

export = router;
