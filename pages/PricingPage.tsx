
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';

const PlanCard: React.FC<{
  plan: string;
  price: string;
  pricePer: string;
  monthlyBreakdown?: string;
  savings?: string;
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
  ribbonText?: string;
}> = ({ plan, price, pricePer, monthlyBreakdown, savings, description, features, cta, isPopular, ribbonText }) => {
  const cardClasses = isPopular
    ? 'border-[#FF8A65] border-2 transform md:scale-105 shadow-2xl'
    : 'border-slate-200/80 border';

  const buttonClasses = isPopular
    ? 'bg-[#FF8A65] hover:bg-[#ff7043] text-white'
    : 'bg-slate-800 hover:bg-slate-900 text-white';

  return (
    <div className={`relative bg-white rounded-2xl p-8 flex flex-col ${cardClasses} transition-transform duration-300`}>
      {isPopular && ribbonText && (
        <div className="absolute top-0 right-0 mr-4 -mt-3">
          <div className="bg-[#FF8A65] text-white text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 shadow-md">
            {ribbonText}
          </div>
        </div>
      )}
      <h3 className="text-2xl font-bold text-slate-800">{plan}</h3>
      <p className="mt-2 text-slate-500">{description}</p>
      
      <div className="mt-4 min-h-[90px]">
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold tracking-tight text-slate-900">{price}</span>
          <span className="ml-1 text-xl font-semibold text-slate-500">{pricePer}</span>
        </div>
        {monthlyBreakdown && <p className="text-slate-500 mt-1">{monthlyBreakdown}</p>}
        {savings && <p className="mt-1 text-sm font-medium text-[#FF8A65]">{savings}</p>}
      </div>
      
      <ul className="my-8 space-y-3 text-slate-700 flex-grow">
        {features.map((feature, index) => (
            <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-[#FF8A65] flex-shrink-0 mr-2 mt-0.5" />
                <span>{feature}</span>
            </li>
        ))}
      </ul>
      
      <a href="#" className={`w-full h-11 mt-8 flex items-center justify-center text-center font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${buttonClasses}`}>
        {cta}
      </a>
    </div>
  );
};


const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    return (
        <div className="container mx-auto px-6 h-full flex flex-col">
            <div className="flex-grow overflow-y-auto py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-slate-800">Choose the plan that's right for you</h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Start for free, then unlock more features as you grow.</p>
                </div>

                <div className="flex justify-center items-center my-10">
                    <span className={`px-4 py-2 font-medium transition ${billingCycle === 'monthly' ? 'text-slate-800' : 'text-slate-500'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                        className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A65]"
                        aria-label={`Switch to ${billingCycle === 'monthly' ? 'annual' : 'monthly'} billing`}
                    >
                    <span
                        className={`${
                        billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                    </button>
                    <span className={`px-4 py-2 font-medium transition ${billingCycle === 'annual' ? 'text-slate-800' : 'text-slate-500'}`}>
                        Annual
                        <span className="ml-2 text-xs font-bold text-[#e65100] bg-[#ffccbc] rounded-full px-2 py-0.5">Save up to 33%</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <PlanCard 
                        plan="Essential"
                        price={billingCycle === 'monthly' ? "$12" : "$120"}
                        pricePer={billingCycle === 'monthly' ? "/ month" : "/ year"}
                        monthlyBreakdown={billingCycle === 'annual' ? '($10/month)' : undefined}
                        savings={billingCycle === 'annual' ? 'Save $24 (17%)' : undefined}
                        description="For individuals and casual users."
                        features={[
                            "40 summaries per month",
                            "Audio recording (up to 1 hour)",
                            "File uploads (up to 50MB)",
                        ]}
                        cta="Get Essential"
                    />
                    <PlanCard 
                        plan="Professional"
                        price={billingCycle === 'monthly' ? "$29" : "$240"}
                        pricePer={billingCycle === 'monthly' ? "/ month" : "/ year"}
                        monthlyBreakdown={billingCycle === 'annual' ? '($20/month)' : undefined}
                        savings={billingCycle === 'annual' ? 'Save $108 (31%)' : undefined}
                        description="For professionals & frequent users."
                        features={[
                            "150 summaries per month",
                            "Up to 3 hours of audio recording",
                            "Larger file uploads (up to 150MB)",
                            "Priority email support"
                        ]}
                        cta="Choose Professional"
                        isPopular={true}
                        ribbonText={billingCycle === 'annual' ? 'Best Value' : 'Most Popular'}
                    />
                    <PlanCard 
                        plan="Business"
                        price={billingCycle === 'monthly' ? "$60" : "$480"}
                        pricePer={billingCycle === 'monthly' ? "/ month" : "/ year"}
                        monthlyBreakdown={billingCycle === 'annual' ? '($40/month)' : undefined}
                        savings={billingCycle === 'annual' ? 'Save $240 (33%)' : undefined}
                        description="For teams, agencies & power users."
                        features={[
                           "Unlimited summaries*",
                           "Up to 12 hours of audio recording",
                           "Largest file uploads: up to 1.2 GB",
                           "Dedicated support"
                        ]}
                        cta="Go Business"
                    />
                </div>

                <div className="mt-12 pt-8 text-center border-t border-slate-200/80 max-w-3xl mx-auto">
                    <p className="text-lg text-slate-700">
                        Try Easy Minutes for free. Your first 3 summaries are on us.
                        <Link to="/" className="ml-2 font-semibold text-[#FF8A65] hover:underline">
                            Start Generating
                        </Link>
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">
                        * 'Unlimited' is subject to a fair use policy to prevent abuse.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;