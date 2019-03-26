<?php 
//var_dump($_POST['hora']);
	/* CONFIGURACIÓN */
	  require 'config_db.php';

	/* FUNCIONES */
	  require 'functions.php';

   /**CONEXION A LA BASE DE DATOS*/
	/***llegaria con su usuario y contraseña******************/
 	$datos_horarios=array();
	$usuario = (!empty($_POST['usuario']))? $_POST['usuario']:''; 

	$pass = (!empty($_POST['password']))? $_POST['password']:'';
	var_dump($pass);
	$conn = connect_db($db);
	$sql= 'SELECT * FROM usuario WHERE usuario = '.$usuario.' AND password='.$pass;
	$bd_usuarios	= save_data($conn,$sql);

	if($usuario ==  $bd_usuarios[0]['usuario'] &&  $pass == $bd_usuarios[0]['password']){

			  	$sql= 'SELECT * FROM usuarios_horarios WHERE id_usuario = '.$bd_usuarios[0]['id'];
	  			$datos_horarios=save_data($conn,$sql);
				echo json_encode($datos_horarios); 

	}else{
		$mensaje['error']="No existe o no coincide la contraseña con el usuario";
 		echo json_encode($mensaje); 
	}
	