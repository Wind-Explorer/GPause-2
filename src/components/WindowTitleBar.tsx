import { os } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import {
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { InformationCircleIcon } from "../icons";
import { open } from "@tauri-apps/api/shell";
import { getVersion } from "@tauri-apps/api/app";

export default function WindowTitleBar() {
  const [osType, setOsType] = useState<string>("");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [appVersion, setAppVersion] = useState<string>("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    os.type().then((type) => {
      setOsType(type);
    });
    getVersion().then((version) => {
      setAppVersion(version);
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
            <div data-tauri-drag-region className="flex-grow h-full"></div>
            <div className="flex flex-row w-max h-full *:h-full *:transition-colors *:duration-200">
              <button
                onClick={onOpen}
                className="hover:bg-neutral-200 hover:dark:bg-neutral-800 h-full"
              >
                <div className="scale-[70%] w-8 *:mx-auto">
                  <InformationCircleIcon />
                </div>
              </button>
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
      <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader></ModalHeader>
              <ModalBody>
                <div className="w-full">
                  <div className="flex flex-col gap-8 w-full *:m-auto">
                    <img
                      className="w-40 h-40"
                      src="/icon.png"
                      alt="GPause Icon"
                    />
                    <div className="flex flex-col gap-4 text-center *:mx-auto">
                      <div className="flex flex-col">
                        <p className="text-2xl font-bold">GPause 2</p>
                        <p className="opacity-50">Build {appVersion}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p>Put your opened apps and games to sleep</p>
                        <p className="opacity-50 text-sm">By Adam C</p>
                      </div>
                      <Link
                        onPress={() => {
                          open("https://github.com/wind-explorer/GPause-2");
                        }}
                      >
                        View on GitHub
                      </Link>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
