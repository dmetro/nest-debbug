import { CtlmDataTypes } from "../interfaces/ctlm-data-types";

export class RegisterServiceRequestDto {
  type: CtlmDataTypes;
  severity: string;
}