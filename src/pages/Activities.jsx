import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import ApperIcon from '../components/ApperIcon';
import { useCRM } from '../context/CRMContext';
import { activityTypes } from '../constants/crmData';
import { formatDate, formatDateTime } from '../utils/formatters';
import { toast } from 'sonner';

const Activities = () => {
  const { state, dispatch } = useCRM();
  const [filter, setFilter] = useState('all');

  const getActivitiesByFilter = () => {
    switch (filter) {
      case 'pending':
        return state.activities.filter(activity => !activity.completed);
      case 'completed':
        return state.activities.filter(activity => activity.completed);
      case 'overdue':
        return state.activities.filter(activity => 
          !activity.completed && new Date(activity.dueDate) < new Date()
        );
      default:
        return state.activities;
    }
  };

  const handleToggleComplete = (activityId) => {
    const activity = state.activities.find(a => a.id === activityId);
    if (activity) {
      dispatch({
        type: 'UPDATE_ACTIVITY',
        payload: {
          ...activity,
          completed: !activity.completed
        }
      });
      toast.success(activity.completed ? 'Activity marked as pending' : 'Activity completed');
    }
  };

  const getContactName = (contactId) => {
    const contact = state.contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const getActivityIcon = (type) => {
    const activityType = activityTypes.find(t => t.id === type);
    return activityType ? activityType.icon : 'Calendar';
  };

  const getActivityColor = (activity) => {
    if (activity.completed) return 'text-green-600';
    if (new Date(activity.dueDate) < new Date()) return 'text-red-600';
    return 'text-orange-600';
  };

  const filteredActivities = getActivitiesByFilter().sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

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
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activities</h1>
          <p className="text-muted-foreground">Manage your tasks and follow-ups</p>
        </div>
        <Button className="crm-button-primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {filteredActivities.map((activity) => (
                <motion.div key={activity.id} variants={itemVariants}>
                  <Card className="crm-card hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={activity.completed}
                          onCheckedChange={() => handleToggleComplete(activity.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${activity.completed ? 'bg-green-100' : 'bg-crm-blue-100'}`}>
                                <ApperIcon 
                                  name={getActivityIcon(activity.type)} 
                                  className={`h-4 w-4 ${getActivityColor(activity)}`} 
                                />
                              </div>
                              <div>
                                <h3 className={`font-semibold ${activity.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                  {activity.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {activity.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {activityTypes.find(t => t.id === activity.type)?.name}
                              </Badge>
                              {new Date(activity.dueDate) < new Date() && !activity.completed && (
                                <Badge variant="destructive">Overdue</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <ApperIcon name="User" className="h-4 w-4" />
                              <span>{getContactName(activity.contactId)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ApperIcon name="Calendar" className="h-4 w-4" />
                              <span>{formatDateTime(activity.dueDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ApperIcon name="Clock" className="h-4 w-4" />
                              <span>Created {formatDate(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ApperIcon name="MoreHorizontal" className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredActivities.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <ApperIcon name="Calendar" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {filter === 'all' ? 'No activities yet' : `No ${filter} activities`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? "Get organized by adding your first activity" 
                    : `You don't have any ${filter} activities right now`
                  }
                </p>
                {filter === 'all' && (
                  <Button className="crm-button-primary">
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Your First Activity
                  </Button>
                )}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="crm-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-crm-blue-600">
                {state.activities.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </CardContent>
          </Card>
          <Card className="crm-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {state.activities.filter(a => !a.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="crm-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {state.activities.filter(a => a.completed).length}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="crm-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {state.activities.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length}
              </div>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Activities;