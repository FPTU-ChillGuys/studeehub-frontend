"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSettings() {
  const [showReset, setShowReset] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // Reset Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Forgot Password State
  const [email, setEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetMessage("New passwords do not match.");
      return;
    }
    // TODO: Call API to reset password
    setResetMessage("Password changed successfully (mock). Please log in again!");
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to send reset email
    setForgotMessage("Password reset email sent (mock). Please check your inbox!");
    setEmail("");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={() => setShowReset((v) => !v)}>
            Reset Password
          </Button>
          {showReset && (
            <form className="space-y-2" onSubmit={handleResetPassword}>
              <Input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit">Confirm password change</Button>
              {resetMessage && <div className="text-sm text-green-600 mt-2">{resetMessage}</div>}
            </form>
          )}
          <Button variant="outline" onClick={() => setShowForgot((v) => !v)}>
            Forgot Password
          </Button>
          {showForgot && (
            <form className="space-y-2" onSubmit={handleForgotPassword}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit">Send password reset email</Button>
              {forgotMessage && <div className="text-sm text-green-600 mt-2">{forgotMessage}</div>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
