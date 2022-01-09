import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import classes from "./styles.module.css";
import { useCallback, useEffect, useState } from "react";
import { fetchCalls } from "../../services";
import { Call, GetCallsResponse } from "../../interfaces";
import { useAuth } from "../../hooks";
import Pusher from "pusher-js";
import { PUSHER_APP_AUTH_ENDPOINT, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_CHANNEL_EVENT, PUSHER_CHANNEL_NAME } from "../../helpers";
import Pagination from "../pagination";
import LoadingOverlay from "../loading-overlay";

const Calls = () => {
	const [translate] = useTranslation();
	const { accessToken } = useAuth();
	const [calls, setCalls] = useState<Call[] | undefined>(undefined);
	const [totalCount, setTotalCount] = useState<number>(0);

	const handlePageUpdate = useCallback((offset: number, limit: number) => {
		setCalls(undefined);
		fetchCalls(accessToken, offset, limit).then((response: GetCallsResponse) => {
			setCalls(response.nodes);
			setTotalCount(response.totalCount);
		});
	}, [accessToken]);

	useEffect(() => {
		const pusher = new Pusher(PUSHER_APP_KEY, {
			cluster: PUSHER_APP_CLUSTER,
			authEndpoint: PUSHER_APP_AUTH_ENDPOINT,
			auth: { headers: { "Authorization": `Bearer ${accessToken}` } }
		});
		const channel = pusher.subscribe(PUSHER_CHANNEL_NAME);
		channel.bind(PUSHER_CHANNEL_EVENT, (updatedCall: Call) => {
			setCalls(callList => callList?.map(call => call.id === updatedCall.id ? updatedCall : call));
		});
		return () => channel.unbind(PUSHER_CHANNEL_EVENT).unsubscribe();
	}, [accessToken]);

	return (
		<Grid container direction={"row"} className={classes.root}>
			<Grid item xs={12}>
				{translate("calls.title")}
			</Grid>
			<Grid item container justifyContent={'flex-start'} alignItems={'flex-start'}>
				<Grid item xs={12} alignSelf={'flex-end'}>
					<Pagination total={totalCount} handlePageUpdate={handlePageUpdate} />
				</Grid>
				{
					calls === undefined ? (
						<LoadingOverlay />
					) : calls.map(call => (
						<Grid key={call.id} item xs={12}>{call.id}</Grid>
					))
				}
			</Grid>
		</Grid>
	);
};

export default Calls;