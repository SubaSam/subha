'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, type JSX } from 'react';
import RefinerChat from './refinerchat';
import { vscDarkPlus  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

type Props = {
  pipelineData: string; // ✅ allow null
  setPipelineData: (value: string) => void;
  
  currentPipeline: string;
  setCurrentPipeline: (value: string) => void;
};
type Message = {
  text: string;
  time: string;
  sender: 'user' | 'refiner' | 'devops';
};

export default function PipelineRefinercode({ pipelineData, setPipelineData, currentPipeline, setCurrentPipeline }: Props): JSX.Element {
console.log("currentPipeline", currentPipeline);
const [isLoading, setIsLoading] = useState(false);
 const [refinementStarted, setRefinementStarted] = useState(false);
 const [isMinimized, setIsMinimized] = useState(false);
  const [showChat, setShowChat] = useState(true);  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) 
const displayPipeline = currentPipeline || pipelineData || '';

useEffect(() => {
  if (isSidebarOpen) {
    setIsMinimized(true);    // 👈 Minimize chat
    setShowChat(true);       // 👈 Ensure chat is still shown (minimized)
  }
}, [isSidebarOpen]);
const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
console.log("displayPipeline:", displayPipeline);
 const handleDownload = () => {
  if (!displayPipeline || !uploadedFileName) return;

  // Extract extension (e.g., "yml") and base name (e.g., "a")
  const lastDotIndex = uploadedFileName.lastIndexOf('.');
  const baseName = lastDotIndex !== -1 ? uploadedFileName.slice(0, lastDotIndex) : uploadedFileName;
  const extension = lastDotIndex !== -1 ? uploadedFileName.slice(lastDotIndex) : '.txt';

  const refinedFileName = `refined_${baseName}${extension}`; // e.g., refined_a.yml

  const blob = new Blob([displayPipeline], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = refinedFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
 const [fileUploaded, setFileUploaded] = useState(false);
 const [chatMessages, setChatMessages] = useState<Message[]>([]);
let cleanedconvertedCode = '';

// Match any code block inside triple backticks (```groovy\n...\n```)
const codeBlockMatch = displayPipeline.match(/```(?:\w+)?\n([\s\S]*?)```/);

if (codeBlockMatch && codeBlockMatch[1].trim().length > 0) {
  // If a valid code block exists, use the extracted content
  cleanedconvertedCode = codeBlockMatch[1].trim();
} else {
  // Fallback to using the entire responseText
  cleanedconvertedCode = displayPipeline.trim();
}

// Detect language based on content
const detectedLang = cleanedconvertedCode.includes("pipeline {") ? "groovy" : "yaml";

return (

  <div className='flex flex-col'>
         {isLoading && (
  <div className="fixed inset-0 backdrop-transparent bg-black/60 z-50 flex items-center justify-center">
    <p className="text-white text-lg font-semibold animate-pulse">Loading...</p>
  </div>
)}
  <div className="flex flex-row space-x-2 mt-2 w-full">

    {isSidebarOpen && (
    <div  className="bg-[#f9f9f9] dark:bg-[#171717] p-3 w-full rounded-lg shadow-md text-black dark:text-white text-[14px] space-y-4 h-[29rem]">
  <p>Draft Pipeline Code</p>


<div className="bg-[#f5f5f5] h-100 overflow-hidden dark:bg-[#1f1f1f] rounded-md border border-gray-700 flex flex-col">
  <div className="flex-grow relative overflow-y-auto p-2.5">
    {cleanedconvertedCode && (
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
        {`\`\`\`${detectedLang}\n${cleanedconvertedCode}\n\`\`\``}
      </ReactMarkdown>
    )}

    <Button
    onClick={handleDownload}
    className="absolute top-2 right-2 h-6 px-1 py-1 text-sm bg-[#ececec] dark:bg-[#323233] text-xs text-black dark:text-white rounded-md flex items-center"
  >
    <img src="./download.svg" className="w-4 h-3 " alt="Download" />
    Download
  </Button>
  </div>
</div>

</div>

    ) }
{!isSidebarOpen &&  (
  <div
    className="w-8 h-[29rem] rounded-md bg-[#f9f9f9] dark:bg-[#1F1F1F] text-sm border border-gray-700 flex items-center justify-center cursor-pointer"
    onClick={() => {
      setShowChat(false);
      setIsSidebarOpen(true);
    //   setIsMinimized(true);
    }}
    onChange={() => { setFileUploaded(true); setRefinementStarted(true); }}

  >
    <p className="text-black dark:text-white text-sm tracking-widest -rotate-90 whitespace-nowrap">
      Draft Pipeline Code {'>'}
    </p>
  </div>
)}

    {/* RIGHT CHAT AREA */}
    <div className="flex-1 w-full" >
      
      {showChat && 
  <RefinerChat
 refinementStarted={refinementStarted}
  setRefinementStarted={setRefinementStarted}
  setIsSidebarOpen={setIsSidebarOpen}
  setShowChat={setShowChat}
  showChat={showChat}
  isMinimized={isMinimized}
  setIsMinimized={setIsMinimized}
        // pipelineData={pipelineData}
  // setPipelineData={setPipelineData}
//   onSendRequestChange={handleRequestChange}
  currentPipeline={currentPipeline}
  setCurrentPipeline={setCurrentPipeline}
  setUploadedFileName={setUploadedFileName} 
  fileUploaded ={fileUploaded} // ✅ pass down updater
  setFileUploaded={setFileUploaded} // ✅ pass down updater
  chatMessages={chatMessages} // ✅ pass down chat messages
  setChatMessages={setChatMessages} // ✅ pass down chat messages updater
/>

  }

      {/* Buttons and Success Message */}
     
    </div>
  </div>



      </div>

);

}