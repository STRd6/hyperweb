Ideas
=====

Bootstrapping
-------------

For the editor to be self hosting we need some tiny kernel that can start up
and process json objects.

One possibility is to have a kernel that is essentially `eval` which then
bootstraps the system by evaluating the script field of objects of type `exec`.

The kernel can also have one method to add additional type handlers. That may be
enough to get everything running.

Types
-----

We'll want to be able to register templates for various card types. Templates
should be jade or similar.

When a card with a type that matches a template is created it will render that
template into the DOM.

Data-Binding
------------

Having bi-directional live data binding will be really nice. Like binding a form
with R,G,B fields to the background color of an object, or binding user input
to an event stream.

Publishing
----------

Decks should bundle the editor and runtime when publishing so that anyone can
modify, remix, and republish.

Additional concerns
-------------------

How do dependencies and requirements work?

How do we manage versioning the bundled editor and runtime?
