import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class RoboMaker extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RoboMaker.Types.ClientConfiguration)
  config: Config & RoboMaker.Types.ClientConfiguration;
  /**
   * Deletes one or more worlds in a batch operation.
   */
  batchDeleteWorlds(params: RoboMaker.Types.BatchDeleteWorldsRequest, callback?: (err: AWSError, data: RoboMaker.Types.BatchDeleteWorldsResponse) => void): Request<RoboMaker.Types.BatchDeleteWorldsResponse, AWSError>;
  /**
   * Deletes one or more worlds in a batch operation.
   */
  batchDeleteWorlds(callback?: (err: AWSError, data: RoboMaker.Types.BatchDeleteWorldsResponse) => void): Request<RoboMaker.Types.BatchDeleteWorldsResponse, AWSError>;
  /**
   * Describes one or more simulation jobs.
   */
  batchDescribeSimulationJob(params: RoboMaker.Types.BatchDescribeSimulationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.BatchDescribeSimulationJobResponse) => void): Request<RoboMaker.Types.BatchDescribeSimulationJobResponse, AWSError>;
  /**
   * Describes one or more simulation jobs.
   */
  batchDescribeSimulationJob(callback?: (err: AWSError, data: RoboMaker.Types.BatchDescribeSimulationJobResponse) => void): Request<RoboMaker.Types.BatchDescribeSimulationJobResponse, AWSError>;
  /**
   * Cancels the specified deployment job.
   */
  cancelDeploymentJob(params: RoboMaker.Types.CancelDeploymentJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CancelDeploymentJobResponse) => void): Request<RoboMaker.Types.CancelDeploymentJobResponse, AWSError>;
  /**
   * Cancels the specified deployment job.
   */
  cancelDeploymentJob(callback?: (err: AWSError, data: RoboMaker.Types.CancelDeploymentJobResponse) => void): Request<RoboMaker.Types.CancelDeploymentJobResponse, AWSError>;
  /**
   * Cancels the specified simulation job.
   */
  cancelSimulationJob(params: RoboMaker.Types.CancelSimulationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CancelSimulationJobResponse) => void): Request<RoboMaker.Types.CancelSimulationJobResponse, AWSError>;
  /**
   * Cancels the specified simulation job.
   */
  cancelSimulationJob(callback?: (err: AWSError, data: RoboMaker.Types.CancelSimulationJobResponse) => void): Request<RoboMaker.Types.CancelSimulationJobResponse, AWSError>;
  /**
   * Cancels a simulation job batch. When you cancel a simulation job batch, you are also cancelling all of the active simulation jobs created as part of the batch. 
   */
  cancelSimulationJobBatch(params: RoboMaker.Types.CancelSimulationJobBatchRequest, callback?: (err: AWSError, data: RoboMaker.Types.CancelSimulationJobBatchResponse) => void): Request<RoboMaker.Types.CancelSimulationJobBatchResponse, AWSError>;
  /**
   * Cancels a simulation job batch. When you cancel a simulation job batch, you are also cancelling all of the active simulation jobs created as part of the batch. 
   */
  cancelSimulationJobBatch(callback?: (err: AWSError, data: RoboMaker.Types.CancelSimulationJobBatchResponse) => void): Request<RoboMaker.Types.CancelSimulationJobBatchResponse, AWSError>;
  /**
   * Cancels the specified export job.
   */
  cancelWorldExportJob(params: RoboMaker.Types.CancelWorldExportJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CancelWorldExportJobResponse) => void): Request<RoboMaker.Types.CancelWorldExportJobResponse, AWSError>;
  /**
   * Cancels the specified export job.
   */
  cancelWorldExportJob(callback?: (err: AWSError, data: RoboMaker.Types.CancelWorldExportJobResponse) => void): Request<RoboMaker.Types.CancelWorldExportJobResponse, AWSError>;
  /**
   * Cancels the specified world generator job.
   */
  cancelWorldGenerationJob(params: RoboMaker.Types.CancelWorldGenerationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CancelWorldGenerationJobResponse) => void): Request<RoboMaker.Types.CancelWorldGenerationJobResponse, AWSError>;
  /**
   * Cancels the specified world generator job.
   */
  cancelWorldGenerationJob(callback?: (err: AWSError, data: RoboMaker.Types.CancelWorldGenerationJobResponse) => void): Request<RoboMaker.Types.CancelWorldGenerationJobResponse, AWSError>;
  /**
   * Deploys a specific version of a robot application to robots in a fleet. The robot application must have a numbered applicationVersion for consistency reasons. To create a new version, use CreateRobotApplicationVersion or see Creating a Robot Application Version.   After 90 days, deployment jobs expire and will be deleted. They will no longer be accessible.  
   */
  createDeploymentJob(params: RoboMaker.Types.CreateDeploymentJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateDeploymentJobResponse) => void): Request<RoboMaker.Types.CreateDeploymentJobResponse, AWSError>;
  /**
   * Deploys a specific version of a robot application to robots in a fleet. The robot application must have a numbered applicationVersion for consistency reasons. To create a new version, use CreateRobotApplicationVersion or see Creating a Robot Application Version.   After 90 days, deployment jobs expire and will be deleted. They will no longer be accessible.  
   */
  createDeploymentJob(callback?: (err: AWSError, data: RoboMaker.Types.CreateDeploymentJobResponse) => void): Request<RoboMaker.Types.CreateDeploymentJobResponse, AWSError>;
  /**
   * Creates a fleet, a logical group of robots running the same robot application.
   */
  createFleet(params: RoboMaker.Types.CreateFleetRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateFleetResponse) => void): Request<RoboMaker.Types.CreateFleetResponse, AWSError>;
  /**
   * Creates a fleet, a logical group of robots running the same robot application.
   */
  createFleet(callback?: (err: AWSError, data: RoboMaker.Types.CreateFleetResponse) => void): Request<RoboMaker.Types.CreateFleetResponse, AWSError>;
  /**
   * Creates a robot.
   */
  createRobot(params: RoboMaker.Types.CreateRobotRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateRobotResponse) => void): Request<RoboMaker.Types.CreateRobotResponse, AWSError>;
  /**
   * Creates a robot.
   */
  createRobot(callback?: (err: AWSError, data: RoboMaker.Types.CreateRobotResponse) => void): Request<RoboMaker.Types.CreateRobotResponse, AWSError>;
  /**
   * Creates a robot application. 
   */
  createRobotApplication(params: RoboMaker.Types.CreateRobotApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateRobotApplicationResponse) => void): Request<RoboMaker.Types.CreateRobotApplicationResponse, AWSError>;
  /**
   * Creates a robot application. 
   */
  createRobotApplication(callback?: (err: AWSError, data: RoboMaker.Types.CreateRobotApplicationResponse) => void): Request<RoboMaker.Types.CreateRobotApplicationResponse, AWSError>;
  /**
   * Creates a version of a robot application.
   */
  createRobotApplicationVersion(params: RoboMaker.Types.CreateRobotApplicationVersionRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateRobotApplicationVersionResponse) => void): Request<RoboMaker.Types.CreateRobotApplicationVersionResponse, AWSError>;
  /**
   * Creates a version of a robot application.
   */
  createRobotApplicationVersion(callback?: (err: AWSError, data: RoboMaker.Types.CreateRobotApplicationVersionResponse) => void): Request<RoboMaker.Types.CreateRobotApplicationVersionResponse, AWSError>;
  /**
   * Creates a simulation application.
   */
  createSimulationApplication(params: RoboMaker.Types.CreateSimulationApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateSimulationApplicationResponse) => void): Request<RoboMaker.Types.CreateSimulationApplicationResponse, AWSError>;
  /**
   * Creates a simulation application.
   */
  createSimulationApplication(callback?: (err: AWSError, data: RoboMaker.Types.CreateSimulationApplicationResponse) => void): Request<RoboMaker.Types.CreateSimulationApplicationResponse, AWSError>;
  /**
   * Creates a simulation application with a specific revision id.
   */
  createSimulationApplicationVersion(params: RoboMaker.Types.CreateSimulationApplicationVersionRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateSimulationApplicationVersionResponse) => void): Request<RoboMaker.Types.CreateSimulationApplicationVersionResponse, AWSError>;
  /**
   * Creates a simulation application with a specific revision id.
   */
  createSimulationApplicationVersion(callback?: (err: AWSError, data: RoboMaker.Types.CreateSimulationApplicationVersionResponse) => void): Request<RoboMaker.Types.CreateSimulationApplicationVersionResponse, AWSError>;
  /**
   * Creates a simulation job.  After 90 days, simulation jobs expire and will be deleted. They will no longer be accessible.  
   */
  createSimulationJob(params: RoboMaker.Types.CreateSimulationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateSimulationJobResponse) => void): Request<RoboMaker.Types.CreateSimulationJobResponse, AWSError>;
  /**
   * Creates a simulation job.  After 90 days, simulation jobs expire and will be deleted. They will no longer be accessible.  
   */
  createSimulationJob(callback?: (err: AWSError, data: RoboMaker.Types.CreateSimulationJobResponse) => void): Request<RoboMaker.Types.CreateSimulationJobResponse, AWSError>;
  /**
   * Creates a world export job.
   */
  createWorldExportJob(params: RoboMaker.Types.CreateWorldExportJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateWorldExportJobResponse) => void): Request<RoboMaker.Types.CreateWorldExportJobResponse, AWSError>;
  /**
   * Creates a world export job.
   */
  createWorldExportJob(callback?: (err: AWSError, data: RoboMaker.Types.CreateWorldExportJobResponse) => void): Request<RoboMaker.Types.CreateWorldExportJobResponse, AWSError>;
  /**
   * Creates worlds using the specified template.
   */
  createWorldGenerationJob(params: RoboMaker.Types.CreateWorldGenerationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateWorldGenerationJobResponse) => void): Request<RoboMaker.Types.CreateWorldGenerationJobResponse, AWSError>;
  /**
   * Creates worlds using the specified template.
   */
  createWorldGenerationJob(callback?: (err: AWSError, data: RoboMaker.Types.CreateWorldGenerationJobResponse) => void): Request<RoboMaker.Types.CreateWorldGenerationJobResponse, AWSError>;
  /**
   * Creates a world template.
   */
  createWorldTemplate(params: RoboMaker.Types.CreateWorldTemplateRequest, callback?: (err: AWSError, data: RoboMaker.Types.CreateWorldTemplateResponse) => void): Request<RoboMaker.Types.CreateWorldTemplateResponse, AWSError>;
  /**
   * Creates a world template.
   */
  createWorldTemplate(callback?: (err: AWSError, data: RoboMaker.Types.CreateWorldTemplateResponse) => void): Request<RoboMaker.Types.CreateWorldTemplateResponse, AWSError>;
  /**
   * Deletes a fleet.
   */
  deleteFleet(params: RoboMaker.Types.DeleteFleetRequest, callback?: (err: AWSError, data: RoboMaker.Types.DeleteFleetResponse) => void): Request<RoboMaker.Types.DeleteFleetResponse, AWSError>;
  /**
   * Deletes a fleet.
   */
  deleteFleet(callback?: (err: AWSError, data: RoboMaker.Types.DeleteFleetResponse) => void): Request<RoboMaker.Types.DeleteFleetResponse, AWSError>;
  /**
   * Deletes a robot.
   */
  deleteRobot(params: RoboMaker.Types.DeleteRobotRequest, callback?: (err: AWSError, data: RoboMaker.Types.DeleteRobotResponse) => void): Request<RoboMaker.Types.DeleteRobotResponse, AWSError>;
  /**
   * Deletes a robot.
   */
  deleteRobot(callback?: (err: AWSError, data: RoboMaker.Types.DeleteRobotResponse) => void): Request<RoboMaker.Types.DeleteRobotResponse, AWSError>;
  /**
   * Deletes a robot application.
   */
  deleteRobotApplication(params: RoboMaker.Types.DeleteRobotApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.DeleteRobotApplicationResponse) => void): Request<RoboMaker.Types.DeleteRobotApplicationResponse, AWSError>;
  /**
   * Deletes a robot application.
   */
  deleteRobotApplication(callback?: (err: AWSError, data: RoboMaker.Types.DeleteRobotApplicationResponse) => void): Request<RoboMaker.Types.DeleteRobotApplicationResponse, AWSError>;
  /**
   * Deletes a simulation application.
   */
  deleteSimulationApplication(params: RoboMaker.Types.DeleteSimulationApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.DeleteSimulationApplicationResponse) => void): Request<RoboMaker.Types.DeleteSimulationApplicationResponse, AWSError>;
  /**
   * Deletes a simulation application.
   */
  deleteSimulationApplication(callback?: (err: AWSError, data: RoboMaker.Types.DeleteSimulationApplicationResponse) => void): Request<RoboMaker.Types.DeleteSimulationApplicationResponse, AWSError>;
  /**
   * Deletes a world template.
   */
  deleteWorldTemplate(params: RoboMaker.Types.DeleteWorldTemplateRequest, callback?: (err: AWSError, data: RoboMaker.Types.DeleteWorldTemplateResponse) => void): Request<RoboMaker.Types.DeleteWorldTemplateResponse, AWSError>;
  /**
   * Deletes a world template.
   */
  deleteWorldTemplate(callback?: (err: AWSError, data: RoboMaker.Types.DeleteWorldTemplateResponse) => void): Request<RoboMaker.Types.DeleteWorldTemplateResponse, AWSError>;
  /**
   * Deregisters a robot.
   */
  deregisterRobot(params: RoboMaker.Types.DeregisterRobotRequest, callback?: (err: AWSError, data: RoboMaker.Types.DeregisterRobotResponse) => void): Request<RoboMaker.Types.DeregisterRobotResponse, AWSError>;
  /**
   * Deregisters a robot.
   */
  deregisterRobot(callback?: (err: AWSError, data: RoboMaker.Types.DeregisterRobotResponse) => void): Request<RoboMaker.Types.DeregisterRobotResponse, AWSError>;
  /**
   * Describes a deployment job.
   */
  describeDeploymentJob(params: RoboMaker.Types.DescribeDeploymentJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeDeploymentJobResponse) => void): Request<RoboMaker.Types.DescribeDeploymentJobResponse, AWSError>;
  /**
   * Describes a deployment job.
   */
  describeDeploymentJob(callback?: (err: AWSError, data: RoboMaker.Types.DescribeDeploymentJobResponse) => void): Request<RoboMaker.Types.DescribeDeploymentJobResponse, AWSError>;
  /**
   * Describes a fleet.
   */
  describeFleet(params: RoboMaker.Types.DescribeFleetRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeFleetResponse) => void): Request<RoboMaker.Types.DescribeFleetResponse, AWSError>;
  /**
   * Describes a fleet.
   */
  describeFleet(callback?: (err: AWSError, data: RoboMaker.Types.DescribeFleetResponse) => void): Request<RoboMaker.Types.DescribeFleetResponse, AWSError>;
  /**
   * Describes a robot.
   */
  describeRobot(params: RoboMaker.Types.DescribeRobotRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeRobotResponse) => void): Request<RoboMaker.Types.DescribeRobotResponse, AWSError>;
  /**
   * Describes a robot.
   */
  describeRobot(callback?: (err: AWSError, data: RoboMaker.Types.DescribeRobotResponse) => void): Request<RoboMaker.Types.DescribeRobotResponse, AWSError>;
  /**
   * Describes a robot application.
   */
  describeRobotApplication(params: RoboMaker.Types.DescribeRobotApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeRobotApplicationResponse) => void): Request<RoboMaker.Types.DescribeRobotApplicationResponse, AWSError>;
  /**
   * Describes a robot application.
   */
  describeRobotApplication(callback?: (err: AWSError, data: RoboMaker.Types.DescribeRobotApplicationResponse) => void): Request<RoboMaker.Types.DescribeRobotApplicationResponse, AWSError>;
  /**
   * Describes a simulation application.
   */
  describeSimulationApplication(params: RoboMaker.Types.DescribeSimulationApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeSimulationApplicationResponse) => void): Request<RoboMaker.Types.DescribeSimulationApplicationResponse, AWSError>;
  /**
   * Describes a simulation application.
   */
  describeSimulationApplication(callback?: (err: AWSError, data: RoboMaker.Types.DescribeSimulationApplicationResponse) => void): Request<RoboMaker.Types.DescribeSimulationApplicationResponse, AWSError>;
  /**
   * Describes a simulation job.
   */
  describeSimulationJob(params: RoboMaker.Types.DescribeSimulationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeSimulationJobResponse) => void): Request<RoboMaker.Types.DescribeSimulationJobResponse, AWSError>;
  /**
   * Describes a simulation job.
   */
  describeSimulationJob(callback?: (err: AWSError, data: RoboMaker.Types.DescribeSimulationJobResponse) => void): Request<RoboMaker.Types.DescribeSimulationJobResponse, AWSError>;
  /**
   * Describes a simulation job batch.
   */
  describeSimulationJobBatch(params: RoboMaker.Types.DescribeSimulationJobBatchRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeSimulationJobBatchResponse) => void): Request<RoboMaker.Types.DescribeSimulationJobBatchResponse, AWSError>;
  /**
   * Describes a simulation job batch.
   */
  describeSimulationJobBatch(callback?: (err: AWSError, data: RoboMaker.Types.DescribeSimulationJobBatchResponse) => void): Request<RoboMaker.Types.DescribeSimulationJobBatchResponse, AWSError>;
  /**
   * Describes a world.
   */
  describeWorld(params: RoboMaker.Types.DescribeWorldRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldResponse) => void): Request<RoboMaker.Types.DescribeWorldResponse, AWSError>;
  /**
   * Describes a world.
   */
  describeWorld(callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldResponse) => void): Request<RoboMaker.Types.DescribeWorldResponse, AWSError>;
  /**
   * Describes a world export job.
   */
  describeWorldExportJob(params: RoboMaker.Types.DescribeWorldExportJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldExportJobResponse) => void): Request<RoboMaker.Types.DescribeWorldExportJobResponse, AWSError>;
  /**
   * Describes a world export job.
   */
  describeWorldExportJob(callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldExportJobResponse) => void): Request<RoboMaker.Types.DescribeWorldExportJobResponse, AWSError>;
  /**
   * Describes a world generation job.
   */
  describeWorldGenerationJob(params: RoboMaker.Types.DescribeWorldGenerationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldGenerationJobResponse) => void): Request<RoboMaker.Types.DescribeWorldGenerationJobResponse, AWSError>;
  /**
   * Describes a world generation job.
   */
  describeWorldGenerationJob(callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldGenerationJobResponse) => void): Request<RoboMaker.Types.DescribeWorldGenerationJobResponse, AWSError>;
  /**
   * Describes a world template.
   */
  describeWorldTemplate(params: RoboMaker.Types.DescribeWorldTemplateRequest, callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldTemplateResponse) => void): Request<RoboMaker.Types.DescribeWorldTemplateResponse, AWSError>;
  /**
   * Describes a world template.
   */
  describeWorldTemplate(callback?: (err: AWSError, data: RoboMaker.Types.DescribeWorldTemplateResponse) => void): Request<RoboMaker.Types.DescribeWorldTemplateResponse, AWSError>;
  /**
   * Gets the world template body.
   */
  getWorldTemplateBody(params: RoboMaker.Types.GetWorldTemplateBodyRequest, callback?: (err: AWSError, data: RoboMaker.Types.GetWorldTemplateBodyResponse) => void): Request<RoboMaker.Types.GetWorldTemplateBodyResponse, AWSError>;
  /**
   * Gets the world template body.
   */
  getWorldTemplateBody(callback?: (err: AWSError, data: RoboMaker.Types.GetWorldTemplateBodyResponse) => void): Request<RoboMaker.Types.GetWorldTemplateBodyResponse, AWSError>;
  /**
   * Returns a list of deployment jobs for a fleet. You can optionally provide filters to retrieve specific deployment jobs. 
   */
  listDeploymentJobs(params: RoboMaker.Types.ListDeploymentJobsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListDeploymentJobsResponse) => void): Request<RoboMaker.Types.ListDeploymentJobsResponse, AWSError>;
  /**
   * Returns a list of deployment jobs for a fleet. You can optionally provide filters to retrieve specific deployment jobs. 
   */
  listDeploymentJobs(callback?: (err: AWSError, data: RoboMaker.Types.ListDeploymentJobsResponse) => void): Request<RoboMaker.Types.ListDeploymentJobsResponse, AWSError>;
  /**
   * Returns a list of fleets. You can optionally provide filters to retrieve specific fleets. 
   */
  listFleets(params: RoboMaker.Types.ListFleetsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListFleetsResponse) => void): Request<RoboMaker.Types.ListFleetsResponse, AWSError>;
  /**
   * Returns a list of fleets. You can optionally provide filters to retrieve specific fleets. 
   */
  listFleets(callback?: (err: AWSError, data: RoboMaker.Types.ListFleetsResponse) => void): Request<RoboMaker.Types.ListFleetsResponse, AWSError>;
  /**
   * Returns a list of robot application. You can optionally provide filters to retrieve specific robot applications.
   */
  listRobotApplications(params: RoboMaker.Types.ListRobotApplicationsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListRobotApplicationsResponse) => void): Request<RoboMaker.Types.ListRobotApplicationsResponse, AWSError>;
  /**
   * Returns a list of robot application. You can optionally provide filters to retrieve specific robot applications.
   */
  listRobotApplications(callback?: (err: AWSError, data: RoboMaker.Types.ListRobotApplicationsResponse) => void): Request<RoboMaker.Types.ListRobotApplicationsResponse, AWSError>;
  /**
   * Returns a list of robots. You can optionally provide filters to retrieve specific robots.
   */
  listRobots(params: RoboMaker.Types.ListRobotsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListRobotsResponse) => void): Request<RoboMaker.Types.ListRobotsResponse, AWSError>;
  /**
   * Returns a list of robots. You can optionally provide filters to retrieve specific robots.
   */
  listRobots(callback?: (err: AWSError, data: RoboMaker.Types.ListRobotsResponse) => void): Request<RoboMaker.Types.ListRobotsResponse, AWSError>;
  /**
   * Returns a list of simulation applications. You can optionally provide filters to retrieve specific simulation applications. 
   */
  listSimulationApplications(params: RoboMaker.Types.ListSimulationApplicationsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListSimulationApplicationsResponse) => void): Request<RoboMaker.Types.ListSimulationApplicationsResponse, AWSError>;
  /**
   * Returns a list of simulation applications. You can optionally provide filters to retrieve specific simulation applications. 
   */
  listSimulationApplications(callback?: (err: AWSError, data: RoboMaker.Types.ListSimulationApplicationsResponse) => void): Request<RoboMaker.Types.ListSimulationApplicationsResponse, AWSError>;
  /**
   * Returns a list simulation job batches. You can optionally provide filters to retrieve specific simulation batch jobs. 
   */
  listSimulationJobBatches(params: RoboMaker.Types.ListSimulationJobBatchesRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListSimulationJobBatchesResponse) => void): Request<RoboMaker.Types.ListSimulationJobBatchesResponse, AWSError>;
  /**
   * Returns a list simulation job batches. You can optionally provide filters to retrieve specific simulation batch jobs. 
   */
  listSimulationJobBatches(callback?: (err: AWSError, data: RoboMaker.Types.ListSimulationJobBatchesResponse) => void): Request<RoboMaker.Types.ListSimulationJobBatchesResponse, AWSError>;
  /**
   * Returns a list of simulation jobs. You can optionally provide filters to retrieve specific simulation jobs. 
   */
  listSimulationJobs(params: RoboMaker.Types.ListSimulationJobsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListSimulationJobsResponse) => void): Request<RoboMaker.Types.ListSimulationJobsResponse, AWSError>;
  /**
   * Returns a list of simulation jobs. You can optionally provide filters to retrieve specific simulation jobs. 
   */
  listSimulationJobs(callback?: (err: AWSError, data: RoboMaker.Types.ListSimulationJobsResponse) => void): Request<RoboMaker.Types.ListSimulationJobsResponse, AWSError>;
  /**
   * Lists all tags on a AWS RoboMaker resource.
   */
  listTagsForResource(params: RoboMaker.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListTagsForResourceResponse) => void): Request<RoboMaker.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags on a AWS RoboMaker resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: RoboMaker.Types.ListTagsForResourceResponse) => void): Request<RoboMaker.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists world export jobs.
   */
  listWorldExportJobs(params: RoboMaker.Types.ListWorldExportJobsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListWorldExportJobsResponse) => void): Request<RoboMaker.Types.ListWorldExportJobsResponse, AWSError>;
  /**
   * Lists world export jobs.
   */
  listWorldExportJobs(callback?: (err: AWSError, data: RoboMaker.Types.ListWorldExportJobsResponse) => void): Request<RoboMaker.Types.ListWorldExportJobsResponse, AWSError>;
  /**
   * Lists world generator jobs.
   */
  listWorldGenerationJobs(params: RoboMaker.Types.ListWorldGenerationJobsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListWorldGenerationJobsResponse) => void): Request<RoboMaker.Types.ListWorldGenerationJobsResponse, AWSError>;
  /**
   * Lists world generator jobs.
   */
  listWorldGenerationJobs(callback?: (err: AWSError, data: RoboMaker.Types.ListWorldGenerationJobsResponse) => void): Request<RoboMaker.Types.ListWorldGenerationJobsResponse, AWSError>;
  /**
   * Lists world templates.
   */
  listWorldTemplates(params: RoboMaker.Types.ListWorldTemplatesRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListWorldTemplatesResponse) => void): Request<RoboMaker.Types.ListWorldTemplatesResponse, AWSError>;
  /**
   * Lists world templates.
   */
  listWorldTemplates(callback?: (err: AWSError, data: RoboMaker.Types.ListWorldTemplatesResponse) => void): Request<RoboMaker.Types.ListWorldTemplatesResponse, AWSError>;
  /**
   * Lists worlds.
   */
  listWorlds(params: RoboMaker.Types.ListWorldsRequest, callback?: (err: AWSError, data: RoboMaker.Types.ListWorldsResponse) => void): Request<RoboMaker.Types.ListWorldsResponse, AWSError>;
  /**
   * Lists worlds.
   */
  listWorlds(callback?: (err: AWSError, data: RoboMaker.Types.ListWorldsResponse) => void): Request<RoboMaker.Types.ListWorldsResponse, AWSError>;
  /**
   * Registers a robot with a fleet.
   */
  registerRobot(params: RoboMaker.Types.RegisterRobotRequest, callback?: (err: AWSError, data: RoboMaker.Types.RegisterRobotResponse) => void): Request<RoboMaker.Types.RegisterRobotResponse, AWSError>;
  /**
   * Registers a robot with a fleet.
   */
  registerRobot(callback?: (err: AWSError, data: RoboMaker.Types.RegisterRobotResponse) => void): Request<RoboMaker.Types.RegisterRobotResponse, AWSError>;
  /**
   * Restarts a running simulation job.
   */
  restartSimulationJob(params: RoboMaker.Types.RestartSimulationJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.RestartSimulationJobResponse) => void): Request<RoboMaker.Types.RestartSimulationJobResponse, AWSError>;
  /**
   * Restarts a running simulation job.
   */
  restartSimulationJob(callback?: (err: AWSError, data: RoboMaker.Types.RestartSimulationJobResponse) => void): Request<RoboMaker.Types.RestartSimulationJobResponse, AWSError>;
  /**
   * Starts a new simulation job batch. The batch is defined using one or more SimulationJobRequest objects. 
   */
  startSimulationJobBatch(params: RoboMaker.Types.StartSimulationJobBatchRequest, callback?: (err: AWSError, data: RoboMaker.Types.StartSimulationJobBatchResponse) => void): Request<RoboMaker.Types.StartSimulationJobBatchResponse, AWSError>;
  /**
   * Starts a new simulation job batch. The batch is defined using one or more SimulationJobRequest objects. 
   */
  startSimulationJobBatch(callback?: (err: AWSError, data: RoboMaker.Types.StartSimulationJobBatchResponse) => void): Request<RoboMaker.Types.StartSimulationJobBatchResponse, AWSError>;
  /**
   * Syncrhonizes robots in a fleet to the latest deployment. This is helpful if robots were added after a deployment.
   */
  syncDeploymentJob(params: RoboMaker.Types.SyncDeploymentJobRequest, callback?: (err: AWSError, data: RoboMaker.Types.SyncDeploymentJobResponse) => void): Request<RoboMaker.Types.SyncDeploymentJobResponse, AWSError>;
  /**
   * Syncrhonizes robots in a fleet to the latest deployment. This is helpful if robots were added after a deployment.
   */
  syncDeploymentJob(callback?: (err: AWSError, data: RoboMaker.Types.SyncDeploymentJobResponse) => void): Request<RoboMaker.Types.SyncDeploymentJobResponse, AWSError>;
  /**
   * Adds or edits tags for a AWS RoboMaker resource. Each tag consists of a tag key and a tag value. Tag keys and tag values are both required, but tag values can be empty strings.  For information about the rules that apply to tag keys and tag values, see User-Defined Tag Restrictions in the AWS Billing and Cost Management User Guide. 
   */
  tagResource(params: RoboMaker.Types.TagResourceRequest, callback?: (err: AWSError, data: RoboMaker.Types.TagResourceResponse) => void): Request<RoboMaker.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or edits tags for a AWS RoboMaker resource. Each tag consists of a tag key and a tag value. Tag keys and tag values are both required, but tag values can be empty strings.  For information about the rules that apply to tag keys and tag values, see User-Defined Tag Restrictions in the AWS Billing and Cost Management User Guide. 
   */
  tagResource(callback?: (err: AWSError, data: RoboMaker.Types.TagResourceResponse) => void): Request<RoboMaker.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified AWS RoboMaker resource. To remove a tag, specify the tag key. To change the tag value of an existing tag key, use  TagResource . 
   */
  untagResource(params: RoboMaker.Types.UntagResourceRequest, callback?: (err: AWSError, data: RoboMaker.Types.UntagResourceResponse) => void): Request<RoboMaker.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified AWS RoboMaker resource. To remove a tag, specify the tag key. To change the tag value of an existing tag key, use  TagResource . 
   */
  untagResource(callback?: (err: AWSError, data: RoboMaker.Types.UntagResourceResponse) => void): Request<RoboMaker.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a robot application.
   */
  updateRobotApplication(params: RoboMaker.Types.UpdateRobotApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.UpdateRobotApplicationResponse) => void): Request<RoboMaker.Types.UpdateRobotApplicationResponse, AWSError>;
  /**
   * Updates a robot application.
   */
  updateRobotApplication(callback?: (err: AWSError, data: RoboMaker.Types.UpdateRobotApplicationResponse) => void): Request<RoboMaker.Types.UpdateRobotApplicationResponse, AWSError>;
  /**
   * Updates a simulation application.
   */
  updateSimulationApplication(params: RoboMaker.Types.UpdateSimulationApplicationRequest, callback?: (err: AWSError, data: RoboMaker.Types.UpdateSimulationApplicationResponse) => void): Request<RoboMaker.Types.UpdateSimulationApplicationResponse, AWSError>;
  /**
   * Updates a simulation application.
   */
  updateSimulationApplication(callback?: (err: AWSError, data: RoboMaker.Types.UpdateSimulationApplicationResponse) => void): Request<RoboMaker.Types.UpdateSimulationApplicationResponse, AWSError>;
  /**
   * Updates a world template.
   */
  updateWorldTemplate(params: RoboMaker.Types.UpdateWorldTemplateRequest, callback?: (err: AWSError, data: RoboMaker.Types.UpdateWorldTemplateResponse) => void): Request<RoboMaker.Types.UpdateWorldTemplateResponse, AWSError>;
  /**
   * Updates a world template.
   */
  updateWorldTemplate(callback?: (err: AWSError, data: RoboMaker.Types.UpdateWorldTemplateResponse) => void): Request<RoboMaker.Types.UpdateWorldTemplateResponse, AWSError>;
}
declare namespace RoboMaker {
  export type Architecture = "X86_64"|"ARM64"|"ARMHF"|string;
  export type Arn = string;
  export type Arns = Arn[];
  export interface BatchDeleteWorldsRequest {
    /**
     * A list of Amazon Resource Names (arns) that correspond to worlds to delete.
     */
    worlds: Arns;
  }
  export interface BatchDeleteWorldsResponse {
    /**
     * A list of unprocessed worlds associated with the call. These worlds were not deleted.
     */
    unprocessedWorlds?: Arns;
  }
  export interface BatchDescribeSimulationJobRequest {
    /**
     * A list of Amazon Resource Names (ARNs) of simulation jobs to describe.
     */
    jobs: Arns;
  }
  export interface BatchDescribeSimulationJobResponse {
    /**
     * A list of simulation jobs.
     */
    jobs?: SimulationJobs;
    /**
     * A list of unprocessed simulation job Amazon Resource Names (ARNs).
     */
    unprocessedJobs?: Arns;
  }
  export interface BatchPolicy {
    /**
     * The amount of time, in seconds, to wait for the batch to complete.  If a batch times out, and there are pending requests that were failing due to an internal failure (like InternalServiceError), they will be moved to the failed list and the batch status will be Failed. If the pending requests were failing for any other reason, the failed pending requests will be moved to the failed list and the batch status will be TimedOut. 
     */
    timeoutInSeconds?: BatchTimeoutInSeconds;
    /**
     * The number of active simulation jobs create as part of the batch that can be in an active state at the same time.  Active states include: Pending,Preparing, Running, Restarting, RunningFailed and Terminating. All other states are terminal states. 
     */
    maxConcurrency?: MaxConcurrency;
  }
  export type BatchTimeoutInSeconds = number;
  export type Boolean = boolean;
  export type BoxedBoolean = boolean;
  export interface CancelDeploymentJobRequest {
    /**
     * The deployment job ARN to cancel.
     */
    job: Arn;
  }
  export interface CancelDeploymentJobResponse {
  }
  export interface CancelSimulationJobBatchRequest {
    /**
     * The id of the batch to cancel.
     */
    batch: Arn;
  }
  export interface CancelSimulationJobBatchResponse {
  }
  export interface CancelSimulationJobRequest {
    /**
     * The simulation job ARN to cancel.
     */
    job: Arn;
  }
  export interface CancelSimulationJobResponse {
  }
  export interface CancelWorldExportJobRequest {
    /**
     * The Amazon Resource Name (arn) of the world export job to cancel.
     */
    job: Arn;
  }
  export interface CancelWorldExportJobResponse {
  }
  export interface CancelWorldGenerationJobRequest {
    /**
     * The Amazon Resource Name (arn) of the world generator job to cancel.
     */
    job: Arn;
  }
  export interface CancelWorldGenerationJobResponse {
  }
  export type ClientRequestToken = string;
  export type Command = string;
  export type CommandList = NonEmptyString[];
  export interface Compute {
    /**
     * The simulation unit limit. Your simulation is allocated CPU and memory proportional to the supplied simulation unit limit. A simulation unit is 1 vcpu and 2GB of memory. You are only billed for the SU utilization you consume up to the maximum value provided. The default is 15. 
     */
    simulationUnitLimit?: SimulationUnit;
    /**
     * Compute type information for the simulation job.
     */
    computeType?: ComputeType;
    /**
     * Compute GPU unit limit for the simulation job. It is the same as the number of GPUs allocated to the SimulationJob.
     */
    gpuUnitLimit?: GPUUnit;
  }
  export interface ComputeResponse {
    /**
     * The simulation unit limit. Your simulation is allocated CPU and memory proportional to the supplied simulation unit limit. A simulation unit is 1 vcpu and 2GB of memory. You are only billed for the SU utilization you consume up to the maximum value provided. The default is 15. 
     */
    simulationUnitLimit?: SimulationUnit;
    /**
     * Compute type response information for the simulation job.
     */
    computeType?: ComputeType;
    /**
     * Compute GPU unit limit for the simulation job. It is the same as the number of GPUs allocated to the SimulationJob.
     */
    gpuUnitLimit?: GPUUnit;
  }
  export type ComputeType = "CPU"|"GPU_AND_CPU"|string;
  export interface CreateDeploymentJobRequest {
    /**
     * The requested deployment configuration.
     */
    deploymentConfig?: DeploymentConfig;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken: ClientRequestToken;
    /**
     * The Amazon Resource Name (ARN) of the fleet to deploy.
     */
    fleet: Arn;
    /**
     * The deployment application configuration.
     */
    deploymentApplicationConfigs: DeploymentApplicationConfigs;
    /**
     * A map that contains tag keys and tag values that are attached to the deployment job.
     */
    tags?: TagMap;
  }
  export interface CreateDeploymentJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the deployment job.
     */
    arn?: Arn;
    /**
     * The target fleet for the deployment job.
     */
    fleet?: Arn;
    /**
     * The status of the deployment job.
     */
    status?: DeploymentStatus;
    /**
     * The deployment application configuration.
     */
    deploymentApplicationConfigs?: DeploymentApplicationConfigs;
    /**
     * The failure reason of the deployment job if it failed.
     */
    failureReason?: GenericString;
    /**
     * The failure code of the simulation job if it failed:  BadPermissionError  AWS Greengrass requires a service-level role permission to access other services. The role must include the  AWSGreengrassResourceAccessRolePolicy managed policy.   ExtractingBundleFailure  The robot application could not be extracted from the bundle.  FailureThresholdBreached  The percentage of robots that could not be updated exceeded the percentage set for the deployment.  GreengrassDeploymentFailed  The robot application could not be deployed to the robot.  GreengrassGroupVersionDoesNotExist  The AWS Greengrass group or version associated with a robot is missing.  InternalServerError  An internal error has occurred. Retry your request, but if the problem persists, contact us with details.  MissingRobotApplicationArchitecture  The robot application does not have a source that matches the architecture of the robot.  MissingRobotDeploymentResource  One or more of the resources specified for the robot application are missing. For example, does the robot application have the correct launch package and launch file?  PostLaunchFileFailure  The post-launch script failed.  PreLaunchFileFailure  The pre-launch script failed.  ResourceNotFound  One or more deployment resources are missing. For example, do robot application source bundles still exist?   RobotDeploymentNoResponse  There is no response from the robot. It might not be powered on or connected to the internet.  
     */
    failureCode?: DeploymentJobErrorCode;
    /**
     * The time, in milliseconds since the epoch, when the fleet was created.
     */
    createdAt?: CreatedAt;
    /**
     * The deployment configuration.
     */
    deploymentConfig?: DeploymentConfig;
    /**
     * The list of all tags added to the deployment job.
     */
    tags?: TagMap;
  }
  export interface CreateFleetRequest {
    /**
     * The name of the fleet.
     */
    name: Name;
    /**
     * A map that contains tag keys and tag values that are attached to the fleet.
     */
    tags?: TagMap;
  }
  export interface CreateFleetResponse {
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    arn?: Arn;
    /**
     * The name of the fleet.
     */
    name?: Name;
    /**
     * The time, in milliseconds since the epoch, when the fleet was created.
     */
    createdAt?: CreatedAt;
    /**
     * The list of all tags added to the fleet.
     */
    tags?: TagMap;
  }
  export interface CreateRobotApplicationRequest {
    /**
     * The name of the robot application.
     */
    name: Name;
    /**
     * The sources of the robot application.
     */
    sources?: SourceConfigs;
    /**
     * The robot software suite (ROS distribuition) used by the robot application.
     */
    robotSoftwareSuite: RobotSoftwareSuite;
    /**
     * A map that contains tag keys and tag values that are attached to the robot application.
     */
    tags?: TagMap;
    /**
     * The object that contains that URI of the Docker image that you use for your robot application.
     */
    environment?: Environment;
  }
  export interface CreateRobotApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the robot application.
     */
    arn?: Arn;
    /**
     * The name of the robot application.
     */
    name?: Name;
    /**
     * The version of the robot application.
     */
    version?: Version;
    /**
     * The sources of the robot application.
     */
    sources?: Sources;
    /**
     * The robot software suite (ROS distribution) used by the robot application.
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The time, in milliseconds since the epoch, when the robot application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The revision id of the robot application.
     */
    revisionId?: RevisionId;
    /**
     * The list of all tags added to the robot application.
     */
    tags?: TagMap;
    /**
     * An object that contains the Docker image URI used to a create your robot application.
     */
    environment?: Environment;
  }
  export interface CreateRobotApplicationVersionRequest {
    /**
     * The application information for the robot application.
     */
    application: Arn;
    /**
     * The current revision id for the robot application. If you provide a value and it matches the latest revision ID, a new version will be created.
     */
    currentRevisionId?: RevisionId;
    /**
     * The Amazon S3 identifier for the zip file bundle that you use for your robot application.
     */
    s3Etags?: S3Etags;
    /**
     * A SHA256 identifier for the Docker image that you use for your robot application.
     */
    imageDigest?: ImageDigest;
  }
  export interface CreateRobotApplicationVersionResponse {
    /**
     * The Amazon Resource Name (ARN) of the robot application.
     */
    arn?: Arn;
    /**
     * The name of the robot application.
     */
    name?: Name;
    /**
     * The version of the robot application.
     */
    version?: Version;
    /**
     * The sources of the robot application.
     */
    sources?: Sources;
    /**
     * The robot software suite (ROS distribution) used by the robot application.
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The time, in milliseconds since the epoch, when the robot application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The revision id of the robot application.
     */
    revisionId?: RevisionId;
    /**
     * The object that contains the Docker image URI used to create your robot application.
     */
    environment?: Environment;
  }
  export interface CreateRobotRequest {
    /**
     * The name for the robot.
     */
    name: Name;
    /**
     * The target architecture of the robot.
     */
    architecture: Architecture;
    /**
     * The Greengrass group id.
     */
    greengrassGroupId: Id;
    /**
     * A map that contains tag keys and tag values that are attached to the robot.
     */
    tags?: TagMap;
  }
  export interface CreateRobotResponse {
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    arn?: Arn;
    /**
     * The name of the robot.
     */
    name?: Name;
    /**
     * The time, in milliseconds since the epoch, when the robot was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon Resource Name (ARN) of the Greengrass group associated with the robot.
     */
    greengrassGroupId?: Id;
    /**
     * The target architecture of the robot.
     */
    architecture?: Architecture;
    /**
     * The list of all tags added to the robot.
     */
    tags?: TagMap;
  }
  export interface CreateSimulationApplicationRequest {
    /**
     * The name of the simulation application.
     */
    name: Name;
    /**
     * The sources of the simulation application.
     */
    sources?: SourceConfigs;
    /**
     * The simulation software suite used by the simulation application.
     */
    simulationSoftwareSuite: SimulationSoftwareSuite;
    /**
     * The robot software suite (ROS distribution) used by the simulation application.
     */
    robotSoftwareSuite: RobotSoftwareSuite;
    /**
     * The rendering engine for the simulation application.
     */
    renderingEngine?: RenderingEngine;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation application.
     */
    tags?: TagMap;
    /**
     * The object that contains the Docker image URI used to create your simulation application.
     */
    environment?: Environment;
  }
  export interface CreateSimulationApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the simulation application.
     */
    arn?: Arn;
    /**
     * The name of the simulation application.
     */
    name?: Name;
    /**
     * The version of the simulation application.
     */
    version?: Version;
    /**
     * The sources of the simulation application.
     */
    sources?: Sources;
    /**
     * The simulation software suite used by the simulation application.
     */
    simulationSoftwareSuite?: SimulationSoftwareSuite;
    /**
     * Information about the robot software suite (ROS distribution).
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The rendering engine for the simulation application.
     */
    renderingEngine?: RenderingEngine;
    /**
     * The time, in milliseconds since the epoch, when the simulation application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The revision id of the simulation application.
     */
    revisionId?: RevisionId;
    /**
     * The list of all tags added to the simulation application.
     */
    tags?: TagMap;
    /**
     * The object that contains the Docker image URI that you used to create your simulation application.
     */
    environment?: Environment;
  }
  export interface CreateSimulationApplicationVersionRequest {
    /**
     * The application information for the simulation application.
     */
    application: Arn;
    /**
     * The current revision id for the simulation application. If you provide a value and it matches the latest revision ID, a new version will be created.
     */
    currentRevisionId?: RevisionId;
    /**
     * The Amazon S3 eTag identifier for the zip file bundle that you use to create the simulation application.
     */
    s3Etags?: S3Etags;
    /**
     * The SHA256 digest used to identify the Docker image URI used to created the simulation application.
     */
    imageDigest?: ImageDigest;
  }
  export interface CreateSimulationApplicationVersionResponse {
    /**
     * The Amazon Resource Name (ARN) of the simulation application.
     */
    arn?: Arn;
    /**
     * The name of the simulation application.
     */
    name?: Name;
    /**
     * The version of the simulation application.
     */
    version?: Version;
    /**
     * The sources of the simulation application.
     */
    sources?: Sources;
    /**
     * The simulation software suite used by the simulation application.
     */
    simulationSoftwareSuite?: SimulationSoftwareSuite;
    /**
     * Information about the robot software suite (ROS distribution).
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The rendering engine for the simulation application.
     */
    renderingEngine?: RenderingEngine;
    /**
     * The time, in milliseconds since the epoch, when the simulation application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The revision ID of the simulation application.
     */
    revisionId?: RevisionId;
    /**
     * The object that contains the Docker image URI used to create the simulation application.
     */
    environment?: Environment;
  }
  export interface CreateSimulationJobRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * Location for output files generated by the simulation job.
     */
    outputLocation?: OutputLocation;
    /**
     * The logging configuration.
     */
    loggingConfig?: LoggingConfig;
    /**
     * The maximum simulation job duration in seconds (up to 14 days or 1,209,600 seconds. When maxJobDurationInSeconds is reached, the simulation job will status will transition to Completed.
     */
    maxJobDurationInSeconds: JobDuration;
    /**
     * The IAM role name that allows the simulation instance to call the AWS APIs that are specified in its associated policies on your behalf. This is how credentials are passed in to your simulation job. 
     */
    iamRole: IamRole;
    /**
     * The failure behavior the simulation job.  Continue  Leaves the instance running for its maximum timeout duration after a 4XX error code.  Fail  Stop the simulation job and terminate the instance.  
     */
    failureBehavior?: FailureBehavior;
    /**
     * The robot application to use in the simulation job.
     */
    robotApplications?: RobotApplicationConfigs;
    /**
     * The simulation application to use in the simulation job.
     */
    simulationApplications?: SimulationApplicationConfigs;
    /**
     * Specify data sources to mount read-only files from S3 into your simulation. These files are available under /opt/robomaker/datasources/data_source_name.   There is a limit of 100 files and a combined size of 25GB for all DataSourceConfig objects.  
     */
    dataSources?: DataSourceConfigs;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation job.
     */
    tags?: TagMap;
    /**
     * If your simulation job accesses resources in a VPC, you provide this parameter identifying the list of security group IDs and subnet IDs. These must belong to the same VPC. You must provide at least one security group and one subnet ID. 
     */
    vpcConfig?: VPCConfig;
    /**
     * Compute information for the simulation job.
     */
    compute?: Compute;
  }
  export type CreateSimulationJobRequests = SimulationJobRequest[];
  export interface CreateSimulationJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the simulation job.
     */
    arn?: Arn;
    /**
     * The status of the simulation job.
     */
    status?: SimulationJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last started.
     */
    lastStartedAt?: LastStartedAt;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * the failure behavior for the simulation job.
     */
    failureBehavior?: FailureBehavior;
    /**
     * The failure code of the simulation job if it failed:  InternalServiceError  Internal service error.  RobotApplicationCrash  Robot application exited abnormally.  SimulationApplicationCrash   Simulation application exited abnormally.  BadPermissionsRobotApplication  Robot application bundle could not be downloaded.  BadPermissionsSimulationApplication  Simulation application bundle could not be downloaded.  BadPermissionsS3Output  Unable to publish outputs to customer-provided S3 bucket.  BadPermissionsCloudwatchLogs  Unable to publish logs to customer-provided CloudWatch Logs resource.  SubnetIpLimitExceeded  Subnet IP limit exceeded.  ENILimitExceeded  ENI limit exceeded.  BadPermissionsUserCredentials  Unable to use the Role provided.  InvalidBundleRobotApplication  Robot bundle cannot be extracted (invalid format, bundling error, or other issue).  InvalidBundleSimulationApplication  Simulation bundle cannot be extracted (invalid format, bundling error, or other issue).  RobotApplicationVersionMismatchedEtag  Etag for RobotApplication does not match value during version creation.  SimulationApplicationVersionMismatchedEtag  Etag for SimulationApplication does not match value during version creation.  
     */
    failureCode?: SimulationJobErrorCode;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * Simulation job output files location.
     */
    outputLocation?: OutputLocation;
    /**
     * The logging configuration.
     */
    loggingConfig?: LoggingConfig;
    /**
     * The maximum simulation job duration in seconds. 
     */
    maxJobDurationInSeconds?: JobDuration;
    /**
     * The simulation job execution duration in milliseconds.
     */
    simulationTimeMillis?: SimulationTimeMillis;
    /**
     * The IAM role that allows the simulation job to call the AWS APIs that are specified in its associated policies on your behalf.
     */
    iamRole?: IamRole;
    /**
     * The robot application used by the simulation job.
     */
    robotApplications?: RobotApplicationConfigs;
    /**
     * The simulation application used by the simulation job.
     */
    simulationApplications?: SimulationApplicationConfigs;
    /**
     * The data sources for the simulation job.
     */
    dataSources?: DataSources;
    /**
     * The list of all tags added to the simulation job.
     */
    tags?: TagMap;
    /**
     * Information about the vpc configuration.
     */
    vpcConfig?: VPCConfigResponse;
    /**
     * Compute information for the simulation job.
     */
    compute?: ComputeResponse;
  }
  export interface CreateWorldExportJobRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * A list of Amazon Resource Names (arns) that correspond to worlds to export.
     */
    worlds: Arns;
    outputLocation: OutputLocation;
    /**
     * The IAM role that the world export process uses to access the Amazon S3 bucket and put the export.
     */
    iamRole: IamRole;
    /**
     * A map that contains tag keys and tag values that are attached to the world export job.
     */
    tags?: TagMap;
  }
  export interface CreateWorldExportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the world export job.
     */
    arn?: Arn;
    /**
     * The status of the world export job.  Pending  The world export job request is pending.  Running  The world export job is running.   Completed  The world export job completed.   Failed  The world export job failed. See failureCode for more information.   Canceled  The world export job was cancelled.  Canceling  The world export job is being cancelled.  
     */
    status?: WorldExportJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the world export job was created.
     */
    createdAt?: CreatedAt;
    /**
     * The failure code of the world export job if it failed:  InternalServiceError  Internal service error.  LimitExceeded  The requested resource exceeds the maximum number allowed, or the number of concurrent stream requests exceeds the maximum number allowed.   ResourceNotFound  The specified resource could not be found.   RequestThrottled  The request was throttled.  InvalidInput  An input parameter in the request is not valid.  AllWorldGenerationFailed  All of the worlds in the world generation job failed. This can happen if your worldCount is greater than 50 or less than 1.    For more information about troubleshooting WorldForge, see Troubleshooting Simulation WorldForge. 
     */
    failureCode?: WorldExportJobErrorCode;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    outputLocation?: OutputLocation;
    /**
     * The IAM role that the world export process uses to access the Amazon S3 bucket and put the export. 
     */
    iamRole?: IamRole;
    /**
     * A map that contains tag keys and tag values that are attached to the world export job.
     */
    tags?: TagMap;
  }
  export interface CreateWorldGenerationJobRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The Amazon Resource Name (arn) of the world template describing the worlds you want to create.
     */
    template: Arn;
    /**
     * Information about the world count.
     */
    worldCount: WorldCount;
    /**
     * A map that contains tag keys and tag values that are attached to the world generator job.
     */
    tags?: TagMap;
    /**
     * A map that contains tag keys and tag values that are attached to the generated worlds.
     */
    worldTags?: TagMap;
  }
  export interface CreateWorldGenerationJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the world generator job.
     */
    arn?: Arn;
    /**
     * The status of the world generator job.  Pending  The world generator job request is pending.  Running  The world generator job is running.   Completed  The world generator job completed.   Failed  The world generator job failed. See failureCode for more information.   PartialFailed  Some worlds did not generate.  Canceled  The world generator job was cancelled.  Canceling  The world generator job is being cancelled.  
     */
    status?: WorldGenerationJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the world generator job was created.
     */
    createdAt?: CreatedAt;
    /**
     * The failure code of the world generator job if it failed:  InternalServiceError  Internal service error.  LimitExceeded  The requested resource exceeds the maximum number allowed, or the number of concurrent stream requests exceeds the maximum number allowed.   ResourceNotFound  The specified resource could not be found.   RequestThrottled  The request was throttled.  InvalidInput  An input parameter in the request is not valid.  
     */
    failureCode?: WorldGenerationJobErrorCode;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The Amazon Resource Name (arn) of the world template.
     */
    template?: Arn;
    /**
     * Information about the world count. 
     */
    worldCount?: WorldCount;
    /**
     * A map that contains tag keys and tag values that are attached to the world generator job.
     */
    tags?: TagMap;
    /**
     * A map that contains tag keys and tag values that are attached to the generated worlds.
     */
    worldTags?: TagMap;
  }
  export interface CreateWorldTemplateRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The name of the world template.
     */
    name?: TemplateName;
    /**
     * The world template body.
     */
    templateBody?: Json;
    /**
     * The location of the world template.
     */
    templateLocation?: TemplateLocation;
    /**
     * A map that contains tag keys and tag values that are attached to the world template.
     */
    tags?: TagMap;
  }
  export interface CreateWorldTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the world template.
     */
    arn?: Arn;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The time, in milliseconds since the epoch, when the world template was created.
     */
    createdAt?: CreatedAt;
    /**
     * The name of the world template.
     */
    name?: TemplateName;
    /**
     * A map that contains tag keys and tag values that are attached to the world template.
     */
    tags?: TagMap;
  }
  export type CreatedAt = Date;
  export interface DataSource {
    /**
     * The name of the data source.
     */
    name?: Name;
    /**
     * The S3 bucket where the data files are located.
     */
    s3Bucket?: S3Bucket;
    /**
     * The list of S3 keys identifying the data source files.
     */
    s3Keys?: S3KeyOutputs;
    /**
     * The data type for the data source that you're using for your container image or simulation job. You can use this field to specify whether your data source is an Archive, an Amazon S3 prefix, or a file. If you don't specify a field, the default value is File.
     */
    type?: DataSourceType;
    /**
     * The location where your files are mounted in the container image. If you've specified the type of the data source as an Archive, you must provide an Amazon S3 object key to your archive. The object key must point to either a .zip or .tar.gz file. If you've specified the type of the data source as a Prefix, you provide the Amazon S3 prefix that points to the files that you are using for your data source. If you've specified the type of the data source as a File, you provide the Amazon S3 path to the file that you're using as your data source.
     */
    destination?: Path;
  }
  export interface DataSourceConfig {
    /**
     * The name of the data source.
     */
    name: Name;
    /**
     * The S3 bucket where the data files are located.
     */
    s3Bucket: S3Bucket;
    /**
     * The list of S3 keys identifying the data source files.
     */
    s3Keys: S3KeysOrPrefixes;
    /**
     * The data type for the data source that you're using for your container image or simulation job. You can use this field to specify whether your data source is an Archive, an Amazon S3 prefix, or a file. If you don't specify a field, the default value is File.
     */
    type?: DataSourceType;
    /**
     * The location where your files are mounted in the container image. If you've specified the type of the data source as an Archive, you must provide an Amazon S3 object key to your archive. The object key must point to either a .zip or .tar.gz file. If you've specified the type of the data source as a Prefix, you provide the Amazon S3 prefix that points to the files that you are using for your data source. If you've specified the type of the data source as a File, you provide the Amazon S3 path to the file that you're using as your data source.
     */
    destination?: Path;
  }
  export type DataSourceConfigs = DataSourceConfig[];
  export type DataSourceNames = Name[];
  export type DataSourceType = "Prefix"|"Archive"|"File"|string;
  export type DataSources = DataSource[];
  export interface DeleteFleetRequest {
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet: Arn;
  }
  export interface DeleteFleetResponse {
  }
  export interface DeleteRobotApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the the robot application.
     */
    application: Arn;
    /**
     * The version of the robot application to delete.
     */
    applicationVersion?: Version;
  }
  export interface DeleteRobotApplicationResponse {
  }
  export interface DeleteRobotRequest {
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    robot: Arn;
  }
  export interface DeleteRobotResponse {
  }
  export interface DeleteSimulationApplicationRequest {
    /**
     * The application information for the simulation application to delete.
     */
    application: Arn;
    /**
     * The version of the simulation application to delete.
     */
    applicationVersion?: Version;
  }
  export interface DeleteSimulationApplicationResponse {
  }
  export interface DeleteWorldTemplateRequest {
    /**
     * The Amazon Resource Name (arn) of the world template you want to delete.
     */
    template: Arn;
  }
  export interface DeleteWorldTemplateResponse {
  }
  export interface DeploymentApplicationConfig {
    /**
     * The Amazon Resource Name (ARN) of the robot application.
     */
    application: Arn;
    /**
     * The version of the application.
     */
    applicationVersion: DeploymentVersion;
    /**
     * The launch configuration.
     */
    launchConfig: DeploymentLaunchConfig;
  }
  export type DeploymentApplicationConfigs = DeploymentApplicationConfig[];
  export interface DeploymentConfig {
    /**
     * The percentage of robots receiving the deployment at the same time.
     */
    concurrentDeploymentPercentage?: Percentage;
    /**
     * The percentage of deployments that need to fail before stopping deployment.
     */
    failureThresholdPercentage?: Percentage;
    /**
     * The amount of time, in seconds, to wait for deployment to a single robot to complete. Choose a time between 1 minute and 7 days. The default is 5 hours.
     */
    robotDeploymentTimeoutInSeconds?: DeploymentTimeout;
    /**
     * The download condition file.
     */
    downloadConditionFile?: S3Object;
  }
  export interface DeploymentJob {
    /**
     * The Amazon Resource Name (ARN) of the deployment job.
     */
    arn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet?: Arn;
    /**
     * The status of the deployment job.
     */
    status?: DeploymentStatus;
    /**
     * The deployment application configuration.
     */
    deploymentApplicationConfigs?: DeploymentApplicationConfigs;
    /**
     * The deployment configuration.
     */
    deploymentConfig?: DeploymentConfig;
    /**
     * A short description of the reason why the deployment job failed.
     */
    failureReason?: GenericString;
    /**
     * The deployment job failure code.
     */
    failureCode?: DeploymentJobErrorCode;
    /**
     * The time, in milliseconds since the epoch, when the deployment job was created.
     */
    createdAt?: CreatedAt;
  }
  export type DeploymentJobErrorCode = "ResourceNotFound"|"EnvironmentSetupError"|"EtagMismatch"|"FailureThresholdBreached"|"RobotDeploymentAborted"|"RobotDeploymentNoResponse"|"RobotAgentConnectionTimeout"|"GreengrassDeploymentFailed"|"InvalidGreengrassGroup"|"MissingRobotArchitecture"|"MissingRobotApplicationArchitecture"|"MissingRobotDeploymentResource"|"GreengrassGroupVersionDoesNotExist"|"LambdaDeleted"|"ExtractingBundleFailure"|"PreLaunchFileFailure"|"PostLaunchFileFailure"|"BadPermissionError"|"DownloadConditionFailed"|"BadLambdaAssociated"|"InternalServerError"|"RobotApplicationDoesNotExist"|"DeploymentFleetDoesNotExist"|"FleetDeploymentTimeout"|string;
  export type DeploymentJobs = DeploymentJob[];
  export interface DeploymentLaunchConfig {
    /**
     * The package name.
     */
    packageName: Command;
    /**
     * The deployment pre-launch file. This file will be executed prior to the launch file.
     */
    preLaunchFile?: Path;
    /**
     * The launch file name.
     */
    launchFile: Command;
    /**
     * The deployment post-launch file. This file will be executed after the launch file.
     */
    postLaunchFile?: Path;
    /**
     * An array of key/value pairs specifying environment variables for the robot application
     */
    environmentVariables?: EnvironmentVariableMap;
  }
  export type DeploymentStatus = "Pending"|"Preparing"|"InProgress"|"Failed"|"Succeeded"|"Canceled"|string;
  export type DeploymentTimeout = number;
  export type DeploymentVersion = string;
  export interface DeregisterRobotRequest {
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet: Arn;
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    robot: Arn;
  }
  export interface DeregisterRobotResponse {
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    robot?: Arn;
  }
  export interface DescribeDeploymentJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the deployment job.
     */
    job: Arn;
  }
  export interface DescribeDeploymentJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the deployment job.
     */
    arn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet?: Arn;
    /**
     * The status of the deployment job.
     */
    status?: DeploymentStatus;
    /**
     * The deployment configuration.
     */
    deploymentConfig?: DeploymentConfig;
    /**
     * The deployment application configuration.
     */
    deploymentApplicationConfigs?: DeploymentApplicationConfigs;
    /**
     * A short description of the reason why the deployment job failed.
     */
    failureReason?: GenericString;
    /**
     * The deployment job failure code.
     */
    failureCode?: DeploymentJobErrorCode;
    /**
     * The time, in milliseconds since the epoch, when the deployment job was created.
     */
    createdAt?: CreatedAt;
    /**
     * A list of robot deployment summaries.
     */
    robotDeploymentSummary?: RobotDeploymentSummary;
    /**
     * The list of all tags added to the specified deployment job.
     */
    tags?: TagMap;
  }
  export interface DescribeFleetRequest {
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet: Arn;
  }
  export interface DescribeFleetResponse {
    /**
     * The name of the fleet.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    arn?: Arn;
    /**
     * A list of robots.
     */
    robots?: Robots;
    /**
     * The time, in milliseconds since the epoch, when the fleet was created.
     */
    createdAt?: CreatedAt;
    /**
     * The status of the last deployment.
     */
    lastDeploymentStatus?: DeploymentStatus;
    /**
     * The Amazon Resource Name (ARN) of the last deployment job.
     */
    lastDeploymentJob?: Arn;
    /**
     * The time of the last deployment.
     */
    lastDeploymentTime?: CreatedAt;
    /**
     * The list of all tags added to the specified fleet.
     */
    tags?: TagMap;
  }
  export interface DescribeRobotApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the robot application.
     */
    application: Arn;
    /**
     * The version of the robot application to describe.
     */
    applicationVersion?: Version;
  }
  export interface DescribeRobotApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the robot application.
     */
    arn?: Arn;
    /**
     * The name of the robot application.
     */
    name?: Name;
    /**
     * The version of the robot application.
     */
    version?: Version;
    /**
     * The sources of the robot application.
     */
    sources?: Sources;
    /**
     * The robot software suite (ROS distribution) used by the robot application.
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The revision id of the robot application.
     */
    revisionId?: RevisionId;
    /**
     * The time, in milliseconds since the epoch, when the robot application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The list of all tags added to the specified robot application.
     */
    tags?: TagMap;
    /**
     * The object that contains the Docker image URI used to create the robot application.
     */
    environment?: Environment;
    /**
     * A SHA256 identifier for the Docker image that you use for your robot application.
     */
    imageDigest?: ImageDigest;
  }
  export interface DescribeRobotRequest {
    /**
     * The Amazon Resource Name (ARN) of the robot to be described.
     */
    robot: Arn;
  }
  export interface DescribeRobotResponse {
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    arn?: Arn;
    /**
     * The name of the robot.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleetArn?: Arn;
    /**
     * The status of the fleet.
     */
    status?: RobotStatus;
    /**
     * The Greengrass group id.
     */
    greengrassGroupId?: Id;
    /**
     * The time, in milliseconds since the epoch, when the robot was created.
     */
    createdAt?: CreatedAt;
    /**
     * The target architecture of the robot application.
     */
    architecture?: Architecture;
    /**
     * The Amazon Resource Name (ARN) of the last deployment job.
     */
    lastDeploymentJob?: Arn;
    /**
     * The time of the last deployment job.
     */
    lastDeploymentTime?: CreatedAt;
    /**
     * The list of all tags added to the specified robot.
     */
    tags?: TagMap;
  }
  export interface DescribeSimulationApplicationRequest {
    /**
     * The application information for the simulation application.
     */
    application: Arn;
    /**
     * The version of the simulation application to describe.
     */
    applicationVersion?: Version;
  }
  export interface DescribeSimulationApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the robot simulation application.
     */
    arn?: Arn;
    /**
     * The name of the simulation application.
     */
    name?: Name;
    /**
     * The version of the simulation application.
     */
    version?: Version;
    /**
     * The sources of the simulation application.
     */
    sources?: Sources;
    /**
     * The simulation software suite used by the simulation application.
     */
    simulationSoftwareSuite?: SimulationSoftwareSuite;
    /**
     * Information about the robot software suite (ROS distribution).
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The rendering engine for the simulation application.
     */
    renderingEngine?: RenderingEngine;
    /**
     * The revision id of the simulation application.
     */
    revisionId?: RevisionId;
    /**
     * The time, in milliseconds since the epoch, when the simulation application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The list of all tags added to the specified simulation application.
     */
    tags?: TagMap;
    /**
     * The object that contains the Docker image URI used to create the simulation application.
     */
    environment?: Environment;
    /**
     * A SHA256 identifier for the Docker image that you use for your simulation application.
     */
    imageDigest?: ImageDigest;
  }
  export interface DescribeSimulationJobBatchRequest {
    /**
     * The id of the batch to describe.
     */
    batch: Arn;
  }
  export interface DescribeSimulationJobBatchResponse {
    /**
     * The Amazon Resource Name (ARN) of the batch.
     */
    arn?: Arn;
    /**
     * The status of the batch.  Pending  The simulation job batch request is pending.  InProgress  The simulation job batch is in progress.   Failed  The simulation job batch failed. One or more simulation job requests could not be completed due to an internal failure (like InternalServiceError). See failureCode and failureReason for more information.  Completed  The simulation batch job completed. A batch is complete when (1) there are no pending simulation job requests in the batch and none of the failed simulation job requests are due to InternalServiceError and (2) when all created simulation jobs have reached a terminal state (for example, Completed or Failed).   Canceled  The simulation batch job was cancelled.  Canceling  The simulation batch job is being cancelled.  Completing  The simulation batch job is completing.  TimingOut  The simulation job batch is timing out. If a batch timing out, and there are pending requests that were failing due to an internal failure (like InternalServiceError), the batch status will be Failed. If there are no such failing request, the batch status will be TimedOut.   TimedOut  The simulation batch job timed out.  
     */
    status?: SimulationJobBatchStatus;
    /**
     * The time, in milliseconds since the epoch, when the simulation job batch was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The time, in milliseconds since the epoch, when the simulation job batch was created.
     */
    createdAt?: CreatedAt;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The batch policy.
     */
    batchPolicy?: BatchPolicy;
    /**
     * The failure code of the simulation job batch.
     */
    failureCode?: SimulationJobBatchErrorCode;
    /**
     * The reason the simulation job batch failed.
     */
    failureReason?: GenericString;
    /**
     * A list of failed create simulation job requests. The request failed to be created into a simulation job. Failed requests do not have a simulation job ID. 
     */
    failedRequests?: FailedCreateSimulationJobRequests;
    /**
     * A list of pending simulation job requests. These requests have not yet been created into simulation jobs.
     */
    pendingRequests?: CreateSimulationJobRequests;
    /**
     * A list of created simulation job summaries.
     */
    createdRequests?: SimulationJobSummaries;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation job batch.
     */
    tags?: TagMap;
  }
  export interface DescribeSimulationJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the simulation job to be described.
     */
    job: Arn;
  }
  export interface DescribeSimulationJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the simulation job.
     */
    arn?: Arn;
    /**
     * The name of the simulation job.
     */
    name?: Name;
    /**
     * The status of the simulation job.
     */
    status?: SimulationJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last started.
     */
    lastStartedAt?: LastStartedAt;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The failure behavior for the simulation job.
     */
    failureBehavior?: FailureBehavior;
    /**
     * The failure code of the simulation job if it failed:  InternalServiceError  Internal service error.  RobotApplicationCrash  Robot application exited abnormally.  SimulationApplicationCrash   Simulation application exited abnormally.  BadPermissionsRobotApplication  Robot application bundle could not be downloaded.  BadPermissionsSimulationApplication  Simulation application bundle could not be downloaded.  BadPermissionsS3Output  Unable to publish outputs to customer-provided S3 bucket.  BadPermissionsCloudwatchLogs  Unable to publish logs to customer-provided CloudWatch Logs resource.  SubnetIpLimitExceeded  Subnet IP limit exceeded.  ENILimitExceeded  ENI limit exceeded.  BadPermissionsUserCredentials  Unable to use the Role provided.  InvalidBundleRobotApplication  Robot bundle cannot be extracted (invalid format, bundling error, or other issue).  InvalidBundleSimulationApplication  Simulation bundle cannot be extracted (invalid format, bundling error, or other issue).  RobotApplicationVersionMismatchedEtag  Etag for RobotApplication does not match value during version creation.  SimulationApplicationVersionMismatchedEtag  Etag for SimulationApplication does not match value during version creation.  
     */
    failureCode?: SimulationJobErrorCode;
    /**
     * Details about why the simulation job failed. For more information about troubleshooting, see Troubleshooting.
     */
    failureReason?: GenericString;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * Location for output files generated by the simulation job.
     */
    outputLocation?: OutputLocation;
    /**
     * The logging configuration.
     */
    loggingConfig?: LoggingConfig;
    /**
     * The maximum job duration in seconds. The value must be 8 days (691,200 seconds) or less.
     */
    maxJobDurationInSeconds?: JobDuration;
    /**
     * The simulation job execution duration in milliseconds.
     */
    simulationTimeMillis?: SimulationTimeMillis;
    /**
     * The IAM role that allows the simulation instance to call the AWS APIs that are specified in its associated policies on your behalf.
     */
    iamRole?: IamRole;
    /**
     * A list of robot applications.
     */
    robotApplications?: RobotApplicationConfigs;
    /**
     * A list of simulation applications.
     */
    simulationApplications?: SimulationApplicationConfigs;
    /**
     * The data sources for the simulation job.
     */
    dataSources?: DataSources;
    /**
     * The list of all tags added to the specified simulation job.
     */
    tags?: TagMap;
    /**
     * The VPC configuration.
     */
    vpcConfig?: VPCConfigResponse;
    /**
     * The network interface information for the simulation job.
     */
    networkInterface?: NetworkInterface;
    /**
     * Compute information for the simulation job.
     */
    compute?: ComputeResponse;
  }
  export interface DescribeWorldExportJobRequest {
    /**
     * The Amazon Resource Name (arn) of the world export job to describe.
     */
    job: Arn;
  }
  export interface DescribeWorldExportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the world export job.
     */
    arn?: Arn;
    /**
     * The status of the world export job.  Pending  The world export job request is pending.  Running  The world export job is running.   Completed  The world export job completed.   Failed  The world export job failed. See failureCode and failureReason for more information.   Canceled  The world export job was cancelled.  Canceling  The world export job is being cancelled.  
     */
    status?: WorldExportJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the world export job was created.
     */
    createdAt?: CreatedAt;
    /**
     * The failure code of the world export job if it failed:  InternalServiceError  Internal service error.  LimitExceeded  The requested resource exceeds the maximum number allowed, or the number of concurrent stream requests exceeds the maximum number allowed.   ResourceNotFound  The specified resource could not be found.   RequestThrottled  The request was throttled.  InvalidInput  An input parameter in the request is not valid.  
     */
    failureCode?: WorldExportJobErrorCode;
    /**
     * The reason why the world export job failed.
     */
    failureReason?: GenericString;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * A list of Amazon Resource Names (arns) that correspond to worlds to be exported.
     */
    worlds?: Arns;
    outputLocation?: OutputLocation;
    /**
     * The IAM role that the world export process uses to access the Amazon S3 bucket and put the export.
     */
    iamRole?: IamRole;
    /**
     * A map that contains tag keys and tag values that are attached to the world export job.
     */
    tags?: TagMap;
  }
  export interface DescribeWorldGenerationJobRequest {
    /**
     * The Amazon Resource Name (arn) of the world generation job to describe.
     */
    job: Arn;
  }
  export interface DescribeWorldGenerationJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the world generation job.
     */
    arn?: Arn;
    /**
     * The status of the world generation job:  Pending  The world generation job request is pending.  Running  The world generation job is running.   Completed  The world generation job completed.   Failed  The world generation job failed. See failureCode for more information.   PartialFailed  Some worlds did not generate.  Canceled  The world generation job was cancelled.  Canceling  The world generation job is being cancelled.  
     */
    status?: WorldGenerationJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the world generation job was created.
     */
    createdAt?: CreatedAt;
    /**
     * The failure code of the world generation job if it failed:  InternalServiceError  Internal service error.  LimitExceeded  The requested resource exceeds the maximum number allowed, or the number of concurrent stream requests exceeds the maximum number allowed.   ResourceNotFound  The specified resource could not be found.   RequestThrottled  The request was throttled.  InvalidInput  An input parameter in the request is not valid.  
     */
    failureCode?: WorldGenerationJobErrorCode;
    /**
     * The reason why the world generation job failed.
     */
    failureReason?: GenericString;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The Amazon Resource Name (arn) of the world template.
     */
    template?: Arn;
    /**
     * Information about the world count.
     */
    worldCount?: WorldCount;
    /**
     * Summary information about finished worlds.
     */
    finishedWorldsSummary?: FinishedWorldsSummary;
    /**
     * A map that contains tag keys and tag values that are attached to the world generation job.
     */
    tags?: TagMap;
    /**
     * A map that contains tag keys and tag values that are attached to the generated worlds.
     */
    worldTags?: TagMap;
  }
  export interface DescribeWorldRequest {
    /**
     * The Amazon Resource Name (arn) of the world you want to describe.
     */
    world: Arn;
  }
  export interface DescribeWorldResponse {
    /**
     * The Amazon Resource Name (arn) of the world.
     */
    arn?: Arn;
    /**
     * The Amazon Resource Name (arn) of the world generation job that generated the world.
     */
    generationJob?: Arn;
    /**
     * The world template.
     */
    template?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the world was created.
     */
    createdAt?: CreatedAt;
    /**
     * A map that contains tag keys and tag values that are attached to the world.
     */
    tags?: TagMap;
    /**
     * Returns the JSON formatted string that describes the contents of your world.
     */
    worldDescriptionBody?: Json;
  }
  export interface DescribeWorldTemplateRequest {
    /**
     * The Amazon Resource Name (arn) of the world template you want to describe.
     */
    template: Arn;
  }
  export interface DescribeWorldTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the world template.
     */
    arn?: Arn;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The name of the world template.
     */
    name?: TemplateName;
    /**
     * The time, in milliseconds since the epoch, when the world template was created.
     */
    createdAt?: CreatedAt;
    /**
     * The time, in milliseconds since the epoch, when the world template was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * A map that contains tag keys and tag values that are attached to the world template.
     */
    tags?: TagMap;
    /**
     * The version of the world template that you're using.
     */
    version?: GenericString;
  }
  export interface Environment {
    /**
     * The Docker image URI for either your robot or simulation applications.
     */
    uri?: RepositoryUrl;
  }
  export type EnvironmentVariableKey = string;
  export type EnvironmentVariableMap = {[key: string]: EnvironmentVariableValue};
  export type EnvironmentVariableValue = string;
  export type ExitBehavior = "FAIL"|"RESTART"|string;
  export type FailedAt = Date;
  export interface FailedCreateSimulationJobRequest {
    /**
     * The simulation job request.
     */
    request?: SimulationJobRequest;
    /**
     * The failure reason of the simulation job request.
     */
    failureReason?: GenericString;
    /**
     * The failure code.
     */
    failureCode?: SimulationJobErrorCode;
    /**
     * The time, in milliseconds since the epoch, when the simulation job batch failed.
     */
    failedAt?: FailedAt;
  }
  export type FailedCreateSimulationJobRequests = FailedCreateSimulationJobRequest[];
  export type FailureBehavior = "Fail"|"Continue"|string;
  export interface FailureSummary {
    /**
     * The total number of failures.
     */
    totalFailureCount?: Integer;
    /**
     * The worlds that failed.
     */
    failures?: WorldFailures;
  }
  export interface Filter {
    /**
     * The name of the filter.
     */
    name?: Name;
    /**
     * A list of values.
     */
    values?: FilterValues;
  }
  export type FilterValues = Name[];
  export type Filters = Filter[];
  export interface FinishedWorldsSummary {
    /**
     * The total number of finished worlds.
     */
    finishedCount?: Integer;
    /**
     * A list of worlds that succeeded.
     */
    succeededWorlds?: Arns;
    /**
     * Information about worlds that failed.
     */
    failureSummary?: FailureSummary;
  }
  export interface Fleet {
    /**
     * The name of the fleet.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    arn?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the fleet was created.
     */
    createdAt?: CreatedAt;
    /**
     * The status of the last fleet deployment.
     */
    lastDeploymentStatus?: DeploymentStatus;
    /**
     * The Amazon Resource Name (ARN) of the last deployment job.
     */
    lastDeploymentJob?: Arn;
    /**
     * The time of the last deployment.
     */
    lastDeploymentTime?: CreatedAt;
  }
  export type Fleets = Fleet[];
  export type FloorplanCount = number;
  export type GPUUnit = number;
  export type GenericInteger = number;
  export type GenericString = string;
  export interface GetWorldTemplateBodyRequest {
    /**
     * The Amazon Resource Name (arn) of the world template.
     */
    template?: Arn;
    /**
     * The Amazon Resource Name (arn) of the world generator job.
     */
    generationJob?: Arn;
  }
  export interface GetWorldTemplateBodyResponse {
    /**
     * The world template body.
     */
    templateBody?: Json;
  }
  export type IamRole = string;
  export type Id = string;
  export type ImageDigest = string;
  export type Integer = number;
  export type InteriorCountPerFloorplan = number;
  export type JobDuration = number;
  export type Json = string;
  export type LastStartedAt = Date;
  export type LastUpdatedAt = Date;
  export interface LaunchConfig {
    /**
     * The package name.
     */
    packageName?: Command;
    /**
     * The launch file name.
     */
    launchFile?: Command;
    /**
     * The environment variables for the application launch.
     */
    environmentVariables?: EnvironmentVariableMap;
    /**
     * The port forwarding configuration.
     */
    portForwardingConfig?: PortForwardingConfig;
    /**
     * Boolean indicating whether a streaming session will be configured for the application. If True, AWS RoboMaker will configure a connection so you can interact with your application as it is running in the simulation. You must configure and launch the component. It must have a graphical user interface. 
     */
    streamUI?: Boolean;
    /**
     * If you've specified General as the value for your RobotSoftwareSuite, you can use this field to specify a list of commands for your container image. If you've specified SimulationRuntime as the value for your SimulationSoftwareSuite, you can use this field to specify a list of commands for your container image.
     */
    command?: CommandList;
  }
  export interface ListDeploymentJobsRequest {
    /**
     * Optional filters to limit results. The filter names status and fleetName are supported. When filtering, you must use the complete value of the filtered item. You can use up to three filters, but they must be for the same named item. For example, if you are looking for items with the status InProgress or the status Pending.
     */
    filters?: Filters;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListDeploymentJobs again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListDeploymentJobs only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListDeploymentJobs request with the returned nextToken value. This value can be between 1 and 200. If this parameter is not used, then ListDeploymentJobs returns up to 200 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
  }
  export interface ListDeploymentJobsResponse {
    /**
     * A list of deployment jobs that meet the criteria of the request.
     */
    deploymentJobs?: DeploymentJobs;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListDeploymentJobs again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListFleetsRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListFleets again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.   This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListFleets only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListFleets request with the returned nextToken value. This value can be between 1 and 200. If this parameter is not used, then ListFleets returns up to 200 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. The filter name name is supported. When filtering, you must use the complete value of the filtered item. You can use up to three filters.
     */
    filters?: Filters;
  }
  export interface ListFleetsResponse {
    /**
     * A list of fleet details meeting the request criteria.
     */
    fleetDetails?: Fleets;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListFleets again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListRobotApplicationsRequest {
    /**
     * The version qualifier of the robot application.
     */
    versionQualifier?: VersionQualifier;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListRobotApplications again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListRobotApplications only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListRobotApplications request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, then ListRobotApplications returns up to 100 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. The filter name name is supported. When filtering, you must use the complete value of the filtered item. You can use up to three filters.
     */
    filters?: Filters;
  }
  export interface ListRobotApplicationsResponse {
    /**
     * A list of robot application summaries that meet the criteria of the request.
     */
    robotApplicationSummaries?: RobotApplicationSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListRobotApplications again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListRobotsRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListRobots again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListRobots only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListRobots request with the returned nextToken value. This value can be between 1 and 200. If this parameter is not used, then ListRobots returns up to 200 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. The filter names status and fleetName are supported. When filtering, you must use the complete value of the filtered item. You can use up to three filters, but they must be for the same named item. For example, if you are looking for items with the status Registered or the status Available.
     */
    filters?: Filters;
  }
  export interface ListRobotsResponse {
    /**
     * A list of robots that meet the criteria of the request.
     */
    robots?: Robots;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListRobots again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListSimulationApplicationsRequest {
    /**
     * The version qualifier of the simulation application.
     */
    versionQualifier?: VersionQualifier;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListSimulationApplications again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListSimulationApplications only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListSimulationApplications request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, then ListSimulationApplications returns up to 100 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional list of filters to limit results. The filter name name is supported. When filtering, you must use the complete value of the filtered item. You can use up to three filters.
     */
    filters?: Filters;
  }
  export interface ListSimulationApplicationsResponse {
    /**
     * A list of simulation application summaries that meet the criteria of the request.
     */
    simulationApplicationSummaries?: SimulationApplicationSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListSimulationApplications again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListSimulationJobBatchesRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListSimulationJobBatches again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListSimulationJobBatches only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListSimulationJobBatches request with the returned nextToken value. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results.
     */
    filters?: Filters;
  }
  export interface ListSimulationJobBatchesResponse {
    /**
     * A list of simulation job batch summaries.
     */
    simulationJobBatchSummaries?: SimulationJobBatchSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListSimulationJobBatches again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListSimulationJobsRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListSimulationJobs again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListSimulationJobs only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListSimulationJobs request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then ListSimulationJobs returns up to 1000 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. The filter names status and simulationApplicationName and robotApplicationName are supported. When filtering, you must use the complete value of the filtered item. You can use up to three filters, but they must be for the same named item. For example, if you are looking for items with the status Preparing or the status Running.
     */
    filters?: Filters;
  }
  export interface ListSimulationJobsResponse {
    /**
     * A list of simulation job summaries that meet the criteria of the request.
     */
    simulationJobSummaries: SimulationJobSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListSimulationJobs again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The AWS RoboMaker Amazon Resource Name (ARN) with tags to be listed.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of all tags added to the specified resource.
     */
    tags?: TagMap;
  }
  export interface ListWorldExportJobsRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorldExportJobs again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListWorldExportJobs only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListWorldExportJobs request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, then ListWorldExportJobs returns up to 100 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. You can use generationJobId and templateId.
     */
    filters?: Filters;
  }
  export interface ListWorldExportJobsResponse {
    /**
     * Summary information for world export jobs.
     */
    worldExportJobSummaries: WorldExportJobSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorldExportJobsRequest again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListWorldGenerationJobsRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorldGenerationJobsRequest again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListWorldGeneratorJobs only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListWorldGeneratorJobs request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, then ListWorldGeneratorJobs returns up to 100 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. You can use status and templateId.
     */
    filters?: Filters;
  }
  export interface ListWorldGenerationJobsResponse {
    /**
     * Summary information for world generator jobs.
     */
    worldGenerationJobSummaries: WorldGenerationJobSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorldGeneratorJobsRequest again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListWorldTemplatesRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorldTemplates again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListWorldTemplates only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListWorldTemplates request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, then ListWorldTemplates returns up to 100 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
  }
  export interface ListWorldTemplatesResponse {
    /**
     * Summary information for templates.
     */
    templateSummaries?: TemplateSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorldTemplates again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListWorldsRequest {
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorlds again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
    /**
     * When this parameter is used, ListWorlds only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListWorlds request with the returned nextToken value. This value can be between 1 and 100. If this parameter is not used, then ListWorlds returns up to 100 results and a nextToken value if applicable. 
     */
    maxResults?: MaxResults;
    /**
     * Optional filters to limit results. You can use status.
     */
    filters?: Filters;
  }
  export interface ListWorldsResponse {
    /**
     * Summary information for worlds.
     */
    worldSummaries?: WorldSummaries;
    /**
     * If the previous paginated request did not return all of the remaining results, the response object's nextToken parameter value is set to a token. To retrieve the next set of results, call ListWorlds again and assign that token to the request object's nextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null. 
     */
    nextToken?: PaginationToken;
  }
  export interface LoggingConfig {
    /**
     * A boolean indicating whether to record all ROS topics.
     */
    recordAllRosTopics: BoxedBoolean;
  }
  export type MaxConcurrency = number;
  export type MaxResults = number;
  export type Name = string;
  export interface NetworkInterface {
    /**
     * The ID of the network interface.
     */
    networkInterfaceId?: GenericString;
    /**
     * The IPv4 address of the network interface within the subnet.
     */
    privateIpAddress?: GenericString;
    /**
     * The IPv4 public address of the network interface.
     */
    publicIpAddress?: GenericString;
  }
  export type NonEmptyString = string;
  export type NonSystemPort = number;
  export interface OutputLocation {
    /**
     * The S3 bucket for output.
     */
    s3Bucket?: S3Bucket;
    /**
     * The S3 folder in the s3Bucket where output files will be placed.
     */
    s3Prefix?: S3Key;
  }
  export type PaginationToken = string;
  export type Path = string;
  export type PercentDone = number;
  export type Percentage = number;
  export type Port = number;
  export interface PortForwardingConfig {
    /**
     * The port mappings for the configuration.
     */
    portMappings?: PortMappingList;
  }
  export interface PortMapping {
    /**
     * The port number on the simulation job instance to use as a remote connection point. 
     */
    jobPort: Port;
    /**
     * The port number on the application.
     */
    applicationPort: NonSystemPort;
    /**
     * A Boolean indicating whether to enable this port mapping on public IP.
     */
    enableOnPublicIp?: Boolean;
  }
  export type PortMappingList = PortMapping[];
  export interface ProgressDetail {
    /**
     * The current progress status.  Validating  Validating the deployment.  DownloadingExtracting  Downloading and extracting the bundle on the robot.  ExecutingPreLaunch  Executing pre-launch script(s) if provided.  Launching  Launching the robot application.  ExecutingPostLaunch  Executing post-launch script(s) if provided.  Finished  Deployment is complete.  
     */
    currentProgress?: RobotDeploymentStep;
    /**
     * Precentage of the step that is done. This currently only applies to the Downloading/Extracting step of the deployment. It is empty for other steps.
     */
    percentDone?: PercentDone;
    /**
     * Estimated amount of time in seconds remaining in the step. This currently only applies to the Downloading/Extracting step of the deployment. It is empty for other steps.
     */
    estimatedTimeRemainingSeconds?: GenericInteger;
    /**
     * The Amazon Resource Name (ARN) of the deployment job.
     */
    targetResource?: GenericString;
  }
  export interface RegisterRobotRequest {
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet: Arn;
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    robot: Arn;
  }
  export interface RegisterRobotResponse {
    /**
     * The Amazon Resource Name (ARN) of the fleet that the robot will join.
     */
    fleet?: Arn;
    /**
     * Information about the robot registration.
     */
    robot?: Arn;
  }
  export interface RenderingEngine {
    /**
     * The name of the rendering engine.
     */
    name?: RenderingEngineType;
    /**
     * The version of the rendering engine.
     */
    version?: RenderingEngineVersionType;
  }
  export type RenderingEngineType = "OGRE"|string;
  export type RenderingEngineVersionType = string;
  export type RepositoryUrl = string;
  export interface RestartSimulationJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the simulation job.
     */
    job: Arn;
  }
  export interface RestartSimulationJobResponse {
  }
  export type RevisionId = string;
  export interface Robot {
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    arn?: Arn;
    /**
     * The name of the robot.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleetArn?: Arn;
    /**
     * The status of the robot.
     */
    status?: RobotStatus;
    /**
     * The Greengrass group associated with the robot.
     */
    greenGrassGroupId?: Id;
    /**
     * The time, in milliseconds since the epoch, when the robot was created.
     */
    createdAt?: CreatedAt;
    /**
     * The architecture of the robot.
     */
    architecture?: Architecture;
    /**
     * The Amazon Resource Name (ARN) of the last deployment job.
     */
    lastDeploymentJob?: Arn;
    /**
     * The time of the last deployment.
     */
    lastDeploymentTime?: CreatedAt;
  }
  export interface RobotApplicationConfig {
    /**
     * The application information for the robot application.
     */
    application: Arn;
    /**
     * The version of the robot application.
     */
    applicationVersion?: Version;
    /**
     * The launch configuration for the robot application.
     */
    launchConfig: LaunchConfig;
    /**
     * The upload configurations for the robot application.
     */
    uploadConfigurations?: UploadConfigurations;
    /**
     * A Boolean indicating whether to use default upload configurations. By default, .ros and .gazebo files are uploaded when the application terminates and all ROS topics will be recorded. If you set this value, you must specify an outputLocation. 
     */
    useDefaultUploadConfigurations?: BoxedBoolean;
    /**
     * Information about tools configured for the robot application.
     */
    tools?: Tools;
    /**
     * A Boolean indicating whether to use default robot application tools. The default tools are rviz, rqt, terminal and rosbag record. The default is False. 
     */
    useDefaultTools?: BoxedBoolean;
  }
  export type RobotApplicationConfigs = RobotApplicationConfig[];
  export type RobotApplicationNames = Name[];
  export type RobotApplicationSummaries = RobotApplicationSummary[];
  export interface RobotApplicationSummary {
    /**
     * The name of the robot application.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the robot.
     */
    arn?: Arn;
    /**
     * The version of the robot application.
     */
    version?: Version;
    /**
     * The time, in milliseconds since the epoch, when the robot application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * Information about a robot software suite (ROS distribution).
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
  }
  export interface RobotDeployment {
    /**
     * The robot deployment Amazon Resource Name (ARN).
     */
    arn?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the deployment was started.
     */
    deploymentStartTime?: CreatedAt;
    /**
     * The time, in milliseconds since the epoch, when the deployment finished.
     */
    deploymentFinishTime?: CreatedAt;
    /**
     * The status of the robot deployment.
     */
    status?: RobotStatus;
    /**
     * Information about how the deployment is progressing.
     */
    progressDetail?: ProgressDetail;
    /**
     * A short description of the reason why the robot deployment failed.
     */
    failureReason?: GenericString;
    /**
     * The robot deployment failure code.
     */
    failureCode?: DeploymentJobErrorCode;
  }
  export type RobotDeploymentStep = "Validating"|"DownloadingExtracting"|"ExecutingDownloadCondition"|"ExecutingPreLaunch"|"Launching"|"ExecutingPostLaunch"|"Finished"|string;
  export type RobotDeploymentSummary = RobotDeployment[];
  export interface RobotSoftwareSuite {
    /**
     * The name of the robot software suite (ROS distribution).
     */
    name?: RobotSoftwareSuiteType;
    /**
     * The version of the robot software suite (ROS distribution).
     */
    version?: RobotSoftwareSuiteVersionType;
  }
  export type RobotSoftwareSuiteType = "ROS"|"ROS2"|"General"|string;
  export type RobotSoftwareSuiteVersionType = "Kinetic"|"Melodic"|"Dashing"|"Foxy"|string;
  export type RobotStatus = "Available"|"Registered"|"PendingNewDeployment"|"Deploying"|"Failed"|"InSync"|"NoResponse"|string;
  export type Robots = Robot[];
  export type S3Bucket = string;
  export type S3Etag = string;
  export type S3Etags = S3Etag[];
  export type S3Key = string;
  export type S3KeyOrPrefix = string;
  export interface S3KeyOutput {
    /**
     * The S3 key.
     */
    s3Key?: S3KeyOrPrefix;
    /**
     * The etag for the object.
     */
    etag?: S3Etag;
  }
  export type S3KeyOutputs = S3KeyOutput[];
  export type S3KeysOrPrefixes = S3KeyOrPrefix[];
  export interface S3Object {
    /**
     * The bucket containing the object.
     */
    bucket: S3Bucket;
    /**
     * The key of the object.
     */
    key: S3Key;
    /**
     * The etag of the object.
     */
    etag?: S3Etag;
  }
  export type SecurityGroups = NonEmptyString[];
  export interface SimulationApplicationConfig {
    /**
     * The application information for the simulation application.
     */
    application: Arn;
    /**
     * The version of the simulation application.
     */
    applicationVersion?: Version;
    /**
     * The launch configuration for the simulation application.
     */
    launchConfig: LaunchConfig;
    /**
     * Information about upload configurations for the simulation application.
     */
    uploadConfigurations?: UploadConfigurations;
    /**
     * A list of world configurations.
     */
    worldConfigs?: WorldConfigs;
    /**
     * A Boolean indicating whether to use default upload configurations. By default, .ros and .gazebo files are uploaded when the application terminates and all ROS topics will be recorded. If you set this value, you must specify an outputLocation. 
     */
    useDefaultUploadConfigurations?: BoxedBoolean;
    /**
     * Information about tools configured for the simulation application.
     */
    tools?: Tools;
    /**
     * A Boolean indicating whether to use default simulation application tools. The default tools are rviz, rqt, terminal and rosbag record. The default is False. 
     */
    useDefaultTools?: BoxedBoolean;
  }
  export type SimulationApplicationConfigs = SimulationApplicationConfig[];
  export type SimulationApplicationNames = Name[];
  export type SimulationApplicationSummaries = SimulationApplicationSummary[];
  export interface SimulationApplicationSummary {
    /**
     * The name of the simulation application.
     */
    name?: Name;
    /**
     * The Amazon Resource Name (ARN) of the simulation application.
     */
    arn?: Arn;
    /**
     * The version of the simulation application.
     */
    version?: Version;
    /**
     * The time, in milliseconds since the epoch, when the simulation application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * Information about a robot software suite (ROS distribution).
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * Information about a simulation software suite.
     */
    simulationSoftwareSuite?: SimulationSoftwareSuite;
  }
  export interface SimulationJob {
    /**
     * The Amazon Resource Name (ARN) of the simulation job.
     */
    arn?: Arn;
    /**
     * The name of the simulation job.
     */
    name?: Name;
    /**
     * Status of the simulation job.
     */
    status?: SimulationJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last started.
     */
    lastStartedAt?: LastStartedAt;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The failure behavior the simulation job.  Continue  Leaves the host running for its maximum timeout duration after a 4XX error code.  Fail  Stop the simulation job and terminate the instance.  
     */
    failureBehavior?: FailureBehavior;
    /**
     * The failure code of the simulation job if it failed.
     */
    failureCode?: SimulationJobErrorCode;
    /**
     * The reason why the simulation job failed.
     */
    failureReason?: GenericString;
    /**
     * A unique identifier for this SimulationJob request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * Location for output files generated by the simulation job.
     */
    outputLocation?: OutputLocation;
    /**
     * The logging configuration.
     */
    loggingConfig?: LoggingConfig;
    /**
     * The maximum simulation job duration in seconds. The value must be 8 days (691,200 seconds) or less.
     */
    maxJobDurationInSeconds?: JobDuration;
    /**
     * The simulation job execution duration in milliseconds.
     */
    simulationTimeMillis?: SimulationTimeMillis;
    /**
     * The IAM role that allows the simulation instance to call the AWS APIs that are specified in its associated policies on your behalf. This is how credentials are passed in to your simulation job. 
     */
    iamRole?: IamRole;
    /**
     * A list of robot applications.
     */
    robotApplications?: RobotApplicationConfigs;
    /**
     * A list of simulation applications.
     */
    simulationApplications?: SimulationApplicationConfigs;
    /**
     * The data sources for the simulation job.
     */
    dataSources?: DataSources;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation job.
     */
    tags?: TagMap;
    /**
     * VPC configuration information.
     */
    vpcConfig?: VPCConfigResponse;
    /**
     * Information about a network interface.
     */
    networkInterface?: NetworkInterface;
    /**
     * Compute information for the simulation job
     */
    compute?: ComputeResponse;
  }
  export type SimulationJobBatchErrorCode = "InternalServiceError"|string;
  export type SimulationJobBatchStatus = "Pending"|"InProgress"|"Failed"|"Completed"|"Canceled"|"Canceling"|"Completing"|"TimingOut"|"TimedOut"|string;
  export type SimulationJobBatchSummaries = SimulationJobBatchSummary[];
  export interface SimulationJobBatchSummary {
    /**
     * The Amazon Resource Name (ARN) of the batch.
     */
    arn?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the simulation job batch was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The time, in milliseconds since the epoch, when the simulation job batch was created.
     */
    createdAt?: CreatedAt;
    /**
     * The status of the simulation job batch.  Pending  The simulation job batch request is pending.  InProgress  The simulation job batch is in progress.   Failed  The simulation job batch failed. One or more simulation job requests could not be completed due to an internal failure (like InternalServiceError). See failureCode and failureReason for more information.  Completed  The simulation batch job completed. A batch is complete when (1) there are no pending simulation job requests in the batch and none of the failed simulation job requests are due to InternalServiceError and (2) when all created simulation jobs have reached a terminal state (for example, Completed or Failed).   Canceled  The simulation batch job was cancelled.  Canceling  The simulation batch job is being cancelled.  Completing  The simulation batch job is completing.  TimingOut  The simulation job batch is timing out. If a batch timing out, and there are pending requests that were failing due to an internal failure (like InternalServiceError), the batch status will be Failed. If there are no such failing request, the batch status will be TimedOut.   TimedOut  The simulation batch job timed out.  
     */
    status?: SimulationJobBatchStatus;
    /**
     * The number of failed simulation job requests.
     */
    failedRequestCount?: Integer;
    /**
     * The number of pending simulation job requests.
     */
    pendingRequestCount?: Integer;
    /**
     * The number of created simulation job requests.
     */
    createdRequestCount?: Integer;
  }
  export type SimulationJobErrorCode = "InternalServiceError"|"RobotApplicationCrash"|"SimulationApplicationCrash"|"RobotApplicationHealthCheckFailure"|"SimulationApplicationHealthCheckFailure"|"BadPermissionsRobotApplication"|"BadPermissionsSimulationApplication"|"BadPermissionsS3Object"|"BadPermissionsS3Output"|"BadPermissionsCloudwatchLogs"|"SubnetIpLimitExceeded"|"ENILimitExceeded"|"BadPermissionsUserCredentials"|"InvalidBundleRobotApplication"|"InvalidBundleSimulationApplication"|"InvalidS3Resource"|"ThrottlingError"|"LimitExceeded"|"MismatchedEtag"|"RobotApplicationVersionMismatchedEtag"|"SimulationApplicationVersionMismatchedEtag"|"ResourceNotFound"|"RequestThrottled"|"BatchTimedOut"|"BatchCanceled"|"InvalidInput"|"WrongRegionS3Bucket"|"WrongRegionS3Output"|"WrongRegionRobotApplication"|"WrongRegionSimulationApplication"|"UploadContentMismatchError"|string;
  export interface SimulationJobRequest {
    outputLocation?: OutputLocation;
    loggingConfig?: LoggingConfig;
    /**
     * The maximum simulation job duration in seconds. The value must be 8 days (691,200 seconds) or less.
     */
    maxJobDurationInSeconds: JobDuration;
    /**
     * The IAM role name that allows the simulation instance to call the AWS APIs that are specified in its associated policies on your behalf. This is how credentials are passed in to your simulation job. 
     */
    iamRole?: IamRole;
    /**
     * The failure behavior the simulation job.  Continue  Leaves the host running for its maximum timeout duration after a 4XX error code.  Fail  Stop the simulation job and terminate the instance.  
     */
    failureBehavior?: FailureBehavior;
    /**
     * A Boolean indicating whether to use default applications in the simulation job. Default applications include Gazebo, rqt, rviz and terminal access. 
     */
    useDefaultApplications?: BoxedBoolean;
    /**
     * The robot applications to use in the simulation job.
     */
    robotApplications?: RobotApplicationConfigs;
    /**
     * The simulation applications to use in the simulation job.
     */
    simulationApplications?: SimulationApplicationConfigs;
    /**
     * Specify data sources to mount read-only files from S3 into your simulation. These files are available under /opt/robomaker/datasources/data_source_name.   There is a limit of 100 files and a combined size of 25GB for all DataSourceConfig objects.  
     */
    dataSources?: DataSourceConfigs;
    vpcConfig?: VPCConfig;
    /**
     * Compute information for the simulation job
     */
    compute?: Compute;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation job request.
     */
    tags?: TagMap;
  }
  export type SimulationJobStatus = "Pending"|"Preparing"|"Running"|"Restarting"|"Completed"|"Failed"|"RunningFailed"|"Terminating"|"Terminated"|"Canceled"|string;
  export type SimulationJobSummaries = SimulationJobSummary[];
  export interface SimulationJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the simulation job.
     */
    arn?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the simulation job was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The name of the simulation job.
     */
    name?: Name;
    /**
     * The status of the simulation job.
     */
    status?: SimulationJobStatus;
    /**
     * A list of simulation job simulation application names.
     */
    simulationApplicationNames?: SimulationApplicationNames;
    /**
     * A list of simulation job robot application names.
     */
    robotApplicationNames?: RobotApplicationNames;
    /**
     * The names of the data sources.
     */
    dataSourceNames?: DataSourceNames;
    /**
     * The compute type for the simulation job summary.
     */
    computeType?: ComputeType;
  }
  export type SimulationJobs = SimulationJob[];
  export interface SimulationSoftwareSuite {
    /**
     * The name of the simulation software suite.
     */
    name?: SimulationSoftwareSuiteType;
    /**
     * The version of the simulation software suite.
     */
    version?: SimulationSoftwareSuiteVersionType;
  }
  export type SimulationSoftwareSuiteType = "Gazebo"|"RosbagPlay"|"SimulationRuntime"|string;
  export type SimulationSoftwareSuiteVersionType = string;
  export type SimulationTimeMillis = number;
  export type SimulationUnit = number;
  export interface Source {
    /**
     * The s3 bucket name.
     */
    s3Bucket?: S3Bucket;
    /**
     * The s3 object key.
     */
    s3Key?: S3Key;
    /**
     * A hash of the object specified by s3Bucket and s3Key.
     */
    etag?: S3Etag;
    /**
     * The taget processor architecture for the application.
     */
    architecture?: Architecture;
  }
  export interface SourceConfig {
    /**
     * The Amazon S3 bucket name.
     */
    s3Bucket?: S3Bucket;
    /**
     * The s3 object key.
     */
    s3Key?: S3Key;
    /**
     * The target processor architecture for the application.
     */
    architecture?: Architecture;
  }
  export type SourceConfigs = SourceConfig[];
  export type Sources = Source[];
  export interface StartSimulationJobBatchRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The batch policy.
     */
    batchPolicy?: BatchPolicy;
    /**
     * A list of simulation job requests to create in the batch.
     */
    createSimulationJobRequests: CreateSimulationJobRequests;
    /**
     * A map that contains tag keys and tag values that are attached to the deployment job batch.
     */
    tags?: TagMap;
  }
  export interface StartSimulationJobBatchResponse {
    /**
     * The Amazon Resource Name (arn) of the batch.
     */
    arn?: Arn;
    /**
     * The status of the simulation job batch.  Pending  The simulation job batch request is pending.  InProgress  The simulation job batch is in progress.   Failed  The simulation job batch failed. One or more simulation job requests could not be completed due to an internal failure (like InternalServiceError). See failureCode and failureReason for more information.  Completed  The simulation batch job completed. A batch is complete when (1) there are no pending simulation job requests in the batch and none of the failed simulation job requests are due to InternalServiceError and (2) when all created simulation jobs have reached a terminal state (for example, Completed or Failed).   Canceled  The simulation batch job was cancelled.  Canceling  The simulation batch job is being cancelled.  Completing  The simulation batch job is completing.  TimingOut  The simulation job batch is timing out. If a batch timing out, and there are pending requests that were failing due to an internal failure (like InternalServiceError), the batch status will be Failed. If there are no such failing request, the batch status will be TimedOut.   TimedOut  The simulation batch job timed out.  
     */
    status?: SimulationJobBatchStatus;
    /**
     * The time, in milliseconds since the epoch, when the simulation job batch was created.
     */
    createdAt?: CreatedAt;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken?: ClientRequestToken;
    /**
     * The batch policy.
     */
    batchPolicy?: BatchPolicy;
    /**
     * The failure code if the simulation job batch failed.
     */
    failureCode?: SimulationJobBatchErrorCode;
    /**
     * The reason the simulation job batch failed.
     */
    failureReason?: GenericString;
    /**
     * A list of failed simulation job requests. The request failed to be created into a simulation job. Failed requests do not have a simulation job ID. 
     */
    failedRequests?: FailedCreateSimulationJobRequests;
    /**
     * A list of pending simulation job requests. These requests have not yet been created into simulation jobs.
     */
    pendingRequests?: CreateSimulationJobRequests;
    /**
     * A list of created simulation job request summaries.
     */
    createdRequests?: SimulationJobSummaries;
    /**
     * A map that contains tag keys and tag values that are attached to the deployment job batch.
     */
    tags?: TagMap;
  }
  export type Subnets = NonEmptyString[];
  export interface SyncDeploymentJobRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientRequestToken: ClientRequestToken;
    /**
     * The target fleet for the synchronization.
     */
    fleet: Arn;
  }
  export interface SyncDeploymentJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the synchronization request.
     */
    arn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the fleet.
     */
    fleet?: Arn;
    /**
     * The status of the synchronization job.
     */
    status?: DeploymentStatus;
    /**
     * Information about the deployment configuration.
     */
    deploymentConfig?: DeploymentConfig;
    /**
     * Information about the deployment application configurations.
     */
    deploymentApplicationConfigs?: DeploymentApplicationConfigs;
    /**
     * The failure reason if the job fails.
     */
    failureReason?: GenericString;
    /**
     * The failure code if the job fails:  InternalServiceError  Internal service error.  RobotApplicationCrash  Robot application exited abnormally.  SimulationApplicationCrash   Simulation application exited abnormally.  BadPermissionsRobotApplication  Robot application bundle could not be downloaded.  BadPermissionsSimulationApplication  Simulation application bundle could not be downloaded.  BadPermissionsS3Output  Unable to publish outputs to customer-provided S3 bucket.  BadPermissionsCloudwatchLogs  Unable to publish logs to customer-provided CloudWatch Logs resource.  SubnetIpLimitExceeded  Subnet IP limit exceeded.  ENILimitExceeded  ENI limit exceeded.  BadPermissionsUserCredentials  Unable to use the Role provided.  InvalidBundleRobotApplication  Robot bundle cannot be extracted (invalid format, bundling error, or other issue).  InvalidBundleSimulationApplication  Simulation bundle cannot be extracted (invalid format, bundling error, or other issue).  RobotApplicationVersionMismatchedEtag  Etag for RobotApplication does not match value during version creation.  SimulationApplicationVersionMismatchedEtag  Etag for SimulationApplication does not match value during version creation.  
     */
    failureCode?: DeploymentJobErrorCode;
    /**
     * The time, in milliseconds since the epoch, when the fleet was created.
     */
    createdAt?: CreatedAt;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the AWS RoboMaker resource you are tagging.
     */
    resourceArn: Arn;
    /**
     * A map that contains tag keys and tag values that are attached to the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TemplateLocation {
    /**
     * The Amazon S3 bucket name.
     */
    s3Bucket: S3Bucket;
    /**
     * The list of S3 keys identifying the data source files.
     */
    s3Key: S3Key;
  }
  export type TemplateName = string;
  export type TemplateSummaries = TemplateSummary[];
  export interface TemplateSummary {
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    arn?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the template was created.
     */
    createdAt?: CreatedAt;
    /**
     * The time, in milliseconds since the epoch, when the template was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The name of the template.
     */
    name?: TemplateName;
    /**
     * The version of the template that you're using.
     */
    version?: GenericString;
  }
  export interface Tool {
    /**
     * Boolean indicating whether a streaming session will be configured for the tool. If True, AWS RoboMaker will configure a connection so you can interact with the tool as it is running in the simulation. It must have a graphical user interface. The default is False. 
     */
    streamUI?: BoxedBoolean;
    /**
     * The name of the tool.
     */
    name: Name;
    /**
     * Command-line arguments for the tool. It must include the tool executable name.
     */
    command: UnrestrictedCommand;
    /**
     * Boolean indicating whether logs will be recorded in CloudWatch for the tool. The default is False. 
     */
    streamOutputToCloudWatch?: BoxedBoolean;
    /**
     * Exit behavior determines what happens when your tool quits running. RESTART will cause your tool to be restarted. FAIL will cause your job to exit. The default is RESTART. 
     */
    exitBehavior?: ExitBehavior;
  }
  export type Tools = Tool[];
  export type UnrestrictedCommand = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the AWS RoboMaker resource you are removing tags.
     */
    resourceArn: Arn;
    /**
     * A map that contains tag keys and tag values that will be unattached from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateRobotApplicationRequest {
    /**
     * The application information for the robot application.
     */
    application: Arn;
    /**
     * The sources of the robot application.
     */
    sources?: SourceConfigs;
    /**
     * The robot software suite (ROS distribution) used by the robot application.
     */
    robotSoftwareSuite: RobotSoftwareSuite;
    /**
     * The revision id for the robot application.
     */
    currentRevisionId?: RevisionId;
    /**
     * The object that contains the Docker image URI for your robot application.
     */
    environment?: Environment;
  }
  export interface UpdateRobotApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated robot application.
     */
    arn?: Arn;
    /**
     * The name of the robot application.
     */
    name?: Name;
    /**
     * The version of the robot application.
     */
    version?: Version;
    /**
     * The sources of the robot application.
     */
    sources?: Sources;
    /**
     * The robot software suite (ROS distribution) used by the robot application.
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The time, in milliseconds since the epoch, when the robot application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The revision id of the robot application.
     */
    revisionId?: RevisionId;
    /**
     * The object that contains the Docker image URI for your robot application.
     */
    environment?: Environment;
  }
  export interface UpdateSimulationApplicationRequest {
    /**
     * The application information for the simulation application.
     */
    application: Arn;
    /**
     * The sources of the simulation application.
     */
    sources?: SourceConfigs;
    /**
     * The simulation software suite used by the simulation application.
     */
    simulationSoftwareSuite: SimulationSoftwareSuite;
    /**
     * Information about the robot software suite (ROS distribution).
     */
    robotSoftwareSuite: RobotSoftwareSuite;
    /**
     * The rendering engine for the simulation application.
     */
    renderingEngine?: RenderingEngine;
    /**
     * The revision id for the robot application.
     */
    currentRevisionId?: RevisionId;
    /**
     * The object that contains the Docker image URI for your simulation application.
     */
    environment?: Environment;
  }
  export interface UpdateSimulationApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated simulation application.
     */
    arn?: Arn;
    /**
     * The name of the simulation application.
     */
    name?: Name;
    /**
     * The version of the robot application.
     */
    version?: Version;
    /**
     * The sources of the simulation application.
     */
    sources?: Sources;
    /**
     * The simulation software suite used by the simulation application.
     */
    simulationSoftwareSuite?: SimulationSoftwareSuite;
    /**
     * Information about the robot software suite (ROS distribution).
     */
    robotSoftwareSuite?: RobotSoftwareSuite;
    /**
     * The rendering engine for the simulation application.
     */
    renderingEngine?: RenderingEngine;
    /**
     * The time, in milliseconds since the epoch, when the simulation application was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
    /**
     * The revision id of the simulation application.
     */
    revisionId?: RevisionId;
    /**
     * The object that contains the Docker image URI used for your simulation application.
     */
    environment?: Environment;
  }
  export interface UpdateWorldTemplateRequest {
    /**
     * The Amazon Resource Name (arn) of the world template to update.
     */
    template: Arn;
    /**
     * The name of the template.
     */
    name?: TemplateName;
    /**
     * The world template body.
     */
    templateBody?: Json;
    /**
     * The location of the world template.
     */
    templateLocation?: TemplateLocation;
  }
  export interface UpdateWorldTemplateResponse {
    /**
     * The Amazon Resource Name (arn) of the world template.
     */
    arn?: Arn;
    /**
     * The name of the world template.
     */
    name?: TemplateName;
    /**
     * The time, in milliseconds since the epoch, when the world template was created.
     */
    createdAt?: CreatedAt;
    /**
     * The time, in milliseconds since the epoch, when the world template was last updated.
     */
    lastUpdatedAt?: LastUpdatedAt;
  }
  export type UploadBehavior = "UPLOAD_ON_TERMINATE"|"UPLOAD_ROLLING_AUTO_REMOVE"|string;
  export interface UploadConfiguration {
    /**
     * A prefix that specifies where files will be uploaded in Amazon S3. It is appended to the simulation output location to determine the final path.   For example, if your simulation output location is s3://my-bucket and your upload configuration name is robot-test, your files will be uploaded to s3://my-bucket/&lt;simid&gt;/&lt;runid&gt;/robot-test. 
     */
    name: Name;
    /**
     *  Specifies the path of the file(s) to upload. Standard Unix glob matching rules are accepted, with the addition of ** as a super asterisk. For example, specifying /var/log/**.log causes all .log files in the /var/log directory tree to be collected. For more examples, see Glob Library. 
     */
    path: Path;
    /**
     * Specifies when to upload the files:  UPLOAD_ON_TERMINATE  Matching files are uploaded once the simulation enters the TERMINATING state. Matching files are not uploaded until all of your code (including tools) have stopped.  If there is a problem uploading a file, the upload is retried. If problems persist, no further upload attempts will be made.  UPLOAD_ROLLING_AUTO_REMOVE  Matching files are uploaded as they are created. They are deleted after they are uploaded. The specified path is checked every 5 seconds. A final check is made when all of your code (including tools) have stopped.   
     */
    uploadBehavior: UploadBehavior;
  }
  export type UploadConfigurations = UploadConfiguration[];
  export interface VPCConfig {
    /**
     * A list of one or more subnet IDs in your VPC.
     */
    subnets: Subnets;
    /**
     * A list of one or more security groups IDs in your VPC.
     */
    securityGroups?: SecurityGroups;
    /**
     * A boolean indicating whether to assign a public IP address.
     */
    assignPublicIp?: Boolean;
  }
  export interface VPCConfigResponse {
    /**
     * A list of subnet IDs associated with the simulation job.
     */
    subnets?: Subnets;
    /**
     * A list of security group IDs associated with the simulation job.
     */
    securityGroups?: SecurityGroups;
    /**
     * The VPC ID associated with your simulation job.
     */
    vpcId?: GenericString;
    /**
     * A boolean indicating if a public IP was assigned.
     */
    assignPublicIp?: Boolean;
  }
  export type Version = string;
  export type VersionQualifier = string;
  export interface WorldConfig {
    /**
     * The world generated by Simulation WorldForge.
     */
    world?: Arn;
  }
  export type WorldConfigs = WorldConfig[];
  export interface WorldCount {
    /**
     * The number of unique floorplans.
     */
    floorplanCount?: FloorplanCount;
    /**
     * The number of unique interiors per floorplan.
     */
    interiorCountPerFloorplan?: InteriorCountPerFloorplan;
  }
  export type WorldExportJobErrorCode = "InternalServiceError"|"LimitExceeded"|"ResourceNotFound"|"RequestThrottled"|"InvalidInput"|"AccessDenied"|string;
  export type WorldExportJobStatus = "Pending"|"Running"|"Completed"|"Failed"|"Canceling"|"Canceled"|string;
  export type WorldExportJobSummaries = WorldExportJobSummary[];
  export interface WorldExportJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the world export job.
     */
    arn?: Arn;
    /**
     * The status of the world export job.  Pending  The world export job request is pending.  Running  The world export job is running.   Completed  The world export job completed.   Failed  The world export job failed. See failureCode for more information.   Canceled  The world export job was cancelled.  Canceling  The world export job is being cancelled.  
     */
    status?: WorldExportJobStatus;
    /**
     * The time, in milliseconds since the epoch, when the world export job was created.
     */
    createdAt?: CreatedAt;
    /**
     * A list of worlds.
     */
    worlds?: Arns;
  }
  export interface WorldFailure {
    /**
     * The failure code of the world export job if it failed:  InternalServiceError  Internal service error.  LimitExceeded  The requested resource exceeds the maximum number allowed, or the number of concurrent stream requests exceeds the maximum number allowed.   ResourceNotFound  The specified resource could not be found.   RequestThrottled  The request was throttled.  InvalidInput  An input parameter in the request is not valid.  
     */
    failureCode?: WorldGenerationJobErrorCode;
    /**
     * The sample reason why the world failed. World errors are aggregated. A sample is used as the sampleFailureReason. 
     */
    sampleFailureReason?: GenericString;
    /**
     * The number of failed worlds.
     */
    failureCount?: Integer;
  }
  export type WorldFailures = WorldFailure[];
  export type WorldGenerationJobErrorCode = "InternalServiceError"|"LimitExceeded"|"ResourceNotFound"|"RequestThrottled"|"InvalidInput"|"AllWorldGenerationFailed"|string;
  export type WorldGenerationJobStatus = "Pending"|"Running"|"Completed"|"Failed"|"PartialFailed"|"Canceling"|"Canceled"|string;
  export type WorldGenerationJobSummaries = WorldGenerationJobSummary[];
  export interface WorldGenerationJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the world generator job.
     */
    arn?: Arn;
    /**
     * The Amazon Resource Name (arn) of the world template.
     */
    template?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the world generator job was created.
     */
    createdAt?: CreatedAt;
    /**
     * The status of the world generator job:  Pending  The world generator job request is pending.  Running  The world generator job is running.   Completed  The world generator job completed.   Failed  The world generator job failed. See failureCode for more information.   PartialFailed  Some worlds did not generate.  Canceled  The world generator job was cancelled.  Canceling  The world generator job is being cancelled.  
     */
    status?: WorldGenerationJobStatus;
    /**
     * Information about the world count.
     */
    worldCount?: WorldCount;
    /**
     * The number of worlds that were generated.
     */
    succeededWorldCount?: Integer;
    /**
     * The number of worlds that failed.
     */
    failedWorldCount?: Integer;
  }
  export type WorldSummaries = WorldSummary[];
  export interface WorldSummary {
    /**
     * The Amazon Resource Name (ARN) of the world.
     */
    arn?: Arn;
    /**
     * The time, in milliseconds since the epoch, when the world was created.
     */
    createdAt?: CreatedAt;
    /**
     * The Amazon Resource Name (arn) of the world generation job.
     */
    generationJob?: Arn;
    /**
     * The Amazon Resource Name (arn) of the world template.
     */
    template?: Arn;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-06-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the RoboMaker client.
   */
  export import Types = RoboMaker;
}
export = RoboMaker;
