
# KnownOriginDigitalAsset

Characteristics of [KnownOriginDigitalAsset](https://github.com/knownorigin/NonFungibleToken/blob/master/contracts/KnownOriginDigitalAsset.sol): 

* Curator of collection is the only person who can mint digital assets
* A digital asset that can be purchased
* A digital asset that can be transferred once purchased
* A digital asset with attached metadata
* A digital asset that can be minted in limited editions or as a single asset


------------
Forked from [Dharma Protocol's NonFungibleToken](https://github.com/dharmaprotocol/NonFungibleToken). See below:

## Non-Fungible Token (ERC721) Generic Implementation

This repository contains a generic implementation of the ERC721 non-fungible token standard that is fully-tested and adherent to the emerging ERC721 standard.

We welcome contributions, revisions, and feedback.  Heavily based off of [Decentraland's generic implementation](https://github.com/decentraland/land/blob/master/contracts/BasicNFT.sol).

~Shameless plug~: built for use in [Dharma](https://dharma.io), a protocol for generic tokenized debt issuance and fundraising on blockchains supporting requisite smart contract functionality (i.e. EVM blockchains).  [Join us on our chat](https://chat.dharma.io) for any technical or general questions.

We use truffle for deployment, testing, and development, and use [Typescript](https://www.typescriptlang.org/) for testing and deployment.

### Setup
---------------
##### Dependencies

Install dependencies:
```
npm install
```

##### Testing

Start `testrpc`:
```
npm run testrpc
```
Run `truffle` migrations:
```
npm run migrate
```
Run `truffle` tests:
```
npm test
```
