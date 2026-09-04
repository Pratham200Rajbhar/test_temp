"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileImage,
  FileText,
  FileAudio,
  FileVideo,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/header";

interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return <FileImage className="size-8 text-emerald-500" />;
  if (mimeType === "application/pdf") return <FileText className="size-8 text-rose-500" />;
  if (mimeType.startsWith("audio/")) return <FileAudio className="size-8 text-violet-500" />;
  if (mimeType.startsWith("video/")) return <FileVideo className="size-8 text-amber-500" />;
  return <File className="size-8 text-slate-400" />;
}

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    setSelectedFiles((prev) => [...prev, ...arr]);
    setError(null);
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setUploaded(data.files);
      setSelectedFiles([]);
    } catch {
      setError("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Upload Files</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload images, PDFs, documents, and more to your gallery
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            isDragging
              ? "border-indigo-400 bg-indigo-50"
              : "border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Upload className="mx-auto size-12 text-slate-400" />
          <p className="mt-4 text-sm font-medium text-slate-700">
            Drop files here or click to browse
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Images, PDFs, videos, audio, and other files
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              {selectedFiles.length} file(s) selected
            </h3>
            <div className="space-y-2">
              {selectedFiles.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Uploading...
                </span>
              ) : (
                `Upload ${selectedFiles.length} file(s)`
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="size-4 shrink-0" /> {error}
          </div>
        )}

        {uploaded.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">
                Uploaded Successfully
              </h3>
              <button
                onClick={() => router.push("/gallery")}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View Gallery →
              </button>
            </div>
            <div className="space-y-2">
              {uploaded.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
                >
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  {getFileIcon(file.mimeType)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
