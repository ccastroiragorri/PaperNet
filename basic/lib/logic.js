/**
* @file   This files defines the org.papernet contract
* @author Carlos Castro
* @since  07.03.2019
*/

'use strict';

/**
* Make a buy transaction on a paper
* @param {org.papernet.buy} data
* @transaction
*/
async function buy(data) {
  //change ownership
  data.id.owner=data.newOwner 
  //change state
  if (data.id.state!="trading")
    data.id.state='trading'
  // 1. update asset registry
  let assetRegistry = await getAssetRegistry('org.papernet.paper');
  await assetRegistry.update(data.id);
}

/**
* Make a buy transaction on a paper
* @param {org.papernet.redeem} data
* @transaction
*/
async function redeem(data) {
  //change state
  data.id.state='redeemed'
  // 1. update asset registry
  let assetRegistry = await getAssetRegistry('org.papernet.paper');
  await assetRegistry.update(data.id);
}