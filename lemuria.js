"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "lemuria",
			"path": "lemuria/lemuria.js",
			"file": "lemuria.js",
			"module": "lemuria",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/lemuria.git",
			"test": "lemuria-test.js",
			"global": true,
			"class": "true"
		}
	@end-module-configuration

	@module-documentation:
	@end-module-documentation

	@example:
		var UserMold = Lemuria( "User" )
			//.bindDatabase( database )
			//.connect( databaseURL )
			.addSchema( "name", {
				"type": String
			} )
			...
			.buildSchema( )
			.addPlugin( plugin, initialize )
			.attachHook( hook )
			.buildModel( )
			.deploy( );
	@end-example

	@include:
		{
			"called": "called",
			"diatom": "diatom",
			"harden": "harden",
			"heredito": "heredito",
			"llamalize": "llamalize",
			"mongodb": "mongodb",
			"mongoose": "mongoose",
			"olivant": "olivant",
			"shardize": "shardize",
			"U200b": "u200b"
		}
	@end-include
*/

var diatom = require( "diatom" );
var harden = require( "harden" );
var heredito = require( "heredito" );
var llamalize = require( "llamalize" );
var mongodb = require( "mongodb" );
var mongoose = require( "mongoose" );
var olivant = require( "olivant" );
var shardize = require( "shardize" );
var U200b = require( "u200b" );

/*;
	@notice:
		This is done because of the deprecation warnings of mongoosejs.
	@end-notice
*/
mongoose.Promise = global.Promise = global.Promise || require( "bluebird" );

var EventEmitter = require( "events" ).EventEmitter;

harden( "ACTIVE", "active" );
harden( "DISABLED", "disabled" );
harden( "REMOVED", "removed" );

var Lemuria = diatom( "Lemuria" );

heredito( Lemuria, EventEmitter );

harden( "database", Lemuria.database || { }, Lemuria );
harden( "client", Lemuria.client || { }, Lemuria );

Lemuria.prototype.initialize = function initialize( model ){
	this.name = shardize( model, true );
	var name = this.name;

	this.title = llamalize( model, true );

	this._schema = {
		//: Fixed identifiable reference
		"reference": {
			"$type": String,
			"trim": true,
			"required": true,
			"unique": true,
			"index": true
		},

		//: Changing identifiable reference
		"hash": {
			"$type": String,
			"trim": true,
			"required": true,
			"unique": true
		},

		//: Short fixed identifiable reference
		"stamp": {
			"$type": String,
			"trim": true,
			"required": true,
			"unique": true,
			"index": true
		},

		//: name-stamp reference
		"code": {
			"$type": String,
			"trim": true,
			"unique": true
		},

		//: 6 character unique short reference
		"short": {
			"$type": String,
			"trim": true,
			"unique": true
		},

		//: This is the public path based on the code.
		"path": {
			"$type": String,
			"trim": true,
			"unique": true,
			"index": true
		},

		//: The model type of the document.
		"model": {
			"$type": String,
			"trim": true,
			"default": name
		},

		//: Searchable name
		"name": {
			"$type": String,
			"trim": true,
			"index": true
		},

		//: Displayable name
		"title": {
			"$type": String,
			"trim": true,
			"index": true
		},

		//: Array of descriptive phrases
		"description": {
			"$type": [ String ],
			"trim": true,
			"default": "",
			"get": function getDescription( description ){
				return U200b( description ).join( "," );
			}
		},

		//: Status of the document.
		"status": {
			"$type": String,
			"trim": true,
			"required": true,
			"enum": [
				ACTIVE,
				DISABLED,
				REMOVED
			],
			"default": ACTIVE
		},

		//: Searchable tag references
		"tag": {
			"$type": [ String ],
			"trim": true,
			"default": name,
			"index": true
		}
	};

	this.on( "error",
		( function onError( ){
			Bug( this.name, arguments, this );
		} ).bind( this ) );

	return this;
};

/*;
	@method-documentation:
		Add schema like a normal mongoose schema.
	@end-method-documentation
*/
Lemuria.prototype.addSchema = function addSchema( name, schema ){
	this._schema[ name ] = schema;

	return this;
};

