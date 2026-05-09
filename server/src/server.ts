import express from "express";
import cors from "cors";
import callRoutes from "./routes/call.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import vobiBalanceRouter from "./routes/vobizBalance.route.js";
import openaiRoutes from "./routes/openai.routes.js";
import supportRoutes from "./routes/support.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

console.log("Starting server with all routes...");

app.use("/api/support", supportRoutes);
app.use("/call", callRoutes);
app.use("/voice", voiceRoutes);
app.use("/api/vobiz", vobiBalanceRouter);
app.use("/api/openai", openaiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
