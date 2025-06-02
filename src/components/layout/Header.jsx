import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ApperIcon from '../ApperIcon';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const Header = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="hover:bg-sidebar-accent"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 crm-gradient rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-crm-blue-600 to-crm-teal-600 bg-clip-text text-transparent">
              ConnectCore
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts, deals..."
              className="pl-10 w-80 bg-background/50"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-sidebar-accent"
          >
            <ApperIcon name={theme === 'dark' ? 'Sun' : 'Moon'} className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-sidebar-accent">
            <ApperIcon name="Bell" className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-sidebar-accent">
            <ApperIcon name="User" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;