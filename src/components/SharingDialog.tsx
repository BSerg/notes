import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
} from '@mui/material';
import {FC, useState} from 'react';
import {useAppState} from '../AppState';
import {Note} from '../notes/Note';

interface IProps {
    note: Note;
    onCancel: () => void;
}

export const SharingDialog: FC<IProps> = ({note, onCancel}) => {
    const [{user, users}, dispatch] = useAppState();
    const [checkedUserIds, setCheckedUserIds] = useState<Set<string>>(
        new Set(
            note.users
                .map((u) => u.userId)
                .filter((userId) => userId && userId !== user?.id)
        )
    );

    const handleCheck = (
        e: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => {
        if (checked) {
            setCheckedUserIds(new Set(checkedUserIds.add(e.target.value)));
        } else {
            if (checkedUserIds.delete(e.target.value)) {
                setCheckedUserIds(new Set(checkedUserIds));
            }
        }
    };

    const handleSubmit = () => {
        dispatch({
            type: 'shareNote',
            payload: {
                noteId: note.id,
                entities: Array.from(checkedUserIds).map((userId) => ({
                    userId,
                    noteId: note.id,
                    role: 'read',
                })),
            },
        });
        onCancel();
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 435}}}
            maxWidth='xs'
            open>
            <DialogTitle>Share with</DialogTitle>
            <DialogContent dividers>
                <FormGroup>
                    {users
                        .filter((u) => u.id !== user?.id)
                        .map((user) => (
                            <div key={user.id}>
                                <FormControlLabel
                                    value={user.id}
                                    control={
                                        <Checkbox
                                            onChange={handleCheck}
                                            checked={checkedUserIds.has(
                                                user.id
                                            )}
                                        />
                                    }
                                    label={user.userName}
                                />
                            </div>
                        ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};
