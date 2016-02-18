export default function asyncR ( asyncOperation ) {
	var cache = null,
		callbacks = [];

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
			}
			return cache;
		}
	}
}