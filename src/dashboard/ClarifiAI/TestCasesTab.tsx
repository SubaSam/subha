
'use client';

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronsUpDown, ChevronUp, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { RotateCcw, CirclePlus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
//import { userStoriesData } from "./userStoriesData";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Requirement {
  test_id: string;
  title: string;
  precondition: string;
  steps: string[];
  expected_result: string;
  priority: string; // You can change this if you have more priority types
  tags: string[];
}
interface TestCasesTabProps {
goToTraceability: () => void;
  testcaseData: Requirement[]; // ✅ new prop
  fulltestcaseDataPayload:{test_cases:()=>void}
} 
export default function TestCasesTab({ goToTraceability,testcaseData,fulltestcaseDataPayload }:TestCasesTabProps) {
  const [requirements, setRequirements] = useState(testcaseData);

  const [categoryFilter, setPriorityFilter] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [openReqId, setOpenReqId] = useState<string | null>(null);
const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

// const taskFlows: Record<string, string[]> = {
//   "TC-REQ-001-1": [
//     "Review submitted E-Forms",
//     "Submit the submitted E-Forms",
//     "Upload the submitted E-Forms"
//   ],
//   "025-1": ["Step A", "Step B", "Step C"],
//     "026-1": [
//     "Review submitted E-Forms",
//     "Submit the submitted E-Forms",
//     "Upload the submitted E-Forms"
//   ],
// };

 useEffect(() => {
    const current = requirements.find(r => r.test_id === openReqId);
    if (current?.steps) {
      setCurrentStepIndex(0);
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < current.steps.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [openReqId]);


  const filteredRequirements = requirements.filter((req) => {
    const meetsPriority = categoryFilter.length === 0 || categoryFilter.includes(req.priority);

    const meetsId = selectedIds.length === 0 || selectedIds.includes(req.test_id);
    const meetsSearch =
      searchText.trim() === "" ||
      req.priority.toLowerCase().includes(searchText.toLowerCase()) ||
      req.title.toLowerCase().includes(searchText.toLowerCase()) ||
      req.test_id.toLowerCase().includes(searchText.toLowerCase()) ||
      req.precondition.toLowerCase().includes(searchText.toLowerCase());
    return meetsPriority && meetsId && meetsSearch ;
  });
const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const totalPages = Math.ceil(filteredRequirements.length / rowsPerPage);

const handleSort = (key: string) => {
  setSortConfig((prev) => {
    if (prev?.key === key) {
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    }
    return { key, direction: "asc" };
  });
};

const sortedRequirements = [...filteredRequirements].sort((a, b) => {
  if (!sortConfig) return 0;
  const { key, direction } = sortConfig;
  const aVal = a[key as keyof typeof a] || "";
  const bVal = b[key as keyof typeof b] || "";
  const comparison = aVal.toString().localeCompare(bVal.toString());
  return direction === "asc" ? comparison : -comparison;
});

  const uniquePriorities = ["High", "Medium", "Low"];
const steps = requirements.find(r => r.test_id === openReqId)?.steps ?? [];

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
    <div className="p-2 gap-2 bg-[#f6f6f6] dark:bg-[#181818] text-black dark:text-white rounded-lg">
      <div className="border-b border-gray-700 px-1 py-1 mt-[-2px]">
          <h1 className="text-[16px] font-semibold">Test Cases List</h1>
          <p className="text-[12px] text-gray-400">Generated User Stories {requirements.length} Requirements</p>
      </div>

      <div className="flex gap-2 items-center mt-2">
        <Input
          placeholder="Filter tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-1/4"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="border border-dashed border-gray-400 px-4 py-2 rounded-lg">
              <CirclePlus className="w-4 h-4" /> Priority
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0 bg-gray-900 border-gray-700 text-white">
           <ScrollArea className="h-[120px] p-2">
  {uniquePriorities.map((priority) => (
    <label key={priority} className="flex items-center gap-2 text-sm mb-2">
      <Checkbox
        checked={categoryFilter.includes(priority)}
        onCheckedChange={() => {
          setPriorityFilter((prev) =>
            prev.includes(priority)
              ? prev.filter((p) => p !== priority)
              : [...prev, priority]
          );
        }}
      />
      {priority}
    </label>
  ))}
</ScrollArea>

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
          <PopoverContent className="w-25 bg-gray-900 border-gray-700 text-white p-4 rounded-lg shadow-xl">
            <ScrollArea className="h-34 w-full pr-2">
              <div className="flex flex-col gap-2">
                {requirements.map((req) => (
                  <label key={req.test_id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      id={`checkbox-${req.test_id}`}
                      checked={selectedIds.includes(req.test_id)}
                      onCheckedChange={() => toggleId(req.test_id)}
                    />
                    <span className="text-white font-medium">{req.test_id}</span>
                  </label>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button className="ml-auto text-sm text-black dark:text-white bg-white border border-gray-200 dark:bg-black px-3 py-2">
      <RotateCcw className="mr-1 w-4 h-4" /> Clear Options
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-40 bg-white dark:bg-black text-black dark:text-white border border-gray-700">
    <DropdownMenuItem onClick={() => {
      setPriorityFilter([]);
      setSearchText("");
      setSelectedIds([]);
    }}>
      Clear Filters
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setSortConfig(null)}>
      Clear Sort
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => {
      setPriorityFilter([]);
      setSearchText("");
      setSelectedIds([]);
      setSortConfig(null);
    }}>
      Clear All
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      </div>{(categoryFilter.length > 0 ||
  selectedIds.length > 0 ||
  searchText !== "" ||
  sortConfig !== null) && (
  <div className="flex flex-wrap gap-2 px-1 py-1 mb-2 text-xs text-black dark:text-white">
    {categoryFilter.length > 0 && (
      <div className="bg-yellow-800 text-white px-2 py-1 rounded-full">
        Priority: {categoryFilter.join(", ")}
      </div>
    )}
    {selectedIds.length > 0 && (
      <div className="bg-purple-800 text-white px-2 py-1 rounded-full">
        Req IDs: {selectedIds.join(", ")}
      </div>
    )}
    {searchText !== "" && (
      <div className="bg-green-800 text-white px-2 py-1 rounded-full">
        Search: "{searchText}"
      </div>
    )}
    {sortConfig && (
      <div className="bg-blue-800 text-white px-2 py-1 rounded-full">
        Sorted by {sortConfig.key} ({sortConfig.direction})
      </div>
    )}
  </div>
)}


<div className="mt-2">
<ScrollArea className="overflow-y-auto overflow-x-auto h-64 w-full">    
  <Table className="min-w-full text-sm text-left text-white">
  <TableHeader className="bg-white dark:bg-[#111111] text-black dark:text-white">
  <TableRow>
  <TableHead onClick={() => handleSort("id")} className="px-4 py-2 cursor-pointer">
  <div className="inline-flex items-center gap-1 whitespace-nowrap">
    REQ ID
    {sortConfig?.key === "id" ? (
      sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )
    ) : (
      <ChevronsUpDown className="w-4 h-4" />
    )}
  </div>
</TableHead>


<TableHead onClick={() => handleSort("title")} className="px-4 py-2 cursor-pointer">
  <div className="inline-flex items-center gap-1 whitespace-nowrap">
    Title {sortConfig?.key === "title" ?(   sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )
    ) : (
      <ChevronsUpDown className="w-4 h-4" />)}
  </div>
</TableHead>

<TableHead onClick={() => handleSort("precondition")} className="px-4 py-2 cursor-pointer">
  <div className="inline-flex items-center gap-1 whitespace-nowrap">
    Precondition {sortConfig?.key === "precondition" ?(   sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )
    ) : (
      <ChevronsUpDown className="w-4 h-4" />)}
  </div>
</TableHead>

<TableHead onClick={() => handleSort("priority")} className="px-4 py-2 cursor-pointer">
  <div className="inline-flex items-center gap-1 whitespace-nowrap">
    Priority {sortConfig?.key === "priority" ?(   sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )
    ) : (
      <ChevronsUpDown className="w-4 h-4" />)}
  </div>
</TableHead>
<TableHead onClick={() => handleSort("tags")} className="px-4 py-2 cursor-pointer">
  <div className="inline-flex items-center gap-1 whitespace-nowrap">
    Tags
    {sortConfig?.key === "tags" ? (
      sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )
    ) : (
      <ChevronsUpDown className="w-4 h-4" />
    )}
  </div>
