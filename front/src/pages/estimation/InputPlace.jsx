import React, { useEffect, useRef, useState } from 'react'
import './inputStyle.css'
import { Search, GpsFixed } from "@material-ui/icons"


const apiKey = "AIzaSyBBPhfP0FiU9J-yyM1Kc-CHC4NqXSu3uS8";//"AIzaSyAddXBPPLwZhucJu6SsMPkPHSx5Y6y3s2s"//import.meta.env.VITE_APP_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';


// load google map api js


function loadAsyncScript(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src
    })
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  })
}

const extractAddress = (place) => { //fonction pour avoir acces aux informations geographique de l'utilisateur

  const address = {
    city: "",
    state: "",
    zip: "",
    country: "",
    plain() {
      const city = this.city ? this.city + " - " : "";
      const zip = this.zip ? this.zip + " - " : "";
      const state = this.state ? this.state + " - " : "";
      // console.log('this.country + state + city + zip');
      // console.log(this.country + state + city)
      return state + city + zip + this.country;
    }
  }

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach(component => {
    const types = component.types;
    const value = component.long_name;

    // console.log('that is types');
    // console.log(types);
    // console.log('that is value');
    // console.log(value);

    

    if (types.includes("locality")) {
      address.city = value;
      // console.log('address.city')
      // console.log(address.city)
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = value;

      console.log('address.state')
      console.log(value)
      
    }

    if (types.includes("postal_code")) {
      address.zip = value;
    }

    if (types.includes("country")) {
      address.country = value;

      // console.log('address.country')
      // console.log(address.country)
    }

  });

  return address;
}


function InputPlace(props) {

  const searchInput = useRef(null);
  const [address, setAddress] = useState({});
  const [latitude, setlatitude] = useState(25.09938);
  const [longitude, setlongitude] = useState(55.141275);


  // init gmap script
  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
      return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  useEffect(() => {
    // props.modifyLongitude(longitude)
    props.modifyLatitude(latitude)
    console.log(`voici la latitude attendue ${latitude}`);
    // console.log(`voici la longitude attendue ${longitude}`);
    //  }, [latitude, props, longitude])
  }, [latitude])

  useEffect(() => {
    props.modifyLongitude(longitude)
    console.log(`voici la longitude attendue ${longitude}`);
    //  }, [latitude, props, longitude])
  }, [longitude])

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    // Affichage du nom et de l'adresse du lieu dans la console
 
    //var loaction = place.formatted_address;

    var address_components = place.address_components;

    // Parcourir les composants d'adresse pour récupérer les informations de localisation
    const input = document.getElementById('myInput');
    const value = input.value.split(" - ")[0];
    props.setposition(value)

   
    // // Récupérer l'état, la ville et la zone administrative de niveau 2
    // var city = place.address_components.find(component => component.types.includes("locality"));
    // var state = place.address_components.find(component => component.types.includes("administrative_area_level_1"));
    // // var district = place.address_components.find(component => component.types.includes("administrative_area_level_2"));

    // // Afficher les informations
    // console.log("afficher les informations")
    // console.log(city.long_name);
    // console.log(state.long_name);
    // // console.log(district.long_name);

    var description = place.description;

    // Afficher la description
    console.log(description);

    if (lat != latitude) {
      setlatitude(lat);
    }

    if (longitude != lng) {
      setlongitude(lng);
    }

    // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    setAddress(extractAddress(place));
  }

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current);
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => {

      onChangeAddress(autocomplete)
    
      // const place = autocomplete.getPlace();

      // // Affichage du nom et de l'adresse du lieu dans la console
      // console.log('Nom du lieu :', place.name);
      // console.log('Adresse du lieu :', place.formatted_address);
    
    }
      );

  }


  const reverseGeocode = ({ latitude: lat, longitude: lng }) => {
    const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;
    console.log(`that is lat ${lat} and ${lng}`); //latitude et longitude de ma position actuelle
    setlatitude(lat);
    setlongitude(lng);

    searchInput.current.value = "Getting your location...";
    fetch(url)
      .then(response => response.json())
      .then(location => {
        const place = location.results[0];
        var _address = extractAddress(place);
        setAddress(_address);
       var val = _address.state
       props.setposition(`${val}`)
        searchInput.current.value = _address.plain();
      })
  }


  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  }





  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);



  return (
    <div className="App">
      <div>
        <div className="search">
          <span><Search /></span>
          <input id="myInput" style={{ justifyContent: 'center' }} ref={searchInput} type="text" placeholder="Search location...." />
          <button onClick={findMyLocation}><GpsFixed /></button>
        </div>

        {/* <div className="address">
          <p>City: <span>{address.city}</span></p>
          <p>State: <span>{address.state}</span></p>
          <p>Zip: <span>{address.zip}</span></p>
          <p>Country: <span>{address.country}</span></p>
        </div> */}

      </div>
    </div>
  )
}

export default InputPlace
