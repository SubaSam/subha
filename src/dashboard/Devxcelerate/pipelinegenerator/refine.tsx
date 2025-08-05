'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineChat from './pipelinechat';
import { vscDarkPlus  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { HTMLAttributes } from 'react';
// refine.tsx
//in props added null
type Props = {
  pipelineData: string; // ✅ allow null
  setFinalPipeline: (value: string) => void;
  goToStep: (step: number) => void;
  currentPipeline: string;
  setCurrentPipeline: (value: string) => void;
};


export default function PipelineRefiner({ goToStep, pipelineData,setFinalPipeline, currentPipeline, setCurrentPipeline }: Props): JSX.Element {
console.log("currentPipeline", currentPipeline);
const [isLoading, setIsLoading] = useState(false);

const handleProceed = () => {
  if (currentPipeline) {
    setFinalPipeline(currentPipeline); // ✅ save latest version
  }
  goToStep(3);
};

  const handleBack = () => goToStep(1);
  const [successMessage, setSuccessMessage] = useState<string | null>("Draft Pipeline Code Extracted Successfully!");
    useEffect(() => {
      if (successMessage) {
        const timer = setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [successMessage]);
  const [showChat, setShowChat] = useState(false);  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) 
// const [currentPipeline, setCurrentPipeline] = useState<string>(() => {
//   return localStorage.getItem("saved_pipeline_code") || pipelineData || '';
// });
// useEffect(() => {
//   localStorage.setItem("saved_pipeline_code", currentPipeline);
// }, [currentPipeline]);
const displayPipeline = currentPipeline || pipelineData || '';
const detectedLang = currentPipeline.includes("pipeline {") ? "groovy" : "yaml";

const handleRequestChange = async (userInput: string) => {
  if (!displayPipeline) return;

  setIsLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:8000/request-change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: displayPipeline,
        user_input: userInput,  // 🔥 use passed-in input here
      }),
    });

    const data = await response.json();

    if (data.output) {
      setCurrentPipeline(data.output);
      setSuccessMessage("Code updated successfully!");
    } else {
      setSuccessMessage("No changes made.");
    }
  } catch (err) {
    console.error("Error:", err);
    setSuccessMessage("Change request failed.");
  } finally {
    setIsLoading(false);
  }
};
//  const cleanedCode = displayPipeline
//   .replace(/^```[\s\S]*?\n/, '') // Remove opening ```lang
//   .replace(/```$/, ''); // Remove closing ```

  
return (
  <div className='flex flex-col'>
  <div className="flex flex-row space-x-2 mt-2 w-full">

    {/* LEFT SIDEBAR */}
    {isSidebarOpen && (
    <div className="bg-[#f9f9f9] dark:bg-[#171717] p-3 w-full rounded-lg shadow-md text-black dark:text-white text-[14px] space-y-4 h-[29rem]">
  <p>Draft Pipeline Code</p>


<div className="bg-[#f5f5f5] h-100 overflow-hidden dark:bg-[#1f1f1f] rounded-md border border-gray-700 flex flex-col">

  {/* Scrollable Markdown content */}
  <div className="flex-grow overflow-y-auto p-2.5">
    {/* {pipelineData && currentPipeline && ( */}
    {displayPipeline && (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code(props) {
            const { className, children } = props;
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : detectedLang;

            return (
              <SyntaxHighlighter
                language={lang}
                style={vscDarkPlus}
                PreTag="div"
                customStyle={{
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  backgroundColor: '#1f1f1f',
                  color: 'white',
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {`\`\`\`${detectedLang}\n${displayPipeline}\n\`\`\``}
      </ReactMarkdown>
    )}
  </div>

  {/* Fixed bottom question box */}
  <div className="bg-[#fafafa] dark:bg-[#171717] h-[3rem] p-1 rounded-md flex items-center gap-2 text-black dark:text-white px-4 ">
    <span className="text-sm italic">
      Would you like to Refine the generated Code or request for change?
    </span>
    <span
      onClick={() => {
        setShowChat(true);
        setIsSidebarOpen(false);
      }}
      className="text-white dark:text-black px-3 py-1 bg-[#171717] dark:bg-white rounded-lg cursor-pointer"
    >
      Yes
    </span>
  </div>
</div>

</div>

    ) }
{!isSidebarOpen && (
  <div
    className="w-8 h-[29rem] rounded-md bg-[#f9f9f9] dark:bg-[#1F1F1F] text-sm border border-gray-700 flex items-center justify-center cursor-pointer"
    onClick={() => {
      setShowChat(false);
      setIsSidebarOpen(true);
    }}
  >
    <p className="text-black dark:text-white text-sm tracking-widest -rotate-90 whitespace-nowrap">
      Draft Pipeline Code {'>'}
    </p>
  </div>
)}

    {/* RIGHT CHAT AREA */}
    <div className="flex-1 w-full" >
      
      {showChat && 
  <PipelineChat
  goToStep={goToStep}
  setIsSidebarOpen={setIsSidebarOpen}
  setShowChat={setShowChat}
  showChat={showChat}
  onSendRequestChange={handleRequestChange}
  currentPipeline={currentPipeline}
  setCurrentPipeline={setCurrentPipeline}  // ✅ pass down updater
/>

  }

      {/* Buttons and Success Message */}
     
    </div>
  </div>
<div className="flex flex-row mt-1 items-center justify-between w-full">
  {/* Left side: keep empty space when no message */}
  <div className="flex flex-row text-sm space-x-2 items-center min-h-[26px]">
    {successMessage && (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30.266 30.266">
          <path d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z" fill="#24d304"/>
        </svg>
        <span className="text-black dark:text-white">{successMessage}</span>
      </>
    )}
  </div>

  {/* Right side: always sticks to end */}
  <div className="flex gap-2 mt-1">
    <Button onClick={handleBack} className="px-4 py-2 h-8 bg-[#2B2B2B] text-white rounded-md  w-24">
      Back
    </Button>
    <Button onClick={handleProceed} className="px-4 py-2 h-8 border border-black bg-white text-black rounded-md  w-24">
      Confirm
    </Button>
  </div>
</div>


      </div>

);

}