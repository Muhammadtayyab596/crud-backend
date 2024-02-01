const express = require("express");
const authController = require("../controllers/auth.controller");
const projectController = require("../controllers/project.controller");
const router = express.Router();

router.use(authController.protect);

router.post("/create", projectController.createProject);
router.get("/all", projectController.getProject);
router.put("/update/:id", projectController.updateProject);
router.put("/complete/:id", projectController.completeProject);
router.put("/archive/:id", projectController.archiveProject);

module.exports = router;
