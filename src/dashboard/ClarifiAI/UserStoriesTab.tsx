import { useEffect,  useState } from "react";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, CircleCheck, CirclePlus, RotateCcw, ThumbsUp, User2Icon} from "lucide-react";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
// } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
//import { UserStoriesIcon } from "../icons/appIcons";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ConfidenceBadge } from "@/components/confidencebadge";
import { Badge} from "@/components/ui/badge"
//import { userStoriesData } from './userStoriesData';



// const mockData = [
//   {
//     id: "001",
//     confidence: 1.0,
//     status: "Valid",
//     stories: [
//       {
//         role: "Card Operator",
//         story:
//           "I want to register school details (name location service etc), so that I can maintain accurate database in school records.",
//         acceptanceCriteria: [
//           "Loyalty points are not awarded for school fee",
//           "The system correctly identifies EPP transactions.",
//           "The system prevents loyalty point accrual transactions",
//         ],
//       },
//       {
//         role: "Contact Center Agent",
//         story:
//           "I want to register school details (name location service etc), so that I can maintain accurate database in school records.",
//         acceptanceCriteria: [
//           "Only authorized users can edit records.",
//           "Data must be validated before save.",
//           "Changes must be logged in audit trail.",
//         ],
//       },
//     ],
//   },
//   {
//     id: "002",
//     confidence: 0.02,
//     status: "Invalid",
//     stories: [
//       {
//         role: "Card Operator",
//         story:
//           "I want to add fee details for each student for proper accounting.",
//         acceptanceCriteria: [
//           "Each student has a unique fee record.",
//           "Fee records are time-stamped.",
//           "System prevents duplicate entries.",
//         ],
//       },
//     ],
//   },
//   {
//     id: "003",
//     confidence: 0.52,
//     status: "Invalid",
//     stories: [
//       {
//         role: "Card Operator",
//         story:
//           "I want to add fee details for each student for proper accounting.",
//         acceptanceCriteria: [
//           "Fee details sync with accounting software.",
//           "Changes notify relevant departments.",
//         ],
//       },
//     ],
//   },
// ];
type Requirement = {
  requirement_id: string;
  user_story:string;
  acceptance_criteria:string[]
  confidence_score: number;
  tshirt_size:string;
  
};
type FormattedRequirement = {
  id: string;
  confidence: number;
  stories: {
    role: string;
    story: string;
    acceptanceCriteria: string[];
    tshirt_size:string;
  }[];
};

