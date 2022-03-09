import { MissingDependency } from '../has-necessary-dependencies';
export declare function missingDepsError(dir: string, missingPackages: MissingDependency[]): Promise<void>;
