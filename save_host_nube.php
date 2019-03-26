<?php
//var_dump($_POST['hora']);
	/* CONFIGURACIÓN */
	  require 'config_db.php';

	/* FUNCIONES */
	  require 'functions.php';

   /**CONEXION A LA BASE DE DATOS*/
	/***llegaria con su usuario y contraseña******************/
 	
	$usuario = (!empty($_POST['usuario']))? $_POST['usuario']:''; 
	$pass = (!empty($_POST['password']))? $_POST['password']:'';


	$conn = connect_db($db);
	$sql= 'SELECT * FROM usuario WHERE usuario = "'.$usuario.'" AND password="'.$pass.'"';
	$bd_usuarios	= make_query($conn,$sql);

	$mensaje=array();
	$mensaje['error']= "sin nada";
	if(!empty($bd_usuarios)){
		if($usuario ==  $bd_usuarios[0]['usuario'] &&  $pass == $bd_usuarios[0]['password'] && !empty($token)){

			$hora = (!empty($_POST['hora']))? $_POST['hora']:0;
			$lat = (!empty($_POST['lat']))? $_POST['lat'] : 0;
			$log = (!empty($_POST['log']))?$_POST['log'] :0;
			$latlog= $lat.','.$log;
			if(!empty($hora) && !empty($latlog) && $latlog !=0){
				  $sql= 'INSERT INTO ubicaciones (hora,latlog,usuario) VALUES ("'.$hora.'","'.$latlog.'","'.$usuario.'") ';
		  			save_data($conn,$sql);
                $sql= 'UPDATE usuario  SET token="'.$token.'" where  id='.$bd_usuarios[0]['id'];
                save_data($conn,$sql);

		  	//descargamos los datos en la app para que los guarde en el movil
				$sql= 'SELECT * FROM usuario_horarios WHERE id_usuario= "'.$bd_usuarios[0]['id'].'" ORDER BY horario_entrada ASC';
				$UsuarioHorario	= make_query($conn,$sql);
		  			if(!empty($UsuarioHorario)){
		  				$mensaje['mensaje']="Has fichado correctamente";
						unset($mensaje['error']);
		  				
		  				$mensaje['datas']=$UsuarioHorario;

		  			}else{
		  				$mensaje['error']="Aún no tienes horario asignado";
		  			}

			}else{

			 $mensaje['error']= "usuarios bien localizacion u hora mal".$lat.$latlog;
			
			}

		}else{
			$mensaje['error']="Tu clave o usuario no son correctos";
		}
}else{
		$mensaje['error']="No hay datos con tu usuario y contraseña";
}
 		echo json_encode($mensaje); 
	

 ?>  