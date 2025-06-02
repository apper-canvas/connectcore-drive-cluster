import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ApperIcon from '../components/ApperIcon';
import { useCRM } from '../context/CRMContext';
import { dealStages } from '../constants/crmData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import DealCard from '../components/features/DealCard';
import { toast } from 'sonner';

const Pipeline = () => {
  const { state, dispatch } = useCRM();
  const [activeId, setActiveId] = useState(null);

  const getDealsForStage = (stageId) => {
    return state.deals.filter(deal => deal.stage === stageId);
  };

  const getStageTotal = (stageId) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const dealId = active.id;
    const newStage = over.id;

    const deal = state.deals.find(d => d.id === dealId);
    if (deal && deal.stage !== newStage) {
      dispatch({
        type: 'UPDATE_DEAL',
        payload: {
          ...deal,
          stage: newStage,
          updatedAt: new Date()
        }
      });
      
      const stageName = dealStages.find(s => s.id === newStage)?.name;
      toast.success(`Deal moved to ${stageName}`);
    }
  };

  const activeDeal = activeId ? state.deals.find(deal => deal.id === activeId) : null;

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
          <h1 className="text-3xl font-bold text-foreground">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track and manage your deals</p>
        </div>
        <Button className="crm-button-primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </motion.div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto min-h-[600px]"
        >
          {dealStages.map((stage) => {
            const stageDeals = getDealsForStage(stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <Card key={stage.id} className="crm-card min-w-[280px]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Badge className={stage.color}>
                        {stage.name}
                      </Badge>
                      <span className="text-muted-foreground">({stageDeals.length})</span>
                    </CardTitle>
                  </div>
                  <p className="text-sm font-medium text-crm-blue-600">
                    {formatCurrency(stageTotal)}
                  </p>
                </CardHeader>

                <CardContent>
                  <SortableContext items={stageDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    <div
                      className="space-y-3 min-h-[400px] p-2 rounded-lg border-2 border-dashed border-transparent hover:border-crm-blue-200 transition-colors"
                      data-stage={stage.id}
                    >
                      {stageDeals.map((deal) => (
                        <DealCard key={deal.id} deal={deal} contacts={state.contacts} />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} contacts={state.contacts} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      <motion.div variants={itemVariants}>
        <Card className="crm-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-crm-blue-500" />
              Pipeline Summary
            </CardTitle>
          </CardHeader>
<CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-crm-blue-600">
                  {formatCurrency(state.deals.reduce((sum, deal) => sum + deal.value, 0))}
                </div>
                <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-crm-teal-600">
                  {state.deals.length}
                </div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {state.deals.length > 0 ? Math.round(state.deals.reduce((sum, deal) => sum + deal.probability, 0) / state.deals.length) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Average Probability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Pipeline;