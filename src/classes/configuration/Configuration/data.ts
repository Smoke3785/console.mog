import { MogConfigStrict } from "./types.ts";

export const defaultMogConfig: MogConfigStrict = {
  spinnerOptions: {
    defaultSpinnerColor: "yellow",
    spinnerFramesPerSecond: 10,
  },
  prefixOptions: {
    applyToEmptyLogs: false,
    prefixMarginRight: 1,
    joinString: "",
  },
  experimentalSmartRender: false,
  preserveMarginOnWrap: true,
  reportGracefulExit: true,
  overrideConsole: false,
  prefixes: [],
};
