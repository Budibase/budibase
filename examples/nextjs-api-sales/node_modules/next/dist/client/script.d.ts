import React from 'react';
import { ScriptHTMLAttributes } from 'react';
export interface ScriptProps extends ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
    id?: string;
    onLoad?: (e: any) => void;
    onError?: (e: any) => void;
    children?: React.ReactNode;
}
/**
 * @deprecated Use `ScriptProps` instead.
 */
export declare type Props = ScriptProps;
export declare function initScriptLoader(scriptLoaderItems: ScriptProps[]): void;
declare function Script(props: ScriptProps): JSX.Element | null;
export default Script;
