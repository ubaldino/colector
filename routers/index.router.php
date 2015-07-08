<?php

/*  CURL
	curl -L localhost/colector/archivos
	curl -LF "archivo=@path_al_file_a_subir" localhost/colector/archivos
*/

$app->add(new Slim\Middleware\SessionCookie());

define( 'DS' , DIRECTORY_SEPARATOR );
define( 'MEDIA_DIR' ,  dirname(__FILE__) . DS .'..'. DS . 'public'. DS .'media'  );
define( 'PASSWORD' ,  'asdf'  );

$authenticateForRole = function ( $role = 'member' ) {
    return function () use ( $role ) {
        $app = \Slim\Slim::getInstance();
        if ( ! $app->getCookie( 'session' ) ) {
            //$app->flash('error', 'Login required');
            $app->redirect('/colector/auth');
        }
    };
};

// GET index route
$app->get('/colector/', $authenticateForRole('admin') , function () use ($app) {
    //$oStuff = new models\Stuff();
    //$hello = $oStuff->setStuff();
    $app->render('index.html', array('hello' => 'sadasdas'));
});

$app->get('/colector/auth', function () use ($app) {
    $app->render('ingresar.html', array('hello' => 'sadasdas'));
	//$req->post('namec');
});


$app->post('/colector/auth', function () use ($app) {
	var_dump( $app->request->post('password') );
	$password = $app->request->post('password');
	if ( $password == PASSWORD and ! $app->getCookie('session') ){
		$app->setCookie('session', 'active' , '20 minutes' );
	}
	$app->redirect('/colector/');
});

$app->get('/colector/salir', function () use ($app) {
	$app->deleteCookie( 'session' );
	$app->redirect('/colector/auth');
});

$app->get('/colector/archivos', function () use ($app) {
    //$oStuff = new models\Stuff();
    //$hello = $oStuff->setStuff();
	$lista_archivos = array();

	if ( $archivos = opendir( MEDIA_DIR ) ) {
		while (false !== ($archivo = readdir($archivos))) {
			if ($archivo != "." && $archivo != ".."){
				$finfo = finfo_open(FILEINFO_MIME_TYPE);
				$tipo = finfo_file( $finfo , MEDIA_DIR . DS . $archivo );
				finfo_close( $finfo );
				//$tipo = mime_content_type( MEDIA_DIR . DS . $archivo );
				$_archivo = new stdClass;
				$_archivo->nombre = $archivo;
				$_archivo->tipo = $tipo;
				array_push( $lista_archivos , $_archivo );
			}
		}
		closedir($archivos);
	}
	echo json_encode( $lista_archivos , JSON_PRETTY_PRINT ) ;
	return ;
});


$app->post('/colector/archivos', function () use ($app) {
	//$req->post('namec');
	echo json_encode( $_FILES , JSON_PRETTY_PRINT );

	if ( isset( $_FILES["archivo"] ) ) {
		$tmp_name = $_FILES["archivo"]["tmp_name"];
		$nombre = $_FILES["archivo"]["name"];
		echo $nombre;
		move_uploaded_file($tmp_name , MEDIA_DIR .DS ."{$nombre}");
	}
	return;
});

$app->get('/colector/archivos/descargar/:nombre', function ( $nombre ) use ($app) {

	$file = MEDIA_DIR . DS . "{$nombre}"; //file location 
	header( 'Content-Type: application/octet-stream' );
	header( 'Content-Disposition: attachment; filename="'.basename($file).'"' );
	header( 'Content-Length: ' . filesize( $file ) );
	readfile( $file );
});


