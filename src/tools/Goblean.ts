import {
    EAN13,
    Goblean,
    Group,
    GroupRole,
    StatsPhy,
} from "@/Types";


let groupUid = 1n;
const gobleanList: Map<string, Goblean> = new Map();
const groupList: Map<bigint, Group> = new Map();

/* {{{ for tests */

export function _testReset(): void {
    gobleanList.clear();
    groupList.clear();
}

export function _getLists(): {
    gobleanList: Map<string, Goblean>, groupList: Map<bigint, Group>,
    setGroupUid: (id: bigint) => void,
} {
    return {
        gobleanList, groupList,
        setGroupUid(id: bigint) {
            groupUid = id;
        },
    };
}

/* }}} */

export function getEANCode(ean: string | number[]): number[] {
    if (Array.isArray(ean)) {
        return Array.from(ean);
    }

    return Array.from(ean.replace(/[^\d]/g, ''), key => +key);
}

export function isValidEAN(ean: string | number[]): boolean {
    const code = getEANCode(ean);
	const offset = code.length % 2;
    const key = code.pop(); /* get last code which should be the key */
	const cKey = (10 - code.reduce((sum, val, k) => {
        const m = (k + offset) % 2 ? 1 : 3;
        return sum + m * val;
    }, 0) % 10) % 10;
    return key === cKey;
}

export function convertToEan13(ean: number[]): EAN13 {
    const code: EAN13 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

    code.splice(0, ean.length, ...ean.slice(0, 13));

    return code;
}


const artifacts = ['9782212675542'];

export function createGoblean(ean: string, doNotSave = false): Goblean | undefined {
    const eanCode = getEANCode(ean);
    const eanId = eanCode.join('');

    if (gobleanList.has(eanId)) {
        return gobleanList.get(eanId);
    }

    if (!isValidEAN(eanCode)) {
        return;
    }
    if (eanCode.every(code => code === 0)) {
        /* Forbid EAN with only 0, even if it is valid */
        return;
    }

    const ean13 = convertToEan13(eanCode);

    function convertBaseValue(position: number[]): bigint {
        const values = position.map(pos => ean13[pos]);
        let sum = values.reduce((s, v) => s + v, 0);
        const firstValue = values[0];

        /* Bonus if all characteristics are equal */
        if (firstValue >= 0 && values.every(v => v === firstValue)) {
            const bonus = 10 * values.length - firstValue;
            sum += bonus;
        }

        /* Bonus for EAN13 code */
        if (eanCode.length === 13) {
            sum += values.length;
        }

        /* Bonus for some real life Artifact */
        if (artifacts.includes(ean)) {
            sum += values.length * 2;
        }

        /* Assert that value is at least 1 */
        if (sum <= 1) {
            sum = 1;
        }

        return BigInt(sum);
    }

    const goblean: Goblean = {
        ean: eanId,
        name: `goblean ${ean}`,

        speed: convertBaseValue([3, 5, 12]),
        force: convertBaseValue([8, 9]),
        stamina: convertBaseValue([1, 4, 11]),
        intelligence: convertBaseValue([0, 7]),
        craft: convertBaseValue([2, 10]),
        learning: convertBaseValue([6, 12]),
        social: convertBaseValue([2, 8]),

        experience: 0n,
        totalExp: 0n,
        motivation: 100n,

        groupId: 0n, /* TODO */
    };

    if (!doNotSave) {
        gobleanList.set(ean, goblean);
    }

    return goblean;
}

function getGroup(groupId: bigint): Group {
    let group = groupList.get(groupId);
    if (groupId <= 0n || !group) {
        group = {
            id: groupUid,
            leaders: [],
            workers: [],
            position: [0, 0],

            efficiency: 100n,
            leadEfficiency: 100n,

            speed: 0n,
            force: 0n,
            stamina: 0n,
            intelligence: 0n,
            craft: 0n,
            learning: 0n,
            social: 0n,
        };

        groupList.set(groupUid, group);
        groupUid++;
    }

    return group;
}

