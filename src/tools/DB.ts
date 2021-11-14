import { DBGobleans, DBStore } from '@/Types';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

function toObj(obj: any) {
    return JSON.parse(JSON.stringify(obj, (_key, value) => {
        if (typeof value === 'bigint') {
            return `${value}n`;
        }
        return value;
    }));
}

function fromObjDB(obj: any) {
    return JSON.parse(JSON.stringify(obj), (_key, value) => {
        if (typeof value === 'string' && /^\d+n$/.test(value)) {
            return BigInt(value.slice(0, -1));
        }
        return value;
    });
}

interface GobleanDB extends DBSchema {
    store: {
        key: string;
        value: DBStore;
    };
    goblean: {
        key: number;
        value: DBGobleans;
    };
}

const version = 1;
let pDB: Promise<IDBPDatabase<GobleanDB>>;

async function openDataBase() {
    pDB = openDB<GobleanDB>('goblean-store', version, {
        upgrade(db) {
            db.createObjectStore('store');
        },
    });
}

openDataBase();

export async function saveStore(data: DBStore) {
    const userSession = data.userSession;
    const dataDB: DBStore = {
        userSession: toObj(userSession),
        settings: toObj(data.settings),
        resource: toObj(data.resource),
        states: toObj(data.states),
        tickInfo: toObj(data.tickInfo),
    };
    const db = await pDB;
    await db.put('store', dataDB, userSession);
}

export async function loadStore(): Promise<DBStore | undefined> {
    const db = await pDB;
    const allStore = await db.getAll('store');
    const dataStore = allStore && allStore[0];
    if (!dataStore) {
        return;
    }
    return fromObjDB(dataStore);
}
