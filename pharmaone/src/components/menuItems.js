// menuItems.js
import DashboardLogo from '../assets/svgs/Dashboard.svg';
import InventoryLogo from '../assets/svgs/Inventory.svg';
import ReportsLogo from '../assets/svgs/Reports.svg';
import GroupsLogo from '../assets/svgs/Groups.svg';
import ConfigurationsLogo from '../assets/svgs/Configurations.svg';
import OngoingOrdersLogo from '../assets/svgs/Ongoing Orders.svg';
import ContactLogo from '../assets/svgs/Contact Management.svg';
import NotificationsLogo from '../assets/svgs/Notifications.svg';
import HelpLogo from '../assets/svgs/Help.svg';
import AppSettingsLogo from '../assets/svgs/Application Settings.svg';
import CovidLogo from '../assets/svgs/Covid.svg';

export const menuItems = [
  { label: 'Dashboards', icon: DashboardLogo, path: '/dashboard' },
  { label: 'Inventory', icon: InventoryLogo, path: '/inventory' },
  { label: 'Reports', icon: ReportsLogo, path: '/reports' },
  { label: 'Groups', icon: GroupsLogo, path: '/groups' },
  { label: 'Configuration', icon: ConfigurationsLogo, path: '/configuration' },
  { label: 'Ongoing Orders', icon: OngoingOrdersLogo, path: '/ongoing-orders' },
  { label: 'Contact Management', icon: ContactLogo, path: '/contact-management' },
  { label: 'Notifications', icon: NotificationsLogo, path: '/notifications' },
  { label: 'Help & Support', icon: HelpLogo, path: '/help-support' },
  { label: 'Application Settings', icon: AppSettingsLogo, path: '/app-settings' },
  { label: 'Covid-19', icon: CovidLogo, path: '/covid-19' },
];
