// // import SidebarWrapper from "@/components/app-sidebar"
// // import { ModeToggle } from "@/components/mode-toggle"
// // import {
// //   Breadcrumb,
// //   BreadcrumbItem,
// //   BreadcrumbLink,
// //   BreadcrumbList,
// //   BreadcrumbPage,
// //   BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb"
// // import { Separator } from "@/components/ui/separator"
// // import {
// //   SidebarInset,
// //   SidebarProvider,
// //   SidebarTrigger,
// // } from "@/components/ui/sidebar"

// // export default function Page() {
// //   return (
// //     <SidebarProvider>
// //       <SidebarWrapper />
// //       <SidebarInset>
// //         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
// //           <div className="flex items-center gap-2 px-4 w-full">
// //             <SidebarTrigger className="-ml-1" />
// //             <Separator
// //               orientation="vertical"
// //               className="mr-2 data-[orientation=vertical]:h-4"
// //             />
// //             <Breadcrumb>
// //               <BreadcrumbList>
// //                 <BreadcrumbItem className="hidden md:block">
// //                   <BreadcrumbLink href="#">
// //                     Building Your Application
// //                   </BreadcrumbLink>
// //                 </BreadcrumbItem>
// //                 <BreadcrumbSeparator className="hidden md:block" />
// //                 <BreadcrumbItem>
// //                   <BreadcrumbPage>Data Fetching</BreadcrumbPage>
// //                 </BreadcrumbItem>
// //               </BreadcrumbList>
// //             </Breadcrumb>
// //             <div className="ms-auto"><ModeToggle /></div>
            
// //           </div>
// //         </header>
// //         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
// //           <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
// //         </div>
// //       </SidebarInset>
// //     </SidebarProvider>
// //   )
// // }


// import { AppSidebar } from "@/components/app-sidebar"
// import { ModeToggle } from "@/components/mode-toggle"
// import LandingPage from "@/components/LandingPage"
// // import { Sensei } from "@/components/sensei"
// import Clarifi from "./ClarifiAI/Clarifi"

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"
// import React, { useEffect } from "react"
// import { TabsDemo } from "./SpeakTest/speaktext"
// import { Pipeline } from "./Devxcelerate/pipelinegenerator/pipeline"
// import { PipelineConverter }  from "./Devxcelerate/pipelineconverter/pipelineconverter"

// export default function Page() {
//   const [activePage, setActivePage] = React.useState("Test Sage");
//   const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
//   useEffect(() => {
//     const sidebarElement = document.querySelector('[data-collapsible]');
//     if (!sidebarElement) return;

//     const observer = new MutationObserver((mutations) => {
//       for (const mutation of mutations) {
//         if (mutation.type === 'attributes' && mutation.attributeName === 'data-collapsible') {
//           const isCollapsed = sidebarElement.getAttribute('data-collapsible') === 'icon';
//           setSidebarCollapsed(isCollapsed);
//         }
//       }
//     });

//     observer.observe(sidebarElement, { 
//       attributes: true, 
//       attributeFilter: ['data-collapsible'] 
//     });

//     return () => { observer.disconnect(); };
//   }, []);

//    const renderContent = () => {
//     switch (activePage) {
//       case "ClarifAI":
//         return <Clarifi />
//       case "CodeSensei":
//         return <div />
//       case "CodeSpectre":
//         return <div>This is Code Spectre</div>
//       case "CodeGenie":
//         return <div>This is Code Genie</div>
//       case "DevXcelerate Converter":
//         return <PipelineConverter/>
//       case "DevXcelerate":
//         return <Pipeline />
//       case "TestSage":
//         return <TabsDemo isSidebarCollapsed={sidebarCollapsed} />
//       default:
//         return <div>Select a project</div>
//     }
//   }

// const dynamicwidth = sidebarCollapsed ? 'w-[95.5vw]' : 'w-[80.1vw]';
 
