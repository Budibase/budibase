import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class LexModelsV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LexModelsV2.Types.ClientConfiguration)
  config: Config & LexModelsV2.Types.ClientConfiguration;
  /**
   * Create a batch of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  batchCreateCustomVocabularyItem(params: LexModelsV2.Types.BatchCreateCustomVocabularyItemRequest, callback?: (err: AWSError, data: LexModelsV2.Types.BatchCreateCustomVocabularyItemResponse) => void): Request<LexModelsV2.Types.BatchCreateCustomVocabularyItemResponse, AWSError>;
  /**
   * Create a batch of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  batchCreateCustomVocabularyItem(callback?: (err: AWSError, data: LexModelsV2.Types.BatchCreateCustomVocabularyItemResponse) => void): Request<LexModelsV2.Types.BatchCreateCustomVocabularyItemResponse, AWSError>;
  /**
   * Delete a batch of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  batchDeleteCustomVocabularyItem(params: LexModelsV2.Types.BatchDeleteCustomVocabularyItemRequest, callback?: (err: AWSError, data: LexModelsV2.Types.BatchDeleteCustomVocabularyItemResponse) => void): Request<LexModelsV2.Types.BatchDeleteCustomVocabularyItemResponse, AWSError>;
  /**
   * Delete a batch of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  batchDeleteCustomVocabularyItem(callback?: (err: AWSError, data: LexModelsV2.Types.BatchDeleteCustomVocabularyItemResponse) => void): Request<LexModelsV2.Types.BatchDeleteCustomVocabularyItemResponse, AWSError>;
  /**
   * Update a batch of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  batchUpdateCustomVocabularyItem(params: LexModelsV2.Types.BatchUpdateCustomVocabularyItemRequest, callback?: (err: AWSError, data: LexModelsV2.Types.BatchUpdateCustomVocabularyItemResponse) => void): Request<LexModelsV2.Types.BatchUpdateCustomVocabularyItemResponse, AWSError>;
  /**
   * Update a batch of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  batchUpdateCustomVocabularyItem(callback?: (err: AWSError, data: LexModelsV2.Types.BatchUpdateCustomVocabularyItemResponse) => void): Request<LexModelsV2.Types.BatchUpdateCustomVocabularyItemResponse, AWSError>;
  /**
   * Builds a bot, its intents, and its slot types into a specific locale. A bot can be built into multiple locales. At runtime the locale is used to choose a specific build of the bot.
   */
  buildBotLocale(params: LexModelsV2.Types.BuildBotLocaleRequest, callback?: (err: AWSError, data: LexModelsV2.Types.BuildBotLocaleResponse) => void): Request<LexModelsV2.Types.BuildBotLocaleResponse, AWSError>;
  /**
   * Builds a bot, its intents, and its slot types into a specific locale. A bot can be built into multiple locales. At runtime the locale is used to choose a specific build of the bot.
   */
  buildBotLocale(callback?: (err: AWSError, data: LexModelsV2.Types.BuildBotLocaleResponse) => void): Request<LexModelsV2.Types.BuildBotLocaleResponse, AWSError>;
  /**
   * Creates an Amazon Lex conversational bot. 
   */
  createBot(params: LexModelsV2.Types.CreateBotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotResponse) => void): Request<LexModelsV2.Types.CreateBotResponse, AWSError>;
  /**
   * Creates an Amazon Lex conversational bot. 
   */
  createBot(callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotResponse) => void): Request<LexModelsV2.Types.CreateBotResponse, AWSError>;
  /**
   * Creates an alias for the specified version of a bot. Use an alias to enable you to change the version of a bot without updating applications that use the bot. For example, you can create an alias called "PROD" that your applications use to call the Amazon Lex bot. 
   */
  createBotAlias(params: LexModelsV2.Types.CreateBotAliasRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotAliasResponse) => void): Request<LexModelsV2.Types.CreateBotAliasResponse, AWSError>;
  /**
   * Creates an alias for the specified version of a bot. Use an alias to enable you to change the version of a bot without updating applications that use the bot. For example, you can create an alias called "PROD" that your applications use to call the Amazon Lex bot. 
   */
  createBotAlias(callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotAliasResponse) => void): Request<LexModelsV2.Types.CreateBotAliasResponse, AWSError>;
  /**
   * Creates a locale in the bot. The locale contains the intents and slot types that the bot uses in conversations with users in the specified language and locale. You must add a locale to a bot before you can add intents and slot types to the bot.
   */
  createBotLocale(params: LexModelsV2.Types.CreateBotLocaleRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotLocaleResponse) => void): Request<LexModelsV2.Types.CreateBotLocaleResponse, AWSError>;
  /**
   * Creates a locale in the bot. The locale contains the intents and slot types that the bot uses in conversations with users in the specified language and locale. You must add a locale to a bot before you can add intents and slot types to the bot.
   */
  createBotLocale(callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotLocaleResponse) => void): Request<LexModelsV2.Types.CreateBotLocaleResponse, AWSError>;
  /**
   * Creates a new version of the bot based on the DRAFT version. If the DRAFT version of this resource hasn't changed since you created the last version, Amazon Lex doesn't create a new version, it returns the last created version. When you create the first version of a bot, Amazon Lex sets the version to 1. Subsequent versions increment by 1.
   */
  createBotVersion(params: LexModelsV2.Types.CreateBotVersionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotVersionResponse) => void): Request<LexModelsV2.Types.CreateBotVersionResponse, AWSError>;
  /**
   * Creates a new version of the bot based on the DRAFT version. If the DRAFT version of this resource hasn't changed since you created the last version, Amazon Lex doesn't create a new version, it returns the last created version. When you create the first version of a bot, Amazon Lex sets the version to 1. Subsequent versions increment by 1.
   */
  createBotVersion(callback?: (err: AWSError, data: LexModelsV2.Types.CreateBotVersionResponse) => void): Request<LexModelsV2.Types.CreateBotVersionResponse, AWSError>;
  /**
   * Creates a zip archive containing the contents of a bot or a bot locale. The archive contains a directory structure that contains JSON files that define the bot. You can create an archive that contains the complete definition of a bot, or you can specify that the archive contain only the definition of a single bot locale. For more information about exporting bots, and about the structure of the export archive, see  Importing and exporting bots  
   */
  createExport(params: LexModelsV2.Types.CreateExportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateExportResponse) => void): Request<LexModelsV2.Types.CreateExportResponse, AWSError>;
  /**
   * Creates a zip archive containing the contents of a bot or a bot locale. The archive contains a directory structure that contains JSON files that define the bot. You can create an archive that contains the complete definition of a bot, or you can specify that the archive contain only the definition of a single bot locale. For more information about exporting bots, and about the structure of the export archive, see  Importing and exporting bots  
   */
  createExport(callback?: (err: AWSError, data: LexModelsV2.Types.CreateExportResponse) => void): Request<LexModelsV2.Types.CreateExportResponse, AWSError>;
  /**
   * Creates an intent. To define the interaction between the user and your bot, you define one or more intents. For example, for a pizza ordering bot you would create an OrderPizza intent. When you create an intent, you must provide a name. You can optionally provide the following:   Sample utterances. For example, "I want to order a pizza" and "Can I order a pizza." You can't provide utterances for built-in intents.   Information to be gathered. You specify slots for the information that you bot requests from the user. You can specify standard slot types, such as date and time, or custom slot types for your application.   How the intent is fulfilled. You can provide a Lambda function or configure the intent to return the intent information to your client application. If you use a Lambda function, Amazon Lex invokes the function when all of the intent information is available.   A confirmation prompt to send to the user to confirm an intent. For example, "Shall I order your pizza?"   A conclusion statement to send to the user after the intent is fulfilled. For example, "I ordered your pizza."   A follow-up prompt that asks the user for additional activity. For example, "Do you want a drink with your pizza?"  
   */
  createIntent(params: LexModelsV2.Types.CreateIntentRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateIntentResponse) => void): Request<LexModelsV2.Types.CreateIntentResponse, AWSError>;
  /**
   * Creates an intent. To define the interaction between the user and your bot, you define one or more intents. For example, for a pizza ordering bot you would create an OrderPizza intent. When you create an intent, you must provide a name. You can optionally provide the following:   Sample utterances. For example, "I want to order a pizza" and "Can I order a pizza." You can't provide utterances for built-in intents.   Information to be gathered. You specify slots for the information that you bot requests from the user. You can specify standard slot types, such as date and time, or custom slot types for your application.   How the intent is fulfilled. You can provide a Lambda function or configure the intent to return the intent information to your client application. If you use a Lambda function, Amazon Lex invokes the function when all of the intent information is available.   A confirmation prompt to send to the user to confirm an intent. For example, "Shall I order your pizza?"   A conclusion statement to send to the user after the intent is fulfilled. For example, "I ordered your pizza."   A follow-up prompt that asks the user for additional activity. For example, "Do you want a drink with your pizza?"  
   */
  createIntent(callback?: (err: AWSError, data: LexModelsV2.Types.CreateIntentResponse) => void): Request<LexModelsV2.Types.CreateIntentResponse, AWSError>;
  /**
   * Creates a new resource policy with the specified policy statements.
   */
  createResourcePolicy(params: LexModelsV2.Types.CreateResourcePolicyRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateResourcePolicyResponse) => void): Request<LexModelsV2.Types.CreateResourcePolicyResponse, AWSError>;
  /**
   * Creates a new resource policy with the specified policy statements.
   */
  createResourcePolicy(callback?: (err: AWSError, data: LexModelsV2.Types.CreateResourcePolicyResponse) => void): Request<LexModelsV2.Types.CreateResourcePolicyResponse, AWSError>;
  /**
   * Adds a new resource policy statement to a bot or bot alias. If a resource policy exists, the statement is added to the current resource policy. If a policy doesn't exist, a new policy is created. You can't create a resource policy statement that allows cross-account access.
   */
  createResourcePolicyStatement(params: LexModelsV2.Types.CreateResourcePolicyStatementRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateResourcePolicyStatementResponse) => void): Request<LexModelsV2.Types.CreateResourcePolicyStatementResponse, AWSError>;
  /**
   * Adds a new resource policy statement to a bot or bot alias. If a resource policy exists, the statement is added to the current resource policy. If a policy doesn't exist, a new policy is created. You can't create a resource policy statement that allows cross-account access.
   */
  createResourcePolicyStatement(callback?: (err: AWSError, data: LexModelsV2.Types.CreateResourcePolicyStatementResponse) => void): Request<LexModelsV2.Types.CreateResourcePolicyStatementResponse, AWSError>;
  /**
   * Creates a slot in an intent. A slot is a variable needed to fulfill an intent. For example, an OrderPizza intent might need slots for size, crust, and number of pizzas. For each slot, you define one or more utterances that Amazon Lex uses to elicit a response from the user. 
   */
  createSlot(params: LexModelsV2.Types.CreateSlotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateSlotResponse) => void): Request<LexModelsV2.Types.CreateSlotResponse, AWSError>;
  /**
   * Creates a slot in an intent. A slot is a variable needed to fulfill an intent. For example, an OrderPizza intent might need slots for size, crust, and number of pizzas. For each slot, you define one or more utterances that Amazon Lex uses to elicit a response from the user. 
   */
  createSlot(callback?: (err: AWSError, data: LexModelsV2.Types.CreateSlotResponse) => void): Request<LexModelsV2.Types.CreateSlotResponse, AWSError>;
  /**
   * Creates a custom slot type  To create a custom slot type, specify a name for the slot type and a set of enumeration values, the values that a slot of this type can assume. 
   */
  createSlotType(params: LexModelsV2.Types.CreateSlotTypeRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateSlotTypeResponse) => void): Request<LexModelsV2.Types.CreateSlotTypeResponse, AWSError>;
  /**
   * Creates a custom slot type  To create a custom slot type, specify a name for the slot type and a set of enumeration values, the values that a slot of this type can assume. 
   */
  createSlotType(callback?: (err: AWSError, data: LexModelsV2.Types.CreateSlotTypeResponse) => void): Request<LexModelsV2.Types.CreateSlotTypeResponse, AWSError>;
  /**
   * Create a report that describes the differences between the bot and the test set.
   */
  createTestSetDiscrepancyReport(params: LexModelsV2.Types.CreateTestSetDiscrepancyReportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateTestSetDiscrepancyReportResponse) => void): Request<LexModelsV2.Types.CreateTestSetDiscrepancyReportResponse, AWSError>;
  /**
   * Create a report that describes the differences between the bot and the test set.
   */
  createTestSetDiscrepancyReport(callback?: (err: AWSError, data: LexModelsV2.Types.CreateTestSetDiscrepancyReportResponse) => void): Request<LexModelsV2.Types.CreateTestSetDiscrepancyReportResponse, AWSError>;
  /**
   * Gets a pre-signed S3 write URL that you use to upload the zip archive when importing a bot or a bot locale. 
   */
  createUploadUrl(params: LexModelsV2.Types.CreateUploadUrlRequest, callback?: (err: AWSError, data: LexModelsV2.Types.CreateUploadUrlResponse) => void): Request<LexModelsV2.Types.CreateUploadUrlResponse, AWSError>;
  /**
   * Gets a pre-signed S3 write URL that you use to upload the zip archive when importing a bot or a bot locale. 
   */
  createUploadUrl(callback?: (err: AWSError, data: LexModelsV2.Types.CreateUploadUrlResponse) => void): Request<LexModelsV2.Types.CreateUploadUrlResponse, AWSError>;
  /**
   * Deletes all versions of a bot, including the Draft version. To delete a specific version, use the DeleteBotVersion operation. When you delete a bot, all of the resources contained in the bot are also deleted. Deleting a bot removes all locales, intents, slot, and slot types defined for the bot. If a bot has an alias, the DeleteBot operation returns a ResourceInUseException exception. If you want to delete the bot and the alias, set the skipResourceInUseCheck parameter to true.
   */
  deleteBot(params: LexModelsV2.Types.DeleteBotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotResponse) => void): Request<LexModelsV2.Types.DeleteBotResponse, AWSError>;
  /**
   * Deletes all versions of a bot, including the Draft version. To delete a specific version, use the DeleteBotVersion operation. When you delete a bot, all of the resources contained in the bot are also deleted. Deleting a bot removes all locales, intents, slot, and slot types defined for the bot. If a bot has an alias, the DeleteBot operation returns a ResourceInUseException exception. If you want to delete the bot and the alias, set the skipResourceInUseCheck parameter to true.
   */
  deleteBot(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotResponse) => void): Request<LexModelsV2.Types.DeleteBotResponse, AWSError>;
  /**
   * Deletes the specified bot alias.
   */
  deleteBotAlias(params: LexModelsV2.Types.DeleteBotAliasRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotAliasResponse) => void): Request<LexModelsV2.Types.DeleteBotAliasResponse, AWSError>;
  /**
   * Deletes the specified bot alias.
   */
  deleteBotAlias(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotAliasResponse) => void): Request<LexModelsV2.Types.DeleteBotAliasResponse, AWSError>;
  /**
   * Removes a locale from a bot. When you delete a locale, all intents, slots, and slot types defined for the locale are also deleted.
   */
  deleteBotLocale(params: LexModelsV2.Types.DeleteBotLocaleRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotLocaleResponse) => void): Request<LexModelsV2.Types.DeleteBotLocaleResponse, AWSError>;
  /**
   * Removes a locale from a bot. When you delete a locale, all intents, slots, and slot types defined for the locale are also deleted.
   */
  deleteBotLocale(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotLocaleResponse) => void): Request<LexModelsV2.Types.DeleteBotLocaleResponse, AWSError>;
  /**
   * Deletes a specific version of a bot. To delete all versions of a bot, use the DeleteBot operation.
   */
  deleteBotVersion(params: LexModelsV2.Types.DeleteBotVersionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotVersionResponse) => void): Request<LexModelsV2.Types.DeleteBotVersionResponse, AWSError>;
  /**
   * Deletes a specific version of a bot. To delete all versions of a bot, use the DeleteBot operation.
   */
  deleteBotVersion(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotVersionResponse) => void): Request<LexModelsV2.Types.DeleteBotVersionResponse, AWSError>;
  /**
   * Removes a custom vocabulary from the specified locale in the specified bot.
   */
  deleteCustomVocabulary(params: LexModelsV2.Types.DeleteCustomVocabularyRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteCustomVocabularyResponse) => void): Request<LexModelsV2.Types.DeleteCustomVocabularyResponse, AWSError>;
  /**
   * Removes a custom vocabulary from the specified locale in the specified bot.
   */
  deleteCustomVocabulary(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteCustomVocabularyResponse) => void): Request<LexModelsV2.Types.DeleteCustomVocabularyResponse, AWSError>;
  /**
   * Removes a previous export and the associated files stored in an S3 bucket.
   */
  deleteExport(params: LexModelsV2.Types.DeleteExportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteExportResponse) => void): Request<LexModelsV2.Types.DeleteExportResponse, AWSError>;
  /**
   * Removes a previous export and the associated files stored in an S3 bucket.
   */
  deleteExport(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteExportResponse) => void): Request<LexModelsV2.Types.DeleteExportResponse, AWSError>;
  /**
   * Removes a previous import and the associated file stored in an S3 bucket.
   */
  deleteImport(params: LexModelsV2.Types.DeleteImportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteImportResponse) => void): Request<LexModelsV2.Types.DeleteImportResponse, AWSError>;
  /**
   * Removes a previous import and the associated file stored in an S3 bucket.
   */
  deleteImport(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteImportResponse) => void): Request<LexModelsV2.Types.DeleteImportResponse, AWSError>;
  /**
   * Removes the specified intent. Deleting an intent also deletes the slots associated with the intent.
   */
  deleteIntent(params: LexModelsV2.Types.DeleteIntentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified intent. Deleting an intent also deletes the slots associated with the intent.
   */
  deleteIntent(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes an existing policy from a bot or bot alias. If the resource doesn't have a policy attached, Amazon Lex returns an exception.
   */
  deleteResourcePolicy(params: LexModelsV2.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteResourcePolicyResponse) => void): Request<LexModelsV2.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Removes an existing policy from a bot or bot alias. If the resource doesn't have a policy attached, Amazon Lex returns an exception.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteResourcePolicyResponse) => void): Request<LexModelsV2.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a policy statement from a resource policy. If you delete the last statement from a policy, the policy is deleted. If you specify a statement ID that doesn't exist in the policy, or if the bot or bot alias doesn't have a policy attached, Amazon Lex returns an exception.
   */
  deleteResourcePolicyStatement(params: LexModelsV2.Types.DeleteResourcePolicyStatementRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteResourcePolicyStatementResponse) => void): Request<LexModelsV2.Types.DeleteResourcePolicyStatementResponse, AWSError>;
  /**
   * Deletes a policy statement from a resource policy. If you delete the last statement from a policy, the policy is deleted. If you specify a statement ID that doesn't exist in the policy, or if the bot or bot alias doesn't have a policy attached, Amazon Lex returns an exception.
   */
  deleteResourcePolicyStatement(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteResourcePolicyStatementResponse) => void): Request<LexModelsV2.Types.DeleteResourcePolicyStatementResponse, AWSError>;
  /**
   * Deletes the specified slot from an intent.
   */
  deleteSlot(params: LexModelsV2.Types.DeleteSlotRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified slot from an intent.
   */
  deleteSlot(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a slot type from a bot locale. If a slot is using the slot type, Amazon Lex throws a ResourceInUseException exception. To avoid the exception, set the skipResourceInUseCheck parameter to true.
   */
  deleteSlotType(params: LexModelsV2.Types.DeleteSlotTypeRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a slot type from a bot locale. If a slot is using the slot type, Amazon Lex throws a ResourceInUseException exception. To avoid the exception, set the skipResourceInUseCheck parameter to true.
   */
  deleteSlotType(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The action to delete the selected test set.
   */
  deleteTestSet(params: LexModelsV2.Types.DeleteTestSetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * The action to delete the selected test set.
   */
  deleteTestSet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes stored utterances. Amazon Lex stores the utterances that users send to your bot. Utterances are stored for 15 days for use with the ListAggregatedUtterances operation, and then stored indefinitely for use in improving the ability of your bot to respond to user input.. Use the DeleteUtterances operation to manually delete utterances for a specific session. When you use the DeleteUtterances operation, utterances stored for improving your bot's ability to respond to user input are deleted immediately. Utterances stored for use with the ListAggregatedUtterances operation are deleted after 15 days.
   */
  deleteUtterances(params: LexModelsV2.Types.DeleteUtterancesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteUtterancesResponse) => void): Request<LexModelsV2.Types.DeleteUtterancesResponse, AWSError>;
  /**
   * Deletes stored utterances. Amazon Lex stores the utterances that users send to your bot. Utterances are stored for 15 days for use with the ListAggregatedUtterances operation, and then stored indefinitely for use in improving the ability of your bot to respond to user input.. Use the DeleteUtterances operation to manually delete utterances for a specific session. When you use the DeleteUtterances operation, utterances stored for improving your bot's ability to respond to user input are deleted immediately. Utterances stored for use with the ListAggregatedUtterances operation are deleted after 15 days.
   */
  deleteUtterances(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteUtterancesResponse) => void): Request<LexModelsV2.Types.DeleteUtterancesResponse, AWSError>;
  /**
   * Provides metadata information about a bot. 
   */
  describeBot(params: LexModelsV2.Types.DescribeBotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotResponse) => void): Request<LexModelsV2.Types.DescribeBotResponse, AWSError>;
  /**
   * Provides metadata information about a bot. 
   */
  describeBot(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotResponse) => void): Request<LexModelsV2.Types.DescribeBotResponse, AWSError>;
  /**
   * Get information about a specific bot alias.
   */
  describeBotAlias(params: LexModelsV2.Types.DescribeBotAliasRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotAliasResponse) => void): Request<LexModelsV2.Types.DescribeBotAliasResponse, AWSError>;
  /**
   * Get information about a specific bot alias.
   */
  describeBotAlias(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotAliasResponse) => void): Request<LexModelsV2.Types.DescribeBotAliasResponse, AWSError>;
  /**
   * Describes the settings that a bot has for a specific locale. 
   */
  describeBotLocale(params: LexModelsV2.Types.DescribeBotLocaleRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotLocaleResponse) => void): Request<LexModelsV2.Types.DescribeBotLocaleResponse, AWSError>;
  /**
   * Describes the settings that a bot has for a specific locale. 
   */
  describeBotLocale(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotLocaleResponse) => void): Request<LexModelsV2.Types.DescribeBotLocaleResponse, AWSError>;
  /**
   * Provides metadata information about a bot recommendation. This information will enable you to get a description on the request inputs, to download associated transcripts after processing is complete, and to download intents and slot-types generated by the bot recommendation.
   */
  describeBotRecommendation(params: LexModelsV2.Types.DescribeBotRecommendationRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotRecommendationResponse) => void): Request<LexModelsV2.Types.DescribeBotRecommendationResponse, AWSError>;
  /**
   * Provides metadata information about a bot recommendation. This information will enable you to get a description on the request inputs, to download associated transcripts after processing is complete, and to download intents and slot-types generated by the bot recommendation.
   */
  describeBotRecommendation(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotRecommendationResponse) => void): Request<LexModelsV2.Types.DescribeBotRecommendationResponse, AWSError>;
  /**
   * Provides metadata about a version of a bot.
   */
  describeBotVersion(params: LexModelsV2.Types.DescribeBotVersionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotVersionResponse) => void): Request<LexModelsV2.Types.DescribeBotVersionResponse, AWSError>;
  /**
   * Provides metadata about a version of a bot.
   */
  describeBotVersion(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotVersionResponse) => void): Request<LexModelsV2.Types.DescribeBotVersionResponse, AWSError>;
  /**
   * Provides metadata information about a custom vocabulary.
   */
  describeCustomVocabularyMetadata(params: LexModelsV2.Types.DescribeCustomVocabularyMetadataRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeCustomVocabularyMetadataResponse) => void): Request<LexModelsV2.Types.DescribeCustomVocabularyMetadataResponse, AWSError>;
  /**
   * Provides metadata information about a custom vocabulary.
   */
  describeCustomVocabularyMetadata(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeCustomVocabularyMetadataResponse) => void): Request<LexModelsV2.Types.DescribeCustomVocabularyMetadataResponse, AWSError>;
  /**
   * Gets information about a specific export.
   */
  describeExport(params: LexModelsV2.Types.DescribeExportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeExportResponse) => void): Request<LexModelsV2.Types.DescribeExportResponse, AWSError>;
  /**
   * Gets information about a specific export.
   */
  describeExport(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeExportResponse) => void): Request<LexModelsV2.Types.DescribeExportResponse, AWSError>;
  /**
   * Gets information about a specific import.
   */
  describeImport(params: LexModelsV2.Types.DescribeImportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeImportResponse) => void): Request<LexModelsV2.Types.DescribeImportResponse, AWSError>;
  /**
   * Gets information about a specific import.
   */
  describeImport(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeImportResponse) => void): Request<LexModelsV2.Types.DescribeImportResponse, AWSError>;
  /**
   * Returns metadata about an intent.
   */
  describeIntent(params: LexModelsV2.Types.DescribeIntentRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeIntentResponse) => void): Request<LexModelsV2.Types.DescribeIntentResponse, AWSError>;
  /**
   * Returns metadata about an intent.
   */
  describeIntent(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeIntentResponse) => void): Request<LexModelsV2.Types.DescribeIntentResponse, AWSError>;
  /**
   * Gets the resource policy and policy revision for a bot or bot alias.
   */
  describeResourcePolicy(params: LexModelsV2.Types.DescribeResourcePolicyRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeResourcePolicyResponse) => void): Request<LexModelsV2.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Gets the resource policy and policy revision for a bot or bot alias.
   */
  describeResourcePolicy(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeResourcePolicyResponse) => void): Request<LexModelsV2.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Gets metadata information about a slot.
   */
  describeSlot(params: LexModelsV2.Types.DescribeSlotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeSlotResponse) => void): Request<LexModelsV2.Types.DescribeSlotResponse, AWSError>;
  /**
   * Gets metadata information about a slot.
   */
  describeSlot(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeSlotResponse) => void): Request<LexModelsV2.Types.DescribeSlotResponse, AWSError>;
  /**
   * Gets metadata information about a slot type.
   */
  describeSlotType(params: LexModelsV2.Types.DescribeSlotTypeRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeSlotTypeResponse) => void): Request<LexModelsV2.Types.DescribeSlotTypeResponse, AWSError>;
  /**
   * Gets metadata information about a slot type.
   */
  describeSlotType(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeSlotTypeResponse) => void): Request<LexModelsV2.Types.DescribeSlotTypeResponse, AWSError>;
  /**
   * Gets metadata information about the test execution.
   */
  describeTestExecution(params: LexModelsV2.Types.DescribeTestExecutionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestExecutionResponse) => void): Request<LexModelsV2.Types.DescribeTestExecutionResponse, AWSError>;
  /**
   * Gets metadata information about the test execution.
   */
  describeTestExecution(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestExecutionResponse) => void): Request<LexModelsV2.Types.DescribeTestExecutionResponse, AWSError>;
  /**
   * Gets metadata information about the test set.
   */
  describeTestSet(params: LexModelsV2.Types.DescribeTestSetRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestSetResponse) => void): Request<LexModelsV2.Types.DescribeTestSetResponse, AWSError>;
  /**
   * Gets metadata information about the test set.
   */
  describeTestSet(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestSetResponse) => void): Request<LexModelsV2.Types.DescribeTestSetResponse, AWSError>;
  /**
   * Gets metadata information about the test set discrepancy report.
   */
  describeTestSetDiscrepancyReport(params: LexModelsV2.Types.DescribeTestSetDiscrepancyReportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestSetDiscrepancyReportResponse) => void): Request<LexModelsV2.Types.DescribeTestSetDiscrepancyReportResponse, AWSError>;
  /**
   * Gets metadata information about the test set discrepancy report.
   */
  describeTestSetDiscrepancyReport(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestSetDiscrepancyReportResponse) => void): Request<LexModelsV2.Types.DescribeTestSetDiscrepancyReportResponse, AWSError>;
  /**
   * Gets metadata information about the test set generation.
   */
  describeTestSetGeneration(params: LexModelsV2.Types.DescribeTestSetGenerationRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestSetGenerationResponse) => void): Request<LexModelsV2.Types.DescribeTestSetGenerationResponse, AWSError>;
  /**
   * Gets metadata information about the test set generation.
   */
  describeTestSetGeneration(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeTestSetGenerationResponse) => void): Request<LexModelsV2.Types.DescribeTestSetGenerationResponse, AWSError>;
  /**
   * The pre-signed Amazon S3 URL to download the test execution result artifacts.
   */
  getTestExecutionArtifactsUrl(params: LexModelsV2.Types.GetTestExecutionArtifactsUrlRequest, callback?: (err: AWSError, data: LexModelsV2.Types.GetTestExecutionArtifactsUrlResponse) => void): Request<LexModelsV2.Types.GetTestExecutionArtifactsUrlResponse, AWSError>;
  /**
   * The pre-signed Amazon S3 URL to download the test execution result artifacts.
   */
  getTestExecutionArtifactsUrl(callback?: (err: AWSError, data: LexModelsV2.Types.GetTestExecutionArtifactsUrlResponse) => void): Request<LexModelsV2.Types.GetTestExecutionArtifactsUrlResponse, AWSError>;
  /**
   * Provides a list of utterances that users have sent to the bot. Utterances are aggregated by the text of the utterance. For example, all instances where customers used the phrase "I want to order pizza" are aggregated into the same line in the response. You can see both detected utterances and missed utterances. A detected utterance is where the bot properly recognized the utterance and activated the associated intent. A missed utterance was not recognized by the bot and didn't activate an intent. Utterances can be aggregated for a bot alias or for a bot version, but not both at the same time. Utterances statistics are not generated under the following conditions:   The childDirected field was set to true when the bot was created.   You are using slot obfuscation with one or more slots.   You opted out of participating in improving Amazon Lex.  
   */
  listAggregatedUtterances(params: LexModelsV2.Types.ListAggregatedUtterancesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListAggregatedUtterancesResponse) => void): Request<LexModelsV2.Types.ListAggregatedUtterancesResponse, AWSError>;
  /**
   * Provides a list of utterances that users have sent to the bot. Utterances are aggregated by the text of the utterance. For example, all instances where customers used the phrase "I want to order pizza" are aggregated into the same line in the response. You can see both detected utterances and missed utterances. A detected utterance is where the bot properly recognized the utterance and activated the associated intent. A missed utterance was not recognized by the bot and didn't activate an intent. Utterances can be aggregated for a bot alias or for a bot version, but not both at the same time. Utterances statistics are not generated under the following conditions:   The childDirected field was set to true when the bot was created.   You are using slot obfuscation with one or more slots.   You opted out of participating in improving Amazon Lex.  
   */
  listAggregatedUtterances(callback?: (err: AWSError, data: LexModelsV2.Types.ListAggregatedUtterancesResponse) => void): Request<LexModelsV2.Types.ListAggregatedUtterancesResponse, AWSError>;
  /**
   * Gets a list of aliases for the specified bot.
   */
  listBotAliases(params: LexModelsV2.Types.ListBotAliasesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBotAliasesResponse) => void): Request<LexModelsV2.Types.ListBotAliasesResponse, AWSError>;
  /**
   * Gets a list of aliases for the specified bot.
   */
  listBotAliases(callback?: (err: AWSError, data: LexModelsV2.Types.ListBotAliasesResponse) => void): Request<LexModelsV2.Types.ListBotAliasesResponse, AWSError>;
  /**
   * Gets a list of locales for the specified bot.
   */
  listBotLocales(params: LexModelsV2.Types.ListBotLocalesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBotLocalesResponse) => void): Request<LexModelsV2.Types.ListBotLocalesResponse, AWSError>;
  /**
   * Gets a list of locales for the specified bot.
   */
  listBotLocales(callback?: (err: AWSError, data: LexModelsV2.Types.ListBotLocalesResponse) => void): Request<LexModelsV2.Types.ListBotLocalesResponse, AWSError>;
  /**
   * Get a list of bot recommendations that meet the specified criteria.
   */
  listBotRecommendations(params: LexModelsV2.Types.ListBotRecommendationsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBotRecommendationsResponse) => void): Request<LexModelsV2.Types.ListBotRecommendationsResponse, AWSError>;
  /**
   * Get a list of bot recommendations that meet the specified criteria.
   */
  listBotRecommendations(callback?: (err: AWSError, data: LexModelsV2.Types.ListBotRecommendationsResponse) => void): Request<LexModelsV2.Types.ListBotRecommendationsResponse, AWSError>;
  /**
   * Gets information about all of the versions of a bot. The ListBotVersions operation returns a summary of each version of a bot. For example, if a bot has three numbered versions, the ListBotVersions operation returns for summaries, one for each numbered version and one for the DRAFT version. The ListBotVersions operation always returns at least one version, the DRAFT version.
   */
  listBotVersions(params: LexModelsV2.Types.ListBotVersionsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBotVersionsResponse) => void): Request<LexModelsV2.Types.ListBotVersionsResponse, AWSError>;
  /**
   * Gets information about all of the versions of a bot. The ListBotVersions operation returns a summary of each version of a bot. For example, if a bot has three numbered versions, the ListBotVersions operation returns for summaries, one for each numbered version and one for the DRAFT version. The ListBotVersions operation always returns at least one version, the DRAFT version.
   */
  listBotVersions(callback?: (err: AWSError, data: LexModelsV2.Types.ListBotVersionsResponse) => void): Request<LexModelsV2.Types.ListBotVersionsResponse, AWSError>;
  /**
   * Gets a list of available bots.
   */
  listBots(params: LexModelsV2.Types.ListBotsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBotsResponse) => void): Request<LexModelsV2.Types.ListBotsResponse, AWSError>;
  /**
   * Gets a list of available bots.
   */
  listBots(callback?: (err: AWSError, data: LexModelsV2.Types.ListBotsResponse) => void): Request<LexModelsV2.Types.ListBotsResponse, AWSError>;
  /**
   * Gets a list of built-in intents provided by Amazon Lex that you can use in your bot.  To use a built-in intent as a the base for your own intent, include the built-in intent signature in the parentIntentSignature parameter when you call the CreateIntent operation. For more information, see CreateIntent.
   */
  listBuiltInIntents(params: LexModelsV2.Types.ListBuiltInIntentsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBuiltInIntentsResponse) => void): Request<LexModelsV2.Types.ListBuiltInIntentsResponse, AWSError>;
  /**
   * Gets a list of built-in intents provided by Amazon Lex that you can use in your bot.  To use a built-in intent as a the base for your own intent, include the built-in intent signature in the parentIntentSignature parameter when you call the CreateIntent operation. For more information, see CreateIntent.
   */
  listBuiltInIntents(callback?: (err: AWSError, data: LexModelsV2.Types.ListBuiltInIntentsResponse) => void): Request<LexModelsV2.Types.ListBuiltInIntentsResponse, AWSError>;
  /**
   * Gets a list of built-in slot types that meet the specified criteria.
   */
  listBuiltInSlotTypes(params: LexModelsV2.Types.ListBuiltInSlotTypesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListBuiltInSlotTypesResponse) => void): Request<LexModelsV2.Types.ListBuiltInSlotTypesResponse, AWSError>;
  /**
   * Gets a list of built-in slot types that meet the specified criteria.
   */
  listBuiltInSlotTypes(callback?: (err: AWSError, data: LexModelsV2.Types.ListBuiltInSlotTypesResponse) => void): Request<LexModelsV2.Types.ListBuiltInSlotTypesResponse, AWSError>;
  /**
   * Paginated list of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  listCustomVocabularyItems(params: LexModelsV2.Types.ListCustomVocabularyItemsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListCustomVocabularyItemsResponse) => void): Request<LexModelsV2.Types.ListCustomVocabularyItemsResponse, AWSError>;
  /**
   * Paginated list of custom vocabulary items for a given bot locale's custom vocabulary.
   */
  listCustomVocabularyItems(callback?: (err: AWSError, data: LexModelsV2.Types.ListCustomVocabularyItemsResponse) => void): Request<LexModelsV2.Types.ListCustomVocabularyItemsResponse, AWSError>;
  /**
   * Lists the exports for a bot, bot locale, or custom vocabulary. Exports are kept in the list for 7 days.
   */
  listExports(params: LexModelsV2.Types.ListExportsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListExportsResponse) => void): Request<LexModelsV2.Types.ListExportsResponse, AWSError>;
  /**
   * Lists the exports for a bot, bot locale, or custom vocabulary. Exports are kept in the list for 7 days.
   */
  listExports(callback?: (err: AWSError, data: LexModelsV2.Types.ListExportsResponse) => void): Request<LexModelsV2.Types.ListExportsResponse, AWSError>;
  /**
   * Lists the imports for a bot, bot locale, or custom vocabulary. Imports are kept in the list for 7 days.
   */
  listImports(params: LexModelsV2.Types.ListImportsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListImportsResponse) => void): Request<LexModelsV2.Types.ListImportsResponse, AWSError>;
  /**
   * Lists the imports for a bot, bot locale, or custom vocabulary. Imports are kept in the list for 7 days.
   */
  listImports(callback?: (err: AWSError, data: LexModelsV2.Types.ListImportsResponse) => void): Request<LexModelsV2.Types.ListImportsResponse, AWSError>;
  /**
   * Retrieves summary metrics for the intents in your bot. The following fields are required:    metrics – A list of AnalyticsIntentMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. You can specify only one order in a given request.
   */
  listIntentMetrics(params: LexModelsV2.Types.ListIntentMetricsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentMetricsResponse) => void): Request<LexModelsV2.Types.ListIntentMetricsResponse, AWSError>;
  /**
   * Retrieves summary metrics for the intents in your bot. The following fields are required:    metrics – A list of AnalyticsIntentMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. You can specify only one order in a given request.
   */
  listIntentMetrics(callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentMetricsResponse) => void): Request<LexModelsV2.Types.ListIntentMetricsResponse, AWSError>;
  /**
   * Retrieves summary statistics for a path of intents that users take over sessions with your bot. The following fields are required:    startDateTime and endDateTime – Define a time range for which you want to retrieve results.    intentPath – Define an order of intents for which you want to retrieve metrics. Separate intents in the path with a forward slash. For example, populate the intentPath field with /BookCar/BookHotel to see details about how many times users invoked the BookCar and BookHotel intents in that order.   Use the optional filters field to filter the results.
   */
  listIntentPaths(params: LexModelsV2.Types.ListIntentPathsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentPathsResponse) => void): Request<LexModelsV2.Types.ListIntentPathsResponse, AWSError>;
  /**
   * Retrieves summary statistics for a path of intents that users take over sessions with your bot. The following fields are required:    startDateTime and endDateTime – Define a time range for which you want to retrieve results.    intentPath – Define an order of intents for which you want to retrieve metrics. Separate intents in the path with a forward slash. For example, populate the intentPath field with /BookCar/BookHotel to see details about how many times users invoked the BookCar and BookHotel intents in that order.   Use the optional filters field to filter the results.
   */
  listIntentPaths(callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentPathsResponse) => void): Request<LexModelsV2.Types.ListIntentPathsResponse, AWSError>;
  /**
   * Retrieves summary metrics for the stages within intents in your bot. The following fields are required:    metrics – A list of AnalyticsIntentStageMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. You can only specify one order in a given request.
   */
  listIntentStageMetrics(params: LexModelsV2.Types.ListIntentStageMetricsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentStageMetricsResponse) => void): Request<LexModelsV2.Types.ListIntentStageMetricsResponse, AWSError>;
  /**
   * Retrieves summary metrics for the stages within intents in your bot. The following fields are required:    metrics – A list of AnalyticsIntentStageMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. You can only specify one order in a given request.
   */
  listIntentStageMetrics(callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentStageMetricsResponse) => void): Request<LexModelsV2.Types.ListIntentStageMetricsResponse, AWSError>;
  /**
   * Get a list of intents that meet the specified criteria.
   */
  listIntents(params: LexModelsV2.Types.ListIntentsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentsResponse) => void): Request<LexModelsV2.Types.ListIntentsResponse, AWSError>;
  /**
   * Get a list of intents that meet the specified criteria.
   */
  listIntents(callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentsResponse) => void): Request<LexModelsV2.Types.ListIntentsResponse, AWSError>;
  /**
   * Gets a list of recommended intents provided by the bot recommendation that you can use in your bot. Intents in the response are ordered by relevance.
   */
  listRecommendedIntents(params: LexModelsV2.Types.ListRecommendedIntentsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListRecommendedIntentsResponse) => void): Request<LexModelsV2.Types.ListRecommendedIntentsResponse, AWSError>;
  /**
   * Gets a list of recommended intents provided by the bot recommendation that you can use in your bot. Intents in the response are ordered by relevance.
   */
  listRecommendedIntents(callback?: (err: AWSError, data: LexModelsV2.Types.ListRecommendedIntentsResponse) => void): Request<LexModelsV2.Types.ListRecommendedIntentsResponse, AWSError>;
  /**
   * Retrieves a list of metadata for individual user sessions with your bot. The startDateTime and endDateTime fields are required. These fields define a time range for which you want to retrieve results. Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results and the sortBy field to specify the values by which to sort the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.  
   */
  listSessionAnalyticsData(params: LexModelsV2.Types.ListSessionAnalyticsDataRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListSessionAnalyticsDataResponse) => void): Request<LexModelsV2.Types.ListSessionAnalyticsDataResponse, AWSError>;
  /**
   * Retrieves a list of metadata for individual user sessions with your bot. The startDateTime and endDateTime fields are required. These fields define a time range for which you want to retrieve results. Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results and the sortBy field to specify the values by which to sort the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.  
   */
  listSessionAnalyticsData(callback?: (err: AWSError, data: LexModelsV2.Types.ListSessionAnalyticsDataResponse) => void): Request<LexModelsV2.Types.ListSessionAnalyticsDataResponse, AWSError>;
  /**
   * Retrieves summary metrics for the user sessions with your bot. The following fields are required:    metrics – A list of AnalyticsSessionMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. Currently, you can specify it in either field, but not in both.
   */
  listSessionMetrics(params: LexModelsV2.Types.ListSessionMetricsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListSessionMetricsResponse) => void): Request<LexModelsV2.Types.ListSessionMetricsResponse, AWSError>;
  /**
   * Retrieves summary metrics for the user sessions with your bot. The following fields are required:    metrics – A list of AnalyticsSessionMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. Currently, you can specify it in either field, but not in both.
   */
  listSessionMetrics(callback?: (err: AWSError, data: LexModelsV2.Types.ListSessionMetricsResponse) => void): Request<LexModelsV2.Types.ListSessionMetricsResponse, AWSError>;
  /**
   * Gets a list of slot types that match the specified criteria.
   */
  listSlotTypes(params: LexModelsV2.Types.ListSlotTypesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListSlotTypesResponse) => void): Request<LexModelsV2.Types.ListSlotTypesResponse, AWSError>;
  /**
   * Gets a list of slot types that match the specified criteria.
   */
  listSlotTypes(callback?: (err: AWSError, data: LexModelsV2.Types.ListSlotTypesResponse) => void): Request<LexModelsV2.Types.ListSlotTypesResponse, AWSError>;
  /**
   * Gets a list of slots that match the specified criteria.
   */
  listSlots(params: LexModelsV2.Types.ListSlotsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListSlotsResponse) => void): Request<LexModelsV2.Types.ListSlotsResponse, AWSError>;
  /**
   * Gets a list of slots that match the specified criteria.
   */
  listSlots(callback?: (err: AWSError, data: LexModelsV2.Types.ListSlotsResponse) => void): Request<LexModelsV2.Types.ListSlotsResponse, AWSError>;
  /**
   * Gets a list of tags associated with a resource. Only bots, bot aliases, and bot channels can have tags associated with them.
   */
  listTagsForResource(params: LexModelsV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListTagsForResourceResponse) => void): Request<LexModelsV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets a list of tags associated with a resource. Only bots, bot aliases, and bot channels can have tags associated with them.
   */
  listTagsForResource(callback?: (err: AWSError, data: LexModelsV2.Types.ListTagsForResourceResponse) => void): Request<LexModelsV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets a list of test execution result items.
   */
  listTestExecutionResultItems(params: LexModelsV2.Types.ListTestExecutionResultItemsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListTestExecutionResultItemsResponse) => void): Request<LexModelsV2.Types.ListTestExecutionResultItemsResponse, AWSError>;
  /**
   * Gets a list of test execution result items.
   */
  listTestExecutionResultItems(callback?: (err: AWSError, data: LexModelsV2.Types.ListTestExecutionResultItemsResponse) => void): Request<LexModelsV2.Types.ListTestExecutionResultItemsResponse, AWSError>;
  /**
   * The list of test set executions.
   */
  listTestExecutions(params: LexModelsV2.Types.ListTestExecutionsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListTestExecutionsResponse) => void): Request<LexModelsV2.Types.ListTestExecutionsResponse, AWSError>;
  /**
   * The list of test set executions.
   */
  listTestExecutions(callback?: (err: AWSError, data: LexModelsV2.Types.ListTestExecutionsResponse) => void): Request<LexModelsV2.Types.ListTestExecutionsResponse, AWSError>;
  /**
   * The list of test set records.
   */
  listTestSetRecords(params: LexModelsV2.Types.ListTestSetRecordsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListTestSetRecordsResponse) => void): Request<LexModelsV2.Types.ListTestSetRecordsResponse, AWSError>;
  /**
   * The list of test set records.
   */
  listTestSetRecords(callback?: (err: AWSError, data: LexModelsV2.Types.ListTestSetRecordsResponse) => void): Request<LexModelsV2.Types.ListTestSetRecordsResponse, AWSError>;
  /**
   * The list of the test sets
   */
  listTestSets(params: LexModelsV2.Types.ListTestSetsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListTestSetsResponse) => void): Request<LexModelsV2.Types.ListTestSetsResponse, AWSError>;
  /**
   * The list of the test sets
   */
  listTestSets(callback?: (err: AWSError, data: LexModelsV2.Types.ListTestSetsResponse) => void): Request<LexModelsV2.Types.ListTestSetsResponse, AWSError>;
  /**
   *  To use this API operation, your IAM role must have permissions to perform the ListAggregatedUtterances operation, which provides access to utterance-related analytics. See Viewing utterance statistics for the IAM policy to apply to the IAM role.  Retrieves a list of metadata for individual user utterances to your bot. The following fields are required:    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results and the sortBy field to specify the values by which to sort the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.  
   */
  listUtteranceAnalyticsData(params: LexModelsV2.Types.ListUtteranceAnalyticsDataRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListUtteranceAnalyticsDataResponse) => void): Request<LexModelsV2.Types.ListUtteranceAnalyticsDataResponse, AWSError>;
  /**
   *  To use this API operation, your IAM role must have permissions to perform the ListAggregatedUtterances operation, which provides access to utterance-related analytics. See Viewing utterance statistics for the IAM policy to apply to the IAM role.  Retrieves a list of metadata for individual user utterances to your bot. The following fields are required:    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results and the sortBy field to specify the values by which to sort the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.  
   */
  listUtteranceAnalyticsData(callback?: (err: AWSError, data: LexModelsV2.Types.ListUtteranceAnalyticsDataResponse) => void): Request<LexModelsV2.Types.ListUtteranceAnalyticsDataResponse, AWSError>;
  /**
   *  To use this API operation, your IAM role must have permissions to perform the ListAggregatedUtterances operation, which provides access to utterance-related analytics. See Viewing utterance statistics for the IAM policy to apply to the IAM role.  Retrieves summary metrics for the utterances in your bot. The following fields are required:    metrics – A list of AnalyticsUtteranceMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. Currently, you can specify it in either field, but not in both.
   */
  listUtteranceMetrics(params: LexModelsV2.Types.ListUtteranceMetricsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListUtteranceMetricsResponse) => void): Request<LexModelsV2.Types.ListUtteranceMetricsResponse, AWSError>;
  /**
   *  To use this API operation, your IAM role must have permissions to perform the ListAggregatedUtterances operation, which provides access to utterance-related analytics. See Viewing utterance statistics for the IAM policy to apply to the IAM role.  Retrieves summary metrics for the utterances in your bot. The following fields are required:    metrics – A list of AnalyticsUtteranceMetric objects. In each object, use the name field to specify the metric to calculate, the statistic field to specify whether to calculate the Sum, Average, or Max number, and the order field to specify whether to sort the results in Ascending or Descending order.    startDateTime and endDateTime – Define a time range for which you want to retrieve results.   Of the optional fields, you can organize the results in the following ways:   Use the filters field to filter the results, the groupBy field to specify categories by which to group the results, and the binBy field to specify time intervals by which to group the results.   Use the maxResults field to limit the number of results to return in a single response and the nextToken field to return the next batch of results if the response does not return the full set of results.   Note that an order field exists in both binBy and metrics. Currently, you can specify it in either field, but not in both.
   */
  listUtteranceMetrics(callback?: (err: AWSError, data: LexModelsV2.Types.ListUtteranceMetricsResponse) => void): Request<LexModelsV2.Types.ListUtteranceMetricsResponse, AWSError>;
  /**
   * Search for associated transcripts that meet the specified criteria.
   */
  searchAssociatedTranscripts(params: LexModelsV2.Types.SearchAssociatedTranscriptsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.SearchAssociatedTranscriptsResponse) => void): Request<LexModelsV2.Types.SearchAssociatedTranscriptsResponse, AWSError>;
  /**
   * Search for associated transcripts that meet the specified criteria.
   */
  searchAssociatedTranscripts(callback?: (err: AWSError, data: LexModelsV2.Types.SearchAssociatedTranscriptsResponse) => void): Request<LexModelsV2.Types.SearchAssociatedTranscriptsResponse, AWSError>;
  /**
   * Use this to provide your transcript data, and to start the bot recommendation process.
   */
  startBotRecommendation(params: LexModelsV2.Types.StartBotRecommendationRequest, callback?: (err: AWSError, data: LexModelsV2.Types.StartBotRecommendationResponse) => void): Request<LexModelsV2.Types.StartBotRecommendationResponse, AWSError>;
  /**
   * Use this to provide your transcript data, and to start the bot recommendation process.
   */
  startBotRecommendation(callback?: (err: AWSError, data: LexModelsV2.Types.StartBotRecommendationResponse) => void): Request<LexModelsV2.Types.StartBotRecommendationResponse, AWSError>;
  /**
   * Starts importing a bot, bot locale, or custom vocabulary from a zip archive that you uploaded to an S3 bucket.
   */
  startImport(params: LexModelsV2.Types.StartImportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.StartImportResponse) => void): Request<LexModelsV2.Types.StartImportResponse, AWSError>;
  /**
   * Starts importing a bot, bot locale, or custom vocabulary from a zip archive that you uploaded to an S3 bucket.
   */
  startImport(callback?: (err: AWSError, data: LexModelsV2.Types.StartImportResponse) => void): Request<LexModelsV2.Types.StartImportResponse, AWSError>;
  /**
   * The action to start test set execution.
   */
  startTestExecution(params: LexModelsV2.Types.StartTestExecutionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.StartTestExecutionResponse) => void): Request<LexModelsV2.Types.StartTestExecutionResponse, AWSError>;
  /**
   * The action to start test set execution.
   */
  startTestExecution(callback?: (err: AWSError, data: LexModelsV2.Types.StartTestExecutionResponse) => void): Request<LexModelsV2.Types.StartTestExecutionResponse, AWSError>;
  /**
   * The action to start the generation of test set.
   */
  startTestSetGeneration(params: LexModelsV2.Types.StartTestSetGenerationRequest, callback?: (err: AWSError, data: LexModelsV2.Types.StartTestSetGenerationResponse) => void): Request<LexModelsV2.Types.StartTestSetGenerationResponse, AWSError>;
  /**
   * The action to start the generation of test set.
   */
  startTestSetGeneration(callback?: (err: AWSError, data: LexModelsV2.Types.StartTestSetGenerationResponse) => void): Request<LexModelsV2.Types.StartTestSetGenerationResponse, AWSError>;
  /**
   * Stop an already running Bot Recommendation request.
   */
  stopBotRecommendation(params: LexModelsV2.Types.StopBotRecommendationRequest, callback?: (err: AWSError, data: LexModelsV2.Types.StopBotRecommendationResponse) => void): Request<LexModelsV2.Types.StopBotRecommendationResponse, AWSError>;
  /**
   * Stop an already running Bot Recommendation request.
   */
  stopBotRecommendation(callback?: (err: AWSError, data: LexModelsV2.Types.StopBotRecommendationResponse) => void): Request<LexModelsV2.Types.StopBotRecommendationResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource. If a tag key already exists, the existing value is replaced with the new value.
   */
  tagResource(params: LexModelsV2.Types.TagResourceRequest, callback?: (err: AWSError, data: LexModelsV2.Types.TagResourceResponse) => void): Request<LexModelsV2.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource. If a tag key already exists, the existing value is replaced with the new value.
   */
  tagResource(callback?: (err: AWSError, data: LexModelsV2.Types.TagResourceResponse) => void): Request<LexModelsV2.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a bot, bot alias, or bot channel.
   */
  untagResource(params: LexModelsV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UntagResourceResponse) => void): Request<LexModelsV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a bot, bot alias, or bot channel.
   */
  untagResource(callback?: (err: AWSError, data: LexModelsV2.Types.UntagResourceResponse) => void): Request<LexModelsV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the configuration of an existing bot. 
   */
  updateBot(params: LexModelsV2.Types.UpdateBotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotResponse) => void): Request<LexModelsV2.Types.UpdateBotResponse, AWSError>;
  /**
   * Updates the configuration of an existing bot. 
   */
  updateBot(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotResponse) => void): Request<LexModelsV2.Types.UpdateBotResponse, AWSError>;
  /**
   * Updates the configuration of an existing bot alias.
   */
  updateBotAlias(params: LexModelsV2.Types.UpdateBotAliasRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotAliasResponse) => void): Request<LexModelsV2.Types.UpdateBotAliasResponse, AWSError>;
  /**
   * Updates the configuration of an existing bot alias.
   */
  updateBotAlias(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotAliasResponse) => void): Request<LexModelsV2.Types.UpdateBotAliasResponse, AWSError>;
  /**
   * Updates the settings that a bot has for a specific locale.
   */
  updateBotLocale(params: LexModelsV2.Types.UpdateBotLocaleRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotLocaleResponse) => void): Request<LexModelsV2.Types.UpdateBotLocaleResponse, AWSError>;
  /**
   * Updates the settings that a bot has for a specific locale.
   */
  updateBotLocale(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotLocaleResponse) => void): Request<LexModelsV2.Types.UpdateBotLocaleResponse, AWSError>;
  /**
   * Updates an existing bot recommendation request.
   */
  updateBotRecommendation(params: LexModelsV2.Types.UpdateBotRecommendationRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotRecommendationResponse) => void): Request<LexModelsV2.Types.UpdateBotRecommendationResponse, AWSError>;
  /**
   * Updates an existing bot recommendation request.
   */
  updateBotRecommendation(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateBotRecommendationResponse) => void): Request<LexModelsV2.Types.UpdateBotRecommendationResponse, AWSError>;
  /**
   * Updates the password used to protect an export zip archive. The password is not required. If you don't supply a password, Amazon Lex generates a zip file that is not protected by a password. This is the archive that is available at the pre-signed S3 URL provided by the DescribeExport operation.
   */
  updateExport(params: LexModelsV2.Types.UpdateExportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateExportResponse) => void): Request<LexModelsV2.Types.UpdateExportResponse, AWSError>;
  /**
   * Updates the password used to protect an export zip archive. The password is not required. If you don't supply a password, Amazon Lex generates a zip file that is not protected by a password. This is the archive that is available at the pre-signed S3 URL provided by the DescribeExport operation.
   */
  updateExport(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateExportResponse) => void): Request<LexModelsV2.Types.UpdateExportResponse, AWSError>;
  /**
   * Updates the settings for an intent.
   */
  updateIntent(params: LexModelsV2.Types.UpdateIntentRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateIntentResponse) => void): Request<LexModelsV2.Types.UpdateIntentResponse, AWSError>;
  /**
   * Updates the settings for an intent.
   */
  updateIntent(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateIntentResponse) => void): Request<LexModelsV2.Types.UpdateIntentResponse, AWSError>;
  /**
   * Replaces the existing resource policy for a bot or bot alias with a new one. If the policy doesn't exist, Amazon Lex returns an exception.
   */
  updateResourcePolicy(params: LexModelsV2.Types.UpdateResourcePolicyRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateResourcePolicyResponse) => void): Request<LexModelsV2.Types.UpdateResourcePolicyResponse, AWSError>;
  /**
   * Replaces the existing resource policy for a bot or bot alias with a new one. If the policy doesn't exist, Amazon Lex returns an exception.
   */
  updateResourcePolicy(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateResourcePolicyResponse) => void): Request<LexModelsV2.Types.UpdateResourcePolicyResponse, AWSError>;
  /**
   * Updates the settings for a slot.
   */
  updateSlot(params: LexModelsV2.Types.UpdateSlotRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateSlotResponse) => void): Request<LexModelsV2.Types.UpdateSlotResponse, AWSError>;
  /**
   * Updates the settings for a slot.
   */
  updateSlot(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateSlotResponse) => void): Request<LexModelsV2.Types.UpdateSlotResponse, AWSError>;
  /**
   * Updates the configuration of an existing slot type.
   */
  updateSlotType(params: LexModelsV2.Types.UpdateSlotTypeRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateSlotTypeResponse) => void): Request<LexModelsV2.Types.UpdateSlotTypeResponse, AWSError>;
  /**
   * Updates the configuration of an existing slot type.
   */
  updateSlotType(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateSlotTypeResponse) => void): Request<LexModelsV2.Types.UpdateSlotTypeResponse, AWSError>;
  /**
   * The action to update the test set.
   */
  updateTestSet(params: LexModelsV2.Types.UpdateTestSetRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateTestSetResponse) => void): Request<LexModelsV2.Types.UpdateTestSetResponse, AWSError>;
  /**
   * The action to update the test set.
   */
  updateTestSet(callback?: (err: AWSError, data: LexModelsV2.Types.UpdateTestSetResponse) => void): Request<LexModelsV2.Types.UpdateTestSetResponse, AWSError>;
}
declare namespace LexModelsV2 {
  export interface ActiveContext {
    /**
     * The name of active context.
     */
    name: ActiveContextName;
  }
  export type ActiveContextList = ActiveContext[];
  export type ActiveContextName = string;
  export interface AdvancedRecognitionSetting {
    /**
     * Enables using the slot values as a custom vocabulary for recognizing user utterances.
     */
    audioRecognitionStrategy?: AudioRecognitionStrategy;
  }
  export interface AgentTurnResult {
    /**
     * The expected agent prompt for the agent turn in a test set execution.
     */
    expectedAgentPrompt: TestSetAgentPrompt;
    /**
     * The actual agent prompt for the agent turn in a test set execution.
     */
    actualAgentPrompt?: TestSetAgentPrompt;
    errorDetails?: ExecutionErrorDetails;
    /**
     * The actual elicited slot for the agent turn in a test set execution.
     */
    actualElicitedSlot?: TestResultSlotName;
    /**
     * The actual intent for the agent turn in a test set execution.
     */
    actualIntent?: Name;
  }
  export interface AgentTurnSpecification {
    /**
     * The agent prompt for the agent turn in a test set.
     */
    agentPrompt: TestSetAgentPrompt;
  }
  export interface AggregatedUtterancesFilter {
    /**
     * The name of the field to filter the utterance list.
     */
    name: AggregatedUtterancesFilterName;
    /**
     * The value to use for filtering the list of bots.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListAggregatedUtterances operation should return only utterances that equal the specified value. Specify CO when the ListAggregatedUtterances operation should return utterances that contain the specified value.
     */
    operator: AggregatedUtterancesFilterOperator;
  }
  export type AggregatedUtterancesFilterName = "Utterance"|string;
  export type AggregatedUtterancesFilterOperator = "CO"|"EQ"|string;
  export type AggregatedUtterancesFilters = AggregatedUtterancesFilter[];
  export type AggregatedUtterancesSortAttribute = "HitCount"|"MissedCount"|string;
  export interface AggregatedUtterancesSortBy {
    /**
     * The utterance attribute to sort by.
     */
    attribute: AggregatedUtterancesSortAttribute;
    /**
     * Specifies whether to sort the aggregated utterances in ascending or descending order.
     */
    order: SortOrder;
  }
  export interface AggregatedUtterancesSummary {
    /**
     * The text of the utterance. If the utterance was used with the RecognizeUtterance operation, the text is the transcription of the audio utterance.
     */
    utterance?: Utterance;
    /**
     * The number of times that the utterance was detected by Amazon Lex during the time period. When an utterance is detected, it activates an intent or a slot.
     */
    hitCount?: HitCount;
    /**
     * The number of times that the utterance was missed by Amazon Lex An utterance is missed when it doesn't activate an intent or slot.
     */
    missedCount?: MissedCount;
    /**
     * The date and time that the utterance was first recorded in the time window for aggregation. An utterance may have been sent to Amazon Lex before that time, but only utterances within the time window are counted.
     */
    utteranceFirstRecordedInAggregationDuration?: Timestamp;
    /**
     * The last date and time that an utterance was recorded in the time window for aggregation. An utterance may be sent to Amazon Lex after that time, but only utterances within the time window are counted.
     */
    utteranceLastRecordedInAggregationDuration?: Timestamp;
    /**
     * Aggregated utterance data may contain utterances from versions of your bot that have since been deleted. When the aggregated contains this kind of data, this field is set to true.
     */
    containsDataFromDeletedResources?: BoxedBoolean;
  }
  export type AggregatedUtterancesSummaryList = AggregatedUtterancesSummary[];
  export interface AllowedInputTypes {
    /**
     * Indicates whether audio input is allowed.
     */
    allowAudioInput: BoxedBoolean;
    /**
     * Indicates whether DTMF input is allowed.
     */
    allowDTMFInput: BoxedBoolean;
  }
  export type AmazonResourceName = string;
  export type AnalyticsBinByList = AnalyticsBinBySpecification[];
  export type AnalyticsBinByName = "ConversationStartTime"|"UtteranceTimestamp"|string;
  export interface AnalyticsBinBySpecification {
    /**
     * Specifies the time metric by which to bin the analytics data.
     */
    name: AnalyticsBinByName;
    /**
     * Specifies the interval of time by which to bin the analytics data.
     */
    interval: AnalyticsInterval;
    /**
     * Specifies whether to bin the analytics data in ascending or descending order. If this field is left blank, the default order is by the key of the bin in descending order.
     */
    order?: AnalyticsSortOrder;
  }
  export interface AnalyticsBinKey {
    /**
     * The criterion by which to bin the results.
     */
    name?: AnalyticsBinByName;
    /**
     * The value of the criterion that defines the bin.
     */
    value?: AnalyticsBinValue;
  }
  export type AnalyticsBinKeys = AnalyticsBinKey[];
  export type AnalyticsBinValue = number;
  export type AnalyticsChannel = string;
  export type AnalyticsCommonFilterName = "BotAliasId"|"BotVersion"|"LocaleId"|"Modality"|"Channel"|string;
  export type AnalyticsFilterOperator = "EQ"|"GT"|"LT"|string;
  export type AnalyticsFilterValue = string;
  export type AnalyticsFilterValues = AnalyticsFilterValue[];
  export type AnalyticsGroupByValue = string;
  export type AnalyticsIntentField = "IntentName"|"IntentEndState"|"IntentLevel"|string;
  export interface AnalyticsIntentFilter {
    /**
     * The category by which to filter the intents. The descriptions for each option are as follows:    BotAlias – The name of the bot alias.    BotVersion – The version of the bot.    LocaleId – The locale of the bot.    Modality – The modality of the session with the bot (audio, DTMF, or text).    Channel – The channel that the bot is integrated with.    SessionId – The identifier of the session with the bot.    OriginatingRequestId – The identifier of the first request in a session.    IntentName – The name of the intent.    IntentEndState – The final state of the intent.  
     */
    name: AnalyticsIntentFilterName;
    /**
     * The operation by which to filter the category. The following operations are possible:    CO – Contains    EQ – Equals    GT – Greater than    LT – Less than   The operators that each filter supports are listed below:    BotAlias – EQ.    BotVersion – EQ.    LocaleId – EQ.    Modality – EQ.    Channel – EQ.    SessionId – EQ.    OriginatingRequestId – EQ.    IntentName – EQ, CO.    IntentEndState – EQ, CO.  
     */
    operator: AnalyticsFilterOperator;
    /**
     * An array containing the values of the category by which to apply the operator to filter the results. You can provide multiple values if the operator is EQ or CO. If you provide multiple values, you filter for results that equal/contain any of the values. For example, if the name, operator, and values fields are Modality, EQ, and [Speech, Text], the operation filters for results where the modality was either Speech or Text.
     */
    values: AnalyticsFilterValues;
  }
  export type AnalyticsIntentFilterName = "BotAliasId"|"BotVersion"|"LocaleId"|"Modality"|"Channel"|"SessionId"|"OriginatingRequestId"|"IntentName"|"IntentEndState"|string;
  export type AnalyticsIntentFilters = AnalyticsIntentFilter[];
  export interface AnalyticsIntentGroupByKey {
    /**
     * A category by which the intent analytics were grouped.
     */
    name?: AnalyticsIntentField;
    /**
     * A member of the category by which the intent analytics were grouped.
     */
    value?: AnalyticsGroupByValue;
  }
  export type AnalyticsIntentGroupByKeys = AnalyticsIntentGroupByKey[];
  export type AnalyticsIntentGroupByList = AnalyticsIntentGroupBySpecification[];
  export interface AnalyticsIntentGroupBySpecification {
    /**
     * Specifies whether to group the intent stages by their name or their end state.
     */
    name: AnalyticsIntentField;
  }
  export interface AnalyticsIntentMetric {
    /**
     * The metric for which you want to get intent summary statistics.    Count – The number of times the intent was invoked.    Success – The number of times the intent succeeded.    Failure – The number of times the intent failed.    Switched – The number of times there was a switch to a different intent.    Dropped – The number of times the user dropped the intent.  
     */
    name: AnalyticsIntentMetricName;
    /**
     * The summary statistic to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of intents in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic: AnalyticsMetricStatistic;
    /**
     * Specifies whether to sort the results in ascending or descending order.
     */
    order?: AnalyticsSortOrder;
  }
  export type AnalyticsIntentMetricName = "Count"|"Success"|"Failure"|"Switched"|"Dropped"|string;
  export interface AnalyticsIntentMetricResult {
    /**
     * The metric that you requested. See Key definitions for more details about these metrics.    Count – The number of times the intent was invoked.    Success – The number of times the intent succeeded.    Failure – The number of times the intent failed.    Switched – The number of times there was a switch to a different intent.    Dropped – The number of times the user dropped the intent.  
     */
    name?: AnalyticsIntentMetricName;
    /**
     * The statistic that you requested to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of intents in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic?: AnalyticsMetricStatistic;
    /**
     * The value of the summary statistic for the metric that you requested.
     */
    value?: AnalyticsMetricValue;
  }
  export type AnalyticsIntentMetricResults = AnalyticsIntentMetricResult[];
  export type AnalyticsIntentMetrics = AnalyticsIntentMetric[];
  export type AnalyticsIntentNodeSummaries = AnalyticsIntentNodeSummary[];
  export interface AnalyticsIntentNodeSummary {
    /**
     * The name of the intent at the end of the requested path.
     */
    intentName?: Name;
    /**
     * The path.
     */
    intentPath?: AnalyticsPath;
    /**
     * The total number of sessions that follow the given path to the given intent.
     */
    intentCount?: AnalyticsNodeCount;
    /**
     * The number of intents up to and including the requested path.
     */
    intentLevel?: AnalyticsNodeLevel;
    /**
     * Specifies whether the node is the end of a path (Exit) or not (Inner).
     */
    nodeType?: AnalyticsNodeType;
  }
  export interface AnalyticsIntentResult {
    /**
     * A list of objects containing the criteria you requested for binning results and the values of the bins.
     */
    binKeys?: AnalyticsBinKeys;
    /**
     * A list of objects containing the criteria you requested for grouping results and the values of the groups.
     */
    groupByKeys?: AnalyticsIntentGroupByKeys;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metricsResults?: AnalyticsIntentMetricResults;
  }
  export type AnalyticsIntentResults = AnalyticsIntentResult[];
  export type AnalyticsIntentStageField = "IntentStageName"|"SwitchedToIntent"|string;
  export interface AnalyticsIntentStageFilter {
    /**
     * The category by which to filter the intent stages. The descriptions for each option are as follows:    BotAlias – The name of the bot alias.    BotVersion – The version of the bot.    LocaleId – The locale of the bot.    Modality – The modality of the session with the bot (audio, DTMF, or text).    Channel – The channel that the bot is integrated with.    SessionId – The identifier of the session with the bot.    OriginatingRequestId – The identifier of the first request in a session.    IntentName – The name of the intent.    IntentStageName – The stage in the intent.  
     */
    name: AnalyticsIntentStageFilterName;
    /**
     * The operation by which to filter the category. The following operations are possible:    CO – Contains    EQ – Equals    GT – Greater than    LT – Less than   The operators that each filter supports are listed below:    BotAlias – EQ.    BotVersion – EQ.    LocaleId – EQ.    Modality – EQ.    Channel – EQ.    SessionId – EQ.    OriginatingRequestId – EQ.    IntentName – EQ, CO.    IntentStageName – EQ, CO.  
     */
    operator: AnalyticsFilterOperator;
    /**
     * An array containing the values of the category by which to apply the operator to filter the results. You can provide multiple values if the operator is EQ or CO. If you provide multiple values, you filter for results that equal/contain any of the values. For example, if the name, operator, and values fields are Modality, EQ, and [Speech, Text], the operation filters for results where the modality was either Speech or Text.
     */
    values: AnalyticsFilterValues;
  }
  export type AnalyticsIntentStageFilterName = "BotAliasId"|"BotVersion"|"LocaleId"|"Modality"|"Channel"|"SessionId"|"OriginatingRequestId"|"IntentName"|"IntentStageName"|string;
  export type AnalyticsIntentStageFilters = AnalyticsIntentStageFilter[];
  export interface AnalyticsIntentStageGroupByKey {
    /**
     * A category by which the intent stage analytics were grouped.
     */
    name?: AnalyticsIntentStageField;
    /**
     * A member of the category by which the intent stage analytics were grouped.
     */
    value?: AnalyticsGroupByValue;
  }
  export type AnalyticsIntentStageGroupByKeys = AnalyticsIntentStageGroupByKey[];
  export type AnalyticsIntentStageGroupByList = AnalyticsIntentStageGroupBySpecification[];
  export interface AnalyticsIntentStageGroupBySpecification {
    /**
     * Specifies whether to group the intent stages by their name or the intent to which the session was switched.
     */
    name: AnalyticsIntentStageField;
  }
  export interface AnalyticsIntentStageMetric {
    /**
     * The metric for which you want to get intent stage summary statistics. See Key definitions for more details about these metrics.    Count – The number of times the intent stage occurred.    Success – The number of times the intent stage succeeded.    Failure – The number of times the intent stage failed.    Dropped – The number of times the user dropped the intent stage.    Retry – The number of times the bot tried to elicit a response from the user at this stage.  
     */
    name: AnalyticsIntentStageMetricName;
    /**
     * The summary statistic to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of intent stages in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic: AnalyticsMetricStatistic;
    /**
     * Specifies whether to sort the results in ascending or descending order of the summary statistic (value in the response).
     */
    order?: AnalyticsSortOrder;
  }
  export type AnalyticsIntentStageMetricName = "Count"|"Success"|"Failed"|"Dropped"|"Retry"|string;
  export interface AnalyticsIntentStageMetricResult {
    /**
     * The metric that you requested.    Count – The number of times the intent stage occurred.    Success – The number of times the intent stage succeeded.    Failure – The number of times the intent stage failed.    Dropped – The number of times the user dropped the intent stage.    Retry – The number of times the bot tried to elicit a response from the user at this stage.  
     */
    name?: AnalyticsIntentStageMetricName;
    /**
     * The summary statistic that you requested to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of intent stages in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic?: AnalyticsMetricStatistic;
    /**
     * The value of the summary statistic for the metric that you requested.
     */
    value?: AnalyticsMetricValue;
  }
  export type AnalyticsIntentStageMetricResults = AnalyticsIntentStageMetricResult[];
  export type AnalyticsIntentStageMetrics = AnalyticsIntentStageMetric[];
  export interface AnalyticsIntentStageResult {
    /**
     * A list of objects containing the criteria you requested for binning results and the values of the bins.
     */
    binKeys?: AnalyticsBinKeys;
    /**
     * A list of objects containing the criteria you requested for grouping results and the values of the bins.
     */
    groupByKeys?: AnalyticsIntentStageGroupByKeys;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metricsResults?: AnalyticsIntentStageMetricResults;
  }
  export type AnalyticsIntentStageResults = AnalyticsIntentStageResult[];
  export type AnalyticsInterval = "OneHour"|"OneDay"|string;
  export type AnalyticsLongValue = number;
  export type AnalyticsMetricStatistic = "Sum"|"Avg"|"Max"|string;
  export type AnalyticsMetricValue = number;
  export type AnalyticsModality = "Speech"|"Text"|"DTMF"|"MultiMode"|string;
  export type AnalyticsNodeCount = number;
  export type AnalyticsNodeLevel = number;
  export type AnalyticsNodeType = "Inner"|"Exit"|string;
  export type AnalyticsOriginatingRequestId = string;
  export type AnalyticsPath = string;
  export interface AnalyticsPathFilter {
    /**
     * The category by which to filter the intent paths. The descriptions for each option are as follows:    BotAlias – The name of the bot alias.    BotVersion – The version of the bot.    LocaleId – The locale of the bot.    Modality – The modality of the session with the bot (audio, DTMF, or text).    Channel – The channel that the bot is integrated with.  
     */
    name: AnalyticsCommonFilterName;
    /**
     * The operation by which to filter the category. The following operations are possible:    CO – Contains    EQ – Equals    GT – Greater than    LT – Less than   The operators that each filter supports are listed below:    BotAlias – EQ.    BotVersion – EQ.    LocaleId – EQ.    Modality – EQ.    Channel – EQ.  
     */
    operator: AnalyticsFilterOperator;
    /**
     * An array containing the values of the category by which to apply the operator to filter the results. You can provide multiple values if the operator is EQ or CO. If you provide multiple values, you filter for results that equal/contain any of the values. For example, if the name, operator, and values fields are Modality, EQ, and [Speech, Text], the operation filters for results where the modality was either Speech or Text.
     */
    values: AnalyticsFilterValues;
  }
  export type AnalyticsPathFilters = AnalyticsPathFilter[];
  export type AnalyticsSessionField = "ConversationEndState"|"LocaleId"|string;
  export interface AnalyticsSessionFilter {
    /**
     * The category by which to filter the sessions. The descriptions for each option are as follows:    BotAlias – The name of the bot alias.    BotVersion – The version of the bot.    LocaleId – The locale of the bot.    Modality – The modality of the session with the bot (audio, DTMF, or text).    Channel – The channel that the bot is integrated with.    Duration – The duration of the session.    conversationEndState – The final state of the session.    SessionId – The identifier of the session with the bot.    OriginatingRequestId – The identifier of the first request in a session.    IntentPath – The order of intents taken in a session.  
     */
    name: AnalyticsSessionFilterName;
    /**
     * The operation by which to filter the category. The following operations are possible:    CO – Contains    EQ – Equals    GT – Greater than    LT – Less than   The operators that each filter supports are listed below:    BotAlias – EQ.    BotVersion – EQ.    LocaleId – EQ.    Modality – EQ.    Channel – EQ.    Duration – EQ, GT, LT.    conversationEndState – EQ, CO.    SessionId – EQ.    OriginatingRequestId – EQ.    IntentPath – EQ.  
     */
    operator: AnalyticsFilterOperator;
    /**
     * An array containing the values of the category by which to apply the operator to filter the results. You can provide multiple values if the operator is EQ or CO. If you provide multiple values, you filter for results that equal/contain any of the values. For example, if the name, operator, and values fields are Modality, EQ, and [Speech, Text], the operation filters for results where the modality was either Speech or Text.
     */
    values: AnalyticsFilterValues;
  }
  export type AnalyticsSessionFilterName = "BotAliasId"|"BotVersion"|"LocaleId"|"Modality"|"Channel"|"Duration"|"ConversationEndState"|"SessionId"|"OriginatingRequestId"|"IntentPath"|string;
  export type AnalyticsSessionFilters = AnalyticsSessionFilter[];
  export interface AnalyticsSessionGroupByKey {
    /**
     * The category by which the session analytics were grouped.
     */
    name?: AnalyticsSessionField;
    /**
     * A member of the category by which the session analytics were grouped.
     */
    value?: AnalyticsGroupByValue;
  }
  export type AnalyticsSessionGroupByKeys = AnalyticsSessionGroupByKey[];
  export type AnalyticsSessionGroupByList = AnalyticsSessionGroupBySpecification[];
  export interface AnalyticsSessionGroupBySpecification {
    /**
     * Specifies whether to group the session by their end state or their locale.
     */
    name: AnalyticsSessionField;
  }
  export type AnalyticsSessionId = string;
  export interface AnalyticsSessionMetric {
    /**
     * The metric for which you want to get session summary statistics.    Count – The number of sessions.    Success – The number of sessions that succeeded.    Failure – The number of sessions that failed.    Dropped – The number of sessions that the user dropped.    Duration – The duration of sessions.    TurnsPerSession – The number of turns in the sessions.    Concurrency – The number of sessions occurring in the same period of time.  
     */
    name: AnalyticsSessionMetricName;
    /**
     * The summary statistic to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of sessions in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic: AnalyticsMetricStatistic;
    /**
     * Specifies whether to sort the results in ascending or descending order.
     */
    order?: AnalyticsSortOrder;
  }
  export type AnalyticsSessionMetricName = "Count"|"Success"|"Failure"|"Dropped"|"Duration"|"TurnsPerConversation"|"Concurrency"|string;
  export interface AnalyticsSessionMetricResult {
    /**
     * The metric that you requested.    Count – The number of sessions.    Success – The number of sessions that succeeded.    Failure – The number of sessions that failed.    Dropped – The number of sessions that the user dropped.    Duration – The duration of sessions.    TurnPersession – The number of turns in the sessions.    Concurrency – The number of sessions occurring in the same period of time.  
     */
    name?: AnalyticsSessionMetricName;
    /**
     * The summary statistic that you requested to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of sessions in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic?: AnalyticsMetricStatistic;
    /**
     * The value of the summary statistic for the metric that you requested.
     */
    value?: AnalyticsMetricValue;
  }
  export type AnalyticsSessionMetricResults = AnalyticsSessionMetricResult[];
  export type AnalyticsSessionMetrics = AnalyticsSessionMetric[];
  export interface AnalyticsSessionResult {
    /**
     * A list of objects containing the criteria you requested for binning results and the values of the bins.
     */
    binKeys?: AnalyticsBinKeys;
    /**
     * A list of objects containing the criteria you requested for grouping results and the values of the bins.
     */
    groupByKeys?: AnalyticsSessionGroupByKeys;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metricsResults?: AnalyticsSessionMetricResults;
  }
  export type AnalyticsSessionResults = AnalyticsSessionResult[];
  export type AnalyticsSessionSortByName = "ConversationStartTime"|"NumberOfTurns"|"Duration"|string;
  export type AnalyticsSortOrder = "Ascending"|"Descending"|string;
  export interface AnalyticsUtteranceAttribute {
    /**
     * An attribute to return. The only available attribute is the intent that the bot mapped the utterance to.
     */
    name: AnalyticsUtteranceAttributeName;
  }
  export type AnalyticsUtteranceAttributeName = "LastUsedIntent"|string;
  export interface AnalyticsUtteranceAttributeResult {
    /**
     * The intent that the bot mapped the utterance to.
     */
    lastUsedIntent?: Name;
  }
  export type AnalyticsUtteranceAttributeResults = AnalyticsUtteranceAttributeResult[];
  export type AnalyticsUtteranceAttributes = AnalyticsUtteranceAttribute[];
  export type AnalyticsUtteranceField = "UtteranceText"|"UtteranceState"|string;
  export interface AnalyticsUtteranceFilter {
    /**
     * The category by which to filter the utterances. The descriptions for each option are as follows:    BotAlias – The name of the bot alias.    BotVersion – The version of the bot.    LocaleId – The locale of the bot.    Modality – The modality of the session with the bot (audio, DTMF, or text).    Channel – The channel that the bot is integrated with.    SessionId – The identifier of the session with the bot.    OriginatingRequestId – The identifier of the first request in a session.    UtteranceState – The state of the utterance.    UtteranceText – The text in the utterance.  
     */
    name: AnalyticsUtteranceFilterName;
    /**
     * The operation by which to filter the category. The following operations are possible:    CO – Contains    EQ – Equals    GT – Greater than    LT – Less than   The operators that each filter supports are listed below:    BotAlias – EQ.    BotVersion – EQ.    LocaleId – EQ.    Modality – EQ.    Channel – EQ.    SessionId – EQ.    OriginatingRequestId – EQ.    UtteranceState – EQ.    UtteranceText – EQ, CO.  
     */
    operator: AnalyticsFilterOperator;
    /**
     * An array containing the values of the category by which to apply the operator to filter the results. You can provide multiple values if the operator is EQ or CO. If you provide multiple values, you filter for results that equal/contain any of the values. For example, if the name, operator, and values fields are Modality, EQ, and [Speech, Text], the operation filters for results where the modality was either Speech or Text.
     */
    values: AnalyticsFilterValues;
  }
  export type AnalyticsUtteranceFilterName = "BotAliasId"|"BotVersion"|"LocaleId"|"Modality"|"Channel"|"SessionId"|"OriginatingRequestId"|"UtteranceState"|"UtteranceText"|string;
  export type AnalyticsUtteranceFilters = AnalyticsUtteranceFilter[];
  export interface AnalyticsUtteranceGroupByKey {
    /**
     * The category by which the utterance analytics were grouped.
     */
    name?: AnalyticsUtteranceField;
    /**
     * A member of the category by which the utterance analytics were grouped.
     */
    value?: AnalyticsGroupByValue;
  }
  export type AnalyticsUtteranceGroupByKeys = AnalyticsUtteranceGroupByKey[];
  export type AnalyticsUtteranceGroupByList = AnalyticsUtteranceGroupBySpecification[];
  export interface AnalyticsUtteranceGroupBySpecification {
    /**
     * Specifies whether to group the utterances by their text or their state.
     */
    name: AnalyticsUtteranceField;
  }
  export interface AnalyticsUtteranceMetric {
    /**
     * The metric for which you want to get utterance summary statistics.    Count – The number of utterances.    Missed – The number of utterances that Amazon Lex failed to recognize.    Detected – The number of utterances that Amazon Lex managed to detect.    UtteranceTimestamp – The date and time of the utterance.  
     */
    name: AnalyticsUtteranceMetricName;
    /**
     * The summary statistic to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of utterances in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic: AnalyticsMetricStatistic;
    /**
     * Specifies whether to sort the results in ascending or descending order.
     */
    order?: AnalyticsSortOrder;
  }
  export type AnalyticsUtteranceMetricName = "Count"|"Missed"|"Detected"|"UtteranceTimestamp"|string;
  export interface AnalyticsUtteranceMetricResult {
    /**
     * The metric that you requested.    Count – The number of utterances.    Missed – The number of utterances that Amazon Lex failed to recognize.    Detected – The number of utterances that Amazon Lex managed to detect.    UtteranceTimestamp – The date and time of the utterance.  
     */
    name?: AnalyticsUtteranceMetricName;
    /**
     * The summary statistic that you requested to calculate.    Sum – The total count for the category you provide in name.    Average – The total count divided by the number of utterances in the category you provide in name.    Max – The highest count in the category you provide in name.  
     */
    statistic?: AnalyticsMetricStatistic;
    /**
     * The value of the summary statistic for the metric that you requested.
     */
    value?: AnalyticsMetricValue;
  }
  export type AnalyticsUtteranceMetricResults = AnalyticsUtteranceMetricResult[];
  export type AnalyticsUtteranceMetrics = AnalyticsUtteranceMetric[];
  export interface AnalyticsUtteranceResult {
    /**
     * A list of objects containing the criteria you requested for binning results and the values of the bins.
     */
    binKeys?: AnalyticsBinKeys;
    /**
     * A list of objects containing the criteria you requested for grouping results and the values of the bins.
     */
    groupByKeys?: AnalyticsUtteranceGroupByKeys;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metricsResults?: AnalyticsUtteranceMetricResults;
    /**
     * A list of objects containing information about the last used intent at the time of an utterance.
     */
    attributeResults?: AnalyticsUtteranceAttributeResults;
  }
  export type AnalyticsUtteranceResults = AnalyticsUtteranceResult[];
  export type AnalyticsUtteranceSortByName = "UtteranceTimestamp"|string;
  export interface AssociatedTranscript {
    /**
     * The content of the transcript that meets the search filter criteria. For the JSON format of the transcript, see Output transcript format.
     */
    transcript?: Transcript;
  }
  export interface AssociatedTranscriptFilter {
    /**
     * The name of the field to use for filtering. The allowed names are IntentId and SlotTypeId.
     */
    name: AssociatedTranscriptFilterName;
    /**
     * The values to use to filter the transcript.
     */
    values: FilterValues;
  }
  export type AssociatedTranscriptFilterName = "IntentId"|"SlotTypeId"|string;
  export type AssociatedTranscriptFilters = AssociatedTranscriptFilter[];
  export type AssociatedTranscriptList = AssociatedTranscript[];
  export type AttachmentTitle = string;
  export type AttachmentUrl = string;
  export interface AudioAndDTMFInputSpecification {
    /**
     * Time for which a bot waits before assuming that the customer isn't going to speak or press a key. This timeout is shared between Audio and DTMF inputs.
     */
    startTimeoutMs: TimeInMilliSeconds;
    /**
     * Specifies the settings on audio input.
     */
    audioSpecification?: AudioSpecification;
    /**
     * Specifies the settings on DTMF input.
     */
    dtmfSpecification?: DTMFSpecification;
  }
  export type AudioFileS3Location = string;
  export interface AudioLogDestination {
    /**
     * The Amazon S3 bucket where the audio log files are stored. The IAM role specified in the roleArn parameter of the CreateBot operation must have permission to write to this bucket.
     */
    s3Bucket: S3BucketLogDestination;
  }
  export interface AudioLogSetting {
    /**
     * Determines whether audio logging in enabled for the bot.
     */
    enabled: Boolean;
    destination: AudioLogDestination;
  }
  export type AudioLogSettingsList = AudioLogSetting[];
  export type AudioRecognitionStrategy = "UseSlotValuesAsCustomVocabulary"|string;
  export interface AudioSpecification {
    /**
     * Time for how long Amazon Lex waits before speech input is truncated and the speech is returned to application.
     */
    maxLengthMs: TimeInMilliSeconds;
    /**
     * Time for which a bot waits after the customer stops speaking to assume the utterance is finished.
     */
    endTimeoutMs: TimeInMilliSeconds;
  }
  export interface BatchCreateCustomVocabularyItemRequest {
    /**
     * The identifier of the bot associated with this custom vocabulary.
     */
    botId: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see  Supported Languages .
     */
    localeId: LocaleId;
    /**
     * A list of new custom vocabulary items. Each entry must contain a phrase and can optionally contain a displayAs and/or a weight.
     */
    customVocabularyItemList: CreateCustomVocabularyItemsList;
  }
  export interface BatchCreateCustomVocabularyItemResponse {
    /**
     * The identifier of the bot associated with this custom vocabulary.
     */
    botId?: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see  Supported Languages .
     */
    localeId?: LocaleId;
    /**
     * A list of custom vocabulary items that failed to create during the operation. The reason for the error is contained within each error object.
     */
    errors?: FailedCustomVocabularyItems;
    /**
     * A list of custom vocabulary items that were successfully created during the operation.
     */
    resources?: CustomVocabularyItems;
  }
  export interface BatchDeleteCustomVocabularyItemRequest {
    /**
     * The identifier of the bot associated with this custom vocabulary.
     */
    botId: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see  Supported Languages .
     */
    localeId: LocaleId;
    /**
     * A list of custom vocabulary items requested to be deleted. Each entry must contain the unique custom vocabulary entry identifier.
     */
    customVocabularyItemList: DeleteCustomVocabularyItemsList;
  }
  export interface BatchDeleteCustomVocabularyItemResponse {
    /**
     * The identifier of the bot associated with this custom vocabulary.
     */
    botId?: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see Supported languages (https://docs.aws.amazon.com/lexv2/latest/dg/how-languages.html).
     */
    localeId?: LocaleId;
    /**
     * A list of custom vocabulary items that failed to delete during the operation. The reason for the error is contained within each error object.
     */
    errors?: FailedCustomVocabularyItems;
    /**
     * A list of custom vocabulary items that were successfully deleted during the operation.
     */
    resources?: CustomVocabularyItems;
  }
  export interface BatchUpdateCustomVocabularyItemRequest {
    /**
     * The identifier of the bot associated with this custom vocabulary
     */
    botId: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see  Supported Languages .
     */
    localeId: LocaleId;
    /**
     * A list of custom vocabulary items with updated fields. Each entry must contain a phrase and can optionally contain a displayAs and/or a weight.
     */
    customVocabularyItemList: UpdateCustomVocabularyItemsList;
  }
  export interface BatchUpdateCustomVocabularyItemResponse {
    /**
     * The identifier of the bot associated with this custom vocabulary.
     */
    botId?: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see  Supported Languages .
     */
    localeId?: LocaleId;
    /**
     * A list of custom vocabulary items that failed to update during the operation. The reason for the error is contained within each error object.
     */
    errors?: FailedCustomVocabularyItems;
    /**
     * A list of custom vocabulary items that were successfully updated during the operation.
     */
    resources?: CustomVocabularyItems;
  }
  export type Boolean = boolean;
  export interface BotAliasHistoryEvent {
    /**
     * The version of the bot that was used in the event. 
     */
    botVersion?: BotVersion;
    /**
     * The date and time that the event started.
     */
    startDate?: Timestamp;
    /**
     * The date and time that the event ended.
     */
    endDate?: Timestamp;
  }
  export type BotAliasHistoryEventsList = BotAliasHistoryEvent[];
  export type BotAliasId = string;
  export interface BotAliasLocaleSettings {
    /**
     * Determines whether the locale is enabled for the bot. If the value is false, the locale isn't available for use.
     */
    enabled: Boolean;
    /**
     * Specifies the Lambda function that should be used in the locale.
     */
    codeHookSpecification?: CodeHookSpecification;
  }
  export type BotAliasLocaleSettingsMap = {[key: string]: BotAliasLocaleSettings};
  export type BotAliasName = string;
  export type BotAliasStatus = "Creating"|"Available"|"Deleting"|"Failed"|string;
  export interface BotAliasSummary {
    /**
     * The unique identifier assigned to the bot alias. You can use this ID to get detailed information about the alias using the DescribeBotAlias operation.
     */
    botAliasId?: BotAliasId;
    /**
     * The name of the bot alias.
     */
    botAliasName?: Name;
    /**
     * The description of the bot alias.
     */
    description?: Description;
    /**
     * The version of the bot that the bot alias references.
     */
    botVersion?: BotVersion;
    /**
     * The current state of the bot alias. If the status is Available, the alias is ready for use.
     */
    botAliasStatus?: BotAliasStatus;
    /**
     * A timestamp of the date and time that the bot alias was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot alias was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type BotAliasSummaryList = BotAliasSummary[];
  export interface BotAliasTestExecutionTarget {
    /**
     * The bot Id of the bot alias used in the test set execution.
     */
    botId: Id;
    /**
     * The bot alias Id of the bot alias used in the test set execution.
     */
    botAliasId: BotAliasId;
    /**
     * The locale Id of the bot alias used in the test set execution.
     */
    localeId: LocaleId;
  }
  export interface BotExportSpecification {
    /**
     * The identifier of the bot assigned by Amazon Lex.
     */
    botId: Id;
    /**
     * The version of the bot that was exported. This will be either DRAFT or the version number.
     */
    botVersion: BotVersion;
  }
  export interface BotFilter {
    /**
     * The name of the field to filter the list of bots.
     */
    name: BotFilterName;
    /**
     * The value to use for filtering the list of bots.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListBots operation should return only aliases that equal the specified value. Specify CO when the ListBots operation should return aliases that contain the specified value.
     */
    operator: BotFilterOperator;
  }
  export type BotFilterName = "BotName"|"BotType"|string;
  export type BotFilterOperator = "CO"|"EQ"|"NE"|string;
  export type BotFilters = BotFilter[];
  export interface BotImportSpecification {
    /**
     * The name that Amazon Lex should use for the bot.
     */
    botName: Name;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used to build and run the bot.
     */
    roleArn: RoleArn;
    dataPrivacy: DataPrivacy;
    /**
     * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.  A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout. You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
     */
    idleSessionTTLInSeconds?: SessionTTL;
    /**
     * A list of tags to add to the bot. You can only add tags when you import a bot. You can't use the UpdateBot operation to update tags. To update tags, use the TagResource operation.
     */
    botTags?: TagMap;
    /**
     * A list of tags to add to the test alias for a bot. You can only add tags when you import a bot. You can't use the UpdateAlias operation to update tags. To update tags on the test alias, use the TagResource operation.
     */
    testBotAliasTags?: TagMap;
  }
  export interface BotLocaleExportSpecification {
    /**
     * The identifier of the bot to create the locale for.
     */
    botId: Id;
    /**
     * The version of the bot to export.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale to export. The string must match one of the locales in the bot.
     */
    localeId: LocaleId;
  }
  export interface BotLocaleFilter {
    /**
     * The name of the field to filter the list of bots.
     */
    name: BotLocaleFilterName;
    /**
     * The value to use for filtering the list of bots.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListBotLocales operation should return only aliases that equal the specified value. Specify CO when the ListBotLocales operation should return aliases that contain the specified value.
     */
    operator: BotLocaleFilterOperator;
  }
  export type BotLocaleFilterName = "BotLocaleName"|string;
  export type BotLocaleFilterOperator = "CO"|"EQ"|string;
  export type BotLocaleFilters = BotLocaleFilter[];
  export interface BotLocaleHistoryEvent {
    /**
     * A description of the event that occurred.
     */
    event: BotLocaleHistoryEventDescription;
    /**
     * A timestamp of the date and time that the event occurred.
     */
    eventDate: Timestamp;
  }
  export type BotLocaleHistoryEventDescription = string;
  export type BotLocaleHistoryEventsList = BotLocaleHistoryEvent[];
  export interface BotLocaleImportSpecification {
    /**
     * The identifier of the bot to import the locale to.
     */
    botId: Id;
    /**
     * The version of the bot to import the locale to. This can only be the DRAFT version of the bot.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the bot will be used in. The string must match one of the supported locales. All of the intents, slot types, and slots used in the bot must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Determines the threshold where Amazon Lex will insert the AMAZON.FallbackIntent, AMAZON.KendraSearchIntent, or both when returning alternative intents. AMAZON.FallbackIntent and AMAZON.KendraSearchIntent are only inserted if they are configured for the bot.  For example, suppose a bot is configured with the confidence threshold of 0.80 and the AMAZON.FallbackIntent. Amazon Lex returns three alternative intents with the following confidence scores: IntentA (0.70), IntentB (0.60), IntentC (0.50). The response from the PostText operation would be:    AMAZON.FallbackIntent     IntentA     IntentB     IntentC   
     */
    nluIntentConfidenceThreshold?: ConfidenceThreshold;
    voiceSettings?: VoiceSettings;
  }
  export type BotLocaleSortAttribute = "BotLocaleName"|string;
  export interface BotLocaleSortBy {
    /**
     * The bot locale attribute to sort by.
     */
    attribute: BotLocaleSortAttribute;
    /**
     * Specifies whether to sort the bot locales in ascending or descending order.
     */
    order: SortOrder;
  }
  export type BotLocaleStatus = "Creating"|"Building"|"Built"|"ReadyExpressTesting"|"Failed"|"Deleting"|"NotBuilt"|"Importing"|"Processing"|string;
  export interface BotLocaleSummary {
    /**
     * The language and locale of the bot locale.
     */
    localeId?: LocaleId;
    /**
     * The name of the bot locale.
     */
    localeName?: LocaleName;
    /**
     * The description of the bot locale.
     */
    description?: Description;
    /**
     * The current status of the bot locale. When the status is Built the locale is ready for use.
     */
    botLocaleStatus?: BotLocaleStatus;
    /**
     * A timestamp of the date and time that the bot locale was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot locale was last built.
     */
    lastBuildSubmittedDateTime?: Timestamp;
  }
  export type BotLocaleSummaryList = BotLocaleSummary[];
  export interface BotMember {
    /**
     * The unique ID of a bot that is a member of this network of bots.
     */
    botMemberId: Id;
    /**
     * The unique name of a bot that is a member of this network of bots.
     */
    botMemberName: Name;
    /**
     * The alias ID of a bot that is a member of this network of bots.
     */
    botMemberAliasId: BotAliasId;
    /**
     * The alias name of a bot that is a member of this network of bots.
     */
    botMemberAliasName: BotAliasName;
    /**
     * The version of a bot that is a member of this network of bots.
     */
    botMemberVersion: BotVersion;
  }
  export type BotMembers = BotMember[];
  export interface BotRecommendationResultStatistics {
    /**
     * Statistical information about about the intents associated with the bot recommendation results.
     */
    intents?: IntentStatistics;
    /**
     * Statistical information about the slot types associated with the bot recommendation results.
     */
    slotTypes?: SlotTypeStatistics;
  }
  export interface BotRecommendationResults {
    /**
     * The presigned URL link of the recommended bot definition.
     */
    botLocaleExportUrl?: PresignedS3Url;
    /**
     * The presigned url link of the associated transcript.
     */
    associatedTranscriptsUrl?: PresignedS3Url;
    /**
     * The statistical summary of the bot recommendation results.
     */
    statistics?: BotRecommendationResultStatistics;
  }
  export type BotRecommendationStatus = "Processing"|"Deleting"|"Deleted"|"Downloading"|"Updating"|"Available"|"Failed"|"Stopping"|"Stopped"|string;
  export interface BotRecommendationSummary {
    /**
     * The status of the bot recommendation. If the status is Failed, then the reasons for the failure are listed in the failureReasons field. 
     */
    botRecommendationStatus: BotRecommendationStatus;
    /**
     * The unique identifier of the bot recommendation to be updated.
     */
    botRecommendationId: Id;
    /**
     * A timestamp of the date and time that the bot recommendation was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot recommendation was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type BotRecommendationSummaryList = BotRecommendationSummary[];
  export type BotSortAttribute = "BotName"|string;
  export interface BotSortBy {
    /**
     * The attribute to use to sort the list of bots.
     */
    attribute: BotSortAttribute;
    /**
     * The order to sort the list. You can choose ascending or descending.
     */
    order: SortOrder;
  }
  export type BotStatus = "Creating"|"Available"|"Inactive"|"Deleting"|"Failed"|"Versioning"|"Importing"|"Updating"|string;
  export interface BotSummary {
    /**
     * The unique identifier assigned to the bot. Use this ID to get detailed information about the bot with the DescribeBot operation.
     */
    botId?: Id;
    /**
     * The name of the bot.
     */
    botName?: Name;
    /**
     * The description of the bot.
     */
    description?: Description;
    /**
     * The current status of the bot. When the status is Available the bot is ready for use.
     */
    botStatus?: BotStatus;
    /**
     * The latest numerical version in use for the bot.
     */
    latestBotVersion?: NumericalBotVersion;
    /**
     * The date and time that the bot was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The type of the bot.
     */
    botType?: BotType;
  }
  export type BotSummaryList = BotSummary[];
  export type BotType = "Bot"|"BotNetwork"|string;
  export type BotVersion = string;
  export interface BotVersionLocaleDetails {
    /**
     * The version of a bot used for a bot locale.
     */
    sourceBotVersion: BotVersion;
  }
  export type BotVersionLocaleSpecification = {[key: string]: BotVersionLocaleDetails};
  export type BotVersionSortAttribute = "BotVersion"|string;
  export interface BotVersionSortBy {
    /**
     * The attribute to use to sort the list of versions.
     */
    attribute: BotVersionSortAttribute;
    /**
     * The order to sort the list. You can specify ascending or descending order.
     */
    order: SortOrder;
  }
  export interface BotVersionSummary {
    /**
     * The name of the bot associated with the version.
     */
    botName?: Name;
    /**
     * The numeric version of the bot, or DRAFT to indicate that this is the version of the bot that can be updated..
     */
    botVersion?: BotVersion;
    /**
     * The description of the version.
     */
    description?: Description;
    /**
     * The status of the bot. When the status is available, the version of the bot is ready for use.
     */
    botStatus?: BotStatus;
    /**
     * A timestamp of the date and time that the version was created.
     */
    creationDateTime?: Timestamp;
  }
  export type BotVersionSummaryList = BotVersionSummary[];
  export type BoxedBoolean = boolean;
  export interface BuildBotLocaleRequest {
    /**
     * The identifier of the bot to build. The identifier is returned in the response from the CreateBot operation.
     */
    botId: Id;
    /**
     * The version of the bot to build. This can only be the draft version of the bot.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the bot will be used in. The string must match one of the supported locales. All of the intents, slot types, and slots used in the bot must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
  }
  export interface BuildBotLocaleResponse {
    /**
     * The identifier of the specified bot.
     */
    botId?: Id;
    /**
     * The version of the bot that was built. This is only the draft version of the bot.
     */
    botVersion?: DraftBotVersion;
    /**
     * The language and locale specified of where the bot can be used.
     */
    localeId?: LocaleId;
    /**
     * The bot's build status. When the status is ReadyExpressTesting you can test the bot using the utterances defined for the intents and slot types. When the status is Built, the bot is ready for use and can be tested using any utterance.
     */
    botLocaleStatus?: BotLocaleStatus;
    /**
     * A timestamp indicating the date and time that the bot was last built for this locale.
     */
    lastBuildSubmittedDateTime?: Timestamp;
  }
  export type BuiltInIntentSortAttribute = "IntentSignature"|string;
  export interface BuiltInIntentSortBy {
    /**
     * The attribute to use to sort the list of built-in intents.
     */
    attribute: BuiltInIntentSortAttribute;
    /**
     * The order to sort the list. You can specify ascending or descending order.
     */
    order: SortOrder;
  }
  export interface BuiltInIntentSummary {
    /**
     * The signature of the built-in intent. Use this to specify the parent intent of a derived intent.
     */
    intentSignature?: IntentSignature;
    /**
     * The description of the intent.
     */
    description?: Description;
  }
  export type BuiltInIntentSummaryList = BuiltInIntentSummary[];
  export type BuiltInOrCustomSlotTypeId = string;
  export type BuiltInSlotTypeSortAttribute = "SlotTypeSignature"|string;
  export interface BuiltInSlotTypeSortBy {
    /**
     * The attribute to use to sort the list of built-in intents.
     */
    attribute: BuiltInSlotTypeSortAttribute;
    /**
     * The order to sort the list. You can choose ascending or descending.
     */
    order: SortOrder;
  }
  export interface BuiltInSlotTypeSummary {
    /**
     * The signature of the built-in slot type. Use this to specify the parent slot type of a derived slot type.
     */
    slotTypeSignature?: SlotTypeSignature;
    /**
     * The description of the built-in slot type.
     */
    description?: Description;
  }
  export type BuiltInSlotTypeSummaryList = BuiltInSlotTypeSummary[];
  export type BuiltInsMaxResults = number;
  export interface Button {
    /**
     * The text that appears on the button. Use this to tell the user what value is returned when they choose this button.
     */
    text: ButtonText;
    /**
     * The value returned to Amazon Lex when the user chooses this button. This must be one of the slot values configured for the slot.
     */
    value: ButtonValue;
  }
  export type ButtonText = string;
  export type ButtonValue = string;
  export type ButtonsList = Button[];
  export type ChildDirected = boolean;
  export type CloudWatchLogGroupArn = string;
  export interface CloudWatchLogGroupLogDestination {
    /**
     * The Amazon Resource Name (ARN) of the log group where text and metadata logs are delivered.
     */
    cloudWatchLogGroupArn: CloudWatchLogGroupArn;
    /**
     * The prefix of the log stream name within the log group that you specified 
     */
    logPrefix: LogPrefix;
  }
  export type CodeHookInterfaceVersion = string;
  export interface CodeHookSpecification {
    lambdaCodeHook: LambdaCodeHook;
  }
  export interface CompositeSlotTypeSetting {
    /**
     * Subslots in the composite slot.
     */
    subSlots?: SubSlotTypeList;
  }
  export interface Condition {
    /**
     * The expression string that is evaluated. 
     */
    expressionString: ConditionExpression;
  }
  export type ConditionExpression = string;
  export type ConditionKey = string;
  export type ConditionKeyValueMap = {[key: string]: ConditionValue};
  export type ConditionMap = {[key: string]: ConditionKeyValueMap};
  export type ConditionOperator = string;
  export type ConditionValue = string;
  export interface ConditionalBranch {
    /**
     * The name of the branch. 
     */
    name: Name;
    /**
     * Contains the expression to evaluate. If the condition is true, the branch's actions are taken.
     */
    condition: Condition;
    /**
     * The next step in the conversation.
     */
    nextStep: DialogState;
    response?: ResponseSpecification;
  }
  export type ConditionalBranches = ConditionalBranch[];
  export interface ConditionalSpecification {
    /**
     * Determines whether a conditional branch is active. When active is false, the conditions are not evaluated.
     */
    active: BoxedBoolean;
    /**
     * A list of conditional branches. A conditional branch is made up of a condition, a response and a next step. The response and next step are executed when the condition is true.
     */
    conditionalBranches: ConditionalBranches;
    /**
     * The conditional branch that should be followed when the conditions for other branches are not satisfied. A conditional branch is made up of a condition, a response and a next step.
     */
    defaultBranch: DefaultConditionalBranch;
  }
  export type ConfidenceThreshold = number;
  export type ContextTimeToLiveInSeconds = number;
  export type ContextTurnsToLive = number;
  export type ConversationEndState = "Success"|"Failure"|"Dropped"|string;
  export interface ConversationLevelIntentClassificationResultItem {
    /**
     * The intent name used in the evaluation of intent level success or failure.
     */
    intentName: Name;
    /**
     * The number of times the specific intent is used in the evaluation of intent level success or failure.
     */
    matchResult: TestResultMatchStatus;
  }
  export type ConversationLevelIntentClassificationResults = ConversationLevelIntentClassificationResultItem[];
  export interface ConversationLevelResultDetail {
    /**
     * The success or failure of the streaming of the conversation.
     */
    endToEndResult: TestResultMatchStatus;
    /**
     * The speech transcription success or failure details of the conversation.
     */
    speechTranscriptionResult?: TestResultMatchStatus;
  }
  export interface ConversationLevelSlotResolutionResultItem {
    /**
     * The intents used in the slots list for the slot resolution details.
     */
    intentName: Name;
    /**
     * The slot name in the slots list for the slot resolution details.
     */
    slotName: TestResultSlotName;
    /**
     * The number of matching slots used in the slots listings for the slot resolution evaluation.
     */
    matchResult: TestResultMatchStatus;
  }
  export type ConversationLevelSlotResolutionResults = ConversationLevelSlotResolutionResultItem[];
  export interface ConversationLevelTestResultItem {
    /**
     * The conversation Id of the test result evaluation item.
     */
    conversationId: TestSetConversationId;
    /**
     * The end-to-end success or failure of the test result evaluation item.
     */
    endToEndResult: TestResultMatchStatus;
    /**
     * The speech transcription success or failure of the test result evaluation item.
     */
    speechTranscriptionResult?: TestResultMatchStatus;
    /**
     * The intent classification of the test result evaluation item.
     */
    intentClassificationResults: ConversationLevelIntentClassificationResults;
    /**
     * The slot success or failure of the test result evaluation item.
     */
    slotResolutionResults: ConversationLevelSlotResolutionResults;
  }
  export type ConversationLevelTestResultItemList = ConversationLevelTestResultItem[];
  export interface ConversationLevelTestResults {
    /**
     * The item list in the test set results data at the conversation level.
     */
    items: ConversationLevelTestResultItemList;
  }
  export interface ConversationLevelTestResultsFilterBy {
    /**
     * The selection of matched or mismatched end-to-end status to filter test set results data at the conversation level.
     */
    endToEndResult?: TestResultMatchStatus;
  }
  export interface ConversationLogSettings {
    /**
     * The Amazon CloudWatch Logs settings for logging text and metadata.
     */
    textLogSettings?: TextLogSettingsList;
    /**
     * The Amazon S3 settings for logging audio to an S3 bucket.
     */
    audioLogSettings?: AudioLogSettingsList;
  }
  export interface ConversationLogsDataSource {
    /**
     * The bot Id from the conversation logs.
     */
    botId: Id;
    /**
     * The bot alias Id from the conversation logs.
     */
    botAliasId: BotAliasId;
    /**
     * The locale Id of the conversation log.
     */
    localeId: LocaleId;
    /**
     * The filter for the data source of the conversation log.
     */
    filter: ConversationLogsDataSourceFilterBy;
  }
  export interface ConversationLogsDataSourceFilterBy {
    /**
     * The start time for the conversation log.
     */
    startTime: Timestamp;
    /**
     * The end time for the conversation log.
     */
    endTime: Timestamp;
    /**
     * The selection to filter by input mode for the conversation logs. 
     */
    inputMode: ConversationLogsInputModeFilter;
  }
  export type ConversationLogsInputModeFilter = "Speech"|"Text"|string;
  export type Count = number;
  export interface CreateBotAliasRequest {
    /**
     * The alias to create. The name must be unique for the bot.
     */
    botAliasName: Name;
    /**
     * A description of the alias. Use this description to help identify the alias.
     */
    description?: Description;
    /**
     * The version of the bot that this alias points to. You can use the UpdateBotAlias operation to change the bot version associated with the alias.
     */
    botVersion?: NumericalBotVersion;
    /**
     * Maps configuration information to a specific locale. You can use this parameter to specify a specific Lambda function to run different functions in different locales.
     */
    botAliasLocaleSettings?: BotAliasLocaleSettingsMap;
    /**
     * Specifies whether Amazon Lex logs text and audio for a conversation with the bot. When you enable conversation logs, text logs store text input, transcripts of audio input, and associated metadata in Amazon CloudWatch Logs. Audio logs store audio input in Amazon S3.
     */
    conversationLogSettings?: ConversationLogSettings;
    sentimentAnalysisSettings?: SentimentAnalysisSettings;
    /**
     * The unique identifier of the bot that the alias applies to.
     */
    botId: Id;
    /**
     * A list of tags to add to the bot alias. You can only add tags when you create an alias, you can't use the UpdateBotAlias operation to update the tags on a bot alias. To update tags, use the TagResource operation.
     */
    tags?: TagMap;
  }
  export interface CreateBotAliasResponse {
    /**
     * The unique identifier of the bot alias.
     */
    botAliasId?: BotAliasId;
    /**
     * The name specified for the bot alias.
     */
    botAliasName?: Name;
    /**
     * The description specified for the bot alias.
     */
    description?: Description;
    /**
     * The version of the bot associated with this alias.
     */
    botVersion?: NumericalBotVersion;
    /**
     * Configuration information for a specific locale.
     */
    botAliasLocaleSettings?: BotAliasLocaleSettingsMap;
    /**
     * The conversation log settings specified for the alias.
     */
    conversationLogSettings?: ConversationLogSettings;
    sentimentAnalysisSettings?: SentimentAnalysisSettings;
    /**
     * The current status of the alias. The alias is first put into the Creating state. When the alias is ready to be used, it is put into the Available state. You can use the DescribeBotAlias operation to get the current state of an alias.
     */
    botAliasStatus?: BotAliasStatus;
    /**
     * The unique identifier of the bot that this alias applies to.
     */
    botId?: Id;
    /**
     * A Unix timestamp indicating the date and time that the bot alias was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A list of tags associated with the bot alias.
     */
    tags?: TagMap;
  }
  export interface CreateBotLocaleRequest {
    /**
     * The identifier of the bot to create the locale for.
     */
    botId: Id;
    /**
     * The version of the bot to create the locale for. This can only be the draft version of the bot.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the bot will be used in. The string must match one of the supported locales. All of the intents, slot types, and slots used in the bot must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * A description of the bot locale. Use this to help identify the bot locale in lists.
     */
    description?: Description;
    /**
     * Determines the threshold where Amazon Lex will insert the AMAZON.FallbackIntent, AMAZON.KendraSearchIntent, or both when returning alternative intents. AMAZON.FallbackIntent and AMAZON.KendraSearchIntent are only inserted if they are configured for the bot. For example, suppose a bot is configured with the confidence threshold of 0.80 and the AMAZON.FallbackIntent. Amazon Lex returns three alternative intents with the following confidence scores: IntentA (0.70), IntentB (0.60), IntentC (0.50). The response from the RecognizeText operation would be:   AMAZON.FallbackIntent   IntentA   IntentB   IntentC  
     */
    nluIntentConfidenceThreshold: ConfidenceThreshold;
    /**
     * The Amazon Polly voice ID that Amazon Lex uses for voice interaction with the user.
     */
    voiceSettings?: VoiceSettings;
  }
  export interface CreateBotLocaleResponse {
    /**
     * The specified bot identifier.
     */
    botId?: Id;
    /**
     * The specified bot version.
     */
    botVersion?: DraftBotVersion;
    /**
     * The specified locale name.
     */
    localeName?: LocaleName;
    /**
     * The specified locale identifier.
     */
    localeId?: LocaleId;
    /**
     * The specified description of the bot locale.
     */
    description?: Description;
    /**
     * The specified confidence threshold for inserting the AMAZON.FallbackIntent and AMAZON.KendraSearchIntent intents.
     */
    nluIntentConfidenceThreshold?: ConfidenceThreshold;
    /**
     * The Amazon Polly voice ID that Amazon Lex uses for voice interaction with the user.
     */
    voiceSettings?: VoiceSettings;
    /**
     * The status of the bot. When the status is Creating the bot locale is being configured. When the status is Building Amazon Lex is building the bot for testing and use. If the status of the bot is ReadyExpressTesting, you can test the bot using the exact utterances specified in the bots' intents. When the bot is ready for full testing or to run, the status is Built. If there was a problem with building the bot, the status is Failed. If the bot was saved but not built, the status is NotBuilt.
     */
    botLocaleStatus?: BotLocaleStatus;
    /**
     * A timestamp specifying the date and time that the bot locale was created.
     */
    creationDateTime?: Timestamp;
  }
  export interface CreateBotRequest {
    /**
     * The name of the bot. The bot name must be unique in the account that creates the bot.
     */
    botName: Name;
    /**
     * A description of the bot. It appears in lists to help you identify a particular bot.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permission to access the bot.
     */
    roleArn: RoleArn;
    /**
     * Provides information on additional privacy protections Amazon Lex should use with the bot's data.
     */
    dataPrivacy: DataPrivacy;
    /**
     * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot.  A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout. You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
     */
    idleSessionTTLInSeconds: SessionTTL;
    /**
     * A list of tags to add to the bot. You can only add tags when you create a bot. You can't use the UpdateBot operation to update tags. To update tags, use the TagResource operation.
     */
    botTags?: TagMap;
    /**
     * A list of tags to add to the test alias for a bot. You can only add tags when you create a bot. You can't use the UpdateAlias operation to update tags. To update tags on the test alias, use the TagResource operation.
     */
    testBotAliasTags?: TagMap;
    /**
     * The type of a bot to create.
     */
    botType?: BotType;
    /**
     * The list of bot members in a network to be created.
     */
    botMembers?: BotMembers;
  }
  export interface CreateBotResponse {
    /**
     * A unique identifier for a particular bot. You use this to identify the bot when you call other Amazon Lex API operations.
     */
    botId?: Id;
    /**
     * The name specified for the bot.
     */
    botName?: Name;
    /**
     * The description specified for the bot.
     */
    description?: Description;
    /**
     * The IAM role specified for the bot.
     */
    roleArn?: RoleArn;
    /**
     * The data privacy settings specified for the bot.
     */
    dataPrivacy?: DataPrivacy;
    /**
     * The session idle time specified for the bot.
     */
    idleSessionTTLInSeconds?: SessionTTL;
    /**
     * Shows the current status of the bot. The bot is first in the Creating status. Once the bot is read for use, it changes to the Available status. After the bot is created, you can use the DRAFT version of the bot.
     */
    botStatus?: BotStatus;
    /**
     * A timestamp indicating the date and time that the bot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A list of tags associated with the bot.
     */
    botTags?: TagMap;
    /**
     * A list of tags associated with the test alias for the bot.
     */
    testBotAliasTags?: TagMap;
    /**
     * The type of a bot that was created.
     */
    botType?: BotType;
    /**
     * The list of bots in a network that was created.
     */
    botMembers?: BotMembers;
  }
  export interface CreateBotVersionRequest {
    /**
     * The identifier of the bot to create the version for.
     */
    botId: Id;
    /**
     * A description of the version. Use the description to help identify the version in lists.
     */
    description?: Description;
    /**
     * Specifies the locales that Amazon Lex adds to this version. You can choose the Draft version or any other previously published version for each locale. When you specify a source version, the locale data is copied from the source version to the new version.
     */
    botVersionLocaleSpecification: BotVersionLocaleSpecification;
  }
  export interface CreateBotVersionResponse {
    /**
     * The bot identifier specified in the request.
     */
    botId?: Id;
    /**
     * The description of the version specified in the request.
     */
    description?: Description;
    /**
     * The version number assigned to the version.
     */
    botVersion?: NumericalBotVersion;
    /**
     * The source versions used for each locale in the new version.
     */
    botVersionLocaleSpecification?: BotVersionLocaleSpecification;
    /**
     * When you send a request to create or update a bot, Amazon Lex sets the status response element to Creating. After Amazon Lex builds the bot, it sets status to Available. If Amazon Lex can't build the bot, it sets status to Failed.
     */
    botStatus?: BotStatus;
    /**
     * A timestamp of the date and time that the version was created.
     */
    creationDateTime?: Timestamp;
  }
  export type CreateCustomVocabularyItemsList = NewCustomVocabularyItem[];
  export interface CreateExportRequest {
    /**
     * Specifies the type of resource to export, either a bot or a bot locale. You can only specify one type of resource to export.
     */
    resourceSpecification: ExportResourceSpecification;
    /**
     * The file format of the bot or bot locale definition files.
     */
    fileFormat: ImportExportFileFormat;
    /**
     * An password to use to encrypt the exported archive. Using a password is optional, but you should encrypt the archive to protect the data in transit between Amazon Lex and your local computer.
     */
    filePassword?: ImportExportFilePassword;
  }
  export interface CreateExportResponse {
    /**
     * An identifier for a specific request to create an export.
     */
    exportId?: Id;
    /**
     * A description of the type of resource that was exported, either a bot or a bot locale.
     */
    resourceSpecification?: ExportResourceSpecification;
    /**
     * The file format used for the bot or bot locale definition files.
     */
    fileFormat?: ImportExportFileFormat;
    /**
     * The status of the export. When the status is Completed, you can use the DescribeExport operation to get the pre-signed S3 URL link to your exported bot or bot locale.
     */
    exportStatus?: ExportStatus;
    /**
     * The date and time that the request to export a bot was created.
     */
    creationDateTime?: Timestamp;
  }
  export interface CreateIntentRequest {
    /**
     * The name of the intent. Intent names must be unique in the locale that contains the intent and cannot match the name of any built-in intent.
     */
    intentName: Name;
    /**
     * A description of the intent. Use the description to help identify the intent in lists.
     */
    description?: Description;
    /**
     * A unique identifier for the built-in intent to base this intent on.
     */
    parentIntentSignature?: IntentSignature;
    /**
     * An array of strings that a user might say to signal the intent. For example, "I want a pizza", or "I want a {PizzaSize} pizza".  In an utterance, slot names are enclosed in curly braces ("{", "}") to indicate where they should be displayed in the utterance shown to the user.. 
     */
    sampleUtterances?: SampleUtterancesList;
    /**
     * Specifies that Amazon Lex invokes the alias Lambda function for each user input. You can invoke this Lambda function to personalize user interaction. For example, suppose that your bot determines that the user's name is John. You Lambda function might retrieve John's information from a backend database and prepopulate some of the values. For example, if you find that John is gluten intolerant, you might set the corresponding intent slot, glutenIntolerant to true. You might find John's phone number and set the corresponding session attribute.
     */
    dialogCodeHook?: DialogCodeHookSettings;
    /**
     * Specifies that Amazon Lex invokes the alias Lambda function when the intent is ready for fulfillment. You can invoke this function to complete the bot's transaction with the user. For example, in a pizza ordering bot, the Lambda function can look up the closest pizza restaurant to the customer's location and then place an order on the customer's behalf.
     */
    fulfillmentCodeHook?: FulfillmentCodeHookSettings;
    /**
     * Provides prompts that Amazon Lex sends to the user to confirm the completion of an intent. If the user answers "no," the settings contain a statement that is sent to the user to end the intent.
     */
    intentConfirmationSetting?: IntentConfirmationSetting;
    /**
     * Sets the response that Amazon Lex sends to the user when the intent is closed.
     */
    intentClosingSetting?: IntentClosingSetting;
    /**
     * A list of contexts that must be active for this intent to be considered by Amazon Lex. When an intent has an input context list, Amazon Lex only considers using the intent in an interaction with the user when the specified contexts are included in the active context list for the session. If the contexts are not active, then Amazon Lex will not use the intent. A context can be automatically activated using the outputContexts property or it can be set at runtime.  For example, if there are two intents with different input contexts that respond to the same utterances, only the intent with the active context will respond. An intent may have up to 5 input contexts. If an intent has multiple input contexts, all of the contexts must be active to consider the intent.
     */
    inputContexts?: InputContextsList;
    /**
     * A lists of contexts that the intent activates when it is fulfilled. You can use an output context to indicate the intents that Amazon Lex should consider for the next turn of the conversation with a customer.  When you use the outputContextsList property, all of the contexts specified in the list are activated when the intent is fulfilled. You can set up to 10 output contexts. You can also set the number of conversation turns that the context should be active, or the length of time that the context should be active.
     */
    outputContexts?: OutputContextsList;
    /**
     * Configuration information required to use the AMAZON.KendraSearchIntent intent to connect to an Amazon Kendra index. The AMAZON.KendraSearchIntent intent is called when Amazon Lex can't determine another intent to invoke.
     */
    kendraConfiguration?: KendraConfiguration;
    /**
     * The identifier of the bot associated with this intent.
     */
    botId: Id;
    /**
     * The version of the bot associated with this intent.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale where this intent is used. All of the bots, slot types, and slots used by the intent must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Configuration settings for the response that is sent to the user at the beginning of a conversation, before eliciting slot values.
     */
    initialResponseSetting?: InitialResponseSetting;
  }
  export interface CreateIntentResponse {
    /**
     * A unique identifier for the intent.
     */
    intentId?: Id;
    /**
     * The name specified for the intent.
     */
    intentName?: Name;
    /**
     * The description specified for the intent.
     */
    description?: Description;
    /**
     * The signature of the parent intent specified for the intent.
     */
    parentIntentSignature?: IntentSignature;
    /**
     * The sample utterances specified for the intent.
     */
    sampleUtterances?: SampleUtterancesList;
    /**
     * The dialog Lambda function specified for the intent.
     */
    dialogCodeHook?: DialogCodeHookSettings;
    /**
     * The fulfillment Lambda function specified for the intent.
     */
    fulfillmentCodeHook?: FulfillmentCodeHookSettings;
    /**
     * The confirmation setting specified for the intent.
     */
    intentConfirmationSetting?: IntentConfirmationSetting;
    /**
     * The closing setting specified for the intent.
     */
    intentClosingSetting?: IntentClosingSetting;
    /**
     * The list of input contexts specified for the intent.
     */
    inputContexts?: InputContextsList;
    /**
     * The list of output contexts specified for the intent.
     */
    outputContexts?: OutputContextsList;
    /**
     * Configuration for searching a Amazon Kendra index specified for the intent.
     */
    kendraConfiguration?: KendraConfiguration;
    /**
     * The identifier of the bot associated with the intent.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the intent.
     */
    botVersion?: DraftBotVersion;
    /**
     * The locale that the intent is specified to use.
     */
    localeId?: LocaleId;
    /**
     * A timestamp of the date and time that the intent was created.
     */
    creationDateTime?: Timestamp;
    /**
     * Configuration settings for the response that is sent to the user at the beginning of a conversation, before eliciting slot values.
     */
    initialResponseSetting?: InitialResponseSetting;
  }
  export interface CreateResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn: AmazonResourceName;
    /**
     * A resource policy to add to the resource. The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow the IAM syntax. For more information about the contents of a JSON policy document, see  IAM JSON policy reference .  If the policy isn't valid, Amazon Lex returns a validation exception.
     */
    policy: Policy;
  }
  export interface CreateResourcePolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy was attached to.
     */
    resourceArn?: AmazonResourceName;
    /**
     * The current revision of the resource policy. Use the revision ID to make sure that you are updating the most current version of a resource policy when you add a policy statement to a resource, delete a resource, or update a resource.
     */
    revisionId?: RevisionId;
  }
  export interface CreateResourcePolicyStatementRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn: AmazonResourceName;
    /**
     * The name of the statement. The ID is the same as the Sid IAM property. The statement name must be unique within the policy. For more information, see IAM JSON policy elements: Sid. 
     */
    statementId: Name;
    /**
     * Determines whether the statement allows or denies access to the resource.
     */
    effect: Effect;
    /**
     * An IAM principal, such as an IAM user, IAM role, or Amazon Web Services services that is allowed or denied access to a resource. For more information, see Amazon Web Services JSON policy elements: Principal.
     */
    principal: PrincipalList;
    /**
     * The Amazon Lex action that this policy either allows or denies. The action must apply to the resource type of the specified ARN. For more information, see  Actions, resources, and condition keys for Amazon Lex V2.
     */
    action: OperationList;
    /**
     * Specifies a condition when the policy is in effect. If the principal of the policy is a service principal, you must provide two condition blocks, one with a SourceAccount global condition key and one with a SourceArn global condition key. For more information, see IAM JSON policy elements: Condition .
     */
    condition?: ConditionMap;
    /**
     * The identifier of the revision of the policy to edit. If this revision ID doesn't match the current revision ID, Amazon Lex throws an exception. If you don't specify a revision, Amazon Lex overwrites the contents of the policy with the new values.
     */
    expectedRevisionId?: RevisionId;
  }
  export interface CreateResourcePolicyStatementResponse {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn?: AmazonResourceName;
    /**
     * The current revision of the resource policy. Use the revision ID to make sure that you are updating the most current version of a resource policy when you add a policy statement to a resource, delete a resource, or update a resource.
     */
    revisionId?: RevisionId;
  }
  export interface CreateSlotRequest {
    /**
     * The name of the slot. Slot names must be unique within the bot that contains the slot.
     */
    slotName: Name;
    /**
     * A description of the slot. Use this to help identify the slot in lists.
     */
    description?: Description;
    /**
     * The unique identifier for the slot type associated with this slot. The slot type determines the values that can be entered into the slot.
     */
    slotTypeId?: BuiltInOrCustomSlotTypeId;
    /**
     * Specifies prompts that Amazon Lex sends to the user to elicit a response that provides the value for the slot. 
     */
    valueElicitationSetting: SlotValueElicitationSetting;
    /**
     * Determines how slot values are used in Amazon CloudWatch logs. If the value of the obfuscationSetting parameter is DefaultObfuscation, slot values are obfuscated in the log output. If the value is None, the actual value is present in the log output. The default is to obfuscate values in the CloudWatch logs.
     */
    obfuscationSetting?: ObfuscationSetting;
    /**
     * The identifier of the bot associated with the slot.
     */
    botId: Id;
    /**
     * The version of the bot associated with the slot.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the slot will be used in. The string must match one of the supported locales. All of the bots, intents, slot types used by the slot must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The identifier of the intent that contains the slot.
     */
    intentId: Id;
    /**
     * Indicates whether the slot returns multiple values in one response. Multi-value slots are only available in the en-US locale. If you set this value to true in any other locale, Amazon Lex throws a ValidationException.  If the multipleValuesSetting is not set, the default value is false.
     */
    multipleValuesSetting?: MultipleValuesSetting;
    /**
     * Specifications for the constituent sub slots and the expression for the composite slot.
     */
    subSlotSetting?: SubSlotSetting;
  }
  export interface CreateSlotResponse {
    /**
     * The unique identifier associated with the slot. Use this to identify the slot when you update or delete it.
     */
    slotId?: Id;
    /**
     * The name specified for the slot.
     */
    slotName?: Name;
    /**
     * The description associated with the slot.
     */
    description?: Description;
    /**
     * The unique identifier of the slot type associated with this slot.
     */
    slotTypeId?: BuiltInOrCustomSlotTypeId;
    /**
     * The value elicitation settings specified for the slot.
     */
    valueElicitationSetting?: SlotValueElicitationSetting;
    /**
     * Indicates whether the slot is configured to obfuscate values in Amazon CloudWatch logs.
     */
    obfuscationSetting?: ObfuscationSetting;
    /**
     * The unique identifier of the bot associated with the slot.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the slot.
     */
    botVersion?: DraftBotVersion;
    /**
     * The language and local specified for the slot.
     */
    localeId?: LocaleId;
    /**
     * The unique identifier of the intent associated with the slot.
     */
    intentId?: Id;
    /**
     * The timestamp of the date and time that the slot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * Indicates whether the slot returns multiple values in one response.
     */
    multipleValuesSetting?: MultipleValuesSetting;
    /**
     * Specifications for the constituent sub slots and the expression for the composite slot.
     */
    subSlotSetting?: SubSlotSetting;
  }
  export interface CreateSlotTypeRequest {
    /**
     * The name for the slot. A slot type name must be unique within the intent.
     */
    slotTypeName: Name;
    /**
     * A description of the slot type. Use the description to help identify the slot type in lists.
     */
    description?: Description;
    /**
     * A list of SlotTypeValue objects that defines the values that the slot type can take. Each value can have a list of synonyms, additional values that help train the machine learning model about the values that it resolves for a slot.
     */
    slotTypeValues?: SlotTypeValues;
    /**
     * Determines the strategy that Amazon Lex uses to select a value from the list of possible values. The field can be set to one of the following values:    ORIGINAL_VALUE - Returns the value entered by the user, if the user value is similar to the slot value.    TOP_RESOLUTION - If there is a resolution list for the slot, return the first value in the resolution list. If there is no resolution list, return null.   If you don't specify the valueSelectionSetting parameter, the default is ORIGINAL_VALUE.
     */
    valueSelectionSetting?: SlotValueSelectionSetting;
    /**
     * The built-in slot type used as a parent of this slot type. When you define a parent slot type, the new slot type has the configuration of the parent slot type. Only AMAZON.AlphaNumeric is supported.
     */
    parentSlotTypeSignature?: SlotTypeSignature;
    /**
     * The identifier of the bot associated with this slot type.
     */
    botId: Id;
    /**
     * The identifier of the bot version associated with this slot type.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the slot type will be used in. The string must match one of the supported locales. All of the bots, intents, and slots used by the slot type must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Sets the type of external information used to create the slot type.
     */
    externalSourceSetting?: ExternalSourceSetting;
    /**
     * Specifications for a composite slot type.
     */
    compositeSlotTypeSetting?: CompositeSlotTypeSetting;
  }
  export interface CreateSlotTypeResponse {
    /**
     * The unique identifier assigned to the slot type. Use this to identify the slot type in the UpdateSlotType and DeleteSlotType operations.
     */
    slotTypeId?: Id;
    /**
     * The name specified for the slot type.
     */
    slotTypeName?: Name;
    /**
     * The description specified for the slot type.
     */
    description?: Description;
    /**
     * The list of values that the slot type can assume.
     */
    slotTypeValues?: SlotTypeValues;
    /**
     * The strategy that Amazon Lex uses to select a value from the list of possible values.
     */
    valueSelectionSetting?: SlotValueSelectionSetting;
    /**
     * The signature of the base slot type specified for the slot type.
     */
    parentSlotTypeSignature?: SlotTypeSignature;
    /**
     * The identifier for the bot associated with the slot type.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the slot type.
     */
    botVersion?: DraftBotVersion;
    /**
     * The specified language and local specified for the slot type.
     */
    localeId?: LocaleId;
    /**
     * A timestamp of the date and time that the slot type was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The type of external information used to create the slot type.
     */
    externalSourceSetting?: ExternalSourceSetting;
    /**
     * Specifications for a composite slot type.
     */
    compositeSlotTypeSetting?: CompositeSlotTypeSetting;
  }
  export interface CreateTestSetDiscrepancyReportRequest {
    /**
     * The test set Id for the test set discrepancy report.
     */
    testSetId: Id;
    /**
     * The target bot for the test set discrepancy report.
     */
    target: TestSetDiscrepancyReportResourceTarget;
  }
  export interface CreateTestSetDiscrepancyReportResponse {
    /**
     * The unique identifier of the test set discrepancy report to describe.
     */
    testSetDiscrepancyReportId?: Id;
    /**
     * The creation date and time for the test set discrepancy report.
     */
    creationDateTime?: Timestamp;
    /**
     * The test set Id for the test set discrepancy report.
     */
    testSetId?: Id;
    /**
     * The target bot for the test set discrepancy report.
     */
    target?: TestSetDiscrepancyReportResourceTarget;
  }
  export interface CreateUploadUrlRequest {
  }
  export interface CreateUploadUrlResponse {
    /**
     * An identifier for a unique import job. Use it when you call the StartImport operation.
     */
    importId?: Id;
    /**
     * A pre-signed S3 write URL. Upload the zip archive file that contains the definition of your bot or bot locale.
     */
    uploadUrl?: PresignedS3Url;
  }
  export interface CustomPayload {
    /**
     * The string that is sent to your application.
     */
    value: CustomPayloadValue;
  }
  export type CustomPayloadValue = string;
  export interface CustomVocabularyEntryId {
    /**
     * The unique item identifier for the custom vocabulary items.
     */
    itemId: ItemId;
  }
  export interface CustomVocabularyExportSpecification {
    /**
     * The identifier of the bot that contains the custom vocabulary to export.
     */
    botId: Id;
    /**
     * The version of the bot that contains the custom vocabulary to export.
     */
    botVersion: BotVersion;
    /**
     * The locale of the bot that contains the custom vocabulary to export.
     */
    localeId: LocaleId;
  }
  export interface CustomVocabularyImportSpecification {
    /**
     * The identifier of the bot to import the custom vocabulary to.
     */
    botId: Id;
    /**
     * The version of the bot to import the custom vocabulary to.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the local to import the custom vocabulary to. The value must be en_GB.
     */
    localeId: LocaleId;
  }
  export interface CustomVocabularyItem {
    /**
     * The unique item identifer for the custom vocabulary item from the custom vocabulary list.
     */
    itemId: ItemId;
    /**
     * The unique phrase for the custom vocabulary item from the custom vocabulary list.
     */
    phrase: Phrase;
    /**
     * The weight assigned for the custom vocabulary item from the custom vocabulary list.
     */
    weight?: Weight;
    /**
     * The DisplayAs value for the custom vocabulary item from the custom vocabulary list.
     */
    displayAs?: Phrase;
  }
  export type CustomVocabularyItems = CustomVocabularyItem[];
  export type CustomVocabularyStatus = "Ready"|"Deleting"|"Exporting"|"Importing"|"Creating"|string;
  export type DTMFCharacter = string;
  export interface DTMFSpecification {
    /**
     * The maximum number of DTMF digits allowed in an utterance.
     */
    maxLength: MaxUtteranceDigits;
    /**
     * How long the bot should wait after the last DTMF character input before assuming that the input has concluded.
     */
    endTimeoutMs: TimeInMilliSeconds;
    /**
     * The DTMF character that clears the accumulated DTMF digits and immediately ends the input.
     */
    deletionCharacter: DTMFCharacter;
    /**
     * The DTMF character that immediately ends input. If the user does not press this character, the input ends after the end timeout.
     */
    endCharacter: DTMFCharacter;
  }
  export interface DataPrivacy {
    /**
     * For each Amazon Lex bot created with the Amazon Lex Model Building Service, you must specify whether your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to the Children's Online Privacy Protection Act (COPPA) by specifying true or false in the childDirected field. By specifying true in the childDirected field, you confirm that your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. By specifying false in the childDirected field, you confirm that your use of Amazon Lex is not related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. You may not specify a default value for the childDirected field that does not accurately reflect whether your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. If your use of Amazon Lex relates to a website, program, or other application that is directed in whole or in part, to children under age 13, you must obtain any required verifiable parental consent under COPPA. For information regarding the use of Amazon Lex in connection with websites, programs, or other applications that are directed or targeted, in whole or in part, to children under age 13, see the Amazon Lex FAQ.
     */
    childDirected: ChildDirected;
  }
  export interface DateRangeFilter {
    /**
     * A timestamp indicating the start date for the date range filter.
     */
    startDateTime: Timestamp;
    /**
     * A timestamp indicating the end date for the date range filter.
     */
    endDateTime: Timestamp;
  }
  export interface DefaultConditionalBranch {
    /**
     * The next step in the conversation.
     */
    nextStep?: DialogState;
    response?: ResponseSpecification;
  }
  export interface DeleteBotAliasRequest {
    /**
     * The unique identifier of the bot alias to delete.
     */
    botAliasId: BotAliasId;
    /**
     * The unique identifier of the bot associated with the alias to delete.
     */
    botId: Id;
    /**
     * By default, Amazon Lex checks if any other resource, such as a bot network, is using the bot alias before it is deleted and throws a ResourceInUseException exception if the alias is being used by another resource. Set this parameter to true to skip this check and remove the alias even if it is being used by another resource.
     */
    skipResourceInUseCheck?: SkipResourceInUseCheck;
  }
  export interface DeleteBotAliasResponse {
    /**
     * The unique identifier of the bot alias to delete.
     */
    botAliasId?: BotAliasId;
    /**
     * The unique identifier of the bot that contains the alias to delete.
     */
    botId?: Id;
    /**
     * The current status of the alias. The status is Deleting while the alias is in the process of being deleted. Once the alias is deleted, it will no longer appear in the list of aliases returned by the ListBotAliases operation.
     */
    botAliasStatus?: BotAliasStatus;
  }
  export interface DeleteBotLocaleRequest {
    /**
     * The unique identifier of the bot that contains the locale.
     */
    botId: Id;
    /**
     * The version of the bot that contains the locale. 
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that will be deleted. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
  }
  export interface DeleteBotLocaleResponse {
    /**
     * The identifier of the bot that contained the deleted locale.
     */
    botId?: Id;
    /**
     * The version of the bot that contained the deleted locale.
     */
    botVersion?: DraftBotVersion;
    /**
     * The language and locale of the deleted locale.
     */
    localeId?: LocaleId;
    /**
     * The status of deleting the bot locale. The locale first enters the Deleting status. Once the locale is deleted it no longer appears in the list of locales for the bot.
     */
    botLocaleStatus?: BotLocaleStatus;
  }
  export interface DeleteBotRequest {
    /**
     * The identifier of the bot to delete. 
     */
    botId: Id;
    /**
     * By default, Amazon Lex checks if any other resource, such as an alias or bot network, is using the bot version before it is deleted and throws a ResourceInUseException exception if the bot is being used by another resource. Set this parameter to true to skip this check and remove the bot even if it is being used by another resource.
     */
    skipResourceInUseCheck?: SkipResourceInUseCheck;
  }
  export interface DeleteBotResponse {
    /**
     * The unique identifier of the bot that Amazon Lex is deleting.
     */
    botId?: Id;
    /**
     * The current status of the bot. The status is Deleting while the bot and its associated resources are being deleted.
     */
    botStatus?: BotStatus;
  }
  export interface DeleteBotVersionRequest {
    /**
     * The identifier of the bot that contains the version.
     */
    botId: Id;
    /**
     * The version of the bot to delete.
     */
    botVersion: NumericalBotVersion;
    /**
     * By default, Amazon Lex checks if any other resource, such as an alias or bot network, is using the bot version before it is deleted and throws a ResourceInUseException exception if the version is being used by another resource. Set this parameter to true to skip this check and remove the version even if it is being used by another resource.
     */
    skipResourceInUseCheck?: SkipResourceInUseCheck;
  }
  export interface DeleteBotVersionResponse {
    /**
     * The identifier of the bot that is being deleted.
     */
    botId?: Id;
    /**
     * The version of the bot that is being deleted.
     */
    botVersion?: NumericalBotVersion;
    /**
     * The current status of the bot. 
     */
    botStatus?: BotStatus;
  }
  export type DeleteCustomVocabularyItemsList = CustomVocabularyEntryId[];
  export interface DeleteCustomVocabularyRequest {
    /**
     * The unique identifier of the bot to remove the custom vocabulary from.
     */
    botId: Id;
    /**
     * The version of the bot to remove the custom vocabulary from.
     */
    botVersion: DraftBotVersion;
    /**
     * The locale identifier for the locale that contains the custom vocabulary to remove.
     */
    localeId: LocaleId;
  }
  export interface DeleteCustomVocabularyResponse {
    /**
     * The identifier of the bot that the custom vocabulary was removed from.
     */
    botId?: Id;
    /**
     * The version of the bot that the custom vocabulary was removed from.
     */
    botVersion?: DraftBotVersion;
    /**
     * The locale identifier for the locale that the custom vocabulary was removed from.
     */
    localeId?: LocaleId;
    /**
     * The status of removing the custom vocabulary.
     */
    customVocabularyStatus?: CustomVocabularyStatus;
  }
  export interface DeleteExportRequest {
    /**
     * The unique identifier of the export to delete.
     */
    exportId: Id;
  }
  export interface DeleteExportResponse {
    /**
     * The unique identifier of the deleted export.
     */
    exportId?: Id;
    /**
     * The current status of the deletion. When the deletion is complete, the export will no longer be returned by the ListExports operation and calls to the  DescribeExport operation with the export identifier will fail.
     */
    exportStatus?: ExportStatus;
  }
  export interface DeleteImportRequest {
    /**
     * The unique identifier of the import to delete.
     */
    importId: Id;
  }
  export interface DeleteImportResponse {
    /**
     * The unique identifier of the deleted import.
     */
    importId?: Id;
    /**
     * The current status of the deletion. When the deletion is complete, the import will no longer be returned by the ListImports operation and calls to the DescribeImport operation with the import identifier will fail.
     */
    importStatus?: ImportStatus;
  }
  export interface DeleteIntentRequest {
    /**
     * The unique identifier of the intent to delete.
     */
    intentId: Id;
    /**
     * The identifier of the bot associated with the intent.
     */
    botId: Id;
    /**
     * The version of the bot associated with the intent.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale where the bot will be deleted. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that has the resource policy attached.
     */
    resourceArn: AmazonResourceName;
    /**
     * The identifier of the revision to edit. If this ID doesn't match the current revision number, Amazon Lex returns an exception If you don't specify a revision ID, Amazon Lex will delete the current policy.
     */
    expectedRevisionId?: RevisionId;
  }
  export interface DeleteResourcePolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy was deleted from.
     */
    resourceArn?: AmazonResourceName;
    /**
     * The current revision of the resource policy. Use the revision ID to make sure that you are updating the most current version of a resource policy when you add a policy statement to a resource, delete a resource, or update a resource.
     */
    revisionId?: RevisionId;
  }
  export interface DeleteResourcePolicyStatementRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn: AmazonResourceName;
    /**
     * The name of the statement (SID) to delete from the policy.
     */
    statementId: Name;
    /**
     * The identifier of the revision of the policy to delete the statement from. If this revision ID doesn't match the current revision ID, Amazon Lex throws an exception. If you don't specify a revision, Amazon Lex removes the current contents of the statement. 
     */
    expectedRevisionId?: RevisionId;
  }
  export interface DeleteResourcePolicyStatementResponse {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy statement was removed from.
     */
    resourceArn?: AmazonResourceName;
    /**
     * The current revision of the resource policy. Use the revision ID to make sure that you are updating the most current version of a resource policy when you add a policy statement to a resource, delete a resource, or update a resource.
     */
    revisionId?: RevisionId;
  }
  export interface DeleteSlotRequest {
    /**
     * The identifier of the slot to delete. 
     */
    slotId: Id;
    /**
     * The identifier of the bot associated with the slot to delete.
     */
    botId: Id;
    /**
     * The version of the bot associated with the slot to delete.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the slot will be deleted from. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The identifier of the intent associated with the slot.
     */
    intentId: Id;
  }
  export interface DeleteSlotTypeRequest {
    /**
     * The identifier of the slot type to delete.
     */
    slotTypeId: Id;
    /**
     * The identifier of the bot associated with the slot type.
     */
    botId: Id;
    /**
     * The version of the bot associated with the slot type.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that the slot type will be deleted from. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * By default, the DeleteSlotType operations throws a ResourceInUseException exception if you try to delete a slot type used by a slot. Set the skipResourceInUseCheck parameter to true to skip this check and remove the slot type even if a slot uses it.
     */
    skipResourceInUseCheck?: SkipResourceInUseCheck;
  }
  export interface DeleteTestSetRequest {
    /**
     * The test set Id of the test set to be deleted.
     */
    testSetId: Id;
  }
  export interface DeleteUtterancesRequest {
    /**
     * The unique identifier of the bot that contains the utterances.
     */
    botId: Id;
    /**
     * The identifier of the language and locale where the utterances were collected. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId?: LocaleId;
    /**
     * The unique identifier of the session with the user. The ID is returned in the response from the RecognizeText and RecognizeUtterance operations.
     */
    sessionId?: SessionId;
  }
  export interface DeleteUtterancesResponse {
  }
  export interface DescribeBotAliasRequest {
    /**
     * The identifier of the bot alias to describe.
     */
    botAliasId: BotAliasId;
    /**
     * The identifier of the bot associated with the bot alias to describe.
     */
    botId: Id;
  }
  export interface DescribeBotAliasResponse {
    /**
     * The identifier of the bot alias.
     */
    botAliasId?: BotAliasId;
    /**
     * The name of the bot alias.
     */
    botAliasName?: Name;
    /**
     * The description of the bot alias.
     */
    description?: Description;
    /**
     * The version of the bot associated with the bot alias.
     */
    botVersion?: BotVersion;
    /**
     * The locale settings that are unique to the alias.
     */
    botAliasLocaleSettings?: BotAliasLocaleSettingsMap;
    /**
     * Specifics of how Amazon Lex logs text and audio conversations with the bot associated with the alias.
     */
    conversationLogSettings?: ConversationLogSettings;
    sentimentAnalysisSettings?: SentimentAnalysisSettings;
    /**
     * A list of events that affect a bot alias. For example, an event is recorded when the version that the alias points to changes.
     */
    botAliasHistoryEvents?: BotAliasHistoryEventsList;
    /**
     * The current status of the alias. When the alias is Available, the alias is ready for use with your bot.
     */
    botAliasStatus?: BotAliasStatus;
    /**
     * The identifier of the bot associated with the bot alias.
     */
    botId?: Id;
    /**
     * A timestamp of the date and time that the alias was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the alias was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * A list of the networks to which the bot alias you described belongs.
     */
    parentBotNetworks?: ParentBotNetworks;
  }
  export interface DescribeBotLocaleRequest {
    /**
     * The identifier of the bot associated with the locale.
     */
    botId: Id;
    /**
     * The version of the bot associated with the locale.
     */
    botVersion: BotVersion;
    /**
     * The unique identifier of the locale to describe. The string must match one of the supported locales. For more information, see Supported languages. 
     */
    localeId: LocaleId;
  }
  export interface DescribeBotLocaleResponse {
    /**
     * The identifier of the bot associated with the locale.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the locale.
     */
    botVersion?: BotVersion;
    /**
     * The unique identifier of the described locale.
     */
    localeId?: LocaleId;
    /**
     * The name of the locale.
     */
    localeName?: LocaleName;
    /**
     * The description of the locale.
     */
    description?: Description;
    /**
     * The confidence threshold where Amazon Lex inserts the AMAZON.FallbackIntent and AMAZON.KendraSearchIntent intents in the list of possible intents for an utterance.
     */
    nluIntentConfidenceThreshold?: ConfidenceThreshold;
    /**
     * The Amazon Polly voice Amazon Lex uses for voice interaction with the user.
     */
    voiceSettings?: VoiceSettings;
    /**
     * The number of intents defined for the locale.
     */
    intentsCount?: ResourceCount;
    /**
     * The number of slot types defined for the locale.
     */
    slotTypesCount?: ResourceCount;
    /**
     * The status of the bot. If the status is Failed, the reasons for the failure are listed in the failureReasons field.
     */
    botLocaleStatus?: BotLocaleStatus;
    /**
     * if botLocaleStatus is Failed, Amazon Lex explains why it failed to build the bot.
     */
    failureReasons?: FailureReasons;
    /**
     * The date and time that the locale was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the locale was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The date and time that the locale was last submitted for building.
     */
    lastBuildSubmittedDateTime?: Timestamp;
    /**
     * History of changes, such as when a locale is used in an alias, that have taken place for the locale.
     */
    botLocaleHistoryEvents?: BotLocaleHistoryEventsList;
    /**
     * Recommended actions to take to resolve an error in the failureReasons field.
     */
    recommendedActions?: RecommendedActions;
  }
  export interface DescribeBotRecommendationRequest {
    /**
     * The unique identifier of the bot associated with the bot recommendation.
     */
    botId: Id;
    /**
     * The version of the bot associated with the bot recommendation.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to describe. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The identifier of the bot recommendation to describe.
     */
    botRecommendationId: Id;
  }
  export interface DescribeBotRecommendationResponse {
    /**
     * The identifier of the bot associated with the bot recommendation.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the bot recommendation.
     */
    botVersion?: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to describe.
     */
    localeId?: LocaleId;
    /**
     * The status of the bot recommendation. If the status is Failed, then the reasons for the failure are listed in the failureReasons field. 
     */
    botRecommendationStatus?: BotRecommendationStatus;
    /**
     * The identifier of the bot recommendation being described.
     */
    botRecommendationId?: Id;
    /**
     * If botRecommendationStatus is Failed, Amazon Lex explains why.
     */
    failureReasons?: FailureReasons;
    /**
     * The date and time that the bot recommendation was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the bot recommendation was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The object representing the Amazon S3 bucket containing the transcript, as well as the associated metadata.
     */
    transcriptSourceSetting?: TranscriptSourceSetting;
    /**
     * The object representing the passwords that were used to encrypt the data related to the bot recommendation results, as well as the KMS key ARN used to encrypt the associated metadata.
     */
    encryptionSetting?: EncryptionSetting;
    /**
     * The object representing the URL of the bot definition, the URL of the associated transcript and a statistical summary of the bot recommendation results.
     */
    botRecommendationResults?: BotRecommendationResults;
  }
  export interface DescribeBotRequest {
    /**
     * The unique identifier of the bot to describe.
     */
    botId: Id;
  }
  export interface DescribeBotResponse {
    /**
     * The unique identifier of the bot.
     */
    botId?: Id;
    /**
     * The name of the bot.
     */
    botName?: Name;
    /**
     * The description of the bot. 
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permission to access the bot.
     */
    roleArn?: RoleArn;
    /**
     * Settings for managing data privacy of the bot and its conversations with users.
     */
    dataPrivacy?: DataPrivacy;
    /**
     * The maximum time in seconds that Amazon Lex retains the data gathered in a conversation.
     */
    idleSessionTTLInSeconds?: SessionTTL;
    /**
     * The current status of the bot. When the status is Available the bot is ready to be used in conversations with users.
     */
    botStatus?: BotStatus;
    /**
     * A timestamp of the date and time that the bot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The type of the bot that was described.
     */
    botType?: BotType;
    /**
     * The list of bots in the network that was described.
     */
    botMembers?: BotMembers;
    /**
     * If the botStatus is Failed, this contains a list of reasons that the bot couldn't be built.
     */
    failureReasons?: FailureReasons;
  }
  export interface DescribeBotVersionRequest {
    /**
     * The identifier of the bot containing the version to return metadata for.
     */
    botId: Id;
    /**
     * The version of the bot to return metadata for.
     */
    botVersion: NumericalBotVersion;
  }
  export interface DescribeBotVersionResponse {
    /**
     * The identifier of the bot that contains the version.
     */
    botId?: Id;
    /**
     * The name of the bot that contains the version.
     */
    botName?: Name;
    /**
     * The version of the bot that was described.
     */
    botVersion?: NumericalBotVersion;
    /**
     * The description specified for the bot.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permission to access the bot version.
     */
    roleArn?: RoleArn;
    /**
     * Data privacy settings for the bot version.
     */
    dataPrivacy?: DataPrivacy;
    /**
     * The number of seconds that a session with the bot remains active before it is discarded by Amazon Lex.
     */
    idleSessionTTLInSeconds?: SessionTTL;
    /**
     * The current status of the bot. When the status is Available, the bot version is ready for use.
     */
    botStatus?: BotStatus;
    /**
     * If the botStatus is Failed, this contains a list of reasons that the version couldn't be built.
     */
    failureReasons?: FailureReasons;
    /**
     * A timestamp of the date and time that the bot version was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A list of the networks to which the bot version you described belongs.
     */
    parentBotNetworks?: ParentBotNetworks;
    /**
     * The type of the bot in the version that was described.
     */
    botType?: BotType;
    /**
     * The members of bot network in the version that was described.
     */
    botMembers?: BotMembers;
  }
  export interface DescribeCustomVocabularyMetadataRequest {
    /**
     * The unique identifier of the bot that contains the custom vocabulary.
     */
    botId: Id;
    /**
     * The bot version of the bot to return metadata for.
     */
    botVersion: BotVersion;
    /**
     * The locale to return the custom vocabulary information for. The locale must be en_GB.
     */
    localeId: LocaleId;
  }
  export interface DescribeCustomVocabularyMetadataResponse {
    /**
     * The identifier of the bot that contains the custom vocabulary.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the custom vocabulary to describe.
     */
    botVersion?: BotVersion;
    /**
     * The locale that contains the custom vocabulary to describe.
     */
    localeId?: LocaleId;
    /**
     * The status of the custom vocabulary. If the status is Ready the custom vocabulary is ready to use.
     */
    customVocabularyStatus?: CustomVocabularyStatus;
    /**
     * The date and time that the custom vocabulary was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the custom vocabulary was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface DescribeExportRequest {
    /**
     * The unique identifier of the export to describe.
     */
    exportId: Id;
  }
  export interface DescribeExportResponse {
    /**
     * The unique identifier of the described export.
     */
    exportId?: Id;
    /**
     * The bot, bot ID, and optional locale ID of the exported bot or bot locale.
     */
    resourceSpecification?: ExportResourceSpecification;
    /**
     * The file format used in the files that describe the resource. 
     */
    fileFormat?: ImportExportFileFormat;
    /**
     * The status of the export. When the status is Complete the export archive file is available for download.
     */
    exportStatus?: ExportStatus;
    /**
     * If the exportStatus is failed, contains one or more reasons why the export could not be completed.
     */
    failureReasons?: FailureReasons;
    /**
     * A pre-signed S3 URL that points to the bot or bot locale archive. The URL is only available for 5 minutes after calling the DescribeExport operation.
     */
    downloadUrl?: PresignedS3Url;
    /**
     * The date and time that the export was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The last date and time that the export was updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface DescribeImportRequest {
    /**
     * The unique identifier of the import to describe.
     */
    importId: Id;
  }
  export interface DescribeImportResponse {
    /**
     * The unique identifier of the described import.
     */
    importId?: Id;
    /**
     * The specifications of the imported bot, bot locale, or custom vocabulary.
     */
    resourceSpecification?: ImportResourceSpecification;
    /**
     * The unique identifier that Amazon Lex assigned to the resource created by the import.
     */
    importedResourceId?: ImportedResourceId;
    /**
     * The name of the imported resource.
     */
    importedResourceName?: Name;
    /**
     * The strategy used when there was a name conflict between the imported resource and an existing resource. When the merge strategy is FailOnConflict existing resources are not overwritten and the import fails.
     */
    mergeStrategy?: MergeStrategy;
    /**
     * The status of the import process. When the status is Completed the resource is imported and ready for use.
     */
    importStatus?: ImportStatus;
    /**
     * If the importStatus field is Failed, this provides one or more reasons for the failure.
     */
    failureReasons?: FailureReasons;
    /**
     * The date and time that the import was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the import was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface DescribeIntentRequest {
    /**
     * The identifier of the intent to describe.
     */
    intentId: Id;
    /**
     * The identifier of the bot associated with the intent.
     */
    botId: Id;
    /**
     * The version of the bot associated with the intent.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the intent to describe. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
  }
  export interface DescribeIntentResponse {
    /**
     * The unique identifier assigned to the intent when it was created.
     */
    intentId?: Id;
    /**
     * The name specified for the intent.
     */
    intentName?: Name;
    /**
     * The description of the intent.
     */
    description?: Description;
    /**
     * The identifier of the built-in intent that this intent is derived from, if any.
     */
    parentIntentSignature?: IntentSignature;
    /**
     * User utterances that trigger this intent.
     */
    sampleUtterances?: SampleUtterancesList;
    /**
     * The Lambda function called during each turn of a conversation with the intent.
     */
    dialogCodeHook?: DialogCodeHookSettings;
    /**
     * The Lambda function called when the intent is complete and ready for fulfillment.
     */
    fulfillmentCodeHook?: FulfillmentCodeHookSettings;
    /**
     * The list that determines the priority that slots should be elicited from the user.
     */
    slotPriorities?: SlotPrioritiesList;
    /**
     * Prompts that Amazon Lex sends to the user to confirm completion of an intent.
     */
    intentConfirmationSetting?: IntentConfirmationSetting;
    /**
     * The response that Amazon Lex sends to when the intent is closed.
     */
    intentClosingSetting?: IntentClosingSetting;
    /**
     * A list of contexts that must be active for the intent to be considered for sending to the user.
     */
    inputContexts?: InputContextsList;
    /**
     * A list of contexts that are activated when the intent is fulfilled.
     */
    outputContexts?: OutputContextsList;
    /**
     * Configuration information required to use the AMAZON.KendraSearchIntent intent.
     */
    kendraConfiguration?: KendraConfiguration;
    /**
     * The identifier of the bot associated with the intent.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the intent.
     */
    botVersion?: DraftBotVersion;
    /**
     * The language and locale specified for the intent.
     */
    localeId?: LocaleId;
    /**
     * A timestamp of the date and time that the intent was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the intent was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * Configuration setting for a response sent to the user before Amazon Lex starts eliciting slots.
     */
    initialResponseSetting?: InitialResponseSetting;
  }
  export interface DescribeResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn: AmazonResourceName;
  }
  export interface DescribeResourcePolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn?: AmazonResourceName;
    /**
     * The JSON structure that contains the resource policy. For more information about the contents of a JSON policy document, see  IAM JSON policy reference .
     */
    policy?: Policy;
    /**
     * The current revision of the resource policy. Use the revision ID to make sure that you are updating the most current version of a resource policy when you add a policy statement to a resource, delete a resource, or update a resource.
     */
    revisionId?: RevisionId;
  }
  export interface DescribeSlotRequest {
    /**
     * The unique identifier for the slot.
     */
    slotId: Id;
    /**
     * The identifier of the bot associated with the slot.
     */
    botId: Id;
    /**
     * The version of the bot associated with the slot.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the slot to describe. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The identifier of the intent that contains the slot.
     */
    intentId: Id;
  }
  export interface DescribeSlotResponse {
    /**
     * The unique identifier generated for the slot.
     */
    slotId?: Id;
    /**
     * The name specified for the slot.
     */
    slotName?: Name;
    /**
     * The description specified for the slot.
     */
    description?: Description;
    /**
     * The identifier of the slot type that determines the values entered into the slot.
     */
    slotTypeId?: BuiltInOrCustomSlotTypeId;
    /**
     * Prompts that Amazon Lex uses to elicit a value for the slot.
     */
    valueElicitationSetting?: SlotValueElicitationSetting;
    /**
     * Whether slot values are shown in Amazon CloudWatch logs. If the value is None, the actual value of the slot is shown in logs.
     */
    obfuscationSetting?: ObfuscationSetting;
    /**
     * The identifier of the bot associated with the slot.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the slot.
     */
    botVersion?: BotVersion;
    /**
     * The language and locale specified for the slot.
     */
    localeId?: LocaleId;
    /**
     * The identifier of the intent associated with the slot.
     */
    intentId?: Id;
    /**
     * A timestamp of the date and time that the slot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the slot was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * Indicates whether the slot accepts multiple values in a single utterance. If the multipleValuesSetting is not set, the default value is false.
     */
    multipleValuesSetting?: MultipleValuesSetting;
    /**
     * Specifications for the constituent sub slots and the expression for the composite slot.
     */
    subSlotSetting?: SubSlotSetting;
  }
  export interface DescribeSlotTypeRequest {
    /**
     * The identifier of the slot type.
     */
    slotTypeId: Id;
    /**
     * The identifier of the bot associated with the slot type.
     */
    botId: Id;
    /**
     * The version of the bot associated with the slot type.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the slot type to describe. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
  }
  export interface DescribeSlotTypeResponse {
    /**
     * The unique identifier for the slot type.
     */
    slotTypeId?: Id;
    /**
     * The name specified for the slot type.
     */
    slotTypeName?: Name;
    /**
     * The description specified for the slot type.
     */
    description?: Description;
    /**
     * The values that the slot type can take. Includes any synonyms for the slot type values.
     */
    slotTypeValues?: SlotTypeValues;
    /**
     * The strategy that Amazon Lex uses to choose a value from a list of possible values.
     */
    valueSelectionSetting?: SlotValueSelectionSetting;
    /**
     * The built in slot type used as a parent to this slot type.
     */
    parentSlotTypeSignature?: SlotTypeSignature;
    /**
     * The identifier of the bot associated with the slot type.
     */
    botId?: Id;
    /**
     * The version of the bot associated with the slot type.
     */
    botVersion?: BotVersion;
    /**
     * The language and locale specified for the slot type.
     */
    localeId?: LocaleId;
    /**
     * A timestamp of the date and time that the slot type was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the slot type was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    externalSourceSetting?: ExternalSourceSetting;
    /**
     * Specifications for a composite slot type.
     */
    compositeSlotTypeSetting?: CompositeSlotTypeSetting;
  }
  export interface DescribeTestExecutionRequest {
    /**
     * The execution Id of the test set execution.
     */
    testExecutionId: Id;
  }
  export interface DescribeTestExecutionResponse {
    /**
     * The execution Id for the test set execution.
     */
    testExecutionId?: Id;
    /**
     * The execution creation date and time for the test set execution.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time of the last update for the execution.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The test execution status for the test execution.
     */
    testExecutionStatus?: TestExecutionStatus;
    /**
     * The test set Id for the test set execution.
     */
    testSetId?: Id;
    /**
     * The test set name of the test set execution.
     */
    testSetName?: Name;
    /**
     * The target bot for the test set execution details.
     */
    target?: TestExecutionTarget;
    /**
     * Indicates whether we use streaming or non-streaming APIs are used for the test set execution. For streaming, StartConversation Amazon Lex Runtime API is used. Whereas for non-streaming, RecognizeUtterance and RecognizeText Amazon Lex Runtime API is used.
     */
    apiMode?: TestExecutionApiMode;
    /**
     * Indicates whether test set is audio or text.
     */
    testExecutionModality?: TestExecutionModality;
    /**
     * Reasons for the failure of the test set execution.
     */
    failureReasons?: FailureReasons;
  }
  export interface DescribeTestSetDiscrepancyReportRequest {
    /**
     * The unique identifier of the test set discrepancy report.
     */
    testSetDiscrepancyReportId: Id;
  }
  export interface DescribeTestSetDiscrepancyReportResponse {
    /**
     * The unique identifier of the test set discrepancy report to describe.
     */
    testSetDiscrepancyReportId?: Id;
    /**
     * The test set Id for the test set discrepancy report.
     */
    testSetId?: Id;
    /**
     * The time and date of creation for the test set discrepancy report.
     */
    creationDateTime?: Timestamp;
    /**
     * The target bot location for the test set discrepancy report.
     */
    target?: TestSetDiscrepancyReportResourceTarget;
    /**
     * The status for the test set discrepancy report.
     */
    testSetDiscrepancyReportStatus?: TestSetDiscrepancyReportStatus;
    /**
     * The date and time of the last update for the test set discrepancy report.
     */
    lastUpdatedDataTime?: Timestamp;
    /**
     * The top 200 error results from the test set discrepancy report.
     */
    testSetDiscrepancyTopErrors?: TestSetDiscrepancyErrors;
    /**
     * Pre-signed Amazon S3 URL to download the test set discrepancy report.
     */
    testSetDiscrepancyRawOutputUrl?: PresignedS3Url;
    /**
     * The failure report for the test set discrepancy report generation action.
     */
    failureReasons?: FailureReasons;
  }
  export interface DescribeTestSetGenerationRequest {
    /**
     * The unique identifier of the test set generation.
     */
    testSetGenerationId: Id;
  }
  export interface DescribeTestSetGenerationResponse {
    /**
     * The unique identifier of the test set generation.
     */
    testSetGenerationId?: Id;
    /**
     * The status for the test set generation.
     */
    testSetGenerationStatus?: TestSetGenerationStatus;
    /**
     * The reasons the test set generation failed.
     */
    failureReasons?: FailureReasons;
    /**
     * The unique identifier for the test set created for the generated test set.
     */
    testSetId?: Id;
    /**
     * The test set name for the generated test set.
     */
    testSetName?: Name;
    /**
     * The test set description for the test set generation.
     */
    description?: Description;
    /**
     * The Amazon S3 storage location for the test set generation.
     */
    storageLocation?: TestSetStorageLocation;
    /**
     * The data source of the test set used for the test set generation.
     */
    generationDataSource?: TestSetGenerationDataSource;
    /**
     *  The roleARN of the test set used for the test set generation.
     */
    roleArn?: RoleArn;
    /**
     * The creation date and time for the test set generation.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time of the last update for the test set generation.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface DescribeTestSetRequest {
    /**
     * The test set Id for the test set request.
     */
    testSetId: Id;
  }
  export interface DescribeTestSetResponse {
    /**
     * The test set Id for the test set response.
     */
    testSetId?: Id;
    /**
     * The test set name of the test set.
     */
    testSetName?: Name;
    /**
     * The description of the test set.
     */
    description?: Description;
    /**
     * Indicates whether the test set is audio or text data.
     */
    modality?: TestSetModality;
    /**
     * The status of the test set.
     */
    status?: TestSetStatus;
    /**
     * The roleARN used for any operation in the test set to access resources in the Amazon Web Services account.
     */
    roleArn?: RoleArn;
    /**
     * The total number of agent and user turn in the test set.
     */
    numTurns?: Count;
    /**
     * The Amazon S3 storage location for the test set data.
     */
    storageLocation?: TestSetStorageLocation;
    /**
     * The creation date and time for the test set data.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time for the last update of the test set data.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type Description = string;
  export interface DialogAction {
    /**
     * The action that the bot should execute. 
     */
    type: DialogActionType;
    /**
     * If the dialog action is ElicitSlot, defines the slot to elicit from the user.
     */
    slotToElicit?: Name;
    /**
     * When true the next message for the intent is not used.
     */
    suppressNextMessage?: BoxedBoolean;
  }
  export type DialogActionType = "ElicitIntent"|"StartIntent"|"ElicitSlot"|"EvaluateConditional"|"InvokeDialogCodeHook"|"ConfirmIntent"|"FulfillIntent"|"CloseIntent"|"EndConversation"|string;
  export interface DialogCodeHookInvocationSetting {
    /**
     * Indicates whether a Lambda function should be invoked for the dialog.
     */
    enableCodeHookInvocation: BoxedBoolean;
    /**
     * Determines whether a dialog code hook is used when the intent is activated.
     */
    active: BoxedBoolean;
    /**
     * A label that indicates the dialog step from which the dialog code hook is happening.
     */
    invocationLabel?: Name;
    /**
     * Contains the responses and actions that Amazon Lex takes after the Lambda function is complete.
     */
    postCodeHookSpecification: PostDialogCodeHookInvocationSpecification;
  }
  export interface DialogCodeHookSettings {
    /**
     * Enables the dialog code hook so that it processes user requests.
     */
    enabled: Boolean;
  }
  export interface DialogState {
    dialogAction?: DialogAction;
    intent?: IntentOverride;
    /**
     * Map of key/value pairs representing session-specific context information. It contains application information passed between Amazon Lex and a client application.
     */
    sessionAttributes?: StringMap;
  }
  export type DraftBotVersion = string;
  export type Effect = "Allow"|"Deny"|string;
  export interface ElicitationCodeHookInvocationSetting {
    /**
     * Indicates whether a Lambda function should be invoked for the dialog.
     */
    enableCodeHookInvocation: BoxedBoolean;
    /**
     * A label that indicates the dialog step from which the dialog code hook is happening.
     */
    invocationLabel?: Name;
  }
  export interface EncryptionSetting {
    /**
     * The KMS key ARN used to encrypt the metadata associated with the bot recommendation.
     */
    kmsKeyArn?: KmsKeyArn;
    /**
     * The password used to encrypt the recommended bot recommendation file.
     */
    botLocaleExportPassword?: FilePassword;
    /**
     * The password used to encrypt the associated transcript file.
     */
    associatedTranscriptsPassword?: FilePassword;
  }
  export type ErrorCode = "DUPLICATE_INPUT"|"RESOURCE_DOES_NOT_EXIST"|"RESOURCE_ALREADY_EXISTS"|"INTERNAL_SERVER_FAILURE"|string;
  export type ErrorMessage = string;
  export interface ExecutionErrorDetails {
    /**
     * The error code for the error.
     */
    errorCode: NonEmptyString;
    /**
     * The message describing the error.
     */
    errorMessage: NonEmptyString;
  }
  export interface ExportFilter {
    /**
     * The name of the field to use for filtering.
     */
    name: ExportFilterName;
    /**
     * The values to use to filter the response. The values must be Bot, BotLocale, or CustomVocabulary.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListExports operation should return only resource types that equal the specified value. Specify CO when the ListExports operation should return resource types that contain the specified value.
     */
    operator: ExportFilterOperator;
  }
  export type ExportFilterName = "ExportResourceType"|string;
  export type ExportFilterOperator = "CO"|"EQ"|string;
  export type ExportFilters = ExportFilter[];
  export interface ExportResourceSpecification {
    /**
     * Parameters for exporting a bot.
     */
    botExportSpecification?: BotExportSpecification;
    /**
     * Parameters for exporting a bot locale.
     */
    botLocaleExportSpecification?: BotLocaleExportSpecification;
    /**
     * The parameters required to export a custom vocabulary.
     */
    customVocabularyExportSpecification?: CustomVocabularyExportSpecification;
    /**
     * Specifications for the test set that is exported as a resource.
     */
    testSetExportSpecification?: TestSetExportSpecification;
  }
  export type ExportSortAttribute = "LastUpdatedDateTime"|string;
  export interface ExportSortBy {
    /**
     * The export field to use for sorting.
     */
    attribute: ExportSortAttribute;
    /**
     * The order to sort the list.
     */
    order: SortOrder;
  }
  export type ExportStatus = "InProgress"|"Completed"|"Failed"|"Deleting"|string;
  export interface ExportSummary {
    /**
     * The unique identifier that Amazon Lex assigned to the export.
     */
    exportId?: Id;
    /**
     * Information about the bot or bot locale that was exported.
     */
    resourceSpecification?: ExportResourceSpecification;
    /**
     * The file format used in the export files.
     */
    fileFormat?: ImportExportFileFormat;
    /**
     * The status of the export. When the status is Completed the export is ready to download.
     */
    exportStatus?: ExportStatus;
    /**
     * The date and time that the export was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the export was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type ExportSummaryList = ExportSummary[];
  export interface ExternalSourceSetting {
    /**
     * Settings required for a slot type based on a grammar that you provide.
     */
    grammarSlotTypeSetting?: GrammarSlotTypeSetting;
  }
  export interface FailedCustomVocabularyItem {
    /**
     * The unique item identifer for the failed custom vocabulary item from the custom vocabulary list.
     */
    itemId?: ItemId;
    /**
     * The error message for the failed custom vocabulary item from the custom vocabulary list.
     */
    errorMessage?: ErrorMessage;
    /**
     * The unique error code for the failed custom vocabulary item from the custom vocabulary list.
     */
    errorCode?: ErrorCode;
  }
  export type FailedCustomVocabularyItems = FailedCustomVocabularyItem[];
  export type FailureReason = string;
  export type FailureReasons = FailureReason[];
  export type FilePassword = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export interface FulfillmentCodeHookSettings {
    /**
     * Indicates whether a Lambda function should be invoked to fulfill a specific intent.
     */
    enabled: Boolean;
    /**
     * Provides settings for messages sent to the user for after the Lambda fulfillment function completes. Post-fulfillment messages can be sent for both streaming and non-streaming conversations.
     */
    postFulfillmentStatusSpecification?: PostFulfillmentStatusSpecification;
    /**
     * Provides settings for update messages sent to the user for long-running Lambda fulfillment functions. Fulfillment updates can be used only with streaming conversations.
     */
    fulfillmentUpdatesSpecification?: FulfillmentUpdatesSpecification;
    /**
     * Determines whether the fulfillment code hook is used. When active is false, the code hook doesn't run.
     */
    active?: BoxedBoolean;
  }
  export type FulfillmentStartResponseDelay = number;
  export interface FulfillmentStartResponseSpecification {
    /**
     * The delay between when the Lambda fulfillment function starts running and the start message is played. If the Lambda function returns before the delay is over, the start message isn't played.
     */
    delayInSeconds: FulfillmentStartResponseDelay;
    /**
     * 1 - 5 message groups that contain start messages. Amazon Lex chooses one of the messages to play to the user.
     */
    messageGroups: MessageGroupsList;
    /**
     * Determines whether the user can interrupt the start message while it is playing.
     */
    allowInterrupt?: BoxedBoolean;
  }
  export type FulfillmentTimeout = number;
  export type FulfillmentUpdateResponseFrequency = number;
  export interface FulfillmentUpdateResponseSpecification {
    /**
     * The frequency that a message is sent to the user. When the period ends, Amazon Lex chooses a message from the message groups and plays it to the user. If the fulfillment Lambda returns before the first period ends, an update message is not played to the user.
     */
    frequencyInSeconds: FulfillmentUpdateResponseFrequency;
    /**
     * 1 - 5 message groups that contain update messages. Amazon Lex chooses one of the messages to play to the user.
     */
    messageGroups: MessageGroupsList;
    /**
     * Determines whether the user can interrupt an update message while it is playing.
     */
    allowInterrupt?: BoxedBoolean;
  }
  export interface FulfillmentUpdatesSpecification {
    /**
     * Determines whether fulfillment updates are sent to the user. When this field is true, updates are sent. If the active field is set to true, the startResponse, updateResponse, and timeoutInSeconds fields are required.
     */
    active: BoxedBoolean;
    /**
     * Provides configuration information for the message sent to users when the fulfillment Lambda functions starts running.
     */
    startResponse?: FulfillmentStartResponseSpecification;
    /**
     * Provides configuration information for messages sent periodically to the user while the fulfillment Lambda function is running.
     */
    updateResponse?: FulfillmentUpdateResponseSpecification;
    /**
     * The length of time that the fulfillment Lambda function should run before it times out.
     */
    timeoutInSeconds?: FulfillmentTimeout;
  }
  export interface GetTestExecutionArtifactsUrlRequest {
    /**
     * The unique identifier of the completed test execution.
     */
    testExecutionId: Id;
  }
  export interface GetTestExecutionArtifactsUrlResponse {
    /**
     * The unique identifier of the completed test execution.
     */
    testExecutionId?: Id;
    /**
     * The pre-signed Amazon S3 URL to download completed test execution.
     */
    downloadArtifactsUrl?: PresignedS3Url;
  }
  export interface GrammarSlotTypeSetting {
    /**
     * The source of the grammar used to create the slot type.
     */
    source?: GrammarSlotTypeSource;
  }
  export interface GrammarSlotTypeSource {
    /**
     * The name of the Amazon S3 bucket that contains the grammar source.
     */
    s3BucketName: S3BucketName;
    /**
     * The path to the grammar in the Amazon S3 bucket.
     */
    s3ObjectKey: S3ObjectPath;
    /**
     * The KMS key required to decrypt the contents of the grammar, if any.
     */
    kmsKeyArn?: KmsKeyArn;
  }
  export type HitCount = number;
  export type Id = string;
  export interface ImageResponseCard {
    /**
     * The title to display on the response card. The format of the title is determined by the platform displaying the response card.
     */
    title: AttachmentTitle;
    /**
     * The subtitle to display on the response card. The format of the subtitle is determined by the platform displaying the response card.
     */
    subtitle?: AttachmentTitle;
    /**
     * The URL of an image to display on the response card. The image URL must be publicly available so that the platform displaying the response card has access to the image.
     */
    imageUrl?: AttachmentUrl;
    /**
     * A list of buttons that should be displayed on the response card. The arrangement of the buttons is determined by the platform that displays the button.
     */
    buttons?: ButtonsList;
  }
  export type ImportExportFileFormat = "LexJson"|"TSV"|"CSV"|string;
  export type ImportExportFilePassword = string;
  export interface ImportFilter {
    /**
     * The name of the field to use for filtering.
     */
    name: ImportFilterName;
    /**
     * The values to use to filter the response. The values must be Bot, BotLocale, or CustomVocabulary.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListImports operation should return only resource types that equal the specified value. Specify CO when the ListImports operation should return resource types that contain the specified value.
     */
    operator: ImportFilterOperator;
  }
  export type ImportFilterName = "ImportResourceType"|string;
  export type ImportFilterOperator = "CO"|"EQ"|string;
  export type ImportFilters = ImportFilter[];
  export interface ImportResourceSpecification {
    /**
     * Parameters for importing a bot.
     */
    botImportSpecification?: BotImportSpecification;
    /**
     * Parameters for importing a bot locale.
     */
    botLocaleImportSpecification?: BotLocaleImportSpecification;
    customVocabularyImportSpecification?: CustomVocabularyImportSpecification;
    /**
     * Specifications for the test set that is imported.
     */
    testSetImportResourceSpecification?: TestSetImportResourceSpecification;
  }
  export type ImportResourceType = "Bot"|"BotLocale"|"CustomVocabulary"|"TestSet"|string;
  export type ImportSortAttribute = "LastUpdatedDateTime"|string;
  export interface ImportSortBy {
    /**
     * The export field to use for sorting.
     */
    attribute: ImportSortAttribute;
    /**
     * The order to sort the list.
     */
    order: SortOrder;
  }
  export type ImportStatus = "InProgress"|"Completed"|"Failed"|"Deleting"|string;
  export interface ImportSummary {
    /**
     * The unique identifier that Amazon Lex assigned to the import.
     */
    importId?: Id;
    /**
     * The unique identifier that Amazon Lex assigned to the imported resource.
     */
    importedResourceId?: ImportedResourceId;
    /**
     * The name that you gave the imported resource.
     */
    importedResourceName?: Name;
    /**
     * The status of the resource. When the status is Completed the resource is ready to build.
     */
    importStatus?: ImportStatus;
    /**
     * The strategy used to merge existing bot or bot locale definitions with the imported definition.
     */
    mergeStrategy?: MergeStrategy;
    /**
     * The date and time that the import was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the import was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The type of resource that was imported.
     */
    importedResourceType?: ImportResourceType;
  }
  export type ImportSummaryList = ImportSummary[];
  export type ImportedResourceId = string;
  export interface InitialResponseSetting {
    initialResponse?: ResponseSpecification;
    /**
     * The next step in the conversation.
     */
    nextStep?: DialogState;
    conditional?: ConditionalSpecification;
    codeHook?: DialogCodeHookInvocationSetting;
  }
  export interface InputContext {
    /**
     * The name of the context.
     */
    name: Name;
  }
  export type InputContextsList = InputContext[];
  export interface InputSessionStateSpecification {
    /**
     * Session attributes for the session state.
     */
    sessionAttributes?: StringMap;
    /**
     * Active contexts for the session state.
     */
    activeContexts?: ActiveContextList;
    /**
     * Runtime hints for the session state.
     */
    runtimeHints?: RuntimeHints;
  }
  export interface IntentClassificationTestResultItem {
    /**
     * The name of the intent.
     */
    intentName: Name;
    /**
     * Indicates whether the conversation involves multiple turns or not.
     */
    multiTurnConversation: Boolean;
    /**
     * The result of the intent classification test.
     */
    resultCounts: IntentClassificationTestResultItemCounts;
  }
  export interface IntentClassificationTestResultItemCounts {
    /**
     * The total number of results in the intent classification test.
     */
    totalResultCount: Count;
    /**
     * The number of matched, mismatched, and execution error results for speech transcription for the intent.
     */
    speechTranscriptionResultCounts?: TestResultMatchStatusCountMap;
    /**
     * The number of matched and mismatched results for intent recognition for the intent.
     */
    intentMatchResultCounts: TestResultMatchStatusCountMap;
  }
  export type IntentClassificationTestResultItemList = IntentClassificationTestResultItem[];
  export interface IntentClassificationTestResults {
    /**
     * A list of the results for the intent classification test.
     */
    items: IntentClassificationTestResultItemList;
  }
  export interface IntentClosingSetting {
    /**
     * The response that Amazon Lex sends to the user when the intent is complete.
     */
    closingResponse?: ResponseSpecification;
    /**
     * Specifies whether an intent's closing response is used. When this field is false, the closing response isn't sent to the user. If the active field isn't specified, the default is true.
     */
    active?: BoxedBoolean;
    /**
     * Specifies the next step that the bot executes after playing the intent's closing response.
     */
    nextStep?: DialogState;
    /**
     * A list of conditional branches associated with the intent's closing response. These branches are executed when the nextStep attribute is set to EvalutateConditional.
     */
    conditional?: ConditionalSpecification;
  }
  export interface IntentConfirmationSetting {
    /**
     * Prompts the user to confirm the intent. This question should have a yes or no answer. Amazon Lex uses this prompt to ensure that the user acknowledges that the intent is ready for fulfillment. For example, with the OrderPizza intent, you might want to confirm that the order is correct before placing it. For other intents, such as intents that simply respond to user questions, you might not need to ask the user for confirmation before providing the information. 
     */
    promptSpecification: PromptSpecification;
    /**
     * When the user answers "no" to the question defined in promptSpecification, Amazon Lex responds with this response to acknowledge that the intent was canceled. 
     */
    declinationResponse?: ResponseSpecification;
    /**
     * Specifies whether the intent's confirmation is sent to the user. When this field is false, confirmation and declination responses aren't sent. If the active field isn't specified, the default is true.
     */
    active?: BoxedBoolean;
    confirmationResponse?: ResponseSpecification;
    /**
     * Specifies the next step that the bot executes when the customer confirms the intent.
     */
    confirmationNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the intent is closed.
     */
    confirmationConditional?: ConditionalSpecification;
    /**
     * Specifies the next step that the bot executes when the customer declines the intent.
     */
    declinationNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the intent is declined.
     */
    declinationConditional?: ConditionalSpecification;
    failureResponse?: ResponseSpecification;
    /**
     * The next step to take in the conversation if the confirmation step fails.
     */
    failureNextStep?: DialogState;
    failureConditional?: ConditionalSpecification;
    /**
     * The DialogCodeHookInvocationSetting object associated with intent's confirmation step. The dialog code hook is triggered based on these invocation settings when the confirmation next step or declination next step or failure next step is InvokeDialogCodeHook. 
     */
    codeHook?: DialogCodeHookInvocationSetting;
    /**
     * The DialogCodeHookInvocationSetting used when the code hook is invoked during confirmation prompt retries.
     */
    elicitationCodeHook?: ElicitationCodeHookInvocationSetting;
  }
  export interface IntentFilter {
    /**
     * The name of the field to use for the filter.
     */
    name: IntentFilterName;
    /**
     * The value to use for the filter.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListIntents operation should return only aliases that equal the specified value. Specify CO when the ListIntents operation should return aliases that contain the specified value.
     */
    operator: IntentFilterOperator;
  }
  export type IntentFilterName = "IntentName"|string;
  export type IntentFilterOperator = "CO"|"EQ"|string;
  export type IntentFilters = IntentFilter[];
  export interface IntentLevelSlotResolutionTestResultItem {
    /**
     * The name of the intent that was recognized.
     */
    intentName: Name;
    /**
     * Indicates whether the conversation involves multiple turns or not.
     */
    multiTurnConversation: Boolean;
    /**
     * The results for the slot resolution in the test execution result.
     */
    slotResolutionResults: SlotResolutionTestResultItems;
  }
  export type IntentLevelSlotResolutionTestResultItemList = IntentLevelSlotResolutionTestResultItem[];
  export interface IntentLevelSlotResolutionTestResults {
    /**
     * Indicates the items for the slot level resolution for the intents.
     */
    items: IntentLevelSlotResolutionTestResultItemList;
  }
  export interface IntentOverride {
    /**
     * The name of the intent. Only required when you're switching intents.
     */
    name?: Name;
    /**
     * A map of all of the slot value overrides for the intent. The name of the slot maps to the value of the slot. Slots that are not included in the map aren't overridden.
     */
    slots?: SlotValueOverrideMap;
  }
  export type IntentSignature = string;
  export type IntentSortAttribute = "IntentName"|"LastUpdatedDateTime"|string;
  export interface IntentSortBy {
    /**
     * The attribute to use to sort the list of intents.
     */
    attribute: IntentSortAttribute;
    /**
     * The order to sort the list. You can choose ascending or descending.
     */
    order: SortOrder;
  }
  export type IntentState = "Failed"|"Fulfilled"|"InProgress"|"ReadyForFulfillment"|"Waiting"|"FulfillmentInProgress"|string;
  export interface IntentStatistics {
    /**
     * The number of recommended intents associated with the bot recommendation.
     */
    discoveredIntentCount?: Count;
  }
  export interface IntentSummary {
    /**
     * The unique identifier assigned to the intent. Use this ID to get detailed information about the intent with the DescribeIntent operation.
     */
    intentId?: Id;
    /**
     * The name of the intent.
     */
    intentName?: Name;
    /**
     * The description of the intent.
     */
    description?: Description;
    /**
     * If this intent is derived from a built-in intent, the name of the parent intent.
     */
    parentIntentSignature?: IntentSignature;
    /**
     * The input contexts that must be active for this intent to be considered for recognition.
     */
    inputContexts?: InputContextsList;
    /**
     * The output contexts that are activated when this intent is fulfilled.
     */
    outputContexts?: OutputContextsList;
    /**
     * The timestamp of the date and time that the intent was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type IntentSummaryList = IntentSummary[];
  export interface InvokedIntentSample {
    /**
     * The name of an intent that was invoked.
     */
    intentName?: Name;
  }
  export type InvokedIntentSamples = InvokedIntentSample[];
  export type ItemId = string;
  export interface KendraConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kendra index that you want the AMAZON.KendraSearchIntent intent to search. The index must be in the same account and Region as the Amazon Lex bot.
     */
    kendraIndex: KendraIndexArn;
    /**
     * Determines whether the AMAZON.KendraSearchIntent intent uses a custom query string to query the Amazon Kendra index.
     */
    queryFilterStringEnabled?: Boolean;
    /**
     * A query filter that Amazon Lex sends to Amazon Kendra to filter the response from a query. The filter is in the format defined by Amazon Kendra. For more information, see Filtering queries.
     */
    queryFilterString?: QueryFilterString;
  }
  export type KendraIndexArn = string;
  export type KmsKeyArn = string;
  export type LambdaARN = string;
  export interface LambdaCodeHook {
    /**
     * The Amazon Resource Name (ARN) of the Lambda function.
     */
    lambdaARN: LambdaARN;
    /**
     * The version of the request-response that you want Amazon Lex to use to invoke your Lambda function.
     */
    codeHookInterfaceVersion: CodeHookInterfaceVersion;
  }
  export interface LexTranscriptFilter {
    /**
     * The object that contains a date range filter that will be applied to the transcript. Specify this object if you want Amazon Lex to only read the files that are within the date range.
     */
    dateRangeFilter?: DateRangeFilter;
  }
  export interface ListAggregatedUtterancesRequest {
    /**
     * The unique identifier of the bot associated with this request.
     */
    botId: Id;
    /**
     * The identifier of the bot alias associated with this request. If you specify the bot alias, you can't specify the bot version.
     */
    botAliasId?: BotAliasId;
    /**
     * The identifier of the bot version associated with this request. If you specify the bot version, you can't specify the bot alias.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale where the utterances were collected. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The time window for aggregating the utterance information. You can specify a time between one hour and two weeks.
     */
    aggregationDuration: UtteranceAggregationDuration;
    /**
     * Specifies sorting parameters for the list of utterances. You can sort by the hit count, the missed count, or the number of distinct sessions the utterance appeared in.
     */
    sortBy?: AggregatedUtterancesSortBy;
    /**
     * Provides the specification of a filter used to limit the utterances in the response to only those that match the filter specification. You can only specify one filter and one string to filter on.
     */
    filters?: AggregatedUtterancesFilters;
    /**
     * The maximum number of utterances to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned. If you don't specify the maxResults parameter, 1,000 results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListAggregatedUtterances operation contains more results that specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAggregatedUtterancesResponse {
    /**
     * The identifier of the bot that contains the utterances.
     */
    botId?: Id;
    /**
     * The identifier of the bot alias that contains the utterances. If you specified the bot version, the bot alias ID isn't returned.
     */
    botAliasId?: BotAliasId;
    /**
     * The identifier of the bot version that contains the utterances. If you specified the bot alias, the bot version isn't returned.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale that the utterances are in.
     */
    localeId?: LocaleId;
    /**
     * The time period used to aggregate the utterance data.
     */
    aggregationDuration?: UtteranceAggregationDuration;
    /**
     * The date and time that the aggregation window begins. Only data collected after this time is returned in the results.
     */
    aggregationWindowStartTime?: Timestamp;
    /**
     * The date and time that the aggregation window ends. Only data collected between the start time and the end time are returned in the results. 
     */
    aggregationWindowEndTime?: Timestamp;
    /**
     * The last date and time that the aggregated data was collected. The time period depends on the length of the aggregation window.    Hours - for 1 hour time window, every half hour; otherwise every hour.    Days - every 6 hours    Weeks - for a one week time window, every 12 hours; otherwise, every day  
     */
    aggregationLastRefreshedDateTime?: Timestamp;
    /**
     * Summaries of the aggregated utterance data. Each response contains information about the number of times that the utterance was seen during the time period, whether it was detected or missed, and when it was seen during the time period.
     */
    aggregatedUtterancesSummaries?: AggregatedUtterancesSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListAggregatedUtterances operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListAggregatedUtterances operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBotAliasesRequest {
    /**
     * The identifier of the bot to list aliases for.
     */
    botId: Id;
    /**
     * The maximum number of aliases to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListBotAliases operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBotAliasesResponse {
    /**
     * Summary information for the bot aliases that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more aliases available, the nextToken field contains a token to get the next page of results.
     */
    botAliasSummaries?: BotAliasSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBotAliases operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListBotAliases operation request to get the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The identifier of the bot associated with the aliases.
     */
    botId?: Id;
  }
  export interface ListBotLocalesRequest {
    /**
     * The identifier of the bot to list locales for.
     */
    botId: Id;
    /**
     * The version of the bot to list locales for.
     */
    botVersion: BotVersion;
    /**
     * Specifies sorting parameters for the list of locales. You can sort by locale name in ascending or descending order.
     */
    sortBy?: BotLocaleSortBy;
    /**
     * Provides the specification for a filter used to limit the response to only those locales that match the filter specification. You can only specify one filter and one value to filter on.
     */
    filters?: BotLocaleFilters;
    /**
     * The maximum number of aliases to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListBotLocales operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token as the nextToken parameter to return the next page of results. 
     */
    nextToken?: NextToken;
  }
  export interface ListBotLocalesResponse {
    /**
     * The identifier of the bot to list locales for.
     */
    botId?: Id;
    /**
     * The version of the bot.
     */
    botVersion?: BotVersion;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBotLocales operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListBotLocales operation request to get the next page of results.
     */
    nextToken?: NextToken;
    /**
     * Summary information for the locales that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more locales available, the nextToken field contains a token to get the next page of results.
     */
    botLocaleSummaries?: BotLocaleSummaryList;
  }
  export interface ListBotRecommendationsRequest {
    /**
     * The unique identifier of the bot that contains the bot recommendation list.
     */
    botId: Id;
    /**
     * The version of the bot that contains the bot recommendation list.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation list.
     */
    localeId: LocaleId;
    /**
     * The maximum number of bot recommendations to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListBotRecommendation operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBotRecommendationsResponse {
    /**
     * The unique identifier of the bot that contains the bot recommendation list.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the bot recommendation list.
     */
    botVersion?: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation list.
     */
    localeId?: LocaleId;
    /**
     * Summary information for the bot recommendations that meet the filter specified in this request. The length of the list is specified in the maxResults parameter of the request. If there are more bot recommendations available, the nextToken field contains a token to get the next page of results.
     */
    botRecommendationSummaries?: BotRecommendationSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBotRecommendations operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListBotRecommendations operation request to get the next page of results. 
     */
    nextToken?: NextToken;
  }
  export interface ListBotVersionsRequest {
    /**
     * The identifier of the bot to list versions for.
     */
    botId: Id;
    /**
     * Specifies sorting parameters for the list of versions. You can specify that the list be sorted by version name in either ascending or descending order.
     */
    sortBy?: BotVersionSortBy;
    /**
     * The maximum number of versions to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response to the ListBotVersion operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBotVersionsResponse {
    /**
     * The identifier of the bot to list versions for.
     */
    botId?: Id;
    /**
     * Summary information for the bot versions that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more versions available, the nextToken field contains a token to get the next page of results.
     */
    botVersionSummaries?: BotVersionSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBotVersions operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListBotAliases operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBotsRequest {
    /**
     * Specifies sorting parameters for the list of bots. You can specify that the list be sorted by bot name in ascending or descending order.
     */
    sortBy?: BotSortBy;
    /**
     * Provides the specification of a filter used to limit the bots in the response to only those that match the filter specification. You can only specify one filter and one string to filter on.
     */
    filters?: BotFilters;
    /**
     * The maximum number of bots to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListBots operation contains more results than specified in the maxResults parameter, a token is returned in the response.  Use the returned token in the nextToken parameter of a ListBots request to return the next page of results. For a complete set of results, call the ListBots operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListBotsResponse {
    /**
     * Summary information for the bots that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more bots available, the nextToken field contains a token to the next page of results.
     */
    botSummaries?: BotSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBots operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListBots operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBuiltInIntentsRequest {
    /**
     * The identifier of the language and locale of the intents to list. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Specifies sorting parameters for the list of built-in intents. You can specify that the list be sorted by the built-in intent signature in either ascending or descending order.
     */
    sortBy?: BuiltInIntentSortBy;
    /**
     * The maximum number of built-in intents to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: BuiltInsMaxResults;
    /**
     * If the response from the ListBuiltInIntents operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBuiltInIntentsResponse {
    /**
     * Summary information for the built-in intents that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more intents available, the nextToken field contains a token to get the next page of results.
     */
    builtInIntentSummaries?: BuiltInIntentSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBuiltInIntents operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListBotAliases operation request to get the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The language and locale of the intents in the list.
     */
    localeId?: LocaleId;
  }
  export interface ListBuiltInSlotTypesRequest {
    /**
     * The identifier of the language and locale of the slot types to list. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Determines the sort order for the response from the ListBuiltInSlotTypes operation. You can choose to sort by the slot type signature in either ascending or descending order.
     */
    sortBy?: BuiltInSlotTypeSortBy;
    /**
     * The maximum number of built-in slot types to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: BuiltInsMaxResults;
    /**
     * If the response from the ListBuiltInSlotTypes operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListBuiltInSlotTypesResponse {
    /**
     * Summary information for the built-in slot types that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more slot types available, the nextToken field contains a token to get the next page of results.
     */
    builtInSlotTypeSummaries?: BuiltInSlotTypeSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListBuiltInSlotTypes operation. If the nextToken field is present, you send the contents as the nextToken parameter of a LIstBuiltInSlotTypes operation request to get the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The language and locale of the slot types in the list.
     */
    localeId?: LocaleId;
  }
  export interface ListCustomVocabularyItemsRequest {
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botId: Id;
    /**
     * The bot version of the bot to the list custom vocabulary request.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see Supported languages (https://docs.aws.amazon.com/lexv2/latest/dg/how-languages.html).
     */
    localeId: LocaleId;
    /**
     * The maximum number of items returned by the list operation.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken identifier to the list custom vocabulary request.
     */
    nextToken?: NextToken;
  }
  export interface ListCustomVocabularyItemsResponse {
    /**
     * The identifier of the bot associated with this custom vocabulary.
     */
    botId?: Id;
    /**
     * The identifier of the version of the bot associated with this custom vocabulary.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale where this custom vocabulary is used. The string must match one of the supported locales. For more information, see  Supported Languages .
     */
    localeId?: LocaleId;
    /**
     * The custom vocabulary items from the list custom vocabulary response.
     */
    customVocabularyItems?: CustomVocabularyItems;
    /**
     * The nextToken identifier to the list custom vocabulary response.
     */
    nextToken?: NextToken;
  }
  export interface ListExportsRequest {
    /**
     * The unique identifier that Amazon Lex assigned to the bot.
     */
    botId?: Id;
    /**
     * The version of the bot to list exports for. 
     */
    botVersion?: BotVersion;
    /**
     * Determines the field that the list of exports is sorted by. You can sort by the LastUpdatedDateTime field in ascending or descending order.
     */
    sortBy?: ExportSortBy;
    /**
     * Provides the specification of a filter used to limit the exports in the response to only those that match the filter specification. You can only specify one filter and one string to filter on.
     */
    filters?: ExportFilters;
    /**
     * The maximum number of exports to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListExports operation contains more results that specified in the maxResults parameter, a token is returned in the response.  Use the returned token in the nextToken parameter of a ListExports request to return the next page of results. For a complete set of results, call the ListExports operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
    /**
     * Specifies the resources that should be exported. If you don't specify a resource type in the filters parameter, both bot locales and custom vocabularies are exported.
     */
    localeId?: LocaleId;
  }
  export interface ListExportsResponse {
    /**
     * The unique identifier assigned to the bot by Amazon Lex.
     */
    botId?: Id;
    /**
     * The version of the bot that was exported.
     */
    botVersion?: BotVersion;
    /**
     * Summary information for the exports that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter. If there are more exports available, the nextToken field contains a token to get the next page of results.
     */
    exportSummaries?: ExportSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListExports operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListExports operation request to get the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The locale specified in the request.
     */
    localeId?: LocaleId;
  }
  export interface ListImportsRequest {
    /**
     * The unique identifier that Amazon Lex assigned to the bot.
     */
    botId?: Id;
    /**
     * The version of the bot to list imports for.
     */
    botVersion?: DraftBotVersion;
    /**
     * Determines the field that the list of imports is sorted by. You can sort by the LastUpdatedDateTime field in ascending or descending order.
     */
    sortBy?: ImportSortBy;
    /**
     * Provides the specification of a filter used to limit the bots in the response to only those that match the filter specification. You can only specify one filter and one string to filter on.
     */
    filters?: ImportFilters;
    /**
     * The maximum number of imports to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListImports operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListImports request to return the next page of results. For a complete set of results, call the ListImports operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
    /**
     * Specifies the locale that should be present in the list. If you don't specify a resource type in the filters parameter, the list contains both bot locales and custom vocabularies.
     */
    localeId?: LocaleId;
  }
  export interface ListImportsResponse {
    /**
     * The unique identifier assigned by Amazon Lex to the bot.
     */
    botId?: Id;
    /**
     * The version of the bot that was imported. It will always be DRAFT.
     */
    botVersion?: DraftBotVersion;
    /**
     * Summary information for the imports that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter. If there are more imports available, the nextToken field contains a token to get the next page of results.
     */
    importSummaries?: ImportSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListImports operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListImports operation request to get the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The locale specified in the request.
     */
    localeId?: LocaleId;
  }
  export interface ListIntentMetricsRequest {
    /**
     * The identifier for the bot for which you want to retrieve intent metrics.
     */
    botId: Id;
    /**
     * The timestamp that marks the beginning of the range of time for which you want to see intent metrics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see intent metrics.
     */
    endDateTime: Timestamp;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the order by which to organize the results.
     */
    metrics: AnalyticsIntentMetrics;
    /**
     * A list of objects, each of which contains specifications for organizing the results by time.
     */
    binBy?: AnalyticsBinByList;
    /**
     * A list of objects, each of which specifies how to group the results. You can group by the following criteria:    IntentName – The name of the intent.    IntentEndState – The final state of the intent. The possible end states are detailed in Key definitions in the user guide.  
     */
    groupBy?: AnalyticsIntentGroupByList;
    /**
     * A list of objects, each of which describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsIntentFilters;
    /**
     * The maximum number of results to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListIntentMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListIntentMetrics request to return the next page of results. For a complete set of results, call the ListIntentMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListIntentMetricsResponse {
    /**
     * The identifier for the bot for which you retrieved intent metrics.
     */
    botId?: Id;
    /**
     * The results for the intent metrics.
     */
    results?: AnalyticsIntentResults;
    /**
     * If the response from the ListIntentMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListIntentMetrics request to return the next page of results. For a complete set of results, call the ListIntentMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListIntentPathsRequest {
    /**
     * The identifier for the bot for which you want to retrieve intent path metrics.
     */
    botId: Id;
    /**
     * The date and time that marks the beginning of the range of time for which you want to see intent path metrics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see intent path metrics.
     */
    endDateTime: Timestamp;
    /**
     * The intent path for which you want to retrieve metrics. Use a forward slash to separate intents in the path. For example:   /BookCar   /BookCar/BookHotel   /BookHotel/BookCar  
     */
    intentPath: AnalyticsPath;
    /**
     * A list of objects, each describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsPathFilters;
  }
  export interface ListIntentPathsResponse {
    /**
     * A list of objects, each of which contains information about a node in the intent path for which you requested metrics.
     */
    nodeSummaries?: AnalyticsIntentNodeSummaries;
  }
  export interface ListIntentStageMetricsRequest {
    /**
     * The identifier for the bot for which you want to retrieve intent stage metrics.
     */
    botId: Id;
    /**
     * The date and time that marks the beginning of the range of time for which you want to see intent stage metrics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see intent stage metrics.
     */
    endDateTime: Timestamp;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metrics: AnalyticsIntentStageMetrics;
    /**
     * A list of objects, each of which contains specifications for organizing the results by time.
     */
    binBy?: AnalyticsBinByList;
    /**
     * A list of objects, each of which specifies how to group the results. You can group by the following criteria:    IntentStageName – The name of the intent stage.    SwitchedToIntent – The intent to which the conversation was switched (if any).  
     */
    groupBy?: AnalyticsIntentStageGroupByList;
    /**
     * A list of objects, each of which describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsIntentStageFilters;
    /**
     * The maximum number of results to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListIntentStageMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListIntentStageMetrics request to return the next page of results. For a complete set of results, call the ListIntentStageMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListIntentStageMetricsResponse {
    /**
     * The identifier for the bot for which you retrieved intent stage metrics.
     */
    botId?: Id;
    /**
     * The results for the intent stage metrics.
     */
    results?: AnalyticsIntentStageResults;
    /**
     * If the response from the ListIntentStageMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListIntentStageMetrics request to return the next page of results. For a complete set of results, call the ListIntentStageMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListIntentsRequest {
    /**
     * The unique identifier of the bot that contains the intent.
     */
    botId: Id;
    /**
     * The version of the bot that contains the intent.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the intents to list. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Determines the sort order for the response from the ListIntents operation. You can choose to sort by the intent name or last updated date in either ascending or descending order.
     */
    sortBy?: IntentSortBy;
    /**
     * Provides the specification of a filter used to limit the intents in the response to only those that match the filter specification. You can only specify one filter and only one string to filter on.
     */
    filters?: IntentFilters;
    /**
     * The maximum number of intents to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListIntents operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListIntents request to return the next page of results. For a complete set of results, call the ListIntents operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListIntentsResponse {
    /**
     * The identifier of the bot that contains the intent.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the intent.
     */
    botVersion?: BotVersion;
    /**
     * The language and locale of the intents in the list.
     */
    localeId?: LocaleId;
    /**
     * Summary information for the intents that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more intents available, the nextToken field contains a token to get the next page of results.
     */
    intentSummaries?: IntentSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListIntents operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListIntents operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListRecommendedIntentsRequest {
    /**
     * The unique identifier of the bot associated with the recommended intents.
     */
    botId: Id;
    /**
     * The version of the bot that contains the recommended intents.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale of the recommended intents.
     */
    localeId: LocaleId;
    /**
     * The identifier of the bot recommendation that contains the recommended intents.
     */
    botRecommendationId: Id;
    /**
     * If the response from the ListRecommendedIntents operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of bot recommendations to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
  }
  export interface ListRecommendedIntentsResponse {
    /**
     * The unique identifier of the bot associated with the recommended intent.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the intent.
     */
    botVersion?: DraftBotVersion;
    /**
     * The identifier of the language and locale of the intents to list. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId?: LocaleId;
    /**
     * The identifier of the bot recommendation that contains the recommended intent.
     */
    botRecommendationId?: Id;
    /**
     * Summary information for the intents that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more intents available, the nextToken field contains a token to get the next page of results.
     */
    summaryList?: RecommendedIntentSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListRecommendedIntents operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListRecommendedIntents operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSessionAnalyticsDataRequest {
    /**
     * The identifier for the bot for which you want to retrieve session analytics.
     */
    botId: Id;
    /**
     * The date and time that marks the beginning of the range of time for which you want to see session analytics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see session analytics.
     */
    endDateTime: Timestamp;
    /**
     * An object specifying the measure and method by which to sort the session analytics data.
     */
    sortBy?: SessionDataSortBy;
    /**
     * A list of objects, each of which describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsSessionFilters;
    /**
     * The maximum number of results to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListSessionAnalyticsData operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListSessionAnalyticsData request to return the next page of results. For a complete set of results, call the ListSessionAnalyticsData operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListSessionAnalyticsDataResponse {
    /**
     * The unique identifier of the bot that the sessions belong to.
     */
    botId?: Id;
    /**
     * If the response from the ListSessionAnalyticsData operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListSessionAnalyticsData request to return the next page of results. For a complete set of results, call the ListSessionAnalyticsData operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
    /**
     * A list of objects, each of which contains information about a session with the bot.
     */
    sessions?: SessionSpecifications;
  }
  export interface ListSessionMetricsRequest {
    /**
     * The identifier for the bot for which you want to retrieve session metrics.
     */
    botId: Id;
    /**
     * The date and time that marks the beginning of the range of time for which you want to see session metrics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see session metrics.
     */
    endDateTime: Timestamp;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metrics: AnalyticsSessionMetrics;
    /**
     * A list of objects, each of which contains specifications for organizing the results by time.
     */
    binBy?: AnalyticsBinByList;
    /**
     * A list of objects, each of which specifies how to group the results. You can group by the following criteria:    ConversationEndState – The final state of the conversation. The possible end states are detailed in Key definitions in the user guide.    LocaleId – The unique identifier of the bot locale.  
     */
    groupBy?: AnalyticsSessionGroupByList;
    /**
     * A list of objects, each of which describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsSessionFilters;
    /**
     * The maximum number of results to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListSessionMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListSessionMetrics request to return the next page of results. For a complete set of results, call the ListSessionMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListSessionMetricsResponse {
    /**
     * The identifier for the bot for which you retrieved session metrics.
     */
    botId?: Id;
    /**
     * The results for the session metrics.
     */
    results?: AnalyticsSessionResults;
    /**
     * If the response from the ListSessionMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListSessionMetrics request to return the next page of results. For a complete set of results, call the ListSessionMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListSlotTypesRequest {
    /**
     * The unique identifier of the bot that contains the slot types.
     */
    botId: Id;
    /**
     * The version of the bot that contains the slot type.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the slot types to list. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Determines the sort order for the response from the ListSlotTypes operation. You can choose to sort by the slot type name or last updated date in either ascending or descending order.
     */
    sortBy?: SlotTypeSortBy;
    /**
     * Provides the specification of a filter used to limit the slot types in the response to only those that match the filter specification. You can only specify one filter and only one string to filter on.
     */
    filters?: SlotTypeFilters;
    /**
     * The maximum number of slot types to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListSlotTypes operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSlotTypesResponse {
    /**
     * The identifier of the bot that contains the slot types.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the slot types.
     */
    botVersion?: BotVersion;
    /**
     * The language and local of the slot types in the list.
     */
    localeId?: LocaleId;
    /**
     * Summary information for the slot types that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more slot types available, the nextToken field contains a token to get the next page of results.
     */
    slotTypeSummaries?: SlotTypeSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListSlotTypes operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListSlotTypes operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSlotsRequest {
    /**
     * The identifier of the bot that contains the slot.
     */
    botId: Id;
    /**
     * The version of the bot that contains the slot.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the slots to list. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The unique identifier of the intent that contains the slot.
     */
    intentId: Id;
    /**
     * Determines the sort order for the response from the ListSlots operation. You can choose to sort by the slot name or last updated date in either ascending or descending order.
     */
    sortBy?: SlotSortBy;
    /**
     * Provides the specification of a filter used to limit the slots in the response to only those that match the filter specification. You can only specify one filter and only one string to filter on.
     */
    filters?: SlotFilters;
    /**
     * The maximum number of slots to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListSlots operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListSlotsResponse {
    /**
     * The identifier of the bot that contains the slots.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the slots.
     */
    botVersion?: BotVersion;
    /**
     * The language and locale of the slots in the list.
     */
    localeId?: LocaleId;
    /**
     * The identifier of the intent that contains the slots.
     */
    intentId?: Id;
    /**
     * Summary information for the slots that meet the filter criteria specified in the request. The length of the list is specified in the maxResults parameter of the request. If there are more slots available, the nextToken field contains a token to get the next page of results.
     */
    slotSummaries?: SlotSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListSlots operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListSlots operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to get a list of tags for.
     */
    resourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with a resource.
     */
    tags?: TagMap;
  }
  export interface ListTestExecutionResultItemsRequest {
    /**
     * The unique identifier of the test execution to list the result items.
     */
    testExecutionId: Id;
    /**
     * The filter for the list of results from the test set execution.
     */
    resultFilterBy: TestExecutionResultFilterBy;
    /**
     * The maximum number of test execution result items to return in each page. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListTestExecutionResultItems operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestExecutionResultItemsResponse {
    /**
     * The list of results from the test execution.
     */
    testExecutionResults?: TestExecutionResultItems;
    /**
     * A token that indicates whether there are more results to return in a response to the ListTestExecutionResultItems operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListTestExecutionResultItems operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestExecutionsRequest {
    /**
     * The sort order of the test set executions.
     */
    sortBy?: TestExecutionSortBy;
    /**
     * The maximum number of test executions to return in each page. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListTestExecutions operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestExecutionsResponse {
    /**
     * The list of test executions.
     */
    testExecutions?: TestExecutionSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListTestExecutions operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListTestExecutions operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestSetRecordsRequest {
    /**
     * The identifier of the test set to list its test set records.
     */
    testSetId: Id;
    /**
     * The maximum number of test set records to return in each page. If there are fewer records than the max page size, only the actual number of records are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListTestSetRecords operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestSetRecordsResponse {
    /**
     * The list of records from the test set.
     */
    testSetRecords?: TestSetTurnRecordList;
    /**
     * A token that indicates whether there are more records to return in a response to the ListTestSetRecords operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListTestSetRecords operation request to get the next page of records.
     */
    nextToken?: NextToken;
  }
  export interface ListTestSetsRequest {
    /**
     * The sort order for the list of test sets.
     */
    sortBy?: TestSetSortBy;
    /**
     * The maximum number of test sets to return in each page. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListTestSets operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTestSetsResponse {
    /**
     * The selected test sets in a list of test sets.
     */
    testSets?: TestSetSummaryList;
    /**
     * A token that indicates whether there are more results to return in a response to the ListTestSets operation. If the nextToken field is present, you send the contents as the nextToken parameter of a ListTestSets operation request to get the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListUtteranceAnalyticsDataRequest {
    /**
     * The identifier for the bot for which you want to retrieve utterance analytics.
     */
    botId: Id;
    /**
     * The date and time that marks the beginning of the range of time for which you want to see utterance analytics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see utterance analytics.
     */
    endDateTime: Timestamp;
    /**
     * An object specifying the measure and method by which to sort the utterance analytics data.
     */
    sortBy?: UtteranceDataSortBy;
    /**
     * A list of objects, each of which describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsUtteranceFilters;
    /**
     * The maximum number of results to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListUtteranceAnalyticsData operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListUtteranceAnalyticsData request to return the next page of results. For a complete set of results, call the ListUtteranceAnalyticsData operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListUtteranceAnalyticsDataResponse {
    /**
     * The unique identifier of the bot that the utterances belong to.
     */
    botId?: Id;
    /**
     * If the response from the ListUtteranceAnalyticsData operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListUtteranceAnalyticsData request to return the next page of results. For a complete set of results, call the ListUtteranceAnalyticsData operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
    /**
     * A list of objects, each of which contains information about an utterance in a user session with your bot.
     */
    utterances?: UtteranceSpecifications;
  }
  export interface ListUtteranceMetricsRequest {
    /**
     * The identifier for the bot for which you want to retrieve utterance metrics.
     */
    botId: Id;
    /**
     * The date and time that marks the beginning of the range of time for which you want to see utterance metrics.
     */
    startDateTime: Timestamp;
    /**
     * The date and time that marks the end of the range of time for which you want to see utterance metrics.
     */
    endDateTime: Timestamp;
    /**
     * A list of objects, each of which contains a metric you want to list, the statistic for the metric you want to return, and the method by which to organize the results.
     */
    metrics: AnalyticsUtteranceMetrics;
    /**
     * A list of objects, each of which contains specifications for organizing the results by time.
     */
    binBy?: AnalyticsBinByList;
    /**
     * A list of objects, each of which specifies how to group the results. You can group by the following criteria:    UtteranceText – The transcription of the utterance.    UtteranceState – The state of the utterance. The possible states are detailed in Key definitions in the user guide.  
     */
    groupBy?: AnalyticsUtteranceGroupByList;
    /**
     * A list containing attributes related to the utterance that you want the response to return. The following attributes are possible:    LastUsedIntent – The last used intent at the time of the utterance.  
     */
    attributes?: AnalyticsUtteranceAttributes;
    /**
     * A list of objects, each of which describes a condition by which you want to filter the results.
     */
    filters?: AnalyticsUtteranceFilters;
    /**
     * The maximum number of results to return in each page of results. If there are fewer results than the maximum page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the ListUtteranceMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListUtteranceMetrics request to return the next page of results. For a complete set of results, call the ListUtteranceMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export interface ListUtteranceMetricsResponse {
    /**
     * The identifier for the bot for which you retrieved utterance metrics.
     */
    botId?: Id;
    /**
     * The results for the utterance metrics.
     */
    results?: AnalyticsUtteranceResults;
    /**
     * If the response from the ListUtteranceMetrics operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use the returned token in the nextToken parameter of a ListUtteranceMetrics request to return the next page of results. For a complete set of results, call the ListUtteranceMetrics operation until the nextToken returned in the response is null.
     */
    nextToken?: NextToken;
  }
  export type LocaleId = string;
  export type LocaleName = string;
  export type LogPrefix = string;
  export type MaxResults = number;
  export type MaxUtteranceDigits = number;
  export type MergeStrategy = "Overwrite"|"FailOnConflict"|"Append"|string;
  export interface Message {
    /**
     * A message in plain text format.
     */
    plainTextMessage?: PlainTextMessage;
    /**
     * A message in a custom format defined by the client application.
     */
    customPayload?: CustomPayload;
    /**
     * A message in Speech Synthesis Markup Language (SSML).
     */
    ssmlMessage?: SSMLMessage;
    /**
     * A message that defines a response card that the client application can show to the user.
     */
    imageResponseCard?: ImageResponseCard;
  }
  export interface MessageGroup {
    /**
     * The primary message that Amazon Lex should send to the user.
     */
    message: Message;
    /**
     * Message variations to send to the user. When variations are defined, Amazon Lex chooses the primary message or one of the variations to send to the user.
     */
    variations?: MessageVariationsList;
  }
  export type MessageGroupsList = MessageGroup[];
  export type MessageSelectionStrategy = "Random"|"Ordered"|string;
  export type MessageVariationsList = Message[];
  export type MissedCount = number;
  export interface MultipleValuesSetting {
    /**
     * Indicates whether a slot can return multiple values. When true, the slot may return more than one value in a response. When false, the slot returns only a single value. Multi-value slots are only available in the en-US locale. If you set this value to true in any other locale, Amazon Lex throws a ValidationException. If the allowMutlipleValues is not set, the default value is false.
     */
    allowMultipleValues?: Boolean;
  }
  export type Name = string;
  export interface NewCustomVocabularyItem {
    /**
     * The unique phrase for the new custom vocabulary item from the custom vocabulary list.
     */
    phrase: Phrase;
    /**
     * The weight assigned to the new custom vocabulary item from the custom vocabulary list.
     */
    weight?: Weight;
    /**
     * The display as value assigned to the new custom vocabulary item from the custom vocabulary list.
     */
    displayAs?: Phrase;
  }
  export type NextIndex = number;
  export type NextToken = string;
  export type NonEmptyString = string;
  export type NumericalBotVersion = string;
  export interface ObfuscationSetting {
    /**
     * Value that determines whether Amazon Lex obscures slot values in conversation logs. The default is to obscure the values.
     */
    obfuscationSettingType: ObfuscationSettingType;
  }
  export type ObfuscationSettingType = "None"|"DefaultObfuscation"|string;
  export type ObjectPrefix = string;
  export type ObjectPrefixes = ObjectPrefix[];
  export type Operation = string;
  export type OperationList = Operation[];
  export interface OutputContext {
    /**
     * The name of the output context.
     */
    name: Name;
    /**
     * The amount of time, in seconds, that the output context should remain active. The time is figured from the first time the context is sent to the user.
     */
    timeToLiveInSeconds: ContextTimeToLiveInSeconds;
    /**
     * The number of conversation turns that the output context should remain active. The number of turns is counted from the first time that the context is sent to the user.
     */
    turnsToLive: ContextTurnsToLive;
  }
  export type OutputContextsList = OutputContext[];
  export interface OverallTestResultItem {
    /**
     * Indicates whether the conversation contains multiple turns or not.
     */
    multiTurnConversation: Boolean;
    /**
     * The total number of overall results in the result of the test execution.
     */
    totalResultCount: Count;
    /**
     * The number of speech transcription results in the overall test.
     */
    speechTranscriptionResultCounts?: TestResultMatchStatusCountMap;
    /**
     * The number of results that succeeded.
     */
    endToEndResultCounts: TestResultMatchStatusCountMap;
  }
  export type OverallTestResultItemList = OverallTestResultItem[];
  export interface OverallTestResults {
    /**
     * A list of the overall test results.
     */
    items: OverallTestResultItemList;
  }
  export interface ParentBotNetwork {
    /**
     * The identifier of the network of bots assigned by Amazon Lex.
     */
    botId: Id;
    /**
     * The version of the network of bots.
     */
    botVersion: BotVersion;
  }
  export type ParentBotNetworks = ParentBotNetwork[];
  export interface PathFormat {
    /**
     * A list of Amazon S3 prefixes that points to sub-folders in the Amazon S3 bucket. Specify this list if you only want Lex to read the files under this set of sub-folders.
     */
    objectPrefixes?: ObjectPrefixes;
  }
  export type Phrase = string;
  export interface PlainTextMessage {
    /**
     * The message to send to the user.
     */
    value: PlainTextMessageValue;
  }
  export type PlainTextMessageValue = string;
  export type Policy = string;
  export interface PostDialogCodeHookInvocationSpecification {
    successResponse?: ResponseSpecification;
    /**
     * Specifics the next step the bot runs after the dialog code hook finishes successfully. 
     */
    successNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the dialog code hook finishes successfully.
     */
    successConditional?: ConditionalSpecification;
    failureResponse?: ResponseSpecification;
    /**
     * Specifies the next step the bot runs after the dialog code hook throws an exception or returns with the State field of the Intent object set to Failed.
     */
    failureNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the dialog code hook throws an exception or returns with the State field of the Intent object set to Failed.
     */
    failureConditional?: ConditionalSpecification;
    timeoutResponse?: ResponseSpecification;
    /**
     * Specifies the next step that the bot runs when the code hook times out.
     */
    timeoutNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate if the code hook times out.
     */
    timeoutConditional?: ConditionalSpecification;
  }
  export interface PostFulfillmentStatusSpecification {
    successResponse?: ResponseSpecification;
    failureResponse?: ResponseSpecification;
    timeoutResponse?: ResponseSpecification;
    /**
     * Specifies the next step in the conversation that Amazon Lex invokes when the fulfillment code hook completes successfully.
     */
    successNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the fulfillment code hook finishes successfully.
     */
    successConditional?: ConditionalSpecification;
    /**
     * Specifies the next step the bot runs after the fulfillment code hook throws an exception or returns with the State field of the Intent object set to Failed.
     */
    failureNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the fulfillment code hook throws an exception or returns with the State field of the Intent object set to Failed.
     */
    failureConditional?: ConditionalSpecification;
    /**
     * Specifies the next step that the bot runs when the fulfillment code hook times out.
     */
    timeoutNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate if the fulfillment code hook times out.
     */
    timeoutConditional?: ConditionalSpecification;
  }
  export type PresignedS3Url = string;
  export interface Principal {
    /**
     * The name of the Amazon Web Services service that should allowed or denied access to an Amazon Lex action.
     */
    service?: ServicePrincipal;
    /**
     * The Amazon Resource Name (ARN) of the principal.
     */
    arn?: PrincipalArn;
  }
  export type PrincipalArn = string;
  export type PrincipalList = Principal[];
  export type PriorityValue = number;
  export type PromptAttempt = "Initial"|"Retry1"|"Retry2"|"Retry3"|"Retry4"|"Retry5"|string;
  export interface PromptAttemptSpecification {
    /**
     * Indicates whether the user can interrupt a speech prompt attempt from the bot.
     */
    allowInterrupt?: BoxedBoolean;
    /**
     * Indicates the allowed input types of the prompt attempt.
     */
    allowedInputTypes: AllowedInputTypes;
    /**
     * Specifies the settings on audio and DTMF input.
     */
    audioAndDTMFInputSpecification?: AudioAndDTMFInputSpecification;
    /**
     * Specifies the settings on text input.
     */
    textInputSpecification?: TextInputSpecification;
  }
  export type PromptAttemptsSpecificationMap = {[key: string]: PromptAttemptSpecification};
  export type PromptMaxRetries = number;
  export interface PromptSpecification {
    /**
     * A collection of messages that Amazon Lex can send to the user. Amazon Lex chooses the actual message to send at runtime.
     */
    messageGroups: MessageGroupsList;
    /**
     * The maximum number of times the bot tries to elicit a response from the user using this prompt.
     */
    maxRetries: PromptMaxRetries;
    /**
     * Indicates whether the user can interrupt a speech prompt from the bot.
     */
    allowInterrupt?: BoxedBoolean;
    /**
     * Indicates how a message is selected from a message group among retries.
     */
    messageSelectionStrategy?: MessageSelectionStrategy;
    /**
     * Specifies the advanced settings on each attempt of the prompt.
     */
    promptAttemptsSpecification?: PromptAttemptsSpecificationMap;
  }
  export type QueryFilterString = string;
  export type RecommendedAction = string;
  export type RecommendedActions = RecommendedAction[];
  export interface RecommendedIntentSummary {
    /**
     * The unique identifier of a recommended intent associated with the bot recommendation.
     */
    intentId?: Id;
    /**
     * The name of a recommended intent associated with the bot recommendation.
     */
    intentName?: Name;
    /**
     * The count of sample utterances of a recommended intent that is associated with a bot recommendation.
     */
    sampleUtterancesCount?: SampleUtterancesCount;
  }
  export type RecommendedIntentSummaryList = RecommendedIntentSummary[];
  export type RecordNumber = number;
  export type RegexPattern = string;
  export interface RelativeAggregationDuration {
    /**
     * The type of time period that the timeValue field represents. 
     */
    timeDimension: TimeDimension;
    /**
     * The period of the time window to gather statistics for. The valid value depends on the setting of the timeDimension field.    Hours - 1/3/6/12/24    Days - 3    Weeks - 1/2  
     */
    timeValue: TimeValue;
  }
  export type ResourceCount = number;
  export interface ResponseSpecification {
    /**
     * A collection of responses that Amazon Lex can send to the user. Amazon Lex chooses the actual response to send at runtime.
     */
    messageGroups: MessageGroupsList;
    /**
     * Indicates whether the user can interrupt a speech response from Amazon Lex.
     */
    allowInterrupt?: BoxedBoolean;
  }
  export type RevisionId = string;
  export type RoleArn = string;
  export interface RuntimeHintDetails {
    /**
     * One or more strings that Amazon Lex should look for in the input to the bot. Each phrase is given preference when deciding on slot values.
     */
    runtimeHintValues?: RuntimeHintValuesList;
    /**
     * A map of constituent sub slot names inside a composite slot in the intent and the phrases that should be added for each sub slot. Inside each composite slot hints, this structure provides a mechanism to add granular sub slot phrases. Only sub slot hints are supported for composite slots. The intent name, composite slot name and the constituent sub slot names must exist.
     */
    subSlotHints?: SlotHintsSlotMap;
  }
  export type RuntimeHintPhrase = string;
  export interface RuntimeHintValue {
    /**
     * The phrase that Amazon Lex should look for in the user's input to the bot.
     */
    phrase: RuntimeHintPhrase;
  }
  export type RuntimeHintValuesList = RuntimeHintValue[];
  export interface RuntimeHints {
    /**
     * A list of the slots in the intent that should have runtime hints added, and the phrases that should be added for each slot. The first level of the slotHints map is the name of the intent. The second level is the name of the slot within the intent. For more information, see Using hints to improve accuracy. The intent name and slot name must exist.
     */
    slotHints?: SlotHintsIntentMap;
  }
  export type S3BucketArn = string;
  export interface S3BucketLogDestination {
    /**
     * The Amazon Resource Name (ARN) of an Amazon Web Services Key Management Service (KMS) key for encrypting audio log files stored in an S3 bucket.
     */
    kmsKeyArn?: KmsKeyArn;
    /**
     * The Amazon Resource Name (ARN) of an Amazon S3 bucket where audio log files are stored.
     */
    s3BucketArn: S3BucketArn;
    /**
     * The S3 prefix to assign to audio log files.
     */
    logPrefix: LogPrefix;
  }
  export type S3BucketName = string;
  export interface S3BucketTranscriptSource {
    /**
     * The name of the bucket containing the transcript and the associated metadata.
     */
    s3BucketName: S3BucketName;
    /**
     * The object that contains a path format that will be applied when Amazon Lex reads the transcript file in the bucket you provide. Specify this object if you only want Lex to read a subset of files in your Amazon S3 bucket.
     */
    pathFormat?: PathFormat;
    /**
     * The format of the transcript content. Currently, Genie only supports the Amazon Lex transcript format.
     */
    transcriptFormat: TranscriptFormat;
    /**
     * The object that contains the filter which will be applied when Amazon Lex reads through the Amazon S3 bucket. Specify this object if you want Amazon Lex to read only a subset of the Amazon S3 bucket based on the filter you provide.
     */
    transcriptFilter?: TranscriptFilter;
    /**
     * The ARN of the KMS key that customer use to encrypt their Amazon S3 bucket. Only use this field if your bucket is encrypted using a customer managed KMS key.
     */
    kmsKeyArn?: KmsKeyArn;
  }
  export type S3ObjectPath = string;
  export interface SSMLMessage {
    /**
     * The SSML text that defines the prompt.
     */
    value: SSMLMessageValue;
  }
  export type SSMLMessageValue = string;
  export interface SampleUtterance {
    /**
     * The sample utterance that Amazon Lex uses to build its machine-learning model to recognize intents.
     */
    utterance: Utterance;
  }
  export type SampleUtterancesCount = number;
  export type SampleUtterancesList = SampleUtterance[];
  export interface SampleValue {
    /**
     * The value that can be used for a slot type.
     */
    value: Value;
  }
  export interface SearchAssociatedTranscriptsRequest {
    /**
     * The unique identifier of the bot associated with the transcripts that you are searching.
     */
    botId: Id;
    /**
     * The version of the bot containing the transcripts that you are searching.
     */
    botVersion: BotVersion;
    /**
     * The identifier of the language and locale of the transcripts to search. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId: LocaleId;
    /**
     * The unique identifier of the bot recommendation associated with the transcripts to search.
     */
    botRecommendationId: Id;
    /**
     * How SearchResults are ordered. Valid values are Ascending or Descending. The default is Descending.
     */
    searchOrder?: SearchOrder;
    /**
     * A list of filter objects.
     */
    filters: AssociatedTranscriptFilters;
    /**
     * The maximum number of bot recommendations to return in each page of results. If there are fewer results than the max page size, only the actual number of results are returned.
     */
    maxResults?: MaxResults;
    /**
     * If the response from the SearchAssociatedTranscriptsRequest operation contains more results than specified in the maxResults parameter, an index is returned in the response. Use that index in the nextIndex parameter to return the next page of results.
     */
    nextIndex?: NextIndex;
  }
  export interface SearchAssociatedTranscriptsResponse {
    /**
     * The unique identifier of the bot associated with the transcripts that you are searching.
     */
    botId?: Id;
    /**
     * The version of the bot containing the transcripts that you are searching.
     */
    botVersion?: BotVersion;
    /**
     * The identifier of the language and locale of the transcripts to search. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId?: LocaleId;
    /**
     *  The unique identifier of the bot recommendation associated with the transcripts to search.
     */
    botRecommendationId?: Id;
    /**
     * A index that indicates whether there are more results to return in a response to the SearchAssociatedTranscripts operation. If the nextIndex field is present, you send the contents as the nextIndex parameter of a SearchAssociatedTranscriptsRequest operation to get the next page of results.
     */
    nextIndex?: NextIndex;
    /**
     * The object that contains the associated transcript that meet the criteria you specified.
     */
    associatedTranscripts?: AssociatedTranscriptList;
    /**
     * The total number of transcripts returned by the search.
     */
    totalResults?: MaxResults;
  }
  export type SearchOrder = "Ascending"|"Descending"|string;
  export interface SentimentAnalysisSettings {
    /**
     * Sets whether Amazon Lex uses Amazon Comprehend to detect the sentiment of user utterances.
     */
    detectSentiment: Boolean;
  }
  export type ServicePrincipal = string;
  export interface SessionDataSortBy {
    /**
     * The measure by which to sort the session analytics data.    conversationStartTime – The date and time when the conversation began. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.    numberOfTurns – The number of turns that the session took.    conversationDurationSeconds – The duration of the conversation in seconds.  
     */
    name: AnalyticsSessionSortByName;
    /**
     * Specifies whether to sort the results in ascending or descending order.
     */
    order: AnalyticsSortOrder;
  }
  export type SessionId = string;
  export interface SessionSpecification {
    /**
     * The identifier of the alias of the bot that the session was held with.
     */
    botAliasId?: BotAliasId;
    /**
     * The version of the bot that the session was held with.
     */
    botVersion?: NumericalBotVersion;
    /**
     * The locale of the bot that the session was held with.
     */
    localeId?: LocaleId;
    /**
     * The channel that is integrated with the bot that the session was held with.
     */
    channel?: AnalyticsChannel;
    /**
     * The identifier of the session.
     */
    sessionId?: AnalyticsSessionId;
    /**
     * The date and time when the conversation began. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.
     */
    conversationStartTime?: Timestamp;
    /**
     * The date and time when the conversation ended. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.
     */
    conversationEndTime?: Timestamp;
    /**
     * The duration of the conversation in seconds. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.
     */
    conversationDurationSeconds?: AnalyticsLongValue;
    /**
     * The final state of the conversation. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.
     */
    conversationEndState?: ConversationEndState;
    /**
     * The mode of the session. The possible values are as follows:    Speech – The session was spoken.    Text – The session was written.    DTMF – The session used a touch-tone keypad (Dual Tone Multi-Frequency).    MultiMode – The session used multiple modes.  
     */
    mode?: AnalyticsModality;
    /**
     * The number of turns that the session took.
     */
    numberOfTurns?: AnalyticsLongValue;
    /**
     * A list of objects containing the name of an intent that was invoked.
     */
    invokedIntentSamples?: InvokedIntentSamples;
    /**
     * The identifier of the first request in a session.
     */
    originatingRequestId?: AnalyticsOriginatingRequestId;
  }
  export type SessionSpecifications = SessionSpecification[];
  export type SessionTTL = number;
  export type SkipResourceInUseCheck = boolean;
  export interface SlotCaptureSetting {
    captureResponse?: ResponseSpecification;
    /**
     * Specifies the next step that the bot runs when the slot value is captured before the code hook times out.
     */
    captureNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate after the slot value is captured.
     */
    captureConditional?: ConditionalSpecification;
    failureResponse?: ResponseSpecification;
    /**
     * Specifies the next step that the bot runs when the slot value code is not recognized.
     */
    failureNextStep?: DialogState;
    /**
     * A list of conditional branches to evaluate when the slot value isn't captured.
     */
    failureConditional?: ConditionalSpecification;
    /**
     * Code hook called after Amazon Lex successfully captures a slot value.
     */
    codeHook?: DialogCodeHookInvocationSetting;
    /**
     * Code hook called when Amazon Lex doesn't capture a slot value.
     */
    elicitationCodeHook?: ElicitationCodeHookInvocationSetting;
  }
  export type SlotConstraint = "Required"|"Optional"|string;
  export interface SlotDefaultValue {
    /**
     * The default value to use when a user doesn't provide a value for a slot.
     */
    defaultValue: SlotDefaultValueString;
  }
  export type SlotDefaultValueList = SlotDefaultValue[];
  export interface SlotDefaultValueSpecification {
    /**
     * A list of default values. Amazon Lex chooses the default value to use in the order that they are presented in the list.
     */
    defaultValueList: SlotDefaultValueList;
  }
  export type SlotDefaultValueString = string;
  export interface SlotFilter {
    /**
     * The name of the field to use for filtering.
     */
    name: SlotFilterName;
    /**
     * The value to use to filter the response.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListSlots operation should return only aliases that equal the specified value. Specify CO when the ListSlots operation should return aliases that contain the specified value.
     */
    operator: SlotFilterOperator;
  }
  export type SlotFilterName = "SlotName"|string;
  export type SlotFilterOperator = "CO"|"EQ"|string;
  export type SlotFilters = SlotFilter[];
  export type SlotHintsIntentMap = {[key: string]: SlotHintsSlotMap};
  export type SlotHintsSlotMap = {[key: string]: RuntimeHintDetails};
  export type SlotPrioritiesList = SlotPriority[];
  export interface SlotPriority {
    /**
     * The priority that Amazon Lex should apply to the slot.
     */
    priority: PriorityValue;
    /**
     * The unique identifier of the slot.
     */
    slotId: Id;
  }
  export interface SlotResolutionTestResultItem {
    /**
     * The name of the slot.
     */
    slotName: TestResultSlotName;
    /**
     * A result for slot resolution in the results of a test execution.
     */
    resultCounts: SlotResolutionTestResultItemCounts;
  }
  export interface SlotResolutionTestResultItemCounts {
    /**
     * The total number of results.
     */
    totalResultCount: Count;
    /**
     * The number of matched, mismatched and execution error results for speech transcription for the slot.
     */
    speechTranscriptionResultCounts?: TestResultMatchStatusCountMap;
    /**
     * The number of matched and mismatched results for slot resolution for the slot.
     */
    slotMatchResultCounts: TestResultMatchStatusCountMap;
  }
  export type SlotResolutionTestResultItems = SlotResolutionTestResultItem[];
  export type SlotShape = "Scalar"|"List"|string;
  export type SlotSortAttribute = "SlotName"|"LastUpdatedDateTime"|string;
  export interface SlotSortBy {
    /**
     * The attribute to use to sort the list.
     */
    attribute: SlotSortAttribute;
    /**
     * The order to sort the list. You can choose ascending or descending.
     */
    order: SortOrder;
  }
  export interface SlotSummary {
    /**
     * The unique identifier of the slot.
     */
    slotId?: Id;
    /**
     * The name given to the slot.
     */
    slotName?: Name;
    /**
     * The description of the slot.
     */
    description?: Description;
    /**
     * Whether the slot is required or optional. An intent is complete when all required slots are filled.
     */
    slotConstraint?: SlotConstraint;
    /**
     * The unique identifier for the slot type that defines the values for the slot.
     */
    slotTypeId?: BuiltInOrCustomSlotTypeId;
    /**
     * Prompts that are sent to the user to elicit a value for the slot.
     */
    valueElicitationPromptSpecification?: PromptSpecification;
    /**
     * The timestamp of the last date and time that the slot was updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type SlotSummaryList = SlotSummary[];
  export type SlotTypeCategory = "Custom"|"Extended"|"ExternalGrammar"|"Composite"|string;
  export interface SlotTypeFilter {
    /**
     * The name of the field to use for filtering.
     */
    name: SlotTypeFilterName;
    /**
     * The value to use to filter the response.
     */
    values: FilterValues;
    /**
     * The operator to use for the filter. Specify EQ when the ListSlotTypes operation should return only aliases that equal the specified value. Specify CO when the ListSlotTypes operation should return aliases that contain the specified value.
     */
    operator: SlotTypeFilterOperator;
  }
  export type SlotTypeFilterName = "SlotTypeName"|"ExternalSourceType"|string;
  export type SlotTypeFilterOperator = "CO"|"EQ"|string;
  export type SlotTypeFilters = SlotTypeFilter[];
  export type SlotTypeSignature = string;
  export type SlotTypeSortAttribute = "SlotTypeName"|"LastUpdatedDateTime"|string;
  export interface SlotTypeSortBy {
    /**
     * The attribute to use to sort the list of slot types.
     */
    attribute: SlotTypeSortAttribute;
    /**
     * The order to sort the list. You can say ascending or descending.
     */
    order: SortOrder;
  }
  export interface SlotTypeStatistics {
    /**
     * The number of recommended slot types associated with the bot recommendation.
     */
    discoveredSlotTypeCount?: Count;
  }
  export interface SlotTypeSummary {
    /**
     * The unique identifier assigned to the slot type.
     */
    slotTypeId?: Id;
    /**
     * The name of the slot type.
     */
    slotTypeName?: Name;
    /**
     * The description of the slot type.
     */
    description?: Description;
    /**
     * If the slot type is derived from a built-on slot type, the name of the parent slot type.
     */
    parentSlotTypeSignature?: SlotTypeSignature;
    /**
     * A timestamp of the date and time that the slot type was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * Indicates the type of the slot type.    Custom - A slot type that you created using custom values. For more information, see Creating custom slot types.    Extended - A slot type created by extending the AMAZON.AlphaNumeric built-in slot type. For more information, see  AMAZON.AlphaNumeric .    ExternalGrammar - A slot type using a custom GRXML grammar to define values. For more information, see Using a custom grammar slot type.  
     */
    slotTypeCategory?: SlotTypeCategory;
  }
  export type SlotTypeSummaryList = SlotTypeSummary[];
  export interface SlotTypeValue {
    /**
     * The value of the slot type entry.
     */
    sampleValue?: SampleValue;
    /**
     * Additional values related to the slot type entry.
     */
    synonyms?: SynonymList;
  }
  export type SlotTypeValues = SlotTypeValue[];
  export interface SlotValue {
    /**
     * The value that Amazon Lex determines for the slot. The actual value depends on the setting of the value selection strategy for the bot. You can choose to use the value entered by the user, or you can have Amazon Lex choose the first value in the resolvedValues list.
     */
    interpretedValue?: NonEmptyString;
  }
  export interface SlotValueElicitationSetting {
    /**
     * A list of default values for a slot. Default values are used when Amazon Lex hasn't determined a value for a slot. You can specify default values from context variables, session attributes, and defined values.
     */
    defaultValueSpecification?: SlotDefaultValueSpecification;
    /**
     * Specifies whether the slot is required or optional.
     */
    slotConstraint: SlotConstraint;
    /**
     * The prompt that Amazon Lex uses to elicit the slot value from the user.
     */
    promptSpecification?: PromptSpecification;
    /**
     * If you know a specific pattern that users might respond to an Amazon Lex request for a slot value, you can provide those utterances to improve accuracy. This is optional. In most cases, Amazon Lex is capable of understanding user utterances.
     */
    sampleUtterances?: SampleUtterancesList;
    waitAndContinueSpecification?: WaitAndContinueSpecification;
    /**
     * Specifies the settings that Amazon Lex uses when a slot value is successfully entered by a user.
     */
    slotCaptureSetting?: SlotCaptureSetting;
  }
  export interface SlotValueOverride {
    /**
     * When the shape value is List, it indicates that the values field contains a list of slot values. When the value is Scalar, it indicates that the value field contains a single value.
     */
    shape?: SlotShape;
    /**
     * The current value of the slot.
     */
    value?: SlotValue;
    /**
     * A list of one or more values that the user provided for the slot. For example, for a slot that elicits pizza toppings, the values might be "pepperoni" and "pineapple."
     */
    values?: SlotValues;
  }
  export type SlotValueOverrideMap = {[key: string]: SlotValueOverride};
  export interface SlotValueRegexFilter {
    /**
     * A regular expression used to validate the value of a slot.  Use a standard regular expression. Amazon Lex supports the following characters in the regular expression:    A-Z, a-z   0-9   Unicode characters ("\⁠u&lt;Unicode&gt;")    Represent Unicode characters with four digits, for example "\⁠u0041" or "\⁠u005A".   The following regular expression operators are not supported:    Infinite repeaters: *, +, or {x,} with no upper bound.   Wild card (.)  
     */
    pattern: RegexPattern;
  }
  export type SlotValueResolutionStrategy = "OriginalValue"|"TopResolution"|"Concatenation"|string;
  export interface SlotValueSelectionSetting {
    /**
     * Determines the slot resolution strategy that Amazon Lex uses to return slot type values. The field can be set to one of the following values:    ORIGINAL_VALUE - Returns the value entered by the user, if the user value is similar to the slot value.    TOP_RESOLUTION - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.   If you don't specify the valueSelectionStrategy, the default is ORIGINAL_VALUE.
     */
    resolutionStrategy: SlotValueResolutionStrategy;
    /**
     * A regular expression used to validate the value of a slot.
     */
    regexFilter?: SlotValueRegexFilter;
    /**
     * Provides settings that enable advanced recognition settings for slot values. You can use this to enable using slot values as a custom vocabulary for recognizing user utterances.
     */
    advancedRecognitionSetting?: AdvancedRecognitionSetting;
  }
  export type SlotValues = SlotValueOverride[];
  export type SortOrder = "Ascending"|"Descending"|string;
  export interface Specifications {
    /**
     * The unique identifier assigned to the slot type.
     */
    slotTypeId: BuiltInOrCustomSlotTypeId;
    /**
     * Specifies the elicitation setting details for constituent sub slots of a composite slot.
     */
    valueElicitationSetting: SubSlotValueElicitationSetting;
  }
  export interface StartBotRecommendationRequest {
    /**
     * The unique identifier of the bot containing the bot recommendation.
     */
    botId: Id;
    /**
     * The version of the bot containing the bot recommendation.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to start. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId: LocaleId;
    /**
     * The object representing the Amazon S3 bucket containing the transcript, as well as the associated metadata.
     */
    transcriptSourceSetting: TranscriptSourceSetting;
    /**
     * The object representing the passwords that will be used to encrypt the data related to the bot recommendation results, as well as the KMS key ARN used to encrypt the associated metadata.
     */
    encryptionSetting?: EncryptionSetting;
  }
  export interface StartBotRecommendationResponse {
    /**
     * The unique identifier of the bot containing the bot recommendation.
     */
    botId?: Id;
    /**
     * The version of the bot containing the bot recommendation.
     */
    botVersion?: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to start. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId?: LocaleId;
    /**
     * The status of the bot recommendation. If the status is Failed, then the reasons for the failure are listed in the failureReasons field. 
     */
    botRecommendationStatus?: BotRecommendationStatus;
    /**
     * The identifier of the bot recommendation that you have created.
     */
    botRecommendationId?: Id;
    /**
     * A timestamp of the date and time that the bot recommendation was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The object representing the Amazon S3 bucket containing the transcript, as well as the associated metadata.
     */
    transcriptSourceSetting?: TranscriptSourceSetting;
    /**
     * The object representing the passwords that were used to encrypt the data related to the bot recommendation results, as well as the KMS key ARN used to encrypt the associated metadata.
     */
    encryptionSetting?: EncryptionSetting;
  }
  export interface StartImportRequest {
    /**
     * The unique identifier for the import. It is included in the response from the CreateUploadUrl operation.
     */
    importId: Id;
    /**
     * Parameters for creating the bot, bot locale or custom vocabulary.
     */
    resourceSpecification: ImportResourceSpecification;
    /**
     * The strategy to use when there is a name conflict between the imported resource and an existing resource. When the merge strategy is FailOnConflict existing resources are not overwritten and the import fails.
     */
    mergeStrategy: MergeStrategy;
    /**
     * The password used to encrypt the zip archive that contains the resource definition. You should always encrypt the zip archive to protect it during transit between your site and Amazon Lex.
     */
    filePassword?: ImportExportFilePassword;
  }
  export interface StartImportResponse {
    /**
     * A unique identifier for the import.
     */
    importId?: Id;
    /**
     * The parameters used when importing the resource.
     */
    resourceSpecification?: ImportResourceSpecification;
    /**
     * The strategy used when there was a name conflict between the imported resource and an existing resource. When the merge strategy is FailOnConflict existing resources are not overwritten and the import fails.
     */
    mergeStrategy?: MergeStrategy;
    /**
     * The current status of the import. When the status is Complete the bot, bot alias, or custom vocabulary is ready to use.
     */
    importStatus?: ImportStatus;
    /**
     * The date and time that the import request was created.
     */
    creationDateTime?: Timestamp;
  }
  export interface StartTestExecutionRequest {
    /**
     * The test set Id for the test set execution.
     */
    testSetId: Id;
    /**
     * The target bot for the test set execution.
     */
    target: TestExecutionTarget;
    /**
     * Indicates whether we use streaming or non-streaming APIs for the test set execution. For streaming, StartConversation Runtime API is used. Whereas, for non-streaming, RecognizeUtterance and RecognizeText Amazon Lex Runtime API are used.
     */
    apiMode: TestExecutionApiMode;
    /**
     * Indicates whether audio or text is used.
     */
    testExecutionModality?: TestExecutionModality;
  }
  export interface StartTestExecutionResponse {
    /**
     * The unique identifier of the test set execution.
     */
    testExecutionId?: Id;
    /**
     * The creation date and time for the test set execution.
     */
    creationDateTime?: Timestamp;
    /**
     * The test set Id for the test set execution.
     */
    testSetId?: Id;
    /**
     * The target bot for the test set execution.
     */
    target?: TestExecutionTarget;
    /**
     * Indicates whether we use streaming or non-streaming APIs for the test set execution. For streaming, StartConversation Amazon Lex Runtime API is used. Whereas for non-streaming, RecognizeUtterance and RecognizeText Amazon Lex Runtime API are used.
     */
    apiMode?: TestExecutionApiMode;
    /**
     * Indicates whether audio or text is used.
     */
    testExecutionModality?: TestExecutionModality;
  }
  export interface StartTestSetGenerationRequest {
    /**
     * The test set name for the test set generation request.
     */
    testSetName: Name;
    /**
     * The test set description for the test set generation request.
     */
    description?: Description;
    /**
     * The Amazon S3 storage location for the test set generation.
     */
    storageLocation: TestSetStorageLocation;
    /**
     * The data source for the test set generation.
     */
    generationDataSource: TestSetGenerationDataSource;
    /**
     * The roleARN used for any operation in the test set to access resources in the Amazon Web Services account.
     */
    roleArn: RoleArn;
    /**
     * A list of tags to add to the test set. You can only add tags when you import/generate a new test set. You can't use the UpdateTestSet operation to update tags. To update tags, use the TagResource operation.
     */
    testSetTags?: TagMap;
  }
  export interface StartTestSetGenerationResponse {
    /**
     * The unique identifier of the test set generation to describe.
     */
    testSetGenerationId?: Id;
    /**
     *  The creation date and time for the test set generation.
     */
    creationDateTime?: Timestamp;
    /**
     *  The status for the test set generation.
     */
    testSetGenerationStatus?: TestSetGenerationStatus;
    /**
     * The test set name used for the test set generation.
     */
    testSetName?: Name;
    /**
     * The description used for the test set generation.
     */
    description?: Description;
    /**
     * The Amazon S3 storage location for the test set generation.
     */
    storageLocation?: TestSetStorageLocation;
    /**
     *  The data source for the test set generation.
     */
    generationDataSource?: TestSetGenerationDataSource;
    /**
     * The roleARN used for any operation in the test set to access resources in the Amazon Web Services account.
     */
    roleArn?: RoleArn;
    /**
     * A list of tags that was used for the test set that is being generated.
     */
    testSetTags?: TagMap;
  }
  export type StillWaitingResponseFrequency = number;
  export interface StillWaitingResponseSpecification {
    /**
     * One or more message groups, each containing one or more messages, that define the prompts that Amazon Lex sends to the user.
     */
    messageGroups: MessageGroupsList;
    /**
     * How often a message should be sent to the user. Minimum of 1 second, maximum of 5 minutes.
     */
    frequencyInSeconds: StillWaitingResponseFrequency;
    /**
     * If Amazon Lex waits longer than this length of time for a response, it will stop sending messages.
     */
    timeoutInSeconds: StillWaitingResponseTimeout;
    /**
     * Indicates that the user can interrupt the response by speaking while the message is being played.
     */
    allowInterrupt?: BoxedBoolean;
  }
  export type StillWaitingResponseTimeout = number;
  export interface StopBotRecommendationRequest {
    /**
     * The unique identifier of the bot containing the bot recommendation to be stopped.
     */
    botId: Id;
    /**
     * The version of the bot containing the bot recommendation.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to stop. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId: LocaleId;
    /**
     * The unique identifier of the bot recommendation to be stopped.
     */
    botRecommendationId: Id;
  }
  export interface StopBotRecommendationResponse {
    /**
     * The unique identifier of the bot containing the bot recommendation that is being stopped.
     */
    botId?: Id;
    /**
     * The version of the bot containing the recommendation that is being stopped.
     */
    botVersion?: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot response to stop. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId?: LocaleId;
    /**
     * The status of the bot recommendation. If the status is Failed, then the reasons for the failure are listed in the failureReasons field.
     */
    botRecommendationStatus?: BotRecommendationStatus;
    /**
     * The unique identifier of the bot recommendation that is being stopped.
     */
    botRecommendationId?: Id;
  }
  export type String = string;
  export type StringMap = {[key: string]: String};
  export type SubSlotExpression = string;
  export interface SubSlotSetting {
    /**
     * The expression text for defining the constituent sub slots in the composite slot using logical AND and OR operators.
     */
    expression?: SubSlotExpression;
    /**
     * Specifications for the constituent sub slots of a composite slot.
     */
    slotSpecifications?: SubSlotSpecificationMap;
  }
  export type SubSlotSpecificationMap = {[key: string]: Specifications};
  export interface SubSlotTypeComposition {
    /**
     * Name of a constituent sub slot inside a composite slot.
     */
    name: Name;
    /**
     * The unique identifier assigned to a slot type. This refers to either a built-in slot type or the unique slotTypeId of a custom slot type.
     */
    slotTypeId: BuiltInOrCustomSlotTypeId;
  }
  export type SubSlotTypeList = SubSlotTypeComposition[];
  export interface SubSlotValueElicitationSetting {
    defaultValueSpecification?: SlotDefaultValueSpecification;
    promptSpecification: PromptSpecification;
    /**
     * If you know a specific pattern that users might respond to an Amazon Lex request for a sub slot value, you can provide those utterances to improve accuracy. This is optional. In most cases Amazon Lex is capable of understanding user utterances. This is similar to SampleUtterances for slots.
     */
    sampleUtterances?: SampleUtterancesList;
    waitAndContinueSpecification?: WaitAndContinueSpecification;
  }
  export type SynonymList = SampleValue[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot, bot alias, or bot channel to tag.
     */
    resourceARN: AmazonResourceName;
    /**
     * A list of tag keys to add to the resource. If a tag key already exists, the existing value is replaced with the new value.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TestExecutionApiMode = "Streaming"|"NonStreaming"|string;
  export type TestExecutionModality = "Text"|"Audio"|string;
  export interface TestExecutionResultFilterBy {
    /**
     * Specifies which results to filter. See Test result details"&gt;Test results details for details about different types of results.
     */
    resultTypeFilter: TestResultTypeFilter;
    /**
     * Contains information about the method for filtering Conversation level test results.
     */
    conversationLevelTestResultsFilterBy?: ConversationLevelTestResultsFilterBy;
  }
  export interface TestExecutionResultItems {
    /**
     * Overall results for the test execution, including the breakdown of conversations and single-input utterances.
     */
    overallTestResults?: OverallTestResults;
    /**
     * Results related to conversations in the test set, including metrics about success and failure of conversations and intent and slot failures.
     */
    conversationLevelTestResults?: ConversationLevelTestResults;
    /**
     * Intent recognition results aggregated by intent name. The aggregated results contain success and failure rates of intent recognition, speech transcriptions, and end-to-end conversations.
     */
    intentClassificationTestResults?: IntentClassificationTestResults;
    /**
     * Slot resolution results aggregated by intent and slot name. The aggregated results contain success and failure rates of slot resolution, speech transcriptions, and end-to-end conversations
     */
    intentLevelSlotResolutionTestResults?: IntentLevelSlotResolutionTestResults;
    /**
     * Results related to utterances in the test set.
     */
    utteranceLevelTestResults?: UtteranceLevelTestResults;
  }
  export type TestExecutionSortAttribute = "TestSetName"|"CreationDateTime"|string;
  export interface TestExecutionSortBy {
    /**
     * Specifies whether to sort the test set executions by the date and time at which the test sets were created.
     */
    attribute: TestExecutionSortAttribute;
    /**
     * Specifies whether to sort in ascending or descending order.
     */
    order: SortOrder;
  }
  export type TestExecutionStatus = "Pending"|"Waiting"|"InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export interface TestExecutionSummary {
    /**
     * The unique identifier of the test execution.
     */
    testExecutionId?: Id;
    /**
     * The date and time at which the test execution was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time at which the test execution was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The current status of the test execution.
     */
    testExecutionStatus?: TestExecutionStatus;
    /**
     * The unique identifier of the test set used in the test execution.
     */
    testSetId?: Id;
    /**
     * The name of the test set used in the test execution.
     */
    testSetName?: Name;
    /**
     * Contains information about the bot used for the test execution..
     */
    target?: TestExecutionTarget;
    /**
     * Specifies whether the API mode for the test execution is streaming or non-streaming.
     */
    apiMode?: TestExecutionApiMode;
    /**
     * Specifies whether the data used for the test execution is written or spoken.
     */
    testExecutionModality?: TestExecutionModality;
  }
  export type TestExecutionSummaryList = TestExecutionSummary[];
  export interface TestExecutionTarget {
    /**
     * Contains information about the bot alias used for the test execution.
     */
    botAliasTarget?: BotAliasTestExecutionTarget;
  }
  export type TestResultMatchStatus = "Matched"|"Mismatched"|"ExecutionError"|string;
  export type TestResultMatchStatusCountMap = {[key: string]: Count};
  export type TestResultSlotName = string;
  export type TestResultTypeFilter = "OverallTestResults"|"ConversationLevelTestResults"|"IntentClassificationTestResults"|"SlotResolutionTestResults"|"UtteranceLevelResults"|string;
  export type TestSetAgentPrompt = string;
  export type TestSetConversationId = string;
  export interface TestSetDiscrepancyErrors {
    /**
     * Contains information about discrepancies found for intents between the test set and the bot.
     */
    intentDiscrepancies: TestSetIntentDiscrepancyList;
    /**
     * Contains information about discrepancies found for slots between the test set and the bot.
     */
    slotDiscrepancies: TestSetSlotDiscrepancyList;
  }
  export interface TestSetDiscrepancyReportBotAliasTarget {
    /**
     * The unique identifier for the bot alias.
     */
    botId: Id;
    /**
     * The unique identifier for the bot associated with the bot alias.
     */
    botAliasId: BotAliasId;
    /**
     * The unique identifier of the locale associated with the bot alias.
     */
    localeId: LocaleId;
  }
  export interface TestSetDiscrepancyReportResourceTarget {
    /**
     * Contains information about the bot alias used as the resource for the test set discrepancy report.
     */
    botAliasTarget?: TestSetDiscrepancyReportBotAliasTarget;
  }
  export type TestSetDiscrepancyReportStatus = "InProgress"|"Completed"|"Failed"|string;
  export interface TestSetExportSpecification {
    /**
     * The unique identifier of the test set.
     */
    testSetId: Id;
  }
  export interface TestSetGenerationDataSource {
    /**
     * Contains information about the bot from which the conversation logs are sourced.
     */
    conversationLogsDataSource?: ConversationLogsDataSource;
  }
  export type TestSetGenerationStatus = "Generating"|"Ready"|"Failed"|"Pending"|string;
  export interface TestSetImportInputLocation {
    /**
     * The name of the Amazon S3 bucket.
     */
    s3BucketName: S3BucketName;
    /**
     * The path inside the Amazon S3 bucket pointing to the test-set CSV file.
     */
    s3Path: S3ObjectPath;
  }
  export interface TestSetImportResourceSpecification {
    /**
     * The name of the test set.
     */
    testSetName: Name;
    /**
     * The description of the test set.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permission to access the test set.
     */
    roleArn: RoleArn;
    /**
     * Contains information about the location that Amazon Lex uses to store the test-set.
     */
    storageLocation: TestSetStorageLocation;
    /**
     * Contains information about the input location from where test-set should be imported.
     */
    importInputLocation: TestSetImportInputLocation;
    /**
     * Specifies whether the test-set being imported contains written or spoken data.
     */
    modality: TestSetModality;
    /**
     * A list of tags to add to the test set. You can only add tags when you import/generate a new test set. You can't use the UpdateTestSet operation to update tags. To update tags, use the TagResource operation.
     */
    testSetTags?: TagMap;
  }
  export interface TestSetIntentDiscrepancyItem {
    /**
     * The name of the intent in the discrepancy report.
     */
    intentName: Name;
    /**
     * The error message for a discrepancy for an intent between the test set and the bot.
     */
    errorMessage: String;
  }
  export type TestSetIntentDiscrepancyList = TestSetIntentDiscrepancyItem[];
  export type TestSetModality = "Text"|"Audio"|string;
  export interface TestSetSlotDiscrepancyItem {
    /**
     * The name of the intent associated with the slot in the discrepancy report.
     */
    intentName: Name;
    /**
     * The name of the slot in the discrepancy report.
     */
    slotName: Name;
    /**
     * The error message for a discrepancy for an intent between the test set and the bot.
     */
    errorMessage: String;
  }
  export type TestSetSlotDiscrepancyList = TestSetSlotDiscrepancyItem[];
  export type TestSetSortAttribute = "TestSetName"|"LastUpdatedDateTime"|string;
  export interface TestSetSortBy {
    /**
     * Specifies whether to sort the test sets by name or by the time they were last updated.
     */
    attribute: TestSetSortAttribute;
    /**
     * Specifies whether to sort in ascending or descending order.
     */
    order: SortOrder;
  }
  export type TestSetStatus = "Importing"|"PendingAnnotation"|"Deleting"|"ValidationError"|"Ready"|string;
  export interface TestSetStorageLocation {
    /**
     * The name of the Amazon S3 bucket in which the test set is stored.
     */
    s3BucketName: S3BucketName;
    /**
     * The path inside the Amazon S3 bucket where the test set is stored.
     */
    s3Path: S3ObjectPath;
    /**
     * The Amazon Resource Name (ARN) of an Amazon Web Services Key Management Service (KMS) key for encrypting the test set.
     */
    kmsKeyArn?: KmsKeyArn;
  }
  export interface TestSetSummary {
    /**
     * The unique identifier of the test set.
     */
    testSetId?: Id;
    /**
     * The name of the test set.
     */
    testSetName?: Name;
    /**
     * The description of the test set.
     */
    description?: Description;
    /**
     * Specifies whether the test set contains written or spoken data.
     */
    modality?: TestSetModality;
    /**
     * The status of the test set.
     */
    status?: TestSetStatus;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permission to access the test set.
     */
    roleArn?: RoleArn;
    /**
     * The number of turns in the test set.
     */
    numTurns?: Count;
    /**
     * Contains information about the location at which the test set is stored.
     */
    storageLocation?: TestSetStorageLocation;
    /**
     * The date and time at which the test set was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time at which the test set was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export type TestSetSummaryList = TestSetSummary[];
  export interface TestSetTurnRecord {
    /**
     * The record number associated with the turn.
     */
    recordNumber: RecordNumber;
    /**
     * The unique identifier for the conversation associated with the turn.
     */
    conversationId?: TestSetConversationId;
    /**
     * The number of turns that has elapsed up to that turn.
     */
    turnNumber?: TurnNumber;
    /**
     * Contains information about the agent or user turn depending upon type of turn.
     */
    turnSpecification: TurnSpecification;
  }
  export type TestSetTurnRecordList = TestSetTurnRecord[];
  export interface TestSetTurnResult {
    /**
     * Contains information about the agent messages in the turn.
     */
    agent?: AgentTurnResult;
    /**
     * Contains information about the user messages in the turn.
     */
    user?: UserTurnResult;
  }
  export type TestSetUtteranceText = string;
  export interface TextInputSpecification {
    /**
     * Time for which a bot waits before re-prompting a customer for text input.
     */
    startTimeoutMs: TimeInMilliSeconds;
  }
  export interface TextLogDestination {
    /**
     * Defines the Amazon CloudWatch Logs log group where text and metadata logs are delivered.
     */
    cloudWatch: CloudWatchLogGroupLogDestination;
  }
  export interface TextLogSetting {
    /**
     * Determines whether conversation logs should be stored for an alias.
     */
    enabled: Boolean;
    destination: TextLogDestination;
  }
  export type TextLogSettingsList = TextLogSetting[];
  export type TimeDimension = "Hours"|"Days"|"Weeks"|string;
  export type TimeInMilliSeconds = number;
  export type TimeValue = number;
  export type Timestamp = Date;
  export type Transcript = string;
  export interface TranscriptFilter {
    /**
     * The object representing the filter that Amazon Lex will use to select the appropriate transcript when the transcript format is the Amazon Lex format.
     */
    lexTranscriptFilter?: LexTranscriptFilter;
  }
  export type TranscriptFormat = "Lex"|string;
  export interface TranscriptSourceSetting {
    /**
     * Indicates the setting of the Amazon S3 bucket where the transcript is stored.
     */
    s3BucketTranscriptSource?: S3BucketTranscriptSource;
  }
  export type TurnNumber = number;
  export interface TurnSpecification {
    /**
     * Contains information about the agent messages in the turn.
     */
    agentTurn?: AgentTurnSpecification;
    /**
     * Contains information about the user messages in the turn.
     */
    userTurn?: UserTurnSpecification;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to remove the tags from.
     */
    resourceARN: AmazonResourceName;
    /**
     * A list of tag keys to remove from the resource. If a tag key does not exist on the resource, it is ignored.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateBotAliasRequest {
    /**
     * The unique identifier of the bot alias.
     */
    botAliasId: BotAliasId;
    /**
     * The new name to assign to the bot alias.
     */
    botAliasName: Name;
    /**
     * The new description to assign to the bot alias.
     */
    description?: Description;
    /**
     * The new bot version to assign to the bot alias.
     */
    botVersion?: BotVersion;
    /**
     * The new Lambda functions to use in each locale for the bot alias.
     */
    botAliasLocaleSettings?: BotAliasLocaleSettingsMap;
    /**
     * The new settings for storing conversation logs in Amazon CloudWatch Logs and Amazon S3 buckets.
     */
    conversationLogSettings?: ConversationLogSettings;
    sentimentAnalysisSettings?: SentimentAnalysisSettings;
    /**
     * The identifier of the bot with the updated alias.
     */
    botId: Id;
  }
  export interface UpdateBotAliasResponse {
    /**
     * The identifier of the updated bot alias.
     */
    botAliasId?: BotAliasId;
    /**
     * The updated name of the bot alias.
     */
    botAliasName?: Name;
    /**
     * The updated description of the bot alias.
     */
    description?: Description;
    /**
     * The updated version of the bot that the alias points to.
     */
    botVersion?: BotVersion;
    /**
     * The updated Lambda functions to use in each locale for the bot alias.
     */
    botAliasLocaleSettings?: BotAliasLocaleSettingsMap;
    /**
     * The updated settings for storing conversation logs in Amazon CloudWatch Logs and Amazon S3 buckets.
     */
    conversationLogSettings?: ConversationLogSettings;
    sentimentAnalysisSettings?: SentimentAnalysisSettings;
    /**
     * The current status of the bot alias. When the status is Available the alias is ready for use.
     */
    botAliasStatus?: BotAliasStatus;
    /**
     * The identifier of the bot with the updated alias.
     */
    botId?: Id;
    /**
     * A timestamp of the date and time that the bot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface UpdateBotLocaleRequest {
    /**
     * The unique identifier of the bot that contains the locale.
     */
    botId: Id;
    /**
     * The version of the bot that contains the locale to be updated. The version can only be the DRAFT version.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale to update. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The new description of the locale.
     */
    description?: Description;
    /**
     * The new confidence threshold where Amazon Lex inserts the AMAZON.FallbackIntent and AMAZON.KendraSearchIntent intents in the list of possible intents for an utterance.
     */
    nluIntentConfidenceThreshold: ConfidenceThreshold;
    /**
     * The new Amazon Polly voice Amazon Lex should use for voice interaction with the user.
     */
    voiceSettings?: VoiceSettings;
  }
  export interface UpdateBotLocaleResponse {
    /**
     * The identifier of the bot that contains the updated locale.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the updated locale.
     */
    botVersion?: DraftBotVersion;
    /**
     * The language and locale of the updated bot locale.
     */
    localeId?: LocaleId;
    /**
     * The updated locale name for the locale.
     */
    localeName?: LocaleName;
    /**
     * The updated description of the locale.
     */
    description?: Description;
    /**
     * The updated confidence threshold for inserting the AMAZON.FallbackIntent and AMAZON.KendraSearchIntent intents in the list of possible intents for an utterance.
     */
    nluIntentConfidenceThreshold?: ConfidenceThreshold;
    /**
     * The updated Amazon Polly voice to use for voice interaction with the user.
     */
    voiceSettings?: VoiceSettings;
    /**
     * The current status of the locale. When the bot status is Built the locale is ready for use.
     */
    botLocaleStatus?: BotLocaleStatus;
    /**
     * If the botLocaleStatus is Failed, the failureReasons field lists the errors that occurred while building the bot.
     */
    failureReasons?: FailureReasons;
    /**
     * A timestamp of the date and time that the locale was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the locale was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * Recommended actions to take to resolve an error in the failureReasons field.
     */
    recommendedActions?: RecommendedActions;
  }
  export interface UpdateBotRecommendationRequest {
    /**
     * The unique identifier of the bot containing the bot recommendation to be updated.
     */
    botId: Id;
    /**
     * The version of the bot containing the bot recommendation to be updated.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to update. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId: LocaleId;
    /**
     * The unique identifier of the bot recommendation to be updated.
     */
    botRecommendationId: Id;
    /**
     * The object representing the passwords that will be used to encrypt the data related to the bot recommendation results, as well as the KMS key ARN used to encrypt the associated metadata.
     */
    encryptionSetting: EncryptionSetting;
  }
  export interface UpdateBotRecommendationResponse {
    /**
     * The unique identifier of the bot containing the bot recommendation that has been updated.
     */
    botId?: Id;
    /**
     * The version of the bot containing the bot recommendation that has been updated.
     */
    botVersion?: DraftBotVersion;
    /**
     * The identifier of the language and locale of the bot recommendation to update. The string must match one of the supported locales. For more information, see Supported languages 
     */
    localeId?: LocaleId;
    /**
     * The status of the bot recommendation. If the status is Failed, then the reasons for the failure are listed in the failureReasons field. 
     */
    botRecommendationStatus?: BotRecommendationStatus;
    /**
     * The unique identifier of the bot recommendation to be updated.
     */
    botRecommendationId?: Id;
    /**
     * A timestamp of the date and time that the bot recommendation was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot recommendation was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The object representing the Amazon S3 bucket containing the transcript, as well as the associated metadata.
     */
    transcriptSourceSetting?: TranscriptSourceSetting;
    /**
     * The object representing the passwords that were used to encrypt the data related to the bot recommendation results, as well as the KMS key ARN used to encrypt the associated metadata.
     */
    encryptionSetting?: EncryptionSetting;
  }
  export interface UpdateBotRequest {
    /**
     * The unique identifier of the bot to update. This identifier is returned by the CreateBot operation.
     */
    botId: Id;
    /**
     * The new name of the bot. The name must be unique in the account that creates the bot.
     */
    botName: Name;
    /**
     * A description of the bot.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that has permissions to access the bot.
     */
    roleArn: RoleArn;
    /**
     * Provides information on additional privacy protections Amazon Lex should use with the bot's data.
     */
    dataPrivacy: DataPrivacy;
    /**
     * The time, in seconds, that Amazon Lex should keep information about a user's conversation with the bot. A user interaction remains active for the amount of time specified. If no conversation occurs during this time, the session expires and Amazon Lex deletes any data provided before the timeout. You can specify between 60 (1 minute) and 86,400 (24 hours) seconds.
     */
    idleSessionTTLInSeconds: SessionTTL;
    /**
     * The type of the bot to be updated.
     */
    botType?: BotType;
    /**
     * The list of bot members in the network associated with the update action.
     */
    botMembers?: BotMembers;
  }
  export interface UpdateBotResponse {
    /**
     * The unique identifier of the bot that was updated.
     */
    botId?: Id;
    /**
     * The name of the bot after the update.
     */
    botName?: Name;
    /**
     * The description of the bot after the update.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used by the bot after the update.
     */
    roleArn?: RoleArn;
    /**
     * The data privacy settings for the bot after the update.
     */
    dataPrivacy?: DataPrivacy;
    /**
     * The session timeout, in seconds, for the bot after the update.
     */
    idleSessionTTLInSeconds?: SessionTTL;
    /**
     * Shows the current status of the bot. The bot is first in the Creating status. Once the bot is read for use, it changes to the Available status. After the bot is created, you can use the DRAFT version of the bot.
     */
    botStatus?: BotStatus;
    /**
     * A timestamp of the date and time that the bot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the bot was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * The type of the bot that was updated.
     */
    botType?: BotType;
    /**
     * The list of bot members in the network that was updated.
     */
    botMembers?: BotMembers;
  }
  export type UpdateCustomVocabularyItemsList = CustomVocabularyItem[];
  export interface UpdateExportRequest {
    /**
     * The unique identifier Amazon Lex assigned to the export.
     */
    exportId: Id;
    /**
     * The new password to use to encrypt the export zip archive.
     */
    filePassword?: ImportExportFilePassword;
  }
  export interface UpdateExportResponse {
    /**
     * The unique identifier Amazon Lex assigned to the export.
     */
    exportId?: Id;
    /**
     * A description of the type of resource that was exported, either a bot or a bot locale.
     */
    resourceSpecification?: ExportResourceSpecification;
    /**
     * The file format used for the files that define the resource. The TSV format is required to export a custom vocabulary only; otherwise use LexJson format.
     */
    fileFormat?: ImportExportFileFormat;
    /**
     * The status of the export. When the status is Completed the export archive is available for download.
     */
    exportStatus?: ExportStatus;
    /**
     * The date and time that the export was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The date and time that the export was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface UpdateIntentRequest {
    /**
     * The unique identifier of the intent to update.
     */
    intentId: Id;
    /**
     * The new name for the intent.
     */
    intentName: Name;
    /**
     * The new description of the intent.
     */
    description?: Description;
    /**
     * The signature of the new built-in intent to use as the parent of this intent.
     */
    parentIntentSignature?: IntentSignature;
    /**
     * New utterances used to invoke the intent.
     */
    sampleUtterances?: SampleUtterancesList;
    /**
     * The new Lambda function to use between each turn of the conversation with the bot.
     */
    dialogCodeHook?: DialogCodeHookSettings;
    /**
     * The new Lambda function to call when all of the intents required slots are provided and the intent is ready for fulfillment.
     */
    fulfillmentCodeHook?: FulfillmentCodeHookSettings;
    /**
     * A new list of slots and their priorities that are contained by the intent.
     */
    slotPriorities?: SlotPrioritiesList;
    /**
     * New prompts that Amazon Lex sends to the user to confirm the completion of an intent.
     */
    intentConfirmationSetting?: IntentConfirmationSetting;
    /**
     * The new response that Amazon Lex sends the user when the intent is closed.
     */
    intentClosingSetting?: IntentClosingSetting;
    /**
     * A new list of contexts that must be active in order for Amazon Lex to consider the intent.
     */
    inputContexts?: InputContextsList;
    /**
     * A new list of contexts that Amazon Lex activates when the intent is fulfilled.
     */
    outputContexts?: OutputContextsList;
    /**
     * New configuration settings for connecting to an Amazon Kendra index.
     */
    kendraConfiguration?: KendraConfiguration;
    /**
     * The identifier of the bot that contains the intent.
     */
    botId: Id;
    /**
     * The version of the bot that contains the intent. Must be DRAFT.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale where this intent is used. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * Configuration settings for a response sent to the user before Amazon Lex starts eliciting slots.
     */
    initialResponseSetting?: InitialResponseSetting;
  }
  export interface UpdateIntentResponse {
    /**
     * The identifier of the intent that was updated.
     */
    intentId?: Id;
    /**
     * The updated name of the intent.
     */
    intentName?: Name;
    /**
     * The updated description of the intent.
     */
    description?: Description;
    /**
     * The updated built-in intent that is the parent of this intent.
     */
    parentIntentSignature?: IntentSignature;
    /**
     * The updated list of sample utterances for the intent.
     */
    sampleUtterances?: SampleUtterancesList;
    /**
     * The updated Lambda function called during each turn of the conversation with the user.
     */
    dialogCodeHook?: DialogCodeHookSettings;
    /**
     * The updated Lambda function called when the intent is ready for fulfillment.
     */
    fulfillmentCodeHook?: FulfillmentCodeHookSettings;
    /**
     * The updated list of slots and their priorities that are elicited from the user for the intent.
     */
    slotPriorities?: SlotPrioritiesList;
    /**
     * The updated prompts that Amazon Lex sends to the user to confirm the completion of an intent.
     */
    intentConfirmationSetting?: IntentConfirmationSetting;
    /**
     * The updated response that Amazon Lex sends the user when the intent is closed.
     */
    intentClosingSetting?: IntentClosingSetting;
    /**
     * The updated list of contexts that must be active for the intent to be considered by Amazon Lex.
     */
    inputContexts?: InputContextsList;
    /**
     * The updated list of contexts that Amazon Lex activates when the intent is fulfilled.
     */
    outputContexts?: OutputContextsList;
    /**
     * The updated configuration for connecting to an Amazon Kendra index with the AMAZON.KendraSearchIntent intent.
     */
    kendraConfiguration?: KendraConfiguration;
    /**
     * The identifier of the bot that contains the intent.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the intent. Will always be DRAFT.
     */
    botVersion?: DraftBotVersion;
    /**
     * The updated language and locale of the intent.
     */
    localeId?: LocaleId;
    /**
     * A timestamp of when the intent was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the last time that the intent was modified.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * Configuration settings for a response sent to the user before Amazon Lex starts eliciting slots.
     */
    initialResponseSetting?: InitialResponseSetting;
  }
  export interface UpdateResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn: AmazonResourceName;
    /**
     * A resource policy to add to the resource. The policy is a JSON structure that contains one or more statements that define the policy. The policy must follow the IAM syntax. For more information about the contents of a JSON policy document, see  IAM JSON policy reference .  If the policy isn't valid, Amazon Lex returns a validation exception.
     */
    policy: Policy;
    /**
     * The identifier of the revision of the policy to update. If this revision ID doesn't match the current revision ID, Amazon Lex throws an exception. If you don't specify a revision, Amazon Lex overwrites the contents of the policy with the new values.
     */
    expectedRevisionId?: RevisionId;
  }
  export interface UpdateResourcePolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the bot or bot alias that the resource policy is attached to.
     */
    resourceArn?: AmazonResourceName;
    /**
     * The current revision of the resource policy. Use the revision ID to make sure that you are updating the most current version of a resource policy when you add a policy statement to a resource, delete a resource, or update a resource.
     */
    revisionId?: RevisionId;
  }
  export interface UpdateSlotRequest {
    /**
     * The unique identifier for the slot to update.
     */
    slotId: Id;
    /**
     * The new name for the slot.
     */
    slotName: Name;
    /**
     * The new description for the slot.
     */
    description?: Description;
    /**
     * The unique identifier of the new slot type to associate with this slot. 
     */
    slotTypeId?: BuiltInOrCustomSlotTypeId;
    /**
     * A new set of prompts that Amazon Lex sends to the user to elicit a response the provides a value for the slot.
     */
    valueElicitationSetting: SlotValueElicitationSetting;
    /**
     * New settings that determine how slot values are formatted in Amazon CloudWatch logs. 
     */
    obfuscationSetting?: ObfuscationSetting;
    /**
     * The unique identifier of the bot that contains the slot.
     */
    botId: Id;
    /**
     * The version of the bot that contains the slot. Must always be DRAFT.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that contains the slot. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    /**
     * The identifier of the intent that contains the slot.
     */
    intentId: Id;
    /**
     * Determines whether the slot accepts multiple values in one response. Multiple value slots are only available in the en-US locale. If you set this value to true in any other locale, Amazon Lex throws a ValidationException. If the multipleValuesSetting is not set, the default value is false.
     */
    multipleValuesSetting?: MultipleValuesSetting;
    /**
     * Specifications for the constituent sub slots and the expression for the composite slot.
     */
    subSlotSetting?: SubSlotSetting;
  }
  export interface UpdateSlotResponse {
    /**
     * The unique identifier of the slot that was updated.
     */
    slotId?: Id;
    /**
     * The updated name of the slot.
     */
    slotName?: Name;
    /**
     * The updated description of the bot.
     */
    description?: Description;
    /**
     * The updated identifier of the slot type that provides values for the slot.
     */
    slotTypeId?: BuiltInOrCustomSlotTypeId;
    /**
     * The updated prompts that Amazon Lex sends to the user to elicit a response that provides a value for the slot.
     */
    valueElicitationSetting?: SlotValueElicitationSetting;
    /**
     * The updated setting that determines whether the slot value is obfuscated in the Amazon CloudWatch logs.
     */
    obfuscationSetting?: ObfuscationSetting;
    /**
     * The identifier of the bot that contains the slot.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the slot. Will always be DRAFT.
     */
    botVersion?: DraftBotVersion;
    /**
     * The locale that contains the slot.
     */
    localeId?: LocaleId;
    /**
     * The intent that contains the slot.
     */
    intentId?: Id;
    /**
     * The timestamp of the date and time that the slot was created.
     */
    creationDateTime?: Timestamp;
    /**
     * The timestamp of the date and time that the slot was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    /**
     * Indicates whether the slot accepts multiple values in one response.
     */
    multipleValuesSetting?: MultipleValuesSetting;
    /**
     * Specifications for the constituent sub slots and the expression for the composite slot.
     */
    subSlotSetting?: SubSlotSetting;
  }
  export interface UpdateSlotTypeRequest {
    /**
     * The unique identifier of the slot type to update.
     */
    slotTypeId: Id;
    /**
     * The new name of the slot type.
     */
    slotTypeName: Name;
    /**
     * The new description of the slot type.
     */
    description?: Description;
    /**
     * A new list of values and their optional synonyms that define the values that the slot type can take.
     */
    slotTypeValues?: SlotTypeValues;
    /**
     * The strategy that Amazon Lex should use when deciding on a value from the list of slot type values.
     */
    valueSelectionSetting?: SlotValueSelectionSetting;
    /**
     * The new built-in slot type that should be used as the parent of this slot type.
     */
    parentSlotTypeSignature?: SlotTypeSignature;
    /**
     * The identifier of the bot that contains the slot type.
     */
    botId: Id;
    /**
     * The version of the bot that contains the slot type. Must be DRAFT.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale that contains the slot type. The string must match one of the supported locales. For more information, see Supported languages.
     */
    localeId: LocaleId;
    externalSourceSetting?: ExternalSourceSetting;
    /**
     * Specifications for a composite slot type.
     */
    compositeSlotTypeSetting?: CompositeSlotTypeSetting;
  }
  export interface UpdateSlotTypeResponse {
    /**
     * The unique identifier of the updated slot type.
     */
    slotTypeId?: Id;
    /**
     * The updated name of the slot type.
     */
    slotTypeName?: Name;
    /**
     * The updated description of the slot type.
     */
    description?: Description;
    /**
     * The updated values that the slot type provides.
     */
    slotTypeValues?: SlotTypeValues;
    /**
     * The updated strategy that Amazon Lex uses to determine which value to select from the slot type.
     */
    valueSelectionSetting?: SlotValueSelectionSetting;
    /**
     * The updated signature of the built-in slot type that is the parent of this slot type.
     */
    parentSlotTypeSignature?: SlotTypeSignature;
    /**
     * The identifier of the bot that contains the slot type.
     */
    botId?: Id;
    /**
     * The version of the bot that contains the slot type. This is always DRAFT.
     */
    botVersion?: DraftBotVersion;
    /**
     * The language and locale of the updated slot type.
     */
    localeId?: LocaleId;
    /**
     * The timestamp of the date and time that the slot type was created.
     */
    creationDateTime?: Timestamp;
    /**
     * A timestamp of the date and time that the slot type was last updated.
     */
    lastUpdatedDateTime?: Timestamp;
    externalSourceSetting?: ExternalSourceSetting;
    /**
     * Specifications for a composite slot type.
     */
    compositeSlotTypeSetting?: CompositeSlotTypeSetting;
  }
  export interface UpdateTestSetRequest {
    /**
     * The test set Id for which update test operation to be performed.
     */
    testSetId: Id;
    /**
     * The new test set name.
     */
    testSetName: Name;
    /**
     * The new test set description.
     */
    description?: Description;
  }
  export interface UpdateTestSetResponse {
    /**
     * The test set Id for which update test operation to be performed.
     */
    testSetId?: Id;
    /**
     * The test set name for the updated test set.
     */
    testSetName?: Name;
    /**
     * The test set description for the updated test set.
     */
    description?: Description;
    /**
     * Indicates whether audio or text is used for the updated test set.
     */
    modality?: TestSetModality;
    /**
     * The status for the updated test set.
     */
    status?: TestSetStatus;
    /**
     * The roleARN used for any operation in the test set to access resources in the Amazon Web Services account.
     */
    roleArn?: RoleArn;
    /**
     * The number of conversation turns from the updated test set.
     */
    numTurns?: Count;
    /**
     * The Amazon S3 storage location for the updated test set.
     */
    storageLocation?: TestSetStorageLocation;
    /**
     * The creation date and time for the updated test set.
     */
    creationDateTime?: Timestamp;
    /**
     *  The date and time of the last update for the updated test set.
     */
    lastUpdatedDateTime?: Timestamp;
  }
  export interface UserTurnInputSpecification {
    /**
     * The utterance input in the user turn.
     */
    utteranceInput: UtteranceInputSpecification;
    /**
     * Request attributes of the user turn.
     */
    requestAttributes?: StringMap;
    /**
     * Contains information about the session state in the input.
     */
    sessionState?: InputSessionStateSpecification;
  }
  export interface UserTurnIntentOutput {
    /**
     * The name of the intent.
     */
    name: Name;
    /**
     * The slots associated with the intent.
     */
    slots?: UserTurnSlotOutputMap;
  }
  export interface UserTurnOutputSpecification {
    /**
     * Contains information about the intent.
     */
    intent: UserTurnIntentOutput;
    /**
     * The contexts that are active in the turn.
     */
    activeContexts?: ActiveContextList;
    /**
     * The transcript that is output for the user turn by the test execution.
     */
    transcript?: TestSetUtteranceText;
  }
  export interface UserTurnResult {
    /**
     * Contains information about the user messages in the turn in the input.
     */
    input: UserTurnInputSpecification;
    /**
     * Contains information about the expected output for the user turn.
     */
    expectedOutput: UserTurnOutputSpecification;
    /**
     * Contains information about the actual output for the user turn.
     */
    actualOutput?: UserTurnOutputSpecification;
    errorDetails?: ExecutionErrorDetails;
    /**
     * Specifies whether the expected and actual outputs match or not, or if there is an error in execution.
     */
    endToEndResult?: TestResultMatchStatus;
    /**
     * Specifies whether the expected and actual intents match or not.
     */
    intentMatchResult?: TestResultMatchStatus;
    /**
     * Specifies whether the expected and actual slots match or not.
     */
    slotMatchResult?: TestResultMatchStatus;
    /**
     * Specifies whether the expected and actual speech transcriptions match or not, or if there is an error in execution.
     */
    speechTranscriptionResult?: TestResultMatchStatus;
    /**
     * Contains information about the results related to the conversation associated with the user turn.
     */
    conversationLevelResult?: ConversationLevelResultDetail;
  }
  export interface UserTurnSlotOutput {
    /**
     * The value output by the slot recognition.
     */
    value?: NonEmptyString;
    /**
     * Values that are output by the slot recognition.
     */
    values?: UserTurnSlotOutputList;
    /**
     * A list of items mapping the name of the subslots to information about those subslots.
     */
    subSlots?: UserTurnSlotOutputMap;
  }
  export type UserTurnSlotOutputList = UserTurnSlotOutput[];
  export type UserTurnSlotOutputMap = {[key: string]: UserTurnSlotOutput};
  export interface UserTurnSpecification {
    /**
     * Contains information about the user messages in the turn in the input.
     */
    input: UserTurnInputSpecification;
    /**
     * Contains results about the expected output for the user turn.
     */
    expected: UserTurnOutputSpecification;
  }
  export type Utterance = string;
  export interface UtteranceAggregationDuration {
    /**
     * The desired time window for aggregating utterances. 
     */
    relativeAggregationDuration: RelativeAggregationDuration;
  }
  export interface UtteranceAudioInputSpecification {
    /**
     * Amazon S3 file pointing to the audio.
     */
    audioFileS3Location: AudioFileS3Location;
  }
  export interface UtteranceBotResponse {
    /**
     * The text of the response to the utterance from the bot.
     */
    content?: String;
    /**
     * The type of the response. The following values are possible:    PlainText – A plain text string.    CustomPayload – A response string that you can customize to include data or metadata for your application.    SSML – A string that includes Speech Synthesis Markup Language to customize the audio response.    ImageResponseCard – An image with buttons that the customer can select. See ImageResponseCard for more information.  
     */
    contentType?: UtteranceContentType;
    imageResponseCard?: ImageResponseCard;
  }
  export type UtteranceBotResponses = UtteranceBotResponse[];
  export type UtteranceContentType = "PlainText"|"CustomPayload"|"SSML"|"ImageResponseCard"|string;
  export interface UtteranceDataSortBy {
    /**
     * The measure by which to sort the utterance analytics data.    Count – The number of utterances.    UtteranceTimestamp – The date and time of the utterance.  
     */
    name: AnalyticsUtteranceSortByName;
    /**
     * Specifies whether to sort the results in ascending or descending order.
     */
    order: AnalyticsSortOrder;
  }
  export interface UtteranceInputSpecification {
    /**
     * A text input transcription of the utterance. It is only applicable for test-sets containing text data.
     */
    textInput?: TestSetUtteranceText;
    /**
     * Contains information about the audio input for an utterance.
     */
    audioInput?: UtteranceAudioInputSpecification;
  }
  export interface UtteranceLevelTestResultItem {
    /**
     * The record number of the result.
     */
    recordNumber: RecordNumber;
    /**
     * The unique identifier for the conversation associated with the result.
     */
    conversationId?: TestSetConversationId;
    /**
     * Contains information about the turn associated with the result.
     */
    turnResult: TestSetTurnResult;
  }
  export type UtteranceLevelTestResultItemList = UtteranceLevelTestResultItem[];
  export interface UtteranceLevelTestResults {
    /**
     * Contains information about an utterance in the results of the test set execution.
     */
    items: UtteranceLevelTestResultItemList;
  }
  export interface UtteranceSpecification {
    /**
     * The identifier of the alias of the bot that the utterance was made to.
     */
    botAliasId?: BotAliasId;
    /**
     * The version of the bot that the utterance was made to.
     */
    botVersion?: NumericalBotVersion;
    /**
     * The locale of the bot that the utterance was made to.
     */
    localeId?: LocaleId;
    /**
     * The identifier of the session that the utterance was made in.
     */
    sessionId?: AnalyticsSessionId;
    /**
     * The channel that is integrated with the bot that the utterance was made to.
     */
    channel?: AnalyticsChannel;
    /**
     * The mode of the session. The possible values are as follows:    Speech – The session consisted of spoken dialogue.    Text – The session consisted of written dialogue.    DTMF – The session consisted of touch-tone keypad (Dual Tone Multi-Frequency) key presses.    MultiMode – The session consisted of multiple modes.  
     */
    mode?: AnalyticsModality;
    /**
     * The date and time when the conversation in which the utterance took place began. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.
     */
    conversationStartTime?: Timestamp;
    /**
     * The date and time when the conversation in which the utterance took place ended. A conversation is defined as a unique combination of a sessionId and an originatingRequestId.
     */
    conversationEndTime?: Timestamp;
    /**
     * The text of the utterance.
     */
    utterance?: String;
    /**
     * The date and time when the utterance took place.
     */
    utteranceTimestamp?: Timestamp;
    /**
     * The duration in milliseconds of the audio associated with the utterance.
     */
    audioVoiceDurationMillis?: AnalyticsLongValue;
    /**
     * Specifies whether the bot understood the utterance or not.
     */
    utteranceUnderstood?: UtteranceUnderstood;
    /**
     * The input type of the utterance. The possible values are as follows:   PCM format: audio data must be in little-endian byte order.    audio/l16; rate=16000; channels=1     audio/x-l16; sample-rate=16000; channel-count=1     audio/lpcm; sample-rate=8000; sample-size-bits=16; channel-count=1; is-big-endian=false      Opus format    audio/x-cbr-opus-with-preamble;preamble-size=0;bit-rate=256000;frame-size-milliseconds=4      Text format    text/plain; charset=utf-8     
     */
    inputType?: String;
    /**
     * The output type of the utterance. The possible values are as follows:    audio/mpeg     audio/ogg     audio/pcm (16 KHz)     audio/ (defaults to mpeg)    text/plain; charset=utf-8   
     */
    outputType?: String;
    /**
     * The name of the intent that the utterance is associated to.
     */
    associatedIntentName?: Name;
    /**
     * The name of the slot that the utterance is associated to.
     */
    associatedSlotName?: Name;
    /**
     * The state of the intent that the utterance is associated to.
     */
    intentState?: IntentState;
    /**
     * The type of dialog action that the utterance is associated to. See the type field in DialogAction for more information.
     */
    dialogActionType?: String;
    /**
     * The identifier for the audio of the bot response.
     */
    botResponseAudioVoiceId?: String;
    /**
     * The slots that have been filled in the session by the time of the utterance.
     */
    slotsFilledInSession?: String;
    /**
     * The identifier of the request associated with the utterance.
     */
    utteranceRequestId?: Id;
    /**
     * A list of objects containing information about the bot response to the utterance.
     */
    botResponses?: UtteranceBotResponses;
  }
  export type UtteranceSpecifications = UtteranceSpecification[];
  export type UtteranceUnderstood = boolean;
  export type Value = string;
  export type VoiceEngine = "standard"|"neural"|string;
  export type VoiceId = string;
  export interface VoiceSettings {
    /**
     * The identifier of the Amazon Polly voice to use.
     */
    voiceId: VoiceId;
    /**
     * Indicates the type of Amazon Polly voice that Amazon Lex should use for voice interaction with the user. For more information, see the  engine parameter of the SynthesizeSpeech operation in the Amazon Polly developer guide. If you do not specify a value, the default is standard.
     */
    engine?: VoiceEngine;
  }
  export interface WaitAndContinueSpecification {
    /**
     * The response that Amazon Lex sends to indicate that the bot is waiting for the conversation to continue.
     */
    waitingResponse: ResponseSpecification;
    /**
     * The response that Amazon Lex sends to indicate that the bot is ready to continue the conversation.
     */
    continueResponse: ResponseSpecification;
    /**
     * A response that Amazon Lex sends periodically to the user to indicate that the bot is still waiting for input from the user.
     */
    stillWaitingResponse?: StillWaitingResponseSpecification;
    /**
     * Specifies whether the bot will wait for a user to respond. When this field is false, wait and continue responses for a slot aren't used. If the active field isn't specified, the default is true.
     */
    active?: BoxedBoolean;
  }
  export type Weight = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LexModelsV2 client.
   */
  export import Types = LexModelsV2;
}
export = LexModelsV2;
