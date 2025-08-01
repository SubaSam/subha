'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, MessageSquareMore, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ChatHistorySidebar from '@/dashboard/Devxcelerate/pipelinegenerator/chathistorysidebar';
import type { ChatSession } from '@/dashboard/Devxcelerate/pipelinegenerator/chathistorysidebar';
import { v4 as uuidv4 } from 'uuid';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import { History } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { HTMLAttributes } from 'react';

type Props = {
  goToStep: (step: number) => void;
  setIsSidebarOpen: (val: boolean) => void;
  setShowChat: (val: boolean) => void;
  showChat: boolean;
  finalPipeline: string;
};

type ChatMessage = {
  sender: 'user' | 'assistant';
  time: string;
  text: string;
};

export default function PipelineFinaloutputChat({
  goToStep,
  setIsSidebarOpen,
  setShowChat,
  showChat,
  finalPipeline,
}: Props) {

  const [typedInstruction, setTypedInstruction] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
 const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const suggestions = [
    { label: "Explain the steps involved in this pipeline", value: "explain-steps" },
    { label: "Describe the purpose of each stage in the pipeline", value: "stage-purpose" },
    { label: "List dependencies between pipeline steps", value: "pipeline-dependencies" },
    { label: "Explain what happens if a step fails", value: "step-failure-effect" },
    { label: "What software or libraries are needed before running the app?", value: "required-libraries" },
    { label: "Which Python version is required?", value: "python-version" },
    { label: "What setup is needed to run the pipeline?", value: "pipeline-setup" },
  ];

    const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const handleUserMessage = async (text: string) => {
  const userMessage: ChatMessage = {
    sender: 'user',
    text,
    time: getCurrentTime(),
  };

  setHasStartedChat(true);
  setChatMessages(prev => [...prev, userMessage]);

  try {
    const response = await fetch('http://127.0.0.1:8000/connect-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: finalPipeline,
        user_input: text,
      }),
    });

    const data = await response.json();

    const assistantMessage: ChatMessage = {
      sender: 'assistant',
      text: data.output
        ?.replace(/\*\*/g, '')
        .replace(/\\n/g, '\n')
        .trim() || 'No response from assistant.',
      time: getCurrentTime(),
    };

    // Update chat messages
    setChatMessages(prev => [...prev, assistantMessage]);

    // Save new chat session
    const newSession: ChatSession = {
      id: uuidv4(),
      messages: [...chatMessages, userMessage, assistantMessage],
      createdAt: new Date().toISOString(),
    };

    setChatSessions(prev => {
      const updated = [...prev, newSession];
      localStorage.setItem("persistent_chat_sessions", JSON.stringify(updated));
      return updated;
    });

  } catch (error) {
    const errorMessage: ChatMessage = {
      sender: 'assistant',
      text: '⚠️ Failed to connect to assistant. Please try again.',
      time: getCurrentTime(),
    };
    setChatMessages(prev => [...prev, errorMessage]);
    console.error('Assistant API Error:', error);
  }
};

useEffect(() => {
  const saved = localStorage.getItem("persistent_chat_sessions");
  if (saved) {
    try {
      const parsed: ChatSession[] = JSON.parse(saved);
      setChatSessions(parsed);
    } catch (e) {
      console.error("Failed to parse chat history:", e);
    }
  }
}, []);


const handleSubmit = async () => {
  if (typedInstruction.trim() === "") return;

  await handleUserMessage(typedInstruction.trim());  // Await the async function
  setTypedInstruction("");
};


