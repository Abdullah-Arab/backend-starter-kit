// Import the 'express' module along with 'Request' and 'Response' types from express
import express, { Request, Response } from "express";
import { errorHandler } from "./middleware/error-handler";
import cors from "cors";
import guestRoute from "./routes/v1/guest-route";
import roomRoute from "./routes/v1/room-route";
import reservationRoute from "./routes/v1/reservation-route";

// Create an Express application
const app = express();

// Add middlewares
app.use(cors());
app.use(express.json());
app.use(errorHandler);
// app.use(helmet());
// app.use(morgan("dev"));

// routes here
app.use("/api/v1/guests", guestRoute);
app.use("/api/v1/rooms", roomRoute);
app.use("/api/v1/reservations", reservationRoute);

// Define a route for the root path ('/')
app.get("/", (req: Request, res: Response) => {
  // Send a response to the client
  res.send("server is running");
});

export default app;
