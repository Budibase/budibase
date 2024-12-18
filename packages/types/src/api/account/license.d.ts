import { LicenseOverrides, QuotaUsage } from "../../documents";
import { OfflineLicense, PlanType } from "../../sdk";
import { ISO8601 } from "../../shared";
export interface GetLicenseRequest {
    quotaUsage?: QuotaUsage;
    install: {
        id: string;
        tenantId: string;
        version: string;
    };
}
export interface QuotaTriggeredRequest {
    percentage: number;
    name: string;
    resetDate?: string;
}
export interface LicenseActivateRequest {
    installVersion?: string;
}
export interface UpdateLicenseRequest {
    planType?: PlanType;
    overrides?: LicenseOverrides;
}
export interface CreateOfflineLicenseRequest {
    installationIdentifierBase64: string;
    expireAt: ISO8601;
}
export interface GetOfflineLicenseResponse {
    offlineLicenseToken: string;
    license: OfflineLicense;
}
