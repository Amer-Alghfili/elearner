import React from "react";

export default function RefundPolicyPage() {
  return (
    <>
      <style>{`
        .rp-body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          color: #1a1a1a;
          line-height: 1.65;
          background: #fff;
        }
        .rp-body h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 0.5rem;
        }
        .rp-body h2 {
          font-size: 1.35rem;
          margin-top: 2.5rem;
          color: #1a1a1a;
        }
        .rp-body h3 {
          font-size: 1.1rem;
          margin-top: 1.5rem;
          color: #333;
        }
        .rp-body .updated {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }
        .rp-body ul, .rp-body ol { padding-left: 1.5rem; }
        .rp-body li { margin: 0.35rem 0; }
        .rp-body a { color: #0645ad; }
        .rp-body .callout {
          background: #fff8e1;
          border: 1px solid #f0d67a;
          padding: 0.9rem 1.1rem;
          border-radius: 6px;
          margin: 1rem 0;
        }
      `}</style>

      <div className="rp-body">
        <h1>Refund Policy</h1>
        <p className="updated">
          <strong>Last updated:</strong> April 21, 2026
        </p>

        <h2>1. Scope</h2>
        <p>
          This Refund Policy applies to purchases of Elearner subscriptions made
          through our website at{" "}
          <a href="https://elearner.academy">https://elearner.academy</a>. It
          forms part of our{" "}
          <a href="https://elearner.academy/terms-of-service">
            Terms of Service
          </a>
          . By subscribing to Elearner, you agree to this Refund Policy.
        </p>

        {/* <h2>2. Paddle as Our Merchant of Record</h2>
        <div className="callout">
          All purchases of Elearner subscriptions are processed by <strong>Paddle.com Market Limited</strong> (or its affiliate Paddle.com Inc. for purchases from the United States) (&ldquo;Paddle&rdquo;), acting as our Merchant of Record. This means Paddle handles payment, billing, tax, and refund processing on our behalf.
          <br /><br />
          All refund requests are reviewed and approved by us (Elearner), but the actual refund transaction &mdash; returning the funds to your payment method &mdash; is carried out by Paddle.
        </div> */}

        <h2>2. 14-Day Satisfaction Guarantee</h2>
        <p>
          If you are not satisfied with Elearner for any reason, you may request
          a full refund within <strong>14 days of your initial purchase</strong>
          , no questions asked.
        </p>
        <p>This applies to:</p>
        <ul>
          <li>Your first subscription purchase</li>
          <li>
            Any renewal that you did not intend (for example, you forgot to
            cancel before the renewal date &mdash; subject to Section 5 below)
          </li>
          <li>Accidental purchases or duplicate subscriptions</li>
        </ul>
        <p>
          To request a refund under this guarantee, email us at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>{" "}
          within the 14-day window. Include the email address associated with
          your account
        </p>

        <h2>3. Refunds Available at Any Time</h2>
        <p>
          Regardless of the 14-day window, we will always issue a refund in the
          following cases:
        </p>
        <ul>
          <li>
            <strong>Duplicate charges</strong> &mdash; you were billed more than
            once for the same subscription period.
          </li>
          <li>
            <strong>Unauthorized charges</strong> &mdash; your payment method
            was used without your permission.
          </li>
          <li>
            <strong>Technical failures attributable to us</strong> &mdash; the
            Service has been unavailable, non-functional, or unusable for an
            extended period and we have been unable to resolve the issue.
          </li>
          <li>
            <strong>Billing errors</strong> &mdash; you were charged an
            incorrect amount or for a plan you did not sign up for.
          </li>
        </ul>

        <h2>4. What Is Not Eligible for a Refund</h2>
        <p>
          Outside the 14-day window, the following are generally{" "}
          <strong>not</strong> eligible for a refund:
        </p>
        <ul>
          <li>
            Subscription fees for billing periods that have already been fully
            or partially used, where no technical failure or billing error
            occurred.
          </li>
          <li>
            Partial months or unused portions of your billing cycle after you
            cancel. When you cancel, you will continue to have access to paid
            features until the end of your current billing period, but the
            remaining days are not refunded.
          </li>
          <li>Change of mind after 14 days of use.</li>
          <li>
            Situations where you did not use the Service but did not request a
            refund within the 14-day window.
          </li>
          <li>
            Requests where the account has been terminated by us for violation
            of our{" "}
            <a href="https://elearner.academy/terms-of-service">
              Terms of Service
            </a>
            .
          </li>
          <li>
            Repeated or abusive refund requests from the same user or payment
            method.
          </li>
        </ul>
        <p>
          We may make exceptions to the above at our sole discretion, for
          example as a goodwill gesture for a first-time missed cancellation.
        </p>

        <h2>5. Statutory Consumer Rights (EU, UK, and Other Jurisdictions)</h2>
        <p>
          If you are a consumer residing in the European Union, the United
          Kingdom, or another jurisdiction with mandatory consumer protection
          laws, you retain all statutory rights granted under those laws,
          including:
        </p>
        <ul>
          <li>
            The right to withdraw from a distance contract within 14 days under
            EU Directive 2011/83/EU (or its UK equivalent), where applicable.
          </li>
          <li>Any additional remedies under local consumer protection law.</li>
        </ul>
        <p>
          Nothing in this Refund Policy limits those rights. Our 14-day
          satisfaction guarantee is designed to meet or exceed these statutory
          protections for all users worldwide.
        </p>

        <h2>6. How to Request a Refund</h2>
        <p>
          Send an email to{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>{" "}
          with the following details:
        </p>
        <ul>
          <li>The email address associated with your Elearner account</li>
          {/* <li>
            The Paddle order number or receipt ID (found in your purchase
            confirmation email from Paddle)
          </li> */}
          <li>
            A brief description of why you are requesting a refund (not required
            within the 14-day window, but helpful)
          </li>
        </ul>
        {/* <p>
          Alternatively, you can manage your purchase and request a refund
          directly through Paddle&apos;s buyer portal at{" "}
          <a
            href="https://buyers.paddle.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            buyers.paddle.com
          </a>
          .
        </p> */}
        <p>
          We review all refund requests within <strong>3 business days</strong>{" "}
          of receipt and will notify you by email of our decision.
        </p>

        <h2>7. How Long Refunds Take</h2>
        {/* <p>
          Once approved, refunds are processed by Paddle and typically appear on
          your original payment method within:
        </p>
        <ul>
          <li>
            <strong>3&ndash;5 business days</strong> for credit and debit card
            refunds
          </li>
          <li>
            <strong>5&ndash;10 business days</strong> for PayPal, bank transfer,
            and other payment methods
          </li>
        </ul> */}
        <p>
          The exact timing depends on your bank or payment provider. Refunds are
          always issued to the original payment method used for the purchase.
        </p>

        <h2>8. Subscription Cancellation vs. Refund</h2>
        <p>
          Cancelling your subscription and requesting a refund are two different
          actions:
        </p>
        <ul>
          <li>
            <strong>Cancellation</strong> stops future billing. You retain
            access to paid features until the end of the current billing period,
            after which your account will revert to the free tier or be
            deactivated. Cancellation does not automatically issue a refund for
            the current period.
          </li>
          <li>
            <strong>Refund</strong> returns money already paid to your payment
            method. If you request a refund within the 14-day window, we will
            also cancel your subscription.
          </li>
        </ul>
        <p>
          You can cancel at any time from your account settings or by emailing{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          .
        </p>

        <h2>9. Chargebacks</h2>
        <p>
          If you believe a charge is incorrect, please contact us first at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>{" "}
          before filing a chargeback or dispute with your bank.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Refund Policy from time to time. Material changes
          will be communicated via email or a notice in the Services. The
          &ldquo;Last updated&rdquo; date at the top reflects the most recent
          revision. Changes will not apply retroactively to purchases made
          before the update.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          For refund requests or questions about this policy, contact us at:
        </p>
        <p>
          <strong>Elearner</strong>
          <br />
          Email:{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
        </p>
      </div>
    </>
  );
}
