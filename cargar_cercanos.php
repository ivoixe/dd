<?php 
	/* CONFIGURACIÓN */
	  require 'config_db.php';

	/* FUNCIONES */
	  require 'functions.php';

	
	  
/************************************************************/
/*************** INICIO DEL SCRIPT AJAX *********************/
/************************************************************/
 /* Se supone que con este foreach cogere solo los que esten dentro del radio:
	DEJO ESTO PARA UNA FUTURA CONSULTA EN LA BASE DE DATOS 
	http://www.michael-pratt.com/blog/7/Encontrar-Lugares-cercanos-con-MySQL-y-PHP/
*/
 $latitud_actual=$_POST['lat'];
 $longitud_actual=$_POST['log'];
 $distancia_n=$_POST['distancia']*1;//esta en metros

	/**CONEXION A LA BASE DE DATOS*/
	
	$conn = connect_db($db);
	/*QUERY CON  La Formula de Haversine */
	$select= 'SELECT id, nombre,latitud,longitud, ( 6371 * ACOS( 
                                 COS( RADIANS( '.$latitud_actual.') ) 
                                 * COS(RADIANS( latitud ) ) 
                                 * COS(RADIANS( longitud ) 
                                 - RADIANS('.$longitud_actual.') ) 
                                 + SIN( RADIANS('.$latitud_actual.') ) 
                                 * SIN(RADIANS( latitud ) ) 
                                )
							   ) AS distance 
			FROM direcciones_puntos_venta 
			HAVING distance < '.$distancia_n.' 
			ORDER BY distance ASC';
	$datos = make_query($conn,$select);

/*al estar ordenadas de forma asc la primera es la mas cercana*/


	$lugares_dentro_radio['sitios'] = $datos;
	$cercano= reset($datos);

	$lugares_dentro_radio['cercano']=$cercano;
	
	$lugares_dentro_radio['numero']= count($datos);
	

	
	
/**********************************************************/


 echo json_encode( $lugares_dentro_radio);  
 /*esta funcion vale para cuando no estamos trabajando con la base de datos, no directamente..*/
	/*function sitios_dentro_de_radio($sitios ,$lat_actual,$lon_actual,$radio){
		$earth = 6371 ; //Kilometros
		$km = 111.302;
		$degtorad = 0.01745329;
		//1 Radian = 57.29577951 Grados
		$radtodeg = 57.29577951; 
		
		$lugares_dentro_radio=array();
		if(!empty($sitios)){
			foreach($sitios as $k => $destino){
					 //Point 1 cords
					//Point 2 cords
					$destino_lat =$destino['lat'];
					$destino_lon= $destino['lon'];
					//Haversine Formula
					$dlong=$destino_lon-$lon_actual;
					$dlat=$destino_lat-$lat_actual;	 
					$dvalue = (sin($lat_actual * $degtorad) * sin($destino_lat * $degtorad)) + (cos($lat_actual  * $degtorad) * cos($destino_lat * $degtorad) * cos($dlong * $degtorad)); 
					$dd = acos($dvalue) * $radtodeg; 
					$distancia = round(($dd * $km), 2) *1000;
					
					if(!isset($dist_menor)){
						 $dist_menor = $distancia;
					}
					if($distancia <= $dist_menor ){
						$dist_menor = $distancia;
						$lugares_dentro_radio['cercano']= $sitios[$k];
					}
					 
					/*guardamos los que estan dentro del radio*/
				/*	if($distancia <= $radio ){
						
						$lugares_dentro_radio['sitios'][]= $sitios[$k];	
					}
					

				}
		}
			
			$lugares_dentro_radio['numero']= count($lugares_dentro_radio['sitios']);
			
			return $lugares_dentro_radio ;
	}*/

 //TEMPORAL PARA PRUEBAS/*
 /*$direcciones= array(
   '0' => array(
		'nombre'=> 'BRETXA',
		'lat' => 43.323128,
		'lon' =>  -1.982442
	   ),
	'1' => array(
		'nombre'=> 'EROSKI GROS',
		'lat' =>  43.323089,
		'lon' =>  -1.972229
	
	   ),
	'2' => array(
		'nombre'=> 'Mercado san Martin',
		'lat' => 43.318112, 
		'lon' =>  -1.983197
	   )		   
 );
 
 
  $res = sitios_dentro_de_radio($direcciones,$latitud_actual,$longitud_actual,$distancia_n);

 
 echo json_encode($res);
 */
?>