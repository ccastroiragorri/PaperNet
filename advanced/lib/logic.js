/**
* @file   This files defines the org.papernet contract
* @author Carlos Castro
* @since  07.03.2019
*/

'use strict';

/**
* Make a buy transaction on a paper
* @fires trade
* @param {org.papernet.buy} data
* @transaction
*/
async function buy(data) {
  //get balance from firm
  const bbuyer = data.newOwner.balance;
  const bseller = data.id.owner.balance;
  //get price
  const tprice = data.price
  //new balance for firm
  data.newOwner.balance = bbuyer - tprice;
  data.id.owner.balance = bseller + tprice;
  //change ownership
  const PreOwner= data.id.owner;
  data.id.owner= data.newOwner; 
  //change state
  if (data.id.state!="trading")
    data.id.state='trading'
  // 1. update asset registry
  let assetRegistry = await getAssetRegistry('org.papernet.paper');
  await assetRegistry.update(data.id);
  // 2. update researcher registry
  let participantRegistry = await getParticipantRegistry('org.papernet.firm');
  await participantRegistry.update(data.newOwner);
  await participantRegistry.update(PreOwner);
    // Emit an event for the modified participant wallet.
  let event = getFactory().newEvent('org.papernet', 'trade');
  event.oldOwner = PreOwner;
  event.oldOwnerOldBalance=bseller;
  event.oldOwnerNewBalance=bseller + tprice; 
  event.newOwner = data.newOwner;
  event.newOwnerOldBalance=bbuyer;
  event.newOwnerNewBalance = bbuyer -tprice;
  emit(event);
}

/**
* Make a redeem transaction on a paper
* @fires trade
* @param {org.papernet.redeem} data
* @transaction
*/
async function redeem(data) {
  //change state
  data.id.state='redeemed'
  //get balance from firm
  const bbuyer = data.id.issuer.balance;
  const bseller = data.id.owner.balance;
  //get face value and coupon
  const rate = data.coupon/100;
  const face = data.id.faceValue;
  //new balance for firm
  data.id.issuer.balance = bbuyer - face*(1+rate);
  data.id.owner.balance = bseller + face*(1+rate);
  //change ownership
  const PreOwner= data.id.owner;
  const PostOwner= data.id.issuer;
  // 1. update asset registry
  let assetRegistry = await getAssetRegistry('org.papernet.paper');
  await assetRegistry.update(data.id);
  let participantRegistry = await getParticipantRegistry('org.papernet.firm');
  await participantRegistry.update(PostOwner);
  await participantRegistry.update(PreOwner);
    // Emit an event for the modified participant wallet.
  let event = getFactory().newEvent('org.papernet', 'trade');
  event.oldOwner = PreOwner;
  event.oldOwnerOldBalance=bseller;
  event.oldOwnerNewBalance=bseller + face*(1+rate); 
  event.newOwner = PostOwner;
  event.newOwnerOldBalance=bbuyer;
  event.newOwnerNewBalance = bbuyer - face*(1+rate);
  emit(event);
}