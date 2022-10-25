import {FC, useState} from 'react';
import Modal from '@mui/material/Modal';
import {INote, Note} from '../notes/Note';
import {Button, Card, CardActions, CardContent, TextField} from '@mui/material';
import {useAppState} from '../AppState';
import {useAppNavigation} from '../AppNavigation';

interface IProps {
    note?: Note;
    onClose: () => void;
}

export const EditNoteModal: FC<IProps> = ({note, onClose}) => {
    const [route, setRoute] = useAppNavigation();
    const [state, dispatch] = useAppState();
    const [editedNote, setEditedNote] = useState<Partial<INote>>(
        note?.toObject() ?? {}
    );

    const isValid = !!editedNote.title;

    const handleNoteChange =
        (field: keyof INote) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setEditedNote({...editedNote, [field]: e.target.value});
        };

    const handleSave = () => {
        if (!isValid) {
            return;
        }
        if (editedNote.id) {
            dispatch({type: 'updateNote', payload: editedNote});
        } else {
            dispatch({type: 'addNote', payload: editedNote});
        }
        setRoute('/');
    };

    return (
        <Modal open onClose={onClose}>
            <Card
                sx={{
                    minWidth: 275,
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    outline: 'none',
                    '& .MuiTextField-root': {my: 1},
                }}>
                <CardContent>
                    <form onSubmit={handleSave}>
                        <div>
                            <TextField
                                id='standard-basic'
                                label='Title'
                                variant='standard'
                                defaultValue={note?.title}
                                onChange={handleNoteChange('title')}
                                fullWidth
                            />
                        </div>
                        <div>
                            <TextField
                                id='standard-basic'
                                label='Text'
                                variant='standard'
                                defaultValue={note?.text}
                                onChange={handleNoteChange('text')}
                                multiline
                                fullWidth
                            />
                        </div>
                    </form>
                </CardContent>
                <CardActions>
                    <Button size='small' onClick={handleSave} disabled={!isValid}>
                        Save
                    </Button>
                </CardActions>
            </Card>
        </Modal>
    );
};
