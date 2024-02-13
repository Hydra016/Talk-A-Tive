const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middelwares/authMiddleware")

const router = express.Router();

router.route("/chat").post(protect, accessChat);
router.route("/chat").get(protect, fetchChats);
router.route("/chat/group").post(protect, createGroupChat);
router.route("/chat/group/rename").put(protect, renameGroup);
router.route("/chat/group/remove").put(protect, removeFromGroup);
router.route("/chat/group/add").put(protect, addToGroup);

module.exports = router;