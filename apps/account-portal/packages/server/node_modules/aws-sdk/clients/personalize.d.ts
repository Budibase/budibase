import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Personalize extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Personalize.Types.ClientConfiguration)
  config: Config & Personalize.Types.ClientConfiguration;
  /**
   * Creates a batch inference job. The operation can handle up to 50 million records and the input file must be in JSON format. For more information, see Creating a batch inference job. 
   */
  createBatchInferenceJob(params: Personalize.Types.CreateBatchInferenceJobRequest, callback?: (err: AWSError, data: Personalize.Types.CreateBatchInferenceJobResponse) => void): Request<Personalize.Types.CreateBatchInferenceJobResponse, AWSError>;
  /**
   * Creates a batch inference job. The operation can handle up to 50 million records and the input file must be in JSON format. For more information, see Creating a batch inference job. 
   */
  createBatchInferenceJob(callback?: (err: AWSError, data: Personalize.Types.CreateBatchInferenceJobResponse) => void): Request<Personalize.Types.CreateBatchInferenceJobResponse, AWSError>;
  /**
   * Creates a batch segment job. The operation can handle up to 50 million records and the input file must be in JSON format. For more information, see Getting batch recommendations and user segments.
   */
  createBatchSegmentJob(params: Personalize.Types.CreateBatchSegmentJobRequest, callback?: (err: AWSError, data: Personalize.Types.CreateBatchSegmentJobResponse) => void): Request<Personalize.Types.CreateBatchSegmentJobResponse, AWSError>;
  /**
   * Creates a batch segment job. The operation can handle up to 50 million records and the input file must be in JSON format. For more information, see Getting batch recommendations and user segments.
   */
  createBatchSegmentJob(callback?: (err: AWSError, data: Personalize.Types.CreateBatchSegmentJobResponse) => void): Request<Personalize.Types.CreateBatchSegmentJobResponse, AWSError>;
  /**
   * Creates a campaign that deploys a solution version. When a client calls the GetRecommendations and GetPersonalizedRanking APIs, a campaign is specified in the request.  Minimum Provisioned TPS and Auto-Scaling    A high minProvisionedTPS will increase your bill. We recommend starting with 1 for minProvisionedTPS (the default). Track your usage using Amazon CloudWatch metrics, and increase the minProvisionedTPS as necessary.  A transaction is a single GetRecommendations or GetPersonalizedRanking call. Transactions per second (TPS) is the throughput and unit of billing for Amazon Personalize. The minimum provisioned TPS (minProvisionedTPS) specifies the baseline throughput provisioned by Amazon Personalize, and thus, the minimum billing charge.   If your TPS increases beyond minProvisionedTPS, Amazon Personalize auto-scales the provisioned capacity up and down, but never below minProvisionedTPS. There's a short time delay while the capacity is increased that might cause loss of transactions. The actual TPS used is calculated as the average requests/second within a 5-minute window. You pay for maximum of either the minimum provisioned TPS or the actual TPS. We recommend starting with a low minProvisionedTPS, track your usage using Amazon CloudWatch metrics, and then increase the minProvisionedTPS as necessary.  Status  A campaign can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the campaign status, call DescribeCampaign.  Wait until the status of the campaign is ACTIVE before asking the campaign for recommendations.   Related APIs     ListCampaigns     DescribeCampaign     UpdateCampaign     DeleteCampaign   
   */
  createCampaign(params: Personalize.Types.CreateCampaignRequest, callback?: (err: AWSError, data: Personalize.Types.CreateCampaignResponse) => void): Request<Personalize.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates a campaign that deploys a solution version. When a client calls the GetRecommendations and GetPersonalizedRanking APIs, a campaign is specified in the request.  Minimum Provisioned TPS and Auto-Scaling    A high minProvisionedTPS will increase your bill. We recommend starting with 1 for minProvisionedTPS (the default). Track your usage using Amazon CloudWatch metrics, and increase the minProvisionedTPS as necessary.  A transaction is a single GetRecommendations or GetPersonalizedRanking call. Transactions per second (TPS) is the throughput and unit of billing for Amazon Personalize. The minimum provisioned TPS (minProvisionedTPS) specifies the baseline throughput provisioned by Amazon Personalize, and thus, the minimum billing charge.   If your TPS increases beyond minProvisionedTPS, Amazon Personalize auto-scales the provisioned capacity up and down, but never below minProvisionedTPS. There's a short time delay while the capacity is increased that might cause loss of transactions. The actual TPS used is calculated as the average requests/second within a 5-minute window. You pay for maximum of either the minimum provisioned TPS or the actual TPS. We recommend starting with a low minProvisionedTPS, track your usage using Amazon CloudWatch metrics, and then increase the minProvisionedTPS as necessary.  Status  A campaign can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the campaign status, call DescribeCampaign.  Wait until the status of the campaign is ACTIVE before asking the campaign for recommendations.   Related APIs     ListCampaigns     DescribeCampaign     UpdateCampaign     DeleteCampaign   
   */
  createCampaign(callback?: (err: AWSError, data: Personalize.Types.CreateCampaignResponse) => void): Request<Personalize.Types.CreateCampaignResponse, AWSError>;
  /**
   * Creates an empty dataset and adds it to the specified dataset group. Use CreateDatasetImportJob to import your training data to a dataset. There are three types of datasets:   Interactions   Items   Users   Each dataset type has an associated schema with required field types. Only the Interactions dataset is required in order to train a model (also referred to as creating a solution). A dataset can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the status of the dataset, call DescribeDataset.  Related APIs     CreateDatasetGroup     ListDatasets     DescribeDataset     DeleteDataset   
   */
  createDataset(params: Personalize.Types.CreateDatasetRequest, callback?: (err: AWSError, data: Personalize.Types.CreateDatasetResponse) => void): Request<Personalize.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates an empty dataset and adds it to the specified dataset group. Use CreateDatasetImportJob to import your training data to a dataset. There are three types of datasets:   Interactions   Items   Users   Each dataset type has an associated schema with required field types. Only the Interactions dataset is required in order to train a model (also referred to as creating a solution). A dataset can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the status of the dataset, call DescribeDataset.  Related APIs     CreateDatasetGroup     ListDatasets     DescribeDataset     DeleteDataset   
   */
  createDataset(callback?: (err: AWSError, data: Personalize.Types.CreateDatasetResponse) => void): Request<Personalize.Types.CreateDatasetResponse, AWSError>;
  /**
   *  Creates a job that exports data from your dataset to an Amazon S3 bucket. To allow Amazon Personalize to export the training data, you must specify an service-linked IAM role that gives Amazon Personalize PutObject permissions for your Amazon S3 bucket. For information, see Exporting a dataset in the Amazon Personalize developer guide.   Status  A dataset export job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED    To get the status of the export job, call DescribeDatasetExportJob, and specify the Amazon Resource Name (ARN) of the dataset export job. The dataset export is complete when the status shows as ACTIVE. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the job failed. 
   */
  createDatasetExportJob(params: Personalize.Types.CreateDatasetExportJobRequest, callback?: (err: AWSError, data: Personalize.Types.CreateDatasetExportJobResponse) => void): Request<Personalize.Types.CreateDatasetExportJobResponse, AWSError>;
  /**
   *  Creates a job that exports data from your dataset to an Amazon S3 bucket. To allow Amazon Personalize to export the training data, you must specify an service-linked IAM role that gives Amazon Personalize PutObject permissions for your Amazon S3 bucket. For information, see Exporting a dataset in the Amazon Personalize developer guide.   Status  A dataset export job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED    To get the status of the export job, call DescribeDatasetExportJob, and specify the Amazon Resource Name (ARN) of the dataset export job. The dataset export is complete when the status shows as ACTIVE. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the job failed. 
   */
  createDatasetExportJob(callback?: (err: AWSError, data: Personalize.Types.CreateDatasetExportJobResponse) => void): Request<Personalize.Types.CreateDatasetExportJobResponse, AWSError>;
  /**
   * Creates an empty dataset group. A dataset group is a container for Amazon Personalize resources. A dataset group can contain at most three datasets, one for each type of dataset:   Interactions   Items   Users    A dataset group can be a Domain dataset group, where you specify a domain and use pre-configured resources like recommenders, or a Custom dataset group, where you use custom resources, such as a solution with a solution version, that you deploy with a campaign. If you start with a Domain dataset group, you can still add custom resources such as solutions and solution versions trained with recipes for custom use cases and deployed with campaigns.  A dataset group can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING   To get the status of the dataset group, call DescribeDatasetGroup. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the creation failed.  You must wait until the status of the dataset group is ACTIVE before adding a dataset to the group.  You can specify an Key Management Service (KMS) key to encrypt the datasets in the group. If you specify a KMS key, you must also include an Identity and Access Management (IAM) role that has permission to access the key.  APIs that require a dataset group ARN in the request     CreateDataset     CreateEventTracker     CreateSolution     Related APIs     ListDatasetGroups     DescribeDatasetGroup     DeleteDatasetGroup   
   */
  createDatasetGroup(params: Personalize.Types.CreateDatasetGroupRequest, callback?: (err: AWSError, data: Personalize.Types.CreateDatasetGroupResponse) => void): Request<Personalize.Types.CreateDatasetGroupResponse, AWSError>;
  /**
   * Creates an empty dataset group. A dataset group is a container for Amazon Personalize resources. A dataset group can contain at most three datasets, one for each type of dataset:   Interactions   Items   Users    A dataset group can be a Domain dataset group, where you specify a domain and use pre-configured resources like recommenders, or a Custom dataset group, where you use custom resources, such as a solution with a solution version, that you deploy with a campaign. If you start with a Domain dataset group, you can still add custom resources such as solutions and solution versions trained with recipes for custom use cases and deployed with campaigns.  A dataset group can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING   To get the status of the dataset group, call DescribeDatasetGroup. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the creation failed.  You must wait until the status of the dataset group is ACTIVE before adding a dataset to the group.  You can specify an Key Management Service (KMS) key to encrypt the datasets in the group. If you specify a KMS key, you must also include an Identity and Access Management (IAM) role that has permission to access the key.  APIs that require a dataset group ARN in the request     CreateDataset     CreateEventTracker     CreateSolution     Related APIs     ListDatasetGroups     DescribeDatasetGroup     DeleteDatasetGroup   
   */
  createDatasetGroup(callback?: (err: AWSError, data: Personalize.Types.CreateDatasetGroupResponse) => void): Request<Personalize.Types.CreateDatasetGroupResponse, AWSError>;
  /**
   * Creates a job that imports training data from your data source (an Amazon S3 bucket) to an Amazon Personalize dataset. To allow Amazon Personalize to import the training data, you must specify an IAM service role that has permission to read from the data source, as Amazon Personalize makes a copy of your data and processes it internally. For information on granting access to your Amazon S3 bucket, see Giving Amazon Personalize Access to Amazon S3 Resources.   By default, a dataset import job replaces any existing data in the dataset that you imported in bulk. To add new records without replacing existing data, specify INCREMENTAL for the import mode in the CreateDatasetImportJob operation.   Status  A dataset import job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   To get the status of the import job, call DescribeDatasetImportJob, providing the Amazon Resource Name (ARN) of the dataset import job. The dataset import is complete when the status shows as ACTIVE. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the job failed.  Importing takes time. You must wait until the status shows as ACTIVE before training a model using the dataset.   Related APIs     ListDatasetImportJobs     DescribeDatasetImportJob   
   */
  createDatasetImportJob(params: Personalize.Types.CreateDatasetImportJobRequest, callback?: (err: AWSError, data: Personalize.Types.CreateDatasetImportJobResponse) => void): Request<Personalize.Types.CreateDatasetImportJobResponse, AWSError>;
  /**
   * Creates a job that imports training data from your data source (an Amazon S3 bucket) to an Amazon Personalize dataset. To allow Amazon Personalize to import the training data, you must specify an IAM service role that has permission to read from the data source, as Amazon Personalize makes a copy of your data and processes it internally. For information on granting access to your Amazon S3 bucket, see Giving Amazon Personalize Access to Amazon S3 Resources.   By default, a dataset import job replaces any existing data in the dataset that you imported in bulk. To add new records without replacing existing data, specify INCREMENTAL for the import mode in the CreateDatasetImportJob operation.   Status  A dataset import job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   To get the status of the import job, call DescribeDatasetImportJob, providing the Amazon Resource Name (ARN) of the dataset import job. The dataset import is complete when the status shows as ACTIVE. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the job failed.  Importing takes time. You must wait until the status shows as ACTIVE before training a model using the dataset.   Related APIs     ListDatasetImportJobs     DescribeDatasetImportJob   
   */
  createDatasetImportJob(callback?: (err: AWSError, data: Personalize.Types.CreateDatasetImportJobResponse) => void): Request<Personalize.Types.CreateDatasetImportJobResponse, AWSError>;
  /**
   * Creates an event tracker that you use when adding event data to a specified dataset group using the PutEvents API.  Only one event tracker can be associated with a dataset group. You will get an error if you call CreateEventTracker using the same dataset group as an existing event tracker.  When you create an event tracker, the response includes a tracking ID, which you pass as a parameter when you use the PutEvents operation. Amazon Personalize then appends the event data to the Interactions dataset of the dataset group you specify in your event tracker.  The event tracker can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the status of the event tracker, call DescribeEventTracker.  The event tracker must be in the ACTIVE state before using the tracking ID.   Related APIs     ListEventTrackers     DescribeEventTracker     DeleteEventTracker   
   */
  createEventTracker(params: Personalize.Types.CreateEventTrackerRequest, callback?: (err: AWSError, data: Personalize.Types.CreateEventTrackerResponse) => void): Request<Personalize.Types.CreateEventTrackerResponse, AWSError>;
  /**
   * Creates an event tracker that you use when adding event data to a specified dataset group using the PutEvents API.  Only one event tracker can be associated with a dataset group. You will get an error if you call CreateEventTracker using the same dataset group as an existing event tracker.  When you create an event tracker, the response includes a tracking ID, which you pass as a parameter when you use the PutEvents operation. Amazon Personalize then appends the event data to the Interactions dataset of the dataset group you specify in your event tracker.  The event tracker can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the status of the event tracker, call DescribeEventTracker.  The event tracker must be in the ACTIVE state before using the tracking ID.   Related APIs     ListEventTrackers     DescribeEventTracker     DeleteEventTracker   
   */
  createEventTracker(callback?: (err: AWSError, data: Personalize.Types.CreateEventTrackerResponse) => void): Request<Personalize.Types.CreateEventTrackerResponse, AWSError>;
  /**
   * Creates a recommendation filter. For more information, see Filtering recommendations and user segments.
   */
  createFilter(params: Personalize.Types.CreateFilterRequest, callback?: (err: AWSError, data: Personalize.Types.CreateFilterResponse) => void): Request<Personalize.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a recommendation filter. For more information, see Filtering recommendations and user segments.
   */
  createFilter(callback?: (err: AWSError, data: Personalize.Types.CreateFilterResponse) => void): Request<Personalize.Types.CreateFilterResponse, AWSError>;
  /**
   * Creates a metric attribution. A metric attribution creates reports on the data that you import into Amazon Personalize. Depending on how you imported the data, you can view reports in Amazon CloudWatch or Amazon S3. For more information, see Measuring impact of recommendations.
   */
  createMetricAttribution(params: Personalize.Types.CreateMetricAttributionRequest, callback?: (err: AWSError, data: Personalize.Types.CreateMetricAttributionResponse) => void): Request<Personalize.Types.CreateMetricAttributionResponse, AWSError>;
  /**
   * Creates a metric attribution. A metric attribution creates reports on the data that you import into Amazon Personalize. Depending on how you imported the data, you can view reports in Amazon CloudWatch or Amazon S3. For more information, see Measuring impact of recommendations.
   */
  createMetricAttribution(callback?: (err: AWSError, data: Personalize.Types.CreateMetricAttributionResponse) => void): Request<Personalize.Types.CreateMetricAttributionResponse, AWSError>;
  /**
   * Creates a recommender with the recipe (a Domain dataset group use case) you specify. You create recommenders for a Domain dataset group and specify the recommender's Amazon Resource Name (ARN) when you make a GetRecommendations request.   Minimum recommendation requests per second   A high minRecommendationRequestsPerSecond will increase your bill. We recommend starting with 1 for minRecommendationRequestsPerSecond (the default). Track your usage using Amazon CloudWatch metrics, and increase the minRecommendationRequestsPerSecond as necessary.  When you create a recommender, you can configure the recommender's minimum recommendation requests per second. The minimum recommendation requests per second (minRecommendationRequestsPerSecond) specifies the baseline recommendation request throughput provisioned by Amazon Personalize. The default minRecommendationRequestsPerSecond is 1. A recommendation request is a single GetRecommendations operation. Request throughput is measured in requests per second and Amazon Personalize uses your requests per second to derive your requests per hour and the price of your recommender usage.   If your requests per second increases beyond minRecommendationRequestsPerSecond, Amazon Personalize auto-scales the provisioned capacity up and down, but never below minRecommendationRequestsPerSecond. There's a short time delay while the capacity is increased that might cause loss of requests.  Your bill is the greater of either the minimum requests per hour (based on minRecommendationRequestsPerSecond) or the actual number of requests. The actual request throughput used is calculated as the average requests/second within a one-hour window. We recommend starting with the default minRecommendationRequestsPerSecond, track your usage using Amazon CloudWatch metrics, and then increase the minRecommendationRequestsPerSecond as necessary.   Status  A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the recommender status, call DescribeRecommender.  Wait until the status of the recommender is ACTIVE before asking the recommender for recommendations.   Related APIs     ListRecommenders     DescribeRecommender     UpdateRecommender     DeleteRecommender   
   */
  createRecommender(params: Personalize.Types.CreateRecommenderRequest, callback?: (err: AWSError, data: Personalize.Types.CreateRecommenderResponse) => void): Request<Personalize.Types.CreateRecommenderResponse, AWSError>;
  /**
   * Creates a recommender with the recipe (a Domain dataset group use case) you specify. You create recommenders for a Domain dataset group and specify the recommender's Amazon Resource Name (ARN) when you make a GetRecommendations request.   Minimum recommendation requests per second   A high minRecommendationRequestsPerSecond will increase your bill. We recommend starting with 1 for minRecommendationRequestsPerSecond (the default). Track your usage using Amazon CloudWatch metrics, and increase the minRecommendationRequestsPerSecond as necessary.  When you create a recommender, you can configure the recommender's minimum recommendation requests per second. The minimum recommendation requests per second (minRecommendationRequestsPerSecond) specifies the baseline recommendation request throughput provisioned by Amazon Personalize. The default minRecommendationRequestsPerSecond is 1. A recommendation request is a single GetRecommendations operation. Request throughput is measured in requests per second and Amazon Personalize uses your requests per second to derive your requests per hour and the price of your recommender usage.   If your requests per second increases beyond minRecommendationRequestsPerSecond, Amazon Personalize auto-scales the provisioned capacity up and down, but never below minRecommendationRequestsPerSecond. There's a short time delay while the capacity is increased that might cause loss of requests.  Your bill is the greater of either the minimum requests per hour (based on minRecommendationRequestsPerSecond) or the actual number of requests. The actual request throughput used is calculated as the average requests/second within a one-hour window. We recommend starting with the default minRecommendationRequestsPerSecond, track your usage using Amazon CloudWatch metrics, and then increase the minRecommendationRequestsPerSecond as necessary.   Status  A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the recommender status, call DescribeRecommender.  Wait until the status of the recommender is ACTIVE before asking the recommender for recommendations.   Related APIs     ListRecommenders     DescribeRecommender     UpdateRecommender     DeleteRecommender   
   */
  createRecommender(callback?: (err: AWSError, data: Personalize.Types.CreateRecommenderResponse) => void): Request<Personalize.Types.CreateRecommenderResponse, AWSError>;
  /**
   * Creates an Amazon Personalize schema from the specified schema string. The schema you create must be in Avro JSON format. Amazon Personalize recognizes three schema variants. Each schema is associated with a dataset type and has a set of required field and keywords. If you are creating a schema for a dataset in a Domain dataset group, you provide the domain of the Domain dataset group. You specify a schema when you call CreateDataset.  Related APIs     ListSchemas     DescribeSchema     DeleteSchema   
   */
  createSchema(params: Personalize.Types.CreateSchemaRequest, callback?: (err: AWSError, data: Personalize.Types.CreateSchemaResponse) => void): Request<Personalize.Types.CreateSchemaResponse, AWSError>;
  /**
   * Creates an Amazon Personalize schema from the specified schema string. The schema you create must be in Avro JSON format. Amazon Personalize recognizes three schema variants. Each schema is associated with a dataset type and has a set of required field and keywords. If you are creating a schema for a dataset in a Domain dataset group, you provide the domain of the Domain dataset group. You specify a schema when you call CreateDataset.  Related APIs     ListSchemas     DescribeSchema     DeleteSchema   
   */
  createSchema(callback?: (err: AWSError, data: Personalize.Types.CreateSchemaResponse) => void): Request<Personalize.Types.CreateSchemaResponse, AWSError>;
  /**
   * Creates the configuration for training a model. A trained model is known as a solution version. After the configuration is created, you train the model (create a solution version) by calling the CreateSolutionVersion operation. Every time you call CreateSolutionVersion, a new version of the solution is created. After creating a solution version, you check its accuracy by calling GetSolutionMetrics. When you are satisfied with the version, you deploy it using CreateCampaign. The campaign provides recommendations to a client through the GetRecommendations API. To train a model, Amazon Personalize requires training data and a recipe. The training data comes from the dataset group that you provide in the request. A recipe specifies the training algorithm and a feature transformation. You can specify one of the predefined recipes provided by Amazon Personalize.   Amazon Personalize doesn't support configuring the hpoObjective for solution hyperparameter optimization at this time.   Status  A solution can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the status of the solution, call DescribeSolution. Wait until the status shows as ACTIVE before calling CreateSolutionVersion.  Related APIs     ListSolutions     CreateSolutionVersion     DescribeSolution     DeleteSolution       ListSolutionVersions     DescribeSolutionVersion   
   */
  createSolution(params: Personalize.Types.CreateSolutionRequest, callback?: (err: AWSError, data: Personalize.Types.CreateSolutionResponse) => void): Request<Personalize.Types.CreateSolutionResponse, AWSError>;
  /**
   * Creates the configuration for training a model. A trained model is known as a solution version. After the configuration is created, you train the model (create a solution version) by calling the CreateSolutionVersion operation. Every time you call CreateSolutionVersion, a new version of the solution is created. After creating a solution version, you check its accuracy by calling GetSolutionMetrics. When you are satisfied with the version, you deploy it using CreateCampaign. The campaign provides recommendations to a client through the GetRecommendations API. To train a model, Amazon Personalize requires training data and a recipe. The training data comes from the dataset group that you provide in the request. A recipe specifies the training algorithm and a feature transformation. You can specify one of the predefined recipes provided by Amazon Personalize.   Amazon Personalize doesn't support configuring the hpoObjective for solution hyperparameter optimization at this time.   Status  A solution can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   To get the status of the solution, call DescribeSolution. Wait until the status shows as ACTIVE before calling CreateSolutionVersion.  Related APIs     ListSolutions     CreateSolutionVersion     DescribeSolution     DeleteSolution       ListSolutionVersions     DescribeSolutionVersion   
   */
  createSolution(callback?: (err: AWSError, data: Personalize.Types.CreateSolutionResponse) => void): Request<Personalize.Types.CreateSolutionResponse, AWSError>;
  /**
   * Trains or retrains an active solution in a Custom dataset group. A solution is created using the CreateSolution operation and must be in the ACTIVE state before calling CreateSolutionVersion. A new version of the solution is created every time you call this operation.  Status  A solution version can be in one of the following states:   CREATE PENDING   CREATE IN_PROGRESS   ACTIVE   CREATE FAILED   CREATE STOPPING   CREATE STOPPED   To get the status of the version, call DescribeSolutionVersion. Wait until the status shows as ACTIVE before calling CreateCampaign. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the job failed.  Related APIs     ListSolutionVersions     DescribeSolutionVersion     ListSolutions     CreateSolution     DescribeSolution     DeleteSolution   
   */
  createSolutionVersion(params: Personalize.Types.CreateSolutionVersionRequest, callback?: (err: AWSError, data: Personalize.Types.CreateSolutionVersionResponse) => void): Request<Personalize.Types.CreateSolutionVersionResponse, AWSError>;
  /**
   * Trains or retrains an active solution in a Custom dataset group. A solution is created using the CreateSolution operation and must be in the ACTIVE state before calling CreateSolutionVersion. A new version of the solution is created every time you call this operation.  Status  A solution version can be in one of the following states:   CREATE PENDING   CREATE IN_PROGRESS   ACTIVE   CREATE FAILED   CREATE STOPPING   CREATE STOPPED   To get the status of the version, call DescribeSolutionVersion. Wait until the status shows as ACTIVE before calling CreateCampaign. If the status shows as CREATE FAILED, the response includes a failureReason key, which describes why the job failed.  Related APIs     ListSolutionVersions     DescribeSolutionVersion     ListSolutions     CreateSolution     DescribeSolution     DeleteSolution   
   */
  createSolutionVersion(callback?: (err: AWSError, data: Personalize.Types.CreateSolutionVersionResponse) => void): Request<Personalize.Types.CreateSolutionVersionResponse, AWSError>;
  /**
   * Removes a campaign by deleting the solution deployment. The solution that the campaign is based on is not deleted and can be redeployed when needed. A deleted campaign can no longer be specified in a GetRecommendations request. For information on creating campaigns, see CreateCampaign.
   */
  deleteCampaign(params: Personalize.Types.DeleteCampaignRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a campaign by deleting the solution deployment. The solution that the campaign is based on is not deleted and can be redeployed when needed. A deleted campaign can no longer be specified in a GetRecommendations request. For information on creating campaigns, see CreateCampaign.
   */
  deleteCampaign(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset. You can't delete a dataset if an associated DatasetImportJob or SolutionVersion is in the CREATE PENDING or IN PROGRESS state. For more information on datasets, see CreateDataset.
   */
  deleteDataset(params: Personalize.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset. You can't delete a dataset if an associated DatasetImportJob or SolutionVersion is in the CREATE PENDING or IN PROGRESS state. For more information on datasets, see CreateDataset.
   */
  deleteDataset(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset group. Before you delete a dataset group, you must delete the following:   All associated event trackers.   All associated solutions.   All datasets in the dataset group.  
   */
  deleteDatasetGroup(params: Personalize.Types.DeleteDatasetGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset group. Before you delete a dataset group, you must delete the following:   All associated event trackers.   All associated solutions.   All datasets in the dataset group.  
   */
  deleteDatasetGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the event tracker. Does not delete the event-interactions dataset from the associated dataset group. For more information on event trackers, see CreateEventTracker.
   */
  deleteEventTracker(params: Personalize.Types.DeleteEventTrackerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the event tracker. Does not delete the event-interactions dataset from the associated dataset group. For more information on event trackers, see CreateEventTracker.
   */
  deleteEventTracker(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a filter.
   */
  deleteFilter(params: Personalize.Types.DeleteFilterRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a filter.
   */
  deleteFilter(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a metric attribution.
   */
  deleteMetricAttribution(params: Personalize.Types.DeleteMetricAttributionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a metric attribution.
   */
  deleteMetricAttribution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deactivates and removes a recommender. A deleted recommender can no longer be specified in a GetRecommendations request.
   */
  deleteRecommender(params: Personalize.Types.DeleteRecommenderRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deactivates and removes a recommender. A deleted recommender can no longer be specified in a GetRecommendations request.
   */
  deleteRecommender(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a schema. Before deleting a schema, you must delete all datasets referencing the schema. For more information on schemas, see CreateSchema.
   */
  deleteSchema(params: Personalize.Types.DeleteSchemaRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a schema. Before deleting a schema, you must delete all datasets referencing the schema. For more information on schemas, see CreateSchema.
   */
  deleteSchema(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes all versions of a solution and the Solution object itself. Before deleting a solution, you must delete all campaigns based on the solution. To determine what campaigns are using the solution, call ListCampaigns and supply the Amazon Resource Name (ARN) of the solution. You can't delete a solution if an associated SolutionVersion is in the CREATE PENDING or IN PROGRESS state. For more information on solutions, see CreateSolution.
   */
  deleteSolution(params: Personalize.Types.DeleteSolutionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes all versions of a solution and the Solution object itself. Before deleting a solution, you must delete all campaigns based on the solution. To determine what campaigns are using the solution, call ListCampaigns and supply the Amazon Resource Name (ARN) of the solution. You can't delete a solution if an associated SolutionVersion is in the CREATE PENDING or IN PROGRESS state. For more information on solutions, see CreateSolution.
   */
  deleteSolution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes the given algorithm.
   */
  describeAlgorithm(params: Personalize.Types.DescribeAlgorithmRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeAlgorithmResponse) => void): Request<Personalize.Types.DescribeAlgorithmResponse, AWSError>;
  /**
   * Describes the given algorithm.
   */
  describeAlgorithm(callback?: (err: AWSError, data: Personalize.Types.DescribeAlgorithmResponse) => void): Request<Personalize.Types.DescribeAlgorithmResponse, AWSError>;
  /**
   * Gets the properties of a batch inference job including name, Amazon Resource Name (ARN), status, input and output configurations, and the ARN of the solution version used to generate the recommendations.
   */
  describeBatchInferenceJob(params: Personalize.Types.DescribeBatchInferenceJobRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeBatchInferenceJobResponse) => void): Request<Personalize.Types.DescribeBatchInferenceJobResponse, AWSError>;
  /**
   * Gets the properties of a batch inference job including name, Amazon Resource Name (ARN), status, input and output configurations, and the ARN of the solution version used to generate the recommendations.
   */
  describeBatchInferenceJob(callback?: (err: AWSError, data: Personalize.Types.DescribeBatchInferenceJobResponse) => void): Request<Personalize.Types.DescribeBatchInferenceJobResponse, AWSError>;
  /**
   * Gets the properties of a batch segment job including name, Amazon Resource Name (ARN), status, input and output configurations, and the ARN of the solution version used to generate segments.
   */
  describeBatchSegmentJob(params: Personalize.Types.DescribeBatchSegmentJobRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeBatchSegmentJobResponse) => void): Request<Personalize.Types.DescribeBatchSegmentJobResponse, AWSError>;
  /**
   * Gets the properties of a batch segment job including name, Amazon Resource Name (ARN), status, input and output configurations, and the ARN of the solution version used to generate segments.
   */
  describeBatchSegmentJob(callback?: (err: AWSError, data: Personalize.Types.DescribeBatchSegmentJobResponse) => void): Request<Personalize.Types.DescribeBatchSegmentJobResponse, AWSError>;
  /**
   * Describes the given campaign, including its status. A campaign can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   When the status is CREATE FAILED, the response includes the failureReason key, which describes why. For more information on campaigns, see CreateCampaign.
   */
  describeCampaign(params: Personalize.Types.DescribeCampaignRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeCampaignResponse) => void): Request<Personalize.Types.DescribeCampaignResponse, AWSError>;
  /**
   * Describes the given campaign, including its status. A campaign can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS   When the status is CREATE FAILED, the response includes the failureReason key, which describes why. For more information on campaigns, see CreateCampaign.
   */
  describeCampaign(callback?: (err: AWSError, data: Personalize.Types.DescribeCampaignResponse) => void): Request<Personalize.Types.DescribeCampaignResponse, AWSError>;
  /**
   * Describes the given dataset. For more information on datasets, see CreateDataset.
   */
  describeDataset(params: Personalize.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetResponse) => void): Request<Personalize.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Describes the given dataset. For more information on datasets, see CreateDataset.
   */
  describeDataset(callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetResponse) => void): Request<Personalize.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Describes the dataset export job created by CreateDatasetExportJob, including the export job status.
   */
  describeDatasetExportJob(params: Personalize.Types.DescribeDatasetExportJobRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetExportJobResponse) => void): Request<Personalize.Types.DescribeDatasetExportJobResponse, AWSError>;
  /**
   * Describes the dataset export job created by CreateDatasetExportJob, including the export job status.
   */
  describeDatasetExportJob(callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetExportJobResponse) => void): Request<Personalize.Types.DescribeDatasetExportJobResponse, AWSError>;
  /**
   * Describes the given dataset group. For more information on dataset groups, see CreateDatasetGroup.
   */
  describeDatasetGroup(params: Personalize.Types.DescribeDatasetGroupRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetGroupResponse) => void): Request<Personalize.Types.DescribeDatasetGroupResponse, AWSError>;
  /**
   * Describes the given dataset group. For more information on dataset groups, see CreateDatasetGroup.
   */
  describeDatasetGroup(callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetGroupResponse) => void): Request<Personalize.Types.DescribeDatasetGroupResponse, AWSError>;
  /**
   * Describes the dataset import job created by CreateDatasetImportJob, including the import job status.
   */
  describeDatasetImportJob(params: Personalize.Types.DescribeDatasetImportJobRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetImportJobResponse) => void): Request<Personalize.Types.DescribeDatasetImportJobResponse, AWSError>;
  /**
   * Describes the dataset import job created by CreateDatasetImportJob, including the import job status.
   */
  describeDatasetImportJob(callback?: (err: AWSError, data: Personalize.Types.DescribeDatasetImportJobResponse) => void): Request<Personalize.Types.DescribeDatasetImportJobResponse, AWSError>;
  /**
   * Describes an event tracker. The response includes the trackingId and status of the event tracker. For more information on event trackers, see CreateEventTracker.
   */
  describeEventTracker(params: Personalize.Types.DescribeEventTrackerRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeEventTrackerResponse) => void): Request<Personalize.Types.DescribeEventTrackerResponse, AWSError>;
  /**
   * Describes an event tracker. The response includes the trackingId and status of the event tracker. For more information on event trackers, see CreateEventTracker.
   */
  describeEventTracker(callback?: (err: AWSError, data: Personalize.Types.DescribeEventTrackerResponse) => void): Request<Personalize.Types.DescribeEventTrackerResponse, AWSError>;
  /**
   * Describes the given feature transformation.
   */
  describeFeatureTransformation(params: Personalize.Types.DescribeFeatureTransformationRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeFeatureTransformationResponse) => void): Request<Personalize.Types.DescribeFeatureTransformationResponse, AWSError>;
  /**
   * Describes the given feature transformation.
   */
  describeFeatureTransformation(callback?: (err: AWSError, data: Personalize.Types.DescribeFeatureTransformationResponse) => void): Request<Personalize.Types.DescribeFeatureTransformationResponse, AWSError>;
  /**
   * Describes a filter's properties.
   */
  describeFilter(params: Personalize.Types.DescribeFilterRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeFilterResponse) => void): Request<Personalize.Types.DescribeFilterResponse, AWSError>;
  /**
   * Describes a filter's properties.
   */
  describeFilter(callback?: (err: AWSError, data: Personalize.Types.DescribeFilterResponse) => void): Request<Personalize.Types.DescribeFilterResponse, AWSError>;
  /**
   * Describes a metric attribution.
   */
  describeMetricAttribution(params: Personalize.Types.DescribeMetricAttributionRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeMetricAttributionResponse) => void): Request<Personalize.Types.DescribeMetricAttributionResponse, AWSError>;
  /**
   * Describes a metric attribution.
   */
  describeMetricAttribution(callback?: (err: AWSError, data: Personalize.Types.DescribeMetricAttributionResponse) => void): Request<Personalize.Types.DescribeMetricAttributionResponse, AWSError>;
  /**
   * Describes a recipe. A recipe contains three items:   An algorithm that trains a model.   Hyperparameters that govern the training.   Feature transformation information for modifying the input data before training.   Amazon Personalize provides a set of predefined recipes. You specify a recipe when you create a solution with the CreateSolution API. CreateSolution trains a model by using the algorithm in the specified recipe and a training dataset. The solution, when deployed as a campaign, can provide recommendations using the GetRecommendations API.
   */
  describeRecipe(params: Personalize.Types.DescribeRecipeRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeRecipeResponse) => void): Request<Personalize.Types.DescribeRecipeResponse, AWSError>;
  /**
   * Describes a recipe. A recipe contains three items:   An algorithm that trains a model.   Hyperparameters that govern the training.   Feature transformation information for modifying the input data before training.   Amazon Personalize provides a set of predefined recipes. You specify a recipe when you create a solution with the CreateSolution API. CreateSolution trains a model by using the algorithm in the specified recipe and a training dataset. The solution, when deployed as a campaign, can provide recommendations using the GetRecommendations API.
   */
  describeRecipe(callback?: (err: AWSError, data: Personalize.Types.DescribeRecipeResponse) => void): Request<Personalize.Types.DescribeRecipeResponse, AWSError>;
  /**
   * Describes the given recommender, including its status. A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS   When the status is CREATE FAILED, the response includes the failureReason key, which describes why. The modelMetrics key is null when the recommender is being created or deleted. For more information on recommenders, see CreateRecommender.
   */
  describeRecommender(params: Personalize.Types.DescribeRecommenderRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeRecommenderResponse) => void): Request<Personalize.Types.DescribeRecommenderResponse, AWSError>;
  /**
   * Describes the given recommender, including its status. A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS   When the status is CREATE FAILED, the response includes the failureReason key, which describes why. The modelMetrics key is null when the recommender is being created or deleted. For more information on recommenders, see CreateRecommender.
   */
  describeRecommender(callback?: (err: AWSError, data: Personalize.Types.DescribeRecommenderResponse) => void): Request<Personalize.Types.DescribeRecommenderResponse, AWSError>;
  /**
   * Describes a schema. For more information on schemas, see CreateSchema.
   */
  describeSchema(params: Personalize.Types.DescribeSchemaRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeSchemaResponse) => void): Request<Personalize.Types.DescribeSchemaResponse, AWSError>;
  /**
   * Describes a schema. For more information on schemas, see CreateSchema.
   */
  describeSchema(callback?: (err: AWSError, data: Personalize.Types.DescribeSchemaResponse) => void): Request<Personalize.Types.DescribeSchemaResponse, AWSError>;
  /**
   * Describes a solution. For more information on solutions, see CreateSolution.
   */
  describeSolution(params: Personalize.Types.DescribeSolutionRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeSolutionResponse) => void): Request<Personalize.Types.DescribeSolutionResponse, AWSError>;
  /**
   * Describes a solution. For more information on solutions, see CreateSolution.
   */
  describeSolution(callback?: (err: AWSError, data: Personalize.Types.DescribeSolutionResponse) => void): Request<Personalize.Types.DescribeSolutionResponse, AWSError>;
  /**
   * Describes a specific version of a solution. For more information on solutions, see CreateSolution 
   */
  describeSolutionVersion(params: Personalize.Types.DescribeSolutionVersionRequest, callback?: (err: AWSError, data: Personalize.Types.DescribeSolutionVersionResponse) => void): Request<Personalize.Types.DescribeSolutionVersionResponse, AWSError>;
  /**
   * Describes a specific version of a solution. For more information on solutions, see CreateSolution 
   */
  describeSolutionVersion(callback?: (err: AWSError, data: Personalize.Types.DescribeSolutionVersionResponse) => void): Request<Personalize.Types.DescribeSolutionVersionResponse, AWSError>;
  /**
   * Gets the metrics for the specified solution version.
   */
  getSolutionMetrics(params: Personalize.Types.GetSolutionMetricsRequest, callback?: (err: AWSError, data: Personalize.Types.GetSolutionMetricsResponse) => void): Request<Personalize.Types.GetSolutionMetricsResponse, AWSError>;
  /**
   * Gets the metrics for the specified solution version.
   */
  getSolutionMetrics(callback?: (err: AWSError, data: Personalize.Types.GetSolutionMetricsResponse) => void): Request<Personalize.Types.GetSolutionMetricsResponse, AWSError>;
  /**
   * Gets a list of the batch inference jobs that have been performed off of a solution version.
   */
  listBatchInferenceJobs(params: Personalize.Types.ListBatchInferenceJobsRequest, callback?: (err: AWSError, data: Personalize.Types.ListBatchInferenceJobsResponse) => void): Request<Personalize.Types.ListBatchInferenceJobsResponse, AWSError>;
  /**
   * Gets a list of the batch inference jobs that have been performed off of a solution version.
   */
  listBatchInferenceJobs(callback?: (err: AWSError, data: Personalize.Types.ListBatchInferenceJobsResponse) => void): Request<Personalize.Types.ListBatchInferenceJobsResponse, AWSError>;
  /**
   * Gets a list of the batch segment jobs that have been performed off of a solution version that you specify.
   */
  listBatchSegmentJobs(params: Personalize.Types.ListBatchSegmentJobsRequest, callback?: (err: AWSError, data: Personalize.Types.ListBatchSegmentJobsResponse) => void): Request<Personalize.Types.ListBatchSegmentJobsResponse, AWSError>;
  /**
   * Gets a list of the batch segment jobs that have been performed off of a solution version that you specify.
   */
  listBatchSegmentJobs(callback?: (err: AWSError, data: Personalize.Types.ListBatchSegmentJobsResponse) => void): Request<Personalize.Types.ListBatchSegmentJobsResponse, AWSError>;
  /**
   * Returns a list of campaigns that use the given solution. When a solution is not specified, all the campaigns associated with the account are listed. The response provides the properties for each campaign, including the Amazon Resource Name (ARN). For more information on campaigns, see CreateCampaign.
   */
  listCampaigns(params: Personalize.Types.ListCampaignsRequest, callback?: (err: AWSError, data: Personalize.Types.ListCampaignsResponse) => void): Request<Personalize.Types.ListCampaignsResponse, AWSError>;
  /**
   * Returns a list of campaigns that use the given solution. When a solution is not specified, all the campaigns associated with the account are listed. The response provides the properties for each campaign, including the Amazon Resource Name (ARN). For more information on campaigns, see CreateCampaign.
   */
  listCampaigns(callback?: (err: AWSError, data: Personalize.Types.ListCampaignsResponse) => void): Request<Personalize.Types.ListCampaignsResponse, AWSError>;
  /**
   * Returns a list of dataset export jobs that use the given dataset. When a dataset is not specified, all the dataset export jobs associated with the account are listed. The response provides the properties for each dataset export job, including the Amazon Resource Name (ARN). For more information on dataset export jobs, see CreateDatasetExportJob. For more information on datasets, see CreateDataset.
   */
  listDatasetExportJobs(params: Personalize.Types.ListDatasetExportJobsRequest, callback?: (err: AWSError, data: Personalize.Types.ListDatasetExportJobsResponse) => void): Request<Personalize.Types.ListDatasetExportJobsResponse, AWSError>;
  /**
   * Returns a list of dataset export jobs that use the given dataset. When a dataset is not specified, all the dataset export jobs associated with the account are listed. The response provides the properties for each dataset export job, including the Amazon Resource Name (ARN). For more information on dataset export jobs, see CreateDatasetExportJob. For more information on datasets, see CreateDataset.
   */
  listDatasetExportJobs(callback?: (err: AWSError, data: Personalize.Types.ListDatasetExportJobsResponse) => void): Request<Personalize.Types.ListDatasetExportJobsResponse, AWSError>;
  /**
   * Returns a list of dataset groups. The response provides the properties for each dataset group, including the Amazon Resource Name (ARN). For more information on dataset groups, see CreateDatasetGroup.
   */
  listDatasetGroups(params: Personalize.Types.ListDatasetGroupsRequest, callback?: (err: AWSError, data: Personalize.Types.ListDatasetGroupsResponse) => void): Request<Personalize.Types.ListDatasetGroupsResponse, AWSError>;
  /**
   * Returns a list of dataset groups. The response provides the properties for each dataset group, including the Amazon Resource Name (ARN). For more information on dataset groups, see CreateDatasetGroup.
   */
  listDatasetGroups(callback?: (err: AWSError, data: Personalize.Types.ListDatasetGroupsResponse) => void): Request<Personalize.Types.ListDatasetGroupsResponse, AWSError>;
  /**
   * Returns a list of dataset import jobs that use the given dataset. When a dataset is not specified, all the dataset import jobs associated with the account are listed. The response provides the properties for each dataset import job, including the Amazon Resource Name (ARN). For more information on dataset import jobs, see CreateDatasetImportJob. For more information on datasets, see CreateDataset.
   */
  listDatasetImportJobs(params: Personalize.Types.ListDatasetImportJobsRequest, callback?: (err: AWSError, data: Personalize.Types.ListDatasetImportJobsResponse) => void): Request<Personalize.Types.ListDatasetImportJobsResponse, AWSError>;
  /**
   * Returns a list of dataset import jobs that use the given dataset. When a dataset is not specified, all the dataset import jobs associated with the account are listed. The response provides the properties for each dataset import job, including the Amazon Resource Name (ARN). For more information on dataset import jobs, see CreateDatasetImportJob. For more information on datasets, see CreateDataset.
   */
  listDatasetImportJobs(callback?: (err: AWSError, data: Personalize.Types.ListDatasetImportJobsResponse) => void): Request<Personalize.Types.ListDatasetImportJobsResponse, AWSError>;
  /**
   * Returns the list of datasets contained in the given dataset group. The response provides the properties for each dataset, including the Amazon Resource Name (ARN). For more information on datasets, see CreateDataset.
   */
  listDatasets(params: Personalize.Types.ListDatasetsRequest, callback?: (err: AWSError, data: Personalize.Types.ListDatasetsResponse) => void): Request<Personalize.Types.ListDatasetsResponse, AWSError>;
  /**
   * Returns the list of datasets contained in the given dataset group. The response provides the properties for each dataset, including the Amazon Resource Name (ARN). For more information on datasets, see CreateDataset.
   */
  listDatasets(callback?: (err: AWSError, data: Personalize.Types.ListDatasetsResponse) => void): Request<Personalize.Types.ListDatasetsResponse, AWSError>;
  /**
   * Returns the list of event trackers associated with the account. The response provides the properties for each event tracker, including the Amazon Resource Name (ARN) and tracking ID. For more information on event trackers, see CreateEventTracker.
   */
  listEventTrackers(params: Personalize.Types.ListEventTrackersRequest, callback?: (err: AWSError, data: Personalize.Types.ListEventTrackersResponse) => void): Request<Personalize.Types.ListEventTrackersResponse, AWSError>;
  /**
   * Returns the list of event trackers associated with the account. The response provides the properties for each event tracker, including the Amazon Resource Name (ARN) and tracking ID. For more information on event trackers, see CreateEventTracker.
   */
  listEventTrackers(callback?: (err: AWSError, data: Personalize.Types.ListEventTrackersResponse) => void): Request<Personalize.Types.ListEventTrackersResponse, AWSError>;
  /**
   * Lists all filters that belong to a given dataset group.
   */
  listFilters(params: Personalize.Types.ListFiltersRequest, callback?: (err: AWSError, data: Personalize.Types.ListFiltersResponse) => void): Request<Personalize.Types.ListFiltersResponse, AWSError>;
  /**
   * Lists all filters that belong to a given dataset group.
   */
  listFilters(callback?: (err: AWSError, data: Personalize.Types.ListFiltersResponse) => void): Request<Personalize.Types.ListFiltersResponse, AWSError>;
  /**
   * Lists the metrics for the metric attribution.
   */
  listMetricAttributionMetrics(params: Personalize.Types.ListMetricAttributionMetricsRequest, callback?: (err: AWSError, data: Personalize.Types.ListMetricAttributionMetricsResponse) => void): Request<Personalize.Types.ListMetricAttributionMetricsResponse, AWSError>;
  /**
   * Lists the metrics for the metric attribution.
   */
  listMetricAttributionMetrics(callback?: (err: AWSError, data: Personalize.Types.ListMetricAttributionMetricsResponse) => void): Request<Personalize.Types.ListMetricAttributionMetricsResponse, AWSError>;
  /**
   * Lists metric attributions.
   */
  listMetricAttributions(params: Personalize.Types.ListMetricAttributionsRequest, callback?: (err: AWSError, data: Personalize.Types.ListMetricAttributionsResponse) => void): Request<Personalize.Types.ListMetricAttributionsResponse, AWSError>;
  /**
   * Lists metric attributions.
   */
  listMetricAttributions(callback?: (err: AWSError, data: Personalize.Types.ListMetricAttributionsResponse) => void): Request<Personalize.Types.ListMetricAttributionsResponse, AWSError>;
  /**
   * Returns a list of available recipes. The response provides the properties for each recipe, including the recipe's Amazon Resource Name (ARN).
   */
  listRecipes(params: Personalize.Types.ListRecipesRequest, callback?: (err: AWSError, data: Personalize.Types.ListRecipesResponse) => void): Request<Personalize.Types.ListRecipesResponse, AWSError>;
  /**
   * Returns a list of available recipes. The response provides the properties for each recipe, including the recipe's Amazon Resource Name (ARN).
   */
  listRecipes(callback?: (err: AWSError, data: Personalize.Types.ListRecipesResponse) => void): Request<Personalize.Types.ListRecipesResponse, AWSError>;
  /**
   * Returns a list of recommenders in a given Domain dataset group. When a Domain dataset group is not specified, all the recommenders associated with the account are listed. The response provides the properties for each recommender, including the Amazon Resource Name (ARN). For more information on recommenders, see CreateRecommender.
   */
  listRecommenders(params: Personalize.Types.ListRecommendersRequest, callback?: (err: AWSError, data: Personalize.Types.ListRecommendersResponse) => void): Request<Personalize.Types.ListRecommendersResponse, AWSError>;
  /**
   * Returns a list of recommenders in a given Domain dataset group. When a Domain dataset group is not specified, all the recommenders associated with the account are listed. The response provides the properties for each recommender, including the Amazon Resource Name (ARN). For more information on recommenders, see CreateRecommender.
   */
  listRecommenders(callback?: (err: AWSError, data: Personalize.Types.ListRecommendersResponse) => void): Request<Personalize.Types.ListRecommendersResponse, AWSError>;
  /**
   * Returns the list of schemas associated with the account. The response provides the properties for each schema, including the Amazon Resource Name (ARN). For more information on schemas, see CreateSchema.
   */
  listSchemas(params: Personalize.Types.ListSchemasRequest, callback?: (err: AWSError, data: Personalize.Types.ListSchemasResponse) => void): Request<Personalize.Types.ListSchemasResponse, AWSError>;
  /**
   * Returns the list of schemas associated with the account. The response provides the properties for each schema, including the Amazon Resource Name (ARN). For more information on schemas, see CreateSchema.
   */
  listSchemas(callback?: (err: AWSError, data: Personalize.Types.ListSchemasResponse) => void): Request<Personalize.Types.ListSchemasResponse, AWSError>;
  /**
   * Returns a list of solution versions for the given solution. When a solution is not specified, all the solution versions associated with the account are listed. The response provides the properties for each solution version, including the Amazon Resource Name (ARN).
   */
  listSolutionVersions(params: Personalize.Types.ListSolutionVersionsRequest, callback?: (err: AWSError, data: Personalize.Types.ListSolutionVersionsResponse) => void): Request<Personalize.Types.ListSolutionVersionsResponse, AWSError>;
  /**
   * Returns a list of solution versions for the given solution. When a solution is not specified, all the solution versions associated with the account are listed. The response provides the properties for each solution version, including the Amazon Resource Name (ARN).
   */
  listSolutionVersions(callback?: (err: AWSError, data: Personalize.Types.ListSolutionVersionsResponse) => void): Request<Personalize.Types.ListSolutionVersionsResponse, AWSError>;
  /**
   * Returns a list of solutions that use the given dataset group. When a dataset group is not specified, all the solutions associated with the account are listed. The response provides the properties for each solution, including the Amazon Resource Name (ARN). For more information on solutions, see CreateSolution.
   */
  listSolutions(params: Personalize.Types.ListSolutionsRequest, callback?: (err: AWSError, data: Personalize.Types.ListSolutionsResponse) => void): Request<Personalize.Types.ListSolutionsResponse, AWSError>;
  /**
   * Returns a list of solutions that use the given dataset group. When a dataset group is not specified, all the solutions associated with the account are listed. The response provides the properties for each solution, including the Amazon Resource Name (ARN). For more information on solutions, see CreateSolution.
   */
  listSolutions(callback?: (err: AWSError, data: Personalize.Types.ListSolutionsResponse) => void): Request<Personalize.Types.ListSolutionsResponse, AWSError>;
  /**
   * Get a list of tags attached to a resource.
   */
  listTagsForResource(params: Personalize.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Personalize.Types.ListTagsForResourceResponse) => void): Request<Personalize.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Get a list of tags attached to a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Personalize.Types.ListTagsForResourceResponse) => void): Request<Personalize.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Starts a recommender that is INACTIVE. Starting a recommender does not create any new models, but resumes billing and automatic retraining for the recommender.
   */
  startRecommender(params: Personalize.Types.StartRecommenderRequest, callback?: (err: AWSError, data: Personalize.Types.StartRecommenderResponse) => void): Request<Personalize.Types.StartRecommenderResponse, AWSError>;
  /**
   * Starts a recommender that is INACTIVE. Starting a recommender does not create any new models, but resumes billing and automatic retraining for the recommender.
   */
  startRecommender(callback?: (err: AWSError, data: Personalize.Types.StartRecommenderResponse) => void): Request<Personalize.Types.StartRecommenderResponse, AWSError>;
  /**
   * Stops a recommender that is ACTIVE. Stopping a recommender halts billing and automatic retraining for the recommender.
   */
  stopRecommender(params: Personalize.Types.StopRecommenderRequest, callback?: (err: AWSError, data: Personalize.Types.StopRecommenderResponse) => void): Request<Personalize.Types.StopRecommenderResponse, AWSError>;
  /**
   * Stops a recommender that is ACTIVE. Stopping a recommender halts billing and automatic retraining for the recommender.
   */
  stopRecommender(callback?: (err: AWSError, data: Personalize.Types.StopRecommenderResponse) => void): Request<Personalize.Types.StopRecommenderResponse, AWSError>;
  /**
   * Stops creating a solution version that is in a state of CREATE_PENDING or CREATE IN_PROGRESS.  Depending on the current state of the solution version, the solution version state changes as follows:   CREATE_PENDING &gt; CREATE_STOPPED or   CREATE_IN_PROGRESS &gt; CREATE_STOPPING &gt; CREATE_STOPPED   You are billed for all of the training completed up until you stop the solution version creation. You cannot resume creating a solution version once it has been stopped.
   */
  stopSolutionVersionCreation(params: Personalize.Types.StopSolutionVersionCreationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops creating a solution version that is in a state of CREATE_PENDING or CREATE IN_PROGRESS.  Depending on the current state of the solution version, the solution version state changes as follows:   CREATE_PENDING &gt; CREATE_STOPPED or   CREATE_IN_PROGRESS &gt; CREATE_STOPPING &gt; CREATE_STOPPED   You are billed for all of the training completed up until you stop the solution version creation. You cannot resume creating a solution version once it has been stopped.
   */
  stopSolutionVersionCreation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Add a list of tags to a resource.
   */
  tagResource(params: Personalize.Types.TagResourceRequest, callback?: (err: AWSError, data: Personalize.Types.TagResourceResponse) => void): Request<Personalize.Types.TagResourceResponse, AWSError>;
  /**
   * Add a list of tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: Personalize.Types.TagResourceResponse) => void): Request<Personalize.Types.TagResourceResponse, AWSError>;
  /**
   * Remove tags that are attached to a resource.
   */
  untagResource(params: Personalize.Types.UntagResourceRequest, callback?: (err: AWSError, data: Personalize.Types.UntagResourceResponse) => void): Request<Personalize.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags that are attached to a resource.
   */
  untagResource(callback?: (err: AWSError, data: Personalize.Types.UntagResourceResponse) => void): Request<Personalize.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a campaign by either deploying a new solution or changing the value of the campaign's minProvisionedTPS parameter. To update a campaign, the campaign status must be ACTIVE or CREATE FAILED. Check the campaign status using the DescribeCampaign operation.  You can still get recommendations from a campaign while an update is in progress. The campaign will use the previous solution version and campaign configuration to generate recommendations until the latest campaign update status is Active.   For more information on campaigns, see CreateCampaign.
   */
  updateCampaign(params: Personalize.Types.UpdateCampaignRequest, callback?: (err: AWSError, data: Personalize.Types.UpdateCampaignResponse) => void): Request<Personalize.Types.UpdateCampaignResponse, AWSError>;
  /**
   * Updates a campaign by either deploying a new solution or changing the value of the campaign's minProvisionedTPS parameter. To update a campaign, the campaign status must be ACTIVE or CREATE FAILED. Check the campaign status using the DescribeCampaign operation.  You can still get recommendations from a campaign while an update is in progress. The campaign will use the previous solution version and campaign configuration to generate recommendations until the latest campaign update status is Active.   For more information on campaigns, see CreateCampaign.
   */
  updateCampaign(callback?: (err: AWSError, data: Personalize.Types.UpdateCampaignResponse) => void): Request<Personalize.Types.UpdateCampaignResponse, AWSError>;
  /**
   * Update a dataset to replace its schema with a new or existing one. For more information, see Replacing a dataset's schema. 
   */
  updateDataset(params: Personalize.Types.UpdateDatasetRequest, callback?: (err: AWSError, data: Personalize.Types.UpdateDatasetResponse) => void): Request<Personalize.Types.UpdateDatasetResponse, AWSError>;
  /**
   * Update a dataset to replace its schema with a new or existing one. For more information, see Replacing a dataset's schema. 
   */
  updateDataset(callback?: (err: AWSError, data: Personalize.Types.UpdateDatasetResponse) => void): Request<Personalize.Types.UpdateDatasetResponse, AWSError>;
  /**
   * Updates a metric attribution.
   */
  updateMetricAttribution(params: Personalize.Types.UpdateMetricAttributionRequest, callback?: (err: AWSError, data: Personalize.Types.UpdateMetricAttributionResponse) => void): Request<Personalize.Types.UpdateMetricAttributionResponse, AWSError>;
  /**
   * Updates a metric attribution.
   */
  updateMetricAttribution(callback?: (err: AWSError, data: Personalize.Types.UpdateMetricAttributionResponse) => void): Request<Personalize.Types.UpdateMetricAttributionResponse, AWSError>;
  /**
   * Updates the recommender to modify the recommender configuration. If you update the recommender to modify the columns used in training, Amazon Personalize automatically starts a full retraining of the models backing your recommender. While the update completes, you can still get recommendations from the recommender. The recommender uses the previous configuration until the update completes. To track the status of this update, use the latestRecommenderUpdate returned in the DescribeRecommender operation. 
   */
  updateRecommender(params: Personalize.Types.UpdateRecommenderRequest, callback?: (err: AWSError, data: Personalize.Types.UpdateRecommenderResponse) => void): Request<Personalize.Types.UpdateRecommenderResponse, AWSError>;
  /**
   * Updates the recommender to modify the recommender configuration. If you update the recommender to modify the columns used in training, Amazon Personalize automatically starts a full retraining of the models backing your recommender. While the update completes, you can still get recommendations from the recommender. The recommender uses the previous configuration until the update completes. To track the status of this update, use the latestRecommenderUpdate returned in the DescribeRecommender operation. 
   */
  updateRecommender(callback?: (err: AWSError, data: Personalize.Types.UpdateRecommenderResponse) => void): Request<Personalize.Types.UpdateRecommenderResponse, AWSError>;
}
declare namespace Personalize {
  export type AccountId = string;
  export interface Algorithm {
    /**
     * The name of the algorithm.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the algorithm.
     */
    algorithmArn?: Arn;
    /**
     * The URI of the Docker container for the algorithm image.
     */
    algorithmImage?: AlgorithmImage;
    /**
     * Specifies the default hyperparameters.
     */
    defaultHyperParameters?: HyperParameters;
    /**
     * Specifies the default hyperparameters, their ranges, and whether they are tunable. A tunable hyperparameter can have its value determined during hyperparameter optimization (HPO).
     */
    defaultHyperParameterRanges?: DefaultHyperParameterRanges;
    /**
     * Specifies the default maximum number of training jobs and parallel training jobs.
     */
    defaultResourceConfig?: ResourceConfig;
    /**
     * The training input mode.
     */
    trainingInputMode?: TrainingInputMode;
    /**
     * The Amazon Resource Name (ARN) of the role.
     */
    roleArn?: Arn;
    /**
     * The date and time (in Unix time) that the algorithm was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the algorithm was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export interface AlgorithmImage {
    /**
     * The name of the algorithm image.
     */
    name?: Name;
    /**
     * The URI of the Docker container for the algorithm image.
     */
    dockerURI: DockerURI;
  }
  export type Arn = string;
  export type ArnList = Arn[];
  export interface AutoMLConfig {
    /**
     * The metric to optimize.
     */
    metricName?: MetricName;
    /**
     * The list of candidate recipes.
     */
    recipeList?: ArnList;
  }
  export interface AutoMLResult {
    /**
     * The Amazon Resource Name (ARN) of the best recipe.
     */
    bestRecipeArn?: Arn;
  }
  export type AvroSchema = string;
  export interface BatchInferenceJob {
    /**
     * The name of the batch inference job.
     */
    jobName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the batch inference job.
     */
    batchInferenceJobArn?: Arn;
    /**
     * The ARN of the filter used on the batch inference job.
     */
    filterArn?: Arn;
    /**
     * If the batch inference job failed, the reason for the failure.
     */
    failureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the solution version from which the batch inference job was created.
     */
    solutionVersionArn?: Arn;
    /**
     * The number of recommendations generated by the batch inference job. This number includes the error messages generated for failed input records.
     */
    numResults?: NumBatchResults;
    /**
     * The Amazon S3 path that leads to the input data used to generate the batch inference job.
     */
    jobInput?: BatchInferenceJobInput;
    /**
     * The Amazon S3 bucket that contains the output data generated by the batch inference job.
     */
    jobOutput?: BatchInferenceJobOutput;
    /**
     * A string to string map of the configuration details of a batch inference job.
     */
    batchInferenceJobConfig?: BatchInferenceJobConfig;
    /**
     * The ARN of the Amazon Identity and Access Management (IAM) role that requested the batch inference job.
     */
    roleArn?: RoleArn;
    /**
     * The status of the batch inference job. The status is one of the following values:   PENDING   IN PROGRESS   ACTIVE   CREATE FAILED  
     */
    status?: Status;
    /**
     * The time at which the batch inference job was created.
     */
    creationDateTime?: _Date;
    /**
     * The time at which the batch inference job was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export interface BatchInferenceJobConfig {
    /**
     * A string to string map specifying the exploration configuration hyperparameters, including explorationWeight and explorationItemAgeCutOff, you want to use to configure the amount of item exploration Amazon Personalize uses when recommending items. See User-Personalization.
     */
    itemExplorationConfig?: HyperParameters;
  }
  export interface BatchInferenceJobInput {
    /**
     * The URI of the Amazon S3 location that contains your input data. The Amazon S3 bucket must be in the same region as the API endpoint you are calling.
     */
    s3DataSource: S3DataConfig;
  }
  export interface BatchInferenceJobOutput {
    /**
     * Information on the Amazon S3 bucket in which the batch inference job's output is stored.
     */
    s3DataDestination: S3DataConfig;
  }
  export interface BatchInferenceJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the batch inference job.
     */
    batchInferenceJobArn?: Arn;
    /**
     * The name of the batch inference job.
     */
    jobName?: Name;
    /**
     * The status of the batch inference job. The status is one of the following values:   PENDING   IN PROGRESS   ACTIVE   CREATE FAILED  
     */
    status?: Status;
    /**
     * The time at which the batch inference job was created.
     */
    creationDateTime?: _Date;
    /**
     * The time at which the batch inference job was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If the batch inference job failed, the reason for the failure.
     */
    failureReason?: FailureReason;
    /**
     * The ARN of the solution version used by the batch inference job.
     */
    solutionVersionArn?: Arn;
  }
  export type BatchInferenceJobs = BatchInferenceJobSummary[];
  export interface BatchSegmentJob {
    /**
     * The name of the batch segment job.
     */
    jobName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the batch segment job.
     */
    batchSegmentJobArn?: Arn;
    /**
     * The ARN of the filter used on the batch segment job.
     */
    filterArn?: Arn;
    /**
     * If the batch segment job failed, the reason for the failure.
     */
    failureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the solution version used by the batch segment job to generate batch segments.
     */
    solutionVersionArn?: Arn;
    /**
     * The number of predicted users generated by the batch segment job for each line of input data. The maximum number of users per segment is 5 million.
     */
    numResults?: NumBatchResults;
    /**
     * The Amazon S3 path that leads to the input data used to generate the batch segment job.
     */
    jobInput?: BatchSegmentJobInput;
    /**
     * The Amazon S3 bucket that contains the output data generated by the batch segment job.
     */
    jobOutput?: BatchSegmentJobOutput;
    /**
     * The ARN of the Amazon Identity and Access Management (IAM) role that requested the batch segment job.
     */
    roleArn?: RoleArn;
    /**
     * The status of the batch segment job. The status is one of the following values:   PENDING   IN PROGRESS   ACTIVE   CREATE FAILED  
     */
    status?: Status;
    /**
     * The time at which the batch segment job was created.
     */
    creationDateTime?: _Date;
    /**
     * The time at which the batch segment job last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export interface BatchSegmentJobInput {
    s3DataSource: S3DataConfig;
  }
  export interface BatchSegmentJobOutput {
    s3DataDestination: S3DataConfig;
  }
  export interface BatchSegmentJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the batch segment job.
     */
    batchSegmentJobArn?: Arn;
    /**
     * The name of the batch segment job.
     */
    jobName?: Name;
    /**
     * The status of the batch segment job. The status is one of the following values:   PENDING   IN PROGRESS   ACTIVE   CREATE FAILED  
     */
    status?: Status;
    /**
     * The time at which the batch segment job was created.
     */
    creationDateTime?: _Date;
    /**
     * The time at which the batch segment job was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If the batch segment job failed, the reason for the failure.
     */
    failureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the solution version used by the batch segment job to generate batch segments.
     */
    solutionVersionArn?: Arn;
  }
  export type BatchSegmentJobs = BatchSegmentJobSummary[];
  export type Boolean = boolean;
  export interface Campaign {
    /**
     * The name of the campaign.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the campaign. 
     */
    campaignArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of a specific version of the solution.
     */
    solutionVersionArn?: Arn;
    /**
     * Specifies the requested minimum provisioned transactions (recommendations) per second. A high minProvisionedTPS will increase your bill. We recommend starting with 1 for minProvisionedTPS (the default). Track your usage using Amazon CloudWatch metrics, and increase the minProvisionedTPS as necessary.
     */
    minProvisionedTPS?: TransactionsPerSecond;
    /**
     * The configuration details of a campaign.
     */
    campaignConfig?: CampaignConfig;
    /**
     * The status of the campaign. A campaign can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * If a campaign fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
    /**
     * The date and time (in Unix format) that the campaign was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix format) that the campaign was last updated.
     */
    lastUpdatedDateTime?: _Date;
    latestCampaignUpdate?: CampaignUpdateSummary;
  }
  export interface CampaignConfig {
    /**
     * Specifies the exploration configuration hyperparameters, including explorationWeight and explorationItemAgeCutOff, you want to use to configure the amount of item exploration Amazon Personalize uses when recommending items. Provide itemExplorationConfig data only if your solution uses the User-Personalization recipe.
     */
    itemExplorationConfig?: HyperParameters;
  }
  export interface CampaignSummary {
    /**
     * The name of the campaign.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the campaign.
     */
    campaignArn?: Arn;
    /**
     * The status of the campaign. A campaign can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the campaign was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the campaign was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If a campaign fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
  }
  export interface CampaignUpdateSummary {
    /**
     * The Amazon Resource Name (ARN) of the deployed solution version.
     */
    solutionVersionArn?: Arn;
    /**
     * Specifies the requested minimum provisioned transactions (recommendations) per second that Amazon Personalize will support.
     */
    minProvisionedTPS?: TransactionsPerSecond;
    campaignConfig?: CampaignConfig;
    /**
     * The status of the campaign update. A campaign update can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * If a campaign update fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
    /**
     * The date and time (in Unix time) that the campaign update was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the campaign update was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export type Campaigns = CampaignSummary[];
  export interface CategoricalHyperParameterRange {
    /**
     * The name of the hyperparameter.
     */
    name?: ParameterName;
    /**
     * A list of the categories for the hyperparameter.
     */
    values?: CategoricalValues;
  }
  export type CategoricalHyperParameterRanges = CategoricalHyperParameterRange[];
  export type CategoricalValue = string;
  export type CategoricalValues = CategoricalValue[];
  export type ColumnName = string;
  export type ColumnNamesList = ColumnName[];
  export interface ContinuousHyperParameterRange {
    /**
     * The name of the hyperparameter.
     */
    name?: ParameterName;
    /**
     * The minimum allowable value for the hyperparameter.
     */
    minValue?: ContinuousMinValue;
    /**
     * The maximum allowable value for the hyperparameter.
     */
    maxValue?: ContinuousMaxValue;
  }
  export type ContinuousHyperParameterRanges = ContinuousHyperParameterRange[];
  export type ContinuousMaxValue = number;
  export type ContinuousMinValue = number;
  export interface CreateBatchInferenceJobRequest {
    /**
     * The name of the batch inference job to create.
     */
    jobName: Name;
    /**
     * The Amazon Resource Name (ARN) of the solution version that will be used to generate the batch inference recommendations.
     */
    solutionVersionArn: Arn;
    /**
     * The ARN of the filter to apply to the batch inference job. For more information on using filters, see Filtering batch recommendations.
     */
    filterArn?: Arn;
    /**
     * The number of recommendations to retrieve.
     */
    numResults?: NumBatchResults;
    /**
     * The Amazon S3 path that leads to the input file to base your recommendations on. The input material must be in JSON format.
     */
    jobInput: BatchInferenceJobInput;
    /**
     * The path to the Amazon S3 bucket where the job's output will be stored.
     */
    jobOutput: BatchInferenceJobOutput;
    /**
     * The ARN of the Amazon Identity and Access Management role that has permissions to read and write to your input and output Amazon S3 buckets respectively.
     */
    roleArn: RoleArn;
    /**
     * The configuration details of a batch inference job.
     */
    batchInferenceJobConfig?: BatchInferenceJobConfig;
    /**
     * A list of tags to apply to the batch inference job.
     */
    tags?: Tags;
  }
  export interface CreateBatchInferenceJobResponse {
    /**
     * The ARN of the batch inference job.
     */
    batchInferenceJobArn?: Arn;
  }
  export interface CreateBatchSegmentJobRequest {
    /**
     * The name of the batch segment job to create.
     */
    jobName: Name;
    /**
     * The Amazon Resource Name (ARN) of the solution version you want the batch segment job to use to generate batch segments.
     */
    solutionVersionArn: Arn;
    /**
     * The ARN of the filter to apply to the batch segment job. For more information on using filters, see Filtering batch recommendations.
     */
    filterArn?: Arn;
    /**
     * The number of predicted users generated by the batch segment job for each line of input data. The maximum number of users per segment is 5 million.
     */
    numResults?: NumBatchResults;
    /**
     * The Amazon S3 path for the input data used to generate the batch segment job.
     */
    jobInput: BatchSegmentJobInput;
    /**
     * The Amazon S3 path for the bucket where the job's output will be stored.
     */
    jobOutput: BatchSegmentJobOutput;
    /**
     * The ARN of the Amazon Identity and Access Management role that has permissions to read and write to your input and output Amazon S3 buckets respectively.
     */
    roleArn: RoleArn;
    /**
     * A list of tags to apply to the batch segment job.
     */
    tags?: Tags;
  }
  export interface CreateBatchSegmentJobResponse {
    /**
     * The ARN of the batch segment job.
     */
    batchSegmentJobArn?: Arn;
  }
  export interface CreateCampaignRequest {
    /**
     * A name for the new campaign. The campaign name must be unique within your account.
     */
    name: Name;
    /**
     * The Amazon Resource Name (ARN) of the solution version to deploy.
     */
    solutionVersionArn: Arn;
    /**
     * Specifies the requested minimum provisioned transactions (recommendations) per second that Amazon Personalize will support. A high minProvisionedTPS will increase your bill. We recommend starting with 1 for minProvisionedTPS (the default). Track your usage using Amazon CloudWatch metrics, and increase the minProvisionedTPS as necessary.
     */
    minProvisionedTPS?: TransactionsPerSecond;
    /**
     * The configuration details of a campaign.
     */
    campaignConfig?: CampaignConfig;
    /**
     * A list of tags to apply to the campaign.
     */
    tags?: Tags;
  }
  export interface CreateCampaignResponse {
    /**
     * The Amazon Resource Name (ARN) of the campaign.
     */
    campaignArn?: Arn;
  }
  export interface CreateDatasetExportJobRequest {
    /**
     * The name for the dataset export job.
     */
    jobName: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset that contains the data to export.
     */
    datasetArn: Arn;
    /**
     * The data to export, based on how you imported the data. You can choose to export only BULK data that you imported using a dataset import job, only PUT data that you imported incrementally (using the console, PutEvents, PutUsers and PutItems operations), or ALL for both types. The default value is PUT. 
     */
    ingestionMode?: IngestionMode;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that has permissions to add data to your output Amazon S3 bucket.
     */
    roleArn: RoleArn;
    /**
     * The path to the Amazon S3 bucket where the job's output is stored.
     */
    jobOutput: DatasetExportJobOutput;
    /**
     * A list of tags to apply to the dataset export job.
     */
    tags?: Tags;
  }
  export interface CreateDatasetExportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset export job.
     */
    datasetExportJobArn?: Arn;
  }
  export interface CreateDatasetGroupRequest {
    /**
     * The name for the new dataset group.
     */
    name: Name;
    /**
     * The ARN of the Identity and Access Management (IAM) role that has permissions to access the Key Management Service (KMS) key. Supplying an IAM role is only valid when also specifying a KMS key.
     */
    roleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of a Key Management Service (KMS) key used to encrypt the datasets.
     */
    kmsKeyArn?: KmsKeyArn;
    /**
     * The domain of the dataset group. Specify a domain to create a Domain dataset group. The domain you specify determines the default schemas for datasets and the use cases available for recommenders. If you don't specify a domain, you create a Custom dataset group with solution versions that you deploy with a campaign. 
     */
    domain?: Domain;
    /**
     * A list of tags to apply to the dataset group.
     */
    tags?: Tags;
  }
  export interface CreateDatasetGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the new dataset group.
     */
    datasetGroupArn?: Arn;
    /**
     * The domain for the new Domain dataset group.
     */
    domain?: Domain;
  }
  export interface CreateDatasetImportJobRequest {
    /**
     * The name for the dataset import job.
     */
    jobName: Name;
    /**
     * The ARN of the dataset that receives the imported data.
     */
    datasetArn: Arn;
    /**
     * The Amazon S3 bucket that contains the training data to import.
     */
    dataSource: DataSource;
    /**
     * The ARN of the IAM role that has permissions to read from the Amazon S3 data source.
     */
    roleArn: RoleArn;
    /**
     * A list of tags to apply to the dataset import job.
     */
    tags?: Tags;
    /**
     * Specify how to add the new records to an existing dataset. The default import mode is FULL. If you haven't imported bulk records into the dataset previously, you can only specify FULL.   Specify FULL to overwrite all existing bulk data in your dataset. Data you imported individually is not replaced.   Specify INCREMENTAL to append the new records to the existing data in your dataset. Amazon Personalize replaces any record with the same ID with the new one.  
     */
    importMode?: ImportMode;
    /**
     * If you created a metric attribution, specify whether to publish metrics for this import job to Amazon S3
     */
    publishAttributionMetricsToS3?: Boolean;
  }
  export interface CreateDatasetImportJobResponse {
    /**
     * The ARN of the dataset import job.
     */
    datasetImportJobArn?: Arn;
  }
  export interface CreateDatasetRequest {
    /**
     * The name for the dataset.
     */
    name: Name;
    /**
     * The ARN of the schema to associate with the dataset. The schema defines the dataset fields.
     */
    schemaArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset group to add the dataset to.
     */
    datasetGroupArn: Arn;
    /**
     * The type of dataset. One of the following (case insensitive) values:   Interactions   Items   Users  
     */
    datasetType: DatasetType;
    /**
     * A list of tags to apply to the dataset.
     */
    tags?: Tags;
  }
  export interface CreateDatasetResponse {
    /**
     * The ARN of the dataset.
     */
    datasetArn?: Arn;
  }
  export interface CreateEventTrackerRequest {
    /**
     * The name for the event tracker.
     */
    name: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that receives the event data.
     */
    datasetGroupArn: Arn;
    /**
     * A list of tags to apply to the event tracker.
     */
    tags?: Tags;
  }
  export interface CreateEventTrackerResponse {
    /**
     * The ARN of the event tracker.
     */
    eventTrackerArn?: Arn;
    /**
     * The ID of the event tracker. Include this ID in requests to the PutEvents API.
     */
    trackingId?: TrackingId;
  }
  export interface CreateFilterRequest {
    /**
     * The name of the filter to create.
     */
    name: Name;
    /**
     * The ARN of the dataset group that the filter will belong to.
     */
    datasetGroupArn: Arn;
    /**
     * The filter expression defines which items are included or excluded from recommendations. Filter expression must follow specific format rules. For information about filter expression structure and syntax, see Filter expressions.
     */
    filterExpression: FilterExpression;
    /**
     * A list of tags to apply to the filter.
     */
    tags?: Tags;
  }
  export interface CreateFilterResponse {
    /**
     * The ARN of the new filter.
     */
    filterArn?: Arn;
  }
  export interface CreateMetricAttributionRequest {
    /**
     * A name for the metric attribution.
     */
    name: Name;
    /**
     * The Amazon Resource Name (ARN) of the destination dataset group for the metric attribution.
     */
    datasetGroupArn: Arn;
    /**
     * A list of metric attributes for the metric attribution. Each metric attribute specifies an event type to track and a function. Available functions are SUM() or SAMPLECOUNT(). For SUM() functions, provide the dataset type (either Interactions or Items) and column to sum as a parameter. For example SUM(Items.PRICE).
     */
    metrics: MetricAttributes;
    /**
     * The output configuration details for the metric attribution.
     */
    metricsOutputConfig: MetricAttributionOutput;
  }
  export interface CreateMetricAttributionResponse {
    /**
     * The Amazon Resource Name (ARN) for the new metric attribution.
     */
    metricAttributionArn?: Arn;
  }
  export interface CreateRecommenderRequest {
    /**
     * The name of the recommender.
     */
    name: Name;
    /**
     * The Amazon Resource Name (ARN) of the destination domain dataset group for the recommender.
     */
    datasetGroupArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the recipe that the recommender will use. For a recommender, a recipe is a Domain dataset group use case. Only Domain dataset group use cases can be used to create a recommender. For information about use cases see Choosing recommender use cases. 
     */
    recipeArn: Arn;
    /**
     * The configuration details of the recommender.
     */
    recommenderConfig?: RecommenderConfig;
    /**
     * A list of tags to apply to the recommender.
     */
    tags?: Tags;
  }
  export interface CreateRecommenderResponse {
    /**
     * The Amazon Resource Name (ARN) of the recommender.
     */
    recommenderArn?: Arn;
  }
  export interface CreateSchemaRequest {
    /**
     * The name for the schema.
     */
    name: Name;
    /**
     * A schema in Avro JSON format.
     */
    schema: AvroSchema;
    /**
     * The domain for the schema. If you are creating a schema for a dataset in a Domain dataset group, specify the domain you chose when you created the Domain dataset group.
     */
    domain?: Domain;
  }
  export interface CreateSchemaResponse {
    /**
     * The Amazon Resource Name (ARN) of the created schema.
     */
    schemaArn?: Arn;
  }
  export interface CreateSolutionRequest {
    /**
     * The name for the solution.
     */
    name: Name;
    /**
     * Whether to perform hyperparameter optimization (HPO) on the specified or selected recipe. The default is false. When performing AutoML, this parameter is always true and you should not set it to false.
     */
    performHPO?: Boolean;
    /**
     *  We don't recommend enabling automated machine learning. Instead, match your use case to the available Amazon Personalize recipes. For more information, see Determining your use case.   Whether to perform automated machine learning (AutoML). The default is false. For this case, you must specify recipeArn. When set to true, Amazon Personalize analyzes your training data and selects the optimal USER_PERSONALIZATION recipe and hyperparameters. In this case, you must omit recipeArn. Amazon Personalize determines the optimal recipe by running tests with different values for the hyperparameters. AutoML lengthens the training process as compared to selecting a specific recipe.
     */
    performAutoML?: PerformAutoML;
    /**
     * The ARN of the recipe to use for model training. This is required when performAutoML is false.
     */
    recipeArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
     */
    datasetGroupArn: Arn;
    /**
     * When your have multiple event types (using an EVENT_TYPE schema field), this parameter specifies which event type (for example, 'click' or 'like') is used for training the model. If you do not provide an eventType, Amazon Personalize will use all interactions for training with equal weight regardless of type.
     */
    eventType?: EventType;
    /**
     * The configuration to use with the solution. When performAutoML is set to true, Amazon Personalize only evaluates the autoMLConfig section of the solution configuration.  Amazon Personalize doesn't support configuring the hpoObjective at this time. 
     */
    solutionConfig?: SolutionConfig;
    /**
     * A list of tags to apply to the solution.
     */
    tags?: Tags;
  }
  export interface CreateSolutionResponse {
    /**
     * The ARN of the solution.
     */
    solutionArn?: Arn;
  }
  export interface CreateSolutionVersionRequest {
    /**
     * The name of the solution version.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the solution containing the training configuration information.
     */
    solutionArn: Arn;
    /**
     * The scope of training to be performed when creating the solution version. The FULL option trains the solution version based on the entirety of the input solution's training data, while the UPDATE option processes only the data that has changed in comparison to the input solution. Choose UPDATE when you want to incrementally update your solution version instead of creating an entirely new one.  The UPDATE option can only be used when you already have an active solution version created from the input solution using the FULL option and the input solution was trained with the User-Personalization recipe or the HRNN-Coldstart recipe. 
     */
    trainingMode?: TrainingMode;
    /**
     * A list of tags to apply to the solution version.
     */
    tags?: Tags;
  }
  export interface CreateSolutionVersionResponse {
    /**
     * The ARN of the new solution version.
     */
    solutionVersionArn?: Arn;
  }
  export interface DataSource {
    /**
     * The path to the Amazon S3 bucket where the data that you want to upload to your dataset is stored. For example:   s3://bucket-name/folder-name/ 
     */
    dataLocation?: S3Location;
  }
  export interface Dataset {
    /**
     * The name of the dataset.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset that you want metadata for.
     */
    datasetArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    datasetGroupArn?: Arn;
    /**
     * One of the following values:   Interactions   Items   Users  
     */
    datasetType?: DatasetType;
    /**
     * The ARN of the associated schema.
     */
    schemaArn?: Arn;
    /**
     * The status of the dataset. A dataset can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The creation date and time (in Unix time) of the dataset.
     */
    creationDateTime?: _Date;
    /**
     * A time stamp that shows when the dataset was updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * Describes the latest update to the dataset.
     */
    latestDatasetUpdate?: DatasetUpdateSummary;
  }
  export interface DatasetExportJob {
    /**
     * The name of the export job.
     */
    jobName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset export job.
     */
    datasetExportJobArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset to export.
     */
    datasetArn?: Arn;
    /**
     * The data to export, based on how you imported the data. You can choose to export BULK data that you imported using a dataset import job, PUT data that you imported incrementally (using the console, PutEvents, PutUsers and PutItems operations), or ALL for both types. The default value is PUT. 
     */
    ingestionMode?: IngestionMode;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that has permissions to add data to your output Amazon S3 bucket.
     */
    roleArn?: Arn;
    /**
     * The status of the dataset export job. A dataset export job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED  
     */
    status?: Status;
    /**
     * The path to the Amazon S3 bucket where the job's output is stored. For example:  s3://bucket-name/folder-name/ 
     */
    jobOutput?: DatasetExportJobOutput;
    /**
     * The creation date and time (in Unix time) of the dataset export job.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) the status of the dataset export job was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If a dataset export job fails, provides the reason why.
     */
    failureReason?: FailureReason;
  }
  export interface DatasetExportJobOutput {
    s3DataDestination: S3DataConfig;
  }
  export interface DatasetExportJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the dataset export job.
     */
    datasetExportJobArn?: Arn;
    /**
     * The name of the dataset export job.
     */
    jobName?: Name;
    /**
     * The status of the dataset export job. A dataset export job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the dataset export job was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the dataset export job status was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If a dataset export job fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
  }
  export type DatasetExportJobs = DatasetExportJobSummary[];
  export interface DatasetGroup {
    /**
     * The name of the dataset group.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    datasetGroupArn?: Arn;
    /**
     * The current status of the dataset group. A dataset group can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING  
     */
    status?: Status;
    /**
     * The ARN of the IAM role that has permissions to create the dataset group.
     */
    roleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS) key used to encrypt the datasets.
     */
    kmsKeyArn?: KmsKeyArn;
    /**
     * The creation date and time (in Unix time) of the dataset group.
     */
    creationDateTime?: _Date;
    /**
     * The last update date and time (in Unix time) of the dataset group.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If creating a dataset group fails, provides the reason why.
     */
    failureReason?: FailureReason;
    /**
     * The domain of a Domain dataset group.
     */
    domain?: Domain;
  }
  export interface DatasetGroupSummary {
    /**
     * The name of the dataset group.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    datasetGroupArn?: Arn;
    /**
     * The status of the dataset group. A dataset group can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the dataset group was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the dataset group was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If creating a dataset group fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
    /**
     * The domain of a Domain dataset group.
     */
    domain?: Domain;
  }
  export type DatasetGroups = DatasetGroupSummary[];
  export interface DatasetImportJob {
    /**
     * The name of the import job.
     */
    jobName?: Name;
    /**
     * The ARN of the dataset import job.
     */
    datasetImportJobArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset that receives the imported data.
     */
    datasetArn?: Arn;
    /**
     * The Amazon S3 bucket that contains the training data to import.
     */
    dataSource?: DataSource;
    /**
     * The ARN of the IAM role that has permissions to read from the Amazon S3 data source.
     */
    roleArn?: Arn;
    /**
     * The status of the dataset import job. A dataset import job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED  
     */
    status?: Status;
    /**
     * The creation date and time (in Unix time) of the dataset import job.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) the dataset was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If a dataset import job fails, provides the reason why.
     */
    failureReason?: FailureReason;
    /**
     * The import mode used by the dataset import job to import new records.
     */
    importMode?: ImportMode;
    /**
     * Whether the job publishes metrics to Amazon S3 for a metric attribution.
     */
    publishAttributionMetricsToS3?: Boolean;
  }
  export interface DatasetImportJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job.
     */
    datasetImportJobArn?: Arn;
    /**
     * The name of the dataset import job.
     */
    jobName?: Name;
    /**
     * The status of the dataset import job. A dataset import job can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the dataset import job was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the dataset import job status was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If a dataset import job fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
    /**
     * The import mode the dataset import job used to update the data in the dataset. For more information see Updating existing bulk data. 
     */
    importMode?: ImportMode;
  }
  export type DatasetImportJobs = DatasetImportJobSummary[];
  export interface DatasetSchema {
    /**
     * The name of the schema.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    schemaArn?: Arn;
    /**
     * The schema.
     */
    schema?: AvroSchema;
    /**
     * The date and time (in Unix time) that the schema was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the schema was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The domain of a schema that you created for a dataset in a Domain dataset group.
     */
    domain?: Domain;
  }
  export interface DatasetSchemaSummary {
    /**
     * The name of the schema.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the schema.
     */
    schemaArn?: Arn;
    /**
     * The date and time (in Unix time) that the schema was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the schema was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The domain of a schema that you created for a dataset in a Domain dataset group.
     */
    domain?: Domain;
  }
  export interface DatasetSummary {
    /**
     * The name of the dataset.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    datasetArn?: Arn;
    /**
     * The dataset type. One of the following values:   Interactions   Items   Users   Event-Interactions  
     */
    datasetType?: DatasetType;
    /**
     * The status of the dataset. A dataset can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the dataset was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the dataset was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export type DatasetType = string;
  export interface DatasetUpdateSummary {
    /**
     * The Amazon Resource Name (ARN) of the schema that replaced the previous schema of the dataset.
     */
    schemaArn?: Arn;
    /**
     * The status of the dataset update. 
     */
    status?: Status;
    /**
     * If updating a dataset fails, provides the reason why.
     */
    failureReason?: FailureReason;
    /**
     * The creation date and time (in Unix time) of the dataset update.
     */
    creationDateTime?: _Date;
    /**
     * The last update date and time (in Unix time) of the dataset.
     */
    lastUpdatedDateTime?: _Date;
  }
  export type Datasets = DatasetSummary[];
  export type _Date = Date;
  export interface DefaultCategoricalHyperParameterRange {
    /**
     * The name of the hyperparameter.
     */
    name?: ParameterName;
    /**
     * A list of the categories for the hyperparameter.
     */
    values?: CategoricalValues;
    /**
     * Whether the hyperparameter is tunable.
     */
    isTunable?: Tunable;
  }
  export type DefaultCategoricalHyperParameterRanges = DefaultCategoricalHyperParameterRange[];
  export interface DefaultContinuousHyperParameterRange {
    /**
     * The name of the hyperparameter.
     */
    name?: ParameterName;
    /**
     * The minimum allowable value for the hyperparameter.
     */
    minValue?: ContinuousMinValue;
    /**
     * The maximum allowable value for the hyperparameter.
     */
    maxValue?: ContinuousMaxValue;
    /**
     * Whether the hyperparameter is tunable.
     */
    isTunable?: Tunable;
  }
  export type DefaultContinuousHyperParameterRanges = DefaultContinuousHyperParameterRange[];
  export interface DefaultHyperParameterRanges {
    /**
     * The integer-valued hyperparameters and their default ranges.
     */
    integerHyperParameterRanges?: DefaultIntegerHyperParameterRanges;
    /**
     * The continuous hyperparameters and their default ranges.
     */
    continuousHyperParameterRanges?: DefaultContinuousHyperParameterRanges;
    /**
     * The categorical hyperparameters and their default ranges.
     */
    categoricalHyperParameterRanges?: DefaultCategoricalHyperParameterRanges;
  }
  export interface DefaultIntegerHyperParameterRange {
    /**
     * The name of the hyperparameter.
     */
    name?: ParameterName;
    /**
     * The minimum allowable value for the hyperparameter.
     */
    minValue?: IntegerMinValue;
    /**
     * The maximum allowable value for the hyperparameter.
     */
    maxValue?: IntegerMaxValue;
    /**
     * Indicates whether the hyperparameter is tunable.
     */
    isTunable?: Tunable;
  }
  export type DefaultIntegerHyperParameterRanges = DefaultIntegerHyperParameterRange[];
  export interface DeleteCampaignRequest {
    /**
     * The Amazon Resource Name (ARN) of the campaign to delete.
     */
    campaignArn: Arn;
  }
  export interface DeleteDatasetGroupRequest {
    /**
     * The ARN of the dataset group to delete.
     */
    datasetGroupArn: Arn;
  }
  export interface DeleteDatasetRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset to delete.
     */
    datasetArn: Arn;
  }
  export interface DeleteEventTrackerRequest {
    /**
     * The Amazon Resource Name (ARN) of the event tracker to delete.
     */
    eventTrackerArn: Arn;
  }
  export interface DeleteFilterRequest {
    /**
     * The ARN of the filter to delete.
     */
    filterArn: Arn;
  }
  export interface DeleteMetricAttributionRequest {
    /**
     * The metric attribution's Amazon Resource Name (ARN).
     */
    metricAttributionArn: Arn;
  }
  export interface DeleteRecommenderRequest {
    /**
     * The Amazon Resource Name (ARN) of the recommender to delete.
     */
    recommenderArn: Arn;
  }
  export interface DeleteSchemaRequest {
    /**
     * The Amazon Resource Name (ARN) of the schema to delete.
     */
    schemaArn: Arn;
  }
  export interface DeleteSolutionRequest {
    /**
     * The ARN of the solution to delete.
     */
    solutionArn: Arn;
  }
  export interface DescribeAlgorithmRequest {
    /**
     * The Amazon Resource Name (ARN) of the algorithm to describe.
     */
    algorithmArn: Arn;
  }
  export interface DescribeAlgorithmResponse {
    /**
     * A listing of the properties of the algorithm.
     */
    algorithm?: Algorithm;
  }
  export interface DescribeBatchInferenceJobRequest {
    /**
     * The ARN of the batch inference job to describe.
     */
    batchInferenceJobArn: Arn;
  }
  export interface DescribeBatchInferenceJobResponse {
    /**
     * Information on the specified batch inference job.
     */
    batchInferenceJob?: BatchInferenceJob;
  }
  export interface DescribeBatchSegmentJobRequest {
    /**
     * The ARN of the batch segment job to describe.
     */
    batchSegmentJobArn: Arn;
  }
  export interface DescribeBatchSegmentJobResponse {
    /**
     * Information on the specified batch segment job.
     */
    batchSegmentJob?: BatchSegmentJob;
  }
  export interface DescribeCampaignRequest {
    /**
     * The Amazon Resource Name (ARN) of the campaign.
     */
    campaignArn: Arn;
  }
  export interface DescribeCampaignResponse {
    /**
     * The properties of the campaign.
     */
    campaign?: Campaign;
  }
  export interface DescribeDatasetExportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset export job to describe.
     */
    datasetExportJobArn: Arn;
  }
  export interface DescribeDatasetExportJobResponse {
    /**
     * Information about the dataset export job, including the status. The status is one of the following values:   CREATE PENDING   CREATE IN_PROGRESS   ACTIVE   CREATE FAILED  
     */
    datasetExportJob?: DatasetExportJob;
  }
  export interface DescribeDatasetGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset group to describe.
     */
    datasetGroupArn: Arn;
  }
  export interface DescribeDatasetGroupResponse {
    /**
     * A listing of the dataset group's properties.
     */
    datasetGroup?: DatasetGroup;
  }
  export interface DescribeDatasetImportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job to describe.
     */
    datasetImportJobArn: Arn;
  }
  export interface DescribeDatasetImportJobResponse {
    /**
     * Information about the dataset import job, including the status. The status is one of the following values:   CREATE PENDING   CREATE IN_PROGRESS   ACTIVE   CREATE FAILED  
     */
    datasetImportJob?: DatasetImportJob;
  }
  export interface DescribeDatasetRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset to describe.
     */
    datasetArn: Arn;
  }
  export interface DescribeDatasetResponse {
    /**
     * A listing of the dataset's properties.
     */
    dataset?: Dataset;
  }
  export interface DescribeEventTrackerRequest {
    /**
     * The Amazon Resource Name (ARN) of the event tracker to describe.
     */
    eventTrackerArn: Arn;
  }
  export interface DescribeEventTrackerResponse {
    /**
     * An object that describes the event tracker.
     */
    eventTracker?: EventTracker;
  }
  export interface DescribeFeatureTransformationRequest {
    /**
     * The Amazon Resource Name (ARN) of the feature transformation to describe.
     */
    featureTransformationArn: Arn;
  }
  export interface DescribeFeatureTransformationResponse {
    /**
     * A listing of the FeatureTransformation properties.
     */
    featureTransformation?: FeatureTransformation;
  }
  export interface DescribeFilterRequest {
    /**
     * The ARN of the filter to describe.
     */
    filterArn: Arn;
  }
  export interface DescribeFilterResponse {
    /**
     * The filter's details.
     */
    filter?: Filter;
  }
  export interface DescribeMetricAttributionRequest {
    /**
     * The metric attribution's Amazon Resource Name (ARN).
     */
    metricAttributionArn: Arn;
  }
  export interface DescribeMetricAttributionResponse {
    /**
     * The details of the metric attribution.
     */
    metricAttribution?: MetricAttribution;
  }
  export interface DescribeRecipeRequest {
    /**
     * The Amazon Resource Name (ARN) of the recipe to describe.
     */
    recipeArn: Arn;
  }
  export interface DescribeRecipeResponse {
    /**
     * An object that describes the recipe.
     */
    recipe?: Recipe;
  }
  export interface DescribeRecommenderRequest {
    /**
     * The Amazon Resource Name (ARN) of the recommender to describe.
     */
    recommenderArn: Arn;
  }
  export interface DescribeRecommenderResponse {
    /**
     * The properties of the recommender.
     */
    recommender?: Recommender;
  }
  export interface DescribeSchemaRequest {
    /**
     * The Amazon Resource Name (ARN) of the schema to retrieve.
     */
    schemaArn: Arn;
  }
  export interface DescribeSchemaResponse {
    /**
     * The requested schema.
     */
    schema?: DatasetSchema;
  }
  export interface DescribeSolutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution to describe.
     */
    solutionArn: Arn;
  }
  export interface DescribeSolutionResponse {
    /**
     * An object that describes the solution.
     */
    solution?: Solution;
  }
  export interface DescribeSolutionVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution version.
     */
    solutionVersionArn: Arn;
  }
  export interface DescribeSolutionVersionResponse {
    /**
     * The solution version.
     */
    solutionVersion?: SolutionVersion;
  }
  export type Description = string;
  export type DockerURI = string;
  export type Domain = "ECOMMERCE"|"VIDEO_ON_DEMAND"|string;
  export interface EventTracker {
    /**
     * The name of the event tracker.
     */
    name?: Name;
    /**
     * The ARN of the event tracker.
     */
    eventTrackerArn?: Arn;
    /**
     * The Amazon Web Services account that owns the event tracker.
     */
    accountId?: AccountId;
    /**
     * The ID of the event tracker. Include this ID in requests to the PutEvents API.
     */
    trackingId?: TrackingId;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that receives the event data.
     */
    datasetGroupArn?: Arn;
    /**
     * The status of the event tracker. An event tracker can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The date and time (in Unix format) that the event tracker was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the event tracker was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export interface EventTrackerSummary {
    /**
     * The name of the event tracker.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the event tracker.
     */
    eventTrackerArn?: Arn;
    /**
     * The status of the event tracker. An event tracker can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the event tracker was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the event tracker was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export type EventTrackers = EventTrackerSummary[];
  export type EventType = string;
  export type EventValueThreshold = string;
  export type ExcludedDatasetColumns = {[key: string]: ColumnNamesList};
  export type FailureReason = string;
  export interface FeatureTransformation {
    /**
     * The name of the feature transformation.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the FeatureTransformation object.
     */
    featureTransformationArn?: Arn;
    /**
     * Provides the default parameters for feature transformation.
     */
    defaultParameters?: FeaturizationParameters;
    /**
     * The creation date and time (in Unix time) of the feature transformation.
     */
    creationDateTime?: _Date;
    /**
     * The last update date and time (in Unix time) of the feature transformation.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The status of the feature transformation. A feature transformation can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED  
     */
    status?: Status;
  }
  export type FeatureTransformationParameters = {[key: string]: ParameterValue};
  export type FeaturizationParameters = {[key: string]: ParameterValue};
  export interface Filter {
    /**
     * The name of the filter.
     */
    name?: Name;
    /**
     * The ARN of the filter.
     */
    filterArn?: Arn;
    /**
     * The time at which the filter was created.
     */
    creationDateTime?: _Date;
    /**
     * The time at which the filter was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The ARN of the dataset group to which the filter belongs.
     */
    datasetGroupArn?: Arn;
    /**
     * If the filter failed, the reason for its failure.
     */
    failureReason?: FailureReason;
    /**
     * Specifies the type of item interactions to filter out of recommendation results. The filter expression must follow specific format rules. For information about filter expression structure and syntax, see Filter expressions.
     */
    filterExpression?: FilterExpression;
    /**
     * The status of the filter.
     */
    status?: Status;
  }
  export type FilterExpression = string;
  export interface FilterSummary {
    /**
     * The name of the filter.
     */
    name?: Name;
    /**
     * The ARN of the filter.
     */
    filterArn?: Arn;
    /**
     * The time at which the filter was created.
     */
    creationDateTime?: _Date;
    /**
     * The time at which the filter was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The ARN of the dataset group to which the filter belongs.
     */
    datasetGroupArn?: Arn;
    /**
     * If the filter failed, the reason for the failure.
     */
    failureReason?: FailureReason;
    /**
     * The status of the filter.
     */
    status?: Status;
  }
  export type Filters = FilterSummary[];
  export interface GetSolutionMetricsRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution version for which to get metrics.
     */
    solutionVersionArn: Arn;
  }
  export interface GetSolutionMetricsResponse {
    /**
     * The same solution version ARN as specified in the request.
     */
    solutionVersionArn?: Arn;
    /**
     * The metrics for the solution version. For more information, see  Evaluating a solution version with metrics .
     */
    metrics?: Metrics;
  }
  export interface HPOConfig {
    /**
     * The metric to optimize during HPO.  Amazon Personalize doesn't support configuring the hpoObjective at this time. 
     */
    hpoObjective?: HPOObjective;
    /**
     * Describes the resource configuration for HPO.
     */
    hpoResourceConfig?: HPOResourceConfig;
    /**
     * The hyperparameters and their allowable ranges.
     */
    algorithmHyperParameterRanges?: HyperParameterRanges;
  }
  export interface HPOObjective {
    /**
     * The type of the metric. Valid values are Maximize and Minimize.
     */
    type?: HPOObjectiveType;
    /**
     * The name of the metric.
     */
    metricName?: MetricName;
    /**
     * A regular expression for finding the metric in the training job logs.
     */
    metricRegex?: MetricRegex;
  }
  export type HPOObjectiveType = string;
  export type HPOResource = string;
  export interface HPOResourceConfig {
    /**
     * The maximum number of training jobs when you create a solution version. The maximum value for maxNumberOfTrainingJobs is 40.
     */
    maxNumberOfTrainingJobs?: HPOResource;
    /**
     * The maximum number of parallel training jobs when you create a solution version. The maximum value for maxParallelTrainingJobs is 10.
     */
    maxParallelTrainingJobs?: HPOResource;
  }
  export interface HyperParameterRanges {
    /**
     * The integer-valued hyperparameters and their ranges.
     */
    integerHyperParameterRanges?: IntegerHyperParameterRanges;
    /**
     * The continuous hyperparameters and their ranges.
     */
    continuousHyperParameterRanges?: ContinuousHyperParameterRanges;
    /**
     * The categorical hyperparameters and their ranges.
     */
    categoricalHyperParameterRanges?: CategoricalHyperParameterRanges;
  }
  export type HyperParameters = {[key: string]: ParameterValue};
  export type ImportMode = "FULL"|"INCREMENTAL"|string;
  export type IngestionMode = "BULK"|"PUT"|"ALL"|string;
  export interface IntegerHyperParameterRange {
    /**
     * The name of the hyperparameter.
     */
    name?: ParameterName;
    /**
     * The minimum allowable value for the hyperparameter.
     */
    minValue?: IntegerMinValue;
    /**
     * The maximum allowable value for the hyperparameter.
     */
    maxValue?: IntegerMaxValue;
  }
  export type IntegerHyperParameterRanges = IntegerHyperParameterRange[];
  export type IntegerMaxValue = number;
  export type IntegerMinValue = number;
  export type ItemAttribute = string;
  export type KmsKeyArn = string;
  export interface ListBatchInferenceJobsRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution version from which the batch inference jobs were created.
     */
    solutionVersionArn?: Arn;
    /**
     * The token to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of batch inference job results to return in each page. The default value is 100.
     */
    maxResults?: MaxResults;
  }
  export interface ListBatchInferenceJobsResponse {
    /**
     * A list containing information on each job that is returned.
     */
    batchInferenceJobs?: BatchInferenceJobs;
    /**
     * The token to use to retrieve the next page of results. The value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListBatchSegmentJobsRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution version that the batch segment jobs used to generate batch segments.
     */
    solutionVersionArn?: Arn;
    /**
     * The token to request the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of batch segment job results to return in each page. The default value is 100.
     */
    maxResults?: MaxResults;
  }
  export interface ListBatchSegmentJobsResponse {
    /**
     * A list containing information on each job that is returned.
     */
    batchSegmentJobs?: BatchSegmentJobs;
    /**
     * The token to use to retrieve the next page of results. The value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListCampaignsRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution to list the campaigns for. When a solution is not specified, all the campaigns associated with the account are listed.
     */
    solutionArn?: Arn;
    /**
     * A token returned from the previous call to ListCampaigns for getting the next set of campaigns (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of campaigns to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListCampaignsResponse {
    /**
     * A list of the campaigns.
     */
    campaigns?: Campaigns;
    /**
     * A token for getting the next set of campaigns (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListDatasetExportJobsRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset to list the dataset export jobs for.
     */
    datasetArn?: Arn;
    /**
     * A token returned from the previous call to ListDatasetExportJobs for getting the next set of dataset export jobs (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of dataset export jobs to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDatasetExportJobsResponse {
    /**
     * The list of dataset export jobs.
     */
    datasetExportJobs?: DatasetExportJobs;
    /**
     * A token for getting the next set of dataset export jobs (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListDatasetGroupsRequest {
    /**
     * A token returned from the previous call to ListDatasetGroups for getting the next set of dataset groups (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of dataset groups to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDatasetGroupsResponse {
    /**
     * The list of your dataset groups.
     */
    datasetGroups?: DatasetGroups;
    /**
     * A token for getting the next set of dataset groups (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListDatasetImportJobsRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset to list the dataset import jobs for.
     */
    datasetArn?: Arn;
    /**
     * A token returned from the previous call to ListDatasetImportJobs for getting the next set of dataset import jobs (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of dataset import jobs to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDatasetImportJobsResponse {
    /**
     * The list of dataset import jobs.
     */
    datasetImportJobs?: DatasetImportJobs;
    /**
     * A token for getting the next set of dataset import jobs (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListDatasetsRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset group that contains the datasets to list.
     */
    datasetGroupArn?: Arn;
    /**
     * A token returned from the previous call to ListDatasetImportJobs for getting the next set of dataset import jobs (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of datasets to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListDatasetsResponse {
    /**
     * An array of Dataset objects. Each object provides metadata information.
     */
    datasets?: Datasets;
    /**
     * A token for getting the next set of datasets (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListEventTrackersRequest {
    /**
     * The ARN of a dataset group used to filter the response.
     */
    datasetGroupArn?: Arn;
    /**
     * A token returned from the previous call to ListEventTrackers for getting the next set of event trackers (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of event trackers to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListEventTrackersResponse {
    /**
     * A list of event trackers.
     */
    eventTrackers?: EventTrackers;
    /**
     * A token for getting the next set of event trackers (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListFiltersRequest {
    /**
     * The ARN of the dataset group that contains the filters.
     */
    datasetGroupArn?: Arn;
    /**
     * A token returned from the previous call to ListFilters for getting the next set of filters (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of filters to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListFiltersResponse {
    /**
     * A list of returned filters.
     */
    Filters?: Filters;
    /**
     * A token for getting the next set of filters (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListMetricAttributionMetricsRequest {
    /**
     * The Amazon Resource Name (ARN) of the metric attribution to retrieve attributes for.
     */
    metricAttributionArn?: Arn;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of metrics to return in one page of results.
     */
    maxResults?: MaxResults;
  }
  export interface ListMetricAttributionMetricsResponse {
    /**
     * The metrics for the specified metric attribution.
     */
    metrics?: MetricAttributes;
    /**
     * Specify the pagination token from a previous ListMetricAttributionMetricsResponse request to retrieve the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListMetricAttributionsRequest {
    /**
     * The metric attributions' dataset group Amazon Resource Name (ARN).
     */
    datasetGroupArn?: Arn;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of metric attributions to return in one page of results.
     */
    maxResults?: MaxResults;
  }
  export interface ListMetricAttributionsResponse {
    /**
     * The list of metric attributions.
     */
    metricAttributions?: MetricAttributions;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListRecipesRequest {
    /**
     * The default is SERVICE.
     */
    recipeProvider?: RecipeProvider;
    /**
     * A token returned from the previous call to ListRecipes for getting the next set of recipes (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of recipes to return.
     */
    maxResults?: MaxResults;
    /**
     *  Filters returned recipes by domain for a Domain dataset group. Only recipes (Domain dataset group use cases) for this domain are included in the response. If you don't specify a domain, all recipes are returned. 
     */
    domain?: Domain;
  }
  export interface ListRecipesResponse {
    /**
     * The list of available recipes.
     */
    recipes?: Recipes;
    /**
     * A token for getting the next set of recipes.
     */
    nextToken?: NextToken;
  }
  export interface ListRecommendersRequest {
    /**
     * The Amazon Resource Name (ARN) of the Domain dataset group to list the recommenders for. When a Domain dataset group is not specified, all the recommenders associated with the account are listed.
     */
    datasetGroupArn?: Arn;
    /**
     * A token returned from the previous call to ListRecommenders for getting the next set of recommenders (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of recommenders to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListRecommendersResponse {
    /**
     * A list of the recommenders.
     */
    recommenders?: Recommenders;
    /**
     * A token for getting the next set of recommenders (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListSchemasRequest {
    /**
     * A token returned from the previous call to ListSchemas for getting the next set of schemas (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of schemas to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListSchemasResponse {
    /**
     * A list of schemas.
     */
    schemas?: Schemas;
    /**
     * A token used to get the next set of schemas (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListSolutionVersionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution.
     */
    solutionArn?: Arn;
    /**
     * A token returned from the previous call to ListSolutionVersions for getting the next set of solution versions (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of solution versions to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListSolutionVersionsResponse {
    /**
     * A list of solution versions describing the version properties.
     */
    solutionVersions?: SolutionVersions;
    /**
     * A token for getting the next set of solution versions (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListSolutionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    datasetGroupArn?: Arn;
    /**
     * A token returned from the previous call to ListSolutions for getting the next set of solutions (if they exist).
     */
    nextToken?: NextToken;
    /**
     * The maximum number of solutions to return.
     */
    maxResults?: MaxResults;
  }
  export interface ListSolutionsResponse {
    /**
     * A list of the current solutions.
     */
    solutions?: Solutions;
    /**
     * A token for getting the next set of solutions (if they exist).
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource's Amazon Resource Name.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The resource's tags.
     */
    tags?: Tags;
  }
  export type MaxResults = number;
  export interface MetricAttribute {
    /**
     * The metric's event type.
     */
    eventType: EventType;
    /**
     * The metric's name. The name helps you identify the metric in Amazon CloudWatch or Amazon S3.
     */
    metricName: MetricName;
    /**
     * The attribute's expression. Available functions are SUM() or SAMPLECOUNT(). For SUM() functions, provide the dataset type (either Interactions or Items) and column to sum as a parameter. For example SUM(Items.PRICE).
     */
    expression: MetricExpression;
  }
  export type MetricAttributes = MetricAttribute[];
  export type MetricAttributesNamesList = MetricName[];
  export interface MetricAttribution {
    /**
     * The metric attribution's name.
     */
    name?: Name;
    /**
     * The metric attribution's Amazon Resource Name (ARN).
     */
    metricAttributionArn?: Arn;
    /**
     * The metric attribution's dataset group Amazon Resource Name (ARN).
     */
    datasetGroupArn?: Arn;
    /**
     * The metric attribution's output configuration.
     */
    metricsOutputConfig?: MetricAttributionOutput;
    /**
     * The metric attribution's status.
     */
    status?: Status;
    /**
     * The metric attribution's creation date time.
     */
    creationDateTime?: _Date;
    /**
     * The metric attribution's last updated date time.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The metric attribution's failure reason.
     */
    failureReason?: FailureReason;
  }
  export interface MetricAttributionOutput {
    s3DataDestination?: S3DataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that has permissions to add data to your output Amazon S3 bucket and add metrics to Amazon CloudWatch. For more information, see Measuring impact of recommendations.
     */
    roleArn: RoleArn;
  }
  export interface MetricAttributionSummary {
    /**
     * The name of the metric attribution.
     */
    name?: Name;
    /**
     * The metric attribution's Amazon Resource Name (ARN).
     */
    metricAttributionArn?: Arn;
    /**
     * The metric attribution's status.
     */
    status?: Status;
    /**
     * The metric attribution's creation date time.
     */
    creationDateTime?: _Date;
    /**
     * The metric attribution's last updated date time.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The metric attribution's failure reason.
     */
    failureReason?: FailureReason;
  }
  export type MetricAttributions = MetricAttributionSummary[];
  export type MetricExpression = string;
  export type MetricName = string;
  export type MetricRegex = string;
  export type MetricValue = number;
  export type Metrics = {[key: string]: MetricValue};
  export type Name = string;
  export type NextToken = string;
  export type NumBatchResults = number;
  export type ObjectiveSensitivity = "LOW"|"MEDIUM"|"HIGH"|"OFF"|string;
  export interface OptimizationObjective {
    /**
     * The numerical metadata column in an Items dataset related to the optimization objective. For example, VIDEO_LENGTH (to maximize streaming minutes), or PRICE (to maximize revenue).
     */
    itemAttribute?: ItemAttribute;
    /**
     * Specifies how Amazon Personalize balances the importance of your optimization objective versus relevance.
     */
    objectiveSensitivity?: ObjectiveSensitivity;
  }
  export type ParameterName = string;
  export type ParameterValue = string;
  export type PerformAutoML = boolean;
  export type PerformHPO = boolean;
  export interface Recipe {
    /**
     * The name of the recipe.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the recipe.
     */
    recipeArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the algorithm that Amazon Personalize uses to train the model.
     */
    algorithmArn?: Arn;
    /**
     * The ARN of the FeatureTransformation object.
     */
    featureTransformationArn?: Arn;
    /**
     * The status of the recipe.
     */
    status?: Status;
    /**
     * The description of the recipe.
     */
    description?: Description;
    /**
     * The date and time (in Unix format) that the recipe was created.
     */
    creationDateTime?: _Date;
    /**
     * One of the following values:   PERSONALIZED_RANKING   RELATED_ITEMS   USER_PERSONALIZATION  
     */
    recipeType?: RecipeType;
    /**
     * The date and time (in Unix format) that the recipe was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export type RecipeProvider = "SERVICE"|string;
  export interface RecipeSummary {
    /**
     * The name of the recipe.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the recipe.
     */
    recipeArn?: Arn;
    /**
     * The status of the recipe.
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the recipe was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the recipe was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The domain of the recipe (if the recipe is a Domain dataset group use case).
     */
    domain?: Domain;
  }
  export type RecipeType = string;
  export type Recipes = RecipeSummary[];
  export interface Recommender {
    /**
     * The Amazon Resource Name (ARN) of the recommender.
     */
    recommenderArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the Domain dataset group that contains the recommender.
     */
    datasetGroupArn?: Arn;
    /**
     * The name of the recommender.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the recipe (Domain dataset group use case) that the recommender was created for. 
     */
    recipeArn?: Arn;
    /**
     * The configuration details of the recommender.
     */
    recommenderConfig?: RecommenderConfig;
    /**
     * The date and time (in Unix format) that the recommender was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix format) that the recommender was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The status of the recommender. A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * If a recommender fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
    /**
     * Provides a summary of the latest updates to the recommender. 
     */
    latestRecommenderUpdate?: RecommenderUpdateSummary;
    /**
     * Provides evaluation metrics that help you determine the performance of a recommender. For more information, see  Evaluating a recommender.
     */
    modelMetrics?: Metrics;
  }
  export interface RecommenderConfig {
    /**
     * Specifies the exploration configuration hyperparameters, including explorationWeight and explorationItemAgeCutOff, you want to use to configure the amount of item exploration Amazon Personalize uses when recommending items. Provide itemExplorationConfig data only if your recommenders generate personalized recommendations for a user (not popular items or similar items).
     */
    itemExplorationConfig?: HyperParameters;
    /**
     * Specifies the requested minimum provisioned recommendation requests per second that Amazon Personalize will support. A high minRecommendationRequestsPerSecond will increase your bill. We recommend starting with 1 for minRecommendationRequestsPerSecond (the default). Track your usage using Amazon CloudWatch metrics, and increase the minRecommendationRequestsPerSecond as necessary.
     */
    minRecommendationRequestsPerSecond?: TransactionsPerSecond;
    /**
     *  Specifies the training data configuration to use when creating a domain recommender. 
     */
    trainingDataConfig?: TrainingDataConfig;
  }
  export interface RecommenderSummary {
    /**
     * The name of the recommender.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the recommender.
     */
    recommenderArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the Domain dataset group that contains the recommender.
     */
    datasetGroupArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the recipe (Domain dataset group use case) that the recommender was created for.
     */
    recipeArn?: Arn;
    /**
     * The configuration details of the recommender.
     */
    recommenderConfig?: RecommenderConfig;
    /**
     * The status of the recommender. A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The date and time (in Unix format) that the recommender was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix format) that the recommender was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export interface RecommenderUpdateSummary {
    /**
     * The configuration details of the recommender update.
     */
    recommenderConfig?: RecommenderConfig;
    /**
     * The date and time (in Unix format) that the recommender update was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the recommender update was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The status of the recommender update. A recommender can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   STOP PENDING &gt; STOP IN_PROGRESS &gt; INACTIVE &gt; START PENDING &gt; START IN_PROGRESS &gt; ACTIVE   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * If a recommender update fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
  }
  export type Recommenders = RecommenderSummary[];
  export type ResourceConfig = {[key: string]: ParameterValue};
  export type RoleArn = string;
  export interface S3DataConfig {
    /**
     * The file path of the Amazon S3 bucket.
     */
    path: S3Location;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS) key that Amazon Personalize uses to encrypt or decrypt the input and output files.
     */
    kmsKeyArn?: KmsKeyArn;
  }
  export type S3Location = string;
  export type Schemas = DatasetSchemaSummary[];
  export interface Solution {
    /**
     * The name of the solution.
     */
    name?: Name;
    /**
     * The ARN of the solution.
     */
    solutionArn?: Arn;
    /**
     * Whether to perform hyperparameter optimization (HPO) on the chosen recipe. The default is false.
     */
    performHPO?: PerformHPO;
    /**
     *  We don't recommend enabling automated machine learning. Instead, match your use case to the available Amazon Personalize recipes. For more information, see Determining your use case.   When true, Amazon Personalize performs a search for the best USER_PERSONALIZATION recipe from the list specified in the solution configuration (recipeArn must not be specified). When false (the default), Amazon Personalize uses recipeArn for training.
     */
    performAutoML?: PerformAutoML;
    /**
     * The ARN of the recipe used to create the solution. This is required when performAutoML is false.
     */
    recipeArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that provides the training data.
     */
    datasetGroupArn?: Arn;
    /**
     * The event type (for example, 'click' or 'like') that is used for training the model. If no eventType is provided, Amazon Personalize uses all interactions for training with equal weight regardless of type.
     */
    eventType?: EventType;
    /**
     * Describes the configuration properties for the solution.
     */
    solutionConfig?: SolutionConfig;
    /**
     * When performAutoML is true, specifies the best recipe found.
     */
    autoMLResult?: AutoMLResult;
    /**
     * The status of the solution. A solution can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The creation date and time (in Unix time) of the solution.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the solution was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * Describes the latest version of the solution, including the status and the ARN.
     */
    latestSolutionVersion?: SolutionVersionSummary;
  }
  export interface SolutionConfig {
    /**
     * Only events with a value greater than or equal to this threshold are used for training a model.
     */
    eventValueThreshold?: EventValueThreshold;
    /**
     * Describes the properties for hyperparameter optimization (HPO).
     */
    hpoConfig?: HPOConfig;
    /**
     * Lists the hyperparameter names and ranges.
     */
    algorithmHyperParameters?: HyperParameters;
    /**
     * Lists the feature transformation parameters.
     */
    featureTransformationParameters?: FeatureTransformationParameters;
    /**
     * The AutoMLConfig object containing a list of recipes to search when AutoML is performed.
     */
    autoMLConfig?: AutoMLConfig;
    /**
     * Describes the additional objective for the solution, such as maximizing streaming minutes or increasing revenue. For more information see Optimizing a solution.
     */
    optimizationObjective?: OptimizationObjective;
    /**
     *  Specifies the training data configuration to use when creating a custom solution version (trained model). 
     */
    trainingDataConfig?: TrainingDataConfig;
  }
  export interface SolutionSummary {
    /**
     * The name of the solution.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the solution.
     */
    solutionArn?: Arn;
    /**
     * The status of the solution. A solution can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED   DELETE PENDING &gt; DELETE IN_PROGRESS  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that the solution was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the solution was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the recipe used by the solution.
     */
    recipeArn?: Arn;
  }
  export interface SolutionVersion {
    /**
     * The name of the solution version.
     */
    name?: Name;
    /**
     * The ARN of the solution version.
     */
    solutionVersionArn?: Arn;
    /**
     * The ARN of the solution.
     */
    solutionArn?: Arn;
    /**
     * Whether to perform hyperparameter optimization (HPO) on the chosen recipe. The default is false.
     */
    performHPO?: PerformHPO;
    /**
     * When true, Amazon Personalize searches for the most optimal recipe according to the solution configuration. When false (the default), Amazon Personalize uses recipeArn.
     */
    performAutoML?: PerformAutoML;
    /**
     * The ARN of the recipe used in the solution.
     */
    recipeArn?: Arn;
    /**
     * The event type (for example, 'click' or 'like') that is used for training the model.
     */
    eventType?: EventType;
    /**
     * The Amazon Resource Name (ARN) of the dataset group providing the training data.
     */
    datasetGroupArn?: Arn;
    /**
     * Describes the configuration properties for the solution.
     */
    solutionConfig?: SolutionConfig;
    /**
     * The time used to train the model. You are billed for the time it takes to train a model. This field is visible only after Amazon Personalize successfully trains a model.
     */
    trainingHours?: TrainingHours;
    /**
     * The scope of training to be performed when creating the solution version. The FULL option trains the solution version based on the entirety of the input solution's training data, while the UPDATE option processes only the data that has changed in comparison to the input solution. Choose UPDATE when you want to incrementally update your solution version instead of creating an entirely new one.  The UPDATE option can only be used when you already have an active solution version created from the input solution using the FULL option and the input solution was trained with the User-Personalization recipe or the HRNN-Coldstart recipe. 
     */
    trainingMode?: TrainingMode;
    /**
     * If hyperparameter optimization was performed, contains the hyperparameter values of the best performing model.
     */
    tunedHPOParams?: TunedHPOParams;
    /**
     * The status of the solution version. A solution version can be in one of the following states:   CREATE PENDING   CREATE IN_PROGRESS   ACTIVE   CREATE FAILED   CREATE STOPPING   CREATE STOPPED  
     */
    status?: Status;
    /**
     * If training a solution version fails, the reason for the failure.
     */
    failureReason?: FailureReason;
    /**
     * The date and time (in Unix time) that this version of the solution was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the solution was last updated.
     */
    lastUpdatedDateTime?: _Date;
  }
  export interface SolutionVersionSummary {
    /**
     * The Amazon Resource Name (ARN) of the solution version.
     */
    solutionVersionArn?: Arn;
    /**
     * The status of the solution version. A solution version can be in one of the following states:   CREATE PENDING &gt; CREATE IN_PROGRESS &gt; ACTIVE -or- CREATE FAILED  
     */
    status?: Status;
    /**
     * The date and time (in Unix time) that this version of a solution was created.
     */
    creationDateTime?: _Date;
    /**
     * The date and time (in Unix time) that the solution version was last updated.
     */
    lastUpdatedDateTime?: _Date;
    /**
     * If a solution version fails, the reason behind the failure.
     */
    failureReason?: FailureReason;
  }
  export type SolutionVersions = SolutionVersionSummary[];
  export type Solutions = SolutionSummary[];
  export interface StartRecommenderRequest {
    /**
     * The Amazon Resource Name (ARN) of the recommender to start.
     */
    recommenderArn: Arn;
  }
  export interface StartRecommenderResponse {
    /**
     * The Amazon Resource Name (ARN) of the recommender you started.
     */
    recommenderArn?: Arn;
  }
  export type Status = string;
  export interface StopRecommenderRequest {
    /**
     * The Amazon Resource Name (ARN) of the recommender to stop.
     */
    recommenderArn: Arn;
  }
  export interface StopRecommenderResponse {
    /**
     * The Amazon Resource Name (ARN) of the recommender you stopped.
     */
    recommenderArn?: Arn;
  }
  export interface StopSolutionVersionCreationRequest {
    /**
     * The Amazon Resource Name (ARN) of the solution version you want to stop creating.
     */
    solutionVersionArn: Arn;
  }
  export interface Tag {
    /**
     * One part of a key-value pair that makes up a tag. A key is a general label that acts like a category for more specific tag values.
     */
    tagKey: TagKey;
    /**
     * The optional part of a key-value pair that makes up a tag. A value acts as a descriptor within a tag category (key).
     */
    tagValue: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The resource's Amazon Resource Name (ARN).
     */
    resourceArn: Arn;
    /**
     * Tags to apply to the resource. For more information see Tagging Amazon Personalize recources.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type TrackingId = string;
  export interface TrainingDataConfig {
    /**
     * Specifies the columns to exclude from training. Each key is a dataset type, and each value is a list of columns. Exclude columns to control what data Amazon Personalize uses to generate recommendations. For example, you might have a column that you want to use only to filter recommendations. You can exclude this column from training and Amazon Personalize considers it only when filtering. 
     */
    excludedDatasetColumns?: ExcludedDatasetColumns;
  }
  export type TrainingHours = number;
  export type TrainingInputMode = string;
  export type TrainingMode = "FULL"|"UPDATE"|string;
  export type TransactionsPerSecond = number;
  export type Tunable = boolean;
  export interface TunedHPOParams {
    /**
     * A list of the hyperparameter values of the best performing model.
     */
    algorithmHyperParameters?: HyperParameters;
  }
  export interface UntagResourceRequest {
    /**
     * The resource's Amazon Resource Name (ARN).
     */
    resourceArn: Arn;
    /**
     * Keys to remove from the resource's tags.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateCampaignRequest {
    /**
     * The Amazon Resource Name (ARN) of the campaign.
     */
    campaignArn: Arn;
    /**
     * The ARN of a new solution version to deploy.
     */
    solutionVersionArn?: Arn;
    /**
     * Specifies the requested minimum provisioned transactions (recommendations) per second that Amazon Personalize will support. A high minProvisionedTPS will increase your bill. We recommend starting with 1 for minProvisionedTPS (the default). Track your usage using Amazon CloudWatch metrics, and increase the minProvisionedTPS as necessary.
     */
    minProvisionedTPS?: TransactionsPerSecond;
    /**
     * The configuration details of a campaign.
     */
    campaignConfig?: CampaignConfig;
  }
  export interface UpdateCampaignResponse {
    /**
     * The same campaign ARN as given in the request.
     */
    campaignArn?: Arn;
  }
  export interface UpdateDatasetRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset that you want to update.
     */
    datasetArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the new schema you want use.
     */
    schemaArn: Arn;
  }
  export interface UpdateDatasetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset you updated.
     */
    datasetArn?: Arn;
  }
  export interface UpdateMetricAttributionRequest {
    /**
     * Add new metric attributes to the metric attribution.
     */
    addMetrics?: MetricAttributes;
    /**
     * Remove metric attributes from the metric attribution.
     */
    removeMetrics?: MetricAttributesNamesList;
    /**
     * An output config for the metric attribution.
     */
    metricsOutputConfig?: MetricAttributionOutput;
    /**
     * The Amazon Resource Name (ARN) for the metric attribution to update.
     */
    metricAttributionArn?: Arn;
  }
  export interface UpdateMetricAttributionResponse {
    /**
     * The Amazon Resource Name (ARN) for the metric attribution that you updated.
     */
    metricAttributionArn?: Arn;
  }
  export interface UpdateRecommenderRequest {
    /**
     * The Amazon Resource Name (ARN) of the recommender to modify.
     */
    recommenderArn: Arn;
    /**
     * The configuration details of the recommender.
     */
    recommenderConfig: RecommenderConfig;
  }
  export interface UpdateRecommenderResponse {
    /**
     * The same recommender Amazon Resource Name (ARN) as given in the request.
     */
    recommenderArn?: Arn;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-22"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Personalize client.
   */
  export import Types = Personalize;
}
export = Personalize;
