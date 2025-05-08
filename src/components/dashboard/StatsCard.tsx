
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <span className="bg-primary/10 p-2 rounded-full text-primary">
            {icon}
          </span>
        </div>
        
        <div className="mt-3">
          <h4 className="text-2xl font-bold">{value}</h4>
          
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center mt-3">
              <span className={cn(
                "text-xs font-medium inline-flex items-center rounded-full px-2 py-0.5",
                trend === 'up' ? "bg-green-100 text-green-800" : 
                trend === 'down' ? "bg-red-100 text-red-800" : 
                "bg-gray-100 text-gray-800"
              )}>
                {trend === 'up' && <span className="mr-1">↑</span>}
                {trend === 'down' && <span className="mr-1">↓</span>}
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