/*;
	@method-documentation:
		This will create a new instance of mongoose.Schema.
	@end-method-documentation
*/
Lemuria.prototype.buildSchema = function buildSchema( option ){
	option = option || { };

	this.schema = new mongoose.Schema( this._schema, {
		"collection": option.name || this.name,
		"autoIndex": false,
		"typeKey": "$type"
	} );

	this.schema.methods.describe = function describe( description, callback ){
		callback = called( callback );

		if( U200b( description ).separate( ).length > 1 ){
			callback( );

			return this;
		}

		if( typeof description == "string" ){
			this.description.addToSet( description );
		}

		callback( );

		return this;
	};

	this.schema.methods.tagged = function tagged( tag, callback ){
		callback = called( callback );

		if( typeof tag == "string" ){
			this.tag.addToSet( tag );
		}

		callback( );

		return this;
	};

	this.schema.pre( "save",
		function onSave( next ){
			if( !this.path &&
				this.model &&
				this.code )
			{
				this.path = "/@model/@code"
					.replace( "@model", this.model )
					.replace( "@code", this.code );
			}

			next( );
		} );

	var self = this;
	this.schema.pre( "save",
		function onSave( next ){
			self.emit( "save", this, self );

			next( );
		} );

	this.schema.pre( "remove",
		( function onRemove( next ){
			self.emit( "remove", this, self );

			next( );
		} ).bind( this ) );

	this.schema.post( "save",
		function onSaved( data ){
			self.emit( "saved", data, self );
		} );

	this.schema.post( "remove",
		function onRemoved( data ){
			self.emit( "removed", data, self );
		} );

	this.schema.on( "error",
		( function onError( ){
			Bug( this.name, arguments, this );
		} ).bind( this ) );

	return this;
};

/*;
	@method-documentation:
		Attach a plugin.

		The initialize method is used to do some initialization or configuration to the plugin
			before attaching it to the schema. If the initialize method returns a non falsy
			value it will be passed to the plugin method of the schema.
	@end-method-documentation
*/
Lemuria.prototype.addPlugin = function addPlugin( plugin, initialize ){
	if( !( this.schema instanceof mongoose.Schema ) ){
		throw new Error( "schema not instantiated" );
	}

	var result = undefined;
	if( typeof initialize == "function" ){
		result = initialize.call( this, plugin );
	}

	this.schema.plugin( result || plugin );

	return this;
};

Lemuria.prototype.attachHook = function attachHook( hook ){
	if( typeof hook != "function" ){
		throw new Error( "invalid hook function" );
	}

	hook( this.schema );

	return this;
};

/*;
	@method-documentation:
		You can insert this anytime to create custom procedure flow.
	@end-method-documentation
*/
Lemuria.prototype.procedure = function procedure( method ){
	if( typeof method == "function" ){
		try{
			method.call( this );

		}catch( error ){
			Fatal( this.name, error, this );
		}
	}

	return this;
};

/*;
	@method-documentation:
		Database URL format should be protocol://host:port/database
		The client connection from mongodb will be used for advance purposes.

	@end-method-documentation
*/
Lemuria.prototype.connect = function connect( databaseURL ){
	var databaseName = databaseURL.match( /\/([a-z][a-zA-Z0-9_\-]+)$/ )[ 1 ];

	if( databaseName in Lemuria.database ){
		this.database = Lemuria.database[ databaseName ];

	}else{
		this.database = mongoose.createConnection( databaseURL );

		harden( databaseName, this.database, Lemuria.database );
	}

	if( databaseName in Lemuria.client ){
		this.client = Lemuria.client[ databaseName ];

	}else{
		this.client = mongodb.MongoClient.connect( databaseURL );

		harden( databaseName, this.client, Lemuria.client );
	}

	return this;
};

/*;
	@method-documentation:
		This will bind the database connection created by mongoose
			to the mold. Use this if a database connection has been
			done outside of the mold.

		This will extract and construct the database URL from
			the mongoose database connection so that a separate client
			connection can be establish.
	@end-method-documentation
*/
Lemuria.prototype.bindDatabase = function bindDatabase( database ){
	var databaseURL = "";
	if( database.host &&
		database.port &&
		database.name )
	{
		databaseURL = "mongodb://@host:@port/@databaseName"
			.replace( "@host", database.host )
			.replace( "@port", database.port )
			.replace( "@databaseName", database.name );
	}

	if( !databaseURL ){
		throw new Error( "cannot extract database url" );
	}

	var databaseName = database.name;
	if( databaseName in Lemuria.database ){
		this.database = Lemuria.database[ databaseName ];

	}else{
		this.database = database;

		harden( databaseName, this.database, Lemuria.database );
	}

	if( databaseName in Lemuria.client ){
		this.client = Lemuria.client[ databaseName ];

	}else{
		this.client = mongodb.MongoClient.connect( databaseURL );

		harden( databaseName, this.client, Lemuria.client );
	}

	return this;
};

Lemuria.prototype.buildModel = function buildModel( ){
	if( !( this.schema instanceof mongoose.Schema ) ){
		throw new Error( "schema not instantiated" );
	}

	this.model = ( this.database || mongoose ).model( this.title, this.schema );

	return this;
};

Lemuria.prototype.construct = function construct( data ){
	var _data = new this.model( data );

	_data.once( "error",
		( function onError( ){
			Bug( this.name, arguments, this );
		} ).bind( this ) );

	return _data;
};

Lemuria.prototype.deploy = function deploy( ){
	harden( this.title + "Mold", this );

	return this;
};

module.exports = Lemuria;