//   return (
//     <SidebarProvider>
//       <AppSidebar setActivePage={setActivePage} activePage={activePage} />
//       <div style={{ height:"95.5vh", marginTop:"14px", borderRadius:"8px"}} className={`${dynamicwidth} transition-all duration-300 ease-in-out bg-white dark:bg-[#0D0D0D]`}>
//         {/* <SidebarInset> */}
//          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4 w-full">
//             <SidebarTrigger className="-ml-1" />
           
//             <span>
//               <g xmlns="http://www.w3.org/2000/svg" id="Group_116" data-name="Group 116" transform="translate(-354 -38)">
//     <g id="Group_5" data-name="Group 5" transform="translate(336 -189)">
//       <circle id="Ellipse_1" data-name="Ellipse 1" cx="19" cy="19" r="19" transform="translate(18 227)" fill="#383838"/>
//     </g>
//     <g id="menu-hamburger_curved" transform="translate(333 -3.709)">
//       <path id="Path_24" data-name="Path 24" d="M32,67.709H48.378M32,61.854h9.453M32,56H48.378" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
//     </g>
//   </g>
//             </span>
//             <p>{activePage}</p>
//             <div className="ms-auto"><ModeToggle /></div>
            
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
//           <div  className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
//           {renderContent()}</div>
//         </div>
//       {/* </SidebarInset> */}
//       </div>
      
//     </SidebarProvider>
//   )
// }


import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import LandingPage from "@/components/LandingPage"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import React, { useEffect, useState } from "react"
//import {ChatTopbar} from "@/components/velocityLens/velocityChat/chatHeaders"

