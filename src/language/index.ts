import { createI18n } from 'vue-i18n';
import zh from '../i18n/lang/zh'
import zhTw from '../i18n/lang/zh-tw'
import en from '../i18n/lang/en'
import ja from '../i18n/lang/ja'
import ko from '../i18n/lang/ko'
import vi from '../i18n/lang/vi'

// import els from "./els"
// import zh from "./zh"
// import en from "./en"
// import tg from "./tg"
// import xjp from "./xjp"
// import hg from "./hg"
export default createI18n({
    legacy: false,
    locale: localStorage.getItem("lan") || "zh",
    messages: { zh, 'zh-tw': zhTw, en, ja, ko, vi },
})