import { Box, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { ColorModeContext, useTheme } from "../../hooks";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingOverlay from "../loading-overlay";
import classes from './styles.module.css';

const App = lazy(() => import("../app"));

const Frame = () => {
	const { background, colorMode, theme } = useTheme();

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<StyledEngineProvider injectFirst>
					<Box sx={{ background }} className={classes.frame}>
						<BrowserRouter>
							<Routes>
								<Route path={"*"} element={
									<Suspense fallback={<LoadingOverlay/>}>
										<App/>
									</Suspense>
								}/>
							</Routes>
						</BrowserRouter>
					</Box>
				</StyledEngineProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default Frame;