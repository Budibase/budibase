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
   * Creates an Amazon Forecast predictor. Amazon Forecast creates predictors with AutoPredictor, which involves applying the optimal combination of algorithms to each time series in your datasets. You can use CreateAutoPredictor to create new predictors or upgrade/retrain existing predictors.  Creating new predictors  The following parameters are required when creating a new predictor:    PredictorName - A unique name for the predictor.    DatasetGroupArn - The ARN of the dataset group used to train the predictor.    ForecastFrequency - The granularity of your forecasts (hourly, daily, weekly, etc).    ForecastHorizon - The number of time-steps that the model predicts. The forecast horizon is also called the prediction length.   When creating a new predictor, do not specify a value for ReferencePredictorArn.  Upgrading and retraining predictors  The following parameters are required when retraining or upgrading a predictor:    PredictorName - A unique name for the predictor.    ReferencePredictorArn - The ARN of the predictor to retrain or upgrade.   When upgrading or retraining a predictor, only specify values for the ReferencePredictorArn and PredictorName. 
   */
  createAutoPredictor(params: ForecastService.Types.CreateAutoPredictorRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateAutoPredictorResponse) => void): Request<ForecastService.Types.CreateAutoPredictorResponse, AWSError>;
  /**
   * Creates an Amazon Forecast predictor. Amazon Forecast creates predictors with AutoPredictor, which involves applying the optimal combination of algorithms to each time series in your datasets. You can use CreateAutoPredictor to create new predictors or upgrade/retrain existing predictors.  Creating new predictors  The following parameters are required when creating a new predictor:    PredictorName - A unique name for the predictor.    DatasetGroupArn - The ARN of the dataset group used to train the predictor.    ForecastFrequency - The granularity of your forecasts (hourly, daily, weekly, etc).    ForecastHorizon - The number of time-steps that the model predicts. The forecast horizon is also called the prediction length.   When creating a new predictor, do not specify a value for ReferencePredictorArn.  Upgrading and retraining predictors  The following parameters are required when retraining or upgrading a predictor:    PredictorName - A unique name for the predictor.    ReferencePredictorArn - The ARN of the predictor to retrain or upgrade.   When upgrading or retraining a predictor, only specify values for the ReferencePredictorArn and PredictorName. 
   */
  createAutoPredictor(callback?: (err: AWSError, data: ForecastService.Types.CreateAutoPredictorResponse) => void): Request<ForecastService.Types.CreateAutoPredictorResponse, AWSError>;
  /**
   * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps Forecast understand how to consume the data for model training. This includes the following:     DataFrequency  - How frequently your historical time-series data is collected.     Domain  and  DatasetType  - Each dataset has an associated dataset domain and a type within the domain. Amazon Forecast provides a list of predefined domains and types within each domain. For each unique dataset domain and type within the domain, Amazon Forecast requires your data to include a minimum set of predefined fields.     Schema  - A schema specifies the fields in the dataset, including the field name and data type.   After creating a dataset, you import your training data into it and add the dataset to a dataset group. You use the dataset group to create a predictor. For more information, see Importing datasets. To get a list of all your datasets, use the ListDatasets operation. For example Forecast datasets, see the Amazon Forecast Sample GitHub repository.  The Status of a dataset must be ACTIVE before you can import training data. Use the DescribeDataset operation to get the status. 
   */
  createDataset(params: ForecastService.Types.CreateDatasetRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetResponse) => void): Request<ForecastService.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps Forecast understand how to consume the data for model training. This includes the following:     DataFrequency  - How frequently your historical time-series data is collected.     Domain  and  DatasetType  - Each dataset has an associated dataset domain and a type within the domain. Amazon Forecast provides a list of predefined domains and types within each domain. For each unique dataset domain and type within the domain, Amazon Forecast requires your data to include a minimum set of predefined fields.     Schema  - A schema specifies the fields in the dataset, including the field name and data type.   After creating a dataset, you import your training data into it and add the dataset to a dataset group. You use the dataset group to create a predictor. For more information, see Importing datasets. To get a list of all your datasets, use the ListDatasets operation. For example Forecast datasets, see the Amazon Forecast Sample GitHub repository.  The Status of a dataset must be ACTIVE before you can import training data. Use the DescribeDataset operation to get the status. 
   */
  createDataset(callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetResponse) => void): Request<ForecastService.Types.CreateDatasetResponse, AWSError>;
  /**
   * Creates a dataset group, which holds a collection of related datasets. You can add datasets to the dataset group when you create the dataset group, or later by using the UpdateDatasetGroup operation. After creating a dataset group and adding datasets, you use the dataset group when you create a predictor. For more information, see Dataset groups. To get a list of all your datasets groups, use the ListDatasetGroups operation.  The Status of a dataset group must be ACTIVE before you can use the dataset group to create a predictor. To get the status, use the DescribeDatasetGroup operation. 
   */
  createDatasetGroup(params: ForecastService.Types.CreateDatasetGroupRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetGroupResponse) => void): Request<ForecastService.Types.CreateDatasetGroupResponse, AWSError>;
  /**
   * Creates a dataset group, which holds a collection of related datasets. You can add datasets to the dataset group when you create the dataset group, or later by using the UpdateDatasetGroup operation. After creating a dataset group and adding datasets, you use the dataset group when you create a predictor. For more information, see Dataset groups. To get a list of all your datasets groups, use the ListDatasetGroups operation.  The Status of a dataset group must be ACTIVE before you can use the dataset group to create a predictor. To get the status, use the DescribeDatasetGroup operation. 
   */
  createDatasetGroup(callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetGroupResponse) => void): Request<ForecastService.Types.CreateDatasetGroupResponse, AWSError>;
  /**
   * Imports your training data to an Amazon Forecast dataset. You provide the location of your training data in an Amazon Simple Storage Service (Amazon S3) bucket and the Amazon Resource Name (ARN) of the dataset that you want to import the data to. You must specify a DataSource object that includes an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data, as Amazon Forecast makes a copy of your data and processes it in an internal Amazon Web Services system. For more information, see Set up permissions. The training data must be in CSV or Parquet format. The delimiter must be a comma (,). You can specify the path to a specific file, the S3 bucket, or to a folder in the S3 bucket. For the latter two cases, Amazon Forecast imports all files up to the limit of 10,000 files. Because dataset imports are not aggregated, your most recent dataset import is the one that is used when training a predictor or generating a forecast. Make sure that your most recent dataset import contains all of the data you want to model off of, and not just the new data collected since the previous import. To get a list of all your dataset import jobs, filtered by specified criteria, use the ListDatasetImportJobs operation.
   */
  createDatasetImportJob(params: ForecastService.Types.CreateDatasetImportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetImportJobResponse) => void): Request<ForecastService.Types.CreateDatasetImportJobResponse, AWSError>;
  /**
   * Imports your training data to an Amazon Forecast dataset. You provide the location of your training data in an Amazon Simple Storage Service (Amazon S3) bucket and the Amazon Resource Name (ARN) of the dataset that you want to import the data to. You must specify a DataSource object that includes an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data, as Amazon Forecast makes a copy of your data and processes it in an internal Amazon Web Services system. For more information, see Set up permissions. The training data must be in CSV or Parquet format. The delimiter must be a comma (,). You can specify the path to a specific file, the S3 bucket, or to a folder in the S3 bucket. For the latter two cases, Amazon Forecast imports all files up to the limit of 10,000 files. Because dataset imports are not aggregated, your most recent dataset import is the one that is used when training a predictor or generating a forecast. Make sure that your most recent dataset import contains all of the data you want to model off of, and not just the new data collected since the previous import. To get a list of all your dataset import jobs, filtered by specified criteria, use the ListDatasetImportJobs operation.
   */
  createDatasetImportJob(callback?: (err: AWSError, data: ForecastService.Types.CreateDatasetImportJobResponse) => void): Request<ForecastService.Types.CreateDatasetImportJobResponse, AWSError>;
  /**
   *  Explainability is only available for Forecasts and Predictors generated from an AutoPredictor (CreateAutoPredictor)  Creates an Amazon Forecast Explainability. Explainability helps you better understand how the attributes in your datasets impact forecast. Amazon Forecast uses a metric called Impact scores to quantify the relative impact of each attribute and determine whether they increase or decrease forecast values. To enable Forecast Explainability, your predictor must include at least one of the following: related time series, item metadata, or additional datasets like Holidays and the Weather Index. CreateExplainability accepts either a Predictor ARN or Forecast ARN. To receive aggregated Impact scores for all time series and time points in your datasets, provide a Predictor ARN. To receive Impact scores for specific time series and time points, provide a Forecast ARN.  CreateExplainability with a Predictor ARN   You can only have one Explainability resource per predictor. If you already enabled ExplainPredictor in CreateAutoPredictor, that predictor already has an Explainability resource.  The following parameters are required when providing a Predictor ARN:    ExplainabilityName - A unique name for the Explainability.    ResourceArn - The Arn of the predictor.    TimePointGranularity - Must be set to “ALL”.    TimeSeriesGranularity - Must be set to “ALL”.   Do not specify a value for the following parameters:    DataSource - Only valid when TimeSeriesGranularity is “SPECIFIC”.    Schema - Only valid when TimeSeriesGranularity is “SPECIFIC”.    StartDateTime - Only valid when TimePointGranularity is “SPECIFIC”.    EndDateTime - Only valid when TimePointGranularity is “SPECIFIC”.    CreateExplainability with a Forecast ARN   You can specify a maximum of 50 time series and 500 time points.  The following parameters are required when providing a Predictor ARN:    ExplainabilityName - A unique name for the Explainability.    ResourceArn - The Arn of the forecast.    TimePointGranularity - Either “ALL” or “SPECIFIC”.    TimeSeriesGranularity - Either “ALL” or “SPECIFIC”.   If you set TimeSeriesGranularity to “SPECIFIC”, you must also provide the following:    DataSource - The S3 location of the CSV file specifying your time series.    Schema - The Schema defines the attributes and attribute types listed in the Data Source.   If you set TimePointGranularity to “SPECIFIC”, you must also provide the following:    StartDateTime - The first timestamp in the range of time points.    EndDateTime - The last timestamp in the range of time points.  
   */
  createExplainability(params: ForecastService.Types.CreateExplainabilityRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateExplainabilityResponse) => void): Request<ForecastService.Types.CreateExplainabilityResponse, AWSError>;
  /**
   *  Explainability is only available for Forecasts and Predictors generated from an AutoPredictor (CreateAutoPredictor)  Creates an Amazon Forecast Explainability. Explainability helps you better understand how the attributes in your datasets impact forecast. Amazon Forecast uses a metric called Impact scores to quantify the relative impact of each attribute and determine whether they increase or decrease forecast values. To enable Forecast Explainability, your predictor must include at least one of the following: related time series, item metadata, or additional datasets like Holidays and the Weather Index. CreateExplainability accepts either a Predictor ARN or Forecast ARN. To receive aggregated Impact scores for all time series and time points in your datasets, provide a Predictor ARN. To receive Impact scores for specific time series and time points, provide a Forecast ARN.  CreateExplainability with a Predictor ARN   You can only have one Explainability resource per predictor. If you already enabled ExplainPredictor in CreateAutoPredictor, that predictor already has an Explainability resource.  The following parameters are required when providing a Predictor ARN:    ExplainabilityName - A unique name for the Explainability.    ResourceArn - The Arn of the predictor.    TimePointGranularity - Must be set to “ALL”.    TimeSeriesGranularity - Must be set to “ALL”.   Do not specify a value for the following parameters:    DataSource - Only valid when TimeSeriesGranularity is “SPECIFIC”.    Schema - Only valid when TimeSeriesGranularity is “SPECIFIC”.    StartDateTime - Only valid when TimePointGranularity is “SPECIFIC”.    EndDateTime - Only valid when TimePointGranularity is “SPECIFIC”.    CreateExplainability with a Forecast ARN   You can specify a maximum of 50 time series and 500 time points.  The following parameters are required when providing a Predictor ARN:    ExplainabilityName - A unique name for the Explainability.    ResourceArn - The Arn of the forecast.    TimePointGranularity - Either “ALL” or “SPECIFIC”.    TimeSeriesGranularity - Either “ALL” or “SPECIFIC”.   If you set TimeSeriesGranularity to “SPECIFIC”, you must also provide the following:    DataSource - The S3 location of the CSV file specifying your time series.    Schema - The Schema defines the attributes and attribute types listed in the Data Source.   If you set TimePointGranularity to “SPECIFIC”, you must also provide the following:    StartDateTime - The first timestamp in the range of time points.    EndDateTime - The last timestamp in the range of time points.  
   */
  createExplainability(callback?: (err: AWSError, data: ForecastService.Types.CreateExplainabilityResponse) => void): Request<ForecastService.Types.CreateExplainabilityResponse, AWSError>;
  /**
   * Exports an Explainability resource created by the CreateExplainability operation. Exported files are exported to an Amazon Simple Storage Service (Amazon S3) bucket. You must specify a DataDestination object that includes an Amazon S3 bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles.  The Status of the export job must be ACTIVE before you can access the export in your Amazon S3 bucket. To get the status, use the DescribeExplainabilityExport operation. 
   */
  createExplainabilityExport(params: ForecastService.Types.CreateExplainabilityExportRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateExplainabilityExportResponse) => void): Request<ForecastService.Types.CreateExplainabilityExportResponse, AWSError>;
  /**
   * Exports an Explainability resource created by the CreateExplainability operation. Exported files are exported to an Amazon Simple Storage Service (Amazon S3) bucket. You must specify a DataDestination object that includes an Amazon S3 bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles.  The Status of the export job must be ACTIVE before you can access the export in your Amazon S3 bucket. To get the status, use the DescribeExplainabilityExport operation. 
   */
  createExplainabilityExport(callback?: (err: AWSError, data: ForecastService.Types.CreateExplainabilityExportResponse) => void): Request<ForecastService.Types.CreateExplainabilityExportResponse, AWSError>;
  /**
   * Creates a forecast for each item in the TARGET_TIME_SERIES dataset that was used to train the predictor. This is known as inference. To retrieve the forecast for a single item at low latency, use the operation. To export the complete forecast into your Amazon Simple Storage Service (Amazon S3) bucket, use the CreateForecastExportJob operation. The range of the forecast is determined by the ForecastHorizon value, which you specify in the CreatePredictor request. When you query a forecast, you can request a specific date range within the forecast. To get a list of all your forecasts, use the ListForecasts operation.  The forecasts generated by Amazon Forecast are in the same time zone as the dataset that was used to create the predictor.  For more information, see howitworks-forecast.  The Status of the forecast must be ACTIVE before you can query or export the forecast. Use the DescribeForecast operation to get the status.  By default, a forecast includes predictions for every item (item_id) in the dataset group that was used to train the predictor. However, you can use the TimeSeriesSelector object to generate a forecast on a subset of time series. Forecast creation is skipped for any time series that you specify that are not in the input dataset. The forecast export file will not contain these time series or their forecasted values.
   */
  createForecast(params: ForecastService.Types.CreateForecastRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateForecastResponse) => void): Request<ForecastService.Types.CreateForecastResponse, AWSError>;
  /**
   * Creates a forecast for each item in the TARGET_TIME_SERIES dataset that was used to train the predictor. This is known as inference. To retrieve the forecast for a single item at low latency, use the operation. To export the complete forecast into your Amazon Simple Storage Service (Amazon S3) bucket, use the CreateForecastExportJob operation. The range of the forecast is determined by the ForecastHorizon value, which you specify in the CreatePredictor request. When you query a forecast, you can request a specific date range within the forecast. To get a list of all your forecasts, use the ListForecasts operation.  The forecasts generated by Amazon Forecast are in the same time zone as the dataset that was used to create the predictor.  For more information, see howitworks-forecast.  The Status of the forecast must be ACTIVE before you can query or export the forecast. Use the DescribeForecast operation to get the status.  By default, a forecast includes predictions for every item (item_id) in the dataset group that was used to train the predictor. However, you can use the TimeSeriesSelector object to generate a forecast on a subset of time series. Forecast creation is skipped for any time series that you specify that are not in the input dataset. The forecast export file will not contain these time series or their forecasted values.
   */
  createForecast(callback?: (err: AWSError, data: ForecastService.Types.CreateForecastResponse) => void): Request<ForecastService.Types.CreateForecastResponse, AWSError>;
  /**
   * Exports a forecast created by the CreateForecast operation to your Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions: &lt;ForecastExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt; where the &lt;ExportTimestamp&gt; component is in Java SimpleDateFormat (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles. For more information, see howitworks-forecast. To get a list of all your forecast export jobs, use the ListForecastExportJobs operation.  The Status of the forecast export job must be ACTIVE before you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeForecastExportJob operation. 
   */
  createForecastExportJob(params: ForecastService.Types.CreateForecastExportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateForecastExportJobResponse) => void): Request<ForecastService.Types.CreateForecastExportJobResponse, AWSError>;
  /**
   * Exports a forecast created by the CreateForecast operation to your Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions: &lt;ForecastExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt; where the &lt;ExportTimestamp&gt; component is in Java SimpleDateFormat (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles. For more information, see howitworks-forecast. To get a list of all your forecast export jobs, use the ListForecastExportJobs operation.  The Status of the forecast export job must be ACTIVE before you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeForecastExportJob operation. 
   */
  createForecastExportJob(callback?: (err: AWSError, data: ForecastService.Types.CreateForecastExportJobResponse) => void): Request<ForecastService.Types.CreateForecastExportJobResponse, AWSError>;
  /**
   * Creates a predictor monitor resource for an existing auto predictor. Predictor monitoring allows you to see how your predictor's performance changes over time. For more information, see Predictor Monitoring. 
   */
  createMonitor(params: ForecastService.Types.CreateMonitorRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateMonitorResponse) => void): Request<ForecastService.Types.CreateMonitorResponse, AWSError>;
  /**
   * Creates a predictor monitor resource for an existing auto predictor. Predictor monitoring allows you to see how your predictor's performance changes over time. For more information, see Predictor Monitoring. 
   */
  createMonitor(callback?: (err: AWSError, data: ForecastService.Types.CreateMonitorResponse) => void): Request<ForecastService.Types.CreateMonitorResponse, AWSError>;
  /**
   *   This operation creates a legacy predictor that does not include all the predictor functionalities provided by Amazon Forecast. To create a predictor that is compatible with all aspects of Forecast, use CreateAutoPredictor.  Creates an Amazon Forecast predictor. In the request, provide a dataset group and either specify an algorithm or let Amazon Forecast choose an algorithm for you using AutoML. If you specify an algorithm, you also can override algorithm-specific hyperparameters. Amazon Forecast uses the algorithm to train a predictor using the latest version of the datasets in the specified dataset group. You can then generate a forecast using the CreateForecast operation.  To see the evaluation metrics, use the GetAccuracyMetrics operation.  You can specify a featurization configuration to fill and aggregate the data fields in the TARGET_TIME_SERIES dataset to improve model training. For more information, see FeaturizationConfig. For RELATED_TIME_SERIES datasets, CreatePredictor verifies that the DataFrequency specified when the dataset was created matches the ForecastFrequency. TARGET_TIME_SERIES datasets don't have this restriction. Amazon Forecast also verifies the delimiter and timestamp format. For more information, see howitworks-datasets-groups. By default, predictors are trained and evaluated at the 0.1 (P10), 0.5 (P50), and 0.9 (P90) quantiles. You can choose custom forecast types to train and evaluate your predictor by setting the ForecastTypes.   AutoML  If you want Amazon Forecast to evaluate each algorithm and choose the one that minimizes the objective function, set PerformAutoML to true. The objective function is defined as the mean of the weighted losses over the forecast types. By default, these are the p10, p50, and p90 quantile losses. For more information, see EvaluationResult. When AutoML is enabled, the following properties are disallowed:    AlgorithmArn     HPOConfig     PerformHPO     TrainingParameters    To get a list of all of your predictors, use the ListPredictors operation.  Before you can use the predictor to create a forecast, the Status of the predictor must be ACTIVE, signifying that training has completed. To get the status, use the DescribePredictor operation. 
   */
  createPredictor(params: ForecastService.Types.CreatePredictorRequest, callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorResponse) => void): Request<ForecastService.Types.CreatePredictorResponse, AWSError>;
  /**
   *   This operation creates a legacy predictor that does not include all the predictor functionalities provided by Amazon Forecast. To create a predictor that is compatible with all aspects of Forecast, use CreateAutoPredictor.  Creates an Amazon Forecast predictor. In the request, provide a dataset group and either specify an algorithm or let Amazon Forecast choose an algorithm for you using AutoML. If you specify an algorithm, you also can override algorithm-specific hyperparameters. Amazon Forecast uses the algorithm to train a predictor using the latest version of the datasets in the specified dataset group. You can then generate a forecast using the CreateForecast operation.  To see the evaluation metrics, use the GetAccuracyMetrics operation.  You can specify a featurization configuration to fill and aggregate the data fields in the TARGET_TIME_SERIES dataset to improve model training. For more information, see FeaturizationConfig. For RELATED_TIME_SERIES datasets, CreatePredictor verifies that the DataFrequency specified when the dataset was created matches the ForecastFrequency. TARGET_TIME_SERIES datasets don't have this restriction. Amazon Forecast also verifies the delimiter and timestamp format. For more information, see howitworks-datasets-groups. By default, predictors are trained and evaluated at the 0.1 (P10), 0.5 (P50), and 0.9 (P90) quantiles. You can choose custom forecast types to train and evaluate your predictor by setting the ForecastTypes.   AutoML  If you want Amazon Forecast to evaluate each algorithm and choose the one that minimizes the objective function, set PerformAutoML to true. The objective function is defined as the mean of the weighted losses over the forecast types. By default, these are the p10, p50, and p90 quantile losses. For more information, see EvaluationResult. When AutoML is enabled, the following properties are disallowed:    AlgorithmArn     HPOConfig     PerformHPO     TrainingParameters    To get a list of all of your predictors, use the ListPredictors operation.  Before you can use the predictor to create a forecast, the Status of the predictor must be ACTIVE, signifying that training has completed. To get the status, use the DescribePredictor operation. 
   */
  createPredictor(callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorResponse) => void): Request<ForecastService.Types.CreatePredictorResponse, AWSError>;
  /**
   * Exports backtest forecasts and accuracy metrics generated by the CreateAutoPredictor or CreatePredictor operations. Two folders containing CSV or Parquet files are exported to your specified S3 bucket.  The export file names will match the following conventions:  &lt;ExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt;.csv  The &lt;ExportTimestamp&gt; component is in Java SimpleDate format (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Amazon S3 bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles.  The Status of the export job must be ACTIVE before you can access the export in your Amazon S3 bucket. To get the status, use the DescribePredictorBacktestExportJob operation. 
   */
  createPredictorBacktestExportJob(params: ForecastService.Types.CreatePredictorBacktestExportJobRequest, callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorBacktestExportJobResponse) => void): Request<ForecastService.Types.CreatePredictorBacktestExportJobResponse, AWSError>;
  /**
   * Exports backtest forecasts and accuracy metrics generated by the CreateAutoPredictor or CreatePredictor operations. Two folders containing CSV or Parquet files are exported to your specified S3 bucket.  The export file names will match the following conventions:  &lt;ExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt;.csv  The &lt;ExportTimestamp&gt; component is in Java SimpleDate format (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Amazon S3 bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles.  The Status of the export job must be ACTIVE before you can access the export in your Amazon S3 bucket. To get the status, use the DescribePredictorBacktestExportJob operation. 
   */
  createPredictorBacktestExportJob(callback?: (err: AWSError, data: ForecastService.Types.CreatePredictorBacktestExportJobResponse) => void): Request<ForecastService.Types.CreatePredictorBacktestExportJobResponse, AWSError>;
  /**
   * What-if analysis is a scenario modeling technique where you make a hypothetical change to a time series and compare the forecasts generated by these changes against the baseline, unchanged time series. It is important to remember that the purpose of a what-if analysis is to understand how a forecast can change given different modifications to the baseline time series. For example, imagine you are a clothing retailer who is considering an end of season sale to clear space for new styles. After creating a baseline forecast, you can use a what-if analysis to investigate how different sales tactics might affect your goals. You could create a scenario where everything is given a 25% markdown, and another where everything is given a fixed dollar markdown. You could create a scenario where the sale lasts for one week and another where the sale lasts for one month. With a what-if analysis, you can compare many different scenarios against each other. Note that a what-if analysis is meant to display what the forecasting model has learned and how it will behave in the scenarios that you are evaluating. Do not blindly use the results of the what-if analysis to make business decisions. For instance, forecasts might not be accurate for novel scenarios where there is no reference available to determine whether a forecast is good. The TimeSeriesSelector object defines the items that you want in the what-if analysis.
   */
  createWhatIfAnalysis(params: ForecastService.Types.CreateWhatIfAnalysisRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateWhatIfAnalysisResponse) => void): Request<ForecastService.Types.CreateWhatIfAnalysisResponse, AWSError>;
  /**
   * What-if analysis is a scenario modeling technique where you make a hypothetical change to a time series and compare the forecasts generated by these changes against the baseline, unchanged time series. It is important to remember that the purpose of a what-if analysis is to understand how a forecast can change given different modifications to the baseline time series. For example, imagine you are a clothing retailer who is considering an end of season sale to clear space for new styles. After creating a baseline forecast, you can use a what-if analysis to investigate how different sales tactics might affect your goals. You could create a scenario where everything is given a 25% markdown, and another where everything is given a fixed dollar markdown. You could create a scenario where the sale lasts for one week and another where the sale lasts for one month. With a what-if analysis, you can compare many different scenarios against each other. Note that a what-if analysis is meant to display what the forecasting model has learned and how it will behave in the scenarios that you are evaluating. Do not blindly use the results of the what-if analysis to make business decisions. For instance, forecasts might not be accurate for novel scenarios where there is no reference available to determine whether a forecast is good. The TimeSeriesSelector object defines the items that you want in the what-if analysis.
   */
  createWhatIfAnalysis(callback?: (err: AWSError, data: ForecastService.Types.CreateWhatIfAnalysisResponse) => void): Request<ForecastService.Types.CreateWhatIfAnalysisResponse, AWSError>;
  /**
   * A what-if forecast is a forecast that is created from a modified version of the baseline forecast. Each what-if forecast incorporates either a replacement dataset or a set of transformations to the original dataset. 
   */
  createWhatIfForecast(params: ForecastService.Types.CreateWhatIfForecastRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateWhatIfForecastResponse) => void): Request<ForecastService.Types.CreateWhatIfForecastResponse, AWSError>;
  /**
   * A what-if forecast is a forecast that is created from a modified version of the baseline forecast. Each what-if forecast incorporates either a replacement dataset or a set of transformations to the original dataset. 
   */
  createWhatIfForecast(callback?: (err: AWSError, data: ForecastService.Types.CreateWhatIfForecastResponse) => void): Request<ForecastService.Types.CreateWhatIfForecastResponse, AWSError>;
  /**
   * Exports a forecast created by the CreateWhatIfForecast operation to your Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions:  ≈&lt;ForecastExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt;  The &lt;ExportTimestamp&gt; component is in Java SimpleDateFormat (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles. For more information, see howitworks-forecast. To get a list of all your what-if forecast export jobs, use the ListWhatIfForecastExports operation.  The Status of the forecast export job must be ACTIVE before you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeWhatIfForecastExport operation. 
   */
  createWhatIfForecastExport(params: ForecastService.Types.CreateWhatIfForecastExportRequest, callback?: (err: AWSError, data: ForecastService.Types.CreateWhatIfForecastExportResponse) => void): Request<ForecastService.Types.CreateWhatIfForecastExportResponse, AWSError>;
  /**
   * Exports a forecast created by the CreateWhatIfForecast operation to your Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions:  ≈&lt;ForecastExportJobName&gt;_&lt;ExportTimestamp&gt;_&lt;PartNumber&gt;  The &lt;ExportTimestamp&gt; component is in Java SimpleDateFormat (yyyy-MM-ddTHH-mm-ssZ). You must specify a DataDestination object that includes an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see aws-forecast-iam-roles. For more information, see howitworks-forecast. To get a list of all your what-if forecast export jobs, use the ListWhatIfForecastExports operation.  The Status of the forecast export job must be ACTIVE before you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeWhatIfForecastExport operation. 
   */
  createWhatIfForecastExport(callback?: (err: AWSError, data: ForecastService.Types.CreateWhatIfForecastExportResponse) => void): Request<ForecastService.Types.CreateWhatIfForecastExportResponse, AWSError>;
  /**
   * Deletes an Amazon Forecast dataset that was created using the CreateDataset operation. You can only delete datasets that have a status of ACTIVE or CREATE_FAILED. To get the status use the DescribeDataset operation.  Forecast does not automatically update any dataset groups that contain the deleted dataset. In order to update the dataset group, use the UpdateDatasetGroup operation, omitting the deleted dataset's ARN. 
   */
  deleteDataset(params: ForecastService.Types.DeleteDatasetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon Forecast dataset that was created using the CreateDataset operation. You can only delete datasets that have a status of ACTIVE or CREATE_FAILED. To get the status use the DescribeDataset operation.  Forecast does not automatically update any dataset groups that contain the deleted dataset. In order to update the dataset group, use the UpdateDatasetGroup operation, omitting the deleted dataset's ARN. 
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
   * Deletes an Explainability resource. You can delete only predictor that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeExplainability operation.
   */
  deleteExplainability(params: ForecastService.Types.DeleteExplainabilityRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Explainability resource. You can delete only predictor that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeExplainability operation.
   */
  deleteExplainability(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Explainability export.
   */
  deleteExplainabilityExport(params: ForecastService.Types.DeleteExplainabilityExportRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Explainability export.
   */
  deleteExplainabilityExport(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
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
   * Deletes a monitor resource. You can only delete a monitor resource with a status of ACTIVE, ACTIVE_STOPPED, CREATE_FAILED, or CREATE_STOPPED.
   */
  deleteMonitor(params: ForecastService.Types.DeleteMonitorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a monitor resource. You can only delete a monitor resource with a status of ACTIVE, ACTIVE_STOPPED, CREATE_FAILED, or CREATE_STOPPED.
   */
  deleteMonitor(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a predictor created using the DescribePredictor or CreatePredictor operations. You can delete only predictor that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribePredictor operation.
   */
  deletePredictor(params: ForecastService.Types.DeletePredictorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a predictor created using the DescribePredictor or CreatePredictor operations. You can delete only predictor that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribePredictor operation.
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
   * Deletes a what-if analysis created using the CreateWhatIfAnalysis operation. You can delete only what-if analyses that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeWhatIfAnalysis operation.  You can't delete a what-if analysis while any of its forecasts are being exported.
   */
  deleteWhatIfAnalysis(params: ForecastService.Types.DeleteWhatIfAnalysisRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a what-if analysis created using the CreateWhatIfAnalysis operation. You can delete only what-if analyses that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeWhatIfAnalysis operation.  You can't delete a what-if analysis while any of its forecasts are being exported.
   */
  deleteWhatIfAnalysis(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a what-if forecast created using the CreateWhatIfForecast operation. You can delete only what-if forecasts that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeWhatIfForecast operation.  You can't delete a what-if forecast while it is being exported. After a what-if forecast is deleted, you can no longer query the what-if analysis.
   */
  deleteWhatIfForecast(params: ForecastService.Types.DeleteWhatIfForecastRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a what-if forecast created using the CreateWhatIfForecast operation. You can delete only what-if forecasts that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeWhatIfForecast operation.  You can't delete a what-if forecast while it is being exported. After a what-if forecast is deleted, you can no longer query the what-if analysis.
   */
  deleteWhatIfForecast(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a what-if forecast export created using the CreateWhatIfForecastExport operation. You can delete only what-if forecast exports that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeWhatIfForecastExport operation. 
   */
  deleteWhatIfForecastExport(params: ForecastService.Types.DeleteWhatIfForecastExportRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a what-if forecast export created using the CreateWhatIfForecastExport operation. You can delete only what-if forecast exports that have a status of ACTIVE or CREATE_FAILED. To get the status, use the DescribeWhatIfForecastExport operation. 
   */
  deleteWhatIfForecastExport(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes a predictor created using the CreateAutoPredictor operation.
   */
  describeAutoPredictor(params: ForecastService.Types.DescribeAutoPredictorRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeAutoPredictorResponse) => void): Request<ForecastService.Types.DescribeAutoPredictorResponse, AWSError>;
  /**
   * Describes a predictor created using the CreateAutoPredictor operation.
   */
  describeAutoPredictor(callback?: (err: AWSError, data: ForecastService.Types.DescribeAutoPredictorResponse) => void): Request<ForecastService.Types.DescribeAutoPredictorResponse, AWSError>;
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
   * Describes an Explainability resource created using the CreateExplainability operation.
   */
  describeExplainability(params: ForecastService.Types.DescribeExplainabilityRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeExplainabilityResponse) => void): Request<ForecastService.Types.DescribeExplainabilityResponse, AWSError>;
  /**
   * Describes an Explainability resource created using the CreateExplainability operation.
   */
  describeExplainability(callback?: (err: AWSError, data: ForecastService.Types.DescribeExplainabilityResponse) => void): Request<ForecastService.Types.DescribeExplainabilityResponse, AWSError>;
  /**
   * Describes an Explainability export created using the CreateExplainabilityExport operation.
   */
  describeExplainabilityExport(params: ForecastService.Types.DescribeExplainabilityExportRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeExplainabilityExportResponse) => void): Request<ForecastService.Types.DescribeExplainabilityExportResponse, AWSError>;
  /**
   * Describes an Explainability export created using the CreateExplainabilityExport operation.
   */
  describeExplainabilityExport(callback?: (err: AWSError, data: ForecastService.Types.DescribeExplainabilityExportResponse) => void): Request<ForecastService.Types.DescribeExplainabilityExportResponse, AWSError>;
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
   * Describes a monitor resource. In addition to listing the properties provided in the CreateMonitor request, this operation lists the following properties:    Baseline     CreationTime     LastEvaluationTime     LastEvaluationState     LastModificationTime     Message     Status   
   */
  describeMonitor(params: ForecastService.Types.DescribeMonitorRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeMonitorResponse) => void): Request<ForecastService.Types.DescribeMonitorResponse, AWSError>;
  /**
   * Describes a monitor resource. In addition to listing the properties provided in the CreateMonitor request, this operation lists the following properties:    Baseline     CreationTime     LastEvaluationTime     LastEvaluationState     LastModificationTime     Message     Status   
   */
  describeMonitor(callback?: (err: AWSError, data: ForecastService.Types.DescribeMonitorResponse) => void): Request<ForecastService.Types.DescribeMonitorResponse, AWSError>;
  /**
   *   This operation is only valid for legacy predictors created with CreatePredictor. If you are not using a legacy predictor, use DescribeAutoPredictor.  Describes a predictor created using the CreatePredictor operation. In addition to listing the properties provided in the CreatePredictor request, this operation lists the following properties:    DatasetImportJobArns - The dataset import jobs used to import training data.    AutoMLAlgorithmArns - If AutoML is performed, the algorithms that were evaluated.    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
   */
  describePredictor(params: ForecastService.Types.DescribePredictorRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribePredictorResponse) => void): Request<ForecastService.Types.DescribePredictorResponse, AWSError>;
  /**
   *   This operation is only valid for legacy predictors created with CreatePredictor. If you are not using a legacy predictor, use DescribeAutoPredictor.  Describes a predictor created using the CreatePredictor operation. In addition to listing the properties provided in the CreatePredictor request, this operation lists the following properties:    DatasetImportJobArns - The dataset import jobs used to import training data.    AutoMLAlgorithmArns - If AutoML is performed, the algorithms that were evaluated.    CreationTime     LastModificationTime     Status     Message - If an error occurred, information about the error.  
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
   * Describes the what-if analysis created using the CreateWhatIfAnalysis operation. In addition to listing the properties provided in the CreateWhatIfAnalysis request, this operation lists the following properties:    CreationTime     LastModificationTime     Message - If an error occurred, information about the error.    Status   
   */
  describeWhatIfAnalysis(params: ForecastService.Types.DescribeWhatIfAnalysisRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeWhatIfAnalysisResponse) => void): Request<ForecastService.Types.DescribeWhatIfAnalysisResponse, AWSError>;
  /**
   * Describes the what-if analysis created using the CreateWhatIfAnalysis operation. In addition to listing the properties provided in the CreateWhatIfAnalysis request, this operation lists the following properties:    CreationTime     LastModificationTime     Message - If an error occurred, information about the error.    Status   
   */
  describeWhatIfAnalysis(callback?: (err: AWSError, data: ForecastService.Types.DescribeWhatIfAnalysisResponse) => void): Request<ForecastService.Types.DescribeWhatIfAnalysisResponse, AWSError>;
  /**
   * Describes the what-if forecast created using the CreateWhatIfForecast operation. In addition to listing the properties provided in the CreateWhatIfForecast request, this operation lists the following properties:    CreationTime     LastModificationTime     Message - If an error occurred, information about the error.    Status   
   */
  describeWhatIfForecast(params: ForecastService.Types.DescribeWhatIfForecastRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeWhatIfForecastResponse) => void): Request<ForecastService.Types.DescribeWhatIfForecastResponse, AWSError>;
  /**
   * Describes the what-if forecast created using the CreateWhatIfForecast operation. In addition to listing the properties provided in the CreateWhatIfForecast request, this operation lists the following properties:    CreationTime     LastModificationTime     Message - If an error occurred, information about the error.    Status   
   */
  describeWhatIfForecast(callback?: (err: AWSError, data: ForecastService.Types.DescribeWhatIfForecastResponse) => void): Request<ForecastService.Types.DescribeWhatIfForecastResponse, AWSError>;
  /**
   * Describes the what-if forecast export created using the CreateWhatIfForecastExport operation. In addition to listing the properties provided in the CreateWhatIfForecastExport request, this operation lists the following properties:    CreationTime     LastModificationTime     Message - If an error occurred, information about the error.    Status   
   */
  describeWhatIfForecastExport(params: ForecastService.Types.DescribeWhatIfForecastExportRequest, callback?: (err: AWSError, data: ForecastService.Types.DescribeWhatIfForecastExportResponse) => void): Request<ForecastService.Types.DescribeWhatIfForecastExportResponse, AWSError>;
  /**
   * Describes the what-if forecast export created using the CreateWhatIfForecastExport operation. In addition to listing the properties provided in the CreateWhatIfForecastExport request, this operation lists the following properties:    CreationTime     LastModificationTime     Message - If an error occurred, information about the error.    Status   
   */
  describeWhatIfForecastExport(callback?: (err: AWSError, data: ForecastService.Types.DescribeWhatIfForecastExportResponse) => void): Request<ForecastService.Types.DescribeWhatIfForecastExportResponse, AWSError>;
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
   * Returns a list of Explainability resources created using the CreateExplainability operation. This operation returns a summary for each Explainability. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular Explainability resource, use the ARN with the DescribeExplainability operation.
   */
  listExplainabilities(params: ForecastService.Types.ListExplainabilitiesRequest, callback?: (err: AWSError, data: ForecastService.Types.ListExplainabilitiesResponse) => void): Request<ForecastService.Types.ListExplainabilitiesResponse, AWSError>;
  /**
   * Returns a list of Explainability resources created using the CreateExplainability operation. This operation returns a summary for each Explainability. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular Explainability resource, use the ARN with the DescribeExplainability operation.
   */
  listExplainabilities(callback?: (err: AWSError, data: ForecastService.Types.ListExplainabilitiesResponse) => void): Request<ForecastService.Types.ListExplainabilitiesResponse, AWSError>;
  /**
   * Returns a list of Explainability exports created using the CreateExplainabilityExport operation. This operation returns a summary for each Explainability export. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular Explainability export, use the ARN with the DescribeExplainability operation.
   */
  listExplainabilityExports(params: ForecastService.Types.ListExplainabilityExportsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListExplainabilityExportsResponse) => void): Request<ForecastService.Types.ListExplainabilityExportsResponse, AWSError>;
  /**
   * Returns a list of Explainability exports created using the CreateExplainabilityExport operation. This operation returns a summary for each Explainability export. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular Explainability export, use the ARN with the DescribeExplainability operation.
   */
  listExplainabilityExports(callback?: (err: AWSError, data: ForecastService.Types.ListExplainabilityExportsResponse) => void): Request<ForecastService.Types.ListExplainabilityExportsResponse, AWSError>;
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
   * Returns a list of the monitoring evaluation results and predictor events collected by the monitor resource during different windows of time. For information about monitoring see predictor-monitoring. For more information about retrieving monitoring results see Viewing Monitoring Results.
   */
  listMonitorEvaluations(params: ForecastService.Types.ListMonitorEvaluationsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListMonitorEvaluationsResponse) => void): Request<ForecastService.Types.ListMonitorEvaluationsResponse, AWSError>;
  /**
   * Returns a list of the monitoring evaluation results and predictor events collected by the monitor resource during different windows of time. For information about monitoring see predictor-monitoring. For more information about retrieving monitoring results see Viewing Monitoring Results.
   */
  listMonitorEvaluations(callback?: (err: AWSError, data: ForecastService.Types.ListMonitorEvaluationsResponse) => void): Request<ForecastService.Types.ListMonitorEvaluationsResponse, AWSError>;
  /**
   * Returns a list of monitors created with the CreateMonitor operation and CreateAutoPredictor operation. For each monitor resource, this operation returns of a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve a complete set of properties of a monitor resource by specify the monitor's ARN in the DescribeMonitor operation.
   */
  listMonitors(params: ForecastService.Types.ListMonitorsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListMonitorsResponse) => void): Request<ForecastService.Types.ListMonitorsResponse, AWSError>;
  /**
   * Returns a list of monitors created with the CreateMonitor operation and CreateAutoPredictor operation. For each monitor resource, this operation returns of a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve a complete set of properties of a monitor resource by specify the monitor's ARN in the DescribeMonitor operation.
   */
  listMonitors(callback?: (err: AWSError, data: ForecastService.Types.ListMonitorsResponse) => void): Request<ForecastService.Types.ListMonitorsResponse, AWSError>;
  /**
   * Returns a list of predictor backtest export jobs created using the CreatePredictorBacktestExportJob operation. This operation returns a summary for each backtest export job. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular backtest export job, use the ARN with the DescribePredictorBacktestExportJob operation.
   */
  listPredictorBacktestExportJobs(params: ForecastService.Types.ListPredictorBacktestExportJobsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListPredictorBacktestExportJobsResponse) => void): Request<ForecastService.Types.ListPredictorBacktestExportJobsResponse, AWSError>;
  /**
   * Returns a list of predictor backtest export jobs created using the CreatePredictorBacktestExportJob operation. This operation returns a summary for each backtest export job. You can filter the list using an array of Filter objects. To retrieve the complete set of properties for a particular backtest export job, use the ARN with the DescribePredictorBacktestExportJob operation.
   */
  listPredictorBacktestExportJobs(callback?: (err: AWSError, data: ForecastService.Types.ListPredictorBacktestExportJobsResponse) => void): Request<ForecastService.Types.ListPredictorBacktestExportJobsResponse, AWSError>;
  /**
   * Returns a list of predictors created using the CreateAutoPredictor or CreatePredictor operations. For each predictor, this operation returns a summary of its properties, including its Amazon Resource Name (ARN).  You can retrieve the complete set of properties by using the ARN with the DescribeAutoPredictor and DescribePredictor operations. You can filter the list using an array of Filter objects.
   */
  listPredictors(params: ForecastService.Types.ListPredictorsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListPredictorsResponse) => void): Request<ForecastService.Types.ListPredictorsResponse, AWSError>;
  /**
   * Returns a list of predictors created using the CreateAutoPredictor or CreatePredictor operations. For each predictor, this operation returns a summary of its properties, including its Amazon Resource Name (ARN).  You can retrieve the complete set of properties by using the ARN with the DescribeAutoPredictor and DescribePredictor operations. You can filter the list using an array of Filter objects.
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
   * Returns a list of what-if analyses created using the CreateWhatIfAnalysis operation. For each what-if analysis, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if analysis ARN with the DescribeWhatIfAnalysis operation.
   */
  listWhatIfAnalyses(params: ForecastService.Types.ListWhatIfAnalysesRequest, callback?: (err: AWSError, data: ForecastService.Types.ListWhatIfAnalysesResponse) => void): Request<ForecastService.Types.ListWhatIfAnalysesResponse, AWSError>;
  /**
   * Returns a list of what-if analyses created using the CreateWhatIfAnalysis operation. For each what-if analysis, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if analysis ARN with the DescribeWhatIfAnalysis operation.
   */
  listWhatIfAnalyses(callback?: (err: AWSError, data: ForecastService.Types.ListWhatIfAnalysesResponse) => void): Request<ForecastService.Types.ListWhatIfAnalysesResponse, AWSError>;
  /**
   * Returns a list of what-if forecast exports created using the CreateWhatIfForecastExport operation. For each what-if forecast export, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast export ARN with the DescribeWhatIfForecastExport operation.
   */
  listWhatIfForecastExports(params: ForecastService.Types.ListWhatIfForecastExportsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListWhatIfForecastExportsResponse) => void): Request<ForecastService.Types.ListWhatIfForecastExportsResponse, AWSError>;
  /**
   * Returns a list of what-if forecast exports created using the CreateWhatIfForecastExport operation. For each what-if forecast export, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast export ARN with the DescribeWhatIfForecastExport operation.
   */
  listWhatIfForecastExports(callback?: (err: AWSError, data: ForecastService.Types.ListWhatIfForecastExportsResponse) => void): Request<ForecastService.Types.ListWhatIfForecastExportsResponse, AWSError>;
  /**
   * Returns a list of what-if forecasts created using the CreateWhatIfForecast operation. For each what-if forecast, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast ARN with the DescribeWhatIfForecast operation.
   */
  listWhatIfForecasts(params: ForecastService.Types.ListWhatIfForecastsRequest, callback?: (err: AWSError, data: ForecastService.Types.ListWhatIfForecastsResponse) => void): Request<ForecastService.Types.ListWhatIfForecastsResponse, AWSError>;
  /**
   * Returns a list of what-if forecasts created using the CreateWhatIfForecast operation. For each what-if forecast, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast ARN with the DescribeWhatIfForecast operation.
   */
  listWhatIfForecasts(callback?: (err: AWSError, data: ForecastService.Types.ListWhatIfForecastsResponse) => void): Request<ForecastService.Types.ListWhatIfForecastsResponse, AWSError>;
  /**
   * Resumes a stopped monitor resource.
   */
  resumeResource(params: ForecastService.Types.ResumeResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Resumes a stopped monitor resource.
   */
  resumeResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a resource. The resource undergoes the following states: CREATE_STOPPING and CREATE_STOPPED. You cannot resume a resource once it has been stopped. This operation can be applied to the following resources (and their corresponding child resources):   Dataset Import Job   Predictor Job   Forecast Job   Forecast Export Job   Predictor Backtest Export Job   Explainability Job   Explainability Export Job  
   */
  stopResource(params: ForecastService.Types.StopResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a resource. The resource undergoes the following states: CREATE_STOPPING and CREATE_STOPPED. You cannot resume a resource once it has been stopped. This operation can be applied to the following resources (and their corresponding child resources):   Dataset Import Job   Predictor Job   Forecast Job   Forecast Export Job   Predictor Backtest Export Job   Explainability Job   Explainability Export Job  
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
  export interface Action {
    /**
     * The related time series that you are modifying. This value is case insensitive.
     */
    AttributeName: Name;
    /**
     * The operation that is applied to the provided attribute. Operations include:    ADD - adds Value to all rows of AttributeName.    SUBTRACT - subtracts Value from all rows of AttributeName.    MULTIPLY - multiplies all rows of AttributeName by Value.    DIVIDE - divides all rows of AttributeName by Value.  
     */
    Operation: Operation;
    /**
     * The value that is applied for the chosen Operation.
     */
    Value: Double;
  }
  export interface AdditionalDataset {
    /**
     * The name of the additional dataset. Valid names: "holiday" and "weather".
     */
    Name: Name;
    /**
     *  Weather Index  To enable the Weather Index, do not specify a value for Configuration.  Holidays   Holidays  To enable Holidays, set CountryCode to one of the following two-letter country codes:   "AL" - ALBANIA   "AR" - ARGENTINA   "AT" - AUSTRIA   "AU" - AUSTRALIA   "BA" - BOSNIA HERZEGOVINA   "BE" - BELGIUM   "BG" - BULGARIA   "BO" - BOLIVIA   "BR" - BRAZIL   "BY" - BELARUS   "CA" - CANADA   "CL" - CHILE   "CO" - COLOMBIA   "CR" - COSTA RICA   "HR" - CROATIA   "CZ" - CZECH REPUBLIC   "DK" - DENMARK   "EC" - ECUADOR   "EE" - ESTONIA   "ET" - ETHIOPIA   "FI" - FINLAND   "FR" - FRANCE   "DE" - GERMANY   "GR" - GREECE   "HU" - HUNGARY   "IS" - ICELAND   "IN" - INDIA   "IE" - IRELAND   "IT" - ITALY   "JP" - JAPAN   "KZ" - KAZAKHSTAN   "KR" - KOREA   "LV" - LATVIA   "LI" - LIECHTENSTEIN   "LT" - LITHUANIA   "LU" - LUXEMBOURG   "MK" - MACEDONIA   "MT" - MALTA   "MX" - MEXICO   "MD" - MOLDOVA   "ME" - MONTENEGRO   "NL" - NETHERLANDS   "NZ" - NEW ZEALAND   "NI" - NICARAGUA   "NG" - NIGERIA   "NO" - NORWAY   "PA" - PANAMA   "PY" - PARAGUAY   "PE" - PERU   "PL" - POLAND   "PT" - PORTUGAL   "RO" - ROMANIA   "RU" - RUSSIA   "RS" - SERBIA   "SK" - SLOVAKIA   "SI" - SLOVENIA   "ZA" - SOUTH AFRICA   "ES" - SPAIN   "SE" - SWEDEN   "CH" - SWITZERLAND   "UA" - UKRAINE   "AE" - UNITED ARAB EMIRATES   "US" - UNITED STATES   "UK" - UNITED KINGDOM   "UY" - URUGUAY   "VE" - VENEZUELA  
     */
    Configuration?: Configuration;
  }
  export type AdditionalDatasets = AdditionalDataset[];
  export type Arn = string;
  export type ArnList = Arn[];
  export interface AttributeConfig {
    /**
     * The name of the attribute as specified in the schema. Amazon Forecast supports the target field of the target time series and the related time series datasets. For example, for the RETAIL domain, the target is demand.
     */
    AttributeName: Name;
    /**
     * The method parameters (key-value pairs), which are a map of override parameters. Specify these parameters to override the default values. Related Time Series attributes do not accept aggregation parameters. The following list shows the parameters and their valid values for the "filling" featurization method for a Target Time Series dataset. Default values are bolded.    aggregation: sum, avg, first, min, max     frontfill: none     middlefill: zero, nan (not a number), value, median, mean, min, max     backfill: zero, nan, value, median, mean, min, max    The following list shows the parameters and their valid values for a Related Time Series featurization method (there are no defaults):    middlefill: zero, value, median, mean, min, max     backfill: zero, value, median, mean, min, max     futurefill: zero, value, median, mean, min, max    To set a filling method to a specific value, set the fill parameter to value and define the value in a corresponding _value parameter. For example, to set backfilling to a value of 2, include the following: "backfill": "value" and "backfill_value":"2". 
     */
    Transformations: Transformations;
  }
  export type AttributeConfigs = AttributeConfig[];
  export type AttributeType = "string"|"integer"|"float"|"timestamp"|"geolocation"|string;
  export type AttributeValue = string;
  export type AutoMLOverrideStrategy = "LatencyOptimized"|"AccuracyOptimized"|string;
  export interface Baseline {
    /**
     * The initial accuracy metrics for the predictor you are monitoring. Use these metrics as a baseline for comparison purposes as you use your predictor and the metrics change.
     */
    PredictorBaseline?: PredictorBaseline;
  }
  export interface BaselineMetric {
    /**
     * The name of the metric.
     */
    Name?: Name;
    /**
     * The value for the metric.
     */
    Value?: Double;
  }
  export type BaselineMetrics = BaselineMetric[];
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
  export type Condition = "EQUALS"|"NOT_EQUALS"|"LESS_THAN"|"GREATER_THAN"|string;
  export type Configuration = {[key: string]: Values};
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
  export interface CreateAutoPredictorRequest {
    /**
     * A unique name for the predictor
     */
    PredictorName: Name;
    /**
     * The number of time-steps that the model predicts. The forecast horizon is also called the prediction length. The maximum forecast horizon is the lesser of 500 time-steps or 1/4 of the TARGET_TIME_SERIES dataset length. If you are retraining an existing AutoPredictor, then the maximum forecast horizon is the lesser of 500 time-steps or 1/3 of the TARGET_TIME_SERIES dataset length. If you are upgrading to an AutoPredictor or retraining an existing AutoPredictor, you cannot update the forecast horizon parameter. You can meet this requirement by providing longer time-series in the dataset.
     */
    ForecastHorizon?: Integer;
    /**
     * The forecast types used to train a predictor. You can specify up to five forecast types. Forecast types can be quantiles from 0.01 to 0.99, by increments of 0.01 or higher. You can also specify the mean forecast with mean.
     */
    ForecastTypes?: ForecastTypes;
    /**
     * An array of dimension (field) names that specify how to group the generated forecast. For example, if you are generating forecasts for item sales across all your stores, and your dataset contains a store_id field, you would specify store_id as a dimension to group sales forecasts for each store.
     */
    ForecastDimensions?: ForecastDimensions;
    /**
     * The frequency of predictions in a forecast. Valid intervals are an integer followed by Y (Year), M (Month), W (Week), D (Day), H (Hour), and min (Minute). For example, "1D" indicates every day and "15min" indicates every 15 minutes. You cannot specify a value that would overlap with the next larger frequency. That means, for example, you cannot specify a frequency of 60 minutes, because that is equivalent to 1 hour. The valid values for each frequency are the following:   Minute - 1-59   Hour - 1-23   Day - 1-6   Week - 1-4   Month - 1-11   Year - 1   Thus, if you want every other week forecasts, specify "2W". Or, if you want quarterly forecasts, you specify "3M". The frequency must be greater than or equal to the TARGET_TIME_SERIES dataset frequency. When a RELATED_TIME_SERIES dataset is provided, the frequency must be equal to the RELATED_TIME_SERIES dataset frequency.
     */
    ForecastFrequency?: Frequency;
    /**
     * The data configuration for your dataset group and any additional datasets.
     */
    DataConfig?: DataConfig;
    EncryptionConfig?: EncryptionConfig;
    /**
     * The ARN of the predictor to retrain or upgrade. This parameter is only used when retraining or upgrading a predictor. When creating a new predictor, do not specify a value for this parameter. When upgrading or retraining a predictor, only specify values for the ReferencePredictorArn and PredictorName. The value for PredictorName must be a unique predictor name.
     */
    ReferencePredictorArn?: Arn;
    /**
     * The accuracy metric used to optimize the predictor.
     */
    OptimizationMetric?: OptimizationMetric;
    /**
     * Create an Explainability resource for the predictor.
     */
    ExplainPredictor?: Boolean;
    /**
     * Optional metadata to help you categorize and organize your predictors. Each tag consists of a key and an optional value, both of which you define. Tag keys and values are case sensitive. The following restrictions apply to tags:   For each resource, each tag key must be unique and each tag key must have one value.   Maximum number of tags per resource: 50.   Maximum key length: 128 Unicode characters in UTF-8.   Maximum value length: 256 Unicode characters in UTF-8.   Accepted characters: all letters and numbers, spaces representable in UTF-8, and + - = . _ : / @. If your tagging schema is used across other services and resources, the character restrictions of those services also apply.    Key prefixes cannot include any upper or lowercase combination of aws: or AWS:. Values can have this prefix. If a tag value has aws as its prefix but the key does not, Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit. You cannot edit or delete tag keys with this prefix.  
     */
    Tags?: Tags;
    /**
     * The configuration details for predictor monitoring. Provide a name for the monitor resource to enable predictor monitoring. Predictor monitoring allows you to see how your predictor's performance changes over time. For more information, see Predictor Monitoring.
     */
    MonitorConfig?: MonitorConfig;
    /**
     * The time boundary Forecast uses to align and aggregate any data that doesn't align with your forecast frequency. Provide the unit of time and the time boundary as a key value pair. For more information on specifying a time boundary, see Specifying a Time Boundary. If you don't provide a time boundary, Forecast uses a set of Default Time Boundaries.
     */
    TimeAlignmentBoundary?: TimeAlignmentBoundary;
  }
  export interface CreateAutoPredictorResponse {
    /**
     * The Amazon Resource Name (ARN) of the predictor.
     */
    PredictorArn?: Arn;
  }
  export interface CreateDatasetGroupRequest {
    /**
     * A name for the dataset group.
     */
    DatasetGroupName: Name;
    /**
     * The domain associated with the dataset group. When you add a dataset to a dataset group, this value and the value specified for the Domain parameter of the CreateDataset operation must match. The Domain and DatasetType that you choose determine the fields that must be present in training data that you import to a dataset. For example, if you choose the RETAIL domain and TARGET_TIME_SERIES as the DatasetType, Amazon Forecast requires that item_id, timestamp, and demand fields are present in your data. For more information, see Dataset groups.
     */
    Domain: Domain;
    /**
     * An array of Amazon Resource Names (ARNs) of the datasets that you want to include in the dataset group.
     */
    DatasetArns?: ArnList;
    /**
     * The optional metadata that you apply to the dataset group to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
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
     * The location of the training data to import and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data. The training data must be stored in an Amazon S3 bucket. If encryption is used, DataSource must include an Key Management Service (KMS) key and the IAM role must allow Amazon Forecast permission to access the key. The KMS key and IAM role must match those specified in the EncryptionConfig parameter of the CreateDataset operation.
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
     * The optional metadata that you apply to the dataset import job to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
    /**
     * The format of the imported data, CSV or PARQUET. The default value is CSV.
     */
    Format?: Format;
    /**
     * Specifies whether the dataset import job is a FULL or INCREMENTAL import. A FULL dataset import replaces all of the existing data with the newly imported data. An INCREMENTAL import appends the imported data to the existing data.
     */
    ImportMode?: ImportMode;
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
     * The domain associated with the dataset. When you add a dataset to a dataset group, this value and the value specified for the Domain parameter of the CreateDatasetGroup operation must match. The Domain and DatasetType that you choose determine the fields that must be present in the training data that you import to the dataset. For example, if you choose the RETAIL domain and TARGET_TIME_SERIES as the DatasetType, Amazon Forecast requires item_id, timestamp, and demand fields to be present in your data. For more information, see Importing datasets.
     */
    Domain: Domain;
    /**
     * The dataset type. Valid values depend on the chosen Domain.
     */
    DatasetType: DatasetType;
    /**
     * The frequency of data collection. This parameter is required for RELATED_TIME_SERIES datasets. Valid intervals are an integer followed by Y (Year), M (Month), W (Week), D (Day), H (Hour), and min (Minute). For example, "1D" indicates every day and "15min" indicates every 15 minutes. You cannot specify a value that would overlap with the next larger frequency. That means, for example, you cannot specify a frequency of 60 minutes, because that is equivalent to 1 hour. The valid values for each frequency are the following:   Minute - 1-59   Hour - 1-23   Day - 1-6   Week - 1-4   Month - 1-11   Year - 1   Thus, if you want every other week forecasts, specify "2W". Or, if you want quarterly forecasts, you specify "3M".
     */
    DataFrequency?: Frequency;
    /**
     * The schema for the dataset. The schema attributes and their order must match the fields in your data. The dataset Domain and DatasetType that you choose determine the minimum required fields in your training data. For information about the required fields for a specific dataset domain and type, see Dataset Domains and Dataset Types.
     */
    Schema: Schema;
    /**
     * An Key Management Service (KMS) key and the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     */
    EncryptionConfig?: EncryptionConfig;
    /**
     * The optional metadata that you apply to the dataset to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
  }
  export interface CreateDatasetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DatasetArn?: Arn;
  }
  export interface CreateExplainabilityExportRequest {
    /**
     * A unique name for the Explainability export.
     */
    ExplainabilityExportName: Name;
    /**
     * The Amazon Resource Name (ARN) of the Explainability to export.
     */
    ExplainabilityArn: Arn;
    Destination: DataDestination;
    /**
     * Optional metadata to help you categorize and organize your resources. Each tag consists of a key and an optional value, both of which you define. Tag keys and values are case sensitive. The following restrictions apply to tags:   For each resource, each tag key must be unique and each tag key must have one value.   Maximum number of tags per resource: 50.   Maximum key length: 128 Unicode characters in UTF-8.   Maximum value length: 256 Unicode characters in UTF-8.   Accepted characters: all letters and numbers, spaces representable in UTF-8, and + - = . _ : / @. If your tagging schema is used across other services and resources, the character restrictions of those services also apply.    Key prefixes cannot include any upper or lowercase combination of aws: or AWS:. Values can have this prefix. If a tag value has aws as its prefix but the key does not, Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit. You cannot edit or delete tag keys with this prefix.  
     */
    Tags?: Tags;
    /**
     * The format of the exported data, CSV or PARQUET.
     */
    Format?: Format;
  }
  export interface CreateExplainabilityExportResponse {
    /**
     * The Amazon Resource Name (ARN) of the export.
     */
    ExplainabilityExportArn?: Arn;
  }
  export interface CreateExplainabilityRequest {
    /**
     * A unique name for the Explainability.
     */
    ExplainabilityName: Name;
    /**
     * The Amazon Resource Name (ARN) of the Predictor or Forecast used to create the Explainability.
     */
    ResourceArn: Arn;
    /**
     * The configuration settings that define the granularity of time series and time points for the Explainability.
     */
    ExplainabilityConfig: ExplainabilityConfig;
    DataSource?: DataSource;
    Schema?: Schema;
    /**
     * Create an Explainability visualization that is viewable within the Amazon Web Services console.
     */
    EnableVisualization?: Boolean;
    /**
     * If TimePointGranularity is set to SPECIFIC, define the first point for the Explainability. Use the following timestamp format: yyyy-MM-ddTHH:mm:ss (example: 2015-01-01T20:00:00)
     */
    StartDateTime?: LocalDateTime;
    /**
     * If TimePointGranularity is set to SPECIFIC, define the last time point for the Explainability. Use the following timestamp format: yyyy-MM-ddTHH:mm:ss (example: 2015-01-01T20:00:00)
     */
    EndDateTime?: LocalDateTime;
    /**
     * Optional metadata to help you categorize and organize your resources. Each tag consists of a key and an optional value, both of which you define. Tag keys and values are case sensitive. The following restrictions apply to tags:   For each resource, each tag key must be unique and each tag key must have one value.   Maximum number of tags per resource: 50.   Maximum key length: 128 Unicode characters in UTF-8.   Maximum value length: 256 Unicode characters in UTF-8.   Accepted characters: all letters and numbers, spaces representable in UTF-8, and + - = . _ : / @. If your tagging schema is used across other services and resources, the character restrictions of those services also apply.    Key prefixes cannot include any upper or lowercase combination of aws: or AWS:. Values can have this prefix. If a tag value has aws as its prefix but the key does not, Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit. You cannot edit or delete tag keys with this prefix.  
     */
    Tags?: Tags;
  }
  export interface CreateExplainabilityResponse {
    /**
     * The Amazon Resource Name (ARN) of the Explainability.
     */
    ExplainabilityArn?: Arn;
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
     * The location where you want to save the forecast and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the location. The forecast must be exported to an Amazon S3 bucket. If encryption is used, Destination must include an Key Management Service (KMS) key. The IAM role must allow Amazon Forecast permission to access the key.
     */
    Destination: DataDestination;
    /**
     * The optional metadata that you apply to the forecast export job to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
    /**
     * The format of the exported data, CSV or PARQUET. The default value is CSV.
     */
    Format?: Format;
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
     * The quantiles at which probabilistic forecasts are generated. You can currently specify up to 5 quantiles per forecast. Accepted values include 0.01 to 0.99 (increments of .01 only) and mean. The mean forecast is different from the median (0.50) when the distribution is not symmetric (for example, Beta and Negative Binomial).  The default quantiles are the quantiles you specified during predictor creation. If you didn't specify quantiles, the default values are ["0.1", "0.5", "0.9"]. 
     */
    ForecastTypes?: ForecastTypes;
    /**
     * The optional metadata that you apply to the forecast to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
     */
    Tags?: Tags;
    /**
     * Defines the set of time series that are used to create the forecasts in a TimeSeriesIdentifiers object. The TimeSeriesIdentifiers object needs the following information:    DataSource     Format     Schema   
     */
    TimeSeriesSelector?: TimeSeriesSelector;
  }
  export interface CreateForecastResponse {
    /**
     * The Amazon Resource Name (ARN) of the forecast.
     */
    ForecastArn?: Arn;
  }
  export interface CreateMonitorRequest {
    /**
     * The name of the monitor resource.
     */
    MonitorName: Name;
    /**
     * The Amazon Resource Name (ARN) of the predictor to monitor.
     */
    ResourceArn: Arn;
    /**
     * A list of tags to apply to the monitor resource.
     */
    Tags?: Tags;
  }
  export interface CreateMonitorResponse {
    /**
     * The Amazon Resource Name (ARN) of the monitor resource.
     */
    MonitorArn?: Arn;
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
    /**
     * The format of the exported data, CSV or PARQUET. The default value is CSV.
     */
    Format?: Format;
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
     *   The LatencyOptimized AutoML override strategy is only available in private beta. Contact Amazon Web Services Support or your account manager to learn more about access privileges.   Used to overide the default AutoML strategy, which is to optimize predictor accuracy. To apply an AutoML strategy that minimizes training time, use LatencyOptimized. This parameter is only valid for predictors trained using AutoML.
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
     * An Key Management Service (KMS) key and the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
     */
    EncryptionConfig?: EncryptionConfig;
    /**
     * The optional metadata that you apply to the predictor to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
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
  export interface CreateWhatIfAnalysisRequest {
    /**
     * The name of the what-if analysis. Each name must be unique.
     */
    WhatIfAnalysisName: Name;
    /**
     * The Amazon Resource Name (ARN) of the baseline forecast.
     */
    ForecastArn: Arn;
    /**
     * Defines the set of time series that are used in the what-if analysis with a TimeSeriesIdentifiers object. What-if analyses are performed only for the time series in this object. The TimeSeriesIdentifiers object needs the following information:    DataSource     Format     Schema   
     */
    TimeSeriesSelector?: TimeSeriesSelector;
    /**
     * A list of tags to apply to the what if forecast.
     */
    Tags?: Tags;
  }
  export interface CreateWhatIfAnalysisResponse {
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis.
     */
    WhatIfAnalysisArn?: Arn;
  }
  export interface CreateWhatIfForecastExportRequest {
    /**
     * The name of the what-if forecast to export.
     */
    WhatIfForecastExportName: Name;
    /**
     * The list of what-if forecast Amazon Resource Names (ARNs) to export.
     */
    WhatIfForecastArns: WhatIfForecastArnListForExport;
    /**
     * The location where you want to save the forecast and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the location. The forecast must be exported to an Amazon S3 bucket. If encryption is used, Destination must include an Key Management Service (KMS) key. The IAM role must allow Amazon Forecast permission to access the key.
     */
    Destination: DataDestination;
    /**
     * A list of tags to apply to the what if forecast.
     */
    Tags?: Tags;
    /**
     * The format of the exported data, CSV or PARQUET.
     */
    Format?: Format;
  }
  export interface CreateWhatIfForecastExportResponse {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast.
     */
    WhatIfForecastExportArn?: LongArn;
  }
  export interface CreateWhatIfForecastRequest {
    /**
     * The name of the what-if forecast. Names must be unique within each what-if analysis.
     */
    WhatIfForecastName: Name;
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis.
     */
    WhatIfAnalysisArn: Arn;
    /**
     * The transformations that are applied to the baseline time series. Each transformation contains an action and a set of conditions. An action is applied only when all conditions are met. If no conditions are provided, the action is applied to all items.
     */
    TimeSeriesTransformations?: TimeSeriesTransformations;
    /**
     * The replacement time series dataset, which contains the rows that you want to change in the related time series dataset. A replacement time series does not need to contain all rows that are in the baseline related time series. Include only the rows (measure-dimension combinations) that you want to include in the what-if forecast. This dataset is merged with the original time series to create a transformed dataset that is used for the what-if analysis. This dataset should contain the items to modify (such as item_id or workforce_type), any relevant dimensions, the timestamp column, and at least one of the related time series columns. This file should not contain duplicate timestamps for the same time series. Timestamps and item_ids not included in this dataset are not included in the what-if analysis. 
     */
    TimeSeriesReplacementsDataSource?: TimeSeriesReplacementsDataSource;
    /**
     * A list of tags to apply to the what if forecast.
     */
    Tags?: Tags;
  }
  export interface CreateWhatIfForecastResponse {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast.
     */
    WhatIfForecastArn?: LongArn;
  }
  export interface DataConfig {
    /**
     * The ARN of the dataset group used to train the predictor.
     */
    DatasetGroupArn: Arn;
    /**
     * Aggregation and filling options for attributes in your dataset group.
     */
    AttributeConfigs?: AttributeConfigs;
    /**
     * Additional built-in datasets like Holidays and the Weather Index.
     */
    AdditionalDatasets?: AdditionalDatasets;
  }
  export interface DataDestination {
    /**
     * The path to an Amazon Simple Storage Service (Amazon S3) bucket along with the credentials to access the bucket.
     */
    S3Config: S3Config;
  }
  export interface DataSource {
    /**
     * The path to the data stored in an Amazon Simple Storage Service (Amazon S3) bucket along with the credentials to access the data.
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
     * The location of the training data to import and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data. The training data must be stored in an Amazon S3 bucket. If encryption is used, DataSource includes an Key Management Service (KMS) key.
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
    /**
     * The import mode of the dataset import job, FULL or INCREMENTAL.
     */
    ImportMode?: ImportMode;
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
  export type DayOfMonth = number;
  export type DayOfWeek = "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY"|string;
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
  export interface DeleteExplainabilityExportRequest {
    /**
     * The Amazon Resource Name (ARN) of the Explainability export to delete. 
     */
    ExplainabilityExportArn: Arn;
  }
  export interface DeleteExplainabilityRequest {
    /**
     * The Amazon Resource Name (ARN) of the Explainability resource to delete.
     */
    ExplainabilityArn: Arn;
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
  export interface DeleteMonitorRequest {
    /**
     * The Amazon Resource Name (ARN) of the monitor resource to delete.
     */
    MonitorArn: Arn;
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
  export interface DeleteWhatIfAnalysisRequest {
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis that you want to delete.
     */
    WhatIfAnalysisArn: Arn;
  }
  export interface DeleteWhatIfForecastExportRequest {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast export that you want to delete.
     */
    WhatIfForecastExportArn: LongArn;
  }
  export interface DeleteWhatIfForecastRequest {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast that you want to delete.
     */
    WhatIfForecastArn: LongArn;
  }
  export interface DescribeAutoPredictorRequest {
    /**
     * The Amazon Resource Name (ARN) of the predictor.
     */
    PredictorArn: Arn;
  }
  export interface DescribeAutoPredictorResponse {
    /**
     * The Amazon Resource Name (ARN) of the predictor
     */
    PredictorArn?: Arn;
    /**
     * The name of the predictor.
     */
    PredictorName?: Name;
    /**
     * The number of time-steps that the model predicts. The forecast horizon is also called the prediction length.
     */
    ForecastHorizon?: Integer;
    /**
     * The forecast types used during predictor training. Default value is ["0.1","0.5","0.9"].
     */
    ForecastTypes?: ForecastTypes;
    /**
     * The frequency of predictions in a forecast. Valid intervals are Y (Year), M (Month), W (Week), D (Day), H (Hour), 30min (30 minutes), 15min (15 minutes), 10min (10 minutes), 5min (5 minutes), and 1min (1 minute). For example, "Y" indicates every year and "5min" indicates every five minutes.
     */
    ForecastFrequency?: Frequency;
    /**
     * An array of dimension (field) names that specify the attributes used to group your time series.
     */
    ForecastDimensions?: ForecastDimensions;
    /**
     * An array of the ARNs of the dataset import jobs used to import training data for the predictor.
     */
    DatasetImportJobArns?: ArnList;
    /**
     * The data configuration for your dataset group and any additional datasets.
     */
    DataConfig?: DataConfig;
    EncryptionConfig?: EncryptionConfig;
    /**
     * The ARN and state of the reference predictor. This parameter is only valid for retrained or upgraded predictors.
     */
    ReferencePredictorSummary?: ReferencePredictorSummary;
    /**
     * The estimated time remaining in minutes for the predictor training job to complete.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * The status of the predictor. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * In the event of an error, a message detailing the cause of the error.
     */
    Message?: Message;
    /**
     * The timestamp of the CreateAutoPredictor request.
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
    /**
     * Provides the status and ARN of the Predictor Explainability.
     */
    ExplainabilityInfo?: ExplainabilityInfo;
    /**
     * A object with the Amazon Resource Name (ARN) and status of the monitor resource.
     */
    MonitorInfo?: MonitorInfo;
    /**
     * The time boundary Forecast uses when aggregating data.
     */
    TimeAlignmentBoundary?: TimeAlignmentBoundary;
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
     * The location of the training data to import and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data. If encryption is used, DataSource includes an Key Management Service (KMS) key.
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
    /**
     * The format of the imported data, CSV or PARQUET.
     */
    Format?: Format;
    /**
     * The import mode of the dataset import job, FULL or INCREMENTAL.
     */
    ImportMode?: ImportMode;
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
     * The Key Management Service (KMS) key and the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
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
  export interface DescribeExplainabilityExportRequest {
    /**
     * The Amazon Resource Name (ARN) of the Explainability export.
     */
    ExplainabilityExportArn: Arn;
  }
  export interface DescribeExplainabilityExportResponse {
    /**
     * The Amazon Resource Name (ARN) of the Explainability export.
     */
    ExplainabilityExportArn?: Arn;
    /**
     * The name of the Explainability export.
     */
    ExplainabilityExportName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the Explainability export.
     */
    ExplainabilityArn?: Arn;
    Destination?: DataDestination;
    /**
     * Information about any errors that occurred during the export.
     */
    Message?: Message;
    /**
     * The status of the Explainability export. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * When the Explainability export was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
    /**
     * The format of the exported data, CSV or PARQUET.
     */
    Format?: Format;
  }
  export interface DescribeExplainabilityRequest {
    /**
     * The Amazon Resource Name (ARN) of the Explaianability to describe.
     */
    ExplainabilityArn: Arn;
  }
  export interface DescribeExplainabilityResponse {
    /**
     * The Amazon Resource Name (ARN) of the Explainability.
     */
    ExplainabilityArn?: Arn;
    /**
     * The name of the Explainability.
     */
    ExplainabilityName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the Predictor or Forecast used to create the Explainability resource.
     */
    ResourceArn?: Arn;
    /**
     * The configuration settings that define the granularity of time series and time points for the Explainability.
     */
    ExplainabilityConfig?: ExplainabilityConfig;
    /**
     * Whether the visualization was enabled for the Explainability resource.
     */
    EnableVisualization?: Boolean;
    DataSource?: DataSource;
    Schema?: Schema;
    /**
     * If TimePointGranularity is set to SPECIFIC, the first time point in the Explainability.
     */
    StartDateTime?: LocalDateTime;
    /**
     * If TimePointGranularity is set to SPECIFIC, the last time point in the Explainability.
     */
    EndDateTime?: LocalDateTime;
    /**
     * The estimated time remaining in minutes for the CreateExplainability job to complete.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * If an error occurred, a message about the error.
     */
    Message?: Message;
    /**
     * The status of the Explainability resource. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * When the Explainability resource was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
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
    /**
     * The format of the exported data, CSV or PARQUET.
     */
    Format?: Format;
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
    /**
     * The time series to include in the forecast.
     */
    TimeSeriesSelector?: TimeSeriesSelector;
  }
  export interface DescribeMonitorRequest {
    /**
     * The Amazon Resource Name (ARN) of the monitor resource to describe.
     */
    MonitorArn: Arn;
  }
  export interface DescribeMonitorResponse {
    /**
     * The name of the monitor.
     */
    MonitorName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the monitor resource described.
     */
    MonitorArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the auto predictor being monitored.
     */
    ResourceArn?: Arn;
    /**
     * The status of the monitor resource.
     */
    Status?: Status;
    /**
     * The timestamp of the latest evaluation completed by the monitor.
     */
    LastEvaluationTime?: Timestamp;
    /**
     * The state of the monitor's latest evaluation.
     */
    LastEvaluationState?: EvaluationState;
    /**
     * Metrics you can use as a baseline for comparison purposes. Use these values you interpret monitoring results for an auto predictor.
     */
    Baseline?: Baseline;
    /**
     * An error message, if any, for the monitor.
     */
    Message?: Message;
    /**
     * The timestamp for when the monitor resource was created.
     */
    CreationTime?: Timestamp;
    /**
     * The timestamp of the latest modification to the monitor.
     */
    LastModificationTime?: Timestamp;
    /**
     * The estimated number of minutes remaining before the monitor resource finishes its current evaluation.
     */
    EstimatedEvaluationTimeRemainingInMinutes?: Long;
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
    /**
     * The format of the exported data, CSV or PARQUET.
     */
    Format?: Format;
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
     * When PerformAutoML is specified, the ARN of the chosen algorithm.
     */
    AutoMLAlgorithmArns?: ArnList;
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
     *   The LatencyOptimized AutoML override strategy is only available in private beta. Contact Amazon Web Services Support or your account manager to learn more about access privileges.   The AutoML strategy used to train the predictor. Unless LatencyOptimized is specified, the AutoML strategy optimizes predictor accuracy. This parameter is only valid for predictors trained using AutoML.
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
     * An Key Management Service (KMS) key and the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the key.
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
     * Whether the predictor was created with CreateAutoPredictor.
     */
    IsAutoPredictor?: Boolean;
    /**
     * An array of the ARNs of the dataset import jobs used to import training data for the predictor.
     */
    DatasetImportJobArns?: ArnList;
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
  export interface DescribeWhatIfAnalysisRequest {
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis that you are interested in.
     */
    WhatIfAnalysisArn: Arn;
  }
  export interface DescribeWhatIfAnalysisResponse {
    /**
     * The name of the what-if analysis.
     */
    WhatIfAnalysisName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis.
     */
    WhatIfAnalysisArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast.
     */
    ForecastArn?: Arn;
    /**
     * The approximate time remaining to complete the what-if analysis, in minutes.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * The status of the what-if analysis. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the what-if analysis must be ACTIVE before you can access the analysis. 
     */
    Status?: String;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the what-if analysis was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
    TimeSeriesSelector?: TimeSeriesSelector;
  }
  export interface DescribeWhatIfForecastExportRequest {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast export that you are interested in.
     */
    WhatIfForecastExportArn: LongArn;
  }
  export interface DescribeWhatIfForecastExportResponse {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast export.
     */
    WhatIfForecastExportArn?: LongArn;
    /**
     * The name of the what-if forecast export.
     */
    WhatIfForecastExportName?: Name;
    /**
     * An array of Amazon Resource Names (ARNs) that represent all of the what-if forecasts exported in this resource.
     */
    WhatIfForecastArns?: LongArnList;
    Destination?: DataDestination;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: Message;
    /**
     * The status of the what-if forecast. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the what-if forecast export must be ACTIVE before you can access the forecast export. 
     */
    Status?: Status;
    /**
     * When the what-if forecast export was created.
     */
    CreationTime?: Timestamp;
    /**
     * The approximate time remaining to complete the what-if forecast export, in minutes.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
    /**
     * The format of the exported data, CSV or PARQUET.
     */
    Format?: Format;
  }
  export interface DescribeWhatIfForecastRequest {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast that you are interested in.
     */
    WhatIfForecastArn: LongArn;
  }
  export interface DescribeWhatIfForecastResponse {
    /**
     * The name of the what-if forecast.
     */
    WhatIfForecastName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast.
     */
    WhatIfForecastArn?: LongArn;
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis that contains this forecast.
     */
    WhatIfAnalysisArn?: Arn;
    /**
     * The approximate time remaining to complete the what-if forecast, in minutes.
     */
    EstimatedTimeRemainingInMinutes?: Long;
    /**
     * The status of the what-if forecast. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the what-if forecast must be ACTIVE before you can access the forecast. 
     */
    Status?: String;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the what-if forecast was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
    /**
     * An array of Action and TimeSeriesConditions elements that describe what transformations were applied to which time series.
     */
    TimeSeriesTransformations?: TimeSeriesTransformations;
    /**
     * An array of S3Config, Schema, and Format elements that describe the replacement time series.
     */
    TimeSeriesReplacementsDataSource?: TimeSeriesReplacementsDataSource;
    /**
     * The quantiles at which probabilistic forecasts are generated. You can specify up to five quantiles per what-if forecast in the CreateWhatIfForecast operation. If you didn't specify quantiles, the default values are ["0.1", "0.5", "0.9"]. 
     */
    ForecastTypes?: ForecastTypes;
  }
  export type Detail = string;
  export type Domain = "RETAIL"|"CUSTOM"|"INVENTORY_PLANNING"|"EC2_CAPACITY"|"WORK_FORCE"|"WEB_TRAFFIC"|"METRICS"|string;
  export type Double = number;
  export interface EncryptionConfig {
    /**
     * The ARN of the IAM role that Amazon Forecast can assume to access the KMS key. Passing a role across Amazon Web Services accounts is not allowed. If you pass a role that isn't in your account, you get an InvalidInputException error.
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
  export type EvaluationState = string;
  export type EvaluationType = "SUMMARY"|"COMPUTED"|string;
  export type Explainabilities = ExplainabilitySummary[];
  export interface ExplainabilityConfig {
    /**
     * To create an Explainability for all time series in your datasets, use ALL. To create an Explainability for specific time series in your datasets, use SPECIFIC. Specify time series by uploading a CSV or Parquet file to an Amazon S3 bucket and set the location within the DataDestination data type.
     */
    TimeSeriesGranularity: TimeSeriesGranularity;
    /**
     * To create an Explainability for all time points in your forecast horizon, use ALL. To create an Explainability for specific time points in your forecast horizon, use SPECIFIC. Specify time points with the StartDateTime and EndDateTime parameters within the CreateExplainability operation.
     */
    TimePointGranularity: TimePointGranularity;
  }
  export interface ExplainabilityExportSummary {
    /**
     * The Amazon Resource Name (ARN) of the Explainability export.
     */
    ExplainabilityExportArn?: Arn;
    /**
     * The name of the Explainability export
     */
    ExplainabilityExportName?: Name;
    Destination?: DataDestination;
    /**
     * The status of the Explainability export. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * Information about any errors that may have occurred during the Explainability export.
     */
    Message?: ErrorMessage;
    /**
     * When the Explainability was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type ExplainabilityExports = ExplainabilityExportSummary[];
  export interface ExplainabilityInfo {
    /**
     * The Amazon Resource Name (ARN) of the Explainability.
     */
    ExplainabilityArn?: Arn;
    /**
     * The status of the Explainability. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
  }
  export interface ExplainabilitySummary {
    /**
     * The Amazon Resource Name (ARN) of the Explainability.
     */
    ExplainabilityArn?: Arn;
    /**
     * The name of the Explainability.
     */
    ExplainabilityName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the Predictor or Forecast used to create the Explainability.
     */
    ResourceArn?: Arn;
    /**
     * The configuration settings that define the granularity of time series and time points for the Explainability.
     */
    ExplainabilityConfig?: ExplainabilityConfig;
    /**
     * The status of the Explainability. States include:     ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * Information about any errors that may have occurred during the Explainability creation process.
     */
    Message?: Message;
    /**
     * When the Explainability was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
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
     * The frequency of predictions in a forecast. Valid intervals are an integer followed by Y (Year), M (Month), W (Week), D (Day), H (Hour), and min (Minute). For example, "1D" indicates every day and "15min" indicates every 15 minutes. You cannot specify a value that would overlap with the next larger frequency. That means, for example, you cannot specify a frequency of 60 minutes, because that is equivalent to 1 hour. The valid values for each frequency are the following:   Minute - 1-59   Hour - 1-23   Day - 1-6   Week - 1-4   Month - 1-11   Year - 1   Thus, if you want every other week forecasts, specify "2W". Or, if you want quarterly forecasts, you specify "3M". The frequency must be greater than or equal to the TARGET_TIME_SERIES dataset frequency. When a RELATED_TIME_SERIES dataset is provided, the frequency must be equal to the TARGET_TIME_SERIES dataset frequency.
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
     * Whether the Forecast was created from an AutoPredictor.
     */
    CreatedUsingAutoPredictor?: Boolean;
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
  export type Format = string;
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
     * Whether the predictor was created with CreateAutoPredictor.
     */
    IsAutoPredictor?: Boolean;
    /**
     *   The LatencyOptimized AutoML override strategy is only available in private beta. Contact Amazon Web Services Support or your account manager to learn more about access privileges.   The AutoML strategy used to train the predictor. Unless LatencyOptimized is specified, the AutoML strategy optimizes predictor accuracy. This parameter is only valid for predictors trained using AutoML.
     */
    AutoMLOverrideStrategy?: AutoMLOverrideStrategy;
    /**
     * The accuracy metric used to optimize the predictor.
     */
    OptimizationMetric?: OptimizationMetric;
  }
  export type Hour = number;
  export interface HyperParameterTuningJobConfig {
    /**
     * Specifies the ranges of valid values for the hyperparameters.
     */
    ParameterRanges?: ParameterRanges;
  }
  export type ImportMode = "FULL"|"INCREMENTAL"|string;
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
  export interface ListExplainabilitiesRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items returned in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the resources that match the statement from the list. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT.    Key - The name of the parameter to filter on. Valid values are ResourceArn and Status.    Value - The value to match.  
     */
    Filters?: Filters;
  }
  export interface ListExplainabilitiesResponse {
    /**
     * An array of objects that summarize the properties of each Explainability resource.
     */
    Explainabilities?: Explainabilities;
    /**
     * Returns this token if the response is truncated. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListExplainabilityExportsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude resources that match the statement from the list. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT.    Key - The name of the parameter to filter on. Valid values are ResourceArn and Status.    Value - The value to match.  
     */
    Filters?: Filters;
  }
  export interface ListExplainabilityExportsResponse {
    /**
     * An array of objects that summarize the properties of each Explainability export.
     */
    ExplainabilityExports?: ExplainabilityExports;
    /**
     * Returns this token if the response is truncated. To retrieve the next set of results, use the token in the next request.
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
  export interface ListMonitorEvaluationsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of monitoring results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The Amazon Resource Name (ARN) of the monitor resource to get results from.
     */
    MonitorArn: Arn;
    /**
     * An array of filters. For each filter, provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the resources that match the statement from the list. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT.    Key - The name of the parameter to filter on. The only valid value is EvaluationState.    Value - The value to match. Valid values are only SUCCESS or FAILURE.   For example, to list only successful monitor evaluations, you would specify:  "Filters": [ { "Condition": "IS", "Key": "EvaluationState", "Value": "SUCCESS" } ] 
     */
    Filters?: Filters;
  }
  export interface ListMonitorEvaluationsResponse {
    /**
     * If the response is truncated, Amazon Forecast returns this token. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The monitoring results and predictor events collected by the monitor resource during different windows of time. For information about monitoring see Viewing Monitoring Results. For more information about retrieving monitoring results see Viewing Monitoring Results.
     */
    PredictorMonitorEvaluations?: PredictorMonitorEvaluations;
  }
  export interface ListMonitorsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of monitors to include in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the resources that match the statement from the list. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT.    Key - The name of the parameter to filter on. The only valid value is Status.    Value - The value to match.   For example, to list all monitors who's status is ACTIVE, you would specify:  "Filters": [ { "Condition": "IS", "Key": "Status", "Value": "ACTIVE" } ] 
     */
    Filters?: Filters;
  }
  export interface ListMonitorsResponse {
    /**
     * An array of objects that summarize each monitor's properties.
     */
    Monitors?: Monitors;
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
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. 
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    Tags?: Tags;
  }
  export interface ListWhatIfAnalysesRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the what-if analysis jobs that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the what-if analysis jobs that match the statement, specify IS. To exclude matching what-if analysis jobs, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are WhatIfAnalysisArn and Status.    Value - The value to match.   For example, to list all jobs that export a forecast named electricityWhatIf, specify the following filter:  "Filters": [ { "Condition": "IS", "Key": "WhatIfAnalysisArn", "Value": "arn:aws:forecast:us-west-2:&lt;acct-id&gt;:forecast/electricityWhatIf" } ] 
     */
    Filters?: Filters;
  }
  export interface ListWhatIfAnalysesResponse {
    /**
     * An array of WhatIfAnalysisSummary objects that describe the matched analyses.
     */
    WhatIfAnalyses?: WhatIfAnalyses;
    /**
     * If the response is truncated, Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListWhatIfForecastExportsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next&#x2028; request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the what-if forecast export jobs that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the forecast export jobs that match the statement, specify IS. To exclude matching forecast export jobs, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are WhatIfForecastExportArn and Status.    Value - The value to match.   For example, to list all jobs that export a forecast named electricityWIFExport, specify the following filter:  "Filters": [ { "Condition": "IS", "Key": "WhatIfForecastExportArn", "Value": "arn:aws:forecast:us-west-2:&lt;acct-id&gt;:forecast/electricityWIFExport" } ] 
     */
    Filters?: Filters;
  }
  export interface ListWhatIfForecastExportsResponse {
    /**
     * An array of WhatIfForecastExports objects that describe the matched forecast exports.
     */
    WhatIfForecastExports?: WhatIfForecastExports;
    /**
     * If the response is truncated, Forecast returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListWhatIfForecastsRequest {
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next&#x2028; request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * An array of filters. For each filter, you provide a condition and a match statement. The condition is either IS or IS_NOT, which specifies whether to include or exclude the what-if forecast export jobs that match the statement from the list, respectively. The match statement consists of a key and a value.  Filter properties     Condition - The condition to apply. Valid values are IS and IS_NOT. To include the forecast export jobs that match the statement, specify IS. To exclude matching forecast export jobs, specify IS_NOT.    Key - The name of the parameter to filter on. Valid values are WhatIfForecastArn and Status.    Value - The value to match.   For example, to list all jobs that export a forecast named electricityWhatIfForecast, specify the following filter:  "Filters": [ { "Condition": "IS", "Key": "WhatIfForecastArn", "Value": "arn:aws:forecast:us-west-2:&lt;acct-id&gt;:forecast/electricityWhatIfForecast" } ] 
     */
    Filters?: Filters;
  }
  export interface ListWhatIfForecastsResponse {
    /**
     * An array of WhatIfForecasts objects that describe the matched forecasts.
     */
    WhatIfForecasts?: WhatIfForecasts;
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next&#x2028; request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
  }
  export type LocalDateTime = string;
  export type Long = number;
  export type LongArn = string;
  export type LongArnList = LongArn[];
  export type MaxResults = number;
  export type Message = string;
  export type MetricName = string;
  export interface MetricResult {
    /**
     * The name of the metric.
     */
    MetricName?: MetricName;
    /**
     * The value for the metric.
     */
    MetricValue?: Double;
  }
  export type MetricResults = MetricResult[];
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
  export interface MonitorConfig {
    /**
     * The name of the monitor resource.
     */
    MonitorName: Name;
  }
  export interface MonitorDataSource {
    /**
     * The Amazon Resource Name (ARN) of the dataset import job used to import the data that initiated the monitor evaluation.
     */
    DatasetImportJobArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the forecast the monitor used during the evaluation.
     */
    ForecastArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the predictor resource you are monitoring.
     */
    PredictorArn?: Arn;
  }
  export interface MonitorInfo {
    /**
     * The Amazon Resource Name (ARN) of the monitor resource.
     */
    MonitorArn?: Arn;
    /**
     * The status of the monitor. States include:    ACTIVE     ACTIVE_STOPPING, ACTIVE_STOPPED     UPDATE_IN_PROGRESS     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
  }
  export interface MonitorSummary {
    /**
     * The Amazon Resource Name (ARN) of the monitor resource.
     */
    MonitorArn?: Arn;
    /**
     * The name of the monitor resource.
     */
    MonitorName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the predictor being monitored.
     */
    ResourceArn?: Arn;
    /**
     * The status of the monitor. States include:    ACTIVE     ACTIVE_STOPPING, ACTIVE_STOPPED     UPDATE_IN_PROGRESS     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED   
     */
    Status?: Status;
    /**
     * When the monitor resource was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the monitor resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    STOPPED - When the resource stopped.    ACTIVE or CREATE_FAILED - When the monitor creation finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type Monitors = MonitorSummary[];
  export type Month = "JANUARY"|"FEBRUARY"|"MARCH"|"APRIL"|"MAY"|"JUNE"|"JULY"|"AUGUST"|"SEPTEMBER"|"OCTOBER"|"NOVEMBER"|"DECEMBER"|string;
  export type Name = string;
  export type NextToken = string;
  export type Operation = "ADD"|"SUBTRACT"|"MULTIPLY"|"DIVIDE"|string;
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
  export interface PredictorBaseline {
    /**
     * The initial accuracy metrics for the predictor. Use these metrics as a baseline for comparison purposes as you use your predictor and the metrics change.
     */
    BaselineMetrics?: BaselineMetrics;
  }
  export type PredictorEvaluationResults = EvaluationResult[];
  export interface PredictorEvent {
    /**
     * The type of event. For example, Retrain. A retraining event denotes the timepoint when a predictor was retrained. Any monitor results from before the Datetime are from the previous predictor. Any new metrics are for the newly retrained predictor.
     */
    Detail?: Detail;
    /**
     * The timestamp for when the event occurred.
     */
    Datetime?: Timestamp;
  }
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
  export interface PredictorMonitorEvaluation {
    /**
     * The Amazon Resource Name (ARN) of the resource to monitor.
     */
    ResourceArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the monitor resource.
     */
    MonitorArn?: Arn;
    /**
     * The timestamp that indicates when the monitor evaluation was started. 
     */
    EvaluationTime?: Timestamp;
    /**
     * The status of the monitor evaluation. The state can be SUCCESS or FAILURE.
     */
    EvaluationState?: EvaluationState;
    /**
     * The timestamp that indicates the start of the window that is used for monitor evaluation.
     */
    WindowStartDatetime?: Timestamp;
    /**
     * The timestamp that indicates the end of the window that is used for monitor evaluation.
     */
    WindowEndDatetime?: Timestamp;
    /**
     * Provides details about a predictor event, such as a retraining.
     */
    PredictorEvent?: PredictorEvent;
    /**
     * The source of the data the monitor resource used during the evaluation.
     */
    MonitorDataSource?: MonitorDataSource;
    /**
     * A list of metrics Forecast calculated when monitoring a predictor. You can compare the value for each metric in the list to the metric's value in the Baseline to see how your predictor's performance is changing.
     */
    MetricResults?: MetricResults;
    /**
     * The number of items considered during the evaluation.
     */
    NumItemsEvaluated?: Long;
    /**
     * Information about any errors that may have occurred during the monitor evaluation.
     */
    Message?: Message;
  }
  export type PredictorMonitorEvaluations = PredictorMonitorEvaluation[];
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
     * Whether AutoPredictor was used to create the predictor.
     */
    IsAutoPredictor?: Boolean;
    /**
     * A summary of the reference predictor used if the predictor was retrained or upgraded.
     */
    ReferencePredictorSummary?: ReferencePredictorSummary;
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
  export interface ReferencePredictorSummary {
    /**
     * The ARN of the reference predictor.
     */
    Arn?: Arn;
    /**
     * Whether the reference predictor is Active or Deleted.
     */
    State?: State;
  }
  export interface ResumeResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the monitor resource to resume.
     */
    ResourceArn: Arn;
  }
  export interface S3Config {
    /**
     * The path to an Amazon Simple Storage Service (Amazon S3) bucket or file(s) in an Amazon S3 bucket.
     */
    Path: S3Path;
    /**
     * The ARN of the Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket or files. If you provide a value for the KMSKeyArn key, the role must allow access to the key. Passing a role across Amazon Web Services accounts is not allowed. If you pass a role that isn't in your account, you get an InvalidInputException error.
     */
    RoleArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of an Key Management Service (KMS) key.
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
     * The data type of the field. For a related time series dataset, other than date, item_id, and forecast dimensions attributes, all attributes should be of numerical type (integer/float).
     */
    AttributeType?: AttributeType;
  }
  export type SchemaAttributes = SchemaAttribute[];
  export type State = "Active"|"Deleted"|string;
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
     * The Amazon Resource Name (ARN) that identifies the resource to stop. The supported ARNs are DatasetImportJobArn, PredictorArn, PredictorBacktestExportJobArn, ForecastArn, ForecastExportJobArn, ExplainabilityArn, and ExplainabilityExportArn. 
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
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. 
     */
    ResourceArn: Arn;
    /**
     * The tags to add to the resource. A tag is an array of key-value pairs. The following basic restrictions apply to tags:   Maximum number of tags per resource - 50.   For each resource, each tag key must be unique, and each tag key can have only one value.   Maximum key length - 128 Unicode characters in UTF-8.   Maximum value length - 256 Unicode characters in UTF-8.   If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.   Tag keys and values are case sensitive.   Do not use aws:, AWS:, or any upper or lowercase combination of such as a prefix for keys as it is reserved for Amazon Web Services use. You cannot edit or delete tag keys with this prefix. Values can have this prefix. If a tag value has aws as its prefix but the key does not, then Forecast considers it to be a user tag and will count against the limit of 50 tags. Tags with only the key prefix of aws do not count against your tags per resource limit.  
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
  export interface TimeAlignmentBoundary {
    /**
     * The month to use for time alignment during aggregation. The month must be in uppercase.
     */
    Month?: Month;
    /**
     * The day of the month to use for time alignment during aggregation.
     */
    DayOfMonth?: DayOfMonth;
    /**
     * The day of week to use for time alignment during aggregation. The day must be in uppercase.
     */
    DayOfWeek?: DayOfWeek;
    /**
     * The hour of day to use for time alignment during aggregation.
     */
    Hour?: Hour;
  }
  export type TimePointGranularity = "ALL"|"SPECIFIC"|string;
  export interface TimeSeriesCondition {
    /**
     * The item_id, dimension name, IM name, or timestamp that you are modifying.
     */
    AttributeName: Name;
    /**
     * The value that is applied for the chosen Condition.
     */
    AttributeValue: AttributeValue;
    /**
     * The condition to apply. Valid values are EQUALS, NOT_EQUALS, LESS_THAN and GREATER_THAN.
     */
    Condition: Condition;
  }
  export type TimeSeriesConditions = TimeSeriesCondition[];
  export type TimeSeriesGranularity = "ALL"|"SPECIFIC"|string;
  export interface TimeSeriesIdentifiers {
    DataSource?: DataSource;
    Schema?: Schema;
    /**
     * The format of the data, either CSV or PARQUET.
     */
    Format?: Format;
  }
  export interface TimeSeriesReplacementsDataSource {
    S3Config: S3Config;
    Schema: Schema;
    /**
     * The format of the replacement data, CSV or PARQUET.
     */
    Format?: Format;
    /**
     * The timestamp format of the replacement data.
     */
    TimestampFormat?: TimestampFormat;
  }
  export interface TimeSeriesSelector {
    /**
     * Details about the import file that contains the time series for which you want to create forecasts.
     */
    TimeSeriesIdentifiers?: TimeSeriesIdentifiers;
  }
  export interface TimeSeriesTransformation {
    /**
     * An array of actions that define a time series and how it is transformed. These transformations create a new time series that is used for the what-if analysis.
     */
    Action?: Action;
    /**
     * An array of conditions that define which members of the related time series are transformed.
     */
    TimeSeriesConditions?: TimeSeriesConditions;
  }
  export type TimeSeriesTransformations = TimeSeriesTransformation[];
  export type TimeZone = string;
  export type Timestamp = Date;
  export type TimestampFormat = string;
  export type TrainingParameters = {[key: string]: ParameterValue};
  export type Transformations = {[key: string]: Value};
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. 
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
  export type WhatIfAnalyses = WhatIfAnalysisSummary[];
  export interface WhatIfAnalysisSummary {
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis.
     */
    WhatIfAnalysisArn?: Arn;
    /**
     * The name of the what-if analysis.
     */
    WhatIfAnalysisName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the baseline forecast that is being used in this what-if analysis.
     */
    ForecastArn?: Arn;
    /**
     * The status of the what-if analysis. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the what-if analysis must be ACTIVE before you can access the analysis. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the what-if analysis was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type WhatIfForecastArnListForExport = LongArn[];
  export interface WhatIfForecastExportSummary {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast export.
     */
    WhatIfForecastExportArn?: LongArn;
    /**
     * An array of Amazon Resource Names (ARNs) that define the what-if forecasts included in the export.
     */
    WhatIfForecastArns?: WhatIfForecastArnListForExport;
    /**
     * The what-if forecast export name.
     */
    WhatIfForecastExportName?: Name;
    /**
     * The path to the Amazon Simple Storage Service (Amazon S3) bucket where the forecast is exported.
     */
    Destination?: DataDestination;
    /**
     * The status of the what-if forecast export. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the what-if analysis must be ACTIVE before you can access the analysis. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the what-if forecast export was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type WhatIfForecastExports = WhatIfForecastExportSummary[];
  export interface WhatIfForecastSummary {
    /**
     * The Amazon Resource Name (ARN) of the what-if forecast.
     */
    WhatIfForecastArn?: LongArn;
    /**
     * The name of the what-if forecast.
     */
    WhatIfForecastName?: Name;
    /**
     * The Amazon Resource Name (ARN) of the what-if analysis that contains this what-if forecast.
     */
    WhatIfAnalysisArn?: Arn;
    /**
     * The status of the what-if forecast. States include:    ACTIVE     CREATE_PENDING, CREATE_IN_PROGRESS, CREATE_FAILED     CREATE_STOPPING, CREATE_STOPPED     DELETE_PENDING, DELETE_IN_PROGRESS, DELETE_FAILED     The Status of the what-if analysis must be ACTIVE before you can access the analysis. 
     */
    Status?: Status;
    /**
     * If an error occurred, an informational message about the error.
     */
    Message?: ErrorMessage;
    /**
     * When the what-if forecast was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the resource was modified. The timestamp depends on the status of the job:    CREATE_PENDING - The CreationTime.    CREATE_IN_PROGRESS - The current timestamp.    CREATE_STOPPING - The current timestamp.    CREATE_STOPPED - When the job stopped.    ACTIVE or CREATE_FAILED - When the job finished or failed.  
     */
    LastModificationTime?: Timestamp;
  }
  export type WhatIfForecasts = WhatIfForecastSummary[];
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
