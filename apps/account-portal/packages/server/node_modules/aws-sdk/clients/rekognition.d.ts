import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Rekognition extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Rekognition.Types.ClientConfiguration)
  config: Config & Rekognition.Types.ClientConfiguration;
  /**
   * Associates one or more faces with an existing UserID. Takes an array of FaceIds. Each FaceId that are present in the FaceIds list is associated with the provided UserID. The maximum number of total FaceIds per UserID is 100.  The UserMatchThreshold parameter specifies the minimum user match confidence required for the face to be associated with a UserID that has at least one FaceID already associated. This ensures that the FaceIds are associated with the right UserID. The value ranges from 0-100 and default value is 75.  If successful, an array of AssociatedFace objects containing the associated FaceIds is returned. If a given face is already associated with the given UserID, it will be ignored and will not be returned in the response. If a given face is already associated to a different UserID, isn't found in the collection, doesn’t meet the UserMatchThreshold, or there are already 100 faces associated with the UserID, it will be returned as part of an array of UnsuccessfulFaceAssociations.  The UserStatus reflects the status of an operation which updates a UserID representation with a list of given faces. The UserStatus can be:    ACTIVE - All associations or disassociations of FaceID(s) for a UserID are complete.   CREATED - A UserID has been created, but has no FaceID(s) associated with it.   UPDATING - A UserID is being updated and there are current associations or disassociations of FaceID(s) taking place.  
   */
  associateFaces(params: Rekognition.Types.AssociateFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.AssociateFacesResponse) => void): Request<Rekognition.Types.AssociateFacesResponse, AWSError>;
  /**
   * Associates one or more faces with an existing UserID. Takes an array of FaceIds. Each FaceId that are present in the FaceIds list is associated with the provided UserID. The maximum number of total FaceIds per UserID is 100.  The UserMatchThreshold parameter specifies the minimum user match confidence required for the face to be associated with a UserID that has at least one FaceID already associated. This ensures that the FaceIds are associated with the right UserID. The value ranges from 0-100 and default value is 75.  If successful, an array of AssociatedFace objects containing the associated FaceIds is returned. If a given face is already associated with the given UserID, it will be ignored and will not be returned in the response. If a given face is already associated to a different UserID, isn't found in the collection, doesn’t meet the UserMatchThreshold, or there are already 100 faces associated with the UserID, it will be returned as part of an array of UnsuccessfulFaceAssociations.  The UserStatus reflects the status of an operation which updates a UserID representation with a list of given faces. The UserStatus can be:    ACTIVE - All associations or disassociations of FaceID(s) for a UserID are complete.   CREATED - A UserID has been created, but has no FaceID(s) associated with it.   UPDATING - A UserID is being updated and there are current associations or disassociations of FaceID(s) taking place.  
   */
  associateFaces(callback?: (err: AWSError, data: Rekognition.Types.AssociateFacesResponse) => void): Request<Rekognition.Types.AssociateFacesResponse, AWSError>;
  /**
   * Compares a face in the source input image with each of the 100 largest faces detected in the target input image.   If the source image contains multiple faces, the service detects the largest face and compares it with each face detected in the target image.   CompareFaces uses machine learning algorithms, which are probabilistic. A false negative is an incorrect prediction that a face in the target image has a low similarity confidence score when compared to the face in the source image. To reduce the probability of false negatives, we recommend that you compare the target image against multiple source images. If you plan to use CompareFaces to make a decision that impacts an individual's rights, privacy, or access to services, we recommend that you pass the result to a human for review and further validation before taking action.  You pass the input and target images either as base64-encoded image bytes or as references to images in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes isn't supported. The image must be formatted as a PNG or JPEG file.  In response, the operation returns an array of face matches ordered by similarity score in descending order. For each face match, the response provides a bounding box of the face, facial landmarks, pose details (pitch, roll, and yaw), quality (brightness and sharpness), and confidence value (indicating the level of confidence that the bounding box contains a face). The response also provides a similarity score, which indicates how closely the faces match.   By default, only faces with a similarity score of greater than or equal to 80% are returned in the response. You can change this value by specifying the SimilarityThreshold parameter.   CompareFaces also returns an array of faces that don't match the source image. For each face, it returns a bounding box, confidence value, landmarks, pose details, and quality. The response also returns information about the face in the source image, including the bounding box of the face and confidence value. The QualityFilter input parameter allows you to filter out detected faces that don’t meet a required quality bar. The quality bar is based on a variety of common use cases. Use QualityFilter to set the quality bar by specifying LOW, MEDIUM, or HIGH. If you do not want to filter detected faces, specify NONE. The default value is NONE.  If the image doesn't contain Exif metadata, CompareFaces returns orientation information for the source and target images. Use these values to display the images with the correct image orientation. If no faces are detected in the source or target images, CompareFaces returns an InvalidParameterException error.    This is a stateless API operation. That is, data returned by this operation doesn't persist.  For an example, see Comparing Faces in Images in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:CompareFaces action.
   */
  compareFaces(params: Rekognition.Types.CompareFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.CompareFacesResponse) => void): Request<Rekognition.Types.CompareFacesResponse, AWSError>;
  /**
   * Compares a face in the source input image with each of the 100 largest faces detected in the target input image.   If the source image contains multiple faces, the service detects the largest face and compares it with each face detected in the target image.   CompareFaces uses machine learning algorithms, which are probabilistic. A false negative is an incorrect prediction that a face in the target image has a low similarity confidence score when compared to the face in the source image. To reduce the probability of false negatives, we recommend that you compare the target image against multiple source images. If you plan to use CompareFaces to make a decision that impacts an individual's rights, privacy, or access to services, we recommend that you pass the result to a human for review and further validation before taking action.  You pass the input and target images either as base64-encoded image bytes or as references to images in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes isn't supported. The image must be formatted as a PNG or JPEG file.  In response, the operation returns an array of face matches ordered by similarity score in descending order. For each face match, the response provides a bounding box of the face, facial landmarks, pose details (pitch, roll, and yaw), quality (brightness and sharpness), and confidence value (indicating the level of confidence that the bounding box contains a face). The response also provides a similarity score, which indicates how closely the faces match.   By default, only faces with a similarity score of greater than or equal to 80% are returned in the response. You can change this value by specifying the SimilarityThreshold parameter.   CompareFaces also returns an array of faces that don't match the source image. For each face, it returns a bounding box, confidence value, landmarks, pose details, and quality. The response also returns information about the face in the source image, including the bounding box of the face and confidence value. The QualityFilter input parameter allows you to filter out detected faces that don’t meet a required quality bar. The quality bar is based on a variety of common use cases. Use QualityFilter to set the quality bar by specifying LOW, MEDIUM, or HIGH. If you do not want to filter detected faces, specify NONE. The default value is NONE.  If the image doesn't contain Exif metadata, CompareFaces returns orientation information for the source and target images. Use these values to display the images with the correct image orientation. If no faces are detected in the source or target images, CompareFaces returns an InvalidParameterException error.    This is a stateless API operation. That is, data returned by this operation doesn't persist.  For an example, see Comparing Faces in Images in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:CompareFaces action.
   */
  compareFaces(callback?: (err: AWSError, data: Rekognition.Types.CompareFacesResponse) => void): Request<Rekognition.Types.CompareFacesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Copies a version of an Amazon Rekognition Custom Labels model from a source project to a destination project. The source and destination projects can be in different AWS accounts but must be in the same AWS Region. You can't copy a model to another AWS service.  To copy a model version to a different AWS account, you need to create a resource-based policy known as a project policy. You attach the project policy to the source project by calling PutProjectPolicy. The project policy gives permission to copy the model version from a trusting AWS account to a trusted account. For more information creating and attaching a project policy, see Attaching a project policy (SDK) in the Amazon Rekognition Custom Labels Developer Guide.  If you are copying a model version to a project in the same AWS account, you don't need to create a project policy.  Copying project versions is supported only for Custom Labels models.  To copy a model, the destination project, source project, and source model version must already exist.  Copying a model version takes a while to complete. To get the current status, call DescribeProjectVersions and check the value of Status in the ProjectVersionDescription object. The copy operation has finished when the value of Status is COPYING_COMPLETED. This operation requires permissions to perform the rekognition:CopyProjectVersion action.
   */
  copyProjectVersion(params: Rekognition.Types.CopyProjectVersionRequest, callback?: (err: AWSError, data: Rekognition.Types.CopyProjectVersionResponse) => void): Request<Rekognition.Types.CopyProjectVersionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Copies a version of an Amazon Rekognition Custom Labels model from a source project to a destination project. The source and destination projects can be in different AWS accounts but must be in the same AWS Region. You can't copy a model to another AWS service.  To copy a model version to a different AWS account, you need to create a resource-based policy known as a project policy. You attach the project policy to the source project by calling PutProjectPolicy. The project policy gives permission to copy the model version from a trusting AWS account to a trusted account. For more information creating and attaching a project policy, see Attaching a project policy (SDK) in the Amazon Rekognition Custom Labels Developer Guide.  If you are copying a model version to a project in the same AWS account, you don't need to create a project policy.  Copying project versions is supported only for Custom Labels models.  To copy a model, the destination project, source project, and source model version must already exist.  Copying a model version takes a while to complete. To get the current status, call DescribeProjectVersions and check the value of Status in the ProjectVersionDescription object. The copy operation has finished when the value of Status is COPYING_COMPLETED. This operation requires permissions to perform the rekognition:CopyProjectVersion action.
   */
  copyProjectVersion(callback?: (err: AWSError, data: Rekognition.Types.CopyProjectVersionResponse) => void): Request<Rekognition.Types.CopyProjectVersionResponse, AWSError>;
  /**
   * Creates a collection in an AWS Region. You can add faces to the collection using the IndexFaces operation.  For example, you might create collections, one for each of your application users. A user can then index faces using the IndexFaces operation and persist results in a specific collection. Then, a user can search the collection for faces in the user-specific container.  When you create a collection, it is associated with the latest version of the face model version.  Collection names are case-sensitive.  This operation requires permissions to perform the rekognition:CreateCollection action. If you want to tag your collection, you also require permission to perform the rekognition:TagResource operation.
   */
  createCollection(params: Rekognition.Types.CreateCollectionRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateCollectionResponse) => void): Request<Rekognition.Types.CreateCollectionResponse, AWSError>;
  /**
   * Creates a collection in an AWS Region. You can add faces to the collection using the IndexFaces operation.  For example, you might create collections, one for each of your application users. A user can then index faces using the IndexFaces operation and persist results in a specific collection. Then, a user can search the collection for faces in the user-specific container.  When you create a collection, it is associated with the latest version of the face model version.  Collection names are case-sensitive.  This operation requires permissions to perform the rekognition:CreateCollection action. If you want to tag your collection, you also require permission to perform the rekognition:TagResource operation.
   */
  createCollection(callback?: (err: AWSError, data: Rekognition.Types.CreateCollectionResponse) => void): Request<Rekognition.Types.CreateCollectionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Creates a new Amazon Rekognition Custom Labels dataset. You can create a dataset by using an Amazon Sagemaker format manifest file or by copying an existing Amazon Rekognition Custom Labels dataset. To create a training dataset for a project, specify TRAIN for the value of DatasetType. To create the test dataset for a project, specify TEST for the value of DatasetType.  The response from CreateDataset is the Amazon Resource Name (ARN) for the dataset. Creating a dataset takes a while to complete. Use DescribeDataset to check the current status. The dataset created successfully if the value of Status is CREATE_COMPLETE.  To check if any non-terminal errors occurred, call ListDatasetEntries and check for the presence of errors lists in the JSON Lines. Dataset creation fails if a terminal error occurs (Status = CREATE_FAILED). Currently, you can't access the terminal error information.  For more information, see Creating dataset in the Amazon Rekognition Custom Labels Developer Guide. This operation requires permissions to perform the rekognition:CreateDataset action. If you want to copy an existing dataset, you also require permission to perform the rekognition:ListDatasetEntries action.
   */
  createDataset(params: Rekognition.Types.CreateDatasetRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateDatasetResponse) => void): Request<Rekognition.Types.CreateDatasetResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Creates a new Amazon Rekognition Custom Labels dataset. You can create a dataset by using an Amazon Sagemaker format manifest file or by copying an existing Amazon Rekognition Custom Labels dataset. To create a training dataset for a project, specify TRAIN for the value of DatasetType. To create the test dataset for a project, specify TEST for the value of DatasetType.  The response from CreateDataset is the Amazon Resource Name (ARN) for the dataset. Creating a dataset takes a while to complete. Use DescribeDataset to check the current status. The dataset created successfully if the value of Status is CREATE_COMPLETE.  To check if any non-terminal errors occurred, call ListDatasetEntries and check for the presence of errors lists in the JSON Lines. Dataset creation fails if a terminal error occurs (Status = CREATE_FAILED). Currently, you can't access the terminal error information.  For more information, see Creating dataset in the Amazon Rekognition Custom Labels Developer Guide. This operation requires permissions to perform the rekognition:CreateDataset action. If you want to copy an existing dataset, you also require permission to perform the rekognition:ListDatasetEntries action.
   */
  createDataset(callback?: (err: AWSError, data: Rekognition.Types.CreateDatasetResponse) => void): Request<Rekognition.Types.CreateDatasetResponse, AWSError>;
  /**
   * This API operation initiates a Face Liveness session. It returns a SessionId, which you can use to start streaming Face Liveness video and get the results for a Face Liveness session.  You can use the OutputConfig option in the Settings parameter to provide an Amazon S3 bucket location. The Amazon S3 bucket stores reference images and audit images. If no Amazon S3 bucket is defined, raw bytes are sent instead.  You can use AuditImagesLimit to limit the number of audit images returned when GetFaceLivenessSessionResults is called. This number is between 0 and 4. By default, it is set to 0. The limit is best effort and based on the duration of the selfie-video. 
   */
  createFaceLivenessSession(params: Rekognition.Types.CreateFaceLivenessSessionRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateFaceLivenessSessionResponse) => void): Request<Rekognition.Types.CreateFaceLivenessSessionResponse, AWSError>;
  /**
   * This API operation initiates a Face Liveness session. It returns a SessionId, which you can use to start streaming Face Liveness video and get the results for a Face Liveness session.  You can use the OutputConfig option in the Settings parameter to provide an Amazon S3 bucket location. The Amazon S3 bucket stores reference images and audit images. If no Amazon S3 bucket is defined, raw bytes are sent instead.  You can use AuditImagesLimit to limit the number of audit images returned when GetFaceLivenessSessionResults is called. This number is between 0 and 4. By default, it is set to 0. The limit is best effort and based on the duration of the selfie-video. 
   */
  createFaceLivenessSession(callback?: (err: AWSError, data: Rekognition.Types.CreateFaceLivenessSessionResponse) => void): Request<Rekognition.Types.CreateFaceLivenessSessionResponse, AWSError>;
  /**
   * Creates a new Amazon Rekognition project. A project is a group of resources (datasets, model versions) that you use to create and manage a Amazon Rekognition Custom Labels Model or custom adapter. You can specify a feature to create the project with, if no feature is specified then Custom Labels is used by default. For adapters, you can also choose whether or not to have the project auto update by using the AutoUpdate argument. This operation requires permissions to perform the rekognition:CreateProject action.
   */
  createProject(params: Rekognition.Types.CreateProjectRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateProjectResponse) => void): Request<Rekognition.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates a new Amazon Rekognition project. A project is a group of resources (datasets, model versions) that you use to create and manage a Amazon Rekognition Custom Labels Model or custom adapter. You can specify a feature to create the project with, if no feature is specified then Custom Labels is used by default. For adapters, you can also choose whether or not to have the project auto update by using the AutoUpdate argument. This operation requires permissions to perform the rekognition:CreateProject action.
   */
  createProject(callback?: (err: AWSError, data: Rekognition.Types.CreateProjectResponse) => void): Request<Rekognition.Types.CreateProjectResponse, AWSError>;
  /**
   * Creates a new version of Amazon Rekognition project (like a Custom Labels model or a custom adapter) and begins training. Models and adapters are managed as part of a Rekognition project. The response from CreateProjectVersion is an Amazon Resource Name (ARN) for the project version.  The FeatureConfig operation argument allows you to configure specific model or adapter settings. You can provide a description to the project version by using the VersionDescription argment. Training can take a while to complete. You can get the current status by calling DescribeProjectVersions. Training completed successfully if the value of the Status field is TRAINING_COMPLETED. Once training has successfully completed, call DescribeProjectVersions to get the training results and evaluate the model. This operation requires permissions to perform the rekognition:CreateProjectVersion action.   The following applies only to projects with Amazon Rekognition Custom Labels as the chosen feature:  You can train a model in a project that doesn't have associated datasets by specifying manifest files in the TrainingData and TestingData fields.  If you open the console after training a model with manifest files, Amazon Rekognition Custom Labels creates the datasets for you using the most recent manifest files. You can no longer train a model version for the project by specifying manifest files.  Instead of training with a project without associated datasets, we recommend that you use the manifest files to create training and test datasets for the project.  
   */
  createProjectVersion(params: Rekognition.Types.CreateProjectVersionRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateProjectVersionResponse) => void): Request<Rekognition.Types.CreateProjectVersionResponse, AWSError>;
  /**
   * Creates a new version of Amazon Rekognition project (like a Custom Labels model or a custom adapter) and begins training. Models and adapters are managed as part of a Rekognition project. The response from CreateProjectVersion is an Amazon Resource Name (ARN) for the project version.  The FeatureConfig operation argument allows you to configure specific model or adapter settings. You can provide a description to the project version by using the VersionDescription argment. Training can take a while to complete. You can get the current status by calling DescribeProjectVersions. Training completed successfully if the value of the Status field is TRAINING_COMPLETED. Once training has successfully completed, call DescribeProjectVersions to get the training results and evaluate the model. This operation requires permissions to perform the rekognition:CreateProjectVersion action.   The following applies only to projects with Amazon Rekognition Custom Labels as the chosen feature:  You can train a model in a project that doesn't have associated datasets by specifying manifest files in the TrainingData and TestingData fields.  If you open the console after training a model with manifest files, Amazon Rekognition Custom Labels creates the datasets for you using the most recent manifest files. You can no longer train a model version for the project by specifying manifest files.  Instead of training with a project without associated datasets, we recommend that you use the manifest files to create training and test datasets for the project.  
   */
  createProjectVersion(callback?: (err: AWSError, data: Rekognition.Types.CreateProjectVersionResponse) => void): Request<Rekognition.Types.CreateProjectVersionResponse, AWSError>;
  /**
   * Creates an Amazon Rekognition stream processor that you can use to detect and recognize faces or to detect labels in a streaming video. Amazon Rekognition Video is a consumer of live video from Amazon Kinesis Video Streams. There are two different settings for stream processors in Amazon Rekognition: detecting faces and detecting labels.   If you are creating a stream processor for detecting faces, you provide as input a Kinesis video stream (Input) and a Kinesis data stream (Output) stream for receiving the output. You must use the FaceSearch option in Settings, specifying the collection that contains the faces you want to recognize. After you have finished analyzing a streaming video, use StopStreamProcessor to stop processing.   If you are creating a stream processor to detect labels, you provide as input a Kinesis video stream (Input), Amazon S3 bucket information (Output), and an Amazon SNS topic ARN (NotificationChannel). You can also provide a KMS key ID to encrypt the data sent to your Amazon S3 bucket. You specify what you want to detect by using the ConnectedHome option in settings, and selecting one of the following: PERSON, PET, PACKAGE, ALL You can also specify where in the frame you want Amazon Rekognition to monitor with RegionsOfInterest. When you run the StartStreamProcessor operation on a label detection stream processor, you input start and stop information to determine the length of the processing time.    Use Name to assign an identifier for the stream processor. You use Name to manage the stream processor. For example, you can start processing the source video by calling StartStreamProcessor with the Name field.  This operation requires permissions to perform the rekognition:CreateStreamProcessor action. If you want to tag your stream processor, you also require permission to perform the rekognition:TagResource operation.
   */
  createStreamProcessor(params: Rekognition.Types.CreateStreamProcessorRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateStreamProcessorResponse) => void): Request<Rekognition.Types.CreateStreamProcessorResponse, AWSError>;
  /**
   * Creates an Amazon Rekognition stream processor that you can use to detect and recognize faces or to detect labels in a streaming video. Amazon Rekognition Video is a consumer of live video from Amazon Kinesis Video Streams. There are two different settings for stream processors in Amazon Rekognition: detecting faces and detecting labels.   If you are creating a stream processor for detecting faces, you provide as input a Kinesis video stream (Input) and a Kinesis data stream (Output) stream for receiving the output. You must use the FaceSearch option in Settings, specifying the collection that contains the faces you want to recognize. After you have finished analyzing a streaming video, use StopStreamProcessor to stop processing.   If you are creating a stream processor to detect labels, you provide as input a Kinesis video stream (Input), Amazon S3 bucket information (Output), and an Amazon SNS topic ARN (NotificationChannel). You can also provide a KMS key ID to encrypt the data sent to your Amazon S3 bucket. You specify what you want to detect by using the ConnectedHome option in settings, and selecting one of the following: PERSON, PET, PACKAGE, ALL You can also specify where in the frame you want Amazon Rekognition to monitor with RegionsOfInterest. When you run the StartStreamProcessor operation on a label detection stream processor, you input start and stop information to determine the length of the processing time.    Use Name to assign an identifier for the stream processor. You use Name to manage the stream processor. For example, you can start processing the source video by calling StartStreamProcessor with the Name field.  This operation requires permissions to perform the rekognition:CreateStreamProcessor action. If you want to tag your stream processor, you also require permission to perform the rekognition:TagResource operation.
   */
  createStreamProcessor(callback?: (err: AWSError, data: Rekognition.Types.CreateStreamProcessorResponse) => void): Request<Rekognition.Types.CreateStreamProcessorResponse, AWSError>;
  /**
   * Creates a new User within a collection specified by CollectionId. Takes UserId as a parameter, which is a user provided ID which should be unique within the collection. The provided UserId will alias the system generated UUID to make the UserId more user friendly.  Uses a ClientToken, an idempotency token that ensures a call to CreateUser completes only once. If the value is not supplied, the AWS SDK generates an idempotency token for the requests. This prevents retries after a network error results from making multiple CreateUser calls. 
   */
  createUser(params: Rekognition.Types.CreateUserRequest, callback?: (err: AWSError, data: Rekognition.Types.CreateUserResponse) => void): Request<Rekognition.Types.CreateUserResponse, AWSError>;
  /**
   * Creates a new User within a collection specified by CollectionId. Takes UserId as a parameter, which is a user provided ID which should be unique within the collection. The provided UserId will alias the system generated UUID to make the UserId more user friendly.  Uses a ClientToken, an idempotency token that ensures a call to CreateUser completes only once. If the value is not supplied, the AWS SDK generates an idempotency token for the requests. This prevents retries after a network error results from making multiple CreateUser calls. 
   */
  createUser(callback?: (err: AWSError, data: Rekognition.Types.CreateUserResponse) => void): Request<Rekognition.Types.CreateUserResponse, AWSError>;
  /**
   * Deletes the specified collection. Note that this operation removes all faces in the collection. For an example, see Deleting a collection. This operation requires permissions to perform the rekognition:DeleteCollection action.
   */
  deleteCollection(params: Rekognition.Types.DeleteCollectionRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteCollectionResponse) => void): Request<Rekognition.Types.DeleteCollectionResponse, AWSError>;
  /**
   * Deletes the specified collection. Note that this operation removes all faces in the collection. For an example, see Deleting a collection. This operation requires permissions to perform the rekognition:DeleteCollection action.
   */
  deleteCollection(callback?: (err: AWSError, data: Rekognition.Types.DeleteCollectionResponse) => void): Request<Rekognition.Types.DeleteCollectionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Deletes an existing Amazon Rekognition Custom Labels dataset. Deleting a dataset might take while. Use DescribeDataset to check the current status. The dataset is still deleting if the value of Status is DELETE_IN_PROGRESS. If you try to access the dataset after it is deleted, you get a ResourceNotFoundException exception.  You can't delete a dataset while it is creating (Status = CREATE_IN_PROGRESS) or if the dataset is updating (Status = UPDATE_IN_PROGRESS). This operation requires permissions to perform the rekognition:DeleteDataset action.
   */
  deleteDataset(params: Rekognition.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteDatasetResponse) => void): Request<Rekognition.Types.DeleteDatasetResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Deletes an existing Amazon Rekognition Custom Labels dataset. Deleting a dataset might take while. Use DescribeDataset to check the current status. The dataset is still deleting if the value of Status is DELETE_IN_PROGRESS. If you try to access the dataset after it is deleted, you get a ResourceNotFoundException exception.  You can't delete a dataset while it is creating (Status = CREATE_IN_PROGRESS) or if the dataset is updating (Status = UPDATE_IN_PROGRESS). This operation requires permissions to perform the rekognition:DeleteDataset action.
   */
  deleteDataset(callback?: (err: AWSError, data: Rekognition.Types.DeleteDatasetResponse) => void): Request<Rekognition.Types.DeleteDatasetResponse, AWSError>;
  /**
   * Deletes faces from a collection. You specify a collection ID and an array of face IDs to remove from the collection. This operation requires permissions to perform the rekognition:DeleteFaces action.
   */
  deleteFaces(params: Rekognition.Types.DeleteFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteFacesResponse) => void): Request<Rekognition.Types.DeleteFacesResponse, AWSError>;
  /**
   * Deletes faces from a collection. You specify a collection ID and an array of face IDs to remove from the collection. This operation requires permissions to perform the rekognition:DeleteFaces action.
   */
  deleteFaces(callback?: (err: AWSError, data: Rekognition.Types.DeleteFacesResponse) => void): Request<Rekognition.Types.DeleteFacesResponse, AWSError>;
  /**
   * Deletes a Amazon Rekognition project. To delete a project you must first delete all models or adapters associated with the project. To delete a model or adapter, see DeleteProjectVersion.  DeleteProject is an asynchronous operation. To check if the project is deleted, call DescribeProjects. The project is deleted when the project no longer appears in the response. Be aware that deleting a given project will also delete any ProjectPolicies associated with that project. This operation requires permissions to perform the rekognition:DeleteProject action. 
   */
  deleteProject(params: Rekognition.Types.DeleteProjectRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteProjectResponse) => void): Request<Rekognition.Types.DeleteProjectResponse, AWSError>;
  /**
   * Deletes a Amazon Rekognition project. To delete a project you must first delete all models or adapters associated with the project. To delete a model or adapter, see DeleteProjectVersion.  DeleteProject is an asynchronous operation. To check if the project is deleted, call DescribeProjects. The project is deleted when the project no longer appears in the response. Be aware that deleting a given project will also delete any ProjectPolicies associated with that project. This operation requires permissions to perform the rekognition:DeleteProject action. 
   */
  deleteProject(callback?: (err: AWSError, data: Rekognition.Types.DeleteProjectResponse) => void): Request<Rekognition.Types.DeleteProjectResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Deletes an existing project policy. To get a list of project policies attached to a project, call ListProjectPolicies. To attach a project policy to a project, call PutProjectPolicy. This operation requires permissions to perform the rekognition:DeleteProjectPolicy action.
   */
  deleteProjectPolicy(params: Rekognition.Types.DeleteProjectPolicyRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteProjectPolicyResponse) => void): Request<Rekognition.Types.DeleteProjectPolicyResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Deletes an existing project policy. To get a list of project policies attached to a project, call ListProjectPolicies. To attach a project policy to a project, call PutProjectPolicy. This operation requires permissions to perform the rekognition:DeleteProjectPolicy action.
   */
  deleteProjectPolicy(callback?: (err: AWSError, data: Rekognition.Types.DeleteProjectPolicyResponse) => void): Request<Rekognition.Types.DeleteProjectPolicyResponse, AWSError>;
  /**
   * Deletes a Rekognition project model or project version, like a Amazon Rekognition Custom Labels model or a custom adapter. You can't delete a project version if it is running or if it is training. To check the status of a project version, use the Status field returned from DescribeProjectVersions. To stop a project version call StopProjectVersion. If the project version is training, wait until it finishes. This operation requires permissions to perform the rekognition:DeleteProjectVersion action. 
   */
  deleteProjectVersion(params: Rekognition.Types.DeleteProjectVersionRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteProjectVersionResponse) => void): Request<Rekognition.Types.DeleteProjectVersionResponse, AWSError>;
  /**
   * Deletes a Rekognition project model or project version, like a Amazon Rekognition Custom Labels model or a custom adapter. You can't delete a project version if it is running or if it is training. To check the status of a project version, use the Status field returned from DescribeProjectVersions. To stop a project version call StopProjectVersion. If the project version is training, wait until it finishes. This operation requires permissions to perform the rekognition:DeleteProjectVersion action. 
   */
  deleteProjectVersion(callback?: (err: AWSError, data: Rekognition.Types.DeleteProjectVersionResponse) => void): Request<Rekognition.Types.DeleteProjectVersionResponse, AWSError>;
  /**
   * Deletes the stream processor identified by Name. You assign the value for Name when you create the stream processor with CreateStreamProcessor. You might not be able to use the same name for a stream processor for a few seconds after calling DeleteStreamProcessor.
   */
  deleteStreamProcessor(params: Rekognition.Types.DeleteStreamProcessorRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteStreamProcessorResponse) => void): Request<Rekognition.Types.DeleteStreamProcessorResponse, AWSError>;
  /**
   * Deletes the stream processor identified by Name. You assign the value for Name when you create the stream processor with CreateStreamProcessor. You might not be able to use the same name for a stream processor for a few seconds after calling DeleteStreamProcessor.
   */
  deleteStreamProcessor(callback?: (err: AWSError, data: Rekognition.Types.DeleteStreamProcessorResponse) => void): Request<Rekognition.Types.DeleteStreamProcessorResponse, AWSError>;
  /**
   * Deletes the specified UserID within the collection. Faces that are associated with the UserID are disassociated from the UserID before deleting the specified UserID. If the specified Collection or UserID is already deleted or not found, a ResourceNotFoundException will be thrown. If the action is successful with a 200 response, an empty HTTP body is returned. 
   */
  deleteUser(params: Rekognition.Types.DeleteUserRequest, callback?: (err: AWSError, data: Rekognition.Types.DeleteUserResponse) => void): Request<Rekognition.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes the specified UserID within the collection. Faces that are associated with the UserID are disassociated from the UserID before deleting the specified UserID. If the specified Collection or UserID is already deleted or not found, a ResourceNotFoundException will be thrown. If the action is successful with a 200 response, an empty HTTP body is returned. 
   */
  deleteUser(callback?: (err: AWSError, data: Rekognition.Types.DeleteUserResponse) => void): Request<Rekognition.Types.DeleteUserResponse, AWSError>;
  /**
   * Describes the specified collection. You can use DescribeCollection to get information, such as the number of faces indexed into a collection and the version of the model used by the collection for face detection. For more information, see Describing a Collection in the Amazon Rekognition Developer Guide.
   */
  describeCollection(params: Rekognition.Types.DescribeCollectionRequest, callback?: (err: AWSError, data: Rekognition.Types.DescribeCollectionResponse) => void): Request<Rekognition.Types.DescribeCollectionResponse, AWSError>;
  /**
   * Describes the specified collection. You can use DescribeCollection to get information, such as the number of faces indexed into a collection and the version of the model used by the collection for face detection. For more information, see Describing a Collection in the Amazon Rekognition Developer Guide.
   */
  describeCollection(callback?: (err: AWSError, data: Rekognition.Types.DescribeCollectionResponse) => void): Request<Rekognition.Types.DescribeCollectionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.   Describes an Amazon Rekognition Custom Labels dataset. You can get information such as the current status of a dataset and statistics about the images and labels in a dataset.  This operation requires permissions to perform the rekognition:DescribeDataset action.
   */
  describeDataset(params: Rekognition.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: Rekognition.Types.DescribeDatasetResponse) => void): Request<Rekognition.Types.DescribeDatasetResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.   Describes an Amazon Rekognition Custom Labels dataset. You can get information such as the current status of a dataset and statistics about the images and labels in a dataset.  This operation requires permissions to perform the rekognition:DescribeDataset action.
   */
  describeDataset(callback?: (err: AWSError, data: Rekognition.Types.DescribeDatasetResponse) => void): Request<Rekognition.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Lists and describes the versions of an Amazon Rekognition project. You can specify up to 10 model or adapter versions in ProjectVersionArns. If you don't specify a value, descriptions for all model/adapter versions in the project are returned. This operation requires permissions to perform the rekognition:DescribeProjectVersions action.
   */
  describeProjectVersions(params: Rekognition.Types.DescribeProjectVersionsRequest, callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectVersionsResponse) => void): Request<Rekognition.Types.DescribeProjectVersionsResponse, AWSError>;
  /**
   * Lists and describes the versions of an Amazon Rekognition project. You can specify up to 10 model or adapter versions in ProjectVersionArns. If you don't specify a value, descriptions for all model/adapter versions in the project are returned. This operation requires permissions to perform the rekognition:DescribeProjectVersions action.
   */
  describeProjectVersions(callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectVersionsResponse) => void): Request<Rekognition.Types.DescribeProjectVersionsResponse, AWSError>;
  /**
   * Gets information about your Rekognition projects. This operation requires permissions to perform the rekognition:DescribeProjects action.
   */
  describeProjects(params: Rekognition.Types.DescribeProjectsRequest, callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectsResponse) => void): Request<Rekognition.Types.DescribeProjectsResponse, AWSError>;
  /**
   * Gets information about your Rekognition projects. This operation requires permissions to perform the rekognition:DescribeProjects action.
   */
  describeProjects(callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectsResponse) => void): Request<Rekognition.Types.DescribeProjectsResponse, AWSError>;
  /**
   * Provides information about a stream processor created by CreateStreamProcessor. You can get information about the input and output streams, the input parameters for the face recognition being performed, and the current status of the stream processor.
   */
  describeStreamProcessor(params: Rekognition.Types.DescribeStreamProcessorRequest, callback?: (err: AWSError, data: Rekognition.Types.DescribeStreamProcessorResponse) => void): Request<Rekognition.Types.DescribeStreamProcessorResponse, AWSError>;
  /**
   * Provides information about a stream processor created by CreateStreamProcessor. You can get information about the input and output streams, the input parameters for the face recognition being performed, and the current status of the stream processor.
   */
  describeStreamProcessor(callback?: (err: AWSError, data: Rekognition.Types.DescribeStreamProcessorResponse) => void): Request<Rekognition.Types.DescribeStreamProcessorResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Detects custom labels in a supplied image by using an Amazon Rekognition Custom Labels model.  You specify which version of a model version to use by using the ProjectVersionArn input parameter.  You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   For each object that the model version detects on an image, the API returns a (CustomLabel) object in an array (CustomLabels). Each CustomLabel object provides the label name (Name), the level of confidence that the image contains the object (Confidence), and object location information, if it exists, for the label on the image (Geometry).  To filter labels that are returned, specify a value for MinConfidence. DetectCustomLabelsLabels only returns labels with a confidence that's higher than the specified value. The value of MinConfidence maps to the assumed threshold values created during training. For more information, see Assumed threshold in the Amazon Rekognition Custom Labels Developer Guide. Amazon Rekognition Custom Labels metrics expresses an assumed threshold as a floating point value between 0-1. The range of MinConfidence normalizes the threshold value to a percentage value (0-100). Confidence responses from DetectCustomLabels are also returned as a percentage. You can use MinConfidence to change the precision and recall or your model. For more information, see Analyzing an image in the Amazon Rekognition Custom Labels Developer Guide.  If you don't specify a value for MinConfidence, DetectCustomLabels returns labels based on the assumed threshold of each label. This is a stateless API operation. That is, the operation does not persist any data. This operation requires permissions to perform the rekognition:DetectCustomLabels action.  For more information, see Analyzing an image in the Amazon Rekognition Custom Labels Developer Guide. 
   */
  detectCustomLabels(params: Rekognition.Types.DetectCustomLabelsRequest, callback?: (err: AWSError, data: Rekognition.Types.DetectCustomLabelsResponse) => void): Request<Rekognition.Types.DetectCustomLabelsResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Detects custom labels in a supplied image by using an Amazon Rekognition Custom Labels model.  You specify which version of a model version to use by using the ProjectVersionArn input parameter.  You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   For each object that the model version detects on an image, the API returns a (CustomLabel) object in an array (CustomLabels). Each CustomLabel object provides the label name (Name), the level of confidence that the image contains the object (Confidence), and object location information, if it exists, for the label on the image (Geometry).  To filter labels that are returned, specify a value for MinConfidence. DetectCustomLabelsLabels only returns labels with a confidence that's higher than the specified value. The value of MinConfidence maps to the assumed threshold values created during training. For more information, see Assumed threshold in the Amazon Rekognition Custom Labels Developer Guide. Amazon Rekognition Custom Labels metrics expresses an assumed threshold as a floating point value between 0-1. The range of MinConfidence normalizes the threshold value to a percentage value (0-100). Confidence responses from DetectCustomLabels are also returned as a percentage. You can use MinConfidence to change the precision and recall or your model. For more information, see Analyzing an image in the Amazon Rekognition Custom Labels Developer Guide.  If you don't specify a value for MinConfidence, DetectCustomLabels returns labels based on the assumed threshold of each label. This is a stateless API operation. That is, the operation does not persist any data. This operation requires permissions to perform the rekognition:DetectCustomLabels action.  For more information, see Analyzing an image in the Amazon Rekognition Custom Labels Developer Guide. 
   */
  detectCustomLabels(callback?: (err: AWSError, data: Rekognition.Types.DetectCustomLabelsResponse) => void): Request<Rekognition.Types.DetectCustomLabelsResponse, AWSError>;
  /**
   * Detects faces within an image that is provided as input.  DetectFaces detects the 100 largest faces in the image. For each face detected, the operation returns face details. These details include a bounding box of the face, a confidence value (that the bounding box contains a face), and a fixed set of attributes such as facial landmarks (for example, coordinates of eye and mouth), pose, presence of facial occlusion, and so on. The face-detection algorithm is most effective on frontal faces. For non-frontal or obscured faces, the algorithm might not detect the faces or might detect faces with lower confidence.  You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   This is a stateless API operation. That is, the operation does not persist any data.  This operation requires permissions to perform the rekognition:DetectFaces action. 
   */
  detectFaces(params: Rekognition.Types.DetectFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.DetectFacesResponse) => void): Request<Rekognition.Types.DetectFacesResponse, AWSError>;
  /**
   * Detects faces within an image that is provided as input.  DetectFaces detects the 100 largest faces in the image. For each face detected, the operation returns face details. These details include a bounding box of the face, a confidence value (that the bounding box contains a face), and a fixed set of attributes such as facial landmarks (for example, coordinates of eye and mouth), pose, presence of facial occlusion, and so on. The face-detection algorithm is most effective on frontal faces. For non-frontal or obscured faces, the algorithm might not detect the faces or might detect faces with lower confidence.  You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   This is a stateless API operation. That is, the operation does not persist any data.  This operation requires permissions to perform the rekognition:DetectFaces action. 
   */
  detectFaces(callback?: (err: AWSError, data: Rekognition.Types.DetectFacesResponse) => void): Request<Rekognition.Types.DetectFacesResponse, AWSError>;
  /**
   * Detects instances of real-world entities within an image (JPEG or PNG) provided as input. This includes objects like flower, tree, and table; events like wedding, graduation, and birthday party; and concepts like landscape, evening, and nature.  For an example, see Analyzing images stored in an Amazon S3 bucket in the Amazon Rekognition Developer Guide. You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   Optional Parameters  You can specify one or both of the GENERAL_LABELS and IMAGE_PROPERTIES feature types when calling the DetectLabels API. Including GENERAL_LABELS will ensure the response includes the labels detected in the input image, while including IMAGE_PROPERTIES will ensure the response includes information about the image quality and color. When using GENERAL_LABELS and/or IMAGE_PROPERTIES you can provide filtering criteria to the Settings parameter. You can filter with sets of individual labels or with label categories. You can specify inclusive filters, exclusive filters, or a combination of inclusive and exclusive filters. For more information on filtering see Detecting Labels in an Image. When getting labels, you can specify MinConfidence to control the confidence threshold for the labels returned. The default is 55%. You can also add the MaxLabels parameter to limit the number of labels returned. The default and upper limit is 1000 labels. These arguments are only valid when supplying GENERAL_LABELS as a feature type.  Response Elements   For each object, scene, and concept the API returns one or more labels. The API returns the following types of information about labels:    Name - The name of the detected label.     Confidence - The level of confidence in the label assigned to a detected object.     Parents - The ancestor labels for a detected label. DetectLabels returns a hierarchical taxonomy of detected labels. For example, a detected car might be assigned the label car. The label car has two parent labels: Vehicle (its parent) and Transportation (its grandparent). The response includes the all ancestors for a label, where every ancestor is a unique label. In the previous example, Car, Vehicle, and Transportation are returned as unique labels in the response.     Aliases - Possible Aliases for the label.     Categories - The label categories that the detected label belongs to.     BoundingBox — Bounding boxes are described for all instances of detected common object labels, returned in an array of Instance objects. An Instance object contains a BoundingBox object, describing the location of the label on the input image. It also includes the confidence for the accuracy of the detected bounding box.     The API returns the following information regarding the image, as part of the ImageProperties structure:   Quality - Information about the Sharpness, Brightness, and Contrast of the input image, scored between 0 to 100. Image quality is returned for the entire image, as well as the background and the foreground.    Dominant Color - An array of the dominant colors in the image.    Foreground - Information about the sharpness, brightness, and dominant colors of the input image’s foreground.    Background - Information about the sharpness, brightness, and dominant colors of the input image’s background.   The list of returned labels will include at least one label for every detected object, along with information about that label. In the following example, suppose the input image has a lighthouse, the sea, and a rock. The response includes all three labels, one for each object, as well as the confidence in the label:  {Name: lighthouse, Confidence: 98.4629}   {Name: rock,Confidence: 79.2097}    {Name: sea,Confidence: 75.061}  The list of labels can include multiple labels for the same object. For example, if the input image shows a flower (for example, a tulip), the operation might return the following three labels.   {Name: flower,Confidence: 99.0562}   {Name: plant,Confidence: 99.0562}   {Name: tulip,Confidence: 99.0562}  In this example, the detection algorithm more precisely identifies the flower as a tulip.  If the object detected is a person, the operation doesn't provide the same facial details that the DetectFaces operation provides.  This is a stateless API operation that doesn't return any data. This operation requires permissions to perform the rekognition:DetectLabels action. 
   */
  detectLabels(params: Rekognition.Types.DetectLabelsRequest, callback?: (err: AWSError, data: Rekognition.Types.DetectLabelsResponse) => void): Request<Rekognition.Types.DetectLabelsResponse, AWSError>;
  /**
   * Detects instances of real-world entities within an image (JPEG or PNG) provided as input. This includes objects like flower, tree, and table; events like wedding, graduation, and birthday party; and concepts like landscape, evening, and nature.  For an example, see Analyzing images stored in an Amazon S3 bucket in the Amazon Rekognition Developer Guide. You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   Optional Parameters  You can specify one or both of the GENERAL_LABELS and IMAGE_PROPERTIES feature types when calling the DetectLabels API. Including GENERAL_LABELS will ensure the response includes the labels detected in the input image, while including IMAGE_PROPERTIES will ensure the response includes information about the image quality and color. When using GENERAL_LABELS and/or IMAGE_PROPERTIES you can provide filtering criteria to the Settings parameter. You can filter with sets of individual labels or with label categories. You can specify inclusive filters, exclusive filters, or a combination of inclusive and exclusive filters. For more information on filtering see Detecting Labels in an Image. When getting labels, you can specify MinConfidence to control the confidence threshold for the labels returned. The default is 55%. You can also add the MaxLabels parameter to limit the number of labels returned. The default and upper limit is 1000 labels. These arguments are only valid when supplying GENERAL_LABELS as a feature type.  Response Elements   For each object, scene, and concept the API returns one or more labels. The API returns the following types of information about labels:    Name - The name of the detected label.     Confidence - The level of confidence in the label assigned to a detected object.     Parents - The ancestor labels for a detected label. DetectLabels returns a hierarchical taxonomy of detected labels. For example, a detected car might be assigned the label car. The label car has two parent labels: Vehicle (its parent) and Transportation (its grandparent). The response includes the all ancestors for a label, where every ancestor is a unique label. In the previous example, Car, Vehicle, and Transportation are returned as unique labels in the response.     Aliases - Possible Aliases for the label.     Categories - The label categories that the detected label belongs to.     BoundingBox — Bounding boxes are described for all instances of detected common object labels, returned in an array of Instance objects. An Instance object contains a BoundingBox object, describing the location of the label on the input image. It also includes the confidence for the accuracy of the detected bounding box.     The API returns the following information regarding the image, as part of the ImageProperties structure:   Quality - Information about the Sharpness, Brightness, and Contrast of the input image, scored between 0 to 100. Image quality is returned for the entire image, as well as the background and the foreground.    Dominant Color - An array of the dominant colors in the image.    Foreground - Information about the sharpness, brightness, and dominant colors of the input image’s foreground.    Background - Information about the sharpness, brightness, and dominant colors of the input image’s background.   The list of returned labels will include at least one label for every detected object, along with information about that label. In the following example, suppose the input image has a lighthouse, the sea, and a rock. The response includes all three labels, one for each object, as well as the confidence in the label:  {Name: lighthouse, Confidence: 98.4629}   {Name: rock,Confidence: 79.2097}    {Name: sea,Confidence: 75.061}  The list of labels can include multiple labels for the same object. For example, if the input image shows a flower (for example, a tulip), the operation might return the following three labels.   {Name: flower,Confidence: 99.0562}   {Name: plant,Confidence: 99.0562}   {Name: tulip,Confidence: 99.0562}  In this example, the detection algorithm more precisely identifies the flower as a tulip.  If the object detected is a person, the operation doesn't provide the same facial details that the DetectFaces operation provides.  This is a stateless API operation that doesn't return any data. This operation requires permissions to perform the rekognition:DetectLabels action. 
   */
  detectLabels(callback?: (err: AWSError, data: Rekognition.Types.DetectLabelsResponse) => void): Request<Rekognition.Types.DetectLabelsResponse, AWSError>;
  /**
   * Detects unsafe content in a specified JPEG or PNG format image. Use DetectModerationLabels to moderate images depending on your requirements. For example, you might want to filter images that contain nudity, but not images containing suggestive content. To filter images, use the labels returned by DetectModerationLabels to determine which types of content are appropriate. For information about moderation labels, see Detecting Unsafe Content in the Amazon Rekognition Developer Guide. You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.  You can specify an adapter to use when retrieving label predictions by providing a ProjectVersionArn to the ProjectVersion argument.
   */
  detectModerationLabels(params: Rekognition.Types.DetectModerationLabelsRequest, callback?: (err: AWSError, data: Rekognition.Types.DetectModerationLabelsResponse) => void): Request<Rekognition.Types.DetectModerationLabelsResponse, AWSError>;
  /**
   * Detects unsafe content in a specified JPEG or PNG format image. Use DetectModerationLabels to moderate images depending on your requirements. For example, you might want to filter images that contain nudity, but not images containing suggestive content. To filter images, use the labels returned by DetectModerationLabels to determine which types of content are appropriate. For information about moderation labels, see Detecting Unsafe Content in the Amazon Rekognition Developer Guide. You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.  You can specify an adapter to use when retrieving label predictions by providing a ProjectVersionArn to the ProjectVersion argument.
   */
  detectModerationLabels(callback?: (err: AWSError, data: Rekognition.Types.DetectModerationLabelsResponse) => void): Request<Rekognition.Types.DetectModerationLabelsResponse, AWSError>;
  /**
   * Detects Personal Protective Equipment (PPE) worn by people detected in an image. Amazon Rekognition can detect the following types of PPE.   Face cover   Hand cover   Head cover   You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. The image must be either a PNG or JPG formatted file.   DetectProtectiveEquipment detects PPE worn by up to 15 persons detected in an image. For each person detected in the image the API returns an array of body parts (face, head, left-hand, right-hand). For each body part, an array of detected items of PPE is returned, including an indicator of whether or not the PPE covers the body part. The API returns the confidence it has in each detection (person, PPE, body part and body part coverage). It also returns a bounding box (BoundingBox) for each detected person and each detected item of PPE.  You can optionally request a summary of detected PPE items with the SummarizationAttributes input parameter. The summary provides the following information.    The persons detected as wearing all of the types of PPE that you specify.   The persons detected as not wearing all of the types PPE that you specify.   The persons detected where PPE adornment could not be determined.    This is a stateless API operation. That is, the operation does not persist any data. This operation requires permissions to perform the rekognition:DetectProtectiveEquipment action. 
   */
  detectProtectiveEquipment(params: Rekognition.Types.DetectProtectiveEquipmentRequest, callback?: (err: AWSError, data: Rekognition.Types.DetectProtectiveEquipmentResponse) => void): Request<Rekognition.Types.DetectProtectiveEquipmentResponse, AWSError>;
  /**
   * Detects Personal Protective Equipment (PPE) worn by people detected in an image. Amazon Rekognition can detect the following types of PPE.   Face cover   Hand cover   Head cover   You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. The image must be either a PNG or JPG formatted file.   DetectProtectiveEquipment detects PPE worn by up to 15 persons detected in an image. For each person detected in the image the API returns an array of body parts (face, head, left-hand, right-hand). For each body part, an array of detected items of PPE is returned, including an indicator of whether or not the PPE covers the body part. The API returns the confidence it has in each detection (person, PPE, body part and body part coverage). It also returns a bounding box (BoundingBox) for each detected person and each detected item of PPE.  You can optionally request a summary of detected PPE items with the SummarizationAttributes input parameter. The summary provides the following information.    The persons detected as wearing all of the types of PPE that you specify.   The persons detected as not wearing all of the types PPE that you specify.   The persons detected where PPE adornment could not be determined.    This is a stateless API operation. That is, the operation does not persist any data. This operation requires permissions to perform the rekognition:DetectProtectiveEquipment action. 
   */
  detectProtectiveEquipment(callback?: (err: AWSError, data: Rekognition.Types.DetectProtectiveEquipmentResponse) => void): Request<Rekognition.Types.DetectProtectiveEquipmentResponse, AWSError>;
  /**
   * Detects text in the input image and converts it into machine-readable text. Pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, you must pass it as a reference to an image in an Amazon S3 bucket. For the AWS CLI, passing image bytes is not supported. The image must be either a .png or .jpeg formatted file.  The DetectText operation returns text in an array of TextDetection elements, TextDetections. Each TextDetection element provides information about a single word or line of text that was detected in the image.  A word is one or more script characters that are not separated by spaces. DetectText can detect up to 100 words in an image. A line is a string of equally spaced words. A line isn't necessarily a complete sentence. For example, a driver's license number is detected as a line. A line ends when there is no aligned text after it. Also, a line ends when there is a large gap between words, relative to the length of the words. This means, depending on the gap between words, Amazon Rekognition may detect multiple lines in text aligned in the same direction. Periods don't represent the end of a line. If a sentence spans multiple lines, the DetectText operation returns multiple lines. To determine whether a TextDetection element is a line of text or a word, use the TextDetection object Type field.  To be detected, text must be within +/- 90 degrees orientation of the horizontal axis. For more information, see Detecting text in the Amazon Rekognition Developer Guide.
   */
  detectText(params: Rekognition.Types.DetectTextRequest, callback?: (err: AWSError, data: Rekognition.Types.DetectTextResponse) => void): Request<Rekognition.Types.DetectTextResponse, AWSError>;
  /**
   * Detects text in the input image and converts it into machine-readable text. Pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, you must pass it as a reference to an image in an Amazon S3 bucket. For the AWS CLI, passing image bytes is not supported. The image must be either a .png or .jpeg formatted file.  The DetectText operation returns text in an array of TextDetection elements, TextDetections. Each TextDetection element provides information about a single word or line of text that was detected in the image.  A word is one or more script characters that are not separated by spaces. DetectText can detect up to 100 words in an image. A line is a string of equally spaced words. A line isn't necessarily a complete sentence. For example, a driver's license number is detected as a line. A line ends when there is no aligned text after it. Also, a line ends when there is a large gap between words, relative to the length of the words. This means, depending on the gap between words, Amazon Rekognition may detect multiple lines in text aligned in the same direction. Periods don't represent the end of a line. If a sentence spans multiple lines, the DetectText operation returns multiple lines. To determine whether a TextDetection element is a line of text or a word, use the TextDetection object Type field.  To be detected, text must be within +/- 90 degrees orientation of the horizontal axis. For more information, see Detecting text in the Amazon Rekognition Developer Guide.
   */
  detectText(callback?: (err: AWSError, data: Rekognition.Types.DetectTextResponse) => void): Request<Rekognition.Types.DetectTextResponse, AWSError>;
  /**
   * Removes the association between a Face supplied in an array of FaceIds and the User. If the User is not present already, then a ResourceNotFound exception is thrown. If successful, an array of faces that are disassociated from the User is returned. If a given face is already disassociated from the given UserID, it will be ignored and not be returned in the response. If a given face is already associated with a different User or not found in the collection it will be returned as part of UnsuccessfulDisassociations. You can remove 1 - 100 face IDs from a user at one time.
   */
  disassociateFaces(params: Rekognition.Types.DisassociateFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.DisassociateFacesResponse) => void): Request<Rekognition.Types.DisassociateFacesResponse, AWSError>;
  /**
   * Removes the association between a Face supplied in an array of FaceIds and the User. If the User is not present already, then a ResourceNotFound exception is thrown. If successful, an array of faces that are disassociated from the User is returned. If a given face is already disassociated from the given UserID, it will be ignored and not be returned in the response. If a given face is already associated with a different User or not found in the collection it will be returned as part of UnsuccessfulDisassociations. You can remove 1 - 100 face IDs from a user at one time.
   */
  disassociateFaces(callback?: (err: AWSError, data: Rekognition.Types.DisassociateFacesResponse) => void): Request<Rekognition.Types.DisassociateFacesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Distributes the entries (images) in a training dataset across the training dataset and the test dataset for a project. DistributeDatasetEntries moves 20% of the training dataset images to the test dataset. An entry is a JSON Line that describes an image.  You supply the Amazon Resource Names (ARN) of a project's training dataset and test dataset. The training dataset must contain the images that you want to split. The test dataset must be empty. The datasets must belong to the same project. To create training and test datasets for a project, call CreateDataset. Distributing a dataset takes a while to complete. To check the status call DescribeDataset. The operation is complete when the Status field for the training dataset and the test dataset is UPDATE_COMPLETE. If the dataset split fails, the value of Status is UPDATE_FAILED. This operation requires permissions to perform the rekognition:DistributeDatasetEntries action.
   */
  distributeDatasetEntries(params: Rekognition.Types.DistributeDatasetEntriesRequest, callback?: (err: AWSError, data: Rekognition.Types.DistributeDatasetEntriesResponse) => void): Request<Rekognition.Types.DistributeDatasetEntriesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Distributes the entries (images) in a training dataset across the training dataset and the test dataset for a project. DistributeDatasetEntries moves 20% of the training dataset images to the test dataset. An entry is a JSON Line that describes an image.  You supply the Amazon Resource Names (ARN) of a project's training dataset and test dataset. The training dataset must contain the images that you want to split. The test dataset must be empty. The datasets must belong to the same project. To create training and test datasets for a project, call CreateDataset. Distributing a dataset takes a while to complete. To check the status call DescribeDataset. The operation is complete when the Status field for the training dataset and the test dataset is UPDATE_COMPLETE. If the dataset split fails, the value of Status is UPDATE_FAILED. This operation requires permissions to perform the rekognition:DistributeDatasetEntries action.
   */
  distributeDatasetEntries(callback?: (err: AWSError, data: Rekognition.Types.DistributeDatasetEntriesResponse) => void): Request<Rekognition.Types.DistributeDatasetEntriesResponse, AWSError>;
  /**
   * Gets the name and additional information about a celebrity based on their Amazon Rekognition ID. The additional information is returned as an array of URLs. If there is no additional information about the celebrity, this list is empty. For more information, see Getting information about a celebrity in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:GetCelebrityInfo action. 
   */
  getCelebrityInfo(params: Rekognition.Types.GetCelebrityInfoRequest, callback?: (err: AWSError, data: Rekognition.Types.GetCelebrityInfoResponse) => void): Request<Rekognition.Types.GetCelebrityInfoResponse, AWSError>;
  /**
   * Gets the name and additional information about a celebrity based on their Amazon Rekognition ID. The additional information is returned as an array of URLs. If there is no additional information about the celebrity, this list is empty. For more information, see Getting information about a celebrity in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:GetCelebrityInfo action. 
   */
  getCelebrityInfo(callback?: (err: AWSError, data: Rekognition.Types.GetCelebrityInfoResponse) => void): Request<Rekognition.Types.GetCelebrityInfoResponse, AWSError>;
  /**
   * Gets the celebrity recognition results for a Amazon Rekognition Video analysis started by StartCelebrityRecognition. Celebrity recognition in a video is an asynchronous operation. Analysis is started by a call to StartCelebrityRecognition which returns a job identifier (JobId).  When the celebrity recognition operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartCelebrityRecognition. To get the results of the celebrity recognition analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetCelebrityDetection and pass the job identifier (JobId) from the initial call to StartCelebrityDetection.  For more information, see Working With Stored Videos in the Amazon Rekognition Developer Guide.  GetCelebrityRecognition returns detected celebrities and the time(s) they are detected in an array (Celebrities) of CelebrityRecognition objects. Each CelebrityRecognition contains information about the celebrity in a CelebrityDetail object and the time, Timestamp, the celebrity was detected. This CelebrityDetail object stores information about the detected celebrity's face attributes, a face bounding box, known gender, the celebrity's name, and a confidence estimate.   GetCelebrityRecognition only returns the default facial attributes (BoundingBox, Confidence, Landmarks, Pose, and Quality). The BoundingBox field only applies to the detected face instance. The other facial attributes listed in the Face object of the following response syntax are not returned. For more information, see FaceDetail in the Amazon Rekognition Developer Guide.   By default, the Celebrities array is sorted by time (milliseconds from the start of the video). You can also sort the array by celebrity by specifying the value ID in the SortBy input parameter. The CelebrityDetail object includes the celebrity identifer and additional information urls. If you don't store the additional information urls, you can get them later by calling GetCelebrityInfo with the celebrity identifer. No information is returned for faces not recognized as celebrities. Use MaxResults parameter to limit the number of labels returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetCelebrityDetection and populate the NextToken request parameter with the token value returned from the previous call to GetCelebrityRecognition.
   */
  getCelebrityRecognition(params: Rekognition.Types.GetCelebrityRecognitionRequest, callback?: (err: AWSError, data: Rekognition.Types.GetCelebrityRecognitionResponse) => void): Request<Rekognition.Types.GetCelebrityRecognitionResponse, AWSError>;
  /**
   * Gets the celebrity recognition results for a Amazon Rekognition Video analysis started by StartCelebrityRecognition. Celebrity recognition in a video is an asynchronous operation. Analysis is started by a call to StartCelebrityRecognition which returns a job identifier (JobId).  When the celebrity recognition operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartCelebrityRecognition. To get the results of the celebrity recognition analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetCelebrityDetection and pass the job identifier (JobId) from the initial call to StartCelebrityDetection.  For more information, see Working With Stored Videos in the Amazon Rekognition Developer Guide.  GetCelebrityRecognition returns detected celebrities and the time(s) they are detected in an array (Celebrities) of CelebrityRecognition objects. Each CelebrityRecognition contains information about the celebrity in a CelebrityDetail object and the time, Timestamp, the celebrity was detected. This CelebrityDetail object stores information about the detected celebrity's face attributes, a face bounding box, known gender, the celebrity's name, and a confidence estimate.   GetCelebrityRecognition only returns the default facial attributes (BoundingBox, Confidence, Landmarks, Pose, and Quality). The BoundingBox field only applies to the detected face instance. The other facial attributes listed in the Face object of the following response syntax are not returned. For more information, see FaceDetail in the Amazon Rekognition Developer Guide.   By default, the Celebrities array is sorted by time (milliseconds from the start of the video). You can also sort the array by celebrity by specifying the value ID in the SortBy input parameter. The CelebrityDetail object includes the celebrity identifer and additional information urls. If you don't store the additional information urls, you can get them later by calling GetCelebrityInfo with the celebrity identifer. No information is returned for faces not recognized as celebrities. Use MaxResults parameter to limit the number of labels returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetCelebrityDetection and populate the NextToken request parameter with the token value returned from the previous call to GetCelebrityRecognition.
   */
  getCelebrityRecognition(callback?: (err: AWSError, data: Rekognition.Types.GetCelebrityRecognitionResponse) => void): Request<Rekognition.Types.GetCelebrityRecognitionResponse, AWSError>;
  /**
   * Gets the inappropriate, unwanted, or offensive content analysis results for a Amazon Rekognition Video analysis started by StartContentModeration. For a list of moderation labels in Amazon Rekognition, see Using the image and video moderation APIs. Amazon Rekognition Video inappropriate or offensive content detection in a stored video is an asynchronous operation. You start analysis by calling StartContentModeration which returns a job identifier (JobId). When analysis finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartContentModeration. To get the results of the content analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetContentModeration and pass the job identifier (JobId) from the initial call to StartContentModeration.  For more information, see Working with Stored Videos in the Amazon Rekognition Devlopers Guide.  GetContentModeration returns detected inappropriate, unwanted, or offensive content moderation labels, and the time they are detected, in an array, ModerationLabels, of ContentModerationDetection objects.  By default, the moderated labels are returned sorted by time, in milliseconds from the start of the video. You can also sort them by moderated label by specifying NAME for the SortBy input parameter.  Since video analysis can return a large number of results, use the MaxResults parameter to limit the number of labels returned in a single call to GetContentModeration. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetContentModeration and populate the NextToken request parameter with the value of NextToken returned from the previous call to GetContentModeration. For more information, see moderating content in the Amazon Rekognition Developer Guide.
   */
  getContentModeration(params: Rekognition.Types.GetContentModerationRequest, callback?: (err: AWSError, data: Rekognition.Types.GetContentModerationResponse) => void): Request<Rekognition.Types.GetContentModerationResponse, AWSError>;
  /**
   * Gets the inappropriate, unwanted, or offensive content analysis results for a Amazon Rekognition Video analysis started by StartContentModeration. For a list of moderation labels in Amazon Rekognition, see Using the image and video moderation APIs. Amazon Rekognition Video inappropriate or offensive content detection in a stored video is an asynchronous operation. You start analysis by calling StartContentModeration which returns a job identifier (JobId). When analysis finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartContentModeration. To get the results of the content analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetContentModeration and pass the job identifier (JobId) from the initial call to StartContentModeration.  For more information, see Working with Stored Videos in the Amazon Rekognition Devlopers Guide.  GetContentModeration returns detected inappropriate, unwanted, or offensive content moderation labels, and the time they are detected, in an array, ModerationLabels, of ContentModerationDetection objects.  By default, the moderated labels are returned sorted by time, in milliseconds from the start of the video. You can also sort them by moderated label by specifying NAME for the SortBy input parameter.  Since video analysis can return a large number of results, use the MaxResults parameter to limit the number of labels returned in a single call to GetContentModeration. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetContentModeration and populate the NextToken request parameter with the value of NextToken returned from the previous call to GetContentModeration. For more information, see moderating content in the Amazon Rekognition Developer Guide.
   */
  getContentModeration(callback?: (err: AWSError, data: Rekognition.Types.GetContentModerationResponse) => void): Request<Rekognition.Types.GetContentModerationResponse, AWSError>;
  /**
   * Gets face detection results for a Amazon Rekognition Video analysis started by StartFaceDetection. Face detection with Amazon Rekognition Video is an asynchronous operation. You start face detection by calling StartFaceDetection which returns a job identifier (JobId). When the face detection operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartFaceDetection. To get the results of the face detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceDetection and pass the job identifier (JobId) from the initial call to StartFaceDetection.  GetFaceDetection returns an array of detected faces (Faces) sorted by the time the faces were detected.  Use MaxResults parameter to limit the number of labels returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetFaceDetection and populate the NextToken request parameter with the token value returned from the previous call to GetFaceDetection. Note that for the GetFaceDetection operation, the returned values for FaceOccluded and EyeDirection will always be "null".
   */
  getFaceDetection(params: Rekognition.Types.GetFaceDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.GetFaceDetectionResponse) => void): Request<Rekognition.Types.GetFaceDetectionResponse, AWSError>;
  /**
   * Gets face detection results for a Amazon Rekognition Video analysis started by StartFaceDetection. Face detection with Amazon Rekognition Video is an asynchronous operation. You start face detection by calling StartFaceDetection which returns a job identifier (JobId). When the face detection operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartFaceDetection. To get the results of the face detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceDetection and pass the job identifier (JobId) from the initial call to StartFaceDetection.  GetFaceDetection returns an array of detected faces (Faces) sorted by the time the faces were detected.  Use MaxResults parameter to limit the number of labels returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetFaceDetection and populate the NextToken request parameter with the token value returned from the previous call to GetFaceDetection. Note that for the GetFaceDetection operation, the returned values for FaceOccluded and EyeDirection will always be "null".
   */
  getFaceDetection(callback?: (err: AWSError, data: Rekognition.Types.GetFaceDetectionResponse) => void): Request<Rekognition.Types.GetFaceDetectionResponse, AWSError>;
  /**
   * Retrieves the results of a specific Face Liveness session. It requires the sessionId as input, which was created using CreateFaceLivenessSession. Returns the corresponding Face Liveness confidence score, a reference image that includes a face bounding box, and audit images that also contain face bounding boxes. The Face Liveness confidence score ranges from 0 to 100.  The number of audit images returned by GetFaceLivenessSessionResults is defined by the AuditImagesLimit paramater when calling CreateFaceLivenessSession. Reference images are always returned when possible.
   */
  getFaceLivenessSessionResults(params: Rekognition.Types.GetFaceLivenessSessionResultsRequest, callback?: (err: AWSError, data: Rekognition.Types.GetFaceLivenessSessionResultsResponse) => void): Request<Rekognition.Types.GetFaceLivenessSessionResultsResponse, AWSError>;
  /**
   * Retrieves the results of a specific Face Liveness session. It requires the sessionId as input, which was created using CreateFaceLivenessSession. Returns the corresponding Face Liveness confidence score, a reference image that includes a face bounding box, and audit images that also contain face bounding boxes. The Face Liveness confidence score ranges from 0 to 100.  The number of audit images returned by GetFaceLivenessSessionResults is defined by the AuditImagesLimit paramater when calling CreateFaceLivenessSession. Reference images are always returned when possible.
   */
  getFaceLivenessSessionResults(callback?: (err: AWSError, data: Rekognition.Types.GetFaceLivenessSessionResultsResponse) => void): Request<Rekognition.Types.GetFaceLivenessSessionResultsResponse, AWSError>;
  /**
   * Gets the face search results for Amazon Rekognition Video face search started by StartFaceSearch. The search returns faces in a collection that match the faces of persons detected in a video. It also includes the time(s) that faces are matched in the video. Face search in a video is an asynchronous operation. You start face search by calling to StartFaceSearch which returns a job identifier (JobId). When the search operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartFaceSearch. To get the search results, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceSearch and pass the job identifier (JobId) from the initial call to StartFaceSearch. For more information, see Searching Faces in a Collection in the Amazon Rekognition Developer Guide. The search results are retured in an array, Persons, of PersonMatch objects. EachPersonMatch element contains details about the matching faces in the input collection, person information (facial attributes, bounding boxes, and person identifer) for the matched person, and the time the person was matched in the video.   GetFaceSearch only returns the default facial attributes (BoundingBox, Confidence, Landmarks, Pose, and Quality). The other facial attributes listed in the Face object of the following response syntax are not returned. For more information, see FaceDetail in the Amazon Rekognition Developer Guide.   By default, the Persons array is sorted by the time, in milliseconds from the start of the video, persons are matched. You can also sort by persons by specifying INDEX for the SORTBY input parameter.
   */
  getFaceSearch(params: Rekognition.Types.GetFaceSearchRequest, callback?: (err: AWSError, data: Rekognition.Types.GetFaceSearchResponse) => void): Request<Rekognition.Types.GetFaceSearchResponse, AWSError>;
  /**
   * Gets the face search results for Amazon Rekognition Video face search started by StartFaceSearch. The search returns faces in a collection that match the faces of persons detected in a video. It also includes the time(s) that faces are matched in the video. Face search in a video is an asynchronous operation. You start face search by calling to StartFaceSearch which returns a job identifier (JobId). When the search operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartFaceSearch. To get the search results, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceSearch and pass the job identifier (JobId) from the initial call to StartFaceSearch. For more information, see Searching Faces in a Collection in the Amazon Rekognition Developer Guide. The search results are retured in an array, Persons, of PersonMatch objects. EachPersonMatch element contains details about the matching faces in the input collection, person information (facial attributes, bounding boxes, and person identifer) for the matched person, and the time the person was matched in the video.   GetFaceSearch only returns the default facial attributes (BoundingBox, Confidence, Landmarks, Pose, and Quality). The other facial attributes listed in the Face object of the following response syntax are not returned. For more information, see FaceDetail in the Amazon Rekognition Developer Guide.   By default, the Persons array is sorted by the time, in milliseconds from the start of the video, persons are matched. You can also sort by persons by specifying INDEX for the SORTBY input parameter.
   */
  getFaceSearch(callback?: (err: AWSError, data: Rekognition.Types.GetFaceSearchResponse) => void): Request<Rekognition.Types.GetFaceSearchResponse, AWSError>;
  /**
   * Gets the label detection results of a Amazon Rekognition Video analysis started by StartLabelDetection.  The label detection operation is started by a call to StartLabelDetection which returns a job identifier (JobId). When the label detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartlabelDetection.  To get the results of the label detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLabelDetection and pass the job identifier (JobId) from the initial call to StartLabelDetection.  GetLabelDetection returns an array of detected labels (Labels) sorted by the time the labels were detected. You can also sort by the label name by specifying NAME for the SortBy input parameter. If there is no NAME specified, the default sort is by timestamp. You can select how results are aggregated by using the AggregateBy input parameter. The default aggregation method is TIMESTAMPS. You can also aggregate by SEGMENTS, which aggregates all instances of labels detected in a given segment.  The returned Labels array may include the following attributes:   Name - The name of the detected label.   Confidence - The level of confidence in the label assigned to a detected object.    Parents - The ancestor labels for a detected label. GetLabelDetection returns a hierarchical taxonomy of detected labels. For example, a detected car might be assigned the label car. The label car has two parent labels: Vehicle (its parent) and Transportation (its grandparent). The response includes the all ancestors for a label, where every ancestor is a unique label. In the previous example, Car, Vehicle, and Transportation are returned as unique labels in the response.     Aliases - Possible Aliases for the label.    Categories - The label categories that the detected label belongs to.   BoundingBox — Bounding boxes are described for all instances of detected common object labels, returned in an array of Instance objects. An Instance object contains a BoundingBox object, describing the location of the label on the input image. It also includes the confidence for the accuracy of the detected bounding box.   Timestamp - Time, in milliseconds from the start of the video, that the label was detected. For aggregation by SEGMENTS, the StartTimestampMillis, EndTimestampMillis, and DurationMillis structures are what define a segment. Although the “Timestamp” structure is still returned with each label, its value is set to be the same as StartTimestampMillis.   Timestamp and Bounding box information are returned for detected Instances, only if aggregation is done by TIMESTAMPS. If aggregating by SEGMENTS, information about detected instances isn’t returned.  The version of the label model used for the detection is also returned.  Note DominantColors isn't returned for Instances, although it is shown as part of the response in the sample seen below.  Use MaxResults parameter to limit the number of labels returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetlabelDetection and populate the NextToken request parameter with the token value returned from the previous call to GetLabelDetection.
   */
  getLabelDetection(params: Rekognition.Types.GetLabelDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.GetLabelDetectionResponse) => void): Request<Rekognition.Types.GetLabelDetectionResponse, AWSError>;
  /**
   * Gets the label detection results of a Amazon Rekognition Video analysis started by StartLabelDetection.  The label detection operation is started by a call to StartLabelDetection which returns a job identifier (JobId). When the label detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartlabelDetection.  To get the results of the label detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLabelDetection and pass the job identifier (JobId) from the initial call to StartLabelDetection.  GetLabelDetection returns an array of detected labels (Labels) sorted by the time the labels were detected. You can also sort by the label name by specifying NAME for the SortBy input parameter. If there is no NAME specified, the default sort is by timestamp. You can select how results are aggregated by using the AggregateBy input parameter. The default aggregation method is TIMESTAMPS. You can also aggregate by SEGMENTS, which aggregates all instances of labels detected in a given segment.  The returned Labels array may include the following attributes:   Name - The name of the detected label.   Confidence - The level of confidence in the label assigned to a detected object.    Parents - The ancestor labels for a detected label. GetLabelDetection returns a hierarchical taxonomy of detected labels. For example, a detected car might be assigned the label car. The label car has two parent labels: Vehicle (its parent) and Transportation (its grandparent). The response includes the all ancestors for a label, where every ancestor is a unique label. In the previous example, Car, Vehicle, and Transportation are returned as unique labels in the response.     Aliases - Possible Aliases for the label.    Categories - The label categories that the detected label belongs to.   BoundingBox — Bounding boxes are described for all instances of detected common object labels, returned in an array of Instance objects. An Instance object contains a BoundingBox object, describing the location of the label on the input image. It also includes the confidence for the accuracy of the detected bounding box.   Timestamp - Time, in milliseconds from the start of the video, that the label was detected. For aggregation by SEGMENTS, the StartTimestampMillis, EndTimestampMillis, and DurationMillis structures are what define a segment. Although the “Timestamp” structure is still returned with each label, its value is set to be the same as StartTimestampMillis.   Timestamp and Bounding box information are returned for detected Instances, only if aggregation is done by TIMESTAMPS. If aggregating by SEGMENTS, information about detected instances isn’t returned.  The version of the label model used for the detection is also returned.  Note DominantColors isn't returned for Instances, although it is shown as part of the response in the sample seen below.  Use MaxResults parameter to limit the number of labels returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetlabelDetection and populate the NextToken request parameter with the token value returned from the previous call to GetLabelDetection.
   */
  getLabelDetection(callback?: (err: AWSError, data: Rekognition.Types.GetLabelDetectionResponse) => void): Request<Rekognition.Types.GetLabelDetectionResponse, AWSError>;
  /**
   * Gets the path tracking results of a Amazon Rekognition Video analysis started by StartPersonTracking. The person path tracking operation is started by a call to StartPersonTracking which returns a job identifier (JobId). When the operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartPersonTracking. To get the results of the person path tracking operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetPersonTracking and pass the job identifier (JobId) from the initial call to StartPersonTracking.  GetPersonTracking returns an array, Persons, of tracked persons and the time(s) their paths were tracked in the video.    GetPersonTracking only returns the default facial attributes (BoundingBox, Confidence, Landmarks, Pose, and Quality). The other facial attributes listed in the Face object of the following response syntax are not returned.  For more information, see FaceDetail in the Amazon Rekognition Developer Guide.  By default, the array is sorted by the time(s) a person's path is tracked in the video. You can sort by tracked persons by specifying INDEX for the SortBy input parameter. Use the MaxResults parameter to limit the number of items returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetPersonTracking and populate the NextToken request parameter with the token value returned from the previous call to GetPersonTracking.
   */
  getPersonTracking(params: Rekognition.Types.GetPersonTrackingRequest, callback?: (err: AWSError, data: Rekognition.Types.GetPersonTrackingResponse) => void): Request<Rekognition.Types.GetPersonTrackingResponse, AWSError>;
  /**
   * Gets the path tracking results of a Amazon Rekognition Video analysis started by StartPersonTracking. The person path tracking operation is started by a call to StartPersonTracking which returns a job identifier (JobId). When the operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartPersonTracking. To get the results of the person path tracking operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetPersonTracking and pass the job identifier (JobId) from the initial call to StartPersonTracking.  GetPersonTracking returns an array, Persons, of tracked persons and the time(s) their paths were tracked in the video.    GetPersonTracking only returns the default facial attributes (BoundingBox, Confidence, Landmarks, Pose, and Quality). The other facial attributes listed in the Face object of the following response syntax are not returned.  For more information, see FaceDetail in the Amazon Rekognition Developer Guide.  By default, the array is sorted by the time(s) a person's path is tracked in the video. You can sort by tracked persons by specifying INDEX for the SortBy input parameter. Use the MaxResults parameter to limit the number of items returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetPersonTracking and populate the NextToken request parameter with the token value returned from the previous call to GetPersonTracking.
   */
  getPersonTracking(callback?: (err: AWSError, data: Rekognition.Types.GetPersonTrackingResponse) => void): Request<Rekognition.Types.GetPersonTrackingResponse, AWSError>;
  /**
   * Gets the segment detection results of a Amazon Rekognition Video analysis started by StartSegmentDetection. Segment detection with Amazon Rekognition Video is an asynchronous operation. You start segment detection by calling StartSegmentDetection which returns a job identifier (JobId). When the segment detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartSegmentDetection. To get the results of the segment detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetSegmentDetection and pass the job identifier (JobId) from the initial call of StartSegmentDetection.  GetSegmentDetection returns detected segments in an array (Segments) of SegmentDetection objects. Segments is sorted by the segment types specified in the SegmentTypes input parameter of StartSegmentDetection. Each element of the array includes the detected segment, the precentage confidence in the acuracy of the detected segment, the type of the segment, and the frame in which the segment was detected. Use SelectedSegmentTypes to find out the type of segment detection requested in the call to StartSegmentDetection. Use the MaxResults parameter to limit the number of segment detections returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetSegmentDetection and populate the NextToken request parameter with the token value returned from the previous call to GetSegmentDetection. For more information, see Detecting video segments in stored video in the Amazon Rekognition Developer Guide.
   */
  getSegmentDetection(params: Rekognition.Types.GetSegmentDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.GetSegmentDetectionResponse) => void): Request<Rekognition.Types.GetSegmentDetectionResponse, AWSError>;
  /**
   * Gets the segment detection results of a Amazon Rekognition Video analysis started by StartSegmentDetection. Segment detection with Amazon Rekognition Video is an asynchronous operation. You start segment detection by calling StartSegmentDetection which returns a job identifier (JobId). When the segment detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartSegmentDetection. To get the results of the segment detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetSegmentDetection and pass the job identifier (JobId) from the initial call of StartSegmentDetection.  GetSegmentDetection returns detected segments in an array (Segments) of SegmentDetection objects. Segments is sorted by the segment types specified in the SegmentTypes input parameter of StartSegmentDetection. Each element of the array includes the detected segment, the precentage confidence in the acuracy of the detected segment, the type of the segment, and the frame in which the segment was detected. Use SelectedSegmentTypes to find out the type of segment detection requested in the call to StartSegmentDetection. Use the MaxResults parameter to limit the number of segment detections returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetSegmentDetection and populate the NextToken request parameter with the token value returned from the previous call to GetSegmentDetection. For more information, see Detecting video segments in stored video in the Amazon Rekognition Developer Guide.
   */
  getSegmentDetection(callback?: (err: AWSError, data: Rekognition.Types.GetSegmentDetectionResponse) => void): Request<Rekognition.Types.GetSegmentDetectionResponse, AWSError>;
  /**
   * Gets the text detection results of a Amazon Rekognition Video analysis started by StartTextDetection. Text detection with Amazon Rekognition Video is an asynchronous operation. You start text detection by calling StartTextDetection which returns a job identifier (JobId) When the text detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartTextDetection. To get the results of the text detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetTextDetection and pass the job identifier (JobId) from the initial call of StartLabelDetection.  GetTextDetection returns an array of detected text (TextDetections) sorted by the time the text was detected, up to 100 words per frame of video. Each element of the array includes the detected text, the precentage confidence in the acuracy of the detected text, the time the text was detected, bounding box information for where the text was located, and unique identifiers for words and their lines. Use MaxResults parameter to limit the number of text detections returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetTextDetection and populate the NextToken request parameter with the token value returned from the previous call to GetTextDetection.
   */
  getTextDetection(params: Rekognition.Types.GetTextDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.GetTextDetectionResponse) => void): Request<Rekognition.Types.GetTextDetectionResponse, AWSError>;
  /**
   * Gets the text detection results of a Amazon Rekognition Video analysis started by StartTextDetection. Text detection with Amazon Rekognition Video is an asynchronous operation. You start text detection by calling StartTextDetection which returns a job identifier (JobId) When the text detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic registered in the initial call to StartTextDetection. To get the results of the text detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetTextDetection and pass the job identifier (JobId) from the initial call of StartLabelDetection.  GetTextDetection returns an array of detected text (TextDetections) sorted by the time the text was detected, up to 100 words per frame of video. Each element of the array includes the detected text, the precentage confidence in the acuracy of the detected text, the time the text was detected, bounding box information for where the text was located, and unique identifiers for words and their lines. Use MaxResults parameter to limit the number of text detections returned. If there are more results than specified in MaxResults, the value of NextToken in the operation response contains a pagination token for getting the next set of results. To get the next page of results, call GetTextDetection and populate the NextToken request parameter with the token value returned from the previous call to GetTextDetection.
   */
  getTextDetection(callback?: (err: AWSError, data: Rekognition.Types.GetTextDetectionResponse) => void): Request<Rekognition.Types.GetTextDetectionResponse, AWSError>;
  /**
   * Detects faces in the input image and adds them to the specified collection.  Amazon Rekognition doesn't save the actual faces that are detected. Instead, the underlying detection algorithm first detects the faces in the input image. For each face, the algorithm extracts facial features into a feature vector, and stores it in the backend database. Amazon Rekognition uses feature vectors when it performs face match and search operations using the SearchFaces and SearchFacesByImage operations. For more information, see Adding faces to a collection in the Amazon Rekognition Developer Guide. To get the number of faces in a collection, call DescribeCollection.  If you're using version 1.0 of the face detection model, IndexFaces indexes the 15 largest faces in the input image. Later versions of the face detection model index the 100 largest faces in the input image.  If you're using version 4 or later of the face model, image orientation information is not returned in the OrientationCorrection field.  To determine which version of the model you're using, call DescribeCollection and supply the collection ID. You can also get the model version from the value of FaceModelVersion in the response from IndexFaces  For more information, see Model Versioning in the Amazon Rekognition Developer Guide. If you provide the optional ExternalImageId for the input image you provided, Amazon Rekognition associates this ID with all faces that it detects. When you call the ListFaces operation, the response returns the external ID. You can use this external image ID to create a client-side index to associate the faces with each image. You can then use the index to find all faces in an image. You can specify the maximum number of faces to index with the MaxFaces input parameter. This is useful when you want to index the largest faces in an image and don't want to index smaller faces, such as those belonging to people standing in the background. The QualityFilter input parameter allows you to filter out detected faces that don’t meet a required quality bar. The quality bar is based on a variety of common use cases. By default, IndexFaces chooses the quality bar that's used to filter faces. You can also explicitly choose the quality bar. Use QualityFilter, to set the quality bar by specifying LOW, MEDIUM, or HIGH. If you do not want to filter detected faces, specify NONE.   To use quality filtering, you need a collection associated with version 3 of the face model or higher. To get the version of the face model associated with a collection, call DescribeCollection.   Information about faces detected in an image, but not indexed, is returned in an array of UnindexedFace objects, UnindexedFaces. Faces aren't indexed for reasons such as:   The number of faces detected exceeds the value of the MaxFaces request parameter.   The face is too small compared to the image dimensions.   The face is too blurry.   The image is too dark.   The face has an extreme pose.   The face doesn’t have enough detail to be suitable for face search.   In response, the IndexFaces operation returns an array of metadata for all detected faces, FaceRecords. This includes:    The bounding box, BoundingBox, of the detected face.    A confidence value, Confidence, which indicates the confidence that the bounding box contains a face.   A face ID, FaceId, assigned by the service for each face that's detected and stored.   An image ID, ImageId, assigned by the service for the input image.   If you request ALL or specific facial attributes (e.g., FACE_OCCLUDED) by using the detectionAttributes parameter, Amazon Rekognition returns detailed facial attributes, such as facial landmarks (for example, location of eye and mouth), facial occlusion, and other facial attributes. If you provide the same image, specify the same collection, and use the same external ID in the IndexFaces operation, Amazon Rekognition doesn't save duplicate face metadata.  The input image is passed either as base64-encoded image bytes, or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes isn't supported. The image must be formatted as a PNG or JPEG file.  This operation requires permissions to perform the rekognition:IndexFaces action.
   */
  indexFaces(params: Rekognition.Types.IndexFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.IndexFacesResponse) => void): Request<Rekognition.Types.IndexFacesResponse, AWSError>;
  /**
   * Detects faces in the input image and adds them to the specified collection.  Amazon Rekognition doesn't save the actual faces that are detected. Instead, the underlying detection algorithm first detects the faces in the input image. For each face, the algorithm extracts facial features into a feature vector, and stores it in the backend database. Amazon Rekognition uses feature vectors when it performs face match and search operations using the SearchFaces and SearchFacesByImage operations. For more information, see Adding faces to a collection in the Amazon Rekognition Developer Guide. To get the number of faces in a collection, call DescribeCollection.  If you're using version 1.0 of the face detection model, IndexFaces indexes the 15 largest faces in the input image. Later versions of the face detection model index the 100 largest faces in the input image.  If you're using version 4 or later of the face model, image orientation information is not returned in the OrientationCorrection field.  To determine which version of the model you're using, call DescribeCollection and supply the collection ID. You can also get the model version from the value of FaceModelVersion in the response from IndexFaces  For more information, see Model Versioning in the Amazon Rekognition Developer Guide. If you provide the optional ExternalImageId for the input image you provided, Amazon Rekognition associates this ID with all faces that it detects. When you call the ListFaces operation, the response returns the external ID. You can use this external image ID to create a client-side index to associate the faces with each image. You can then use the index to find all faces in an image. You can specify the maximum number of faces to index with the MaxFaces input parameter. This is useful when you want to index the largest faces in an image and don't want to index smaller faces, such as those belonging to people standing in the background. The QualityFilter input parameter allows you to filter out detected faces that don’t meet a required quality bar. The quality bar is based on a variety of common use cases. By default, IndexFaces chooses the quality bar that's used to filter faces. You can also explicitly choose the quality bar. Use QualityFilter, to set the quality bar by specifying LOW, MEDIUM, or HIGH. If you do not want to filter detected faces, specify NONE.   To use quality filtering, you need a collection associated with version 3 of the face model or higher. To get the version of the face model associated with a collection, call DescribeCollection.   Information about faces detected in an image, but not indexed, is returned in an array of UnindexedFace objects, UnindexedFaces. Faces aren't indexed for reasons such as:   The number of faces detected exceeds the value of the MaxFaces request parameter.   The face is too small compared to the image dimensions.   The face is too blurry.   The image is too dark.   The face has an extreme pose.   The face doesn’t have enough detail to be suitable for face search.   In response, the IndexFaces operation returns an array of metadata for all detected faces, FaceRecords. This includes:    The bounding box, BoundingBox, of the detected face.    A confidence value, Confidence, which indicates the confidence that the bounding box contains a face.   A face ID, FaceId, assigned by the service for each face that's detected and stored.   An image ID, ImageId, assigned by the service for the input image.   If you request ALL or specific facial attributes (e.g., FACE_OCCLUDED) by using the detectionAttributes parameter, Amazon Rekognition returns detailed facial attributes, such as facial landmarks (for example, location of eye and mouth), facial occlusion, and other facial attributes. If you provide the same image, specify the same collection, and use the same external ID in the IndexFaces operation, Amazon Rekognition doesn't save duplicate face metadata.  The input image is passed either as base64-encoded image bytes, or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes isn't supported. The image must be formatted as a PNG or JPEG file.  This operation requires permissions to perform the rekognition:IndexFaces action.
   */
  indexFaces(callback?: (err: AWSError, data: Rekognition.Types.IndexFacesResponse) => void): Request<Rekognition.Types.IndexFacesResponse, AWSError>;
  /**
   * Returns list of collection IDs in your account. If the result is truncated, the response also provides a NextToken that you can use in the subsequent request to fetch the next set of collection IDs. For an example, see Listing collections in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:ListCollections action.
   */
  listCollections(params: Rekognition.Types.ListCollectionsRequest, callback?: (err: AWSError, data: Rekognition.Types.ListCollectionsResponse) => void): Request<Rekognition.Types.ListCollectionsResponse, AWSError>;
  /**
   * Returns list of collection IDs in your account. If the result is truncated, the response also provides a NextToken that you can use in the subsequent request to fetch the next set of collection IDs. For an example, see Listing collections in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:ListCollections action.
   */
  listCollections(callback?: (err: AWSError, data: Rekognition.Types.ListCollectionsResponse) => void): Request<Rekognition.Types.ListCollectionsResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.   Lists the entries (images) within a dataset. An entry is a JSON Line that contains the information for a single image, including the image location, assigned labels, and object location bounding boxes. For more information, see Creating a manifest file. JSON Lines in the response include information about non-terminal errors found in the dataset. Non terminal errors are reported in errors lists within each JSON Line. The same information is reported in the training and testing validation result manifests that Amazon Rekognition Custom Labels creates during model training.  You can filter the response in variety of ways, such as choosing which labels to return and returning JSON Lines created after a specific date.  This operation requires permissions to perform the rekognition:ListDatasetEntries action.
   */
  listDatasetEntries(params: Rekognition.Types.ListDatasetEntriesRequest, callback?: (err: AWSError, data: Rekognition.Types.ListDatasetEntriesResponse) => void): Request<Rekognition.Types.ListDatasetEntriesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.   Lists the entries (images) within a dataset. An entry is a JSON Line that contains the information for a single image, including the image location, assigned labels, and object location bounding boxes. For more information, see Creating a manifest file. JSON Lines in the response include information about non-terminal errors found in the dataset. Non terminal errors are reported in errors lists within each JSON Line. The same information is reported in the training and testing validation result manifests that Amazon Rekognition Custom Labels creates during model training.  You can filter the response in variety of ways, such as choosing which labels to return and returning JSON Lines created after a specific date.  This operation requires permissions to perform the rekognition:ListDatasetEntries action.
   */
  listDatasetEntries(callback?: (err: AWSError, data: Rekognition.Types.ListDatasetEntriesResponse) => void): Request<Rekognition.Types.ListDatasetEntriesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Lists the labels in a dataset. Amazon Rekognition Custom Labels uses labels to describe images. For more information, see Labeling images.   Lists the labels in a dataset. Amazon Rekognition Custom Labels uses labels to describe images. For more information, see Labeling images in the Amazon Rekognition Custom Labels Developer Guide. 
   */
  listDatasetLabels(params: Rekognition.Types.ListDatasetLabelsRequest, callback?: (err: AWSError, data: Rekognition.Types.ListDatasetLabelsResponse) => void): Request<Rekognition.Types.ListDatasetLabelsResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Lists the labels in a dataset. Amazon Rekognition Custom Labels uses labels to describe images. For more information, see Labeling images.   Lists the labels in a dataset. Amazon Rekognition Custom Labels uses labels to describe images. For more information, see Labeling images in the Amazon Rekognition Custom Labels Developer Guide. 
   */
  listDatasetLabels(callback?: (err: AWSError, data: Rekognition.Types.ListDatasetLabelsResponse) => void): Request<Rekognition.Types.ListDatasetLabelsResponse, AWSError>;
  /**
   * Returns metadata for faces in the specified collection. This metadata includes information such as the bounding box coordinates, the confidence (that the bounding box contains a face), and face ID. For an example, see Listing Faces in a Collection in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:ListFaces action.
   */
  listFaces(params: Rekognition.Types.ListFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.ListFacesResponse) => void): Request<Rekognition.Types.ListFacesResponse, AWSError>;
  /**
   * Returns metadata for faces in the specified collection. This metadata includes information such as the bounding box coordinates, the confidence (that the bounding box contains a face), and face ID. For an example, see Listing Faces in a Collection in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:ListFaces action.
   */
  listFaces(callback?: (err: AWSError, data: Rekognition.Types.ListFacesResponse) => void): Request<Rekognition.Types.ListFacesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Gets a list of the project policies attached to a project. To attach a project policy to a project, call PutProjectPolicy. To remove a project policy from a project, call DeleteProjectPolicy. This operation requires permissions to perform the rekognition:ListProjectPolicies action.
   */
  listProjectPolicies(params: Rekognition.Types.ListProjectPoliciesRequest, callback?: (err: AWSError, data: Rekognition.Types.ListProjectPoliciesResponse) => void): Request<Rekognition.Types.ListProjectPoliciesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Gets a list of the project policies attached to a project. To attach a project policy to a project, call PutProjectPolicy. To remove a project policy from a project, call DeleteProjectPolicy. This operation requires permissions to perform the rekognition:ListProjectPolicies action.
   */
  listProjectPolicies(callback?: (err: AWSError, data: Rekognition.Types.ListProjectPoliciesResponse) => void): Request<Rekognition.Types.ListProjectPoliciesResponse, AWSError>;
  /**
   * Gets a list of stream processors that you have created with CreateStreamProcessor. 
   */
  listStreamProcessors(params: Rekognition.Types.ListStreamProcessorsRequest, callback?: (err: AWSError, data: Rekognition.Types.ListStreamProcessorsResponse) => void): Request<Rekognition.Types.ListStreamProcessorsResponse, AWSError>;
  /**
   * Gets a list of stream processors that you have created with CreateStreamProcessor. 
   */
  listStreamProcessors(callback?: (err: AWSError, data: Rekognition.Types.ListStreamProcessorsResponse) => void): Request<Rekognition.Types.ListStreamProcessorsResponse, AWSError>;
  /**
   *  Returns a list of tags in an Amazon Rekognition collection, stream processor, or Custom Labels model.  This operation requires permissions to perform the rekognition:ListTagsForResource action. 
   */
  listTagsForResource(params: Rekognition.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Rekognition.Types.ListTagsForResourceResponse) => void): Request<Rekognition.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns a list of tags in an Amazon Rekognition collection, stream processor, or Custom Labels model.  This operation requires permissions to perform the rekognition:ListTagsForResource action. 
   */
  listTagsForResource(callback?: (err: AWSError, data: Rekognition.Types.ListTagsForResourceResponse) => void): Request<Rekognition.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns metadata of the User such as UserID in the specified collection. Anonymous User (to reserve faces without any identity) is not returned as part of this request. The results are sorted by system generated primary key ID. If the response is truncated, NextToken is returned in the response that can be used in the subsequent request to retrieve the next set of identities.
   */
  listUsers(params: Rekognition.Types.ListUsersRequest, callback?: (err: AWSError, data: Rekognition.Types.ListUsersResponse) => void): Request<Rekognition.Types.ListUsersResponse, AWSError>;
  /**
   * Returns metadata of the User such as UserID in the specified collection. Anonymous User (to reserve faces without any identity) is not returned as part of this request. The results are sorted by system generated primary key ID. If the response is truncated, NextToken is returned in the response that can be used in the subsequent request to retrieve the next set of identities.
   */
  listUsers(callback?: (err: AWSError, data: Rekognition.Types.ListUsersResponse) => void): Request<Rekognition.Types.ListUsersResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Attaches a project policy to a Amazon Rekognition Custom Labels project in a trusting AWS account. A project policy specifies that a trusted AWS account can copy a model version from a trusting AWS account to a project in the trusted AWS account. To copy a model version you use the CopyProjectVersion operation. Only applies to Custom Labels projects. For more information about the format of a project policy document, see Attaching a project policy (SDK) in the Amazon Rekognition Custom Labels Developer Guide.  The response from PutProjectPolicy is a revision ID for the project policy. You can attach multiple project policies to a project. You can also update an existing project policy by specifying the policy revision ID of the existing policy. To remove a project policy from a project, call DeleteProjectPolicy. To get a list of project policies attached to a project, call ListProjectPolicies.  You copy a model version by calling CopyProjectVersion. This operation requires permissions to perform the rekognition:PutProjectPolicy action.
   */
  putProjectPolicy(params: Rekognition.Types.PutProjectPolicyRequest, callback?: (err: AWSError, data: Rekognition.Types.PutProjectPolicyResponse) => void): Request<Rekognition.Types.PutProjectPolicyResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Attaches a project policy to a Amazon Rekognition Custom Labels project in a trusting AWS account. A project policy specifies that a trusted AWS account can copy a model version from a trusting AWS account to a project in the trusted AWS account. To copy a model version you use the CopyProjectVersion operation. Only applies to Custom Labels projects. For more information about the format of a project policy document, see Attaching a project policy (SDK) in the Amazon Rekognition Custom Labels Developer Guide.  The response from PutProjectPolicy is a revision ID for the project policy. You can attach multiple project policies to a project. You can also update an existing project policy by specifying the policy revision ID of the existing policy. To remove a project policy from a project, call DeleteProjectPolicy. To get a list of project policies attached to a project, call ListProjectPolicies.  You copy a model version by calling CopyProjectVersion. This operation requires permissions to perform the rekognition:PutProjectPolicy action.
   */
  putProjectPolicy(callback?: (err: AWSError, data: Rekognition.Types.PutProjectPolicyResponse) => void): Request<Rekognition.Types.PutProjectPolicyResponse, AWSError>;
  /**
   * Returns an array of celebrities recognized in the input image. For more information, see Recognizing celebrities in the Amazon Rekognition Developer Guide.   RecognizeCelebrities returns the 64 largest faces in the image. It lists the recognized celebrities in the CelebrityFaces array and any unrecognized faces in the UnrecognizedFaces array. RecognizeCelebrities doesn't return celebrities whose faces aren't among the largest 64 faces in the image. For each celebrity recognized, RecognizeCelebrities returns a Celebrity object. The Celebrity object contains the celebrity name, ID, URL links to additional information, match confidence, and a ComparedFace object that you can use to locate the celebrity's face on the image. Amazon Rekognition doesn't retain information about which images a celebrity has been recognized in. Your application must store this information and use the Celebrity ID property as a unique identifier for the celebrity. If you don't store the celebrity name or additional information URLs returned by RecognizeCelebrities, you will need the ID to identify the celebrity in a call to the GetCelebrityInfo operation. You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.  For an example, see Recognizing celebrities in an image in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:RecognizeCelebrities operation.
   */
  recognizeCelebrities(params: Rekognition.Types.RecognizeCelebritiesRequest, callback?: (err: AWSError, data: Rekognition.Types.RecognizeCelebritiesResponse) => void): Request<Rekognition.Types.RecognizeCelebritiesResponse, AWSError>;
  /**
   * Returns an array of celebrities recognized in the input image. For more information, see Recognizing celebrities in the Amazon Rekognition Developer Guide.   RecognizeCelebrities returns the 64 largest faces in the image. It lists the recognized celebrities in the CelebrityFaces array and any unrecognized faces in the UnrecognizedFaces array. RecognizeCelebrities doesn't return celebrities whose faces aren't among the largest 64 faces in the image. For each celebrity recognized, RecognizeCelebrities returns a Celebrity object. The Celebrity object contains the celebrity name, ID, URL links to additional information, match confidence, and a ComparedFace object that you can use to locate the celebrity's face on the image. Amazon Rekognition doesn't retain information about which images a celebrity has been recognized in. Your application must store this information and use the Celebrity ID property as a unique identifier for the celebrity. If you don't store the celebrity name or additional information URLs returned by RecognizeCelebrities, you will need the ID to identify the celebrity in a call to the GetCelebrityInfo operation. You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.  For an example, see Recognizing celebrities in an image in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:RecognizeCelebrities operation.
   */
  recognizeCelebrities(callback?: (err: AWSError, data: Rekognition.Types.RecognizeCelebritiesResponse) => void): Request<Rekognition.Types.RecognizeCelebritiesResponse, AWSError>;
  /**
   * For a given input face ID, searches for matching faces in the collection the face belongs to. You get a face ID when you add a face to the collection using the IndexFaces operation. The operation compares the features of the input face with faces in the specified collection.   You can also search faces without indexing faces by using the SearchFacesByImage operation.   The operation response returns an array of faces that match, ordered by similarity score with the highest similarity first. More specifically, it is an array of metadata for each face match that is found. Along with the metadata, the response also includes a confidence value for each face match, indicating the confidence that the specific face matches the input face.  For an example, see Searching for a face using its face ID in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:SearchFaces action.
   */
  searchFaces(params: Rekognition.Types.SearchFacesRequest, callback?: (err: AWSError, data: Rekognition.Types.SearchFacesResponse) => void): Request<Rekognition.Types.SearchFacesResponse, AWSError>;
  /**
   * For a given input face ID, searches for matching faces in the collection the face belongs to. You get a face ID when you add a face to the collection using the IndexFaces operation. The operation compares the features of the input face with faces in the specified collection.   You can also search faces without indexing faces by using the SearchFacesByImage operation.   The operation response returns an array of faces that match, ordered by similarity score with the highest similarity first. More specifically, it is an array of metadata for each face match that is found. Along with the metadata, the response also includes a confidence value for each face match, indicating the confidence that the specific face matches the input face.  For an example, see Searching for a face using its face ID in the Amazon Rekognition Developer Guide. This operation requires permissions to perform the rekognition:SearchFaces action.
   */
  searchFaces(callback?: (err: AWSError, data: Rekognition.Types.SearchFacesResponse) => void): Request<Rekognition.Types.SearchFacesResponse, AWSError>;
  /**
   * For a given input image, first detects the largest face in the image, and then searches the specified collection for matching faces. The operation compares the features of the input face with faces in the specified collection.   To search for all faces in an input image, you might first call the IndexFaces operation, and then use the face IDs returned in subsequent calls to the SearchFaces operation.   You can also call the DetectFaces operation and use the bounding boxes in the response to make face crops, which then you can pass in to the SearchFacesByImage operation.   You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   The response returns an array of faces that match, ordered by similarity score with the highest similarity first. More specifically, it is an array of metadata for each face match found. Along with the metadata, the response also includes a similarity indicating how similar the face is to the input face. In the response, the operation also returns the bounding box (and a confidence level that the bounding box contains a face) of the face that Amazon Rekognition used for the input image.  If no faces are detected in the input image, SearchFacesByImage returns an InvalidParameterException error.  For an example, Searching for a Face Using an Image in the Amazon Rekognition Developer Guide. The QualityFilter input parameter allows you to filter out detected faces that don’t meet a required quality bar. The quality bar is based on a variety of common use cases. Use QualityFilter to set the quality bar for filtering by specifying LOW, MEDIUM, or HIGH. If you do not want to filter detected faces, specify NONE. The default value is NONE.  To use quality filtering, you need a collection associated with version 3 of the face model or higher. To get the version of the face model associated with a collection, call DescribeCollection.   This operation requires permissions to perform the rekognition:SearchFacesByImage action.
   */
  searchFacesByImage(params: Rekognition.Types.SearchFacesByImageRequest, callback?: (err: AWSError, data: Rekognition.Types.SearchFacesByImageResponse) => void): Request<Rekognition.Types.SearchFacesByImageResponse, AWSError>;
  /**
   * For a given input image, first detects the largest face in the image, and then searches the specified collection for matching faces. The operation compares the features of the input face with faces in the specified collection.   To search for all faces in an input image, you might first call the IndexFaces operation, and then use the face IDs returned in subsequent calls to the SearchFaces operation.   You can also call the DetectFaces operation and use the bounding boxes in the response to make face crops, which then you can pass in to the SearchFacesByImage operation.   You pass the input image either as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.   The response returns an array of faces that match, ordered by similarity score with the highest similarity first. More specifically, it is an array of metadata for each face match found. Along with the metadata, the response also includes a similarity indicating how similar the face is to the input face. In the response, the operation also returns the bounding box (and a confidence level that the bounding box contains a face) of the face that Amazon Rekognition used for the input image.  If no faces are detected in the input image, SearchFacesByImage returns an InvalidParameterException error.  For an example, Searching for a Face Using an Image in the Amazon Rekognition Developer Guide. The QualityFilter input parameter allows you to filter out detected faces that don’t meet a required quality bar. The quality bar is based on a variety of common use cases. Use QualityFilter to set the quality bar for filtering by specifying LOW, MEDIUM, or HIGH. If you do not want to filter detected faces, specify NONE. The default value is NONE.  To use quality filtering, you need a collection associated with version 3 of the face model or higher. To get the version of the face model associated with a collection, call DescribeCollection.   This operation requires permissions to perform the rekognition:SearchFacesByImage action.
   */
  searchFacesByImage(callback?: (err: AWSError, data: Rekognition.Types.SearchFacesByImageResponse) => void): Request<Rekognition.Types.SearchFacesByImageResponse, AWSError>;
  /**
   * Searches for UserIDs within a collection based on a FaceId or UserId. This API can be used to find the closest UserID (with a highest similarity) to associate a face. The request must be provided with either FaceId or UserId. The operation returns an array of UserID that match the FaceId or UserId, ordered by similarity score with the highest similarity first. 
   */
  searchUsers(params: Rekognition.Types.SearchUsersRequest, callback?: (err: AWSError, data: Rekognition.Types.SearchUsersResponse) => void): Request<Rekognition.Types.SearchUsersResponse, AWSError>;
  /**
   * Searches for UserIDs within a collection based on a FaceId or UserId. This API can be used to find the closest UserID (with a highest similarity) to associate a face. The request must be provided with either FaceId or UserId. The operation returns an array of UserID that match the FaceId or UserId, ordered by similarity score with the highest similarity first. 
   */
  searchUsers(callback?: (err: AWSError, data: Rekognition.Types.SearchUsersResponse) => void): Request<Rekognition.Types.SearchUsersResponse, AWSError>;
  /**
   * Searches for UserIDs using a supplied image. It first detects the largest face in the image, and then searches a specified collection for matching UserIDs.  The operation returns an array of UserIDs that match the face in the supplied image, ordered by similarity score with the highest similarity first. It also returns a bounding box for the face found in the input image.  Information about faces detected in the supplied image, but not used for the search, is returned in an array of UnsearchedFace objects. If no valid face is detected in the image, the response will contain an empty UserMatches list and no SearchedFace object. 
   */
  searchUsersByImage(params: Rekognition.Types.SearchUsersByImageRequest, callback?: (err: AWSError, data: Rekognition.Types.SearchUsersByImageResponse) => void): Request<Rekognition.Types.SearchUsersByImageResponse, AWSError>;
  /**
   * Searches for UserIDs using a supplied image. It first detects the largest face in the image, and then searches a specified collection for matching UserIDs.  The operation returns an array of UserIDs that match the face in the supplied image, ordered by similarity score with the highest similarity first. It also returns a bounding box for the face found in the input image.  Information about faces detected in the supplied image, but not used for the search, is returned in an array of UnsearchedFace objects. If no valid face is detected in the image, the response will contain an empty UserMatches list and no SearchedFace object. 
   */
  searchUsersByImage(callback?: (err: AWSError, data: Rekognition.Types.SearchUsersByImageResponse) => void): Request<Rekognition.Types.SearchUsersByImageResponse, AWSError>;
  /**
   * Starts asynchronous recognition of celebrities in a stored video. Amazon Rekognition Video can detect celebrities in a video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartCelebrityRecognition returns a job identifier (JobId) which you use to get the results of the analysis. When celebrity recognition analysis is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the celebrity recognition analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetCelebrityRecognition and pass the job identifier (JobId) from the initial call to StartCelebrityRecognition.  For more information, see Recognizing celebrities in the Amazon Rekognition Developer Guide.
   */
  startCelebrityRecognition(params: Rekognition.Types.StartCelebrityRecognitionRequest, callback?: (err: AWSError, data: Rekognition.Types.StartCelebrityRecognitionResponse) => void): Request<Rekognition.Types.StartCelebrityRecognitionResponse, AWSError>;
  /**
   * Starts asynchronous recognition of celebrities in a stored video. Amazon Rekognition Video can detect celebrities in a video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartCelebrityRecognition returns a job identifier (JobId) which you use to get the results of the analysis. When celebrity recognition analysis is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the celebrity recognition analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetCelebrityRecognition and pass the job identifier (JobId) from the initial call to StartCelebrityRecognition.  For more information, see Recognizing celebrities in the Amazon Rekognition Developer Guide.
   */
  startCelebrityRecognition(callback?: (err: AWSError, data: Rekognition.Types.StartCelebrityRecognitionResponse) => void): Request<Rekognition.Types.StartCelebrityRecognitionResponse, AWSError>;
  /**
   *  Starts asynchronous detection of inappropriate, unwanted, or offensive content in a stored video. For a list of moderation labels in Amazon Rekognition, see Using the image and video moderation APIs. Amazon Rekognition Video can moderate content in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartContentModeration returns a job identifier (JobId) which you use to get the results of the analysis. When content analysis is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the content analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetContentModeration and pass the job identifier (JobId) from the initial call to StartContentModeration.  For more information, see Moderating content in the Amazon Rekognition Developer Guide.
   */
  startContentModeration(params: Rekognition.Types.StartContentModerationRequest, callback?: (err: AWSError, data: Rekognition.Types.StartContentModerationResponse) => void): Request<Rekognition.Types.StartContentModerationResponse, AWSError>;
  /**
   *  Starts asynchronous detection of inappropriate, unwanted, or offensive content in a stored video. For a list of moderation labels in Amazon Rekognition, see Using the image and video moderation APIs. Amazon Rekognition Video can moderate content in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartContentModeration returns a job identifier (JobId) which you use to get the results of the analysis. When content analysis is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the content analysis, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetContentModeration and pass the job identifier (JobId) from the initial call to StartContentModeration.  For more information, see Moderating content in the Amazon Rekognition Developer Guide.
   */
  startContentModeration(callback?: (err: AWSError, data: Rekognition.Types.StartContentModerationResponse) => void): Request<Rekognition.Types.StartContentModerationResponse, AWSError>;
  /**
   * Starts asynchronous detection of faces in a stored video. Amazon Rekognition Video can detect faces in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartFaceDetection returns a job identifier (JobId) that you use to get the results of the operation. When face detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the face detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceDetection and pass the job identifier (JobId) from the initial call to StartFaceDetection. For more information, see Detecting faces in a stored video in the Amazon Rekognition Developer Guide.
   */
  startFaceDetection(params: Rekognition.Types.StartFaceDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.StartFaceDetectionResponse) => void): Request<Rekognition.Types.StartFaceDetectionResponse, AWSError>;
  /**
   * Starts asynchronous detection of faces in a stored video. Amazon Rekognition Video can detect faces in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartFaceDetection returns a job identifier (JobId) that you use to get the results of the operation. When face detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the face detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceDetection and pass the job identifier (JobId) from the initial call to StartFaceDetection. For more information, see Detecting faces in a stored video in the Amazon Rekognition Developer Guide.
   */
  startFaceDetection(callback?: (err: AWSError, data: Rekognition.Types.StartFaceDetectionResponse) => void): Request<Rekognition.Types.StartFaceDetectionResponse, AWSError>;
  /**
   * Starts the asynchronous search for faces in a collection that match the faces of persons detected in a stored video. The video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartFaceSearch returns a job identifier (JobId) which you use to get the search results once the search has completed. When searching is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the search results, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceSearch and pass the job identifier (JobId) from the initial call to StartFaceSearch. For more information, see Searching stored videos for faces. 
   */
  startFaceSearch(params: Rekognition.Types.StartFaceSearchRequest, callback?: (err: AWSError, data: Rekognition.Types.StartFaceSearchResponse) => void): Request<Rekognition.Types.StartFaceSearchResponse, AWSError>;
  /**
   * Starts the asynchronous search for faces in a collection that match the faces of persons detected in a stored video. The video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartFaceSearch returns a job identifier (JobId) which you use to get the search results once the search has completed. When searching is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the search results, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetFaceSearch and pass the job identifier (JobId) from the initial call to StartFaceSearch. For more information, see Searching stored videos for faces. 
   */
  startFaceSearch(callback?: (err: AWSError, data: Rekognition.Types.StartFaceSearchResponse) => void): Request<Rekognition.Types.StartFaceSearchResponse, AWSError>;
  /**
   * Starts asynchronous detection of labels in a stored video. Amazon Rekognition Video can detect labels in a video. Labels are instances of real-world entities. This includes objects like flower, tree, and table; events like wedding, graduation, and birthday party; concepts like landscape, evening, and nature; and activities like a person getting out of a car or a person skiing. The video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartLabelDetection returns a job identifier (JobId) which you use to get the results of the operation. When label detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the label detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLabelDetection and pass the job identifier (JobId) from the initial call to StartLabelDetection.  Optional Parameters   StartLabelDetection has the GENERAL_LABELS Feature applied by default. This feature allows you to provide filtering criteria to the Settings parameter. You can filter with sets of individual labels or with label categories. You can specify inclusive filters, exclusive filters, or a combination of inclusive and exclusive filters. For more information on filtering, see Detecting labels in a video. You can specify MinConfidence to control the confidence threshold for the labels returned. The default is 50.
   */
  startLabelDetection(params: Rekognition.Types.StartLabelDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.StartLabelDetectionResponse) => void): Request<Rekognition.Types.StartLabelDetectionResponse, AWSError>;
  /**
   * Starts asynchronous detection of labels in a stored video. Amazon Rekognition Video can detect labels in a video. Labels are instances of real-world entities. This includes objects like flower, tree, and table; events like wedding, graduation, and birthday party; concepts like landscape, evening, and nature; and activities like a person getting out of a car or a person skiing. The video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartLabelDetection returns a job identifier (JobId) which you use to get the results of the operation. When label detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the label detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetLabelDetection and pass the job identifier (JobId) from the initial call to StartLabelDetection.  Optional Parameters   StartLabelDetection has the GENERAL_LABELS Feature applied by default. This feature allows you to provide filtering criteria to the Settings parameter. You can filter with sets of individual labels or with label categories. You can specify inclusive filters, exclusive filters, or a combination of inclusive and exclusive filters. For more information on filtering, see Detecting labels in a video. You can specify MinConfidence to control the confidence threshold for the labels returned. The default is 50.
   */
  startLabelDetection(callback?: (err: AWSError, data: Rekognition.Types.StartLabelDetectionResponse) => void): Request<Rekognition.Types.StartLabelDetectionResponse, AWSError>;
  /**
   * Starts the asynchronous tracking of a person's path in a stored video. Amazon Rekognition Video can track the path of people in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartPersonTracking returns a job identifier (JobId) which you use to get the results of the operation. When label detection is finished, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel.  To get the results of the person detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetPersonTracking and pass the job identifier (JobId) from the initial call to StartPersonTracking.
   */
  startPersonTracking(params: Rekognition.Types.StartPersonTrackingRequest, callback?: (err: AWSError, data: Rekognition.Types.StartPersonTrackingResponse) => void): Request<Rekognition.Types.StartPersonTrackingResponse, AWSError>;
  /**
   * Starts the asynchronous tracking of a person's path in a stored video. Amazon Rekognition Video can track the path of people in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartPersonTracking returns a job identifier (JobId) which you use to get the results of the operation. When label detection is finished, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel.  To get the results of the person detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If so, call GetPersonTracking and pass the job identifier (JobId) from the initial call to StartPersonTracking.
   */
  startPersonTracking(callback?: (err: AWSError, data: Rekognition.Types.StartPersonTrackingResponse) => void): Request<Rekognition.Types.StartPersonTrackingResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Starts the running of the version of a model. Starting a model takes a while to complete. To check the current state of the model, use DescribeProjectVersions.  Once the model is running, you can detect custom labels in new images by calling DetectCustomLabels.  You are charged for the amount of time that the model is running. To stop a running model, call StopProjectVersion.  This operation requires permissions to perform the rekognition:StartProjectVersion action.
   */
  startProjectVersion(params: Rekognition.Types.StartProjectVersionRequest, callback?: (err: AWSError, data: Rekognition.Types.StartProjectVersionResponse) => void): Request<Rekognition.Types.StartProjectVersionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Starts the running of the version of a model. Starting a model takes a while to complete. To check the current state of the model, use DescribeProjectVersions.  Once the model is running, you can detect custom labels in new images by calling DetectCustomLabels.  You are charged for the amount of time that the model is running. To stop a running model, call StopProjectVersion.  This operation requires permissions to perform the rekognition:StartProjectVersion action.
   */
  startProjectVersion(callback?: (err: AWSError, data: Rekognition.Types.StartProjectVersionResponse) => void): Request<Rekognition.Types.StartProjectVersionResponse, AWSError>;
  /**
   * Starts asynchronous detection of segment detection in a stored video. Amazon Rekognition Video can detect segments in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartSegmentDetection returns a job identifier (JobId) which you use to get the results of the operation. When segment detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. You can use the Filters (StartSegmentDetectionFilters) input parameter to specify the minimum detection confidence returned in the response. Within Filters, use ShotFilter (StartShotDetectionFilter) to filter detected shots. Use TechnicalCueFilter (StartTechnicalCueDetectionFilter) to filter technical cues.  To get the results of the segment detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetSegmentDetection and pass the job identifier (JobId) from the initial call to StartSegmentDetection.  For more information, see Detecting video segments in stored video in the Amazon Rekognition Developer Guide.
   */
  startSegmentDetection(params: Rekognition.Types.StartSegmentDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.StartSegmentDetectionResponse) => void): Request<Rekognition.Types.StartSegmentDetectionResponse, AWSError>;
  /**
   * Starts asynchronous detection of segment detection in a stored video. Amazon Rekognition Video can detect segments in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartSegmentDetection returns a job identifier (JobId) which you use to get the results of the operation. When segment detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. You can use the Filters (StartSegmentDetectionFilters) input parameter to specify the minimum detection confidence returned in the response. Within Filters, use ShotFilter (StartShotDetectionFilter) to filter detected shots. Use TechnicalCueFilter (StartTechnicalCueDetectionFilter) to filter technical cues.  To get the results of the segment detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetSegmentDetection and pass the job identifier (JobId) from the initial call to StartSegmentDetection.  For more information, see Detecting video segments in stored video in the Amazon Rekognition Developer Guide.
   */
  startSegmentDetection(callback?: (err: AWSError, data: Rekognition.Types.StartSegmentDetectionResponse) => void): Request<Rekognition.Types.StartSegmentDetectionResponse, AWSError>;
  /**
   * Starts processing a stream processor. You create a stream processor by calling CreateStreamProcessor. To tell StartStreamProcessor which stream processor to start, use the value of the Name field specified in the call to CreateStreamProcessor. If you are using a label detection stream processor to detect labels, you need to provide a Start selector and a Stop selector to determine the length of the stream processing time.
   */
  startStreamProcessor(params: Rekognition.Types.StartStreamProcessorRequest, callback?: (err: AWSError, data: Rekognition.Types.StartStreamProcessorResponse) => void): Request<Rekognition.Types.StartStreamProcessorResponse, AWSError>;
  /**
   * Starts processing a stream processor. You create a stream processor by calling CreateStreamProcessor. To tell StartStreamProcessor which stream processor to start, use the value of the Name field specified in the call to CreateStreamProcessor. If you are using a label detection stream processor to detect labels, you need to provide a Start selector and a Stop selector to determine the length of the stream processing time.
   */
  startStreamProcessor(callback?: (err: AWSError, data: Rekognition.Types.StartStreamProcessorResponse) => void): Request<Rekognition.Types.StartStreamProcessorResponse, AWSError>;
  /**
   * Starts asynchronous detection of text in a stored video. Amazon Rekognition Video can detect text in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartTextDetection returns a job identifier (JobId) which you use to get the results of the operation. When text detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the text detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetTextDetection and pass the job identifier (JobId) from the initial call to StartTextDetection. 
   */
  startTextDetection(params: Rekognition.Types.StartTextDetectionRequest, callback?: (err: AWSError, data: Rekognition.Types.StartTextDetectionResponse) => void): Request<Rekognition.Types.StartTextDetectionResponse, AWSError>;
  /**
   * Starts asynchronous detection of text in a stored video. Amazon Rekognition Video can detect text in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and the filename of the video. StartTextDetection returns a job identifier (JobId) which you use to get the results of the operation. When text detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic that you specify in NotificationChannel. To get the results of the text detection operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. if so, call GetTextDetection and pass the job identifier (JobId) from the initial call to StartTextDetection. 
   */
  startTextDetection(callback?: (err: AWSError, data: Rekognition.Types.StartTextDetectionResponse) => void): Request<Rekognition.Types.StartTextDetectionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Stops a running model. The operation might take a while to complete. To check the current status, call DescribeProjectVersions. Only applies to Custom Labels projects. This operation requires permissions to perform the rekognition:StopProjectVersion action.
   */
  stopProjectVersion(params: Rekognition.Types.StopProjectVersionRequest, callback?: (err: AWSError, data: Rekognition.Types.StopProjectVersionResponse) => void): Request<Rekognition.Types.StopProjectVersionResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Stops a running model. The operation might take a while to complete. To check the current status, call DescribeProjectVersions. Only applies to Custom Labels projects. This operation requires permissions to perform the rekognition:StopProjectVersion action.
   */
  stopProjectVersion(callback?: (err: AWSError, data: Rekognition.Types.StopProjectVersionResponse) => void): Request<Rekognition.Types.StopProjectVersionResponse, AWSError>;
  /**
   * Stops a running stream processor that was created by CreateStreamProcessor.
   */
  stopStreamProcessor(params: Rekognition.Types.StopStreamProcessorRequest, callback?: (err: AWSError, data: Rekognition.Types.StopStreamProcessorResponse) => void): Request<Rekognition.Types.StopStreamProcessorResponse, AWSError>;
  /**
   * Stops a running stream processor that was created by CreateStreamProcessor.
   */
  stopStreamProcessor(callback?: (err: AWSError, data: Rekognition.Types.StopStreamProcessorResponse) => void): Request<Rekognition.Types.StopStreamProcessorResponse, AWSError>;
  /**
   *  Adds one or more key-value tags to an Amazon Rekognition collection, stream processor, or Custom Labels model. For more information, see Tagging AWS Resources.  This operation requires permissions to perform the rekognition:TagResource action. 
   */
  tagResource(params: Rekognition.Types.TagResourceRequest, callback?: (err: AWSError, data: Rekognition.Types.TagResourceResponse) => void): Request<Rekognition.Types.TagResourceResponse, AWSError>;
  /**
   *  Adds one or more key-value tags to an Amazon Rekognition collection, stream processor, or Custom Labels model. For more information, see Tagging AWS Resources.  This operation requires permissions to perform the rekognition:TagResource action. 
   */
  tagResource(callback?: (err: AWSError, data: Rekognition.Types.TagResourceResponse) => void): Request<Rekognition.Types.TagResourceResponse, AWSError>;
  /**
   *  Removes one or more tags from an Amazon Rekognition collection, stream processor, or Custom Labels model.  This operation requires permissions to perform the rekognition:UntagResource action. 
   */
  untagResource(params: Rekognition.Types.UntagResourceRequest, callback?: (err: AWSError, data: Rekognition.Types.UntagResourceResponse) => void): Request<Rekognition.Types.UntagResourceResponse, AWSError>;
  /**
   *  Removes one or more tags from an Amazon Rekognition collection, stream processor, or Custom Labels model.  This operation requires permissions to perform the rekognition:UntagResource action. 
   */
  untagResource(callback?: (err: AWSError, data: Rekognition.Types.UntagResourceResponse) => void): Request<Rekognition.Types.UntagResourceResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Adds or updates one or more entries (images) in a dataset. An entry is a JSON Line which contains the information for a single image, including the image location, assigned labels, and object location bounding boxes. For more information, see Image-Level labels in manifest files and Object localization in manifest files in the Amazon Rekognition Custom Labels Developer Guide.  If the source-ref field in the JSON line references an existing image, the existing image in the dataset is updated. If source-ref field doesn't reference an existing image, the image is added as a new image to the dataset.  You specify the changes that you want to make in the Changes input parameter. There isn't a limit to the number JSON Lines that you can change, but the size of Changes must be less than 5MB.  UpdateDatasetEntries returns immediatly, but the dataset update might take a while to complete. Use DescribeDataset to check the current status. The dataset updated successfully if the value of Status is UPDATE_COMPLETE.  To check if any non-terminal errors occured, call ListDatasetEntries and check for the presence of errors lists in the JSON Lines. Dataset update fails if a terminal error occurs (Status = UPDATE_FAILED). Currently, you can't access the terminal error information from the Amazon Rekognition Custom Labels SDK.  This operation requires permissions to perform the rekognition:UpdateDatasetEntries action.
   */
  updateDatasetEntries(params: Rekognition.Types.UpdateDatasetEntriesRequest, callback?: (err: AWSError, data: Rekognition.Types.UpdateDatasetEntriesResponse) => void): Request<Rekognition.Types.UpdateDatasetEntriesResponse, AWSError>;
  /**
   *  This operation applies only to Amazon Rekognition Custom Labels.  Adds or updates one or more entries (images) in a dataset. An entry is a JSON Line which contains the information for a single image, including the image location, assigned labels, and object location bounding boxes. For more information, see Image-Level labels in manifest files and Object localization in manifest files in the Amazon Rekognition Custom Labels Developer Guide.  If the source-ref field in the JSON line references an existing image, the existing image in the dataset is updated. If source-ref field doesn't reference an existing image, the image is added as a new image to the dataset.  You specify the changes that you want to make in the Changes input parameter. There isn't a limit to the number JSON Lines that you can change, but the size of Changes must be less than 5MB.  UpdateDatasetEntries returns immediatly, but the dataset update might take a while to complete. Use DescribeDataset to check the current status. The dataset updated successfully if the value of Status is UPDATE_COMPLETE.  To check if any non-terminal errors occured, call ListDatasetEntries and check for the presence of errors lists in the JSON Lines. Dataset update fails if a terminal error occurs (Status = UPDATE_FAILED). Currently, you can't access the terminal error information from the Amazon Rekognition Custom Labels SDK.  This operation requires permissions to perform the rekognition:UpdateDatasetEntries action.
   */
  updateDatasetEntries(callback?: (err: AWSError, data: Rekognition.Types.UpdateDatasetEntriesResponse) => void): Request<Rekognition.Types.UpdateDatasetEntriesResponse, AWSError>;
  /**
   *  Allows you to update a stream processor. You can change some settings and regions of interest and delete certain parameters. 
   */
  updateStreamProcessor(params: Rekognition.Types.UpdateStreamProcessorRequest, callback?: (err: AWSError, data: Rekognition.Types.UpdateStreamProcessorResponse) => void): Request<Rekognition.Types.UpdateStreamProcessorResponse, AWSError>;
  /**
   *  Allows you to update a stream processor. You can change some settings and regions of interest and delete certain parameters. 
   */
  updateStreamProcessor(callback?: (err: AWSError, data: Rekognition.Types.UpdateStreamProcessorResponse) => void): Request<Rekognition.Types.UpdateStreamProcessorResponse, AWSError>;
  /**
   * Waits for the projectVersionTrainingCompleted state by periodically calling the underlying Rekognition.describeProjectVersionsoperation every 120 seconds (at most 360 times). Wait until the ProjectVersion training completes.
   */
  waitFor(state: "projectVersionTrainingCompleted", params: Rekognition.Types.DescribeProjectVersionsRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectVersionsResponse) => void): Request<Rekognition.Types.DescribeProjectVersionsResponse, AWSError>;
  /**
   * Waits for the projectVersionTrainingCompleted state by periodically calling the underlying Rekognition.describeProjectVersionsoperation every 120 seconds (at most 360 times). Wait until the ProjectVersion training completes.
   */
  waitFor(state: "projectVersionTrainingCompleted", callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectVersionsResponse) => void): Request<Rekognition.Types.DescribeProjectVersionsResponse, AWSError>;
  /**
   * Waits for the projectVersionRunning state by periodically calling the underlying Rekognition.describeProjectVersionsoperation every 30 seconds (at most 40 times). Wait until the ProjectVersion is running.
   */
  waitFor(state: "projectVersionRunning", params: Rekognition.Types.DescribeProjectVersionsRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectVersionsResponse) => void): Request<Rekognition.Types.DescribeProjectVersionsResponse, AWSError>;
  /**
   * Waits for the projectVersionRunning state by periodically calling the underlying Rekognition.describeProjectVersionsoperation every 30 seconds (at most 40 times). Wait until the ProjectVersion is running.
   */
  waitFor(state: "projectVersionRunning", callback?: (err: AWSError, data: Rekognition.Types.DescribeProjectVersionsResponse) => void): Request<Rekognition.Types.DescribeProjectVersionsResponse, AWSError>;
}
declare namespace Rekognition {
  export interface AgeRange {
    /**
     * The lowest estimated age.
     */
    Low?: UInteger;
    /**
     * The highest estimated age.
     */
    High?: UInteger;
  }
  export interface Asset {
    GroundTruthManifest?: GroundTruthManifest;
  }
  export type Assets = Asset[];
  export interface AssociateFacesRequest {
    /**
     * The ID of an existing collection containing the UserID.
     */
    CollectionId: CollectionId;
    /**
     * The ID for the existing UserID.
     */
    UserId: UserId;
    /**
     * An array of FaceIDs to associate with the UserID.
     */
    FaceIds: UserFaceIdList;
    /**
     * An optional value specifying the minimum confidence in the UserID match to return. The default value is 75.
     */
    UserMatchThreshold?: Percent;
    /**
     * Idempotent token used to identify the request to AssociateFaces. If you use the same token with multiple AssociateFaces requests, the same response is returned. Use ClientRequestToken to prevent the same request from being processed more than once.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface AssociateFacesResponse {
    /**
     * An array of AssociatedFace objects containing FaceIDs that are successfully associated with the UserID is returned. Returned if the AssociateFaces action is successful.
     */
    AssociatedFaces?: AssociatedFacesList;
    /**
     * An array of UnsuccessfulAssociation objects containing FaceIDs that are not successfully associated along with the reasons. Returned if the AssociateFaces action is successful.
     */
    UnsuccessfulFaceAssociations?: UnsuccessfulFaceAssociationList;
    /**
     * The status of an update made to a UserID. Reflects if the UserID has been updated for every requested change.
     */
    UserStatus?: UserStatus;
  }
  export interface AssociatedFace {
    /**
     * Unique identifier assigned to the face.
     */
    FaceId?: FaceId;
  }
  export type AssociatedFacesList = AssociatedFace[];
  export type Attribute = "DEFAULT"|"ALL"|"AGE_RANGE"|"BEARD"|"EMOTIONS"|"EYE_DIRECTION"|"EYEGLASSES"|"EYES_OPEN"|"GENDER"|"MOUTH_OPEN"|"MUSTACHE"|"FACE_OCCLUDED"|"SMILE"|"SUNGLASSES"|string;
  export type Attributes = Attribute[];
  export interface AudioMetadata {
    /**
     * The audio codec used to encode or decode the audio stream. 
     */
    Codec?: String;
    /**
     * The duration of the audio stream in milliseconds.
     */
    DurationMillis?: ULong;
    /**
     * The sample rate for the audio stream.
     */
    SampleRate?: ULong;
    /**
     * The number of audio channels in the segment.
     */
    NumberOfChannels?: ULong;
  }
  export type AudioMetadataList = AudioMetadata[];
  export interface AuditImage {
    /**
     * The Base64-encoded bytes representing an image selected from the Face Liveness video and returned for audit purposes.
     */
    Bytes?: LivenessImageBlob;
    S3Object?: S3Object;
    BoundingBox?: BoundingBox;
  }
  export type AuditImages = AuditImage[];
  export type AuditImagesLimit = number;
  export interface Beard {
    /**
     * Boolean value that indicates whether the face has beard or not.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export interface BlackFrame {
    /**
     *  A threshold used to determine the maximum luminance value for a pixel to be considered black. In a full color range video, luminance values range from 0-255. A pixel value of 0 is pure black, and the most strict filter. The maximum black pixel value is computed as follows: max_black_pixel_value = minimum_luminance + MaxPixelThreshold *luminance_range.  For example, for a full range video with BlackPixelThreshold = 0.1, max_black_pixel_value is 0 + 0.1 * (255-0) = 25.5. The default value of MaxPixelThreshold is 0.2, which maps to a max_black_pixel_value of 51 for a full range video. You can lower this threshold to be more strict on black levels.
     */
    MaxPixelThreshold?: MaxPixelThreshold;
    /**
     *  The minimum percentage of pixels in a frame that need to have a luminance below the max_black_pixel_value for a frame to be considered a black frame. Luminance is calculated using the BT.709 matrix.  The default value is 99, which means at least 99% of all pixels in the frame are black pixels as per the MaxPixelThreshold set. You can reduce this value to allow more noise on the black frame.
     */
    MinCoveragePercentage?: MinCoveragePercentage;
  }
  export type BodyPart = "FACE"|"HEAD"|"LEFT_HAND"|"RIGHT_HAND"|string;
  export type BodyParts = ProtectiveEquipmentBodyPart[];
  export type Boolean = boolean;
  export interface BoundingBox {
    /**
     * Width of the bounding box as a ratio of the overall image width.
     */
    Width?: Float;
    /**
     * Height of the bounding box as a ratio of the overall image height.
     */
    Height?: Float;
    /**
     * Left coordinate of the bounding box as a ratio of overall image width.
     */
    Left?: Float;
    /**
     * Top coordinate of the bounding box as a ratio of overall image height.
     */
    Top?: Float;
  }
  export type BoundingBoxHeight = number;
  export type BoundingBoxWidth = number;
  export interface Celebrity {
    /**
     * An array of URLs pointing to additional information about the celebrity. If there is no additional information about the celebrity, this list is empty.
     */
    Urls?: Urls;
    /**
     * The name of the celebrity.
     */
    Name?: String;
    /**
     * A unique identifier for the celebrity. 
     */
    Id?: RekognitionUniqueId;
    /**
     * Provides information about the celebrity's face, such as its location on the image.
     */
    Face?: ComparedFace;
    /**
     * The confidence, in percentage, that Amazon Rekognition has that the recognized face is the celebrity.
     */
    MatchConfidence?: Percent;
    KnownGender?: KnownGender;
  }
  export interface CelebrityDetail {
    /**
     * An array of URLs pointing to additional celebrity information. 
     */
    Urls?: Urls;
    /**
     * The name of the celebrity.
     */
    Name?: String;
    /**
     * The unique identifier for the celebrity. 
     */
    Id?: RekognitionUniqueId;
    /**
     * The confidence, in percentage, that Amazon Rekognition has that the recognized face is the celebrity. 
     */
    Confidence?: Percent;
    /**
     * Bounding box around the body of a celebrity.
     */
    BoundingBox?: BoundingBox;
    /**
     * Face details for the recognized celebrity.
     */
    Face?: FaceDetail;
    /**
     * Retrieves the known gender for the celebrity.
     */
    KnownGender?: KnownGender;
  }
  export type CelebrityList = Celebrity[];
  export interface CelebrityRecognition {
    /**
     * The time, in milliseconds from the start of the video, that the celebrity was recognized. Note that Timestamp is not guaranteed to be accurate to the individual frame where the celebrity first appears.
     */
    Timestamp?: Timestamp;
    /**
     * Information about a recognized celebrity.
     */
    Celebrity?: CelebrityDetail;
  }
  export type CelebrityRecognitionSortBy = "ID"|"TIMESTAMP"|string;
  export type CelebrityRecognitions = CelebrityRecognition[];
  export type ClientRequestToken = string;
  export type CollectionId = string;
  export type CollectionIdList = CollectionId[];
  export interface CompareFacesMatch {
    /**
     * Level of confidence that the faces match.
     */
    Similarity?: Percent;
    /**
     * Provides face metadata (bounding box and confidence that the bounding box actually contains a face).
     */
    Face?: ComparedFace;
  }
  export type CompareFacesMatchList = CompareFacesMatch[];
  export interface CompareFacesRequest {
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes is not supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    SourceImage: Image;
    /**
     * The target image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes is not supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    TargetImage: Image;
    /**
     * The minimum level of confidence in the face matches that a match must meet to be included in the FaceMatches array.
     */
    SimilarityThreshold?: Percent;
    /**
     * A filter that specifies a quality bar for how much filtering is done to identify faces. Filtered faces aren't compared. If you specify AUTO, Amazon Rekognition chooses the quality bar. If you specify LOW, MEDIUM, or HIGH, filtering removes all faces that don’t meet the chosen quality bar. The quality bar is based on a variety of common use cases. Low-quality detections can occur for a number of reasons. Some examples are an object that's misidentified as a face, a face that's too blurry, or a face with a pose that's too extreme to use. If you specify NONE, no filtering is performed. The default value is NONE.  To use quality filtering, the collection you are using must be associated with version 3 of the face model or higher.
     */
    QualityFilter?: QualityFilter;
  }
  export interface CompareFacesResponse {
    /**
     * The face in the source image that was used for comparison.
     */
    SourceImageFace?: ComparedSourceImageFace;
    /**
     * An array of faces in the target image that match the source image face. Each CompareFacesMatch object provides the bounding box, the confidence level that the bounding box contains a face, and the similarity score for the face in the bounding box and the face in the source image.
     */
    FaceMatches?: CompareFacesMatchList;
    /**
     * An array of faces in the target image that did not match the source image face.
     */
    UnmatchedFaces?: CompareFacesUnmatchList;
    /**
     * The value of SourceImageOrientationCorrection is always null. If the input image is in .jpeg format, it might contain exchangeable image file format (Exif) metadata that includes the image's orientation. Amazon Rekognition uses this orientation information to perform image correction. The bounding box coordinates are translated to represent object locations after the orientation information in the Exif metadata is used to correct the image orientation. Images in .png format don't contain Exif metadata. Amazon Rekognition doesn’t perform image correction for images in .png format and .jpeg images without orientation information in the image Exif metadata. The bounding box coordinates aren't translated and represent the object locations before the image is rotated. 
     */
    SourceImageOrientationCorrection?: OrientationCorrection;
    /**
     * The value of TargetImageOrientationCorrection is always null. If the input image is in .jpeg format, it might contain exchangeable image file format (Exif) metadata that includes the image's orientation. Amazon Rekognition uses this orientation information to perform image correction. The bounding box coordinates are translated to represent object locations after the orientation information in the Exif metadata is used to correct the image orientation. Images in .png format don't contain Exif metadata. Amazon Rekognition doesn’t perform image correction for images in .png format and .jpeg images without orientation information in the image Exif metadata. The bounding box coordinates aren't translated and represent the object locations before the image is rotated. 
     */
    TargetImageOrientationCorrection?: OrientationCorrection;
  }
  export type CompareFacesUnmatchList = ComparedFace[];
  export interface ComparedFace {
    /**
     * Bounding box of the face.
     */
    BoundingBox?: BoundingBox;
    /**
     * Level of confidence that what the bounding box contains is a face.
     */
    Confidence?: Percent;
    /**
     * An array of facial landmarks.
     */
    Landmarks?: Landmarks;
    /**
     * Indicates the pose of the face as determined by its pitch, roll, and yaw.
     */
    Pose?: Pose;
    /**
     * Identifies face image brightness and sharpness. 
     */
    Quality?: ImageQuality;
    /**
     *  The emotions that appear to be expressed on the face, and the confidence level in the determination. Valid values include "Happy", "Sad", "Angry", "Confused", "Disgusted", "Surprised", "Calm", "Unknown", and "Fear". 
     */
    Emotions?: Emotions;
    /**
     *  Indicates whether or not the face is smiling, and the confidence level in the determination. 
     */
    Smile?: Smile;
  }
  export type ComparedFaceList = ComparedFace[];
  export interface ComparedSourceImageFace {
    /**
     * Bounding box of the face.
     */
    BoundingBox?: BoundingBox;
    /**
     * Confidence level that the selected bounding box contains a face.
     */
    Confidence?: Percent;
  }
  export type ConnectedHomeLabel = string;
  export type ConnectedHomeLabels = ConnectedHomeLabel[];
  export interface ConnectedHomeSettings {
    /**
     *  Specifies what you want to detect in the video, such as people, packages, or pets. The current valid labels you can include in this list are: "PERSON", "PET", "PACKAGE", and "ALL". 
     */
    Labels: ConnectedHomeLabels;
    /**
     *  The minimum confidence required to label an object in the video. 
     */
    MinConfidence?: Percent;
  }
  export interface ConnectedHomeSettingsForUpdate {
    /**
     *  Specifies what you want to detect in the video, such as people, packages, or pets. The current valid labels you can include in this list are: "PERSON", "PET", "PACKAGE", and "ALL". 
     */
    Labels?: ConnectedHomeLabels;
    /**
     *  The minimum confidence required to label an object in the video. 
     */
    MinConfidence?: Percent;
  }
  export type ContentClassifier = "FreeOfPersonallyIdentifiableInformation"|"FreeOfAdultContent"|string;
  export type ContentClassifiers = ContentClassifier[];
  export type ContentModerationAggregateBy = "TIMESTAMPS"|"SEGMENTS"|string;
  export interface ContentModerationDetection {
    /**
     * Time, in milliseconds from the beginning of the video, that the content moderation label was detected. Note that Timestamp is not guaranteed to be accurate to the individual frame where the moderated content first appears.
     */
    Timestamp?: Timestamp;
    /**
     * The content moderation label detected by in the stored video.
     */
    ModerationLabel?: ModerationLabel;
    /**
     * The time in milliseconds defining the start of the timeline segment containing a continuously detected moderation label.
     */
    StartTimestampMillis?: ULong;
    /**
     *  The time in milliseconds defining the end of the timeline segment containing a continuously detected moderation label. 
     */
    EndTimestampMillis?: ULong;
    /**
     *  The time duration of a segment in milliseconds, I.e. time elapsed from StartTimestampMillis to EndTimestampMillis. 
     */
    DurationMillis?: ULong;
  }
  export type ContentModerationDetections = ContentModerationDetection[];
  export type ContentModerationSortBy = "NAME"|"TIMESTAMP"|string;
  export interface CopyProjectVersionRequest {
    /**
     * The ARN of the source project in the trusting AWS account.
     */
    SourceProjectArn: ProjectArn;
    /**
     * The ARN of the model version in the source project that you want to copy to a destination project.
     */
    SourceProjectVersionArn: ProjectVersionArn;
    /**
     * The ARN of the project in the trusted AWS account that you want to copy the model version to. 
     */
    DestinationProjectArn: ProjectArn;
    /**
     * A name for the version of the model that's copied to the destination project.
     */
    VersionName: VersionName;
    /**
     * The S3 bucket and folder location where the training output for the source model version is placed.
     */
    OutputConfig: OutputConfig;
    /**
     * The key-value tags to assign to the model version. 
     */
    Tags?: TagMap;
    /**
     * The identifier for your AWS Key Management Service key (AWS KMS key). You can supply the Amazon Resource Name (ARN) of your KMS key, the ID of your KMS key, an alias for your KMS key, or an alias ARN. The key is used to encrypt training results and manifest files written to the output Amazon S3 bucket (OutputConfig). If you choose to use your own KMS key, you need the following permissions on the KMS key.   kms:CreateGrant   kms:DescribeKey   kms:GenerateDataKey   kms:Decrypt   If you don't specify a value for KmsKeyId, images copied into the service are encrypted using a key that AWS owns and manages.
     */
    KmsKeyId?: KmsKeyId;
  }
  export interface CopyProjectVersionResponse {
    /**
     * The ARN of the copied model version in the destination project. 
     */
    ProjectVersionArn?: ProjectVersionArn;
  }
  export interface CoversBodyPart {
    /**
     * The confidence that Amazon Rekognition has in the value of Value.
     */
    Confidence?: Percent;
    /**
     * True if the PPE covers the corresponding body part, otherwise false.
     */
    Value?: Boolean;
  }
  export interface CreateCollectionRequest {
    /**
     * ID for the collection that you are creating.
     */
    CollectionId: CollectionId;
    /**
     *  A set of tags (key-value pairs) that you want to attach to the collection. 
     */
    Tags?: TagMap;
  }
  export interface CreateCollectionResponse {
    /**
     * HTTP status code indicating the result of the operation.
     */
    StatusCode?: UInteger;
    /**
     * Amazon Resource Name (ARN) of the collection. You can use this to manage permissions on your resources. 
     */
    CollectionArn?: String;
    /**
     * Version number of the face detection model associated with the collection you are creating.
     */
    FaceModelVersion?: String;
  }
  export interface CreateDatasetRequest {
    /**
     *  The source files for the dataset. You can specify the ARN of an existing dataset or specify the Amazon S3 bucket location of an Amazon Sagemaker format manifest file. If you don't specify datasetSource, an empty dataset is created. To add labeled images to the dataset, You can use the console or call UpdateDatasetEntries. 
     */
    DatasetSource?: DatasetSource;
    /**
     *  The type of the dataset. Specify TRAIN to create a training dataset. Specify TEST to create a test dataset. 
     */
    DatasetType: DatasetType;
    /**
     *  The ARN of the Amazon Rekognition Custom Labels project to which you want to asssign the dataset. 
     */
    ProjectArn: ProjectArn;
  }
  export interface CreateDatasetResponse {
    /**
     *  The ARN of the created Amazon Rekognition Custom Labels dataset. 
     */
    DatasetArn?: DatasetArn;
  }
  export interface CreateFaceLivenessSessionRequest {
    /**
     *  The identifier for your AWS Key Management Service key (AWS KMS key). Used to encrypt audit images and reference images.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * A session settings object. It contains settings for the operation to be performed. For Face Liveness, it accepts OutputConfig and AuditImagesLimit.
     */
    Settings?: CreateFaceLivenessSessionRequestSettings;
    /**
     * Idempotent token is used to recognize the Face Liveness request. If the same token is used with multiple CreateFaceLivenessSession requests, the same session is returned. This token is employed to avoid unintentionally creating the same session multiple times.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateFaceLivenessSessionRequestSettings {
    /**
     * Can specify the location of an Amazon S3 bucket, where reference and audit images will be stored. Note that the Amazon S3 bucket must be located in the caller's AWS account and in the same region as the Face Liveness end-point. Additionally, the Amazon S3 object keys are auto-generated by the Face Liveness system. Requires that the caller has the s3:PutObject permission on the Amazon S3 bucket.
     */
    OutputConfig?: LivenessOutputConfig;
    /**
     * Number of audit images to be returned back. Takes an integer between 0-4. Any integer less than 0 will return 0, any integer above 4 will return 4 images in the response. By default, it is set to 0. The limit is best effort and is based on the actual duration of the selfie-video.
     */
    AuditImagesLimit?: AuditImagesLimit;
  }
  export interface CreateFaceLivenessSessionResponse {
    /**
     * A unique 128-bit UUID identifying a Face Liveness session.
     */
    SessionId: LivenessSessionId;
  }
  export interface CreateProjectRequest {
    /**
     * The name of the project to create.
     */
    ProjectName: ProjectName;
    /**
     * Specifies feature that is being customized. If no value is provided CUSTOM_LABELS is used as a default.
     */
    Feature?: CustomizationFeature;
    /**
     * Specifies whether automatic retraining should be attempted for the versions of the project. Automatic retraining is done as a best effort. Required argument for Content Moderation. Applicable only to adapters.
     */
    AutoUpdate?: ProjectAutoUpdate;
  }
  export interface CreateProjectResponse {
    /**
     * The Amazon Resource Name (ARN) of the new project. You can use the ARN to configure IAM access to the project. 
     */
    ProjectArn?: ProjectArn;
  }
  export interface CreateProjectVersionRequest {
    /**
     * The ARN of the Amazon Rekognition project that will manage the project version you want to train.
     */
    ProjectArn: ProjectArn;
    /**
     * A name for the version of the project version. This value must be unique.
     */
    VersionName: VersionName;
    /**
     * The Amazon S3 bucket location to store the results of training. The bucket can be any S3 bucket in your AWS account. You need s3:PutObject permission on the bucket. 
     */
    OutputConfig: OutputConfig;
    /**
     * Specifies an external manifest that the services uses to train the project version. If you specify TrainingData you must also specify TestingData. The project must not have any associated datasets. 
     */
    TrainingData?: TrainingData;
    /**
     * Specifies an external manifest that the service uses to test the project version. If you specify TestingData you must also specify TrainingData. The project must not have any associated datasets.
     */
    TestingData?: TestingData;
    /**
     *  A set of tags (key-value pairs) that you want to attach to the project version. 
     */
    Tags?: TagMap;
    /**
     * The identifier for your AWS Key Management Service key (AWS KMS key). You can supply the Amazon Resource Name (ARN) of your KMS key, the ID of your KMS key, an alias for your KMS key, or an alias ARN. The key is used to encrypt training images, test images, and manifest files copied into the service for the project version. Your source images are unaffected. The key is also used to encrypt training results and manifest files written to the output Amazon S3 bucket (OutputConfig). If you choose to use your own KMS key, you need the following permissions on the KMS key.   kms:CreateGrant   kms:DescribeKey   kms:GenerateDataKey   kms:Decrypt   If you don't specify a value for KmsKeyId, images copied into the service are encrypted using a key that AWS owns and manages.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * A description applied to the project version being created.
     */
    VersionDescription?: VersionDescription;
    /**
     * Feature-specific configuration of the training job. If the job configuration does not match the feature type associated with the project, an InvalidParameterException is returned.
     */
    FeatureConfig?: CustomizationFeatureConfig;
  }
  export interface CreateProjectVersionResponse {
    /**
     * The ARN of the model or the project version that was created. Use DescribeProjectVersion to get the current status of the training operation.
     */
    ProjectVersionArn?: ProjectVersionArn;
  }
  export interface CreateStreamProcessorRequest {
    /**
     * Kinesis video stream stream that provides the source streaming video. If you are using the AWS CLI, the parameter name is StreamProcessorInput. This is required for both face search and label detection stream processors.
     */
    Input: StreamProcessorInput;
    /**
     * Kinesis data stream stream or Amazon S3 bucket location to which Amazon Rekognition Video puts the analysis results. If you are using the AWS CLI, the parameter name is StreamProcessorOutput. This must be a S3Destination of an Amazon S3 bucket that you own for a label detection stream processor or a Kinesis data stream ARN for a face search stream processor.
     */
    Output: StreamProcessorOutput;
    /**
     * An identifier you assign to the stream processor. You can use Name to manage the stream processor. For example, you can get the current status of the stream processor by calling DescribeStreamProcessor. Name is idempotent. This is required for both face search and label detection stream processors. 
     */
    Name: StreamProcessorName;
    /**
     * Input parameters used in a streaming video analyzed by a stream processor. You can use FaceSearch to recognize faces in a streaming video, or you can use ConnectedHome to detect labels.
     */
    Settings: StreamProcessorSettings;
    /**
     * The Amazon Resource Number (ARN) of the IAM role that allows access to the stream processor. The IAM role provides Rekognition read permissions for a Kinesis stream. It also provides write permissions to an Amazon S3 bucket and Amazon Simple Notification Service topic for a label detection stream processor. This is required for both face search and label detection stream processors.
     */
    RoleArn: RoleArn;
    /**
     *  A set of tags (key-value pairs) that you want to attach to the stream processor. 
     */
    Tags?: TagMap;
    NotificationChannel?: StreamProcessorNotificationChannel;
    /**
     *  The identifier for your AWS Key Management Service key (AWS KMS key). This is an optional parameter for label detection stream processors and should not be used to create a face search stream processor. You can supply the Amazon Resource Name (ARN) of your KMS key, the ID of your KMS key, an alias for your KMS key, or an alias ARN. The key is used to encrypt results and data published to your Amazon S3 bucket, which includes image frames and hero images. Your source images are unaffected.   
     */
    KmsKeyId?: KmsKeyId;
    /**
     *  Specifies locations in the frames where Amazon Rekognition checks for objects or people. You can specify up to 10 regions of interest, and each region has either a polygon or a bounding box. This is an optional parameter for label detection stream processors and should not be used to create a face search stream processor. 
     */
    RegionsOfInterest?: RegionsOfInterest;
    /**
     *  Shows whether you are sharing data with Rekognition to improve model performance. You can choose this option at the account level or on a per-stream basis. Note that if you opt out at the account level this setting is ignored on individual streams. 
     */
    DataSharingPreference?: StreamProcessorDataSharingPreference;
  }
  export interface CreateStreamProcessorResponse {
    /**
     * Amazon Resource Number for the newly created stream processor.
     */
    StreamProcessorArn?: StreamProcessorArn;
  }
  export interface CreateUserRequest {
    /**
     * The ID of an existing collection to which the new UserID needs to be created.
     */
    CollectionId: CollectionId;
    /**
     * ID for the UserID to be created. This ID needs to be unique within the collection.
     */
    UserId: UserId;
    /**
     * Idempotent token used to identify the request to CreateUser. If you use the same token with multiple CreateUser requests, the same response is returned. Use ClientRequestToken to prevent the same request from being processed more than once.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface CreateUserResponse {
  }
  export interface CustomLabel {
    /**
     * The name of the custom label.
     */
    Name?: String;
    /**
     * The confidence that the model has in the detection of the custom label. The range is 0-100. A higher value indicates a higher confidence.
     */
    Confidence?: Percent;
    /**
     * The location of the detected object on the image that corresponds to the custom label. Includes an axis aligned coarse bounding box surrounding the object and a finer grain polygon for more accurate spatial information.
     */
    Geometry?: Geometry;
  }
  export type CustomLabels = CustomLabel[];
  export type CustomizationFeature = "CONTENT_MODERATION"|"CUSTOM_LABELS"|string;
  export interface CustomizationFeatureConfig {
    /**
     * Configuration options for Custom Moderation training.
     */
    ContentModeration?: CustomizationFeatureContentModerationConfig;
  }
  export interface CustomizationFeatureContentModerationConfig {
    /**
     * The confidence level you plan to use to identify if unsafe content is present during inference.
     */
    ConfidenceThreshold?: Percent;
  }
  export type CustomizationFeatures = CustomizationFeature[];
  export type DatasetArn = string;
  export interface DatasetChanges {
    /**
     * A Base64-encoded binary data object containing one or JSON lines that either update the dataset or are additions to the dataset. You change a dataset by calling UpdateDatasetEntries. If you are using an AWS SDK to call UpdateDatasetEntries, you don't need to encode Changes as the SDK encodes the data for you.  For example JSON lines, see Image-Level labels in manifest files and and Object localization in manifest files in the Amazon Rekognition Custom Labels Developer Guide. 
     */
    GroundTruth: GroundTruthBlob;
  }
  export interface DatasetDescription {
    /**
     *  The Unix timestamp for the time and date that the dataset was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     *  The Unix timestamp for the date and time that the dataset was last updated. 
     */
    LastUpdatedTimestamp?: DateTime;
    /**
     *  The status of the dataset. 
     */
    Status?: DatasetStatus;
    /**
     *  The status message for the dataset. 
     */
    StatusMessage?: StatusMessage;
    /**
     *  The status message code for the dataset operation. If a service error occurs, try the API call again later. If a client error occurs, check the input parameters to the dataset API call that failed. 
     */
    StatusMessageCode?: DatasetStatusMessageCode;
    /**
     *  The status message code for the dataset. 
     */
    DatasetStats?: DatasetStats;
  }
  export type DatasetEntries = DatasetEntry[];
  export type DatasetEntry = string;
  export type DatasetLabel = string;
  export interface DatasetLabelDescription {
    /**
     *  The name of the label. 
     */
    LabelName?: DatasetLabel;
    /**
     *  Statistics about the label. 
     */
    LabelStats?: DatasetLabelStats;
  }
  export type DatasetLabelDescriptions = DatasetLabelDescription[];
  export interface DatasetLabelStats {
    /**
     *  The total number of images that use the label. 
     */
    EntryCount?: UInteger;
    /**
     *  The total number of images that have the label assigned to a bounding box. 
     */
    BoundingBoxCount?: UInteger;
  }
  export type DatasetLabels = DatasetLabel[];
  export interface DatasetMetadata {
    /**
     *  The Unix timestamp for the date and time that the dataset was created. 
     */
    CreationTimestamp?: DateTime;
    /**
     *  The type of the dataset. 
     */
    DatasetType?: DatasetType;
    /**
     *  The Amazon Resource Name (ARN) for the dataset. 
     */
    DatasetArn?: DatasetArn;
    /**
     *  The status for the dataset. 
     */
    Status?: DatasetStatus;
    /**
     *  The status message for the dataset. 
     */
    StatusMessage?: StatusMessage;
    /**
     *  The status message code for the dataset operation. If a service error occurs, try the API call again later. If a client error occurs, check the input parameters to the dataset API call that failed. 
     */
    StatusMessageCode?: DatasetStatusMessageCode;
  }
  export type DatasetMetadataList = DatasetMetadata[];
  export interface DatasetSource {
    GroundTruthManifest?: GroundTruthManifest;
    /**
     *  The ARN of an Amazon Rekognition Custom Labels dataset that you want to copy. 
     */
    DatasetArn?: DatasetArn;
  }
  export interface DatasetStats {
    /**
     *  The total number of images in the dataset that have labels. 
     */
    LabeledEntries?: UInteger;
    /**
     *  The total number of images in the dataset. 
     */
    TotalEntries?: UInteger;
    /**
     *  The total number of labels declared in the dataset. 
     */
    TotalLabels?: UInteger;
    /**
     *  The total number of entries that contain at least one error. 
     */
    ErrorEntries?: UInteger;
  }
  export type DatasetStatus = "CREATE_IN_PROGRESS"|"CREATE_COMPLETE"|"CREATE_FAILED"|"UPDATE_IN_PROGRESS"|"UPDATE_COMPLETE"|"UPDATE_FAILED"|"DELETE_IN_PROGRESS"|string;
  export type DatasetStatusMessageCode = "SUCCESS"|"SERVICE_ERROR"|"CLIENT_ERROR"|string;
  export type DatasetType = "TRAIN"|"TEST"|string;
  export type DateTime = Date;
  export type Degree = number;
  export interface DeleteCollectionRequest {
    /**
     * ID of the collection to delete.
     */
    CollectionId: CollectionId;
  }
  export interface DeleteCollectionResponse {
    /**
     * HTTP status code that indicates the result of the operation.
     */
    StatusCode?: UInteger;
  }
  export interface DeleteDatasetRequest {
    /**
     *  The ARN of the Amazon Rekognition Custom Labels dataset that you want to delete. 
     */
    DatasetArn: DatasetArn;
  }
  export interface DeleteDatasetResponse {
  }
  export interface DeleteFacesRequest {
    /**
     * Collection from which to remove the specific faces.
     */
    CollectionId: CollectionId;
    /**
     * An array of face IDs to delete.
     */
    FaceIds: FaceIdList;
  }
  export interface DeleteFacesResponse {
    /**
     * An array of strings (face IDs) of the faces that were deleted.
     */
    DeletedFaces?: FaceIdList;
    /**
     * An array of any faces that weren't deleted.
     */
    UnsuccessfulFaceDeletions?: UnsuccessfulFaceDeletionsList;
  }
  export interface DeleteProjectPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the project that the project policy you want to delete is attached to.
     */
    ProjectArn: ProjectArn;
    /**
     * The name of the policy that you want to delete.
     */
    PolicyName: ProjectPolicyName;
    /**
     * The ID of the project policy revision that you want to delete.
     */
    PolicyRevisionId?: ProjectPolicyRevisionId;
  }
  export interface DeleteProjectPolicyResponse {
  }
  export interface DeleteProjectRequest {
    /**
     * The Amazon Resource Name (ARN) of the project that you want to delete.
     */
    ProjectArn: ProjectArn;
  }
  export interface DeleteProjectResponse {
    /**
     * The current status of the delete project operation.
     */
    Status?: ProjectStatus;
  }
  export interface DeleteProjectVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the project version that you want to delete.
     */
    ProjectVersionArn: ProjectVersionArn;
  }
  export interface DeleteProjectVersionResponse {
    /**
     * The status of the deletion operation.
     */
    Status?: ProjectVersionStatus;
  }
  export interface DeleteStreamProcessorRequest {
    /**
     * The name of the stream processor you want to delete.
     */
    Name: StreamProcessorName;
  }
  export interface DeleteStreamProcessorResponse {
  }
  export interface DeleteUserRequest {
    /**
     * The ID of an existing collection from which the UserID needs to be deleted. 
     */
    CollectionId: CollectionId;
    /**
     * ID for the UserID to be deleted. 
     */
    UserId: UserId;
    /**
     * Idempotent token used to identify the request to DeleteUser. If you use the same token with multiple DeleteUser requests, the same response is returned. Use ClientRequestToken to prevent the same request from being processed more than once.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface DeleteUserResponse {
  }
  export interface DescribeCollectionRequest {
    /**
     * The ID of the collection to describe.
     */
    CollectionId: CollectionId;
  }
  export interface DescribeCollectionResponse {
    /**
     * The number of faces that are indexed into the collection. To index faces into a collection, use IndexFaces.
     */
    FaceCount?: ULong;
    /**
     * The version of the face model that's used by the collection for face detection. For more information, see Model versioning in the Amazon Rekognition Developer Guide.
     */
    FaceModelVersion?: String;
    /**
     * The Amazon Resource Name (ARN) of the collection.
     */
    CollectionARN?: String;
    /**
     * The number of milliseconds since the Unix epoch time until the creation of the collection. The Unix epoch time is 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970.
     */
    CreationTimestamp?: DateTime;
    /**
     * The number of UserIDs assigned to the specified colleciton.
     */
    UserCount?: ULong;
  }
  export interface DescribeDatasetRequest {
    /**
     *  The Amazon Resource Name (ARN) of the dataset that you want to describe. 
     */
    DatasetArn: DatasetArn;
  }
  export interface DescribeDatasetResponse {
    /**
     *  The description for the dataset. 
     */
    DatasetDescription?: DatasetDescription;
  }
  export interface DescribeProjectVersionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the project that contains the model/adapter you want to describe.
     */
    ProjectArn: ProjectArn;
    /**
     * A list of model or project version names that you want to describe. You can add up to 10 model or project version names to the list. If you don't specify a value, all project version descriptions are returned. A version name is part of a project version ARN. For example, my-model.2020-01-21T09.10.15 is the version name in the following ARN. arn:aws:rekognition:us-east-1:123456789012:project/getting-started/version/my-model.2020-01-21T09.10.15/1234567890123.
     */
    VersionNames?: VersionNames;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100. 
     */
    MaxResults?: ProjectVersionsPageSize;
  }
  export interface DescribeProjectVersionsResponse {
    /**
     * A list of project version descriptions. The list is sorted by the creation date and time of the project versions, latest to earliest.
     */
    ProjectVersionDescriptions?: ProjectVersionDescriptions;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
  }
  export interface DescribeProjectsRequest {
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Rekognition returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100. 
     */
    MaxResults?: ProjectsPageSize;
    /**
     * A list of the projects that you want Rekognition to describe. If you don't specify a value, the response includes descriptions for all the projects in your AWS account.
     */
    ProjectNames?: ProjectNames;
    /**
     * Specifies the type of customization to filter projects by. If no value is specified, CUSTOM_LABELS is used as a default.
     */
    Features?: CustomizationFeatures;
  }
  export interface DescribeProjectsResponse {
    /**
     * A list of project descriptions. The list is sorted by the date and time the projects are created.
     */
    ProjectDescriptions?: ProjectDescriptions;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
  }
  export interface DescribeStreamProcessorRequest {
    /**
     * Name of the stream processor for which you want information.
     */
    Name: StreamProcessorName;
  }
  export interface DescribeStreamProcessorResponse {
    /**
     * Name of the stream processor. 
     */
    Name?: StreamProcessorName;
    /**
     * ARN of the stream processor.
     */
    StreamProcessorArn?: StreamProcessorArn;
    /**
     * Current status of the stream processor.
     */
    Status?: StreamProcessorStatus;
    /**
     * Detailed status message about the stream processor.
     */
    StatusMessage?: String;
    /**
     * Date and time the stream processor was created
     */
    CreationTimestamp?: DateTime;
    /**
     * The time, in Unix format, the stream processor was last updated. For example, when the stream processor moves from a running state to a failed state, or when the user starts or stops the stream processor.
     */
    LastUpdateTimestamp?: DateTime;
    /**
     * Kinesis video stream that provides the source streaming video.
     */
    Input?: StreamProcessorInput;
    /**
     * Kinesis data stream to which Amazon Rekognition Video puts the analysis results.
     */
    Output?: StreamProcessorOutput;
    /**
     * ARN of the IAM role that allows access to the stream processor.
     */
    RoleArn?: RoleArn;
    /**
     * Input parameters used in a streaming video analyzed by a stream processor. You can use FaceSearch to recognize faces in a streaming video, or you can use ConnectedHome to detect labels.
     */
    Settings?: StreamProcessorSettings;
    NotificationChannel?: StreamProcessorNotificationChannel;
    /**
     *  The identifier for your AWS Key Management Service key (AWS KMS key). This is an optional parameter for label detection stream processors. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     *  Specifies locations in the frames where Amazon Rekognition checks for objects or people. This is an optional parameter for label detection stream processors. 
     */
    RegionsOfInterest?: RegionsOfInterest;
    /**
     *  Shows whether you are sharing data with Rekognition to improve model performance. You can choose this option at the account level or on a per-stream basis. Note that if you opt out at the account level this setting is ignored on individual streams. 
     */
    DataSharingPreference?: StreamProcessorDataSharingPreference;
  }
  export interface DetectCustomLabelsRequest {
    /**
     * The ARN of the model version that you want to use. Only models associated with Custom Labels projects accepted by the operation. If a provided ARN refers to a model version associated with a project for a different feature type, then an InvalidParameterException is returned.
     */
    ProjectVersionArn: ProjectVersionArn;
    Image: Image;
    /**
     * Maximum number of results you want the service to return in the response. The service returns the specified number of highest confidence labels ranked from highest confidence to lowest.
     */
    MaxResults?: UInteger;
    /**
     * Specifies the minimum confidence level for the labels to return. DetectCustomLabels doesn't return any labels with a confidence value that's lower than this specified value. If you specify a value of 0, DetectCustomLabels returns all labels, regardless of the assumed threshold applied to each label. If you don't specify a value for MinConfidence, DetectCustomLabels returns labels based on the assumed threshold of each label.
     */
    MinConfidence?: Percent;
  }
  export interface DetectCustomLabelsResponse {
    /**
     * An array of custom labels detected in the input image.
     */
    CustomLabels?: CustomLabels;
  }
  export interface DetectFacesRequest {
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes is not supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
    /**
     * An array of facial attributes you want to be returned. A DEFAULT subset of facial attributes - BoundingBox, Confidence, Pose, Quality, and Landmarks - will always be returned. You can request for specific facial attributes (in addition to the default list) - by using ["DEFAULT", "FACE_OCCLUDED"] or just ["FACE_OCCLUDED"]. You can request for all facial attributes by using ["ALL"]. Requesting more attributes may increase response time. If you provide both, ["ALL", "DEFAULT"], the service uses a logical "AND" operator to determine which attributes to return (in this case, all attributes).  Note that while the FaceOccluded and EyeDirection attributes are supported when using DetectFaces, they aren't supported when analyzing videos with StartFaceDetection and GetFaceDetection.
     */
    Attributes?: Attributes;
  }
  export interface DetectFacesResponse {
    /**
     * Details of each face found in the image. 
     */
    FaceDetails?: FaceDetailList;
    /**
     * The value of OrientationCorrection is always null. If the input image is in .jpeg format, it might contain exchangeable image file format (Exif) metadata that includes the image's orientation. Amazon Rekognition uses this orientation information to perform image correction. The bounding box coordinates are translated to represent object locations after the orientation information in the Exif metadata is used to correct the image orientation. Images in .png format don't contain Exif metadata. Amazon Rekognition doesn’t perform image correction for images in .png format and .jpeg images without orientation information in the image Exif metadata. The bounding box coordinates aren't translated and represent the object locations before the image is rotated. 
     */
    OrientationCorrection?: OrientationCorrection;
  }
  export type DetectLabelsFeatureList = DetectLabelsFeatureName[];
  export type DetectLabelsFeatureName = "GENERAL_LABELS"|"IMAGE_PROPERTIES"|string;
  export interface DetectLabelsImageBackground {
    /**
     * The quality of the image background as defined by brightness and sharpness.
     */
    Quality?: DetectLabelsImageQuality;
    /**
     * The dominant colors found in the background of an image, defined with RGB values, CSS color name, simplified color name, and PixelPercentage (the percentage of image pixels that have a particular color).
     */
    DominantColors?: DominantColors;
  }
  export interface DetectLabelsImageForeground {
    /**
     * The quality of the image foreground as defined by brightness and sharpness.
     */
    Quality?: DetectLabelsImageQuality;
    /**
     * The dominant colors found in the foreground of an image, defined with RGB values, CSS color name, simplified color name, and PixelPercentage (the percentage of image pixels that have a particular color).
     */
    DominantColors?: DominantColors;
  }
  export interface DetectLabelsImageProperties {
    /**
     * Information about the quality of the image foreground as defined by brightness, sharpness, and contrast. The higher the value the greater the brightness, sharpness, and contrast respectively.
     */
    Quality?: DetectLabelsImageQuality;
    /**
     * Information about the dominant colors found in an image, described with RGB values, CSS color name, simplified color name, and PixelPercentage (the percentage of image pixels that have a particular color).
     */
    DominantColors?: DominantColors;
    /**
     * Information about the properties of an image’s foreground, including the foreground’s quality and dominant colors, including the quality and dominant colors of the image.
     */
    Foreground?: DetectLabelsImageForeground;
    /**
     * Information about the properties of an image’s background, including the background’s quality and dominant colors, including the quality and dominant colors of the image.
     */
    Background?: DetectLabelsImageBackground;
  }
  export interface DetectLabelsImagePropertiesSettings {
    /**
     * The maximum number of dominant colors to return when detecting labels in an image. The default value is 10.
     */
    MaxDominantColors?: DetectLabelsMaxDominantColors;
  }
  export interface DetectLabelsImageQuality {
    /**
     * The brightness of an image provided for label detection.
     */
    Brightness?: Float;
    /**
     * The sharpness of an image provided for label detection.
     */
    Sharpness?: Float;
    /**
     * The contrast of an image provided for label detection.
     */
    Contrast?: Float;
  }
  export type DetectLabelsMaxDominantColors = number;
  export interface DetectLabelsRequest {
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing image bytes is not supported. Images stored in an S3 Bucket do not need to be base64-encoded. If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
    /**
     * Maximum number of labels you want the service to return in the response. The service returns the specified number of highest confidence labels. Only valid when GENERAL_LABELS is specified as a feature type in the Feature input parameter.
     */
    MaxLabels?: UInteger;
    /**
     * Specifies the minimum confidence level for the labels to return. Amazon Rekognition doesn't return any labels with confidence lower than this specified value. If MinConfidence is not specified, the operation returns labels with a confidence values greater than or equal to 55 percent. Only valid when GENERAL_LABELS is specified as a feature type in the Feature input parameter.
     */
    MinConfidence?: Percent;
    /**
     * A list of the types of analysis to perform. Specifying GENERAL_LABELS uses the label detection feature, while specifying IMAGE_PROPERTIES returns information regarding image color and quality. If no option is specified GENERAL_LABELS is used by default.
     */
    Features?: DetectLabelsFeatureList;
    /**
     * A list of the filters to be applied to returned detected labels and image properties. Specified filters can be inclusive, exclusive, or a combination of both. Filters can be used for individual labels or label categories. The exact label names or label categories must be supplied. For a full list of labels and label categories, see Detecting labels.
     */
    Settings?: DetectLabelsSettings;
  }
  export interface DetectLabelsResponse {
    /**
     * An array of labels for the real-world objects detected. 
     */
    Labels?: Labels;
    /**
     * The value of OrientationCorrection is always null. If the input image is in .jpeg format, it might contain exchangeable image file format (Exif) metadata that includes the image's orientation. Amazon Rekognition uses this orientation information to perform image correction. The bounding box coordinates are translated to represent object locations after the orientation information in the Exif metadata is used to correct the image orientation. Images in .png format don't contain Exif metadata. Amazon Rekognition doesn’t perform image correction for images in .png format and .jpeg images without orientation information in the image Exif metadata. The bounding box coordinates aren't translated and represent the object locations before the image is rotated. 
     */
    OrientationCorrection?: OrientationCorrection;
    /**
     * Version number of the label detection model that was used to detect labels.
     */
    LabelModelVersion?: String;
    /**
     * Information about the properties of the input image, such as brightness, sharpness, contrast, and dominant colors.
     */
    ImageProperties?: DetectLabelsImageProperties;
  }
  export interface DetectLabelsSettings {
    /**
     * Contains the specified filters for GENERAL_LABELS.
     */
    GeneralLabels?: GeneralLabelsSettings;
    /**
     * Contains the chosen number of maximum dominant colors in an image.
     */
    ImageProperties?: DetectLabelsImagePropertiesSettings;
  }
  export interface DetectModerationLabelsRequest {
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes is not supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
    /**
     * Specifies the minimum confidence level for the labels to return. Amazon Rekognition doesn't return any labels with a confidence level lower than this specified value. If you don't specify MinConfidence, the operation returns labels with confidence values greater than or equal to 50 percent.
     */
    MinConfidence?: Percent;
    /**
     * Sets up the configuration for human evaluation, including the FlowDefinition the image will be sent to.
     */
    HumanLoopConfig?: HumanLoopConfig;
    /**
     * Identifier for the custom adapter. Expects the ProjectVersionArn as a value. Use the CreateProject or CreateProjectVersion APIs to create a custom adapter.
     */
    ProjectVersion?: ProjectVersionId;
  }
  export interface DetectModerationLabelsResponse {
    /**
     * Array of detected Moderation labels and the time, in milliseconds from the start of the video, they were detected.
     */
    ModerationLabels?: ModerationLabels;
    /**
     * Version number of the base moderation detection model that was used to detect unsafe content.
     */
    ModerationModelVersion?: String;
    /**
     * Shows the results of the human in the loop evaluation.
     */
    HumanLoopActivationOutput?: HumanLoopActivationOutput;
    /**
     * Identifier of the custom adapter that was used during inference. If during inference the adapter was EXPIRED, then the parameter will not be returned, indicating that a base moderation detection project version was used.
     */
    ProjectVersion?: ProjectVersionId;
  }
  export interface DetectProtectiveEquipmentRequest {
    /**
     * The image in which you want to detect PPE on detected persons. The image can be passed as image bytes or you can reference an image stored in an Amazon S3 bucket. 
     */
    Image: Image;
    /**
     * An array of PPE types that you want to summarize.
     */
    SummarizationAttributes?: ProtectiveEquipmentSummarizationAttributes;
  }
  export interface DetectProtectiveEquipmentResponse {
    /**
     * The version number of the PPE detection model used to detect PPE in the image.
     */
    ProtectiveEquipmentModelVersion?: String;
    /**
     * An array of persons detected in the image (including persons not wearing PPE).
     */
    Persons?: ProtectiveEquipmentPersons;
    /**
     * Summary information for the types of PPE specified in the SummarizationAttributes input parameter.
     */
    Summary?: ProtectiveEquipmentSummary;
  }
  export interface DetectTextFilters {
    WordFilter?: DetectionFilter;
    /**
     *  A Filter focusing on a certain area of the image. Uses a BoundingBox object to set the region of the image.
     */
    RegionsOfInterest?: RegionsOfInterest;
  }
  export interface DetectTextRequest {
    /**
     * The input image as base64-encoded bytes or an Amazon S3 object. If you use the AWS CLI to call Amazon Rekognition operations, you can't pass image bytes.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
    /**
     * Optional parameters that let you set the criteria that the text must meet to be included in your response.
     */
    Filters?: DetectTextFilters;
  }
  export interface DetectTextResponse {
    /**
     * An array of text that was detected in the input image.
     */
    TextDetections?: TextDetectionList;
    /**
     * The model version used to detect text.
     */
    TextModelVersion?: String;
  }
  export interface DetectionFilter {
    /**
     * Sets the confidence of word detection. Words with detection confidence below this will be excluded from the result. Values should be between 0 and 100. The default MinConfidence is 80.
     */
    MinConfidence?: Percent;
    /**
     * Sets the minimum height of the word bounding box. Words with bounding box heights lesser than this value will be excluded from the result. Value is relative to the video frame height.
     */
    MinBoundingBoxHeight?: BoundingBoxHeight;
    /**
     * Sets the minimum width of the word bounding box. Words with bounding boxes widths lesser than this value will be excluded from the result. Value is relative to the video frame width.
     */
    MinBoundingBoxWidth?: BoundingBoxWidth;
  }
  export interface DisassociateFacesRequest {
    /**
     * The ID of an existing collection containing the UserID.
     */
    CollectionId: CollectionId;
    /**
     * ID for the existing UserID.
     */
    UserId: UserId;
    /**
     * Idempotent token used to identify the request to DisassociateFaces. If you use the same token with multiple DisassociateFaces requests, the same response is returned. Use ClientRequestToken to prevent the same request from being processed more than once.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * An array of face IDs to disassociate from the UserID. 
     */
    FaceIds: UserFaceIdList;
  }
  export interface DisassociateFacesResponse {
    /**
     * An array of DissociatedFace objects containing FaceIds that are successfully disassociated with the UserID is returned. Returned if the DisassociatedFaces action is successful.
     */
    DisassociatedFaces?: DisassociatedFacesList;
    /**
     * An array of UnsuccessfulDisassociation objects containing FaceIds that are not successfully associated, along with the reasons for the failure to associate. Returned if the DisassociateFaces action is successful.
     */
    UnsuccessfulFaceDisassociations?: UnsuccessfulFaceDisassociationList;
    /**
     * The status of an update made to a User. Reflects if the User has been updated for every requested change.
     */
    UserStatus?: UserStatus;
  }
  export interface DisassociatedFace {
    /**
     * Unique identifier assigned to the face.
     */
    FaceId?: FaceId;
  }
  export type DisassociatedFacesList = DisassociatedFace[];
  export interface DistributeDataset {
    /**
     * The Amazon Resource Name (ARN) of the dataset that you want to use. 
     */
    Arn: DatasetArn;
  }
  export interface DistributeDatasetEntriesRequest {
    /**
     * The ARNS for the training dataset and test dataset that you want to use. The datasets must belong to the same project. The test dataset must be empty. 
     */
    Datasets: DistributeDatasetMetadataList;
  }
  export interface DistributeDatasetEntriesResponse {
  }
  export type DistributeDatasetMetadataList = DistributeDataset[];
  export interface DominantColor {
    /**
     * The Red RGB value for a dominant color.
     */
    Red?: UInteger;
    /**
     * The Blue RGB value for a dominant color.
     */
    Blue?: UInteger;
    /**
     * The Green RGB value for a dominant color.
     */
    Green?: UInteger;
    /**
     * The Hex code equivalent of the RGB values for a dominant color.
     */
    HexCode?: String;
    /**
     * The CSS color name of a dominant color.
     */
    CSSColor?: String;
    /**
     * One of 12 simplified color names applied to a dominant color.
     */
    SimplifiedColor?: String;
    /**
     * The percentage of image pixels that have a given dominant color.
     */
    PixelPercent?: Percent;
  }
  export type DominantColors = DominantColor[];
  export interface Emotion {
    /**
     * Type of emotion detected.
     */
    Type?: EmotionName;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export type EmotionName = "HAPPY"|"SAD"|"ANGRY"|"CONFUSED"|"DISGUSTED"|"SURPRISED"|"CALM"|"UNKNOWN"|"FEAR"|string;
  export type Emotions = Emotion[];
  export interface EquipmentDetection {
    /**
     * A bounding box surrounding the item of detected PPE.
     */
    BoundingBox?: BoundingBox;
    /**
     * The confidence that Amazon Rekognition has that the bounding box (BoundingBox) contains an item of PPE.
     */
    Confidence?: Percent;
    /**
     * The type of detected PPE.
     */
    Type?: ProtectiveEquipmentType;
    /**
     * Information about the body part covered by the detected PPE.
     */
    CoversBodyPart?: CoversBodyPart;
  }
  export type EquipmentDetections = EquipmentDetection[];
  export interface EvaluationResult {
    /**
     * The F1 score for the evaluation of all labels. The F1 score metric evaluates the overall precision and recall performance of the model as a single value. A higher value indicates better precision and recall performance. A lower score indicates that precision, recall, or both are performing poorly. 
     */
    F1Score?: Float;
    /**
     * The S3 bucket that contains the training summary.
     */
    Summary?: Summary;
  }
  export type ExtendedPaginationToken = string;
  export type ExternalImageId = string;
  export interface EyeDirection {
    /**
     * Value representing eye direction on the yaw axis.
     */
    Yaw?: Degree;
    /**
     * Value representing eye direction on the pitch axis.
     */
    Pitch?: Degree;
    /**
     * The confidence that the service has in its predicted eye direction.
     */
    Confidence?: Percent;
  }
  export interface EyeOpen {
    /**
     * Boolean value that indicates whether the eyes on the face are open.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export interface Eyeglasses {
    /**
     * Boolean value that indicates whether the face is wearing eye glasses or not.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export interface Face {
    /**
     * Unique identifier that Amazon Rekognition assigns to the face.
     */
    FaceId?: FaceId;
    /**
     * Bounding box of the face.
     */
    BoundingBox?: BoundingBox;
    /**
     * Unique identifier that Amazon Rekognition assigns to the input image.
     */
    ImageId?: ImageId;
    /**
     * Identifier that you assign to all the faces in the input image.
     */
    ExternalImageId?: ExternalImageId;
    /**
     * Confidence level that the bounding box contains a face (and not a different object such as a tree).
     */
    Confidence?: Percent;
    /**
     *  The version of the face detect and storage model that was used when indexing the face vector. 
     */
    IndexFacesModelVersion?: IndexFacesModelVersion;
    /**
     * Unique identifier assigned to the user.
     */
    UserId?: UserId;
  }
  export type FaceAttributes = "DEFAULT"|"ALL"|string;
  export interface FaceDetail {
    /**
     * Bounding box of the face. Default attribute.
     */
    BoundingBox?: BoundingBox;
    /**
     * The estimated age range, in years, for the face. Low represents the lowest estimated age and High represents the highest estimated age.
     */
    AgeRange?: AgeRange;
    /**
     * Indicates whether or not the face is smiling, and the confidence level in the determination.
     */
    Smile?: Smile;
    /**
     * Indicates whether or not the face is wearing eye glasses, and the confidence level in the determination.
     */
    Eyeglasses?: Eyeglasses;
    /**
     * Indicates whether or not the face is wearing sunglasses, and the confidence level in the determination.
     */
    Sunglasses?: Sunglasses;
    /**
     * The predicted gender of a detected face. 
     */
    Gender?: Gender;
    /**
     * Indicates whether or not the face has a beard, and the confidence level in the determination.
     */
    Beard?: Beard;
    /**
     * Indicates whether or not the face has a mustache, and the confidence level in the determination.
     */
    Mustache?: Mustache;
    /**
     * Indicates whether or not the eyes on the face are open, and the confidence level in the determination.
     */
    EyesOpen?: EyeOpen;
    /**
     * Indicates whether or not the mouth on the face is open, and the confidence level in the determination.
     */
    MouthOpen?: MouthOpen;
    /**
     * The emotions that appear to be expressed on the face, and the confidence level in the determination. The API is only making a determination of the physical appearance of a person's face. It is not a determination of the person’s internal emotional state and should not be used in such a way. For example, a person pretending to have a sad face might not be sad emotionally.
     */
    Emotions?: Emotions;
    /**
     * Indicates the location of landmarks on the face. Default attribute.
     */
    Landmarks?: Landmarks;
    /**
     * Indicates the pose of the face as determined by its pitch, roll, and yaw. Default attribute.
     */
    Pose?: Pose;
    /**
     * Identifies image brightness and sharpness. Default attribute.
     */
    Quality?: ImageQuality;
    /**
     * Confidence level that the bounding box contains a face (and not a different object such as a tree). Default attribute.
     */
    Confidence?: Percent;
    /**
     *  FaceOccluded should return "true" with a high confidence score if a detected face’s eyes, nose, and mouth are partially captured or if they are covered by masks, dark sunglasses, cell phones, hands, or other objects. FaceOccluded should return "false" with a high confidence score if common occurrences that do not impact face verification are detected, such as eye glasses, lightly tinted sunglasses, strands of hair, and others. 
     */
    FaceOccluded?: FaceOccluded;
    /**
     * Indicates the direction the eyes are gazing in, as defined by pitch and yaw.
     */
    EyeDirection?: EyeDirection;
  }
  export type FaceDetailList = FaceDetail[];
  export interface FaceDetection {
    /**
     * Time, in milliseconds from the start of the video, that the face was detected. Note that Timestamp is not guaranteed to be accurate to the individual frame where the face first appears.
     */
    Timestamp?: Timestamp;
    /**
     * The face properties for the detected face.
     */
    Face?: FaceDetail;
  }
  export type FaceDetections = FaceDetection[];
  export type FaceId = string;
  export type FaceIdList = FaceId[];
  export type FaceList = Face[];
  export interface FaceMatch {
    /**
     * Confidence in the match of this face with the input face.
     */
    Similarity?: Percent;
    /**
     * Describes the face properties such as the bounding box, face ID, image ID of the source image, and external image ID that you assigned.
     */
    Face?: Face;
  }
  export type FaceMatchList = FaceMatch[];
  export type FaceModelVersionList = String[];
  export interface FaceOccluded {
    /**
     * True if a detected face’s eyes, nose, and mouth are partially captured or if they are covered by masks, dark sunglasses, cell phones, hands, or other objects. False if common occurrences that do not impact face verification are detected, such as eye glasses, lightly tinted sunglasses, strands of hair, and others.
     */
    Value?: Boolean;
    /**
     * The confidence that the service has detected the presence of a face occlusion.
     */
    Confidence?: Percent;
  }
  export interface FaceRecord {
    /**
     * Describes the face properties such as the bounding box, face ID, image ID of the input image, and external image ID that you assigned. 
     */
    Face?: Face;
    /**
     * Structure containing attributes of the face that the algorithm detected.
     */
    FaceDetail?: FaceDetail;
  }
  export type FaceRecordList = FaceRecord[];
  export interface FaceSearchSettings {
    /**
     * The ID of a collection that contains faces that you want to search for.
     */
    CollectionId?: CollectionId;
    /**
     * Minimum face match confidence score that must be met to return a result for a recognized face. The default is 80. 0 is the lowest confidence. 100 is the highest confidence. Values between 0 and 100 are accepted, and values lower than 80 are set to 80.
     */
    FaceMatchThreshold?: Percent;
  }
  export type FaceSearchSortBy = "INDEX"|"TIMESTAMP"|string;
  export type Float = number;
  export type FlowDefinitionArn = string;
  export interface Gender {
    /**
     * The predicted gender of the face.
     */
    Value?: GenderType;
    /**
     * Level of confidence in the prediction.
     */
    Confidence?: Percent;
  }
  export type GenderType = "Male"|"Female"|string;
  export type GeneralLabelsFilterList = GeneralLabelsFilterValue[];
  export type GeneralLabelsFilterValue = string;
  export interface GeneralLabelsSettings {
    /**
     * The labels that should be included in the return from DetectLabels.
     */
    LabelInclusionFilters?: GeneralLabelsFilterList;
    /**
     * The labels that should be excluded from the return from DetectLabels.
     */
    LabelExclusionFilters?: GeneralLabelsFilterList;
    /**
     * The label categories that should be included in the return from DetectLabels.
     */
    LabelCategoryInclusionFilters?: GeneralLabelsFilterList;
    /**
     * The label categories that should be excluded from the return from DetectLabels.
     */
    LabelCategoryExclusionFilters?: GeneralLabelsFilterList;
  }
  export interface Geometry {
    /**
     * An axis-aligned coarse representation of the detected item's location on the image.
     */
    BoundingBox?: BoundingBox;
    /**
     * Within the bounding box, a fine-grained polygon around the detected item.
     */
    Polygon?: Polygon;
  }
  export interface GetCelebrityInfoRequest {
    /**
     * The ID for the celebrity. You get the celebrity ID from a call to the RecognizeCelebrities operation, which recognizes celebrities in an image. 
     */
    Id: RekognitionUniqueId;
  }
  export interface GetCelebrityInfoResponse {
    /**
     * An array of URLs pointing to additional celebrity information. 
     */
    Urls?: Urls;
    /**
     * The name of the celebrity.
     */
    Name?: String;
    /**
     * Retrieves the known gender for the celebrity.
     */
    KnownGender?: KnownGender;
  }
  export interface GetCelebrityRecognitionRequest {
    /**
     * Job identifier for the required celebrity recognition analysis. You can get the job identifer from a call to StartCelebrityRecognition.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000. If you specify a value greater than 1000, a maximum of 1000 results is returned. The default value is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there is more recognized celebrities to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of celebrities. 
     */
    NextToken?: PaginationToken;
    /**
     * Sort to use for celebrities returned in Celebrities field. Specify ID to sort by the celebrity identifier, specify TIMESTAMP to sort by the time the celebrity was recognized.
     */
    SortBy?: CelebrityRecognitionSortBy;
  }
  export interface GetCelebrityRecognitionResponse {
    /**
     * The current status of the celebrity recognition job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * Information about a video that Amazon Rekognition Video analyzed. Videometadata is returned in every page of paginated responses from a Amazon Rekognition Video operation.
     */
    VideoMetadata?: VideoMetadata;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of celebrities.
     */
    NextToken?: PaginationToken;
    /**
     * Array of celebrities recognized in the video.
     */
    Celebrities?: CelebrityRecognitions;
    /**
     * Job identifier for the celebrity recognition operation for which you want to obtain results. The job identifer is returned by an initial call to StartCelebrityRecognition.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartCelebrityRecognition and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
  }
  export interface GetContentModerationRequest {
    /**
     * The identifier for the inappropriate, unwanted, or offensive content moderation job. Use JobId to identify the job in a subsequent call to GetContentModeration.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000. If you specify a value greater than 1000, a maximum of 1000 results is returned. The default value is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there is more data to retrieve), Amazon Rekognition returns a pagination token in the response. You can use this pagination token to retrieve the next set of content moderation labels.
     */
    NextToken?: PaginationToken;
    /**
     * Sort to use for elements in the ModerationLabelDetections array. Use TIMESTAMP to sort array elements by the time labels are detected. Use NAME to alphabetically group elements for a label together. Within each label group, the array element are sorted by detection confidence. The default sort is by TIMESTAMP.
     */
    SortBy?: ContentModerationSortBy;
    /**
     * Defines how to aggregate results of the StartContentModeration request. Default aggregation option is TIMESTAMPS. SEGMENTS mode aggregates moderation labels over time.
     */
    AggregateBy?: ContentModerationAggregateBy;
  }
  export interface GetContentModerationRequestMetadata {
    /**
     * The sorting method chosen for a GetContentModeration request.
     */
    SortBy?: ContentModerationSortBy;
    /**
     * The aggregation method chosen for a GetContentModeration request.
     */
    AggregateBy?: ContentModerationAggregateBy;
  }
  export interface GetContentModerationResponse {
    /**
     * The current status of the content moderation analysis job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * Information about a video that Amazon Rekognition analyzed. Videometadata is returned in every page of paginated responses from GetContentModeration. 
     */
    VideoMetadata?: VideoMetadata;
    /**
     * The detected inappropriate, unwanted, or offensive content moderation labels and the time(s) they were detected.
     */
    ModerationLabels?: ContentModerationDetections;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of content moderation labels. 
     */
    NextToken?: PaginationToken;
    /**
     * Version number of the moderation detection model that was used to detect inappropriate, unwanted, or offensive content.
     */
    ModerationModelVersion?: String;
    /**
     * Job identifier for the content moderation operation for which you want to obtain results. The job identifer is returned by an initial call to StartContentModeration.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartContentModeration and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
    /**
     * Information about the paramters used when getting a response. Includes information on aggregation and sorting methods.
     */
    GetRequestMetadata?: GetContentModerationRequestMetadata;
  }
  export interface GetFaceDetectionRequest {
    /**
     * Unique identifier for the face detection job. The JobId is returned from StartFaceDetection.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000. If you specify a value greater than 1000, a maximum of 1000 results is returned. The default value is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more faces to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of faces.
     */
    NextToken?: PaginationToken;
  }
  export interface GetFaceDetectionResponse {
    /**
     * The current status of the face detection job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * Information about a video that Amazon Rekognition Video analyzed. Videometadata is returned in every page of paginated responses from a Amazon Rekognition video operation.
     */
    VideoMetadata?: VideoMetadata;
    /**
     * If the response is truncated, Amazon Rekognition returns this token that you can use in the subsequent request to retrieve the next set of faces. 
     */
    NextToken?: PaginationToken;
    /**
     * An array of faces detected in the video. Each element contains a detected face's details and the time, in milliseconds from the start of the video, the face was detected. 
     */
    Faces?: FaceDetections;
    /**
     * Job identifier for the face detection operation for which you want to obtain results. The job identifer is returned by an initial call to StartFaceDetection.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartFaceDetection and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
  }
  export interface GetFaceLivenessSessionResultsRequest {
    /**
     * A unique 128-bit UUID. This is used to uniquely identify the session and also acts as an idempotency token for all operations associated with the session.
     */
    SessionId: LivenessSessionId;
  }
  export interface GetFaceLivenessSessionResultsResponse {
    /**
     * The sessionId for which this request was called.
     */
    SessionId: LivenessSessionId;
    /**
     * Represents a status corresponding to the state of the session. Possible statuses are: CREATED, IN_PROGRESS, SUCCEEDED, FAILED, EXPIRED.
     */
    Status: LivenessSessionStatus;
    /**
     * Probabalistic confidence score for if the person in the given video was live, represented as a float value between 0 to 100.
     */
    Confidence?: Percent;
    /**
     * A high-quality image from the Face Liveness video that can be used for face comparison or search. It includes a bounding box of the face and the Base64-encoded bytes that return an image. If the CreateFaceLivenessSession request included an OutputConfig argument, the image will be uploaded to an S3Object specified in the output configuration. In case the reference image is not returned, it's recommended to retry the Liveness check.
     */
    ReferenceImage?: AuditImage;
    /**
     * A set of images from the Face Liveness video that can be used for audit purposes. It includes a bounding box of the face and the Base64-encoded bytes that return an image. If the CreateFaceLivenessSession request included an OutputConfig argument, the image will be uploaded to an S3Object specified in the output configuration. If no Amazon S3 bucket is defined, raw bytes are sent instead.
     */
    AuditImages?: AuditImages;
  }
  export interface GetFaceSearchRequest {
    /**
     * The job identifer for the search request. You get the job identifier from an initial call to StartFaceSearch.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000. If you specify a value greater than 1000, a maximum of 1000 results is returned. The default value is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there is more search results to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of search results. 
     */
    NextToken?: PaginationToken;
    /**
     * Sort to use for grouping faces in the response. Use TIMESTAMP to group faces by the time that they are recognized. Use INDEX to sort by recognized faces. 
     */
    SortBy?: FaceSearchSortBy;
  }
  export interface GetFaceSearchResponse {
    /**
     * The current status of the face search job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of search results. 
     */
    NextToken?: PaginationToken;
    /**
     * Information about a video that Amazon Rekognition analyzed. Videometadata is returned in every page of paginated responses from a Amazon Rekognition Video operation. 
     */
    VideoMetadata?: VideoMetadata;
    /**
     * An array of persons, PersonMatch, in the video whose face(s) match the face(s) in an Amazon Rekognition collection. It also includes time information for when persons are matched in the video. You specify the input collection in an initial call to StartFaceSearch. Each Persons element includes a time the person was matched, face match details (FaceMatches) for matching faces in the collection, and person information (Person) for the matched person. 
     */
    Persons?: PersonMatches;
    /**
     * Job identifier for the face search operation for which you want to obtain results. The job identifer is returned by an initial call to StartFaceSearch.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartFaceSearch and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
  }
  export interface GetLabelDetectionRequest {
    /**
     * Job identifier for the label detection operation for which you want results returned. You get the job identifer from an initial call to StartlabelDetection.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000. If you specify a value greater than 1000, a maximum of 1000 results is returned. The default value is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more labels to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of labels. 
     */
    NextToken?: PaginationToken;
    /**
     * Sort to use for elements in the Labels array. Use TIMESTAMP to sort array elements by the time labels are detected. Use NAME to alphabetically group elements for a label together. Within each label group, the array element are sorted by detection confidence. The default sort is by TIMESTAMP.
     */
    SortBy?: LabelDetectionSortBy;
    /**
     * Defines how to aggregate the returned results. Results can be aggregated by timestamps or segments.
     */
    AggregateBy?: LabelDetectionAggregateBy;
  }
  export interface GetLabelDetectionRequestMetadata {
    /**
     * The sorting method chosen for a GetLabelDetection request.
     */
    SortBy?: LabelDetectionSortBy;
    /**
     * The aggregation method chosen for a GetLabelDetection request.
     */
    AggregateBy?: LabelDetectionAggregateBy;
  }
  export interface GetLabelDetectionResponse {
    /**
     * The current status of the label detection job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * Information about a video that Amazon Rekognition Video analyzed. Videometadata is returned in every page of paginated responses from a Amazon Rekognition video operation.
     */
    VideoMetadata?: VideoMetadata;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of labels.
     */
    NextToken?: PaginationToken;
    /**
     * An array of labels detected in the video. Each element contains the detected label and the time, in milliseconds from the start of the video, that the label was detected. 
     */
    Labels?: LabelDetections;
    /**
     * Version number of the label detection model that was used to detect labels.
     */
    LabelModelVersion?: String;
    /**
     * Job identifier for the label detection operation for which you want to obtain results. The job identifer is returned by an initial call to StartLabelDetection.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartLabelDetection and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
    /**
     * Information about the paramters used when getting a response. Includes information on aggregation and sorting methods.
     */
    GetRequestMetadata?: GetLabelDetectionRequestMetadata;
  }
  export interface GetPersonTrackingRequest {
    /**
     * The identifier for a job that tracks persons in a video. You get the JobId from a call to StartPersonTracking. 
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000. If you specify a value greater than 1000, a maximum of 1000 results is returned. The default value is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more persons to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of persons. 
     */
    NextToken?: PaginationToken;
    /**
     * Sort to use for elements in the Persons array. Use TIMESTAMP to sort array elements by the time persons are detected. Use INDEX to sort by the tracked persons. If you sort by INDEX, the array elements for each person are sorted by detection confidence. The default sort is by TIMESTAMP.
     */
    SortBy?: PersonTrackingSortBy;
  }
  export interface GetPersonTrackingResponse {
    /**
     * The current status of the person tracking job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * Information about a video that Amazon Rekognition Video analyzed. Videometadata is returned in every page of paginated responses from a Amazon Rekognition Video operation.
     */
    VideoMetadata?: VideoMetadata;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of persons. 
     */
    NextToken?: PaginationToken;
    /**
     * An array of the persons detected in the video and the time(s) their path was tracked throughout the video. An array element will exist for each time a person's path is tracked. 
     */
    Persons?: PersonDetections;
    /**
     * Job identifier for the person tracking operation for which you want to obtain results. The job identifer is returned by an initial call to StartPersonTracking.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartCelebrityRecognition and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
  }
  export interface GetSegmentDetectionRequest {
    /**
     * Job identifier for the text detection operation for which you want results returned. You get the job identifer from an initial call to StartSegmentDetection.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of text.
     */
    NextToken?: PaginationToken;
  }
  export interface GetSegmentDetectionResponse {
    /**
     * Current status of the segment detection job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    /**
     * Currently, Amazon Rekognition Video returns a single object in the VideoMetadata array. The object contains information about the video stream in the input file that Amazon Rekognition Video chose to analyze. The VideoMetadata object includes the video codec, video format and other information. Video metadata is returned in each page of information returned by GetSegmentDetection.
     */
    VideoMetadata?: VideoMetadataList;
    /**
     * An array of objects. There can be multiple audio streams. Each AudioMetadata object contains metadata for a single audio stream. Audio information in an AudioMetadata objects includes the audio codec, the number of audio channels, the duration of the audio stream, and the sample rate. Audio metadata is returned in each page of information returned by GetSegmentDetection.
     */
    AudioMetadata?: AudioMetadataList;
    /**
     * If the previous response was incomplete (because there are more labels to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of text.
     */
    NextToken?: PaginationToken;
    /**
     * An array of segments detected in a video. The array is sorted by the segment types (TECHNICAL_CUE or SHOT) specified in the SegmentTypes input parameter of StartSegmentDetection. Within each segment type the array is sorted by timestamp values.
     */
    Segments?: SegmentDetections;
    /**
     * An array containing the segment types requested in the call to StartSegmentDetection. 
     */
    SelectedSegmentTypes?: SegmentTypesInfo;
    /**
     * Job identifier for the segment detection operation for which you want to obtain results. The job identifer is returned by an initial call to StartSegmentDetection.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartSegmentDetection and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
  }
  export interface GetTextDetectionRequest {
    /**
     * Job identifier for the text detection operation for which you want results returned. You get the job identifer from an initial call to StartTextDetection.
     */
    JobId: JobId;
    /**
     * Maximum number of results to return per paginated call. The largest value you can specify is 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous response was incomplete (because there are more labels to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of text.
     */
    NextToken?: PaginationToken;
  }
  export interface GetTextDetectionResponse {
    /**
     * Current status of the text detection job.
     */
    JobStatus?: VideoJobStatus;
    /**
     * If the job fails, StatusMessage provides a descriptive error message.
     */
    StatusMessage?: StatusMessage;
    VideoMetadata?: VideoMetadata;
    /**
     * An array of text detected in the video. Each element contains the detected text, the time in milliseconds from the start of the video that the text was detected, and where it was detected on the screen.
     */
    TextDetections?: TextDetectionResults;
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of text.
     */
    NextToken?: PaginationToken;
    /**
     * Version number of the text detection model that was used to detect text.
     */
    TextModelVersion?: String;
    /**
     * Job identifier for the text detection operation for which you want to obtain results. The job identifer is returned by an initial call to StartTextDetection.
     */
    JobId?: JobId;
    Video?: Video;
    /**
     * A job identifier specified in the call to StartTextDetection and returned in the job completion notification sent to your Amazon Simple Notification Service topic.
     */
    JobTag?: JobTag;
  }
  export type GroundTruthBlob = Buffer|Uint8Array|Blob|string;
  export interface GroundTruthManifest {
    S3Object?: S3Object;
  }
  export type HasErrors = boolean;
  export type HumanLoopActivationConditionsEvaluationResults = string;
  export interface HumanLoopActivationOutput {
    /**
     * The Amazon Resource Name (ARN) of the HumanLoop created.
     */
    HumanLoopArn?: HumanLoopArn;
    /**
     * Shows if and why human review was needed.
     */
    HumanLoopActivationReasons?: HumanLoopActivationReasons;
    /**
     * Shows the result of condition evaluations, including those conditions which activated a human review.
     */
    HumanLoopActivationConditionsEvaluationResults?: HumanLoopActivationConditionsEvaluationResults;
  }
  export type HumanLoopActivationReason = string;
  export type HumanLoopActivationReasons = HumanLoopActivationReason[];
  export type HumanLoopArn = string;
  export interface HumanLoopConfig {
    /**
     * The name of the human review used for this image. This should be kept unique within a region.
     */
    HumanLoopName: HumanLoopName;
    /**
     * The Amazon Resource Name (ARN) of the flow definition. You can create a flow definition by using the Amazon Sagemaker CreateFlowDefinition Operation. 
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * Sets attributes of the input data.
     */
    DataAttributes?: HumanLoopDataAttributes;
  }
  export interface HumanLoopDataAttributes {
    /**
     * Sets whether the input image is free of personally identifiable information.
     */
    ContentClassifiers?: ContentClassifiers;
  }
  export type HumanLoopName = string;
  export interface Image {
    /**
     * Blob of image bytes up to 5 MBs. Note that the maximum image size you can pass to DetectCustomLabels is 4MB. 
     */
    Bytes?: ImageBlob;
    /**
     * Identifies an S3 object as the image source.
     */
    S3Object?: S3Object;
  }
  export type ImageBlob = Buffer|Uint8Array|Blob|string;
  export type ImageId = string;
  export interface ImageQuality {
    /**
     * Value representing brightness of the face. The service returns a value between 0 and 100 (inclusive). A higher value indicates a brighter face image.
     */
    Brightness?: Float;
    /**
     * Value representing sharpness of the face. The service returns a value between 0 and 100 (inclusive). A higher value indicates a sharper face image.
     */
    Sharpness?: Float;
  }
  export type IndexFacesModelVersion = string;
  export interface IndexFacesRequest {
    /**
     * The ID of an existing collection to which you want to add the faces that are detected in the input images.
     */
    CollectionId: CollectionId;
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes isn't supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
    /**
     * The ID you want to assign to all the faces detected in the image.
     */
    ExternalImageId?: ExternalImageId;
    /**
     * An array of facial attributes you want to be returned. A DEFAULT subset of facial attributes - BoundingBox, Confidence, Pose, Quality, and Landmarks - will always be returned. You can request for specific facial attributes (in addition to the default list) - by using ["DEFAULT", "FACE_OCCLUDED"] or just ["FACE_OCCLUDED"]. You can request for all facial attributes by using ["ALL"]. Requesting more attributes may increase response time. If you provide both, ["ALL", "DEFAULT"], the service uses a logical AND operator to determine which attributes to return (in this case, all attributes). 
     */
    DetectionAttributes?: Attributes;
    /**
     * The maximum number of faces to index. The value of MaxFaces must be greater than or equal to 1. IndexFaces returns no more than 100 detected faces in an image, even if you specify a larger value for MaxFaces. If IndexFaces detects more faces than the value of MaxFaces, the faces with the lowest quality are filtered out first. If there are still more faces than the value of MaxFaces, the faces with the smallest bounding boxes are filtered out (up to the number that's needed to satisfy the value of MaxFaces). Information about the unindexed faces is available in the UnindexedFaces array.  The faces that are returned by IndexFaces are sorted by the largest face bounding box size to the smallest size, in descending order.  MaxFaces can be used with a collection associated with any version of the face model.
     */
    MaxFaces?: MaxFacesToIndex;
    /**
     * A filter that specifies a quality bar for how much filtering is done to identify faces. Filtered faces aren't indexed. If you specify AUTO, Amazon Rekognition chooses the quality bar. If you specify LOW, MEDIUM, or HIGH, filtering removes all faces that don’t meet the chosen quality bar. The default value is AUTO. The quality bar is based on a variety of common use cases. Low-quality detections can occur for a number of reasons. Some examples are an object that's misidentified as a face, a face that's too blurry, or a face with a pose that's too extreme to use. If you specify NONE, no filtering is performed.  To use quality filtering, the collection you are using must be associated with version 3 of the face model or higher.
     */
    QualityFilter?: QualityFilter;
  }
  export interface IndexFacesResponse {
    /**
     * An array of faces detected and added to the collection. For more information, see Searching Faces in a Collection in the Amazon Rekognition Developer Guide. 
     */
    FaceRecords?: FaceRecordList;
    /**
     * If your collection is associated with a face detection model that's later than version 3.0, the value of OrientationCorrection is always null and no orientation information is returned. If your collection is associated with a face detection model that's version 3.0 or earlier, the following applies:   If the input image is in .jpeg format, it might contain exchangeable image file format (Exif) metadata that includes the image's orientation. Amazon Rekognition uses this orientation information to perform image correction - the bounding box coordinates are translated to represent object locations after the orientation information in the Exif metadata is used to correct the image orientation. Images in .png format don't contain Exif metadata. The value of OrientationCorrection is null.   If the image doesn't contain orientation information in its Exif metadata, Amazon Rekognition returns an estimated orientation (ROTATE_0, ROTATE_90, ROTATE_180, ROTATE_270). Amazon Rekognition doesn’t perform image correction for images. The bounding box coordinates aren't translated and represent the object locations before the image is rotated.   Bounding box information is returned in the FaceRecords array. You can get the version of the face detection model by calling DescribeCollection. 
     */
    OrientationCorrection?: OrientationCorrection;
    /**
     * The version number of the face detection model that's associated with the input collection (CollectionId).
     */
    FaceModelVersion?: String;
    /**
     * An array of faces that were detected in the image but weren't indexed. They weren't indexed because the quality filter identified them as low quality, or the MaxFaces request parameter filtered them out. To use the quality filter, you specify the QualityFilter request parameter.
     */
    UnindexedFaces?: UnindexedFaces;
  }
  export type InferenceUnits = number;
  export interface Instance {
    /**
     * The position of the label instance on the image.
     */
    BoundingBox?: BoundingBox;
    /**
     * The confidence that Amazon Rekognition has in the accuracy of the bounding box.
     */
    Confidence?: Percent;
    /**
     * The dominant colors found in an individual instance of a label.
     */
    DominantColors?: DominantColors;
  }
  export type Instances = Instance[];
  export type IsLabeled = boolean;
  export type JobId = string;
  export type JobTag = string;
  export type KinesisDataArn = string;
  export interface KinesisDataStream {
    /**
     * ARN of the output Amazon Kinesis Data Streams stream.
     */
    Arn?: KinesisDataArn;
  }
  export type KinesisVideoArn = string;
  export interface KinesisVideoStream {
    /**
     * ARN of the Kinesis video stream stream that streams the source video.
     */
    Arn?: KinesisVideoArn;
  }
  export type KinesisVideoStreamFragmentNumber = string;
  export interface KinesisVideoStreamStartSelector {
    /**
     *  The timestamp from the producer corresponding to the fragment, in milliseconds, expressed in unix time format. 
     */
    ProducerTimestamp?: ULong;
    /**
     *  The unique identifier of the fragment. This value monotonically increases based on the ingestion order. 
     */
    FragmentNumber?: KinesisVideoStreamFragmentNumber;
  }
  export type KmsKeyId = string;
  export interface KnownGender {
    /**
     * A string value of the KnownGender info about the Celebrity.
     */
    Type?: KnownGenderType;
  }
  export type KnownGenderType = "Male"|"Female"|"Nonbinary"|"Unlisted"|string;
  export interface Label {
    /**
     * The name (label) of the object or scene.
     */
    Name?: String;
    /**
     * Level of confidence.
     */
    Confidence?: Percent;
    /**
     * If Label represents an object, Instances contains the bounding boxes for each instance of the detected object. Bounding boxes are returned for common object labels such as people, cars, furniture, apparel or pets.
     */
    Instances?: Instances;
    /**
     * The parent labels for a label. The response includes all ancestor labels.
     */
    Parents?: Parents;
    /**
     * A list of potential aliases for a given label.
     */
    Aliases?: LabelAliases;
    /**
     * A list of the categories associated with a given label.
     */
    Categories?: LabelCategories;
  }
  export interface LabelAlias {
    /**
     * The name of an alias for a given label.
     */
    Name?: String;
  }
  export type LabelAliases = LabelAlias[];
  export type LabelCategories = LabelCategory[];
  export interface LabelCategory {
    /**
     * The name of a category that applies to a given label.
     */
    Name?: String;
  }
  export interface LabelDetection {
    /**
     * Time, in milliseconds from the start of the video, that the label was detected. Note that Timestamp is not guaranteed to be accurate to the individual frame where the label first appears.
     */
    Timestamp?: Timestamp;
    /**
     * Details about the detected label.
     */
    Label?: Label;
    /**
     * The time in milliseconds defining the start of the timeline segment containing a continuously detected label.
     */
    StartTimestampMillis?: ULong;
    /**
     * The time in milliseconds defining the end of the timeline segment containing a continuously detected label.
     */
    EndTimestampMillis?: ULong;
    /**
     * The time duration of a segment in milliseconds, I.e. time elapsed from StartTimestampMillis to EndTimestampMillis.
     */
    DurationMillis?: ULong;
  }
  export type LabelDetectionAggregateBy = "TIMESTAMPS"|"SEGMENTS"|string;
  export type LabelDetectionFeatureList = LabelDetectionFeatureName[];
  export type LabelDetectionFeatureName = "GENERAL_LABELS"|string;
  export interface LabelDetectionSettings {
    GeneralLabels?: GeneralLabelsSettings;
  }
  export type LabelDetectionSortBy = "NAME"|"TIMESTAMP"|string;
  export type LabelDetections = LabelDetection[];
  export type Labels = Label[];
  export interface Landmark {
    /**
     * Type of landmark.
     */
    Type?: LandmarkType;
    /**
     * The x-coordinate of the landmark expressed as a ratio of the width of the image. The x-coordinate is measured from the left-side of the image. For example, if the image is 700 pixels wide and the x-coordinate of the landmark is at 350 pixels, this value is 0.5. 
     */
    X?: Float;
    /**
     * The y-coordinate of the landmark expressed as a ratio of the height of the image. The y-coordinate is measured from the top of the image. For example, if the image height is 200 pixels and the y-coordinate of the landmark is at 50 pixels, this value is 0.25.
     */
    Y?: Float;
  }
  export type LandmarkType = "eyeLeft"|"eyeRight"|"nose"|"mouthLeft"|"mouthRight"|"leftEyeBrowLeft"|"leftEyeBrowRight"|"leftEyeBrowUp"|"rightEyeBrowLeft"|"rightEyeBrowRight"|"rightEyeBrowUp"|"leftEyeLeft"|"leftEyeRight"|"leftEyeUp"|"leftEyeDown"|"rightEyeLeft"|"rightEyeRight"|"rightEyeUp"|"rightEyeDown"|"noseLeft"|"noseRight"|"mouthUp"|"mouthDown"|"leftPupil"|"rightPupil"|"upperJawlineLeft"|"midJawlineLeft"|"chinBottom"|"midJawlineRight"|"upperJawlineRight"|string;
  export type Landmarks = Landmark[];
  export interface ListCollectionsRequest {
    /**
     * Pagination token from the previous response.
     */
    NextToken?: PaginationToken;
    /**
     * Maximum number of collection IDs to return. 
     */
    MaxResults?: PageSize;
  }
  export interface ListCollectionsResponse {
    /**
     * An array of collection IDs.
     */
    CollectionIds?: CollectionIdList;
    /**
     * If the result is truncated, the response provides a NextToken that you can use in the subsequent request to fetch the next set of collection IDs.
     */
    NextToken?: PaginationToken;
    /**
     * Version numbers of the face detection models associated with the collections in the array CollectionIds. For example, the value of FaceModelVersions[2] is the version number for the face detection model used by the collection in CollectionId[2].
     */
    FaceModelVersions?: FaceModelVersionList;
  }
  export type ListDatasetEntriesPageSize = number;
  export interface ListDatasetEntriesRequest {
    /**
     *  The Amazon Resource Name (ARN) for the dataset that you want to use. 
     */
    DatasetArn: DatasetArn;
    /**
     * Specifies a label filter for the response. The response includes an entry only if one or more of the labels in ContainsLabels exist in the entry. 
     */
    ContainsLabels?: DatasetLabels;
    /**
     *  Specify true to get only the JSON Lines where the image is labeled. Specify false to get only the JSON Lines where the image isn't labeled. If you don't specify Labeled, ListDatasetEntries returns JSON Lines for labeled and unlabeled images. 
     */
    Labeled?: IsLabeled;
    /**
     * If specified, ListDatasetEntries only returns JSON Lines where the value of SourceRefContains is part of the source-ref field. The source-ref field contains the Amazon S3 location of the image. You can use SouceRefContains for tasks such as getting the JSON Line for a single image, or gettting JSON Lines for all images within a specific folder.
     */
    SourceRefContains?: QueryString;
    /**
     * Specifies an error filter for the response. Specify True to only include entries that have errors. 
     */
    HasErrors?: HasErrors;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition Custom Labels returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100. 
     */
    MaxResults?: ListDatasetEntriesPageSize;
  }
  export interface ListDatasetEntriesResponse {
    /**
     *  A list of entries (images) in the dataset. 
     */
    DatasetEntries?: DatasetEntries;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition Custom Labels returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
  }
  export type ListDatasetLabelsPageSize = number;
  export interface ListDatasetLabelsRequest {
    /**
     *  The Amazon Resource Name (ARN) of the dataset that you want to use. 
     */
    DatasetArn: DatasetArn;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition Custom Labels returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 100. If you specify a value greater than 100, a ValidationException error occurs. The default value is 100. 
     */
    MaxResults?: ListDatasetLabelsPageSize;
  }
  export interface ListDatasetLabelsResponse {
    /**
     *  A list of the labels in the dataset. 
     */
    DatasetLabelDescriptions?: DatasetLabelDescriptions;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition Custom Labels returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
  }
  export interface ListFacesRequest {
    /**
     * ID of the collection from which to list the faces.
     */
    CollectionId: CollectionId;
    /**
     * If the previous response was incomplete (because there is more data to retrieve), Amazon Rekognition returns a pagination token in the response. You can use this pagination token to retrieve the next set of faces.
     */
    NextToken?: PaginationToken;
    /**
     * Maximum number of faces to return.
     */
    MaxResults?: PageSize;
    /**
     * An array of user IDs to filter results with when listing faces in a collection.
     */
    UserId?: UserId;
    /**
     * An array of face IDs to filter results with when listing faces in a collection.
     */
    FaceIds?: FaceIdList;
  }
  export interface ListFacesResponse {
    /**
     * An array of Face objects. 
     */
    Faces?: FaceList;
    /**
     * If the response is truncated, Amazon Rekognition returns this token that you can use in the subsequent request to retrieve the next set of faces.
     */
    NextToken?: String;
    /**
     * Version number of the face detection model associated with the input collection (CollectionId).
     */
    FaceModelVersion?: String;
  }
  export type ListProjectPoliciesPageSize = number;
  export interface ListProjectPoliciesRequest {
    /**
     * The ARN of the project for which you want to list the project policies.
     */
    ProjectArn: ProjectArn;
    /**
     * If the previous response was incomplete (because there is more results to retrieve), Amazon Rekognition Custom Labels returns a pagination token in the response. You can use this pagination token to retrieve the next set of results. 
     */
    NextToken?: ExtendedPaginationToken;
    /**
     * The maximum number of results to return per paginated call. The largest value you can specify is 5. If you specify a value greater than 5, a ValidationException error occurs. The default value is 5. 
     */
    MaxResults?: ListProjectPoliciesPageSize;
  }
  export interface ListProjectPoliciesResponse {
    /**
     * A list of project policies attached to the project.
     */
    ProjectPolicies?: ProjectPolicies;
    /**
     * If the response is truncated, Amazon Rekognition returns this token that you can use in the subsequent request to retrieve the next set of project policies.
     */
    NextToken?: ExtendedPaginationToken;
  }
  export interface ListStreamProcessorsRequest {
    /**
     * If the previous response was incomplete (because there are more stream processors to retrieve), Amazon Rekognition Video returns a pagination token in the response. You can use this pagination token to retrieve the next set of stream processors. 
     */
    NextToken?: PaginationToken;
    /**
     * Maximum number of stream processors you want Amazon Rekognition Video to return in the response. The default is 1000. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListStreamProcessorsResponse {
    /**
     * If the response is truncated, Amazon Rekognition Video returns this token that you can use in the subsequent request to retrieve the next set of stream processors. 
     */
    NextToken?: PaginationToken;
    /**
     * List of stream processors that you have created.
     */
    StreamProcessors?: StreamProcessorList;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  Amazon Resource Name (ARN) of the model, collection, or stream processor that contains the tags that you want a list of. 
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  A list of key-value tags assigned to the resource. 
     */
    Tags?: TagMap;
  }
  export interface ListUsersRequest {
    /**
     * The ID of an existing collection.
     */
    CollectionId: CollectionId;
    /**
     * Maximum number of UsersID to return. 
     */
    MaxResults?: MaxUserResults;
    /**
     * Pagingation token to receive the next set of UsersID.
     */
    NextToken?: PaginationToken;
  }
  export interface ListUsersResponse {
    /**
     * List of UsersID associated with the specified collection.
     */
    Users?: UserList;
    /**
     * A pagination token to be used with the subsequent request if the response is truncated.
     */
    NextToken?: PaginationToken;
  }
  export type LivenessImageBlob = Buffer|Uint8Array|Blob|string;
  export interface LivenessOutputConfig {
    /**
     * The path to an AWS Amazon S3 bucket used to store Face Liveness session results.
     */
    S3Bucket: S3Bucket;
    /**
     * The prefix prepended to the output files for the Face Liveness session results.
     */
    S3KeyPrefix?: LivenessS3KeyPrefix;
  }
  export type LivenessS3KeyPrefix = string;
  export type LivenessSessionId = string;
  export type LivenessSessionStatus = "CREATED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"EXPIRED"|string;
  export interface MatchedUser {
    /**
     * A provided ID for the UserID. Unique within the collection.
     */
    UserId?: UserId;
    /**
     * The status of the user matched to a provided FaceID.
     */
    UserStatus?: UserStatus;
  }
  export type MaxDurationInSecondsULong = number;
  export type MaxFaces = number;
  export type MaxFacesToIndex = number;
  export type MaxPixelThreshold = number;
  export type MaxResults = number;
  export type MaxUserResults = number;
  export type MinCoveragePercentage = number;
  export interface ModerationLabel {
    /**
     * Specifies the confidence that Amazon Rekognition has that the label has been correctly identified. If you don't specify the MinConfidence parameter in the call to DetectModerationLabels, the operation returns labels with a confidence value greater than or equal to 50 percent.
     */
    Confidence?: Percent;
    /**
     * The label name for the type of unsafe content detected in the image.
     */
    Name?: String;
    /**
     * The name for the parent label. Labels at the top level of the hierarchy have the parent label "".
     */
    ParentName?: String;
  }
  export type ModerationLabels = ModerationLabel[];
  export interface MouthOpen {
    /**
     * Boolean value that indicates whether the mouth on the face is open or not.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export interface Mustache {
    /**
     * Boolean value that indicates whether the face has mustache or not.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export interface NotificationChannel {
    /**
     * The Amazon SNS topic to which Amazon Rekognition posts the completion status.
     */
    SNSTopicArn: SNSTopicArn;
    /**
     * The ARN of an IAM role that gives Amazon Rekognition publishing permissions to the Amazon SNS topic. 
     */
    RoleArn: RoleArn;
  }
  export type OrientationCorrection = "ROTATE_0"|"ROTATE_90"|"ROTATE_180"|"ROTATE_270"|string;
  export interface OutputConfig {
    /**
     * The S3 bucket where training output is placed.
     */
    S3Bucket?: S3Bucket;
    /**
     * The prefix applied to the training output files. 
     */
    S3KeyPrefix?: S3KeyPrefix;
  }
  export type PageSize = number;
  export type PaginationToken = string;
  export interface Parent {
    /**
     * The name of the parent label.
     */
    Name?: String;
  }
  export type Parents = Parent[];
  export type Percent = number;
  export interface PersonDetail {
    /**
     * Identifier for the person detected person within a video. Use to keep track of the person throughout the video. The identifier is not stored by Amazon Rekognition.
     */
    Index?: PersonIndex;
    /**
     * Bounding box around the detected person.
     */
    BoundingBox?: BoundingBox;
    /**
     * Face details for the detected person.
     */
    Face?: FaceDetail;
  }
  export interface PersonDetection {
    /**
     * The time, in milliseconds from the start of the video, that the person's path was tracked. Note that Timestamp is not guaranteed to be accurate to the individual frame where the person's path first appears.
     */
    Timestamp?: Timestamp;
    /**
     * Details about a person whose path was tracked in a video.
     */
    Person?: PersonDetail;
  }
  export type PersonDetections = PersonDetection[];
  export type PersonIndex = number;
  export interface PersonMatch {
    /**
     * The time, in milliseconds from the beginning of the video, that the person was matched in the video.
     */
    Timestamp?: Timestamp;
    /**
     * Information about the matched person.
     */
    Person?: PersonDetail;
    /**
     * Information about the faces in the input collection that match the face of a person in the video.
     */
    FaceMatches?: FaceMatchList;
  }
  export type PersonMatches = PersonMatch[];
  export type PersonTrackingSortBy = "INDEX"|"TIMESTAMP"|string;
  export interface Point {
    /**
     * The value of the X coordinate for a point on a Polygon.
     */
    X?: Float;
    /**
     * The value of the Y coordinate for a point on a Polygon.
     */
    Y?: Float;
  }
  export type Polygon = Point[];
  export interface Pose {
    /**
     * Value representing the face rotation on the roll axis.
     */
    Roll?: Degree;
    /**
     * Value representing the face rotation on the yaw axis.
     */
    Yaw?: Degree;
    /**
     * Value representing the face rotation on the pitch axis.
     */
    Pitch?: Degree;
  }
  export type ProjectArn = string;
  export type ProjectAutoUpdate = "ENABLED"|"DISABLED"|string;
  export interface ProjectDescription {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn?: ProjectArn;
    /**
     * The Unix timestamp for the date and time that the project was created.
     */
    CreationTimestamp?: DateTime;
    /**
     * The current status of the project.
     */
    Status?: ProjectStatus;
    /**
     *  Information about the training and test datasets in the project. 
     */
    Datasets?: DatasetMetadataList;
    /**
     * Specifies the project that is being customized.
     */
    Feature?: CustomizationFeature;
    /**
     * Indicates whether automatic retraining will be attempted for the versions of the project. Applies only to adapters. 
     */
    AutoUpdate?: ProjectAutoUpdate;
  }
  export type ProjectDescriptions = ProjectDescription[];
  export type ProjectName = string;
  export type ProjectNames = ProjectName[];
  export type ProjectPolicies = ProjectPolicy[];
  export interface ProjectPolicy {
    /**
     * The Amazon Resource Name (ARN) of the project to which the project policy is attached.
     */
    ProjectArn?: ProjectArn;
    /**
     * The name of the project policy.
     */
    PolicyName?: ProjectPolicyName;
    /**
     * The revision ID of the project policy.
     */
    PolicyRevisionId?: ProjectPolicyRevisionId;
    /**
     * The JSON document for the project policy.
     */
    PolicyDocument?: ProjectPolicyDocument;
    /**
     * The Unix datetime for the creation of the project policy.
     */
    CreationTimestamp?: DateTime;
    /**
     * The Unix datetime for when the project policy was last updated. 
     */
    LastUpdatedTimestamp?: DateTime;
  }
  export type ProjectPolicyDocument = string;
  export type ProjectPolicyName = string;
  export type ProjectPolicyRevisionId = string;
  export type ProjectStatus = "CREATING"|"CREATED"|"DELETING"|string;
  export type ProjectVersionArn = string;
  export interface ProjectVersionDescription {
    /**
     * The Amazon Resource Name (ARN) of the project version. 
     */
    ProjectVersionArn?: ProjectVersionArn;
    /**
     * The Unix datetime for the date and time that training started.
     */
    CreationTimestamp?: DateTime;
    /**
     * The minimum number of inference units used by the model. Applies only to Custom Labels projects. For more information, see StartProjectVersion.
     */
    MinInferenceUnits?: InferenceUnits;
    /**
     * The current status of the model version.
     */
    Status?: ProjectVersionStatus;
    /**
     * A descriptive message for an error or warning that occurred.
     */
    StatusMessage?: StatusMessage;
    /**
     * The duration, in seconds, that you were billed for a successful training of the model version. This value is only returned if the model version has been successfully trained.
     */
    BillableTrainingTimeInSeconds?: ULong;
    /**
     * The Unix date and time that training of the model ended.
     */
    TrainingEndTimestamp?: DateTime;
    /**
     * The location where training results are saved.
     */
    OutputConfig?: OutputConfig;
    /**
     * Contains information about the training results.
     */
    TrainingDataResult?: TrainingDataResult;
    /**
     * Contains information about the testing results.
     */
    TestingDataResult?: TestingDataResult;
    /**
     * The training results. EvaluationResult is only returned if training is successful.
     */
    EvaluationResult?: EvaluationResult;
    /**
     * The location of the summary manifest. The summary manifest provides aggregate data validation results for the training and test datasets.
     */
    ManifestSummary?: GroundTruthManifest;
    /**
     * The identifer for the AWS Key Management Service key (AWS KMS key) that was used to encrypt the model during training. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The maximum number of inference units Amazon Rekognition uses to auto-scale the model. Applies only to Custom Labels projects. For more information, see StartProjectVersion.
     */
    MaxInferenceUnits?: InferenceUnits;
    /**
     * If the model version was copied from a different project, SourceProjectVersionArn contains the ARN of the source model version. 
     */
    SourceProjectVersionArn?: ProjectVersionArn;
    /**
     * A user-provided description of the project version.
     */
    VersionDescription?: VersionDescription;
    /**
     * The feature that was customized.
     */
    Feature?: CustomizationFeature;
    /**
     * The base detection model version used to create the project version.
     */
    BaseModelVersion?: String;
    /**
     * Feature specific configuration that was applied during training.
     */
    FeatureConfig?: CustomizationFeatureConfig;
  }
  export type ProjectVersionDescriptions = ProjectVersionDescription[];
  export type ProjectVersionId = string;
  export type ProjectVersionStatus = "TRAINING_IN_PROGRESS"|"TRAINING_COMPLETED"|"TRAINING_FAILED"|"STARTING"|"RUNNING"|"FAILED"|"STOPPING"|"STOPPED"|"DELETING"|"COPYING_IN_PROGRESS"|"COPYING_COMPLETED"|"COPYING_FAILED"|"DEPRECATED"|"EXPIRED"|string;
  export type ProjectVersionsPageSize = number;
  export type ProjectsPageSize = number;
  export interface ProtectiveEquipmentBodyPart {
    /**
     * The detected body part.
     */
    Name?: BodyPart;
    /**
     * The confidence that Amazon Rekognition has in the detection accuracy of the detected body part. 
     */
    Confidence?: Percent;
    /**
     * An array of Personal Protective Equipment items detected around a body part.
     */
    EquipmentDetections?: EquipmentDetections;
  }
  export interface ProtectiveEquipmentPerson {
    /**
     * An array of body parts detected on a person's body (including body parts without PPE). 
     */
    BodyParts?: BodyParts;
    /**
     * A bounding box around the detected person.
     */
    BoundingBox?: BoundingBox;
    /**
     * The confidence that Amazon Rekognition has that the bounding box contains a person.
     */
    Confidence?: Percent;
    /**
     * The identifier for the detected person. The identifier is only unique for a single call to DetectProtectiveEquipment.
     */
    Id?: UInteger;
  }
  export type ProtectiveEquipmentPersonIds = UInteger[];
  export type ProtectiveEquipmentPersons = ProtectiveEquipmentPerson[];
  export interface ProtectiveEquipmentSummarizationAttributes {
    /**
     * The minimum confidence level for which you want summary information. The confidence level applies to person detection, body part detection, equipment detection, and body part coverage. Amazon Rekognition doesn't return summary information with a confidence than this specified value. There isn't a default value. Specify a MinConfidence value that is between 50-100% as DetectProtectiveEquipment returns predictions only where the detection confidence is between 50% - 100%. If you specify a value that is less than 50%, the results are the same specifying a value of 50%.  
     */
    MinConfidence: Percent;
    /**
     * An array of personal protective equipment types for which you want summary information. If a person is detected wearing a required requipment type, the person's ID is added to the PersonsWithRequiredEquipment array field returned in ProtectiveEquipmentSummary by DetectProtectiveEquipment. 
     */
    RequiredEquipmentTypes: ProtectiveEquipmentTypes;
  }
  export interface ProtectiveEquipmentSummary {
    /**
     * An array of IDs for persons who are wearing detected personal protective equipment. 
     */
    PersonsWithRequiredEquipment?: ProtectiveEquipmentPersonIds;
    /**
     * An array of IDs for persons who are not wearing all of the types of PPE specified in the RequiredEquipmentTypes field of the detected personal protective equipment. 
     */
    PersonsWithoutRequiredEquipment?: ProtectiveEquipmentPersonIds;
    /**
     * An array of IDs for persons where it was not possible to determine if they are wearing personal protective equipment. 
     */
    PersonsIndeterminate?: ProtectiveEquipmentPersonIds;
  }
  export type ProtectiveEquipmentType = "FACE_COVER"|"HAND_COVER"|"HEAD_COVER"|string;
  export type ProtectiveEquipmentTypes = ProtectiveEquipmentType[];
  export interface PutProjectPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the project that the project policy is attached to.
     */
    ProjectArn: ProjectArn;
    /**
     * A name for the policy.
     */
    PolicyName: ProjectPolicyName;
    /**
     * The revision ID for the Project Policy. Each time you modify a policy, Amazon Rekognition Custom Labels generates and assigns a new PolicyRevisionId and then deletes the previous version of the policy.
     */
    PolicyRevisionId?: ProjectPolicyRevisionId;
    /**
     * A resource policy to add to the model. The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow the IAM syntax. For more information about the contents of a JSON policy document, see IAM JSON policy reference. 
     */
    PolicyDocument: ProjectPolicyDocument;
  }
  export interface PutProjectPolicyResponse {
    /**
     * The ID of the project policy.
     */
    PolicyRevisionId?: ProjectPolicyRevisionId;
  }
  export type QualityFilter = "NONE"|"AUTO"|"LOW"|"MEDIUM"|"HIGH"|string;
  export type QueryString = string;
  export type Reason = "EXCEEDS_MAX_FACES"|"EXTREME_POSE"|"LOW_BRIGHTNESS"|"LOW_SHARPNESS"|"LOW_CONFIDENCE"|"SMALL_BOUNDING_BOX"|"LOW_FACE_QUALITY"|string;
  export type Reasons = Reason[];
  export interface RecognizeCelebritiesRequest {
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes is not supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
  }
  export interface RecognizeCelebritiesResponse {
    /**
     * Details about each celebrity found in the image. Amazon Rekognition can detect a maximum of 64 celebrities in an image. Each celebrity object includes the following attributes: Face, Confidence, Emotions, Landmarks, Pose, Quality, Smile, Id, KnownGender, MatchConfidence, Name, Urls.
     */
    CelebrityFaces?: CelebrityList;
    /**
     * Details about each unrecognized face in the image.
     */
    UnrecognizedFaces?: ComparedFaceList;
    /**
     *  Support for estimating image orientation using the the OrientationCorrection field has ceased as of August 2021. Any returned values for this field included in an API response will always be NULL.  The orientation of the input image (counterclockwise direction). If your application displays the image, you can use this value to correct the orientation. The bounding box coordinates returned in CelebrityFaces and UnrecognizedFaces represent face locations before the image orientation is corrected.   If the input image is in .jpeg format, it might contain exchangeable image (Exif) metadata that includes the image's orientation. If so, and the Exif metadata for the input image populates the orientation field, the value of OrientationCorrection is null. The CelebrityFaces and UnrecognizedFaces bounding box coordinates represent face locations after Exif metadata is used to correct the image orientation. Images in .png format don't contain Exif metadata.  
     */
    OrientationCorrection?: OrientationCorrection;
  }
  export interface RegionOfInterest {
    /**
     * The box representing a region of interest on screen.
     */
    BoundingBox?: BoundingBox;
    /**
     *  Specifies a shape made up of up to 10 Point objects to define a region of interest. 
     */
    Polygon?: Polygon;
  }
  export type RegionsOfInterest = RegionOfInterest[];
  export type RekognitionUniqueId = string;
  export type ResourceArn = string;
  export type RoleArn = string;
  export type S3Bucket = string;
  export interface S3Destination {
    /**
     *  The name of the Amazon S3 bucket you want to associate with the streaming video project. You must be the owner of the Amazon S3 bucket. 
     */
    Bucket?: S3Bucket;
    /**
     *  The prefix value of the location within the bucket that you want the information to be published to. For more information, see Using prefixes. 
     */
    KeyPrefix?: S3KeyPrefix;
  }
  export type S3KeyPrefix = string;
  export interface S3Object {
    /**
     * Name of the S3 bucket.
     */
    Bucket?: S3Bucket;
    /**
     * S3 object key name.
     */
    Name?: S3ObjectName;
    /**
     * If the bucket is versioning enabled, you can specify the object version. 
     */
    Version?: S3ObjectVersion;
  }
  export type S3ObjectName = string;
  export type S3ObjectVersion = string;
  export type SNSTopicArn = string;
  export interface SearchFacesByImageRequest {
    /**
     * ID of the collection to search.
     */
    CollectionId: CollectionId;
    /**
     * The input image as base64-encoded bytes or an S3 object. If you use the AWS CLI to call Amazon Rekognition operations, passing base64-encoded image bytes is not supported.  If you are using an AWS SDK to call Amazon Rekognition, you might not need to base64-encode image bytes passed using the Bytes field. For more information, see Images in the Amazon Rekognition developer guide.
     */
    Image: Image;
    /**
     * Maximum number of faces to return. The operation returns the maximum number of faces with the highest confidence in the match.
     */
    MaxFaces?: MaxFaces;
    /**
     * (Optional) Specifies the minimum confidence in the face match to return. For example, don't return any matches where confidence in matches is less than 70%. The default value is 80%.
     */
    FaceMatchThreshold?: Percent;
    /**
     * A filter that specifies a quality bar for how much filtering is done to identify faces. Filtered faces aren't searched for in the collection. If you specify AUTO, Amazon Rekognition chooses the quality bar. If you specify LOW, MEDIUM, or HIGH, filtering removes all faces that don’t meet the chosen quality bar. The quality bar is based on a variety of common use cases. Low-quality detections can occur for a number of reasons. Some examples are an object that's misidentified as a face, a face that's too blurry, or a face with a pose that's too extreme to use. If you specify NONE, no filtering is performed. The default value is NONE.  To use quality filtering, the collection you are using must be associated with version 3 of the face model or higher.
     */
    QualityFilter?: QualityFilter;
  }
  export interface SearchFacesByImageResponse {
    /**
     * The bounding box around the face in the input image that Amazon Rekognition used for the search.
     */
    SearchedFaceBoundingBox?: BoundingBox;
    /**
     * The level of confidence that the searchedFaceBoundingBox, contains a face.
     */
    SearchedFaceConfidence?: Percent;
    /**
     * An array of faces that match the input face, along with the confidence in the match.
     */
    FaceMatches?: FaceMatchList;
    /**
     * Version number of the face detection model associated with the input collection (CollectionId).
     */
    FaceModelVersion?: String;
  }
  export interface SearchFacesRequest {
    /**
     * ID of the collection the face belongs to.
     */
    CollectionId: CollectionId;
    /**
     * ID of a face to find matches for in the collection.
     */
    FaceId: FaceId;
    /**
     * Maximum number of faces to return. The operation returns the maximum number of faces with the highest confidence in the match.
     */
    MaxFaces?: MaxFaces;
    /**
     * Optional value specifying the minimum confidence in the face match to return. For example, don't return any matches where confidence in matches is less than 70%. The default value is 80%. 
     */
    FaceMatchThreshold?: Percent;
  }
  export interface SearchFacesResponse {
    /**
     * ID of the face that was searched for matches in a collection.
     */
    SearchedFaceId?: FaceId;
    /**
     * An array of faces that matched the input face, along with the confidence in the match.
     */
    FaceMatches?: FaceMatchList;
    /**
     * Version number of the face detection model associated with the input collection (CollectionId).
     */
    FaceModelVersion?: String;
  }
  export interface SearchUsersByImageRequest {
    /**
     * The ID of an existing collection containing the UserID.
     */
    CollectionId: CollectionId;
    Image: Image;
    /**
     * Specifies the minimum confidence in the UserID match to return. Default value is 80.
     */
    UserMatchThreshold?: Percent;
    /**
     * Maximum number of UserIDs to return.
     */
    MaxUsers?: MaxUserResults;
    /**
     * A filter that specifies a quality bar for how much filtering is done to identify faces. Filtered faces aren't searched for in the collection. The default value is NONE.
     */
    QualityFilter?: QualityFilter;
  }
  export interface SearchUsersByImageResponse {
    /**
     * An array of UserID objects that matched the input face, along with the confidence in the match. The returned structure will be empty if there are no matches. Returned if the SearchUsersByImageResponse action is successful.
     */
    UserMatches?: UserMatchList;
    /**
     * Version number of the face detection model associated with the input collection CollectionId.
     */
    FaceModelVersion?: String;
    /**
     * A list of FaceDetail objects containing the BoundingBox for the largest face in image, as well as the confidence in the bounding box, that was searched for matches. If no valid face is detected in the image the response will contain no SearchedFace object.
     */
    SearchedFace?: SearchedFaceDetails;
    /**
     * List of UnsearchedFace objects. Contains the face details infered from the specified image but not used for search. Contains reasons that describe why a face wasn't used for Search. 
     */
    UnsearchedFaces?: UnsearchedFacesList;
  }
  export interface SearchUsersRequest {
    /**
     * The ID of an existing collection containing the UserID, used with a UserId or FaceId. If a FaceId is provided, UserId isn’t required to be present in the Collection.
     */
    CollectionId: CollectionId;
    /**
     * ID for the existing User.
     */
    UserId?: UserId;
    /**
     * ID for the existing face.
     */
    FaceId?: FaceId;
    /**
     * Optional value that specifies the minimum confidence in the matched UserID to return. Default value of 80.
     */
    UserMatchThreshold?: Percent;
    /**
     * Maximum number of identities to return.
     */
    MaxUsers?: MaxUserResults;
  }
  export interface SearchUsersResponse {
    /**
     * An array of UserMatch objects that matched the input face along with the confidence in the match. Array will be empty if there are no matches.
     */
    UserMatches?: UserMatchList;
    /**
     * Version number of the face detection model associated with the input CollectionId.
     */
    FaceModelVersion?: String;
    /**
     * Contains the ID of a face that was used to search for matches in a collection.
     */
    SearchedFace?: SearchedFace;
    /**
     * Contains the ID of the UserID that was used to search for matches in a collection.
     */
    SearchedUser?: SearchedUser;
  }
  export interface SearchedFace {
    /**
     *  Unique identifier assigned to the face.
     */
    FaceId?: FaceId;
  }
  export interface SearchedFaceDetails {
    FaceDetail?: FaceDetail;
  }
  export interface SearchedUser {
    /**
     *  A provided ID for the UserID. Unique within the collection. 
     */
    UserId?: UserId;
  }
  export type SegmentConfidence = number;
  export interface SegmentDetection {
    /**
     * The type of the segment. Valid values are TECHNICAL_CUE and SHOT.
     */
    Type?: SegmentType;
    /**
     * The start time of the detected segment in milliseconds from the start of the video. This value is rounded down. For example, if the actual timestamp is 100.6667 milliseconds, Amazon Rekognition Video returns a value of 100 millis.
     */
    StartTimestampMillis?: Timestamp;
    /**
     * The end time of the detected segment, in milliseconds, from the start of the video. This value is rounded down.
     */
    EndTimestampMillis?: Timestamp;
    /**
     * The duration of the detected segment in milliseconds. 
     */
    DurationMillis?: ULong;
    /**
     * The frame-accurate SMPTE timecode, from the start of a video, for the start of a detected segment. StartTimecode is in HH:MM:SS:fr format (and ;fr for drop frame-rates). 
     */
    StartTimecodeSMPTE?: Timecode;
    /**
     * The frame-accurate SMPTE timecode, from the start of a video, for the end of a detected segment. EndTimecode is in HH:MM:SS:fr format (and ;fr for drop frame-rates).
     */
    EndTimecodeSMPTE?: Timecode;
    /**
     * The duration of the timecode for the detected segment in SMPTE format.
     */
    DurationSMPTE?: Timecode;
    /**
     * If the segment is a technical cue, contains information about the technical cue.
     */
    TechnicalCueSegment?: TechnicalCueSegment;
    /**
     * If the segment is a shot detection, contains information about the shot detection.
     */
    ShotSegment?: ShotSegment;
    /**
     *  The frame number of the start of a video segment, using a frame index that starts with 0. 
     */
    StartFrameNumber?: ULong;
    /**
     *  The frame number at the end of a video segment, using a frame index that starts with 0. 
     */
    EndFrameNumber?: ULong;
    /**
     *  The duration of a video segment, expressed in frames. 
     */
    DurationFrames?: ULong;
  }
  export type SegmentDetections = SegmentDetection[];
  export type SegmentType = "TECHNICAL_CUE"|"SHOT"|string;
  export interface SegmentTypeInfo {
    /**
     * The type of a segment (technical cue or shot detection).
     */
    Type?: SegmentType;
    /**
     * The version of the model used to detect segments.
     */
    ModelVersion?: String;
  }
  export type SegmentTypes = SegmentType[];
  export type SegmentTypesInfo = SegmentTypeInfo[];
  export interface ShotSegment {
    /**
     * An Identifier for a shot detection segment detected in a video. 
     */
    Index?: ULong;
    /**
     * The confidence that Amazon Rekognition Video has in the accuracy of the detected segment.
     */
    Confidence?: SegmentConfidence;
  }
  export interface Smile {
    /**
     * Boolean value that indicates whether the face is smiling or not.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export interface StartCelebrityRecognitionRequest {
    /**
     * The video in which you want to recognize celebrities. The video must be stored in an Amazon S3 bucket.
     */
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartCelebrityRecognition requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The Amazon SNS topic ARN that you want Amazon Rekognition Video to publish the completion status of the celebrity recognition analysis to. The Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
  }
  export interface StartCelebrityRecognitionResponse {
    /**
     * The identifier for the celebrity recognition analysis job. Use JobId to identify the job in a subsequent call to GetCelebrityRecognition.
     */
    JobId?: JobId;
  }
  export interface StartContentModerationRequest {
    /**
     * The video in which you want to detect inappropriate, unwanted, or offensive content. The video must be stored in an Amazon S3 bucket.
     */
    Video: Video;
    /**
     * Specifies the minimum confidence that Amazon Rekognition must have in order to return a moderated content label. Confidence represents how certain Amazon Rekognition is that the moderated content is correctly identified. 0 is the lowest confidence. 100 is the highest confidence. Amazon Rekognition doesn't return any moderated content labels with a confidence level lower than this specified value. If you don't specify MinConfidence, GetContentModeration returns labels with confidence values greater than or equal to 50 percent.
     */
    MinConfidence?: Percent;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartContentModeration requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The Amazon SNS topic ARN that you want Amazon Rekognition Video to publish the completion status of the content analysis to. The Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy to access the topic.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
  }
  export interface StartContentModerationResponse {
    /**
     * The identifier for the content analysis job. Use JobId to identify the job in a subsequent call to GetContentModeration.
     */
    JobId?: JobId;
  }
  export interface StartFaceDetectionRequest {
    /**
     * The video in which you want to detect faces. The video must be stored in an Amazon S3 bucket.
     */
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartFaceDetection requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ARN of the Amazon SNS topic to which you want Amazon Rekognition Video to publish the completion status of the face detection operation. The Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * The face attributes you want returned.  DEFAULT - The following subset of facial attributes are returned: BoundingBox, Confidence, Pose, Quality and Landmarks.   ALL - All facial attributes are returned.
     */
    FaceAttributes?: FaceAttributes;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
  }
  export interface StartFaceDetectionResponse {
    /**
     * The identifier for the face detection job. Use JobId to identify the job in a subsequent call to GetFaceDetection.
     */
    JobId?: JobId;
  }
  export interface StartFaceSearchRequest {
    /**
     * The video you want to search. The video must be stored in an Amazon S3 bucket. 
     */
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartFaceSearch requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The minimum confidence in the person match to return. For example, don't return any matches where confidence in matches is less than 70%. The default value is 80%.
     */
    FaceMatchThreshold?: Percent;
    /**
     * ID of the collection that contains the faces you want to search for.
     */
    CollectionId: CollectionId;
    /**
     * The ARN of the Amazon SNS topic to which you want Amazon Rekognition Video to publish the completion status of the search. The Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy to access the topic.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
  }
  export interface StartFaceSearchResponse {
    /**
     * The identifier for the search job. Use JobId to identify the job in a subsequent call to GetFaceSearch. 
     */
    JobId?: JobId;
  }
  export interface StartLabelDetectionRequest {
    /**
     * The video in which you want to detect labels. The video must be stored in an Amazon S3 bucket.
     */
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartLabelDetection requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies the minimum confidence that Amazon Rekognition Video must have in order to return a detected label. Confidence represents how certain Amazon Rekognition is that a label is correctly identified.0 is the lowest confidence. 100 is the highest confidence. Amazon Rekognition Video doesn't return any labels with a confidence level lower than this specified value. If you don't specify MinConfidence, the operation returns labels and bounding boxes (if detected) with confidence values greater than or equal to 50 percent.
     */
    MinConfidence?: Percent;
    /**
     * The Amazon SNS topic ARN you want Amazon Rekognition Video to publish the completion status of the label detection operation to. The Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
    /**
     * The features to return after video analysis. You can specify that GENERAL_LABELS are returned.
     */
    Features?: LabelDetectionFeatureList;
    /**
     * The settings for a StartLabelDetection request.Contains the specified parameters for the label detection request of an asynchronous label analysis operation. Settings can include filters for GENERAL_LABELS.
     */
    Settings?: LabelDetectionSettings;
  }
  export interface StartLabelDetectionResponse {
    /**
     * The identifier for the label detection job. Use JobId to identify the job in a subsequent call to GetLabelDetection. 
     */
    JobId?: JobId;
  }
  export interface StartPersonTrackingRequest {
    /**
     * The video in which you want to detect people. The video must be stored in an Amazon S3 bucket.
     */
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartPersonTracking requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The Amazon SNS topic ARN you want Amazon Rekognition Video to publish the completion status of the people detection operation to. The Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
  }
  export interface StartPersonTrackingResponse {
    /**
     * The identifier for the person detection job. Use JobId to identify the job in a subsequent call to GetPersonTracking.
     */
    JobId?: JobId;
  }
  export interface StartProjectVersionRequest {
    /**
     * The Amazon Resource Name(ARN) of the model version that you want to start.
     */
    ProjectVersionArn: ProjectVersionArn;
    /**
     * The minimum number of inference units to use. A single inference unit represents 1 hour of processing.  Use a higher number to increase the TPS throughput of your model. You are charged for the number of inference units that you use. 
     */
    MinInferenceUnits: InferenceUnits;
    /**
     * The maximum number of inference units to use for auto-scaling the model. If you don't specify a value, Amazon Rekognition Custom Labels doesn't auto-scale the model.
     */
    MaxInferenceUnits?: InferenceUnits;
  }
  export interface StartProjectVersionResponse {
    /**
     * The current running status of the model. 
     */
    Status?: ProjectVersionStatus;
  }
  export interface StartSegmentDetectionFilters {
    /**
     * Filters that are specific to technical cues.
     */
    TechnicalCueFilter?: StartTechnicalCueDetectionFilter;
    /**
     * Filters that are specific to shot detections.
     */
    ShotFilter?: StartShotDetectionFilter;
  }
  export interface StartSegmentDetectionRequest {
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartSegmentDetection requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidently started more than once. 
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ARN of the Amazon SNS topic to which you want Amazon Rekognition Video to publish the completion status of the segment detection operation. Note that the Amazon SNS topic must have a topic name that begins with AmazonRekognition if you are using the AmazonRekognitionServiceRole permissions policy to access the topic.
     */
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier you specify that's returned in the completion notification that's published to your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
    /**
     * Filters for technical cue or shot detection.
     */
    Filters?: StartSegmentDetectionFilters;
    /**
     * An array of segment types to detect in the video. Valid values are TECHNICAL_CUE and SHOT.
     */
    SegmentTypes: SegmentTypes;
  }
  export interface StartSegmentDetectionResponse {
    /**
     * Unique identifier for the segment detection job. The JobId is returned from StartSegmentDetection. 
     */
    JobId?: JobId;
  }
  export interface StartShotDetectionFilter {
    /**
     * Specifies the minimum confidence that Amazon Rekognition Video must have in order to return a detected segment. Confidence represents how certain Amazon Rekognition is that a segment is correctly identified. 0 is the lowest confidence. 100 is the highest confidence. Amazon Rekognition Video doesn't return any segments with a confidence level lower than this specified value. If you don't specify MinSegmentConfidence, the GetSegmentDetection returns segments with confidence values greater than or equal to 50 percent.
     */
    MinSegmentConfidence?: SegmentConfidence;
  }
  export interface StartStreamProcessorRequest {
    /**
     * The name of the stream processor to start processing.
     */
    Name: StreamProcessorName;
    /**
     *  Specifies the starting point in the Kinesis stream to start processing. You can use the producer timestamp or the fragment number. If you use the producer timestamp, you must put the time in milliseconds. For more information about fragment numbers, see Fragment.  This is a required parameter for label detection stream processors and should not be used to start a face search stream processor.
     */
    StartSelector?: StreamProcessingStartSelector;
    /**
     *  Specifies when to stop processing the stream. You can specify a maximum amount of time to process the video.  This is a required parameter for label detection stream processors and should not be used to start a face search stream processor.
     */
    StopSelector?: StreamProcessingStopSelector;
  }
  export interface StartStreamProcessorResponse {
    /**
     *  A unique identifier for the stream processing session. 
     */
    SessionId?: StartStreamProcessorSessionId;
  }
  export type StartStreamProcessorSessionId = string;
  export interface StartTechnicalCueDetectionFilter {
    /**
     * Specifies the minimum confidence that Amazon Rekognition Video must have in order to return a detected segment. Confidence represents how certain Amazon Rekognition is that a segment is correctly identified. 0 is the lowest confidence. 100 is the highest confidence. Amazon Rekognition Video doesn't return any segments with a confidence level lower than this specified value. If you don't specify MinSegmentConfidence, GetSegmentDetection returns segments with confidence values greater than or equal to 50 percent.
     */
    MinSegmentConfidence?: SegmentConfidence;
    /**
     *  A filter that allows you to control the black frame detection by specifying the black levels and pixel coverage of black pixels in a frame. Videos can come from multiple sources, formats, and time periods, with different standards and varying noise levels for black frames that need to be accounted for. 
     */
    BlackFrame?: BlackFrame;
  }
  export interface StartTextDetectionFilters {
    /**
     * Filters focusing on qualities of the text, such as confidence or size.
     */
    WordFilter?: DetectionFilter;
    /**
     * Filter focusing on a certain area of the frame. Uses a BoundingBox object to set the region of the screen.
     */
    RegionsOfInterest?: RegionsOfInterest;
  }
  export interface StartTextDetectionRequest {
    Video: Video;
    /**
     * Idempotent token used to identify the start request. If you use the same token with multiple StartTextDetection requests, the same JobId is returned. Use ClientRequestToken to prevent the same job from being accidentaly started more than once.
     */
    ClientRequestToken?: ClientRequestToken;
    NotificationChannel?: NotificationChannel;
    /**
     * An identifier returned in the completion status published by your Amazon Simple Notification Service topic. For example, you can use JobTag to group related jobs and identify them in the completion notification.
     */
    JobTag?: JobTag;
    /**
     * Optional parameters that let you set criteria the text must meet to be included in your response.
     */
    Filters?: StartTextDetectionFilters;
  }
  export interface StartTextDetectionResponse {
    /**
     * Identifier for the text detection job. Use JobId to identify the job in a subsequent call to GetTextDetection.
     */
    JobId?: JobId;
  }
  export type StatusMessage = string;
  export interface StopProjectVersionRequest {
    /**
     * The Amazon Resource Name (ARN) of the model version that you want to stop. This operation requires permissions to perform the rekognition:StopProjectVersion action.
     */
    ProjectVersionArn: ProjectVersionArn;
  }
  export interface StopProjectVersionResponse {
    /**
     * The current status of the stop operation. 
     */
    Status?: ProjectVersionStatus;
  }
  export interface StopStreamProcessorRequest {
    /**
     * The name of a stream processor created by CreateStreamProcessor.
     */
    Name: StreamProcessorName;
  }
  export interface StopStreamProcessorResponse {
  }
  export interface StreamProcessingStartSelector {
    /**
     *  Specifies the starting point in the stream to start processing. This can be done with a producer timestamp or a fragment number in a Kinesis stream. 
     */
    KVSStreamStartSelector?: KinesisVideoStreamStartSelector;
  }
  export interface StreamProcessingStopSelector {
    /**
     *  Specifies the maximum amount of time in seconds that you want the stream to be processed. The largest amount of time is 2 minutes. The default is 10 seconds. 
     */
    MaxDurationInSeconds?: MaxDurationInSecondsULong;
  }
  export interface StreamProcessor {
    /**
     * Name of the Amazon Rekognition stream processor. 
     */
    Name?: StreamProcessorName;
    /**
     * Current status of the Amazon Rekognition stream processor.
     */
    Status?: StreamProcessorStatus;
  }
  export type StreamProcessorArn = string;
  export interface StreamProcessorDataSharingPreference {
    /**
     *  If this option is set to true, you choose to share data with Rekognition to improve model performance. 
     */
    OptIn: Boolean;
  }
  export interface StreamProcessorInput {
    /**
     * The Kinesis video stream input stream for the source streaming video.
     */
    KinesisVideoStream?: KinesisVideoStream;
  }
  export type StreamProcessorList = StreamProcessor[];
  export type StreamProcessorName = string;
  export interface StreamProcessorNotificationChannel {
    /**
     *  The Amazon Resource Number (ARN) of the Amazon Amazon Simple Notification Service topic to which Amazon Rekognition posts the completion status. 
     */
    SNSTopicArn: SNSTopicArn;
  }
  export interface StreamProcessorOutput {
    /**
     * The Amazon Kinesis Data Streams stream to which the Amazon Rekognition stream processor streams the analysis results.
     */
    KinesisDataStream?: KinesisDataStream;
    /**
     *  The Amazon S3 bucket location to which Amazon Rekognition publishes the detailed inference results of a video analysis operation. 
     */
    S3Destination?: S3Destination;
  }
  export type StreamProcessorParameterToDelete = "ConnectedHomeMinConfidence"|"RegionsOfInterest"|string;
  export type StreamProcessorParametersToDelete = StreamProcessorParameterToDelete[];
  export interface StreamProcessorSettings {
    /**
     * Face search settings to use on a streaming video. 
     */
    FaceSearch?: FaceSearchSettings;
    ConnectedHome?: ConnectedHomeSettings;
  }
  export interface StreamProcessorSettingsForUpdate {
    /**
     *  The label detection settings you want to use for your stream processor. 
     */
    ConnectedHomeForUpdate?: ConnectedHomeSettingsForUpdate;
  }
  export type StreamProcessorStatus = "STOPPED"|"STARTING"|"RUNNING"|"FAILED"|"STOPPING"|"UPDATING"|string;
  export type String = string;
  export interface Summary {
    S3Object?: S3Object;
  }
  export interface Sunglasses {
    /**
     * Boolean value that indicates whether the face is wearing sunglasses or not.
     */
    Value?: Boolean;
    /**
     * Level of confidence in the determination.
     */
    Confidence?: Percent;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  Amazon Resource Name (ARN) of the model, collection, or stream processor that you want to assign the tags to. 
     */
    ResourceArn: ResourceArn;
    /**
     *  The key-value tags to assign to the resource. 
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TechnicalCueSegment {
    /**
     * The type of the technical cue.
     */
    Type?: TechnicalCueType;
    /**
     * The confidence that Amazon Rekognition Video has in the accuracy of the detected segment.
     */
    Confidence?: SegmentConfidence;
  }
  export type TechnicalCueType = "ColorBars"|"EndCredits"|"BlackFrames"|"OpeningCredits"|"StudioLogo"|"Slate"|"Content"|string;
  export interface TestingData {
    /**
     * The assets used for testing.
     */
    Assets?: Assets;
    /**
     * If specified, Rekognition splits training dataset to create a test dataset for the training job.
     */
    AutoCreate?: Boolean;
  }
  export interface TestingDataResult {
    /**
     * The testing dataset that was supplied for training.
     */
    Input?: TestingData;
    /**
     * The subset of the dataset that was actually tested. Some images (assets) might not be tested due to file formatting and other issues. 
     */
    Output?: TestingData;
    /**
     * The location of the data validation manifest. The data validation manifest is created for the test dataset during model training.
     */
    Validation?: ValidationData;
  }
  export interface TextDetection {
    /**
     * The word or line of text recognized by Amazon Rekognition. 
     */
    DetectedText?: String;
    /**
     * The type of text that was detected.
     */
    Type?: TextTypes;
    /**
     * The identifier for the detected text. The identifier is only unique for a single call to DetectText. 
     */
    Id?: UInteger;
    /**
     * The Parent identifier for the detected text identified by the value of ID. If the type of detected text is LINE, the value of ParentId is Null. 
     */
    ParentId?: UInteger;
    /**
     * The confidence that Amazon Rekognition has in the accuracy of the detected text and the accuracy of the geometry points around the detected text.
     */
    Confidence?: Percent;
    /**
     * The location of the detected text on the image. Includes an axis aligned coarse bounding box surrounding the text and a finer grain polygon for more accurate spatial information.
     */
    Geometry?: Geometry;
  }
  export type TextDetectionList = TextDetection[];
  export interface TextDetectionResult {
    /**
     * The time, in milliseconds from the start of the video, that the text was detected. Note that Timestamp is not guaranteed to be accurate to the individual frame where the text first appears.
     */
    Timestamp?: Timestamp;
    /**
     * Details about text detected in a video.
     */
    TextDetection?: TextDetection;
  }
  export type TextDetectionResults = TextDetectionResult[];
  export type TextTypes = "LINE"|"WORD"|string;
  export type Timecode = string;
  export type Timestamp = number;
  export interface TrainingData {
    /**
     * A manifest file that contains references to the training images and ground-truth annotations.
     */
    Assets?: Assets;
  }
  export interface TrainingDataResult {
    /**
     * The training data that you supplied.
     */
    Input?: TrainingData;
    /**
     * Reference to images (assets) that were actually used during training with trained model predictions.
     */
    Output?: TrainingData;
    /**
     * A manifest that you supplied for training, with validation results for each line.
     */
    Validation?: ValidationData;
  }
  export type UInteger = number;
  export type ULong = number;
  export interface UnindexedFace {
    /**
     * An array of reasons that specify why a face wasn't indexed.    EXTREME_POSE - The face is at a pose that can't be detected. For example, the head is turned too far away from the camera.   EXCEEDS_MAX_FACES - The number of faces detected is already higher than that specified by the MaxFaces input parameter for IndexFaces.   LOW_BRIGHTNESS - The image is too dark.   LOW_SHARPNESS - The image is too blurry.   LOW_CONFIDENCE - The face was detected with a low confidence.   SMALL_BOUNDING_BOX - The bounding box around the face is too small.  
     */
    Reasons?: Reasons;
    /**
     * The structure that contains attributes of a face that IndexFacesdetected, but didn't index. 
     */
    FaceDetail?: FaceDetail;
  }
  export type UnindexedFaces = UnindexedFace[];
  export interface UnsearchedFace {
    FaceDetails?: FaceDetail;
    /**
     *  Reasons why a face wasn't used for Search. 
     */
    Reasons?: UnsearchedFaceReasons;
  }
  export type UnsearchedFaceReason = "FACE_NOT_LARGEST"|"EXCEEDS_MAX_FACES"|"EXTREME_POSE"|"LOW_BRIGHTNESS"|"LOW_SHARPNESS"|"LOW_CONFIDENCE"|"SMALL_BOUNDING_BOX"|"LOW_FACE_QUALITY"|string;
  export type UnsearchedFaceReasons = UnsearchedFaceReason[];
  export type UnsearchedFacesList = UnsearchedFace[];
  export interface UnsuccessfulFaceAssociation {
    /**
     * A unique identifier assigned to the face. 
     */
    FaceId?: FaceId;
    /**
     * A provided ID for the UserID. Unique within the collection. 
     */
    UserId?: UserId;
    /**
     * Match confidence with the UserID, provides information regarding if a face association was unsuccessful because it didn't meet UserMatchThreshold.
     */
    Confidence?: Percent;
    /**
     *  The reason why the association was unsuccessful. 
     */
    Reasons?: UnsuccessfulFaceAssociationReasons;
  }
  export type UnsuccessfulFaceAssociationList = UnsuccessfulFaceAssociation[];
  export type UnsuccessfulFaceAssociationReason = "FACE_NOT_FOUND"|"ASSOCIATED_TO_A_DIFFERENT_USER"|"LOW_MATCH_CONFIDENCE"|string;
  export type UnsuccessfulFaceAssociationReasons = UnsuccessfulFaceAssociationReason[];
  export interface UnsuccessfulFaceDeletion {
    /**
     *  A unique identifier assigned to the face.
     */
    FaceId?: FaceId;
    /**
     *  A provided ID for the UserID. Unique within the collection. 
     */
    UserId?: UserId;
    /**
     * The reason why the deletion was unsuccessful. 
     */
    Reasons?: UnsuccessfulFaceDeletionReasons;
  }
  export type UnsuccessfulFaceDeletionReason = "ASSOCIATED_TO_AN_EXISTING_USER"|"FACE_NOT_FOUND"|string;
  export type UnsuccessfulFaceDeletionReasons = UnsuccessfulFaceDeletionReason[];
  export type UnsuccessfulFaceDeletionsList = UnsuccessfulFaceDeletion[];
  export interface UnsuccessfulFaceDisassociation {
    /**
     * A unique identifier assigned to the face. 
     */
    FaceId?: FaceId;
    /**
     * A provided ID for the UserID. Unique within the collection. 
     */
    UserId?: UserId;
    /**
     * The reason why the deletion was unsuccessful. 
     */
    Reasons?: UnsuccessfulFaceDisassociationReasons;
  }
  export type UnsuccessfulFaceDisassociationList = UnsuccessfulFaceDisassociation[];
  export type UnsuccessfulFaceDisassociationReason = "FACE_NOT_FOUND"|"ASSOCIATED_TO_A_DIFFERENT_USER"|string;
  export type UnsuccessfulFaceDisassociationReasons = UnsuccessfulFaceDisassociationReason[];
  export interface UntagResourceRequest {
    /**
     *  Amazon Resource Name (ARN) of the model, collection, or stream processor that you want to remove the tags from. 
     */
    ResourceArn: ResourceArn;
    /**
     *  A list of the tags that you want to remove. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDatasetEntriesRequest {
    /**
     *  The Amazon Resource Name (ARN) of the dataset that you want to update. 
     */
    DatasetArn: DatasetArn;
    /**
     *  The changes that you want to make to the dataset. 
     */
    Changes: DatasetChanges;
  }
  export interface UpdateDatasetEntriesResponse {
  }
  export interface UpdateStreamProcessorRequest {
    /**
     *  Name of the stream processor that you want to update. 
     */
    Name: StreamProcessorName;
    /**
     *  The stream processor settings that you want to update. Label detection settings can be updated to detect different labels with a different minimum confidence. 
     */
    SettingsForUpdate?: StreamProcessorSettingsForUpdate;
    /**
     *  Specifies locations in the frames where Amazon Rekognition checks for objects or people. This is an optional parameter for label detection stream processors. 
     */
    RegionsOfInterestForUpdate?: RegionsOfInterest;
    /**
     *  Shows whether you are sharing data with Rekognition to improve model performance. You can choose this option at the account level or on a per-stream basis. Note that if you opt out at the account level this setting is ignored on individual streams. 
     */
    DataSharingPreferenceForUpdate?: StreamProcessorDataSharingPreference;
    /**
     *  A list of parameters you want to delete from the stream processor. 
     */
    ParametersToDelete?: StreamProcessorParametersToDelete;
  }
  export interface UpdateStreamProcessorResponse {
  }
  export type Url = string;
  export type Urls = Url[];
  export interface User {
    /**
     *  A provided ID for the User. Unique within the collection.
     */
    UserId?: UserId;
    /**
     *  Communicates if the UserID has been updated with latest set of faces to be associated with the UserID. 
     */
    UserStatus?: UserStatus;
  }
  export type UserFaceIdList = FaceId[];
  export type UserId = string;
  export type UserList = User[];
  export interface UserMatch {
    /**
     *  Describes the UserID metadata.
     */
    Similarity?: Percent;
    /**
     *  Confidence in the match of this UserID with the input face. 
     */
    User?: MatchedUser;
  }
  export type UserMatchList = UserMatch[];
  export type UserStatus = "ACTIVE"|"UPDATING"|"CREATING"|"CREATED"|string;
  export interface ValidationData {
    /**
     * The assets that comprise the validation data. 
     */
    Assets?: Assets;
  }
  export type VersionDescription = string;
  export type VersionName = string;
  export type VersionNames = VersionName[];
  export interface Video {
    /**
     * The Amazon S3 bucket name and file name for the video.
     */
    S3Object?: S3Object;
  }
  export type VideoColorRange = "FULL"|"LIMITED"|string;
  export type VideoJobStatus = "IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export interface VideoMetadata {
    /**
     * Type of compression used in the analyzed video. 
     */
    Codec?: String;
    /**
     * Length of the video in milliseconds.
     */
    DurationMillis?: ULong;
    /**
     * Format of the analyzed video. Possible values are MP4, MOV and AVI. 
     */
    Format?: String;
    /**
     * Number of frames per second in the video.
     */
    FrameRate?: Float;
    /**
     * Vertical pixel dimension of the video.
     */
    FrameHeight?: ULong;
    /**
     * Horizontal pixel dimension of the video.
     */
    FrameWidth?: ULong;
    /**
     *  A description of the range of luminance values in a video, either LIMITED (16 to 235) or FULL (0 to 255). 
     */
    ColorRange?: VideoColorRange;
  }
  export type VideoMetadataList = VideoMetadata[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-06-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Rekognition client.
   */
  export import Types = Rekognition;
}
export = Rekognition;
