import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import classes from "./styles.module.css";

const App = () => {
	const [translate] = useTranslation();
	return (
		<Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className={classes.root}>
			{translate("welcome")}
		</Grid>
	);
};

export default App;