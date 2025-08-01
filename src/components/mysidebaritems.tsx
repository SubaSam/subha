import { Mic, Settings } from "lucide-react"

export const sidebarItems = [
  {
    title: "Speak Test",
    url: "/speaktest",
    icon: Mic,
    isActive: false,
  },
  {
    title: "Admin Tools",
    url: "#",
    icon: Settings,
    isActive: true,
    items: [
      {
        title: "Manage Users",
        url: "/admin/users",
      },
      {
        title: "Manage Roles",
        url: "/admin/roles",
      },
    ],
  },
]
