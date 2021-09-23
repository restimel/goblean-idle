import { InjectionKey } from 'vue';
import { Store, I18n } from '@/Types';

export const storeInject: InjectionKey<Store> = Symbol('store');
export const TInject: InjectionKey<I18n['_']> = Symbol('T');
export const i18nInject: InjectionKey<I18n> = Symbol('i18n');
