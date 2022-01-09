import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import classes from "./styles.module.css";
import { useEffect, useState } from "react";
import { fetchCalls } from "../../services";
import { Call, GetCallsResponse } from "../../interfaces";
import { useAuth } from "../../hooks";
import Pusher from "pusher-js";
import { PUSHER_APP_AUTH_ENDPOINT, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_CHANNEL_EVENT, PUSHER_CHANNEL_NAME } from "../../helpers";

const Calls = () => {
	const [translate] = useTranslation();
	const { accessToken } = useAuth();
	const [calls, setCalls] = useState<Call[]>([]);
	const [hasNextPage, setHasNextPage] = useState<boolean>(false);
	const [totalCount, setTotalCount] = useState<number>(0);

	useEffect(() => {
		const pusher = new Pusher(PUSHER_APP_KEY, {
			cluster: PUSHER_APP_CLUSTER,
			authEndpoint: PUSHER_APP_AUTH_ENDPOINT,
			auth: { headers: { "Authorization": `Bearer ${accessToken}` } }
		});
		const channel = pusher.subscribe(PUSHER_CHANNEL_NAME);
		channel.bind(PUSHER_CHANNEL_EVENT, (data: any) => {
			console.log("Data from push event: ", data);
		});
		return () => channel.unbind(PUSHER_CHANNEL_EVENT).unsubscribe();
	}, [accessToken]);

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