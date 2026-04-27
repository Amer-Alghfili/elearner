import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{`
        .pp-body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          color: #1a1a1a;
          line-height: 1.65;
          background: #fff;
        }
        .pp-body h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 0.5rem;
        }
        .pp-body h2 {
          font-size: 1.35rem;
          margin-top: 2.5rem;
          color: #1a1a1a;
        }
        .pp-body h3 {
          font-size: 1.1rem;
          margin-top: 1.5rem;
          color: #333;
        }
        .pp-body .updated {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }
        .pp-body .short {
          background: #f5f5f0;
          border-left: 3px solid #888;
          padding: 0.75rem 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #444;
        }
        .pp-body .toc {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          padding: 1rem 1.5rem;
          border-radius: 6px;
          margin: 2rem 0;
        }
        .pp-body .toc ol { margin: 0.5rem 0 0 1.25rem; padding: 0; }
        .pp-body .toc li { margin: 0.3rem 0; }
        .pp-body ul, .pp-body ol { padding-left: 1.5rem; }
        .pp-body li { margin: 0.35rem 0; }
        .pp-body table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          font-size: 0.95rem;
        }
        .pp-body th, .pp-body td {
          border: 1px solid #ccc;
          padding: 0.6rem 0.8rem;
          text-align: left;
          vertical-align: top;
        }
        .pp-body th {
          background: #f0f0ea;
          font-weight: 600;
        }
        .pp-body td.yes { color: #0a6b0a; font-weight: 600; }
        .pp-body td.no { color: #888; }
        .pp-body a { color: #0645ad; }
        .pp-body .callout {
          background: #fff8e1;
          border: 1px solid #f0d67a;
          padding: 0.9rem 1.1rem;
          border-radius: 6px;
          margin: 1rem 0;
        }
        .pp-body code {
          background: #f4f4f4;
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 0.9em;
        }
      `}</style>

      <div className="pp-body">
        <h1>Privacy Policy</h1>
        <p className="updated">
          <strong>Last updated:</strong> April 21, 2026
        </p>

        <p>
          This Privacy Notice for <strong>Elearner</strong> (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;), describes how and why we
          access, collect, store, use, and/or share (&ldquo;process&rdquo;) your
          personal information when you use our services
          (&ldquo;Services&rdquo;), including when you:
        </p>
        <ul>
          <li>
            Visit our website at{" "}
            <a href="https://elearner.academy">https://elearner.academy</a> or
            any website of ours that links to this Privacy Notice
          </li>
          <li>
            Create an account and use our note-taking, retention, and
            knowledge-organization tools
          </li>
          <li>
            Subscribe to our Services or interact with our billing processes
          </li>
          <li>Engage with us through support, marketing, or events</li>
        </ul>

        <p>
          <strong>Questions or concerns?</strong> If you do not agree with our
          practices, please do not use our Services. If you have questions,
          contact us at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          .
        </p>

        <h2>Summary of Key Points</h2>
        <ul>
          <li>
            <strong>What we process:</strong> Account data (email, name,
            username, password), usage and device data
            <span>
              {" "}
              and payment data processed via our Merchant of Record, Paddle.
            </span>
          </li>
          <li>
            <strong>Sensitive data:</strong> We do not process sensitive
            personal information.
          </li>
          <li>
            <strong>Third parties:</strong> We share data with{" "}
            <span>Paddle (payments &amp; tax),</span>
            Google Analytics (usage analytics), our hosting and email providers,
            and as required by law. See Section 4.
          </li>
          <li>
            <strong>Legal bases (EU/UK):</strong> Consent, Performance of a
            Contract, Legitimate Interests, Legal Obligations, and Vital
            Interests.
          </li>
          <li>
            <strong>International transfers:</strong> Data may be processed
            outside your country, with appropriate safeguards (see Section 4).
          </li>
          <li>
            <strong>Your rights:</strong> You can access, correct, delete, or
            export your data, and withdraw consent at any time.
          </li>
        </ul>

        <div className="toc">
          <strong>Table of Contents</strong>
          <ol>
            <li>What Information Do We Collect?</li>
            <li>How Do We Process Your Information?</li>
            <li>What Legal Bases Do We Rely On?</li>
            <li>When and With Whom Do We Share Your Information?</li>
            <li>International Data Transfers</li>
            <li>Do We Use Cookies and Tracking Technologies?</li>
            <li>How Long Do We Keep Your Information?</li>
            <li>How Do We Keep Your Information Safe?</li>
            <li>What Are Your Privacy Rights?</li>
            <li>Controls for Do-Not-Track Features</li>
            <li>Rights for U.S. Residents</li>
            <li>How to Contact Us</li>
            <li>How to Review, Update, or Delete Your Data</li>
          </ol>
        </div>

        <h2>1. What Information Do We Collect?</h2>

        <h3>Personal information you provide</h3>

        <p>Depending on how you use Elearner, we may collect:</p>
        <ul>
          <li>
            <strong>Account data:</strong> email address, name, username,
            password (stored hashed), and contact preferences.
          </li>
          <li>
            <strong>User content:</strong> notes, highlights, tags, and other
            content you create within the Services. This content is private to
            your account unless you explicitly share it.
          </li>
          <li>
            <strong>Support data:</strong> information you send us when
            contacting support.
          </li>
        </ul>

        <h3>Payment Data &mdash; Processed by Paddle (Merchant of Record)</h3>
        <div className="callout">
          <strong>
            Paddle.com Market Limited acts as our Merchant of Record for all
            purchases.
          </strong>{" "}
          Paddle processes your payments, handles billing, manages tax
          compliance (VAT, sales tax, GST), and provides customer support for
          billing inquiries on our behalf. When you make a purchase, your
          payment information (card number, security code, billing address) is
          provided directly to Paddle and is subject to{" "}
          <a
            href="https://www.paddle.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Paddle&apos;s Privacy Policy
          </a>
          . We receive only limited billing metadata (such as the last four
          digits of your card, your country, and your subscription status)
          &mdash; we never see or store your full payment details.
        </div>

        <h3>Information automatically collected</h3>
        <ul>
          <li>
            <strong>Log and usage data:</strong> IP address, browser type, pages
            viewed, features used, timestamps, and crash reports.
          </li>
          <li>
            <strong>Device data:</strong> device type, operating system,
            browser, and application identifiers.
          </li>
          <li>
            <strong>Approximate location:</strong> derived from IP address
            (country/region level) for security, fraud prevention, and tax
            localization. We do not collect GPS or precise location.
          </li>
        </ul>

        <h2>2. How Do We Process Your Information?</h2>

        <p>We process personal information to:</p>
        <ul>
          <li>Create and manage your account and authenticate logins.</li>
          <li>
            Deliver the Services you subscribe to (note-taking, retention,
            organization features).
          </li>
          <li>Process payments, subscriptions, and refunds through Paddle.</li>
          <li>Provide customer support and respond to inquiries.</li>
          <li>
            Send transactional emails (receipts, password resets, service
            updates).
          </li>
          <li>
            Send marketing communications, where you have consented &mdash; you
            can unsubscribe at any time.
          </li>
          <li>
            Improve, personalize, and develop the Services based on usage
            patterns.
          </li>
          <li>
            Protect the Services against fraud, abuse, and security threats.
          </li>
          <li>
            Comply with legal obligations (tax, accounting, law enforcement
            requests).
          </li>
          <li>
            Protect the vital interests of you or another person in an
            emergency.
          </li>
        </ul>

        <h2>3. What Legal Bases Do We Rely On? (EU/UK)</h2>

        <p>
          If you are located in the EU, UK, or EEA, we rely on the following
          legal bases:
        </p>
        <ul>
          <li>
            <strong>Performance of a Contract:</strong> to provide the Services
            you signed up for
            <span>, process subscriptions, and </span> deliver support.
          </li>
          <li>
            <strong>Legitimate Interests:</strong> to secure our Services,
            prevent fraud, analyze usage, improve the product, and communicate
            with existing customers about relevant updates. We balance these
            interests against your rights.
          </li>
          <li>
            <strong>Consent:</strong> for marketing emails, non-essential
            cookies, and optional features. You can withdraw consent at any
            time.
          </li>
          <li>
            <strong>Legal Obligations:</strong> to comply with tax law,
            financial regulations, and lawful requests from authorities.
          </li>
          <li>
            <strong>Vital Interests:</strong> in rare cases where processing is
            necessary to protect someone&apos;s life or physical safety.
          </li>
        </ul>

        <h2>4. When and With Whom Do We Share Your Information?</h2>

        <p>
          We share personal information with the following categories of third
          parties:
        </p>
        <ul>
          <li>
            <strong>Paddle (Paddle.com Market Limited)</strong> &mdash; our
            Merchant of Record. Processes payments, subscriptions, refunds, and
            tax remittance globally. See{" "}
            <a
              href="https://www.paddle.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Paddle&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Cloud hosting provider</strong> &mdash; stores application
            data and user content on secure, encrypted infrastructure.
          </li>
          <li>
            <strong>Google Analytics (Google LLC)</strong> &mdash; aggregated
            usage analytics. See{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>
            . You can opt out at{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              tools.google.com/dlpage/gaoptout
            </a>
            .
          </li>
          <li>
            <strong>Transactional email provider</strong> &mdash; sends
            account-related emails (receipts, password resets, service
            notifications).
          </li>
          <li>
            <strong>Customer support tools</strong> &mdash; helps us respond to
            your inquiries.
          </li>
          <li>
            <strong>Legal and regulatory authorities</strong> &mdash; where
            required by law, court order, or to protect our rights.
          </li>
          <li>
            <strong>Business transfers</strong> &mdash; in the event of a
            merger, acquisition, or sale of assets, your information may be
            transferred to the acquiring entity, subject to this Privacy Notice.
          </li>
        </ul>

        <p>
          We do not sell your personal information. We do not share it for
          third-party advertising.
        </p>

        <h2>5. International Data Transfers</h2>

        <p>
          Elearner is operated from Saudi Arabia. Our service providers
          (including <span>Paddle, </span>
          Google, and hosting partners) may process data in the United States,
          the European Union, the United Kingdom, and other jurisdictions.
        </p>

        <p>
          Where personal data is transferred outside the EEA or UK, we rely on
          legally recognized transfer mechanisms, including:
        </p>
        <ul>
          <li>
            <strong>Standard Contractual Clauses (SCCs)</strong> approved by the
            European Commission and the UK ICO.
          </li>
          <li>
            <strong>Adequacy decisions</strong> where the destination country
            has been recognized as providing adequate protection.
          </li>
          <li>
            <strong>Supplementary technical and organizational measures</strong>{" "}
            such as encryption in transit and at rest.
          </li>
        </ul>

        <h2>6. Do We Use Cookies and Tracking Technologies?</h2>

        <p>
          We use the following categories of cookies and similar technologies:
        </p>
        <ul>
          <li>
            <strong>Strictly necessary cookies:</strong> required to log in,
            maintain your session, and keep the Services secure.
          </li>
          <li>
            <strong>Preference cookies:</strong> remember your settings (e.g.,
            theme, language).
          </li>
          <li>
            <strong>Analytics cookies:</strong> via Google Analytics, to
            understand how users interact with the Services. These are set only
            where permitted by your consent preferences.
          </li>
        </ul>
        <p>
          We do not use advertising cookies and do not engage in targeted
          advertising. You can manage cookies through your browser settings or
          our cookie banner where shown.
        </p>

        <h2>7. How Long Do We Keep Your Information?</h2>
        <ul>
          <li>
            <strong>Account and profile data:</strong> while your account is
            active, and up to 30 days after account deletion (backups may take
            up to 90 days to fully purge).
          </li>
          <li>
            <strong>User content (notes, highlights):</strong> deleted within 30
            days of account closure, unless you export or retain it.
          </li>
          <li>
            <strong>Billing and transaction records:</strong> retained by us
            and/or Paddle for up to 7 years to comply with tax and accounting
            laws.
          </li>
          <li>
            <strong>Support communications:</strong> retained for up to 2 years
            for quality and dispute resolution.
          </li>
          <li>
            <strong>Server logs:</strong> retained for up to 90 days for
            security and debugging.
          </li>
        </ul>

        <h2>8. How Do We Keep Your Information Safe?</h2>
        <p>
          We implement technical and organizational measures including
          encryption in transit (TLS) and at rest, access controls, password
          hashing, regular backups, and monitoring. However, no method of
          transmission or storage is fully secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>9. What Are Your Privacy Rights?</h2>

        <p>Under the GDPR, UK GDPR, and similar laws, you have the right to:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify inaccurate or incomplete data</li>
          <li>Request deletion (&ldquo;right to be forgotten&rdquo;)</li>
          <li>Restrict or object to processing</li>
          <li>
            Data portability (receive your data in a machine-readable format)
          </li>
          <li>Withdraw consent at any time</li>
          <li>
            Not be subject to solely automated decision-making with legal or
            similarly significant effects. We do not currently carry out such
            automated decision-making.
          </li>
          <li>
            Lodge a complaint with your local data protection authority (in the
            EEA) or the UK Information Commissioner&apos;s Office
          </li>
        </ul>

        <p>
          To exercise any of these rights, email us at{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          . We will respond within 30 days.
        </p>

        <h2>10. Controls for Do-Not-Track Features</h2>
        <p>
          Most browsers support a &ldquo;Do-Not-Track&rdquo; (DNT) signal. As
          there is no finalized industry standard for DNT, we do not currently
          respond to DNT signals.
        </p>

        <h2>11. Rights for U.S. Residents</h2>

        <p>
          If you reside in California, Colorado, Connecticut, Delaware, Florida,
          Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New
          Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah,
          or Virginia, you may have rights to access, correct, delete, and
          obtain a copy of your personal data, and to opt out of certain
          processing.
        </p>

        <h3>Categories of Personal Information We Collect</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Examples</th>
              <th>Collected</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A. Identifiers</td>
              <td>Name, email, username, IP address, account ID</td>
              <td className="yes">YES</td>
            </tr>
            <tr>
              <td>B. Customer Records (California Civil Code §1798.80)</td>
              <td>Name, contact info, billing info</td>
              <td className="yes">YES</td>
            </tr>
            <tr>
              <td>C. Protected classifications</td>
              <td>Age, gender, race, etc.</td>
              <td className="no">NO</td>
            </tr>
            <tr>
              <td>D. Commercial information</td>
              <td>Subscription history, transaction records (via Paddle)</td>
              <td className="yes">YES</td>
            </tr>
            <tr>
              <td>E. Biometric information</td>
              <td>Fingerprints, voiceprints</td>
              <td className="no">NO</td>
            </tr>
            <tr>
              <td>F. Internet/network activity</td>
              <td>
                Usage logs, feature interactions, browsing within the Services
              </td>
              <td className="yes">YES</td>
            </tr>
            <tr>
              <td>G. Geolocation data</td>
              <td>Approximate location (from IP)</td>
              <td className="yes">YES</td>
            </tr>
            <tr>
              <td>H. Audio/visual</td>
              <td>Recordings</td>
              <td className="no">NO</td>
            </tr>
            <tr>
              <td>I. Professional/employment info</td>
              <td>Job title, employer</td>
              <td className="no">NO</td>
            </tr>
            <tr>
              <td>J. Education information</td>
              <td>Student records</td>
              <td className="no">NO</td>
            </tr>
            <tr>
              <td>K. Inferences</td>
              <td>Profiles based on preferences</td>
              <td className="no">NO</td>
            </tr>
            <tr>
              <td>L. Sensitive personal information</td>
              <td>Health, religion, precise location, etc.</td>
              <td className="no">NO</td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Sale or sharing of personal information:</strong> We do not
          sell or share personal information as defined by U.S. state privacy
          laws, and have not done so in the preceding 12 months.
        </p>

        <h3>How to Exercise Your Rights</h3>
        <p>
          Email{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          . We will verify your identity before processing the request. You may
          designate an authorized agent with written permission.
        </p>

        <h3>Appeals</h3>
        <p>
          If we decline your request, you may appeal by emailing{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          . If your appeal is denied, you may file a complaint with your state
          attorney general.
        </p>

        <h2>12. How to Contact Us</h2>
        <p>
          For questions about this notice or our privacy practices, contact us
          at:
        </p>
        <p>
          <strong>Elearner</strong>
          <br />
          Email:{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          <br />
        </p>

        <h2>13. How to Review, Update, or Delete Your Data</h2>
        <p>
          You may review, update, or delete your information from within your
          account settings, or by emailing{" "}
          <a href="mailto:support@elearner.academy">support@elearner.academy</a>
          . We will respond within the timeframe required by applicable law.
        </p>
      </div>
    </>
  );
}
