import { Component, OnInit } from '@angular/core';
import { LoggerExtension } from './Extensiones/loggerExtension';
import { HandleSelectionExtension } from './Extensiones/extension';
import { NestedViewerExtension } from './Extensiones/nestedViewerExtension';


let urn:string= "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2FyZG9uaXYvQWNjZWxlcmF0ZV9Qb0NfRGlnVHdpbl8yMDIyMDMwMS5ud2Q=";
// let urn:string= "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2FyZG9uaXYvUFRHXzIwMjIwNTI2Lm53ZA==";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  async ngOnInit() {
    this.initViewer();

  }
  private async initViewer() {
    let documentId:string = "urn:"+urn;
    let config3d = {
      // loaderExtensions: { svf: 'Autodesk.MemoryLimited' }, // activa el limitador de memoria 
      memory: {
       limit: 2050,
       debug :{
         force:true,
        }
        /*  debug: {
          force:true,
          maxPageOutSize: 4050,                                // Max we will page out in one go
          // pixelCullingEnable: true,   // Useful with on demand loading
          // pixelCullingThreshold: true,

          occlusionThreshold: 4096,
          occlusionTestThreshold: 4096,
          startOcclusionTestingPackCount: 4096,
          testPackfileCount: 4,
          useOcclusionInstancing: true,
          automaticRefresh: true,
          boxProxyMaxCount: 2050, // show this many boxes during a render
          boxProxyMinScreen: 10 // if entire render batch is >= 1/10 of the scr
        }*/
      },
/*       disabledExtensions: { //deshabilita extensiones predeterminadas
        measure:true, //medir
        //  viewcube:true, //nada
        // layermanage:true, //nada
        explode:true, // separar
        section:true, //seccion analicis
        //  hyperlink:true, //nada
        bimwalk:true, //primera persona
        // fusionOrbit:true,
      }, */

      theme:'dark-theme',
    
      extensions: [LoggerExtension.extensionName, HandleSelectionExtension.name, NestedViewerExtension.name,  ], // ejempplo para llamar la extensiones funcionales 
 
    }
    const options = {
      env: 'AutodeskProduction',

      getAccessToken: (
        onGetAccessToken: (token: string, expire: number) => void
       ) => {

         fetch('https://api.modelo3d.reliabytics.com/api/forge/oauth/token')
         .then((response) => response.json())
         .then((json) => {
           console.log(json);

           onGetAccessToken(json.access_token,
             json.expires_in);


           });

         }
       };


      const viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer')!,config3d);

      Autodesk.Viewing.Initializer(options, function() {

           viewer.start();
      //   if (startedCode > 0) {
      //   console.error('Failed to create a Viewer: WebGL not supported.');
      //   return;
      // }

      console.log('Initialization complete, loading a model next...');

      Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
    function onDocumentLoadSuccess(viewerDocument:any) {
      // viewerDocument is an instance of Autodesk.Viewing.Document
      var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
 
       // var viewables = viewerDocument.getRoot().search({'type':'geometry'}); // otra forma 

       //viewer.setLightPreset(0); //Establece los ajustes preestablecidos de luz (entornos) para el visor.
       //viewer.setLightPreset(9);
       // viewer.setQualityLevel( /* ambient shadows */ false, /* antialiasing */ true); //Habilita o deshabilita la configuración de renderizado de alta calidad.
       // viewer.setGroundShadow(false); //Alterna la sombra del suelo.
       // viewer.setGroundReflection(false); //Alterna la reflexión del suelo.
       //viewer.setGhosting(true); //Indica si la imagen fantasma está activada o desactivada.
       //viewer.setEnvMapBackground(false); //	Indica si el mapa del entorno para el fondo está activado o desactivado.
       //viewer.setSelectionColor(new THREE.Color(0xEBB30B),1);// asigna un color al hacer click
       viewer.setSelectionColor(new THREE.Color(0xFF0000),3);
       // viewer.loadExtension('Autodesk.DocumentBrowser');//carga una extension
      // viewer.activateDefaultNavigationTools(false);
       // viewer.loadExtension('Autodesk.Viewing.ZoomWindow');

       /////////
       //arreglo permite recorrer un array de ids
       //
       /////////
 // function arreglo (num:any) {

   //  let ids=[]

   //   for (let i=1 ; i<num ; i ++){
     //       ids.push(i);
     //    }

     //  return ids
//  }
// let ids=  arreglo(2);
// console.log(arreglo(7));



      const option3d = {
        // ids:[334183, 334184, 690690, 690715] // ids de las partes del modelo que se desean cargar
      }
      viewer.loadDocumentNode(viewerDocument, defaultModel,option3d);
    }

    function onDocumentLoadFailure() {
      console.error('Failed fetching Forge manifest');
    }
  }

}
