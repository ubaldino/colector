
$( document ).ready( function() {

	// DECLARACION DE VARIABLES
	archivo = $("input[name='archivo']").get(0);
	media_url = document.location.href+'public/media';



	// CONSTRUCCION DE FUNCIONES

	listar_archivos = function(){
		contenedor = $( "#lista_archivos" );
		contenedor.empty();
		$.getJSON( '/colector/archivos' , function( archivos ){
			archivos.forEach( function( archivo ){
				
				tipo = archivo.tipo.split('/')[0];
				tipo = ( tipo != 'image' ) ? archivo.tipo.split('/')[1] : 'image';
				if ( tipo != 'image' && tipo != 'html' && tipo != 'x-php' ) {
					contenedor.append( "<li data-tipo='"+tipo+"'>"+archivo.nombre+"</li>" );
				}
				/*
				else if ( tipo == 'image' ) {
					contenedor.append( "<li data-tipo='"+tipo+"'><a href='media/"+archivo.nombre+"' target='_blank'>"+archivo.nombre+"</a></li>" );
				}
				*/
			});

			$( "#lista_archivos li" ).bind( 'click' , function( evt ) {
				tipo = evt.target.dataset.tipo ;
				console.log( tipo );
				if ( tipo != 'image' && tipo != 'html' && tipo != 'x-php' ) {
					mostrar_archivo( evt.target );
				}
			});
		});
	}

	importar_archivo = function(){
		data = new FormData();
		data.append( 'archivo' , archivo.files[0] );
		data.append( 'tipo'      , "importar" );
		
		jQuery.ajax({
			url: '/colector/archivos',
            data: data ,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            beforeSend: function() {
                $( "#pn_logs" ).empty();
                _log = "<h2> Importing questions into course </h2><h2>Waiting for the end<h2/>";
                $( "#pn_logs" ).append( _log ); 
            },
	    	success: function(data){
	    		window.test = data ;
	    		listar_archivos();
            }
        });
	}

	mostrar_archivo = function( target ){

		//'text/plain;

		$.ajax({
			url: media_url+"/"+target.innerText,
			type: 'GET',
			dataType: 'text',
		})
		.done(function( data ) {
			$("code#texto_archivo").empty();
			$("code#texto_archivo").removeClass();
			$("code#texto_archivo").append( data ); 

			console.log( target.dataset.tipo );
			if ( target.dataset.tipo == 'plain') {
				tipo_archivo = target.innerText.match(/\.(\w+)$/)[1];
				
				switch( tipo_archivo ){
					case 'js':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.javascript ) ); 
						$("code#texto_archivo")[0].className = ' language-javascript' ;
						break;
					case 'css':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.css ) ); 
						$("code#texto_archivo")[0].className = ' language-css' ;
						break;
					case 'py':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.python ) ); 
						$("code#texto_archivo")[0].className = ' language-python' ;
						break;
					case 'styl':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.stylus ) ); 
						$("code#texto_archivo")[0].className = ' language-stylus' ;
						break;
					default:
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.wiki ) ) ;
						$("code#texto_archivo")[0].className = ' language-wiki' ;
						break
				}
			}

			Prism.highlightElement( $("code#texto_archivo")[0] );


		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		


		/*
		$.get( media_url+"/"+target.innerText , function( data ){
			
			contenedor = $("code#texto_archivo");
			contenedor.empty();
			contenedor.removeClass();
			$("code#texto_archivo").append( data ); 
			if ( target.dataset.tipo == 'plain') {
				target.dataset.tipo = target.innerText.match(/\.(\w+)$/)[1];
				
				switch( target.dataset.tipo ){
					case 'js':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.javascript ) ); 
						$("code#texto_archivo")[0].className = ' language-javascript' ;
						break;
					case 'css':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.css ) ); 
						$("code#texto_archivo")[0].className = ' language-css' ;
						break;
					case 'py':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.python ) ); 
						$("code#texto_archivo")[0].className = ' language-python' ;
						break;
					case 'styl':
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.stylus ) ); 
						$("code#texto_archivo")[0].className = ' language-stylus' ;
						break;
					default:
						$("code#texto_archivo").append( Prism.highlight( data , Prism.languages.wiki ) ) ;
						$("code#texto_archivo")[0].className = ' language-wiki' ;
						break
				}
			}

			//Prism.highlightElement( $("code#texto_archivo")[0] );
		})
			*/

		/*
		$( "code#texto_archivo" ).load( media_url+"/"+target.innerText , function( data ){

			//code.parentElement.className = 'languaje-'+target.dataset.tipo;
			//code.parentElement.dataset.language = target.dataset.tipo;
		});
		*/
		/*
		
		$.getJSON( '?obtener=archivos' , function( archivos ){
			archivos.forEach( function( archivo ){
				tipo = archivo.tipo.split('/')[1];
				contenedor.append( "<li data-tipo='"+tipo+"'>"+archivo.nombre+"</li>" );
			});
			$( "#lista_archivos li" ).bind( 'click' , function( evt ) {
				console.log( evt.target );
			});
		});
		 */
	}

	listar_archivos();



	
	// MANEJO DE EVENTOS
	$( "input[name='archivo']" ).bind( 'change', function(evt) {
		if ( archivo.files.length  > 0) {
			importar_archivo();
		}
	});

	$( "#btn_action" ).bind( 'click', function(event) {
		code = $("code")[0];
		Prism.highlightElement( code );

	});


});