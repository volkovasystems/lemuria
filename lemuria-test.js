"use strict";

const Lemuria = require( "./lemuria.js" );

let UserMold = Lemuria( "User" )

	/** Disable database connect temporarily
		bindDatabase(  );

	**/

	.addFactor( "location.point" )

	.addSchema( "location",
	{
		"point": {
			$type: String
		},

		"area": {
			$type: String
		},

		"region": {
			$type: String
		},

		"country": {
			$type: String
		},

		"name": {
			$type: String
		},

		"title": {
			$type: String
		},

		"address": {
			$type: String
		},

		"latitude": {
			$type: String
		},

		"longitude": {
			$type: String
		}

	} );

console.log( UserMold.factor );
