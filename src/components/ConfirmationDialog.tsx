import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import {FC} from 'react';

interface IProps {
    title: string;
    text?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationDialog: FC<IProps> = ({
    title,
    text,
    onConfirm,
    onCancel,
}) => {
    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '80%', maxHeight: 435}}}
            maxWidth='xs'
            open>
            <DialogTitle>{title}</DialogTitle>
            {!!text && (
                <DialogContent dividers>
                    <Typography variant='body2'>{text}</Typography>
                </DialogContent>
            )}
            <DialogActions>
                <Button autoFocus onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={onConfirm}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};
