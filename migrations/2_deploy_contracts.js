var FileSystem = artifacts.require('Filesystem')
var Judge = artifacts.require('Judge')

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(FileSystem)
  deployer.deploy(Judge)
};
