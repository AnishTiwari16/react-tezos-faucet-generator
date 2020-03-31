/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { Component } from "react";
import * as conseiljs from "conseiljs";
import JSONPretty from "react-json-pretty";
var JSONPrettyMon = require("react-json-pretty/dist/monikai");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faucet: {}
    };
    this.revealAccount = this.revealAccount.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.activateAccount = this.activateAccount.bind(this);
  }
  createAccount() {
    const mnemonic = conseiljs.TezosWalletUtil.generateMnemonic();
    this.passphrase = Math.random()
      .toString(36)
      .substring(2, 15);
    new Promise((resolve, reject) =>
      resolve(
        conseiljs.TezosWalletUtil.unlockIdentityWithMnemonic(
          mnemonic,
          this.passphrase
        )
      )
    )
      .then(faucet => {
        this.setState({ faucet });
      })
      .catch(err => {
        console.log(`error: ${err}`);
      });
  }

  activateAccount() {
    const tezosNode = "https://carthagenet.SmartPy.io";
    const keystore = {
      publicKey: this.state.faucet.publicKey,
      privateKey: this.state.faucet.privateKey,
      publicKeyHash: this.state.faucet.publicKeyHash,
      seed: "",
      storeType: conseiljs.StoreType.Fundraiser
    };
    new Promise((resolve, reject) => {
      conseiljs.TezosNodeWriter.sendIdentityActivationOperation(
        tezosNode,
        keystore,
        "0a09075426ab2658814c1faf101f53e5209a62f5"
      )
        .then(result => {
          console.log(`Injected operation group id ${result.operationGroupID}`);
          resolve(result.operationGroupID);
        })
        .catch(error => {
          console.log("========>>>>>>>", error);
          reject(error);
        });
    });
  }

  revealAccount() {
    const tezosNode = "https://carthagenet.SmartPy.io";
    const keystore = {
      publicKey: this.state.faucet.publicKey,
      privateKey: this.state.faucet.privateKey,
      publicKeyHash: this.state.faucet.publicKeyHash,
      seed: "",
      storeType: conseiljs.StoreType.Fundraiser
    };

    new Promise((resolve, reject) => {
      conseiljs.TezosNodeWriter.sendKeyRevealOperation(tezosNode, keystore)
        .then(result => {
          console.log(`Injected operation group id ${result.operationGroupID}`);
          resolve(result.operationGroupID);
        })
        .catch(error => {
          console.log("=========>>>>>>>", error);
          reject(error);
        });
    });
  }

  render() {
    return (
      <div>
        <JSONPretty
          id="json-pretty"
          data={this.state.faucet}
          theme={JSONPrettyMon}
        ></JSONPretty>
        <button onClick={this.createAccount}>{"generate faucet"}</button>
        <button onClick={this.activateAccount}>{"activate account"}</button>
        <button onClick={this.revealAccount}>{"reveal account"}</button>
      </div>
    );
  }
}

export default App;
