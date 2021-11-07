import { Action, DBAction, Store } from '@/Types';

let uid = 1n;

function baseAction<T = Record<string, number | bigint>>(
    crtTick: bigint,
    action: Partial<DBAction<T>>,
    refAction: Partial<DBAction<T>> = {}
): DBAction<T> {
    if (refAction.id) {
        if (uid <= refAction.id) {
            uid = refAction.id + 1n;
        }
    }

    return {
        id: uid++,
        name: refAction.name || action.name || '',
        endAt: refAction.endAt || action.endAt || crtTick + 1000000n,
        states: Object.assign({}, action.states, refAction.states),
    };
}

interface MineGoldState {
    dig: bigint;
}

function actionMineGold(store: Store, crtTick: bigint, refAction?: Action<MineGoldState>): Action<MineGoldState> {
    console.log('action mine start', !!refAction);
    const action: Action<MineGoldState> = {
        ...baseAction(crtTick, {
            name: 'mine-gold',
            endAt: crtTick + 10n,
            states: {
                dig: 0n,
            },
        }, refAction),
        action: (nbTick, currentTick) => {
            action.states.dig += nbTick;
            console.log('dig', action.states.dig);

            if (action.states.dig >= 10n) {
                store.resource.gold += 1n;
                action.states.dig -= 10n;
                const remains = 10n - action.states.dig;
                action.endAt = currentTick + (remains > 0n ? remains : 1n);
            }

            if (currentTick >= crtTick + 100n) {
                console.log('action mine end');
                return {
                    start: [],
                    stop: [action.id],
                };
            }
            return {
                start: [],
                stop: [],
            };
        },
    };

    return action;
}

function actionIdle(_store: Store, crtTick: bigint, refAction?: Action): Action {
    return {
        ...baseAction(crtTick, {
            name: 'idle',
        }, refAction),
        action: (_nbTick, cTick, action) =>  {
            console.log('action → idle');
            action.endAt = cTick + 1000000n;
            return {
                start: [],
                stop: [],
            };
        },
    };
}

const factoryActions: Record<string, (store: Store, crtTick: bigint, action?: Action<any>) => Action<any>> = {
    'mine-gold': actionMineGold,
    'idle': actionIdle,
};

export function createAction(type: string, store: Store, crtTick: bigint): Action {
    const factory = factoryActions[type];
    if (!factory) {
        console.warn('action "%s" not known', type);
        return actionIdle(store, crtTick);
    }

    return factory(store, crtTick);
}

export function restoreAction<T>(store: Store, action: Action<T>): Action<T> {
    const factory = factoryActions[action.name];

    return factory(store, store.tickInfo.lastActionTick, action);
}
