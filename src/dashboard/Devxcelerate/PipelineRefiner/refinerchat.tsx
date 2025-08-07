'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Textarea } from "@/components/ui/textarea";
import { X, Minus, MessageSquareMore, CircleArrowRight, Trash, Loader, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { History } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { HTMLAttributes } from 'react';





type Props = {
  
  setIsSidebarOpen: (open: boolean) => void;
  setShowChat: (open: boolean) => void;
  showChat: boolean;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
  currentPipeline: string;
  setCurrentPipeline: (code: string) => void; // ✅ new
  setUploadedFileName: (name: string | null) => void; // ✅ new
  fileUploaded: boolean; // ✅ new
  setFileUploaded: (uploaded: boolean) => void; // ✅ new
  refinementStarted: boolean; // ✅ new
  setRefinementStarted: (started: boolean) => void; // ✅ new
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  // displayPipeline: string; // ✅ new
  // setPipelineData: (data: string) => void; // ✅ new
};


type Message = {
  text: string;
  time: string;
  sender: 'user' | 'refiner' | 'devops';
};

type ChatSession = {
  id: string;
  messages: Message[];
  createdAt: string;
};

const CHAT_HISTORY_KEY = "pipeline_chat_sessions";

export default function RefinerChat({
 
  setIsSidebarOpen,
  setShowChat,
  showChat,
  isMinimized,
  setIsMinimized,
  currentPipeline,
  setCurrentPipeline,
  setUploadedFileName,
  fileUploaded,
  setFileUploaded,
  refinementStarted,
  setRefinementStarted,
  chatMessages,
  setChatMessages
  // displayPipeline,
  // setPipelineData,
}: Props) {
  const [tab, setTab] = useState("refine");
  // const [refinementStarted, setRefinementStarted] = useState(false);
const [isRefinerTyping, setIsRefinerTyping] = useState(false);
const [isDevopsTyping, setIsDevopsTyping] = useState(false);
                                                     
const [refinementAgentMessage, setRefinementAgentMessage] = useState<Message[]>([]);
 const [devOpsExpertMessage, setDevOpsExpertMessage] = useState<Message[]>([]);
  const [typedInstruction, setTypedInstruction] = useState("");
  const [feedbackInstruction, setFeedbackInstruction] = useState("");
  // const [chatMessages, setChatMessages] = useState<Message[]>([]);
  // const [isMinimized, setIsMinimized] = useState(false);
  const [refinementTime, setRefinementTime] = useState("");
  const [devOpsTime, setDevOpsTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");



  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);


  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const handleFinalize = () => {
  console.log("chatMessages:", chatMessages);

  // Traverse from the end to find the latest 'refiner' message with a code block
  for (let i = chatMessages.length - 1; i >= 0; i--) {
    const message = chatMessages[i];
    if (message.sender === 'refiner' && message.text.includes('```')) {
      const match = message.text.match(/```(?:\w*\n)?([\s\S]*?)```/);
      if (match && match[1]) {
        const extractedCode = match[1].trim();
        console.log("Extracted code:", extractedCode);
        setCurrentPipeline(extractedCode); // ✅ Update final pipeline
        break;
      }
    }
  }
};


const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    setCurrentPipeline(text);
    setUploadStatus("success");
    setFileUploaded(true);
    setUploadedFileName(file.name);

    // ✅ Hide success message after 3 seconds
    setTimeout(() => {
      setUploadStatus("idle");
    }, 3000);

  } catch (error) {
    console.error("Upload failed:", error);
    setUploadStatus("error");

    // ✅ Hide error message after 3 seconds
    setTimeout(() => {
      setUploadStatus("idle");
    }, 3000);
  }
};



const sendMessage = async (message: string) => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  setChatMessages((prev) => [
    ...prev,
    { sender: 'user', text: message, time: currentTime },
  ]);

  // 🔁 Send feedback to API for "Continue"
  await sendFeedback(message);
};

const handleSendFeedback = async () => {
  if (feedbackInstruction.trim() === "") return;

  const time = getCurrentTime();
  const userMsg: Message = {
    text: feedbackInstruction,
    time,
    sender: 'user',
  };

  setChatMessages(prev => {
    const updated = [...prev, userMsg];
    addMessageToCurrentSession(userMsg);
    return updated;
  });
setFeedbackInstruction("");  // clear input
  await sendFeedback(feedbackInstruction);  // 📩 ONLY sends feedback
  
};


