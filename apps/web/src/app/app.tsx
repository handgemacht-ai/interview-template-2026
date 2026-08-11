import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';

import { theme } from '../common/theme';
import { Layout } from '../common/layout.component';
import { OrganizationsList } from '../modules/organizations/organizations-list.component';
import { ReportingPeriodsList } from '../modules/reporting-periods/reporting-periods-list.component';
import { EmissionEntriesList } from '../modules/emission-entries/emission-entries-list.component';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/organizations" replace />} />
            <Route path="/organizations" element={<OrganizationsList />} />
            <Route
              path="/organizations/:organizationId/reporting-periods"
              element={<ReportingPeriodsList />}
            />
            <Route
              path="/organizations/:organizationId/reporting-periods/:reportingPeriodId/emission-entries"
              element={<EmissionEntriesList />}
            />
          </Route>
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
