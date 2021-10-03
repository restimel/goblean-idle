import { reactive } from 'vue';
import { I18n, SupportedLanguage } from '@/Types';

const dictionary: Map<SupportedLanguage, Map<string, string>> = new Map();

const _ = (locale: SupportedLanguage) => {
    const localeDictionary: Map<string, string> = dictionary.get(locale) || new Map();
    /* TODO load dictionary */

    return (str: string, ...args: Array<string | number>) => {
        const translated = localeDictionary.get(str) || str;
        let index = 0;
        const replacedStr = translated.replace(/%(\(\w+\))?(.)/, (_p, position, kind) => {
            let arg = args[index];
            if (position) {
                arg = (arg as any)[position];
            } else {
                index++;
            }

            switch (kind) {
                case 'd':
                    arg = (+arg).toString();
                    break;
                case 's':
                default:
                    arg = arg.toString();
            }
            return arg;
        });
        return replacedStr;
    };
};

const i18n: I18n = reactive({
    _: _('en'),
    changeLocale(locale: SupportedLanguage) {
        i18n.locale = locale;
        i18n._ = _(locale);
        return true;
    },
    locale: 'en',
    projectName: 'Goblean',
    projectSubName: 'idle',
});

export default i18n;
