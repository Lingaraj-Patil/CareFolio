import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, Stethoscope, Database, Shield, TrendingUp, Activity, LogOut, Lock, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BlockchainApp from "@/components/BlockchainApp";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("carefolio_user") || "{}");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    department: user.profile?.department || "",
    accessLevel: user.profile?.accessLevel || "full"
  });

  const handleLogout = () => {
    localStorage.removeItem("carefolio_user");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, name: profileData.name, profile: { ...user.profile, ...profileData } };
    localStorage.setItem("carefolio_user", JSON.stringify(updatedUser));
    setEditMode(false);
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved successfully.",
    });
  };

  const stats = {
    totalUsers: 1243,
    activeDoctors: 89,
    totalPatients: 1154,
    blockchainRecords: 5432,
    systemUptime: "99.9%",
    dataIntegrity: "100%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CareFolio
            </h1>
            <Badge variant="destructive" className="ml-2">Admin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{user.name || user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Control Panel</h2>
          <p className="text-muted-foreground">Manage platform operations and blockchain integrity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-success mt-1">+48 this week</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Stethoscope className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDoctors}</div>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-success mt-1">+45 this week</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blockchain Records</CardTitle>
              <Database className="w-4 h-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blockchainRecords}</div>
              <p className="text-xs text-muted-foreground mt-1">Secured</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemUptime}</div>
              <p className="text-xs text-success mt-1">Excellent</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
              <Shield className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dataIntegrity}</div>
              <p className="text-xs text-success mt-1">Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Real-time system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Response Time</span>
                    <Badge variant="secondary">45ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Load</span>
                    <Badge variant="secondary">32%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <Badge variant="secondary">342</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blockchain Sync</span>
                    <Badge className="bg-success text-success-foreground">Synced</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Platform events log</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border-l-2 border-primary">
                    <Users className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New doctor registered</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-2 border-success">
                    <Shield className="w-4 h-4 text-success" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Blockchain verification completed</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-2 border-info">
                    <Database className="w-4 h-4 text-info" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Database backup successful</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage doctors, patients, and administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Dr. Amit Sharma</h4>
                        <p className="text-sm text-muted-foreground">Cardiologist • 45 patients</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Priya Kumar</h4>
                        <p className="text-sm text-muted-foreground">Patient • Diabetes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Verified</Badge>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-medium">Rajesh Patel</h4>
                        <p className="text-sm text-muted-foreground">Admin • Full Access</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Admin</Badge>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Blockchain Management</CardTitle>
                <CardDescription>Manage health data on blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <BlockchainApp />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Platform adoption metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">+18.5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Doctor Signups</span>
                      <span className="text-sm font-medium">+12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Patient Signups</span>
                      <span className="text-sm font-medium">+145</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Blockchain Activity</CardTitle>
                  <CardDescription>Data integrity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Records Added Today</span>
                      <span className="text-sm font-medium">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verification Rate</span>
                      <Badge className="bg-success text-success-foreground">100%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed Verifications</span>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm font-medium">2.4 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Administrator Profile</CardTitle>
                    <CardDescription>Manage your administrative information</CardDescription>
                  </div>
                  {!editMode ? (
                    <Button onClick={() => setEditMode(true)} variant="outline">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button onClick={() => setEditMode(false)} variant="outline">Cancel</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessLevel">Access Level</Label>
                    <Input
                      id="accessLevel"
                      value={profileData.accessLevel}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">System Permissions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-success" />
                      <span className="text-sm">Full System Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-success" />
                      <span className="text-sm">Database Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-success" />
                      <span className="text-sm">User Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-success" />
                      <span className="text-sm">Security Controls</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
