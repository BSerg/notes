import {Serializable} from '../Serializable';
import { hash } from '../utils';

export interface IUser {
    id: string;
    userName: string;
    password?: string;
    displayName?: string;
    logo?: string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}

export class User extends Serializable implements IUser {
    id: string;
    userName: string;
    password?: string;
    displayName?: string;
    logo?: string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;

    constructor(props: IUser) {
        super();
        this.id = props.id;
        this.userName = props.userName;
        this.password = props.password;
        this.displayName = props.displayName;
        this.logo = props.logo;
        this.isActive = props.isActive;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    public toObject(): IUser {
        return Object.assign({}, this) as IUser;
    }

    public static fromObject(data: IUser): User {
        return new User(data);
    }

    public verifyPassword(password: string): boolean {
        return hash(password) === this.password;
    }

    public setPassword(password: string) {
        this.password = hash(password);
    }
}
