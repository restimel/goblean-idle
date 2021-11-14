import {
    _testReset,
    convertToEan13,
    getEANCode,
    isEmptyGroup,
    isValidEAN,
    samePosition,
    createGoblean,
    updateGroupCharacs,
    _getLists,
    assignToGroup,
} from '@/tools/Goblean';
import { Goblean, Group } from '@/Types';

function mockGoblean(ean: string, option?: Partial<Goblean>): Goblean | undefined {
    const goblean = createGoblean(ean);
    if (!goblean) {
        return;
    }

    Object.assign(goblean, option);
    return goblean;
}

function mockGroup(option?: Partial<Group>, save = false): Group {
    const group = Object.assign({
        id: 1n,
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
    }, option);

    if (save) {
        const {groupList, setGroupUid} = _getLists();
        groupList.set(group.id, group);
        setGroupUid(group.id + 1n);
    }

    return group;
}

afterEach(() => {
    _testReset();
})

/* {{{ goblean */

test('getEANCode() should return digit ean code', () => {
    const simple = '3210330004044';
    const resultSimple = getEANCode(simple);
    expect(resultSimple).toEqual([3, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 4]);

    const space = ' 4 21  033 0 0040 45  ';
    const resultSpace = getEANCode(space);
    expect(resultSpace).toEqual([4, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 5]);

    const special = '+5-21fr0⅛3/30|0?0Ω4!0$4€6Ð×±';
    const resultSpecial = getEANCode(special);
    expect(resultSpecial).toEqual([5, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 6]);

    const array = [6, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 7];
    const resultArray = getEANCode(array);
    expect(resultArray).toEqual([6, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 7]);
});

test('isValidEAN() should assert EAN are correct', () => {
    const ean13List = [
        '3210330004044', '9782755683486', '3360100270107', '3109850018535',
        '5011423176574', '9316188076272',
    ];
    const resultEan13 = ean13List.map((ean13) => isValidEAN(ean13));

    expect(resultEan13.every((value) => value)).toBe(true);

    const ean12List = [
        '673807644366', '673807619616',
    ];
    const resultEan12 = ean12List.map((ean12) => isValidEAN(ean12));

    expect(resultEan12.every((value) => value)).toBe(true);
});

test('isValidEAN() should assert EAN are incorrect', () => {
    const ean13List = [
        '3210330004045', '9782755683488', '3360100270100', '3109850018531',
        '5011423176571', '9316188076270',
    ];
    const resultEan13 = ean13List.map((ean13) => isValidEAN(ean13));

    expect(resultEan13.every((value) => !value)).toBe(true);

    const ean12List = [
        '673807644367', '673807619618',
    ];
    const resultEan12 = ean12List.map((ean12) => isValidEAN(ean12));

    expect(resultEan12.every((value) => !value)).toBe(true);
});

test('convertToEAN13()', () => {
    const ean13 = [3, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 4];
    const longEan = [4, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 4, 2, 1, 0, 3, 3, 0];
    const shortEan = [2, 2, 1, 0, 3];

    const resultEan13 = convertToEan13(ean13);
    const resultLongEan = convertToEan13(longEan);
    const resultShortEan = convertToEan13(shortEan);

    expect(resultEan13).toEqual([3, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 4])
    expect(resultLongEan).toEqual([4, 2, 1, 0, 3, 3, 0, 0, 0, 4, 0, 4, 4])
    expect(resultShortEan).toEqual([2, 2, 1, 0, 3, -1, -1, -1, -1, -1, -1, -1, -1])
});

