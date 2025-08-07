'use client';

import * as React from 'react';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';

import  {PipelineUpload}  from './upload';
import Converterfinaloutput from './Converterfinaloutput';
import ConverterPipelineRefiner from './refineconverter';

export default function PipelineConverter(): JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [pipelineData, setPipelineData] = useState<string>("");
  const [finalPipeline, setFinalPipeline] = useState<string >("");
  const [responseText, setResponseText] = useState<string>('');
const [currentPipeline, setCurrentPipeline] = useState<string>('');

  // ✅ Track completed steps
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});

  // ✅ Optional: enforce sequential step flow
  // const isStepEnabled = (index: number) => {
  //   if (index === 1) return true;
  //   return completedSteps[index - 1] === true;
  // };
React.useEffect(() => {
  if (step === 3) {
    setCompletedSteps((prev) => ({ ...prev, 3: true }));
  }
}, [step]);

  return (
    <>
      {/* Step Tabs */}
      <div className="flex items-center justify-center mt-[-20px] mb-2 rounded-lg">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <button
              // Uncomment to restrict future steps until prior ones are done
              // disabled={!isStepEnabled(s)}
              onClick={() => setStep(s)}
              className={`flex items-center p-1 gap-1 rounded-md text-sm  
                ${step === s ? 'bg-purple-500 text-black dark:text-white' : 'text-black dark:text-white/60'} transition-colors duration-300`}
            >
              <span className={`rounded-lg border w-5 h-5 flex items-center justify-center text-xs 
                ${completedSteps[s] ? 'bg-green-500 border-green-500 text-white' : 'border-white/40'}`}>
                {completedSteps[s] ? '✓' : s}
              </span>
              {s === 1 ? 'Extract Details' : s === 2 ? 'Review & Refine' : 'Final Output'}
            </button>
            {s !== 3 && <div className="h-[1px] w-[35px] bg-gray-600" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Extract Details */}
      {step === 1 && (
        <PipelineUpload
          goToStep={(next: React.SetStateAction<number>) => {
            setCompletedSteps((prev) => ({ ...prev, 1: true }));
            setStep(next);
          }}
          responseText={responseText}
          setResponseText={setResponseText}
          setPipelineData={setPipelineData}
          // setCurrentPipeline={setCurrentPipeline}
        />
      )}

      {/* Step 2: Refine */}
      {step === 2 && (
        <ConverterPipelineRefiner
        
          goToStep={(next) => {
            setCompletedSteps((prev) => ({ ...prev, 2: true }));
            setStep(next);
           

          }}
          pipelineData={pipelineData}
          setFinalPipeline={setFinalPipeline}
          currentPipeline={currentPipeline}
    setCurrentPipeline={setCurrentPipeline}
        />
      )}

      {/* Step 3: Final Output */}
      {step === 3 && (
        <Converterfinaloutput
          goToStep={(next) => {
            
            setStep(next);
          }}
          finalPipeline={finalPipeline}
        />
      )}
    </>
  );
}

// export default Pipeline;