export function isEmptyGroup(group: Group): boolean {
    return group.workers.length === 0 && group.leaders.length === 0;
}

export function samePosition(group: Group, otherGroup: Group): boolean {
    if (isEmptyGroup(group) || isEmptyGroup(otherGroup)) {
        return true;
    }

    return group.position[0] === otherGroup.position[0] &&
        group.position[1] === otherGroup.position[1];
}

function efficiency(nb: number, bonus = 0n): bigint {
    if (nb < 1) {
        nb = 0;
    } else {
        nb -= 1;
    }
    const value = 100n - 5n * BigInt(nb) + bonus;
    if (value < 1n) {
        return 1n;
    }
    return value;
}

export function updateGroupCharacs(group: Group): void {
    const leaders = group.leaders;
    const workers = group.workers;
    const leadEfficiency = efficiency(leaders.length);
    const leadBonus = leaders.reduce((sum, gobleanId) => {
        const goblean = gobleanList.get(gobleanId);
        if (!goblean) {
            return sum;
        }
        return sum + goblean.social * goblean.motivation / 100n;
    }, 0n) * leadEfficiency / 100n;
    const workersEfficiency = efficiency(workers.length, leadBonus);
    const characteristics: StatsPhy = workers.reduce((stats, gobleanId) => {
        const goblean = gobleanList.get(gobleanId);
        if (!goblean) {
            return stats;
        }
        const motivation = goblean.motivation;
        stats.speed += goblean.speed * motivation / 100n;
        stats.force += goblean.force * motivation / 100n;
        stats.stamina += goblean.stamina * motivation / 100n;
        stats.intelligence += goblean.intelligence * motivation / 100n;
        stats.craft += goblean.craft * motivation / 100n;
        stats.learning += goblean.learning * motivation / 100n;
        stats.social += goblean.social * motivation / 100n;
        return stats;
    }, {
        speed: 0n,
        force: 0n,
        stamina: 0n,
        intelligence: 0n,
        craft: 0n,
        learning: 0n,
        social: 0n,
    });

    group.speed = characteristics.speed * workersEfficiency / 100n;
    group.force = characteristics.force * workersEfficiency / 100n;
    group.stamina = characteristics.stamina * workersEfficiency / 100n;
    group.intelligence = characteristics.intelligence * workersEfficiency / 100n;
    group.craft = characteristics.craft * workersEfficiency / 100n;
    group.learning = characteristics.learning * workersEfficiency / 100n;
    group.social = characteristics.social * workersEfficiency / 100n;

    group.leadEfficiency = leadEfficiency;
    group.efficiency =workersEfficiency;
}

export function assignToGroup(goblean: Goblean, groupId: bigint, role: GroupRole = 'same'): boolean {
    const oldGroup = getGroup(goblean.groupId);
    const newGroup = getGroup(groupId);

    if (!samePosition(newGroup, oldGroup)) {
        return false;
    }
    const oldRole: GroupRole = oldGroup.leaders.includes(goblean.ean) ? 'leader' : 'worker';
    const newRole = role !== 'same' ? role : oldRole;

    if (oldGroup.id === newGroup.id && oldRole === newRole) {
        return false;
    }

    if (oldRole === 'leader') {
        oldGroup.leaders = oldGroup.leaders.filter((ean) => ean !== goblean.ean);
    } else {
        oldGroup.workers = oldGroup.workers.filter((ean) => ean !== goblean.ean);
    }

    if (newRole === 'leader') {
        newGroup.leaders.push(goblean.ean);
    } else {
        newGroup.workers.push(goblean.ean);
    }

    goblean.groupId = newGroup.id;
    updateGroupCharacs(newGroup);
    newGroup.position = oldGroup.position;

    if (!isEmptyGroup(oldGroup)) {
        updateGroupCharacs(oldGroup);
    } else {
        groupList.delete(oldGroup.id);
    }

    return true;
}
