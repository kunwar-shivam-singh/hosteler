
"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message Sent",
        description: "Our team will get back to you within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      
      <main className="flex-1">
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-7xl font-black font-headline mb-6">Contact Us</h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium">
              Have questions? We are here to help you find your perfect stay or manage your listing.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-3xl font-black">Get in touch</h2>
                  <p className="text-muted-foreground text-lg font-medium">
                    Our support team is available Monday through Saturday, 9 AM to 7 PM.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6 items-center">
                    <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Mail className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">Email Support</p>
                      <p className="text-muted-foreground">support@pglocator.com</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="bg-green-100 p-4 rounded-2xl text-green-600"><MessageCircle className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">WhatsApp Support</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><MapPin className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-lg">Visit Us</p>
                      <p className="text-muted-foreground">Andheri East, Mumbai, Maharashtra</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
                <CardContent className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" placeholder="John Doe" required className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required className="rounded-xl h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Inquiry about listing" required className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="How can we help you?" required className="min-h-[150px] rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg" disabled={loading}>
                      {loading ? "Sending..." : (
                        <>
                          <Send className="mr-2 h-5 w-5" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
