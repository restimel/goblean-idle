import { Action, Store, TickInfo } from '@/Types';

export function convertToTicks(duration: number, tickInfo: TickInfo): bigint {
    return BigInt(duration) / tickInfo.tickDuration;
}

export function convertToDuration(ticks: bigint, tickInfo: TickInfo): number {
    return Number(ticks * tickInfo.tickDuration);
}

/**
 * @returns nbTick
 */
export function computeTick(tickInfo: TickInfo): bigint {
    const now = Date.now();
    const timeDuration = now - tickInfo.lastActionDate;
    const timeTick = convertToTicks(timeDuration, tickInfo);
    const nbExpectedTick = tickInfo.nextActionTick - tickInfo.lastActionTick;

    if (timeTick < nbExpectedTick || nbExpectedTick <= 0n) {
        return timeTick;
    }
    return nbExpectedTick;
}

function checkNextAction(tickInfo: TickInfo, currentTick: bigint = tickInfo.lastActionTick) {
    /* Compute the duration of next identical actions period */
    const nextTick = tickInfo.actions.reduce((tick, action) => {
        const endAt = action.endAt;
        if (endAt < tick && endAt > currentTick) {
            return endAt;
        }
        return tick;
    }, currentTick + 1_000_000_000n);

    tickInfo.nextActionTick = nextTick;
}

function doActions(tickInfo: TickInfo): boolean {
    /* Compute nb Tick to do */
    const nbTick = computeTick(tickInfo);
    if (nbTick === 0n) {
        /* This break the doActions recursive loop */
        return false;
    }
    /* store these information */
    tickInfo.lastActionDate += convertToDuration(nbTick, tickInfo);
    const currentTick = tickInfo.lastActionTick + nbTick;
    tickInfo.lastActionTick = currentTick;

    const remove: Set<bigint> = new Set();
    const add: Action[] = [];

    /* Apply all actions */
    for (const action of tickInfo.actions) {
        const { start, stop } = action.action(nbTick, currentTick, action);
        stop.forEach((id) => remove.add(id));
        add.push(...start);
    }

    /* Apply change in action list */
    removeActions(remove, tickInfo);
    addActions(add, tickInfo);

    checkNextAction(tickInfo, currentTick);

    /* repeat to apply next available ticks */
    return true;
}

export function runActions(store: Store): void {
    const tickInfo = store.tickInfo;
    const isRepetitive = !!timerRepetitiveActions;
    stopRepetitiveActions();

    while(doActions(tickInfo)) {
        /* just wait that doActions return false */
    }

    if (isRepetitive) {
        startRepetitiveActions(store);
    }
}

export function addActions(actions: Action[], tickInfo: TickInfo): void {
    tickInfo.actions.push(...actions);
    checkNextAction(tickInfo);
}

export function removeActions(actionsId: Set<bigint>, tickInfo: TickInfo): void {
    tickInfo.actions = tickInfo.actions.filter((action) => !actionsId.has(action.id));
    checkNextAction(tickInfo);
}

let timerRepetitiveActions = 0;
export function startRepetitiveActions(store: Store): void {
    timerRepetitiveActions = setTimeout(runActions, store.settings.delayCheckTick, store);
}

export function stopRepetitiveActions(): void {
    clearTimeout(timerRepetitiveActions);
    timerRepetitiveActions = 0;
}
