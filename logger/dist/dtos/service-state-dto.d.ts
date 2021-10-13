import { CtlmDataTypes } from "../interfaces/ctlm-data-types";
export interface ServiceStateDto {
    type: CtlmDataTypes;
    severity: string;
    timestamp: string;
    active: boolean;
}
