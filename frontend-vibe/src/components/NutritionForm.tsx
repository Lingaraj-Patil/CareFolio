import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import JsonPreview from "./JsonPreview";
import ResponseDisplay from "./ResponseDisplay";

interface FormData {
  age: number;
  height_cm: number;
  weight_kg: number;
  meals_per_day: number;
  has_diabetes: number;
  has_hypertension: number;
  sugar_level: number;
  sleep_hours: number;
  stress_level: number;
  bmr: number;
  tdee: number;
  systolic_bp: number;
  diastolic_bp: number;
  gender: string;
  fitness_goal: string;
  activity_level: string;
  diet_type: string;
  preferred_cuisine: string;
}

interface ApiResponse {
  health_tag: string;
  health_tag_explanation: string;
  meal_plan: string;
}

const NutritionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    age: 28,
    height_cm: 175,
    weight_kg: 72,
    meals_per_day: 3,
    has_diabetes: 0,
    has_hypertension: 0,
    sugar_level: 100,
    sleep_hours: 7,
    stress_level: 5,
    bmr: 1700,
    tdee: 2300,
    systolic_bp: 120,
    diastolic_bp: 80,
    gender: "male",
    fitness_goal: "maintain",
    activity_level: "moderate",
    diet_type: "non-veg",
    preferred_cuisine: "Indian"
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const buildApiPayload = () => {
    return {
      age: formData.age,
      height_cm: formData.height_cm,
      weight_kg: formData.weight_kg,
      meals_per_day: formData.meals_per_day,
      has_diabetes: formData.has_diabetes,
      has_hypertension: formData.has_hypertension,
      sugar_level: formData.sugar_level,
      sleep_hours: formData.sleep_hours,
      stress_level: formData.stress_level,
      bmr: formData.bmr,
      tdee: formData.tdee,
      systolic_bp: formData.systolic_bp,
      diastolic_bp: formData.diastolic_bp,
      gender_male: formData.gender === "male" ? 1 : 0,
      fitness_goal_weight_gain: formData.fitness_goal === "weight_gain" ? 1 : 0,
      fitness_goal_weight_loss: formData.fitness_goal === "weight_loss" ? 1 : 0,
      activity_level_moderate: formData.activity_level === "moderate" ? 1 : 0,
      activity_level_sedentary: formData.activity_level === "sedentary" ? 1 : 0,
      diet_type_vegan: formData.diet_type === "vegan" ? 1 : 0,
      "diet_type_non-veg": formData.diet_type === "non-veg" ? 1 : 0,
      diet_type_vegetarian: formData.diet_type === "veg" ? 1 : 0,
      preferred_cuisine_Continental: formData.preferred_cuisine === "Continental" ? 1 : 0,
      preferred_cuisine_Indian: formData.preferred_cuisine === "Indian" ? 1 : 0,
      preferred_cuisine_Mediterranean: formData.preferred_cuisine === "Mediterranean" ? 1 : 0
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const payload = buildApiPayload();

    try {
      const res = await fetch("https://nutrition-guide.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch nutrition plan");
      }

      const data = await res.json();
      setResponse(data);
      toast.success("Nutrition plan generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate nutrition plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: 28,
      height_cm: 175,
      weight_kg: 72,
      meals_per_day: 3,
      has_diabetes: 0,
      has_hypertension: 0,
      sugar_level: 100,
      sleep_hours: 7,
      stress_level: 5,
      bmr: 1700,
      tdee: 2300,
      systolic_bp: 120,
      diastolic_bp: 80,
      gender: "male",
      fitness_goal: "maintain",
      activity_level: "moderate",
      diet_type: "non-veg",
      preferred_cuisine: "Indian"
    });
    setResponse(null);
    toast.info("Form reset successfully");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-soft border-border/50 gradient-card">
          <CardHeader>
            <CardTitle className="text-foreground">Personal Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meals">Meals per day</Label>
              <Input
                id="meals"
                type="number"
                value={formData.meals_per_day}
                onChange={(e) => setFormData({ ...formData, meals_per_day: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50 gradient-card">
          <CardHeader>
            <CardTitle className="text-foreground">Health Metrics</CardTitle>
            <CardDescription>Your current health status</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="diabetes"
                checked={formData.has_diabetes === 1}
                onCheckedChange={(checked) => setFormData({ ...formData, has_diabetes: checked ? 1 : 0 })}
              />
              <Label htmlFor="diabetes" className="font-normal cursor-pointer">Has Diabetes</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="hypertension"
                checked={formData.has_hypertension === 1}
                onCheckedChange={(checked) => setFormData({ ...formData, has_hypertension: checked ? 1 : 0 })}
              />
              <Label htmlFor="hypertension" className="font-normal cursor-pointer">Has Hypertension</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar Level (mg/dL)</Label>
              <Input
                id="sugar"
                type="number"
                value={formData.sugar_level}
                onChange={(e) => setFormData({ ...formData, sugar_level: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep Hours</Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({ ...formData, sleep_hours: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systolic">Systolic BP</Label>
              <Input
                id="systolic"
                type="number"
                value={formData.systolic_bp}
                onChange={(e) => setFormData({ ...formData, systolic_bp: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastolic BP</Label>
              <Input
                id="diastolic"
                type="number"
                value={formData.diastolic_bp}
                onChange={(e) => setFormData({ ...formData, diastolic_bp: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Stress Level: {formData.stress_level}</Label>
              <Slider
                value={[formData.stress_level]}
                onValueChange={(value) => setFormData({ ...formData, stress_level: value[0] })}
                min={1}
                max={10}
                step={1}
                className="transition-smooth"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low (1)</span>
                <span>High (10)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50 gradient-card">
          <CardHeader>
            <CardTitle className="text-foreground">Metabolic Data</CardTitle>
            <CardDescription>Your energy requirements</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bmr">BMR (Basal Metabolic Rate)</Label>
              <Input
                id="bmr"
                type="number"
                value={formData.bmr}
                onChange={(e) => setFormData({ ...formData, bmr: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tdee">TDEE (Total Daily Energy Expenditure)</Label>
              <Input
                id="tdee"
                type="number"
                value={formData.tdee}
                onChange={(e) => setFormData({ ...formData, tdee: Number(e.target.value) })}
                required
                className="transition-smooth"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50 gradient-card">
          <CardHeader>
            <CardTitle className="text-foreground">Lifestyle & Preferences</CardTitle>
            <CardDescription>Your activity and dietary choices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Fitness Goal</Label>
              <RadioGroup
                value={formData.fitness_goal}
                onValueChange={(value) => setFormData({ ...formData, fitness_goal: value })}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight_gain" id="weight_gain" />
                  <Label htmlFor="weight_gain" className="font-normal cursor-pointer">Weight Gain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight_loss" id="weight_loss" />
                  <Label htmlFor="weight_loss" className="font-normal cursor-pointer">Weight Loss</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintain" id="maintain" />
                  <Label htmlFor="maintain" className="font-normal cursor-pointer">Maintain</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <RadioGroup
                value={formData.activity_level}
                onValueChange={(value) => setFormData({ ...formData, activity_level: value })}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sedentary" id="sedentary" />
                  <Label htmlFor="sedentary" className="font-normal cursor-pointer">Sedentary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate" className="font-normal cursor-pointer">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active" className="font-normal cursor-pointer">Active</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Diet Type</Label>
              <RadioGroup
                value={formData.diet_type}
                onValueChange={(value) => setFormData({ ...formData, diet_type: value })}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="veg" id="veg" />
                  <Label htmlFor="veg" className="font-normal cursor-pointer">Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-veg" id="non-veg" />
                  <Label htmlFor="non-veg" className="font-normal cursor-pointer">Non-Veg</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vegan" id="vegan" />
                  <Label htmlFor="vegan" className="font-normal cursor-pointer">Vegan</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine">Preferred Cuisine</Label>
              <Select
                value={formData.preferred_cuisine}
                onValueChange={(value) => setFormData({ ...formData, preferred_cuisine: value })}
              >
                <SelectTrigger id="cuisine" className="transition-smooth">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Continental">Continental</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50 bg-muted/30">
          <CardHeader className="cursor-pointer" onClick={() => setShowPreview(!showPreview)}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground text-lg">Generated JSON Preview</CardTitle>
                <CardDescription>The exact payload being sent to the API</CardDescription>
              </div>
              {showPreview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardHeader>
          {showPreview && (
            <CardContent>
              <JsonPreview data={buildApiPayload()} />
            </CardContent>
          )}
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 gradient-primary transition-smooth hover:opacity-90 shadow-medium"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Nutrition Plan
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="transition-smooth"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Form
          </Button>
        </div>
      </form>

      {response && <ResponseDisplay response={response} />}
    </div>
  );
};

export default NutritionForm;
