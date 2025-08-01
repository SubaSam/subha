import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ComponentType } from "react";
import { Play, Video, MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";

interface CustomCardProps {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<any>; // Accept any React component for icon
  bgGradient: string;
  iconBg: string;
  badges?: string[];
}

export const CustomCard = ({ id,name, description, icon: Icon, bgGradient, iconBg, badges }: CustomCardProps) => {
  return (
    <Card className="bg-[#2e2d2d] border-gray-700/50 backdrop-blur-sm p-2 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden w-auto max-w-full rounded-3xl" >
      <CardHeader className="px-2" style={{
        background: 'linear-gradient(180deg, #0c0414 0%, #242326 100%)',
        borderRadius: 25,
        borderTopRightRadius: 25,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10
      }}>
        <div className="flex  items-center gap-1">
          <div className={`p-2 rounded-lg  group-hover:scale-110 transition-transform duration-300`}>
            <Icon />
          </div>
          <CardTitle className="text-white text-[20px] font-semibold text-left">
            {name}
          </CardTitle>
        </div>
      </CardHeader> 
      <CardContent className="pt-0 px-2 pb-0">
        <CardDescription className="text-gray-300 text-sm leading-relaxed mb-0 min-h-[70px]">
          {description}
        </CardDescription>
        
      </CardContent>
      <CardFooter className="px-2">
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-0">
            {badges.map((badge, idx) => (
              <Badge key={idx} className="bg-black text-white px-3 py-2 rounded-full text-xs font-semibold">
                {badge}
              </Badge>
            ))}
          </div>
          
        )}
        </CardFooter>
      {/* Hover Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 border-2 border-violet-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[inset_0_0_32px_0_rgba(139,92,246,0.7)] z-10" style={{ borderRadius: 25 }}>
        <div className="flex flex-row items-center justify-center gap-8 w-full">
          {/* Try Now */}
          <div className="flex flex-col items-center">
            <Link to={`/${id}`}>
            <Button asChild variant="default" className="rounded-full border-violet-500 bg-white/10 text-white flex items-center justify-center w-14 h-14 p-0 hover:bg-violet-600 hover:border-violet-600">
              <a href="#"><Play className="w-6 h-6" /></a>
            </Button></Link>
            <span className="mt-2 text-white text-sm font-medium">Try Now</span>
          </div>
          {/* Video */}
          <div className="flex flex-col items-center">
            <Button asChild variant="default" className="rounded-full border-violet-500 bg-white/10 text-white flex items-center justify-center w-14 h-14 p-0 hover:bg-violet-600 hover:border-violet-600">
              <a href="#"><Video className="w-6 h-6" /></a>
            </Button>
            <span className="mt-2 text-white text-sm font-medium">Video</span>
          </div>
          {/* Demo */}
          <div className="flex flex-col items-center">
            <Button asChild variant="default" className="rounded-full border-violet-500 bg-white/10 text-white flex items-center justify-center w-14 h-14 p-0 hover:bg-violet-600 hover:border-violet-600">
              <a href="#"><MonitorPlay className="w-6 h-6" /></a>
            </Button>
            <span className="mt-2 text-white text-sm font-medium">Demo</span>
          </div>
        </div>
      </div>
    </Card>
  );
};