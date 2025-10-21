// Dependencies
import express from "express";

// Schemas
import CipherSchema from "./schemas/cipher.schemas.ts";

// Utils
import { convertToJson } from "./utils/middleware/convert-to-json.ts";
import { apiPort } from "./constants/constants.ts";

// Services
import { databaseConnect } from "./services/database-connect.ts";
import { corsConfig } from "./utils/middleware/cors-config.ts";

const app = express();

convertToJson(app);

corsConfig(app);

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

app.get("/cifras", async (req: any, res: any) => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const searchTerm = String(req.query.q || "").trim();

    const searchQuery = searchTerm
      ? { name: { $regex: searchTerm, $options: "i" } }
      : {};

    const [ciphers, total] = await Promise.all([
      CipherSchema.find(searchQuery).sort({ name: 1 }).skip(skip).limit(limit),
      searchTerm
        ? CipherSchema.countDocuments(searchQuery)
        : CipherSchema.estimatedDocumentCount(),
    ]);

    return res.status(200).json({
      ciphers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
      search: searchTerm
        ? {
            term: searchTerm,
            resultsCount: total,
          }
        : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Erro interno ao buscar cifras." });
  }
});

app.put("/cifras/:id", async (req, res) => {
  try {
    const updatedCipher = await CipherSchema.findByIdAndUpdate(
      req.params.id,

      req.body
    );

    res.json(updatedCipher);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    res.send(
      "API de cifras da Igreja Batista de Corrêas | 2025 - Por: Guilherme Cordeiro"
    );
  } catch (error) {
    res.json({ error: error });
    console.error(`Erro ao buscar cifras - ${error}`);
  }
});

app.listen(!!apiPort ? Number(apiPort) : 3333, () =>
  console.log(`HTTP Server runing on ${apiPort}`)
);
