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
			"class": true
		}
	@end-module-configuration

	@module-documentation:
		Standard default model.
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

	@todo:
		Add support for Redis and MariaDB

		Add support to use Bookshelf.js
	@end-todo:

	@include:
		{
			"called": "called",
			"diatom": "diatom",
			"doubt": "doubt",
			"Ethernity": "ethernity",
			"EventEmitter": "events",
			"harden": "harden",
			"heredito": "heredito",
			"llamalize": "llamalize",
			"mongodb": "mongodb",
			"mongoose": "mongoose",
			"Olivant": "olivant",
			"shardize": "shardize",
			"U200b": "u200b"
		}
	@end-include
*/

var called = require( "called" );
var diatom = require( "diatom" );
var doubt = require( "doubt" );
var Ethernity = require( "ethernity" );
var EventEmitter = require( "events" );
var harden = require( "harden" );
var heredito = require( "heredito" );
var llamalize = require( "llamalize" );
var mongodb = require( "mongodb" );
var mongoose = require( "mongoose" );
var Olivant = require( "olivant" );
var shardize = require( "shardize" );
var U200b = require( "u200b" );

/*;
	@notice:
		This is done because of the deprecation warnings of mongoosejs.
	@end-notice
*/
mongoose.Promise = require( "bluebird" );

harden( "ACTIVE", "active" );
harden( "DISABLED", "disabled" );
harden( "REMOVED", "removed" );
harden( "LOCKED", "locked" );

//: Any access.
harden( "PUBLIC", "public" );
//: Shareable, temporarily hidden, ignore security.
harden( "LIMITED", "limited" );
//: Shareable, but not visible, ignore security.
harden( "HIDDEN", "hidden" );
//: Shareable and secured.
harden( "RESTRICTED", "restricted" );
//: Limited sharing and secured.
harden( "PERMITTED", "permitted" );
//: Non-shareable and secured.
harden( "PRIVATE", "private" );
//: Root access only.
harden( "LOCKED", "locked" );

var Lemuria = heredito( diatom( "Lemuria" ), EventEmitter );

harden( "database", Lemuria.database || { }, Lemuria );
harden( "client", Lemuria.client || { }, Lemuria );

Lemuria.prototype.initialize = function initialize( model ){
	this.name = shardize( model, true );
	var name = this.name;

	this.title = llamalize( model, true );

	harden( "scope", { }, this );
	harden( "public", { }, this.scope );
	harden( "limited", { }, this.scope );
	harden( "restricted", { }, this.scope );
	harden( "private", { }, this.scope );
	harden( "locked", { }, this.scope );

	harden( "factor", { }, this );

	this.structure = {
		//: Fixed identifiable reference
		"reference": {
			"$type": String,
			"index": true,
			"required": true,
			"trim": true,
			"unique": true
		},

		//: Changing identifiable reference
		"hash": {
			"$type": String,
			"required": true,
			"select": false,
			"trim": true,
			"unique": true
		},

		//: Short fixed identifiable reference
		"stamp": {
			"code":{
				"$type": String,
				"index": true,
				"required": true,
				"trim": true,
				"unique": true
			},
			"setting": {
				"$type": String,
				"index": true,
				"required": true,
				"select": false,
				"unique": true,
			}
		},

		//: 6 character unique short reference
		"short": {
			"code":{
				"$type": String,
				"index": true,
				"required": true,
				"trim": true,
				"unique": true
			},
			"setting": {
				"$type": String,
				"index": true,
				"required": true,
				"select": false,
				"unique": true
			}
		},

		//: name-stamp reference
		"code": {
			"$type": String,
			"index": true,
			"required": true,
			"trim": true,
			"unique": true
		},

		//: This is the public path based on the code.
		"path": {
			"$type": String,
			"index": true,
			"required": true,
			"trim": true,
			"unique": true,
		},

		//: The model type of the document.
		"model": {
			"$type": String,
			"default": name,
			"enum": [ name ],
			"index": true,
			"select": false,
			"trim": true
		},

		//: Searchable name
		"name": {
			"$type": String,
			"index": true,
			"trim": true,
			"unique": true
		},

		//: Displayable name
		"title": {
			"$type": String,
			"trim": true
		},

		//: Array of descriptive phrases
		"description": {
			"$type": [ String ],
			"default": "",
			"get": function getDescription( description ){
				return U200b( description ).join( "," );
			},
			"trim": true
		},

		//: Status of the document.
		"status": {
			"$type": String,
			"default": ACTIVE,
			"enum": [
				ACTIVE,
				DISABLED,
				REMOVED,
				LOCKED
			],
			"required": true,
			"trim": true
		},

		//: Searchable tag references
		"tag": {
			"$type": [ String ],
			"default": name,
			"index": true,
			"get": function getTag( tag ){
				return U200b( tag ).join( "," );
			},
			"trim": true
		},

		//: The date this document is created.
		"date": {
			"$type": [ Number ],
			"default": Ethernity.now,
			"index": true,
			"get": function getDate( date ){
				return Ethernity( date ).trueTime;
			}
		},

		//: This will be used as the default sorting property.
		"sort": {
			"$type": Number,
			"default": function getIndex( ){
				return Date.now( ) + Math.random( );
			},
			"index": true,
			"select": false
		},

		"_id": {
			"$type": mongoose.Schema.Types.ObjectId,
			"select": false
		},

		"__v": {
			"$type": Number,
			"select": false
		}
	};

	this.addScope( "reference", PERMITTED );
	this.addScope( "status", RESTRICTED );
	this.addScope( "date", RESTRICTED );

	this.addFactor( "name" );
	this.addFactor( "title" );
	this.addFactor( "model" );

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
	this.structure[ name ] = schema;

	if( doubt( schema ).ARRAY &&
		typeof schema[ 0 ] == "object" &&
		!doubt( typeof schema[ 0 ].$type ).ARRAY )
	{
		this.scope[ LIMITED ][ name ] = true;
	}

	if( doubt( schema.$type ).ARRAY &&
		schema.$type[ 0 ] === String )
	{
		schema.get = function getElement( data ){
			return U200b( data ).join( "," );
		};
	}

	return this;
};

