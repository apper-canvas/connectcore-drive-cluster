import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16">
        <motion.div
          initial={false}
          animate={{ 
            width: sidebarOpen ? '280px' : '80px',
            transition: { duration: 0.3, ease: 'easeInOut' }
          }}
          className="bg-sidebar border-r border-sidebar-border"
        >
          <Sidebar collapsed={!sidebarOpen} />
        </motion.div>
        
        <main className="flex-1 p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;