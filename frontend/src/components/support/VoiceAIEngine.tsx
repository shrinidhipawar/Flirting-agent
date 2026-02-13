import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Activity, Brain, Clock, CheckCircle, AlertTriangle, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

interface VoiceCall {
  id: string;
  caller: string;
  phone: string;
  status: "ringing" | "active" | "on-hold" | "completed";
  duration: string;
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  aiConfidence: number;
}

const initialCalls: VoiceCall[] = [
  { id: "1", caller: "Priya Sharma", phone: "+91 98765 43210", status: "active", duration: "3:45", intent: "Refund Request", sentiment: "negative", aiConfidence: 89 },
  { id: "2", caller: "Rahul Verma", phone: "+91 87654 32109", status: "ringing", duration: "0:00", intent: "Unknown", sentiment: "neutral", aiConfidence: 0 },
  { id: "3", caller: "Anita Patel", phone: "+91 76543 21098", status: "on-hold", duration: "2:12", intent: "Order Status", sentiment: "neutral", aiConfidence: 94 },
];

const initialTranscript = [
  { speaker: "customer", text: "Hi, I need to return my order because the product was damaged when it arrived." },
  { speaker: "ai", text: "I'm sorry to hear that your order arrived damaged. I completely understand how frustrating that must be. Let me help you with the return process right away." },
  { speaker: "customer", text: "Thank you. The order number is ORD-2035-8421." },
  { speaker: "ai", text: "I've found your order. I can see it was delivered yesterday. I'm initiating a pickup for the damaged item and processing a full refund. You should receive the refund within 3-5 business days." },
  { speaker: "customer", text: "That's great, thank you so much for the quick resolution!" },
];

