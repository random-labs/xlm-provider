#Lumen provider

Makes it easy to work with a bitcoin wallet.

## Install ##
``` bash
npm i --save xlm-provider
```
## Include ##
```
var XlmProvider = require("xlm-provider").default;
```
or for ES-2015
```
import XlmProvider from 'xlm-provider'
```

## Initialize ##
```javascript
const xlmProvider = new XlmProvider('testnet'); // or mainnet
```
## Usage ##

#### Create private key ####
```javascript
const privateKey = xlmProvider.createPrivateKey();
```
#### Create public key ####
```javascript
const publicKey = xlmProvider.createPublicKey(privateKey);
```

#### Get balance ####
```javascript
const balance = xlmProvider.getBalance(publicKey);
```
#### Create transaction ####
```javascript
xlmProvider.sendXLM(to, amount, privateKey).then(transaction=>{
    console.log(transaction);
});
```

```
to - address of the recipient
amount - amount in btc
privateKey - your private key
```

