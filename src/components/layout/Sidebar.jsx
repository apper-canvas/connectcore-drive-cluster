import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'BarChart3' },
  { name: 'Contacts', href: '/contacts', icon: 'Users' },
  { name: 'Pipeline', href: '/pipeline', icon: 'Workflow' },
  { name: 'Activities', href: '/activities', icon: 'Calendar' },
];

const Sidebar = ({ collapsed }) => {
  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground'
              )
            }
          >
            <ApperIcon name={item.icon} className="h-5 w-5 shrink-0" />
            <motion.span
              initial={false}
              animate={{
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : 'auto',
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.name}
            </motion.span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;