import mongoose from 'mongoose';

const metaSchema = new mongoose.Schema({
  collectionName: { type: String, unique: true },
  fields: [{
    name: String,
    type: { type: String, enum: ['string', 'number', 'boolean', 'date'] }
  }]
});

export default mongoose.models.MetaSchema || mongoose.model('MetaSchema', metaSchema);