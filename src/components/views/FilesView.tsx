import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Code2,
  Upload,
  Search,
  Download,
  Trash2,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { StoredFile, FileType } from '../../types';
import { formatFileSize, formatDate } from '../../lib/utils';
import { motion } from 'motion/react';

interface FilesViewProps {
  files: StoredFile[];
  onOpenUploadModal: () => void;
  onAnalyzeFileInChat: (fileName: string) => void;
  onDeleteFile: (fileId: string) => void;
}

export const FilesView: React.FC<FilesViewProps> = ({
  files,
  onOpenUploadModal,
  onAnalyzeFileInChat,
  onDeleteFile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredFiles = files.filter((file) => {
    const matchesQuery =
      file.name.toLowerCase().includes(search.toLowerCase()) ||
      file.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'all' || file.type === selectedType;
    return matchesQuery && matchesType;
  });

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4 text-pink-400" />;
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-400" />;
      case 'code':
        return <Code2 className="h-4 w-4 text-purple-400" />;
      default:
        return <FileText className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-emerald-950 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-800/60">
              Knowledge Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
            Files & Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse uploaded PDFs, spreadsheets, and source media accessible to Dilshad AI.
          </p>
        </div>

        <button
          id="btn-files-upload-trigger"
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition shrink-0"
        >
          <Upload className="h-4 w-4" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or tags..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pdf', 'csv', 'image', 'docx', 'code'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-lg px-3 py-1.5 text-xs uppercase font-semibold transition ${
                selectedType === type
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Files Table / Grid */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-neutral-800 bg-neutral-950/80 uppercase font-semibold text-[11px] text-neutral-400">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-4 py-3.5">Size</th>
                <th className="px-4 py-3.5">Uploaded</th>
                <th className="px-4 py-3.5">Summary / Tags</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 text-xs">
                    No files found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-neutral-800/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700/60">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-100">{file.name}</p>
                          <span className="text-[10px] text-neutral-500 uppercase font-mono">
                            {file.extension}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-neutral-400">
                      {formatFileSize(file.size)}
                    </td>

                    <td className="px-4 py-3.5 text-neutral-400">
                      {formatDate(file.uploadedAt)}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="truncate text-neutral-400 mb-1">{file.summary || 'Indexed knowledge item'}</p>
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-neutral-800/90 px-1.5 py-0.2 text-[10px] text-neutral-300 border border-neutral-700/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onAnalyzeFileInChat(file.name)}
                          title="Analyze in Chat"
                          className="flex items-center gap-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-900 transition"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Analyze</span>
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          title="Delete file"
                          className="rounded-lg p-1 text-neutral-400 hover:bg-red-950/40 hover:text-red-400 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
