import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Comprehend extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Comprehend.Types.ClientConfiguration)
  config: Config & Comprehend.Types.ClientConfiguration;
  /**
   * Determines the dominant language of the input text for a batch of documents. For a list of languages that Amazon Comprehend can detect, see Amazon Comprehend Supported Languages. 
   */
  batchDetectDominantLanguage(params: Comprehend.Types.BatchDetectDominantLanguageRequest, callback?: (err: AWSError, data: Comprehend.Types.BatchDetectDominantLanguageResponse) => void): Request<Comprehend.Types.BatchDetectDominantLanguageResponse, AWSError>;
  /**
   * Determines the dominant language of the input text for a batch of documents. For a list of languages that Amazon Comprehend can detect, see Amazon Comprehend Supported Languages. 
   */
  batchDetectDominantLanguage(callback?: (err: AWSError, data: Comprehend.Types.BatchDetectDominantLanguageResponse) => void): Request<Comprehend.Types.BatchDetectDominantLanguageResponse, AWSError>;
  /**
   * Inspects the text of a batch of documents for named entities and returns information about them. For more information about named entities, see Entities in the Comprehend Developer Guide. 
   */
  batchDetectEntities(params: Comprehend.Types.BatchDetectEntitiesRequest, callback?: (err: AWSError, data: Comprehend.Types.BatchDetectEntitiesResponse) => void): Request<Comprehend.Types.BatchDetectEntitiesResponse, AWSError>;
  /**
   * Inspects the text of a batch of documents for named entities and returns information about them. For more information about named entities, see Entities in the Comprehend Developer Guide. 
   */
  batchDetectEntities(callback?: (err: AWSError, data: Comprehend.Types.BatchDetectEntitiesResponse) => void): Request<Comprehend.Types.BatchDetectEntitiesResponse, AWSError>;
  /**
   * Detects the key noun phrases found in a batch of documents.
   */
  batchDetectKeyPhrases(params: Comprehend.Types.BatchDetectKeyPhrasesRequest, callback?: (err: AWSError, data: Comprehend.Types.BatchDetectKeyPhrasesResponse) => void): Request<Comprehend.Types.BatchDetectKeyPhrasesResponse, AWSError>;
  /**
   * Detects the key noun phrases found in a batch of documents.
   */
  batchDetectKeyPhrases(callback?: (err: AWSError, data: Comprehend.Types.BatchDetectKeyPhrasesResponse) => void): Request<Comprehend.Types.BatchDetectKeyPhrasesResponse, AWSError>;
  /**
   * Inspects a batch of documents and returns an inference of the prevailing sentiment, POSITIVE, NEUTRAL, MIXED, or NEGATIVE, in each one.
   */
  batchDetectSentiment(params: Comprehend.Types.BatchDetectSentimentRequest, callback?: (err: AWSError, data: Comprehend.Types.BatchDetectSentimentResponse) => void): Request<Comprehend.Types.BatchDetectSentimentResponse, AWSError>;
  /**
   * Inspects a batch of documents and returns an inference of the prevailing sentiment, POSITIVE, NEUTRAL, MIXED, or NEGATIVE, in each one.
   */
  batchDetectSentiment(callback?: (err: AWSError, data: Comprehend.Types.BatchDetectSentimentResponse) => void): Request<Comprehend.Types.BatchDetectSentimentResponse, AWSError>;
  /**
   * Inspects the text of a batch of documents for the syntax and part of speech of the words in the document and returns information about them. For more information, see Syntax in the Comprehend Developer Guide. 
   */
  batchDetectSyntax(params: Comprehend.Types.BatchDetectSyntaxRequest, callback?: (err: AWSError, data: Comprehend.Types.BatchDetectSyntaxResponse) => void): Request<Comprehend.Types.BatchDetectSyntaxResponse, AWSError>;
  /**
   * Inspects the text of a batch of documents for the syntax and part of speech of the words in the document and returns information about them. For more information, see Syntax in the Comprehend Developer Guide. 
   */
  batchDetectSyntax(callback?: (err: AWSError, data: Comprehend.Types.BatchDetectSyntaxResponse) => void): Request<Comprehend.Types.BatchDetectSyntaxResponse, AWSError>;
  /**
   * Inspects a batch of documents and returns a sentiment analysis for each entity identified in the documents. For more information about targeted sentiment, see Targeted sentiment.
   */
  batchDetectTargetedSentiment(params: Comprehend.Types.BatchDetectTargetedSentimentRequest, callback?: (err: AWSError, data: Comprehend.Types.BatchDetectTargetedSentimentResponse) => void): Request<Comprehend.Types.BatchDetectTargetedSentimentResponse, AWSError>;
  /**
   * Inspects a batch of documents and returns a sentiment analysis for each entity identified in the documents. For more information about targeted sentiment, see Targeted sentiment.
   */
  batchDetectTargetedSentiment(callback?: (err: AWSError, data: Comprehend.Types.BatchDetectTargetedSentimentResponse) => void): Request<Comprehend.Types.BatchDetectTargetedSentimentResponse, AWSError>;
  /**
   * Creates a new document classification request to analyze a single document in real-time, using a previously created and trained custom model and an endpoint. You can input plain text or you can upload a single-page input document (text, PDF, Word, or image).  If the system detects errors while processing a page in the input document, the API response includes an entry in Errors that describes the errors. If the system detects a document-level error in your input document, the API returns an InvalidRequestException error response. For details about this exception, see  Errors in semi-structured documents in the Comprehend Developer Guide. 
   */
  classifyDocument(params: Comprehend.Types.ClassifyDocumentRequest, callback?: (err: AWSError, data: Comprehend.Types.ClassifyDocumentResponse) => void): Request<Comprehend.Types.ClassifyDocumentResponse, AWSError>;
  /**
   * Creates a new document classification request to analyze a single document in real-time, using a previously created and trained custom model and an endpoint. You can input plain text or you can upload a single-page input document (text, PDF, Word, or image).  If the system detects errors while processing a page in the input document, the API response includes an entry in Errors that describes the errors. If the system detects a document-level error in your input document, the API returns an InvalidRequestException error response. For details about this exception, see  Errors in semi-structured documents in the Comprehend Developer Guide. 
   */
  classifyDocument(callback?: (err: AWSError, data: Comprehend.Types.ClassifyDocumentResponse) => void): Request<Comprehend.Types.ClassifyDocumentResponse, AWSError>;
  /**
   * Analyzes input text for the presence of personally identifiable information (PII) and returns the labels of identified PII entity types such as name, address, bank account number, or phone number.
   */
  containsPiiEntities(params: Comprehend.Types.ContainsPiiEntitiesRequest, callback?: (err: AWSError, data: Comprehend.Types.ContainsPiiEntitiesResponse) => void): Request<Comprehend.Types.ContainsPiiEntitiesResponse, AWSError>;
  /**
   * Analyzes input text for the presence of personally identifiable information (PII) and returns the labels of identified PII entity types such as name, address, bank account number, or phone number.
   */
  containsPiiEntities(callback?: (err: AWSError, data: Comprehend.Types.ContainsPiiEntitiesResponse) => void): Request<Comprehend.Types.ContainsPiiEntitiesResponse, AWSError>;
  /**
   * Creates a dataset to upload training or test data for a model associated with a flywheel. For more information about datasets, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  createDataset(params: Comprehend.Types.CreateDatasetRequest, callback?: (err: AWSError, data: Comprehend.Types.CreateDatasetResponse) => void): Request<Comprehend.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a dataset to upload training or test data for a model associated with a flywheel. For more information about datasets, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  createDataset(callback?: (err: AWSError, data: Comprehend.Types.CreateDatasetResponse) => void): Request<Comprehend.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a new document classifier that you can use to categorize documents. To create a classifier, you provide a set of training documents that are labeled with the categories that you want to use. For more information, see Training classifier models in the Comprehend Developer Guide. 
   */
  createDocumentClassifier(params: Comprehend.Types.CreateDocumentClassifierRequest, callback?: (err: AWSError, data: Comprehend.Types.CreateDocumentClassifierResponse) => void): Request<Comprehend.Types.CreateDocumentClassifierResponse, AWSError>;
  /**
   * Creates a new document classifier that you can use to categorize documents. To create a classifier, you provide a set of training documents that are labeled with the categories that you want to use. For more information, see Training classifier models in the Comprehend Developer Guide. 
   */
  createDocumentClassifier(callback?: (err: AWSError, data: Comprehend.Types.CreateDocumentClassifierResponse) => void): Request<Comprehend.Types.CreateDocumentClassifierResponse, AWSError>;
  /**
   * Creates a model-specific endpoint for synchronous inference for a previously trained custom model For information about endpoints, see Managing endpoints.
   */
  createEndpoint(params: Comprehend.Types.CreateEndpointRequest, callback?: (err: AWSError, data: Comprehend.Types.CreateEndpointResponse) => void): Request<Comprehend.Types.CreateEndpointResponse, AWSError>;
  /**
   * Creates a model-specific endpoint for synchronous inference for a previously trained custom model For information about endpoints, see Managing endpoints.
   */
  createEndpoint(callback?: (err: AWSError, data: Comprehend.Types.CreateEndpointResponse) => void): Request<Comprehend.Types.CreateEndpointResponse, AWSError>;
  /**
   * Creates an entity recognizer using submitted files. After your CreateEntityRecognizer request is submitted, you can check job status using the DescribeEntityRecognizer API. 
   */
  createEntityRecognizer(params: Comprehend.Types.CreateEntityRecognizerRequest, callback?: (err: AWSError, data: Comprehend.Types.CreateEntityRecognizerResponse) => void): Request<Comprehend.Types.CreateEntityRecognizerResponse, AWSError>;
  /**
   * Creates an entity recognizer using submitted files. After your CreateEntityRecognizer request is submitted, you can check job status using the DescribeEntityRecognizer API. 
   */
  createEntityRecognizer(callback?: (err: AWSError, data: Comprehend.Types.CreateEntityRecognizerResponse) => void): Request<Comprehend.Types.CreateEntityRecognizerResponse, AWSError>;
  /**
   * A flywheel is an Amazon Web Services resource that orchestrates the ongoing training of a model for custom classification or custom entity recognition. You can create a flywheel to start with an existing trained model, or Comprehend can create and train a new model. When you create the flywheel, Comprehend creates a data lake in your account. The data lake holds the training data and test data for all versions of the model. To use a flywheel with an existing trained model, you specify the active model version. Comprehend copies the model's training data and test data into the flywheel's data lake. To use the flywheel with a new model, you need to provide a dataset for training data (and optional test data) when you create the flywheel. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  createFlywheel(params: Comprehend.Types.CreateFlywheelRequest, callback?: (err: AWSError, data: Comprehend.Types.CreateFlywheelResponse) => void): Request<Comprehend.Types.CreateFlywheelResponse, AWSError>;
  /**
   * A flywheel is an Amazon Web Services resource that orchestrates the ongoing training of a model for custom classification or custom entity recognition. You can create a flywheel to start with an existing trained model, or Comprehend can create and train a new model. When you create the flywheel, Comprehend creates a data lake in your account. The data lake holds the training data and test data for all versions of the model. To use a flywheel with an existing trained model, you specify the active model version. Comprehend copies the model's training data and test data into the flywheel's data lake. To use the flywheel with a new model, you need to provide a dataset for training data (and optional test data) when you create the flywheel. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  createFlywheel(callback?: (err: AWSError, data: Comprehend.Types.CreateFlywheelResponse) => void): Request<Comprehend.Types.CreateFlywheelResponse, AWSError>;
  /**
   * Deletes a previously created document classifier Only those classifiers that are in terminated states (IN_ERROR, TRAINED) will be deleted. If an active inference job is using the model, a ResourceInUseException will be returned. This is an asynchronous action that puts the classifier into a DELETING state, and it is then removed by a background job. Once removed, the classifier disappears from your account and is no longer available for use. 
   */
  deleteDocumentClassifier(params: Comprehend.Types.DeleteDocumentClassifierRequest, callback?: (err: AWSError, data: Comprehend.Types.DeleteDocumentClassifierResponse) => void): Request<Comprehend.Types.DeleteDocumentClassifierResponse, AWSError>;
  /**
   * Deletes a previously created document classifier Only those classifiers that are in terminated states (IN_ERROR, TRAINED) will be deleted. If an active inference job is using the model, a ResourceInUseException will be returned. This is an asynchronous action that puts the classifier into a DELETING state, and it is then removed by a background job. Once removed, the classifier disappears from your account and is no longer available for use. 
   */
  deleteDocumentClassifier(callback?: (err: AWSError, data: Comprehend.Types.DeleteDocumentClassifierResponse) => void): Request<Comprehend.Types.DeleteDocumentClassifierResponse, AWSError>;
  /**
   * Deletes a model-specific endpoint for a previously-trained custom model. All endpoints must be deleted in order for the model to be deleted. For information about endpoints, see Managing endpoints.
   */
  deleteEndpoint(params: Comprehend.Types.DeleteEndpointRequest, callback?: (err: AWSError, data: Comprehend.Types.DeleteEndpointResponse) => void): Request<Comprehend.Types.DeleteEndpointResponse, AWSError>;
  /**
   * Deletes a model-specific endpoint for a previously-trained custom model. All endpoints must be deleted in order for the model to be deleted. For information about endpoints, see Managing endpoints.
   */
  deleteEndpoint(callback?: (err: AWSError, data: Comprehend.Types.DeleteEndpointResponse) => void): Request<Comprehend.Types.DeleteEndpointResponse, AWSError>;
  /**
   * Deletes an entity recognizer. Only those recognizers that are in terminated states (IN_ERROR, TRAINED) will be deleted. If an active inference job is using the model, a ResourceInUseException will be returned. This is an asynchronous action that puts the recognizer into a DELETING state, and it is then removed by a background job. Once removed, the recognizer disappears from your account and is no longer available for use. 
   */
  deleteEntityRecognizer(params: Comprehend.Types.DeleteEntityRecognizerRequest, callback?: (err: AWSError, data: Comprehend.Types.DeleteEntityRecognizerResponse) => void): Request<Comprehend.Types.DeleteEntityRecognizerResponse, AWSError>;
  /**
   * Deletes an entity recognizer. Only those recognizers that are in terminated states (IN_ERROR, TRAINED) will be deleted. If an active inference job is using the model, a ResourceInUseException will be returned. This is an asynchronous action that puts the recognizer into a DELETING state, and it is then removed by a background job. Once removed, the recognizer disappears from your account and is no longer available for use. 
   */
  deleteEntityRecognizer(callback?: (err: AWSError, data: Comprehend.Types.DeleteEntityRecognizerResponse) => void): Request<Comprehend.Types.DeleteEntityRecognizerResponse, AWSError>;
  /**
   * Deletes a flywheel. When you delete the flywheel, Amazon Comprehend does not delete the data lake or the model associated with the flywheel. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  deleteFlywheel(params: Comprehend.Types.DeleteFlywheelRequest, callback?: (err: AWSError, data: Comprehend.Types.DeleteFlywheelResponse) => void): Request<Comprehend.Types.DeleteFlywheelResponse, AWSError>;
  /**
   * Deletes a flywheel. When you delete the flywheel, Amazon Comprehend does not delete the data lake or the model associated with the flywheel. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  deleteFlywheel(callback?: (err: AWSError, data: Comprehend.Types.DeleteFlywheelResponse) => void): Request<Comprehend.Types.DeleteFlywheelResponse, AWSError>;
  /**
   * Deletes a resource-based policy that is attached to a custom model.
   */
  deleteResourcePolicy(params: Comprehend.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: Comprehend.Types.DeleteResourcePolicyResponse) => void): Request<Comprehend.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a resource-based policy that is attached to a custom model.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: Comprehend.Types.DeleteResourcePolicyResponse) => void): Request<Comprehend.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Returns information about the dataset that you specify. For more information about datasets, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  describeDataset(params: Comprehend.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeDatasetResponse) => void): Request<Comprehend.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Returns information about the dataset that you specify. For more information about datasets, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  describeDataset(callback?: (err: AWSError, data: Comprehend.Types.DescribeDatasetResponse) => void): Request<Comprehend.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Gets the properties associated with a document classification job. Use this operation to get the status of a classification job.
   */
  describeDocumentClassificationJob(params: Comprehend.Types.DescribeDocumentClassificationJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeDocumentClassificationJobResponse) => void): Request<Comprehend.Types.DescribeDocumentClassificationJobResponse, AWSError>;
  /**
   * Gets the properties associated with a document classification job. Use this operation to get the status of a classification job.
   */
  describeDocumentClassificationJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeDocumentClassificationJobResponse) => void): Request<Comprehend.Types.DescribeDocumentClassificationJobResponse, AWSError>;
  /**
   * Gets the properties associated with a document classifier.
   */
  describeDocumentClassifier(params: Comprehend.Types.DescribeDocumentClassifierRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeDocumentClassifierResponse) => void): Request<Comprehend.Types.DescribeDocumentClassifierResponse, AWSError>;
  /**
   * Gets the properties associated with a document classifier.
   */
  describeDocumentClassifier(callback?: (err: AWSError, data: Comprehend.Types.DescribeDocumentClassifierResponse) => void): Request<Comprehend.Types.DescribeDocumentClassifierResponse, AWSError>;
  /**
   * Gets the properties associated with a dominant language detection job. Use this operation to get the status of a detection job.
   */
  describeDominantLanguageDetectionJob(params: Comprehend.Types.DescribeDominantLanguageDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeDominantLanguageDetectionJobResponse) => void): Request<Comprehend.Types.DescribeDominantLanguageDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a dominant language detection job. Use this operation to get the status of a detection job.
   */
  describeDominantLanguageDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeDominantLanguageDetectionJobResponse) => void): Request<Comprehend.Types.DescribeDominantLanguageDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a specific endpoint. Use this operation to get the status of an endpoint. For information about endpoints, see Managing endpoints.
   */
  describeEndpoint(params: Comprehend.Types.DescribeEndpointRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeEndpointResponse) => void): Request<Comprehend.Types.DescribeEndpointResponse, AWSError>;
  /**
   * Gets the properties associated with a specific endpoint. Use this operation to get the status of an endpoint. For information about endpoints, see Managing endpoints.
   */
  describeEndpoint(callback?: (err: AWSError, data: Comprehend.Types.DescribeEndpointResponse) => void): Request<Comprehend.Types.DescribeEndpointResponse, AWSError>;
  /**
   * Gets the properties associated with an entities detection job. Use this operation to get the status of a detection job.
   */
  describeEntitiesDetectionJob(params: Comprehend.Types.DescribeEntitiesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.DescribeEntitiesDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with an entities detection job. Use this operation to get the status of a detection job.
   */
  describeEntitiesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.DescribeEntitiesDetectionJobResponse, AWSError>;
  /**
   * Provides details about an entity recognizer including status, S3 buckets containing training data, recognizer metadata, metrics, and so on.
   */
  describeEntityRecognizer(params: Comprehend.Types.DescribeEntityRecognizerRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeEntityRecognizerResponse) => void): Request<Comprehend.Types.DescribeEntityRecognizerResponse, AWSError>;
  /**
   * Provides details about an entity recognizer including status, S3 buckets containing training data, recognizer metadata, metrics, and so on.
   */
  describeEntityRecognizer(callback?: (err: AWSError, data: Comprehend.Types.DescribeEntityRecognizerResponse) => void): Request<Comprehend.Types.DescribeEntityRecognizerResponse, AWSError>;
  /**
   * Gets the status and details of an events detection job.
   */
  describeEventsDetectionJob(params: Comprehend.Types.DescribeEventsDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeEventsDetectionJobResponse) => void): Request<Comprehend.Types.DescribeEventsDetectionJobResponse, AWSError>;
  /**
   * Gets the status and details of an events detection job.
   */
  describeEventsDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeEventsDetectionJobResponse) => void): Request<Comprehend.Types.DescribeEventsDetectionJobResponse, AWSError>;
  /**
   * Provides configuration information about the flywheel. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  describeFlywheel(params: Comprehend.Types.DescribeFlywheelRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeFlywheelResponse) => void): Request<Comprehend.Types.DescribeFlywheelResponse, AWSError>;
  /**
   * Provides configuration information about the flywheel. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  describeFlywheel(callback?: (err: AWSError, data: Comprehend.Types.DescribeFlywheelResponse) => void): Request<Comprehend.Types.DescribeFlywheelResponse, AWSError>;
  /**
   * Retrieve the configuration properties of a flywheel iteration. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  describeFlywheelIteration(params: Comprehend.Types.DescribeFlywheelIterationRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeFlywheelIterationResponse) => void): Request<Comprehend.Types.DescribeFlywheelIterationResponse, AWSError>;
  /**
   * Retrieve the configuration properties of a flywheel iteration. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  describeFlywheelIteration(callback?: (err: AWSError, data: Comprehend.Types.DescribeFlywheelIterationResponse) => void): Request<Comprehend.Types.DescribeFlywheelIterationResponse, AWSError>;
  /**
   * Gets the properties associated with a key phrases detection job. Use this operation to get the status of a detection job.
   */
  describeKeyPhrasesDetectionJob(params: Comprehend.Types.DescribeKeyPhrasesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeKeyPhrasesDetectionJobResponse) => void): Request<Comprehend.Types.DescribeKeyPhrasesDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a key phrases detection job. Use this operation to get the status of a detection job.
   */
  describeKeyPhrasesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeKeyPhrasesDetectionJobResponse) => void): Request<Comprehend.Types.DescribeKeyPhrasesDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a PII entities detection job. For example, you can use this operation to get the job status.
   */
  describePiiEntitiesDetectionJob(params: Comprehend.Types.DescribePiiEntitiesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribePiiEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.DescribePiiEntitiesDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a PII entities detection job. For example, you can use this operation to get the job status.
   */
  describePiiEntitiesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribePiiEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.DescribePiiEntitiesDetectionJobResponse, AWSError>;
  /**
   * Gets the details of a resource-based policy that is attached to a custom model, including the JSON body of the policy.
   */
  describeResourcePolicy(params: Comprehend.Types.DescribeResourcePolicyRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeResourcePolicyResponse) => void): Request<Comprehend.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Gets the details of a resource-based policy that is attached to a custom model, including the JSON body of the policy.
   */
  describeResourcePolicy(callback?: (err: AWSError, data: Comprehend.Types.DescribeResourcePolicyResponse) => void): Request<Comprehend.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Gets the properties associated with a sentiment detection job. Use this operation to get the status of a detection job.
   */
  describeSentimentDetectionJob(params: Comprehend.Types.DescribeSentimentDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeSentimentDetectionJobResponse) => void): Request<Comprehend.Types.DescribeSentimentDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a sentiment detection job. Use this operation to get the status of a detection job.
   */
  describeSentimentDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeSentimentDetectionJobResponse) => void): Request<Comprehend.Types.DescribeSentimentDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a targeted sentiment detection job. Use this operation to get the status of the job.
   */
  describeTargetedSentimentDetectionJob(params: Comprehend.Types.DescribeTargetedSentimentDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeTargetedSentimentDetectionJobResponse) => void): Request<Comprehend.Types.DescribeTargetedSentimentDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a targeted sentiment detection job. Use this operation to get the status of the job.
   */
  describeTargetedSentimentDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeTargetedSentimentDetectionJobResponse) => void): Request<Comprehend.Types.DescribeTargetedSentimentDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a topic detection job. Use this operation to get the status of a detection job.
   */
  describeTopicsDetectionJob(params: Comprehend.Types.DescribeTopicsDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.DescribeTopicsDetectionJobResponse) => void): Request<Comprehend.Types.DescribeTopicsDetectionJobResponse, AWSError>;
  /**
   * Gets the properties associated with a topic detection job. Use this operation to get the status of a detection job.
   */
  describeTopicsDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.DescribeTopicsDetectionJobResponse) => void): Request<Comprehend.Types.DescribeTopicsDetectionJobResponse, AWSError>;
  /**
   * Determines the dominant language of the input text. For a list of languages that Amazon Comprehend can detect, see Amazon Comprehend Supported Languages. 
   */
  detectDominantLanguage(params: Comprehend.Types.DetectDominantLanguageRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectDominantLanguageResponse) => void): Request<Comprehend.Types.DetectDominantLanguageResponse, AWSError>;
  /**
   * Determines the dominant language of the input text. For a list of languages that Amazon Comprehend can detect, see Amazon Comprehend Supported Languages. 
   */
  detectDominantLanguage(callback?: (err: AWSError, data: Comprehend.Types.DetectDominantLanguageResponse) => void): Request<Comprehend.Types.DetectDominantLanguageResponse, AWSError>;
  /**
   * Detects named entities in input text when you use the pre-trained model. Detects custom entities if you have a custom entity recognition model.   When detecting named entities using the pre-trained model, use plain text as the input. For more information about named entities, see Entities in the Comprehend Developer Guide. When you use a custom entity recognition model, you can input plain text or you can upload a single-page input document (text, PDF, Word, or image).  If the system detects errors while processing a page in the input document, the API response includes an entry in Errors for each error.  If the system detects a document-level error in your input document, the API returns an InvalidRequestException error response. For details about this exception, see  Errors in semi-structured documents in the Comprehend Developer Guide. 
   */
  detectEntities(params: Comprehend.Types.DetectEntitiesRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectEntitiesResponse) => void): Request<Comprehend.Types.DetectEntitiesResponse, AWSError>;
  /**
   * Detects named entities in input text when you use the pre-trained model. Detects custom entities if you have a custom entity recognition model.   When detecting named entities using the pre-trained model, use plain text as the input. For more information about named entities, see Entities in the Comprehend Developer Guide. When you use a custom entity recognition model, you can input plain text or you can upload a single-page input document (text, PDF, Word, or image).  If the system detects errors while processing a page in the input document, the API response includes an entry in Errors for each error.  If the system detects a document-level error in your input document, the API returns an InvalidRequestException error response. For details about this exception, see  Errors in semi-structured documents in the Comprehend Developer Guide. 
   */
  detectEntities(callback?: (err: AWSError, data: Comprehend.Types.DetectEntitiesResponse) => void): Request<Comprehend.Types.DetectEntitiesResponse, AWSError>;
  /**
   * Detects the key noun phrases found in the text. 
   */
  detectKeyPhrases(params: Comprehend.Types.DetectKeyPhrasesRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectKeyPhrasesResponse) => void): Request<Comprehend.Types.DetectKeyPhrasesResponse, AWSError>;
  /**
   * Detects the key noun phrases found in the text. 
   */
  detectKeyPhrases(callback?: (err: AWSError, data: Comprehend.Types.DetectKeyPhrasesResponse) => void): Request<Comprehend.Types.DetectKeyPhrasesResponse, AWSError>;
  /**
   * Inspects the input text for entities that contain personally identifiable information (PII) and returns information about them.
   */
  detectPiiEntities(params: Comprehend.Types.DetectPiiEntitiesRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectPiiEntitiesResponse) => void): Request<Comprehend.Types.DetectPiiEntitiesResponse, AWSError>;
  /**
   * Inspects the input text for entities that contain personally identifiable information (PII) and returns information about them.
   */
  detectPiiEntities(callback?: (err: AWSError, data: Comprehend.Types.DetectPiiEntitiesResponse) => void): Request<Comprehend.Types.DetectPiiEntitiesResponse, AWSError>;
  /**
   * Inspects text and returns an inference of the prevailing sentiment (POSITIVE, NEUTRAL, MIXED, or NEGATIVE). 
   */
  detectSentiment(params: Comprehend.Types.DetectSentimentRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectSentimentResponse) => void): Request<Comprehend.Types.DetectSentimentResponse, AWSError>;
  /**
   * Inspects text and returns an inference of the prevailing sentiment (POSITIVE, NEUTRAL, MIXED, or NEGATIVE). 
   */
  detectSentiment(callback?: (err: AWSError, data: Comprehend.Types.DetectSentimentResponse) => void): Request<Comprehend.Types.DetectSentimentResponse, AWSError>;
  /**
   * Inspects text for syntax and the part of speech of words in the document. For more information, see Syntax in the Comprehend Developer Guide. 
   */
  detectSyntax(params: Comprehend.Types.DetectSyntaxRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectSyntaxResponse) => void): Request<Comprehend.Types.DetectSyntaxResponse, AWSError>;
  /**
   * Inspects text for syntax and the part of speech of words in the document. For more information, see Syntax in the Comprehend Developer Guide. 
   */
  detectSyntax(callback?: (err: AWSError, data: Comprehend.Types.DetectSyntaxResponse) => void): Request<Comprehend.Types.DetectSyntaxResponse, AWSError>;
  /**
   * Inspects the input text and returns a sentiment analysis for each entity identified in the text. For more information about targeted sentiment, see Targeted sentiment.
   */
  detectTargetedSentiment(params: Comprehend.Types.DetectTargetedSentimentRequest, callback?: (err: AWSError, data: Comprehend.Types.DetectTargetedSentimentResponse) => void): Request<Comprehend.Types.DetectTargetedSentimentResponse, AWSError>;
  /**
   * Inspects the input text and returns a sentiment analysis for each entity identified in the text. For more information about targeted sentiment, see Targeted sentiment.
   */
  detectTargetedSentiment(callback?: (err: AWSError, data: Comprehend.Types.DetectTargetedSentimentResponse) => void): Request<Comprehend.Types.DetectTargetedSentimentResponse, AWSError>;
  /**
   * Creates a new custom model that replicates a source custom model that you import. The source model can be in your Amazon Web Services account or another one. If the source model is in another Amazon Web Services account, then it must have a resource-based policy that authorizes you to import it. The source model must be in the same Amazon Web Services Region that you're using when you import. You can't import a model that's in a different Region.
   */
  importModel(params: Comprehend.Types.ImportModelRequest, callback?: (err: AWSError, data: Comprehend.Types.ImportModelResponse) => void): Request<Comprehend.Types.ImportModelResponse, AWSError>;
  /**
   * Creates a new custom model that replicates a source custom model that you import. The source model can be in your Amazon Web Services account or another one. If the source model is in another Amazon Web Services account, then it must have a resource-based policy that authorizes you to import it. The source model must be in the same Amazon Web Services Region that you're using when you import. You can't import a model that's in a different Region.
   */
  importModel(callback?: (err: AWSError, data: Comprehend.Types.ImportModelResponse) => void): Request<Comprehend.Types.ImportModelResponse, AWSError>;
  /**
   * List the datasets that you have configured in this Region. For more information about datasets, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  listDatasets(params: Comprehend.Types.ListDatasetsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListDatasetsResponse) => void): Request<Comprehend.Types.ListDatasetsResponse, AWSError>;
  /**
   * List the datasets that you have configured in this Region. For more information about datasets, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  listDatasets(callback?: (err: AWSError, data: Comprehend.Types.ListDatasetsResponse) => void): Request<Comprehend.Types.ListDatasetsResponse, AWSError>;
  /**
   * Gets a list of the documentation classification jobs that you have submitted.
   */
  listDocumentClassificationJobs(params: Comprehend.Types.ListDocumentClassificationJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListDocumentClassificationJobsResponse) => void): Request<Comprehend.Types.ListDocumentClassificationJobsResponse, AWSError>;
  /**
   * Gets a list of the documentation classification jobs that you have submitted.
   */
  listDocumentClassificationJobs(callback?: (err: AWSError, data: Comprehend.Types.ListDocumentClassificationJobsResponse) => void): Request<Comprehend.Types.ListDocumentClassificationJobsResponse, AWSError>;
  /**
   * Gets a list of summaries of the document classifiers that you have created
   */
  listDocumentClassifierSummaries(params: Comprehend.Types.ListDocumentClassifierSummariesRequest, callback?: (err: AWSError, data: Comprehend.Types.ListDocumentClassifierSummariesResponse) => void): Request<Comprehend.Types.ListDocumentClassifierSummariesResponse, AWSError>;
  /**
   * Gets a list of summaries of the document classifiers that you have created
   */
  listDocumentClassifierSummaries(callback?: (err: AWSError, data: Comprehend.Types.ListDocumentClassifierSummariesResponse) => void): Request<Comprehend.Types.ListDocumentClassifierSummariesResponse, AWSError>;
  /**
   * Gets a list of the document classifiers that you have created.
   */
  listDocumentClassifiers(params: Comprehend.Types.ListDocumentClassifiersRequest, callback?: (err: AWSError, data: Comprehend.Types.ListDocumentClassifiersResponse) => void): Request<Comprehend.Types.ListDocumentClassifiersResponse, AWSError>;
  /**
   * Gets a list of the document classifiers that you have created.
   */
  listDocumentClassifiers(callback?: (err: AWSError, data: Comprehend.Types.ListDocumentClassifiersResponse) => void): Request<Comprehend.Types.ListDocumentClassifiersResponse, AWSError>;
  /**
   * Gets a list of the dominant language detection jobs that you have submitted.
   */
  listDominantLanguageDetectionJobs(params: Comprehend.Types.ListDominantLanguageDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListDominantLanguageDetectionJobsResponse) => void): Request<Comprehend.Types.ListDominantLanguageDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the dominant language detection jobs that you have submitted.
   */
  listDominantLanguageDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListDominantLanguageDetectionJobsResponse) => void): Request<Comprehend.Types.ListDominantLanguageDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of all existing endpoints that you've created. For information about endpoints, see Managing endpoints.
   */
  listEndpoints(params: Comprehend.Types.ListEndpointsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListEndpointsResponse) => void): Request<Comprehend.Types.ListEndpointsResponse, AWSError>;
  /**
   * Gets a list of all existing endpoints that you've created. For information about endpoints, see Managing endpoints.
   */
  listEndpoints(callback?: (err: AWSError, data: Comprehend.Types.ListEndpointsResponse) => void): Request<Comprehend.Types.ListEndpointsResponse, AWSError>;
  /**
   * Gets a list of the entity detection jobs that you have submitted.
   */
  listEntitiesDetectionJobs(params: Comprehend.Types.ListEntitiesDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListEntitiesDetectionJobsResponse) => void): Request<Comprehend.Types.ListEntitiesDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the entity detection jobs that you have submitted.
   */
  listEntitiesDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListEntitiesDetectionJobsResponse) => void): Request<Comprehend.Types.ListEntitiesDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of summaries for the entity recognizers that you have created.
   */
  listEntityRecognizerSummaries(params: Comprehend.Types.ListEntityRecognizerSummariesRequest, callback?: (err: AWSError, data: Comprehend.Types.ListEntityRecognizerSummariesResponse) => void): Request<Comprehend.Types.ListEntityRecognizerSummariesResponse, AWSError>;
  /**
   * Gets a list of summaries for the entity recognizers that you have created.
   */
  listEntityRecognizerSummaries(callback?: (err: AWSError, data: Comprehend.Types.ListEntityRecognizerSummariesResponse) => void): Request<Comprehend.Types.ListEntityRecognizerSummariesResponse, AWSError>;
  /**
   * Gets a list of the properties of all entity recognizers that you created, including recognizers currently in training. Allows you to filter the list of recognizers based on criteria such as status and submission time. This call returns up to 500 entity recognizers in the list, with a default number of 100 recognizers in the list. The results of this list are not in any particular order. Please get the list and sort locally if needed.
   */
  listEntityRecognizers(params: Comprehend.Types.ListEntityRecognizersRequest, callback?: (err: AWSError, data: Comprehend.Types.ListEntityRecognizersResponse) => void): Request<Comprehend.Types.ListEntityRecognizersResponse, AWSError>;
  /**
   * Gets a list of the properties of all entity recognizers that you created, including recognizers currently in training. Allows you to filter the list of recognizers based on criteria such as status and submission time. This call returns up to 500 entity recognizers in the list, with a default number of 100 recognizers in the list. The results of this list are not in any particular order. Please get the list and sort locally if needed.
   */
  listEntityRecognizers(callback?: (err: AWSError, data: Comprehend.Types.ListEntityRecognizersResponse) => void): Request<Comprehend.Types.ListEntityRecognizersResponse, AWSError>;
  /**
   * Gets a list of the events detection jobs that you have submitted.
   */
  listEventsDetectionJobs(params: Comprehend.Types.ListEventsDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListEventsDetectionJobsResponse) => void): Request<Comprehend.Types.ListEventsDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the events detection jobs that you have submitted.
   */
  listEventsDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListEventsDetectionJobsResponse) => void): Request<Comprehend.Types.ListEventsDetectionJobsResponse, AWSError>;
  /**
   * Information about the history of a flywheel iteration. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  listFlywheelIterationHistory(params: Comprehend.Types.ListFlywheelIterationHistoryRequest, callback?: (err: AWSError, data: Comprehend.Types.ListFlywheelIterationHistoryResponse) => void): Request<Comprehend.Types.ListFlywheelIterationHistoryResponse, AWSError>;
  /**
   * Information about the history of a flywheel iteration. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  listFlywheelIterationHistory(callback?: (err: AWSError, data: Comprehend.Types.ListFlywheelIterationHistoryResponse) => void): Request<Comprehend.Types.ListFlywheelIterationHistoryResponse, AWSError>;
  /**
   * Gets a list of the flywheels that you have created.
   */
  listFlywheels(params: Comprehend.Types.ListFlywheelsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListFlywheelsResponse) => void): Request<Comprehend.Types.ListFlywheelsResponse, AWSError>;
  /**
   * Gets a list of the flywheels that you have created.
   */
  listFlywheels(callback?: (err: AWSError, data: Comprehend.Types.ListFlywheelsResponse) => void): Request<Comprehend.Types.ListFlywheelsResponse, AWSError>;
  /**
   * Get a list of key phrase detection jobs that you have submitted.
   */
  listKeyPhrasesDetectionJobs(params: Comprehend.Types.ListKeyPhrasesDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListKeyPhrasesDetectionJobsResponse) => void): Request<Comprehend.Types.ListKeyPhrasesDetectionJobsResponse, AWSError>;
  /**
   * Get a list of key phrase detection jobs that you have submitted.
   */
  listKeyPhrasesDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListKeyPhrasesDetectionJobsResponse) => void): Request<Comprehend.Types.ListKeyPhrasesDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the PII entity detection jobs that you have submitted.
   */
  listPiiEntitiesDetectionJobs(params: Comprehend.Types.ListPiiEntitiesDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListPiiEntitiesDetectionJobsResponse) => void): Request<Comprehend.Types.ListPiiEntitiesDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the PII entity detection jobs that you have submitted.
   */
  listPiiEntitiesDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListPiiEntitiesDetectionJobsResponse) => void): Request<Comprehend.Types.ListPiiEntitiesDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of sentiment detection jobs that you have submitted.
   */
  listSentimentDetectionJobs(params: Comprehend.Types.ListSentimentDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListSentimentDetectionJobsResponse) => void): Request<Comprehend.Types.ListSentimentDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of sentiment detection jobs that you have submitted.
   */
  listSentimentDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListSentimentDetectionJobsResponse) => void): Request<Comprehend.Types.ListSentimentDetectionJobsResponse, AWSError>;
  /**
   * Lists all tags associated with a given Amazon Comprehend resource. 
   */
  listTagsForResource(params: Comprehend.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Comprehend.Types.ListTagsForResourceResponse) => void): Request<Comprehend.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags associated with a given Amazon Comprehend resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: Comprehend.Types.ListTagsForResourceResponse) => void): Request<Comprehend.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets a list of targeted sentiment detection jobs that you have submitted.
   */
  listTargetedSentimentDetectionJobs(params: Comprehend.Types.ListTargetedSentimentDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListTargetedSentimentDetectionJobsResponse) => void): Request<Comprehend.Types.ListTargetedSentimentDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of targeted sentiment detection jobs that you have submitted.
   */
  listTargetedSentimentDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListTargetedSentimentDetectionJobsResponse) => void): Request<Comprehend.Types.ListTargetedSentimentDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the topic detection jobs that you have submitted.
   */
  listTopicsDetectionJobs(params: Comprehend.Types.ListTopicsDetectionJobsRequest, callback?: (err: AWSError, data: Comprehend.Types.ListTopicsDetectionJobsResponse) => void): Request<Comprehend.Types.ListTopicsDetectionJobsResponse, AWSError>;
  /**
   * Gets a list of the topic detection jobs that you have submitted.
   */
  listTopicsDetectionJobs(callback?: (err: AWSError, data: Comprehend.Types.ListTopicsDetectionJobsResponse) => void): Request<Comprehend.Types.ListTopicsDetectionJobsResponse, AWSError>;
  /**
   * Attaches a resource-based policy to a custom model. You can use this policy to authorize an entity in another Amazon Web Services account to import the custom model, which replicates it in Amazon Comprehend in their account.
   */
  putResourcePolicy(params: Comprehend.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: Comprehend.Types.PutResourcePolicyResponse) => void): Request<Comprehend.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Attaches a resource-based policy to a custom model. You can use this policy to authorize an entity in another Amazon Web Services account to import the custom model, which replicates it in Amazon Comprehend in their account.
   */
  putResourcePolicy(callback?: (err: AWSError, data: Comprehend.Types.PutResourcePolicyResponse) => void): Request<Comprehend.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Starts an asynchronous document classification job. Use the DescribeDocumentClassificationJob operation to track the progress of the job.
   */
  startDocumentClassificationJob(params: Comprehend.Types.StartDocumentClassificationJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartDocumentClassificationJobResponse) => void): Request<Comprehend.Types.StartDocumentClassificationJobResponse, AWSError>;
  /**
   * Starts an asynchronous document classification job. Use the DescribeDocumentClassificationJob operation to track the progress of the job.
   */
  startDocumentClassificationJob(callback?: (err: AWSError, data: Comprehend.Types.StartDocumentClassificationJobResponse) => void): Request<Comprehend.Types.StartDocumentClassificationJobResponse, AWSError>;
  /**
   * Starts an asynchronous dominant language detection job for a collection of documents. Use the operation to track the status of a job.
   */
  startDominantLanguageDetectionJob(params: Comprehend.Types.StartDominantLanguageDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartDominantLanguageDetectionJobResponse) => void): Request<Comprehend.Types.StartDominantLanguageDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous dominant language detection job for a collection of documents. Use the operation to track the status of a job.
   */
  startDominantLanguageDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartDominantLanguageDetectionJobResponse) => void): Request<Comprehend.Types.StartDominantLanguageDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous entity detection job for a collection of documents. Use the operation to track the status of a job. This API can be used for either standard entity detection or custom entity recognition. In order to be used for custom entity recognition, the optional EntityRecognizerArn must be used in order to provide access to the recognizer being used to detect the custom entity.
   */
  startEntitiesDetectionJob(params: Comprehend.Types.StartEntitiesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StartEntitiesDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous entity detection job for a collection of documents. Use the operation to track the status of a job. This API can be used for either standard entity detection or custom entity recognition. In order to be used for custom entity recognition, the optional EntityRecognizerArn must be used in order to provide access to the recognizer being used to detect the custom entity.
   */
  startEntitiesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StartEntitiesDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous event detection job for a collection of documents.
   */
  startEventsDetectionJob(params: Comprehend.Types.StartEventsDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartEventsDetectionJobResponse) => void): Request<Comprehend.Types.StartEventsDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous event detection job for a collection of documents.
   */
  startEventsDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartEventsDetectionJobResponse) => void): Request<Comprehend.Types.StartEventsDetectionJobResponse, AWSError>;
  /**
   * Start the flywheel iteration.This operation uses any new datasets to train a new model version. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  startFlywheelIteration(params: Comprehend.Types.StartFlywheelIterationRequest, callback?: (err: AWSError, data: Comprehend.Types.StartFlywheelIterationResponse) => void): Request<Comprehend.Types.StartFlywheelIterationResponse, AWSError>;
  /**
   * Start the flywheel iteration.This operation uses any new datasets to train a new model version. For more information about flywheels, see  Flywheel overview in the Amazon Comprehend Developer Guide.
   */
  startFlywheelIteration(callback?: (err: AWSError, data: Comprehend.Types.StartFlywheelIterationResponse) => void): Request<Comprehend.Types.StartFlywheelIterationResponse, AWSError>;
  /**
   * Starts an asynchronous key phrase detection job for a collection of documents. Use the operation to track the status of a job.
   */
  startKeyPhrasesDetectionJob(params: Comprehend.Types.StartKeyPhrasesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartKeyPhrasesDetectionJobResponse) => void): Request<Comprehend.Types.StartKeyPhrasesDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous key phrase detection job for a collection of documents. Use the operation to track the status of a job.
   */
  startKeyPhrasesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartKeyPhrasesDetectionJobResponse) => void): Request<Comprehend.Types.StartKeyPhrasesDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous PII entity detection job for a collection of documents.
   */
  startPiiEntitiesDetectionJob(params: Comprehend.Types.StartPiiEntitiesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartPiiEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StartPiiEntitiesDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous PII entity detection job for a collection of documents.
   */
  startPiiEntitiesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartPiiEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StartPiiEntitiesDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous sentiment detection job for a collection of documents. Use the operation to track the status of a job.
   */
  startSentimentDetectionJob(params: Comprehend.Types.StartSentimentDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StartSentimentDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous sentiment detection job for a collection of documents. Use the operation to track the status of a job.
   */
  startSentimentDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StartSentimentDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous targeted sentiment detection job for a collection of documents. Use the DescribeTargetedSentimentDetectionJob operation to track the status of a job.
   */
  startTargetedSentimentDetectionJob(params: Comprehend.Types.StartTargetedSentimentDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartTargetedSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StartTargetedSentimentDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous targeted sentiment detection job for a collection of documents. Use the DescribeTargetedSentimentDetectionJob operation to track the status of a job.
   */
  startTargetedSentimentDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartTargetedSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StartTargetedSentimentDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous topic detection job. Use the DescribeTopicDetectionJob operation to track the status of a job.
   */
  startTopicsDetectionJob(params: Comprehend.Types.StartTopicsDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StartTopicsDetectionJobResponse) => void): Request<Comprehend.Types.StartTopicsDetectionJobResponse, AWSError>;
  /**
   * Starts an asynchronous topic detection job. Use the DescribeTopicDetectionJob operation to track the status of a job.
   */
  startTopicsDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StartTopicsDetectionJobResponse) => void): Request<Comprehend.Types.StartTopicsDetectionJobResponse, AWSError>;
  /**
   * Stops a dominant language detection job in progress. If the job state is IN_PROGRESS the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopDominantLanguageDetectionJob(params: Comprehend.Types.StopDominantLanguageDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopDominantLanguageDetectionJobResponse) => void): Request<Comprehend.Types.StopDominantLanguageDetectionJobResponse, AWSError>;
  /**
   * Stops a dominant language detection job in progress. If the job state is IN_PROGRESS the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopDominantLanguageDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopDominantLanguageDetectionJobResponse) => void): Request<Comprehend.Types.StopDominantLanguageDetectionJobResponse, AWSError>;
  /**
   * Stops an entities detection job in progress. If the job state is IN_PROGRESS the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopEntitiesDetectionJob(params: Comprehend.Types.StopEntitiesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StopEntitiesDetectionJobResponse, AWSError>;
  /**
   * Stops an entities detection job in progress. If the job state is IN_PROGRESS the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopEntitiesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StopEntitiesDetectionJobResponse, AWSError>;
  /**
   * Stops an events detection job in progress.
   */
  stopEventsDetectionJob(params: Comprehend.Types.StopEventsDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopEventsDetectionJobResponse) => void): Request<Comprehend.Types.StopEventsDetectionJobResponse, AWSError>;
  /**
   * Stops an events detection job in progress.
   */
  stopEventsDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopEventsDetectionJobResponse) => void): Request<Comprehend.Types.StopEventsDetectionJobResponse, AWSError>;
  /**
   * Stops a key phrases detection job in progress. If the job state is IN_PROGRESS the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopKeyPhrasesDetectionJob(params: Comprehend.Types.StopKeyPhrasesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopKeyPhrasesDetectionJobResponse) => void): Request<Comprehend.Types.StopKeyPhrasesDetectionJobResponse, AWSError>;
  /**
   * Stops a key phrases detection job in progress. If the job state is IN_PROGRESS the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopKeyPhrasesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopKeyPhrasesDetectionJobResponse) => void): Request<Comprehend.Types.StopKeyPhrasesDetectionJobResponse, AWSError>;
  /**
   * Stops a PII entities detection job in progress.
   */
  stopPiiEntitiesDetectionJob(params: Comprehend.Types.StopPiiEntitiesDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopPiiEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StopPiiEntitiesDetectionJobResponse, AWSError>;
  /**
   * Stops a PII entities detection job in progress.
   */
  stopPiiEntitiesDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopPiiEntitiesDetectionJobResponse) => void): Request<Comprehend.Types.StopPiiEntitiesDetectionJobResponse, AWSError>;
  /**
   * Stops a sentiment detection job in progress. If the job state is IN_PROGRESS, the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is be stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopSentimentDetectionJob(params: Comprehend.Types.StopSentimentDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StopSentimentDetectionJobResponse, AWSError>;
  /**
   * Stops a sentiment detection job in progress. If the job state is IN_PROGRESS, the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is be stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopSentimentDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StopSentimentDetectionJobResponse, AWSError>;
  /**
   * Stops a targeted sentiment detection job in progress. If the job state is IN_PROGRESS, the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is be stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopTargetedSentimentDetectionJob(params: Comprehend.Types.StopTargetedSentimentDetectionJobRequest, callback?: (err: AWSError, data: Comprehend.Types.StopTargetedSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StopTargetedSentimentDetectionJobResponse, AWSError>;
  /**
   * Stops a targeted sentiment detection job in progress. If the job state is IN_PROGRESS, the job is marked for termination and put into the STOP_REQUESTED state. If the job completes before it can be stopped, it is put into the COMPLETED state; otherwise the job is be stopped and put into the STOPPED state. If the job is in the COMPLETED or FAILED state when you call the StopDominantLanguageDetectionJob operation, the operation returns a 400 Internal Request Exception.  When a job is stopped, any documents already processed are written to the output location.
   */
  stopTargetedSentimentDetectionJob(callback?: (err: AWSError, data: Comprehend.Types.StopTargetedSentimentDetectionJobResponse) => void): Request<Comprehend.Types.StopTargetedSentimentDetectionJobResponse, AWSError>;
  /**
   * Stops a document classifier training job while in progress. If the training job state is TRAINING, the job is marked for termination and put into the STOP_REQUESTED state. If the training job completes before it can be stopped, it is put into the TRAINED; otherwise the training job is stopped and put into the STOPPED state and the service sends back an HTTP 200 response with an empty HTTP body. 
   */
  stopTrainingDocumentClassifier(params: Comprehend.Types.StopTrainingDocumentClassifierRequest, callback?: (err: AWSError, data: Comprehend.Types.StopTrainingDocumentClassifierResponse) => void): Request<Comprehend.Types.StopTrainingDocumentClassifierResponse, AWSError>;
  /**
   * Stops a document classifier training job while in progress. If the training job state is TRAINING, the job is marked for termination and put into the STOP_REQUESTED state. If the training job completes before it can be stopped, it is put into the TRAINED; otherwise the training job is stopped and put into the STOPPED state and the service sends back an HTTP 200 response with an empty HTTP body. 
   */
  stopTrainingDocumentClassifier(callback?: (err: AWSError, data: Comprehend.Types.StopTrainingDocumentClassifierResponse) => void): Request<Comprehend.Types.StopTrainingDocumentClassifierResponse, AWSError>;
  /**
   * Stops an entity recognizer training job while in progress. If the training job state is TRAINING, the job is marked for termination and put into the STOP_REQUESTED state. If the training job completes before it can be stopped, it is put into the TRAINED; otherwise the training job is stopped and putted into the STOPPED state and the service sends back an HTTP 200 response with an empty HTTP body.
   */
  stopTrainingEntityRecognizer(params: Comprehend.Types.StopTrainingEntityRecognizerRequest, callback?: (err: AWSError, data: Comprehend.Types.StopTrainingEntityRecognizerResponse) => void): Request<Comprehend.Types.StopTrainingEntityRecognizerResponse, AWSError>;
  /**
   * Stops an entity recognizer training job while in progress. If the training job state is TRAINING, the job is marked for termination and put into the STOP_REQUESTED state. If the training job completes before it can be stopped, it is put into the TRAINED; otherwise the training job is stopped and putted into the STOPPED state and the service sends back an HTTP 200 response with an empty HTTP body.
   */
  stopTrainingEntityRecognizer(callback?: (err: AWSError, data: Comprehend.Types.StopTrainingEntityRecognizerResponse) => void): Request<Comprehend.Types.StopTrainingEntityRecognizerResponse, AWSError>;
  /**
   * Associates a specific tag with an Amazon Comprehend resource. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. 
   */
  tagResource(params: Comprehend.Types.TagResourceRequest, callback?: (err: AWSError, data: Comprehend.Types.TagResourceResponse) => void): Request<Comprehend.Types.TagResourceResponse, AWSError>;
  /**
   * Associates a specific tag with an Amazon Comprehend resource. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. 
   */
  tagResource(callback?: (err: AWSError, data: Comprehend.Types.TagResourceResponse) => void): Request<Comprehend.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a specific tag associated with an Amazon Comprehend resource. 
   */
  untagResource(params: Comprehend.Types.UntagResourceRequest, callback?: (err: AWSError, data: Comprehend.Types.UntagResourceResponse) => void): Request<Comprehend.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a specific tag associated with an Amazon Comprehend resource. 
   */
  untagResource(callback?: (err: AWSError, data: Comprehend.Types.UntagResourceResponse) => void): Request<Comprehend.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates information about the specified endpoint. For information about endpoints, see Managing endpoints.
   */
  updateEndpoint(params: Comprehend.Types.UpdateEndpointRequest, callback?: (err: AWSError, data: Comprehend.Types.UpdateEndpointResponse) => void): Request<Comprehend.Types.UpdateEndpointResponse, AWSError>;
  /**
   * Updates information about the specified endpoint. For information about endpoints, see Managing endpoints.
   */
  updateEndpoint(callback?: (err: AWSError, data: Comprehend.Types.UpdateEndpointResponse) => void): Request<Comprehend.Types.UpdateEndpointResponse, AWSError>;
  /**
   * Update the configuration information for an existing flywheel.
   */
  updateFlywheel(params: Comprehend.Types.UpdateFlywheelRequest, callback?: (err: AWSError, data: Comprehend.Types.UpdateFlywheelResponse) => void): Request<Comprehend.Types.UpdateFlywheelResponse, AWSError>;
  /**
   * Update the configuration information for an existing flywheel.
   */
  updateFlywheel(callback?: (err: AWSError, data: Comprehend.Types.UpdateFlywheelResponse) => void): Request<Comprehend.Types.UpdateFlywheelResponse, AWSError>;
}
declare namespace Comprehend {
  export type AnyLengthString = string;
  export type AttributeNamesList = AttributeNamesListItem[];
  export type AttributeNamesListItem = string;
  export type AugmentedManifestsDocumentTypeFormat = "PLAIN_TEXT_DOCUMENT"|"SEMI_STRUCTURED_DOCUMENT"|string;
  export interface AugmentedManifestsListItem {
    /**
     * The Amazon S3 location of the augmented manifest file.
     */
    S3Uri: S3Uri;
    /**
     * The purpose of the data you've provided in the augmented manifest. You can either train or test this data. If you don't specify, the default is train. TRAIN - all of the documents in the manifest will be used for training. If no test documents are provided, Amazon Comprehend will automatically reserve a portion of the training documents for testing.  TEST - all of the documents in the manifest will be used for testing.
     */
    Split?: Split;
    /**
     * The JSON attribute that contains the annotations for your training documents. The number of attribute names that you specify depends on whether your augmented manifest file is the output of a single labeling job or a chained labeling job. If your file is the output of a single labeling job, specify the LabelAttributeName key that was used when the job was created in Ground Truth. If your file is the output of a chained labeling job, specify the LabelAttributeName key for one or more jobs in the chain. Each LabelAttributeName key provides the annotations from an individual job.
     */
    AttributeNames: AttributeNamesList;
    /**
     * The S3 prefix to the annotation files that are referred in the augmented manifest file.
     */
    AnnotationDataS3Uri?: S3Uri;
    /**
     * The S3 prefix to the source files (PDFs) that are referred to in the augmented manifest file.
     */
    SourceDocumentsS3Uri?: S3Uri;
    /**
     * The type of augmented manifest. PlainTextDocument or SemiStructuredDocument. If you don't specify, the default is PlainTextDocument.     PLAIN_TEXT_DOCUMENT A document type that represents any unicode text that is encoded in UTF-8.    SEMI_STRUCTURED_DOCUMENT A document type with positional and structural context, like a PDF. For training with Amazon Comprehend, only PDFs are supported. For inference, Amazon Comprehend support PDFs, DOCX and TXT.  
     */
    DocumentType?: AugmentedManifestsDocumentTypeFormat;
  }
  export interface BatchDetectDominantLanguageItemResult {
    /**
     * The zero-based index of the document in the input list.
     */
    Index?: Integer;
    /**
     * One or more DominantLanguage objects describing the dominant languages in the document.
     */
    Languages?: ListOfDominantLanguages;
  }
  export interface BatchDetectDominantLanguageRequest {
    /**
     * A list containing the UTF-8 encoded text of the input documents. The list can contain a maximum of 25 documents. Each document should contain at least 20 characters. The maximum size of each document is 5 KB.
     */
    TextList: CustomerInputStringList;
  }
  export interface BatchDetectDominantLanguageResponse {
    /**
     * A list of objects containing the results of the operation. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If all of the documents contain an error, the ResultList is empty.
     */
    ResultList: ListOfDetectDominantLanguageResult;
    /**
     * A list containing one object for each document that contained an error. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If there are no errors in the batch, the ErrorList is empty.
     */
    ErrorList: BatchItemErrorList;
  }
  export interface BatchDetectEntitiesItemResult {
    /**
     * The zero-based index of the document in the input list.
     */
    Index?: Integer;
    /**
     * One or more Entity objects, one for each entity detected in the document.
     */
    Entities?: ListOfEntities;
  }
  export interface BatchDetectEntitiesRequest {
    /**
     * A list containing the UTF-8 encoded text of the input documents. The list can contain a maximum of 25 documents. The maximum size of each document is 5 KB.
     */
    TextList: CustomerInputStringList;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface BatchDetectEntitiesResponse {
    /**
     * A list of objects containing the results of the operation. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If all of the documents contain an error, the ResultList is empty.
     */
    ResultList: ListOfDetectEntitiesResult;
    /**
     * A list containing one object for each document that contained an error. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If there are no errors in the batch, the ErrorList is empty.
     */
    ErrorList: BatchItemErrorList;
  }
  export interface BatchDetectKeyPhrasesItemResult {
    /**
     * The zero-based index of the document in the input list.
     */
    Index?: Integer;
    /**
     * One or more KeyPhrase objects, one for each key phrase detected in the document.
     */
    KeyPhrases?: ListOfKeyPhrases;
  }
  export interface BatchDetectKeyPhrasesRequest {
    /**
     * A list containing the UTF-8 encoded text of the input documents. The list can contain a maximum of 25 documents. The maximum size of each document is 5 KB.
     */
    TextList: CustomerInputStringList;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface BatchDetectKeyPhrasesResponse {
    /**
     * A list of objects containing the results of the operation. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If all of the documents contain an error, the ResultList is empty.
     */
    ResultList: ListOfDetectKeyPhrasesResult;
    /**
     * A list containing one object for each document that contained an error. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If there are no errors in the batch, the ErrorList is empty.
     */
    ErrorList: BatchItemErrorList;
  }
  export interface BatchDetectSentimentItemResult {
    /**
     * The zero-based index of the document in the input list.
     */
    Index?: Integer;
    /**
     * The sentiment detected in the document.
     */
    Sentiment?: SentimentType;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its sentiment detection.
     */
    SentimentScore?: SentimentScore;
  }
  export interface BatchDetectSentimentRequest {
    /**
     * A list containing the UTF-8 encoded text of the input documents. The list can contain a maximum of 25 documents. The maximum size of each document is 5 KB. 
     */
    TextList: CustomerInputStringList;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface BatchDetectSentimentResponse {
    /**
     * A list of objects containing the results of the operation. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If all of the documents contain an error, the ResultList is empty.
     */
    ResultList: ListOfDetectSentimentResult;
    /**
     * A list containing one object for each document that contained an error. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If there are no errors in the batch, the ErrorList is empty.
     */
    ErrorList: BatchItemErrorList;
  }
  export interface BatchDetectSyntaxItemResult {
    /**
     * The zero-based index of the document in the input list.
     */
    Index?: Integer;
    /**
     * The syntax tokens for the words in the document, one token for each word.
     */
    SyntaxTokens?: ListOfSyntaxTokens;
  }
  export interface BatchDetectSyntaxRequest {
    /**
     * A list containing the UTF-8 encoded text of the input documents. The list can contain a maximum of 25 documents. The maximum size for each document is 5 KB.
     */
    TextList: CustomerInputStringList;
    /**
     * The language of the input documents. You can specify any of the following languages supported by Amazon Comprehend: German ("de"), English ("en"), Spanish ("es"), French ("fr"), Italian ("it"), or Portuguese ("pt"). All documents must be in the same language.
     */
    LanguageCode: SyntaxLanguageCode;
  }
  export interface BatchDetectSyntaxResponse {
    /**
     * A list of objects containing the results of the operation. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If all of the documents contain an error, the ResultList is empty.
     */
    ResultList: ListOfDetectSyntaxResult;
    /**
     * A list containing one object for each document that contained an error. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If there are no errors in the batch, the ErrorList is empty.
     */
    ErrorList: BatchItemErrorList;
  }
  export interface BatchDetectTargetedSentimentItemResult {
    /**
     * The zero-based index of this result in the input list.
     */
    Index?: Integer;
    /**
     * An array of targeted sentiment entities.
     */
    Entities?: ListOfTargetedSentimentEntities;
  }
  export interface BatchDetectTargetedSentimentRequest {
    /**
     * A list containing the UTF-8 encoded text of the input documents. The list can contain a maximum of 25 documents. The maximum size of each document is 5 KB.
     */
    TextList: CustomerInputStringList;
    /**
     * The language of the input documents. Currently, English is the only supported language.
     */
    LanguageCode: LanguageCode;
  }
  export interface BatchDetectTargetedSentimentResponse {
    /**
     * A list of objects containing the results of the operation. The results are sorted in ascending order by the Index field and match the order of the documents in the input list. If all of the documents contain an error, the ResultList is empty.
     */
    ResultList: ListOfDetectTargetedSentimentResult;
    /**
     * List of errors that the operation can return.
     */
    ErrorList: BatchItemErrorList;
  }
  export interface BatchItemError {
    /**
     * The zero-based index of the document in the input list.
     */
    Index?: Integer;
    /**
     * The numeric error code of the error.
     */
    ErrorCode?: String;
    /**
     * A text description of the error.
     */
    ErrorMessage?: String;
  }
  export type BatchItemErrorList = BatchItemError[];
  export interface Block {
    /**
     * Unique identifier for the block.
     */
    Id?: String;
    /**
     * The block represents a line of text or one word of text.   WORD - A word that's detected on a document page. A word is one or more ISO basic Latin script characters that aren't separated by spaces.   LINE - A string of tab-delimited, contiguous words that are detected on a document page  
     */
    BlockType?: BlockType;
    /**
     * The word or line of text extracted from the block.
     */
    Text?: String;
    /**
     * Page number where the block appears.
     */
    Page?: Integer;
    /**
     * Co-ordinates of the rectangle or polygon that contains the text.
     */
    Geometry?: Geometry;
    /**
     * A list of child blocks of the current block. For example, a LINE object has child blocks for each WORD block that's part of the line of text. 
     */
    Relationships?: ListOfRelationships;
  }
  export interface BlockReference {
    /**
     * Unique identifier for the block.
     */
    BlockId?: String;
    /**
     * Offset of the start of the block within its parent block.
     */
    BeginOffset?: Integer;
    /**
     * Offset of the end of the block within its parent block.
     */
    EndOffset?: Integer;
    /**
     * List of child blocks within this block.
     */
    ChildBlocks?: ListOfChildBlocks;
  }
  export type BlockType = "LINE"|"WORD"|string;
  export interface BoundingBox {
    /**
     * The height of the bounding box as a ratio of the overall document page height.
     */
    Height?: Float;
    /**
     * The left coordinate of the bounding box as a ratio of overall document page width.
     */
    Left?: Float;
    /**
     * The top coordinate of the bounding box as a ratio of overall document page height.
     */
    Top?: Float;
    /**
     * The width of the bounding box as a ratio of the overall document page width.
     */
    Width?: Float;
  }
  export interface ChildBlock {
    /**
     * Unique identifier for the child block.
     */
    ChildBlockId?: String;
    /**
     * Offset of the start of the child block within its parent block.
     */
    BeginOffset?: Integer;
    /**
     * Offset of the end of the child block within its parent block.
     */
    EndOffset?: Integer;
  }
  export interface ClassifierEvaluationMetrics {
    /**
     * The fraction of the labels that were correct recognized. It is computed by dividing the number of labels in the test documents that were correctly recognized by the total number of labels in the test documents.
     */
    Accuracy?: Double;
    /**
     * A measure of the usefulness of the classifier results in the test data. High precision means that the classifier returned substantially more relevant results than irrelevant ones.
     */
    Precision?: Double;
    /**
     * A measure of how complete the classifier results are for the test data. High recall means that the classifier returned most of the relevant results. 
     */
    Recall?: Double;
    /**
     * A measure of how accurate the classifier results are for the test data. It is derived from the Precision and Recall values. The F1Score is the harmonic average of the two scores. The highest score is 1, and the worst score is 0. 
     */
    F1Score?: Double;
    /**
     * A measure of the usefulness of the recognizer results in the test data. High precision means that the recognizer returned substantially more relevant results than irrelevant ones. Unlike the Precision metric which comes from averaging the precision of all available labels, this is based on the overall score of all precision scores added together.
     */
    MicroPrecision?: Double;
    /**
     * A measure of how complete the classifier results are for the test data. High recall means that the classifier returned most of the relevant results. Specifically, this indicates how many of the correct categories in the text that the model can predict. It is a percentage of correct categories in the text that can found. Instead of averaging the recall scores of all labels (as with Recall), micro Recall is based on the overall score of all recall scores added together.
     */
    MicroRecall?: Double;
    /**
     * A measure of how accurate the classifier results are for the test data. It is a combination of the Micro Precision and Micro Recall values. The Micro F1Score is the harmonic mean of the two scores. The highest score is 1, and the worst score is 0.
     */
    MicroF1Score?: Double;
    /**
     * Indicates the fraction of labels that are incorrectly predicted. Also seen as the fraction of wrong labels compared to the total number of labels. Scores closer to zero are better.
     */
    HammingLoss?: Double;
  }
  export interface ClassifierMetadata {
    /**
     * The number of labels in the input data. 
     */
    NumberOfLabels?: Integer;
    /**
     * The number of documents in the input data that were used to train the classifier. Typically this is 80 to 90 percent of the input documents.
     */
    NumberOfTrainedDocuments?: Integer;
    /**
     * The number of documents in the input data that were used to test the classifier. Typically this is 10 to 20 percent of the input documents, up to 10,000 documents.
     */
    NumberOfTestDocuments?: Integer;
    /**
     *  Describes the result metrics for the test data associated with an documentation classifier.
     */
    EvaluationMetrics?: ClassifierEvaluationMetrics;
  }
  export interface ClassifyDocumentRequest {
    /**
     * The document text to be analyzed. If you enter text using this parameter, do not use the Bytes parameter.
     */
    Text?: CustomerInputString;
    /**
     * The Amazon Resource Number (ARN) of the endpoint. For information about endpoints, see Managing endpoints.
     */
    EndpointArn: DocumentClassifierEndpointArn;
    /**
     * Use the Bytes parameter to input a text, PDF, Word or image file. You can also use the Bytes parameter to input an Amazon Textract DetectDocumentText or AnalyzeDocument output file. Provide the input document as a sequence of base64-encoded bytes. If your code uses an Amazon Web Services SDK to classify documents, the SDK may encode the document file bytes for you.  The maximum length of this field depends on the input document type. For details, see  Inputs for real-time custom analysis in the Comprehend Developer Guide.  If you use the Bytes parameter, do not use the Text parameter.
     */
    Bytes?: SemiStructuredDocumentBlob;
    /**
     * Provides configuration parameters to override the default actions for extracting text from PDF documents and image files.
     */
    DocumentReaderConfig?: DocumentReaderConfig;
  }
  export interface ClassifyDocumentResponse {
    /**
     * The classes used by the document being analyzed. These are used for multi-class trained models. Individual classes are mutually exclusive and each document is expected to have only a single class assigned to it. For example, an animal can be a dog or a cat, but not both at the same time. 
     */
    Classes?: ListOfClasses;
    /**
     * The labels used the document being analyzed. These are used for multi-label trained models. Individual labels represent different categories that are related in some manner and are not mutually exclusive. For example, a movie can be just an action movie, or it can be an action movie, a science fiction movie, and a comedy, all at the same time. 
     */
    Labels?: ListOfLabels;
    /**
     * Extraction information about the document. This field is present in the response only if your request includes the Byte parameter. 
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The document type for each page in the input document. This field is present in the response only if your request includes the Byte parameter. 
     */
    DocumentType?: ListOfDocumentType;
    /**
     * Page-level errors that the system detected while processing the input document. The field is empty if the system encountered no errors.
     */
    Errors?: ListOfErrors;
    /**
     * Warnings detected while processing the input document. The response includes a warning if there is a mismatch between the input document type and the model type associated with the endpoint that you specified. The response can also include warnings for individual pages that have a mismatch.  The field is empty if the system generated no warnings.
     */
    Warnings?: ListOfWarnings;
  }
  export type ClientRequestTokenString = string;
  export type ComprehendArn = string;
  export type ComprehendArnName = string;
  export type ComprehendDatasetArn = string;
  export type ComprehendEndpointArn = string;
  export type ComprehendEndpointName = string;
  export type ComprehendFlywheelArn = string;
  export type ComprehendModelArn = string;
  export interface ContainsPiiEntitiesRequest {
    /**
     * A UTF-8 text string. The maximum string size is 100 KB.
     */
    Text: String;
    /**
     * The language of the input documents. Currently, English is the only valid language.
     */
    LanguageCode: LanguageCode;
  }
  export interface ContainsPiiEntitiesResponse {
    /**
     * The labels used in the document being analyzed. Individual labels represent personally identifiable information (PII) entity types.
     */
    Labels?: ListOfEntityLabels;
  }
  export interface CreateDatasetRequest {
    /**
     * The Amazon Resource Number (ARN) of the flywheel of the flywheel to receive the data.
     */
    FlywheelArn: ComprehendFlywheelArn;
    /**
     * Name of the dataset.
     */
    DatasetName: ComprehendArnName;
    /**
     * The dataset type. You can specify that the data in a dataset is for training the model or for testing the model.
     */
    DatasetType?: DatasetType;
    /**
     * Description of the dataset.
     */
    Description?: Description;
    /**
     * Information about the input data configuration. The type of input data varies based on the format of the input and whether the data is for a classifier model or an entity recognition model.
     */
    InputDataConfig: DatasetInputDataConfig;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * Tags for the dataset.
     */
    Tags?: TagList;
  }
  export interface CreateDatasetResponse {
    /**
     * The ARN of the dataset.
     */
    DatasetArn?: ComprehendDatasetArn;
  }
  export interface CreateDocumentClassifierRequest {
    /**
     * The name of the document classifier.
     */
    DocumentClassifierName: ComprehendArnName;
    /**
     * The version name given to the newly created classifier. Version names can have a maximum of 256 characters. Alphanumeric characters, hyphens (-) and underscores (_) are allowed. The version name must be unique among all models with the same classifier name in the Amazon Web Services account/Amazon Web Services Region.
     */
    VersionName?: VersionName;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * Tags to associate with the document classifier. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. 
     */
    Tags?: TagList;
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: DocumentClassifierInputDataConfig;
    /**
     * Specifies the location for the output files from a custom classifier job. This parameter is required for a request that creates a native classifier model.
     */
    OutputDataConfig?: DocumentClassifierOutputDataConfig;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * The language of the input documents. You can specify any of the languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your custom classifier. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Indicates the mode in which the classifier will be trained. The classifier can be trained in multi-class mode, which identifies one and only one class for each document, or multi-label mode, which identifies one or more labels for each document. In multi-label mode, multiple labels for an individual document are separated by a delimiter. The default delimiter between labels is a pipe (|).
     */
    Mode?: DocumentClassifierMode;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * The resource-based policy to attach to your custom document classifier model. You can use this policy to allow another Amazon Web Services account to import your custom model. Provide your policy as a JSON body that you enter as a UTF-8 encoded string without line breaks. To provide valid JSON, enclose the attribute names and values in double quotes. If the JSON body is also enclosed in double quotes, then you must escape the double quotes that are inside the policy:  "{\"attribute\": \"value\", \"attribute\": [\"value\"]}"  To avoid escaping quotes, you can use single quotes to enclose the policy and double quotes to enclose the JSON names and values:  '{"attribute": "value", "attribute": ["value"]}' 
     */
    ModelPolicy?: Policy;
  }
  export interface CreateDocumentClassifierResponse {
    /**
     * The Amazon Resource Name (ARN) that identifies the document classifier.
     */
    DocumentClassifierArn?: DocumentClassifierArn;
  }
  export interface CreateEndpointRequest {
    /**
     * This is the descriptive suffix that becomes part of the EndpointArn used for all subsequent requests to this resource. 
     */
    EndpointName: ComprehendEndpointName;
    /**
     * The Amazon Resource Number (ARN) of the model to which the endpoint will be attached.
     */
    ModelArn?: ComprehendModelArn;
    /**
     *  The desired number of inference units to be used by the model using this endpoint. Each inference unit represents of a throughput of 100 characters per second.
     */
    DesiredInferenceUnits: InferenceUnitsInteger;
    /**
     * An idempotency token provided by the customer. If this token matches a previous endpoint creation request, Amazon Comprehend will not return a ResourceInUseException. 
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * Tags to associate with the endpoint. A tag is a key-value pair that adds metadata to the endpoint. For example, a tag with "Sales" as the key might be added to an endpoint to indicate its use by the sales department. 
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to trained custom models encrypted with a customer managed key (ModelKmsKeyId).
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * The Amazon Resource Number (ARN) of the flywheel to which the endpoint will be attached.
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export interface CreateEndpointResponse {
    /**
     * The Amazon Resource Number (ARN) of the endpoint being created.
     */
    EndpointArn?: ComprehendEndpointArn;
    /**
     * The Amazon Resource Number (ARN) of the model to which the endpoint is attached.
     */
    ModelArn?: ComprehendModelArn;
  }
  export interface CreateEntityRecognizerRequest {
    /**
     * The name given to the newly created recognizer. Recognizer names can be a maximum of 256 characters. Alphanumeric characters, hyphens (-) and underscores (_) are allowed. The name must be unique in the account/Region.
     */
    RecognizerName: ComprehendArnName;
    /**
     * The version name given to the newly created recognizer. Version names can be a maximum of 256 characters. Alphanumeric characters, hyphens (-) and underscores (_) are allowed. The version name must be unique among all models with the same recognizer name in the account/Region.
     */
    VersionName?: VersionName;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * Tags to associate with the entity recognizer. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. 
     */
    Tags?: TagList;
    /**
     * Specifies the format and location of the input data. The S3 bucket containing the input data must be located in the same Region as the entity recognizer being created. 
     */
    InputDataConfig: EntityRecognizerInputDataConfig;
    /**
     *  A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     *  You can specify any of the following languages: English ("en"), Spanish ("es"), French ("fr"), Italian ("it"), German ("de"), or Portuguese ("pt"). If you plan to use this entity recognizer with PDF, Word, or image input files, you must specify English as the language. All training documents must be in the same language.
     */
    LanguageCode: LanguageCode;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your custom entity recognizer. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * The JSON resource-based policy to attach to your custom entity recognizer model. You can use this policy to allow another Amazon Web Services account to import your custom model. Provide your JSON as a UTF-8 encoded string without line breaks. To provide valid JSON for your policy, enclose the attribute names and values in double quotes. If the JSON body is also enclosed in double quotes, then you must escape the double quotes that are inside the policy:  "{\"attribute\": \"value\", \"attribute\": [\"value\"]}"  To avoid escaping quotes, you can use single quotes to enclose the policy and double quotes to enclose the JSON names and values:  '{"attribute": "value", "attribute": ["value"]}' 
     */
    ModelPolicy?: Policy;
  }
  export interface CreateEntityRecognizerResponse {
    /**
     * The Amazon Resource Name (ARN) that identifies the entity recognizer.
     */
    EntityRecognizerArn?: EntityRecognizerArn;
  }
  export interface CreateFlywheelRequest {
    /**
     * Name for the flywheel.
     */
    FlywheelName: ComprehendArnName;
    /**
     * To associate an existing model with the flywheel, specify the Amazon Resource Number (ARN) of the model version.
     */
    ActiveModelArn?: ComprehendModelArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend the permissions required to access the flywheel data in the data lake.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * Configuration about the custom classifier associated with the flywheel.
     */
    TaskConfig?: TaskConfig;
    /**
     * The model type.
     */
    ModelType?: ModelType;
    /**
     * Enter the S3 location for the data lake. You can specify a new S3 bucket or a new folder of an existing S3 bucket. The flywheel creates the data lake at this location.
     */
    DataLakeS3Uri: FlywheelS3Uri;
    /**
     * Data security configurations.
     */
    DataSecurityConfig?: DataSecurityConfig;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * The tags to associate with this flywheel.
     */
    Tags?: TagList;
  }
  export interface CreateFlywheelResponse {
    /**
     * The Amazon Resource Number (ARN) of the flywheel.
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * The Amazon Resource Number (ARN) of the active model version.
     */
    ActiveModelArn?: ComprehendModelArn;
  }
  export type CustomerInputString = string;
  export type CustomerInputStringList = CustomerInputString[];
  export interface DataSecurityConfig {
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt the volume.
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt the data in the data lake.
     */
    DataLakeKmsKeyId?: KmsKeyId;
    VpcConfig?: VpcConfig;
  }
  export type DatasetAugmentedManifestsList = DatasetAugmentedManifestsListItem[];
  export interface DatasetAugmentedManifestsListItem {
    /**
     * The JSON attribute that contains the annotations for your training documents. The number of attribute names that you specify depends on whether your augmented manifest file is the output of a single labeling job or a chained labeling job. If your file is the output of a single labeling job, specify the LabelAttributeName key that was used when the job was created in Ground Truth. If your file is the output of a chained labeling job, specify the LabelAttributeName key for one or more jobs in the chain. Each LabelAttributeName key provides the annotations from an individual job.
     */
    AttributeNames: AttributeNamesList;
    /**
     * The Amazon S3 location of the augmented manifest file.
     */
    S3Uri: S3Uri;
    /**
     * The S3 prefix to the annotation files that are referred in the augmented manifest file.
     */
    AnnotationDataS3Uri?: S3Uri;
    /**
     * The S3 prefix to the source files (PDFs) that are referred to in the augmented manifest file.
     */
    SourceDocumentsS3Uri?: S3Uri;
    /**
     * The type of augmented manifest. If you don't specify, the default is PlainTextDocument.   PLAIN_TEXT_DOCUMENT A document type that represents any unicode text that is encoded in UTF-8.
     */
    DocumentType?: AugmentedManifestsDocumentTypeFormat;
  }
  export type DatasetDataFormat = "COMPREHEND_CSV"|"AUGMENTED_MANIFEST"|string;
  export interface DatasetDocumentClassifierInputDataConfig {
    /**
     * The Amazon S3 URI for the input data. The S3 bucket must be in the same Region as the API endpoint that you are calling. The URI can point to a single input file or it can provide the prefix for a collection of input files. For example, if you use the URI S3://bucketName/prefix, if the prefix is a single file, Amazon Comprehend uses that file as input. If more than one file begins with the prefix, Amazon Comprehend uses all of them as input. This parameter is required if you set DataFormat to COMPREHEND_CSV.
     */
    S3Uri: S3Uri;
    /**
     * Indicates the delimiter used to separate each label for training a multi-label classifier. The default delimiter between labels is a pipe (|). You can use a different character as a delimiter (if it's an allowed character) by specifying it under Delimiter for labels. If the training documents use a delimiter other than the default or the delimiter you specify, the labels on that line will be combined to make a single unique label, such as LABELLABELLABEL.
     */
    LabelDelimiter?: LabelDelimiter;
  }
  export interface DatasetEntityRecognizerAnnotations {
    /**
     *  Specifies the Amazon S3 location where the training documents for an entity recognizer are located. The URI must be in the same Region as the API endpoint that you are calling.
     */
    S3Uri: S3Uri;
  }
  export interface DatasetEntityRecognizerDocuments {
    /**
     *  Specifies the Amazon S3 location where the documents for the dataset are located. 
     */
    S3Uri: S3Uri;
    /**
     *  Specifies how the text in an input file should be processed. This is optional, and the default is ONE_DOC_PER_LINE. ONE_DOC_PER_FILE - Each file is considered a separate document. Use this option when you are processing large documents, such as newspaper articles or scientific papers. ONE_DOC_PER_LINE - Each line in a file is considered a separate document. Use this option when you are processing many short documents, such as text messages.
     */
    InputFormat?: InputFormat;
  }
  export interface DatasetEntityRecognizerEntityList {
    /**
     * Specifies the Amazon S3 location where the entity list is located.
     */
    S3Uri: S3Uri;
  }
  export interface DatasetEntityRecognizerInputDataConfig {
    /**
     * The S3 location of the annotation documents for your custom entity recognizer.
     */
    Annotations?: DatasetEntityRecognizerAnnotations;
    /**
     * The format and location of the training documents for your custom entity recognizer.
     */
    Documents: DatasetEntityRecognizerDocuments;
    /**
     * The S3 location of the entity list for your custom entity recognizer.
     */
    EntityList?: DatasetEntityRecognizerEntityList;
  }
  export interface DatasetFilter {
    /**
     * Filter the datasets based on the dataset status.
     */
    Status?: DatasetStatus;
    /**
     * Filter the datasets based on the dataset type.
     */
    DatasetType?: DatasetType;
    /**
     * Filter the datasets to include datasets created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * Filter the datasets to include datasets created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
  }
  export interface DatasetInputDataConfig {
    /**
     * A list of augmented manifest files that provide training data for your custom model. An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth. 
     */
    AugmentedManifests?: DatasetAugmentedManifestsList;
    /**
     *  COMPREHEND_CSV: The data format is a two-column CSV file, where the first column contains labels and the second column contains documents.  AUGMENTED_MANIFEST: The data format 
     */
    DataFormat?: DatasetDataFormat;
    /**
     * The input properties for training a document classifier model.  For more information on how the input file is formatted, see Preparing training data in the Comprehend Developer Guide. 
     */
    DocumentClassifierInputDataConfig?: DatasetDocumentClassifierInputDataConfig;
    /**
     * The input properties for training an entity recognizer model.
     */
    EntityRecognizerInputDataConfig?: DatasetEntityRecognizerInputDataConfig;
  }
  export interface DatasetProperties {
    /**
     * The ARN of the dataset.
     */
    DatasetArn?: ComprehendDatasetArn;
    /**
     * The name of the dataset.
     */
    DatasetName?: ComprehendArnName;
    /**
     * The dataset type (training data or test data).
     */
    DatasetType?: DatasetType;
    /**
     * The S3 URI where the dataset is stored.
     */
    DatasetS3Uri?: S3Uri;
    /**
     * Description of the dataset.
     */
    Description?: Description;
    /**
     * The dataset status. While the system creates the dataset, the status is CREATING. When the dataset is ready to use, the status changes to COMPLETED. 
     */
    Status?: DatasetStatus;
    /**
     * A description of the status of the dataset.
     */
    Message?: AnyLengthString;
    /**
     * The number of documents in the dataset.
     */
    NumberOfDocuments?: NumberOfDocuments;
    /**
     * Creation time of the dataset.
     */
    CreationTime?: Timestamp;
    /**
     * Time when the data from the dataset becomes available in the data lake.
     */
    EndTime?: Timestamp;
  }
  export type DatasetPropertiesList = DatasetProperties[];
  export type DatasetStatus = "CREATING"|"COMPLETED"|"FAILED"|string;
  export type DatasetType = "TRAIN"|"TEST"|string;
  export interface DeleteDocumentClassifierRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the document classifier. 
     */
    DocumentClassifierArn: DocumentClassifierArn;
  }
  export interface DeleteDocumentClassifierResponse {
  }
  export interface DeleteEndpointRequest {
    /**
     * The Amazon Resource Number (ARN) of the endpoint being deleted.
     */
    EndpointArn: ComprehendEndpointArn;
  }
  export interface DeleteEndpointResponse {
  }
  export interface DeleteEntityRecognizerRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the entity recognizer.
     */
    EntityRecognizerArn: EntityRecognizerArn;
  }
  export interface DeleteEntityRecognizerResponse {
  }
  export interface DeleteFlywheelRequest {
    /**
     * The Amazon Resource Number (ARN) of the flywheel to delete.
     */
    FlywheelArn: ComprehendFlywheelArn;
  }
  export interface DeleteFlywheelResponse {
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom model version that has the policy to delete.
     */
    ResourceArn: ComprehendModelArn;
    /**
     * The revision ID of the policy to delete.
     */
    PolicyRevisionId?: PolicyRevisionId;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DescribeDatasetRequest {
    /**
     * The ARN of the dataset.
     */
    DatasetArn: ComprehendDatasetArn;
  }
  export interface DescribeDatasetResponse {
    /**
     * The dataset properties.
     */
    DatasetProperties?: DatasetProperties;
  }
  export interface DescribeDocumentClassificationJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The StartDocumentClassificationJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeDocumentClassificationJobResponse {
    /**
     * An object that describes the properties associated with the document classification job.
     */
    DocumentClassificationJobProperties?: DocumentClassificationJobProperties;
  }
  export interface DescribeDocumentClassifierRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the document classifier. The CreateDocumentClassifier operation returns this identifier in its response.
     */
    DocumentClassifierArn: DocumentClassifierArn;
  }
  export interface DescribeDocumentClassifierResponse {
    /**
     * An object that contains the properties associated with a document classifier.
     */
    DocumentClassifierProperties?: DocumentClassifierProperties;
  }
  export interface DescribeDominantLanguageDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The StartDominantLanguageDetectionJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeDominantLanguageDetectionJobResponse {
    /**
     * An object that contains the properties associated with a dominant language detection job.
     */
    DominantLanguageDetectionJobProperties?: DominantLanguageDetectionJobProperties;
  }
  export interface DescribeEndpointRequest {
    /**
     * The Amazon Resource Number (ARN) of the endpoint being described.
     */
    EndpointArn: ComprehendEndpointArn;
  }
  export interface DescribeEndpointResponse {
    /**
     * Describes information associated with the specific endpoint.
     */
    EndpointProperties?: EndpointProperties;
  }
  export interface DescribeEntitiesDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The StartEntitiesDetectionJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeEntitiesDetectionJobResponse {
    /**
     * An object that contains the properties associated with an entities detection job.
     */
    EntitiesDetectionJobProperties?: EntitiesDetectionJobProperties;
  }
  export interface DescribeEntityRecognizerRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the entity recognizer.
     */
    EntityRecognizerArn: EntityRecognizerArn;
  }
  export interface DescribeEntityRecognizerResponse {
    /**
     * Describes information associated with an entity recognizer.
     */
    EntityRecognizerProperties?: EntityRecognizerProperties;
  }
  export interface DescribeEventsDetectionJobRequest {
    /**
     * The identifier of the events detection job.
     */
    JobId: JobId;
  }
  export interface DescribeEventsDetectionJobResponse {
    /**
     * An object that contains the properties associated with an event detection job.
     */
    EventsDetectionJobProperties?: EventsDetectionJobProperties;
  }
  export interface DescribeFlywheelIterationRequest {
    /**
     * 
     */
    FlywheelArn: ComprehendFlywheelArn;
    /**
     * 
     */
    FlywheelIterationId: FlywheelIterationId;
  }
  export interface DescribeFlywheelIterationResponse {
    /**
     * The configuration properties of a flywheel iteration.
     */
    FlywheelIterationProperties?: FlywheelIterationProperties;
  }
  export interface DescribeFlywheelRequest {
    /**
     * The Amazon Resource Number (ARN) of the flywheel.
     */
    FlywheelArn: ComprehendFlywheelArn;
  }
  export interface DescribeFlywheelResponse {
    /**
     * The flywheel properties.
     */
    FlywheelProperties?: FlywheelProperties;
  }
  export interface DescribeKeyPhrasesDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The StartKeyPhrasesDetectionJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeKeyPhrasesDetectionJobResponse {
    /**
     * An object that contains the properties associated with a key phrases detection job. 
     */
    KeyPhrasesDetectionJobProperties?: KeyPhrasesDetectionJobProperties;
  }
  export interface DescribePiiEntitiesDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribePiiEntitiesDetectionJobResponse {
    PiiEntitiesDetectionJobProperties?: PiiEntitiesDetectionJobProperties;
  }
  export interface DescribeResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom model version that has the resource policy.
     */
    ResourceArn: ComprehendModelArn;
  }
  export interface DescribeResourcePolicyResponse {
    /**
     * The JSON body of the resource-based policy.
     */
    ResourcePolicy?: Policy;
    /**
     * The time at which the policy was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time at which the policy was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The revision ID of the policy. Each time you modify a policy, Amazon Comprehend assigns a new revision ID, and it deletes the prior version of the policy.
     */
    PolicyRevisionId?: PolicyRevisionId;
  }
  export interface DescribeSentimentDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeSentimentDetectionJobResponse {
    /**
     * An object that contains the properties associated with a sentiment detection job.
     */
    SentimentDetectionJobProperties?: SentimentDetectionJobProperties;
  }
  export interface DescribeTargetedSentimentDetectionJobRequest {
    /**
     * The identifier that Amazon Comprehend generated for the job. The StartTargetedSentimentDetectionJob operation returns this identifier in its response.
     */
    JobId: JobId;
  }
  export interface DescribeTargetedSentimentDetectionJobResponse {
    /**
     * An object that contains the properties associated with a targeted sentiment detection job.
     */
    TargetedSentimentDetectionJobProperties?: TargetedSentimentDetectionJobProperties;
  }
  export interface DescribeTopicsDetectionJobRequest {
    /**
     * The identifier assigned by the user to the detection job.
     */
    JobId: JobId;
  }
  export interface DescribeTopicsDetectionJobResponse {
    /**
     * The list of properties for the requested job.
     */
    TopicsDetectionJobProperties?: TopicsDetectionJobProperties;
  }
  export type Description = string;
  export interface DetectDominantLanguageRequest {
    /**
     * A UTF-8 text string. The string must contain at least 20 characters. The maximum string size is 100 KB.
     */
    Text: CustomerInputString;
  }
  export interface DetectDominantLanguageResponse {
    /**
     * Array of languages that Amazon Comprehend detected in the input text. The array is sorted in descending order of the score (the dominant language is always the first element in the array). For each language, the response returns the RFC 5646 language code and the level of confidence that Amazon Comprehend has in the accuracy of its inference. For more information about RFC 5646, see Tags for Identifying Languages on the IETF Tools web site.
     */
    Languages?: ListOfDominantLanguages;
  }
  export interface DetectEntitiesRequest {
    /**
     * A UTF-8 text string. The maximum string size is 100 KB. If you enter text using this parameter, do not use the Bytes parameter.
     */
    Text?: CustomerInputString;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. If your request includes the endpoint for a custom entity recognition model, Amazon Comprehend uses the language of your custom model, and it ignores any language code that you specify here. All input documents must be in the same language.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name of an endpoint that is associated with a custom entity recognition model. Provide an endpoint if you want to detect entities by using your own custom model instead of the default model that is used by Amazon Comprehend. If you specify an endpoint, Amazon Comprehend uses the language of your custom model, and it ignores any language code that you provide in your request. For information about endpoints, see Managing endpoints.
     */
    EndpointArn?: EntityRecognizerEndpointArn;
    /**
     * This field applies only when you use a custom entity recognition model that was trained with PDF annotations. For other cases, enter your text input in the Text field.  Use the Bytes parameter to input a text, PDF, Word or image file. Using a plain-text file in the Bytes parameter is equivelent to using the Text parameter (the Entities field in the response is identical). You can also use the Bytes parameter to input an Amazon Textract DetectDocumentText or AnalyzeDocument output file. Provide the input document as a sequence of base64-encoded bytes. If your code uses an Amazon Web Services SDK to detect entities, the SDK may encode the document file bytes for you.  The maximum length of this field depends on the input document type. For details, see  Inputs for real-time custom analysis in the Comprehend Developer Guide.  If you use the Bytes parameter, do not use the Text parameter.
     */
    Bytes?: SemiStructuredDocumentBlob;
    /**
     * Provides configuration parameters to override the default actions for extracting text from PDF documents and image files.
     */
    DocumentReaderConfig?: DocumentReaderConfig;
  }
  export interface DetectEntitiesResponse {
    /**
     * A collection of entities identified in the input text. For each entity, the response provides the entity text, entity type, where the entity text begins and ends, and the level of confidence that Amazon Comprehend has in the detection.  If your request uses a custom entity recognition model, Amazon Comprehend detects the entities that the model is trained to recognize. Otherwise, it detects the default entity types. For a list of default entity types, see Entities in the Comprehend Developer Guide. 
     */
    Entities?: ListOfEntities;
    /**
     * Information about the document, discovered during text extraction. This field is present in the response only if your request used the Byte parameter. 
     */
    DocumentMetadata?: DocumentMetadata;
    /**
     * The document type for each page in the input document. This field is present in the response only if your request used the Byte parameter. 
     */
    DocumentType?: ListOfDocumentType;
    /**
     * Information about each block of text in the input document. Blocks are nested. A page block contains a block for each line of text, which contains a block for each word.  The Block content for a Word input document does not include a Geometry field. The Block field is not present in the response for plain-text inputs.
     */
    Blocks?: ListOfBlocks;
    /**
     * Page-level errors that the system detected while processing the input document. The field is empty if the system encountered no errors.
     */
    Errors?: ListOfErrors;
  }
  export interface DetectKeyPhrasesRequest {
    /**
     * A UTF-8 text string. The string must contain less than 100 KB of UTF-8 encoded characters.
     */
    Text: CustomerInputString;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface DetectKeyPhrasesResponse {
    /**
     * A collection of key phrases that Amazon Comprehend identified in the input text. For each key phrase, the response provides the text of the key phrase, where the key phrase begins and ends, and the level of confidence that Amazon Comprehend has in the accuracy of the detection. 
     */
    KeyPhrases?: ListOfKeyPhrases;
  }
  export interface DetectPiiEntitiesRequest {
    /**
     * A UTF-8 text string. The maximum string size is 100 KB.
     */
    Text: String;
    /**
     * The language of the input documents. Currently, English is the only valid language.
     */
    LanguageCode: LanguageCode;
  }
  export interface DetectPiiEntitiesResponse {
    /**
     * A collection of PII entities identified in the input text. For each entity, the response provides the entity type, where the entity text begins and ends, and the level of confidence that Amazon Comprehend has in the detection.
     */
    Entities?: ListOfPiiEntities;
  }
  export interface DetectSentimentRequest {
    /**
     * A UTF-8 text string. The maximum string size is 5 KB.
     */
    Text: CustomerInputString;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
  }
  export interface DetectSentimentResponse {
    /**
     * The inferred sentiment that Amazon Comprehend has the highest level of confidence in.
     */
    Sentiment?: SentimentType;
    /**
     * An object that lists the sentiments, and their corresponding confidence levels.
     */
    SentimentScore?: SentimentScore;
  }
  export interface DetectSyntaxRequest {
    /**
     * A UTF-8 string. The maximum string size is 5 KB.
     */
    Text: CustomerInputString;
    /**
     * The language code of the input documents. You can specify any of the following languages supported by Amazon Comprehend: German ("de"), English ("en"), Spanish ("es"), French ("fr"), Italian ("it"), or Portuguese ("pt").
     */
    LanguageCode: SyntaxLanguageCode;
  }
  export interface DetectSyntaxResponse {
    /**
     * A collection of syntax tokens describing the text. For each token, the response provides the text, the token type, where the text begins and ends, and the level of confidence that Amazon Comprehend has that the token is correct. For a list of token types, see Syntax in the Comprehend Developer Guide. 
     */
    SyntaxTokens?: ListOfSyntaxTokens;
  }
  export interface DetectTargetedSentimentRequest {
    /**
     * A UTF-8 text string. The maximum string length is 5 KB.
     */
    Text: CustomerInputString;
    /**
     * The language of the input documents. Currently, English is the only supported language.
     */
    LanguageCode: LanguageCode;
  }
  export interface DetectTargetedSentimentResponse {
    /**
     * Targeted sentiment analysis for each of the entities identified in the input text.
     */
    Entities?: ListOfTargetedSentimentEntities;
  }
  export interface DocumentClass {
    /**
     * The name of the class.
     */
    Name?: String;
    /**
     * The confidence score that Amazon Comprehend has this class correctly attributed.
     */
    Score?: Float;
    /**
     * Page number in the input document. This field is present in the response only if your request includes the Byte parameter. 
     */
    Page?: Integer;
  }
  export interface DocumentClassificationConfig {
    /**
     * Classification mode indicates whether the documents are MULTI_CLASS or MULTI_LABEL.
     */
    Mode: DocumentClassifierMode;
    /**
     * One or more labels to associate with the custom classifier.
     */
    Labels?: LabelsList;
  }
  export interface DocumentClassificationJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface DocumentClassificationJobProperties {
    /**
     * The identifier assigned to the document classification job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the document classification job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:document-classification-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:document-classification-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned to the document classification job.
     */
    JobName?: JobName;
    /**
     * The current status of the document classification job. If the status is FAILED, the Message field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of the job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the document classification job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the document classification job completed.
     */
    EndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) that identifies the document classifier. 
     */
    DocumentClassifierArn?: DocumentClassifierArn;
    /**
     * The input data configuration that you supplied when you created the document classification job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the document classification job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your document classification job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * The Amazon Resource Number (ARN) of the flywheel
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export type DocumentClassificationJobPropertiesList = DocumentClassificationJobProperties[];
  export type DocumentClassifierArn = string;
  export type DocumentClassifierAugmentedManifestsList = AugmentedManifestsListItem[];
  export type DocumentClassifierDataFormat = "COMPREHEND_CSV"|"AUGMENTED_MANIFEST"|string;
  export type DocumentClassifierDocumentTypeFormat = "PLAIN_TEXT_DOCUMENT"|"SEMI_STRUCTURED_DOCUMENT"|string;
  export interface DocumentClassifierDocuments {
    /**
     * The S3 URI location of the training documents specified in the S3Uri CSV file.
     */
    S3Uri: S3Uri;
    /**
     * The S3 URI location of the test documents included in the TestS3Uri CSV file. This field is not required if you do not specify a test CSV file.
     */
    TestS3Uri?: S3Uri;
  }
  export type DocumentClassifierEndpointArn = string;
  export interface DocumentClassifierFilter {
    /**
     * Filters the list of classifiers based on status.
     */
    Status?: ModelStatus;
    /**
     * The name that you assigned to the document classifier
     */
    DocumentClassifierName?: ComprehendArnName;
    /**
     * Filters the list of classifiers based on the time that the classifier was submitted for processing. Returns only classifiers submitted before the specified time. Classifiers are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of classifiers based on the time that the classifier was submitted for processing. Returns only classifiers submitted after the specified time. Classifiers are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface DocumentClassifierInputDataConfig {
    /**
     * The format of your training data:    COMPREHEND_CSV: A two-column CSV file, where labels are provided in the first column, and documents are provided in the second. If you use this value, you must provide the S3Uri parameter in your request.    AUGMENTED_MANIFEST: A labeled dataset that is produced by Amazon SageMaker Ground Truth. This file is in JSON lines format. Each line is a complete JSON object that contains a training document and its associated labels.  If you use this value, you must provide the AugmentedManifests parameter in your request.   If you don't specify a value, Amazon Comprehend uses COMPREHEND_CSV as the default.
     */
    DataFormat?: DocumentClassifierDataFormat;
    /**
     * The Amazon S3 URI for the input data. The S3 bucket must be in the same Region as the API endpoint that you are calling. The URI can point to a single input file or it can provide the prefix for a collection of input files. For example, if you use the URI S3://bucketName/prefix, if the prefix is a single file, Amazon Comprehend uses that file as input. If more than one file begins with the prefix, Amazon Comprehend uses all of them as input. This parameter is required if you set DataFormat to COMPREHEND_CSV.
     */
    S3Uri?: S3Uri;
    /**
     * This specifies the Amazon S3 location where the test annotations for an entity recognizer are located. The URI must be in the same Amazon Web Services Region as the API endpoint that you are calling. 
     */
    TestS3Uri?: S3Uri;
    /**
     * Indicates the delimiter used to separate each label for training a multi-label classifier. The default delimiter between labels is a pipe (|). You can use a different character as a delimiter (if it's an allowed character) by specifying it under Delimiter for labels. If the training documents use a delimiter other than the default or the delimiter you specify, the labels on that line will be combined to make a single unique label, such as LABELLABELLABEL.
     */
    LabelDelimiter?: LabelDelimiter;
    /**
     * A list of augmented manifest files that provide training data for your custom model. An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth. This parameter is required if you set DataFormat to AUGMENTED_MANIFEST.
     */
    AugmentedManifests?: DocumentClassifierAugmentedManifestsList;
    /**
     * The type of input documents for training the model. Provide plain-text documents to create a plain-text model, and provide semi-structured documents to create a native model.
     */
    DocumentType?: DocumentClassifierDocumentTypeFormat;
    /**
     * The S3 location of the training documents. This parameter is required in a request to create a native classifier model.
     */
    Documents?: DocumentClassifierDocuments;
    DocumentReaderConfig?: DocumentReaderConfig;
  }
  export type DocumentClassifierMode = "MULTI_CLASS"|"MULTI_LABEL"|string;
  export interface DocumentClassifierOutputDataConfig {
    /**
     * When you use the OutputDataConfig object while creating a custom classifier, you specify the Amazon S3 location where you want to write the confusion matrix and other output files. The URI must be in the same Region as the API endpoint that you are calling. The location is used as the prefix for the actual location of this output file. When the custom classifier job is finished, the service creates the output file in a directory specific to the job. The S3Uri field contains the location of the output file, called output.tar.gz. It is a compressed archive that contains the confusion matrix.
     */
    S3Uri?: S3Uri;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt the output results from an analysis job. The KmsKeyId can be one of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"    KMS Key Alias: "alias/ExampleAlias"    ARN of a KMS Key Alias: "arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias"   
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The Amazon S3 prefix for the data lake location of the flywheel statistics.
     */
    FlywheelStatsS3Prefix?: S3Uri;
  }
  export interface DocumentClassifierProperties {
    /**
     * The Amazon Resource Name (ARN) that identifies the document classifier.
     */
    DocumentClassifierArn?: DocumentClassifierArn;
    /**
     * The language code for the language of the documents that the classifier was trained on.
     */
    LanguageCode?: LanguageCode;
    /**
     * The status of the document classifier. If the status is TRAINED the classifier is ready to use. If the status is TRAINED_WITH_WARNINGS the classifier training succeeded, but you should review the warnings returned in the CreateDocumentClassifier response.  If the status is FAILED you can see additional information about why the classifier wasn't trained in the Message field.
     */
    Status?: ModelStatus;
    /**
     * Additional information about the status of the classifier.
     */
    Message?: AnyLengthString;
    /**
     * The time that the document classifier was submitted for training.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that training the document classifier completed.
     */
    EndTime?: Timestamp;
    /**
     * Indicates the time when the training starts on documentation classifiers. You are billed for the time interval between this time and the value of TrainingEndTime. 
     */
    TrainingStartTime?: Timestamp;
    /**
     * The time that training of the document classifier was completed. Indicates the time when the training completes on documentation classifiers. You are billed for the time interval between this time and the value of TrainingStartTime.
     */
    TrainingEndTime?: Timestamp;
    /**
     * The input data configuration that you supplied when you created the document classifier for training.
     */
    InputDataConfig?: DocumentClassifierInputDataConfig;
    /**
     *  Provides output results configuration parameters for custom classifier jobs.
     */
    OutputDataConfig?: DocumentClassifierOutputDataConfig;
    /**
     * Information about the document classifier, including the number of documents used for training the classifier, the number of documents used for test the classifier, and an accuracy rating.
     */
    ClassifierMetadata?: ClassifierMetadata;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your custom classifier. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Indicates the mode in which the specific classifier was trained. This also indicates the format of input documents and the format of the confusion matrix. Each classifier can only be trained in one mode and this cannot be changed once the classifier is trained.
     */
    Mode?: DocumentClassifierMode;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * The version name that you assigned to the document classifier.
     */
    VersionName?: VersionName;
    /**
     * The Amazon Resource Name (ARN) of the source model. This model was imported from a different Amazon Web Services account to create the document classifier model in your Amazon Web Services account.
     */
    SourceModelArn?: DocumentClassifierArn;
    /**
     * The Amazon Resource Number (ARN) of the flywheel
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export type DocumentClassifierPropertiesList = DocumentClassifierProperties[];
  export type DocumentClassifierSummariesList = DocumentClassifierSummary[];
  export interface DocumentClassifierSummary {
    /**
     * The name that you assigned the document classifier.
     */
    DocumentClassifierName?: ComprehendArnName;
    /**
     * The number of versions you created.
     */
    NumberOfVersions?: Integer;
    /**
     * The time that the latest document classifier version was submitted for processing.
     */
    LatestVersionCreatedAt?: Timestamp;
    /**
     * The version name you assigned to the latest document classifier version.
     */
    LatestVersionName?: VersionName;
    /**
     * Provides the status of the latest document classifier version.
     */
    LatestVersionStatus?: ModelStatus;
  }
  export interface DocumentLabel {
    /**
     * The name of the label.
     */
    Name?: String;
    /**
     * The confidence score that Amazon Comprehend has this label correctly attributed.
     */
    Score?: Float;
    /**
     * Page number where the label occurs. This field is present in the response only if your request includes the Byte parameter. 
     */
    Page?: Integer;
  }
  export interface DocumentMetadata {
    /**
     * Number of pages in the document.
     */
    Pages?: Integer;
    /**
     * List of pages in the document, with the number of characters extracted from each page.
     */
    ExtractedCharacters?: ListOfExtractedCharacters;
  }
  export type DocumentReadAction = "TEXTRACT_DETECT_DOCUMENT_TEXT"|"TEXTRACT_ANALYZE_DOCUMENT"|string;
  export type DocumentReadFeatureTypes = "TABLES"|"FORMS"|string;
  export type DocumentReadMode = "SERVICE_DEFAULT"|"FORCE_DOCUMENT_READ_ACTION"|string;
  export interface DocumentReaderConfig {
    /**
     * This field defines the Amazon Textract API operation that Amazon Comprehend uses to extract text from PDF files and image files. Enter one of the following values:    TEXTRACT_DETECT_DOCUMENT_TEXT - The Amazon Comprehend service uses the DetectDocumentText API operation.     TEXTRACT_ANALYZE_DOCUMENT - The Amazon Comprehend service uses the AnalyzeDocument API operation.   
     */
    DocumentReadAction: DocumentReadAction;
    /**
     * Determines the text extraction actions for PDF files. Enter one of the following values:    SERVICE_DEFAULT - use the Amazon Comprehend service defaults for PDF files.    FORCE_DOCUMENT_READ_ACTION - Amazon Comprehend uses the Textract API specified by DocumentReadAction for all PDF files, including digital PDF files.   
     */
    DocumentReadMode?: DocumentReadMode;
    /**
     * Specifies the type of Amazon Textract features to apply. If you chose TEXTRACT_ANALYZE_DOCUMENT as the read action, you must specify one or both of the following values:    TABLES - Returns information about any tables that are detected in the input document.     FORMS - Returns information and the data from any forms that are detected in the input document.   
     */
    FeatureTypes?: ListOfDocumentReadFeatureTypes;
  }
  export type DocumentType = "NATIVE_PDF"|"SCANNED_PDF"|"MS_WORD"|"IMAGE"|"PLAIN_TEXT"|"TEXTRACT_DETECT_DOCUMENT_TEXT_JSON"|"TEXTRACT_ANALYZE_DOCUMENT_JSON"|string;
  export interface DocumentTypeListItem {
    /**
     * Page number.
     */
    Page?: Integer;
    /**
     * Document type.
     */
    Type?: DocumentType;
  }
  export interface DominantLanguage {
    /**
     * The RFC 5646 language code for the dominant language. For more information about RFC 5646, see Tags for Identifying Languages on the IETF Tools web site.
     */
    LanguageCode?: String;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of the detection.
     */
    Score?: Float;
  }
  export interface DominantLanguageDetectionJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface DominantLanguageDetectionJobProperties {
    /**
     * The identifier assigned to the dominant language detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the dominant language detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:dominant-language-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:dominant-language-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned to the dominant language detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the dominant language detection job. If the status is FAILED, the Message field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description for the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the dominant language detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the dominant language detection job completed.
     */
    EndTime?: Timestamp;
    /**
     * The input data configuration that you supplied when you created the dominant language detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the dominant language detection job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your dominant language detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
  }
  export type DominantLanguageDetectionJobPropertiesList = DominantLanguageDetectionJobProperties[];
  export type Double = number;
  export interface EndpointFilter {
    /**
     * The Amazon Resource Number (ARN) of the model to which the endpoint is attached.
     */
    ModelArn?: ComprehendModelArn;
    /**
     * Specifies the status of the endpoint being returned. Possible values are: Creating, Ready, Updating, Deleting, Failed.
     */
    Status?: EndpointStatus;
    /**
     * Specifies a date before which the returned endpoint or endpoints were created.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * Specifies a date after which the returned endpoint or endpoints were created.
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface EndpointProperties {
    /**
     * The Amazon Resource Number (ARN) of the endpoint.
     */
    EndpointArn?: ComprehendEndpointArn;
    /**
     * Specifies the status of the endpoint. Because the endpoint updates and creation are asynchronous, so customers will need to wait for the endpoint to be Ready status before making inference requests.
     */
    Status?: EndpointStatus;
    /**
     * Specifies a reason for failure in cases of Failed status.
     */
    Message?: AnyLengthString;
    /**
     * The Amazon Resource Number (ARN) of the model to which the endpoint is attached.
     */
    ModelArn?: ComprehendModelArn;
    /**
     * ARN of the new model to use for updating an existing endpoint. This ARN is going to be different from the model ARN when the update is in progress
     */
    DesiredModelArn?: ComprehendModelArn;
    /**
     * The desired number of inference units to be used by the model using this endpoint. Each inference unit represents of a throughput of 100 characters per second.
     */
    DesiredInferenceUnits?: InferenceUnitsInteger;
    /**
     * The number of inference units currently used by the model using this endpoint.
     */
    CurrentInferenceUnits?: InferenceUnitsInteger;
    /**
     * The creation date and time of the endpoint.
     */
    CreationTime?: Timestamp;
    /**
     * The date and time that the endpoint was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to trained custom models encrypted with a customer managed key (ModelKmsKeyId).
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * Data access role ARN to use in case the new model is encrypted with a customer KMS key.
     */
    DesiredDataAccessRoleArn?: IamRoleArn;
    /**
     * The Amazon Resource Number (ARN) of the flywheel
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export type EndpointPropertiesList = EndpointProperties[];
  export type EndpointStatus = "CREATING"|"DELETING"|"FAILED"|"IN_SERVICE"|"UPDATING"|string;
  export interface EntitiesDetectionJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface EntitiesDetectionJobProperties {
    /**
     * The identifier assigned to the entities detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the entities detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:entities-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:entities-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned the entities detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the entities detection job. If the status is FAILED, the Message field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the entities detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the entities detection job completed
     */
    EndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) that identifies the entity recognizer.
     */
    EntityRecognizerArn?: EntityRecognizerArn;
    /**
     * The input data configuration that you supplied when you created the entities detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the entities detection job. 
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The language code of the input documents.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your entity detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * The Amazon Resource Name (ARN) of the flywheel associated with this job.
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export type EntitiesDetectionJobPropertiesList = EntitiesDetectionJobProperties[];
  export interface Entity {
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of the detection.
     */
    Score?: Float;
    /**
     * The entity type. For entity detection using the built-in model, this field contains one of the standard entity types listed below. For custom entity detection, this field contains one of the entity types that you specified when you trained your custom model.
     */
    Type?: EntityType;
    /**
     * The text of the entity.
     */
    Text?: String;
    /**
     * The zero-based offset from the beginning of the source text to the first character in the entity. This field is empty for non-text input.
     */
    BeginOffset?: Integer;
    /**
     * The zero-based offset from the beginning of the source text to the last character in the entity. This field is empty for non-text input.
     */
    EndOffset?: Integer;
    /**
     * A reference to each block for this entity. This field is empty for plain-text input.
     */
    BlockReferences?: ListOfBlockReferences;
  }
  export interface EntityLabel {
    /**
     * The name of the label.
     */
    Name?: PiiEntityType;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of the detection.
     */
    Score?: Float;
  }
  export interface EntityRecognitionConfig {
    /**
     * Up to 25 entity types that the model is trained to recognize.
     */
    EntityTypes: EntityTypesList;
  }
  export interface EntityRecognizerAnnotations {
    /**
     *  Specifies the Amazon S3 location where the annotations for an entity recognizer are located. The URI must be in the same Region as the API endpoint that you are calling.
     */
    S3Uri: S3Uri;
    /**
     *  Specifies the Amazon S3 location where the test annotations for an entity recognizer are located. The URI must be in the same Region as the API endpoint that you are calling.
     */
    TestS3Uri?: S3Uri;
  }
  export type EntityRecognizerArn = string;
  export type EntityRecognizerAugmentedManifestsList = AugmentedManifestsListItem[];
  export type EntityRecognizerDataFormat = "COMPREHEND_CSV"|"AUGMENTED_MANIFEST"|string;
  export interface EntityRecognizerDocuments {
    /**
     *  Specifies the Amazon S3 location where the training documents for an entity recognizer are located. The URI must be in the same Region as the API endpoint that you are calling.
     */
    S3Uri: S3Uri;
    /**
     *  Specifies the Amazon S3 location where the test documents for an entity recognizer are located. The URI must be in the same Amazon Web Services Region as the API endpoint that you are calling.
     */
    TestS3Uri?: S3Uri;
    /**
     *  Specifies how the text in an input file should be processed. This is optional, and the default is ONE_DOC_PER_LINE. ONE_DOC_PER_FILE - Each file is considered a separate document. Use this option when you are processing large documents, such as newspaper articles or scientific papers. ONE_DOC_PER_LINE - Each line in a file is considered a separate document. Use this option when you are processing many short documents, such as text messages.
     */
    InputFormat?: InputFormat;
  }
  export type EntityRecognizerEndpointArn = string;
  export interface EntityRecognizerEntityList {
    /**
     * Specifies the Amazon S3 location where the entity list is located. The URI must be in the same Region as the API endpoint that you are calling.
     */
    S3Uri: S3Uri;
  }
  export interface EntityRecognizerEvaluationMetrics {
    /**
     * A measure of the usefulness of the recognizer results in the test data. High precision means that the recognizer returned substantially more relevant results than irrelevant ones. 
     */
    Precision?: Double;
    /**
     * A measure of how complete the recognizer results are for the test data. High recall means that the recognizer returned most of the relevant results.
     */
    Recall?: Double;
    /**
     * A measure of how accurate the recognizer results are for the test data. It is derived from the Precision and Recall values. The F1Score is the harmonic average of the two scores. For plain text entity recognizer models, the range is 0 to 100, where 100 is the best score. For PDF/Word entity recognizer models, the range is 0 to 1, where 1 is the best score. 
     */
    F1Score?: Double;
  }
  export interface EntityRecognizerFilter {
    /**
     * The status of an entity recognizer.
     */
    Status?: ModelStatus;
    /**
     * The name that you assigned the entity recognizer.
     */
    RecognizerName?: ComprehendArnName;
    /**
     * Filters the list of entities based on the time that the list was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of entities based on the time that the list was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface EntityRecognizerInputDataConfig {
    /**
     * The format of your training data:    COMPREHEND_CSV: A CSV file that supplements your training documents. The CSV file contains information about the custom entities that your trained model will detect. The required format of the file depends on whether you are providing annotations or an entity list. If you use this value, you must provide your CSV file by using either the Annotations or EntityList parameters. You must provide your training documents by using the Documents parameter.    AUGMENTED_MANIFEST: A labeled dataset that is produced by Amazon SageMaker Ground Truth. This file is in JSON lines format. Each line is a complete JSON object that contains a training document and its labels. Each label annotates a named entity in the training document.  If you use this value, you must provide the AugmentedManifests parameter in your request.   If you don't specify a value, Amazon Comprehend uses COMPREHEND_CSV as the default.
     */
    DataFormat?: EntityRecognizerDataFormat;
    /**
     * The entity types in the labeled training data that Amazon Comprehend uses to train the custom entity recognizer. Any entity types that you don't specify are ignored. A maximum of 25 entity types can be used at one time to train an entity recognizer. Entity types must not contain the following invalid characters: \n (line break), \\n (escaped line break), \r (carriage return), \\r (escaped carriage return), \t (tab), \\t (escaped tab), space, and , (comma). 
     */
    EntityTypes: EntityTypesList;
    /**
     * The S3 location of the folder that contains the training documents for your custom entity recognizer. This parameter is required if you set DataFormat to COMPREHEND_CSV.
     */
    Documents?: EntityRecognizerDocuments;
    /**
     * The S3 location of the CSV file that annotates your training documents.
     */
    Annotations?: EntityRecognizerAnnotations;
    /**
     * The S3 location of the CSV file that has the entity list for your custom entity recognizer.
     */
    EntityList?: EntityRecognizerEntityList;
    /**
     * A list of augmented manifest files that provide training data for your custom model. An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth. This parameter is required if you set DataFormat to AUGMENTED_MANIFEST.
     */
    AugmentedManifests?: EntityRecognizerAugmentedManifestsList;
  }
  export interface EntityRecognizerMetadata {
    /**
     *  The number of documents in the input data that were used to train the entity recognizer. Typically this is 80 to 90 percent of the input documents.
     */
    NumberOfTrainedDocuments?: Integer;
    /**
     *  The number of documents in the input data that were used to test the entity recognizer. Typically this is 10 to 20 percent of the input documents.
     */
    NumberOfTestDocuments?: Integer;
    /**
     * Detailed information about the accuracy of an entity recognizer.
     */
    EvaluationMetrics?: EntityRecognizerEvaluationMetrics;
    /**
     * Entity types from the metadata of an entity recognizer.
     */
    EntityTypes?: EntityRecognizerMetadataEntityTypesList;
  }
  export type EntityRecognizerMetadataEntityTypesList = EntityRecognizerMetadataEntityTypesListItem[];
  export interface EntityRecognizerMetadataEntityTypesListItem {
    /**
     * Type of entity from the list of entity types in the metadata of an entity recognizer. 
     */
    Type?: AnyLengthString;
    /**
     * Detailed information about the accuracy of the entity recognizer for a specific item on the list of entity types. 
     */
    EvaluationMetrics?: EntityTypesEvaluationMetrics;
    /**
     * Indicates the number of times the given entity type was seen in the training data. 
     */
    NumberOfTrainMentions?: Integer;
  }
  export interface EntityRecognizerOutputDataConfig {
    /**
     * The Amazon S3 prefix for the data lake location of the flywheel statistics.
     */
    FlywheelStatsS3Prefix?: S3Uri;
  }
  export interface EntityRecognizerProperties {
    /**
     * The Amazon Resource Name (ARN) that identifies the entity recognizer.
     */
    EntityRecognizerArn?: EntityRecognizerArn;
    /**
     *  The language of the input documents. All documents must be in the same language. Only English ("en") is currently supported.
     */
    LanguageCode?: LanguageCode;
    /**
     * Provides the status of the entity recognizer.
     */
    Status?: ModelStatus;
    /**
     *  A description of the status of the recognizer.
     */
    Message?: AnyLengthString;
    /**
     * The time that the recognizer was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the recognizer creation completed.
     */
    EndTime?: Timestamp;
    /**
     * The time that training of the entity recognizer started.
     */
    TrainingStartTime?: Timestamp;
    /**
     * The time that training of the entity recognizer was completed.
     */
    TrainingEndTime?: Timestamp;
    /**
     * The input data properties of an entity recognizer.
     */
    InputDataConfig?: EntityRecognizerInputDataConfig;
    /**
     *  Provides information about an entity recognizer.
     */
    RecognizerMetadata?: EntityRecognizerMetadata;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your custom entity recognizer. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * The version name you assigned to the entity recognizer.
     */
    VersionName?: VersionName;
    /**
     * The Amazon Resource Name (ARN) of the source model. This model was imported from a different Amazon Web Services account to create the entity recognizer model in your Amazon Web Services account.
     */
    SourceModelArn?: EntityRecognizerArn;
    /**
     * The Amazon Resource Number (ARN) of the flywheel
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * Output data configuration.
     */
    OutputDataConfig?: EntityRecognizerOutputDataConfig;
  }
  export type EntityRecognizerPropertiesList = EntityRecognizerProperties[];
  export type EntityRecognizerSummariesList = EntityRecognizerSummary[];
  export interface EntityRecognizerSummary {
    /**
     *  The name that you assigned the entity recognizer.
     */
    RecognizerName?: ComprehendArnName;
    /**
     *  The number of versions you created.
     */
    NumberOfVersions?: Integer;
    /**
     *  The time that the latest entity recognizer version was submitted for processing.
     */
    LatestVersionCreatedAt?: Timestamp;
    /**
     *  The version name you assigned to the latest entity recognizer version.
     */
    LatestVersionName?: VersionName;
    /**
     *  Provides the status of the latest entity recognizer version.
     */
    LatestVersionStatus?: ModelStatus;
  }
  export type EntityType = "PERSON"|"LOCATION"|"ORGANIZATION"|"COMMERCIAL_ITEM"|"EVENT"|"DATE"|"QUANTITY"|"TITLE"|"OTHER"|string;
  export type EntityTypeName = string;
  export interface EntityTypesEvaluationMetrics {
    /**
     * A measure of the usefulness of the recognizer results for a specific entity type in the test data. High precision means that the recognizer returned substantially more relevant results than irrelevant ones. 
     */
    Precision?: Double;
    /**
     * A measure of how complete the recognizer results are for a specific entity type in the test data. High recall means that the recognizer returned most of the relevant results.
     */
    Recall?: Double;
    /**
     * A measure of how accurate the recognizer results are for a specific entity type in the test data. It is derived from the Precision and Recall values. The F1Score is the harmonic average of the two scores. The highest score is 1, and the worst score is 0. 
     */
    F1Score?: Double;
  }
  export type EntityTypesList = EntityTypesListItem[];
  export interface EntityTypesListItem {
    /**
     * An entity type within a labeled training dataset that Amazon Comprehend uses to train a custom entity recognizer. Entity types must not contain the following invalid characters: \n (line break), \\n (escaped line break, \r (carriage return), \\r (escaped carriage return), \t (tab), \\t (escaped tab), space, and , (comma).
     */
    Type: EntityTypeName;
  }
  export interface ErrorsListItem {
    /**
     * Page number where the error occurred.
     */
    Page?: Integer;
    /**
     * Error code for the cause of the error.
     */
    ErrorCode?: PageBasedErrorCode;
    /**
     * Text message explaining the reason for the error.
     */
    ErrorMessage?: String;
  }
  export type EventTypeString = string;
  export interface EventsDetectionJobFilter {
    /**
     * Filters on the name of the events detection job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface EventsDetectionJobProperties {
    /**
     * The identifier assigned to the events detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the events detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:events-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:events-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name you assigned the events detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the events detection job.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of the events detection job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the events detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the events detection job completed.
     */
    EndTime?: Timestamp;
    /**
     * The input data configuration that you supplied when you created the events detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the events detection job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The language code of the input documents.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * The types of events that are detected by the job.
     */
    TargetEventTypes?: TargetEventTypes;
  }
  export type EventsDetectionJobPropertiesList = EventsDetectionJobProperties[];
  export interface ExtractedCharactersListItem {
    /**
     * Page number.
     */
    Page?: Integer;
    /**
     * Number of characters extracted from each page.
     */
    Count?: Integer;
  }
  export type Float = number;
  export interface FlywheelFilter {
    /**
     * Filter the flywheels based on the flywheel status.
     */
    Status?: FlywheelStatus;
    /**
     * Filter the flywheels to include flywheels created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * Filter the flywheels to include flywheels created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
  }
  export interface FlywheelIterationFilter {
    /**
     * Filter the flywheel iterations to include iterations created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * Filter the flywheel iterations to include iterations created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
  }
  export type FlywheelIterationId = string;
  export interface FlywheelIterationProperties {
    /**
     * 
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * 
     */
    FlywheelIterationId?: FlywheelIterationId;
    /**
     * The creation start time of the flywheel iteration.
     */
    CreationTime?: Timestamp;
    /**
     * The completion time of this flywheel iteration.
     */
    EndTime?: Timestamp;
    /**
     * The status of the flywheel iteration.
     */
    Status?: FlywheelIterationStatus;
    /**
     * A description of the status of the flywheel iteration.
     */
    Message?: AnyLengthString;
    /**
     * The ARN of the evaluated model associated with this flywheel iteration.
     */
    EvaluatedModelArn?: ComprehendModelArn;
    EvaluatedModelMetrics?: FlywheelModelEvaluationMetrics;
    /**
     * The ARN of the trained model associated with this flywheel iteration.
     */
    TrainedModelArn?: ComprehendModelArn;
    /**
     * The metrics associated with the trained model.
     */
    TrainedModelMetrics?: FlywheelModelEvaluationMetrics;
    /**
     * 
     */
    EvaluationManifestS3Prefix?: S3Uri;
  }
  export type FlywheelIterationPropertiesList = FlywheelIterationProperties[];
  export type FlywheelIterationStatus = "TRAINING"|"EVALUATING"|"COMPLETED"|"FAILED"|"STOP_REQUESTED"|"STOPPED"|string;
  export interface FlywheelModelEvaluationMetrics {
    /**
     * The average F1 score from the evaluation metrics.
     */
    AverageF1Score?: Double;
    /**
     * Average precision metric for the model.
     */
    AveragePrecision?: Double;
    /**
     * Average recall metric for the model.
     */
    AverageRecall?: Double;
    /**
     * Average accuracy metric for the model.
     */
    AverageAccuracy?: Double;
  }
  export interface FlywheelProperties {
    /**
     * The Amazon Resource Number (ARN) of the flywheel.
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * The Amazon Resource Number (ARN) of the active model version.
     */
    ActiveModelArn?: ComprehendModelArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend permission to access the flywheel data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * Configuration about the custom classifier associated with the flywheel.
     */
    TaskConfig?: TaskConfig;
    /**
     * Amazon S3 URI of the data lake location. 
     */
    DataLakeS3Uri?: S3Uri;
    /**
     * Data security configuration.
     */
    DataSecurityConfig?: DataSecurityConfig;
    /**
     * The status of the flywheel.
     */
    Status?: FlywheelStatus;
    /**
     * Model type of the flywheel's model.
     */
    ModelType?: ModelType;
    /**
     * A description of the status of the flywheel.
     */
    Message?: AnyLengthString;
    /**
     * Creation time of the flywheel.
     */
    CreationTime?: Timestamp;
    /**
     * Last modified time for the flywheel.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The most recent flywheel iteration.
     */
    LatestFlywheelIteration?: FlywheelIterationId;
  }
  export type FlywheelS3Uri = string;
  export type FlywheelStatus = "CREATING"|"ACTIVE"|"UPDATING"|"DELETING"|"FAILED"|string;
  export interface FlywheelSummary {
    /**
     * The Amazon Resource Number (ARN) of the flywheel
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * ARN of the active model version for the flywheel.
     */
    ActiveModelArn?: ComprehendModelArn;
    /**
     * Amazon S3 URI of the data lake location. 
     */
    DataLakeS3Uri?: S3Uri;
    /**
     * The status of the flywheel.
     */
    Status?: FlywheelStatus;
    /**
     * Model type of the flywheel's model.
     */
    ModelType?: ModelType;
    /**
     * A description of the status of the flywheel.
     */
    Message?: AnyLengthString;
    /**
     * Creation time of the flywheel.
     */
    CreationTime?: Timestamp;
    /**
     * Last modified time for the flywheel.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The most recent flywheel iteration.
     */
    LatestFlywheelIteration?: FlywheelIterationId;
  }
  export type FlywheelSummaryList = FlywheelSummary[];
  export interface Geometry {
    /**
     * An axis-aligned coarse representation of the location of the recognized item on the document page.
     */
    BoundingBox?: BoundingBox;
    /**
     * Within the bounding box, a fine-grained polygon around the recognized item.
     */
    Polygon?: Polygon;
  }
  export type IamRoleArn = string;
  export interface ImportModelRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom model to import.
     */
    SourceModelArn: ComprehendModelArn;
    /**
     * The name to assign to the custom model that is created in Amazon Comprehend by this import.
     */
    ModelName?: ComprehendArnName;
    /**
     * The version name given to the custom model that is created by this import. Version names can have a maximum of 256 characters. Alphanumeric characters, hyphens (-) and underscores (_) are allowed. The version name must be unique among all models with the same classifier name in the account/Region.
     */
    VersionName?: VersionName;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend permission to use Amazon Key Management Service (KMS) to encrypt or decrypt the custom model.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * Tags to associate with the custom model that is created by this import. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface ImportModelResponse {
    /**
     * The Amazon Resource Name (ARN) of the custom model being imported.
     */
    ModelArn?: ComprehendModelArn;
  }
  export type InferenceUnitsInteger = number;
  export interface InputDataConfig {
    /**
     * The Amazon S3 URI for the input data. The URI must be in same Region as the API endpoint that you are calling. The URI can point to a single input file or it can provide the prefix for a collection of data files.  For example, if you use the URI S3://bucketName/prefix, if the prefix is a single file, Amazon Comprehend uses that file as input. If more than one file begins with the prefix, Amazon Comprehend uses all of them as input.
     */
    S3Uri: S3Uri;
    /**
     * Specifies how the text in an input file should be processed:    ONE_DOC_PER_FILE - Each file is considered a separate document. Use this option when you are processing large documents, such as newspaper articles or scientific papers.    ONE_DOC_PER_LINE - Each line in a file is considered a separate document. Use this option when you are processing many short documents, such as text messages.  
     */
    InputFormat?: InputFormat;
    /**
     * Provides configuration parameters to override the default actions for extracting text from PDF documents and image files.
     */
    DocumentReaderConfig?: DocumentReaderConfig;
  }
  export type InputFormat = "ONE_DOC_PER_FILE"|"ONE_DOC_PER_LINE"|string;
  export type Integer = number;
  export type JobId = string;
  export type JobName = string;
  export type JobStatus = "SUBMITTED"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|"STOP_REQUESTED"|"STOPPED"|string;
  export interface KeyPhrase {
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of the detection.
     */
    Score?: Float;
    /**
     * The text of a key noun phrase.
     */
    Text?: String;
    /**
     * The zero-based offset from the beginning of the source text to the first character in the key phrase.
     */
    BeginOffset?: Integer;
    /**
     * The zero-based offset from the beginning of the source text to the last character in the key phrase.
     */
    EndOffset?: Integer;
  }
  export interface KeyPhrasesDetectionJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface KeyPhrasesDetectionJobProperties {
    /**
     * The identifier assigned to the key phrases detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the key phrases detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:key-phrases-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:key-phrases-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned the key phrases detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the key phrases detection job. If the status is FAILED, the Message field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the key phrases detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the key phrases detection job completed.
     */
    EndTime?: Timestamp;
    /**
     * The input data configuration that you supplied when you created the key phrases detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the key phrases detection job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The language code of the input documents.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your key phrases detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
  }
  export type KeyPhrasesDetectionJobPropertiesList = KeyPhrasesDetectionJobProperties[];
  export type KmsKeyId = string;
  export type LabelDelimiter = string;
  export type LabelListItem = string;
  export type LabelsList = LabelListItem[];
  export type LanguageCode = "en"|"es"|"fr"|"de"|"it"|"pt"|"ar"|"hi"|"ja"|"ko"|"zh"|"zh-TW"|string;
  export interface ListDatasetsRequest {
    /**
     * The Amazon Resource Number (ARN) of the flywheel.
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * Filters the datasets to be returned in the response.
     */
    Filter?: DatasetFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a response. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListDatasetsResponse {
    /**
     * The dataset properties list.
     */
    DatasetPropertiesList?: DatasetPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListDocumentClassificationJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their names, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: DocumentClassificationJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListDocumentClassificationJobsResponse {
    /**
     * A list containing the properties of each job returned.
     */
    DocumentClassificationJobPropertiesList?: DocumentClassificationJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListDocumentClassifierSummariesRequest {
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return on each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListDocumentClassifierSummariesResponse {
    /**
     * The list of summaries of document classifiers.
     */
    DocumentClassifierSummariesList?: DocumentClassifierSummariesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListDocumentClassifiersRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: DocumentClassifierFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListDocumentClassifiersResponse {
    /**
     * A list containing the properties of each job returned.
     */
    DocumentClassifierPropertiesList?: DocumentClassifierPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListDominantLanguageDetectionJobsRequest {
    /**
     * Filters that jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: DominantLanguageDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListDominantLanguageDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    DominantLanguageDetectionJobPropertiesList?: DominantLanguageDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListEndpointsRequest {
    /**
     * Filters the endpoints that are returned. You can filter endpoints on their name, model, status, or the date and time that they were created. You can only set one filter at a time. 
     */
    Filter?: EndpointFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListEndpointsResponse {
    /**
     * Displays a list of endpoint properties being retrieved by the service in response to the request.
     */
    EndpointPropertiesList?: EndpointPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListEntitiesDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: EntitiesDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListEntitiesDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    EntitiesDetectionJobPropertiesList?: EntitiesDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListEntityRecognizerSummariesRequest {
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return on each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListEntityRecognizerSummariesResponse {
    /**
     * The list entity recognizer summaries.
     */
    EntityRecognizerSummariesList?: EntityRecognizerSummariesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListEntityRecognizersRequest {
    /**
     * Filters the list of entities returned. You can filter on Status, SubmitTimeBefore, or SubmitTimeAfter. You can only set one filter at a time.
     */
    Filter?: EntityRecognizerFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     *  The maximum number of results to return on each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListEntityRecognizersResponse {
    /**
     * The list of properties of an entity recognizer.
     */
    EntityRecognizerPropertiesList?: EntityRecognizerPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListEventsDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: EventsDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListEventsDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    EventsDetectionJobPropertiesList?: EventsDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListFlywheelIterationHistoryRequest {
    /**
     * The ARN of the flywheel.
     */
    FlywheelArn: ComprehendFlywheelArn;
    /**
     * Filter the flywheel iteration history based on creation time.
     */
    Filter?: FlywheelIterationFilter;
    /**
     * Next token
     */
    NextToken?: String;
    /**
     * Maximum number of iteration history results to return
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListFlywheelIterationHistoryResponse {
    /**
     * List of flywheel iteration properties
     */
    FlywheelIterationPropertiesList?: FlywheelIterationPropertiesList;
    /**
     * Next token
     */
    NextToken?: String;
  }
  export interface ListFlywheelsRequest {
    /**
     * Filters the flywheels that are returned. You can filter flywheels on their status, or the date and time that they were submitted. You can only set one filter at a time. 
     */
    Filter?: FlywheelFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * Maximum number of results to return in a response. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListFlywheelsResponse {
    /**
     * A list of flywheel properties retrieved by the service in response to the request. 
     */
    FlywheelSummaryList?: FlywheelSummaryList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListKeyPhrasesDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: KeyPhrasesDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListKeyPhrasesDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    KeyPhrasesDetectionJobPropertiesList?: KeyPhrasesDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export type ListOfBlockReferences = BlockReference[];
  export type ListOfBlocks = Block[];
  export type ListOfChildBlocks = ChildBlock[];
  export type ListOfClasses = DocumentClass[];
  export type ListOfDescriptiveMentionIndices = Integer[];
  export type ListOfDetectDominantLanguageResult = BatchDetectDominantLanguageItemResult[];
  export type ListOfDetectEntitiesResult = BatchDetectEntitiesItemResult[];
  export type ListOfDetectKeyPhrasesResult = BatchDetectKeyPhrasesItemResult[];
  export type ListOfDetectSentimentResult = BatchDetectSentimentItemResult[];
  export type ListOfDetectSyntaxResult = BatchDetectSyntaxItemResult[];
  export type ListOfDetectTargetedSentimentResult = BatchDetectTargetedSentimentItemResult[];
  export type ListOfDocumentReadFeatureTypes = DocumentReadFeatureTypes[];
  export type ListOfDocumentType = DocumentTypeListItem[];
  export type ListOfDominantLanguages = DominantLanguage[];
  export type ListOfEntities = Entity[];
  export type ListOfEntityLabels = EntityLabel[];
  export type ListOfErrors = ErrorsListItem[];
  export type ListOfExtractedCharacters = ExtractedCharactersListItem[];
  export type ListOfKeyPhrases = KeyPhrase[];
  export type ListOfLabels = DocumentLabel[];
  export type ListOfMentions = TargetedSentimentMention[];
  export type ListOfPiiEntities = PiiEntity[];
  export type ListOfPiiEntityTypes = PiiEntityType[];
  export type ListOfRelationships = RelationshipsListItem[];
  export type ListOfSyntaxTokens = SyntaxToken[];
  export type ListOfTargetedSentimentEntities = TargetedSentimentEntity[];
  export type ListOfWarnings = WarningsListItem[];
  export interface ListPiiEntitiesDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: PiiEntitiesDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListPiiEntitiesDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    PiiEntitiesDetectionJobPropertiesList?: PiiEntitiesDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListSentimentDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: SentimentDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListSentimentDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    SentimentDetectionJobPropertiesList?: SentimentDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the given Amazon Comprehend resource you are querying. 
     */
    ResourceArn: ComprehendArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The Amazon Resource Name (ARN) of the given Amazon Comprehend resource you are querying.
     */
    ResourceArn?: ComprehendArn;
    /**
     * Tags associated with the Amazon Comprehend resource being queried. A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. 
     */
    Tags?: TagList;
  }
  export interface ListTargetedSentimentDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. You can filter jobs on their name, status, or the date and time that they were submitted. You can only set one filter at a time.
     */
    Filter?: TargetedSentimentDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListTargetedSentimentDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    TargetedSentimentDetectionJobPropertiesList?: TargetedSentimentDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export interface ListTopicsDetectionJobsRequest {
    /**
     * Filters the jobs that are returned. Jobs can be filtered on their name, status, or the date and time that they were submitted. You can set only one filter at a time.
     */
    Filter?: TopicsDetectionJobFilter;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in each page. The default is 100.
     */
    MaxResults?: MaxResultsInteger;
  }
  export interface ListTopicsDetectionJobsResponse {
    /**
     * A list containing the properties of each job that is returned.
     */
    TopicsDetectionJobPropertiesList?: TopicsDetectionJobPropertiesList;
    /**
     * Identifies the next page of results to return.
     */
    NextToken?: String;
  }
  export type MaskCharacter = string;
  export type MaxResultsInteger = number;
  export interface MentionSentiment {
    /**
     * The sentiment of the mention. 
     */
    Sentiment?: SentimentType;
    SentimentScore?: SentimentScore;
  }
  export type ModelStatus = "SUBMITTED"|"TRAINING"|"DELETING"|"STOP_REQUESTED"|"STOPPED"|"IN_ERROR"|"TRAINED"|"TRAINED_WITH_WARNING"|string;
  export type ModelType = "DOCUMENT_CLASSIFIER"|"ENTITY_RECOGNIZER"|string;
  export type NumberOfDocuments = number;
  export type NumberOfTopicsInteger = number;
  export interface OutputDataConfig {
    /**
     * When you use the OutputDataConfig object with asynchronous operations, you specify the Amazon S3 location where you want to write the output data. The URI must be in the same Region as the API endpoint that you are calling. The location is used as the prefix for the actual location of the output file. When the topic detection job is finished, the service creates an output file in a directory specific to the job. The S3Uri field contains the location of the output file, called output.tar.gz. It is a compressed archive that contains the ouput of the operation.  For a PII entity detection job, the output file is plain text, not a compressed archive. The output file name is the same as the input file, with .out appended at the end. 
     */
    S3Uri: S3Uri;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt the output results from an analysis job. The KmsKeyId can be one of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"    KMS Key Alias: "alias/ExampleAlias"    ARN of a KMS Key Alias: "arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias"   
     */
    KmsKeyId?: KmsKeyId;
  }
  export type PageBasedErrorCode = "TEXTRACT_BAD_PAGE"|"TEXTRACT_PROVISIONED_THROUGHPUT_EXCEEDED"|"PAGE_CHARACTERS_EXCEEDED"|"PAGE_SIZE_EXCEEDED"|"INTERNAL_SERVER_ERROR"|string;
  export type PageBasedWarningCode = "INFERENCING_PLAINTEXT_WITH_NATIVE_TRAINED_MODEL"|"INFERENCING_NATIVE_DOCUMENT_WITH_PLAINTEXT_TRAINED_MODEL"|string;
  export interface PartOfSpeechTag {
    /**
     * Identifies the part of speech that the token represents.
     */
    Tag?: PartOfSpeechTagType;
    /**
     * The confidence that Amazon Comprehend has that the part of speech was correctly identified.
     */
    Score?: Float;
  }
  export type PartOfSpeechTagType = "ADJ"|"ADP"|"ADV"|"AUX"|"CONJ"|"CCONJ"|"DET"|"INTJ"|"NOUN"|"NUM"|"O"|"PART"|"PRON"|"PROPN"|"PUNCT"|"SCONJ"|"SYM"|"VERB"|string;
  export interface PiiEntitiesDetectionJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface PiiEntitiesDetectionJobProperties {
    /**
     * The identifier assigned to the PII entities detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the PII entities detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:pii-entities-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:pii-entities-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned the PII entities detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the PII entities detection job. If the status is FAILED, the Message field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the PII entities detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the PII entities detection job completed.
     */
    EndTime?: Timestamp;
    /**
     * The input properties for a PII entities detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the PII entities detection job.
     */
    OutputDataConfig?: PiiOutputDataConfig;
    /**
     * Provides configuration parameters for PII entity redaction. This parameter is required if you set the Mode parameter to ONLY_REDACTION. In that case, you must provide a RedactionConfig definition that includes the PiiEntityTypes parameter.
     */
    RedactionConfig?: RedactionConfig;
    /**
     * The language code of the input documents
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * Specifies whether the output provides the locations (offsets) of PII entities or a file in which PII entities are redacted.
     */
    Mode?: PiiEntitiesDetectionMode;
  }
  export type PiiEntitiesDetectionJobPropertiesList = PiiEntitiesDetectionJobProperties[];
  export type PiiEntitiesDetectionMaskMode = "MASK"|"REPLACE_WITH_PII_ENTITY_TYPE"|string;
  export type PiiEntitiesDetectionMode = "ONLY_REDACTION"|"ONLY_OFFSETS"|string;
  export interface PiiEntity {
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of the detection.
     */
    Score?: Float;
    /**
     * The entity's type.
     */
    Type?: PiiEntityType;
    /**
     * The zero-based offset from the beginning of the source text to the first character in the entity.
     */
    BeginOffset?: Integer;
    /**
     * The zero-based offset from the beginning of the source text to the last character in the entity.
     */
    EndOffset?: Integer;
  }
  export type PiiEntityType = "BANK_ACCOUNT_NUMBER"|"BANK_ROUTING"|"CREDIT_DEBIT_NUMBER"|"CREDIT_DEBIT_CVV"|"CREDIT_DEBIT_EXPIRY"|"PIN"|"EMAIL"|"ADDRESS"|"NAME"|"PHONE"|"SSN"|"DATE_TIME"|"PASSPORT_NUMBER"|"DRIVER_ID"|"URL"|"AGE"|"USERNAME"|"PASSWORD"|"AWS_ACCESS_KEY"|"AWS_SECRET_KEY"|"IP_ADDRESS"|"MAC_ADDRESS"|"ALL"|"LICENSE_PLATE"|"VEHICLE_IDENTIFICATION_NUMBER"|"UK_NATIONAL_INSURANCE_NUMBER"|"CA_SOCIAL_INSURANCE_NUMBER"|"US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER"|"UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER"|"IN_PERMANENT_ACCOUNT_NUMBER"|"IN_NREGA"|"INTERNATIONAL_BANK_ACCOUNT_NUMBER"|"SWIFT_CODE"|"UK_NATIONAL_HEALTH_SERVICE_NUMBER"|"CA_HEALTH_NUMBER"|"IN_AADHAAR"|"IN_VOTER_NUMBER"|string;
  export interface PiiOutputDataConfig {
    /**
     * When you use the PiiOutputDataConfig object with asynchronous operations, you specify the Amazon S3 location where you want to write the output data.   For a PII entity detection job, the output file is plain text, not a compressed archive. The output file name is the same as the input file, with .out appended at the end. 
     */
    S3Uri: S3Uri;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt the output results from an analysis job.
     */
    KmsKeyId?: KmsKeyId;
  }
  export interface Point {
    /**
     * The value of the X coordinate for a point on a polygon
     */
    X?: Float;
    /**
     * The value of the Y coordinate for a point on a polygon
     */
    Y?: Float;
  }
  export type Policy = string;
  export type PolicyRevisionId = string;
  export type Polygon = Point[];
  export interface PutResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom model to attach the policy to.
     */
    ResourceArn: ComprehendModelArn;
    /**
     * The JSON resource-based policy to attach to your custom model. Provide your JSON as a UTF-8 encoded string without line breaks. To provide valid JSON for your policy, enclose the attribute names and values in double quotes. If the JSON body is also enclosed in double quotes, then you must escape the double quotes that are inside the policy:  "{\"attribute\": \"value\", \"attribute\": [\"value\"]}"  To avoid escaping quotes, you can use single quotes to enclose the policy and double quotes to enclose the JSON names and values:  '{"attribute": "value", "attribute": ["value"]}' 
     */
    ResourcePolicy: Policy;
    /**
     * The revision ID that Amazon Comprehend assigned to the policy that you are updating. If you are creating a new policy that has no prior version, don't use this parameter. Amazon Comprehend creates the revision ID for you.
     */
    PolicyRevisionId?: PolicyRevisionId;
  }
  export interface PutResourcePolicyResponse {
    /**
     * The revision ID of the policy. Each time you modify a policy, Amazon Comprehend assigns a new revision ID, and it deletes the prior version of the policy.
     */
    PolicyRevisionId?: PolicyRevisionId;
  }
  export interface RedactionConfig {
    /**
     * An array of the types of PII entities that Amazon Comprehend detects in the input text for your request.
     */
    PiiEntityTypes?: ListOfPiiEntityTypes;
    /**
     * Specifies whether the PII entity is redacted with the mask character or the entity type.
     */
    MaskMode?: PiiEntitiesDetectionMaskMode;
    /**
     * A character that replaces each character in the redacted PII entity.
     */
    MaskCharacter?: MaskCharacter;
  }
  export type RelationshipType = "CHILD"|string;
  export interface RelationshipsListItem {
    /**
     * Identifers of the child blocks.
     */
    Ids?: StringList;
    /**
     * Only supported relationship is a child relationship.
     */
    Type?: RelationshipType;
  }
  export type S3Uri = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SemiStructuredDocumentBlob = Buffer|Uint8Array|Blob|string;
  export interface SentimentDetectionJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface SentimentDetectionJobProperties {
    /**
     * The identifier assigned to the sentiment detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the sentiment detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:sentiment-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:sentiment-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned to the sentiment detection job
     */
    JobName?: JobName;
    /**
     * The current status of the sentiment detection job. If the status is FAILED, the Messages field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the sentiment detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the sentiment detection job ended.
     */
    EndTime?: Timestamp;
    /**
     * The input data configuration that you supplied when you created the sentiment detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration that you supplied when you created the sentiment detection job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The language code of the input documents.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your sentiment detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
  }
  export type SentimentDetectionJobPropertiesList = SentimentDetectionJobProperties[];
  export interface SentimentScore {
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the POSITIVE sentiment.
     */
    Positive?: Float;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the NEGATIVE sentiment.
     */
    Negative?: Float;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the NEUTRAL sentiment.
     */
    Neutral?: Float;
    /**
     * The level of confidence that Amazon Comprehend has in the accuracy of its detection of the MIXED sentiment.
     */
    Mixed?: Float;
  }
  export type SentimentType = "POSITIVE"|"NEGATIVE"|"NEUTRAL"|"MIXED"|string;
  export type Split = "TRAIN"|"TEST"|string;
  export interface StartDocumentClassificationJobRequest {
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The Amazon Resource Name (ARN) of the document classifier to use to process the job.
     */
    DocumentClassifierArn?: DocumentClassifierArn;
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your document classification job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the document classification job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Number (ARN) of the flywheel associated with the model to use.
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export interface StartDocumentClassificationJobResponse {
    /**
     * The identifier generated for the job. To get the status of the job, use this identifier with the DescribeDocumentClassificationJob operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the document classification job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:document-classification-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:document-classification-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job:   SUBMITTED - The job has been received and queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. For details, use the DescribeDocumentClassificationJob operation.   STOP_REQUESTED - Amazon Comprehend has received a stop request for the job and is processing the request.   STOPPED - The job was successfully stopped without completing.  
     */
    JobStatus?: JobStatus;
    /**
     * The ARN of the custom classification model.
     */
    DocumentClassifierArn?: DocumentClassifierArn;
  }
  export interface StartDominantLanguageDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data. For more information, see Role-based permissions.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * An identifier for the job.
     */
    JobName?: JobName;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your dominant language detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the dominant language detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartDominantLanguageDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the dominant language detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:dominant-language-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:dominant-language-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job.    SUBMITTED - The job has been received and is queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. To get details, use the operation.  
     */
    JobStatus?: JobStatus;
  }
  export interface StartEntitiesDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data. For more information, see Role-based permissions.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The Amazon Resource Name (ARN) that identifies the specific entity recognizer to be used by the StartEntitiesDetectionJob. This ARN is optional and is only used for a custom entity recognition job.
     */
    EntityRecognizerArn?: EntityRecognizerArn;
    /**
     * The language of the input documents. All documents must be in the same language. You can specify any of the languages supported by Amazon Comprehend. If custom entities recognition is used, this parameter is ignored and the language used for training the model is used instead.
     */
    LanguageCode: LanguageCode;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your entity detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the entities detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Number (ARN) of the flywheel associated with the model to use.
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export interface StartEntitiesDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of job, use this identifier with the operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the entities detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:entities-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:entities-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job.    SUBMITTED - The job has been received and is queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. To get details, use the operation.   STOP_REQUESTED - Amazon Comprehend has received a stop request for the job and is processing the request.   STOPPED - The job was successfully stopped without completing.  
     */
    JobStatus?: JobStatus;
    /**
     * The ARN of the custom entity recognition model.
     */
    EntityRecognizerArn?: EntityRecognizerArn;
  }
  export interface StartEventsDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the events detection job.
     */
    JobName?: JobName;
    /**
     * The language code of the input documents.
     */
    LanguageCode: LanguageCode;
    /**
     * An unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * The types of events to detect in the input documents.
     */
    TargetEventTypes: TargetEventTypes;
    /**
     * Tags to associate with the events detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartEventsDetectionJobResponse {
    /**
     * An unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the events detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:events-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:events-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the events detection job.
     */
    JobStatus?: JobStatus;
  }
  export interface StartFlywheelIterationRequest {
    /**
     * The ARN of the flywheel.
     */
    FlywheelArn: ComprehendFlywheelArn;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
  }
  export interface StartFlywheelIterationResponse {
    /**
     * 
     */
    FlywheelArn?: ComprehendFlywheelArn;
    /**
     * 
     */
    FlywheelIterationId?: FlywheelIterationId;
  }
  export interface StartKeyPhrasesDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data. For more information, see Role-based permissions.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     *  Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your key phrases detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the key phrases detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartKeyPhrasesDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the key phrase detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:key-phrases-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:key-phrases-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job.    SUBMITTED - The job has been received and is queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. To get details, use the operation.  
     */
    JobStatus?: JobStatus;
  }
  export interface StartPiiEntitiesDetectionJobRequest {
    /**
     * The input properties for a PII entities detection job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Provides conﬁguration parameters for the output of PII entity detection jobs.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * Specifies whether the output provides the locations (offsets) of PII entities or a file in which PII entities are redacted.
     */
    Mode: PiiEntitiesDetectionMode;
    /**
     * Provides configuration parameters for PII entity redaction. This parameter is required if you set the Mode parameter to ONLY_REDACTION. In that case, you must provide a RedactionConfig definition that includes the PiiEntityTypes parameter.
     */
    RedactionConfig?: RedactionConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The language of the input documents. Currently, English is the only valid language.
     */
    LanguageCode: LanguageCode;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * Tags to associate with the PII entities detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartPiiEntitiesDetectionJobResponse {
    /**
     * The identifier generated for the job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the PII entity detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:pii-entities-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:pii-entities-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job.
     */
    JobStatus?: JobStatus;
  }
  export interface StartSentimentDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files. 
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data. For more information, see Role-based permissions.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The language of the input documents. You can specify any of the primary languages supported by Amazon Comprehend. All documents must be in the same language.
     */
    LanguageCode: LanguageCode;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your sentiment detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the sentiment detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartSentimentDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the sentiment detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:sentiment-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:sentiment-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job.    SUBMITTED - The job has been received and is queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. To get details, use the operation.  
     */
    JobStatus?: JobStatus;
  }
  export interface StartTargetedSentimentDetectionJobRequest {
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files. 
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data. For more information, see Role-based permissions.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The language of the input documents. Currently, English is the only supported language.
     */
    LanguageCode: LanguageCode;
    /**
     * A unique identifier for the request. If you don't set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the targeted sentiment detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartTargetedSentimentDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of a job, use this identifier with the DescribeTargetedSentimentDetectionJob operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the targeted sentiment detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:targeted-sentiment-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:targeted-sentiment-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job.    SUBMITTED - The job has been received and is queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. To get details, use the DescribeTargetedSentimentDetectionJob operation.  
     */
    JobStatus?: JobStatus;
  }
  export interface StartTopicsDetectionJobRequest {
    /**
     * Specifies the format and location of the input data for the job.
     */
    InputDataConfig: InputDataConfig;
    /**
     * Specifies where to send the output files. The output is a compressed archive with two files, topic-terms.csv that lists the terms associated with each topic, and doc-topics.csv that lists the documents associated with each topic
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data. For more information, see Role-based permissions.
     */
    DataAccessRoleArn: IamRoleArn;
    /**
     * The identifier of the job.
     */
    JobName?: JobName;
    /**
     * The number of topics to detect.
     */
    NumberOfTopics?: NumberOfTopicsInteger;
    /**
     * A unique identifier for the request. If you do not set the client request token, Amazon Comprehend generates one.
     */
    ClientRequestToken?: ClientRequestTokenString;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for your topic detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
    /**
     * Tags to associate with the topics detection job. A tag is a key-value pair that adds metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
     */
    Tags?: TagList;
  }
  export interface StartTopicsDetectionJobResponse {
    /**
     * The identifier generated for the job. To get the status of the job, use this identifier with the DescribeTopicDetectionJob operation.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the topics detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:topics-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:document-classification-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The status of the job:    SUBMITTED - The job has been received and is queued for processing.   IN_PROGRESS - Amazon Comprehend is processing the job.   COMPLETED - The job was successfully completed and the output is available.   FAILED - The job did not complete. To get details, use the DescribeTopicDetectionJob operation.  
     */
    JobStatus?: JobStatus;
  }
  export interface StopDominantLanguageDetectionJobRequest {
    /**
     * The identifier of the dominant language detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopDominantLanguageDetectionJobResponse {
    /**
     * The identifier of the dominant language detection job to stop.
     */
    JobId?: JobId;
    /**
     * Either STOP_REQUESTED if the job is currently running, or STOPPED if the job was previously stopped with the StopDominantLanguageDetectionJob operation.
     */
    JobStatus?: JobStatus;
  }
  export interface StopEntitiesDetectionJobRequest {
    /**
     * The identifier of the entities detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopEntitiesDetectionJobResponse {
    /**
     * The identifier of the entities detection job to stop.
     */
    JobId?: JobId;
    /**
     * Either STOP_REQUESTED if the job is currently running, or STOPPED if the job was previously stopped with the StopEntitiesDetectionJob operation.
     */
    JobStatus?: JobStatus;
  }
  export interface StopEventsDetectionJobRequest {
    /**
     * The identifier of the events detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopEventsDetectionJobResponse {
    /**
     * The identifier of the events detection job to stop.
     */
    JobId?: JobId;
    /**
     * The status of the events detection job.
     */
    JobStatus?: JobStatus;
  }
  export interface StopKeyPhrasesDetectionJobRequest {
    /**
     * The identifier of the key phrases detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopKeyPhrasesDetectionJobResponse {
    /**
     * The identifier of the key phrases detection job to stop.
     */
    JobId?: JobId;
    /**
     * Either STOP_REQUESTED if the job is currently running, or STOPPED if the job was previously stopped with the StopKeyPhrasesDetectionJob operation.
     */
    JobStatus?: JobStatus;
  }
  export interface StopPiiEntitiesDetectionJobRequest {
    /**
     * The identifier of the PII entities detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopPiiEntitiesDetectionJobResponse {
    /**
     * The identifier of the PII entities detection job to stop.
     */
    JobId?: JobId;
    /**
     * The status of the PII entities detection job.
     */
    JobStatus?: JobStatus;
  }
  export interface StopSentimentDetectionJobRequest {
    /**
     * The identifier of the sentiment detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopSentimentDetectionJobResponse {
    /**
     * The identifier of the sentiment detection job to stop.
     */
    JobId?: JobId;
    /**
     * Either STOP_REQUESTED if the job is currently running, or STOPPED if the job was previously stopped with the StopSentimentDetectionJob operation.
     */
    JobStatus?: JobStatus;
  }
  export interface StopTargetedSentimentDetectionJobRequest {
    /**
     * The identifier of the targeted sentiment detection job to stop.
     */
    JobId: JobId;
  }
  export interface StopTargetedSentimentDetectionJobResponse {
    /**
     * The identifier of the targeted sentiment detection job to stop.
     */
    JobId?: JobId;
    /**
     * Either STOP_REQUESTED if the job is currently running, or STOPPED if the job was previously stopped with the StopSentimentDetectionJob operation.
     */
    JobStatus?: JobStatus;
  }
  export interface StopTrainingDocumentClassifierRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the document classifier currently being trained.
     */
    DocumentClassifierArn: DocumentClassifierArn;
  }
  export interface StopTrainingDocumentClassifierResponse {
  }
  export interface StopTrainingEntityRecognizerRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the entity recognizer currently being trained.
     */
    EntityRecognizerArn: EntityRecognizerArn;
  }
  export interface StopTrainingEntityRecognizerResponse {
  }
  export type String = string;
  export type StringList = String[];
  export type SubnetId = string;
  export type Subnets = SubnetId[];
  export type SyntaxLanguageCode = "en"|"es"|"fr"|"de"|"it"|"pt"|string;
  export interface SyntaxToken {
    /**
     * A unique identifier for a token.
     */
    TokenId?: Integer;
    /**
     * The word that was recognized in the source text.
     */
    Text?: String;
    /**
     * The zero-based offset from the beginning of the source text to the first character in the word.
     */
    BeginOffset?: Integer;
    /**
     * The zero-based offset from the beginning of the source text to the last character in the word.
     */
    EndOffset?: Integer;
    /**
     * Provides the part of speech label and the confidence level that Amazon Comprehend has that the part of speech was correctly identified. For more information, see Syntax in the Comprehend Developer Guide. 
     */
    PartOfSpeech?: PartOfSpeechTag;
  }
  export interface Tag {
    /**
     * The initial part of a key-value pair that forms a tag associated with a given resource. For instance, if you want to show which resources are used by which departments, you might use “Department” as the key portion of the pair, with multiple possible values such as “sales,” “legal,” and “administration.” 
     */
    Key: TagKey;
    /**
     *  The second part of a key-value pair that forms a tag associated with a given resource. For instance, if you want to show which resources are used by which departments, you might use “Department” as the initial (key) portion of the pair, with a value of “sales” to indicate the sales department. 
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the given Amazon Comprehend resource to which you want to associate the tags. 
     */
    ResourceArn: ComprehendArn;
    /**
     * Tags being associated with a specific Amazon Comprehend resource. There can be a maximum of 50 tags (both existing and pending) associated with a specific resource. 
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetEventTypes = EventTypeString[];
  export interface TargetedSentimentDetectionJobFilter {
    /**
     * Filters on the name of the job.
     */
    JobName?: JobName;
    /**
     * Filters the list of jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted before the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Returns only jobs submitted after the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface TargetedSentimentDetectionJobProperties {
    /**
     * The identifier assigned to the targeted sentiment detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the targeted sentiment detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:targeted-sentiment-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:targeted-sentiment-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name that you assigned to the targeted sentiment detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the targeted sentiment detection job. If the status is FAILED, the Messages field shows the reason for the failure.
     */
    JobStatus?: JobStatus;
    /**
     * A description of the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the targeted sentiment detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the targeted sentiment detection job ended.
     */
    EndTime?: Timestamp;
    InputDataConfig?: InputDataConfig;
    OutputDataConfig?: OutputDataConfig;
    /**
     * The language code of the input documents.
     */
    LanguageCode?: LanguageCode;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt the data on the storage volume attached to the ML compute instance(s) that process the targeted sentiment detection job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    VpcConfig?: VpcConfig;
  }
  export type TargetedSentimentDetectionJobPropertiesList = TargetedSentimentDetectionJobProperties[];
  export interface TargetedSentimentEntity {
    /**
     * One or more index into the Mentions array that provides the best name for the entity group.
     */
    DescriptiveMentionIndex?: ListOfDescriptiveMentionIndices;
    /**
     * An array of mentions of the entity in the document. The array represents a co-reference group. See  Co-reference group for an example. 
     */
    Mentions?: ListOfMentions;
  }
  export type TargetedSentimentEntityType = "PERSON"|"LOCATION"|"ORGANIZATION"|"FACILITY"|"BRAND"|"COMMERCIAL_ITEM"|"MOVIE"|"MUSIC"|"BOOK"|"SOFTWARE"|"GAME"|"PERSONAL_TITLE"|"EVENT"|"DATE"|"QUANTITY"|"ATTRIBUTE"|"OTHER"|string;
  export interface TargetedSentimentMention {
    /**
     * Model confidence that the entity is relevant. Value range is zero to one, where one is highest confidence.
     */
    Score?: Float;
    /**
     * The confidence that all the entities mentioned in the group relate to the same entity.
     */
    GroupScore?: Float;
    /**
     * The text in the document that identifies the entity.
     */
    Text?: String;
    /**
     * The type of the entity. Amazon Comprehend supports a variety of entity types.
     */
    Type?: TargetedSentimentEntityType;
    /**
     * Contains the sentiment and sentiment score for the mention.
     */
    MentionSentiment?: MentionSentiment;
    /**
     * The offset into the document text where the mention begins.
     */
    BeginOffset?: Integer;
    /**
     * The offset into the document text where the mention ends.
     */
    EndOffset?: Integer;
  }
  export interface TaskConfig {
    /**
     * Language code for the language that the model supports.
     */
    LanguageCode: LanguageCode;
    /**
     * Configuration required for a classification model.
     */
    DocumentClassificationConfig?: DocumentClassificationConfig;
    /**
     * Configuration required for an entity recognition model.
     */
    EntityRecognitionConfig?: EntityRecognitionConfig;
  }
  export type Timestamp = Date;
  export interface TopicsDetectionJobFilter {
    /**
     * 
     */
    JobName?: JobName;
    /**
     * Filters the list of topic detection jobs based on job status. Returns only jobs with the specified status.
     */
    JobStatus?: JobStatus;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Only returns jobs submitted before the specified time. Jobs are returned in descending order, newest to oldest.
     */
    SubmitTimeBefore?: Timestamp;
    /**
     * Filters the list of jobs based on the time that the job was submitted for processing. Only returns jobs submitted after the specified time. Jobs are returned in ascending order, oldest to newest.
     */
    SubmitTimeAfter?: Timestamp;
  }
  export interface TopicsDetectionJobProperties {
    /**
     * The identifier assigned to the topic detection job.
     */
    JobId?: JobId;
    /**
     * The Amazon Resource Name (ARN) of the topics detection job. It is a unique, fully qualified identifier for the job. It includes the Amazon Web Services account, Amazon Web Services Region, and the job ID. The format of the ARN is as follows:  arn:&lt;partition&gt;:comprehend:&lt;region&gt;:&lt;account-id&gt;:topics-detection-job/&lt;job-id&gt;  The following is an example job ARN:  arn:aws:comprehend:us-west-2:111122223333:topics-detection-job/1234abcd12ab34cd56ef1234567890ab 
     */
    JobArn?: ComprehendArn;
    /**
     * The name of the topic detection job.
     */
    JobName?: JobName;
    /**
     * The current status of the topic detection job. If the status is Failed, the reason for the failure is shown in the Message field.
     */
    JobStatus?: JobStatus;
    /**
     * A description for the status of a job.
     */
    Message?: AnyLengthString;
    /**
     * The time that the topic detection job was submitted for processing.
     */
    SubmitTime?: Timestamp;
    /**
     * The time that the topic detection job was completed.
     */
    EndTime?: Timestamp;
    /**
     * The input data configuration supplied when you created the topic detection job.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The output data configuration supplied when you created the topic detection job.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * The number of topics to detect supplied when you created the topic detection job. The default is 10. 
     */
    NumberOfTopics?: Integer;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your job data. 
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * ID for the Amazon Web Services Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job. The VolumeKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your topic detection job. For more information, see Amazon VPC. 
     */
    VpcConfig?: VpcConfig;
  }
  export type TopicsDetectionJobPropertiesList = TopicsDetectionJobProperties[];
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the given Amazon Comprehend resource from which you want to remove the tags. 
     */
    ResourceArn: ComprehendArn;
    /**
     * The initial part of a key-value pair that forms a tag being removed from a given resource. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department. Keys must be unique and cannot be duplicated for a particular resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDataSecurityConfig {
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt trained custom models. The ModelKmsKeyId can be either of the following formats:   KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    ModelKmsKeyId?: KmsKeyId;
    /**
     * ID for the KMS key that Amazon Comprehend uses to encrypt the volume.
     */
    VolumeKmsKeyId?: KmsKeyId;
    VpcConfig?: VpcConfig;
  }
  export interface UpdateEndpointRequest {
    /**
     * The Amazon Resource Number (ARN) of the endpoint being updated.
     */
    EndpointArn: ComprehendEndpointArn;
    /**
     * The ARN of the new model to use when updating an existing endpoint.
     */
    DesiredModelArn?: ComprehendModelArn;
    /**
     *  The desired number of inference units to be used by the model using this endpoint. Each inference unit represents of a throughput of 100 characters per second.
     */
    DesiredInferenceUnits?: InferenceUnitsInteger;
    /**
     * Data access role ARN to use in case the new model is encrypted with a customer CMK.
     */
    DesiredDataAccessRoleArn?: IamRoleArn;
    /**
     * The Amazon Resource Number (ARN) of the flywheel
     */
    FlywheelArn?: ComprehendFlywheelArn;
  }
  export interface UpdateEndpointResponse {
    /**
     * The Amazon Resource Number (ARN) of the new model.
     */
    DesiredModelArn?: ComprehendModelArn;
  }
  export interface UpdateFlywheelRequest {
    /**
     * The Amazon Resource Number (ARN) of the flywheel to update.
     */
    FlywheelArn: ComprehendFlywheelArn;
    /**
     * The Amazon Resource Number (ARN) of the active model version.
     */
    ActiveModelArn?: ComprehendModelArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend permission to access the flywheel data.
     */
    DataAccessRoleArn?: IamRoleArn;
    /**
     * Flywheel data security configuration.
     */
    DataSecurityConfig?: UpdateDataSecurityConfig;
  }
  export interface UpdateFlywheelResponse {
    /**
     * The flywheel properties.
     */
    FlywheelProperties?: FlywheelProperties;
  }
  export type VersionName = string;
  export interface VpcConfig {
    /**
     * The ID number for a security group on an instance of your private VPC. Security groups on your VPC function serve as a virtual firewall to control inbound and outbound traffic and provides security for the resources that you’ll be accessing on the VPC. This ID number is preceded by "sg-", for instance: "sg-03b388029b0a285ea". For more information, see Security Groups for your VPC. 
     */
    SecurityGroupIds: SecurityGroupIds;
    /**
     * The ID for each subnet being used in your private VPC. This subnet is a subset of the a range of IPv4 addresses used by the VPC and is specific to a given availability zone in the VPC’s Region. This ID number is preceded by "subnet-", for instance: "subnet-04ccf456919e69055". For more information, see VPCs and Subnets. 
     */
    Subnets: Subnets;
  }
  export interface WarningsListItem {
    /**
     * Page number in the input document.
     */
    Page?: Integer;
    /**
     * The type of warning.
     */
    WarnCode?: PageBasedWarningCode;
    /**
     * Text message associated with the warning.
     */
    WarnMessage?: String;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-11-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Comprehend client.
   */
  export import Types = Comprehend;
}
export = Comprehend;
