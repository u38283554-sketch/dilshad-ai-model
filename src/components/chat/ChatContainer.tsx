import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Message, Attachment } from '../../types';
import { MessageItem } from './MessageItem';
import { ThinkingIndicator } from './ThinkingIndicator';
import { WelcomeScreen } from './WelcomeScreen';
import { Composer } from '../composer/Composer';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  modelName: string;
  onSendMessage: (
    content: string,
    attachments: Attachment[],
    options: { webSearch: boolean; deepReasoning: boolean }
  ) => void;
  onRegenerateMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onLikeMessage: (messageId: string) => void;
  onDislikeMessage: (messageId: string) => void;
  onStopGeneration: () => void;
  onOpenUploadModal: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  modelName,
  onSendMessage,
  onRegenerateMessage,
  onEditMessage,
  onLikeMessage,
  onDislikeMessage,
  onStopGeneration,
  onOpenUploadModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [composerSeedPrompt, setComposerSeedPrompt] = useState<string>('');

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isUp);
  };

  const handleSelectWelcomePrompt = (promptText: string) => {
    setComposerSeedPrompt(promptText);
  };

  return (
    <div className="relative flex flex-1 flex-col h-full overflow-hidden bg-neutral-950">
      {/* Scrollable Chat Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto w-full space-y-4">
          {messages.length === 0 ? (
            <WelcomeScreen
              onSelectPrompt={handleSelectWelcomePrompt}
              onOpenUploadModal={onOpenUploadModal}
            />
          ) : (
            <div className="space-y-4 pt-2">
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  onRegenerate={onRegenerateMessage}
                  onEdit={onEditMessage}
                  onLike={onLikeMessage}
                  onDislike={onDislikeMessage}
                />
              ))}

              {isLoading && <ThinkingIndicator modelName={modelName} />}
            </div>
          )}
        </div>
      </div>

      {/* Floating Scroll to Bottom Pill */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-28 right-6 z-30 flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold text-neutral-200 shadow-xl backdrop-blur-md hover:bg-neutral-800 hover:text-white transition"
        >
          <ChevronDown className="h-4 w-4" />
          <span>Scroll to latest</span>
        </button>
      )}

      {/* Bottom Fixed Composer Area */}
      <div className="shrink-0 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent pt-3 z-10">
        <Composer
          onSendMessage={(content, atts, opts) => {
            onSendMessage(content, atts, opts);
            setComposerSeedPrompt('');
          }}
          isLoading={isLoading}
          onStopGeneration={onStopGeneration}
          onOpenUploadModal={onOpenUploadModal}
          initialPrompt={composerSeedPrompt}
        />
      </div>
    </div>
  );
};
