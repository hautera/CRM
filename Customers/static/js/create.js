"use strict";
//todo make a better form handler 
let form_handler = new Vue({
		el: '#create-form',
		delimiters: ['[[', ']]'],
		data: {
			form_validated: false,
			first_name: null,
			valid_first_name: true,
			last_name: null,
			email: null,
			phone_number: null,
			referred_by: "",
			referred_by_codes: {
				"Apple Appointment": "AA",
				"Apple Recommendation": "AR",
				"Internet Search": "IS",
			},
			address:{
				ln1: "",
				ln2: "",
				city: "",
				state: "",
				postal_code: "",
			},
			errors: [],
		},

		computed: {
		},

		methods: {
			get_cookie: ( name ) => {
				let cookie_value = null;
				if(document.cookie && document.cookie != ''){
					let cookies = document.cookie.split(';');
					for( var i = 0; i < cookies.length; i ++ ){
						let cookie = jQuery.trim(cookies[i]);
						if(cookie.substring(0, name.length+1) === (name + '=')){
							cookie_value = decodeURIComponent(cookie.substring(name.length +1 ));
							break;
						}
					}
				}
				//console.log(cookie_value);
				return cookie_value;
			},

			submit:  async function() {
				// collect the errors 
				this.errors = [];
				if( !this.first_name ) {
					this.errors.push("Please enter a first name");
					this.valid_first_name = false;
				}
				if( !this.last_name ) this.errors.push("Please enter a last name");
				if( !valid_email(this.email) ) this.errors.push("Must be a valid email");
				if( !valid_phone(this.phone_number) ) this.errors.push("Must be a valid phone_number");
				if( !this.referred_by ) this.errors.push("We need to know how this customer found out about us");
				if( this.address.state.length != 2 ) this.errors.push("Invalid state code");
				if( !this.errors.length ) {
					console.log("We're making a customer");
					// submit the form to server 
					//Makes phone number prettier 
					let csrf = this.get_cookie('csrftoken');
					let phone = this.phone_number.slice(0,3) + '-' + this.phone_number.slice(3,6) + '-' + this.phone_number.slice(6);
					let request = {
						method: "POST",
						headers: {
							"X-CSRFToken":csrf,
							"Accept" : "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							first_name: this.first_name,
							last_name: this.last_name,
							email: this.email,
							phone_number: phone,
							referred_by: this.referred_by_codes[this.referred_by],
							address: this.address,
						}),
					};
					//console.log(request.body); // debug doodle 

					let resp = await fetch('/api/customer/', request);
					console.log(resp.status)
					if( resp.status == 201 ){
						let data = await resp.json();
						window.location.href = `/customers/${data.pk}`;
					} else{
						console.log(await resp.text());
					}
				}
			},
		},

	});

window.onload = () => {
	
};