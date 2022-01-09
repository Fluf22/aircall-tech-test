import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import classes from "./styles.module.css";
import { useEffect, useState } from "react";
import { fetchCalls } from "../../services";
import { Call, GetCallsResponse } from "../../interfaces";
import { useAuth } from "../../hooks";

const Calls = () => {
	const [translate] = useTranslation();
	const { accessToken } = useAuth();
	const [calls, setCalls] = useState<Call[]>([]);
	const [hasNextPage, setHasNextPage] = useState<boolean>(false);
	const [totalCount, setTotalCount] = useState<number>(0);

	useEffect(() => {
		fetchCalls(accessToken).then((response: GetCallsResponse) => {
			setCalls(response.nodes);
			setHasNextPage(response.hasNextPage);
			setTotalCount(response.totalCount);
		});
	}, [accessToken]);

	return (
		<Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className={classes.root}>
			<Grid item xs={12}>
				{translate("calls.title")}
			</Grid>
			{
				calls.map(call => (
					<Grid key={call.id} item xs={12}>{call.id}</Grid>
				))
			}
		</Grid>
	);
};

export default Calls;