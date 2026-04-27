import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <>
      <style>{`
        .tos-body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          color: #1a1a1a;
          line-height: 1.65;
          background: #fff;
        }
        .tos-body h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 0.5rem;
        }
        .tos-body h2 {
          font-size: 1.35rem;
          margin-top: 2.5rem;
          color: #1a1a1a;
        }
        .tos-body h3 {
          font-size: 1.1rem;
          margin-top: 1.5rem;
          color: #333;
        }
        .tos-body .updated {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }
        .tos-body .toc {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          padding: 1rem 1.5rem;
          border-radius: 6px;
          margin: 2rem 0;
        }
        .tos-body .toc ol { margin: 0.5rem 0 0 1.25rem; padding: 0; }
        .tos-body .toc li { margin: 0.3rem 0; }
        .tos-body ul, .tos-body ol { padding-left: 1.5rem; }
        .tos-body li { margin: 0.35rem 0; }
        .tos-body a { color: #0645ad; }
        .tos-body .callout {
          background: #fff8e1;
          border: 1px solid #f0d67a;
          padding: 0.9rem 1.1rem;
          border-radius: 6px;
          margin: 1rem 0;
        }
        .tos-body .caps {
          text-transform: none;
          background: #f5f5f0;
          border-left: 3px solid #888;
          padding: 0.75rem 1rem;
          margin: 1rem 0;
        }
      `}</style>

      <div className="tos-body">
        <h1>Terms of Service</h1>
        <p className="updated">
          <strong>Last updated:</strong> April 21, 2026
        </p>

        <h2>Agreement to Our Legal Terms</h2>

        <p>
          We are <strong>Elearner</strong> (&ldquo;Company,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), a company
          registered in Saudi Arabia, Riyadh.
        </p>

        <p>
          We operate the website{" "}
          <a href="https://elearner.academy">https://elearner.academy</a> (the
          &ldquo;Site&rdquo;), and the associated products and services that
          refer or link to these legal terms (the &ldquo;Legal Terms&rdquo;)
          (collectively, the &ldquo;Services&rdquo;).
        </p>

        <p>
          <strong>About Elearner:</strong> Elearner is a web-based educational
          productivity application that provides users (&ldquo;Learners,&rdquo;
          &ldquo;you&rdquo;) with an integrated suite of tools to support
          self-directed learning. The Services allow you to:
        </p>
        <ul>
          <li>
            <strong>Organize learning topics</strong> &mdash; create and manage
            structured study topics (&ldquo;Learns&rdquo;) as centralized
            workspaces for a given subject.
          </li>
          <li>
            <strong>Curate resources</strong> &mdash; store and organize
            external learning materials such as URLs and references, with
            hierarchical categorization.
          </li>
          <li>
            <strong>Create notes</strong> &mdash; author and maintain rich-text
            notebooks associated with each Learn using a block-based editor.
          </li>
          <li>
            <strong>Generate flashcards</strong> &mdash; create
            question-and-answer flashcards and review them through a
            spaced-repetition system for long-term retention.
          </li>
          <li>
            <strong>Track practice tasks</strong> &mdash; define and manage
            practice tasks with built-in spaced-repetition scheduling.
          </li>
        </ul>

        <p>
          Elearner is a Software-as-a-Service (SaaS) application accessible via
          web browser. You must create an account (using email/password or a
          supported third-party authentication provider such as Google OAuth) to
          use the Services. Your content &mdash; Learns, resources, notes,
          flashcards, and practice tasks &mdash; is stored on our servers and
          associated with your account. All user content is private to your
          account unless you explicitly choose to export or share it.
        </p>

        <p>
          <strong>Contact:</strong> You can contact us at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
        </p>

        <p>
          These Legal Terms form a legally binding agreement between you
          (whether personally or on behalf of an entity) and Elearner concerning
          your access to and use of the Services. By using the Services, you
          confirm that you have read, understood, and agreed to these Legal
          Terms.{" "}
          <strong>If you do not agree, you must not use the Services.</strong>
        </p>

        <p>
          We may update these Legal Terms from time to time. Material changes
          will be notified to you via email or a notice in the Services at least
          30 days before they take effect, where required by law. By continuing
          to use the Services after the effective date of any change, you accept
          the updated Legal Terms.
        </p>

        <p>
          <strong>Minimum age:</strong> You must be at least 16 years old to use
          the Services. If you are between 16 and 18 (or the age of majority in
          your jurisdiction), you represent that a parent or legal guardian has
          reviewed and agreed to these Legal Terms on your behalf. We do not
          knowingly allow children under 16 to use the Services.
        </p>

        <div className="toc">
          <strong>Table of Contents</strong>
          <ol>
            <li>Our Services</li>
            <li>Intellectual Property Rights</li>
            <li>User Representations</li>
            <li>User Registration</li>
            <li>Purchases and Payment (Paddle as Merchant of Record)</li>
            <li>Subscriptions</li>
            <li>Refunds</li>
            <li>Prohibited Activities</li>
            <li>Your Content</li>
            <li>Feedback and Suggestions</li>
            <li>Services Management</li>
            <li>Privacy Policy</li>
            <li>Term and Termination</li>
            <li>Modifications and Interruptions</li>
            <li>Governing Law and Consumer Rights</li>
            <li>Dispute Resolution</li>
            <li>Disclaimer</li>
            <li>Limitation of Liability</li>
            <li>Indemnification</li>
            <li>User Data</li>
            <li>Electronic Communications</li>
            <li>Miscellaneous</li>
            <li>Contact Us</li>
          </ol>
        </div>

        <h2>1. Our Services</h2>
        <p>
          The Services are not intended for distribution to or use by any person
          in any jurisdiction where such use would be contrary to law. Users who
          access the Services from other locations do so at their own initiative
          and are responsible for compliance with local laws.
        </p>
        <p>
          The Services are not designed for industry-specific regulated use
          cases (e.g., HIPAA-regulated health data, FISMA-regulated federal
          data). If your intended use is subject to such laws, please do not use
          the Services for that purpose.
        </p>

        <h2>2. Intellectual Property Rights</h2>

        <h3>Our content</h3>
        <p>
          We own or license all intellectual property rights in the Services,
          including source code, databases, software, website design, audio,
          video, text, photographs, and graphics (collectively, the
          &ldquo;Content&rdquo;), as well as the Elearner name, trademarks,
          service marks, and logos (the &ldquo;Marks&rdquo;). These are
          protected under applicable copyright, trademark, and other
          intellectual property laws.
        </p>
        <p>
          Subject to your compliance with these Legal Terms, we grant you a
          limited, non-exclusive, non-transferable, revocable license to access
          and use the Services for your personal, non-commercial learning
          purposes.
        </p>
        <p>
          Except as expressly permitted, you may not copy, reproduce, republish,
          distribute, sell, license, or exploit the Services, Content, or Marks
          without our prior written permission. For permission requests, contact{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          .
        </p>

        <h3>Your content</h3>
        <p>
          You retain full ownership of all content you create or upload to the
          Services (&ldquo;User Content&rdquo;), including Learns, notes,
          flashcards, resources, and practice tasks.
        </p>
        <p>
          By using the Services, you grant us a limited, non-exclusive,
          royalty-free license to host, store, process, display, back up, and
          transmit your User Content{" "}
          <strong>
            solely for the purpose of providing and improving the Services to
            you
          </strong>
          . We do not use your User Content for advertising, resale, or training
          third-party AI models. We do not claim ownership over your User
          Content.
        </p>
        <p>
          This license ends when you delete your User Content or close your
          account, except where we are required to retain data for legal,
          security, or backup purposes, as described in our Privacy Policy.
        </p>

        <h2>3. User Representations</h2>
        <p>By using the Services, you represent and warrant that:</p>
        <ul>
          <li>
            The registration information you provide is true, accurate, current,
            and complete, and you will keep it up to date.
          </li>
          <li>
            You have the legal capacity to enter into these Legal Terms and will
            comply with them.
          </li>
          <li>
            You meet the minimum age requirement, or have parental/guardian
            consent where applicable.
          </li>
          <li>
            You will not access the Services through automated means (bots,
            scripts, scrapers) except as expressly permitted.
          </li>
          <li>
            You will not use the Services for any illegal or unauthorized
            purpose.
          </li>
          <li>
            Your use of the Services will not violate any applicable law or
            regulation.
          </li>
        </ul>
        <p>
          If any information you provide is untrue or incomplete, we may suspend
          or terminate your account.
        </p>

        <h2>4. User Registration</h2>
        <p>
          You must register for an account to use most features of the Services.
          You are responsible for keeping your login credentials confidential
          and for all activity under your account. Notify us immediately at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>{" "}
          if you suspect unauthorized use. We may refuse, reclaim, or change a
          username at our discretion if it is inappropriate or violates
          third-party rights.
        </p>

        <h2>5. Purchases and Payment (Paddle as Merchant of Record)</h2>

        <div className="callout">
          <strong>Paddle as Merchant of Record.</strong> Our order process is
          conducted by our online reseller,{" "}
          <strong>Paddle.com Market Limited</strong> (or its affiliate
          Paddle.com Inc. for purchases from the United States)
          (&ldquo;Paddle&rdquo;). Paddle is the Merchant of Record for all our
          orders. Paddle handles the entire checkout process, including payment
          processing, billing, invoicing, fraud protection, and the collection
          and remittance of all applicable taxes (VAT, sales tax, GST) on our
          behalf.
          <br />
          <br />
          When you make a purchase, your payment is made directly to Paddle
          under{" "}
          <a
            href="https://www.paddle.com/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Paddle&apos;s Buyer Terms
          </a>{" "}
          and{" "}
          <a
            href="https://www.paddle.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Paddle&apos;s Privacy Policy
          </a>
          . Available payment methods, accepted currencies, and tax treatment
          depend on your location and are determined by Paddle at checkout.
          <br />
          <br />
          For billing inquiries or to update your payment method, contact us at{" "}
          <a href="mailto:support@elearner.academy">
            support@elearner.academy
          </a>{" "}
          or contact Paddle directly at{" "}
          <a
            href="https://buyers.paddle.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            buyers.paddle.com
          </a>
          .
        </div>

        <p>
          You agree to provide current, complete, and accurate purchase and
          account information and to promptly update this information as needed.
          Prices are displayed at checkout in your local currency where
          supported, and may be updated from time to time in accordance with
          Section 6.
        </p>
        <p>
          We reserve the right to refuse or cancel any order at our discretion,
          including orders that appear fraudulent, duplicate, or in breach of
          these Legal Terms.
        </p>

        <h2>6. Subscriptions</h2>

        <h3>Billing and renewal</h3>
        <p>
          Elearner is offered as a monthly subscription. Your subscription will
          automatically renew at the end of each billing cycle unless you
          cancel.
          <span>
            {" "}
            By subscribing, you authorize Paddle to charge your payment method
            on a recurring monthly basis until you cancel.
          </span>
        </p>

        <h3>Cancellation</h3>
        <p>
          You may cancel your subscription at any time by logging into your
          account or by emailing{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          . Cancellation takes effect at the end of your current paid billing
          cycle, and you will retain access to paid features until that date.
          After cancellation, your account will revert to the free tier (if
          available) or be deactivated.
        </p>

        <h3>Price changes</h3>
        <p>
          We may change subscription prices from time to time. We will give you
          at least 30 days&apos; advance notice of any price increase by email.
          If you do not agree with the new price, you may cancel your
          subscription before the new price takes effect.
        </p>

        <h3>Free trials</h3>
        <p>
          If we offer a free trial, the terms of the trial will be communicated
          at sign-up. Unless you cancel before the trial ends, your subscription
          will automatically begin and your payment method will be charged.
        </p>

        <h2>7. Refunds</h2>
        <p>
          Refunds are governed by our{" "}
          <a href="https://elearner.academy/refund-policy">Refund Policy</a>
          <span>
            , and are processed by Paddle as our Merchant of Record. Please
            review the Refund Policy for eligibility, timelines, and how to
            request a refund.
          </span>
        </p>

        <h2>8. Prohibited Activities</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            Use the Services for any illegal or unauthorized purpose, or in
            violation of any applicable laws.
          </li>
          <li>
            Systematically retrieve data from the Services to build a competing
            product or unauthorized database.
          </li>
          <li>
            Attempt to defraud, mislead, or impersonate us, other users, or
            third parties.
          </li>
          <li>
            Circumvent, disable, or interfere with security features of the
            Services.
          </li>
          <li>Use the Services to harass, abuse, or harm another person.</li>
          <li>Upload or transmit viruses, malware, or other harmful code.</li>
          <li>
            Engage in automated access (scraping, bots, scripts) except where we
            have expressly authorized it (e.g., standard search engine
            crawlers).
          </li>
          <li>
            Decompile, reverse engineer, or disassemble any part of the
            Services, except as permitted by law.
          </li>
          <li>Collect or harvest personal information of other users.</li>
          <li>
            Interfere with or place an undue burden on the Services or the
            networks they rely on.
          </li>
          <li>Create accounts by automated means or under false pretenses.</li>
          <li>
            Reverse engineer the Services for the purpose of building a
            competing product.
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that engage in
          prohibited activities.
        </p>

        <h2>9. Your Content</h2>
        <p>
          You are solely responsible for the content you upload, create, or
          store in the Services (&ldquo;User Content&rdquo;). You represent that
          you have the necessary rights to the materials you upload (for
          example, links, quotations, and references you save) and that your
          User Content does not violate the rights of others or applicable law.
        </p>
        <p>
          We do not monitor User Content as a matter of course. However, we
          reserve the right to remove User Content that we reasonably believe
          violates these Legal Terms or applicable law, and to suspend or
          terminate accounts that do so repeatedly.
        </p>
        <p>
          Your User Content remains your property. Our use of it is limited to
          providing the Services to you, as described in Section 2.
        </p>

        <h2>10. Feedback and Suggestions</h2>
        <p>
          If you send us suggestions, feedback, ideas, or feature requests
          (&ldquo;Feedback&rdquo;), you agree that we may use this Feedback for
          any purpose without obligation or compensation to you. This applies
          only to Feedback you send us voluntarily &mdash; it does not apply to
          your User Content.
        </p>

        <h2>11. Services Management</h2>
        <p>
          We reserve the right (but are not obligated) to monitor the Services
          for violations, take legal action where appropriate, remove content
          that violates these Legal Terms, and manage the Services in a manner
          designed to protect our rights and ensure proper functioning.
        </p>

        <h2>12. Privacy Policy</h2>
        <p>
          We care about data privacy and security. Please review our{" "}
          <a href="https://elearner.academy/privacy-policy">Privacy Policy</a>.
          By using the Services, you agree to the Privacy Policy, which is
          incorporated into these Legal Terms. Our service providers may process
          data in the United States, the European Union, the United Kingdom, or
          other jurisdictions, subject to the safeguards described in the
          Privacy Policy.
        </p>

        <h2>13. Term and Termination</h2>
        <p>
          These Legal Terms remain in effect while you use the Services. We may
          suspend or terminate your account, at our discretion and without
          notice, if you breach these Legal Terms, violate applicable law, or
          engage in conduct that harms the Services, us, or other users.
        </p>
        <p>
          You may close your account at any time by emailing{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          . Upon termination, your access to the Services will end. We will
          handle your data in accordance with our Privacy Policy, including
          retention periods and deletion procedures.
        </p>
        <p>
          If we terminate your account for cause, you may not register a new
          account under a different name without our written permission.
        </p>

        <h2>14. Modifications and Interruptions</h2>
        <p>
          We may modify, suspend, or discontinue the Services (or any part of
          them) at any time. We will provide reasonable notice of material
          changes that adversely affect your use, where feasible. We are not
          liable for any modification, suspension, or discontinuance, except
          where required by applicable consumer law.
        </p>
        <p>
          The Services may experience downtime, maintenance windows, or errors
          from time to time. We do not guarantee uninterrupted availability and
          are not liable for temporary unavailability, except where required by
          applicable law.
        </p>

        <h2>15. Governing Law and Consumer Rights</h2>
        <p>
          These Legal Terms are governed by the laws of Saudi Arabia, without
          regard to its conflict-of-law rules.
        </p>
        <p>
          <strong>Consumer rights:</strong> If you are a consumer residing in
          the European Union, the United Kingdom, or another jurisdiction with
          mandatory consumer protection laws, you retain all rights granted to
          you under those local laws, including the right to bring claims in the
          courts of your country of residence. Nothing in these Legal Terms
          limits those statutory rights.
        </p>

        <h2>16. Dispute Resolution</h2>
        <p>
          Before initiating formal legal proceedings, you agree to contact us at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>{" "}
          to attempt to resolve the dispute informally. If we cannot resolve the
          dispute within 60 days, either party may pursue formal remedies
          subject to Section 14.
        </p>

        <h2>17. Disclaimer</h2>
        <div className="caps">
          The Services are provided on an &ldquo;as-is&rdquo; and
          &ldquo;as-available&rdquo; basis. To the fullest extent permitted by
          law, we disclaim all warranties, express or implied, including
          warranties of merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the Services will be
          uninterrupted, error-free, secure, or that defects will be corrected.
          We make no warranty regarding the accuracy or completeness of Content,
          or regarding any loss or damage of any kind resulting from the use of
          the Services. Nothing in this section excludes or limits any warranty
          that cannot be excluded under applicable law, including non-waivable
          consumer protection rights.
        </div>

        <h2>18. Limitation of Liability</h2>
        <div className="caps">
          To the fullest extent permitted by law, in no event will Elearner or
          its directors, employees, or agents be liable for any indirect,
          incidental, consequential, special, exemplary, or punitive damages,
          including lost profits, lost revenue, or loss of data, arising from or
          relating to your use of the Services. Our total aggregate liability to
          you for any claim arising from or relating to these Legal Terms or the
          Services will not exceed the amount you paid us in the six (6) months
          preceding the event giving rise to the claim. Nothing in this section
          limits liability that cannot be limited under applicable law,
          including consumer protection law or liability for gross negligence,
          willful misconduct, or death/personal injury caused by negligence.
        </div>

        <h2>19. Indemnification</h2>
        <p>
          To the extent permitted by law, you agree to indemnify, defend, and
          hold harmless Elearner and its officers, agents, partners, and
          employees from any loss, damage, liability, claim, or demand
          (including reasonable legal fees) arising from: (a) your User Content;
          (b) your use of the Services; (c) your breach of these Legal Terms;
          (d) your violation of third-party rights; or (e) your violation of
          applicable law. We will use reasonable efforts to notify you of any
          such claim. This obligation does not apply to the extent a claim
          arises from our own breach of these Legal Terms or our negligence.
        </p>

        <h2>20. User Data</h2>
        <p>
          We maintain data that you transmit to the Services to operate and
          improve them, and we perform routine backups. However, you are
          responsible for maintaining your own copies of User Content that is
          important to you. To the extent permitted by law, we are not liable
          for loss or corruption of your data, except where caused by our
          negligence or where liability cannot be excluded under applicable law.
        </p>

        <h2>21. Electronic Communications</h2>
        <p>
          By using the Services, sending us emails, and completing online forms,
          you consent to receive electronic communications from us and to
          conduct transactions electronically. You agree that electronic
          notices, agreements, and records satisfy any legal requirement that
          such communications be in writing, to the extent permitted by
          applicable law.
        </p>

        <h2>22. Miscellaneous</h2>
        <p>
          These Legal Terms and any policies referenced herein (including our
          Privacy Policy and Refund Policy) constitute the entire agreement
          between you and us regarding the Services. Our failure to enforce any
          right or provision is not a waiver of that right. If any provision is
          held unlawful, void, or unenforceable, the remaining provisions will
          continue in effect. We may assign our rights and obligations at any
          time. No joint venture, partnership, employment, or agency
          relationship is created by these Legal Terms.
        </p>

        <h2>23. Contact Us</h2>
        <p>
          For questions, complaints, or support regarding the Services, please
          contact us at:
        </p>
        <p>
          <strong>Elearner</strong>
          <br />
          Email:{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          <br />
        </p>
      </div>
    </>
  );
}
