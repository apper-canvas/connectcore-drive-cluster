import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import ApperIcon from '../ApperIcon';
import { formatCurrency } from '../../utils/formatters';
import contactService from '../../services/contactService';
import dealService from '../../services/dealService';
import activityService from '../../services/activityService';

const DashboardMetrics = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        setLoading(true);
        const [contactsData, dealsData, activitiesData] = await Promise.all([
          contactService.fetchContacts(),
          dealService.fetchDeals(),
          activityService.fetchActivities()
        ]);
        setContacts(contactsData);
        setDeals(dealsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="crm-card">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
);
  }

  const metrics = [
    {
      title: 'Total Contacts',
      value: contacts.length,
      icon: 'Users',
      color: 'text-crm-blue-600',
      bgColor: 'bg-crm-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Deals',
      value: deals.length,
      icon: 'TrendingUp',
      color: 'text-crm-teal-600',
      bgColor: 'bg-crm-teal-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(deals.reduce((sum, deal) => sum + (deal.value || 0), 0)),
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending Activities',
      value: activities.filter(activity => !activity.completed).length,
      icon: 'Clock',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-5%',
      changeType: 'negative'
    }
  ];
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div key={metric.title} variants={itemVariants}>
          <Card className="crm-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <ApperIcon 
                    name={metric.icon} 
                    className={`h-6 w-6 ${metric.color}`} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardMetrics;