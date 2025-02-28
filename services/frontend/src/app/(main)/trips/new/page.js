'use client';

import { useUI } from '@/hooks/useUI';
import {
  resetDays,
  setScheduleTitle,
  setSettingsSchedule,
  setStarRating,
} from '@/store/slices/useDailyScheduleSlice';
import debounce from 'lodash/debounce';
import { ChevronLeft, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../../components/LoadingModal';
import ScheduleInfoTabs from '../components/ScheduleInfoTabs';

export default function NewTripPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notifyError } = useUI();

  // State management
  const [isReady, setIsReady] = useState(false);
  const [ResetDaysModal, setResetDaysModal] = useState(null);
  const [TemplateModal, setTemplateModal] = useState(null);
  const [PublishModal, setPublishModal] = useState(null);
  const [modalStates, setModalStates] = useState({
    isResetModalOpen: false,
    isTemplateModalOpen: false,
    isPublishModalOpen: false,
  });

  // Redux selectors
  const settings = useSelector((state) => state.dailySchedule.settings);
  const { numberOfDays, globalPax, starRating } = settings;
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);
  const { title } = useSelector((state) => state.dailySchedule.scheduleInfo);

  // console.log('scheduleItems', scheduleItems);

  // Modal loading functions
  const loadResetModal = async () => {
    try {
      const { default: ResetModalComponent } = await import(
        '../components/DailySchedule/components/ResetDaysModal'
      );
      setResetDaysModal(() => ResetModalComponent);
    } catch (error) {
      console.error('Failed to load ResetDaysModal:', error);
      notifyError('Không thể tải modal');
    }
  };

  const loadTemplateModal = async () => {
    try {
      const { default: TemplateModalComponent } = await import('../components/TemplateModal');
      setTemplateModal(() => TemplateModalComponent);
    } catch (error) {
      console.error('Failed to load TemplateModal:', error);
      notifyError('Không thể tải modal');
    }
  };

  const loadPublishModal = async () => {
    try {
      const { default: PublishModalComponent } = await import('../components/PublishModal');
      setPublishModal(() => PublishModalComponent);
    } catch (error) {
      console.error('Failed to load PublishModal:', error);
      notifyError('Không thể tải modal');
    }
  };

  // Modal toggle handler
  const toggleModal = useCallback((modalName, value) => {
    setModalStates((prev) => ({
      ...prev,
      [modalName]: value,
    }));
  }, []);

  // Debounced handlers
  const debouncedValidation = useCallback(
    debounce((value, existingDaysCount) => {
      if (value < existingDaysCount) {
        notifyError(`Số ngày không thể nhỏ hơn số ngày hiện tại (${existingDaysCount} ngày)`);
        return false;
      }
      return true;
    }, 1000),
    [notifyError]
  );

  const debouncedUpdateSettings = useCallback(
    debounce((field, value, currentSettings) => {
      dispatch(
        setSettingsSchedule({
          ...(field === 'numberOfDays'
            ? { numberOfDays: value, globalPax: currentSettings.globalPax }
            : { globalPax: value, numberOfDays: currentSettings.numberOfDays }),
        })
      );
    }, 200),
    [dispatch]
  );

  // Load initial resources
  useEffect(() => {
    const prepareResources = async () => {
      try {
        await Promise.all([
          import('../components/PublishModal'),
          import('../components/TemplateModal'),
          import('../components/DailySchedule/components/ResetDaysModal'),
        ]);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load resources:', error);
        notifyError('Có lỗi xảy ra khi tải trang');
      }
    };

    prepareResources();
  }, [notifyError]);

  // Event handlers
  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (!value) {
      debouncedUpdateSettings('numberOfDays', null, settings);
      return;
    }

    if (!/^\d+$/.test(value)) {
      notifyError('Vui lòng chỉ nhập số ngày');
      return;
    }

    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số ngày phải lớn hơn 0');
      return;
    }

    if (numValue > 35) {
      notifyError('Số ngày không lớn hơn 35');
      return;
    }

    debouncedUpdateSettings('numberOfDays', numValue, settings);
    debouncedValidation(numValue, Object.keys(scheduleItems).length);
  };

  const handleGuestsChange = (e) => {
    const value = e.target.value;
    if (!value) {
      debouncedUpdateSettings('globalPax', null, settings);
      return;
    }

    if (!/^\d+$/.test(value)) {
      notifyError('Vui lòng chỉ nhập số khách');
      return;
    }

    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số khách phải lớn hơn 0');
      return;
    }

    if (numValue > 100) {
      notifyError('Số khách không lớn hơn 100');
      return;
    }

    debouncedUpdateSettings('globalPax', numValue, settings);
  };

  const handleReset = async () => {
    if (!ResetDaysModal) {
      await loadResetModal();
    }
    toggleModal('isResetModalOpen', true);
  };

  const handleStarChange = (e) => {
    dispatch(setStarRating(parseInt(e.target.value, 10)));
  };

  const handleTitleChange = (e) => {
    dispatch(setScheduleTitle(e.target.value));
  };

  // Update modal handlers
  const handleTemplateModal = async () => {
    if (!TemplateModal) {
      await loadTemplateModal();
    }
    toggleModal('isTemplateModalOpen', true);
  };

  const handlePublishModal = async () => {
    if (!PublishModal) {
      await loadPublishModal();
    }
    toggleModal('isPublishModalOpen', true);
  };

  if (!isReady) {
    return <LoadingModal isOpen={true} />;
  }

  return (
    <Suspense fallback={<LoadingModal isOpen={true} />}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-none p-2">
          <div className="flex justify-start items-center">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-4 bg-gray-200 p-1 border-gray-200 rounded-lg">
              <button
                onClick={() => router.back()}
                className="hover:text-primary flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <span>/</span>
              <span>Trips</span>
              <span>/</span>
              <span>New Trip</span>
            </div>

            {/* Quick Create Form */}
            <form className="flex gap-6 items-center">
              <button
                type="button"
                onClick={handleTemplateModal}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Load Template
              </button>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-[200px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="VD: Hạ Long 3 ngày 2 đêm"
                />
              </div>
              <div>
                <select
                  value={starRating}
                  onChange={handleStarChange}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={3}>3 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={5}>5 ⭐</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="w-[80px] px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Days"
                  value={numberOfDays || ''}
                  onChange={handleDaysChange}
                />
                {numberOfDays > 1 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Reset to default"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <input
                  type="text"
                  className="w-[80px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Pax"
                  value={globalPax || ''}
                  onChange={handleGuestsChange}
                />
              </div>
              <button
                type="button"
                onClick={handlePublishModal}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                Publish
              </button>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<LoadingModal isOpen={true} />}>
            <ScheduleInfoTabs />
          </Suspense>
        </div>

        {/* Modals */}
        {modalStates.isResetModalOpen && ResetDaysModal && (
          <ResetDaysModal
            isOpen={modalStates.isResetModalOpen}
            onClose={() => toggleModal('isResetModalOpen', false)}
            onConfirm={() => {
              dispatch(resetDays());
              toggleModal('isResetModalOpen', false);
            }}
          />
        )}

        {modalStates.isTemplateModalOpen && TemplateModal && (
          <TemplateModal
            isOpen={modalStates.isTemplateModalOpen}
            onClose={() => toggleModal('isTemplateModalOpen', false)}
          />
        )}

        {modalStates.isPublishModalOpen && PublishModal && (
          <PublishModal
            isOpen={modalStates.isPublishModalOpen}
            onClose={() => toggleModal('isPublishModalOpen', false)}
          />
        )}
      </div>
    </Suspense>
  );
}
