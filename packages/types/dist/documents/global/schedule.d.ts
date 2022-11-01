import { Document } from "../document";
export declare enum ScheduleType {
    APP_BACKUP = "app_backup"
}
export declare enum ScheduleRepeatPeriod {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export interface Schedule extends Document {
    type: ScheduleType;
    name: string;
    startDate: string;
    repeat: ScheduleRepeatPeriod;
    metadata: ScheduleMetadata;
}
export declare type ScheduleMetadata = AppBackupScheduleMetadata;
export declare const isAppBackupMetadata: (type: ScheduleType, metadata: ScheduleMetadata) => metadata is AppBackupScheduleMetadata;
export interface AppBackupScheduleMetadata {
    apps: string[];
}
