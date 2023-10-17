import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class WorkSpacesWeb extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: WorkSpacesWeb.Types.ClientConfiguration)
  config: Config & WorkSpacesWeb.Types.ClientConfiguration;
  /**
   * Associates a browser settings resource with a web portal.
   */
  associateBrowserSettings(params: WorkSpacesWeb.Types.AssociateBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateBrowserSettingsResponse, AWSError>;
  /**
   * Associates a browser settings resource with a web portal.
   */
  associateBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateBrowserSettingsResponse, AWSError>;
  /**
   * Associates an IP access settings resource with a web portal.
   */
  associateIpAccessSettings(params: WorkSpacesWeb.Types.AssociateIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateIpAccessSettingsResponse, AWSError>;
  /**
   * Associates an IP access settings resource with a web portal.
   */
  associateIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateIpAccessSettingsResponse, AWSError>;
  /**
   * Associates a network settings resource with a web portal.
   */
  associateNetworkSettings(params: WorkSpacesWeb.Types.AssociateNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateNetworkSettingsResponse, AWSError>;
  /**
   * Associates a network settings resource with a web portal.
   */
  associateNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateNetworkSettingsResponse, AWSError>;
  /**
   * Associates a trust store with a web portal.
   */
  associateTrustStore(params: WorkSpacesWeb.Types.AssociateTrustStoreRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.AssociateTrustStoreResponse, AWSError>;
  /**
   * Associates a trust store with a web portal.
   */
  associateTrustStore(callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.AssociateTrustStoreResponse, AWSError>;
  /**
   * Associates a user access logging settings resource with a web portal.
   */
  associateUserAccessLoggingSettings(params: WorkSpacesWeb.Types.AssociateUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Associates a user access logging settings resource with a web portal.
   */
  associateUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Associates a user settings resource with a web portal.
   */
  associateUserSettings(params: WorkSpacesWeb.Types.AssociateUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateUserSettingsResponse, AWSError>;
  /**
   * Associates a user settings resource with a web portal.
   */
  associateUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.AssociateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.AssociateUserSettingsResponse, AWSError>;
  /**
   * Creates a browser settings resource that can be associated with a web portal. Once associated with a web portal, browser settings control how the browser will behave once a user starts a streaming session for the web portal. 
   */
  createBrowserSettings(params: WorkSpacesWeb.Types.CreateBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateBrowserSettingsResponse, AWSError>;
  /**
   * Creates a browser settings resource that can be associated with a web portal. Once associated with a web portal, browser settings control how the browser will behave once a user starts a streaming session for the web portal. 
   */
  createBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateBrowserSettingsResponse, AWSError>;
  /**
   * Creates an identity provider resource that is then associated with a web portal.
   */
  createIdentityProvider(params: WorkSpacesWeb.Types.CreateIdentityProviderRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.CreateIdentityProviderResponse, AWSError>;
  /**
   * Creates an identity provider resource that is then associated with a web portal.
   */
  createIdentityProvider(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.CreateIdentityProviderResponse, AWSError>;
  /**
   * Creates an IP access settings resource that can be associated with a web portal.
   */
  createIpAccessSettings(params: WorkSpacesWeb.Types.CreateIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateIpAccessSettingsResponse, AWSError>;
  /**
   * Creates an IP access settings resource that can be associated with a web portal.
   */
  createIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateIpAccessSettingsResponse, AWSError>;
  /**
   * Creates a network settings resource that can be associated with a web portal. Once associated with a web portal, network settings define how streaming instances will connect with your specified VPC. 
   */
  createNetworkSettings(params: WorkSpacesWeb.Types.CreateNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateNetworkSettingsResponse, AWSError>;
  /**
   * Creates a network settings resource that can be associated with a web portal. Once associated with a web portal, network settings define how streaming instances will connect with your specified VPC. 
   */
  createNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateNetworkSettingsResponse, AWSError>;
  /**
   * Creates a web portal.
   */
  createPortal(params: WorkSpacesWeb.Types.CreatePortalRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreatePortalResponse) => void): Request<WorkSpacesWeb.Types.CreatePortalResponse, AWSError>;
  /**
   * Creates a web portal.
   */
  createPortal(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreatePortalResponse) => void): Request<WorkSpacesWeb.Types.CreatePortalResponse, AWSError>;
  /**
   * Creates a trust store that can be associated with a web portal. A trust store contains certificate authority (CA) certificates. Once associated with a web portal, the browser in a streaming session will recognize certificates that have been issued using any of the CAs in the trust store. If your organization has internal websites that use certificates issued by private CAs, you should add the private CA certificate to the trust store. 
   */
  createTrustStore(params: WorkSpacesWeb.Types.CreateTrustStoreRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.CreateTrustStoreResponse, AWSError>;
  /**
   * Creates a trust store that can be associated with a web portal. A trust store contains certificate authority (CA) certificates. Once associated with a web portal, the browser in a streaming session will recognize certificates that have been issued using any of the CAs in the trust store. If your organization has internal websites that use certificates issued by private CAs, you should add the private CA certificate to the trust store. 
   */
  createTrustStore(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.CreateTrustStoreResponse, AWSError>;
  /**
   * Creates a user access logging settings resource that can be associated with a web portal.
   */
  createUserAccessLoggingSettings(params: WorkSpacesWeb.Types.CreateUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Creates a user access logging settings resource that can be associated with a web portal.
   */
  createUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Creates a user settings resource that can be associated with a web portal. Once associated with a web portal, user settings control how users can transfer data between a streaming session and the their local devices. 
   */
  createUserSettings(params: WorkSpacesWeb.Types.CreateUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateUserSettingsResponse, AWSError>;
  /**
   * Creates a user settings resource that can be associated with a web portal. Once associated with a web portal, user settings control how users can transfer data between a streaming session and the their local devices. 
   */
  createUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.CreateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.CreateUserSettingsResponse, AWSError>;
  /**
   * Deletes browser settings.
   */
  deleteBrowserSettings(params: WorkSpacesWeb.Types.DeleteBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteBrowserSettingsResponse, AWSError>;
  /**
   * Deletes browser settings.
   */
  deleteBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteBrowserSettingsResponse, AWSError>;
  /**
   * Deletes the identity provider.
   */
  deleteIdentityProvider(params: WorkSpacesWeb.Types.DeleteIdentityProviderRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.DeleteIdentityProviderResponse, AWSError>;
  /**
   * Deletes the identity provider.
   */
  deleteIdentityProvider(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.DeleteIdentityProviderResponse, AWSError>;
  /**
   * Deletes IP access settings.
   */
  deleteIpAccessSettings(params: WorkSpacesWeb.Types.DeleteIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteIpAccessSettingsResponse, AWSError>;
  /**
   * Deletes IP access settings.
   */
  deleteIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteIpAccessSettingsResponse, AWSError>;
  /**
   * Deletes network settings.
   */
  deleteNetworkSettings(params: WorkSpacesWeb.Types.DeleteNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteNetworkSettingsResponse, AWSError>;
  /**
   * Deletes network settings.
   */
  deleteNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteNetworkSettingsResponse, AWSError>;
  /**
   * Deletes a web portal.
   */
  deletePortal(params: WorkSpacesWeb.Types.DeletePortalRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeletePortalResponse) => void): Request<WorkSpacesWeb.Types.DeletePortalResponse, AWSError>;
  /**
   * Deletes a web portal.
   */
  deletePortal(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeletePortalResponse) => void): Request<WorkSpacesWeb.Types.DeletePortalResponse, AWSError>;
  /**
   * Deletes the trust store.
   */
  deleteTrustStore(params: WorkSpacesWeb.Types.DeleteTrustStoreRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.DeleteTrustStoreResponse, AWSError>;
  /**
   * Deletes the trust store.
   */
  deleteTrustStore(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.DeleteTrustStoreResponse, AWSError>;
  /**
   * Deletes user access logging settings.
   */
  deleteUserAccessLoggingSettings(params: WorkSpacesWeb.Types.DeleteUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Deletes user access logging settings.
   */
  deleteUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Deletes user settings.
   */
  deleteUserSettings(params: WorkSpacesWeb.Types.DeleteUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteUserSettingsResponse, AWSError>;
  /**
   * Deletes user settings.
   */
  deleteUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DeleteUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DeleteUserSettingsResponse, AWSError>;
  /**
   * Disassociates browser settings from a web portal.
   */
  disassociateBrowserSettings(params: WorkSpacesWeb.Types.DisassociateBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateBrowserSettingsResponse, AWSError>;
  /**
   * Disassociates browser settings from a web portal.
   */
  disassociateBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateBrowserSettingsResponse, AWSError>;
  /**
   * Disassociates IP access settings from a web portal.
   */
  disassociateIpAccessSettings(params: WorkSpacesWeb.Types.DisassociateIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateIpAccessSettingsResponse, AWSError>;
  /**
   * Disassociates IP access settings from a web portal.
   */
  disassociateIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateIpAccessSettingsResponse, AWSError>;
  /**
   * Disassociates network settings from a web portal.
   */
  disassociateNetworkSettings(params: WorkSpacesWeb.Types.DisassociateNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateNetworkSettingsResponse, AWSError>;
  /**
   * Disassociates network settings from a web portal.
   */
  disassociateNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateNetworkSettingsResponse, AWSError>;
  /**
   * Disassociates a trust store from a web portal.
   */
  disassociateTrustStore(params: WorkSpacesWeb.Types.DisassociateTrustStoreRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.DisassociateTrustStoreResponse, AWSError>;
  /**
   * Disassociates a trust store from a web portal.
   */
  disassociateTrustStore(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.DisassociateTrustStoreResponse, AWSError>;
  /**
   * Disassociates user access logging settings from a web portal.
   */
  disassociateUserAccessLoggingSettings(params: WorkSpacesWeb.Types.DisassociateUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Disassociates user access logging settings from a web portal.
   */
  disassociateUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Disassociates user settings from a web portal.
   */
  disassociateUserSettings(params: WorkSpacesWeb.Types.DisassociateUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateUserSettingsResponse, AWSError>;
  /**
   * Disassociates user settings from a web portal.
   */
  disassociateUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.DisassociateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.DisassociateUserSettingsResponse, AWSError>;
  /**
   * Gets browser settings.
   */
  getBrowserSettings(params: WorkSpacesWeb.Types.GetBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetBrowserSettingsResponse, AWSError>;
  /**
   * Gets browser settings.
   */
  getBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetBrowserSettingsResponse, AWSError>;
  /**
   * Gets the identity provider.
   */
  getIdentityProvider(params: WorkSpacesWeb.Types.GetIdentityProviderRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.GetIdentityProviderResponse, AWSError>;
  /**
   * Gets the identity provider.
   */
  getIdentityProvider(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.GetIdentityProviderResponse, AWSError>;
  /**
   * Gets the IP access settings.
   */
  getIpAccessSettings(params: WorkSpacesWeb.Types.GetIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetIpAccessSettingsResponse, AWSError>;
  /**
   * Gets the IP access settings.
   */
  getIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetIpAccessSettingsResponse, AWSError>;
  /**
   * Gets the network settings.
   */
  getNetworkSettings(params: WorkSpacesWeb.Types.GetNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetNetworkSettingsResponse, AWSError>;
  /**
   * Gets the network settings.
   */
  getNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetNetworkSettingsResponse, AWSError>;
  /**
   * Gets the web portal.
   */
  getPortal(params: WorkSpacesWeb.Types.GetPortalRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetPortalResponse) => void): Request<WorkSpacesWeb.Types.GetPortalResponse, AWSError>;
  /**
   * Gets the web portal.
   */
  getPortal(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetPortalResponse) => void): Request<WorkSpacesWeb.Types.GetPortalResponse, AWSError>;
  /**
   * Gets the service provider metadata.
   */
  getPortalServiceProviderMetadata(params: WorkSpacesWeb.Types.GetPortalServiceProviderMetadataRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetPortalServiceProviderMetadataResponse) => void): Request<WorkSpacesWeb.Types.GetPortalServiceProviderMetadataResponse, AWSError>;
  /**
   * Gets the service provider metadata.
   */
  getPortalServiceProviderMetadata(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetPortalServiceProviderMetadataResponse) => void): Request<WorkSpacesWeb.Types.GetPortalServiceProviderMetadataResponse, AWSError>;
  /**
   * Gets the trust store.
   */
  getTrustStore(params: WorkSpacesWeb.Types.GetTrustStoreRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.GetTrustStoreResponse, AWSError>;
  /**
   * Gets the trust store.
   */
  getTrustStore(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.GetTrustStoreResponse, AWSError>;
  /**
   * Gets the trust store certificate.
   */
  getTrustStoreCertificate(params: WorkSpacesWeb.Types.GetTrustStoreCertificateRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetTrustStoreCertificateResponse) => void): Request<WorkSpacesWeb.Types.GetTrustStoreCertificateResponse, AWSError>;
  /**
   * Gets the trust store certificate.
   */
  getTrustStoreCertificate(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetTrustStoreCertificateResponse) => void): Request<WorkSpacesWeb.Types.GetTrustStoreCertificateResponse, AWSError>;
  /**
   * Gets user access logging settings.
   */
  getUserAccessLoggingSettings(params: WorkSpacesWeb.Types.GetUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Gets user access logging settings.
   */
  getUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Gets user settings.
   */
  getUserSettings(params: WorkSpacesWeb.Types.GetUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetUserSettingsResponse, AWSError>;
  /**
   * Gets user settings.
   */
  getUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.GetUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.GetUserSettingsResponse, AWSError>;
  /**
   * Retrieves a list of browser settings.
   */
  listBrowserSettings(params: WorkSpacesWeb.Types.ListBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListBrowserSettingsResponse, AWSError>;
  /**
   * Retrieves a list of browser settings.
   */
  listBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListBrowserSettingsResponse, AWSError>;
  /**
   * Retrieves a list of identity providers for a specific web portal.
   */
  listIdentityProviders(params: WorkSpacesWeb.Types.ListIdentityProvidersRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListIdentityProvidersResponse) => void): Request<WorkSpacesWeb.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Retrieves a list of identity providers for a specific web portal.
   */
  listIdentityProviders(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListIdentityProvidersResponse) => void): Request<WorkSpacesWeb.Types.ListIdentityProvidersResponse, AWSError>;
  /**
   * Retrieves a list of IP access settings.
   */
  listIpAccessSettings(params: WorkSpacesWeb.Types.ListIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListIpAccessSettingsResponse, AWSError>;
  /**
   * Retrieves a list of IP access settings.
   */
  listIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListIpAccessSettingsResponse, AWSError>;
  /**
   * Retrieves a list of network settings.
   */
  listNetworkSettings(params: WorkSpacesWeb.Types.ListNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListNetworkSettingsResponse, AWSError>;
  /**
   * Retrieves a list of network settings.
   */
  listNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListNetworkSettingsResponse, AWSError>;
  /**
   * Retrieves a list or web portals.
   */
  listPortals(params: WorkSpacesWeb.Types.ListPortalsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListPortalsResponse) => void): Request<WorkSpacesWeb.Types.ListPortalsResponse, AWSError>;
  /**
   * Retrieves a list or web portals.
   */
  listPortals(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListPortalsResponse) => void): Request<WorkSpacesWeb.Types.ListPortalsResponse, AWSError>;
  /**
   * Retrieves a list of tags for a resource.
   */
  listTagsForResource(params: WorkSpacesWeb.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListTagsForResourceResponse) => void): Request<WorkSpacesWeb.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListTagsForResourceResponse) => void): Request<WorkSpacesWeb.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of trust store certificates.
   */
  listTrustStoreCertificates(params: WorkSpacesWeb.Types.ListTrustStoreCertificatesRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListTrustStoreCertificatesResponse) => void): Request<WorkSpacesWeb.Types.ListTrustStoreCertificatesResponse, AWSError>;
  /**
   * Retrieves a list of trust store certificates.
   */
  listTrustStoreCertificates(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListTrustStoreCertificatesResponse) => void): Request<WorkSpacesWeb.Types.ListTrustStoreCertificatesResponse, AWSError>;
  /**
   * Retrieves a list of trust stores.
   */
  listTrustStores(params: WorkSpacesWeb.Types.ListTrustStoresRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListTrustStoresResponse) => void): Request<WorkSpacesWeb.Types.ListTrustStoresResponse, AWSError>;
  /**
   * Retrieves a list of trust stores.
   */
  listTrustStores(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListTrustStoresResponse) => void): Request<WorkSpacesWeb.Types.ListTrustStoresResponse, AWSError>;
  /**
   * Retrieves a list of user access logging settings.
   */
  listUserAccessLoggingSettings(params: WorkSpacesWeb.Types.ListUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Retrieves a list of user access logging settings.
   */
  listUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Retrieves a list of user settings.
   */
  listUserSettings(params: WorkSpacesWeb.Types.ListUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListUserSettingsResponse, AWSError>;
  /**
   * Retrieves a list of user settings.
   */
  listUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.ListUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.ListUserSettingsResponse, AWSError>;
  /**
   * Adds or overwrites one or more tags for the specified resource.
   */
  tagResource(params: WorkSpacesWeb.Types.TagResourceRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.TagResourceResponse) => void): Request<WorkSpacesWeb.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or overwrites one or more tags for the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: WorkSpacesWeb.Types.TagResourceResponse) => void): Request<WorkSpacesWeb.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(params: WorkSpacesWeb.Types.UntagResourceRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UntagResourceResponse) => void): Request<WorkSpacesWeb.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UntagResourceResponse) => void): Request<WorkSpacesWeb.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates browser settings.
   */
  updateBrowserSettings(params: WorkSpacesWeb.Types.UpdateBrowserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateBrowserSettingsResponse, AWSError>;
  /**
   * Updates browser settings.
   */
  updateBrowserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateBrowserSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateBrowserSettingsResponse, AWSError>;
  /**
   * Updates the identity provider. 
   */
  updateIdentityProvider(params: WorkSpacesWeb.Types.UpdateIdentityProviderRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.UpdateIdentityProviderResponse, AWSError>;
  /**
   * Updates the identity provider. 
   */
  updateIdentityProvider(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateIdentityProviderResponse) => void): Request<WorkSpacesWeb.Types.UpdateIdentityProviderResponse, AWSError>;
  /**
   * Updates IP access settings.
   */
  updateIpAccessSettings(params: WorkSpacesWeb.Types.UpdateIpAccessSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateIpAccessSettingsResponse, AWSError>;
  /**
   * Updates IP access settings.
   */
  updateIpAccessSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateIpAccessSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateIpAccessSettingsResponse, AWSError>;
  /**
   * Updates network settings.
   */
  updateNetworkSettings(params: WorkSpacesWeb.Types.UpdateNetworkSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateNetworkSettingsResponse, AWSError>;
  /**
   * Updates network settings.
   */
  updateNetworkSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateNetworkSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateNetworkSettingsResponse, AWSError>;
  /**
   * Updates a web portal.
   */
  updatePortal(params: WorkSpacesWeb.Types.UpdatePortalRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdatePortalResponse) => void): Request<WorkSpacesWeb.Types.UpdatePortalResponse, AWSError>;
  /**
   * Updates a web portal.
   */
  updatePortal(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdatePortalResponse) => void): Request<WorkSpacesWeb.Types.UpdatePortalResponse, AWSError>;
  /**
   * Updates the trust store.
   */
  updateTrustStore(params: WorkSpacesWeb.Types.UpdateTrustStoreRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.UpdateTrustStoreResponse, AWSError>;
  /**
   * Updates the trust store.
   */
  updateTrustStore(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateTrustStoreResponse) => void): Request<WorkSpacesWeb.Types.UpdateTrustStoreResponse, AWSError>;
  /**
   * Updates the user access logging settings.
   */
  updateUserAccessLoggingSettings(params: WorkSpacesWeb.Types.UpdateUserAccessLoggingSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Updates the user access logging settings.
   */
  updateUserAccessLoggingSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateUserAccessLoggingSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateUserAccessLoggingSettingsResponse, AWSError>;
  /**
   * Updates the user settings.
   */
  updateUserSettings(params: WorkSpacesWeb.Types.UpdateUserSettingsRequest, callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateUserSettingsResponse, AWSError>;
  /**
   * Updates the user settings.
   */
  updateUserSettings(callback?: (err: AWSError, data: WorkSpacesWeb.Types.UpdateUserSettingsResponse) => void): Request<WorkSpacesWeb.Types.UpdateUserSettingsResponse, AWSError>;
}
declare namespace WorkSpacesWeb {
  export type ARN = string;
  export type ArnList = ARN[];
  export interface AssociateBrowserSettingsRequest {
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface AssociateBrowserSettingsResponse {
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface AssociateIpAccessSettingsRequest {
    /**
     * The ARN of the IP access settings.
     */
    ipAccessSettingsArn: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface AssociateIpAccessSettingsResponse {
    /**
     * The ARN of the IP access settings resource.
     */
    ipAccessSettingsArn: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface AssociateNetworkSettingsRequest {
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface AssociateNetworkSettingsResponse {
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface AssociateTrustStoreRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface AssociateTrustStoreResponse {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface AssociateUserAccessLoggingSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface AssociateUserAccessLoggingSettingsResponse {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface AssociateUserSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export interface AssociateUserSettingsResponse {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export type AuthenticationType = "Standard"|"IAM_Identity_Center"|string;
  export type BrowserPolicy = string;
  export interface BrowserSettings {
    /**
     * A list of web portal ARNs that this browser settings is associated with.
     */
    associatedPortalArns?: ArnList;
    /**
     * A JSON string containing Chrome Enterprise policies that will be applied to all streaming sessions.
     */
    browserPolicy?: BrowserPolicy;
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
  }
  export type BrowserSettingsList = BrowserSettingsSummary[];
  export interface BrowserSettingsSummary {
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
  }
  export type BrowserType = "Chrome"|string;
  export interface Certificate {
    /**
     * The body of the certificate.
     */
    body?: CertificateAuthorityBody;
    /**
     * The entity that issued the certificate.
     */
    issuer?: CertificatePrincipal;
    /**
     * The certificate is not valid after this date.
     */
    notValidAfter?: Timestamp;
    /**
     * The certificate is not valid before this date.
     */
    notValidBefore?: Timestamp;
    /**
     * The entity the certificate belongs to.
     */
    subject?: CertificatePrincipal;
    /**
     * A hexadecimal identifier for the certificate.
     */
    thumbprint?: CertificateThumbprint;
  }
  export type CertificateAuthorityBody = Buffer|Uint8Array|Blob|string;
  export type CertificateList = CertificateAuthorityBody[];
  export type CertificatePrincipal = string;
  export interface CertificateSummary {
    /**
     * The entity that issued the certificate.
     */
    issuer?: CertificatePrincipal;
    /**
     * The certificate is not valid after this date.
     */
    notValidAfter?: Timestamp;
    /**
     * The certificate is not valid before this date.
     */
    notValidBefore?: Timestamp;
    /**
     * The entity the certificate belongs to.
     */
    subject?: CertificatePrincipal;
    /**
     * A hexadecimal identifier for the certificate.
     */
    thumbprint?: CertificateThumbprint;
  }
  export type CertificateSummaryList = CertificateSummary[];
  export type CertificateThumbprint = string;
  export type CertificateThumbprintList = CertificateThumbprint[];
  export type ClientToken = string;
  export type CookieDomain = string;
  export type CookieName = string;
  export type CookiePath = string;
  export interface CookieSpecification {
    /**
     * The domain of the cookie.
     */
    domain: CookieDomain;
    /**
     * The name of the cookie.
     */
    name?: CookieName;
    /**
     * The path of the cookie.
     */
    path?: CookiePath;
  }
  export type CookieSpecifications = CookieSpecification[];
  export interface CookieSynchronizationConfiguration {
    /**
     * The list of cookie specifications that are allowed to be synchronized to the remote browser.
     */
    allowlist: CookieSpecifications;
    /**
     * The list of cookie specifications that are blocked from being synchronized to the remote browser.
     */
    blocklist?: CookieSpecifications;
  }
  export interface CreateBrowserSettingsRequest {
    /**
     * Additional encryption context of the browser settings.
     */
    additionalEncryptionContext?: EncryptionContextMap;
    /**
     * A JSON string containing Chrome Enterprise policies that will be applied to all streaming sessions.
     */
    browserPolicy: BrowserPolicy;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request. If you do not specify a client token, one is automatically generated by the AWS SDK. 
     */
    clientToken?: ClientToken;
    /**
     * The custom managed key of the browser settings.
     */
    customerManagedKey?: keyArn;
    /**
     * The tags to add to the browser settings resource. A tag is a key-value pair.
     */
    tags?: TagList;
  }
  export interface CreateBrowserSettingsResponse {
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
  }
  export interface CreateIdentityProviderRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request. If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The identity provider details. The following list describes the provider detail keys for each identity provider type.    For Google and Login with Amazon:    client_id     client_secret     authorize_scopes      For Facebook:    client_id     client_secret     authorize_scopes     api_version      For Sign in with Apple:    client_id     team_id     key_id     private_key     authorize_scopes      For OIDC providers:    client_id     client_secret     attributes_request_method     oidc_issuer     authorize_scopes     authorize_url if not available from discovery URL specified by oidc_issuer key     token_url if not available from discovery URL specified by oidc_issuer key     attributes_url if not available from discovery URL specified by oidc_issuer key     jwks_uri if not available from discovery URL specified by oidc_issuer key      For SAML providers:    MetadataFile OR MetadataURL     IDPSignout (boolean) optional     
     */
    identityProviderDetails: IdentityProviderDetails;
    /**
     * The identity provider name.
     */
    identityProviderName: IdentityProviderName;
    /**
     * The identity provider type.
     */
    identityProviderType: IdentityProviderType;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface CreateIdentityProviderResponse {
    /**
     * The ARN of the identity provider.
     */
    identityProviderArn: SubresourceARN;
  }
  export interface CreateIpAccessSettingsRequest {
    /**
     * Additional encryption context of the IP access settings.
     */
    additionalEncryptionContext?: EncryptionContextMap;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The custom managed key of the IP access settings.
     */
    customerManagedKey?: keyArn;
    /**
     * The description of the IP access settings.
     */
    description?: Description;
    /**
     * The display name of the IP access settings.
     */
    displayName?: DisplayName;
    /**
     * The IP rules of the IP access settings.
     */
    ipRules: IpRuleList;
    /**
     * The tags to add to the browser settings resource. A tag is a key-value pair.
     */
    tags?: TagList;
  }
  export interface CreateIpAccessSettingsResponse {
    /**
     * The ARN of the IP access settings resource.
     */
    ipAccessSettingsArn: ARN;
  }
  export interface CreateNetworkSettingsRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * One or more security groups used to control access from streaming instances to your VPC.
     */
    securityGroupIds: SecurityGroupIdList;
    /**
     * The subnets in which network interfaces are created to connect streaming instances to your VPC. At least two of these subnets must be in different availability zones.
     */
    subnetIds: SubnetIdList;
    /**
     * The tags to add to the network settings resource. A tag is a key-value pair.
     */
    tags?: TagList;
    /**
     * The VPC that streaming instances will connect to.
     */
    vpcId: VpcId;
  }
  export interface CreateNetworkSettingsResponse {
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
  }
  export interface CreatePortalRequest {
    /**
     * The additional encryption context of the portal.
     */
    additionalEncryptionContext?: EncryptionContextMap;
    /**
     * The type of authentication integration points used when signing into the web portal. Defaults to Standard.  Standard web portals are authenticated directly through your identity provider. You need to call CreateIdentityProvider to integrate your identity provider with your web portal. User and group access to your web portal is controlled through your identity provider.  IAM_Identity_Center web portals are authenticated through AWS IAM Identity Center (successor to AWS Single Sign-On). They provide additional features, such as IdP-initiated authentication. Identity sources (including external identity provider integration), plus user and group access to your web portal, can be configured in the IAM Identity Center.
     */
    authenticationType?: AuthenticationType;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The customer managed key of the web portal.
     */
    customerManagedKey?: keyArn;
    /**
     * The name of the web portal. This is not visible to users who log into the web portal.
     */
    displayName?: DisplayName;
    /**
     * The tags to add to the web portal. A tag is a key-value pair.
     */
    tags?: TagList;
  }
  export interface CreatePortalResponse {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The endpoint URL of the web portal that users access in order to start streaming sessions.
     */
    portalEndpoint: PortalEndpoint;
  }
  export interface CreateTrustStoreRequest {
    /**
     * A list of CA certificates to be added to the trust store.
     */
    certificateList: CertificateList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The tags to add to the trust store. A tag is a key-value pair.
     */
    tags?: TagList;
  }
  export interface CreateTrustStoreResponse {
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface CreateUserAccessLoggingSettingsRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The ARN of the Kinesis stream.
     */
    kinesisStreamArn: KinesisStreamArn;
    /**
     * The tags to add to the user settings resource. A tag is a key-value pair.
     */
    tags?: TagList;
  }
  export interface CreateUserAccessLoggingSettingsResponse {
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface CreateUserSettingsRequest {
    /**
     * The additional encryption context of the user settings.
     */
    additionalEncryptionContext?: EncryptionContextMap;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser.
     */
    cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
    /**
     * Specifies whether the user can copy text from the streaming session to the local device.
     */
    copyAllowed: EnabledType;
    /**
     * The customer managed key used to encrypt sensitive information in the user settings.
     */
    customerManagedKey?: keyArn;
    /**
     * The amount of time that a streaming session remains active after users disconnect.
     */
    disconnectTimeoutInMinutes?: DisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can download files from the streaming session to the local device.
     */
    downloadAllowed: EnabledType;
    /**
     * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the disconnect timeout interval begins.
     */
    idleDisconnectTimeoutInMinutes?: IdleDisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can paste text from the local device to the streaming session.
     */
    pasteAllowed: EnabledType;
    /**
     * Specifies whether the user can print to the local device.
     */
    printAllowed: EnabledType;
    /**
     * The tags to add to the user settings resource. A tag is a key-value pair.
     */
    tags?: TagList;
    /**
     * Specifies whether the user can upload files from the local device to the streaming session.
     */
    uploadAllowed: EnabledType;
  }
  export interface CreateUserSettingsResponse {
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export interface DeleteBrowserSettingsRequest {
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
  }
  export interface DeleteBrowserSettingsResponse {
  }
  export interface DeleteIdentityProviderRequest {
    /**
     * The ARN of the identity provider.
     */
    identityProviderArn: SubresourceARN;
  }
  export interface DeleteIdentityProviderResponse {
  }
  export interface DeleteIpAccessSettingsRequest {
    /**
     * The ARN of the IP access settings.
     */
    ipAccessSettingsArn: ARN;
  }
  export interface DeleteIpAccessSettingsResponse {
  }
  export interface DeleteNetworkSettingsRequest {
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
  }
  export interface DeleteNetworkSettingsResponse {
  }
  export interface DeletePortalRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DeletePortalResponse {
  }
  export interface DeleteTrustStoreRequest {
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface DeleteTrustStoreResponse {
  }
  export interface DeleteUserAccessLoggingSettingsRequest {
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface DeleteUserAccessLoggingSettingsResponse {
  }
  export interface DeleteUserSettingsRequest {
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export interface DeleteUserSettingsResponse {
  }
  export type Description = string;
  export interface DisassociateBrowserSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DisassociateBrowserSettingsResponse {
  }
  export interface DisassociateIpAccessSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DisassociateIpAccessSettingsResponse {
  }
  export interface DisassociateNetworkSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DisassociateNetworkSettingsResponse {
  }
  export interface DisassociateTrustStoreRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DisassociateTrustStoreResponse {
  }
  export interface DisassociateUserAccessLoggingSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DisassociateUserAccessLoggingSettingsResponse {
  }
  export interface DisassociateUserSettingsRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface DisassociateUserSettingsResponse {
  }
  export type DisconnectTimeoutInMinutes = number;
  export type DisplayName = string;
  export type EnabledType = "Disabled"|"Enabled"|string;
  export type EncryptionContextMap = {[key: string]: StringType};
  export interface GetBrowserSettingsRequest {
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
  }
  export interface GetBrowserSettingsResponse {
    /**
     * The browser settings.
     */
    browserSettings?: BrowserSettings;
  }
  export interface GetIdentityProviderRequest {
    /**
     * The ARN of the identity provider.
     */
    identityProviderArn: SubresourceARN;
  }
  export interface GetIdentityProviderResponse {
    /**
     * The identity provider.
     */
    identityProvider?: IdentityProvider;
  }
  export interface GetIpAccessSettingsRequest {
    /**
     * The ARN of the IP access settings.
     */
    ipAccessSettingsArn: ARN;
  }
  export interface GetIpAccessSettingsResponse {
    /**
     * The IP access settings.
     */
    ipAccessSettings?: IpAccessSettings;
  }
  export interface GetNetworkSettingsRequest {
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
  }
  export interface GetNetworkSettingsResponse {
    /**
     * The network settings.
     */
    networkSettings?: NetworkSettings;
  }
  export interface GetPortalRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface GetPortalResponse {
    /**
     * The web portal.
     */
    portal?: Portal;
  }
  export interface GetPortalServiceProviderMetadataRequest {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface GetPortalServiceProviderMetadataResponse {
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The service provider SAML metadata.
     */
    serviceProviderSamlMetadata?: SamlMetadata;
  }
  export interface GetTrustStoreCertificateRequest {
    /**
     * The thumbprint of the trust store certificate.
     */
    thumbprint: CertificateThumbprint;
    /**
     * The ARN of the trust store certificate.
     */
    trustStoreArn: ARN;
  }
  export interface GetTrustStoreCertificateResponse {
    /**
     * The certificate of the trust store certificate.
     */
    certificate?: Certificate;
    /**
     * The ARN of the trust store certificate.
     */
    trustStoreArn: ARN;
  }
  export interface GetTrustStoreRequest {
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface GetTrustStoreResponse {
    /**
     * The trust store.
     */
    trustStore?: TrustStore;
  }
  export interface GetUserAccessLoggingSettingsRequest {
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface GetUserAccessLoggingSettingsResponse {
    /**
     * The user access logging settings.
     */
    userAccessLoggingSettings?: UserAccessLoggingSettings;
  }
  export interface GetUserSettingsRequest {
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export interface GetUserSettingsResponse {
    /**
     * The user settings.
     */
    userSettings?: UserSettings;
  }
  export interface IdentityProvider {
    /**
     * The ARN of the identity provider.
     */
    identityProviderArn: SubresourceARN;
    /**
     * The identity provider details. The following list describes the provider detail keys for each identity provider type.    For Google and Login with Amazon:    client_id     client_secret     authorize_scopes      For Facebook:    client_id     client_secret     authorize_scopes     api_version      For Sign in with Apple:    client_id     team_id     key_id     private_key     authorize_scopes      For OIDC providers:    client_id     client_secret     attributes_request_method     oidc_issuer     authorize_scopes     authorize_url if not available from discovery URL specified by oidc_issuer key     token_url if not available from discovery URL specified by oidc_issuer key     attributes_url if not available from discovery URL specified by oidc_issuer key     jwks_uri if not available from discovery URL specified by oidc_issuer key      For SAML providers:    MetadataFile OR MetadataURL     IDPSignout optional     
     */
    identityProviderDetails?: IdentityProviderDetails;
    /**
     * The identity provider name.
     */
    identityProviderName?: IdentityProviderName;
    /**
     * The identity provider type.
     */
    identityProviderType?: IdentityProviderType;
  }
  export type IdentityProviderDetails = {[key: string]: StringType};
  export type IdentityProviderList = IdentityProviderSummary[];
  export type IdentityProviderName = string;
  export interface IdentityProviderSummary {
    /**
     * The ARN of the identity provider.
     */
    identityProviderArn: SubresourceARN;
    /**
     * The identity provider name.
     */
    identityProviderName?: IdentityProviderName;
    /**
     * The identity provider type.
     */
    identityProviderType?: IdentityProviderType;
  }
  export type IdentityProviderType = "SAML"|"Facebook"|"Google"|"LoginWithAmazon"|"SignInWithApple"|"OIDC"|string;
  export type IdleDisconnectTimeoutInMinutes = number;
  export interface IpAccessSettings {
    /**
     * A list of web portal ARNs that this IP access settings resource is associated with.
     */
    associatedPortalArns?: ArnList;
    /**
     * The creation date timestamp of the IP access settings.
     */
    creationDate?: Timestamp;
    /**
     * The description of the IP access settings.
     */
    description?: Description;
    /**
     *  The display name of the IP access settings.
     */
    displayName?: DisplayName;
    /**
     * The ARN of the IP access settings resource.
     */
    ipAccessSettingsArn: ARN;
    /**
     * The IP rules of the IP access settings.
     */
    ipRules?: IpRuleList;
  }
  export type IpAccessSettingsList = IpAccessSettingsSummary[];
  export interface IpAccessSettingsSummary {
    /**
     * The creation date timestamp of the IP access settings.
     */
    creationDate?: Timestamp;
    /**
     * The description of the IP access settings.
     */
    description?: Description;
    /**
     * The display name of the IP access settings.
     */
    displayName?: DisplayName;
    /**
     * The ARN of IP access settings.
     */
    ipAccessSettingsArn: ARN;
  }
  export type IpRange = string;
  export interface IpRule {
    /**
     * The description of the IP rule.
     */
    description?: Description;
    /**
     * The IP range of the IP rule.
     */
    ipRange: IpRange;
  }
  export type IpRuleList = IpRule[];
  export type KinesisStreamArn = string;
  export interface ListBrowserSettingsRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListBrowserSettingsResponse {
    /**
     * The browser settings.
     */
    browserSettings?: BrowserSettingsList;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListIdentityProvidersRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface ListIdentityProvidersResponse {
    /**
     * The identity providers.
     */
    identityProviders?: IdentityProviderList;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListIpAccessSettingsRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListIpAccessSettingsResponse {
    /**
     * The IP access settings.
     */
    ipAccessSettings?: IpAccessSettingsList;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListNetworkSettingsRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListNetworkSettingsResponse {
    /**
     * The network settings.
     */
    networkSettings?: NetworkSettingsList;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListPortalsRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListPortalsResponse {
    /**
     * The pagination token used to retrieve the next page of results for this operation. 
     */
    nextToken?: PaginationToken;
    /**
     * The portals in the list.
     */
    portals?: PortalList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: ARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags of the resource.
     */
    tags?: TagList;
  }
  export interface ListTrustStoreCertificatesRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
    /**
     * The ARN of the trust store
     */
    trustStoreArn: ARN;
  }
  export interface ListTrustStoreCertificatesResponse {
    /**
     * The certificate list.
     */
    certificateList?: CertificateSummaryList;
    /**
     * The pagination token used to retrieve the next page of results for this operation.&gt;
     */
    nextToken?: PaginationToken;
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface ListTrustStoresRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTrustStoresResponse {
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
    /**
     * The trust stores.
     */
    trustStores?: TrustStoreSummaryList;
  }
  export interface ListUserAccessLoggingSettingsRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
  }
  export interface ListUserAccessLoggingSettingsResponse {
    /**
     * The pagination token used to retrieve the next page of results for this operation.
     */
    nextToken?: PaginationToken;
    /**
     * The user access logging settings.
     */
    userAccessLoggingSettings?: UserAccessLoggingSettingsList;
  }
  export interface ListUserSettingsRequest {
    /**
     * The maximum number of results to be included in the next page.
     */
    maxResults?: MaxResults;
    /**
     * The pagination token used to retrieve the next page of results for this operation. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListUserSettingsResponse {
    /**
     * The pagination token used to retrieve the next page of results for this operation. 
     */
    nextToken?: PaginationToken;
    /**
     * The user settings.
     */
    userSettings?: UserSettingsList;
  }
  export type MaxResults = number;
  export interface NetworkSettings {
    /**
     * A list of web portal ARNs that this network settings is associated with.
     */
    associatedPortalArns?: ArnList;
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
    /**
     * One or more security groups used to control access from streaming instances to your VPC. 
     */
    securityGroupIds?: SecurityGroupIdList;
    /**
     * The subnets in which network interfaces are created to connect streaming instances to your VPC. At least two of these subnets must be in different availability zones.
     */
    subnetIds?: SubnetIdList;
    /**
     * The VPC that streaming instances will connect to.
     */
    vpcId?: VpcId;
  }
  export type NetworkSettingsList = NetworkSettingsSummary[];
  export interface NetworkSettingsSummary {
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
    /**
     * The VPC ID of the network settings.
     */
    vpcId?: VpcId;
  }
  export type PaginationToken = string;
  export interface Portal {
    /**
     * The type of authentication integration points used when signing into the web portal. Defaults to Standard.  Standard web portals are authenticated directly through your identity provider. You need to call CreateIdentityProvider to integrate your identity provider with your web portal. User and group access to your web portal is controlled through your identity provider.  IAM_Identity_Center web portals are authenticated through AWS IAM Identity Center (successor to AWS Single Sign-On). They provide additional features, such as IdP-initiated authentication. Identity sources (including external identity provider integration), plus user and group access to your web portal, can be configured in the IAM Identity Center.
     */
    authenticationType?: AuthenticationType;
    /**
     * The ARN of the browser settings that is associated with this web portal.
     */
    browserSettingsArn?: ARN;
    /**
     * The browser that users see when using a streaming session.
     */
    browserType?: BrowserType;
    /**
     * The creation date of the web portal.
     */
    creationDate?: Timestamp;
    /**
     * The name of the web portal.
     */
    displayName?: DisplayName;
    /**
     * The ARN of the IP access settings.
     */
    ipAccessSettingsArn?: ARN;
    /**
     * The ARN of the network settings that is associated with the web portal.
     */
    networkSettingsArn?: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The endpoint URL of the web portal that users access in order to start streaming sessions.
     */
    portalEndpoint?: PortalEndpoint;
    /**
     * The status of the web portal.
     */
    portalStatus?: PortalStatus;
    /**
     * The renderer that is used in streaming sessions.
     */
    rendererType?: RendererType;
    /**
     * A message that explains why the web portal is in its current status.
     */
    statusReason?: StatusReason;
    /**
     * The ARN of the trust store that is associated with the web portal.
     */
    trustStoreArn?: ARN;
    /**
     * The ARN of the user access logging settings that is associated with the web portal.
     */
    userAccessLoggingSettingsArn?: ARN;
    /**
     * The ARN of the user settings that is associated with the web portal.
     */
    userSettingsArn?: ARN;
  }
  export type PortalEndpoint = string;
  export type PortalList = PortalSummary[];
  export type PortalStatus = "Incomplete"|"Pending"|"Active"|string;
  export interface PortalSummary {
    /**
     * The type of authentication integration points used when signing into the web portal. Defaults to Standard.  Standard web portals are authenticated directly through your identity provider. You need to call CreateIdentityProvider to integrate your identity provider with your web portal. User and group access to your web portal is controlled through your identity provider.  IAM_Identity_Center web portals are authenticated through AWS IAM Identity Center (successor to AWS Single Sign-On). They provide additional features, such as IdP-initiated authentication. Identity sources (including external identity provider integration), plus user and group access to your web portal, can be configured in the IAM Identity Center.
     */
    authenticationType?: AuthenticationType;
    /**
     * The ARN of the browser settings that is associated with the web portal.
     */
    browserSettingsArn?: ARN;
    /**
     * The browser type of the web portal.
     */
    browserType?: BrowserType;
    /**
     * The creation date of the web portal.
     */
    creationDate?: Timestamp;
    /**
     * The name of the web portal.
     */
    displayName?: DisplayName;
    /**
     * The ARN of the IP access settings.
     */
    ipAccessSettingsArn?: ARN;
    /**
     * The ARN of the network settings that is associated with the web portal.
     */
    networkSettingsArn?: ARN;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
    /**
     * The endpoint URL of the web portal that users access in order to start streaming sessions.
     */
    portalEndpoint?: PortalEndpoint;
    /**
     * The status of the web portal.
     */
    portalStatus?: PortalStatus;
    /**
     * The renderer that is used in streaming sessions.
     */
    rendererType?: RendererType;
    /**
     * The ARN of the trust that is associated with this web portal.
     */
    trustStoreArn?: ARN;
    /**
     * The ARN of the user access logging settings that is associated with the web portal.
     */
    userAccessLoggingSettingsArn?: ARN;
    /**
     * The ARN of the user settings that is associated with the web portal.
     */
    userSettingsArn?: ARN;
  }
  export type RendererType = "AppStream"|string;
  export type SamlMetadata = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIdList = SecurityGroupId[];
  export type StatusReason = string;
  export type StringType = string;
  export type SubnetId = string;
  export type SubnetIdList = SubnetId[];
  export type SubresourceARN = string;
  export interface Tag {
    /**
     * The key of the tag.
     */
    Key: TagKey;
    /**
     * The value of the tag
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token returns the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The ARN of the resource.
     */
    resourceArn: ARN;
    /**
     * The tags of the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface TrustStore {
    /**
     * A list of web portal ARNs that this trust store is associated with.
     */
    associatedPortalArns?: ArnList;
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface TrustStoreSummary {
    /**
     * The ARN of the trust store.
     */
    trustStoreArn?: ARN;
  }
  export type TrustStoreSummaryList = TrustStoreSummary[];
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: ARN;
    /**
     * The list of tag keys to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateBrowserSettingsRequest {
    /**
     * A JSON string containing Chrome Enterprise policies that will be applied to all streaming sessions. 
     */
    browserPolicy?: BrowserPolicy;
    /**
     * The ARN of the browser settings.
     */
    browserSettingsArn: ARN;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
  }
  export interface UpdateBrowserSettingsResponse {
    /**
     * The browser settings.
     */
    browserSettings: BrowserSettings;
  }
  export interface UpdateIdentityProviderRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The ARN of the identity provider.
     */
    identityProviderArn: SubresourceARN;
    /**
     * The details of the identity provider. The following list describes the provider detail keys for each identity provider type.    For Google and Login with Amazon:    client_id     client_secret     authorize_scopes      For Facebook:    client_id     client_secret     authorize_scopes     api_version      For Sign in with Apple:    client_id     team_id     key_id     private_key     authorize_scopes      For OIDC providers:    client_id     client_secret     attributes_request_method     oidc_issuer     authorize_scopes     authorize_url if not available from discovery URL specified by oidc_issuer key     token_url if not available from discovery URL specified by oidc_issuer key     attributes_url if not available from discovery URL specified by oidc_issuer key     jwks_uri if not available from discovery URL specified by oidc_issuer key      For SAML providers:    MetadataFile OR MetadataURL     IDPSignout (boolean) optional     
     */
    identityProviderDetails?: IdentityProviderDetails;
    /**
     * The name of the identity provider.
     */
    identityProviderName?: IdentityProviderName;
    /**
     * The type of the identity provider.
     */
    identityProviderType?: IdentityProviderType;
  }
  export interface UpdateIdentityProviderResponse {
    /**
     * The identity provider.
     */
    identityProvider: IdentityProvider;
  }
  export interface UpdateIpAccessSettingsRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The description of the IP access settings.
     */
    description?: Description;
    /**
     * The display name of the IP access settings.
     */
    displayName?: DisplayName;
    /**
     * The ARN of the IP access settings.
     */
    ipAccessSettingsArn: ARN;
    /**
     * The updated IP rules of the IP access settings.
     */
    ipRules?: IpRuleList;
  }
  export interface UpdateIpAccessSettingsResponse {
    /**
     * The IP access settings.
     */
    ipAccessSettings: IpAccessSettings;
  }
  export interface UpdateNetworkSettingsRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The ARN of the network settings.
     */
    networkSettingsArn: ARN;
    /**
     * One or more security groups used to control access from streaming instances to your VPC.
     */
    securityGroupIds?: SecurityGroupIdList;
    /**
     * The subnets in which network interfaces are created to connect streaming instances to your VPC. At least two of these subnets must be in different availability zones.
     */
    subnetIds?: SubnetIdList;
    /**
     * The VPC that streaming instances will connect to.
     */
    vpcId?: VpcId;
  }
  export interface UpdateNetworkSettingsResponse {
    /**
     * The network settings.
     */
    networkSettings: NetworkSettings;
  }
  export interface UpdatePortalRequest {
    /**
     * The type of authentication integration points used when signing into the web portal. Defaults to Standard.  Standard web portals are authenticated directly through your identity provider. You need to call CreateIdentityProvider to integrate your identity provider with your web portal. User and group access to your web portal is controlled through your identity provider.  IAM_Identity_Center web portals are authenticated through AWS IAM Identity Center (successor to AWS Single Sign-On). They provide additional features, such as IdP-initiated authentication. Identity sources (including external identity provider integration), plus user and group access to your web portal, can be configured in the IAM Identity Center.
     */
    authenticationType?: AuthenticationType;
    /**
     * The name of the web portal. This is not visible to users who log into the web portal.
     */
    displayName?: DisplayName;
    /**
     * The ARN of the web portal.
     */
    portalArn: ARN;
  }
  export interface UpdatePortalResponse {
    /**
     * The web portal.
     */
    portal?: Portal;
  }
  export interface UpdateTrustStoreRequest {
    /**
     * A list of CA certificates to add to the trust store.
     */
    certificatesToAdd?: CertificateList;
    /**
     * A list of CA certificates to delete from a trust store.
     */
    certificatesToDelete?: CertificateThumbprintList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface UpdateTrustStoreResponse {
    /**
     * The ARN of the trust store.
     */
    trustStoreArn: ARN;
  }
  export interface UpdateUserAccessLoggingSettingsRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The ARN of the Kinesis stream.
     */
    kinesisStreamArn?: KinesisStreamArn;
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface UpdateUserAccessLoggingSettingsResponse {
    /**
     * The user access logging settings.
     */
    userAccessLoggingSettings: UserAccessLoggingSettings;
  }
  export interface UpdateUserSettingsRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully, subsequent retries with the same client token return the result from the original successful request.  If you do not specify a client token, one is automatically generated by the AWS SDK.
     */
    clientToken?: ClientToken;
    /**
     * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser. If the allowlist and blocklist are empty, the configuration becomes null.
     */
    cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
    /**
     * Specifies whether the user can copy text from the streaming session to the local device.
     */
    copyAllowed?: EnabledType;
    /**
     * The amount of time that a streaming session remains active after users disconnect.
     */
    disconnectTimeoutInMinutes?: DisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can download files from the streaming session to the local device.
     */
    downloadAllowed?: EnabledType;
    /**
     * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the disconnect timeout interval begins.
     */
    idleDisconnectTimeoutInMinutes?: IdleDisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can paste text from the local device to the streaming session.
     */
    pasteAllowed?: EnabledType;
    /**
     * Specifies whether the user can print to the local device.
     */
    printAllowed?: EnabledType;
    /**
     * Specifies whether the user can upload files from the local device to the streaming session.
     */
    uploadAllowed?: EnabledType;
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export interface UpdateUserSettingsResponse {
    /**
     * The user settings.
     */
    userSettings: UserSettings;
  }
  export interface UserAccessLoggingSettings {
    /**
     * A list of web portal ARNs that this user access logging settings is associated with.
     */
    associatedPortalArns?: ArnList;
    /**
     * The ARN of the Kinesis stream.
     */
    kinesisStreamArn?: KinesisStreamArn;
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export type UserAccessLoggingSettingsList = UserAccessLoggingSettingsSummary[];
  export interface UserAccessLoggingSettingsSummary {
    /**
     * The ARN of the Kinesis stream.
     */
    kinesisStreamArn?: KinesisStreamArn;
    /**
     * The ARN of the user access logging settings.
     */
    userAccessLoggingSettingsArn: ARN;
  }
  export interface UserSettings {
    /**
     * A list of web portal ARNs that this user settings is associated with.
     */
    associatedPortalArns?: ArnList;
    /**
     * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser.
     */
    cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
    /**
     * Specifies whether the user can copy text from the streaming session to the local device.
     */
    copyAllowed?: EnabledType;
    /**
     * The amount of time that a streaming session remains active after users disconnect.
     */
    disconnectTimeoutInMinutes?: DisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can download files from the streaming session to the local device.
     */
    downloadAllowed?: EnabledType;
    /**
     * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the disconnect timeout interval begins.
     */
    idleDisconnectTimeoutInMinutes?: IdleDisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can paste text from the local device to the streaming session.
     */
    pasteAllowed?: EnabledType;
    /**
     * Specifies whether the user can print to the local device.
     */
    printAllowed?: EnabledType;
    /**
     * Specifies whether the user can upload files from the local device to the streaming session.
     */
    uploadAllowed?: EnabledType;
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export type UserSettingsList = UserSettingsSummary[];
  export interface UserSettingsSummary {
    /**
     * The configuration that specifies which cookies should be synchronized from the end user's local browser to the remote browser.
     */
    cookieSynchronizationConfiguration?: CookieSynchronizationConfiguration;
    /**
     * Specifies whether the user can copy text from the streaming session to the local device.
     */
    copyAllowed?: EnabledType;
    /**
     * The amount of time that a streaming session remains active after users disconnect.
     */
    disconnectTimeoutInMinutes?: DisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can download files from the streaming session to the local device.
     */
    downloadAllowed?: EnabledType;
    /**
     * The amount of time that users can be idle (inactive) before they are disconnected from their streaming session and the disconnect timeout interval begins.
     */
    idleDisconnectTimeoutInMinutes?: IdleDisconnectTimeoutInMinutes;
    /**
     * Specifies whether the user can paste text from the local device to the streaming session.
     */
    pasteAllowed?: EnabledType;
    /**
     * Specifies whether the user can print to the local device.
     */
    printAllowed?: EnabledType;
    /**
     * Specifies whether the user can upload files from the local device to the streaming session.
     */
    uploadAllowed?: EnabledType;
    /**
     * The ARN of the user settings.
     */
    userSettingsArn: ARN;
  }
  export type VpcId = string;
  export type keyArn = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the WorkSpacesWeb client.
   */
  export import Types = WorkSpacesWeb;
}
export = WorkSpacesWeb;
