"use client";
import { CustomCard } from "@/components/ProductCard";
import { useState } from "react";
import {motion,  AnimatePresence } from "framer-motion";
import {
  Icon_clarifyAi,
  Icon_CodeSensei,
  Icon_CodeSpectre,
  Icon_CodeGene,
  Icon_VelocityLens,
  Icon_TestSage,
  Icon_DevConverter,
  Icon_DevGenerator
} from "@/components/icons/CustomIcons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Tabs,TabsList, TabsTrigger} from "@/components/ui/tabs";

 const products = [
    {
      id: "clarif-ai",
      name: "ClarifAI",
      description: "Clarity to requirements, from vision to validation, from complexity to clarity.",
      icon: Icon_clarifyAi,
      bgGradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500",
      badges: ["AI", "Requirements", "Validation"],
      phase: "Requirements Analysis"
    },
    {
      id: "code-sensei",
      name: "CodeSensei",
      description: "Codesensei is a genai assistant that helps developers easily understand, navigate, & modernize legacy code.",
      icon: Icon_CodeSensei,
      bgGradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500",
      badges: ["GenAI", "Legacy", "Navigation"],
      phase:"Planning"
    },
    {
      id: "code-spectre",
      name: "CodeSpectre",
      description: "Unlocking and transforming legacy code, future-proof your systems.",
      icon: Icon_CodeSpectre,
      bgGradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500",
      badges: ["Legacy", "Transformation", "Future-proof"],
      phase: "Design"
    },
    {
      id: "code-genie",
      name: "CodeGenie",
      description: "Where code meets intelligence. Automate code reviews, elevate code quality.",
      icon: Icon_CodeGene,
      bgGradient: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-500",
      badges: ["Automation", "Reviews", "Quality"],
      phase:"Testing"
    },
    {
      id: "DevXcelerate Converter",
      name: "VelocityLens",
      description: "Integrates data from your development ecosystem without complex setups or rigid schemas.",
      icon: Icon_VelocityLens,
      bgGradient: "from-purple-500 to-indigo-500",
      iconBg: "bg-purple-500",
      badges: ["Data", "Integration", "Ecosystem"],
      phase: "Development"
    },
    {
      id: "devxcelerate",
      name: "DevXcelerate",
      description: "Leverage power of genai to build, manage, and optimize devops workflows faster and more effectively.",
      icon: Icon_DevGenerator,
      bgGradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500",
      badges: ["DevOps", "GenAI", "Optimization"],
      phase : "Development"
    },
    // {
    //   id: "devxcelerate-converter",
    //   name: "DevXcelerateConverter",
    //   description: "Leverage power of genai to build, manage, and optimize devops workflows faster and more effectively.",
    //   icon: Icon_DevConverter,
    //   bgGradient: "from-red-500 to-pink-500",
    //   iconBg: "bg-red-500",
    //   badges: ["DevOps", "GenAI", "Conversion"],
    //   phase : "Development"
    // },
    {
      id: "testsage",
      name: "TestSage",
      description: "Test sage reimagines testing by letting you speak your test cases—literally.",
      icon: Icon_TestSage,
      bgGradient: "from-cyan-500 to-blue-500",
      iconBg: "bg-cyan-500",
      badges: ["Testing", "Voice", "Automation"],
      phase : "Testing"
    }
  ];
  const phase = ["All Solutions","Planning","Requirements Analysis","Design","Development","Testing"];
const LandingPage = () => {
 const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
 const filteredProducts = selectedPhase?products.filter((p)=>p.phase === selectedPhase):products;
 const  handlePhaseToggle = (value:string) => {
  if (value === "All Solutions") {
    setSelectedPhase(null);
  } else {
    setSelectedPhase((prev)=> (prev === value ? null : value));
  }
 }

  return (
  <div className="min-h-screen relative overflow-x-hidden">
    {/* Background */}
    <div className="absolute inset-0 w-full h-full z-0">
      <img src="/bg.jpeg" alt="Background" className="w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-black/70" />
    </div>

    <div className="relative z-10 container mx-auto px-4 py-4">
      {/* Title */}
      <div className="text-center mb-5">
        <h1 className="text-4xl font-semibold text-white mb-3 tracking-tight">Welcome to TCS ASCEND</h1>
        <p className="text-[14px] font-medium text-gray-300 max-w-4xl mx-auto py-2">
          GenAI Powered AI Suite for Cognitive Engineering, Navigation and Delivery.
        </p>
      </div>
        {/* Tabs for Product Phases */}
        <Tabs value={selectedPhase ?? ""}onValueChange={handlePhaseToggle}>
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-transparent p-2 rounded-xl mb-6 ">
          {phase.map((phase)=>(<TabsTrigger key={phase} value={phase} className="text-sm text-white data-[state=active]:text-white hover:underline "
              >
                #{phase}
              </TabsTrigger>
))}
        </TabsList>
        </Tabs>
      {/* Solutions Section with Carousel */}
      <div className="mb-2">
        {/* <h2 className="text-xl font-semibold text-white text-center mb-4 bg-neutral-800 p-2 w-[200px] mx-auto rounded-3xl"onClick={() => setSelectedPhase(null)}>
          Our solutions
        </h2> */}

         {/* View Swap with Animation */}
          <AnimatePresence mode="wait">
            {selectedPhase === null ? (
              <motion.div
                key="carousel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Carousel className="w-full max-w-7xl py-6 mx-auto">
                  <CarouselContent>
                    {products.map((product) => (
                      <CarouselItem key={product.id} className="basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/3 px-2">
                        <CustomCard {...product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </motion.div>
            ) : (
              <div className="w-full max-w-7xl py-6 mx-auto">
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {filteredProducts.map((product) => (
                    <CustomCard key={product.id} {...product} />
                  ))}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
      </div>
    </div>
  </div>
);
};

export default LandingPage;