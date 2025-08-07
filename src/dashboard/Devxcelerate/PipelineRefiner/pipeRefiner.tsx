'use client';

import * as React from 'react';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import RefinerChat from './refinerchat';
import PipelineRefinercode from './refinerupload';

export function Refiner(): JSX.Element {
  const [currentPipeline, setCurrentPipeline] = useState<string>(''); // default initial pipeline code
const [pipelineData, setPipelineData] = useState<string>("");


  return (
    <>
      <PipelineRefinercode
          pipelineData={pipelineData}
          currentPipeline={currentPipeline}
          setCurrentPipeline={setCurrentPipeline}
          setPipelineData={setPipelineData}
      />

    </>
  );
}

export default Refiner;
