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
$token = (!empty($_POST['token_fmc']) )? $_POST['token_fmc']:'' ;

$mensaje=array();
$mensaje['error']= "sin nada";
if(!empty($bd_usuarios) && !empty($token)){
    if($usuario ==  $bd_usuarios[0]['usuario'] &&  $pass == $bd_usuarios[0]['password']){
        $sql= 'UPDATE usuario  SET token="'.$token.'" where  id='.$bd_usuarios[0]['id'];
        save_data($conn,$sql);
        //descargamos los datos en la app para que los guarde en el movil
        $sql= 'SELECT * FROM usuario_horarios WHERE id_usuario= "'.$bd_usuarios[0]['id'].'" ORDER BY horario_entrada ASC';
        $mensaje['mensaje']="Ya estas registrado para recibir notificaciones";



    }else{
        $mensaje['error']="Tu clave o usuario no son correctos";
    }
}else{
    $mensaje['error']="No hay datos con tu usuario y contraseña o no has recibido confirmación automatica del servidor";
}
echo json_encode($mensaje);


?>