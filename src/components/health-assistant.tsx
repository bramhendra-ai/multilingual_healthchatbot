'use client';

import { multilingualHealthQueryChatbot } from '@/ai/flows/multilingual-health-query-chatbot';
import { suggestPossibleDiseases } from '@/ai/flows/symptom-based-disease-suggestion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, Loader2, Send, User, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Telugu', label: 'తెలుగు (Telugu)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
];

export default function HealthAssistant() {
  const { toast } = useToast();
  // Chatbot state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! How can I help you with your health today?',
      sender: 'bot',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLanguage, setChatLanguage] = useState('English');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Symptom checker state
  const [symptoms, setSymptoms] = useState('');
  const [symptomLanguage, setSymptomLanguage] = useState('English');
  const [suggestion, setSuggestion] = useState('');
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  const chatbotAvatar = PlaceHolderImages.find(
    (img) => img.id === 'chatbot-avatar'
  );
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await multilingualHealthQueryChatbot({
        query: chatInput,
        language: chatLanguage,
      });
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Could not get a response from the assistant. Please try again.',
      });
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setIsSymptomLoading(true);
    setSuggestion('');
    try {
      const response = await suggestPossibleDiseases({
        symptoms: symptoms,
        language: symptomLanguage,
      });
      setSuggestion(response.suggestions);
    } catch (error) {
      console.error('Symptom checker error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not get suggestions. Please try again.',
      });
    } finally {
      setIsSymptomLoading(false);
    }
  };

  return (
    <Tabs defaultValue="chatbot" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chatbot">Multilingual Chatbot</TabsTrigger>
        <TabsTrigger value="symptom-checker">Symptom Checker</TabsTrigger>
      </TabsList>
      <TabsContent value="chatbot">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Health Assistant Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[60vh]">
              <div className="flex justify-end mb-4">
                <Select value={chatLanguage} onValueChange={setChatLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="flex-1 p-4 border rounded-md" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        message.sender === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="h-8 w-8">
                          {chatbotAvatar && (
                            <AvatarImage src={chatbotAvatar.imageUrl} />
                          )}
                          <AvatarFallback>
                            <Bot />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                          {userAvatar && (
                            <AvatarImage src={userAvatar.imageUrl} />
                          )}
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex items-end gap-2">
                      <Avatar className="h-8 w-8">
                        {chatbotAvatar && (
                          <AvatarImage src={chatbotAvatar.imageUrl} />
                        )}
                        <AvatarFallback>
                          <Bot />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2 flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <form
                onSubmit={handleChatSubmit}
                className="mt-4 flex items-center gap-2"
              >
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your health query..."
                  disabled={isChatLoading}
                />
                <Button type="submit" disabled={isChatLoading}>
                  {isChatLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="symptom-checker">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Symptom Checker</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSymptomSubmit} className="space-y-4">
              <div className="flex justify-end">
                <Select
                  value={symptomLanguage}
                  onValueChange={setSymptomLanguage}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="symptoms"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Describe your symptoms
                </label>
                <Textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., headache, fever, cough"
                  rows={4}
                  disabled={isSymptomLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Please separate symptoms with commas.
                </p>
              </div>
              <Button type="submit" disabled={isSymptomLoading}>
                {isSymptomLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Suggestions
              </Button>
            </form>
            {isSymptomLoading && (
              <div className="mt-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">
                  Analyzing your symptoms...
                </p>
              </div>
            )}
            {suggestion && (
              <div className="mt-6">
                <h3 className="text-lg font-headline font-semibold">
                  Suggestions
                </h3>
                <Card className="mt-2 bg-secondary">
                  <CardContent className="p-4">
                    <p className="whitespace-pre-wrap">{suggestion}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
