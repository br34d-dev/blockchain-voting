const Ballot = artifacts.require('./Ballot.sol')

let names = ['Joe Biden', 'Mike Pence', 'Jo Jo']
let party = ['Democrat', 'Republican', 'Green']

contract('Ballot', accounts => {
  it('...should be deployed', async () => {
    const ballotInstance = await Ballot.deployed()
    assert(ballotInstance.address != '')
  })
  it('...should accept a vote', async () => {
    const ballotInstance = await Ballot.deployed()
    await ballotInstance.enrollCandidate(names[0], party[0])
    // Set value of 89
    await ballotInstance.castVote(names[0])

    let val = await ballotInstance.getResults()

    assert.equal(val, party[0], 'Wrong result')
  })
  it('... does not allow multiple votes from one person', async () => {
    const ballotInstance = await Ballot.deployed()
    try {
      await ballotInstance.enrollCandidate(names[0], party[0])
      await ballotInstance.castVote(names[0])
      await ballotInstance.castVote(names[0])

      let val = await ballotInstance.getResults()

      assert(false)
    } catch (e) {
      assert(true)
    }
  })
})
