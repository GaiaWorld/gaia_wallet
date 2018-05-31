import { bitcore } from "../thirdparty/bitcore-lib";
import { Mnemonic } from '../thirdparty/bip39';
import { WORDLISTS } from '../thirdparty/wordlist';
import { Cipher } from '../crypto/cipher';

export class BTCWallet {
    // funds that have at least `MIN_CONFIRMATION`
    public balance: number;

    // how many receving addresses have been used since last time
    public totalUsedReceivingAddress: number;

    public xpub: string;

    // dedicated for HD wallet
    private _rootKey: string | undefined;

    // m/bip_number/coin_type/account/internal_or_external/index
    static BIP44_DERIVE_BASE_PATH = "m/44'/0'/0'/0";

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
        if(this._rootKey !== undefined) {
            return true;
        }

        return false;
    }

    static fromMnemonic(mnemonic: string): BTCWallet {
        return new BTCWallet();
    }

    static fromWIF(wif: string): BTCWallet {
        return new BTCWallet();
    }

    derive(index: number) {

    }

    scanAddress() {

    }

    calcFees() {

    }

    getUTXOForUsedAddress() {

    }
}