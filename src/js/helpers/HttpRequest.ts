export class HttpRequest {
	constructor() {}
	
	getRes = (url, head) => this.getResponse(url, head);

	public getResponse(url, headers) {
		return new Promise(
			(resolve, reject) => {
				var http:XMLHttpRequest = new XMLHttpRequest();

				url = this.addHeaders(url, headers);
				http.open('get', url, true);

				http.onload = () => {
					if(http.status === 200) {
						resolve(JSON.parse(http.response));
					} else {
						reject(http.statusText);
					}
				}

				http.onerror = () => reject(http.statusText);
				http.send();
		});
	}



	private addHeaders(url, headers) {
		url += '?';

		for(let prop in headers) {
			if(headers.hasOwnProperty(prop)) {
				let name = prop;
				let val = headers[prop];
				url += prop + '=' + encodeURIComponent(val) + '&';
			}
		}
		url = url.slice(0, -1);	
		return url;
	}
}
