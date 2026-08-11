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
import type { IReportingPeriod } from '@interview/common';

interface ReportingPeriodFormValues {
  year: number;
  startDate: string;
  endDate: string;
}

interface ReportingPeriodEditDialogProps {
  open: boolean;
  onClose: (data: ReportingPeriodFormValues | null) => void;
  reportingPeriod?: IReportingPeriod | null;
}

function formatDate(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0];
}

export function ReportingPeriodEditDialog({
  open,
  onClose,
  reportingPeriod,
}: ReportingPeriodEditDialogProps) {
  const { control, handleSubmit, reset } = useForm<ReportingPeriodFormValues>({
    defaultValues: {
      year: new Date().getFullYear(),
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        year: reportingPeriod?.year ?? new Date().getFullYear(),
        startDate: reportingPeriod
          ? formatDate(reportingPeriod.startDate)
          : '',
        endDate: reportingPeriod ? formatDate(reportingPeriod.endDate) : '',
      });
    }
  }, [open, reportingPeriod, reset]);

  const onSubmit = (data: ReportingPeriodFormValues) => {
    onClose({ ...data, year: Number(data.year) });
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {reportingPeriod
            ? 'Edit Reporting Period'
            : 'Create Reporting Period'}
        </DialogTitle>
        <DialogContent>
          <Controller
            name="year"
            control={control}
            rules={{
              required: 'Year is required',
              min: { value: 2000, message: 'Year must be 2000 or later' },
              max: { value: 2100, message: 'Year must be 2100 or earlier' },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Year"
                type="number"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                autoFocus
              />
            )}
          />
          <Controller
            name="startDate"
            control={control}
            rules={{ required: 'Start date is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Start Date"
                type="date"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            rules={{ required: 'End date is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="End Date"
                type="date"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>Cancel</Button>
          <Button type="submit" variant="contained">
            {reportingPeriod ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
