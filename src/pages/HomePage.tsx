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
import { Button, ButtonGroup, Card, Code, Link } from "@nextui-org/react";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "../icons";

export default function HomePage() {
  const [runningProcesses, setRunningProcesses] =
    useState<RunningProcesses | null>(null);

  const PopulateProcessesList = () => {
    GetRunningProcesses().then((processes) => setRunningProcesses(processes));
  };
  useEffect(() => {
    PopulateProcessesList();
  }, []);
  return (
    <div className="p-10">
      <div className="flex flex-col gap-8">
        <div className="w-full flex flex-row justify-between *:my-auto">
          <p className="text-3xl">Running Apps</p>
          <Button
            onPress={PopulateProcessesList}
            variant="flat"
            startContent={<ArrowPathIcon />}
          >
            Refresh
          </Button>
        </div>
        <div>
          {runningProcesses && (
            <div className="flex flex-col gap-4">
              {runningProcesses?.processes.map((process) => (
                <div key={process.id}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
