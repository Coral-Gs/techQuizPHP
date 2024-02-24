<?php
header("Content-Type: application/json; charset=UTF-8");

//Datos de conexión
$servidor = '127.0.0.1';
$db = 'techquiz';
$usuario = 'root';
$pass = '';

try {
    //Creo un nuevo objeto de conexión PDO y los datos de conexión necesario para acceder a mi base de datos
    $conexion = new PDO('mysql:host=' . $servidor . ';dbname=' . $db, $usuario, $pass);
    //Le indico con el atributo ATTR_ERRMODE que si hay algún error en la conexión 
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //Creo sentencia SQL que solicita todos los registros ordenados por score de mayor a menor
    $sql = 'SELECT * FROM user ORDER BY score DESC';

    //Preparo la consulta, uno parámetros y ejecuto
    $consulta = $conexion->prepare($sql);
    //Uno parámetros
    //$consulta->bindParam(':pais', $pais);
    $consulta->execute();
    //Retorna la imagen del producto
    $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($resultados);

    //Capturo la excepción en caso de error y muestro el mensaje que me lanza
} catch (PDOException $error) {
    echo 'Error: ' . $error->getMessage();
} finally {
    //Cierro la conexión
    $conexion = null;
}
