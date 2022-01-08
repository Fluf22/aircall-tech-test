import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import classes from "./styles.module.css";
import { useAuth } from "../../hooks";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const [translate] = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        auth.signin(username, password, () => {
            navigate(from, { replace: true });
        });
    };

    return (
        <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className={classes.root}>
            <Grid item xs={12}>
                {translate("login.title")}
            </Grid>
            <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">{translate("login.form.username")}</label>
                    <input type={"text"} name={"username"} />
                    <label htmlFor="password">{translate("login.form.password")}</label>
                    <input type={"password"} name={"password"} />
                    <button type="submit">{translate("login.form.submit")}</button>
                </form>
            </Grid>
        </Grid>
    );
};

export default Login;