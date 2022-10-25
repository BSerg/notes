import Box from '@mui/material/Box';
import {AppNavigationProvider} from './AppNavigation';
import {AppStateProvider} from './AppState';
import {Content} from './components/Content';
import {Header} from './components/Header';

const App = () => {
    return (
        <AppNavigationProvider>
            <AppStateProvider>
                <Box sx={{flexGrow: 1}}>
                    <Header />
                    <Content />
                </Box>
            </AppStateProvider>
        </AppNavigationProvider>
    );
};

export default App;
