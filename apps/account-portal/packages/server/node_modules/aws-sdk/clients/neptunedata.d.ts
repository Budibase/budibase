import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Neptunedata extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Neptunedata.Types.ClientConfiguration)
  config: Config & Neptunedata.Types.ClientConfiguration;
  /**
   * Cancels a Gremlin query. See Gremlin query cancellation for more information.
   */
  cancelGremlinQuery(params: Neptunedata.Types.CancelGremlinQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.CancelGremlinQueryOutput) => void): Request<Neptunedata.Types.CancelGremlinQueryOutput, AWSError>;
  /**
   * Cancels a Gremlin query. See Gremlin query cancellation for more information.
   */
  cancelGremlinQuery(callback?: (err: AWSError, data: Neptunedata.Types.CancelGremlinQueryOutput) => void): Request<Neptunedata.Types.CancelGremlinQueryOutput, AWSError>;
  /**
   * Cancels a specified load job. This is an HTTP DELETE request. See Neptune Loader Get-Status API for more information.
   */
  cancelLoaderJob(params: Neptunedata.Types.CancelLoaderJobInput, callback?: (err: AWSError, data: Neptunedata.Types.CancelLoaderJobOutput) => void): Request<Neptunedata.Types.CancelLoaderJobOutput, AWSError>;
  /**
   * Cancels a specified load job. This is an HTTP DELETE request. See Neptune Loader Get-Status API for more information.
   */
  cancelLoaderJob(callback?: (err: AWSError, data: Neptunedata.Types.CancelLoaderJobOutput) => void): Request<Neptunedata.Types.CancelLoaderJobOutput, AWSError>;
  /**
   * Cancels a Neptune ML data processing job. See The dataprocessing command.
   */
  cancelMLDataProcessingJob(params: Neptunedata.Types.CancelMLDataProcessingJobInput, callback?: (err: AWSError, data: Neptunedata.Types.CancelMLDataProcessingJobOutput) => void): Request<Neptunedata.Types.CancelMLDataProcessingJobOutput, AWSError>;
  /**
   * Cancels a Neptune ML data processing job. See The dataprocessing command.
   */
  cancelMLDataProcessingJob(callback?: (err: AWSError, data: Neptunedata.Types.CancelMLDataProcessingJobOutput) => void): Request<Neptunedata.Types.CancelMLDataProcessingJobOutput, AWSError>;
  /**
   * Cancels a Neptune ML model training job. See Model training using the modeltraining command.
   */
  cancelMLModelTrainingJob(params: Neptunedata.Types.CancelMLModelTrainingJobInput, callback?: (err: AWSError, data: Neptunedata.Types.CancelMLModelTrainingJobOutput) => void): Request<Neptunedata.Types.CancelMLModelTrainingJobOutput, AWSError>;
  /**
   * Cancels a Neptune ML model training job. See Model training using the modeltraining command.
   */
  cancelMLModelTrainingJob(callback?: (err: AWSError, data: Neptunedata.Types.CancelMLModelTrainingJobOutput) => void): Request<Neptunedata.Types.CancelMLModelTrainingJobOutput, AWSError>;
  /**
   * Cancels a specified model transform job. See Use a trained model to generate new model artifacts.
   */
  cancelMLModelTransformJob(params: Neptunedata.Types.CancelMLModelTransformJobInput, callback?: (err: AWSError, data: Neptunedata.Types.CancelMLModelTransformJobOutput) => void): Request<Neptunedata.Types.CancelMLModelTransformJobOutput, AWSError>;
  /**
   * Cancels a specified model transform job. See Use a trained model to generate new model artifacts.
   */
  cancelMLModelTransformJob(callback?: (err: AWSError, data: Neptunedata.Types.CancelMLModelTransformJobOutput) => void): Request<Neptunedata.Types.CancelMLModelTransformJobOutput, AWSError>;
  /**
   * Cancels a specified openCypher query. See Neptune openCypher status endpoint for more information.
   */
  cancelOpenCypherQuery(params: Neptunedata.Types.CancelOpenCypherQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.CancelOpenCypherQueryOutput) => void): Request<Neptunedata.Types.CancelOpenCypherQueryOutput, AWSError>;
  /**
   * Cancels a specified openCypher query. See Neptune openCypher status endpoint for more information.
   */
  cancelOpenCypherQuery(callback?: (err: AWSError, data: Neptunedata.Types.CancelOpenCypherQueryOutput) => void): Request<Neptunedata.Types.CancelOpenCypherQueryOutput, AWSError>;
  /**
   * Creates a new Neptune ML inference endpoint that lets you query one specific model that the model-training process constructed. See Managing inference endpoints using the endpoints command.
   */
  createMLEndpoint(params: Neptunedata.Types.CreateMLEndpointInput, callback?: (err: AWSError, data: Neptunedata.Types.CreateMLEndpointOutput) => void): Request<Neptunedata.Types.CreateMLEndpointOutput, AWSError>;
  /**
   * Creates a new Neptune ML inference endpoint that lets you query one specific model that the model-training process constructed. See Managing inference endpoints using the endpoints command.
   */
  createMLEndpoint(callback?: (err: AWSError, data: Neptunedata.Types.CreateMLEndpointOutput) => void): Request<Neptunedata.Types.CreateMLEndpointOutput, AWSError>;
  /**
   * Cancels the creation of a Neptune ML inference endpoint. See Managing inference endpoints using the endpoints command.
   */
  deleteMLEndpoint(params: Neptunedata.Types.DeleteMLEndpointInput, callback?: (err: AWSError, data: Neptunedata.Types.DeleteMLEndpointOutput) => void): Request<Neptunedata.Types.DeleteMLEndpointOutput, AWSError>;
  /**
   * Cancels the creation of a Neptune ML inference endpoint. See Managing inference endpoints using the endpoints command.
   */
  deleteMLEndpoint(callback?: (err: AWSError, data: Neptunedata.Types.DeleteMLEndpointOutput) => void): Request<Neptunedata.Types.DeleteMLEndpointOutput, AWSError>;
  /**
   * Deletes statistics for Gremlin and openCypher (property graph) data.
   */
  deletePropertygraphStatistics(callback?: (err: AWSError, data: Neptunedata.Types.DeletePropertygraphStatisticsOutput) => void): Request<Neptunedata.Types.DeletePropertygraphStatisticsOutput, AWSError>;
  /**
   * Deletes SPARQL statistics
   */
  deleteSparqlStatistics(callback?: (err: AWSError, data: Neptunedata.Types.DeleteSparqlStatisticsOutput) => void): Request<Neptunedata.Types.DeleteSparqlStatisticsOutput, AWSError>;
  /**
   * The fast reset REST API lets you reset a Neptune graph quicky and easily, removing all of its data. Neptune fast reset is a two-step process. First you call ExecuteFastReset with action set to initiateDatabaseReset. This returns a UUID token which you then include when calling ExecuteFastReset again with action set to performDatabaseReset. See Empty an Amazon Neptune DB cluster using the fast reset API.
   */
  executeFastReset(params: Neptunedata.Types.ExecuteFastResetInput, callback?: (err: AWSError, data: Neptunedata.Types.ExecuteFastResetOutput) => void): Request<Neptunedata.Types.ExecuteFastResetOutput, AWSError>;
  /**
   * The fast reset REST API lets you reset a Neptune graph quicky and easily, removing all of its data. Neptune fast reset is a two-step process. First you call ExecuteFastReset with action set to initiateDatabaseReset. This returns a UUID token which you then include when calling ExecuteFastReset again with action set to performDatabaseReset. See Empty an Amazon Neptune DB cluster using the fast reset API.
   */
  executeFastReset(callback?: (err: AWSError, data: Neptunedata.Types.ExecuteFastResetOutput) => void): Request<Neptunedata.Types.ExecuteFastResetOutput, AWSError>;
  /**
   * Executes a Gremlin Explain query. Amazon Neptune has added a Gremlin feature named explain that provides is a self-service tool for understanding the execution approach being taken by the Neptune engine for the query. You invoke it by adding an explain parameter to an HTTP call that submits a Gremlin query. The explain feature provides information about the logical structure of query execution plans. You can use this information to identify potential evaluation and execution bottlenecks and to tune your query, as explained in Tuning Gremlin queries. You can also use query hints to improve query execution plans.
   */
  executeGremlinExplainQuery(params: Neptunedata.Types.ExecuteGremlinExplainQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.ExecuteGremlinExplainQueryOutput) => void): Request<Neptunedata.Types.ExecuteGremlinExplainQueryOutput, AWSError>;
  /**
   * Executes a Gremlin Explain query. Amazon Neptune has added a Gremlin feature named explain that provides is a self-service tool for understanding the execution approach being taken by the Neptune engine for the query. You invoke it by adding an explain parameter to an HTTP call that submits a Gremlin query. The explain feature provides information about the logical structure of query execution plans. You can use this information to identify potential evaluation and execution bottlenecks and to tune your query, as explained in Tuning Gremlin queries. You can also use query hints to improve query execution plans.
   */
  executeGremlinExplainQuery(callback?: (err: AWSError, data: Neptunedata.Types.ExecuteGremlinExplainQueryOutput) => void): Request<Neptunedata.Types.ExecuteGremlinExplainQueryOutput, AWSError>;
  /**
   * Executes a Gremlin Profile query, which runs a specified traversal, collects various metrics about the run, and produces a profile report as output. See Gremlin profile API in Neptune for details.
   */
  executeGremlinProfileQuery(params: Neptunedata.Types.ExecuteGremlinProfileQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.ExecuteGremlinProfileQueryOutput) => void): Request<Neptunedata.Types.ExecuteGremlinProfileQueryOutput, AWSError>;
  /**
   * Executes a Gremlin Profile query, which runs a specified traversal, collects various metrics about the run, and produces a profile report as output. See Gremlin profile API in Neptune for details.
   */
  executeGremlinProfileQuery(callback?: (err: AWSError, data: Neptunedata.Types.ExecuteGremlinProfileQueryOutput) => void): Request<Neptunedata.Types.ExecuteGremlinProfileQueryOutput, AWSError>;
  /**
   * This commands executes a Gremlin query. Amazon Neptune is compatible with Apache TinkerPop3 and Gremlin, so you can use the Gremlin traversal language to query the graph, as described under The Graph in the Apache TinkerPop3 documentation. More details can also be found in Accessing a Neptune graph with Gremlin.
   */
  executeGremlinQuery(params: Neptunedata.Types.ExecuteGremlinQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.ExecuteGremlinQueryOutput) => void): Request<Neptunedata.Types.ExecuteGremlinQueryOutput, AWSError>;
  /**
   * This commands executes a Gremlin query. Amazon Neptune is compatible with Apache TinkerPop3 and Gremlin, so you can use the Gremlin traversal language to query the graph, as described under The Graph in the Apache TinkerPop3 documentation. More details can also be found in Accessing a Neptune graph with Gremlin.
   */
  executeGremlinQuery(callback?: (err: AWSError, data: Neptunedata.Types.ExecuteGremlinQueryOutput) => void): Request<Neptunedata.Types.ExecuteGremlinQueryOutput, AWSError>;
  /**
   * Executes an openCypher explain request. See The openCypher explain feature for more information.
   */
  executeOpenCypherExplainQuery(params: Neptunedata.Types.ExecuteOpenCypherExplainQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.ExecuteOpenCypherExplainQueryOutput) => void): Request<Neptunedata.Types.ExecuteOpenCypherExplainQueryOutput, AWSError>;
  /**
   * Executes an openCypher explain request. See The openCypher explain feature for more information.
   */
  executeOpenCypherExplainQuery(callback?: (err: AWSError, data: Neptunedata.Types.ExecuteOpenCypherExplainQueryOutput) => void): Request<Neptunedata.Types.ExecuteOpenCypherExplainQueryOutput, AWSError>;
  /**
   * Executes an openCypher query. See Accessing the Neptune Graph with openCypher for more information. Neptune supports building graph applications using openCypher, which is currently one of the most popular query languages among developers working with graph databases. Developers, business analysts, and data scientists like openCypher's declarative, SQL-inspired syntax because it provides a familiar structure in which to querying property graphs. The openCypher language was originally developed by Neo4j, then open-sourced in 2015 and contributed to the openCypher project under an Apache 2 open-source license.
   */
  executeOpenCypherQuery(params: Neptunedata.Types.ExecuteOpenCypherQueryInput, callback?: (err: AWSError, data: Neptunedata.Types.ExecuteOpenCypherQueryOutput) => void): Request<Neptunedata.Types.ExecuteOpenCypherQueryOutput, AWSError>;
  /**
   * Executes an openCypher query. See Accessing the Neptune Graph with openCypher for more information. Neptune supports building graph applications using openCypher, which is currently one of the most popular query languages among developers working with graph databases. Developers, business analysts, and data scientists like openCypher's declarative, SQL-inspired syntax because it provides a familiar structure in which to querying property graphs. The openCypher language was originally developed by Neo4j, then open-sourced in 2015 and contributed to the openCypher project under an Apache 2 open-source license.
   */
  executeOpenCypherQuery(callback?: (err: AWSError, data: Neptunedata.Types.ExecuteOpenCypherQueryOutput) => void): Request<Neptunedata.Types.ExecuteOpenCypherQueryOutput, AWSError>;
  /**
   * Check the status of the graph database on the host.
   */
  getEngineStatus(callback?: (err: AWSError, data: Neptunedata.Types.GetEngineStatusOutput) => void): Request<Neptunedata.Types.GetEngineStatusOutput, AWSError>;
  /**
   * Gets the status of a specified Gremlin query.
   */
  getGremlinQueryStatus(params: Neptunedata.Types.GetGremlinQueryStatusInput, callback?: (err: AWSError, data: Neptunedata.Types.GetGremlinQueryStatusOutput) => void): Request<Neptunedata.Types.GetGremlinQueryStatusOutput, AWSError>;
  /**
   * Gets the status of a specified Gremlin query.
   */
  getGremlinQueryStatus(callback?: (err: AWSError, data: Neptunedata.Types.GetGremlinQueryStatusOutput) => void): Request<Neptunedata.Types.GetGremlinQueryStatusOutput, AWSError>;
  /**
   * Gets status information about a specified load job. Neptune keeps track of the most recent 1,024 bulk load jobs, and stores the last 10,000 error details per job. See Neptune Loader Get-Status API for more information.
   */
  getLoaderJobStatus(params: Neptunedata.Types.GetLoaderJobStatusInput, callback?: (err: AWSError, data: Neptunedata.Types.GetLoaderJobStatusOutput) => void): Request<Neptunedata.Types.GetLoaderJobStatusOutput, AWSError>;
  /**
   * Gets status information about a specified load job. Neptune keeps track of the most recent 1,024 bulk load jobs, and stores the last 10,000 error details per job. See Neptune Loader Get-Status API for more information.
   */
  getLoaderJobStatus(callback?: (err: AWSError, data: Neptunedata.Types.GetLoaderJobStatusOutput) => void): Request<Neptunedata.Types.GetLoaderJobStatusOutput, AWSError>;
  /**
   * Retrieves information about a specified data processing job. See The dataprocessing command.
   */
  getMLDataProcessingJob(params: Neptunedata.Types.GetMLDataProcessingJobInput, callback?: (err: AWSError, data: Neptunedata.Types.GetMLDataProcessingJobOutput) => void): Request<Neptunedata.Types.GetMLDataProcessingJobOutput, AWSError>;
  /**
   * Retrieves information about a specified data processing job. See The dataprocessing command.
   */
  getMLDataProcessingJob(callback?: (err: AWSError, data: Neptunedata.Types.GetMLDataProcessingJobOutput) => void): Request<Neptunedata.Types.GetMLDataProcessingJobOutput, AWSError>;
  /**
   * Retrieves details about an inference endpoint. See Managing inference endpoints using the endpoints command.
   */
  getMLEndpoint(params: Neptunedata.Types.GetMLEndpointInput, callback?: (err: AWSError, data: Neptunedata.Types.GetMLEndpointOutput) => void): Request<Neptunedata.Types.GetMLEndpointOutput, AWSError>;
  /**
   * Retrieves details about an inference endpoint. See Managing inference endpoints using the endpoints command.
   */
  getMLEndpoint(callback?: (err: AWSError, data: Neptunedata.Types.GetMLEndpointOutput) => void): Request<Neptunedata.Types.GetMLEndpointOutput, AWSError>;
  /**
   * Retrieves information about a Neptune ML model training job. See Model training using the modeltraining command.
   */
  getMLModelTrainingJob(params: Neptunedata.Types.GetMLModelTrainingJobInput, callback?: (err: AWSError, data: Neptunedata.Types.GetMLModelTrainingJobOutput) => void): Request<Neptunedata.Types.GetMLModelTrainingJobOutput, AWSError>;
  /**
   * Retrieves information about a Neptune ML model training job. See Model training using the modeltraining command.
   */
  getMLModelTrainingJob(callback?: (err: AWSError, data: Neptunedata.Types.GetMLModelTrainingJobOutput) => void): Request<Neptunedata.Types.GetMLModelTrainingJobOutput, AWSError>;
  /**
   * Gets information about a specified model transform job. See Use a trained model to generate new model artifacts.
   */
  getMLModelTransformJob(params: Neptunedata.Types.GetMLModelTransformJobInput, callback?: (err: AWSError, data: Neptunedata.Types.GetMLModelTransformJobOutput) => void): Request<Neptunedata.Types.GetMLModelTransformJobOutput, AWSError>;
  /**
   * Gets information about a specified model transform job. See Use a trained model to generate new model artifacts.
   */
  getMLModelTransformJob(callback?: (err: AWSError, data: Neptunedata.Types.GetMLModelTransformJobOutput) => void): Request<Neptunedata.Types.GetMLModelTransformJobOutput, AWSError>;
  /**
   * Retrieves the status of a specified openCypher query.
   */
  getOpenCypherQueryStatus(params: Neptunedata.Types.GetOpenCypherQueryStatusInput, callback?: (err: AWSError, data: Neptunedata.Types.GetOpenCypherQueryStatusOutput) => void): Request<Neptunedata.Types.GetOpenCypherQueryStatusOutput, AWSError>;
  /**
   * Retrieves the status of a specified openCypher query.
   */
  getOpenCypherQueryStatus(callback?: (err: AWSError, data: Neptunedata.Types.GetOpenCypherQueryStatusOutput) => void): Request<Neptunedata.Types.GetOpenCypherQueryStatusOutput, AWSError>;
  /**
   * Gets property graph statistics (Gremlin and openCypher).
   */
  getPropertygraphStatistics(callback?: (err: AWSError, data: Neptunedata.Types.GetPropertygraphStatisticsOutput) => void): Request<Neptunedata.Types.GetPropertygraphStatisticsOutput, AWSError>;
  /**
   * Gets a stream for a property graph. With the Neptune Streams feature, you can generate a complete sequence of change-log entries that record every change made to your graph data as it happens. GetPropertygraphStream lets you collect these change-log entries for a property graph. The Neptune streams feature needs to be enabled on your Neptune DBcluster. To enable streams, set the neptune_streams DB cluster parameter to 1. See Capturing graph changes in real time using Neptune streams.
   */
  getPropertygraphStream(params: Neptunedata.Types.GetPropertygraphStreamInput, callback?: (err: AWSError, data: Neptunedata.Types.GetPropertygraphStreamOutput) => void): Request<Neptunedata.Types.GetPropertygraphStreamOutput, AWSError>;
  /**
   * Gets a stream for a property graph. With the Neptune Streams feature, you can generate a complete sequence of change-log entries that record every change made to your graph data as it happens. GetPropertygraphStream lets you collect these change-log entries for a property graph. The Neptune streams feature needs to be enabled on your Neptune DBcluster. To enable streams, set the neptune_streams DB cluster parameter to 1. See Capturing graph changes in real time using Neptune streams.
   */
  getPropertygraphStream(callback?: (err: AWSError, data: Neptunedata.Types.GetPropertygraphStreamOutput) => void): Request<Neptunedata.Types.GetPropertygraphStreamOutput, AWSError>;
  /**
   * Gets a graph summary for a property graph.
   */
  getPropertygraphSummary(params: Neptunedata.Types.GetPropertygraphSummaryInput, callback?: (err: AWSError, data: Neptunedata.Types.GetPropertygraphSummaryOutput) => void): Request<Neptunedata.Types.GetPropertygraphSummaryOutput, AWSError>;
  /**
   * Gets a graph summary for a property graph.
   */
  getPropertygraphSummary(callback?: (err: AWSError, data: Neptunedata.Types.GetPropertygraphSummaryOutput) => void): Request<Neptunedata.Types.GetPropertygraphSummaryOutput, AWSError>;
  /**
   * Gets a graph summary for an RDF graph.
   */
  getRDFGraphSummary(params: Neptunedata.Types.GetRDFGraphSummaryInput, callback?: (err: AWSError, data: Neptunedata.Types.GetRDFGraphSummaryOutput) => void): Request<Neptunedata.Types.GetRDFGraphSummaryOutput, AWSError>;
  /**
   * Gets a graph summary for an RDF graph.
   */
  getRDFGraphSummary(callback?: (err: AWSError, data: Neptunedata.Types.GetRDFGraphSummaryOutput) => void): Request<Neptunedata.Types.GetRDFGraphSummaryOutput, AWSError>;
  /**
   * Gets RDF statistics (SPARQL).
   */
  getSparqlStatistics(callback?: (err: AWSError, data: Neptunedata.Types.GetSparqlStatisticsOutput) => void): Request<Neptunedata.Types.GetSparqlStatisticsOutput, AWSError>;
  /**
   * Gets a stream for an RDF graph. With the Neptune Streams feature, you can generate a complete sequence of change-log entries that record every change made to your graph data as it happens. GetSparqlStream lets you collect these change-log entries for an RDF graph. The Neptune streams feature needs to be enabled on your Neptune DBcluster. To enable streams, set the neptune_streams DB cluster parameter to 1. See Capturing graph changes in real time using Neptune streams.
   */
  getSparqlStream(params: Neptunedata.Types.GetSparqlStreamInput, callback?: (err: AWSError, data: Neptunedata.Types.GetSparqlStreamOutput) => void): Request<Neptunedata.Types.GetSparqlStreamOutput, AWSError>;
  /**
   * Gets a stream for an RDF graph. With the Neptune Streams feature, you can generate a complete sequence of change-log entries that record every change made to your graph data as it happens. GetSparqlStream lets you collect these change-log entries for an RDF graph. The Neptune streams feature needs to be enabled on your Neptune DBcluster. To enable streams, set the neptune_streams DB cluster parameter to 1. See Capturing graph changes in real time using Neptune streams.
   */
  getSparqlStream(callback?: (err: AWSError, data: Neptunedata.Types.GetSparqlStreamOutput) => void): Request<Neptunedata.Types.GetSparqlStreamOutput, AWSError>;
  /**
   * Lists active Gremlin queries. See Gremlin query status API for details about the output.
   */
  listGremlinQueries(params: Neptunedata.Types.ListGremlinQueriesInput, callback?: (err: AWSError, data: Neptunedata.Types.ListGremlinQueriesOutput) => void): Request<Neptunedata.Types.ListGremlinQueriesOutput, AWSError>;
  /**
   * Lists active Gremlin queries. See Gremlin query status API for details about the output.
   */
  listGremlinQueries(callback?: (err: AWSError, data: Neptunedata.Types.ListGremlinQueriesOutput) => void): Request<Neptunedata.Types.ListGremlinQueriesOutput, AWSError>;
  /**
   * Retrieves a list of the loadIds for all active loader jobs.
   */
  listLoaderJobs(params: Neptunedata.Types.ListLoaderJobsInput, callback?: (err: AWSError, data: Neptunedata.Types.ListLoaderJobsOutput) => void): Request<Neptunedata.Types.ListLoaderJobsOutput, AWSError>;
  /**
   * Retrieves a list of the loadIds for all active loader jobs.
   */
  listLoaderJobs(callback?: (err: AWSError, data: Neptunedata.Types.ListLoaderJobsOutput) => void): Request<Neptunedata.Types.ListLoaderJobsOutput, AWSError>;
  /**
   * Returns a list of Neptune ML data processing jobs. See Listing active data-processing jobs using the Neptune ML dataprocessing command.
   */
  listMLDataProcessingJobs(params: Neptunedata.Types.ListMLDataProcessingJobsInput, callback?: (err: AWSError, data: Neptunedata.Types.ListMLDataProcessingJobsOutput) => void): Request<Neptunedata.Types.ListMLDataProcessingJobsOutput, AWSError>;
  /**
   * Returns a list of Neptune ML data processing jobs. See Listing active data-processing jobs using the Neptune ML dataprocessing command.
   */
  listMLDataProcessingJobs(callback?: (err: AWSError, data: Neptunedata.Types.ListMLDataProcessingJobsOutput) => void): Request<Neptunedata.Types.ListMLDataProcessingJobsOutput, AWSError>;
  /**
   * Lists existing inference endpoints. See Managing inference endpoints using the endpoints command.
   */
  listMLEndpoints(params: Neptunedata.Types.ListMLEndpointsInput, callback?: (err: AWSError, data: Neptunedata.Types.ListMLEndpointsOutput) => void): Request<Neptunedata.Types.ListMLEndpointsOutput, AWSError>;
  /**
   * Lists existing inference endpoints. See Managing inference endpoints using the endpoints command.
   */
  listMLEndpoints(callback?: (err: AWSError, data: Neptunedata.Types.ListMLEndpointsOutput) => void): Request<Neptunedata.Types.ListMLEndpointsOutput, AWSError>;
  /**
   * Lists Neptune ML model-training jobs. See Model training using the modeltraining command.
   */
  listMLModelTrainingJobs(params: Neptunedata.Types.ListMLModelTrainingJobsInput, callback?: (err: AWSError, data: Neptunedata.Types.ListMLModelTrainingJobsOutput) => void): Request<Neptunedata.Types.ListMLModelTrainingJobsOutput, AWSError>;
  /**
   * Lists Neptune ML model-training jobs. See Model training using the modeltraining command.
   */
  listMLModelTrainingJobs(callback?: (err: AWSError, data: Neptunedata.Types.ListMLModelTrainingJobsOutput) => void): Request<Neptunedata.Types.ListMLModelTrainingJobsOutput, AWSError>;
  /**
   * Returns a list of model transform job IDs. See Use a trained model to generate new model artifacts.
   */
  listMLModelTransformJobs(params: Neptunedata.Types.ListMLModelTransformJobsInput, callback?: (err: AWSError, data: Neptunedata.Types.ListMLModelTransformJobsOutput) => void): Request<Neptunedata.Types.ListMLModelTransformJobsOutput, AWSError>;
  /**
   * Returns a list of model transform job IDs. See Use a trained model to generate new model artifacts.
   */
  listMLModelTransformJobs(callback?: (err: AWSError, data: Neptunedata.Types.ListMLModelTransformJobsOutput) => void): Request<Neptunedata.Types.ListMLModelTransformJobsOutput, AWSError>;
  /**
   * Lists active openCypher queries. See Neptune openCypher status endpoint for more information.
   */
  listOpenCypherQueries(params: Neptunedata.Types.ListOpenCypherQueriesInput, callback?: (err: AWSError, data: Neptunedata.Types.ListOpenCypherQueriesOutput) => void): Request<Neptunedata.Types.ListOpenCypherQueriesOutput, AWSError>;
  /**
   * Lists active openCypher queries. See Neptune openCypher status endpoint for more information.
   */
  listOpenCypherQueries(callback?: (err: AWSError, data: Neptunedata.Types.ListOpenCypherQueriesOutput) => void): Request<Neptunedata.Types.ListOpenCypherQueriesOutput, AWSError>;
  /**
   * Manages the generation and use of property graph statistics.
   */
  managePropertygraphStatistics(params: Neptunedata.Types.ManagePropertygraphStatisticsInput, callback?: (err: AWSError, data: Neptunedata.Types.ManagePropertygraphStatisticsOutput) => void): Request<Neptunedata.Types.ManagePropertygraphStatisticsOutput, AWSError>;
  /**
   * Manages the generation and use of property graph statistics.
   */
  managePropertygraphStatistics(callback?: (err: AWSError, data: Neptunedata.Types.ManagePropertygraphStatisticsOutput) => void): Request<Neptunedata.Types.ManagePropertygraphStatisticsOutput, AWSError>;
  /**
   * Manages the generation and use of RDF graph statistics.
   */
  manageSparqlStatistics(params: Neptunedata.Types.ManageSparqlStatisticsInput, callback?: (err: AWSError, data: Neptunedata.Types.ManageSparqlStatisticsOutput) => void): Request<Neptunedata.Types.ManageSparqlStatisticsOutput, AWSError>;
  /**
   * Manages the generation and use of RDF graph statistics.
   */
  manageSparqlStatistics(callback?: (err: AWSError, data: Neptunedata.Types.ManageSparqlStatisticsOutput) => void): Request<Neptunedata.Types.ManageSparqlStatisticsOutput, AWSError>;
  /**
   * Starts a Neptune bulk loader job to load data from an Amazon S3 bucket into a Neptune DB instance. See Using the Amazon Neptune Bulk Loader to Ingest Data.
   */
  startLoaderJob(params: Neptunedata.Types.StartLoaderJobInput, callback?: (err: AWSError, data: Neptunedata.Types.StartLoaderJobOutput) => void): Request<Neptunedata.Types.StartLoaderJobOutput, AWSError>;
  /**
   * Starts a Neptune bulk loader job to load data from an Amazon S3 bucket into a Neptune DB instance. See Using the Amazon Neptune Bulk Loader to Ingest Data.
   */
  startLoaderJob(callback?: (err: AWSError, data: Neptunedata.Types.StartLoaderJobOutput) => void): Request<Neptunedata.Types.StartLoaderJobOutput, AWSError>;
  /**
   * Creates a new Neptune ML data processing job for processing the graph data exported from Neptune for training. See The dataprocessing command.
   */
  startMLDataProcessingJob(params: Neptunedata.Types.StartMLDataProcessingJobInput, callback?: (err: AWSError, data: Neptunedata.Types.StartMLDataProcessingJobOutput) => void): Request<Neptunedata.Types.StartMLDataProcessingJobOutput, AWSError>;
  /**
   * Creates a new Neptune ML data processing job for processing the graph data exported from Neptune for training. See The dataprocessing command.
   */
  startMLDataProcessingJob(callback?: (err: AWSError, data: Neptunedata.Types.StartMLDataProcessingJobOutput) => void): Request<Neptunedata.Types.StartMLDataProcessingJobOutput, AWSError>;
  /**
   * Creates a new Neptune ML model training job. See Model training using the modeltraining command.
   */
  startMLModelTrainingJob(params: Neptunedata.Types.StartMLModelTrainingJobInput, callback?: (err: AWSError, data: Neptunedata.Types.StartMLModelTrainingJobOutput) => void): Request<Neptunedata.Types.StartMLModelTrainingJobOutput, AWSError>;
  /**
   * Creates a new Neptune ML model training job. See Model training using the modeltraining command.
   */
  startMLModelTrainingJob(callback?: (err: AWSError, data: Neptunedata.Types.StartMLModelTrainingJobOutput) => void): Request<Neptunedata.Types.StartMLModelTrainingJobOutput, AWSError>;
  /**
   * Creates a new model transform job. See Use a trained model to generate new model artifacts.
   */
  startMLModelTransformJob(params: Neptunedata.Types.StartMLModelTransformJobInput, callback?: (err: AWSError, data: Neptunedata.Types.StartMLModelTransformJobOutput) => void): Request<Neptunedata.Types.StartMLModelTransformJobOutput, AWSError>;
  /**
   * Creates a new model transform job. See Use a trained model to generate new model artifacts.
   */
  startMLModelTransformJob(callback?: (err: AWSError, data: Neptunedata.Types.StartMLModelTransformJobOutput) => void): Request<Neptunedata.Types.StartMLModelTransformJobOutput, AWSError>;
}
declare namespace Neptunedata {
  export type Action = "initiateDatabaseReset"|"performDatabaseReset"|string;
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export interface CancelGremlinQueryInput {
    /**
     * The unique identifier that identifies the query to be canceled.
     */
    queryId: String;
  }
  export interface CancelGremlinQueryOutput {
    /**
     * The status of the cancelation
     */
    status?: String;
  }
  export interface CancelLoaderJobInput {
    /**
     * The ID of the load job to be deleted.
     */
    loadId: String;
  }
  export interface CancelLoaderJobOutput {
    /**
     * The cancellation status.
     */
    status?: String;
  }
  export interface CancelMLDataProcessingJobInput {
    /**
     * The unique identifier of the data-processing job.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
    /**
     * If set to TRUE, this flag specifies that all Neptune ML S3 artifacts should be deleted when the job is stopped. The default is FALSE.
     */
    clean?: Boolean;
  }
  export interface CancelMLDataProcessingJobOutput {
    /**
     * The status of the cancellation request.
     */
    status?: String;
  }
  export interface CancelMLModelTrainingJobInput {
    /**
     * The unique identifier of the model-training job to be canceled.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
    /**
     * If set to TRUE, this flag specifies that all Amazon S3 artifacts should be deleted when the job is stopped. The default is FALSE.
     */
    clean?: Boolean;
  }
  export interface CancelMLModelTrainingJobOutput {
    /**
     * The status of the cancellation.
     */
    status?: String;
  }
  export interface CancelMLModelTransformJobInput {
    /**
     * The unique ID of the model transform job to be canceled.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
    /**
     * If this flag is set to TRUE, all Neptune ML S3 artifacts should be deleted when the job is stopped. The default is FALSE.
     */
    clean?: Boolean;
  }
  export interface CancelMLModelTransformJobOutput {
    /**
     * the status of the cancelation.
     */
    status?: String;
  }
  export interface CancelOpenCypherQueryInput {
    /**
     * The unique ID of the openCypher query to cancel.
     */
    queryId: String;
    /**
     * If set to TRUE, causes the cancelation of the openCypher query to happen silently.
     */
    silent?: Boolean;
  }
  export interface CancelOpenCypherQueryOutput {
    /**
     * The cancellation status of the openCypher query.
     */
    status?: String;
    /**
     * The cancelation payload for the openCypher query.
     */
    payload?: Boolean;
  }
  export type Classes = String[];
  export interface CreateMLEndpointInput {
    /**
     * A unique identifier for the new inference endpoint. The default is an autogenerated timestamped name.
     */
    id?: String;
    /**
     * The job Id of the completed model-training job that has created the model that the inference endpoint will point to. You must supply either the mlModelTrainingJobId or the mlModelTransformJobId.
     */
    mlModelTrainingJobId?: String;
    /**
     * The job Id of the completed model-transform job. You must supply either the mlModelTrainingJobId or the mlModelTransformJobId.
     */
    mlModelTransformJobId?: String;
    /**
     * If set to true, update indicates that this is an update request. The default is false. You must supply either the mlModelTrainingJobId or the mlModelTransformJobId.
     */
    update?: Boolean;
    /**
     * The ARN of an IAM role providing Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will be thrown.
     */
    neptuneIamRoleArn?: String;
    /**
     * Model type for training. By default the Neptune ML model is automatically based on the modelType used in data processing, but you can specify a different model type here. The default is rgcn for heterogeneous graphs and kge for knowledge graphs. The only valid value for heterogeneous graphs is rgcn. Valid values for knowledge graphs are: kge, transe, distmult, and rotate.
     */
    modelName?: String;
    /**
     * The type of Neptune ML instance to use for online servicing. The default is ml.m5.xlarge. Choosing the ML instance for an inference endpoint depends on the task type, the graph size, and your budget.
     */
    instanceType?: String;
    /**
     * The minimum number of Amazon EC2 instances to deploy to an endpoint for prediction. The default is 1
     */
    instanceCount?: Integer;
    /**
     * The Amazon Key Management Service (Amazon KMS) key that SageMaker uses to encrypt data on the storage volume attached to the ML compute instances that run the training job. The default is None.
     */
    volumeEncryptionKMSKey?: String;
  }
  export interface CreateMLEndpointOutput {
    /**
     * The unique ID of the new inference endpoint.
     */
    id?: String;
    /**
     * The ARN for the new inference endpoint.
     */
    arn?: String;
    /**
     * The endpoint creation time, in milliseconds.
     */
    creationTimeInMillis?: Long;
  }
  export interface CustomModelTrainingParameters {
    /**
     * The path to the Amazon S3 location where the Python module implementing your model is located. This must point to a valid existing Amazon S3 location that contains, at a minimum, a training script, a transform script, and a model-hpo-configuration.json file.
     */
    sourceS3DirectoryPath: String;
    /**
     * The name of the entry point in your module of a script that performs model training and takes hyperparameters as command-line arguments, including fixed hyperparameters. The default is training.py.
     */
    trainingEntryPointScript?: String;
    /**
     * The name of the entry point in your module of a script that should be run after the best model from the hyperparameter search has been identified, to compute the model artifacts necessary for model deployment. It should be able to run with no command-line arguments.The default is transform.py.
     */
    transformEntryPointScript?: String;
  }
  export interface CustomModelTransformParameters {
    /**
     * The path to the Amazon S3 location where the Python module implementing your model is located. This must point to a valid existing Amazon S3 location that contains, at a minimum, a training script, a transform script, and a model-hpo-configuration.json file.
     */
    sourceS3DirectoryPath: String;
    /**
     * The name of the entry point in your module of a script that should be run after the best model from the hyperparameter search has been identified, to compute the model artifacts necessary for model deployment. It should be able to run with no command-line arguments. The default is transform.py.
     */
    transformEntryPointScript?: String;
  }
  export interface DeleteMLEndpointInput {
    /**
     * The unique identifier of the inference endpoint.
     */
    id: String;
    /**
     * The ARN of an IAM role providing Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will be thrown.
     */
    neptuneIamRoleArn?: String;
    /**
     * If this flag is set to TRUE, all Neptune ML S3 artifacts should be deleted when the job is stopped. The default is FALSE.
     */
    clean?: Boolean;
  }
  export interface DeleteMLEndpointOutput {
    /**
     * The status of the cancellation.
     */
    status?: String;
  }
  export interface DeletePropertygraphStatisticsOutput {
    /**
     * The HTTP response code: 200 if the delete was successful, or 204 if there were no statistics to delete.
     */
    statusCode?: Integer;
    /**
     * The cancel status.
     */
    status?: String;
    /**
     * The deletion payload.
     */
    payload?: DeleteStatisticsValueMap;
  }
  export interface DeleteSparqlStatisticsOutput {
    /**
     * The HTTP response code: 200 if the delete was successful, or 204 if there were no statistics to delete.
     */
    statusCode?: Integer;
    /**
     * The cancel status.
     */
    status?: String;
    /**
     * The deletion payload.
     */
    payload?: DeleteStatisticsValueMap;
  }
  export interface DeleteStatisticsValueMap {
    /**
     * The current status of the statistics.
     */
    active?: Boolean;
    /**
     * The ID of the statistics generation run that is currently occurring.
     */
    statisticsId?: String;
  }
  export interface Document {
  }
  export type DocumentValuedMap = {[key: string]: Document};
  export type EdgeLabels = String[];
  export type EdgeProperties = String[];
  export interface EdgeStructure {
    /**
     * The number of edges that have this specific structure.
     */
    count?: Long;
    /**
     * A list of edge properties present in this specific structure.
     */
    edgeProperties?: EdgeProperties;
  }
  export type EdgeStructures = EdgeStructure[];
  export type Encoding = "gzip"|string;
  export interface ExecuteFastResetInput {
    /**
     * The fast reset action. One of the following values:     initiateDatabaseReset    –   This action generates a unique token needed to actually perform the fast reset.     performDatabaseReset    –   This action uses the token generated by the initiateDatabaseReset action to actually perform the fast reset.   
     */
    action: Action;
    /**
     * The fast-reset token to initiate the reset.
     */
    token?: String;
  }
  export interface ExecuteFastResetOutput {
    /**
     * The status is only returned for the performDatabaseReset action, and indicates whether or not the fast reset rquest is accepted.
     */
    status: String;
    /**
     * The payload is only returned by the initiateDatabaseReset action, and contains the unique token to use with the performDatabaseReset action to make the reset occur.
     */
    payload?: FastResetToken;
  }
  export interface ExecuteGremlinExplainQueryInput {
    /**
     * The Gremlin explain query string.
     */
    gremlinQuery: String;
  }
  export interface ExecuteGremlinExplainQueryOutput {
    /**
     * A text blob containing the Gremlin explain result, as described in Tuning Gremlin queries.
     */
    output?: ReportAsText;
  }
  export interface ExecuteGremlinProfileQueryInput {
    /**
     * The Gremlin query string to profile.
     */
    gremlinQuery: String;
    /**
     * If this flag is set to TRUE, the query results are gathered and displayed as part of the profile report. If FALSE, only the result count is displayed.
     */
    results?: Boolean;
    /**
     * If non-zero, causes the results string to be truncated at that number of characters. If set to zero, the string contains all the results.
     */
    chop?: Integer;
    /**
     * If non-null, the gathered results are returned in a serialized response message in the format specified by this parameter. See Gremlin profile API in Neptune for more information.
     */
    serializer?: String;
    /**
     * If this flag is set to TRUE, the results include a detailed report of all index operations that took place during query execution and serialization.
     */
    indexOps?: Boolean;
  }
  export interface ExecuteGremlinProfileQueryOutput {
    /**
     * A text blob containing the Gremlin Profile result. See Gremlin profile API in Neptune for details.
     */
    output?: ReportAsText;
  }
  export interface ExecuteGremlinQueryInput {
    /**
     * Using this API, you can run Gremlin queries in string format much as you can using the HTTP endpoint. The interface is compatible with whatever Gremlin version your DB cluster is using (see the Tinkerpop client section to determine which Gremlin releases your engine version supports).
     */
    gremlinQuery: String;
    /**
     * If non-null, the query results are returned in a serialized response message in the format specified by this parameter. See the GraphSON section in the TinkerPop documentation for a list of the formats that are currently supported.
     */
    serializer?: String;
  }
  export interface ExecuteGremlinQueryOutput {
    /**
     * The unique identifier of the Gremlin query.
     */
    requestId?: String;
    /**
     * The status of the Gremlin query.
     */
    status?: GremlinQueryStatusAttributes;
    /**
     * The Gremlin query output from the server.
     */
    result?: Document;
    /**
     * Metadata about the Gremlin query.
     */
    meta?: Document;
  }
  export interface ExecuteOpenCypherExplainQueryInput {
    /**
     * The openCypher query string.
     */
    openCypherQuery: String;
    /**
     * The openCypher query parameters.
     */
    parameters?: String;
    /**
     * The openCypher explain mode. Can be one of: static, dynamic, or details.
     */
    explainMode: OpenCypherExplainMode;
  }
  export interface ExecuteOpenCypherExplainQueryOutput {
    /**
     * A text blob containing the openCypher explain results.
     */
    results: _Blob;
  }
  export interface ExecuteOpenCypherQueryInput {
    /**
     * The openCypher query string to be executed.
     */
    openCypherQuery: String;
    /**
     * The openCypher query parameters for query execution. See Examples of openCypher parameterized queries for more information.
     */
    parameters?: String;
  }
  export interface ExecuteOpenCypherQueryOutput {
    /**
     * The openCypherquery results.
     */
    results: Document;
  }
  export interface FastResetToken {
    /**
     * A UUID generated by the database in the initiateDatabaseReset action, and then consumed by the performDatabaseReset to reset the database.
     */
    token?: String;
  }
  export type Format = "csv"|"opencypher"|"ntriples"|"nquads"|"rdfxml"|"turtle"|string;
  export interface GetEngineStatusOutput {
    /**
     * Set to healthy if the instance is not experiencing problems. If the instance is recovering from a crash or from being rebooted and there are active transactions running from the latest server shutdown, status is set to recovery.
     */
    status?: String;
    /**
     * Set to the UTC time at which the current server process started.
     */
    startTime?: String;
    /**
     * Set to the Neptune engine version running on your DB cluster. If this engine version has been manually patched since it was released, the version number is prefixed by Patch-.
     */
    dbEngineVersion?: String;
    /**
     * Set to reader if the instance is a read-replica, or to writer if the instance is the primary instance.
     */
    role?: String;
    /**
     * Set to enabled if the DFE engine is fully enabled, or to viaQueryHint (the default) if the DFE engine is only used with queries that have the useDFE query hint set to true.
     */
    dfeQueryEngine?: String;
    /**
     * Contains information about the Gremlin query language available on your cluster. Specifically, it contains a version field that specifies the current TinkerPop version being used by the engine.
     */
    gremlin?: QueryLanguageVersion;
    /**
     * Contains information about the SPARQL query language available on your cluster. Specifically, it contains a version field that specifies the current SPARQL version being used by the engine.
     */
    sparql?: QueryLanguageVersion;
    /**
     * Contains information about the openCypher query language available on your cluster. Specifically, it contains a version field that specifies the current operCypher version being used by the engine.
     */
    opencypher?: QueryLanguageVersion;
    /**
     * Contains Lab Mode settings being used by the engine.
     */
    labMode?: StringValuedMap;
    /**
     * If there are transactions being rolled back, this field is set to the number of such transactions. If there are none, the field doesn't appear at all.
     */
    rollingBackTrxCount?: Integer;
    /**
     * Set to the start time of the earliest transaction being rolled back. If no transactions are being rolled back, the field doesn't appear at all.
     */
    rollingBackTrxEarliestStartTime?: String;
    /**
     * Contains status information about the features enabled on your DB cluster.
     */
    features?: DocumentValuedMap;
    /**
     * Contains information about the current settings on your DB cluster. For example, contains the current cluster query timeout setting (clusterQueryTimeoutInMs).
     */
    settings?: StringValuedMap;
  }
  export interface GetGremlinQueryStatusInput {
    /**
     * The unique identifier that identifies the Gremlin query.
     */
    queryId: String;
  }
  export interface GetGremlinQueryStatusOutput {
    /**
     * The ID of the query for which status is being returned.
     */
    queryId?: String;
    /**
     * The Gremlin query string.
     */
    queryString?: String;
    /**
     * The evaluation status of the Gremlin query.
     */
    queryEvalStats?: QueryEvalStats;
  }
  export interface GetLoaderJobStatusInput {
    /**
     * The load ID of the load job to get the status of.
     */
    loadId: String;
    /**
     * Flag indicating whether or not to include details beyond the overall status (TRUE or FALSE; the default is FALSE).
     */
    details?: Boolean;
    /**
     * Flag indicating whether or not to include a list of errors encountered (TRUE or FALSE; the default is FALSE). The list of errors is paged. The page and errorsPerPage parameters allow you to page through all the errors.
     */
    errors?: Boolean;
    /**
     * The error page number (a positive integer; the default is 1). Only valid when the errors parameter is set to TRUE.
     */
    page?: PositiveInteger;
    /**
     * The number of errors returned in each page (a positive integer; the default is 10). Only valid when the errors parameter set to TRUE.
     */
    errorsPerPage?: PositiveInteger;
  }
  export interface GetLoaderJobStatusOutput {
    /**
     * The HTTP response code for the request.
     */
    status: String;
    /**
     * Status information about the load job, in a layout that could look like this:
     */
    payload: Document;
  }
  export interface GetMLDataProcessingJobInput {
    /**
     * The unique identifier of the data-processing job to be retrieved.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export interface GetMLDataProcessingJobOutput {
    /**
     * Status of the data processing job.
     */
    status?: String;
    /**
     * The unique identifier of this data-processing job.
     */
    id?: String;
    /**
     * Definition of the data processing job.
     */
    processingJob?: MlResourceDefinition;
  }
  export interface GetMLEndpointInput {
    /**
     * The unique identifier of the inference endpoint.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export interface GetMLEndpointOutput {
    /**
     * The status of the inference endpoint.
     */
    status?: String;
    /**
     * The unique identifier of the inference endpoint.
     */
    id?: String;
    /**
     * The endpoint definition.
     */
    endpoint?: MlResourceDefinition;
    /**
     * The endpoint configuration
     */
    endpointConfig?: MlConfigDefinition;
  }
  export interface GetMLModelTrainingJobInput {
    /**
     * The unique identifier of the model-training job to retrieve.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export interface GetMLModelTrainingJobOutput {
    /**
     * The status of the model training job.
     */
    status?: String;
    /**
     * The unique identifier of this model-training job.
     */
    id?: String;
    /**
     * The data processing job.
     */
    processingJob?: MlResourceDefinition;
    /**
     * The HPO job.
     */
    hpoJob?: MlResourceDefinition;
    /**
     * The model transform job.
     */
    modelTransformJob?: MlResourceDefinition;
    /**
     * A list of the configurations of the ML models being used.
     */
    mlModels?: MlModels;
  }
  export interface GetMLModelTransformJobInput {
    /**
     * The unique identifier of the model-transform job to be reetrieved.
     */
    id: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export interface GetMLModelTransformJobOutput {
    /**
     * The status of the model-transform job.
     */
    status?: String;
    /**
     * The unique identifier of the model-transform job to be retrieved.
     */
    id?: String;
    /**
     * The base data processing job.
     */
    baseProcessingJob?: MlResourceDefinition;
    /**
     * The remote model transform job.
     */
    remoteModelTransformJob?: MlResourceDefinition;
    /**
     * A list of the configuration information for the models being used.
     */
    models?: Models;
  }
  export interface GetOpenCypherQueryStatusInput {
    /**
     * The unique ID of the openCypher query for which to retrieve the query status.
     */
    queryId: String;
  }
  export interface GetOpenCypherQueryStatusOutput {
    /**
     * The unique ID of the query for which status is being returned.
     */
    queryId?: String;
    /**
     * The openCypher query string.
     */
    queryString?: String;
    /**
     * The openCypher query evaluation status.
     */
    queryEvalStats?: QueryEvalStats;
  }
  export interface GetPropertygraphStatisticsOutput {
    /**
     * The HTTP return code of the request. If the request succeeded, the code is 200. See Common error codes for DFE statistics request for a list of common errors.
     */
    status: String;
    /**
     * Statistics for property-graph data.
     */
    payload: Statistics;
  }
  export interface GetPropertygraphStreamInput {
    /**
     * Specifies the maximum number of records to return. There is also a size limit of 10 MB on the response that can't be modified and that takes precedence over the number of records specified in the limit parameter. The response does include a threshold-breaching record if the 10 MB limit was reached. The range for limit is 1 to 100,000, with a default of 10.
     */
    limit?: GetPropertygraphStreamInputLimitLong;
    /**
     * Can be one of:    AT_SEQUENCE_NUMBER   –   Indicates that reading should start from the event sequence number specified jointly by the commitNum and opNum parameters.    AFTER_SEQUENCE_NUMBER   –   Indicates that reading should start right after the event sequence number specified jointly by the commitNum and opNum parameters.    TRIM_HORIZON   –   Indicates that reading should start at the last untrimmed record in the system, which is the oldest unexpired (not yet deleted) record in the change-log stream.    LATEST   –   Indicates that reading should start at the most recent record in the system, which is the latest unexpired (not yet deleted) record in the change-log stream.  
     */
    iteratorType?: IteratorType;
    /**
     * The commit number of the starting record to read from the change-log stream. This parameter is required when iteratorType isAT_SEQUENCE_NUMBER or AFTER_SEQUENCE_NUMBER, and ignored when iteratorType is TRIM_HORIZON or LATEST.
     */
    commitNum?: Long;
    /**
     * The operation sequence number within the specified commit to start reading from in the change-log stream data. The default is 1.
     */
    opNum?: Long;
    /**
     * If set to TRUE, Neptune compresses the response using gzip encoding.
     */
    encoding?: Encoding;
  }
  export type GetPropertygraphStreamInputLimitLong = number;
  export interface GetPropertygraphStreamOutput {
    /**
     * Sequence identifier of the last change in the stream response. An event ID is composed of two fields: a commitNum, which identifies a transaction that changed the graph, and an opNum, which identifies a specific operation within that transaction:
     */
    lastEventId: StringValuedMap;
    /**
     * The time at which the commit for the transaction was requested, in milliseconds from the Unix epoch.
     */
    lastTrxTimestampInMillis: Long;
    /**
     * Serialization format for the change records being returned. Currently, the only supported value is PG_JSON.
     */
    format: String;
    /**
     * An array of serialized change-log stream records included in the response.
     */
    records: PropertygraphRecordsList;
    /**
     * The total number of records in the response.
     */
    totalRecords: Integer;
  }
  export interface GetPropertygraphSummaryInput {
    /**
     * Mode can take one of two values: BASIC (the default), and DETAILED.
     */
    mode?: GraphSummaryType;
  }
  export interface GetPropertygraphSummaryOutput {
    /**
     * The HTTP return code of the request. If the request succeeded, the code is 200.
     */
    statusCode?: Integer;
    /**
     * Payload containing the property graph summary response.
     */
    payload?: PropertygraphSummaryValueMap;
  }
  export interface GetRDFGraphSummaryInput {
    /**
     * Mode can take one of two values: BASIC (the default), and DETAILED.
     */
    mode?: GraphSummaryType;
  }
  export interface GetRDFGraphSummaryOutput {
    /**
     * The HTTP return code of the request. If the request succeeded, the code is 200.
     */
    statusCode?: Integer;
    /**
     * Payload for an RDF graph summary response
     */
    payload?: RDFGraphSummaryValueMap;
  }
  export interface GetSparqlStatisticsOutput {
    /**
     * The HTTP return code of the request. If the request succeeded, the code is 200. See Common error codes for DFE statistics request for a list of common errors.
     */
    status: String;
    /**
     * Statistics for RDF data.
     */
    payload: Statistics;
  }
  export interface GetSparqlStreamInput {
    /**
     * Specifies the maximum number of records to return. There is also a size limit of 10 MB on the response that can't be modified and that takes precedence over the number of records specified in the limit parameter. The response does include a threshold-breaching record if the 10 MB limit was reached. The range for limit is 1 to 100,000, with a default of 10.
     */
    limit?: GetSparqlStreamInputLimitLong;
    /**
     * Can be one of:    AT_SEQUENCE_NUMBER   –   Indicates that reading should start from the event sequence number specified jointly by the commitNum and opNum parameters.    AFTER_SEQUENCE_NUMBER   –   Indicates that reading should start right after the event sequence number specified jointly by the commitNum and opNum parameters.    TRIM_HORIZON   –   Indicates that reading should start at the last untrimmed record in the system, which is the oldest unexpired (not yet deleted) record in the change-log stream.    LATEST   –   Indicates that reading should start at the most recent record in the system, which is the latest unexpired (not yet deleted) record in the change-log stream.  
     */
    iteratorType?: IteratorType;
    /**
     * The commit number of the starting record to read from the change-log stream. This parameter is required when iteratorType isAT_SEQUENCE_NUMBER or AFTER_SEQUENCE_NUMBER, and ignored when iteratorType is TRIM_HORIZON or LATEST.
     */
    commitNum?: Long;
    /**
     * The operation sequence number within the specified commit to start reading from in the change-log stream data. The default is 1.
     */
    opNum?: Long;
    /**
     * If set to TRUE, Neptune compresses the response using gzip encoding.
     */
    encoding?: Encoding;
  }
  export type GetSparqlStreamInputLimitLong = number;
  export interface GetSparqlStreamOutput {
    /**
     * Sequence identifier of the last change in the stream response. An event ID is composed of two fields: a commitNum, which identifies a transaction that changed the graph, and an opNum, which identifies a specific operation within that transaction:
     */
    lastEventId: StringValuedMap;
    /**
     * The time at which the commit for the transaction was requested, in milliseconds from the Unix epoch.
     */
    lastTrxTimestampInMillis: Long;
    /**
     * Serialization format for the change records being returned. Currently, the only supported value is NQUADS.
     */
    format: String;
    /**
     * An array of serialized change-log stream records included in the response.
     */
    records: SparqlRecordsList;
    /**
     * The total number of records in the response.
     */
    totalRecords: Integer;
  }
  export type GraphSummaryType = "basic"|"detailed"|string;
  export type GremlinQueries = GremlinQueryStatus[];
  export interface GremlinQueryStatus {
    /**
     * The ID of the Gremlin query.
     */
    queryId?: String;
    /**
     * The query string of the Gremlin query.
     */
    queryString?: String;
    /**
     * The query statistics of the Gremlin query.
     */
    queryEvalStats?: QueryEvalStats;
  }
  export interface GremlinQueryStatusAttributes {
    /**
     * The status message.
     */
    message?: String;
    /**
     * The HTTP response code returned fro the Gremlin query request..
     */
    code?: Integer;
    /**
     * Attributes of the Gremlin query status.
     */
    attributes?: Document;
  }
  export type Integer = number;
  export type IteratorType = "AT_SEQUENCE_NUMBER"|"AFTER_SEQUENCE_NUMBER"|"TRIM_HORIZON"|"LATEST"|string;
  export interface ListGremlinQueriesInput {
    /**
     * If set to TRUE, the list returned includes waiting queries. The default is FALSE;
     */
    includeWaiting?: Boolean;
  }
  export interface ListGremlinQueriesOutput {
    /**
     * The number of queries that have been accepted but not yet completed, including queries in the queue.
     */
    acceptedQueryCount?: Integer;
    /**
     * The number of Gremlin queries currently running.
     */
    runningQueryCount?: Integer;
    /**
     * A list of the current queries.
     */
    queries?: GremlinQueries;
  }
  export interface ListLoaderJobsInput {
    /**
     * The number of load IDs to list. Must be a positive integer greater than zero and not more than 100 (which is the default).
     */
    limit?: ListLoaderJobsInputLimitInteger;
    /**
     * An optional parameter that can be used to exclude the load IDs of queued load requests when requesting a list of load IDs by setting the parameter to FALSE. The default value is TRUE.
     */
    includeQueuedLoads?: Boolean;
  }
  export type ListLoaderJobsInputLimitInteger = number;
  export interface ListLoaderJobsOutput {
    /**
     * Returns the status of the job list request.
     */
    status: String;
    /**
     * The requested list of job IDs.
     */
    payload: LoaderIdResult;
  }
  export interface ListMLDataProcessingJobsInput {
    /**
     * The maximum number of items to return (from 1 to 1024; the default is 10).
     */
    maxItems?: ListMLDataProcessingJobsInputMaxItemsInteger;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export type ListMLDataProcessingJobsInputMaxItemsInteger = number;
  export interface ListMLDataProcessingJobsOutput {
    /**
     * A page listing data processing job IDs.
     */
    ids?: StringList;
  }
  export interface ListMLEndpointsInput {
    /**
     * The maximum number of items to return (from 1 to 1024; the default is 10.
     */
    maxItems?: ListMLEndpointsInputMaxItemsInteger;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export type ListMLEndpointsInputMaxItemsInteger = number;
  export interface ListMLEndpointsOutput {
    /**
     * A page from the list of inference endpoint IDs.
     */
    ids?: StringList;
  }
  export interface ListMLModelTrainingJobsInput {
    /**
     * The maximum number of items to return (from 1 to 1024; the default is 10).
     */
    maxItems?: ListMLModelTrainingJobsInputMaxItemsInteger;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export type ListMLModelTrainingJobsInputMaxItemsInteger = number;
  export interface ListMLModelTrainingJobsOutput {
    /**
     * A page of the list of model training job IDs.
     */
    ids?: StringList;
  }
  export interface ListMLModelTransformJobsInput {
    /**
     * The maximum number of items to return (from 1 to 1024; the default is 10).
     */
    maxItems?: ListMLModelTransformJobsInputMaxItemsInteger;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
  }
  export type ListMLModelTransformJobsInputMaxItemsInteger = number;
  export interface ListMLModelTransformJobsOutput {
    /**
     * A page from the list of model transform IDs.
     */
    ids?: StringList;
  }
  export interface ListOpenCypherQueriesInput {
    /**
     *  When set to TRUE and other parameters are not present, causes status information to be returned for waiting queries as well as for running queries.
     */
    includeWaiting?: Boolean;
  }
  export interface ListOpenCypherQueriesOutput {
    /**
     * The number of queries that have been accepted but not yet completed, including queries in the queue.
     */
    acceptedQueryCount?: Integer;
    /**
     * The number of currently running openCypher queries.
     */
    runningQueryCount?: Integer;
    /**
     * A list of current openCypher queries.
     */
    queries?: OpenCypherQueries;
  }
  export interface LoaderIdResult {
    /**
     * A list of load IDs.
     */
    loadIds?: StringList;
  }
  export type Long = number;
  export type LongValuedMap = {[key: string]: Long};
  export type LongValuedMapList = LongValuedMap[];
  export interface ManagePropertygraphStatisticsInput {
    /**
     * The statistics generation mode. One of: DISABLE_AUTOCOMPUTE, ENABLE_AUTOCOMPUTE, or REFRESH, the last of which manually triggers DFE statistics generation.
     */
    mode?: StatisticsAutoGenerationMode;
  }
  export interface ManagePropertygraphStatisticsOutput {
    /**
     * The HTTP return code of the request. If the request succeeded, the code is 200.
     */
    status: String;
    /**
     * This is only returned for refresh mode.
     */
    payload?: RefreshStatisticsIdMap;
  }
  export interface ManageSparqlStatisticsInput {
    /**
     * The statistics generation mode. One of: DISABLE_AUTOCOMPUTE, ENABLE_AUTOCOMPUTE, or REFRESH, the last of which manually triggers DFE statistics generation.
     */
    mode?: StatisticsAutoGenerationMode;
  }
  export interface ManageSparqlStatisticsOutput {
    /**
     * The HTTP return code of the request. If the request succeeded, the code is 200.
     */
    status: String;
    /**
     * This is only returned for refresh mode.
     */
    payload?: RefreshStatisticsIdMap;
  }
  export interface MlConfigDefinition {
    /**
     * The configuration name.
     */
    name?: String;
    /**
     * The ARN for the configuration.
     */
    arn?: String;
  }
  export type MlModels = MlConfigDefinition[];
  export interface MlResourceDefinition {
    /**
     * The resource name.
     */
    name?: String;
    /**
     * The resource ARN.
     */
    arn?: String;
    /**
     * The resource status.
     */
    status?: String;
    /**
     * The output location.
     */
    outputLocation?: String;
    /**
     * The failure reason, in case of a failure.
     */
    failureReason?: String;
    /**
     * The CloudWatch log URL for the resource.
     */
    cloudwatchLogUrl?: String;
  }
  export type Mode = "RESUME"|"NEW"|"AUTO"|string;
  export type Models = MlConfigDefinition[];
  export type NodeLabels = String[];
  export type NodeProperties = String[];
  export interface NodeStructure {
    /**
     * Number of nodes that have this specific structure.
     */
    count?: Long;
    /**
     * A list of the node properties present in this specific structure.
     */
    nodeProperties?: NodeProperties;
    /**
     * A list of distinct outgoing edge labels present in this specific structure.
     */
    distinctOutgoingEdgeLabels?: OutgoingEdgeLabels;
  }
  export type NodeStructures = NodeStructure[];
  export type OpenCypherExplainMode = "static"|"dynamic"|"details"|string;
  export type OpenCypherQueries = GremlinQueryStatus[];
  export type OutgoingEdgeLabels = String[];
  export type Parallelism = "LOW"|"MEDIUM"|"HIGH"|"OVERSUBSCRIBE"|string;
  export type PositiveInteger = number;
  export type Predicates = String[];
  export interface PropertygraphData {
    /**
     * The ID of the Gremlin or openCypher element.
     */
    id: String;
    /**
     * The type of this Gremlin or openCypher element. Must be one of:     v1    -   Vertex label for Gremlin, or node label for openCypher.     vp    -   Vertex properties for Gremlin, or node properties for openCypher.     e    -   Edge and edge label for Gremlin, or relationship and relationship type for openCypher.     ep    -   Edge properties for Gremlin, or relationship properties for openCypher.  
     */
    type: String;
    /**
     * The property name. For element labels, this is label.
     */
    key: String;
    /**
     * This is a JSON object that contains a value field for the value itself, and a datatype field for the JSON data type of that value:
     */
    value: Document;
    /**
     * If this is an edge (type = e), the ID of the corresponding from vertex or source node.
     */
    from?: String;
    /**
     * If this is an edge (type = e), the ID of the corresponding to vertex or target node.
     */
    to?: String;
  }
  export interface PropertygraphRecord {
    /**
     * The time at which the commit for the transaction was requested, in milliseconds from the Unix epoch.
     */
    commitTimestampInMillis: Long;
    /**
     * The sequence identifier of the stream change record.
     */
    eventId: StringValuedMap;
    /**
     * The serialized Gremlin or openCypher change record.
     */
    data: PropertygraphData;
    /**
     * The operation that created the change.
     */
    op: String;
    /**
     * Only present if this operation is the last one in its transaction. If present, it is set to true. It is useful for ensuring that an entire transaction is consumed.
     */
    isLastOp?: Boolean;
  }
  export type PropertygraphRecordsList = PropertygraphRecord[];
  export interface PropertygraphSummary {
    /**
     * The number of nodes in the graph.
     */
    numNodes?: Long;
    /**
     * The number of edges in the graph.
     */
    numEdges?: Long;
    /**
     * The number of distinct node labels in the graph.
     */
    numNodeLabels?: Long;
    /**
     * The number of distinct edge labels in the graph.
     */
    numEdgeLabels?: Long;
    /**
     * A list of the distinct node labels in the graph.
     */
    nodeLabels?: NodeLabels;
    /**
     * A list of the distinct edge labels in the graph.
     */
    edgeLabels?: EdgeLabels;
    /**
     * A list of the distinct node properties in the graph, along with the count of nodes where each property is used.
     */
    numNodeProperties?: Long;
    /**
     * The number of distinct edge properties in the graph.
     */
    numEdgeProperties?: Long;
    /**
     * The number of distinct node properties in the graph.
     */
    nodeProperties?: LongValuedMapList;
    /**
     * A list of the distinct edge properties in the graph, along with the count of edges where each property is used.
     */
    edgeProperties?: LongValuedMapList;
    /**
     * The total number of usages of all node properties.
     */
    totalNodePropertyValues?: Long;
    /**
     * The total number of usages of all edge properties.
     */
    totalEdgePropertyValues?: Long;
    /**
     * This field is only present when the requested mode is DETAILED. It contains a list of node structures.
     */
    nodeStructures?: NodeStructures;
    /**
     * This field is only present when the requested mode is DETAILED. It contains a list of edge structures.
     */
    edgeStructures?: EdgeStructures;
  }
  export interface PropertygraphSummaryValueMap {
    /**
     * The version of this graph summary response.
     */
    version?: String;
    /**
     * The timestamp, in ISO 8601 format, of the time at which Neptune last computed statistics.
     */
    lastStatisticsComputationTime?: SyntheticTimestamp_date_time;
    /**
     * The graph summary.
     */
    graphSummary?: PropertygraphSummary;
  }
  export interface QueryEvalStats {
    /**
     * Indicates how long the query waited, in milliseconds.
     */
    waited?: Integer;
    /**
     * The number of milliseconds the query has been running so far.
     */
    elapsed?: Integer;
    /**
     * Set to TRUE if the query was cancelled, or FALSE otherwise.
     */
    cancelled?: Boolean;
    /**
     * The number of subqueries in this query.
     */
    subqueries?: Document;
  }
  export interface QueryLanguageVersion {
    /**
     * The version of the query language.
     */
    version: String;
  }
  export interface RDFGraphSummary {
    /**
     * The number of distinct subjects in the graph.
     */
    numDistinctSubjects?: Long;
    /**
     * The number of distinct predicates in the graph.
     */
    numDistinctPredicates?: Long;
    /**
     * The number of quads in the graph.
     */
    numQuads?: Long;
    /**
     * The number of classes in the graph.
     */
    numClasses?: Long;
    /**
     * A list of the classes in the graph.
     */
    classes?: Classes;
    /**
     * "A list of predicates in the graph, along with the predicate counts.
     */
    predicates?: LongValuedMapList;
    /**
     * This field is only present when the request mode is DETAILED. It contains a list of subject structures.
     */
    subjectStructures?: SubjectStructures;
  }
  export interface RDFGraphSummaryValueMap {
    /**
     * The version of this graph summary response.
     */
    version?: String;
    /**
     * The timestamp, in ISO 8601 format, of the time at which Neptune last computed statistics.
     */
    lastStatisticsComputationTime?: SyntheticTimestamp_date_time;
    /**
     * The graph summary of an RDF graph. See Graph summary response for an RDF graph.
     */
    graphSummary?: RDFGraphSummary;
  }
  export interface RefreshStatisticsIdMap {
    /**
     * The ID of the statistics generation run that is currently occurring.
     */
    statisticsId?: String;
  }
  export type ReportAsText = Buffer|Uint8Array|Blob|string;
  export type S3BucketRegion = "us-east-1"|"us-east-2"|"us-west-1"|"us-west-2"|"ca-central-1"|"sa-east-1"|"eu-north-1"|"eu-west-1"|"eu-west-2"|"eu-west-3"|"eu-central-1"|"me-south-1"|"af-south-1"|"ap-east-1"|"ap-northeast-1"|"ap-northeast-2"|"ap-southeast-1"|"ap-southeast-2"|"ap-south-1"|"cn-north-1"|"cn-northwest-1"|"us-gov-west-1"|"us-gov-east-1"|string;
  export interface SparqlData {
    /**
     * Holds an N-QUADS statement expressing the changed quad.
     */
    stmt: String;
  }
  export interface SparqlRecord {
    /**
     * The time at which the commit for the transaction was requested, in milliseconds from the Unix epoch.
     */
    commitTimestampInMillis: Long;
    /**
     * The sequence identifier of the stream change record.
     */
    eventId: StringValuedMap;
    /**
     * The serialized SPARQL change record. The serialization formats of each record are described in more detail in Serialization Formats in Neptune Streams.
     */
    data: SparqlData;
    /**
     * The operation that created the change.
     */
    op: String;
    /**
     * Only present if this operation is the last one in its transaction. If present, it is set to true. It is useful for ensuring that an entire transaction is consumed.
     */
    isLastOp?: Boolean;
  }
  export type SparqlRecordsList = SparqlRecord[];
  export interface StartLoaderJobInput {
    /**
     * The source parameter accepts an S3 URI that identifies a single file, multiple files, a folder, or multiple folders. Neptune loads every data file in any folder that is specified. The URI can be in any of the following formats.    s3://(bucket_name)/(object-key-name)     https://s3.amazonaws.com/(bucket_name)/(object-key-name)     https://s3.us-east-1.amazonaws.com/(bucket_name)/(object-key-name)    The object-key-name element of the URI is equivalent to the prefix parameter in an S3 ListObjects API call. It identifies all the objects in the specified S3 bucket whose names begin with that prefix. That can be a single file or folder, or multiple files and/or folders. The specified folder or folders can contain multiple vertex files and multiple edge files.
     */
    source: String;
    /**
     * The format of the data. For more information about data formats for the Neptune Loader command, see Load Data Formats.  Allowed values      csv  for the Gremlin CSV data format.     opencypher  for the openCypher CSV data format.     ntriples  for the N-Triples RDF data format.     nquads  for the N-Quads RDF data format.     rdfxml  for the RDF\XML RDF data format.     turtle  for the Turtle RDF data format.  
     */
    format: Format;
    /**
     * The Amazon region of the S3 bucket. This must match the Amazon Region of the DB cluster.
     */
    s3BucketRegion: S3BucketRegion;
    /**
     * The Amazon Resource Name (ARN) for an IAM role to be assumed by the Neptune DB instance for access to the S3 bucket. The IAM role ARN provided here should be attached to the DB cluster (see Adding the IAM Role to an Amazon Neptune Cluster.
     */
    iamRoleArn: String;
    /**
     * The load job mode.  Allowed values: RESUME, NEW, AUTO.  Default value: AUTO.       RESUME   –   In RESUME mode, the loader looks for a previous load from this source, and if it finds one, resumes that load job. If no previous load job is found, the loader stops. The loader avoids reloading files that were successfully loaded in a previous job. It only tries to process failed files. If you dropped previously loaded data from your Neptune cluster, that data is not reloaded in this mode. If a previous load job loaded all files from the same source successfully, nothing is reloaded, and the loader returns success.    NEW   –   In NEW mode, the creates a new load request regardless of any previous loads. You can use this mode to reload all the data from a source after dropping previously loaded data from your Neptune cluster, or to load new data available at the same source.    AUTO   –   In AUTO mode, the loader looks for a previous load job from the same source, and if it finds one, resumes that job, just as in RESUME mode. If the loader doesn't find a previous load job from the same source, it loads all data from the source, just as in NEW mode.  
     */
    mode?: Mode;
    /**
     *   failOnError    –   A flag to toggle a complete stop on an error.  Allowed values: "TRUE", "FALSE".  Default value: "TRUE". When this parameter is set to "FALSE", the loader tries to load all the data in the location specified, skipping any entries with errors. When this parameter is set to "TRUE", the loader stops as soon as it encounters an error. Data loaded up to that point persists.
     */
    failOnError?: Boolean;
    /**
     * The optional parallelism parameter can be set to reduce the number of threads used by the bulk load process.  Allowed values:    LOW –   The number of threads used is the number of available vCPUs divided by 8.    MEDIUM –   The number of threads used is the number of available vCPUs divided by 2.    HIGH –   The number of threads used is the same as the number of available vCPUs.    OVERSUBSCRIBE –   The number of threads used is the number of available vCPUs multiplied by 2. If this value is used, the bulk loader takes up all available resources. This does not mean, however, that the OVERSUBSCRIBE setting results in 100% CPU utilization. Because the load operation is I/O bound, the highest CPU utilization to expect is in the 60% to 70% range.    Default value: HIGH  The parallelism setting can sometimes result in a deadlock between threads when loading openCypher data. When this happens, Neptune returns the LOAD_DATA_DEADLOCK error. You can generally fix the issue by setting parallelism to a lower setting and retrying the load command.
     */
    parallelism?: Parallelism;
    /**
     *   parserConfiguration    –   An optional object with additional parser configuration values. Each of the child parameters is also optional:        namedGraphUri    –   The default graph for all RDF formats when no graph is specified (for non-quads formats and NQUAD entries with no graph). The default is https://aws.amazon.com/neptune/vocab/v01/DefaultNamedGraph.     baseUri    –   The base URI for RDF/XML and Turtle formats. The default is https://aws.amazon.com/neptune/default.     allowEmptyStrings    –   Gremlin users need to be able to pass empty string values("") as node and edge properties when loading CSV data. If allowEmptyStrings is set to false (the default), such empty strings are treated as nulls and are not loaded. If allowEmptyStrings is set to true, the loader treats empty strings as valid property values and loads them accordingly.  
     */
    parserConfiguration?: StringValuedMap;
    /**
     *  updateSingleCardinalityProperties is an optional parameter that controls how the bulk loader treats a new value for single-cardinality vertex or edge properties. This is not supported for loading openCypher data.  Allowed values: "TRUE", "FALSE".  Default value: "FALSE". By default, or when updateSingleCardinalityProperties is explicitly set to "FALSE", the loader treats a new value as an error, because it violates single cardinality. When updateSingleCardinalityProperties is set to "TRUE", on the other hand, the bulk loader replaces the existing value with the new one. If multiple edge or single-cardinality vertex property values are provided in the source file(s) being loaded, the final value at the end of the bulk load could be any one of those new values. The loader only guarantees that the existing value has been replaced by one of the new ones.
     */
    updateSingleCardinalityProperties?: Boolean;
    /**
     * This is an optional flag parameter that indicates whether the load request can be queued up or not.  You don't have to wait for one load job to complete before issuing the next one, because Neptune can queue up as many as 64 jobs at a time, provided that their queueRequest parameters are all set to "TRUE". If the queueRequest parameter is omitted or set to "FALSE", the load request will fail if another load job is already running.  Allowed values: "TRUE", "FALSE".  Default value: "FALSE".
     */
    queueRequest?: Boolean;
    /**
     * This is an optional parameter that can make a queued load request contingent on the successful completion of one or more previous jobs in the queue. Neptune can queue up as many as 64 load requests at a time, if their queueRequest parameters are set to "TRUE". The dependencies parameter lets you make execution of such a queued request dependent on the successful completion of one or more specified previous requests in the queue. For example, if load Job-A and Job-B are independent of each other, but load Job-C needs Job-A and Job-B to be finished before it begins, proceed as follows:   Submit load-job-A and load-job-B one after another in any order, and save their load-ids.   Submit load-job-C with the load-ids of the two jobs in its dependencies field:   Because of the dependencies parameter, the bulk loader will not start Job-C until Job-A and Job-B have completed successfully. If either one of them fails, Job-C will not be executed, and its status will be set to LOAD_FAILED_BECAUSE_DEPENDENCY_NOT_SATISFIED. You can set up multiple levels of dependency in this way, so that the failure of one job will cause all requests that are directly or indirectly dependent on it to be cancelled.
     */
    dependencies?: StringList;
    /**
     * This parameter is required only when loading openCypher data that contains relationship IDs. It must be included and set to True when openCypher relationship IDs are explicitly provided in the load data (recommended). When userProvidedEdgeIds is absent or set to True, an :ID column must be present in every relationship file in the load. When userProvidedEdgeIds is present and set to False, relationship files in the load must not contain an :ID column. Instead, the Neptune loader automatically generates an ID for each relationship. It's useful to provide relationship IDs explicitly so that the loader can resume loading after error in the CSV data have been fixed, without having to reload any relationships that have already been loaded. If relationship IDs have not been explicitly assigned, the loader cannot resume a failed load if any relationship file has had to be corrected, and must instead reload all the relationships.
     */
    userProvidedEdgeIds?: Boolean;
  }
  export interface StartLoaderJobOutput {
    /**
     * The HTTP return code indicating the status of the load job.
     */
    status: String;
    /**
     * Contains a loadId name-value pair that provides an identifier for the load operation.
     */
    payload: StringValuedMap;
  }
  export interface StartMLDataProcessingJobInput {
    /**
     * A unique identifier for the new job. The default is an autogenerated UUID.
     */
    id?: String;
    /**
     * The job ID of a completed data processing job run on an earlier version of the data.
     */
    previousDataProcessingJobId?: String;
    /**
     * The URI of the Amazon S3 location where you want SageMaker to download the data needed to run the data processing job.
     */
    inputDataS3Location: String;
    /**
     * The URI of the Amazon S3 location where you want SageMaker to save the results of a data processing job.
     */
    processedDataS3Location: String;
    /**
     * The ARN of an IAM role for SageMaker execution. This must be listed in your DB cluster parameter group or an error will occur.
     */
    sagemakerIamRoleArn?: String;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that SageMaker can assume to perform tasks on your behalf. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
    /**
     * The type of ML instance used during data processing. Its memory should be large enough to hold the processed dataset. The default is the smallest ml.r5 type whose memory is ten times larger than the size of the exported graph data on disk.
     */
    processingInstanceType?: String;
    /**
     * The disk volume size of the processing instance. Both input data and processed data are stored on disk, so the volume size must be large enough to hold both data sets. The default is 0. If not specified or 0, Neptune ML chooses the volume size automatically based on the data size.
     */
    processingInstanceVolumeSizeInGB?: Integer;
    /**
     * Timeout in seconds for the data processing job. The default is 86,400 (1 day).
     */
    processingTimeOutInSeconds?: Integer;
    /**
     * One of the two model types that Neptune ML currently supports: heterogeneous graph models (heterogeneous), and knowledge graph (kge). The default is none. If not specified, Neptune ML chooses the model type automatically based on the data.
     */
    modelType?: String;
    /**
     * A data specification file that describes how to load the exported graph data for training. The file is automatically generated by the Neptune export toolkit. The default is training-data-configuration.json.
     */
    configFileName?: String;
    /**
     * The IDs of the subnets in the Neptune VPC. The default is None.
     */
    subnets?: StringList;
    /**
     * The VPC security group IDs. The default is None.
     */
    securityGroupIds?: StringList;
    /**
     * The Amazon Key Management Service (Amazon KMS) key that SageMaker uses to encrypt data on the storage volume attached to the ML compute instances that run the training job. The default is None.
     */
    volumeEncryptionKMSKey?: String;
    /**
     * The Amazon Key Management Service (Amazon KMS) key that SageMaker uses to encrypt the output of the processing job. The default is none.
     */
    s3OutputEncryptionKMSKey?: String;
  }
  export interface StartMLDataProcessingJobOutput {
    /**
     * The unique ID of the new data processing job.
     */
    id?: String;
    /**
     * The ARN of the data processing job.
     */
    arn?: String;
    /**
     * The time it took to create the new processing job, in milliseconds.
     */
    creationTimeInMillis?: Long;
  }
  export interface StartMLModelTrainingJobInput {
    /**
     * A unique identifier for the new job. The default is An autogenerated UUID.
     */
    id?: String;
    /**
     * The job ID of a completed model-training job that you want to update incrementally based on updated data.
     */
    previousModelTrainingJobId?: String;
    /**
     * The job ID of the completed data-processing job that has created the data that the training will work with.
     */
    dataProcessingJobId: String;
    /**
     * The location in Amazon S3 where the model artifacts are to be stored.
     */
    trainModelS3Location: String;
    /**
     * The ARN of an IAM role for SageMaker execution.This must be listed in your DB cluster parameter group or an error will occur.
     */
    sagemakerIamRoleArn?: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
    /**
     * The type of ML instance used in preparing and managing training of ML models. This is a CPU instance chosen based on memory requirements for processing the training data and model.
     */
    baseProcessingInstanceType?: String;
    /**
     * The type of ML instance used for model training. All Neptune ML models support CPU, GPU, and multiGPU training. The default is ml.p3.2xlarge. Choosing the right instance type for training depends on the task type, graph size, and your budget.
     */
    trainingInstanceType?: String;
    /**
     * The disk volume size of the training instance. Both input data and the output model are stored on disk, so the volume size must be large enough to hold both data sets. The default is 0. If not specified or 0, Neptune ML selects a disk volume size based on the recommendation generated in the data processing step.
     */
    trainingInstanceVolumeSizeInGB?: Integer;
    /**
     * Timeout in seconds for the training job. The default is 86,400 (1 day).
     */
    trainingTimeOutInSeconds?: Integer;
    /**
     * Maximum total number of training jobs to start for the hyperparameter tuning job. The default is 2. Neptune ML automatically tunes the hyperparameters of the machine learning model. To obtain a model that performs well, use at least 10 jobs (in other words, set maxHPONumberOfTrainingJobs to 10). In general, the more tuning runs, the better the results.
     */
    maxHPONumberOfTrainingJobs?: Integer;
    /**
     * Maximum number of parallel training jobs to start for the hyperparameter tuning job. The default is 2. The number of parallel jobs you can run is limited by the available resources on your training instance.
     */
    maxHPOParallelTrainingJobs?: Integer;
    /**
     * The IDs of the subnets in the Neptune VPC. The default is None.
     */
    subnets?: StringList;
    /**
     * The VPC security group IDs. The default is None.
     */
    securityGroupIds?: StringList;
    /**
     * The Amazon Key Management Service (KMS) key that SageMaker uses to encrypt data on the storage volume attached to the ML compute instances that run the training job. The default is None.
     */
    volumeEncryptionKMSKey?: String;
    /**
     * The Amazon Key Management Service (KMS) key that SageMaker uses to encrypt the output of the processing job. The default is none.
     */
    s3OutputEncryptionKMSKey?: String;
    /**
     * Optimizes the cost of training machine-learning models by using Amazon Elastic Compute Cloud spot instances. The default is False.
     */
    enableManagedSpotTraining?: Boolean;
    /**
     * The configuration for custom model training. This is a JSON object.
     */
    customModelTrainingParameters?: CustomModelTrainingParameters;
  }
  export interface StartMLModelTrainingJobOutput {
    /**
     * The unique ID of the new model training job.
     */
    id?: String;
    /**
     * The ARN of the new model training job.
     */
    arn?: String;
    /**
     * The model training job creation time, in milliseconds.
     */
    creationTimeInMillis?: Long;
  }
  export interface StartMLModelTransformJobInput {
    /**
     * A unique identifier for the new job. The default is an autogenerated UUID.
     */
    id?: String;
    /**
     * The job ID of a completed data-processing job. You must include either dataProcessingJobId and a mlModelTrainingJobId, or a trainingJobName.
     */
    dataProcessingJobId?: String;
    /**
     * The job ID of a completed model-training job. You must include either dataProcessingJobId and a mlModelTrainingJobId, or a trainingJobName.
     */
    mlModelTrainingJobId?: String;
    /**
     * The name of a completed SageMaker training job. You must include either dataProcessingJobId and a mlModelTrainingJobId, or a trainingJobName.
     */
    trainingJobName?: String;
    /**
     * The location in Amazon S3 where the model artifacts are to be stored.
     */
    modelTransformOutputS3Location: String;
    /**
     * The ARN of an IAM role for SageMaker execution. This must be listed in your DB cluster parameter group or an error will occur.
     */
    sagemakerIamRoleArn?: String;
    /**
     * The ARN of an IAM role that provides Neptune access to SageMaker and Amazon S3 resources. This must be listed in your DB cluster parameter group or an error will occur.
     */
    neptuneIamRoleArn?: String;
    /**
     * Configuration information for a model transform using a custom model. The customModelTransformParameters object contains the following fields, which must have values compatible with the saved model parameters from the training job:
     */
    customModelTransformParameters?: CustomModelTransformParameters;
    /**
     * The type of ML instance used in preparing and managing training of ML models. This is an ML compute instance chosen based on memory requirements for processing the training data and model.
     */
    baseProcessingInstanceType?: String;
    /**
     * The disk volume size of the training instance in gigabytes. The default is 0. Both input data and the output model are stored on disk, so the volume size must be large enough to hold both data sets. If not specified or 0, Neptune ML selects a disk volume size based on the recommendation generated in the data processing step.
     */
    baseProcessingInstanceVolumeSizeInGB?: Integer;
    /**
     * The IDs of the subnets in the Neptune VPC. The default is None.
     */
    subnets?: StringList;
    /**
     * The VPC security group IDs. The default is None.
     */
    securityGroupIds?: StringList;
    /**
     * The Amazon Key Management Service (KMS) key that SageMaker uses to encrypt data on the storage volume attached to the ML compute instances that run the training job. The default is None.
     */
    volumeEncryptionKMSKey?: String;
    /**
     * The Amazon Key Management Service (KMS) key that SageMaker uses to encrypt the output of the processing job. The default is none.
     */
    s3OutputEncryptionKMSKey?: String;
  }
  export interface StartMLModelTransformJobOutput {
    /**
     * The unique ID of the new model transform job.
     */
    id?: String;
    /**
     * The ARN of the model transform job.
     */
    arn?: String;
    /**
     * The creation time of the model transform job, in milliseconds.
     */
    creationTimeInMillis?: Long;
  }
  export interface Statistics {
    /**
     * Indicates whether or not automatic statistics generation is enabled.
     */
    autoCompute?: Boolean;
    /**
     * Indicates whether or not DFE statistics generation is enabled at all.
     */
    active?: Boolean;
    /**
     * Reports the ID of the current statistics generation run. A value of -1 indicates that no statistics have been generated.
     */
    statisticsId?: String;
    /**
     * The UTC time at which DFE statistics have most recently been generated.
     */
    date?: SyntheticTimestamp_date_time;
    /**
     * A note about problems in the case where statistics are invalid.
     */
    note?: String;
    /**
     * A StatisticsSummary structure that contains:    signatureCount - The total number of signatures across all characteristic sets.    instanceCount - The total number of characteristic-set instances.    predicateCount - The total number of unique predicates.  
     */
    signatureInfo?: StatisticsSummary;
  }
  export type StatisticsAutoGenerationMode = "disableAutoCompute"|"enableAutoCompute"|"refresh"|string;
  export interface StatisticsSummary {
    /**
     * The total number of signatures across all characteristic sets.
     */
    signatureCount?: Integer;
    /**
     * The total number of characteristic-set instances.
     */
    instanceCount?: Integer;
    /**
     * The total number of unique predicates.
     */
    predicateCount?: Integer;
  }
  export type String = string;
  export type StringList = String[];
  export type StringValuedMap = {[key: string]: String};
  export interface SubjectStructure {
    /**
     * Number of occurrences of this specific structure.
     */
    count?: Long;
    /**
     * A list of predicates present in this specific structure.
     */
    predicates?: Predicates;
  }
  export type SubjectStructures = SubjectStructure[];
  export type SyntheticTimestamp_date_time = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2023-08-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Neptunedata client.
   */
  export import Types = Neptunedata;
}
export = Neptunedata;
