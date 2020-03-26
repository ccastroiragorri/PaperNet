# Comercial paper Tutorial

This is a summary of the [Comercial Paper Tutorial](https://hyperledger-fabric.readthedocs.io/en/release-1.4/tutorial/commercial_paper.html)
Note that this tutorial correspond to FABRIC release 1.4 for other releases, in particular 2.0 there are changes to the tutorial.

## 1. start network using basic-network
```
./start.sh
```
inspect the network
```
docker network inspect net_basic
```
## 2. Working as MagnetoCorp

### 2.1. Monitor the containers

Open a new window in the fabric-samples directory, and locate and run the monitordocker.sh script to start the logspout tool for the PaperNet docker containers associated with the docker network net_basic: 
cd commercial-paper/organization/magnetocorp/configuration/cli/

```
./monitordocker.sh net_basic
```
This will allow you to see the effects on the containers of the following procedures: create state database, intall chaincode,...

### 2.2. Administrator to interact with the network.

let’s start another terminal window which will allow the MagnetoCorp administrator to interact with the network.
```
docker-compose -f docker-compose.yml up -d cliMagnetoCorp
```
The MagnetoCorp administrator will use the command line in container hyperledger/fabric-tools (IMAGE) - cliMagnetoCorp (NAMES) to interact with PaperNet. Notice also the logspout container (IMAGE and NAMES) is capturing the output of all other docker containers for the monitordocker.sh command.

### 2.3. Smart Contracts

Open a new terminal window to represent a MagnetoCorp developer and change to the directory that contains MagnetoCorp’s copy of the smart contract to view it with your chosen editor (VS Code in this tutorial): 
cd commercial-paper/organization/magnetocorp/contract/lib/papercontract.js

Look at the native fabric code of 'papercontract.js'

Before papercontract can be invoked by applications, it must be installed onto the appropriate peer nodes in PaperNet. MagnetoCorp and DigiBank administrators are able to install papercontract onto peers over which they respectively have authority.

The MagnetoCorp administrator uses the peer chaincode install command to copy the papercontract smart contract from their local machine’s file system to the file system within the target peer’s docker container.

Let’s now install 'papercontract.js' as the MagnetoCorp administrator. In the MagnetoCorp administrator’s command window,use the docker exec command to run the peer chaincode install command in the cliMagnetCorp container:

```
docker exec cliMagnetoCorp peer chaincode install -n papercontract -v 0 -p /opt/gopath/src/github.com/contract -l node
```

Now that papercontract chaincode containing the CommercialPaper smart contract is installed on the required PaperNet peers, an administrator can make it available to different network channels, so that it can be invoked by applications connected to those channels. The channel (mychannel) was created when we bootstrapped the network (./start.sh)
The MagnetoCorp administrator uses the peer chaincode instantiate command to instantiate papercontract on mychannel:

```
docker exec cliMagnetoCorp peer chaincode instantiate -n papercontract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"
```
## 3. Working as Isabella (issuer at MagnetoCorp)

Because the issue application submits transactions on behalf of Isabella, it starts by retrieving Isabella’s X.509 certificate from her wallet, which might be stored on the local file system or a Hardware Security Module HSM. The issue application is then able to utilize the gateway to submit transactions on the channel. The Hyperledger Fabric SDK provides a gateway abstraction so that applications can focus on application logic while delegating network interaction to the gateway. Gateways and wallets make it straightforward to write Hyperledger Fabric applications.

Issue applications are located:
cd commercial-paper/organization/magnetocorp/application/

### 3.1. Load Isabella's identity to the wallet

'addToWallet.js' is the program that Isabella is going to use to load her identity into her wallet, and 'issue.js' will use this identity to create commercial paper 00001 on behalf of MagnetoCorp by invoking papercontract.

Look at the native fabric code of 'addToWallet.js' and 'issue.js'

Important, 'issue.js' has dependencies; these packages have to be downloaded from npm to the local file system using the npm install command. Navigate to cd commercial-paper/organization/magnetocorp/application/

```
npm install
```
In Isabella’s terminal window, run the addToWallet.js program to add identity information to her wallet:
```
node addToWallet.js
```
Isabella can store multiple identities in her wallet, though in our example, she only uses one – User1@org.example.com. This identity is currently associated with the basic network, rather than a more realistic PaperNet configuration – we’ll update this tutorial soon.

addToWallet.js is a simple file-copying program which you can examine at your leisure. It moves an identity from the basic network sample to Isabella’s wallet. Let’s focus on the result of this program – the contents of the wallet which will be used to submit transactions to PaperNet:

### 3.2.  Issue the commercial paper

Isabella can now use issue.js to submit a transaction that will issue MagnetoCorp commercial paper 00001:
```
node issue.js
```

## 4. Working as DigiBank (buy paper and redeem)

### 4.1 

Digibank end users will use applications which invoke the same smart contract as MagnetoCorp applications, though they contain Digibank-specific logic and configuration. It’s the smart contract which captures the shared business process, and the ledger which holds the shared business data, no matter which applications call them, the contract for Digibank is contained in:
cd commercial-paper/organization/digibank/configuration/cli/

let’s start another terminal window which will allow the Digibank administrator to interact with the network. 
```
docker-compose -f docker-compose.yml up -d cliDigiBank
```
The Digibank administrator will use the command line in container hyperledger/fabric-tools (IMAGE) - cliDigiBank (NAMES) to interact with PaperNet. 

### 4.2.  Buy application

Open a separate terminal window for Balaji. In fabric-samples, change to the DigiBank application directory that contains the application, buy.js, and open it with your editor:

cd commercial-paper/organization/digibank/application/

Look at the native fabric code of 'buy.js'

Like MagnetoCorp, Digibank must the install the required application packages using the npm install command, and again, this make take a short time to complete.

```
npm install
```
In Balaji’s terminal window, run the addToWallet.js program to add identity information to her wallet:
```
node addToWallet.js
```
Balaji can now use buy.js to submit a transaction that will transfer ownership of MagnetoCorp commercial paper 00001 to DigiBank.

```
node buy.js
```
### 4.3.  Redeem application

The final transaction in the lifecycle of commercial paper 00001 is for DigiBank to redeem it with MagnetoCorp. Balaji uses redeem.js to submit a transaction to perform the redeem logic within the smart contract.

```
node redeem.js
```

OPEN QUESTION how can I take a look at the wallet?


### 5. Look at last block in the Blockchain

```
docker exec peer0.org1.example.com peer channel getinfo -c mychannel
```

## Cleanup

Stop Fabric
cd fabric/fabric-samples/basic-network

```
./stop.sh
```

Stop containers by force
```
docker stop [number]
```
```
./teardown.sh
```