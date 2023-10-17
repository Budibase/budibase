import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Tnb extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Tnb.Types.ClientConfiguration)
  config: Config & Tnb.Types.ClientConfiguration;
  /**
   * Cancels a network operation. A network operation is any operation that is done to your network, such as network instance instantiation or termination.
   */
  cancelSolNetworkOperation(params: Tnb.Types.CancelSolNetworkOperationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels a network operation. A network operation is any operation that is done to your network, such as network instance instantiation or termination.
   */
  cancelSolNetworkOperation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network. For more information, see Function packages in the Amazon Web Services Telco Network Builder User Guide.  Creating a function package is the first step for creating a network in AWS TNB. This request creates an empty container with an ID. The next step is to upload the actual CSAR zip file into that empty container. To upload function package content, see PutSolFunctionPackageContent.
   */
  createSolFunctionPackage(params: Tnb.Types.CreateSolFunctionPackageInput, callback?: (err: AWSError, data: Tnb.Types.CreateSolFunctionPackageOutput) => void): Request<Tnb.Types.CreateSolFunctionPackageOutput, AWSError>;
  /**
   * Creates a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network. For more information, see Function packages in the Amazon Web Services Telco Network Builder User Guide.  Creating a function package is the first step for creating a network in AWS TNB. This request creates an empty container with an ID. The next step is to upload the actual CSAR zip file into that empty container. To upload function package content, see PutSolFunctionPackageContent.
   */
  createSolFunctionPackage(callback?: (err: AWSError, data: Tnb.Types.CreateSolFunctionPackageOutput) => void): Request<Tnb.Types.CreateSolFunctionPackageOutput, AWSError>;
  /**
   * Creates a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. Creating a network instance is the third step after creating a network package. For more information about network instances, Network instances in the Amazon Web Services Telco Network Builder User Guide. Once you create a network instance, you can instantiate it. To instantiate a network, see InstantiateSolNetworkInstance.
   */
  createSolNetworkInstance(params: Tnb.Types.CreateSolNetworkInstanceInput, callback?: (err: AWSError, data: Tnb.Types.CreateSolNetworkInstanceOutput) => void): Request<Tnb.Types.CreateSolNetworkInstanceOutput, AWSError>;
  /**
   * Creates a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. Creating a network instance is the third step after creating a network package. For more information about network instances, Network instances in the Amazon Web Services Telco Network Builder User Guide. Once you create a network instance, you can instantiate it. To instantiate a network, see InstantiateSolNetworkInstance.
   */
  createSolNetworkInstance(callback?: (err: AWSError, data: Tnb.Types.CreateSolNetworkInstanceOutput) => void): Request<Tnb.Types.CreateSolNetworkInstanceOutput, AWSError>;
  /**
   * Creates a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. For more information, see Network instances in the Amazon Web Services Telco Network Builder User Guide.  A network package consists of a network service descriptor (NSD) file (required) and any additional files (optional), such as scripts specific to your needs. For example, if you have multiple function packages in your network package, you can use the NSD to define which network functions should run in certain VPCs, subnets, or EKS clusters. This request creates an empty network package container with an ID. Once you create a network package, you can upload the network package content using PutSolNetworkPackageContent.
   */
  createSolNetworkPackage(params: Tnb.Types.CreateSolNetworkPackageInput, callback?: (err: AWSError, data: Tnb.Types.CreateSolNetworkPackageOutput) => void): Request<Tnb.Types.CreateSolNetworkPackageOutput, AWSError>;
  /**
   * Creates a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. For more information, see Network instances in the Amazon Web Services Telco Network Builder User Guide.  A network package consists of a network service descriptor (NSD) file (required) and any additional files (optional), such as scripts specific to your needs. For example, if you have multiple function packages in your network package, you can use the NSD to define which network functions should run in certain VPCs, subnets, or EKS clusters. This request creates an empty network package container with an ID. Once you create a network package, you can upload the network package content using PutSolNetworkPackageContent.
   */
  createSolNetworkPackage(callback?: (err: AWSError, data: Tnb.Types.CreateSolNetworkPackageOutput) => void): Request<Tnb.Types.CreateSolNetworkPackageOutput, AWSError>;
  /**
   * Deletes a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network. To delete a function package, the package must be in a disabled state. To disable a function package, see UpdateSolFunctionPackage. 
   */
  deleteSolFunctionPackage(params: Tnb.Types.DeleteSolFunctionPackageInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network. To delete a function package, the package must be in a disabled state. To disable a function package, see UpdateSolFunctionPackage. 
   */
  deleteSolFunctionPackage(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. To delete a network instance, the instance must be in a stopped or terminated state. To terminate a network instance, see TerminateSolNetworkInstance.
   */
  deleteSolNetworkInstance(params: Tnb.Types.DeleteSolNetworkInstanceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. To delete a network instance, the instance must be in a stopped or terminated state. To terminate a network instance, see TerminateSolNetworkInstance.
   */
  deleteSolNetworkInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. To delete a network package, the package must be in a disable state. To disable a network package, see UpdateSolNetworkPackage.
   */
  deleteSolNetworkPackage(params: Tnb.Types.DeleteSolNetworkPackageInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. To delete a network package, the package must be in a disable state. To disable a network package, see UpdateSolNetworkPackage.
   */
  deleteSolNetworkPackage(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the details of a network function instance, including the instantation state and metadata from the function package descriptor in the network function package. A network function instance is a function in a function package .
   */
  getSolFunctionInstance(params: Tnb.Types.GetSolFunctionInstanceInput, callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionInstanceOutput) => void): Request<Tnb.Types.GetSolFunctionInstanceOutput, AWSError>;
  /**
   * Gets the details of a network function instance, including the instantation state and metadata from the function package descriptor in the network function package. A network function instance is a function in a function package .
   */
  getSolFunctionInstance(callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionInstanceOutput) => void): Request<Tnb.Types.GetSolFunctionInstanceOutput, AWSError>;
  /**
   * Gets the details of an individual function package, such as the operational state and whether the package is in use. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network..
   */
  getSolFunctionPackage(params: Tnb.Types.GetSolFunctionPackageInput, callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionPackageOutput) => void): Request<Tnb.Types.GetSolFunctionPackageOutput, AWSError>;
  /**
   * Gets the details of an individual function package, such as the operational state and whether the package is in use. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network..
   */
  getSolFunctionPackage(callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionPackageOutput) => void): Request<Tnb.Types.GetSolFunctionPackageOutput, AWSError>;
  /**
   * Gets the contents of a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  getSolFunctionPackageContent(params: Tnb.Types.GetSolFunctionPackageContentInput, callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionPackageContentOutput) => void): Request<Tnb.Types.GetSolFunctionPackageContentOutput, AWSError>;
  /**
   * Gets the contents of a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  getSolFunctionPackageContent(callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionPackageContentOutput) => void): Request<Tnb.Types.GetSolFunctionPackageContentOutput, AWSError>;
  /**
   * Gets a function package descriptor in a function package. A function package descriptor is a .yaml file in a function package that uses the TOSCA standard to describe how the network function in the function package should run on your network. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  getSolFunctionPackageDescriptor(params: Tnb.Types.GetSolFunctionPackageDescriptorInput, callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionPackageDescriptorOutput) => void): Request<Tnb.Types.GetSolFunctionPackageDescriptorOutput, AWSError>;
  /**
   * Gets a function package descriptor in a function package. A function package descriptor is a .yaml file in a function package that uses the TOSCA standard to describe how the network function in the function package should run on your network. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  getSolFunctionPackageDescriptor(callback?: (err: AWSError, data: Tnb.Types.GetSolFunctionPackageDescriptorOutput) => void): Request<Tnb.Types.GetSolFunctionPackageDescriptorOutput, AWSError>;
  /**
   * Gets the details of the network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
   */
  getSolNetworkInstance(params: Tnb.Types.GetSolNetworkInstanceInput, callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkInstanceOutput) => void): Request<Tnb.Types.GetSolNetworkInstanceOutput, AWSError>;
  /**
   * Gets the details of the network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
   */
  getSolNetworkInstance(callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkInstanceOutput) => void): Request<Tnb.Types.GetSolNetworkInstanceOutput, AWSError>;
  /**
   * Gets the details of a network operation, including the tasks involved in the network operation and the status of the tasks. A network operation is any operation that is done to your network, such as network instance instantiation or termination.
   */
  getSolNetworkOperation(params: Tnb.Types.GetSolNetworkOperationInput, callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkOperationOutput) => void): Request<Tnb.Types.GetSolNetworkOperationOutput, AWSError>;
  /**
   * Gets the details of a network operation, including the tasks involved in the network operation and the status of the tasks. A network operation is any operation that is done to your network, such as network instance instantiation or termination.
   */
  getSolNetworkOperation(callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkOperationOutput) => void): Request<Tnb.Types.GetSolNetworkOperationOutput, AWSError>;
  /**
   * Gets the details of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  getSolNetworkPackage(params: Tnb.Types.GetSolNetworkPackageInput, callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkPackageOutput) => void): Request<Tnb.Types.GetSolNetworkPackageOutput, AWSError>;
  /**
   * Gets the details of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  getSolNetworkPackage(callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkPackageOutput) => void): Request<Tnb.Types.GetSolNetworkPackageOutput, AWSError>;
  /**
   * Gets the contents of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  getSolNetworkPackageContent(params: Tnb.Types.GetSolNetworkPackageContentInput, callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkPackageContentOutput) => void): Request<Tnb.Types.GetSolNetworkPackageContentOutput, AWSError>;
  /**
   * Gets the contents of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  getSolNetworkPackageContent(callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkPackageContentOutput) => void): Request<Tnb.Types.GetSolNetworkPackageContentOutput, AWSError>;
  /**
   * Gets the content of the network service descriptor. A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
   */
  getSolNetworkPackageDescriptor(params: Tnb.Types.GetSolNetworkPackageDescriptorInput, callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkPackageDescriptorOutput) => void): Request<Tnb.Types.GetSolNetworkPackageDescriptorOutput, AWSError>;
  /**
   * Gets the content of the network service descriptor. A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
   */
  getSolNetworkPackageDescriptor(callback?: (err: AWSError, data: Tnb.Types.GetSolNetworkPackageDescriptorOutput) => void): Request<Tnb.Types.GetSolNetworkPackageDescriptorOutput, AWSError>;
  /**
   * Instantiates a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. Before you can instantiate a network instance, you have to create a network instance. For more information, see CreateSolNetworkInstance.
   */
  instantiateSolNetworkInstance(params: Tnb.Types.InstantiateSolNetworkInstanceInput, callback?: (err: AWSError, data: Tnb.Types.InstantiateSolNetworkInstanceOutput) => void): Request<Tnb.Types.InstantiateSolNetworkInstanceOutput, AWSError>;
  /**
   * Instantiates a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. Before you can instantiate a network instance, you have to create a network instance. For more information, see CreateSolNetworkInstance.
   */
  instantiateSolNetworkInstance(callback?: (err: AWSError, data: Tnb.Types.InstantiateSolNetworkInstanceOutput) => void): Request<Tnb.Types.InstantiateSolNetworkInstanceOutput, AWSError>;
  /**
   * Lists network function instances. A network function instance is a function in a function package .
   */
  listSolFunctionInstances(params: Tnb.Types.ListSolFunctionInstancesInput, callback?: (err: AWSError, data: Tnb.Types.ListSolFunctionInstancesOutput) => void): Request<Tnb.Types.ListSolFunctionInstancesOutput, AWSError>;
  /**
   * Lists network function instances. A network function instance is a function in a function package .
   */
  listSolFunctionInstances(callback?: (err: AWSError, data: Tnb.Types.ListSolFunctionInstancesOutput) => void): Request<Tnb.Types.ListSolFunctionInstancesOutput, AWSError>;
  /**
   * Lists information about function packages. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  listSolFunctionPackages(params: Tnb.Types.ListSolFunctionPackagesInput, callback?: (err: AWSError, data: Tnb.Types.ListSolFunctionPackagesOutput) => void): Request<Tnb.Types.ListSolFunctionPackagesOutput, AWSError>;
  /**
   * Lists information about function packages. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  listSolFunctionPackages(callback?: (err: AWSError, data: Tnb.Types.ListSolFunctionPackagesOutput) => void): Request<Tnb.Types.ListSolFunctionPackagesOutput, AWSError>;
  /**
   * Lists your network instances. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
   */
  listSolNetworkInstances(params: Tnb.Types.ListSolNetworkInstancesInput, callback?: (err: AWSError, data: Tnb.Types.ListSolNetworkInstancesOutput) => void): Request<Tnb.Types.ListSolNetworkInstancesOutput, AWSError>;
  /**
   * Lists your network instances. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
   */
  listSolNetworkInstances(callback?: (err: AWSError, data: Tnb.Types.ListSolNetworkInstancesOutput) => void): Request<Tnb.Types.ListSolNetworkInstancesOutput, AWSError>;
  /**
   * Lists details for a network operation, including when the operation started and the status of the operation. A network operation is any operation that is done to your network, such as network instance instantiation or termination.
   */
  listSolNetworkOperations(params: Tnb.Types.ListSolNetworkOperationsInput, callback?: (err: AWSError, data: Tnb.Types.ListSolNetworkOperationsOutput) => void): Request<Tnb.Types.ListSolNetworkOperationsOutput, AWSError>;
  /**
   * Lists details for a network operation, including when the operation started and the status of the operation. A network operation is any operation that is done to your network, such as network instance instantiation or termination.
   */
  listSolNetworkOperations(callback?: (err: AWSError, data: Tnb.Types.ListSolNetworkOperationsOutput) => void): Request<Tnb.Types.ListSolNetworkOperationsOutput, AWSError>;
  /**
   * Lists network packages. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  listSolNetworkPackages(params: Tnb.Types.ListSolNetworkPackagesInput, callback?: (err: AWSError, data: Tnb.Types.ListSolNetworkPackagesOutput) => void): Request<Tnb.Types.ListSolNetworkPackagesOutput, AWSError>;
  /**
   * Lists network packages. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  listSolNetworkPackages(callback?: (err: AWSError, data: Tnb.Types.ListSolNetworkPackagesOutput) => void): Request<Tnb.Types.ListSolNetworkPackagesOutput, AWSError>;
  /**
   * Lists tags for AWS TNB resources.
   */
  listTagsForResource(params: Tnb.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: Tnb.Types.ListTagsForResourceOutput) => void): Request<Tnb.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists tags for AWS TNB resources.
   */
  listTagsForResource(callback?: (err: AWSError, data: Tnb.Types.ListTagsForResourceOutput) => void): Request<Tnb.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Uploads the contents of a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  putSolFunctionPackageContent(params: Tnb.Types.PutSolFunctionPackageContentInput, callback?: (err: AWSError, data: Tnb.Types.PutSolFunctionPackageContentOutput) => void): Request<Tnb.Types.PutSolFunctionPackageContentOutput, AWSError>;
  /**
   * Uploads the contents of a function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  putSolFunctionPackageContent(callback?: (err: AWSError, data: Tnb.Types.PutSolFunctionPackageContentOutput) => void): Request<Tnb.Types.PutSolFunctionPackageContentOutput, AWSError>;
  /**
   * Uploads the contents of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  putSolNetworkPackageContent(params: Tnb.Types.PutSolNetworkPackageContentInput, callback?: (err: AWSError, data: Tnb.Types.PutSolNetworkPackageContentOutput) => void): Request<Tnb.Types.PutSolNetworkPackageContentOutput, AWSError>;
  /**
   * Uploads the contents of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  putSolNetworkPackageContent(callback?: (err: AWSError, data: Tnb.Types.PutSolNetworkPackageContentOutput) => void): Request<Tnb.Types.PutSolNetworkPackageContentOutput, AWSError>;
  /**
   * Tags an AWS TNB resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
   */
  tagResource(params: Tnb.Types.TagResourceInput, callback?: (err: AWSError, data: Tnb.Types.TagResourceOutput) => void): Request<Tnb.Types.TagResourceOutput, AWSError>;
  /**
   * Tags an AWS TNB resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
   */
  tagResource(callback?: (err: AWSError, data: Tnb.Types.TagResourceOutput) => void): Request<Tnb.Types.TagResourceOutput, AWSError>;
  /**
   * Terminates a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. You must terminate a network instance before you can delete it.
   */
  terminateSolNetworkInstance(params: Tnb.Types.TerminateSolNetworkInstanceInput, callback?: (err: AWSError, data: Tnb.Types.TerminateSolNetworkInstanceOutput) => void): Request<Tnb.Types.TerminateSolNetworkInstanceOutput, AWSError>;
  /**
   * Terminates a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed. You must terminate a network instance before you can delete it.
   */
  terminateSolNetworkInstance(callback?: (err: AWSError, data: Tnb.Types.TerminateSolNetworkInstanceOutput) => void): Request<Tnb.Types.TerminateSolNetworkInstanceOutput, AWSError>;
  /**
   * Untags an AWS TNB resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
   */
  untagResource(params: Tnb.Types.UntagResourceInput, callback?: (err: AWSError, data: Tnb.Types.UntagResourceOutput) => void): Request<Tnb.Types.UntagResourceOutput, AWSError>;
  /**
   * Untags an AWS TNB resource. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
   */
  untagResource(callback?: (err: AWSError, data: Tnb.Types.UntagResourceOutput) => void): Request<Tnb.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates the operational state of function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  updateSolFunctionPackage(params: Tnb.Types.UpdateSolFunctionPackageInput, callback?: (err: AWSError, data: Tnb.Types.UpdateSolFunctionPackageOutput) => void): Request<Tnb.Types.UpdateSolFunctionPackageOutput, AWSError>;
  /**
   * Updates the operational state of function package. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  updateSolFunctionPackage(callback?: (err: AWSError, data: Tnb.Types.UpdateSolFunctionPackageOutput) => void): Request<Tnb.Types.UpdateSolFunctionPackageOutput, AWSError>;
  /**
   * Update a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
   */
  updateSolNetworkInstance(params: Tnb.Types.UpdateSolNetworkInstanceInput, callback?: (err: AWSError, data: Tnb.Types.UpdateSolNetworkInstanceOutput) => void): Request<Tnb.Types.UpdateSolNetworkInstanceOutput, AWSError>;
  /**
   * Update a network instance. A network instance is a single network created in Amazon Web Services TNB that can be deployed and on which life-cycle operations (like terminate, update, and delete) can be performed.
   */
  updateSolNetworkInstance(callback?: (err: AWSError, data: Tnb.Types.UpdateSolNetworkInstanceOutput) => void): Request<Tnb.Types.UpdateSolNetworkInstanceOutput, AWSError>;
  /**
   * Updates the operational state of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
   */
  updateSolNetworkPackage(params: Tnb.Types.UpdateSolNetworkPackageInput, callback?: (err: AWSError, data: Tnb.Types.UpdateSolNetworkPackageOutput) => void): Request<Tnb.Types.UpdateSolNetworkPackageOutput, AWSError>;
  /**
   * Updates the operational state of a network package. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on. A network service descriptor is a .yaml file in a network package that uses the TOSCA standard to describe the network functions you want to deploy and the Amazon Web Services infrastructure you want to deploy the network functions on.
   */
  updateSolNetworkPackage(callback?: (err: AWSError, data: Tnb.Types.UpdateSolNetworkPackageOutput) => void): Request<Tnb.Types.UpdateSolNetworkPackageOutput, AWSError>;
  /**
   * Validates function package content. This can be used as a dry run before uploading function package content with PutSolFunctionPackageContent. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  validateSolFunctionPackageContent(params: Tnb.Types.ValidateSolFunctionPackageContentInput, callback?: (err: AWSError, data: Tnb.Types.ValidateSolFunctionPackageContentOutput) => void): Request<Tnb.Types.ValidateSolFunctionPackageContentOutput, AWSError>;
  /**
   * Validates function package content. This can be used as a dry run before uploading function package content with PutSolFunctionPackageContent. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
   */
  validateSolFunctionPackageContent(callback?: (err: AWSError, data: Tnb.Types.ValidateSolFunctionPackageContentOutput) => void): Request<Tnb.Types.ValidateSolFunctionPackageContentOutput, AWSError>;
  /**
   * Validates network package content. This can be used as a dry run before uploading network package content with PutSolNetworkPackageContent. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  validateSolNetworkPackageContent(params: Tnb.Types.ValidateSolNetworkPackageContentInput, callback?: (err: AWSError, data: Tnb.Types.ValidateSolNetworkPackageContentOutput) => void): Request<Tnb.Types.ValidateSolNetworkPackageContentOutput, AWSError>;
  /**
   * Validates network package content. This can be used as a dry run before uploading network package content with PutSolNetworkPackageContent. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
   */
  validateSolNetworkPackageContent(callback?: (err: AWSError, data: Tnb.Types.ValidateSolNetworkPackageContentOutput) => void): Request<Tnb.Types.ValidateSolNetworkPackageContentOutput, AWSError>;
}
declare namespace Tnb {
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export interface CancelSolNetworkOperationInput {
    /**
     * The identifier of the network operation.
     */
    nsLcmOpOccId: NsLcmOpOccId;
  }
  export interface CreateSolFunctionPackageInput {
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface CreateSolFunctionPackageOutput {
    /**
     * Function package ARN.
     */
    arn: VnfPkgArn;
    /**
     * ID of the function package.
     */
    id: VnfPkgId;
    /**
     * Onboarding state of the function package.
     */
    onboardingState: OnboardingState;
    /**
     * Operational state of the function package.
     */
    operationalState: OperationalState;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
    /**
     * Usage state of the function package.
     */
    usageState: UsageState;
  }
  export interface CreateSolNetworkInstanceInput {
    /**
     * Network instance description.
     */
    nsDescription?: CreateSolNetworkInstanceInputNsDescriptionString;
    /**
     * Network instance name.
     */
    nsName: CreateSolNetworkInstanceInputNsNameString;
    /**
     * ID for network service descriptor.
     */
    nsdInfoId: NsdInfoId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export type CreateSolNetworkInstanceInputNsDescriptionString = string;
  export type CreateSolNetworkInstanceInputNsNameString = string;
  export interface CreateSolNetworkInstanceOutput {
    /**
     * Network instance ARN.
     */
    arn: NsInstanceArn;
    /**
     * Network instance ID.
     */
    id: NsInstanceId;
    /**
     * Network instance name.
     */
    nsInstanceName: String;
    /**
     * Network service descriptor ID.
     */
    nsdInfoId: NsdInfoId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface CreateSolNetworkPackageInput {
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface CreateSolNetworkPackageOutput {
    /**
     * Network package ARN.
     */
    arn: NsdInfoArn;
    /**
     * ID of the network package.
     */
    id: NsdInfoId;
    /**
     * Onboarding state of the network service descriptor in the network package.
     */
    nsdOnboardingState: NsdOnboardingState;
    /**
     * Operational state of the network service descriptor in the network package.
     */
    nsdOperationalState: NsdOperationalState;
    /**
     * Usage state of the network service descriptor in the network package.
     */
    nsdUsageState: NsdUsageState;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface DeleteSolFunctionPackageInput {
    /**
     * ID of the function package.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface DeleteSolNetworkInstanceInput {
    /**
     * Network instance ID.
     */
    nsInstanceId: NsInstanceId;
  }
  export interface DeleteSolNetworkPackageInput {
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdInfoId: NsdInfoId;
  }
  export type DescriptorContentType = "text/plain"|string;
  export interface Document {
  }
  export type ErrorCause = string;
  export type ErrorDetails = string;
  export interface ErrorInfo {
    /**
     * Error cause.
     */
    cause?: ErrorCause;
    /**
     * Error details.
     */
    details?: ErrorDetails;
  }
  export interface FunctionArtifactMeta {
    /**
     * Lists of function package overrides.
     */
    overrides?: OverrideList;
  }
  export interface GetSolFunctionInstanceInput {
    /**
     * ID of the network function.
     */
    vnfInstanceId: VnfInstanceId;
  }
  export interface GetSolFunctionInstanceMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export interface GetSolFunctionInstanceOutput {
    /**
     * Network function instance ARN.
     */
    arn: VnfInstanceArn;
    /**
     * Network function instance ID.
     */
    id: VnfInstanceId;
    instantiatedVnfInfo?: GetSolVnfInfo;
    /**
     * Network function instantiation state.
     */
    instantiationState: VnfInstantiationState;
    metadata: GetSolFunctionInstanceMetadata;
    /**
     * Network instance ID.
     */
    nsInstanceId: NsInstanceId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
    /**
     * Function package ID.
     */
    vnfPkgId: VnfPkgId;
    /**
     * Network function product name.
     */
    vnfProductName?: String;
    /**
     * Network function provider.
     */
    vnfProvider?: String;
    /**
     * Function package descriptor ID.
     */
    vnfdId: VnfdId;
    /**
     * Function package descriptor version.
     */
    vnfdVersion?: String;
  }
  export interface GetSolFunctionPackageContentInput {
    /**
     * The format of the package that you want to download from the function packages.
     */
    accept: PackageContentType;
    /**
     * ID of the function package.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface GetSolFunctionPackageContentOutput {
    /**
     * Indicates the media type of the resource.
     */
    contentType?: PackageContentType;
    /**
     * Contents of the function package.
     */
    packageContent?: _Blob;
  }
  export interface GetSolFunctionPackageDescriptorInput {
    /**
     * Indicates which content types, expressed as MIME types, the client is able to understand.
     */
    accept: DescriptorContentType;
    /**
     * ID of the function package.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface GetSolFunctionPackageDescriptorOutput {
    /**
     * Indicates the media type of the resource.
     */
    contentType?: DescriptorContentType;
    /**
     * Contents of the function package descriptor.
     */
    vnfd?: _Blob;
  }
  export interface GetSolFunctionPackageInput {
    /**
     * ID of the function package.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface GetSolFunctionPackageMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
    /**
     * Metadata related to the function package descriptor of the function package.
     */
    vnfd?: FunctionArtifactMeta;
  }
  export interface GetSolFunctionPackageOutput {
    /**
     * Function package ARN.
     */
    arn: VnfPkgArn;
    /**
     * Function package ID.
     */
    id: VnfPkgId;
    metadata?: GetSolFunctionPackageMetadata;
    /**
     * Function package onboarding state.
     */
    onboardingState: OnboardingState;
    /**
     * Function package operational state.
     */
    operationalState: OperationalState;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
    /**
     * Function package usage state.
     */
    usageState: UsageState;
    /**
     * Network function product name.
     */
    vnfProductName?: String;
    /**
     * Network function provider.
     */
    vnfProvider?: String;
    /**
     * Function package descriptor ID.
     */
    vnfdId?: String;
    /**
     * Function package descriptor version.
     */
    vnfdVersion?: String;
  }
  export interface GetSolInstantiatedVnfInfo {
    /**
     * State of the network function.
     */
    vnfState?: VnfOperationalState;
  }
  export interface GetSolNetworkInstanceInput {
    /**
     * ID of the network instance.
     */
    nsInstanceId: NsInstanceId;
  }
  export interface GetSolNetworkInstanceMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export interface GetSolNetworkInstanceOutput {
    /**
     * Network instance ARN.
     */
    arn: NsInstanceArn;
    /**
     * Network instance ID.
     */
    id: NsInstanceId;
    lcmOpInfo?: LcmOperationInfo;
    metadata: GetSolNetworkInstanceMetadata;
    /**
     * Network instance description.
     */
    nsInstanceDescription: String;
    /**
     * Network instance name.
     */
    nsInstanceName: String;
    /**
     * Network instance state.
     */
    nsState?: NsState;
    /**
     * Network service descriptor ID.
     */
    nsdId: NsdId;
    /**
     * Network service descriptor info ID.
     */
    nsdInfoId: NsdInfoId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface GetSolNetworkOperationInput {
    /**
     * The identifier of the network operation.
     */
    nsLcmOpOccId: NsLcmOpOccId;
  }
  export interface GetSolNetworkOperationMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export interface GetSolNetworkOperationOutput {
    /**
     * Network operation ARN.
     */
    arn: NsLcmOpOccArn;
    /**
     * Error related to this specific network operation occurrence.
     */
    error?: ProblemDetails;
    /**
     * ID of this network operation occurrence.
     */
    id?: NsLcmOpOccId;
    /**
     * Type of the operation represented by this occurrence.
     */
    lcmOperationType?: LcmOperationType;
    /**
     * Metadata of this network operation occurrence.
     */
    metadata?: GetSolNetworkOperationMetadata;
    /**
     * ID of the network operation instance.
     */
    nsInstanceId?: NsInstanceId;
    /**
     * The state of the network operation.
     */
    operationState?: NsLcmOperationState;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
    /**
     * All tasks associated with this operation occurrence.
     */
    tasks?: GetSolNetworkOperationTasksList;
  }
  export interface GetSolNetworkOperationTaskDetails {
    /**
     * Context for the network operation task.
     */
    taskContext?: StringMap;
    /**
     * Task end time.
     */
    taskEndTime?: SyntheticTimestamp_date_time;
    /**
     * Task error details.
     */
    taskErrorDetails?: ErrorInfo;
    /**
     * Task name.
     */
    taskName?: String;
    /**
     * Task start time.
     */
    taskStartTime?: SyntheticTimestamp_date_time;
    /**
     * Task status.
     */
    taskStatus?: TaskStatus;
  }
  export type GetSolNetworkOperationTasksList = GetSolNetworkOperationTaskDetails[];
  export interface GetSolNetworkPackageContentInput {
    /**
     * The format of the package you want to download from the network package.
     */
    accept: PackageContentType;
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdInfoId: NsdInfoId;
  }
  export interface GetSolNetworkPackageContentOutput {
    /**
     * Indicates the media type of the resource.
     */
    contentType?: PackageContentType;
    /**
     * Content of the network service descriptor in the network package.
     */
    nsdContent?: _Blob;
  }
  export interface GetSolNetworkPackageDescriptorInput {
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdInfoId: NsdInfoId;
  }
  export interface GetSolNetworkPackageDescriptorOutput {
    /**
     * Indicates the media type of the resource.
     */
    contentType?: DescriptorContentType;
    /**
     * Contents of the network service descriptor in the network package.
     */
    nsd?: _Blob;
  }
  export interface GetSolNetworkPackageInput {
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdInfoId: NsdInfoId;
  }
  export interface GetSolNetworkPackageMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
    /**
     * Metadata related to the onboarded network service descriptor in the network package.
     */
    nsd?: NetworkArtifactMeta;
  }
  export interface GetSolNetworkPackageOutput {
    /**
     * Network package ARN.
     */
    arn: NsdInfoArn;
    /**
     * Network package ID.
     */
    id: NsdInfoId;
    metadata: GetSolNetworkPackageMetadata;
    /**
     * Network service descriptor ID.
     */
    nsdId: NsdId;
    /**
     * Network service descriptor name.
     */
    nsdName: String;
    /**
     * Network service descriptor onboarding state.
     */
    nsdOnboardingState: NsdOnboardingState;
    /**
     * Network service descriptor operational state.
     */
    nsdOperationalState: NsdOperationalState;
    /**
     * Network service descriptor usage state.
     */
    nsdUsageState: NsdUsageState;
    /**
     * Network service descriptor version.
     */
    nsdVersion: String;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
    /**
     * Identifies the function package for the function package descriptor referenced by the onboarded network package.
     */
    vnfPkgIds: VnfPkgIdList;
  }
  export interface GetSolVnfInfo {
    /**
     * State of the network function instance.
     */
    vnfState?: VnfOperationalState;
    /**
     * Compute info used by the network function instance.
     */
    vnfcResourceInfo?: GetSolVnfcResourceInfoList;
  }
  export interface GetSolVnfcResourceInfo {
    /**
     * The metadata of the network function compute.
     */
    metadata?: GetSolVnfcResourceInfoMetadata;
  }
  export type GetSolVnfcResourceInfoList = GetSolVnfcResourceInfo[];
  export interface GetSolVnfcResourceInfoMetadata {
    /**
     * Information about the cluster.
     */
    cluster?: String;
    /**
     * Information about the helm chart.
     */
    helmChart?: String;
    /**
     * Information about the node group.
     */
    nodeGroup?: String;
  }
  export interface InstantiateSolNetworkInstanceInput {
    /**
     * Provides values for the configurable properties.
     */
    additionalParamsForNs?: Document;
    /**
     * A check for whether you have the required permissions for the action without actually making the request and provides an error response. If you have the required permissions, the error response is DryRunOperation. Otherwise, it is UnauthorizedOperation.
     */
    dryRun?: Boolean;
    /**
     * ID of the network instance.
     */
    nsInstanceId: NsInstanceId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. When you use this API, the tags are transferred to the network operation that is created. Use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface InstantiateSolNetworkInstanceOutput {
    /**
     * The identifier of the network operation.
     */
    nsLcmOpOccId: NsLcmOpOccId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. When you use this API, the tags are transferred to the network operation that is created. Use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface LcmOperationInfo {
    /**
     * The identifier of the network operation.
     */
    nsLcmOpOccId: NsLcmOpOccId;
  }
  export type LcmOperationType = "INSTANTIATE"|"UPDATE"|"TERMINATE"|string;
  export interface ListSolFunctionInstanceInfo {
    /**
     * Network function instance ARN.
     */
    arn: VnfInstanceArn;
    /**
     * Network function instance ID.
     */
    id: VnfInstanceId;
    instantiatedVnfInfo?: GetSolInstantiatedVnfInfo;
    /**
     * Network function instance instantiation state.
     */
    instantiationState: VnfInstantiationState;
    /**
     * Network function instance metadata.
     */
    metadata: ListSolFunctionInstanceMetadata;
    /**
     * Network instance ID.
     */
    nsInstanceId: NsInstanceId;
    /**
     * Function package ID.
     */
    vnfPkgId: VnfPkgId;
    /**
     * Function package name.
     */
    vnfPkgName?: String;
  }
  export interface ListSolFunctionInstanceMetadata {
    /**
     * When the network function instance was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * When the network function instance was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export type ListSolFunctionInstanceResources = ListSolFunctionInstanceInfo[];
  export interface ListSolFunctionInstancesInput {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListSolFunctionInstancesInputMaxResultsInteger;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export type ListSolFunctionInstancesInputMaxResultsInteger = number;
  export interface ListSolFunctionInstancesOutput {
    /**
     * Network function instances.
     */
    functionInstances?: ListSolFunctionInstanceResources;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSolFunctionPackageInfo {
    /**
     * Function package ARN.
     */
    arn: VnfPkgArn;
    /**
     * ID of the function package.
     */
    id: VnfPkgId;
    /**
     * The metadata of the function package.
     */
    metadata?: ListSolFunctionPackageMetadata;
    /**
     * Onboarding state of the function package.
     */
    onboardingState: OnboardingState;
    /**
     * Operational state of the function package.
     */
    operationalState: OperationalState;
    /**
     * Usage state of the function package.
     */
    usageState: UsageState;
    /**
     * The product name for the network function.
     */
    vnfProductName?: String;
    /**
     * Provider of the function package and the function package descriptor.
     */
    vnfProvider?: String;
    /**
     * Identifies the function package and the function package descriptor.
     */
    vnfdId?: String;
    /**
     * Identifies the version of the function package descriptor.
     */
    vnfdVersion?: String;
  }
  export interface ListSolFunctionPackageMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export type ListSolFunctionPackageResources = ListSolFunctionPackageInfo[];
  export interface ListSolFunctionPackagesInput {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListSolFunctionPackagesInputMaxResultsInteger;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export type ListSolFunctionPackagesInputMaxResultsInteger = number;
  export interface ListSolFunctionPackagesOutput {
    /**
     * Function packages. A function package is a .zip file in CSAR (Cloud Service Archive) format that contains a network function (an ETSI standard telecommunication application) and function package descriptor that uses the TOSCA standard to describe how the network functions should run on your network.
     */
    functionPackages: ListSolFunctionPackageResources;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSolNetworkInstanceInfo {
    /**
     * Network instance ARN.
     */
    arn: NsInstanceArn;
    /**
     * ID of the network instance.
     */
    id: NsInstanceId;
    /**
     * The metadata of the network instance.
     */
    metadata: ListSolNetworkInstanceMetadata;
    /**
     * Human-readable description of the network instance.
     */
    nsInstanceDescription: String;
    /**
     * Human-readable name of the network instance.
     */
    nsInstanceName: String;
    /**
     * The state of the network instance.
     */
    nsState: NsState;
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdId: NsdId;
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdInfoId: NsdInfoId;
  }
  export interface ListSolNetworkInstanceMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export type ListSolNetworkInstanceResources = ListSolNetworkInstanceInfo[];
  export interface ListSolNetworkInstancesInput {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListSolNetworkInstancesInputMaxResultsInteger;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export type ListSolNetworkInstancesInputMaxResultsInteger = number;
  export interface ListSolNetworkInstancesOutput {
    /**
     * Lists network instances.
     */
    networkInstances?: ListSolNetworkInstanceResources;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface ListSolNetworkOperationsInfo {
    /**
     * Network operation ARN.
     */
    arn: NsLcmOpOccArn;
    /**
     * Error related to this specific network operation.
     */
    error?: ProblemDetails;
    /**
     * ID of this network operation.
     */
    id: NsLcmOpOccId;
    /**
     * Type of lifecycle management network operation.
     */
    lcmOperationType: LcmOperationType;
    /**
     * Metadata related to this network operation.
     */
    metadata?: ListSolNetworkOperationsMetadata;
    /**
     * ID of the network instance related to this operation.
     */
    nsInstanceId: NsInstanceId;
    /**
     * The state of the network operation.
     */
    operationState: NsLcmOperationState;
  }
  export interface ListSolNetworkOperationsInput {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListSolNetworkOperationsInputMaxResultsInteger;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export type ListSolNetworkOperationsInputMaxResultsInteger = number;
  export interface ListSolNetworkOperationsMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export interface ListSolNetworkOperationsOutput {
    /**
     * Lists network operation occurrences. Lifecycle management operations are deploy, update, or delete operations.
     */
    networkOperations?: ListSolNetworkOperationsResources;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export type ListSolNetworkOperationsResources = ListSolNetworkOperationsInfo[];
  export interface ListSolNetworkPackageInfo {
    /**
     * Network package ARN.
     */
    arn: NsdInfoArn;
    /**
     * ID of the individual network package.
     */
    id: NsdInfoId;
    /**
     * The metadata of the network package.
     */
    metadata: ListSolNetworkPackageMetadata;
    /**
     * Designer of the onboarded network service descriptor in the network package.
     */
    nsdDesigner?: String;
    /**
     * ID of the network service descriptor on which the network package is based.
     */
    nsdId?: String;
    /**
     * Identifies a network service descriptor in a version independent manner.
     */
    nsdInvariantId?: String;
    /**
     * Name of the onboarded network service descriptor in the network package.
     */
    nsdName?: String;
    /**
     * Onboarding state of the network service descriptor in the network package.
     */
    nsdOnboardingState: NsdOnboardingState;
    /**
     * Operational state of the network service descriptor in the network package.
     */
    nsdOperationalState: NsdOperationalState;
    /**
     * Usage state of the network service descriptor in the network package.
     */
    nsdUsageState: NsdUsageState;
    /**
     * Version of the onboarded network service descriptor in the network package.
     */
    nsdVersion?: String;
    /**
     * Identifies the function package for the function package descriptor referenced by the onboarded network package.
     */
    vnfPkgIds?: VnfPkgIdList;
  }
  export interface ListSolNetworkPackageMetadata {
    /**
     * The date that the resource was created.
     */
    createdAt: SyntheticTimestamp_date_time;
    /**
     * The date that the resource was last modified.
     */
    lastModified: SyntheticTimestamp_date_time;
  }
  export type ListSolNetworkPackageResources = ListSolNetworkPackageInfo[];
  export interface ListSolNetworkPackagesInput {
    /**
     * The maximum number of results to include in the response.
     */
    maxResults?: ListSolNetworkPackagesInputMaxResultsInteger;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export type ListSolNetworkPackagesInputMaxResultsInteger = number;
  export interface ListSolNetworkPackagesOutput {
    /**
     * Network packages. A network package is a .zip file in CSAR (Cloud Service Archive) format defines the function packages you want to deploy and the Amazon Web Services infrastructure you want to deploy them on.
     */
    networkPackages: ListSolNetworkPackageResources;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * Resource ARN.
     */
    resourceArn: TNBResourceArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags: TagMap;
  }
  export interface NetworkArtifactMeta {
    /**
     * Lists network package overrides.
     */
    overrides?: OverrideList;
  }
  export type NsInstanceArn = string;
  export type NsInstanceId = string;
  export type NsLcmOpOccArn = string;
  export type NsLcmOpOccId = string;
  export type NsLcmOperationState = "PROCESSING"|"COMPLETED"|"FAILED"|"CANCELLING"|"CANCELLED"|string;
  export type NsState = "INSTANTIATED"|"NOT_INSTANTIATED"|"IMPAIRED"|"STOPPED"|"DELETED"|"INSTANTIATE_IN_PROGRESS"|"UPDATE_IN_PROGRESS"|"TERMINATE_IN_PROGRESS"|string;
  export type NsdId = string;
  export type NsdInfoArn = string;
  export type NsdInfoId = string;
  export type NsdOnboardingState = "CREATED"|"ONBOARDED"|"ERROR"|string;
  export type NsdOperationalState = "ENABLED"|"DISABLED"|string;
  export type NsdUsageState = "IN_USE"|"NOT_IN_USE"|string;
  export type OnboardingState = "CREATED"|"ONBOARDED"|"ERROR"|string;
  export type OperationalState = "ENABLED"|"DISABLED"|string;
  export type OverrideList = ToscaOverride[];
  export type PackageContentType = "application/zip"|string;
  export type PaginationToken = string;
  export interface ProblemDetails {
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     */
    detail: String;
    /**
     * A human-readable title of the problem type.
     */
    title?: String;
  }
  export interface PutSolFunctionPackageContentInput {
    /**
     * Function package content type.
     */
    contentType?: PackageContentType;
    /**
     * Function package file.
     */
    file: _Blob;
    /**
     * Function package ID.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface PutSolFunctionPackageContentMetadata {
    vnfd?: FunctionArtifactMeta;
  }
  export interface PutSolFunctionPackageContentOutput {
    /**
     * Function package ID.
     */
    id: VnfPkgId;
    /**
     * Function package metadata.
     */
    metadata: PutSolFunctionPackageContentMetadata;
    /**
     * Function product name.
     */
    vnfProductName: String;
    /**
     * Function provider.
     */
    vnfProvider: String;
    /**
     * Function package descriptor ID.
     */
    vnfdId: VnfdId;
    /**
     * Function package descriptor version.
     */
    vnfdVersion: String;
  }
  export interface PutSolNetworkPackageContentInput {
    /**
     * Network package content type.
     */
    contentType?: PackageContentType;
    /**
     * Network package file.
     */
    file: _Blob;
    /**
     * Network service descriptor info ID.
     */
    nsdInfoId: NsdInfoId;
  }
  export interface PutSolNetworkPackageContentMetadata {
    nsd?: NetworkArtifactMeta;
  }
  export interface PutSolNetworkPackageContentOutput {
    /**
     * Network package ARN.
     */
    arn: NsdInfoArn;
    /**
     * Network package ID.
     */
    id: NsdInfoId;
    /**
     * Network package metadata.
     */
    metadata: PutSolNetworkPackageContentMetadata;
    /**
     * Network service descriptor ID.
     */
    nsdId: NsdId;
    /**
     * Network service descriptor name.
     */
    nsdName: String;
    /**
     * Network service descriptor version.
     */
    nsdVersion: String;
    /**
     * Function package IDs.
     */
    vnfPkgIds: VnfPkgIdList;
  }
  export type String = string;
  export type StringMap = {[key: string]: String};
  export type SyntheticTimestamp_date_time = Date;
  export type TNBResourceArn = string;
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceInput {
    /**
     * Resource ARN.
     */
    resourceArn: TNBResourceArn;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags: TagMap;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TaskStatus = "SCHEDULED"|"STARTED"|"IN_PROGRESS"|"COMPLETED"|"ERROR"|"SKIPPED"|"CANCELLED"|string;
  export interface TerminateSolNetworkInstanceInput {
    /**
     * ID of the network instance.
     */
    nsInstanceId: NsInstanceId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. When you use this API, the tags are transferred to the network operation that is created. Use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface TerminateSolNetworkInstanceOutput {
    /**
     * The identifier of the network operation.
     */
    nsLcmOpOccId?: NsLcmOpOccId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. When you use this API, the tags are transferred to the network operation that is created. Use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface ToscaOverride {
    /**
     * Default value for the override.
     */
    defaultValue?: String;
    /**
     * Name of the TOSCA override.
     */
    name?: String;
  }
  export interface UntagResourceInput {
    /**
     * Resource ARN.
     */
    resourceArn: TNBResourceArn;
    /**
     * Tag keys.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateSolFunctionPackageInput {
    /**
     * Operational state of the function package.
     */
    operationalState: OperationalState;
    /**
     * ID of the function package.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface UpdateSolFunctionPackageOutput {
    /**
     * Operational state of the function package.
     */
    operationalState: OperationalState;
  }
  export interface UpdateSolNetworkInstanceInput {
    /**
     * Identifies the network function information parameters and/or the configurable properties of the network function to be modified.
     */
    modifyVnfInfoData?: UpdateSolNetworkModify;
    /**
     * ID of the network instance.
     */
    nsInstanceId: NsInstanceId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. When you use this API, the tags are transferred to the network operation that is created. Use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
    /**
     * The type of update.
     */
    updateType: UpdateSolNetworkType;
  }
  export interface UpdateSolNetworkInstanceOutput {
    /**
     * The identifier of the network operation.
     */
    nsLcmOpOccId?: NsLcmOpOccId;
    /**
     * A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value. When you use this API, the tags are transferred to the network operation that is created. Use tags to search and filter your resources or track your Amazon Web Services costs.
     */
    tags?: TagMap;
  }
  export interface UpdateSolNetworkModify {
    /**
     * Provides values for the configurable properties declared in the function package descriptor.
     */
    vnfConfigurableProperties: Document;
    /**
     * ID of the network function instance. A network function instance is a function in a function package .
     */
    vnfInstanceId: VnfInstanceId;
  }
  export interface UpdateSolNetworkPackageInput {
    /**
     * ID of the network service descriptor in the network package.
     */
    nsdInfoId: NsdInfoId;
    /**
     * Operational state of the network service descriptor in the network package.
     */
    nsdOperationalState: NsdOperationalState;
  }
  export interface UpdateSolNetworkPackageOutput {
    /**
     * Operational state of the network service descriptor in the network package.
     */
    nsdOperationalState: NsdOperationalState;
  }
  export type UpdateSolNetworkType = "MODIFY_VNF_INFORMATION"|string;
  export type UsageState = "IN_USE"|"NOT_IN_USE"|string;
  export interface ValidateSolFunctionPackageContentInput {
    /**
     * Function package content type.
     */
    contentType?: PackageContentType;
    /**
     * Function package file.
     */
    file: _Blob;
    /**
     * Function package ID.
     */
    vnfPkgId: VnfPkgId;
  }
  export interface ValidateSolFunctionPackageContentMetadata {
    vnfd?: FunctionArtifactMeta;
  }
  export interface ValidateSolFunctionPackageContentOutput {
    /**
     * Function package ID.
     */
    id: VnfPkgId;
    /**
     * Function package metadata.
     */
    metadata: ValidateSolFunctionPackageContentMetadata;
    /**
     * Network function product name.
     */
    vnfProductName: String;
    /**
     * Network function provider.
     */
    vnfProvider: String;
    /**
     * Function package descriptor ID.
     */
    vnfdId: VnfdId;
    /**
     * Function package descriptor version.
     */
    vnfdVersion: String;
  }
  export interface ValidateSolNetworkPackageContentInput {
    /**
     * Network package content type.
     */
    contentType?: PackageContentType;
    /**
     * Network package file.
     */
    file: _Blob;
    /**
     * Network service descriptor file.
     */
    nsdInfoId: NsdInfoId;
  }
  export interface ValidateSolNetworkPackageContentMetadata {
    nsd?: NetworkArtifactMeta;
  }
  export interface ValidateSolNetworkPackageContentOutput {
    /**
     * Network package ARN.
     */
    arn: NsdInfoArn;
    /**
     * Network package ID.
     */
    id: NsdInfoId;
    /**
     * Network package metadata.
     */
    metadata: ValidateSolNetworkPackageContentMetadata;
    /**
     * Network service descriptor ID.
     */
    nsdId: NsdId;
    /**
     * Network service descriptor name.
     */
    nsdName: String;
    /**
     * Network service descriptor version.
     */
    nsdVersion: String;
    /**
     * Function package IDs.
     */
    vnfPkgIds: VnfPkgIdList;
  }
  export type VnfInstanceArn = string;
  export type VnfInstanceId = string;
  export type VnfInstantiationState = "INSTANTIATED"|"NOT_INSTANTIATED"|string;
  export type VnfOperationalState = "STARTED"|"STOPPED"|string;
  export type VnfPkgArn = string;
  export type VnfPkgId = string;
  export type VnfPkgIdList = VnfPkgId[];
  export type VnfdId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2008-10-21"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Tnb client.
   */
  export import Types = Tnb;
}
export = Tnb;
