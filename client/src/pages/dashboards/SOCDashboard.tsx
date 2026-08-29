import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowUpRight, BookOpen, GraduationCap, LogOut, MapPin, Plane, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function SOCDashboard() {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch active incidents and alerts
  const activeIncidents = trpc.incidents.getActive.useQuery();
  const activeAlerts = trpc.alerts.getActive.useQuery();
  const activeLocations = trpc.locations.getActive.useQuery();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-600 text-white";
      case "Medium":
        return "bg-yellow-600 text-white";
      case "Low":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "InProgress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-white">DavSec SOC</h1>
              <p className="text-xs text-slate-400">Security Operations Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-slate-300">{user?.name}</p>
              <p className="text-xs text-slate-500">{currentTime.toLocaleTimeString()}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Active Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeIncidents.data?.length || 0}</div>
              <p className="text-xs text-slate-400 mt-2">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {activeAlerts.data?.filter(a => a.severity === "Critical").length || 0}
              </div>
              <p className="text-xs text-slate-400 mt-2">Immediate action required</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">Active Guards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{activeLocations.data?.length || 0}</div>
              <p className="text-xs text-slate-400 mt-2">On duty</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-500">Operational</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">All systems nominal</p>
            </CardContent>
          </Card>
        </div>

        {/* Unified Learning & Awareness Hub */}
        <Card className="mb-8 border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-cyan-300" />
              Skones Management Hub
            </CardTitle>
            <CardDescription className="text-slate-400">
              Move from operational oversight to approved learning and official awareness resources without leaving the management workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <a href="/education" className="group border border-slate-700 bg-slate-900 p-4 transition-colors hover:border-cyan-400">
                <GraduationCap className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 font-semibold text-white">Student College</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Guided tracks and provider-labeled courses.</p>
                <ArrowUpRight className="mt-4 h-4 w-4 text-slate-500 group-hover:text-cyan-300" />
              </a>
              <a href="/resources" className="group border border-slate-700 bg-slate-900 p-4 transition-colors hover:border-cyan-400">
                <BookOpen className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 font-semibold text-white">Resource Directory</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Search free-first and official learning links.</p>
                <ArrowUpRight className="mt-4 h-4 w-4 text-slate-500 group-hover:text-cyan-300" />
              </a>
              <a href="/resources#flight-tracker" className="group border border-slate-700 bg-slate-900 p-4 transition-colors hover:border-cyan-400">
                <Plane className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 font-semibold text-white">Aviation Views</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Regional context and official tracker launchpads.</p>
                <ArrowUpRight className="mt-4 h-4 w-4 text-slate-500 group-hover:text-cyan-300" />
              </a>
              <a href="/education#partnerships" className="group border border-slate-700 bg-slate-900 p-4 transition-colors hover:border-cyan-400">
                <Shield className="h-5 w-5 text-cyan-300" />
                <p className="mt-4 font-semibold text-white">Partnership Paths</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Future pathways with explicit authorization boundaries.</p>
                <ArrowUpRight className="mt-4 h-4 w-4 text-slate-500 group-hover:text-cyan-300" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Active Incidents
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time incident tracking and response
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeIncidents.isLoading ? (
              <p className="text-slate-400">Loading incidents...</p>
            ) : activeIncidents.data && activeIncidents.data.length > 0 ? (
              <div className="space-y-3">
                {activeIncidents.data.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-start justify-between p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <span className="text-sm font-mono text-slate-300">{incident.incidentCode}</span>
                      </div>
                      <p className="text-sm text-slate-200">{incident.description}</p>
                      {incident.location && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {incident.location}
                        </div>
                      )}
                    </div>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No active incidents</p>
            )}
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Active Alerts
            </CardTitle>
            <CardDescription className="text-slate-400">
              System and operational alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts.isLoading ? (
              <p className="text-slate-400">Loading alerts...</p>
            ) : activeAlerts.data && activeAlerts.data.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.data.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-sm font-mono text-slate-300">{alert.alertCode}</span>
                      </div>
                      <p className="text-sm text-slate-200">{alert.message}</p>
                    </div>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No active alerts</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
