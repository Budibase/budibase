export function pinoSettings(): {
    prettyPrint: {
        levelFirst: boolean;
    };
    level: string;
    autoLogging: {
        ignore: (req: any) => any;
    };
};
