"use client";

import { useState } from "react";

export default function ClaimPromo({ campaign, ctaText, onSubmitSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClaimPromo = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call or any processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSuccess(true);
      onSubmitSuccess?.();
      
      // Redirect to registration page with promo code
      setTimeout(() => {
        window.location.href = `/register?promoCode=59MIN_CHRISTMAS_20`;
      }, 1000);
      
    } catch (error) {
      console.error("Claim error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-green-400 text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2">Success!</h3>
        <p className="text-gray-300">Redirecting to registration...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClaimPromo}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          ctaText || "Claim Promo"
        )}
      </button>
    </div>
  );
}