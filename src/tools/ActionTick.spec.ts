import { DBStore, Store, TickInfo } from '@/Types';
import {
    addActions,
    computeTick,
    convertToDuration,
    convertToTicks,
    removeActions,
    startRepetitiveActions,
    stopRepetitiveActions,
} from '@/tools/Tick';
import {
    createAction,
} from '@/tools/Actions';
import createStore from '@/store';
import { sleep } from '@/utils';

async function mockStore(options?: Partial<DBStore>): Promise<Store> {
    const store = createStore({
        isTest: true,
    });

    await sleep(0);
    if (options) {
        store.tools.loadStore(options);
    }

    let counter = 100;
    while(!store.isReady && --counter > 0) {
        await sleep(0);
    }

    return store;
}

function basicTickInfo(options: Partial<TickInfo> = {}): TickInfo {
    return Object.assign({
        tickDuration: 1000n,
        lastActionDate: dateRef - 10000,
        nextActionTick: 1000n,
        lastActionTick: 100n,
        actions: [],
    }, options);
}

let dateRef: number;

beforeEach(() => {
    dateRef = Date.now();
});
afterEach(() => {
    stopRepetitiveActions();
});

test('createAction() not found', async () => {
    const store = await mockStore();
    const result = createAction('do not exist', store, 100n);
    expect(result.name).toBe('idle');
    expect(result.endAt > 100n).toBe(true);
    expect(result.states).toEqual({});
});

test('createAction()', async () => {
    const store = await mockStore();
    const resultIdle = createAction('idle', store, 100n);
    expect(resultIdle.name).toBe('idle');
    expect(resultIdle.endAt > 100n).toBe(true);
    expect(resultIdle.states).toEqual({});

    const resultMine = createAction('mine-gold', store, 200n);
    expect(resultMine.name).toBe('mine-gold');
    expect(resultMine.endAt > 200n).toBe(true);
    expect(resultMine.states).toEqual({
        dig: 0n,
    });

    expect(resultIdle.id).not.toBe(resultMine.id);
});

test('convertToTicks()', () => {
    const tickInfo1 = basicTickInfo({
        tickDuration: 1000n,
    });
    const result1000 = convertToTicks(2000, tickInfo1);
    expect(result1000).toBe(2n);

    const result1000NonInt = convertToTicks(12_345, tickInfo1);
    expect(result1000NonInt).toBe(12n);

    const result1000NotEnough = convertToTicks(990, tickInfo1);
    expect(result1000NotEnough).toBe(0n);

    const tickInfo2 = basicTickInfo({
        tickDuration: 200n,
    });
    const result200 = convertToTicks(2000, tickInfo2);
    expect(result200).toBe(10n);
});

test('convertToDuration()', () => {
    const tickInfo1 = basicTickInfo({
        tickDuration: 1000n,
    });
    const result1000 = convertToDuration(100n, tickInfo1);
    expect(result1000).toBe(100_000);

    const tickInfo2 = basicTickInfo({
        tickDuration: 100n,
    });
    const result100 = convertToDuration(3n, tickInfo2);
    expect(result100).toBe(300);
});

test('computeTick()', () => {
    const tickInfo1 = basicTickInfo({
        tickDuration: 1000n,
        lastActionDate: dateRef - 10_000,
        nextActionTick: 1000n,
        lastActionTick: 100n,
    });
    const resultNoPause = computeTick(tickInfo1);
    expect(resultNoPause).toBe(10n);

    /* with a different duration */
    const tickInfo2 = basicTickInfo({
        tickDuration: 500n,
        lastActionDate: dateRef - 10_000,
        nextActionTick: 1000n,
        lastActionTick: 100n,
    });
    const resultDuration = computeTick(tickInfo2);
    expect(resultDuration).toBe(20n);

    /* with nextTick inside the range */
    const tickInfo3 = basicTickInfo({
        tickDuration: 1000n,
        lastActionDate: dateRef - 10000,
        nextActionTick: 105n,
        lastActionTick: 100n,
    });
    const resultWithPause = computeTick(tickInfo3);
    expect(resultWithPause).toBe(5n);
});

test('runActions()', () => {

});

test('addActions()', async () => {
    const store = await mockStore();
    const tickInfo = basicTickInfo();
    const mineAction = createAction('mine-gold', store, 200n)
    const idleAction = createAction('idle', store, 200n)

    addActions([mineAction, idleAction], tickInfo);

    expect(tickInfo.actions.length).toBe(2);
    expect(tickInfo.nextActionTick).toBe(mineAction.endAt);
});

test('removeActions()', async () => {
    const store = await mockStore();
    const tickInfo = basicTickInfo();
    const action1 = createAction('mine-gold', store, 200n)
    const action2 = createAction('mine-gold', store, 250n)
    const idleAction = createAction('idle', store, 200n)

    addActions([action1, action2, idleAction], tickInfo);
    const removeList = new Set([action1.id, idleAction.id]);
    removeActions(removeList, tickInfo);

    expect(tickInfo.actions.length).toBe(1);
    expect(tickInfo.nextActionTick).toBe(action2.endAt);
});

test('startRepetitiveActions()', async () => {
    let counter = 0;
    let retry = 3;
    while(retry-- && counter !== 5) { /* Do retry do to setTimeout imprecision */
        counter = 0;
        const store = await mockStore({
            settings: {
                delayCheckTick: 20,
                saveDelay: 1_000_000, /* useless */
            },
            tickInfo: basicTickInfo({
                tickDuration: 20n,
                lastActionDate: dateRef,
                lastActionTick: 0n,
            }),
        });
        const action = {
            id: 42_000n,
            name: 'counter',
            endAt: 1n,
            states: {},
            action: (nbTick: bigint, crtTick: bigint) => {
                counter += Number(nbTick);
                action.endAt = crtTick + 1n;
                return {
                    start: [],
                    stop: [],
                };
            },
        };
        addActions([action], store.tickInfo);

        startRepetitiveActions(store);
        await sleep(115);
        stopRepetitiveActions();
    }
    expect(counter).toBe(5);
});

test('stopRepetitiveActions()', () => {});
