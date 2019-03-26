/*Declaramos variables globales para poder modificarlas y no crearlas en cada acción */
var lat_actual = 0;
var log_actual = 0;
var distancia1 = 0;
var map;
var ultimo_resultado = {};
var directionsDisplay = new google.maps.DirectionsRenderer;
var directionsService = new google.maps.DirectionsService;
var circulo =  new google.maps.Circle();

var marker_nearest =new google.maps.Marker();
var marker =new google.maps.Marker();


//Cuando conseguimos localizarnos ...

function onSuccessProgress(position){

    //alert(position.coords.latitude + position.coords.longitude);
    guardarPosicionAtTime(position.coords.latitude,position.coords.longitude,position.coords.longitude);

}
function onSuccess(position) {
    var element = document.getElementById('geolocation');
    //alert('posicion'+position);
    initialize(position.coords.latitude,position.coords.longitude);

    return position;
}

//Si algo fallase al localizarnos...
function onError(error) {
    //alert('code ivonne: '    + error.code    + '\n' +
    //  'message: ' + error.message + '\n');
    var idW=navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

//Posiciona el marcador en el MAPA basandose en nuestra geolocalización (vía clearWatch() o getCurrentPosition() al iniciar la app)
function initialize(lat,log) {
    /*
        Basado en un código en
        https://developers.google.com/maps/documentation/javascript/geocoding?hl=es#GeocodingResponses
    */
    //alert(lat+log);
    var geocoder;
    var infowindow = new google.maps.InfoWindow();
    var latlng = new google.maps.LatLng(lat,log);
    var mapOptions = {
        zoom:12,
        center: latlng,
        mapTypeId: 'roadmap'
    }

    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions );
    $('#map-canvas').css( 'height','500px');
    marker = new google.maps.Marker({
        position: latlng,
        icon: 'img/man.png',
        map: map,
        title: 'Estas aquí!'
    });
    /*Con esto marcamos la ruta en el mapa*/
    directionsDisplay.setMap(map);

    var dir="";
    var element = document.getElementById('resultado');
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({"latLng": latlng}, function(results, status){

        guardarPosicion(lat,log);

        if (status == google.maps.GeocoderStatus.OK)
        {
            if (results[0]) //Salen 8 resultados; uno nuestra posición, la posición de nuestra provincia, país, ....
            {
                //	alert(latlng);
                ultimo_resultado = results[0];
                dir = "<p><strong>localización actual: </strong>" + results[0].formatted_address + "</p>";


                lat_actual = lat;
                log_actual = log;


                //navigator.splashscreen.hide();

            }else{
                alert('esta llendo por un lado que no es');
                dir = "<p>No se ha podido obtener ninguna dirección en esas coordenadas.</p>";
            }
        }else{
            alert( "error status: " + status);
            dir = "<p>El Servicio de Codificación Geográfica ha fallado con el siguiente error: " + status + ".</p>";
        }

        //element.innerHTML = dir;

    });
}



//CALCULA LA RUTA EN BASE AL MODO DE TRANSPORTE

function calculateAndDisplayRoute(directionsService, directionsDisplay,destino,modo) {

    /*Con selectesMode cogemos la variable que nos indica el medio de transporte*/
    var selectedMode = modo;
    var destiny = destino;
    var result=destiny.split(',');
    /*multiplicar por uno para que lo tome como un número porque si se la pasaba sin multiplicar no lo reconocia como numero*/
    var lat_find= result[0]*1;
    var lan_find= result[1]*1;

    distancia1=0;
    /*direccionsservice api de google*/
    directionsService.route(
        {
            origin: {lat: lat_actual, lng: log_actual},  //
            destination: {lat: lat_find,lng:lan_find},  //
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."

            travelMode: google.maps.TravelMode[selectedMode]
        },
        function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                var route = response.routes[0];//no hay routes[1]..
                var summaryPanel = document.getElementById('directions-panel');
                summaryPanel.innerHTML = '';
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment = i + 1;
                    summaryPanel.innerHTML += '<b>origen:</b><br>';
                    summaryPanel.innerHTML += route.legs[i].start_address + ' to <br/> ';
                    summaryPanel.innerHTML += '<b>destino:</b><br>';
                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                    /*DISTANCIA NUMERICA PARA PODER HACER OPERACIONES */
                    distancia1= route.legs[i].distance.value;
                }

            } else {
                console.log('Ha fallado el sistema debido a ' + status);
            }
            directionsDisplay.setDirections(response);

        }
    );
}//fin de la funcion calculateAndDisplayRoute

