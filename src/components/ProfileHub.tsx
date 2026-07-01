import React, { useState } from 'react';
import { 
  User, CreditCard, ShieldCheck, Check, Sparkles, AlertCircle, 
  Eye, Heart, Film, ArrowRight, Trash2, Edit2, Play, ExternalLink, 
  Calendar, Loader2, RefreshCw, Star, X
} from 'lucide-react';
import { CreatorProfile, UserSubscription, CreatorVideoPost } from '../types';

interface ProfileHubProps {
  profile: CreatorProfile | null;
  subscription: UserSubscription | null;
  onUpdateProfile: (updates: { name: string; handle: string; bio: string; avatarUrl?: string }) => Promise<void>;
  onUpgradeSubscription: (planId: string, cardBrand?: string, cardLast4?: string) => Promise<{ success: boolean; subscription: any }>;
  onCancelSubscription: () => Promise<boolean>;
  onDeleteVideo: (postId: string) => Promise<boolean>;
}

export default function ProfileHub({
  profile,
  subscription,
  onUpdateProfile,
  onUpgradeSubscription,
  onCancelSubscription,
  onDeleteVideo
}: ProfileHubProps) {
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || 'Creator');
  const [editedHandle, setEditedHandle] = useState(profile?.handle || '@creator');
  const [editedBio, setEditedBio] = useState(profile?.bio || '');
  const [editedAvatar, setEditedAvatar] = useState(profile?.avatarUrl || '');

  // Checkout modal state
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{ id: string; name: string; price: number; billingCycle: string; limit: number } | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Active playing video modal
  const [activeVideoToPlay, setActiveVideoToPlay] = useState<CreatorVideoPost | null>(null);

  // Predefined plans info
  const subscriptionPlans = [
    {
      id: 'weekly-lite',
      name: 'Lite Creator',
      price: 5,
      billingCycle: 'week',
      limit: 9,
      features: [
        'Post up to 9 videos per week',
        'Standard anime rendering engine',
        '1080p full-HD video export',
        'Cloud sync with 2 devices',
        'Standard co-pilot script audits'
      ],
      popular: false,
      color: 'border-slate-200 dark:border-gray-800'
    },
    {
      id: 'weekly-pro',
      name: 'Pro Creator',
      price: 12,
      billingCycle: 'week',
      limit: 16,
      features: [
        'Post up to 16 videos per week',
        'Ultra-low latency rendering priority',
        '4K cinematic audio & video',
        'Sync across unlimited devices',
        'Full Co-pilot AI Script Doctor access',
        'Early-access beta art presets'
      ],
      popular: true,
      color: 'border-purple-500 ring-2 ring-purple-500/20'
    },
    {
      id: 'monthly-basic',
      name: 'Monthly Basic',
      price: 19,
      billingCycle: 'month',
      limit: 40,
      features: [
        'Post up to 40 videos per month',
        'Full high-definition stereo dubbing',
        'Custom voice training integration',
        'No watermark branding',
        'Access to alternative branching endpoints'
      ],
      popular: false,
      color: 'border-slate-200 dark:border-gray-800'
    },
    {
      id: 'monthly-unlimited',
      name: 'Monthly Unlimited',
      price: 39,
      billingCycle: 'month',
      limit: 'Unlimited',
      features: [
        'Post unlimited video episodes',
        'Absolute top-priority GPU processing',
        'Unlimited audio synthesis/soundtracks',
        'Dedicated server export storage',
        '24/7 dedicated support & SLA'
      ],
      popular: false,
      color: 'border-indigo-500'
    }
  ];

  const handleStartCheckout = (plan: typeof subscriptionPlans[0]) => {
    setSelectedPlanForCheckout({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      limit: typeof plan.limit === 'number' ? plan.limit : 999999
    });
    setCheckoutError('');
    setCardName(profile?.name || '');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      name: editedName,
      handle: editedHandle,
      bio: editedBio,
      avatarUrl: editedAvatar || undefined
    });
    setIsEditing(false);
  };

  const handleCardNumberChange = (value: string) => {
    // Basic auto formatting
    const cleaned = value.replace(/\D/g, '');
    const matched = cleaned.match(/.{1,4}/g);
    setCardNumber(matched ? matched.join(' ') : cleaned);
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setCardExpiry(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    } else {
      setCardExpiry(cleaned);
    }
  };

  const handleCvcChange = (value: string) => {
    setCardCvc(value.replace(/\D/g, '').slice(0, 4));
  };

  const handleCompleteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    if (!cardName.trim()) {
      setCheckoutError('Please enter the cardholder name.');
      return;
    }
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.length < 15) {
      setCheckoutError('Please enter a valid credit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setCheckoutError('Please enter card expiration date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setCheckoutError('Please enter card validation code (CVC).');
      return;
    }

    setIsProcessingPayment(true);
    setCheckoutError('');

    // Simulate standard credit card processing
    setTimeout(async () => {
      // Determine simulated brand
      let brand = 'Visa';
      if (cleanNum.startsWith('5')) brand = 'Mastercard';
      if (cleanNum.startsWith('3')) brand = 'American Express';

      const last4 = cleanNum.slice(-4);

      const result = await onUpgradeSubscription(selectedPlanForCheckout.id, brand, last4);
      setIsProcessingPayment(false);
      if (result.success) {
        setSelectedPlanForCheckout(null);
      } else {
        setCheckoutError('Transaction failed: Insufficient funds or payment gateway error.');
      }
    }, 2000);
  };

  if (!profile || !subscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
        <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loading Creator Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. CREATOR PROFILE HEADER */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <img 
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"} 
              alt={profile.name} 
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/20 bg-gray-100 dark:bg-gray-950"
            />
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3" id="profile-edit-form">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={editedName} 
                    onChange={e => setEditedName(e.target.value)}
                    placeholder="Creator Name"
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
                    required
                  />
                  <input 
                    type="text" 
                    value={editedHandle} 
                    onChange={e => setEditedHandle(e.target.value)}
                    placeholder="Creator Handle (@name)"
                    className="px-3 py-1.5 text-xs font-mono rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={editedBio} 
                    onChange={e => setEditedBio(e.target.value)}
                    placeholder="Brief bio about your anime creations"
                    className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white w-64 md:w-96"
                  />
                  <button 
                    type="submit" 
                    className="px-3.5 py-1.5 bg-purple-600 text-white font-semibold rounded-xl text-xs cursor-pointer hover:bg-purple-700 transition-colors"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditedName(profile.name);
                      setEditedHandle(profile.handle);
                      setEditedBio(profile.bio);
                      setEditedAvatar(profile.avatarUrl);
                      setIsEditing(false);
                    }}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-display font-extrabold text-lg text-gray-900 dark:text-white">{profile.name}</h2>
                  <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{profile.handle}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal max-w-xl">{profile.bio}</p>
                <div className="flex items-center space-x-4 pt-1 text-[11px] font-mono text-gray-400">
                  <span>🎥 <strong>{profile.postedVideos.length}</strong> Videos Posted</span>
                  <span>⭐ Subscription: <strong>{subscription.status === 'active' ? subscription.planName : 'Free Plan'}</strong></span>
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <button 
              onClick={() => {
                setEditedName(profile.name);
                setEditedHandle(profile.handle);
                setEditedBio(profile.bio);
                setEditedAvatar(profile.avatarUrl);
                setIsEditing(true);
              }}
              className="px-3.5 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
              id="edit-profile-trigger"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. CURRENT PLAN / BILLING PANEL */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-purple-500" />
          <span>Active Subscription & Billing Details</span>
        </h3>

        {subscription.status === 'active' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Status overview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-100 dark:border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 font-bold">CURRENT LEVEL</span>
                <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] uppercase font-bold rounded-md flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ACTIVE</span>
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="block font-display font-extrabold text-xl text-gray-950 dark:text-white">{subscription.planName}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  ${subscription.price} per {subscription.billingCycle}
                </span>
              </div>
            </div>

            {/* Quota counter */}
            <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-mono text-[10px]">VIDEO QUOTA STATUS</span>
                <span className="font-mono font-bold text-gray-950 dark:text-white">
                  {subscription.videosPostedThisCycle} / {subscription.videoLimit > 50000 ? 'Unlimited' : subscription.videoLimit} posted
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${subscription.videoLimit > 50000 ? 5 : Math.min(100, (subscription.videosPostedThisCycle / subscription.videoLimit) * 100)}%` }}
                ></div>
              </div>
              <span className="block text-[10px] text-gray-400 dark:text-gray-500 italic font-mono">
                Quota resets automatically at the end of each billing cycle.
              </span>
            </div>

            {/* Payment Method & Cancel */}
            <div className="p-5 rounded-2xl border border-gray-150 dark:border-gray-800 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-gray-400">Next Billing Date:</span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-white">
                    {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-gray-400">Payment Instrument:</span>
                  <span className="font-mono font-semibold text-gray-900 dark:text-white flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    <span>{subscription.cardBrand} (*{subscription.cardLast4})</span>
                  </span>
                </div>
              </div>

              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to cancel your creator subscription? You will lose posting privileges and immediately fall back to the Free Trial.")) {
                    const success = await onCancelSubscription();
                    if (success) {
                      alert("Subscription cancelled successfully.");
                    }
                  }
                }}
                className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/15 dark:hover:bg-red-950/25 text-red-600 dark:text-red-400 font-semibold rounded-xl text-xs transition-colors cursor-pointer text-center"
                id="cancel-sub-btn"
              >
                Cancel Subscription Plan
              </button>
            </div>

          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between bg-yellow-50/50 dark:bg-amber-950/10 border border-yellow-100 dark:border-amber-900/30 p-5 rounded-2xl gap-4">
            <div className="flex items-start space-x-3 max-w-xl">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block font-bold text-xs text-gray-900 dark:text-white">Unsubscribed (Free Trial)</span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                  You are currently on the trial tier. To automatically post anime episodes directly to your portfolio, you must purchase a weekly or monthly creator subscription. Choose a suitable tier below!
                </p>
              </div>
            </div>
            <div className="text-xs shrink-0 font-mono text-gray-400 italic">No credit card on file.</div>
          </div>
        )}
      </div>

      {/* 3. SUBSCRIPTION TIERS / COMPARISON CHART */}
      <div className="space-y-4">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono">CHOOSE YOUR INTENSITY</span>
          <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-xl">Select a Flexible Creator Tier</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Scale up weekly slots for intensive seasonal scheduling, or lock in long-term monthly unlimited access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => {
            const isCurrent = subscription.planId === plan.id;
            return (
              <div 
                key={plan.id}
                className={`p-6 rounded-3xl bg-white dark:bg-gray-900 border flex flex-col justify-between transition-all hover:shadow-lg ${plan.color}`}
                id={`plan-card-${plan.id}`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-bold font-display text-gray-950 dark:text-white">{plan.name}</span>
                    {plan.popular && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono text-[8px] uppercase font-bold rounded-md">
                        Best Choice
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline space-x-1 text-gray-900 dark:text-white">
                    <span className="text-3xl font-display font-extrabold">${plan.price}</span>
                    <span className="text-xs font-mono text-gray-400">/ {plan.billingCycle}</span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-850/60 text-xs flex items-center justify-between">
                    <span className="text-gray-500">Posting Capacity:</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                      {plan.limit === 'Unlimited' ? 'Unlimited' : `${plan.limit} videos / ${plan.billingCycle}`}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <div className="w-full py-2.5 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 bg-purple-500/5">
                      <Check className="w-3.5 h-3.5" />
                      <span>My Current Plan</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCheckout(plan)}
                      className="w-full py-2.5 bg-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-850 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                      id={`plan-subscribe-btn-${plan.id}`}
                    >
                      <span>Subscribe Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CREATOR PORTFOLIO SHOWCASE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="border-b border-gray-150 dark:border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">My Creator Portfolio Showcase</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              These are the anime episodes and series published publicly using your creator account.
            </p>
          </div>
          <span className="px-2.5 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 text-xs font-mono text-purple-500">
            🌌 <strong>{profile.postedVideos.length}</strong> Videos Active
          </span>
        </div>

        {profile.postedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.postedVideos.map((video) => (
              <div 
                key={video.id}
                className="group p-4 rounded-2xl border border-gray-150 dark:border-gray-800 bg-gray-50/10 dark:bg-gray-950/5 flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-900/60 transition-all shadow-xs"
                id={`posted-video-card-${video.id}`}
              >
                <div className="space-y-3">
                  {/* Aspect Ratio Video Card representation */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-950 border border-gray-200/50 dark:border-gray-850 group-hover:shadow-md transition-all">
                    {/* Generates placeholder art according to category name or visual style */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-950/60 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-white/20 group-hover:scale-110 transition-transform cursor-pointer drop-shadow-md" onClick={() => setActiveVideoToPlay(video)} />
                    </div>
                    {/* Labels badge */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] uppercase font-mono tracking-wider font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-1 rounded-md">
                      <span>{video.animationStyle}</span>
                      <span className="text-purple-400">{video.genre}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] uppercase font-mono text-purple-500 font-bold">{video.projectTitle}</span>
                    <h4 className="font-display font-bold text-sm text-gray-950 dark:text-white truncate">
                      Ep {video.episodeNumber}: {video.episodeTitle}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                      {video.episodeDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-150 dark:border-gray-850/80 text-[11px] font-mono text-gray-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{video.views}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-red-500/70">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                      <span>{video.likes}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setActiveVideoToPlay(video)}
                      className="p-1.5 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950/30 dark:hover:text-purple-300 rounded-lg cursor-pointer"
                      title="Play Preview"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Unpublish "Episode ${video.episodeNumber}" and delete it from your portfolio? This action restores 1 credit of your posting limit.`)) {
                          await onDeleteVideo(video.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-lg cursor-pointer text-gray-400"
                      title="Delete / Unpublish video"
                      id={`unpublish-video-btn-${video.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-150 dark:border-gray-800 rounded-2xl bg-gray-50/10 dark:bg-gray-950/10">
            <Film className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <span className="block font-bold text-xs text-gray-800 dark:text-white">No episodes posted to your profile yet</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 leading-normal">
              Go to your Editor Workspace, pick an completed episode, and select "Post to Public Profile" to publish your masterpiece here!
            </p>
          </div>
        )}
      </div>

      {/* 5. CHECKOUT BILLING DIALOG OVERLAY */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-6 animate-zoom-in">
            
            <button 
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 text-center">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono text-[9px] uppercase font-bold rounded">
                SECURE CHECKOUT
              </span>
              <h3 className="font-display font-extrabold text-gray-900 dark:text-white text-base">
                Upgrade to {selectedPlanForCheckout.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You will be charged <strong className="text-gray-900 dark:text-white">${selectedPlanForCheckout.price}</strong> per {selectedPlanForCheckout.billingCycle}. Cancel anytime.
              </p>
            </div>

            <form onSubmit={handleCompleteCheckout} className="space-y-4" id="checkout-form">
              {checkoutError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="e.g. Enock Kabwe"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => handleCardNumberChange(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-hidden font-mono"
                      required
                    />
                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">Expiration (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => handleExpiryChange(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-hidden font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={e => handleCvcChange(e.target.value)}
                      placeholder="***"
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-hidden font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-purple-500/10"
                  id="checkout-submit-btn"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authorizing Charge...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Payment of ${selectedPlanForCheckout.price}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative my-4 flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
                <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-mono uppercase">or pay with paypal</span>
                <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              </div>

              <div 
                onClick={async () => {
                  setIsProcessingPayment(true);
                  setTimeout(async () => {
                    const result = await onUpgradeSubscription(selectedPlanForCheckout.id, "PayPal", "enockkabwe28@gmail.com");
                    setIsProcessingPayment(false);
                    if (result.success) {
                      setSelectedPlanForCheckout(null);
                      alert(`Successfully authorized payment using PayPal account enockkabwe28@gmail.com for ${selectedPlanForCheckout.name}!`);
                    }
                  }, 1500);
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all shadow-md shadow-amber-500/5 select-none"
                id="paypal-checkout-btn"
              >
                <span className="font-sans italic font-extrabold text-blue-900 text-sm">Pay<span className="text-sky-600">Pal</span></span>
                <span className="text-[11px] font-semibold text-blue-950">(enockkabwe28@gmail.com)</span>
              </div>

              <span className="block text-[9px] text-center text-gray-400 font-mono leading-normal">
                By completing payment, you agree to automatic renewals. Card details are fully encrypted and transmitted directly via secure tokens.
              </span>
            </form>
          </div>
        </div>
      )}

      {/* 6. IMMERSIVE VIDEO PORTFOLIO PLAYER DIALOG */}
      {activeVideoToPlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-gray-850 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative flex flex-col animate-zoom-in">
            
            <button 
              onClick={() => setActiveVideoToPlay(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-white/60 bg-black/40 hover:bg-black/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Stage Container */}
            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden border-b border-gray-850">
              {/* Dynamic visual representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-black to-slate-950/40 flex flex-col justify-between p-6">
                
                {/* Overlay details */}
                <div className="space-y-1 self-start">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-md">
                    {activeVideoToPlay.projectTitle}
                  </span>
                  <h3 className="text-white font-display font-extrabold text-base">
                    Episode {activeVideoToPlay.episodeNumber}: {activeVideoToPlay.episodeTitle}
                  </h3>
                </div>

                {/* Aesthetic Anime Visual Art preview */}
                <div className="w-full flex items-center justify-center h-40 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-center select-none animate-pulse">
                    <Star className="w-12 h-12 text-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest bg-black/60 px-3 py-1 rounded-md">
                      Rendering Cine-Frame Sequence...
                    </span>
                  </div>
                </div>

                {/* Subtitles Overlay */}
                <div className="w-full text-center bg-black/60 backdrop-blur-xs py-2 px-4 rounded-xl border border-white/5 font-display text-white text-xs tracking-tight italic select-none">
                  &ldquo;A grand fate awaits us in the digital cosmos!&rdquo;
                </div>
              </div>
            </div>

            {/* Player details footer */}
            <div className="p-5 space-y-4 bg-gray-900/60 text-xs">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-purple-500">CREATOR CREDITS</span>
                  <span className="block font-bold text-white">{profile.name} ({profile.handle})</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 font-mono text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5 text-gray-500" />
                    <span>{activeVideoToPlay.views} Views</span>
                  </span>
                  <span className="flex items-center space-x-1 text-red-400">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                    <span>{activeVideoToPlay.likes} Likes</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-gray-300">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-purple-500">EPISODE DIRECTORY BIO</span>
                <p className="leading-relaxed text-[11px] text-gray-400">{activeVideoToPlay.episodeDescription}</p>
              </div>

              <div className="pt-2 border-t border-gray-800 flex justify-between text-[10px] font-mono text-gray-500">
                <span>Published on {new Date(activeVideoToPlay.postedAt).toLocaleString()}</span>
                <span className="uppercase text-purple-400 font-bold">{activeVideoToPlay.animationStyle} / {videoPresetGenreToGenreLabel(activeVideoToPlay.genre)}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Simple label mapper helper
function videoPresetGenreToGenreLabel(raw: string) {
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
