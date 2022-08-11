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
   * Deletes a specific version of a bot. To delete all version of a bot, use the DeleteBot operation.
   */
  deleteBotVersion(params: LexModelsV2.Types.DeleteBotVersionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotVersionResponse) => void): Request<LexModelsV2.Types.DeleteBotVersionResponse, AWSError>;
  /**
   * Deletes a specific version of a bot. To delete all version of a bot, use the DeleteBot operation.
   */
  deleteBotVersion(callback?: (err: AWSError, data: LexModelsV2.Types.DeleteBotVersionResponse) => void): Request<LexModelsV2.Types.DeleteBotVersionResponse, AWSError>;
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
   * Deletes stored utterances. Amazon Lex stores the utterances that users send to your bot. Utterances are stored for 15 days for use with the operation, and then stored indefinitely for use in improving the ability of your bot to respond to user input.. Use the DeleteUtterances operation to manually delete utterances for a specific session. When you use the DeleteUtterances operation, utterances stored for improving your bot's ability to respond to user input are deleted immediately. Utterances stored for use with the ListAggregatedUtterances operation are deleted after 15 days.
   */
  deleteUtterances(params: LexModelsV2.Types.DeleteUtterancesRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DeleteUtterancesResponse) => void): Request<LexModelsV2.Types.DeleteUtterancesResponse, AWSError>;
  /**
   * Deletes stored utterances. Amazon Lex stores the utterances that users send to your bot. Utterances are stored for 15 days for use with the operation, and then stored indefinitely for use in improving the ability of your bot to respond to user input.. Use the DeleteUtterances operation to manually delete utterances for a specific session. When you use the DeleteUtterances operation, utterances stored for improving your bot's ability to respond to user input are deleted immediately. Utterances stored for use with the ListAggregatedUtterances operation are deleted after 15 days.
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
   * Provides metadata about a version of a bot.
   */
  describeBotVersion(params: LexModelsV2.Types.DescribeBotVersionRequest, callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotVersionResponse) => void): Request<LexModelsV2.Types.DescribeBotVersionResponse, AWSError>;
  /**
   * Provides metadata about a version of a bot.
   */
  describeBotVersion(callback?: (err: AWSError, data: LexModelsV2.Types.DescribeBotVersionResponse) => void): Request<LexModelsV2.Types.DescribeBotVersionResponse, AWSError>;
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
   * Lists the exports for a bot or bot locale. Exports are kept in the list for 7 days.
   */
  listExports(params: LexModelsV2.Types.ListExportsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListExportsResponse) => void): Request<LexModelsV2.Types.ListExportsResponse, AWSError>;
  /**
   * Lists the exports for a bot or bot locale. Exports are kept in the list for 7 days.
   */
  listExports(callback?: (err: AWSError, data: LexModelsV2.Types.ListExportsResponse) => void): Request<LexModelsV2.Types.ListExportsResponse, AWSError>;
  /**
   * Lists the imports for a bot or bot locale. Imports are kept in the list for 7 days.
   */
  listImports(params: LexModelsV2.Types.ListImportsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListImportsResponse) => void): Request<LexModelsV2.Types.ListImportsResponse, AWSError>;
  /**
   * Lists the imports for a bot or bot locale. Imports are kept in the list for 7 days.
   */
  listImports(callback?: (err: AWSError, data: LexModelsV2.Types.ListImportsResponse) => void): Request<LexModelsV2.Types.ListImportsResponse, AWSError>;
  /**
   * Get a list of intents that meet the specified criteria.
   */
  listIntents(params: LexModelsV2.Types.ListIntentsRequest, callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentsResponse) => void): Request<LexModelsV2.Types.ListIntentsResponse, AWSError>;
  /**
   * Get a list of intents that meet the specified criteria.
   */
  listIntents(callback?: (err: AWSError, data: LexModelsV2.Types.ListIntentsResponse) => void): Request<LexModelsV2.Types.ListIntentsResponse, AWSError>;
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
   * Starts importing a bot or bot locale from a zip archive that you uploaded to an S3 bucket.
   */
  startImport(params: LexModelsV2.Types.StartImportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.StartImportResponse) => void): Request<LexModelsV2.Types.StartImportResponse, AWSError>;
  /**
   * Starts importing a bot or bot locale from a zip archive that you uploaded to an S3 bucket.
   */
  startImport(callback?: (err: AWSError, data: LexModelsV2.Types.StartImportResponse) => void): Request<LexModelsV2.Types.StartImportResponse, AWSError>;
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
   * Updates the password used to protect an export zip archive. The password is not required. If you don't supply a password, Amazon Lex generates a zip file that is not protected by a password. This is the archive that is available at the pre-signed S3 URL provided by the operation.
   */
  updateExport(params: LexModelsV2.Types.UpdateExportRequest, callback?: (err: AWSError, data: LexModelsV2.Types.UpdateExportResponse) => void): Request<LexModelsV2.Types.UpdateExportResponse, AWSError>;
  /**
   * Updates the password used to protect an export zip archive. The password is not required. If you don't supply a password, Amazon Lex generates a zip file that is not protected by a password. This is the archive that is available at the pre-signed S3 URL provided by the operation.
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
}
declare namespace LexModelsV2 {
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
  export type AmazonResourceName = string;
  export type AttachmentTitle = string;
  export type AttachmentUrl = string;
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
  export type BotFilterName = "BotName"|string;
  export type BotFilterOperator = "CO"|"EQ"|string;
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
  export type BotLocaleStatus = "Creating"|"Building"|"Built"|"ReadyExpressTesting"|"Failed"|"Deleting"|"NotBuilt"|"Importing"|string;
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
  export type BotStatus = "Creating"|"Available"|"Inactive"|"Deleting"|"Failed"|"Versioning"|"Importing"|string;
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
  }
  export type BotSummaryList = BotSummary[];
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
     * The identifier of the bot to build. The identifier is returned in the response from the operation.
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
  export type ConditionKey = string;
  export type ConditionKeyValueMap = {[key: string]: ConditionValue};
  export type ConditionMap = {[key: string]: ConditionKeyValueMap};
  export type ConditionOperator = string;
  export type ConditionValue = string;
  export type ConfidenceThreshold = number;
  export type ContextTimeToLiveInSeconds = number;
  export type ContextTurnsToLive = number;
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
     * The version of the bot that this alias points to. You can use the operation to change the bot version associated with the alias.
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
     * Shows the current status of the bot. The bot is first in the Creating status. Once the bot is read for use, it changes to the Available status. After the bot is created, you can use the Draft version of the bot.
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
     * The status of the export. When the status is Completed, you can use the operation to get the pre-signed S3 URL link to your exported bot or bot locale.
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
     * The identifier of the version of the bot associated with this intent.
     */
    botVersion: DraftBotVersion;
    /**
     * The identifier of the language and locale where this intent is used. All of the bots, slot types, and slots used by the intent must have the same locale. For more information, see Supported languages.
     */
    localeId: LocaleId;
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
     * The identifier of the version of the bot associated with the intent.
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
     * An IAM principal, such as an IAM users, IAM roles, or AWS services that is allowed or denied access to a resource. For more information, see AWS JSON policy elements: Principal.
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
    slotTypeId: BuiltInOrCustomSlotTypeId;
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
  }
  export interface CreateSlotTypeRequest {
    /**
     * The name for the slot. A slot type name must be unique within the account.
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
     * Determines the strategy that Amazon Lex uses to select a value from the list of possible values. The field can be set to one of the following values:    OriginalValue - Returns the value entered by the user, if the user value is similar to the slot value.    TopResolution - If there is a resolution list for the slot, return the first value in the resolution list. If there is no resolution list, return null.   If you don't specify the valueSelectionSetting parameter, the default is OriginalValue.
     */
    valueSelectionSetting: SlotValueSelectionSetting;
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
  }
  export interface CreateUploadUrlRequest {
  }
  export interface CreateUploadUrlResponse {
    /**
     * An identifier for a unique import job. Use it when you call the operation.
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
  export interface DataPrivacy {
    /**
     * For each Amazon Lex bot created with the Amazon Lex Model Building Service, you must specify whether your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to the Children's Online Privacy Protection Act (COPPA) by specifying true or false in the childDirected field. By specifying true in the childDirected field, you confirm that your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. By specifying false in the childDirected field, you confirm that your use of Amazon Lex is not related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. You may not specify a default value for the childDirected field that does not accurately reflect whether your use of Amazon Lex is related to a website, program, or other application that is directed or targeted, in whole or in part, to children under age 13 and subject to COPPA. If your use of Amazon Lex relates to a website, program, or other application that is directed in whole or in part, to children under age 13, you must obtain any required verifiable parental consent under COPPA. For information regarding the use of Amazon Lex in connection with websites, programs, or other applications that are directed or targeted, in whole or in part, to children under age 13, see the Amazon Lex FAQ.
     */
    childDirected: ChildDirected;
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
     * When this parameter is true, Amazon Lex doesn't check to see if any other resource is using the alias before it is deleted.
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
     * When true, Amazon Lex doesn't check to see if another resource, such as an alias, is using the bot before it is deleted.
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
     * By default, the DeleteBotVersion operations throws a ResourceInUseException exception if you try to delete a bot version that has an alias pointing at it. Set the skipResourceInUseCheck parameter to true to skip this check and remove the version even if an alias points to it.
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
     * The current status of the deletion. When the deletion is complete, the export will no longer be returned by the operation and calls to the with the export identifier will fail.
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
     * The current status of the deletion. When the deletion is complete, the import will no longer be returned by the operation and calls to the with the import identifier will fail.
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
     * The unique identifier of the session with the user. The ID is returned in the response from the and operations.
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
  }
  export interface DescribeBotLocaleRequest {
    /**
     * The identifier of the bot associated with the locale.
     */
    botId: Id;
    /**
     * The identifier of the version of the bot associated with the locale.
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
     * The identifier of the version of the bot associated with the locale.
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
     * The version of the bot to describe.
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
     * The file format used in the files that describe the bot or bot locale.
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
     * The specifications of the imported bot or bot locale.
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
  }
  export type Description = string;
  export interface DialogCodeHookSettings {
    /**
     * Enables the dialog code hook so that it processes user requests.
     */
    enabled: Boolean;
  }
  export type DraftBotVersion = string;
  export type Effect = "Allow"|"Deny"|string;
  export interface ExportFilter {
    /**
     * The name of the field to use for filtering.
     */
    name: ExportFilterName;
    /**
     * The values to use to filter the response.
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
  export type FailureReason = string;
  export type FailureReasons = FailureReason[];
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
  }
  export type FulfillmentStartResponseDelay = number;
  export interface FulfillmentStartResponseSpecification {
    /**
     * The delay between when the Lambda fulfillment function starts running and the start message is played. If the Lambda function returns before the delay is over, the start message isn't played.
     */
    delayInSeconds: FulfillmentStartResponseDelay;
    /**
     * One to 5 message groups that contain start messages. Amazon Lex chooses one of the messages to play to the user.
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
     * One to 5 message groups that contain update messages. Amazon Lex chooses one of the messages to play to the user.
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
  export type ImportExportFileFormat = "LexJson"|string;
  export type ImportExportFilePassword = string;
  export interface ImportFilter {
    /**
     * The name of the field to use for filtering.
     */
    name: ImportFilterName;
    /**
     * The values to use to filter the response.
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
  }
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
  }
  export type ImportSummaryList = ImportSummary[];
  export type ImportedResourceId = string;
  export interface InputContext {
    /**
     * The name of the context.
     */
    name: Name;
  }
  export type InputContextsList = InputContext[];
  export interface IntentClosingSetting {
    /**
     * The response that Amazon Lex sends to the user when the intent is complete.
     */
    closingResponse: ResponseSpecification;
    /**
     * Specifies whether an intent's closing response is used. When this field is false, the closing response isn't sent to the user. If the active field isn't specified, the default is true.
     */
    active?: BoxedBoolean;
  }
  export interface IntentConfirmationSetting {
    /**
     * Prompts the user to confirm the intent. This question should have a yes or no answer. Amazon Lex uses this prompt to ensure that the user acknowledges that the intent is ready for fulfillment. For example, with the OrderPizza intent, you might want to confirm that the order is correct before placing it. For other intents, such as intents that simply respond to user questions, you might not need to ask the user for confirmation before providing the information. 
     */
    promptSpecification: PromptSpecification;
    /**
     * When the user answers "no" to the question defined in promptSpecification, Amazon Lex responds with this response to acknowledge that the intent was canceled. 
     */
    declinationResponse: ResponseSpecification;
    /**
     * Specifies whether the intent's confirmation is sent to the user. When this field is false, confirmation and declination responses aren't sent. If the active field isn't specified, the default is true.
     */
    active?: BoxedBoolean;
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
     * If the response from the ListBots operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
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
     * If the response from the ListExports operation contains more results that specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
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
     * If the response from the ListImports operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
     */
    nextToken?: NextToken;
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
     * If the response from the ListIntents operation contains more results than specified in the maxResults parameter, a token is returned in the response. Use that token in the nextToken parameter to return the next page of results.
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
  export type LocaleId = string;
  export type LocaleName = string;
  export type LogPrefix = string;
  export type MaxResults = number;
  export type MergeStrategy = "Overwrite"|"FailOnConflict"|string;
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
  export type MessageVariationsList = Message[];
  export type MissedCount = number;
  export interface MultipleValuesSetting {
    /**
     * Indicates whether a slot can return multiple values. When true, the slot may return more than one value in a response. When false, the slot returns only a single value. Multi-value slots are only available in the en-US locale. If you set this value to true in any other locale, Amazon Lex throws a ValidationException. If the allowMutlipleValues is not set, the default value is false.
     */
    allowMultipleValues?: Boolean;
  }
  export type Name = string;
  export type NextToken = string;
  export type NumericalBotVersion = string;
  export interface ObfuscationSetting {
    /**
     * Value that determines whether Amazon Lex obscures slot values in conversation logs. The default is to obscure the values.
     */
    obfuscationSettingType: ObfuscationSettingType;
  }
  export type ObfuscationSettingType = "None"|"DefaultObfuscation"|string;
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
  export interface PlainTextMessage {
    /**
     * The message to send to the user.
     */
    value: PlainTextMessageValue;
  }
  export type PlainTextMessageValue = string;
  export type Policy = string;
  export interface PostFulfillmentStatusSpecification {
    successResponse?: ResponseSpecification;
    failureResponse?: ResponseSpecification;
    timeoutResponse?: ResponseSpecification;
  }
  export type PresignedS3Url = string;
  export interface Principal {
    /**
     * The name of the AWS service that should allowed or denied access to an Amazon Lex action.
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
  }
  export type QueryFilterString = string;
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
  export type S3BucketArn = string;
  export interface S3BucketLogDestination {
    /**
     * The Amazon Resource Name (ARN) of an AWS Key Management Service (KMS) key for encrypting audio log files stored in an S3 bucket.
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
  export type SampleUtterancesList = SampleUtterance[];
  export interface SampleValue {
    /**
     * The value that can be used for a slot type.
     */
    value: Value;
  }
  export interface SentimentAnalysisSettings {
    /**
     * Sets whether Amazon Lex uses Amazon Comprehend to detect the sentiment of user utterances.
     */
    detectSentiment: Boolean;
  }
  export type ServicePrincipal = string;
  export type SessionId = string;
  export type SessionTTL = number;
  export type SkipResourceInUseCheck = boolean;
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
  export type SlotPrioritiesList = SlotPriority[];
  export interface SlotPriority {
    /**
     * The priority that a slot should be elicited.
     */
    priority: PriorityValue;
    /**
     * The unique identifier of the slot.
     */
    slotId: Id;
  }
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
  export type SlotTypeFilterName = "SlotTypeName"|string;
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
  }
  export interface SlotValueRegexFilter {
    /**
     * A regular expression used to validate the value of a slot.  Use a standard regular expression. Amazon Lex supports the following characters in the regular expression:    A-Z, a-z   0-9   Unicode characters ("\ u&lt;Unicode&gt;")    Represent Unicode characters with four digits, for example "\u0041" or "\u005A".   The following regular expression operators are not supported:    Infinite repeaters: *, +, or {x,} with no upper bound.   Wild card (.)  
     */
    pattern: RegexPattern;
  }
  export type SlotValueResolutionStrategy = "OriginalValue"|"TopResolution"|string;
  export interface SlotValueSelectionSetting {
    /**
     * Determines the slot resolution strategy that Amazon Lex uses to return slot type values. The field can be set to one of the following values:   OriginalValue - Returns the value entered by the user, if the user value is similar to the slot value.   TopResolution - If there is a resolution list for the slot, return the first value in the resolution list as the slot type value. If there is no resolution list, null is returned.   If you don't specify the valueSelectionStrategy, the default is OriginalValue. 
     */
    resolutionStrategy: SlotValueResolutionStrategy;
    /**
     * A regular expression used to validate the value of a slot.
     */
    regexFilter?: SlotValueRegexFilter;
  }
  export type SortOrder = "Ascending"|"Descending"|string;
  export interface StartImportRequest {
    /**
     * The unique identifier for the import. It is included in the response from the operation.
     */
    importId: Id;
    /**
     * Parameters for creating the bot or bot locale.
     */
    resourceSpecification: ImportResourceSpecification;
    /**
     * The strategy to use when there is a name conflict between the imported resource and an existing resource. When the merge strategy is FailOnConflict existing resources are not overwritten and the import fails.
     */
    mergeStrategy: MergeStrategy;
    /**
     * The password used to encrypt the zip archive that contains the bot or bot locale definition. You should always encrypt the zip archive to protect it during transit between your site and Amazon Lex.
     */
    filePassword?: ImportExportFilePassword;
  }
  export interface StartImportResponse {
    /**
     * A unique identifier for the import.
     */
    importId?: Id;
    /**
     * The parameters used when importing the bot or bot locale.
     */
    resourceSpecification?: ImportResourceSpecification;
    /**
     * The strategy used when there was a name conflict between the imported resource and an existing resource. When the merge strategy is FailOnConflict existing resources are not overwritten and the import fails.
     */
    mergeStrategy?: MergeStrategy;
    /**
     * The current status of the import. When the status is Complete the bot or bot alias is ready to use.
     */
    importStatus?: ImportStatus;
    /**
     * The date and time that the import request was created.
     */
    creationDateTime?: Timestamp;
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
  export type TimeValue = number;
  export type Timestamp = Date;
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
  }
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
     * The file format used for the files that define the resource.
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
    slotTypeId: BuiltInOrCustomSlotTypeId;
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
     * The identifier of the slot version that contains the slot. Will always be DRAFT.
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
    valueSelectionSetting: SlotValueSelectionSetting;
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
  }
  export type Utterance = string;
  export interface UtteranceAggregationDuration {
    /**
     * The desired time window for aggregating utterances. 
     */
    relativeAggregationDuration: RelativeAggregationDuration;
  }
  export type Value = string;
  export type VoiceId = string;
  export interface VoiceSettings {
    /**
     * The identifier of the Amazon Polly voice to use.
     */
    voiceId: VoiceId;
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
