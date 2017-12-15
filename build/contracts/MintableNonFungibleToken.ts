/* GENERATED BY TYPECHAIN VER. 0.0.9 */

import { BigNumber } from "bignumber.js";
import {
  TypeChainContract,
  promisify,
  ITxParams,
  IPayableTxParams,
  DeferredTransactionWrapper
} from "./typechain-runtime";

export class MintableNonFungibleToken extends TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: false,
        inputs: [
          { name: "_to", type: "address" },
          { name: "_tokenId", type: "uint256" }
        ],
        name: "approve",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "implementsERC721",
        outputs: [{ name: "_implementsERC721", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "_totalSupply", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_from", type: "address" },
          { name: "_to", type: "address" },
          { name: "_tokenId", type: "uint256" }
        ],
        name: "transferFrom",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_tokenId", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ name: "_owner", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "tokenIdToOwner",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "_balance", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "address" }],
        name: "ownerToNumTokensOwned",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
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
        constant: false,
        inputs: [
          { name: "_to", type: "address" },
          { name: "_tokenId", type: "uint256" }
        ],
        name: "transfer",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "numTokensTotal",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "tokenIdToApprovedAddress",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "tokenIdToMetadata",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_owner", type: "address" },
          { name: "_tokenId", type: "uint256" },
          { name: "_metadata", type: "string" }
        ],
        name: "mint",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [{ name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "previousOwner", type: "address" },
          { indexed: true, name: "newOwner", type: "address" }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "_from", type: "address" },
          { indexed: true, name: "_to", type: "address" },
          { indexed: false, name: "_tokenId", type: "uint256" }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "_owner", type: "address" },
          { indexed: true, name: "_approved", type: "address" },
          { indexed: false, name: "_tokenId", type: "uint256" }
        ],
        name: "Approval",
        type: "event"
      }
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber
  ): Promise<MintableNonFungibleToken> {
    const contract = new MintableNonFungibleToken(web3, address);
    const code = await promisify(web3.eth.getCode, [address]);
    if (code === "0x0") {
      throw new Error(`Contract at ${address} doesn't exist!`);
    }
    return contract;
  }

  public get implementsERC721(): Promise<boolean> {
    return promisify(this.rawWeb3Contract.implementsERC721, []);
  }
  public get totalSupply(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.totalSupply, []);
  }
  public get owner(): Promise<string> {
    return promisify(this.rawWeb3Contract.owner, []);
  }
  public get numTokensTotal(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.numTokensTotal, []);
  }

  public ownerOf(_tokenId: BigNumber | number): Promise<string> {
    return promisify(this.rawWeb3Contract.ownerOf, [_tokenId.toString()]);
  }
  public tokenIdToOwner(index: BigNumber | number): Promise<string> {
    return promisify(this.rawWeb3Contract.tokenIdToOwner, [index.toString()]);
  }
  public balanceOf(_owner: BigNumber | string): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.balanceOf, [_owner.toString()]);
  }
  public ownerToNumTokensOwned(index: BigNumber | string): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.ownerToNumTokensOwned, [
      index.toString()
    ]);
  }
  public tokenIdToApprovedAddress(index: BigNumber | number): Promise<string> {
    return promisify(this.rawWeb3Contract.tokenIdToApprovedAddress, [
      index.toString()
    ]);
  }
  public tokenIdToMetadata(index: BigNumber | number): Promise<string> {
    return promisify(this.rawWeb3Contract.tokenIdToMetadata, [
      index.toString()
    ]);
  }

  public approveTx(
    _to: BigNumber | string,
    _tokenId: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "approve", [
      _to.toString(),
      _tokenId.toString()
    ]);
  }
  public transferFromTx(
    _from: BigNumber | string,
    _to: BigNumber | string,
    _tokenId: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "transferFrom", [
      _from.toString(),
      _to.toString(),
      _tokenId.toString()
    ]);
  }
  public transferTx(
    _to: BigNumber | string,
    _tokenId: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "transfer", [
      _to.toString(),
      _tokenId.toString()
    ]);
  }
  public mintTx(
    _owner: BigNumber | string,
    _tokenId: BigNumber | number,
    _metadata: string
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "mint", [
      _owner.toString(),
      _tokenId.toString(),
      _metadata.toString()
    ]);
  }
  public transferOwnershipTx(
    newOwner: BigNumber | string
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(
      this,
      "transferOwnership",
      [newOwner.toString()]
    );
  }

  public approve(
    _to: BigNumber | string,
    _tokenId: BigNumber | number,
    options?: any
  ) {
    return promisify(this.rawWeb3Contract.approve, [
      _to.toString(),
      _tokenId.toString(),
      options
    ]);
  }
  public transferFrom(
    _from: BigNumber | string,
    _to: BigNumber | string,
    _tokenId: BigNumber | number,
    options?: any
  ) {
    return promisify(this.rawWeb3Contract.transferFrom, [
      _from.toString(),
      _to.toString(),
      _tokenId.toString(),
      options
    ]);
  }
  public transfer(
    _to: BigNumber | string,
    _tokenId: BigNumber | number,
    options?: any
  ) {
    return promisify(this.rawWeb3Contract.transfer, [
      _to.toString(),
      _tokenId.toString(),
      options
    ]);
  }
  public mint(
    _owner: BigNumber | string,
    _tokenId: BigNumber | number,
    _metadata: string,
    options?: any
  ) {
    return promisify(this.rawWeb3Contract.mint, [
      _owner.toString(),
      _tokenId.toString(),
      _metadata.toString(),
      options
    ]);
  }
  public transferOwnership(newOwner: BigNumber | string, options?: any) {
    return promisify(this.rawWeb3Contract.transferOwnership, [
      newOwner.toString(),
      options
    ]);
  }
}
