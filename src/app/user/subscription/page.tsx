"use client";

import { useState, Suspense } from "react";
import { Check, Star } from "lucide-react";
import {
  StudentBanner,
  FAQ,
  Guarantee,
} from "@/components/subscription/StaticSubscriptionContent";
import {
  faqData,
} from "@/components/subscription/SubscriptionCards";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionPlans } from "@/components/subscription/SubscriptionCards";

export default function SubscriptionPage() {
  const { plans } = useSubscriptionPlans();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 p-6 md:p-10 w-full">
        <section className="mx-auto max-w-6xl">
          <header className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Gói Đăng Ký StudeeHub
            </h1>
            <p className="text-muted-foreground">
              Chọn gói phù hợp với nhu cầu học tập của bạn
            </p>
          </header>

          <div className="flex items-center justify-center gap-3 mt-6 text-sm">
            <span
              className={
                billingCycle === "monthly"
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground transition-colors duration-200"
              }
            >
              Thanh toán hàng tháng
            </span>
            <button
              aria-label="toggle billing cycle"
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 transition-all duration-300 shadow-inner"
              onClick={() =>
                setBillingCycle((v) => (v === "monthly" ? "yearly" : "monthly"))
              }
            >
              <span
                className={
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 hover:shadow-xl " +
                  (billingCycle === "yearly"
                    ? "translate-x-5"
                    : "translate-x-1")
                }
              />
            </button>
            <span
              className={
                billingCycle === "yearly"
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground transition-colors duration-200"
              }
            >
              Thanh toán hàng năm
            </span>
          </div>

          <Suspense fallback={<div>Loading pricing cards...</div>}>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {Object.entries(plans).map(([planId, plan]) => (
                <PricingCard
                  key={planId}
                  planId={planId}
                  selected={selectedPlan === planId}
                  onSelect={() => setSelectedPlan(planId)}
                  icon={plan.icon}
                  label={plan.label}
                  description={plan.description}
                  priceLabel={plan.priceLabel}
                  buttonLabel={plan.buttonLabel}
                  features={plan.features}
                />
              ))}
              {/* Freemium */}
              {/* <PricingCard
                planId={plans.freemium.id}
                selected={selectedPlan === plans.freemium.id}
                onSelect={() => setSelectedPlan(plans.freemium.id)}
                icon={<BookIcon />}
                label={plans.freemium.label}
                description={plans.freemium.description}
                priceLabel={plans.freemium.priceLabel}
                buttonLabel={plans.freemium.buttonLabel}
                features={plans.freemium.features}
              /> */}

              {/* Student Pro */}
              {/* <PricingCard
                planId={plans.studentPro.id}
                selected={selectedPlan === plans.studentPro.id}
                onSelect={() =>
                  setSelectedPlan(plans.studentPro.id)
                }
                highlighted={plans.studentPro.highlighted}
                icon={<StarIcon />}
                label={plans.studentPro.label}
                description={plans.studentPro.description}
                oldPrice={plans.studentPro.oldPrice}
                price={
                  billingCycle === "monthly"
                    ? plans.studentPro.monthlyPrice
                    : plans.studentPro.yearlyPrice
                }
                priceSuffix={billingCycle === "monthly" ? "/tháng" : "/năm"}
                discount={plans.studentPro.discount}
                badge={plans.studentPro.badge}
                buttonLabel={plans.studentPro.buttonLabel}
                features={plans.studentPro.features}
              />

              {/* Premium Plus */}
              {/* <PricingCard
                planId={plans.premiumPlus.id}
                selected={selectedPlan === plans.premiumPlus.id}
                onSelect={() =>
                  setSelectedPlan(plans.premiumPlus.id)
                }
                icon={<CrownIcon />}
                label={plans.premiumPlus.label}
                description={plans.premiumPlus.description}
                oldPrice={plans.premiumPlus.oldPrice}
                price={
                  billingCycle === "monthly"
                    ? plans.premiumPlus.monthlyPrice
                    : plans.premiumPlus.yearlyPrice
                }
                priceSuffix={billingCycle === "monthly" ? "/tháng" : "/năm"}
                discount={plans.premiumPlus.discount}
                buttonLabel={plans.premiumPlus.buttonLabel}
                features={plans.premiumPlus.features}
              /> */}
            </div>
          </Suspense>

          {/* Static content - pre-rendered */}
          <StudentBanner />
          <FAQ faqData={faqData} />
          <Guarantee />
        </section>
      </main>
    </SidebarInset>
  );
}

function PricingCard({
  planId,
  selected,
  onSelect,
  label,
  description,
  icon,
  price,
  priceSuffix,
  oldPrice,
  priceLabel,
  discount,
  badge,
  buttonLabel,
  features,
  highlighted,
  accent,
}: {
  planId: string;
  selected: boolean;
  onSelect: () => void;
  label: string;
  description?: string;
  icon: React.ReactNode;
  price?: string;
  priceSuffix?: string;
  oldPrice?: string;
  priceLabel?: string;
  discount?: string;
  badge?: string;
  buttonLabel: string;
  features: Array<{ text: string; included: boolean; limit?: string }>;
  highlighted?: boolean;
  accent?: string;
}) {
  const isFreemium = planId === "freemium";
  const isStudentPro = planId === "student-pro";
  const isPremiumPlus = planId === "premium-plus";

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
        selected
          ? "border-blue-500 ring-2 ring-blue-200 shadow-xl scale-[1.02]"
          : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
      } ${highlighted ? "border-purple-300" : ""}`}
      onClick={onSelect}
    >
      <div className="bg-white rounded-2xl p-6 h-full flex flex-col">
        {badge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
              <Star className="size-3" />
              {badge}
            </div>
          </div>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isFreemium
                ? "bg-gray-600"
                : isStudentPro
                ? "bg-purple-600"
                : isPremiumPlus
                ? "bg-orange-500"
                : "bg-gray-600"
            }`}
          >
            <div className="text-white">{icon}</div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{label}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          {priceLabel ? (
            <div className="text-4xl font-bold text-gray-800">{priceLabel}</div>
          ) : (
            <div>
              {oldPrice && (
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm text-gray-400 line-through">
                    {oldPrice} VND
                  </span>
                  {discount && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                      {discount}
                    </span>
                  )}
                </div>
              )}
              <div className="text-4xl font-bold text-gray-800">
                {price}{" "}
                <span className="text-lg font-normal">VND{priceSuffix}</span>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="flex-1 mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">
            Tính năng bao gồm:
          </h4>
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    feature.included ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {feature.included ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <span className="w-3 h-3 text-gray-400 text-xs font-bold">
                      ×
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className={`text-sm ${
                      feature.included ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {feature.text}
                  </span>
                  {feature.limit && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {feature.limit}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Button */}
        <button
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
            isFreemium
              ? "bg-gray-600 hover:bg-gray-700"
              : isStudentPro
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              : isPremiumPlus
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              : "bg-gray-600 hover:bg-gray-700"
          } shadow-lg hover:shadow-xl`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
