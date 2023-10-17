import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class GameLift extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: GameLift.Types.ClientConfiguration)
  config: Config & GameLift.Types.ClientConfiguration;
  /**
   * Registers a player's acceptance or rejection of a proposed FlexMatch match. A matchmaking configuration may require player acceptance; if so, then matches built with that configuration cannot be completed unless all players accept the proposed match within a specified time limit.  When FlexMatch builds a match, all the matchmaking tickets involved in the proposed match are placed into status REQUIRES_ACCEPTANCE. This is a trigger for your game to get acceptance from all players in each ticket. Calls to this action are only valid for tickets that are in this status; calls for tickets not in this status result in an error. To register acceptance, specify the ticket ID, one or more players, and an acceptance response. When all players have accepted, Amazon GameLift advances the matchmaking tickets to status PLACING, and attempts to create a new game session for the match.  If any player rejects the match, or if acceptances are not received before a specified timeout, the proposed match is dropped. Each matchmaking ticket in the failed match is handled as follows:    If the ticket has one or more players who rejected the match or failed to respond, the ticket status is set CANCELLED and processing is terminated.   If all players in the ticket accepted the match, the ticket status is returned to SEARCHING to find a new match.     Learn more    Add FlexMatch to a game client    FlexMatch events (reference)
   */
  acceptMatch(params: GameLift.Types.AcceptMatchInput, callback?: (err: AWSError, data: GameLift.Types.AcceptMatchOutput) => void): Request<GameLift.Types.AcceptMatchOutput, AWSError>;
  /**
   * Registers a player's acceptance or rejection of a proposed FlexMatch match. A matchmaking configuration may require player acceptance; if so, then matches built with that configuration cannot be completed unless all players accept the proposed match within a specified time limit.  When FlexMatch builds a match, all the matchmaking tickets involved in the proposed match are placed into status REQUIRES_ACCEPTANCE. This is a trigger for your game to get acceptance from all players in each ticket. Calls to this action are only valid for tickets that are in this status; calls for tickets not in this status result in an error. To register acceptance, specify the ticket ID, one or more players, and an acceptance response. When all players have accepted, Amazon GameLift advances the matchmaking tickets to status PLACING, and attempts to create a new game session for the match.  If any player rejects the match, or if acceptances are not received before a specified timeout, the proposed match is dropped. Each matchmaking ticket in the failed match is handled as follows:    If the ticket has one or more players who rejected the match or failed to respond, the ticket status is set CANCELLED and processing is terminated.   If all players in the ticket accepted the match, the ticket status is returned to SEARCHING to find a new match.     Learn more    Add FlexMatch to a game client    FlexMatch events (reference)
   */
  acceptMatch(callback?: (err: AWSError, data: GameLift.Types.AcceptMatchOutput) => void): Request<GameLift.Types.AcceptMatchOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Locates an available game server and temporarily reserves it to host gameplay and players. This operation is called from a game client or client service (such as a matchmaker) to request hosting resources for a new game session. In response, Amazon GameLift FleetIQ locates an available game server, places it in CLAIMED status for 60 seconds, and returns connection information that players can use to connect to the game server.  To claim a game server, identify a game server group. You can also specify a game server ID, although this approach bypasses Amazon GameLift FleetIQ placement optimization. Optionally, include game data to pass to the game server at the start of a game session, such as a game map or player information. Add filter options to further restrict how a game server is chosen, such as only allowing game servers on ACTIVE instances to be claimed. When a game server is successfully claimed, connection information is returned. A claimed game server's utilization status remains AVAILABLE while the claim status is set to CLAIMED for up to 60 seconds. This time period gives the game server time to update its status to UTILIZED after players join. If the game server's status is not updated within 60 seconds, the game server reverts to unclaimed status and is available to be claimed by another request. The claim time period is a fixed value and is not configurable. If you try to claim a specific game server, this request will fail in the following cases:   If the game server utilization status is UTILIZED.   If the game server claim status is CLAIMED.   If the game server is running on an instance in DRAINING status and the provided filter option does not allow placing on DRAINING instances.    Learn more   Amazon GameLift FleetIQ Guide 
   */
  claimGameServer(params: GameLift.Types.ClaimGameServerInput, callback?: (err: AWSError, data: GameLift.Types.ClaimGameServerOutput) => void): Request<GameLift.Types.ClaimGameServerOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Locates an available game server and temporarily reserves it to host gameplay and players. This operation is called from a game client or client service (such as a matchmaker) to request hosting resources for a new game session. In response, Amazon GameLift FleetIQ locates an available game server, places it in CLAIMED status for 60 seconds, and returns connection information that players can use to connect to the game server.  To claim a game server, identify a game server group. You can also specify a game server ID, although this approach bypasses Amazon GameLift FleetIQ placement optimization. Optionally, include game data to pass to the game server at the start of a game session, such as a game map or player information. Add filter options to further restrict how a game server is chosen, such as only allowing game servers on ACTIVE instances to be claimed. When a game server is successfully claimed, connection information is returned. A claimed game server's utilization status remains AVAILABLE while the claim status is set to CLAIMED for up to 60 seconds. This time period gives the game server time to update its status to UTILIZED after players join. If the game server's status is not updated within 60 seconds, the game server reverts to unclaimed status and is available to be claimed by another request. The claim time period is a fixed value and is not configurable. If you try to claim a specific game server, this request will fail in the following cases:   If the game server utilization status is UTILIZED.   If the game server claim status is CLAIMED.   If the game server is running on an instance in DRAINING status and the provided filter option does not allow placing on DRAINING instances.    Learn more   Amazon GameLift FleetIQ Guide 
   */
  claimGameServer(callback?: (err: AWSError, data: GameLift.Types.ClaimGameServerOutput) => void): Request<GameLift.Types.ClaimGameServerOutput, AWSError>;
  /**
   * Creates an alias for a fleet. In most situations, you can use an alias ID in place of a fleet ID. An alias provides a level of abstraction for a fleet that is useful when redirecting player traffic from one fleet to another, such as when updating your game build.  Amazon GameLift supports two types of routing strategies for aliases: simple and terminal. A simple alias points to an active fleet. A terminal alias is used to display messaging or link to a URL instead of routing players to an active fleet. For example, you might use a terminal alias when a game version is no longer supported and you want to direct players to an upgrade site.  To create a fleet alias, specify an alias name, routing strategy, and optional description. Each simple alias can point to only one fleet, but a fleet can have multiple aliases. If successful, a new alias record is returned, including an alias ID and an ARN. You can reassign an alias to another fleet by calling UpdateAlias.  Related actions   All APIs by task 
   */
  createAlias(params: GameLift.Types.CreateAliasInput, callback?: (err: AWSError, data: GameLift.Types.CreateAliasOutput) => void): Request<GameLift.Types.CreateAliasOutput, AWSError>;
  /**
   * Creates an alias for a fleet. In most situations, you can use an alias ID in place of a fleet ID. An alias provides a level of abstraction for a fleet that is useful when redirecting player traffic from one fleet to another, such as when updating your game build.  Amazon GameLift supports two types of routing strategies for aliases: simple and terminal. A simple alias points to an active fleet. A terminal alias is used to display messaging or link to a URL instead of routing players to an active fleet. For example, you might use a terminal alias when a game version is no longer supported and you want to direct players to an upgrade site.  To create a fleet alias, specify an alias name, routing strategy, and optional description. Each simple alias can point to only one fleet, but a fleet can have multiple aliases. If successful, a new alias record is returned, including an alias ID and an ARN. You can reassign an alias to another fleet by calling UpdateAlias.  Related actions   All APIs by task 
   */
  createAlias(callback?: (err: AWSError, data: GameLift.Types.CreateAliasOutput) => void): Request<GameLift.Types.CreateAliasOutput, AWSError>;
  /**
   * Creates a new Amazon GameLift build resource for your game server binary files. Combine game server binaries into a zip file for use with Amazon GameLift.   When setting up a new game build for Amazon GameLift, we recommend using the CLI command  upload-build . This helper command combines two tasks: (1) it uploads your build files from a file directory to an Amazon GameLift Amazon S3 location, and (2) it creates a new build resource.  You can use the CreateBuild operation in the following scenarios:   Create a new game build with build files that are in an Amazon S3 location under an Amazon Web Services account that you control. To use this option, you give Amazon GameLift access to the Amazon S3 bucket. With permissions in place, specify a build name, operating system, and the Amazon S3 storage location of your game build.   Upload your build files to a Amazon GameLift Amazon S3 location. To use this option, specify a build name and operating system. This operation creates a new build resource and also returns an Amazon S3 location with temporary access credentials. Use the credentials to manually upload your build files to the specified Amazon S3 location. For more information, see Uploading Objects in the Amazon S3 Developer Guide. After you upload build files to the Amazon GameLift Amazon S3 location, you can't update them.    If successful, this operation creates a new build resource with a unique build ID and places it in INITIALIZED status. A build must be in READY status before you can create fleets with it.  Learn more   Uploading Your Game    Create a Build with Files in Amazon S3   All APIs by task 
   */
  createBuild(params: GameLift.Types.CreateBuildInput, callback?: (err: AWSError, data: GameLift.Types.CreateBuildOutput) => void): Request<GameLift.Types.CreateBuildOutput, AWSError>;
  /**
   * Creates a new Amazon GameLift build resource for your game server binary files. Combine game server binaries into a zip file for use with Amazon GameLift.   When setting up a new game build for Amazon GameLift, we recommend using the CLI command  upload-build . This helper command combines two tasks: (1) it uploads your build files from a file directory to an Amazon GameLift Amazon S3 location, and (2) it creates a new build resource.  You can use the CreateBuild operation in the following scenarios:   Create a new game build with build files that are in an Amazon S3 location under an Amazon Web Services account that you control. To use this option, you give Amazon GameLift access to the Amazon S3 bucket. With permissions in place, specify a build name, operating system, and the Amazon S3 storage location of your game build.   Upload your build files to a Amazon GameLift Amazon S3 location. To use this option, specify a build name and operating system. This operation creates a new build resource and also returns an Amazon S3 location with temporary access credentials. Use the credentials to manually upload your build files to the specified Amazon S3 location. For more information, see Uploading Objects in the Amazon S3 Developer Guide. After you upload build files to the Amazon GameLift Amazon S3 location, you can't update them.    If successful, this operation creates a new build resource with a unique build ID and places it in INITIALIZED status. A build must be in READY status before you can create fleets with it.  Learn more   Uploading Your Game    Create a Build with Files in Amazon S3   All APIs by task 
   */
  createBuild(callback?: (err: AWSError, data: GameLift.Types.CreateBuildOutput) => void): Request<GameLift.Types.CreateBuildOutput, AWSError>;
  /**
   * Creates a fleet of Amazon Elastic Compute Cloud (Amazon EC2) instances to host your custom game server or Realtime Servers. Use this operation to configure the computing resources for your fleet and provide instructions for running game servers on each instance. Most Amazon GameLift fleets can deploy instances to multiple locations, including the home Region (where the fleet is created) and an optional set of remote locations. Fleets that are created in the following Amazon Web Services Regions support multiple locations: us-east-1 (N. Virginia), us-west-2 (Oregon), eu-central-1 (Frankfurt), eu-west-1 (Ireland), ap-southeast-2 (Sydney), ap-northeast-1 (Tokyo), and ap-northeast-2 (Seoul). Fleets that are created in other Amazon GameLift Regions can deploy instances in the fleet's home Region only. All fleet instances use the same configuration regardless of location; however, you can adjust capacity settings and turn auto-scaling on/off for each location. To create a fleet, choose the hardware for your instances, specify a game server build or Realtime script to deploy, and provide a runtime configuration to direct Amazon GameLift how to start and run game servers on each instance in the fleet. Set permissions for inbound traffic to your game servers, and enable optional features as needed. When creating a multi-location fleet, provide a list of additional remote locations. If you need to debug your fleet, fetch logs, view performance metrics or other actions on the fleet, create the development fleet with port 22/3389 open. As a best practice, we recommend opening ports for remote access only when you need them and closing them when you're finished.  If successful, this operation creates a new Fleet resource and places it in NEW status, which prompts Amazon GameLift to initiate the fleet creation workflow.  Learn more   Setting up fleets   Debug fleet creation issues   Multi-location fleets 
   */
  createFleet(params: GameLift.Types.CreateFleetInput, callback?: (err: AWSError, data: GameLift.Types.CreateFleetOutput) => void): Request<GameLift.Types.CreateFleetOutput, AWSError>;
  /**
   * Creates a fleet of Amazon Elastic Compute Cloud (Amazon EC2) instances to host your custom game server or Realtime Servers. Use this operation to configure the computing resources for your fleet and provide instructions for running game servers on each instance. Most Amazon GameLift fleets can deploy instances to multiple locations, including the home Region (where the fleet is created) and an optional set of remote locations. Fleets that are created in the following Amazon Web Services Regions support multiple locations: us-east-1 (N. Virginia), us-west-2 (Oregon), eu-central-1 (Frankfurt), eu-west-1 (Ireland), ap-southeast-2 (Sydney), ap-northeast-1 (Tokyo), and ap-northeast-2 (Seoul). Fleets that are created in other Amazon GameLift Regions can deploy instances in the fleet's home Region only. All fleet instances use the same configuration regardless of location; however, you can adjust capacity settings and turn auto-scaling on/off for each location. To create a fleet, choose the hardware for your instances, specify a game server build or Realtime script to deploy, and provide a runtime configuration to direct Amazon GameLift how to start and run game servers on each instance in the fleet. Set permissions for inbound traffic to your game servers, and enable optional features as needed. When creating a multi-location fleet, provide a list of additional remote locations. If you need to debug your fleet, fetch logs, view performance metrics or other actions on the fleet, create the development fleet with port 22/3389 open. As a best practice, we recommend opening ports for remote access only when you need them and closing them when you're finished.  If successful, this operation creates a new Fleet resource and places it in NEW status, which prompts Amazon GameLift to initiate the fleet creation workflow.  Learn more   Setting up fleets   Debug fleet creation issues   Multi-location fleets 
   */
  createFleet(callback?: (err: AWSError, data: GameLift.Types.CreateFleetOutput) => void): Request<GameLift.Types.CreateFleetOutput, AWSError>;
  /**
   * Adds remote locations to a fleet and begins populating the new locations with EC2 instances. The new instances conform to the fleet's instance type, auto-scaling, and other configuration settings.   This operation cannot be used with fleets that don't support remote locations. Fleets can have multiple locations only if they reside in Amazon Web Services Regions that support this feature and were created after the feature was released in March 2021.  To add fleet locations, specify the fleet to be updated and provide a list of one or more locations.  If successful, this operation returns the list of added locations with their status set to NEW. Amazon GameLift initiates the process of starting an instance in each added location. You can track the status of each new location by monitoring location creation events using DescribeFleetEvents.  Learn more   Setting up fleets   Multi-location fleets 
   */
  createFleetLocations(params: GameLift.Types.CreateFleetLocationsInput, callback?: (err: AWSError, data: GameLift.Types.CreateFleetLocationsOutput) => void): Request<GameLift.Types.CreateFleetLocationsOutput, AWSError>;
  /**
   * Adds remote locations to a fleet and begins populating the new locations with EC2 instances. The new instances conform to the fleet's instance type, auto-scaling, and other configuration settings.   This operation cannot be used with fleets that don't support remote locations. Fleets can have multiple locations only if they reside in Amazon Web Services Regions that support this feature and were created after the feature was released in March 2021.  To add fleet locations, specify the fleet to be updated and provide a list of one or more locations.  If successful, this operation returns the list of added locations with their status set to NEW. Amazon GameLift initiates the process of starting an instance in each added location. You can track the status of each new location by monitoring location creation events using DescribeFleetEvents.  Learn more   Setting up fleets   Multi-location fleets 
   */
  createFleetLocations(callback?: (err: AWSError, data: GameLift.Types.CreateFleetLocationsOutput) => void): Request<GameLift.Types.CreateFleetLocationsOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Creates a Amazon GameLift FleetIQ game server group for managing game hosting on a collection of Amazon Elastic Compute Cloud instances for game hosting. This operation creates the game server group, creates an Auto Scaling group in your Amazon Web Services account, and establishes a link between the two groups. You can view the status of your game server groups in the Amazon GameLift console. Game server group metrics and events are emitted to Amazon CloudWatch. Before creating a new game server group, you must have the following:    An Amazon Elastic Compute Cloud launch template that specifies how to launch Amazon Elastic Compute Cloud instances with your game server build. For more information, see  Launching an Instance from a Launch Template in the Amazon Elastic Compute Cloud User Guide.    An IAM role that extends limited access to your Amazon Web Services account to allow Amazon GameLift FleetIQ to create and interact with the Auto Scaling group. For more information, see Create IAM roles for cross-service interaction in the Amazon GameLift FleetIQ Developer Guide.   To create a new game server group, specify a unique group name, IAM role and Amazon Elastic Compute Cloud launch template, and provide a list of instance types that can be used in the group. You must also set initial maximum and minimum limits on the group's instance count. You can optionally set an Auto Scaling policy with target tracking based on a Amazon GameLift FleetIQ metric. Once the game server group and corresponding Auto Scaling group are created, you have full access to change the Auto Scaling group's configuration as needed. Several properties that are set when creating a game server group, including maximum/minimum size and auto-scaling policy settings, must be updated directly in the Auto Scaling group. Keep in mind that some Auto Scaling group properties are periodically updated by Amazon GameLift FleetIQ as part of its balancing activities to optimize for availability and cost.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  createGameServerGroup(params: GameLift.Types.CreateGameServerGroupInput, callback?: (err: AWSError, data: GameLift.Types.CreateGameServerGroupOutput) => void): Request<GameLift.Types.CreateGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Creates a Amazon GameLift FleetIQ game server group for managing game hosting on a collection of Amazon Elastic Compute Cloud instances for game hosting. This operation creates the game server group, creates an Auto Scaling group in your Amazon Web Services account, and establishes a link between the two groups. You can view the status of your game server groups in the Amazon GameLift console. Game server group metrics and events are emitted to Amazon CloudWatch. Before creating a new game server group, you must have the following:    An Amazon Elastic Compute Cloud launch template that specifies how to launch Amazon Elastic Compute Cloud instances with your game server build. For more information, see  Launching an Instance from a Launch Template in the Amazon Elastic Compute Cloud User Guide.    An IAM role that extends limited access to your Amazon Web Services account to allow Amazon GameLift FleetIQ to create and interact with the Auto Scaling group. For more information, see Create IAM roles for cross-service interaction in the Amazon GameLift FleetIQ Developer Guide.   To create a new game server group, specify a unique group name, IAM role and Amazon Elastic Compute Cloud launch template, and provide a list of instance types that can be used in the group. You must also set initial maximum and minimum limits on the group's instance count. You can optionally set an Auto Scaling policy with target tracking based on a Amazon GameLift FleetIQ metric. Once the game server group and corresponding Auto Scaling group are created, you have full access to change the Auto Scaling group's configuration as needed. Several properties that are set when creating a game server group, including maximum/minimum size and auto-scaling policy settings, must be updated directly in the Auto Scaling group. Keep in mind that some Auto Scaling group properties are periodically updated by Amazon GameLift FleetIQ as part of its balancing activities to optimize for availability and cost.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  createGameServerGroup(callback?: (err: AWSError, data: GameLift.Types.CreateGameServerGroupOutput) => void): Request<GameLift.Types.CreateGameServerGroupOutput, AWSError>;
  /**
   * Creates a multiplayer game session for players in a specific fleet location. This operation prompts an available server process to start a game session and retrieves connection information for the new game session. As an alternative, consider using the Amazon GameLift game session placement feature with StartGameSessionPlacement , which uses the FleetIQ algorithm and queues to optimize the placement process. When creating a game session, you specify exactly where you want to place it and provide a set of game session configuration settings. The target fleet must be in ACTIVE status.  You can use this operation in the following ways:    To create a game session on an instance in a fleet's home Region, provide a fleet or alias ID along with your game session configuration.    To create a game session on an instance in a fleet's remote location, provide a fleet or alias ID and a location name, along with your game session configuration.    To create a game session on an instance in an Anywhere fleet, specify the fleet's custom location.   If successful, Amazon GameLift initiates a workflow to start a new game session and returns a GameSession object containing the game session configuration and status. When the game session status is ACTIVE, it is updated with connection information and you can create player sessions for the game session. By default, newly created game sessions are open to new players. You can restrict new player access by using UpdateGameSession to change the game session's player session creation policy. Amazon GameLift retains logs for active for 14 days. To access the logs, call GetGameSessionLogUrl to download the log files.  Available in Amazon GameLift Local.   Learn more   Start a game session   All APIs by task 
   */
  createGameSession(params: GameLift.Types.CreateGameSessionInput, callback?: (err: AWSError, data: GameLift.Types.CreateGameSessionOutput) => void): Request<GameLift.Types.CreateGameSessionOutput, AWSError>;
  /**
   * Creates a multiplayer game session for players in a specific fleet location. This operation prompts an available server process to start a game session and retrieves connection information for the new game session. As an alternative, consider using the Amazon GameLift game session placement feature with StartGameSessionPlacement , which uses the FleetIQ algorithm and queues to optimize the placement process. When creating a game session, you specify exactly where you want to place it and provide a set of game session configuration settings. The target fleet must be in ACTIVE status.  You can use this operation in the following ways:    To create a game session on an instance in a fleet's home Region, provide a fleet or alias ID along with your game session configuration.    To create a game session on an instance in a fleet's remote location, provide a fleet or alias ID and a location name, along with your game session configuration.    To create a game session on an instance in an Anywhere fleet, specify the fleet's custom location.   If successful, Amazon GameLift initiates a workflow to start a new game session and returns a GameSession object containing the game session configuration and status. When the game session status is ACTIVE, it is updated with connection information and you can create player sessions for the game session. By default, newly created game sessions are open to new players. You can restrict new player access by using UpdateGameSession to change the game session's player session creation policy. Amazon GameLift retains logs for active for 14 days. To access the logs, call GetGameSessionLogUrl to download the log files.  Available in Amazon GameLift Local.   Learn more   Start a game session   All APIs by task 
   */
  createGameSession(callback?: (err: AWSError, data: GameLift.Types.CreateGameSessionOutput) => void): Request<GameLift.Types.CreateGameSessionOutput, AWSError>;
  /**
   * Creates a placement queue that processes requests for new game sessions. A queue uses FleetIQ algorithms to determine the best placement locations and find an available game server there, then prompts the game server process to start a new game session.  A game session queue is configured with a set of destinations (Amazon GameLift fleets or aliases), which determine the locations where the queue can place new game sessions. These destinations can span multiple fleet types (Spot and On-Demand), instance types, and Amazon Web Services Regions. If the queue includes multi-location fleets, the queue is able to place game sessions in all of a fleet's remote locations. You can opt to filter out individual locations if needed. The queue configuration also determines how FleetIQ selects the best available placement for a new game session. Before searching for an available game server, FleetIQ first prioritizes the queue's destinations and locations, with the best placement locations on top. You can set up the queue to use the FleetIQ default prioritization or provide an alternate set of priorities. To create a new queue, provide a name, timeout value, and a list of destinations. Optionally, specify a sort configuration and/or a filter, and define a set of latency cap policies. You can also include the ARN for an Amazon Simple Notification Service (SNS) topic to receive notifications of game session placement activity. Notifications using SNS or CloudWatch events is the preferred way to track placement activity. If successful, a new GameSessionQueue object is returned with an assigned queue ARN. New game session requests, which are submitted to queue with StartGameSessionPlacement or StartMatchmaking, reference a queue's name or ARN.   Learn more    Design a game session queue    Create a game session queue   Related actions   CreateGameSessionQueue | DescribeGameSessionQueues | UpdateGameSessionQueue | DeleteGameSessionQueue | All APIs by task 
   */
  createGameSessionQueue(params: GameLift.Types.CreateGameSessionQueueInput, callback?: (err: AWSError, data: GameLift.Types.CreateGameSessionQueueOutput) => void): Request<GameLift.Types.CreateGameSessionQueueOutput, AWSError>;
  /**
   * Creates a placement queue that processes requests for new game sessions. A queue uses FleetIQ algorithms to determine the best placement locations and find an available game server there, then prompts the game server process to start a new game session.  A game session queue is configured with a set of destinations (Amazon GameLift fleets or aliases), which determine the locations where the queue can place new game sessions. These destinations can span multiple fleet types (Spot and On-Demand), instance types, and Amazon Web Services Regions. If the queue includes multi-location fleets, the queue is able to place game sessions in all of a fleet's remote locations. You can opt to filter out individual locations if needed. The queue configuration also determines how FleetIQ selects the best available placement for a new game session. Before searching for an available game server, FleetIQ first prioritizes the queue's destinations and locations, with the best placement locations on top. You can set up the queue to use the FleetIQ default prioritization or provide an alternate set of priorities. To create a new queue, provide a name, timeout value, and a list of destinations. Optionally, specify a sort configuration and/or a filter, and define a set of latency cap policies. You can also include the ARN for an Amazon Simple Notification Service (SNS) topic to receive notifications of game session placement activity. Notifications using SNS or CloudWatch events is the preferred way to track placement activity. If successful, a new GameSessionQueue object is returned with an assigned queue ARN. New game session requests, which are submitted to queue with StartGameSessionPlacement or StartMatchmaking, reference a queue's name or ARN.   Learn more    Design a game session queue    Create a game session queue   Related actions   CreateGameSessionQueue | DescribeGameSessionQueues | UpdateGameSessionQueue | DeleteGameSessionQueue | All APIs by task 
   */
  createGameSessionQueue(callback?: (err: AWSError, data: GameLift.Types.CreateGameSessionQueueOutput) => void): Request<GameLift.Types.CreateGameSessionQueueOutput, AWSError>;
  /**
   * Creates a custom location for use in an Anywhere fleet.
   */
  createLocation(params: GameLift.Types.CreateLocationInput, callback?: (err: AWSError, data: GameLift.Types.CreateLocationOutput) => void): Request<GameLift.Types.CreateLocationOutput, AWSError>;
  /**
   * Creates a custom location for use in an Anywhere fleet.
   */
  createLocation(callback?: (err: AWSError, data: GameLift.Types.CreateLocationOutput) => void): Request<GameLift.Types.CreateLocationOutput, AWSError>;
  /**
   * Defines a new matchmaking configuration for use with FlexMatch. Whether your are using FlexMatch with Amazon GameLift hosting or as a standalone matchmaking service, the matchmaking configuration sets out rules for matching players and forming teams. If you're also using Amazon GameLift hosting, it defines how to start game sessions for each match. Your matchmaking system can use multiple configurations to handle different game scenarios. All matchmaking requests identify the matchmaking configuration to use and provide player attributes consistent with that configuration.  To create a matchmaking configuration, you must provide the following: configuration name and FlexMatch mode (with or without Amazon GameLift hosting); a rule set that specifies how to evaluate players and find acceptable matches; whether player acceptance is required; and the maximum time allowed for a matchmaking attempt. When using FlexMatch with Amazon GameLift hosting, you also need to identify the game session queue to use when starting a game session for the match. In addition, you must set up an Amazon Simple Notification Service topic to receive matchmaking notifications. Provide the topic ARN in the matchmaking configuration.  Learn more    Design a FlexMatch matchmaker    Set up FlexMatch event notification 
   */
  createMatchmakingConfiguration(params: GameLift.Types.CreateMatchmakingConfigurationInput, callback?: (err: AWSError, data: GameLift.Types.CreateMatchmakingConfigurationOutput) => void): Request<GameLift.Types.CreateMatchmakingConfigurationOutput, AWSError>;
  /**
   * Defines a new matchmaking configuration for use with FlexMatch. Whether your are using FlexMatch with Amazon GameLift hosting or as a standalone matchmaking service, the matchmaking configuration sets out rules for matching players and forming teams. If you're also using Amazon GameLift hosting, it defines how to start game sessions for each match. Your matchmaking system can use multiple configurations to handle different game scenarios. All matchmaking requests identify the matchmaking configuration to use and provide player attributes consistent with that configuration.  To create a matchmaking configuration, you must provide the following: configuration name and FlexMatch mode (with or without Amazon GameLift hosting); a rule set that specifies how to evaluate players and find acceptable matches; whether player acceptance is required; and the maximum time allowed for a matchmaking attempt. When using FlexMatch with Amazon GameLift hosting, you also need to identify the game session queue to use when starting a game session for the match. In addition, you must set up an Amazon Simple Notification Service topic to receive matchmaking notifications. Provide the topic ARN in the matchmaking configuration.  Learn more    Design a FlexMatch matchmaker    Set up FlexMatch event notification 
   */
  createMatchmakingConfiguration(callback?: (err: AWSError, data: GameLift.Types.CreateMatchmakingConfigurationOutput) => void): Request<GameLift.Types.CreateMatchmakingConfigurationOutput, AWSError>;
  /**
   * Creates a new rule set for FlexMatch matchmaking. A rule set describes the type of match to create, such as the number and size of teams. It also sets the parameters for acceptable player matches, such as minimum skill level or character type. To create a matchmaking rule set, provide unique rule set name and the rule set body in JSON format. Rule sets must be defined in the same Region as the matchmaking configuration they are used with. Since matchmaking rule sets cannot be edited, it is a good idea to check the rule set syntax using ValidateMatchmakingRuleSet before creating a new rule set.  Learn more     Build a rule set     Design a matchmaker     Matchmaking with FlexMatch   
   */
  createMatchmakingRuleSet(params: GameLift.Types.CreateMatchmakingRuleSetInput, callback?: (err: AWSError, data: GameLift.Types.CreateMatchmakingRuleSetOutput) => void): Request<GameLift.Types.CreateMatchmakingRuleSetOutput, AWSError>;
  /**
   * Creates a new rule set for FlexMatch matchmaking. A rule set describes the type of match to create, such as the number and size of teams. It also sets the parameters for acceptable player matches, such as minimum skill level or character type. To create a matchmaking rule set, provide unique rule set name and the rule set body in JSON format. Rule sets must be defined in the same Region as the matchmaking configuration they are used with. Since matchmaking rule sets cannot be edited, it is a good idea to check the rule set syntax using ValidateMatchmakingRuleSet before creating a new rule set.  Learn more     Build a rule set     Design a matchmaker     Matchmaking with FlexMatch   
   */
  createMatchmakingRuleSet(callback?: (err: AWSError, data: GameLift.Types.CreateMatchmakingRuleSetOutput) => void): Request<GameLift.Types.CreateMatchmakingRuleSetOutput, AWSError>;
  /**
   * Reserves an open player slot in a game session for a player. New player sessions can be created in any game session with an open slot that is in ACTIVE status and has a player creation policy of ACCEPT_ALL. You can add a group of players to a game session with CreatePlayerSessions .  To create a player session, specify a game session ID, player ID, and optionally a set of player data.  If successful, a slot is reserved in the game session for the player and a new PlayerSessions object is returned with a player session ID. The player references the player session ID when sending a connection request to the game session, and the game server can use it to validate the player reservation with the Amazon GameLift service. Player sessions cannot be updated.  The maximum number of players per game session is 200. It is not adjustable.   Related actions   All APIs by task 
   */
  createPlayerSession(params: GameLift.Types.CreatePlayerSessionInput, callback?: (err: AWSError, data: GameLift.Types.CreatePlayerSessionOutput) => void): Request<GameLift.Types.CreatePlayerSessionOutput, AWSError>;
  /**
   * Reserves an open player slot in a game session for a player. New player sessions can be created in any game session with an open slot that is in ACTIVE status and has a player creation policy of ACCEPT_ALL. You can add a group of players to a game session with CreatePlayerSessions .  To create a player session, specify a game session ID, player ID, and optionally a set of player data.  If successful, a slot is reserved in the game session for the player and a new PlayerSessions object is returned with a player session ID. The player references the player session ID when sending a connection request to the game session, and the game server can use it to validate the player reservation with the Amazon GameLift service. Player sessions cannot be updated.  The maximum number of players per game session is 200. It is not adjustable.   Related actions   All APIs by task 
   */
  createPlayerSession(callback?: (err: AWSError, data: GameLift.Types.CreatePlayerSessionOutput) => void): Request<GameLift.Types.CreatePlayerSessionOutput, AWSError>;
  /**
   * Reserves open slots in a game session for a group of players. New player sessions can be created in any game session with an open slot that is in ACTIVE status and has a player creation policy of ACCEPT_ALL. To add a single player to a game session, use CreatePlayerSession  To create player sessions, specify a game session ID and a list of player IDs. Optionally, provide a set of player data for each player ID.  If successful, a slot is reserved in the game session for each player, and new PlayerSession objects are returned with player session IDs. Each player references their player session ID when sending a connection request to the game session, and the game server can use it to validate the player reservation with the Amazon GameLift service. Player sessions cannot be updated. The maximum number of players per game session is 200. It is not adjustable.   Related actions   All APIs by task 
   */
  createPlayerSessions(params: GameLift.Types.CreatePlayerSessionsInput, callback?: (err: AWSError, data: GameLift.Types.CreatePlayerSessionsOutput) => void): Request<GameLift.Types.CreatePlayerSessionsOutput, AWSError>;
  /**
   * Reserves open slots in a game session for a group of players. New player sessions can be created in any game session with an open slot that is in ACTIVE status and has a player creation policy of ACCEPT_ALL. To add a single player to a game session, use CreatePlayerSession  To create player sessions, specify a game session ID and a list of player IDs. Optionally, provide a set of player data for each player ID.  If successful, a slot is reserved in the game session for each player, and new PlayerSession objects are returned with player session IDs. Each player references their player session ID when sending a connection request to the game session, and the game server can use it to validate the player reservation with the Amazon GameLift service. Player sessions cannot be updated. The maximum number of players per game session is 200. It is not adjustable.   Related actions   All APIs by task 
   */
  createPlayerSessions(callback?: (err: AWSError, data: GameLift.Types.CreatePlayerSessionsOutput) => void): Request<GameLift.Types.CreatePlayerSessionsOutput, AWSError>;
  /**
   * Creates a new script record for your Realtime Servers script. Realtime scripts are JavaScript that provide configuration settings and optional custom game logic for your game. The script is deployed when you create a Realtime Servers fleet to host your game sessions. Script logic is executed during an active game session.  To create a new script record, specify a script name and provide the script file(s). The script files and all dependencies must be zipped into a single file. You can pull the zip file from either of these locations:    A locally available directory. Use the ZipFile parameter for this option.   An Amazon Simple Storage Service (Amazon S3) bucket under your Amazon Web Services account. Use the StorageLocation parameter for this option. You'll need to have an Identity Access Management (IAM) role that allows the Amazon GameLift service to access your S3 bucket.    If the call is successful, a new script record is created with a unique script ID. If the script file is provided as a local file, the file is uploaded to an Amazon GameLift-owned S3 bucket and the script record's storage location reflects this location. If the script file is provided as an S3 bucket, Amazon GameLift accesses the file at this storage location as needed for deployment.  Learn more   Amazon GameLift Realtime Servers   Set Up a Role for Amazon GameLift Access   Related actions   All APIs by task 
   */
  createScript(params: GameLift.Types.CreateScriptInput, callback?: (err: AWSError, data: GameLift.Types.CreateScriptOutput) => void): Request<GameLift.Types.CreateScriptOutput, AWSError>;
  /**
   * Creates a new script record for your Realtime Servers script. Realtime scripts are JavaScript that provide configuration settings and optional custom game logic for your game. The script is deployed when you create a Realtime Servers fleet to host your game sessions. Script logic is executed during an active game session.  To create a new script record, specify a script name and provide the script file(s). The script files and all dependencies must be zipped into a single file. You can pull the zip file from either of these locations:    A locally available directory. Use the ZipFile parameter for this option.   An Amazon Simple Storage Service (Amazon S3) bucket under your Amazon Web Services account. Use the StorageLocation parameter for this option. You'll need to have an Identity Access Management (IAM) role that allows the Amazon GameLift service to access your S3 bucket.    If the call is successful, a new script record is created with a unique script ID. If the script file is provided as a local file, the file is uploaded to an Amazon GameLift-owned S3 bucket and the script record's storage location reflects this location. If the script file is provided as an S3 bucket, Amazon GameLift accesses the file at this storage location as needed for deployment.  Learn more   Amazon GameLift Realtime Servers   Set Up a Role for Amazon GameLift Access   Related actions   All APIs by task 
   */
  createScript(callback?: (err: AWSError, data: GameLift.Types.CreateScriptOutput) => void): Request<GameLift.Types.CreateScriptOutput, AWSError>;
  /**
   * Requests authorization to create or delete a peer connection between the VPC for your Amazon GameLift fleet and a virtual private cloud (VPC) in your Amazon Web Services account. VPC peering enables the game servers on your fleet to communicate directly with other Amazon Web Services resources. After you've received authorization, use CreateVpcPeeringConnection to establish the peering connection. For more information, see VPC Peering with Amazon GameLift Fleets. You can peer with VPCs that are owned by any Amazon Web Services account you have access to, including the account that you use to manage your Amazon GameLift fleets. You cannot peer with VPCs that are in different Regions. To request authorization to create a connection, call this operation from the Amazon Web Services account with the VPC that you want to peer to your Amazon GameLift fleet. For example, to enable your game servers to retrieve data from a DynamoDB table, use the account that manages that DynamoDB resource. Identify the following values: (1) The ID of the VPC that you want to peer with, and (2) the ID of the Amazon Web Services account that you use to manage Amazon GameLift. If successful, VPC peering is authorized for the specified VPC.  To request authorization to delete a connection, call this operation from the Amazon Web Services account with the VPC that is peered with your Amazon GameLift fleet. Identify the following values: (1) VPC ID that you want to delete the peering connection for, and (2) ID of the Amazon Web Services account that you use to manage Amazon GameLift.  The authorization remains valid for 24 hours unless it is canceled. You must create or delete the peering connection while the authorization is valid.   Related actions   All APIs by task 
   */
  createVpcPeeringAuthorization(params: GameLift.Types.CreateVpcPeeringAuthorizationInput, callback?: (err: AWSError, data: GameLift.Types.CreateVpcPeeringAuthorizationOutput) => void): Request<GameLift.Types.CreateVpcPeeringAuthorizationOutput, AWSError>;
  /**
   * Requests authorization to create or delete a peer connection between the VPC for your Amazon GameLift fleet and a virtual private cloud (VPC) in your Amazon Web Services account. VPC peering enables the game servers on your fleet to communicate directly with other Amazon Web Services resources. After you've received authorization, use CreateVpcPeeringConnection to establish the peering connection. For more information, see VPC Peering with Amazon GameLift Fleets. You can peer with VPCs that are owned by any Amazon Web Services account you have access to, including the account that you use to manage your Amazon GameLift fleets. You cannot peer with VPCs that are in different Regions. To request authorization to create a connection, call this operation from the Amazon Web Services account with the VPC that you want to peer to your Amazon GameLift fleet. For example, to enable your game servers to retrieve data from a DynamoDB table, use the account that manages that DynamoDB resource. Identify the following values: (1) The ID of the VPC that you want to peer with, and (2) the ID of the Amazon Web Services account that you use to manage Amazon GameLift. If successful, VPC peering is authorized for the specified VPC.  To request authorization to delete a connection, call this operation from the Amazon Web Services account with the VPC that is peered with your Amazon GameLift fleet. Identify the following values: (1) VPC ID that you want to delete the peering connection for, and (2) ID of the Amazon Web Services account that you use to manage Amazon GameLift.  The authorization remains valid for 24 hours unless it is canceled. You must create or delete the peering connection while the authorization is valid.   Related actions   All APIs by task 
   */
  createVpcPeeringAuthorization(callback?: (err: AWSError, data: GameLift.Types.CreateVpcPeeringAuthorizationOutput) => void): Request<GameLift.Types.CreateVpcPeeringAuthorizationOutput, AWSError>;
  /**
   * Establishes a VPC peering connection between a virtual private cloud (VPC) in an Amazon Web Services account with the VPC for your Amazon GameLift fleet. VPC peering enables the game servers on your fleet to communicate directly with other Amazon Web Services resources. You can peer with VPCs in any Amazon Web Services account that you have access to, including the account that you use to manage your Amazon GameLift fleets. You cannot peer with VPCs that are in different Regions. For more information, see VPC Peering with Amazon GameLift Fleets. Before calling this operation to establish the peering connection, you first need to use CreateVpcPeeringAuthorization and identify the VPC you want to peer with. Once the authorization for the specified VPC is issued, you have 24 hours to establish the connection. These two operations handle all tasks necessary to peer the two VPCs, including acceptance, updating routing tables, etc.  To establish the connection, call this operation from the Amazon Web Services account that is used to manage the Amazon GameLift fleets. Identify the following values: (1) The ID of the fleet you want to be enable a VPC peering connection for; (2) The Amazon Web Services account with the VPC that you want to peer with; and (3) The ID of the VPC you want to peer with. This operation is asynchronous. If successful, a connection request is created. You can use continuous polling to track the request's status using DescribeVpcPeeringConnections , or by monitoring fleet events for success or failure using DescribeFleetEvents .   Related actions   All APIs by task 
   */
  createVpcPeeringConnection(params: GameLift.Types.CreateVpcPeeringConnectionInput, callback?: (err: AWSError, data: GameLift.Types.CreateVpcPeeringConnectionOutput) => void): Request<GameLift.Types.CreateVpcPeeringConnectionOutput, AWSError>;
  /**
   * Establishes a VPC peering connection between a virtual private cloud (VPC) in an Amazon Web Services account with the VPC for your Amazon GameLift fleet. VPC peering enables the game servers on your fleet to communicate directly with other Amazon Web Services resources. You can peer with VPCs in any Amazon Web Services account that you have access to, including the account that you use to manage your Amazon GameLift fleets. You cannot peer with VPCs that are in different Regions. For more information, see VPC Peering with Amazon GameLift Fleets. Before calling this operation to establish the peering connection, you first need to use CreateVpcPeeringAuthorization and identify the VPC you want to peer with. Once the authorization for the specified VPC is issued, you have 24 hours to establish the connection. These two operations handle all tasks necessary to peer the two VPCs, including acceptance, updating routing tables, etc.  To establish the connection, call this operation from the Amazon Web Services account that is used to manage the Amazon GameLift fleets. Identify the following values: (1) The ID of the fleet you want to be enable a VPC peering connection for; (2) The Amazon Web Services account with the VPC that you want to peer with; and (3) The ID of the VPC you want to peer with. This operation is asynchronous. If successful, a connection request is created. You can use continuous polling to track the request's status using DescribeVpcPeeringConnections , or by monitoring fleet events for success or failure using DescribeFleetEvents .   Related actions   All APIs by task 
   */
  createVpcPeeringConnection(callback?: (err: AWSError, data: GameLift.Types.CreateVpcPeeringConnectionOutput) => void): Request<GameLift.Types.CreateVpcPeeringConnectionOutput, AWSError>;
  /**
   * Deletes an alias. This operation removes all record of the alias. Game clients attempting to access a server process using the deleted alias receive an error. To delete an alias, specify the alias ID to be deleted.  Related actions   All APIs by task 
   */
  deleteAlias(params: GameLift.Types.DeleteAliasInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an alias. This operation removes all record of the alias. Game clients attempting to access a server process using the deleted alias receive an error. To delete an alias, specify the alias ID to be deleted.  Related actions   All APIs by task 
   */
  deleteAlias(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a build. This operation permanently deletes the build resource and any uploaded build files. Deleting a build does not affect the status of any active fleets using the build, but you can no longer create new fleets with the deleted build. To delete a build, specify the build ID.   Learn more    Upload a Custom Server Build   All APIs by task 
   */
  deleteBuild(params: GameLift.Types.DeleteBuildInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a build. This operation permanently deletes the build resource and any uploaded build files. Deleting a build does not affect the status of any active fleets using the build, but you can no longer create new fleets with the deleted build. To delete a build, specify the build ID.   Learn more    Upload a Custom Server Build   All APIs by task 
   */
  deleteBuild(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes all resources and information related a fleet. Any current fleet instances, including those in remote locations, are shut down. You don't need to call DeleteFleetLocations separately.  If the fleet being deleted has a VPC peering connection, you first need to get a valid authorization (good for 24 hours) by calling CreateVpcPeeringAuthorization. You do not need to explicitly delete the VPC peering connection.  To delete a fleet, specify the fleet ID to be terminated. During the deletion process the fleet status is changed to DELETING. When completed, the status switches to TERMINATED and the fleet event FLEET_DELETED is sent.  Learn more   Setting up Amazon GameLift Fleets 
   */
  deleteFleet(params: GameLift.Types.DeleteFleetInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes all resources and information related a fleet. Any current fleet instances, including those in remote locations, are shut down. You don't need to call DeleteFleetLocations separately.  If the fleet being deleted has a VPC peering connection, you first need to get a valid authorization (good for 24 hours) by calling CreateVpcPeeringAuthorization. You do not need to explicitly delete the VPC peering connection.  To delete a fleet, specify the fleet ID to be terminated. During the deletion process the fleet status is changed to DELETING. When completed, the status switches to TERMINATED and the fleet event FLEET_DELETED is sent.  Learn more   Setting up Amazon GameLift Fleets 
   */
  deleteFleet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes locations from a multi-location fleet. When deleting a location, all game server process and all instances that are still active in the location are shut down.  To delete fleet locations, identify the fleet ID and provide a list of the locations to be deleted.  If successful, GameLift sets the location status to DELETING, and begins to shut down existing server processes and terminate instances in each location being deleted. When completed, the location status changes to TERMINATED.  Learn more   Setting up Amazon GameLift fleets 
   */
  deleteFleetLocations(params: GameLift.Types.DeleteFleetLocationsInput, callback?: (err: AWSError, data: GameLift.Types.DeleteFleetLocationsOutput) => void): Request<GameLift.Types.DeleteFleetLocationsOutput, AWSError>;
  /**
   * Removes locations from a multi-location fleet. When deleting a location, all game server process and all instances that are still active in the location are shut down.  To delete fleet locations, identify the fleet ID and provide a list of the locations to be deleted.  If successful, GameLift sets the location status to DELETING, and begins to shut down existing server processes and terminate instances in each location being deleted. When completed, the location status changes to TERMINATED.  Learn more   Setting up Amazon GameLift fleets 
   */
  deleteFleetLocations(callback?: (err: AWSError, data: GameLift.Types.DeleteFleetLocationsOutput) => void): Request<GameLift.Types.DeleteFleetLocationsOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Terminates a game server group and permanently deletes the game server group record. You have several options for how these resources are impacted when deleting the game server group. Depending on the type of delete operation selected, this operation might affect these resources:   The game server group   The corresponding Auto Scaling group   All game servers that are currently running in the group   To delete a game server group, identify the game server group to delete and specify the type of delete operation to initiate. Game server groups can only be deleted if they are in ACTIVE or ERROR status. If the delete request is successful, a series of operations are kicked off. The game server group status is changed to DELETE_SCHEDULED, which prevents new game servers from being registered and stops automatic scaling activity. Once all game servers in the game server group are deregistered, Amazon GameLift FleetIQ can begin deleting resources. If any of the delete operations fail, the game server group is placed in ERROR status. Amazon GameLift FleetIQ emits delete events to Amazon CloudWatch.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  deleteGameServerGroup(params: GameLift.Types.DeleteGameServerGroupInput, callback?: (err: AWSError, data: GameLift.Types.DeleteGameServerGroupOutput) => void): Request<GameLift.Types.DeleteGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Terminates a game server group and permanently deletes the game server group record. You have several options for how these resources are impacted when deleting the game server group. Depending on the type of delete operation selected, this operation might affect these resources:   The game server group   The corresponding Auto Scaling group   All game servers that are currently running in the group   To delete a game server group, identify the game server group to delete and specify the type of delete operation to initiate. Game server groups can only be deleted if they are in ACTIVE or ERROR status. If the delete request is successful, a series of operations are kicked off. The game server group status is changed to DELETE_SCHEDULED, which prevents new game servers from being registered and stops automatic scaling activity. Once all game servers in the game server group are deregistered, Amazon GameLift FleetIQ can begin deleting resources. If any of the delete operations fail, the game server group is placed in ERROR status. Amazon GameLift FleetIQ emits delete events to Amazon CloudWatch.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  deleteGameServerGroup(callback?: (err: AWSError, data: GameLift.Types.DeleteGameServerGroupOutput) => void): Request<GameLift.Types.DeleteGameServerGroupOutput, AWSError>;
  /**
   * Deletes a game session queue. Once a queue is successfully deleted, unfulfilled StartGameSessionPlacement requests that reference the queue will fail. To delete a queue, specify the queue name.
   */
  deleteGameSessionQueue(params: GameLift.Types.DeleteGameSessionQueueInput, callback?: (err: AWSError, data: GameLift.Types.DeleteGameSessionQueueOutput) => void): Request<GameLift.Types.DeleteGameSessionQueueOutput, AWSError>;
  /**
   * Deletes a game session queue. Once a queue is successfully deleted, unfulfilled StartGameSessionPlacement requests that reference the queue will fail. To delete a queue, specify the queue name.
   */
  deleteGameSessionQueue(callback?: (err: AWSError, data: GameLift.Types.DeleteGameSessionQueueOutput) => void): Request<GameLift.Types.DeleteGameSessionQueueOutput, AWSError>;
  /**
   * Deletes a custom location. Before deleting a custom location, review any fleets currently using the custom location and deregister the location if it is in use. For more information see, DeregisterCompute.
   */
  deleteLocation(params: GameLift.Types.DeleteLocationInput, callback?: (err: AWSError, data: GameLift.Types.DeleteLocationOutput) => void): Request<GameLift.Types.DeleteLocationOutput, AWSError>;
  /**
   * Deletes a custom location. Before deleting a custom location, review any fleets currently using the custom location and deregister the location if it is in use. For more information see, DeregisterCompute.
   */
  deleteLocation(callback?: (err: AWSError, data: GameLift.Types.DeleteLocationOutput) => void): Request<GameLift.Types.DeleteLocationOutput, AWSError>;
  /**
   * Permanently removes a FlexMatch matchmaking configuration. To delete, specify the configuration name. A matchmaking configuration cannot be deleted if it is being used in any active matchmaking tickets.
   */
  deleteMatchmakingConfiguration(params: GameLift.Types.DeleteMatchmakingConfigurationInput, callback?: (err: AWSError, data: GameLift.Types.DeleteMatchmakingConfigurationOutput) => void): Request<GameLift.Types.DeleteMatchmakingConfigurationOutput, AWSError>;
  /**
   * Permanently removes a FlexMatch matchmaking configuration. To delete, specify the configuration name. A matchmaking configuration cannot be deleted if it is being used in any active matchmaking tickets.
   */
  deleteMatchmakingConfiguration(callback?: (err: AWSError, data: GameLift.Types.DeleteMatchmakingConfigurationOutput) => void): Request<GameLift.Types.DeleteMatchmakingConfigurationOutput, AWSError>;
  /**
   * Deletes an existing matchmaking rule set. To delete the rule set, provide the rule set name. Rule sets cannot be deleted if they are currently being used by a matchmaking configuration.   Learn more     Build a rule set   
   */
  deleteMatchmakingRuleSet(params: GameLift.Types.DeleteMatchmakingRuleSetInput, callback?: (err: AWSError, data: GameLift.Types.DeleteMatchmakingRuleSetOutput) => void): Request<GameLift.Types.DeleteMatchmakingRuleSetOutput, AWSError>;
  /**
   * Deletes an existing matchmaking rule set. To delete the rule set, provide the rule set name. Rule sets cannot be deleted if they are currently being used by a matchmaking configuration.   Learn more     Build a rule set   
   */
  deleteMatchmakingRuleSet(callback?: (err: AWSError, data: GameLift.Types.DeleteMatchmakingRuleSetOutput) => void): Request<GameLift.Types.DeleteMatchmakingRuleSetOutput, AWSError>;
  /**
   * Deletes a fleet scaling policy. Once deleted, the policy is no longer in force and Amazon GameLift removes all record of it. To delete a scaling policy, specify both the scaling policy name and the fleet ID it is associated with. To temporarily suspend scaling policies, use StopFleetActions. This operation suspends all policies for the fleet.
   */
  deleteScalingPolicy(params: GameLift.Types.DeleteScalingPolicyInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a fleet scaling policy. Once deleted, the policy is no longer in force and Amazon GameLift removes all record of it. To delete a scaling policy, specify both the scaling policy name and the fleet ID it is associated with. To temporarily suspend scaling policies, use StopFleetActions. This operation suspends all policies for the fleet.
   */
  deleteScalingPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Realtime script. This operation permanently deletes the script record. If script files were uploaded, they are also deleted (files stored in an S3 bucket are not deleted).  To delete a script, specify the script ID. Before deleting a script, be sure to terminate all fleets that are deployed with the script being deleted. Fleet instances periodically check for script updates, and if the script record no longer exists, the instance will go into an error state and be unable to host game sessions.  Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  deleteScript(params: GameLift.Types.DeleteScriptInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Realtime script. This operation permanently deletes the script record. If script files were uploaded, they are also deleted (files stored in an S3 bucket are not deleted).  To delete a script, specify the script ID. Before deleting a script, be sure to terminate all fleets that are deployed with the script being deleted. Fleet instances periodically check for script updates, and if the script record no longer exists, the instance will go into an error state and be unable to host game sessions.  Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  deleteScript(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels a pending VPC peering authorization for the specified VPC. If you need to delete an existing VPC peering connection, use DeleteVpcPeeringConnection.  Related actions   All APIs by task 
   */
  deleteVpcPeeringAuthorization(params: GameLift.Types.DeleteVpcPeeringAuthorizationInput, callback?: (err: AWSError, data: GameLift.Types.DeleteVpcPeeringAuthorizationOutput) => void): Request<GameLift.Types.DeleteVpcPeeringAuthorizationOutput, AWSError>;
  /**
   * Cancels a pending VPC peering authorization for the specified VPC. If you need to delete an existing VPC peering connection, use DeleteVpcPeeringConnection.  Related actions   All APIs by task 
   */
  deleteVpcPeeringAuthorization(callback?: (err: AWSError, data: GameLift.Types.DeleteVpcPeeringAuthorizationOutput) => void): Request<GameLift.Types.DeleteVpcPeeringAuthorizationOutput, AWSError>;
  /**
   * Removes a VPC peering connection. To delete the connection, you must have a valid authorization for the VPC peering connection that you want to delete..  Once a valid authorization exists, call this operation from the Amazon Web Services account that is used to manage the Amazon GameLift fleets. Identify the connection to delete by the connection ID and fleet ID. If successful, the connection is removed.   Related actions   All APIs by task 
   */
  deleteVpcPeeringConnection(params: GameLift.Types.DeleteVpcPeeringConnectionInput, callback?: (err: AWSError, data: GameLift.Types.DeleteVpcPeeringConnectionOutput) => void): Request<GameLift.Types.DeleteVpcPeeringConnectionOutput, AWSError>;
  /**
   * Removes a VPC peering connection. To delete the connection, you must have a valid authorization for the VPC peering connection that you want to delete..  Once a valid authorization exists, call this operation from the Amazon Web Services account that is used to manage the Amazon GameLift fleets. Identify the connection to delete by the connection ID and fleet ID. If successful, the connection is removed.   Related actions   All APIs by task 
   */
  deleteVpcPeeringConnection(callback?: (err: AWSError, data: GameLift.Types.DeleteVpcPeeringConnectionOutput) => void): Request<GameLift.Types.DeleteVpcPeeringConnectionOutput, AWSError>;
  /**
   * Removes a compute resource from an Amazon GameLift Anywhere fleet. Deregistered computes can no longer host game sessions through Amazon GameLift.
   */
  deregisterCompute(params: GameLift.Types.DeregisterComputeInput, callback?: (err: AWSError, data: GameLift.Types.DeregisterComputeOutput) => void): Request<GameLift.Types.DeregisterComputeOutput, AWSError>;
  /**
   * Removes a compute resource from an Amazon GameLift Anywhere fleet. Deregistered computes can no longer host game sessions through Amazon GameLift.
   */
  deregisterCompute(callback?: (err: AWSError, data: GameLift.Types.DeregisterComputeOutput) => void): Request<GameLift.Types.DeregisterComputeOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Removes the game server from a game server group. As a result of this operation, the deregistered game server can no longer be claimed and will not be returned in a list of active game servers.  To deregister a game server, specify the game server group and game server ID. If successful, this operation emits a CloudWatch event with termination timestamp and reason.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  deregisterGameServer(params: GameLift.Types.DeregisterGameServerInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Removes the game server from a game server group. As a result of this operation, the deregistered game server can no longer be claimed and will not be returned in a list of active game servers.  To deregister a game server, specify the game server group and game server ID. If successful, this operation emits a CloudWatch event with termination timestamp and reason.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  deregisterGameServer(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves properties for an alias. This operation returns all alias metadata and settings. To get an alias's target fleet ID only, use ResolveAlias.  To get alias properties, specify the alias ID. If successful, the requested alias record is returned.  Related actions   All APIs by task 
   */
  describeAlias(params: GameLift.Types.DescribeAliasInput, callback?: (err: AWSError, data: GameLift.Types.DescribeAliasOutput) => void): Request<GameLift.Types.DescribeAliasOutput, AWSError>;
  /**
   * Retrieves properties for an alias. This operation returns all alias metadata and settings. To get an alias's target fleet ID only, use ResolveAlias.  To get alias properties, specify the alias ID. If successful, the requested alias record is returned.  Related actions   All APIs by task 
   */
  describeAlias(callback?: (err: AWSError, data: GameLift.Types.DescribeAliasOutput) => void): Request<GameLift.Types.DescribeAliasOutput, AWSError>;
  /**
   * Retrieves properties for a custom game build. To request a build resource, specify a build ID. If successful, an object containing the build properties is returned.  Learn more    Upload a Custom Server Build   All APIs by task 
   */
  describeBuild(params: GameLift.Types.DescribeBuildInput, callback?: (err: AWSError, data: GameLift.Types.DescribeBuildOutput) => void): Request<GameLift.Types.DescribeBuildOutput, AWSError>;
  /**
   * Retrieves properties for a custom game build. To request a build resource, specify a build ID. If successful, an object containing the build properties is returned.  Learn more    Upload a Custom Server Build   All APIs by task 
   */
  describeBuild(callback?: (err: AWSError, data: GameLift.Types.DescribeBuildOutput) => void): Request<GameLift.Types.DescribeBuildOutput, AWSError>;
  /**
   * Retrieves properties for a compute resource in an Amazon GameLift fleet. Call ListCompute to get a list of compute resources in a fleet. You can request information for computes in either managed EC2 fleets or Anywhere fleets.  To request compute properties, specify the compute name and fleet ID. If successful, this operation returns details for the requested compute resource. For managed EC2 fleets, this operation returns the fleet's EC2 instances. For Anywhere fleets, this operation returns the fleet's registered computes. 
   */
  describeCompute(params: GameLift.Types.DescribeComputeInput, callback?: (err: AWSError, data: GameLift.Types.DescribeComputeOutput) => void): Request<GameLift.Types.DescribeComputeOutput, AWSError>;
  /**
   * Retrieves properties for a compute resource in an Amazon GameLift fleet. Call ListCompute to get a list of compute resources in a fleet. You can request information for computes in either managed EC2 fleets or Anywhere fleets.  To request compute properties, specify the compute name and fleet ID. If successful, this operation returns details for the requested compute resource. For managed EC2 fleets, this operation returns the fleet's EC2 instances. For Anywhere fleets, this operation returns the fleet's registered computes. 
   */
  describeCompute(callback?: (err: AWSError, data: GameLift.Types.DescribeComputeOutput) => void): Request<GameLift.Types.DescribeComputeOutput, AWSError>;
  /**
   * Retrieves the instance limits and current utilization for an Amazon Web Services Region or location. Instance limits control the number of instances, per instance type, per location, that your Amazon Web Services account can use. Learn more at Amazon EC2 Instance Types. The information returned includes the maximum number of instances allowed and your account's current usage across all fleets. This information can affect your ability to scale your Amazon GameLift fleets. You can request a limit increase for your account by using the Service limits page in the Amazon GameLift console. Instance limits differ based on whether the instances are deployed in a fleet's home Region or in a remote location. For remote locations, limits also differ based on the combination of home Region and remote location. All requests must specify an Amazon Web Services Region (either explicitly or as your default settings). To get the limit for a remote location, you must also specify the location. For example, the following requests all return different results:    Request specifies the Region ap-northeast-1 with no location. The result is limits and usage data on all instance types that are deployed in us-east-2, by all of the fleets that reside in ap-northeast-1.    Request specifies the Region us-east-1 with location ca-central-1. The result is limits and usage data on all instance types that are deployed in ca-central-1, by all of the fleets that reside in us-east-2. These limits do not affect fleets in any other Regions that deploy instances to ca-central-1.   Request specifies the Region eu-west-1 with location ca-central-1. The result is limits and usage data on all instance types that are deployed in ca-central-1, by all of the fleets that reside in eu-west-1.   This operation can be used in the following ways:   To get limit and usage data for all instance types that are deployed in an Amazon Web Services Region by fleets that reside in the same Region: Specify the Region only. Optionally, specify a single instance type to retrieve information for.   To get limit and usage data for all instance types that are deployed to a remote location by fleets that reside in different Amazon Web Services Region: Provide both the Amazon Web Services Region and the remote location. Optionally, specify a single instance type to retrieve information for.   If successful, an EC2InstanceLimits object is returned with limits and usage data for each requested instance type.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeEC2InstanceLimits(params: GameLift.Types.DescribeEC2InstanceLimitsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeEC2InstanceLimitsOutput) => void): Request<GameLift.Types.DescribeEC2InstanceLimitsOutput, AWSError>;
  /**
   * Retrieves the instance limits and current utilization for an Amazon Web Services Region or location. Instance limits control the number of instances, per instance type, per location, that your Amazon Web Services account can use. Learn more at Amazon EC2 Instance Types. The information returned includes the maximum number of instances allowed and your account's current usage across all fleets. This information can affect your ability to scale your Amazon GameLift fleets. You can request a limit increase for your account by using the Service limits page in the Amazon GameLift console. Instance limits differ based on whether the instances are deployed in a fleet's home Region or in a remote location. For remote locations, limits also differ based on the combination of home Region and remote location. All requests must specify an Amazon Web Services Region (either explicitly or as your default settings). To get the limit for a remote location, you must also specify the location. For example, the following requests all return different results:    Request specifies the Region ap-northeast-1 with no location. The result is limits and usage data on all instance types that are deployed in us-east-2, by all of the fleets that reside in ap-northeast-1.    Request specifies the Region us-east-1 with location ca-central-1. The result is limits and usage data on all instance types that are deployed in ca-central-1, by all of the fleets that reside in us-east-2. These limits do not affect fleets in any other Regions that deploy instances to ca-central-1.   Request specifies the Region eu-west-1 with location ca-central-1. The result is limits and usage data on all instance types that are deployed in ca-central-1, by all of the fleets that reside in eu-west-1.   This operation can be used in the following ways:   To get limit and usage data for all instance types that are deployed in an Amazon Web Services Region by fleets that reside in the same Region: Specify the Region only. Optionally, specify a single instance type to retrieve information for.   To get limit and usage data for all instance types that are deployed to a remote location by fleets that reside in different Amazon Web Services Region: Provide both the Amazon Web Services Region and the remote location. Optionally, specify a single instance type to retrieve information for.   If successful, an EC2InstanceLimits object is returned with limits and usage data for each requested instance type.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeEC2InstanceLimits(callback?: (err: AWSError, data: GameLift.Types.DescribeEC2InstanceLimitsOutput) => void): Request<GameLift.Types.DescribeEC2InstanceLimitsOutput, AWSError>;
  /**
   * Retrieves core fleet-wide properties, including the computing hardware and deployment configuration for all instances in the fleet. This operation can be used in the following ways:    To get attributes for one or more specific fleets, provide a list of fleet IDs or fleet ARNs.    To get attributes for all fleets, do not provide a fleet identifier.    When requesting attributes for multiple fleets, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a FleetAttributes object is returned for each fleet requested, unless the fleet identifier is not found.   Some API operations limit the number of fleet IDs that allowed in one request. If a request exceeds this limit, the request fails and the error message contains the maximum allowed number.   Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetAttributes(params: GameLift.Types.DescribeFleetAttributesInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetAttributesOutput) => void): Request<GameLift.Types.DescribeFleetAttributesOutput, AWSError>;
  /**
   * Retrieves core fleet-wide properties, including the computing hardware and deployment configuration for all instances in the fleet. This operation can be used in the following ways:    To get attributes for one or more specific fleets, provide a list of fleet IDs or fleet ARNs.    To get attributes for all fleets, do not provide a fleet identifier.    When requesting attributes for multiple fleets, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a FleetAttributes object is returned for each fleet requested, unless the fleet identifier is not found.   Some API operations limit the number of fleet IDs that allowed in one request. If a request exceeds this limit, the request fails and the error message contains the maximum allowed number.   Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetAttributes(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetAttributesOutput) => void): Request<GameLift.Types.DescribeFleetAttributesOutput, AWSError>;
  /**
   * Retrieves the resource capacity settings for one or more fleets. The data returned includes the current fleet capacity (number of EC2 instances), and settings that can control how capacity scaling. For fleets with remote locations, this operation retrieves data for the fleet's home Region only. This operation can be used in the following ways:    To get capacity data for one or more specific fleets, provide a list of fleet IDs or fleet ARNs.    To get capacity data for all fleets, do not provide a fleet identifier.    When requesting multiple fleets, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a FleetCapacity object is returned for each requested fleet ID. Each FleetCapacity object includes a Location property, which is set to the fleet's home Region. When a list of fleet IDs is provided, attribute objects are returned only for fleets that currently exist.  Some API operations may limit the number of fleet IDs that are allowed in one request. If a request exceeds this limit, the request fails and the error message includes the maximum allowed.   Learn more   Setting up Amazon GameLift fleets   GameLift metrics for fleets 
   */
  describeFleetCapacity(params: GameLift.Types.DescribeFleetCapacityInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetCapacityOutput) => void): Request<GameLift.Types.DescribeFleetCapacityOutput, AWSError>;
  /**
   * Retrieves the resource capacity settings for one or more fleets. The data returned includes the current fleet capacity (number of EC2 instances), and settings that can control how capacity scaling. For fleets with remote locations, this operation retrieves data for the fleet's home Region only. This operation can be used in the following ways:    To get capacity data for one or more specific fleets, provide a list of fleet IDs or fleet ARNs.    To get capacity data for all fleets, do not provide a fleet identifier.    When requesting multiple fleets, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a FleetCapacity object is returned for each requested fleet ID. Each FleetCapacity object includes a Location property, which is set to the fleet's home Region. When a list of fleet IDs is provided, attribute objects are returned only for fleets that currently exist.  Some API operations may limit the number of fleet IDs that are allowed in one request. If a request exceeds this limit, the request fails and the error message includes the maximum allowed.   Learn more   Setting up Amazon GameLift fleets   GameLift metrics for fleets 
   */
  describeFleetCapacity(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetCapacityOutput) => void): Request<GameLift.Types.DescribeFleetCapacityOutput, AWSError>;
  /**
   * Retrieves entries from a fleet's event log. Fleet events are initiated by changes in status, such as during fleet creation and termination, changes in capacity, etc. If a fleet has multiple locations, events are also initiated by changes to status and capacity in remote locations.  You can specify a time range to limit the result set. Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a collection of event log entries matching the request are returned.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetEvents(params: GameLift.Types.DescribeFleetEventsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetEventsOutput) => void): Request<GameLift.Types.DescribeFleetEventsOutput, AWSError>;
  /**
   * Retrieves entries from a fleet's event log. Fleet events are initiated by changes in status, such as during fleet creation and termination, changes in capacity, etc. If a fleet has multiple locations, events are also initiated by changes to status and capacity in remote locations.  You can specify a time range to limit the result set. Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a collection of event log entries matching the request are returned.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetEvents(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetEventsOutput) => void): Request<GameLift.Types.DescribeFleetEventsOutput, AWSError>;
  /**
   * Retrieves information on a fleet's remote locations, including life-cycle status and any suspended fleet activity.  This operation can be used in the following ways:    To get data for specific locations, provide a fleet identifier and a list of locations. Location data is returned in the order that it is requested.    To get data for all locations, provide a fleet identifier only. Location data is returned in no particular order.    When requesting attributes for multiple locations, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a LocationAttributes object is returned for each requested location. If the fleet does not have a requested location, no information is returned. This operation does not return the home Region. To get information on a fleet's home Region, call DescribeFleetAttributes.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetLocationAttributes(params: GameLift.Types.DescribeFleetLocationAttributesInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetLocationAttributesOutput) => void): Request<GameLift.Types.DescribeFleetLocationAttributesOutput, AWSError>;
  /**
   * Retrieves information on a fleet's remote locations, including life-cycle status and any suspended fleet activity.  This operation can be used in the following ways:    To get data for specific locations, provide a fleet identifier and a list of locations. Location data is returned in the order that it is requested.    To get data for all locations, provide a fleet identifier only. Location data is returned in no particular order.    When requesting attributes for multiple locations, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a LocationAttributes object is returned for each requested location. If the fleet does not have a requested location, no information is returned. This operation does not return the home Region. To get information on a fleet's home Region, call DescribeFleetAttributes.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetLocationAttributes(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetLocationAttributesOutput) => void): Request<GameLift.Types.DescribeFleetLocationAttributesOutput, AWSError>;
  /**
   * Retrieves the resource capacity settings for a fleet location. The data returned includes the current capacity (number of EC2 instances) and some scaling settings for the requested fleet location. Use this operation to retrieve capacity information for a fleet's remote location or home Region (you can also retrieve home Region capacity by calling DescribeFleetCapacity). To retrieve capacity data, identify a fleet and location.  If successful, a FleetCapacity object is returned for the requested fleet location.   Learn more   Setting up Amazon GameLift fleets   GameLift metrics for fleets 
   */
  describeFleetLocationCapacity(params: GameLift.Types.DescribeFleetLocationCapacityInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetLocationCapacityOutput) => void): Request<GameLift.Types.DescribeFleetLocationCapacityOutput, AWSError>;
  /**
   * Retrieves the resource capacity settings for a fleet location. The data returned includes the current capacity (number of EC2 instances) and some scaling settings for the requested fleet location. Use this operation to retrieve capacity information for a fleet's remote location or home Region (you can also retrieve home Region capacity by calling DescribeFleetCapacity). To retrieve capacity data, identify a fleet and location.  If successful, a FleetCapacity object is returned for the requested fleet location.   Learn more   Setting up Amazon GameLift fleets   GameLift metrics for fleets 
   */
  describeFleetLocationCapacity(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetLocationCapacityOutput) => void): Request<GameLift.Types.DescribeFleetLocationCapacityOutput, AWSError>;
  /**
   * Retrieves current usage data for a fleet location. Utilization data provides a snapshot of current game hosting activity at the requested location. Use this operation to retrieve utilization information for a fleet's remote location or home Region (you can also retrieve home Region utilization by calling DescribeFleetUtilization). To retrieve utilization data, identify a fleet and location.  If successful, a FleetUtilization object is returned for the requested fleet location.   Learn more   Setting up Amazon GameLift fleets   GameLift metrics for fleets 
   */
  describeFleetLocationUtilization(params: GameLift.Types.DescribeFleetLocationUtilizationInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetLocationUtilizationOutput) => void): Request<GameLift.Types.DescribeFleetLocationUtilizationOutput, AWSError>;
  /**
   * Retrieves current usage data for a fleet location. Utilization data provides a snapshot of current game hosting activity at the requested location. Use this operation to retrieve utilization information for a fleet's remote location or home Region (you can also retrieve home Region utilization by calling DescribeFleetUtilization). To retrieve utilization data, identify a fleet and location.  If successful, a FleetUtilization object is returned for the requested fleet location.   Learn more   Setting up Amazon GameLift fleets   GameLift metrics for fleets 
   */
  describeFleetLocationUtilization(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetLocationUtilizationOutput) => void): Request<GameLift.Types.DescribeFleetLocationUtilizationOutput, AWSError>;
  /**
   * Retrieves a fleet's inbound connection permissions. Connection permissions specify the range of IP addresses and port settings that incoming traffic can use to access server processes in the fleet. Game sessions that are running on instances in the fleet must use connections that fall in this range. This operation can be used in the following ways:    To retrieve the inbound connection permissions for a fleet, identify the fleet's unique identifier.    To check the status of recent updates to a fleet remote location, specify the fleet ID and a location. Port setting updates can take time to propagate across all locations.    If successful, a set of IpPermission objects is returned for the requested fleet ID. When a location is specified, a pending status is included. If the requested fleet has been deleted, the result set is empty.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetPortSettings(params: GameLift.Types.DescribeFleetPortSettingsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetPortSettingsOutput) => void): Request<GameLift.Types.DescribeFleetPortSettingsOutput, AWSError>;
  /**
   * Retrieves a fleet's inbound connection permissions. Connection permissions specify the range of IP addresses and port settings that incoming traffic can use to access server processes in the fleet. Game sessions that are running on instances in the fleet must use connections that fall in this range. This operation can be used in the following ways:    To retrieve the inbound connection permissions for a fleet, identify the fleet's unique identifier.    To check the status of recent updates to a fleet remote location, specify the fleet ID and a location. Port setting updates can take time to propagate across all locations.    If successful, a set of IpPermission objects is returned for the requested fleet ID. When a location is specified, a pending status is included. If the requested fleet has been deleted, the result set is empty.  Learn more   Setting up Amazon GameLift fleets 
   */
  describeFleetPortSettings(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetPortSettingsOutput) => void): Request<GameLift.Types.DescribeFleetPortSettingsOutput, AWSError>;
  /**
   * Retrieves utilization statistics for one or more fleets. Utilization data provides a snapshot of how the fleet's hosting resources are currently being used. For fleets with remote locations, this operation retrieves data for the fleet's home Region only. See DescribeFleetLocationUtilization to get utilization statistics for a fleet's remote locations. This operation can be used in the following ways:    To get utilization data for one or more specific fleets, provide a list of fleet IDs or fleet ARNs.    To get utilization data for all fleets, do not provide a fleet identifier.    When requesting multiple fleets, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a FleetUtilization object is returned for each requested fleet ID, unless the fleet identifier is not found. Each fleet utilization object includes a Location property, which is set to the fleet's home Region.   Some API operations may limit the number of fleet IDs allowed in one request. If a request exceeds this limit, the request fails and the error message includes the maximum allowed.   Learn more   Setting up Amazon GameLift Fleets   GameLift Metrics for Fleets 
   */
  describeFleetUtilization(params: GameLift.Types.DescribeFleetUtilizationInput, callback?: (err: AWSError, data: GameLift.Types.DescribeFleetUtilizationOutput) => void): Request<GameLift.Types.DescribeFleetUtilizationOutput, AWSError>;
  /**
   * Retrieves utilization statistics for one or more fleets. Utilization data provides a snapshot of how the fleet's hosting resources are currently being used. For fleets with remote locations, this operation retrieves data for the fleet's home Region only. See DescribeFleetLocationUtilization to get utilization statistics for a fleet's remote locations. This operation can be used in the following ways:    To get utilization data for one or more specific fleets, provide a list of fleet IDs or fleet ARNs.    To get utilization data for all fleets, do not provide a fleet identifier.    When requesting multiple fleets, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a FleetUtilization object is returned for each requested fleet ID, unless the fleet identifier is not found. Each fleet utilization object includes a Location property, which is set to the fleet's home Region.   Some API operations may limit the number of fleet IDs allowed in one request. If a request exceeds this limit, the request fails and the error message includes the maximum allowed.   Learn more   Setting up Amazon GameLift Fleets   GameLift Metrics for Fleets 
   */
  describeFleetUtilization(callback?: (err: AWSError, data: GameLift.Types.DescribeFleetUtilizationOutput) => void): Request<GameLift.Types.DescribeFleetUtilizationOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves information for a registered game server. Information includes game server status, health check info, and the instance that the game server is running on.  To retrieve game server information, specify the game server ID. If successful, the requested game server object is returned.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  describeGameServer(params: GameLift.Types.DescribeGameServerInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameServerOutput) => void): Request<GameLift.Types.DescribeGameServerOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves information for a registered game server. Information includes game server status, health check info, and the instance that the game server is running on.  To retrieve game server information, specify the game server ID. If successful, the requested game server object is returned.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  describeGameServer(callback?: (err: AWSError, data: GameLift.Types.DescribeGameServerOutput) => void): Request<GameLift.Types.DescribeGameServerOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves information on a game server group. This operation returns only properties related to Amazon GameLift FleetIQ. To view or update properties for the corresponding Auto Scaling group, such as launch template, auto scaling policies, and maximum/minimum group size, access the Auto Scaling group directly. To get attributes for a game server group, provide a group name or ARN value. If successful, a GameServerGroup object is returned.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  describeGameServerGroup(params: GameLift.Types.DescribeGameServerGroupInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameServerGroupOutput) => void): Request<GameLift.Types.DescribeGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves information on a game server group. This operation returns only properties related to Amazon GameLift FleetIQ. To view or update properties for the corresponding Auto Scaling group, such as launch template, auto scaling policies, and maximum/minimum group size, access the Auto Scaling group directly. To get attributes for a game server group, provide a group name or ARN value. If successful, a GameServerGroup object is returned.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  describeGameServerGroup(callback?: (err: AWSError, data: GameLift.Types.DescribeGameServerGroupOutput) => void): Request<GameLift.Types.DescribeGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves status information about the Amazon EC2 instances associated with a Amazon GameLift FleetIQ game server group. Use this operation to detect when instances are active or not available to host new game servers. To request status for all instances in the game server group, provide a game server group ID only. To request status for specific instances, provide the game server group ID and one or more instance IDs. Use the pagination parameters to retrieve results in sequential segments. If successful, a collection of GameServerInstance objects is returned.  This operation is not designed to be called with every game server claim request; this practice can cause you to exceed your API limit, which results in errors. Instead, as a best practice, cache the results and refresh your cache no more than once every 10 seconds.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  describeGameServerInstances(params: GameLift.Types.DescribeGameServerInstancesInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameServerInstancesOutput) => void): Request<GameLift.Types.DescribeGameServerInstancesOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves status information about the Amazon EC2 instances associated with a Amazon GameLift FleetIQ game server group. Use this operation to detect when instances are active or not available to host new game servers. To request status for all instances in the game server group, provide a game server group ID only. To request status for specific instances, provide the game server group ID and one or more instance IDs. Use the pagination parameters to retrieve results in sequential segments. If successful, a collection of GameServerInstance objects is returned.  This operation is not designed to be called with every game server claim request; this practice can cause you to exceed your API limit, which results in errors. Instead, as a best practice, cache the results and refresh your cache no more than once every 10 seconds.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  describeGameServerInstances(callback?: (err: AWSError, data: GameLift.Types.DescribeGameServerInstancesOutput) => void): Request<GameLift.Types.DescribeGameServerInstancesOutput, AWSError>;
  /**
   * Retrieves additional game session properties, including the game session protection policy in force, a set of one or more game sessions in a specific fleet location. You can optionally filter the results by current game session status. This operation can be used in the following ways:    To retrieve details for all game sessions that are currently running on all locations in a fleet, provide a fleet or alias ID, with an optional status filter. This approach returns details from the fleet's home Region and all remote locations.   To retrieve details for all game sessions that are currently running on a specific fleet location, provide a fleet or alias ID and a location name, with optional status filter. The location can be the fleet's home Region or any remote location.   To retrieve details for a specific game session, provide the game session ID. This approach looks for the game session ID in all fleets that reside in the Amazon Web Services Region defined in the request.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a GameSessionDetail object is returned for each game session that matches the request.  Learn more   Find a game session   All APIs by task 
   */
  describeGameSessionDetails(params: GameLift.Types.DescribeGameSessionDetailsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionDetailsOutput) => void): Request<GameLift.Types.DescribeGameSessionDetailsOutput, AWSError>;
  /**
   * Retrieves additional game session properties, including the game session protection policy in force, a set of one or more game sessions in a specific fleet location. You can optionally filter the results by current game session status. This operation can be used in the following ways:    To retrieve details for all game sessions that are currently running on all locations in a fleet, provide a fleet or alias ID, with an optional status filter. This approach returns details from the fleet's home Region and all remote locations.   To retrieve details for all game sessions that are currently running on a specific fleet location, provide a fleet or alias ID and a location name, with optional status filter. The location can be the fleet's home Region or any remote location.   To retrieve details for a specific game session, provide the game session ID. This approach looks for the game session ID in all fleets that reside in the Amazon Web Services Region defined in the request.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a GameSessionDetail object is returned for each game session that matches the request.  Learn more   Find a game session   All APIs by task 
   */
  describeGameSessionDetails(callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionDetailsOutput) => void): Request<GameLift.Types.DescribeGameSessionDetailsOutput, AWSError>;
  /**
   * Retrieves information, including current status, about a game session placement request.  To get game session placement details, specify the placement ID. This operation is not designed to be continually called to track game session status. This practice can cause you to exceed your API limit, which results in errors. Instead, you must configure configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or queues. Continuously polling with DescribeGameSessionPlacement should only be used for games in development with low game session usage. 
   */
  describeGameSessionPlacement(params: GameLift.Types.DescribeGameSessionPlacementInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionPlacementOutput) => void): Request<GameLift.Types.DescribeGameSessionPlacementOutput, AWSError>;
  /**
   * Retrieves information, including current status, about a game session placement request.  To get game session placement details, specify the placement ID. This operation is not designed to be continually called to track game session status. This practice can cause you to exceed your API limit, which results in errors. Instead, you must configure configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or queues. Continuously polling with DescribeGameSessionPlacement should only be used for games in development with low game session usage. 
   */
  describeGameSessionPlacement(callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionPlacementOutput) => void): Request<GameLift.Types.DescribeGameSessionPlacementOutput, AWSError>;
  /**
   * Retrieves the properties for one or more game session queues. When requesting multiple queues, use the pagination parameters to retrieve results as a set of sequential pages. When specifying a list of queues, objects are returned only for queues that currently exist in the Region.  Learn more    View Your Queues 
   */
  describeGameSessionQueues(params: GameLift.Types.DescribeGameSessionQueuesInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionQueuesOutput) => void): Request<GameLift.Types.DescribeGameSessionQueuesOutput, AWSError>;
  /**
   * Retrieves the properties for one or more game session queues. When requesting multiple queues, use the pagination parameters to retrieve results as a set of sequential pages. When specifying a list of queues, objects are returned only for queues that currently exist in the Region.  Learn more    View Your Queues 
   */
  describeGameSessionQueues(callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionQueuesOutput) => void): Request<GameLift.Types.DescribeGameSessionQueuesOutput, AWSError>;
  /**
   * Retrieves a set of one or more game sessions in a specific fleet location. You can optionally filter the results by current game session status. This operation can be used in the following ways:    To retrieve all game sessions that are currently running on all locations in a fleet, provide a fleet or alias ID, with an optional status filter. This approach returns all game sessions in the fleet's home Region and all remote locations.   To retrieve all game sessions that are currently running on a specific fleet location, provide a fleet or alias ID and a location name, with optional status filter. The location can be the fleet's home Region or any remote location.   To retrieve a specific game session, provide the game session ID. This approach looks for the game session ID in all fleets that reside in the Amazon Web Services Region defined in the request.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a GameSession object is returned for each game session that matches the request. This operation is not designed to be continually called to track game session status. This practice can cause you to exceed your API limit, which results in errors. Instead, you must configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or queues. Continuously polling with DescribeGameSessions should only be used for games in development with low game session usage.   Available in Amazon GameLift Local.   Learn more   Find a game session   All APIs by task 
   */
  describeGameSessions(params: GameLift.Types.DescribeGameSessionsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionsOutput) => void): Request<GameLift.Types.DescribeGameSessionsOutput, AWSError>;
  /**
   * Retrieves a set of one or more game sessions in a specific fleet location. You can optionally filter the results by current game session status. This operation can be used in the following ways:    To retrieve all game sessions that are currently running on all locations in a fleet, provide a fleet or alias ID, with an optional status filter. This approach returns all game sessions in the fleet's home Region and all remote locations.   To retrieve all game sessions that are currently running on a specific fleet location, provide a fleet or alias ID and a location name, with optional status filter. The location can be the fleet's home Region or any remote location.   To retrieve a specific game session, provide the game session ID. This approach looks for the game session ID in all fleets that reside in the Amazon Web Services Region defined in the request.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a GameSession object is returned for each game session that matches the request. This operation is not designed to be continually called to track game session status. This practice can cause you to exceed your API limit, which results in errors. Instead, you must configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or queues. Continuously polling with DescribeGameSessions should only be used for games in development with low game session usage.   Available in Amazon GameLift Local.   Learn more   Find a game session   All APIs by task 
   */
  describeGameSessions(callback?: (err: AWSError, data: GameLift.Types.DescribeGameSessionsOutput) => void): Request<GameLift.Types.DescribeGameSessionsOutput, AWSError>;
  /**
   * Retrieves information about the EC2 instances in an Amazon GameLift managed fleet, including instance ID, connection data, and status. You can use this operation with a multi-location fleet to get location-specific instance information. As an alternative, use the operations ListCompute and DescribeCompute to retrieve information for compute resources, including EC2 and Anywhere fleets. You can call this operation in the following ways:   To get information on all instances in a fleet's home Region, specify the fleet ID.   To get information on all instances in a fleet's remote location, specify the fleet ID and location name.   To get information on a specific instance in a fleet, specify the fleet ID and instance ID.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, this operation returns Instance objects for each requested instance, listed in no particular order. If you call this operation for an Anywhere fleet, you receive an InvalidRequestException.  Learn more   Remotely connect to fleet instances   Debug fleet issues   Related actions   All APIs by task 
   */
  describeInstances(params: GameLift.Types.DescribeInstancesInput, callback?: (err: AWSError, data: GameLift.Types.DescribeInstancesOutput) => void): Request<GameLift.Types.DescribeInstancesOutput, AWSError>;
  /**
   * Retrieves information about the EC2 instances in an Amazon GameLift managed fleet, including instance ID, connection data, and status. You can use this operation with a multi-location fleet to get location-specific instance information. As an alternative, use the operations ListCompute and DescribeCompute to retrieve information for compute resources, including EC2 and Anywhere fleets. You can call this operation in the following ways:   To get information on all instances in a fleet's home Region, specify the fleet ID.   To get information on all instances in a fleet's remote location, specify the fleet ID and location name.   To get information on a specific instance in a fleet, specify the fleet ID and instance ID.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, this operation returns Instance objects for each requested instance, listed in no particular order. If you call this operation for an Anywhere fleet, you receive an InvalidRequestException.  Learn more   Remotely connect to fleet instances   Debug fleet issues   Related actions   All APIs by task 
   */
  describeInstances(callback?: (err: AWSError, data: GameLift.Types.DescribeInstancesOutput) => void): Request<GameLift.Types.DescribeInstancesOutput, AWSError>;
  /**
   * Retrieves one or more matchmaking tickets. Use this operation to retrieve ticket information, including--after a successful match is made--connection information for the resulting new game session.  To request matchmaking tickets, provide a list of up to 10 ticket IDs. If the request is successful, a ticket object is returned for each requested ID that currently exists. This operation is not designed to be continually called to track matchmaking ticket status. This practice can cause you to exceed your API limit, which results in errors. Instead, as a best practice, set up an Amazon Simple Notification Service to receive notifications, and provide the topic ARN in the matchmaking configuration.   Learn more    Add FlexMatch to a game client    Set Up FlexMatch event notification 
   */
  describeMatchmaking(params: GameLift.Types.DescribeMatchmakingInput, callback?: (err: AWSError, data: GameLift.Types.DescribeMatchmakingOutput) => void): Request<GameLift.Types.DescribeMatchmakingOutput, AWSError>;
  /**
   * Retrieves one or more matchmaking tickets. Use this operation to retrieve ticket information, including--after a successful match is made--connection information for the resulting new game session.  To request matchmaking tickets, provide a list of up to 10 ticket IDs. If the request is successful, a ticket object is returned for each requested ID that currently exists. This operation is not designed to be continually called to track matchmaking ticket status. This practice can cause you to exceed your API limit, which results in errors. Instead, as a best practice, set up an Amazon Simple Notification Service to receive notifications, and provide the topic ARN in the matchmaking configuration.   Learn more    Add FlexMatch to a game client    Set Up FlexMatch event notification 
   */
  describeMatchmaking(callback?: (err: AWSError, data: GameLift.Types.DescribeMatchmakingOutput) => void): Request<GameLift.Types.DescribeMatchmakingOutput, AWSError>;
  /**
   * Retrieves the details of FlexMatch matchmaking configurations.  This operation offers the following options: (1) retrieve all matchmaking configurations, (2) retrieve configurations for a specified list, or (3) retrieve all configurations that use a specified rule set name. When requesting multiple items, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a configuration is returned for each requested name. When specifying a list of names, only configurations that currently exist are returned.   Learn more    Setting up FlexMatch matchmakers 
   */
  describeMatchmakingConfigurations(params: GameLift.Types.DescribeMatchmakingConfigurationsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeMatchmakingConfigurationsOutput) => void): Request<GameLift.Types.DescribeMatchmakingConfigurationsOutput, AWSError>;
  /**
   * Retrieves the details of FlexMatch matchmaking configurations.  This operation offers the following options: (1) retrieve all matchmaking configurations, (2) retrieve configurations for a specified list, or (3) retrieve all configurations that use a specified rule set name. When requesting multiple items, use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a configuration is returned for each requested name. When specifying a list of names, only configurations that currently exist are returned.   Learn more    Setting up FlexMatch matchmakers 
   */
  describeMatchmakingConfigurations(callback?: (err: AWSError, data: GameLift.Types.DescribeMatchmakingConfigurationsOutput) => void): Request<GameLift.Types.DescribeMatchmakingConfigurationsOutput, AWSError>;
  /**
   * Retrieves the details for FlexMatch matchmaking rule sets. You can request all existing rule sets for the Region, or provide a list of one or more rule set names. When requesting multiple items, use the pagination parameters to retrieve results as a set of sequential pages. If successful, a rule set is returned for each requested name.   Learn more     Build a rule set   
   */
  describeMatchmakingRuleSets(params: GameLift.Types.DescribeMatchmakingRuleSetsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeMatchmakingRuleSetsOutput) => void): Request<GameLift.Types.DescribeMatchmakingRuleSetsOutput, AWSError>;
  /**
   * Retrieves the details for FlexMatch matchmaking rule sets. You can request all existing rule sets for the Region, or provide a list of one or more rule set names. When requesting multiple items, use the pagination parameters to retrieve results as a set of sequential pages. If successful, a rule set is returned for each requested name.   Learn more     Build a rule set   
   */
  describeMatchmakingRuleSets(callback?: (err: AWSError, data: GameLift.Types.DescribeMatchmakingRuleSetsOutput) => void): Request<GameLift.Types.DescribeMatchmakingRuleSetsOutput, AWSError>;
  /**
   * Retrieves properties for one or more player sessions.  This action can be used in the following ways:    To retrieve a specific player session, provide the player session ID only.   To retrieve all player sessions in a game session, provide the game session ID only.   To retrieve all player sessions for a specific player, provide a player ID only.   To request player sessions, specify either a player session ID, game session ID, or player ID. You can filter this request by player session status. If you provide a specific PlayerSessionId or PlayerId, Amazon GameLift ignores the filter criteria. Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a PlayerSession object is returned for each session that matches the request.  Related actions   All APIs by task 
   */
  describePlayerSessions(params: GameLift.Types.DescribePlayerSessionsInput, callback?: (err: AWSError, data: GameLift.Types.DescribePlayerSessionsOutput) => void): Request<GameLift.Types.DescribePlayerSessionsOutput, AWSError>;
  /**
   * Retrieves properties for one or more player sessions.  This action can be used in the following ways:    To retrieve a specific player session, provide the player session ID only.   To retrieve all player sessions in a game session, provide the game session ID only.   To retrieve all player sessions for a specific player, provide a player ID only.   To request player sessions, specify either a player session ID, game session ID, or player ID. You can filter this request by player session status. If you provide a specific PlayerSessionId or PlayerId, Amazon GameLift ignores the filter criteria. Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a PlayerSession object is returned for each session that matches the request.  Related actions   All APIs by task 
   */
  describePlayerSessions(callback?: (err: AWSError, data: GameLift.Types.DescribePlayerSessionsOutput) => void): Request<GameLift.Types.DescribePlayerSessionsOutput, AWSError>;
  /**
   * Retrieves a fleet's runtime configuration settings. The runtime configuration tells Amazon GameLift which server processes to run (and how) on each instance in the fleet. To get the runtime configuration that is currently in forces for a fleet, provide the fleet ID.  If successful, a RuntimeConfiguration object is returned for the requested fleet. If the requested fleet has been deleted, the result set is empty.  Learn more   Setting up Amazon GameLift fleets   Running multiple processes on a fleet 
   */
  describeRuntimeConfiguration(params: GameLift.Types.DescribeRuntimeConfigurationInput, callback?: (err: AWSError, data: GameLift.Types.DescribeRuntimeConfigurationOutput) => void): Request<GameLift.Types.DescribeRuntimeConfigurationOutput, AWSError>;
  /**
   * Retrieves a fleet's runtime configuration settings. The runtime configuration tells Amazon GameLift which server processes to run (and how) on each instance in the fleet. To get the runtime configuration that is currently in forces for a fleet, provide the fleet ID.  If successful, a RuntimeConfiguration object is returned for the requested fleet. If the requested fleet has been deleted, the result set is empty.  Learn more   Setting up Amazon GameLift fleets   Running multiple processes on a fleet 
   */
  describeRuntimeConfiguration(callback?: (err: AWSError, data: GameLift.Types.DescribeRuntimeConfigurationOutput) => void): Request<GameLift.Types.DescribeRuntimeConfigurationOutput, AWSError>;
  /**
   * Retrieves all scaling policies applied to a fleet. To get a fleet's scaling policies, specify the fleet ID. You can filter this request by policy status, such as to retrieve only active scaling policies. Use the pagination parameters to retrieve results as a set of sequential pages. If successful, set of ScalingPolicy objects is returned for the fleet. A fleet may have all of its scaling policies suspended. This operation does not affect the status of the scaling policies, which remains ACTIVE.
   */
  describeScalingPolicies(params: GameLift.Types.DescribeScalingPoliciesInput, callback?: (err: AWSError, data: GameLift.Types.DescribeScalingPoliciesOutput) => void): Request<GameLift.Types.DescribeScalingPoliciesOutput, AWSError>;
  /**
   * Retrieves all scaling policies applied to a fleet. To get a fleet's scaling policies, specify the fleet ID. You can filter this request by policy status, such as to retrieve only active scaling policies. Use the pagination parameters to retrieve results as a set of sequential pages. If successful, set of ScalingPolicy objects is returned for the fleet. A fleet may have all of its scaling policies suspended. This operation does not affect the status of the scaling policies, which remains ACTIVE.
   */
  describeScalingPolicies(callback?: (err: AWSError, data: GameLift.Types.DescribeScalingPoliciesOutput) => void): Request<GameLift.Types.DescribeScalingPoliciesOutput, AWSError>;
  /**
   * Retrieves properties for a Realtime script.  To request a script record, specify the script ID. If successful, an object containing the script properties is returned.  Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  describeScript(params: GameLift.Types.DescribeScriptInput, callback?: (err: AWSError, data: GameLift.Types.DescribeScriptOutput) => void): Request<GameLift.Types.DescribeScriptOutput, AWSError>;
  /**
   * Retrieves properties for a Realtime script.  To request a script record, specify the script ID. If successful, an object containing the script properties is returned.  Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  describeScript(callback?: (err: AWSError, data: GameLift.Types.DescribeScriptOutput) => void): Request<GameLift.Types.DescribeScriptOutput, AWSError>;
  /**
   * Retrieves valid VPC peering authorizations that are pending for the Amazon Web Services account. This operation returns all VPC peering authorizations and requests for peering. This includes those initiated and received by this account.   Related actions   All APIs by task 
   */
  describeVpcPeeringAuthorizations(params: GameLift.Types.DescribeVpcPeeringAuthorizationsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeVpcPeeringAuthorizationsOutput) => void): Request<GameLift.Types.DescribeVpcPeeringAuthorizationsOutput, AWSError>;
  /**
   * Retrieves valid VPC peering authorizations that are pending for the Amazon Web Services account. This operation returns all VPC peering authorizations and requests for peering. This includes those initiated and received by this account.   Related actions   All APIs by task 
   */
  describeVpcPeeringAuthorizations(callback?: (err: AWSError, data: GameLift.Types.DescribeVpcPeeringAuthorizationsOutput) => void): Request<GameLift.Types.DescribeVpcPeeringAuthorizationsOutput, AWSError>;
  /**
   * Retrieves information on VPC peering connections. Use this operation to get peering information for all fleets or for one specific fleet ID.  To retrieve connection information, call this operation from the Amazon Web Services account that is used to manage the Amazon GameLift fleets. Specify a fleet ID or leave the parameter empty to retrieve all connection records. If successful, the retrieved information includes both active and pending connections. Active connections identify the IpV4 CIDR block that the VPC uses to connect.   Related actions   All APIs by task 
   */
  describeVpcPeeringConnections(params: GameLift.Types.DescribeVpcPeeringConnectionsInput, callback?: (err: AWSError, data: GameLift.Types.DescribeVpcPeeringConnectionsOutput) => void): Request<GameLift.Types.DescribeVpcPeeringConnectionsOutput, AWSError>;
  /**
   * Retrieves information on VPC peering connections. Use this operation to get peering information for all fleets or for one specific fleet ID.  To retrieve connection information, call this operation from the Amazon Web Services account that is used to manage the Amazon GameLift fleets. Specify a fleet ID or leave the parameter empty to retrieve all connection records. If successful, the retrieved information includes both active and pending connections. Active connections identify the IpV4 CIDR block that the VPC uses to connect.   Related actions   All APIs by task 
   */
  describeVpcPeeringConnections(callback?: (err: AWSError, data: GameLift.Types.DescribeVpcPeeringConnectionsOutput) => void): Request<GameLift.Types.DescribeVpcPeeringConnectionsOutput, AWSError>;
  /**
   * Requests authorization to remotely connect to a compute resource in an Amazon GameLift fleet. Call this action to connect to an instance in a managed EC2 fleet if the fleet's game build uses Amazon GameLift server SDK 5.x or later. To connect to instances with game builds that use server SDK 4.x or earlier, call GetInstanceAccess. To request access to a compute, identify the specific EC2 instance and the fleet it belongs to. You can retrieve instances for a managed EC2 fleet by calling ListCompute.  If successful, this operation returns a set of temporary Amazon Web Services credentials, including a two-part access key and a session token. Use these credentials with Amazon EC2 Systems Manager (SSM) to start a session with the compute. For more details, see  Starting a session (CLI) in the Amazon EC2 Systems Manager User Guide.  Learn more   Remotely connect to fleet instances   Debug fleet issues 
   */
  getComputeAccess(params: GameLift.Types.GetComputeAccessInput, callback?: (err: AWSError, data: GameLift.Types.GetComputeAccessOutput) => void): Request<GameLift.Types.GetComputeAccessOutput, AWSError>;
  /**
   * Requests authorization to remotely connect to a compute resource in an Amazon GameLift fleet. Call this action to connect to an instance in a managed EC2 fleet if the fleet's game build uses Amazon GameLift server SDK 5.x or later. To connect to instances with game builds that use server SDK 4.x or earlier, call GetInstanceAccess. To request access to a compute, identify the specific EC2 instance and the fleet it belongs to. You can retrieve instances for a managed EC2 fleet by calling ListCompute.  If successful, this operation returns a set of temporary Amazon Web Services credentials, including a two-part access key and a session token. Use these credentials with Amazon EC2 Systems Manager (SSM) to start a session with the compute. For more details, see  Starting a session (CLI) in the Amazon EC2 Systems Manager User Guide.  Learn more   Remotely connect to fleet instances   Debug fleet issues 
   */
  getComputeAccess(callback?: (err: AWSError, data: GameLift.Types.GetComputeAccessOutput) => void): Request<GameLift.Types.GetComputeAccessOutput, AWSError>;
  /**
   * Requests an authentication token from Amazon GameLift for a registered compute in an Anywhere fleet. The game servers that are running on the compute use this token to authenticate with the Amazon GameLift service. Each server process must provide a valid authentication token in its call to the Amazon GameLift server SDK action InitSDK(). Authentication tokens are valid for a limited time span. Use a mechanism to regularly request a fresh authentication token before the current token expires.  Learn more     Create an Anywhere fleet     Test your integration     Server SDK reference guides (for version 5.x)  
   */
  getComputeAuthToken(params: GameLift.Types.GetComputeAuthTokenInput, callback?: (err: AWSError, data: GameLift.Types.GetComputeAuthTokenOutput) => void): Request<GameLift.Types.GetComputeAuthTokenOutput, AWSError>;
  /**
   * Requests an authentication token from Amazon GameLift for a registered compute in an Anywhere fleet. The game servers that are running on the compute use this token to authenticate with the Amazon GameLift service. Each server process must provide a valid authentication token in its call to the Amazon GameLift server SDK action InitSDK(). Authentication tokens are valid for a limited time span. Use a mechanism to regularly request a fresh authentication token before the current token expires.  Learn more     Create an Anywhere fleet     Test your integration     Server SDK reference guides (for version 5.x)  
   */
  getComputeAuthToken(callback?: (err: AWSError, data: GameLift.Types.GetComputeAuthTokenOutput) => void): Request<GameLift.Types.GetComputeAuthTokenOutput, AWSError>;
  /**
   * Retrieves the location of stored game session logs for a specified game session on Amazon GameLift managed fleets. When a game session is terminated, Amazon GameLift automatically stores the logs in Amazon S3 and retains them for 14 days. Use this URL to download the logs.  See the Amazon Web Services Service Limits page for maximum log file sizes. Log files that exceed this limit are not saved.   All APIs by task 
   */
  getGameSessionLogUrl(params: GameLift.Types.GetGameSessionLogUrlInput, callback?: (err: AWSError, data: GameLift.Types.GetGameSessionLogUrlOutput) => void): Request<GameLift.Types.GetGameSessionLogUrlOutput, AWSError>;
  /**
   * Retrieves the location of stored game session logs for a specified game session on Amazon GameLift managed fleets. When a game session is terminated, Amazon GameLift automatically stores the logs in Amazon S3 and retains them for 14 days. Use this URL to download the logs.  See the Amazon Web Services Service Limits page for maximum log file sizes. Log files that exceed this limit are not saved.   All APIs by task 
   */
  getGameSessionLogUrl(callback?: (err: AWSError, data: GameLift.Types.GetGameSessionLogUrlOutput) => void): Request<GameLift.Types.GetGameSessionLogUrlOutput, AWSError>;
  /**
   * Requests authorization to remotely connect to an instance in an Amazon GameLift managed fleet. Use this operation to connect to instances with game servers that use Amazon GameLift server SDK 4.x or earlier. To connect to instances with game servers that use server SDK 5.x or later, call GetComputeAccess. To request access to an instance, specify IDs for the instance and the fleet it belongs to. You can retrieve instance IDs for a fleet by calling DescribeInstances with the fleet ID.  If successful, this operation returns an IP address and credentials. The returned credentials match the operating system of the instance, as follows:    For a Windows instance: returns a user name and secret (password) for use with a Windows Remote Desktop client.    For a Linux instance: returns a user name and secret (RSA private key) for use with an SSH client. You must save the secret to a .pem file. If you're using the CLI, see the example  Get credentials for a Linux instance for tips on automatically saving the secret to a .pem file.     Learn more   Remotely connect to fleet instances   Debug fleet issues   Related actions   All APIs by task 
   */
  getInstanceAccess(params: GameLift.Types.GetInstanceAccessInput, callback?: (err: AWSError, data: GameLift.Types.GetInstanceAccessOutput) => void): Request<GameLift.Types.GetInstanceAccessOutput, AWSError>;
  /**
   * Requests authorization to remotely connect to an instance in an Amazon GameLift managed fleet. Use this operation to connect to instances with game servers that use Amazon GameLift server SDK 4.x or earlier. To connect to instances with game servers that use server SDK 5.x or later, call GetComputeAccess. To request access to an instance, specify IDs for the instance and the fleet it belongs to. You can retrieve instance IDs for a fleet by calling DescribeInstances with the fleet ID.  If successful, this operation returns an IP address and credentials. The returned credentials match the operating system of the instance, as follows:    For a Windows instance: returns a user name and secret (password) for use with a Windows Remote Desktop client.    For a Linux instance: returns a user name and secret (RSA private key) for use with an SSH client. You must save the secret to a .pem file. If you're using the CLI, see the example  Get credentials for a Linux instance for tips on automatically saving the secret to a .pem file.     Learn more   Remotely connect to fleet instances   Debug fleet issues   Related actions   All APIs by task 
   */
  getInstanceAccess(callback?: (err: AWSError, data: GameLift.Types.GetInstanceAccessOutput) => void): Request<GameLift.Types.GetInstanceAccessOutput, AWSError>;
  /**
   * Retrieves all aliases for this Amazon Web Services account. You can filter the result set by alias name and/or routing strategy type. Use the pagination parameters to retrieve results in sequential pages.  Returned aliases are not listed in any particular order.   Related actions   All APIs by task 
   */
  listAliases(params: GameLift.Types.ListAliasesInput, callback?: (err: AWSError, data: GameLift.Types.ListAliasesOutput) => void): Request<GameLift.Types.ListAliasesOutput, AWSError>;
  /**
   * Retrieves all aliases for this Amazon Web Services account. You can filter the result set by alias name and/or routing strategy type. Use the pagination parameters to retrieve results in sequential pages.  Returned aliases are not listed in any particular order.   Related actions   All APIs by task 
   */
  listAliases(callback?: (err: AWSError, data: GameLift.Types.ListAliasesOutput) => void): Request<GameLift.Types.ListAliasesOutput, AWSError>;
  /**
   * Retrieves build resources for all builds associated with the Amazon Web Services account in use. You can limit results to builds that are in a specific status by using the Status parameter. Use the pagination parameters to retrieve results in a set of sequential pages.   Build resources are not listed in any particular order.   Learn more    Upload a Custom Server Build   All APIs by task 
   */
  listBuilds(params: GameLift.Types.ListBuildsInput, callback?: (err: AWSError, data: GameLift.Types.ListBuildsOutput) => void): Request<GameLift.Types.ListBuildsOutput, AWSError>;
  /**
   * Retrieves build resources for all builds associated with the Amazon Web Services account in use. You can limit results to builds that are in a specific status by using the Status parameter. Use the pagination parameters to retrieve results in a set of sequential pages.   Build resources are not listed in any particular order.   Learn more    Upload a Custom Server Build   All APIs by task 
   */
  listBuilds(callback?: (err: AWSError, data: GameLift.Types.ListBuildsOutput) => void): Request<GameLift.Types.ListBuildsOutput, AWSError>;
  /**
   * Retrieves the compute resources in an Amazon GameLift fleet. You can request information for either managed EC2 fleets or Anywhere fleets.  To request a list of computes, specify the fleet ID. You can filter the result set by location. Use the pagination parameters to retrieve results in a set of sequential pages. If successful, this operation returns the compute resource for the requested fleet. For managed EC2 fleets, it returns a list of EC2 instances. For Anywhere fleets, it returns a list of registered compute names.
   */
  listCompute(params: GameLift.Types.ListComputeInput, callback?: (err: AWSError, data: GameLift.Types.ListComputeOutput) => void): Request<GameLift.Types.ListComputeOutput, AWSError>;
  /**
   * Retrieves the compute resources in an Amazon GameLift fleet. You can request information for either managed EC2 fleets or Anywhere fleets.  To request a list of computes, specify the fleet ID. You can filter the result set by location. Use the pagination parameters to retrieve results in a set of sequential pages. If successful, this operation returns the compute resource for the requested fleet. For managed EC2 fleets, it returns a list of EC2 instances. For Anywhere fleets, it returns a list of registered compute names.
   */
  listCompute(callback?: (err: AWSError, data: GameLift.Types.ListComputeOutput) => void): Request<GameLift.Types.ListComputeOutput, AWSError>;
  /**
   * Retrieves a collection of fleet resources in an Amazon Web Services Region. You can call this operation to get fleets in a previously selected default Region (see https://docs.aws.amazon.com/credref/latest/refdocs/setting-global-region.htmlor specify a Region in your request. You can filter the result set to find only those fleets that are deployed with a specific build or script. For fleets that have multiple locations, this operation retrieves fleets based on their home Region only. This operation can be used in the following ways:    To get a list of all fleets in a Region, don't provide a build or script identifier.    To get a list of all fleets where a specific custom game build is deployed, provide the build ID.   To get a list of all Realtime Servers fleets with a specific configuration script, provide the script ID.    Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a list of fleet IDs that match the request parameters is returned. A NextToken value is also returned if there are more result pages to retrieve.  Fleet resources are not listed in a particular order.   Learn more   Setting up Amazon GameLift fleets 
   */
  listFleets(params: GameLift.Types.ListFleetsInput, callback?: (err: AWSError, data: GameLift.Types.ListFleetsOutput) => void): Request<GameLift.Types.ListFleetsOutput, AWSError>;
  /**
   * Retrieves a collection of fleet resources in an Amazon Web Services Region. You can call this operation to get fleets in a previously selected default Region (see https://docs.aws.amazon.com/credref/latest/refdocs/setting-global-region.htmlor specify a Region in your request. You can filter the result set to find only those fleets that are deployed with a specific build or script. For fleets that have multiple locations, this operation retrieves fleets based on their home Region only. This operation can be used in the following ways:    To get a list of all fleets in a Region, don't provide a build or script identifier.    To get a list of all fleets where a specific custom game build is deployed, provide the build ID.   To get a list of all Realtime Servers fleets with a specific configuration script, provide the script ID.    Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a list of fleet IDs that match the request parameters is returned. A NextToken value is also returned if there are more result pages to retrieve.  Fleet resources are not listed in a particular order.   Learn more   Setting up Amazon GameLift fleets 
   */
  listFleets(callback?: (err: AWSError, data: GameLift.Types.ListFleetsOutput) => void): Request<GameLift.Types.ListFleetsOutput, AWSError>;
  /**
   * Lists a game server groups.
   */
  listGameServerGroups(params: GameLift.Types.ListGameServerGroupsInput, callback?: (err: AWSError, data: GameLift.Types.ListGameServerGroupsOutput) => void): Request<GameLift.Types.ListGameServerGroupsOutput, AWSError>;
  /**
   * Lists a game server groups.
   */
  listGameServerGroups(callback?: (err: AWSError, data: GameLift.Types.ListGameServerGroupsOutput) => void): Request<GameLift.Types.ListGameServerGroupsOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves information on all game servers that are currently active in a specified game server group. You can opt to sort the list by game server age. Use the pagination parameters to retrieve results in a set of sequential segments.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  listGameServers(params: GameLift.Types.ListGameServersInput, callback?: (err: AWSError, data: GameLift.Types.ListGameServersOutput) => void): Request<GameLift.Types.ListGameServersOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Retrieves information on all game servers that are currently active in a specified game server group. You can opt to sort the list by game server age. Use the pagination parameters to retrieve results in a set of sequential segments.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  listGameServers(callback?: (err: AWSError, data: GameLift.Types.ListGameServersOutput) => void): Request<GameLift.Types.ListGameServersOutput, AWSError>;
  /**
   * Lists all custom and Amazon Web Services locations.
   */
  listLocations(params: GameLift.Types.ListLocationsInput, callback?: (err: AWSError, data: GameLift.Types.ListLocationsOutput) => void): Request<GameLift.Types.ListLocationsOutput, AWSError>;
  /**
   * Lists all custom and Amazon Web Services locations.
   */
  listLocations(callback?: (err: AWSError, data: GameLift.Types.ListLocationsOutput) => void): Request<GameLift.Types.ListLocationsOutput, AWSError>;
  /**
   * Retrieves script records for all Realtime scripts that are associated with the Amazon Web Services account in use.   Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  listScripts(params: GameLift.Types.ListScriptsInput, callback?: (err: AWSError, data: GameLift.Types.ListScriptsOutput) => void): Request<GameLift.Types.ListScriptsOutput, AWSError>;
  /**
   * Retrieves script records for all Realtime scripts that are associated with the Amazon Web Services account in use.   Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  listScripts(callback?: (err: AWSError, data: GameLift.Types.ListScriptsOutput) => void): Request<GameLift.Types.ListScriptsOutput, AWSError>;
  /**
   * Retrieves all tags assigned to a Amazon GameLift resource. Use resource tags to organize Amazon Web Services resources for a range of purposes. This operation handles the permissions necessary to manage tags for Amazon GameLift resources that support tagging. To list tags for a resource, specify the unique ARN value for the resource.  Learn more   Tagging Amazon Web Services Resources in the Amazon Web Services General Reference    Amazon Web Services Tagging Strategies   Related actions   All APIs by task 
   */
  listTagsForResource(params: GameLift.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GameLift.Types.ListTagsForResourceResponse) => void): Request<GameLift.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves all tags assigned to a Amazon GameLift resource. Use resource tags to organize Amazon Web Services resources for a range of purposes. This operation handles the permissions necessary to manage tags for Amazon GameLift resources that support tagging. To list tags for a resource, specify the unique ARN value for the resource.  Learn more   Tagging Amazon Web Services Resources in the Amazon Web Services General Reference    Amazon Web Services Tagging Strategies   Related actions   All APIs by task 
   */
  listTagsForResource(callback?: (err: AWSError, data: GameLift.Types.ListTagsForResourceResponse) => void): Request<GameLift.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or updates a scaling policy for a fleet. Scaling policies are used to automatically scale a fleet's hosting capacity to meet player demand. An active scaling policy instructs Amazon GameLift to track a fleet metric and automatically change the fleet's capacity when a certain threshold is reached. There are two types of scaling policies: target-based and rule-based. Use a target-based policy to quickly and efficiently manage fleet scaling; this option is the most commonly used. Use rule-based policies when you need to exert fine-grained control over auto-scaling.  Fleets can have multiple scaling policies of each type in force at the same time; you can have one target-based policy, one or multiple rule-based scaling policies, or both. We recommend caution, however, because multiple auto-scaling policies can have unintended consequences. Learn more about how to work with auto-scaling in Set Up Fleet Automatic Scaling.  Target-based policy  A target-based policy tracks a single metric: PercentAvailableGameSessions. This metric tells us how much of a fleet's hosting capacity is ready to host game sessions but is not currently in use. This is the fleet's buffer; it measures the additional player demand that the fleet could handle at current capacity. With a target-based policy, you set your ideal buffer size and leave it to Amazon GameLift to take whatever action is needed to maintain that target.  For example, you might choose to maintain a 10% buffer for a fleet that has the capacity to host 100 simultaneous game sessions. This policy tells Amazon GameLift to take action whenever the fleet's available capacity falls below or rises above 10 game sessions. Amazon GameLift will start new instances or stop unused instances in order to return to the 10% buffer.  To create or update a target-based policy, specify a fleet ID and name, and set the policy type to "TargetBased". Specify the metric to track (PercentAvailableGameSessions) and reference a TargetConfiguration object with your desired buffer value. Exclude all other parameters. On a successful request, the policy name is returned. The scaling policy is automatically in force as soon as it's successfully created. If the fleet's auto-scaling actions are temporarily suspended, the new policy will be in force once the fleet actions are restarted.  Rule-based policy  A rule-based policy tracks specified fleet metric, sets a threshold value, and specifies the type of action to initiate when triggered. With a rule-based policy, you can select from several available fleet metrics. Each policy specifies whether to scale up or scale down (and by how much), so you need one policy for each type of action.  For example, a policy may make the following statement: "If the percentage of idle instances is greater than 20% for more than 15 minutes, then reduce the fleet capacity by 10%." A policy's rule statement has the following structure: If [MetricName] is [ComparisonOperator] [Threshold] for [EvaluationPeriods] minutes, then [ScalingAdjustmentType] to/by [ScalingAdjustment]. To implement the example, the rule statement would look like this: If [PercentIdleInstances] is [GreaterThanThreshold] [20] for [15] minutes, then [PercentChangeInCapacity] to/by [10]. To create or update a scaling policy, specify a unique combination of name and fleet ID, and set the policy type to "RuleBased". Specify the parameter values for a policy rule statement. On a successful request, the policy name is returned. Scaling policies are automatically in force as soon as they're successfully created. If the fleet's auto-scaling actions are temporarily suspended, the new policy will be in force once the fleet actions are restarted.
   */
  putScalingPolicy(params: GameLift.Types.PutScalingPolicyInput, callback?: (err: AWSError, data: GameLift.Types.PutScalingPolicyOutput) => void): Request<GameLift.Types.PutScalingPolicyOutput, AWSError>;
  /**
   * Creates or updates a scaling policy for a fleet. Scaling policies are used to automatically scale a fleet's hosting capacity to meet player demand. An active scaling policy instructs Amazon GameLift to track a fleet metric and automatically change the fleet's capacity when a certain threshold is reached. There are two types of scaling policies: target-based and rule-based. Use a target-based policy to quickly and efficiently manage fleet scaling; this option is the most commonly used. Use rule-based policies when you need to exert fine-grained control over auto-scaling.  Fleets can have multiple scaling policies of each type in force at the same time; you can have one target-based policy, one or multiple rule-based scaling policies, or both. We recommend caution, however, because multiple auto-scaling policies can have unintended consequences. Learn more about how to work with auto-scaling in Set Up Fleet Automatic Scaling.  Target-based policy  A target-based policy tracks a single metric: PercentAvailableGameSessions. This metric tells us how much of a fleet's hosting capacity is ready to host game sessions but is not currently in use. This is the fleet's buffer; it measures the additional player demand that the fleet could handle at current capacity. With a target-based policy, you set your ideal buffer size and leave it to Amazon GameLift to take whatever action is needed to maintain that target.  For example, you might choose to maintain a 10% buffer for a fleet that has the capacity to host 100 simultaneous game sessions. This policy tells Amazon GameLift to take action whenever the fleet's available capacity falls below or rises above 10 game sessions. Amazon GameLift will start new instances or stop unused instances in order to return to the 10% buffer.  To create or update a target-based policy, specify a fleet ID and name, and set the policy type to "TargetBased". Specify the metric to track (PercentAvailableGameSessions) and reference a TargetConfiguration object with your desired buffer value. Exclude all other parameters. On a successful request, the policy name is returned. The scaling policy is automatically in force as soon as it's successfully created. If the fleet's auto-scaling actions are temporarily suspended, the new policy will be in force once the fleet actions are restarted.  Rule-based policy  A rule-based policy tracks specified fleet metric, sets a threshold value, and specifies the type of action to initiate when triggered. With a rule-based policy, you can select from several available fleet metrics. Each policy specifies whether to scale up or scale down (and by how much), so you need one policy for each type of action.  For example, a policy may make the following statement: "If the percentage of idle instances is greater than 20% for more than 15 minutes, then reduce the fleet capacity by 10%." A policy's rule statement has the following structure: If [MetricName] is [ComparisonOperator] [Threshold] for [EvaluationPeriods] minutes, then [ScalingAdjustmentType] to/by [ScalingAdjustment]. To implement the example, the rule statement would look like this: If [PercentIdleInstances] is [GreaterThanThreshold] [20] for [15] minutes, then [PercentChangeInCapacity] to/by [10]. To create or update a scaling policy, specify a unique combination of name and fleet ID, and set the policy type to "RuleBased". Specify the parameter values for a policy rule statement. On a successful request, the policy name is returned. Scaling policies are automatically in force as soon as they're successfully created. If the fleet's auto-scaling actions are temporarily suspended, the new policy will be in force once the fleet actions are restarted.
   */
  putScalingPolicy(callback?: (err: AWSError, data: GameLift.Types.PutScalingPolicyOutput) => void): Request<GameLift.Types.PutScalingPolicyOutput, AWSError>;
  /**
   * Registers a compute resource to an Amazon GameLift Anywhere fleet. With Anywhere fleets you can incorporate your own computing hardware into an Amazon GameLift game hosting solution. To register a compute to a fleet, give the compute a name (must be unique within the fleet) and specify the compute resource's DNS name or IP address. Provide the Anywhere fleet ID and a fleet location to associate with the compute being registered. You can optionally include the path to a TLS certificate on the compute resource. If successful, this operation returns the compute details, including an Amazon GameLift SDK endpoint. Game server processes that run on the compute use this endpoint to communicate with the Amazon GameLift service. Each server process includes the SDK endpoint in its call to the Amazon GameLift server SDK action InitSDK().  Learn more     Create an Anywhere fleet     Test your integration     Server SDK reference guides (for version 5.x)  
   */
  registerCompute(params: GameLift.Types.RegisterComputeInput, callback?: (err: AWSError, data: GameLift.Types.RegisterComputeOutput) => void): Request<GameLift.Types.RegisterComputeOutput, AWSError>;
  /**
   * Registers a compute resource to an Amazon GameLift Anywhere fleet. With Anywhere fleets you can incorporate your own computing hardware into an Amazon GameLift game hosting solution. To register a compute to a fleet, give the compute a name (must be unique within the fleet) and specify the compute resource's DNS name or IP address. Provide the Anywhere fleet ID and a fleet location to associate with the compute being registered. You can optionally include the path to a TLS certificate on the compute resource. If successful, this operation returns the compute details, including an Amazon GameLift SDK endpoint. Game server processes that run on the compute use this endpoint to communicate with the Amazon GameLift service. Each server process includes the SDK endpoint in its call to the Amazon GameLift server SDK action InitSDK().  Learn more     Create an Anywhere fleet     Test your integration     Server SDK reference guides (for version 5.x)  
   */
  registerCompute(callback?: (err: AWSError, data: GameLift.Types.RegisterComputeOutput) => void): Request<GameLift.Types.RegisterComputeOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Creates a new game server resource and notifies Amazon GameLift FleetIQ that the game server is ready to host gameplay and players. This operation is called by a game server process that is running on an instance in a game server group. Registering game servers enables Amazon GameLift FleetIQ to track available game servers and enables game clients and services to claim a game server for a new game session.  To register a game server, identify the game server group and instance where the game server is running, and provide a unique identifier for the game server. You can also include connection and game server data. Once a game server is successfully registered, it is put in status AVAILABLE. A request to register a game server may fail if the instance it is running on is in the process of shutting down as part of instance balancing or scale-down activity.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  registerGameServer(params: GameLift.Types.RegisterGameServerInput, callback?: (err: AWSError, data: GameLift.Types.RegisterGameServerOutput) => void): Request<GameLift.Types.RegisterGameServerOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Creates a new game server resource and notifies Amazon GameLift FleetIQ that the game server is ready to host gameplay and players. This operation is called by a game server process that is running on an instance in a game server group. Registering game servers enables Amazon GameLift FleetIQ to track available game servers and enables game clients and services to claim a game server for a new game session.  To register a game server, identify the game server group and instance where the game server is running, and provide a unique identifier for the game server. You can also include connection and game server data. Once a game server is successfully registered, it is put in status AVAILABLE. A request to register a game server may fail if the instance it is running on is in the process of shutting down as part of instance balancing or scale-down activity.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  registerGameServer(callback?: (err: AWSError, data: GameLift.Types.RegisterGameServerOutput) => void): Request<GameLift.Types.RegisterGameServerOutput, AWSError>;
  /**
   * Retrieves a fresh set of credentials for use when uploading a new set of game build files to Amazon GameLift's Amazon S3. This is done as part of the build creation process; see GameSession. To request new credentials, specify the build ID as returned with an initial CreateBuild request. If successful, a new set of credentials are returned, along with the S3 storage location associated with the build ID.  Learn more    Create a Build with Files in S3   All APIs by task 
   */
  requestUploadCredentials(params: GameLift.Types.RequestUploadCredentialsInput, callback?: (err: AWSError, data: GameLift.Types.RequestUploadCredentialsOutput) => void): Request<GameLift.Types.RequestUploadCredentialsOutput, AWSError>;
  /**
   * Retrieves a fresh set of credentials for use when uploading a new set of game build files to Amazon GameLift's Amazon S3. This is done as part of the build creation process; see GameSession. To request new credentials, specify the build ID as returned with an initial CreateBuild request. If successful, a new set of credentials are returned, along with the S3 storage location associated with the build ID.  Learn more    Create a Build with Files in S3   All APIs by task 
   */
  requestUploadCredentials(callback?: (err: AWSError, data: GameLift.Types.RequestUploadCredentialsOutput) => void): Request<GameLift.Types.RequestUploadCredentialsOutput, AWSError>;
  /**
   * Retrieves the fleet ID that an alias is currently pointing to.  Related actions   All APIs by task 
   */
  resolveAlias(params: GameLift.Types.ResolveAliasInput, callback?: (err: AWSError, data: GameLift.Types.ResolveAliasOutput) => void): Request<GameLift.Types.ResolveAliasOutput, AWSError>;
  /**
   * Retrieves the fleet ID that an alias is currently pointing to.  Related actions   All APIs by task 
   */
  resolveAlias(callback?: (err: AWSError, data: GameLift.Types.ResolveAliasOutput) => void): Request<GameLift.Types.ResolveAliasOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Reinstates activity on a game server group after it has been suspended. A game server group might be suspended by the SuspendGameServerGroup operation, or it might be suspended involuntarily due to a configuration problem. In the second case, you can manually resume activity on the group once the configuration problem has been resolved. Refer to the game server group status and status reason for more information on why group activity is suspended. To resume activity, specify a game server group ARN and the type of activity to be resumed. If successful, a GameServerGroup object is returned showing that the resumed activity is no longer listed in SuspendedActions.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  resumeGameServerGroup(params: GameLift.Types.ResumeGameServerGroupInput, callback?: (err: AWSError, data: GameLift.Types.ResumeGameServerGroupOutput) => void): Request<GameLift.Types.ResumeGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Reinstates activity on a game server group after it has been suspended. A game server group might be suspended by the SuspendGameServerGroup operation, or it might be suspended involuntarily due to a configuration problem. In the second case, you can manually resume activity on the group once the configuration problem has been resolved. Refer to the game server group status and status reason for more information on why group activity is suspended. To resume activity, specify a game server group ARN and the type of activity to be resumed. If successful, a GameServerGroup object is returned showing that the resumed activity is no longer listed in SuspendedActions.   Learn more   Amazon GameLift FleetIQ Guide 
   */
  resumeGameServerGroup(callback?: (err: AWSError, data: GameLift.Types.ResumeGameServerGroupOutput) => void): Request<GameLift.Types.ResumeGameServerGroupOutput, AWSError>;
  /**
   * Retrieves all active game sessions that match a set of search criteria and sorts them into a specified order.  This operation is not designed to be continually called to track game session status. This practice can cause you to exceed your API limit, which results in errors. Instead, you must configure configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or queues. Continuously polling game session status with DescribeGameSessions should only be used for games in development with low game session usage.  When searching for game sessions, you specify exactly where you want to search and provide a search filter expression, a sort expression, or both. A search request can search only one fleet, but it can search all of a fleet's locations.  This operation can be used in the following ways:    To search all game sessions that are currently running on all locations in a fleet, provide a fleet or alias ID. This approach returns game sessions in the fleet's home Region and all remote locations that fit the search criteria.   To search all game sessions that are currently running on a specific fleet location, provide a fleet or alias ID and a location name. For location, you can specify a fleet's home Region or any remote location.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a GameSession object is returned for each game session that matches the request. Search finds game sessions that are in ACTIVE status only. To retrieve information on game sessions in other statuses, use DescribeGameSessions . You can search or sort by the following game session attributes:    gameSessionId -- A unique identifier for the game session. You can use either a GameSessionId or GameSessionArn value.     gameSessionName -- Name assigned to a game session. Game session names do not need to be unique to a game session.    gameSessionProperties -- Custom data defined in a game session's GameProperty parameter. GameProperty values are stored as key:value pairs; the filter expression must indicate the key and a string to search the data values for. For example, to search for game sessions with custom data containing the key:value pair "gameMode:brawl", specify the following: gameSessionProperties.gameMode = "brawl". All custom data values are searched as strings.    maximumSessions -- Maximum number of player sessions allowed for a game session.    creationTimeMillis -- Value indicating when a game session was created. It is expressed in Unix time as milliseconds.    playerSessionCount -- Number of players currently connected to a game session. This value changes rapidly as players join the session or drop out.    hasAvailablePlayerSessions -- Boolean value indicating whether a game session has reached its maximum number of players. It is highly recommended that all search requests include this filter attribute to optimize search performance and return only sessions that players can join.     Returned values for playerSessionCount and hasAvailablePlayerSessions change quickly as players join sessions and others drop out. Results should be considered a snapshot in time. Be sure to refresh search results often, and handle sessions that fill up before a player can join.    All APIs by task 
   */
  searchGameSessions(params: GameLift.Types.SearchGameSessionsInput, callback?: (err: AWSError, data: GameLift.Types.SearchGameSessionsOutput) => void): Request<GameLift.Types.SearchGameSessionsOutput, AWSError>;
  /**
   * Retrieves all active game sessions that match a set of search criteria and sorts them into a specified order.  This operation is not designed to be continually called to track game session status. This practice can cause you to exceed your API limit, which results in errors. Instead, you must configure configure an Amazon Simple Notification Service (SNS) topic to receive notifications from FlexMatch or queues. Continuously polling game session status with DescribeGameSessions should only be used for games in development with low game session usage.  When searching for game sessions, you specify exactly where you want to search and provide a search filter expression, a sort expression, or both. A search request can search only one fleet, but it can search all of a fleet's locations.  This operation can be used in the following ways:    To search all game sessions that are currently running on all locations in a fleet, provide a fleet or alias ID. This approach returns game sessions in the fleet's home Region and all remote locations that fit the search criteria.   To search all game sessions that are currently running on a specific fleet location, provide a fleet or alias ID and a location name. For location, you can specify a fleet's home Region or any remote location.   Use the pagination parameters to retrieve results as a set of sequential pages.  If successful, a GameSession object is returned for each game session that matches the request. Search finds game sessions that are in ACTIVE status only. To retrieve information on game sessions in other statuses, use DescribeGameSessions . You can search or sort by the following game session attributes:    gameSessionId -- A unique identifier for the game session. You can use either a GameSessionId or GameSessionArn value.     gameSessionName -- Name assigned to a game session. Game session names do not need to be unique to a game session.    gameSessionProperties -- Custom data defined in a game session's GameProperty parameter. GameProperty values are stored as key:value pairs; the filter expression must indicate the key and a string to search the data values for. For example, to search for game sessions with custom data containing the key:value pair "gameMode:brawl", specify the following: gameSessionProperties.gameMode = "brawl". All custom data values are searched as strings.    maximumSessions -- Maximum number of player sessions allowed for a game session.    creationTimeMillis -- Value indicating when a game session was created. It is expressed in Unix time as milliseconds.    playerSessionCount -- Number of players currently connected to a game session. This value changes rapidly as players join the session or drop out.    hasAvailablePlayerSessions -- Boolean value indicating whether a game session has reached its maximum number of players. It is highly recommended that all search requests include this filter attribute to optimize search performance and return only sessions that players can join.     Returned values for playerSessionCount and hasAvailablePlayerSessions change quickly as players join sessions and others drop out. Results should be considered a snapshot in time. Be sure to refresh search results often, and handle sessions that fill up before a player can join.    All APIs by task 
   */
  searchGameSessions(callback?: (err: AWSError, data: GameLift.Types.SearchGameSessionsOutput) => void): Request<GameLift.Types.SearchGameSessionsOutput, AWSError>;
  /**
   * Resumes certain types of activity on fleet instances that were suspended with StopFleetActions. For multi-location fleets, fleet actions are managed separately for each location. Currently, this operation is used to restart a fleet's auto-scaling activity. This operation can be used in the following ways:    To restart actions on instances in the fleet's home Region, provide a fleet ID and the type of actions to resume.    To restart actions on instances in one of the fleet's remote locations, provide a fleet ID, a location name, and the type of actions to resume.    If successful, Amazon GameLift once again initiates scaling events as triggered by the fleet's scaling policies. If actions on the fleet location were never stopped, this operation will have no effect.  Learn more   Setting up Amazon GameLift fleets 
   */
  startFleetActions(params: GameLift.Types.StartFleetActionsInput, callback?: (err: AWSError, data: GameLift.Types.StartFleetActionsOutput) => void): Request<GameLift.Types.StartFleetActionsOutput, AWSError>;
  /**
   * Resumes certain types of activity on fleet instances that were suspended with StopFleetActions. For multi-location fleets, fleet actions are managed separately for each location. Currently, this operation is used to restart a fleet's auto-scaling activity. This operation can be used in the following ways:    To restart actions on instances in the fleet's home Region, provide a fleet ID and the type of actions to resume.    To restart actions on instances in one of the fleet's remote locations, provide a fleet ID, a location name, and the type of actions to resume.    If successful, Amazon GameLift once again initiates scaling events as triggered by the fleet's scaling policies. If actions on the fleet location were never stopped, this operation will have no effect.  Learn more   Setting up Amazon GameLift fleets 
   */
  startFleetActions(callback?: (err: AWSError, data: GameLift.Types.StartFleetActionsOutput) => void): Request<GameLift.Types.StartFleetActionsOutput, AWSError>;
  /**
   * Places a request for a new game session in a queue. When processing a placement request, Amazon GameLift searches for available resources on the queue's destinations, scanning each until it finds resources or the placement request times out. A game session placement request can also request player sessions. When a new game session is successfully created, Amazon GameLift creates a player session for each player included in the request. When placing a game session, by default Amazon GameLift tries each fleet in the order they are listed in the queue configuration. Ideally, a queue's destinations are listed in preference order. Alternatively, when requesting a game session with players, you can also provide latency data for each player in relevant Regions. Latency data indicates the performance lag a player experiences when connected to a fleet in the Region. Amazon GameLift uses latency data to reorder the list of destinations to place the game session in a Region with minimal lag. If latency data is provided for multiple players, Amazon GameLift calculates each Region's average lag for all players and reorders to get the best game play across all players.  To place a new game session request, specify the following:   The queue name and a set of game session properties and settings   A unique ID (such as a UUID) for the placement. You use this ID to track the status of the placement request   (Optional) A set of player data and a unique player ID for each player that you are joining to the new game session (player data is optional, but if you include it, you must also provide a unique ID for each player)   Latency data for all players (if you want to optimize game play for the players)   If successful, a new game session placement is created. To track the status of a placement request, call DescribeGameSessionPlacement and check the request's status. If the status is FULFILLED, a new game session has been created and a game session ARN and Region are referenced. If the placement request times out, you can resubmit the request or retry it with a different queue. 
   */
  startGameSessionPlacement(params: GameLift.Types.StartGameSessionPlacementInput, callback?: (err: AWSError, data: GameLift.Types.StartGameSessionPlacementOutput) => void): Request<GameLift.Types.StartGameSessionPlacementOutput, AWSError>;
  /**
   * Places a request for a new game session in a queue. When processing a placement request, Amazon GameLift searches for available resources on the queue's destinations, scanning each until it finds resources or the placement request times out. A game session placement request can also request player sessions. When a new game session is successfully created, Amazon GameLift creates a player session for each player included in the request. When placing a game session, by default Amazon GameLift tries each fleet in the order they are listed in the queue configuration. Ideally, a queue's destinations are listed in preference order. Alternatively, when requesting a game session with players, you can also provide latency data for each player in relevant Regions. Latency data indicates the performance lag a player experiences when connected to a fleet in the Region. Amazon GameLift uses latency data to reorder the list of destinations to place the game session in a Region with minimal lag. If latency data is provided for multiple players, Amazon GameLift calculates each Region's average lag for all players and reorders to get the best game play across all players.  To place a new game session request, specify the following:   The queue name and a set of game session properties and settings   A unique ID (such as a UUID) for the placement. You use this ID to track the status of the placement request   (Optional) A set of player data and a unique player ID for each player that you are joining to the new game session (player data is optional, but if you include it, you must also provide a unique ID for each player)   Latency data for all players (if you want to optimize game play for the players)   If successful, a new game session placement is created. To track the status of a placement request, call DescribeGameSessionPlacement and check the request's status. If the status is FULFILLED, a new game session has been created and a game session ARN and Region are referenced. If the placement request times out, you can resubmit the request or retry it with a different queue. 
   */
  startGameSessionPlacement(callback?: (err: AWSError, data: GameLift.Types.StartGameSessionPlacementOutput) => void): Request<GameLift.Types.StartGameSessionPlacementOutput, AWSError>;
  /**
   * Finds new players to fill open slots in currently running game sessions. The backfill match process is essentially identical to the process of forming new matches. Backfill requests use the same matchmaker that was used to make the original match, and they provide matchmaking data for all players currently in the game session. FlexMatch uses this information to select new players so that backfilled match continues to meet the original match requirements.  When using FlexMatch with Amazon GameLift managed hosting, you can request a backfill match from a client service by calling this operation with a GameSessions ID. You also have the option of making backfill requests directly from your game server. In response to a request, FlexMatch creates player sessions for the new players, updates the GameSession resource, and sends updated matchmaking data to the game server. You can request a backfill match at any point after a game session is started. Each game session can have only one active backfill request at a time; a subsequent request automatically replaces the earlier request. When using FlexMatch as a standalone component, request a backfill match by calling this operation without a game session identifier. As with newly formed matches, matchmaking results are returned in a matchmaking event so that your game can update the game session that is being backfilled. To request a backfill match, specify a unique ticket ID, the original matchmaking configuration, and matchmaking data for all current players in the game session being backfilled. Optionally, specify the GameSession ARN. If successful, a match backfill ticket is created and returned with status set to QUEUED. Track the status of backfill tickets using the same method for tracking tickets for new matches. Only game sessions created by FlexMatch are supported for match backfill.  Learn more    Backfill existing games with FlexMatch    Matchmaking events (reference)   How Amazon GameLift FlexMatch works 
   */
  startMatchBackfill(params: GameLift.Types.StartMatchBackfillInput, callback?: (err: AWSError, data: GameLift.Types.StartMatchBackfillOutput) => void): Request<GameLift.Types.StartMatchBackfillOutput, AWSError>;
  /**
   * Finds new players to fill open slots in currently running game sessions. The backfill match process is essentially identical to the process of forming new matches. Backfill requests use the same matchmaker that was used to make the original match, and they provide matchmaking data for all players currently in the game session. FlexMatch uses this information to select new players so that backfilled match continues to meet the original match requirements.  When using FlexMatch with Amazon GameLift managed hosting, you can request a backfill match from a client service by calling this operation with a GameSessions ID. You also have the option of making backfill requests directly from your game server. In response to a request, FlexMatch creates player sessions for the new players, updates the GameSession resource, and sends updated matchmaking data to the game server. You can request a backfill match at any point after a game session is started. Each game session can have only one active backfill request at a time; a subsequent request automatically replaces the earlier request. When using FlexMatch as a standalone component, request a backfill match by calling this operation without a game session identifier. As with newly formed matches, matchmaking results are returned in a matchmaking event so that your game can update the game session that is being backfilled. To request a backfill match, specify a unique ticket ID, the original matchmaking configuration, and matchmaking data for all current players in the game session being backfilled. Optionally, specify the GameSession ARN. If successful, a match backfill ticket is created and returned with status set to QUEUED. Track the status of backfill tickets using the same method for tracking tickets for new matches. Only game sessions created by FlexMatch are supported for match backfill.  Learn more    Backfill existing games with FlexMatch    Matchmaking events (reference)   How Amazon GameLift FlexMatch works 
   */
  startMatchBackfill(callback?: (err: AWSError, data: GameLift.Types.StartMatchBackfillOutput) => void): Request<GameLift.Types.StartMatchBackfillOutput, AWSError>;
  /**
   * Uses FlexMatch to create a game match for a group of players based on custom matchmaking rules. With games that use Amazon GameLift managed hosting, this operation also triggers Amazon GameLift to find hosting resources and start a new game session for the new match. Each matchmaking request includes information on one or more players and specifies the FlexMatch matchmaker to use. When a request is for multiple players, FlexMatch attempts to build a match that includes all players in the request, placing them in the same team and finding additional players as needed to fill the match.  To start matchmaking, provide a unique ticket ID, specify a matchmaking configuration, and include the players to be matched. You must also include any player attributes that are required by the matchmaking configuration's rule set. If successful, a matchmaking ticket is returned with status set to QUEUED.  Track matchmaking events to respond as needed and acquire game session connection information for successfully completed matches. Ticket status updates are tracked using event notification through Amazon Simple Notification Service, which is defined in the matchmaking configuration.  Learn more    Add FlexMatch to a game client    Set Up FlexMatch event notification    How Amazon GameLift FlexMatch works 
   */
  startMatchmaking(params: GameLift.Types.StartMatchmakingInput, callback?: (err: AWSError, data: GameLift.Types.StartMatchmakingOutput) => void): Request<GameLift.Types.StartMatchmakingOutput, AWSError>;
  /**
   * Uses FlexMatch to create a game match for a group of players based on custom matchmaking rules. With games that use Amazon GameLift managed hosting, this operation also triggers Amazon GameLift to find hosting resources and start a new game session for the new match. Each matchmaking request includes information on one or more players and specifies the FlexMatch matchmaker to use. When a request is for multiple players, FlexMatch attempts to build a match that includes all players in the request, placing them in the same team and finding additional players as needed to fill the match.  To start matchmaking, provide a unique ticket ID, specify a matchmaking configuration, and include the players to be matched. You must also include any player attributes that are required by the matchmaking configuration's rule set. If successful, a matchmaking ticket is returned with status set to QUEUED.  Track matchmaking events to respond as needed and acquire game session connection information for successfully completed matches. Ticket status updates are tracked using event notification through Amazon Simple Notification Service, which is defined in the matchmaking configuration.  Learn more    Add FlexMatch to a game client    Set Up FlexMatch event notification    How Amazon GameLift FlexMatch works 
   */
  startMatchmaking(callback?: (err: AWSError, data: GameLift.Types.StartMatchmakingOutput) => void): Request<GameLift.Types.StartMatchmakingOutput, AWSError>;
  /**
   * Suspends certain types of activity in a fleet location. Currently, this operation is used to stop auto-scaling activity. For multi-location fleets, fleet actions are managed separately for each location.  Stopping fleet actions has several potential purposes. It allows you to temporarily stop auto-scaling activity but retain your scaling policies for use in the future. For multi-location fleets, you can set up fleet-wide auto-scaling, and then opt out of it for certain locations.  This operation can be used in the following ways:    To stop actions on instances in the fleet's home Region, provide a fleet ID and the type of actions to suspend.    To stop actions on instances in one of the fleet's remote locations, provide a fleet ID, a location name, and the type of actions to suspend.    If successful, Amazon GameLift no longer initiates scaling events except in response to manual changes using UpdateFleetCapacity.  Learn more   Setting up Amazon GameLift Fleets 
   */
  stopFleetActions(params: GameLift.Types.StopFleetActionsInput, callback?: (err: AWSError, data: GameLift.Types.StopFleetActionsOutput) => void): Request<GameLift.Types.StopFleetActionsOutput, AWSError>;
  /**
   * Suspends certain types of activity in a fleet location. Currently, this operation is used to stop auto-scaling activity. For multi-location fleets, fleet actions are managed separately for each location.  Stopping fleet actions has several potential purposes. It allows you to temporarily stop auto-scaling activity but retain your scaling policies for use in the future. For multi-location fleets, you can set up fleet-wide auto-scaling, and then opt out of it for certain locations.  This operation can be used in the following ways:    To stop actions on instances in the fleet's home Region, provide a fleet ID and the type of actions to suspend.    To stop actions on instances in one of the fleet's remote locations, provide a fleet ID, a location name, and the type of actions to suspend.    If successful, Amazon GameLift no longer initiates scaling events except in response to manual changes using UpdateFleetCapacity.  Learn more   Setting up Amazon GameLift Fleets 
   */
  stopFleetActions(callback?: (err: AWSError, data: GameLift.Types.StopFleetActionsOutput) => void): Request<GameLift.Types.StopFleetActionsOutput, AWSError>;
  /**
   * Cancels a game session placement that is in PENDING status. To stop a placement, provide the placement ID values. If successful, the placement is moved to CANCELLED status.
   */
  stopGameSessionPlacement(params: GameLift.Types.StopGameSessionPlacementInput, callback?: (err: AWSError, data: GameLift.Types.StopGameSessionPlacementOutput) => void): Request<GameLift.Types.StopGameSessionPlacementOutput, AWSError>;
  /**
   * Cancels a game session placement that is in PENDING status. To stop a placement, provide the placement ID values. If successful, the placement is moved to CANCELLED status.
   */
  stopGameSessionPlacement(callback?: (err: AWSError, data: GameLift.Types.StopGameSessionPlacementOutput) => void): Request<GameLift.Types.StopGameSessionPlacementOutput, AWSError>;
  /**
   * Cancels a matchmaking ticket or match backfill ticket that is currently being processed. To stop the matchmaking operation, specify the ticket ID. If successful, work on the ticket is stopped, and the ticket status is changed to CANCELLED. This call is also used to turn off automatic backfill for an individual game session. This is for game sessions that are created with a matchmaking configuration that has automatic backfill enabled. The ticket ID is included in the MatchmakerData of an updated game session object, which is provided to the game server.  If the operation is successful, the service sends back an empty JSON struct with the HTTP 200 response (not an empty HTTP body).   Learn more    Add FlexMatch to a game client 
   */
  stopMatchmaking(params: GameLift.Types.StopMatchmakingInput, callback?: (err: AWSError, data: GameLift.Types.StopMatchmakingOutput) => void): Request<GameLift.Types.StopMatchmakingOutput, AWSError>;
  /**
   * Cancels a matchmaking ticket or match backfill ticket that is currently being processed. To stop the matchmaking operation, specify the ticket ID. If successful, work on the ticket is stopped, and the ticket status is changed to CANCELLED. This call is also used to turn off automatic backfill for an individual game session. This is for game sessions that are created with a matchmaking configuration that has automatic backfill enabled. The ticket ID is included in the MatchmakerData of an updated game session object, which is provided to the game server.  If the operation is successful, the service sends back an empty JSON struct with the HTTP 200 response (not an empty HTTP body).   Learn more    Add FlexMatch to a game client 
   */
  stopMatchmaking(callback?: (err: AWSError, data: GameLift.Types.StopMatchmakingOutput) => void): Request<GameLift.Types.StopMatchmakingOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Temporarily stops activity on a game server group without terminating instances or the game server group. You can restart activity by calling ResumeGameServerGroup. You can suspend the following activity:    Instance type replacement - This activity evaluates the current game hosting viability of all Spot instance types that are defined for the game server group. It updates the Auto Scaling group to remove nonviable Spot Instance types, which have a higher chance of game server interruptions. It then balances capacity across the remaining viable Spot Instance types. When this activity is suspended, the Auto Scaling group continues with its current balance, regardless of viability. Instance protection, utilization metrics, and capacity scaling activities continue to be active.    To suspend activity, specify a game server group ARN and the type of activity to be suspended. If successful, a GameServerGroup object is returned showing that the activity is listed in SuspendedActions.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  suspendGameServerGroup(params: GameLift.Types.SuspendGameServerGroupInput, callback?: (err: AWSError, data: GameLift.Types.SuspendGameServerGroupOutput) => void): Request<GameLift.Types.SuspendGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Temporarily stops activity on a game server group without terminating instances or the game server group. You can restart activity by calling ResumeGameServerGroup. You can suspend the following activity:    Instance type replacement - This activity evaluates the current game hosting viability of all Spot instance types that are defined for the game server group. It updates the Auto Scaling group to remove nonviable Spot Instance types, which have a higher chance of game server interruptions. It then balances capacity across the remaining viable Spot Instance types. When this activity is suspended, the Auto Scaling group continues with its current balance, regardless of viability. Instance protection, utilization metrics, and capacity scaling activities continue to be active.    To suspend activity, specify a game server group ARN and the type of activity to be suspended. If successful, a GameServerGroup object is returned showing that the activity is listed in SuspendedActions.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  suspendGameServerGroup(callback?: (err: AWSError, data: GameLift.Types.SuspendGameServerGroupOutput) => void): Request<GameLift.Types.SuspendGameServerGroupOutput, AWSError>;
  /**
   * Assigns a tag to an Amazon GameLift resource. You can use tags to organize resources, create IAM permissions policies to manage access to groups of resources, customize Amazon Web Services cost breakdowns, and more. This operation handles the permissions necessary to manage tags for Amazon GameLift resources that support tagging. To add a tag to a resource, specify the unique ARN value for the resource and provide a tag list containing one or more tags. The operation succeeds even if the list includes tags that are already assigned to the resource.   Learn more   Tagging Amazon Web Services Resources in the Amazon Web Services General Reference    Amazon Web Services Tagging Strategies   Related actions   All APIs by task 
   */
  tagResource(params: GameLift.Types.TagResourceRequest, callback?: (err: AWSError, data: GameLift.Types.TagResourceResponse) => void): Request<GameLift.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns a tag to an Amazon GameLift resource. You can use tags to organize resources, create IAM permissions policies to manage access to groups of resources, customize Amazon Web Services cost breakdowns, and more. This operation handles the permissions necessary to manage tags for Amazon GameLift resources that support tagging. To add a tag to a resource, specify the unique ARN value for the resource and provide a tag list containing one or more tags. The operation succeeds even if the list includes tags that are already assigned to the resource.   Learn more   Tagging Amazon Web Services Resources in the Amazon Web Services General Reference    Amazon Web Services Tagging Strategies   Related actions   All APIs by task 
   */
  tagResource(callback?: (err: AWSError, data: GameLift.Types.TagResourceResponse) => void): Request<GameLift.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag assigned to a Amazon GameLift resource. You can use resource tags to organize Amazon Web Services resources for a range of purposes. This operation handles the permissions necessary to manage tags for Amazon GameLift resources that support tagging. To remove a tag from a resource, specify the unique ARN value for the resource and provide a string list containing one or more tags to remove. This operation succeeds even if the list includes tags that aren't assigned to the resource.  Learn more   Tagging Amazon Web Services Resources in the Amazon Web Services General Reference    Amazon Web Services Tagging Strategies   Related actions   All APIs by task 
   */
  untagResource(params: GameLift.Types.UntagResourceRequest, callback?: (err: AWSError, data: GameLift.Types.UntagResourceResponse) => void): Request<GameLift.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag assigned to a Amazon GameLift resource. You can use resource tags to organize Amazon Web Services resources for a range of purposes. This operation handles the permissions necessary to manage tags for Amazon GameLift resources that support tagging. To remove a tag from a resource, specify the unique ARN value for the resource and provide a string list containing one or more tags to remove. This operation succeeds even if the list includes tags that aren't assigned to the resource.  Learn more   Tagging Amazon Web Services Resources in the Amazon Web Services General Reference    Amazon Web Services Tagging Strategies   Related actions   All APIs by task 
   */
  untagResource(callback?: (err: AWSError, data: GameLift.Types.UntagResourceResponse) => void): Request<GameLift.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates properties for an alias. To update properties, specify the alias ID to be updated and provide the information to be changed. To reassign an alias to another fleet, provide an updated routing strategy. If successful, the updated alias record is returned.  Related actions   All APIs by task 
   */
  updateAlias(params: GameLift.Types.UpdateAliasInput, callback?: (err: AWSError, data: GameLift.Types.UpdateAliasOutput) => void): Request<GameLift.Types.UpdateAliasOutput, AWSError>;
  /**
   * Updates properties for an alias. To update properties, specify the alias ID to be updated and provide the information to be changed. To reassign an alias to another fleet, provide an updated routing strategy. If successful, the updated alias record is returned.  Related actions   All APIs by task 
   */
  updateAlias(callback?: (err: AWSError, data: GameLift.Types.UpdateAliasOutput) => void): Request<GameLift.Types.UpdateAliasOutput, AWSError>;
  /**
   * Updates metadata in a build resource, including the build name and version. To update the metadata, specify the build ID to update and provide the new values. If successful, a build object containing the updated metadata is returned.  Learn more    Upload a Custom Server Build   All APIs by task 
   */
  updateBuild(params: GameLift.Types.UpdateBuildInput, callback?: (err: AWSError, data: GameLift.Types.UpdateBuildOutput) => void): Request<GameLift.Types.UpdateBuildOutput, AWSError>;
  /**
   * Updates metadata in a build resource, including the build name and version. To update the metadata, specify the build ID to update and provide the new values. If successful, a build object containing the updated metadata is returned.  Learn more    Upload a Custom Server Build   All APIs by task 
   */
  updateBuild(callback?: (err: AWSError, data: GameLift.Types.UpdateBuildOutput) => void): Request<GameLift.Types.UpdateBuildOutput, AWSError>;
  /**
   * Updates a fleet's mutable attributes, including game session protection and resource creation limits. To update fleet attributes, specify the fleet ID and the property values that you want to change.  If successful, an updated FleetAttributes object is returned.  Learn more   Setting up Amazon GameLift fleets 
   */
  updateFleetAttributes(params: GameLift.Types.UpdateFleetAttributesInput, callback?: (err: AWSError, data: GameLift.Types.UpdateFleetAttributesOutput) => void): Request<GameLift.Types.UpdateFleetAttributesOutput, AWSError>;
  /**
   * Updates a fleet's mutable attributes, including game session protection and resource creation limits. To update fleet attributes, specify the fleet ID and the property values that you want to change.  If successful, an updated FleetAttributes object is returned.  Learn more   Setting up Amazon GameLift fleets 
   */
  updateFleetAttributes(callback?: (err: AWSError, data: GameLift.Types.UpdateFleetAttributesOutput) => void): Request<GameLift.Types.UpdateFleetAttributesOutput, AWSError>;
  /**
   * Updates capacity settings for a fleet. For fleets with multiple locations, use this operation to manage capacity settings in each location individually. Fleet capacity determines the number of game sessions and players that can be hosted based on the fleet configuration. Use this operation to set the following fleet capacity properties:    Minimum/maximum size: Set hard limits on fleet capacity. Amazon GameLift cannot set the fleet's capacity to a value outside of this range, whether the capacity is changed manually or through automatic scaling.    Desired capacity: Manually set the number of Amazon EC2 instances to be maintained in a fleet location. Before changing a fleet's desired capacity, you may want to call DescribeEC2InstanceLimits to get the maximum capacity of the fleet's Amazon EC2 instance type. Alternatively, consider using automatic scaling to adjust capacity based on player demand.   This operation can be used in the following ways:    To update capacity for a fleet's home Region, or if the fleet has no remote locations, omit the Location parameter. The fleet must be in ACTIVE status.    To update capacity for a fleet's remote location, include the Location parameter set to the location to be updated. The location must be in ACTIVE status.   If successful, capacity settings are updated immediately. In response a change in desired capacity, Amazon GameLift initiates steps to start new instances or terminate existing instances in the requested fleet location. This continues until the location's active instance count matches the new desired instance count. You can track a fleet's current capacity by calling DescribeFleetCapacity or DescribeFleetLocationCapacity. If the requested desired instance count is higher than the instance type's limit, the LimitExceeded exception occurs.  Learn more   Scaling fleet capacity 
   */
  updateFleetCapacity(params: GameLift.Types.UpdateFleetCapacityInput, callback?: (err: AWSError, data: GameLift.Types.UpdateFleetCapacityOutput) => void): Request<GameLift.Types.UpdateFleetCapacityOutput, AWSError>;
  /**
   * Updates capacity settings for a fleet. For fleets with multiple locations, use this operation to manage capacity settings in each location individually. Fleet capacity determines the number of game sessions and players that can be hosted based on the fleet configuration. Use this operation to set the following fleet capacity properties:    Minimum/maximum size: Set hard limits on fleet capacity. Amazon GameLift cannot set the fleet's capacity to a value outside of this range, whether the capacity is changed manually or through automatic scaling.    Desired capacity: Manually set the number of Amazon EC2 instances to be maintained in a fleet location. Before changing a fleet's desired capacity, you may want to call DescribeEC2InstanceLimits to get the maximum capacity of the fleet's Amazon EC2 instance type. Alternatively, consider using automatic scaling to adjust capacity based on player demand.   This operation can be used in the following ways:    To update capacity for a fleet's home Region, or if the fleet has no remote locations, omit the Location parameter. The fleet must be in ACTIVE status.    To update capacity for a fleet's remote location, include the Location parameter set to the location to be updated. The location must be in ACTIVE status.   If successful, capacity settings are updated immediately. In response a change in desired capacity, Amazon GameLift initiates steps to start new instances or terminate existing instances in the requested fleet location. This continues until the location's active instance count matches the new desired instance count. You can track a fleet's current capacity by calling DescribeFleetCapacity or DescribeFleetLocationCapacity. If the requested desired instance count is higher than the instance type's limit, the LimitExceeded exception occurs.  Learn more   Scaling fleet capacity 
   */
  updateFleetCapacity(callback?: (err: AWSError, data: GameLift.Types.UpdateFleetCapacityOutput) => void): Request<GameLift.Types.UpdateFleetCapacityOutput, AWSError>;
  /**
   * Updates permissions that allow inbound traffic to connect to game sessions that are being hosted on instances in the fleet.  To update settings, specify the fleet ID to be updated and specify the changes to be made. List the permissions you want to add in InboundPermissionAuthorizations, and permissions you want to remove in InboundPermissionRevocations. Permissions to be removed must match existing fleet permissions.  If successful, the fleet ID for the updated fleet is returned. For fleets with remote locations, port setting updates can take time to propagate across all locations. You can check the status of updates in each location by calling DescribeFleetPortSettings with a location name.  Learn more   Setting up Amazon GameLift fleets 
   */
  updateFleetPortSettings(params: GameLift.Types.UpdateFleetPortSettingsInput, callback?: (err: AWSError, data: GameLift.Types.UpdateFleetPortSettingsOutput) => void): Request<GameLift.Types.UpdateFleetPortSettingsOutput, AWSError>;
  /**
   * Updates permissions that allow inbound traffic to connect to game sessions that are being hosted on instances in the fleet.  To update settings, specify the fleet ID to be updated and specify the changes to be made. List the permissions you want to add in InboundPermissionAuthorizations, and permissions you want to remove in InboundPermissionRevocations. Permissions to be removed must match existing fleet permissions.  If successful, the fleet ID for the updated fleet is returned. For fleets with remote locations, port setting updates can take time to propagate across all locations. You can check the status of updates in each location by calling DescribeFleetPortSettings with a location name.  Learn more   Setting up Amazon GameLift fleets 
   */
  updateFleetPortSettings(callback?: (err: AWSError, data: GameLift.Types.UpdateFleetPortSettingsOutput) => void): Request<GameLift.Types.UpdateFleetPortSettingsOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Updates information about a registered game server to help Amazon GameLift FleetIQ track game server availability. This operation is called by a game server process that is running on an instance in a game server group.  Use this operation to update the following types of game server information. You can make all three types of updates in the same request:   To update the game server's utilization status from AVAILABLE (when the game server is available to be claimed) to UTILIZED (when the game server is currently hosting games). Identify the game server and game server group and specify the new utilization status. You can't change the status from to UTILIZED to AVAILABLE .   To report health status, identify the game server and game server group and set health check to HEALTHY. If a game server does not report health status for a certain length of time, the game server is no longer considered healthy. As a result, it will be eventually deregistered from the game server group to avoid affecting utilization metrics. The best practice is to report health every 60 seconds.   To change game server metadata, provide updated game server data.   Once a game server is successfully updated, the relevant statuses and timestamps are updated.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  updateGameServer(params: GameLift.Types.UpdateGameServerInput, callback?: (err: AWSError, data: GameLift.Types.UpdateGameServerOutput) => void): Request<GameLift.Types.UpdateGameServerOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Updates information about a registered game server to help Amazon GameLift FleetIQ track game server availability. This operation is called by a game server process that is running on an instance in a game server group.  Use this operation to update the following types of game server information. You can make all three types of updates in the same request:   To update the game server's utilization status from AVAILABLE (when the game server is available to be claimed) to UTILIZED (when the game server is currently hosting games). Identify the game server and game server group and specify the new utilization status. You can't change the status from to UTILIZED to AVAILABLE .   To report health status, identify the game server and game server group and set health check to HEALTHY. If a game server does not report health status for a certain length of time, the game server is no longer considered healthy. As a result, it will be eventually deregistered from the game server group to avoid affecting utilization metrics. The best practice is to report health every 60 seconds.   To change game server metadata, provide updated game server data.   Once a game server is successfully updated, the relevant statuses and timestamps are updated.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  updateGameServer(callback?: (err: AWSError, data: GameLift.Types.UpdateGameServerOutput) => void): Request<GameLift.Types.UpdateGameServerOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Updates Amazon GameLift FleetIQ-specific properties for a game server group. Many Auto Scaling group properties are updated on the Auto Scaling group directly, including the launch template, Auto Scaling policies, and maximum/minimum/desired instance counts. To update the game server group, specify the game server group ID and provide the updated values. Before applying the updates, the new values are validated to ensure that Amazon GameLift FleetIQ can continue to perform instance balancing activity. If successful, a GameServerGroup object is returned.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  updateGameServerGroup(params: GameLift.Types.UpdateGameServerGroupInput, callback?: (err: AWSError, data: GameLift.Types.UpdateGameServerGroupOutput) => void): Request<GameLift.Types.UpdateGameServerGroupOutput, AWSError>;
  /**
   *  This operation is used with the Amazon GameLift FleetIQ solution and game server groups.  Updates Amazon GameLift FleetIQ-specific properties for a game server group. Many Auto Scaling group properties are updated on the Auto Scaling group directly, including the launch template, Auto Scaling policies, and maximum/minimum/desired instance counts. To update the game server group, specify the game server group ID and provide the updated values. Before applying the updates, the new values are validated to ensure that Amazon GameLift FleetIQ can continue to perform instance balancing activity. If successful, a GameServerGroup object is returned.  Learn more   Amazon GameLift FleetIQ Guide 
   */
  updateGameServerGroup(callback?: (err: AWSError, data: GameLift.Types.UpdateGameServerGroupOutput) => void): Request<GameLift.Types.UpdateGameServerGroupOutput, AWSError>;
  /**
   * Updates the mutable properties of a game session.  To update a game session, specify the game session ID and the values you want to change.  If successful, the updated GameSession object is returned.   All APIs by task 
   */
  updateGameSession(params: GameLift.Types.UpdateGameSessionInput, callback?: (err: AWSError, data: GameLift.Types.UpdateGameSessionOutput) => void): Request<GameLift.Types.UpdateGameSessionOutput, AWSError>;
  /**
   * Updates the mutable properties of a game session.  To update a game session, specify the game session ID and the values you want to change.  If successful, the updated GameSession object is returned.   All APIs by task 
   */
  updateGameSession(callback?: (err: AWSError, data: GameLift.Types.UpdateGameSessionOutput) => void): Request<GameLift.Types.UpdateGameSessionOutput, AWSError>;
  /**
   * Updates the configuration of a game session queue, which determines how the queue processes new game session requests. To update settings, specify the queue name to be updated and provide the new settings. When updating destinations, provide a complete list of destinations.   Learn more    Using Multi-Region Queues 
   */
  updateGameSessionQueue(params: GameLift.Types.UpdateGameSessionQueueInput, callback?: (err: AWSError, data: GameLift.Types.UpdateGameSessionQueueOutput) => void): Request<GameLift.Types.UpdateGameSessionQueueOutput, AWSError>;
  /**
   * Updates the configuration of a game session queue, which determines how the queue processes new game session requests. To update settings, specify the queue name to be updated and provide the new settings. When updating destinations, provide a complete list of destinations.   Learn more    Using Multi-Region Queues 
   */
  updateGameSessionQueue(callback?: (err: AWSError, data: GameLift.Types.UpdateGameSessionQueueOutput) => void): Request<GameLift.Types.UpdateGameSessionQueueOutput, AWSError>;
  /**
   * Updates settings for a FlexMatch matchmaking configuration. These changes affect all matches and game sessions that are created after the update. To update settings, specify the configuration name to be updated and provide the new settings.   Learn more    Design a FlexMatch matchmaker 
   */
  updateMatchmakingConfiguration(params: GameLift.Types.UpdateMatchmakingConfigurationInput, callback?: (err: AWSError, data: GameLift.Types.UpdateMatchmakingConfigurationOutput) => void): Request<GameLift.Types.UpdateMatchmakingConfigurationOutput, AWSError>;
  /**
   * Updates settings for a FlexMatch matchmaking configuration. These changes affect all matches and game sessions that are created after the update. To update settings, specify the configuration name to be updated and provide the new settings.   Learn more    Design a FlexMatch matchmaker 
   */
  updateMatchmakingConfiguration(callback?: (err: AWSError, data: GameLift.Types.UpdateMatchmakingConfigurationOutput) => void): Request<GameLift.Types.UpdateMatchmakingConfigurationOutput, AWSError>;
  /**
   * Updates the current runtime configuration for the specified fleet, which tells Amazon GameLift how to launch server processes on all instances in the fleet. You can update a fleet's runtime configuration at any time after the fleet is created; it does not need to be in ACTIVE status. To update runtime configuration, specify the fleet ID and provide a RuntimeConfiguration with an updated set of server process configurations. If successful, the fleet's runtime configuration settings are updated. Each instance in the fleet regularly checks for and retrieves updated runtime configurations. Instances immediately begin complying with the new configuration by launching new server processes or not replacing existing processes when they shut down. Updating a fleet's runtime configuration never affects existing server processes.  Learn more   Setting up Amazon GameLift fleets 
   */
  updateRuntimeConfiguration(params: GameLift.Types.UpdateRuntimeConfigurationInput, callback?: (err: AWSError, data: GameLift.Types.UpdateRuntimeConfigurationOutput) => void): Request<GameLift.Types.UpdateRuntimeConfigurationOutput, AWSError>;
  /**
   * Updates the current runtime configuration for the specified fleet, which tells Amazon GameLift how to launch server processes on all instances in the fleet. You can update a fleet's runtime configuration at any time after the fleet is created; it does not need to be in ACTIVE status. To update runtime configuration, specify the fleet ID and provide a RuntimeConfiguration with an updated set of server process configurations. If successful, the fleet's runtime configuration settings are updated. Each instance in the fleet regularly checks for and retrieves updated runtime configurations. Instances immediately begin complying with the new configuration by launching new server processes or not replacing existing processes when they shut down. Updating a fleet's runtime configuration never affects existing server processes.  Learn more   Setting up Amazon GameLift fleets 
   */
  updateRuntimeConfiguration(callback?: (err: AWSError, data: GameLift.Types.UpdateRuntimeConfigurationOutput) => void): Request<GameLift.Types.UpdateRuntimeConfigurationOutput, AWSError>;
  /**
   * Updates Realtime script metadata and content. To update script metadata, specify the script ID and provide updated name and/or version values.  To update script content, provide an updated zip file by pointing to either a local file or an Amazon S3 bucket location. You can use either method regardless of how the original script was uploaded. Use the Version parameter to track updates to the script. If the call is successful, the updated metadata is stored in the script record and a revised script is uploaded to the Amazon GameLift service. Once the script is updated and acquired by a fleet instance, the new version is used for all new game sessions.   Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  updateScript(params: GameLift.Types.UpdateScriptInput, callback?: (err: AWSError, data: GameLift.Types.UpdateScriptOutput) => void): Request<GameLift.Types.UpdateScriptOutput, AWSError>;
  /**
   * Updates Realtime script metadata and content. To update script metadata, specify the script ID and provide updated name and/or version values.  To update script content, provide an updated zip file by pointing to either a local file or an Amazon S3 bucket location. You can use either method regardless of how the original script was uploaded. Use the Version parameter to track updates to the script. If the call is successful, the updated metadata is stored in the script record and a revised script is uploaded to the Amazon GameLift service. Once the script is updated and acquired by a fleet instance, the new version is used for all new game sessions.   Learn more   Amazon GameLift Realtime Servers   Related actions   All APIs by task 
   */
  updateScript(callback?: (err: AWSError, data: GameLift.Types.UpdateScriptOutput) => void): Request<GameLift.Types.UpdateScriptOutput, AWSError>;
  /**
   * Validates the syntax of a matchmaking rule or rule set. This operation checks that the rule set is using syntactically correct JSON and that it conforms to allowed property expressions. To validate syntax, provide a rule set JSON string.  Learn more     Build a rule set   
   */
  validateMatchmakingRuleSet(params: GameLift.Types.ValidateMatchmakingRuleSetInput, callback?: (err: AWSError, data: GameLift.Types.ValidateMatchmakingRuleSetOutput) => void): Request<GameLift.Types.ValidateMatchmakingRuleSetOutput, AWSError>;
  /**
   * Validates the syntax of a matchmaking rule or rule set. This operation checks that the rule set is using syntactically correct JSON and that it conforms to allowed property expressions. To validate syntax, provide a rule set JSON string.  Learn more     Build a rule set   
   */
  validateMatchmakingRuleSet(callback?: (err: AWSError, data: GameLift.Types.ValidateMatchmakingRuleSetOutput) => void): Request<GameLift.Types.ValidateMatchmakingRuleSetOutput, AWSError>;
}
declare namespace GameLift {
  export interface AcceptMatchInput {
    /**
     * A unique identifier for a matchmaking ticket. The ticket must be in status REQUIRES_ACCEPTANCE; otherwise this request will fail.
     */
    TicketId: MatchmakingIdStringModel;
    /**
     * A unique identifier for a player delivering the response. This parameter can include one or multiple player IDs.
     */
    PlayerIds: StringList;
    /**
     * Player response to the proposed match.
     */
    AcceptanceType: AcceptanceType;
  }
  export interface AcceptMatchOutput {
  }
  export type AcceptanceType = "ACCEPT"|"REJECT"|string;
  export interface Alias {
    /**
     * A unique identifier for the alias. Alias IDs are unique within a Region.
     */
    AliasId?: AliasId;
    /**
     * A descriptive label that is associated with an alias. Alias names do not need to be unique.
     */
    Name?: NonBlankAndLengthConstraintString;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift alias resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::alias/alias-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912. In a GameLift alias ARN, the resource ID matches the alias ID value.
     */
    AliasArn?: AliasArn;
    /**
     * A human-readable description of an alias.
     */
    Description?: FreeText;
    /**
     * The routing configuration, including routing type and fleet target, for the alias. 
     */
    RoutingStrategy?: RoutingStrategy;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * The time that this data object was last modified. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    LastUpdatedTime?: Timestamp;
  }
  export type AliasArn = string;
  export type AliasId = string;
  export type AliasIdOrArn = string;
  export type AliasList = Alias[];
  export type AmazonResourceName = string;
  export interface AnywhereConfiguration {
    /**
     * The cost to run your fleet per hour. Amazon GameLift uses the provided cost of your fleet to balance usage in queues. For more information about queues, see Setting up queues in the Amazon GameLift Developer Guide.
     */
    Cost: NonNegativeLimitedLengthDouble;
  }
  export type ArnStringModel = string;
  export interface AttributeValue {
    /**
     * For single string values. Maximum string length is 100 characters.
     */
    S?: PlayerAttributeString;
    /**
     * For number values, expressed as double.
     */
    N?: DoubleObject;
    /**
     * For a list of up to 100 strings. Maximum length for each string is 100 characters. Duplicate values are not recognized; all occurrences of the repeated value after the first of a repeated value are ignored.
     */
    SL?: PlayerAttributeStringList;
    /**
     * For a map of up to 10 data type:value pairs. Maximum length for each string value is 100 characters. 
     */
    SDM?: PlayerAttributeStringDoubleMap;
  }
  export type AutoScalingGroupArn = string;
  export interface AwsCredentials {
    /**
     * The access key ID that identifies the temporary security credentials. 
     */
    AccessKeyId?: NonEmptyString;
    /**
     * The secret access key that can be used to sign requests.
     */
    SecretAccessKey?: NonEmptyString;
    /**
     * The token that users must pass to the service API to use the temporary credentials. 
     */
    SessionToken?: NonEmptyString;
  }
  export type BackfillMode = "AUTOMATIC"|"MANUAL"|string;
  export type BalancingStrategy = "SPOT_ONLY"|"SPOT_PREFERRED"|"ON_DEMAND_ONLY"|string;
  export type BooleanModel = boolean;
  export interface Build {
    /**
     * A unique identifier for the build.
     */
    BuildId?: BuildId;
    /**
     * The Amazon Resource Name (ARN) assigned to a Amazon GameLift build resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::build/build-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912. In a GameLift build ARN, the resource ID matches the BuildId value.
     */
    BuildArn?: BuildArn;
    /**
     * A descriptive label associated with a build. Build names don't need to be unique. It can be set using CreateBuild or UpdateBuild.
     */
    Name?: FreeText;
    /**
     * Version information associated with a build or script. Version strings don't need to be unique.
     */
    Version?: FreeText;
    /**
     * Current status of the build. Possible build statuses include the following:    INITIALIZED -- A new build has been defined, but no files have been uploaded. You cannot create fleets for builds that are in this status. When a build is successfully created, the build status is set to this value.     READY -- The game build has been successfully uploaded. You can now create new fleets for this build.    FAILED -- The game build upload failed. You cannot create new fleets for this build.   
     */
    Status?: BuildStatus;
    /**
     * File size of the uploaded game build, expressed in bytes. When the build status is INITIALIZED or when using a custom Amazon S3 storage location, this value is 0.
     */
    SizeOnDisk?: PositiveLong;
    /**
     * Operating system that the game server binaries are built to run on. This value determines the type of fleet resources that you can use for this build.
     */
    OperatingSystem?: OperatingSystem;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * The Amazon GameLift Server SDK version used to develop your game server.
     */
    ServerSdkVersion?: ServerSdkVersion;
  }
  export type BuildArn = string;
  export type BuildId = string;
  export type BuildIdOrArn = string;
  export type BuildList = Build[];
  export type BuildStatus = "INITIALIZED"|"READY"|"FAILED"|string;
  export interface CertificateConfiguration {
    /**
     * Indicates whether a TLS/SSL certificate is generated for a fleet.  Valid values include:     GENERATED - Generate a TLS/SSL certificate for this fleet.    DISABLED - (default) Do not generate a TLS/SSL certificate for this fleet.   
     */
    CertificateType: CertificateType;
  }
  export type CertificateType = "DISABLED"|"GENERATED"|string;
  export interface ClaimFilterOption {
    /**
     * List of instance statuses that game servers may be claimed on. If provided, the list must contain the ACTIVE status.
     */
    InstanceStatuses?: FilterInstanceStatuses;
  }
  export interface ClaimGameServerInput {
    /**
     * A unique identifier for the game server group where the game server is running. If you are not specifying a game server to claim, this value identifies where you want Amazon GameLift FleetIQ to look for an available game server to claim. 
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * A custom string that uniquely identifies the game server to claim. If this parameter is left empty, Amazon GameLift FleetIQ searches for an available game server in the specified game server group.
     */
    GameServerId?: GameServerId;
    /**
     * A set of custom game server properties, formatted as a single string value. This data is passed to a game client or service when it requests information on game servers. 
     */
    GameServerData?: GameServerData;
    /**
     * Object that restricts how a claimed game server is chosen.
     */
    FilterOption?: ClaimFilterOption;
  }
  export interface ClaimGameServerOutput {
    /**
     * Object that describes the newly claimed game server.
     */
    GameServer?: GameServer;
  }
  export type ComparisonOperatorType = "GreaterThanOrEqualToThreshold"|"GreaterThanThreshold"|"LessThanThreshold"|"LessThanOrEqualToThreshold"|string;
  export interface Compute {
    /**
     * A unique identifier for the fleet that the compute belongs to.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) of the fleet that the compute belongs to.
     */
    FleetArn?: FleetArn;
    /**
     * A descriptive label for the compute resource. For instances in a managed EC2 fleet, the compute name is an instance ID.
     */
    ComputeName?: ComputeName;
    /**
     * The ARN that is assigned to a compute resource and uniquely identifies it. ARNs are unique across locations. Instances in managed EC2 fleets are not assigned a ComputeARN.
     */
    ComputeArn?: ComputeArn;
    /**
     * The IP address of a compute resource. Amazon GameLift requires a DNS name or IP address for a compute.
     */
    IpAddress?: IpAddress;
    /**
     * The DNS name of a compute resource. Amazon GameLift requires a DNS name or IP address for a compute.
     */
    DnsName?: DnsName;
    /**
     * Current status of the compute. A compute must have an ACTIVE status to host game sessions.
     */
    ComputeStatus?: ComputeStatus;
    /**
     * The name of the custom location you added to the fleet that this compute resource resides in.
     */
    Location?: LocationStringModel;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * The type of operating system on the compute resource.
     */
    OperatingSystem?: OperatingSystem;
    /**
     * The Amazon EC2 instance type that the fleet uses. For registered computes in an Amazon GameLift Anywhere fleet, this property is empty. 
     */
    Type?: EC2InstanceType;
    /**
     * The Amazon GameLift SDK endpoint connection for a registered compute resource in an Anywhere fleet. The game servers on the compute use this endpoint to connect to the Amazon GameLift service.
     */
    GameLiftServiceSdkEndpoint?: GameLiftServiceSdkEndpointOutput;
  }
  export type ComputeArn = string;
  export type ComputeAuthToken = string;
  export type ComputeList = Compute[];
  export type ComputeName = string;
  export type ComputeNameOrArn = string;
  export type ComputeStatus = "PENDING"|"ACTIVE"|"TERMINATING"|string;
  export type ComputeType = "EC2"|"ANYWHERE"|string;
  export interface CreateAliasInput {
    /**
     * A descriptive label that is associated with an alias. Alias names do not need to be unique.
     */
    Name: NonBlankAndLengthConstraintString;
    /**
     * A human-readable description of the alias.
     */
    Description?: NonZeroAndMaxString;
    /**
     * The routing configuration, including routing type and fleet target, for the alias. 
     */
    RoutingStrategy: RoutingStrategy;
    /**
     * A list of labels to assign to the new alias resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference.
     */
    Tags?: TagList;
  }
  export interface CreateAliasOutput {
    /**
     * The newly created alias resource.
     */
    Alias?: Alias;
  }
  export interface CreateBuildInput {
    /**
     * A descriptive label associated with a build. Build names don't need to be unique. You can change this value later. 
     */
    Name?: NonZeroAndMaxString;
    /**
     * Version information associated with a build or script. Version strings don't need to be unique. You can change this value later. 
     */
    Version?: NonZeroAndMaxString;
    /**
     * Information indicating where your game build files are stored. Use this parameter only when creating a build with files stored in an Amazon S3 bucket that you own. The storage location must specify an Amazon S3 bucket name and key. The location must also specify a role ARN that you set up to allow Amazon GameLift to access your Amazon S3 bucket. The S3 bucket and your new build must be in the same Region. If a StorageLocation is specified, the size of your file can be found in your Amazon S3 bucket. Amazon GameLift will report a SizeOnDisk of 0. 
     */
    StorageLocation?: S3Location;
    /**
     * The operating system that your game server binaries run on. This value determines the type of fleet resources that you use for this build. If your game build contains multiple executables, they all must run on the same operating system. You must specify a valid operating system in this request. There is no default value. You can't change a build's operating system later.  If you have active fleets using the Windows Server 2012 operating system, you can continue to create new builds using this OS until October 10, 2023, when Microsoft ends its support. All others must use Windows Server 2016 when creating new Windows-based builds. 
     */
    OperatingSystem?: OperatingSystem;
    /**
     * A list of labels to assign to the new build resource. Tags are developer defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference. Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags. The maximum tag limit may be lower than stated. See the Amazon Web Services General Reference for actual tagging limits.
     */
    Tags?: TagList;
    /**
     * A server SDK version you used when integrating your game server build with Amazon GameLift. For more information see Integrate games with custom game servers. By default Amazon GameLift sets this value to 4.0.2.
     */
    ServerSdkVersion?: ServerSdkVersion;
  }
  export interface CreateBuildOutput {
    /**
     * The newly created build resource, including a unique build IDs and status. 
     */
    Build?: Build;
    /**
     * This element is returned only when the operation is called without a storage location. It contains credentials to use when you are uploading a build file to an Amazon S3 bucket that is owned by Amazon GameLift. Credentials have a limited life span. To refresh these credentials, call RequestUploadCredentials. 
     */
    UploadCredentials?: AwsCredentials;
    /**
     * Amazon S3 location for your game build file, including bucket name and key.
     */
    StorageLocation?: S3Location;
  }
  export interface CreateFleetInput {
    /**
     * A descriptive label that is associated with a fleet. Fleet names do not need to be unique.
     */
    Name: NonZeroAndMaxString;
    /**
     * A description for the fleet.
     */
    Description?: NonZeroAndMaxString;
    /**
     * The unique identifier for a custom game server build to be deployed on fleet instances. You can use either the build ID or ARN. The build must be uploaded to Amazon GameLift and in READY status. This fleet property cannot be changed later.
     */
    BuildId?: BuildIdOrArn;
    /**
     * The unique identifier for a Realtime configuration script to be deployed on fleet instances. You can use either the script ID or ARN. Scripts must be uploaded to Amazon GameLift prior to creating the fleet. This fleet property cannot be changed later.
     */
    ScriptId?: ScriptIdOrArn;
    /**
     *  This parameter is no longer used. Specify a server launch path using the RuntimeConfiguration parameter. Requests that use this parameter instead continue to be valid.
     */
    ServerLaunchPath?: LaunchPathStringModel;
    /**
     *  This parameter is no longer used. Specify server launch parameters using the RuntimeConfiguration parameter. Requests that use this parameter instead continue to be valid.
     */
    ServerLaunchParameters?: LaunchParametersStringModel;
    /**
     *  This parameter is no longer used. To specify where Amazon GameLift should store log files once a server process shuts down, use the Amazon GameLift server API ProcessReady() and specify one or more directory paths in logParameters. For more information, see Initialize the server process in the Amazon GameLift Developer Guide. 
     */
    LogPaths?: StringList;
    /**
     * The Amazon GameLift-supported Amazon EC2 instance type to use for all fleet instances. Instance type determines the computing resources that will be used to host your game servers, including CPU, memory, storage, and networking capacity. See Amazon Elastic Compute Cloud Instance Types for detailed descriptions of Amazon EC2 instance types.
     */
    EC2InstanceType?: EC2InstanceType;
    /**
     * The allowed IP address ranges and port settings that allow inbound traffic to access game sessions on this fleet. If the fleet is hosting a custom game build, this property must be set before players can connect to game sessions. For Realtime Servers fleets, Amazon GameLift automatically sets TCP and UDP ranges. 
     */
    EC2InboundPermissions?: IpPermissionsList;
    /**
     * The status of termination protection for active game sessions on the fleet. By default, this property is set to NoProtection. You can also set game session protection for an individual game session by calling UpdateGameSession.    NoProtection - Game sessions can be terminated during active gameplay as a result of a scale-down event.     FullProtection - Game sessions in ACTIVE status cannot be terminated during a scale-down event.  
     */
    NewGameSessionProtectionPolicy?: ProtectionPolicy;
    /**
     * Instructions for how to launch and maintain server processes on instances in the fleet. The runtime configuration defines one or more server process configurations, each identifying a build executable or Realtime script file and the number of processes of that type to run concurrently.   The RuntimeConfiguration parameter is required unless the fleet is being configured using the older parameters ServerLaunchPath and ServerLaunchParameters, which are still supported for backward compatibility. 
     */
    RuntimeConfiguration?: RuntimeConfiguration;
    /**
     * A policy that limits the number of game sessions that an individual player can create on instances in this fleet within a specified span of time.
     */
    ResourceCreationLimitPolicy?: ResourceCreationLimitPolicy;
    /**
     * The name of an Amazon Web Services CloudWatch metric group to add this fleet to. A metric group is used to aggregate the metrics for multiple fleets. You can specify an existing metric group name or set a new name to create a new metric group. A fleet can be included in only one metric group at a time. 
     */
    MetricGroups?: MetricGroupList;
    /**
     * Used when peering your Amazon GameLift fleet with a VPC, the unique identifier for the Amazon Web Services account that owns the VPC. You can find your account ID in the Amazon Web Services Management Console under account settings. 
     */
    PeerVpcAwsAccountId?: NonZeroAndMaxString;
    /**
     * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet. The VPC must be in the same Region as your fleet. To look up a VPC ID, use the VPC Dashboard in the Amazon Web Services Management Console. Learn more about VPC peering in VPC Peering with Amazon GameLift Fleets.
     */
    PeerVpcId?: NonZeroAndMaxString;
    /**
     * Indicates whether to use On-Demand or Spot instances for this fleet. By default, this property is set to ON_DEMAND. Learn more about when to use  On-Demand versus Spot Instances. This property cannot be changed after the fleet is created.
     */
    FleetType?: FleetType;
    /**
     * A unique identifier for an IAM role that manages access to your Amazon Web Services services. With an instance role ARN set, any application that runs on an instance in this fleet can assume the role, including install scripts, server processes, and daemons (background processes). Create a role or look up a role's ARN by using the IAM dashboard in the Amazon Web Services Management Console. Learn more about using on-box credentials for your game servers at  Access external resources from a game server. This property cannot be changed after the fleet is created.
     */
    InstanceRoleArn?: NonEmptyString;
    /**
     * Prompts Amazon GameLift to generate a TLS/SSL certificate for the fleet. Amazon GameLift uses the certificates to encrypt traffic between game clients and the game servers running on Amazon GameLift. By default, the CertificateConfiguration is DISABLED. You can't change this property after you create the fleet.  Certificate Manager (ACM) certificates expire after 13 months. Certificate expiration can cause fleets to fail, preventing players from connecting to instances in the fleet. We recommend you replace fleets before 13 months, consider using fleet aliases for a smooth transition.  ACM isn't available in all Amazon Web Services regions. A fleet creation request with certificate generation enabled in an unsupported Region, fails with a 4xx error. For more information about the supported Regions, see Supported Regions in the Certificate Manager User Guide. 
     */
    CertificateConfiguration?: CertificateConfiguration;
    /**
     * A set of remote locations to deploy additional instances to and manage as part of the fleet. This parameter can only be used when creating fleets in Amazon Web Services Regions that support multiple locations. You can add any Amazon GameLift-supported Amazon Web Services Region as a remote location, in the form of an Amazon Web Services Region code such as us-west-2. To create a fleet with instances in the home Region only, don't use this parameter.  To use this parameter, Amazon GameLift requires you to use your home location in the request.
     */
    Locations?: LocationConfigurationList;
    /**
     * A list of labels to assign to the new fleet resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference.
     */
    Tags?: TagList;
    /**
     * The type of compute resource used to host your game servers. You can use your own compute resources with Amazon GameLift Anywhere or use Amazon EC2 instances with managed Amazon GameLift. By default, this property is set to EC2.
     */
    ComputeType?: ComputeType;
    /**
     * Amazon GameLift Anywhere configuration options.
     */
    AnywhereConfiguration?: AnywhereConfiguration;
  }
  export interface CreateFleetLocationsInput {
    /**
     * A unique identifier for the fleet to add locations to. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A list of locations to deploy additional instances to and manage as part of the fleet. You can add any Amazon GameLift-supported Amazon Web Services Region as a remote location, in the form of an Amazon Web Services Region code such as us-west-2. 
     */
    Locations: LocationConfigurationList;
  }
  export interface CreateFleetLocationsOutput {
    /**
     * A unique identifier for the fleet that was updated with new locations.
     */
    FleetId?: FleetIdOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912. 
     */
    FleetArn?: FleetArn;
    /**
     * The remote locations that are being added to the fleet, and the life-cycle status of each location. For new locations, the status is set to NEW. During location creation, Amazon GameLift updates each location's status as instances are deployed there and prepared for game hosting. This list does not include the fleet home Region or any remote locations that were already added to the fleet.
     */
    LocationStates?: LocationStateList;
  }
  export interface CreateFleetOutput {
    /**
     * The properties for the new fleet, including the current status. All fleets are placed in NEW status on creation. 
     */
    FleetAttributes?: FleetAttributes;
    /**
     * The fleet's locations and life-cycle status of each location. For new fleets, the status of all locations is set to NEW. During fleet creation, Amazon GameLift updates each location status as instances are deployed there and prepared for game hosting. This list includes an entry for the fleet's home Region. For fleets with no remote locations, only one entry, representing the home Region, is returned.
     */
    LocationStates?: LocationStateList;
  }
  export interface CreateGameServerGroupInput {
    /**
     * An identifier for the new game server group. This value is used to generate unique ARN identifiers for the Amazon EC2 Auto Scaling group and the Amazon GameLift FleetIQ game server group. The name must be unique per Region per Amazon Web Services account.
     */
    GameServerGroupName: GameServerGroupName;
    /**
     * The Amazon Resource Name (ARN) for an IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
     */
    RoleArn: IamRoleArn;
    /**
     * The minimum number of instances allowed in the Amazon EC2 Auto Scaling group. During automatic scaling events, Amazon GameLift FleetIQ and Amazon EC2 do not scale down the group below this minimum. In production, this value should be set to at least 1. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the Amazon Web Services console or APIs.
     */
    MinSize: WholeNumber;
    /**
     * The maximum number of instances allowed in the Amazon EC2 Auto Scaling group. During automatic scaling events, Amazon GameLift FleetIQ and EC2 do not scale up the group above this maximum. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the Amazon Web Services console or APIs.
     */
    MaxSize: PositiveInteger;
    /**
     * The Amazon EC2 launch template that contains configuration settings and game server code to be deployed to all instances in the game server group. You can specify the template using either the template name or ID. For help with creating a launch template, see Creating a Launch Template for an Auto Scaling Group in the Amazon Elastic Compute Cloud Auto Scaling User Guide. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the Amazon Web Services console or APIs.  If you specify network interfaces in your launch template, you must explicitly set the property AssociatePublicIpAddress to "true". If no network interface is specified in the launch template, Amazon GameLift FleetIQ uses your account's default VPC. 
     */
    LaunchTemplate: LaunchTemplateSpecification;
    /**
     * The Amazon EC2 instance types and sizes to use in the Auto Scaling group. The instance definitions must specify at least two different instance types that are supported by Amazon GameLift FleetIQ. For more information on instance types, see EC2 Instance Types in the Amazon Elastic Compute Cloud User Guide. You can optionally specify capacity weighting for each instance type. If no weight value is specified for an instance type, it is set to the default value "1". For more information about capacity weighting, see  Instance Weighting for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
     */
    InstanceDefinitions: InstanceDefinitions;
    /**
     * Configuration settings to define a scaling policy for the Auto Scaling group that is optimized for game hosting. The scaling policy uses the metric "PercentUtilizedGameServers" to maintain a buffer of idle game servers that can immediately accommodate new games and players. After the Auto Scaling group is created, update this value directly in the Auto Scaling group using the Amazon Web Services console or APIs.
     */
    AutoScalingPolicy?: GameServerGroupAutoScalingPolicy;
    /**
     * Indicates how Amazon GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group. Method options include the following:    SPOT_ONLY - Only Spot Instances are used in the game server group. If Spot Instances are unavailable or not viable for game hosting, the game server group provides no hosting capacity until Spot Instances can again be used. Until then, no new instances are started, and the existing nonviable Spot Instances are terminated (after current gameplay ends) and are not replaced.    SPOT_PREFERRED - (default value) Spot Instances are used whenever available in the game server group. If Spot Instances are unavailable, the game server group continues to provide hosting capacity by falling back to On-Demand Instances. Existing nonviable Spot Instances are terminated (after current gameplay ends) and are replaced with new On-Demand Instances.    ON_DEMAND_ONLY - Only On-Demand Instances are used in the game server group. No Spot Instances are used, even when available, while this balancing strategy is in force.  
     */
    BalancingStrategy?: BalancingStrategy;
    /**
     * A flag that indicates whether instances in the game server group are protected from early termination. Unprotected instances that have active game servers running might be terminated during a scale-down event, causing players to be dropped from the game. Protected instances cannot be terminated while there are active game servers running except in the event of a forced game server group deletion (see ). An exception to this is with Spot Instances, which can be terminated by Amazon Web Services regardless of protection status. This property is set to NO_PROTECTION by default.
     */
    GameServerProtectionPolicy?: GameServerProtectionPolicy;
    /**
     * A list of virtual private cloud (VPC) subnets to use with instances in the game server group. By default, all Amazon GameLift FleetIQ-supported Availability Zones are used. You can use this parameter to specify VPCs that you've set up. This property cannot be updated after the game server group is created, and the corresponding Auto Scaling group will always use the property value that is set with this request, even if the Auto Scaling group is updated directly.
     */
    VpcSubnets?: VpcSubnets;
    /**
     * A list of labels to assign to the new game server group resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources is useful for resource management, access management, and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference.
     */
    Tags?: TagList;
  }
  export interface CreateGameServerGroupOutput {
    /**
     * The newly created game server group object, including the new ARN value for the Amazon GameLift FleetIQ game server group and the object's status. The Amazon EC2 Auto Scaling group ARN is initially null, since the group has not yet been created. This value is added once the game server group status reaches ACTIVE. 
     */
    GameServerGroup?: GameServerGroup;
  }
  export interface CreateGameSessionInput {
    /**
     * A unique identifier for the fleet to create a game session in. You can use either the fleet ID or ARN value. Each request must reference either a fleet ID or alias ID, but not both.
     */
    FleetId?: FleetIdOrArn;
    /**
     * A unique identifier for the alias associated with the fleet to create a game session in. You can use either the alias ID or ARN value. Each request must reference either a fleet ID or alias ID, but not both.
     */
    AliasId?: AliasIdOrArn;
    /**
     * The maximum number of players that can be connected simultaneously to the game session.
     */
    MaximumPlayerSessionCount: WholeNumber;
    /**
     * A descriptive label that is associated with a game session. Session names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session).
     */
    GameProperties?: GamePropertyList;
    /**
     * A unique identifier for a player or entity creating the game session.  If you add a resource creation limit policy to a fleet, the CreateGameSession operation requires a CreatorId. Amazon GameLift limits the number of game session creation requests with the same CreatorId in a specified time period. If you your fleet doesn't have a resource creation limit policy and you provide a CreatorId in your CreateGameSession requests, Amazon GameLift limits requests to one request per CreatorId per second. To not limit CreateGameSession requests with the same CreatorId, don't provide a CreatorId in your CreateGameSession request.
     */
    CreatorId?: NonZeroAndMaxString;
    /**
     *  This parameter is deprecated. Use IdempotencyToken instead.  Custom string that uniquely identifies a request for a new game session. Maximum token length is 48 characters. If provided, this string is included in the new game session's ID.
     */
    GameSessionId?: IdStringModel;
    /**
     * Custom string that uniquely identifies the new game session request. This is useful for ensuring that game session requests with the same idempotency token are processed only once. Subsequent requests with the same string return the original GameSession object, with an updated status. Maximum token length is 48 characters. If provided, this string is included in the new game session's ID. A game session ARN has the following format: arn:aws:gamelift:&lt;region&gt;::gamesession/&lt;fleet ID&gt;/&lt;custom ID string or idempotency token&gt;. Idempotency tokens remain in use for 30 days after a game session has ended; game session objects are retained for this time period and then deleted.
     */
    IdempotencyToken?: IdStringModel;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process with a request to start a new game session (see Start a Game Session).
     */
    GameSessionData?: LargeGameSessionData;
    /**
     * A fleet's remote location to place the new game session in. If this parameter is not set, the new game session is placed in the fleet's home Region. Specify a remote location with an Amazon Web Services Region code such as us-west-2. When using an Anywhere fleet, this parameter is required and must be set to the Anywhere fleet's custom location.
     */
    Location?: LocationStringModel;
  }
  export interface CreateGameSessionOutput {
    /**
     * Object that describes the newly created game session record.
     */
    GameSession?: GameSession;
  }
  export interface CreateGameSessionQueueInput {
    /**
     * A descriptive label that is associated with game session queue. Queue names must be unique within each Region.
     */
    Name: GameSessionQueueName;
    /**
     * The maximum time, in seconds, that a new game session placement request remains in the queue. When a request exceeds this time, the game session placement changes to a TIMED_OUT status. By default, this property is set to 600.
     */
    TimeoutInSeconds?: WholeNumber;
    /**
     * A set of policies that act as a sliding cap on player latency. FleetIQ works to deliver low latency for most players in a game session. These policies ensure that no individual player can be placed into a game with unreasonably high latency. Use multiple policies to gradually relax latency requirements a step at a time. Multiple policies are applied based on their maximum allowed latency, starting with the lowest value.
     */
    PlayerLatencyPolicies?: PlayerLatencyPolicyList;
    /**
     * A list of fleets and/or fleet aliases that can be used to fulfill game session placement requests in the queue. Destinations are identified by either a fleet ARN or a fleet alias ARN, and are listed in order of placement preference.
     */
    Destinations?: GameSessionQueueDestinationList;
    /**
     * A list of locations where a queue is allowed to place new game sessions. Locations are specified in the form of Amazon Web Services Region codes, such as us-west-2. If this parameter is not set, game sessions can be placed in any queue location. 
     */
    FilterConfiguration?: FilterConfiguration;
    /**
     * Custom settings to use when prioritizing destinations and locations for game session placements. This configuration replaces the FleetIQ default prioritization process. Priority types that are not explicitly named will be automatically applied at the end of the prioritization process. 
     */
    PriorityConfiguration?: PriorityConfiguration;
    /**
     * Information to be added to all events that are related to this game session queue.
     */
    CustomEventData?: QueueCustomEventData;
    /**
     * An SNS topic ARN that is set up to receive game session placement notifications. See  Setting up notifications for game session placement.
     */
    NotificationTarget?: QueueSnsArnStringModel;
    /**
     * A list of labels to assign to the new game session queue resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference.
     */
    Tags?: TagList;
  }
  export interface CreateGameSessionQueueOutput {
    /**
     * An object that describes the newly created game session queue.
     */
    GameSessionQueue?: GameSessionQueue;
  }
  export interface CreateLocationInput {
    /**
     * A descriptive name for the custom location.
     */
    LocationName: CustomInputLocationStringModel;
    /**
     * A list of labels to assign to the new matchmaking configuration resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Rareference.
     */
    Tags?: TagList;
  }
  export interface CreateLocationOutput {
    /**
     * The details of the custom location you created.
     */
    Location?: LocationModel;
  }
  export interface CreateMatchmakingConfigurationInput {
    /**
     * A unique identifier for the matchmaking configuration. This name is used to identify the configuration associated with a matchmaking request or ticket.
     */
    Name: MatchmakingIdStringModel;
    /**
     * A human-readable description of the matchmaking configuration. 
     */
    Description?: NonZeroAndMaxString;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift game session queue resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::gamesessionqueue/&lt;queue name&gt;. Queues can be located in any Region. Queues are used to start new Amazon GameLift-hosted game sessions for matches that are created with this matchmaking configuration. If FlexMatchMode is set to STANDALONE, do not set this parameter. 
     */
    GameSessionQueueArns?: QueueArnsList;
    /**
     * The maximum duration, in seconds, that a matchmaking ticket can remain in process before timing out. Requests that fail due to timing out can be resubmitted as needed.
     */
    RequestTimeoutSeconds: MatchmakingRequestTimeoutInteger;
    /**
     * The length of time (in seconds) to wait for players to accept a proposed match, if acceptance is required. 
     */
    AcceptanceTimeoutSeconds?: MatchmakingAcceptanceTimeoutInteger;
    /**
     * A flag that determines whether a match that was created with this configuration must be accepted by the matched players. To require acceptance, set to TRUE. With this option enabled, matchmaking tickets use the status REQUIRES_ACCEPTANCE to indicate when a completed potential match is waiting for player acceptance. 
     */
    AcceptanceRequired: BooleanModel;
    /**
     * A unique identifier for the matchmaking rule set to use with this configuration. You can use either the rule set name or ARN value. A matchmaking configuration can only use rule sets that are defined in the same Region.
     */
    RuleSetName: MatchmakingRuleSetName;
    /**
     * An SNS topic ARN that is set up to receive matchmaking notifications. See  Setting up notifications for matchmaking for more information.
     */
    NotificationTarget?: SnsArnStringModel;
    /**
     * The number of player slots in a match to keep open for future players. For example, if the configuration's rule set specifies a match for a single 10-person team, and the additional player count is set to 2, 10 players will be selected for the match and 2 more player slots will be open for future players. This parameter is not used if FlexMatchMode is set to STANDALONE.
     */
    AdditionalPlayerCount?: WholeNumber;
    /**
     * Information to be added to all events related to this matchmaking configuration. 
     */
    CustomEventData?: CustomEventData;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session). This information is added to the new GameSession object that is created for a successful match. This parameter is not used if FlexMatchMode is set to STANDALONE.
     */
    GameProperties?: GamePropertyList;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process with a request to start a new game session (see Start a Game Session). This information is added to the new GameSession object that is created for a successful match. This parameter is not used if FlexMatchMode is set to STANDALONE.
     */
    GameSessionData?: GameSessionData;
    /**
     * The method used to backfill game sessions that are created with this matchmaking configuration. Specify MANUAL when your game manages backfill requests manually or does not use the match backfill feature. Specify AUTOMATIC to have Amazon GameLift create a backfill request whenever a game session has one or more open slots. Learn more about manual and automatic backfill in  Backfill Existing Games with FlexMatch. Automatic backfill is not available when FlexMatchMode is set to STANDALONE.
     */
    BackfillMode?: BackfillMode;
    /**
     * Indicates whether this matchmaking configuration is being used with Amazon GameLift hosting or as a standalone matchmaking solution.     STANDALONE - FlexMatch forms matches and returns match information, including players and team assignments, in a  MatchmakingSucceeded event.    WITH_QUEUE - FlexMatch forms matches and uses the specified Amazon GameLift queue to start a game session for the match.   
     */
    FlexMatchMode?: FlexMatchMode;
    /**
     * A list of labels to assign to the new matchmaking configuration resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference.
     */
    Tags?: TagList;
  }
  export interface CreateMatchmakingConfigurationOutput {
    /**
     * Object that describes the newly created matchmaking configuration.
     */
    Configuration?: MatchmakingConfiguration;
  }
  export interface CreateMatchmakingRuleSetInput {
    /**
     * A unique identifier for the matchmaking rule set. A matchmaking configuration identifies the rule set it uses by this name value. Note that the rule set name is different from the optional name field in the rule set body.
     */
    Name: MatchmakingIdStringModel;
    /**
     * A collection of matchmaking rules, formatted as a JSON string. Comments are not allowed in JSON, but most elements support a description field.
     */
    RuleSetBody: RuleSetBody;
    /**
     * A list of labels to assign to the new matchmaking rule set resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference.
     */
    Tags?: TagList;
  }
  export interface CreateMatchmakingRuleSetOutput {
    /**
     * The newly created matchmaking rule set.
     */
    RuleSet: MatchmakingRuleSet;
  }
  export interface CreatePlayerSessionInput {
    /**
     * A unique identifier for the game session to add a player to.
     */
    GameSessionId: ArnStringModel;
    /**
     * A unique identifier for a player. Player IDs are developer-defined.
     */
    PlayerId: NonZeroAndMaxString;
    /**
     * Developer-defined information related to a player. Amazon GameLift does not use this data, so it can be formatted as needed for use in the game.
     */
    PlayerData?: PlayerData;
  }
  export interface CreatePlayerSessionOutput {
    /**
     * Object that describes the newly created player session record.
     */
    PlayerSession?: PlayerSession;
  }
  export interface CreatePlayerSessionsInput {
    /**
     * A unique identifier for the game session to add players to.
     */
    GameSessionId: ArnStringModel;
    /**
     * List of unique identifiers for the players to be added.
     */
    PlayerIds: PlayerIdList;
    /**
     * Map of string pairs, each specifying a player ID and a set of developer-defined information related to the player. Amazon GameLift does not use this data, so it can be formatted as needed for use in the game. Any player data strings for player IDs that are not included in the PlayerIds parameter are ignored. 
     */
    PlayerDataMap?: PlayerDataMap;
  }
  export interface CreatePlayerSessionsOutput {
    /**
     * A collection of player session objects created for the added players.
     */
    PlayerSessions?: PlayerSessionList;
  }
  export interface CreateScriptInput {
    /**
     * A descriptive label that is associated with a script. Script names don't need to be unique. You can use UpdateScript to change this value later. 
     */
    Name?: NonZeroAndMaxString;
    /**
     * Version information associated with a build or script. Version strings don't need to be unique. You can use UpdateScript to change this value later. 
     */
    Version?: NonZeroAndMaxString;
    /**
     * The location of the Amazon S3 bucket where a zipped file containing your Realtime scripts is stored. The storage location must specify the Amazon S3 bucket name, the zip file name (the "key"), and a role ARN that allows Amazon GameLift to access the Amazon S3 storage location. The S3 bucket must be in the same Region where you want to create a new script. By default, Amazon GameLift uploads the latest version of the zip file; if you have S3 object versioning turned on, you can use the ObjectVersion parameter to specify an earlier version. 
     */
    StorageLocation?: S3Location;
    /**
     * A data object containing your Realtime scripts and dependencies as a zip file. The zip file can have one or multiple files. Maximum size of a zip file is 5 MB. When using the Amazon Web Services CLI tool to create a script, this parameter is set to the zip file name. It must be prepended with the string "fileb://" to indicate that the file data is a binary object. For example: --zip-file fileb://myRealtimeScript.zip.
     */
    ZipFile?: ZipBlob;
    /**
     * A list of labels to assign to the new script resource. Tags are developer-defined key-value pairs. Tagging Amazon Web Services resources are useful for resource management, access management and cost allocation. For more information, see  Tagging Amazon Web Services Resources in the Amazon Web Services General Reference. Once the resource is created, you can use TagResource, UntagResource, and ListTagsForResource to add, remove, and view tags. The maximum tag limit may be lower than stated. See the Amazon Web Services General Reference for actual tagging limits.
     */
    Tags?: TagList;
  }
  export interface CreateScriptOutput {
    /**
     * The newly created script record with a unique script ID and ARN. The new script's storage location reflects an Amazon S3 location: (1) If the script was uploaded from an S3 bucket under your account, the storage location reflects the information that was provided in the CreateScript request; (2) If the script file was uploaded from a local zip file, the storage location reflects an S3 location controls by the Amazon GameLift service.
     */
    Script?: Script;
  }
  export interface CreateVpcPeeringAuthorizationInput {
    /**
     * A unique identifier for the Amazon Web Services account that you use to manage your Amazon GameLift fleet. You can find your Account ID in the Amazon Web Services Management Console under account settings.
     */
    GameLiftAwsAccountId: NonZeroAndMaxString;
    /**
     * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet. The VPC must be in the same Region as your fleet. To look up a VPC ID, use the VPC Dashboard in the Amazon Web Services Management Console. Learn more about VPC peering in VPC Peering with Amazon GameLift Fleets.
     */
    PeerVpcId: NonZeroAndMaxString;
  }
  export interface CreateVpcPeeringAuthorizationOutput {
    /**
     * Details on the requested VPC peering authorization, including expiration.
     */
    VpcPeeringAuthorization?: VpcPeeringAuthorization;
  }
  export interface CreateVpcPeeringConnectionInput {
    /**
     * A unique identifier for the fleet. You can use either the fleet ID or ARN value. This tells Amazon GameLift which GameLift VPC to peer with. 
     */
    FleetId: FleetId;
    /**
     * A unique identifier for the Amazon Web Services account with the VPC that you want to peer your Amazon GameLift fleet with. You can find your Account ID in the Amazon Web Services Management Console under account settings.
     */
    PeerVpcAwsAccountId: NonZeroAndMaxString;
    /**
     * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet. The VPC must be in the same Region as your fleet. To look up a VPC ID, use the VPC Dashboard in the Amazon Web Services Management Console. Learn more about VPC peering in VPC Peering with Amazon GameLift Fleets.
     */
    PeerVpcId: NonZeroAndMaxString;
  }
  export interface CreateVpcPeeringConnectionOutput {
  }
  export type CustomEventData = string;
  export type CustomInputLocationStringModel = string;
  export type CustomLocationNameOrArnModel = string;
  export interface DeleteAliasInput {
    /**
     * A unique identifier of the alias that you want to delete. You can use either the alias ID or ARN value.
     */
    AliasId: AliasIdOrArn;
  }
  export interface DeleteBuildInput {
    /**
     * A unique identifier for the build to delete. You can use either the build ID or ARN value. 
     */
    BuildId: BuildIdOrArn;
  }
  export interface DeleteFleetInput {
    /**
     * A unique identifier for the fleet to be deleted. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
  }
  export interface DeleteFleetLocationsInput {
    /**
     * A unique identifier for the fleet to delete locations for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * The list of fleet locations to delete. Specify locations in the form of an Amazon Web Services Region code, such as us-west-2.
     */
    Locations: LocationList;
  }
  export interface DeleteFleetLocationsOutput {
    /**
     * A unique identifier for the fleet that location attributes are being deleted for.
     */
    FleetId?: FleetIdOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * The remote locations that are being deleted, with each location status set to DELETING.
     */
    LocationStates?: LocationStateList;
  }
  export interface DeleteGameServerGroupInput {
    /**
     * A unique identifier for the game server group. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * The type of delete to perform. Options include the following:    SAFE_DELETE – (default) Terminates the game server group and Amazon EC2 Auto Scaling group only when it has no game servers that are in UTILIZED status.    FORCE_DELETE – Terminates the game server group, including all active game servers regardless of their utilization status, and the Amazon EC2 Auto Scaling group.     RETAIN – Does a safe delete of the game server group but retains the Amazon EC2 Auto Scaling group as is.  
     */
    DeleteOption?: GameServerGroupDeleteOption;
  }
  export interface DeleteGameServerGroupOutput {
    /**
     * An object that describes the deleted game server group resource, with status updated to DELETE_SCHEDULED. 
     */
    GameServerGroup?: GameServerGroup;
  }
  export interface DeleteGameSessionQueueInput {
    /**
     * A descriptive label that is associated with game session queue. Queue names must be unique within each Region. You can use either the queue ID or ARN value. 
     */
    Name: GameSessionQueueNameOrArn;
  }
  export interface DeleteGameSessionQueueOutput {
  }
  export interface DeleteLocationInput {
    /**
     * The location name of the custom location to be deleted.
     */
    LocationName: CustomLocationNameOrArnModel;
  }
  export interface DeleteLocationOutput {
  }
  export interface DeleteMatchmakingConfigurationInput {
    /**
     * A unique identifier for the matchmaking configuration. You can use either the configuration name or ARN value.
     */
    Name: MatchmakingConfigurationName;
  }
  export interface DeleteMatchmakingConfigurationOutput {
  }
  export interface DeleteMatchmakingRuleSetInput {
    /**
     * A unique identifier for the matchmaking rule set to be deleted. (Note: The rule set name is different from the optional "name" field in the rule set body.) You can use either the rule set name or ARN value.
     */
    Name: MatchmakingRuleSetName;
  }
  export interface DeleteMatchmakingRuleSetOutput {
  }
  export interface DeleteScalingPolicyInput {
    /**
     * A descriptive label that is associated with a fleet's scaling policy. Policy names do not need to be unique.
     */
    Name: NonZeroAndMaxString;
    /**
     * A unique identifier for the fleet to be deleted. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
  }
  export interface DeleteScriptInput {
    /**
     * A unique identifier for the Realtime script to delete. You can use either the script ID or ARN value.
     */
    ScriptId: ScriptIdOrArn;
  }
  export interface DeleteVpcPeeringAuthorizationInput {
    /**
     * A unique identifier for the Amazon Web Services account that you use to manage your Amazon GameLift fleet. You can find your Account ID in the Amazon Web Services Management Console under account settings.
     */
    GameLiftAwsAccountId: NonZeroAndMaxString;
    /**
     * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet. The VPC must be in the same Region as your fleet. To look up a VPC ID, use the VPC Dashboard in the Amazon Web Services Management Console. Learn more about VPC peering in VPC Peering with Amazon GameLift Fleets.
     */
    PeerVpcId: NonZeroAndMaxString;
  }
  export interface DeleteVpcPeeringAuthorizationOutput {
  }
  export interface DeleteVpcPeeringConnectionInput {
    /**
     * A unique identifier for the fleet. This fleet specified must match the fleet referenced in the VPC peering connection record. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetId;
    /**
     * A unique identifier for a VPC peering connection.
     */
    VpcPeeringConnectionId: NonZeroAndMaxString;
  }
  export interface DeleteVpcPeeringConnectionOutput {
  }
  export interface DeregisterComputeInput {
    /**
     * A unique identifier for the fleet the compute resource is currently registered to.
     */
    FleetId: FleetIdOrArn;
    /**
     * The name of the compute resource to remove from the specified Anywhere fleet.
     */
    ComputeName: ComputeNameOrArn;
  }
  export interface DeregisterComputeOutput {
  }
  export interface DeregisterGameServerInput {
    /**
     * A unique identifier for the game server group where the game server is running.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * A custom string that uniquely identifies the game server to deregister.
     */
    GameServerId: GameServerId;
  }
  export interface DescribeAliasInput {
    /**
     * The unique identifier for the fleet alias that you want to retrieve. You can use either the alias ID or ARN value. 
     */
    AliasId: AliasIdOrArn;
  }
  export interface DescribeAliasOutput {
    /**
     * The requested alias resource.
     */
    Alias?: Alias;
  }
  export interface DescribeBuildInput {
    /**
     * A unique identifier for the build to retrieve properties for. You can use either the build ID or ARN value. 
     */
    BuildId: BuildIdOrArn;
  }
  export interface DescribeBuildOutput {
    /**
     * Set of properties describing the requested build.
     */
    Build?: Build;
  }
  export interface DescribeComputeInput {
    /**
     * A unique identifier for the fleet that the compute is registered to. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * The unique identifier of the compute resource to retrieve properties for. For an Anywhere fleet compute, use the registered compute name. For a managed EC2 fleet instance, use the instance ID.
     */
    ComputeName: ComputeNameOrArn;
  }
  export interface DescribeComputeOutput {
    /**
     * The set of properties for the requested compute resource.
     */
    Compute?: Compute;
  }
  export interface DescribeEC2InstanceLimitsInput {
    /**
     * Name of an Amazon EC2 instance type that is supported in Amazon GameLift. A fleet instance type determines the computing resources of each instance in the fleet, including CPU, memory, storage, and networking capacity. Do not specify a value for this parameter to retrieve limits for all instance types.
     */
    EC2InstanceType?: EC2InstanceType;
    /**
     * The name of a remote location to request instance limits for, in the form of an Amazon Web Services Region code such as us-west-2.
     */
    Location?: LocationStringModel;
  }
  export interface DescribeEC2InstanceLimitsOutput {
    /**
     * The maximum number of instances for the specified instance type.
     */
    EC2InstanceLimits?: EC2InstanceLimitList;
  }
  export interface DescribeFleetAttributesInput {
    /**
     * A list of unique fleet identifiers to retrieve attributes for. You can use either the fleet ID or ARN value. To retrieve attributes for all current fleets, do not include this parameter. 
     */
    FleetIds?: FleetIdOrArnList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. This parameter is ignored when the request specifies one or a list of fleet IDs.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. This parameter is ignored when the request specifies one or a list of fleet IDs.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetAttributesOutput {
    /**
     * A collection of objects containing attribute metadata for each requested fleet ID. Attribute objects are returned only for fleets that currently exist.
     */
    FleetAttributes?: FleetAttributesList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetCapacityInput {
    /**
     * A unique identifier for the fleet to retrieve capacity information for. You can use either the fleet ID or ARN value. Leave this parameter empty to retrieve capacity information for all fleets.
     */
    FleetIds?: FleetIdOrArnList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. This parameter is ignored when the request specifies one or a list of fleet IDs.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. This parameter is ignored when the request specifies one or a list of fleet IDs.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetCapacityOutput {
    /**
     * A collection of objects that contains capacity information for each requested fleet ID. Capacity objects are returned only for fleets that currently exist. Changes in desired instance value can take up to 1 minute to be reflected.
     */
    FleetCapacity?: FleetCapacityList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetEventsInput {
    /**
     * A unique identifier for the fleet to get event logs for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * The earliest date to retrieve event logs for. If no start time is specified, this call returns entries starting from when the fleet was created to the specified end time. Format is a number expressed in Unix time as milliseconds (ex: "1469498468.057").
     */
    StartTime?: Timestamp;
    /**
     * The most recent date to retrieve event logs for. If no end time is specified, this call returns entries from the specified start time up to the present. Format is a number expressed in Unix time as milliseconds (ex: "1469498468.057").
     */
    EndTime?: Timestamp;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetEventsOutput {
    /**
     * A collection of objects containing event log entries for the specified fleet.
     */
    Events?: EventList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetLocationAttributesInput {
    /**
     * A unique identifier for the fleet to retrieve remote locations for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A list of fleet locations to retrieve information for. Specify locations in the form of an Amazon Web Services Region code, such as us-west-2.
     */
    Locations?: LocationList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. This limit is not currently enforced.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetLocationAttributesOutput {
    /**
     * A unique identifier for the fleet that location attributes were requested for.
     */
    FleetId?: FleetIdOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     *  Location-specific information on the requested fleet's remote locations.
     */
    LocationAttributes?: LocationAttributesList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetLocationCapacityInput {
    /**
     * A unique identifier for the fleet to request location capacity for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * The fleet location to retrieve capacity information for. Specify a location in the form of an Amazon Web Services Region code, such as us-west-2.
     */
    Location: LocationStringModel;
  }
  export interface DescribeFleetLocationCapacityOutput {
    /**
     * Resource capacity information for the requested fleet location. Capacity objects are returned only for fleets and locations that currently exist. Changes in desired instance value can take up to 1 minute to be reflected.
     */
    FleetCapacity?: FleetCapacity;
  }
  export interface DescribeFleetLocationUtilizationInput {
    /**
     * A unique identifier for the fleet to request location utilization for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * The fleet location to retrieve utilization information for. Specify a location in the form of an Amazon Web Services Region code, such as us-west-2.
     */
    Location: LocationStringModel;
  }
  export interface DescribeFleetLocationUtilizationOutput {
    /**
     * Utilization information for the requested fleet location. Utilization objects are returned only for fleets and locations that currently exist.
     */
    FleetUtilization?: FleetUtilization;
  }
  export interface DescribeFleetPortSettingsInput {
    /**
     * A unique identifier for the fleet to retrieve port settings for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A remote location to check for status of port setting updates. Use the Amazon Web Services Region code format, such as us-west-2.
     */
    Location?: LocationStringModel;
  }
  export interface DescribeFleetPortSettingsOutput {
    /**
     * A unique identifier for the fleet that was requested. 
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * The port settings for the requested fleet ID.
     */
    InboundPermissions?: IpPermissionsList;
    /**
     * The current status of updates to the fleet's port settings in the requested fleet location. A status of PENDING_UPDATE indicates that an update was requested for the fleet but has not yet been completed for the location.
     */
    UpdateStatus?: LocationUpdateStatus;
    /**
     * The requested fleet location, expressed as an Amazon Web Services Region code, such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export interface DescribeFleetUtilizationInput {
    /**
     * A unique identifier for the fleet to retrieve utilization data for. You can use either the fleet ID or ARN value. To retrieve attributes for all current fleets, do not include this parameter. 
     */
    FleetIds?: FleetIdOrArnList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. This parameter is ignored when the request specifies one or a list of fleet IDs.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. This parameter is ignored when the request specifies one or a list of fleet IDs.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeFleetUtilizationOutput {
    /**
     * A collection of objects containing utilization information for each requested fleet ID. Utilization objects are returned only for fleets that currently exist.
     */
    FleetUtilization?: FleetUtilizationList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameServerGroupInput {
    /**
     * A unique identifier for the game server group. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
  }
  export interface DescribeGameServerGroupOutput {
    /**
     * An object with the property settings for the requested game server group resource. 
     */
    GameServerGroup?: GameServerGroup;
  }
  export interface DescribeGameServerInput {
    /**
     * A unique identifier for the game server group where the game server is running.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * A custom string that uniquely identifies the game server information to be retrieved.
     */
    GameServerId: GameServerId;
  }
  export interface DescribeGameServerInstancesInput {
    /**
     * A unique identifier for the game server group. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * The Amazon EC2 instance IDs that you want to retrieve status on. Amazon EC2 instance IDs use a 17-character format, for example: i-1234567890abcdef0. To retrieve all instances in the game server group, leave this parameter empty. 
     */
    InstanceIds?: GameServerInstanceIds;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameServerInstancesOutput {
    /**
     * The collection of requested game server instances.
     */
    GameServerInstances?: GameServerInstances;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameServerOutput {
    /**
     * Object that describes the requested game server.
     */
    GameServer?: GameServer;
  }
  export interface DescribeGameSessionDetailsInput {
    /**
     * A unique identifier for the fleet to retrieve all game sessions active on the fleet. You can use either the fleet ID or ARN value.
     */
    FleetId?: FleetIdOrArn;
    /**
     * A unique identifier for the game session to retrieve. 
     */
    GameSessionId?: ArnStringModel;
    /**
     * A unique identifier for the alias associated with the fleet to retrieve all game sessions for. You can use either the alias ID or ARN value.
     */
    AliasId?: AliasIdOrArn;
    /**
     * A fleet location to get game session details for. You can specify a fleet's home Region or a remote location. Use the Amazon Web Services Region code format, such as us-west-2. 
     */
    Location?: LocationStringModel;
    /**
     * Game session status to filter results on. Possible game session statuses include ACTIVE, TERMINATED, ACTIVATING and TERMINATING (the last two are transitory). 
     */
    StatusFilter?: NonZeroAndMaxString;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameSessionDetailsOutput {
    /**
     * A collection of properties for each game session that matches the request.
     */
    GameSessionDetails?: GameSessionDetailList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameSessionPlacementInput {
    /**
     * A unique identifier for a game session placement to retrieve.
     */
    PlacementId: IdStringModel;
  }
  export interface DescribeGameSessionPlacementOutput {
    /**
     * Object that describes the requested game session placement.
     */
    GameSessionPlacement?: GameSessionPlacement;
  }
  export interface DescribeGameSessionQueuesInput {
    /**
     * A list of queue names to retrieve information for. You can use either the queue ID or ARN value. To request settings for all queues, leave this parameter empty. 
     */
    Names?: GameSessionQueueNameOrArnList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. You can request up to 50 results.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameSessionQueuesOutput {
    /**
     * A collection of objects that describe the requested game session queues.
     */
    GameSessionQueues?: GameSessionQueueList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameSessionsInput {
    /**
     * A unique identifier for the fleet to retrieve game sessions for. You can use either the fleet ID or ARN value. 
     */
    FleetId?: FleetIdOrArn;
    /**
     * A unique identifier for the game session to retrieve. 
     */
    GameSessionId?: ArnStringModel;
    /**
     * A unique identifier for the alias associated with the fleet to retrieve game sessions for. You can use either the alias ID or ARN value.
     */
    AliasId?: AliasIdOrArn;
    /**
     * A fleet location to get game sessions for. You can specify a fleet's home Region or a remote location. Use the Amazon Web Services Region code format, such as us-west-2. 
     */
    Location?: LocationStringModel;
    /**
     * Game session status to filter results on. You can filter on the following states: ACTIVE, TERMINATED, ACTIVATING, and TERMINATING. The last two are transitory and used for only very brief periods of time. 
     */
    StatusFilter?: NonZeroAndMaxString;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeGameSessionsOutput {
    /**
     * A collection of properties for each game session that matches the request.
     */
    GameSessions?: GameSessionList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeInstancesInput {
    /**
     * A unique identifier for the fleet to retrieve instance information for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A unique identifier for an instance to retrieve. Specify an instance ID or leave blank to retrieve all instances in the fleet.
     */
    InstanceId?: InstanceId;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
    /**
     * The name of a location to retrieve instance information for, in the form of an Amazon Web Services Region code such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export interface DescribeInstancesOutput {
    /**
     * A collection of objects containing properties for each instance returned.
     */
    Instances?: InstanceList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeMatchmakingConfigurationsInput {
    /**
     * A unique identifier for the matchmaking configuration(s) to retrieve. You can use either the configuration name or ARN value. To request all existing configurations, leave this parameter empty.
     */
    Names?: MatchmakingConfigurationNameList;
    /**
     * A unique identifier for the matchmaking rule set. You can use either the rule set name or ARN value. Use this parameter to retrieve all matchmaking configurations that use this rule set.
     */
    RuleSetName?: MatchmakingRuleSetName;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. This parameter is limited to 10.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeMatchmakingConfigurationsOutput {
    /**
     * A collection of requested matchmaking configurations.
     */
    Configurations?: MatchmakingConfigurationList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeMatchmakingInput {
    /**
     * A unique identifier for a matchmaking ticket. You can include up to 10 ID values. 
     */
    TicketIds: MatchmakingIdList;
  }
  export interface DescribeMatchmakingOutput {
    /**
     * A collection of existing matchmaking ticket objects matching the request.
     */
    TicketList?: MatchmakingTicketList;
  }
  export interface DescribeMatchmakingRuleSetsInput {
    /**
     * A list of one or more matchmaking rule set names to retrieve details for. (Note: The rule set name is different from the optional "name" field in the rule set body.) You can use either the rule set name or ARN value. 
     */
    Names?: MatchmakingRuleSetNameList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: RuleSetLimit;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeMatchmakingRuleSetsOutput {
    /**
     * A collection of requested matchmaking rule set objects. 
     */
    RuleSets: MatchmakingRuleSetList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribePlayerSessionsInput {
    /**
     * A unique identifier for the game session to retrieve player sessions for.
     */
    GameSessionId?: ArnStringModel;
    /**
     * A unique identifier for a player to retrieve player sessions for.
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * A unique identifier for a player session to retrieve.
     */
    PlayerSessionId?: PlayerSessionId;
    /**
     * Player session status to filter results on. Note that when a PlayerSessionId or PlayerId is provided in a DescribePlayerSessions request, then the PlayerSessionStatusFilter has no effect on the response. Possible player session statuses include the following:    RESERVED -- The player session request has been received, but the player has not yet connected to the server process and/or been validated.     ACTIVE -- The player has been validated by the server process and is currently connected.    COMPLETED -- The player connection has been dropped.    TIMEDOUT -- A player session request was received, but the player did not connect and/or was not validated within the timeout limit (60 seconds).  
     */
    PlayerSessionStatusFilter?: NonZeroAndMaxString;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. If a player session ID is specified, this parameter is ignored.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value. If a player session ID is specified, this parameter is ignored.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribePlayerSessionsOutput {
    /**
     * A collection of objects containing properties for each player session that matches the request.
     */
    PlayerSessions?: PlayerSessionList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeRuntimeConfigurationInput {
    /**
     * A unique identifier for the fleet to get the runtime configuration for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
  }
  export interface DescribeRuntimeConfigurationOutput {
    /**
     * Instructions that describe how server processes should be launched and maintained on each instance in the fleet.
     */
    RuntimeConfiguration?: RuntimeConfiguration;
  }
  export interface DescribeScalingPoliciesInput {
    /**
     * A unique identifier for the fleet for which to retrieve scaling policies. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * Scaling policy status to filter results on. A scaling policy is only in force when in an ACTIVE status.    ACTIVE -- The scaling policy is currently in force.    UPDATEREQUESTED -- A request to update the scaling policy has been received.    UPDATING -- A change is being made to the scaling policy.    DELETEREQUESTED -- A request to delete the scaling policy has been received.    DELETING -- The scaling policy is being deleted.    DELETED -- The scaling policy has been deleted.    ERROR -- An error occurred in creating the policy. It should be removed and recreated.  
     */
    StatusFilter?: ScalingStatusType;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
    /**
     *  The fleet location. If you don't specify this value, the response contains the scaling policies of every location in the fleet. 
     */
    Location?: LocationStringModel;
  }
  export interface DescribeScalingPoliciesOutput {
    /**
     * A collection of objects containing the scaling policies matching the request.
     */
    ScalingPolicies?: ScalingPolicyList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface DescribeScriptInput {
    /**
     * A unique identifier for the Realtime script to retrieve properties for. You can use either the script ID or ARN value.
     */
    ScriptId: ScriptIdOrArn;
  }
  export interface DescribeScriptOutput {
    /**
     * A set of properties describing the requested script.
     */
    Script?: Script;
  }
  export interface DescribeVpcPeeringAuthorizationsInput {
  }
  export interface DescribeVpcPeeringAuthorizationsOutput {
    /**
     * A collection of objects that describe all valid VPC peering operations for the current Amazon Web Services account.
     */
    VpcPeeringAuthorizations?: VpcPeeringAuthorizationList;
  }
  export interface DescribeVpcPeeringConnectionsInput {
    /**
     * A unique identifier for the fleet. You can use either the fleet ID or ARN value.
     */
    FleetId?: FleetId;
  }
  export interface DescribeVpcPeeringConnectionsOutput {
    /**
     * A collection of VPC peering connection records that match the request.
     */
    VpcPeeringConnections?: VpcPeeringConnectionList;
  }
  export interface DesiredPlayerSession {
    /**
     * A unique identifier for a player to associate with the player session.
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * Developer-defined information related to a player. Amazon GameLift does not use this data, so it can be formatted as needed for use in the game.
     */
    PlayerData?: PlayerData;
  }
  export type DesiredPlayerSessionList = DesiredPlayerSession[];
  export type DnsName = string;
  export type DnsNameInput = string;
  export type Double = number;
  export type DoubleObject = number;
  export interface EC2InstanceCounts {
    /**
     * Requested number of active instances. Amazon GameLift takes action as needed to maintain the desired number of instances. Capacity is scaled up or down by changing the desired instances. A change in the desired instances value can take up to 1 minute to be reflected when viewing a fleet's capacity settings. 
     */
    DESIRED?: WholeNumber;
    /**
     * The minimum instance count value allowed.
     */
    MINIMUM?: WholeNumber;
    /**
     * The maximum instance count value allowed.
     */
    MAXIMUM?: WholeNumber;
    /**
     * Number of instances that are starting but not yet active.
     */
    PENDING?: WholeNumber;
    /**
     * Actual number of instances that are ready to host game sessions.
     */
    ACTIVE?: WholeNumber;
    /**
     * Number of active instances that are not currently hosting a game session.
     */
    IDLE?: WholeNumber;
    /**
     * Number of instances that are no longer active but haven't yet been terminated.
     */
    TERMINATING?: WholeNumber;
  }
  export interface EC2InstanceLimit {
    /**
     * The name of an Amazon EC2 instance type. See Amazon Elastic Compute Cloud Instance Types for detailed descriptions. 
     */
    EC2InstanceType?: EC2InstanceType;
    /**
     * The number of instances for the specified type and location that are currently being used by the Amazon Web Services account. 
     */
    CurrentInstances?: WholeNumber;
    /**
     * The number of instances that is allowed for the specified instance type and location.
     */
    InstanceLimit?: WholeNumber;
    /**
     * An Amazon Web Services Region code, such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export type EC2InstanceLimitList = EC2InstanceLimit[];
  export type EC2InstanceType = "t2.micro"|"t2.small"|"t2.medium"|"t2.large"|"c3.large"|"c3.xlarge"|"c3.2xlarge"|"c3.4xlarge"|"c3.8xlarge"|"c4.large"|"c4.xlarge"|"c4.2xlarge"|"c4.4xlarge"|"c4.8xlarge"|"c5.large"|"c5.xlarge"|"c5.2xlarge"|"c5.4xlarge"|"c5.9xlarge"|"c5.12xlarge"|"c5.18xlarge"|"c5.24xlarge"|"c5a.large"|"c5a.xlarge"|"c5a.2xlarge"|"c5a.4xlarge"|"c5a.8xlarge"|"c5a.12xlarge"|"c5a.16xlarge"|"c5a.24xlarge"|"r3.large"|"r3.xlarge"|"r3.2xlarge"|"r3.4xlarge"|"r3.8xlarge"|"r4.large"|"r4.xlarge"|"r4.2xlarge"|"r4.4xlarge"|"r4.8xlarge"|"r4.16xlarge"|"r5.large"|"r5.xlarge"|"r5.2xlarge"|"r5.4xlarge"|"r5.8xlarge"|"r5.12xlarge"|"r5.16xlarge"|"r5.24xlarge"|"r5a.large"|"r5a.xlarge"|"r5a.2xlarge"|"r5a.4xlarge"|"r5a.8xlarge"|"r5a.12xlarge"|"r5a.16xlarge"|"r5a.24xlarge"|"m3.medium"|"m3.large"|"m3.xlarge"|"m3.2xlarge"|"m4.large"|"m4.xlarge"|"m4.2xlarge"|"m4.4xlarge"|"m4.10xlarge"|"m5.large"|"m5.xlarge"|"m5.2xlarge"|"m5.4xlarge"|"m5.8xlarge"|"m5.12xlarge"|"m5.16xlarge"|"m5.24xlarge"|"m5a.large"|"m5a.xlarge"|"m5a.2xlarge"|"m5a.4xlarge"|"m5a.8xlarge"|"m5a.12xlarge"|"m5a.16xlarge"|"m5a.24xlarge"|"c5d.large"|"c5d.xlarge"|"c5d.2xlarge"|"c5d.4xlarge"|"c5d.9xlarge"|"c5d.12xlarge"|"c5d.18xlarge"|"c5d.24xlarge"|"c6a.large"|"c6a.xlarge"|"c6a.2xlarge"|"c6a.4xlarge"|"c6a.8xlarge"|"c6a.12xlarge"|"c6a.16xlarge"|"c6a.24xlarge"|"c6i.large"|"c6i.xlarge"|"c6i.2xlarge"|"c6i.4xlarge"|"c6i.8xlarge"|"c6i.12xlarge"|"c6i.16xlarge"|"c6i.24xlarge"|"r5d.large"|"r5d.xlarge"|"r5d.2xlarge"|"r5d.4xlarge"|"r5d.8xlarge"|"r5d.12xlarge"|"r5d.16xlarge"|"r5d.24xlarge"|"m6g.medium"|"m6g.large"|"m6g.xlarge"|"m6g.2xlarge"|"m6g.4xlarge"|"m6g.8xlarge"|"m6g.12xlarge"|"m6g.16xlarge"|"c6g.medium"|"c6g.large"|"c6g.xlarge"|"c6g.2xlarge"|"c6g.4xlarge"|"c6g.8xlarge"|"c6g.12xlarge"|"c6g.16xlarge"|"r6g.medium"|"r6g.large"|"r6g.xlarge"|"r6g.2xlarge"|"r6g.4xlarge"|"r6g.8xlarge"|"r6g.12xlarge"|"r6g.16xlarge"|"c6gn.medium"|"c6gn.large"|"c6gn.xlarge"|"c6gn.2xlarge"|"c6gn.4xlarge"|"c6gn.8xlarge"|"c6gn.12xlarge"|"c6gn.16xlarge"|"c7g.medium"|"c7g.large"|"c7g.xlarge"|"c7g.2xlarge"|"c7g.4xlarge"|"c7g.8xlarge"|"c7g.12xlarge"|"c7g.16xlarge"|"r7g.medium"|"r7g.large"|"r7g.xlarge"|"r7g.2xlarge"|"r7g.4xlarge"|"r7g.8xlarge"|"r7g.12xlarge"|"r7g.16xlarge"|"m7g.medium"|"m7g.large"|"m7g.xlarge"|"m7g.2xlarge"|"m7g.4xlarge"|"m7g.8xlarge"|"m7g.12xlarge"|"m7g.16xlarge"|"g5g.xlarge"|"g5g.2xlarge"|"g5g.4xlarge"|"g5g.8xlarge"|"g5g.16xlarge"|string;
  export interface Event {
    /**
     * A unique identifier for a fleet event.
     */
    EventId?: NonZeroAndMaxString;
    /**
     * A unique identifier for an event resource, such as a fleet ID.
     */
    ResourceId?: NonZeroAndMaxString;
    /**
     * The type of event being logged.   Fleet state transition events:    FLEET_CREATED -- A fleet resource was successfully created with a status of NEW. Event messaging includes the fleet ID.   FLEET_STATE_DOWNLOADING -- Fleet status changed from NEW to DOWNLOADING. The compressed build has started downloading to a fleet instance for installation.   FLEET_STATE_VALIDATING -- Fleet status changed from DOWNLOADING to VALIDATING. Amazon GameLift has successfully downloaded the build and is now validating the build files.   FLEET_STATE_BUILDING -- Fleet status changed from VALIDATING to BUILDING. Amazon GameLift has successfully verified the build files and is now running the installation scripts.   FLEET_STATE_ACTIVATING -- Fleet status changed from BUILDING to ACTIVATING. Amazon GameLift is trying to launch an instance and test the connectivity between the build and the Amazon GameLift Service via the Server SDK.   FLEET_STATE_ACTIVE -- The fleet's status changed from ACTIVATING to ACTIVE. The fleet is now ready to host game sessions.   FLEET_STATE_ERROR -- The Fleet's status changed to ERROR. Describe the fleet event message for more details.    Fleet creation events (ordered by fleet creation activity):    FLEET_BINARY_DOWNLOAD_FAILED -- The build failed to download to the fleet instance.   FLEET_CREATION_EXTRACTING_BUILD -- The game server build was successfully downloaded to an instance, and the build files are now being extracted from the uploaded build and saved to an instance. Failure at this stage prevents a fleet from moving to ACTIVE status. Logs for this stage display a list of the files that are extracted and saved on the instance. Access the logs by using the URL in PreSignedLogUrl.   FLEET_CREATION_RUNNING_INSTALLER -- The game server build files were successfully extracted, and the GameLift is now running the build's install script (if one is included). Failure in this stage prevents a fleet from moving to ACTIVE status. Logs for this stage list the installation steps and whether or not the install completed successfully. Access the logs by using the URL in PreSignedLogUrl.   FLEET_CREATION_VALIDATING_RUNTIME_CONFIG -- The build process was successful, and the GameLift is now verifying that the game server launch paths, which are specified in the fleet's runtime configuration, exist. If any listed launch path exists, Amazon GameLift tries to launch a game server process and waits for the process to report ready. Failures in this stage prevent a fleet from moving to ACTIVE status. Logs for this stage list the launch paths in the runtime configuration and indicate whether each is found. Access the logs by using the URL in PreSignedLogUrl.   FLEET_VALIDATION_LAUNCH_PATH_NOT_FOUND -- Validation of the runtime configuration failed because the executable specified in a launch path does not exist on the instance.   FLEET_VALIDATION_EXECUTABLE_RUNTIME_FAILURE -- Validation of the runtime configuration failed because the executable specified in a launch path failed to run on the fleet instance.   FLEET_VALIDATION_TIMED_OUT -- Validation of the fleet at the end of creation timed out. Try fleet creation again.   FLEET_ACTIVATION_FAILED -- The fleet failed to successfully complete one of the steps in the fleet activation process. This event code indicates that the game build was successfully downloaded to a fleet instance, built, and validated, but was not able to start a server process. For more information, see Debug Fleet Creation Issues.   FLEET_ACTIVATION_FAILED_NO_INSTANCES -- Fleet creation was not able to obtain any instances based on the input fleet attributes. Try again at a different time or choose a different combination of fleet attributes such as fleet type, instance type, etc.   FLEET_INITIALIZATION_FAILED -- A generic exception occurred during fleet creation. Describe the fleet event message for more details.    VPC peering events:    FLEET_VPC_PEERING_SUCCEEDED -- A VPC peering connection has been established between the VPC for an Amazon GameLift fleet and a VPC in your Amazon Web Services account.   FLEET_VPC_PEERING_FAILED -- A requested VPC peering connection has failed. Event details and status information provide additional detail. A common reason for peering failure is that the two VPCs have overlapping CIDR blocks of IPv4 addresses. To resolve this, change the CIDR block for the VPC in your Amazon Web Services account. For more information on VPC peering failures, see https://docs.aws.amazon.com/AmazonVPC/latest/PeeringGuide/invalid-peering-configurations.html    FLEET_VPC_PEERING_DELETED -- A VPC peering connection has been successfully deleted.    Spot instance events:     INSTANCE_INTERRUPTED -- A spot instance was interrupted by EC2 with a two-minute notification.   INSTANCE_RECYCLED -- A spot instance was determined to have a high risk of interruption and is scheduled to be recycled once it has no active game sessions.    Server process events:    SERVER_PROCESS_INVALID_PATH -- The game server executable or script could not be found based on the Fleet runtime configuration. Check that the launch path is correct based on the operating system of the Fleet.   SERVER_PROCESS_SDK_INITIALIZATION_TIMEOUT -- The server process did not call InitSDK() within the time expected. Check your game session log to see why InitSDK() was not called in time.   SERVER_PROCESS_PROCESS_READY_TIMEOUT -- The server process did not call ProcessReady() within the time expected after calling InitSDK(). Check your game session log to see why ProcessReady() was not called in time.   SERVER_PROCESS_CRASHED -- The server process exited without calling ProcessEnding(). Check your game session log to see why ProcessEnding() was not called.   SERVER_PROCESS_TERMINATED_UNHEALTHY -- The server process did not report a valid health check for too long and was therefore terminated by GameLift. Check your game session log to see if the thread became stuck processing a synchronous task for too long.   SERVER_PROCESS_FORCE_TERMINATED -- The server process did not exit cleanly after OnProcessTerminate() was sent within the time expected. Check your game session log to see why termination took longer than expected.   SERVER_PROCESS_PROCESS_EXIT_TIMEOUT -- The server process did not exit cleanly within the time expected after calling ProcessEnding(). Check your game session log to see why termination took longer than expected.    Game session events:    GAME_SESSION_ACTIVATION_TIMEOUT -- GameSession failed to activate within the expected time. Check your game session log to see why ActivateGameSession() took longer to complete than expected.    Other fleet events:    FLEET_SCALING_EVENT -- A change was made to the fleet's capacity settings (desired instances, minimum/maximum scaling limits). Event messaging includes the new capacity settings.   FLEET_NEW_GAME_SESSION_PROTECTION_POLICY_UPDATED -- A change was made to the fleet's game session protection policy setting. Event messaging includes both the old and new policy setting.    FLEET_DELETED -- A request to delete a fleet was initiated.    GENERIC_EVENT -- An unspecified event has occurred.  
     */
    EventCode?: EventCode;
    /**
     * Additional information related to the event.
     */
    Message?: NonEmptyString;
    /**
     * Time stamp indicating when this event occurred. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    EventTime?: Timestamp;
    /**
     * Location of stored logs with additional detail that is related to the event. This is useful for debugging issues. The URL is valid for 15 minutes. You can also access fleet creation logs through the Amazon GameLift console.
     */
    PreSignedLogUrl?: NonZeroAndMaxString;
  }
  export type EventCode = "GENERIC_EVENT"|"FLEET_CREATED"|"FLEET_DELETED"|"FLEET_SCALING_EVENT"|"FLEET_STATE_DOWNLOADING"|"FLEET_STATE_VALIDATING"|"FLEET_STATE_BUILDING"|"FLEET_STATE_ACTIVATING"|"FLEET_STATE_ACTIVE"|"FLEET_STATE_ERROR"|"FLEET_INITIALIZATION_FAILED"|"FLEET_BINARY_DOWNLOAD_FAILED"|"FLEET_VALIDATION_LAUNCH_PATH_NOT_FOUND"|"FLEET_VALIDATION_EXECUTABLE_RUNTIME_FAILURE"|"FLEET_VALIDATION_TIMED_OUT"|"FLEET_ACTIVATION_FAILED"|"FLEET_ACTIVATION_FAILED_NO_INSTANCES"|"FLEET_NEW_GAME_SESSION_PROTECTION_POLICY_UPDATED"|"SERVER_PROCESS_INVALID_PATH"|"SERVER_PROCESS_SDK_INITIALIZATION_TIMEOUT"|"SERVER_PROCESS_PROCESS_READY_TIMEOUT"|"SERVER_PROCESS_CRASHED"|"SERVER_PROCESS_TERMINATED_UNHEALTHY"|"SERVER_PROCESS_FORCE_TERMINATED"|"SERVER_PROCESS_PROCESS_EXIT_TIMEOUT"|"GAME_SESSION_ACTIVATION_TIMEOUT"|"FLEET_CREATION_EXTRACTING_BUILD"|"FLEET_CREATION_RUNNING_INSTALLER"|"FLEET_CREATION_VALIDATING_RUNTIME_CONFIG"|"FLEET_VPC_PEERING_SUCCEEDED"|"FLEET_VPC_PEERING_FAILED"|"FLEET_VPC_PEERING_DELETED"|"INSTANCE_INTERRUPTED"|"INSTANCE_RECYCLED"|string;
  export type EventList = Event[];
  export interface FilterConfiguration {
    /**
     *  A list of locations to allow game session placement in, in the form of Amazon Web Services Region codes such as us-west-2. 
     */
    AllowedLocations?: LocationList;
  }
  export type FilterInstanceStatus = "ACTIVE"|"DRAINING"|string;
  export type FilterInstanceStatuses = FilterInstanceStatus[];
  export type FleetAction = "AUTO_SCALING"|string;
  export type FleetActionList = FleetAction[];
  export type FleetArn = string;
  export interface FleetAttributes {
    /**
     * A unique identifier for the fleet.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912. In a GameLift fleet ARN, the resource ID matches the FleetId value.
     */
    FleetArn?: FleetArn;
    /**
     * Indicates whether to use On-Demand or Spot instances for this fleet. By default, this property is set to ON_DEMAND. Learn more about when to use  On-Demand versus Spot Instances. This property cannot be changed after the fleet is created.
     */
    FleetType?: FleetType;
    /**
     * The Amazon EC2 instance type that determines the computing resources of each instance in the fleet. Instance type defines the CPU, memory, storage, and networking capacity. See Amazon Elastic Compute Cloud Instance Types for detailed descriptions.
     */
    InstanceType?: EC2InstanceType;
    /**
     * A human-readable description of the fleet.
     */
    Description?: NonZeroAndMaxString;
    /**
     * A descriptive label that is associated with a fleet. Fleet names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp indicating when this data object was terminated. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    TerminationTime?: Timestamp;
    /**
     * Current status of the fleet. Possible fleet statuses include the following:    NEW -- A new fleet has been defined and desired instances is set to 1.     DOWNLOADING/VALIDATING/BUILDING/ACTIVATING -- Amazon GameLift is setting up the new fleet, creating new instances with the game build or Realtime script and starting server processes.    ACTIVE -- Hosts can now accept game sessions.    ERROR -- An error occurred when downloading, validating, building, or activating the fleet.    DELETING -- Hosts are responding to a delete fleet request.    TERMINATED -- The fleet no longer exists.  
     */
    Status?: FleetStatus;
    /**
     * A unique identifier for the build resource that is deployed on instances in this fleet.
     */
    BuildId?: BuildId;
    /**
     *  The Amazon Resource Name (ARN) associated with the Amazon GameLift build resource that is deployed on instances in this fleet. In a GameLift build ARN, the resource ID matches the BuildId value.
     */
    BuildArn?: BuildArn;
    /**
     * A unique identifier for the Realtime script resource that is deployed on instances in this fleet.
     */
    ScriptId?: ScriptId;
    /**
     *  The Amazon Resource Name (ARN) associated with the GameLift script resource that is deployed on instances in this fleet. In a GameLift script ARN, the resource ID matches the ScriptId value.
     */
    ScriptArn?: ScriptArn;
    /**
     *  This parameter is no longer used. Server launch paths are now defined using the fleet's RuntimeConfiguration . Requests that use this parameter instead continue to be valid.
     */
    ServerLaunchPath?: LaunchPathStringModel;
    /**
     *  This parameter is no longer used. Server launch parameters are now defined using the fleet's runtime configuration . Requests that use this parameter instead continue to be valid.
     */
    ServerLaunchParameters?: LaunchParametersStringModel;
    /**
     *  This parameter is no longer used. Game session log paths are now defined using the Amazon GameLift server API ProcessReady() logParameters. See more information in the Server API Reference. 
     */
    LogPaths?: StringList;
    /**
     * The type of game session protection to set on all new instances that are started in the fleet.    NoProtection -- The game session can be terminated during a scale-down event.    FullProtection -- If the game session is in an ACTIVE status, it cannot be terminated during a scale-down event.  
     */
    NewGameSessionProtectionPolicy?: ProtectionPolicy;
    /**
     * The operating system of the fleet's computing resources. A fleet's operating system is determined by the OS of the build or script that is deployed on this fleet.
     */
    OperatingSystem?: OperatingSystem;
    ResourceCreationLimitPolicy?: ResourceCreationLimitPolicy;
    /**
     * Name of a metric group that metrics for this fleet are added to. In Amazon CloudWatch, you can view aggregated metrics for fleets that are in a metric group. A fleet can be included in only one metric group at a time.
     */
    MetricGroups?: MetricGroupList;
    /**
     * A list of fleet activity that has been suspended using StopFleetActions . This includes fleet auto-scaling.
     */
    StoppedActions?: FleetActionList;
    /**
     * A unique identifier for an IAM role that manages access to your Amazon Web Services services. With an instance role ARN set, any application that runs on an instance in this fleet can assume the role, including install scripts, server processes, and daemons (background processes). Create a role or look up a role's ARN by using the IAM dashboard in the Amazon Web Services Management Console. Learn more about using on-box credentials for your game servers at  Access external resources from a game server.
     */
    InstanceRoleArn?: NonEmptyString;
    CertificateConfiguration?: CertificateConfiguration;
    /**
     * The type of compute resource used to host your game servers. You can use your own compute resources with Amazon GameLift Anywhere or use Amazon EC2 instances with managed Amazon GameLift.
     */
    ComputeType?: ComputeType;
    AnywhereConfiguration?: AnywhereConfiguration;
  }
  export type FleetAttributesList = FleetAttributes[];
  export interface FleetCapacity {
    /**
     * A unique identifier for the fleet associated with the location.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * The Amazon EC2 instance type that is used for all instances in a fleet. The instance type determines the computing resources in use, including CPU, memory, storage, and networking capacity. See Amazon Elastic Compute Cloud Instance Types for detailed descriptions.
     */
    InstanceType?: EC2InstanceType;
    InstanceCounts?: EC2InstanceCounts;
    /**
     * The fleet location for the instance count information, expressed as an Amazon Web Services Region code, such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export type FleetCapacityList = FleetCapacity[];
  export type FleetId = string;
  export type FleetIdList = FleetId[];
  export type FleetIdOrArn = string;
  export type FleetIdOrArnList = FleetIdOrArn[];
  export type FleetStatus = "NEW"|"DOWNLOADING"|"VALIDATING"|"BUILDING"|"ACTIVATING"|"ACTIVE"|"DELETING"|"ERROR"|"TERMINATED"|"NOT_FOUND"|string;
  export type FleetType = "ON_DEMAND"|"SPOT"|string;
  export interface FleetUtilization {
    /**
     * A unique identifier for the fleet associated with the location.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * The number of server processes in ACTIVE status that are currently running across all instances in the fleet location. 
     */
    ActiveServerProcessCount?: WholeNumber;
    /**
     * The number of active game sessions that are currently being hosted across all instances in the fleet location.
     */
    ActiveGameSessionCount?: WholeNumber;
    /**
     * The number of active player sessions that are currently being hosted across all instances in the fleet location.
     */
    CurrentPlayerSessionCount?: WholeNumber;
    /**
     * The maximum number of players allowed across all game sessions that are currently being hosted across all instances in the fleet location.
     */
    MaximumPlayerSessionCount?: WholeNumber;
    /**
     * The fleet location for the fleet utilization information, expressed as an Amazon Web Services Region code, such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export type FleetUtilizationList = FleetUtilization[];
  export type FlexMatchMode = "STANDALONE"|"WITH_QUEUE"|string;
  export type Float = number;
  export type FreeText = string;
  export type GameLiftServiceSdkEndpointOutput = string;
  export interface GameProperty {
    /**
     * The game property identifier.
     */
    Key: GamePropertyKey;
    /**
     * The game property value.
     */
    Value: GamePropertyValue;
  }
  export type GamePropertyKey = string;
  export type GamePropertyList = GameProperty[];
  export type GamePropertyValue = string;
  export interface GameServer {
    /**
     * A unique identifier for the game server group where the game server is running.
     */
    GameServerGroupName?: GameServerGroupName;
    /**
     * The ARN identifier for the game server group where the game server is located.
     */
    GameServerGroupArn?: GameServerGroupArn;
    /**
     * A custom string that uniquely identifies the game server. Game server IDs are developer-defined and are unique across all game server groups in an Amazon Web Services account.
     */
    GameServerId?: GameServerId;
    /**
     * The unique identifier for the instance where the game server is running. This ID is available in the instance metadata. EC2 instance IDs use a 17-character format, for example: i-1234567890abcdef0.
     */
    InstanceId?: GameServerInstanceId;
    /**
     * The port and IP address that must be used to establish a client connection to the game server.
     */
    ConnectionInfo?: GameServerConnectionInfo;
    /**
     * A set of custom game server properties, formatted as a single string value. This data is passed to a game client or service when it requests information on game servers.
     */
    GameServerData?: GameServerData;
    /**
     * Indicates when an available game server has been reserved for gameplay but has not yet started hosting a game. Once it is claimed, the game server remains in CLAIMED status for a maximum of one minute. During this time, game clients connect to the game server to start the game and trigger the game server to update its utilization status. After one minute, the game server claim status reverts to null.
     */
    ClaimStatus?: GameServerClaimStatus;
    /**
     * Indicates whether the game server is currently available for new games or is busy. Possible statuses include:    AVAILABLE - The game server is available to be claimed. A game server that has been claimed remains in this status until it reports game hosting activity.     UTILIZED - The game server is currently hosting a game session with players.   
     */
    UtilizationStatus?: GameServerUtilizationStatus;
    /**
     * Timestamp that indicates when the game server registered. The format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    RegistrationTime?: Timestamp;
    /**
     * Timestamp that indicates the last time the game server was claimed. The format is a number expressed in Unix time as milliseconds (for example "1469498468.057"). This value is used to calculate when a claimed game server's status should revert to null.
     */
    LastClaimTime?: Timestamp;
    /**
     * Timestamp that indicates the last time the game server was updated with health status. The format is a number expressed in Unix time as milliseconds (for example "1469498468.057"). After game server registration, this property is only changed when a game server update specifies a health check value.
     */
    LastHealthCheckTime?: Timestamp;
  }
  export type GameServerClaimStatus = "CLAIMED"|string;
  export type GameServerConnectionInfo = string;
  export type GameServerData = string;
  export interface GameServerGroup {
    /**
     * A developer-defined identifier for the game server group. The name is unique for each Region in each Amazon Web Services account.
     */
    GameServerGroupName?: GameServerGroupName;
    /**
     * A generated unique ID for the game server group.
     */
    GameServerGroupArn?: GameServerGroupArn;
    /**
     * The Amazon Resource Name (ARN) for an IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
     */
    RoleArn?: IamRoleArn;
    /**
     * The set of Amazon EC2 instance types that Amazon GameLift FleetIQ can use when balancing and automatically scaling instances in the corresponding Auto Scaling group. 
     */
    InstanceDefinitions?: InstanceDefinitions;
    /**
     * Indicates how Amazon GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group. Method options include the following:    SPOT_ONLY - Only Spot Instances are used in the game server group. If Spot Instances are unavailable or not viable for game hosting, the game server group provides no hosting capacity until Spot Instances can again be used. Until then, no new instances are started, and the existing nonviable Spot Instances are terminated (after current gameplay ends) and are not replaced.    SPOT_PREFERRED - (default value) Spot Instances are used whenever available in the game server group. If Spot Instances are unavailable, the game server group continues to provide hosting capacity by falling back to On-Demand Instances. Existing nonviable Spot Instances are terminated (after current gameplay ends) and are replaced with new On-Demand Instances.    ON_DEMAND_ONLY - Only On-Demand Instances are used in the game server group. No Spot Instances are used, even when available, while this balancing strategy is in force.  
     */
    BalancingStrategy?: BalancingStrategy;
    /**
     * A flag that indicates whether instances in the game server group are protected from early termination. Unprotected instances that have active game servers running might be terminated during a scale-down event, causing players to be dropped from the game. Protected instances cannot be terminated while there are active game servers running except in the event of a forced game server group deletion (see ). An exception to this is with Spot Instances, which can be terminated by Amazon Web Services regardless of protection status. 
     */
    GameServerProtectionPolicy?: GameServerProtectionPolicy;
    /**
     * A generated unique ID for the Amazon EC2 Auto Scaling group that is associated with this game server group.
     */
    AutoScalingGroupArn?: AutoScalingGroupArn;
    /**
     * The current status of the game server group. Possible statuses include:    NEW - Amazon GameLift FleetIQ has validated the CreateGameServerGroup() request.     ACTIVATING - Amazon GameLift FleetIQ is setting up a game server group, which includes creating an Auto Scaling group in your Amazon Web Services account.     ACTIVE - The game server group has been successfully created.     DELETE_SCHEDULED - A request to delete the game server group has been received.     DELETING - Amazon GameLift FleetIQ has received a valid DeleteGameServerGroup() request and is processing it. Amazon GameLift FleetIQ must first complete and release hosts before it deletes the Auto Scaling group and the game server group.     DELETED - The game server group has been successfully deleted.     ERROR - The asynchronous processes of activating or deleting a game server group has failed, resulting in an error state.  
     */
    Status?: GameServerGroupStatus;
    /**
     * Additional information about the current game server group status. This information might provide additional insight on groups that are in ERROR status.
     */
    StatusReason?: NonZeroAndMaxString;
    /**
     * A list of activities that are currently suspended for this game server group. If this property is empty, all activities are occurring.
     */
    SuspendedActions?: GameServerGroupActions;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * A timestamp that indicates when this game server group was last updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type GameServerGroupAction = "REPLACE_INSTANCE_TYPES"|string;
  export type GameServerGroupActions = GameServerGroupAction[];
  export type GameServerGroupArn = string;
  export interface GameServerGroupAutoScalingPolicy {
    /**
     * Length of time, in seconds, it takes for a new instance to start new game server processes and register with Amazon GameLift FleetIQ. Specifying a warm-up time can be useful, particularly with game servers that take a long time to start up, because it avoids prematurely starting new instances. 
     */
    EstimatedInstanceWarmup?: PositiveInteger;
    /**
     * Settings for a target-based scaling policy applied to Auto Scaling group. These settings are used to create a target-based policy that tracks the Amazon GameLift FleetIQ metric "PercentUtilizedGameServers" and specifies a target value for the metric. As player usage changes, the policy triggers to adjust the game server group capacity so that the metric returns to the target value. 
     */
    TargetTrackingConfiguration: TargetTrackingConfiguration;
  }
  export type GameServerGroupDeleteOption = "SAFE_DELETE"|"FORCE_DELETE"|"RETAIN"|string;
  export type GameServerGroupInstanceType = "c4.large"|"c4.xlarge"|"c4.2xlarge"|"c4.4xlarge"|"c4.8xlarge"|"c5.large"|"c5.xlarge"|"c5.2xlarge"|"c5.4xlarge"|"c5.9xlarge"|"c5.12xlarge"|"c5.18xlarge"|"c5.24xlarge"|"c5a.large"|"c5a.xlarge"|"c5a.2xlarge"|"c5a.4xlarge"|"c5a.8xlarge"|"c5a.12xlarge"|"c5a.16xlarge"|"c5a.24xlarge"|"c6g.medium"|"c6g.large"|"c6g.xlarge"|"c6g.2xlarge"|"c6g.4xlarge"|"c6g.8xlarge"|"c6g.12xlarge"|"c6g.16xlarge"|"r4.large"|"r4.xlarge"|"r4.2xlarge"|"r4.4xlarge"|"r4.8xlarge"|"r4.16xlarge"|"r5.large"|"r5.xlarge"|"r5.2xlarge"|"r5.4xlarge"|"r5.8xlarge"|"r5.12xlarge"|"r5.16xlarge"|"r5.24xlarge"|"r5a.large"|"r5a.xlarge"|"r5a.2xlarge"|"r5a.4xlarge"|"r5a.8xlarge"|"r5a.12xlarge"|"r5a.16xlarge"|"r5a.24xlarge"|"r6g.medium"|"r6g.large"|"r6g.xlarge"|"r6g.2xlarge"|"r6g.4xlarge"|"r6g.8xlarge"|"r6g.12xlarge"|"r6g.16xlarge"|"m4.large"|"m4.xlarge"|"m4.2xlarge"|"m4.4xlarge"|"m4.10xlarge"|"m5.large"|"m5.xlarge"|"m5.2xlarge"|"m5.4xlarge"|"m5.8xlarge"|"m5.12xlarge"|"m5.16xlarge"|"m5.24xlarge"|"m5a.large"|"m5a.xlarge"|"m5a.2xlarge"|"m5a.4xlarge"|"m5a.8xlarge"|"m5a.12xlarge"|"m5a.16xlarge"|"m5a.24xlarge"|"m6g.medium"|"m6g.large"|"m6g.xlarge"|"m6g.2xlarge"|"m6g.4xlarge"|"m6g.8xlarge"|"m6g.12xlarge"|"m6g.16xlarge"|string;
  export type GameServerGroupName = string;
  export type GameServerGroupNameOrArn = string;
  export type GameServerGroupStatus = "NEW"|"ACTIVATING"|"ACTIVE"|"DELETE_SCHEDULED"|"DELETING"|"DELETED"|"ERROR"|string;
  export type GameServerGroups = GameServerGroup[];
  export type GameServerHealthCheck = "HEALTHY"|string;
  export type GameServerId = string;
  export interface GameServerInstance {
    /**
     * A developer-defined identifier for the game server group that includes the game server instance. The name is unique for each Region in each Amazon Web Services account.
     */
    GameServerGroupName?: GameServerGroupName;
    /**
     * A generated unique identifier for the game server group that includes the game server instance. 
     */
    GameServerGroupArn?: GameServerGroupArn;
    /**
     * The unique identifier for the instance where the game server is running. This ID is available in the instance metadata. EC2 instance IDs use a 17-character format, for example: i-1234567890abcdef0.
     */
    InstanceId?: GameServerInstanceId;
    /**
     * Current status of the game server instance
     */
    InstanceStatus?: GameServerInstanceStatus;
  }
  export type GameServerInstanceId = string;
  export type GameServerInstanceIds = GameServerInstanceId[];
  export type GameServerInstanceStatus = "ACTIVE"|"DRAINING"|"SPOT_TERMINATING"|string;
  export type GameServerInstances = GameServerInstance[];
  export type GameServerProtectionPolicy = "NO_PROTECTION"|"FULL_PROTECTION"|string;
  export type GameServerUtilizationStatus = "AVAILABLE"|"UTILIZED"|string;
  export type GameServers = GameServer[];
  export interface GameSession {
    /**
     * A unique identifier for the game session. A game session ARN has the following format: arn:aws:gamelift:&lt;region&gt;::gamesession/&lt;fleet ID&gt;/&lt;custom ID string or idempotency token&gt;.
     */
    GameSessionId?: NonZeroAndMaxString;
    /**
     * A descriptive label that is associated with a game session. Session names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * A unique identifier for the fleet that the game session is running on.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) associated with the GameLift fleet that this game session is running on. 
     */
    FleetArn?: FleetArn;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp indicating when this data object was terminated. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    TerminationTime?: Timestamp;
    /**
     * Number of players currently in the game session.
     */
    CurrentPlayerSessionCount?: WholeNumber;
    /**
     * The maximum number of players that can be connected simultaneously to the game session.
     */
    MaximumPlayerSessionCount?: WholeNumber;
    /**
     * Current status of the game session. A game session must have an ACTIVE status to have player sessions.
     */
    Status?: GameSessionStatus;
    /**
     * Provides additional information about game session status. INTERRUPTED indicates that the game session was hosted on a spot instance that was reclaimed, causing the active game session to be terminated.
     */
    StatusReason?: GameSessionStatusReason;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session).
     */
    GameProperties?: GamePropertyList;
    /**
     * The IP address of the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number.
     */
    IpAddress?: IpAddress;
    /**
     * The DNS identifier assigned to the instance that is running the game session. Values have the following format:   TLS-enabled fleets: &lt;unique identifier&gt;.&lt;region identifier&gt;.amazongamelift.com.   Non-TLS-enabled fleets: ec2-&lt;unique identifier&gt;.compute.amazonaws.com. (See Amazon EC2 Instance IP Addressing.)   When connecting to a game session that is running on a TLS-enabled fleet, you must use the DNS name, not the IP address.
     */
    DnsName?: DnsName;
    /**
     * The port number for the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number.
     */
    Port?: PortNumber;
    /**
     * Indicates whether or not the game session is accepting new players.
     */
    PlayerSessionCreationPolicy?: PlayerSessionCreationPolicy;
    /**
     * A unique identifier for a player. This ID is used to enforce a resource protection policy (if one exists), that limits the number of game sessions a player can create.
     */
    CreatorId?: NonZeroAndMaxString;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process with a request to start a new game session (see Start a Game Session).
     */
    GameSessionData?: LargeGameSessionData;
    /**
     * Information about the matchmaking process that resulted in the game session, if matchmaking was used. Data is in JSON syntax, formatted as a string. Information includes the matchmaker ID as well as player attributes and team assignments. For more details on matchmaker data, see Match Data. Matchmaker data is updated whenever new players are added during a successful backfill (see StartMatchBackfill). 
     */
    MatchmakerData?: MatchmakerData;
    /**
     * The fleet location where the game session is running. This value might specify the fleet's home Region or a remote location. Location is expressed as an Amazon Web Services Region code such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export type GameSessionActivationTimeoutSeconds = number;
  export interface GameSessionConnectionInfo {
    /**
     * A unique identifier for the game session. Use the game session ID.
     */
    GameSessionArn?: ArnStringModel;
    /**
     * The IP address of the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number.
     */
    IpAddress?: IpAddress;
    /**
     * The DNS identifier assigned to the instance that is running the game session. Values have the following format:   TLS-enabled fleets: &lt;unique identifier&gt;.&lt;region identifier&gt;.amazongamelift.com.   Non-TLS-enabled fleets: ec2-&lt;unique identifier&gt;.compute.amazonaws.com. (See Amazon EC2 Instance IP Addressing.)   When connecting to a game session that is running on a TLS-enabled fleet, you must use the DNS name, not the IP address.
     */
    DnsName?: DnsName;
    /**
     * The port number for the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number.
     */
    Port?: PositiveInteger;
    /**
     * A collection of player session IDs, one for each player ID that was included in the original matchmaking request. 
     */
    MatchedPlayerSessions?: MatchedPlayerSessionList;
  }
  export type GameSessionData = string;
  export interface GameSessionDetail {
    /**
     * Object that describes a game session.
     */
    GameSession?: GameSession;
    /**
     * Current status of protection for the game session.    NoProtection -- The game session can be terminated during a scale-down event.    FullProtection -- If the game session is in an ACTIVE status, it cannot be terminated during a scale-down event.  
     */
    ProtectionPolicy?: ProtectionPolicy;
  }
  export type GameSessionDetailList = GameSessionDetail[];
  export type GameSessionList = GameSession[];
  export interface GameSessionPlacement {
    /**
     * A unique identifier for a game session placement.
     */
    PlacementId?: IdStringModel;
    /**
     * A descriptive label that is associated with game session queue. Queue names must be unique within each Region.
     */
    GameSessionQueueName?: GameSessionQueueName;
    /**
     * Current status of the game session placement request.    PENDING -- The placement request is in the queue waiting to be processed. Game session properties are not yet final.     FULFILLED -- A new game session has been successfully placed. Game session properties are now final.    CANCELLED -- The placement request was canceled.    TIMED_OUT -- A new game session was not successfully created before the time limit expired. You can resubmit the placement request as needed.    FAILED -- Amazon GameLift is not able to complete the process of placing the game session. Common reasons are the game session terminated before the placement process was completed, or an unexpected internal error.  
     */
    Status?: GameSessionPlacementState;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session).
     */
    GameProperties?: GamePropertyList;
    /**
     * The maximum number of players that can be connected simultaneously to the game session.
     */
    MaximumPlayerSessionCount?: WholeNumber;
    /**
     * A descriptive label that is associated with a game session. Session names do not need to be unique.
     */
    GameSessionName?: NonZeroAndMaxString;
    /**
     * A unique identifier for the game session. This value isn't final until placement status is FULFILLED.
     */
    GameSessionId?: NonZeroAndMaxString;
    /**
     * Identifier for the game session created by this placement request. This identifier is unique across all Regions. This value isn't final until placement status is FULFILLED.
     */
    GameSessionArn?: NonZeroAndMaxString;
    /**
     * Name of the Region where the game session created by this placement request is running. This value isn't final until placement status is FULFILLED.
     */
    GameSessionRegion?: NonZeroAndMaxString;
    /**
     * A set of values, expressed in milliseconds, that indicates the amount of latency that a player experiences when connected to Amazon Web Services Regions.
     */
    PlayerLatencies?: PlayerLatencyList;
    /**
     * Time stamp indicating when this request was placed in the queue. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    StartTime?: Timestamp;
    /**
     * Time stamp indicating when this request was completed, canceled, or timed out.
     */
    EndTime?: Timestamp;
    /**
     * The IP address of the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number. This value isn't final until placement status is FULFILLED. 
     */
    IpAddress?: IpAddress;
    /**
     * The DNS identifier assigned to the instance that is running the game session. Values have the following format:   TLS-enabled fleets: &lt;unique identifier&gt;.&lt;region identifier&gt;.amazongamelift.com.   Non-TLS-enabled fleets: ec2-&lt;unique identifier&gt;.compute.amazonaws.com. (See Amazon EC2 Instance IP Addressing.)   When connecting to a game session that is running on a TLS-enabled fleet, you must use the DNS name, not the IP address.
     */
    DnsName?: DnsName;
    /**
     * The port number for the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number. This value isn't final until placement status is FULFILLED.
     */
    Port?: PortNumber;
    /**
     * A collection of information on player sessions created in response to the game session placement request. These player sessions are created only after a new game session is successfully placed (placement status is FULFILLED). This information includes the player ID, provided in the placement request, and a corresponding player session ID.
     */
    PlacedPlayerSessions?: PlacedPlayerSessionList;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process in the GameSession object with a request to start a new game session (see Start a Game Session).
     */
    GameSessionData?: LargeGameSessionData;
    /**
     * Information on the matchmaking process for this game. Data is in JSON syntax, formatted as a string. It identifies the matchmaking configuration used to create the match, and contains data on all players assigned to the match, including player attributes and team assignments. For more details on matchmaker data, see Match Data.
     */
    MatchmakerData?: MatchmakerData;
  }
  export type GameSessionPlacementState = "PENDING"|"FULFILLED"|"CANCELLED"|"TIMED_OUT"|"FAILED"|string;
  export interface GameSessionQueue {
    /**
     * A descriptive label that is associated with game session queue. Queue names must be unique within each Region.
     */
    Name?: GameSessionQueueName;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift game session queue resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::gamesessionqueue/&lt;queue name&gt;. In a Amazon GameLift game session queue ARN, the resource ID matches the Name value.
     */
    GameSessionQueueArn?: GameSessionQueueArn;
    /**
     * The maximum time, in seconds, that a new game session placement request remains in the queue. When a request exceeds this time, the game session placement changes to a TIMED_OUT status. By default, this property is set to 600.
     */
    TimeoutInSeconds?: WholeNumber;
    /**
     * A set of policies that act as a sliding cap on player latency. FleetIQ works to deliver low latency for most players in a game session. These policies ensure that no individual player can be placed into a game with unreasonably high latency. Use multiple policies to gradually relax latency requirements a step at a time. Multiple policies are applied based on their maximum allowed latency, starting with the lowest value. 
     */
    PlayerLatencyPolicies?: PlayerLatencyPolicyList;
    /**
     * A list of fleets and/or fleet aliases that can be used to fulfill game session placement requests in the queue. Destinations are identified by either a fleet ARN or a fleet alias ARN, and are listed in order of placement preference.
     */
    Destinations?: GameSessionQueueDestinationList;
    /**
     * A list of locations where a queue is allowed to place new game sessions. Locations are specified in the form of Amazon Web Services Region codes, such as us-west-2. If this parameter is not set, game sessions can be placed in any queue location. 
     */
    FilterConfiguration?: FilterConfiguration;
    /**
     * Custom settings to use when prioritizing destinations and locations for game session placements. This configuration replaces the FleetIQ default prioritization process. Priority types that are not explicitly named will be automatically applied at the end of the prioritization process. 
     */
    PriorityConfiguration?: PriorityConfiguration;
    /**
     *  Information that is added to all events that are related to this game session queue.
     */
    CustomEventData?: QueueCustomEventData;
    /**
     * An SNS topic ARN that is set up to receive game session placement notifications. See  Setting up notifications for game session placement.
     */
    NotificationTarget?: QueueSnsArnStringModel;
  }
  export type GameSessionQueueArn = string;
  export interface GameSessionQueueDestination {
    /**
     * The Amazon Resource Name (ARN) that is assigned to fleet or fleet alias. ARNs, which include a fleet ID or alias ID and a Region name, provide a unique identifier across all Regions.
     */
    DestinationArn?: ArnStringModel;
  }
  export type GameSessionQueueDestinationList = GameSessionQueueDestination[];
  export type GameSessionQueueList = GameSessionQueue[];
  export type GameSessionQueueName = string;
  export type GameSessionQueueNameOrArn = string;
  export type GameSessionQueueNameOrArnList = GameSessionQueueNameOrArn[];
  export type GameSessionStatus = "ACTIVE"|"ACTIVATING"|"TERMINATED"|"TERMINATING"|"ERROR"|string;
  export type GameSessionStatusReason = "INTERRUPTED"|string;
  export interface GetComputeAccessInput {
    /**
     * A unique identifier for the fleet that contains the compute resource you want to connect to. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A unique identifier for the compute resource that you want to connect to. You can use either a registered compute name or an instance ID.
     */
    ComputeName: ComputeNameOrArn;
  }
  export interface GetComputeAccessOutput {
    /**
     * The ID of the fleet that contains the compute resource to be accessed.
     */
    FleetId?: FleetIdOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * The identifier of the compute resource to be accessed. This value might be either a compute name or an instance ID.
     */
    ComputeName?: ComputeNameOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to an Amazon GameLift compute resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::compute/compute-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    ComputeArn?: ComputeArn;
    /**
     * A set of temporary Amazon Web Services credentials for use when connecting to the compute resource with Amazon EC2 Systems Manager (SSM).
     */
    Credentials?: AwsCredentials;
  }
  export interface GetComputeAuthTokenInput {
    /**
     * A unique identifier for the fleet that the compute is registered to.
     */
    FleetId: FleetIdOrArn;
    /**
     * The name of the compute resource you are requesting the authentication token for.
     */
    ComputeName: ComputeNameOrArn;
  }
  export interface GetComputeAuthTokenOutput {
    /**
     * A unique identifier for the fleet that the compute is registered to.
     */
    FleetId?: FleetIdOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * The name of the compute resource that the authentication token is issued to.
     */
    ComputeName?: ComputeNameOrArn;
    /**
     * The Amazon Resource Name (ARN) that is assigned to an Amazon GameLift compute resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::compute/compute-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    ComputeArn?: ComputeArn;
    /**
     * A valid temporary authentication token.
     */
    AuthToken?: ComputeAuthToken;
    /**
     * The amount of time until the authentication token is no longer valid.
     */
    ExpirationTimestamp?: Timestamp;
  }
  export interface GetGameSessionLogUrlInput {
    /**
     * A unique identifier for the game session to get logs for. 
     */
    GameSessionId: ArnStringModel;
  }
  export interface GetGameSessionLogUrlOutput {
    /**
     * Location of the requested game session logs, available for download. This URL is valid for 15 minutes, after which S3 will reject any download request using this URL. You can request a new URL any time within the 14-day period that the logs are retained.
     */
    PreSignedUrl?: NonZeroAndMaxString;
  }
  export interface GetInstanceAccessInput {
    /**
     * A unique identifier for the fleet that contains the instance you want to access. You can request access to instances in EC2 fleets with the following statuses: ACTIVATING, ACTIVE, or ERROR. Use either a fleet ID or an ARN value.   You can access fleets in ERROR status for a short period of time before Amazon GameLift deletes them. 
     */
    FleetId: FleetIdOrArn;
    /**
     * A unique identifier for the instance you want to access. You can access an instance in any status.
     */
    InstanceId: InstanceId;
  }
  export interface GetInstanceAccessOutput {
    /**
     * The connection information for a fleet instance, including IP address and access credentials.
     */
    InstanceAccess?: InstanceAccess;
  }
  export type IamRoleArn = string;
  export type IdStringModel = string;
  export interface Instance {
    /**
     * A unique identifier for the fleet that the instance belongs to.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * A unique identifier for the instance.
     */
    InstanceId?: InstanceId;
    /**
     * IP address that is assigned to the instance.
     */
    IpAddress?: IpAddress;
    /**
     * The DNS identifier assigned to the instance that is running the game session. Values have the following format:   TLS-enabled fleets: &lt;unique identifier&gt;.&lt;region identifier&gt;.amazongamelift.com.   Non-TLS-enabled fleets: ec2-&lt;unique identifier&gt;.compute.amazonaws.com. (See Amazon Elastic Compute Cloud Instance IP Addressing.)   When connecting to a game session that is running on a TLS-enabled fleet, you must use the DNS name, not the IP address.
     */
    DnsName?: DnsName;
    /**
     * Operating system that is running on this EC2 instance. 
     */
    OperatingSystem?: OperatingSystem;
    /**
     * EC2 instance type that defines the computing resources of this instance. 
     */
    Type?: EC2InstanceType;
    /**
     * Current status of the instance. Possible statuses include the following:    PENDING -- The instance is in the process of being created and launching server processes as defined in the fleet's run-time configuration.     ACTIVE -- The instance has been successfully created and at least one server process has successfully launched and reported back to Amazon GameLift that it is ready to host a game session. The instance is now considered ready to host game sessions.     TERMINATING -- The instance is in the process of shutting down. This may happen to reduce capacity during a scaling down event or to recycle resources in the event of a problem.  
     */
    Status?: InstanceStatus;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * The fleet location of the instance, expressed as an Amazon Web Services Region code, such as us-west-2. 
     */
    Location?: LocationStringModel;
  }
  export interface InstanceAccess {
    /**
     * A unique identifier for the fleet containing the instance to be accessed.
     */
    FleetId?: FleetId;
    /**
     * A unique identifier for the instance to be accessed.
     */
    InstanceId?: InstanceId;
    /**
     * IP address assigned to the instance.
     */
    IpAddress?: IpAddress;
    /**
     * Operating system that is running on the instance.
     */
    OperatingSystem?: OperatingSystem;
    /**
     * Security credentials that are required to access the instance.
     */
    Credentials?: InstanceCredentials;
  }
  export interface InstanceCredentials {
    /**
     * A user name for logging in.
     */
    UserName?: NonEmptyString;
    /**
     * Secret string. For Windows instances, the secret is a password for use with Windows Remote Desktop. For Linux instances, it's a private key for use with SSH.
     */
    Secret?: NonEmptyString;
  }
  export interface InstanceDefinition {
    /**
     * An Amazon EC2 instance type designation.
     */
    InstanceType: GameServerGroupInstanceType;
    /**
     * Instance weighting that indicates how much this instance type contributes to the total capacity of a game server group. Instance weights are used by Amazon GameLift FleetIQ to calculate the instance type's cost per unit hour and better identify the most cost-effective options. For detailed information on weighting instance capacity, see Instance Weighting in the Amazon Elastic Compute Cloud Auto Scaling User Guide. Default value is "1".
     */
    WeightedCapacity?: WeightedCapacity;
  }
  export type InstanceDefinitions = InstanceDefinition[];
  export type InstanceId = string;
  export type InstanceList = Instance[];
  export type InstanceStatus = "PENDING"|"ACTIVE"|"TERMINATING"|string;
  export type Integer = number;
  export type IpAddress = string;
  export interface IpPermission {
    /**
     * A starting value for a range of allowed port numbers. For fleets using Linux builds, only ports 22 and 1026-60000 are valid. For fleets using Windows builds, only ports 1026-60000 are valid.
     */
    FromPort: PortNumber;
    /**
     * An ending value for a range of allowed port numbers. Port numbers are end-inclusive. This value must be equal to or greater than FromPort. For fleets using Linux builds, only ports 22 and 1026-60000 are valid. For fleets using Windows builds, only ports 1026-60000 are valid.
     */
    ToPort: PortNumber;
    /**
     * A range of allowed IP addresses. This value must be expressed in CIDR notation. Example: "000.000.000.000/[subnet mask]" or optionally the shortened version "0.0.0.0/[subnet mask]".
     */
    IpRange: NonBlankString;
    /**
     * The network communication protocol used by the fleet.
     */
    Protocol: IpProtocol;
  }
  export type IpPermissionsList = IpPermission[];
  export type IpProtocol = "TCP"|"UDP"|string;
  export type LargeGameSessionData = string;
  export type LatencyMap = {[key: string]: PositiveInteger};
  export type LaunchParametersStringModel = string;
  export type LaunchPathStringModel = string;
  export type LaunchTemplateId = string;
  export type LaunchTemplateName = string;
  export interface LaunchTemplateSpecification {
    /**
     * A unique identifier for an existing Amazon EC2 launch template.
     */
    LaunchTemplateId?: LaunchTemplateId;
    /**
     * A readable identifier for an existing Amazon EC2 launch template. 
     */
    LaunchTemplateName?: LaunchTemplateName;
    /**
     * The version of the Amazon EC2 launch template to use. If no version is specified, the default version will be used. With Amazon EC2, you can specify a default version for a launch template. If none is set, the default is the first version created.
     */
    Version?: LaunchTemplateVersion;
  }
  export type LaunchTemplateVersion = string;
  export interface ListAliasesInput {
    /**
     * The routing type to filter results on. Use this parameter to retrieve only aliases with a certain routing type. To retrieve all aliases, leave this parameter empty. Possible routing types include the following:    SIMPLE -- The alias resolves to one specific fleet. Use this type when routing to active fleets.    TERMINAL -- The alias does not resolve to a fleet but instead can be used to display a message to the user. A terminal alias throws a TerminalRoutingStrategyException with the RoutingStrategy message embedded.  
     */
    RoutingStrategyType?: RoutingStrategyType;
    /**
     * A descriptive label that is associated with an alias. Alias names do not need to be unique.
     */
    Name?: NonEmptyString;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListAliasesOutput {
    /**
     * A collection of alias resources that match the request parameters.
     */
    Aliases?: AliasList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListBuildsInput {
    /**
     * Build status to filter results by. To retrieve all builds, leave this parameter empty. Possible build statuses include the following:    INITIALIZED -- A new build has been defined, but no files have been uploaded. You cannot create fleets for builds that are in this status. When a build is successfully created, the build status is set to this value.     READY -- The game build has been successfully uploaded. You can now create new fleets for this build.    FAILED -- The game build upload failed. You cannot create new fleets for this build.   
     */
    Status?: BuildStatus;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, don't specify a value.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListBuildsOutput {
    /**
     * A collection of build resources that match the request.
     */
    Builds?: BuildList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListComputeInput {
    /**
     * A unique identifier for the fleet to retrieve compute resources for.
     */
    FleetId: FleetIdOrArn;
    /**
     * The name of a location to retrieve compute resources for.
     */
    Location?: LocationStringModel;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListComputeOutput {
    /**
     * A list of compute resources in the specified fleet.
     */
    ComputeList?: ComputeList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListFleetsInput {
    /**
     * A unique identifier for the build to request fleets for. Use this parameter to return only fleets using a specified build. Use either the build ID or ARN value.
     */
    BuildId?: BuildIdOrArn;
    /**
     * A unique identifier for the Realtime script to request fleets for. Use this parameter to return only fleets using a specified script. Use either the script ID or ARN value.
     */
    ScriptId?: ScriptIdOrArn;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListFleetsOutput {
    /**
     * A set of fleet IDs that match the list request.
     */
    FleetIds?: FleetIdList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListGameServerGroupsInput {
    /**
     * The game server groups' limit.
     */
    Limit?: PositiveInteger;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListGameServerGroupsOutput {
    /**
     * The game server groups' game server groups.
     */
    GameServerGroups?: GameServerGroups;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListGameServersInput {
    /**
     * An identifier for the game server group to retrieve a list of game servers from. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * Indicates how to sort the returned data based on game server registration timestamp. Use ASCENDING to retrieve oldest game servers first, or use DESCENDING to retrieve newest game servers first. If this parameter is left empty, game servers are returned in no particular order.
     */
    SortOrder?: SortOrder;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListGameServersOutput {
    /**
     * A collection of game server objects that match the request.
     */
    GameServers?: GameServers;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListLocationsInput {
    /**
     * Filters the list for AWS or CUSTOM locations.
     */
    Filters?: LocationFilterList;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: ListLocationsLimit;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export type ListLocationsLimit = number;
  export interface ListLocationsOutput {
    /**
     * A collection of locations.
     */
    Locations?: LocationModelList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ListScriptsInput {
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages.
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, don't specify a value.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListScriptsOutput {
    /**
     * A set of properties describing the requested script.
     */
    Scripts?: ScriptList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonEmptyString;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the Amazon GameLift resource that you want to retrieve tags for. Amazon GameLift includes resource ARNs in the data object for the resource. You can retrieve the ARN by calling a List or Describe operation for the resource type. 
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The collection of tags assigned to the resource. 
     */
    Tags?: TagList;
  }
  export type LocationArnModel = string;
  export interface LocationAttributes {
    /**
     * A fleet location and its current life-cycle state.
     */
    LocationState?: LocationState;
    /**
     * A list of fleet actions that have been suspended in the fleet location.
     */
    StoppedActions?: FleetActionList;
    /**
     * The status of fleet activity updates to the location. The status PENDING_UPDATE indicates that StopFleetActions or StartFleetActions has been requested but the update has not yet been completed for the location.
     */
    UpdateStatus?: LocationUpdateStatus;
  }
  export type LocationAttributesList = LocationAttributes[];
  export interface LocationConfiguration {
    /**
     * An Amazon Web Services Region code, such as us-west-2. 
     */
    Location: LocationStringModel;
  }
  export type LocationConfigurationList = LocationConfiguration[];
  export type LocationFilter = "AWS"|"CUSTOM"|string;
  export type LocationFilterList = LocationFilter[];
  export type LocationList = LocationStringModel[];
  export interface LocationModel {
    /**
     * The location's name.
     */
    LocationName?: LocationStringModel;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift location resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::location/location-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    LocationArn?: LocationArnModel;
  }
  export type LocationModelList = LocationModel[];
  export interface LocationState {
    /**
     * The fleet location, expressed as an Amazon Web Services Region code such as us-west-2. 
     */
    Location?: LocationStringModel;
    /**
     * The life-cycle status of a fleet location. 
     */
    Status?: FleetStatus;
  }
  export type LocationStateList = LocationState[];
  export type LocationStringModel = string;
  export type LocationUpdateStatus = "PENDING_UPDATE"|string;
  export interface MatchedPlayerSession {
    /**
     * A unique identifier for a player 
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * A unique identifier for a player session
     */
    PlayerSessionId?: PlayerSessionId;
  }
  export type MatchedPlayerSessionList = MatchedPlayerSession[];
  export type MatchmakerData = string;
  export type MatchmakingAcceptanceTimeoutInteger = number;
  export interface MatchmakingConfiguration {
    /**
     * A unique identifier for the matchmaking configuration. This name is used to identify the configuration associated with a matchmaking request or ticket.
     */
    Name?: MatchmakingIdStringModel;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift matchmaking configuration resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::matchmakingconfiguration/&lt;matchmaking configuration name&gt;. In a Amazon GameLift configuration ARN, the resource ID matches the Name value.
     */
    ConfigurationArn?: MatchmakingConfigurationArn;
    /**
     * A descriptive label that is associated with matchmaking configuration.
     */
    Description?: NonZeroAndMaxString;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift game session queue resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::gamesessionqueue/&lt;queue name&gt;. Queues can be located in any Region. Queues are used to start new Amazon GameLift-hosted game sessions for matches that are created with this matchmaking configuration. This property is not set when FlexMatchMode is set to STANDALONE.
     */
    GameSessionQueueArns?: QueueArnsList;
    /**
     * The maximum duration, in seconds, that a matchmaking ticket can remain in process before timing out. Requests that fail due to timing out can be resubmitted as needed.
     */
    RequestTimeoutSeconds?: MatchmakingRequestTimeoutInteger;
    /**
     * The length of time (in seconds) to wait for players to accept a proposed match, if acceptance is required. If any player rejects the match or fails to accept before the timeout, the ticket continues to look for an acceptable match.
     */
    AcceptanceTimeoutSeconds?: MatchmakingAcceptanceTimeoutInteger;
    /**
     * A flag that indicates whether a match that was created with this configuration must be accepted by the matched players. To require acceptance, set to TRUE. When this option is enabled, matchmaking tickets use the status REQUIRES_ACCEPTANCE to indicate when a completed potential match is waiting for player acceptance.
     */
    AcceptanceRequired?: BooleanModel;
    /**
     * A unique identifier for the matchmaking rule set to use with this configuration. A matchmaking configuration can only use rule sets that are defined in the same Region.
     */
    RuleSetName?: MatchmakingIdStringModel;
    /**
     * The Amazon Resource Name (ARN) associated with the GameLift matchmaking rule set resource that this configuration uses.
     */
    RuleSetArn?: MatchmakingRuleSetArn;
    /**
     * An SNS topic ARN that is set up to receive matchmaking notifications.
     */
    NotificationTarget?: SnsArnStringModel;
    /**
     * The number of player slots in a match to keep open for future players. For example, if the configuration's rule set specifies a match for a single 10-person team, and the additional player count is set to 2, 10 players will be selected for the match and 2 more player slots will be open for future players. This parameter is not used when FlexMatchMode is set to STANDALONE.
     */
    AdditionalPlayerCount?: WholeNumber;
    /**
     * Information to attach to all events related to the matchmaking configuration. 
     */
    CustomEventData?: CustomEventData;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session). This information is added to the new GameSession object that is created for a successful match. This parameter is not used when FlexMatchMode is set to STANDALONE.
     */
    GameProperties?: GamePropertyList;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process with a request to start a new game session (see Start a Game Session). This information is added to the new GameSession object that is created for a successful match. This parameter is not used when FlexMatchMode is set to STANDALONE.
     */
    GameSessionData?: GameSessionData;
    /**
     * The method used to backfill game sessions created with this matchmaking configuration. MANUAL indicates that the game makes backfill requests or does not use the match backfill feature. AUTOMATIC indicates that GameLift creates backfill requests whenever a game session has one or more open slots. Learn more about manual and automatic backfill in Backfill existing games with FlexMatch. Automatic backfill is not available when FlexMatchMode is set to STANDALONE.
     */
    BackfillMode?: BackfillMode;
    /**
     * Indicates whether this matchmaking configuration is being used with Amazon GameLift hosting or as a standalone matchmaking solution.     STANDALONE - FlexMatch forms matches and returns match information, including players and team assignments, in a  MatchmakingSucceeded event.    WITH_QUEUE - FlexMatch forms matches and uses the specified Amazon GameLift queue to start a game session for the match.   
     */
    FlexMatchMode?: FlexMatchMode;
  }
  export type MatchmakingConfigurationArn = string;
  export type MatchmakingConfigurationList = MatchmakingConfiguration[];
  export type MatchmakingConfigurationName = string;
  export type MatchmakingConfigurationNameList = MatchmakingConfigurationName[];
  export type MatchmakingConfigurationStatus = "CANCELLED"|"COMPLETED"|"FAILED"|"PLACING"|"QUEUED"|"REQUIRES_ACCEPTANCE"|"SEARCHING"|"TIMED_OUT"|string;
  export type MatchmakingIdList = MatchmakingIdStringModel[];
  export type MatchmakingIdStringModel = string;
  export type MatchmakingRequestTimeoutInteger = number;
  export interface MatchmakingRuleSet {
    /**
     * A unique identifier for the matchmaking rule set
     */
    RuleSetName?: MatchmakingIdStringModel;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift matchmaking rule set resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::matchmakingruleset/&lt;ruleset name&gt;. In a GameLift rule set ARN, the resource ID matches the RuleSetName value.
     */
    RuleSetArn?: MatchmakingRuleSetArn;
    /**
     * A collection of matchmaking rules, formatted as a JSON string. Comments are not allowed in JSON, but most elements support a description field.
     */
    RuleSetBody: RuleSetBody;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
  }
  export type MatchmakingRuleSetArn = string;
  export type MatchmakingRuleSetList = MatchmakingRuleSet[];
  export type MatchmakingRuleSetName = string;
  export type MatchmakingRuleSetNameList = MatchmakingRuleSetName[];
  export interface MatchmakingTicket {
    /**
     * A unique identifier for a matchmaking ticket.
     */
    TicketId?: MatchmakingIdStringModel;
    /**
     * Name of the matchmaking configuration that is used with this ticket. Matchmaking configurations determine how players are grouped into a match and how a new game session is created for the match.
     */
    ConfigurationName?: MatchmakingIdStringModel;
    /**
     * The Amazon Resource Name (ARN) associated with the GameLift matchmaking configuration resource that is used with this ticket.
     */
    ConfigurationArn?: MatchmakingConfigurationArn;
    /**
     * Current status of the matchmaking request.    QUEUED -- The matchmaking request has been received and is currently waiting to be processed.    SEARCHING -- The matchmaking request is currently being processed.     REQUIRES_ACCEPTANCE -- A match has been proposed and the players must accept the match. This status is used only with requests that use a matchmaking configuration with a player acceptance requirement.    PLACING -- The FlexMatch engine has matched players and is in the process of placing a new game session for the match.    COMPLETED -- Players have been matched and a game session is ready to host the players. A ticket in this state contains the necessary connection information for players.    FAILED -- The matchmaking request was not completed.    CANCELLED -- The matchmaking request was canceled. This may be the result of a StopMatchmaking operation or a proposed match that one or more players failed to accept.    TIMED_OUT -- The matchmaking request was not successful within the duration specified in the matchmaking configuration.     Matchmaking requests that fail to successfully complete (statuses FAILED, CANCELLED, TIMED_OUT) can be resubmitted as new requests with new ticket IDs. 
     */
    Status?: MatchmakingConfigurationStatus;
    /**
     * Code to explain the current status. For example, a status reason may indicate when a ticket has returned to SEARCHING status after a proposed match fails to receive player acceptances.
     */
    StatusReason?: StringModel;
    /**
     * Additional information about the current status.
     */
    StatusMessage?: StringModel;
    /**
     * Time stamp indicating when this matchmaking request was received. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    StartTime?: Timestamp;
    /**
     * Time stamp indicating when the matchmaking request stopped being processed due to successful completion, timeout, or cancellation. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    EndTime?: Timestamp;
    /**
     * A set of Player objects, each representing a player to find matches for. Players are identified by a unique player ID and may include latency data for use during matchmaking. If the ticket is in status COMPLETED, the Player objects include the team the players were assigned to in the resulting match.
     */
    Players?: PlayerList;
    /**
     * Connection information for a new game session. Once a match is made, the FlexMatch engine creates a new game session for it. This information is added to the matchmaking ticket, which you can be retrieve by calling DescribeMatchmaking .
     */
    GameSessionConnectionInfo?: GameSessionConnectionInfo;
    /**
     * Average amount of time (in seconds) that players are currently waiting for a match. If there is not enough recent data, this property may be empty.
     */
    EstimatedWaitTime?: WholeNumber;
  }
  export type MatchmakingTicketList = MatchmakingTicket[];
  export type MaxConcurrentGameSessionActivations = number;
  export type MetricGroup = string;
  export type MetricGroupList = MetricGroup[];
  export type MetricName = "ActivatingGameSessions"|"ActiveGameSessions"|"ActiveInstances"|"AvailableGameSessions"|"AvailablePlayerSessions"|"CurrentPlayerSessions"|"IdleInstances"|"PercentAvailableGameSessions"|"PercentIdleInstances"|"QueueDepth"|"WaitTime"|"ConcurrentActivatableGameSessions"|string;
  export type NonBlankAndLengthConstraintString = string;
  export type NonBlankString = string;
  export type NonEmptyString = string;
  export type NonNegativeDouble = number;
  export type NonNegativeLimitedLengthDouble = string;
  export type NonZeroAndMaxString = string;
  export type OperatingSystem = "WINDOWS_2012"|"AMAZON_LINUX"|"AMAZON_LINUX_2"|"WINDOWS_2016"|"AMAZON_LINUX_2023"|string;
  export interface PlacedPlayerSession {
    /**
     * A unique identifier for a player that is associated with this player session.
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * A unique identifier for a player session.
     */
    PlayerSessionId?: PlayerSessionId;
  }
  export type PlacedPlayerSessionList = PlacedPlayerSession[];
  export interface Player {
    /**
     * A unique identifier for a player
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * A collection of key:value pairs containing player information for use in matchmaking. Player attribute keys must match the playerAttributes used in a matchmaking rule set. Example: "PlayerAttributes": {"skill": {"N": "23"}, "gameMode": {"S": "deathmatch"}}. You can provide up to 10 PlayerAttributes.
     */
    PlayerAttributes?: PlayerAttributeMap;
    /**
     * Name of the team that the player is assigned to in a match. Team names are defined in a matchmaking rule set.
     */
    Team?: NonZeroAndMaxString;
    /**
     * A set of values, expressed in milliseconds, that indicates the amount of latency that a player experiences when connected to @aws; Regions. If this property is present, FlexMatch considers placing the match only in Regions for which latency is reported.  If a matchmaker has a rule that evaluates player latency, players must report latency in order to be matched. If no latency is reported in this scenario, FlexMatch assumes that no Regions are available to the player and the ticket is not matchable. 
     */
    LatencyInMs?: LatencyMap;
  }
  export type PlayerAttributeMap = {[key: string]: AttributeValue};
  export type PlayerAttributeString = string;
  export type PlayerAttributeStringDoubleMap = {[key: string]: DoubleObject};
  export type PlayerAttributeStringList = PlayerAttributeString[];
  export type PlayerData = string;
  export type PlayerDataMap = {[key: string]: PlayerData};
  export type PlayerIdList = NonZeroAndMaxString[];
  export interface PlayerLatency {
    /**
     * A unique identifier for a player associated with the latency data.
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * Name of the Region that is associated with the latency value.
     */
    RegionIdentifier?: NonZeroAndMaxString;
    /**
     * Amount of time that represents the time lag experienced by the player when connected to the specified Region.
     */
    LatencyInMilliseconds?: Float;
  }
  export type PlayerLatencyList = PlayerLatency[];
  export interface PlayerLatencyPolicy {
    /**
     * The maximum latency value that is allowed for any player, in milliseconds. All policies must have a value set for this property.
     */
    MaximumIndividualPlayerLatencyMilliseconds?: WholeNumber;
    /**
     * The length of time, in seconds, that the policy is enforced while placing a new game session. A null value for this property means that the policy is enforced until the queue times out.
     */
    PolicyDurationSeconds?: WholeNumber;
  }
  export type PlayerLatencyPolicyList = PlayerLatencyPolicy[];
  export type PlayerList = Player[];
  export interface PlayerSession {
    /**
     * A unique identifier for a player session.
     */
    PlayerSessionId?: PlayerSessionId;
    /**
     * A unique identifier for a player that is associated with this player session.
     */
    PlayerId?: NonZeroAndMaxString;
    /**
     * A unique identifier for the game session that the player session is connected to.
     */
    GameSessionId?: NonZeroAndMaxString;
    /**
     * A unique identifier for the fleet that the player's game session is running on.
     */
    FleetId?: FleetId;
    /**
     *  The Amazon Resource Name (ARN) associated with the GameLift fleet that the player's game session is running on. 
     */
    FleetArn?: FleetArn;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * A time stamp indicating when this data object was terminated. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    TerminationTime?: Timestamp;
    /**
     * Current status of the player session. Possible player session statuses include the following:    RESERVED -- The player session request has been received, but the player has not yet connected to the server process and/or been validated.     ACTIVE -- The player has been validated by the server process and is currently connected.    COMPLETED -- The player connection has been dropped.    TIMEDOUT -- A player session request was received, but the player did not connect and/or was not validated within the timeout limit (60 seconds).  
     */
    Status?: PlayerSessionStatus;
    /**
     * The IP address of the game session. To connect to a Amazon GameLift game server, an app needs both the IP address and port number.
     */
    IpAddress?: IpAddress;
    /**
     * The DNS identifier assigned to the instance that is running the game session. Values have the following format:   TLS-enabled fleets: &lt;unique identifier&gt;.&lt;region identifier&gt;.amazongamelift.com.   Non-TLS-enabled fleets: ec2-&lt;unique identifier&gt;.compute.amazonaws.com. (See Amazon EC2 Instance IP Addressing.)   When connecting to a game session that is running on a TLS-enabled fleet, you must use the DNS name, not the IP address.
     */
    DnsName?: DnsName;
    /**
     * Port number for the game session. To connect to a Amazon GameLift server process, an app needs both the IP address and port number.
     */
    Port?: PortNumber;
    /**
     * Developer-defined information related to a player. Amazon GameLift does not use this data, so it can be formatted as needed for use in the game. 
     */
    PlayerData?: PlayerData;
  }
  export type PlayerSessionCreationPolicy = "ACCEPT_ALL"|"DENY_ALL"|string;
  export type PlayerSessionId = string;
  export type PlayerSessionList = PlayerSession[];
  export type PlayerSessionStatus = "RESERVED"|"ACTIVE"|"COMPLETED"|"TIMEDOUT"|string;
  export type PolicyType = "RuleBased"|"TargetBased"|string;
  export type PortNumber = number;
  export type PositiveInteger = number;
  export type PositiveLong = number;
  export interface PriorityConfiguration {
    /**
     * The recommended sequence to use when prioritizing where to place new game sessions. Each type can only be listed once.    LATENCY -- FleetIQ prioritizes locations where the average player latency (provided in each game session request) is lowest.     COST -- FleetIQ prioritizes destinations with the lowest current hosting costs. Cost is evaluated based on the location, instance type, and fleet type (Spot or On-Demand) for each destination in the queue.    DESTINATION -- FleetIQ prioritizes based on the order that destinations are listed in the queue configuration.    LOCATION -- FleetIQ prioritizes based on the provided order of locations, as defined in LocationOrder.   
     */
    PriorityOrder?: PriorityTypeList;
    /**
     * The prioritization order to use for fleet locations, when the PriorityOrder property includes LOCATION. Locations are identified by Amazon Web Services Region codes such as us-west-2. Each location can only be listed once. 
     */
    LocationOrder?: LocationList;
  }
  export type PriorityType = "LATENCY"|"COST"|"DESTINATION"|"LOCATION"|string;
  export type PriorityTypeList = PriorityType[];
  export type ProtectionPolicy = "NoProtection"|"FullProtection"|string;
  export interface PutScalingPolicyInput {
    /**
     * A descriptive label that is associated with a fleet's scaling policy. Policy names do not need to be unique. A fleet can have only one scaling policy with the same name.
     */
    Name: NonZeroAndMaxString;
    /**
     * A unique identifier for the fleet to apply this policy to. You can use either the fleet ID or ARN value. The fleet cannot be in any of the following statuses: ERROR or DELETING.
     */
    FleetId: FleetIdOrArn;
    /**
     * Amount of adjustment to make, based on the scaling adjustment type.
     */
    ScalingAdjustment?: Integer;
    /**
     * The type of adjustment to make to a fleet's instance count:    ChangeInCapacity -- add (or subtract) the scaling adjustment value from the current instance count. Positive values scale up while negative values scale down.    ExactCapacity -- set the instance count to the scaling adjustment value.    PercentChangeInCapacity -- increase or reduce the current instance count by the scaling adjustment, read as a percentage. Positive values scale up while negative values scale down; for example, a value of "-10" scales the fleet down by 10%.  
     */
    ScalingAdjustmentType?: ScalingAdjustmentType;
    /**
     * Metric value used to trigger a scaling event.
     */
    Threshold?: Double;
    /**
     * Comparison operator to use when measuring the metric against the threshold value.
     */
    ComparisonOperator?: ComparisonOperatorType;
    /**
     * Length of time (in minutes) the metric must be at or beyond the threshold before a scaling event is triggered.
     */
    EvaluationPeriods?: PositiveInteger;
    /**
     * Name of the Amazon GameLift-defined metric that is used to trigger a scaling adjustment. For detailed descriptions of fleet metrics, see Monitor Amazon GameLift with Amazon CloudWatch.     ActivatingGameSessions -- Game sessions in the process of being created.    ActiveGameSessions -- Game sessions that are currently running.    ActiveInstances -- Fleet instances that are currently running at least one game session.    AvailableGameSessions -- Additional game sessions that fleet could host simultaneously, given current capacity.    AvailablePlayerSessions -- Empty player slots in currently active game sessions. This includes game sessions that are not currently accepting players. Reserved player slots are not included.    CurrentPlayerSessions -- Player slots in active game sessions that are being used by a player or are reserved for a player.     IdleInstances -- Active instances that are currently hosting zero game sessions.     PercentAvailableGameSessions -- Unused percentage of the total number of game sessions that a fleet could host simultaneously, given current capacity. Use this metric for a target-based scaling policy.    PercentIdleInstances -- Percentage of the total number of active instances that are hosting zero game sessions.    QueueDepth -- Pending game session placement requests, in any queue, where the current fleet is the top-priority destination.    WaitTime -- Current wait time for pending game session placement requests, in any queue, where the current fleet is the top-priority destination.   
     */
    MetricName: MetricName;
    /**
     * The type of scaling policy to create. For a target-based policy, set the parameter MetricName to 'PercentAvailableGameSessions' and specify a TargetConfiguration. For a rule-based policy set the following parameters: MetricName, ComparisonOperator, Threshold, EvaluationPeriods, ScalingAdjustmentType, and ScalingAdjustment.
     */
    PolicyType?: PolicyType;
    /**
     * An object that contains settings for a target-based scaling policy.
     */
    TargetConfiguration?: TargetConfiguration;
  }
  export interface PutScalingPolicyOutput {
    /**
     * A descriptive label that is associated with a fleet's scaling policy. Policy names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
  }
  export type QueueArnsList = ArnStringModel[];
  export type QueueCustomEventData = string;
  export type QueueSnsArnStringModel = string;
  export interface RegisterComputeInput {
    /**
     * A unique identifier for the fleet to register the compute to. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A descriptive label for the compute resource.
     */
    ComputeName: ComputeName;
    /**
     * The path to a TLS certificate on your compute resource. Amazon GameLift doesn't validate the path and certificate.
     */
    CertificatePath?: NonZeroAndMaxString;
    /**
     * The DNS name of the compute resource. Amazon GameLift requires either a DNS name or IP address.
     */
    DnsName?: DnsNameInput;
    /**
     * The IP address of the compute resource. Amazon GameLift requires either a DNS name or IP address.
     */
    IpAddress?: IpAddress;
    /**
     * The name of a custom location to associate with the compute resource being registered. 
     */
    Location?: LocationStringModel;
  }
  export interface RegisterComputeOutput {
    /**
     * The details of the compute resource you registered.
     */
    Compute?: Compute;
  }
  export interface RegisterGameServerInput {
    /**
     * A unique identifier for the game server group where the game server is running.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * A custom string that uniquely identifies the game server to register. Game server IDs are developer-defined and must be unique across all game server groups in your Amazon Web Services account.
     */
    GameServerId: GameServerId;
    /**
     * The unique identifier for the instance where the game server is running. This ID is available in the instance metadata. EC2 instance IDs use a 17-character format, for example: i-1234567890abcdef0.
     */
    InstanceId: GameServerInstanceId;
    /**
     * Information that is needed to make inbound client connections to the game server. This might include the IP address and port, DNS name, and other information.
     */
    ConnectionInfo?: GameServerConnectionInfo;
    /**
     * A set of custom game server properties, formatted as a single string value. This data is passed to a game client or service when it requests information on game servers. 
     */
    GameServerData?: GameServerData;
  }
  export interface RegisterGameServerOutput {
    /**
     * Object that describes the newly registered game server.
     */
    GameServer?: GameServer;
  }
  export interface RequestUploadCredentialsInput {
    /**
     * A unique identifier for the build to get credentials for. You can use either the build ID or ARN value. 
     */
    BuildId: BuildIdOrArn;
  }
  export interface RequestUploadCredentialsOutput {
    /**
     * Amazon Web Services credentials required when uploading a game build to the storage location. These credentials have a limited lifespan and are valid only for the build they were issued for.
     */
    UploadCredentials?: AwsCredentials;
    /**
     * Amazon S3 path and key, identifying where the game build files are stored.
     */
    StorageLocation?: S3Location;
  }
  export interface ResolveAliasInput {
    /**
     * The unique identifier of the alias that you want to retrieve a fleet ID for. You can use either the alias ID or ARN value.
     */
    AliasId: AliasIdOrArn;
  }
  export interface ResolveAliasOutput {
    /**
     * The fleet identifier that the alias is pointing to.
     */
    FleetId?: FleetId;
    /**
     *  The Amazon Resource Name (ARN) associated with the GameLift fleet resource that this alias points to. 
     */
    FleetArn?: FleetArn;
  }
  export interface ResourceCreationLimitPolicy {
    /**
     * A policy that puts limits on the number of game sessions that a player can create within a specified span of time. With this policy, you can control players' ability to consume available resources. The policy is evaluated when a player tries to create a new game session. On receiving a CreateGameSession request, Amazon GameLift checks that the player (identified by CreatorId) has created fewer than game session limit in the specified time period.
     */
    NewGameSessionsPerCreator?: WholeNumber;
    /**
     * The time span used in evaluating the resource creation limit policy. 
     */
    PolicyPeriodInMinutes?: WholeNumber;
  }
  export interface ResumeGameServerGroupInput {
    /**
     * A unique identifier for the game server group. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * The activity to resume for this game server group.
     */
    ResumeActions: GameServerGroupActions;
  }
  export interface ResumeGameServerGroupOutput {
    /**
     * An object that describes the game server group resource, with the SuspendedActions property updated to reflect the resumed activity.
     */
    GameServerGroup?: GameServerGroup;
  }
  export interface RoutingStrategy {
    /**
     * The type of routing strategy for the alias. Possible routing types include the following:    SIMPLE - The alias resolves to one specific fleet. Use this type when routing to active fleets.    TERMINAL - The alias does not resolve to a fleet but instead can be used to display a message to the user. A terminal alias throws a TerminalRoutingStrategyException with the message embedded.  
     */
    Type?: RoutingStrategyType;
    /**
     * A unique identifier for the fleet that the alias points to. This value is the fleet ID, not the fleet ARN.
     */
    FleetId?: FleetId;
    /**
     * The message text to be used with a terminal routing strategy.
     */
    Message?: FreeText;
  }
  export type RoutingStrategyType = "SIMPLE"|"TERMINAL"|string;
  export type RuleSetBody = string;
  export type RuleSetLimit = number;
  export interface RuntimeConfiguration {
    /**
     * A collection of server process configurations that identify what server processes to run on each instance in a fleet.
     */
    ServerProcesses?: ServerProcessList;
    /**
     * The number of game sessions in status ACTIVATING to allow on an instance. This setting limits the instance resources that can be used for new game activations at any one time.
     */
    MaxConcurrentGameSessionActivations?: MaxConcurrentGameSessionActivations;
    /**
     * The maximum amount of time (in seconds) allowed to launch a new game session and have it report ready to host players. During this time, the game session is in status ACTIVATING. If the game session does not become active before the timeout, it is ended and the game session status is changed to TERMINATED.
     */
    GameSessionActivationTimeoutSeconds?: GameSessionActivationTimeoutSeconds;
  }
  export interface S3Location {
    /**
     * An Amazon S3 bucket identifier. Thename of the S3 bucket.  Amazon GameLift doesn't support uploading from Amazon S3 buckets with names that contain a dot (.). 
     */
    Bucket?: NonEmptyString;
    /**
     * The name of the zip file that contains the build files or script files. 
     */
    Key?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) for an IAM role that allows Amazon GameLift to access the S3 bucket.
     */
    RoleArn?: NonEmptyString;
    /**
     * The version of the file, if object versioning is turned on for the bucket. Amazon GameLift uses this information when retrieving files from an S3 bucket that you own. Use this parameter to specify a specific version of the file. If not set, the latest version of the file is retrieved. 
     */
    ObjectVersion?: NonEmptyString;
  }
  export type ScalingAdjustmentType = "ChangeInCapacity"|"ExactCapacity"|"PercentChangeInCapacity"|string;
  export interface ScalingPolicy {
    /**
     * A unique identifier for the fleet that is associated with this scaling policy.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
    /**
     * A descriptive label that is associated with a fleet's scaling policy. Policy names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * Current status of the scaling policy. The scaling policy can be in force only when in an ACTIVE status. Scaling policies can be suspended for individual fleets. If the policy is suspended for a fleet, the policy status does not change.    ACTIVE -- The scaling policy can be used for auto-scaling a fleet.    UPDATE_REQUESTED -- A request to update the scaling policy has been received.    UPDATING -- A change is being made to the scaling policy.    DELETE_REQUESTED -- A request to delete the scaling policy has been received.    DELETING -- The scaling policy is being deleted.    DELETED -- The scaling policy has been deleted.    ERROR -- An error occurred in creating the policy. It should be removed and recreated.  
     */
    Status?: ScalingStatusType;
    /**
     * Amount of adjustment to make, based on the scaling adjustment type.
     */
    ScalingAdjustment?: Integer;
    /**
     * The type of adjustment to make to a fleet's instance count.    ChangeInCapacity -- add (or subtract) the scaling adjustment value from the current instance count. Positive values scale up while negative values scale down.    ExactCapacity -- set the instance count to the scaling adjustment value.    PercentChangeInCapacity -- increase or reduce the current instance count by the scaling adjustment, read as a percentage. Positive values scale up while negative values scale down.  
     */
    ScalingAdjustmentType?: ScalingAdjustmentType;
    /**
     * Comparison operator to use when measuring a metric against the threshold value.
     */
    ComparisonOperator?: ComparisonOperatorType;
    /**
     * Metric value used to trigger a scaling event.
     */
    Threshold?: Double;
    /**
     * Length of time (in minutes) the metric must be at or beyond the threshold before a scaling event is triggered.
     */
    EvaluationPeriods?: PositiveInteger;
    /**
     * Name of the Amazon GameLift-defined metric that is used to trigger a scaling adjustment. For detailed descriptions of fleet metrics, see Monitor Amazon GameLift with Amazon CloudWatch.     ActivatingGameSessions -- Game sessions in the process of being created.    ActiveGameSessions -- Game sessions that are currently running.    ActiveInstances -- Fleet instances that are currently running at least one game session.    AvailableGameSessions -- Additional game sessions that fleet could host simultaneously, given current capacity.    AvailablePlayerSessions -- Empty player slots in currently active game sessions. This includes game sessions that are not currently accepting players. Reserved player slots are not included.    CurrentPlayerSessions -- Player slots in active game sessions that are being used by a player or are reserved for a player.     IdleInstances -- Active instances that are currently hosting zero game sessions.     PercentAvailableGameSessions -- Unused percentage of the total number of game sessions that a fleet could host simultaneously, given current capacity. Use this metric for a target-based scaling policy.    PercentIdleInstances -- Percentage of the total number of active instances that are hosting zero game sessions.    QueueDepth -- Pending game session placement requests, in any queue, where the current fleet is the top-priority destination.    WaitTime -- Current wait time for pending game session placement requests, in any queue, where the current fleet is the top-priority destination.   
     */
    MetricName?: MetricName;
    /**
     * The type of scaling policy to create. For a target-based policy, set the parameter MetricName to 'PercentAvailableGameSessions' and specify a TargetConfiguration. For a rule-based policy set the following parameters: MetricName, ComparisonOperator, Threshold, EvaluationPeriods, ScalingAdjustmentType, and ScalingAdjustment.
     */
    PolicyType?: PolicyType;
    /**
     * An object that contains settings for a target-based scaling policy.
     */
    TargetConfiguration?: TargetConfiguration;
    /**
     * The current status of the fleet's scaling policies in a requested fleet location. The status PENDING_UPDATE indicates that an update was requested for the fleet but has not yet been completed for the location.
     */
    UpdateStatus?: LocationUpdateStatus;
    /**
     *  The fleet location. 
     */
    Location?: LocationStringModel;
  }
  export type ScalingPolicyList = ScalingPolicy[];
  export type ScalingStatusType = "ACTIVE"|"UPDATE_REQUESTED"|"UPDATING"|"DELETE_REQUESTED"|"DELETING"|"DELETED"|"ERROR"|string;
  export interface Script {
    /**
     * A unique identifier for the Realtime script
     */
    ScriptId?: ScriptId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift script resource and uniquely identifies it. ARNs are unique across all Regions. In a GameLift script ARN, the resource ID matches the ScriptId value.
     */
    ScriptArn?: ScriptArn;
    /**
     * A descriptive label that is associated with a script. Script names don't need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * Version information associated with a build or script. Version strings don't need to be unique.
     */
    Version?: NonZeroAndMaxString;
    /**
     * The file size of the uploaded Realtime script, expressed in bytes. When files are uploaded from an S3 location, this value remains at "0".
     */
    SizeOnDisk?: PositiveLong;
    /**
     * A time stamp indicating when this data object was created. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * The location of the Amazon S3 bucket where a zipped file containing your Realtime scripts is stored. The storage location must specify the Amazon S3 bucket name, the zip file name (the "key"), and a role ARN that allows Amazon GameLift to access the Amazon S3 storage location. The S3 bucket must be in the same Region where you want to create a new script. By default, Amazon GameLift uploads the latest version of the zip file; if you have S3 object versioning turned on, you can use the ObjectVersion parameter to specify an earlier version. 
     */
    StorageLocation?: S3Location;
  }
  export type ScriptArn = string;
  export type ScriptId = string;
  export type ScriptIdOrArn = string;
  export type ScriptList = Script[];
  export interface SearchGameSessionsInput {
    /**
     * A unique identifier for the fleet to search for active game sessions. You can use either the fleet ID or ARN value. Each request must reference either a fleet ID or alias ID, but not both.
     */
    FleetId?: FleetIdOrArn;
    /**
     * A unique identifier for the alias associated with the fleet to search for active game sessions. You can use either the alias ID or ARN value. Each request must reference either a fleet ID or alias ID, but not both.
     */
    AliasId?: AliasIdOrArn;
    /**
     * A fleet location to search for game sessions. You can specify a fleet's home Region or a remote location. Use the Amazon Web Services Region code format, such as us-west-2. 
     */
    Location?: LocationStringModel;
    /**
     * String containing the search criteria for the session search. If no filter expression is included, the request returns results for all game sessions in the fleet that are in ACTIVE status. A filter expression can contain one or multiple conditions. Each condition consists of the following:    Operand -- Name of a game session attribute. Valid values are gameSessionName, gameSessionId, gameSessionProperties, maximumSessions, creationTimeMillis, playerSessionCount, hasAvailablePlayerSessions.    Comparator -- Valid comparators are: =, &lt;&gt;, &lt;, &gt;, &lt;=, &gt;=.     Value -- Value to be searched for. Values may be numbers, boolean values (true/false) or strings depending on the operand. String values are case sensitive and must be enclosed in single quotes. Special characters must be escaped. Boolean and string values can only be used with the comparators = and &lt;&gt;. For example, the following filter expression searches on gameSessionName: "FilterExpression": "gameSessionName = 'Matt\\'s Awesome Game 1'".    To chain multiple conditions in a single expression, use the logical keywords AND, OR, and NOT and parentheses as needed. For example: x AND y AND NOT z, NOT (x OR y). Session search evaluates conditions from left to right using the following precedence rules:    =, &lt;&gt;, &lt;, &gt;, &lt;=, &gt;=    Parentheses   NOT   AND   OR   For example, this filter expression retrieves game sessions hosting at least ten players that have an open player slot: "maximumSessions&gt;=10 AND hasAvailablePlayerSessions=true". 
     */
    FilterExpression?: NonZeroAndMaxString;
    /**
     * Instructions on how to sort the search results. If no sort expression is included, the request returns results in random order. A sort expression consists of the following elements:    Operand -- Name of a game session attribute. Valid values are gameSessionName, gameSessionId, gameSessionProperties, maximumSessions, creationTimeMillis, playerSessionCount, hasAvailablePlayerSessions.    Order -- Valid sort orders are ASC (ascending) and DESC (descending).   For example, this sort expression returns the oldest active sessions first: "SortExpression": "creationTimeMillis ASC". Results with a null value for the sort operand are returned at the end of the list.
     */
    SortExpression?: NonZeroAndMaxString;
    /**
     * The maximum number of results to return. Use this parameter with NextToken to get results as a set of sequential pages. The maximum number of results returned is 20, even if this value is not set or is set higher than 20. 
     */
    Limit?: PositiveInteger;
    /**
     * A token that indicates the start of the next sequential page of results. Use the token that is returned with a previous call to this operation. To start at the beginning of the result set, do not specify a value.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface SearchGameSessionsOutput {
    /**
     * A collection of objects containing game session properties for each session that matches the request.
     */
    GameSessions?: GameSessionList;
    /**
     * A token that indicates where to resume retrieving results on the next call to this operation. If no token is returned, these results represent the end of the list.
     */
    NextToken?: NonZeroAndMaxString;
  }
  export interface ServerProcess {
    /**
     * The location of a game build executable or Realtime script. Game builds and Realtime scripts are installed on instances at the root:    Windows (custom game builds only): C:\game. Example: "C:\game\MyGame\server.exe"    Linux: /local/game. Examples: "/local/game/MyGame/server.exe" or "/local/game/MyRealtimeScript.js"    Amazon GameLift doesn't support the use of setup scripts that launch the game executable. For custom game builds, this parameter must indicate the executable that calls the server SDK operations initSDK() and ProcessReady().  
     */
    LaunchPath: LaunchPathStringModel;
    /**
     * An optional list of parameters to pass to the server executable or Realtime script on launch.
     */
    Parameters?: LaunchParametersStringModel;
    /**
     * The number of server processes using this configuration that run concurrently on each instance.
     */
    ConcurrentExecutions: PositiveInteger;
  }
  export type ServerProcessList = ServerProcess[];
  export type ServerSdkVersion = string;
  export type SnsArnStringModel = string;
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export interface StartFleetActionsInput {
    /**
     * A unique identifier for the fleet to restart actions on. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * List of actions to restart on the fleet.
     */
    Actions: FleetActionList;
    /**
     * The fleet location to restart fleet actions for. Specify a location in the form of an Amazon Web Services Region code, such as us-west-2.
     */
    Location?: LocationStringModel;
  }
  export interface StartFleetActionsOutput {
    /**
     * A unique identifier for the fleet to restart actions on.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
  }
  export interface StartGameSessionPlacementInput {
    /**
     * A unique identifier to assign to the new game session placement. This value is developer-defined. The value must be unique across all Regions and cannot be reused.
     */
    PlacementId: IdStringModel;
    /**
     * Name of the queue to use to place the new game session. You can use either the queue name or ARN value. 
     */
    GameSessionQueueName: GameSessionQueueNameOrArn;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session).
     */
    GameProperties?: GamePropertyList;
    /**
     * The maximum number of players that can be connected simultaneously to the game session.
     */
    MaximumPlayerSessionCount: WholeNumber;
    /**
     * A descriptive label that is associated with a game session. Session names do not need to be unique.
     */
    GameSessionName?: NonZeroAndMaxString;
    /**
     * A set of values, expressed in milliseconds, that indicates the amount of latency that a player experiences when connected to Amazon Web Services Regions. This information is used to try to place the new game session where it can offer the best possible gameplay experience for the players. 
     */
    PlayerLatencies?: PlayerLatencyList;
    /**
     * Set of information on each player to create a player session for.
     */
    DesiredPlayerSessions?: DesiredPlayerSessionList;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process in the GameSession object with a request to start a new game session (see Start a Game Session).
     */
    GameSessionData?: LargeGameSessionData;
  }
  export interface StartGameSessionPlacementOutput {
    /**
     * Object that describes the newly created game session placement. This object includes all the information provided in the request, as well as start/end time stamps and placement status. 
     */
    GameSessionPlacement?: GameSessionPlacement;
  }
  export interface StartMatchBackfillInput {
    /**
     * A unique identifier for a matchmaking ticket. If no ticket ID is specified here, Amazon GameLift will generate one in the form of a UUID. Use this identifier to track the match backfill ticket status and retrieve match results.
     */
    TicketId?: MatchmakingIdStringModel;
    /**
     * Name of the matchmaker to use for this request. You can use either the configuration name or ARN value. The ARN of the matchmaker that was used with the original game session is listed in the GameSession object, MatchmakerData property.
     */
    ConfigurationName: MatchmakingConfigurationName;
    /**
     * A unique identifier for the game session. Use the game session ID. When using FlexMatch as a standalone matchmaking solution, this parameter is not needed. 
     */
    GameSessionArn?: ArnStringModel;
    /**
     * Match information on all players that are currently assigned to the game session. This information is used by the matchmaker to find new players and add them to the existing game. You can include up to 199 Players in a StartMatchBackfill request.   PlayerID, PlayerAttributes, Team -- This information is maintained in the GameSession object, MatchmakerData property, for all players who are currently assigned to the game session. The matchmaker data is in JSON syntax, formatted as a string. For more details, see  Match Data.  The backfill request must specify the team membership for every player. Do not specify team if you are not using backfill.   LatencyInMs -- If the matchmaker uses player latency, include a latency value, in milliseconds, for the Region that the game session is currently in. Do not include latency values for any other Region.  
     */
    Players: PlayerList;
  }
  export interface StartMatchBackfillOutput {
    /**
     * Ticket representing the backfill matchmaking request. This object includes the information in the request, ticket status, and match results as generated during the matchmaking process.
     */
    MatchmakingTicket?: MatchmakingTicket;
  }
  export interface StartMatchmakingInput {
    /**
     * A unique identifier for a matchmaking ticket. If no ticket ID is specified here, Amazon GameLift will generate one in the form of a UUID. Use this identifier to track the matchmaking ticket status and retrieve match results.
     */
    TicketId?: MatchmakingIdStringModel;
    /**
     * Name of the matchmaking configuration to use for this request. Matchmaking configurations must exist in the same Region as this request. You can use either the configuration name or ARN value.
     */
    ConfigurationName: MatchmakingConfigurationName;
    /**
     * Information on each player to be matched. This information must include a player ID, and may contain player attributes and latency data to be used in the matchmaking process. After a successful match, Player objects contain the name of the team the player is assigned to. You can include up to 10 Players in a StartMatchmaking request.
     */
    Players: PlayerList;
  }
  export interface StartMatchmakingOutput {
    /**
     * Ticket representing the matchmaking request. This object include the information included in the request, ticket status, and match results as generated during the matchmaking process.
     */
    MatchmakingTicket?: MatchmakingTicket;
  }
  export interface StopFleetActionsInput {
    /**
     * A unique identifier for the fleet to stop actions on. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * List of actions to suspend on the fleet. 
     */
    Actions: FleetActionList;
    /**
     * The fleet location to stop fleet actions for. Specify a location in the form of an Amazon Web Services Region code, such as us-west-2.
     */
    Location?: LocationStringModel;
  }
  export interface StopFleetActionsOutput {
    /**
     * A unique identifier for the fleet to stop actions on.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
  }
  export interface StopGameSessionPlacementInput {
    /**
     * A unique identifier for a game session placement to stop.
     */
    PlacementId: IdStringModel;
  }
  export interface StopGameSessionPlacementOutput {
    /**
     * Object that describes the canceled game session placement, with CANCELLED status and an end time stamp. 
     */
    GameSessionPlacement?: GameSessionPlacement;
  }
  export interface StopMatchmakingInput {
    /**
     * A unique identifier for a matchmaking ticket.
     */
    TicketId: MatchmakingIdStringModel;
  }
  export interface StopMatchmakingOutput {
  }
  export type StringList = NonZeroAndMaxString[];
  export type StringModel = string;
  export interface SuspendGameServerGroupInput {
    /**
     * A unique identifier for the game server group. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * The activity to suspend for this game server group.
     */
    SuspendActions: GameServerGroupActions;
  }
  export interface SuspendGameServerGroupOutput {
    /**
     * An object that describes the game server group resource, with the SuspendedActions property updated to reflect the suspended activity.
     */
    GameServerGroup?: GameServerGroup;
  }
  export interface Tag {
    /**
     * The key for a developer-defined key value pair for tagging an Amazon Web Services resource. 
     */
    Key: TagKey;
    /**
     * The value for a developer-defined key value pair for tagging an Amazon Web Services resource. 
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the Amazon GameLift resource that you want to assign tags to. Amazon GameLift includes resource ARNs in the data object for the resource. You can retrieve the ARN by calling a List or Describe operation for the resource type. 
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of one or more tags to assign to the specified Amazon GameLift resource. Tags are developer-defined and structured as key-value pairs. The maximum tag limit may be lower than stated. See  Tagging Amazon Web Services Resources for tagging limits.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TargetConfiguration {
    /**
     * Desired value to use with a target-based scaling policy. The value must be relevant for whatever metric the scaling policy is using. For example, in a policy using the metric PercentAvailableGameSessions, the target value should be the preferred size of the fleet's buffer (the percent of capacity that should be idle and ready for new game sessions).
     */
    TargetValue: Double;
  }
  export interface TargetTrackingConfiguration {
    /**
     * Desired value to use with a game server group target-based scaling policy. 
     */
    TargetValue: NonNegativeDouble;
  }
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that uniquely identifies the Amazon GameLift resource that you want to remove tags from. Amazon GameLift includes resource ARNs in the data object for the resource. You can retrieve the ARN by calling a List or Describe operation for the resource type. 
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of one or more tag keys to remove from the specified Amazon GameLift resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAliasInput {
    /**
     * A unique identifier for the alias that you want to update. You can use either the alias ID or ARN value.
     */
    AliasId: AliasIdOrArn;
    /**
     * A descriptive label that is associated with an alias. Alias names do not need to be unique.
     */
    Name?: NonBlankAndLengthConstraintString;
    /**
     * A human-readable description of the alias.
     */
    Description?: NonZeroAndMaxString;
    /**
     * The routing configuration, including routing type and fleet target, for the alias.
     */
    RoutingStrategy?: RoutingStrategy;
  }
  export interface UpdateAliasOutput {
    /**
     * The updated alias resource.
     */
    Alias?: Alias;
  }
  export interface UpdateBuildInput {
    /**
     * A unique identifier for the build to update. You can use either the build ID or ARN value. 
     */
    BuildId: BuildIdOrArn;
    /**
     * A descriptive label associated with a build. Build names don't need to be unique. 
     */
    Name?: NonZeroAndMaxString;
    /**
     * Version information associated with a build or script. Version strings don't need to be unique.
     */
    Version?: NonZeroAndMaxString;
  }
  export interface UpdateBuildOutput {
    /**
     * The updated build resource.
     */
    Build?: Build;
  }
  export interface UpdateFleetAttributesInput {
    /**
     * A unique identifier for the fleet to update attribute metadata for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A descriptive label that is associated with a fleet. Fleet names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * A human-readable description of a fleet.
     */
    Description?: NonZeroAndMaxString;
    /**
     * The game session protection policy to apply to all new game sessions created in this fleet. Game sessions that already exist are not affected. You can set protection for individual game sessions using UpdateGameSession .    NoProtection -- The game session can be terminated during a scale-down event.    FullProtection -- If the game session is in an ACTIVE status, it cannot be terminated during a scale-down event.  
     */
    NewGameSessionProtectionPolicy?: ProtectionPolicy;
    /**
     * Policy settings that limit the number of game sessions an individual player can create over a span of time. 
     */
    ResourceCreationLimitPolicy?: ResourceCreationLimitPolicy;
    /**
     * The name of a metric group to add this fleet to. Use a metric group in Amazon CloudWatch to aggregate the metrics from multiple fleets. Provide an existing metric group name, or create a new metric group by providing a new name. A fleet can only be in one metric group at a time.
     */
    MetricGroups?: MetricGroupList;
    /**
     * Amazon GameLift Anywhere configuration options.
     */
    AnywhereConfiguration?: AnywhereConfiguration;
  }
  export interface UpdateFleetAttributesOutput {
    /**
     * A unique identifier for the fleet that was updated.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
  }
  export interface UpdateFleetCapacityInput {
    /**
     * A unique identifier for the fleet to update capacity settings for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * The number of Amazon EC2 instances you want to maintain in the specified fleet location. This value must fall between the minimum and maximum size limits. Changes in desired instance value can take up to 1 minute to be reflected when viewing the fleet's capacity settings.
     */
    DesiredInstances?: WholeNumber;
    /**
     * The minimum number of instances that are allowed in the specified fleet location. If this parameter is not set, the default is 0.
     */
    MinSize?: WholeNumber;
    /**
     * The maximum number of instances that are allowed in the specified fleet location. If this parameter is not set, the default is 1.
     */
    MaxSize?: WholeNumber;
    /**
     * The name of a remote location to update fleet capacity settings for, in the form of an Amazon Web Services Region code such as us-west-2.
     */
    Location?: LocationStringModel;
  }
  export interface UpdateFleetCapacityOutput {
    /**
     * A unique identifier for the fleet that was updated.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912. 
     */
    FleetArn?: FleetArn;
    /**
     * The remote location being updated, expressed as an Amazon Web Services Region code, such as us-west-2.
     */
    Location?: LocationStringModel;
  }
  export interface UpdateFleetPortSettingsInput {
    /**
     * A unique identifier for the fleet to update port settings for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * A collection of port settings to be added to the fleet resource.
     */
    InboundPermissionAuthorizations?: IpPermissionsList;
    /**
     * A collection of port settings to be removed from the fleet resource.
     */
    InboundPermissionRevocations?: IpPermissionsList;
  }
  export interface UpdateFleetPortSettingsOutput {
    /**
     * A unique identifier for the fleet that was updated.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift fleet resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::fleet/fleet-a1234567-b8c9-0d1e-2fa3-b45c6d7e8912.
     */
    FleetArn?: FleetArn;
  }
  export interface UpdateGameServerGroupInput {
    /**
     * A unique identifier for the game server group. Use either the name or ARN value.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * The Amazon Resource Name (ARN) for an IAM role that allows Amazon GameLift to access your Amazon EC2 Auto Scaling groups.
     */
    RoleArn?: IamRoleArn;
    /**
     * An updated list of Amazon EC2 instance types to use in the Auto Scaling group. The instance definitions must specify at least two different instance types that are supported by Amazon GameLift FleetIQ. This updated list replaces the entire current list of instance definitions for the game server group. For more information on instance types, see EC2 Instance Types in the Amazon EC2 User Guide. You can optionally specify capacity weighting for each instance type. If no weight value is specified for an instance type, it is set to the default value "1". For more information about capacity weighting, see  Instance Weighting for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
     */
    InstanceDefinitions?: InstanceDefinitions;
    /**
     * A flag that indicates whether instances in the game server group are protected from early termination. Unprotected instances that have active game servers running might be terminated during a scale-down event, causing players to be dropped from the game. Protected instances cannot be terminated while there are active game servers running except in the event of a forced game server group deletion (see ). An exception to this is with Spot Instances, which can be terminated by Amazon Web Services regardless of protection status. This property is set to NO_PROTECTION by default.
     */
    GameServerProtectionPolicy?: GameServerProtectionPolicy;
    /**
     * Indicates how Amazon GameLift FleetIQ balances the use of Spot Instances and On-Demand Instances in the game server group. Method options include the following:    SPOT_ONLY - Only Spot Instances are used in the game server group. If Spot Instances are unavailable or not viable for game hosting, the game server group provides no hosting capacity until Spot Instances can again be used. Until then, no new instances are started, and the existing nonviable Spot Instances are terminated (after current gameplay ends) and are not replaced.    SPOT_PREFERRED - (default value) Spot Instances are used whenever available in the game server group. If Spot Instances are unavailable, the game server group continues to provide hosting capacity by falling back to On-Demand Instances. Existing nonviable Spot Instances are terminated (after current gameplay ends) and are replaced with new On-Demand Instances.    ON_DEMAND_ONLY - Only On-Demand Instances are used in the game server group. No Spot Instances are used, even when available, while this balancing strategy is in force.  
     */
    BalancingStrategy?: BalancingStrategy;
  }
  export interface UpdateGameServerGroupOutput {
    /**
     * An object that describes the game server group resource with updated properties. 
     */
    GameServerGroup?: GameServerGroup;
  }
  export interface UpdateGameServerInput {
    /**
     * A unique identifier for the game server group where the game server is running.
     */
    GameServerGroupName: GameServerGroupNameOrArn;
    /**
     * A custom string that uniquely identifies the game server to update.
     */
    GameServerId: GameServerId;
    /**
     * A set of custom game server properties, formatted as a single string value. This data is passed to a game client or service when it requests information on game servers. 
     */
    GameServerData?: GameServerData;
    /**
     * Indicates if the game server is available or is currently hosting gameplay. You can update a game server status from AVAILABLE to UTILIZED, but you can't change a the status from UTILIZED to AVAILABLE.
     */
    UtilizationStatus?: GameServerUtilizationStatus;
    /**
     * Indicates health status of the game server. A request that includes this parameter updates the game server's LastHealthCheckTime timestamp. 
     */
    HealthCheck?: GameServerHealthCheck;
  }
  export interface UpdateGameServerOutput {
    /**
     * Object that describes the newly updated game server.
     */
    GameServer?: GameServer;
  }
  export interface UpdateGameSessionInput {
    /**
     * A unique identifier for the game session to update. 
     */
    GameSessionId: ArnStringModel;
    /**
     * The maximum number of players that can be connected simultaneously to the game session.
     */
    MaximumPlayerSessionCount?: WholeNumber;
    /**
     * A descriptive label that is associated with a game session. Session names do not need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * A policy that determines whether the game session is accepting new players.
     */
    PlayerSessionCreationPolicy?: PlayerSessionCreationPolicy;
    /**
     * Game session protection policy to apply to this game session only.    NoProtection -- The game session can be terminated during a scale-down event.    FullProtection -- If the game session is in an ACTIVE status, it cannot be terminated during a scale-down event.  
     */
    ProtectionPolicy?: ProtectionPolicy;
  }
  export interface UpdateGameSessionOutput {
    /**
     * The updated game session properties.
     */
    GameSession?: GameSession;
  }
  export interface UpdateGameSessionQueueInput {
    /**
     * A descriptive label that is associated with game session queue. Queue names must be unique within each Region. You can use either the queue ID or ARN value. 
     */
    Name: GameSessionQueueNameOrArn;
    /**
     * The maximum time, in seconds, that a new game session placement request remains in the queue. When a request exceeds this time, the game session placement changes to a TIMED_OUT status. By default, this property is set to 600.
     */
    TimeoutInSeconds?: WholeNumber;
    /**
     * A set of policies that act as a sliding cap on player latency. FleetIQ works to deliver low latency for most players in a game session. These policies ensure that no individual player can be placed into a game with unreasonably high latency. Use multiple policies to gradually relax latency requirements a step at a time. Multiple policies are applied based on their maximum allowed latency, starting with the lowest value. When updating policies, provide a complete collection of policies.
     */
    PlayerLatencyPolicies?: PlayerLatencyPolicyList;
    /**
     * A list of fleets and/or fleet aliases that can be used to fulfill game session placement requests in the queue. Destinations are identified by either a fleet ARN or a fleet alias ARN, and are listed in order of placement preference. When updating this list, provide a complete list of destinations.
     */
    Destinations?: GameSessionQueueDestinationList;
    /**
     * A list of locations where a queue is allowed to place new game sessions. Locations are specified in the form of Amazon Web Services Region codes, such as us-west-2. If this parameter is not set, game sessions can be placed in any queue location. To remove an existing filter configuration, pass in an empty set.
     */
    FilterConfiguration?: FilterConfiguration;
    /**
     * Custom settings to use when prioritizing destinations and locations for game session placements. This configuration replaces the FleetIQ default prioritization process. Priority types that are not explicitly named will be automatically applied at the end of the prioritization process. To remove an existing priority configuration, pass in an empty set.
     */
    PriorityConfiguration?: PriorityConfiguration;
    /**
     * Information to be added to all events that are related to this game session queue.
     */
    CustomEventData?: QueueCustomEventData;
    /**
     * An SNS topic ARN that is set up to receive game session placement notifications. See  Setting up notifications for game session placement.
     */
    NotificationTarget?: QueueSnsArnStringModel;
  }
  export interface UpdateGameSessionQueueOutput {
    /**
     * An object that describes the newly updated game session queue.
     */
    GameSessionQueue?: GameSessionQueue;
  }
  export interface UpdateMatchmakingConfigurationInput {
    /**
     * A unique identifier for the matchmaking configuration to update. You can use either the configuration name or ARN value. 
     */
    Name: MatchmakingConfigurationName;
    /**
     * A description for the matchmaking configuration.
     */
    Description?: NonZeroAndMaxString;
    /**
     * The Amazon Resource Name (ARN) that is assigned to a Amazon GameLift game session queue resource and uniquely identifies it. ARNs are unique across all Regions. Format is arn:aws:gamelift:&lt;region&gt;::gamesessionqueue/&lt;queue name&gt;. Queues can be located in any Region. Queues are used to start new Amazon GameLift-hosted game sessions for matches that are created with this matchmaking configuration. If FlexMatchMode is set to STANDALONE, do not set this parameter.
     */
    GameSessionQueueArns?: QueueArnsList;
    /**
     * The maximum duration, in seconds, that a matchmaking ticket can remain in process before timing out. Requests that fail due to timing out can be resubmitted as needed.
     */
    RequestTimeoutSeconds?: MatchmakingRequestTimeoutInteger;
    /**
     * The length of time (in seconds) to wait for players to accept a proposed match, if acceptance is required.
     */
    AcceptanceTimeoutSeconds?: MatchmakingAcceptanceTimeoutInteger;
    /**
     * A flag that indicates whether a match that was created with this configuration must be accepted by the matched players. To require acceptance, set to TRUE. With this option enabled, matchmaking tickets use the status REQUIRES_ACCEPTANCE to indicate when a completed potential match is waiting for player acceptance. 
     */
    AcceptanceRequired?: BooleanModel;
    /**
     * A unique identifier for the matchmaking rule set to use with this configuration. You can use either the rule set name or ARN value. A matchmaking configuration can only use rule sets that are defined in the same Region.
     */
    RuleSetName?: MatchmakingRuleSetName;
    /**
     * An SNS topic ARN that is set up to receive matchmaking notifications. See  Setting up notifications for matchmaking for more information.
     */
    NotificationTarget?: SnsArnStringModel;
    /**
     * The number of player slots in a match to keep open for future players. For example, if the configuration's rule set specifies a match for a single 10-person team, and the additional player count is set to 2, 10 players will be selected for the match and 2 more player slots will be open for future players. This parameter is not used if FlexMatchMode is set to STANDALONE.
     */
    AdditionalPlayerCount?: WholeNumber;
    /**
     * Information to add to all events related to the matchmaking configuration. 
     */
    CustomEventData?: CustomEventData;
    /**
     * A set of custom properties for a game session, formatted as key:value pairs. These properties are passed to a game server process with a request to start a new game session (see Start a Game Session). This information is added to the new GameSession object that is created for a successful match. This parameter is not used if FlexMatchMode is set to STANDALONE.
     */
    GameProperties?: GamePropertyList;
    /**
     * A set of custom game session properties, formatted as a single string value. This data is passed to a game server process with a request to start a new game session (see Start a Game Session). This information is added to the game session that is created for a successful match. This parameter is not used if FlexMatchMode is set to STANDALONE.
     */
    GameSessionData?: GameSessionData;
    /**
     * The method that is used to backfill game sessions created with this matchmaking configuration. Specify MANUAL when your game manages backfill requests manually or does not use the match backfill feature. Specify AUTOMATIC to have GameLift create a match backfill request whenever a game session has one or more open slots. Learn more about manual and automatic backfill in Backfill Existing Games with FlexMatch. Automatic backfill is not available when FlexMatchMode is set to STANDALONE.
     */
    BackfillMode?: BackfillMode;
    /**
     * Indicates whether this matchmaking configuration is being used with Amazon GameLift hosting or as a standalone matchmaking solution.     STANDALONE - FlexMatch forms matches and returns match information, including players and team assignments, in a  MatchmakingSucceeded event.    WITH_QUEUE - FlexMatch forms matches and uses the specified Amazon GameLift queue to start a game session for the match.   
     */
    FlexMatchMode?: FlexMatchMode;
  }
  export interface UpdateMatchmakingConfigurationOutput {
    /**
     * The updated matchmaking configuration.
     */
    Configuration?: MatchmakingConfiguration;
  }
  export interface UpdateRuntimeConfigurationInput {
    /**
     * A unique identifier for the fleet to update runtime configuration for. You can use either the fleet ID or ARN value.
     */
    FleetId: FleetIdOrArn;
    /**
     * Instructions for launching server processes on each instance in the fleet. Server processes run either a custom game build executable or a Realtime Servers script. The runtime configuration lists the types of server processes to run on an instance, how to launch them, and the number of processes to run concurrently.
     */
    RuntimeConfiguration: RuntimeConfiguration;
  }
  export interface UpdateRuntimeConfigurationOutput {
    /**
     * The runtime configuration currently in use by all instances in the fleet. If the update was successful, all property changes are shown. 
     */
    RuntimeConfiguration?: RuntimeConfiguration;
  }
  export interface UpdateScriptInput {
    /**
     * A unique identifier for the Realtime script to update. You can use either the script ID or ARN value.
     */
    ScriptId: ScriptIdOrArn;
    /**
     * A descriptive label that is associated with a script. Script names don't need to be unique.
     */
    Name?: NonZeroAndMaxString;
    /**
     * Version information associated with a build or script. Version strings don't need to be unique.
     */
    Version?: NonZeroAndMaxString;
    /**
     * The location of the Amazon S3 bucket where a zipped file containing your Realtime scripts is stored. The storage location must specify the Amazon S3 bucket name, the zip file name (the "key"), and a role ARN that allows Amazon GameLift to access the Amazon S3 storage location. The S3 bucket must be in the same Region where you want to create a new script. By default, Amazon GameLift uploads the latest version of the zip file; if you have S3 object versioning turned on, you can use the ObjectVersion parameter to specify an earlier version. 
     */
    StorageLocation?: S3Location;
    /**
     * A data object containing your Realtime scripts and dependencies as a zip file. The zip file can have one or multiple files. Maximum size of a zip file is 5 MB. When using the Amazon Web Services CLI tool to create a script, this parameter is set to the zip file name. It must be prepended with the string "fileb://" to indicate that the file data is a binary object. For example: --zip-file fileb://myRealtimeScript.zip.
     */
    ZipFile?: ZipBlob;
  }
  export interface UpdateScriptOutput {
    /**
     * The newly created script record with a unique script ID. The new script's storage location reflects an Amazon S3 location: (1) If the script was uploaded from an S3 bucket under your account, the storage location reflects the information that was provided in the CreateScript request; (2) If the script file was uploaded from a local zip file, the storage location reflects an S3 location controls by the Amazon GameLift service.
     */
    Script?: Script;
  }
  export interface ValidateMatchmakingRuleSetInput {
    /**
     * A collection of matchmaking rules to validate, formatted as a JSON string.
     */
    RuleSetBody: RuleSetBody;
  }
  export interface ValidateMatchmakingRuleSetOutput {
    /**
     * A response indicating whether the rule set is valid.
     */
    Valid?: BooleanModel;
  }
  export interface VpcPeeringAuthorization {
    /**
     * A unique identifier for the Amazon Web Services account that you use to manage your Amazon GameLift fleet. You can find your Account ID in the Amazon Web Services Management Console under account settings.
     */
    GameLiftAwsAccountId?: NonZeroAndMaxString;
    /**
     * The authorization's peer VPC Amazon Web Services account ID.
     */
    PeerVpcAwsAccountId?: NonZeroAndMaxString;
    /**
     * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet. The VPC must be in the same Region as your fleet. To look up a VPC ID, use the VPC Dashboard in the Amazon Web Services Management Console. Learn more about VPC peering in VPC Peering with Amazon GameLift Fleets.
     */
    PeerVpcId?: NonZeroAndMaxString;
    /**
     * Time stamp indicating when this authorization was issued. Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    CreationTime?: Timestamp;
    /**
     * Time stamp indicating when this authorization expires (24 hours after issuance). Format is a number expressed in Unix time as milliseconds (for example "1469498468.057").
     */
    ExpirationTime?: Timestamp;
  }
  export type VpcPeeringAuthorizationList = VpcPeeringAuthorization[];
  export interface VpcPeeringConnection {
    /**
     * A unique identifier for the fleet. This ID determines the ID of the Amazon GameLift VPC for your fleet.
     */
    FleetId?: FleetId;
    /**
     * The Amazon Resource Name (ARN) associated with the GameLift fleet resource for this connection. 
     */
    FleetArn?: FleetArn;
    /**
     * CIDR block of IPv4 addresses assigned to the VPC peering connection for the GameLift VPC. The peered VPC also has an IPv4 CIDR block associated with it; these blocks cannot overlap or the peering connection cannot be created. 
     */
    IpV4CidrBlock?: NonZeroAndMaxString;
    /**
     * A unique identifier that is automatically assigned to the connection record. This ID is referenced in VPC peering connection events, and is used when deleting a connection.
     */
    VpcPeeringConnectionId?: NonZeroAndMaxString;
    /**
     * The status information about the connection. Status indicates if a connection is pending, successful, or failed.
     */
    Status?: VpcPeeringConnectionStatus;
    /**
     * A unique identifier for a VPC with resources to be accessed by your Amazon GameLift fleet. The VPC must be in the same Region as your fleet. To look up a VPC ID, use the VPC Dashboard in the Amazon Web Services Management Console. Learn more about VPC peering in VPC Peering with Amazon GameLift Fleets.
     */
    PeerVpcId?: NonZeroAndMaxString;
    /**
     * A unique identifier for the VPC that contains the Amazon GameLift fleet for this connection. This VPC is managed by Amazon GameLift and does not appear in your Amazon Web Services account. 
     */
    GameLiftVpcId?: NonZeroAndMaxString;
  }
  export type VpcPeeringConnectionList = VpcPeeringConnection[];
  export interface VpcPeeringConnectionStatus {
    /**
     * Code indicating the status of a VPC peering connection.
     */
    Code?: NonZeroAndMaxString;
    /**
     * Additional messaging associated with the connection status. 
     */
    Message?: NonZeroAndMaxString;
  }
  export type VpcSubnet = string;
  export type VpcSubnets = VpcSubnet[];
  export type WeightedCapacity = string;
  export type WholeNumber = number;
  export type ZipBlob = Buffer|Uint8Array|Blob|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-10-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the GameLift client.
   */
  export import Types = GameLift;
}
export = GameLift;
