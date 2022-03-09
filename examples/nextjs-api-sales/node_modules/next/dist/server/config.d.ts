import { NextConfigComplete } from './config-shared';
export { DomainLocale, NextConfig, normalizeConfig } from './config-shared';
export default function loadConfig(phase: string, dir: string, customConfig?: object | null): Promise<NextConfigComplete>;
export declare function shouldUseReactRoot(): boolean;
export declare function setHttpAgentOptions(options: NextConfigComplete['httpAgentOptions']): void;
