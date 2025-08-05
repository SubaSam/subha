'use client';

import React, { useState, useEffect, type JSX, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { vscDarkPlus  } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

type Props = {
  goToStep: (step: number) => void;
  responseText: string;
  setResponseText: (text: string) => void;
  setPipelineData: (data: string) => void; // ✅ Add this line
   setCurrentPipeline: (value: string) => void;
};


export function PipelineUpload({ goToStep, responseText, setResponseText, setPipelineData, setCurrentPipeline }: Props): JSX.Element {

  // const handleProceed = () => {
  //   goToStep(2); 
  // };

  const [step, setStep] = useState<number>(1);
  // const [technology, setTechnology] = useState('');
  const [os, setOS] = useState('');
  const [sourceTechnology, setSourceTechnology] = useState('');
const [targetTechnology, setTargetTechnology] = useState('');

  const [canExtract, setCanExtract] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [logEnabled, setLogEnabled] = useState(false);
  const [extractLog, setExtractLog] = useState('');
  const [statusText, setStatusText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [canGenerateSpec, setCanGenerateSpec] = useState(false);
  const [showCard, setShowCard] = useState(false);
   const [showTextarea, setShowTextarea] = useState(false); 
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const [isGenerating, setIsGenerating] = useState(false);
const [customInstruction, setCustomInstruction] = useState('');
 const [fileContent, setFileContent] = useState('');

// const handleConvert = async () => {
//   setIsGenerating(true);
//   try {
//     const response = await fetch("http://127.0.0.1:8000/convert-pipeline", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         source_tech: sourceTechnology,
//         target_tech: targetTechnology, // If this should differ, you can create a separate state for `target_tech`
//         pipeline_code: responseText,
//         input_os: os,
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
//     setPipelineData(cleanedPipeline);
//     goToStep(2); // Navigate to the next step
//   } catch (error) {
//     console.error("Error converting pipeline:", error);
//   } finally {
//     setIsGenerating(false);
//   }
// };
const handleConvert = async () => {
  setIsGenerating(true);
  try {
    const response = await fetch("http://127.0.0.1:8000/convert-pipeline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_tech: sourceTechnology,
        target_tech: targetTechnology,
        pipeline_code: responseText,
        input_os: os,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("API response:", data);

    if (data.converted_code) {
      const cleanedPipeline = data.converted_code
        .replace(/^```.*?\n/, "")
        .replace(/```$/, "");

      // console.log("✅ Cleaned Pipeline:", cleanedPipeline);
      localStorage.setItem("pipelineData", cleanedPipeline);
      setPipelineData(cleanedPipeline);
      setCurrentPipeline(cleanedPipeline);

      console.log("⏭ Calling goToStep(2)");
      goToStep(2);
    } else {
      console.warn("⚠️ No pipeline field returned.");
    }
  } catch (error) {
    console.error("❌ Error converting pipeline:", error);
  } finally {
    setIsGenerating(false);
  }
};



const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

 const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
        // console.log('Extracted content:', fileContent);
      setResponseText(content);
      // console.log("File content:", content);
      localStorage.setItem('responseText', content);
    };
    reader.readAsText(droppedFile);
  }
};


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)}Kb`;
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const uploadedFile = e.target.files?.[0];
  if (uploadedFile) {
    setFile(uploadedFile); // Triggers useEffect
  }
};


const handleFileUpload = () => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    setFileContent(content);
    setResponseText(content);
    localStorage.setItem('responseText', content);
  };
  reader.readAsText(file);
};

useEffect(() => {
  if (file) {
    handleFileUpload();
  }
}, [file]);



const [extractedData, setExtractedData] = useState('');

  // Load from localStorage on mount
  // useEffect(() => {
  //   const saved = localStorage.getItem('extractedData');
  //   if (saved) setExtractedData(saved);
  // }, []);

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


const detectedLang = responseText.includes("pipeline {") ? "groovy" : "yaml";
const cleanedPipeline = responseText
  .replace(/^```(?:\w+)?\n/, '') // remove starting ```
  .replace(/```$/, '')           // remove ending ```
  .trim();


  return (
        <>
        {isGenerating && (
  <div className="fixed inset-0 backdrop-transparent bg-black/60 z-50 flex items-center justify-center">
    <p className="text-white text-lg font-semibold animate-pulse">Loading...</p>
  </div>
)}

        <div className="flex flex-col bg-[#f9f9f9] dark:bg-[#1a1a1a] p-2 h-41 rounded-md border border-gray-700">
          <div className="flex flex-wrap md:flex-nowrap gap-24  ">

            {/* Technology */}
            <div className="flex flex-col space-y-1">
              <div className="flex flex-row ">
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
              <label className="text-[13px] text-black dark:text-white">Source Technology<span className="text-red-500">*</span></label>
              </div>
              <Select onValueChange={setSourceTechnology}>
                 <SelectTrigger className="w-full md:w-60 bg-white dark:bg-black border border-gray-600 text-black dark:text-white"
                >
                                  <SelectValue className='bg-white dark:bg-black text-[13px]' placeholder="Select the Pipeline Tech..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-black text:black dark:text-white border border-gray-700 text-[14px]">
                  <SelectItem  value="azure">Azure Devops YAML</SelectItem>
                  <SelectItem  value="jenkins">Jenkins</SelectItem>
                 
                </SelectContent>
              </Select>
            </div>

             <div className="flex flex-col space-y-1">
              <div className="flex flex-row">
              <span className='mt-1'><svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 23.033 23.023">
  <path id="Path_717" data-name="Path 717" d="M322.028,311.927c-.236-.089-.538-.061-.7-.206a.516.516,0,0,1-.138-.315c-.116-.624-.252-1.266-.408-1.85a10.525,10.525,0,0,0-1.407-.011c-.161.536-.286,1.1-.4,1.651a1.6,1.6,0,0,1-.1.411.4.4,0,0,1-.322.191,7.944,7.944,0,0,0-1.23.308.594.594,0,0,1-.415.05.727.727,0,0,1-.273-.241c-.4-.463-.788-.9-1.223-1.34a.023.023,0,0,0-.018,0,9.908,9.908,0,0,0-1.216.7c.157.635.345,1.2.532,1.783a1.111,1.111,0,0,1,.057.2.378.378,0,0,1-.149.358,9.55,9.55,0,0,0-1.035,1.017.374.374,0,0,1-.361.138,1.363,1.363,0,0,1-.195-.064c-.314-.109-.632-.217-.964-.319-.266-.082-.527-.169-.808-.237a9.975,9.975,0,0,0-.716,1.2.652.652,0,0,0,.124.135c.384.384.78.753,1.187,1.123.127.116.319.228.259.493a1.684,1.684,0,0,1-.067.188,8.558,8.558,0,0,0-.33,1.208.427.427,0,0,1-.181.333,1.328,1.328,0,0,1-.408.106c-.569.109-1.124.228-1.68.372a10.122,10.122,0,0,0,0,1.588c.545.151,1.11.273,1.676.379a1.4,1.4,0,0,1,.411.1.424.424,0,0,1,.184.33,8.424,8.424,0,0,0,.33,1.212.571.571,0,0,1,.053.411.758.758,0,0,1-.241.273c-.276.248-.533.487-.8.741-.175.165-.349.331-.514.514A10.6,10.6,0,0,0,311.2,326c.017.025.038.064.053.067a.424.424,0,0,0,.1-.028c.575-.162,1.121-.34,1.659-.528a1.457,1.457,0,0,1,.195-.064.374.374,0,0,1,.365.135,9.72,9.72,0,0,0,1.038,1.021.379.379,0,0,1,.149.358,1.1,1.1,0,0,1-.06.2c-.187.577-.367,1.148-.528,1.783a9.209,9.209,0,0,0,1.223.7c.438-.436.832-.868,1.233-1.336a.758.758,0,0,1,.266-.248.623.623,0,0,1,.418.046,8.526,8.526,0,0,0,1.226.312.4.4,0,0,1,.326.188,1.522,1.522,0,0,1,.106.408c.117.56.245,1.108.4,1.655a9.742,9.742,0,0,0,1.414-.007c.159-.584.287-1.222.408-1.853a.514.514,0,0,1,.138-.312c.163-.144.464-.116.7-.206a.314.314,0,0,1-.018.113c-.055.282-.1.571-.159.851-.1.486-.2.957-.315,1.418a3.9,3.9,0,0,1-.124.454.379.379,0,0,1-.333.245,11.235,11.235,0,0,1-1.669.035,1.286,1.286,0,0,1-.5-.074.565.565,0,0,1-.209-.369c-.173-.589-.316-1.211-.454-1.857a8.876,8.876,0,0,1-1.092-.284q-.552.639-1.12,1.226c-.093.1-.193.2-.294.294a.4.4,0,0,1-.436.064,10.3,10.3,0,0,1-1.513-.833,1.1,1.1,0,0,1-.33-.259.372.372,0,0,1-.064-.23,1.526,1.526,0,0,1,.053-.237c.151-.62.333-1.216.532-1.811a2.7,2.7,0,0,0-.209-.195c-.207-.191-.4-.4-.6-.606-.587.2-1.188.4-1.8.563a1.548,1.548,0,0,1-.237.057.4.4,0,0,1-.379-.209,11.008,11.008,0,0,1-.978-1.666.445.445,0,0,1-.043-.245.36.36,0,0,1,.1-.2c.091-.1.193-.2.287-.3.386-.386.782-.766,1.208-1.141,0,0,0,0,0-.007a8.8,8.8,0,0,1-.3-1.084c-.606-.119-1.182-.234-1.737-.383a1.427,1.427,0,0,1-.4-.135.426.426,0,0,1-.17-.358,11.857,11.857,0,0,1,0-2.034.437.437,0,0,1,.167-.365,1.372,1.372,0,0,1,.4-.131c.55-.144,1.131-.271,1.733-.386.006,0,.007,0,.007-.007a9.263,9.263,0,0,1,.3-1.077c-.014-.032-.047-.049-.071-.071-.382-.343-.767-.711-1.131-1.074-.094-.094-.2-.193-.291-.3a.378.378,0,0,1-.1-.2.431.431,0,0,1,.043-.245,10.206,10.206,0,0,1,.858-1.492,1.1,1.1,0,0,1,.262-.326.377.377,0,0,1,.234-.06,1.4,1.4,0,0,1,.234.057c.617.164,1.207.353,1.8.56a.528.528,0,0,0,.1-.1c.158-.173.328-.345.5-.507a2.693,2.693,0,0,0,.209-.195c-.2-.6-.385-1.195-.535-1.811a1.3,1.3,0,0,1-.05-.245.363.363,0,0,1,.067-.227,1.133,1.133,0,0,1,.33-.255,10.023,10.023,0,0,1,1.513-.833.394.394,0,0,1,.436.067c.1.1.2.2.291.294.377.392.755.8,1.12,1.223a8.871,8.871,0,0,1,1.092-.284c.146-.665.281-1.287.464-1.9a.565.565,0,0,1,.167-.3.74.74,0,0,1,.383-.089,12.018,12.018,0,0,1,1.783.025.39.39,0,0,1,.386.294A27.929,27.929,0,0,1,322.028,311.927Zm1.382,17.107a1.309,1.309,0,0,0,.234,1.715,1.3,1.3,0,0,0,.875.315,1.245,1.245,0,0,0,.493-.1,1.309,1.309,0,0,0,.567-1.949,1.329,1.329,0,0,0-.475-.418c-.065-.034-.136-.052-.213-.085-.009,0-.016,0-.021-.018a.564.564,0,0,1,0-.142c0-.149,0-.3,0-.432a1.538,1.538,0,0,0-.007-.28.363.363,0,0,0-.1-.191c-.095-.1-.2-.191-.294-.28-.6-.545-1.2-1.11-1.793-1.662a.622.622,0,0,0-.354-.223,5.083,5.083,0,0,0-.571,0h-1.729a5.355,5.355,0,0,1-1.056-.1,5.108,5.108,0,0,1-2.906-1.7,5.162,5.162,0,0,1-.872-1.432,5.176,5.176,0,0,1,0-3.863,5.152,5.152,0,0,1,2.116-2.495,5.1,5.1,0,0,1,1.659-.649,11.829,11.829,0,0,1,2.2-.1h.574c.2,0,.4.014.574,0a.584.584,0,0,0,.358-.22c.6-.557,1.2-1.12,1.793-1.662.1-.092.2-.182.3-.28a.379.379,0,0,0,.1-.184,1.52,1.52,0,0,0,.007-.284c0-.194,0-.4,0-.585a1.343,1.343,0,0,0,.705-.517,1.305,1.305,0,0,0-.23-1.747,1.309,1.309,0,0,0-1.907,1.765,1.336,1.336,0,0,0,.684.5v.6a.082.082,0,0,1,0,.018c-.007.029-.081.088-.117.12-.59.548-1.168,1.077-1.751,1.623-.038.036-.092.1-.131.11a.222.222,0,0,1-.035,0h-1.744c-.3,0-.581,0-.851.021a6,6,0,0,0-.758.113,5.762,5.762,0,0,0-2.382,1.109,5.924,5.924,0,0,0-1.591,7.478,5.939,5.939,0,0,0,1.6,1.889,5.8,5.8,0,0,0,2.385,1.106,6.139,6.139,0,0,0,.762.11c.27.022.556.018.854.018h1.747a.047.047,0,0,1,.021,0c.03.008.09.082.124.113.626.582,1.242,1.15,1.861,1.726.008.2,0,.419,0,.627v.007A1.313,1.313,0,0,0,323.41,329.034Zm1.028-19.13a.537.537,0,0,1,.563.308.5.5,0,0,1,.057.191.549.549,0,0,1-.291.542.568.568,0,0,1-.627-.064.55.55,0,0,1-.167-.6.52.52,0,0,1,.167-.252A.531.531,0,0,1,324.438,309.9Zm.05,19.3a.575.575,0,0,1,.393.145.558.558,0,0,1,.177.358.559.559,0,0,1-.971.429.524.524,0,0,1-.145-.393.563.563,0,0,1,.163-.376A.553.553,0,0,1,324.487,329.2Zm.765-6.446a1.145,1.145,0,0,0-.223-.174.835.835,0,0,0-.358-.043H320.7c-.27,0-.538.011-.8,0a2.372,2.372,0,0,1-1.216-.376,2.467,2.467,0,0,1-.787-.8,2.442,2.442,0,0,1,0-2.5,2.423,2.423,0,0,1,.787-.8,2.358,2.358,0,0,1,1.212-.379c.258-.012.525,0,.794,0h3.98a.916.916,0,0,0,.358-.039,1.135,1.135,0,0,0,.223-.174c.432-.367.847-.732,1.29-1.1a1.273,1.273,0,0,0,.6.206,1.343,1.343,0,0,0,.656-.113,1.31,1.31,0,0,0,.454-2.031,1.27,1.27,0,0,0-1.084-.468,1.314,1.314,0,0,0-1.116,1.832c-.419.352-.824.716-1.244,1.07a.4.4,0,0,1-.089.067.064.064,0,0,1-.025,0h-4.15c-.234,0-.472-.012-.691,0a3.533,3.533,0,0,0-.606.089,3.075,3.075,0,0,0-1.708,1.06,3.169,3.169,0,0,0-.517.868,3.18,3.18,0,0,0,2.222,4.26,3.69,3.69,0,0,0,.6.089c.218.015.458,0,.691,0H324c.232,0,.465-.01.695,0,.058,0,.083.043.124.078.366.311.71.614,1.074.925.032.028.158.113.156.145a.574.574,0,0,1-.043.1,1.415,1.415,0,0,0,.021.879,1.3,1.3,0,0,0,.532.641,1.326,1.326,0,0,0,.95.174,1.286,1.286,0,0,0,.741-.436,1.25,1.25,0,0,0,.308-.858,1.306,1.306,0,0,0-1.07-1.276,1.3,1.3,0,0,0-.946.188C326.1,323.481,325.679,323.121,325.253,322.754Zm1.985-8.048a.552.552,0,0,1,.571.578.553.553,0,0,1-.613.535.533.533,0,0,1-.358-.181.524.524,0,0,1-.145-.393.552.552,0,0,1,.163-.376A.544.544,0,0,1,327.237,314.706Zm-.053,9.693a.553.553,0,0,1,.539.259.559.559,0,0,1-.351.84.578.578,0,0,1-.51-.142.563.563,0,0,1-.135-.6A.549.549,0,0,1,327.184,324.4Zm-7.035-4.664a1.164,1.164,0,0,0-.262.011.375.375,0,0,0,.046.734,2.206,2.206,0,0,0,.266,0h8.534s0,0,0,0a1.28,1.28,0,0,0,.971.9,1.31,1.31,0,0,0,1.588-1.159,1.333,1.333,0,0,0-.167-.766,1.3,1.3,0,0,0-.464-.471,1.271,1.271,0,0,0-.751-.188,1.31,1.31,0,0,0-.762.3,1.358,1.358,0,0,0-.418.634Zm9.778-.181a.547.547,0,0,1,.564.3.5.5,0,0,1,.057.3.557.557,0,0,1-.613.5.534.534,0,0,1-.354-.177.558.558,0,0,1,0-.755A.544.544,0,0,1,329.927,319.554Z" transform="translate(-308.469 -308.595)" fill="#fafafa" stroke="#fafafa" stroke-width="0.4" fill-rule="evenodd"/>
</svg></span>
              <label className="text-[15px] text-white">Target Technology<span className="text-red-500">*</span></label>
              </div>
              <Select onValueChange={setTargetTechnology}>
                 <SelectTrigger className="w-full md:w-60 bg-white dark:bg-black border border-gray-600 text-black dark:text-white"
                >
                                  <SelectValue className='bg-white dark:bg-black text-[13px]' placeholder="Select the Pipeline Tech..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-black text:black dark:text-white border border-gray-700 text-[14px]">
                  <SelectItem  value="azure">Azure Devops YAML</SelectItem>
                  <SelectItem  value="jenkins">Jenkins</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>

            {/* OS */}
            <div className="flex flex-col space-y-1">
              <div className="flex flex-row">
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
             
              <label className="text-[13px] text-black dark:text-white">Target OS<span className="text-red-500">*</span></label>
               </div>
              <Select onValueChange={setOS}>
                 <SelectTrigger className="w-full md:w-60 bg-white dark:bg-black border border-gray-600 text-black dark:text-white"
                >
                                  <SelectValue className='bg-white dark:bg-black text-[13px]' placeholder="Select the Pipeline Tech..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-black text:black dark:text-white border border-gray-700 text-[14px]">
                  <SelectItem value="linux">Linux</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                </SelectContent>
              </Select>
            </div>

           
          </div>

               <p className="text-[14px] p-1">Upload Files</p>

    {/* Upload Box */}
      <div
        className="border border-dashed border-gray-500  h-10 bg-[#ececec] dark:bg-[#2e2d2d] rounded-md p-0.5 flex flex-col items-center  flex j-center cursor-pointer relative"
        onClick={() => fileInputRef.current?.click()}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
      >
        {/* <UploadCloud className="w-8 h-8 text-gray-400 mb-2" /> */}
       <div className="flex items-center space-x-2">
  <img className="h-6 w-6" src="./cloud.svg" alt="Upload icon" />
  <div>
    <p className="text-xs text-black dark:text-white">Click here or Drag and drop file here</p>
    <p className="text-xs text-black dark:text-white mt-0.5">Limit 200MB per file - .CSV</p>
  </div>
</div>

        
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* File Preview */}
      {file && (
        <div className="flex items-center p-1 rounded-md">
          <span className="text-[12px]">
            {file.name} <span className="text-gray-400 ml-1">{formatSize(file.size)}</span>
          </span>
          <button onClick={removeFile}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
        </div>
        
        <div className="flex flex-col h-[19rem]  mt-2 bg-[#f9f9f9] dark:bg-[#1a1a1a] rounded-lg border border-gray-700">
        
{isSidebarOpen &&
         <p className={`text-[14px] ml-2 mt-2  cursor-default 
                ${responseText.length>0 ? 'text-black dark:text-white' : 'text-gray-500'}`}>File Preview</p>}
        
                  {responseText && (
  <div className="p-1 overflow-y-auto whitespace-pre-wrap text-sm">
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
            {`\`\`\`${detectedLang}\n${responseText}\n\`\`\``}
          </ReactMarkdown>
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
              <span >{statusText}</span>
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
            onClick={() => {
              handleConvert();
              // handleProceed();
            }}

            className="px-4  mr-[-15px] mt-0.5 py-2 h-8 border border-black bg-black dark:bg-white text-white dark:text-black rounded-md"
          >
            Convert
          </Button>

          </div>
        </div>  
        </>
  );
}

