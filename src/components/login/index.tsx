import { useTranslation } from "react-i18next";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, TextField } from "@mui/material";
import classes from "./styles.module.css";
import { useAuth } from "../../hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface LoginFormSchema {
    username: string;
    password: string;
    honeypot?: string;
}

const loginFormSchema = yup.object({
    honeypot: yup.string().notRequired(),
    username: yup.string().required().max(128),
    password: yup.string().required().max(128)
});

const Login = () => {
    const [translate] = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, formState: { errors }, handleSubmit } = useForm<LoginFormSchema>({
        resolver: yupResolver(loginFormSchema)
    });

    const from = (location.state as any)?.from?.pathname || "/";

    const onFormSubmit = (data: LoginFormSchema) => {
        if (data.honeypot === "") {
            auth.signin(data.username, data.password, () => {
                navigate(from, { replace: true });
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    return (
        <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className={classes.root}>
            <Grid item xs={12} sm={6} lg={3} mx={2}>
                <form onSubmit={handleSubmit(onFormSubmit)} name={"login-form"} data-testid={"login-form"}>
                    <Card elevation={4}>
                        <CardHeader title={translate("login.title")} />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} className={classes.honeypot}>
                                    <label htmlFor={"honeypot"}>Honeypot</label>
                                    <input type={"text"} id={"honeypot"} {...register("honeypot")} className={classes.honeypot} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        type={"text"}
                                        id={"username"}
                                        variant={"outlined"}
                                        color={"primary"}
                                        label={translate("login.form.username")}
                                        inputProps={register("username")}
                                        error={Boolean(errors.username)}
                                        helperText={Boolean(errors.username) ? translate("login.form.error.username") : " "}
                                        FormHelperTextProps={{
                                            "data-testid": "username-helper-text"
                                        } as any}
                                        autoComplete={"username"}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        type={"password"}
                                        id={"password"}
                                        variant={"outlined"}
                                        color={"primary"}
                                        label={translate("login.form.password")}
                                        inputProps={{
                                            ...register("password"),
                                            "data-testid": "password-input"
                                        }}
                                        error={Boolean(errors.password)}
                                        helperText={Boolean(errors.password) ? translate("login.form.error.password") : " "}
                                        FormHelperTextProps={{
                                            "data-testid": "password-helper-text"
                                        } as any}
                                        autoComplete={"current-password"}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Grid container justifyContent={"flex-end"}>
                                <Grid item>
                                    <Button
                                        type={"submit"}
                                        variant={"contained"}
                                        disabled={isLoading}
                                    >
                                        {translate("login.form.submit")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Card>
                </form>
            </Grid>
        </Grid>
    );
};

export default Login;