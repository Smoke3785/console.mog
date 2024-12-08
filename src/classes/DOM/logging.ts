// Ugly code goes in the poop box

import { log as _log, dLog as _dLog, stripAnsi } from "@utils";
import { AverageArray } from "@classes/AverageArray.ts";

const fLog = () => {};
export const dLog = process.env.NODE_ENV === "test" ? _dLog : fLog;
export const log = process.env.NODE_ENV === "test" ? _log : fLog;

export function smartRender(line: any, lineCursorIndex: any): void {
  dLog(
    2,
    { lineCursorIndex },
    `\nRendering line "${stripAnsi(line)}" at index ${lineCursorIndex}`,
  );
}

export function render(fr: number, times: AverageArray) {
  const stack = new Error().stack;
  log(
    `==============================================\nNEW RENDER FRAME - Frame: ${fr + 1} (avg time: ${times.average()}ms)\n==============================================`,
    stack,
  );
}

export function renderData(
  lineVisibilityThreshold: any,
  numberOfItemsToRender: any,
  terminalHeight: any,
  eTotalLinesConsumed: any,
  totalLinesConsumed: any,
) {
  log("Beginning render with the following information:", {
    lineVisibilityThreshold,
    numberOfItemsToRender,
    terminalHeight,
    eTotalLinesConsumed,
    totalLinesConsumed,
  });
}

// utils.dLog(
//   1,
//   `Rendering data chunk ${idx + 1} / ${dataToRender.length}.\nInformation:`,
//   {
//     linesConsumed: data.linesConsumed,
//     relativeStartingIndexOfData,
//     message: data.log.message,
//     absoluteHomePosition,
//     eTotalLinesConsumed,
//     allLinesVisible,
//     requiresRender,
//     lastLineIndex,
//     cursorIndex,
//   },
// );
