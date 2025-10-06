import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, Gift, Star } from "lucide-react"

// Server component for static content - can be pre-rendered
export function StudentBanner() {
  return (
    <div className="mt-10 rounded-2xl p-6 md:p-8 bg-gradient-to-r from-emerald-200 via-sky-200 to-violet-200">
      <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-4 py-2 shadow-sm">
            <Gift className="size-4" />
            <span className="font-semibold">Ưu đãi đặc biệt cho sinh viên Việt Nam</span>
          </div>
          <p className="text-sm mt-2">
            Giảm giá lên đến 25% khi đăng ký gói năm + Tặng thêm 1 tháng miễn phí
          </p>
        </div>
        <div className="md:col-span-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <InfoPill>Giá phù hợp túi tiền sinh viên</InfoPill>
          <InfoPill>Tối ưu cho chương trình Việt Nam</InfoPill>
          <InfoPill>Hỗ trợ tiếng Việt 24/7</InfoPill>
          <InfoPill>Ưu đãi thường xuyên</InfoPill>
        </div>
      </div>
    </div>
  )
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        <Star className="size-4 text-primary" />
        <span>{children}</span>
      </div>
    </div>
  )
}

export function FAQ({ faqData }: { faqData: Array<{ q: string; a: string }> }) {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-center mb-4">Câu hỏi thường gặp</h2>
      <div className="grid gap-3 max-w-3xl mx-auto">
        {faqData.map((item, i) => (
          <Card key={i} className="bg-card/80 hover:bg-card hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-base group-hover:text-primary transition-colors duration-300">{item.q}</CardTitle>
              <CardDescription className="group-hover:text-foreground transition-colors duration-300">{item.a}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function Guarantee() {
  return (
    <div className="mt-10 rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 text-center hover:shadow-lg transition-all duration-300 group">
      <div className="mx-auto max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <Shield className="size-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm font-medium">Đảm bảo hoàn tiền 100%</span>
        </div>
        <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
          Nếu không hài lòng trong vòng 30 ngày đầu, chúng tôi sẽ hoàn lại 100% số tiền.
          Không cần lý do, không đặt câu hỏi!
        </p>
      </div>
    </div>
  )
}
