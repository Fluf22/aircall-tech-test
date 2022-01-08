import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/open-sans";
import "./index.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { CssBaseline } from "@mui/material";
import Frame from "./components/frame";
import "./i18n";

ReactDOM.render(
	<React.StrictMode>
		<CssBaseline/>
		<Frame/>
	</React.StrictMode>,
	document.getElementById("root")
);

serviceWorkerRegistration.register();