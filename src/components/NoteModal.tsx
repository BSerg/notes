import {FC} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Note} from '../notes/Note';
import {Card, CardActions, CardContent} from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface IProps {
    note?: Note;
    onClose: () => void;
}

export const NoteModal: FC<IProps> = ({note, onClose}) => {
    return (
        <Modal open={!!note} onClose={onClose}>
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
                }}>
                <CardContent>
                    <Typography variant='h6' gutterBottom>
                        {note?.title}
                    </Typography>
                    {!!note?.text && (
                        <ReactMarkdown>{note.text}</ReactMarkdown>
                    )}
                </CardContent>
                <CardActions>
                    {/* <Button size='small'>Learn More</Button> */}
                </CardActions>
            </Card>
        </Modal>
    );
};
