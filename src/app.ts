import express from "express";
import userRouter from "./routes/user";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
