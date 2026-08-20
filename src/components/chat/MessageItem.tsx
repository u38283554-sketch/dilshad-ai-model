import React, { useState } from 'react';
import {
  Sparkles,
  User as UserIcon,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  Edit3,
  Flag,
  Share2,
  BrainCircuit,
} from 'lucide-react';
import { Message, Attachment } from '../../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { formatDate, formatFileSize } from '../../lib/utils';
import { motion } from 'motion/react';

interface MessageItemProps {
  message: Message;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onRegenerate,
  onEdit,
  onLike,
  onDislike,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        // Strip markdown characters for cleaner speech
        const cleanText = message.content.replace(/[#*`_~[\]()]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      // Mock toggle if SpeechSynthesis is unavailable in iframe
      setIsSpeaking(!isSpeaking);
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit && editValue.trim()) {
      onEdit(message.id, editValue.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative py-5 px-3 md:px-4 rounded-2xl transition-colors ${
        isUser ? 'bg-transparent' : 'bg-neutral-900/30 border border-neutral-800/40'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        {isUser ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 font-medium text-xs border border-neutral-700/60 shadow-sm">
            <UserIcon className="h-4 w-4 text-neutral-300" />
          </div>
        ) : (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-[1px] shadow-md shadow-indigo-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-neutral-950">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-200">
                {isUser ? 'You' : message.model || 'Dilshad AI Pro'}
              </span>
              {!isUser && (
                <span className="rounded-full bg-indigo-950/80 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-800/50">
                  AI
                </span>
              )}
              <span className="text-[11px] text-neutral-300 font-normal">
                {formatDate(message.timestamp)}
              </span>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUser && !isEditing && (
                <button
                  id={`btn-edit-user-msg-${message.id}`}
                  onClick={() => setIsEditing(true)}
                  title="Edit message"
                  className="rounded-lg p-1.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                id={`btn-copy-msg-${message.id}`}
                onClick={handleCopy}
                title="Copy message"
                className="rounded-lg p-1.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* User Attachments Preview if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 pb-1.5">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-neutral-200 shadow-sm"
                >
                  {att.type === 'image' ? (
                    <ImageIcon className="h-4 w-4 text-pink-400 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                  )}
                  <div className="max-w-[180px] truncate">
                    <p className="font-medium truncate">{att.name}</p>
                    <p className="text-[10px] text-neutral-300">{formatFileSize(att.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reasoning / Thought Accordion (AI responses) */}
          {message.reasoning && (
            <div className="my-2 rounded-xl border border-neutral-800/80 bg-neutral-950/60 overflow-hidden">
              <button
                id={`btn-reasoning-toggle-${message.id}`}
                onClick={() => setShowReasoning(!showReasoning)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Reasoning Process ({message.reasoning.split('\n').length} steps)</span>
                </div>
                {showReasoning ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {showReasoning && (
                <div className="px-4 py-3 border-t border-neutral-800/60 bg-neutral-950/90 text-xs text-neutral-400 leading-relaxed font-mono">
                  <MarkdownRenderer content={message.reasoning} />
                </div>
              )}
            </div>
          )}

          {/* Main Message Text / Edit Field */}
          {isEditing ? (
            <div className="space-y-2 pt-1">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full rounded-xl border border-indigo-500 bg-neutral-950 p-3 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                rows={3}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition"
                >
                  Save & Resubmit
                </button>
              </div>
            </div>
          ) : isUser ? (
            <div className="text-sm md:text-base text-neutral-100 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {/* AI Message Action Footer */}
          {!isUser && (
            <div className="flex flex-wrap items-center justify-between pt-3 text-xs text-neutral-300 border-t border-neutral-800/40">
              <div className="flex items-center gap-1">
                {/* Copy */}
                <button
                  id={`btn-copy-action-${message.id}`}
                  onClick={handleCopy}
                  title="Copy full response"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Regenerate */}
                {onRegenerate && (
                  <button
                    id={`btn-regen-action-${message.id}`}
                    onClick={() => onRegenerate(message.id)}
                    title="Regenerate answer"
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Regenerate</span>
                  </button>
                )}

                {/* Like */}
                <button
                  id={`btn-like-${message.id}`}
                  onClick={() => onLike && onLike(message.id)}
                  title="Good response"
                  className={`flex items-center gap-1.5 rounded-lg p-1.5 transition ${
                    message.reactions?.liked
                      ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>

                {/* Dislike */}
                <button
                  id={`btn-dislike-${message.id}`}
                  onClick={() => onDislike && onDislike(message.id)}
                  title="Poor response"
                  className={`flex items-center gap-1.5 rounded-lg p-1.5 transition ${
                    message.reactions?.disliked
                      ? 'bg-red-950/60 text-red-400 border border-red-800'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>

                {/* Read Aloud */}
                <button
                  id={`btn-read-aloud-${message.id}`}
                  onClick={handleSpeak}
                  title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition ${
                    isSpeaking
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span>{isSpeaking ? 'Speaking...' : 'Read'}</span>
                </button>
              </div>

              {/* More Dropdown */}
              <div className="relative">
                <button
                  id={`btn-more-menu-${message.id}`}
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  title="More actions"
                  className="rounded-lg p-1.5 text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 bottom-full mb-1 w-44 rounded-xl border border-neutral-800 bg-neutral-900 p-1 shadow-2xl z-20">
                    <button
                      onClick={() => {
                        handleCopy();
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy raw markdown</span>
                    </button>
                    {onRegenerate && (
                      <button
                        onClick={() => {
                          onRegenerate(message.id);
                          setShowMoreMenu(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Regenerate with thoughts</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleSpeak();
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Read aloud</span>
                    </button>
                    <button
                      onClick={() => {
                        alert('Feedback reported. Thank you for helping refine Dilshad AI models.');
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40"
                    >
                      <Flag className="h-3.5 w-3.5" />
                      <span>Report response</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
