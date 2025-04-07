/* eslint-disable @typescript-eslint/no-explicit-any */

import connectDB from "@/lib/connectDB";
import metaSchema from "@/model/metaSchema";
import { MetaSchemaDocument } from "@/types/schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get("collectionName");

    if (!collectionName) {
      return NextResponse.json(
        { success: false, error: "No collection name is given" },
        { status: 400 }
      );
    }

    const schemaDefinition = (await metaSchema.findOne({
      collectionName,
    })) as MetaSchemaDocument;

    if (!schemaDefinition) {
      return NextResponse.json(
        { success: false, error: "Collection not found in schema registry" },
        { status: 404 }
      );
    }

    const typeMap: { [key: string]: any } = {
      string: String,
      number: Number,
      boolean: Boolean,
      date: Date,
    };

    const schema = new mongoose.Schema(
      schemaDefinition.fields.reduce((acc: any, field) => {
        acc[field.name] = { type: typeMap[field.type], required: false };
        return acc;
      }, {}),
      { timestamps: true }
    );

    const Model =
      mongoose.models[collectionName] || mongoose.model(collectionName, schema);

    const data = await Model.find({});

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get("collectionName");

    const newItem = await request.json();

    if (!collectionName || !newItem) {
      return NextResponse.json(
        { success: false, error: "No collection name is given" },
        { status: 400 }
      );
    }

    const schemaDefinition = (await metaSchema.findOne({
      collectionName,
    })) as MetaSchemaDocument;

    if (!schemaDefinition) {
      return NextResponse.json(
        { success: false, error: "Collection not found in schema registry" },
        { status: 404 }
      );
    }

    const typeMap: { [key: string]: any } = {
      string: String,
      number: Number,
      boolean: Boolean,
      date: Date,
    };

    const schema = new mongoose.Schema(
      schemaDefinition.fields.reduce((acc: any, field) => {
        acc[field.name] = { type: typeMap[field.type], required: false };
        return acc;
      }, {}),
      { timestamps: true }
    );

    const Model =
      mongoose.models[collectionName] || mongoose.model(collectionName, schema);

    const data = await Model.create(newItem);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get("collectionName");

    const value = await request.json();
    const { updatedData, _id } = value;

    if (!collectionName || !value || !updatedData || !_id) {
      return NextResponse.json(
        { success: false, error: "No collection name is given" },
        { status: 400 }
      );
    }

    const schemaDefinition = (await metaSchema.findOne({
      collectionName,
    })) as MetaSchemaDocument;

    if (!schemaDefinition) {
      return NextResponse.json(
        { success: false, error: "Collection not found in schema registry" },
        { status: 404 }
      );
    }

    const typeMap: { [key: string]: any } = {
      string: String,
      number: Number,
      boolean: Boolean,
      date: Date,
    };

    const schema = new mongoose.Schema(
      schemaDefinition.fields.reduce((acc: any, field) => {
        acc[field.name] = { type: typeMap[field.type], required: false };
        return acc;
      }, {}),
      { timestamps: true }
    );

    const Model =
      mongoose.models[collectionName] || mongoose.model(collectionName, schema);

    const updatedDoc = await Model.findByIdAndUpdate(_id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedDoc,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const collectionName = searchParams.get("collectionName");
    const { _id } = await request.json();

    if (!collectionName || !_id) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const Model = mongoose.models[collectionName];
    if (!Model) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    const result = await Model.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
