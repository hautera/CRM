"use strict";

let search_app = new Vue({
		el: '#search',
		delimiters: ['[[', ']]'],
		data: {
			customers: [],
			message: '',
			query: '',
			hasError: false,
			//shown: false,
		},

		watch:{
			
		},

		methods: {
			search: function() {
				this.message = "Loading search results..";
				this.get_search_response();
			},

			get_search_response: async function(){
				let q_request = "";
				let q = this.query;
				// sets a potential search 

				//catches and formats the phone number properly for searching 
				if( only_digits(q) ){
					if(q.length > 6 )
						q = `${q.slice(0,3)}-${q.slice(3,6)}-${q.slice(6)}`;
					else if( q.length > 3 ){
						q = `${q.slice(0,3)}-${q.slice(3)}`;
					} 
				}
				
				//console.log(q) //debug
				if( q !== "" ){
					q_request = "?search=" + q;	 
				}
				try {
					// fetch things from server
					let response = await fetch(`/api/customer/${q_request}`);
					this.customers = await response.json();
					this.message = "";
				} catch(err) {
					this.message = "Error loading search results";
					this.hasError = true; 
				}
			},

		},
});	

//the interval that defines the constant refresh of the search results 
let refresh_interval;

// loads initial search results
// and creates refresh interval
window.onload = () => {
	search_app.get_search_response();
	refresh_interval = setInterval(() => { search_app.get_search_response() }, 10000);
}

//clears refresh interval
window.onblur = () => {
	clearInterval(refresh_interval);
}

//sets up refresh interval 
window.onfocus = () => {
	search_app.get_search_response()
	refresh_interval = setInterval(() => { search_app.get_search_response() }, 10000);
}
