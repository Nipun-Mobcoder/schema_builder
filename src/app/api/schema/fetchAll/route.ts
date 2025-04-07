// app/api/schema/fetchAll/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/connectDB";
import MetaSchema from "@/model/metaSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const data = await MetaSchema.find({});
    if (!data) {
      NextResponse.json(
        { success: false, error: "No data found." },
        { status: 400 }
      );
    }

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
