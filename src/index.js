import * as StellarSdk from 'stellar-sdk';

export default class XlmProvider {
    constructor(network) {
        if (network === 'mainnet') {
            this.server = new StellarSdk.Server('https://horizon.stellar.org');
            StellarSdk.Network.usePublicNetwork();

        } else {
            this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
            StellarSdk.Network.useTestNetwork();

        }


    }

    createPrivateKey() {
        let pair = StellarSdk.Keypair.random();
        return pair.secret()

    }

    createPublicKey(PrivateKey) {
        let sourceKeyPair = StellarSdk.Keypair.fromSecret(PrivateKey);
        return sourceKeyPair.publicKey();


    }

    getBalance(address) {
        return new Promise((resolve, reject) => {
            this.server.loadAccount(address).then(() => {
                this.server.accounts()
                    .accountId(address)
                    .call()
                    .then((accountResult) => {
                        resolve(accountResult.balances[0].balance)
                    })
                    .catch((err) => {
                        resolve(0)
                    })
            }).catch(() => {
                resolve(0)
            })

        })

    }

    submitTransaction(transaction, server) {
        return new Promise((resolve, reject) => {
            server.submitTransaction(transaction)
                .then(transactionResult => {
                    resolve(transactionResult)
                })
                .catch(err => {
                    console.log('An error has occured:');
                    reject(err);
                });
        });

    }

    sendXLM(to, amount, secret) {

        let sourceKeypair = StellarSdk.Keypair.fromSecret(secret);
        let sourcePublicKey = sourceKeypair.publicKey();
        let transaction;

        return new Promise((resolve, reject) => {
            this.server.loadAccount(sourcePublicKey)
                .then(account => {
                    this.server.loadAccount(to)
                        .then(() => {
                            transaction = new StellarSdk.TransactionBuilder(account)
                                .addOperation(StellarSdk.Operation.payment({
                                    destination: to,
                                    asset: StellarSdk.Asset.native(),
                                    amount: amount
                                }))
                                .build();
                            transaction.sign(sourceKeypair);
                            this.submitTransaction(transaction, this.server).then(resTx => {
                                resolve(resTx)

                            })

                        })
                        .catch(() => {
                            transaction = new StellarSdk.TransactionBuilder(account)
                                .addOperation(StellarSdk.Operation.createAccount({
                                    destination: to,
                                    asset: StellarSdk.Asset.native(),
                                    startingBalance: amount
                                }))
                                .build();
                            transaction.sign(sourceKeypair);
                            this.submitTransaction(transaction, this.server).then(resTx => {
                                resolve(resTx)

                            })
                        })


                }).catch((err) => {
                reject(err);

            })
        })


    }
}