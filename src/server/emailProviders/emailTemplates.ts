import { siteData } from "@/lib/Constants";
import { WEB_URL } from "@/middleware";

export const verificationEmailTemmplate = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
     <div style="font-family: sans-serif; text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 2rem;"> Thank you for signing up for ${siteData.appName}</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Hi ${name},</p>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Please verify your email address by clicking the button below.</p>
        <a href="${link}" style="background-color: #00bfa6; color: white; padding: 1rem; border-radius: 0.5rem; text-decoration: none; font-size: 1.2rem;">Verify Email</a>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">If you did not create an account, no further action is required.</p>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Thanks you!</p>
</div>
    `;

export const passwordRecoveryEmailTemplate = ({
  link,
  name,
}: {
  link: string;
  name: string;
}) => `
     <div style="font-family: sans-serif; text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 2rem;">Hi ${name}, we received a password reset request</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Reset your passwor clicking the button below.</p>
        <a href="${link}" style="background-color: #00bfa6; color: white; padding: 1rem; border-radius: 0.5rem; text-decoration: none; font-size: 1.2rem;">Reset password</a>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">If you did not request a password change, no further action is required.</p>
</div>
    `;

export const getNotifiedConfirmationEmailTemplate = ({
  unsubscribeId,
  name,
}: {
  unsubscribeId: string;
  name: string;
}) => `
     <div style="font-family: sans-serif; text-align: center;">
        <h1 style="font-size: 2rem; margin-bottom: 2rem;">Hi ${name}, thank you for signing up for the waiting list</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">We'll let you know as soon as the app is ready.</p>
        <p style="font-size: 1.2rem; margin-bottom: 2rem;">If you did not signup for this list, please hit the unsubscribe button.</p>
        <a href="${WEB_URL}/unsubscribe/${unsubscribeId}" style="background-color: #00bfa6; color: white; padding: 1rem; border-radius: 0.5rem; text-decoration: none; font-size: 1.2rem;">Unsubscribe</a>
</div>
    `;
