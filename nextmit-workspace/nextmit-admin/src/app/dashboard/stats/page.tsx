'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart as BarChartIcon,
  Users,
  Calendar,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const revenueData = [
  { month: 'Jan', amount: 12500 },
  { month: 'Fév', amount: 15000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Avr', amount: 22000 },
  { month: 'Mai', amount: 25000 },
  { month: 'Juin', amount: 30000 },
];

const userActivityData = [
  { date: '01/01', users: 120 },
  { date: '02/01', users: 150 },
  { date: '03/01', users: 180 },
  { date: '04/01', users: 220 },
  { date: '05/01', users: 250 },
  { date: '06/01', users: 300 },
];

const stats = [
  {
    name: 'Revenus totaux',
    value: '€122,500',
    change: '+12.5%',
    icon: DollarSign,
  },
  {
    name: 'Utilisateurs actifs',
    value: '2,543',
    change: '+15.2%',
    icon: Users,
  },
  {
    name: 'Événements',
    value: '45',
    change: '+8.1%',
    icon: Calendar,
  },
  {
    name: 'Taux de conversion',
    value: '3.2%',
    change: '+2.3%',
    icon: BarChartIcon,
  },
];

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Statistiques
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <p className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Revenus mensuels
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8BC34A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Activité des utilisateurs
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8BC34A"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
} 