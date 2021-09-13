import React, {Suspense} from "react";

const App = React.lazy(() => import(/* webpackPrefetch: true */ "./components/App"));

export const AppMount: React.FC = () => {
    return <Suspense fallback={<div>Loading...</div>}>
        <App/>
    </Suspense>;
};
