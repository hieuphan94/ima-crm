import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  showNotification,
  clearNotification,
  toggleTheme,
  toggleSidebar,
  openModal,
  closeModal
} from '@/store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);

  const notify = (message, type = 'info') => {
    console.log('Showing notification:', { message, type }); // Debug log
    dispatch(showNotification({ message, type }));
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
    clearNotification: () => dispatch(clearNotification()),
    toggleTheme: () => dispatch(toggleTheme()),
    toggleSidebar: () => dispatch(toggleSidebar()),
    openModal: (type, data) => dispatch(openModal({ type, data })),
    closeModal: () => dispatch(closeModal())
  };
}; 