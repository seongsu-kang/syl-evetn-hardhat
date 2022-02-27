import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { rd, td } from "./utils/utils";
import { GatherSYL, V1 } from "../typechain";
// eslint-disable-next-line camelcase,node/no-missing-import

describe("GatherSYLEvent", function () {
  let signerList: SignerWithAddress[];
  // eslint-disable-next-line camelcase
  let BragFactory;
  let GatherSYLFactory;
  let V1Factory;
  // eslint-disable-next-line camelcase
  let BragInstance: Contract;
  let GatherSYLInstance: Contract;
  let V1Instance: Contract;

  beforeEach(async () => {
    signerList = await ethers.getSigners();
    BragFactory = await ethers.getContractFactory("BRAG");
    GatherSYLFactory = await ethers.getContractFactory("GatherSYL");
    V1Factory = await ethers.getContractFactory("V1");

    BragInstance = await BragFactory.deploy();
    await BragInstance.deployed();
    GatherSYLInstance = await GatherSYLFactory.deploy();
    await GatherSYLInstance.deployed();
    V1Instance = await V1Factory.deploy();
    await V1Instance.deployed();

    await (
      await BragInstance.connect(signerList[0]).mint(
        GatherSYLInstance.address,
        td(30000000).toString()
      )
    ).wait();
    await signerList[0].sendTransaction({
      to: GatherSYLInstance.address,
      value: td(1),
    });

    for (let i = 0; i < 6; i++) {
      await (
        await V1Instance.connect(signerList[0]).mintBatch(
          signerList[i + 1].address,
          5
        )
      ).wait();
      await (
        await GatherSYLInstance.addDistributeNum(signerList[i + 1].address)
      ).wait();
      await (
        await GatherSYLInstance.connect(signerList[0]).addStakeAllowed(
          signerList[i + 1].address
        )
      ).wait();
    }
    await (
      await GatherSYLInstance.connect(signerList[0]).addNftAllowed(
        V1Instance.address
      )
    ).wait();
  });

  it("staking test", async function () {
    const tokenId = await V1Instance.connect(signerList[1]).tokenByIndex("0");
    await (
      await V1Instance.connect(signerList[1]).approve(
        GatherSYLInstance.address,
        tokenId
      )
    ).wait();

    await (
      await GatherSYLInstance.connect(signerList[1]).staking(
        V1Instance.address,
        "0"
      )
    ).wait();

    expect(await V1Instance.balanceOf(GatherSYLInstance.address)).equal("1");
    expect(await V1Instance.balanceOf(signerList[1].address)).equal("4");

    await (
      await GatherSYLInstance.connect(signerList[2]).withdraw(
        V1Instance.address,
        "0"
      )
    ).wait();

    expect(await V1Instance.balanceOf(GatherSYLInstance.address)).equal("1");
    expect(await V1Instance.balanceOf(signerList[1].address)).equal("4");

    await (
      await GatherSYLInstance.connect(signerList[1]).withdraw(
        V1Instance.address,
        "0"
      )
    ).wait();

    expect(await V1Instance.balanceOf(GatherSYLInstance.address)).equal("0");
    expect(await V1Instance.balanceOf(signerList[1].address)).equal("5");
  });

  it("distribution test", async function () {
    await (
      await GatherSYLInstance.connect(signerList[0]).distributionToken(
        BragInstance.address
      )
    ).wait();

    expect(rd(await BragInstance.balanceOf(signerList[1].address))).equal(
      6000000
    );
    expect(rd(await BragInstance.balanceOf(signerList[2].address))).equal(
      6000000
    );
    expect(rd(await BragInstance.balanceOf(signerList[3].address))).equal(
      6000000
    );
    expect(rd(await BragInstance.balanceOf(signerList[4].address))).equal(
      6000000
    );
    expect(rd(await BragInstance.balanceOf(signerList[5].address))).equal(
      3000000
    );
    expect(rd(await BragInstance.balanceOf(signerList[6].address))).equal(
      3000000
    );
  });
});
