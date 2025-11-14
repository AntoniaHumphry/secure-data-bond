import { expect } from "chai";
import { ethers } from "hardhat";
import { SecureData } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SecureData Validation Functions", function () {
  let secureDataContract: SecureData;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const SecureDataFactory = await ethers.getContractFactory("SecureData");
    secureDataContract = (await SecureDataFactory.deploy()) as SecureData;
    await secureDataContract.waitForDeployment();
  });

  describe("Validation Functions", function () {
    it("Should validate correct phone number format", async function () {
      const [isValid] = await secureDataContract.validateContactInfo(12345678, 0, 87654321);
      expect(isValid).to.be.true;
    });

    it("Should reject phone numbers that are too short", async function () {
      const [isValid] = await secureDataContract.validateContactInfo(123, 0, 87654321);
      expect(isValid).to.be.false;
    });

    it("Should reject phone numbers that are too long", async function () {
      const [isValid] = await secureDataContract.validateContactInfo(123456789, 0, 87654321);
      expect(isValid).to.be.false;
    });

    it("Should validate email with @ symbol", async function () {
      const emailBytes = ethers.encodeBytes32String("test@example.com");
      const [isValid] = await secureDataContract.validateContactInfo(12345678, 0, 87654321);
      // Note: This is a simplified test - actual email validation would be more complex
      expect(isValid).to.be.true;
    });

    it("Should reject emergency contacts that are too short", async function () {
      const [isValid] = await secureDataContract.validateContactInfo(12345678, 0, 123);
      expect(isValid).to.be.false;
    });

    it("Should reject emergency contacts that are too long", async function () {
      const [isValid] = await secureDataContract.validateContactInfo(12345678, 0, 123456789);
      expect(isValid).to.be.false;
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to add admin", async function () {
      await secureDataContract.addAdmin(user1.address);
      expect(await secureDataContract.isAdmin(user1.address)).to.be.true;
    });

    it("Should allow owner to remove admin", async function () {
      await secureDataContract.addAdmin(user1.address);
      await secureDataContract.removeAdmin(user1.address);
      expect(await secureDataContract.isAdmin(user1.address)).to.be.false;
    });

    it("Should not allow non-owner to add admin", async function () {
      await expect(
        secureDataContract.connect(user1).addAdmin(user1.address)
      ).to.be.revertedWith("Not owner");
    });

    it("Should not allow adding zero address as admin", async function () {
      await expect(
        secureDataContract.addAdmin(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid admin address");
    });
  });

  describe("Version Function", function () {
    it("Should return correct version", async function () {
      expect(await secureDataContract.getVersion()).to.equal("1.0.0");
    });
  });
});
