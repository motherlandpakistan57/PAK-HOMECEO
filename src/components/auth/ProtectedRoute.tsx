import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  // Automatically redirect unauthorized roles to their authorized role workspace
  return <Navigate to={defaultRoleRoute} replace />;
};
