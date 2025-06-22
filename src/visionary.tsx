"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, GitBranch, Zap, Video, VideoOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function VisionaryEdge() {
    const { toast } = useToast();
    const [isEdgeDetection, setIsEdgeDetection] = useState<boolean>(true);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
    const [fps, setFps] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const frameCountRef = useRef<number>(0);

    const stopStream = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = undefined;
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setFps(0);
    }, []);

    const processFrame = useCallback(() => {
        if (!isCameraOn || !videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
            animationFrameId.current = requestAnimationFrame(processFrame);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }
            
            if (isEdgeDetection) {
                ctx.filter = 'grayscale(1) contrast(3) brightness(0.9)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.filter = 'none';
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
        }

        frameCountRef.current++;
        const now = performance.now();
        if (now >= lastTimeRef.current + 1000) {
            setFps(frameCountRef.current);
            frameCountRef.current = 0;
            lastTimeRef.current = now;
        }

        animationFrameId.current = requestAnimationFrame(processFrame);
    }, [isEdgeDetection, isCameraOn]);

    const startStream = useCallback(async () => {
        stopStream();
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setIsCameraOn(true);
                    setError(null);
                    lastTimeRef.current = performance.now();
                    animationFrameId.current = requestAnimationFrame(processFrame);
                }
            } else {
                setError("Your browser does not support camera access.");
                toast({ variant: 'destructive', title: 'Error', description: 'Your browser does not support camera access.' });
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            let message = "An unexpected error occurred while accessing the camera.";
            if (err instanceof DOMException) {
                message = `Camera access error: ${err.message}. Please enable camera permissions in your browser settings.`;
            }
            setError(message);
            toast({ variant: 'destructive', title: 'Camera Error', description: message });
            setIsCameraOn(false);
        }
    }, [processFrame, stopStream, toast]);
    
    const handleToggleCamera = () => {
        if (isCameraOn) {
            stopStream();
            setIsCameraOn(false);
        } else {
            startStream();
        }
    };
    
    useEffect(() => {
        return () => {
            stopStream();
        };
    }, [stopStream]);

    return (
        <Card className="w-full max-w-sm mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-primary/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-headline text-primary-foreground">Visionary Edge</CardTitle>
                </div>
                <div className="text-sm font-code text-accent font-semibold">{fps} FPS</div>
            </CardHeader>
            <CardContent className="p-0 aspect-[9/16] bg-black relative flex items-center justify-center">
                <video ref={videoRef} className="hidden" playsInline />
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {!isCameraOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground gap-4 p-4 bg-black/50">
                        <Camera size={64} className="opacity-30"/>
                        <h3 className="text-lg font-medium">Camera is Off</h3>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        {!error && <p className="text-sm">Click the button below to start the camera feed.</p>}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 bg-card/50 border-t border-primary/20 flex flex-col gap-4">
                <div className="w-full flex items-center justify-between">
                    <Label htmlFor="edge-detection-toggle" className="flex items-center gap-2 cursor-pointer text-base">
                        <GitBranch className="text-accent" />
                        <span className="font-medium">OpenCV C++ Filter</span>
                    </Label>
                    <Switch
                        id="edge-detection-toggle"
                        checked={isEdgeDetection}
                        onCheckedChange={setIsEdgeDetection}
                        disabled={!isCameraOn}
                        aria-label="Toggle Edge Detection Filter"
                    />
                </div>
                <Button onClick={handleToggleCamera} className="w-full font-bold text-base py-6" variant={isCameraOn ? 'destructive' : 'default'}>
                    {isCameraOn ? <VideoOff className="mr-2" /> : <Video className="mr-2" />}
                    {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                </Button>
            </CardFooter>
        </Card>
    );
}
