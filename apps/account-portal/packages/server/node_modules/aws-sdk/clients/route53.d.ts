import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Route53 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Route53.Types.ClientConfiguration)
  config: Config & Route53.Types.ClientConfiguration;
  /**
   * Activates a key-signing key (KSK) so that it can be used for signing by DNSSEC. This operation changes the KSK status to ACTIVE.
   */
  activateKeySigningKey(params: Route53.Types.ActivateKeySigningKeyRequest, callback?: (err: AWSError, data: Route53.Types.ActivateKeySigningKeyResponse) => void): Request<Route53.Types.ActivateKeySigningKeyResponse, AWSError>;
  /**
   * Activates a key-signing key (KSK) so that it can be used for signing by DNSSEC. This operation changes the KSK status to ACTIVE.
   */
  activateKeySigningKey(callback?: (err: AWSError, data: Route53.Types.ActivateKeySigningKeyResponse) => void): Request<Route53.Types.ActivateKeySigningKeyResponse, AWSError>;
  /**
   * Associates an Amazon VPC with a private hosted zone.   To perform the association, the VPC and the private hosted zone must already exist. You can't convert a public hosted zone into a private hosted zone.   If you want to associate a VPC that was created by using one Amazon Web Services account with a private hosted zone that was created by using a different account, the Amazon Web Services account that created the private hosted zone must first submit a CreateVPCAssociationAuthorization request. Then the account that created the VPC must submit an AssociateVPCWithHostedZone request.   When granting access, the hosted zone and the Amazon VPC must belong to the same partition. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  associateVPCWithHostedZone(params: Route53.Types.AssociateVPCWithHostedZoneRequest, callback?: (err: AWSError, data: Route53.Types.AssociateVPCWithHostedZoneResponse) => void): Request<Route53.Types.AssociateVPCWithHostedZoneResponse, AWSError>;
  /**
   * Associates an Amazon VPC with a private hosted zone.   To perform the association, the VPC and the private hosted zone must already exist. You can't convert a public hosted zone into a private hosted zone.   If you want to associate a VPC that was created by using one Amazon Web Services account with a private hosted zone that was created by using a different account, the Amazon Web Services account that created the private hosted zone must first submit a CreateVPCAssociationAuthorization request. Then the account that created the VPC must submit an AssociateVPCWithHostedZone request.   When granting access, the hosted zone and the Amazon VPC must belong to the same partition. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  associateVPCWithHostedZone(callback?: (err: AWSError, data: Route53.Types.AssociateVPCWithHostedZoneResponse) => void): Request<Route53.Types.AssociateVPCWithHostedZoneResponse, AWSError>;
  /**
   * Creates, changes, or deletes CIDR blocks within a collection. Contains authoritative IP information mapping blocks to one or multiple locations. A change request can update multiple locations in a collection at a time, which is helpful if you want to move one or more CIDR blocks from one location to another in one transaction, without downtime.   Limits  The max number of CIDR blocks included in the request is 1000. As a result, big updates require multiple API calls.   PUT and DELETE_IF_EXISTS  Use ChangeCidrCollection to perform the following actions:    PUT: Create a CIDR block within the specified collection.     DELETE_IF_EXISTS: Delete an existing CIDR block from the collection.  
   */
  changeCidrCollection(params: Route53.Types.ChangeCidrCollectionRequest, callback?: (err: AWSError, data: Route53.Types.ChangeCidrCollectionResponse) => void): Request<Route53.Types.ChangeCidrCollectionResponse, AWSError>;
  /**
   * Creates, changes, or deletes CIDR blocks within a collection. Contains authoritative IP information mapping blocks to one or multiple locations. A change request can update multiple locations in a collection at a time, which is helpful if you want to move one or more CIDR blocks from one location to another in one transaction, without downtime.   Limits  The max number of CIDR blocks included in the request is 1000. As a result, big updates require multiple API calls.   PUT and DELETE_IF_EXISTS  Use ChangeCidrCollection to perform the following actions:    PUT: Create a CIDR block within the specified collection.     DELETE_IF_EXISTS: Delete an existing CIDR block from the collection.  
   */
  changeCidrCollection(callback?: (err: AWSError, data: Route53.Types.ChangeCidrCollectionResponse) => void): Request<Route53.Types.ChangeCidrCollectionResponse, AWSError>;
  /**
   * Creates, changes, or deletes a resource record set, which contains authoritative DNS information for a specified domain name or subdomain name. For example, you can use ChangeResourceRecordSets to create a resource record set that routes traffic for test.example.com to a web server that has an IP address of 192.0.2.44.  Deleting Resource Record Sets  To delete a resource record set, you must specify all the same values that you specified when you created it.  Change Batches and Transactional Changes  The request body must include a document with a ChangeResourceRecordSetsRequest element. The request body contains a list of change items, known as a change batch. Change batches are considered transactional changes. Route 53 validates the changes in the request and then either makes all or none of the changes in the change batch request. This ensures that DNS routing isn't adversely affected by partial changes to the resource record sets in a hosted zone.  For example, suppose a change batch request contains two changes: it deletes the CNAME resource record set for www.example.com and creates an alias resource record set for www.example.com. If validation for both records succeeds, Route 53 deletes the first resource record set and creates the second resource record set in a single operation. If validation for either the DELETE or the CREATE action fails, then the request is canceled, and the original CNAME record continues to exist.  If you try to delete the same resource record set more than once in a single change batch, Route 53 returns an InvalidChangeBatch error.   Traffic Flow  To create resource record sets for complex routing configurations, use either the traffic flow visual editor in the Route 53 console or the API actions for traffic policies and traffic policy instances. Save the configuration as a traffic policy, then associate the traffic policy with one or more domain names (such as example.com) or subdomain names (such as www.example.com), in the same hosted zone or in multiple hosted zones. You can roll back the updates if the new configuration isn't performing as expected. For more information, see Using Traffic Flow to Route DNS Traffic in the Amazon Route 53 Developer Guide.  Create, Delete, and Upsert  Use ChangeResourceRecordsSetsRequest to perform the following actions:    CREATE: Creates a resource record set that has the specified values.    DELETE: Deletes an existing resource record set that has the specified values.    UPSERT: If a resource set doesn't exist, Route 53 creates it. If a resource set exists Route 53 updates it with the values in the request.     Syntaxes for Creating, Updating, and Deleting Resource Record Sets  The syntax for a request depends on the type of resource record set that you want to create, delete, or update, such as weighted, alias, or failover. The XML elements in your request must appear in the order listed in the syntax.  For an example for each type of resource record set, see "Examples." Don't refer to the syntax in the "Parameter Syntax" section, which includes all of the elements for every kind of resource record set that you can create, delete, or update by using ChangeResourceRecordSets.   Change Propagation to Route 53 DNS Servers  When you submit a ChangeResourceRecordSets request, Route 53 propagates your changes to all of the Route 53 authoritative DNS servers managing the hosted zone. While your changes are propagating, GetChange returns a status of PENDING. When propagation is complete, GetChange returns a status of INSYNC. Changes generally propagate to all Route 53 name servers managing the hosted zone within 60 seconds. For more information, see GetChange.  Limits on ChangeResourceRecordSets Requests  For information about the limits on a ChangeResourceRecordSets request, see Limits in the Amazon Route 53 Developer Guide.
   */
  changeResourceRecordSets(params: Route53.Types.ChangeResourceRecordSetsRequest, callback?: (err: AWSError, data: Route53.Types.ChangeResourceRecordSetsResponse) => void): Request<Route53.Types.ChangeResourceRecordSetsResponse, AWSError>;
  /**
   * Creates, changes, or deletes a resource record set, which contains authoritative DNS information for a specified domain name or subdomain name. For example, you can use ChangeResourceRecordSets to create a resource record set that routes traffic for test.example.com to a web server that has an IP address of 192.0.2.44.  Deleting Resource Record Sets  To delete a resource record set, you must specify all the same values that you specified when you created it.  Change Batches and Transactional Changes  The request body must include a document with a ChangeResourceRecordSetsRequest element. The request body contains a list of change items, known as a change batch. Change batches are considered transactional changes. Route 53 validates the changes in the request and then either makes all or none of the changes in the change batch request. This ensures that DNS routing isn't adversely affected by partial changes to the resource record sets in a hosted zone.  For example, suppose a change batch request contains two changes: it deletes the CNAME resource record set for www.example.com and creates an alias resource record set for www.example.com. If validation for both records succeeds, Route 53 deletes the first resource record set and creates the second resource record set in a single operation. If validation for either the DELETE or the CREATE action fails, then the request is canceled, and the original CNAME record continues to exist.  If you try to delete the same resource record set more than once in a single change batch, Route 53 returns an InvalidChangeBatch error.   Traffic Flow  To create resource record sets for complex routing configurations, use either the traffic flow visual editor in the Route 53 console or the API actions for traffic policies and traffic policy instances. Save the configuration as a traffic policy, then associate the traffic policy with one or more domain names (such as example.com) or subdomain names (such as www.example.com), in the same hosted zone or in multiple hosted zones. You can roll back the updates if the new configuration isn't performing as expected. For more information, see Using Traffic Flow to Route DNS Traffic in the Amazon Route 53 Developer Guide.  Create, Delete, and Upsert  Use ChangeResourceRecordsSetsRequest to perform the following actions:    CREATE: Creates a resource record set that has the specified values.    DELETE: Deletes an existing resource record set that has the specified values.    UPSERT: If a resource set doesn't exist, Route 53 creates it. If a resource set exists Route 53 updates it with the values in the request.     Syntaxes for Creating, Updating, and Deleting Resource Record Sets  The syntax for a request depends on the type of resource record set that you want to create, delete, or update, such as weighted, alias, or failover. The XML elements in your request must appear in the order listed in the syntax.  For an example for each type of resource record set, see "Examples." Don't refer to the syntax in the "Parameter Syntax" section, which includes all of the elements for every kind of resource record set that you can create, delete, or update by using ChangeResourceRecordSets.   Change Propagation to Route 53 DNS Servers  When you submit a ChangeResourceRecordSets request, Route 53 propagates your changes to all of the Route 53 authoritative DNS servers managing the hosted zone. While your changes are propagating, GetChange returns a status of PENDING. When propagation is complete, GetChange returns a status of INSYNC. Changes generally propagate to all Route 53 name servers managing the hosted zone within 60 seconds. For more information, see GetChange.  Limits on ChangeResourceRecordSets Requests  For information about the limits on a ChangeResourceRecordSets request, see Limits in the Amazon Route 53 Developer Guide.
   */
  changeResourceRecordSets(callback?: (err: AWSError, data: Route53.Types.ChangeResourceRecordSetsResponse) => void): Request<Route53.Types.ChangeResourceRecordSetsResponse, AWSError>;
  /**
   * Adds, edits, or deletes tags for a health check or a hosted zone. For information about using tags for cost allocation, see Using Cost Allocation Tags in the Billing and Cost Management User Guide.
   */
  changeTagsForResource(params: Route53.Types.ChangeTagsForResourceRequest, callback?: (err: AWSError, data: Route53.Types.ChangeTagsForResourceResponse) => void): Request<Route53.Types.ChangeTagsForResourceResponse, AWSError>;
  /**
   * Adds, edits, or deletes tags for a health check or a hosted zone. For information about using tags for cost allocation, see Using Cost Allocation Tags in the Billing and Cost Management User Guide.
   */
  changeTagsForResource(callback?: (err: AWSError, data: Route53.Types.ChangeTagsForResourceResponse) => void): Request<Route53.Types.ChangeTagsForResourceResponse, AWSError>;
  /**
   * Creates a CIDR collection in the current Amazon Web Services account.
   */
  createCidrCollection(params: Route53.Types.CreateCidrCollectionRequest, callback?: (err: AWSError, data: Route53.Types.CreateCidrCollectionResponse) => void): Request<Route53.Types.CreateCidrCollectionResponse, AWSError>;
  /**
   * Creates a CIDR collection in the current Amazon Web Services account.
   */
  createCidrCollection(callback?: (err: AWSError, data: Route53.Types.CreateCidrCollectionResponse) => void): Request<Route53.Types.CreateCidrCollectionResponse, AWSError>;
  /**
   * Creates a new health check. For information about adding health checks to resource record sets, see HealthCheckId in ChangeResourceRecordSets.   ELB Load Balancers  If you're registering EC2 instances with an Elastic Load Balancing (ELB) load balancer, do not create Amazon Route 53 health checks for the EC2 instances. When you register an EC2 instance with a load balancer, you configure settings for an ELB health check, which performs a similar function to a Route 53 health check.  Private Hosted Zones  You can associate health checks with failover resource record sets in a private hosted zone. Note the following:   Route 53 health checkers are outside the VPC. To check the health of an endpoint within a VPC by IP address, you must assign a public IP address to the instance in the VPC.   You can configure a health checker to check the health of an external resource that the instance relies on, such as a database server.   You can create a CloudWatch metric, associate an alarm with the metric, and then create a health check that is based on the state of the alarm. For example, you might create a CloudWatch metric that checks the status of the Amazon EC2 StatusCheckFailed metric, add an alarm to the metric, and then create a health check that is based on the state of the alarm. For information about creating CloudWatch metrics and alarms by using the CloudWatch console, see the Amazon CloudWatch User Guide.  
   */
  createHealthCheck(params: Route53.Types.CreateHealthCheckRequest, callback?: (err: AWSError, data: Route53.Types.CreateHealthCheckResponse) => void): Request<Route53.Types.CreateHealthCheckResponse, AWSError>;
  /**
   * Creates a new health check. For information about adding health checks to resource record sets, see HealthCheckId in ChangeResourceRecordSets.   ELB Load Balancers  If you're registering EC2 instances with an Elastic Load Balancing (ELB) load balancer, do not create Amazon Route 53 health checks for the EC2 instances. When you register an EC2 instance with a load balancer, you configure settings for an ELB health check, which performs a similar function to a Route 53 health check.  Private Hosted Zones  You can associate health checks with failover resource record sets in a private hosted zone. Note the following:   Route 53 health checkers are outside the VPC. To check the health of an endpoint within a VPC by IP address, you must assign a public IP address to the instance in the VPC.   You can configure a health checker to check the health of an external resource that the instance relies on, such as a database server.   You can create a CloudWatch metric, associate an alarm with the metric, and then create a health check that is based on the state of the alarm. For example, you might create a CloudWatch metric that checks the status of the Amazon EC2 StatusCheckFailed metric, add an alarm to the metric, and then create a health check that is based on the state of the alarm. For information about creating CloudWatch metrics and alarms by using the CloudWatch console, see the Amazon CloudWatch User Guide.  
   */
  createHealthCheck(callback?: (err: AWSError, data: Route53.Types.CreateHealthCheckResponse) => void): Request<Route53.Types.CreateHealthCheckResponse, AWSError>;
  /**
   * Creates a new public or private hosted zone. You create records in a public hosted zone to define how you want to route traffic on the internet for a domain, such as example.com, and its subdomains (apex.example.com, acme.example.com). You create records in a private hosted zone to define how you want to route traffic for a domain and its subdomains within one or more Amazon Virtual Private Clouds (Amazon VPCs).   You can't convert a public hosted zone to a private hosted zone or vice versa. Instead, you must create a new hosted zone with the same name and create new resource record sets.  For more information about charges for hosted zones, see Amazon Route 53 Pricing. Note the following:   You can't create a hosted zone for a top-level domain (TLD) such as .com.   For public hosted zones, Route 53 automatically creates a default SOA record and four NS records for the zone. For more information about SOA and NS records, see NS and SOA Records that Route 53 Creates for a Hosted Zone in the Amazon Route 53 Developer Guide. If you want to use the same name servers for multiple public hosted zones, you can optionally associate a reusable delegation set with the hosted zone. See the DelegationSetId element.   If your domain is registered with a registrar other than Route 53, you must update the name servers with your registrar to make Route 53 the DNS service for the domain. For more information, see Migrating DNS Service for an Existing Domain to Amazon Route 53 in the Amazon Route 53 Developer Guide.    When you submit a CreateHostedZone request, the initial status of the hosted zone is PENDING. For public hosted zones, this means that the NS and SOA records are not yet available on all Route 53 DNS servers. When the NS and SOA records are available, the status of the zone changes to INSYNC. The CreateHostedZone request requires the caller to have an ec2:DescribeVpcs permission.  When creating private hosted zones, the Amazon VPC must belong to the same partition where the hosted zone is created. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  createHostedZone(params: Route53.Types.CreateHostedZoneRequest, callback?: (err: AWSError, data: Route53.Types.CreateHostedZoneResponse) => void): Request<Route53.Types.CreateHostedZoneResponse, AWSError>;
  /**
   * Creates a new public or private hosted zone. You create records in a public hosted zone to define how you want to route traffic on the internet for a domain, such as example.com, and its subdomains (apex.example.com, acme.example.com). You create records in a private hosted zone to define how you want to route traffic for a domain and its subdomains within one or more Amazon Virtual Private Clouds (Amazon VPCs).   You can't convert a public hosted zone to a private hosted zone or vice versa. Instead, you must create a new hosted zone with the same name and create new resource record sets.  For more information about charges for hosted zones, see Amazon Route 53 Pricing. Note the following:   You can't create a hosted zone for a top-level domain (TLD) such as .com.   For public hosted zones, Route 53 automatically creates a default SOA record and four NS records for the zone. For more information about SOA and NS records, see NS and SOA Records that Route 53 Creates for a Hosted Zone in the Amazon Route 53 Developer Guide. If you want to use the same name servers for multiple public hosted zones, you can optionally associate a reusable delegation set with the hosted zone. See the DelegationSetId element.   If your domain is registered with a registrar other than Route 53, you must update the name servers with your registrar to make Route 53 the DNS service for the domain. For more information, see Migrating DNS Service for an Existing Domain to Amazon Route 53 in the Amazon Route 53 Developer Guide.    When you submit a CreateHostedZone request, the initial status of the hosted zone is PENDING. For public hosted zones, this means that the NS and SOA records are not yet available on all Route 53 DNS servers. When the NS and SOA records are available, the status of the zone changes to INSYNC. The CreateHostedZone request requires the caller to have an ec2:DescribeVpcs permission.  When creating private hosted zones, the Amazon VPC must belong to the same partition where the hosted zone is created. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  createHostedZone(callback?: (err: AWSError, data: Route53.Types.CreateHostedZoneResponse) => void): Request<Route53.Types.CreateHostedZoneResponse, AWSError>;
  /**
   * Creates a new key-signing key (KSK) associated with a hosted zone. You can only have two KSKs per hosted zone.
   */
  createKeySigningKey(params: Route53.Types.CreateKeySigningKeyRequest, callback?: (err: AWSError, data: Route53.Types.CreateKeySigningKeyResponse) => void): Request<Route53.Types.CreateKeySigningKeyResponse, AWSError>;
  /**
   * Creates a new key-signing key (KSK) associated with a hosted zone. You can only have two KSKs per hosted zone.
   */
  createKeySigningKey(callback?: (err: AWSError, data: Route53.Types.CreateKeySigningKeyResponse) => void): Request<Route53.Types.CreateKeySigningKeyResponse, AWSError>;
  /**
   * Creates a configuration for DNS query logging. After you create a query logging configuration, Amazon Route 53 begins to publish log data to an Amazon CloudWatch Logs log group. DNS query logs contain information about the queries that Route 53 receives for a specified public hosted zone, such as the following:   Route 53 edge location that responded to the DNS query   Domain or subdomain that was requested   DNS record type, such as A or AAAA   DNS response code, such as NoError or ServFail     Log Group and Resource Policy  Before you create a query logging configuration, perform the following operations.  If you create a query logging configuration using the Route 53 console, Route 53 performs these operations automatically.    Create a CloudWatch Logs log group, and make note of the ARN, which you specify when you create a query logging configuration. Note the following:   You must create the log group in the us-east-1 region.   You must use the same Amazon Web Services account to create the log group and the hosted zone that you want to configure query logging for.   When you create log groups for query logging, we recommend that you use a consistent prefix, for example:  /aws/route53/hosted zone name   In the next step, you'll create a resource policy, which controls access to one or more log groups and the associated Amazon Web Services resources, such as Route 53 hosted zones. There's a limit on the number of resource policies that you can create, so we recommend that you use a consistent prefix so you can use the same resource policy for all the log groups that you create for query logging.     Create a CloudWatch Logs resource policy, and give it the permissions that Route 53 needs to create log streams and to send query logs to log streams. For the value of Resource, specify the ARN for the log group that you created in the previous step. To use the same resource policy for all the CloudWatch Logs log groups that you created for query logging configurations, replace the hosted zone name with *, for example:  arn:aws:logs:us-east-1:123412341234:log-group:/aws/route53/*  To avoid the confused deputy problem, a security issue where an entity without a permission for an action can coerce a more-privileged entity to perform it, you can optionally limit the permissions that a service has to a resource in a resource-based policy by supplying the following values:   For aws:SourceArn, supply the hosted zone ARN used in creating the query logging configuration. For example, aws:SourceArn: arn:aws:route53:::hostedzone/hosted zone ID.   For aws:SourceAccount, supply the account ID for the account that creates the query logging configuration. For example, aws:SourceAccount:111111111111.   For more information, see The confused deputy problem in the Amazon Web Services IAM User Guide.  You can't use the CloudWatch console to create or edit a resource policy. You must use the CloudWatch API, one of the Amazon Web Services SDKs, or the CLI.     Log Streams and Edge Locations  When Route 53 finishes creating the configuration for DNS query logging, it does the following:   Creates a log stream for an edge location the first time that the edge location responds to DNS queries for the specified hosted zone. That log stream is used to log all queries that Route 53 responds to for that edge location.   Begins to send query logs to the applicable log stream.   The name of each log stream is in the following format:   hosted zone ID/edge location code   The edge location code is a three-letter code and an arbitrarily assigned number, for example, DFW3. The three-letter code typically corresponds with the International Air Transport Association airport code for an airport near the edge location. (These abbreviations might change in the future.) For a list of edge locations, see "The Route 53 Global Network" on the Route 53 Product Details page.  Queries That Are Logged  Query logs contain only the queries that DNS resolvers forward to Route 53. If a DNS resolver has already cached the response to a query (such as the IP address for a load balancer for example.com), the resolver will continue to return the cached response. It doesn't forward another query to Route 53 until the TTL for the corresponding resource record set expires. Depending on how many DNS queries are submitted for a resource record set, and depending on the TTL for that resource record set, query logs might contain information about only one query out of every several thousand queries that are submitted to DNS. For more information about how DNS works, see Routing Internet Traffic to Your Website or Web Application in the Amazon Route 53 Developer Guide.  Log File Format  For a list of the values in each query log and the format of each value, see Logging DNS Queries in the Amazon Route 53 Developer Guide.  Pricing  For information about charges for query logs, see Amazon CloudWatch Pricing.  How to Stop Logging  If you want Route 53 to stop sending query logs to CloudWatch Logs, delete the query logging configuration. For more information, see DeleteQueryLoggingConfig.  
   */
  createQueryLoggingConfig(params: Route53.Types.CreateQueryLoggingConfigRequest, callback?: (err: AWSError, data: Route53.Types.CreateQueryLoggingConfigResponse) => void): Request<Route53.Types.CreateQueryLoggingConfigResponse, AWSError>;
  /**
   * Creates a configuration for DNS query logging. After you create a query logging configuration, Amazon Route 53 begins to publish log data to an Amazon CloudWatch Logs log group. DNS query logs contain information about the queries that Route 53 receives for a specified public hosted zone, such as the following:   Route 53 edge location that responded to the DNS query   Domain or subdomain that was requested   DNS record type, such as A or AAAA   DNS response code, such as NoError or ServFail     Log Group and Resource Policy  Before you create a query logging configuration, perform the following operations.  If you create a query logging configuration using the Route 53 console, Route 53 performs these operations automatically.    Create a CloudWatch Logs log group, and make note of the ARN, which you specify when you create a query logging configuration. Note the following:   You must create the log group in the us-east-1 region.   You must use the same Amazon Web Services account to create the log group and the hosted zone that you want to configure query logging for.   When you create log groups for query logging, we recommend that you use a consistent prefix, for example:  /aws/route53/hosted zone name   In the next step, you'll create a resource policy, which controls access to one or more log groups and the associated Amazon Web Services resources, such as Route 53 hosted zones. There's a limit on the number of resource policies that you can create, so we recommend that you use a consistent prefix so you can use the same resource policy for all the log groups that you create for query logging.     Create a CloudWatch Logs resource policy, and give it the permissions that Route 53 needs to create log streams and to send query logs to log streams. For the value of Resource, specify the ARN for the log group that you created in the previous step. To use the same resource policy for all the CloudWatch Logs log groups that you created for query logging configurations, replace the hosted zone name with *, for example:  arn:aws:logs:us-east-1:123412341234:log-group:/aws/route53/*  To avoid the confused deputy problem, a security issue where an entity without a permission for an action can coerce a more-privileged entity to perform it, you can optionally limit the permissions that a service has to a resource in a resource-based policy by supplying the following values:   For aws:SourceArn, supply the hosted zone ARN used in creating the query logging configuration. For example, aws:SourceArn: arn:aws:route53:::hostedzone/hosted zone ID.   For aws:SourceAccount, supply the account ID for the account that creates the query logging configuration. For example, aws:SourceAccount:111111111111.   For more information, see The confused deputy problem in the Amazon Web Services IAM User Guide.  You can't use the CloudWatch console to create or edit a resource policy. You must use the CloudWatch API, one of the Amazon Web Services SDKs, or the CLI.     Log Streams and Edge Locations  When Route 53 finishes creating the configuration for DNS query logging, it does the following:   Creates a log stream for an edge location the first time that the edge location responds to DNS queries for the specified hosted zone. That log stream is used to log all queries that Route 53 responds to for that edge location.   Begins to send query logs to the applicable log stream.   The name of each log stream is in the following format:   hosted zone ID/edge location code   The edge location code is a three-letter code and an arbitrarily assigned number, for example, DFW3. The three-letter code typically corresponds with the International Air Transport Association airport code for an airport near the edge location. (These abbreviations might change in the future.) For a list of edge locations, see "The Route 53 Global Network" on the Route 53 Product Details page.  Queries That Are Logged  Query logs contain only the queries that DNS resolvers forward to Route 53. If a DNS resolver has already cached the response to a query (such as the IP address for a load balancer for example.com), the resolver will continue to return the cached response. It doesn't forward another query to Route 53 until the TTL for the corresponding resource record set expires. Depending on how many DNS queries are submitted for a resource record set, and depending on the TTL for that resource record set, query logs might contain information about only one query out of every several thousand queries that are submitted to DNS. For more information about how DNS works, see Routing Internet Traffic to Your Website or Web Application in the Amazon Route 53 Developer Guide.  Log File Format  For a list of the values in each query log and the format of each value, see Logging DNS Queries in the Amazon Route 53 Developer Guide.  Pricing  For information about charges for query logs, see Amazon CloudWatch Pricing.  How to Stop Logging  If you want Route 53 to stop sending query logs to CloudWatch Logs, delete the query logging configuration. For more information, see DeleteQueryLoggingConfig.  
   */
  createQueryLoggingConfig(callback?: (err: AWSError, data: Route53.Types.CreateQueryLoggingConfigResponse) => void): Request<Route53.Types.CreateQueryLoggingConfigResponse, AWSError>;
  /**
   * Creates a delegation set (a group of four name servers) that can be reused by multiple hosted zones that were created by the same Amazon Web Services account.  You can also create a reusable delegation set that uses the four name servers that are associated with an existing hosted zone. Specify the hosted zone ID in the CreateReusableDelegationSet request.  You can't associate a reusable delegation set with a private hosted zone.  For information about using a reusable delegation set to configure white label name servers, see Configuring White Label Name Servers. The process for migrating existing hosted zones to use a reusable delegation set is comparable to the process for configuring white label name servers. You need to perform the following steps:   Create a reusable delegation set.   Recreate hosted zones, and reduce the TTL to 60 seconds or less.   Recreate resource record sets in the new hosted zones.   Change the registrar's name servers to use the name servers for the new hosted zones.   Monitor traffic for the website or application.   Change TTLs back to their original values.   If you want to migrate existing hosted zones to use a reusable delegation set, the existing hosted zones can't use any of the name servers that are assigned to the reusable delegation set. If one or more hosted zones do use one or more name servers that are assigned to the reusable delegation set, you can do one of the following:   For small numbers of hosted zones—up to a few hundred—it's relatively easy to create reusable delegation sets until you get one that has four name servers that don't overlap with any of the name servers in your hosted zones.   For larger numbers of hosted zones, the easiest solution is to use more than one reusable delegation set.   For larger numbers of hosted zones, you can also migrate hosted zones that have overlapping name servers to hosted zones that don't have overlapping name servers, then migrate the hosted zones again to use the reusable delegation set.  
   */
  createReusableDelegationSet(params: Route53.Types.CreateReusableDelegationSetRequest, callback?: (err: AWSError, data: Route53.Types.CreateReusableDelegationSetResponse) => void): Request<Route53.Types.CreateReusableDelegationSetResponse, AWSError>;
  /**
   * Creates a delegation set (a group of four name servers) that can be reused by multiple hosted zones that were created by the same Amazon Web Services account.  You can also create a reusable delegation set that uses the four name servers that are associated with an existing hosted zone. Specify the hosted zone ID in the CreateReusableDelegationSet request.  You can't associate a reusable delegation set with a private hosted zone.  For information about using a reusable delegation set to configure white label name servers, see Configuring White Label Name Servers. The process for migrating existing hosted zones to use a reusable delegation set is comparable to the process for configuring white label name servers. You need to perform the following steps:   Create a reusable delegation set.   Recreate hosted zones, and reduce the TTL to 60 seconds or less.   Recreate resource record sets in the new hosted zones.   Change the registrar's name servers to use the name servers for the new hosted zones.   Monitor traffic for the website or application.   Change TTLs back to their original values.   If you want to migrate existing hosted zones to use a reusable delegation set, the existing hosted zones can't use any of the name servers that are assigned to the reusable delegation set. If one or more hosted zones do use one or more name servers that are assigned to the reusable delegation set, you can do one of the following:   For small numbers of hosted zones—up to a few hundred—it's relatively easy to create reusable delegation sets until you get one that has four name servers that don't overlap with any of the name servers in your hosted zones.   For larger numbers of hosted zones, the easiest solution is to use more than one reusable delegation set.   For larger numbers of hosted zones, you can also migrate hosted zones that have overlapping name servers to hosted zones that don't have overlapping name servers, then migrate the hosted zones again to use the reusable delegation set.  
   */
  createReusableDelegationSet(callback?: (err: AWSError, data: Route53.Types.CreateReusableDelegationSetResponse) => void): Request<Route53.Types.CreateReusableDelegationSetResponse, AWSError>;
  /**
   * Creates a traffic policy, which you use to create multiple DNS resource record sets for one domain name (such as example.com) or one subdomain name (such as www.example.com).
   */
  createTrafficPolicy(params: Route53.Types.CreateTrafficPolicyRequest, callback?: (err: AWSError, data: Route53.Types.CreateTrafficPolicyResponse) => void): Request<Route53.Types.CreateTrafficPolicyResponse, AWSError>;
  /**
   * Creates a traffic policy, which you use to create multiple DNS resource record sets for one domain name (such as example.com) or one subdomain name (such as www.example.com).
   */
  createTrafficPolicy(callback?: (err: AWSError, data: Route53.Types.CreateTrafficPolicyResponse) => void): Request<Route53.Types.CreateTrafficPolicyResponse, AWSError>;
  /**
   * Creates resource record sets in a specified hosted zone based on the settings in a specified traffic policy version. In addition, CreateTrafficPolicyInstance associates the resource record sets with a specified domain name (such as example.com) or subdomain name (such as www.example.com). Amazon Route 53 responds to DNS queries for the domain or subdomain name by using the resource record sets that CreateTrafficPolicyInstance created.  After you submit an CreateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. Use GetTrafficPolicyInstance with the id of new traffic policy instance to confirm that the CreateTrafficPolicyInstance request completed successfully. For more information, see the State response element. 
   */
  createTrafficPolicyInstance(params: Route53.Types.CreateTrafficPolicyInstanceRequest, callback?: (err: AWSError, data: Route53.Types.CreateTrafficPolicyInstanceResponse) => void): Request<Route53.Types.CreateTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Creates resource record sets in a specified hosted zone based on the settings in a specified traffic policy version. In addition, CreateTrafficPolicyInstance associates the resource record sets with a specified domain name (such as example.com) or subdomain name (such as www.example.com). Amazon Route 53 responds to DNS queries for the domain or subdomain name by using the resource record sets that CreateTrafficPolicyInstance created.  After you submit an CreateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. Use GetTrafficPolicyInstance with the id of new traffic policy instance to confirm that the CreateTrafficPolicyInstance request completed successfully. For more information, see the State response element. 
   */
  createTrafficPolicyInstance(callback?: (err: AWSError, data: Route53.Types.CreateTrafficPolicyInstanceResponse) => void): Request<Route53.Types.CreateTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Creates a new version of an existing traffic policy. When you create a new version of a traffic policy, you specify the ID of the traffic policy that you want to update and a JSON-formatted document that describes the new version. You use traffic policies to create multiple DNS resource record sets for one domain name (such as example.com) or one subdomain name (such as www.example.com). You can create a maximum of 1000 versions of a traffic policy. If you reach the limit and need to create another version, you'll need to start a new traffic policy.
   */
  createTrafficPolicyVersion(params: Route53.Types.CreateTrafficPolicyVersionRequest, callback?: (err: AWSError, data: Route53.Types.CreateTrafficPolicyVersionResponse) => void): Request<Route53.Types.CreateTrafficPolicyVersionResponse, AWSError>;
  /**
   * Creates a new version of an existing traffic policy. When you create a new version of a traffic policy, you specify the ID of the traffic policy that you want to update and a JSON-formatted document that describes the new version. You use traffic policies to create multiple DNS resource record sets for one domain name (such as example.com) or one subdomain name (such as www.example.com). You can create a maximum of 1000 versions of a traffic policy. If you reach the limit and need to create another version, you'll need to start a new traffic policy.
   */
  createTrafficPolicyVersion(callback?: (err: AWSError, data: Route53.Types.CreateTrafficPolicyVersionResponse) => void): Request<Route53.Types.CreateTrafficPolicyVersionResponse, AWSError>;
  /**
   * Authorizes the Amazon Web Services account that created a specified VPC to submit an AssociateVPCWithHostedZone request to associate the VPC with a specified hosted zone that was created by a different account. To submit a CreateVPCAssociationAuthorization request, you must use the account that created the hosted zone. After you authorize the association, use the account that created the VPC to submit an AssociateVPCWithHostedZone request.  If you want to associate multiple VPCs that you created by using one account with a hosted zone that you created by using a different account, you must submit one authorization request for each VPC. 
   */
  createVPCAssociationAuthorization(params: Route53.Types.CreateVPCAssociationAuthorizationRequest, callback?: (err: AWSError, data: Route53.Types.CreateVPCAssociationAuthorizationResponse) => void): Request<Route53.Types.CreateVPCAssociationAuthorizationResponse, AWSError>;
  /**
   * Authorizes the Amazon Web Services account that created a specified VPC to submit an AssociateVPCWithHostedZone request to associate the VPC with a specified hosted zone that was created by a different account. To submit a CreateVPCAssociationAuthorization request, you must use the account that created the hosted zone. After you authorize the association, use the account that created the VPC to submit an AssociateVPCWithHostedZone request.  If you want to associate multiple VPCs that you created by using one account with a hosted zone that you created by using a different account, you must submit one authorization request for each VPC. 
   */
  createVPCAssociationAuthorization(callback?: (err: AWSError, data: Route53.Types.CreateVPCAssociationAuthorizationResponse) => void): Request<Route53.Types.CreateVPCAssociationAuthorizationResponse, AWSError>;
  /**
   * Deactivates a key-signing key (KSK) so that it will not be used for signing by DNSSEC. This operation changes the KSK status to INACTIVE.
   */
  deactivateKeySigningKey(params: Route53.Types.DeactivateKeySigningKeyRequest, callback?: (err: AWSError, data: Route53.Types.DeactivateKeySigningKeyResponse) => void): Request<Route53.Types.DeactivateKeySigningKeyResponse, AWSError>;
  /**
   * Deactivates a key-signing key (KSK) so that it will not be used for signing by DNSSEC. This operation changes the KSK status to INACTIVE.
   */
  deactivateKeySigningKey(callback?: (err: AWSError, data: Route53.Types.DeactivateKeySigningKeyResponse) => void): Request<Route53.Types.DeactivateKeySigningKeyResponse, AWSError>;
  /**
   * Deletes a CIDR collection in the current Amazon Web Services account. The collection must be empty before it can be deleted.
   */
  deleteCidrCollection(params: Route53.Types.DeleteCidrCollectionRequest, callback?: (err: AWSError, data: Route53.Types.DeleteCidrCollectionResponse) => void): Request<Route53.Types.DeleteCidrCollectionResponse, AWSError>;
  /**
   * Deletes a CIDR collection in the current Amazon Web Services account. The collection must be empty before it can be deleted.
   */
  deleteCidrCollection(callback?: (err: AWSError, data: Route53.Types.DeleteCidrCollectionResponse) => void): Request<Route53.Types.DeleteCidrCollectionResponse, AWSError>;
  /**
   * Deletes a health check.  Amazon Route 53 does not prevent you from deleting a health check even if the health check is associated with one or more resource record sets. If you delete a health check and you don't update the associated resource record sets, the future status of the health check can't be predicted and may change. This will affect the routing of DNS queries for your DNS failover configuration. For more information, see Replacing and Deleting Health Checks in the Amazon Route 53 Developer Guide.  If you're using Cloud Map and you configured Cloud Map to create a Route 53 health check when you register an instance, you can't use the Route 53 DeleteHealthCheck command to delete the health check. The health check is deleted automatically when you deregister the instance; there can be a delay of several hours before the health check is deleted from Route 53. 
   */
  deleteHealthCheck(params: Route53.Types.DeleteHealthCheckRequest, callback?: (err: AWSError, data: Route53.Types.DeleteHealthCheckResponse) => void): Request<Route53.Types.DeleteHealthCheckResponse, AWSError>;
  /**
   * Deletes a health check.  Amazon Route 53 does not prevent you from deleting a health check even if the health check is associated with one or more resource record sets. If you delete a health check and you don't update the associated resource record sets, the future status of the health check can't be predicted and may change. This will affect the routing of DNS queries for your DNS failover configuration. For more information, see Replacing and Deleting Health Checks in the Amazon Route 53 Developer Guide.  If you're using Cloud Map and you configured Cloud Map to create a Route 53 health check when you register an instance, you can't use the Route 53 DeleteHealthCheck command to delete the health check. The health check is deleted automatically when you deregister the instance; there can be a delay of several hours before the health check is deleted from Route 53. 
   */
  deleteHealthCheck(callback?: (err: AWSError, data: Route53.Types.DeleteHealthCheckResponse) => void): Request<Route53.Types.DeleteHealthCheckResponse, AWSError>;
  /**
   * Deletes a hosted zone. If the hosted zone was created by another service, such as Cloud Map, see Deleting Public Hosted Zones That Were Created by Another Service in the Amazon Route 53 Developer Guide for information about how to delete it. (The process is the same for public and private hosted zones that were created by another service.) If you want to keep your domain registration but you want to stop routing internet traffic to your website or web application, we recommend that you delete resource record sets in the hosted zone instead of deleting the hosted zone.  If you delete a hosted zone, you can't undelete it. You must create a new hosted zone and update the name servers for your domain registration, which can require up to 48 hours to take effect. (If you delegated responsibility for a subdomain to a hosted zone and you delete the child hosted zone, you must update the name servers in the parent hosted zone.) In addition, if you delete a hosted zone, someone could hijack the domain and route traffic to their own resources using your domain name.  If you want to avoid the monthly charge for the hosted zone, you can transfer DNS service for the domain to a free DNS service. When you transfer DNS service, you have to update the name servers for the domain registration. If the domain is registered with Route 53, see UpdateDomainNameservers for information about how to replace Route 53 name servers with name servers for the new DNS service. If the domain is registered with another registrar, use the method provided by the registrar to update name servers for the domain registration. For more information, perform an internet search on "free DNS service." You can delete a hosted zone only if it contains only the default SOA record and NS resource record sets. If the hosted zone contains other resource record sets, you must delete them before you can delete the hosted zone. If you try to delete a hosted zone that contains other resource record sets, the request fails, and Route 53 returns a HostedZoneNotEmpty error. For information about deleting records from your hosted zone, see ChangeResourceRecordSets. To verify that the hosted zone has been deleted, do one of the following:   Use the GetHostedZone action to request information about the hosted zone.   Use the ListHostedZones action to get a list of the hosted zones associated with the current Amazon Web Services account.  
   */
  deleteHostedZone(params: Route53.Types.DeleteHostedZoneRequest, callback?: (err: AWSError, data: Route53.Types.DeleteHostedZoneResponse) => void): Request<Route53.Types.DeleteHostedZoneResponse, AWSError>;
  /**
   * Deletes a hosted zone. If the hosted zone was created by another service, such as Cloud Map, see Deleting Public Hosted Zones That Were Created by Another Service in the Amazon Route 53 Developer Guide for information about how to delete it. (The process is the same for public and private hosted zones that were created by another service.) If you want to keep your domain registration but you want to stop routing internet traffic to your website or web application, we recommend that you delete resource record sets in the hosted zone instead of deleting the hosted zone.  If you delete a hosted zone, you can't undelete it. You must create a new hosted zone and update the name servers for your domain registration, which can require up to 48 hours to take effect. (If you delegated responsibility for a subdomain to a hosted zone and you delete the child hosted zone, you must update the name servers in the parent hosted zone.) In addition, if you delete a hosted zone, someone could hijack the domain and route traffic to their own resources using your domain name.  If you want to avoid the monthly charge for the hosted zone, you can transfer DNS service for the domain to a free DNS service. When you transfer DNS service, you have to update the name servers for the domain registration. If the domain is registered with Route 53, see UpdateDomainNameservers for information about how to replace Route 53 name servers with name servers for the new DNS service. If the domain is registered with another registrar, use the method provided by the registrar to update name servers for the domain registration. For more information, perform an internet search on "free DNS service." You can delete a hosted zone only if it contains only the default SOA record and NS resource record sets. If the hosted zone contains other resource record sets, you must delete them before you can delete the hosted zone. If you try to delete a hosted zone that contains other resource record sets, the request fails, and Route 53 returns a HostedZoneNotEmpty error. For information about deleting records from your hosted zone, see ChangeResourceRecordSets. To verify that the hosted zone has been deleted, do one of the following:   Use the GetHostedZone action to request information about the hosted zone.   Use the ListHostedZones action to get a list of the hosted zones associated with the current Amazon Web Services account.  
   */
  deleteHostedZone(callback?: (err: AWSError, data: Route53.Types.DeleteHostedZoneResponse) => void): Request<Route53.Types.DeleteHostedZoneResponse, AWSError>;
  /**
   * Deletes a key-signing key (KSK). Before you can delete a KSK, you must deactivate it. The KSK must be deactivated before you can delete it regardless of whether the hosted zone is enabled for DNSSEC signing. You can use DeactivateKeySigningKey to deactivate the key before you delete it. Use GetDNSSEC to verify that the KSK is in an INACTIVE status.
   */
  deleteKeySigningKey(params: Route53.Types.DeleteKeySigningKeyRequest, callback?: (err: AWSError, data: Route53.Types.DeleteKeySigningKeyResponse) => void): Request<Route53.Types.DeleteKeySigningKeyResponse, AWSError>;
  /**
   * Deletes a key-signing key (KSK). Before you can delete a KSK, you must deactivate it. The KSK must be deactivated before you can delete it regardless of whether the hosted zone is enabled for DNSSEC signing. You can use DeactivateKeySigningKey to deactivate the key before you delete it. Use GetDNSSEC to verify that the KSK is in an INACTIVE status.
   */
  deleteKeySigningKey(callback?: (err: AWSError, data: Route53.Types.DeleteKeySigningKeyResponse) => void): Request<Route53.Types.DeleteKeySigningKeyResponse, AWSError>;
  /**
   * Deletes a configuration for DNS query logging. If you delete a configuration, Amazon Route 53 stops sending query logs to CloudWatch Logs. Route 53 doesn't delete any logs that are already in CloudWatch Logs. For more information about DNS query logs, see CreateQueryLoggingConfig.
   */
  deleteQueryLoggingConfig(params: Route53.Types.DeleteQueryLoggingConfigRequest, callback?: (err: AWSError, data: Route53.Types.DeleteQueryLoggingConfigResponse) => void): Request<Route53.Types.DeleteQueryLoggingConfigResponse, AWSError>;
  /**
   * Deletes a configuration for DNS query logging. If you delete a configuration, Amazon Route 53 stops sending query logs to CloudWatch Logs. Route 53 doesn't delete any logs that are already in CloudWatch Logs. For more information about DNS query logs, see CreateQueryLoggingConfig.
   */
  deleteQueryLoggingConfig(callback?: (err: AWSError, data: Route53.Types.DeleteQueryLoggingConfigResponse) => void): Request<Route53.Types.DeleteQueryLoggingConfigResponse, AWSError>;
  /**
   * Deletes a reusable delegation set.  You can delete a reusable delegation set only if it isn't associated with any hosted zones.  To verify that the reusable delegation set is not associated with any hosted zones, submit a GetReusableDelegationSet request and specify the ID of the reusable delegation set that you want to delete.
   */
  deleteReusableDelegationSet(params: Route53.Types.DeleteReusableDelegationSetRequest, callback?: (err: AWSError, data: Route53.Types.DeleteReusableDelegationSetResponse) => void): Request<Route53.Types.DeleteReusableDelegationSetResponse, AWSError>;
  /**
   * Deletes a reusable delegation set.  You can delete a reusable delegation set only if it isn't associated with any hosted zones.  To verify that the reusable delegation set is not associated with any hosted zones, submit a GetReusableDelegationSet request and specify the ID of the reusable delegation set that you want to delete.
   */
  deleteReusableDelegationSet(callback?: (err: AWSError, data: Route53.Types.DeleteReusableDelegationSetResponse) => void): Request<Route53.Types.DeleteReusableDelegationSetResponse, AWSError>;
  /**
   * Deletes a traffic policy. When you delete a traffic policy, Route 53 sets a flag on the policy to indicate that it has been deleted. However, Route 53 never fully deletes the traffic policy. Note the following:   Deleted traffic policies aren't listed if you run ListTrafficPolicies.    There's no way to get a list of deleted policies.   If you retain the ID of the policy, you can get information about the policy, including the traffic policy document, by running GetTrafficPolicy.  
   */
  deleteTrafficPolicy(params: Route53.Types.DeleteTrafficPolicyRequest, callback?: (err: AWSError, data: Route53.Types.DeleteTrafficPolicyResponse) => void): Request<Route53.Types.DeleteTrafficPolicyResponse, AWSError>;
  /**
   * Deletes a traffic policy. When you delete a traffic policy, Route 53 sets a flag on the policy to indicate that it has been deleted. However, Route 53 never fully deletes the traffic policy. Note the following:   Deleted traffic policies aren't listed if you run ListTrafficPolicies.    There's no way to get a list of deleted policies.   If you retain the ID of the policy, you can get information about the policy, including the traffic policy document, by running GetTrafficPolicy.  
   */
  deleteTrafficPolicy(callback?: (err: AWSError, data: Route53.Types.DeleteTrafficPolicyResponse) => void): Request<Route53.Types.DeleteTrafficPolicyResponse, AWSError>;
  /**
   * Deletes a traffic policy instance and all of the resource record sets that Amazon Route 53 created when you created the instance.  In the Route 53 console, traffic policy instances are known as policy records. 
   */
  deleteTrafficPolicyInstance(params: Route53.Types.DeleteTrafficPolicyInstanceRequest, callback?: (err: AWSError, data: Route53.Types.DeleteTrafficPolicyInstanceResponse) => void): Request<Route53.Types.DeleteTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Deletes a traffic policy instance and all of the resource record sets that Amazon Route 53 created when you created the instance.  In the Route 53 console, traffic policy instances are known as policy records. 
   */
  deleteTrafficPolicyInstance(callback?: (err: AWSError, data: Route53.Types.DeleteTrafficPolicyInstanceResponse) => void): Request<Route53.Types.DeleteTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Removes authorization to submit an AssociateVPCWithHostedZone request to associate a specified VPC with a hosted zone that was created by a different account. You must use the account that created the hosted zone to submit a DeleteVPCAssociationAuthorization request.  Sending this request only prevents the Amazon Web Services account that created the VPC from associating the VPC with the Amazon Route 53 hosted zone in the future. If the VPC is already associated with the hosted zone, DeleteVPCAssociationAuthorization won't disassociate the VPC from the hosted zone. If you want to delete an existing association, use DisassociateVPCFromHostedZone. 
   */
  deleteVPCAssociationAuthorization(params: Route53.Types.DeleteVPCAssociationAuthorizationRequest, callback?: (err: AWSError, data: Route53.Types.DeleteVPCAssociationAuthorizationResponse) => void): Request<Route53.Types.DeleteVPCAssociationAuthorizationResponse, AWSError>;
  /**
   * Removes authorization to submit an AssociateVPCWithHostedZone request to associate a specified VPC with a hosted zone that was created by a different account. You must use the account that created the hosted zone to submit a DeleteVPCAssociationAuthorization request.  Sending this request only prevents the Amazon Web Services account that created the VPC from associating the VPC with the Amazon Route 53 hosted zone in the future. If the VPC is already associated with the hosted zone, DeleteVPCAssociationAuthorization won't disassociate the VPC from the hosted zone. If you want to delete an existing association, use DisassociateVPCFromHostedZone. 
   */
  deleteVPCAssociationAuthorization(callback?: (err: AWSError, data: Route53.Types.DeleteVPCAssociationAuthorizationResponse) => void): Request<Route53.Types.DeleteVPCAssociationAuthorizationResponse, AWSError>;
  /**
   * Disables DNSSEC signing in a specific hosted zone. This action does not deactivate any key-signing keys (KSKs) that are active in the hosted zone.
   */
  disableHostedZoneDNSSEC(params: Route53.Types.DisableHostedZoneDNSSECRequest, callback?: (err: AWSError, data: Route53.Types.DisableHostedZoneDNSSECResponse) => void): Request<Route53.Types.DisableHostedZoneDNSSECResponse, AWSError>;
  /**
   * Disables DNSSEC signing in a specific hosted zone. This action does not deactivate any key-signing keys (KSKs) that are active in the hosted zone.
   */
  disableHostedZoneDNSSEC(callback?: (err: AWSError, data: Route53.Types.DisableHostedZoneDNSSECResponse) => void): Request<Route53.Types.DisableHostedZoneDNSSECResponse, AWSError>;
  /**
   * Disassociates an Amazon Virtual Private Cloud (Amazon VPC) from an Amazon Route 53 private hosted zone. Note the following:   You can't disassociate the last Amazon VPC from a private hosted zone.   You can't convert a private hosted zone into a public hosted zone.   You can submit a DisassociateVPCFromHostedZone request using either the account that created the hosted zone or the account that created the Amazon VPC.   Some services, such as Cloud Map and Amazon Elastic File System (Amazon EFS) automatically create hosted zones and associate VPCs with the hosted zones. A service can create a hosted zone using your account or using its own account. You can disassociate a VPC from a hosted zone only if the service created the hosted zone using your account. When you run DisassociateVPCFromHostedZone, if the hosted zone has a value for OwningAccount, you can use DisassociateVPCFromHostedZone. If the hosted zone has a value for OwningService, you can't use DisassociateVPCFromHostedZone.    When revoking access, the hosted zone and the Amazon VPC must belong to the same partition. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  disassociateVPCFromHostedZone(params: Route53.Types.DisassociateVPCFromHostedZoneRequest, callback?: (err: AWSError, data: Route53.Types.DisassociateVPCFromHostedZoneResponse) => void): Request<Route53.Types.DisassociateVPCFromHostedZoneResponse, AWSError>;
  /**
   * Disassociates an Amazon Virtual Private Cloud (Amazon VPC) from an Amazon Route 53 private hosted zone. Note the following:   You can't disassociate the last Amazon VPC from a private hosted zone.   You can't convert a private hosted zone into a public hosted zone.   You can submit a DisassociateVPCFromHostedZone request using either the account that created the hosted zone or the account that created the Amazon VPC.   Some services, such as Cloud Map and Amazon Elastic File System (Amazon EFS) automatically create hosted zones and associate VPCs with the hosted zones. A service can create a hosted zone using your account or using its own account. You can disassociate a VPC from a hosted zone only if the service created the hosted zone using your account. When you run DisassociateVPCFromHostedZone, if the hosted zone has a value for OwningAccount, you can use DisassociateVPCFromHostedZone. If the hosted zone has a value for OwningService, you can't use DisassociateVPCFromHostedZone.    When revoking access, the hosted zone and the Amazon VPC must belong to the same partition. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  disassociateVPCFromHostedZone(callback?: (err: AWSError, data: Route53.Types.DisassociateVPCFromHostedZoneResponse) => void): Request<Route53.Types.DisassociateVPCFromHostedZoneResponse, AWSError>;
  /**
   * Enables DNSSEC signing in a specific hosted zone.
   */
  enableHostedZoneDNSSEC(params: Route53.Types.EnableHostedZoneDNSSECRequest, callback?: (err: AWSError, data: Route53.Types.EnableHostedZoneDNSSECResponse) => void): Request<Route53.Types.EnableHostedZoneDNSSECResponse, AWSError>;
  /**
   * Enables DNSSEC signing in a specific hosted zone.
   */
  enableHostedZoneDNSSEC(callback?: (err: AWSError, data: Route53.Types.EnableHostedZoneDNSSECResponse) => void): Request<Route53.Types.EnableHostedZoneDNSSECResponse, AWSError>;
  /**
   * Gets the specified limit for the current account, for example, the maximum number of health checks that you can create using the account. For the default limit, see Limits in the Amazon Route 53 Developer Guide. To request a higher limit, open a case.  You can also view account limits in Amazon Web Services Trusted Advisor. Sign in to the Amazon Web Services Management Console and open the Trusted Advisor console at https://console.aws.amazon.com/trustedadvisor/. Then choose Service limits in the navigation pane. 
   */
  getAccountLimit(params: Route53.Types.GetAccountLimitRequest, callback?: (err: AWSError, data: Route53.Types.GetAccountLimitResponse) => void): Request<Route53.Types.GetAccountLimitResponse, AWSError>;
  /**
   * Gets the specified limit for the current account, for example, the maximum number of health checks that you can create using the account. For the default limit, see Limits in the Amazon Route 53 Developer Guide. To request a higher limit, open a case.  You can also view account limits in Amazon Web Services Trusted Advisor. Sign in to the Amazon Web Services Management Console and open the Trusted Advisor console at https://console.aws.amazon.com/trustedadvisor/. Then choose Service limits in the navigation pane. 
   */
  getAccountLimit(callback?: (err: AWSError, data: Route53.Types.GetAccountLimitResponse) => void): Request<Route53.Types.GetAccountLimitResponse, AWSError>;
  /**
   * Returns the current status of a change batch request. The status is one of the following values:    PENDING indicates that the changes in this request have not propagated to all Amazon Route 53 DNS servers managing the hosted zone. This is the initial status of all change batch requests.    INSYNC indicates that the changes have propagated to all Route 53 DNS servers managing the hosted zone.   
   */
  getChange(params: Route53.Types.GetChangeRequest, callback?: (err: AWSError, data: Route53.Types.GetChangeResponse) => void): Request<Route53.Types.GetChangeResponse, AWSError>;
  /**
   * Returns the current status of a change batch request. The status is one of the following values:    PENDING indicates that the changes in this request have not propagated to all Amazon Route 53 DNS servers managing the hosted zone. This is the initial status of all change batch requests.    INSYNC indicates that the changes have propagated to all Route 53 DNS servers managing the hosted zone.   
   */
  getChange(callback?: (err: AWSError, data: Route53.Types.GetChangeResponse) => void): Request<Route53.Types.GetChangeResponse, AWSError>;
  /**
   * Route 53 does not perform authorization for this API because it retrieves information that is already available to the public.   GetCheckerIpRanges still works, but we recommend that you download ip-ranges.json, which includes IP address ranges for all Amazon Web Services services. For more information, see IP Address Ranges of Amazon Route 53 Servers in the Amazon Route 53 Developer Guide. 
   */
  getCheckerIpRanges(params: Route53.Types.GetCheckerIpRangesRequest, callback?: (err: AWSError, data: Route53.Types.GetCheckerIpRangesResponse) => void): Request<Route53.Types.GetCheckerIpRangesResponse, AWSError>;
  /**
   * Route 53 does not perform authorization for this API because it retrieves information that is already available to the public.   GetCheckerIpRanges still works, but we recommend that you download ip-ranges.json, which includes IP address ranges for all Amazon Web Services services. For more information, see IP Address Ranges of Amazon Route 53 Servers in the Amazon Route 53 Developer Guide. 
   */
  getCheckerIpRanges(callback?: (err: AWSError, data: Route53.Types.GetCheckerIpRangesResponse) => void): Request<Route53.Types.GetCheckerIpRangesResponse, AWSError>;
  /**
   * Returns information about DNSSEC for a specific hosted zone, including the key-signing keys (KSKs) in the hosted zone.
   */
  getDNSSEC(params: Route53.Types.GetDNSSECRequest, callback?: (err: AWSError, data: Route53.Types.GetDNSSECResponse) => void): Request<Route53.Types.GetDNSSECResponse, AWSError>;
  /**
   * Returns information about DNSSEC for a specific hosted zone, including the key-signing keys (KSKs) in the hosted zone.
   */
  getDNSSEC(callback?: (err: AWSError, data: Route53.Types.GetDNSSECResponse) => void): Request<Route53.Types.GetDNSSECResponse, AWSError>;
  /**
   * Gets information about whether a specified geographic location is supported for Amazon Route 53 geolocation resource record sets. Route 53 does not perform authorization for this API because it retrieves information that is already available to the public. Use the following syntax to determine whether a continent is supported for geolocation:  GET /2013-04-01/geolocation?continentcode=two-letter abbreviation for a continent   Use the following syntax to determine whether a country is supported for geolocation:  GET /2013-04-01/geolocation?countrycode=two-character country code   Use the following syntax to determine whether a subdivision of a country is supported for geolocation:  GET /2013-04-01/geolocation?countrycode=two-character country code&amp;subdivisioncode=subdivision code  
   */
  getGeoLocation(params: Route53.Types.GetGeoLocationRequest, callback?: (err: AWSError, data: Route53.Types.GetGeoLocationResponse) => void): Request<Route53.Types.GetGeoLocationResponse, AWSError>;
  /**
   * Gets information about whether a specified geographic location is supported for Amazon Route 53 geolocation resource record sets. Route 53 does not perform authorization for this API because it retrieves information that is already available to the public. Use the following syntax to determine whether a continent is supported for geolocation:  GET /2013-04-01/geolocation?continentcode=two-letter abbreviation for a continent   Use the following syntax to determine whether a country is supported for geolocation:  GET /2013-04-01/geolocation?countrycode=two-character country code   Use the following syntax to determine whether a subdivision of a country is supported for geolocation:  GET /2013-04-01/geolocation?countrycode=two-character country code&amp;subdivisioncode=subdivision code  
   */
  getGeoLocation(callback?: (err: AWSError, data: Route53.Types.GetGeoLocationResponse) => void): Request<Route53.Types.GetGeoLocationResponse, AWSError>;
  /**
   * Gets information about a specified health check.
   */
  getHealthCheck(params: Route53.Types.GetHealthCheckRequest, callback?: (err: AWSError, data: Route53.Types.GetHealthCheckResponse) => void): Request<Route53.Types.GetHealthCheckResponse, AWSError>;
  /**
   * Gets information about a specified health check.
   */
  getHealthCheck(callback?: (err: AWSError, data: Route53.Types.GetHealthCheckResponse) => void): Request<Route53.Types.GetHealthCheckResponse, AWSError>;
  /**
   * Retrieves the number of health checks that are associated with the current Amazon Web Services account.
   */
  getHealthCheckCount(params: Route53.Types.GetHealthCheckCountRequest, callback?: (err: AWSError, data: Route53.Types.GetHealthCheckCountResponse) => void): Request<Route53.Types.GetHealthCheckCountResponse, AWSError>;
  /**
   * Retrieves the number of health checks that are associated with the current Amazon Web Services account.
   */
  getHealthCheckCount(callback?: (err: AWSError, data: Route53.Types.GetHealthCheckCountResponse) => void): Request<Route53.Types.GetHealthCheckCountResponse, AWSError>;
  /**
   * Gets the reason that a specified health check failed most recently.
   */
  getHealthCheckLastFailureReason(params: Route53.Types.GetHealthCheckLastFailureReasonRequest, callback?: (err: AWSError, data: Route53.Types.GetHealthCheckLastFailureReasonResponse) => void): Request<Route53.Types.GetHealthCheckLastFailureReasonResponse, AWSError>;
  /**
   * Gets the reason that a specified health check failed most recently.
   */
  getHealthCheckLastFailureReason(callback?: (err: AWSError, data: Route53.Types.GetHealthCheckLastFailureReasonResponse) => void): Request<Route53.Types.GetHealthCheckLastFailureReasonResponse, AWSError>;
  /**
   * Gets status of a specified health check.   This API is intended for use during development to diagnose behavior. It doesn’t support production use-cases with high query rates that require immediate and actionable responses. 
   */
  getHealthCheckStatus(params: Route53.Types.GetHealthCheckStatusRequest, callback?: (err: AWSError, data: Route53.Types.GetHealthCheckStatusResponse) => void): Request<Route53.Types.GetHealthCheckStatusResponse, AWSError>;
  /**
   * Gets status of a specified health check.   This API is intended for use during development to diagnose behavior. It doesn’t support production use-cases with high query rates that require immediate and actionable responses. 
   */
  getHealthCheckStatus(callback?: (err: AWSError, data: Route53.Types.GetHealthCheckStatusResponse) => void): Request<Route53.Types.GetHealthCheckStatusResponse, AWSError>;
  /**
   * Gets information about a specified hosted zone including the four name servers assigned to the hosted zone.
   */
  getHostedZone(params: Route53.Types.GetHostedZoneRequest, callback?: (err: AWSError, data: Route53.Types.GetHostedZoneResponse) => void): Request<Route53.Types.GetHostedZoneResponse, AWSError>;
  /**
   * Gets information about a specified hosted zone including the four name servers assigned to the hosted zone.
   */
  getHostedZone(callback?: (err: AWSError, data: Route53.Types.GetHostedZoneResponse) => void): Request<Route53.Types.GetHostedZoneResponse, AWSError>;
  /**
   * Retrieves the number of hosted zones that are associated with the current Amazon Web Services account.
   */
  getHostedZoneCount(params: Route53.Types.GetHostedZoneCountRequest, callback?: (err: AWSError, data: Route53.Types.GetHostedZoneCountResponse) => void): Request<Route53.Types.GetHostedZoneCountResponse, AWSError>;
  /**
   * Retrieves the number of hosted zones that are associated with the current Amazon Web Services account.
   */
  getHostedZoneCount(callback?: (err: AWSError, data: Route53.Types.GetHostedZoneCountResponse) => void): Request<Route53.Types.GetHostedZoneCountResponse, AWSError>;
  /**
   * Gets the specified limit for a specified hosted zone, for example, the maximum number of records that you can create in the hosted zone.  For the default limit, see Limits in the Amazon Route 53 Developer Guide. To request a higher limit, open a case.
   */
  getHostedZoneLimit(params: Route53.Types.GetHostedZoneLimitRequest, callback?: (err: AWSError, data: Route53.Types.GetHostedZoneLimitResponse) => void): Request<Route53.Types.GetHostedZoneLimitResponse, AWSError>;
  /**
   * Gets the specified limit for a specified hosted zone, for example, the maximum number of records that you can create in the hosted zone.  For the default limit, see Limits in the Amazon Route 53 Developer Guide. To request a higher limit, open a case.
   */
  getHostedZoneLimit(callback?: (err: AWSError, data: Route53.Types.GetHostedZoneLimitResponse) => void): Request<Route53.Types.GetHostedZoneLimitResponse, AWSError>;
  /**
   * Gets information about a specified configuration for DNS query logging. For more information about DNS query logs, see CreateQueryLoggingConfig and Logging DNS Queries.
   */
  getQueryLoggingConfig(params: Route53.Types.GetQueryLoggingConfigRequest, callback?: (err: AWSError, data: Route53.Types.GetQueryLoggingConfigResponse) => void): Request<Route53.Types.GetQueryLoggingConfigResponse, AWSError>;
  /**
   * Gets information about a specified configuration for DNS query logging. For more information about DNS query logs, see CreateQueryLoggingConfig and Logging DNS Queries.
   */
  getQueryLoggingConfig(callback?: (err: AWSError, data: Route53.Types.GetQueryLoggingConfigResponse) => void): Request<Route53.Types.GetQueryLoggingConfigResponse, AWSError>;
  /**
   * Retrieves information about a specified reusable delegation set, including the four name servers that are assigned to the delegation set.
   */
  getReusableDelegationSet(params: Route53.Types.GetReusableDelegationSetRequest, callback?: (err: AWSError, data: Route53.Types.GetReusableDelegationSetResponse) => void): Request<Route53.Types.GetReusableDelegationSetResponse, AWSError>;
  /**
   * Retrieves information about a specified reusable delegation set, including the four name servers that are assigned to the delegation set.
   */
  getReusableDelegationSet(callback?: (err: AWSError, data: Route53.Types.GetReusableDelegationSetResponse) => void): Request<Route53.Types.GetReusableDelegationSetResponse, AWSError>;
  /**
   * Gets the maximum number of hosted zones that you can associate with the specified reusable delegation set. For the default limit, see Limits in the Amazon Route 53 Developer Guide. To request a higher limit, open a case.
   */
  getReusableDelegationSetLimit(params: Route53.Types.GetReusableDelegationSetLimitRequest, callback?: (err: AWSError, data: Route53.Types.GetReusableDelegationSetLimitResponse) => void): Request<Route53.Types.GetReusableDelegationSetLimitResponse, AWSError>;
  /**
   * Gets the maximum number of hosted zones that you can associate with the specified reusable delegation set. For the default limit, see Limits in the Amazon Route 53 Developer Guide. To request a higher limit, open a case.
   */
  getReusableDelegationSetLimit(callback?: (err: AWSError, data: Route53.Types.GetReusableDelegationSetLimitResponse) => void): Request<Route53.Types.GetReusableDelegationSetLimitResponse, AWSError>;
  /**
   * Gets information about a specific traffic policy version. For information about how of deleting a traffic policy affects the response from GetTrafficPolicy, see DeleteTrafficPolicy. 
   */
  getTrafficPolicy(params: Route53.Types.GetTrafficPolicyRequest, callback?: (err: AWSError, data: Route53.Types.GetTrafficPolicyResponse) => void): Request<Route53.Types.GetTrafficPolicyResponse, AWSError>;
  /**
   * Gets information about a specific traffic policy version. For information about how of deleting a traffic policy affects the response from GetTrafficPolicy, see DeleteTrafficPolicy. 
   */
  getTrafficPolicy(callback?: (err: AWSError, data: Route53.Types.GetTrafficPolicyResponse) => void): Request<Route53.Types.GetTrafficPolicyResponse, AWSError>;
  /**
   * Gets information about a specified traffic policy instance.   Use GetTrafficPolicyInstance with the id of new traffic policy instance to confirm that the CreateTrafficPolicyInstance or an UpdateTrafficPolicyInstance request completed successfully. For more information, see the State response element.   In the Route 53 console, traffic policy instances are known as policy records. 
   */
  getTrafficPolicyInstance(params: Route53.Types.GetTrafficPolicyInstanceRequest, callback?: (err: AWSError, data: Route53.Types.GetTrafficPolicyInstanceResponse) => void): Request<Route53.Types.GetTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Gets information about a specified traffic policy instance.   Use GetTrafficPolicyInstance with the id of new traffic policy instance to confirm that the CreateTrafficPolicyInstance or an UpdateTrafficPolicyInstance request completed successfully. For more information, see the State response element.   In the Route 53 console, traffic policy instances are known as policy records. 
   */
  getTrafficPolicyInstance(callback?: (err: AWSError, data: Route53.Types.GetTrafficPolicyInstanceResponse) => void): Request<Route53.Types.GetTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Gets the number of traffic policy instances that are associated with the current Amazon Web Services account.
   */
  getTrafficPolicyInstanceCount(params: Route53.Types.GetTrafficPolicyInstanceCountRequest, callback?: (err: AWSError, data: Route53.Types.GetTrafficPolicyInstanceCountResponse) => void): Request<Route53.Types.GetTrafficPolicyInstanceCountResponse, AWSError>;
  /**
   * Gets the number of traffic policy instances that are associated with the current Amazon Web Services account.
   */
  getTrafficPolicyInstanceCount(callback?: (err: AWSError, data: Route53.Types.GetTrafficPolicyInstanceCountResponse) => void): Request<Route53.Types.GetTrafficPolicyInstanceCountResponse, AWSError>;
  /**
   * Returns a paginated list of location objects and their CIDR blocks.
   */
  listCidrBlocks(params: Route53.Types.ListCidrBlocksRequest, callback?: (err: AWSError, data: Route53.Types.ListCidrBlocksResponse) => void): Request<Route53.Types.ListCidrBlocksResponse, AWSError>;
  /**
   * Returns a paginated list of location objects and their CIDR blocks.
   */
  listCidrBlocks(callback?: (err: AWSError, data: Route53.Types.ListCidrBlocksResponse) => void): Request<Route53.Types.ListCidrBlocksResponse, AWSError>;
  /**
   * Returns a paginated list of CIDR collections in the Amazon Web Services account (metadata only).
   */
  listCidrCollections(params: Route53.Types.ListCidrCollectionsRequest, callback?: (err: AWSError, data: Route53.Types.ListCidrCollectionsResponse) => void): Request<Route53.Types.ListCidrCollectionsResponse, AWSError>;
  /**
   * Returns a paginated list of CIDR collections in the Amazon Web Services account (metadata only).
   */
  listCidrCollections(callback?: (err: AWSError, data: Route53.Types.ListCidrCollectionsResponse) => void): Request<Route53.Types.ListCidrCollectionsResponse, AWSError>;
  /**
   * Returns a paginated list of CIDR locations for the given collection (metadata only, does not include CIDR blocks).
   */
  listCidrLocations(params: Route53.Types.ListCidrLocationsRequest, callback?: (err: AWSError, data: Route53.Types.ListCidrLocationsResponse) => void): Request<Route53.Types.ListCidrLocationsResponse, AWSError>;
  /**
   * Returns a paginated list of CIDR locations for the given collection (metadata only, does not include CIDR blocks).
   */
  listCidrLocations(callback?: (err: AWSError, data: Route53.Types.ListCidrLocationsResponse) => void): Request<Route53.Types.ListCidrLocationsResponse, AWSError>;
  /**
   * Retrieves a list of supported geographic locations. Countries are listed first, and continents are listed last. If Amazon Route 53 supports subdivisions for a country (for example, states or provinces), the subdivisions for that country are listed in alphabetical order immediately after the corresponding country. Route 53 does not perform authorization for this API because it retrieves information that is already available to the public. For a list of supported geolocation codes, see the GeoLocation data type.
   */
  listGeoLocations(params: Route53.Types.ListGeoLocationsRequest, callback?: (err: AWSError, data: Route53.Types.ListGeoLocationsResponse) => void): Request<Route53.Types.ListGeoLocationsResponse, AWSError>;
  /**
   * Retrieves a list of supported geographic locations. Countries are listed first, and continents are listed last. If Amazon Route 53 supports subdivisions for a country (for example, states or provinces), the subdivisions for that country are listed in alphabetical order immediately after the corresponding country. Route 53 does not perform authorization for this API because it retrieves information that is already available to the public. For a list of supported geolocation codes, see the GeoLocation data type.
   */
  listGeoLocations(callback?: (err: AWSError, data: Route53.Types.ListGeoLocationsResponse) => void): Request<Route53.Types.ListGeoLocationsResponse, AWSError>;
  /**
   * Retrieve a list of the health checks that are associated with the current Amazon Web Services account. 
   */
  listHealthChecks(params: Route53.Types.ListHealthChecksRequest, callback?: (err: AWSError, data: Route53.Types.ListHealthChecksResponse) => void): Request<Route53.Types.ListHealthChecksResponse, AWSError>;
  /**
   * Retrieve a list of the health checks that are associated with the current Amazon Web Services account. 
   */
  listHealthChecks(callback?: (err: AWSError, data: Route53.Types.ListHealthChecksResponse) => void): Request<Route53.Types.ListHealthChecksResponse, AWSError>;
  /**
   * Retrieves a list of the public and private hosted zones that are associated with the current Amazon Web Services account. The response includes a HostedZones child element for each hosted zone. Amazon Route 53 returns a maximum of 100 items in each response. If you have a lot of hosted zones, you can use the maxitems parameter to list them in groups of up to 100.
   */
  listHostedZones(params: Route53.Types.ListHostedZonesRequest, callback?: (err: AWSError, data: Route53.Types.ListHostedZonesResponse) => void): Request<Route53.Types.ListHostedZonesResponse, AWSError>;
  /**
   * Retrieves a list of the public and private hosted zones that are associated with the current Amazon Web Services account. The response includes a HostedZones child element for each hosted zone. Amazon Route 53 returns a maximum of 100 items in each response. If you have a lot of hosted zones, you can use the maxitems parameter to list them in groups of up to 100.
   */
  listHostedZones(callback?: (err: AWSError, data: Route53.Types.ListHostedZonesResponse) => void): Request<Route53.Types.ListHostedZonesResponse, AWSError>;
  /**
   * Retrieves a list of your hosted zones in lexicographic order. The response includes a HostedZones child element for each hosted zone created by the current Amazon Web Services account.   ListHostedZonesByName sorts hosted zones by name with the labels reversed. For example:  com.example.www.  Note the trailing dot, which can change the sort order in some circumstances. If the domain name includes escape characters or Punycode, ListHostedZonesByName alphabetizes the domain name using the escaped or Punycoded value, which is the format that Amazon Route 53 saves in its database. For example, to create a hosted zone for exämple.com, you specify ex\344mple.com for the domain name. ListHostedZonesByName alphabetizes it as:  com.ex\344mple.  The labels are reversed and alphabetized using the escaped value. For more information about valid domain name formats, including internationalized domain names, see DNS Domain Name Format in the Amazon Route 53 Developer Guide. Route 53 returns up to 100 items in each response. If you have a lot of hosted zones, use the MaxItems parameter to list them in groups of up to 100. The response includes values that help navigate from one group of MaxItems hosted zones to the next:   The DNSName and HostedZoneId elements in the response contain the values, if any, specified for the dnsname and hostedzoneid parameters in the request that produced the current response.   The MaxItems element in the response contains the value, if any, that you specified for the maxitems parameter in the request that produced the current response.   If the value of IsTruncated in the response is true, there are more hosted zones associated with the current Amazon Web Services account.  If IsTruncated is false, this response includes the last hosted zone that is associated with the current account. The NextDNSName element and NextHostedZoneId elements are omitted from the response.   The NextDNSName and NextHostedZoneId elements in the response contain the domain name and the hosted zone ID of the next hosted zone that is associated with the current Amazon Web Services account. If you want to list more hosted zones, make another call to ListHostedZonesByName, and specify the value of NextDNSName and NextHostedZoneId in the dnsname and hostedzoneid parameters, respectively.  
   */
  listHostedZonesByName(params: Route53.Types.ListHostedZonesByNameRequest, callback?: (err: AWSError, data: Route53.Types.ListHostedZonesByNameResponse) => void): Request<Route53.Types.ListHostedZonesByNameResponse, AWSError>;
  /**
   * Retrieves a list of your hosted zones in lexicographic order. The response includes a HostedZones child element for each hosted zone created by the current Amazon Web Services account.   ListHostedZonesByName sorts hosted zones by name with the labels reversed. For example:  com.example.www.  Note the trailing dot, which can change the sort order in some circumstances. If the domain name includes escape characters or Punycode, ListHostedZonesByName alphabetizes the domain name using the escaped or Punycoded value, which is the format that Amazon Route 53 saves in its database. For example, to create a hosted zone for exämple.com, you specify ex\344mple.com for the domain name. ListHostedZonesByName alphabetizes it as:  com.ex\344mple.  The labels are reversed and alphabetized using the escaped value. For more information about valid domain name formats, including internationalized domain names, see DNS Domain Name Format in the Amazon Route 53 Developer Guide. Route 53 returns up to 100 items in each response. If you have a lot of hosted zones, use the MaxItems parameter to list them in groups of up to 100. The response includes values that help navigate from one group of MaxItems hosted zones to the next:   The DNSName and HostedZoneId elements in the response contain the values, if any, specified for the dnsname and hostedzoneid parameters in the request that produced the current response.   The MaxItems element in the response contains the value, if any, that you specified for the maxitems parameter in the request that produced the current response.   If the value of IsTruncated in the response is true, there are more hosted zones associated with the current Amazon Web Services account.  If IsTruncated is false, this response includes the last hosted zone that is associated with the current account. The NextDNSName element and NextHostedZoneId elements are omitted from the response.   The NextDNSName and NextHostedZoneId elements in the response contain the domain name and the hosted zone ID of the next hosted zone that is associated with the current Amazon Web Services account. If you want to list more hosted zones, make another call to ListHostedZonesByName, and specify the value of NextDNSName and NextHostedZoneId in the dnsname and hostedzoneid parameters, respectively.  
   */
  listHostedZonesByName(callback?: (err: AWSError, data: Route53.Types.ListHostedZonesByNameResponse) => void): Request<Route53.Types.ListHostedZonesByNameResponse, AWSError>;
  /**
   * Lists all the private hosted zones that a specified VPC is associated with, regardless of which Amazon Web Services account or Amazon Web Services service owns the hosted zones. The HostedZoneOwner structure in the response contains one of the following values:   An OwningAccount element, which contains the account number of either the current Amazon Web Services account or another Amazon Web Services account. Some services, such as Cloud Map, create hosted zones using the current account.    An OwningService element, which identifies the Amazon Web Services service that created and owns the hosted zone. For example, if a hosted zone was created by Amazon Elastic File System (Amazon EFS), the value of Owner is efs.amazonaws.com.     When listing private hosted zones, the hosted zone and the Amazon VPC must belong to the same partition where the hosted zones were created. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  listHostedZonesByVPC(params: Route53.Types.ListHostedZonesByVPCRequest, callback?: (err: AWSError, data: Route53.Types.ListHostedZonesByVPCResponse) => void): Request<Route53.Types.ListHostedZonesByVPCResponse, AWSError>;
  /**
   * Lists all the private hosted zones that a specified VPC is associated with, regardless of which Amazon Web Services account or Amazon Web Services service owns the hosted zones. The HostedZoneOwner structure in the response contains one of the following values:   An OwningAccount element, which contains the account number of either the current Amazon Web Services account or another Amazon Web Services account. Some services, such as Cloud Map, create hosted zones using the current account.    An OwningService element, which identifies the Amazon Web Services service that created and owns the hosted zone. For example, if a hosted zone was created by Amazon Elastic File System (Amazon EFS), the value of Owner is efs.amazonaws.com.     When listing private hosted zones, the hosted zone and the Amazon VPC must belong to the same partition where the hosted zones were created. A partition is a group of Amazon Web Services Regions. Each Amazon Web Services account is scoped to one partition. The following are the supported partitions:    aws - Amazon Web Services Regions    aws-cn - China Regions    aws-us-gov - Amazon Web Services GovCloud (US) Region   For more information, see Access Management in the Amazon Web Services General Reference. 
   */
  listHostedZonesByVPC(callback?: (err: AWSError, data: Route53.Types.ListHostedZonesByVPCResponse) => void): Request<Route53.Types.ListHostedZonesByVPCResponse, AWSError>;
  /**
   * Lists the configurations for DNS query logging that are associated with the current Amazon Web Services account or the configuration that is associated with a specified hosted zone. For more information about DNS query logs, see CreateQueryLoggingConfig. Additional information, including the format of DNS query logs, appears in Logging DNS Queries in the Amazon Route 53 Developer Guide.
   */
  listQueryLoggingConfigs(params: Route53.Types.ListQueryLoggingConfigsRequest, callback?: (err: AWSError, data: Route53.Types.ListQueryLoggingConfigsResponse) => void): Request<Route53.Types.ListQueryLoggingConfigsResponse, AWSError>;
  /**
   * Lists the configurations for DNS query logging that are associated with the current Amazon Web Services account or the configuration that is associated with a specified hosted zone. For more information about DNS query logs, see CreateQueryLoggingConfig. Additional information, including the format of DNS query logs, appears in Logging DNS Queries in the Amazon Route 53 Developer Guide.
   */
  listQueryLoggingConfigs(callback?: (err: AWSError, data: Route53.Types.ListQueryLoggingConfigsResponse) => void): Request<Route53.Types.ListQueryLoggingConfigsResponse, AWSError>;
  /**
   * Lists the resource record sets in a specified hosted zone.  ListResourceRecordSets returns up to 300 resource record sets at a time in ASCII order, beginning at a position specified by the name and type elements.  Sort order   ListResourceRecordSets sorts results first by DNS name with the labels reversed, for example:  com.example.www.  Note the trailing dot, which can change the sort order when the record name contains characters that appear before . (decimal 46) in the ASCII table. These characters include the following: ! " # $ % &amp; ' ( ) * + , -  When multiple records have the same DNS name, ListResourceRecordSets sorts results by the record type.  Specifying where to start listing records  You can use the name and type elements to specify the resource record set that the list begins with:  If you do not specify Name or Type  The results begin with the first resource record set that the hosted zone contains.  If you specify Name but not Type  The results begin with the first resource record set in the list whose name is greater than or equal to Name.  If you specify Type but not Name  Amazon Route 53 returns the InvalidInput error.  If you specify both Name and Type  The results begin with the first resource record set in the list whose name is greater than or equal to Name, and whose type is greater than or equal to Type.    Resource record sets that are PENDING  This action returns the most current version of the records. This includes records that are PENDING, and that are not yet available on all Route 53 DNS servers.  Changing resource record sets  To ensure that you get an accurate listing of the resource record sets for a hosted zone at a point in time, do not submit a ChangeResourceRecordSets request while you're paging through the results of a ListResourceRecordSets request. If you do, some pages may display results without the latest changes while other pages display results with the latest changes.  Displaying the next page of results  If a ListResourceRecordSets command returns more than one page of results, the value of IsTruncated is true. To display the next page of results, get the values of NextRecordName, NextRecordType, and NextRecordIdentifier (if any) from the response. Then submit another ListResourceRecordSets request, and specify those values for StartRecordName, StartRecordType, and StartRecordIdentifier.
   */
  listResourceRecordSets(params: Route53.Types.ListResourceRecordSetsRequest, callback?: (err: AWSError, data: Route53.Types.ListResourceRecordSetsResponse) => void): Request<Route53.Types.ListResourceRecordSetsResponse, AWSError>;
  /**
   * Lists the resource record sets in a specified hosted zone.  ListResourceRecordSets returns up to 300 resource record sets at a time in ASCII order, beginning at a position specified by the name and type elements.  Sort order   ListResourceRecordSets sorts results first by DNS name with the labels reversed, for example:  com.example.www.  Note the trailing dot, which can change the sort order when the record name contains characters that appear before . (decimal 46) in the ASCII table. These characters include the following: ! " # $ % &amp; ' ( ) * + , -  When multiple records have the same DNS name, ListResourceRecordSets sorts results by the record type.  Specifying where to start listing records  You can use the name and type elements to specify the resource record set that the list begins with:  If you do not specify Name or Type  The results begin with the first resource record set that the hosted zone contains.  If you specify Name but not Type  The results begin with the first resource record set in the list whose name is greater than or equal to Name.  If you specify Type but not Name  Amazon Route 53 returns the InvalidInput error.  If you specify both Name and Type  The results begin with the first resource record set in the list whose name is greater than or equal to Name, and whose type is greater than or equal to Type.    Resource record sets that are PENDING  This action returns the most current version of the records. This includes records that are PENDING, and that are not yet available on all Route 53 DNS servers.  Changing resource record sets  To ensure that you get an accurate listing of the resource record sets for a hosted zone at a point in time, do not submit a ChangeResourceRecordSets request while you're paging through the results of a ListResourceRecordSets request. If you do, some pages may display results without the latest changes while other pages display results with the latest changes.  Displaying the next page of results  If a ListResourceRecordSets command returns more than one page of results, the value of IsTruncated is true. To display the next page of results, get the values of NextRecordName, NextRecordType, and NextRecordIdentifier (if any) from the response. Then submit another ListResourceRecordSets request, and specify those values for StartRecordName, StartRecordType, and StartRecordIdentifier.
   */
  listResourceRecordSets(callback?: (err: AWSError, data: Route53.Types.ListResourceRecordSetsResponse) => void): Request<Route53.Types.ListResourceRecordSetsResponse, AWSError>;
  /**
   * Retrieves a list of the reusable delegation sets that are associated with the current Amazon Web Services account.
   */
  listReusableDelegationSets(params: Route53.Types.ListReusableDelegationSetsRequest, callback?: (err: AWSError, data: Route53.Types.ListReusableDelegationSetsResponse) => void): Request<Route53.Types.ListReusableDelegationSetsResponse, AWSError>;
  /**
   * Retrieves a list of the reusable delegation sets that are associated with the current Amazon Web Services account.
   */
  listReusableDelegationSets(callback?: (err: AWSError, data: Route53.Types.ListReusableDelegationSetsResponse) => void): Request<Route53.Types.ListReusableDelegationSetsResponse, AWSError>;
  /**
   * Lists tags for one health check or hosted zone.  For information about using tags for cost allocation, see Using Cost Allocation Tags in the Billing and Cost Management User Guide.
   */
  listTagsForResource(params: Route53.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Route53.Types.ListTagsForResourceResponse) => void): Request<Route53.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for one health check or hosted zone.  For information about using tags for cost allocation, see Using Cost Allocation Tags in the Billing and Cost Management User Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: Route53.Types.ListTagsForResourceResponse) => void): Request<Route53.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for up to 10 health checks or hosted zones. For information about using tags for cost allocation, see Using Cost Allocation Tags in the Billing and Cost Management User Guide.
   */
  listTagsForResources(params: Route53.Types.ListTagsForResourcesRequest, callback?: (err: AWSError, data: Route53.Types.ListTagsForResourcesResponse) => void): Request<Route53.Types.ListTagsForResourcesResponse, AWSError>;
  /**
   * Lists tags for up to 10 health checks or hosted zones. For information about using tags for cost allocation, see Using Cost Allocation Tags in the Billing and Cost Management User Guide.
   */
  listTagsForResources(callback?: (err: AWSError, data: Route53.Types.ListTagsForResourcesResponse) => void): Request<Route53.Types.ListTagsForResourcesResponse, AWSError>;
  /**
   * Gets information about the latest version for every traffic policy that is associated with the current Amazon Web Services account. Policies are listed in the order that they were created in.  For information about how of deleting a traffic policy affects the response from ListTrafficPolicies, see DeleteTrafficPolicy. 
   */
  listTrafficPolicies(params: Route53.Types.ListTrafficPoliciesRequest, callback?: (err: AWSError, data: Route53.Types.ListTrafficPoliciesResponse) => void): Request<Route53.Types.ListTrafficPoliciesResponse, AWSError>;
  /**
   * Gets information about the latest version for every traffic policy that is associated with the current Amazon Web Services account. Policies are listed in the order that they were created in.  For information about how of deleting a traffic policy affects the response from ListTrafficPolicies, see DeleteTrafficPolicy. 
   */
  listTrafficPolicies(callback?: (err: AWSError, data: Route53.Types.ListTrafficPoliciesResponse) => void): Request<Route53.Types.ListTrafficPoliciesResponse, AWSError>;
  /**
   * Gets information about the traffic policy instances that you created by using the current Amazon Web Services account.  After you submit an UpdateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. For more information, see the State response element.  Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic policy instances, you can use the MaxItems parameter to list them in groups of up to 100.
   */
  listTrafficPolicyInstances(params: Route53.Types.ListTrafficPolicyInstancesRequest, callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyInstancesResponse) => void): Request<Route53.Types.ListTrafficPolicyInstancesResponse, AWSError>;
  /**
   * Gets information about the traffic policy instances that you created by using the current Amazon Web Services account.  After you submit an UpdateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. For more information, see the State response element.  Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic policy instances, you can use the MaxItems parameter to list them in groups of up to 100.
   */
  listTrafficPolicyInstances(callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyInstancesResponse) => void): Request<Route53.Types.ListTrafficPolicyInstancesResponse, AWSError>;
  /**
   * Gets information about the traffic policy instances that you created in a specified hosted zone.  After you submit a CreateTrafficPolicyInstance or an UpdateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. For more information, see the State response element.  Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic policy instances, you can use the MaxItems parameter to list them in groups of up to 100.
   */
  listTrafficPolicyInstancesByHostedZone(params: Route53.Types.ListTrafficPolicyInstancesByHostedZoneRequest, callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyInstancesByHostedZoneResponse) => void): Request<Route53.Types.ListTrafficPolicyInstancesByHostedZoneResponse, AWSError>;
  /**
   * Gets information about the traffic policy instances that you created in a specified hosted zone.  After you submit a CreateTrafficPolicyInstance or an UpdateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. For more information, see the State response element.  Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic policy instances, you can use the MaxItems parameter to list them in groups of up to 100.
   */
  listTrafficPolicyInstancesByHostedZone(callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyInstancesByHostedZoneResponse) => void): Request<Route53.Types.ListTrafficPolicyInstancesByHostedZoneResponse, AWSError>;
  /**
   * Gets information about the traffic policy instances that you created by using a specify traffic policy version.  After you submit a CreateTrafficPolicyInstance or an UpdateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. For more information, see the State response element.  Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic policy instances, you can use the MaxItems parameter to list them in groups of up to 100.
   */
  listTrafficPolicyInstancesByPolicy(params: Route53.Types.ListTrafficPolicyInstancesByPolicyRequest, callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyInstancesByPolicyResponse) => void): Request<Route53.Types.ListTrafficPolicyInstancesByPolicyResponse, AWSError>;
  /**
   * Gets information about the traffic policy instances that you created by using a specify traffic policy version.  After you submit a CreateTrafficPolicyInstance or an UpdateTrafficPolicyInstance request, there's a brief delay while Amazon Route 53 creates the resource record sets that are specified in the traffic policy definition. For more information, see the State response element.  Route 53 returns a maximum of 100 items in each response. If you have a lot of traffic policy instances, you can use the MaxItems parameter to list them in groups of up to 100.
   */
  listTrafficPolicyInstancesByPolicy(callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyInstancesByPolicyResponse) => void): Request<Route53.Types.ListTrafficPolicyInstancesByPolicyResponse, AWSError>;
  /**
   * Gets information about all of the versions for a specified traffic policy. Traffic policy versions are listed in numerical order by VersionNumber.
   */
  listTrafficPolicyVersions(params: Route53.Types.ListTrafficPolicyVersionsRequest, callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyVersionsResponse) => void): Request<Route53.Types.ListTrafficPolicyVersionsResponse, AWSError>;
  /**
   * Gets information about all of the versions for a specified traffic policy. Traffic policy versions are listed in numerical order by VersionNumber.
   */
  listTrafficPolicyVersions(callback?: (err: AWSError, data: Route53.Types.ListTrafficPolicyVersionsResponse) => void): Request<Route53.Types.ListTrafficPolicyVersionsResponse, AWSError>;
  /**
   * Gets a list of the VPCs that were created by other accounts and that can be associated with a specified hosted zone because you've submitted one or more CreateVPCAssociationAuthorization requests.  The response includes a VPCs element with a VPC child element for each VPC that can be associated with the hosted zone.
   */
  listVPCAssociationAuthorizations(params: Route53.Types.ListVPCAssociationAuthorizationsRequest, callback?: (err: AWSError, data: Route53.Types.ListVPCAssociationAuthorizationsResponse) => void): Request<Route53.Types.ListVPCAssociationAuthorizationsResponse, AWSError>;
  /**
   * Gets a list of the VPCs that were created by other accounts and that can be associated with a specified hosted zone because you've submitted one or more CreateVPCAssociationAuthorization requests.  The response includes a VPCs element with a VPC child element for each VPC that can be associated with the hosted zone.
   */
  listVPCAssociationAuthorizations(callback?: (err: AWSError, data: Route53.Types.ListVPCAssociationAuthorizationsResponse) => void): Request<Route53.Types.ListVPCAssociationAuthorizationsResponse, AWSError>;
  /**
   * Gets the value that Amazon Route 53 returns in response to a DNS request for a specified record name and type. You can optionally specify the IP address of a DNS resolver, an EDNS0 client subnet IP address, and a subnet mask.  This call only supports querying public hosted zones.  The TestDnsAnswer  returns information similar to what you would expect from the answer section of the dig command. Therefore, if you query for the name servers of a subdomain that point to the parent name servers, those will not be returned. 
   */
  testDNSAnswer(params: Route53.Types.TestDNSAnswerRequest, callback?: (err: AWSError, data: Route53.Types.TestDNSAnswerResponse) => void): Request<Route53.Types.TestDNSAnswerResponse, AWSError>;
  /**
   * Gets the value that Amazon Route 53 returns in response to a DNS request for a specified record name and type. You can optionally specify the IP address of a DNS resolver, an EDNS0 client subnet IP address, and a subnet mask.  This call only supports querying public hosted zones.  The TestDnsAnswer  returns information similar to what you would expect from the answer section of the dig command. Therefore, if you query for the name servers of a subdomain that point to the parent name servers, those will not be returned. 
   */
  testDNSAnswer(callback?: (err: AWSError, data: Route53.Types.TestDNSAnswerResponse) => void): Request<Route53.Types.TestDNSAnswerResponse, AWSError>;
  /**
   * Updates an existing health check. Note that some values can't be updated.  For more information about updating health checks, see Creating, Updating, and Deleting Health Checks in the Amazon Route 53 Developer Guide.
   */
  updateHealthCheck(params: Route53.Types.UpdateHealthCheckRequest, callback?: (err: AWSError, data: Route53.Types.UpdateHealthCheckResponse) => void): Request<Route53.Types.UpdateHealthCheckResponse, AWSError>;
  /**
   * Updates an existing health check. Note that some values can't be updated.  For more information about updating health checks, see Creating, Updating, and Deleting Health Checks in the Amazon Route 53 Developer Guide.
   */
  updateHealthCheck(callback?: (err: AWSError, data: Route53.Types.UpdateHealthCheckResponse) => void): Request<Route53.Types.UpdateHealthCheckResponse, AWSError>;
  /**
   * Updates the comment for a specified hosted zone.
   */
  updateHostedZoneComment(params: Route53.Types.UpdateHostedZoneCommentRequest, callback?: (err: AWSError, data: Route53.Types.UpdateHostedZoneCommentResponse) => void): Request<Route53.Types.UpdateHostedZoneCommentResponse, AWSError>;
  /**
   * Updates the comment for a specified hosted zone.
   */
  updateHostedZoneComment(callback?: (err: AWSError, data: Route53.Types.UpdateHostedZoneCommentResponse) => void): Request<Route53.Types.UpdateHostedZoneCommentResponse, AWSError>;
  /**
   * Updates the comment for a specified traffic policy version.
   */
  updateTrafficPolicyComment(params: Route53.Types.UpdateTrafficPolicyCommentRequest, callback?: (err: AWSError, data: Route53.Types.UpdateTrafficPolicyCommentResponse) => void): Request<Route53.Types.UpdateTrafficPolicyCommentResponse, AWSError>;
  /**
   * Updates the comment for a specified traffic policy version.
   */
  updateTrafficPolicyComment(callback?: (err: AWSError, data: Route53.Types.UpdateTrafficPolicyCommentResponse) => void): Request<Route53.Types.UpdateTrafficPolicyCommentResponse, AWSError>;
  /**
   *  After you submit a UpdateTrafficPolicyInstance request, there's a brief delay while Route 53 creates the resource record sets that are specified in the traffic policy definition. Use GetTrafficPolicyInstance with the id of updated traffic policy instance confirm that the UpdateTrafficPolicyInstance request completed successfully. For more information, see the State response element.  Updates the resource record sets in a specified hosted zone that were created based on the settings in a specified traffic policy version. When you update a traffic policy instance, Amazon Route 53 continues to respond to DNS queries for the root resource record set name (such as example.com) while it replaces one group of resource record sets with another. Route 53 performs the following operations:   Route 53 creates a new group of resource record sets based on the specified traffic policy. This is true regardless of how significant the differences are between the existing resource record sets and the new resource record sets.    When all of the new resource record sets have been created, Route 53 starts to respond to DNS queries for the root resource record set name (such as example.com) by using the new resource record sets.   Route 53 deletes the old group of resource record sets that are associated with the root resource record set name.  
   */
  updateTrafficPolicyInstance(params: Route53.Types.UpdateTrafficPolicyInstanceRequest, callback?: (err: AWSError, data: Route53.Types.UpdateTrafficPolicyInstanceResponse) => void): Request<Route53.Types.UpdateTrafficPolicyInstanceResponse, AWSError>;
  /**
   *  After you submit a UpdateTrafficPolicyInstance request, there's a brief delay while Route 53 creates the resource record sets that are specified in the traffic policy definition. Use GetTrafficPolicyInstance with the id of updated traffic policy instance confirm that the UpdateTrafficPolicyInstance request completed successfully. For more information, see the State response element.  Updates the resource record sets in a specified hosted zone that were created based on the settings in a specified traffic policy version. When you update a traffic policy instance, Amazon Route 53 continues to respond to DNS queries for the root resource record set name (such as example.com) while it replaces one group of resource record sets with another. Route 53 performs the following operations:   Route 53 creates a new group of resource record sets based on the specified traffic policy. This is true regardless of how significant the differences are between the existing resource record sets and the new resource record sets.    When all of the new resource record sets have been created, Route 53 starts to respond to DNS queries for the root resource record set name (such as example.com) by using the new resource record sets.   Route 53 deletes the old group of resource record sets that are associated with the root resource record set name.  
   */
  updateTrafficPolicyInstance(callback?: (err: AWSError, data: Route53.Types.UpdateTrafficPolicyInstanceResponse) => void): Request<Route53.Types.UpdateTrafficPolicyInstanceResponse, AWSError>;
  /**
   * Waits for the resourceRecordSetsChanged state by periodically calling the underlying Route53.getChangeoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "resourceRecordSetsChanged", params: Route53.Types.GetChangeRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53.Types.GetChangeResponse) => void): Request<Route53.Types.GetChangeResponse, AWSError>;
  /**
   * Waits for the resourceRecordSetsChanged state by periodically calling the underlying Route53.getChangeoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "resourceRecordSetsChanged", callback?: (err: AWSError, data: Route53.Types.GetChangeResponse) => void): Request<Route53.Types.GetChangeResponse, AWSError>;
}
declare namespace Route53 {
  export type ARN = string;
  export type AWSAccountID = string;
  export interface AccountLimit {
    /**
     * The limit that you requested. Valid values include the following:    MAX_HEALTH_CHECKS_BY_OWNER: The maximum number of health checks that you can create using the current account.    MAX_HOSTED_ZONES_BY_OWNER: The maximum number of hosted zones that you can create using the current account.    MAX_REUSABLE_DELEGATION_SETS_BY_OWNER: The maximum number of reusable delegation sets that you can create using the current account.    MAX_TRAFFIC_POLICIES_BY_OWNER: The maximum number of traffic policies that you can create using the current account.    MAX_TRAFFIC_POLICY_INSTANCES_BY_OWNER: The maximum number of traffic policy instances that you can create using the current account. (Traffic policy instances are referred to as traffic flow policy records in the Amazon Route 53 console.)  
     */
    Type: AccountLimitType;
    /**
     * The current value for the limit that is specified by Type.
     */
    Value: LimitValue;
  }
  export type AccountLimitType = "MAX_HEALTH_CHECKS_BY_OWNER"|"MAX_HOSTED_ZONES_BY_OWNER"|"MAX_TRAFFIC_POLICY_INSTANCES_BY_OWNER"|"MAX_REUSABLE_DELEGATION_SETS_BY_OWNER"|"MAX_TRAFFIC_POLICIES_BY_OWNER"|string;
  export interface ActivateKeySigningKeyRequest {
    /**
     * A unique string used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
    /**
     * A string used to identify a key-signing key (KSK). Name can include numbers, letters, and underscores (_). Name must be unique for each key-signing key in the same hosted zone.
     */
    Name: SigningKeyName;
  }
  export interface ActivateKeySigningKeyResponse {
    ChangeInfo: ChangeInfo;
  }
  export interface AlarmIdentifier {
    /**
     * For the CloudWatch alarm that you want Route 53 health checkers to use to determine whether this health check is healthy, the region that the alarm was created in. For the current list of CloudWatch regions, see Amazon CloudWatch endpoints and quotas in the Amazon Web Services General Reference.
     */
    Region: CloudWatchRegion;
    /**
     * The name of the CloudWatch alarm that you want Amazon Route 53 health checkers to use to determine whether this health check is healthy.  Route 53 supports CloudWatch alarms with the following features:   Standard-resolution metrics. High-resolution metrics aren't supported. For more information, see High-Resolution Metrics in the Amazon CloudWatch User Guide.   Statistics: Average, Minimum, Maximum, Sum, and SampleCount. Extended statistics aren't supported.   
     */
    Name: AlarmName;
  }
  export type AlarmName = string;
  export type AliasHealthEnabled = boolean;
  export interface AliasTarget {
    /**
     *  Alias resource records sets only: The value used depends on where you want to route traffic:  Amazon API Gateway custom regional APIs and edge-optimized APIs  Specify the hosted zone ID for your API. You can get the applicable value using the CLI command get-domain-names:   For regional APIs, specify the value of regionalHostedZoneId.   For edge-optimized APIs, specify the value of distributionHostedZoneId.    Amazon Virtual Private Cloud interface VPC endpoint  Specify the hosted zone ID for your interface endpoint. You can get the value of HostedZoneId using the CLI command describe-vpc-endpoints.  CloudFront distribution  Specify Z2FDTNDATAQYW2.  Alias resource record sets for CloudFront can't be created in a private zone.   Elastic Beanstalk environment  Specify the hosted zone ID for the region that you created the environment in. The environment must have a regionalized subdomain. For a list of regions and the corresponding hosted zone IDs, see Elastic Beanstalk endpoints and quotas in the the Amazon Web Services General Reference.  ELB load balancer  Specify the value of the hosted zone ID for the load balancer. Use the following methods to get the hosted zone ID:    Elastic Load Balancing endpoints and quotas topic in the Amazon Web Services General Reference: Use the value that corresponds with the region that you created your load balancer in. Note that there are separate columns for Application and Classic Load Balancers and for Network Load Balancers.    Amazon Web Services Management Console: Go to the Amazon EC2 page, choose Load Balancers in the navigation pane, select the load balancer, and get the value of the Hosted zone field on the Description tab.    Elastic Load Balancing API: Use DescribeLoadBalancers to get the applicable value. For more information, see the applicable guide:   Classic Load Balancers: Use DescribeLoadBalancers to get the value of CanonicalHostedZoneNameId.   Application and Network Load Balancers: Use DescribeLoadBalancers to get the value of CanonicalHostedZoneId.      CLI: Use describe-load-balancers to get the applicable value. For more information, see the applicable guide:   Classic Load Balancers: Use describe-load-balancers to get the value of CanonicalHostedZoneNameId.   Application and Network Load Balancers: Use describe-load-balancers to get the value of CanonicalHostedZoneId.      Global Accelerator accelerator  Specify Z2BJ6XQ5FK7U4H.  An Amazon S3 bucket configured as a static website  Specify the hosted zone ID for the region that you created the bucket in. For more information about valid values, see the table Amazon S3 Website Endpoints in the Amazon Web Services General Reference.  Another Route 53 resource record set in your hosted zone  Specify the hosted zone ID of your hosted zone. (An alias resource record set can't reference a resource record set in a different hosted zone.)  
     */
    HostedZoneId: ResourceId;
    /**
     *  Alias resource record sets only: The value that you specify depends on where you want to route queries:  Amazon API Gateway custom regional APIs and edge-optimized APIs  Specify the applicable domain name for your API. You can get the applicable value using the CLI command get-domain-names:   For regional APIs, specify the value of regionalDomainName.   For edge-optimized APIs, specify the value of distributionDomainName. This is the name of the associated CloudFront distribution, such as da1b2c3d4e5.cloudfront.net.    The name of the record that you're creating must match a custom domain name for your API, such as api.example.com.   Amazon Virtual Private Cloud interface VPC endpoint  Enter the API endpoint for the interface endpoint, such as vpce-123456789abcdef01-example-us-east-1a.elasticloadbalancing.us-east-1.vpce.amazonaws.com. For edge-optimized APIs, this is the domain name for the corresponding CloudFront distribution. You can get the value of DnsName using the CLI command describe-vpc-endpoints.  CloudFront distribution  Specify the domain name that CloudFront assigned when you created your distribution. Your CloudFront distribution must include an alternate domain name that matches the name of the resource record set. For example, if the name of the resource record set is acme.example.com, your CloudFront distribution must include acme.example.com as one of the alternate domain names. For more information, see Using Alternate Domain Names (CNAMEs) in the Amazon CloudFront Developer Guide. You can't create a resource record set in a private hosted zone to route traffic to a CloudFront distribution.  For failover alias records, you can't specify a CloudFront distribution for both the primary and secondary records. A distribution must include an alternate domain name that matches the name of the record. However, the primary and secondary records have the same name, and you can't include the same alternate domain name in more than one distribution.    Elastic Beanstalk environment  If the domain name for your Elastic Beanstalk environment includes the region that you deployed the environment in, you can create an alias record that routes traffic to the environment. For example, the domain name my-environment.us-west-2.elasticbeanstalk.com is a regionalized domain name.   For environments that were created before early 2016, the domain name doesn't include the region. To route traffic to these environments, you must create a CNAME record instead of an alias record. Note that you can't create a CNAME record for the root domain name. For example, if your domain name is example.com, you can create a record that routes traffic for acme.example.com to your Elastic Beanstalk environment, but you can't create a record that routes traffic for example.com to your Elastic Beanstalk environment.  For Elastic Beanstalk environments that have regionalized subdomains, specify the CNAME attribute for the environment. You can use the following methods to get the value of the CNAME attribute:    Amazon Web Services Management Console: For information about how to get the value by using the console, see Using Custom Domains with Elastic Beanstalk in the Elastic Beanstalk Developer Guide.    Elastic Beanstalk API: Use the DescribeEnvironments action to get the value of the CNAME attribute. For more information, see DescribeEnvironments in the Elastic Beanstalk API Reference.    CLI: Use the describe-environments command to get the value of the CNAME attribute. For more information, see describe-environments in the CLI Command Reference.    ELB load balancer  Specify the DNS name that is associated with the load balancer. Get the DNS name by using the Amazon Web Services Management Console, the ELB API, or the CLI.     Amazon Web Services Management Console: Go to the EC2 page, choose Load Balancers in the navigation pane, choose the load balancer, choose the Description tab, and get the value of the DNS name field.  If you're routing traffic to a Classic Load Balancer, get the value that begins with dualstack. If you're routing traffic to another type of load balancer, get the value that applies to the record type, A or AAAA.    Elastic Load Balancing API: Use DescribeLoadBalancers to get the value of DNSName. For more information, see the applicable guide:   Classic Load Balancers: DescribeLoadBalancers    Application and Network Load Balancers: DescribeLoadBalancers       CLI: Use describe-load-balancers to get the value of DNSName. For more information, see the applicable guide:   Classic Load Balancers: describe-load-balancers    Application and Network Load Balancers: describe-load-balancers       Global Accelerator accelerator  Specify the DNS name for your accelerator:    Global Accelerator API: To get the DNS name, use DescribeAccelerator.    CLI: To get the DNS name, use describe-accelerator.    Amazon S3 bucket that is configured as a static website  Specify the domain name of the Amazon S3 website endpoint that you created the bucket in, for example, s3-website.us-east-2.amazonaws.com. For more information about valid values, see the table Amazon S3 Website Endpoints in the Amazon Web Services General Reference. For more information about using S3 buckets for websites, see Getting Started with Amazon Route 53 in the Amazon Route 53 Developer Guide.   Another Route 53 resource record set  Specify the value of the Name element for a resource record set in the current hosted zone.  If you're creating an alias record that has the same name as the hosted zone (known as the zone apex), you can't specify the domain name for a record for which the value of Type is CNAME. This is because the alias record must have the same type as the record that you're routing traffic to, and creating a CNAME record for the zone apex isn't supported even for an alias record.   
     */
    DNSName: DNSName;
    /**
     *  Applies only to alias, failover alias, geolocation alias, latency alias, and weighted alias resource record sets: When EvaluateTargetHealth is true, an alias resource record set inherits the health of the referenced Amazon Web Services resource, such as an ELB load balancer or another resource record set in the hosted zone. Note the following:  CloudFront distributions  You can't set EvaluateTargetHealth to true when the alias target is a CloudFront distribution.  Elastic Beanstalk environments that have regionalized subdomains  If you specify an Elastic Beanstalk environment in DNSName and the environment contains an ELB load balancer, Elastic Load Balancing routes queries only to the healthy Amazon EC2 instances that are registered with the load balancer. (An environment automatically contains an ELB load balancer if it includes more than one Amazon EC2 instance.) If you set EvaluateTargetHealth to true and either no Amazon EC2 instances are healthy or the load balancer itself is unhealthy, Route 53 routes queries to other available resources that are healthy, if any.  If the environment contains a single Amazon EC2 instance, there are no special requirements.  ELB load balancers  Health checking behavior depends on the type of load balancer:    Classic Load Balancers: If you specify an ELB Classic Load Balancer in DNSName, Elastic Load Balancing routes queries only to the healthy Amazon EC2 instances that are registered with the load balancer. If you set EvaluateTargetHealth to true and either no EC2 instances are healthy or the load balancer itself is unhealthy, Route 53 routes queries to other resources.    Application and Network Load Balancers: If you specify an ELB Application or Network Load Balancer and you set EvaluateTargetHealth to true, Route 53 routes queries to the load balancer based on the health of the target groups that are associated with the load balancer:   For an Application or Network Load Balancer to be considered healthy, every target group that contains targets must contain at least one healthy target. If any target group contains only unhealthy targets, the load balancer is considered unhealthy, and Route 53 routes queries to other resources.   A target group that has no registered targets is considered unhealthy.      When you create a load balancer, you configure settings for Elastic Load Balancing health checks; they're not Route 53 health checks, but they perform a similar function. Do not create Route 53 health checks for the EC2 instances that you register with an ELB load balancer.    S3 buckets  There are no special requirements for setting EvaluateTargetHealth to true when the alias target is an S3 bucket.  Other records in the same hosted zone  If the Amazon Web Services resource that you specify in DNSName is a record or a group of records (for example, a group of weighted records) but is not another alias record, we recommend that you associate a health check with all of the records in the alias target. For more information, see What Happens When You Omit Health Checks? in the Amazon Route 53 Developer Guide.   For more information and examples, see Amazon Route 53 Health Checks and DNS Failover in the Amazon Route 53 Developer Guide.
     */
    EvaluateTargetHealth: AliasHealthEnabled;
  }
  export type AssociateVPCComment = string;
  export interface AssociateVPCWithHostedZoneRequest {
    /**
     * The ID of the private hosted zone that you want to associate an Amazon VPC with. Note that you can't associate a VPC with a hosted zone that doesn't have an existing VPC association.
     */
    HostedZoneId: ResourceId;
    /**
     * A complex type that contains information about the VPC that you want to associate with a private hosted zone.
     */
    VPC: VPC;
    /**
     *  Optional: A comment about the association request.
     */
    Comment?: AssociateVPCComment;
  }
  export interface AssociateVPCWithHostedZoneResponse {
    /**
     * A complex type that describes the changes made to your hosted zone.
     */
    ChangeInfo: ChangeInfo;
  }
  export interface Change {
    /**
     * The action to perform:    CREATE: Creates a resource record set that has the specified values.    DELETE: Deletes a existing resource record set.  To delete the resource record set that is associated with a traffic policy instance, use DeleteTrafficPolicyInstance. Amazon Route 53 will delete the resource record set automatically. If you delete the resource record set by using ChangeResourceRecordSets, Route 53 doesn't automatically delete the traffic policy instance, and you'll continue to be charged for it even though it's no longer in use.      UPSERT: If a resource record set doesn't already exist, Route 53 creates it. If a resource record set does exist, Route 53 updates it with the values in the request.  
     */
    Action: ChangeAction;
    /**
     * Information about the resource record set to create, delete, or update.
     */
    ResourceRecordSet: ResourceRecordSet;
  }
  export type ChangeAction = "CREATE"|"DELETE"|"UPSERT"|string;
  export interface ChangeBatch {
    /**
     *  Optional: Any comments you want to include about a change batch request.
     */
    Comment?: ResourceDescription;
    /**
     * Information about the changes to make to the record sets.
     */
    Changes: Changes;
  }
  export interface ChangeCidrCollectionRequest {
    /**
     * The UUID of the CIDR collection to update.
     */
    Id: UUID;
    /**
     * A sequential counter that Amazon Route 53 sets to 1 when you create a collection and increments it by 1 each time you update the collection. We recommend that you use ListCidrCollection to get the current value of CollectionVersion for the collection that you want to update, and then include that value with the change request. This prevents Route 53 from overwriting an intervening update:    If the value in the request matches the value of CollectionVersion in the collection, Route 53 updates the collection.   If the value of CollectionVersion in the collection is greater than the value in the request, the collection was changed after you got the version number. Route 53 does not update the collection, and it returns a CidrCollectionVersionMismatch error.   
     */
    CollectionVersion?: CollectionVersion;
    /**
     *  Information about changes to a CIDR collection.
     */
    Changes: CidrCollectionChanges;
  }
  export interface ChangeCidrCollectionResponse {
    /**
     * The ID that is returned by ChangeCidrCollection. You can use it as input to GetChange to see if a CIDR collection change has propagated or not.
     */
    Id: ChangeId;
  }
  export type ChangeId = string;
  export interface ChangeInfo {
    /**
     * This element contains an ID that you use when performing a GetChange action to get detailed information about the change.
     */
    Id: ResourceId;
    /**
     * The current state of the request. PENDING indicates that this request has not yet been applied to all Amazon Route 53 DNS servers.
     */
    Status: ChangeStatus;
    /**
     * The date and time that the change request was submitted in ISO 8601 format and Coordinated Universal Time (UTC). For example, the value 2017-03-27T17:48:16.751Z represents March 27, 2017 at 17:48:16.751 UTC.
     */
    SubmittedAt: TimeStamp;
    /**
     * A comment you can provide.
     */
    Comment?: ResourceDescription;
  }
  export interface ChangeResourceRecordSetsRequest {
    /**
     * The ID of the hosted zone that contains the resource record sets that you want to change.
     */
    HostedZoneId: ResourceId;
    /**
     * A complex type that contains an optional comment and the Changes element.
     */
    ChangeBatch: ChangeBatch;
  }
  export interface ChangeResourceRecordSetsResponse {
    /**
     * A complex type that contains information about changes made to your hosted zone. This element contains an ID that you use when performing a GetChange action to get detailed information about the change.
     */
    ChangeInfo: ChangeInfo;
  }
  export type ChangeStatus = "PENDING"|"INSYNC"|string;
  export interface ChangeTagsForResourceRequest {
    /**
     * The type of the resource.   The resource type for health checks is healthcheck.   The resource type for hosted zones is hostedzone.  
     */
    ResourceType: TagResourceType;
    /**
     * The ID of the resource for which you want to add, change, or delete tags.
     */
    ResourceId: TagResourceId;
    /**
     * A complex type that contains a list of the tags that you want to add to the specified health check or hosted zone and/or the tags that you want to edit Value for. You can add a maximum of 10 tags to a health check or a hosted zone.
     */
    AddTags?: TagList;
    /**
     * A complex type that contains a list of the tags that you want to delete from the specified health check or hosted zone. You can specify up to 10 keys.
     */
    RemoveTagKeys?: TagKeyList;
  }
  export interface ChangeTagsForResourceResponse {
  }
  export type Changes = Change[];
  export type CheckerIpRanges = IPAddressCidr[];
  export type ChildHealthCheckList = HealthCheckId[];
  export type Cidr = string;
  export type CidrBlockSummaries = CidrBlockSummary[];
  export interface CidrBlockSummary {
    /**
     * Value for the CIDR block.
     */
    CidrBlock?: Cidr;
    /**
     * The location name of the CIDR block.
     */
    LocationName?: CidrLocationNameDefaultNotAllowed;
  }
  export interface CidrCollection {
    /**
     * The ARN of the collection. Can be used to reference the collection in IAM policy or in another Amazon Web Services account.
     */
    Arn?: ARN;
    /**
     * The unique ID of the CIDR collection.
     */
    Id?: UUID;
    /**
     * The name of a CIDR collection.
     */
    Name?: CollectionName;
    /**
     * A sequential counter that Route 53 sets to 1 when you create a CIDR collection and increments by 1 each time you update settings for the CIDR collection.
     */
    Version?: CollectionVersion;
  }
  export interface CidrCollectionChange {
    /**
     * Name of the location that is associated with the CIDR collection.
     */
    LocationName: CidrLocationNameDefaultNotAllowed;
    /**
     * CIDR collection change action. 
     */
    Action: CidrCollectionChangeAction;
    /**
     * List of CIDR blocks.
     */
    CidrList: CidrList;
  }
  export type CidrCollectionChangeAction = "PUT"|"DELETE_IF_EXISTS"|string;
  export type CidrCollectionChanges = CidrCollectionChange[];
  export type CidrList = Cidr[];
  export type CidrLocationNameDefaultAllowed = string;
  export type CidrLocationNameDefaultNotAllowed = string;
  export type CidrNonce = string;
  export interface CidrRoutingConfig {
    /**
     * The CIDR collection ID.
     */
    CollectionId: UUID;
    /**
     * The CIDR collection location name.
     */
    LocationName: CidrLocationNameDefaultAllowed;
  }
  export interface CloudWatchAlarmConfiguration {
    /**
     * For the metric that the CloudWatch alarm is associated with, the number of periods that the metric is compared to the threshold.
     */
    EvaluationPeriods: EvaluationPeriods;
    /**
     * For the metric that the CloudWatch alarm is associated with, the value the metric is compared with.
     */
    Threshold: Threshold;
    /**
     * For the metric that the CloudWatch alarm is associated with, the arithmetic operation that is used for the comparison.
     */
    ComparisonOperator: ComparisonOperator;
    /**
     * For the metric that the CloudWatch alarm is associated with, the duration of one evaluation period in seconds.
     */
    Period: Period;
    /**
     * The name of the CloudWatch metric that the alarm is associated with.
     */
    MetricName: MetricName;
    /**
     * The namespace of the metric that the alarm is associated with. For more information, see Amazon CloudWatch Namespaces, Dimensions, and Metrics Reference in the Amazon CloudWatch User Guide.
     */
    Namespace: Namespace;
    /**
     * For the metric that the CloudWatch alarm is associated with, the statistic that is applied to the metric.
     */
    Statistic: Statistic;
    /**
     * For the metric that the CloudWatch alarm is associated with, a complex type that contains information about the dimensions for the metric. For information, see Amazon CloudWatch Namespaces, Dimensions, and Metrics Reference in the Amazon CloudWatch User Guide.
     */
    Dimensions?: DimensionList;
  }
  export type CloudWatchLogsLogGroupArn = string;
  export type CloudWatchRegion = "us-east-1"|"us-east-2"|"us-west-1"|"us-west-2"|"ca-central-1"|"eu-central-1"|"eu-central-2"|"eu-west-1"|"eu-west-2"|"eu-west-3"|"ap-east-1"|"me-south-1"|"me-central-1"|"ap-south-1"|"ap-south-2"|"ap-southeast-1"|"ap-southeast-2"|"ap-southeast-3"|"ap-northeast-1"|"ap-northeast-2"|"ap-northeast-3"|"eu-north-1"|"sa-east-1"|"cn-northwest-1"|"cn-north-1"|"af-south-1"|"eu-south-1"|"eu-south-2"|"us-gov-west-1"|"us-gov-east-1"|"us-iso-east-1"|"us-iso-west-1"|"us-isob-east-1"|"ap-southeast-4"|"il-central-1"|string;
  export type CollectionName = string;
  export type CollectionSummaries = CollectionSummary[];
  export interface CollectionSummary {
    /**
     * The ARN of the collection summary. Can be used to reference the collection in IAM policy or cross-account.
     */
    Arn?: ARN;
    /**
     * Unique ID for the CIDR collection.
     */
    Id?: UUID;
    /**
     * The name of a CIDR collection.
     */
    Name?: CollectionName;
    /**
     * A sequential counter that Route 53 sets to 1 when you create a CIDR collection and increments by 1 each time you update settings for the CIDR collection.
     */
    Version?: CollectionVersion;
  }
  export type CollectionVersion = number;
  export type ComparisonOperator = "GreaterThanOrEqualToThreshold"|"GreaterThanThreshold"|"LessThanThreshold"|"LessThanOrEqualToThreshold"|string;
  export interface CreateCidrCollectionRequest {
    /**
     * A unique identifier for the account that can be used to reference the collection from other API calls.
     */
    Name: CollectionName;
    /**
     * A client-specific token that allows requests to be securely retried so that the intended outcome will only occur once, retries receive a similar response, and there are no additional edge cases to handle.
     */
    CallerReference: CidrNonce;
  }
  export interface CreateCidrCollectionResponse {
    /**
     * A complex type that contains information about the CIDR collection.
     */
    Collection?: CidrCollection;
    /**
     * A unique URL that represents the location for the CIDR collection.
     */
    Location?: ResourceURI;
  }
  export interface CreateHealthCheckRequest {
    /**
     * A unique string that identifies the request and that allows you to retry a failed CreateHealthCheck request without the risk of creating two identical health checks:   If you send a CreateHealthCheck request with the same CallerReference and settings as a previous request, and if the health check doesn't exist, Amazon Route 53 creates the health check. If the health check does exist, Route 53 returns the settings for the existing health check.   If you send a CreateHealthCheck request with the same CallerReference as a deleted health check, regardless of the settings, Route 53 returns a HealthCheckAlreadyExists error.   If you send a CreateHealthCheck request with the same CallerReference as an existing health check but with different settings, Route 53 returns a HealthCheckAlreadyExists error.   If you send a CreateHealthCheck request with a unique CallerReference but settings identical to an existing health check, Route 53 creates the health check.    Route 53 does not store the CallerReference for a deleted health check indefinitely. The CallerReference for a deleted health check will be deleted after a number of days.
     */
    CallerReference: HealthCheckNonce;
    /**
     * A complex type that contains settings for a new health check.
     */
    HealthCheckConfig: HealthCheckConfig;
  }
  export interface CreateHealthCheckResponse {
    /**
     * A complex type that contains identifying information about the health check.
     */
    HealthCheck: HealthCheck;
    /**
     * The unique URL representing the new health check.
     */
    Location: ResourceURI;
  }
  export interface CreateHostedZoneRequest {
    /**
     * The name of the domain. Specify a fully qualified domain name, for example, www.example.com. The trailing dot is optional; Amazon Route 53 assumes that the domain name is fully qualified. This means that Route 53 treats www.example.com (without a trailing dot) and www.example.com. (with a trailing dot) as identical. If you're creating a public hosted zone, this is the name you have registered with your DNS registrar. If your domain name is registered with a registrar other than Route 53, change the name servers for your domain to the set of NameServers that CreateHostedZone returns in DelegationSet.
     */
    Name: DNSName;
    /**
     * (Private hosted zones only) A complex type that contains information about the Amazon VPC that you're associating with this hosted zone. You can specify only one Amazon VPC when you create a private hosted zone. If you are associating a VPC with a hosted zone with this request, the paramaters VPCId and VPCRegion are also required. To associate additional Amazon VPCs with the hosted zone, use AssociateVPCWithHostedZone after you create a hosted zone.
     */
    VPC?: VPC;
    /**
     * A unique string that identifies the request and that allows failed CreateHostedZone requests to be retried without the risk of executing the operation twice. You must use a unique CallerReference string every time you submit a CreateHostedZone request. CallerReference can be any unique string, for example, a date/time stamp.
     */
    CallerReference: Nonce;
    /**
     * (Optional) A complex type that contains the following optional values:   For public and private hosted zones, an optional comment   For private hosted zones, an optional PrivateZone element   If you don't specify a comment or the PrivateZone element, omit HostedZoneConfig and the other elements.
     */
    HostedZoneConfig?: HostedZoneConfig;
    /**
     * If you want to associate a reusable delegation set with this hosted zone, the ID that Amazon Route 53 assigned to the reusable delegation set when you created it. For more information about reusable delegation sets, see CreateReusableDelegationSet. If you are using a reusable delegation set to create a public hosted zone for a subdomain, make sure that the parent hosted zone doesn't use one or more of the same name servers. If you have overlapping nameservers, the operation will cause a ConflictingDomainsExist error.
     */
    DelegationSetId?: ResourceId;
  }
  export interface CreateHostedZoneResponse {
    /**
     * A complex type that contains general information about the hosted zone.
     */
    HostedZone: HostedZone;
    /**
     * A complex type that contains information about the CreateHostedZone request.
     */
    ChangeInfo: ChangeInfo;
    /**
     * A complex type that describes the name servers for this hosted zone.
     */
    DelegationSet: DelegationSet;
    /**
     * A complex type that contains information about an Amazon VPC that you associated with this hosted zone.
     */
    VPC?: VPC;
    /**
     * The unique URL representing the new hosted zone.
     */
    Location: ResourceURI;
  }
  export interface CreateKeySigningKeyRequest {
    /**
     * A unique string that identifies the request.
     */
    CallerReference: Nonce;
    /**
     * The unique string (ID) used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
    /**
     * The Amazon resource name (ARN) for a customer managed key in Key Management Service (KMS). The KeyManagementServiceArn must be unique for each key-signing key (KSK) in a single hosted zone. To see an example of KeyManagementServiceArn that grants the correct permissions for DNSSEC, scroll down to Example.  You must configure the customer managed customer managed key as follows:  Status  Enabled  Key spec  ECC_NIST_P256  Key usage  Sign and verify  Key policy  The key policy must give permission for the following actions:   DescribeKey   GetPublicKey   Sign   The key policy must also include the Amazon Route 53 service in the principal for your account. Specify the following:    "Service": "dnssec-route53.amazonaws.com"      For more information about working with a customer managed key in KMS, see Key Management Service concepts.
     */
    KeyManagementServiceArn: SigningKeyString;
    /**
     * A string used to identify a key-signing key (KSK). Name can include numbers, letters, and underscores (_). Name must be unique for each key-signing key in the same hosted zone.
     */
    Name: SigningKeyName;
    /**
     * A string specifying the initial status of the key-signing key (KSK). You can set the value to ACTIVE or INACTIVE.
     */
    Status: SigningKeyStatus;
  }
  export interface CreateKeySigningKeyResponse {
    ChangeInfo: ChangeInfo;
    /**
     * The key-signing key (KSK) that the request creates.
     */
    KeySigningKey: KeySigningKey;
    /**
     * The unique URL representing the new key-signing key (KSK).
     */
    Location: ResourceURI;
  }
  export interface CreateQueryLoggingConfigRequest {
    /**
     * The ID of the hosted zone that you want to log queries for. You can log queries only for public hosted zones.
     */
    HostedZoneId: ResourceId;
    /**
     * The Amazon Resource Name (ARN) for the log group that you want to Amazon Route 53 to send query logs to. This is the format of the ARN: arn:aws:logs:region:account-id:log-group:log_group_name  To get the ARN for a log group, you can use the CloudWatch console, the DescribeLogGroups API action, the describe-log-groups command, or the applicable command in one of the Amazon Web Services SDKs.
     */
    CloudWatchLogsLogGroupArn: CloudWatchLogsLogGroupArn;
  }
  export interface CreateQueryLoggingConfigResponse {
    /**
     * A complex type that contains the ID for a query logging configuration, the ID of the hosted zone that you want to log queries for, and the ARN for the log group that you want Amazon Route 53 to send query logs to.
     */
    QueryLoggingConfig: QueryLoggingConfig;
    /**
     * The unique URL representing the new query logging configuration.
     */
    Location: ResourceURI;
  }
  export interface CreateReusableDelegationSetRequest {
    /**
     * A unique string that identifies the request, and that allows you to retry failed CreateReusableDelegationSet requests without the risk of executing the operation twice. You must use a unique CallerReference string every time you submit a CreateReusableDelegationSet request. CallerReference can be any unique string, for example a date/time stamp.
     */
    CallerReference: Nonce;
    /**
     * If you want to mark the delegation set for an existing hosted zone as reusable, the ID for that hosted zone.
     */
    HostedZoneId?: ResourceId;
  }
  export interface CreateReusableDelegationSetResponse {
    /**
     * A complex type that contains name server information.
     */
    DelegationSet: DelegationSet;
    /**
     * The unique URL representing the new reusable delegation set.
     */
    Location: ResourceURI;
  }
  export interface CreateTrafficPolicyInstanceRequest {
    /**
     * The ID of the hosted zone that you want Amazon Route 53 to create resource record sets in by using the configuration in a traffic policy.
     */
    HostedZoneId: ResourceId;
    /**
     * The domain name (such as example.com) or subdomain name (such as www.example.com) for which Amazon Route 53 responds to DNS queries by using the resource record sets that Route 53 creates for this traffic policy instance.
     */
    Name: DNSName;
    /**
     * (Optional) The TTL that you want Amazon Route 53 to assign to all of the resource record sets that it creates in the specified hosted zone.
     */
    TTL: TTL;
    /**
     * The ID of the traffic policy that you want to use to create resource record sets in the specified hosted zone.
     */
    TrafficPolicyId: TrafficPolicyId;
    /**
     * The version of the traffic policy that you want to use to create resource record sets in the specified hosted zone.
     */
    TrafficPolicyVersion: TrafficPolicyVersion;
  }
  export interface CreateTrafficPolicyInstanceResponse {
    /**
     * A complex type that contains settings for the new traffic policy instance.
     */
    TrafficPolicyInstance: TrafficPolicyInstance;
    /**
     * A unique URL that represents a new traffic policy instance.
     */
    Location: ResourceURI;
  }
  export interface CreateTrafficPolicyRequest {
    /**
     * The name of the traffic policy.
     */
    Name: TrafficPolicyName;
    /**
     * The definition of this traffic policy in JSON format. For more information, see Traffic Policy Document Format.
     */
    Document: TrafficPolicyDocument;
    /**
     * (Optional) Any comments that you want to include about the traffic policy.
     */
    Comment?: TrafficPolicyComment;
  }
  export interface CreateTrafficPolicyResponse {
    /**
     * A complex type that contains settings for the new traffic policy.
     */
    TrafficPolicy: TrafficPolicy;
    /**
     * A unique URL that represents a new traffic policy.
     */
    Location: ResourceURI;
  }
  export interface CreateTrafficPolicyVersionRequest {
    /**
     * The ID of the traffic policy for which you want to create a new version.
     */
    Id: TrafficPolicyId;
    /**
     * The definition of this version of the traffic policy, in JSON format. You specified the JSON in the CreateTrafficPolicyVersion request. For more information about the JSON format, see CreateTrafficPolicy.
     */
    Document: TrafficPolicyDocument;
    /**
     * The comment that you specified in the CreateTrafficPolicyVersion request, if any.
     */
    Comment?: TrafficPolicyComment;
  }
  export interface CreateTrafficPolicyVersionResponse {
    /**
     * A complex type that contains settings for the new version of the traffic policy.
     */
    TrafficPolicy: TrafficPolicy;
    /**
     * A unique URL that represents a new traffic policy version.
     */
    Location: ResourceURI;
  }
  export interface CreateVPCAssociationAuthorizationRequest {
    /**
     * The ID of the private hosted zone that you want to authorize associating a VPC with.
     */
    HostedZoneId: ResourceId;
    /**
     * A complex type that contains the VPC ID and region for the VPC that you want to authorize associating with your hosted zone.
     */
    VPC: VPC;
  }
  export interface CreateVPCAssociationAuthorizationResponse {
    /**
     * The ID of the hosted zone that you authorized associating a VPC with.
     */
    HostedZoneId: ResourceId;
    /**
     * The VPC that you authorized associating with a hosted zone.
     */
    VPC: VPC;
  }
  export type DNSName = string;
  export type DNSRCode = string;
  export interface DNSSECStatus {
    /**
     * A string that represents the current hosted zone signing status. Status can have one of the following values:  SIGNING  DNSSEC signing is enabled for the hosted zone.  NOT_SIGNING  DNSSEC signing is not enabled for the hosted zone.  DELETING  DNSSEC signing is in the process of being removed for the hosted zone.  ACTION_NEEDED  There is a problem with signing in the hosted zone that requires you to take action to resolve. For example, the customer managed key might have been deleted, or the permissions for the customer managed key might have been changed.  INTERNAL_FAILURE  There was an error during a request. Before you can continue to work with DNSSEC signing, including with key-signing keys (KSKs), you must correct the problem by enabling or disabling DNSSEC signing for the hosted zone.  
     */
    ServeSignature?: ServeSignature;
    /**
     * The status message provided for the following DNSSEC signing status: INTERNAL_FAILURE. The status message includes information about what the problem might be and steps that you can take to correct the issue.
     */
    StatusMessage?: SigningKeyStatusMessage;
  }
  export interface DeactivateKeySigningKeyRequest {
    /**
     * A unique string used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
    /**
     * A string used to identify a key-signing key (KSK).
     */
    Name: SigningKeyName;
  }
  export interface DeactivateKeySigningKeyResponse {
    ChangeInfo: ChangeInfo;
  }
  export interface DelegationSet {
    /**
     * The ID that Amazon Route 53 assigns to a reusable delegation set.
     */
    Id?: ResourceId;
    /**
     * The value that you specified for CallerReference when you created the reusable delegation set.
     */
    CallerReference?: Nonce;
    /**
     * A complex type that contains a list of the authoritative name servers for a hosted zone or for a reusable delegation set.
     */
    NameServers: DelegationSetNameServers;
  }
  export type DelegationSetNameServers = DNSName[];
  export type DelegationSets = DelegationSet[];
  export interface DeleteCidrCollectionRequest {
    /**
     * The UUID of the collection to delete.
     */
    Id: UUID;
  }
  export interface DeleteCidrCollectionResponse {
  }
  export interface DeleteHealthCheckRequest {
    /**
     * The ID of the health check that you want to delete.
     */
    HealthCheckId: HealthCheckId;
  }
  export interface DeleteHealthCheckResponse {
  }
  export interface DeleteHostedZoneRequest {
    /**
     * The ID of the hosted zone you want to delete.
     */
    Id: ResourceId;
  }
  export interface DeleteHostedZoneResponse {
    /**
     * A complex type that contains the ID, the status, and the date and time of a request to delete a hosted zone.
     */
    ChangeInfo: ChangeInfo;
  }
  export interface DeleteKeySigningKeyRequest {
    /**
     * A unique string used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
    /**
     * A string used to identify a key-signing key (KSK).
     */
    Name: SigningKeyName;
  }
  export interface DeleteKeySigningKeyResponse {
    ChangeInfo: ChangeInfo;
  }
  export interface DeleteQueryLoggingConfigRequest {
    /**
     * The ID of the configuration that you want to delete. 
     */
    Id: QueryLoggingConfigId;
  }
  export interface DeleteQueryLoggingConfigResponse {
  }
  export interface DeleteReusableDelegationSetRequest {
    /**
     * The ID of the reusable delegation set that you want to delete.
     */
    Id: ResourceId;
  }
  export interface DeleteReusableDelegationSetResponse {
  }
  export interface DeleteTrafficPolicyInstanceRequest {
    /**
     * The ID of the traffic policy instance that you want to delete.   When you delete a traffic policy instance, Amazon Route 53 also deletes all of the resource record sets that were created when you created the traffic policy instance. 
     */
    Id: TrafficPolicyInstanceId;
  }
  export interface DeleteTrafficPolicyInstanceResponse {
  }
  export interface DeleteTrafficPolicyRequest {
    /**
     * The ID of the traffic policy that you want to delete.
     */
    Id: TrafficPolicyId;
    /**
     * The version number of the traffic policy that you want to delete.
     */
    Version: TrafficPolicyVersion;
  }
  export interface DeleteTrafficPolicyResponse {
  }
  export interface DeleteVPCAssociationAuthorizationRequest {
    /**
     * When removing authorization to associate a VPC that was created by one Amazon Web Services account with a hosted zone that was created with a different Amazon Web Services account, the ID of the hosted zone.
     */
    HostedZoneId: ResourceId;
    /**
     * When removing authorization to associate a VPC that was created by one Amazon Web Services account with a hosted zone that was created with a different Amazon Web Services account, a complex type that includes the ID and region of the VPC.
     */
    VPC: VPC;
  }
  export interface DeleteVPCAssociationAuthorizationResponse {
  }
  export interface Dimension {
    /**
     * For the metric that the CloudWatch alarm is associated with, the name of one dimension.
     */
    Name: DimensionField;
    /**
     * For the metric that the CloudWatch alarm is associated with, the value of one dimension.
     */
    Value: DimensionField;
  }
  export type DimensionField = string;
  export type DimensionList = Dimension[];
  export interface DisableHostedZoneDNSSECRequest {
    /**
     * A unique string used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
  }
  export interface DisableHostedZoneDNSSECResponse {
    ChangeInfo: ChangeInfo;
  }
  export type Disabled = boolean;
  export type DisassociateVPCComment = string;
  export interface DisassociateVPCFromHostedZoneRequest {
    /**
     * The ID of the private hosted zone that you want to disassociate a VPC from.
     */
    HostedZoneId: ResourceId;
    /**
     * A complex type that contains information about the VPC that you're disassociating from the specified hosted zone.
     */
    VPC: VPC;
    /**
     *  Optional: A comment about the disassociation request.
     */
    Comment?: DisassociateVPCComment;
  }
  export interface DisassociateVPCFromHostedZoneResponse {
    /**
     * A complex type that describes the changes made to the specified private hosted zone.
     */
    ChangeInfo: ChangeInfo;
  }
  export interface EnableHostedZoneDNSSECRequest {
    /**
     * A unique string used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
  }
  export interface EnableHostedZoneDNSSECResponse {
    ChangeInfo: ChangeInfo;
  }
  export type EnableSNI = boolean;
  export type EvaluationPeriods = number;
  export type FailureThreshold = number;
  export type FullyQualifiedDomainName = string;
  export interface GeoLocation {
    /**
     * The two-letter code for the continent. Amazon Route 53 supports the following continent codes:    AF: Africa    AN: Antarctica    AS: Asia    EU: Europe    OC: Oceania    NA: North America    SA: South America   Constraint: Specifying ContinentCode with either CountryCode or SubdivisionCode returns an InvalidInput error.
     */
    ContinentCode?: GeoLocationContinentCode;
    /**
     * For geolocation resource record sets, the two-letter code for a country. Amazon Route 53 uses the two-letter country codes that are specified in ISO standard 3166-1 alpha-2. Route 53 also supports the contry code UA forr Ukraine.
     */
    CountryCode?: GeoLocationCountryCode;
    /**
     * For geolocation resource record sets, the two-letter code for a state of the United States. Route 53 doesn't support any other values for SubdivisionCode. For a list of state abbreviations, see Appendix B: Two–Letter State and Possession Abbreviations on the United States Postal Service website.  If you specify subdivisioncode, you must also specify US for CountryCode. 
     */
    SubdivisionCode?: GeoLocationSubdivisionCode;
  }
  export type GeoLocationContinentCode = string;
  export type GeoLocationContinentName = string;
  export type GeoLocationCountryCode = string;
  export type GeoLocationCountryName = string;
  export interface GeoLocationDetails {
    /**
     * The two-letter code for the continent.
     */
    ContinentCode?: GeoLocationContinentCode;
    /**
     * The full name of the continent.
     */
    ContinentName?: GeoLocationContinentName;
    /**
     * The two-letter code for the country.
     */
    CountryCode?: GeoLocationCountryCode;
    /**
     * The name of the country.
     */
    CountryName?: GeoLocationCountryName;
    /**
     * The code for the subdivision, such as a particular state within the United States. For a list of US state abbreviations, see Appendix B: Two–Letter State and Possession Abbreviations on the United States Postal Service website. For a list of all supported subdivision codes, use the ListGeoLocations API.
     */
    SubdivisionCode?: GeoLocationSubdivisionCode;
    /**
     * The full name of the subdivision. Route 53 currently supports only states in the United States.
     */
    SubdivisionName?: GeoLocationSubdivisionName;
  }
  export type GeoLocationDetailsList = GeoLocationDetails[];
  export type GeoLocationSubdivisionCode = string;
  export type GeoLocationSubdivisionName = string;
  export interface GetAccountLimitRequest {
    /**
     * The limit that you want to get. Valid values include the following:    MAX_HEALTH_CHECKS_BY_OWNER: The maximum number of health checks that you can create using the current account.    MAX_HOSTED_ZONES_BY_OWNER: The maximum number of hosted zones that you can create using the current account.    MAX_REUSABLE_DELEGATION_SETS_BY_OWNER: The maximum number of reusable delegation sets that you can create using the current account.    MAX_TRAFFIC_POLICIES_BY_OWNER: The maximum number of traffic policies that you can create using the current account.    MAX_TRAFFIC_POLICY_INSTANCES_BY_OWNER: The maximum number of traffic policy instances that you can create using the current account. (Traffic policy instances are referred to as traffic flow policy records in the Amazon Route 53 console.)  
     */
    Type: AccountLimitType;
  }
  export interface GetAccountLimitResponse {
    /**
     * The current setting for the specified limit. For example, if you specified MAX_HEALTH_CHECKS_BY_OWNER for the value of Type in the request, the value of Limit is the maximum number of health checks that you can create using the current account.
     */
    Limit: AccountLimit;
    /**
     * The current number of entities that you have created of the specified type. For example, if you specified MAX_HEALTH_CHECKS_BY_OWNER for the value of Type in the request, the value of Count is the current number of health checks that you have created using the current account.
     */
    Count: UsageCount;
  }
  export interface GetChangeRequest {
    /**
     * The ID of the change batch request. The value that you specify here is the value that ChangeResourceRecordSets returned in the Id element when you submitted the request.
     */
    Id: ChangeId;
  }
  export interface GetChangeResponse {
    /**
     * A complex type that contains information about the specified change batch.
     */
    ChangeInfo: ChangeInfo;
  }
  export interface GetCheckerIpRangesRequest {
  }
  export interface GetCheckerIpRangesResponse {
    /**
     * A complex type that contains sorted list of IP ranges in CIDR format for Amazon Route 53 health checkers.
     */
    CheckerIpRanges: CheckerIpRanges;
  }
  export interface GetDNSSECRequest {
    /**
     * A unique string used to identify a hosted zone.
     */
    HostedZoneId: ResourceId;
  }
  export interface GetDNSSECResponse {
    /**
     * A string repesenting the status of DNSSEC.
     */
    Status: DNSSECStatus;
    /**
     * The key-signing keys (KSKs) in your account.
     */
    KeySigningKeys: KeySigningKeys;
  }
  export interface GetGeoLocationRequest {
    /**
     * For geolocation resource record sets, a two-letter abbreviation that identifies a continent. Amazon Route 53 supports the following continent codes:    AF: Africa    AN: Antarctica    AS: Asia    EU: Europe    OC: Oceania    NA: North America    SA: South America  
     */
    ContinentCode?: GeoLocationContinentCode;
    /**
     * Amazon Route 53 uses the two-letter country codes that are specified in ISO standard 3166-1 alpha-2. Route 53 also supports the contry code UA forr Ukraine.
     */
    CountryCode?: GeoLocationCountryCode;
    /**
     * The code for the subdivision, such as a particular state within the United States. For a list of US state abbreviations, see Appendix B: Two–Letter State and Possession Abbreviations on the United States Postal Service website. For a list of all supported subdivision codes, use the ListGeoLocations API.
     */
    SubdivisionCode?: GeoLocationSubdivisionCode;
  }
  export interface GetGeoLocationResponse {
    /**
     * A complex type that contains the codes and full continent, country, and subdivision names for the specified geolocation code.
     */
    GeoLocationDetails: GeoLocationDetails;
  }
  export interface GetHealthCheckCountRequest {
  }
  export interface GetHealthCheckCountResponse {
    /**
     * The number of health checks associated with the current Amazon Web Services account.
     */
    HealthCheckCount: HealthCheckCount;
  }
  export interface GetHealthCheckLastFailureReasonRequest {
    /**
     * The ID for the health check for which you want the last failure reason. When you created the health check, CreateHealthCheck returned the ID in the response, in the HealthCheckId element.  If you want to get the last failure reason for a calculated health check, you must use the Amazon Route 53 console or the CloudWatch console. You can't use GetHealthCheckLastFailureReason for a calculated health check. 
     */
    HealthCheckId: HealthCheckId;
  }
  export interface GetHealthCheckLastFailureReasonResponse {
    /**
     * A list that contains one Observation element for each Amazon Route 53 health checker that is reporting a last failure reason. 
     */
    HealthCheckObservations: HealthCheckObservations;
  }
  export interface GetHealthCheckRequest {
    /**
     * The identifier that Amazon Route 53 assigned to the health check when you created it. When you add or update a resource record set, you use this value to specify which health check to use. The value can be up to 64 characters long.
     */
    HealthCheckId: HealthCheckId;
  }
  export interface GetHealthCheckResponse {
    /**
     * A complex type that contains information about one health check that is associated with the current Amazon Web Services account.
     */
    HealthCheck: HealthCheck;
  }
  export interface GetHealthCheckStatusRequest {
    /**
     * The ID for the health check that you want the current status for. When you created the health check, CreateHealthCheck returned the ID in the response, in the HealthCheckId element.  If you want to check the status of a calculated health check, you must use the Amazon Route 53 console or the CloudWatch console. You can't use GetHealthCheckStatus to get the status of a calculated health check. 
     */
    HealthCheckId: HealthCheckId;
  }
  export interface GetHealthCheckStatusResponse {
    /**
     * A list that contains one HealthCheckObservation element for each Amazon Route 53 health checker that is reporting a status about the health check endpoint.
     */
    HealthCheckObservations: HealthCheckObservations;
  }
  export interface GetHostedZoneCountRequest {
  }
  export interface GetHostedZoneCountResponse {
    /**
     * The total number of public and private hosted zones that are associated with the current Amazon Web Services account.
     */
    HostedZoneCount: HostedZoneCount;
  }
  export interface GetHostedZoneLimitRequest {
    /**
     * The limit that you want to get. Valid values include the following:    MAX_RRSETS_BY_ZONE: The maximum number of records that you can create in the specified hosted zone.    MAX_VPCS_ASSOCIATED_BY_ZONE: The maximum number of Amazon VPCs that you can associate with the specified private hosted zone.  
     */
    Type: HostedZoneLimitType;
    /**
     * The ID of the hosted zone that you want to get a limit for.
     */
    HostedZoneId: ResourceId;
  }
  export interface GetHostedZoneLimitResponse {
    /**
     * The current setting for the specified limit. For example, if you specified MAX_RRSETS_BY_ZONE for the value of Type in the request, the value of Limit is the maximum number of records that you can create in the specified hosted zone.
     */
    Limit: HostedZoneLimit;
    /**
     * The current number of entities that you have created of the specified type. For example, if you specified MAX_RRSETS_BY_ZONE for the value of Type in the request, the value of Count is the current number of records that you have created in the specified hosted zone.
     */
    Count: UsageCount;
  }
  export interface GetHostedZoneRequest {
    /**
     * The ID of the hosted zone that you want to get information about.
     */
    Id: ResourceId;
  }
  export interface GetHostedZoneResponse {
    /**
     * A complex type that contains general information about the specified hosted zone.
     */
    HostedZone: HostedZone;
    /**
     * A complex type that lists the Amazon Route 53 name servers for the specified hosted zone.
     */
    DelegationSet?: DelegationSet;
    /**
     * A complex type that contains information about the VPCs that are associated with the specified hosted zone.
     */
    VPCs?: VPCs;
  }
  export interface GetQueryLoggingConfigRequest {
    /**
     * The ID of the configuration for DNS query logging that you want to get information about.
     */
    Id: QueryLoggingConfigId;
  }
  export interface GetQueryLoggingConfigResponse {
    /**
     * A complex type that contains information about the query logging configuration that you specified in a GetQueryLoggingConfig request.
     */
    QueryLoggingConfig: QueryLoggingConfig;
  }
  export interface GetReusableDelegationSetLimitRequest {
    /**
     * Specify MAX_ZONES_BY_REUSABLE_DELEGATION_SET to get the maximum number of hosted zones that you can associate with the specified reusable delegation set.
     */
    Type: ReusableDelegationSetLimitType;
    /**
     * The ID of the delegation set that you want to get the limit for.
     */
    DelegationSetId: ResourceId;
  }
  export interface GetReusableDelegationSetLimitResponse {
    /**
     * The current setting for the limit on hosted zones that you can associate with the specified reusable delegation set.
     */
    Limit: ReusableDelegationSetLimit;
    /**
     * The current number of hosted zones that you can associate with the specified reusable delegation set.
     */
    Count: UsageCount;
  }
  export interface GetReusableDelegationSetRequest {
    /**
     * The ID of the reusable delegation set that you want to get a list of name servers for.
     */
    Id: ResourceId;
  }
  export interface GetReusableDelegationSetResponse {
    /**
     * A complex type that contains information about the reusable delegation set.
     */
    DelegationSet: DelegationSet;
  }
  export interface GetTrafficPolicyInstanceCountRequest {
  }
  export interface GetTrafficPolicyInstanceCountResponse {
    /**
     * The number of traffic policy instances that are associated with the current Amazon Web Services account.
     */
    TrafficPolicyInstanceCount: TrafficPolicyInstanceCount;
  }
  export interface GetTrafficPolicyInstanceRequest {
    /**
     * The ID of the traffic policy instance that you want to get information about.
     */
    Id: TrafficPolicyInstanceId;
  }
  export interface GetTrafficPolicyInstanceResponse {
    /**
     * A complex type that contains settings for the traffic policy instance.
     */
    TrafficPolicyInstance: TrafficPolicyInstance;
  }
  export interface GetTrafficPolicyRequest {
    /**
     * The ID of the traffic policy that you want to get information about.
     */
    Id: TrafficPolicyId;
    /**
     * The version number of the traffic policy that you want to get information about.
     */
    Version: TrafficPolicyVersion;
  }
  export interface GetTrafficPolicyResponse {
    /**
     * A complex type that contains settings for the specified traffic policy.
     */
    TrafficPolicy: TrafficPolicy;
  }
  export interface HealthCheck {
    /**
     * The identifier that Amazon Route 53 assigned to the health check when you created it. When you add or update a resource record set, you use this value to specify which health check to use. The value can be up to 64 characters long. 
     */
    Id: HealthCheckId;
    /**
     * A unique string that you specified when you created the health check.
     */
    CallerReference: HealthCheckNonce;
    /**
     * If the health check was created by another service, the service that created the health check. When a health check is created by another service, you can't edit or delete it using Amazon Route 53. 
     */
    LinkedService?: LinkedService;
    /**
     * A complex type that contains detailed information about one health check.
     */
    HealthCheckConfig: HealthCheckConfig;
    /**
     * The version of the health check. You can optionally pass this value in a call to UpdateHealthCheck to prevent overwriting another change to the health check.
     */
    HealthCheckVersion: HealthCheckVersion;
    /**
     * A complex type that contains information about the CloudWatch alarm that Amazon Route 53 is monitoring for this health check.
     */
    CloudWatchAlarmConfiguration?: CloudWatchAlarmConfiguration;
  }
  export interface HealthCheckConfig {
    /**
     * The IPv4 or IPv6 IP address of the endpoint that you want Amazon Route 53 to perform health checks on. If you don't specify a value for IPAddress, Route 53 sends a DNS request to resolve the domain name that you specify in FullyQualifiedDomainName at the interval that you specify in RequestInterval. Using an IP address returned by DNS, Route 53 then checks the health of the endpoint. Use one of the following formats for the value of IPAddress:     IPv4 address: four values between 0 and 255, separated by periods (.), for example, 192.0.2.44.    IPv6 address: eight groups of four hexadecimal values, separated by colons (:), for example, 2001:0db8:85a3:0000:0000:abcd:0001:2345. You can also shorten IPv6 addresses as described in RFC 5952, for example, 2001:db8:85a3::abcd:1:2345.   If the endpoint is an EC2 instance, we recommend that you create an Elastic IP address, associate it with your EC2 instance, and specify the Elastic IP address for IPAddress. This ensures that the IP address of your instance will never change. For more information, see FullyQualifiedDomainName.  Constraints: Route 53 can't check the health of endpoints for which the IP address is in local, private, non-routable, or multicast ranges. For more information about IP addresses for which you can't create health checks, see the following documents:    RFC 5735, Special Use IPv4 Addresses     RFC 6598, IANA-Reserved IPv4 Prefix for Shared Address Space     RFC 5156, Special-Use IPv6 Addresses    When the value of Type is CALCULATED or CLOUDWATCH_METRIC, omit IPAddress.
     */
    IPAddress?: IPAddress;
    /**
     * The port on the endpoint that you want Amazon Route 53 to perform health checks on.  Don't specify a value for Port when you specify a value for Type of CLOUDWATCH_METRIC or CALCULATED. 
     */
    Port?: Port;
    /**
     * The type of health check that you want to create, which indicates how Amazon Route 53 determines whether an endpoint is healthy.  You can't change the value of Type after you create a health check.  You can create the following types of health checks:    HTTP: Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and waits for an HTTP status code of 200 or greater and less than 400.    HTTPS: Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and waits for an HTTP status code of 200 or greater and less than 400.  If you specify HTTPS for the value of Type, the endpoint must support TLS v1.0 or later.     HTTP_STR_MATCH: Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and searches the first 5,120 bytes of the response body for the string that you specify in SearchString.    HTTPS_STR_MATCH: Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and searches the first 5,120 bytes of the response body for the string that you specify in SearchString.    TCP: Route 53 tries to establish a TCP connection.    CLOUDWATCH_METRIC: The health check is associated with a CloudWatch alarm. If the state of the alarm is OK, the health check is considered healthy. If the state is ALARM, the health check is considered unhealthy. If CloudWatch doesn't have sufficient data to determine whether the state is OK or ALARM, the health check status depends on the setting for InsufficientDataHealthStatus: Healthy, Unhealthy, or LastKnownStatus.     CALCULATED: For health checks that monitor the status of other health checks, Route 53 adds up the number of health checks that Route 53 health checkers consider to be healthy and compares that number with the value of HealthThreshold.     RECOVERY_CONTROL: The health check is assocated with a Route53 Application Recovery Controller routing control. If the routing control state is ON, the health check is considered healthy. If the state is OFF, the health check is considered unhealthy.    For more information, see How Route 53 Determines Whether an Endpoint Is Healthy in the Amazon Route 53 Developer Guide.
     */
    Type: HealthCheckType;
    /**
     * The path, if any, that you want Amazon Route 53 to request when performing health checks. The path can be any value for which your endpoint will return an HTTP status code of 2xx or 3xx when the endpoint is healthy, for example, the file /docs/route53-health-check.html. You can also include query string parameters, for example, /welcome.html?language=jp&amp;login=y. 
     */
    ResourcePath?: ResourcePath;
    /**
     * Amazon Route 53 behavior depends on whether you specify a value for IPAddress.  If you specify a value for IPAddress: Amazon Route 53 sends health check requests to the specified IPv4 or IPv6 address and passes the value of FullyQualifiedDomainName in the Host header for all health checks except TCP health checks. This is typically the fully qualified DNS name of the endpoint on which you want Route 53 to perform health checks. When Route 53 checks the health of an endpoint, here is how it constructs the Host header:   If you specify a value of 80 for Port and HTTP or HTTP_STR_MATCH for Type, Route 53 passes the value of FullyQualifiedDomainName to the endpoint in the Host header.    If you specify a value of 443 for Port and HTTPS or HTTPS_STR_MATCH for Type, Route 53 passes the value of FullyQualifiedDomainName to the endpoint in the Host header.   If you specify another value for Port and any value except TCP for Type, Route 53 passes FullyQualifiedDomainName:Port to the endpoint in the Host header.   If you don't specify a value for FullyQualifiedDomainName, Route 53 substitutes the value of IPAddress in the Host header in each of the preceding cases.  If you don't specify a value for IPAddress: Route 53 sends a DNS request to the domain that you specify for FullyQualifiedDomainName at the interval that you specify for RequestInterval. Using an IPv4 address that DNS returns, Route 53 then checks the health of the endpoint.  If you don't specify a value for IPAddress, Route 53 uses only IPv4 to send health checks to the endpoint. If there's no resource record set with a type of A for the name that you specify for FullyQualifiedDomainName, the health check fails with a "DNS resolution failed" error.  If you want to check the health of weighted, latency, or failover resource record sets and you choose to specify the endpoint only by FullyQualifiedDomainName, we recommend that you create a separate health check for each endpoint. For example, create a health check for each HTTP server that is serving content for www.example.com. For the value of FullyQualifiedDomainName, specify the domain name of the server (such as us-east-2-www.example.com), not the name of the resource record sets (www.example.com).  In this configuration, if you create a health check for which the value of FullyQualifiedDomainName matches the name of the resource record sets and you then associate the health check with those resource record sets, health check results will be unpredictable.  In addition, if the value that you specify for Type is HTTP, HTTPS, HTTP_STR_MATCH, or HTTPS_STR_MATCH, Route 53 passes the value of FullyQualifiedDomainName in the Host header, as it does when you specify a value for IPAddress. If the value of Type is TCP, Route 53 doesn't pass a Host header.
     */
    FullyQualifiedDomainName?: FullyQualifiedDomainName;
    /**
     * If the value of Type is HTTP_STR_MATCH or HTTPS_STR_MATCH, the string that you want Amazon Route 53 to search for in the response body from the specified resource. If the string appears in the response body, Route 53 considers the resource healthy. Route 53 considers case when searching for SearchString in the response body. 
     */
    SearchString?: SearchString;
    /**
     * The number of seconds between the time that Amazon Route 53 gets a response from your endpoint and the time that it sends the next health check request. Each Route 53 health checker makes requests at this interval.  You can't change the value of RequestInterval after you create a health check.  If you don't specify a value for RequestInterval, the default value is 30 seconds.
     */
    RequestInterval?: RequestInterval;
    /**
     * The number of consecutive health checks that an endpoint must pass or fail for Amazon Route 53 to change the current status of the endpoint from unhealthy to healthy or vice versa. For more information, see How Amazon Route 53 Determines Whether an Endpoint Is Healthy in the Amazon Route 53 Developer Guide. If you don't specify a value for FailureThreshold, the default value is three health checks.
     */
    FailureThreshold?: FailureThreshold;
    /**
     * Specify whether you want Amazon Route 53 to measure the latency between health checkers in multiple Amazon Web Services regions and your endpoint, and to display CloudWatch latency graphs on the Health Checks page in the Route 53 console.  You can't change the value of MeasureLatency after you create a health check. 
     */
    MeasureLatency?: MeasureLatency;
    /**
     * Specify whether you want Amazon Route 53 to invert the status of a health check, for example, to consider a health check unhealthy when it otherwise would be considered healthy.
     */
    Inverted?: Inverted;
    /**
     * Stops Route 53 from performing health checks. When you disable a health check, here's what happens:    Health checks that check the health of endpoints: Route 53 stops submitting requests to your application, server, or other resource.    Calculated health checks: Route 53 stops aggregating the status of the referenced health checks.    Health checks that monitor CloudWatch alarms: Route 53 stops monitoring the corresponding CloudWatch metrics.   After you disable a health check, Route 53 considers the status of the health check to always be healthy. If you configured DNS failover, Route 53 continues to route traffic to the corresponding resources. If you want to stop routing traffic to a resource, change the value of Inverted.  Charges for a health check still apply when the health check is disabled. For more information, see Amazon Route 53 Pricing.
     */
    Disabled?: Disabled;
    /**
     * The number of child health checks that are associated with a CALCULATED health check that Amazon Route 53 must consider healthy for the CALCULATED health check to be considered healthy. To specify the child health checks that you want to associate with a CALCULATED health check, use the ChildHealthChecks element. Note the following:   If you specify a number greater than the number of child health checks, Route 53 always considers this health check to be unhealthy.   If you specify 0, Route 53 always considers this health check to be healthy.  
     */
    HealthThreshold?: HealthThreshold;
    /**
     * (CALCULATED Health Checks Only) A complex type that contains one ChildHealthCheck element for each health check that you want to associate with a CALCULATED health check.
     */
    ChildHealthChecks?: ChildHealthCheckList;
    /**
     * Specify whether you want Amazon Route 53 to send the value of FullyQualifiedDomainName to the endpoint in the client_hello message during TLS negotiation. This allows the endpoint to respond to HTTPS health check requests with the applicable SSL/TLS certificate. Some endpoints require that HTTPS requests include the host name in the client_hello message. If you don't enable SNI, the status of the health check will be SSL alert handshake_failure. A health check can also have that status for other reasons. If SNI is enabled and you're still getting the error, check the SSL/TLS configuration on your endpoint and confirm that your certificate is valid. The SSL/TLS certificate on your endpoint includes a domain name in the Common Name field and possibly several more in the Subject Alternative Names field. One of the domain names in the certificate should match the value that you specify for FullyQualifiedDomainName. If the endpoint responds to the client_hello message with a certificate that does not include the domain name that you specified in FullyQualifiedDomainName, a health checker will retry the handshake. In the second attempt, the health checker will omit FullyQualifiedDomainName from the client_hello message.
     */
    EnableSNI?: EnableSNI;
    /**
     * A complex type that contains one Region element for each region from which you want Amazon Route 53 health checkers to check the specified endpoint. If you don't specify any regions, Route 53 health checkers automatically performs checks from all of the regions that are listed under Valid Values. If you update a health check to remove a region that has been performing health checks, Route 53 will briefly continue to perform checks from that region to ensure that some health checkers are always checking the endpoint (for example, if you replace three regions with four different regions). 
     */
    Regions?: HealthCheckRegionList;
    /**
     * A complex type that identifies the CloudWatch alarm that you want Amazon Route 53 health checkers to use to determine whether the specified health check is healthy.
     */
    AlarmIdentifier?: AlarmIdentifier;
    /**
     * When CloudWatch has insufficient data about the metric to determine the alarm state, the status that you want Amazon Route 53 to assign to the health check:    Healthy: Route 53 considers the health check to be healthy.    Unhealthy: Route 53 considers the health check to be unhealthy.    LastKnownStatus: Route 53 uses the status of the health check from the last time that CloudWatch had sufficient data to determine the alarm state. For new health checks that have no last known status, the default status for the health check is healthy.  
     */
    InsufficientDataHealthStatus?: InsufficientDataHealthStatus;
    /**
     * The Amazon Resource Name (ARN) for the Route 53 Application Recovery Controller routing control. For more information about Route 53 Application Recovery Controller, see Route 53 Application Recovery Controller Developer Guide..
     */
    RoutingControlArn?: RoutingControlArn;
  }
  export type HealthCheckCount = number;
  export type HealthCheckId = string;
  export type HealthCheckNonce = string;
  export interface HealthCheckObservation {
    /**
     * The region of the Amazon Route 53 health checker that provided the status in StatusReport.
     */
    Region?: HealthCheckRegion;
    /**
     * The IP address of the Amazon Route 53 health checker that provided the failure reason in StatusReport.
     */
    IPAddress?: IPAddress;
    /**
     * A complex type that contains the last failure reason as reported by one Amazon Route 53 health checker and the time of the failed health check.
     */
    StatusReport?: StatusReport;
  }
  export type HealthCheckObservations = HealthCheckObservation[];
  export type HealthCheckRegion = "us-east-1"|"us-west-1"|"us-west-2"|"eu-west-1"|"ap-southeast-1"|"ap-southeast-2"|"ap-northeast-1"|"sa-east-1"|string;
  export type HealthCheckRegionList = HealthCheckRegion[];
  export type HealthCheckType = "HTTP"|"HTTPS"|"HTTP_STR_MATCH"|"HTTPS_STR_MATCH"|"TCP"|"CALCULATED"|"CLOUDWATCH_METRIC"|"RECOVERY_CONTROL"|string;
  export type HealthCheckVersion = number;
  export type HealthChecks = HealthCheck[];
  export type HealthThreshold = number;
  export interface HostedZone {
    /**
     * The ID that Amazon Route 53 assigned to the hosted zone when you created it.
     */
    Id: ResourceId;
    /**
     * The name of the domain. For public hosted zones, this is the name that you have registered with your DNS registrar. For information about how to specify characters other than a-z, 0-9, and - (hyphen) and how to specify internationalized domain names, see CreateHostedZone.
     */
    Name: DNSName;
    /**
     * The value that you specified for CallerReference when you created the hosted zone.
     */
    CallerReference: Nonce;
    /**
     * A complex type that includes the Comment and PrivateZone elements. If you omitted the HostedZoneConfig and Comment elements from the request, the Config and Comment elements don't appear in the response.
     */
    Config?: HostedZoneConfig;
    /**
     * The number of resource record sets in the hosted zone.
     */
    ResourceRecordSetCount?: HostedZoneRRSetCount;
    /**
     * If the hosted zone was created by another service, the service that created the hosted zone. When a hosted zone is created by another service, you can't edit or delete it using Route 53. 
     */
    LinkedService?: LinkedService;
  }
  export interface HostedZoneConfig {
    /**
     * Any comments that you want to include about the hosted zone.
     */
    Comment?: ResourceDescription;
    /**
     * A value that indicates whether this is a private hosted zone.
     */
    PrivateZone?: IsPrivateZone;
  }
  export type HostedZoneCount = number;
  export interface HostedZoneLimit {
    /**
     * The limit that you requested. Valid values include the following:    MAX_RRSETS_BY_ZONE: The maximum number of records that you can create in the specified hosted zone.    MAX_VPCS_ASSOCIATED_BY_ZONE: The maximum number of Amazon VPCs that you can associate with the specified private hosted zone.  
     */
    Type: HostedZoneLimitType;
    /**
     * The current value for the limit that is specified by Type.
     */
    Value: LimitValue;
  }
  export type HostedZoneLimitType = "MAX_RRSETS_BY_ZONE"|"MAX_VPCS_ASSOCIATED_BY_ZONE"|string;
  export interface HostedZoneOwner {
    /**
     * If the hosted zone was created by an Amazon Web Services account, or was created by an Amazon Web Services service that creates hosted zones using the current account, OwningAccount contains the account ID of that account. For example, when you use Cloud Map to create a hosted zone, Cloud Map creates the hosted zone using the current Amazon Web Services account. 
     */
    OwningAccount?: AWSAccountID;
    /**
     * If an Amazon Web Services service uses its own account to create a hosted zone and associate the specified VPC with that hosted zone, OwningService contains an abbreviation that identifies the service. For example, if Amazon Elastic File System (Amazon EFS) created a hosted zone and associated a VPC with the hosted zone, the value of OwningService is efs.amazonaws.com.
     */
    OwningService?: HostedZoneOwningService;
  }
  export type HostedZoneOwningService = string;
  export type HostedZoneRRSetCount = number;
  export type HostedZoneSummaries = HostedZoneSummary[];
  export interface HostedZoneSummary {
    /**
     * The Route 53 hosted zone ID of a private hosted zone that the specified VPC is associated with.
     */
    HostedZoneId: ResourceId;
    /**
     * The name of the private hosted zone, such as example.com.
     */
    Name: DNSName;
    /**
     * The owner of a private hosted zone that the specified VPC is associated with. The owner can be either an Amazon Web Services account or an Amazon Web Services service.
     */
    Owner: HostedZoneOwner;
  }
  export type HostedZoneType = "PrivateHostedZone"|string;
  export type HostedZones = HostedZone[];
  export type IPAddress = string;
  export type IPAddressCidr = string;
  export type InsufficientDataHealthStatus = "Healthy"|"Unhealthy"|"LastKnownStatus"|string;
  export type Inverted = boolean;
  export type IsPrivateZone = boolean;
  export interface KeySigningKey {
    /**
     * A string used to identify a key-signing key (KSK). Name can include numbers, letters, and underscores (_). Name must be unique for each key-signing key in the same hosted zone.
     */
    Name?: SigningKeyName;
    /**
     * The Amazon resource name (ARN) used to identify the customer managed key in Key Management Service (KMS). The KmsArn must be unique for each key-signing key (KSK) in a single hosted zone. You must configure the customer managed key as follows:  Status  Enabled  Key spec  ECC_NIST_P256  Key usage  Sign and verify  Key policy  The key policy must give permission for the following actions:   DescribeKey   GetPublicKey   Sign   The key policy must also include the Amazon Route 53 service in the principal for your account. Specify the following:    "Service": "dnssec-route53.amazonaws.com"      For more information about working with the customer managed key in KMS, see Key Management Service concepts.
     */
    KmsArn?: SigningKeyString;
    /**
     * An integer that specifies how the key is used. For key-signing key (KSK), this value is always 257.
     */
    Flag?: SigningKeyInteger;
    /**
     * A string used to represent the signing algorithm. This value must follow the guidelines provided by RFC-8624 Section 3.1. 
     */
    SigningAlgorithmMnemonic?: SigningKeyString;
    /**
     * An integer used to represent the signing algorithm. This value must follow the guidelines provided by RFC-8624 Section 3.1. 
     */
    SigningAlgorithmType?: SigningKeyInteger;
    /**
     * A string used to represent the delegation signer digest algorithm. This value must follow the guidelines provided by RFC-8624 Section 3.3. 
     */
    DigestAlgorithmMnemonic?: SigningKeyString;
    /**
     * An integer used to represent the delegation signer digest algorithm. This value must follow the guidelines provided by RFC-8624 Section 3.3.
     */
    DigestAlgorithmType?: SigningKeyInteger;
    /**
     * An integer used to identify the DNSSEC record for the domain name. The process used to calculate the value is described in RFC-4034 Appendix B.
     */
    KeyTag?: SigningKeyTag;
    /**
     * A cryptographic digest of a DNSKEY resource record (RR). DNSKEY records are used to publish the public key that resolvers can use to verify DNSSEC signatures that are used to secure certain kinds of information provided by the DNS system.
     */
    DigestValue?: SigningKeyString;
    /**
     * The public key, represented as a Base64 encoding, as required by  RFC-4034 Page 5.
     */
    PublicKey?: SigningKeyString;
    /**
     * A string that represents a delegation signer (DS) record.
     */
    DSRecord?: SigningKeyString;
    /**
     * A string that represents a DNSKEY record.
     */
    DNSKEYRecord?: SigningKeyString;
    /**
     * A string that represents the current key-signing key (KSK) status. Status can have one of the following values:  ACTIVE  The KSK is being used for signing.  INACTIVE  The KSK is not being used for signing.  DELETING  The KSK is in the process of being deleted.  ACTION_NEEDED  There is a problem with the KSK that requires you to take action to resolve. For example, the customer managed key might have been deleted, or the permissions for the customer managed key might have been changed.  INTERNAL_FAILURE  There was an error during a request. Before you can continue to work with DNSSEC signing, including actions that involve this KSK, you must correct the problem. For example, you may need to activate or deactivate the KSK.  
     */
    Status?: SigningKeyStatus;
    /**
     * The status message provided for the following key-signing key (KSK) statuses: ACTION_NEEDED or INTERNAL_FAILURE. The status message includes information about what the problem might be and steps that you can take to correct the issue.
     */
    StatusMessage?: SigningKeyStatusMessage;
    /**
     * The date when the key-signing key (KSK) was created.
     */
    CreatedDate?: TimeStamp;
    /**
     * The last time that the key-signing key (KSK) was changed.
     */
    LastModifiedDate?: TimeStamp;
  }
  export type KeySigningKeys = KeySigningKey[];
  export type LimitValue = number;
  export interface LinkedService {
    /**
     * If the health check or hosted zone was created by another service, the service that created the resource. When a resource is created by another service, you can't edit or delete it using Amazon Route 53. 
     */
    ServicePrincipal?: ServicePrincipal;
    /**
     * If the health check or hosted zone was created by another service, an optional description that can be provided by the other service. When a resource is created by another service, you can't edit or delete it using Amazon Route 53. 
     */
    Description?: ResourceDescription;
  }
  export interface ListCidrBlocksRequest {
    /**
     * The UUID of the CIDR collection.
     */
    CollectionId: UUID;
    /**
     * The name of the CIDR collection location.
     */
    LocationName?: CidrLocationNameDefaultNotAllowed;
    /**
     * An opaque pagination token to indicate where the service is to begin enumerating results.
     */
    NextToken?: PaginationToken;
    /**
     * Maximum number of results you want returned.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCidrBlocksResponse {
    /**
     * An opaque pagination token to indicate where the service is to begin enumerating results.  If no value is provided, the listing of results starts from the beginning.
     */
    NextToken?: PaginationToken;
    /**
     * A complex type that contains information about the CIDR blocks.
     */
    CidrBlocks?: CidrBlockSummaries;
  }
  export interface ListCidrCollectionsRequest {
    /**
     * An opaque pagination token to indicate where the service is to begin enumerating results. If no value is provided, the listing of results starts from the beginning.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of CIDR collections to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCidrCollectionsResponse {
    /**
     * An opaque pagination token to indicate where the service is to begin enumerating results. If no value is provided, the listing of results starts from the beginning.
     */
    NextToken?: PaginationToken;
    /**
     * A complex type with information about the CIDR collection.
     */
    CidrCollections?: CollectionSummaries;
  }
  export interface ListCidrLocationsRequest {
    /**
     * The CIDR collection ID.
     */
    CollectionId: UUID;
    /**
     * An opaque pagination token to indicate where the service is to begin enumerating results. If no value is provided, the listing of results starts from the beginning.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of CIDR collection locations to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListCidrLocationsResponse {
    /**
     * An opaque pagination token to indicate where the service is to begin enumerating results. If no value is provided, the listing of results starts from the beginning.
     */
    NextToken?: PaginationToken;
    /**
     * A complex type that contains information about the list of CIDR locations.
     */
    CidrLocations?: LocationSummaries;
  }
  export interface ListGeoLocationsRequest {
    /**
     * The code for the continent with which you want to start listing locations that Amazon Route 53 supports for geolocation. If Route 53 has already returned a page or more of results, if IsTruncated is true, and if NextContinentCode from the previous response has a value, enter that value in startcontinentcode to return the next page of results. Include startcontinentcode only if you want to list continents. Don't include startcontinentcode when you're listing countries or countries with their subdivisions.
     */
    StartContinentCode?: GeoLocationContinentCode;
    /**
     * The code for the country with which you want to start listing locations that Amazon Route 53 supports for geolocation. If Route 53 has already returned a page or more of results, if IsTruncated is true, and if NextCountryCode from the previous response has a value, enter that value in startcountrycode to return the next page of results.
     */
    StartCountryCode?: GeoLocationCountryCode;
    /**
     * The code for the state of the United States with which you want to start listing locations that Amazon Route 53 supports for geolocation. If Route 53 has already returned a page or more of results, if IsTruncated is true, and if NextSubdivisionCode from the previous response has a value, enter that value in startsubdivisioncode to return the next page of results. To list subdivisions (U.S. states), you must include both startcountrycode and startsubdivisioncode.
     */
    StartSubdivisionCode?: GeoLocationSubdivisionCode;
    /**
     * (Optional) The maximum number of geolocations to be included in the response body for this request. If more than maxitems geolocations remain to be listed, then the value of the IsTruncated element in the response is true.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListGeoLocationsResponse {
    /**
     * A complex type that contains one GeoLocationDetails element for each location that Amazon Route 53 supports for geolocation.
     */
    GeoLocationDetailsList: GeoLocationDetailsList;
    /**
     * A value that indicates whether more locations remain to be listed after the last location in this response. If so, the value of IsTruncated is true. To get more values, submit another request and include the values of NextContinentCode, NextCountryCode, and NextSubdivisionCode in the startcontinentcode, startcountrycode, and startsubdivisioncode, as applicable.
     */
    IsTruncated: PageTruncated;
    /**
     * If IsTruncated is true, you can make a follow-up request to display more locations. Enter the value of NextContinentCode in the startcontinentcode parameter in another ListGeoLocations request.
     */
    NextContinentCode?: GeoLocationContinentCode;
    /**
     * If IsTruncated is true, you can make a follow-up request to display more locations. Enter the value of NextCountryCode in the startcountrycode parameter in another ListGeoLocations request.
     */
    NextCountryCode?: GeoLocationCountryCode;
    /**
     * If IsTruncated is true, you can make a follow-up request to display more locations. Enter the value of NextSubdivisionCode in the startsubdivisioncode parameter in another ListGeoLocations request.
     */
    NextSubdivisionCode?: GeoLocationSubdivisionCode;
    /**
     * The value that you specified for MaxItems in the request.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListHealthChecksRequest {
    /**
     * If the value of IsTruncated in the previous response was true, you have more health checks. To get another group, submit another ListHealthChecks request.  For the value of marker, specify the value of NextMarker from the previous response, which is the ID of the first health check that Amazon Route 53 will return if you submit another request. If the value of IsTruncated in the previous response was false, there are no more health checks to get.
     */
    Marker?: PageMarker;
    /**
     * The maximum number of health checks that you want ListHealthChecks to return in response to the current request. Amazon Route 53 returns a maximum of 1000 items. If you set MaxItems to a value greater than 1000, Route 53 returns only the first 1000 health checks. 
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListHealthChecksResponse {
    /**
     * A complex type that contains one HealthCheck element for each health check that is associated with the current Amazon Web Services account.
     */
    HealthChecks: HealthChecks;
    /**
     * For the second and subsequent calls to ListHealthChecks, Marker is the value that you specified for the marker parameter in the previous request.
     */
    Marker: PageMarker;
    /**
     * A flag that indicates whether there are more health checks to be listed. If the response was truncated, you can get the next group of health checks by submitting another ListHealthChecks request and specifying the value of NextMarker in the marker parameter.
     */
    IsTruncated: PageTruncated;
    /**
     * If IsTruncated is true, the value of NextMarker identifies the first health check that Amazon Route 53 returns if you submit another ListHealthChecks request and specify the value of NextMarker in the marker parameter.
     */
    NextMarker?: PageMarker;
    /**
     * The value that you specified for the maxitems parameter in the call to ListHealthChecks that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListHostedZonesByNameRequest {
    /**
     * (Optional) For your first request to ListHostedZonesByName, include the dnsname parameter only if you want to specify the name of the first hosted zone in the response. If you don't include the dnsname parameter, Amazon Route 53 returns all of the hosted zones that were created by the current Amazon Web Services account, in ASCII order. For subsequent requests, include both dnsname and hostedzoneid parameters. For dnsname, specify the value of NextDNSName from the previous response.
     */
    DNSName?: DNSName;
    /**
     * (Optional) For your first request to ListHostedZonesByName, do not include the hostedzoneid parameter. If you have more hosted zones than the value of maxitems, ListHostedZonesByName returns only the first maxitems hosted zones. To get the next group of maxitems hosted zones, submit another request to ListHostedZonesByName and include both dnsname and hostedzoneid parameters. For the value of hostedzoneid, specify the value of the NextHostedZoneId element from the previous response.
     */
    HostedZoneId?: ResourceId;
    /**
     * The maximum number of hosted zones to be included in the response body for this request. If you have more than maxitems hosted zones, then the value of the IsTruncated element in the response is true, and the values of NextDNSName and NextHostedZoneId specify the first hosted zone in the next group of maxitems hosted zones. 
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListHostedZonesByNameResponse {
    /**
     * A complex type that contains general information about the hosted zone.
     */
    HostedZones: HostedZones;
    /**
     * For the second and subsequent calls to ListHostedZonesByName, DNSName is the value that you specified for the dnsname parameter in the request that produced the current response.
     */
    DNSName?: DNSName;
    /**
     * The ID that Amazon Route 53 assigned to the hosted zone when you created it.
     */
    HostedZoneId?: ResourceId;
    /**
     * A flag that indicates whether there are more hosted zones to be listed. If the response was truncated, you can get the next group of maxitems hosted zones by calling ListHostedZonesByName again and specifying the values of NextDNSName and NextHostedZoneId elements in the dnsname and hostedzoneid parameters.
     */
    IsTruncated: PageTruncated;
    /**
     * If IsTruncated is true, the value of NextDNSName is the name of the first hosted zone in the next group of maxitems hosted zones. Call ListHostedZonesByName again and specify the value of NextDNSName and NextHostedZoneId in the dnsname and hostedzoneid parameters, respectively. This element is present only if IsTruncated is true.
     */
    NextDNSName?: DNSName;
    /**
     * If IsTruncated is true, the value of NextHostedZoneId identifies the first hosted zone in the next group of maxitems hosted zones. Call ListHostedZonesByName again and specify the value of NextDNSName and NextHostedZoneId in the dnsname and hostedzoneid parameters, respectively. This element is present only if IsTruncated is true.
     */
    NextHostedZoneId?: ResourceId;
    /**
     * The value that you specified for the maxitems parameter in the call to ListHostedZonesByName that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListHostedZonesByVPCRequest {
    /**
     * The ID of the Amazon VPC that you want to list hosted zones for.
     */
    VPCId: VPCId;
    /**
     * For the Amazon VPC that you specified for VPCId, the Amazon Web Services Region that you created the VPC in. 
     */
    VPCRegion: VPCRegion;
    /**
     * (Optional) The maximum number of hosted zones that you want Amazon Route 53 to return. If the specified VPC is associated with more than MaxItems hosted zones, the response includes a NextToken element. NextToken contains an encrypted token that identifies the first hosted zone that Route 53 will return if you submit another request.
     */
    MaxItems?: PageMaxItems;
    /**
     * If the previous response included a NextToken element, the specified VPC is associated with more hosted zones. To get more hosted zones, submit another ListHostedZonesByVPC request.  For the value of NextToken, specify the value of NextToken from the previous response. If the previous response didn't include a NextToken element, there are no more hosted zones to get.
     */
    NextToken?: PaginationToken;
  }
  export interface ListHostedZonesByVPCResponse {
    /**
     * A list that contains one HostedZoneSummary element for each hosted zone that the specified Amazon VPC is associated with. Each HostedZoneSummary element contains the hosted zone name and ID, and information about who owns the hosted zone.
     */
    HostedZoneSummaries: HostedZoneSummaries;
    /**
     * The value that you specified for MaxItems in the most recent ListHostedZonesByVPC request.
     */
    MaxItems: PageMaxItems;
    /**
     * The value that you will use for NextToken in the next ListHostedZonesByVPC request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListHostedZonesRequest {
    /**
     * If the value of IsTruncated in the previous response was true, you have more hosted zones. To get more hosted zones, submit another ListHostedZones request.  For the value of marker, specify the value of NextMarker from the previous response, which is the ID of the first hosted zone that Amazon Route 53 will return if you submit another request. If the value of IsTruncated in the previous response was false, there are no more hosted zones to get.
     */
    Marker?: PageMarker;
    /**
     * (Optional) The maximum number of hosted zones that you want Amazon Route 53 to return. If you have more than maxitems hosted zones, the value of IsTruncated in the response is true, and the value of NextMarker is the hosted zone ID of the first hosted zone that Route 53 will return if you submit another request.
     */
    MaxItems?: PageMaxItems;
    /**
     * If you're using reusable delegation sets and you want to list all of the hosted zones that are associated with a reusable delegation set, specify the ID of that reusable delegation set. 
     */
    DelegationSetId?: ResourceId;
    /**
     *  (Optional) Specifies if the hosted zone is private. 
     */
    HostedZoneType?: HostedZoneType;
  }
  export interface ListHostedZonesResponse {
    /**
     * A complex type that contains general information about the hosted zone.
     */
    HostedZones: HostedZones;
    /**
     * For the second and subsequent calls to ListHostedZones, Marker is the value that you specified for the marker parameter in the request that produced the current response.
     */
    Marker: PageMarker;
    /**
     * A flag indicating whether there are more hosted zones to be listed. If the response was truncated, you can get more hosted zones by submitting another ListHostedZones request and specifying the value of NextMarker in the marker parameter.
     */
    IsTruncated: PageTruncated;
    /**
     * If IsTruncated is true, the value of NextMarker identifies the first hosted zone in the next group of hosted zones. Submit another ListHostedZones request, and specify the value of NextMarker from the response in the marker parameter. This element is present only if IsTruncated is true.
     */
    NextMarker?: PageMarker;
    /**
     * The value that you specified for the maxitems parameter in the call to ListHostedZones that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListQueryLoggingConfigsRequest {
    /**
     * (Optional) If you want to list the query logging configuration that is associated with a hosted zone, specify the ID in HostedZoneId.  If you don't specify a hosted zone ID, ListQueryLoggingConfigs returns all of the configurations that are associated with the current Amazon Web Services account.
     */
    HostedZoneId?: ResourceId;
    /**
     * (Optional) If the current Amazon Web Services account has more than MaxResults query logging configurations, use NextToken to get the second and subsequent pages of results. For the first ListQueryLoggingConfigs request, omit this value. For the second and subsequent requests, get the value of NextToken from the previous response and specify that value for NextToken in the request.
     */
    NextToken?: PaginationToken;
    /**
     * (Optional) The maximum number of query logging configurations that you want Amazon Route 53 to return in response to the current request. If the current Amazon Web Services account has more than MaxResults configurations, use the value of NextToken in the response to get the next page of results. If you don't specify a value for MaxResults, Route 53 returns up to 100 configurations.
     */
    MaxResults?: MaxResults;
  }
  export interface ListQueryLoggingConfigsResponse {
    /**
     * An array that contains one QueryLoggingConfig element for each configuration for DNS query logging that is associated with the current Amazon Web Services account.
     */
    QueryLoggingConfigs: QueryLoggingConfigs;
    /**
     * If a response includes the last of the query logging configurations that are associated with the current Amazon Web Services account, NextToken doesn't appear in the response. If a response doesn't include the last of the configurations, you can get more configurations by submitting another ListQueryLoggingConfigs request. Get the value of NextToken that Amazon Route 53 returned in the previous response and include it in NextToken in the next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListResourceRecordSetsRequest {
    /**
     * The ID of the hosted zone that contains the resource record sets that you want to list.
     */
    HostedZoneId: ResourceId;
    /**
     * The first name in the lexicographic ordering of resource record sets that you want to list. If the specified record name doesn't exist, the results begin with the first resource record set that has a name greater than the value of name.
     */
    StartRecordName?: DNSName;
    /**
     * The type of resource record set to begin the record listing from. Valid values for basic resource record sets: A | AAAA | CAA | CNAME | MX | NAPTR | NS | PTR | SOA | SPF | SRV | TXT  Values for weighted, latency, geolocation, and failover resource record sets: A | AAAA | CAA | CNAME | MX | NAPTR | PTR | SPF | SRV | TXT  Values for alias resource record sets:     API Gateway custom regional API or edge-optimized API: A    CloudFront distribution: A or AAAA    Elastic Beanstalk environment that has a regionalized subdomain: A    Elastic Load Balancing load balancer: A | AAAA    S3 bucket: A    VPC interface VPC endpoint: A    Another resource record set in this hosted zone: The type of the resource record set that the alias references.   Constraint: Specifying type without specifying name returns an InvalidInput error.
     */
    StartRecordType?: RRType;
    /**
     *  Resource record sets that have a routing policy other than simple: If results were truncated for a given DNS name and type, specify the value of NextRecordIdentifier from the previous response to get the next resource record set that has the current DNS name and type.
     */
    StartRecordIdentifier?: ResourceRecordSetIdentifier;
    /**
     * (Optional) The maximum number of resource records sets to include in the response body for this request. If the response includes more than maxitems resource record sets, the value of the IsTruncated element in the response is true, and the values of the NextRecordName and NextRecordType elements in the response identify the first resource record set in the next group of maxitems resource record sets.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListResourceRecordSetsResponse {
    /**
     * Information about multiple resource record sets.
     */
    ResourceRecordSets: ResourceRecordSets;
    /**
     * A flag that indicates whether more resource record sets remain to be listed. If your results were truncated, you can make a follow-up pagination request by using the NextRecordName element.
     */
    IsTruncated: PageTruncated;
    /**
     * If the results were truncated, the name of the next record in the list. This element is present only if IsTruncated is true. 
     */
    NextRecordName?: DNSName;
    /**
     * If the results were truncated, the type of the next record in the list. This element is present only if IsTruncated is true. 
     */
    NextRecordType?: RRType;
    /**
     *  Resource record sets that have a routing policy other than simple: If results were truncated for a given DNS name and type, the value of SetIdentifier for the next resource record set that has the current DNS name and type. For information about routing policies, see Choosing a Routing Policy in the Amazon Route 53 Developer Guide.
     */
    NextRecordIdentifier?: ResourceRecordSetIdentifier;
    /**
     * The maximum number of records you requested.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListReusableDelegationSetsRequest {
    /**
     * If the value of IsTruncated in the previous response was true, you have more reusable delegation sets. To get another group, submit another ListReusableDelegationSets request.  For the value of marker, specify the value of NextMarker from the previous response, which is the ID of the first reusable delegation set that Amazon Route 53 will return if you submit another request. If the value of IsTruncated in the previous response was false, there are no more reusable delegation sets to get.
     */
    Marker?: PageMarker;
    /**
     * The number of reusable delegation sets that you want Amazon Route 53 to return in the response to this request. If you specify a value greater than 100, Route 53 returns only the first 100 reusable delegation sets.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListReusableDelegationSetsResponse {
    /**
     * A complex type that contains one DelegationSet element for each reusable delegation set that was created by the current Amazon Web Services account.
     */
    DelegationSets: DelegationSets;
    /**
     * For the second and subsequent calls to ListReusableDelegationSets, Marker is the value that you specified for the marker parameter in the request that produced the current response.
     */
    Marker: PageMarker;
    /**
     * A flag that indicates whether there are more reusable delegation sets to be listed.
     */
    IsTruncated: PageTruncated;
    /**
     * If IsTruncated is true, the value of NextMarker identifies the next reusable delegation set that Amazon Route 53 will return if you submit another ListReusableDelegationSets request and specify the value of NextMarker in the marker parameter.
     */
    NextMarker?: PageMarker;
    /**
     * The value that you specified for the maxitems parameter in the call to ListReusableDelegationSets that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The type of the resource.   The resource type for health checks is healthcheck.   The resource type for hosted zones is hostedzone.  
     */
    ResourceType: TagResourceType;
    /**
     * The ID of the resource for which you want to retrieve tags.
     */
    ResourceId: TagResourceId;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A ResourceTagSet containing tags associated with the specified resource.
     */
    ResourceTagSet: ResourceTagSet;
  }
  export interface ListTagsForResourcesRequest {
    /**
     * The type of the resources.   The resource type for health checks is healthcheck.   The resource type for hosted zones is hostedzone.  
     */
    ResourceType: TagResourceType;
    /**
     * A complex type that contains the ResourceId element for each resource for which you want to get a list of tags.
     */
    ResourceIds: TagResourceIdList;
  }
  export interface ListTagsForResourcesResponse {
    /**
     * A list of ResourceTagSets containing tags associated with the specified resources.
     */
    ResourceTagSets: ResourceTagSetList;
  }
  export interface ListTrafficPoliciesRequest {
    /**
     * (Conditional) For your first request to ListTrafficPolicies, don't include the TrafficPolicyIdMarker parameter. If you have more traffic policies than the value of MaxItems, ListTrafficPolicies returns only the first MaxItems traffic policies. To get the next group of policies, submit another request to ListTrafficPolicies. For the value of TrafficPolicyIdMarker, specify the value of TrafficPolicyIdMarker that was returned in the previous response.
     */
    TrafficPolicyIdMarker?: TrafficPolicyId;
    /**
     * (Optional) The maximum number of traffic policies that you want Amazon Route 53 to return in response to this request. If you have more than MaxItems traffic policies, the value of IsTruncated in the response is true, and the value of TrafficPolicyIdMarker is the ID of the first traffic policy that Route 53 will return if you submit another request.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListTrafficPoliciesResponse {
    /**
     * A list that contains one TrafficPolicySummary element for each traffic policy that was created by the current Amazon Web Services account.
     */
    TrafficPolicySummaries: TrafficPolicySummaries;
    /**
     * A flag that indicates whether there are more traffic policies to be listed. If the response was truncated, you can get the next group of traffic policies by submitting another ListTrafficPolicies request and specifying the value of TrafficPolicyIdMarker in the TrafficPolicyIdMarker request parameter.
     */
    IsTruncated: PageTruncated;
    /**
     * If the value of IsTruncated is true, TrafficPolicyIdMarker is the ID of the first traffic policy in the next group of MaxItems traffic policies.
     */
    TrafficPolicyIdMarker: TrafficPolicyId;
    /**
     * The value that you specified for the MaxItems parameter in the ListTrafficPolicies request that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListTrafficPolicyInstancesByHostedZoneRequest {
    /**
     * The ID of the hosted zone that you want to list traffic policy instances for.
     */
    HostedZoneId: ResourceId;
    /**
     * If the value of IsTruncated in the previous response is true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstances request. For the value of trafficpolicyinstancename, specify the value of TrafficPolicyInstanceNameMarker from the previous response, which is the name of the first traffic policy instance in the next group of traffic policy instances. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    TrafficPolicyInstanceNameMarker?: DNSName;
    /**
     * If the value of IsTruncated in the previous response is true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstances request. For the value of trafficpolicyinstancetype, specify the value of TrafficPolicyInstanceTypeMarker from the previous response, which is the type of the first traffic policy instance in the next group of traffic policy instances. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    TrafficPolicyInstanceTypeMarker?: RRType;
    /**
     * The maximum number of traffic policy instances to be included in the response body for this request. If you have more than MaxItems traffic policy instances, the value of the IsTruncated element in the response is true, and the values of HostedZoneIdMarker, TrafficPolicyInstanceNameMarker, and TrafficPolicyInstanceTypeMarker represent the first traffic policy instance that Amazon Route 53 will return if you submit another request.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListTrafficPolicyInstancesByHostedZoneResponse {
    /**
     * A list that contains one TrafficPolicyInstance element for each traffic policy instance that matches the elements in the request. 
     */
    TrafficPolicyInstances: TrafficPolicyInstances;
    /**
     * If IsTruncated is true, TrafficPolicyInstanceNameMarker is the name of the first traffic policy instance in the next group of traffic policy instances.
     */
    TrafficPolicyInstanceNameMarker?: DNSName;
    /**
     * If IsTruncated is true, TrafficPolicyInstanceTypeMarker is the DNS type of the resource record sets that are associated with the first traffic policy instance in the next group of traffic policy instances.
     */
    TrafficPolicyInstanceTypeMarker?: RRType;
    /**
     * A flag that indicates whether there are more traffic policy instances to be listed. If the response was truncated, you can get the next group of traffic policy instances by submitting another ListTrafficPolicyInstancesByHostedZone request and specifying the values of HostedZoneIdMarker, TrafficPolicyInstanceNameMarker, and TrafficPolicyInstanceTypeMarker in the corresponding request parameters.
     */
    IsTruncated: PageTruncated;
    /**
     * The value that you specified for the MaxItems parameter in the ListTrafficPolicyInstancesByHostedZone request that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListTrafficPolicyInstancesByPolicyRequest {
    /**
     * The ID of the traffic policy for which you want to list traffic policy instances.
     */
    TrafficPolicyId: TrafficPolicyId;
    /**
     * The version of the traffic policy for which you want to list traffic policy instances. The version must be associated with the traffic policy that is specified by TrafficPolicyId.
     */
    TrafficPolicyVersion: TrafficPolicyVersion;
    /**
     * If the value of IsTruncated in the previous response was true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstancesByPolicy request.  For the value of hostedzoneid, specify the value of HostedZoneIdMarker from the previous response, which is the hosted zone ID of the first traffic policy instance that Amazon Route 53 will return if you submit another request. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    HostedZoneIdMarker?: ResourceId;
    /**
     * If the value of IsTruncated in the previous response was true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstancesByPolicy request. For the value of trafficpolicyinstancename, specify the value of TrafficPolicyInstanceNameMarker from the previous response, which is the name of the first traffic policy instance that Amazon Route 53 will return if you submit another request. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    TrafficPolicyInstanceNameMarker?: DNSName;
    /**
     * If the value of IsTruncated in the previous response was true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstancesByPolicy request. For the value of trafficpolicyinstancetype, specify the value of TrafficPolicyInstanceTypeMarker from the previous response, which is the name of the first traffic policy instance that Amazon Route 53 will return if you submit another request. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    TrafficPolicyInstanceTypeMarker?: RRType;
    /**
     * The maximum number of traffic policy instances to be included in the response body for this request. If you have more than MaxItems traffic policy instances, the value of the IsTruncated element in the response is true, and the values of HostedZoneIdMarker, TrafficPolicyInstanceNameMarker, and TrafficPolicyInstanceTypeMarker represent the first traffic policy instance that Amazon Route 53 will return if you submit another request.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListTrafficPolicyInstancesByPolicyResponse {
    /**
     * A list that contains one TrafficPolicyInstance element for each traffic policy instance that matches the elements in the request.
     */
    TrafficPolicyInstances: TrafficPolicyInstances;
    /**
     * If IsTruncated is true, HostedZoneIdMarker is the ID of the hosted zone of the first traffic policy instance in the next group of traffic policy instances.
     */
    HostedZoneIdMarker?: ResourceId;
    /**
     * If IsTruncated is true, TrafficPolicyInstanceNameMarker is the name of the first traffic policy instance in the next group of MaxItems traffic policy instances.
     */
    TrafficPolicyInstanceNameMarker?: DNSName;
    /**
     * If IsTruncated is true, TrafficPolicyInstanceTypeMarker is the DNS type of the resource record sets that are associated with the first traffic policy instance in the next group of MaxItems traffic policy instances.
     */
    TrafficPolicyInstanceTypeMarker?: RRType;
    /**
     * A flag that indicates whether there are more traffic policy instances to be listed. If the response was truncated, you can get the next group of traffic policy instances by calling ListTrafficPolicyInstancesByPolicy again and specifying the values of the HostedZoneIdMarker, TrafficPolicyInstanceNameMarker, and TrafficPolicyInstanceTypeMarker elements in the corresponding request parameters.
     */
    IsTruncated: PageTruncated;
    /**
     * The value that you specified for the MaxItems parameter in the call to ListTrafficPolicyInstancesByPolicy that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListTrafficPolicyInstancesRequest {
    /**
     * If the value of IsTruncated in the previous response was true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstances request. For the value of HostedZoneId, specify the value of HostedZoneIdMarker from the previous response, which is the hosted zone ID of the first traffic policy instance in the next group of traffic policy instances. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    HostedZoneIdMarker?: ResourceId;
    /**
     * If the value of IsTruncated in the previous response was true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstances request. For the value of trafficpolicyinstancename, specify the value of TrafficPolicyInstanceNameMarker from the previous response, which is the name of the first traffic policy instance in the next group of traffic policy instances. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    TrafficPolicyInstanceNameMarker?: DNSName;
    /**
     * If the value of IsTruncated in the previous response was true, you have more traffic policy instances. To get more traffic policy instances, submit another ListTrafficPolicyInstances request. For the value of trafficpolicyinstancetype, specify the value of TrafficPolicyInstanceTypeMarker from the previous response, which is the type of the first traffic policy instance in the next group of traffic policy instances. If the value of IsTruncated in the previous response was false, there are no more traffic policy instances to get.
     */
    TrafficPolicyInstanceTypeMarker?: RRType;
    /**
     * The maximum number of traffic policy instances that you want Amazon Route 53 to return in response to a ListTrafficPolicyInstances request. If you have more than MaxItems traffic policy instances, the value of the IsTruncated element in the response is true, and the values of HostedZoneIdMarker, TrafficPolicyInstanceNameMarker, and TrafficPolicyInstanceTypeMarker represent the first traffic policy instance in the next group of MaxItems traffic policy instances.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListTrafficPolicyInstancesResponse {
    /**
     * A list that contains one TrafficPolicyInstance element for each traffic policy instance that matches the elements in the request.
     */
    TrafficPolicyInstances: TrafficPolicyInstances;
    /**
     * If IsTruncated is true, HostedZoneIdMarker is the ID of the hosted zone of the first traffic policy instance that Route 53 will return if you submit another ListTrafficPolicyInstances request. 
     */
    HostedZoneIdMarker?: ResourceId;
    /**
     * If IsTruncated is true, TrafficPolicyInstanceNameMarker is the name of the first traffic policy instance that Route 53 will return if you submit another ListTrafficPolicyInstances request. 
     */
    TrafficPolicyInstanceNameMarker?: DNSName;
    /**
     * If IsTruncated is true, TrafficPolicyInstanceTypeMarker is the DNS type of the resource record sets that are associated with the first traffic policy instance that Amazon Route 53 will return if you submit another ListTrafficPolicyInstances request. 
     */
    TrafficPolicyInstanceTypeMarker?: RRType;
    /**
     * A flag that indicates whether there are more traffic policy instances to be listed. If the response was truncated, you can get more traffic policy instances by calling ListTrafficPolicyInstances again and specifying the values of the HostedZoneIdMarker, TrafficPolicyInstanceNameMarker, and TrafficPolicyInstanceTypeMarker in the corresponding request parameters.
     */
    IsTruncated: PageTruncated;
    /**
     * The value that you specified for the MaxItems parameter in the call to ListTrafficPolicyInstances that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListTrafficPolicyVersionsRequest {
    /**
     * Specify the value of Id of the traffic policy for which you want to list all versions.
     */
    Id: TrafficPolicyId;
    /**
     * For your first request to ListTrafficPolicyVersions, don't include the TrafficPolicyVersionMarker parameter. If you have more traffic policy versions than the value of MaxItems, ListTrafficPolicyVersions returns only the first group of MaxItems versions. To get more traffic policy versions, submit another ListTrafficPolicyVersions request. For the value of TrafficPolicyVersionMarker, specify the value of TrafficPolicyVersionMarker in the previous response.
     */
    TrafficPolicyVersionMarker?: TrafficPolicyVersionMarker;
    /**
     * The maximum number of traffic policy versions that you want Amazon Route 53 to include in the response body for this request. If the specified traffic policy has more than MaxItems versions, the value of IsTruncated in the response is true, and the value of the TrafficPolicyVersionMarker element is the ID of the first version that Route 53 will return if you submit another request.
     */
    MaxItems?: PageMaxItems;
  }
  export interface ListTrafficPolicyVersionsResponse {
    /**
     * A list that contains one TrafficPolicy element for each traffic policy version that is associated with the specified traffic policy.
     */
    TrafficPolicies: TrafficPolicies;
    /**
     * A flag that indicates whether there are more traffic policies to be listed. If the response was truncated, you can get the next group of traffic policies by submitting another ListTrafficPolicyVersions request and specifying the value of NextMarker in the marker parameter.
     */
    IsTruncated: PageTruncated;
    /**
     * If IsTruncated is true, the value of TrafficPolicyVersionMarker identifies the first traffic policy that Amazon Route 53 will return if you submit another request. Call ListTrafficPolicyVersions again and specify the value of TrafficPolicyVersionMarker in the TrafficPolicyVersionMarker request parameter. This element is present only if IsTruncated is true.
     */
    TrafficPolicyVersionMarker: TrafficPolicyVersionMarker;
    /**
     * The value that you specified for the maxitems parameter in the ListTrafficPolicyVersions request that produced the current response.
     */
    MaxItems: PageMaxItems;
  }
  export interface ListVPCAssociationAuthorizationsRequest {
    /**
     * The ID of the hosted zone for which you want a list of VPCs that can be associated with the hosted zone.
     */
    HostedZoneId: ResourceId;
    /**
     *  Optional: If a response includes a NextToken element, there are more VPCs that can be associated with the specified hosted zone. To get the next page of results, submit another request, and include the value of NextToken from the response in the nexttoken parameter in another ListVPCAssociationAuthorizations request.
     */
    NextToken?: PaginationToken;
    /**
     *  Optional: An integer that specifies the maximum number of VPCs that you want Amazon Route 53 to return. If you don't specify a value for MaxResults, Route 53 returns up to 50 VPCs per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListVPCAssociationAuthorizationsResponse {
    /**
     * The ID of the hosted zone that you can associate the listed VPCs with.
     */
    HostedZoneId: ResourceId;
    /**
     * When the response includes a NextToken element, there are more VPCs that can be associated with the specified hosted zone. To get the next page of VPCs, submit another ListVPCAssociationAuthorizations request, and include the value of the NextToken element from the response in the nexttoken request parameter.
     */
    NextToken?: PaginationToken;
    /**
     * The list of VPCs that are authorized to be associated with the specified hosted zone.
     */
    VPCs: VPCs;
  }
  export type LocationSummaries = LocationSummary[];
  export interface LocationSummary {
    /**
     * A string that specifies a location name.
     */
    LocationName?: CidrLocationNameDefaultAllowed;
  }
  export type MaxResults = string;
  export type MeasureLatency = boolean;
  export type Message = string;
  export type MetricName = string;
  export type Nameserver = string;
  export type Namespace = string;
  export type Nonce = string;
  export type PageMarker = string;
  export type PageMaxItems = string;
  export type PageTruncated = boolean;
  export type PaginationToken = string;
  export type Period = number;
  export type Port = number;
  export interface QueryLoggingConfig {
    /**
     * The ID for a configuration for DNS query logging.
     */
    Id: QueryLoggingConfigId;
    /**
     * The ID of the hosted zone that CloudWatch Logs is logging queries for. 
     */
    HostedZoneId: ResourceId;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch Logs log group that Amazon Route 53 is publishing logs to.
     */
    CloudWatchLogsLogGroupArn: CloudWatchLogsLogGroupArn;
  }
  export type QueryLoggingConfigId = string;
  export type QueryLoggingConfigs = QueryLoggingConfig[];
  export type RData = string;
  export type RRType = "SOA"|"A"|"TXT"|"NS"|"CNAME"|"MX"|"NAPTR"|"PTR"|"SRV"|"SPF"|"AAAA"|"CAA"|"DS"|string;
  export type RecordData = RecordDataEntry[];
  export type RecordDataEntry = string;
  export type RequestInterval = number;
  export type ResettableElementName = "FullyQualifiedDomainName"|"Regions"|"ResourcePath"|"ChildHealthChecks"|string;
  export type ResettableElementNameList = ResettableElementName[];
  export type ResourceDescription = string;
  export type ResourceId = string;
  export type ResourcePath = string;
  export interface ResourceRecord {
    /**
     * The current or new DNS record value, not to exceed 4,000 characters. In the case of a DELETE action, if the current value does not match the actual value, an error is returned. For descriptions about how to format Value for different record types, see Supported DNS Resource Record Types in the Amazon Route 53 Developer Guide. You can specify more than one value for all record types except CNAME and SOA.   If you're creating an alias resource record set, omit Value. 
     */
    Value: RData;
  }
  export interface ResourceRecordSet {
    /**
     * For ChangeResourceRecordSets requests, the name of the record that you want to create, update, or delete. For ListResourceRecordSets responses, the name of a record in the specified hosted zone.  ChangeResourceRecordSets Only  Enter a fully qualified domain name, for example, www.example.com. You can optionally include a trailing dot. If you omit the trailing dot, Amazon Route 53 assumes that the domain name that you specify is fully qualified. This means that Route 53 treats www.example.com (without a trailing dot) and www.example.com. (with a trailing dot) as identical. For information about how to specify characters other than a-z, 0-9, and - (hyphen) and how to specify internationalized domain names, see DNS Domain Name Format in the Amazon Route 53 Developer Guide. You can use the asterisk (*) wildcard to replace the leftmost label in a domain name, for example, *.example.com. Note the following:   The * must replace the entire label. For example, you can't specify *prod.example.com or prod*.example.com.   The * can't replace any of the middle labels, for example, marketing.*.example.com.   If you include * in any position other than the leftmost label in a domain name, DNS treats it as an * character (ASCII 42), not as a wildcard.  You can't use the * wildcard for resource records sets that have a type of NS.    You can use the * wildcard as the leftmost label in a domain name, for example, *.example.com. You can't use an * for one of the middle labels, for example, marketing.*.example.com. In addition, the * must replace the entire label; for example, you can't specify prod*.example.com.
     */
    Name: DNSName;
    /**
     * The DNS record type. For information about different record types and how data is encoded for them, see Supported DNS Resource Record Types in the Amazon Route 53 Developer Guide. Valid values for basic resource record sets: A | AAAA | CAA | CNAME | DS |MX | NAPTR | NS | PTR | SOA | SPF | SRV | TXT  Values for weighted, latency, geolocation, and failover resource record sets: A | AAAA | CAA | CNAME | MX | NAPTR | PTR | SPF | SRV | TXT. When creating a group of weighted, latency, geolocation, or failover resource record sets, specify the same value for all of the resource record sets in the group. Valid values for multivalue answer resource record sets: A | AAAA | MX | NAPTR | PTR | SPF | SRV | TXT   SPF records were formerly used to verify the identity of the sender of email messages. However, we no longer recommend that you create resource record sets for which the value of Type is SPF. RFC 7208, Sender Policy Framework (SPF) for Authorizing Use of Domains in Email, Version 1, has been updated to say, "...[I]ts existence and mechanism defined in [RFC4408] have led to some interoperability issues. Accordingly, its use is no longer appropriate for SPF version 1; implementations are not to use it." In RFC 7208, see section 14.1, The SPF DNS Record Type.  Values for alias resource record sets:    Amazon API Gateway custom regional APIs and edge-optimized APIs: A     CloudFront distributions: A  If IPv6 is enabled for the distribution, create two resource record sets to route traffic to your distribution, one with a value of A and one with a value of AAAA.     Amazon API Gateway environment that has a regionalized subdomain: A     ELB load balancers: A | AAAA     Amazon S3 buckets: A     Amazon Virtual Private Cloud interface VPC endpoints A     Another resource record set in this hosted zone: Specify the type of the resource record set that you're creating the alias for. All values are supported except NS and SOA.  If you're creating an alias record that has the same name as the hosted zone (known as the zone apex), you can't route traffic to a record for which the value of Type is CNAME. This is because the alias record must have the same type as the record you're routing traffic to, and creating a CNAME record for the zone apex isn't supported even for an alias record.   
     */
    Type: RRType;
    /**
     *  Resource record sets that have a routing policy other than simple: An identifier that differentiates among multiple resource record sets that have the same combination of name and type, such as multiple weighted resource record sets named acme.example.com that have a type of A. In a group of resource record sets that have the same name and type, the value of SetIdentifier must be unique for each resource record set.  For information about routing policies, see Choosing a Routing Policy in the Amazon Route 53 Developer Guide.
     */
    SetIdentifier?: ResourceRecordSetIdentifier;
    /**
     *  Weighted resource record sets only: Among resource record sets that have the same combination of DNS name and type, a value that determines the proportion of DNS queries that Amazon Route 53 responds to using the current resource record set. Route 53 calculates the sum of the weights for the resource record sets that have the same combination of DNS name and type. Route 53 then responds to queries based on the ratio of a resource's weight to the total. Note the following:   You must specify a value for the Weight element for every weighted resource record set.   You can only specify one ResourceRecord per weighted resource record set.   You can't create latency, failover, or geolocation resource record sets that have the same values for the Name and Type elements as weighted resource record sets.   You can create a maximum of 100 weighted resource record sets that have the same values for the Name and Type elements.   For weighted (but not weighted alias) resource record sets, if you set Weight to 0 for a resource record set, Route 53 never responds to queries with the applicable value for that resource record set. However, if you set Weight to 0 for all resource record sets that have the same combination of DNS name and type, traffic is routed to all resources with equal probability. The effect of setting Weight to 0 is different when you associate health checks with weighted resource record sets. For more information, see Options for Configuring Route 53 Active-Active and Active-Passive Failover in the Amazon Route 53 Developer Guide.  
     */
    Weight?: ResourceRecordSetWeight;
    /**
     *  Latency-based resource record sets only: The Amazon EC2 Region where you created the resource that this resource record set refers to. The resource typically is an Amazon Web Services resource, such as an EC2 instance or an ELB load balancer, and is referred to by an IP address or a DNS domain name, depending on the record type. When Amazon Route 53 receives a DNS query for a domain name and type for which you have created latency resource record sets, Route 53 selects the latency resource record set that has the lowest latency between the end user and the associated Amazon EC2 Region. Route 53 then returns the value that is associated with the selected resource record set. Note the following:   You can only specify one ResourceRecord per latency resource record set.   You can only create one latency resource record set for each Amazon EC2 Region.   You aren't required to create latency resource record sets for all Amazon EC2 Regions. Route 53 will choose the region with the best latency from among the regions that you create latency resource record sets for.   You can't create non-latency resource record sets that have the same values for the Name and Type elements as latency resource record sets.  
     */
    Region?: ResourceRecordSetRegion;
    /**
     *  Geolocation resource record sets only: A complex type that lets you control how Amazon Route 53 responds to DNS queries based on the geographic origin of the query. For example, if you want all queries from Africa to be routed to a web server with an IP address of 192.0.2.111, create a resource record set with a Type of A and a ContinentCode of AF.  Although creating geolocation and geolocation alias resource record sets in a private hosted zone is allowed, it's not supported.  If you create separate resource record sets for overlapping geographic regions (for example, one resource record set for a continent and one for a country on the same continent), priority goes to the smallest geographic region. This allows you to route most queries for a continent to one resource and to route queries for a country on that continent to a different resource. You can't create two geolocation resource record sets that specify the same geographic location. The value * in the CountryCode element matches all geographic locations that aren't specified in other geolocation resource record sets that have the same values for the Name and Type elements.  Geolocation works by mapping IP addresses to locations. However, some IP addresses aren't mapped to geographic locations, so even if you create geolocation resource record sets that cover all seven continents, Route 53 will receive some DNS queries from locations that it can't identify. We recommend that you create a resource record set for which the value of CountryCode is *. Two groups of queries are routed to the resource that you specify in this record: queries that come from locations for which you haven't created geolocation resource record sets and queries from IP addresses that aren't mapped to a location. If you don't create a * resource record set, Route 53 returns a "no answer" response for queries from those locations.  You can't create non-geolocation resource record sets that have the same values for the Name and Type elements as geolocation resource record sets.
     */
    GeoLocation?: GeoLocation;
    /**
     *  Failover resource record sets only: To configure failover, you add the Failover element to two resource record sets. For one resource record set, you specify PRIMARY as the value for Failover; for the other resource record set, you specify SECONDARY. In addition, you include the HealthCheckId element and specify the health check that you want Amazon Route 53 to perform for each resource record set. Except where noted, the following failover behaviors assume that you have included the HealthCheckId element in both resource record sets:   When the primary resource record set is healthy, Route 53 responds to DNS queries with the applicable value from the primary resource record set regardless of the health of the secondary resource record set.   When the primary resource record set is unhealthy and the secondary resource record set is healthy, Route 53 responds to DNS queries with the applicable value from the secondary resource record set.   When the secondary resource record set is unhealthy, Route 53 responds to DNS queries with the applicable value from the primary resource record set regardless of the health of the primary resource record set.   If you omit the HealthCheckId element for the secondary resource record set, and if the primary resource record set is unhealthy, Route 53 always responds to DNS queries with the applicable value from the secondary resource record set. This is true regardless of the health of the associated endpoint.   You can't create non-failover resource record sets that have the same values for the Name and Type elements as failover resource record sets. For failover alias resource record sets, you must also include the EvaluateTargetHealth element and set the value to true. For more information about configuring failover for Route 53, see the following topics in the Amazon Route 53 Developer Guide:     Route 53 Health Checks and DNS Failover     Configuring Failover in a Private Hosted Zone   
     */
    Failover?: ResourceRecordSetFailover;
    /**
     *  Multivalue answer resource record sets only: To route traffic approximately randomly to multiple resources, such as web servers, create one multivalue answer record for each resource and specify true for MultiValueAnswer. Note the following:   If you associate a health check with a multivalue answer resource record set, Amazon Route 53 responds to DNS queries with the corresponding IP address only when the health check is healthy.   If you don't associate a health check with a multivalue answer record, Route 53 always considers the record to be healthy.   Route 53 responds to DNS queries with up to eight healthy records; if you have eight or fewer healthy records, Route 53 responds to all DNS queries with all the healthy records.   If you have more than eight healthy records, Route 53 responds to different DNS resolvers with different combinations of healthy records.   When all records are unhealthy, Route 53 responds to DNS queries with up to eight unhealthy records.   If a resource becomes unavailable after a resolver caches a response, client software typically tries another of the IP addresses in the response.   You can't create multivalue answer alias records.
     */
    MultiValueAnswer?: ResourceRecordSetMultiValueAnswer;
    /**
     * The resource record cache time to live (TTL), in seconds. Note the following:   If you're creating or updating an alias resource record set, omit TTL. Amazon Route 53 uses the value of TTL for the alias target.    If you're associating this resource record set with a health check (if you're adding a HealthCheckId element), we recommend that you specify a TTL of 60 seconds or less so clients respond quickly to changes in health status.   All of the resource record sets in a group of weighted resource record sets must have the same value for TTL.   If a group of weighted resource record sets includes one or more weighted alias resource record sets for which the alias target is an ELB load balancer, we recommend that you specify a TTL of 60 seconds for all of the non-alias weighted resource record sets that have the same name and type. Values other than 60 seconds (the TTL for load balancers) will change the effect of the values that you specify for Weight.  
     */
    TTL?: TTL;
    /**
     * Information about the resource records to act upon.  If you're creating an alias resource record set, omit ResourceRecords. 
     */
    ResourceRecords?: ResourceRecords;
    /**
     *  Alias resource record sets only: Information about the Amazon Web Services resource, such as a CloudFront distribution or an Amazon S3 bucket, that you want to route traffic to.  If you're creating resource records sets for a private hosted zone, note the following:   You can't create an alias resource record set in a private hosted zone to route traffic to a CloudFront distribution.   For information about creating failover resource record sets in a private hosted zone, see Configuring Failover in a Private Hosted Zone in the Amazon Route 53 Developer Guide.  
     */
    AliasTarget?: AliasTarget;
    /**
     * If you want Amazon Route 53 to return this resource record set in response to a DNS query only when the status of a health check is healthy, include the HealthCheckId element and specify the ID of the applicable health check. Route 53 determines whether a resource record set is healthy based on one of the following:   By periodically sending a request to the endpoint that is specified in the health check   By aggregating the status of a specified group of health checks (calculated health checks)   By determining the current state of a CloudWatch alarm (CloudWatch metric health checks)    Route 53 doesn't check the health of the endpoint that is specified in the resource record set, for example, the endpoint specified by the IP address in the Value element. When you add a HealthCheckId element to a resource record set, Route 53 checks the health of the endpoint that you specified in the health check.   For more information, see the following topics in the Amazon Route 53 Developer Guide:    How Amazon Route 53 Determines Whether an Endpoint Is Healthy     Route 53 Health Checks and DNS Failover     Configuring Failover in a Private Hosted Zone     When to Specify HealthCheckId  Specifying a value for HealthCheckId is useful only when Route 53 is choosing between two or more resource record sets to respond to a DNS query, and you want Route 53 to base the choice in part on the status of a health check. Configuring health checks makes sense only in the following configurations:    Non-alias resource record sets: You're checking the health of a group of non-alias resource record sets that have the same routing policy, name, and type (such as multiple weighted records named www.example.com with a type of A) and you specify health check IDs for all the resource record sets.  If the health check status for a resource record set is healthy, Route 53 includes the record among the records that it responds to DNS queries with. If the health check status for a resource record set is unhealthy, Route 53 stops responding to DNS queries using the value for that resource record set. If the health check status for all resource record sets in the group is unhealthy, Route 53 considers all resource record sets in the group healthy and responds to DNS queries accordingly.     Alias resource record sets: You specify the following settings:   You set EvaluateTargetHealth to true for an alias resource record set in a group of resource record sets that have the same routing policy, name, and type (such as multiple weighted records named www.example.com with a type of A).    You configure the alias resource record set to route traffic to a non-alias resource record set in the same hosted zone.   You specify a health check ID for the non-alias resource record set.    If the health check status is healthy, Route 53 considers the alias resource record set to be healthy and includes the alias record among the records that it responds to DNS queries with. If the health check status is unhealthy, Route 53 stops responding to DNS queries using the alias resource record set.  The alias resource record set can also route traffic to a group of non-alias resource record sets that have the same routing policy, name, and type. In that configuration, associate health checks with all of the resource record sets in the group of non-alias resource record sets.     Geolocation Routing  For geolocation resource record sets, if an endpoint is unhealthy, Route 53 looks for a resource record set for the larger, associated geographic region. For example, suppose you have resource record sets for a state in the United States, for the entire United States, for North America, and a resource record set that has * for CountryCode is *, which applies to all locations. If the endpoint for the state resource record set is unhealthy, Route 53 checks for healthy resource record sets in the following order until it finds a resource record set for which the endpoint is healthy:   The United States   North America   The default resource record set    Specifying the Health Check Endpoint by Domain Name  If your health checks specify the endpoint only by domain name, we recommend that you create a separate health check for each endpoint. For example, create a health check for each HTTP server that is serving content for www.example.com. For the value of FullyQualifiedDomainName, specify the domain name of the server (such as us-east-2-www.example.com), not the name of the resource record sets (www.example.com).  Health check results will be unpredictable if you do the following:   Create a health check that has the same value for FullyQualifiedDomainName as the name of a resource record set.   Associate that health check with the resource record set.   
     */
    HealthCheckId?: HealthCheckId;
    /**
     * When you create a traffic policy instance, Amazon Route 53 automatically creates a resource record set. TrafficPolicyInstanceId is the ID of the traffic policy instance that Route 53 created this resource record set for.  To delete the resource record set that is associated with a traffic policy instance, use DeleteTrafficPolicyInstance. Route 53 will delete the resource record set automatically. If you delete the resource record set by using ChangeResourceRecordSets, Route 53 doesn't automatically delete the traffic policy instance, and you'll continue to be charged for it even though it's no longer in use.  
     */
    TrafficPolicyInstanceId?: TrafficPolicyInstanceId;
    CidrRoutingConfig?: CidrRoutingConfig;
  }
  export type ResourceRecordSetFailover = "PRIMARY"|"SECONDARY"|string;
  export type ResourceRecordSetIdentifier = string;
  export type ResourceRecordSetMultiValueAnswer = boolean;
  export type ResourceRecordSetRegion = "us-east-1"|"us-east-2"|"us-west-1"|"us-west-2"|"ca-central-1"|"eu-west-1"|"eu-west-2"|"eu-west-3"|"eu-central-1"|"eu-central-2"|"ap-southeast-1"|"ap-southeast-2"|"ap-southeast-3"|"ap-northeast-1"|"ap-northeast-2"|"ap-northeast-3"|"eu-north-1"|"sa-east-1"|"cn-north-1"|"cn-northwest-1"|"ap-east-1"|"me-south-1"|"me-central-1"|"ap-south-1"|"ap-south-2"|"af-south-1"|"eu-south-1"|"eu-south-2"|"ap-southeast-4"|"il-central-1"|string;
  export type ResourceRecordSetWeight = number;
  export type ResourceRecordSets = ResourceRecordSet[];
  export type ResourceRecords = ResourceRecord[];
  export interface ResourceTagSet {
    /**
     * The type of the resource.   The resource type for health checks is healthcheck.   The resource type for hosted zones is hostedzone.  
     */
    ResourceType?: TagResourceType;
    /**
     * The ID for the specified resource.
     */
    ResourceId?: TagResourceId;
    /**
     * The tags associated with the specified resource.
     */
    Tags?: TagList;
  }
  export type ResourceTagSetList = ResourceTagSet[];
  export type ResourceURI = string;
  export interface ReusableDelegationSetLimit {
    /**
     * The limit that you requested: MAX_ZONES_BY_REUSABLE_DELEGATION_SET, the maximum number of hosted zones that you can associate with the specified reusable delegation set.
     */
    Type: ReusableDelegationSetLimitType;
    /**
     * The current value for the MAX_ZONES_BY_REUSABLE_DELEGATION_SET limit.
     */
    Value: LimitValue;
  }
  export type ReusableDelegationSetLimitType = "MAX_ZONES_BY_REUSABLE_DELEGATION_SET"|string;
  export type RoutingControlArn = string;
  export type SearchString = string;
  export type ServeSignature = string;
  export type ServicePrincipal = string;
  export type SigningKeyInteger = number;
  export type SigningKeyName = string;
  export type SigningKeyStatus = string;
  export type SigningKeyStatusMessage = string;
  export type SigningKeyString = string;
  export type SigningKeyTag = number;
  export type Statistic = "Average"|"Sum"|"SampleCount"|"Maximum"|"Minimum"|string;
  export type Status = string;
  export interface StatusReport {
    /**
     * A description of the status of the health check endpoint as reported by one of the Amazon Route 53 health checkers.
     */
    Status?: Status;
    /**
     * The date and time that the health checker performed the health check in ISO 8601 format and Coordinated Universal Time (UTC). For example, the value 2017-03-27T17:48:16.751Z represents March 27, 2017 at 17:48:16.751 UTC.
     */
    CheckedTime?: TimeStamp;
  }
  export type SubnetMask = string;
  export type TTL = number;
  export interface Tag {
    /**
     * The value of Key depends on the operation that you want to perform:    Add a tag to a health check or hosted zone: Key is the name that you want to give the new tag.    Edit a tag: Key is the name of the tag that you want to change the Value for.     Delete a key: Key is the name of the tag you want to remove.    Give a name to a health check: Edit the default Name tag. In the Amazon Route 53 console, the list of your health checks includes a Name column that lets you see the name that you've given to each health check.  
     */
    Key?: TagKey;
    /**
     * The value of Value depends on the operation that you want to perform:    Add a tag to a health check or hosted zone: Value is the value that you want to give the new tag.    Edit a tag: Value is the new value that you want to assign the tag.  
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagResourceId = string;
  export type TagResourceIdList = TagResourceId[];
  export type TagResourceType = "healthcheck"|"hostedzone"|string;
  export type TagValue = string;
  export interface TestDNSAnswerRequest {
    /**
     * The ID of the hosted zone that you want Amazon Route 53 to simulate a query for.
     */
    HostedZoneId: ResourceId;
    /**
     * The name of the resource record set that you want Amazon Route 53 to simulate a query for.
     */
    RecordName: DNSName;
    /**
     * The type of the resource record set.
     */
    RecordType: RRType;
    /**
     * If you want to simulate a request from a specific DNS resolver, specify the IP address for that resolver. If you omit this value, TestDnsAnswer uses the IP address of a DNS resolver in the Amazon Web Services US East (N. Virginia) Region (us-east-1).
     */
    ResolverIP?: IPAddress;
    /**
     * If the resolver that you specified for resolverip supports EDNS0, specify the IPv4 or IPv6 address of a client in the applicable location, for example, 192.0.2.44 or 2001:db8:85a3::8a2e:370:7334.
     */
    EDNS0ClientSubnetIP?: IPAddress;
    /**
     * If you specify an IP address for edns0clientsubnetip, you can optionally specify the number of bits of the IP address that you want the checking tool to include in the DNS query. For example, if you specify 192.0.2.44 for edns0clientsubnetip and 24 for edns0clientsubnetmask, the checking tool will simulate a request from 192.0.2.0/24. The default value is 24 bits for IPv4 addresses and 64 bits for IPv6 addresses. The range of valid values depends on whether edns0clientsubnetip is an IPv4 or an IPv6 address:    IPv4: Specify a value between 0 and 32    IPv6: Specify a value between 0 and 128  
     */
    EDNS0ClientSubnetMask?: SubnetMask;
  }
  export interface TestDNSAnswerResponse {
    /**
     * The Amazon Route 53 name server used to respond to the request.
     */
    Nameserver: Nameserver;
    /**
     * The name of the resource record set that you submitted a request for.
     */
    RecordName: DNSName;
    /**
     * The type of the resource record set that you submitted a request for.
     */
    RecordType: RRType;
    /**
     * A list that contains values that Amazon Route 53 returned for this resource record set.
     */
    RecordData: RecordData;
    /**
     * A code that indicates whether the request is valid or not. The most common response code is NOERROR, meaning that the request is valid. If the response is not valid, Amazon Route 53 returns a response code that describes the error. For a list of possible response codes, see DNS RCODES on the IANA website. 
     */
    ResponseCode: DNSRCode;
    /**
     * The protocol that Amazon Route 53 used to respond to the request, either UDP or TCP. 
     */
    Protocol: TransportProtocol;
  }
  export type Threshold = number;
  export type TimeStamp = Date;
  export type TrafficPolicies = TrafficPolicy[];
  export interface TrafficPolicy {
    /**
     * The ID that Amazon Route 53 assigned to a traffic policy when you created it.
     */
    Id: TrafficPolicyId;
    /**
     * The version number that Amazon Route 53 assigns to a traffic policy. For a new traffic policy, the value of Version is always 1.
     */
    Version: TrafficPolicyVersion;
    /**
     * The name that you specified when you created the traffic policy.
     */
    Name: TrafficPolicyName;
    /**
     * The DNS type of the resource record sets that Amazon Route 53 creates when you use a traffic policy to create a traffic policy instance.
     */
    Type: RRType;
    /**
     * The definition of a traffic policy in JSON format. You specify the JSON document to use for a new traffic policy in the CreateTrafficPolicy request. For more information about the JSON format, see Traffic Policy Document Format.
     */
    Document: TrafficPolicyDocument;
    /**
     * The comment that you specify in the CreateTrafficPolicy request, if any.
     */
    Comment?: TrafficPolicyComment;
  }
  export type TrafficPolicyComment = string;
  export type TrafficPolicyDocument = string;
  export type TrafficPolicyId = string;
  export interface TrafficPolicyInstance {
    /**
     * The ID that Amazon Route 53 assigned to the new traffic policy instance.
     */
    Id: TrafficPolicyInstanceId;
    /**
     * The ID of the hosted zone that Amazon Route 53 created resource record sets in.
     */
    HostedZoneId: ResourceId;
    /**
     * The DNS name, such as www.example.com, for which Amazon Route 53 responds to queries by using the resource record sets that are associated with this traffic policy instance. 
     */
    Name: DNSName;
    /**
     * The TTL that Amazon Route 53 assigned to all of the resource record sets that it created in the specified hosted zone.
     */
    TTL: TTL;
    /**
     * The value of State is one of the following values:  Applied  Amazon Route 53 has finished creating resource record sets, and changes have propagated to all Route 53 edge locations.  Creating  Route 53 is creating the resource record sets. Use GetTrafficPolicyInstance to confirm that the CreateTrafficPolicyInstance request completed successfully.  Failed  Route 53 wasn't able to create or update the resource record sets. When the value of State is Failed, see Message for an explanation of what caused the request to fail.  
     */
    State: TrafficPolicyInstanceState;
    /**
     * If State is Failed, an explanation of the reason for the failure. If State is another value, Message is empty.
     */
    Message: Message;
    /**
     * The ID of the traffic policy that Amazon Route 53 used to create resource record sets in the specified hosted zone.
     */
    TrafficPolicyId: TrafficPolicyId;
    /**
     * The version of the traffic policy that Amazon Route 53 used to create resource record sets in the specified hosted zone.
     */
    TrafficPolicyVersion: TrafficPolicyVersion;
    /**
     * The DNS type that Amazon Route 53 assigned to all of the resource record sets that it created for this traffic policy instance. 
     */
    TrafficPolicyType: RRType;
  }
  export type TrafficPolicyInstanceCount = number;
  export type TrafficPolicyInstanceId = string;
  export type TrafficPolicyInstanceState = string;
  export type TrafficPolicyInstances = TrafficPolicyInstance[];
  export type TrafficPolicyName = string;
  export type TrafficPolicySummaries = TrafficPolicySummary[];
  export interface TrafficPolicySummary {
    /**
     * The ID that Amazon Route 53 assigned to the traffic policy when you created it.
     */
    Id: TrafficPolicyId;
    /**
     * The name that you specified for the traffic policy when you created it.
     */
    Name: TrafficPolicyName;
    /**
     * The DNS type of the resource record sets that Amazon Route 53 creates when you use a traffic policy to create a traffic policy instance.
     */
    Type: RRType;
    /**
     * The version number of the latest version of the traffic policy.
     */
    LatestVersion: TrafficPolicyVersion;
    /**
     * The number of traffic policies that are associated with the current Amazon Web Services account.
     */
    TrafficPolicyCount: TrafficPolicyVersion;
  }
  export type TrafficPolicyVersion = number;
  export type TrafficPolicyVersionMarker = string;
  export type TransportProtocol = string;
  export type UUID = string;
  export interface UpdateHealthCheckRequest {
    /**
     * The ID for the health check for which you want detailed information. When you created the health check, CreateHealthCheck returned the ID in the response, in the HealthCheckId element.
     */
    HealthCheckId: HealthCheckId;
    /**
     * A sequential counter that Amazon Route 53 sets to 1 when you create a health check and increments by 1 each time you update settings for the health check. We recommend that you use GetHealthCheck or ListHealthChecks to get the current value of HealthCheckVersion for the health check that you want to update, and that you include that value in your UpdateHealthCheck request. This prevents Route 53 from overwriting an intervening update:   If the value in the UpdateHealthCheck request matches the value of HealthCheckVersion in the health check, Route 53 updates the health check with the new settings.   If the value of HealthCheckVersion in the health check is greater, the health check was changed after you got the version number. Route 53 does not update the health check, and it returns a HealthCheckVersionMismatch error.  
     */
    HealthCheckVersion?: HealthCheckVersion;
    /**
     * The IPv4 or IPv6 IP address for the endpoint that you want Amazon Route 53 to perform health checks on. If you don't specify a value for IPAddress, Route 53 sends a DNS request to resolve the domain name that you specify in FullyQualifiedDomainName at the interval that you specify in RequestInterval. Using an IP address that is returned by DNS, Route 53 then checks the health of the endpoint. Use one of the following formats for the value of IPAddress:     IPv4 address: four values between 0 and 255, separated by periods (.), for example, 192.0.2.44.    IPv6 address: eight groups of four hexadecimal values, separated by colons (:), for example, 2001:0db8:85a3:0000:0000:abcd:0001:2345. You can also shorten IPv6 addresses as described in RFC 5952, for example, 2001:db8:85a3::abcd:1:2345.   If the endpoint is an EC2 instance, we recommend that you create an Elastic IP address, associate it with your EC2 instance, and specify the Elastic IP address for IPAddress. This ensures that the IP address of your instance never changes. For more information, see the applicable documentation:   Linux: Elastic IP Addresses (EIP) in the Amazon EC2 User Guide for Linux Instances    Windows: Elastic IP Addresses (EIP) in the Amazon EC2 User Guide for Windows Instances     If a health check already has a value for IPAddress, you can change the value. However, you can't update an existing health check to add or remove the value of IPAddress.   For more information, see FullyQualifiedDomainName.  Constraints: Route 53 can't check the health of endpoints for which the IP address is in local, private, non-routable, or multicast ranges. For more information about IP addresses for which you can't create health checks, see the following documents:    RFC 5735, Special Use IPv4 Addresses     RFC 6598, IANA-Reserved IPv4 Prefix for Shared Address Space     RFC 5156, Special-Use IPv6 Addresses   
     */
    IPAddress?: IPAddress;
    /**
     * The port on the endpoint that you want Amazon Route 53 to perform health checks on.  Don't specify a value for Port when you specify a value for Type of CLOUDWATCH_METRIC or CALCULATED. 
     */
    Port?: Port;
    /**
     * The path that you want Amazon Route 53 to request when performing health checks. The path can be any value for which your endpoint will return an HTTP status code of 2xx or 3xx when the endpoint is healthy, for example the file /docs/route53-health-check.html. You can also include query string parameters, for example, /welcome.html?language=jp&amp;login=y.  Specify this value only if you want to change it.
     */
    ResourcePath?: ResourcePath;
    /**
     * Amazon Route 53 behavior depends on whether you specify a value for IPAddress.  If a health check already has a value for IPAddress, you can change the value. However, you can't update an existing health check to add or remove the value of IPAddress.    If you specify a value for IPAddress: Route 53 sends health check requests to the specified IPv4 or IPv6 address and passes the value of FullyQualifiedDomainName in the Host header for all health checks except TCP health checks. This is typically the fully qualified DNS name of the endpoint on which you want Route 53 to perform health checks. When Route 53 checks the health of an endpoint, here is how it constructs the Host header:   If you specify a value of 80 for Port and HTTP or HTTP_STR_MATCH for Type, Route 53 passes the value of FullyQualifiedDomainName to the endpoint in the Host header.   If you specify a value of 443 for Port and HTTPS or HTTPS_STR_MATCH for Type, Route 53 passes the value of FullyQualifiedDomainName to the endpoint in the Host header.   If you specify another value for Port and any value except TCP for Type, Route 53 passes  FullyQualifiedDomainName:Port  to the endpoint in the Host header.   If you don't specify a value for FullyQualifiedDomainName, Route 53 substitutes the value of IPAddress in the Host header in each of the above cases.  If you don't specify a value for IPAddress: If you don't specify a value for IPAddress, Route 53 sends a DNS request to the domain that you specify in FullyQualifiedDomainName at the interval you specify in RequestInterval. Using an IPv4 address that is returned by DNS, Route 53 then checks the health of the endpoint.  If you don't specify a value for IPAddress, Route 53 uses only IPv4 to send health checks to the endpoint. If there's no resource record set with a type of A for the name that you specify for FullyQualifiedDomainName, the health check fails with a "DNS resolution failed" error.  If you want to check the health of weighted, latency, or failover resource record sets and you choose to specify the endpoint only by FullyQualifiedDomainName, we recommend that you create a separate health check for each endpoint. For example, create a health check for each HTTP server that is serving content for www.example.com. For the value of FullyQualifiedDomainName, specify the domain name of the server (such as us-east-2-www.example.com), not the name of the resource record sets (www.example.com).  In this configuration, if the value of FullyQualifiedDomainName matches the name of the resource record sets and you then associate the health check with those resource record sets, health check results will be unpredictable.  In addition, if the value of Type is HTTP, HTTPS, HTTP_STR_MATCH, or HTTPS_STR_MATCH, Route 53 passes the value of FullyQualifiedDomainName in the Host header, as it does when you specify a value for IPAddress. If the value of Type is TCP, Route 53 doesn't pass a Host header.
     */
    FullyQualifiedDomainName?: FullyQualifiedDomainName;
    /**
     * If the value of Type is HTTP_STR_MATCH or HTTPS_STR_MATCH, the string that you want Amazon Route 53 to search for in the response body from the specified resource. If the string appears in the response body, Route 53 considers the resource healthy. (You can't change the value of Type when you update a health check.)
     */
    SearchString?: SearchString;
    /**
     * The number of consecutive health checks that an endpoint must pass or fail for Amazon Route 53 to change the current status of the endpoint from unhealthy to healthy or vice versa. For more information, see How Amazon Route 53 Determines Whether an Endpoint Is Healthy in the Amazon Route 53 Developer Guide. If you don't specify a value for FailureThreshold, the default value is three health checks.
     */
    FailureThreshold?: FailureThreshold;
    /**
     * Specify whether you want Amazon Route 53 to invert the status of a health check, for example, to consider a health check unhealthy when it otherwise would be considered healthy.
     */
    Inverted?: Inverted;
    /**
     * Stops Route 53 from performing health checks. When you disable a health check, here's what happens:    Health checks that check the health of endpoints: Route 53 stops submitting requests to your application, server, or other resource.    Calculated health checks: Route 53 stops aggregating the status of the referenced health checks.    Health checks that monitor CloudWatch alarms: Route 53 stops monitoring the corresponding CloudWatch metrics.   After you disable a health check, Route 53 considers the status of the health check to always be healthy. If you configured DNS failover, Route 53 continues to route traffic to the corresponding resources. If you want to stop routing traffic to a resource, change the value of Inverted.  Charges for a health check still apply when the health check is disabled. For more information, see Amazon Route 53 Pricing.
     */
    Disabled?: Disabled;
    /**
     * The number of child health checks that are associated with a CALCULATED health that Amazon Route 53 must consider healthy for the CALCULATED health check to be considered healthy. To specify the child health checks that you want to associate with a CALCULATED health check, use the ChildHealthChecks and ChildHealthCheck elements. Note the following:   If you specify a number greater than the number of child health checks, Route 53 always considers this health check to be unhealthy.   If you specify 0, Route 53 always considers this health check to be healthy.  
     */
    HealthThreshold?: HealthThreshold;
    /**
     * A complex type that contains one ChildHealthCheck element for each health check that you want to associate with a CALCULATED health check.
     */
    ChildHealthChecks?: ChildHealthCheckList;
    /**
     * Specify whether you want Amazon Route 53 to send the value of FullyQualifiedDomainName to the endpoint in the client_hello message during TLS negotiation. This allows the endpoint to respond to HTTPS health check requests with the applicable SSL/TLS certificate. Some endpoints require that HTTPS requests include the host name in the client_hello message. If you don't enable SNI, the status of the health check will be SSL alert handshake_failure. A health check can also have that status for other reasons. If SNI is enabled and you're still getting the error, check the SSL/TLS configuration on your endpoint and confirm that your certificate is valid. The SSL/TLS certificate on your endpoint includes a domain name in the Common Name field and possibly several more in the Subject Alternative Names field. One of the domain names in the certificate should match the value that you specify for FullyQualifiedDomainName. If the endpoint responds to the client_hello message with a certificate that does not include the domain name that you specified in FullyQualifiedDomainName, a health checker will retry the handshake. In the second attempt, the health checker will omit FullyQualifiedDomainName from the client_hello message.
     */
    EnableSNI?: EnableSNI;
    /**
     * A complex type that contains one Region element for each region that you want Amazon Route 53 health checkers to check the specified endpoint from.
     */
    Regions?: HealthCheckRegionList;
    /**
     * A complex type that identifies the CloudWatch alarm that you want Amazon Route 53 health checkers to use to determine whether the specified health check is healthy.
     */
    AlarmIdentifier?: AlarmIdentifier;
    /**
     * When CloudWatch has insufficient data about the metric to determine the alarm state, the status that you want Amazon Route 53 to assign to the health check:    Healthy: Route 53 considers the health check to be healthy.    Unhealthy: Route 53 considers the health check to be unhealthy.    LastKnownStatus: By default, Route 53 uses the status of the health check from the last time CloudWatch had sufficient data to determine the alarm state. For new health checks that have no last known status, the status for the health check is healthy.  
     */
    InsufficientDataHealthStatus?: InsufficientDataHealthStatus;
    /**
     * A complex type that contains one ResettableElementName element for each element that you want to reset to the default value. Valid values for ResettableElementName include the following:    ChildHealthChecks: Amazon Route 53 resets ChildHealthChecks to null.    FullyQualifiedDomainName: Route 53 resets FullyQualifiedDomainName. to null.    Regions: Route 53 resets the Regions list to the default set of regions.     ResourcePath: Route 53 resets ResourcePath to null.  
     */
    ResetElements?: ResettableElementNameList;
  }
  export interface UpdateHealthCheckResponse {
    /**
     * A complex type that contains the response to an UpdateHealthCheck request.
     */
    HealthCheck: HealthCheck;
  }
  export interface UpdateHostedZoneCommentRequest {
    /**
     * The ID for the hosted zone that you want to update the comment for.
     */
    Id: ResourceId;
    /**
     * The new comment for the hosted zone. If you don't specify a value for Comment, Amazon Route 53 deletes the existing value of the Comment element, if any.
     */
    Comment?: ResourceDescription;
  }
  export interface UpdateHostedZoneCommentResponse {
    /**
     * A complex type that contains the response to the UpdateHostedZoneComment request.
     */
    HostedZone: HostedZone;
  }
  export interface UpdateTrafficPolicyCommentRequest {
    /**
     * The value of Id for the traffic policy that you want to update the comment for.
     */
    Id: TrafficPolicyId;
    /**
     * The value of Version for the traffic policy that you want to update the comment for.
     */
    Version: TrafficPolicyVersion;
    /**
     * The new comment for the specified traffic policy and version.
     */
    Comment: TrafficPolicyComment;
  }
  export interface UpdateTrafficPolicyCommentResponse {
    /**
     * A complex type that contains settings for the specified traffic policy.
     */
    TrafficPolicy: TrafficPolicy;
  }
  export interface UpdateTrafficPolicyInstanceRequest {
    /**
     * The ID of the traffic policy instance that you want to update.
     */
    Id: TrafficPolicyInstanceId;
    /**
     * The TTL that you want Amazon Route 53 to assign to all of the updated resource record sets.
     */
    TTL: TTL;
    /**
     * The ID of the traffic policy that you want Amazon Route 53 to use to update resource record sets for the specified traffic policy instance.
     */
    TrafficPolicyId: TrafficPolicyId;
    /**
     * The version of the traffic policy that you want Amazon Route 53 to use to update resource record sets for the specified traffic policy instance.
     */
    TrafficPolicyVersion: TrafficPolicyVersion;
  }
  export interface UpdateTrafficPolicyInstanceResponse {
    /**
     * A complex type that contains settings for the updated traffic policy instance.
     */
    TrafficPolicyInstance: TrafficPolicyInstance;
  }
  export type UsageCount = number;
  export interface VPC {
    /**
     * (Private hosted zones only) The region that an Amazon VPC was created in.
     */
    VPCRegion?: VPCRegion;
    VPCId?: VPCId;
  }
  export type VPCId = string;
  export type VPCRegion = "us-east-1"|"us-east-2"|"us-west-1"|"us-west-2"|"eu-west-1"|"eu-west-2"|"eu-west-3"|"eu-central-1"|"eu-central-2"|"ap-east-1"|"me-south-1"|"us-gov-west-1"|"us-gov-east-1"|"us-iso-east-1"|"us-iso-west-1"|"us-isob-east-1"|"me-central-1"|"ap-southeast-1"|"ap-southeast-2"|"ap-southeast-3"|"ap-south-1"|"ap-south-2"|"ap-northeast-1"|"ap-northeast-2"|"ap-northeast-3"|"eu-north-1"|"sa-east-1"|"ca-central-1"|"cn-north-1"|"af-south-1"|"eu-south-1"|"eu-south-2"|"ap-southeast-4"|"il-central-1"|string;
  export type VPCs = VPC[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-04-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Route53 client.
   */
  export import Types = Route53;
}
export = Route53;
