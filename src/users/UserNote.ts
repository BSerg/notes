import {Serializable} from '../Serializable';

export type RoleType = 'owner' | 'read' | 'write';

export interface IUserNote {
    userId: string;
    noteId: string;
    role: RoleType;
    createdAt: number;
}

export class UserNote extends Serializable implements IUserNote {
    userId: string;
    noteId: string;
    role: RoleType;
    createdAt: number;

    constructor(props: IUserNote) {
        super();
        this.userId = props.userId;
        this.noteId = props.noteId;
        this.role = props.role;
        this.createdAt = props.createdAt;
    }

    public toObject(): IUserNote {
        return Object.assign({}, this) as IUserNote;
    }

    public static fromObject(data: IUserNote): UserNote {
        return new UserNote(data);
    }
}
