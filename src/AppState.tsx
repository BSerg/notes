import {
    FC,
    createContext,
    Dispatch,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import {User} from './users/User';
import {INote, Note} from './notes/Note';
import {AppRepository} from './AppRepository';
import {IUserNote, UserNote} from './users/UserNote';
import {getUUID} from './utils';

interface IAppState {
    error?: string;
    initialized: boolean;
    user: User | null;
    users: User[];
    notes: Note[];
}

type TDispatchType =
    | 'init'
    | 'resetError'
    | 'setUsers'
    | 'setNotes'
    | 'signUp'
    | 'signIn'
    | 'signOut'
    | 'addNote'
    | 'updateNote'
    | 'deleteNote'
    | 'shareNote';

type TDispatchAction = {type: TDispatchType; payload?: any};

interface IAppStateCtx {
    state: IAppState;
    dispatch: Dispatch<TDispatchAction>;
}

const initialState: IAppState = {
    initialized: false,
    user: null,
    users: [],
    notes: [],
};

const reducer = (state: IAppState, action: TDispatchAction) => {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                ...action.payload,
                initialized: true,
            };
        case 'resetError':
            return {
                ...state,
                error: null,
            };
        case 'setUsers':
            return {...state, users: action.payload};
        case 'setNotes':
            return {...state, notes: action.payload};
        case 'signIn':
            const user = state.users.find(
                (u) =>
                    u.userName === action.payload.username &&
                    u.verifyPassword(action.payload.password)
            );
            if (user) {
                return {...state, user};
            }
            return {
                ...state,
                user: null,
                error: 'User not found or password is invalid',
            };
        case 'signUp':
            const existingUser = state.users.find(
                (u) => u.userName === action.payload.username
            );
            if (existingUser) {
                return {
                    ...state,
                    error: `User "${action.payload.username}" already exists`,
                };
            }
            const newUser = User.fromObject({
                ...action.payload,
                userName: action.payload.username,
                isActive: true,
                id: getUUID(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            newUser.setPassword(action.payload.password);
            return {
                ...state,
                user: newUser,
                users: [...state.users, newUser],
            };
        case 'signOut':
            return {...state, user: null};
        case 'addNote':
            if (state.user) {
                const newNoteId = getUUID();
                const newNoteProps: INote = {
                    ...action.payload,
                    id: newNoteId,
                    users: [
                        {
                            userId: state.user.id,
                            noteId: newNoteId,
                            role: 'owner',
                            createdAt: Date.now(),
                        },
                    ],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                const newNote = Note.fromObject(newNoteProps);
                return {...state, notes: [...state.notes, newNote]};
            }
            return state;
        case 'updateNote':
            const note = Note.fromObject(action.payload);
            const notes = [...state.notes];
            const index = notes.findIndex((n) => n.id === note.id);
            if (index >= 0) {
                notes[index] = note;
                return {...state, notes};
            }
            return state;
        case 'shareNote':
            const sharedNote = state.notes.find(
                (n) => n.id === action.payload.noteId
            );
            if (sharedNote) {
                let entities: IUserNote[] = action.payload.entities.map(
                    (e: IUserNote) => ({...e, createdAt: Date.now()})
                );
                const ownerEntity = sharedNote.users.find(
                    (u) => u.role === 'owner'
                );
                if (ownerEntity) {
                    entities = [...entities, ownerEntity];
                }
                const notes = [...state.notes];
                const index = notes.findIndex(
                    (n) => n.id === action.payload.noteId
                );
                const note = new Note({
                    ...sharedNote.toObject(),
                    users: entities.map((e) => new UserNote(e)),
                });
                notes[index] = note;
                return {...state, notes};
            }
            return state;
        case 'deleteNote':
            const noteToDelete = state.notes.find(
                (n) => n.id === action.payload.noteId
            );
            if (noteToDelete) {
                const newNotes = state.notes.filter(
                    (n) => n.id !== action.payload.noteId
                );
                return {...state, notes: newNotes};
            }
            return state;
    }
};

export const AppStateCtx = createContext<IAppStateCtx>({
    state: initialState,
    dispatch: () => {},
});

export const AppStateProvider: FC<any> = ({children}) => {
    const [state, dispatch] = useReducer<
        (state: IAppState, action: TDispatchAction) => IAppState
    >(reducer, initialState);

    useEffect(() => {
        dispatch({
            type: 'init',
            payload: {
                user: AppRepository.getUser(),
                users: AppRepository.getUsers(),
                notes: AppRepository.getNotes(),
            },
        });
    }, []);

    useEffect(() => {
        if (state.initialized) {
            AppRepository.saveUser(state.user);
        }
    }, [state.initialized, state.user]);

    useEffect(() => {
        if (state.initialized) {
            AppRepository.saveUsers(state.users);
        }
    }, [state.initialized, state.users]);

    useEffect(() => {
        if (state.initialized) {
            AppRepository.saveNotes(state.notes);
        }
    }, [state.initialized, state.notes]);

    return (
        <AppStateCtx.Provider value={{state, dispatch}}>
            {children}
        </AppStateCtx.Provider>
    );
};

export const useAppState = (): [IAppState, Dispatch<TDispatchAction>] => {
    const {state, dispatch} = useContext(AppStateCtx);
    return [state, dispatch];
};
