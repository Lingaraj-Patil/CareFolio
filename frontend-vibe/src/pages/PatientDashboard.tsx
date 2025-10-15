import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Activity, Apple, Dumbbell, TrendingUp, Calendar, LogOut, User, MessageSquare, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NutritionForm from "@/components/NutritionForm";
import WorkoutForm from "@/components/WorkoutForm";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("carefolio_user") || "{}");
  
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.profile?.phone || "",
    age: user.profile?.age || "",
    gender: user.profile?.gender || "",
    height: user.profile?.height || "",
    weight: user.profile?.weight || ""
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
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
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
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name?.split(" ")[0] || "User"}!</h2>
          <p className="text-muted-foreground">Track your health journey and achieve your wellness goals</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Steps</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,234</div>
              <Progress value={82} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">82% of goal</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
              <Apple className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,850</div>
              <Progress value={75} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">75% of target</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Workouts</CardTitle>
              <Dumbbell className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4/5</div>
              <Progress value={80} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85/100</div>
              <Badge className="mt-2" variant="secondary">Good</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition AI</TabsTrigger>
            <TabsTrigger value="workout">Workout AI</TabsTrigger>
            <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Today's Plan</CardTitle>
                  <CardDescription>Your personalized daily schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Apple className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Breakfast</h4>
                      <p className="text-sm text-muted-foreground">Oatmeal with berries and nuts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Dumbbell className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Morning Workout</h4>
                      <p className="text-sm text-muted-foreground">30 min cardio session</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Health Check</h4>
                      <p className="text-sm text-muted-foreground">Log your vitals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your health tracking history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Blood Pressure Logged</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Completed Workout</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1d ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Apple className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Meal Plan Updated</span>
                    </div>
                    <span className="text-sm text-muted-foreground">3d ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionForm />
          </TabsContent>

          <TabsContent value="workout">
            <WorkoutForm />
          </TabsContent>

          <TabsContent value="chatbot">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <CardTitle>CareFolio AI Assistant</CardTitle>
                </div>
                <CardDescription>
                  Your personal fitness and health companion powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get personalized health advice, fitness tips, and nutrition guidance from our AI-powered chatbot.
                </p>
                <Button
                  onClick={() => window.open('https://carefolio-fitness-chatbot.streamlit.app/', '_blank')}
                  className="w-full h-20 text-lg"
                  size="lg"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Open AI Chatbot
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
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
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profileData.height}
                      onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                {user.profile && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Health Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {user.profile.conditions?.length > 0 && (
                        <div>
                          <span className="font-medium">Conditions:</span> {user.profile.conditions.join(", ")}
                        </div>
                      )}
                      {user.profile.activityLevel && (
                        <div>
                          <span className="font-medium">Activity Level:</span> {user.profile.activityLevel}
                        </div>
                      )}
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

export default PatientDashboard;