Lemuria.prototype.addScope = function addScope( property, type ){
	if( typeof type == "string" &&
		type != PUBLIC &&
		type != LIMITED &&
		type != HIDDEN &&
		type != RESTRICTED &&
		type != PERMITTED &&
		type != PRIVATE &&
		type != LOCKED )
	{
		Fatal( "invalid scope type", property, type, this );

		return this;
	}

	if( typeof property != "string" ){
		Fatal( "invalid property", property, type, this );

		return this;
	}

	this.scope[ type ][ property ] = true;

	return this;
};

Lemuria.prototype.addFactor = function addFactor( property ){
	if( typeof property != "string" ){
		Fatal( "invalid property", property, this );

		return this;
	}

	if( property in this.factor ){
		return this;
	}

	var index = Object.keys( this.factor ).length || 0;
	index++;

	this.factor[ property ] = index;

	return this;
};

/*;
	@method-documentation:
		This will create a new instance of mongoose.Schema.
	@end-method-documentation
*/
Lemuria.prototype.buildSchema = function buildSchema( option ){
	option = option || { };

	this.schema = new mongoose.Schema( this.structure, {
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

		if( description && typeof description == "string" ){
			this.description.addToSet( description );
		}

		callback( );

		return this;
	};

	this.schema.methods.tagged = function tagged( tag, callback ){
		callback = called( callback );

		if( U200b( tag ).separate( ).length > 1 ){
			callback( );

			return this;
		}

		if( tag && typeof tag == "string" ){
			this.tag.addToSet( tag );
		}

		callback( );

		return this;
	};

	for( var property in this.structure ){
		if( !doubt( this.structure[ property ] ).ARRAY &&
			doubt( this.structure[ property ].$type ).ARRAY &&
			this.structure[ property ].$type[ 0 ] === String )
		{
			var method = llamalize( [ "push", property ].join( "-" ) );

			this.schema[ property ].methods[ method ] = function setElement( element, callback ){
				callback = called( callback );

				if( typeof element == "string" ){
					this[ property ].addToSet( element );
				}

				callback( );

				return this;
			};
		}
	}

	this.schema.pre( "save",
		function onSave( next ){
			if( this.name && this.stamp ){
				this.code = [ this.name, this.stamp.code ].join( "-" );
			}

			if( !this.path && this.model && this.code ){
				this.path = "/@model/@code"
					.replace( "@model", this.model )
					.replace( "@code", this.code );
			}

			if( this.title ){
				this.name = shardize( this.title, true );
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
		Remove properties that may affect the inner workings of the model.
	@end-method-documentation
*/
Lemuria.prototype.restrict = function restrict( data ){
	delete data.reference;
	delete data.hash;
	delete data.stamp;
	delete data.code;
	delete data.short;
	delete data.path;
	delete data.model;

	return data;
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
	if( database.host && database.port && database.name ){
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
	var instance = new this.model( data );

	instance.once( "error",
		( function onError( ){
			Bug( this.name, arguments, this );
		} ).bind( this ) );

	return instance;
};

Lemuria.prototype.deploy = function deploy( ){
	harden( this.title + "Mold", this );

	return this;
};

module.exports = Lemuria;
