'use client';

import React, { useState, useEffect, type JSX } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from 'react-markdown';
import type { ReactElement } from 'react';

import { CheckCircle2, CircleArrowDown, CircleArrowRight, CircleArrowUp, Search } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, Scrollbar } from '@radix-ui/react-scroll-area';
import ExtractedSections from './extractedSection';
import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate(); // ✅ Correct
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const GITHUB_KEY = "recentGithubUrls";
type Props = {
  goToStep: (step: number) => void;
  responseText: string;
  setResponseText: (text: string) => void;
  setPipelineData: (data: string) => void; // ✅ Add this line
};


export function PipelineExtractor({ goToStep, responseText, setResponseText, setPipelineData }: Props): JSX.Element {

  const handleProceed = () => {
    goToStep(2); 
  };

  const [gitUrlTouched, setGitUrlTouched] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [technology, setTechnology] = useState('');
  const [os, setOS] = useState('');
  const [gitUrl, setGitUrl] = useState('');
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [canExtract, setCanExtract] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [logEnabled, setLogEnabled] = useState(false);
  const [extractLog, setExtractLog] = useState('');
  const [statusText, setStatusText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [canGenerateSpec, setCanGenerateSpec] = useState(false);
  const [showCard, setShowCard] = useState(false);
  //  const [responseText, setResponseText] = useState('');  
   const [showTextarea, setShowTextarea] = useState(false); 
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const [typedInstruction, setTypedInstruction] = useState("");
  // const router = useRouter();
  useEffect(() => {
    const stored = localStorage.getItem(GITHUB_KEY);
    if (stored) {
      setUrlHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    setCanExtract(Boolean(technology && os && gitUrl && isUrlValid));
  }, [technology, os, gitUrl, isUrlValid]);

  const validateGitUrl = (url: string): boolean => {
    if (!url.trim()) return true; 
    const regex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+(\.git)?$/;
    return regex.test(url);
  };

  const handleGitUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGitUrl(value);
    setIsUrlValid(validateGitUrl(value));
    setShowDropdown(true);
  };

const handleSelectUrl = (url: string) => {
  console.log('Selected URL:', url);
  setGitUrl(url);
  setIsUrlValid(validateGitUrl(url));
  setGitUrlTouched(true); // Mark as touched so validation shows
  setShowDropdown(false);
};



  const handleRemoveUrl = (url: string) => {
    const filtered = urlHistory.filter((u) => u !== url);
    setUrlHistory(filtered);
    localStorage.setItem(GITHUB_KEY, JSON.stringify(filtered));
  };

const [isGenerating, setIsGenerating] = useState(false);

const handleExtract = async () => {
  if (!urlHistory.includes(gitUrl) && validateGitUrl(gitUrl)) {
    const updated = [gitUrl, ...urlHistory.filter((u) => u !== gitUrl)];
    setUrlHistory(updated);
    localStorage.setItem(GITHUB_KEY, JSON.stringify(updated));
  }

  setShowTextarea(false);
  setIsExtracting(true);
  setLogEnabled(true);
  setStatusText('Generating Extraction...');
  setExtractLog('');

  try {
    const response = await fetch('http://127.0.0.1:8000/analyze-codebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repo_link: gitUrl }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json(); // Now just { result: "<markdown string>" }

    console.log("Raw API response:", data);

    const cleanedText = data.result || ''; // No JSON parsing, just use it directly

    setResponseText(cleanedText);

    setExtractLog(`Extracted pipeline configuration from: ${gitUrl}\nTechnology: ${technology}\nOS: ${os}`);
    setStatusText('Details Extracted successfully!');
    setShowTextarea(true);
  } catch (error) {
    console.error("API Error:", error);
    setResponseText('Failed to extract pipeline details. Please try again later.');
    setStatusText('Extraction failed.');
  } finally {
    setIsExtracting(false);
    setTimeout(() => setStatusText(''), 2000);
  }
};



const [customInstruction, setCustomInstruction] = useState('');
 
  const [userAdditions, setUserAdditions] = useState("");
  // const [pipelineData, setPipelineData] = useState(null);
  const [userInput, setUserInput] = useState("");

// const handleGenerate = async (userInstruction: string) => {
//   try {
//     const response = await fetch("http://127.0.0.1:8000/generate-pipeline", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         detected_info: responseText,    // from previous step
//         repo_link: gitUrl,              // repo URL
//         user_additions: userInstruction,
//         ci_cd_tool: technology,
//         os: os,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     const cleanedPipeline = data.pipeline
//       .replace(/^```.*?\n/, "")
//       .replace(/```$/, "");

//     localStorage.setItem("pipelineData", cleanedPipeline);
//     setPipelineData(cleanedPipeline); // ⬅️ update UI too if needed
//         goToStep(2); 

//   } catch (error) {
//     console.error("Error generating pipeline:", error);
//   }
// };

const handleGenerate = async (userInstruction: string) => {
  setIsGenerating(true); // Start loading
  try {
    const response = await fetch("http://127.0.0.1:8000/generate-pipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        detected_info: responseText,
        repo_link: gitUrl,
        user_additions: userInstruction,
        ci_cd_tool: technology,
        os: os,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const cleanedPipeline = data.pipeline
      .replace(/^```.*?\n/, "")
      .replace(/```$/, "");

    localStorage.setItem("pipelineData", cleanedPipeline);
    setPipelineData(cleanedPipeline);
    goToStep(2);
  } catch (error) {
    console.error("Error generating pipeline:", error);
  } finally {
    setIsGenerating(false); // End loading
  }
};




const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const [extractedData, setExtractedData] = useState('');

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('extractedData', extractedData);
  }, [extractedData]);


  useEffect(() => {
  const savedResponse = localStorage.getItem('responseText');
  const savedLog = localStorage.getItem('extractLog');
  // if (savedResponse) setResponseText(savedResponse);
  if (savedLog) setExtractLog(savedLog);
}, []);

useEffect(() => {
  // localStorage.setItem('responseText', responseText);
  localStorage.setItem('extractLog', extractLog);
}, [extractLog]);

useEffect(() => {
  if (responseText.trim() !== '') {
    setShowTextarea(true);
  }
}, [responseText]);

const handleSubmit = () => {
  if (!customInstruction.trim()) return;
  handleGenerate(customInstruction);
  setCustomInstruction(""); // clear input after submit
};


  return (
        <>
        {isGenerating && (
  <div className="fixed inset-0 backdrop-transparent bg-black/60 z-50 flex items-center justify-center">
    <p className="text-white text-lg font-semibold animate-pulse">Loading...</p>
  </div>
)}

        <div className="flex flex-col bg-[#ffffff] dark:bg-[#1a1a1a] p-2 h-30 rounded-md border border-gray-700">
          <div className="flex flex-wrap md:flex-nowrap gap-4 mt-1 ml-5">

            {/* Technology */}
            <div className="flex flex-col space-y-1 gap-1">
              <div className="flex flex-row gap-1">
              <span className='mt-1'><svg xmlns="http://www.w3.org/2000/svg" width="26.31" height="15" viewBox="0 0 26.31 22.118">
                <g id="browser-svgrepo-com" transform="translate(-11.9 -50.8)">
                  <path id="Path_241" data-name="Path 241" d="M306.727,271.154a3.227,3.227,0,1,0-3.227-3.227A3.232,3.232,0,0,0,306.727,271.154Zm0-5.139a1.907,1.907,0,1,1-1.907,1.907A1.91,1.91,0,0,1,306.727,266.014Z" transform="translate(-275.892 -202.378)" fill="#fafafa"/>
                  <path id="Path_242" data-name="Path 242" d="M227.8,193.556a1.106,1.106,0,0,0-1.1,1.1v1.207a1.106,1.106,0,0,0,1.1,1.1h.485a5.741,5.741,0,0,0,.485,1.174l-.345.345a1.105,1.105,0,0,0,0,1.562l.851.851a1.105,1.105,0,0,0,1.562,0l.345-.345a5.733,5.733,0,0,0,1.174.485v.485a1.106,1.106,0,0,0,1.1,1.1h1.207a1.106,1.106,0,0,0,1.1-1.1v-.485a5.734,5.734,0,0,0,1.174-.485l.345.345a1.105,1.105,0,0,0,1.562,0l.851-.851a1.1,1.1,0,0,0,0-1.557l-.345-.345a5.74,5.74,0,0,0,.485-1.174h.485a1.106,1.106,0,0,0,1.1-1.1v-1.207a1.106,1.106,0,0,0-1.1-1.1h-.485a5.738,5.738,0,0,0-.485-1.174l.345-.345a1.106,1.106,0,0,0,0-1.562l-.862-.851a1.105,1.105,0,0,0-1.562,0l-.345.345a5.739,5.739,0,0,0-1.174-.485V189a1.106,1.106,0,0,0-1.1-1.1h-1.207a1.106,1.106,0,0,0-1.1,1.1v.485a5.74,5.74,0,0,0-1.174.485l-.345-.345a1.105,1.105,0,0,0-1.562,0l-.851.851a1.105,1.105,0,0,0,0,1.562l.345.345a5.735,5.735,0,0,0-.485,1.174H227.8Zm1,1.32a.658.658,0,0,0,.646-.533,4.648,4.648,0,0,1,.7-1.7.661.661,0,0,0-.081-.835l-.555-.555.544-.544.555.555a.66.66,0,0,0,.835.081,4.648,4.648,0,0,1,1.7-.7.663.663,0,0,0,.533-.646v-.786h.77V190a.653.653,0,0,0,.533.646,4.648,4.648,0,0,1,1.7.7.661.661,0,0,0,.835-.081l.555-.555.544.544-.555.555a.66.66,0,0,0-.081.835,4.65,4.65,0,0,1,.7,1.7.663.663,0,0,0,.646.533h.786v.77h-.786a.657.657,0,0,0-.646.533,4.649,4.649,0,0,1-.7,1.7.661.661,0,0,0,.081.835l.555.555-.544.544-.555-.555a.66.66,0,0,0-.835-.081,4.753,4.753,0,0,1-1.7.706.663.663,0,0,0-.533.646v.786h-.77v-.786a.653.653,0,0,0-.533-.646,4.567,4.567,0,0,1-1.7-.706.668.668,0,0,0-.835.081l-.555.555-.544-.544.555-.555a.66.66,0,0,0,.081-.835,4.648,4.648,0,0,1-.7-1.7.663.663,0,0,0-.646-.533h-.786v-.77Z" transform="translate(-203.229 -129.715)" fill="#fafafa"/>
                  <path id="Path_243" data-name="Path 243" d="M11.9,52.572V67.106a1.774,1.774,0,0,0,1.772,1.772h9.362a.663.663,0,1,0,0-1.325H13.672a.455.455,0,0,1-.452-.452V56.311H32.855V57.6a.663.663,0,0,0,1.325,0V52.572A1.774,1.774,0,0,0,32.408,50.8H13.672A1.77,1.77,0,0,0,11.9,52.572Zm20.955,0v2.419H13.22V52.572a.455.455,0,0,1,.452-.452H32.4A.453.453,0,0,1,32.855,52.572Z" transform="translate(0 0)" fill="currentColor"/>
                  <path id="Path_244" data-name="Path 244" d="M51.457,91.05a.67.67,0,0,0,.469-.194.66.66,0,0,0,.194-.469.669.669,0,0,0-.194-.469.682.682,0,0,0-.932.005.657.657,0,0,0-.194.463.67.67,0,0,0,.194.469A.627.627,0,0,0,51.457,91.05Z" transform="translate(-36.805 -36.84)" fill="#fafafa"/>
                  <path id="Path_245" data-name="Path 245" d="M90.263,91.05a.648.648,0,0,0,.463-.194.66.66,0,0,0,.194-.469.67.67,0,0,0-.194-.469.682.682,0,0,0-.932.005.657.657,0,0,0-.194.463.67.67,0,0,0,.194.469A.647.647,0,0,0,90.263,91.05Z" transform="translate(-73.514 -36.84)" fill="#fafafa"/>
                  <path id="Path_246" data-name="Path 246" d="M129.257,91.062a.67.67,0,0,0,.469-.194.66.66,0,0,0,.194-.469.648.648,0,0,0-.194-.463.677.677,0,0,0-.932,0,.657.657,0,0,0-.194.463.67.67,0,0,0,.194.469A.627.627,0,0,0,129.257,91.062Z" transform="translate(-110.413 -36.852)" fill="#fafafa"/>
                </g>
              </svg></span>
              <label className="text-[13px] text-black dark:text-white">Pipeline Technology<span className="text-red-500">*</span></label>
              </div>
              <Select onValueChange={setTechnology}>
                <SelectTrigger className="w-full md:w-60 bg-white dark:bg-black border border-gray-600 text-black dark:text-white"
>
                  <SelectValue className='bg-white dark:bg-black text-[13px]' placeholder="Select the Pipeline Tech..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black text:black dark:text-white border border-gray-700 text-[14px]">
                  <SelectItem  value="azure">Azure Devops YAML</SelectItem>
                  <SelectItem  value="jenkins">Jenkins</SelectItem>
                  {/* <SelectItem  value="aws">AWS Code Pipeline</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* OS */}
            <div className="flex flex-col space-y-1 gap-1">
              <div className="flex flex-row gap-1">
              <span className='mt-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="22.658" height="15" viewBox="0 0 22.658 20.189">
                  <g id="Group_1568" data-name="Group 1568" transform="translate(-371 -172)">
                    <g id="Rectangle_49" data-name="Rectangle 49" transform="translate(371 172)" stroke="#fafafa" stroke-width="1.2">
                      <rect width="22.658" height="16.364" rx="2" stroke="none"/>
                      <rect x="0.6" y="0.6" width="21.458" height="15.164" rx="1.4" fill="none"/>
                    </g>
                    <line id="Line_57" data-name="Line 57" x2="21.399" transform="translate(371.629 183.958)" fill="none" stroke="#fafafa" stroke-width="1.2"/>
                    <path id="Path_247" data-name="Path 247" d="M-5071.709,292.874l-1.195,4.723" transform="translate(5451.261 -105.555)" fill="none" stroke="#fafafa" stroke-width="1.2"/>
                    <path id="Path_248" data-name="Path 248" d="M-5072.9,292.874l1.194,4.723" transform="translate(5458.344 -105.555)" fill="none" stroke="#fafafa" stroke-width="1.2"/>
                    <line id="Line_58" data-name="Line 58" x1="12.27" transform="translate(376.664 191.511)" fill="none" stroke="#fafafa" stroke-linecap="round" stroke-width="1.2"/>
                  </g>
                </svg>
              </span>
             
              <label className="text-[13px] text-black dark:text-white">OS<span className="text-red-500">*</span></label>
               </div>
              <Select onValueChange={setOS}>
                <SelectTrigger  className=" bg-white dark:bg-black w-full md:w-60 bg-white dark:bg-black border border-gray-600 text-black dark:text-white"
>
                  <SelectValue className='text-xs' placeholder="Select the OS" />
                </SelectTrigger>
                <SelectContent className=" bg-white dark:bg-black text-black dark:text-white border border-gray-700">
                  <SelectItem value="linux">Linux</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                  {/* <SelectItem value="mac">Mac</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* GitHub URL with history dropdown */}
            <div className="flex flex-col space-y-1 gap-1 relative ">
              <div className="flex flex-row gap-1">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="26.491" height="20" viewBox="0 0 26.491 25.839">
                  <path id="icons8-github" d="M17.246,4a13.247,13.247,0,0,0-4.187,25.814c.664.121.905-.285.905-.638,0-.315-.013-1.147-.017-2.251-3.687.8-4.463-1.776-4.463-1.776a3.528,3.528,0,0,0-1.47-1.94c-1.2-.819.091-.8.091-.8a2.782,2.782,0,0,1,2.027,1.363,2.822,2.822,0,0,0,3.855,1.1,2.85,2.85,0,0,1,.841-1.772c-2.941-.332-6.032-1.47-6.032-6.545A5.133,5.133,0,0,1,10.157,13a4.778,4.778,0,0,1,.129-3.505S11.4,9.14,13.93,10.851a12.6,12.6,0,0,1,6.631,0C23.092,9.14,24.2,9.493,24.2,9.493A4.741,4.741,0,0,1,24.334,13a5.111,5.111,0,0,1,1.358,3.557c0,5.088-3.1,6.2-6.045,6.537a3.154,3.154,0,0,1,.9,2.449c0,1.772-.013,3.2-.013,3.635,0,.354.237.767.91.638A13.527,13.527,0,0,0,28.03,24.94a12.942,12.942,0,0,0,2.461-7.694A13.244,13.244,0,0,0,17.246,4Z" transform="translate(-4 -4)" fill="#fff" fill-rule="evenodd"/>
                </svg>
              </span>
              <label className="text-[13px] text-black dark:text-white flex items-center gap-2">
                GitHub Repository URL<span className="text-red-500">*</span>
              </label>
              </div>
             <Input         
                type="url"
                placeholder="Paste the Github Repository URL"
                value={gitUrl}
                onChange={(e) => {
                const newUrl = e.target.value;
                handleGitUrlChange(e); // sets gitUrl and validates
                if (!gitUrlTouched) setGitUrlTouched(true);
                setShowDropdown(newUrl.trim() !== "" && isValidUrl(newUrl));
              }}

                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 150); // Allow click on dropdown
                }}
               
                className="bg-white dark:bg-black w-full md:w-[28rem] text-black dark:text-white text-[13px] border border-gray-600"
              />
              
       {showDropdown && isValidUrl(gitUrl) && urlHistory.length > 0 && (
  <div className="absolute top-full mt-1 z-10 w-full max-h-48 overflow-y-auto rounded-md border border-gray-700 shadow-md bg-white dark:bg-black">
    <div className=" bg-white dark:bg-black text-xs text-black dark:text-white px-2 py-1">Saved info</div>
    <ScrollArea className="w-full">
      {urlHistory.map((url, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-2 py-1 w-full bg-white dark:bg-black"
        >
          {/* URL button */}
          <div
            className="flex-grow text-black dark:text-white hover:bg-[#2E2C2C] cursor-pointer truncate text-sm text-left"
            onMouseDown={(e) => {
              e.preventDefault(); // prevent blur
              handleSelectUrl(url);
            }}
          >
            {url}
          </div>

          {/* Remove (×) button */}
          <button
            type="button"
            className="text-black dark:text-white  px-2"
            onMouseDown={(e) => {
              e.stopPropagation(); // prevent dropdown close
              e.preventDefault();   // prevent blur
              handleRemoveUrl(url);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </ScrollArea>
  </div>
)}

           </div>
          </div>

          <div className="flex flex-row">
            <Button
            // style={{backgroundColor:"red", position:"fixed"}}
              className="dark:bg-white bg-black dark:text-black text-white rounded-md h-6 w-20 mt-3 mb-1 ml-5  px-6 py-2"
              disabled={!canExtract || isExtracting}
              onClick={handleExtract}
            >
              Analyze
            </Button>
            {gitUrlTouched && !isValidUrl(gitUrl) && (
                <span className="text-red-500 font-mono text-sm mt-1 ml-106 ">Invalid repository URL</span>
              )}
          </div>
        </div>
        
        <div className="flex flex-col h-[19rem] mt-2 bg-[#f9f9f9] dark:bg-[#1f1f1f]  rounded-lg border border-gray-700">
          {isSidebarOpen &&
         <p className={`text-[14px] ml-2 mt-2 p-1 cursor-default 
                ${responseText.length>0 ? 'text-black dark:text-white' : 'text-gray-500'}`}>Extract Details</p>}

          {showTextarea && (
            
          <div>
            <div className="flex w-full rounded-lg gap-1">

            {!isSidebarOpen && (
                  <div
                    className="w-10 rounded-lg bg-[#f9f9f9] dark:bg-[#1f1f1f] text-sm border-r border-gray-700 flex items-center justify-center"
                      onClick={() => {setShowCard(false),
                      setIsSidebarOpen(true);
                      }}
                    >
          
                    <p className='rounded-lg text-black dark:text-white text-sm tracking-widest -rotate-90 whitespace-nowrap'
                    >
                      Extract Details <span className="text-black dark:text-white">{'>'}</span>                              
                    </p>
                  </div>
                )}
            {showCard && (
              <ScrollArea>
              <div className="flex h-72 bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-md border border-gray-700 w-full overflow-y-auto">

              <div className="flex-1 p-2 space-y-4 overflow-y-auto">
                {/* Header */}
                <div   onClick={() => {setShowCard(false),
                    setIsSidebarOpen(true);
                  }} className="flex justify-center   cursor-default">
                  <p className="text-sm items-center ">
                    Add Custom Instruction (Optional)</p>
                    <CircleArrowDown className='h-5'/>
                </div>

                  <div className="relative w-full ">
                  <Input
                    className="h-12 w-full  bg-[#ececec] dark:bg-[#1a1a1a] border border-gray-700 text-black dark:text-white text-sm pr-12"
                    placeholder="Enter your change instruction here..."
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    value={customInstruction}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(); // ✅ Submit on Enter
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmit} // ✅ Submit on click
                    className="absolute top-1/2 -translate-y-1/2 right-3 p-1"
                  >
                    <img src="/purplearrow.svg" className="h-5 w-5" />
                  </button>
                </div>


                {/* Example Section */}
                <div className="text-sm space-y-2 ml-2">
                  <p className="text-black dark:text-white">Below are some example instructions for common CI/CD Stages:</p>

                  {/* Grid of Examples */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className='flex flex-row'>
                      {/* <Search />  */}
                      <p className="text-black dark:text-white mb-1"> SonarQube Analysis:</p>
                      </div>
                      <p className="bg-[#2E2E2E] text-gray-300 text-sm px-3 py-1 mb-2 rounded-md">
                        Add SonarQube analysis using server URL http://sonarqube.mycompany.com with projectKey=my-app and loginToken=my-token. Publish report to target/sonar-report.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Required Inputs:</p>
                      <p className='text-gray-600 dark:text-gray-300 ml-2'>
                        - SonarQube Server URL  <br/>
                        - Project key <br/>
                        - Authentication token <br/>
                        - Report path (optional) <br/>
                        </p>
                    </div>

                    <div>
                      <p className="text-black dark:text-white mb-1">JUnit Testing:</p>
                      <p className="bg-[#2E2E2E] text-gray-300 text-sm px-3 py-1 mb-2 mr-3 rounded-md">
                        Run JUnit tests after build using Maven Surefire Plugin. Test reports should be stored at target/surefire-reports.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Required Inputs:</p>
                      <p className='text-gray-600 dark:text-gray-300 ml-3'>
                      - Test framework (e.g., JUnit, TestNG) <br/>
                      - Report directory (e.g., target/surefire-reports) <br/>
                      - Optional test parameters <br/>
                      </p>
                    </div>

                    <div>
                      <p className="text-black dark:text-white mb-1">Deploy to AWS:</p>
                      <p className="bg-[#2E2E2E] text-gray-300 text-sm px-3 py-1 mb-2 rounded-md">
                        Deploy the application to AWS EC2 using SSH. Use private key stored in AWS Secrets Manager and deploy the WAR to /opt/tomcat/webapps.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Required Inputs:</p>
                      <p className='text-gray-600 dark:text-gray-300 ml-2'>
                      - Deployment type (EC2, ECS, Lambda) <br/>
                      - Region & credentials method  <br/>
                      - Artifact path  <br/>
                      - Deployment location <br/>
                      </p>
                    </div>

                    <div>
                      <p className="text-black dark:text-white mb-1">Deploy to Azure:</p>
                      <p className="bg-[#2E2E2E] text-gray-300 text-sm px-3 py-1 mb-2 mr-3 rounded-md">
                       Deploy to Azure Web App using Azure DevOps publish profile. App name is myapp-azure, and resource group is my-rg.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Required Inputs:</p>
                      <p className='text-gray-600 dark:text-gray-300 ml-3'>
                      - Deployment target (Web App, VM, AKS)  <br/>
                      - App/service name <br/> 
                      - Resource group <br/>
                      - Credentials or publish profile method <br/>
                      </p>
                    </div>

                    <div>
                      <p className="text-black dark:text-white mb-1"> Deploy to Google Cloud:</p>
                      <p className="bg-[#2E2E2E] text-gray-300 text-sm px-3 py-1 mb-2 rounded-md">
                        Deploy to Google Cloud Run using gcloud CLI. Container image is gcr.io/my-project/myapp:latest.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Required Inputs:</p>
                      <p className='text-gray-600 dark:text-gray-300 ml-2'>
                      - Deployment type (Cloud Run, GKE, App Engine)  <br/>
                      - Container/image path  <br/>
                      - Project ID & region  <br/>
                      - Authentication method <br/>
                      </p>
                    </div>
                  </div>

                 
                </div>
              </div>

              </div>
              <Scrollbar orientation ='vertical'></Scrollbar>
              </ScrollArea>      
            )}  
            </div>

           {!showCard && (
              <>
                {isSidebarOpen && (
                  <div className="h-[16rem] bg-[black] rounded-md text-[14px] cursor-default overflow-y-auto w-full p-3 space-y-2">
                    
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
  components={{
    // ✅ This is the updated paragraph renderer
  p({ children }) {
  const safeChildren = React.Children.toArray(children);

  const rawText = safeChildren
    .map((child) => {
      if (typeof child === 'string') return child;

      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any, any>;
        const inner = element.props?.children;

        if (typeof inner === 'string') return inner;
        if (Array.isArray(inner)) {
          return inner.map((i) => (typeof i === 'string' ? i : '')).join('');
        }
      }

      return '';
    })
    .join('')
    .trim();

  const isSectionTitle = /^\d+\.\s.+$/.test(rawText); // e.g., "1. Description"
  const isSubHeader = /.+:\s*$/.test(rawText);        // e.g., "Tool:" or "Stage:"

  if (isSectionTitle) {
    return (
      <p  className="mt-5 mb-2 text-base font-semibold text-blue-400">
        {children}
      </p>
    );
  }

  if (isSubHeader) {
    return (
      <p className="mt-3 mb-1 text-sm font-medium text-green-400">
        {children}
      </p>
    );
  }

  return <p className="mb-2 text-white">{children}</p>;
},


    strong({ children }) {
      return <strong className="font-bold text-yellow-300">{children}</strong>;
    },

    li({ children }) {
      return <li className="ml-6 list-disc text-white">{children}</li>;
    },

    code({ children }) {
      return <code className="text-white">{children}</code>;
    },

    pre({ children }) {
      return <pre className="bg-black p-4 rounded text-white overflow-auto">{children}</pre>;
    },

    h1({ children }) {
  return <h1 className="mt-2 mb-2 text-lg font-bold text-purple-400">{children}</h1>;
},
h2({ children }) {
  return <h2 className="mt-2 mb-1 text-lg font-semibold text-purple-300">{children}</h2>;
},
h3({ children }) {
  return <h3 className="mt-1 mb-1 text-lg font-medium text-purple-200">{children}</h3>;
},

  }}
>
  {responseText}
</ReactMarkdown>

                    </div>

                             
                )}

                <div
                  onClick={() => {
                    setShowCard(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full bg-[#f5f5f5]  dark:bg-[#1a1a1a] justify-center rounded-md cursor-default flex p-1 text-black dark:text-white"
                >
                  <p className="items-center text-sm">Add Custom Instruction (Optional)</p>
                  <CircleArrowUp className=" h-5" />
                </div>
              </>
            )}

          </div>
          )}
                        
        </div>

        <div className="flex  justify-between items-center w-full mt-1 px-4">
          <p className="text-sm">
            {isExtracting ? (
              <div className='flex flex-row gap-2'>
              <span className='animate-spin'> <svg xmlns="http://www.w3.org/2000/svg" width="23.242" height="23.242" viewBox="0 0 23.242 23.242">
                <g id="bx-loader" transform="translate(-16 -16)">
                  <path id="Path_75" data-name="Path 75" d="M16,26.459h5.811v2.324H16Zm17.432,0h5.811v2.324H33.432Zm-6.973,6.973h2.324v5.811H26.459Zm0-17.432h2.324v5.811H26.459Zm-7.877,4.225,1.643-1.643,4.109,4.109-1.643,1.643ZM36.66,35.017,35.017,36.66l-4.109-4.109,1.643-1.643ZM22.691,30.908l1.643,1.643L20.225,36.66l-1.643-1.643Zm8.216-8.217,4.109-4.108,1.643,1.644-4.109,4.108Z" fill="#00c4ff"/>
                </g>
              </svg></span>
              <span className='mt-1' >{statusText}</span>
              </div>
            ) : (
                  statusText && 
                <div className='flex flex-row gap-1'>
                <span >
                  <svg xmlns="http://www.w3.org/2000/svg" width="30.266" height="20" viewBox="0 0 30.266 30.266">
                        <g id="check-circle-fill" transform="translate(0 0)">
                          <g id="Group_76" data-name="Group 76" transform="translate(0 0)">
                            <path id="Path_81" data-name="Path 81" d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z" transform="translate(0 0)" fill="#24d304"/>
                          </g>
                        </g>
                  </svg>
                </span>  
                <span >
                  {statusText}
                </span>
              </div>
            )}
          </p>       
          <div className=" flex gap-2">
      
          <Button
            disabled={!canExtract && responseText.length<0}
            // onClick={handleGenerate}
             onClick={() => handleGenerate(customInstruction)}

            className="px-4  mt-3 py-2 h-8 border border-black bg-white text-black dark:text-black rounded-md"
          >
            Generate
          </Button>

          </div>
        </div>  
        </>
  );
  
}

