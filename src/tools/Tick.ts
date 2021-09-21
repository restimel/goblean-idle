import { Action } from '@/Types';


const tickDuration: bigint = 1000n; /* in ms */
let lastActionDate: number = 0;
let nextActionDate: number = Infinity;


let actionList: Action[] = [];

export function convertToTicks(duration: number): bigint {
    return BigInt(duration) / tickDuration;
}

export function convertToDuration(ticks: bigint): number {
    return Number(ticks * tickDuration);
}

/**
 * @returns [nbTick, duration]
 */
export function computeTick(): bigint {
    const now = Date.now();
    if (nextActionDate < lastActionDate) {
        nextActionDate = Infinity;
    }
    const targetDate = Math.min(nextActionDate, now);
    const nbTick = convertToTicks(targetDate - lastActionDate);

    return nbTick;
};

function doActions(): boolean {
    /* Compute nb Tick to do */
    const nbTick = computeTick();
    if (nbTick === 0n) {
        /* This break the doActions recursive loop */
        return false;
    }
    lastActionDate += convertToDuration(nbTick);

    const remove: Set<bigint> = new Set();
    const add: Action[] = [];

    /* Apply all actions */
    for (let action of actionList) {
        const { start, stop } = action.action(nbTick, lastActionDate);
        stop.forEach((id) => remove.add(id));
        add.push(...start);
    }

    /* Apply change in action list */
    removeActions(remove);
    addActions(add);

    /* Compute the next same actions period */
    const nextDate = actionList.reduce((date, action) => {
        const endAt = action.endAt;
        if (endAt < nextDate && endAt > lastActionDate) {
            return endAt;
        }
        return date;
    }, Infinity);
    nextActionDate = nextDate;

    /* repeat to apply next available ticks */
    return true;
}

export function runActions() {
    while(doActions()) {
        /* just wait that doActions return false */
    }
}

export function addActions(actions: Action[]) {
    actionList.push(...actions);
}

export function removeActions(actionsId: Set<bigint>) {
    actionList = actionList.filter((action) => actionsId.has(action.id));
}