const [selectedSuggestion, setSelectedSuggestion] = useState("Select the Suggestions");
const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {showChat && !isMinimized && (
        <>
          <div className="w-full h-[26.5rem] bg-[#f9f9f9] dark:bg-[#0B0B0B] border border-black rounded-md text-black dark:text-white flex flex-col shadow-xl">
          {/* <div className="h-full flex flex-col bg-[#0B0B0B] border rounded-md text-white shadow-xl"> */}

            <div className="flex items-center justify-between text-black dark:text-white px-4 py-2 border-b border-black dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#0B0B0B] rounded-t-md">
              <div className="text-sm flex flex-row gap-1">< MessageSquareMore className='h-5 w-5'/><span className='mt-[-1px]'>Chat</span></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-[12px] px-2 py-1 rounded-md border border-gray-600  text-black dark:text-gray-300 "
                >
                  Chat History
                </button>
                <Minus 
                onClick={() => {setIsMinimized(true); setIsSidebarOpen(true);}}
    className="w-4 h-4 cursor-pointer text-black dark:text-white" />

                <X onClick={() => {
  setShowChat(false);       // this closes the chat
  setIsSidebarOpen(true);   // this opens the sidebar in parent
}}
                 className="w-4 h-4 cursor-pointer text-black dark:text-white" />
              </div>
            </div>

          <div className='h-[90vh]'>
            {!hasStartedChat ? (
              <>
              <div className="mt-18">
                <p className="text-[17px] mb-1 text-center">Welcome back!</p>
                <p className="text-[13px] text-gray-400 mb-4 text-center">Chat to the Experts & Agents to refine the generated code.</p>
                <div className="flex flex-col items-center">
                  <label htmlFor="suggestions" className="text-sm mb-1 mr-45 text-black dark:text-white">
                    Quick Suggestions
                  </label>
                 
                  <DropdownMenu >
  <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      className="w-80 justify-between  bg-[#f0f0f0] dark:bg-[#1D1D1D] text-black dark:text-white text-sm rounded-md"
    >
      {selectedSuggestion}
       <ChevronDown className="ml-2 h-4 w-4 text-black dark:text-white" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="w-80 h-40 bg-[#f0f0f0] dark:bg-[#1D1D1D] border border-[#424242] text-sm">
    {suggestions.map((s, index) => (
      <DropdownMenuItem
        key={index}
        className="cursor-pointer text-black dark:text-white hover:bg-gray-800"
        onClick={() => {
          setSelectedSuggestion(s.label);
          handleUserMessage(s.label);
        }}
      >
        {s.label}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
                </div>
              </div>
            
            </>
            ) : (
              <>
              
<div className="flex flex-col p-1 gap-1  items-center border border-b-gray-600">
  <label className="text-sm text-white">Quick Suggestions</label>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-80 justify-between bg-[#f0f0f0] dark:bg-[#1D1D1D] text-black dark:text-white border border-[#424242] text-sm">
        Select the Suggestions
         <ChevronDown className="ml-2 h-4 w-4 text-black dark:text-white" />
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent className="w-80 h-50 bg-[#f0f0f0] dark:bg-[#1D1D1D] border border-[#424242] text-sm">
      {suggestions.map((s, index) => (
        <DropdownMenuItem
          key={index}
          className="cursor-pointer text-black dark:text-white hover:bg-gray-800"
          onClick={() => handleUserMessage(s.label)}
        >
          {s.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
 
</div>
                
                <div className="flex flex-col px-4 py-2 h-58 space-y-2 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index}>
                      <div className="text-sm flex  items-center text-left">
                        <img className='h-3.5 w-4'src={msg.sender === 'user' ? '/user.svg' : '/expert.svg'} />
                        <p className={msg.sender === 'user' ? 'text-[#86CB81]' : 'text-[#BEDAFF]'}>
                          {msg.sender === 'user' ? 'User' : 'Assistant'}
                        </p>
                        <p className="ml-2 text-[#767676]">{msg.time}</p>
                      </div>
                      <div className={`bg-[#fefefe] dark:bg-[#262626] border ${msg.sender === 'user' ? 'border-[#86CB81]' : 'border-[#BEDAFF]'} text-sm px-4 py-2 rounded-md w-fit max-w-[80%]`}>
                        {/* {msg.text} */}
                             <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            pre(props) {
                              return (
                                <pre
                                  className="whitespace-pre-wrap break-words break-all text-sm bg-[#1e1e1e] text-white p-4 rounded-md overflow-auto max-w-full"
                                  {...props}
                                />
                              );
                            },
                            code({
                              inline,
                              className,
                              children,
                              ...props
                            }: {
                              inline?: boolean;
                              className?: string;
                              children?: React.ReactNode;
                            } & HTMLAttributes<HTMLElement>) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code
                                  className={`${
                                    inline ? 'bg-gray-800 px-1 py-0.5 rounded' : ''
                                  } whitespace-pre-wrap break-words break-all`}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                        
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </>
            )}
          </div>
              <div className="flex flex-row justify-bottom ">
              <Input
                className="h-12 bg-[#ececec] dark:bg-[#1a1a1a] border border-gray-700 text-black dark:text-white text-sm resize-none"
                placeholder="Enter your questions here..."
                onChange={(e) => setTypedInstruction(e.target.value)}
                value={typedInstruction}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                className="absolute right-12 rounded-full text-sm"
              >
                <img src="/purplearrow.svg" className='h-12 w-5'/>
              </button>
            </div>
            
          </div>
{showHistory && (
  <ChatHistorySidebar
    chatSessions={chatSessions}
    onClose={() => setShowHistory(false)}
    onDelete={(id) => {
      setChatSessions(prev => prev.filter(session => session.id !== id));
    }}


    onSelectSession={(id) => {
      const selected = chatSessions.find(s => s.id === id);
      if (selected) {
        setChatMessages(selected.messages); // assumes your chat uses setChatMessages
        setShowHistory(false);
      }
    }}
  />
)}

          
        </>
      )}

{showChat && isMinimized && (
  <div className="fixed bottom-21 right-15 bg-[#000000] text-black dark:text-white border border-gray-600 rounded-md shadow-lg px-2 py-2 flex items-center justify-between w-75 z-50">
    <div className="flex items-center gap-2">
      <MessageSquareMore className="w-4 h-4" />
      <span className="text-sm">Chat </span>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => {
          setIsMinimized(false);       // Maximize chat
          setShowChat(true);           // Show chat window
          setIsSidebarOpen(false);     // Hide sidebar
        }}
      >
        <img src="./Rectangle.svg" alt="Expand" className="w-4 h-4" />
      </button>
      <X
        onClick={() => {
          setShowChat(false);
          setIsSidebarOpen(true);
          setIsMinimized(false);
        }}
        className="w-4 h-4 cursor-pointer text-black dark:text-white"
      />
    </div>
  </div>
)}

    </>
  );
}
