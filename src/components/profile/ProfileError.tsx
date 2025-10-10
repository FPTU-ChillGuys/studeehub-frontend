"use client"

import { XCircle, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProfileErrorProps {
  error: string;
  onRetry: () => void;
}

export function ProfileError({ error, onRetry }: ProfileErrorProps) {
  return (
    <main className="flex-1 p-6 md:p-10 w-full space-y-6">
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <XCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
