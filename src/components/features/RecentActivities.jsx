import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ApperIcon from '../ApperIcon';
import { useCRM } from '../../context/CRMContext';
import { activityTypes } from '../../constants/crmData';
import { formatDateTime } from '../../utils/formatters';

const RecentActivities = () => {
  const { state } = useCRM();

  const recentActivities = state.activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getContactName = (contactId) => {
    const contact = state.contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const getActivityIcon = (type) => {
    const activityType = activityTypes.find(t => t.id === type);
    return activityType ? activityType.icon : 'Calendar';
  };

  return (
    <Card className="crm-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Activity" className="h-5 w-5 text-crm-blue-500" />
          Recent Activities
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-lg ${activity.completed ? 'bg-green-100' : 'bg-crm-blue-100'}`}>
                  <ApperIcon 
                    name={getActivityIcon(activity.type)} 
                    className={`h-4 w-4 ${activity.completed ? 'text-green-600' : 'text-crm-blue-600'}`} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    {activity.completed && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{getContactName(activity.contactId)}</span>
                    <span>{formatDateTime(activity.dueDate)}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm">
<Button variant="ghost" size="sm">
                  <ApperIcon name="ExternalLink" className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
            No recent activities found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;