import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h1 className="font-display font-bold text-4xl">404</h1>
        <h2 className="text-xl font-medium">Page Not Found</h2>
        <p className="text-muted-foreground">
          The story you are looking for might have been removed or is temporarily unavailable.
        </p>
        
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Back to Headlines
          </Button>
        </Link>
      </div>
    </div>
  );
}
