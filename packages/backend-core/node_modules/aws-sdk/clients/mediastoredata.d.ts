import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class MediaStoreData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaStoreData.Types.ClientConfiguration)
  config: Config & MediaStoreData.Types.ClientConfiguration;
  /**
   * Deletes an object at the specified path.
   */
  deleteObject(params: MediaStoreData.Types.DeleteObjectRequest, callback?: (err: AWSError, data: MediaStoreData.Types.DeleteObjectResponse) => void): Request<MediaStoreData.Types.DeleteObjectResponse, AWSError>;
  /**
   * Deletes an object at the specified path.
   */
  deleteObject(callback?: (err: AWSError, data: MediaStoreData.Types.DeleteObjectResponse) => void): Request<MediaStoreData.Types.DeleteObjectResponse, AWSError>;
  /**
   * Gets the headers for an object at the specified path.
   */
  describeObject(params: MediaStoreData.Types.DescribeObjectRequest, callback?: (err: AWSError, data: MediaStoreData.Types.DescribeObjectResponse) => void): Request<MediaStoreData.Types.DescribeObjectResponse, AWSError>;
  /**
   * Gets the headers for an object at the specified path.
   */
  describeObject(callback?: (err: AWSError, data: MediaStoreData.Types.DescribeObjectResponse) => void): Request<MediaStoreData.Types.DescribeObjectResponse, AWSError>;
  /**
   * Downloads the object at the specified path. If the object’s upload availability is set to streaming, AWS Elemental MediaStore downloads the object even if it’s still uploading the object.
   */
  getObject(params: MediaStoreData.Types.GetObjectRequest, callback?: (err: AWSError, data: MediaStoreData.Types.GetObjectResponse) => void): Request<MediaStoreData.Types.GetObjectResponse, AWSError>;
  /**
   * Downloads the object at the specified path. If the object’s upload availability is set to streaming, AWS Elemental MediaStore downloads the object even if it’s still uploading the object.
   */
  getObject(callback?: (err: AWSError, data: MediaStoreData.Types.GetObjectResponse) => void): Request<MediaStoreData.Types.GetObjectResponse, AWSError>;
  /**
   * Provides a list of metadata entries about folders and objects in the specified folder.
   */
  listItems(params: MediaStoreData.Types.ListItemsRequest, callback?: (err: AWSError, data: MediaStoreData.Types.ListItemsResponse) => void): Request<MediaStoreData.Types.ListItemsResponse, AWSError>;
  /**
   * Provides a list of metadata entries about folders and objects in the specified folder.
   */
  listItems(callback?: (err: AWSError, data: MediaStoreData.Types.ListItemsResponse) => void): Request<MediaStoreData.Types.ListItemsResponse, AWSError>;
  /**
   * Uploads an object to the specified path. Object sizes are limited to 25 MB for standard upload availability and 10 MB for streaming upload availability.
   */
  putObject(params: MediaStoreData.Types.PutObjectRequest, callback?: (err: AWSError, data: MediaStoreData.Types.PutObjectResponse) => void): Request<MediaStoreData.Types.PutObjectResponse, AWSError>;
  /**
   * Uploads an object to the specified path. Object sizes are limited to 25 MB for standard upload availability and 10 MB for streaming upload availability.
   */
  putObject(callback?: (err: AWSError, data: MediaStoreData.Types.PutObjectResponse) => void): Request<MediaStoreData.Types.PutObjectResponse, AWSError>;
}
declare namespace MediaStoreData {
  export type ContentRangePattern = string;
  export type ContentType = string;
  export interface DeleteObjectRequest {
    /**
     * The path (including the file name) where the object is stored in the container. Format: &lt;folder name&gt;/&lt;folder name&gt;/&lt;file name&gt;
     */
    Path: PathNaming;
  }
  export interface DeleteObjectResponse {
  }
  export interface DescribeObjectRequest {
    /**
     * The path (including the file name) where the object is stored in the container. Format: &lt;folder name&gt;/&lt;folder name&gt;/&lt;file name&gt;
     */
    Path: PathNaming;
  }
  export interface DescribeObjectResponse {
    /**
     * The ETag that represents a unique instance of the object.
     */
    ETag?: ETag;
    /**
     * The content type of the object.
     */
    ContentType?: ContentType;
    /**
     * The length of the object in bytes.
     */
    ContentLength?: NonNegativeLong;
    /**
     * An optional CacheControl header that allows the caller to control the object's cache behavior. Headers can be passed in as specified in the HTTP at https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9. Headers with a custom user-defined value are also accepted.
     */
    CacheControl?: StringPrimitive;
    /**
     * The date and time that the object was last modified.
     */
    LastModified?: TimeStamp;
  }
  export type ETag = string;
  export interface GetObjectRequest {
    /**
     * The path (including the file name) where the object is stored in the container. Format: &lt;folder name&gt;/&lt;folder name&gt;/&lt;file name&gt; For example, to upload the file mlaw.avi to the folder path premium\canada in the container movies, enter the path premium/canada/mlaw.avi. Do not include the container name in this path. If the path includes any folders that don't exist yet, the service creates them. For example, suppose you have an existing premium/usa subfolder. If you specify premium/canada, the service creates a canada subfolder in the premium folder. You then have two subfolders, usa and canada, in the premium folder.  There is no correlation between the path to the source and the path (folders) in the container in AWS Elemental MediaStore. For more information about folders and how they exist in a container, see the AWS Elemental MediaStore User Guide. The file name is the name that is assigned to the file that you upload. The file can have the same name inside and outside of AWS Elemental MediaStore, or it can have the same name. The file name can include or omit an extension. 
     */
    Path: PathNaming;
    /**
     * The range bytes of an object to retrieve. For more information about the Range header, see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35. AWS Elemental MediaStore ignores this header for partially uploaded objects that have streaming upload availability.
     */
    Range?: RangePattern;
  }
  export interface GetObjectResponse {
    /**
     * The bytes of the object. 
     */
    Body?: PayloadBlob;
    /**
     * An optional CacheControl header that allows the caller to control the object's cache behavior. Headers can be passed in as specified in the HTTP spec at https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9. Headers with a custom user-defined value are also accepted.
     */
    CacheControl?: StringPrimitive;
    /**
     * The range of bytes to retrieve.
     */
    ContentRange?: ContentRangePattern;
    /**
     * The length of the object in bytes.
     */
    ContentLength?: NonNegativeLong;
    /**
     * The content type of the object.
     */
    ContentType?: ContentType;
    /**
     * The ETag that represents a unique instance of the object.
     */
    ETag?: ETag;
    /**
     * The date and time that the object was last modified.
     */
    LastModified?: TimeStamp;
    /**
     * The HTML status code of the request. Status codes ranging from 200 to 299 indicate success. All other status codes indicate the type of error that occurred.
     */
    StatusCode: statusCode;
  }
  export interface Item {
    /**
     * The name of the item.
     */
    Name?: ItemName;
    /**
     * The item type (folder or object).
     */
    Type?: ItemType;
    /**
     * The ETag that represents a unique instance of the item.
     */
    ETag?: ETag;
    /**
     * The date and time that the item was last modified.
     */
    LastModified?: TimeStamp;
    /**
     * The content type of the item.
     */
    ContentType?: ContentType;
    /**
     * The length of the item in bytes.
     */
    ContentLength?: NonNegativeLong;
  }
  export type ItemList = Item[];
  export type ItemName = string;
  export type ItemType = "OBJECT"|"FOLDER"|string;
  export interface ListItemsRequest {
    /**
     * The path in the container from which to retrieve items. Format: &lt;folder name&gt;/&lt;folder name&gt;/&lt;file name&gt;
     */
    Path?: ListPathNaming;
    /**
     * The maximum number of results to return per API request. For example, you submit a ListItems request with MaxResults set at 500. Although 2,000 items match your request, the service returns no more than the first 500 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 1,000 results per page.
     */
    MaxResults?: ListLimit;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListItems request with MaxResults set at 500. The service returns the first batch of results (up to 500) and a NextToken value. To see the next batch of results, you can submit the ListItems request a second time and specify the NextToken value. Tokens expire after 15 minutes.
     */
    NextToken?: PaginationToken;
  }
  export interface ListItemsResponse {
    /**
     * The metadata entries for the folders and objects at the requested path.
     */
    Items?: ItemList;
    /**
     * The token that can be used in a request to view the next set of results. For example, you submit a ListItems request that matches 2,000 items with MaxResults set at 500. The service returns the first batch of results (up to 500) and a NextToken value that can be used to fetch the next batch of results.
     */
    NextToken?: PaginationToken;
  }
  export type ListLimit = number;
  export type ListPathNaming = string;
  export type NonNegativeLong = number;
  export type PaginationToken = string;
  export type PathNaming = string;
  export type PayloadBlob = Buffer|Uint8Array|Blob|string|Readable;
  export interface PutObjectRequest {
    /**
     * The bytes to be stored. 
     */
    Body: PayloadBlob;
    /**
     * The path (including the file name) where the object is stored in the container. Format: &lt;folder name&gt;/&lt;folder name&gt;/&lt;file name&gt; For example, to upload the file mlaw.avi to the folder path premium\canada in the container movies, enter the path premium/canada/mlaw.avi. Do not include the container name in this path. If the path includes any folders that don't exist yet, the service creates them. For example, suppose you have an existing premium/usa subfolder. If you specify premium/canada, the service creates a canada subfolder in the premium folder. You then have two subfolders, usa and canada, in the premium folder.  There is no correlation between the path to the source and the path (folders) in the container in AWS Elemental MediaStore. For more information about folders and how they exist in a container, see the AWS Elemental MediaStore User Guide. The file name is the name that is assigned to the file that you upload. The file can have the same name inside and outside of AWS Elemental MediaStore, or it can have the same name. The file name can include or omit an extension. 
     */
    Path: PathNaming;
    /**
     * The content type of the object.
     */
    ContentType?: ContentType;
    /**
     * An optional CacheControl header that allows the caller to control the object's cache behavior. Headers can be passed in as specified in the HTTP at https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9. Headers with a custom user-defined value are also accepted.
     */
    CacheControl?: StringPrimitive;
    /**
     * Indicates the storage class of a Put request. Defaults to high-performance temporal storage class, and objects are persisted into durable storage shortly after being received.
     */
    StorageClass?: StorageClass;
    /**
     * Indicates the availability of an object while it is still uploading. If the value is set to streaming, the object is available for downloading after some initial buffering but before the object is uploaded completely. If the value is set to standard, the object is available for downloading only when it is uploaded completely. The default value for this header is standard. To use this header, you must also set the HTTP Transfer-Encoding header to chunked.
     */
    UploadAvailability?: UploadAvailability;
  }
  export interface PutObjectResponse {
    /**
     * The SHA256 digest of the object that is persisted.
     */
    ContentSHA256?: SHA256Hash;
    /**
     * Unique identifier of the object in the container.
     */
    ETag?: ETag;
    /**
     * The storage class where the object was persisted. The class should be “Temporal”.
     */
    StorageClass?: StorageClass;
  }
  export type RangePattern = string;
  export type SHA256Hash = string;
  export type StorageClass = "TEMPORAL"|string;
  export type StringPrimitive = string;
  export type TimeStamp = Date;
  export type UploadAvailability = "STANDARD"|"STREAMING"|string;
  export type statusCode = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-09-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaStoreData client.
   */
  export import Types = MediaStoreData;
}
export = MediaStoreData;
