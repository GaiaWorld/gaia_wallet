export class Api {
    static BASE_URL = 'https://api.blockcypher.com';
    static ESTIMATION_FEE_URL = 'https://bitcoinfees.earn.com/api/v1/fees/recommended';

    constructor() {

    }

    async getAddrInfo(address: string, unspentOnly = false): Promise<any> {
        let path = unspentOnly ? Api.BASE_URL + `/v1/btc/test3/addrs/${address}?unspentOnly=true`:
                                Api.BASE_URL + `/v1/btc/test3/addrs/${address}`;
        try {
            let  response = await fetch(path);
            let data = await response.json();
            return data;
        } catch (e) {
            Promise.reject(e);
        }
    }

    async sendRawTransaction(rawHexString: string): Promise<any> {
        try {
            let path = Api.BASE_URL + '/v1/btc/test3/txs/push';
            let response = await fetch(path, {
                method: 'POST',
                body: JSON.stringify({"tx": rawHexString})
            });
            let data = await response.json();
            return data;
        } catch(e) {
            Promise.reject(e);
        }
    }

    async getTxInfo(txHash: string): Promise<any> {
        let path = Api.BASE_URL + `/v1/btc/test3/txs/${txHash}`;

        try {
            let response = await fetch(path);
            let data = await response.json();
            return data;
        } catch(e) {
            Promise.reject(e);
        }
    }

    async feePerByte(): Promise<any> {
        try {
            let response = await fetch(Api.ESTIMATION_FEE_URL);
            let data = await response.json();
            return data;
        } catch(e) {
            Promise.reject(e);
        }
    }
}
