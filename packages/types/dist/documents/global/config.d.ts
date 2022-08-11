import { Document } from "../document";
export interface Config extends Document {
    type: ConfigType;
}
export interface SMTPConfig extends Config {
    config: {
        port: number;
        host: string;
        from: string;
        subject: string;
        secure: boolean;
    };
}
export interface SettingsConfig extends Config {
    config: {
        company: string;
        logoUrl: string;
        platformUrl: string;
        uniqueTenantId?: string;
    };
}
export interface GoogleConfig extends Config {
    config: {
        clientID: string;
        clientSecret: string;
        activated: boolean;
    };
}
export interface OIDCConfig extends Config {
    config: {
        configs: {
            configUrl: string;
            clientID: string;
            clientSecret: string;
            logo: string;
            name: string;
            uuid: string;
            activated: boolean;
        }[];
    };
}
export declare type NestedConfig = SMTPConfig | SettingsConfig | GoogleConfig | OIDCConfig;
export declare const isSettingsConfig: (config: Config) => config is SettingsConfig;
export declare const isSMTPConfig: (config: Config) => config is SMTPConfig;
export declare const isGoogleConfig: (config: Config) => config is GoogleConfig;
export declare const isOIDCConfig: (config: Config) => config is OIDCConfig;
export declare enum ConfigType {
    SETTINGS = "settings",
    SMTP = "smtp",
    GOOGLE = "google",
    OIDC = "oidc"
}
