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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { IOrganization } from '@interview/common';
import { useOrganizationsQuery } from './organizations.queries';
import {
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
} from './organizations.mutations';
import { OrganizationEditDialog } from './organization-edit.dialog';
import { useDialogState } from '../../common/use-dialog-state';

export function OrganizationsList() {
  const navigate = useNavigate();
  const { data: organizations, isLoading, error } = useOrganizationsQuery();
  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const createDialog = useDialogState<null>();
  const editDialog = useDialogState<IOrganization>();

  const handleCreateClose = (data: { name: string } | null) => {
    if (data) {
      createMutation.mutate(data);
    }
    createDialog.closeDialog();
  };

  const handleEditClose = (data: { name: string } | null) => {
    if (data && editDialog.data) {
      updateMutation.mutate({ id: editDialog.data.id, data });
    }
    editDialog.closeDialog();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this organization?')) {
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
        Failed to load organizations. Please try again.
      </Alert>
    );
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Organizations</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => createDialog.openDialog(null)}
        >
          Add Organization
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations && organizations.length > 0 ? (
              organizations.map((org) => (
                <TableRow
                  key={org.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(
                      `/organizations/${org.id}/reporting-periods`
                    )
                  }
                >
                  <TableCell>{org.name}</TableCell>
                  <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        editDialog.openDialog(org);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(org.id, e)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No organizations yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <OrganizationEditDialog
        open={createDialog.isOpen}
        onClose={handleCreateClose}
      />
      <OrganizationEditDialog
        open={editDialog.isOpen}
        onClose={handleEditClose}
        organization={editDialog.data}
      />
    </>
  );
}
