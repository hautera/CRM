"use strict";

//the interval that defines the constant refresh of the search results 
let refresh_interval;

// loads initial search results
// and creates refresh interval
window.onload = () => {
	refresh_interval = setInterval(() => { customer_display.get_customer() }, 10000);
}

//clears refresh interval
window.onblur = () => {
	clearInterval(refresh_interval);
}

//sets up refresh interval 
window.onfocus = () => {
	customer_display.get_customer()
	refresh_interval = setInterval(() => { customer_display.get_customer() }, 10000);
}


let customer_display = new Vue({
		el:'#customer-display',
		delimiters: ['[[', ']]'],
		data: {
			form_validated: false,
			customer: {},	//TODO make individual fields so I don't have to write this.customer.phone_number :)
			tickets: [],
			invoices: [],
			shown: true,
			editing: false,
			errors: [],
			error_loading: false,
			referred_by_codes: [],
		},

		mounted: function() {
			this.get_customer();
			this.get_codes();
		},

		computed: {

			// finds the pk of the customer 
			// assumes URL format .../{pk}
			customer_pk: function() {
				let str = window.location.href;
				let i = 1;
				let c = str.charAt(str.length - i );
				//finding the first / from the back
				while ( c !== "/" ){	//probably not the most efficient method
					i += 1;
					c = str.charAt(str.length - i );
				}
				return str.substring(str.length - i + 1);	
			},


			no_errors: function(){
				return this.valid_first_name && this.valid_last_name && this.valid_phone_entry
					&& this.valid_email_entry && this.customer.referred_by;
			},

			valid_first_name: function(){
				if( this.customer.first_name ){
					return this.customer.first_name.length <= 40;
				} 
				return false;
			},

			valid_last_name: function() {
				if( this.customer.last_name ){
					return this.customer.last_name.length <= 40;
				} 
				return false;
			},
			
			valid_phone_entry: function(){
				return valid_phone(this.customer.phone_number);
			},

			valid_email_entry: function(){
				return valid_email(this.customer.email);
			},

		},

		methods: {

			get_codes: async function(){
				let resp = await fetch("/api/customer", {method:"OPTIONS"});
				let data = await resp.json();
				//console.log(data);
				this.referred_by_codes = data.actions.POST.referred_by.choices;
			},

			error: () => {
				this.error_loading = true;
				this.customer = {
					first_name:"An error occured loading this customer",
					last_name:"",
					address: {
						ln1:"",
						ln2:"",
					}
				};
			},

			// fetches customer from server 
			get_customer: async function() {
				try {
					let response = await fetch( `/api/customer/${this.customer_pk}` );
					if( response.status == 200 ){
						this.customer = await response.json();
					} else {
						this.error()
					}
				} catch(err){
					this.error();
				}
			},
			
			toggle_editing: function(){
				this.customer.phone_number = this.customer.phone_number.replace("-", "").replace("-","");
				this.editing = !this.editing;
				clearInterval(refresh_interval);
			},

			update_customer: async function() {
				// collect the errors 
				this.errors = [];
				//TODO Better validation
				this.form_validated = true;
				if( this.no_errors ) {
					// submit the form to server 
					//Makes phone number prettier 
					let csrf = get_cookie('csrftoken');
					this.customer.phone_number = 
						`${this.customer.phone_number.slice(0,3)}-${this.customer.phone_number.slice(3,6)}-${this.customer.phone_number.slice(6)}`;
					let request = {
						method: "PUT",
						headers: {
							"X-CSRFToken":csrf,
							"Accept" : "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(this.customer),
					};
					//console.log(request.body); // debug doodle 

					let resp = await fetch(`/api/customer/${this.customer_pk}/`, request);
					//console.log(resp.status);
					if( resp.status == 201 || resp.status == 200 ){
						this.editing = false;
						this.customer = await resp.json();
						refresh_interval = setInterval(() => { customer_display.get_customer() }, 10000);
					} else {
						console.log(await resp.text());
					}
				}
			},

			delete_customer: async function(){
				let confirm_message = "You are about to delete this customer, this action cannot be undone!";
				if(window.confirm(confirm_message)){
					let resp = await fetch(`/api/customer/${this.customer_pk}/`, {
							method: "DELETE",
							headers: {
								"X-CSRFToken": get_cookie('csrftoken'),
								"Accept" : "application/json",
								"Content-Type": "application/json",
							},
					});
					window.location.href = '/customers/';
				}
			}
		}
	});

