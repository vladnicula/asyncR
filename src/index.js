export default function asyncR ( asyncOperation, options ) {
	var cache = null,
		callbacks = [];

	options = options || {
		clearOnDone : false
	};
		
	return {

		whenCleared : function (cb) {
			callbacks.push(cb);
		},

		clear : function () {
			var p = cache || Promise.resolve({});
			return p.then( () => {
				cache = null;
				callbacks.forEach(cb => {cb()});
			});
		},

		get : function () {
			if (!cache) {
				cache = asyncOperation()
				if ( options.clearOnDone ) {
					cache
						.then( () => { cache = null } )
						.catch( () => { cache = null } );
				}
			}
			return cache;
		}
	}
}