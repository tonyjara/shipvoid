# Authentication and Authorization

This starter ships by default with 2 providers: __Credentials and Google__, this means that a user can pick either way to create an account. However there are a couple of details to have into consideration.

## Prisma adapter

In order to abstract the harder parts of managing an Oauth provider I've used the prisma adapter. This requires some specific fields to be present for it to function. If you head over to the schema.prisma file You'll find comments to show you what those required fields are. Anything below can be safely changed or added.

## Account linking

In order to keep things simple, if a user signs in with user and password, it can later also login with google. On the other hand if a user logs in first with google it no longer has the option to signup with credentials. This is because the logic for linking these two is abstracted and I don't see any real value in supporting this option.

## Escape hatches and utils

If you ho to the auth.ts file you'll find the __customPrismaAdapter__ function, with this escape hatch we can batch other actions like sending a welcome email, creating a subscription or even validating data coming from the request such as cookies.

During development you can delete an account through the menu options inside the avatar icon.