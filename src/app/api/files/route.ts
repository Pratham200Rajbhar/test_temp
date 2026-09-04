import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromS3, getPresignedUrl } from "@/lib/s3";

export async function GET() {
  try {
    const files = await prisma.fileUpload.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const previewUrl = await getPresignedUrl(file.s3Key);
        return { ...file, createdAt: file.createdAt.toISOString(), previewUrl };
      })
    );

    return NextResponse.json({ files: filesWithUrls });
  } catch (error) {
    console.error("Fetch files error:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing file id" }, { status: 400 });
    }

    const file = await prisma.fileUpload.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await deleteFromS3(file.s3Key);
    await prisma.fileUpload.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
