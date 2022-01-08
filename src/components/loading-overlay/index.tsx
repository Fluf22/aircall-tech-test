import { Box, CircularProgress } from "@mui/material";
import classes from './styles.module.css';

const LoadingOverlay = () => {
	return (
		<Box className={classes.overlay}>
			<CircularProgress className={classes.loader}/>
		</Box>
	);
};

export default LoadingOverlay;