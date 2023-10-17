import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoTRoboRunner extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoTRoboRunner.Types.ClientConfiguration)
  config: Config & IoTRoboRunner.Types.ClientConfiguration;
  /**
   * Grants permission to create a destination
   */
  createDestination(params: IoTRoboRunner.Types.CreateDestinationRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateDestinationResponse) => void): Request<IoTRoboRunner.Types.CreateDestinationResponse, AWSError>;
  /**
   * Grants permission to create a destination
   */
  createDestination(callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateDestinationResponse) => void): Request<IoTRoboRunner.Types.CreateDestinationResponse, AWSError>;
  /**
   * Grants permission to create a site
   */
  createSite(params: IoTRoboRunner.Types.CreateSiteRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateSiteResponse) => void): Request<IoTRoboRunner.Types.CreateSiteResponse, AWSError>;
  /**
   * Grants permission to create a site
   */
  createSite(callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateSiteResponse) => void): Request<IoTRoboRunner.Types.CreateSiteResponse, AWSError>;
  /**
   * Grants permission to create a worker
   */
  createWorker(params: IoTRoboRunner.Types.CreateWorkerRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateWorkerResponse) => void): Request<IoTRoboRunner.Types.CreateWorkerResponse, AWSError>;
  /**
   * Grants permission to create a worker
   */
  createWorker(callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateWorkerResponse) => void): Request<IoTRoboRunner.Types.CreateWorkerResponse, AWSError>;
  /**
   * Grants permission to create a worker fleet
   */
  createWorkerFleet(params: IoTRoboRunner.Types.CreateWorkerFleetRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.CreateWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to create a worker fleet
   */
  createWorkerFleet(callback?: (err: AWSError, data: IoTRoboRunner.Types.CreateWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.CreateWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to delete a destination
   */
  deleteDestination(params: IoTRoboRunner.Types.DeleteDestinationRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteDestinationResponse) => void): Request<IoTRoboRunner.Types.DeleteDestinationResponse, AWSError>;
  /**
   * Grants permission to delete a destination
   */
  deleteDestination(callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteDestinationResponse) => void): Request<IoTRoboRunner.Types.DeleteDestinationResponse, AWSError>;
  /**
   * Grants permission to delete a site
   */
  deleteSite(params: IoTRoboRunner.Types.DeleteSiteRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteSiteResponse) => void): Request<IoTRoboRunner.Types.DeleteSiteResponse, AWSError>;
  /**
   * Grants permission to delete a site
   */
  deleteSite(callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteSiteResponse) => void): Request<IoTRoboRunner.Types.DeleteSiteResponse, AWSError>;
  /**
   * Grants permission to delete a worker
   */
  deleteWorker(params: IoTRoboRunner.Types.DeleteWorkerRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteWorkerResponse) => void): Request<IoTRoboRunner.Types.DeleteWorkerResponse, AWSError>;
  /**
   * Grants permission to delete a worker
   */
  deleteWorker(callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteWorkerResponse) => void): Request<IoTRoboRunner.Types.DeleteWorkerResponse, AWSError>;
  /**
   * Grants permission to delete a worker fleet
   */
  deleteWorkerFleet(params: IoTRoboRunner.Types.DeleteWorkerFleetRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.DeleteWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to delete a worker fleet
   */
  deleteWorkerFleet(callback?: (err: AWSError, data: IoTRoboRunner.Types.DeleteWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.DeleteWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to get a destination
   */
  getDestination(params: IoTRoboRunner.Types.GetDestinationRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.GetDestinationResponse) => void): Request<IoTRoboRunner.Types.GetDestinationResponse, AWSError>;
  /**
   * Grants permission to get a destination
   */
  getDestination(callback?: (err: AWSError, data: IoTRoboRunner.Types.GetDestinationResponse) => void): Request<IoTRoboRunner.Types.GetDestinationResponse, AWSError>;
  /**
   * Grants permission to get a site
   */
  getSite(params: IoTRoboRunner.Types.GetSiteRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.GetSiteResponse) => void): Request<IoTRoboRunner.Types.GetSiteResponse, AWSError>;
  /**
   * Grants permission to get a site
   */
  getSite(callback?: (err: AWSError, data: IoTRoboRunner.Types.GetSiteResponse) => void): Request<IoTRoboRunner.Types.GetSiteResponse, AWSError>;
  /**
   * Grants permission to get a worker
   */
  getWorker(params: IoTRoboRunner.Types.GetWorkerRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.GetWorkerResponse) => void): Request<IoTRoboRunner.Types.GetWorkerResponse, AWSError>;
  /**
   * Grants permission to get a worker
   */
  getWorker(callback?: (err: AWSError, data: IoTRoboRunner.Types.GetWorkerResponse) => void): Request<IoTRoboRunner.Types.GetWorkerResponse, AWSError>;
  /**
   * Grants permission to get a worker fleet
   */
  getWorkerFleet(params: IoTRoboRunner.Types.GetWorkerFleetRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.GetWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.GetWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to get a worker fleet
   */
  getWorkerFleet(callback?: (err: AWSError, data: IoTRoboRunner.Types.GetWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.GetWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to list destinations
   */
  listDestinations(params: IoTRoboRunner.Types.ListDestinationsRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.ListDestinationsResponse) => void): Request<IoTRoboRunner.Types.ListDestinationsResponse, AWSError>;
  /**
   * Grants permission to list destinations
   */
  listDestinations(callback?: (err: AWSError, data: IoTRoboRunner.Types.ListDestinationsResponse) => void): Request<IoTRoboRunner.Types.ListDestinationsResponse, AWSError>;
  /**
   * Grants permission to list sites
   */
  listSites(params: IoTRoboRunner.Types.ListSitesRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.ListSitesResponse) => void): Request<IoTRoboRunner.Types.ListSitesResponse, AWSError>;
  /**
   * Grants permission to list sites
   */
  listSites(callback?: (err: AWSError, data: IoTRoboRunner.Types.ListSitesResponse) => void): Request<IoTRoboRunner.Types.ListSitesResponse, AWSError>;
  /**
   * Grants permission to list worker fleets
   */
  listWorkerFleets(params: IoTRoboRunner.Types.ListWorkerFleetsRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.ListWorkerFleetsResponse) => void): Request<IoTRoboRunner.Types.ListWorkerFleetsResponse, AWSError>;
  /**
   * Grants permission to list worker fleets
   */
  listWorkerFleets(callback?: (err: AWSError, data: IoTRoboRunner.Types.ListWorkerFleetsResponse) => void): Request<IoTRoboRunner.Types.ListWorkerFleetsResponse, AWSError>;
  /**
   * Grants permission to list workers
   */
  listWorkers(params: IoTRoboRunner.Types.ListWorkersRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.ListWorkersResponse) => void): Request<IoTRoboRunner.Types.ListWorkersResponse, AWSError>;
  /**
   * Grants permission to list workers
   */
  listWorkers(callback?: (err: AWSError, data: IoTRoboRunner.Types.ListWorkersResponse) => void): Request<IoTRoboRunner.Types.ListWorkersResponse, AWSError>;
  /**
   * Grants permission to update a destination
   */
  updateDestination(params: IoTRoboRunner.Types.UpdateDestinationRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateDestinationResponse) => void): Request<IoTRoboRunner.Types.UpdateDestinationResponse, AWSError>;
  /**
   * Grants permission to update a destination
   */
  updateDestination(callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateDestinationResponse) => void): Request<IoTRoboRunner.Types.UpdateDestinationResponse, AWSError>;
  /**
   * Grants permission to update a site
   */
  updateSite(params: IoTRoboRunner.Types.UpdateSiteRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateSiteResponse) => void): Request<IoTRoboRunner.Types.UpdateSiteResponse, AWSError>;
  /**
   * Grants permission to update a site
   */
  updateSite(callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateSiteResponse) => void): Request<IoTRoboRunner.Types.UpdateSiteResponse, AWSError>;
  /**
   * Grants permission to update a worker
   */
  updateWorker(params: IoTRoboRunner.Types.UpdateWorkerRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateWorkerResponse) => void): Request<IoTRoboRunner.Types.UpdateWorkerResponse, AWSError>;
  /**
   * Grants permission to update a worker
   */
  updateWorker(callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateWorkerResponse) => void): Request<IoTRoboRunner.Types.UpdateWorkerResponse, AWSError>;
  /**
   * Grants permission to update a worker fleet
   */
  updateWorkerFleet(params: IoTRoboRunner.Types.UpdateWorkerFleetRequest, callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.UpdateWorkerFleetResponse, AWSError>;
  /**
   * Grants permission to update a worker fleet
   */
  updateWorkerFleet(callback?: (err: AWSError, data: IoTRoboRunner.Types.UpdateWorkerFleetResponse) => void): Request<IoTRoboRunner.Types.UpdateWorkerFleetResponse, AWSError>;
}
declare namespace IoTRoboRunner {
  export interface CartesianCoordinates {
    /**
     * X coordinate.
     */
    x: Double;
    /**
     * Y coordinate.
     */
    y: Double;
    /**
     * Z coordinate.
     */
    z?: Double;
  }
  export interface CreateDestinationRequest {
    clientToken?: IdempotencyToken;
    name: Name;
    site: SiteGenericIdentifier;
    /**
     * The state of the destination. Default used if not specified.
     */
    state?: DestinationState;
    additionalFixedProperties?: DestinationAdditionalFixedProperties;
  }
  export interface CreateDestinationResponse {
    arn: DestinationArn;
    id: DestinationId;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    state: DestinationState;
  }
  export interface CreateSiteRequest {
    clientToken?: IdempotencyToken;
    name: Name;
    countryCode: SiteCountryCode;
    description?: SiteDescription;
  }
  export interface CreateSiteResponse {
    arn: SiteArn;
    id: SiteId;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
  }
  export interface CreateWorkerFleetRequest {
    clientToken?: IdempotencyToken;
    name: Name;
    site: SiteGenericIdentifier;
    additionalFixedProperties?: WorkerFleetAdditionalFixedProperties;
  }
  export interface CreateWorkerFleetResponse {
    arn: WorkerFleetArn;
    id: WorkerFleetId;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
  }
  export interface CreateWorkerRequest {
    clientToken?: IdempotencyToken;
    name: Name;
    fleet: WorkerFleetGenericIdentifier;
    additionalTransientProperties?: WorkerAdditionalTransientPropertiesJson;
    additionalFixedProperties?: WorkerAdditionalFixedPropertiesJson;
    vendorProperties?: VendorProperties;
    position?: PositionCoordinates;
    orientation?: Orientation;
  }
  export interface CreateWorkerResponse {
    arn: WorkerArn;
    id: WorkerId;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    site: SiteArn;
  }
  export type CreatedAtTimestamp = Date;
  export interface DeleteDestinationRequest {
    id: DestinationGenericIdentifier;
  }
  export interface DeleteDestinationResponse {
  }
  export interface DeleteSiteRequest {
    id: SiteGenericIdentifier;
  }
  export interface DeleteSiteResponse {
  }
  export interface DeleteWorkerFleetRequest {
    id: WorkerFleetGenericIdentifier;
  }
  export interface DeleteWorkerFleetResponse {
  }
  export interface DeleteWorkerRequest {
    id: WorkerGenericIdentifier;
  }
  export interface DeleteWorkerResponse {
  }
  export interface Destination {
    arn: DestinationArn;
    id: DestinationId;
    name: Name;
    site: SiteArn;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    state: DestinationState;
    additionalFixedProperties?: DestinationAdditionalFixedProperties;
  }
  export type DestinationAdditionalFixedProperties = string;
  export type DestinationArn = string;
  export type DestinationGenericIdentifier = string;
  export type DestinationId = string;
  export type DestinationState = "ENABLED"|"DISABLED"|"DECOMMISSIONED"|string;
  export type Destinations = Destination[];
  export type Double = number;
  export interface GetDestinationRequest {
    id: DestinationGenericIdentifier;
  }
  export interface GetDestinationResponse {
    arn: DestinationArn;
    id: DestinationId;
    name: Name;
    site: SiteArn;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    state: DestinationState;
    additionalFixedProperties?: DestinationAdditionalFixedProperties;
  }
  export interface GetSiteRequest {
    id: SiteGenericIdentifier;
  }
  export interface GetSiteResponse {
    arn: SiteArn;
    id: SiteId;
    name: Name;
    countryCode: SiteCountryCode;
    description?: SiteDescription;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
  }
  export interface GetWorkerFleetRequest {
    id: WorkerFleetGenericIdentifier;
  }
  export interface GetWorkerFleetResponse {
    id: WorkerFleetId;
    arn: WorkerFleetArn;
    name: Name;
    site: SiteArn;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    additionalFixedProperties?: WorkerFleetAdditionalFixedProperties;
  }
  export interface GetWorkerRequest {
    id: WorkerGenericIdentifier;
  }
  export interface GetWorkerResponse {
    arn: WorkerArn;
    id: WorkerId;
    fleet: WorkerFleetArn;
    site: SiteArn;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    name: Name;
    additionalTransientProperties?: WorkerAdditionalTransientPropertiesJson;
    additionalFixedProperties?: WorkerAdditionalFixedPropertiesJson;
    vendorProperties?: VendorProperties;
    position?: PositionCoordinates;
    orientation?: Orientation;
  }
  export type IdempotencyToken = string;
  export interface ListDestinationsRequest {
    site: SiteGenericIdentifier;
    maxResults?: PageSize;
    nextToken?: PaginationToken;
    state?: DestinationState;
  }
  export interface ListDestinationsResponse {
    nextToken?: PaginationToken;
    destinations?: Destinations;
  }
  export type ListSitesPageSize = number;
  export interface ListSitesRequest {
    maxResults?: ListSitesPageSize;
    nextToken?: PaginationToken;
  }
  export interface ListSitesResponse {
    nextToken?: PaginationToken;
    sites?: Sites;
  }
  export type ListWorkerFleetsPageSize = number;
  export interface ListWorkerFleetsRequest {
    site: SiteGenericIdentifier;
    maxResults?: ListWorkerFleetsPageSize;
    nextToken?: PaginationToken;
  }
  export interface ListWorkerFleetsResponse {
    nextToken?: PaginationToken;
    workerFleets?: WorkerFleets;
  }
  export type ListWorkersPageSize = number;
  export interface ListWorkersRequest {
    site: SiteGenericIdentifier;
    maxResults?: ListWorkersPageSize;
    nextToken?: PaginationToken;
    fleet?: WorkerFleetGenericIdentifier;
  }
  export interface ListWorkersResponse {
    nextToken?: PaginationToken;
    workers?: Workers;
  }
  export type Name = string;
  export interface Orientation {
    /**
     * Degrees, limited on [0, 360)
     */
    degrees?: OrientationDegreesDouble;
  }
  export type OrientationDegreesDouble = number;
  export type PageSize = number;
  export type PaginationToken = string;
  export interface PositionCoordinates {
    /**
     * Cartesian coordinates.
     */
    cartesianCoordinates?: CartesianCoordinates;
  }
  export interface Site {
    arn: SiteArn;
    /**
     * The name of the site. Mutable after creation and unique within a given account.
     */
    name: Name;
    countryCode: SiteCountryCode;
    createdAt: CreatedAtTimestamp;
  }
  export type SiteArn = string;
  export type SiteCountryCode = string;
  export type SiteDescription = string;
  export type SiteGenericIdentifier = string;
  export type SiteId = string;
  export type Sites = Site[];
  export interface UpdateDestinationRequest {
    id: DestinationGenericIdentifier;
    name?: Name;
    state?: DestinationState;
    additionalFixedProperties?: DestinationAdditionalFixedProperties;
  }
  export interface UpdateDestinationResponse {
    arn: DestinationArn;
    id: DestinationId;
    name: Name;
    updatedAt: UpdatedAtTimestamp;
    state: DestinationState;
    additionalFixedProperties?: DestinationAdditionalFixedProperties;
  }
  export interface UpdateSiteRequest {
    id: SiteGenericIdentifier;
    name?: Name;
    countryCode?: SiteCountryCode;
    description?: SiteDescription;
  }
  export interface UpdateSiteResponse {
    arn: SiteArn;
    id: SiteId;
    name: Name;
    countryCode?: SiteCountryCode;
    description?: SiteDescription;
    updatedAt: UpdatedAtTimestamp;
  }
  export interface UpdateWorkerFleetRequest {
    id: WorkerFleetGenericIdentifier;
    name?: Name;
    additionalFixedProperties?: WorkerFleetAdditionalFixedProperties;
  }
  export interface UpdateWorkerFleetResponse {
    arn: WorkerFleetArn;
    id: WorkerFleetId;
    name: Name;
    updatedAt: UpdatedAtTimestamp;
    additionalFixedProperties?: WorkerFleetAdditionalFixedProperties;
  }
  export interface UpdateWorkerRequest {
    id: WorkerGenericIdentifier;
    name?: Name;
    additionalTransientProperties?: WorkerAdditionalTransientPropertiesJson;
    additionalFixedProperties?: WorkerAdditionalFixedPropertiesJson;
    vendorProperties?: VendorProperties;
    position?: PositionCoordinates;
    orientation?: Orientation;
  }
  export interface UpdateWorkerResponse {
    arn: WorkerArn;
    id: WorkerId;
    fleet: WorkerFleetArn;
    updatedAt: UpdatedAtTimestamp;
    name: Name;
    additionalTransientProperties?: WorkerAdditionalTransientPropertiesJson;
    additionalFixedProperties?: WorkerAdditionalFixedPropertiesJson;
    orientation?: Orientation;
    vendorProperties?: VendorProperties;
    position?: PositionCoordinates;
  }
  export type UpdatedAtTimestamp = Date;
  export type VendorAdditionalFixedPropertiesJson = string;
  export type VendorAdditionalTransientPropertiesJson = string;
  export interface VendorProperties {
    vendorWorkerId: VendorWorkerId;
    vendorWorkerIpAddress?: VendorWorkerIpAddress;
    vendorAdditionalTransientProperties?: VendorAdditionalTransientPropertiesJson;
    vendorAdditionalFixedProperties?: VendorAdditionalFixedPropertiesJson;
  }
  export type VendorWorkerId = string;
  export type VendorWorkerIpAddress = string;
  export interface Worker {
    arn: WorkerArn;
    id: WorkerId;
    fleet: WorkerFleetArn;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    name: Name;
    site: SiteArn;
    additionalTransientProperties?: WorkerAdditionalTransientPropertiesJson;
    additionalFixedProperties?: WorkerAdditionalFixedPropertiesJson;
    vendorProperties?: VendorProperties;
    position?: PositionCoordinates;
    orientation?: Orientation;
  }
  export type WorkerAdditionalFixedPropertiesJson = string;
  export type WorkerAdditionalTransientPropertiesJson = string;
  export type WorkerArn = string;
  export interface WorkerFleet {
    arn: WorkerFleetArn;
    id: WorkerFleetId;
    name: Name;
    site: SiteArn;
    createdAt: CreatedAtTimestamp;
    updatedAt: UpdatedAtTimestamp;
    additionalFixedProperties?: WorkerFleetAdditionalFixedProperties;
  }
  export type WorkerFleetAdditionalFixedProperties = string;
  export type WorkerFleetArn = string;
  export type WorkerFleetGenericIdentifier = string;
  export type WorkerFleetId = string;
  export type WorkerFleets = WorkerFleet[];
  export type WorkerGenericIdentifier = string;
  export type WorkerId = string;
  export type Workers = Worker[];
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
   * Contains interfaces for use with the IoTRoboRunner client.
   */
  export import Types = IoTRoboRunner;
}
export = IoTRoboRunner;
