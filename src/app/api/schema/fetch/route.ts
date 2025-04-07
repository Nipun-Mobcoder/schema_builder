/* eslint-disable @typescript-eslint/no-explicit-any */

import connectDB from "@/lib/connectDB";
import metaSchema from "@/model/metaSchema";
import { MetaSchemaDocument } from "@/types/schema";
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

    return NextResponse.json(
      {
        success: true,
        data: schemaDefinition.fields,
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
