
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, Trophy, Crown } from "lucide-react";
import { RewardTier, xtraMartService } from "@/services/xtraMartService";
import { useToast } from "@/hooks/use-toast";

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
  const [rewardTiers] = useState<RewardTier[]>(xtraMartService.getRewardTiers());
  const [currentPoints] = useState(750); // Mock current points
  const [currentTier, setCurrentTier] = useState('bronze');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'bronze':
        return <Star className="w-5 h-5 text-amber-600" />;
      case 'silver':
        return <Gift className="w-5 h-5 text-gray-500" />;
      case 'gold':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'platinum':
        return <Crown className="w-5 h-5 text-purple-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'bronze':
        return 'from-amber-50 to-orange-50';
      case 'silver':
        return 'from-gray-50 to-slate-50';
      case 'gold':
        return 'from-yellow-50 to-amber-50';
      case 'platinum':
        return 'from-purple-50 to-indigo-50';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const handleJoinTier = async (tierId: string) => {
    const tier = rewardTiers.find(t => t.id === tierId);
    
    if (!tier) return;
    
    if (currentPoints < tier.pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${tier.pointsRequired - currentPoints} more points to join ${tier.name}`,
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      const result = await xtraMartService.joinRewards(tierId);
      
      toast({
        title: result.success ? "Welcome to the tier!" : "Join Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        setCurrentTier(tierId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  const getProgressToNext = () => {
    const currentTierIndex = rewardTiers.findIndex(tier => tier.id === currentTier);
    const nextTier = rewardTiers[currentTierIndex + 1];
    
    if (!nextTier) return { progress: 100, pointsNeeded: 0 };
    
    const progress = (currentPoints / nextTier.pointsRequired) * 100;
    const pointsNeeded = Math.max(0, nextTier.pointsRequired - currentPoints);
    
    return { progress, pointsNeeded, nextTier };
  };

  const { progress, pointsNeeded, nextTier } = getProgressToNext();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-600" />
            Smart Rewards System
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Your Rewards Status</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Current Points</span>
                <span className="font-bold text-yellow-600">{currentPoints.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Current Tier</span>
                <Badge className="bg-yellow-100 text-yellow-800 capitalize">
                  {currentTier}
                </Badge>
              </div>
              
              {nextTier && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Next Tier</span>
                    <span className="text-sm font-medium capitalize">{nextTier.name}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress to {nextTier.name}</span>
                      <span>{pointsNeeded} points needed</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reward Tiers */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">Available Reward Tiers</h5>
            
            {rewardTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`hover:shadow-lg transition-shadow ${
                  tier.id === currentTier ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className={`bg-gradient-to-r ${getTierColor(tier.id)} -m-4 p-4 rounded-lg mb-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTierIcon(tier.id)}
                        <h4 className="font-bold text-gray-900">{tier.name}</h4>
                      </div>
                      {tier.id === currentTier && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Points Required:</strong> {tier.pointsRequired.toLocaleString()}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Cashback:</strong> {tier.discount}%
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <h6 className="font-medium text-gray-900">Benefits:</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {tier.id !== currentTier && (
                    <Button
                      onClick={() => handleJoinTier(tier.id)}
                      disabled={isJoining || currentPoints < tier.pointsRequired}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                    >
                      {currentPoints < tier.pointsRequired 
                        ? `Need ${tier.pointsRequired - currentPoints} more points`
                        : isJoining ? "Joining..." : `Join ${tier.name}`
                      }
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to Earn Points */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">How to Earn Points</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 1 point per ₹10 spent</li>
              <li>• 50 bonus points on first order</li>
              <li>• 100 points for referring a friend</li>
              <li>• Double points during festival seasons</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
