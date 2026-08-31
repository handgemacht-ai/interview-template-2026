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
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { EmissionScope } from '@interview/common';
import type { IEmissionEntry } from '@interview/common';
import { useEmissionEntriesQuery } from './emission-entries.queries';
import {
  useCreateEmissionEntry,
  useUpdateEmissionEntry,
  useDeleteEmissionEntry,
} from './emission-entries.mutations';
import { useOrganizationQuery } from '../organizations/organizations.queries';
import { EmissionEntryEditDialog, type EmissionEntryFormValues } from './emission-entry-edit.dialog';
import { useDialogState } from '../../common/use-dialog-state';

function getScopeChipProps(scope: EmissionScope) {
  switch (scope) {
    case EmissionScope.SCOPE_1:
      return { label: 'Scope 1', color: 'primary' as const, sx: { backgroundColor: '#1976d2', color: '#fff' } };
    case EmissionScope.SCOPE_2:
      return { label: 'Scope 2', color: 'warning' as const, sx: { backgroundColor: '#ed6c02', color: '#fff' } };
    default:
      return { label: scope, color: 'default' as const, sx: {} };
  }
}

export function EmissionEntriesList() {
  const { organizationId, reportingPeriodId } = useParams<{
    organizationId: string;
    reportingPeriodId: string;
  }>();

  const { data: organization } = useOrganizationQuery(organizationId!);
  const {
    data: entries,
    isLoading,
    error,
  } = useEmissionEntriesQuery(organizationId!, reportingPeriodId!);

  const createMutation = useCreateEmissionEntry(
    organizationId!,
    reportingPeriodId!
  );
  const updateMutation = useUpdateEmissionEntry(
    organizationId!,
    reportingPeriodId!
  );
  const deleteMutation = useDeleteEmissionEntry(
    organizationId!,
    reportingPeriodId!
  );

  const createDialog = useDialogState<null>();
  const editDialog = useDialogState<IEmissionEntry>();

  const handleCreateClose = (data: EmissionEntryFormValues | null) => {
    if (data) {
      createMutation.mutate(data);
    }
    createDialog.closeDialog();
  };

  const handleEditClose = (data: EmissionEntryFormValues | null) => {
    if (data && editDialog.data) {
      updateMutation.mutate({
        id: editDialog.data.id,
        data,
      });
    }
    editDialog.closeDialog();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm('Are you sure you want to delete this emission entry?')
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
        Failed to load emission entries. Please try again.
      </Alert>
    );
  }

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/organizations" underline="hover">
          Organizations
        </MuiLink>
        <MuiLink
          component={Link}
          to={`/organizations/${organizationId}/reporting-periods`}
          underline="hover"
        >
          {organization?.name ?? 'Loading...'}
        </MuiLink>
        <Typography color="text.primary">Emission Entries</Typography>
      </Breadcrumbs>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Emission Entries</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => createDialog.openDialog(null)}
        >
          Add Entry
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scope</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Source</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries && entries.length > 0 ? (
              entries.map((entry) => {
                const chipProps = getScopeChipProps(entry.scope);
                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Chip size="small" label={chipProps.label} sx={chipProps.sx} />
                    </TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>{entry.source}</TableCell>
                    <TableCell align="right">
                      {entry.value.toLocaleString()}
                    </TableCell>
                    <TableCell>{entry.unit}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => editDialog.openDialog(entry)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(entry.id, e)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No emission entries yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EmissionEntryEditDialog
        open={createDialog.isOpen}
        onClose={handleCreateClose}
      />
      <EmissionEntryEditDialog
        open={editDialog.isOpen}
        onClose={handleEditClose}
        emissionEntry={editDialog.data}
      />
    </>
  );
}