function cargar_circulos(distancia){

    /*Marcamos un circulo cada vez que seleccionan el radio */
    var punto_actual = new google.maps.LatLng(lat_actual,log_actual);
    var r= distancia * 1000;//por mil porque tuve que cambiar los datos y para por

    var circulo_options = {
        strokeColor: "#c4c4c4",
        strokeOpacity: 0.20,
        strokeWeight: 0,
        fillOpacity: 0.20,
        map: map,
        radius: r,    // 10 miles in metres
        fillColor: '#00c4c4',
        center:punto_actual
    };

    circulo = new google.maps.Circle(circulo_options);


}
function put_markers(inicio,icon,total,datos){
    var infowindow = new google.maps.InfoWindow();
    var n_marker, i;
    /****
     Asignamos cada marker y sus windows correspondientes
     */
    for(i = inicio;i < total;i++){
        n_marker  = new google.maps.Marker({
            position: new google.maps.LatLng(datos[i].latitud,datos[i].longitud),
            icon: icon,
            map: map,
            title: datos[i].nombre
        });

        google.maps.event.addListener(n_marker, 'click', (function(n_marker, i) {
            return function() {
                infowindow.setContent(
                    datos[i].nombre +'<br/><button type="button"   id="DefinirNuevoSitio_'+datos[i].id+'" >Ver</button>'
                );
                infowindow.open(map, n_marker);

                $('#DefinirNuevoSitio_'+datos[i].id).click(function(){
                    CambiaSitioCalcula(datos[i].id);
                });

            }
        })(n_marker, i)); // <- No se muy bien como funciona esta parte
    }
}

function CambiaSitioCalcula(nueva_id){
    $('#sitio option').removeAttr('selected');
    $('#sitio option[id=sitio_'+nueva_id+']').attr('selected','selected');

    $("#ruta").click();
}

/*BUSCA LOS LUGARES MAS CERCANOS a una distancia seleccionada*/
function cargar_mas_cercanos(distancia){
    /*********Reseteamos valores********************************/
    circulo.setMap(null);
    /*No se si sea lo correcto pero con esto vuelve a cargar el mapa resetado*/
    initialize(lat_actual,log_actual);
    // Limpiamos el select, para que muestre los lugares dentro del radio solicitado.

    $("#sitio").find('option').remove();
    /*********************************************/
    cargar_circulos(distancia);
    $.ajax({
        method: "POST",
        url:'http://pruebas.neoprisma.com/ajax-app/cargar_cercanos.php',
        data: ({lat:lat_actual,log:log_actual,distancia:distancia}),
        dataType: "json",
        success: function(resp){
            var latlng = new google.maps.LatLng(lat_actual,log_actual);
            var infowindow = new google.maps.InfoWindow({
                content:'El más cercano'+ resp['cercano'].nombre +'<br/><button type="button" onClick=CambiaSitioCalcula('+resp['cercano'].id+') >Ver</button>'
            });

            /*he mandado el número de elementos del array porque por jquery no los cogía*/
            var numero = resp['numero'];
            /*Marco la distancia más cercana al punto donde estoy*/
            var latlng_nearest = new google.maps.LatLng(resp['cercano'].latitud,resp['cercano'].longitud);marker_nearest = new google.maps.Marker({
                position: latlng_nearest,
                map: map,
                title: 'la más cercana '+ resp['cercano'].nombre
            });
            marker_nearest.setIcon('http://maps.google.com/mapfiles/marker_yellow.png');
            marker_nearest.setAnimation(google.maps.Animation.BOUNCE);
            google.maps.event.addListener(marker_nearest, 'click', function() {
                infowindow.open(map,marker_nearest);

            });



            /*Marcamos en el mapa el array de sitios cercanos*/
            put_markers(1,'img/map-localization.png',numero,resp['sitios']);
            /*Rellenamos el select de acuerdo a la distancia*/
            var sel="";
            for(var i = 0;i < numero;i++){
                if(i == 0 ){ sel= 'selected = "selected"' }
                $("#sitio").append('<option '+sel+' id="sitio_'+resp['sitios'][i].id+'" value="' + resp['sitios'][i].latitud +',' + resp['sitios'][i].longitud +'">' + resp['sitios'][i].nombre+ resp['sitios'][i].id+'</option>');
            }


        },
        error: function(){
            // ocultamos el select.
            $('#sitios_cercanos').addClass('hidden');
            console.log('no hay lugares dentro del radio elegido.');
        }
    });
}//fin de la funcion cargar_mas_cercanos

/*************FUNCION QUE GUARDA POSICIONES *********************************************/

