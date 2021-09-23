import { reactive } from 'vue';
import { I18n } from '@/Types';

const i18n: I18n = reactive({
    _(str: string) {
        return str;  /* currently no dictionary are loaded */
    },
    changeLocale(locale: string) {
        i18n.locale = locale;
        i18n._ = (str: string) => {
            return str; /* currently no dictionary are loaded */
        };
        return true;
    },
    locale: 'en',
    projectName: 'Goblean',
    projectSubName: 'idle',
});

export default i18n;
