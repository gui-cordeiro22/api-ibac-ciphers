// Dependencies
import express from "express";
import serverless from "serverless-http";

// Schemas
import CipherSchema from "./schemas/cipher.schemas.ts";

// Utils
import { convertToJson } from "./utils/middleware/convert-to-json.ts";

// Services
import { databaseConnect } from "./services/database-connect.ts";

const app = express();

convertToJson(app);

databaseConnect();

app.post("/cifras/criar", async (req, res) => {
  try {
    const newCipher = await CipherSchema.create(req.body);
    res.json(newCipher);
  } catch (error) {
    res.json({ error: error });
    console.error(`Erro ao criar uma nova cifra - ${error}`);
  }
});

app.get("/cifras", async (req, res) => {
  try {
    const ciphers = await CipherSchema.find();
    res.json(ciphers);
  } catch (error) {
    res.json({ error: error });
    console.error(`Erro ao buscar cifras - ${error}`);
  }
});

app.put("/cifras/:id", async (req, res) => {
  try {
    const updatedCipher = await CipherSchema.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json(updatedCipher);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    res.send(
      "API de cifras da Igreja Batista de Corrêas | 2025 - Por: Guilherme Cordeiro | Cord.io"
    );
  } catch (error) {
    res.json({ error: error });
    console.error(`Erro ao buscar cifras - ${error}`);
  }
});

export default serverless(app);
