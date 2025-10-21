// Dependencies
import express, { Request, Response } from "express";

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

app.post(
  "/cifras/criar",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const existingCipher = await CipherSchema.findOne({
        name: req.body.name,
        tone: req.body.tone,
      });

      if (existingCipher) {
        res.status(400).json({
          error: true,
          message: "Já existe uma cifra cadastrada com este nome e tom.",
        });
        return;
      }

      const newCipher = await CipherSchema.create(req.body);
      res.status(201).json(newCipher);
    } catch (error) {
      console.error(`Erro ao criar uma nova cifra - ${error}`);
      res.status(500).json({
        error: true,
        message: "Erro interno ao criar uma nova cifra",
      });
    }
  }
);

app.get("/cifras", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = (req.query.q as string)?.trim() || "";

    const searchQuery = searchTerm
      ? { name: { $regex: searchTerm, $options: "i" } }
      : {};

    const [ciphers, total] = await Promise.all([
      CipherSchema.find(searchQuery).sort({ name: 1 }).skip(skip).limit(limit),
      searchTerm
        ? CipherSchema.countDocuments(searchQuery)
        : CipherSchema.estimatedDocumentCount(),
    ]);

    res.status(200).json({
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

app.put("/cifras/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCipher = await CipherSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCipher) {
      res.status(404).json({ error: true, message: "Cifra não encontrada" });
      return;
    }

    res.json(updatedCipher);
  } catch (error: any) {
    console.error(`Erro ao atualizar cifra - ${error.message}`);
    res.status(500).json({ error: true, message: error.message });
  }
});

app.get("/", (req: Request, res: Response): void => {
  res.send(
    "API de cifras da Igreja Batista de Corrêas | 2025 - Por: Guilherme Cordeiro"
  );
});

app.listen(!!apiPort ? Number(apiPort) : 3333, () => {
  console.log(`HTTP Server running on port ${apiPort}`);
});
