import { useEffect } from 'react';
import { useAppNavigation } from '../AppNavigation';
import {useAppState} from '../AppState';
import {Auth} from './Auth';
import { Http404 } from './Http404';
import {Notes} from './Notes';

export const Content = () => {
    const [state] = useAppState();
    const [route, setRoute] = useAppNavigation();

    useEffect(() => {
        if (state.initialized && !state.user && route !== '/auth') {
            setRoute('/auth');
        }
    }, [state, route]);

    if (!state.initialized) {
        return null;
    }

    if (route.startsWith('/note')) {
        return <Notes />;
    }

    switch (route) {
        case '/':
            return <Notes />;
        case '/auth':
            return <Auth />;
        default:
            return <Http404 />;
    }
};
