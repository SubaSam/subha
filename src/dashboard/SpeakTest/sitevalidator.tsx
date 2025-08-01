import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { Textarea } from '@/components/ui/textarea';

type SitevalidatorProps = {
  siteTranscribedText: string;
  setSiteTranscribedText: (text: string) => void;
};

const Sitevalidator: React.FC<SitevalidatorProps> = ({ siteTranscribedText, setSiteTranscribedText }) => {

    // const [siteTranscribedText, setSiteTranscribedText] = useState('');
    return (

    
<Textarea
           className="w-full h-[13.5vh] bg-[#f7f7f7] dark:bg-[#2E2D2D] border-[#ccc] dark:border-[#444] pt-5"
            rows={6}
            placeholder="Enter your instructions here..."
            value={siteTranscribedText}
            onChange={(e) => setSiteTranscribedText(e.target.value)}
          /> )
}

export default Sitevalidator;