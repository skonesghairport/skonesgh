import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Shield, AlertCircle } from "lucide-react";

export default function Login() {
  const { error } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-red-500" />
            <h1 className="text-3xl font-bold text-white">DavSec</h1>
          </div>
          <p className="text-slate-400 text-sm">AvsEc Ghana Airport Security</p>
          <p className="text-slate-500 text-xs mt-2">Security Operations Portal</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Security Portal Access</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in with your authorized credentials to access the security operations center
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex gap-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">Authentication error. Please try again.</p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                This portal is restricted to authorized airport security personnel only. Unauthorized access is prohibited and monitored.
              </p>

              <Button
                onClick={() => startLogin()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-base"
              >
                Sign In to Security Portal
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                For access issues, contact your Security Operations Manager
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-600">
          <p>© 2026 DavSec/AvsEc Ghana Airport Security. All rights reserved.</p>
          <p className="mt-2">Authorized Personnel Only • Monitored & Logged</p>
        </div>
      </div>
    </div>
  );
}
