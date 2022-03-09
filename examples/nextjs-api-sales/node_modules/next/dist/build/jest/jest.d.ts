export default function nextJest(options?: {
    dir?: string;
}): (customJestConfig?: any) => () => Promise<any>;
