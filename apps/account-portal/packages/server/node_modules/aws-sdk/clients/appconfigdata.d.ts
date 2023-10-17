import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppConfigData extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppConfigData.Types.ClientConfiguration)
  config: Config & AppConfigData.Types.ClientConfiguration;
  /**
   * Retrieves the latest deployed configuration. This API may return empty configuration data if the client already has the latest version. For more information about this API action and to view example CLI commands that show how to use it with the StartConfigurationSession API action, see Retrieving the configuration in the AppConfig User Guide.   Note the following important information.   Each configuration token is only valid for one call to GetLatestConfiguration. The GetLatestConfiguration response includes a NextPollConfigurationToken that should always replace the token used for the just-completed call in preparation for the next one.     GetLatestConfiguration is a priced call. For more information, see Pricing.   
   */
  getLatestConfiguration(params: AppConfigData.Types.GetLatestConfigurationRequest, callback?: (err: AWSError, data: AppConfigData.Types.GetLatestConfigurationResponse) => void): Request<AppConfigData.Types.GetLatestConfigurationResponse, AWSError>;
  /**
   * Retrieves the latest deployed configuration. This API may return empty configuration data if the client already has the latest version. For more information about this API action and to view example CLI commands that show how to use it with the StartConfigurationSession API action, see Retrieving the configuration in the AppConfig User Guide.   Note the following important information.   Each configuration token is only valid for one call to GetLatestConfiguration. The GetLatestConfiguration response includes a NextPollConfigurationToken that should always replace the token used for the just-completed call in preparation for the next one.     GetLatestConfiguration is a priced call. For more information, see Pricing.   
   */
  getLatestConfiguration(callback?: (err: AWSError, data: AppConfigData.Types.GetLatestConfigurationResponse) => void): Request<AppConfigData.Types.GetLatestConfigurationResponse, AWSError>;
  /**
   * Starts a configuration session used to retrieve a deployed configuration. For more information about this API action and to view example CLI commands that show how to use it with the GetLatestConfiguration API action, see Retrieving the configuration in the AppConfig User Guide. 
   */
  startConfigurationSession(params: AppConfigData.Types.StartConfigurationSessionRequest, callback?: (err: AWSError, data: AppConfigData.Types.StartConfigurationSessionResponse) => void): Request<AppConfigData.Types.StartConfigurationSessionResponse, AWSError>;
  /**
   * Starts a configuration session used to retrieve a deployed configuration. For more information about this API action and to view example CLI commands that show how to use it with the GetLatestConfiguration API action, see Retrieving the configuration in the AppConfig User Guide. 
   */
  startConfigurationSession(callback?: (err: AWSError, data: AppConfigData.Types.StartConfigurationSessionResponse) => void): Request<AppConfigData.Types.StartConfigurationSessionResponse, AWSError>;
}
declare namespace AppConfigData {
  export interface GetLatestConfigurationRequest {
    /**
     * Token describing the current state of the configuration session. To obtain a token, first call the StartConfigurationSession API. Note that every call to GetLatestConfiguration will return a new ConfigurationToken (NextPollConfigurationToken in the response) and must be provided to subsequent GetLatestConfiguration API calls.  This token should only be used once. To support long poll use cases, the token is valid for up to 24 hours. If a GetLatestConfiguration call uses an expired token, the system returns BadRequestException. 
     */
    ConfigurationToken: Token;
  }
  export interface GetLatestConfigurationResponse {
    /**
     * The latest token describing the current state of the configuration session. This must be provided to the next call to GetLatestConfiguration.   This token should only be used once. To support long poll use cases, the token is valid for up to 24 hours. If a GetLatestConfiguration call uses an expired token, the system returns BadRequestException. 
     */
    NextPollConfigurationToken?: Token;
    /**
     * The amount of time the client should wait before polling for configuration updates again. Use RequiredMinimumPollIntervalInSeconds to set the desired poll interval.
     */
    NextPollIntervalInSeconds?: Integer;
    /**
     * A standard MIME type describing the format of the configuration content.
     */
    ContentType?: String;
    /**
     * The data of the configuration. This may be empty if the client already has the latest version of configuration.
     */
    Configuration?: SensitiveBlob;
    /**
     * The user-defined label for the AppConfig hosted configuration version. This attribute doesn't apply if the configuration is not from an AppConfig hosted configuration version. If the client already has the latest version of the configuration data, this value is empty.
     */
    VersionLabel?: String;
  }
  export type Identifier = string;
  export type Integer = number;
  export type OptionalPollSeconds = number;
  export type SensitiveBlob = Buffer|Uint8Array|Blob|string;
  export interface StartConfigurationSessionRequest {
    /**
     * The application ID or the application name.
     */
    ApplicationIdentifier: Identifier;
    /**
     * The environment ID or the environment name.
     */
    EnvironmentIdentifier: Identifier;
    /**
     * The configuration profile ID or the configuration profile name.
     */
    ConfigurationProfileIdentifier: Identifier;
    /**
     * Sets a constraint on a session. If you specify a value of, for example, 60 seconds, then the client that established the session can't call GetLatestConfiguration more frequently than every 60 seconds.
     */
    RequiredMinimumPollIntervalInSeconds?: OptionalPollSeconds;
  }
  export interface StartConfigurationSessionResponse {
    /**
     * Token encapsulating state about the configuration session. Provide this token to the GetLatestConfiguration API to retrieve configuration data.  This token should only be used once in your first call to GetLatestConfiguration. You must use the new token in the GetLatestConfiguration response (NextPollConfigurationToken) in each subsequent call to GetLatestConfiguration. The InitialConfigurationToken and NextPollConfigurationToken should only be used once. To support long poll use cases, the tokens are valid for up to 24 hours. If a GetLatestConfiguration call uses an expired token, the system returns BadRequestException. 
     */
    InitialConfigurationToken?: Token;
  }
  export type String = string;
  export type Token = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-11-11"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppConfigData client.
   */
  export import Types = AppConfigData;
}
export = AppConfigData;
