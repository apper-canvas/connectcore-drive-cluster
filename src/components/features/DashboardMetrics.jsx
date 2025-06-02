import { Card, CardContent } from '../ui/card';
import ApperIcon from '../ApperIcon';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';

const DashboardMetrics = () => {
  const { state } = useCRM();

  const metrics = [
    {
      title: 'Total Contacts',
      value: state.contacts.length,
      icon: 'Users',
      color: 'text-crm-blue-600',
      bgColor: 'bg-crm-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Deals',
      value: state.deals.length,
      icon: 'TrendingUp',
      color: 'text-crm-teal-600',
      bgColor: 'bg-crm-teal-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(state.deals.reduce((sum, deal) => sum + deal.value, 0)),
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending Activities',
      value: state.activities.filter(activity => !activity.completed).length,
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