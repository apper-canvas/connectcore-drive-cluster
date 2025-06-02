import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import ApperIcon from '../ApperIcon';
import { formatCurrency, formatDate } from '../../utils/formatters';

const DealCard = ({ deal, contacts, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const contact = contacts.find(c => c.id === deal.contactId);
  const contactName = contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`crm-card cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 ${
        isDragging ? 'rotate-3 scale-105 shadow-lg' : ''
      }`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-sm text-foreground line-clamp-2">
            {deal.title}
          </h4>
          <ApperIcon name="GripVertical" className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <div className="text-lg font-bold text-crm-blue-600">
            {formatCurrency(deal.value)}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{deal.probability}% probability</span>
            <Badge variant="outline" className="text-xs">
              {formatDate(deal.expectedCloseDate)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ApperIcon name="User" className="h-3 w-3" />
            <span className="truncate">{contactName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;