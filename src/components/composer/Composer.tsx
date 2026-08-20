import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowUp,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Mic,
  Sparkles,
  Globe,
  BrainCircuit,
  X,
  Plus,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { Attachment, FileType } from '../../types';
import { formatFileSize, generateId } from '../../lib/utils';
import { VoiceRecorderModal } from './VoiceRecorderModal';

interface ComposerProps {
  onSendMessage: (
    content: string,
    attachments: Attachment[],
    options: { webSearch: boolean; deepReasoning: boolean }
  ) => void;
  isLoading?: boolean;
  onStopGeneration?: () => void;
  onOpenUploadModal?: () => void;
  initialPrompt?: string;
}

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isLoading = false,
  onStopGeneration,
  onOpenUploadModal,
  initialPrompt = '',
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [webSearch, setWebSearch] = useState(false);
  const [deepReasoning, setDeepReasoning] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setText(initialPrompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialPrompt]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSendMessage(text, attachments, { webSearch, deepReasoning });
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const processFileAttachment = (file: File, forcedType?: FileType) => {
    let type: FileType = forcedType || 'other';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.name.endsWith('.pdf')) type = 'pdf';
    else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) type = 'docx';
    else if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) type = 'csv';
    else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) type = 'txt';
    else if (file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.py')) type = 'code';

    const attachmentId = generateId();
    const previewUrl = type === 'image' ? URL.createObjectURL(file) : undefined;

    const newAttachment: Attachment = {
      id: attachmentId,
      name: file.name,
      type,
      size: file.size,
      mimeType: file.type || (type === 'image' ? 'image/png' : 'text/plain'),
      previewUrl,
      status: 'uploading',
      extension: file.name.split('.').pop() || '',
    };

    setAttachments((prev) => [...prev, newAttachment]);

    const reader = new FileReader();
    const isTextLike = type === 'txt' || type === 'code' || type === 'csv' || file.type.startsWith('text/');

    reader.onload = () => {
      const data = reader.result as string;
      setAttachments((prev) =>
        prev.map((att) =>
          att.id === attachmentId
            ? { ...att, data, status: 'completed' }
            : att
        )
      );
    };

    reader.onerror = () => {
      setAttachments((prev) =>
        prev.map((att) =>
          att.id === attachmentId
            ? { ...att, status: 'error' }
            : att
        )
      );
    };

    if (isTextLike) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, forcedType?: FileType) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      processFileAttachment(file, forcedType);
    });

    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        processFileAttachment(file);
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e)}
        accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.json,.js,.ts,.py"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'image')}
        accept="image/*"
      />

      {/* Main Composer Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col rounded-2xl border transition-all duration-200 backdrop-blur-xl shadow-2xl ${
          isDraggingOver
            ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/30'
            : 'border-neutral-800 bg-neutral-900/90 focus-within:border-indigo-500/70 focus-within:ring-1 focus-within:ring-indigo-500/20'
        }`}
      >
        {/* Drag Overlay */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-neutral-950/80 backdrop-blur-sm border-2 border-dashed border-indigo-500">
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
              <FolderOpen className="h-5 w-5 animate-bounce" />
              <span>Drop files here to attach to Dilshad AI</span>
            </div>
          </div>
        )}

        {/* Attachment Chips List */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 pb-0">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="group relative flex items-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-800/80 px-2.5 py-1.5 text-xs text-neutral-200 shadow-sm"
              >
                {att.type === 'image' && att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700/60 text-indigo-300">
                    <FileText className="h-4 w-4" />
                  </div>
                )}
                <div className="max-w-[140px] truncate">
                  <p className="truncate font-medium text-[11px] leading-tight">{att.name}</p>
                  <p className="text-[9px] text-neutral-400">{formatFileSize(att.size)}</p>
                </div>
                <button
                  id={`btn-remove-att-${att.id}`}
                  onClick={() => removeAttachment(att.id)}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            id="composer-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Dilshad AI..."
            rows={1}
            className="w-full resize-none bg-transparent text-sm md:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none max-h-48 leading-relaxed font-sans"
          />
        </div>

        {/* Actions & Tools Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-800/60 bg-neutral-900/40 rounded-b-2xl">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Attachment Menu / Direct click */}
            <button
              id="btn-composer-attach"
              onClick={() => fileInputRef.current?.click()}
              title="Attach File"
              className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Image picker */}
            <button
              id="btn-composer-image"
              onClick={() => imageInputRef.current?.click()}
              title="Upload Image"
              className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
            >
              <ImageIcon className="h-4 w-4" />
            </button>

            {/* Drag Modal Trigger */}
            {onOpenUploadModal && (
              <button
                id="btn-composer-modal-upload"
                onClick={onOpenUploadModal}
                title="Browse Full File Manager"
                className="hidden sm:flex items-center gap-1 rounded-xl px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Files</span>
              </button>
            )}

            {/* Voice Input */}
            <button
              id="btn-composer-voice"
              onClick={() => setIsVoiceOpen(true)}
              title="Voice Prompt"
              className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
            >
              <Mic className="h-4 w-4" />
            </button>

            <div className="h-4 w-[1px] bg-neutral-800 mx-1 hidden sm:block" />

            {/* Web Search Toggle */}
            <button
              id="btn-toggle-web-search"
              onClick={() => setWebSearch(!webSearch)}
              title="Search Live Web (Grounding)"
              className={`hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                webSearch
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Web</span>
            </button>

            {/* Deep Reasoning Toggle */}
            <button
              id="btn-toggle-deep-reasoning"
              onClick={() => setDeepReasoning(!deepReasoning)}
              title="Activate Deep Multi-Step Reasoning"
              className={`hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium transition ${
                deepReasoning
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/80'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
              }`}
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Reasoning</span>
            </button>
          </div>

          {/* Right Action (Send or Stop) */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                id="btn-stop-generation"
                onClick={onStopGeneration}
                className="flex items-center gap-1.5 rounded-xl bg-red-600/90 px-3 py-1.5 text-xs font-medium text-white shadow-md hover:bg-red-500 transition"
              >
                <div className="h-2 w-2 rounded-xs bg-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                id="btn-send-message"
                onClick={handleSend}
                disabled={!text.trim() && attachments.length === 0}
                title="Send message (Enter)"
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${
                  text.trim() || attachments.length > 0
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-neutral-500">
        Dilshad AI can make mistakes. Verify important facts, code, and financial estimates.
      </p>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptReady={(transcript) => {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }}
      />
    </div>
  );
};
