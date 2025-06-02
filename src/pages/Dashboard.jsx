import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import ApperIcon from '../components/ApperIcon';
import DashboardMetrics from '../components/features/DashboardMetrics';
import RecentActivities from '../components/features/RecentActivities';
import SalesChart from '../components/features/SalesChart';
import { formatCurrency } from '../utils/formatters';
import contactService from '../services/contactService';
import dealService from '../services/dealService';
import activityService from '../services/activityService';
import { toast } from 'sonner';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [contactsData, dealsData, activitiesData] = await Promise.all([
          contactService.fetchContacts(),
          dealService.fetchDeals(),
          activityService.fetchActivities()
        ]);
        
        setContacts(contactsData);
        setDeals(dealsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalDealsValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const completedActivities = activities.filter(activity => activity.completed).length;
  const pendingActivities = activities.filter(activity => !activity.completed).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardMetrics />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <SalesChart />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="crm-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Target" className="h-5 w-5 text-crm-blue-500" />
                Pipeline Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deals.map((deal) => (
                <div key={deal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate">{deal.title}</span>
                    <span className="text-muted-foreground">{deal.probability}%</span>
                  </div>
                  <Progress value={deal.probability} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(deal.value)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <RecentActivities />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;