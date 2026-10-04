import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowRight, RefreshCw, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { currentRole, switchRole, demoMode, showToast } = useApp();
  const location = useLocation();

  const normalizedCurrent = currentRole === 'patron' ? 'citizen' : currentRole;
  const isAllowed = allowedRoles.some((r) => r === currentRole || (r === 'citizen' && currentRole === 'patron') || (r === 'patron' && currentRole === 'citizen'));

  if (isAllowed) {
    return <>{children}</>;
  }

  // Target role title for prompt
  const targetRole = allowedRoles[0];
  const targetRoleTitle =
    targetRole === 'builder'
      ? 'Business Builder'
      : targetRole === 'partner'
      ? 'Skill Partner'
      : targetRole === 'connector'
      ? 'Community Connector'
      : 'Citizen';

  const defaultRoleRoute =
    currentRole === 'builder'
      ? '/business-builder'
      : currentRole === 'partner'
      ? '/skill-partner'
      : currentRole === 'connector'
      ? '/community-connector'
      : '/citizen';

  const handleSwitchAndProceed = () => {
    switchRole(targetRole);
    showToast(`Role switched to ${targetRoleTitle}. Access granted.`, 'success', 'Access Authorized');
  };

  return (
    <div className="p-6 sm:p-12 max-w-xl mx-auto w-full font-sans text-center my-12 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-5 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
        Role-Protected Operational Area
      </span>

      <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22] mt-3 font-sans">
        Restricted to {targetRoleTitle}s
      </h2>

      <p className="text-xs sm:text-sm text-[#4A5D52] mt-2 leading-relaxed font-sans max-w-md mx-auto">
        Your current active identity is <strong className="capitalize text-[#01411C]">{currentRole}</strong>.
        This workflow module requires {targetRoleTitle} enterprise permissions to view or update.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {demoMode ? (
          <Button
            onClick={handleSwitchAndProceed}
            variant="executiveGreen"
            className="w-full sm:w-auto"
          >
            <span>Switch to {targetRoleTitle} & Continue</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : null}

        <Button
          onClick={() => window.location.assign(defaultRoleRoute)}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          <Compass className="w-4 h-4 mr-1.5" />
          <span>Return to My Dashboard</span>
        </Button>
      </div>
    </div>
  );
};
