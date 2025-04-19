import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SideBar from "./side-Bar";

export const ManagerSidebar = ({
  isFileSidebarToggled,
  handleToggle,
}: {
  isFileSidebarToggled: boolean;
  handleToggle: () => void;
}) => {
  return (
    <div
      className={`hidden sm:block relative bg-primary text-primary-foreground col-span-3 h-screen  max-sm:w-full`}
    >
      <div
        className={`hidden md:block bg-primary text-primary-foreground p-4 border-r-2 w-full md:w-64 lg:w-80 h-screen`}
      >
        <SideBar
          
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="block sm:hidden">
        <Sheet open={isFileSidebarToggled} onOpenChange={handleToggle}>
          <SheetContent
            side="left"
            className="flex flex-col h-screen border-r bg-primary p-2"
          >
            <SideBar
              
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
