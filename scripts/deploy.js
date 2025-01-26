const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initialSupply = ethers.parseUnits("1000000", 18); // 1 million tokens with 18 decimals
  const simpleTokenContract = await ethers.deployContract("SimpleToken", [
    initialSupply,
  ]);
  const contract_address = await simpleTokenContract.getAddress();

  console.log("Contract address:", contract_address);
  saveFrontendFiles(contract_address);
}

function saveFrontendFiles(contract_address) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ SimpleToken: contract_address }, undefined, 2)
  );

  const SimpleTokenArtifact = artifacts.readArtifactSync("SimpleToken");

  fs.writeFileSync(
    path.join(contractsDir, "SimpleToken.json"),
    JSON.stringify(SimpleTokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
