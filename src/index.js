export default function asyncR ( asyncOperation ) {
	var cache = null;
	return function () {
		if (!cache) {
			cache = asyncOperation()
		}
		return cache;
	}
}