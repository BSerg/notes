import {FC, useState} from 'react';
import {red} from '@mui/material/colors';
import Box from '@mui/material/Box';
import {Button, Link, TextField, Typography} from '@mui/material';

import {validatePassword, validateUsername} from '../utils';
import {useAppState} from '../AppState';
import { useAppNavigation } from '../AppNavigation';

export const Auth: FC = () => {
    const [state, dispatch] = useAppState();
    const [route, setRoute] = useAppNavigation();
    const [isSignUp, setSignUp] = useState<boolean>(false);
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [passwordSecond, setPasswordSecond] = useState<string>();

    let isValid = validateUsername(username) && validatePassword(password);

    if (isSignUp) {
        isValid = isValid && password === passwordSecond;
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({type: 'resetError'});
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({type: 'resetError'});
        setPassword(e.target.value);
    };

    const handlePasswordSecondChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch({type: 'resetError'});
        setPasswordSecond(e.target.value);
    };

    const handleChangeAuthType = () => {
        dispatch({type: 'resetError'});
        setUsername(undefined);
        setPassword(undefined);
        setSignUp(!isSignUp);
    };

    const submit = () => {
        if (!isValid) {
            return;
        }
        dispatch({
            type: isSignUp ? 'signUp' : 'signIn',
            payload: {
                username,
                password,
            },
        });
        setRoute('/');
    };

    return (
        <Box
            component='form'
            sx={{
                '& .MuiTextField-root': {m: 1, width: '25ch'},
            }}
            display='flex'
            justifyContent='center'
            flexDirection='column'
            alignItems='center'
            minHeight='100vh'
            noValidate
            autoComplete='off'>
            <Typography variant='h4' sx={{m: 1}}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
            </Typography>
            <form onSubmit={submit}>
                <div>
                    <TextField
                        id='username'
                        label='Username'
                        variant='outlined'
                        value={username}
                        onChange={handleUsernameChange}
                        error={!!username && !validateUsername(username)}
                    />
                </div>
                <div>
                    <TextField
                        id='password'
                        label='Password'
                        variant='outlined'
                        type='password'
                        value={password}
                        onChange={handlePasswordChange}
                        error={!!password && !validatePassword(password)}
                    />
                </div>
                {isSignUp && (
                    <div>
                        <TextField
                            id='repeat-password'
                            label='Repeat password'
                            variant='outlined'
                            type='password'
                            value={passwordSecond}
                            onChange={handlePasswordSecondChange}
                            error={
                                (!!passwordSecond &&
                                    !validatePassword(passwordSecond)) ||
                                (!!passwordSecond && password !== passwordSecond)
                            }
                        />
                    </div>
                )}
            </form>
            {!!state.error && (
                <Typography variant='body2' color={red[500]}>
                    {state.error}
                </Typography>
            )}
            <div>
                <Button
                    sx={{m: 1}}
                    variant='contained'
                    onClick={submit}
                    disabled={!isValid}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
            </div>
            <div>
                <Link
                    variant='body2'
                    href='#'
                    onClick={(e) => {
                        e.preventDefault();
                        handleChangeAuthType();
                    }}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </Link>
            </div>
        </Box>
    );
};