</TableHead>

    <TableHead className="px-4 py-2"></TableHead>
  </TableRow>
</TableHeader>

    
    <TableBody>
      {sortedRequirements.map((req, index) => (
        <TableRow
          key={req.test_id}
          className={`text-black dark:text-white text-sm rounded-lg  overflow-hidden ${
      index % 2 === 0 ? 'bg-[#d0d0d0] dark:bg-[#181818]' : 'bg-[#ececec]	dark:bg-[#2a2a2a]'
          }`}
        >
          <TableCell className="px-4 py-2">{req.test_id}</TableCell>
          <TableCell className="px-4 py-2 whitespace-normal break-words max-w-sm">{req.title}</TableCell>
          <TableCell className="px-4 py-2 whitespace-normal break-words max-w-lg">{req.precondition}</TableCell>
          <TableCell className="px-4 py-2">
            <Badge
              className={`text-xs px-2 py-1 rounded-md ${
                req.priority === 'High'
                  ? 'bg-red-700 text-white'
                  : req.priority === 'Medium'
                  ? 'bg-yellow-700 text-white'
                  : 'bg-blue-700 text-white'
              }`}
            >
              {req.priority}
            </Badge>
          </TableCell>
         <TableCell className="px-4 py-2 whitespace-normal break-words max-w-sm">
  {req.tags.join(",")}
</TableCell>
          <TableCell className="px-4 py-2">
           <button
  onClick={() => setOpenReqId(req.test_id)}
  className="bg-black dark:bg-white text-white dark:text-black text-xs px-3 py-1 rounded-md hover:bg-gray-200 transition"
>
  View Task
</button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
<ScrollBar orientation="vertical"></ScrollBar> 
<ScrollBar orientation="horizontal"></ScrollBar>
</ScrollArea>
 
  {openReqId && (
  <Dialog  open={!!openReqId} onOpenChange={() => setOpenReqId(null)}>
    <DialogContent className="bg-[#1b1b1b] text-white rounded-xl max-w-md">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold">
          Req Id - <span className="text-white">{openReqId}</span>
          <Badge
            className={`ml-2 px-2 py-0.5 text-xs ${
              requirements.find((r) => r.test_id === openReqId)?.priority === "High"
                ? "bg-red-700 text-white"
                : requirements.find((r) => r.test_id === openReqId)?.priority === "Medium"
                ? "bg-yellow-700 text-white"
                : "bg-blue-700 text-white"
            }`}
          >
            {requirements.find((r) => r.test_id === openReqId)?.priority}
          </Badge>
        </p>
        {/* <button onClick={() => setOpenReqId(null)}>
          <X className="w-4 h-4" />
        </button> */}
      </div>

      <ScrollArea className="mt-4 h-[60vh] pr-2">
        <p className="text-[13px] font-semibold mb-4">Task Flow</p>
       <div className="flex flex-col items-center gap-0">
  {/* Top Start Dot */}
  <div className="flex flex-col items-center bg">
    <div className="w-2 h-2 rounded-full bg-[#7CF1CF]" />
    <div className="w-[1px] h-4 bg-gray-500" />
    <ChevronDown className="text-gray-500 w-4 h-4 my-1" />
  </div>

  {/* Steps with arrows and vertical lines */}
  {steps?.map((step, index) => (
    <React.Fragment key={index}>
      <div
        className={`transition-opacity duration-500 ${
          index <= currentStepIndex ? "opacity-100" : "opacity-30"
        }`}
      >
        <div className="border border-[#8e8e8e] px-6 py-2 rounded-lg text-sm text-center w-[260px]">
          <span className="font-medium">Step {index + 1}</span>
          <br />
          {step}
        </div>
      </div>

      {index !== steps.length - 1 && (
        <div className="flex flex-col items-center">
          <div className="w-[1px] h-4 bg-gray-500" />
          <ChevronDown className="text-gray-500 w-4 h-4 my-1" />
        </div>
      )}
    </React.Fragment>
  ))}

  {/* Bottom End Dot */}
  <div className="flex flex-col items-center mt-1">
    <div className="w-[1px] h-4 bg-gray-500" />
    <ChevronDown className="text-gray-500 w-4 h-4 my-1" />
    <div className="w-2 h-2 rounded-full bg-[#FF6464]" />
  </div>
</div>


      </ScrollArea>
    </DialogContent>
  </Dialog>
)}

</div>

    </div>
    <div className="flex justify-between items-center h-9 border-b border-gray-700 text-sm bg-[#f6f6f6] dark:bg-black text-black dark:text-white ">
            <div className="text-black dark:text-gray-400 m-1.5">
              {`0 of ${filteredRequirements.length} row(s) selected.`}
            </div>
    
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-black dark:text-white">Rows per page</span>
                <select
                  className="bg-black border border-gray-700 text-white rounded px-2 py-1"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setRowsPerPage(parseInt(e.target.value));
                  }}
                >
                  {[2, 5, 10, 25].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
    
              <div className="text-black dark:text-white">
                Page {currentPage} of {totalPages}
              </div>
    
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50">&laquo;</button>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50">&lsaquo;</button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50">&rsaquo;</button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-50">&raquo;</button>
              </div>
            </div>
          </div>
    
          <div className="flex justify-between gap-2 mt-2">
            <span className="flex flex-row  gap-2 mr-[300px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30.266 30.266">
              <path d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z" fill="#24d304" />
            </svg>
            Test Cases  generated Successfully!
          </span><div className="flex gap-2">
            <Button
              className="bg-white dark:bg-[#0D0D0D] text-black dark:text-white border border-gray-500"
              disabled={filteredRequirements.length === 0}
              // onClick={goToClassifier}
            >
              Regenerate Response
            </Button>
            <Button
              className="bg-black text-white dark:bg-[#E5E5E5] dark:text-black"
              disabled={filteredRequirements.length === 0}
              onClick={goToTraceability}
            >
              Generate Tracebility
            </Button>
            </div>
          </div>
    </>
  );
}

