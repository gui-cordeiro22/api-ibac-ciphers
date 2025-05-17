// Dependencies
import mongoose from "mongoose";

const CipherSchema = new mongoose.Schema({
  name: String,
  tone: String,
});

export default mongoose.model("cipher", CipherSchema);
