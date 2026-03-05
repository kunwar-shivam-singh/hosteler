"use client";

import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  ShieldAlert, 
  Star, 
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "How do I find a PG or Hostel?",
      answer: "You can use the search bar on the home page to enter your city or area. Use filters for budget, room sharing types, and amenities to narrow down your options.",
      icon: Search
    },
    {
      question: "How do I list my property?",
      answer: "Sign up as an 'Owner', then click on 'Add PG' in your dashboard. You'll need to provide details like address, rent, room types, and photos.",
      icon: PlusCircle
    },
    {
      question: "How do I contact a property owner?",
      answer: "Once you find a listing you like, click 'View Details'. You will see 'Call Now' and 'WhatsApp' buttons to connect directly with the owner.",
      icon: MessageSquare
    },
    {
      question: "Is there any brokerage fee?",
      answer: "No. HOSTELER is a zero-brokerage platform. You deal directly with the owners, and we do not charge any commission from tenants.",
      icon: Star
    },
    {
      question: "How do I report a fake or suspicious listing?",
      answer: "If you encounter a suspicious listing, please contact us immediately at support@hosteler.in with the listing details. Our admin team will investigate and take necessary action.",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
      <main className="flex-1 bg-muted/30 pb-20">
        <section className="py-20 bg-primary text-white text-center">
          <div className="container mx-auto px-4">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-20" />
            <h1 className="text-4xl md:text-6xl font-black font-headline mb-4">Help Center</h1>
            <p className="max-w-2xl mx-auto text-xl opacity-90">
              Everything you need to know about using HOSTELER.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-white rounded-[2.5rem] shadow-sm border p-8 md:p-12">
              <h2 className="text-3xl font-black mb-8">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b py-2">
                    <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
                          <faq.icon className="h-5 w-5" />
                        </div>
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base pt-4 pl-14">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-12 bg-white rounded-[2.5rem] shadow-sm border p-8 md:p-12 text-center space-y-6">
              <h3 className="text-2xl font-black">Still have questions?</h3>
              <p className="text-muted-foreground font-medium">
                Our support team is available Monday through Saturday, 9 AM to 7 PM.
              </p>
              <a 
                href="mailto:support@hosteler.in" 
                className="inline-flex items-center gap-2 text-primary font-black hover:underline text-lg"
              >
                support@hosteler.in <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