//import { TabsDemo } from "./SpeakTest/speaktext"
import { slugify } from "@/lib/slugify"
// import Clarifai from "@/components/clarifai/Clarifai"
// import VelocityLens from "@/components/velocityLens/velocityHome"
import { Outlet, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MessageSquare, PlusSquare, Search, Settings } from "lucide-react"
// import type { ChatItem } from "@/components/velocityLens/velocityChat/ChatHistoryPopup"
// import { ChatTopbar } from "@/components/velocityLens/velocityChat/chatHeaders"
// import { Button } from "@/components/ui/button"
// import { MessageSquare, PlusSquare, Search, Settings } from "lucide-react"
// import { useState } from "react";
// import VelocityChat from "@/components/velocityLens/velocityChat/vchat"
// //import { ChatTopbar } from "./chatHeaders";
// import type { ChatItem } from "@/components/velocityLens/velocityChat/ChatHistoryPopup"
// import ChatHistoryPopup from "@/components/velocityLens/velocityChat/ChatHistoryPopup"
// import { v4 as uuidv4 } from "uuid";
// import type { ChatSession } from "@/components/velocityLens/velocityChat/chatContainer"
// import ChatHistoryPopup from "@/components/velocityLens/velocityChat/ChatHistoryPopup"
// import VelocityChat from "@/components/velocityLens/velocityChat/vchat"
// import { SearchChatPopup } from "@/components/velocityLens/velocityChat/SearchChatPopup"
export default function Page() {
  const [activePage, setActivePage] = React.useState("Test Sage");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  // const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
    const [activePopup, setActivePopup] = useState<string | null>(null);
//   const [activeSessionId, setActiveSessionId] = useState<string>(() => {
//   // const newId = uuidv4();
//   return newId;
// }); 
// const [chatSessions, setChatSessions] = useState<ChatSession[]>([{
//   id: activeSessionId,
//   chats: [],
//   createdAt: new Date().toISOString(),
// }]);
    const [resetSignal, setResetSignal] = useState(0);
// const activeSession = chatSessions.find(session => session.id === activeSessionId);
// const activeChatHistory = activeSession?.chats || [];
//    const [recentSearches,setRecentSearches]=useState<string[]>([]);

//   const handleTriggerPopup = (popup: string) => {
//   setActivePopup(popup);

//   if (popup === "new") {
//     const newSession: ChatSession = {
//       id: uuidv4(),
//       chats: [],
//       createdAt: new Date().toISOString(),
//     };
//     setChatSessions(prev => [...prev, newSession]);
//     setActiveSessionId(newSession.id);
//     setResetSignal(prev => prev + 1);
//   }
// };
  
//     const handleClosePopup = () => {
//       setActivePopup(null);
//     };
  
    // const handleDeleteChat = (index: number) => {
    //   setChatHistory((prev) => prev.filter((_, i) => i !== index));
    // };
// const handleDeleteSession = (sessionId: string) => {
//   const isCurrent = sessionId === activeSessionId;

//   if (isCurrent) {
//     const newSession: ChatSession = {
//       id: uuidv4(),
//       chats: [],
//       createdAt: new Date().toISOString(),
//     };

//     // Set new session ID and chat
//     setActiveSessionId(newSession.id);
//     setChatSessions(prev => {
//       const filtered = prev.filter(s => s.id !== sessionId);
//       return [...filtered, newSession];
//     });

//     // Trigger reset for VelocityChat
//     setResetSignal(prev => prev + 1);
//   } else {
//     // Just delete if it's not the active session
//     setChatSessions(prev => prev.filter(s => s.id !== sessionId));
//   }
// };


// const handleSelectSession = (sessionId: string) => {
//   setActiveSessionId(sessionId);
//   //setResetSignal(prev => prev + 1);
// };
// const updateActiveChat: React.Dispatch<React.SetStateAction<ChatItem[]>> = (updateFnOrValue) => {
//   setChatSessions(prev =>
//     prev.map(session =>
//       session.id === activeSessionId
//         ? {
//             ...session,
//           chats: typeof updateFnOrValue === 'function'
//               ? (updateFnOrValue as (prev: ChatItem[]) => ChatItem[])(session.chats)
//               : updateFnOrValue,
//           }
//         : session
//     )
//   );
// };
const location = useLocation();
const pathname = location.pathname.toLowerCase();

  useEffect(() => {
  const pages = [
    "ClarifAI",
    "CodeSensei",
    "CodeSpectre",
    "CodeGenie",
    "VelocityLens",
    "DevXcelerateGenerator",
    "DevXcelerateConverter",
    "DevXcelerateRefiner",
    "TestSage",
    "Settings",
  ];

  const slug = location.pathname.split("/")[1]?.toLowerCase() || "";

  const slugToName = Object.fromEntries(
    pages.map((name) => [slugify(name).toLowerCase(), name])
  );

  setActivePage(slugToName[slug] || "");
  
  // sidebar observer
  const sidebarElement = document.querySelector('[data-collapsible]');
  if (!sidebarElement) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-collapsible') {
        const isCollapsed = sidebarElement.getAttribute('data-collapsible') === 'icon';
        setSidebarCollapsed(isCollapsed);
      }
    }
  });

  observer.observe(sidebarElement, { 
    attributes: true, 
    attributeFilter: ['data-collapsible'] 
  });

  return () => { observer.disconnect(); };
}, [location]);
// useEffect(() => {
//   if (activePage) {
//     console.log("Active Page:",activePage);
//   }
// }, [activePage]);

  //  const renderContent = () => {
  //   switch (activePage) {
  //     case "ClarifAI":
  //       return <Clarifai />
  //     case "CodeSensei":
  //       return <div />
  //     case "CodeSpectre":
  //       return <div>This is Code Spectre</div>
  //     case "CodeGenie":
  //       return <div>This is Code Genie</div>
  //     case "VelocityLens":
  //       return <VelocityLens/>
  //     case "DevXcelerate Generator":
  //       return <div>This is DevXcelerate Generator</div>
  //     case "DevXcelerate Converter":
  //       return <div>This is DevXcelerate Converter</div>
  //     case "TestSage":
  //       return <div/>
  //     default:
  //       return <div>Select a project</div>
  //   }
  // }

