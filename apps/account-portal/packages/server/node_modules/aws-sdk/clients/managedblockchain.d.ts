import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ManagedBlockchain extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ManagedBlockchain.Types.ClientConfiguration)
  config: Config & ManagedBlockchain.Types.ClientConfiguration;
  /**
   * Creates a new accessor for use with Managed Blockchain Ethereum nodes. An accessor contains information required for token based access to your Ethereum nodes.
   */
  createAccessor(params: ManagedBlockchain.Types.CreateAccessorInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateAccessorOutput) => void): Request<ManagedBlockchain.Types.CreateAccessorOutput, AWSError>;
  /**
   * Creates a new accessor for use with Managed Blockchain Ethereum nodes. An accessor contains information required for token based access to your Ethereum nodes.
   */
  createAccessor(callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateAccessorOutput) => void): Request<ManagedBlockchain.Types.CreateAccessorOutput, AWSError>;
  /**
   * Creates a member within a Managed Blockchain network. Applies only to Hyperledger Fabric.
   */
  createMember(params: ManagedBlockchain.Types.CreateMemberInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateMemberOutput) => void): Request<ManagedBlockchain.Types.CreateMemberOutput, AWSError>;
  /**
   * Creates a member within a Managed Blockchain network. Applies only to Hyperledger Fabric.
   */
  createMember(callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateMemberOutput) => void): Request<ManagedBlockchain.Types.CreateMemberOutput, AWSError>;
  /**
   * Creates a new blockchain network using Amazon Managed Blockchain. Applies only to Hyperledger Fabric.
   */
  createNetwork(params: ManagedBlockchain.Types.CreateNetworkInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateNetworkOutput) => void): Request<ManagedBlockchain.Types.CreateNetworkOutput, AWSError>;
  /**
   * Creates a new blockchain network using Amazon Managed Blockchain. Applies only to Hyperledger Fabric.
   */
  createNetwork(callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateNetworkOutput) => void): Request<ManagedBlockchain.Types.CreateNetworkOutput, AWSError>;
  /**
   * Creates a node on the specified blockchain network. Applies to Hyperledger Fabric and Ethereum.
   */
  createNode(params: ManagedBlockchain.Types.CreateNodeInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateNodeOutput) => void): Request<ManagedBlockchain.Types.CreateNodeOutput, AWSError>;
  /**
   * Creates a node on the specified blockchain network. Applies to Hyperledger Fabric and Ethereum.
   */
  createNode(callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateNodeOutput) => void): Request<ManagedBlockchain.Types.CreateNodeOutput, AWSError>;
  /**
   * Creates a proposal for a change to the network that other members of the network can vote on, for example, a proposal to add a new member to the network. Any member can create a proposal. Applies only to Hyperledger Fabric.
   */
  createProposal(params: ManagedBlockchain.Types.CreateProposalInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateProposalOutput) => void): Request<ManagedBlockchain.Types.CreateProposalOutput, AWSError>;
  /**
   * Creates a proposal for a change to the network that other members of the network can vote on, for example, a proposal to add a new member to the network. Any member can create a proposal. Applies only to Hyperledger Fabric.
   */
  createProposal(callback?: (err: AWSError, data: ManagedBlockchain.Types.CreateProposalOutput) => void): Request<ManagedBlockchain.Types.CreateProposalOutput, AWSError>;
  /**
   * Deletes an accessor that your Amazon Web Services account owns. An accessor object is a container that has the information required for token based access to your Ethereum nodes including, the BILLING_TOKEN. After an accessor is deleted, the status of the accessor changes from AVAILABLE to PENDING_DELETION. An accessor in the PENDING_DELETION state can’t be used for new WebSocket requests or HTTP requests. However, WebSocket connections that were initiated while the accessor was in the AVAILABLE state remain open until they expire (up to 2 hours).
   */
  deleteAccessor(params: ManagedBlockchain.Types.DeleteAccessorInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.DeleteAccessorOutput) => void): Request<ManagedBlockchain.Types.DeleteAccessorOutput, AWSError>;
  /**
   * Deletes an accessor that your Amazon Web Services account owns. An accessor object is a container that has the information required for token based access to your Ethereum nodes including, the BILLING_TOKEN. After an accessor is deleted, the status of the accessor changes from AVAILABLE to PENDING_DELETION. An accessor in the PENDING_DELETION state can’t be used for new WebSocket requests or HTTP requests. However, WebSocket connections that were initiated while the accessor was in the AVAILABLE state remain open until they expire (up to 2 hours).
   */
  deleteAccessor(callback?: (err: AWSError, data: ManagedBlockchain.Types.DeleteAccessorOutput) => void): Request<ManagedBlockchain.Types.DeleteAccessorOutput, AWSError>;
  /**
   * Deletes a member. Deleting a member removes the member and all associated resources from the network. DeleteMember can only be called for a specified MemberId if the principal performing the action is associated with the Amazon Web Services account that owns the member. In all other cases, the DeleteMember action is carried out as the result of an approved proposal to remove a member. If MemberId is the last member in a network specified by the last Amazon Web Services account, the network is deleted also. Applies only to Hyperledger Fabric.
   */
  deleteMember(params: ManagedBlockchain.Types.DeleteMemberInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.DeleteMemberOutput) => void): Request<ManagedBlockchain.Types.DeleteMemberOutput, AWSError>;
  /**
   * Deletes a member. Deleting a member removes the member and all associated resources from the network. DeleteMember can only be called for a specified MemberId if the principal performing the action is associated with the Amazon Web Services account that owns the member. In all other cases, the DeleteMember action is carried out as the result of an approved proposal to remove a member. If MemberId is the last member in a network specified by the last Amazon Web Services account, the network is deleted also. Applies only to Hyperledger Fabric.
   */
  deleteMember(callback?: (err: AWSError, data: ManagedBlockchain.Types.DeleteMemberOutput) => void): Request<ManagedBlockchain.Types.DeleteMemberOutput, AWSError>;
  /**
   * Deletes a node that your Amazon Web Services account owns. All data on the node is lost and cannot be recovered. Applies to Hyperledger Fabric and Ethereum.
   */
  deleteNode(params: ManagedBlockchain.Types.DeleteNodeInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.DeleteNodeOutput) => void): Request<ManagedBlockchain.Types.DeleteNodeOutput, AWSError>;
  /**
   * Deletes a node that your Amazon Web Services account owns. All data on the node is lost and cannot be recovered. Applies to Hyperledger Fabric and Ethereum.
   */
  deleteNode(callback?: (err: AWSError, data: ManagedBlockchain.Types.DeleteNodeOutput) => void): Request<ManagedBlockchain.Types.DeleteNodeOutput, AWSError>;
  /**
   * Returns detailed information about an accessor. An accessor object is a container that has the information required for token based access to your Ethereum nodes.
   */
  getAccessor(params: ManagedBlockchain.Types.GetAccessorInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.GetAccessorOutput) => void): Request<ManagedBlockchain.Types.GetAccessorOutput, AWSError>;
  /**
   * Returns detailed information about an accessor. An accessor object is a container that has the information required for token based access to your Ethereum nodes.
   */
  getAccessor(callback?: (err: AWSError, data: ManagedBlockchain.Types.GetAccessorOutput) => void): Request<ManagedBlockchain.Types.GetAccessorOutput, AWSError>;
  /**
   * Returns detailed information about a member. Applies only to Hyperledger Fabric.
   */
  getMember(params: ManagedBlockchain.Types.GetMemberInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.GetMemberOutput) => void): Request<ManagedBlockchain.Types.GetMemberOutput, AWSError>;
  /**
   * Returns detailed information about a member. Applies only to Hyperledger Fabric.
   */
  getMember(callback?: (err: AWSError, data: ManagedBlockchain.Types.GetMemberOutput) => void): Request<ManagedBlockchain.Types.GetMemberOutput, AWSError>;
  /**
   * Returns detailed information about a network. Applies to Hyperledger Fabric and Ethereum.
   */
  getNetwork(params: ManagedBlockchain.Types.GetNetworkInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.GetNetworkOutput) => void): Request<ManagedBlockchain.Types.GetNetworkOutput, AWSError>;
  /**
   * Returns detailed information about a network. Applies to Hyperledger Fabric and Ethereum.
   */
  getNetwork(callback?: (err: AWSError, data: ManagedBlockchain.Types.GetNetworkOutput) => void): Request<ManagedBlockchain.Types.GetNetworkOutput, AWSError>;
  /**
   * Returns detailed information about a node. Applies to Hyperledger Fabric and Ethereum.
   */
  getNode(params: ManagedBlockchain.Types.GetNodeInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.GetNodeOutput) => void): Request<ManagedBlockchain.Types.GetNodeOutput, AWSError>;
  /**
   * Returns detailed information about a node. Applies to Hyperledger Fabric and Ethereum.
   */
  getNode(callback?: (err: AWSError, data: ManagedBlockchain.Types.GetNodeOutput) => void): Request<ManagedBlockchain.Types.GetNodeOutput, AWSError>;
  /**
   * Returns detailed information about a proposal. Applies only to Hyperledger Fabric.
   */
  getProposal(params: ManagedBlockchain.Types.GetProposalInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.GetProposalOutput) => void): Request<ManagedBlockchain.Types.GetProposalOutput, AWSError>;
  /**
   * Returns detailed information about a proposal. Applies only to Hyperledger Fabric.
   */
  getProposal(callback?: (err: AWSError, data: ManagedBlockchain.Types.GetProposalOutput) => void): Request<ManagedBlockchain.Types.GetProposalOutput, AWSError>;
  /**
   * Returns a list of the accessors and their properties. Accessor objects are containers that have the information required for token based access to your Ethereum nodes.
   */
  listAccessors(params: ManagedBlockchain.Types.ListAccessorsInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListAccessorsOutput) => void): Request<ManagedBlockchain.Types.ListAccessorsOutput, AWSError>;
  /**
   * Returns a list of the accessors and their properties. Accessor objects are containers that have the information required for token based access to your Ethereum nodes.
   */
  listAccessors(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListAccessorsOutput) => void): Request<ManagedBlockchain.Types.ListAccessorsOutput, AWSError>;
  /**
   * Returns a list of all invitations for the current Amazon Web Services account. Applies only to Hyperledger Fabric.
   */
  listInvitations(params: ManagedBlockchain.Types.ListInvitationsInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListInvitationsOutput) => void): Request<ManagedBlockchain.Types.ListInvitationsOutput, AWSError>;
  /**
   * Returns a list of all invitations for the current Amazon Web Services account. Applies only to Hyperledger Fabric.
   */
  listInvitations(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListInvitationsOutput) => void): Request<ManagedBlockchain.Types.ListInvitationsOutput, AWSError>;
  /**
   * Returns a list of the members in a network and properties of their configurations. Applies only to Hyperledger Fabric.
   */
  listMembers(params: ManagedBlockchain.Types.ListMembersInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListMembersOutput) => void): Request<ManagedBlockchain.Types.ListMembersOutput, AWSError>;
  /**
   * Returns a list of the members in a network and properties of their configurations. Applies only to Hyperledger Fabric.
   */
  listMembers(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListMembersOutput) => void): Request<ManagedBlockchain.Types.ListMembersOutput, AWSError>;
  /**
   * Returns information about the networks in which the current Amazon Web Services account participates. Applies to Hyperledger Fabric and Ethereum.
   */
  listNetworks(params: ManagedBlockchain.Types.ListNetworksInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListNetworksOutput) => void): Request<ManagedBlockchain.Types.ListNetworksOutput, AWSError>;
  /**
   * Returns information about the networks in which the current Amazon Web Services account participates. Applies to Hyperledger Fabric and Ethereum.
   */
  listNetworks(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListNetworksOutput) => void): Request<ManagedBlockchain.Types.ListNetworksOutput, AWSError>;
  /**
   * Returns information about the nodes within a network. Applies to Hyperledger Fabric and Ethereum.
   */
  listNodes(params: ManagedBlockchain.Types.ListNodesInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListNodesOutput) => void): Request<ManagedBlockchain.Types.ListNodesOutput, AWSError>;
  /**
   * Returns information about the nodes within a network. Applies to Hyperledger Fabric and Ethereum.
   */
  listNodes(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListNodesOutput) => void): Request<ManagedBlockchain.Types.ListNodesOutput, AWSError>;
  /**
   * Returns the list of votes for a specified proposal, including the value of each vote and the unique identifier of the member that cast the vote. Applies only to Hyperledger Fabric.
   */
  listProposalVotes(params: ManagedBlockchain.Types.ListProposalVotesInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListProposalVotesOutput) => void): Request<ManagedBlockchain.Types.ListProposalVotesOutput, AWSError>;
  /**
   * Returns the list of votes for a specified proposal, including the value of each vote and the unique identifier of the member that cast the vote. Applies only to Hyperledger Fabric.
   */
  listProposalVotes(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListProposalVotesOutput) => void): Request<ManagedBlockchain.Types.ListProposalVotesOutput, AWSError>;
  /**
   * Returns a list of proposals for the network. Applies only to Hyperledger Fabric.
   */
  listProposals(params: ManagedBlockchain.Types.ListProposalsInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListProposalsOutput) => void): Request<ManagedBlockchain.Types.ListProposalsOutput, AWSError>;
  /**
   * Returns a list of proposals for the network. Applies only to Hyperledger Fabric.
   */
  listProposals(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListProposalsOutput) => void): Request<ManagedBlockchain.Types.ListProposalsOutput, AWSError>;
  /**
   * Returns a list of tags for the specified resource. Each tag consists of a key and optional value. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
   */
  listTagsForResource(params: ManagedBlockchain.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ManagedBlockchain.Types.ListTagsForResourceResponse) => void): Request<ManagedBlockchain.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags for the specified resource. Each tag consists of a key and optional value. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: ManagedBlockchain.Types.ListTagsForResourceResponse) => void): Request<ManagedBlockchain.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Rejects an invitation to join a network. This action can be called by a principal in an Amazon Web Services account that has received an invitation to create a member and join a network. Applies only to Hyperledger Fabric.
   */
  rejectInvitation(params: ManagedBlockchain.Types.RejectInvitationInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.RejectInvitationOutput) => void): Request<ManagedBlockchain.Types.RejectInvitationOutput, AWSError>;
  /**
   * Rejects an invitation to join a network. This action can be called by a principal in an Amazon Web Services account that has received an invitation to create a member and join a network. Applies only to Hyperledger Fabric.
   */
  rejectInvitation(callback?: (err: AWSError, data: ManagedBlockchain.Types.RejectInvitationOutput) => void): Request<ManagedBlockchain.Types.RejectInvitationOutput, AWSError>;
  /**
   * Adds or overwrites the specified tags for the specified Amazon Managed Blockchain resource. Each tag consists of a key and optional value. When you specify a tag key that already exists, the tag value is overwritten with the new value. Use UntagResource to remove tag keys. A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, your request fails and returns an error. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
   */
  tagResource(params: ManagedBlockchain.Types.TagResourceRequest, callback?: (err: AWSError, data: ManagedBlockchain.Types.TagResourceResponse) => void): Request<ManagedBlockchain.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or overwrites the specified tags for the specified Amazon Managed Blockchain resource. Each tag consists of a key and optional value. When you specify a tag key that already exists, the tag value is overwritten with the new value. Use UntagResource to remove tag keys. A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, your request fails and returns an error. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
   */
  tagResource(callback?: (err: AWSError, data: ManagedBlockchain.Types.TagResourceResponse) => void): Request<ManagedBlockchain.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the Amazon Managed Blockchain resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
   */
  untagResource(params: ManagedBlockchain.Types.UntagResourceRequest, callback?: (err: AWSError, data: ManagedBlockchain.Types.UntagResourceResponse) => void): Request<ManagedBlockchain.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the Amazon Managed Blockchain resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
   */
  untagResource(callback?: (err: AWSError, data: ManagedBlockchain.Types.UntagResourceResponse) => void): Request<ManagedBlockchain.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a member configuration with new parameters. Applies only to Hyperledger Fabric.
   */
  updateMember(params: ManagedBlockchain.Types.UpdateMemberInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.UpdateMemberOutput) => void): Request<ManagedBlockchain.Types.UpdateMemberOutput, AWSError>;
  /**
   * Updates a member configuration with new parameters. Applies only to Hyperledger Fabric.
   */
  updateMember(callback?: (err: AWSError, data: ManagedBlockchain.Types.UpdateMemberOutput) => void): Request<ManagedBlockchain.Types.UpdateMemberOutput, AWSError>;
  /**
   * Updates a node configuration with new parameters. Applies only to Hyperledger Fabric.
   */
  updateNode(params: ManagedBlockchain.Types.UpdateNodeInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.UpdateNodeOutput) => void): Request<ManagedBlockchain.Types.UpdateNodeOutput, AWSError>;
  /**
   * Updates a node configuration with new parameters. Applies only to Hyperledger Fabric.
   */
  updateNode(callback?: (err: AWSError, data: ManagedBlockchain.Types.UpdateNodeOutput) => void): Request<ManagedBlockchain.Types.UpdateNodeOutput, AWSError>;
  /**
   * Casts a vote for a specified ProposalId on behalf of a member. The member to vote as, specified by VoterMemberId, must be in the same Amazon Web Services account as the principal that calls the action. Applies only to Hyperledger Fabric.
   */
  voteOnProposal(params: ManagedBlockchain.Types.VoteOnProposalInput, callback?: (err: AWSError, data: ManagedBlockchain.Types.VoteOnProposalOutput) => void): Request<ManagedBlockchain.Types.VoteOnProposalOutput, AWSError>;
  /**
   * Casts a vote for a specified ProposalId on behalf of a member. The member to vote as, specified by VoterMemberId, must be in the same Amazon Web Services account as the principal that calls the action. Applies only to Hyperledger Fabric.
   */
  voteOnProposal(callback?: (err: AWSError, data: ManagedBlockchain.Types.VoteOnProposalOutput) => void): Request<ManagedBlockchain.Types.VoteOnProposalOutput, AWSError>;
}
declare namespace ManagedBlockchain {
  export interface Accessor {
    /**
     * The unique identifier of the accessor.
     */
    Id?: ResourceIdString;
    /**
     * The type of the accessor.  Currently, accessor type is restricted to BILLING_TOKEN. 
     */
    Type?: AccessorType;
    /**
     * The billing token is a property of the accessor. Use this token to make Ethereum API calls to your Ethereum node. The billing token is used to track your accessor object for billing Ethereum API requests made to your Ethereum nodes.
     */
    BillingToken?: AccessorBillingTokenString;
    /**
     * The current status of the accessor.
     */
    Status?: AccessorStatus;
    /**
     * The creation date and time of the accessor.
     */
    CreationDate?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the accessor. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
    /**
     * The tags assigned to the Accessor. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: OutputTagMap;
  }
  export type AccessorBillingTokenString = string;
  export type AccessorListMaxResults = number;
  export type AccessorStatus = "AVAILABLE"|"PENDING_DELETION"|"DELETED"|string;
  export interface AccessorSummary {
    /**
     * The unique identifier of the accessor.
     */
    Id?: ResourceIdString;
    /**
     * The type of the accessor.  Currently accessor type is restricted to BILLING_TOKEN. 
     */
    Type?: AccessorType;
    /**
     * The current status of the accessor.
     */
    Status?: AccessorStatus;
    /**
     * The creation date and time of the accessor.
     */
    CreationDate?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the accessor. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export type AccessorSummaryList = AccessorSummary[];
  export type AccessorType = "BILLING_TOKEN"|string;
  export interface ApprovalThresholdPolicy {
    /**
     * The percentage of votes among all members that must be YES for a proposal to be approved. For example, a ThresholdPercentage value of 50 indicates 50%. The ThresholdComparator determines the precise comparison. If a ThresholdPercentage value of 50 is specified on a network with 10 members, along with a ThresholdComparator value of GREATER_THAN, this indicates that 6 YES votes are required for the proposal to be approved.
     */
    ThresholdPercentage?: ThresholdPercentageInt;
    /**
     * The duration from the time that a proposal is created until it expires. If members cast neither the required number of YES votes to approve the proposal nor the number of NO votes required to reject it before the duration expires, the proposal is EXPIRED and ProposalActions aren't carried out.
     */
    ProposalDurationInHours?: ProposalDurationInt;
    /**
     * Determines whether the vote percentage must be greater than the ThresholdPercentage or must be greater than or equal to the ThreholdPercentage to be approved.
     */
    ThresholdComparator?: ThresholdComparator;
  }
  export type ArnString = string;
  export type AvailabilityZoneString = string;
  export type ClientRequestTokenString = string;
  export interface CreateAccessorInput {
    /**
     * This is a unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than once. This identifier is required only if you make a service request directly using an HTTP client. It is generated automatically if you use an Amazon Web Services SDK or the Amazon Web Services CLI.
     */
    ClientRequestToken: ClientRequestTokenString;
    /**
     * The type of accessor.  Currently, accessor type is restricted to BILLING_TOKEN. 
     */
    AccessorType: AccessorType;
    /**
     * Tags to assign to the Accessor.  Each tag consists of a key and an optional value. You can specify multiple key-value pairs in a single request with an overall maximum of 50 tags allowed per resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: InputTagMap;
  }
  export interface CreateAccessorOutput {
    /**
     * The unique identifier of the accessor.
     */
    AccessorId?: ResourceIdString;
    /**
     * The billing token is a property of the Accessor. Use this token to make Ethereum API calls to your Ethereum node. The billing token is used to track your accessor object for billing Ethereum API requests made to your Ethereum nodes.
     */
    BillingToken?: AccessorBillingTokenString;
  }
  export interface CreateMemberInput {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time. This identifier is required only if you make a service request directly using an HTTP client. It is generated automatically if you use an Amazon Web Services SDK or the CLI.
     */
    ClientRequestToken: ClientRequestTokenString;
    /**
     * The unique identifier of the invitation that is sent to the member to join the network.
     */
    InvitationId: ResourceIdString;
    /**
     * The unique identifier of the network in which the member is created.
     */
    NetworkId: ResourceIdString;
    /**
     * Member configuration parameters.
     */
    MemberConfiguration: MemberConfiguration;
  }
  export interface CreateMemberOutput {
    /**
     * The unique identifier of the member.
     */
    MemberId?: ResourceIdString;
  }
  export interface CreateNetworkInput {
    /**
     * This is a unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than once. This identifier is required only if you make a service request directly using an HTTP client. It is generated automatically if you use an Amazon Web Services SDK or the Amazon Web Services CLI. 
     */
    ClientRequestToken: ClientRequestTokenString;
    /**
     * The name of the network.
     */
    Name: NameString;
    /**
     * An optional description for the network.
     */
    Description?: DescriptionString;
    /**
     * The blockchain framework that the network uses.
     */
    Framework: Framework;
    /**
     * The version of the blockchain framework that the network uses.
     */
    FrameworkVersion: FrameworkVersionString;
    /**
     *  Configuration properties of the blockchain framework relevant to the network configuration. 
     */
    FrameworkConfiguration?: NetworkFrameworkConfiguration;
    /**
     *  The voting rules used by the network to determine if a proposal is approved. 
     */
    VotingPolicy: VotingPolicy;
    /**
     * Configuration properties for the first member within the network.
     */
    MemberConfiguration: MemberConfiguration;
    /**
     * Tags to assign to the network.  Each tag consists of a key and an optional value. You can specify multiple key-value pairs in a single request with an overall maximum of 50 tags allowed per resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: InputTagMap;
  }
  export interface CreateNetworkOutput {
    /**
     * The unique identifier for the network.
     */
    NetworkId?: ResourceIdString;
    /**
     * The unique identifier for the first member within the network.
     */
    MemberId?: ResourceIdString;
  }
  export interface CreateNodeInput {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time. This identifier is required only if you make a service request directly using an HTTP client. It is generated automatically if you use an Amazon Web Services SDK or the CLI.
     */
    ClientRequestToken: ClientRequestTokenString;
    /**
     * The unique identifier of the network for the node. Ethereum public networks have the following NetworkIds:    n-ethereum-mainnet     n-ethereum-goerli   
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member that owns this node. Applies only to Hyperledger Fabric.
     */
    MemberId?: ResourceIdString;
    /**
     * The properties of a node configuration.
     */
    NodeConfiguration: NodeConfiguration;
    /**
     * Tags to assign to the node.  Each tag consists of a key and an optional value. You can specify multiple key-value pairs in a single request with an overall maximum of 50 tags allowed per resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: InputTagMap;
  }
  export interface CreateNodeOutput {
    /**
     * The unique identifier of the node.
     */
    NodeId?: ResourceIdString;
  }
  export interface CreateProposalInput {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time. This identifier is required only if you make a service request directly using an HTTP client. It is generated automatically if you use an Amazon Web Services SDK or the CLI.
     */
    ClientRequestToken: ClientRequestTokenString;
    /**
     *  The unique identifier of the network for which the proposal is made.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member that is creating the proposal. This identifier is especially useful for identifying the member making the proposal when multiple members exist in a single Amazon Web Services account.
     */
    MemberId: ResourceIdString;
    /**
     * The type of actions proposed, such as inviting a member or removing a member. The types of Actions in a proposal are mutually exclusive. For example, a proposal with Invitations actions cannot also contain Removals actions.
     */
    Actions: ProposalActions;
    /**
     * A description for the proposal that is visible to voting members, for example, "Proposal to add Example Corp. as member."
     */
    Description?: DescriptionString;
    /**
     * Tags to assign to the proposal.  Each tag consists of a key and an optional value. You can specify multiple key-value pairs in a single request with an overall maximum of 50 tags allowed per resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: InputTagMap;
  }
  export interface CreateProposalOutput {
    /**
     * The unique identifier of the proposal.
     */
    ProposalId?: ResourceIdString;
  }
  export interface DeleteAccessorInput {
    /**
     * The unique identifier of the accessor.
     */
    AccessorId: ResourceIdString;
  }
  export interface DeleteAccessorOutput {
  }
  export interface DeleteMemberInput {
    /**
     * The unique identifier of the network from which the member is removed.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member to remove.
     */
    MemberId: ResourceIdString;
  }
  export interface DeleteMemberOutput {
  }
  export interface DeleteNodeInput {
    /**
     * The unique identifier of the network that the node is on. Ethereum public networks have the following NetworkIds:    n-ethereum-mainnet     n-ethereum-goerli   
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member that owns this node. Applies only to Hyperledger Fabric and is required for Hyperledger Fabric.
     */
    MemberId?: ResourceIdString;
    /**
     * The unique identifier of the node.
     */
    NodeId: ResourceIdString;
  }
  export interface DeleteNodeOutput {
  }
  export type DescriptionString = string;
  export type Edition = "STARTER"|"STANDARD"|string;
  export type Enabled = boolean;
  export type Framework = "HYPERLEDGER_FABRIC"|"ETHEREUM"|string;
  export type FrameworkVersionString = string;
  export interface GetAccessorInput {
    /**
     * The unique identifier of the accessor.
     */
    AccessorId: ResourceIdString;
  }
  export interface GetAccessorOutput {
    /**
     * The properties of the accessor.
     */
    Accessor?: Accessor;
  }
  export interface GetMemberInput {
    /**
     * The unique identifier of the network to which the member belongs.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member.
     */
    MemberId: ResourceIdString;
  }
  export interface GetMemberOutput {
    /**
     * The properties of a member.
     */
    Member?: Member;
  }
  export interface GetNetworkInput {
    /**
     * The unique identifier of the network to get information about.
     */
    NetworkId: ResourceIdString;
  }
  export interface GetNetworkOutput {
    /**
     * An object containing network configuration parameters.
     */
    Network?: Network;
  }
  export interface GetNodeInput {
    /**
     * The unique identifier of the network that the node is on.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member that owns the node. Applies only to Hyperledger Fabric and is required for Hyperledger Fabric.
     */
    MemberId?: ResourceIdString;
    /**
     * The unique identifier of the node.
     */
    NodeId: ResourceIdString;
  }
  export interface GetNodeOutput {
    /**
     * Properties of the node configuration.
     */
    Node?: Node;
  }
  export interface GetProposalInput {
    /**
     * The unique identifier of the network for which the proposal is made.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the proposal.
     */
    ProposalId: ResourceIdString;
  }
  export interface GetProposalOutput {
    /**
     * Information about a proposal.
     */
    Proposal?: Proposal;
  }
  export type InputTagMap = {[key: string]: TagValue};
  export type InstanceTypeString = string;
  export interface Invitation {
    /**
     * The unique identifier for the invitation.
     */
    InvitationId?: ResourceIdString;
    /**
     * The date and time that the invitation was created.
     */
    CreationDate?: Timestamp;
    /**
     * The date and time that the invitation expires. This is the CreationDate plus the ProposalDurationInHours that is specified in the ProposalThresholdPolicy. After this date and time, the invitee can no longer create a member and join the network using this InvitationId.
     */
    ExpirationDate?: Timestamp;
    /**
     * The status of the invitation:    PENDING - The invitee hasn't created a member to join the network, and the invitation hasn't yet expired.    ACCEPTING - The invitee has begun creating a member, and creation hasn't yet completed.    ACCEPTED - The invitee created a member and joined the network using the InvitationID.    REJECTED - The invitee rejected the invitation.    EXPIRED - The invitee neither created a member nor rejected the invitation before the ExpirationDate.  
     */
    Status?: InvitationStatus;
    NetworkSummary?: NetworkSummary;
    /**
     * The Amazon Resource Name (ARN) of the invitation. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export type InvitationList = Invitation[];
  export type InvitationStatus = "PENDING"|"ACCEPTED"|"ACCEPTING"|"REJECTED"|"EXPIRED"|string;
  export interface InviteAction {
    /**
     * The Amazon Web Services account ID to invite.
     */
    Principal: PrincipalString;
  }
  export type InviteActionList = InviteAction[];
  export type IsOwned = boolean;
  export interface ListAccessorsInput {
    /**
     *  The maximum number of accessors to list.
     */
    MaxResults?: AccessorListMaxResults;
    /**
     *  The pagination token that indicates the next set of results to retrieve. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListAccessorsOutput {
    /**
     * An array of AccessorSummary objects that contain configuration properties for each accessor.
     */
    Accessors?: AccessorSummaryList;
    /**
     *  The pagination token that indicates the next set of results to retrieve. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListInvitationsInput {
    /**
     * The maximum number of invitations to return.
     */
    MaxResults?: ProposalListMaxResults;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListInvitationsOutput {
    /**
     * The invitations for the network.
     */
    Invitations?: InvitationList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListMembersInput {
    /**
     * The unique identifier of the network for which to list members.
     */
    NetworkId: ResourceIdString;
    /**
     * The optional name of the member to list.
     */
    Name?: String;
    /**
     * An optional status specifier. If provided, only members currently in this status are listed.
     */
    Status?: MemberStatus;
    /**
     * An optional Boolean value. If provided, the request is limited either to members that the current Amazon Web Services account owns (true) or that other Amazon Web Services accountsn own (false). If omitted, all members are listed.
     */
    IsOwned?: IsOwned;
    /**
     * The maximum number of members to return in the request.
     */
    MaxResults?: MemberListMaxResults;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListMembersOutput {
    /**
     * An array of MemberSummary objects. Each object contains details about a network member.
     */
    Members?: MemberSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListNetworksInput {
    /**
     * The name of the network.
     */
    Name?: String;
    /**
     * An optional framework specifier. If provided, only networks of this framework type are listed.
     */
    Framework?: Framework;
    /**
     * An optional status specifier. If provided, only networks currently in this status are listed. Applies only to Hyperledger Fabric.
     */
    Status?: NetworkStatus;
    /**
     * The maximum number of networks to list.
     */
    MaxResults?: NetworkListMaxResults;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListNetworksOutput {
    /**
     * An array of NetworkSummary objects that contain configuration properties for each network.
     */
    Networks?: NetworkSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListNodesInput {
    /**
     * The unique identifier of the network for which to list nodes.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member who owns the nodes to list. Applies only to Hyperledger Fabric and is required for Hyperledger Fabric.
     */
    MemberId?: ResourceIdString;
    /**
     * An optional status specifier. If provided, only nodes currently in this status are listed.
     */
    Status?: NodeStatus;
    /**
     * The maximum number of nodes to list.
     */
    MaxResults?: NodeListMaxResults;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListNodesOutput {
    /**
     * An array of NodeSummary objects that contain configuration properties for each node.
     */
    Nodes?: NodeSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListProposalVotesInput {
    /**
     *  The unique identifier of the network. 
     */
    NetworkId: ResourceIdString;
    /**
     *  The unique identifier of the proposal. 
     */
    ProposalId: ResourceIdString;
    /**
     *  The maximum number of votes to return. 
     */
    MaxResults?: ProposalListMaxResults;
    /**
     *  The pagination token that indicates the next set of results to retrieve. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListProposalVotesOutput {
    /**
     *  The list of votes. 
     */
    ProposalVotes?: ProposalVoteList;
    /**
     *  The pagination token that indicates the next set of results to retrieve. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListProposalsInput {
    /**
     *  The unique identifier of the network. 
     */
    NetworkId: ResourceIdString;
    /**
     *  The maximum number of proposals to return. 
     */
    MaxResults?: ProposalListMaxResults;
    /**
     *  The pagination token that indicates the next set of results to retrieve. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListProposalsOutput {
    /**
     * The summary of each proposal made on the network.
     */
    Proposals?: ProposalSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    ResourceArn: ArnString;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags assigned to the resource.
     */
    Tags?: OutputTagMap;
  }
  export interface LogConfiguration {
    /**
     * Indicates whether logging is enabled.
     */
    Enabled?: Enabled;
  }
  export interface LogConfigurations {
    /**
     * Parameters for publishing logs to Amazon CloudWatch Logs.
     */
    Cloudwatch?: LogConfiguration;
  }
  export interface Member {
    /**
     * The unique identifier of the network to which the member belongs.
     */
    NetworkId?: ResourceIdString;
    /**
     * The unique identifier of the member.
     */
    Id?: ResourceIdString;
    /**
     * The name of the member.
     */
    Name?: NetworkMemberNameString;
    /**
     * An optional description for the member.
     */
    Description?: DescriptionString;
    /**
     * Attributes relevant to a member for the blockchain framework that the Managed Blockchain network uses.
     */
    FrameworkAttributes?: MemberFrameworkAttributes;
    /**
     * Configuration properties for logging events associated with a member.
     */
    LogPublishingConfiguration?: MemberLogPublishingConfiguration;
    /**
     * The status of a member.    CREATING - The Amazon Web Services account is in the process of creating a member.    AVAILABLE - The member has been created and can participate in the network.    CREATE_FAILED - The Amazon Web Services account attempted to create a member and creation failed.    UPDATING - The member is in the process of being updated.    DELETING - The member and all associated resources are in the process of being deleted. Either the Amazon Web Services account that owns the member deleted it, or the member is being deleted as the result of an APPROVED PROPOSAL to remove the member.    DELETED - The member can no longer participate on the network and all associated resources are deleted. Either the Amazon Web Services account that owns the member deleted it, or the member is being deleted as the result of an APPROVED PROPOSAL to remove the member.    INACCESSIBLE_ENCRYPTION_KEY - The member is impaired and might not function as expected because it cannot access the specified customer managed key in KMS for encryption at rest. Either the KMS key was disabled or deleted, or the grants on the key were revoked. The effect of disabling or deleting a key or of revoking a grant isn't immediate. It might take some time for the member resource to discover that the key is inaccessible. When a resource is in this state, we recommend deleting and recreating the resource.  
     */
    Status?: MemberStatus;
    /**
     * The date and time that the member was created.
     */
    CreationDate?: Timestamp;
    /**
     * Tags assigned to the member. Tags consist of a key and optional value. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: OutputTagMap;
    /**
     * The Amazon Resource Name (ARN) of the member. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
    /**
     * The Amazon Resource Name (ARN) of the customer managed key in Key Management Service (KMS) that the member uses for encryption at rest. If the value of this parameter is "AWS Owned KMS Key", the member uses an Amazon Web Services owned KMS key for encryption. This parameter is inherited by the nodes that this member owns. For more information, see Encryption at Rest in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    KmsKeyArn?: String;
  }
  export interface MemberConfiguration {
    /**
     * The name of the member.
     */
    Name: NetworkMemberNameString;
    /**
     * An optional description of the member.
     */
    Description?: DescriptionString;
    /**
     * Configuration properties of the blockchain framework relevant to the member.
     */
    FrameworkConfiguration: MemberFrameworkConfiguration;
    /**
     * Configuration properties for logging events associated with a member of a Managed Blockchain network.
     */
    LogPublishingConfiguration?: MemberLogPublishingConfiguration;
    /**
     * Tags assigned to the member. Tags consist of a key and optional value.  When specifying tags during creation, you can specify multiple key-value pairs in a single request, with an overall maximum of 50 tags added to each resource. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: InputTagMap;
    /**
     * The Amazon Resource Name (ARN) of the customer managed key in Key Management Service (KMS) to use for encryption at rest in the member. This parameter is inherited by any nodes that this member creates. For more information, see Encryption at Rest in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide. Use one of the following options to specify this parameter:    Undefined or empty string - By default, use an KMS key that is owned and managed by Amazon Web Services on your behalf.    A valid symmetric customer managed KMS key - Use the specified KMS key in your account that you create, own, and manage. Amazon Managed Blockchain doesn't support asymmetric keys. For more information, see Using symmetric and asymmetric keys in the Key Management Service Developer Guide. The following is an example of a KMS key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab   
     */
    KmsKeyArn?: ArnString;
  }
  export interface MemberFabricAttributes {
    /**
     * The user name for the initial administrator user for the member.
     */
    AdminUsername?: UsernameString;
    /**
     * The endpoint used to access the member's certificate authority.
     */
    CaEndpoint?: String;
  }
  export interface MemberFabricConfiguration {
    /**
     * The user name for the member's initial administrative user.
     */
    AdminUsername: UsernameString;
    /**
     * The password for the member's initial administrative user. The AdminPassword must be at least 8 characters long and no more than 32 characters. It must contain at least one uppercase letter, one lowercase letter, and one digit. It cannot have a single quotation mark (‘), a double quotation marks (“), a forward slash(/), a backward slash(\), @, or a space.
     */
    AdminPassword: PasswordString;
  }
  export interface MemberFabricLogPublishingConfiguration {
    /**
     * Configuration properties for logging events associated with a member's Certificate Authority (CA). CA logs help you determine when a member in your account joins the network, or when new peers register with a member CA.
     */
    CaLogs?: LogConfigurations;
  }
  export interface MemberFrameworkAttributes {
    /**
     * Attributes of Hyperledger Fabric relevant to a member on a Managed Blockchain network that uses Hyperledger Fabric.
     */
    Fabric?: MemberFabricAttributes;
  }
  export interface MemberFrameworkConfiguration {
    /**
     * Attributes of Hyperledger Fabric for a member on a Managed Blockchain network that uses Hyperledger Fabric.
     */
    Fabric?: MemberFabricConfiguration;
  }
  export type MemberListMaxResults = number;
  export interface MemberLogPublishingConfiguration {
    /**
     * Configuration properties for logging events associated with a member of a Managed Blockchain network using the Hyperledger Fabric framework.
     */
    Fabric?: MemberFabricLogPublishingConfiguration;
  }
  export type MemberStatus = "CREATING"|"AVAILABLE"|"CREATE_FAILED"|"UPDATING"|"DELETING"|"DELETED"|"INACCESSIBLE_ENCRYPTION_KEY"|string;
  export interface MemberSummary {
    /**
     * The unique identifier of the member.
     */
    Id?: ResourceIdString;
    /**
     * The name of the member.
     */
    Name?: NetworkMemberNameString;
    /**
     * An optional description of the member.
     */
    Description?: DescriptionString;
    /**
     * The status of the member.    CREATING - The Amazon Web Services account is in the process of creating a member.    AVAILABLE - The member has been created and can participate in the network.    CREATE_FAILED - The Amazon Web Services account attempted to create a member and creation failed.    UPDATING - The member is in the process of being updated.    DELETING - The member and all associated resources are in the process of being deleted. Either the Amazon Web Services account that owns the member deleted it, or the member is being deleted as the result of an APPROVED PROPOSAL to remove the member.    DELETED - The member can no longer participate on the network and all associated resources are deleted. Either the Amazon Web Services account that owns the member deleted it, or the member is being deleted as the result of an APPROVED PROPOSAL to remove the member.    INACCESSIBLE_ENCRYPTION_KEY - The member is impaired and might not function as expected because it cannot access the specified customer managed key in Key Management Service (KMS) for encryption at rest. Either the KMS key was disabled or deleted, or the grants on the key were revoked. The effect of disabling or deleting a key or of revoking a grant isn't immediate. It might take some time for the member resource to discover that the key is inaccessible. When a resource is in this state, we recommend deleting and recreating the resource.  
     */
    Status?: MemberStatus;
    /**
     * The date and time that the member was created.
     */
    CreationDate?: Timestamp;
    /**
     * An indicator of whether the member is owned by your Amazon Web Services account or a different Amazon Web Services account.
     */
    IsOwned?: IsOwned;
    /**
     * The Amazon Resource Name (ARN) of the member. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export type MemberSummaryList = MemberSummary[];
  export type NameString = string;
  export interface Network {
    /**
     * The unique identifier of the network.
     */
    Id?: ResourceIdString;
    /**
     * The name of the network.
     */
    Name?: NameString;
    /**
     * Attributes of the blockchain framework for the network.
     */
    Description?: DescriptionString;
    /**
     * The blockchain framework that the network uses.
     */
    Framework?: Framework;
    /**
     * The version of the blockchain framework that the network uses.
     */
    FrameworkVersion?: FrameworkVersionString;
    /**
     * Attributes of the blockchain framework that the network uses.
     */
    FrameworkAttributes?: NetworkFrameworkAttributes;
    /**
     * The VPC endpoint service name of the VPC endpoint service of the network. Members use the VPC endpoint service name to create a VPC endpoint to access network resources.
     */
    VpcEndpointServiceName?: String;
    /**
     * The voting rules that the network uses to decide if a proposal is accepted.
     */
    VotingPolicy?: VotingPolicy;
    /**
     * The current status of the network.
     */
    Status?: NetworkStatus;
    /**
     * The date and time that the network was created.
     */
    CreationDate?: Timestamp;
    /**
     * Tags assigned to the network. Each tag consists of a key and optional value. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: OutputTagMap;
    /**
     * The Amazon Resource Name (ARN) of the network. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export interface NetworkEthereumAttributes {
    /**
     * The Ethereum CHAIN_ID associated with the Ethereum network. Chain IDs are as follows:   mainnet = 1    goerli = 5   
     */
    ChainId?: String;
  }
  export interface NetworkFabricAttributes {
    /**
     * The endpoint of the ordering service for the network.
     */
    OrderingServiceEndpoint?: String;
    /**
     * The edition of Amazon Managed Blockchain that Hyperledger Fabric uses. For more information, see Amazon Managed Blockchain Pricing.
     */
    Edition?: Edition;
  }
  export interface NetworkFabricConfiguration {
    /**
     * The edition of Amazon Managed Blockchain that the network uses. For more information, see Amazon Managed Blockchain Pricing.
     */
    Edition: Edition;
  }
  export interface NetworkFrameworkAttributes {
    /**
     * Attributes of Hyperledger Fabric for a Managed Blockchain network that uses Hyperledger Fabric.
     */
    Fabric?: NetworkFabricAttributes;
    /**
     * Attributes of an Ethereum network for Managed Blockchain resources participating in an Ethereum network. 
     */
    Ethereum?: NetworkEthereumAttributes;
  }
  export interface NetworkFrameworkConfiguration {
    /**
     *  Hyperledger Fabric configuration properties for a Managed Blockchain network that uses Hyperledger Fabric. 
     */
    Fabric?: NetworkFabricConfiguration;
  }
  export type NetworkListMaxResults = number;
  export type NetworkMemberNameString = string;
  export type NetworkStatus = "CREATING"|"AVAILABLE"|"CREATE_FAILED"|"DELETING"|"DELETED"|string;
  export interface NetworkSummary {
    /**
     * The unique identifier of the network.
     */
    Id?: ResourceIdString;
    /**
     * The name of the network.
     */
    Name?: NameString;
    /**
     * An optional description of the network.
     */
    Description?: DescriptionString;
    /**
     * The blockchain framework that the network uses.
     */
    Framework?: Framework;
    /**
     * The version of the blockchain framework that the network uses.
     */
    FrameworkVersion?: FrameworkVersionString;
    /**
     * The current status of the network.
     */
    Status?: NetworkStatus;
    /**
     * The date and time that the network was created.
     */
    CreationDate?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the network. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export type NetworkSummaryList = NetworkSummary[];
  export interface Node {
    /**
     * The unique identifier of the network that the node is on.
     */
    NetworkId?: ResourceIdString;
    /**
     * The unique identifier of the member to which the node belongs. Applies only to Hyperledger Fabric.
     */
    MemberId?: ResourceIdString;
    /**
     * The unique identifier of the node.
     */
    Id?: ResourceIdString;
    /**
     * The instance type of the node.
     */
    InstanceType?: InstanceTypeString;
    /**
     * The Availability Zone in which the node exists. Required for Ethereum nodes. 
     */
    AvailabilityZone?: AvailabilityZoneString;
    /**
     * Attributes of the blockchain framework being used.
     */
    FrameworkAttributes?: NodeFrameworkAttributes;
    /**
     * Configuration properties for logging events associated with a peer node on a Hyperledger Fabric network on Managed Blockchain.
     */
    LogPublishingConfiguration?: NodeLogPublishingConfiguration;
    /**
     * The state database that the node uses. Values are LevelDB or CouchDB. Applies only to Hyperledger Fabric.
     */
    StateDB?: StateDBType;
    /**
     * The status of the node.    CREATING - The Amazon Web Services account is in the process of creating a node.    AVAILABLE - The node has been created and can participate in the network.    UNHEALTHY - The node is impaired and might not function as expected. Amazon Managed Blockchain automatically finds nodes in this state and tries to recover them. If a node is recoverable, it returns to AVAILABLE. Otherwise, it moves to FAILED status.    CREATE_FAILED - The Amazon Web Services account attempted to create a node and creation failed.    UPDATING - The node is in the process of being updated.    DELETING - The node is in the process of being deleted.    DELETED - The node can no longer participate on the network.    FAILED - The node is no longer functional, cannot be recovered, and must be deleted.    INACCESSIBLE_ENCRYPTION_KEY - The node is impaired and might not function as expected because it cannot access the specified customer managed key in KMS for encryption at rest. Either the KMS key was disabled or deleted, or the grants on the key were revoked. The effect of disabling or deleting a key or of revoking a grant isn't immediate. It might take some time for the node resource to discover that the key is inaccessible. When a resource is in this state, we recommend deleting and recreating the resource.  
     */
    Status?: NodeStatus;
    /**
     * The date and time that the node was created.
     */
    CreationDate?: Timestamp;
    /**
     * Tags assigned to the node. Each tag consists of a key and optional value. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: OutputTagMap;
    /**
     * The Amazon Resource Name (ARN) of the node. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
    /**
     * The Amazon Resource Name (ARN) of the customer managed key in Key Management Service (KMS) that the node uses for encryption at rest. If the value of this parameter is "AWS Owned KMS Key", the node uses an Amazon Web Services owned KMS key for encryption. The node inherits this parameter from the member that it belongs to. For more information, see Encryption at Rest in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide. Applies only to Hyperledger Fabric.
     */
    KmsKeyArn?: String;
  }
  export interface NodeConfiguration {
    /**
     * The Amazon Managed Blockchain instance type for the node.
     */
    InstanceType: InstanceTypeString;
    /**
     * The Availability Zone in which the node exists. Required for Ethereum nodes. 
     */
    AvailabilityZone?: AvailabilityZoneString;
    /**
     * Configuration properties for logging events associated with a peer node on a Hyperledger Fabric network on Managed Blockchain. 
     */
    LogPublishingConfiguration?: NodeLogPublishingConfiguration;
    /**
     * The state database that the node uses. Values are LevelDB or CouchDB. When using an Amazon Managed Blockchain network with Hyperledger Fabric version 1.4 or later, the default is CouchDB. Applies only to Hyperledger Fabric.
     */
    StateDB?: StateDBType;
  }
  export interface NodeEthereumAttributes {
    /**
     * The endpoint on which the Ethereum node listens to run Ethereum API methods over HTTP connections from a client. Use this endpoint in client code for smart contracts when using an HTTP connection. Connections to this endpoint are authenticated using Signature Version 4.
     */
    HttpEndpoint?: String;
    /**
     * The endpoint on which the Ethereum node listens to run Ethereum JSON-RPC methods over WebSocket connections from a client. Use this endpoint in client code for smart contracts when using a WebSocket connection. Connections to this endpoint are authenticated using Signature Version 4.
     */
    WebSocketEndpoint?: String;
  }
  export interface NodeFabricAttributes {
    /**
     * The endpoint that identifies the peer node for all services except peer channel-based event services.
     */
    PeerEndpoint?: String;
    /**
     * The endpoint that identifies the peer node for peer channel-based event services.
     */
    PeerEventEndpoint?: String;
  }
  export interface NodeFabricLogPublishingConfiguration {
    /**
     * Configuration properties for logging events associated with chaincode execution on a peer node. Chaincode logs contain the results of instantiating, invoking, and querying the chaincode. A peer can run multiple instances of chaincode. When enabled, a log stream is created for all chaincodes, with an individual log stream for each chaincode.
     */
    ChaincodeLogs?: LogConfigurations;
    /**
     * Configuration properties for a peer node log. Peer node logs contain messages generated when your client submits transaction proposals to peer nodes, requests to join channels, enrolls an admin peer, and lists the chaincode instances on a peer node. 
     */
    PeerLogs?: LogConfigurations;
  }
  export interface NodeFrameworkAttributes {
    /**
     * Attributes of Hyperledger Fabric for a peer node on a Managed Blockchain network that uses Hyperledger Fabric.
     */
    Fabric?: NodeFabricAttributes;
    /**
     * Attributes of Ethereum for a node on a Managed Blockchain network that uses Ethereum. 
     */
    Ethereum?: NodeEthereumAttributes;
  }
  export type NodeListMaxResults = number;
  export interface NodeLogPublishingConfiguration {
    /**
     * Configuration properties for logging events associated with a node that is owned by a member of a Managed Blockchain network using the Hyperledger Fabric framework.
     */
    Fabric?: NodeFabricLogPublishingConfiguration;
  }
  export type NodeStatus = "CREATING"|"AVAILABLE"|"UNHEALTHY"|"CREATE_FAILED"|"UPDATING"|"DELETING"|"DELETED"|"FAILED"|"INACCESSIBLE_ENCRYPTION_KEY"|string;
  export interface NodeSummary {
    /**
     * The unique identifier of the node.
     */
    Id?: ResourceIdString;
    /**
     * The status of the node.
     */
    Status?: NodeStatus;
    /**
     * The date and time that the node was created.
     */
    CreationDate?: Timestamp;
    /**
     * The Availability Zone in which the node exists.
     */
    AvailabilityZone?: AvailabilityZoneString;
    /**
     * The EC2 instance type for the node.
     */
    InstanceType?: InstanceTypeString;
    /**
     * The Amazon Resource Name (ARN) of the node. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export type NodeSummaryList = NodeSummary[];
  export type OutputTagMap = {[key: string]: TagValue};
  export type PaginationToken = string;
  export type PasswordString = string;
  export type PrincipalString = string;
  export interface Proposal {
    /**
     * The unique identifier of the proposal.
     */
    ProposalId?: ResourceIdString;
    /**
     * The unique identifier of the network for which the proposal is made.
     */
    NetworkId?: ResourceIdString;
    /**
     * The description of the proposal.
     */
    Description?: DescriptionString;
    /**
     * The actions to perform on the network if the proposal is APPROVED.
     */
    Actions?: ProposalActions;
    /**
     * The unique identifier of the member that created the proposal.
     */
    ProposedByMemberId?: ResourceIdString;
    /**
     * The name of the member that created the proposal.
     */
    ProposedByMemberName?: NetworkMemberNameString;
    /**
     * The status of the proposal. Values are as follows:    IN_PROGRESS - The proposal is active and open for member voting.    APPROVED - The proposal was approved with sufficient YES votes among members according to the VotingPolicy specified for the Network. The specified proposal actions are carried out.    REJECTED - The proposal was rejected with insufficient YES votes among members according to the VotingPolicy specified for the Network. The specified ProposalActions aren't carried out.    EXPIRED - Members didn't cast the number of votes required to determine the proposal outcome before the proposal expired. The specified ProposalActions aren't carried out.    ACTION_FAILED - One or more of the specified ProposalActions in a proposal that was approved couldn't be completed because of an error. The ACTION_FAILED status occurs even if only one ProposalAction fails and other actions are successful.  
     */
    Status?: ProposalStatus;
    /**
     *  The date and time that the proposal was created. 
     */
    CreationDate?: Timestamp;
    /**
     *  The date and time that the proposal expires. This is the CreationDate plus the ProposalDurationInHours that is specified in the ProposalThresholdPolicy. After this date and time, if members haven't cast enough votes to determine the outcome according to the voting policy, the proposal is EXPIRED and Actions aren't carried out. 
     */
    ExpirationDate?: Timestamp;
    /**
     *  The current total of YES votes cast on the proposal by members. 
     */
    YesVoteCount?: VoteCount;
    /**
     *  The current total of NO votes cast on the proposal by members. 
     */
    NoVoteCount?: VoteCount;
    /**
     *  The number of votes remaining to be cast on the proposal by members. In other words, the number of members minus the sum of YES votes and NO votes. 
     */
    OutstandingVoteCount?: VoteCount;
    /**
     * Tags assigned to the proposal. Each tag consists of a key and optional value. For more information about tags, see Tagging Resources in the Amazon Managed Blockchain Ethereum Developer Guide, or Tagging Resources in the Amazon Managed Blockchain Hyperledger Fabric Developer Guide.
     */
    Tags?: OutputTagMap;
    /**
     * The Amazon Resource Name (ARN) of the proposal. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export interface ProposalActions {
    /**
     *  The actions to perform for an APPROVED proposal to invite an Amazon Web Services account to create a member and join the network. 
     */
    Invitations?: InviteActionList;
    /**
     *  The actions to perform for an APPROVED proposal to remove a member from the network, which deletes the member and all associated member resources from the network. 
     */
    Removals?: RemoveActionList;
  }
  export type ProposalDurationInt = number;
  export type ProposalListMaxResults = number;
  export type ProposalStatus = "IN_PROGRESS"|"APPROVED"|"REJECTED"|"EXPIRED"|"ACTION_FAILED"|string;
  export interface ProposalSummary {
    /**
     *  The unique identifier of the proposal. 
     */
    ProposalId?: ResourceIdString;
    /**
     *  The description of the proposal. 
     */
    Description?: DescriptionString;
    /**
     *  The unique identifier of the member that created the proposal. 
     */
    ProposedByMemberId?: ResourceIdString;
    /**
     *  The name of the member that created the proposal. 
     */
    ProposedByMemberName?: NetworkMemberNameString;
    /**
     * The status of the proposal. Values are as follows:    IN_PROGRESS - The proposal is active and open for member voting.    APPROVED - The proposal was approved with sufficient YES votes among members according to the VotingPolicy specified for the Network. The specified proposal actions are carried out.    REJECTED - The proposal was rejected with insufficient YES votes among members according to the VotingPolicy specified for the Network. The specified ProposalActions aren't carried out.    EXPIRED - Members didn't cast the number of votes required to determine the proposal outcome before the proposal expired. The specified ProposalActions aren't carried out.    ACTION_FAILED - One or more of the specified ProposalActions in a proposal that was approved couldn't be completed because of an error.  
     */
    Status?: ProposalStatus;
    /**
     *  The date and time that the proposal was created. 
     */
    CreationDate?: Timestamp;
    /**
     *  The date and time that the proposal expires. This is the CreationDate plus the ProposalDurationInHours that is specified in the ProposalThresholdPolicy. After this date and time, if members haven't cast enough votes to determine the outcome according to the voting policy, the proposal is EXPIRED and Actions aren't carried out. 
     */
    ExpirationDate?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the proposal. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    Arn?: ArnString;
  }
  export type ProposalSummaryList = ProposalSummary[];
  export type ProposalVoteList = VoteSummary[];
  export interface RejectInvitationInput {
    /**
     * The unique identifier of the invitation to reject.
     */
    InvitationId: ResourceIdString;
  }
  export interface RejectInvitationOutput {
  }
  export interface RemoveAction {
    /**
     * The unique identifier of the member to remove.
     */
    MemberId: ResourceIdString;
  }
  export type RemoveActionList = RemoveAction[];
  export type ResourceIdString = string;
  export type StateDBType = "LevelDB"|"CouchDB"|string;
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    ResourceArn: ArnString;
    /**
     * The tags to assign to the specified resource. Tag values can be empty, for example, "MyTagKey" : "". You can specify multiple key-value pairs in a single request, with an overall maximum of 50 tags added to each resource.
     */
    Tags: InputTagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type ThresholdComparator = "GREATER_THAN"|"GREATER_THAN_OR_EQUAL_TO"|string;
  export type ThresholdPercentageInt = number;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. For more information about ARNs and their format, see Amazon Resource Names (ARNs) in the Amazon Web Services General Reference.
     */
    ResourceArn: ArnString;
    /**
     * The tag keys.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateMemberInput {
    /**
     * The unique identifier of the Managed Blockchain network to which the member belongs.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member.
     */
    MemberId: ResourceIdString;
    /**
     * Configuration properties for publishing to Amazon CloudWatch Logs.
     */
    LogPublishingConfiguration?: MemberLogPublishingConfiguration;
  }
  export interface UpdateMemberOutput {
  }
  export interface UpdateNodeInput {
    /**
     * The unique identifier of the network that the node is on.
     */
    NetworkId: ResourceIdString;
    /**
     * The unique identifier of the member that owns the node. Applies only to Hyperledger Fabric.
     */
    MemberId?: ResourceIdString;
    /**
     * The unique identifier of the node.
     */
    NodeId: ResourceIdString;
    /**
     * Configuration properties for publishing to Amazon CloudWatch Logs.
     */
    LogPublishingConfiguration?: NodeLogPublishingConfiguration;
  }
  export interface UpdateNodeOutput {
  }
  export type UsernameString = string;
  export type VoteCount = number;
  export interface VoteOnProposalInput {
    /**
     *  The unique identifier of the network. 
     */
    NetworkId: ResourceIdString;
    /**
     *  The unique identifier of the proposal. 
     */
    ProposalId: ResourceIdString;
    /**
     * The unique identifier of the member casting the vote. 
     */
    VoterMemberId: ResourceIdString;
    /**
     *  The value of the vote. 
     */
    Vote: VoteValue;
  }
  export interface VoteOnProposalOutput {
  }
  export interface VoteSummary {
    /**
     *  The vote value, either YES or NO. 
     */
    Vote?: VoteValue;
    /**
     *  The name of the member that cast the vote. 
     */
    MemberName?: NetworkMemberNameString;
    /**
     *  The unique identifier of the member that cast the vote. 
     */
    MemberId?: ResourceIdString;
  }
  export type VoteValue = "YES"|"NO"|string;
  export interface VotingPolicy {
    /**
     * Defines the rules for the network for voting on proposals, such as the percentage of YES votes required for the proposal to be approved and the duration of the proposal. The policy applies to all proposals and is specified when the network is created.
     */
    ApprovalThresholdPolicy?: ApprovalThresholdPolicy;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-09-24"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ManagedBlockchain client.
   */
  export import Types = ManagedBlockchain;
}
export = ManagedBlockchain;
