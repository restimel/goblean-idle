import { reactive, watch } from 'vue';
import { AchievementItem, I18n, Store } from '@/Types';
import { notification } from '@/utils';

const list: Map<Store, AchievementItem[]> = new Map();

export function getFullList(store: Store, T: I18n['_']): AchievementItem[] {
    if (list.has(store)) {
        return list.get(store)!;
    }

    const achievementList: AchievementItem[] = reactive([{
        title: T('First coin'),
        label: T('You are not rich yet. But you are on the way.'),
        hint: T('Get your 1st gold'),
        condition: () => store.achievement.gold1,
        path: '',
        grade: 'bronze',
    }, {
        title: T('Annoying'),
        label: T('This was only some useless texts'),
        hint: T('Close 10 notifications'),
        condition: () => store.achievement.dismiss10,
        path: '',
        grade: 'bronze',
    }, {
        title: T('Disturbing'),
        label: T('Why is there so much text to read?'),
        hint: T('Close 50 notifications'),
        condition: () => store.achievement.dismiss50,
        hide: () => !store.achievement.dismiss10,
        path: '',
        grade: 'silver',
    }, {
        title: T('Exasperating'),
        label: T('I am wondering why someone written these texts.'),
        hint: T('Close 100 notifications'),
        condition: () => store.achievement.dismiss100,
        hide: () => !store.achievement.dismiss50,
        path: '',
        grade: 'gold',
    }, {
        title: T('Rebarbative'),
        label: T('Have you been notified that...? Ok you don\'t care!'),
        hint: T('Close 1000 notifications'),
        condition: () => store.achievement.dismiss1000,
        hide: () => !store.achievement.dismiss100,
        path: '',
        grade: 'diamond',
    }, {
        title: T('Cookie lover'),
        secretTitle: T('Mystery'),
        secret: true,
        label: T('Huuum cookies!'),
        hint: T('You love cookies even if they are needless!'),
        condition: () => store.achievement.secretCookie,
        path: '',
        grade: 'bronze',
    }, {
        title: T('All trophies'),
        label: T('Outstanding! You are a Goblean ruler!'),
        hint: T('Get all trophies'),
        condition: () => store.achievement.allTrophies,
        path: '',
        grade: 'diamond',
    }]);

    watch(achievementList.map((item) => () => item.condition()), (newValues, oldValues) => {
        if (!store.isReady) {
            return;
        }
        const indexes: number[] = [];
        newValues.forEach((value, index) => {
            if (value && !oldValues[index]) {
                indexes.push(index);
            }
        });
        const messages = indexes.map((index) => {
            const achievement = achievementList[index];
            return {
                title: T('A new achievement has been unlocked'),
                message: achievement.title,
            };
        });
        notification(store, messages);
    });

    list.set(store, achievementList);
    return achievementList;
}
