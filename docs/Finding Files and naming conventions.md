# Finding files and naming conventions

In this document I'll discuss and talk about the naming patterns and conventions I used to understand where everything is. 
TLDR: Most file names use this convention: "Action" + "location" + ".type". 


## Pages

This starter uses NextJs' the 'Pages' router, however to separate things the serverSideProps from a pages view logic or simply to avoid searching through a pile of 'index.tsx' files I've implemented a PageContainers folder inside the src directory.
The folder structure inside PageContainers mimics the one inside pages, the only difference being that inside a PageContainer directory you can also find components or utils that are relevant only to that page. For example if a component renders a table, the table components will be in that same directory.
The naming for this files is composed by the route name plus the '.page' word at the and.
Example: Home.page.tsx
The exported functions is the same but camelCased.
Example: HomePage

## Components vs lib

Components generate views, libs don't. For example. forms are found in components, and hooks and utils are found in the lib folder.
They both hold pieces that are relevant in the scope of the whole app. Components or utils that are only specific to a particular page should be co-located inside it's page folder.  

## Forms

All forms with the exception of some short ones are located inside sr/components/Forms .
A form file's name is composed in the following way:
__"create/edit/action"/"table or route".form.tsx__
Example: CreateUser.form.tsx or ClaimCoupons.form.tsx

The form component is the same as the file but without the .form.
Example: CreateUserForm or ClaimCouponsForm

### Validations

Validations are used for forms and routes. They're located inside the src/lib/validations. Their naming is the same as the form they're used in with the exception of the .validate at the end of the name.
Example: CreateUser.validate.ts or CalimCoupons.validate.ts

## Utils

Utils are reusable functions that do one specific thing. For example, format a string in a determined way. I distribute utils in two different ways.

1-  __Global utils:__ They are functions that are relevant throughout the project. Their name is indicative of their purpose and they're stored under src/lib/utils .
2- __File utils:__ They are functions that are only relevant to the page or folder they're in they're located in. Often times are used to clean up code and improve readability. For example, utils used inside the chatGPT route are called chatRouteUtils. Their name is composed by the word that indicates it's location and the 'utils' word.