import { EXTENSION_COMMANDS } from "../../utils/constants/commands";
import * as mockReactNativeData from "./mockData/mockReactNativePlatformData";

const getOutputPathFromConfig = (message: any) => {
  window.postMessage(
    {
      command: EXTENSION_COMMANDS.GET_OUTPUT_PATH_FROM_CONFIG,
      payload: {
        scope: message.payload && message.payload.scope ? message.payload.scope : "",
        outputPath: "/generic_output_path",
      },
    },
    "*"
  );
};

const browseNewOutputPath = (message: any) => {
  window.postMessage(
    {
      command: EXTENSION_COMMANDS.BROWSE_NEW_OUTPUT_PATH,
      payload: {
        scope: message.payload && message.payload.scope ? message.payload.scope : "",
        outputPath: "/new_generic_output_path",
      },
    },
    "*"
  );
};

const getReactNativeRequirements = (message: any) => {
  window.postMessage(
    {
      command: EXTENSION_COMMANDS.GET_REACT_NATIVE_REQUIREMENTS,
      payload: {
        scope: message.payload && message.payload.scope ? message.payload.scope : "",
        requirements: mockReactNativeData.requirements,
      },
    },
    "*"
  );
};

export { getOutputPathFromConfig, browseNewOutputPath, getReactNativeRequirements };
