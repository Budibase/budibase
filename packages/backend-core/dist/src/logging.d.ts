export declare function logAlert(message: string, e?: any): void;
export declare function logAlertWithInfo(message: string, db: string, id: string, error: any): void;
export declare function logWarn(message: string): void;
declare const _default: {
    logAlert: typeof logAlert;
    logAlertWithInfo: typeof logAlertWithInfo;
    logWarn: typeof logWarn;
};
export default _default;
