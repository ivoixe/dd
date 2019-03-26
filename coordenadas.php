<?php 
 $latitud_actual=$_POST['lat'];
 $longitud_actual=$_POST['log'];
 $longitud_actual = $longitud_actual*1;
 $latitud_actual = $latitud_actual*1;
 //Earth’s radius, sphere
  $r=6378137;
  //offsets in meters
 $dn = 100;
 $de = 100;
  $pi=3.1415926535898 ;
  //Coordinate offsets in radians
 $dLat = $dn/$r;
 $dLon = $de/($r*cos($pi*$latitud_actual/180));

 //OffsetPosition, decimal degrees
 $res['minlat'] = $latitud_actual - $dLat * 180/$pi;
 $res['min-lon'] = $longitud_actual - $dLon * 180/$pi ;
 $res['lat'] = $latitud_actual + $dLat * 180/$pi;
 $res['lon'] = $longitud_actual + $dLon * 180/$pi ;

 $res['lat1']['lat'] = $latitud_actual + $dLat * 180/$pi;
 $res['lat1']['lon'] = $longitud_actual + $dLat * 180/$pi;
 
 $res['lat2']['lat'] = $latitud_actual - $dLat * 180/$pi;
 $res['lat2']['lon'] = $longitud_actual - $dLat * 180/$pi;
 
 $res['lat3']['lat'] = $latitud_actual + $dLat * 180/$pi;
 $res['lat3']['lon'] = $longitud_actual - $dLat * 180/$pi;
 
 $res['lat4']['lat'] = $latitud_actual - $dLat * 180/$pi;
 $res['lat4']['lon'] = $longitud_actual + $dLat * 180/$pi;
 
 $res['lat5']['lat'] = $latitud_actual + $dLat * 180/$pi;
 $res['lat5']['lon'] = $longitud_actual;
 
 $res['lat6']['lat'] = $latitud_actual - $dLat * 180/$pi;
 $res['lat6']['lon'] = $longitud_actual;
 
 $res['lat7']['lat'] = $latitud_actual;
 $res['lat7']['lon'] = $longitud_actual - $dLat * 180/$pi;
 
 $res['lat8']['lat'] = $latitud_actual;
 $res['lat8']['lon'] = $longitud_actual + $dLat * 180/$pi;
 

   echo json_encode($res);
?>