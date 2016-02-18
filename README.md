# Resource Manager

A simple utility library that will help manage async resources, caching them and handling invalidation of 
cached versions of that resources.

The motivation for this functionality is that in many flux flows that I worked on I had quite a few places
where some stores requested a different store to have the data available (waitFor, promise based action etc).

In order to prevent double requests to the servers, I decided to build this library to the concern of 
requesting multiple times is abastracted away from stores. 

Another main requirement was to have a way of invalidating a cache, and somehow have the stores be able 
to react to those invalidation somehow (so basically, trigger another action when cache was invalidated).

## Example of usage
	
	//todo, not added yet to npm
	import asyncR from 'resource-manager'

	function fetchMeSomeCandy () {
		return myAjaxLibCall('/path/to/static/url')
	}

	var resource = asyncR(fetchMeSomeCandy)

	//... somewhere in the flow
	// fetchMeSomeCandy is called
	resource.get()
		.then( (response) => {
			//do stuff with the ajax response
		})

	//... somewhere else in the flow
	// fetchMeSomeCandy is not called
	resource.get()
		.then( (response) => {
			//do stuff with the ajax response
		})


	resource.clear()
	// fetchMeSomeCandy is called again
	resource.get()