const handleStartRefinement = async () => {
  try {
    setIsLoading(true); // ⏳ Start loading
    setIsRefinerTyping(true);
    setIsDevopsTyping(true);

    const response = await fetch("http://127.0.0.1:8000/start-refinement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pipeline_code: currentPipeline,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to start refinement");
    }

    const data = await response.json();
    const refinement_agent_message = data.refiner;
    const devops_expert_message = data.devops;
    setRefinementStarted(true);
    setRefinementAgentMessage(
      refinement_agent_message || "Refinement agent did not respond."
    );
    setDevOpsExpertMessage(
      devops_expert_message || "DevOps expert did not respond."
    );

    // ⏱️ Delayed response for more realistic chat
    if (refinement_agent_message) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            text: refinement_agent_message,
            time: getCurrentTime(),
            sender: "refiner",
          },
        ]);
        setIsRefinerTyping(false);
      }, 1000); // 1s delay
    } else {
      setIsRefinerTyping(false);
    }

    if (devops_expert_message) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            text: devops_expert_message,
            time: getCurrentTime(),
            sender: "devops",
          },
        ]);
        setIsDevopsTyping(false);
      }, 2000); // 2s delay
    } else {
      setIsDevopsTyping(false);
    }

    console.log("refine", refinement_agent_message);
    console.log("expert", devops_expert_message);

  } catch (err) {
    console.error("Error:", err);
    alert("Failed to start refinement. Check API.");
    setIsRefinerTyping(false);
    setIsDevopsTyping(false);
  } finally {
    setIsLoading(false); // ✅ Stop loading
  }
};


const sendFeedback = async (feedback: string) => {
  try {
    setIsRefinerTyping(true);
    setIsDevopsTyping(true);

    const response = await fetch('http://127.0.0.1:8000/send-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedback }),
    });

    if (!response.ok) throw new Error("Feedback API failed");

    const data = await response.json();

    const refinementAgentMessagefromapi = data.refiner;
    const devOpsExpertMessagefromapi = data.devops;

    const now = getCurrentTime();

    // ⏱️ Simulate "typing..." and delayed arrival
    if (refinementAgentMessagefromapi) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { text: refinementAgentMessagefromapi, time: getCurrentTime(), sender: 'refiner' },
        ]);
        setIsRefinerTyping(false);
      }, 1000); // 1s delay
    } else {
      setIsRefinerTyping(false);
    }

    if (devOpsExpertMessagefromapi) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { text: devOpsExpertMessagefromapi, time: getCurrentTime(), sender: 'devops' },
        ]);
        setIsDevopsTyping(false);
      }, 2000); // 1.5s delay
    } else {
      setIsDevopsTyping(false);
    }

  } catch (error) {
    console.error("Failed to send feedback:", error);
    setIsRefinerTyping(false);
    setIsDevopsTyping(false);
  }
};


const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

// useEffect(() => {
//   const saved = localStorage.getItem(CHAT_HISTORY_KEY);
//   if (saved) {
//     const sessions: ChatSession[] = JSON.parse(saved);
//     setChatSessions(sessions);
//     if (sessions.length > 0) {
//       setActiveSessionId(sessions[sessions.length - 1].id);
//       //setChatMessages(sessions[sessions.length - 1].messages);
//     }
//   }
// }, []);

const saveSessionsToLocal = (sessions: ChatSession[]) => {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(sessions));
};
const [isLoading, setIsLoading] = useState(false);


const addMessageToCurrentSession = (msg: Message) => {
  if (!activeSessionId) return;

  const updatedSessions = chatSessions.map(session =>
    session.id === activeSessionId
      ? { ...session, messages: [...session.messages, msg] }
      : session
  );

  setChatSessions(updatedSessions);
  // setChatMessages(prev => [...prev, msg]);
  saveSessionsToLocal(updatedSessions);
};

