<div class="ga-new-page" w-class="ga-new-page">
    <div w-class="ga-header">
        <app-components-topBar-topBar>{title:"币投宝",style:"background-color:transparent;color:#fff;",iconColor:"white"}</app-components-topBar-topBar>
        <div w-class="ga-header-content-container">    
            <div w-class="ga-bill-container">
                <span w-class="ga-title">昨日收益(USDT)</span>
                <span w-class="ga-costs">0.0001</span>
                <span w-class="ga-balance">总金额***USDT</span>
            </div>
            <div w-class="ga-bill-msg">
                <span w-class="ga-item">
                    <span w-class="ga-item-1">累计收益(USDT)</span>
                    <span w-class="ga-item-2">0.1720</span>
                </span>
                <span w-class="ga-item">
                    <span w-class="ga-item-1">万份收益(USDT)</span>
                    <span w-class="ga-item-2">1.0299</span>
                </span>
                <span w-class="ga-item" style="border-right:1px solid transparent;">
                    <span w-class="ga-item-1">七年日化(%)</span>
                    <span w-class="ga-item-2">3.8960</span>
                </span>
            </div>
        </div>
    </div>
    <div w-class="ga-fund-container">
        <div w-class="ga-box1">
            <span w-class="ga-fund-title">优选基金</span>
            <span w-class="ga-fund-desc">长线投资 专家精选</span>
        </div>
        <div w-class="ga-fund-list">
            <div w-class="ga-fund-list-item">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">27.24</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">生物/医疗健康</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">近一年</span>
                    <span w-class="ga-fund-begin">1,000 USDT起投</span>
                </div>
            </div>
            <div w-class="ga-fund-list-item ga-fund-list-item-border">
                <div w-class="ga-fund-row1">
                    <div w-class="ga-fund-per">
                        <span w-class="ga-fund-per-value">25.76</span>
                        <span>%</span>
                    </div>
                    <div w-class="ga-fund-name">基础链</div>
                </div>
                <div w-class="ga-fun-row2">
                    <span w-class="ga-fund-date">近一年</span>
                    <span w-class="ga-fund-begin">10 USDT起投</span>
                </div>
            </div>
        </div>
        <div w-class="ga-line"></div>
        <div w-class="ga-bottom-list">
            <div w-class="ga-list-item" on-tap="instalmentRecordsClick">
                <img src="../../../res/image/icon_fund_Introduce.png" w-class="ga-list-item-icon"/>
                <div w-class="ga-list-item-text">项目介绍</div>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-list-item-arrow"/>
            </div>
            <div w-class="ga-list-item" on-tap="historicalBillClick">
                <img src="../../../res/image/icon_fund_ques.png" w-class="ga-list-item-icon"/>
                <div w-class="ga-list-item-text">常见问题</div>
                <img src="../../../res/image/btn_right_arrow.png" w-class="ga-list-item-arrow"/>
            </div>
        </div>
    </div>
    <div w-class="ga-btns">
        <div w-class="ga-btn-item ">转出</div>
        <div w-class="ga-btn-item ga-btn-active">存入</div>
    </div>
</div>