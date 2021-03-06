/**
 * 分享片段给好友
 */
import { ShareToPlatforms } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { DataCenter } from '../../../store/dataCenter';

interface Props {
    shares: string[];
}
export class WalletCreate extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }
    public init() {
        this.state = {
            totalSteps: DataCenter.MAX_SHARE_LEN,
            part: this.props.shares[0],// 分享内容
            step: 1// 分享第几个人
        };
    }
    public back() {
        this.ok && this.ok();
    }
    public shareBtnClick() {
        // this.state.step++;
        // this.state.part = this.props.shares[this.state.step - 1];
        // this.paint();

        // // 分享完成
        // if (this.state.step > this.state.totalSteps) {
        //     popNew('app-components-message-message', { itype: 'success', content: '分享成功', center: true });
        //     this.ok && this.ok();
        // }

        // tslint:disable-next-line:no-this-assignment
        const thisObj = this;
        popNew('app-components-share-share', { text: this.state.part, shareType: ShareToPlatforms.TYPE_TEXT }, () => {
            // 分享完成后
            thisObj.state.step++;
            thisObj.state.part = thisObj.props.shares[thisObj.state.step - 1];
            thisObj.paint();

            // 分享完成
            if (thisObj.state.step > thisObj.state.totalSteps) {
                popNew('app-components-message-message', { itype: 'success', content: '分享成功', center: true });
                thisObj.ok && thisObj.ok();
            }
        }, () => {
            popNew('app-components-message-message', { itype: 'error', content: '分享失败', center: true });
        });
    }

}