test('createGoblean()', () => {
    const goblean1 = createGoblean('3360100270107');
    const goblean2 = createGoblean('673807619616');
    const goblean3 = createGoblean('alpha97 8275 568 34 86beta');
    const goblean4 = createGoblean('9782212675542');
    const goblean5 = createGoblean('123');

    expect(goblean1).toEqual({
        ean: '3360100270107',
        name: 'goblean 3360100270107',

        experience: 0n,
        totalExp: 0n,
        motivation: 100n,

        groupId: 0n,

        speed: 10n,
        force: 9n,
        stamina: 7n,
        intelligence: 7n,
        craft: 9n,
        learning: 9n,
        social: 15n,
    });
    expect(goblean2).toEqual({
        ean: '673807619616',
        name: 'goblean 673807619616',

        experience: 0n,
        totalExp: 0n,
        motivation: 100n,

        groupId: 0n,

        speed: 14n,
        force: 15n,
        stamina: 13n,
        intelligence: 7n,
        craft: 4n,
        learning: 5n,
        social: 12n,
    });

    expect(goblean3).toEqual({
        ean: '9782755683486',
        name: 'goblean alpha97 8275 568 34 86beta',

        experience: 0n,
        totalExp: 0n,
        motivation: 100n,

        groupId: 0n,

        speed: 16n,
        force: 13n,
        stamina: 25n,
        intelligence: 17n,
        craft: 14n,
        learning: 13n,
        social: 30n, /* bonus */
    });

    expect(goblean4).toEqual({
        ean: '9782212675542',
        name: 'goblean 9782212675542',

        experience: 0n,
        totalExp: 0n,
        motivation: 100n,

        groupId: 0n,

        speed: 14n,
        force: 18n,
        stamina: 22n,
        intelligence: 21n,
        craft: 19n,
        learning: 28n, /* bonus */
        social: 21n,
    });

    expect(goblean5).toEqual({
        ean: '123',
        name: 'goblean 123',

        experience: 0n,
        totalExp: 0n,
        motivation: 100n,

        groupId: 0n,

        speed: 1n,
        force: 1n,
        stamina: 1n,
        intelligence: 1n,
        craft: 2n,
        learning: 1n,
        social: 2n,
    });
});

test('createGoblean() should reject invalid ean', () => {
    const goblean1 = createGoblean('3210330004045');
    const goblean2 = createGoblean('673807619619');
    const goblean3 = createGoblean('000'); /* this is a valid EAN but not wanted */

    expect(goblean1).toBe(undefined);
    expect(goblean2).toBe(undefined);
    expect(goblean3).toBe(undefined);
});

test('createGoblean() should return existing one', () => {
    const goblean1 = createGoblean('3360100270107');
    const goblean2 = createGoblean('3360100270107');
    const goblean3 = createGoblean('some 33 6 - 01+002/70̣ạ10ȳº7 text');

    expect(goblean1).toBe(goblean2);
    expect(goblean1).toBe(goblean3);
});

/* }}} */
/* {{{ Group */

test('isEmptyGroup()', () => {
    const groupNew = mockGroup();
    const groupLeader = mockGroup({ leaders: ['9782755683486'] });
    const groupWorker = mockGroup({ workers: ['0225219057274', '9782840557425'] });
    const groupMixt = mockGroup({ leaders: ['3518646213304', '1234567890'], workers: ['9876543210'] });

    const resultNew = isEmptyGroup(groupNew);
    const resultLeader = isEmptyGroup(groupLeader);
    const resultWorker = isEmptyGroup(groupWorker);
    const resultMixt = isEmptyGroup(groupMixt);

    expect(resultNew).toBe(true);
    expect(resultLeader).toBe(false);
    expect(resultWorker).toBe(false);
    expect(resultMixt).toBe(false);
});

test('samePosition()', () => {
    const group1 = mockGroup();
    const group2 = mockGroup({ position: [10, 20], workers: ['9782755683486'] });
    const group3 = mockGroup({ position: [10, 20], workers: ['3360100270100'] });
    const group4 = mockGroup({ position: [-10, 20], workers: ['3109850018531'] });
    const group5 = mockGroup({ position: [10, -20], workers: ['673807644366'] });

    const resultNew = samePosition(group1, group2);
    const resultSame = samePosition(group3, group2);
    const resultX = samePosition(group4, group2);
    const resultY = samePosition(group5, group2);

    expect(resultNew).toBe(true);
    expect(resultSame).toBe(true);
    expect(resultX).toBe(false);
    expect(resultY).toBe(false);
});


