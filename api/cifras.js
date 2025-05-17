// Dependencies
import express from "express";
import serverless from "serverless-http";

// Schemas
import CipherSchema from "./schemas/cipher.schemas.js";

// Utils
import { convertToJson } from "./utils/middleware/convert-to-json.js";

// Services
import { databaseConnect } from "./services/database-connect.js";

const app = express();

convertToJson(app);

databaseConnect();

app.get("/cifras", async (req, res) => {
  try {
    const ciphers = await CipherSchema.find();
    res.json(ciphers);
  } catch (error) {
    res.json({ error: error });
    console.error(`Erro ao buscar cifras - ${error}`);
  }
});

export default serverless(app);
