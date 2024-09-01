import { os } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

export default function WindowTitleBar() {
  const [osType, setOsType] = useState<string>("");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  useEffect(() => {
    os.type().then((type) => {
      setOsType(type);
    });
  }, []);

  useEffect(() => {
    const updateMaximizedState = async () => {
      const maximized =
        osType === "Darwin"
          ? await appWindow.isFullscreen()
          : await appWindow.isMaximized();
      setIsMaximized(maximized);
    };

    const debouncedUpdateMaximizedState = debounce(updateMaximizedState, 100); // 100ms debounce

    const unlisten = appWindow.onResized(() => {
      debouncedUpdateMaximizedState();
    });

    // Initial check
    updateMaximizedState();

    return () => {
      unlisten.then((unlistenFn) => unlistenFn());
      debouncedUpdateMaximizedState.cancel();
    };
  }, []);

  return (
    <>
      {osType === "Windows_NT" && (
        <div
          className={
            isMaximized
              ? "relative w-full h-[25px]"
              : "relative w-full h-[30px]"
          }
        >

          <div className="w-full h-full *:my-auto flex flex-row justify-between">
            <div className="relative flex flex-row flex-grow *:my-auto">
              <div data-tauri-drag-region className="absolute w-full h-full"></div>
              <img
                className="w-4 h-4 mx-2"
                src="../../src-tauri/icons/icon.ico"
              />
              <p className="text-[0.8rem]">blank-tauri-app-v1</p>
            </div>
            <div className="flex flex-row w-max h-full *:h-full *:transition-colors *:duration-200">
              <button
                onClick={() => {
                  appWindow.minimize();
                }}
                className="hover:bg-neutral-200 hover:dark:bg-neutral-800 h-full"
              >
                <img
                  className="dark:invert"
                  src="/windows-minimize.svg"
                  alt="minimize"
                />
              </button>
              <button
                onClick={() => {
                  appWindow.toggleMaximize();
                }}
                className="hover:bg-neutral-200 hover:dark:bg-neutral-800 h-full"
              >
                <img
                  className="dark:invert"
                  src={
                    isMaximized
                      ? "/windows-restore-maximize.svg"
                      : "/windows-maximize.svg"
                  }
                  alt="maximize/restore"
                />
              </button>
              <button
                onClick={() => {
                  appWindow.close();
                }}
                className="hover:bg-[#C42B1C] h-full"
              >
                <img
                  className="dark:invert hover:invert"
                  src="/windows-close.svg"
                  alt="close"
                />
              </button>
            </div>
          </div>
        </div>
      )}
      {osType === "Darwin" && !isMaximized && (
        <div data-tauri-drag-region className="relative w-full h-[28px]"></div>
      )}
    </>
  );
}
