import { CssBaseline, ThemeProvider } from "@mui/material";
import { defaultTheme } from "./utils/Constants";
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";
import { Lobby, Main, Game } from "./pages";
import Popups from "./components/popup/Popups";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Popups />}>
            <Route index element={<Main />} />
            <Route path="lobby" element={<Lobby />} />
            <Route path="game" element={<Game />} />
            <Route path="game/:roomId" element={<Game />} />
        </Route>
    )
);

function App() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
