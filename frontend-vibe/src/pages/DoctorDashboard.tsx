import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, Calendar, MessageSquare, TrendingUp, AlertCircle, LogOut, User, Stethoscope, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("carefolio_user") || "{}");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    specialization: user.profile?.specialization || "",
    licenseNumber: user.profile?.licenseNumber || "",
    experience: user.profile?.experience || "",
    consultationFee: user.profile?.consultationFee || "",
    hospitalAffiliation: user.profile?.hospitalAffiliation || ""
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

  const patients = [
    { id: 1, name: "Ravi Kumar", condition: "Type 2 Diabetes", status: "stable", lastVisit: "2 days ago", risk: "low" },
    { id: 2, name: "Priya Sharma", condition: "Hypertension", status: "monitoring", lastVisit: "1 week ago", risk: "medium" },
    { id: 3, name: "Amit Patel", condition: "Obesity", status: "improving", lastVisit: "3 days ago", risk: "low" },
    { id: 4, name: "Sneha Reddy", condition: "Diabetes + HTN", status: "critical", lastVisit: "Today", risk: "high" },
  ];

  const messages = [
    { id: 1, patient: "Ravi Kumar", message: "Having trouble with new medication", time: "1h ago", unread: true },
    { id: 2, patient: "Priya Sharma", message: "Blood pressure readings seem high", time: "3h ago", unread: true },
    { id: 3, patient: "Amit Patel", message: "Thanks for the meal plan!", time: "1d ago", unread: false },
  ];

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
            <Badge variant="secondary" className="ml-2">Doctor</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Dr. {user.name || user.email}</span>
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
          <h2 className="text-3xl font-bold mb-2">Welcome, Dr. {user.name?.split(" ")[0] || "Doctor"}!</h2>
          <p className="text-muted-foreground">Manage your patients and track their health progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-success mt-1">+12 this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <Calendar className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">3 completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-warning mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">High Risk Patients</CardTitle>
              <AlertCircle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-destructive mt-1">Immediate care needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
                <CardDescription>Monitor and manage your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <Card key={patient.id} className="shadow-soft">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">{patient.condition}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge
                              variant={
                                patient.status === "critical" ? "destructive" :
                                patient.status === "monitoring" ? "secondary" :
                                "default"
                              }
                            >
                              {patient.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{patient.lastVisit}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              patient.risk === "high" ? "border-destructive text-destructive" :
                              patient.risk === "medium" ? "border-warning text-warning" :
                              "border-success text-success"
                            }
                          >
                            {patient.risk} risk
                          </Badge>
                          <Button size="sm">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Patient Messages</CardTitle>
                <CardDescription>Secure communication with your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <Card key={msg.id} className={`shadow-soft ${msg.unread ? "border-primary/50" : ""}`}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{msg.patient}</h4>
                              {msg.unread && <Badge variant="secondary" className="text-xs">New</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{msg.message}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-2">{msg.time}</p>
                          <Button size="sm" variant="outline">Reply</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments and tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "09:00 AM", patient: "Ravi Kumar", type: "Follow-up", duration: "30 min" },
                    { time: "10:00 AM", patient: "Priya Sharma", type: "Consultation", duration: "45 min" },
                    { time: "11:30 AM", patient: "Amit Patel", type: "Check-up", duration: "30 min" },
                    { time: "02:00 PM", patient: "Sneha Reddy", type: "Emergency", duration: "1 hour" },
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-center min-w-[80px]">
                        <p className="font-semibold text-primary">{appointment.time}</p>
                        <p className="text-xs text-muted-foreground">{appointment.duration}</p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="flex-1">
                        <h4 className="font-medium">{appointment.patient}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                      <Button size="sm" variant="outline">Start Consultation</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Patient Health Trends</CardTitle>
                  <CardDescription>Overall health metrics across patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Improved</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success" style={{ width: "65%" }} />
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stable</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-info" style={{ width: "25%" }} />
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Needs Attention</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-warning" style={{ width: "10%" }} />
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>AI-Generated Insights</CardTitle>
                  <CardDescription>Smart recommendations for patient care</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-info" />
                        Diabetes patients showing 15% improvement
                      </p>
                    </div>
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        3 patients missed medication compliance
                      </p>
                    </div>
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        Overall patient satisfaction at 92%
                      </p>
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
                    <CardTitle>Professional Profile</CardTitle>
                    <CardDescription>Manage your professional information</CardDescription>
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
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profileData.experience}
                      onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      value={profileData.consultationFee}
                      onChange={(e) => setProfileData({ ...profileData, consultationFee: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="hospitalAffiliation">Hospital/Clinic Affiliation</Label>
                    <Input
                      id="hospitalAffiliation"
                      value={profileData.hospitalAffiliation}
                      onChange={(e) => setProfileData({ ...profileData, hospitalAffiliation: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                {user.profile?.availableDays && user.profile.availableDays.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Availability</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.availableDays.map((day: string) => (
                        <Badge key={day} variant="secondary">{day}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
