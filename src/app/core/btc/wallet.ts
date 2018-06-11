import { bitcore } from "../thirdparty/bitcore-lib";
import { Mnemonic } from '../thirdparty/bip39';
import { Cipher } from '../crypto/cipher';
import { Api } from './api';

const HDWallet = bitcore.HDPrivateKey;
const UnspentOutput = bitcore.Transaction.UnspentOutput;
const Transaction = bitcore.Transaction;
const PrivateKey = bitcore.PrivateKey;
const Script = bitcore.Script;
const Unit = bitcore.Unit;

const cipher = new Cipher();


type LANGUAGE = "english" | "chinese_simplified" | "chinese_traditional";
type NETWORK = "mainnet" | "testnet";
type PRIORITY = "high" | "medium" | "low";

export class UTXO {
    txid: string; // transaction hash that generate this utxo
    vout: number; // previous output index
    address: string; // who own this utxo
    scriptPubKey: string; // public key hash
    amount: number // BTC unit
    confirmations?: number;
}

export class Output {
    toAddr: string;
    amount: number;
    chgAddr?: string;
}

export class BTCWallet {
    // funds that have at least `MIN_CONFIRMATION`
    public balance: number;

    public usedAdresses = {};

    // used to retreive all the utxos of this wallet
    public rootXpub: string;

    // dedicated for HD wallet, should be encrypted
    private _rootXpriv: string;
    private _mnemonics: string;

    private _api: Api;

    private _isLocked = false;

    // m/bip_number/coin_type/account/internal_or_external/index, we don't use change address
    static BIP44_BTC_TESTNET_BASE_PATH = "m/44'/1'/0'/0/";
    static BIP44_BTC_MAINNET_BASE_PATH = "m/44'/0'/0'/0/";


    // most look ahead addresses
    static GAP_LIMIT = 3;

    // minimum confirmations
    static MIN_CONFIRMATIONS = 6;

    static SAFELOW_FEE = 2;
    static HIGHEST_FEE = 10;

    constructor() {
        this.balance = 0.26;
        this._api = new Api();
    }

    getBlance(): number {
        return this.balance;
    }
    setBlance(balance: number): void {
        this.balance = balance;
    }
    
    lock(passwd: string): void {
        if(this._isLocked === false) {
            this._rootXpriv = cipher.encrypt(passwd, this._rootXpriv);
            this._mnemonics = cipher.encrypt(passwd, this._mnemonics);
            this._isLocked = true;
        }
    }

    unlock(passwd: string): void {
        if(this._isLocked === true) {
            this._rootXpriv = cipher.decrypt(passwd, this._rootXpriv);
            this._mnemonics = cipher.decrypt(passwd, this._mnemonics);
            this._isLocked = false;
        }
    }

    /**
     * Generate an HD wallet from scratch
     * 
     * @static
     * @param {string} passwd Password used to encrypt secrets
     * @param {number} strength Default to 128, must be a divided by 32
     * @param {NETWORK} network Network idenitifer
     * @param {LANGUAGE} lang Mnenomic language
     * @param {string} [passphrase] Salt used to provide extra credentials to generate seed, default to null
     * @returns {BTCWallet} 
     * @memberof BTCWallet
     */
    static generate(passwd: string, strength: number, network: NETWORK, lang: LANGUAGE, passphrase?: string): BTCWallet {
        let mn = new Mnemonic(lang);
        passphrase = passphrase || "";
        strength = strength || 128;

        // TODO: check passwd

        let mnemonics = mn.generate(strength);
        if(!mn.check(mnemonics)) {
            throw new Error("Invalid Mnemonic words!");
        }
        let seed = mn.toSeed(mnemonics, passphrase);
        let hdpriv = HDWallet.fromSeed(seed, network);

        let btcwallet = new BTCWallet();
        btcwallet._rootXpriv = hdpriv.toString();
        btcwallet.rootXpub = hdpriv.xpubkey;
        // TODO: encrypt
        btcwallet._mnemonics = mnemonics;

        return btcwallet;
    }

    /**
     * Build HD wallet from mnemonic words
     * 
     * @static
     * @param {string} mnemonic Mnemonic words
     * @param {("mainnet" | "testnet")} network Which network to use
     * @param {("english" | "chinese_simplified" | "chinese_traditional")} lang Language
     * @param {string} [passphrase] Passphrase used as salt
     * @returns {BTCWallet} 
     * @memberof BTCWallet
     */
    static fromMnemonic(passwd: string, mnemonic: string, network: NETWORK, lang: LANGUAGE, passphrase?: string): BTCWallet {
        let mn = new Mnemonic(lang);
        passphrase = passphrase || "";

        if(!mn.check(mnemonic)) {
            throw new Error("Invalid Mnemonic words!");
        }
        let seed = mn.toSeed(mnemonic, passphrase)

        let hdpriv = HDWallet.fromSeed(seed, network);
        let btcwallt = new BTCWallet();
        
        btcwallt._rootXpriv = hdpriv.toString();
        btcwallt._mnemonics = mnemonic;
        btcwallt.rootXpub = hdpriv.xpubkey;

        btcwallt.lock(passwd);

        return btcwallt;
    }

    exportMnemonics(): string {
        if(this._isLocked === true) {
            throw new Error("You need to unlock wallet first!");
        }
        return this._mnemonics;
    }

