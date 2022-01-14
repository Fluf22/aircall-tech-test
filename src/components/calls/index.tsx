import { useTranslation } from "react-i18next";
import { Container, Grid, Typography } from "@mui/material";
import classes from "./styles.module.css";
import { useCallback, useEffect, useState } from "react";
import { fetchCalls } from "../../services";
import { Call, GetCallsResponse } from "../../interfaces";
import { useAuth } from "../../hooks";
import Pusher from "pusher-js";
import { isSameDay, PUSHER_APP_AUTH_ENDPOINT, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_CHANNEL_EVENT, PUSHER_CHANNEL_NAME } from "../../helpers";
import Pagination from "../pagination";
import LoadingOverlay from "../loading-overlay";
import CallSummary from "./call-summary";

const Calls = () => {
	const [translate] = useTranslation();
	const { accessToken } = useAuth();
	const [calls, setCalls] = useState<Call[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const handlePageUpdate = useCallback((offset: number, limit: number) => {
		setIsLoading(true);
		fetchCalls(accessToken, offset, limit).then((response: GetCallsResponse) => {
			setCalls(response.nodes);
			setTotalCount(response.totalCount);
		});
	}, [accessToken]);

	useEffect(() => {
		setFilteredCalls([...(calls ?? [])].sort((call, otherCall) => (new Date(otherCall.created_at)).getTime() - (new Date(call.created_at)).getTime()));
		setIsLoading(false);
	}, [calls]);

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
		<Container maxWidth="md" sx={{ height: "100%", minWidth: "375px" }}>
			<Grid container p={2} className={classes.root}>
				<Grid item xs={12} minHeight={"5vh"} height={"fit-content"} my={5}>
					<Typography
						variant={"h1"}
						sx={{
							fontSize: {
								xs: "33px",
								sm: "66px",
								md: "99px"
							}
						}}
					>
						{translate("calls.title")}
					</Typography>
				</Grid>
				<Grid item xs={12} container>
					{
						isLoading ? (
							<LoadingOverlay />
						) : filteredCalls.map((call: Call, idx: number) => (
							<Grid key={call.id} item container xs={12}>
								{
									(idx === 0 || !isSameDay(call.created_at, filteredCalls[idx - 1].created_at)) && (
										<Grid item xs={12} mt={3}>
											<Typography variant={"body1"}>{(new Date(call.created_at)).toLocaleDateString()}</Typography>
										</Grid>
									)
								}
								<CallSummary call={call} />
							</Grid>
						))
					}
				</Grid>
				<Grid item xs={12} sx={{ display: "flex", alignItems: "flex-end" }} mt={3}>
					<Pagination total={totalCount} handlePageUpdate={handlePageUpdate} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default Calls;