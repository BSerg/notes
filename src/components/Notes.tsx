import {useEffect, useMemo, useState} from 'react';
import {Fab, styled} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import {useAppState} from '../AppState';
import {NotePreview} from './NotePreview';
import {NoteModal} from './NoteModal';
import {useAppNavigation} from '../AppNavigation';
import {Note} from '../notes/Note';
import {EditNoteModal} from './EditNoteModal';

const AddButton = styled(Fab)`
    position: absolute;
    bottom: 0;
    right: 0;
`;

export const Notes = () => {
    const [{user, notes}, dispatch] = useAppState();
    const [route, setRoute] = useAppNavigation();
    const [openedNote, setOpenedNote] = useState<Note>();
    const [modalType, setModalType] = useState<'open' | 'edit'>();

    const userNotes = useMemo(() => {
        return notes.sort((n1, n2) => (n1.createdAt >= n2.createdAt ? 1 : -1));
    }, [notes]);

    useEffect(() => {
        if (/^\/note\/new$/.test(route)) {
            setOpenedNote(undefined);
            setModalType('edit');
        } else if (/^\/note\/[a-z\d-]+$/.test(route)) {
            const id = route.replace('/note/', '');
            const note = notes.find((n) => n.id === id) ?? null;
            if (note) {
                setOpenedNote(note);
                setModalType('open');
            } else {
                setRoute('/404');
            }
        } else if (/^\/note\/[a-z\d-]+\/edit$/.test(route)) {
            const id = route.replace('/note/', '').replace('/edit', '');
            const note = notes.find((n) => n.id === id) ?? null;
            if (note) {
                setOpenedNote(note);
                setModalType('edit');
            } else {
                setRoute('/404');
            }
        } else {
            setOpenedNote(undefined);
            setModalType(undefined);
        }
    }, [route, notes]);

    const handleNoteClick = (note: Note) => () => {
        setRoute(`/note/${note.id}`);
    };

    const handleNoteClose = () => {
        setRoute('/');
    };

    return (
        <Box sx={{flexGrow: 1, mt: 3}}>
            <Grid
                container
                spacing={{xs: 2, md: 3}}
                columns={{xs: 4, sm: 8, md: 12}}>
                {userNotes.map((note) => (
                    <Grid item xs={4} key={note.id}>
                        <NotePreview
                            note={note}
                            onClick={handleNoteClick(note)}
                        />
                    </Grid>
                ))}
            </Grid>
            <AddButton
                color='primary'
                sx={{m: 3}}
                onClick={() => setRoute('/note/new')}>
                <AddIcon />
            </AddButton>
            {modalType === 'open' && (
                <NoteModal note={openedNote} onClose={handleNoteClose} />
            )}
            {modalType === 'edit' && (
                <EditNoteModal note={openedNote} onClose={handleNoteClose} />
            )}
        </Box>
    );
};
