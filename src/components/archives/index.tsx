import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import classes from "./styles.module.css";

const Archives = () => {
	const [translate] = useTranslation();
	return (
		<Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className={classes.root}>
			{translate("archives.title")}
		</Grid>
	);
};

export default Archives;