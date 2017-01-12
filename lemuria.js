"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
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
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			]
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
			"clazof": "clazof",
			"diatom": "diatom",
			"doubt": "doubt",
			"Ethernity": "ethernity",
			"EventEmitter": "events",
			"falzy": "falzy",
			"harden": "harden",
			"heredito": "heredito",
			"kein": "kein",
			"llamalize": "llamalize",
			"mongodb": "mongodb",
			"mongoose": "mongoose",
			"Olivant": "olivant",
			"protype": "protype",
			"shardize": "shardize",
			"titlelize": "titlelize",
			"U200b": "u200b"
		}
	@end-include
*/

const called = require( "called" );
const clazof = require( "clazof" );
const diatom = require( "diatom" );
const doubt = require( "doubt" );
const Ethernity = require( "ethernity" );
const EventEmitter = require( "events" );
const falzy = require( "falzy" );
const harden = require( "harden" );
const heredito = require( "heredito" );
const llamalize = require( "llamalize" );
const mongodb = require( "mongodb" );
const mongoose = require( "mongoose" );
const Olivant = require( "olivant" );
const optfor = require( "optfor" );
const shardize = require( "shardize" );
const titlelize = require( "titlelize" );
const U200b = require( "u200b" );

/*;
	@notice:
		This is done because of the deprecation warnings of mongoosejs.
	@end-notice
*/
mongoose.Promise = require( "bluebird" );

harden( "TYPE_OBJECT_ID", mongoose.Schema.Types.ObjectId );
harden( "TYPE_MIXED", mongoose.Schema.Types.Mixed );

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
	let name = optfor( arguments, STRING );

	if( !name ){
		Fatal( "no model name given" );

		return this;
	}

	name = shardize( name );

	this.name = name;
	this.title = titlelize( name );
	this.label = llamalize( name );
	this.alias = llamalize( name, true );

	harden( "scope", { }, this );
	harden( "public", { }, this.scope );
	harden( "limited", { }, this.scope );
	harden( "restricted", { }, this.scope );
	harden( "permitted", { }, this.scope );
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
			"index": true,
			"select": false,
			"trim": true
		},

		//: Searchable name
		"name": {
			"$type": String,
			"index": true,
			"required": true,
			"trim": true,
			"unique": true
		},

		//: Displayable name
		"title": {
			"$type": String,
			"required": true,
			"trim": true
		},

		//: Array of descriptive phrases
		"description": {
			"$type": [ String ],
			"default": "",
			"trim": true
		},

		//: Searchable tag references
		"tag": {
			"$type": [ String ],
			"default": name,
			"index": true,
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

		"__v": {
			"$type": Number,
			"select": false
		}
	};

	this.addScope( "_id", LOCKED );

	this.addScope( "reference", PERMITTED );
	this.addScope( "status", RESTRICTED );
	this.addScope( "date", RESTRICTED );

	this.addScope( "stamp.code", PUBLIC );
	this.addScope( "short.code", PUBLIC );
	this.addScope( "code", PUBLIC );
	this.addScope( "path", PUBLIC );
	this.addScope( "name", PUBLIC );
	this.addScope( "title", PUBLIC );
	this.addScope( "description", PUBLIC );
	this.addScope( "tag", PUBLIC );

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
		protype( schema[ 0 ], OBJECT ) &&
		!doubt( typeof schema[ 0 ].$type ).ARRAY &&
		schema[ 0 ].reference &&
		protype( schema[ 0 ].reference, OBJECT ) &&
		schema[ 0 ].reference.ref )
	{
		this.addScope( name, LIMITED );
	}

	return this;
};