test('updateGroupCharac() with workers', () => {
    const gob1 = mockGoblean('3360100270107')!;
    const gob2 = mockGoblean('9782755683486')!;

    const group1 = mockGroup({ workers: [gob1.ean] });
    const group2 = mockGroup({ workers: [gob1.ean, gob2.ean] });

    updateGroupCharacs(group1);
    updateGroupCharacs(group2);

    expect(group1).toEqual(expect.objectContaining({
        speed: gob1.speed,
        force: gob1.force,
        stamina: gob1.stamina,
        intelligence: gob1.intelligence,
        craft: gob1.craft,
        learning: gob1.learning,
        social: gob1.social,
        leadEfficiency: 100n,
        efficiency: 100n,
    }));

    expect(group2).toEqual(expect.objectContaining({
        speed: (gob1.speed + gob2.speed) * 95n / 100n,
        force: (gob1.force + gob2.force) * 95n / 100n,
        stamina: (gob1.stamina + gob2.stamina) * 95n / 100n,
        intelligence: (gob1.intelligence + gob2.intelligence) * 95n / 100n,
        craft: (gob1.craft + gob2.craft) * 95n / 100n,
        learning: (gob1.learning + gob2.learning) * 95n / 100n,
        social: (gob1.social + gob2.social) * 95n / 100n,
        leadEfficiency: 100n,
        efficiency: 95n,
    }));
});


test('updateGroupCharac() with leaders', () => {
    const gob1 = mockGoblean('3360100270107')!;
    const gob2 = mockGoblean('9782755683486')!;
    const gob3 = mockGoblean('3109850018535')!;

    const group1 = mockGroup({ leaders: [gob1.ean], workers: [gob2.ean] });
    const group2 = mockGroup({ leaders: [gob1.ean, gob3.ean], workers: [gob2.ean] });

    updateGroupCharacs(group1);
    updateGroupCharacs(group2);

    const efficiency1 = 100n + gob1.social;
    expect(group1).toEqual(expect.objectContaining({
        speed: gob2.speed * efficiency1 / 100n,
        force: gob2.force * efficiency1 / 100n,
        stamina: gob2.stamina * efficiency1 / 100n,
        intelligence: gob2.intelligence * efficiency1 / 100n,
        craft: gob2.craft * efficiency1 / 100n,
        learning: gob2.learning * efficiency1 / 100n,
        social: gob2.social * efficiency1 / 100n,
        leadEfficiency: 100n,
        efficiency: efficiency1,
    }));

    const efficiency2 = 100n + (gob1.social + gob3.social) * 95n / 100n;
    expect(group2).toEqual(expect.objectContaining({
        speed: gob2.speed * efficiency2 / 100n,
        force: gob2.force * efficiency2 / 100n,
        stamina: gob2.stamina * efficiency2 / 100n,
        intelligence: gob2.intelligence * efficiency2 / 100n,
        craft: gob2.craft * efficiency2 / 100n,
        learning: gob2.learning * efficiency2 / 100n,
        social: gob2.social * efficiency2 / 100n,
        leadEfficiency: 95n,
        efficiency: efficiency2,
    }));
});

test('updateGroupCharac() with less motivation workers', () => {
    const gob1 = mockGoblean('3360100270107', { motivation: 50n })!;
    const gob2 = mockGoblean('9782755683486', { motivation: 10n })!;

    const group1 = mockGroup({ workers: [gob1.ean] });
    const group2 = mockGroup({ workers: [gob1.ean, gob2.ean] });

    updateGroupCharacs(group1);
    updateGroupCharacs(group2);

    expect(group1).toEqual(expect.objectContaining({
        speed: gob1.speed / 2n,
        force: gob1.force / 2n,
        stamina: gob1.stamina / 2n,
        intelligence: gob1.intelligence / 2n,
        craft: gob1.craft / 2n,
        learning: gob1.learning / 2n,
        social: gob1.social / 2n,
        leadEfficiency: 100n,
        efficiency: 100n,
    }));

    expect(group2).toEqual(expect.objectContaining({
        speed: (gob1.speed / 2n + gob2.speed / 10n) * 95n / 100n,
        force: (gob1.force / 2n + gob2.force / 10n) * 95n / 100n,
        stamina: (gob1.stamina / 2n + gob2.stamina / 10n) * 95n / 100n,
        intelligence: (gob1.intelligence / 2n + gob2.intelligence / 10n) * 95n / 100n,
        craft: (gob1.craft / 2n + gob2.craft / 10n) * 95n / 100n,
        learning: (gob1.learning / 2n + gob2.learning / 10n) * 95n / 100n,
        social: (gob1.social / 2n + gob2.social / 10n) * 95n / 100n,
        leadEfficiency: 100n,
        efficiency: 95n,
    }));
});

