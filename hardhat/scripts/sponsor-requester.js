require("dotenv").config();
const { ethers } = require("hardhat");
const airnodeAbi = require("@api3/airnode-protocol").AirnodeRrpFactory.abi;

async function sponsorRequester(requesterAddress, rrpAddress) {
  console.log(`Sponsoring Requester...`);

  console.log("getting RRP");
  const airnodeRrp = await ethers.getContractAt(airnodeAbi, rrpAddress);
  const tx = await airnodeRrp.setSponsorshipStatus(requesterAddress, true);
  await tx.wait();
  console.log(`Sponsored Requester: ${requesterAddress}`);
}

module.exports = {
  sponsorRequester,
};