    /**
     * Export WIF format private key for specified index
     * 
     * @param {number} index 
     * @returns {string} 
     * @memberof BTCWallet
     */
    exportWIFOf(index: number): string {
        return this._privateKeyOf(index).toWIF();
    }

    derive(index: number): string {
        return this._privateKeyOf(index).toAddress().toString();
    }

    private _privateKeyOf(index: number): any {
        if(this._isLocked === true) {
            throw new Error("You need to unlock wallet first!");
        }

        let path: string;
        let parent = new HDWallet(this._rootXpriv);

        if(parent.network.name === "testnet") {
            path = BTCWallet.BIP44_BTC_TESTNET_BASE_PATH + index;
        } else if(parent.network.name === "livenet") {
            path = BTCWallet.BIP44_BTC_MAINNET_BASE_PATH + index;
        } else {
            throw new Error("Unexpected network name!");
        }

        return parent.derive(path).privateKey;
    }

    /**
     * Spend btc from all available utxos, using index 0 address as the default
     * change address.
     * 
     * Our spend policies are:
     * 
     * 1. utxo must at least `MIN_CONFIRMATIONS`
     * 2. greedy algorithm to choose the sufficient balances
     * 
     * TODO: design a smarter stratagy (http://bitcoinfees.com/)
     *
     * @param {Output} output Specify `toAddr`, `amount` and `chgaddr`
     * @returns {Promise<string>} Transaction hash of this transaction
     * @memberof BTCWallet
     */
    async spend(output: Output, priority: PRIORITY): Promise<string> {
        if(output.amount >= this.balance) {
            throw new Error("Insufficient balance!");
        }

        // TODO: check error
        let fee = await this._api.feePerByte()
        switch(priority) {
            case "high":
                fee = fee.fastestFee;
                break;
            case "medium":
                fee = fee.halfHourFee;
                break;
            case "low":
                fee = fee.hourFee;
                break;
        }

        if(fee < BTCWallet.SAFELOW_FEE || fee > BTCWallet.HIGHEST_FEE) {
            throw new Error("Abnormal fee rate");
        }

        let utxos = await this.getUnspentOutputs(BTCWallet.MIN_CONFIRMATIONS);
        utxos.sort((a, b) => a.amount - b.amount);

        let collected = [];
        let accumlated = 0;
        for(let i = 0; i < utxos.length; i++) {
            accumlated += utxos[i].amount;
            collected.push(utxos[i]);
            if(accumlated > output.amount) {
                break;
            }
        }

        let keySet = [];
        for(let i = 0; i < collected.length; i++) {
            keySet.push(this._privateKeyOf(this.usedAdresses[collected[i].address]));
        }

        console.log("collected: ", collected)
        console.log("accumlated: ", accumlated)
        console.log("keyset length: ", keySet.length)

        output.amount = Unit.fromBTC(output.amount).toSatoshis();
        let rawTx = new Transaction().feePerKb(fee * 1000)
            .from(collected)
            .to(output.toAddr, output.amount)
            .change(output.chgAddr === undefined ? this.derive(0) : output.chgAddr)
            .sign(keySet)

        console.log("rawTx:", rawTx)

        let serialized = rawTx.serialize(true);
        console.log("serialized:", serialized)

        let res = await this._api.sendRawTransaction(serialized);
        if(res === undefined || res.hasOwnProperty('error')) {
            throw new Error(res.error);
        }
        console.log("txHash: ",res.tx.hash);
        return res.tx.hash;
    }

    private _p2pkh(address: string): any {
        return Script.buildPublicKeyHashOut(address);
    }

    async getSafeBalance(): Promise<number> {
        let sum = 0;
        let utxos = await this.getUnspentOutputs(BTCWallet.MIN_CONFIRMATIONS);
        for(let i = 0; i < utxos.length; i++) {
            sum += utxos[i].amount;
        }

        return sum;
    }

    async getUnspentOutputs(confirmations = 1): Promise<UTXO[]> {
        let utxos = [];
        let used = await this.scanUsedAddress();
        for(let i = 0; i < used; i++) {
            let address = this.derive(i);
            let addrinfo = await this._api.getAddrInfo(address, true);
            if(addrinfo === undefined || addrinfo.hasOwnProperty('error')) {
                throw new Error("Response error!");
            }
            if(addrinfo.final_balance !==0 && addrinfo.txrefs.length !== 0) {
                let utxo = addrinfo.txrefs;
                for(let j = 0; j < utxo.length; j++) {
                    if(utxo[j].confirmations >= confirmations) {
                        utxos.push({
                            "txid": utxo[j].tx_hash,
                            "vout": utxo[j].tx_output_n,
                            "address": address,
                            "scriptPubKey": this._p2pkh(address).toHex(),
                            "amount": Unit.fromSatoshis(utxo[j].value).BTC,
                            "confirmations": utxo[j].confirmations
                        })
                    }
                }
            }
        }

        return utxos;
    }

    async scanUsedAddress(): Promise<number> {
        let count = 0;
        let i     = 0;
        for(i = 0; ; i++) {
            let res = await this._api.getAddrInfo(this.derive(i));
            if(res === undefined || res.hasOwnProperty('error')) {
                throw new Error("Response error!");
            }
            if(res.total_received === 0 && res.total_sent === 0) {
                count = count + 1;
            } else {
                this.usedAdresses[res.address] = i;
                count = 0;
            }

            if(count > BTCWallet.GAP_LIMIT) {
                break;
            }
        }

        return i - BTCWallet.GAP_LIMIT;
    }
}