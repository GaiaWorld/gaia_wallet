/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { login, setUrl } from '../../pi/net/ui/con_mgr';
import { open, popNew } from '../../pi/ui/root';
import { Forelet } from '../../pi/widget/forelet';
import { addWidget } from '../../pi/widget/util';
import { getLocalStorage } from '../utils/tools'
import { BTCWallet, UTXO, Output } from '../core/btc/wallet';
// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export const run = (): void => {
	addWidget(document.body, 'pi-ui-root');
	popNew('app-view-app');
	//popNew('app-view-test-test');
	//popNew('app-view-wallet-walletCreate-walletCreate');	// popNew('app-view-application-home');
	// popNew('app-view-groupwallet-groupwallet');
	// popNew('app-view-financialManagement-home');
	 //popNew('app-view-mine-changePassword-changePassword1');

	// let words = "void chuckle melody have hood veteran face wine cat control thumb wheel admit mammal cinnamon"
	// let w = BTCWallet.fromMnemonic(words, "testnet", "english");
	// let utxo = {
	// 	"txid" : "14067431e8c7f685a68c89c0428fba53705a7d804ea984d60baf899dec7a0121",
	// 	"vout" : 0,
	// 	"address" : "mzJ1AAKQpMj5eaCL3b4oNuSantXmVgz2tM",
	// 	"scriptPubKey" : "76a914cdf75f817ef312950719f6fa1b947e75ab792d2688ac",
	// 	"amount" : 0.275
	// };
	// let output = {
	// 	toAddr: "n38uMS8K3sM1PfypMd55YH8U4pUrSF4Jqo",
	// 	amount: 100000,
	// 	chgAddr: "mzJ1AAKQpMj5eaCL3b4oNuSantXmVgz2tM"
	// }
	// console.log(w.derive(0));
	// console.log(w.derive(1));
	// console.log(w.derive(2))
	// console.log(w.signRawTransaction(utxo, output,  0));

	// console.log(BTCWallet.generate("", 128, "testnet", "english", ""))

	// console.log(w)
	// console.log(w.derive(0))
	// console.log(w.exportWIFOf(4));

	// console.log(w.toSeed("english", words, ""))
};

// ============================== 立即执行
