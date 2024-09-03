import { Command } from "@tauri-apps/api/shell";

export interface RunningProcess {
  id: string;
  name: string;
  processPath: string;
  windowTitleText: string;
  isSuspended: boolean;
  appIconBase64: string;
}

export interface RunningProcesses {
  processes: RunningProcess[];
  encounteredProblems: boolean;
}

export async function GetRunningProcesses(): Promise<RunningProcesses> {
  let command = Command.sidecar("binaries/GPauseCore", [
    "huo-qv-yun-xing-zhong-cheng-xv",
  ]);
  let result = await command.execute();
  console.log(result);
  return JSON.parse(result.stdout) as RunningProcesses;
}

export async function PauseProcess(processId: string) {
  let command = Command.sidecar("binaries/GPauseCore", ["zan-ting", processId]);
  await command.execute();
}

export async function ResumeProcess(processId: string) {
  let command = Command.sidecar("binaries/GPauseCore", ["ji-xv", processId]);
  await command.execute();
}

export async function TerminateProcess(processId: string) {
  let command = Command.sidecar("binaries/GPauseCore", [
    "zhong-zhi",
    processId,
  ]);
  await command.execute();
}

export async function MinimizeProcess(processId: string) {
  let command = Command.sidecar("binaries/GPauseCore", [
    "zui-xiao-hua",
    processId,
  ]);
  await command.execute();
}

export async function RestoreProcess(processId: string) {
  let command = Command.sidecar("binaries/GPauseCore", ["hui-fu", processId]);
  await command.execute();
}

export async function OpenProcessPathInFileExplorer(processId: string) {
  let command = Command.sidecar("binaries/GPauseCore", [
    "zai-zi-yuan-guan-li-qi-zhong-da-kai",
    processId,
  ]);
  await command.execute();
}
