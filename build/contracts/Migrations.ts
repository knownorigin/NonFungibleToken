/* GENERATED BY TYPECHAIN VER. 0.0.9 */

import { BigNumber } from "bignumber.js";
import {
  TypeChainContract,
  promisify,
  ITxParams,
  IPayableTxParams,
  DeferredTransactionWrapper
} from "./typechain-runtime";

export class Migrations extends TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: false,
        inputs: [{ name: "newAddress", type: "address" }],
        name: "upgrade",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "lastCompletedMigration",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "completed", type: "uint256" }],
        name: "setCompleted",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      }
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber
  ): Promise<Migrations> {
    const contract = new Migrations(web3, address);
    const code = await promisify(web3.eth.getCode, [address]);
    if (code === "0x0") {
      throw new Error(`Contract at ${address} doesn't exist!`);
    }
    return contract;
  }

  public get owner(): Promise<string> {
    return promisify(this.rawWeb3Contract.owner, []);
  }
  public get lastCompletedMigration(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.lastCompletedMigration, []);
  }

  public upgradeTx(
    newAddress: BigNumber | string
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "upgrade", [
      newAddress.toString()
    ]);
  }
  public setCompletedTx(
    completed: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "setCompleted", [
      completed.toString()
    ]);
  }

  public upgrade(newAddress: BigNumber | string, options?: any) {
    return promisify(this.rawWeb3Contract.upgrade, [
      newAddress.toString(),
      options
    ]);
  }
  public setCompleted(completed: BigNumber | number, options?: any) {
    return promisify(this.rawWeb3Contract.setCompleted, [
      completed.toString(),
      options
    ]);
  }
}
