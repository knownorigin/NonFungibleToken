import * as ABIDecoder from "abi-decoder";
import * as BigNumber from "bignumber.js";
import * as chai from "chai";
import * as Web3 from "web3";

import {KnownOriginDigitalAssetContract} from "../../types/generated/known_origin_digital_asset";
import {BigNumberSetup} from "./utils/bignumber_setup.js";
import {chaiSetup} from "./utils/chai_setup.js";
import {INVALID_OPCODE, REVERT_ERROR} from "./utils/constants";
import {LogApproval, LogTransfer} from "./utils/logs";

// Set up Chai
chaiSetup.configure();
const expect = chai.expect;

// Configure BigNumber exponentiation
BigNumberSetup.configure();

// Import truffle contract instance
const knownOriginDigitalAssetContract = artifacts.require("KnownOriginDigitalAsset");

// Initialize ABI Decoder for deciphering log receipts
ABIDecoder.addABI(knownOriginDigitalAssetContract.abi);

contract("KODA Token", (ACCOUNTS) => {
    let knownOriginDigitalAsset: KnownOriginDigitalAssetContract;

    const CONTRACT_OWNER = ACCOUNTS[0];
    const TOKEN_OWNER_1 = ACCOUNTS[1];
    const TOKEN_OWNER_2 = ACCOUNTS[2];
    const TOKEN_OWNER_3 = ACCOUNTS[3];
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

    const TX_DEFAULTS = {from: CONTRACT_OWNER, gas: 4000000};

    const deployNft = async () => {
        const instance = await knownOriginDigitalAssetContract.new(TX_DEFAULTS);

        // The generated contract typings we use ingest raw Web3 contract instances,
        // so we create a Web3 contract instance from the Truffle contract instance

        const web3ContractInstance = web3.eth.contract(instance.abi).at(instance.address);

        knownOriginDigitalAsset = new KnownOriginDigitalAssetContract(web3ContractInstance, TX_DEFAULTS);
    };

    const deployAndInitNft = async () => {
        await deployNft();
    };

    before(deployNft);

    describe("Flags", () => {
        it("should expose implementsERC721 method", async () => {
            await expect(knownOriginDigitalAsset.implementsERC721.callAsync()).to.eventually.equal(true);
        });
    });

    describe("General KODA Metadata", () => {
        it("should expose name variable", async () => {
            await expect(knownOriginDigitalAsset.name.callAsync()).to.eventually.equal("KnownOriginDigitalAsset");
        });

        it("should expose KODA symbol variable", async () => {
            await expect(knownOriginDigitalAsset.symbol.callAsync()).to.eventually.equal("KODA");
        });
    });

    describe("#totalSupply()", async () => {
        it("should return 0 for initial supply", async () => {
            await expect(knownOriginDigitalAsset.totalSupply.callAsync()).to.eventually.bignumber.equal(0);
        });

        // it("should return correct current supply after each mint", async () => {
        //     await mintableNft.mint.sendTransactionAsync(TOKEN_OWNER_1, TOKEN_ID_1);
        //     await expect(mintableNft.totalSupply.callAsync()).to.eventually.bignumber.equal(1);
        //
        //     await mintableNft.mint.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_ID_2);
        //     await expect(mintableNft.totalSupply.callAsync()).to.eventually.bignumber.equal(2);
        //
        //     await mintableNft.mint.sendTransactionAsync(TOKEN_OWNER_3, TOKEN_ID_3);
        //     await expect(mintableNft.totalSupply.callAsync()).to.eventually.bignumber.equal(3);
        // });
    });

    // describe("#balanceOf()", async () => {
    //     before(deployAndInitNft);
    //
    //     it("should return 1 for each owner's balance", async () => {
    //         await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
    //         await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(1);
    //         await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
    //     });
    // });
    //
    // describe("#tokenOfOwnerByIndex()", async () => {
    //     before(deployAndInitNft);
    //
    //     it("should return current token at index 0 for each user", async () => {
    //         await expect(mintableNft.tokenOfOwnerByIndex
    //             .callAsync(TOKEN_OWNER_1, new BigNumber.BigNumber(0)))
    //             .to.eventually.bignumber.equal(TOKEN_ID_1);
    //         await expect(mintableNft.tokenOfOwnerByIndex
    //             .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(0)))
    //             .to.eventually.bignumber.equal(TOKEN_ID_2);
    //         await expect(mintableNft.tokenOfOwnerByIndex
    //             .callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(0)))
    //             .to.eventually.bignumber.equal(TOKEN_ID_3);
    //     });
    //
    //     it("should throw if called at index > balanceOf(owner)", async () => {
    //         await expect(mintableNft.tokenOfOwnerByIndex
    //             .callAsync(TOKEN_OWNER_1, new BigNumber.BigNumber(1)))
    //             .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //         await expect(mintableNft.tokenOfOwnerByIndex
    //             .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(1)))
    //             .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //         await expect(mintableNft.tokenOfOwnerByIndex
    //             .callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(1)))
    //             .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //     });
    // });
    //
    // describe("#transfer()", async () => {
    //     before(deployAndInitNft);
    //
    //     describe("user transfers token he doesn't own", async () => {
    //         it("should throw", async () => {
    //             await expect(mintableNft.transfer
    //                 .sendTransactionAsync(TOKEN_OWNER_1, TOKEN_ID_2, {from: TOKEN_OWNER_1}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user transfers token that doesn't exist", async () => {
    //         it("should throw", async () => {
    //             await expect(mintableNft.transfer
    //                 .sendTransactionAsync(TOKEN_OWNER_1, NONEXISTENT_TOKEN_ID, {from: TOKEN_OWNER_1}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user transfers token he owns", async () => {
    //         let res: Web3.TransactionReceipt;
    //
    //         before(async () => {
    //             const txHash = await mintableNft.transfer
    //                 .sendTransactionAsync(TOKEN_OWNER_2, TOKEN_ID_1, {from: TOKEN_OWNER_1});
    //             res = await web3.eth.getTransactionReceipt(txHash);
    //         });
    //
    //         it("should emit transfer log", async () => {
    //             const [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
    //             const logExpected = LogTransfer(mintableNft.address, TOKEN_OWNER_1, TOKEN_OWNER_2, TOKEN_ID_1);
    //
    //             expect(transferLog).to.deep.equal(logExpected);
    //         });
    //
    //         it("should belong to new owner", async () => {
    //             await expect(mintableNft.ownerOf.callAsync(TOKEN_ID_1)).to.eventually.equal(TOKEN_OWNER_2);
    //         });
    //
    //         it("should update owners' token balances correctly", async () => {
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(0);
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
    //         });
    //
    //         it("should update owners' iterable token lists", async () => {
    //             // TOKEN_OWNER_1
    //             await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1,
    //                 new BigNumber.BigNumber(0))).to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //             // TOKEN_OWNER_2
    //             await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2,
    //                 new BigNumber.BigNumber(0))).to.eventually.bignumber.equal(TOKEN_ID_2);
    //             await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2,
    //                 new BigNumber.BigNumber(1))).to.eventually.bignumber.equal(TOKEN_ID_1);
    //             await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2,
    //                 new BigNumber.BigNumber(2))).to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //             // TOKEN_OWNER_3
    //             await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3,
    //                 new BigNumber.BigNumber(0))).to.eventually.bignumber.equal(TOKEN_ID_3);
    //             await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3,
    //                 new BigNumber.BigNumber(1))).to.eventually.be.rejectedWith(INVALID_OPCODE);
    //         });
    //     });
    //
    //     describe("user transfers token he no longer owns", () => {
    //         it("should throw", async () => {
    //             await expect(mintableNft.transfer
    //                 .sendTransactionAsync(TOKEN_OWNER_2, TOKEN_ID_1, {from: TOKEN_OWNER_1}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user transfers token he owns to 0", () => {
    //         it("should throw", async () => {
    //             await expect(mintableNft.transfer
    //                 .sendTransactionAsync(NULL_ADDRESS, TOKEN_ID_1, {from: TOKEN_OWNER_1}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user transfers token he owns to himself", () => {
    //         let res: Web3.TransactionReceipt;
    //
    //         before(async () => {
    //             const txHash = await mintableNft.transfer
    //                 .sendTransactionAsync(TOKEN_OWNER_2, TOKEN_ID_1, {from: TOKEN_OWNER_2});
    //             res = await web3.eth.getTransactionReceipt(txHash);
    //         });
    //
    //         it("should emit transfer log", async () => {
    //             const [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
    //             const logExpected =
    //                 LogTransfer(mintableNft.address, TOKEN_OWNER_2, TOKEN_OWNER_2, TOKEN_ID_1);
    //
    //             expect(transferLog).to.deep.equal(logExpected);
    //         });
    //
    //         it("should belong to same owner", async () => {
    //             await expect(mintableNft.ownerOf.callAsync(TOKEN_ID_1)).to.eventually.equal(TOKEN_OWNER_2);
    //         });
    //
    //         it("should maintain owners' token balances correctly", async () => {
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(0);
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
    //         });
    //
    //         it("should not modify owners' iterable token lists", async () => {
    //             // TOKEN_OWNER_1
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_1, new BigNumber.BigNumber(0)))
    //                 .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //             // TOKEN_OWNER_2
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(0)))
    //                 .to.eventually.bignumber.equal(TOKEN_ID_2);
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(1)))
    //                 .to.eventually.bignumber.equal(TOKEN_ID_1);
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(2)))
    //                 .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //             // TOKEN_OWNER_3
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(0)))
    //                 .to.eventually.bignumber.equal(TOKEN_ID_3);
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(1)))
    //                 .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //         });
    //     });
    //
    //     describe("user transfers token with outstanding approval", () => {
    //         let res: Web3.TransactionReceipt;
    //         let approvalLog: ABIDecoder.DecodedLog;
    //         let transferLog: ABIDecoder.DecodedLog;
    //
    //         before(async () => {
    //             await mintableNft.approve.sendTransactionAsync(TOKEN_OWNER_1, TOKEN_ID_3, {from: TOKEN_OWNER_3});
    //             const txHash = await mintableNft.transfer
    //                 .sendTransactionAsync(TOKEN_OWNER_1, TOKEN_ID_3, {from: TOKEN_OWNER_3});
    //             res = await web3.eth.getTransactionReceipt(txHash);
    //
    //             [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
    //         });
    //
    //         it("should emit approval clear log", () => {
    //             const logExpected = LogApproval(mintableNft.address, TOKEN_OWNER_3, NULL_ADDRESS, TOKEN_ID_3);
    //
    //             expect(approvalLog).to.deep.equal(logExpected);
    //         });
    //
    //         it("should emit transfer log", () => {
    //             const logExpected = LogTransfer(mintableNft.address, TOKEN_OWNER_3, TOKEN_OWNER_1, TOKEN_ID_3);
    //
    //             expect(transferLog).to.deep.equal(logExpected);
    //         });
    //
    //         it("should belong to new owner", async () => {
    //             await expect(mintableNft.ownerOf.callAsync(TOKEN_ID_3)).to.eventually.equal(TOKEN_OWNER_1);
    //         });
    //
    //         it("should update owners' token balances correctly", async () => {
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
    //             await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(0);
    //         });
    //
    //         it("should update owners' iterable token lists", async () => {
    //             // TOKEN_OWNER_1
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_1, new BigNumber.BigNumber(0)))
    //                 .to.eventually.bignumber.equal(TOKEN_ID_3);
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_1, new BigNumber.BigNumber(1)))
    //                 .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //             // TOKEN_OWNER_2
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(0)))
    //                 .to.eventually.bignumber.equal(TOKEN_ID_2);
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(1)))
    //                 .to.eventually.bignumber.equal(TOKEN_ID_1);
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(2)))
    //                 .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //             // TOKEN_OWNER_3
    //             await expect(mintableNft.tokenOfOwnerByIndex
    //                 .callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(0)))
    //                 .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //         });
    //     });
    // });
    //
    // describe("#approve()", () => {
    //     before(deployAndInitNft);
    //
    //     describe("user approves transfer for token he doesn't own", () => {
    //         it("should throw", async () => {
    //             expect(mintableNft.approve.sendTransactionAsync(
    //                 TOKEN_OWNER_2, TOKEN_ID_1, {from: TOKEN_OWNER_2}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user approves transfer for nonexistent token", () => {
    //         it("should throw", async () => {
    //             expect(mintableNft.approve.sendTransactionAsync(
    //                 TOKEN_OWNER_2, NONEXISTENT_TOKEN_ID, {from: TOKEN_OWNER_2}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user approves himself for transferring token he owns", () => {
    //         it("should throw", async () => {
    //             expect(mintableNft.approve.sendTransactionAsync(
    //                 TOKEN_OWNER_1, TOKEN_ID_1, {from: TOKEN_OWNER_1}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user owns token", () => {
    //         describe("user clears unset approval", () => {
    //             let res: Web3.TransactionReceipt;
    //
    //             before(async () => {
    //                 const txHash = await mintableNft.approve.sendTransactionAsync(
    //                     NULL_ADDRESS, TOKEN_ID_1, {from: TOKEN_OWNER_1});
    //                 res = await web3.eth.getTransactionReceipt(txHash);
    //             });
    //
    //             it("should NOT emit approval event", async () => {
    //                 expect(res.logs.length).to.equal(0);
    //             });
    //
    //             it("should maintain cleared approval", async () => {
    //                 await expect(mintableNft.getApproved.callAsync(TOKEN_ID_1))
    //                     .to.eventually.equal(NULL_ADDRESS);
    //             });
    //         });
    //
    //         describe("user sets new approval", () => {
    //             let res: Web3.TransactionReceipt;
    //
    //             before(async () => {
    //                 const txHash = await mintableNft.approve.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_ID_1,
    //                     {from: TOKEN_OWNER_1});
    //
    //                 res = await web3.eth.getTransactionReceipt(txHash);
    //             });
    //
    //             it("should return newly approved user as approved", async () => {
    //                 await expect(mintableNft.getApproved.callAsync(TOKEN_ID_1))
    //                     .to.eventually.equal(TOKEN_OWNER_2);
    //             });
    //
    //             it("should emit approval log", () => {
    //                 const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
    //                 const logExpected =
    //                     LogApproval(mintableNft.address, TOKEN_OWNER_1, TOKEN_OWNER_2, TOKEN_ID_1);
    //
    //                 expect(approvalLog).to.deep.equal(logExpected);
    //             })
    //         });
    //
    //         describe("user changes token approval", () => {
    //             let res: Web3.TransactionReceipt;
    //
    //             before(async () => {
    //                 const txHash = await mintableNft.approve.sendTransactionAsync(TOKEN_OWNER_3,
    //                     TOKEN_ID_1, {from: TOKEN_OWNER_1});
    //                 res = await web3.eth.getTransactionReceipt(txHash);
    //             });
    //
    //             it("should return newly approved user as approved", async () => {
    //                 await expect(mintableNft.getApproved.callAsync(TOKEN_ID_1))
    //                     .to.eventually.equal(TOKEN_OWNER_3);
    //             });
    //
    //             it("should emit approval log", () => {
    //                 const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
    //                 const logExpected =
    //                     LogApproval(mintableNft.address, TOKEN_OWNER_1, TOKEN_OWNER_3, TOKEN_ID_1);
    //
    //                 expect(approvalLog).to.deep.equal(logExpected);
    //             })
    //         });
    //
    //         describe("user reaffirms approval", () => {
    //             let res: Web3.TransactionReceipt;
    //
    //             before(async () => {
    //                 const txHash = await mintableNft.approve.sendTransactionAsync(TOKEN_OWNER_3, TOKEN_ID_1,
    //                     {from: TOKEN_OWNER_1});
    //                 res = await web3.eth.getTransactionReceipt(txHash);
    //             });
    //
    //             it("should return same approved user as approved", async () => {
    //                 await expect(mintableNft.getApproved.callAsync(TOKEN_ID_1))
    //                     .to.eventually.equal(TOKEN_OWNER_3);
    //             });
    //
    //             it("should emit approval log", () => {
    //                 const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
    //                 const logExpected =
    //                     LogApproval(mintableNft.address, TOKEN_OWNER_1, TOKEN_OWNER_3, TOKEN_ID_1);
    //
    //                 expect(approvalLog).to.deep.equal(logExpected);
    //             })
    //         });
    //
    //         describe("user clears set approval", () => {
    //             let res: Web3.TransactionReceipt;
    //
    //             before(async () => {
    //                 const txHash = await mintableNft.approve.sendTransactionAsync(NULL_ADDRESS, TOKEN_ID_1,
    //                     {from: TOKEN_OWNER_1});
    //                 res = await web3.eth.getTransactionReceipt(txHash);
    //             });
    //
    //             it("should return newly approved user as approved", async () => {
    //                 await expect(mintableNft.getApproved.callAsync(TOKEN_ID_1))
    //                     .to.eventually.equal(NULL_ADDRESS);
    //             });
    //
    //             it("should emit approval log", () => {
    //                 const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
    //                 const logExpected =
    //                     LogApproval(mintableNft.address, TOKEN_OWNER_1, NULL_ADDRESS, TOKEN_ID_1);
    //
    //                 expect(approvalLog).to.deep.equal(logExpected);
    //             })
    //         });
    //     });
    // });
    //
    // describe("#transferFrom()", () => {
    //     before(deployAndInitNft);
    //
    //     describe("user transfers token from owner w/o approval...", () => {
    //         it("should throw", async () => {
    //             await expect(mintableNft.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_3,
    //                 TOKEN_ID_1, {from: TOKEN_OWNER_3}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user transfers non-existent token", () => {
    //         it("should throw", async () => {
    //             await expect(mintableNft.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_3,
    //                 NONEXISTENT_TOKEN_ID, {from: TOKEN_OWNER_3}))
    //                 .to.eventually.be.rejectedWith(REVERT_ERROR);
    //         });
    //     });
    //
    //     describe("user transfers token from owner w/ approval...", () => {
    //         before(async () => {
    //             await mintableNft.approve.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_ID_1,
    //                 {from: TOKEN_OWNER_1});
    //         });
    //
    //         describe("...from himself to himself", () => {
    //             it("should throw", async () => {
    //                 await expect(mintableNft.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_2,
    //                     TOKEN_ID_2, {from: TOKEN_OWNER_2}))
    //                     .to.eventually.be.rejectedWith(REVERT_ERROR);
    //             });
    //         });
    //
    //         describe("...to null address", () => {
    //             it("should throw", async () => {
    //                 await expect(mintableNft.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, NULL_ADDRESS,
    //                     TOKEN_ID_1, {from: TOKEN_OWNER_2}))
    //                     .to.eventually.be.rejectedWith(REVERT_ERROR);
    //             });
    //         });
    //
    //         describe("...from other owner to himself", () => {
    //             let res: Web3.TransactionReceipt;
    //             let approvalLog: ABIDecoder.DecodedLog;
    //             let transferLog: ABIDecoder.DecodedLog;
    //
    //             before(async () => {
    //                 const txHash = await mintableNft.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, TOKEN_OWNER_3,
    //                     TOKEN_ID_1, {from: TOKEN_OWNER_2});
    //                 res = await web3.eth.getTransactionReceipt(txHash);
    //
    //                 [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
    //             });
    //
    //             it("should emit approval clear log", () => {
    //                 const logExpected =
    //                     LogApproval(mintableNft.address, TOKEN_OWNER_1, NULL_ADDRESS, TOKEN_ID_1);
    //
    //                 expect(approvalLog).to.deep.equal(logExpected);
    //             });
    //
    //             it("should emit transfer log", () => {
    //                 const logExpected =
    //                     LogTransfer(mintableNft.address, TOKEN_OWNER_1, TOKEN_OWNER_3, TOKEN_ID_1);
    //
    //                 expect(transferLog).to.deep.equal(logExpected);
    //             });
    //
    //             it("should belong to new owner", async () => {
    //                 await expect(mintableNft.ownerOf.callAsync(TOKEN_ID_1))
    //                     .to.eventually.equal(TOKEN_OWNER_3);
    //             });
    //
    //             it("should update owners' token balances correctly", async () => {
    //                 await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_1))
    //                     .to.eventually.bignumber.equal(0);
    //                 await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_2))
    //                     .to.eventually.bignumber.equal(1);
    //                 await expect(mintableNft.balanceOf.callAsync(TOKEN_OWNER_3))
    //                     .to.eventually.bignumber.equal(2);
    //             });
    //
    //             it("should update owners' iterable token lists", async () => {
    //                 // TOKEN_OWNER_1
    //                 await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, new BigNumber.BigNumber(0)))
    //                     .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //                 // TOKEN_OWNER_2
    //                 await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(0)))
    //                     .to.eventually.bignumber.equal(TOKEN_ID_2);
    //                 await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, new BigNumber.BigNumber(1)))
    //                     .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //
    //                 // TOKEN_OWNER_3
    //                 await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(0)))
    //                     .to.eventually.bignumber.equal(TOKEN_ID_3);
    //                 await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(1)))
    //                     .to.eventually.bignumber.equal(TOKEN_ID_1);
    //                 await expect(mintableNft.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, new BigNumber.BigNumber(2)))
    //                     .to.eventually.be.rejectedWith(INVALID_OPCODE);
    //             });
    //         });
    //     });
    // });

    // TODO: Add tests for getOwnerTokens
});
