import app from "./app";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Determine environment
const NODE_ENV = process.env.NODE_ENV || "development";

// Load environment variables based on NODE_ENV
const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
const defaultEnvPath = path.resolve(process.cwd(), ".env");

// First try to load environment-specific file
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
}

// Then load default .env file (values will not override existing env vars)
if (fs.existsSync(defaultEnvPath)) {
  console.log(`Loading default environment from ${defaultEnvPath}`);
  dotenv.config({ path: defaultEnvPath });
}

// Specify the port number for the server
const PORT = process.env.PORT || 3345;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});
