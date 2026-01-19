import threadModel from "../models/thread.model.js";
import axios from "axios";
import { io } from "../routes/socket.js"; // ensure correct import

export const factCheckThread = async (threadId, content) => {
  try {
   
    const cbRes = await axios.get(
      `https://idir.uta.edu/claimbuster/api/v2/score/text/${encodeURIComponent(content)}`,
      { headers: { "x-api-key": process.env.CLAIMBUSTER_API_KEY } }
    );
    const score = cbRes.data?.results?.[0]?.score || 0;

  
    const googleRes = await axios.get(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search",
      {
        params: { query: content, key: process.env.GOOGLE_FACT_CHECK_KEY }
      }
    );

    const claims = googleRes.data?.claims || [];

    let verdict = "CHECKING";

    if (claims.length > 0) {
      const claimReviews = claims[0]?.claimReview || [];

      for (const review of claimReviews) {
        const rating = (review?.textualRating || "").toLowerCase().trim();

        if (rating === "false") {
          verdict = "FALSE";
          break;
        } else if (
          rating.includes("misleading") ||
          rating.includes("half") ||
          rating.includes("partly")
        ) {
          verdict = "MISLEADING";
          break;
        } else if (rating === "true") {
          verdict = "TRUE";
          break;
        }
      }
    } 
    else if (score >= 0.7) {
      verdict = "FALSE"; 
    }

    const updatedThread = await threadModel.findByIdAndUpdate(
      threadId,
      { verdict },
      { new: true }
    ).populate("author", "name userName profileImage");

 
    io.emit("factCheckUpdate", updatedThread);

    console.log(`Fact check complete for thread ${threadId}:`, verdict);

  } catch (err) {
    console.error("Fact check error:", err.message);
  }
};
