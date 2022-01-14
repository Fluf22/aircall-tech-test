
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { AppBar, Button, CircularProgress, Dialog, DialogContent, Grid, Grow, IconButton, TextField, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth, useTheme } from '../../hooks';
import { Call, Note } from '../../interfaces';
import CloseIcon from '@mui/icons-material/Close';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import AddIcon from '@mui/icons-material/Add';
import { humanReadableDuration } from '../../helpers';
import { addNote, triggerArchiveStatus } from '../../services';
import SendIcon from '@mui/icons-material/Send';
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';

interface CallDetailsProps {
    call: Call;
};

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} />;
});

const CallDetails = ({ call }: CallDetailsProps) => {
    const [translate] = useTranslation();
    const { theme } = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [noteContent, setNoteContent] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const auth = useAuth();

    useEffect(() => {
        setTitle(`${translate(`calls.call-direction.${call.direction}`)} - ${call.direction === "outbound" ? call.to : call.from}`)
    }, [call, translate]);

    const handleClose = () => {
        if (!isLoading) {
            setDialogOpen(false);
            setNoteContent(undefined);
        }
    };

    const triggerStatus = () => {
        setIsLoading(true);
        triggerArchiveStatus(auth.accessToken, call.id).finally(() => {
            setIsLoading(false);
        });
    };

    const sendNote = () => {
        setIsLoading(true);
        addNote(auth.accessToken, call.id, noteContent!).finally(() => {
            setNoteContent(undefined);
            setIsLoading(false);
        });
    };

    const sendAndArchiveNote = () => {
        setIsLoading(true);
        addNote(auth.accessToken, call.id, noteContent!).then(() => triggerArchiveStatus(auth.accessToken, call.id)).finally(() => {
            setNoteContent(undefined);
            setIsLoading(false);
        });
    };

    return (
        <>
            <Tooltip title={translate("calls.call-details-button") || ""}>
                <IconButton size={"small"} aria-label={translate("calls.call-details-button")} onClick={() => setDialogOpen(true)} sx={{ p: 0 }} disabled={isLoading}>
                    <OpenInFullIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                fullScreen={fullScreen}
                open={isDialogOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                            disabled={isLoading}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {title}
                        </Typography>
                        {
                            isLoading ? (
                                <CircularProgress sx={{ color: "white", width: "30px !important", height: "30px !important" }} />
                            ) : (
                                <Button color="inherit" onClick={() => triggerStatus()} disabled={isLoading}>
                                    {
                                        call.is_archived ? (
                                            <UnarchiveIcon />
                                        ) : (
                                            <ArchiveIcon />
                                        )
                                    }
                                </Button>
                            )
                        }
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Grid container mt={2}>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.id")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"caption"}>{call.id}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.direction")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{translate(`calls.call-direction.${call.direction}`)}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.from")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{call.from}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.to")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{call.to}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.via")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{call.via}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.created-at")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{(new Date(call.created_at)).toLocaleString()}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.duration")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{humanReadableDuration(call.duration)}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.call-type")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{translate(`calls.call-type.${call.call_type}`)}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container alignItems={"center"} mb={2}>
                            <Grid item xs>
                                <Typography variant={"caption"}>{translate("calls.call-details.is-archived")} </Typography>
                            </Grid>
                            <Grid item xs={"auto"}>
                                <Typography variant={"body1"}>{translate(`calls.call-details.archive-status.${call.is_archived}`)}</Typography>
                            </Grid>
                        </Grid>
                        {
                            call.notes.map((note: Note, idx: number) => (
                                <Grid key={note.id} item xs={12} mb={2}>
                                    <TextField
                                        label={translate("calls.call-details.note-title") + ` ${idx + 1}`}
                                        multiline
                                        minRows={4}
                                        defaultValue={note.content}
                                        variant={"outlined"}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                            ))
                        }
                        {
                            noteContent === undefined ? (
                                <Grid item xs={12}>
                                    <Button variant={"contained"} color={"primary"} sx={{ width: "100%" }} disabled={isLoading} onClick={() => setNoteContent("")}>
                                        <AddIcon />
                                    </Button>
                                </Grid>
                            ) : (
                                <Grid item xs={12} container>
                                    <Grid item xs={12} mb={2}>
                                        <TextField
                                            label={translate("calls.call-details.new-note")}
                                            multiline
                                            minRows={4}
                                            value={noteContent}
                                            onChange={({ target: { value } }) => setNoteContent(value)}
                                            variant={"outlined"}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} container justifyContent={"flex-end"}>
                                        <Grid item>
                                            <Button variant={"contained"} color={"primary"} disabled={isLoading} onClick={() => sendNote()}>
                                                <SendIcon />
                                            </Button>
                                        </Grid>
                                        {
                                            call.is_archived === false ? (
                                                <Grid item ml={2}>
                                                    <Button variant={"contained"} color={"primary"} disabled={isLoading} onClick={() => sendAndArchiveNote()}>
                                                        <SendAndArchiveIcon />
                                                    </Button>
                                                </Grid>
                                            ) : undefined
                                        }
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CallDetails;