test('assignToGroup() simple assignment', () => {
    const {groupList} = _getLists();
    const gob1 = mockGoblean('3360100270107', {groupId: 1n})!;
    const gob2 = mockGoblean('9782755683486', {groupId: 2n})!;
    const gob3 = mockGoblean('8300783025934', {groupId: 2n})!;
    const gob4 = mockGoblean('8806085946651', {groupId: 3n})!;
    const gob5 = mockGoblean('3700529900009', {groupId: 3n})!;
    const gob6 = mockGoblean('4897032084728', {groupId: 4n})!;
    const gob7 = mockGoblean('888072039520', {groupId: 4n})!;
    const gob8 = mockGoblean('727361278908', {groupId: 4n})!;

    const group1 = mockGroup({ id: 1n, workers: [gob1.ean] }, true);
    const group2 = mockGroup({ id: 2n, workers: [gob2.ean, gob3.ean] }, true);
    const group3 = mockGroup({ id: 3n, leaders: [gob4.ean], workers: [gob5.ean] }, true);
    const group4 = mockGroup({ id: 4n, leaders: [gob6.ean, gob7.ean], workers: [gob8.ean] }, true);

    const result1 = assignToGroup(gob1, 2n);
    expect(result1).toBe(true);
    expect(gob1.groupId).toBe(2n);
    expect(group1.workers).toEqual([]);
    expect(group2.workers).toEqual([gob2.ean, gob3.ean, gob1.ean]);
    expect(groupList.has(1n)).toBe(false);

    const result2 = assignToGroup(gob2, 3n);
    expect(result2).toBe(true);
    expect(gob2.groupId).toBe(3n);
    expect(group2.workers).toEqual([gob3.ean, gob1.ean]);
    expect(group3.workers).toEqual([gob5.ean, gob2.ean]);
    expect(groupList.has(2n)).toBe(true);

    const result3 = assignToGroup(gob4, 4n);
    expect(result3).toBe(true);
    expect(gob4.groupId).toBe(4n);
    expect(group3.leaders).toEqual([]);
    expect(group4.leaders).toEqual([gob6.ean, gob7.ean, gob4.ean]);
    expect(groupList.has(3n)).toBe(true);
});

test('assignToGroup() to new group', () => {
    const {groupList} = _getLists();
    const gob1 = mockGoblean('3360100270107', {groupId: 1n})!;
    const gob2 = mockGoblean('9782755683486', {groupId: 2n})!;
    const gob3 = mockGoblean('8300783025934', {groupId: 1n})!;
    const gob4 = mockGoblean('8806085946651')!;

    const group1 = mockGroup({ id: 1n, workers: [gob1.ean, gob3.ean], position: [1, 2] }, true);
    const group2 = mockGroup({ id: 2n, leaders: [gob2.ean] }, true);

    const result1 = assignToGroup(gob1, 10n);
    const rGroup1 = groupList.get(gob1.groupId)!;
    expect(result1).toBe(true);
    expect(rGroup1.id).not.toBe(group1.id);
    expect(gob1.groupId).toBe(rGroup1.id);
    expect(group1.workers).toEqual([gob3.ean]);
    expect(rGroup1.workers).toEqual([gob1.ean]);
    expect(rGroup1.position).toEqual(group1.position);
    expect(groupList.has(1n)).toBe(true);

    const result2 = assignToGroup(gob2, 11n);
    const rGroup2 = groupList.get(gob2.groupId)!;
    expect(result2).toBe(true);
    expect(rGroup2.id).not.toBe(group2.id);
    expect(gob2.groupId).toBe(rGroup2.id);
    expect(group2.leaders).toEqual([]);
    expect(rGroup2.leaders).toEqual([gob2.ean]);
    expect(rGroup2.position).toEqual(group2.position);
    expect(groupList.has(2n)).toBe(false);

    const result3 = assignToGroup(gob3, 0n);
    const rGroup3 = groupList.get(gob3.groupId)!;
    expect(result3).toBe(true);
    expect(gob3.groupId).not.toBe(1n);
    expect(gob3.groupId).not.toBe(0n);
    expect(group1.workers).toEqual([]);
    expect(rGroup3.workers).toEqual([gob3.ean]);
    expect(rGroup3.position).toEqual(group1.position);
    expect(groupList.has(1n)).toBe(false);

    /* create a new Goblean and assigne it to a new group */
    const result4 = assignToGroup(gob4, 0n);
    const rGroup4 = groupList.get(gob4.groupId)!;
    expect(result4).toBe(true);
    expect(gob4.groupId).not.toBe(0n);
    expect(gob4.groupId > group2.id).toBe(true);
    expect(rGroup4.workers).toEqual([gob4.ean]);
    expect(rGroup4.leaders).toEqual([]);
    expect(rGroup4.position).toEqual([0, 0]);
});

