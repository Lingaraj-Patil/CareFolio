import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("carefolio_user") || "{}");
  const userRole = user.role || "patient";
  
  const [step, setStep] = useState(1);
  const totalSteps = userRole === "patient" ? 4 : userRole === "doctor" ? 3 : 2;

  const [formData, setFormData] = useState({
    // Patient fields
    age: "",
    gender: "",
    height: "",
    weight: "",
    conditions: [] as string[],
    medications: "",
    goals: [] as string[],
    activityLevel: "",
    dietaryRestrictions: "",
    
    // Doctor fields
    specialization: "",
    licenseNumber: "",
    experience: "",
    qualifications: "",
    hospitalAffiliation: "",
    consultationFee: "",
    availableDays: [] as string[],
    
    // Admin fields
    department: "",
    accessLevel: "full"
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const updatedUser = JSON.parse(localStorage.getItem("carefolio_user") || "{}");
      updatedUser.profile = formData;
      updatedUser.needsOnboarding = false;
      localStorage.setItem("carefolio_user", JSON.stringify(updatedUser));

      toast({
        title: "Profile completed!",
        description: "Welcome to CareFolio. Let's get started!",
      });

      // Navigate based on role
      if (userRole === "doctor") {
        navigate("/doctor");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/patient");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CareFolio
            </h1>
          </div>
          <p className="text-muted-foreground">Let's personalize your health journey</p>
        </div>

        <Card className="shadow-strong">
          <CardHeader>
            <div className="space-y-2">
              <Progress value={(step / totalSteps) * 100} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* PATIENT ONBOARDING */}
            {userRole === "patient" && step === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Basic Information</CardTitle>
                  <CardDescription>Help us understand your physical profile</CardDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {userRole === "patient" && step === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Medical History</CardTitle>
                  <CardDescription>Select any conditions that apply to you</CardDescription>
                </div>

                <div className="space-y-3">
                  {["Diabetes", "Hypertension", "Heart Disease", "Asthma", "Arthritis", "None"].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.conditions.includes(condition)}
                        onCheckedChange={() => toggleCondition(condition)}
                      />
                      <label
                        htmlFor={condition}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications (Optional)</Label>
                  <Textarea
                    id="medications"
                    placeholder="List any medications you're currently taking"
                    value={formData.medications}
                    onChange={(e) => setFormData({...formData, medications: e.target.value})}
                  />
                </div>
              </div>
            )}

            {userRole === "patient" && step === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Health Goals</CardTitle>
                  <CardDescription>What would you like to achieve?</CardDescription>
                </div>

                <div className="space-y-3">
                  {["Weight Loss", "Muscle Gain", "Better Sleep", "Stress Management", "Disease Management", "General Wellness"].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                      />
                      <label
                        htmlFor={goal}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userRole === "patient" && step === 4 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Lifestyle Preferences</CardTitle>
                  <CardDescription>Help us personalize your plan</CardDescription>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select value={formData.activityLevel} onValueChange={(value) => setFormData({...formData, activityLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                      <SelectItem value="very-active">Very Active (Athlete level)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions (Optional)</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    placeholder="E.g., Vegetarian, Vegan, Gluten-free, Allergies"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                  />
                </div>
              </div>
            )}

            {/* DOCTOR ONBOARDING */}
            {userRole === "doctor" && step === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Professional Information</CardTitle>
                  <CardDescription>Tell us about your medical practice</CardDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Cardiology, Pediatrics"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Medical License #"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="5"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      placeholder="500"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Textarea
                    id="qualifications"
                    placeholder="MBBS, MD (Medicine), Fellowship..."
                    value={formData.qualifications}
                    onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                  />
                </div>
              </div>
            )}

            {userRole === "doctor" && step === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Practice Details</CardTitle>
                  <CardDescription>Hospital and availability information</CardDescription>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalAffiliation">Hospital/Clinic Name</Label>
                  <Input
                    id="hospitalAffiliation"
                    placeholder="Name of hospital or clinic"
                    value={formData.hospitalAffiliation}
                    onChange={(e) => setFormData({...formData, hospitalAffiliation: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Available Days</Label>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={formData.availableDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />
                      <label htmlFor={day} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {userRole === "doctor" && step === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Personal Information</CardTitle>
                  <CardDescription>Basic details for your profile</CardDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="35"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN ONBOARDING */}
            {userRole === "admin" && step === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Administrator Details</CardTitle>
                  <CardDescription>Set up your admin profile</CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="medical">Medical Affairs</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {userRole === "admin" && step === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="mb-2">Personal Information</CardTitle>
                  <CardDescription>Complete your profile</CardDescription>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button onClick={handleNext}>
                {step === totalSteps ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
