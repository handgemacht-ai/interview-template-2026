import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { EmissionScope } from '@interview/common';
import type { IEmissionEntry } from '@interview/common';

export interface EmissionEntryFormValues {
  scope: EmissionScope;
  category: string;
  source: string;
  value: number;
  unit: string;
  description: string;
}

interface EmissionEntryEditDialogProps {
  open: boolean;
  onClose: (data: EmissionEntryFormValues | null) => void;
  emissionEntry?: IEmissionEntry | null;
}

export function EmissionEntryEditDialog({
  open,
  onClose,
  emissionEntry,
}: EmissionEntryEditDialogProps) {
  const { control, handleSubmit, reset } = useForm<EmissionEntryFormValues>({
    defaultValues: {
      scope: EmissionScope.SCOPE_1,
      category: '',
      source: '',
      value: 0,
      unit: 'tCO2e',
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        scope: emissionEntry?.scope ?? EmissionScope.SCOPE_1,
        category: emissionEntry?.category ?? '',
        source: emissionEntry?.source ?? '',
        value: emissionEntry?.value ?? 0,
        unit: emissionEntry?.unit ?? 'tCO2e',
        description: emissionEntry?.description ?? '',
      });
    }
  }, [open, emissionEntry, reset]);

  const onSubmit = (data: EmissionEntryFormValues) => {
    onClose({
      ...data,
      value: Number(data.value),
    });
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {emissionEntry ? 'Edit Emission Entry' : 'Create Emission Entry'}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="scope"
            control={control}
            rules={{ required: 'Scope is required' }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth margin="normal" error={!!error}>
                <InputLabel>Scope</InputLabel>
                <Select {...field} label="Scope">
                  <MenuItem value={EmissionScope.SCOPE_1}>Scope 1</MenuItem>
                  <MenuItem value={EmissionScope.SCOPE_2}>Scope 2</MenuItem>
                </Select>
                {error && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Category"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="source"
            control={control}
            rules={{ required: 'Source is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Source"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="value"
            control={control}
            rules={{
              required: 'Value is required',
              min: { value: 0, message: 'Value must be non-negative' },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Value"
                type="number"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="unit"
            control={control}
            rules={{ required: 'Unit is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Unit"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                placeholder="e.g. tCO2e"
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>Cancel</Button>
          <Button type="submit" variant="contained">
            {emissionEntry ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
