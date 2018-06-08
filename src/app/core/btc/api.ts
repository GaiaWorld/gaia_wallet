export class Api {
    static BASE_URL = 'https://api.blockcypher.com';

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
}

