import { IVSCodeObject } from "../../reducers/vscodeApiReducer";
import {
  EXTENSION_COMMANDS, EXTENSION_MODULES, WIZARD_CONTENT_INTERNAL_NAMES
} from "../constants";

const postMessageAsync = (command:string, paramsMessage:any, vscode: IVSCodeObject)=>{

  let promise = new Promise<any>((resolve) => {
    let scope = Math.random();

    paramsMessage.payload = paramsMessage.payload || {};
    paramsMessage.payload.scope = scope;
    const callbackVsCode = (event:any) =>{
      if (event.data.command === command){
        if (event.data.payload && event.data.payload.scope === scope){
          resolve(event);
          window.removeEventListener("message",callbackVsCode);
        }
      }
    }

    window.addEventListener("message", callbackVsCode);
    vscode.postMessage(paramsMessage);
  });
  return promise;
};

const projectPathValidation = (projectPath:string, projectName:string, vscode: IVSCodeObject):Promise<any> => {
  let promise:Promise<any> = postMessageAsync(EXTENSION_COMMANDS.PROJECT_PATH_VALIDATION, {
    module: EXTENSION_MODULES.VALIDATOR,
    command: EXTENSION_COMMANDS.PROJECT_PATH_VALIDATION,
    track: false,
    projectPath,
    projectName
  }, vscode);
  return promise;
}

const getValidationsConfig = (paramsMessage:any, vscode: IVSCodeObject):Promise<any> => {
  return postMessageAsync(EXTENSION_COMMANDS.GET_VALIDATIONS, paramsMessage, vscode);
}

const getFrameworks = (vscode: IVSCodeObject, isPreview:boolean):Promise<any> => {
  return postMessageAsync(EXTENSION_COMMANDS.GET_FRAMEWORKS, {
    module: EXTENSION_MODULES.CORETS,
    command: EXTENSION_COMMANDS.GET_FRAMEWORKS,
    payload: {
      isPreview,
      projectType: WIZARD_CONTENT_INTERNAL_NAMES.FULL_STACK_APP
    }
  }, vscode);
}

const getLatestVersion = (vscode: IVSCodeObject, checkVersionPackageName:string, checkVersionPackageSource:string):Promise<any> => {
  return postMessageAsync(EXTENSION_COMMANDS.GET_LATEST_VERSION, {
    module: EXTENSION_MODULES.DEPENDENCYCHECKER,
    command: EXTENSION_COMMANDS.GET_LATEST_VERSION,
    payload: {
      checkVersionPackageName,
      checkVersionPackageSource
    }
  }, vscode).then((event)=>{
    const latestVersion = event.data.payload.latestVersion;
    return latestVersion;
  });
}

const getPages = (vscode: IVSCodeObject, frontEndInternalName:string, backEndInternalName:string)=>{
  return postMessageAsync( EXTENSION_COMMANDS.GET_PAGES, {
    module: EXTENSION_MODULES.CORETS,
    command: EXTENSION_COMMANDS.GET_PAGES,
    payload: {
      projectType: WIZARD_CONTENT_INTERNAL_NAMES.FULL_STACK_APP,
      frontendFramework: frontEndInternalName,
      backendFramework: backEndInternalName
    }
  }, vscode);
}

const getOutput_Path = (vscode: IVSCodeObject) => {
  return postMessageAsync(EXTENSION_COMMANDS.GET_OUTPUT_PATH, {
    module: EXTENSION_MODULES.DEFAULTS,
    command: EXTENSION_COMMANDS.GET_OUTPUT_PATH
  }, vscode);
}

export {
  projectPathValidation,
  getValidationsConfig,
  getFrameworks,
  getLatestVersion,
  getPages,
  getOutput_Path
}
