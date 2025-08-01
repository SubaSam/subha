// 'use client';

// import React, { useState } from 'react';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from '@/components/ui/tabs';
// import {
//   Card,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import VoiceTranscriber from './recorder';
// import axios from 'axios';
// import  Sitevalidator  from './sitevalidator';

// interface TabsDemoProps {
//   isSidebarCollapsed?: boolean;
// }
// export function TabsDemo({ isSidebarCollapsed }: TabsDemoProps) {
//   const [transcribedText, setTranscribedText] = useState('');
//  const [speakIframeUrl, setSpeakIframeUrl] = useState<string | null>(null);
//   const [speakLoading, setSpeakLoading] = useState(false);  
 

//   const [speakResponse, setSpeakResponse] = useState<{
//     output?: string;
//     error?: string;
//     status?: string;
//   } | null>(null);

//    const [siteTranscribedText, setSiteTranscribedText] = useState('');
//     const [siteIframeUrl, setSiteIframeUrl] = useState<string | null>(null);
//   const [siteLoading, setSiteLoading] = useState(false);
 
//   const [siteResponse, setSiteResponse] = useState<{
//     output?: string;
//     error?: string;
//     status?: string;
//   } | null>(null);

//  const handleProceed = async () => {
//   setSpeakResponse(null)
//   setSpeakLoading(true);
//   try {
//     const response = await axios.post('http://localhost:8000/run_voice_task/', {
//       input_text: transcribedText,
//       sender_id:"user1234"
//     });

//     // const { output, status, error } = response.data;

//     // Show Swagger only if successful
//     // if (status === 'Success') {
//     //   setIframeUrl('https://petstore.swagger.io/'); // or any other target
   
//     // } else {
//     //   setIframeUrl(null);
//     //   console.error('Voice task failed:', error || 'Unknown error');
//     // }

//     setSpeakResponse(response.data);
//   } catch (err) {
//     console.error('Request failed:', err);
//     setSpeakIframeUrl(null);
//   } finally {
//     setSpeakLoading(false);
//   }
// };



//  const handleSiteValidator = async () => {
//   setSiteResponse(null);
//   setSiteLoading(true);
//   try {
//     const response = await axios.post('http://localhost:8000/run_text_task/', {
//       input_text: siteTranscribedText,
//       sender_id:"user1234"
//     });

//     // const { output, status, error } = response.data;

//     // Show Swagger only if successful
//     // if (status === 'Success') {
//     //   setSiteIframeUrl('https://preview--smooth-service-solution.lovable.app/login'); // or any other target

//     // } else {
//     //   setSiteIframeUrl(null);
//     //   console.error('Voice task failed:', error || 'Unknown error');
//     // }

//     setSiteResponse(response.data);
//   } catch (err) {
//     console.error('Request failed:', err);
//     setSiteIframeUrl(null);
//   } finally {
//     setSiteLoading(false);
//   }
// };
// const dynamicwidth = isSidebarCollapsed ? 'w-[93vw]' : 'w-[77.6vw]';

//   return (
//     <div className="flex w-full max-w-sm flex-col gap-6">
//       <Tabs defaultValue="Speaktest">
//         <TabsList className="h-[7vh] w-[23vw] bg-[#2E2D2D] rounded-xl">
//           <TabsTrigger value="Speaktest" className="flex items-center "><span><svg xmlns="http://www.w3.org/2000/svg" width="14.839" height="15.097" viewBox="0 0 14.839 20.097">
//   <g id="mic" transform="translate(-30.21 -5.89)">
//     <path id="Path_66" data-name="Path 66" d="M64.743,18.9a3.948,3.948,0,0,0,3.943-3.943V10.023a3.943,3.943,0,0,0-7.887,0v4.929A3.948,3.948,0,0,0,64.743,18.9Zm-2.629-8.873a2.629,2.629,0,0,1,5.258,0v4.929a2.629,2.629,0,0,1-5.258,0Z" transform="translate(-27.114)" fill="#fff" stroke="#fff" stroke-width="0.38"/>
//     <path id="Path_67" data-name="Path 67" d="M43.545,66.88v2.3a5.915,5.915,0,1,1-11.83,0v-2.3H30.4v2.3a7.239,7.239,0,0,0,6.572,7.2v3.645h1.314V76.38a7.239,7.239,0,0,0,6.572-7.2v-2.3Z" transform="translate(0 -54.228)" fill="#fff" stroke="#fff" stroke-width="0.38"/>
//   </g>
// </svg></span><span style={{marginLeft:"8px"}}>Speak Test</span></TabsTrigger>

