import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

interface IAppNavigationCtx {
    route: string;
    setRoute: (route: string) => void;
}

export const AppNavigationCtx = createContext<IAppNavigationCtx>({
    route: '/',
    setRoute: () => {},
});

interface IAppNavigationProvider {
    children?: ReactNode;
}

export const AppNavigationProvider: FC<IAppNavigationProvider> = ({
    children,
}) => {
    const [route, setRoute] = useState(window.location.pathname);

    useEffect(() => {
        const listener = () => {
            setRoute(window.location.pathname);
        };
        window.addEventListener('popstate', listener);
        return () => {
            window.removeEventListener('popstate', listener);
        };
    }, []);

    useEffect(() => {
        if (window.location.pathname !== route) {
            window.history.pushState({}, '', route);
        }
    }, [route]);
    
    return (
        <AppNavigationCtx.Provider value={{route, setRoute}}>
            {children}
        </AppNavigationCtx.Provider>
    );
};

export const useAppNavigation = (): [route: string, setRoute: (route: string) => void] => {
    const {route, setRoute} = useContext(AppNavigationCtx);
    return [route, setRoute];
};
