<div class="ga-new-page">
    <app-components-topBar-topBar>{title:"语言设置"}</app-components-topBar-topBar>
    <div class="language-radio-group" w-class="pi-radio-group" ev-radio-change="radioChangeListener">
            {{for ind,val of it.data}}
                <languageItem$>{{val}}</languageItem$>
            {{end}}   
        </div>
</div>
