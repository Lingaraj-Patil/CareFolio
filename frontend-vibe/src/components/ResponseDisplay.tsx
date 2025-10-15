import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ResponseDisplayProps {
  response: {
    health_tag: string;
    health_tag_explanation: string;
    meal_plan: string;
  };
}

const ResponseDisplay = ({ response }: ResponseDisplayProps) => {
  return (
    <Card className="shadow-medium border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Your Personalized Nutrition Plan
          </CardTitle>
          <Badge variant="secondary">{response.health_tag}</Badge>
        </div>
        <CardDescription>{response.health_tag_explanation}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-foreground">{response.meal_plan}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseDisplay;
