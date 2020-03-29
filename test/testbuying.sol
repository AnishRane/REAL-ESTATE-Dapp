pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Buying.sol";


contract TestBuying
{
Buying sale = Buying(DeployedAddresses.Buying());
uint expecteditemId = 5;
 address expectedBuyer = address(this);
function testUserCanBuy() public {
  uint returnedId = sale.buy(expecteditemId);

  Assert.equal(returnedId, expecteditemId, "sale of the expected item should match what is returned.");
}
function testGetBuyerAddressByitemId() public {
  address customer = sale.buyers(expecteditemId);

  Assert.equal(customer, expectedBuyer, "Owner of the expected item should be this contract");
}
function testGetBuyerAddressByitemIdInArray() public {
  // Store adopters in memory rather than contract's storage
  address[16] memory buyers = sale.getBuyers();

  Assert.equal(buyers[expecteditemId], expectedBuyer, "Owner of the expected  should be this contract");
}



}