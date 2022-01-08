import { Box, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { ColorModeContext, useTheme } from "../../hooks";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingOverlay from "../loading-overlay";
import classes from './styles.module.css';
import AuthProvider from "../auth/auth-provider";

const ProtectedRoute = lazy(() => import("../auth/protected-route"));
const App = lazy(() => import("../app"));
const Login = lazy(() => import("../login"));
const Calls = lazy(() => import("../calls"));
const Archives = lazy(() => import("../archives"));

const Frame = () => {
	const { background, colorMode, theme } = useTheme();

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<StyledEngineProvider injectFirst>
					<Box sx={{ background }} className={classes.frame}>
						<AuthProvider>
							<BrowserRouter>
								<Routes>
									<Route path={"/"} element={
										<Suspense fallback={<LoadingOverlay />}>
											<App />
										</Suspense>
									} />
									<Route path={"/login"} element={
										<Suspense fallback={<LoadingOverlay />}>
											<Login />
										</Suspense>
									} />
									<Route path={"/calls"} element={
										<Suspense fallback={<LoadingOverlay />}>
											<ProtectedRoute>
												<Calls />
											</ProtectedRoute>
										</Suspense>
									} />
									<Route path={"/archives"} element={
										<Suspense fallback={<LoadingOverlay />}>
											<ProtectedRoute>
												<Archives />
											</ProtectedRoute>
										</Suspense>
									} />
								</Routes>
							</BrowserRouter>
						</AuthProvider>
					</Box>
				</StyledEngineProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default Frame;