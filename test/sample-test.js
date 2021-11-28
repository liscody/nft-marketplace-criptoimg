const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CIMarket", function () {
  it("Should mint and trade NFTs", async function () {
    const Market = await ethers.getContractFactory('CIMarket');
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory('NFT');
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');
    
    //test for minting
    await nft.mintToken('https-t1');
    await nft.mintToken('https-t2');

    await market.makeMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice});
    await market.makeMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice});

    // test for different addresses from different users - test accounts
    // return an array of however many addresses

    const [_, buyerAddress] = await ethers.getSigners();

    // create a market sale with address, id and price 

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
      value: auctionPrice
    });

    const items = await market.fetchMarketTokens();

    // test uot all the items 
    console.log("items", items);
  });
});
