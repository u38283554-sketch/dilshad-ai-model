import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  X,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import { Attachment, FileType } from '../../types';
import { formatFileSize, generateId } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded: (attachments: Attachment[]) => void;
  onShowToast: (message: string) => void;
}

interface UploadingItem {
  id: string;
  name: string;
  size: number;
  type: FileType;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  previewUrl?: string;
  data?: string;
  mimeType?: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onFilesUploaded,
  onShowToast,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileList, setFileList] = useState<UploadingItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    Array.from(incomingFiles).forEach((file) => {
      let type: FileType = 'other';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.name.endsWith('.pdf')) type = 'pdf';
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) type = 'docx';
      else if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) type = 'csv';
      else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) type = 'txt';

      const fileId = generateId();
      const previewUrl = type === 'image' ? URL.createObjectURL(file) : undefined;
      const isTextLike = type === 'txt' || type === 'csv' || file.type.startsWith('text/');

      const newItem: UploadingItem = {
        id: fileId,
        name: file.name,
        size: file.size,
        type,
        mimeType: file.type || (type === 'image' ? 'image/png' : 'text/plain'),
        progress: 20,
        status: 'uploading',
        previewUrl,
      };

      setFileList((prev) => [...prev, newItem]);

      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        setFileList((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, data, progress: 100, status: 'completed' } : f))
        );
      };
      reader.onerror = () => {
        setFileList((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'error' } : f))
        );
      };

      if (isTextLike) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFileList((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFinish = () => {
    const completed = fileList
      .filter((f) => f.status === 'completed')
      .map(
        (f): Attachment => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          data: f.data,
          mimeType: f.mimeType,
          status: 'completed',
          previewUrl: f.previewUrl,
        })
      );

    if (completed.length > 0) {
      onFilesUploaded(completed);
      onShowToast(`File uploaded successfully (${completed.length} items ready for Dilshad AI)`);
    }
    setFileList([]);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-neutral-100">Upload files</h2>
              <p className="text-xs text-neutral-400">
                Attach documents, spreadsheets, code, or images for AI analysis.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp,.json,.ts,.js,.py"
          />

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`my-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-950/30'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-950'
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 border border-neutral-700/60 mb-3 text-indigo-400 shadow-inner">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-neutral-200">
              Drag & drop files here
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              or <span className="text-indigo-400 font-medium hover:underline">browse files</span> from your computer
            </p>

            {/* Supported Types Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-neutral-400">
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/40">PDF</span>
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/40">DOCX</span>
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/40">TXT</span>
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/40">CSV</span>
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/40">PNG / JPG</span>
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/40">WEBP</span>
            </div>
          </div>

          {/* Selected Files Progress List */}
          {fileList.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {fileList.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-indigo-400">
                      {file.type === 'image' ? (
                        <ImageIcon className="h-4 w-4 text-pink-400" />
                      ) : file.type === 'csv' ? (
                        <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <FileText className="h-4 w-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-neutral-200">{file.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className={file.status === 'completed' ? 'text-emerald-400' : 'text-indigo-400'}>
                          {file.status === 'completed' ? 'Uploaded' : `${file.progress}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {file.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-200"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-upload"
              onClick={handleFinish}
              disabled={fileList.length === 0 || fileList.some((f) => f.status === 'uploading')}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg transition ${
                fileList.length > 0 && fileList.every((f) => f.status === 'completed')
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Attach {fileList.filter((f) => f.status === 'completed').length || ''} to Chat</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
