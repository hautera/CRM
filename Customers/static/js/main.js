
/*
 * Returns boolean tells if string is a valid email address
 */
const valid_email = function( str ) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String( str ).toLowerCase());
}

/**
 * Returns true if the the string passed is only digits 
 */
const only_digits = function( str ) {
	let re = /^[0-9]+/;
	return re.test(String( str ));
}

/**
 * Returns true if the string passed is ten digits 
 */
const valid_phone = function( str ) {
	let re = /^[0-9]{10}$/;
	return re.test(String(str));
}

/*
 * Gets a cookie of specified name 
 * I didn't write this code, don't touch it 
 */
const get_cookie = ( name ) => {
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
	//console.log(cookie_value); //debug 
	return cookie_value;
}