interface UserStoriesProps{
  goTogerkin:(gerkinData:any[])=>void;
  userstoriesData:Requirement[];
  fulluserstoriesdataPayload:{user_stories:Requirement}
}
export default function UserStoriesTab({ goTogerkin,userstoriesData,fulluserstoriesdataPayload }:UserStoriesProps) {
 
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const [expandedReqs, setExpandedReqs] = useState<Record<string, boolean>>({});
const [selectedStory, setSelectedStory] = useState<null | {
  role: string;
  acceptanceCriteria: string[];
}>(null);


useEffect(() => {
  const extractRoleFromStory = (story: string): string => {
    const match = story.match(/As (a|an|the) ([^,]*)/i);
    return match ? match[2].trim() : "Unknown";
  };

  const formattedData: FormattedRequirement[] = userstoriesData.map((storyObj) => ({
    id: storyObj.requirement_id,
    confidence: storyObj.confidence_score,
    stories: [
      {
        role: extractRoleFromStory(storyObj.user_story),
        story: storyObj.user_story,
        acceptanceCriteria: storyObj.acceptance_criteria,
        tshirt_size: storyObj.tshirt_size
      },
    ],
  }));

  setRequirements(formattedData);
}, [userstoriesData]);

const [requirements, setRequirements] = useState<FormattedRequirement[]>([]);
const uniqueRoles = Array.from(
  new Set(
    requirements.flatMap((item) =>
      item.stories.map((story) => story.role)
    )
  )
);
  // FILTERS
  const filteredRequirements = requirements.filter((req) => {
  const meetsConfidence = req.confidence >= confidenceThreshold;
  const meetRoles =
    roleFilter.length === 0 ||
    req.stories.some((s) => roleFilter.includes(s.role));
  const meetsId =
    selectedIds.length === 0 || selectedIds.includes(req.id);
  const meetsSearch =
    searchText.trim() === "" ||
    req.id.toLowerCase().includes(searchText.toLowerCase()) ||
    req.stories.some((s) =>
      s.story.toLowerCase().includes(searchText.toLowerCase())
    );

  return meetsConfidence && meetRoles && meetsId && meetsSearch;
});


  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(filteredRequirements.length / rowsPerPage);
  const paginated = filteredRequirements.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const clearAllFilters = () => {
    setRoleFilter([]);
    setSelectedIds([]);
    setConfidenceThreshold(0);
    setSearchText("");
  };

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedReqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
const storieslength = requirements.length;
const [isLoading, setisLoading] = useState(false);
// const extractRoleFromStory = (story: string): string => {
//   const match = story.match(/As a ([^,]*)/i);
//   return match ? match[1].trim() : "Unknown";
// };
const handlegherkin = async () => {
  if(!fulluserstoriesdataPayload) return;
  setisLoading(true);
  try {
    const response = await fetch("http://127.0.0.1:8000/gherkin",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(fulluserstoriesdataPayload),
    });
    if(!response.ok) throw new Error("Validation failed");
    const gerkinData = await response.json();
    goTogerkin(gerkinData);
  }catch (err){
    console.error("Validation error:", err);
  }{
    setisLoading(false)
  }
};
  useEffect(() => {
    const newStates: Record<string, boolean> = {};
    requirements.forEach((r) => {
      newStates[r.id] = expandAll;
    });
    setExpandedReqs(newStates);
  }, [expandAll, requirements]);

  return (
    <>
        <div className=" bg-[#f6f6f6] dark:bg-[#181818] rounded-2xl text-black dark:text-white h-[75vh] overflow-hidden flex flex-col">

    <div className="px-3 py-3 flex items-center gap-2 border-b border-gray-700">
      {/* <div className="shrink-0">
        <UserStoriesIcon className=" text-black dark:text-white" />
    
      </div> */}
      <div>
        <h1 className="text-[16px] font-semibold">User Stories List</h1>
        <p className="text-[12px] text-gray-400">Generated {storieslength} User Stories Requirements</p>
      </div>
    </div>
    
      {/* FILTER BAR */}
      <div className="flex gap-4 p-6 items-center">
        <Input
          placeholder="Filter tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-1/4"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="border border-dashed ">
              <CirclePlus className="w-4 h-4"  />
              User as a:
          
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-55 p-2 bg-gray-900 border-gray-700 text-white">
        <ScrollArea className="h-30 w-full pr-2">
      <div className="flex flex-col gap-2">
        {uniqueRoles.map((role) => (
          <label key={role} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={roleFilter.includes(role)}
              onCheckedChange={() =>
                setRoleFilter((prev) =>
                  prev.includes(role)
                    ? prev.filter((item) => item !== role)
                    : [...prev, role]
                )
              }
            />
            <span className="text-white font-medium">{role}</span>
          </label>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Req ID Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="border border-dashed">
              <CirclePlus className="w-4 h-4" />
              Req Id
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-25 bg-gray-900 border-gray-700 text-white p-4 rounded-lg shadow-xl">
            <ScrollArea className="h-30 w-full pr-2">
              <div className="flex flex-col gap-2">
                {requirements.map((req) => (
                  <label
                    key={req.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedIds.includes(req.id)}
                      onCheckedChange={() => toggleId(req.id)}
                    />
                    <span className="text-white ">{req.id}</span>
                  </label>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Confidence Filter */}
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

        {/* Expand All Toggle */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm font-medium">Expand All</span>
          <div className="w-[52px] h-[22px] bg-white rounded-full flex items-center justify-between px-[2px]">
            <button
              onClick={() => setExpandAll(false)}
              className={`w-[24px] h-[18px] text-[12px] font-bold rounded-full transition-all duration-200 ${
                !expandAll ? "bg-black text-white" : "text-black"
              }`}
            >
              N
            </button>
            <button
              onClick={() => setExpandAll(true)}
              className={`w-[24px] h-[18px] text-[12px] font-bold rounded-full transition-all duration-200 ${
                expandAll ? "bg-black text-white" : "text-black"
              }`}
            >
              Y
            </button>
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

      {/* COLLAPSIBLE CARDS */}
      
      <ScrollArea className="flex-1 overflow-y-auto px-4 pr-6 pb-4">
     {paginated.map((req) => (
  <div
    key={req.id}
    className="rounded-xl border dark:border-gray-700 mb-4 ml-3.5 mr-4"
  >
    {/* <div className="pl-4 pr-4"> */}
    <button
      onClick={() => toggleExpand(req.id)}
      className="w-full flex justify-between items-center  pl-4 pr-4 px-6 py-3 rounded-t-2xl dark:bg-[#272727] bg-gray-300"
    >
      {/* Left side: Counts */}
      <div className="grid grid-cols-2 text-sm font-semibold gap-25  text-gray-700 dark:text-gray-400 mb-2 ">
        <div>User As a.. ({req.stories.length})</div>
        <div>Stories ({req.stories.length})</div>
      </div>

      {/* Right side: Req Id, Confidence, Chevron */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-700 dark:text-gray-400">Req Id – <span className="text-black dark:text-white">{req.id}</span></div>
      <ConfidenceBadge confidence={req.confidence} />
        {expandedReqs[req.id] ? (
          <ChevronUp className="w-4 h-4 text-gray-700 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-400" />
        )}
      </div>
    </button>
{/* </div> */}
    
    {expandedReqs[req.id] && (
      <ScrollArea className="h-[70px] px-2 space-y-4 bg-white-700 dark:bg-[#1a1a1a] dark:text-white rounded-b-xl">
        {/* <div className="grid grid-cols-2 text-sm font-semibold text-gray-400 mb-2">
          <div>User As a.. ({req.stories.length})</div>
          <div>Stories ({req.stories.length})</div>
        </div> */}
        {req.stories.map((story, idx) => (
  <div
    key={idx}
    className="flex items-center justify-between  border-b border-gray-400 dark:border-gray-700 py-2 gap-4"
  >
    {/* Left: Role */}
    <div className={"flex items-center text-black dark:text-white pl-4 gap-2 min-w-[180px] "}>
      <User2Icon className="w-4 h-4 " />
      <span className="text-sm">{story.role}</span>
    </div>

    {/* Middle: Story text */}
    <div className="flex-1 text-sm text-black dark:text-white px-2">
      “ {story.story} ”
      <span><Badge className="pb-0.5 pt-0.5 ml-2 text-sm font-normal rounded-sm bg-[#466ABA] text-white">{story.tshirt_size}</Badge></span>
    </div>

    {/* Right: Button */}
    <Dialog>
  <DialogTrigger asChild>
    <Button
      className=" bg-black dark:bg-white text-white dark:text-black  mr-2 h-8 px-3 text-xs rounded-t-md rounded-b-md whitespace-nowrap"
      onClick={() => setSelectedStory(story)}
    ><span><ThumbsUp></ThumbsUp></span>
      Acceptance Criteria
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-md bg-[#1a1a1a] text-white fixed top-[220px] left-1/2 -translate-x-1/2" >
    {/* Close Icon in top-right */}
   <DialogClose asChild>
  <button
    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
    aria-label="Close"
  >
   
  </button>
</DialogClose>


    {selectedStory && (
      <>
        <DialogHeader>
          <DialogTitle className="text-sm text-gray-400">
            Req Id – {req.id}{" "}
            <ConfidenceBadge confidence={req.confidence} />
          </DialogTitle>
          <DialogDescription className="text-base text-white">
            <div className="mb-2">
              <span className="text-gray-400">User As A..</span>
              <br />
              <span className={`flex items-center  pl-4 gap-2 min-w-[180px] ${
      story.role === "Card Operator" ? "text-green-600 dark:text-[#ABE2C9] " : "text-blue-600 dark:text-[#5ABAD1]"}`}>{selectedStory.role}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold">
                Acceptance Criteria:
              </span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {selectedStory.acceptanceCriteria.map((item, index) => (
                  <li key={index} className="text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
      </>
    )}
  </DialogContent>
</Dialog>

  </div>
))}
<ScrollBar orientation="vertical"></ScrollBar>
      </ScrollArea>
    )}
    {/* </div> */}
  </div>
))}
<ScrollBar orientation="vertical" />
</ScrollArea>


      {/* PAGINATION FOOTER — Keep your existing footer here */}
    
    </div>
     <div className="flex justify-end items-end mt-3 text-sm bg-[#f6f6f6] dark:bg-black text-black dark:text-white border-t border-gray-700 pt-4">
  {/* Left side: Row summary */}
  {/* <div className="text-black dark:text-gray-400 m-1.5">
    {`0 of ${filteredRequirements.length} row(s).`}
  </div> */}

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
    <div className="flex items-center gap-1.5 pr-1.5 pb-1">
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
       
      
         <CircleCheck color="#06c613" className="w-4 h-4" />
      <span className="text-black dark:text-white">User Stories generated Successfully </span>
    
    
    
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="bg-white dark:black text-black dark:text-white">Regenerate Response</Button>
<Button className="bg-black dark:bg-white text-white dark:text-black" disabled={isLoading} onClick={handlegherkin}> {isLoading ? (
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
    "Generate Gherkin"
  )}</Button>      </div>
    </div>
    </>
  );
}
