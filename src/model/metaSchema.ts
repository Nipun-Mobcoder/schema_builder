import { MetaSchemaDocument } from "@/types/schema";
import mongoose from "mongoose";

const MetaSchema = new mongoose.Schema<MetaSchemaDocument>({
  collectionName: { type: String, unique: true },
  fields: [
    {
      name: String,
      type: { type: String, enum: ["string", "number", "boolean", "date"] },
    },
  ],
});

export default mongoose.models.MetaSchema ||
  mongoose.model<MetaSchemaDocument>("MetaSchema", MetaSchema);
