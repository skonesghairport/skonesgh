import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function BoardDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-950 border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Board Members Dashboard</h1>
          <Button variant="outline" size="sm" onClick={() => logout()}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-slate-800 border-slate-700"><CardHeader><CardTitle className="text-white">Board Dashboard</CardTitle></CardHeader><CardContent className="text-slate-300"><p>Welcome, {user?.name}. Board dashboard features coming soon.</p></CardContent></Card>
      </div>
    </div>
  );
}
