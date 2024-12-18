import { Document } from "../document";
export interface EnvironmentVariablesDoc extends Document {
    variables: string;
}
export type EnvironmentVariableValue = {
    production: string;
    development: string;
};
export type EnvironmentVariablesDecrypted = Record<string, EnvironmentVariableValue>;
export interface EnvironmentVariablesDocDecrypted extends Document {
    variables: EnvironmentVariablesDecrypted;
}
