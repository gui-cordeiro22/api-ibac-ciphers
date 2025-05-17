"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/api.ts
var import_express2 = __toESM(require("express"), 1);

// src/schemas/cipher.schemas.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var CipherSchema = new import_mongoose.default.Schema({
  name: String,
  tone: String
});
var cipher_schemas_default = import_mongoose.default.model("cipher", CipherSchema);

// src/utils/middleware/convert-to-json.ts
var import_express = __toESM(require("express"), 1);
var convertToJson = (app2) => {
  app2.use(import_express.default.json());
};

// src/constants/constants.ts
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var dataBaseURI = process.env.MONGO_URI;
var apiPort = process.env.API_PORT;

// src/services/database-connect.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var databaseConnect = async () => {
  try {
    await import_mongoose2.default.connect(dataBaseURI ?? "");
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error(`Erro ao conectar com MongoDB ${error}`);
  }
};

// src/api.ts
var app = (0, import_express2.default)();
convertToJson(app);
databaseConnect();
app.post("/cifras/criar", async (req, res) => {
  try {
    const newCipher = await cipher_schemas_default.create(req.body);
    res.json(newCipher);
  } catch (error) {
    res.json({ error });
    console.error(`Erro ao criar uma nova cifra - ${error}`);
  }
});
app.get("/cifras", async (req, res) => {
  try {
    const ciphers = await cipher_schemas_default.find();
    res.json(ciphers);
  } catch (error) {
    res.json({ error });
    console.error(`Erro ao buscar cifras - ${error}`);
  }
});
app.put("/cifras/:id", async (req, res) => {
  try {
    const updatedCipher = await cipher_schemas_default.findByIdAndUpdate(
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
      "API de cifras da Igreja Batista de Corr\xEAas | 2025 - Por: Guilherme Cordeiro | Cord.io"
    );
  } catch (error) {
    res.json({ error });
    console.error(`Erro ao buscar cifras - ${error}`);
  }
});
app.listen(
  !!apiPort ? Number(apiPort) : 3333,
  () => console.log(`HTTP Server runing on ${apiPort}`)
);
