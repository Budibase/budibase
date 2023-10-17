import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class RolesAnywhere extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RolesAnywhere.Types.ClientConfiguration)
  config: Config & RolesAnywhere.Types.ClientConfiguration;
  /**
   * Creates a profile, a list of the roles that Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.  Required permissions:  rolesanywhere:CreateProfile. 
   */
  createProfile(params: RolesAnywhere.Types.CreateProfileRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Creates a profile, a list of the roles that Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.  Required permissions:  rolesanywhere:CreateProfile. 
   */
  createProfile(callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Creates a trust anchor to establish trust between IAM Roles Anywhere and your certificate authority (CA). You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.  Required permissions:  rolesanywhere:CreateTrustAnchor. 
   */
  createTrustAnchor(params: RolesAnywhere.Types.CreateTrustAnchorRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Creates a trust anchor to establish trust between IAM Roles Anywhere and your certificate authority (CA). You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.  Required permissions:  rolesanywhere:CreateTrustAnchor. 
   */
  createTrustAnchor(callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Deletes a certificate revocation list (CRL).  Required permissions:  rolesanywhere:DeleteCrl. 
   */
  deleteCrl(params: RolesAnywhere.Types.ScalarCrlRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Deletes a certificate revocation list (CRL).  Required permissions:  rolesanywhere:DeleteCrl. 
   */
  deleteCrl(callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Deletes a profile.  Required permissions:  rolesanywhere:DeleteProfile. 
   */
  deleteProfile(params: RolesAnywhere.Types.ScalarProfileRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Deletes a profile.  Required permissions:  rolesanywhere:DeleteProfile. 
   */
  deleteProfile(callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Deletes a trust anchor.  Required permissions:  rolesanywhere:DeleteTrustAnchor. 
   */
  deleteTrustAnchor(params: RolesAnywhere.Types.ScalarTrustAnchorRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Deletes a trust anchor.  Required permissions:  rolesanywhere:DeleteTrustAnchor. 
   */
  deleteTrustAnchor(callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Disables a certificate revocation list (CRL).  Required permissions:  rolesanywhere:DisableCrl. 
   */
  disableCrl(params: RolesAnywhere.Types.ScalarCrlRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Disables a certificate revocation list (CRL).  Required permissions:  rolesanywhere:DisableCrl. 
   */
  disableCrl(callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Disables a profile. When disabled, temporary credential requests with this profile fail.  Required permissions:  rolesanywhere:DisableProfile. 
   */
  disableProfile(params: RolesAnywhere.Types.ScalarProfileRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Disables a profile. When disabled, temporary credential requests with this profile fail.  Required permissions:  rolesanywhere:DisableProfile. 
   */
  disableProfile(callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Disables a trust anchor. When disabled, temporary credential requests specifying this trust anchor are unauthorized.  Required permissions:  rolesanywhere:DisableTrustAnchor. 
   */
  disableTrustAnchor(params: RolesAnywhere.Types.ScalarTrustAnchorRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Disables a trust anchor. When disabled, temporary credential requests specifying this trust anchor are unauthorized.  Required permissions:  rolesanywhere:DisableTrustAnchor. 
   */
  disableTrustAnchor(callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Enables a certificate revocation list (CRL). When enabled, certificates stored in the CRL are unauthorized to receive session credentials.  Required permissions:  rolesanywhere:EnableCrl. 
   */
  enableCrl(params: RolesAnywhere.Types.ScalarCrlRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Enables a certificate revocation list (CRL). When enabled, certificates stored in the CRL are unauthorized to receive session credentials.  Required permissions:  rolesanywhere:EnableCrl. 
   */
  enableCrl(callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Enables temporary credential requests for a profile.   Required permissions:  rolesanywhere:EnableProfile. 
   */
  enableProfile(params: RolesAnywhere.Types.ScalarProfileRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Enables temporary credential requests for a profile.   Required permissions:  rolesanywhere:EnableProfile. 
   */
  enableProfile(callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Enables a trust anchor. When enabled, certificates in the trust anchor chain are authorized for trust validation.   Required permissions:  rolesanywhere:EnableTrustAnchor. 
   */
  enableTrustAnchor(params: RolesAnywhere.Types.ScalarTrustAnchorRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Enables a trust anchor. When enabled, certificates in the trust anchor chain are authorized for trust validation.   Required permissions:  rolesanywhere:EnableTrustAnchor. 
   */
  enableTrustAnchor(callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Gets a certificate revocation list (CRL).  Required permissions:  rolesanywhere:GetCrl. 
   */
  getCrl(params: RolesAnywhere.Types.ScalarCrlRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Gets a certificate revocation list (CRL).  Required permissions:  rolesanywhere:GetCrl. 
   */
  getCrl(callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Gets a profile.  Required permissions:  rolesanywhere:GetProfile. 
   */
  getProfile(params: RolesAnywhere.Types.ScalarProfileRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Gets a profile.  Required permissions:  rolesanywhere:GetProfile. 
   */
  getProfile(callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Gets a subject, which associates a certificate identity with authentication attempts. The subject stores auditing information such as the status of the last authentication attempt, the certificate data used in the attempt, and the last time the associated identity attempted authentication.   Required permissions:  rolesanywhere:GetSubject. 
   */
  getSubject(params: RolesAnywhere.Types.ScalarSubjectRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.SubjectDetailResponse) => void): Request<RolesAnywhere.Types.SubjectDetailResponse, AWSError>;
  /**
   * Gets a subject, which associates a certificate identity with authentication attempts. The subject stores auditing information such as the status of the last authentication attempt, the certificate data used in the attempt, and the last time the associated identity attempted authentication.   Required permissions:  rolesanywhere:GetSubject. 
   */
  getSubject(callback?: (err: AWSError, data: RolesAnywhere.Types.SubjectDetailResponse) => void): Request<RolesAnywhere.Types.SubjectDetailResponse, AWSError>;
  /**
   * Gets a trust anchor.  Required permissions:  rolesanywhere:GetTrustAnchor. 
   */
  getTrustAnchor(params: RolesAnywhere.Types.ScalarTrustAnchorRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Gets a trust anchor.  Required permissions:  rolesanywhere:GetTrustAnchor. 
   */
  getTrustAnchor(callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Imports the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate Authority (CA). IAM Roles Anywhere validates against the CRL before issuing credentials.   Required permissions:  rolesanywhere:ImportCrl. 
   */
  importCrl(params: RolesAnywhere.Types.ImportCrlRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Imports the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate Authority (CA). IAM Roles Anywhere validates against the CRL before issuing credentials.   Required permissions:  rolesanywhere:ImportCrl. 
   */
  importCrl(callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Lists all certificate revocation lists (CRL) in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListCrls. 
   */
  listCrls(params: RolesAnywhere.Types.ListRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ListCrlsResponse) => void): Request<RolesAnywhere.Types.ListCrlsResponse, AWSError>;
  /**
   * Lists all certificate revocation lists (CRL) in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListCrls. 
   */
  listCrls(callback?: (err: AWSError, data: RolesAnywhere.Types.ListCrlsResponse) => void): Request<RolesAnywhere.Types.ListCrlsResponse, AWSError>;
  /**
   * Lists all profiles in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListProfiles. 
   */
  listProfiles(params: RolesAnywhere.Types.ListRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ListProfilesResponse) => void): Request<RolesAnywhere.Types.ListProfilesResponse, AWSError>;
  /**
   * Lists all profiles in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListProfiles. 
   */
  listProfiles(callback?: (err: AWSError, data: RolesAnywhere.Types.ListProfilesResponse) => void): Request<RolesAnywhere.Types.ListProfilesResponse, AWSError>;
  /**
   * Lists the subjects in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListSubjects. 
   */
  listSubjects(params: RolesAnywhere.Types.ListRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ListSubjectsResponse) => void): Request<RolesAnywhere.Types.ListSubjectsResponse, AWSError>;
  /**
   * Lists the subjects in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListSubjects. 
   */
  listSubjects(callback?: (err: AWSError, data: RolesAnywhere.Types.ListSubjectsResponse) => void): Request<RolesAnywhere.Types.ListSubjectsResponse, AWSError>;
  /**
   * Lists the tags attached to the resource.  Required permissions:  rolesanywhere:ListTagsForResource. 
   */
  listTagsForResource(params: RolesAnywhere.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ListTagsForResourceResponse) => void): Request<RolesAnywhere.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags attached to the resource.  Required permissions:  rolesanywhere:ListTagsForResource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: RolesAnywhere.Types.ListTagsForResourceResponse) => void): Request<RolesAnywhere.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the trust anchors in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListTrustAnchors. 
   */
  listTrustAnchors(params: RolesAnywhere.Types.ListRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ListTrustAnchorsResponse) => void): Request<RolesAnywhere.Types.ListTrustAnchorsResponse, AWSError>;
  /**
   * Lists the trust anchors in the authenticated account and Amazon Web Services Region.  Required permissions:  rolesanywhere:ListTrustAnchors. 
   */
  listTrustAnchors(callback?: (err: AWSError, data: RolesAnywhere.Types.ListTrustAnchorsResponse) => void): Request<RolesAnywhere.Types.ListTrustAnchorsResponse, AWSError>;
  /**
   * Attaches a list of notification settings to a trust anchor. A notification setting includes information such as event name, threshold, status of the notification setting, and the channel to notify.  Required permissions:  rolesanywhere:PutNotificationSettings. 
   */
  putNotificationSettings(params: RolesAnywhere.Types.PutNotificationSettingsRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.PutNotificationSettingsResponse) => void): Request<RolesAnywhere.Types.PutNotificationSettingsResponse, AWSError>;
  /**
   * Attaches a list of notification settings to a trust anchor. A notification setting includes information such as event name, threshold, status of the notification setting, and the channel to notify.  Required permissions:  rolesanywhere:PutNotificationSettings. 
   */
  putNotificationSettings(callback?: (err: AWSError, data: RolesAnywhere.Types.PutNotificationSettingsResponse) => void): Request<RolesAnywhere.Types.PutNotificationSettingsResponse, AWSError>;
  /**
   * Resets the custom notification setting to IAM Roles Anywhere default setting.   Required permissions:  rolesanywhere:ResetNotificationSettings. 
   */
  resetNotificationSettings(params: RolesAnywhere.Types.ResetNotificationSettingsRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ResetNotificationSettingsResponse) => void): Request<RolesAnywhere.Types.ResetNotificationSettingsResponse, AWSError>;
  /**
   * Resets the custom notification setting to IAM Roles Anywhere default setting.   Required permissions:  rolesanywhere:ResetNotificationSettings. 
   */
  resetNotificationSettings(callback?: (err: AWSError, data: RolesAnywhere.Types.ResetNotificationSettingsResponse) => void): Request<RolesAnywhere.Types.ResetNotificationSettingsResponse, AWSError>;
  /**
   * Attaches tags to a resource.  Required permissions:  rolesanywhere:TagResource. 
   */
  tagResource(params: RolesAnywhere.Types.TagResourceRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TagResourceResponse) => void): Request<RolesAnywhere.Types.TagResourceResponse, AWSError>;
  /**
   * Attaches tags to a resource.  Required permissions:  rolesanywhere:TagResource. 
   */
  tagResource(callback?: (err: AWSError, data: RolesAnywhere.Types.TagResourceResponse) => void): Request<RolesAnywhere.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the resource.  Required permissions:  rolesanywhere:UntagResource. 
   */
  untagResource(params: RolesAnywhere.Types.UntagResourceRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.UntagResourceResponse) => void): Request<RolesAnywhere.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from the resource.  Required permissions:  rolesanywhere:UntagResource. 
   */
  untagResource(callback?: (err: AWSError, data: RolesAnywhere.Types.UntagResourceResponse) => void): Request<RolesAnywhere.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate authority (CA). IAM Roles Anywhere validates against the CRL before issuing credentials.  Required permissions:  rolesanywhere:UpdateCrl. 
   */
  updateCrl(params: RolesAnywhere.Types.UpdateCrlRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Updates the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate authority (CA). IAM Roles Anywhere validates against the CRL before issuing credentials.  Required permissions:  rolesanywhere:UpdateCrl. 
   */
  updateCrl(callback?: (err: AWSError, data: RolesAnywhere.Types.CrlDetailResponse) => void): Request<RolesAnywhere.Types.CrlDetailResponse, AWSError>;
  /**
   * Updates a profile, a list of the roles that IAM Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.  Required permissions:  rolesanywhere:UpdateProfile. 
   */
  updateProfile(params: RolesAnywhere.Types.UpdateProfileRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Updates a profile, a list of the roles that IAM Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.  Required permissions:  rolesanywhere:UpdateProfile. 
   */
  updateProfile(callback?: (err: AWSError, data: RolesAnywhere.Types.ProfileDetailResponse) => void): Request<RolesAnywhere.Types.ProfileDetailResponse, AWSError>;
  /**
   * Updates a trust anchor. You establish trust between IAM Roles Anywhere and your certificate authority (CA) by configuring a trust anchor. You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.  Required permissions:  rolesanywhere:UpdateTrustAnchor. 
   */
  updateTrustAnchor(params: RolesAnywhere.Types.UpdateTrustAnchorRequest, callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
  /**
   * Updates a trust anchor. You establish trust between IAM Roles Anywhere and your certificate authority (CA) by configuring a trust anchor. You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.  Required permissions:  rolesanywhere:UpdateTrustAnchor. 
   */
  updateTrustAnchor(callback?: (err: AWSError, data: RolesAnywhere.Types.TrustAnchorDetailResponse) => void): Request<RolesAnywhere.Types.TrustAnchorDetailResponse, AWSError>;
}
declare namespace RolesAnywhere {
  export type AmazonResourceName = string;
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export interface CreateProfileRequest {
    /**
     *  The number of seconds the vended session credentials are valid for. 
     */
    durationSeconds?: CreateProfileRequestDurationSecondsInteger;
    /**
     * Specifies whether the profile is enabled.
     */
    enabled?: Boolean;
    /**
     * A list of managed policy ARNs that apply to the vended session credentials. 
     */
    managedPolicyArns?: ManagedPolicyList;
    /**
     * The name of the profile.
     */
    name: ResourceName;
    /**
     * Specifies whether instance properties are required in temporary credential requests with this profile. 
     */
    requireInstanceProperties?: Boolean;
    /**
     * A list of IAM roles that this profile can assume in a temporary credential request.
     */
    roleArns: RoleArnList;
    /**
     * A session policy that applies to the trust boundary of the vended session credentials. 
     */
    sessionPolicy?: String;
    /**
     * The tags to attach to the profile.
     */
    tags?: TagList;
  }
  export type CreateProfileRequestDurationSecondsInteger = number;
  export interface CreateTrustAnchorRequest {
    /**
     * Specifies whether the trust anchor is enabled.
     */
    enabled?: Boolean;
    /**
     * The name of the trust anchor.
     */
    name: ResourceName;
    /**
     * A list of notification settings to be associated to the trust anchor.
     */
    notificationSettings?: NotificationSettings;
    /**
     * The trust anchor type and its related certificate data.
     */
    source: Source;
    /**
     * The tags to attach to the trust anchor.
     */
    tags?: TagList;
  }
  export type CredentialSummaries = CredentialSummary[];
  export interface CredentialSummary {
    /**
     * Indicates whether the credential is enabled.
     */
    enabled?: Boolean;
    /**
     * Indicates whether the temporary credential request was successful. 
     */
    failed?: Boolean;
    /**
     * The fully qualified domain name of the issuing certificate for the presented end-entity certificate.
     */
    issuer?: String;
    /**
     * The ISO-8601 time stamp of when the certificate was last used in a temporary credential request.
     */
    seenAt?: SyntheticTimestamp_date_time;
    /**
     * The serial number of the certificate.
     */
    serialNumber?: String;
    /**
     * The PEM-encoded data of the certificate.
     */
    x509CertificateData?: String;
  }
  export interface CrlDetail {
    /**
     * The ISO-8601 timestamp when the certificate revocation list (CRL) was created. 
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The ARN of the certificate revocation list (CRL).
     */
    crlArn?: String;
    /**
     * The state of the certificate revocation list (CRL) after a read or write operation.
     */
    crlData?: _Blob;
    /**
     * The unique identifier of the certificate revocation list (CRL).
     */
    crlId?: Uuid;
    /**
     * Indicates whether the certificate revocation list (CRL) is enabled.
     */
    enabled?: Boolean;
    /**
     * The name of the certificate revocation list (CRL).
     */
    name?: String;
    /**
     * The ARN of the TrustAnchor the certificate revocation list (CRL) will provide revocation for. 
     */
    trustAnchorArn?: String;
    /**
     * The ISO-8601 timestamp when the certificate revocation list (CRL) was last updated. 
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface CrlDetailResponse {
    /**
     * The state of the certificate revocation list (CRL) after a read or write operation.
     */
    crl: CrlDetail;
  }
  export type CrlDetails = CrlDetail[];
  export interface ImportCrlRequest {
    /**
     * The x509 v3 specified certificate revocation list (CRL).
     */
    crlData: ImportCrlRequestCrlDataBlob;
    /**
     * Specifies whether the certificate revocation list (CRL) is enabled.
     */
    enabled?: Boolean;
    /**
     * The name of the certificate revocation list (CRL).
     */
    name: ResourceName;
    /**
     * A list of tags to attach to the certificate revocation list (CRL).
     */
    tags?: TagList;
    /**
     * The ARN of the TrustAnchor the certificate revocation list (CRL) will provide revocation for.
     */
    trustAnchorArn: TrustAnchorArn;
  }
  export type ImportCrlRequestCrlDataBlob = Buffer|Uint8Array|Blob|string;
  export type InstanceProperties = InstanceProperty[];
  export interface InstanceProperty {
    /**
     * Indicates whether the temporary credential request was successful. 
     */
    failed?: Boolean;
    /**
     * A list of instanceProperty objects. 
     */
    properties?: InstancePropertyMap;
    /**
     * The ISO-8601 time stamp of when the certificate was last used in a temporary credential request.
     */
    seenAt?: SyntheticTimestamp_date_time;
  }
  export type InstancePropertyMap = {[key: string]: InstancePropertyMapValueString};
  export type InstancePropertyMapKeyString = string;
  export type InstancePropertyMapValueString = string;
  export type Integer = number;
  export interface ListCrlsResponse {
    /**
     * A list of certificate revocation lists (CRL). 
     */
    crls?: CrlDetails;
    /**
     * A token that indicates where the output should continue from, if a previous request did not show all results. To get the next results, make the request again with this value.
     */
    nextToken?: String;
  }
  export interface ListProfilesResponse {
    /**
     * A token that indicates where the output should continue from, if a previous request did not show all results. To get the next results, make the request again with this value.
     */
    nextToken?: String;
    /**
     * A list of profiles.
     */
    profiles?: ProfileDetails;
  }
  export interface ListRequest {
    /**
     * A token that indicates where the output should continue from, if a previous request did not show all results. To get the next results, make the request again with this value.
     */
    nextToken?: ListRequestNextTokenString;
    /**
     * The number of resources in the paginated list. 
     */
    pageSize?: Integer;
  }
  export type ListRequestNextTokenString = string;
  export interface ListSubjectsResponse {
    /**
     * A token that indicates where the output should continue from, if a previous request did not show all results. To get the next results, make the request again with this value.
     */
    nextToken?: String;
    /**
     * A list of subjects.
     */
    subjects?: SubjectSummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags attached to the resource.
     */
    tags?: TagList;
  }
  export interface ListTrustAnchorsResponse {
    /**
     * A token that indicates where the output should continue from, if a previous request did not show all results. To get the next results, make the request again with this value.
     */
    nextToken?: String;
    /**
     * A list of trust anchors.
     */
    trustAnchors?: TrustAnchorDetails;
  }
  export type ManagedPolicyList = ManagedPolicyListMemberString[];
  export type ManagedPolicyListMemberString = string;
  export type NotificationChannel = "ALL"|string;
  export type NotificationEvent = "CA_CERTIFICATE_EXPIRY"|"END_ENTITY_CERTIFICATE_EXPIRY"|string;
  export interface NotificationSetting {
    /**
     * The specified channel of notification. IAM Roles Anywhere uses CloudWatch metrics, EventBridge, and Health Dashboard to notify for an event.  In the absence of a specific channel, IAM Roles Anywhere applies this setting to 'ALL' channels. 
     */
    channel?: NotificationChannel;
    /**
     * Indicates whether the notification setting is enabled.
     */
    enabled: Boolean;
    /**
     * The event to which this notification setting is applied.
     */
    event: NotificationEvent;
    /**
     * The number of days before a notification event. This value is required for a notification setting that is enabled.
     */
    threshold?: NotificationSettingThresholdInteger;
  }
  export interface NotificationSettingDetail {
    /**
     * The specified channel of notification. IAM Roles Anywhere uses CloudWatch metrics, EventBridge, and Health Dashboard to notify for an event.  In the absence of a specific channel, IAM Roles Anywhere applies this setting to 'ALL' channels. 
     */
    channel?: NotificationChannel;
    /**
     * The principal that configured the notification setting. For default settings configured by IAM Roles Anywhere, the value is rolesanywhere.amazonaws.com, and for customized notifications settings, it is the respective account ID. 
     */
    configuredBy?: NotificationSettingDetailConfiguredByString;
    /**
     * Indicates whether the notification setting is enabled.
     */
    enabled: Boolean;
    /**
     * The event to which this notification setting is applied.
     */
    event: NotificationEvent;
    /**
     * The number of days before a notification event.
     */
    threshold?: NotificationSettingDetailThresholdInteger;
  }
  export type NotificationSettingDetailConfiguredByString = string;
  export type NotificationSettingDetailThresholdInteger = number;
  export type NotificationSettingDetails = NotificationSettingDetail[];
  export interface NotificationSettingKey {
    /**
     * The specified channel of notification.
     */
    channel?: NotificationChannel;
    /**
     * The notification setting event to reset.
     */
    event: NotificationEvent;
  }
  export type NotificationSettingKeys = NotificationSettingKey[];
  export type NotificationSettingThresholdInteger = number;
  export type NotificationSettings = NotificationSetting[];
  export type ProfileArn = string;
  export interface ProfileDetail {
    /**
     * The ISO-8601 timestamp when the profile was created. 
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon Web Services account that created the profile.
     */
    createdBy?: String;
    /**
     *  The number of seconds the vended session credentials are valid for. 
     */
    durationSeconds?: Integer;
    /**
     * Indicates whether the profile is enabled.
     */
    enabled?: Boolean;
    /**
     * A list of managed policy ARNs that apply to the vended session credentials. 
     */
    managedPolicyArns?: ManagedPolicyList;
    /**
     * The name of the profile.
     */
    name?: ResourceName;
    /**
     * The ARN of the profile.
     */
    profileArn?: ProfileArn;
    /**
     * The unique identifier of the profile.
     */
    profileId?: Uuid;
    /**
     * Specifies whether instance properties are required in temporary credential requests with this profile. 
     */
    requireInstanceProperties?: Boolean;
    /**
     * A list of IAM roles that this profile can assume in a temporary credential request.
     */
    roleArns?: RoleArnList;
    /**
     * A session policy that applies to the trust boundary of the vended session credentials. 
     */
    sessionPolicy?: String;
    /**
     * The ISO-8601 timestamp when the profile was last updated. 
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface ProfileDetailResponse {
    /**
     * The state of the profile after a read or write operation.
     */
    profile?: ProfileDetail;
  }
  export type ProfileDetails = ProfileDetail[];
  export interface PutNotificationSettingsRequest {
    /**
     * A list of notification settings to be associated to the trust anchor.
     */
    notificationSettings: NotificationSettings;
    /**
     * The unique identifier of the trust anchor.
     */
    trustAnchorId: Uuid;
  }
  export interface PutNotificationSettingsResponse {
    trustAnchor: TrustAnchorDetail;
  }
  export interface ResetNotificationSettingsRequest {
    /**
     * A list of notification setting keys to reset. A notification setting key includes the event and the channel. 
     */
    notificationSettingKeys: NotificationSettingKeys;
    /**
     * The unique identifier of the trust anchor.
     */
    trustAnchorId: Uuid;
  }
  export interface ResetNotificationSettingsResponse {
    trustAnchor: TrustAnchorDetail;
  }
  export type ResourceName = string;
  export type RoleArn = string;
  export type RoleArnList = RoleArn[];
  export interface ScalarCrlRequest {
    /**
     * The unique identifier of the certificate revocation list (CRL).
     */
    crlId: Uuid;
  }
  export interface ScalarProfileRequest {
    /**
     * The unique identifier of the profile.
     */
    profileId: Uuid;
  }
  export interface ScalarSubjectRequest {
    /**
     * The unique identifier of the subject. 
     */
    subjectId: Uuid;
  }
  export interface ScalarTrustAnchorRequest {
    /**
     * The unique identifier of the trust anchor.
     */
    trustAnchorId: Uuid;
  }
  export interface Source {
    /**
     * The data field of the trust anchor depending on its type. 
     */
    sourceData?: SourceData;
    /**
     * The type of the trust anchor. 
     */
    sourceType?: TrustAnchorType;
  }
  export interface SourceData {
    /**
     *  The root certificate of the Private Certificate Authority specified by this ARN is used in trust validation for temporary credential requests. Included for trust anchors of type AWS_ACM_PCA. 
     */
    acmPcaArn?: String;
    /**
     * The PEM-encoded data for the certificate anchor. Included for trust anchors of type CERTIFICATE_BUNDLE. 
     */
    x509CertificateData?: SourceDataX509CertificateDataString;
  }
  export type SourceDataX509CertificateDataString = string;
  export type String = string;
  export interface SubjectDetail {
    /**
     * The ISO-8601 timestamp when the subject was created. 
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The temporary session credentials vended at the last authenticating call with this subject.
     */
    credentials?: CredentialSummaries;
    /**
     * The enabled status of the subject.
     */
    enabled?: Boolean;
    /**
     * The specified instance properties associated with the request.
     */
    instanceProperties?: InstanceProperties;
    /**
     * The ISO-8601 timestamp of the last time this subject requested temporary session credentials.
     */
    lastSeenAt?: SyntheticTimestamp_date_time;
    /**
     * The ARN of the resource.
     */
    subjectArn?: String;
    /**
     * The id of the resource
     */
    subjectId?: Uuid;
    /**
     * The ISO-8601 timestamp when the subject was last updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The x509 principal identifier of the authenticating certificate.
     */
    x509Subject?: String;
  }
  export interface SubjectDetailResponse {
    /**
     * The state of the subject after a read or write operation.
     */
    subject?: SubjectDetail;
  }
  export type SubjectSummaries = SubjectSummary[];
  export interface SubjectSummary {
    /**
     * The ISO-8601 time stamp of when the certificate was first used in a temporary credential request.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The enabled status of the subject. 
     */
    enabled?: Boolean;
    /**
     * The ISO-8601 time stamp of when the certificate was last used in a temporary credential request.
     */
    lastSeenAt?: SyntheticTimestamp_date_time;
    /**
     * The ARN of the resource.
     */
    subjectArn?: String;
    /**
     * The id of the resource.
     */
    subjectId?: Uuid;
    /**
     * The ISO-8601 timestamp when the subject was last updated. 
     */
    updatedAt?: SyntheticTimestamp_date_time;
    /**
     * The x509 principal identifier of the authenticating certificate.
     */
    x509Subject?: String;
  }
  export type SyntheticTimestamp_date_time = Date;
  export interface Tag {
    /**
     * The tag key.
     */
    key: TagKey;
    /**
     * The tag value.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * The tags to attach to the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TrustAnchorArn = string;
  export interface TrustAnchorDetail {
    /**
     * The ISO-8601 timestamp when the trust anchor was created. 
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * Indicates whether the trust anchor is enabled.
     */
    enabled?: Boolean;
    /**
     * The name of the trust anchor.
     */
    name?: ResourceName;
    /**
     * A list of notification settings to be associated to the trust anchor.
     */
    notificationSettings?: NotificationSettingDetails;
    /**
     * The trust anchor type and its related certificate data.
     */
    source?: Source;
    /**
     * The ARN of the trust anchor.
     */
    trustAnchorArn?: String;
    /**
     * The unique identifier of the trust anchor.
     */
    trustAnchorId?: Uuid;
    /**
     * The ISO-8601 timestamp when the trust anchor was last updated. 
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export interface TrustAnchorDetailResponse {
    /**
     * The state of the trust anchor after a read or write operation. 
     */
    trustAnchor: TrustAnchorDetail;
  }
  export type TrustAnchorDetails = TrustAnchorDetail[];
  export type TrustAnchorType = "AWS_ACM_PCA"|"CERTIFICATE_BUNDLE"|"SELF_SIGNED_REPOSITORY"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: AmazonResourceName;
    /**
     * A list of keys. Tag keys are the unique identifiers of tags. 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateCrlRequest {
    /**
     * The x509 v3 specified certificate revocation list (CRL).
     */
    crlData?: UpdateCrlRequestCrlDataBlob;
    /**
     * The unique identifier of the certificate revocation list (CRL).
     */
    crlId: Uuid;
    /**
     * The name of the Crl.
     */
    name?: ResourceName;
  }
  export type UpdateCrlRequestCrlDataBlob = Buffer|Uint8Array|Blob|string;
  export interface UpdateProfileRequest {
    /**
     *  The number of seconds the vended session credentials are valid for. 
     */
    durationSeconds?: UpdateProfileRequestDurationSecondsInteger;
    /**
     * A list of managed policy ARNs that apply to the vended session credentials. 
     */
    managedPolicyArns?: ManagedPolicyList;
    /**
     * The name of the profile.
     */
    name?: ResourceName;
    /**
     * The unique identifier of the profile.
     */
    profileId: Uuid;
    /**
     * A list of IAM roles that this profile can assume in a temporary credential request.
     */
    roleArns?: RoleArnList;
    /**
     * A session policy that applies to the trust boundary of the vended session credentials. 
     */
    sessionPolicy?: UpdateProfileRequestSessionPolicyString;
  }
  export type UpdateProfileRequestDurationSecondsInteger = number;
  export type UpdateProfileRequestSessionPolicyString = string;
  export interface UpdateTrustAnchorRequest {
    /**
     * The name of the trust anchor.
     */
    name?: ResourceName;
    /**
     * The trust anchor type and its related certificate data.
     */
    source?: Source;
    /**
     * The unique identifier of the trust anchor.
     */
    trustAnchorId: Uuid;
  }
  export type Uuid = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the RolesAnywhere client.
   */
  export import Types = RolesAnywhere;
}
export = RolesAnywhere;
