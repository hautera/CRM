"use strict";
//todo make a better form handler 
//maybe a tad of server-side form validation
let form_handler = new Vue({
	el: '#create-form',
	delimiters: ['[[', ']]'],
	data: {
		form_validated: false,
		first_name: null,
		last_name: null,
		email: null,
		phone_number: null,
		referred_by: "",
		referred_by_codes: [],
		address:{
			ln1: null,
			ln2: null,
			city: "Seattle",
			state: "WA",
			postal_code: "98105",
		},
	},

	mounted: function() {
		this.get_codes();
	},

	computed: {

		no_errors: function(){
			return this.valid_first_name && this.valid_last_name && this.valid_phone_entry
				&& this.valid_email_entry && this.referred_by && this.valid_zip && this.valid_address;
		},

		valid_first_name: function(){
			if( this.first_name ){
				return this.first_name.length <= 40;
			} 
			return false;
		},

		valid_last_name: function() {
			if( this.last_name ){
				return this.last_name.length <= 40;
			} 
			return false;
		},
		
		valid_phone_entry: function(){
			return valid_phone(this.phone_number);
		},

		valid_email_entry: function(){
			return valid_email(this.email);
		},

		valid_zip: function(){
			if(only_digits(this.address.postal_code)){
				return this.address.postal_code.length == 5;
			}
			return false;
		},

		valid_address: function(){
			return !((this.address.ln1 && this.address.ln1.length > 50) || (this.address.ln2 && this.addres.ln2.length > 10))
		}

	},

	methods: {
		get_codes: async function(){
			let resp = await fetch("/api/customer", {method:"OPTIONS"});
			let data = await resp.json();
			//console.log(data);
			this.referred_by_codes = data.actions.POST.referred_by.choices;
		},

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
			this.form_validated = true;
			// collect the errors 
			
			if( this.no_errors ) {
				console.log("We're making a customer");
				// submit the form to server 
				//Makes phone number prettier 
				let csrf = this.get_cookie('csrftoken');
				let phone = `${this.phone_number.slice(0,3)}-${this.phone_number.slice(3,6)}-${this.phone_number.slice(6)}`;
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
						referred_by: this.referred_by,
						address: this.address,
					}),
				};
				//console.log(request.body); // debug doodle 

				let resp = await fetch('/api/customer/', request);
				console.log(resp.status)
				if( resp.status == 201 ){
					let data = await resp.json();
					window.location.href = `/customers/${data.pk}`;
				} else {
					console.log(await resp.text());
				}
			}
		},
	},

});

window.onload = () => {
	
};