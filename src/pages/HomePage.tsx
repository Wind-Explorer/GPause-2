import { useEffect, useState } from "react";
import {
  GetRunningProcesses,
  PauseProcess as SuspendProcess,
  ResumeProcess,
  RunningProcesses,
  TerminateProcess,
  RestoreProcess,
  MinimizeProcess,
  OpenProcessPathInFileExplorer,
} from "../sidecar/GPauseCore";
import {
  Button,
  ButtonGroup,
  Card,
  Code,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "../icons";
import { process } from "@tauri-apps/api";

export default function HomePage() {
  const [runningProcesses, setRunningProcesses] =
    useState<RunningProcesses | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [shownAdminDialog, setShownAdminDialog] = useState(false);

  const PopulateProcessesList = () => {
    GetRunningProcesses().then((processes) => {
      setRunningProcesses(processes);
      if (!shownAdminDialog && processes.encounteredProblems) {
        onOpen();
        setShownAdminDialog(processes.encounteredProblems);
      }
    });
  };
  useEffect(() => {
    PopulateProcessesList();
  }, []);
  return (
    <div className="h-full">
      <div className="flex flex-col gap-2 h-full *:mx-auto">
        <div className="flex-none w-full max-w-[1000px]">
          <div className="w-full flex flex-row justify-between *:my-auto p-10 pb-0">
            <p className="text-3xl">Opened Apps</p>
            <div className="flex flex-row gap-4">
              {runningProcesses?.encounteredProblems && (
                <Button
                  onPress={onOpen}
                  size="sm"
                  variant="light"
                  color="danger"
                  className="text-md"
                  startContent={
                    <div className="scale-[70%] ">
                      <ExclamationTriangleIcon />
                    </div>
                  }
                >
                  Insufficient priviledges
                </Button>
              )}
              <Button
                onPress={PopulateProcessesList}
                variant="flat"
                size="sm"
                className="text-md"
                startContent={
                  <div className="scale-[70%] ">
                    <ArrowPathIcon />
                  </div>
                }
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
        <ScrollShadow className="flex-grow overflow-auto w-full *:mx-auto">
          {runningProcesses && (
            <div className="flex flex-col gap-4 p-10 max-w-[1000px]">
              {runningProcesses?.processes.map((process) => (
                <div className="" key={process.id}>
                  <Card className="group">
                    <div className="">
                      <div className="relative h-full flex flex-row justify-between">
                        <div className="flex flex-row *:my-auto">
                          <div className=" h-full flex flex-col justify-center relative">
                            <img
                              src={`data:image/png;base64,${process.appIconBase64}`}
                              alt="app-icon"
                              className="mx-6 min-w-10 min-h-10 z-50"
                            />
                            <img
                              src={`data:image/png;base64,${process.appIconBase64}`}
                              alt="app-icon"
                              className="absolute w-full h-full scale-[200%] filter blur-3xl"
                            />
                          </div>
                          <div className="flex flex-col gap-2 py-4">
                            <p className="text-lg font-semibold">
                              {process.windowTitleText}
                            </p>
                            <div className="relative flex flex-row gap-4 *:my-auto">
                              <Code className="w-max" size="sm">
                                <span>{process.name}</span>
                              </Code>
                              <Link
                                onPress={() =>
                                  OpenProcessPathInFileExplorer(process.id)
                                }
                                className="flex flex-row gap-2 group-hover:opacity-100 opacity-0 transition-opacity cursor-pointer"
                              >
                                <ArrowTopRightOnSquareIcon />
                                Open in File Explorer
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row gap-8 px-8">
                          <div className="my-auto">
                            <div
                              className={
                                process.isSuspended
                                  ? "w-4 h-4 rounded-full bg-cyan-500"
                                  : "w-4 h-4 rounded-full bg-green-500"
                              }
                            ></div>
                          </div>
                          <div className="transition-all -mr-[130px] group-hover:mr-0 rounded-l-2xl h-full  z-50 right-0">
                            <div className="h-full flex flex-col gap-4 justify-center">
                              <ButtonGroup className="flex flex-row">
                                <Button
                                  isIconOnly
                                  size="lg"
                                  onPress={async () => {
                                    if (process.isSuspended) {
                                      await ResumeProcess(process.id);
                                      await RestoreProcess(process.id);
                                      PopulateProcessesList();
                                    } else {
                                      await MinimizeProcess(process.id);
                                      await SuspendProcess(process.id);
                                      PopulateProcessesList();
                                    }
                                  }}
                                >
                                  {process.isSuspended ? (
                                    <PlayIcon />
                                  ) : (
                                    <PauseIcon />
                                  )}
                                </Button>
                                <Button
                                  variant="faded"
                                  isIconOnly
                                  size="lg"
                                  onPress={async () => {
                                    await TerminateProcess(process.id);
                                    PopulateProcessesList();
                                  }}
                                >
                                  <XMarkIcon />
                                </Button>
                              </ButtonGroup>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
              {runningProcesses.processes.length === 0 && (
                <div className="w-full h-[55vh] text-center flex flex-col justify-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-xl">No managable apps are opened.</p>
                    <p className="text-sm">
                      Open a few apps and games to get started.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {!runningProcesses && (
            <div className="w-full h-full text-center flex flex-col justify-center">
              <Spinner label="Loading" size="lg" />
            </div>
          )}
        </ScrollShadow>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Some apps can't be managed
              </ModalHeader>
              <ModalBody>
                <p>
                  Run this app as administrator to gain access to the rest of
                  the opened apps.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Dismiss</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
