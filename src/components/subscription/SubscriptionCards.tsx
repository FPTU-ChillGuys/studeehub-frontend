import { useState, useEffect } from 'react';
import subscriptionPlanService from '@/service/subscriptionPlanService';
import { SubscriptionPlan } from '@/Types';

// Interface for the plan features
interface PlanFeature {
  text: string;
  included: boolean;
  limit?: string;
}

// Interface for the plan data structure expected by the UI
interface UISubscriptionPlan {
  id: string;
  label: string;
  description: string;
  priceLabel?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  oldPrice?: string;
  discount?: string;
  badge?: string;
  icon?: React.ReactNode;
  buttonLabel: string;
  highlighted?: boolean;
  features: PlanFeature[];
}

// Helper function to map API plan to UI plan format
const mapApiPlanToUIPlan = (plan: SubscriptionPlan): UISubscriptionPlan => {
  // Default features that can be customized based on the plan
  const baseFeatures: PlanFeature[] = [
    { text: "Upload tài liệu", included: plan.maxDocuments > 0, limit: plan.maxDocuments === -1 ? "Không giới hạn" : `${plan.maxDocuments} tài liệu` },
    { text: "Lưu trữ tài liệu", included: true, limit: `${plan.maxStorageMB}MB` },
    { text: "Hỗ trợ email", included: true },
    { text: "AI chat", included: plan.hasAIAnalysis, limit: plan.hasAIAnalysis ? "Có sẵn" : "Không khả dụng" },
  ];

  // Add premium features for non-free plans
  if (plan.price > 0) {
    baseFeatures.push(
      { text: "Xuất câu hỏi PDF/Word", included: true },
      { text: "Phân tích tiến độ", included: true },
      { text: "Hỗ trợ ưu tiên", included: true },
      { text: "Tính năng nâng cao", included: true }
    );
  } else {
    baseFeatures.push(
      { text: "Xuất câu hỏi", included: false },
      { text: "Phân tích chi tiết", included: false },
      { text: "Hỗ trợ ưu tiên", included: false },
      { text: "Tính năng nâng cao", included: false }
    );
  }

  let icon: React.ReactNode;
  switch (plan.code) {
    case 'BASIC_MONTHLY':
      icon = <BookIcon />;
      break;
    case 'PRO_MONTHLY':
      icon = <StarIcon />;
      break;
    case 'PRO_YEARLY':
      icon = <CrownIcon />;
      break;
    default:
      icon = <BookIcon />;
      break;
  }

  return {
    id: plan.id,
    icon,
    label: plan.name,
    description: plan.description,
    priceLabel: plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString('vi-VN')} VND`,
    monthlyPrice: plan.price > 0 ? `${plan.price.toLocaleString('vi-VN')}` : undefined,
    yearlyPrice: plan.price > 0 ? `${(plan.price * 10).toLocaleString('vi-VN')}` : undefined,
    buttonLabel: plan.price === 0 ? "Bắt đầu miễn phí" : "Đăng ký ngay",
    highlighted: plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('premium'),
    badge: plan.name.toLowerCase().includes('pro') ? "PHỔ BIẾN NHẤT" : undefined,
    features: baseFeatures
  };
};

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<Record<string, UISubscriptionPlan>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const apiPlans = await subscriptionPlanService.getSubscriptionPlans();
        
        // Convert API plans to UI format and create a record
        const uiPlans: Record<string, UISubscriptionPlan> = {};
        apiPlans.forEach(plan => {
          const uiPlan = mapApiPlanToUIPlan(plan);
          uiPlans[plan.id] = uiPlan;
        });
        
        setPlans(uiPlans);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
        setError(err instanceof Error ? err : new Error('Failed to load subscription plans'));
        
        // Fallback to default plans if API fails
        setPlans({
          basicMonthly: {
            id: "basicMonthly",
            label: "Basic Monthly",
            description: "Trải nghiệm miễn phí với giới hạn hàng ngày",
            priceLabel: "Miễn phí",
            buttonLabel: "Bắt đầu miễn phí",
            features: [
              { text: "Upload tài liệu", included: true, limit: "3 tài liệu/ngày" },
              { text: "Tạo câu hỏi AI", included: true, limit: "10 câu hỏi/ngày" },
              { text: "Làm quiz", included: true, limit: "5 quiz/ngày" },
              { text: "Tham gia forum", included: true, limit: "5 bài viết/ngày" },
              { text: "Learning path cơ bản", included: true, limit: "1 path" },
              { text: "Lưu trữ tài liệu", included: true, limit: "100MB" },
              { text: "Hỗ trợ email", included: true },
              { text: "Xuất câu hỏi", included: false },
              { text: "AI chat không giới hạn", included: false },
              { text: "Phân tích chi tiết", included: false },
              { text: "Hỗ trợ ưu tiên", included: false },
              { text: "Tính năng nâng cao", included: false },
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

// For backward compatibility, export the plans object that can be used by other components
export const subscriptionPlans = {} as Record<string, UISubscriptionPlan>;

// Export the type for other components to use
export type { UISubscriptionPlan, PlanFeature };

// Static FAQ data
export const faqData = [
  {
    q: "Có thể thanh toán bằng cách nào?",
    a: "Chúng tôi hỗ trợ thanh toán qua thẻ ATM, Visa/Mastercard, MoMo, ZaloPay và chuyển khoản ngân hàng.",
  },
  {
    q: "Có thể hủy đăng ký bất cứ lúc nào?",
    a: "Có, bạn có thể hủy đăng ký bất cứ lúc nào. Không có phí huỷ và bạn vẫn sử dụng được đến hết chu kỳ đã thanh toán.",
  },
  {
    q: "Có ưu đãi cho sinh viên không?",
    a: "Có! Sinh viên được giảm 25% khi đăng ký gói năm và tặng thêm 1 tháng miễn phí khi xuất trình thẻ sinh viên.",
  },
];

// Icons as React components for better performance
export function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function CrownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4L16 10l-2.5 4L12 11l-1.5 3L8 10.6 6.7 14z" />
    </svg>
  );
}
