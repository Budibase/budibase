import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ForecastService extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ForecastService.Types.ClientConfiguration)
  config: Config & ForecastService.Types.ClientConfiguration;
  /**
   * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps Forecast understand how to consume the data for model training. This includes the following:     DataFrequency  - How frequently your historical time-series data is collected.     Domain  and  DatasetType  - Each dataset has an associated dataset domain and a type within the domain. Amazon Forecast provides a list of predefined domains and types within each domain. For each unique dataset domain and type within the domain, Amazon Forecast requires your data to include a minimum set of predefined fields.     Schema  - A schema specifies the fields in the dataset, including the field name and data type.   After creating a dataset, you import your training data into it and add the dataset to a dataset group. You use the dataset group to create a predictor. For more information, see howitworks-datasets-groups. To get a list of all your datasets, use the ListDatasets operation. For example Forecast datasets, see the Amazon Forecast Sample GitHub repository.  The Status of a dataset must be ACTIVE before you can import training data. Use the DescribeDataset operation to get the status. 
   */
  createDataset(params: ForecastService.Types.CreateDatasetRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetResponse) => void): Request<ForecastService.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps Forecast understand how to consume the data for model training. This includes the following:     DataFrequency  - How frequently your historical time-series data is collected.     Domain  and  DatasetType  - Each dataset has an associated dataset domain and a type within the domain. Amazon Forecast provides a list of predefined domains and types within each domain. For each unique dataset domain and type within the domain, Amazon Forecast requires your data to include a minimum set of predefined fields.     Schema  - A schema specifies the fields in the dataset, including the field name and data type.   After creating a dataset, you import your training data into it and add the dataset to a dataset group. You use the dataset group to create a predictor. For more information, see howitworks-datasets-groups. To get a list of all your datasets, use the ListDatasets operation. For example Forecast datasets, see the Amazon Forecast Sample GitHub repository.  The Status of a dataset must be ACTIVE before you can import training data. Use the DescribeDataset operation to get the status. 
   */
  createDataset(callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetResponse) => void): Request<ForecastService.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a dataset group, which holds a collection of related datasets. You can add datasets to the dataset group when you create the dataset group, or later by using the UpdateDatasetGroup operation. After creating a dataset group and adding datasets, you use the dataset group when you create a predictor. For more information, see howitworks-datasets-groups. To get a list of all your datasets groups, use the ListDatasetGroups operation.  The Status of a dataset group must be ACTIVE before you can use the dataset group to create a predictor. To get the status, use the DescribeDatasetGroup operation. 
   */
  createDatasetGroup(params: ForecastService.Types.CreateDatasetGroupRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetGroupResponse) => void): Request<ForecastService.Types.CreateDatasetGroupResponse, AWSError>;
  /**
   * Creates a dataset group, which holds a collection of related datasets. You can add datasets to the dataset group when you create the dataset group, or later by using the UpdateDatasetGroup operation. After creating a dataset group and adding datasets, you use the dataset group when you create a predictor. For more information, see howitworks-datasets-groups. To get a list of all your datasets groups, use the ListDatasetGroups operation.  The Status of a dataset group must be ACTIVE before you can use the dataset group to create a predictor. To get the status, use the DescribeDatasetGroup operation. 
   */
  createDatasetGroup(callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetGroupResponse) => void): Request<ForecastService.Types.CreateDatasetGroupResponse, AWSError>;
  /**
   * Imports your training data to an Amazon Forecast dataset. You provide the location of your training data in an Amazon Simple Storage Service (Amazon S3) bucket and the Amazon Resource Name (ARN) of the dataset that you want to import the data to. You must specify a DataSource object that includes an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data, as Amazon Forecast makes a copy of your data and processes it in an internal AWS system. For more information, see aws-forecast-iam-roles. The training data must be in CSV format. The delimiter must be a comma (,). You can specify the path to a specific CSV file, the S3 bucket, or to a folder in the S3 bucket. For the latter two cases, Amazon Forecast imports all files up to the limit of 10,000 files. Because dataset imports are not aggregated, your most recent dataset import is the one that is used when training a predictor or generating a forecast. Make sure that your most recent dataset import contains all of the data you want to model off of, and not just the new data collected since the previous import. To get a list of all your dataset import jobs, filtered by specified criteria, use the ListDatasetImportJobs operation.
   */
  createDatasetImportJob(params: ForecastService.Types.CreateDatasetImportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetImportJobResponse) => void): Request<ForecastService.Types.CreateDatasetImportJobResponse, AWSError>;
  /**
   * Imports your training data to an Amazon Forecast dataset. You provide the location of your training data in an Amazon Simple Storage Service (Amazon S3) bucket and the Amazon Resource Name (ARN) of the dataset that you want to import the data to. You must specify a DataSource object that includes an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data, as Amazon Forecast makes a copy of your data and processes it in an internal AWS system. For more information, see aws-forecast-iam-roles. The training data must be in CSV format. The delimiter must be a comma (,). You can specify the path to a specific CSV file, the S3 bucket, or to a folder in the S3 bucket. For the latter two cases, Amazon Forecast imports all files up to the limit of 10,000 files. Because dataset imports are not aggregated, your most recent dataset import is the one that is used when training a predictor or generating a forecast. Make sure that your most recent dataset import contains all of the data you want to model off of, and not just the new data collected since the previous import. To get a list of all your dataset import jobs, filtered by specified criteria, use the ListDatasetImportJobs operation.
   */
  createDatasetImportJob(callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetImportJobResponse) => void): Request<ForecastService.Types.CreateDatasetImportJobResponse, AWSError>;
  /**
   * Creates a forecast for each item in the TARGET_TIME_SERIES dataset that was used to train the predictor. This is known as inference. To retrieve the forecast for a single item at low latency, use the operation. To export the complete forecast into your Amazon Simple Storage Service (Amazon S3) bucket, use the CreateForecastExportJob operation. The range of the forecast is determined by the ForecastHorizon value, which you specify in the CreatePredictor request. When you query a forecast, you can request a specific date range within the forecast. To get a list of all your forecasts, use the ListForecasts operation.  The forecasts generated by Amazon Forecast are in the same time zone as the dataset that was used to create the predictor.  For more information, see howitworks-forecast.  The Status of the forecast must be ACTIVE before you can query or export the forecast. Use the DescribeForecast operation to get the status. 
   */
  createForecast(params: ForecastService.Types.CreateForecastRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateForecastResponse) => void): Request<ForecastService.Types.CreateForecastResponse, AWSError>;
  /**
   * Creates a forecast for each item in the TARGET_TIME_SERIES dataset that was used to train the predictor. This is known as inference. To retrieve the forecast for a single item at low latency, use the operation. To export the complete forecast into your Amazon Simple Storage Service (Amazon S3) bucket, use the CreateForecastExportJob operation. The range of the forecast is determined by the ForecastHorizon value, which you specify in the CreatePredictor request. When you query a forecast, you can request a specific date range within the forecast. To get a list of all your forecasts, use the ListForecasts operation.  The forecasts generated by Amazon Forecast are in the same time zone as the dataset that was used to create the predictor.  For more information, see howitworks-forecast.  The Status of the forecast must be ACTIVE before you can query or export the forecast. Use the DescribeForecast operation to get the status. 
   */
  createForecast(callback?: (err: AWSError, data: ForecastService.Types.CreateForecastResponse) => void): Request<ForecastService.Types.CreateForecastResponse, AWSError>;
  /**
   * Exports a forecast created by the CreateForecast operation to your Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions: &lt;ForecastExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt; where the &lt;ExportTimestamp&gt; component is in Java SimpleDateFormat (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles. For more information, see howitworks-forecast. To get a list of all your forecast export jobs, use the ListForecastExportJobs operation.  The Status of the forecast export job must be ACTIVE before you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeForecastExportJob operation. 
   */
  createForecastExportJob(params: ForecastService.Types.CreateForecastExportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateForecastExportJobResponse) => void): Request<ForecastService.Types.CreateForecastExportJobResponse, AWSError>;
  /**
   * Exports a forecast created by the CreateForecast operation to your Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions: &lt;ForecastExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt; where the &lt;ExportTimestamp&gt; component is in Java SimpleDateFormat (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles. For more information, see howitworks-forecast. To get a list of all your forecast export jobs, use the ListForecastExportJobs operation.  The Status of the forecast export job must be ACTIVE before you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeForecastExportJob operation. 
   */
  createForecastExportJob(callback?: (err: AWSError, data: ForecastService.Types.CreateForecastExportJobResponse) => void): Request<ForecastService.Types.CreateForecastExportJobResponse, AWSError>;
  /**
   * Creates an Amazon Forecast predictor. In the request, provide a dataset group and either specify an algorithm or let Amazon Forecast choose an algorithm for you using AutoML. If you specify an algorithm, you also can override algorithm-specific hyperparameters. Amazon Forecast uses the algorithm to train a predictor using the latest version of the datasets in the specified dataset group. You can then generate a forecast using the CreateForecast operation.  To see the evaluation metrics, use the GetAccuracyMetrics operation.  You can specify a featurization configuration to fill and aggregate the data fields in the TARGET_TIME_SERIES dataset to improve model training. For more information, see FeaturizationConfig. For RELATED_TIME_SERIES datasets, CreatePredictor verifies that the DataFrequency specified when the dataset was created matches the ForecastFrequency. TARGET_TIME_SERIES datasets don't have this restriction. Amazon Forecast also verifies the delimiter and timestamp format. For more information, see howitworks-datasets-groups. By default, predictors are trained and evaluated at the 0.1 (P10), 0.5 (P50), and 0.9 (P90) quantiles. You can choose custom forecast types to train and evaluate your predictor by setting the ForecastTypes.   AutoML  If you want Amazon Forecast to evaluate each algorithm and choose the one that minimizes the objective function, set PerformAutoML to true. The objective function is defined as the mean of the weighted losses over the forecast types. By default, these are the p10, p50, and p90 quantile losses. For more information, see EvaluationResult. When AutoML is enabled, the following properties are disallowed:    AlgorithmArn     HPOConfig     PerformHPO     TrainingParameters    To get a list of all of your predictors, use the ListPredictors operation.  Before you can use the predictor to create a forecast, the Status of the predictor must be ACTIVE, signifying that training has completed. To get the status, use the DescribePredictor operation. 
   */
  createPredictor(params: ForecastService.Types.CreatePredictorRequest, callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorResponse) => void): Request<ForecastService.Types.CreatePredictorResponse, AWSError>;
  /**
   * Creates an Amazon Forecast predictor. In the request, provide a dataset group and either specify an algorithm or let Amazon Forecast choose an algorithm for you using AutoML. If you specify an algorithm, you also can override algorithm-specific hyperparameters. Amazon Forecast uses the algorithm to train a predictor using the latest version of the datasets in the specified dataset group. You can then generate a forecast using the CreateForecast operation.  To see the evaluation metrics, use the GetAccuracyMetrics operation.  You can specify a featurization configuration to fill and aggregate the data fields in the TARGET_TIME_SERIES dataset to improve model training. For more information, see FeaturizationConfig. For RELATED_TIME_SERIES datasets, CreatePredictor verifies that the DataFrequency specified when the dataset was created matches the ForecastFrequency. TARGET_TIME_SERIES datasets don't have this restriction. Amazon Forecast also verifies the delimiter and timestamp format. For more information, see howitworks-datasets-groups. By default, predictors are trained and evaluated at the 0.1 (P10), 0.5 (P50), and 0.9 (P90) quantiles. You can choose custom forecast types to train and evaluate your predictor by setting the ForecastTypes.   AutoML  If you want Amazon Forecast to evaluate each algorithm and choose the one that minimizes the objective function, set PerformAutoML to true. The objective function is defined as the mean of the weighted losses over the forecast types. By default, these are the p10, p50, and p90 quantile losses. For more information, see EvaluationResult. When AutoML is enabled, the following properties are disallowed:    AlgorithmArn     HPOConfig     PerformHPO     TrainingParameters    To get a list of all of your predictors, use the ListPredictors operation.  Before you can use the predictor to create a forecast, the Status of the predictor must be ACTIVE, signifying that training has completed. To get the status, use the DescribePredictor operation. 
   */
  createPredictor(callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorResponse) => void): Request<ForecastService.Types.CreatePredictorResponse, AWSError>;
  /**
   * Exports backtest forecasts and accuracy metrics generated by the CreatePredictor operation. Two folders containing CSV files are exported to your specified S3 bucket.  The export file names will match the following conventions:  &lt;ExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt;.csv  The &lt;ExportTimestamp&gt; component is in Java SimpleDate format (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Amazon S3 bucket and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles.  The Status of the export job must be ACTIVE before you can access the export in your Amazon S3 bucket. To get the status, use the DescribePredictorBacktestExportJob operation. 
   */
  createPredictorBacktestExportJob(params: ForecastService.Types.CreatePredictorBacktestExportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorBacktestExportJobResponse) => void): Request<ForecastService.Types.CreatePredictorBacktestExportJobResponse, AWSError>;
  /**
   * Exports backtest forecasts and accuracy metrics generated by the CreatePredictor operation. Two folders containing CSV files are exported to your specified S3 bucket.  The export file names will match the following conventions:  &lt;ExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt;.csv  The &lt;ExportTimestamp&gt; component is in Java SimpleDate format (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Amazon S3 bucket and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles.  The Status of the export job must be ACTIVE before you can access the export in your Amazon S3 bucket. To get the status, use the DescribePredictorBacktestExportJob operation. 
   */
  createPredictorBacktestExportJob(callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorBacktestExportJobResponse) => void): Request<ForecastService.Types.CreatePredictorBacktestExportJobResponse, AWSError>;
  /**
   * Deletes an Amazon Forecast dataset that was created using the CreateDataset operation. You can only delete datasets that have a status of ACTIVE or CREATE_FAILED. To get the status use the DescribeDataset operation.  Forecast does not automatically update any dataset groups that contain the deleted dataset. In order to update the dataset group, use the operation, omitting the deleted dataset's ARN. 
   */
  deleteDataset(params: ForecastService.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Forecast dataset that was created using the CreateDataset operation. You can only delete datasets that have a status of ACTIVE or CREATE_FAILED. To get the status use the DescribeDataset operation.  Forecast does not automatically update any dataset groups that contain the deleted dataset. In order to update the dataset group, use the operation, omitting the deleted dataset's ARN. 
   */
  deleteDataset(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset group created using the CreateDatasetGroup operation. You can only delete dataset groups that have a status of ACTIVE, CREATE_FAILED, or UPDATE_FAILED. To get the status, use the DescribeDatasetGroup operation. This operation deletes only the dataset group, not the datasets in the group.
   */
  deleteDatasetGroup(params: ForecastService.Types.DeleteDatasetGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset group created using the CreateDatasetGroup operation. You can only delete dataset groups that have a status of ACTIVE, CREATE_FAILED, or UPDATE_FAILED. To get the status, use the DescribeDatasetGroup operation. This operation deletes only the dataset group, not the datasets in the group.
   */
  deleteDatasetGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset import job created using the CreateDatasetImportJob operation. You can delete only dataset import jobs that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeDatasetImportJob operation.
   */
  deleteDatasetImportJob(params: ForecastService.Types.DeleteDatasetImportJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a dataset import job created using the CreateDatasetImportJob operation. You can delete only dataset import jobs that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeDatasetImportJob operation.
   */
  deleteDatasetImportJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a forecast created using the CreateForecast operation. You can delete only forecasts that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeForecast operation. You can't delete a forecast while it is being exported. After a forecast is deleted, you can no longer query the forecast.
   */
  deleteForecast(params: ForecastService.Types.DeleteForecastRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a forecast created using the CreateForecast operation. You can delete only forecasts that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeForecast operation. You can't delete a forecast while it is being exported. After a forecast is deleted, you can no longer query the forecast.
   */
  deleteForecast(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a forecast export job created using the CreateForecastExportJob operation. You can delete only export jobs that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeForecastExportJob operation.
   */
  deleteForecastExportJob(params: ForecastService.Types.DeleteForecastExportJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a forecast export job created using the CreateForecastExportJob operation. You can delete only export jobs that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeForecastExportJob operation.
   */
  deleteForecastExportJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a predictor created using the CreatePredictor operation. You can delete only predictor that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribePredictor operation.
   */
  deletePredictor(params: ForecastService.Types.DeletePredictorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a predictor created using the CreatePredictor operation. You can delete only predictor that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribePredictor operation.
   */
  deletePredictor(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a predictor backtest export job.
   */
  deletePredictorBacktestExportJob(params: ForecastService.Types.DeletePredictorBacktestExportJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a predictor backtest export job.
   */
  deletePredictorBacktestExportJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an entire resource tree. This operation will delete the parent resource and its child resources. Child resources are resources that were created from another resource. For example, when a forecast is generated from a predictor, the forecast is the child resource and the predictor is the parent resource. Amazon Forecast resources possess the following parent-child resource hierarchies:    Dataset: dataset import jobs    Dataset Group: predictors, predictor backtest export jobs, forecasts, forecast export jobs    Predictor: predictor backtest export jobs, forecasts, forecast export jobs    Forecast: forecast export jobs     DeleteResourceTree will only delete Amazon Forecast resources, and will not delete datasets or exported files stored in Amazon S3.  
   */
  deleteResourceTree(params: ForecastService.Types.DeleteResourceTreeRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an entire resource tree. This operation will delete the parent resource and its child resources. Child resources are resources that were created from another resource. For example, when a forecast is generated from a predictor, the forecast is the child resource and the predictor is the parent resource. Amazon Forecast resources possess the following parent-child resource hierarchies:    Dataset: dataset import jobs    Dataset Group: predictors, predictor backtest export jobs, forecasts, forecast export jobs    Predictor: predictor backtest export jobs, forecasts, forecast export jobs    Forecast: forecast export jobs     DeleteResourceTree will only delete Amazon Forecast resources, and will not delete datasets or exported files stored in Amazon S3.  
   */
  deleteResourceTree(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes an Amazon Forecast dataset created using the CreateDataset operation. In addition to listing the parameters specified in the CreateDataset request, this operation includes the following dataset properties:    CreationTime     LastModificationTime     Status   
   */
  describeDataset(params: ForecastService.Types.DescribeDatasetRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeDatasetResponse) => void): Request<ForecastService.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Describes an Amazon Forecast dataset created using the CreateDataset operation. In addition to listing the parameters specified in the CreateDataset request, this operation includes the following dataset properties:    CreationTime     LastModificationTime     Status   
   */
  describeDataset(callback?: (err: AWSError, data: ForecastService.Types.DescribeDatasetResponse) => void): Request<ForecastService.Types.DescribeDatasetResponse, AWSError>;
  /**
   * Describes a dataset group created using the CreateDatasetGroup operation. In addition to listing the parameters provided in the CreateDatasetGroup request, this operation includes the following properties:    DatasetArns - The datasets belonging to the group.    CreationTime     LastModificationTime     Status   
   */
  describeDatasetGroup(params: ForecastService.Types.DescribeDatasetGroupRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeDatasetGroupResponse) => void): Request<ForecastService.Types.DescribeDatasetGroupResponse, AWSError>;
  /**
   * Describes a dataset group created using the CreateDatasetGroup operation. In addition to listing the parameters provided in the CreateDatasetGroup request, this operation includes the following properties:    DatasetArns - The datasets belonging to the group.    CreationTime     LastModificationTime     Status   
   */
  describeDatasetGroup(callback?: (err: AWSError, data: ForecastService.Types.DescribeDatasetGroupResponse) => void): Request<ForecastService.Types.DescribeDatasetGroupResponse, AWSError>;
  /**
   * Describes a dataset import job created using the CreateDatasetImportJob operation. In addition to listing the parameters provided in the CreateDatasetImportJob request, this operation includes the following properties:    CreationTime     LastModificationTime     DataSize     FieldStatistics     Status     Message - If an error occurred, information about the error.  
   */
  describeDatasetImportJob(params: ForecastService.Types.DescribeDatasetImportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeDatasetImportJobResponse) => void): Request<ForecastService.Types.DescribeDatasetImportJobResponse, AWSError>;
  /**
   * Describes a dataset import job created using the CreateDatasetImportJob operation. In addition to listing the parameters provided in the CreateDatasetImportJob request, this operation includes the following properties:    CreationTime     LastModificationTime     DataSize     FieldStatistics     Status     Message - If an error occurred, information about the error.  
   */
  describeDatasetImportJob(callback?: (err: AWSError, data: ForecastService.Types.DescribeDatasetImportJobResponse) => void): Request<ForecastService.Types.DescribeDatasetImportJobResponse, AWSError>;
  /**
   * Describes a forecast created using the CreateForecast operation. In addition to listing the properties provided in the CreateForecast request, this operation lists the following properties:    DatasetGroupArn - The dataset group that provided the training data.    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describeForecast(params: ForecastService.Types.DescribeForecastRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeForecastResponse) => void): Request<ForecastService.Types.DescribeForecastResponse, AWSError>;
  /**
   * Describes a forecast created using the CreateForecast operation. In addition to listing the properties provided in the CreateForecast request, this operation lists the following properties:    DatasetGroupArn - The dataset group that provided the training data.    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describeForecast(callback?: (err: AWSError, data: ForecastService.Types.DescribeForecastResponse) => void): Request<ForecastService.Types.DescribeForecastResponse, AWSError>;
  /**
   * Describes a forecast export job created using the CreateForecastExportJob operation. In addition to listing the properties provided by the user in the CreateForecastExportJob request, this operation lists the following properties:    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describeForecastExportJob(params: ForecastService.Types.DescribeForecastExportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeForecastExportJobResponse) => void): Request<ForecastService.Types.DescribeForecastExportJobResponse, AWSError>;
  /**
   * Describes a forecast export job created using the CreateForecastExportJob operation. In addition to listing the properties provided by the user in the CreateForecastExportJob request, this operation lists the following properties:    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describeForecastExportJob(callback?: (err: AWSError, data: ForecastService.Types.DescribeForecastExportJobResponse) => void): Request<ForecastService.Types.DescribeForecastExportJobResponse, AWSError>;
  /**
   * Describes a predictor created using the CreatePredictor operation. In addition to listing the properties provided in the CreatePredictor request, this operation lists the following properties:    DatasetImportJobArns - The dataset import jobs used to import training data.    AutoMLAlgorithmArns - If AutoML is performed, the algorithms that were evaluated.    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describePredictor(params: ForecastService.Types.DescribePredictorRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribePredictorResponse) => void): Request<ForecastService.Types.DescribePredictorResponse, AWSError>;
  /**
   * Describes a predictor created using the CreatePredictor operation. In addition to listing the properties provided in the CreatePredictor request, this operation lists the following properties:    DatasetImportJobArns - The dataset import jobs used to import training data.    AutoMLAlgorithmArns - If AutoML is performed, the algorithms that were evaluated.    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describePredictor(callback?: (err: AWSError, data: ForecastService.Types.DescribePredictorResponse) => void): Request<ForecastService.Types.DescribePredictorResponse, AWSError>;
  /**
   * Describes a predictor backtest export job created using the CreatePredictorBacktestExportJob operation. In addition to listing the properties provided by the user in the CreatePredictorBacktestExportJob request, this operation lists the following properties:    CreationTime     LastModificationTime     Status     Message (if an error occurred)  
   */
  describePredictorBacktestExportJob(params: ForecastService.Types.DescribePredictorBacktestExportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribePredictorBacktestExportJobResponse) => void): Request<ForecastService.Types.DescribePredictorBacktestExportJobResponse, AWSError>;
  /**
   * Describes a predictor backtest export job created using the CreatePredictorBacktestExportJob operation. In addition to listing the properties provided by the user in the CreatePredictorBacktestExportJob request, this operation lists the following properties:    CreationTime     LastModificationTime     Status     Message (if an error occurred)  
   */
  describePredictorBacktestExportJob(callback?: (err: AWSError, data: ForecastService.Types.DescribePredictorBacktestExportJobResponse) => void): Request<ForecastService.Types.DescribePredictorBacktestExportJobResponse, AWSError>;
  /**
   * Provides metrics on the accuracy of the models that were trained by the CreatePredictor operation. Use metrics to see how well the model performed and to decide whether to use the predictor to generate a forecast. For more information, see Predictor Metrics. This operation generates metrics for each backtest window that was evaluated. The number of backtest windows (NumberOfBacktestWindows) is specified using the EvaluationParameters object, which is optionally included in the CreatePredictor request. If NumberOfBacktestWindows isn't specified, the number defaults to one. The parameters of the filling method determine which items contribute to the metrics. If you want all items to contribute, specify zero. If you want only those items that have complete data in the range being evaluated to contribute, specify nan. For more information, see FeaturizationMethod.  Before you can get accuracy metrics, the Status of the predictor must be ACTIVE, signifying that training has completed. To get the status, use the DescribePredictor operation. 
   */
  getAccuracyMetrics(params: ForecastService.Types.GetAccuracyMetricsRequest, callback?: (err: AWSError, data: ForecastService.Types.GetAccuracyMetricsResponse) => void): Request<ForecastService.Types.GetAccuracyMetricsResponse, AWSError>;
  /**
   * Provides metrics on the accuracy of the models that were trained by the CreatePredictor operation. Use metrics to see how well the model performed and to decide whether to use the predictor to generate a forecast. For more information, see Predictor Metrics. This operation generates metrics for each backtest window that was evaluated. The number of backtest windows (NumberOfBacktestWindows) is specified using the EvaluationParameters object, which is optionally included in the CreatePredictor request. If NumberOfBacktestWindows isn't specified, the number defaults to one. The parameters of the filling method determine which items contribute to the metrics. If you want all items to contribute, specify zero. If you want only those items that have complete data in the range being evaluated to contribute, specify nan. For more information, see FeaturizationMethod.  Before you can get accuracy metrics, the Status of the predictor must be ACTIVE, signifying that training has completed. To get the status, use the DescribePredictor operation. 
   */
  getAccuracyMetrics(callback?: (err: AWSError, data: ForecastService.Types.GetAccuracyMetricsResponse) => void): Request<ForecastService.Types.GetAccuracyMetricsResponse, AWSError>;
  /**
   * Returns a list of dataset groups created using the CreateDatasetGroup operation. For each dataset group, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the dataset group ARN with the DescribeDatasetGroup operation.
   */
  listDatasetGroups(params: ForecastService.Types.ListDatasetGroupsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListDatasetGroupsResponse) => void): Request<ForecastService.Types.ListDatasetGroupsResponse, AWSError>;
  /**
   * Returns a list of dataset groups created using the CreateDatasetGroup operation. For each dataset group, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the dataset group ARN with the DescribeDatasetGroup operation.
   */
  listDatasetGroups(callback?: (err: AWSError, data: ForecastService.Types.ListDatasetGroupsResponse) => void): Request<ForecastService.Types.ListDatasetGroupsResponse, AWSError>;
  /**
   * Returns a list of dataset import jobs created using the CreateDatasetImportJob operation. For each import job, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the ARN with the DescribeDatasetImportJob operation. You can filter the list by providing an array of Filter objects.
   */
  listDatasetImportJobs(params: ForecastService.Types.ListDatasetImportJobsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListDatasetImportJobsResponse) => void): Request<ForecastService.Types.ListDatasetImportJobsResponse, AWSError>;
  /**
   * Returns a list of dataset import jobs created using the CreateDatasetImportJob operation. For each import job, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the ARN with the DescribeDatasetImportJob operation. You can filter the list by providing an array of Filter objects.
   */
  listDatasetImportJobs(callback?: (err: AWSError, data: ForecastService.Types.ListDatasetImportJobsResponse) => void): Request<ForecastService.Types.ListDatasetImportJobsResponse, AWSError>;
  /**
   * Returns a list of datasets created using the CreateDataset operation. For each dataset, a summary of its properties, including its Amazon Resource Name (ARN), is returned. To retrieve the complete set of properties, use the ARN with the DescribeDataset operation.
   */
  listDatasets(params: ForecastService.Types.ListDatasetsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListDatasetsResponse) => void): Request<ForecastService.Types.ListDatasetsResponse, AWSError>;
  /**
   * Returns a list of datasets created using the CreateDataset operation. For each dataset, a summary of its properties, including its Amazon Resource Name (ARN), is returned. To retrieve the complete set of properties, use the ARN with the DescribeDataset operation.
   */
  listDatasets(callback?: (err: AWSError, data: ForecastService.Types.ListDatasetsResponse) => void): Request<ForecastService.Types.ListDatasetsResponse, AWSError>;
  /**
   * Returns a list of forecast export jobs created using the CreateForecastExportJob operation. For each forecast export job, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). To retrieve the complete set of properties, use the ARN with the DescribeForecastExportJob operation. You can filter the list using an array of Filter objects.
   */
  listForecastExportJobs(params: ForecastService.Types.ListForecastExportJobsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListForecastExportJobsResponse) => void): Request<ForecastService.Types.ListForecastExportJobsResponse, AWSError>;
  /**
   * Returns a list of forecast export jobs created using the CreateForecastExportJob operation. For each forecast export job, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). To retrieve the complete set of properties, use the ARN with the DescribeForecastExportJob operation. You can filter the list using an array of Filter objects.
   */
  listForecastExportJobs(callback?: (err: AWSError, data: ForecastService.Types.ListForecastExportJobsResponse) => void): Request<ForecastService.Types.ListForecastExportJobsResponse, AWSError>;
  /**
   * Returns a list of forecasts created using the CreateForecast operation. For each forecast, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). To retrieve the complete set of properties, specify the ARN with the DescribeForecast operation. You can filter the list using an array of Filter objects.
   */
  listForecasts(params: ForecastService.Types.ListForecastsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListForecastsResponse) => void): Request<ForecastService.Types.ListForecastsResponse, AWSError>;
  /**
   * Returns a list of forecasts created using the CreateForecast operation. For each forecast, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). To retrieve the complete set of properties, specify the ARN with the DescribeForecast operation. You can filter the list using an array of Filter objects.
   */
  listForecasts(callback?: (err: AWSError, data: ForecastService.Types.ListForecastsResponse) => void): Request<ForecastService.Types.ListForecastsResponse, AWSError>;
  /**
   * Returns a list of predictor backtest export jobs created using the CreatePredictorBacktestExportJob operation. This operation returns a summary for each backtest export job. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular backtest export job, use the ARN with the DescribePredictorBacktestExportJob operation.
   */
  listPredictorBacktestExportJobs(params: ForecastService.Types.ListPredictorBacktestExportJobsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListPredictorBacktestExportJobsResponse) => void): Request<ForecastService.Types.ListPredictorBacktestExportJobsResponse, AWSError>;
  /**
   * Returns a list of predictor backtest export jobs created using the CreatePredictorBacktestExportJob operation. This operation returns a summary for each backtest export job. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular backtest export job, use the ARN with the DescribePredictorBacktestExportJob operation.
   */
  listPredictorBacktestExportJobs(callback?: (err: AWSError, data: ForecastService.Types.ListPredictorBacktestExportJobsResponse) => void): Request<ForecastService.Types.ListPredictorBacktestExportJobsResponse, AWSError>;
  /**
   * Returns a list of predictors created using the CreatePredictor operation. For each predictor, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the ARN with the DescribePredictor operation. You can filter the list using an array of Filter objects.
   */
  listPredictors(params: ForecastService.Types.ListPredictorsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListPredictorsResponse) => void): Request<ForecastService.Types.ListPredictorsResponse, AWSError>;
  /**
   * Returns a list of predictors created using the CreatePredictor operation. For each predictor, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the ARN with the DescribePredictor operation. You can filter the list using an array of Filter objects.
   */
  listPredictors(callback?: (err: AWSError, data: ForecastService.Types.ListPredictorsResponse) => void): Request<ForecastService.Types.ListPredictorsResponse, AWSError>;
  /**
   * Lists the tags for an Amazon Forecast resource.
   */
  listTagsForResource(params: ForecastService.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ForecastService.Types.ListTagsForResourceResponse) => void): Request<ForecastService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for an Amazon Forecast resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ForecastService.Types.ListTagsForResourceResponse) => void): Request<ForecastService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Stops a resource. The resource undergoes the following states: CREATE_STOPPING and CREATE_STOPPED. You cannot resume a resource once it has been stopped. This operation can be applied to the following resources (and their corresponding child resources):   Dataset Import Job   Predictor Job   Forecast Job   Forecast Export Job   Predictor Backtest Export Job  
   */
  stopResource(params: ForecastService.Types.StopResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a resource. The resource undergoes the following states: CREATE_STOPPING and CREATE_STOPPED. You cannot resume a resource once it has been stopped. This operation can be applied to the following resources (and their corresponding child resources):   Dataset Import Job   Predictor Job   Forecast Job   Forecast Export Job   Predictor Backtest Export Job  
   */
  stopResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are also deleted.
   */
  tagResource(params: ForecastService.Types.TagResourceRequest, callback?: (err: AWSError, data: ForecastService.Types.TagResourceResponse) => void): Request<ForecastService.Types.TagResourceResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are also deleted.
   */
  tagResource(callback?: (err: AWSError, data: ForecastService.Types.TagResourceResponse) => void): Request<ForecastService.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes the specified tags from a resource.
   */
  untagResource(params: ForecastService.Types.UntagResourceRequest, callback?: (err: AWSError, data: ForecastService.Types.UntagResourceResponse) => void): Request<ForecastService.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes the specified tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: ForecastService.Types.UntagResourceResponse) => void): Request<ForecastService.Types.UntagResourceResponse, AWSError>;
  /**
   * Replaces the datasets in a dataset group with the specified datasets.  The Status of the dataset group must be ACTIVE before you can use the dataset group to create a predictor. Use the DescribeDatasetGroup operation to get the status. 
   */
  updateDatasetGroup(params: ForecastService.Types.UpdateDatasetGroupRequest, callback?: (err: AWSError, data: ForecastService.Types.UpdateDatasetGroupResponse) => void): Request<ForecastService.Types.UpdateDatasetGroupResponse, AWSError>;
  /**
   * Replaces the datasets in a dataset group with the specified datasets.  The Status of the dataset group must be ACTIVE before you can use the dataset group to create a predictor. Use the DescribeDatasetGroup operation to get the status. 
   */
  updateDatasetGroup(callback?: (err: AWSError, data: ForecastService.Types.UpdateDatasetGroupResponse) => void): Request<ForecastService.Types.UpdateDatasetGroupResponse, AWSError>;
}
declare namespace ForecastService {
  export type Arn = string;
  export type ArnList = Arn[];
  export type AttributeType = "string"|"integer"|"float"|"timestamp"|"geolocation"|string;
  export type AutoMLOverrideStrategy = "LatencyOptimized"|string;
  export type Boolean = boolean;
  export interface CategoricalParameterRange {
    /**
     * The name of the categorical hyperparameter to tune.
     */
    Name: Name;
    /**
     * A list of the tunable categories for the hyperparameter.
     */
    Values: Values;
  }
  export type CategoricalParameterRanges = CategoricalParameterRange[];
  export interface ContinuousParameterRange {
    /**
     * The name of the hyperparameter to tune.
     */
    Name: Name;
    /**
     * The maximum tunable value of the hyperparameter.
     */
    MaxValue: Double;
    /**
     * The minimum tunable value of the hyperparameter.
     */
    MinValue: Double;
    /**
     * The scale that hyperparameter tuning uses to search the hyperparameter range. Valid values:  Auto  Amazon Forecast hyperparameter tuning chooses the best scale for the hyperparameter.  Linear  Hyperparameter tuning searches the values in the hyperparameter range by using a linear scale.  Logarithmic  Hyperparameter tuning searches the values in the hyperparameter range by using a logarithmic scale. Logarithmic scaling works only for ranges that have values greater than 0.  ReverseLogarithmic  hyperparameter tuning searches the values in the hyperparameter range by using a reverse logarithmic scale. Reverse logarithmic scaling works only for ranges that are entirely within the range 0 &lt;= x &lt; 1.0.   For information about choosing a hyperparameter scale, see Hyperparameter Scaling. One of the following values:
     */
    ScalingType?: ScalingType;
  }
  export type ContinuousParameterRanges = ContinuousParameterRange[];
  export interface CreateDatasetGroupRequest {
    /**
     * A name for the dataset group.
     */
    DatasetGroupName: Name;
    /**
     * The domain associated with the dataset group. When you add a dataset to a dataset group, this value and the value specified for the Domain parameter of the CreateDataset operation must match. The Domain and DatasetType that you choose determine the fields that must be present in training data that you import to a dataset. For example, if you choose the RETAIL domain and TARGET_TIME_SERIES as the DatasetType, Amazon Forecast requires that item_id, timestamp, and demand fields are present in your data. For more information, see howitworks-datasets-groups.
     */
    Domain: Domain;
    /**
     * An array of Amazon Resource Names (ARNs) of the datasets that you want to include in the dataset group.
     */
    DatasetArns?: ArnList;
    /**
     * The optional metadata that you apply to the dataset group to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
  }
  export interface CreateDatasetGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    DatasetGroupArn?: Arn;
  }
  export interface CreateDatasetImportJobRequest {
    /**
     * The name for the dataset import job. We recommend including the current timestamp in the name, for example, 20190721DatasetImport. This can help you avoid getting a ResourceAlreadyExistsException exception.
     */
    DatasetImportJobName: Name;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Forecast dataset that you want to import data to.
     */
    DatasetArn: Arn;
    /**
     * The location of the training data to import and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data. The training data must be stored in an Amazon S3 bucket. If encryption is used, DataSource must include an AWS Key Management Service (KMS) key and the IAM role must allow Amazon Forecast permission to access the key. The KMS key and IAM role must match those specified in the EncryptionConfig parameter of the CreateDataset operation.
     */
    DataSource: DataSource;
    /**
     * The format of timestamps in the dataset. The format that you specify depends on the DataFrequency specified when the dataset was created. The following formats are supported   "yyyy-MM-dd" For the following data frequencies: Y, M, W, and D   "yyyy-MM-dd HH:mm:ss" For the following data frequencies: H, 30min, 15min, and 1min; and optionally, for: Y, M, W, and D   If the format isn't specified, Amazon Forecast expects the format to be "yyyy-MM-dd HH:mm:ss".
     */
    TimestampFormat?: TimestampFormat;
    /**
     * A single time zone for every item in your dataset. This option is ideal for datasets with all timestamps within a single time zone, or if all timestamps are normalized to a single time zone.  Refer to the Joda-Time API for a complete list of valid time zone names.
     */
    TimeZone?: TimeZone;
    /**
     * Automatically derive time zone information from the geolocation attribute. This option is ideal for datasets that contain timestamps in multiple time zones and those timestamps are expressed in local time.
     */
    UseGeolocationForTimeZone?: UseGeolocationForTimeZone;
    /**
     * The format of the geolocation attribute. The geolocation attribute can be formatted in one of two ways:    LAT_LONG - the latitude and longitude in decimal format (Example: 47.61_-122.33).    CC_POSTALCODE (US Only) - the country code (US), followed by the 5-digit ZIP code (Example: US_98121).  
     */
    GeolocationFormat?: GeolocationFormat;
    /**
     * The optional metadata that you apply to the dataset import job to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
  }
  export interface CreateDatasetImportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job.
     */
    DatasetImportJobArn?: Arn;
  }
  export interface CreateDatasetRequest {
    /**
     * A name for the dataset.
     */
    DatasetName: Name;
    /**
     * The domain associated with the dataset. When you add a dataset to a dataset group, this value and the value specified for the Domain parameter of the CreateDatasetGroup operation must match. The Domain and DatasetType that you choose determine the fields that must be present in the training data that you import to the dataset. For example, if you choose the RETAIL domain and TARGET_TIME_SERIES as the DatasetType, Amazon Forecast requires item_id, timestamp, and demand fields to be present in your data. For more information, see howitworks-datasets-groups.
     */
    Domain: Domain;
    /**
     * The dataset type. Valid values depend on the chosen Domain.
     */
    DatasetType: DatasetType;
    /**
     * The frequency of data collection. This parameter is required for RELATED_TIME_SERIES datasets. Valid intervals are Y (Year), M (Month), W (Week), D (Day), H (Hour), 30min (30 minutes), 15min (15 minutes), 10min (10 minutes), 5min (5 minutes), and 1min (1 minute). For example, "D" indicates every day and "15min" indicates every 15 minutes.
     */
    DataFrequency?: Frequency;
    /**
     * The schema for the dataset. The schema attributes and their order must match the fields in your data. The dataset Domain and DatasetType that you choose determine the minimum required fields in your training data. For information about the required fields for a specific dataset domain and type, see howitworks-domains-ds-types.
     */
    Schema: Schema;
    /**
     * An AWS Key Management Service (KMS) key and the AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     */
    EncryptionConfig?: EncryptionConfig;
    /**
     * The optional metadata that you apply to the dataset to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
  }
  export interface CreateDatasetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DatasetArn?: Arn;
  }
  export interface CreateForecastExportJobRequest {
    /**
     * The name for the forecast export job.
     */
    ForecastExportJobName: Name;
    /**
     * The Amazon Resource Name (ARN) of the forecast that you want to export.
     */
    ForecastArn: Arn;
    /**
     * The location where you want to save the forecast and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the location. The forecast must be exported to an Amazon S3 bucket. If encryption is used, Destination must include an AWS Key Management Service (KMS) key. The IAM role must allow Amazon Forecast permission to access the key.
     */
    Destination: DataDestination;
    /**
     * The optional metadata that you apply to the forecast export job to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
  }
  export interface CreateForecastExportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the export job.
     */
    ForecastExportJobArn?: Arn;
  }
  export interface CreateForecastRequest {
    /**
     * A name for the forecast.
     */
    ForecastName: Name;
    /**
     * The Amazon Resource Name (ARN) of the predictor to use to generate the forecast.
     */
    PredictorArn: Arn;
    /**
     * The quantiles at which probabilistic forecasts are generated. You can currently specify up to 5 quantiles per forecast. Accepted values include 0.01 to 0.99 (increments of .01 only) and mean. The mean forecast is different from the median (0.50) when the distribution is not symmetric (for example, Beta and Negative Binomial). The default value is ["0.1", "0.5", "0.9"].
     */
    ForecastTypes?: ForecastTypes;
    /**
     * The optional metadata that you apply to the forecast to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
  }
  export interface CreateForecastResponse {
    /**
     * The Amazon Resource Name (ARN) of the forecast.
     */
    ForecastArn?: Arn;
  }
  export interface CreatePredictorBacktestExportJobRequest {
    /**
     * The name for the backtest export job.
     */
    PredictorBacktestExportJobName: Name;
    /**
     * The Amazon Resource Name (ARN) of the predictor that you want to export.
     */
    PredictorArn: Arn;
    Destination: DataDestination;
    /**
     * Optional metadata to help you categorize and organize your backtests. Each tag consists of a key and an optional value, both of which you define. Tag keys and values are case sensitive. The following restrictions apply to tags:   For each resource, each tag key must be unique and each tag key must have one value.   Maximum number of tags per resource: 50.   Maximum key length: 128 Unicode characters in UTF-8.   Maximum value length: 256 Unicode characters in UTF-8.   Accepted characters: all letters and numbers, spaces representable in UTF-8, and + - = . _ : / @. If your tagging schema is used across other services and resources, the character restrictions of those services also apply.    Key prefixes cannot include any upper or lowercase combination of aws: or AWS:. Values can have this prefix. If a tag value has aws as its prefix but the key does not, Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit. You cannot edit or delete tag keys with this prefix.  
     */
    Tags?: Tags;
  }
  export interface CreatePredictorBacktestExportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the predictor backtest export job that you want to export.
     */
    PredictorBacktestExportJobArn?: Arn;
  }
  export interface CreatePredictorRequest {
    /**
     * A name for the predictor.
     */
    PredictorName: Name;
    /**
     * The Amazon Resource Name (ARN) of the algorithm to use for model training. Required if PerformAutoML is not set to true.  Supported algorithms:     arn:aws:forecast:::algorithm/ARIMA     arn:aws:forecast:::algorithm/CNN-QR     arn:aws:forecast:::algorithm/Deep_AR_Plus     arn:aws:forecast:::algorithm/ETS     arn:aws:forecast:::algorithm/NPTS     arn:aws:forecast:::algorithm/Prophet   
     */
    AlgorithmArn?: Arn;
    /**
     * Specifies the number of time-steps that the model is trained to predict. The forecast horizon is also called the prediction length. For example, if you configure a dataset for daily data collection (using the DataFrequency parameter of the CreateDataset operation) and set the forecast horizon to 10, the model returns predictions for 10 days. The maximum forecast horizon is the lesser of 500 time-steps or 1/3 of the TARGET_TIME_SERIES dataset length.
     */
    ForecastHorizon: Integer;
    /**
     * Specifies the forecast types used to train a predictor. You can specify up to five forecast types. Forecast types can be quantiles from 0.01 to 0.99, by increments of 0.01 or higher. You can also specify the mean forecast with mean.  The default value is ["0.10", "0.50", "0.9"].
     */
    ForecastTypes?: ForecastTypes;
    /**
     * Whether to perform AutoML. When Amazon Forecast performs AutoML, it evaluates the algorithms it provides and chooses the best algorithm and configuration for your training dataset. The default value is false. In this case, you are required to specify an algorithm. Set PerformAutoML to true to have Amazon Forecast perform AutoML. This is a good option if you aren't sure which algorithm is suitable for your training data. In this case, PerformHPO must be false.
     */
    PerformAutoML?: Boolean;
    /**
     *   The LatencyOptimized AutoML override strategy is only available in private beta. Contact AWS Support or your account manager to learn more about access privileges.   Used to overide the default AutoML strategy, which is to optimize predictor accuracy. To apply an AutoML strategy that minimizes training time, use LatencyOptimized. This parameter is only valid for predictors trained using AutoML.
     */
    AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
    /**
     * Whether to perform hyperparameter optimization (HPO). HPO finds optimal hyperparameter values for your training data. The process of performing HPO is known as running a hyperparameter tuning job. The default value is false. In this case, Amazon Forecast uses default hyperparameter values from the chosen algorithm. To override the default values, set PerformHPO to true and, optionally, supply the HyperParameterTuningJobConfig object. The tuning job specifies a metric to optimize, which hyperparameters participate in tuning, and the valid range for each tunable hyperparameter. In this case, you are required to specify an algorithm and PerformAutoML must be false. The following algorithms support HPO:   DeepAR+   CNN-QR  
     */
    PerformHPO?: Boolean;
    /**
     * The hyperparameters to override for model training. The hyperparameters that you can override are listed in the individual algorithms. For the list of supported algorithms, see aws-forecast-choosing-recipes.
     */
    TrainingParameters?: TrainingParameters;
    /**
     * Used to override the default evaluation parameters of the specified algorithm. Amazon Forecast evaluates a predictor by splitting a dataset into training data and testing data. The evaluation parameters define how to perform the split and the number of iterations.
     */
    EvaluationParameters?: EvaluationParameters;
    /**
     * Provides hyperparameter override values for the algorithm. If you don't provide this parameter, Amazon Forecast uses default values. The individual algorithms specify which hyperparameters support hyperparameter optimization (HPO). For more information, see aws-forecast-choosing-recipes. If you included the HPOConfig object, you must set PerformHPO to true.
     */
    HPOConfig?: HyperParameterTuningJobConfig;
    /**
     * Describes the dataset group that contains the data to use to train the predictor.
     */
    InputDataConfig: InputDataConfig;
    /**
     * The featurization configuration.
     */
    FeaturizationConfig: FeaturizationConfig;
    /**
     * An AWS Key Management Service (KMS) key and the AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     */
    EncryptionConfig?: EncryptionConfig;
    /**
     * The optional metadata that you apply to the predictor to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
    /**
     * The accuracy metric used to optimize the predictor.
     */
    OptimizationMetric?: OptimizationMetric;
  }
  export interface CreatePredictorResponse {
    /**
     * The Amazon Resource Name (ARN) of the predictor.
     */
    PredictorArn?: Arn;
  }
  export interface DataDestination {
    /**
     * The path to an Amazon Simple Storage Service (Amazon S3) bucket along with the credentials to access the bucket.
     */
    S3Config: S3Config;
  }
  export interface DataSource {
    /**
     * The path to the training data stored in an Amazon Simple Storage Service (Amazon S3) bucket along with the credentials to access the data.
     */
    S3Config: S3Config;
  }
  export interface DatasetGroupSummary {
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    DatasetGroupArn?: Arn;
    /**
     * The name of the dataset group.
     */
    DatasetGroupName?: Name;
    /**
     * When the dataset group was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the dataset group was created or last updated from a call to the UpdateDatasetGroup operation. While the dataset group is being updated, LastModificationTime is the current time of the ListDatasetGroups call.
     */
    LastModificationTime?: Timestamp;
  }
  export type DatasetGroups = DatasetGroupSummary[];
  export interface DatasetImportJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job.
     */
    DatasetImportJobArn?: Arn;
    /**
     * The name of the dataset import job.
     */
    DatasetImportJobName?: Name;
    /**
     * The location of the training data to import and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data. The training data must be stored in an Amazon S3 bucket. If encryption is used, DataSource includes an AWS Key Management Service (KMS) key.
     */
    DataSource?: DataSource;
    /**
     * The status of the dataset import job. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     CREATE_STOPPING, CREATE_STOPPED   
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the dataset import job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type DatasetImportJobs = DatasetImportJobSummary[];
  export interface DatasetSummary {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DatasetArn?: Arn;
    /**
     * The name of the dataset.
     */
    DatasetName?: Name;
    /**
     * The dataset type.
     */
    DatasetType?: DatasetType;
    /**
     * The domain associated with the dataset.
     */
    Domain?: Domain;
    /**
     * When the dataset was created.
     */
    CreationTime?: Timestamp;
    /**
     * When you create a dataset, LastModificationTime is the same as CreationTime. While data is being imported to the dataset, LastModificationTime is the current time of the ListDatasets call. After a CreateDatasetImportJob operation has finished, LastModificationTime is when the import job completed or failed.
     */
    LastModificationTime?: Timestamp;
  }
  export type DatasetType = "TARGET_TIME_SERIES"|"RELATED_TIME_SERIES"|"ITEM_METADATA"|string;
  export type Datasets = DatasetSummary[];
  export interface DeleteDatasetGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset group to delete.
     */
    DatasetGroupArn: Arn;
  }
  export interface DeleteDatasetImportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job to delete.
     */
    DatasetImportJobArn: Arn;
  }
  export interface DeleteDatasetRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset to delete.
     */
    DatasetArn: Arn;
  }
  export interface DeleteForecastExportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the forecast export job to delete.
     */
    ForecastExportJobArn: Arn;
  }
  export interface DeleteForecastRequest {
    /**
     * The Amazon Resource Name (ARN) of the forecast to delete.
     */
    ForecastArn: Arn;
  }
  export interface DeletePredictorBacktestExportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the predictor backtest export job to delete.
     */
    PredictorBacktestExportJobArn: Arn;
  }
  export interface DeletePredictorRequest {
    /**
     * The Amazon Resource Name (ARN) of the predictor to delete.
     */
    PredictorArn: Arn;
  }
  export interface DeleteResourceTreeRequest {
    /**
     * The Amazon Resource Name (ARN) of the parent resource to delete. All child resources of the parent resource will also be deleted.
     */
    ResourceArn: Arn;
  }
  export interface DescribeDatasetGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    DatasetGroupArn: Arn;
  }
  export interface DescribeDatasetGroupResponse {
    /**
     * The name of the dataset group.
     */
    DatasetGroupName?: Name;
    /**
     * The ARN of the dataset group.
     */
    DatasetGroupArn?: Arn;
    /**
     * An array of Amazon Resource Names (ARNs) of the datasets contained in the dataset group.
     */
    DatasetArns?: ArnList;
    /**
     * The domain associated with the dataset group.
     */
    Domain?: Domain;
    /**
     * The status of the dataset group. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     UPDATE_PENDING, UPDATE_IN_PROGRESS, UPDATE_FAILED    The UPDATE states apply when you call the UpdateDatasetGroup operation.  The Status of the dataset group must be ACTIVE before you can use the dataset group to create a predictor. 
     */
    Status?: Status;
    /**
     * When the dataset group was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the dataset group was created or last updated from a call to the UpdateDatasetGroup operation. While the dataset group is being updated, LastModificationTime is the current time of the DescribeDatasetGroup call.
     */
    LastModificationTime?: Timestamp;
  }
  export interface DescribeDatasetImportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job.
     */
    DatasetImportJobArn: Arn;
  }
  export interface DescribeDatasetImportJobResponse {
    /**
     * The name of the dataset import job.
     */
    DatasetImportJobName?: Name;
    /**
     * The ARN of the dataset import job.
     */
    DatasetImportJobArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the dataset that the training data was imported to.
     */
    DatasetArn?: Arn;
    /**
     * The format of timestamps in the dataset. The format that you specify depends on the DataFrequency specified when the dataset was created. The following formats are supported   "yyyy-MM-dd" For the following data frequencies: Y, M, W, and D   "yyyy-MM-dd HH:mm:ss" For the following data frequencies: H, 30min, 15min, and 1min; and optionally, for: Y, M, W, and D  
     */
    TimestampFormat?: TimestampFormat;
    /**
     * The single time zone applied to every item in the dataset
     */
    TimeZone?: TimeZone;
    /**
     * Whether TimeZone is automatically derived from the geolocation attribute.
     */
    UseGeolocationForTimeZone?: UseGeolocationForTimeZone;
    /**
     * The format of the geolocation attribute. Valid Values:"LAT_LONG" and "CC_POSTALCODE".
     */
    GeolocationFormat?: GeolocationFormat;
    /**
     * The location of the training data to import and an AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data. If encryption is used, DataSource includes an AWS Key Management Service (KMS) key.
     */
    DataSource?: DataSource;
    /**
     * The estimated time remaining in minutes for the dataset import job to complete.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * Statistical information about each field in the input data.
     */
    FieldStatistics?: FieldStatistics;
    /**
     * The size of the dataset in gigabytes (GB) after the import job has finished.
     */
    DataSize?: Double;
    /**
     * The status of the dataset import job. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     CREATE_STOPPING, CREATE_STOPPED   
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: Message;
    /**
     * When the dataset import job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export interface DescribeDatasetRequest {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DatasetArn: Arn;
  }
  export interface DescribeDatasetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DatasetArn?: Arn;
    /**
     * The name of the dataset.
     */
    DatasetName?: Name;
    /**
     * The domain associated with the dataset.
     */
    Domain?: Domain;
    /**
     * The dataset type.
     */
    DatasetType?: DatasetType;
    /**
     * The frequency of data collection. Valid intervals are Y (Year), M (Month), W (Week), D (Day), H (Hour), 30min (30 minutes), 15min (15 minutes), 10min (10 minutes), 5min (5 minutes), and 1min (1 minute). For example, "M" indicates every month and "30min" indicates every 30 minutes.
     */
    DataFrequency?: Frequency;
    /**
     * An array of SchemaAttribute objects that specify the dataset fields. Each SchemaAttribute specifies the name and data type of a field.
     */
    Schema?: Schema;
    /**
     * The AWS Key Management Service (KMS) key and the AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     */
    EncryptionConfig?: EncryptionConfig;
    /**
     * The status of the dataset. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     UPDATE_PENDING, UPDATE_IN_PROGRESS, UPDATE_FAILED    The UPDATE states apply while data is imported to the dataset from a call to the CreateDatasetImportJob operation and reflect the status of the dataset import job. For example, when the import job status is CREATE_IN_PROGRESS, the status of the dataset is UPDATE_IN_PROGRESS.  The Status of the dataset must be ACTIVE before you can import training data. 
     */
    Status?: Status;
    /**
     * When the dataset was created.
     */
    CreationTime?: Timestamp;
    /**
     * When you create a dataset, LastModificationTime is the same as CreationTime. While data is being imported to the dataset, LastModificationTime is the current time of the DescribeDataset call. After a CreateDatasetImportJob operation has finished, LastModificationTime is when the import job completed or failed.
     */
    LastModificationTime?: Timestamp;
  }
  export interface DescribeForecastExportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the forecast export job.
     */
    ForecastExportJobArn: Arn;
  }
  export interface DescribeForecastExportJobResponse {
    /**
     * The ARN of the forecast export job.
     */
    ForecastExportJobArn?: Arn;
    /**
     * The name of the forecast export job.
     */
    ForecastExportJobName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the exported forecast.
     */
    ForecastArn?: Arn;
    /**
     * The path to the Amazon Simple Storage Service (Amazon S3) bucket where the forecast is exported.
     */
    Destination?: DataDestination;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: Message;
    /**
     * The status of the forecast export job. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the forecast export job must be ACTIVE before you can access the forecast in your S3 bucket. 
     */
    Status?: Status;
    /**
     * When the forecast export job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export interface DescribeForecastRequest {
    /**
     * The Amazon Resource Name (ARN) of the forecast.
     */
    ForecastArn: Arn;
  }
  export interface DescribeForecastResponse {
    /**
     * The forecast ARN as specified in the request.
     */
    ForecastArn?: Arn;
    /**
     * The name of the forecast.
     */
    ForecastName?: Name;
    /**
     * The quantiles at which probabilistic forecasts were generated.
     */
    ForecastTypes?: ForecastTypes;
    /**
     * The ARN of the predictor used to generate the forecast.
     */
    PredictorArn?: Arn;
    /**
     * The ARN of the dataset group that provided the data used to train the predictor.
     */
    DatasetGroupArn?: Arn;
    /**
     * The estimated time remaining in minutes for the forecast job to complete.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * The status of the forecast. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the forecast must be ACTIVE before you can query or export the forecast. 
     */
    Status?: String;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the forecast creation task was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export interface DescribePredictorBacktestExportJobRequest {
    /**
     * The Amazon Resource Name (ARN) of the predictor backtest export job.
     */
    PredictorBacktestExportJobArn: Arn;
  }
  export interface DescribePredictorBacktestExportJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the predictor backtest export job.
     */
    PredictorBacktestExportJobArn?: Arn;
    /**
     * The name of the predictor backtest export job.
     */
    PredictorBacktestExportJobName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the predictor.
     */
    PredictorArn?: Arn;
    Destination?: DataDestination;
    /**
     * Information about any errors that may have occurred during the backtest export.
     */
    Message?: Message;
    /**
     * The status of the predictor backtest export job. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * When the predictor backtest export job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export interface DescribePredictorRequest {
    /**
     * The Amazon Resource Name (ARN) of the predictor that you want information about.
     */
    PredictorArn: Arn;
  }
  export interface DescribePredictorResponse {
    /**
     * The ARN of the predictor.
     */
    PredictorArn?: Name;
    /**
     * The name of the predictor.
     */
    PredictorName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the algorithm used for model training.
     */
    AlgorithmArn?: Arn;
    /**
     * The number of time-steps of the forecast. The forecast horizon is also called the prediction length.
     */
    ForecastHorizon?: Integer;
    /**
     * The forecast types used during predictor training. Default value is ["0.1","0.5","0.9"] 
     */
    ForecastTypes?: ForecastTypes;
    /**
     * Whether the predictor is set to perform AutoML.
     */
    PerformAutoML?: Boolean;
    /**
     *   The LatencyOptimized AutoML override strategy is only available in private beta. Contact AWS Support or your account manager to learn more about access privileges.   The AutoML strategy used to train the predictor. Unless LatencyOptimized is specified, the AutoML strategy optimizes predictor accuracy. This parameter is only valid for predictors trained using AutoML.
     */
    AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
    /**
     * Whether the predictor is set to perform hyperparameter optimization (HPO).
     */
    PerformHPO?: Boolean;
    /**
     * The default training parameters or overrides selected during model training. When running AutoML or choosing HPO with CNN-QR or DeepAR+, the optimized values for the chosen hyperparameters are returned. For more information, see aws-forecast-choosing-recipes.
     */
    TrainingParameters?: TrainingParameters;
    /**
     * Used to override the default evaluation parameters of the specified algorithm. Amazon Forecast evaluates a predictor by splitting a dataset into training data and testing data. The evaluation parameters define how to perform the split and the number of iterations.
     */
    EvaluationParameters?: EvaluationParameters;
    /**
     * The hyperparameter override values for the algorithm.
     */
    HPOConfig?: HyperParameterTuningJobConfig;
    /**
     * Describes the dataset group that contains the data to use to train the predictor.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The featurization configuration.
     */
    FeaturizationConfig?: FeaturizationConfig;
    /**
     * An AWS Key Management Service (KMS) key and the AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     */
    EncryptionConfig?: EncryptionConfig;
    /**
     * Details on the the status and results of the backtests performed to evaluate the accuracy of the predictor. You specify the number of backtests to perform when you call the operation.
     */
    PredictorExecutionDetails?: PredictorExecutionDetails;
    /**
     * The estimated time remaining in minutes for the predictor training job to complete.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * An array of the ARNs of the dataset import jobs used to import training data for the predictor.
     */
    DatasetImportJobArns?: ArnList;
    /**
     * When PerformAutoML is specified, the ARN of the chosen algorithm.
     */
    AutoMLAlgorithmArns?: ArnList;
    /**
     * The status of the predictor. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     CREATE_STOPPING, CREATE_STOPPED     The Status of the predictor must be ACTIVE before you can use the predictor to create a forecast. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: Message;
    /**
     * When the model training task was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
    /**
     * The accuracy metric used to optimize the predictor.
     */
    OptimizationMetric?: OptimizationMetric;
  }
  export type Domain = "RETAIL"|"CUSTOM"|"INVENTORY_PLANNING"|"EC2_CAPACITY"|"WORK_FORCE"|"WEB_TRAFFIC"|"METRICS"|string;
  export type Double = number;
  export interface EncryptionConfig {
    /**
     * The ARN of the IAM role that Amazon Forecast can assume to access the AWS KMS key. Passing a role across AWS accounts is not allowed. If you pass a role that isn't in your account, you get an InvalidInputException error.
     */
    RoleArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the KMS key.
     */
    KMSKeyArn: KMSKeyArn;
  }
  export type ErrorMessage = string;
  export interface ErrorMetric {
    /**
     *  The Forecast type used to compute WAPE, MAPE, MASE, and RMSE. 
     */
    ForecastType?: ForecastType;
    /**
     *  The weighted absolute percentage error (WAPE). 
     */
    WAPE?: Double;
    /**
     *  The root-mean-square error (RMSE). 
     */
    RMSE?: Double;
    /**
     * The Mean Absolute Scaled Error (MASE)
     */
    MASE?: Double;
    /**
     * The Mean Absolute Percentage Error (MAPE)
     */
    MAPE?: Double;
  }
  export type ErrorMetrics = ErrorMetric[];
  export interface EvaluationParameters {
    /**
     * The number of times to split the input data. The default is 1. Valid values are 1 through 5.
     */
    NumberOfBacktestWindows?: Integer;
    /**
     * The point from the end of the dataset where you want to split the data for model training and testing (evaluation). Specify the value as the number of data points. The default is the value of the forecast horizon. BackTestWindowOffset can be used to mimic a past virtual forecast start date. This value must be greater than or equal to the forecast horizon and less than half of the TARGET_TIME_SERIES dataset length.  ForecastHorizon &lt;= BackTestWindowOffset &lt; 1/2 * TARGET_TIME_SERIES dataset length
     */
    BackTestWindowOffset?: Integer;
  }
  export interface EvaluationResult {
    /**
     * The Amazon Resource Name (ARN) of the algorithm that was evaluated.
     */
    AlgorithmArn?: Arn;
    /**
     * The array of test windows used for evaluating the algorithm. The NumberOfBacktestWindows from the EvaluationParameters object determines the number of windows in the array.
     */
    TestWindows?: TestWindows;
  }
  export type EvaluationType = "SUMMARY"|"COMPUTED"|string;
  export interface Featurization {
    /**
     * The name of the schema attribute that specifies the data field to be featurized. Amazon Forecast supports the target field of the TARGET_TIME_SERIES and the RELATED_TIME_SERIES datasets. For example, for the RETAIL domain, the target is demand, and for the CUSTOM domain, the target is target_value. For more information, see howitworks-missing-values.
     */
    AttributeName: Name;
    /**
     * An array of one FeaturizationMethod object that specifies the feature transformation method.
     */
    FeaturizationPipeline?: FeaturizationPipeline;
  }
  export interface FeaturizationConfig {
    /**
     * The frequency of predictions in a forecast. Valid intervals are Y (Year), M (Month), W (Week), D (Day), H (Hour), 30min (30 minutes), 15min (15 minutes), 10min (10 minutes), 5min (5 minutes), and 1min (1 minute). For example, "Y" indicates every year and "5min" indicates every five minutes. The frequency must be greater than or equal to the TARGET_TIME_SERIES dataset frequency. When a RELATED_TIME_SERIES dataset is provided, the frequency must be equal to the RELATED_TIME_SERIES dataset frequency.
     */
    ForecastFrequency: Frequency;
    /**
     * An array of dimension (field) names that specify how to group the generated forecast. For example, suppose that you are generating a forecast for item sales across all of your stores, and your dataset contains a store_id field. If you want the sales forecast for each item by store, you would specify store_id as the dimension. All forecast dimensions specified in the TARGET_TIME_SERIES dataset don't need to be specified in the CreatePredictor request. All forecast dimensions specified in the RELATED_TIME_SERIES dataset must be specified in the CreatePredictor request.
     */
    ForecastDimensions?: ForecastDimensions;
    /**
     * An array of featurization (transformation) information for the fields of a dataset.
     */
    Featurizations?: Featurizations;
  }
  export interface FeaturizationMethod {
    /**
     * The name of the method. The "filling" method is the only supported method.
     */
    FeaturizationMethodName: FeaturizationMethodName;
    /**
     * The method parameters (key-value pairs), which are a map of override parameters. Specify these parameters to override the default values. Related Time Series attributes do not accept aggregation parameters. The following list shows the parameters and their valid values for the "filling" featurization method for a Target Time Series dataset. Bold signifies the default value.    aggregation: sum, avg, first, min, max     frontfill: none     middlefill: zero, nan (not a number), value, median, mean, min, max     backfill: zero, nan, value, median, mean, min, max    The following list shows the parameters and their valid values for a Related Time Series featurization method (there are no defaults):    middlefill: zero, value, median, mean, min, max     backfill: zero, value, median, mean, min, max     futurefill: zero, value, median, mean, min, max    To set a filling method to a specific value, set the fill parameter to value and define the value in a corresponding _value parameter. For example, to set backfilling to a value of 2, include the following: "backfill": "value" and "backfill_value":"2". 
     */
    FeaturizationMethodParameters?: FeaturizationMethodParameters;
  }
  export type FeaturizationMethodName = "filling"|string;
  export type FeaturizationMethodParameters = {[key: string]: ParameterValue};
  export type FeaturizationPipeline = FeaturizationMethod[];
  export type Featurizations = Featurization[];
  export type FieldStatistics = {[key: string]: Statistics};
  export interface Filter {
    /**
     * The name of the parameter to filter on.
     */
    Key: String;
    /**
     * The value to match.
     */
    Value: Arn;
    /**
     * The condition to apply. To include the objects that match the statement, specify IS. To exclude matching objects, specify IS_NOT.
     */
    Condition: FilterConditionString;
  }
  export type FilterConditionString = "IS"|"IS_NOT"|string;
  export type Filters = Filter[];
  export type ForecastDimensions = Name[];
  export interface ForecastExportJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the forecast export job.
     */
    ForecastExportJobArn?: Arn;
    /**
     * The name of the forecast export job.
     */
    ForecastExportJobName?: Name;
    /**
     * The path to the Amazon Simple Storage Service (Amazon S3) bucket where the forecast is exported.
     */
    Destination?: DataDestination;
    /**
     * The status of the forecast export job. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the forecast export job must be ACTIVE before you can access the forecast in your S3 bucket. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the forecast export job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type ForecastExportJobs = ForecastExportJobSummary[];
  export interface ForecastSummary {
    /**
     * The ARN of the forecast.
     */
    ForecastArn?: Arn;
    /**
     * The name of the forecast.
     */
    ForecastName?: Name;
    /**
     * The ARN of the predictor used to generate the forecast.
     */
    PredictorArn?: String;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that provided the data used to train the predictor.
     */
    DatasetGroupArn?: String;
    /**
     * The status of the forecast. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the forecast must be ACTIVE before you can query or export the forecast. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the forecast creation task was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type ForecastType = string;
  export type ForecastTypes = ForecastType[];
  export type Forecasts = ForecastSummary[];
  export type Frequency = string;
  export type GeolocationFormat = string;
  export interface GetAccuracyMetricsRequest {
    /**
     * The Amazon Resource Name (ARN) of the predictor to get metrics for.
     */
    PredictorArn: Arn;
  }
  export interface GetAccuracyMetricsResponse {
    /**
     * An array of results from evaluating the predictor.
     */
    PredictorEvaluationResults?: PredictorEvaluationResults;
    /**
     *   The LatencyOptimized AutoML override strategy is only available in private beta. Contact AWS Support or your account manager to learn more about access privileges.   The AutoML strategy used to train the predictor. Unless LatencyOptimized is specified, the AutoML strategy optimizes predictor accuracy. This parameter is only valid for predictors trained using AutoML.
     */
    AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
    /**
     * The accuracy metric used to optimize the predictor.
     */
    OptimizationMetric?: OptimizationMetric;
  }
  export interface HyperParameterTuningJobConfig {
    /**
     * Specifies the ranges of valid values for the hyperparameters.
     */
    ParameterRanges?: ParameterRanges;
  }
  export interface InputDataConfig {
    /**
     * The Amazon Resource Name (ARN) of the dataset group.
     */
    DatasetGroupArn: Arn;
    /**
     * An array of supplementary features. The only supported feature is a holiday calendar.
     */
    SupplementaryFeatures?: SupplementaryFeatures;
  }
  export type Integer = number;
  export interface IntegerParameterRange {
    /**
     * The name of the hyperparameter to tune.
     */
    Name: Name;
    /**
     * The maximum tunable value of the hyperparameter.
     */
    MaxValue: Integer;
    /**
     * The minimum tunable value of the hyperparameter.
     */
    MinValue: Integer;
    /**
     * The scale that hyperparameter tuning uses to search the hyperparameter range. Valid values:  Auto  Amazon Forecast hyperparameter tuning chooses the best scale for the hyperparameter.  Linear  Hyperparameter tuning searches the values in the hyperparameter range by using a linear scale.  Logarithmic  Hyperparameter tuning searches the values in the hyperparameter range by using a logarithmic scale. Logarithmic scaling works only for ranges that have values greater than 0.  ReverseLogarithmic  Not supported for IntegerParameterRange. Reverse logarithmic scaling works only for ranges that are entirely within the range 0 &lt;= x &lt; 1.0.   For information about choosing a hyperparameter scale, see Hyperparameter Scaling. One of the following values:
     */
    ScalingType?: ScalingType;
  }
  export type IntegerParameterRanges = IntegerParameterRange[];
  export type KMSKeyArn = string;
  export interface ListDatasetGroupsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDatasetGroupsResponse {
    /**
     * An array of objects that summarize each dataset group's properties.
     */
    DatasetGroups?: DatasetGroups;
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListDatasetImportJobsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the datasets that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the datasets that match the statement, specify IS. To exclude matching datasets, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are DatasetArn and Status.    Value - The value to match.   For example, to list all dataset import jobs whose status is ACTIVE, you specify the following filter:  "Filters": [ { "Condition": "IS", "Key": "Status", "Value": "ACTIVE" } ] 
     */
    Filters?: Filters;
  }
  export interface ListDatasetImportJobsResponse {
    /**
     * An array of objects that summarize each dataset import job's properties.
     */
    DatasetImportJobs?: DatasetImportJobs;
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListDatasetsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDatasetsResponse {
    /**
     * An array of objects that summarize each dataset's properties.
     */
    Datasets?: Datasets;
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListForecastExportJobsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the forecast export jobs that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the forecast export jobs that match the statement, specify IS. To exclude matching forecast export jobs, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are ForecastArn and Status.    Value - The value to match.   For example, to list all jobs that export a forecast named electricityforecast, specify the following filter:  "Filters": [ { "Condition": "IS", "Key": "ForecastArn", "Value": "arn:aws:forecast:us-west-2:&lt;acct-id&gt;:forecast/electricityforecast" } ] 
     */
    Filters?: Filters;
  }
  export interface ListForecastExportJobsResponse {
    /**
     * An array of objects that summarize each export job's properties.
     */
    ForecastExportJobs?: ForecastExportJobs;
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListForecastsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the forecasts that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the forecasts that match the statement, specify IS. To exclude matching forecasts, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are DatasetGroupArn, PredictorArn, and Status.    Value - The value to match.   For example, to list all forecasts whose status is not ACTIVE, you would specify:  "Filters": [ { "Condition": "IS_NOT", "Key": "Status", "Value": "ACTIVE" } ] 
     */
    Filters?: Filters;
  }
  export interface ListForecastsResponse {
    /**
     * An array of objects that summarize each forecast's properties.
     */
    Forecasts?: Forecasts;
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListPredictorBacktestExportJobsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the predictor backtest export jobs that match the statement from the list. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the predictor backtest export jobs that match the statement, specify IS. To exclude matching predictor backtest export jobs, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are PredictorArn and Status.    Value - The value to match.  
     */
    Filters?: Filters;
  }
  export interface ListPredictorBacktestExportJobsResponse {
    /**
     * An array of objects that summarize the properties of each predictor backtest export job.
     */
    PredictorBacktestExportJobs?: PredictorBacktestExportJobs;
    /**
     * Returns this token if the response is truncated. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListPredictorsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the predictors that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the predictors that match the statement, specify IS. To exclude matching predictors, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are DatasetGroupArn and Status.    Value - The value to match.   For example, to list all predictors whose status is ACTIVE, you would specify:  "Filters": [ { "Condition": "IS", "Key": "Status", "Value": "ACTIVE" } ] 
     */
    Filters?: Filters;
  }
  export interface ListPredictorsResponse {
    /**
     * An array of objects that summarize each predictor's properties.
     */
    Predictors?: Predictors;
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resources are Forecast dataset groups, datasets, dataset import jobs, predictors, forecasts, and forecast export jobs.
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    Tags?: Tags;
  }
  export type Long = number;
  export type MaxResults = number;
  export type Message = string;
  export interface Metrics {
    /**
     * The root-mean-square error (RMSE).
     */
    RMSE?: Double;
    /**
     * An array of weighted quantile losses. Quantiles divide a probability distribution into regions of equal probability. The distribution in this case is the loss function.
     */
    WeightedQuantileLosses?: WeightedQuantileLosses;
    /**
     *  Provides detailed error metrics for each forecast type. Metrics include root-mean square-error (RMSE), mean absolute percentage error (MAPE), mean absolute scaled error (MASE), and weighted average percentage error (WAPE). 
     */
    ErrorMetrics?: ErrorMetrics;
    /**
     * The average value of all weighted quantile losses.
     */
    AverageWeightedQuantileLoss?: Double;
  }
  export type Name = string;
  export type NextToken = string;
  export type OptimizationMetric = "WAPE"|"RMSE"|"AverageWeightedQuantileLoss"|"MASE"|"MAPE"|string;
  export type ParameterKey = string;
  export interface ParameterRanges {
    /**
     * Specifies the tunable range for each categorical hyperparameter.
     */
    CategoricalParameterRanges?: CategoricalParameterRanges;
    /**
     * Specifies the tunable range for each continuous hyperparameter.
     */
    ContinuousParameterRanges?: ContinuousParameterRanges;
    /**
     * Specifies the tunable range for each integer hyperparameter.
     */
    IntegerParameterRanges?: IntegerParameterRanges;
  }
  export type ParameterValue = string;
  export interface PredictorBacktestExportJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the predictor backtest export job.
     */
    PredictorBacktestExportJobArn?: Arn;
    /**
     * The name of the predictor backtest export job.
     */
    PredictorBacktestExportJobName?: Name;
    Destination?: DataDestination;
    /**
     * The status of the predictor backtest export job. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * Information about any errors that may have occurred during the backtest export.
     */
    Message?: ErrorMessage;
    /**
     * When the predictor backtest export job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type PredictorBacktestExportJobs = PredictorBacktestExportJobSummary[];
  export type PredictorEvaluationResults = EvaluationResult[];
  export interface PredictorExecution {
    /**
     * The ARN of the algorithm used to test the predictor.
     */
    AlgorithmArn?: Arn;
    /**
     * An array of test windows used to evaluate the algorithm. The NumberOfBacktestWindows from the object determines the number of windows in the array.
     */
    TestWindows?: TestWindowDetails;
  }
  export interface PredictorExecutionDetails {
    /**
     * An array of the backtests performed to evaluate the accuracy of the predictor against a particular algorithm. The NumberOfBacktestWindows from the object determines the number of windows in the array.
     */
    PredictorExecutions?: PredictorExecutions;
  }
  export type PredictorExecutions = PredictorExecution[];
  export interface PredictorSummary {
    /**
     * The ARN of the predictor.
     */
    PredictorArn?: Arn;
    /**
     * The name of the predictor.
     */
    PredictorName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the dataset group that contains the data used to train the predictor.
     */
    DatasetGroupArn?: Arn;
    /**
     * The status of the predictor. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     CREATE_STOPPING, CREATE_STOPPED     The Status of the predictor must be ACTIVE before you can use the predictor to create a forecast. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the model training task was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type Predictors = PredictorSummary[];
  export interface S3Config {
    /**
     * The path to an Amazon Simple Storage Service (Amazon S3) bucket or file(s) in an Amazon S3 bucket.
     */
    Path: S3Path;
    /**
     * The ARN of the AWS Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket or files. If you provide a value for the KMSKeyArn key, the role must allow access to the key. Passing a role across AWS accounts is not allowed. If you pass a role that isn't in your account, you get an InvalidInputException error.
     */
    RoleArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of an AWS Key Management Service (KMS) key.
     */
    KMSKeyArn?: KMSKeyArn;
  }
  export type S3Path = string;
  export type ScalingType = "Auto"|"Linear"|"Logarithmic"|"ReverseLogarithmic"|string;
  export interface Schema {
    /**
     * An array of attributes specifying the name and type of each field in a dataset.
     */
    Attributes?: SchemaAttributes;
  }
  export interface SchemaAttribute {
    /**
     * The name of the dataset field.
     */
    AttributeName?: Name;
    /**
     * The data type of the field.
     */
    AttributeType?: AttributeType;
  }
  export type SchemaAttributes = SchemaAttribute[];
  export interface Statistics {
    /**
     * The number of values in the field. If the response value is -1, refer to CountLong.
     */
    Count?: Integer;
    /**
     * The number of distinct values in the field. If the response value is -1, refer to CountDistinctLong.
     */
    CountDistinct?: Integer;
    /**
     * The number of null values in the field. If the response value is -1, refer to CountNullLong.
     */
    CountNull?: Integer;
    /**
     * The number of NAN (not a number) values in the field. If the response value is -1, refer to CountNanLong.
     */
    CountNan?: Integer;
    /**
     * For a numeric field, the minimum value in the field.
     */
    Min?: String;
    /**
     * For a numeric field, the maximum value in the field.
     */
    Max?: String;
    /**
     * For a numeric field, the average value in the field.
     */
    Avg?: Double;
    /**
     * For a numeric field, the standard deviation.
     */
    Stddev?: Double;
    /**
     * The number of values in the field. CountLong is used instead of Count if the value is greater than 2,147,483,647.
     */
    CountLong?: Long;
    /**
     * The number of distinct values in the field. CountDistinctLong is used instead of CountDistinct if the value is greater than 2,147,483,647.
     */
    CountDistinctLong?: Long;
    /**
     * The number of null values in the field. CountNullLong is used instead of CountNull if the value is greater than 2,147,483,647.
     */
    CountNullLong?: Long;
    /**
     * The number of NAN (not a number) values in the field. CountNanLong is used instead of CountNan if the value is greater than 2,147,483,647.
     */
    CountNanLong?: Long;
  }
  export type Status = string;
  export interface StopResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource to stop. The supported ARNs are DatasetImportJobArn, PredictorArn, PredictorBacktestExportJobArn, ForecastArn, and ForecastExportJobArn. 
     */
    ResourceArn: Arn;
  }
  export type String = string;
  export interface SupplementaryFeature {
    /**
     * The name of the feature. Valid values: "holiday" and "weather".
     */
    Name: Name;
    /**
     *  Weather Index  To enable the Weather Index, set the value to "true"   Holidays  To enable Holidays, specify a country with one of the following two-letter country codes:   "AL" - ALBANIA   "AR" - ARGENTINA   "AT" - AUSTRIA   "AU" - AUSTRALIA   "BA" - BOSNIA HERZEGOVINA   "BE" - BELGIUM   "BG" - BULGARIA   "BO" - BOLIVIA   "BR" - BRAZIL   "BY" - BELARUS   "CA" - CANADA   "CL" - CHILE   "CO" - COLOMBIA   "CR" - COSTA RICA   "HR" - CROATIA   "CZ" - CZECH REPUBLIC   "DK" - DENMARK   "EC" - ECUADOR   "EE" - ESTONIA   "ET" - ETHIOPIA   "FI" - FINLAND   "FR" - FRANCE   "DE" - GERMANY   "GR" - GREECE   "HU" - HUNGARY   "IS" - ICELAND   "IN" - INDIA   "IE" - IRELAND   "IT" - ITALY   "JP" - JAPAN   "KZ" - KAZAKHSTAN   "KR" - KOREA   "LV" - LATVIA   "LI" - LIECHTENSTEIN   "LT" - LITHUANIA   "LU" - LUXEMBOURG   "MK" - MACEDONIA   "MT" - MALTA   "MX" - MEXICO   "MD" - MOLDOVA   "ME" - MONTENEGRO   "NL" - NETHERLANDS   "NZ" - NEW ZEALAND   "NI" - NICARAGUA   "NG" - NIGERIA   "NO" - NORWAY   "PA" - PANAMA   "PY" - PARAGUAY   "PE" - PERU   "PL" - POLAND   "PT" - PORTUGAL   "RO" - ROMANIA   "RU" - RUSSIA   "RS" - SERBIA   "SK" - SLOVAKIA   "SI" - SLOVENIA   "ZA" - SOUTH AFRICA   "ES" - SPAIN   "SE" - SWEDEN   "CH" - SWITZERLAND   "UA" - UKRAINE   "AE" - UNITED ARAB EMIRATES   "US" - UNITED STATES   "UK" - UNITED KINGDOM   "UY" - URUGUAY   "VE" - VENEZUELA  
     */
    Value: Value;
  }
  export type SupplementaryFeatures = SupplementaryFeature[];
  export interface Tag {
    /**
     * One part of a key-value pair that makes up a tag. A key is a general label that acts like a category for more specific tag values.
     */
    Key: TagKey;
    /**
     * The optional part of a key-value pair that makes up a tag. A value acts as a descriptor within a tag category (key).
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resources are Forecast dataset groups, datasets, dataset import jobs, predictors, forecasts, and forecast export jobs.
     */
    ResourceArn: Arn;
    /**
     * The tags to add to the resource. A tag is an array of key-value pairs. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for AWS use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type TestWindowDetails = TestWindowSummary[];
  export interface TestWindowSummary {
    /**
     * The time at which the test began.
     */
    TestWindowStart?: Timestamp;
    /**
     * The time at which the test ended.
     */
    TestWindowEnd?: Timestamp;
    /**
     * The status of the test. Possible status values are:    ACTIVE     CREATE_IN_PROGRESS     CREATE_FAILED   
     */
    Status?: Status;
    /**
     * If the test failed, the reason why it failed.
     */
    Message?: ErrorMessage;
  }
  export type TestWindows = WindowSummary[];
  export type TimeZone = string;
  export type Timestamp = Date;
  export type TimestampFormat = string;
  export type TrainingParameters = {[key: string]: ParameterValue};
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resources are Forecast dataset groups, datasets, dataset import jobs, predictors, forecasts, and forecast exports.
     */
    ResourceArn: Arn;
    /**
     * The keys of the tags to be removed.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDatasetGroupRequest {
    /**
     * The ARN of the dataset group.
     */
    DatasetGroupArn: Arn;
    /**
     * An array of the Amazon Resource Names (ARNs) of the datasets to add to the dataset group.
     */
    DatasetArns: ArnList;
  }
  export interface UpdateDatasetGroupResponse {
  }
  export type UseGeolocationForTimeZone = boolean;
  export type Value = string;
  export type Values = Value[];
  export interface WeightedQuantileLoss {
    /**
     * The quantile. Quantiles divide a probability distribution into regions of equal probability. For example, if the distribution was divided into 5 regions of equal probability, the quantiles would be 0.2, 0.4, 0.6, and 0.8.
     */
    Quantile?: Double;
    /**
     * The difference between the predicted value and the actual value over the quantile, weighted (normalized) by dividing by the sum over all quantiles.
     */
    LossValue?: Double;
  }
  export type WeightedQuantileLosses = WeightedQuantileLoss[];
  export interface WindowSummary {
    /**
     * The timestamp that defines the start of the window.
     */
    TestWindowStart?: Timestamp;
    /**
     * The timestamp that defines the end of the window.
     */
    TestWindowEnd?: Timestamp;
    /**
     * The number of data points within the window.
     */
    ItemCount?: Integer;
    /**
     * The type of evaluation.    SUMMARY - The average metrics across all windows.    COMPUTED - The metrics for the specified window.  
     */
    EvaluationType?: EvaluationType;
    /**
     * Provides metrics used to evaluate the performance of a predictor.
     */
    Metrics?: Metrics;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-06-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ForecastService client.
   */
  export import Types = ForecastService;
}
export = ForecastService;
