"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FileImage,
  FileText,
  FileAudio,
  FileVideo,
  File,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  createdAt: string;
  previewUrl?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFileIcon(mimeType: string, className = "size-8") {
  if (mimeType.startsWith("image/"))
    return <FileImage className={`${className} text-emerald-500`} />;
  if (mimeType === "application/pdf")
    return <FileText className={`${className} text-rose-500`} />;
  if (mimeType.startsWith("audio/"))
    return <FileAudio className={`${className} text-violet-500`} />;
  if (mimeType.startsWith("video/"))
    return <FileVideo className={`${className} text-amber-500`} />;
  return <File className={`${className} text-slate-400`} />;
}

function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
}

export default function Gallery() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<FileRecord | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const fetched = useRef(false);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files);
      } else {
        setError(data.error || "Failed to load files");
      }
    } catch {
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchFiles();
    }
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/files?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        if (preview?.id === id) setPreview(null);
      }
    } catch {
      // silent
    } finally {
      setDeleting(null);
    }
  };

  const filtered = files.filter((f) => {
    if (filter === "all") return true;
    return getFileCategory(f.mimeType) === filter;
  });

  const counts = {
    all: files.length,
    image: files.filter((f) => getFileCategory(f.mimeType) === "image").length,
    pdf: files.filter((f) => getFileCategory(f.mimeType) === "pdf").length,
    video: files.filter((f) => getFileCategory(f.mimeType) === "video").length,
    audio: files.filter((f) => getFileCategory(f.mimeType) === "audio").length,
    other: files.filter((f) => getFileCategory(f.mimeType) === "other").length,
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gallery</h2>
          <p className="mt-1 text-sm text-slate-500">
            Browse and manage your uploaded files
          </p>
        </div>
        <button
          onClick={fetchFiles}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "image", "pdf", "video", "audio", "other"] as const).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({counts[cat]})
            </button>
          )
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-indigo-500" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="size-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="py-20 text-center">
          <File className="mx-auto size-12 text-slate-300" />
          <p className="mt-4 text-sm text-slate-500">
            {files.length === 0
              ? "No files uploaded yet."
              : "No files match this filter."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-square flex items-center justify-center bg-slate-50 p-4">
                {file.mimeType.startsWith("image/") && file.previewUrl ? (
                  <Image
                    src={file.previewUrl}
                    alt={file.originalName}
                    fill
                    unoptimized
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                ) : file.mimeType === "application/pdf" && file.previewUrl ? (
                  <Image
                    src={file.previewUrl}
                    alt={file.originalName}
                    fill
                    unoptimized
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {getFileIcon(file.mimeType, "size-12")}
                    <span className="text-[10px] font-medium uppercase text-slate-400">
                      {file.mimeType.split("/")[1]?.slice(0, 10) || "file"}
                    </span>
                  </div>
                )}
              </div>

              <div className="px-3 py-2.5">
                <p
                  className="truncate text-xs font-medium text-slate-700"
                  title={file.originalName}
                >
                  {file.originalName}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {formatSize(file.size)} · {formatDate(file.createdAt)}
                </p>
              </div>

              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                {file.previewUrl && (
                  <button
                    onClick={() => setPreview(file)}
                    className="rounded-lg bg-white/90 p-1.5 shadow-sm backdrop-blur transition hover:bg-white"
                    title="Preview"
                  >
                    <Eye className="size-3.5 text-slate-600" />
                  </button>
                )}
                {file.previewUrl && (
                  <a
                    href={file.previewUrl}
                    download={file.originalName}
                    className="rounded-lg bg-white/90 p-1.5 shadow-sm backdrop-blur transition hover:bg-white"
                    title="Download"
                  >
                    <Download className="size-3.5 text-slate-600" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(file.id)}
                  disabled={deleting === file.id}
                  className="rounded-lg bg-white/90 p-1.5 shadow-sm backdrop-blur transition hover:bg-rose-50"
                  title="Delete"
                >
                  {deleting === file.id ? (
                    <Loader2 className="size-3.5 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="size-3.5 text-rose-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-8 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 z-10 rounded-lg bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/70"
            >
              ✕
            </button>
            {preview.mimeType.startsWith("image/") && preview.previewUrl ? (
              <Image
                src={preview.previewUrl}
                alt={preview.originalName}
                width={1200}
                height={800}
                unoptimized
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            ) : preview.mimeType === "application/pdf" && preview.previewUrl ? (
              <iframe
                src={preview.previewUrl}
                className="h-[80vh] w-[70vw]"
                title={preview.originalName}
              />
            ) : preview.mimeType.startsWith("video/") && preview.previewUrl ? (
              <video
                src={preview.previewUrl}
                controls
                className="max-h-[85vh] max-w-[85vw]"
              />
            ) : preview.mimeType.startsWith("audio/") && preview.previewUrl ? (
              <div className="flex flex-col items-center gap-4 p-12">
                {getFileIcon(preview.mimeType, "size-16")}
                <audio src={preview.previewUrl} controls />
                <p className="text-sm font-medium text-slate-700">
                  {preview.originalName}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-12">
                {getFileIcon(preview.mimeType, "size-16")}
                <p className="text-sm font-medium text-slate-700">
                  {preview.originalName}
                </p>
                <p className="text-xs text-slate-400">No preview available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
