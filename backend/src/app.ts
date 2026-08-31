import express from "express";
export const app = express();
app.use("/health-check", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Health good",
  });
});
