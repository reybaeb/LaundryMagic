/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error caught by boundary:', error, errorInfo);

        // Log to analytics (if implemented)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: error.message,
                fatal: false,
            });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center space-y-6 shadow-lg">
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Oops! Terjadi Kesalahan</h1>
                            <p className="text-gray-600">
                                Kami menemukan error yang tidak terduga. Jangan khawatir, data Anda aman.
                            </p>
                        </div>

                        {this.state.error && (
                            <details className="text-left">
                                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
                                    Detail teknis
                                </summary>
                                <pre className="mt-2 p-3 bg-red-50 border border-red-100 rounded text-xs text-red-600 overflow-auto">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3">
                            <Button
                                onClick={() => this.setState({ hasError: false })}
                                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Coba Lagi
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                                className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-700"
                            >
                                Ke Beranda
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
