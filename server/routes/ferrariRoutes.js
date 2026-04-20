import { Router } from "express";
import {
  getChart,
  getCircuits,
  getDrivers,
  getInsights,
  getOverview,
  getResults,
} from "../controllers/ferrariController.js";

const ferrariRouter = Router();

ferrariRouter.get("/overview", getOverview);
ferrariRouter.get("/drivers", getDrivers);
ferrariRouter.get("/results", getResults);
ferrariRouter.get("/circuits", getCircuits);
ferrariRouter.get("/chart", getChart);
ferrariRouter.get("/insights", getInsights);

export default ferrariRouter;
