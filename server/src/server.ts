import express from "express"
import cors from "cors"
import callRoutes from "./routes/call.routes.js"
import voiceRoutes from "./routes/voice.routes.js"
import vobiBalanceRouter from "./routes/vobizBalance.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/call", callRoutes)
app.use("/voice", voiceRoutes)

//vobiz overview (Balance and Transactions)

app.use("/api/vobiz",vobiBalanceRouter);

const PORT = process.env.PORT || 5000 ; 


app.listen(PORT, () => {
  // console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("https://consummatory-sherilyn-unlugubriously.ngrok-free.dev")
})