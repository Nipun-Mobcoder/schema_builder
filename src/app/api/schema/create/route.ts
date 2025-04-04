import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import metaSchema from '@/model/metaSchema';

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { collectionName, fields } = await request.json();

    if (!collectionName || !fields?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingSchema = await metaSchema.findOne({ collectionName });
    if (existingSchema) {
      return NextResponse.json(
        { success: false, error: 'Collection already exists' },
        { status: 409 }
      );
    }

    const newSchema = await metaSchema.create({
      collectionName,
      fields
    });

    return NextResponse.json({ success: true, data: newSchema }, { status: 201 });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Schema creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}