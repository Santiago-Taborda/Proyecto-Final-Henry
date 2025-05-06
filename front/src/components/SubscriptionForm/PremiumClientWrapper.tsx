"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionForm from "@/components/SubscriptionForm/SubscriptionForm";

const stripePromise = loadStripe("pk_test_51RF3SNRD8j9lJKZADWj4NOzQ4llyLDwGVYCxfxek1WQFsEDtaGPYrUGCot8CrzAvPamSUutSEArB4GyV2QS0RoBL00QbvwZOvv");

export default function PremiumClientWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm />
    </Elements>
  );
}
