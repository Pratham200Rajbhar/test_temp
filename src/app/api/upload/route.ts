import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "";
      const uniqueId = crypto.randomUUID();
      const s3Key = `uploads/${uniqueId}.${ext}`;

      await uploadToS3(buffer, s3Key, file.type);

      const record = await prisma.fileUpload.create({
        data: {
          filename: `${uniqueId}.${ext}`,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          s3Key,
        },
      });

      uploaded.push(record);
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
