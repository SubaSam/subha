import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, CircleCheck, CirclePlus, RotateCcw } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ChatIcon } from "@/components/icons/Chaticon";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { requirementsData } from "./requirementsData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getCardStyle = (confidence: number, status: string): string => {
  if (status === "Invalid") return "bg-[#2c1010] text-white";
  
  return "bg-[#132109] text-white";
};
interface Requirement {
  requirement_id: string;
  requirement_text: string;
  original_text: string;
  page_number: number | null;
  line_number: number | null;
  source_section: string;
  requirement_type: string;
  confidence_score: number;
  stakeholders: string[];
  validation?: {
    llm_check_passed: boolean;
    issues: string[];
    justification: string;
  };
}
interface ValidatorTabProps {
goTouserstories: (userstoriesData:any[]) => void;
  validatedData: Requirement[]; // ✅ new prop
  fullValidatedDataPayload:{validated_requirements:Requirement}
} 
export default function ValidatatorTab({ goTouserstories, validatedData,fullValidatedDataPayload }: ValidatorTabProps) {
const flattenRequirements = () => {
  const items = validatedData;
  const result = [];

  for (const item of items) {
    result.push({
      id: item.requirement_id,
      description: item.requirement_text,
      confidence: item.confidence_score,
      status: item.validation?.llm_check_passed ? "Valid" : "Invalid",
      original: item.original_text,
      source: item.source_section,
      page: item.page_number,
      line: item.line_number,
      category: item.requirement_type || "Uncategorized",
      stakeholders: item.stakeholders || [],
      issues :item.validation?.issues || []
    });
  }

  return result;
};



  const [requirements, setRequirements] = useState(flattenRequirements());
  const [confidenceThreshold, setConfidenceThreshold] = React.useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [chatReq, setChatReq] = useState<typeof requirements[0] | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, { type: "system" | "user"; text: string }[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessages = chatReq ? chatHistories[chatReq.id] ?? [] : [];
  const [searchText, setSearchText] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>("Requirements Generated Successfully!");




  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !chatReq) return;
    setChatHistories((prev) => {
      const existing = prev[chatReq.id] ?? [];
      return {
        ...prev,
        [chatReq.id]: [...existing, { type: "user", text: inputMessage }],
      };
    });
    setInputMessage("");
  };

  const totalValidators = requirements.length;
  const filteredRequirements = requirements.filter((req) => {
    const meetsConfidence = req.confidence >= confidenceThreshold;
    const meetsStatus = statusFilter === "All" || req.status.toLowerCase() === statusFilter.toLowerCase();
    const meetsId = selectedIds.length === 0 || selectedIds.includes(req.id);
    const meetsSearch =
      searchText.trim() === "" ||
      req.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      req.id.toLowerCase().includes(searchText.toLowerCase());
    return meetsConfidence && meetsStatus && meetsId && meetsSearch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(filteredRequirements.length / rowsPerPage);
  const paginated = filteredRequirements.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const [isLoading, setisLoading] = useState(false);
  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setStatusFilter("All");
    setSelectedIds([]);
    setConfidenceThreshold(0);
    setSearchText("");
  };
const handleuserstories = async () => {
  if(!fullValidatedDataPayload) return;
  setisLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:8000/user_stories",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(fullValidatedDataPayload),
    });
    if(!response.ok) throw new Error("Validation failed");
    const userstoriesData = await response.json();
    goTouserstories(userstoriesData);
  }catch (err){
    console.error("Validation error:", err);
  }{
    setisLoading(false)
  }
};
  const validateRequirements = (id: string) => {
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const systemMessages = chatHistories[id]?.filter((msg) => msg.type === "system") || [];
          const latestSystemMessage = systemMessages[systemMessages.length - 1]?.text || req.description;
          return {
            ...req,
            status: "Valid",
            confidence: 1.0,
            description: latestSystemMessage,
          };
        }
        return req;
      })
    );
    setChatReq(null);
    setSuccessMessage(`Validated Successfully for REQ ID – ${id}`);
  };

  return (
    <>
    <div className=" bg-[#f6f6f6] dark:bg-[#181818] rounded-2xl text-black dark:text-white h-[75vh] overflow-hidden flex flex-col">

    <div className="px-3 py-3 flex items-center gap-2 border-b border-gray-700">
  {/* <div className="shrink-0">
    <ValidateIcon className=" text-black dark:text-white" />

  </div> */}
  <div>
    <h1 className="text-md font-semibold">Validate Requirements</h1>
    <p className="text-[12px] text-gray-400">Validate {totalValidators} Requirements</p>
  </div>
</div>

{/* <Separator></Separator> */}
    
       <div className="flex gap-4 p-6 items-center">
        <Input placeholder="Filter tasks..."   value={searchText}
  onChange={(e) => setSearchText(e.target.value)} className="w-1/4" />
       
          <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="border border-dashed border-gray-400 px-4 py-2 rounded-lg flex items-center gap-2 text-black dark:text-white"
            >
              <CirclePlus className="w-4 h-4" /> Validation: {statusFilter}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0 bg-gray-900 border-gray-700 text-white">
            <Command>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {["All", "Valid", "Invalid"].map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(val) => setStatusFilter(val)}
                    className={`cursor-pointer ${
                      statusFilter === option ? "bg-gray-700 text-white" : ""
                    }`}
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
           <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="border border-dashed border-gray-400 px-4 py-2 rounded-lg flex items-center gap-2 text-black dark:text-white"
            >
              <CirclePlus className="w-4 h-4" /> Req Id
            </Button>
          </PopoverTrigger>
          <PopoverContent  className="w-25 bg-gray-900 border-gray-700 text-white p-4 rounded-lg shadow-xl">
            <ScrollArea className="h-34 w-full pr-2">
              <div className="flex flex-col gap-2">
                {requirements.map((req) => (
                  <label key={req.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id={`checkbox-${req.id}`}
                      checked={selectedIds.includes(req.id)}
                      onCheckedChange={() => toggleId(req.id)}
                    />
                    <span className="text-white font-medium">{req.id}</span>
                  </label>
                ))}
              </div>
              {/* <ScrollBar orientation="vertical" /> */}
            </ScrollArea>
          </PopoverContent>
        </Popover>
    
          <div className="flex items-center gap-4">
          <label className="text-sm font-medium whitespace-nowrap">
            Confidence
          </label>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono px-2 py-1 bg-[#d0d0d0] dark:bg-gray-800 rounded">
              {confidenceThreshold.toFixed(1)}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={confidenceThreshold}
              onChange={(e) =>
                setConfidenceThreshold(parseFloat(e.target.value))
              }
              className="w-38 h-2 accent-black dark:accent-white bg-[#d0d0d0] dark:bg-gray-700 rounded-lg"
            />
          </div>
        </div>
          <Button
    variant="ghost"
    onClick={clearAllFilters}
    className="ml-auto text-sm text-black dark:text-white border  border-dashed px-3 py-2  "
  ><span><RotateCcw /></span>
    Clear Filters
  </Button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="grid grid-cols-1 px-6 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
          {paginated.map((req) => (
            <Card 
  key={req.id}
  className={`${getCardStyle(req.confidence, req.status)} relative group pt-0.5 overflow-visible rounded-xl`}
>
  <CardContent className="pt-0 pr-2 pb-2 pl-2 relative z-0">
    <div className="absolute top-2 right-2">
      
      <Badge
  className={`px-2 py-0.5 mt-0 text-xs rounded-md ${
    req.confidence > 0.5
      ? 'bg-[#0B6058] text-[#5AB4B2]'
      : req.confidence < 0.5
      ? 'bg-[#8E6B74] text-[#83263A]'
      : 'bg-[#86713D] text-[#F7CB9B]'
  }`}
>
  {req.confidence.toFixed(2)}
</Badge>
    </div>
    <div className="mb-2">
      <span className="text-sm font-bold">REQ ID</span>
      <div className="text-sm">{req.id}</div>
    </div>
    <h3 className="font-semibold text-sm mb-1">Description</h3>
    <p className="text-sm mb-3">{req.description}</p>


  </CardContent>
      {/* Hover Overlay */}
      {req.status === "Invalid" &&(
<div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderRadius: 25 }}>    
  <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className="text-black shadow-md bg-white hover:bg-gray-100"
              onClick={() => {
                setChatReq(req);
                setChatHistories((prev) => {
                  if (prev[req.id]) return prev;
                  return {
                    ...prev,
                    [req.id]: [
                      { type: "system", text: "Hi how can I help you today?" },
                      { type: "user", text: "Hey, I'm having trouble with my account" },
                      { type: "system", text: "What seems to be the problem?" },
                    ],
                  };
                });
              }}
            >
              <span><ChatIcon /></span> Chat
            </Button>
          </TooltipTrigger>

          <TooltipContent className="bg-white text-black text-sm max-w-sm break-words p-2 rounded shadow-lg">
            <strong>Issues:</strong>
            <ul className="list-disc ml-5 mt-1">
              {(req.issues || []).length > 0 ? (
                req.issues.map((issue: string, idx: number) => (
                  <li key={idx}>{issue}</li>
                ))
              ) : (
                <li>No specific issues listed.</li>
              )}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
      )}

</Card>

          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
 {chatReq && (
<div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] max-h-[calc(100vh-100px)] rounded-xl bg-[#1c1c1c] border border-gray-700 shadow-xl z-50 overflow-hidden text-white flex flex-col">
    
    {/* Header */}
    <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-[#2a2a2a]">
      <h2 className="text-white font-semibold text-base">Chat</h2>
      <button
        onClick={() => {
          setChatReq(null);
          setInputMessage("");
        }}
        className="text-white text-xl hover:text-red-400"
      >
        –
      </button>
    </div>

    {/* REQ Info */}
    <div className="p-3 border-b border-gray-700 text-sm">
      <div className="flex justify-between mb-1">
        <div>
        <span className="text-white font-semibold">REQ ID - {chatReq.id}</span>
        <span className={`pl-2 text-xs  font-semibold ${chatReq.status === 'Valid' ? 'text-green-400' : 'text-red-400'}`}>
          {chatReq.status}
        </span></div>
        <span><Button className="h-6"onClick={()=>validateRequirements(chatReq.id)}>Validate</Button></span>
      </div>
      <p className="text-white/80 text-xs font-semibold mb-1">Description</p>
      <p className="text-white/60 text-xs leading-snug line-clamp-2">{chatReq.description}</p>
    </div>

    {/* Chat messages */}
    <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm border-b border-gray-700">
      {currentMessages.map((msg, index) => (
        <div
          key={index}
          className={`px-3 py-2 rounded-md w-fit ${
            msg.type === "user" ? "bg-white text-black ml-auto" : "bg-[#333] text-white"
          }`}
        >
          {msg.text}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <div className="p-3 border-t border-gray-700">
      <div className="relative">
        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          className="bg-zinc-800 text-white border border-zinc-600  px-4 pr-10 py-2 text-sm"
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gray-500 text-black hover:bg-gray-200 w-7 h-7"
        ><ArrowUp />
          {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.94 2.94a..." />
          </svg> */}
        </Button>
      </div>
    </div>
  </div>
)}


      
    </div>
    <div className="flex justify-between items-center mt-3 text-sm bg-[#f6f6f6] dark:bg-black text-black dark:text-white border-t border-gray-700 pt-4">
  {/* Left side: Row summary */}
  <div className="text-black dark:text-gray-400 m-1.5">
    {`0 of ${filteredRequirements.length} row(s) selected.`}
  </div>

  {/* Right side: Pagination controls */}
  <div className="flex items-center gap-4">
    {/* Rows per page */}
    <div className="flex items-center gap-2">
      <span className="text-black dark:text-gray-400">Rows per page</span>
      <select
        className="bg-black border border-gray-700 text-white rounded px-2 py-1"
        value={rowsPerPage}
        onChange={(e) => {
          setCurrentPage(1); // reset to first page
          // You'll need to make `rowsPerPage` a state variable instead of const
          setRowsPerPage(parseInt(e.target.value));
        }}
      >
        {[2, 5, 10, 25].map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
    </div>

    {/* Page info */}
    <div className="text-black dark:text-gray-400">
      Page {currentPage} of {totalPages}
    </div>

    {/* Navigation buttons */}
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50"
      >
        &laquo;
      </button>
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50"
      >
        &lsaquo;
      </button>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50"
      >
        &rsaquo;
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  </div>
</div>
    <div className="flex justify-between items-center mt-1 bg-[#f6f6f6] dark:bg-black py-4">
  <p className="text-sm flex items-center gap-2 m-3">
   
   {successMessage && (<>
     <CircleCheck color="#06c613" className="w-4 h-4" />
  <span className="text-black dark:text-white">{successMessage}</span></>
)}


  </p>
  <div className="flex gap-2">
    <Button variant="outline" className="bg-white dark:black text-black dark:text-white">Regenerate Response</Button>
    <Button className="bg-black dark:bg-white text-white dark:text-black" disabled={isLoading} onClick={handleuserstories}> {isLoading ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-4 w-4 text-white dark:text-black"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Generating...
    </span>
  ) : (
    "Generate User Stories"
  )}</Button>
  </div>
</div>
</>
  );
}
