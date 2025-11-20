"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  ArrowLeft,
  Calculator,
  Book,
  Lightbulb,
  Bot,
  User,
  MoreVertical,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Reply,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/weaknessApi";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  status?: "sending" | "failed" | "sent";
}

// Enhanced Message Renderer Component with proper LaTeX support
function MessageContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  // Split content into segments for proper rendering
  const renderContent = () => {
    const segments: JSX.Element[] = [];
    let currentIndex = 0;
    let segmentKey = 0;

    // Regex patterns for different content types
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blockLatexRegex = /\$\$([\s\S]*?)\$\$/g;
    const inlineLatexRegex = /\$([^\$\n]+)\$/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    const boldRegex = /\*\*([^\*]+)\*\*/g;
    const italicRegex = /(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/g;
    const headerRegex = /^(#{1,6})\s+(.+)$/gm;
    const listRegex = /^[\*\-]\s+(.+)$/gm;
    const numberedListRegex = /^\d+\.\s+(.+)$/gm;

    // First, extract code blocks (highest priority)
    const codeBlocks: Array<{
      start: number;
      end: number;
      match: RegExpMatchArray;
    }> = [];
    let match: any;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        start: match.index,
        end: match.index + match[0].length,
        match,
      });
    }

    // Extract block LaTeX
    const blockLatexMatches: Array<{
      start: number;
      end: number;
      match: RegExpMatchArray;
    }> = [];
    blockLatexRegex.lastIndex = 0;
    while ((match = blockLatexRegex.exec(content)) !== null) {
      // Only add if not inside a code block
      const inCodeBlock = codeBlocks.some(
        (cb) => match.index >= cb.start && match.index < cb.end
      );
      if (!inCodeBlock) {
        blockLatexMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          match,
        });
      }
    }

    // Combine and sort all block-level matches
    const allBlocks = [...codeBlocks, ...blockLatexMatches].sort(
      (a, b) => a.start - b.start
    );

    // Process content
    allBlocks.forEach((block) => {
      // Add text before this block
      if (block.start > currentIndex) {
        const textSegment = content.slice(currentIndex, block.start);
        segments.push(
          <div key={`text-${segmentKey++}`}>
            {renderInlineContent(textSegment)}
          </div>
        );
      }

      // Add the block
      if (codeBlocks.includes(block)) {
        const language = block.match[1] || "text";
        const code = block.match[2].trim();
        segments.push(
          <CodeBlock
            key={`code-${segmentKey++}`}
            code={code}
            language={language}
          />
        );
      } else {
        const latex = block.match[1];
        segments.push(
          <div
            key={`block-latex-${segmentKey++}`}
            className="my-4 overflow-x-auto"
          >
            <div className="inline-block bg-blue-50 p-4 rounded-lg border border-blue-200">
              <Latex>{`$$${latex}$$`}</Latex>
            </div>
          </div>
        );
      }

      currentIndex = block.end;
    });

    // Add remaining text
    if (currentIndex < content.length) {
      const textSegment = content.slice(currentIndex);
      segments.push(
        <div key={`text-${segmentKey++}`}>
          {renderInlineContent(textSegment)}
        </div>
      );
    }

    return segments;
  };

  const renderInlineContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Check for headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const headerText = headerMatch[2];
        const HeaderTag = `h${Math.min(
          level,
          6
        )}` as keyof JSX.IntrinsicElements;
        const sizeClasses = [
          "text-2xl",
          "text-xl",
          "text-lg",
          "text-base",
          "text-sm",
          "text-sm",
        ];
        return (
          <HeaderTag
            key={lineIdx}
            className={`font-bold ${
              sizeClasses[level - 1]
            } mt-4 mb-2 text-gray-900`}
          >
            {processInlineFormatting(headerText)}
          </HeaderTag>
        );
      }

      // Check for lists
      const listMatch = line.match(/^[\*\-]\s+(.+)$/);
      if (listMatch) {
        return (
          <div key={lineIdx} className="flex gap-2 my-1">
            <span className="text-gray-600">•</span>
            <span>{processInlineFormatting(listMatch[1])}</span>
          </div>
        );
      }

      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        return (
          <div key={lineIdx} className="flex gap-2 my-1">
            <span className="text-gray-600">{numberedListMatch[1]}.</span>
            <span>{processInlineFormatting(numberedListMatch[2])}</span>
          </div>
        );
      }

      // Regular line
      return (
        <div key={lineIdx} className={lineIdx > 0 ? "mt-2" : ""}>
          {processInlineFormatting(line)}
        </div>
      );
    });
  };

  const processInlineFormatting = (text: string) => {
    if (!text.trim()) return <br />;

    const elements: JSX.Element[] = [];
    let remaining = text;
    let key = 0;

    // Process inline elements in order of appearance
    const patterns = [
      { regex: /\$([^\$\n]+)\$/, type: "latex" },
      { regex: /`([^`]+)`/, type: "code" },
      { regex: /\*\*([^\*]+)\*\*/, type: "bold" },
      { regex: /(?<!\*)\*(?!\*)([^\*]+)\*(?!\*)/, type: "italic" },
    ];

    while (remaining.length > 0) {
      let earliestMatch: {
        index: number;
        length: number;
        type: string;
        content: string;
      } | null = null;

      // Find the earliest match
      patterns.forEach((pattern) => {
        const match = remaining.match(pattern.regex);
        if (
          match &&
          (earliestMatch === null || match.index! < earliestMatch.index)
        ) {
          earliestMatch = {
            index: match.index!,
            length: match[0].length,
            type: pattern.type,
            content: match[1],
          };
        }
      });

      if (!earliestMatch) {
        // No more special formatting, add remaining text
        elements.push(<span key={key++}>{remaining}</span>);
        break;
      }

      // Add text before the match
      if (earliestMatch.index > 0) {
        elements.push(
          <span key={key++}>{remaining.slice(0, earliestMatch.index)}</span>
        );
      }

      // Add the formatted element
      switch (earliestMatch.type) {
        case "latex":
          elements.push(
            <span
              key={key++}
              className="inline-block px-1 mx-0.5 bg-blue-50 rounded"
            >
              <Latex>{`$${earliestMatch.content}$`}</Latex>
            </span>
          );
          break;
        case "code":
          elements.push(
            <code
              key={key++}
              className="px-1.5 py-0.5 mx-0.5 bg-gray-100 text-red-600 rounded text-sm font-mono"
            >
              {earliestMatch.content}
            </code>
          );
          break;
        case "bold":
          elements.push(
            <strong key={key++} className="font-semibold text-gray-900">
              {earliestMatch.content}
            </strong>
          );
          break;
        case "italic":
          elements.push(
            <em key={key++} className="italic">
              {earliestMatch.content}
            </em>
          );
          break;
      }

      // Move past the match
      remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
    }

    return <>{elements}</>;
  };

  return (
    <div className="relative group">
      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
        {renderContent()}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </Button>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600 uppercase">
          {language}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-6 w-6"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-800">{code}</code>
      </pre>
    </div>
  );
}

export default function ChatPage() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionPopup, setSelectionPopup] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchHistory = useCallback(
    async (cursor: string | null) => {
      if (cursor === null && messages.length > 0) return;

      setIsLoadingMore(true);
      try {
        const data = await apiService.getConversation(15, cursor);
        setMessages((prev) => [...data.messages, ...prev]);
        setNextCursor(data.nextCursor);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        toast.error("Could not load older messages.");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [messages.length]
  );

  useEffect(() => {
    if (!hasFetched.current) {
      fetchHistory(null);
      hasFetched.current = true;
    }
  }, [fetchHistory]);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setSelectedText(text);
          setSelectionPopup({
            show: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
        }
      } else {
        setSelectionPopup({ show: false, x: 0, y: 0 });
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".selection-popup")) {
        setSelectionPopup({ show: false, x: 0, y: 0 });
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleQuoteText = () => {
    setInputValue(`"${selectedText}"\n\n`);
    setSelectionPopup({ show: false, x: 0, y: 0 });
    inputRef.current?.focus();
    window.getSelection()?.removeAllRanges();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const tempId = `temp_${Date.now()}`;
    const userMessage: Message = {
      id: tempId,
      role: "user",
      content: inputValue,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const { response: assistantContent } = await apiService.sendMessage(
        messageToSend
      );

      const assistantMessage: Message = {
        id: `asst_${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev: any) => {
        const newMessages = prev.map((msg: any) =>
          msg.id === tempId ? { ...msg, status: "sent" } : msg
        );
        return [...newMessages, assistantMessage];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const container = chatContainerRef.current;
    const handleScroll = () => {
      if (container?.scrollTop === 0 && !isLoadingMore && nextCursor) {
        fetchHistory(nextCursor);
      }
    };
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, nextCursor, fetchHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: Calculator,
      label: "Solve Problem",
      message: "Can you help me solve a problem?",
    },
    {
      icon: Book,
      label: "Explain Concept",
      message: "Can you explain a concept to me?",
    },
    {
      icon: Lightbulb,
      label: "Study Tips",
      message: "Do you have study tips for JEE/NEET?",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] flex flex-col">
      {/* Selection Popup */}
      {selectionPopup.show && (
        <div
          className="selection-popup fixed z-50 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${selectionPopup.x}px`,
            top: `${selectionPopup.y}px`,
          }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1.5 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuoteText}
              className="h-8 px-3 hover:bg-gray-100 rounded-md flex items-center gap-2"
            >
              <Reply className="w-4 h-4" />
              <span className="text-sm font-medium">Reply</span>
            </Button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-[#e2e8f0] rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#fe724c]/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[#fe724c]" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-[#2d3748]">
                    AI Tutor
                  </h1>
                  <p className="text-xs text-[#718096]">Always ready to help</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[#e2e8f0] rounded-lg"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto px-6 py-8">
            {isLoadingMore && (
              <div className="flex justify-center my-4">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}

            {messages.length === 0 && !isLoadingMore && (
              <div className="mb-12 text-center space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe724c]/10">
                  <Bot className="w-9 h-9 text-[#fe724c]" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#2d3748]">
                    Welcome to AI Tutor
                  </h2>
                  <p className="text-base text-[#718096] max-w-md mx-auto">
                    I'm here to help you master JEE & NEET concepts. Ask me
                    anything about Physics, Chemistry, Mathematics, or Biology.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="gap-2 h-11 px-5 rounded-lg hover:bg-[#e2e8f0] hover:border-[#fe724c]/50 transition-colors"
                      onClick={() => {
                        setInputValue(action.message);
                        inputRef.current?.focus();
                      }}
                    >
                      <action.icon className="w-4 h-4 text-[#fe724c]" />
                      <span className="font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {message.role === "assistant" ? (
                      <div className="w-8 h-8 rounded-lg bg-[#fe724c]/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-[#fe724c]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#4299e1]/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#4299e1]" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[75%] space-y-1 ${
                      message.role === "user" ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === "assistant"
                          ? "bg-[#ffffff] border border-[#edf2f7] shadow-sm"
                          : "bg-[#fe724c] text-white"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <MessageContent content={message.content} />
                      ) : (
                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-white">
                          {message.content}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-[#718096] px-1">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-lg bg-[#fe724c]/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-[#fe724c]" />
                    </div>
                  </div>
                  <div className="bg-[#ffffff] border border-[#edf2f7] shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <span
                        className="w-2 h-2 bg-[#718096]/50 rounded-full animate-bounce"
                        style={{
                          animationDelay: "0ms",
                          animationDuration: "1s",
                        }}
                      />
                      <span
                        className="w-2 h-2 bg-[#718096]/50 rounded-full animate-bounce"
                        style={{
                          animationDelay: "200ms",
                          animationDuration: "1s",
                        }}
                      />
                      <span
                        className="w-2 h-2 bg-[#718096]/50 rounded-full animate-bounce"
                        style={{
                          animationDelay: "400ms",
                          animationDuration: "1s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="border-t bg-white/95 backdrop-blur-sm">
          <div className="container max-w-4xl mx-auto px-6 py-4">
            {inputValue.startsWith('"') && inputValue.includes('"\n\n') && (
              <div className="mb-3 bg-gray-100 border border-gray-200 rounded-lg p-3 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setInputValue("")}
                  className="absolute top-2 right-2 h-6 w-6 hover:bg-gray-200"
                >
                  <X className="w-3 h-3" />
                </Button>
                <div className="flex gap-2 items-start">
                  <Reply className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 pr-6">
                    <p className="text-xs text-gray-500 mb-1 font-medium">
                      Quoting:
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {inputValue.split('"\n\n')[0].replace(/^"/, "")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-[#fdfdfd] border border-[#edf2f7] rounded-2xl shadow-sm focus-within:border-[#fe724c]/50 focus-within:shadow-md transition-all">
              <div className="flex items-end gap-3 p-3">
                <div className="flex-1 min-h-[44px] flex items-center">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about JEE & NEET preparation..."
                    className="w-full resize-none bg-transparent text-sm text-[#2d3748] placeholder:text-[#718096] focus:outline-none py-2 px-1"
                    rows={1}
                    style={{
                      height: "auto",
                      minHeight: "28px",
                      maxHeight: "120px",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height =
                        Math.min(target.scrollHeight, 120) + "px";
                    }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0 rounded-xl shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <AlertCircle className="w-3.5 h-3.5 text-[#718096]" />
              <p className="text-xs text-[#718096]">
                AI-generated content may contain errors. Verify important
                information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
