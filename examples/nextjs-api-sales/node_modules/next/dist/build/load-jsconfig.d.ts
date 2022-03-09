import { NextConfigComplete } from '../server/config-shared';
export default function loadJsConfig(dir: string, config: NextConfigComplete): Promise<{
    useTypeScript: boolean;
    jsConfig: any;
    resolvedBaseUrl: string | undefined;
}>;
