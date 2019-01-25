"use strict";

let customer_display = new Vue({
		el:'#customer-display',
		delimiters: ['[[', ']]'],
		data: {
			customer_pk: null,
			customer: {},	//TODO make individual fields so I don't have to write this.customer.phone_number :)
			tickets: [],
			invoices: [],
			shown: true,
			editing: false,
			errors: [],
			error_loading: false,
		},

		methods: {

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
			},

			update_customer: async function() {
				// collect the errors 
				this.errors = [];
				if( !this.customer.first_name ) this.errors.push("Please enter a first name");
				if( !this.customer.last_name ) this.errors.push("Please enter a last name");
				if( !valid_email(this.customer.email) ) this.errors.push("Must be a valid email");
				if( !valid_phone(this.customer.phone_number) ) this.errors.push("Must be a valid phone number");

				if( !this.errors.length ) {
					console.log("updating customer")
					// submit the form to server 
					//Makes phone number prettier 
					let csrf = get_cookie('csrftoken');
					this.customer.phone_number = 
						`${this.customer.phone_number.slice(0,3)}
						-${this.customer.phone_number.slice(3,6)}
						-${this.customer.phone_number.slice(6)}`;
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
					if( resp.status == 201 ){
						this.editing = false;
					} else {
						console.log(await resp.text());
					}
				}
			},

			delete_customer: function(){
				if(window.confirm("You are about to delete this customer, this action cannot be undone!")){
					fetch('/api/customer/' + this.get_pk() + "/", {
							method: "DELETE",
							headers: {
							"X-CSRFToken":this.get_cookie('csrftoken'),
							"Accept" : "application/json",
							"Content-Type": "application/json",
					},}).then( data => window.location.href = "/customers/")
				}
			}
		}
	});

// finds the pk of the customer 
// assumes URL format .../{pk}
const get_pk = () => {
	let str = window.location.href;
	let i = 1;
	let c = str.charAt(str.length - i );
	//finding the first / from the back
	while ( c !== "/" ){	//probably not the most efficient method
		i += 1;
		c = str.charAt(str.length - i );
	}
	return str.substring(str.length - i + 1);	
}

//TODO make a refresh function 
window.onload = function() {
	customer_display.customer_pk = get_pk();
	customer_display.get_customer();
}