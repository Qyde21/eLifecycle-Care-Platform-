import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HubSpokeNavigator } from './components/HubSpokeNavigator';
import { MPesaModal } from './components/MPesaModal';
import { DeviceRegistryModal } from './components/DeviceRegistryModal';
import { ToastContainer } from './components/ToastContainer';
import { TestingSpoke } from './components/spokes/TestingSpoke';
import { ScreeningSpoke } from './components/spokes/ScreeningSpoke';
import { RepairBookingSpoke } from './components/spokes/RepairBookingSpoke';
import { SparesMarketplaceSpoke } from './components/spokes/SparesMarketplaceSpoke';
import { PerformanceSpoke } from './components/spokes/PerformanceSpoke';
import { CircularitySpoke } from './components/spokes/CircularitySpoke';
import { InsuranceSpoke } from './components/spokes/InsuranceSpoke';
import { AnalyticsSpoke } from './components/spokes/AnalyticsSpoke';

import { 
  INITIAL_DEVICES, 
  INITIAL_SPARES, 
  INITIAL_REPAIRS, 
  INITIAL_CIRCULARITY, 
  INITIAL_POLICIES,
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { 
  Device, 
  SpokeId, 
  SparePart, 
  RepairBooking, 
  InsurancePolicy, 
  LifecycleStage,
  AppNotification,
  NotificationType 
} from './types';
import { 
  getBrowserNotificationPermission, 
  requestBrowserNotificationPermission, 
  sendBrowserNotification, 
  playNotificationSound,
  createNotification 
} from './services/notificationService';

const REPAIR_STEP_LABELS = [
  'Booking Confirmed',
  'Intake & ESD Check',
  'Micro-Soldering & Component Overhaul',
  'QA Bench Testing & Thermal Telemetry',
  'Ready for Dispatch / Pickup',
];

export default function App() {
  const [activeSpoke, setActiveSpoke] = useState<SpokeId>('overview');
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [activeDevice, setActiveDevice] = useState<Device>(INITIAL_DEVICES[0]);
  const [sparesList, setSparesList] = useState<SparePart[]>(INITIAL_SPARES);
  const [activeRepairs, setActiveRepairs] = useState<RepairBooking[]>(INITIAL_REPAIRS);
  const [circularityCredits, setCircularityCredits] = useState<number>(2450);
  const [circularityRecords] = useState(INITIAL_CIRCULARITY);
  const [policies, setPolicies] = useState<InsurancePolicy[]>(INITIAL_POLICIES);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Check browser notification permission on mount
  useEffect(() => {
    setBrowserPermission(getBrowserNotificationPermission());
  }, []);

  // Dispatch Notification (Audio chime + native browser notification + in-app toast + center history)
  const dispatchNotification = useCallback((params: {
    type: NotificationType;
    title: string;
    message: string;
    spokeTarget?: SpokeId;
    metadata?: AppNotification['metadata'];
  }) => {
    const notif = createNotification(params);

    // 1. Play synthesized chime
    playNotificationSound(params.type);

    // 2. Dispatch native browser push notification
    sendBrowserNotification(params.title, {
      body: params.message,
      type: params.type,
      onClick: () => {
        if (params.spokeTarget) {
          setActiveSpoke(params.spokeTarget);
        }
      },
    });

    // 3. Add to notification center history
    setNotifications((prev) => [notif, ...prev]);

    // 4. Trigger in-app floating toast
    setToasts((prev) => [notif, ...prev.slice(0, 3)]);

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== notif.id));
    }, 6000);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRequestPermission = async () => {
    const status = await requestBrowserNotificationPermission();
    setBrowserPermission(status);
    if (status === 'granted') {
      dispatchNotification({
        type: 'system',
        title: 'Browser Notifications Activated',
        message: 'You will now receive desktop and background alerts for live repair bench updates and insurance policy changes.',
        spokeTarget: 'overview',
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Modals state
  const [mpesaModal, setMpesaModal] = useState<{
    isOpen: boolean;
    amount: number;
    purpose: string;
    ref: string;
    onSuccessCallback?: () => void;
  }>({
    isOpen: false,
    amount: 0,
    purpose: '',
    ref: '',
  });

  const [deviceModalOpen, setDeviceModalOpen] = useState(false);

  // Spoke Handlers
  const handleNavigateSpoke = (spoke: SpokeId) => {
    setActiveSpoke(spoke);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMPesa = (amount: number, purpose: string, ref: string, onSuccessCallback?: () => void) => {
    setMpesaModal({
      isOpen: true,
      amount,
      purpose,
      ref,
      onSuccessCallback,
    });
  };

  const handleAddDevice = (newDev: Device) => {
    setDevices((prev) => [newDev, ...prev]);
    setActiveDevice(newDev);
    dispatchNotification({
      type: 'system',
      title: 'New Asset Registered',
      message: `${newDev.name} (${newDev.serialNumber}) added to Unified Registry with health score of ${newDev.healthScore}%.`,
      spokeTarget: 'overview',
      metadata: { deviceId: newDev.id },
    });
  };

  const handleUpdateDeviceStage = (deviceId: string, newStage: LifecycleStage, newScore: number) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? { ...d, lifecycleStage: newStage, healthScore: newScore }
          : d
      )
    );
    if (activeDevice.id === deviceId) {
      setActiveDevice((prev) => ({ ...prev, lifecycleStage: newStage, healthScore: newScore }));
    }
  };

  // Repair Updates & Notification Triggers
  const handleAddNewRepair = (newBooking: RepairBooking) => {
    setActiveRepairs((prev) => [newBooking, ...prev]);
    dispatchNotification({
      type: 'repair',
      title: `EMROC Repair Booked: ${newBooking.id}`,
      message: `Reserved slot at ${newBooking.facilityName} for ${newBooking.deviceName}. Assigned to ${newBooking.technicianName}.`,
      spokeTarget: 'repair',
      metadata: {
        repairId: newBooking.id,
        deviceId: newBooking.deviceId,
        stepIndex: newBooking.currentStepIndex,
        stepLabel: REPAIR_STEP_LABELS[newBooking.currentStepIndex],
      },
    });
  };

  const handleAdvanceRepairStep = (repairId: string) => {
    setActiveRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          const nextIndex = (r.currentStepIndex + 1) % REPAIR_STEP_LABELS.length;
          const nextLabel = REPAIR_STEP_LABELS[nextIndex];
          const newNotes = [
            `Bench Milestone updated to "${nextLabel}" at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
            ...(r.technicianNotes || []),
          ];

          // Trigger browser + in-app notification
          dispatchNotification({
            type: 'repair',
            title: `Repair Milestone: ${nextLabel}`,
            message: `${r.deviceName} (${r.id}) advanced to step ${nextIndex + 1}/${REPAIR_STEP_LABELS.length}: "${nextLabel}".`,
            spokeTarget: 'repair',
            metadata: {
              repairId: r.id,
              deviceId: r.deviceId,
              stepIndex: nextIndex,
              stepLabel: nextLabel,
            },
          });

          return {
            ...r,
            currentStepIndex: nextIndex,
            technicianNotes: newNotes,
            status: nextIndex === 4 ? 'delivered' : nextIndex === 3 ? 'qa-bench-testing' : nextIndex === 2 ? 'micro-soldering' : 'intake',
          };
        }
        return r;
      })
    );
  };

  const handleResetRepairStep = (repairId: string) => {
    setActiveRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          dispatchNotification({
            type: 'repair',
            title: `Repair Status Reset: ${r.id}`,
            message: `${r.deviceName} reset to Intake & ESD Check milestone for diagnostic replay.`,
            spokeTarget: 'repair',
            metadata: { repairId: r.id, deviceId: r.deviceId, stepIndex: 1 },
          });
          return {
            ...r,
            currentStepIndex: 1,
            status: 'intake',
          };
        }
        return r;
      })
    );
  };

  // Insurance Updates & Notification Triggers
  const handleActivatePolicy = (policy: InsurancePolicy) => {
    setPolicies((prev) => [policy, ...prev]);
    handleUpdateDeviceStage(policy.deviceId, 'active-care', 95);

    dispatchNotification({
      type: 'insurance',
      title: `ELCI Policy Activated: ${policy.tier}`,
      message: `${policy.tier} coverage active for ${policy.deviceName} (${policy.policyId}). Zero out-of-pocket micro-soldering.`,
      spokeTarget: 'insurance',
      metadata: {
        policyId: policy.policyId,
        deviceId: policy.deviceId,
        tier: policy.tier,
      },
    });
  };

  const handleClaimSubmitted = (device: Device) => {
    dispatchNotification({
      type: 'insurance',
      title: 'ELCI Auto-Claim Pre-Approved',
      message: `Diagnostic telemetry pre-verified 100% coverage for ${device.name}. Direct EMROC repair intake voucher generated.`,
      spokeTarget: 'repair',
      metadata: {
        deviceId: device.id,
      },
    });
  };

  const handleSimulatePolicyTelemetry = (policy: InsurancePolicy) => {
    dispatchNotification({
      type: 'insurance',
      title: `ELCI Telemetry Recalibration: ${policy.policyId}`,
      message: `Live IoT sensor audit confirmed 92% operating efficiency on ${policy.deviceName}. Applied 14% loyalty credit to next renewal.`,
      spokeTarget: 'insurance',
      metadata: {
        policyId: policy.policyId,
        deviceId: policy.deviceId,
        tier: policy.tier,
      },
    });
  };

  const handleTriggerTestNotification = (type: NotificationType) => {
    if (type === 'repair') {
      dispatchNotification({
        type: 'repair',
        title: 'EMROC Bench QA Update',
        message: `${activeDevice.name} passed 4-hour thermal burn-in test. Micro-soldering solder joints verified 100% IPC Class 3.`,
        spokeTarget: 'repair',
        metadata: { deviceId: activeDevice.id, stepLabel: 'QA Bench Testing' },
      });
    } else if (type === 'insurance') {
      dispatchNotification({
        type: 'insurance',
        title: 'ELCI Policy Coverage Update',
        message: `Annual health inspection certificate issued for ${activeDevice.name}. Monthly premium updated with cleanroom discount.`,
        spokeTarget: 'insurance',
        metadata: { deviceId: activeDevice.id, tier: 'Comprehensive Protection' },
      });
    } else {
      dispatchNotification({
        type: 'system',
        title: 'Ecosystem Care Heartbeat',
        message: 'All 8 spokes connected to Central MRO Hub. 4 EMROC facilities reporting zero bench queue backlog.',
        spokeTarget: 'overview',
      });
    }
  };

  const handleAddCredits = (amount: number) => {
    setCircularityCredits((prev) => prev + amount);
  };

  const handleRedeemCredits = (amount: number) => {
    setCircularityCredits((prev) => Math.max(0, prev - amount));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        activeSpoke={activeSpoke}
        onSelectSpoke={handleNavigateSpoke}
        devices={devices}
        activeDevice={activeDevice}
        onSelectDevice={setActiveDevice}
        onOpenRegisterModal={() => setDeviceModalOpen(true)}
        circularityCredits={circularityCredits}
        notifications={notifications}
        browserPermission={browserPermission}
        onRequestPermission={handleRequestPermission}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onTriggerTestNotification={handleTriggerTestNotification}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeSpoke === 'overview' && (
          <HubSpokeNavigator
            activeDevice={activeDevice}
            onSelectSpoke={handleNavigateSpoke}
            circularityCredits={circularityCredits}
          />
        )}

        {activeSpoke === 'testing' && (
          <TestingSpoke
            activeDevice={activeDevice}
            onNavigateSpoke={handleNavigateSpoke}
            onOpenMPesa={handleOpenMPesa}
          />
        )}

        {activeSpoke === 'screening' && (
          <ScreeningSpoke
            activeDevice={activeDevice}
            onNavigateSpoke={handleNavigateSpoke}
            onUpdateDeviceStage={handleUpdateDeviceStage}
          />
        )}

        {activeSpoke === 'repair' && (
          <RepairBookingSpoke
            activeDevice={activeDevice}
            activeRepairs={activeRepairs}
            onAddNewRepair={handleAddNewRepair}
            onAdvanceRepairStep={handleAdvanceRepairStep}
            onResetRepairStep={handleResetRepairStep}
            onNavigateSpoke={handleNavigateSpoke}
          />
        )}

        {activeSpoke === 'spares' && (
          <SparesMarketplaceSpoke
            activeDevice={activeDevice}
            sparesList={sparesList}
            onOpenMPesa={handleOpenMPesa}
            onNavigateSpoke={handleNavigateSpoke}
          />
        )}

        {activeSpoke === 'performance' && (
          <PerformanceSpoke
            activeDevice={activeDevice}
            onNavigateSpoke={handleNavigateSpoke}
          />
        )}

        {activeSpoke === 'circularity' && (
          <CircularitySpoke
            activeDevice={activeDevice}
            circularityRecords={circularityRecords}
            circularityCreditsBalance={circularityCredits}
            onAddCredits={handleAddCredits}
            onRedeemCredits={handleRedeemCredits}
            onNavigateSpoke={handleNavigateSpoke}
          />
        )}

        {activeSpoke === 'insurance' && (
          <InsuranceSpoke
            activeDevice={activeDevice}
            policies={policies}
            onActivatePolicy={handleActivatePolicy}
            onOpenMPesa={handleOpenMPesa}
            onNavigateSpoke={handleNavigateSpoke}
            onClaimSubmitted={handleClaimSubmitted}
            onSimulatePolicyTelemetry={handleSimulatePolicyTelemetry}
          />
        )}

        {activeSpoke === 'analytics' && (
          <AnalyticsSpoke
            devices={devices}
            onNavigateSpoke={handleNavigateSpoke}
          />
        )}
      </main>

      {/* Floating In-App Toast Alert Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        onNavigateSpoke={handleNavigateSpoke}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-300">eLifecycle Care MRO Ecosystem</span>
            <span>• Verified Cleanroom Operations</span>
          </div>
          <p>
            Compliant with Kenya NEMA, ISO 14064 Carbon Auditing & Basel Convention WEEE Protocols.
          </p>
        </div>
      </footer>

      {/* M-Pesa Checkout Modal */}
      <MPesaModal
        isOpen={mpesaModal.isOpen}
        amountKsh={mpesaModal.amount}
        purpose={mpesaModal.purpose}
        referenceNumber={mpesaModal.ref}
        onClose={() => setMpesaModal((prev) => ({ ...prev, isOpen: false }))}
        onPaymentSuccess={() => {
          // Grant complimentary circularity credits
          handleAddCredits(Math.round(mpesaModal.amount * 0.05));
          if (mpesaModal.onSuccessCallback) {
            mpesaModal.onSuccessCallback();
          }
        }}
      />

      {/* Device Registry Modal */}
      <DeviceRegistryModal
        isOpen={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
        onAddDevice={handleAddDevice}
      />
    </div>
  );
}

