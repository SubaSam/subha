// store/sidebarStore.ts
import { create } from 'zustand';

type SidebarStore = {
  isSidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isSidebarOpen: true,
  setSidebarOpen: (value) => set({ isSidebarOpen: value }),
}));
