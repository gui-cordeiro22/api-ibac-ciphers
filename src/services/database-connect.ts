// Dependencies
import mongoose from "mongoose";

// Utils
import { dataBaseURI } from "../constants/constants.js";

export const databaseConnect = async () => {
  try {
    await mongoose.connect(dataBaseURI ?? "");
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error(`Erro ao conectar com MongoDB ${error}`);
  }
};
