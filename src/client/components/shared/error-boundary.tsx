// Hata yakalama bileşeni
// Beklenmeyen hatalarda kullanıcıya anlamlı mesaj gösterir

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="mx-auto mt-8 max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">
              Bir hata oluştu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || "Beklenmeyen bir hata oluştu."}
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
            >
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
