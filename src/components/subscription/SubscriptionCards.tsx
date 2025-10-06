import { Check, Crown, Gift, Shield, Star } from "lucide-react"

// Static data that can be pre-rendered
export const subscriptionPlans = {
  freemium: {
    id: "freemium",
    label: "Freemium",
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
  },
  studentPro: {
    id: "student-pro",
    label: "Student Pro",
    description: "Hoàn hảo cho học sinh, sinh viên Việt Nam",
    oldPrice: "59.000",
    monthlyPrice: "49.000",
    yearlyPrice: "490.000",
    discount: "-26%",
    badge: "PHỔ BIẾN NHẤT",
    buttonLabel: "Đăng ký ngay",
    highlighted: true,
    features: [
      { text: "Upload tài liệu", included: true, limit: "Không giới hạn" },
      { text: "Tạo câu hỏi AI", included: true, limit: "50 câu hỏi/ngày" },
      { text: "Làm quiz", included: true, limit: "20 quiz/ngày" },
      { text: "Tham gia forum", included: true, limit: "Không giới hạn" },
      { text: "Learning path nâng cao", included: true, limit: "5 paths" },
      { text: "Lưu trữ tài liệu", included: true, limit: "2GB" },
      { text: "AI chat", included: true, limit: "30 tin nhắn/ngày" },
      { text: "Xuất câu hỏi PDF/Word", included: true },
      { text: "Phân tích tiến độ", included: true },
      { text: "Hỗ trợ email ưu tiên", included: true },
      { text: "Tính năng nâng cao", included: false },
      { text: "Hỗ trợ 24/7", included: false },
    ]
  },
  premiumPlus: {
    id: "premium-plus",
    label: "Premium Plus",
    description: "Trải nghiệm học tập cao cấp với AI tiên tiến",
    oldPrice: "99.000",
    monthlyPrice: "79.000",
    yearlyPrice: "790.000",
    discount: "-25%",
    buttonLabel: "Đăng ký ngay",
    features: [
      { text: "Upload tài liệu", included: true, limit: "Không giới hạn" },
      { text: "Tạo câu hỏi AI", included: true, limit: "Không giới hạn" },
      { text: "Làm quiz", included: true, limit: "Không giới hạn" },
      { text: "Tham gia forum", included: true, limit: "Không giới hạn" },
      { text: "Learning path cao cấp", included: true, limit: "Không giới hạn" },
      { text: "Lưu trữ tài liệu", included: true, limit: "20GB" },
      { text: "AI chat cao cấp", included: true, limit: "Không giới hạn" },
      { text: "Xuất câu hỏi đa định dạng", included: true },
      { text: "Phân tích AI chi tiết", included: true },
      { text: "Hỗ trợ 24/7", included: true },
      { text: "Tính năng AI tiên tiến", included: true },
      { text: "Ưu tiên xử lý", included: true },
    ]
  }
}

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
]

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
  )
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
  )
}

export function CrownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
    >
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4L16 10l-2.5 4L12 11l-1.5 3L8 10.6L6.7 14z" />
    </svg>
  )
}
