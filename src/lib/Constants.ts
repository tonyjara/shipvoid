export type CloudProviders = "aws" | "azure" | "gcp";
//Social media
export const socialMediaLinks = {
  twitter: "https://twitter.com/nytoraja",
  instagram: "",
  youtube: "https://www.youtube.com/@Nytojara",
};

export const heroContent = {
  title: "Ship",
  highlight: "anything.",
  description:
    "The most comprehensive and feature rich starter for your App, SaaS, Startup, or whatever you're building. Save time and focus on what matters.",
  heroImage: "/assets/hero/pink-mic.jpeg",
};

//Used in footer and meta tags
export const siteData = {
  appName: "Shipvoid",
  blackLogo: "/assets/logo/black-logo.png",
  whiteLogo: "/assets/logo/white-logo.png",
  mailDomain: "shipvoid.com", // For things as email verification ex: confirmation@mailDomain
  contactEmail: "nytojara@gmail.com", // For things as email verification ex: confirmation@mailDomain

  //Metadata
  author: "Tony Jara",
  prodUrl: "https://shipvoid.com",
  ogCoverImage: "/assets/meta/og-cover.jpeg",
  description:
    "The most comprehensive starter for your SaaS, Startup, app. Save time and focus on what matters.",
};

//Avatar placeholders
export const avatars = [
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623638/podcast-solutions/avatars/hqa76voqxhz7iolzzeo9.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/birkhahcepzom9i4u8n1.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/uibbhsvlb8lrjjafeuwl.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/l9wa3gpbw93rbhnyekmy.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/q9rjtdocxlbbnfbe0ahc.jpg",
  "https://res.cloudinary.com/tonyjara/image/upload/v1691623637/podcast-solutions/avatars/lxrk5zc2lgbqccq3ahpc.jpg",
];
export const randomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex] as string;
};

export const pricingPageContent = {
  title: "Pay once, get unlimited updates",
  description:
    "Once you pay you'll receive an email with a link to get added as a collaborator to the repository, and the discord group.",
};

export interface appOptions {
  heroScreenType: //
  | "ready"
    //Will allow signup and login with a free plan (regular behavior)
    | "comingSoon"
    //Will show a coming soon banner,
    //Signup and login will be enabled in development
    //Only login enabled in production
    | "maintenance"
    //Will show a maintenance banner
    //Signup and login will be enabled in development
    //Only admins can login in production
    | "notifyMeWhenReady";
  //Will allow signin up for a mailing list to be notified when launching
  //Signup and login will be enabled in development
  //Login enabled in production
  emailProvider: "NODEMAILER" | "MAILERSEND";
  enableEmailApiInDevelopment: boolean;
  enableTelegramNotifications: boolean;
  cloudStorageProvider: CloudProviders;
  enableGoogleAnalytics: boolean;
  enableServerLogs: boolean;
  deleteLogsAfterDays: number;
  enableWelcomeModal: boolean;
}

//This changes the way the app behaves, keep in mind that if you change this values
//You will need to redeploy the app to see the changes
//App options also changes the way .env.mjs requires environment variables
export const appOptions: appOptions = {
  heroScreenType: "notifyMeWhenReady",
  //Pick what kind of hero screen to show
  emailProvider: "NODEMAILER",
  //Logic to pick the right email provider are in the emailAdapters file
  //Individual logic is found in mailserend.ts and nodemailer.ts
  //Nodemailer uses SMTP, I recommend pairing with AWS SES
  enableEmailApiInDevelopment: true,
  //If disabled the email content will be displayed through the console and not sent
  //Useful after you've tested the email flow and you want to avoid spending email credits
  enableTelegramNotifications: true,
  //Some actions like signing up send notifications to telegram
  cloudStorageProvider: "azure",
  //This is used to determine the cloud provider to use for media storage, like audioFiles and images
  enableGoogleAnalytics: false,
  // If enabled env variables for google analytics in will be required
  // SOME COUNTRIES IN EUROPE REQUIRE YOU TO ASK FOR CONSENT BEFORE TRACKING
  // IF YOU ARE IN ONE OF THOSE COUNTRIES YOU WILL NEED TO DISABLE THIS
  deleteLogsAfterDays: 30,
  // If enabled server logs will be deleted after this amount of days
  // 0 means logs will never be deleted
  enableServerLogs: true,
  // Some actions like stripe webhooks will be logged to the server.
  // You can view the logs by going to the admin page
  enableWelcomeModal: true,
  // If enabled a welcome modal will be shown to new users
};
