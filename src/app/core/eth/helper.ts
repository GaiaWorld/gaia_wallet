import { Web3 } from "../thirdparty/web3.min";

const web3 = new Web3();

/*
 * All the helper functions are wrapped from web3.js
 * Docs: https://github.com/ethereum/wiki/wiki/JavaScript-API
 * 
 */
export function toWei(amt: number | string, unit: string): string | number {
    return web3.toWei(amt, unit);
}

export function fromWei(amt: number | string, unit: string): string | number {
    return web3.fromWei(amt, unit);
}

export function isAddress(hexString: string): boolean {
    return web3.isAddress();
}

export function toAscii(hexString: string): string {
    return web3.toAscii(hexString);
}

export function fromAscii(str: string, padding?: number): string {
    return web3.fromAscii(str, padding);
}