const dynamicwidth = sidebarCollapsed ? 'w-[95.5vw]' : 'w-[80.1vw]';
 
  return (
    <SidebarProvider>
      <AppSidebar setActivePage={setActivePage} activePage={activePage} />
      <div style={{ height:"95.5vh", marginTop:"14px", borderRadius:"8px"}} className={`${dynamicwidth} transition-all duration-300 ease-in-out bg-white dark:bg-[#0D0D0D]`}>
        {/* <SidebarInset> */}
         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
           
            <span>
              <g xmlns="http://www.w3.org/2000/svg" id="Group_116" data-name="Group 116" transform="translate(-354 -38)">
    <g id="Group_5" data-name="Group 5" transform="translate(336 -189)">
      <circle id="Ellipse_1" data-name="Ellipse 1" cx="19" cy="19" r="19" transform="translate(18 227)" fill="#383838"/>
    </g>
    <g id="menu-hamburger_curved" transform="translate(333 -3.709)">
      <path id="Path_24" data-name="Path 24" d="M32,67.709H48.378M32,61.854h9.453M32,56H48.378" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    </g>
  </g>
            </span>
   {/* Page Title */}
  {/* <p className="text-lg font-semibold tex-black dark:text-white">
    {( ["SubSection3", "DevXcelerateConverter"].includes(activePage)   ? "DevXcelerateGenerator" : activePage).replace(/([a-z])([A-Z])/g, "$1 $2")}
  </p> */}
  <p className="text-md  text-black dark:text-white">
  {(() => {
    if (activePage === "DevXcelerateRefiner") return "Pipeline Refiner";
    if (activePage === "DevXcelerateConverter") return "Pipeline Converter";
    if (activePage === "DevXcelerateGenerator") return "Pipeline Generator";
     if (activePage === "CodeGenie") return "Code Genie";
    return activePage.replace(/([a-z])([A-Z])/g, "$1 $2");
  })()}
</p>


  <div className="flex-1" />

  {/* Show only if on /velocitylens/chat */}
  {/* {pathname === "/velocitylens/chat" && (
    <div className="flex items-center gap-2">
      <Button variant="secondary" className="rounded-full px-3">
        <Settings className="w-4 h-4 mr-1" />
        Configuration
      </Button>
      <Button variant="secondary" className="rounded-full px-3">
        <Search className="w-4 h-4 mr-1" />
        Search Chat
      </Button>
      <Button variant="secondary" className="rounded-full px-3">
        <MessageSquare className="w-4 h-4 mr-1" />
        Chat History
      </Button>
      <Button variant="default" className="rounded-full px-3">
        <PlusSquare className="w-4 h-4 mr-1" />
        New Chat
      </Button>
    </div>
  )} */}
   {/* {pathname === "/velocitylens/chat" && <ChatTopbar onTriggerPopup={handleTriggerPopup} />
   
   } */}
   

            <div className="ml-4"><ModeToggle /></div>
            
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
          <div  className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          {/* {renderContent()} */}
          <Outlet></Outlet>
          {/* {pathname === "/velocitylens/chat" && <> <VelocityChat
       chatHistory={activeChatHistory}
       setChatHistory={updateActiveChat}
       resetSignal={resetSignal}
       showSearchModal={false}
       setShowSearchModal={() => {}}
     />
   {activePopup === "history" && (
     <ChatHistoryPopup
       sessions={chatSessions}
       onClose={handleClosePopup}
       onDelete={handleDeleteSession}
       onSelect={handleSelectSession}
     />
   )}
      <SearchChatPopup
           open={activePopup === "search"}
           onClose={handleClosePopup}
           chatHistory={activeChatHistory} recentSearches={recentSearches} setRecentSearches= {setRecentSearches}/>
   </>} */}
          </div>
        </div>
      {/* </SidebarInset> */}
      </div>
      
      
    </SidebarProvider>
  )
}