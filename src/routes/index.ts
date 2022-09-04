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
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
} from "../controllers/items";

import {
  completeOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrderTotal,
  placeOrder,
  updateOrder,
} from "../controllers/orders";

const router = express.Router();

router.get("/guests", getAllGuests);
router.get("/guests/:id", getGuestById);
router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);

router.post("/orders/place", placeOrder);
router.post("/orders/total", getOrderTotal);
router.post("/orders/complete/:id", completeOrder);
router.post("/orders/create", createOrder);
router.post("/guests/create", createGuest);
router.post("/items/create", createItem);

router.put("/orders/:id", updateOrder);
router.put("/guests/:id", updateGuest);
router.put("/items/:id", updateItem);

router.delete("/orders/:id", deleteOrder);
router.delete("/items/:id", deleteItem);
router.delete("/guests/:id", deleteGuest);

export = router;
