import { Outlet } from "react-router-dom";
import WindowTitleBar from "../components/WindowTitleBar";

export default function DefaultLayout() {
  return (
    <div className="relative flex flex-col justify-between">
      <div className="flex flex-col min-h-screen">
        <WindowTitleBar />
        <div className="flex-grow relative">
          <Outlet />
        </div>
      </div>

      {/*
      A div that becomes black in dark mode to cover white color parts
      of the website when scrolling past the window's original view.
      */}
      <div className="fixed -z-50 dark:bg-black inset-0 w-full h-full"></div>
    </div>
  );
}
