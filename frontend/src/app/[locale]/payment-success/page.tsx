import React from 'react';
import PaymentSuccessPage from '../../payment-success/page';
import { SUPPORTED_LOCALES } from '@/locales';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function LocalePaymentSuccessPage() {
  return <PaymentSuccessPage />;
}
