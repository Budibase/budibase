export interface MissingDependency {
    file: string;
    pkg: string;
}
export declare type NecessaryDependencies = {
    resolved: Map<string, string>;
    missing: MissingDependency[];
};
export declare function hasNecessaryDependencies(baseDir: string, requiredPackages: MissingDependency[]): Promise<NecessaryDependencies>;