const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  return (
      <>
      {showChat && !isMinimized &&  (
        <>
      <div className="w-full h-[468px] bg-[#E7E7E7] dark:bg-[#0B0B0B] border rounded-md text-black dark:text-white flex flex-col shadow-xl">
      {/* <div className="fixed inset-0 z-50 bg-[#0B0B0B] text-white flex flex-col shadow-xl"> */}

        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#E7E7E7] dark:bg-[#0B0B0B] rounded-t-md">
          <div className="text-sm flex flex-row gap-1"><MessageSquareMore />Chat</div>
          <div className="flex items-center gap-2">
            <Minus
 onClick={() => {setIsMinimized(true); setIsSidebarOpen(true);}}

className="w-4 h-4 cursor-pointer text-black dark:text-white" />
            <X 
  onClick={() => {
  setShowChat(false);       // this closes the chat
  setIsSidebarOpen(true);   // this opens the sidebar in parent
}}


                  
 className="w-4 h-4 cursor-pointer text-black dark:text-white" />
          </div>
        </div>

        
        <Tabs value={tab} onValueChange={setTab} className="flex flex-col  overflow-hidden">
          <TabsList className="flex border-b border-gray-700">
            <TabsTrigger value="refine" className={`flex flex-row px-4 py-2 text-sm ${tab === 'refine' ? 'text-black dark:text-white border-b-2 border-purple-500' : 'text-gray-400'}`}>
             <img src="/refineexperts.svg" className='w-4 h-3.5 mt-0.5'/>
             <p className='ml-1'> Refine Experts</p>
              
            </TabsTrigger>
           
 
           
            {tab === 'refine' && (
                <div className="flex ml-auto mt-1 space-x-2">
                <Button
                  className="h-8 border border-gray-600  text-black dark:text-gray-300 text-sm  bg-[white] dark:bg-[#0B0B0B] "
                  onClick={() => {
  setChatMessages([]);
  const newSession: ChatSession = {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    messages: [],
  };
  const updatedSessions = [...chatSessions, newSession];
  setChatSessions(updatedSessions);
  setActiveSessionId(newSession.id);
  saveSessionsToLocal(updatedSessions);
  setFileUploaded(false); // Reset file upload state
  setRefinementStarted(false);
  // setRefinementAgentMessage("");
  // setDevOpsExpertMessage("");
  setRefinementTime(getCurrentTime());
  setDevOpsTime(getCurrentTime());
}}

                >
                  <img className="h-4 w-4 mt-1" src="/restartchat.svg" />
                  <span>New Chat</span>
                </Button>

                <Button
                  className="h-8 border border-gray-600  text-black dark:text-gray-300 text-sm bg-[white] dark:bg-[#0B0B0B]  "
                  onClick={() => setShowHistory(true)}
                >
                  <img className="h-4 w-4 mt-1" src="/chathistory.svg" />
                  <span>Chat History</span>
                </Button>
              </div> 
)}
          </TabsList>

          {/* Refine Tab */}
          <TabsContent value="refine" className="relative  h-[75vh] w-full p-2  ">
            <div className="flex flex-col h-[48vh] w-full">
              <div className={`${refinementStarted ? 'invisible' : 'visible'} transition-all duration-300`}>
                {!refinementStarted && (
                  <div className="mt-10 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-3">
    <p className="text-sm text-black dark:text-white">Please do upload the generated code:</p>

    <label className="relative items-center">
      <input
        type="file"
        accept=".yaml,.yml,.json,.txt"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      <Button
        className="bg-gray-800 text-white dark:bg-[#323233] dark:text-white text-xs px-3 py-2 h-8 rounded-lg"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <img src="./download.svg" className="h-3 w-4 inline-block" />
        Upload
      </Button>
    </label>
    {uploadStatus === "success" && (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs mt-2">
      <div className="flex flex-row gap-1">
       <svg  xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 30.266 30.266">
          <path d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z" fill="#24d304"/>
        </svg>
      <p className="text-black dark:text-white text-xs"> Upload done successfully!</p>
      </div>
      <hr className="w-full border-t border-gray-700" />
    </div>
  )}
  
  {uploadStatus === "error" && (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs mt-2">
   
      <p className="text-black dark:text-white text-sm"> Upload failed. Try again.</p>
      <hr className="w-full border-t border-gray-700" />
    </div>
  )}
  </div>

  

</div>
  )}

   {!refinementStarted && (
<>
    
 <div
    className={`
      mt-6 text-center transition-opacity duration-300
      ${fileUploaded ? 'opacity-100 pointer-events-auto' : 'opacity-20 pointer-events-none'}
    `}
  >
    <p className="text-[17px]">Welcome back!</p>
    <p className="text-[13px] text-gray-400 mb-4">
      Chat to the Experts & Agents to refine the generated code.
    </p>
    <div className="items-center justify-center">
      <Button
        onClick={handleStartRefinement}
        className="bg-black dark:bg-white text-white dark:text-black"
        disabled={!fileUploaded}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white dark:text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <LoaderCircle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            <span>Refining...</span>
          </div>
        ) : (
          "Start Refinement"
        )}
      </Button>
    </div>
  </div>
  </>
)}

    
</div>


              
                <div className='h-90  w-full overflow-y-auto'>
                {refinementStarted && (
<div className="space-y-2  overflow-y-auto px-2 max-w-full sm:max-w-[1000px] mr-auto">


{chatMessages.map((msg, index) => (
  <div key={index}>
    {msg.sender === 'user' && (
      <>
        <div className="text-sm flex gap-1 text-[#86CB81]">
          <img className='h-3.5 w-3 mt-0.5 ' src="/user.svg" />
          User 
        </div>
        <div className="bg-[#e1dbd6] dark:bg-[#262626] border border-[#497245] relative text-sm px-4 py-2 pb-5 whitespace-pre-wrap break-words rounded-md w-fit max-w-full  ">
          {msg.text} <span className='absolute bottom-1 right-1 text-[10px] text-gray-300'>{msg.time}</span>
        </div>
      </>
    )}
    {msg.sender === 'refiner' && (
      <>
        <div className="text-sm gap-1 flex flex-row text-[#FFD5D5]">
          <img className='h-3.5 w-3 mt-0.5 mr-0.5' src="/agent.svg" />
          Refinement Agent 
        </div>
      <div className="relative bg-[#e1dbd6] dark:bg-[#262626] border border-[#958686] text-sm px-4 py-2 pb-5 rounded-md  break-words rounded-md w-fit max-w-full">
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
<span className='absolute bottom-1 right-2 text-[10px] text-gray-300'>{msg.time}</span>


        </div>
      </>
    )}
    {msg.sender === 'devops' && (
      <>
        <div className="text-sm flex flex-row text-[#BEDAFF]">
          <img className='h-3.5 w-3 mt-0.5 mr-1' src="/expert.svg" />
          DevOps Expert 
        </div>
        <div className="bg-[#e1dbd6] dark:bg-[#262626] border border-[#4071A7] px-4 py-2 pb-5 relative rounded-md  break-words text-sm w-fit max-w-full">
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
  components={{
    pre(props) {
      return (
        <pre
          className="whitespace-pre-wrap break-words break-all text-sm bg-[#1e1e1e] text-black dark:text-white p-4 rounded-md overflow-auto max-w-full"
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
<span className='absolute bottom-1 right-2 text-[10px] text-gray-300'>{msg.time}</span>
        </div>
      </>
    )}
  </div>
))}
{isRefinerTyping && (
  <div className="text-sm gap-1 flex flex-row text-[#FFD5D5]">
    <img className='h-3.5 w-3 mt-0.5 mr-0.5' src="/agent.svg" />
     Refinement Agent
     {/* <span className='ml-1 text-xs mt-1 text-white'>{getCurrentTime()}</span> */} 
   <div className="flex items-center gap-1 text-gray-300 italic text-sm">
  typing
  <span className="flex gap-1">
    <span className="animate-bounce">.</span>
    <span className="animate-bounce [animation-delay:0.15s]">.</span>
    <span className="animate-bounce [animation-delay:0.3s]">.</span>
  </span>
</div>

  </div>
)}

{isDevopsTyping && (
  <div className="text-sm flex items-center text-[#BEDAFF]">
    <img className="h-3.5 w-3 mt-0.5 mr-1" src="/expert.svg" />
    DevOps Expert

    
    {/* <span className="ml-2 text-xs text-gray-300">{getCurrentTime()}</span> */}

    <div className="ml-1 flex items-center gap-1 text-gray-300 italic text-sm">
      typing
      <span className="flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce [animation-delay:0.15s]">.</span>
        <span className="animate-bounce [animation-delay:0.3s]">.</span>
      </span>
    </div>
  </div>
)}

                       <div ref={messagesEndRef} />
                    

            </div>   
                )}
                </div>
               
           
                
              </div>
                <div className="relative w-full">
                  <Input
                    className="h-12 bg-[#ececec] dark:bg-[#1a1a1a] border border-gray-700  text-black dark:text-white text-sm pr-12"
                    placeholder="Enter your custom instruction here..."
                    onChange={(e) => setFeedbackInstruction(e.target.value)}
                    disabled={!refinementStarted}
                    value={feedbackInstruction}
                 onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendFeedback(); // 👈 cleaner
    }
                  
                }}
                    
                  />
                  <button
                  disabled={!refinementStarted}
                   
                    onClick={handleSendFeedback}

                  className="absolute right-4  top-0 text-white rounded-full text-sm"
                  >
                    <img className='h-12 w-5' src="/purplearrow.svg"/>
                  </button>

           
                  <div className="flex  mt-2 justify-between items-center">
  {/* Left side: Keep original Pipeline */}
  
  <div>
    <Button
//     onClick={() => {
//       console.log("pipelineData:", displayPipeline);
//   if (displayPipeline) {
//     setCurrentPipeline(displayPipeline);
//     setShowSuccessMessage(true);
//     setTimeout(() => setShowSuccessMessage(false), 3000);
//   }
// }}

      
      // disabled={!refinementStarted}
      className={`justify-start h-7 ${refinementStarted ? 'bg-[#212121] text-white' : 'bg-black text-gray-300 '}`}
    >
      Keep original Pipeline
    </Button>
    {showSuccessMessage && (
  <p className="text-green-600 text-sm mt-2">
    ✅ Original pipeline replaced successfully.
  </p>
)}

  </div>

  {/* Right side: Continue + Finalize Pipeline */}
  <div className="flex gap-2 items-center">
    <Button
      onClick={async () => await sendMessage("Continue")}
      disabled={!refinementStarted}
      className={`justify-end h-6.5 ${refinementStarted ? 'bg-white text-black' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
    >
      Continue
    </Button>
    <Button
      onClick={() => setShowModal(true)}
      disabled={!refinementStarted}
      className={`h-6.5 ${refinementStarted ? 'bg-white text-black' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
    >
      Finalize Pipeline
    </Button>
  </div>
</div>

              </div>
              
          </TabsContent>

{showHistory && (
  <div className="absolute mt-10 right-8 h-85 w-80 overflow-y-auto bg-[#1F1F1F] text-white border border-gray-700 rounded-md  z-50">
   <header className="flex items-center py-2 ">
  <History className="ml-2" />

  <h3 className="text-sm text-white ml-2">Chat History</h3>
  <div className="flex-grow" />
  <button
    onClick={() => setShowHistory(false)}
    className="mr-3"
  >
    <X className="w-5 h-5 text-white" />
  </button>
</header>


    {chatSessions.length === 0 ? (
      <p className="text-gray-500 text-sm p-1">No chat history yet.</p>
    ) : (
      chatSessions.map((session) => (
        <div
          key={session.id}
          className="mb-2 bg-[#2a2a2a] p-2 rounded-md hover:bg-[#3a3a3a] transition-all flex flex-row justify-between"
        >
          <div
            className="text-xs rounded-lg text-gray-300 cursor-pointer "
            onClick={() => {
              
              setActiveSessionId(session.id);
              setChatMessages(session.messages);
              setShowHistory(false);
            }}
          >
            {session.messages.find(m => m.sender === 'user')?.text.slice(0, 40) || 'Untitled Chat'}
          </div>
          <button
            onClick={() => {
              const updated = chatSessions.filter(s => s.id !== session.id);
              setChatSessions(updated);
              if (session.id === activeSessionId) {
                setChatMessages([]);
                setActiveSessionId(null);
              }
              saveSessionsToLocal(updated);
            }}
            className="text-xs text-gray-500"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ))
    )}
  </div>
)}
       
        </Tabs>
        
      </div>
      </>
      )}
      
      {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-transparent bg-black/60">
        <div className="bg-[#1a1a1a] text-black dark:text-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
           <p className="text-white text-lg mt-9">
              Do you want to replace the pipeline Code with original?
            </p>
            <div className="flex justify-center mt-7 space-x-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 h-10 w-20 bg-[#2B2B2B] rounded-md"
              >
                No
              </button>
              <button
                onClick={() => {
                   handleFinalize();
                        setShowModal(false);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000); 
                        // hide after 3 seconds
                      }}
                className="px-6 py-2h-10 w-20 bg-white text-black rounded-md"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className=" fixed bottom-4  mt-[-5px] text-sm flex flex-row text-black dark:text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <span >
          <svg xmlns="http://www.w3.org/2000/svg" width="30.266" height="16" viewBox="0 0 30.266 30.266">
                <g id="check-circle-fill" transform="translate(0 0)">
                  <g id="Group_76" data-name="Group 76" transform="translate(0 0)">
                    <path id="Path_81" data-name="Path 81" d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z" transform="translate(0 0)" fill="#24d304"/>
                  </g>
                </g>
          </svg>
          </span>  
          Finalize Pipeline replaced with original successfully!
        </div>
      )}

    
      {showChat && isMinimized && (
  <div className="fixed bottom-17 right-12 bg-[#E7E7E7] dark:bg-[#0B0B0B] text-black dark:text-white border border-gray-600 rounded-md shadow-lg px-2 py-2 flex items-center justify-between w-75 z-50">
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
