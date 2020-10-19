import React, { Component } from 'react'
import BallotContract from './contracts/Ballot.json'
import getWeb3 from './getWeb3'

import './App.css'

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    address: '',
    enrollName: '',
    enrollParty: '',
    voteName: '',
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = BallotContract.networks[networkId]
      const instance = new web3.eth.Contract(
        BallotContract.abi,
        deployedNetwork && deployedNetwork.address
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance })
      this.setState({
        web3,
        accounts,
        contract: instance,
        address: deployedNetwork.address,
      })
      console.log('contract:', instance)
      console.log(deployedNetwork.address)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.error(error)
    }
  }

  handleEnroll = async e => {
    e.preventDefault()
    const { accounts, contract, enrollName, enrollParty } = this.state
    await contract.methods
      .enrollCandidate(enrollName, enrollParty)
      .send({ from: accounts[0] })
  }

  handleVote = async e => {
    e.preventDefault()
    const { accounts, contract, voteName } = this.state
    await contract.methods.castVote(voteName).send({ from: accounts[0] })
  }

  handleCloseBallot = async () => {
    const { accounts, contract } = this.state
    await contract.methods.closeBallot().send({ from: accounts[0] })
    const result = await contract.methods.getResult().call()
    console.log('Final result: ', result)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <h1>
          Ballot{' '}
          {this.address ? this.address : '0x314B9e73A0009F4dD58AD4296FF91bf67EC1ec37'}
        </h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <h4>Enroll Candidate</h4>
        <form onSubmit={this.handleEnroll}>
          <div>
            Name
            <input
              value={this.enrollName}
              onChange={e => this.setState({ enrollName: e.target.value })}
            />
          </div>
          <div>
            Party
            <input
              value={this.enrollParty}
              onChange={e => this.setState({ enrollParty: e.target.value })}
            />
          </div>
          <button>Submit</button>
        </form>

        <h4>Vote for candidate</h4>
        <form onSubmit={this.handleVote}>
          <div>
            Name
            <input
              value={this.voteName}
              onChange={e => this.setState({ voteName: e.target.value })}
            />
            <button>Submit</button>
          </div>
        </form>
        <br />
        <br />
        <h2>GET RESULT</h2>
        <button onClick={this.handleCloseBallot}>Close Ballot</button>
      </div>
    )
  }
}

export default App
