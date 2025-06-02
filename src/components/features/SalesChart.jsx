import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ApperIcon from '../ApperIcon';

const SalesChart = () => {
  const data = [
    { month: 'Jan', value: 120000, deals: 8 },
    { month: 'Feb', value: 150000, deals: 12 },
    { month: 'Mar', value: 180000, deals: 15 },
    { month: 'Apr', value: 220000, deals: 18 },
    { month: 'May', value: 190000, deals: 14 },
    { month: 'Jun', value: 250000, deals: 20 },
  ];

  return (
    <Card className="crm-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="BarChart3" className="h-5 w-5 text-crm-blue-500" />
          Sales Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Pipeline Value']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#salesGradient)"
radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;