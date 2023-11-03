# Stripe documentation

## Setting up Stripe

__Pre requisites:__
- Have a stripe account. You don't need production access yet. Just make sure you're able to access the developer page. 
- Install stripe globally

First make sure you have all 3 of the necessary environment variables.
#### 1- Secret key

Go inside the developers page, then api keys and copy your secret key to your .env file.

#### 2- Webhook secret

Inside the developers page, go to the webhooks section and follow the instructions after pressing the 'test in a local environment button'.
Add the webhook secret you get from step 2 to your .env file.

After you're all set run the following command to simulate webhooks

```bash
pnpm stripe:listen
```

[Learn more about stripe webhooks.](https://stripe.com/docs/webhooks)

#### 3- Customer portal

The customer portal is an amazing way to give your customers access and control of their subscription. It's free and it saves us from handling things like cancelling their subscription. To get a link to access the customer portal type customer portal in stripe's search bar. Activate test link. Then copy the link to the .env file.

## Creating products and prices

__Before we start__: inside the schema.prisma search for the __'planType'__ enum and edit that enum to match your subscription business model. This enum is used to assign __credits__ to each type of subscriptions. It's stored as metadata inside each stripe product.
For examples on how this works, look at the __creditsPerPlan__ function inside the __StripeUsageUtils__ file.

The __'stripePriceTag'__ is also something that you would want to update to match your business model. This tags are related to the subscription items, and it's how we make sure we match the right products whenever we're reporting usage to stripe.
For an example you can check the __saveChatUsageToDb__ file inside the __CreditsUsageUtils__ file.

### Creating Stripe products

__If you already have products:__ or you rather use the stripe product builder, you can use the "introspect" button inside the stripe/products page inside the admin pages.

Login with a user with an admin role. Navigate to the admin/stripe/products page. Press the create button and fill in the form. This will create a product with a default price. The default price is going to be the recurring monthly cost you charge your customers.

After you've created your product you could keep adding more prices to that product. For example, if you see the pricing page at Transcrible.io, you can see that we offer a PayAsYouGo tier. All of the offerings there are measured products I added as "prices" inside a product.

There's no need to create a product for a free plan, since the free plan is not related to Stripe in any way.

**Observations:** Stripe has an amazing documentation, please make sure to check it out. I also encourage you to test and try your products as much as you can before going to production. Altering things like prices are very troublesome with a production app.

### Creating stripe prices

To create stripe prices first create a product from the stripe/products page. Once you create a stripe product you'll see the option to add a price. 
Using Transcribely as an example, one of the products that it offers is audio transcription. This is charged by minute, so inside our Product, I've added "Audio Transcription Per minute" as a price.
Whenever you're adding prices this will be displayed in the product pricing card accordingly. This way your pricing card is always up to date.

Whenever we're talking about money in stripe, we need to be aware that stripe treats every currencies smallest amount as a unit. This means in the case of the US dollar, that one unit is 1 cent, and 100 units will be one dollar. 

__However__, since this starter only uses dollars, to keep things simple whenever we're dealing with highly fractional prices, which is usually the case when using external api's, I've decided to handle the conversion so that whenever we're creating prices we can fill in the prices normally.

__Please consider the previous information if you're planning on adding your own logic.__


