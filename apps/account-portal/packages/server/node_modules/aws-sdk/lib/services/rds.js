var AWS = require('../core');
var rdsutil = require('./rdsutil');
require('../rds/signer');
 /**
  * @api private
  */
 var crossRegionOperations = ['copyDBSnapshot', 'createDBInstanceReadReplica', 'createDBCluster', 'copyDBClusterSnapshot', 'startDBInstanceAutomatedBackupsReplication'];

 AWS.util.update(AWS.RDS.prototype, {
   /**
    * @api private
    */
   setupRequestListeners: function setupRequestListeners(request) {
    rdsutil.setupRequestListeners(this, request, crossRegionOperations);
   },
 });
