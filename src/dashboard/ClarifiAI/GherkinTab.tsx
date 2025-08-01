'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown } from 'lucide-react';
import { ConfidenceBadge } from '@/components/confidencebadge';
import { Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RotateCcw, CircleCheck, CirclePlus } from "lucide-react";
//import { gherkinData } from './gherkinData';

// const handleDownload = (feature) => {
//   const blob = new Blob([JSON.stringify(feature, null, 2)], {
//     type: 'application/json',
//   });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `${feature.requirement_id}-Feature.json`;
//   link.click();
//   URL.revokeObjectURL(url);
// };
const handleDownload = (feature: {
  requirement_id: string;
  feature: string;
  confidence_score: number;
  scenarios: {
    name: string;
    steps: string[];
  }[];
}) => {
  const blob = new Blob([JSON.stringify(feature, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${feature.requirement_id}-Feature.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export interface Requirement {
  requirement_id: string;
  feature: string;
  scenarios: Scenario[];
  confidence_score: number;
}

export interface Scenario {
  name: string;
  steps: string[];
}

interface GherkinTabProps {
goTotestcases: (testcaseData:any) => void;
  gerkinData: Requirement[]; // ✅ new prop
  fullgerkinDataPayload:{gherkin_scenarios:()=>void}
} 
export default function GherkinTab({ goTotestcases,gerkinData,fullgerkinDataPayload}:GherkinTabProps) {
  const [requirements, setRequirements] = useState(gerkinData);
  const [openScenario, setOpenScenario] = useState<string | null>(null);

  const [confidenceThreshold, setConfidenceThreshold] = useState(0);
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filteredRequirements = requirements.filter((req) => {
    const meetsConfidence =
      req.confidence_score >= confidenceThreshold &&
      (confidenceFilter === "All" || req.confidence_score.toFixed(2) === confidenceFilter);
    const meetsId = selectedIds.length === 0 || selectedIds.includes(req.requirement_id);
    const meetsSearch =
      searchText.trim() === "" || req.confidence_score.toString().includes(searchText.toLowerCase()) ||
      req.requirement_id.toLowerCase().includes(searchText.toLowerCase()) || req.feature.toLowerCase().includes(searchText.toLowerCase()) ||
      req.scenarios.some((s) => s.name.toLowerCase().includes(searchText.toLowerCase()));
    return meetsConfidence && meetsId && meetsSearch;
  });

  const totalPages = Math.ceil(filteredRequirements.length / rowsPerPage);
  const paginatedRequirements = filteredRequirements.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleId = (id : string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const [isLoading,setisLoading] = useState(false);
  const handletestcases = async () => {
  if(!fullgerkinDataPayload) return;
  setisLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:8000/test_cases",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(fullgerkinDataPayload),
    });
    if(!response.ok) throw new Error("Validation failed");
    const testcaseData = await response.json();
    goTotestcases(testcaseData);
  }catch (err){
    console.error("Validation error:", err);
  }{
    setisLoading(false)
  }
};
  const uniqueConfidenceScores = useMemo(() => {
    const scores = requirements.map((item) => item.confidence_score?.toFixed(2) ?? "");
    return [...new Set(scores)].sort((a, b) => parseFloat(b) - parseFloat(a));
  }, [requirements]);

  return (
    <>
      <div className="p-2  gap-2 bg-[#f6f6f6] dark:bg-[#181818] text-black dark:text-white rounded-lg">
        <div className="border-b border-gray-700 px-1 py-1 mt-[-2px]">
          <h1 className="text-[16px] font-semibold ">Gherkin List</h1>
          <p className="text-[12px] text-gray-400">Generated Gherkin {requirements.length} Requirements</p>
        </div>

        <div className="flex gap-2 items-center mt-2 ">
          <Input
            placeholder="Filter tasks..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-1/4"
          />

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
                    <label key={req.requirement_id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedIds.includes(req.requirement_id)}
                        onCheckedChange={() => toggleId(req.requirement_id)}
                      />
                      <span className="text-white font-medium">{req.requirement_id}</span>
                    </label>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Confidence</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-48 h-2 accent-black dark:accent-white bg-[#d0d0d0] dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-mono px-2 py-1 bg-[#d0d0d0] dark:bg-gray-800 rounded">
              {confidenceThreshold.toFixed(1)}
            </span>
          </div>

          <Button
            onClick={() => {
              setSearchText("");
              setConfidenceThreshold(0);
              setConfidenceFilter("All");
              setSelectedIds([]);
            }}
            className="ml-auto text-sm text-black dark:text-white  bg-white dark:bg-black px-3 py-2 "
          >
            <RotateCcw className="mr-1" /> Clear Filters
          </Button>
        </div>
      </div>

      <div className="h-66 w-full ">
        <ScrollArea className="h-60 w-full">
          {paginatedRequirements.map((feature) => (
            <div key={feature.requirement_id} className=" bg-[#f6f6f6] dark:bg-[#1a1a1a] text-black dark:text-white h-55 mt-4 text-white p-4 rounded-lg max-w-8xl border border-[#333] shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div className="flex flex-row gap-2 ">
                  <p className="text-gray-600 dark:text-gray-400">Feature: </p>
                  <p className="text-black dark:text-white">{feature.feature}</p>
                </div>
                <div className="flex items-center gap-4 ">
                  <p className="text-gray-600 dark:text-gray-400">
                    Req Id - <span className="text-black dark:text-white">{feature.requirement_id}</span>
                  </p>
                  <ConfidenceBadge confidence={feature.confidence_score} />
                  <Button
                    className="bg-gray-200 text-black px-2 py-1 h-7 w-40 mt-1"
                    onClick={() => handleDownload(feature)}
                  >
                    <Download />{feature.requirement_id} Feature
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-40 w-full pr-2">
                <div className="space-y-2">
                  {feature.scenarios.map((scenario, index) => {
                    const isOpen = openScenario === scenario.name;
                    return (
                      <div key={index} className="bg-[white] text-black dark:bg-[#121212] dark:text-white border border-[#2b2b2b] rounded-md">
                        <button
                          onClick={() => setOpenScenario(isOpen ? null : scenario.name)}
                          className="w-full text-left px-4 py-3 flex justify-between items-center"
                        >
                          <span className="text-gray-400">
                            Scenario{index+1}: <span className='text-white ml-2'>{scenario.name}</span></span>
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {isOpen && scenario.steps.length > 0 && (
                          <ul className="px-6 pb-3 list-disc text-sm text-gray-500 dark:text-gray-300 space-y-1">
                            {scenario.steps.map((step, idx) => (
                              <li key={idx} className="ml-2">{step}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          ))}
        </ScrollArea>
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

      <div className="flex justify-end gap-2 mt-2">
        <span className="flex flex-row  gap-2 mr-[430px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30.266 30.266">
            <path d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z" fill="#24d304" />
          </svg>
          Gherkin list generated Successfully!
        </span>
        <Button
          className="bg-white dark:bg-[#0D0D0D] text-black dark:text-white border border-gray-400"
          disabled={filteredRequirements.length === 0}
        >
          Regenerate Response
        </Button>
        <Button className="bg-black dark:bg-white text-white dark:text-black" disabled={isLoading} onClick={handletestcases}> {isLoading ? (
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
            "Test Cases"
          )}</Button>
      </div>
    </>
  );
}