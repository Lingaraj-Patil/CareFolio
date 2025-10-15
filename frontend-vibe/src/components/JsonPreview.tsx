import { Card } from "@/components/ui/card";

interface JsonPreviewProps {
  data: any;
}

const JsonPreview = ({ data }: JsonPreviewProps) => {
  return (
    <Card className="bg-muted/50 p-4 overflow-auto max-h-96">
      <pre className="text-sm text-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
};

export default JsonPreview;
