import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import {useAppState} from '../AppState';

export const Header = () => {
    const [state, dispatch] = useAppState();
    const handleSignOut = () => {
        dispatch({type: 'signOut'});
    };
    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
                    Notes
                </Typography>
                <Typography variant='h6' component='div'>
                    {state.user?.userName}
                </Typography>
                {!!state.user && (
                    <Button color='inherit' onClick={handleSignOut}>
                        <LogoutIcon fontSize='small' />
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
