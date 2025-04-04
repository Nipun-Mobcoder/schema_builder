"use server";

import { NextApiRequest, NextApiResponse } from "next";
import metaSchema from "@/model/metaSchema";
import connectDB from "@/lib/dbConnect";

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const { collectionName, fields } = req.body;

  try {
    const newSchema = await metaSchema.create({
      collectionName,
      fields,
    });

    res.status(200).json({ success: true, data: newSchema });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false });
  }
}
