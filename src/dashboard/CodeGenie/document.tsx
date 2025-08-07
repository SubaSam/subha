'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // or replace with a normal <button>
import { ChevronDown } from 'lucide-react';

const fileTypes = ['Azure Devops YAML', 'Software Requirement', 'HLD Format'];

const CodeGenie = () => {
  const [selectedType, setSelectedType] = useState(fileTypes[1]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-start space-x-6 text-sm">
        <div className="px-4 py-2 rounded-full bg-purple-600 text-white font-semibold">① Document Verification</div>
        <div className="text-gray-400">② Generate HLD</div>
        <div className="text-gray-400">③ Auto Review</div>
        <div className="text-gray-400">④ Human Review</div>
      </div>

      {/* Upload Box */}
      <div className="bg-zinc-900 p-4 rounded-xl">
        <div className="text-sm font-medium mb-2">Upload Files</div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Drop Area */}
          <div className="flex-1 border border-dashed border-gray-500 rounded-xl h-24 flex items-center justify-center cursor-pointer">
            <label className="w-full h-full flex items-center justify-center cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <span className="text-gray-400">Click or drag a file here</span>
            </label>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              className="bg-zinc-800 border border-gray-600 text-sm px-4 py-2 rounded-md flex items-center justify-between gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Select the file type
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 w-56 bg-zinc-800 border border-gray-700 rounded-md shadow-lg z-50">
                {fileTypes.map((type) => (
                  <div
                    key={type}
                    className={`px-4 py-2 text-sm hover:bg-zinc-700 cursor-pointer ${
                      selectedType === type ? 'bg-zinc-700 text-white' : 'text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedType(type);
                      setDropdownOpen(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add File Button */}
          <Button className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md">Add File</Button>
        </div>
      </div>

      {/* File Output */}
      <div className="bg-zinc-900 rounded-xl p-4 min-h-[200px]">
        <div className="text-sm text-gray-500 mb-2">File Output</div>
        <div className="text-gray-300 text-xs whitespace-pre-wrap">
          {file ? `Filename: ${file.name}` : 'No file uploaded yet.'}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md">Next</Button>
      </div>
    </div>
  );
};

export default CodeGenie;
