import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Enhanced Hardhat tasks for SecureData contract testing and interaction
 * Supports both encrypted and mock FHEVM operations
 */

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the SecureData contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the SecureData contract
 *
 *   npx hardhat --network localhost task:submit-contact --phone 1234567890 --email 123 --emergency 9876543210
 *   npx hardhat --network localhost task:get-contact-status
 *   npx hardhat --network localhost task:decrypt-contact
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the SecureData contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the SecureData contract
 *
 *   npx hardhat --network sepolia task:submit-contact --phone 1234567890 --email 123 --emergency 9876543210
 *   npx hardhat --network sepolia task:get-contact-status
 *   npx hardhat --network sepolia task:decrypt-contact
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 */
task("task:address", "Prints the SecureData contract address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const secureData = await deployments.get("SecureData");

  console.log("SecureData contract address is " + secureData.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:get-contact-status
 *   - npx hardhat --network sepolia task:get-contact-status
 */
task("task:get-contact-status", "Checks if contact information is complete for the current user")
  .addOptionalParam("address", "Optionally specify the SecureData contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const SecureDataDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SecureData");
    console.log(`SecureData: ${SecureDataDeployment.address}`);

    const signers = await ethers.getSigners();
    const userAddress = signers[0].address;

    const secureDataContract = await ethers.getContractAt("SecureData", SecureDataDeployment.address);

    const hasInfo = await secureDataContract.hasContactInfo(userAddress);
    const isComplete = await secureDataContract.isContactInfoComplete(userAddress);

    console.log(`User address: ${userAddress}`);
    console.log(`Has contact info: ${hasInfo}`);
    console.log(`Contact info complete: ${isComplete}`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:submit-contact --phone 1234567890 --email 123 --emergency 9876543210
 *   - npx hardhat --network sepolia task:submit-contact --phone 1234567890 --email 123 --emergency 9876543210
 */
task("task:submit-contact", "Submits encrypted contact information")
  .addOptionalParam("address", "Optionally specify the SecureData contract address")
  .addParam("phone", "Phone number (will be encrypted)")
  .addParam("email", "Email hash (will be encrypted)")
  .addParam("emergency", "Emergency contact (will be encrypted)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const phone = parseInt(taskArguments.phone);
    const email = parseInt(taskArguments.email);
    const emergency = parseInt(taskArguments.emergency);

    if (!Number.isInteger(phone) || !Number.isInteger(email) || !Number.isInteger(emergency)) {
      throw new Error(`All arguments must be integers`);
    }

    await fhevm.initializeCLIApi();

    const SecureDataDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SecureData");
    console.log(`SecureData: ${SecureDataDeployment.address}`);

    const signers = await ethers.getSigners();

    const secureDataContract = await ethers.getContractAt("SecureData", SecureDataDeployment.address);

    // Encrypt the contact information
    const encryptedInput = await fhevm
      .createEncryptedInput(SecureDataDeployment.address, signers[0].address)
      .add8(phone)
      .add8(email)
      .add8(emergency)
      .encrypt();

    const tx = await secureDataContract
      .connect(signers[0])
      .submitContactInfo(
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.handles[2],
        encryptedInput.inputProof
      );
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    console.log(`SecureData contact submission succeeded!`);
    console.log(`Phone: ${phone}, Email: ${email}, Emergency: ${emergency}`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-contact
 *   - npx hardhat --network sepolia task:decrypt-contact
 */
task("task:decrypt-contact", "Decrypts contact information for the current user")
  .addOptionalParam("address", "Optionally specify the SecureData contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const SecureDataDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("SecureData");
    console.log(`SecureData: ${SecureDataDeployment.address}`);

    const signers = await ethers.getSigners();
    const userAddress = signers[0].address;

    const secureDataContract = await ethers.getContractAt("SecureData", SecureDataDeployment.address);

    const [encryptedPhone, encryptedEmail, encryptedEmergency] = await secureDataContract.getContactInfo(userAddress);

    console.log(`User address: ${userAddress}`);

    if (encryptedPhone === ethers.ZeroHash) {
      console.log("No contact information submitted yet");
      return;
    }

    const clearPhone = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedPhone,
      SecureDataDeployment.address,
      signers[0],
    );

    const clearEmail = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedEmail,
      SecureDataDeployment.address,
      signers[0],
    );

    const clearEmergency = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedEmergency,
      SecureDataDeployment.address,
      signers[0],
    );

    console.log(`Encrypted phone: ${encryptedPhone}`);
    console.log(`Clear phone      : ${clearPhone}`);
    console.log(`Encrypted email: ${encryptedEmail}`);
    console.log(`Clear email      : ${clearEmail}`);
    console.log(`Encrypted emergency: ${encryptedEmergency}`);
    console.log(`Clear emergency      : ${clearEmergency}`);
  });
