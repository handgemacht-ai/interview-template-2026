import { useState, useCallback } from 'react';

interface DialogState<T> {
  isOpen: boolean;
  data: T | null;
  openDialog: (data: T) => void;
  closeDialog: () => void;
}

export function useDialogState<T>(): DialogState<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openDialog = useCallback((data: T) => {
    setData(data);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return { isOpen, data, openDialog, closeDialog };
}
