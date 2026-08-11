import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import type { IOrganization } from '@interview/common';

interface OrganizationFormValues {
  name: string;
}

interface OrganizationEditDialogProps {
  open: boolean;
  onClose: (data: OrganizationFormValues | null) => void;
  organization?: IOrganization | null;
}

export function OrganizationEditDialog({
  open,
  onClose,
  organization,
}: OrganizationEditDialogProps) {
  const { control, handleSubmit, reset } = useForm<OrganizationFormValues>({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ name: organization?.name ?? '' });
    }
  }, [open, organization, reset]);

  const onSubmit = (data: OrganizationFormValues) => {
    onClose(data);
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {organization ? 'Edit Organization' : 'Create Organization'}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                autoFocus
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>Cancel</Button>
          <Button type="submit" variant="contained">
            {organization ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
