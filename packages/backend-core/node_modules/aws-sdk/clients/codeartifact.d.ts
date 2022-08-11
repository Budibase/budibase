import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class CodeArtifact extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeArtifact.Types.ClientConfiguration)
  config: Config & CodeArtifact.Types.ClientConfiguration;
  /**
   * Adds an existing external connection to a repository. One external connection is allowed per repository.  A repository can have one or more upstream repositories, or an external connection. 
   */
  associateExternalConnection(params: CodeArtifact.Types.AssociateExternalConnectionRequest, callback?: (err: AWSError, data: CodeArtifact.Types.AssociateExternalConnectionResult) => void): Request<CodeArtifact.Types.AssociateExternalConnectionResult, AWSError>;
  /**
   * Adds an existing external connection to a repository. One external connection is allowed per repository.  A repository can have one or more upstream repositories, or an external connection. 
   */
  associateExternalConnection(callback?: (err: AWSError, data: CodeArtifact.Types.AssociateExternalConnectionResult) => void): Request<CodeArtifact.Types.AssociateExternalConnectionResult, AWSError>;
  /**
   *  Copies package versions from one repository to another repository in the same domain.    You must specify versions or versionRevisions. You cannot specify both.  
   */
  copyPackageVersions(params: CodeArtifact.Types.CopyPackageVersionsRequest, callback?: (err: AWSError, data: CodeArtifact.Types.CopyPackageVersionsResult) => void): Request<CodeArtifact.Types.CopyPackageVersionsResult, AWSError>;
  /**
   *  Copies package versions from one repository to another repository in the same domain.    You must specify versions or versionRevisions. You cannot specify both.  
   */
  copyPackageVersions(callback?: (err: AWSError, data: CodeArtifact.Types.CopyPackageVersionsResult) => void): Request<CodeArtifact.Types.CopyPackageVersionsResult, AWSError>;
  /**
   *  Creates a domain. CodeArtifact domains make it easier to manage multiple repositories across an organization. You can use a domain to apply permissions across many repositories owned by different AWS accounts. An asset is stored only once in a domain, even if it's in multiple repositories.  Although you can have multiple domains, we recommend a single production domain that contains all published artifacts so that your development teams can find and share packages. You can use a second pre-production domain to test changes to the production domain configuration. 
   */
  createDomain(params: CodeArtifact.Types.CreateDomainRequest, callback?: (err: AWSError, data: CodeArtifact.Types.CreateDomainResult) => void): Request<CodeArtifact.Types.CreateDomainResult, AWSError>;
  /**
   *  Creates a domain. CodeArtifact domains make it easier to manage multiple repositories across an organization. You can use a domain to apply permissions across many repositories owned by different AWS accounts. An asset is stored only once in a domain, even if it's in multiple repositories.  Although you can have multiple domains, we recommend a single production domain that contains all published artifacts so that your development teams can find and share packages. You can use a second pre-production domain to test changes to the production domain configuration. 
   */
  createDomain(callback?: (err: AWSError, data: CodeArtifact.Types.CreateDomainResult) => void): Request<CodeArtifact.Types.CreateDomainResult, AWSError>;
  /**
   *  Creates a repository. 
   */
  createRepository(params: CodeArtifact.Types.CreateRepositoryRequest, callback?: (err: AWSError, data: CodeArtifact.Types.CreateRepositoryResult) => void): Request<CodeArtifact.Types.CreateRepositoryResult, AWSError>;
  /**
   *  Creates a repository. 
   */
  createRepository(callback?: (err: AWSError, data: CodeArtifact.Types.CreateRepositoryResult) => void): Request<CodeArtifact.Types.CreateRepositoryResult, AWSError>;
  /**
   *  Deletes a domain. You cannot delete a domain that contains repositories. If you want to delete a domain with repositories, first delete its repositories. 
   */
  deleteDomain(params: CodeArtifact.Types.DeleteDomainRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DeleteDomainResult) => void): Request<CodeArtifact.Types.DeleteDomainResult, AWSError>;
  /**
   *  Deletes a domain. You cannot delete a domain that contains repositories. If you want to delete a domain with repositories, first delete its repositories. 
   */
  deleteDomain(callback?: (err: AWSError, data: CodeArtifact.Types.DeleteDomainResult) => void): Request<CodeArtifact.Types.DeleteDomainResult, AWSError>;
  /**
   *  Deletes the resource policy set on a domain. 
   */
  deleteDomainPermissionsPolicy(params: CodeArtifact.Types.DeleteDomainPermissionsPolicyRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DeleteDomainPermissionsPolicyResult) => void): Request<CodeArtifact.Types.DeleteDomainPermissionsPolicyResult, AWSError>;
  /**
   *  Deletes the resource policy set on a domain. 
   */
  deleteDomainPermissionsPolicy(callback?: (err: AWSError, data: CodeArtifact.Types.DeleteDomainPermissionsPolicyResult) => void): Request<CodeArtifact.Types.DeleteDomainPermissionsPolicyResult, AWSError>;
  /**
   *  Deletes one or more versions of a package. A deleted package version cannot be restored in your repository. If you want to remove a package version from your repository and be able to restore it later, set its status to Archived. Archived packages cannot be downloaded from a repository and don't show up with list package APIs (for example, ListackageVersions), but you can restore them using UpdatePackageVersionsStatus. 
   */
  deletePackageVersions(params: CodeArtifact.Types.DeletePackageVersionsRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DeletePackageVersionsResult) => void): Request<CodeArtifact.Types.DeletePackageVersionsResult, AWSError>;
  /**
   *  Deletes one or more versions of a package. A deleted package version cannot be restored in your repository. If you want to remove a package version from your repository and be able to restore it later, set its status to Archived. Archived packages cannot be downloaded from a repository and don't show up with list package APIs (for example, ListackageVersions), but you can restore them using UpdatePackageVersionsStatus. 
   */
  deletePackageVersions(callback?: (err: AWSError, data: CodeArtifact.Types.DeletePackageVersionsResult) => void): Request<CodeArtifact.Types.DeletePackageVersionsResult, AWSError>;
  /**
   *  Deletes a repository. 
   */
  deleteRepository(params: CodeArtifact.Types.DeleteRepositoryRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DeleteRepositoryResult) => void): Request<CodeArtifact.Types.DeleteRepositoryResult, AWSError>;
  /**
   *  Deletes a repository. 
   */
  deleteRepository(callback?: (err: AWSError, data: CodeArtifact.Types.DeleteRepositoryResult) => void): Request<CodeArtifact.Types.DeleteRepositoryResult, AWSError>;
  /**
   *  Deletes the resource policy that is set on a repository. After a resource policy is deleted, the permissions allowed and denied by the deleted policy are removed. The effect of deleting a resource policy might not be immediate.    Use DeleteRepositoryPermissionsPolicy with caution. After a policy is deleted, AWS users, roles, and accounts lose permissions to perform the repository actions granted by the deleted policy.  
   */
  deleteRepositoryPermissionsPolicy(params: CodeArtifact.Types.DeleteRepositoryPermissionsPolicyRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DeleteRepositoryPermissionsPolicyResult) => void): Request<CodeArtifact.Types.DeleteRepositoryPermissionsPolicyResult, AWSError>;
  /**
   *  Deletes the resource policy that is set on a repository. After a resource policy is deleted, the permissions allowed and denied by the deleted policy are removed. The effect of deleting a resource policy might not be immediate.    Use DeleteRepositoryPermissionsPolicy with caution. After a policy is deleted, AWS users, roles, and accounts lose permissions to perform the repository actions granted by the deleted policy.  
   */
  deleteRepositoryPermissionsPolicy(callback?: (err: AWSError, data: CodeArtifact.Types.DeleteRepositoryPermissionsPolicyResult) => void): Request<CodeArtifact.Types.DeleteRepositoryPermissionsPolicyResult, AWSError>;
  /**
   *  Returns a DomainDescription object that contains information about the requested domain. 
   */
  describeDomain(params: CodeArtifact.Types.DescribeDomainRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DescribeDomainResult) => void): Request<CodeArtifact.Types.DescribeDomainResult, AWSError>;
  /**
   *  Returns a DomainDescription object that contains information about the requested domain. 
   */
  describeDomain(callback?: (err: AWSError, data: CodeArtifact.Types.DescribeDomainResult) => void): Request<CodeArtifact.Types.DescribeDomainResult, AWSError>;
  /**
   *  Returns a PackageVersionDescription object that contains information about the requested package version. 
   */
  describePackageVersion(params: CodeArtifact.Types.DescribePackageVersionRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DescribePackageVersionResult) => void): Request<CodeArtifact.Types.DescribePackageVersionResult, AWSError>;
  /**
   *  Returns a PackageVersionDescription object that contains information about the requested package version. 
   */
  describePackageVersion(callback?: (err: AWSError, data: CodeArtifact.Types.DescribePackageVersionResult) => void): Request<CodeArtifact.Types.DescribePackageVersionResult, AWSError>;
  /**
   *  Returns a RepositoryDescription object that contains detailed information about the requested repository. 
   */
  describeRepository(params: CodeArtifact.Types.DescribeRepositoryRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DescribeRepositoryResult) => void): Request<CodeArtifact.Types.DescribeRepositoryResult, AWSError>;
  /**
   *  Returns a RepositoryDescription object that contains detailed information about the requested repository. 
   */
  describeRepository(callback?: (err: AWSError, data: CodeArtifact.Types.DescribeRepositoryResult) => void): Request<CodeArtifact.Types.DescribeRepositoryResult, AWSError>;
  /**
   *  Removes an existing external connection from a repository. 
   */
  disassociateExternalConnection(params: CodeArtifact.Types.DisassociateExternalConnectionRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DisassociateExternalConnectionResult) => void): Request<CodeArtifact.Types.DisassociateExternalConnectionResult, AWSError>;
  /**
   *  Removes an existing external connection from a repository. 
   */
  disassociateExternalConnection(callback?: (err: AWSError, data: CodeArtifact.Types.DisassociateExternalConnectionResult) => void): Request<CodeArtifact.Types.DisassociateExternalConnectionResult, AWSError>;
  /**
   *  Deletes the assets in package versions and sets the package versions' status to Disposed. A disposed package version cannot be restored in your repository because its assets are deleted.   To view all disposed package versions in a repository, use ListPackageVersions and set the status parameter to Disposed.   To view information about a disposed package version, use DescribePackageVersion. 
   */
  disposePackageVersions(params: CodeArtifact.Types.DisposePackageVersionsRequest, callback?: (err: AWSError, data: CodeArtifact.Types.DisposePackageVersionsResult) => void): Request<CodeArtifact.Types.DisposePackageVersionsResult, AWSError>;
  /**
   *  Deletes the assets in package versions and sets the package versions' status to Disposed. A disposed package version cannot be restored in your repository because its assets are deleted.   To view all disposed package versions in a repository, use ListPackageVersions and set the status parameter to Disposed.   To view information about a disposed package version, use DescribePackageVersion. 
   */
  disposePackageVersions(callback?: (err: AWSError, data: CodeArtifact.Types.DisposePackageVersionsResult) => void): Request<CodeArtifact.Types.DisposePackageVersionsResult, AWSError>;
  /**
   *  Generates a temporary authorization token for accessing repositories in the domain. This API requires the codeartifact:GetAuthorizationToken and sts:GetServiceBearerToken permissions. For more information about authorization tokens, see AWS CodeArtifact authentication and tokens.   CodeArtifact authorization tokens are valid for a period of 12 hours when created with the login command. You can call login periodically to refresh the token. When you create an authorization token with the GetAuthorizationToken API, you can set a custom authorization period, up to a maximum of 12 hours, with the durationSeconds parameter. The authorization period begins after login or GetAuthorizationToken is called. If login or GetAuthorizationToken is called while assuming a role, the token lifetime is independent of the maximum session duration of the role. For example, if you call sts assume-role and specify a session duration of 15 minutes, then generate a CodeArtifact authorization token, the token will be valid for the full authorization period even though this is longer than the 15-minute session duration. See Using IAM Roles for more information on controlling session duration.  
   */
  getAuthorizationToken(params: CodeArtifact.Types.GetAuthorizationTokenRequest, callback?: (err: AWSError, data: CodeArtifact.Types.GetAuthorizationTokenResult) => void): Request<CodeArtifact.Types.GetAuthorizationTokenResult, AWSError>;
  /**
   *  Generates a temporary authorization token for accessing repositories in the domain. This API requires the codeartifact:GetAuthorizationToken and sts:GetServiceBearerToken permissions. For more information about authorization tokens, see AWS CodeArtifact authentication and tokens.   CodeArtifact authorization tokens are valid for a period of 12 hours when created with the login command. You can call login periodically to refresh the token. When you create an authorization token with the GetAuthorizationToken API, you can set a custom authorization period, up to a maximum of 12 hours, with the durationSeconds parameter. The authorization period begins after login or GetAuthorizationToken is called. If login or GetAuthorizationToken is called while assuming a role, the token lifetime is independent of the maximum session duration of the role. For example, if you call sts assume-role and specify a session duration of 15 minutes, then generate a CodeArtifact authorization token, the token will be valid for the full authorization period even though this is longer than the 15-minute session duration. See Using IAM Roles for more information on controlling session duration.  
   */
  getAuthorizationToken(callback?: (err: AWSError, data: CodeArtifact.Types.GetAuthorizationTokenResult) => void): Request<CodeArtifact.Types.GetAuthorizationTokenResult, AWSError>;
  /**
   *  Returns the resource policy attached to the specified domain.    The policy is a resource-based policy, not an identity-based policy. For more information, see Identity-based policies and resource-based policies  in the AWS Identity and Access Management User Guide.  
   */
  getDomainPermissionsPolicy(params: CodeArtifact.Types.GetDomainPermissionsPolicyRequest, callback?: (err: AWSError, data: CodeArtifact.Types.GetDomainPermissionsPolicyResult) => void): Request<CodeArtifact.Types.GetDomainPermissionsPolicyResult, AWSError>;
  /**
   *  Returns the resource policy attached to the specified domain.    The policy is a resource-based policy, not an identity-based policy. For more information, see Identity-based policies and resource-based policies  in the AWS Identity and Access Management User Guide.  
   */
  getDomainPermissionsPolicy(callback?: (err: AWSError, data: CodeArtifact.Types.GetDomainPermissionsPolicyResult) => void): Request<CodeArtifact.Types.GetDomainPermissionsPolicyResult, AWSError>;
  /**
   *  Returns an asset (or file) that is in a package. For example, for a Maven package version, use GetPackageVersionAsset to download a JAR file, a POM file, or any other assets in the package version. 
   */
  getPackageVersionAsset(params: CodeArtifact.Types.GetPackageVersionAssetRequest, callback?: (err: AWSError, data: CodeArtifact.Types.GetPackageVersionAssetResult) => void): Request<CodeArtifact.Types.GetPackageVersionAssetResult, AWSError>;
  /**
   *  Returns an asset (or file) that is in a package. For example, for a Maven package version, use GetPackageVersionAsset to download a JAR file, a POM file, or any other assets in the package version. 
   */
  getPackageVersionAsset(callback?: (err: AWSError, data: CodeArtifact.Types.GetPackageVersionAssetResult) => void): Request<CodeArtifact.Types.GetPackageVersionAssetResult, AWSError>;
  /**
   *  Gets the readme file or descriptive text for a package version. For packages that do not contain a readme file, CodeArtifact extracts a description from a metadata file. For example, from the &lt;description&gt; element in the pom.xml file of a Maven package.   The returned text might contain formatting. For example, it might contain formatting for Markdown or reStructuredText. 
   */
  getPackageVersionReadme(params: CodeArtifact.Types.GetPackageVersionReadmeRequest, callback?: (err: AWSError, data: CodeArtifact.Types.GetPackageVersionReadmeResult) => void): Request<CodeArtifact.Types.GetPackageVersionReadmeResult, AWSError>;
  /**
   *  Gets the readme file or descriptive text for a package version. For packages that do not contain a readme file, CodeArtifact extracts a description from a metadata file. For example, from the &lt;description&gt; element in the pom.xml file of a Maven package.   The returned text might contain formatting. For example, it might contain formatting for Markdown or reStructuredText. 
   */
  getPackageVersionReadme(callback?: (err: AWSError, data: CodeArtifact.Types.GetPackageVersionReadmeResult) => void): Request<CodeArtifact.Types.GetPackageVersionReadmeResult, AWSError>;
  /**
   *  Returns the endpoint of a repository for a specific package format. A repository has one endpoint for each package format:     npm     pypi     maven   
   */
  getRepositoryEndpoint(params: CodeArtifact.Types.GetRepositoryEndpointRequest, callback?: (err: AWSError, data: CodeArtifact.Types.GetRepositoryEndpointResult) => void): Request<CodeArtifact.Types.GetRepositoryEndpointResult, AWSError>;
  /**
   *  Returns the endpoint of a repository for a specific package format. A repository has one endpoint for each package format:     npm     pypi     maven   
   */
  getRepositoryEndpoint(callback?: (err: AWSError, data: CodeArtifact.Types.GetRepositoryEndpointResult) => void): Request<CodeArtifact.Types.GetRepositoryEndpointResult, AWSError>;
  /**
   *  Returns the resource policy that is set on a repository. 
   */
  getRepositoryPermissionsPolicy(params: CodeArtifact.Types.GetRepositoryPermissionsPolicyRequest, callback?: (err: AWSError, data: CodeArtifact.Types.GetRepositoryPermissionsPolicyResult) => void): Request<CodeArtifact.Types.GetRepositoryPermissionsPolicyResult, AWSError>;
  /**
   *  Returns the resource policy that is set on a repository. 
   */
  getRepositoryPermissionsPolicy(callback?: (err: AWSError, data: CodeArtifact.Types.GetRepositoryPermissionsPolicyResult) => void): Request<CodeArtifact.Types.GetRepositoryPermissionsPolicyResult, AWSError>;
  /**
   *  Returns a list of DomainSummary objects for all domains owned by the AWS account that makes this call. Each returned DomainSummary object contains information about a domain. 
   */
  listDomains(params: CodeArtifact.Types.ListDomainsRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListDomainsResult) => void): Request<CodeArtifact.Types.ListDomainsResult, AWSError>;
  /**
   *  Returns a list of DomainSummary objects for all domains owned by the AWS account that makes this call. Each returned DomainSummary object contains information about a domain. 
   */
  listDomains(callback?: (err: AWSError, data: CodeArtifact.Types.ListDomainsResult) => void): Request<CodeArtifact.Types.ListDomainsResult, AWSError>;
  /**
   *  Returns a list of AssetSummary objects for assets in a package version. 
   */
  listPackageVersionAssets(params: CodeArtifact.Types.ListPackageVersionAssetsRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListPackageVersionAssetsResult) => void): Request<CodeArtifact.Types.ListPackageVersionAssetsResult, AWSError>;
  /**
   *  Returns a list of AssetSummary objects for assets in a package version. 
   */
  listPackageVersionAssets(callback?: (err: AWSError, data: CodeArtifact.Types.ListPackageVersionAssetsResult) => void): Request<CodeArtifact.Types.ListPackageVersionAssetsResult, AWSError>;
  /**
   *  Returns the direct dependencies for a package version. The dependencies are returned as PackageDependency objects. CodeArtifact extracts the dependencies for a package version from the metadata file for the package format (for example, the package.json file for npm packages and the pom.xml file for Maven). Any package version dependencies that are not listed in the configuration file are not returned. 
   */
  listPackageVersionDependencies(params: CodeArtifact.Types.ListPackageVersionDependenciesRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListPackageVersionDependenciesResult) => void): Request<CodeArtifact.Types.ListPackageVersionDependenciesResult, AWSError>;
  /**
   *  Returns the direct dependencies for a package version. The dependencies are returned as PackageDependency objects. CodeArtifact extracts the dependencies for a package version from the metadata file for the package format (for example, the package.json file for npm packages and the pom.xml file for Maven). Any package version dependencies that are not listed in the configuration file are not returned. 
   */
  listPackageVersionDependencies(callback?: (err: AWSError, data: CodeArtifact.Types.ListPackageVersionDependenciesResult) => void): Request<CodeArtifact.Types.ListPackageVersionDependenciesResult, AWSError>;
  /**
   *  Returns a list of PackageVersionSummary objects for package versions in a repository that match the request parameters. 
   */
  listPackageVersions(params: CodeArtifact.Types.ListPackageVersionsRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListPackageVersionsResult) => void): Request<CodeArtifact.Types.ListPackageVersionsResult, AWSError>;
  /**
   *  Returns a list of PackageVersionSummary objects for package versions in a repository that match the request parameters. 
   */
  listPackageVersions(callback?: (err: AWSError, data: CodeArtifact.Types.ListPackageVersionsResult) => void): Request<CodeArtifact.Types.ListPackageVersionsResult, AWSError>;
  /**
   *  Returns a list of PackageSummary objects for packages in a repository that match the request parameters. 
   */
  listPackages(params: CodeArtifact.Types.ListPackagesRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListPackagesResult) => void): Request<CodeArtifact.Types.ListPackagesResult, AWSError>;
  /**
   *  Returns a list of PackageSummary objects for packages in a repository that match the request parameters. 
   */
  listPackages(callback?: (err: AWSError, data: CodeArtifact.Types.ListPackagesResult) => void): Request<CodeArtifact.Types.ListPackagesResult, AWSError>;
  /**
   *  Returns a list of RepositorySummary objects. Each RepositorySummary contains information about a repository in the specified AWS account and that matches the input parameters. 
   */
  listRepositories(params: CodeArtifact.Types.ListRepositoriesRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListRepositoriesResult) => void): Request<CodeArtifact.Types.ListRepositoriesResult, AWSError>;
  /**
   *  Returns a list of RepositorySummary objects. Each RepositorySummary contains information about a repository in the specified AWS account and that matches the input parameters. 
   */
  listRepositories(callback?: (err: AWSError, data: CodeArtifact.Types.ListRepositoriesResult) => void): Request<CodeArtifact.Types.ListRepositoriesResult, AWSError>;
  /**
   *  Returns a list of RepositorySummary objects. Each RepositorySummary contains information about a repository in the specified domain and that matches the input parameters. 
   */
  listRepositoriesInDomain(params: CodeArtifact.Types.ListRepositoriesInDomainRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListRepositoriesInDomainResult) => void): Request<CodeArtifact.Types.ListRepositoriesInDomainResult, AWSError>;
  /**
   *  Returns a list of RepositorySummary objects. Each RepositorySummary contains information about a repository in the specified domain and that matches the input parameters. 
   */
  listRepositoriesInDomain(callback?: (err: AWSError, data: CodeArtifact.Types.ListRepositoriesInDomainResult) => void): Request<CodeArtifact.Types.ListRepositoriesInDomainResult, AWSError>;
  /**
   * Gets information about AWS tags for a specified Amazon Resource Name (ARN) in AWS CodeArtifact.
   */
  listTagsForResource(params: CodeArtifact.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CodeArtifact.Types.ListTagsForResourceResult) => void): Request<CodeArtifact.Types.ListTagsForResourceResult, AWSError>;
  /**
   * Gets information about AWS tags for a specified Amazon Resource Name (ARN) in AWS CodeArtifact.
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeArtifact.Types.ListTagsForResourceResult) => void): Request<CodeArtifact.Types.ListTagsForResourceResult, AWSError>;
  /**
   *  Sets a resource policy on a domain that specifies permissions to access it.   When you call PutDomainPermissionsPolicy, the resource policy on the domain is ignored when evaluting permissions. This ensures that the owner of a domain cannot lock themselves out of the domain, which would prevent them from being able to update the resource policy. 
   */
  putDomainPermissionsPolicy(params: CodeArtifact.Types.PutDomainPermissionsPolicyRequest, callback?: (err: AWSError, data: CodeArtifact.Types.PutDomainPermissionsPolicyResult) => void): Request<CodeArtifact.Types.PutDomainPermissionsPolicyResult, AWSError>;
  /**
   *  Sets a resource policy on a domain that specifies permissions to access it.   When you call PutDomainPermissionsPolicy, the resource policy on the domain is ignored when evaluting permissions. This ensures that the owner of a domain cannot lock themselves out of the domain, which would prevent them from being able to update the resource policy. 
   */
  putDomainPermissionsPolicy(callback?: (err: AWSError, data: CodeArtifact.Types.PutDomainPermissionsPolicyResult) => void): Request<CodeArtifact.Types.PutDomainPermissionsPolicyResult, AWSError>;
  /**
   *  Sets the resource policy on a repository that specifies permissions to access it.   When you call PutRepositoryPermissionsPolicy, the resource policy on the repository is ignored when evaluting permissions. This ensures that the owner of a repository cannot lock themselves out of the repository, which would prevent them from being able to update the resource policy. 
   */
  putRepositoryPermissionsPolicy(params: CodeArtifact.Types.PutRepositoryPermissionsPolicyRequest, callback?: (err: AWSError, data: CodeArtifact.Types.PutRepositoryPermissionsPolicyResult) => void): Request<CodeArtifact.Types.PutRepositoryPermissionsPolicyResult, AWSError>;
  /**
   *  Sets the resource policy on a repository that specifies permissions to access it.   When you call PutRepositoryPermissionsPolicy, the resource policy on the repository is ignored when evaluting permissions. This ensures that the owner of a repository cannot lock themselves out of the repository, which would prevent them from being able to update the resource policy. 
   */
  putRepositoryPermissionsPolicy(callback?: (err: AWSError, data: CodeArtifact.Types.PutRepositoryPermissionsPolicyResult) => void): Request<CodeArtifact.Types.PutRepositoryPermissionsPolicyResult, AWSError>;
  /**
   * Adds or updates tags for a resource in AWS CodeArtifact.
   */
  tagResource(params: CodeArtifact.Types.TagResourceRequest, callback?: (err: AWSError, data: CodeArtifact.Types.TagResourceResult) => void): Request<CodeArtifact.Types.TagResourceResult, AWSError>;
  /**
   * Adds or updates tags for a resource in AWS CodeArtifact.
   */
  tagResource(callback?: (err: AWSError, data: CodeArtifact.Types.TagResourceResult) => void): Request<CodeArtifact.Types.TagResourceResult, AWSError>;
  /**
   * Removes tags from a resource in AWS CodeArtifact.
   */
  untagResource(params: CodeArtifact.Types.UntagResourceRequest, callback?: (err: AWSError, data: CodeArtifact.Types.UntagResourceResult) => void): Request<CodeArtifact.Types.UntagResourceResult, AWSError>;
  /**
   * Removes tags from a resource in AWS CodeArtifact.
   */
  untagResource(callback?: (err: AWSError, data: CodeArtifact.Types.UntagResourceResult) => void): Request<CodeArtifact.Types.UntagResourceResult, AWSError>;
  /**
   *  Updates the status of one or more versions of a package. 
   */
  updatePackageVersionsStatus(params: CodeArtifact.Types.UpdatePackageVersionsStatusRequest, callback?: (err: AWSError, data: CodeArtifact.Types.UpdatePackageVersionsStatusResult) => void): Request<CodeArtifact.Types.UpdatePackageVersionsStatusResult, AWSError>;
  /**
   *  Updates the status of one or more versions of a package. 
   */
  updatePackageVersionsStatus(callback?: (err: AWSError, data: CodeArtifact.Types.UpdatePackageVersionsStatusResult) => void): Request<CodeArtifact.Types.UpdatePackageVersionsStatusResult, AWSError>;
  /**
   *  Update the properties of a repository. 
   */
  updateRepository(params: CodeArtifact.Types.UpdateRepositoryRequest, callback?: (err: AWSError, data: CodeArtifact.Types.UpdateRepositoryResult) => void): Request<CodeArtifact.Types.UpdateRepositoryResult, AWSError>;
  /**
   *  Update the properties of a repository. 
   */
  updateRepository(callback?: (err: AWSError, data: CodeArtifact.Types.UpdateRepositoryResult) => void): Request<CodeArtifact.Types.UpdateRepositoryResult, AWSError>;
}
declare namespace CodeArtifact {
  export type AccountId = string;
  export type Arn = string;
  export type Asset = Buffer|Uint8Array|Blob|string|Readable;
  export type AssetHashes = {[key: string]: HashValue};
  export type AssetName = string;
  export interface AssetSummary {
    /**
     *  The name of the asset. 
     */
    name: AssetName;
    /**
     *  The size of the asset. 
     */
    size?: LongOptional;
    /**
     *  The hashes of the asset. 
     */
    hashes?: AssetHashes;
  }
  export type AssetSummaryList = AssetSummary[];
  export interface AssociateExternalConnectionRequest {
    /**
     * The name of the domain that contains the repository.
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository to which the external connection is added. 
     */
    repository: RepositoryName;
    /**
     *  The name of the external connection to add to the repository. The following values are supported:     public:npmjs - for the npm public repository.     public:pypi - for the Python Package Index.     public:maven-central - for Maven Central.     public:maven-googleandroid - for the Google Android repository.     public:maven-gradleplugins - for the Gradle plugins repository.     public:maven-commonsware - for the CommonsWare Android repository.   
     */
    externalConnection: ExternalConnectionName;
  }
  export interface AssociateExternalConnectionResult {
    /**
     *  Information about the connected repository after processing the request. 
     */
    repository?: RepositoryDescription;
  }
  export type AuthorizationTokenDurationSeconds = number;
  export type BooleanOptional = boolean;
  export interface CopyPackageVersionsRequest {
    /**
     *  The name of the domain that contains the source and destination repositories. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the package versions to copy. 
     */
    sourceRepository: RepositoryName;
    /**
     *  The name of the repository into which package versions are copied. 
     */
    destinationRepository: RepositoryName;
    /**
     *  The format of the package that is copied. The valid package types are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that is copied. 
     */
    package: PackageName;
    /**
     *  The versions of the package to copy.    You must specify versions or versionRevisions. You cannot specify both.  
     */
    versions?: PackageVersionList;
    /**
     *  A list of key-value pairs. The keys are package versions and the values are package version revisions. A CopyPackageVersion operation succeeds if the specified versions in the source repository match the specified package version revision.    You must specify versions or versionRevisions. You cannot specify both.  
     */
    versionRevisions?: PackageVersionRevisionMap;
    /**
     *  Set to true to overwrite a package version that already exists in the destination repository. If set to false and the package version already exists in the destination repository, the package version is returned in the failedVersions field of the response with an ALREADY_EXISTS error code. 
     */
    allowOverwrite?: BooleanOptional;
    /**
     *  Set to true to copy packages from repositories that are upstream from the source repository to the destination repository. The default setting is false. For more information, see Working with upstream repositories. 
     */
    includeFromUpstream?: BooleanOptional;
  }
  export interface CopyPackageVersionsResult {
    /**
     *  A list of the package versions that were successfully copied to your repository. 
     */
    successfulVersions?: SuccessfulPackageVersionInfoMap;
    /**
     *  A map of package versions that failed to copy and their error codes. The possible error codes are in the PackageVersionError data type. They are:     ALREADY_EXISTS     MISMATCHED_REVISION     MISMATCHED_STATUS     NOT_ALLOWED     NOT_FOUND     SKIPPED   
     */
    failedVersions?: PackageVersionErrorMap;
  }
  export interface CreateDomainRequest {
    /**
     *  The name of the domain to create. All domain names in an AWS Region that are in the same AWS account must be unique. The domain name is used as the prefix in DNS hostnames. Do not use sensitive information in a domain name because it is publicly discoverable. 
     */
    domain: DomainName;
    /**
     *  The encryption key for the domain. This is used to encrypt content stored in a domain. An encryption key can be a key ID, a key Amazon Resource Name (ARN), a key alias, or a key alias ARN. To specify an encryptionKey, your IAM role must have kms:DescribeKey and kms:CreateGrant permissions on the encryption key that is used. For more information, see DescribeKey in the AWS Key Management Service API Reference and AWS KMS API Permissions Reference in the AWS Key Management Service Developer Guide.    CodeArtifact supports only symmetric CMKs. Do not associate an asymmetric CMK with your domain. For more information, see Using symmetric and asymmetric keys in the AWS Key Management Service Developer Guide.  
     */
    encryptionKey?: Arn;
    /**
     * One or more tag key-value pairs for the domain.
     */
    tags?: TagList;
  }
  export interface CreateDomainResult {
    /**
     *  Contains information about the created domain after processing the request. 
     */
    domain?: DomainDescription;
  }
  export interface CreateRepositoryRequest {
    /**
     *  The name of the domain that contains the created repository. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository to create. 
     */
    repository: RepositoryName;
    /**
     *  A description of the created repository. 
     */
    description?: Description;
    /**
     *  A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when AWS CodeArtifact looks for a requested package version. For more information, see Working with upstream repositories. 
     */
    upstreams?: UpstreamRepositoryList;
    /**
     * One or more tag key-value pairs for the repository.
     */
    tags?: TagList;
  }
  export interface CreateRepositoryResult {
    /**
     *  Information about the created repository after processing the request. 
     */
    repository?: RepositoryDescription;
  }
  export interface DeleteDomainPermissionsPolicyRequest {
    /**
     *  The name of the domain associated with the resource policy to be deleted. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The current revision of the resource policy to be deleted. This revision is used for optimistic locking, which prevents others from overwriting your changes to the domain's resource policy. 
     */
    policyRevision?: PolicyRevision;
  }
  export interface DeleteDomainPermissionsPolicyResult {
    /**
     *  Information about the deleted resource policy after processing the request. 
     */
    policy?: ResourcePolicy;
  }
  export interface DeleteDomainRequest {
    /**
     *  The name of the domain to delete. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
  }
  export interface DeleteDomainResult {
    /**
     *  Contains information about the deleted domain after processing the request. 
     */
    domain?: DomainDescription;
  }
  export interface DeletePackageVersionsRequest {
    /**
     *  The name of the domain that contains the package to delete. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the package versions to delete. 
     */
    repository: RepositoryName;
    /**
     *  The format of the package versions to delete. The valid values are:     npm     pypi     maven   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package with the versions to delete. 
     */
    package: PackageName;
    /**
     *  An array of strings that specify the versions of the package to delete. 
     */
    versions: PackageVersionList;
    /**
     *  The expected status of the package version to delete. Valid values are:     Published     Unfinished     Unlisted     Archived     Disposed   
     */
    expectedStatus?: PackageVersionStatus;
  }
  export interface DeletePackageVersionsResult {
    /**
     *  A list of the package versions that were successfully deleted. 
     */
    successfulVersions?: SuccessfulPackageVersionInfoMap;
    /**
     *  A PackageVersionError object that contains a map of errors codes for the deleted package that failed. The possible error codes are:     ALREADY_EXISTS     MISMATCHED_REVISION     MISMATCHED_STATUS     NOT_ALLOWED     NOT_FOUND     SKIPPED   
     */
    failedVersions?: PackageVersionErrorMap;
  }
  export interface DeleteRepositoryPermissionsPolicyRequest {
    /**
     *  The name of the domain that contains the repository associated with the resource policy to be deleted. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that is associated with the resource policy to be deleted 
     */
    repository: RepositoryName;
    /**
     *  The revision of the repository's resource policy to be deleted. This revision is used for optimistic locking, which prevents others from accidentally overwriting your changes to the repository's resource policy. 
     */
    policyRevision?: PolicyRevision;
  }
  export interface DeleteRepositoryPermissionsPolicyResult {
    /**
     *  Information about the deleted policy after processing the request. 
     */
    policy?: ResourcePolicy;
  }
  export interface DeleteRepositoryRequest {
    /**
     *  The name of the domain that contains the repository to delete. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository to delete. 
     */
    repository: RepositoryName;
  }
  export interface DeleteRepositoryResult {
    /**
     *  Information about the deleted repository after processing the request. 
     */
    repository?: RepositoryDescription;
  }
  export interface DescribeDomainRequest {
    /**
     *  A string that specifies the name of the requested domain. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
  }
  export interface DescribeDomainResult {
    domain?: DomainDescription;
  }
  export interface DescribePackageVersionRequest {
    /**
     *  The name of the domain that contains the repository that contains the package version. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the package version. 
     */
    repository: RepositoryName;
    /**
     *  A format that specifies the type of the requested package version. The valid values are:     npm     pypi     maven   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the requested package version. 
     */
    package: PackageName;
    /**
     *  A string that contains the package version (for example, 3.5.2). 
     */
    packageVersion: PackageVersion;
  }
  export interface DescribePackageVersionResult {
    /**
     *  A PackageVersionDescription object that contains information about the requested package version. 
     */
    packageVersion: PackageVersionDescription;
  }
  export interface DescribeRepositoryRequest {
    /**
     *  The name of the domain that contains the repository to describe. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  A string that specifies the name of the requested repository. 
     */
    repository: RepositoryName;
  }
  export interface DescribeRepositoryResult {
    /**
     *  A RepositoryDescription object that contains the requested repository information. 
     */
    repository?: RepositoryDescription;
  }
  export type Description = string;
  export interface DisassociateExternalConnectionRequest {
    /**
     * The name of the domain that contains the repository from which to remove the external repository. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     * The name of the repository from which the external connection will be removed. 
     */
    repository: RepositoryName;
    /**
     * The name of the external connection to be removed from the repository. 
     */
    externalConnection: ExternalConnectionName;
  }
  export interface DisassociateExternalConnectionResult {
    /**
     *  The repository associated with the removed external connection. 
     */
    repository?: RepositoryDescription;
  }
  export interface DisposePackageVersionsRequest {
    /**
     *  The name of the domain that contains the repository you want to dispose. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the package versions you want to dispose. 
     */
    repository: RepositoryName;
    /**
     *  A format that specifies the type of package versions you want to dispose. The valid values are:     npm     pypi     maven   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package with the versions you want to dispose. 
     */
    package: PackageName;
    /**
     *  The versions of the package you want to dispose. 
     */
    versions: PackageVersionList;
    /**
     *  The revisions of the package versions you want to dispose. 
     */
    versionRevisions?: PackageVersionRevisionMap;
    /**
     *  The expected status of the package version to dispose. Valid values are:     Published     Unfinished     Unlisted     Archived     Disposed   
     */
    expectedStatus?: PackageVersionStatus;
  }
  export interface DisposePackageVersionsResult {
    /**
     *  A list of the package versions that were successfully disposed. 
     */
    successfulVersions?: SuccessfulPackageVersionInfoMap;
    /**
     *  A PackageVersionError object that contains a map of errors codes for the disposed package versions that failed. The possible error codes are:     ALREADY_EXISTS     MISMATCHED_REVISION     MISMATCHED_STATUS     NOT_ALLOWED     NOT_FOUND     SKIPPED   
     */
    failedVersions?: PackageVersionErrorMap;
  }
  export interface DomainDescription {
    /**
     *  The name of the domain. 
     */
    name?: DomainName;
    /**
     *  The AWS account ID that owns the domain. 
     */
    owner?: AccountId;
    /**
     *  The Amazon Resource Name (ARN) of the domain. 
     */
    arn?: Arn;
    /**
     *  The current status of a domain. The valid values are     Active     Deleted   
     */
    status?: DomainStatus;
    /**
     *  A timestamp that represents the date and time the domain was created. 
     */
    createdTime?: Timestamp;
    /**
     *  The ARN of an AWS Key Management Service (AWS KMS) key associated with a domain. 
     */
    encryptionKey?: Arn;
    /**
     *  The number of repositories in the domain. 
     */
    repositoryCount?: Integer;
    /**
     *  The total size of all assets in the domain. 
     */
    assetSizeBytes?: Long;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket that is used to store package assets in the domain.
     */
    s3BucketArn?: Arn;
  }
  export type DomainName = string;
  export type DomainStatus = "Active"|"Deleted"|string;
  export interface DomainSummary {
    /**
     *  The name of the domain. 
     */
    name?: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    owner?: AccountId;
    /**
     *  The ARN of the domain. 
     */
    arn?: Arn;
    /**
     *  A string that contains the status of the domain. The valid values are:     Active     Deleted   
     */
    status?: DomainStatus;
    /**
     *  A timestamp that contains the date and time the domain was created. 
     */
    createdTime?: Timestamp;
    /**
     *  The key used to encrypt the domain. 
     */
    encryptionKey?: Arn;
  }
  export type DomainSummaryList = DomainSummary[];
  export type ErrorMessage = string;
  export type ExternalConnectionName = string;
  export type ExternalConnectionStatus = "Available"|string;
  export interface GetAuthorizationTokenRequest {
    /**
     *  The name of the domain that is in scope for the generated authorization token. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     * The time, in seconds, that the generated authorization token is valid. Valid values are 0 and any number between 900 (15 minutes) and 43200 (12 hours). A value of 0 will set the expiration of the authorization token to the same expiration of the user's role's temporary credentials.
     */
    durationSeconds?: AuthorizationTokenDurationSeconds;
  }
  export interface GetAuthorizationTokenResult {
    /**
     *  The returned authentication token. 
     */
    authorizationToken?: String;
    /**
     *  A timestamp that specifies the date and time the authorization token expires. 
     */
    expiration?: Timestamp;
  }
  export interface GetDomainPermissionsPolicyRequest {
    /**
     *  The name of the domain to which the resource policy is attached. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
  }
  export interface GetDomainPermissionsPolicyResult {
    /**
     *  The returned resource policy. 
     */
    policy?: ResourcePolicy;
  }
  export interface GetPackageVersionAssetRequest {
    /**
     *  The name of the domain that contains the repository that contains the package version with the requested asset. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The repository that contains the package version with the requested asset. 
     */
    repository: RepositoryName;
    /**
     *  A format that specifies the type of the package version with the requested asset file. The valid values are:     npm     pypi     maven   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that contains the requested asset. 
     */
    package: PackageName;
    /**
     *  A string that contains the package version (for example, 3.5.2). 
     */
    packageVersion: PackageVersion;
    /**
     *  The name of the requested asset. 
     */
    asset: AssetName;
    /**
     *  The name of the package version revision that contains the requested asset. 
     */
    packageVersionRevision?: PackageVersionRevision;
  }
  export interface GetPackageVersionAssetResult {
    /**
     *  The binary file, or asset, that is downloaded.
     */
    asset?: Asset;
    /**
     *  The name of the asset that is downloaded. 
     */
    assetName?: AssetName;
    /**
     *  A string that contains the package version (for example, 3.5.2). 
     */
    packageVersion?: PackageVersion;
    /**
     *  The name of the package version revision that contains the downloaded asset. 
     */
    packageVersionRevision?: PackageVersionRevision;
  }
  export interface GetPackageVersionReadmeRequest {
    /**
     *  The name of the domain that contains the repository that contains the package version with the requested readme file. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The repository that contains the package with the requested readme file. 
     */
    repository: RepositoryName;
    /**
     *  A format that specifies the type of the package version with the requested readme file. The valid values are:     npm     pypi     maven   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package version that contains the requested readme file. 
     */
    package: PackageName;
    /**
     *  A string that contains the package version (for example, 3.5.2). 
     */
    packageVersion: PackageVersion;
  }
  export interface GetPackageVersionReadmeResult {
    /**
     *  The format of the package with the requested readme file. Valid format types are:     npm     pypi     maven   
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that contains the returned readme file. 
     */
    package?: PackageName;
    /**
     *  The version of the package with the requested readme file. 
     */
    version?: PackageVersion;
    /**
     *  The current revision associated with the package version. 
     */
    versionRevision?: PackageVersionRevision;
    /**
     *  The text of the returned readme file. 
     */
    readme?: String;
  }
  export interface GetRepositoryEndpointRequest {
    /**
     *  The name of the domain that contains the repository. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain that contains the repository. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository. 
     */
    repository: RepositoryName;
    /**
     *  Returns which endpoint of a repository to return. A repository has one endpoint for each package format:     npm     pypi     maven   
     */
    format: PackageFormat;
  }
  export interface GetRepositoryEndpointResult {
    /**
     *  A string that specifies the URL of the returned endpoint. 
     */
    repositoryEndpoint?: String;
  }
  export interface GetRepositoryPermissionsPolicyRequest {
    /**
     *  The name of the domain containing the repository whose associated resource policy is to be retrieved. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository whose associated resource policy is to be retrieved. 
     */
    repository: RepositoryName;
  }
  export interface GetRepositoryPermissionsPolicyResult {
    /**
     *  The returned resource policy. 
     */
    policy?: ResourcePolicy;
  }
  export type HashAlgorithm = "MD5"|"SHA-1"|"SHA-256"|"SHA-512"|string;
  export type HashValue = string;
  export type Integer = number;
  export interface LicenseInfo {
    /**
     *  Name of the license. 
     */
    name?: String;
    /**
     *  The URL for license data. 
     */
    url?: String;
  }
  export type LicenseInfoList = LicenseInfo[];
  export type ListDomainsMaxResults = number;
  export interface ListDomainsRequest {
    /**
     *  The maximum number of results to return per page. 
     */
    maxResults?: ListDomainsMaxResults;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListDomainsResult {
    /**
     *  The returned list of DomainSummary objects. 
     */
    domains?: DomainSummaryList;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export type ListPackageVersionAssetsMaxResults = number;
  export interface ListPackageVersionAssetsRequest {
    /**
     *  The name of the domain that contains the repository associated with the package version assets. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the package that contains the returned package version assets. 
     */
    repository: RepositoryName;
    /**
     *  The format of the package that contains the returned package version assets. The valid package types are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that contains the returned package version assets. 
     */
    package: PackageName;
    /**
     *  A string that contains the package version (for example, 3.5.2). 
     */
    packageVersion: PackageVersion;
    /**
     *  The maximum number of results to return per page. 
     */
    maxResults?: ListPackageVersionAssetsMaxResults;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListPackageVersionAssetsResult {
    /**
     *  The format of the package that contains the returned package version assets. 
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that contains the returned package version assets. 
     */
    package?: PackageName;
    /**
     *  The version of the package associated with the returned assets. 
     */
    version?: PackageVersion;
    /**
     *  The current revision associated with the package version. 
     */
    versionRevision?: PackageVersionRevision;
    /**
     *  If there are additional results, this is the token for the next set of results. 
     */
    nextToken?: PaginationToken;
    /**
     *  The returned list of AssetSummary objects. 
     */
    assets?: AssetSummaryList;
  }
  export interface ListPackageVersionDependenciesRequest {
    /**
     *  The name of the domain that contains the repository that contains the requested package version dependencies. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the requested package version. 
     */
    repository: RepositoryName;
    /**
     *  The format of the package with the requested dependencies. The valid package types are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package versions' package. 
     */
    package: PackageName;
    /**
     *  A string that contains the package version (for example, 3.5.2). 
     */
    packageVersion: PackageVersion;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListPackageVersionDependenciesResult {
    /**
     *  A format that specifies the type of the package that contains the returned dependencies. The valid values are:     npm     pypi     maven   
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that contains the returned package versions dependencies. 
     */
    package?: PackageName;
    /**
     *  The version of the package that is specified in the request. 
     */
    version?: PackageVersion;
    /**
     *  The current revision associated with the package version. 
     */
    versionRevision?: PackageVersionRevision;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
    /**
     *  The returned list of PackageDependency objects. 
     */
    dependencies?: PackageDependencyList;
  }
  export type ListPackageVersionsMaxResults = number;
  export interface ListPackageVersionsRequest {
    /**
     *  The name of the domain that contains the repository that contains the returned package versions. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository that contains the package. 
     */
    repository: RepositoryName;
    /**
     *  The format of the returned packages. The valid package types are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package for which you want to return a list of package versions. 
     */
    package: PackageName;
    /**
     *  A string that specifies the status of the package versions to include in the returned list. It can be one of the following:     Published     Unfinished     Unlisted     Archived     Disposed   
     */
    status?: PackageVersionStatus;
    /**
     *  How to sort the returned list of package versions. 
     */
    sortBy?: PackageVersionSortType;
    /**
     *  The maximum number of results to return per page. 
     */
    maxResults?: ListPackageVersionsMaxResults;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListPackageVersionsResult {
    /**
     *  The default package version to display. This depends on the package format:     For Maven and PyPI packages, it's the most recently published package version.     For npm packages, it's the version referenced by the latest tag. If the latest tag is not set, it's the most recently published package version.   
     */
    defaultDisplayVersion?: PackageVersion;
    /**
     *  A format of the package. Valid package format values are:     npm     pypi     maven   
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package. 
     */
    package?: PackageName;
    /**
     *  The returned list of PackageVersionSummary objects. 
     */
    versions?: PackageVersionSummaryList;
    /**
     *  If there are additional results, this is the token for the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export type ListPackagesMaxResults = number;
  export interface ListPackagesRequest {
    /**
     *  The name of the domain that contains the repository that contains the requested list of packages. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository from which packages are to be listed. 
     */
    repository: RepositoryName;
    /**
     *  The format of the packages. The valid package types are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  A prefix used to filter returned packages. Only packages with names that start with packagePrefix are returned. 
     */
    packagePrefix?: PackageName;
    /**
     *  The maximum number of results to return per page. 
     */
    maxResults?: ListPackagesMaxResults;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListPackagesResult {
    /**
     *  The list of returned PackageSummary objects. 
     */
    packages?: PackageSummaryList;
    /**
     *  If there are additional results, this is the token for the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export type ListRepositoriesInDomainMaxResults = number;
  export interface ListRepositoriesInDomainRequest {
    /**
     *  The name of the domain that contains the returned list of repositories. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  Filter the list of repositories to only include those that are managed by the AWS account ID. 
     */
    administratorAccount?: AccountId;
    /**
     *  A prefix used to filter returned repositories. Only repositories with names that start with repositoryPrefix are returned. 
     */
    repositoryPrefix?: RepositoryName;
    /**
     *  The maximum number of results to return per page. 
     */
    maxResults?: ListRepositoriesInDomainMaxResults;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListRepositoriesInDomainResult {
    /**
     *  The returned list of repositories. 
     */
    repositories?: RepositorySummaryList;
    /**
     *  If there are additional results, this is the token for the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export type ListRepositoriesMaxResults = number;
  export interface ListRepositoriesRequest {
    /**
     *  A prefix used to filter returned repositories. Only repositories with names that start with repositoryPrefix are returned.
     */
    repositoryPrefix?: RepositoryName;
    /**
     *  The maximum number of results to return per page. 
     */
    maxResults?: ListRepositoriesMaxResults;
    /**
     *  The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListRepositoriesResult {
    /**
     *  The returned list of RepositorySummary objects. 
     */
    repositories?: RepositorySummaryList;
    /**
     *  If there are additional results, this is the token for the next set of results. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to get tags for.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResult {
    /**
     * A list of tag key and value pairs associated with the specified resource.
     */
    tags?: TagList;
  }
  export type Long = number;
  export type LongOptional = number;
  export interface PackageDependency {
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package that this package depends on. 
     */
    package?: PackageName;
    /**
     *  The type of a package dependency. The possible values depend on the package type. Example types are compile, runtime, and test for Maven packages, and dev, prod, and optional for npm packages. 
     */
    dependencyType?: String;
    /**
     *  The required version, or version range, of the package that this package depends on. The version format is specific to the package type. For example, the following are possible valid required versions: 1.2.3, ^2.3.4, or 4.x. 
     */
    versionRequirement?: String;
  }
  export type PackageDependencyList = PackageDependency[];
  export type PackageFormat = "npm"|"pypi"|"maven"|"nuget"|string;
  export type PackageName = string;
  export type PackageNamespace = string;
  export interface PackageSummary {
    /**
     *  The format of the package. Valid values are:     npm     pypi     maven   
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package. 
     */
    package?: PackageName;
  }
  export type PackageSummaryList = PackageSummary[];
  export type PackageVersion = string;
  export interface PackageVersionDescription {
    /**
     *  The format of the package version. The valid package formats are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    format?: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the requested package. 
     */
    packageName?: PackageName;
    /**
     *  The name of the package that is displayed. The displayName varies depending on the package version's format. For example, if an npm package is named ui, is in the namespace vue, and has the format npm, then the displayName is @vue/ui. 
     */
    displayName?: String255;
    /**
     *  The version of the package. 
     */
    version?: PackageVersion;
    /**
     *  A summary of the package version. The summary is extracted from the package. The information in and detail level of the summary depends on the package version's format. 
     */
    summary?: String;
    /**
     *  The homepage associated with the package. 
     */
    homePage?: String;
    /**
     *  The repository for the source code in the package version, or the source code used to build it. 
     */
    sourceCodeRepository?: String;
    /**
     *  A timestamp that contains the date and time the package version was published. 
     */
    publishedTime?: Timestamp;
    /**
     *  Information about licenses associated with the package version. 
     */
    licenses?: LicenseInfoList;
    /**
     *  The revision of the package version. 
     */
    revision?: PackageVersionRevision;
    /**
     *  A string that contains the status of the package version. It can be one of the following:     Published     Unfinished     Unlisted     Archived     Disposed   
     */
    status?: PackageVersionStatus;
  }
  export interface PackageVersionError {
    /**
     *  The error code associated with the error. Valid error codes are:     ALREADY_EXISTS     MISMATCHED_REVISION     MISMATCHED_STATUS     NOT_ALLOWED     NOT_FOUND     SKIPPED   
     */
    errorCode?: PackageVersionErrorCode;
    /**
     *  The error message associated with the error. 
     */
    errorMessage?: ErrorMessage;
  }
  export type PackageVersionErrorCode = "ALREADY_EXISTS"|"MISMATCHED_REVISION"|"MISMATCHED_STATUS"|"NOT_ALLOWED"|"NOT_FOUND"|"SKIPPED"|string;
  export type PackageVersionErrorMap = {[key: string]: PackageVersionError};
  export type PackageVersionList = PackageVersion[];
  export type PackageVersionRevision = string;
  export type PackageVersionRevisionMap = {[key: string]: PackageVersionRevision};
  export type PackageVersionSortType = "PUBLISHED_TIME"|string;
  export type PackageVersionStatus = "Published"|"Unfinished"|"Unlisted"|"Archived"|"Disposed"|"Deleted"|string;
  export interface PackageVersionSummary {
    /**
     *  Information about a package version. 
     */
    version: PackageVersion;
    /**
     *  The revision associated with a package version. 
     */
    revision?: PackageVersionRevision;
    /**
     *  A string that contains the status of the package version. It can be one of the following:     Published     Unfinished     Unlisted     Archived     Disposed   
     */
    status: PackageVersionStatus;
  }
  export type PackageVersionSummaryList = PackageVersionSummary[];
  export type PaginationToken = string;
  export type PolicyDocument = string;
  export type PolicyRevision = string;
  export interface PutDomainPermissionsPolicyRequest {
    /**
     *  The name of the domain on which to set the resource policy. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The current revision of the resource policy to be set. This revision is used for optimistic locking, which prevents others from overwriting your changes to the domain's resource policy. 
     */
    policyRevision?: PolicyRevision;
    /**
     *  A valid displayable JSON Aspen policy string to be set as the access control resource policy on the provided domain. 
     */
    policyDocument: PolicyDocument;
  }
  export interface PutDomainPermissionsPolicyResult {
    /**
     *  The resource policy that was set after processing the request. 
     */
    policy?: ResourcePolicy;
  }
  export interface PutRepositoryPermissionsPolicyRequest {
    /**
     *  The name of the domain containing the repository to set the resource policy on. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository to set the resource policy on. 
     */
    repository: RepositoryName;
    /**
     *  Sets the revision of the resource policy that specifies permissions to access the repository. This revision is used for optimistic locking, which prevents others from overwriting your changes to the repository's resource policy. 
     */
    policyRevision?: PolicyRevision;
    /**
     *  A valid displayable JSON Aspen policy string to be set as the access control resource policy on the provided repository. 
     */
    policyDocument: PolicyDocument;
  }
  export interface PutRepositoryPermissionsPolicyResult {
    /**
     *  The resource policy that was set after processing the request. 
     */
    policy?: ResourcePolicy;
  }
  export interface RepositoryDescription {
    /**
     *  The name of the repository. 
     */
    name?: RepositoryName;
    /**
     *  The 12-digit account number of the AWS account that manages the repository. 
     */
    administratorAccount?: AccountId;
    /**
     *  The name of the domain that contains the repository. 
     */
    domainName?: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain that contains the repository. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The Amazon Resource Name (ARN) of the repository. 
     */
    arn?: Arn;
    /**
     *  A text description of the repository. 
     */
    description?: Description;
    /**
     *  A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when AWS CodeArtifact looks for a requested package version. For more information, see Working with upstream repositories. 
     */
    upstreams?: UpstreamRepositoryInfoList;
    /**
     *  An array of external connections associated with the repository. 
     */
    externalConnections?: RepositoryExternalConnectionInfoList;
  }
  export interface RepositoryExternalConnectionInfo {
    /**
     *  The name of the external connection associated with a repository. 
     */
    externalConnectionName?: ExternalConnectionName;
    /**
     *  The package format associated with a repository's external connection. The valid package formats are:     npm: A Node Package Manager (npm) package.     pypi: A Python Package Index (PyPI) package.     maven: A Maven package that contains compiled code in a distributable format, such as a JAR file.   
     */
    packageFormat?: PackageFormat;
    /**
     *  The status of the external connection of a repository. There is one valid value, Available. 
     */
    status?: ExternalConnectionStatus;
  }
  export type RepositoryExternalConnectionInfoList = RepositoryExternalConnectionInfo[];
  export type RepositoryName = string;
  export interface RepositorySummary {
    /**
     *  The name of the repository. 
     */
    name?: RepositoryName;
    /**
     *  The AWS account ID that manages the repository. 
     */
    administratorAccount?: AccountId;
    /**
     *  The name of the domain that contains the repository. 
     */
    domainName?: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The ARN of the repository. 
     */
    arn?: Arn;
    /**
     *  The description of the repository. 
     */
    description?: Description;
  }
  export type RepositorySummaryList = RepositorySummary[];
  export interface ResourcePolicy {
    /**
     *  The ARN of the resource associated with the resource policy 
     */
    resourceArn?: Arn;
    /**
     *  The current revision of the resource policy. 
     */
    revision?: PolicyRevision;
    /**
     *  The resource policy formatted in JSON. 
     */
    document?: PolicyDocument;
  }
  export type String = string;
  export type String255 = string;
  export interface SuccessfulPackageVersionInfo {
    /**
     *  The revision of a package version. 
     */
    revision?: String;
    /**
     *  The status of a package version. Valid statuses are:     Published     Unfinished     Unlisted     Archived     Disposed   
     */
    status?: PackageVersionStatus;
  }
  export type SuccessfulPackageVersionInfoMap = {[key: string]: SuccessfulPackageVersionInfo};
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
     * The Amazon Resource Name (ARN) of the resource that you want to add or update tags for.
     */
    resourceArn: Arn;
    /**
     * The tags you want to modify or add to the resource.
     */
    tags: TagList;
  }
  export interface TagResourceResult {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove tags from.
     */
    resourceArn: Arn;
    /**
     * The tag key for each tag that you want to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResult {
  }
  export interface UpdatePackageVersionsStatusRequest {
    /**
     *  The name of the domain that contains the repository that contains the package versions with a status to be updated. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The repository that contains the package versions with the status you want to update. 
     */
    repository: RepositoryName;
    /**
     *  A format that specifies the type of the package with the statuses to update. The valid values are:     npm     pypi     maven   
     */
    format: PackageFormat;
    /**
     *  The namespace of the package. The package component that specifies its namespace depends on its type. For example:     The namespace of a Maven package is its groupId.     The namespace of an npm package is its scope.     A Python package does not contain a corresponding component, so Python packages do not have a namespace.   
     */
    namespace?: PackageNamespace;
    /**
     *  The name of the package with the version statuses to update. 
     */
    package: PackageName;
    /**
     *  An array of strings that specify the versions of the package with the statuses to update. 
     */
    versions: PackageVersionList;
    /**
     *  A map of package versions and package version revisions. The map key is the package version (for example, 3.5.2), and the map value is the package version revision. 
     */
    versionRevisions?: PackageVersionRevisionMap;
    /**
     *  The package version’s expected status before it is updated. If expectedStatus is provided, the package version's status is updated only if its status at the time UpdatePackageVersionsStatus is called matches expectedStatus. 
     */
    expectedStatus?: PackageVersionStatus;
    /**
     *  The status you want to change the package version status to. 
     */
    targetStatus: PackageVersionStatus;
  }
  export interface UpdatePackageVersionsStatusResult {
    /**
     *  A list of PackageVersionError objects, one for each package version with a status that failed to update. 
     */
    successfulVersions?: SuccessfulPackageVersionInfoMap;
    /**
     *  A list of SuccessfulPackageVersionInfo objects, one for each package version with a status that successfully updated. 
     */
    failedVersions?: PackageVersionErrorMap;
  }
  export interface UpdateRepositoryRequest {
    /**
     *  The name of the domain associated with the repository to update. 
     */
    domain: DomainName;
    /**
     *  The 12-digit account number of the AWS account that owns the domain. It does not include dashes or spaces. 
     */
    domainOwner?: AccountId;
    /**
     *  The name of the repository to update. 
     */
    repository: RepositoryName;
    /**
     *  An updated repository description. 
     */
    description?: Description;
    /**
     *  A list of upstream repositories to associate with the repository. The order of the upstream repositories in the list determines their priority order when AWS CodeArtifact looks for a requested package version. For more information, see Working with upstream repositories. 
     */
    upstreams?: UpstreamRepositoryList;
  }
  export interface UpdateRepositoryResult {
    /**
     *  The updated repository. 
     */
    repository?: RepositoryDescription;
  }
  export interface UpstreamRepository {
    /**
     *  The name of an upstream repository. 
     */
    repositoryName: RepositoryName;
  }
  export interface UpstreamRepositoryInfo {
    /**
     *  The name of an upstream repository. 
     */
    repositoryName?: RepositoryName;
  }
  export type UpstreamRepositoryInfoList = UpstreamRepositoryInfo[];
  export type UpstreamRepositoryList = UpstreamRepository[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-09-22"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeArtifact client.
   */
  export import Types = CodeArtifact;
}
export = CodeArtifact;