//           <TabsTrigger value="SiteValidator"  className="flex items-center" ><span><svg xmlns="http://www.w3.org/2000/svg" width="14.197" height="15.368" viewBox="0 0 23.197 22.368">
//   <g id="cloud-monitoring" transform="translate(-12 -17.999)">
//     <path id="Path_68" data-name="Path 68" d="M33.54,33.942v4.971H13.657V25.657h5.8V24h-5.8A1.657,1.657,0,0,0,12,25.657V38.912a1.657,1.657,0,0,0,1.657,1.657h6.628v3.314H16.971V45.54H30.226V43.883H26.912V40.569H33.54A1.657,1.657,0,0,0,35.2,38.912V33.942Zm-8.285,9.942H21.942V40.569h3.314Z" transform="translate(0 -5.172)" fill="#fff"/>
//     <path id="Path_69" data-name="Path 69" d="M71.8,30.426h-.008a.828.828,0,0,1-.788-.6l-1.485-5.2H66V22.97h4.142a.828.828,0,0,1,.8.6l.89,3.115,2.493-8.1A.84.84,0,0,1,75.113,18a.812.812,0,0,1,.786.567l1.467,4.4h4.374v1.657H76.77a.829.829,0,0,1-.786-.567l-.839-2.518-2.553,8.3A.828.828,0,0,1,71.8,30.426Z" transform="translate(-46.544 0)" fill="#fff"/>
//   </g>
// </svg></span><span style={{marginLeft:"10px"}}>Site Validator</span></TabsTrigger>
//         </TabsList>

//         <TabsContent value="Speaktest">
//           <Card className={`bg-[#181818] ${dynamicwidth} mt-2 transition-all duration-300 h-[12rem]`}>
//             <CardHeader>
//               <CardTitle className="text-white" style={{marginTop:"-14px", marginBottom:"5px",fontFamily:"fantasy", fontSize:"13px"}} >Let's get started</CardTitle>
//               <VoiceTranscriber
//                 transcribedText={transcribedText}
//                 setTranscribedText={setTranscribedText}
//               />
//             </CardHeader>

//             <CardFooter className="flex flex-col items-start gap-2 mt-[-11px]">
//               <Button onClick={handleProceed} disabled={speakLoading}>
//                 {speakLoading ? 'Loading...' : 'Proceed'}
//               </Button>

//               {/* {speakIframeUrl ? (
//                 <iframe
//                   src={speakIframeUrl}
//                   title="Swagger API Viewer"
//                   width="100%"
//                   height="500px"
//                   className="rounded-md border"
//                 />
//               ) : (
//                 !speakLoading && (
//                   <p className="text-sm text-muted-foreground">
//                     {/* Swagger UI will appear here after clicking Proceed. 
//                   </p>
//                 )
//               )} */}

//               {speakResponse?.output && (
//                 <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[230px] overflow-auto text-sm">
//                   <h3 className="font-semibold mb-2">Automation Output:</h3>
//                   <pre className="whitespace-pre-wrap">
//                     {typeof speakResponse.output === 'object'
//                       ? JSON.stringify(speakResponse.output, null, 2)
//                       : speakResponse.output.replace(/\\n/g, '\n')
//                       .replace(/},\s*/g, '},\n\n')
//                           // .replace(/(\{|\[)/g, '\n$1')
//                           // .replace(/(\}|\])/g, '$1\n')
//                           .replace(/,/g, ',\n')}
//                   </pre>
//                 </div>
//               )}
//             </CardFooter>
//           </Card>
//         </TabsContent>

//         <TabsContent value="SiteValidator">
//           <Card className={`bg-[#181818] ${dynamicwidth} h-full mt-2 transition-all duration-300 h-[12rem]`}>
//             <CardHeader>
//               <CardTitle style={{marginTop:"-14px", marginBottom:"5px",fontFamily:"fantasy", fontSize:"13px"}} >Enter Task Instructions</CardTitle>
//               <Sitevalidator siteTranscribedText={siteTranscribedText} setSiteTranscribedText={setSiteTranscribedText} />
//             </CardHeader>
//             <CardFooter className="flex flex-col items-start gap-2 mt-[-11px]">
//               <Button onClick={handleSiteValidator} disabled={siteLoading}>
//                 {siteLoading ? 'Loading...' : 'Proceed'}
//               </Button>

//              {siteResponse?.output && (
//   <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[230px] overflow-auto text-sm">
//     <h3 className="font-semibold mb-2">Automation Output:</h3>
//     <pre className="whitespace-pre-wrap">
//       {typeof siteResponse.output === 'object'
//         ? JSON.stringify(siteResponse.output, null, 2)
//         : siteResponse.output.replace(/\\n/g, '\n')
//          .replace(/},\s*/g, '},\n\n')
//             // .replace(/(\{|\[)/g, '\n$1')
//             // .replace(/(\}|\])/g, '$1\n')
//             .replace(/,/g, ',\n')}
//     </pre>
//   </div>
// )}
//             </CardFooter>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// export default TabsDemo;


'use client';

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceTranscriber from './recorder';
import axios from 'axios';
import Sitevalidator from './sitevalidator';

interface TabsDemoProps {
  isSidebarCollapsed?: boolean;
}

