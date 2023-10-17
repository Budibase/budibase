import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Budgets extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Budgets.Types.ClientConfiguration)
  config: Config & Budgets.Types.ClientConfiguration;
  /**
   * Creates a budget and, if included, notifications and subscribers.   Only one of BudgetLimit or PlannedBudgetLimits can be present in the syntax at one time. Use the syntax that matches your case. The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  createBudget(params: Budgets.Types.CreateBudgetRequest, callback?: (err: AWSError, data: Budgets.Types.CreateBudgetResponse) => void): Request<Budgets.Types.CreateBudgetResponse, AWSError>;
  /**
   * Creates a budget and, if included, notifications and subscribers.   Only one of BudgetLimit or PlannedBudgetLimits can be present in the syntax at one time. Use the syntax that matches your case. The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  createBudget(callback?: (err: AWSError, data: Budgets.Types.CreateBudgetResponse) => void): Request<Budgets.Types.CreateBudgetResponse, AWSError>;
  /**
   *  Creates a budget action. 
   */
  createBudgetAction(params: Budgets.Types.CreateBudgetActionRequest, callback?: (err: AWSError, data: Budgets.Types.CreateBudgetActionResponse) => void): Request<Budgets.Types.CreateBudgetActionResponse, AWSError>;
  /**
   *  Creates a budget action. 
   */
  createBudgetAction(callback?: (err: AWSError, data: Budgets.Types.CreateBudgetActionResponse) => void): Request<Budgets.Types.CreateBudgetActionResponse, AWSError>;
  /**
   * Creates a notification. You must create the budget before you create the associated notification.
   */
  createNotification(params: Budgets.Types.CreateNotificationRequest, callback?: (err: AWSError, data: Budgets.Types.CreateNotificationResponse) => void): Request<Budgets.Types.CreateNotificationResponse, AWSError>;
  /**
   * Creates a notification. You must create the budget before you create the associated notification.
   */
  createNotification(callback?: (err: AWSError, data: Budgets.Types.CreateNotificationResponse) => void): Request<Budgets.Types.CreateNotificationResponse, AWSError>;
  /**
   * Creates a subscriber. You must create the associated budget and notification before you create the subscriber.
   */
  createSubscriber(params: Budgets.Types.CreateSubscriberRequest, callback?: (err: AWSError, data: Budgets.Types.CreateSubscriberResponse) => void): Request<Budgets.Types.CreateSubscriberResponse, AWSError>;
  /**
   * Creates a subscriber. You must create the associated budget and notification before you create the subscriber.
   */
  createSubscriber(callback?: (err: AWSError, data: Budgets.Types.CreateSubscriberResponse) => void): Request<Budgets.Types.CreateSubscriberResponse, AWSError>;
  /**
   * Deletes a budget. You can delete your budget at any time.  Deleting a budget also deletes the notifications and subscribers that are associated with that budget. 
   */
  deleteBudget(params: Budgets.Types.DeleteBudgetRequest, callback?: (err: AWSError, data: Budgets.Types.DeleteBudgetResponse) => void): Request<Budgets.Types.DeleteBudgetResponse, AWSError>;
  /**
   * Deletes a budget. You can delete your budget at any time.  Deleting a budget also deletes the notifications and subscribers that are associated with that budget. 
   */
  deleteBudget(callback?: (err: AWSError, data: Budgets.Types.DeleteBudgetResponse) => void): Request<Budgets.Types.DeleteBudgetResponse, AWSError>;
  /**
   *  Deletes a budget action. 
   */
  deleteBudgetAction(params: Budgets.Types.DeleteBudgetActionRequest, callback?: (err: AWSError, data: Budgets.Types.DeleteBudgetActionResponse) => void): Request<Budgets.Types.DeleteBudgetActionResponse, AWSError>;
  /**
   *  Deletes a budget action. 
   */
  deleteBudgetAction(callback?: (err: AWSError, data: Budgets.Types.DeleteBudgetActionResponse) => void): Request<Budgets.Types.DeleteBudgetActionResponse, AWSError>;
  /**
   * Deletes a notification.  Deleting a notification also deletes the subscribers that are associated with the notification. 
   */
  deleteNotification(params: Budgets.Types.DeleteNotificationRequest, callback?: (err: AWSError, data: Budgets.Types.DeleteNotificationResponse) => void): Request<Budgets.Types.DeleteNotificationResponse, AWSError>;
  /**
   * Deletes a notification.  Deleting a notification also deletes the subscribers that are associated with the notification. 
   */
  deleteNotification(callback?: (err: AWSError, data: Budgets.Types.DeleteNotificationResponse) => void): Request<Budgets.Types.DeleteNotificationResponse, AWSError>;
  /**
   * Deletes a subscriber.  Deleting the last subscriber to a notification also deletes the notification. 
   */
  deleteSubscriber(params: Budgets.Types.DeleteSubscriberRequest, callback?: (err: AWSError, data: Budgets.Types.DeleteSubscriberResponse) => void): Request<Budgets.Types.DeleteSubscriberResponse, AWSError>;
  /**
   * Deletes a subscriber.  Deleting the last subscriber to a notification also deletes the notification. 
   */
  deleteSubscriber(callback?: (err: AWSError, data: Budgets.Types.DeleteSubscriberResponse) => void): Request<Budgets.Types.DeleteSubscriberResponse, AWSError>;
  /**
   * Describes a budget.  The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  describeBudget(params: Budgets.Types.DescribeBudgetRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetResponse) => void): Request<Budgets.Types.DescribeBudgetResponse, AWSError>;
  /**
   * Describes a budget.  The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  describeBudget(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetResponse) => void): Request<Budgets.Types.DescribeBudgetResponse, AWSError>;
  /**
   *  Describes a budget action detail. 
   */
  describeBudgetAction(params: Budgets.Types.DescribeBudgetActionRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionResponse) => void): Request<Budgets.Types.DescribeBudgetActionResponse, AWSError>;
  /**
   *  Describes a budget action detail. 
   */
  describeBudgetAction(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionResponse) => void): Request<Budgets.Types.DescribeBudgetActionResponse, AWSError>;
  /**
   *  Describes a budget action history detail. 
   */
  describeBudgetActionHistories(params: Budgets.Types.DescribeBudgetActionHistoriesRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionHistoriesResponse) => void): Request<Budgets.Types.DescribeBudgetActionHistoriesResponse, AWSError>;
  /**
   *  Describes a budget action history detail. 
   */
  describeBudgetActionHistories(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionHistoriesResponse) => void): Request<Budgets.Types.DescribeBudgetActionHistoriesResponse, AWSError>;
  /**
   *  Describes all of the budget actions for an account. 
   */
  describeBudgetActionsForAccount(params: Budgets.Types.DescribeBudgetActionsForAccountRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionsForAccountResponse) => void): Request<Budgets.Types.DescribeBudgetActionsForAccountResponse, AWSError>;
  /**
   *  Describes all of the budget actions for an account. 
   */
  describeBudgetActionsForAccount(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionsForAccountResponse) => void): Request<Budgets.Types.DescribeBudgetActionsForAccountResponse, AWSError>;
  /**
   *  Describes all of the budget actions for a budget. 
   */
  describeBudgetActionsForBudget(params: Budgets.Types.DescribeBudgetActionsForBudgetRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionsForBudgetResponse) => void): Request<Budgets.Types.DescribeBudgetActionsForBudgetResponse, AWSError>;
  /**
   *  Describes all of the budget actions for a budget. 
   */
  describeBudgetActionsForBudget(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetActionsForBudgetResponse) => void): Request<Budgets.Types.DescribeBudgetActionsForBudgetResponse, AWSError>;
  /**
   * Describes the history for DAILY, MONTHLY, and QUARTERLY budgets. Budget history isn't available for ANNUAL budgets.
   */
  describeBudgetPerformanceHistory(params: Budgets.Types.DescribeBudgetPerformanceHistoryRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetPerformanceHistoryResponse) => void): Request<Budgets.Types.DescribeBudgetPerformanceHistoryResponse, AWSError>;
  /**
   * Describes the history for DAILY, MONTHLY, and QUARTERLY budgets. Budget history isn't available for ANNUAL budgets.
   */
  describeBudgetPerformanceHistory(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetPerformanceHistoryResponse) => void): Request<Budgets.Types.DescribeBudgetPerformanceHistoryResponse, AWSError>;
  /**
   * Lists the budgets that are associated with an account.  The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  describeBudgets(params: Budgets.Types.DescribeBudgetsRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetsResponse) => void): Request<Budgets.Types.DescribeBudgetsResponse, AWSError>;
  /**
   * Lists the budgets that are associated with an account.  The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  describeBudgets(callback?: (err: AWSError, data: Budgets.Types.DescribeBudgetsResponse) => void): Request<Budgets.Types.DescribeBudgetsResponse, AWSError>;
  /**
   * Lists the notifications that are associated with a budget.
   */
  describeNotificationsForBudget(params: Budgets.Types.DescribeNotificationsForBudgetRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeNotificationsForBudgetResponse) => void): Request<Budgets.Types.DescribeNotificationsForBudgetResponse, AWSError>;
  /**
   * Lists the notifications that are associated with a budget.
   */
  describeNotificationsForBudget(callback?: (err: AWSError, data: Budgets.Types.DescribeNotificationsForBudgetResponse) => void): Request<Budgets.Types.DescribeNotificationsForBudgetResponse, AWSError>;
  /**
   * Lists the subscribers that are associated with a notification.
   */
  describeSubscribersForNotification(params: Budgets.Types.DescribeSubscribersForNotificationRequest, callback?: (err: AWSError, data: Budgets.Types.DescribeSubscribersForNotificationResponse) => void): Request<Budgets.Types.DescribeSubscribersForNotificationResponse, AWSError>;
  /**
   * Lists the subscribers that are associated with a notification.
   */
  describeSubscribersForNotification(callback?: (err: AWSError, data: Budgets.Types.DescribeSubscribersForNotificationResponse) => void): Request<Budgets.Types.DescribeSubscribersForNotificationResponse, AWSError>;
  /**
   *  Executes a budget action. 
   */
  executeBudgetAction(params: Budgets.Types.ExecuteBudgetActionRequest, callback?: (err: AWSError, data: Budgets.Types.ExecuteBudgetActionResponse) => void): Request<Budgets.Types.ExecuteBudgetActionResponse, AWSError>;
  /**
   *  Executes a budget action. 
   */
  executeBudgetAction(callback?: (err: AWSError, data: Budgets.Types.ExecuteBudgetActionResponse) => void): Request<Budgets.Types.ExecuteBudgetActionResponse, AWSError>;
  /**
   * Updates a budget. You can change every part of a budget except for the budgetName and the calculatedSpend. When you modify a budget, the calculatedSpend drops to zero until AWS has new usage data to use for forecasting.  Only one of BudgetLimit or PlannedBudgetLimits can be present in the syntax at one time. Use the syntax that matches your case. The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  updateBudget(params: Budgets.Types.UpdateBudgetRequest, callback?: (err: AWSError, data: Budgets.Types.UpdateBudgetResponse) => void): Request<Budgets.Types.UpdateBudgetResponse, AWSError>;
  /**
   * Updates a budget. You can change every part of a budget except for the budgetName and the calculatedSpend. When you modify a budget, the calculatedSpend drops to zero until AWS has new usage data to use for forecasting.  Only one of BudgetLimit or PlannedBudgetLimits can be present in the syntax at one time. Use the syntax that matches your case. The Request Syntax section shows the BudgetLimit syntax. For PlannedBudgetLimits, see the Examples section.  
   */
  updateBudget(callback?: (err: AWSError, data: Budgets.Types.UpdateBudgetResponse) => void): Request<Budgets.Types.UpdateBudgetResponse, AWSError>;
  /**
   *  Updates a budget action. 
   */
  updateBudgetAction(params: Budgets.Types.UpdateBudgetActionRequest, callback?: (err: AWSError, data: Budgets.Types.UpdateBudgetActionResponse) => void): Request<Budgets.Types.UpdateBudgetActionResponse, AWSError>;
  /**
   *  Updates a budget action. 
   */
  updateBudgetAction(callback?: (err: AWSError, data: Budgets.Types.UpdateBudgetActionResponse) => void): Request<Budgets.Types.UpdateBudgetActionResponse, AWSError>;
  /**
   * Updates a notification.
   */
  updateNotification(params: Budgets.Types.UpdateNotificationRequest, callback?: (err: AWSError, data: Budgets.Types.UpdateNotificationResponse) => void): Request<Budgets.Types.UpdateNotificationResponse, AWSError>;
  /**
   * Updates a notification.
   */
  updateNotification(callback?: (err: AWSError, data: Budgets.Types.UpdateNotificationResponse) => void): Request<Budgets.Types.UpdateNotificationResponse, AWSError>;
  /**
   * Updates a subscriber.
   */
  updateSubscriber(params: Budgets.Types.UpdateSubscriberRequest, callback?: (err: AWSError, data: Budgets.Types.UpdateSubscriberResponse) => void): Request<Budgets.Types.UpdateSubscriberResponse, AWSError>;
  /**
   * Updates a subscriber.
   */
  updateSubscriber(callback?: (err: AWSError, data: Budgets.Types.UpdateSubscriberResponse) => void): Request<Budgets.Types.UpdateSubscriberResponse, AWSError>;
}
declare namespace Budgets {
  export type AccountId = string;
  export interface Action {
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
    BudgetName: BudgetName;
    NotificationType: NotificationType;
    /**
     *  The type of action. This defines the type of tasks that can be carried out by this action. This field also determines the format for definition. 
     */
    ActionType: ActionType;
    /**
     *  The trigger threshold of the action. 
     */
    ActionThreshold: ActionThreshold;
    /**
     *  Where you specify all of the type-specific parameters. 
     */
    Definition: Definition;
    /**
     *  The role passed for action execution and reversion. Roles and actions must be in the same account. 
     */
    ExecutionRoleArn: RoleArn;
    /**
     *  This specifies if the action needs manual or automatic approval. 
     */
    ApprovalModel: ApprovalModel;
    /**
     *  The status of action. 
     */
    Status: ActionStatus;
    Subscribers: Subscribers;
  }
  export type ActionHistories = ActionHistory[];
  export interface ActionHistory {
    Timestamp: GenericTimestamp;
    /**
     *  The status of action at the time of the event. 
     */
    Status: ActionStatus;
    /**
     *  This distinguishes between whether the events are triggered by the user or generated by the system. 
     */
    EventType: EventType;
    /**
     *  The description of details of the event. 
     */
    ActionHistoryDetails: ActionHistoryDetails;
  }
  export interface ActionHistoryDetails {
    Message: GenericString;
    /**
     *  The budget action resource. 
     */
    Action: Action;
  }
  export type ActionId = string;
  export type ActionStatus = "STANDBY"|"PENDING"|"EXECUTION_IN_PROGRESS"|"EXECUTION_SUCCESS"|"EXECUTION_FAILURE"|"REVERSE_IN_PROGRESS"|"REVERSE_SUCCESS"|"REVERSE_FAILURE"|"RESET_IN_PROGRESS"|"RESET_FAILURE"|string;
  export type ActionSubType = "STOP_EC2_INSTANCES"|"STOP_RDS_INSTANCES"|string;
  export interface ActionThreshold {
    ActionThresholdValue: NotificationThreshold;
    ActionThresholdType: ThresholdType;
  }
  export type ActionType = "APPLY_IAM_POLICY"|"APPLY_SCP_POLICY"|"RUN_SSM_DOCUMENTS"|string;
  export type Actions = Action[];
  export type ApprovalModel = "AUTOMATIC"|"MANUAL"|string;
  export interface Budget {
    /**
     * The name of a budget. The name must be unique within an account. The : and \ characters aren't allowed in BudgetName.
     */
    BudgetName: BudgetName;
    /**
     * The total amount of cost, usage, RI utilization, RI coverage, Savings Plans utilization, or Savings Plans coverage that you want to track with your budget.  BudgetLimit is required for cost or usage budgets, but optional for RI or Savings Plans utilization or coverage budgets. RI and Savings Plans utilization or coverage budgets default to 100, which is the only valid value for RI or Savings Plans utilization or coverage budgets. You can't use BudgetLimit with PlannedBudgetLimits for CreateBudget and UpdateBudget actions. 
     */
    BudgetLimit?: Spend;
    /**
     * A map containing multiple BudgetLimit, including current or future limits.  PlannedBudgetLimits is available for cost or usage budget and supports monthly and quarterly TimeUnit.  For monthly budgets, provide 12 months of PlannedBudgetLimits values. This must start from the current month and include the next 11 months. The key is the start of the month, UTC in epoch seconds.  For quarterly budgets, provide 4 quarters of PlannedBudgetLimits value entries in standard calendar quarter increments. This must start from the current quarter and include the next 3 quarters. The key is the start of the quarter, UTC in epoch seconds.  If the planned budget expires before 12 months for monthly or 4 quarters for quarterly, provide the PlannedBudgetLimits values only for the remaining periods. If the budget begins at a date in the future, provide PlannedBudgetLimits values from the start date of the budget.  After all of the BudgetLimit values in PlannedBudgetLimits are used, the budget continues to use the last limit as the BudgetLimit. At that point, the planned budget provides the same experience as a fixed budget.   DescribeBudget and DescribeBudgets response along with PlannedBudgetLimits will also contain BudgetLimit representing the current month or quarter limit present in PlannedBudgetLimits. This only applies to budgets created with PlannedBudgetLimits. Budgets created without PlannedBudgetLimits will only contain BudgetLimit, and no PlannedBudgetLimits.
     */
    PlannedBudgetLimits?: PlannedBudgetLimits;
    /**
     * The cost filters, such as service or tag, that are applied to a budget. AWS Budgets supports the following services as a filter for RI budgets:   Amazon Elastic Compute Cloud - Compute   Amazon Redshift   Amazon Relational Database Service   Amazon ElastiCache   Amazon Elasticsearch Service  
     */
    CostFilters?: CostFilters;
    /**
     * The types of costs that are included in this COST budget.  USAGE, RI_UTILIZATION, RI_COVERAGE, SAVINGS_PLANS_UTILIZATION, and SAVINGS_PLANS_COVERAGE budgets do not have CostTypes.
     */
    CostTypes?: CostTypes;
    /**
     * The length of time until a budget resets the actual and forecasted spend.
     */
    TimeUnit: TimeUnit;
    /**
     * The period of time that is covered by a budget. The period has a start date and an end date. The start date must come before the end date. The end date must come before 06/15/87 00:00 UTC.  If you create your budget and don't specify a start date, AWS defaults to the start of your chosen time period (DAILY, MONTHLY, QUARTERLY, or ANNUALLY). For example, if you created your budget on January 24, 2018, chose DAILY, and didn't set a start date, AWS set your start date to 01/24/18 00:00 UTC. If you chose MONTHLY, AWS set your start date to 01/01/18 00:00 UTC. If you didn't specify an end date, AWS set your end date to 06/15/87 00:00 UTC. The defaults are the same for the AWS Billing and Cost Management console and the API.  You can change either date with the UpdateBudget operation. After the end date, AWS deletes the budget and all associated notifications and subscribers.
     */
    TimePeriod?: TimePeriod;
    /**
     * The actual and forecasted cost or usage that the budget tracks.
     */
    CalculatedSpend?: CalculatedSpend;
    /**
     * Whether this budget tracks costs, usage, RI utilization, RI coverage, Savings Plans utilization, or Savings Plans coverage.
     */
    BudgetType: BudgetType;
    /**
     * The last time that you updated this budget.
     */
    LastUpdatedTime?: GenericTimestamp;
  }
  export type BudgetName = string;
  export interface BudgetPerformanceHistory {
    BudgetName?: BudgetName;
    BudgetType?: BudgetType;
    /**
     * The history of the cost filters for a budget during the specified time period.
     */
    CostFilters?: CostFilters;
    /**
     * The history of the cost types for a budget during the specified time period.
     */
    CostTypes?: CostTypes;
    TimeUnit?: TimeUnit;
    /**
     * A list of amounts of cost or usage that you created budgets for, compared to your actual costs or usage.
     */
    BudgetedAndActualAmountsList?: BudgetedAndActualAmountsList;
  }
  export type BudgetType = "USAGE"|"COST"|"RI_UTILIZATION"|"RI_COVERAGE"|"SAVINGS_PLANS_UTILIZATION"|"SAVINGS_PLANS_COVERAGE"|string;
  export interface BudgetedAndActualAmounts {
    /**
     * The amount of cost or usage that you created the budget for.
     */
    BudgetedAmount?: Spend;
    /**
     * Your actual costs or usage for a budget period.
     */
    ActualAmount?: Spend;
    /**
     * The time period covered by this budget comparison.
     */
    TimePeriod?: TimePeriod;
  }
  export type BudgetedAndActualAmountsList = BudgetedAndActualAmounts[];
  export type Budgets = Budget[];
  export interface CalculatedSpend {
    /**
     * The amount of cost, usage, RI units, or Savings Plans units that you have used.
     */
    ActualSpend: Spend;
    /**
     * The amount of cost, usage, RI units, or Savings Plans units that you are forecasted to use.
     */
    ForecastedSpend?: Spend;
  }
  export type ComparisonOperator = "GREATER_THAN"|"LESS_THAN"|"EQUAL_TO"|string;
  export type CostFilters = {[key: string]: DimensionValues};
  export interface CostTypes {
    /**
     * Specifies whether a budget includes taxes. The default value is true.
     */
    IncludeTax?: NullableBoolean;
    /**
     * Specifies whether a budget includes subscriptions. The default value is true.
     */
    IncludeSubscription?: NullableBoolean;
    /**
     * Specifies whether a budget uses a blended rate. The default value is false.
     */
    UseBlended?: NullableBoolean;
    /**
     * Specifies whether a budget includes refunds. The default value is true.
     */
    IncludeRefund?: NullableBoolean;
    /**
     * Specifies whether a budget includes credits. The default value is true.
     */
    IncludeCredit?: NullableBoolean;
    /**
     * Specifies whether a budget includes upfront RI costs. The default value is true.
     */
    IncludeUpfront?: NullableBoolean;
    /**
     * Specifies whether a budget includes recurring fees such as monthly RI fees. The default value is true.
     */
    IncludeRecurring?: NullableBoolean;
    /**
     * Specifies whether a budget includes non-RI subscription costs. The default value is true.
     */
    IncludeOtherSubscription?: NullableBoolean;
    /**
     * Specifies whether a budget includes support subscription fees. The default value is true.
     */
    IncludeSupport?: NullableBoolean;
    /**
     * Specifies whether a budget includes discounts. The default value is true.
     */
    IncludeDiscount?: NullableBoolean;
    /**
     * Specifies whether a budget uses the amortized rate. The default value is false.
     */
    UseAmortized?: NullableBoolean;
  }
  export interface CreateBudgetActionRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    NotificationType: NotificationType;
    /**
     *  The type of action. This defines the type of tasks that can be carried out by this action. This field also determines the format for definition. 
     */
    ActionType: ActionType;
    ActionThreshold: ActionThreshold;
    Definition: Definition;
    /**
     *  The role passed for action execution and reversion. Roles and actions must be in the same account. 
     */
    ExecutionRoleArn: RoleArn;
    /**
     *  This specifies if the action needs manual or automatic approval. 
     */
    ApprovalModel: ApprovalModel;
    Subscribers: Subscribers;
  }
  export interface CreateBudgetActionResponse {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
  }
  export interface CreateBudgetRequest {
    /**
     * The accountId that is associated with the budget.
     */
    AccountId: AccountId;
    /**
     * The budget object that you want to create.
     */
    Budget: Budget;
    /**
     * A notification that you want to associate with a budget. A budget can have up to five notifications, and each notification can have one SNS subscriber and up to 10 email subscribers. If you include notifications and subscribers in your CreateBudget call, AWS creates the notifications and subscribers for you.
     */
    NotificationsWithSubscribers?: NotificationWithSubscribersList;
  }
  export interface CreateBudgetResponse {
  }
  export interface CreateNotificationRequest {
    /**
     * The accountId that is associated with the budget that you want to create a notification for.
     */
    AccountId: AccountId;
    /**
     * The name of the budget that you want AWS to notify you about. Budget names must be unique within an account.
     */
    BudgetName: BudgetName;
    /**
     * The notification that you want to create.
     */
    Notification: Notification;
    /**
     * A list of subscribers that you want to associate with the notification. Each notification can have one SNS subscriber and up to 10 email subscribers.
     */
    Subscribers: Subscribers;
  }
  export interface CreateNotificationResponse {
  }
  export interface CreateSubscriberRequest {
    /**
     * The accountId that is associated with the budget that you want to create a subscriber for.
     */
    AccountId: AccountId;
    /**
     * The name of the budget that you want to subscribe to. Budget names must be unique within an account.
     */
    BudgetName: BudgetName;
    /**
     * The notification that you want to create a subscriber for.
     */
    Notification: Notification;
    /**
     * The subscriber that you want to associate with a budget notification.
     */
    Subscriber: Subscriber;
  }
  export interface CreateSubscriberResponse {
  }
  export interface Definition {
    /**
     *  The AWS Identity and Access Management (IAM) action definition details. 
     */
    IamActionDefinition?: IamActionDefinition;
    /**
     *  The service control policies (SCPs) action definition details. 
     */
    ScpActionDefinition?: ScpActionDefinition;
    /**
     *  The AWS Systems Manager (SSM) action definition details. 
     */
    SsmActionDefinition?: SsmActionDefinition;
  }
  export interface DeleteBudgetActionRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
  }
  export interface DeleteBudgetActionResponse {
    AccountId: AccountId;
    BudgetName: BudgetName;
    Action: Action;
  }
  export interface DeleteBudgetRequest {
    /**
     * The accountId that is associated with the budget that you want to delete.
     */
    AccountId: AccountId;
    /**
     * The name of the budget that you want to delete.
     */
    BudgetName: BudgetName;
  }
  export interface DeleteBudgetResponse {
  }
  export interface DeleteNotificationRequest {
    /**
     * The accountId that is associated with the budget whose notification you want to delete.
     */
    AccountId: AccountId;
    /**
     * The name of the budget whose notification you want to delete.
     */
    BudgetName: BudgetName;
    /**
     * The notification that you want to delete.
     */
    Notification: Notification;
  }
  export interface DeleteNotificationResponse {
  }
  export interface DeleteSubscriberRequest {
    /**
     * The accountId that is associated with the budget whose subscriber you want to delete.
     */
    AccountId: AccountId;
    /**
     * The name of the budget whose subscriber you want to delete.
     */
    BudgetName: BudgetName;
    /**
     * The notification whose subscriber you want to delete.
     */
    Notification: Notification;
    /**
     * The subscriber that you want to delete.
     */
    Subscriber: Subscriber;
  }
  export interface DeleteSubscriberResponse {
  }
  export interface DescribeBudgetActionHistoriesRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
    TimePeriod?: TimePeriod;
    MaxResults?: MaxResults;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetActionHistoriesResponse {
    /**
     *  The historical record of the budget action resource. 
     */
    ActionHistories: ActionHistories;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetActionRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
  }
  export interface DescribeBudgetActionResponse {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A budget action resource. 
     */
    Action: Action;
  }
  export interface DescribeBudgetActionsForAccountRequest {
    AccountId: AccountId;
    MaxResults?: MaxResults;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetActionsForAccountResponse {
    /**
     *  A list of the budget action resources information. 
     */
    Actions: Actions;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetActionsForBudgetRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    MaxResults?: MaxResults;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetActionsForBudgetResponse {
    /**
     *  A list of the budget action resources information. 
     */
    Actions: Actions;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetPerformanceHistoryRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     * Retrieves how often the budget went into an ALARM state for the specified time period.
     */
    TimePeriod?: TimePeriod;
    MaxResults?: MaxResults;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetPerformanceHistoryResponse {
    /**
     * The history of how often the budget has gone into an ALARM state. For DAILY budgets, the history saves the state of the budget for the last 60 days. For MONTHLY budgets, the history saves the state of the budget for the current month plus the last 12 months. For QUARTERLY budgets, the history saves the state of the budget for the last four quarters.
     */
    BudgetPerformanceHistory?: BudgetPerformanceHistory;
    NextToken?: GenericString;
  }
  export interface DescribeBudgetRequest {
    /**
     * The accountId that is associated with the budget that you want a description of.
     */
    AccountId: AccountId;
    /**
     * The name of the budget that you want a description of.
     */
    BudgetName: BudgetName;
  }
  export interface DescribeBudgetResponse {
    /**
     * The description of the budget.
     */
    Budget?: Budget;
  }
  export interface DescribeBudgetsRequest {
    /**
     * The accountId that is associated with the budgets that you want descriptions of.
     */
    AccountId: AccountId;
    /**
     * An optional integer that represents how many entries a paginated response contains. The maximum is 100.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token that you include in your request to indicate the next set of results that you want to retrieve.
     */
    NextToken?: GenericString;
  }
  export interface DescribeBudgetsResponse {
    /**
     * A list of budgets.
     */
    Budgets?: Budgets;
    /**
     * The pagination token in the service response that indicates the next set of results that you can retrieve.
     */
    NextToken?: GenericString;
  }
  export interface DescribeNotificationsForBudgetRequest {
    /**
     * The accountId that is associated with the budget whose notifications you want descriptions of.
     */
    AccountId: AccountId;
    /**
     * The name of the budget whose notifications you want descriptions of.
     */
    BudgetName: BudgetName;
    /**
     * An optional integer that represents how many entries a paginated response contains. The maximum is 100.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token that you include in your request to indicate the next set of results that you want to retrieve.
     */
    NextToken?: GenericString;
  }
  export interface DescribeNotificationsForBudgetResponse {
    /**
     * A list of notifications that are associated with a budget.
     */
    Notifications?: Notifications;
    /**
     * The pagination token in the service response that indicates the next set of results that you can retrieve.
     */
    NextToken?: GenericString;
  }
  export interface DescribeSubscribersForNotificationRequest {
    /**
     * The accountId that is associated with the budget whose subscribers you want descriptions of.
     */
    AccountId: AccountId;
    /**
     * The name of the budget whose subscribers you want descriptions of.
     */
    BudgetName: BudgetName;
    /**
     * The notification whose subscribers you want to list.
     */
    Notification: Notification;
    /**
     * An optional integer that represents how many entries a paginated response contains. The maximum is 100.
     */
    MaxResults?: MaxResults;
    /**
     * The pagination token that you include in your request to indicate the next set of results that you want to retrieve.
     */
    NextToken?: GenericString;
  }
  export interface DescribeSubscribersForNotificationResponse {
    /**
     * A list of subscribers that are associated with a notification.
     */
    Subscribers?: Subscribers;
    /**
     * The pagination token in the service response that indicates the next set of results that you can retrieve.
     */
    NextToken?: GenericString;
  }
  export type DimensionValues = GenericString[];
  export type EventType = "SYSTEM"|"CREATE_ACTION"|"DELETE_ACTION"|"UPDATE_ACTION"|"EXECUTE_ACTION"|string;
  export interface ExecuteBudgetActionRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
    /**
     *  The type of execution. 
     */
    ExecutionType: ExecutionType;
  }
  export interface ExecuteBudgetActionResponse {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
    /**
     *  The type of execution. 
     */
    ExecutionType: ExecutionType;
  }
  export type ExecutionType = "APPROVE_BUDGET_ACTION"|"RETRY_BUDGET_ACTION"|"REVERSE_BUDGET_ACTION"|"RESET_BUDGET_ACTION"|string;
  export type GenericString = string;
  export type GenericTimestamp = Date;
  export type Group = string;
  export type Groups = Group[];
  export interface IamActionDefinition {
    /**
     *  The Amazon Resource Name (ARN) of the policy to be attached. 
     */
    PolicyArn: PolicyArn;
    /**
     *  A list of roles to be attached. There must be at least one role. 
     */
    Roles?: Roles;
    /**
     *  A list of groups to be attached. There must be at least one group. 
     */
    Groups?: Groups;
    /**
     *  A list of users to be attached. There must be at least one user. 
     */
    Users?: Users;
  }
  export type InstanceId = string;
  export type InstanceIds = InstanceId[];
  export type MaxResults = number;
  export interface Notification {
    /**
     * Whether the notification is for how much you have spent (ACTUAL) or for how much you're forecasted to spend (FORECASTED).
     */
    NotificationType: NotificationType;
    /**
     * The comparison that is used for this notification.
     */
    ComparisonOperator: ComparisonOperator;
    /**
     * The threshold that is associated with a notification. Thresholds are always a percentage, and many customers find value being alerted between 50% - 200% of the budgeted amount. The maximum limit for your threshold is 1,000,000% above the budgeted amount.
     */
    Threshold: NotificationThreshold;
    /**
     * The type of threshold for a notification. For ABSOLUTE_VALUE thresholds, AWS notifies you when you go over or are forecasted to go over your total cost threshold. For PERCENTAGE thresholds, AWS notifies you when you go over or are forecasted to go over a certain percentage of your forecasted spend. For example, if you have a budget for 200 dollars and you have a PERCENTAGE threshold of 80%, AWS notifies you when you go over 160 dollars.
     */
    ThresholdType?: ThresholdType;
    /**
     * Whether this notification is in alarm. If a budget notification is in the ALARM state, you have passed the set threshold for the budget.
     */
    NotificationState?: NotificationState;
  }
  export type NotificationState = "OK"|"ALARM"|string;
  export type NotificationThreshold = number;
  export type NotificationType = "ACTUAL"|"FORECASTED"|string;
  export interface NotificationWithSubscribers {
    /**
     * The notification that is associated with a budget.
     */
    Notification: Notification;
    /**
     * A list of subscribers who are subscribed to this notification.
     */
    Subscribers: Subscribers;
  }
  export type NotificationWithSubscribersList = NotificationWithSubscribers[];
  export type Notifications = Notification[];
  export type NullableBoolean = boolean;
  export type NumericValue = string;
  export type PlannedBudgetLimits = {[key: string]: Spend};
  export type PolicyArn = string;
  export type PolicyId = string;
  export type Region = string;
  export type Role = string;
  export type RoleArn = string;
  export type Roles = Role[];
  export interface ScpActionDefinition {
    /**
     *  The policy ID attached. 
     */
    PolicyId: PolicyId;
    /**
     *  A list of target IDs. 
     */
    TargetIds: TargetIds;
  }
  export interface Spend {
    /**
     * The cost or usage amount that is associated with a budget forecast, actual spend, or budget threshold.
     */
    Amount: NumericValue;
    /**
     * The unit of measurement that is used for the budget forecast, actual spend, or budget threshold, such as dollars or GB.
     */
    Unit: UnitValue;
  }
  export interface SsmActionDefinition {
    /**
     *  The action subType. 
     */
    ActionSubType: ActionSubType;
    /**
     *  The Region to run the SSM document. 
     */
    Region: Region;
    /**
     *  The EC2 and RDS instance IDs. 
     */
    InstanceIds: InstanceIds;
  }
  export interface Subscriber {
    /**
     * The type of notification that AWS sends to a subscriber.
     */
    SubscriptionType: SubscriptionType;
    /**
     * The address that AWS sends budget notifications to, either an SNS topic or an email. When you create a subscriber, the value of Address can't contain line breaks.
     */
    Address: SubscriberAddress;
  }
  export type SubscriberAddress = string;
  export type Subscribers = Subscriber[];
  export type SubscriptionType = "SNS"|"EMAIL"|string;
  export type TargetId = string;
  export type TargetIds = TargetId[];
  export type ThresholdType = "PERCENTAGE"|"ABSOLUTE_VALUE"|string;
  export interface TimePeriod {
    /**
     * The start date for a budget. If you created your budget and didn't specify a start date, AWS defaults to the start of your chosen time period (DAILY, MONTHLY, QUARTERLY, or ANNUALLY). For example, if you created your budget on January 24, 2018, chose DAILY, and didn't set a start date, AWS set your start date to 01/24/18 00:00 UTC. If you chose MONTHLY, AWS set your start date to 01/01/18 00:00 UTC. The defaults are the same for the AWS Billing and Cost Management console and the API. You can change your start date with the UpdateBudget operation.
     */
    Start?: GenericTimestamp;
    /**
     * The end date for a budget. If you didn't specify an end date, AWS set your end date to 06/15/87 00:00 UTC. The defaults are the same for the AWS Billing and Cost Management console and the API. After the end date, AWS deletes the budget and all associated notifications and subscribers. You can change your end date with the UpdateBudget operation.
     */
    End?: GenericTimestamp;
  }
  export type TimeUnit = "DAILY"|"MONTHLY"|"QUARTERLY"|"ANNUALLY"|string;
  export type UnitValue = string;
  export interface UpdateBudgetActionRequest {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  A system-generated universally unique identifier (UUID) for the action. 
     */
    ActionId: ActionId;
    NotificationType?: NotificationType;
    ActionThreshold?: ActionThreshold;
    Definition?: Definition;
    /**
     *  The role passed for action execution and reversion. Roles and actions must be in the same account. 
     */
    ExecutionRoleArn?: RoleArn;
    /**
     *  This specifies if the action needs manual or automatic approval. 
     */
    ApprovalModel?: ApprovalModel;
    Subscribers?: Subscribers;
  }
  export interface UpdateBudgetActionResponse {
    AccountId: AccountId;
    BudgetName: BudgetName;
    /**
     *  The previous action resource information. 
     */
    OldAction: Action;
    /**
     *  The updated action resource information. 
     */
    NewAction: Action;
  }
  export interface UpdateBudgetRequest {
    /**
     * The accountId that is associated with the budget that you want to update.
     */
    AccountId: AccountId;
    /**
     * The budget that you want to update your budget to.
     */
    NewBudget: Budget;
  }
  export interface UpdateBudgetResponse {
  }
  export interface UpdateNotificationRequest {
    /**
     * The accountId that is associated with the budget whose notification you want to update.
     */
    AccountId: AccountId;
    /**
     * The name of the budget whose notification you want to update.
     */
    BudgetName: BudgetName;
    /**
     * The previous notification that is associated with a budget.
     */
    OldNotification: Notification;
    /**
     * The updated notification to be associated with a budget.
     */
    NewNotification: Notification;
  }
  export interface UpdateNotificationResponse {
  }
  export interface UpdateSubscriberRequest {
    /**
     * The accountId that is associated with the budget whose subscriber you want to update.
     */
    AccountId: AccountId;
    /**
     * The name of the budget whose subscriber you want to update.
     */
    BudgetName: BudgetName;
    /**
     * The notification whose subscriber you want to update.
     */
    Notification: Notification;
    /**
     * The previous subscriber that is associated with a budget notification.
     */
    OldSubscriber: Subscriber;
    /**
     * The updated subscriber that is associated with a budget notification.
     */
    NewSubscriber: Subscriber;
  }
  export interface UpdateSubscriberResponse {
  }
  export type User = string;
  export type Users = User[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-10-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Budgets client.
   */
  export import Types = Budgets;
}
export = Budgets;
