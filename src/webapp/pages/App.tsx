import { useConfig } from "@dhis2/app-runtime";
import { MuiThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { LoadingProvider, SnackbarProvider } from "d2-ui-components";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { HashRouter } from "react-router-dom";
import i18n from "../../locales";
import { CompositionRoot } from "../CompositionRoot";
import { AppContextProvider } from "../contexts/app-context";
import { AppRoute } from "../router/AppRoute";
import { Router } from "../router/Router";
import muiThemeLegacy from "../themes/dhis2-legacy.theme";
import { muiTheme } from "../themes/dhis2.theme";
import "./App.css";
import { FinalPage } from "./final/FinalPage";
import { HomePage } from "./home/HomePage";
import { SummaryPage } from "./summary/SummaryPage";
import { TutorialPage } from "./tutorial/TutorialPage";
import { WelcomePage } from "./welcome/WelcomePage";

export const routes: AppRoute[] = [
    {
        key: "home",
        name: () => i18n.t("Home"),
        defaultRoute: true,
        paths: ["/"],
        element: <HomePage />,
        backdrop: true,
    },
    {
        key: "welcome",
        name: () => i18n.t("Welcome"),
        paths: ["/tutorial/:key", "/tutorial/:key/welcome"],
        element: <WelcomePage />,
        backdrop: true,
    },
    {
        key: "tutorial",
        name: () => i18n.t("Tutorial"),
        paths: ["/tutorial/:key/:step/:content"],
        element: <TutorialPage />,
    },
    {
        key: "contents",
        name: () => i18n.t("Contents"),
        paths: ["/tutorial/:key/contents"],
        element: <SummaryPage completed={false} />,
        backdrop: true,
    },
    {
        key: "final",
        name: () => i18n.t("Final"),
        paths: ["/tutorial/:key/final"],
        element: <FinalPage />,
        backdrop: true,
    },
    {
        key: "summary",
        name: () => i18n.t("Summary"),
        paths: ["/tutorial/:key/summary"],
        element: <SummaryPage completed={true} />,
        backdrop: true,
    },
];

const App = () => {
    const { baseUrl } = useConfig();
    const compositionRoot = new CompositionRoot();

    return (
        <AppContextProvider baseUrl={baseUrl} routes={routes} compositionRoot={compositionRoot}>
            <StylesProvider injectFirst>
                <MuiThemeProvider theme={muiTheme}>
                    <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                        <SnackbarProvider>
                            <LoadingProvider>
                                <div id="app" className="content">
                                    <HashRouter>
                                        <Router />
                                    </HashRouter>
                                </div>
                            </LoadingProvider>
                        </SnackbarProvider>
                    </OldMuiThemeProvider>
                </MuiThemeProvider>
            </StylesProvider>
        </AppContextProvider>
    );
};

export default React.memo(App);