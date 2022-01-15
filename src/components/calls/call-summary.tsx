import { Divider, Grid, Tooltip, Typography } from "@mui/material";
import { Call } from "../../interfaces";
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import CallIcon from '@mui/icons-material/Call';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CallDetails from "./call-details";

interface CallProps {
    call: Call;
};

const CallSummary = ({ call }: CallProps) => {
    const [translate] = useTranslation();
    const [isOutbound, setIsOutbound] = useState<boolean>(false);
    const [callDateTime, setCallDateTime] = useState<string>("");

    useEffect(() => {
        if (call.direction === "outbound") {
            setIsOutbound(true);
        } else {
            setIsOutbound(false);
        }
        setCallDateTime((new Date(call.created_at)).toLocaleString());
    }, [call]);

    return (
        <Grid item xs={12} container>
            <Grid item xs={12} my={2}>
                <Divider />
            </Grid>
            <Grid item xs={8} container>
                <Grid item xs={3}>
                    <Tooltip title={translate(`calls.call-direction.${call.direction}`) || ""}>
                        {
                            isOutbound ? (
                                <CallMadeIcon data-testid={"call-summary-made-icon"} />
                            ) : (
                                <CallReceivedIcon data-testid={"call-summary-received-icon"} />
                            )
                        }
                    </Tooltip>
                </Grid>
                <Grid item xs={9} container>
                    <Grid item xs={12}>
                        <Typography data-testid={"call-summary-number"} variant={"h6"} color={call.call_type === "missed" ? "red" : "inherit"}>
                            {
                                isOutbound ? call.to : call.from
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container alignItems={"center"}>
                        <Grid item lineHeight={0.7} mr={1}>
                            <Tooltip title={translate(`calls.call-type.${call.call_type}`) || ""}>
                                {
                                    call.call_type === "missed" ? (
                                        <CallMissedIcon data-testid={"call-summary-missed-icon"} />
                                    ) : call.call_type === "voicemail" ? (
                                        <VoicemailIcon data-testid={"call-summary-voicemail-icon"} />
                                    ) : (
                                        <CallIcon data-testid={"call-summary-answered-icon"} />
                                    )
                                }
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <Typography variant={"caption"} color={"darkgrey"} data-testid={"call-summary-datetime"}>{callDateTime}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4} container justifyContent={"flex-end"}>
                <Grid item mr={1}>
                    {
                        call.is_archived ? (
                            <Tooltip title={translate("calls.call-archived") || ""}>
                                <ArchiveIcon data-testid={"call-summary-archive-icon"} />
                            </Tooltip>
                        ) : undefined
                    }
                </Grid>
                <Grid item>
                    <CallDetails call={call} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CallSummary;