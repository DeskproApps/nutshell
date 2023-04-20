import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main";

import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

import { LoadingSpinner } from "@deskpro/app-sdk";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import { Suspense } from "react";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { query } from "./utils/query";
import { ViewList } from "./pages/ViewList/ViewList";
import { Redirect } from "./components/Redirect/Redirect";

function App() {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <div>
      <HashRouter>
        <QueryClientProvider client={query}>
          <Suspense fallback={<LoadingSpinner />}>
            <QueryErrorResetBoundary>
              {({ reset }) => (
                <ErrorBoundary
                  onReset={reset}
                  FallbackComponent={ErrorFallback}
                >
                  <Routes>
                    <Route path="/">
                      <Route index element={<Main />} />
                      <Route path="view">
                        <Route
                          path=":objectName/:objectId"
                          element={<ViewList />}
                        />
                      </Route>
                      <Route path="redirect" element={<Redirect />} />
                    </Route>
                  </Routes>
                </ErrorBoundary>
              )}
            </QueryErrorResetBoundary>
          </Suspense>
        </QueryClientProvider>
      </HashRouter>
    </div>
  );
}

export default App;
