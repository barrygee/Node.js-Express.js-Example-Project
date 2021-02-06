
const express = require('express')
const app = express()

/*
	- this says - use / call the logger() before calling the each app.get,
	   app.post middleware functions 

	- these are called in the order they are defined

	- the next middleware function in the chain is called by
	   using next()

	- using the code below, if a user visits localhost/users
	- console.log output  = ‘log’
						    ‘Test’
			   			    ‘Users page’

	- this is because logger() middleware is called first, - outputting ‘Log’
	- then, next() is called in logger()
    - this then calls the test() middleware as this is the next middleware function defined in the file and - outputting - ’Test’
    - then, next() is called in Test()
	- this then calls the app.get(‘/users’ …) middleware - outputting - ’Users page’
    - when app.get(‘/users’ …) middleware is complete, the flow returns back to the middleware that last called next() - in this case test()
        - a 'return' statement is required here in order to prevent errors 
*/
app.use(logger)

/*
	- accepts req, res, next properties
	- next() calls the next middleware in the chain
*/
function logger(req, res, next) {
	console.log('log')
	next()
}

app.use(test)

/*
	- accepts req, res, next properties
	- next() calls the next middleware in the chain
*/
function test(req, res, next) {
	console.log('test')
    next()
    console.log('flow returned to test()')
	
	/*
		- this is required to end the flow when the ‘next’
		  middleware in the chain returns here after its complete
		
		- without this, the error ‘cannot set headers after they are sent to the client' would be thrown
	*/
    return
    
    res.send('without the return statement above, this would be called and the error \'Cannot set headers after they are sent to the client\' would be thrown')
}

/*
	- accepts req, res, next properties
	- checks is URL param ‘admin’ is true
*/
function auth(req, res, next) {
	if(req.query.admin === 'true') {
	/*
		to pass a value between middleware functions you can set 
		a value on the req

		- req.admin = true

		- this is then accessible within the app.get(‘/admin’…)
		   middleware function
	*/
	
		req.admin = true
		next()
	} else {
		res.send('No Auth')
	}
}


/*
	routes like this don’t use next() as there is no further
	middleware that needs to be called before the
	response is sent
*/
app.get('/', (req, res) => {
    console.log('Homepage')
	res.send('Homepage')
})

app.get('/users', (req, res) => {
	console.log('Users page')
	res.send('Users page')
})

/*
    - middleware functions can accept a number of middleware functions to run. 
      In this case auth, req, res.

	- when /admin is visited 
		- the logger and test middleware are called, in the order they are defined in the file
		- then auth middleware is called
		- then the code within the app.get(‘/admin….) is called
*/
app.get('/admin', auth, (req, res) => {
	
	/*
		access the req.admin value that was set within the auth()
		middleware function
	*/
	console.log(req.admin)

	res.send('An insecure admin page')
})

app.listen(3000)

console.info('Server started on localhost:3000')