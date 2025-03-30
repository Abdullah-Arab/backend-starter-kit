// Import the 'express' module along with 'Request' and 'Response' types from express
import express, { Request, Response } from "express";
import { errorHandler } from "./middleware/error-handler";
import cors from "cors";
import userRoute from "./routes/v1/user-route";
import itemRoute from "./routes/v1/item-route";
import transactionRoute from "./routes/v1/transaction-route";

// Create an Express application
const app = express();

// Add middlewares
app.use(cors());
app.use(express.json());
app.use(errorHandler);
// app.use(helmet());
// app.use(morgan("dev"));

// routes here
app.use("/api/v1/users", userRoute);
app.use("/api/v1/items", itemRoute);
app.use("/api/v1/transactions", transactionRoute);

// Define a route for the root path ('/')
app.get("/", (req: Request, res: Response) => {
  // Send a response to the client
  res.send("server is running");
});

export default app;
