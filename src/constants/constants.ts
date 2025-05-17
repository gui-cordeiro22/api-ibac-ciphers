// Dependencies
import dotenv from "dotenv";

dotenv.config();

export const dataBaseURI = process.env.MONGO_URI;

export const apiPort = process.env.API_PORT;
