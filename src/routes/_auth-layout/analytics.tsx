import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, TrendingUp, TrendingDown, Eye } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_auth-layout/analytics')({
  component: AnalyticsPage,
})

const metrics = [
  {
    title: 'Page Views',
    value: '124,892',
    change: '+14.2%',
    trend: 'up',
    icon: Eye,
  },
  {
    title: 'Bounce Rate',
    value: '42.3%',
    change: '-3.1%',
    trend: 'down',
    icon: TrendingDown,
  },
  {
    title: 'Session Duration',
    value: '4m 32s',
    change: '+8.7%',
    trend: 'up',
    icon: BarChart3,
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '+2.4%',
    trend: 'up',
    icon: TrendingUp,
  },
]

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your website performance and user behavior.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Direct', value: '45%', color: 'bg-blue-500' },
                { source: 'Organic Search', value: '30%', color: 'bg-green-500' },
                { source: 'Referral', value: '15%', color: 'bg-yellow-500' },
                { source: 'Social', value: '10%', color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.source} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.source}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="bg-muted mt-1 h-2 rounded-full">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: item.value }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: '/home', views: '12,432', change: '+12%' },
                { page: '/products', views: '8,234', change: '+8%' },
                { page: '/about', views: '4,123', change: '-2%' },
                { page: '/contact', views: '2,345', change: '+5%' },
              ].map((item) => (
                <div key={item.page} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.page}</p>
                    <p className="text-muted-foreground text-sm">{item.views} views</p>
                  </div>
                  <span
                    className={`text-sm ${
                      item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
