import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log(`🚀 Deploying SecureData with deployer: ${deployer}`);

  try {
    const deployedSecureData = await deploy("SecureData", {
      from: deployer,
      log: true,
      gasLimit: 5000000,
      args: [],
    });

    console.log(`✅ SecureData deployed at: ${deployedSecureData.address}`);

    // Verify deployment on live networks
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
      console.log("⏳ Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: deployedSecureData.address,
          constructorArguments: [],
        });
        console.log("✅ Contract verified successfully");
      } catch (error) {
        console.log("⚠️  Contract verification failed:", error);
      }
    }

    // Log deployment summary
    console.log("📊 Deployment Summary:");
    console.log(`   - Network: ${hre.network.name}`);
    console.log(`   - Contract: SecureData`);
    console.log(`   - Address: ${deployedSecureData.address}`);
    console.log(`   - Deployer: ${deployer}`);

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
};
export default func;
func.id = "deploy_secureData"; // id required to prevent reexecution
func.tags = ["SecureData"];
