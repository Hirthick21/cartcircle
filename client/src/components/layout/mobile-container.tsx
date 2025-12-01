import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className={cn(
      "w-full max-w-md min-h-screen relative overflow-x-hidden",
      className
    )} style={{ 
      background: 'linear-gradient(180deg, #FFEDD5 0%, #FFEDD5 5%, #FFF0DB 10%, #FFF3E1 15%, #FFF6E7 20%, #FFF8ED 25%, #FFFAF3 30%, #FFFCF8 40%, #FFFEFD 50%, #FFFFFF 60%)',
      border: 'none',
      outline: 'none',
      margin: '0',
      padding: '0'
    }}>
      {children}
    </div>
  );
}