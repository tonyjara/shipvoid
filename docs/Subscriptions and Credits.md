# Subscriptions and credits

Stripe offers a fantastic set of tools to manage recurring subscriptions, but it does not include the logic to keep track of a users usage. This starter provides the logic to both manage a subscription and send usage from measure products such as apis by implementing a credits system. 

In this page we're going to learn how this starter manages subscriptions and how the credit system works. Keep in mind that to simplify this doc I'm going to scope everything to how I chose to do things with Transcribely.

## Subscriptions

A subscription is a table gets created whenever a user is created, even if the user is free. After a user subscribes to a payed plan, the stripe subscription Id is added to interact with the stripe subscription. 
#### Subscription items

To understand how stripe manages subscription and usage we first need to understand what subscription items are.

Whenever we're creating a subscription in stripe, we are subscribing to a __PRODUCT__ that we've previously created. Inside that product, we have the default __PRICE__ and the regular __PRICE__. The default price is the one we're using to store the value that we're going to bill to a user over time. And the other prices are __"measured products"__.

However, we're not subscribing directly to that __PRODUCT__ instead we're using something called a __SUBSCRIPTION_ITEM__ which is a __PRICE__ that is unique to a users subscription. And that __SUBSCRIPTION_ITEM__ is what we use to report usage to stripe.  

So to recap, a subscription item is a "price" that's unique to a user.

#### Subscription actions

Subscription actions is the table where we store every action that affects a users credit, it's stored in sequence. 

In order to be able to maintain an always up to date value of a users credits and to make it more efficient and reliable,  the __LAST__  transaction will always hold the __current__ amount of credits for the item, the __amount__ of the operation and the __previous amount__ of the item.

__Observation:__ Inside the authRoute.utils file we can find the function that creates the subscription and assigns credits to a user.
### Credits

Unless you're only offering a Pay As You Go type plan, you would want a system to keep track of how much of an api a user has consumed, and to replenish those credits monthly or yearly according to their plans.

Let's talk about how credits are spent using the __transcribeAudioFromScribe__ route inside the __transcription.routes__ file as an example. 

1. We first get a users subscription with their subscription items and the audio file that we're going to use.
2. Then we get the last subscription action of the transcription item and we check if it's a free trial, if it is and it doesn't have enough credits, we throw an error.
3. We post the usage to our DB
4. Post the usage to stripe
5.  Handle the transcription logic.

To test and understand how this system works you can use the usage playground in the admin/usage-playground route.