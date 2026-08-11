import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { IReportingPeriod } from '@interview/common';
import { useReportingPeriodsQuery } from './reporting-periods.queries';
import {
  useCreateReportingPeriod,
  useUpdateReportingPeriod,
  useDeleteReportingPeriod,
} from './reporting-periods.mutations';
import { useOrganizationQuery } from '../organizations/organizations.queries';
import { ReportingPeriodEditDialog } from './reporting-period-edit.dialog';
import { useDialogState } from '../../common/use-dialog-state';

export function ReportingPeriodsList() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();

  const { data: organization } = useOrganizationQuery(organizationId!);
  const {
    data: reportingPeriods,
    isLoading,
    error,
  } = useReportingPeriodsQuery(organizationId!);

  const createMutation = useCreateReportingPeriod(organizationId!);
  const updateMutation = useUpdateReportingPeriod(organizationId!);
  const deleteMutation = useDeleteReportingPeriod(organizationId!);

  const createDialog = useDialogState<null>();
  const editDialog = useDialogState<IReportingPeriod>();

  const handleCreateClose = (
    data: { year: number; startDate: string; endDate: string } | null
  ) => {
    if (data) {
      createMutation.mutate(data);
    }
    createDialog.closeDialog();
  };

  const handleEditClose = (
    data: { year: number; startDate: string; endDate: string } | null
  ) => {
    if (data && editDialog.data) {
      updateMutation.mutate({ id: editDialog.data.id, data });
    }
    editDialog.closeDialog();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm('Are you sure you want to delete this reporting period?')
    ) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load reporting periods. Please try again.
      </Alert>
    );
  }

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/organizations" underline="hover">
          Organizations
        </MuiLink>
        <Typography color="text.primary">
          {organization?.name ?? 'Loading...'}
        </Typography>
      </Breadcrumbs>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Reporting Periods</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => createDialog.openDialog(null)}
        >
          Add Period
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Year</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportingPeriods && reportingPeriods.length > 0 ? (
              reportingPeriods.map((rp) => (
                <TableRow
                  key={rp.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(
                      `/organizations/${organizationId}/reporting-periods/${rp.id}/emission-entries`
                    )
                  }
                >
                  <TableCell>{rp.year}</TableCell>
                  <TableCell>
                    {new Date(rp.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(rp.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        editDialog.openDialog(rp);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(rp.id, e)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No reporting periods yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ReportingPeriodEditDialog
        open={createDialog.isOpen}
        onClose={handleCreateClose}
      />
      <ReportingPeriodEditDialog
        open={editDialog.isOpen}
        onClose={handleEditClose}
        reportingPeriod={editDialog.data}
      />
    </>
  );
}
