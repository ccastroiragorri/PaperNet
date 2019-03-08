# PaperNet

This examples implemente the process of issuing, trading and redeeming comercial paper and is based on the sample case 
in [Fabric 1.4 documentation](https://hyperledger-fabric.readthedocs.io/en/release-1.4/tutorial/commercial_paper.html).

This business network defines:

 **Participant**
`firm`

**Asset**
`paper`

**Transaction**
`issue`
`buy`
`redeem`

We first create the `firm`s involved in the lifecycle of the comercial paper: MagnetoCorp, DigiBank, BigFund and HedgeMatic.

Create four `firm` participant:

```json
{
  "$class": "org.papernet.firm",
  "name": "MagnetoCorp"
}
```

```json
{
  "$class": "org.papernet.firm",
  "name": "DigiBank"
}
```
```json
{
  "$class": "org.papernet.firm",
  "name": "BigFund"
}
```
```json
{
  "$class": "org.papernet.firm",
  "name": "HedgeMatic"
}
```

The lifecicle of the comercial paper begins when a paper 00001 is issued by MagnetoCorp on May 31:

```json
{
  "$class": "org.papernet.paper",
  "id": "00001",
  "issuer": "resource:org.papernet.firm#MagnetoCorp",
  "owner": "resource:org.papernet.firm#MagnetoCorp",
  "issueDate": "2020-05-31T17:00:00.916Z",
  "maturityDate": "2020-11-30T19:00:00.916Z",
  "faceValue": 5000000,
  "state": "issued"
}
```

Shortly after issuance, the paper is bought by DigiBank by invoking the `buy` transaction,

```json
{
  "$class": "org.papernet.buy",
  "id": "resource:org.papernet.paper#00001",
  "newOwner": "resource:org.papernet.firm#DigiBank",
  "price": 4940000,
  "purchaseTime": "2020-05-31T17:00:00.849Z"
}
```
This transaction changes ownership and the state of the paper from issued to trading.

The paper can be bought and sold many times using the same transaction type `buy`,

```json
{
  "$class": "org.papernet.buy",
  "id": "resource:org.papernet.paper#00001",
  "newOwner": "resource:org.papernet.firm#BigFund",
  "price": 4930000,
  "purchaseTime": "2020-06-02T17:00:00.849Z"
}
```

```json
{
  "$class": "org.papernet.buy",
  "id": "resource:org.papernet.paper#00001",
  "newOwner": "resource:org.papernet.firm#HedgeMatic",
  "price": 4900000,
  "purchaseTime": "2020-06-03T17:00:00.849Z"
}
```
Finally the `redeem` transaction for paper 00001 represents the end of its lifecycle. 

```json
{
  "$class": "org.papernet.redeem",
  "id": "resource:org.papernet.paper#00001",
  "redeemTime": "2020-11-30T20:39:10.142Z"
}
```


