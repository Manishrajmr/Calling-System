import express from "express"
const router = express.Router();
import { fetchVobizOverview } from '../controllers/vobizBalanceController.js';


// Endpoint for fetching Vobiz overview (balance + metrics)
router.get("/overview", fetchVobizOverview);

export default router;