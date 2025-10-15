import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, ExternalLink } from "lucide-react";

const WorkoutForm = () => {
  const handleOpenWorkout = () => {
    window.open('https://workout-fitness-1.onrender.com/', '_blank');
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          <CardTitle>AI Workout Planner</CardTitle>
        </div>
        <CardDescription>
          Get personalized workout recommendations based on your fitness profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Access our advanced AI-powered workout planner that analyzes your age, fitness level, goals, and BMI to create personalized exercise routines tailored specifically for you.
        </p>
        <div className="grid gap-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              What you'll get:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground ml-7">
              <li>• Customized workout types based on your goals</li>
              <li>• Exercise recommendations for your fitness level</li>
              <li>• Duration and intensity guidance</li>
              <li>• BMI-aware fitness planning</li>
            </ul>
          </div>
        </div>
        <Button
          onClick={handleOpenWorkout}
          className="w-full h-20 text-lg"
          size="lg"
        >
          <ExternalLink className="w-6 h-6 mr-3" />
          Open Workout Planner
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkoutForm;
