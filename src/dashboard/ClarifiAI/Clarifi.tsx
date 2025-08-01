'use client';

import * as React from 'react';
import UploadTab from './UploadTab';
import  ClassifierTab  from './ClassifierTab';
import  ValidatorTab  from './ValidatorTab';
import  UserStoriesTab  from './UserStoriesTab';
import  GherkinTab  from './GherkinTab';
import  TestCasesTab  from './TestCasesTab';
import  TraceabilityTab  from './TraceabilityTab';
import { LogsTab } from './LogsTab';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { Requirement } from './UploadTab';

const steps = [
  { value: 'upload', label: '1. Upload' },
  { value: 'classifier', label: '2. Classifier' },
  { value: 'validator', label: '3. Validator' },
  { value: 'user stories', label: '4. User Stories' },
  { value: 'gherkin', label: '5. Gherkin' },
  { value: 'test cases', label: '6. Test Cases' },
  { value: 'traceability', label: '7. Traceability' },
  { value: 'logs', label: '8. Logs' },
];

export function Clarifi() {
  const [activeTab, setActiveTab] = React.useState('upload');
  const [fileTriedToExtract, setFileTriedToExtract] = React.useState(false);

  const [completedSteps, setCompletedSteps] = React.useState<{ [key: string]: boolean }>({
    upload: false,
    classifier: false,
    validator: false,
  });


  const [extractedData, setExtractedData] = React.useState<Requirement[]>([]);
  const [extractionStatus, setExtractionStatus] = React.useState<'idle' | 'success' | 'failed'>('idle');
  const [classifiedPayload, setClassifiedPayload] = useState<any>(null);
  const [validatePayload, setvalidatePayload] = useState<any>(null);
  const [userstoriesPayload,setuserstoriesPayload] = useState<any>(null);
  const [gerkinPayload,setgerkinPayload] = useState<any>(null);
  const [testcasePayload, settestcasePayload] = useState<any>(null);
const [classifiedRequirements, setClassifiedRequirements] = useState<any[]>([]);
const [validatedRequirements, setValidatedRequirements] = useState<any[]>([]);
const [userstoriesRequirements, setuserstoriesRequirements] = useState<any[]>([]);
const [gerkinRequirements,setgerkinRequirements] = useState<any[]>([]);
const [testcaseRequirement,settestcaseRequirement]= useState<any[]>([]);

  const handleUploadComplete = (data: Requirement[]) => {
    setExtractedData(data);

    if (data.length > 0) {
      setExtractionStatus('success');
      setCompletedSteps((prev) => ({ ...prev, upload: true }));
    } else if (fileTriedToExtract) {
      setExtractionStatus('failed');
    }
  };

 const goToClassifier = (fullPayload: any) => {
   setClassifiedPayload(fullPayload); // Save full response
  setClassifiedRequirements(fullPayload.classified_requirements || []);
  setActiveTab("classifier");
};

    const goToValidator = (dataFromValidatorApi:any) => {
      setvalidatePayload(dataFromValidatorApi)
      setValidatedRequirements(dataFromValidatorApi.validated_requirements);
    setActiveTab('validator'); 
     setCompletedSteps((prev) => ({ ...prev, classifier: true }));// ✅ only navigates
  };
  const goTouserstories = (fullPayload:any) => {
    setuserstoriesPayload(fullPayload);
    setuserstoriesRequirements(fullPayload.user_stories);
    setActiveTab('user stories');
     setCompletedSteps((prev) => ({ ...prev, validator: true }));
   }// ✅ only navigates
   const goTogerkin = (fullPayload:any) => {
    setgerkinPayload(fullPayload);
    setgerkinRequirements(fullPayload.gherkin_scenarios)
    setActiveTab('gherkin'); // ✅ only navigates
    setCompletedSteps((prev) => ({ ...prev, 'user stories': true })); // ✅ only navigates  
    }
    const goTotestcases=(fullPayload:any)=>{
      settestcasePayload(fullPayload);
      settestcaseRequirement(fullPayload.test_cases);
      setActiveTab('test cases');
      setCompletedSteps((prev)=>({...prev, 'gherkin':true}))
    }
      const goToTraceability = () => {
    setActiveTab('traceability'); // ✅ only navigates
    setCompletedSteps((prev)=>({...prev, 'test cases':true}))
  };
  const goToLog =()=>{
    setActiveTab('logs');
    setCompletedSteps((prev)=>({...prev, 'traceability':true}))
  }
  const markClassifierComplete = () => {
    setCompletedSteps((prev) => ({ ...prev, classifier: true }));
  };

  const isStepEnabled = (index: number) => {
    if (index === 0) return true;
    const prevStep = steps[index - 1].value;
    return completedSteps[prevStep] === true;
  };

  return (
    <>
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-8 w-full bg-[#ececec] dark:bg-[#2e2D2D] rounded-md h-[6.5vh]">
          {steps.map((step, index) => {
            const isCompleted = completedSteps[step.value];
            // const isDisabled = !isStepEnabled(index);

            const showRed =
              step.value === 'upload' &&
              fileTriedToExtract &&
              extractionStatus === 'failed' &&
              extractedData.length === 0;

            return (
              <TabsTrigger
                key={step.value}
                value={step.value}
                // disabled={isDisabled}
                className={`w-full rounded-md px-2 py-2 text-xs font-medium text-black dark:text-white transition-all flex items-center justify-center gap-2 ${
                  activeTab === step.value ? 'bg-purple-500 shadow' : ''
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                    showRed
                      ? 'bg-red-500 border-red-500'
                      : activeTab === step.value && isCompleted
                      ? 'bg-white border-white'
                      : isCompleted
                      ? 'bg-green-500 border-green-500'
                      : activeTab === step.value
                      ? 'bg-[#B164FF] border-white'
                      : 'bg-black border-gray-500'
                  }`}
                >
                  {isCompleted && <Check className="w-2 h-2 text-white" />}
                  {showRed && <X className="w-2 h-2 text-white" />}
                </div>
                {step.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

       <TabsContent value="upload">
<UploadTab
  onUploadComplete={handleUploadComplete}
  isUploadComplete={completedSteps.upload || false}
  extractedData={extractedData}
  extractionStatus={extractionStatus}
  onExtractTriggered={() => setFileTriedToExtract(true)}
  goToClassifier={goToClassifier}
/>


</TabsContent>


        <TabsContent value="classifier">
  <ClassifierTab
  classifiedData={classifiedRequirements}
  fullClassifiedPayload={classifiedPayload}
  goTovalidator={goToValidator}
/>

</TabsContent>


        <TabsContent value="validator"><ValidatorTab validatedData={validatedRequirements} fullValidatedDataPayload={validatePayload} goTouserstories={goTouserstories}/></TabsContent>
        <TabsContent value="user stories"><UserStoriesTab goTogerkin={goTogerkin} userstoriesData={userstoriesRequirements} fulluserstoriesdataPayload={userstoriesPayload} /></TabsContent>
        <TabsContent value="gherkin"><GherkinTab goTotestcases={goTotestcases}  gerkinData={gerkinRequirements} fullgerkinDataPayload={userstoriesPayload}/></TabsContent>
        <TabsContent value="test cases">
          <TestCasesTab goToTraceability={goToTraceability} testcaseData={testcaseRequirement} fulltestcaseDataPayload={testcasePayload}        
          /></TabsContent>
        <TabsContent value="traceability"><TraceabilityTab goToLogs={goToLog} /></TabsContent>
        <TabsContent value="logs"><LogsTab /></TabsContent>
      </Tabs>
    </div>
    </>
  );
}

export default Clarifi;