function guardarPosicion(lat_actual,log_actual){
    /*********Reseteamos valores********************************/
    //circulo.setMap(null);
    /*No se si sea lo correcto pero con esto vuelve a cargar el mapa resetado*/
    //initialize(lat_actual,log_actual);
    // Limpiamos el select, para que muestre los lugares dentro del radio solicitado.

    //	var dateCET = getDate(1); // Central European Time is GMT +1

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + "  "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    var username = localStorage.getItem('username') || '<empty>';

    var password = localStorage.getItem('password') || '<empty>';
    var token_fmc = localStorage.getItem('token') || '<empty>';
    /*if (dateCET.getHours() < 12) {

    } else {
        alert ("Good afternoon.");
    }*/


    //$("#sitio").find('option').remove();
    /*********************************************/
    //cargar_circulos(distancia);
    // var date="";
    var date_s=new Date();
    $.ajax({
        method: "POST",
        url:'http://app-connecting.prismacm.com/save_host_nube.php',
        data: ({lat:lat_actual,log:log_actual,hora:datetime,usuario:username,password:password,token_fmc:token_fmc}),
        dataType: "json",
        success: function(resp){

            if(resp.error){
                alert('res'+resp.error);
            }else{
                var datos =[];

                var last="";


                $.each(resp.datas, function(i, item) {
                    datos.push(item);
                    localStorage.setItem('horario_'+item,item.horario_entrada);


                });
                localStorage.removeItem('horarios');
                localStorage.setItem('horarios',JSON.stringify(datos));
                recargarHorarios();




            }

        },
        error: function(e){
            // ocultamos el select.
            alert('error en la conexion?'+e.message);
            $('#sitios_cercanos').addClass('hidden');
            console.log('no nos conectamos con la nube.');
        }
    });
}
function guardarPosicionAtTime(lat_actual,log_actual,direccion){
    /*********Reseteamos valores********************************/
    //circulo.setMap(null);
    /*No se si sea lo correcto pero con esto vuelve a cargar el mapa resetado*/
    //initialize(lat_actual,log_actual);
    // Limpiamos el select, para que muestre los lugares dentro del radio solicitado.

    var dateCET = getDate(1); // Central European Time is GMT +1

    /*if (dateCET.getHours() < 12) {

    } else {
        alert ("Good afternoon.");
    }*/


    //$("#sitio").find('option').remove();
    /*********************************************/
    //cargar_circulos(distancia);
    $.ajax({
        method: "POST",
        url:'http://app-connecting.prismacm.com/get_position_at_time.php',
        data: ({lat:lat_actual,log:log_actual,hora:dateCET,direccion:direccion}),
        dataType: "json",
        success: function(resp){



        },
        error: function(e){
            // ocultamos el select.
            $('#sitios_cercanos').addClass('hidden');
            //	alert('los datos no han sido guardados'+e);
            //	console.log('no nos conectamos con la nube.');
        }
    });
}
function getDate(offset){
    var now = new Date();
    var hour = 60*60*1000;
    var min = 60*1000;
    return new Date(now.getTime() + (now.getTimezoneOffset() * min) + (offset * hour));
}
function recarga_horarios(){
    recargarHorarios();
}
function recargarHorarios(){

    var horario_descargado = JSON.parse(localStorage.getItem("horarios"));

    if(horario_descargado){
        var onsList = $(document).find("#lista_horarios");
        var content = $(document).find("#horas");
        onsList.html('');
        $.each(horario_descargado, function(i, item) {
            /******************************************************/
            var elem = $('<ons-list-item modifier="tappable">'+item.horario_entrada+'</ons-list-item>');
            onsList.append(elem);
        });

    }



}

function ver_datos(){

    var username = localStorage.getItem('username') || '';
    var password = localStorage.getItem('password') || '';
    var token_guardado = localStorage.getItem('token') || '';
    if(!token_guardado){

    }
    $('#username').val(username);
    $('#password').val(password);
    $('p.token_prov').text(token_guardado);

}


function save(){
    var username = $('#username').val();

    var pass = $('#password').val();

    localStorage.setItem("username", username);

    localStorage.setItem("password", pass);
    var token_fmc = localStorage.getItem('token') || '';
    $('#username').val('');

    $('#password').val('');


    $.ajax({
        method: "POST",
        url:'http://app-connecting.prismacm.com/solo_configuracion.php',
        data: ({usuario:username,password:pass,token_fmc:token_fmc}),
        dataType: "json",
        success: function(resp){

            if(resp.error){
                ons.notification.alert(resp.error);
            }else{
                var datos =[];

                var last="";




                $.each(resp.datas, function(i, item) {
                    datos.push(item);
                    localStorage.setItem('horario_'+item,item.horario_entrada);

                });


                localStorage.removeItem('horarios');
                localStorage.setItem('horarios',JSON.stringify(datos));
                ons.notification.alert(resp.mensaje);
            }

        },
        error: function(e){
            // ocultamos el select.
            alert('error en la conexion?'+e.message);
            $('#sitios_cercanos').addClass('hidden');
            console.log('No nos conectamos con la nube.');
        }
    });



}