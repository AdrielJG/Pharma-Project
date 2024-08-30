// menuItems.js
import DashboardLogo from '../../assets/svgs/Dashboard.svg';
import Compliance from '../../assets/svgs/Compliance.svg';
import ReportsLogo from '../../assets/svgs/Reports.svg';
import GroupsLogo from '../../assets/svgs/Groups.svg';
import ConfigurationsLogo from '../../assets/svgs/Configurations.svg';
import Quality from '../../assets/svgs/Quality.svg';
import ContactLogo from '../../assets/svgs/Contact Management.svg';
import NotificationsLogo from '../../assets/svgs/Notifications.svg';
import HelpLogo from '../../assets/svgs/Help.svg';

export const menuItems = [
  { label: 'Dashboards', icon: DashboardLogo, path: '/dashboard' },
  { label: 'Compliance Checks', icon: Compliance, path: '/compliance' },
  { label: 'Quality Checks', icon: Quality, path: '/qualityrec' },
  { label: 'Reports', icon: ReportsLogo, path: '/reports' },
  { label: 'Groups', icon: GroupsLogo, path: '/groups' },
  { label: 'Configuration', icon: ConfigurationsLogo, path: '/configuration' },
  { label: 'Notifications', icon: NotificationsLogo, path: '/notifications' },
  { label: 'Help & Support', icon: HelpLogo, path: '/contactus' },
];
