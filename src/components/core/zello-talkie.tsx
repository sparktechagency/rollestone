"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WifiIcon,
  Volume2Icon,
  MicIcon,
  MicOffIcon,
  VolumeXIcon,
} from "lucide-react";
import { ZelloClient, type ZelloConfig } from "@/lib/zello-client";

export default function ZelloTalkie() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [channelStatus, setChannelStatus] = useState<string>("Offline");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const zelloClientRef = useRef<ZelloClient | null>(null);
  const currentStreamIdRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    // Initialize Zello client - you'll need to provide real credentials
    const config: ZelloConfig = {
      server: "wss://zello.io/ws", // Consumer Zello endpoint
      channels: ["Metro Bus Operations"],
      listenOnly: false,
      // Add your auth token here - get from https://developers.zello.com/
      //   authToken: "your-jwt-token-here",
      //   username: "your-username",
      //   password: "your-password",
    };

    zelloClientRef.current = new ZelloClient(config);

    zelloClientRef.current.setCallbacks({
      onStatusChange: (connected) => {
        console.log("[v0] Connection status changed:", connected);
        setIsConnected(connected);
        setConnectionStatus(connected ? "Connected" : "Disconnected");
        if (!connected) {
          setIsAudioEnabled(false);
          setIsPTTActive(false);
          setChannelStatus("Offline");
        }
      },
      onChannelStatus: (channel, online) => {
        console.log("[v0] Channel status:", channel, online);
        setChannelStatus(online ? "Online" : "Offline");
      },
      onIncomingVoice: (data) => {
        console.log("[v0] Received voice data:", data.byteLength, "bytes");
        // Handle incoming voice data - would need audio decoding
      },
      onError: (error) => {
        console.error("[v0] Zello error:", error);
        setConnectionStatus(`Error: ${error}`);
      },
    });

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      zelloClientRef.current?.disconnect();
    };
  }, []);

  const toggleConnection = async () => {
    if (!zelloClientRef.current) return;

    if (isConnected) {
      zelloClientRef.current.disconnect();
      setIsConnected(false);
      setConnectionStatus("Disconnected");
    } else {
      setConnectionStatus("Connecting...");
      try {
        const success = await zelloClientRef.current.connect();
        if (!success) {
          setConnectionStatus("Failed to connect");
        }
      } catch (error) {
        console.error("[v0] Connection failed:", error);
        setConnectionStatus("Connection failed");
      }
    }
  };

  const toggleAudio = async () => {
    if (!isAudioEnabled) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsAudioEnabled(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert(
          "Microphone access denied. Please enable microphone permissions."
        );
      }
    } else {
      setIsAudioEnabled(false);
      if (isRecording) {
        stopRecording();
      }
    }
  };

  const startRecording = async () => {
    if (!isAudioEnabled || !zelloClientRef.current?.isConnected()) {
      alert("Please ensure audio is enabled and Zello is connected");
      return;
    }

    try {
      // Start voice stream with Zello
      const streamId = await zelloClientRef.current.startVoiceMessage(
        "Metro Bus Operations"
      );
      currentStreamIdRef.current = streamId;
      console.log("[v0] Started voice stream with ID:", streamId);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && currentStreamIdRef.current) {
          // Convert blob to ArrayBuffer and send to Zello
          event.data.arrayBuffer().then((audioData) => {
            if (currentStreamIdRef.current && zelloClientRef.current) {
              zelloClientRef.current.sendVoiceData(
                currentStreamIdRef.current,
                audioData
              );
            }
          });
        }
      };

      mediaRecorder.onstop = () => {
        console.log("[v0] Recording stopped");
        if (currentStreamIdRef.current && zelloClientRef.current) {
          zelloClientRef.current.stopVoiceMessage(currentStreamIdRef.current);
          currentStreamIdRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      // Record in small chunks for real-time transmission
      mediaRecorder.start(100); // 100ms chunks
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start voice transmission: " + error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handlePTT = () => {
    if (!isPTTActive) {
      setIsPTTActive(true);
      startRecording();
    } else {
      setIsPTTActive(false);
      stopRecording();
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-md">
        <Card className="mt-auto py-4 mx-2">
          <CardHeader className="flex items-center justify-between px-4">
            <CardTitle>Zello</CardTitle>
            <div className="gap-2 flex items-center">
              <WifiIcon
                className={`size-5 cursor-pointer transition-colors ${
                  isConnected ? "text-green-600" : "text-red-600"
                }`}
                onClick={toggleConnection}
              />
              <Badge variant={isConnected ? "success" : "destructive"}>
                {connectionStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-4">
            <p>
              <span>Channel:</span>{" "}
              <span className="font-semibold">Metro Bus Operations</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <span>Status:</span>{" "}
              <span
                className={
                  channelStatus === "Online" ? "text-green-600" : "text-red-600"
                }
              >
                {channelStatus}
              </span>
            </p>
            {isRecording && (
              <div className="mt-2 flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm">Transmitting...</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-4 px-4">
            <Button
              variant="outline"
              onClick={toggleAudio}
              disabled={!isConnected}
              className={isAudioEnabled ? "bg-green-50 border-green-200" : ""}
            >
              {isAudioEnabled ? <Volume2Icon /> : <VolumeXIcon />}
              Audio
            </Button>
            <Button
              variant="outline"
              onMouseDown={handlePTT}
              onMouseUp={handlePTT}
              onTouchStart={handlePTT}
              onTouchEnd={handlePTT}
              disabled={!isConnected || !isAudioEnabled}
              className={isPTTActive ? "bg-red-50 border-red-200" : ""}
            >
              {isPTTActive ? (
                <MicIcon className="text-red-600" />
              ) : (
                <MicOffIcon />
              )}
              PTT
            </Button>
          </CardFooter>
        </Card>

        {/* <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Click WiFi icon to connect to Zello</p>
          <p>Hold PTT button to transmit voice</p>
          <p className="text-xs mt-2 text-amber-600">
            Note: Requires valid Zello credentials in config
          </p>
        </div> */}
      </div>
    </div>
  );
}
