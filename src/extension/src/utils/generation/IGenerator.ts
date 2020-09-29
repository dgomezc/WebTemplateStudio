import { IGenerationData, IService } from "../../types/generationPayloadType";
import { DeployedServiceStatus } from "./GenerationServicesService";

export interface IGenerator {
  generate: (service: IService, generationData: IGenerationData) => Promise<DeployedServiceStatus>;
  telemetryEventName: string;
}