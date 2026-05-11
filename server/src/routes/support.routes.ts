import express from "express";
import * as ctrl from "../controllers/supportController.js";

const router = express.Router();

console.log("Loading Support Routes...");

router.get("/topics", ctrl.getTopics);
router.get("/topics/:topicId/queries", ctrl.getQueriesByTopic);
router.get("/search", ctrl.searchQueries);
router.post("/queries", ctrl.createQuery);
router.post("/bulk", ctrl.bulkCreate);
router.post("/import-manual", ctrl.importManual);

export default router;
