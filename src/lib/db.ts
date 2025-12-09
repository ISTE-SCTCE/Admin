import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
// Updated to use local data folder inside next-admin

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        // ignore
    }
}

const DB_PATHS = {
    users: path.join(DATA_DIR, 'users.json'),
    files: path.join(DATA_DIR, 'files.json'),
    events: path.join(DATA_DIR, 'events.json'),
    members: path.join(DATA_DIR, 'members.json'),
    messages: path.join(DATA_DIR, 'messages.json')
};

export interface FileRecord {
    id: number;
    filename: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    file_path: string;
    uploaded_at: string;
}

// Generic helper to read/write
function readJSON<T>(filePath: string): T[] {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}`, error);
        return [];
    }
}

function writeJSON<T>(filePath: string, data: T[]) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${filePath}`, error);
    }
}

export const db = {
    files: {
        findAll: () => readJSON<FileRecord>(DB_PATHS.files),
        create: (fileData: Omit<FileRecord, 'id' | 'uploaded_at'>) => {
            const files = readJSON<FileRecord>(DB_PATHS.files);
            const newFile: FileRecord = {
                id: files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1,
                ...fileData,
                uploaded_at: new Date().toISOString()
            };
            files.push(newFile);
            writeJSON(DB_PATHS.files, files);
            return newFile;
        },
        delete: (id: number) => {
            let files = readJSON<FileRecord>(DB_PATHS.files);
            files = files.filter(f => f.id !== id);
            writeJSON(DB_PATHS.files, files);
        }
    },
    events: {
        findAll: () => readJSON(DB_PATHS.events) as any[],
        create: (eventData: any) => {
            const events = readJSON<any>(DB_PATHS.events);
            const newEvent = {
                id: events.length > 0 ? Math.max(...events.map((e: any) => e.id)) + 1 : 1,
                ...eventData
            };
            events.push(newEvent);
            writeJSON(DB_PATHS.events, events);
            return newEvent;
        }
    },
    members: {
        findAll: () => readJSON(DB_PATHS.members),
        updateStatus: (id: number, status: string) => {
            const members = readJSON<any>(DB_PATHS.members);
            const member = members.find((m: any) => m.id === id);
            if (member) {
                member.status = status;
                writeJSON(DB_PATHS.members, members);
            }
        }
    },
    messages: {
        findAll: () => readJSON(DB_PATHS.messages) as any[],
        create: (msg: any) => {
            const messages = readJSON<any>(DB_PATHS.messages);
            const newMsg = {
                id: messages.length > 0 ? Math.max(...messages.map((m: any) => m.id)) + 1 : 1,
                ...msg,
                timestamp: new Date().toISOString()
            };
            messages.push(newMsg);
            writeJSON(DB_PATHS.messages, messages);
            return newMsg;
        }
    },
    users: {
        findAll: () => readJSON<any>(DB_PATHS.users),
        create: (userData: any) => {
            const users = readJSON<any>(DB_PATHS.users);
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1,
                ...userData,
                created_at: new Date().toISOString()
            };
            users.push(newUser);
            writeJSON(DB_PATHS.users, users);
            return newUser;
        },
        updateLastSeen: (email: string) => {
            const users = readJSON<any>(DB_PATHS.users);
            const user = users.find((u: any) => u.email === email);
            if (user) {
                user.last_seen = new Date().toISOString();
                writeJSON(DB_PATHS.users, users);
            }
        }
    }
};
