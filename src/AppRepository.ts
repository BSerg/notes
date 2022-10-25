import {INote, Note} from './notes/Note';
import {IUser, User} from './users/User';

export class AppRepository {
    static prefix: string = 'NOTES_';
    static get<T = any>(key: string): T | null {
        const json = localStorage.getItem(AppRepository.prefix + key);
        if (!json) {
            return null;
        }
        return JSON.parse(json);
    }
    static set<T = any>(key: string, value: T) {
        const json = JSON.stringify(value);
        localStorage.setItem(AppRepository.prefix + key, json);
    }
    static getUser(): User | null {
        const user = this.get<IUser>('user');
        return user ? User.fromObject(user) : null;
    }
    static getUsers(): User[] {
        return (
            this.get<IUser[]>('users')?.map((user) => User.fromObject(user)) ??
            []
        );
    }
    static getNotes(): Note[] {
        const user = AppRepository.getUser();
        const notes = this.get<INote[]>('notes')?.map((note) => Note.fromObject(note)) ?? [];
        return notes.filter((n) => user && n.canRead(user));
    }
    static saveUser(user: User | null) {
        this.set('user', !!user ? user.toObject() : null);
    }
    static saveUsers(users: User[]) {
        this.set(
            'users',
            users.map((user) => user.toObject())
        );
    }
    static saveNotes(notes: Note[]) {
        this.set(
            'notes',
            notes.map((note) => note.toObject())
        );
    }
}
