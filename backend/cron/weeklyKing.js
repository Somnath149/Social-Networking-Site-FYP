import cron from "node-cron";
import { calculateWeeklyKing } from "../controllers/user.controller.js";

cron.schedule('0 0 * * 0', () => { 
  calculateWeeklyKing();
});