Lemuria.prototype.addScope = function addScope( property, type ){
	if( protype( type, STRING ) &&
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

	if( !protype( property, STRING ) ){
		Fatal( "invalid property", property, type, this );

		return this;
	}

	this.scope[ type ][ property ] = true;

	return this;
};

Lemuria.prototype.addFactor = function addFactor( property ){
	if( !protype( property, STRING ) ){
		Fatal( "invalid property", property, this );

		return this;
	}

	if( kein( this.factor, property ) ){
		return this;
	}

	let index = Object.keys( this.factor ).length || 0;
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

	let self = this;
	this.schema.pre( "save",
		function onSave( next ){
			if( !this.code && this.name && this.stamp ){
				this.code = `${ this.name }-${ this.stamp.code }`;

				this.code = U200b( this.code ).raw( );
			}

			if( !this.path && this.model && this.code ){
				this.path = `/${ this.model }/${ this.code }`;
			}

			this.name = this.name || shardize( this.title );

			if( this.description.length == 0 ){
				this.description = [ this.code ];
			}

			if( this.tag.length == 0 ){
				this.tag = [ this.name, this.code ];
			}

			if( self.engine && protype( self.engine, FUNCTION ) ){
				let option = { };
				option[ self.label ] = this.toObject( );

				self.engine( option )
					.generateIdentity( ( function onGenerateIdentity( issue, identity, option ){
						if( issue ){
							issue
								.remind( "failed generate identity", option )
								.remind( "identity generate for identity refresh" )
								.prompt( );

						}else if( this.hash != identity.hash ){
							this.hash = identity.hash;
							this.stamp = identity.stamp;
							this.short = identity.short;
							this.code = identity.code;
							this.path = identity.path;

							Prompt( "identity refresh for", this.code, this.model );
						}

						next( );

					} ).bind( this ) );

			}else{
				next( );
			}
		} );

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
	delete data.short;
	delete data.code;
	delete data.path;
	delete data.model;
	delete data.sort;
	delete data.date;
	delete data._id;
	delete data.__v;

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
	if( !( clazof( this.schema, mongoose.Schema ) ) ){
		throw new Error( "schema not instantiated" );
	}

	let result = undefined;
	if( protype( initialize, FUNCTION ) ){
		result = initialize.call( this, plugin );
	}

	this.schema.plugin( result || plugin );

	return this;
};

Lemuria.prototype.attachHook = function attachHook( hook ){
	if( !protype( hook, FUNCTION ) ){
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
	if( protype( method, FUNCTION ) ){
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
	let databaseName = databaseURL.match( /\/([a-z][a-zA-Z0-9_\-]+)$/ )[ 1 ];

	if( kein( Lemuria.database, databaseName ) ){
		this.database = Lemuria.database[ databaseName ];

	}else{
		this.database = mongoose.createConnection( databaseURL );

		harden( databaseName, this.database, Lemuria.database );
	}

	if( kein( Lemuria.client, databaseName ) ){
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
	let databaseURL = "";
	if( database.host && database.port && database.name ){
		databaseURL = `mongodb://${ database.host }:${ database.port }/${ database.name }`;
	}

	if( falzy( databaseURL ) ){
		throw new Error( "cannot extract database url" );
	}

	let databaseName = database.name;
	if( kein( Lemuria.database, databaseName ) ){
		this.database = Lemuria.database[ databaseName ];

	}else{
		this.database = database;

		harden( databaseName, this.database, Lemuria.database );
	}

	if( kein( Lemuria.client, databaseName ) ){
		this.client = Lemuria.client[ databaseName ];

	}else{
		this.client = mongodb.MongoClient.connect( databaseURL );

		harden( databaseName, this.client, Lemuria.client );
	}

	return this;
};

Lemuria.prototype.buildModel = function buildModel( ){
	if( !( clazof( this.schema, mongoose.Schema ) ) ){
		throw new Error( "schema not instantiated" );
	}

	this.model = ( this.database || mongoose ).model( this.title, this.schema );

	return this;
};

Lemuria.prototype.construct = function construct( data ){
	let instance = new this.model( data );

	instance.once( "error",
		( function onError( ){
			Bug( this.name, arguments, this );
		} ).bind( this ) );

	return instance;
};

Lemuria.prototype.attachEngine = function attachEngine( engine ){
	/*;
		@meta-configuration:
			{
				"engine:required": [
					"string",
					"object",
					"function"
				]
			}
		@end-meta-configuration
	*/
	if( this.engine ){
		return this;
	}

	engine = optfor( arguments, STRING ) || undefined;

	if( engine ){
		let name = llamalize( engine, true );
		engine = global[ name ] || undefined;

	}else{
		engine = optfor( arguments, OBJECT ) || undefined;
	}

	var rootEngine = engine.rootEngine;
	if( engine &&
		engine.rootEngine )
	{
		engine = engine.rootEngine.constructor;

	}else if( protype( engine, OBJECT ) &&
		protype( engine.constructor, FUNCTION ) &&
		( engine.rootEngine ||
			engine.constructor.rootEngine ||
			engine.constructor.prototype.rootEngine ) )
	{
		engine = engine.constructor;

		rootEngine = engine.constructor.rootEngine || engine.constructor.prototype.rootEngine;

	}else{
		engine = optfor( arguments, FUNCTION ) || undefined;
	}

	if( protype( engine, FUNCTION ) &&
		clazof( rootEngine, engine ) )
	{
		this.engine = engine;
		this.rootEngine = rootEngine;

		Prompt( "engine attached to mold", engine.name );

	}else{
		Fatal( "cannot attach engine to mold", arguments );
	}

	return this;
};

Lemuria.prototype.deploy = function deploy( ){
	harden( `${ this.alias }Mold`, this, global );

	return this;
};

module.exports = Lemuria;
