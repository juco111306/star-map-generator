"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/utils/convertToSubcurrency";

import { useLanguage } from "@/context/LanguageContext";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const { locale, currency, formatPrice } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: convertToSubcurrency(amount),
        locale,
        currency: currency.toLowerCase(),
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, locale, currency]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/payment-success?amount=${amount}&currency=${currency.toLowerCase()}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        disabled={!stripe || loading}
        className="w-full bg-[#1C1917] hover:bg-[#2E2A27] text-[#FAF8F5] p-3 font-semibold text-xs rounded-xl mt-4 disabled:opacity-50 transition shadow-sm"
      >
        {!loading
          ? (locale === 'de'
            ? `Jetzt ${formatPrice(amount)} bezahlen`
            : locale === 'en'
            ? `Pay ${formatPrice(amount)}`
            : `Betaal ${formatPrice(amount)}`)
          : (locale === 'de'
            ? 'Wird verarbeitet...'
            : locale === 'en'
            ? 'Processing...'
            : 'Verwerken...')}
      </button>
    </form>
  );
};

export default CheckoutPage;
