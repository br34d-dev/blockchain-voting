var Ballot = artifacts.require('./Ballot.sol')

module.exports = function (deployer) {
  let names = ['Joe Biden', 'Mike Pence', 'Jo Jo']
  let party = ['Democrat', 'Republican', 'Green']

  deployer.deploy(Ballot)
}