test('assignToGroup() can change role', () => {
    const {groupList} = _getLists();
    const gob1 = mockGoblean('3360100270107', {groupId: 1n})!;
    const gob2 = mockGoblean('9782755683486', {groupId: 2n})!;
    const gob3 = mockGoblean('8300783025934', {groupId: 3n})!;
    const gob4 = mockGoblean('8806085946651', {groupId: 3n})!;
    const gob5 = mockGoblean('3700529900009', {groupId: 4n})!;
    const gob6 = mockGoblean('4897032084728', {groupId: 4n})!;

    const group1 = mockGroup({ id: 1n, workers: [gob1.ean], position: [10, 10] }, true);
    const group2 = mockGroup({ id: 2n, leaders: [gob2.ean], position: [-10, -10] }, true);
    const group3 = mockGroup({ id: 3n, leaders: [gob3.ean], workers: [gob4.ean], position: [0, 2] }, true);
    const group4 = mockGroup({ id: 4n, leaders: [gob5.ean], workers: [gob6.ean], position: [0, 2] }, true);

    const result1 = assignToGroup(gob1, 1n, 'leader');
    expect(result1).toBe(true);
    expect(gob1.groupId).toBe(1n);
    expect(group1.workers).toEqual([]);
    expect(group1.leaders).toEqual([gob1.ean]);
    expect(groupList.has(1n)).toBe(true);

    const result2 = assignToGroup(gob2, 2n, 'worker');
    expect(result2).toBe(true);
    expect(gob2.groupId).toBe(2n);
    expect(group2.workers).toEqual([gob2.ean]);
    expect(group2.leaders).toEqual([]);
    expect(groupList.has(2n)).toBe(true);

    const result3 = assignToGroup(gob3, 3n, 'worker');
    expect(result3).toBe(true);
    expect(gob3.groupId).toBe(3n);
    expect(group3.workers).toEqual([gob4.ean, gob3.ean]);
    expect(group3.leaders).toEqual([]);
    expect(groupList.has(3n)).toBe(true);

    const result4 = assignToGroup(gob4, 4n, 'leader');
    expect(result4).toBe(true);
    expect(gob4.groupId).toBe(4n);
    expect(group3.workers).toEqual([gob3.ean]);
    expect(group4.workers).toEqual([gob6.ean]);
    expect(group3.leaders).toEqual([]);
    expect(group4.leaders).toEqual([gob5.ean, gob4.ean]);
    expect(groupList.has(3n)).toBe(true);
});

test('assignToGroup() can not be done', () => {
    const {groupList} = _getLists();
    const gob1 = mockGoblean('3360100270107', {groupId: 1n})!;
    const gob2 = mockGoblean('9782755683486', {groupId: 2n})!;
    const gob3 = mockGoblean('8300783025934', {groupId: 3n})!;

    const group1 = mockGroup({ id: 1n, workers: [gob1.ean], position: [10, 10] }, true);
    const group2 = mockGroup({ id: 2n, leaders: [gob2.ean], position: [-10, -10] }, true);
    const group3 = mockGroup({ id: 3n, workers: [gob3.ean], position: [5, -1] }, true);

    /* Different position */
    const result1 = assignToGroup(gob1, 2n);
    expect(result1).toBe(false);
    expect(gob1.groupId).toBe(1n);
    expect(group1.workers).toEqual([gob1.ean]);
    expect(group2.workers).toEqual([]);
    expect(groupList.has(1n)).toBe(true);

    const result2 = assignToGroup(gob2, 1n);
    expect(result2).toBe(false);
    expect(gob2.groupId).toBe(2n);
    expect(group2.leaders).toEqual([gob2.ean]);
    expect(group1.leaders).toEqual([]);
    expect(groupList.has(2n)).toBe(true);

    /* Same role */
    const result3 = assignToGroup(gob3, 3n, 'worker');
    expect(result3).toBe(false);
    expect(gob3.groupId).toBe(3n);
    expect(group3.leaders).toEqual([]);
    expect(group3.workers).toEqual([gob3.ean]);
    expect(groupList.has(3n)).toBe(true);
});


/* }}} */
