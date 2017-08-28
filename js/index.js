require('./index.scss');
import Unsplash, { toJson } from "unsplash-js";

const UNSPLASH_API_ID = "a7d6cc6f5ce74fcf56703608563d852c6f7b110a82b1e10cf58e0ead897cc223";
var UNSPLASH_collection = 947821;
var UNSPLASH_morning_collection = 1125083;
var UNSPLASH_afternoon_collection = 1125084;
var UNSPLASH_evening_collection = 1125086;
var UNSPLASH_night_collection = 1125088;



var currentImage = 0;
var processing = false;
window.onload = function(){
	//console.log(Unsplash);
	console.log("page ready");
	window.unsplash = new Unsplash({
	  applicationId: UNSPLASH_API_ID,
	  secret: "d68c225884c2ac12e27d0e6b8e2ced01780bdebad648aed60fde1ad4cd743b0f",
	  callbackUrl: "https://manak.github.io/fruumo-wallpaper-picker/"
	});

	var auth = getParameterByName("code");
	if(!auth){
		const authenticationUrl = unsplash.auth.getAuthenticationUrl([
			"public",
	  		"write_collections",
	  		"read_collections"
		]);
		document.getElementsByClassName('login')[0].addEventListener('click', function(){
			window.top.location = authenticationUrl;
		});

		return;
	}
	unsplash.auth.userAuthentication(auth)
  	.then(toJson)
  	.then(json => {
 	   unsplash.auth.setBearerToken(json.access_token);
  	});
	document.getElementsByClassName('login-container')[0].style.display = "none";
	document.getElementsByClassName('application')[0].style.display = "block";
	fetchWallpaper();

	document.addEventListener('keyup', function(e){
		if(e.key == "m" && processing == false){
			processing = true;
			unsplash.collections.addPhotoToCollection(UNSPLASH_collection, currentImage)
  			.then(toJson)
  			.then(json => {
  				fetchWallpaper();
  				unsplash.collections.addPhotoToCollection(UNSPLASH_morning_collection, currentImage)
	  			.then(toJson)
	  			.then(json => {
	  				processing = false;
	  			});
  			});
		}
		if(e.key == "a" && processing == false){
			processing = true;
			unsplash.collections.addPhotoToCollection(UNSPLASH_collection, currentImage)
  			.then(toJson)
  			.then(json => {
  				fetchWallpaper();
  				unsplash.collections.addPhotoToCollection(UNSPLASH_afternoon_collection, currentImage)
	  			.then(toJson)
	  			.then(json => {
	  				processing = false;
	  			});
  			});
		}
		if(e.key == "e" && processing == false){
			processing = true;
			unsplash.collections.addPhotoToCollection(UNSPLASH_collection, currentImage)
  			.then(toJson)
  			.then(json => {
  				fetchWallpaper();
  				unsplash.collections.addPhotoToCollection(UNSPLASH_evening_collection, currentImage)
	  			.then(toJson)
	  			.then(json => {
	  				processing = false;
	  			});
  			});
		}
		if(e.key == "n" && processing == false){
			processing = true;
			unsplash.collections.addPhotoToCollection(UNSPLASH_collection, currentImage)
  			.then(toJson)
  			.then(json => {
  				fetchWallpaper();
  				unsplash.collections.addPhotoToCollection(UNSPLASH_night_collection, currentImage)
	  			.then(toJson)
	  			.then(json => {
	  				processing = false;
	  			});
  			});
		}
		if(e.key == "x" && processing == false){
			processing = true;
			fetchWallpaper();
			processing = false;
		}
	});
	document.getElementById('search').addEventListener('keyup', function(e){
		e.stopPropagation();
	});

}

window.getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.fetchWallpaper = function(callback){
	processing = true;
	var q = encodeURIComponent(document.getElementById('search').value);
	console.log(q);
	fetch("https://api.unsplash.com/photos/random?query="+(q!=""?q:"landscape")+"&orientation=landscape&client_id="+UNSPLASH_API_ID+"&w=1920&h=1080&r="+Math.random())
	.then(function(response){
		if(response.ok)
			return response.json();
	})
	.then(function(data){
		//Get new wallpaper data
		//regular or full
		console.log(data);
		currentImage = data.id;
		processing = false;
		document.getElementsByClassName('wallpaper')[0].style.backgroundImage = "url('"+data.urls.full+"')";
		document.getElementById('attribution').innerText = data.user.first_name + "/ unsplash";
	});
}