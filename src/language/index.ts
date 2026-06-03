import { createI18n } from 'vue-i18n';
import zh from '../i18n/lang/zh'
import en from '../i18n/lang/en'

// import els from "./els"
// import zh from "./zh"
// import en from "./en"
// import tg from "./tg"
// import xjp from "./xjp"
// import hg from "./hg"
export default createI18n({
    legacy: false,
    locale: localStorage.getItem("lan") || "zh",
    messages: { zh, en },
})