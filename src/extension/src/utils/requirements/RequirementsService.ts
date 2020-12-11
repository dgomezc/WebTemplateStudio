import { CONSTANTS } from "../../constants/constants";
import NodeChecker from "./validators/nodeValidator";
import PythonChecker from "./validators/pythonValidator";
import NetCoreChecker from "./validators/netCoreValidator";
import path = require("path");
import { Controller } from "../../controller";
import util = require("util");

export default class RequirementsService {
  private static instance: RequirementsService;
  private validators: Map<string, IRequirementValidator>;
  private exec = util.promisify(require("child_process").exec);

  private constructor() {
    this.validators = new Map<string, IRequirementValidator>([
      [CONSTANTS.DEPENDENCY_CHECKER.NODE, new NodeChecker()],
      [CONSTANTS.DEPENDENCY_CHECKER.PYTHON, new PythonChecker()],
      [CONSTANTS.DEPENDENCY_CHECKER.NETCORE, new NetCoreChecker()],
    ]);
  }

  static getInstance(): RequirementsService {
    if(!RequirementsService.instance) {
      RequirementsService.instance = new RequirementsService();
    }
    return RequirementsService.instance;
  }

  public async isInstalled(requirementName: string, minVersion: string) {
    const requirementValidator = this.validators.get(requirementName);
    const result = requirementValidator ? await requirementValidator.isInstalled(minVersion) : false;
    return result;
  }

  public async getReactNativeRequirements(): Promise<IReactNativeRequirement[]> {
    try {
      const extensionPath = Controller.vsContext.extensionPath;
      const scriptPath = path.join(extensionPath, "src", "scripts", "rnw-dependencies.ps1");
      const command = `powershell.exe -File ${scriptPath} -NoPrompt`;
      const { stdout } = await this.exec(command);

      const requirements = this.parseReactNativeRequirements(stdout);
      return requirements;
    } catch (err) {
      return [];
    }
  }

  private parseReactNativeRequirements(requirements: string): IReactNativeRequirement[] {
    const result:IReactNativeRequirement[] = [];
    const lines = requirements.split("\n");

    for (const line of lines) {
      const requirement = line.match(/(.*)(ok|(failed))$/i);
      if (requirement && requirement.length > 2) {
        result.push({
          name: requirement[1].trim().replace("Checking ", ""),
          isInstalled: requirement[2] === "OK",
        });
      }
    }
    return result;
  }
}