export function VoiceAIEngine() {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedCall, setSelectedCall] = useState<string>("1");
  const [calls, setCalls] = useState<VoiceCall[]>(initialCalls);
  const [transcript, setTranscript] = useState(initialTranscript);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callTimer, setCallTimer] = useState(225); // 3:45 in seconds
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const activeCall = calls.find(c => c.id === selectedCall);

  // Simulate incoming calls
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddCall = Math.random() > 0.85; // 15% chance every 45 seconds
      if (shouldAddCall) {
        const callers = [
          { name: "Deepak Mehta", phone: "+91 99112 23344" },
          { name: "Sunita Roy", phone: "+91 88223 34455" },
          { name: "Ravi Kumar", phone: "+91 77334 45566" },
        ];
        const randomCaller = callers[Math.floor(Math.random() * callers.length)];
        
        const newCall: VoiceCall = {
          id: `call-${Date.now()}`,
          caller: randomCaller.name,
          phone: randomCaller.phone,
          status: "ringing",
          duration: "0:00",
          intent: "Unknown",
          sentiment: "neutral",
          aiConfidence: 0,
        };

        setCalls(prev => [...prev, newCall]);
        
        // Trigger call notification with sound
        addNotification({
          type: "call",
          title: `Incoming call from ${randomCaller.name}`,
          description: randomCaller.phone,
          priority: "high",
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Timer effect for active calls
  useEffect(() => {
    if (activeCall?.status === "active") {
      const interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
        setCalls(prev => prev.map(c => {
          if (c.id === selectedCall && c.status === "active") {
            const mins = Math.floor((callTimer + 1) / 60);
            const secs = (callTimer + 1) % 60;
            return { ...c, duration: `${mins}:${secs.toString().padStart(2, '0')}` };
          }
          return c;
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCall?.status, selectedCall, callTimer]);

  const handleAnswerCall = (callId: string) => {
    setCalls(prev => prev.map(c => 
      c.id === callId ? { ...c, status: "active", intent: "Analyzing...", aiConfidence: 50 } : c
    ));
    setSelectedCall(callId);
    
    // Simulate AI detecting intent
    setTimeout(() => {
      setCalls(prev => prev.map(c => 
        c.id === callId ? { ...c, intent: "Product Inquiry", aiConfidence: 87 } : c
      ));
    }, 2000);
    
    toast({
      title: "Call Connected",
      description: "AI Voice Agent is handling the call",
    });
  };

  const handleEndCall = () => {
    if (!activeCall) return;
    
    setCalls(prev => prev.map(c => 
      c.id === activeCall.id ? { ...c, status: "completed" } : c
    ));
    
    toast({
      title: "Call Ended",
      description: `Call with ${activeCall.caller} has been completed`,
    });
  };

  const handleHoldCall = () => {
    if (!activeCall) return;
    
    const newStatus = activeCall.status === "on-hold" ? "active" : "on-hold";
    setCalls(prev => prev.map(c => 
      c.id === activeCall.id ? { ...c, status: newStatus } : c
    ));
    
    toast({
      title: newStatus === "on-hold" ? "Call On Hold" : "Call Resumed",
      description: `${activeCall.caller} is now ${newStatus === "on-hold" ? "on hold" : "connected"}`,
    });
  };

  const handleTransferToHuman = () => {
    if (!activeCall) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: "ai",
        text: "I understand you'd like to speak with a human agent. Let me transfer you right away. Please hold for a moment."
      }]);
      
      // Trigger escalation notification
      addNotification({
        type: "escalation",
        title: "Call Transferred",
        description: `${activeCall.caller}'s call transferred to human agent`,
        priority: "urgent",
      });
      
      setIsProcessing(false);
    }, 1500);
  };

  const handleCreateTicket = () => {
    if (!activeCall) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
      
      addNotification({
        type: "ticket",
        title: "Ticket Created",
        description: `Ticket ${ticketId} created for ${activeCall.caller}`,
        priority: "medium",
      });
      
      setIsProcessing(false);
    }, 1000);
  };

  const handleProcessRefund = () => {
    if (!activeCall) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: "ai",
        text: "I've processed your refund request. The amount will be credited to your original payment method within 3-5 business days. You'll receive a confirmation email shortly."
      }]);
      
      toast({
        title: "Refund Processed",
        description: "Refund has been initiated successfully",
      });
      setIsProcessing(false);
    }, 2000);
  };

  const handleSendSMSSummary = () => {
    if (!activeCall) return;
    
    toast({
      title: "SMS Sent",
      description: `Call summary sent to ${activeCall.phone}`,
    });
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone Unmuted" : "Microphone Muted",
      description: isMuted ? "AI can now hear the customer" : "AI microphone is muted",
    });
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker Off" : "Speaker On",
      description: isSpeakerOn ? "Audio output disabled" : "Audio output enabled",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{calls.filter(c => c.status !== "completed").length}</p>
                <p className="text-xs text-muted-foreground">Active Calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground">AI Resolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2:34</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">8%</p>
                <p className="text-xs text-muted-foreground">Escalation Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Calls */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              Live Calls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calls.filter(c => c.status !== "completed").map(call => (
              <button
                key={call.id}
                onClick={() => setSelectedCall(call.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedCall === call.id 
                    ? "bg-primary/10 border border-primary" 
                    : "bg-background/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      call.status === "active" ? "bg-green-500/20" :
                      call.status === "ringing" ? "bg-yellow-500/20 animate-pulse" :
                      "bg-orange-500/20"
                    }`}>
                      <Phone className={`h-4 w-4 ${
                        call.status === "active" ? "text-green-400" :
                        call.status === "ringing" ? "text-yellow-400" :
                        "text-orange-400"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{call.caller}</p>
                      <p className="text-xs text-muted-foreground">{call.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {call.status === "ringing" ? (
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-xs h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnswerCall(call.id);
                        }}
                      >
                        Answer
                      </Button>
                    ) : (
                      <>
                        <Badge variant={
                          call.status === "active" ? "default" : "outline"
                        } className="text-xs">
                          {call.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{call.duration}</p>
                      </>
                    )}
                  </div>
                </div>
                {call.intent !== "Unknown" && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{call.intent}</Badge>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">AI:</span>
                      <Progress value={call.aiConfidence} className="h-1 flex-1" />
                      <span className="text-xs font-medium">{call.aiConfidence}%</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Call Interface */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Voice Agent
              </div>
              {activeCall && (
                <Badge className={`${
                  activeCall.status === "active" ? "bg-green-500/20 text-green-400" :
                  activeCall.status === "ringing" ? "bg-yellow-500/20 text-yellow-400 animate-pulse" :
                  "bg-orange-500/20 text-orange-400"
                }`}>
                  {activeCall.status === "active" && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                  {activeCall.status.toUpperCase()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCall && activeCall.status !== "completed" ? (
              <>
                {/* Caller Info */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{activeCall.caller}</h3>
                      <p className="text-sm text-muted-foreground">{activeCall.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{activeCall.intent}</Badge>
                        <Badge variant="outline" className={`${
                          activeCall.sentiment === "positive" ? "text-green-400" :
                          activeCall.sentiment === "negative" ? "text-red-400" : "text-blue-400"
                        }`}>
                          {activeCall.sentiment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-mono font-bold">{activeCall.duration}</p>
                    <p className="text-xs text-muted-foreground">Call Duration</p>
                  </div>
                </div>

                {/* Voice Visualization */}
                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center justify-center gap-1 h-16">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-primary rounded-full ${activeCall.status === "active" ? "animate-pulse" : ""}`}
                        style={{
                          height: activeCall.status === "active" ? `${Math.random() * 60 + 10}%` : "20%",
                          animationDelay: `${i * 0.05}s`,
                          animationDuration: "0.5s"
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    {activeCall.status === "active" ? "Live Audio Waveform" : "Call On Hold"}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    variant={isMuted ? "destructive" : "outline"}
                    className="rounded-full h-14 w-14"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`rounded-full h-14 w-14 ${activeCall.status === "on-hold" ? "bg-orange-500/20 border-orange-500" : ""}`}
                    onClick={handleHoldCall}
                  >
                    <Phone className={`h-5 w-5 ${activeCall.status === "on-hold" ? "text-orange-500" : ""}`} />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full h-14 w-14 bg-red-500 hover:bg-red-600"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant={!isSpeakerOn ? "destructive" : "outline"}
                    className="rounded-full h-14 w-14"
                    onClick={handleSpeakerToggle}
                  >
                    {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Live Transcript */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm font-medium">Live Transcript</span>
                  </div>
                  <div className="max-h-[200px] overflow-auto space-y-2 p-3 rounded-lg bg-background/50 border border-border/50">
                    {transcript.map((line, i) => (
                      <div key={i} className={`flex gap-2 ${line.speaker === "ai" ? "justify-end" : ""}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          line.speaker === "ai" 
                            ? "bg-primary/20 text-foreground" 
                            : "bg-muted"
                        }`}>
                          <p className="text-xs text-muted-foreground mb-1">
                            {line.speaker === "ai" ? "🤖 AI Agent" : "👤 Customer"}
                          </p>
                          {line.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={handleTransferToHuman}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                    Transfer to Human
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={handleCreateTicket}
                    disabled={isProcessing}
                  >
                    Create Ticket
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={handleProcessRefund}
                    disabled={isProcessing}
                  >
                    Process Refund
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={handleSendSMSSummary}
                  >
                    Send SMS Summary
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Phone className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select a call to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
