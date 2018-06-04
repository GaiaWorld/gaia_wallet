import { bitcore } from "../thirdparty/bitcore-lib";
import { Mnemonic } from '../thirdparty/bip39';
import { WORDLISTS } from '../thirdparty/wordlist';
import { Cipher } from '../crypto/cipher';

const HDWallet = bitcore.HDPrivateKey;
const UnspentOutput = bitcore.Transaction.UnspentOutput;
const Transaction = bitcore.Transaction;

export class UTXO {
    txid: string; // transaction hash that generate this utxo
    vout: number; // previous output index
    address: string; // who own this utxo
    scriptPubKey: string; // public key hash
    amount: number // BTC unit
}

export class Output {
    toAddr: string;
    amount: number;
    chgAddr: string;
}

export class BTCWallet {
    // funds that have at least `MIN_CONFIRMATION`
    public balance: number;

    // how many receving addresses have been used since last time
    public totalUsedReceivingAddress: number;

    // used to retreive all the utxos of this wallet
    public rootXpub: string;

    // dedicated for HD wallet, should be encrypted
    private _rootXpriv: string;

    // m/bip_number/coin_type/account/internal_or_external/index
    static BIP44_BTC_TESTNET_BASE_PATH = "m/44'/1'/0'/0/";
    static BIP44_BTC_MAINNET_BASE_PATH = "m/44'/0'/0'/0/";


    // most look ahead addresses
    static GAP_LIMIT = 10;

    // minimum confirmations
    static MIN_CONFIRMATION = 6;

    constructor() {
        this.balance = 0;
        this.totalUsedReceivingAddress = 0;
    }

    getBlance(): number {
        return this.balance;
    }
    setBlance(balance: number): void {
        this.balance = balance;
    }

    isHDWallet(): boolean {
        if(this._rootXpriv.length !== 0) {
            return true;
        }

        return false;
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
    static fromMnemonic(mnemonic: string, network: "mainnet" | "testnet", lang: "english" | "chinese_simplified" | "chinese_traditional",passphrase?: string): BTCWallet {
        let mn = new Mnemonic(lang);
        passphrase = passphrase || "";        

        if(!mn.check(mnemonic)) {
            throw new Error("Invalid Mnemonic words!");
        }
        let seed = mn.toSeed(mnemonic, passphrase)

        let hdpriv = HDWallet.fromSeed(seed, network);
        let btcwallt = new BTCWallet();
        
        btcwallt._rootXpriv = hdpriv.toString();
        btcwallt.rootXpub = hdpriv.xpubkey;

        return btcwallt;
    }

    static fromWIF(wif: string): BTCWallet {
        // TODO
        return new BTCWallet();
    }

    derive(index: number): string {
        return this.privateKeyOf(index).toAddress().toString();
    }

    private privateKeyOf(index: number): any {
        let path: string;
        let parent = new HDWallet(this._rootXpriv);

        if(parent.network.name === "testnet") {
            path = BTCWallet.BIP44_BTC_TESTNET_BASE_PATH + index;
        } else if(parent.network.name === "livenet") {
            path = BTCWallet.BIP44_BTC_MAINNET_BASE_PATH + index;
        }

        return parent.derive(path).privateKey;
    }

    signRawTransaction(input: UTXO | UTXO[], output: Output, index: number): string {
        let utxo = UnspentOutput.fromObject(input);
        let tx = Transaction()
            .from(utxo)
            .to(output.toAddr, output.amount)
            .change(output.chgAddr)
            .sign(this.privateKeyOf(index));

        return tx.toString("hex");
    }

    composeUTXOs

    scanAddress() {

    }

    calcFees() {

    }

    getUTXOForUsedAddress() {

    }
}