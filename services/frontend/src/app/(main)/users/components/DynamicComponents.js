import dynamic from 'next/dynamic';

// Tạo loading component tái sử dụng cho các modal
const ModalLoading = () => (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary border-t-transparent"></div>
  </div>
);

// SearchBar dynamic import
export const SearchBar = dynamic(() => import('./SearchBar'), {
  loading: () => <div className="w-[200px] h-10 bg-default-100 rounded animate-pulse" />,
  ssr: false,
});

// DeleteUserModal dynamic import
export const DeleteUserModal = dynamic(() => import('./DeleteUserModal'), {
  loading: () => <ModalLoading />,
  ssr: false,
});

// ChangePasswordModal dynamic import
export const ChangePasswordModal = dynamic(() => import('./ChangePasswordModal'), {
  loading: () => <ModalLoading />,
  ssr: false,
});

// ToggleStatusModal dynamic import
export const ToggleStatusModal = dynamic(() => import('./ToggleStatusModal'), {
  loading: () => <ModalLoading />,
  ssr: false,
});

// EditUserModal dynamic import
export const EditUserModal = dynamic(() => import('./EditUserModal'), {
  loading: () => <ModalLoading />,
  ssr: false,
});
