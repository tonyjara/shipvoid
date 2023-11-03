# Getting started

follow the this instructions.

The file **.env.mjs** acts as a guard to make sure that you're always deploying with the right environment variables.
Rename the **.env.example** to **.env** . Inside this file you can have an overview of the necessary pieces to make the application work. Through this documentation we will cover all the steps necessary to deploy this application.

### Constants

Inside the **Constants.ts** file you can change all the site data to match your branding and preferences. There are a few really useful options there such as a notifyMeWhenReady option for the hero page which will enable users to leave their emails to get notified when the application is ready.

Update your app name in the site.webmanifest.json

### Database

You can use whatever database is supported by prisma. By default this starter uses NEON, it has a free tier and it's easy to get up and going.
Neon requires a DIRECT_URL for migrations, for regular connections you should use their pooled connection. Check their docs for more info.
To create the first migration and transfer the schema to your db run **npx prisma migrate dev --name init** .

### Installation

```bash
pnpm i
```

### Development

To run the app in development mode:

```bash
pnpm dev
```

This script runs a linter in parallel to get a better experience with typescript.

### Creating an admin user

Admin users have access to the coupons, admin panel and the admin settings.

During development all new users are going to default to ADMIN users. You can later edit a users role inside the admin/users page. 

To create an admin user in production you first need to create a regular user. To do so just go through the signup process. After your regular user is created you'll have to manually change the role to admin directly in your database with any DB editor.

I recommend simply running **npx prisma studio** and editing the account from there.
After changing the role, re login to get updated permissions.
### Editing SEO

To manage tags such a the title, head or description look for the 'MetaTagsComponent'. This file should be present inside any page that could be indexed by search engines. Such as the main page and the pricing page.

**For documentation about how to integrate with stripe go to the docs/StripeDocumentation.md file**
