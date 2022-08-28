import express from "express";
import guestsController from "../controllers/guests";
import itemsController from "../controllers/items";
import ordersController from "../controllers/orders";

const router = express.Router();

router.get("/guests", guestsController.getAllGuests);
router.get("/guests/:id", guestsController.getGuestById);
router.put("/guests/:id", guestsController.updateGuest);
router.delete("/guests/:id", guestsController.deleteGuest);
router.post("/guests", guestsController.createGuest);

router.get("/orders", ordersController.getAllOrders);
router.get("/orders/:id", ordersController.getOrderById);
router.put("/orders/:id", ordersController.updateOrder);
router.delete("/orders/:id", ordersController.deleteOrder);
router.post("/orders", ordersController.createOrder);

router.get("/items", itemsController.getAllItems);
router.get("/items/:id", itemsController.getItemById);
router.put("/items/:id", itemsController.updateItem);
router.delete("/items/:id", itemsController.deleteItem);
router.post("/items", itemsController.createItem);

export = router;
