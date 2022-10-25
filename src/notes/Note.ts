import {Serializable} from '../Serializable';
import {User} from '../users/User';
import {IUserNote, UserNote} from '../users/UserNote';

export interface INote {
    id: string;
    users: UserNote[];
    tags: string[];
    title: string;
    text?: string;
    createdAt: number;
    updatedAt: number;
}

export class Note extends Serializable implements INote {
    id: string;
    users: UserNote[];
    tags: string[];
    title: string;
    text?: string | undefined;
    createdAt: number;
    updatedAt: number;

    constructor(props: INote) {
        super();
        this.id = props.id;
        this.users = props.users ?? [];
        this.tags = props.tags ?? [];
        this.title = props.title;
        this.text = props.text;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    canRead(user: User): boolean {
        return !!this.users.find((userNote) => userNote.userId === user.id);
    }

    canWrite(user: User): boolean {
        return !!this.users.find(
            (userNote) =>
                userNote.userId === user.id &&
                (userNote.role === 'write' || userNote.role === 'owner')
        );
    }

    isOwner(user: User): boolean {
        return !!this.users.find(
            (userNote) =>
                userNote.userId === user.id && userNote.role === 'owner'
        );
    }

    toObject(): INote {
        return Object.assign({}, this) as INote;
    }

    static fromObject(obj: INote): Note {
        const {users, ...props} = obj;
        return new Note({
            users: users.map((userNote: IUserNote) => new UserNote(userNote)),
            ...props,
        });
    }
}
