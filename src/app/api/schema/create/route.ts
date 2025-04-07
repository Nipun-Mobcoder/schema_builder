/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MetaSchema from "@/model/metaSchema";
import dbConnect from "@/lib/connectDB";

const typeMap: { [key: string]: any } = {
  string: String,
  number: Number,
  boolean: Boolean,
  date: Date,
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { collectionName, fields } = await request.json();

    if (!collectionName || !fields?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingSchema = await MetaSchema.findOne({ collectionName });
    if (existingSchema) {
      return NextResponse.json(
        { success: false, error: "Collection already exists" },
        { status: 409 }
      );
    }

    const newSchema = await MetaSchema.create({
      collectionName,
      fields,
    });

    const schemaDefinition = fields.reduce((acc: any, field: any) => {
      acc[field.name] = { type: typeMap[field.type], required: false };
      return acc;
    }, {});

    const dynamicSchema = new mongoose.Schema(schemaDefinition, {
      timestamps: true,
      strict: false,
    });

    const DynamicModel = mongoose.model(collectionName, dynamicSchema);
    await DynamicModel.createCollection();

    return NextResponse.json(
      {
        success: true,
        data: {
          schema: newSchema,
          collectionCreated: true,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Schema creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
