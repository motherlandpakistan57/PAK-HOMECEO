import React from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessBuilderDashboard } from '../builder/BusinessBuilderDashboard';
import { SkillPartnerDashboard } from '../partner/SkillPartnerDashboard';
import { ConnectorDashboard } from '../connector/ConnectorDashboard';
import { CitizenMarketplace } from '../patron/PatronMarketplace';

export const DashboardDispatcher: React.FC = () => {
  const { currentRole } = useApp();

  if (currentRole === 'builder') {
    return <BusinessBuilderDashboard />;
  }
  if (currentRole === 'partner') {
    return <SkillPartnerDashboard />;
  }
  if (currentRole === 'connector') {
    return <ConnectorDashboard />;
  }
  return <CitizenMarketplace />;
};
