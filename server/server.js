import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const port = Number(process.env.PORT || 5050);

await connectDatabase();

app.listen(port, () => {
  console.log(`Ferrari backend listening on http://localhost:${port}`);
});
