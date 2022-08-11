import { Document } from "../document";
export declare type AppMetadataErrors = {
    [key: string]: string[];
};
export interface App extends Document {
    appId: string;
    type: string;
    version: string;
    componentLibraries: string[];
    name: string;
    url: string | undefined;
    template: string | undefined;
    instance: AppInstance;
    tenantId: string;
    status: string;
    theme?: string;
    customTheme?: {
        buttonBorderRadius?: string;
        primaryColor?: string;
        primaryColorHover?: string;
    };
    revertableVersion?: string;
    navigation?: AppNavigation;
    automationErrors?: AppMetadataErrors;
}
export interface AppInstance {
    _id: string;
}
export interface AppNavigation {
    navigation: string;
    title: string;
    navWidth: string;
    sticky?: boolean;
    hideLogo?: boolean;
    logoUrl?: string;
    hideTitle?: boolean;
    navBackground?: string;
    navTextColor?: string;
    links?: AppNavigationLink[];
}
export interface AppNavigationLink {
    text: string;
    url: string;
    id?: string;
    roleId?: string;
}
