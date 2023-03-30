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

import {
  LoadingSpinner,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import { Suspense, useEffect, useRef, useState } from "react";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { query } from "./utils/query";

function App() {
  const [bodyHeight, setBodyHeight] = useState(document.body.clientHeight);

  const bodyRef = useRef();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setBodyHeight(entries[0].contentRect.height);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    resizeObserver.observe(bodyRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useInitialisedDeskproAppClient((client) => {
    client?.setHeight(bodyHeight);
  });

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <div ref={bodyRef}>
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
