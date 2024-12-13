import { Card } from '@/components/ui/card';
import { 
  Users,
  CalendarDays,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const stats = [
  {
    name: 'Utilisateurs totaux',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
  },
  {
    name: 'Événements actifs',
    value: '45',
    change: '+5.2%',
    trend: 'up',
    icon: CalendarDays,
  },
  {
    name: 'Revenus du mois',
    value: '€24,500',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Taux de conversion',
    value: '3.2%',
    change: '+2.3%',
    trend: 'up',
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.trend === 'up' 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                <stat.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Événements à venir
          </h3>
          {/* TODO: Ajouter la liste des événements */}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Dernières activités
          </h3>
          {/* TODO: Ajouter la timeline des activités */}
        </Card>
      </div>
    </div>
  );
} 