import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AmplifyUIBuilder extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AmplifyUIBuilder.Types.ClientConfiguration)
  config: Config & AmplifyUIBuilder.Types.ClientConfiguration;
  /**
   * Creates a new component for an Amplify app.
   */
  createComponent(params: AmplifyUIBuilder.Types.CreateComponentRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.CreateComponentResponse) => void): Request<AmplifyUIBuilder.Types.CreateComponentResponse, AWSError>;
  /**
   * Creates a new component for an Amplify app.
   */
  createComponent(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.CreateComponentResponse) => void): Request<AmplifyUIBuilder.Types.CreateComponentResponse, AWSError>;
  /**
   * Creates a new form for an Amplify app.
   */
  createForm(params: AmplifyUIBuilder.Types.CreateFormRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.CreateFormResponse) => void): Request<AmplifyUIBuilder.Types.CreateFormResponse, AWSError>;
  /**
   * Creates a new form for an Amplify app.
   */
  createForm(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.CreateFormResponse) => void): Request<AmplifyUIBuilder.Types.CreateFormResponse, AWSError>;
  /**
   * Creates a theme to apply to the components in an Amplify app.
   */
  createTheme(params: AmplifyUIBuilder.Types.CreateThemeRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.CreateThemeResponse) => void): Request<AmplifyUIBuilder.Types.CreateThemeResponse, AWSError>;
  /**
   * Creates a theme to apply to the components in an Amplify app.
   */
  createTheme(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.CreateThemeResponse) => void): Request<AmplifyUIBuilder.Types.CreateThemeResponse, AWSError>;
  /**
   * Deletes a component from an Amplify app.
   */
  deleteComponent(params: AmplifyUIBuilder.Types.DeleteComponentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a component from an Amplify app.
   */
  deleteComponent(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a form from an Amplify app.
   */
  deleteForm(params: AmplifyUIBuilder.Types.DeleteFormRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a form from an Amplify app.
   */
  deleteForm(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a theme from an Amplify app.
   */
  deleteTheme(params: AmplifyUIBuilder.Types.DeleteThemeRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a theme from an Amplify app.
   */
  deleteTheme(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This is for internal use.  Amplify uses this action to exchange an access code for a token.
   */
  exchangeCodeForToken(params: AmplifyUIBuilder.Types.ExchangeCodeForTokenRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExchangeCodeForTokenResponse) => void): Request<AmplifyUIBuilder.Types.ExchangeCodeForTokenResponse, AWSError>;
  /**
   *  This is for internal use.  Amplify uses this action to exchange an access code for a token.
   */
  exchangeCodeForToken(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExchangeCodeForTokenResponse) => void): Request<AmplifyUIBuilder.Types.ExchangeCodeForTokenResponse, AWSError>;
  /**
   * Exports component configurations to code that is ready to integrate into an Amplify app.
   */
  exportComponents(params: AmplifyUIBuilder.Types.ExportComponentsRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExportComponentsResponse) => void): Request<AmplifyUIBuilder.Types.ExportComponentsResponse, AWSError>;
  /**
   * Exports component configurations to code that is ready to integrate into an Amplify app.
   */
  exportComponents(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExportComponentsResponse) => void): Request<AmplifyUIBuilder.Types.ExportComponentsResponse, AWSError>;
  /**
   * Exports form configurations to code that is ready to integrate into an Amplify app.
   */
  exportForms(params: AmplifyUIBuilder.Types.ExportFormsRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExportFormsResponse) => void): Request<AmplifyUIBuilder.Types.ExportFormsResponse, AWSError>;
  /**
   * Exports form configurations to code that is ready to integrate into an Amplify app.
   */
  exportForms(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExportFormsResponse) => void): Request<AmplifyUIBuilder.Types.ExportFormsResponse, AWSError>;
  /**
   * Exports theme configurations to code that is ready to integrate into an Amplify app.
   */
  exportThemes(params: AmplifyUIBuilder.Types.ExportThemesRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExportThemesResponse) => void): Request<AmplifyUIBuilder.Types.ExportThemesResponse, AWSError>;
  /**
   * Exports theme configurations to code that is ready to integrate into an Amplify app.
   */
  exportThemes(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ExportThemesResponse) => void): Request<AmplifyUIBuilder.Types.ExportThemesResponse, AWSError>;
  /**
   * Returns an existing code generation job.
   */
  getCodegenJob(params: AmplifyUIBuilder.Types.GetCodegenJobRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetCodegenJobResponse) => void): Request<AmplifyUIBuilder.Types.GetCodegenJobResponse, AWSError>;
  /**
   * Returns an existing code generation job.
   */
  getCodegenJob(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetCodegenJobResponse) => void): Request<AmplifyUIBuilder.Types.GetCodegenJobResponse, AWSError>;
  /**
   * Returns an existing component for an Amplify app.
   */
  getComponent(params: AmplifyUIBuilder.Types.GetComponentRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetComponentResponse) => void): Request<AmplifyUIBuilder.Types.GetComponentResponse, AWSError>;
  /**
   * Returns an existing component for an Amplify app.
   */
  getComponent(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetComponentResponse) => void): Request<AmplifyUIBuilder.Types.GetComponentResponse, AWSError>;
  /**
   * Returns an existing form for an Amplify app.
   */
  getForm(params: AmplifyUIBuilder.Types.GetFormRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetFormResponse) => void): Request<AmplifyUIBuilder.Types.GetFormResponse, AWSError>;
  /**
   * Returns an existing form for an Amplify app.
   */
  getForm(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetFormResponse) => void): Request<AmplifyUIBuilder.Types.GetFormResponse, AWSError>;
  /**
   * Returns existing metadata for an Amplify app.
   */
  getMetadata(params: AmplifyUIBuilder.Types.GetMetadataRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetMetadataResponse) => void): Request<AmplifyUIBuilder.Types.GetMetadataResponse, AWSError>;
  /**
   * Returns existing metadata for an Amplify app.
   */
  getMetadata(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetMetadataResponse) => void): Request<AmplifyUIBuilder.Types.GetMetadataResponse, AWSError>;
  /**
   * Returns an existing theme for an Amplify app.
   */
  getTheme(params: AmplifyUIBuilder.Types.GetThemeRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetThemeResponse) => void): Request<AmplifyUIBuilder.Types.GetThemeResponse, AWSError>;
  /**
   * Returns an existing theme for an Amplify app.
   */
  getTheme(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.GetThemeResponse) => void): Request<AmplifyUIBuilder.Types.GetThemeResponse, AWSError>;
  /**
   * Retrieves a list of code generation jobs for a specified Amplify app and backend environment.
   */
  listCodegenJobs(params: AmplifyUIBuilder.Types.ListCodegenJobsRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListCodegenJobsResponse) => void): Request<AmplifyUIBuilder.Types.ListCodegenJobsResponse, AWSError>;
  /**
   * Retrieves a list of code generation jobs for a specified Amplify app and backend environment.
   */
  listCodegenJobs(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListCodegenJobsResponse) => void): Request<AmplifyUIBuilder.Types.ListCodegenJobsResponse, AWSError>;
  /**
   * Retrieves a list of components for a specified Amplify app and backend environment.
   */
  listComponents(params: AmplifyUIBuilder.Types.ListComponentsRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListComponentsResponse) => void): Request<AmplifyUIBuilder.Types.ListComponentsResponse, AWSError>;
  /**
   * Retrieves a list of components for a specified Amplify app and backend environment.
   */
  listComponents(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListComponentsResponse) => void): Request<AmplifyUIBuilder.Types.ListComponentsResponse, AWSError>;
  /**
   * Retrieves a list of forms for a specified Amplify app and backend environment.
   */
  listForms(params: AmplifyUIBuilder.Types.ListFormsRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListFormsResponse) => void): Request<AmplifyUIBuilder.Types.ListFormsResponse, AWSError>;
  /**
   * Retrieves a list of forms for a specified Amplify app and backend environment.
   */
  listForms(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListFormsResponse) => void): Request<AmplifyUIBuilder.Types.ListFormsResponse, AWSError>;
  /**
   * Retrieves a list of themes for a specified Amplify app and backend environment.
   */
  listThemes(params: AmplifyUIBuilder.Types.ListThemesRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListThemesResponse) => void): Request<AmplifyUIBuilder.Types.ListThemesResponse, AWSError>;
  /**
   * Retrieves a list of themes for a specified Amplify app and backend environment.
   */
  listThemes(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.ListThemesResponse) => void): Request<AmplifyUIBuilder.Types.ListThemesResponse, AWSError>;
  /**
   * Stores the metadata information about a feature on a form.
   */
  putMetadataFlag(params: AmplifyUIBuilder.Types.PutMetadataFlagRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stores the metadata information about a feature on a form.
   */
  putMetadataFlag(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This is for internal use.  Amplify uses this action to refresh a previously issued access token that might have expired.
   */
  refreshToken(params: AmplifyUIBuilder.Types.RefreshTokenRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.RefreshTokenResponse) => void): Request<AmplifyUIBuilder.Types.RefreshTokenResponse, AWSError>;
  /**
   *  This is for internal use.  Amplify uses this action to refresh a previously issued access token that might have expired.
   */
  refreshToken(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.RefreshTokenResponse) => void): Request<AmplifyUIBuilder.Types.RefreshTokenResponse, AWSError>;
  /**
   * Starts a code generation job for a specified Amplify app and backend environment.
   */
  startCodegenJob(params: AmplifyUIBuilder.Types.StartCodegenJobRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.StartCodegenJobResponse) => void): Request<AmplifyUIBuilder.Types.StartCodegenJobResponse, AWSError>;
  /**
   * Starts a code generation job for a specified Amplify app and backend environment.
   */
  startCodegenJob(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.StartCodegenJobResponse) => void): Request<AmplifyUIBuilder.Types.StartCodegenJobResponse, AWSError>;
  /**
   * Updates an existing component.
   */
  updateComponent(params: AmplifyUIBuilder.Types.UpdateComponentRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.UpdateComponentResponse) => void): Request<AmplifyUIBuilder.Types.UpdateComponentResponse, AWSError>;
  /**
   * Updates an existing component.
   */
  updateComponent(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.UpdateComponentResponse) => void): Request<AmplifyUIBuilder.Types.UpdateComponentResponse, AWSError>;
  /**
   * Updates an existing form.
   */
  updateForm(params: AmplifyUIBuilder.Types.UpdateFormRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.UpdateFormResponse) => void): Request<AmplifyUIBuilder.Types.UpdateFormResponse, AWSError>;
  /**
   * Updates an existing form.
   */
  updateForm(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.UpdateFormResponse) => void): Request<AmplifyUIBuilder.Types.UpdateFormResponse, AWSError>;
  /**
   * Updates an existing theme.
   */
  updateTheme(params: AmplifyUIBuilder.Types.UpdateThemeRequest, callback?: (err: AWSError, data: AmplifyUIBuilder.Types.UpdateThemeResponse) => void): Request<AmplifyUIBuilder.Types.UpdateThemeResponse, AWSError>;
  /**
   * Updates an existing theme.
   */
  updateTheme(callback?: (err: AWSError, data: AmplifyUIBuilder.Types.UpdateThemeResponse) => void): Request<AmplifyUIBuilder.Types.UpdateThemeResponse, AWSError>;
}
declare namespace AmplifyUIBuilder {
  export interface ActionParameters {
    /**
     * The type of navigation action. Valid values are url and anchor. This value is required for a navigation action.
     */
    type?: ComponentProperty;
    /**
     * The URL to the location to open. Specify this value for a navigation action.
     */
    url?: ComponentProperty;
    /**
     * The HTML anchor link to the location to open. Specify this value for a navigation action.
     */
    anchor?: ComponentProperty;
    /**
     * The element within the same component to modify when the action occurs.
     */
    target?: ComponentProperty;
    /**
     * Specifies whether the user should be signed out globally. Specify this value for an auth sign out action.
     */
    global?: ComponentProperty;
    /**
     * The name of the data model. Use when the action performs an operation on an Amplify DataStore model.
     */
    model?: String;
    /**
     * The unique ID of the component that the ActionParameters apply to.
     */
    id?: ComponentProperty;
    /**
     * A dictionary of key-value pairs mapping Amplify Studio properties to fields in a data model. Use when the action performs an operation on an Amplify DataStore model.
     */
    fields?: ComponentProperties;
    /**
     * A key-value pair that specifies the state property name and its initial value.
     */
    state?: MutationActionSetStateParameter;
  }
  export interface ApiConfiguration {
    /**
     * The configuration for an application using GraphQL APIs.
     */
    graphQLConfig?: GraphQLRenderConfig;
    /**
     * The configuration for an application using DataStore APIs.
     */
    dataStoreConfig?: DataStoreRenderConfig;
    /**
     * The configuration for an application with no API being used.
     */
    noApiConfig?: NoApiRenderConfig;
  }
  export type AppId = string;
  export type AssociatedFieldsList = String[];
  export type Boolean = boolean;
  export type CodegenDependencies = CodegenDependency[];
  export interface CodegenDependency {
    /**
     * Name of the dependency package.
     */
    name?: String;
    /**
     * Indicates the version of the supported dependency package.
     */
    supportedVersion?: String;
    /**
     * Determines if the dependency package is using Semantic versioning. If set to true, it indicates that the dependency package uses Semantic versioning.
     */
    isSemVer?: Boolean;
    /**
     * Indicates the reason to include the dependency package in your project code.
     */
    reason?: String;
  }
  export interface CodegenFeatureFlags {
    /**
     * Specifes whether a code generation job supports data relationships.
     */
    isRelationshipSupported?: Boolean;
    /**
     * Specifies whether a code generation job supports non models.
     */
    isNonModelSupported?: Boolean;
  }
  export interface CodegenGenericDataEnum {
    /**
     * The list of enum values in the generic data schema.
     */
    values: CodegenGenericDataEnumValuesList;
  }
  export type CodegenGenericDataEnumValuesList = String[];
  export type CodegenGenericDataEnums = {[key: string]: CodegenGenericDataEnum};
  export interface CodegenGenericDataField {
    /**
     * The data type for the generic data field.
     */
    dataType: CodegenGenericDataFieldDataType;
    /**
     * The value of the data type for the generic data field.
     */
    dataTypeValue: String;
    /**
     * Specifies whether the generic data field is required.
     */
    required: Boolean;
    /**
     * Specifies whether the generic data field is read-only.
     */
    readOnly: Boolean;
    /**
     * Specifies whether the generic data field is an array.
     */
    isArray: Boolean;
    /**
     * The relationship of the generic data schema.
     */
    relationship?: CodegenGenericDataRelationshipType;
  }
  export type CodegenGenericDataFieldDataType = "ID"|"String"|"Int"|"Float"|"AWSDate"|"AWSTime"|"AWSDateTime"|"AWSTimestamp"|"AWSEmail"|"AWSURL"|"AWSIPAddress"|"Boolean"|"AWSJSON"|"AWSPhone"|"Enum"|"Model"|"NonModel"|string;
  export type CodegenGenericDataFields = {[key: string]: CodegenGenericDataField};
  export interface CodegenGenericDataModel {
    /**
     * The fields in the generic data model.
     */
    fields: CodegenGenericDataFields;
    /**
     * Specifies whether the generic data model is a join table.
     */
    isJoinTable?: Boolean;
    /**
     * The primary keys of the generic data model.
     */
    primaryKeys: CodegenPrimaryKeysList;
  }
  export type CodegenGenericDataModels = {[key: string]: CodegenGenericDataModel};
  export interface CodegenGenericDataNonModel {
    /**
     * The fields in a generic data schema non model.
     */
    fields: CodegenGenericDataNonModelFields;
  }
  export type CodegenGenericDataNonModelFields = {[key: string]: CodegenGenericDataField};
  export type CodegenGenericDataNonModels = {[key: string]: CodegenGenericDataNonModel};
  export interface CodegenGenericDataRelationshipType {
    /**
     * The data relationship type.
     */
    type: GenericDataRelationshipType;
    /**
     * The name of the related model in the data relationship.
     */
    relatedModelName: String;
    /**
     * The related model fields in the data relationship.
     */
    relatedModelFields?: RelatedModelFieldsList;
    /**
     * Specifies whether the relationship can unlink the associated model.
     */
    canUnlinkAssociatedModel?: Boolean;
    /**
     * The name of the related join field in the data relationship.
     */
    relatedJoinFieldName?: String;
    /**
     * The name of the related join table in the data relationship.
     */
    relatedJoinTableName?: String;
    /**
     * The value of the belongsTo field on the related data model. 
     */
    belongsToFieldOnRelatedModel?: String;
    /**
     * The associated fields of the data relationship.
     */
    associatedFields?: AssociatedFieldsList;
    /**
     * Specifies whether the @index directive is supported for a hasMany data relationship.
     */
    isHasManyIndex?: Boolean;
  }
  export interface CodegenJob {
    /**
     * The unique ID for the code generation job.
     */
    id: Uuid;
    /**
     * The ID of the Amplify app associated with the code generation job.
     */
    appId: AppId;
    /**
     * The name of the backend environment associated with the code generation job.
     */
    environmentName: String;
    renderConfig?: CodegenJobRenderConfig;
    genericDataSchema?: CodegenJobGenericDataSchema;
    /**
     * Specifies whether to autogenerate forms in the code generation job.
     */
    autoGenerateForms?: Boolean;
    features?: CodegenFeatureFlags;
    /**
     * The status of the code generation job.
     */
    status?: CodegenJobStatus;
    /**
     * The customized status message for the code generation job.
     */
    statusMessage?: String;
    /**
     * The CodegenJobAsset to use for the code generation job.
     */
    asset?: CodegenJobAsset;
    /**
     * One or more key-value pairs to use when tagging the code generation job.
     */
    tags?: Tags;
    /**
     * The time that the code generation job was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The time that the code generation job was modified.
     */
    modifiedAt?: SyntheticTimestamp_date_time;
    /**
     * Lists the dependency packages that may be required for the project code to run.
     */
    dependencies?: CodegenDependencies;
  }
  export interface CodegenJobAsset {
    /**
     * The URL to use to access the asset.
     */
    downloadUrl?: String;
  }
  export interface CodegenJobGenericDataSchema {
    /**
     * The type of the data source for the schema. Currently, the only valid value is an Amplify DataStore.
     */
    dataSourceType: CodegenJobGenericDataSourceType;
    /**
     * The name of a CodegenGenericDataModel.
     */
    models: CodegenGenericDataModels;
    /**
     * The name of a CodegenGenericDataEnum.
     */
    enums: CodegenGenericDataEnums;
    /**
     * The name of a CodegenGenericDataNonModel.
     */
    nonModels: CodegenGenericDataNonModels;
  }
  export type CodegenJobGenericDataSourceType = "DataStore"|string;
  export interface CodegenJobRenderConfig {
    /**
     * The name of the ReactStartCodegenJobData object.
     */
    react?: ReactStartCodegenJobData;
  }
  export type CodegenJobStatus = "in_progress"|"failed"|"succeeded"|string;
  export interface CodegenJobSummary {
    /**
     * The unique ID of the Amplify app associated with the code generation job.
     */
    appId: AppId;
    /**
     * The name of the backend environment associated with the code generation job.
     */
    environmentName: String;
    /**
     * The unique ID for the code generation job summary.
     */
    id: Uuid;
    /**
     * The time that the code generation job summary was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The time that the code generation job summary was modified.
     */
    modifiedAt?: SyntheticTimestamp_date_time;
  }
  export type CodegenJobSummaryList = CodegenJobSummary[];
  export type CodegenPrimaryKeysList = String[];
  export interface Component {
    /**
     * The unique ID of the Amplify app associated with the component.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the component in its original source system, such as Figma.
     */
    sourceId?: String;
    /**
     * The unique ID of the component.
     */
    id: Uuid;
    /**
     * The name of the component.
     */
    name: ComponentName;
    /**
     * The type of the component. This can be an Amplify custom UI component or another custom component.
     */
    componentType: ComponentType;
    /**
     * Describes the component's properties. You can't specify tags as a valid property for properties.
     */
    properties: ComponentProperties;
    /**
     * A list of the component's ComponentChild instances.
     */
    children?: ComponentChildList;
    /**
     * A list of the component's variants. A variant is a unique style configuration of a main component.
     */
    variants: ComponentVariants;
    /**
     * Describes the component's properties that can be overriden in a customized instance of the component. You can't specify tags as a valid property for overrides.
     */
    overrides: ComponentOverrides;
    /**
     * The information to connect a component's properties to data at runtime. You can't specify tags as a valid property for bindingProperties. 
     */
    bindingProperties: ComponentBindingProperties;
    /**
     * The data binding configuration for the component's properties. Use this for a collection component. You can't specify tags as a valid property for collectionProperties.
     */
    collectionProperties?: ComponentCollectionProperties;
    /**
     * The time that the component was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The time that the component was modified.
     */
    modifiedAt?: SyntheticTimestamp_date_time;
    /**
     * One or more key-value pairs to use when tagging the component.
     */
    tags?: Tags;
    /**
     * Describes the events that can be raised on the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     */
    events?: ComponentEvents;
    /**
     * The schema version of the component when it was imported.
     */
    schemaVersion?: String;
  }
  export type ComponentBindingProperties = {[key: string]: ComponentBindingPropertiesValue};
  export interface ComponentBindingPropertiesValue {
    /**
     * The property type.
     */
    type?: String;
    /**
     * Describes the properties to customize with data at runtime.
     */
    bindingProperties?: ComponentBindingPropertiesValueProperties;
    /**
     * The default value of the property.
     */
    defaultValue?: String;
  }
  export interface ComponentBindingPropertiesValueProperties {
    /**
     * An Amplify DataStore model.
     */
    model?: String;
    /**
     * The field to bind the data to.
     */
    field?: String;
    /**
     * A list of predicates for binding a component's properties to data.
     */
    predicates?: PredicateList;
    /**
     * An authenticated user attribute.
     */
    userAttribute?: String;
    /**
     * An Amazon S3 bucket.
     */
    bucket?: String;
    /**
     * The storage key for an Amazon S3 bucket.
     */
    key?: String;
    /**
     * The default value to assign to the property.
     */
    defaultValue?: String;
    /**
     * The name of a component slot.
     */
    slotName?: String;
  }
  export interface ComponentChild {
    /**
     * The type of the child component. 
     */
    componentType: String;
    /**
     * The name of the child component.
     */
    name: String;
    /**
     * Describes the properties of the child component. You can't specify tags as a valid property for properties.
     */
    properties: ComponentProperties;
    /**
     * The list of ComponentChild instances for this component.
     */
    children?: ComponentChildList;
    /**
     * Describes the events that can be raised on the child component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     */
    events?: ComponentEvents;
    /**
     * The unique ID of the child component in its original source system, such as Figma.
     */
    sourceId?: String;
  }
  export type ComponentChildList = ComponentChild[];
  export type ComponentCollectionProperties = {[key: string]: ComponentDataConfiguration};
  export interface ComponentConditionProperty {
    /**
     * The name of the conditional property.
     */
    property?: String;
    /**
     * The name of a field. Specify this when the property is a data model.
     */
    field?: String;
    /**
     * The operator to use to perform the evaluation, such as eq to represent equals.
     */
    operator?: String;
    /**
     * The value of the property to evaluate.
     */
    operand?: String;
    /**
     * The value to assign to the property if the condition is met.
     */
    then?: ComponentProperty;
    /**
     * The value to assign to the property if the condition is not met.
     */
    else?: ComponentProperty;
    /**
     * The type of the property to evaluate.
     */
    operandType?: String;
  }
  export interface ComponentDataConfiguration {
    /**
     * The name of the data model to use to bind data to a component.
     */
    model: String;
    /**
     * Describes how to sort the component's properties.
     */
    sort?: SortPropertyList;
    /**
     * Represents the conditional logic to use when binding data to a component. Use this property to retrieve only a subset of the data in a collection.
     */
    predicate?: Predicate;
    /**
     * A list of IDs to use to bind data to a component. Use this property to bind specifically chosen data, rather than data retrieved from a query.
     */
    identifiers?: IdentifierList;
  }
  export interface ComponentEvent {
    /**
     * The action to perform when a specific event is raised.
     */
    action?: String;
    /**
     * Describes information about the action.
     */
    parameters?: ActionParameters;
    /**
     * Binds an event to an action on a component. When you specify a bindingEvent, the event is called when the action is performed.
     */
    bindingEvent?: String;
  }
  export type ComponentEvents = {[key: string]: ComponentEvent};
  export type ComponentList = Component[];
  export type ComponentName = string;
  export type ComponentOverrides = {[key: string]: ComponentOverridesValue};
  export type ComponentOverridesValue = {[key: string]: String};
  export type ComponentProperties = {[key: string]: ComponentProperty};
  export interface ComponentProperty {
    /**
     * The value to assign to the component property.
     */
    value?: String;
    /**
     * The information to bind the component property to data at runtime.
     */
    bindingProperties?: ComponentPropertyBindingProperties;
    /**
     * The information to bind the component property to data at runtime. Use this for collection components.
     */
    collectionBindingProperties?: ComponentPropertyBindingProperties;
    /**
     * The default value to assign to the component property.
     */
    defaultValue?: String;
    /**
     * The data model to use to assign a value to the component property.
     */
    model?: String;
    /**
     * The information to bind the component property to form data.
     */
    bindings?: FormBindings;
    /**
     * An event that occurs in your app. Use this for workflow data binding.
     */
    event?: String;
    /**
     * An authenticated user attribute to use to assign a value to the component property.
     */
    userAttribute?: String;
    /**
     * A list of component properties to concatenate to create the value to assign to this component property.
     */
    concat?: ComponentPropertyList;
    /**
     * The conditional expression to use to assign a value to the component property.
     */
    condition?: ComponentConditionProperty;
    /**
     * Specifies whether the user configured the property in Amplify Studio after importing it.
     */
    configured?: Boolean;
    /**
     * The component type.
     */
    type?: String;
    /**
     * The default value assigned to the property when the component is imported into an app.
     */
    importedValue?: String;
    /**
     * The name of the component that is affected by an event.
     */
    componentName?: String;
    /**
     * The name of the component's property that is affected by an event.
     */
    property?: String;
  }
  export interface ComponentPropertyBindingProperties {
    /**
     * The component property to bind to the data field.
     */
    property: String;
    /**
     * The data field to bind the property to.
     */
    field?: String;
  }
  export type ComponentPropertyList = ComponentProperty[];
  export interface ComponentSummary {
    /**
     * The unique ID of the Amplify app associated with the component.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the component.
     */
    id: Uuid;
    /**
     * The name of the component.
     */
    name: ComponentName;
    /**
     * The component type.
     */
    componentType: ComponentType;
  }
  export type ComponentSummaryList = ComponentSummary[];
  export type ComponentType = string;
  export interface ComponentVariant {
    /**
     * The combination of variants that comprise this variant. You can't specify tags as a valid property for variantValues.
     */
    variantValues?: ComponentVariantValues;
    /**
     * The properties of the component variant that can be overriden when customizing an instance of the component. You can't specify tags as a valid property for overrides.
     */
    overrides?: ComponentOverrides;
  }
  export type ComponentVariantValues = {[key: string]: String};
  export type ComponentVariants = ComponentVariant[];
  export interface CreateComponentData {
    /**
     * The name of the component
     */
    name: ComponentName;
    /**
     * The unique ID of the component in its original source system, such as Figma.
     */
    sourceId?: String;
    /**
     * The component type. This can be an Amplify custom UI component or another custom component.
     */
    componentType: ComponentType;
    /**
     * Describes the component's properties.
     */
    properties: ComponentProperties;
    /**
     * A list of child components that are instances of the main component.
     */
    children?: ComponentChildList;
    /**
     * A list of the unique variants of this component.
     */
    variants: ComponentVariants;
    /**
     * Describes the component properties that can be overriden to customize an instance of the component.
     */
    overrides: ComponentOverrides;
    /**
     * The data binding information for the component's properties.
     */
    bindingProperties: ComponentBindingProperties;
    /**
     * The data binding configuration for customizing a component's properties. Use this for a collection component.
     */
    collectionProperties?: ComponentCollectionProperties;
    /**
     * One or more key-value pairs to use when tagging the component data.
     */
    tags?: Tags;
    /**
     * The event configuration for the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     */
    events?: ComponentEvents;
    /**
     * The schema version of the component when it was imported.
     */
    schemaVersion?: String;
  }
  export interface CreateComponentRequest {
    /**
     * The unique ID of the Amplify app to associate with the component.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique client token.
     */
    clientToken?: String;
    /**
     * Represents the configuration of the component to create.
     */
    componentToCreate: CreateComponentData;
  }
  export interface CreateComponentResponse {
    /**
     * Describes the configuration of the new component.
     */
    entity?: Component;
  }
  export interface CreateFormData {
    /**
     * The name of the form.
     */
    name: FormName;
    /**
     * The type of data source to use to create the form.
     */
    dataType: FormDataTypeConfig;
    /**
     * Specifies whether to perform a create or update action on the form.
     */
    formActionType: FormActionType;
    /**
     * The configuration information for the form's fields.
     */
    fields: FieldsMap;
    /**
     * The configuration for the form's style.
     */
    style: FormStyle;
    /**
     * The configuration information for the visual helper elements for the form. These elements are not associated with any data.
     */
    sectionalElements: SectionalElementMap;
    /**
     * The schema version of the form.
     */
    schemaVersion: String;
    /**
     * The FormCTA object that stores the call to action configuration for the form.
     */
    cta?: FormCTA;
    /**
     * One or more key-value pairs to use when tagging the form data.
     */
    tags?: Tags;
    /**
     * Specifies an icon or decoration to display on the form.
     */
    labelDecorator?: LabelDecorator;
  }
  export interface CreateFormRequest {
    /**
     * The unique ID of the Amplify app to associate with the form.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique client token.
     */
    clientToken?: String;
    /**
     * Represents the configuration of the form to create.
     */
    formToCreate: CreateFormData;
  }
  export interface CreateFormResponse {
    /**
     * Describes the configuration of the new form.
     */
    entity?: Form;
  }
  export interface CreateThemeData {
    /**
     * The name of the theme.
     */
    name: ThemeName;
    /**
     * A list of key-value pairs that deﬁnes the properties of the theme.
     */
    values: ThemeValuesList;
    /**
     * Describes the properties that can be overriden to customize an instance of the theme.
     */
    overrides?: ThemeValuesList;
    /**
     * One or more key-value pairs to use when tagging the theme data.
     */
    tags?: Tags;
  }
  export interface CreateThemeRequest {
    /**
     * The unique ID of the Amplify app associated with the theme.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique client token.
     */
    clientToken?: String;
    /**
     * Represents the configuration of the theme to create.
     */
    themeToCreate: CreateThemeData;
  }
  export interface CreateThemeResponse {
    /**
     * Describes the configuration of the new theme.
     */
    entity?: Theme;
  }
  export interface DataStoreRenderConfig {
  }
  export interface DeleteComponentRequest {
    /**
     * The unique ID of the Amplify app associated with the component to delete.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the component to delete.
     */
    id: Uuid;
  }
  export interface DeleteFormRequest {
    /**
     * The unique ID of the Amplify app associated with the form to delete.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the form to delete.
     */
    id: Uuid;
  }
  export interface DeleteThemeRequest {
    /**
     * The unique ID of the Amplify app associated with the theme to delete.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the theme to delete.
     */
    id: Uuid;
  }
  export interface ExchangeCodeForTokenRequest {
    /**
     * The third-party provider for the token. The only valid value is figma.
     */
    provider: TokenProviders;
    /**
     * Describes the configuration of the request.
     */
    request: ExchangeCodeForTokenRequestBody;
  }
  export interface ExchangeCodeForTokenRequestBody {
    /**
     * The access code to send in the request.
     */
    code: SensitiveString;
    /**
     * The location of the application that will receive the access code.
     */
    redirectUri: String;
    /**
     * The ID of the client to request the token from.
     */
    clientId?: SensitiveString;
  }
  export interface ExchangeCodeForTokenResponse {
    /**
     * The access token.
     */
    accessToken: SensitiveString;
    /**
     * The date and time when the new access token expires.
     */
    expiresIn: Integer;
    /**
     * The token to use to refresh a previously issued access token that might have expired.
     */
    refreshToken: SensitiveString;
  }
  export interface ExportComponentsRequest {
    /**
     * The unique ID of the Amplify app to export components to.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
  }
  export interface ExportComponentsResponse {
    /**
     * Represents the configuration of the exported components.
     */
    entities: ComponentList;
    /**
     * The pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export interface ExportFormsRequest {
    /**
     * The unique ID of the Amplify app to export forms to.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
  }
  export interface ExportFormsResponse {
    /**
     * Represents the configuration of the exported forms.
     */
    entities: FormList;
    /**
     * The pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export interface ExportThemesRequest {
    /**
     * The unique ID of the Amplify app to export the themes to.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
  }
  export interface ExportThemesResponse {
    /**
     * Represents the configuration of the exported themes.
     */
    entities: ThemeList;
    /**
     * The pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export type FeaturesMap = {[key: string]: String};
  export interface FieldConfig {
    /**
     * The label for the field.
     */
    label?: String;
    /**
     * Specifies the field position.
     */
    position?: FieldPosition;
    /**
     * Specifies whether to hide a field.
     */
    excluded?: Boolean;
    /**
     * Describes the configuration for the default input value to display for a field.
     */
    inputType?: FieldInputConfig;
    /**
     * The validations to perform on the value in the field.
     */
    validations?: ValidationsList;
  }
  export interface FieldInputConfig {
    /**
     * The input type for the field. 
     */
    type: String;
    /**
     * Specifies a field that requires input.
     */
    required?: Boolean;
    /**
     * Specifies a read only field.
     */
    readOnly?: Boolean;
    /**
     * The text to display as a placeholder for the field.
     */
    placeholder?: String;
    /**
     * The default value for the field.
     */
    defaultValue?: String;
    /**
     * The text to display to describe the field.
     */
    descriptiveText?: String;
    /**
     * Specifies whether a field has a default value.
     */
    defaultChecked?: Boolean;
    /**
     * The default country code for a phone number.
     */
    defaultCountryCode?: String;
    /**
     * The information to use to customize the input fields with data at runtime.
     */
    valueMappings?: ValueMappings;
    /**
     * The name of the field.
     */
    name?: String;
    /**
     * The minimum value to display for the field.
     */
    minValue?: Float;
    /**
     * The maximum value to display for the field.
     */
    maxValue?: Float;
    /**
     * The stepping increment for a numeric value in a field.
     */
    step?: Float;
    /**
     * The value for the field.
     */
    value?: String;
    /**
     * Specifies whether to render the field as an array. This property is ignored if the dataSourceType for the form is a Data Store.
     */
    isArray?: Boolean;
    /**
     * The configuration for the file uploader field.
     */
    fileUploaderConfig?: FileUploaderFieldConfig;
  }
  export interface FieldPosition {
    /**
     * The field position is fixed and doesn't change in relation to other fields.
     */
    fixed?: FixedPosition;
    /**
     * The field position is to the right of the field specified by the string.
     */
    rightOf?: String;
    /**
     * The field position is below the field specified by the string.
     */
    below?: String;
  }
  export interface FieldValidationConfiguration {
    /**
     * The validation to perform on an object type. 
     */
    type: String;
    /**
     * The validation to perform on a string value.
     */
    strValues?: StrValues;
    /**
     * The validation to perform on a number value.
     */
    numValues?: NumValues;
    /**
     * The validation message to display.
     */
    validationMessage?: String;
  }
  export type FieldsMap = {[key: string]: FieldConfig};
  export interface FileUploaderFieldConfig {
    /**
     * The access level to assign to the uploaded files in the Amazon S3 bucket where they are stored. The valid values for this property are private, protected, or public. For detailed information about the permissions associated with each access level, see File access levels in the Amplify documentation.
     */
    accessLevel: StorageAccessLevel;
    /**
     * The file types that are allowed to be uploaded by the file uploader. Provide this information in an array of strings specifying the valid file extensions.
     */
    acceptedFileTypes: StrValues;
    /**
     * Specifies whether to display or hide the image preview after selecting a file for upload. The default value is true to display the image preview.
     */
    showThumbnails?: Boolean;
    /**
     * Allows the file upload operation to be paused and resumed. The default value is false. When isResumable is set to true, the file uploader uses a multipart upload to break the files into chunks before upload. The progress of the upload isn't continuous, because the file uploader uploads a chunk at a time.
     */
    isResumable?: Boolean;
    /**
     * Specifies the maximum number of files that can be selected to upload. The default value is an unlimited number of files.
     */
    maxFileCount?: Integer;
    /**
     * The maximum file size in bytes that the file uploader will accept. The default value is an unlimited file size.
     */
    maxSize?: Integer;
  }
  export type FixedPosition = "first"|string;
  export type Float = number;
  export interface Form {
    /**
     * The unique ID of the Amplify app associated with the form.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the form.
     */
    id: Uuid;
    /**
     * The name of the form.
     */
    name: FormName;
    /**
     * The operation to perform on the specified form.
     */
    formActionType: FormActionType;
    /**
     * Stores the configuration for the form's style.
     */
    style: FormStyle;
    /**
     * The type of data source to use to create the form.
     */
    dataType: FormDataTypeConfig;
    /**
     * Stores the information about the form's fields.
     */
    fields: FieldsMap;
    /**
     * Stores the visual helper elements for the form that are not associated with any data.
     */
    sectionalElements: SectionalElementMap;
    /**
     * The schema version of the form when it was imported.
     */
    schemaVersion: String;
    /**
     * One or more key-value pairs to use when tagging the form.
     */
    tags?: Tags;
    /**
     * Stores the call to action configuration for the form.
     */
    cta?: FormCTA;
    /**
     * Specifies an icon or decoration to display on the form.
     */
    labelDecorator?: LabelDecorator;
  }
  export type FormActionType = "create"|"update"|string;
  export interface FormBindingElement {
    /**
     * The name of the component to retrieve a value from.
     */
    element: String;
    /**
     * The property to retrieve a value from.
     */
    property: String;
  }
  export type FormBindings = {[key: string]: FormBindingElement};
  export interface FormButton {
    /**
     * Specifies whether the button is visible on the form.
     */
    excluded?: Boolean;
    /**
     * Describes the button's properties.
     */
    children?: String;
    /**
     * The position of the button.
     */
    position?: FieldPosition;
  }
  export type FormButtonsPosition = "top"|"bottom"|"top_and_bottom"|string;
  export interface FormCTA {
    /**
     * The position of the button.
     */
    position?: FormButtonsPosition;
    /**
     * Displays a clear button.
     */
    clear?: FormButton;
    /**
     * Displays a cancel button.
     */
    cancel?: FormButton;
    /**
     * Displays a submit button.
     */
    submit?: FormButton;
  }
  export type FormDataSourceType = "DataStore"|"Custom"|string;
  export interface FormDataTypeConfig {
    /**
     * The data source type, either an Amplify DataStore model or a custom data type.
     */
    dataSourceType: FormDataSourceType;
    /**
     * The unique name of the data type you are using as the data source for the form.
     */
    dataTypeName: String;
  }
  export type FormInputBindingProperties = {[key: string]: FormInputBindingPropertiesValue};
  export interface FormInputBindingPropertiesValue {
    /**
     * The property type.
     */
    type?: String;
    /**
     * Describes the properties to customize with data at runtime.
     */
    bindingProperties?: FormInputBindingPropertiesValueProperties;
  }
  export interface FormInputBindingPropertiesValueProperties {
    /**
     * An Amplify DataStore model.
     */
    model?: String;
  }
  export interface FormInputValueProperty {
    /**
     * The value to assign to the input field.
     */
    value?: String;
    /**
     * The information to bind fields to data at runtime.
     */
    bindingProperties?: FormInputValuePropertyBindingProperties;
    /**
     * A list of form properties to concatenate to create the value to assign to this field property.
     */
    concat?: FormInputValuePropertyList;
  }
  export interface FormInputValuePropertyBindingProperties {
    /**
     * The form property to bind to the data field.
     */
    property: String;
    /**
     * The data field to bind the property to.
     */
    field?: String;
  }
  export type FormInputValuePropertyList = FormInputValueProperty[];
  export type FormList = Form[];
  export type FormName = string;
  export interface FormStyle {
    /**
     * The spacing for the horizontal gap.
     */
    horizontalGap?: FormStyleConfig;
    /**
     * The spacing for the vertical gap.
     */
    verticalGap?: FormStyleConfig;
    /**
     * The size of the outer padding for the form.
     */
    outerPadding?: FormStyleConfig;
  }
  export interface FormStyleConfig {
    /**
     * A reference to a design token to use to bind the form's style properties to an existing theme.
     */
    tokenReference?: String;
    /**
     * The value of the style setting.
     */
    value?: String;
  }
  export interface FormSummary {
    /**
     * The unique ID for the app associated with the form summary.
     */
    appId: String;
    /**
     * The form's data source type.
     */
    dataType: FormDataTypeConfig;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The type of operation to perform on the form.
     */
    formActionType: FormActionType;
    /**
     * The ID of the form.
     */
    id: Uuid;
    /**
     * The name of the form.
     */
    name: FormName;
  }
  export type FormSummaryList = FormSummary[];
  export type GenericDataRelationshipType = "HAS_MANY"|"HAS_ONE"|"BELONGS_TO"|string;
  export interface GetCodegenJobRequest {
    /**
     * The unique ID of the Amplify app associated with the code generation job.
     */
    appId: AppId;
    /**
     * The name of the backend environment that is a part of the Amplify app associated with the code generation job.
     */
    environmentName: String;
    /**
     * The unique ID of the code generation job.
     */
    id: Uuid;
  }
  export interface GetCodegenJobResponse {
    /**
     * The configuration settings for the code generation job.
     */
    job?: CodegenJob;
  }
  export interface GetComponentRequest {
    /**
     * The unique ID of the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the component.
     */
    id: Uuid;
  }
  export interface GetComponentResponse {
    /**
     * Represents the configuration settings for the component.
     */
    component?: Component;
  }
  export interface GetFormRequest {
    /**
     * The unique ID of the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID of the form.
     */
    id: Uuid;
  }
  export interface GetFormResponse {
    /**
     * Represents the configuration settings for the form.
     */
    form?: Form;
  }
  export interface GetMetadataRequest {
    /**
     * The unique ID of the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
  }
  export interface GetMetadataResponse {
    /**
     * Represents the configuration settings for the features metadata.
     */
    features: FeaturesMap;
  }
  export interface GetThemeRequest {
    /**
     * The unique ID of the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID for the theme.
     */
    id: Uuid;
  }
  export interface GetThemeResponse {
    /**
     * Represents the configuration settings for the theme.
     */
    theme?: Theme;
  }
  export interface GraphQLRenderConfig {
    /**
     * The path to the GraphQL types file, relative to the component output directory.
     */
    typesFilePath: String;
    /**
     * The path to the GraphQL queries file, relative to the component output directory.
     */
    queriesFilePath: String;
    /**
     * The path to the GraphQL mutations file, relative to the component output directory.
     */
    mutationsFilePath: String;
    /**
     * The path to the GraphQL subscriptions file, relative to the component output directory.
     */
    subscriptionsFilePath: String;
    /**
     * The path to the GraphQL fragments file, relative to the component output directory.
     */
    fragmentsFilePath: String;
  }
  export type IdentifierList = String[];
  export type Integer = number;
  export type JSModule = "es2020"|"esnext"|string;
  export type JSScript = "jsx"|"tsx"|"js"|string;
  export type JSTarget = "es2015"|"es2020"|string;
  export type LabelDecorator = "required"|"optional"|"none"|string;
  export type ListCodegenJobsLimit = number;
  export interface ListCodegenJobsRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: AppId;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of jobs to retrieve.
     */
    maxResults?: ListCodegenJobsLimit;
  }
  export interface ListCodegenJobsResponse {
    /**
     * The list of code generation jobs for the Amplify app.
     */
    entities: CodegenJobSummaryList;
    /**
     * The pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export type ListComponentsLimit = number;
  export interface ListComponentsRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of components to retrieve.
     */
    maxResults?: ListComponentsLimit;
  }
  export interface ListComponentsResponse {
    /**
     * The list of components for the Amplify app.
     */
    entities: ComponentSummaryList;
    /**
     * The pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export type ListFormsLimit = number;
  export interface ListFormsRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of forms to retrieve.
     */
    maxResults?: ListFormsLimit;
  }
  export interface ListFormsResponse {
    /**
     * The list of forms for the Amplify app.
     */
    entities: FormSummaryList;
    /**
     * The pagination token that's included if more results are available.
     */
    nextToken?: String;
  }
  export type ListThemesLimit = number;
  export interface ListThemesRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The token to request the next page of results.
     */
    nextToken?: String;
    /**
     * The maximum number of theme results to return in the response.
     */
    maxResults?: ListThemesLimit;
  }
  export interface ListThemesResponse {
    /**
     * The list of themes for the Amplify app.
     */
    entities: ThemeSummaryList;
    /**
     * The pagination token that's returned if more results are available.
     */
    nextToken?: String;
  }
  export interface MutationActionSetStateParameter {
    /**
     * The name of the component that is being modified.
     */
    componentName: String;
    /**
     * The name of the component property to apply the state configuration to.
     */
    property: String;
    /**
     * The state configuration to assign to the property.
     */
    set: ComponentProperty;
  }
  export interface NoApiRenderConfig {
  }
  export type NumValues = Integer[];
  export type OperandType = string;
  export interface Predicate {
    /**
     * A list of predicates to combine logically.
     */
    or?: PredicateList;
    /**
     * A list of predicates to combine logically.
     */
    and?: PredicateList;
    /**
     * The field to query.
     */
    field?: String;
    /**
     * The operator to use to perform the evaluation.
     */
    operator?: String;
    /**
     * The value to use when performing the evaluation.
     */
    operand?: String;
    /**
     * The type of value to use when performing the evaluation.
     */
    operandType?: OperandType;
  }
  export type PredicateList = Predicate[];
  export interface PutMetadataFlagBody {
    /**
     * The new information to store.
     */
    newValue: String;
  }
  export interface PutMetadataFlagRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The name of the feature associated with the metadata.
     */
    featureName: String;
    /**
     * The metadata information to store.
     */
    body: PutMetadataFlagBody;
  }
  export type ReactCodegenDependencies = {[key: string]: String};
  export interface ReactStartCodegenJobData {
    /**
     * The JavaScript module type.
     */
    module?: JSModule;
    /**
     * The ECMAScript specification to use.
     */
    target?: JSTarget;
    /**
     * The file type to use for a JavaScript project.
     */
    script?: JSScript;
    /**
     * Specifies whether the code generation job should render type declaration files.
     */
    renderTypeDeclarations?: Boolean;
    /**
     * Specifies whether the code generation job should render inline source maps.
     */
    inlineSourceMap?: Boolean;
    /**
     * The API configuration for the code generation job.
     */
    apiConfiguration?: ApiConfiguration;
    /**
     * Lists the dependency packages that may be required for the project code to run.
     */
    dependencies?: ReactCodegenDependencies;
  }
  export interface RefreshTokenRequest {
    /**
     * The third-party provider for the token. The only valid value is figma.
     */
    provider: TokenProviders;
    /**
     * Information about the refresh token request.
     */
    refreshTokenBody: RefreshTokenRequestBody;
  }
  export interface RefreshTokenRequestBody {
    /**
     * The token to use to refresh a previously issued access token that might have expired.
     */
    token: SensitiveString;
    /**
     * The ID of the client to request the token from.
     */
    clientId?: SensitiveString;
  }
  export interface RefreshTokenResponse {
    /**
     * The access token.
     */
    accessToken: SensitiveString;
    /**
     * The date and time when the new access token expires.
     */
    expiresIn: Integer;
  }
  export type RelatedModelFieldsList = String[];
  export interface SectionalElement {
    /**
     * The type of sectional element. Valid values are Heading, Text, and Divider.
     */
    type: String;
    /**
     * Specifies the position of the text in a field for a Text sectional element.
     */
    position?: FieldPosition;
    /**
     * The text for a Text sectional element.
     */
    text?: String;
    /**
     * Specifies the size of the font for a Heading sectional element. Valid values are 1 | 2 | 3 | 4 | 5 | 6.
     */
    level?: Integer;
    /**
     * Specifies the orientation for a Divider sectional element. Valid values are horizontal or vertical.
     */
    orientation?: String;
    /**
     * Excludes a sectional element that was generated by default for a specified data model.
     */
    excluded?: Boolean;
  }
  export type SectionalElementMap = {[key: string]: SectionalElement};
  export type SensitiveString = string;
  export type SortDirection = "ASC"|"DESC"|string;
  export interface SortProperty {
    /**
     * The field to perform the sort on.
     */
    field: String;
    /**
     * The direction of the sort, either ascending or descending.
     */
    direction: SortDirection;
  }
  export type SortPropertyList = SortProperty[];
  export interface StartCodegenJobData {
    /**
     * The code generation configuration for the codegen job.
     */
    renderConfig: CodegenJobRenderConfig;
    /**
     * The data schema to use for a code generation job.
     */
    genericDataSchema?: CodegenJobGenericDataSchema;
    /**
     * Specifies whether to autogenerate forms in the code generation job.
     */
    autoGenerateForms?: Boolean;
    /**
     * The feature flags for a code generation job.
     */
    features?: CodegenFeatureFlags;
    /**
     * One or more key-value pairs to use when tagging the code generation job data.
     */
    tags?: Tags;
  }
  export interface StartCodegenJobRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: AppId;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The idempotency token used to ensure that the code generation job request completes only once.
     */
    clientToken?: String;
    /**
     * The code generation job resource configuration.
     */
    codegenJobToCreate: StartCodegenJobData;
  }
  export interface StartCodegenJobResponse {
    /**
     * The code generation job for a UI component that is associated with an Amplify app.
     */
    entity?: CodegenJob;
  }
  export type StorageAccessLevel = "public"|"protected"|"private"|string;
  export type StrValues = String[];
  export type String = string;
  export type SyntheticTimestamp_date_time = Date;
  export type TagKey = string;
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export interface Theme {
    /**
     * The unique ID for the Amplify app associated with the theme.
     */
    appId: String;
    /**
     * The name of the backend environment that is a part of the Amplify app.
     */
    environmentName: String;
    /**
     * The ID for the theme.
     */
    id: Uuid;
    /**
     * The name of the theme.
     */
    name: ThemeName;
    /**
     * The time that the theme was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The time that the theme was modified.
     */
    modifiedAt?: SyntheticTimestamp_date_time;
    /**
     * A list of key-value pairs that defines the properties of the theme.
     */
    values: ThemeValuesList;
    /**
     * Describes the properties that can be overriden to customize a theme.
     */
    overrides?: ThemeValuesList;
    /**
     * One or more key-value pairs to use when tagging the theme.
     */
    tags?: Tags;
  }
  export type ThemeList = Theme[];
  export type ThemeName = string;
  export interface ThemeSummary {
    /**
     * The unique ID for the app associated with the theme summary.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The ID of the theme.
     */
    id: Uuid;
    /**
     * The name of the theme.
     */
    name: ThemeName;
  }
  export type ThemeSummaryList = ThemeSummary[];
  export interface ThemeValue {
    /**
     * The value of a theme property.
     */
    value?: String;
    /**
     * A list of key-value pairs that define the theme's properties.
     */
    children?: ThemeValuesList;
  }
  export interface ThemeValues {
    /**
     * The name of the property.
     */
    key?: String;
    /**
     * The value of the property.
     */
    value?: ThemeValue;
  }
  export type ThemeValuesList = ThemeValues[];
  export type TokenProviders = "figma"|string;
  export interface UpdateComponentData {
    /**
     * The unique ID of the component to update.
     */
    id?: Uuid;
    /**
     * The name of the component to update.
     */
    name?: ComponentName;
    /**
     * The unique ID of the component in its original source system, such as Figma.
     */
    sourceId?: String;
    /**
     * The type of the component. This can be an Amplify custom UI component or another custom component.
     */
    componentType?: ComponentType;
    /**
     * Describes the component's properties.
     */
    properties?: ComponentProperties;
    /**
     * The components that are instances of the main component.
     */
    children?: ComponentChildList;
    /**
     * A list of the unique variants of the main component being updated.
     */
    variants?: ComponentVariants;
    /**
     * Describes the properties that can be overriden to customize the component.
     */
    overrides?: ComponentOverrides;
    /**
     * The data binding information for the component's properties.
     */
    bindingProperties?: ComponentBindingProperties;
    /**
     * The configuration for binding a component's properties to a data model. Use this for a collection component.
     */
    collectionProperties?: ComponentCollectionProperties;
    /**
     * The event configuration for the component. Use for the workflow feature in Amplify Studio that allows you to bind events and actions to components.
     */
    events?: ComponentEvents;
    /**
     * The schema version of the component when it was imported.
     */
    schemaVersion?: String;
  }
  export interface UpdateComponentRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID for the component.
     */
    id: Uuid;
    /**
     * The unique client token.
     */
    clientToken?: String;
    /**
     * The configuration of the updated component.
     */
    updatedComponent: UpdateComponentData;
  }
  export interface UpdateComponentResponse {
    /**
     * Describes the configuration of the updated component.
     */
    entity?: Component;
  }
  export interface UpdateFormData {
    /**
     * The name of the form.
     */
    name?: FormName;
    /**
     * The type of data source to use to create the form.
     */
    dataType?: FormDataTypeConfig;
    /**
     * Specifies whether to perform a create or update action on the form.
     */
    formActionType?: FormActionType;
    /**
     * The configuration information for the form's fields.
     */
    fields?: FieldsMap;
    /**
     * The configuration for the form's style.
     */
    style?: FormStyle;
    /**
     * The configuration information for the visual helper elements for the form. These elements are not associated with any data.
     */
    sectionalElements?: SectionalElementMap;
    /**
     * The schema version of the form.
     */
    schemaVersion?: String;
    /**
     * The FormCTA object that stores the call to action configuration for the form.
     */
    cta?: FormCTA;
    /**
     * Specifies an icon or decoration to display on the form.
     */
    labelDecorator?: LabelDecorator;
  }
  export interface UpdateFormRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID for the form.
     */
    id: Uuid;
    /**
     * The unique client token.
     */
    clientToken?: String;
    /**
     * The request accepts the following data in JSON format.
     */
    updatedForm: UpdateFormData;
  }
  export interface UpdateFormResponse {
    /**
     * Describes the configuration of the updated form.
     */
    entity?: Form;
  }
  export interface UpdateThemeData {
    /**
     * The unique ID of the theme to update.
     */
    id?: Uuid;
    /**
     * The name of the theme to update.
     */
    name?: ThemeName;
    /**
     * A list of key-value pairs that define the theme's properties.
     */
    values: ThemeValuesList;
    /**
     * Describes the properties that can be overriden to customize the theme.
     */
    overrides?: ThemeValuesList;
  }
  export interface UpdateThemeRequest {
    /**
     * The unique ID for the Amplify app.
     */
    appId: String;
    /**
     * The name of the backend environment that is part of the Amplify app.
     */
    environmentName: String;
    /**
     * The unique ID for the theme.
     */
    id: Uuid;
    /**
     * The unique client token.
     */
    clientToken?: String;
    /**
     * The configuration of the updated theme.
     */
    updatedTheme: UpdateThemeData;
  }
  export interface UpdateThemeResponse {
    /**
     * Describes the configuration of the updated theme.
     */
    entity?: Theme;
  }
  export type Uuid = string;
  export type ValidationsList = FieldValidationConfiguration[];
  export interface ValueMapping {
    /**
     * The value to display for the complex object.
     */
    displayValue?: FormInputValueProperty;
    /**
     * The complex object.
     */
    value: FormInputValueProperty;
  }
  export type ValueMappingList = ValueMapping[];
  export interface ValueMappings {
    /**
     * The value and display value pairs.
     */
    values: ValueMappingList;
    /**
     * The information to bind fields to data at runtime.
     */
    bindingProperties?: FormInputBindingProperties;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-08-11"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AmplifyUIBuilder client.
   */
  export import Types = AmplifyUIBuilder;
}
export = AmplifyUIBuilder;
