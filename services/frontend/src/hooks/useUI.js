import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  showNotification,
  clearNotification,
  toggleTheme,toggleSidebar,
  openModal,
  closeModal,
} from '@/store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);

  if (!ui) {
    return {
      isLoading: false,notification: null,
      theme: 'light',
      sidebarOpen: true,
      modal: { isOpen: false, type: null, data: null },
      setLoading: () => {},
      notify: () => {},
      clearNotification: () => {},
      toggleTheme: () => {},
      toggleSidebar: () => {},
      openModal: () => {},
      closeModal: () => {},
    };
  }

  const notify = (message, type = 'info') => {
    dispatch(
      showNotification({
        message,
        type,
        id: Date.now(),
        duration: 3000,
      })
    );
  };

  return {
    // States
    isLoading: ui.isLoading,
    notification: ui.notification,
    theme: ui.theme,
    sidebarOpen: ui.sidebarOpen,
    modal: ui.modal,

    // Actions
    setLoading: (loading) => dispatch(setLoading(loading)),
    notify,
    notifySuccess: (message) => notify(message, 'success'),
    notifyError: (message) => notify(message, 'error'),
    notifyInfo: (message) => notify(message, 'info'),
    notifyWarning: (message) => notify(message, 'warning'),
    clearNotification: () => dispatch(clearNotification()),
    toggleTheme: () => dispatch(toggleTheme()),
    toggleSidebar: () => dispatch(toggleSidebar()),
    openModal: (type, data) => dispatch(openModal({ type, data })),
    closeModal: () => dispatch(closeModal()),
  };
};
