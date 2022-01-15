import { Box, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { ColorModeContext, useTheme } from "../../hooks";
import { BrowserRouter } from "react-router-dom";
import classes from './styles.module.css';
import AuthProvider from "../auth/auth-provider";

interface FrameProps {
	children: JSX.Element;
}

const Frame = ({ children }: FrameProps) => {
	const { background, colorMode, theme } = useTheme();

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<StyledEngineProvider injectFirst>
					<Box sx={{ background }} className={classes.frame}>
						<BrowserRouter>
							<AuthProvider>
								{children}
							</AuthProvider>
						</BrowserRouter>
					</Box>
				</StyledEngineProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
};

export default Frame;