const hre = require("hardhat");
const { sponsorRequester } = require("./sponsor-requester");
const fs = require("fs");

async function main() {
  const { chainId } = await hre.ethers.provider.getNetwork();
  const { AirnodeRrpAddresses } = require("@api3/airnode-protocol");
  let rrpAddress = AirnodeRrpAddresses[chainId];
  if (!rrpAddress) rrpAddress = AirnodeRrpAddresses["3"];
  console.log(`Using ${rrpAddress} as RRP Address`);
  // We get the contract to deploy
  const Requester = await hre.ethers.getContractFactory("Requester");
  const requester = await Requester.deploy(rrpAddress);

  await requester.deployed();

  console.log("Requester deployed to:", requester.address);
  await sponsorRequester(requester.address, rrpAddress);
  const addresses = require("../../frontend/src/utils/addresses.json");
  addresses[chainId] = requester.address;
  fs.writeFileSync(
    "../frontend/src/utils/addresses.json",
    JSON.stringify(addresses)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
