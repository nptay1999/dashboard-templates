import { createFileRoute } from '@tanstack/react-router'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_auth-layout/')({
  component: DashboardPage,
})

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    description: '+20.1% from last month',
    icon: DollarSign,
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    description: '+180.1% from last month',
    icon: Users,
  },
  {
    title: 'Sales',
    value: '+12,234',
    description: '+19% from last month',
    icon: CreditCard,
  },
  {
    title: 'Active Now',
    value: '+573',
    description: '+201 since last hour',
    icon: Activity,
  },
]

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex h-[300px] items-center justify-center">
              Chart placeholder - integrate with your preferred charting library
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-muted h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">User activity {i}</p>
                    <p className="text-muted-foreground text-xs">{i} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
