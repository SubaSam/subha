// // import {
// //   Folder,
// //   Forward,
// //   MoreHorizontal,
// //   Trash2,
// //   type LucideIcon,
// // } from "lucide-react"

// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// // import {
// //   SidebarGroup,
// //   SidebarGroupLabel,
// //   SidebarMenu,
// //   SidebarMenuAction,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// //   useSidebar,
// // } from "@/components/ui/sidebar"

// // export function NavProjects({
// //   projects,
// // }: {
// //   projects: {
// //     name: string
// //     url: string
// //     icon: LucideIcon
// //   }[]
// // }) {
// //   const { isMobile } = useSidebar()

// //   return (
// //     <SidebarGroup className="group-data-[collapsible=icon]:hidden">
// //       <SidebarGroupLabel>Projects</SidebarGroupLabel>
// //       <SidebarMenu>
// //         {projects.map((item) => (
// //           <SidebarMenuItem key={item.name}>
// //             <SidebarMenuButton asChild>
// //               <a href={item.url}>
// //                 <item.icon />
// //                 <span>{item.name}</span>
// //               </a>
// //             </SidebarMenuButton>
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <SidebarMenuAction showOnHover>
// //                   <MoreHorizontal />
// //                   <span className="sr-only">More</span>
// //                 </SidebarMenuAction>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent
// //                 className="w-48 rounded-lg"
// //                 side={isMobile ? "bottom" : "right"}
// //                 align={isMobile ? "end" : "start"}
// //               >
// //                 <DropdownMenuItem>
// //                   <Folder className="text-muted-foreground" />
// //                   <span>View Project</span>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuItem>
// //                   <Forward className="text-muted-foreground" />
// //                   <span>Share Project</span>
// //                 </DropdownMenuItem>
// //                 <DropdownMenuSeparator />
// //                 <DropdownMenuItem>
// //                   <Trash2 className="text-muted-foreground" />
// //                   <span>Delete Project</span>
// //                 </DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </SidebarMenuItem>
// //         ))}
// //         <SidebarMenuItem>
// //           <SidebarMenuButton className="text-sidebar-foreground/70">
// //             <MoreHorizontal className="text-sidebar-foreground/70" />
// //             <span>More</span>
// //           </SidebarMenuButton>
// //         </SidebarMenuItem>
// //       </SidebarMenu>
// //     </SidebarGroup>
// //   )
// // }


// import {
//   Folder,
//   Forward,
//   MoreHorizontal,
//   Trash2,
//   type LucideIcon,
// } from "lucide-react"

// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuAction,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import { cn } from "@/lib/utils"
// interface NavProjectsProps {
//   projects: {
//     name: string
//     icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
//   }[]
//   onSelect: (name: string) => void,
//   activePage: string
// }
// export function NavProjects({
//   projects,
//   onSelect,
//   activePage
// }: NavProjectsProps) {
//   const { isMobile } = useSidebar()

//   return (
//     <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//       <SidebarGroupLabel>Modules</SidebarGroupLabel>
//       <SidebarMenu>
//         {projects.map((item) => (
//           <SidebarMenuItem key={item.name} >
//             <SidebarMenuButton onClick={() => onSelect(item.name)}
//               className={cn(
//     "flex items-center gap-3 rounded-md px-2 py-1",
//     item.name === activePage
//       ? " text-[#b164ff] font-semibold" // light background + purple text
//       : "text-black dark:text-white hover:bg-accent"
//   )}>
              
//                  <span className="shrink-0">
//     <item.icon
//        className={cn(
//         "!w-[30px] !h-[30px]",
//         item.name === activePage ? "text-[#b164ff]" : "text-black dark:text-white"
//       )}
//     />
//   </span>
//                 <span className={cn(item.name === activePage && "text-[#b164ff]")}>
//     {item.name}
//   </span>
              
//             </SidebarMenuButton>
//             {/* <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuAction showOnHover>
//                   <MoreHorizontal />
//                   <span className="sr-only">More</span>
//                 </SidebarMenuAction>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-48 rounded-lg"
//                 side={isMobile ? "bottom" : "right"}
//                 align={isMobile ? "end" : "start"}
//               >
//                 <DropdownMenuItem>
//                   <Folder className="text-muted-foreground" />
//                   <span>View Project</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Forward className="text-muted-foreground" />
//                   <span>Share Project</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <Trash2 className="text-muted-foreground" />
//                   <span>Delete Project</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu> */}
//           </SidebarMenuItem>
//         ))}
//         {/* <SidebarMenuItem>
//           <SidebarMenuButton className="text-sidebar-foreground/70">
//             <MoreHorizontal className="text-sidebar-foreground/70" />
//             <span>More</span>
//           </SidebarMenuButton>
//         </SidebarMenuItem> */}
//       </SidebarMenu>
//     </SidebarGroup>
//   )
// }

import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { slugify } from "@/lib/slugify";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
interface NavProjectsProps {
  projects: {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive?: boolean;

    children?: {
      title: string;
      id: string;
    }[];
  }[];
  onSelect: (name: string) => void;
  activePage: string;
}

export function NavProjects({
  projects,
  onSelect,
  activePage
}: NavProjectsProps) {
 const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const hasChildren = !!item.children?.length ;
          const isExpanded = expanded === item.name;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => {
                  if (hasChildren) {
                    setExpanded(isExpanded ? null : item.name);
                  } else {
                    onSelect(item.name);
                    navigate(`/${slugify(item.name)}`);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 justify-between",
                item.name === activePage || item.children?.some((child) => child.id === activePage)

                    ? "text-purple-500 font-semibold hover:text-purple-500"
                    : "text-black dark:text-white hover:bg-accent"
                )}
              >
                <span className="flex items-center gap-2">
                  <item.icon
                    className={cn(
                      "!w-[35px] !h-[35px]",
                item.name === activePage || item.children?.some((child) => child.id === activePage)
                        ? "text-purple-500"
                        : "text-gray-900 dark:text-white"
                    )}
                  />
                  {item.name}
                </span>
                {/* {hasChildren &&
                  (isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  ))} */}
              </SidebarMenuButton>

              {hasChildren && isExpanded && (
                <div className="relative ml-10 mt-1 space-y-1">
                  <div className="absolute left-[-18px] top-0 h-full w-[2px] bg-black dark:bg-gray-600"></div>
                  {item.children?.map((child) => (
                    <SidebarMenuButton
                      key={child.id}
                      onClick={() => {
                        onSelect(child.id);
                        navigate(`/${slugify(child.id)}`);
                      }}
                    className={cn(
  "block text-sm w-full text-left px-2 py-1 rounded-md",
  activePage === child.id
    ? "  bg-[#353536] hover:bg-[#353536]"
    : "text-black dark:text-white hover:bg-accent"
)}

                    >
                      {child.title}
                    </SidebarMenuButton>
                  ))}
                </div>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}