export function TabsDemo({ isSidebarCollapsed }: TabsDemoProps) {
  const [transcribedText, setTranscribedText] = useState('');
  const [speakIframeUrl, setSpeakIframeUrl] = useState<string | null>(null);
  const [speakLoading, setSpeakLoading] = useState(false);
  const [speakResponse, setSpeakResponse] = useState<{
    output?: string;
    error?: string;
    status?: string;
  } | null>(null);

  // const [inputText, setInputText] = useState<string>('');
  const [siteTranscribedText, setSiteTranscribedText] = useState('');
  const [siteIframeUrl, setSiteIframeUrl] = useState<string | null>(null);
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteResponse, setSiteResponse] = useState<{
    output?: string;
    error?: string;
    status?: string;
  } | null>(null);

  const [inputText, setInputText] = useState<string>('');


  const handleProceed = async () => {
 const finalInput = transcribedText?.trim() || inputText?.trim();
if (!finalInput) return;

  setSpeakLoading(true);
  try {
    const response = await axios.post('http://localhost:8000/run_voice_task/', {
      input_text: finalInput,
      sender_id: 'user1234',
    });

    setSpeakResponse(response.data);
  } catch (err) {
    console.error('Request failed:', err);
    setSpeakIframeUrl(null);
  } finally {
    setSpeakLoading(false);
  }
};
  const handleSiteValidator = async () => {
    if (!siteTranscribedText.trim()) return;
    setSiteLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/run_text_task/', {
        input_text: siteTranscribedText,
        sender_id: 'user1234',
      });

      setSiteResponse(response.data);
    } catch (err) {
      console.error('Request failed:', err);
      setSiteIframeUrl(null);
    } finally {
      setSiteLoading(false);
    }
  };

  const dynamicwidth = isSidebarCollapsed ? 'w-[93vw]' : 'w-[77.6vw]';

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="Speaktest">
        <TabsList className="h-[7vh] w-[21vw] bg-[#ececec] dark:bg-[#2E2D2D] rounded-xl">
          <TabsTrigger value="Speaktest" className="flex items-center">
            <span style={{ marginLeft: '8px' }}>Speak Test</span>
          </TabsTrigger>
          <TabsTrigger value="SiteValidator" className="flex items-center">
            <span style={{ marginLeft: '10px' }}>Site Validator</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Speaktest">
          <Card className={`bg-[#ececec] dark:bg-[#181818] border border-[#ccc] dark:border-[#444] ${dynamicwidth} mt-2 transition-all duration-300 h-[11rem]`}>
            <CardHeader>
              <CardTitle  style={{ marginTop: '-14px', marginBottom: '5px', fontFamily: 'fantasy', fontSize: '13px' }}>
                Let's get started
              </CardTitle>
             <VoiceTranscriber
  transcribedText={transcribedText}
  setTranscribedText={setTranscribedText}
  inputText={inputText}
  setInputText={setInputText}
/>
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-2 mt-[-12px]">
              
<Button
  onClick={handleProceed}
 disabled={speakLoading || !(transcribedText?.trim() || inputText?.trim())}
>
  {speakLoading ? 'Loading...' : 'Proceed'}
</Button>

              {speakResponse?.output && (
                <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[250px] overflow-auto text-sm">
                  <h3 className="font-semibold mb-2">Automation Output:</h3>
                  <pre className="whitespace-pre-wrap">
                    {typeof speakResponse.output === 'object'
                      ? JSON.stringify(speakResponse.output, null, 2)
                      : speakResponse.output
                          .replace(/\\n/g, '\n')
                          .replace(/},\s*/g, '},\n\n')
                          .replace(/,/g, ',\n')}
                  </pre>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="SiteValidator">
          <Card className={`bg-[#ececec] dark:bg-[#181818] border border-[#ccc] dark:border-[#444] ${dynamicwidth} mt-2 transition-all duration-300 h-[11rem]`}>
            <CardHeader>
              <CardTitle style={{ marginTop: '-14px', marginBottom: '5px', fontFamily: 'fantasy', fontSize: '13px' }}>
                Enter Task Instructions
              </CardTitle>
              <Sitevalidator siteTranscribedText={siteTranscribedText} setSiteTranscribedText={setSiteTranscribedText} />
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-2 mt-[-11px]">
              <Button onClick={handleSiteValidator} disabled={siteLoading || !siteTranscribedText.trim()}>
                {siteLoading ? 'Loading...' : 'Proceed'}
              </Button>

              {siteResponse?.output && (
                <div className="bg-gray-900 text-white p-4 rounded-md w-full mt-4 max-h-[250px] overflow-auto text-sm">
                  <h3 className="font-semibold mb-2">Automation Output:</h3>
                  <pre className="whitespace-pre-wrap">
                    {typeof siteResponse.output === 'object'
                      ? JSON.stringify(siteResponse.output, null, 2)
                      : siteResponse.output
                          .replace(/\\n/g, '\n')
                          .replace(/},\s*/g, '},\n\n')
                          .replace(/,/g, ',\n')}
                  </pre>
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TabsDemo;
