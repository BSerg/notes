import {FC, useState} from 'react';
import {
    Card,
    CardActions,
    CardContent,
    IconButton,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import {Note} from '../notes/Note';
import {useAppState} from '../AppState';
import {ConfirmationDialog} from './ConfirmationDialog';
import {useAppNavigation} from '../AppNavigation';
import {SharingDialog} from './SharingDialog';

interface IProps {
    note: Note;
    onClick?: () => void;
}

export const NotePreview: FC<IProps> = ({note, onClick}) => {
    const [route, setRoute] = useAppNavigation();
    const [state, dispatch] = useAppState();
    const [isOpenedDeletionDialog, setOpenedDeletionDialog] = useState(false);
    const [isOpenedSharingDialog, setOpenedSharingDialog] = useState(false);

    const openDeletionDialog = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setOpenedDeletionDialog(true);
    };

    const openShareDialog = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setOpenedSharingDialog(true);
    };

    const canShare =
        state.users.length > 1 && state.user && note.isOwner(state.user);

    const canDelete = state.user && note.isOwner(state.user);
    const handleDeleteNote = () => {
        if (canDelete) {
            dispatch({type: 'deleteNote', payload: {noteId: note.id}});
        }
    };

    const canEdit = state.user && note.canWrite(state.user);
    const handleEditDialog = () => {
        if (canEdit) {
            setRoute(`/note/${note.id}/edit`);
        }
    };

    return (
        <>
            <Card sx={{minWidth: 275, cursor: 'pointer'}}>
                <CardContent onClick={onClick}>
                    <Typography variant='h6' noWrap>
                        {note.title}
                    </Typography>
                </CardContent>
                <CardActions sx={{justifyContent: 'flex-end'}}>
                    <IconButton
                        disabled={!canShare}
                        size='small'
                        onClick={openShareDialog}>
                        <ShareIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        disabled={!canEdit}
                        size='small'
                        onClick={handleEditDialog}>
                        <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                        disabled={!canDelete}
                        size='small'
                        onClick={openDeletionDialog}>
                        <DeleteIcon fontSize='small' />
                    </IconButton>
                </CardActions>
            </Card>
            {isOpenedDeletionDialog && (
                <ConfirmationDialog
                    title='Do you want to delete the note?'
                    onConfirm={handleDeleteNote}
                    onCancel={() => setOpenedDeletionDialog(false)}
                />
            )}
            {isOpenedSharingDialog && (
                <SharingDialog
                    note={note}
                    onCancel={() => setOpenedSharingDialog(false)}
                />
            )}
        </>
    );
};
