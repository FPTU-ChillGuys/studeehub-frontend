"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập/đăng ký ở đây
    console.log("Form submitted:", formData);
    // Đóng modal sau khi submit thành công
    onClose();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackgroundClick}
    >
      <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary p-4 text-primary-foreground relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold mb-1">
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </h2>
          <p className="text-primary-foreground/80 text-sm">
            {isLogin
              ? "Chào mừng bạn trở lại!"
              : "Tạo tài khoản mới để bắt đầu"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Name field (chỉ hiện khi đăng ký) */}
          {!isLogin && (
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground font-medium placeholder-muted-foreground bg-background"
                  placeholder="Nhập họ và tên của bạn"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground font-medium placeholder-muted-foreground bg-background"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground font-medium placeholder-muted-foreground bg-background"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password field (chỉ hiện khi đăng ký) */}
          {!isLogin && (
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground font-medium placeholder-muted-foreground bg-background"
                  placeholder="Nhập lại mật khẩu"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Forgot password link (chỉ hiện khi đăng nhập) */}
          {isLogin && (
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>

          {/* Toggle between login/register */}
          <div className="text-center mt-4">
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </div>

          {/* Social login divider */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Hoặc</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="mt-3 space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2.5 border border-input rounded-lg bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Đăng nhập với Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
