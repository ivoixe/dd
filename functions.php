<?php 
  function pr($v){
	echo '<pre>Count: '.count($v).' ';
	print_r($v);
	echo '</pre>';
  }
  
  
  function connect_db($data){
	$conn = NULL;
	
	try {
		$conn = new PDO("mysql:host=".$data['servername'].";dbname=".$data['dbname'], $data['username'], $data['password']);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}catch(PDOException $e)
	{
		echo "Connection failed: " . $e->getMessage();
		die();
	}
	return $conn;
  }
  
  
  function make_query($conn,$sql = 'SELECT * FROM direcciones_puntos_venta'){
	$datos = array();
	$stmt = $conn->prepare($sql); 
	$stmt->execute();

	// set the resulting array to associative
	$result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 
	$r =$stmt->fetchAll();
	
	if(!empty($r))foreach($r as $line){
		if(!empty($line['nombre']))$line['nombre'] = utf8_encode($line['nombre']);
		$datos[] = $line;
	}
	
	return $datos;
  }
   function save_data($conn,$sql = 'SELECT * FROM direcciones_puntos_venta'){
	$datos = array();
	$stmt = $conn->prepare($sql); 
	$stmt->execute();

	
  }
  
