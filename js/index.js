require('./index.scss');
import Unsplash, { toJson } from "unsplash-js";

const UNSPLASH_API_ID = "798bf61f1ae0321ef02184da2c3ad42c5c0ab2b84561af0e20aa536d2337c051";
var UNSPLASH_collection = 947821;

var currentImage = 0;
var processing = false;
window.onload = function(){
	//console.log(Unsplash);
	console.log("page ready");
	window.unsplash = new Unsplash({
	  applicationId: "798bf61f1ae0321ef02184da2c3ad42c5c0ab2b84561af0e20aa536d2337c051",
	  secret: "7831f41a0967afab102b16d5f07b85a03634a9112fd8766689b8a194a530b859",
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
		if(e.key == "y" && processing == false){
			processing = true;
			unsplash.collections.addPhotoToCollection(UNSPLASH_collection, currentImage)
  			.then(toJson)
  			.then(json => {
  				processing = false;
  				fetchWallpaper();
  			});

		}
		if(e.key == "n" && processing == false){
			processing = true;
			fetchWallpaper();
			processing = false;
		}
	})

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
	fetch("https://api.unsplash.com/photos/random?query="+(getParameterByName("q")!=null?getParameterByName("q"):"landscape")+"&orientation=landscape&client_id="+UNSPLASH_API_ID+"&w=1920&h=1080&r="+Math.random())
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