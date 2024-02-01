# Budibase server project

This project contains all the server specific logic required to run a Budibase app

## App migrations

A migration system has been created in order to modify existing apps when breaking changes are added. These migrations will run on the app startup (both from the client side or the builder side), blocking the access until they are correctly applied.

### Create a new migration

In order to add a new migration:

1. Run `yarn add-app-migration [title]`
2. Write your code on the newly created file
