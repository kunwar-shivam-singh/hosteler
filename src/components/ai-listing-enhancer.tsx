
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { generatePropertyDescriptionAndAmenities } from "@/ai/flows/owner-ai-description-generator";
import { useToast } from "@/hooks/use-toast";

interface AIEnhancerProps {
  formData: {
    pgName: string;
    city: string;
    area: string;
    address: string;
    rent: number;
    roomTypes: string[];
    contactNumber: string;
    availableBeds: number;
  };
  onApply: (description: string, amenities: string[]) => void;
}

export function AIListingEnhancer({ formData, onApply }: AIEnhancerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.pgName || !formData.city || !formData.area) {
      toast({
        variant: "destructive",
        title: "Missing Info",
        description: "Please fill in PG Name, City, and Area first.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generatePropertyDescriptionAndAmenities({
        pgName: formData.pgName,
        city: formData.city,
        area: formData.area,
        address: formData.address || "Main Road",
        rent: formData.rent || 0,
        roomTypes: formData.roomTypes.length > 0 ? formData.roomTypes : ["Single"],
        contactNumber: formData.contactNumber || "N/A",
        availableBeds: formData.availableBeds || 1,
      });

      onApply(result.description, result.amenities);
      toast({
        title: "Magic Applied!",
        description: "AI has generated an optimized description and amenities for you.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "There was an error connecting to Gemini AI.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="w-full bg-gradient-to-r from-primary/10 to-orange-400/10 hover:from-primary/20 hover:to-orange-400/20 text-primary font-bold rounded-xl h-12 border-primary/20 transition-all border group"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Gemini is writing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-pulse group-hover:scale-125 transition-transform" />
          Enhance with AI
        </>
      )}
    </Button>
  );
}
