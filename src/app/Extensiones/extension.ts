
export class HandleSelectionExtension extends Autodesk.Viewing.Extension {
  _group: any;
  _button: any;
  _button1:any;
  _button2:any

  public static extensionName: string = 'HandleSelectionExtension';

  constructor(viewer: Autodesk.Viewing.GuiViewer3D, options: any) {
    super(viewer, options);
    this._group = null;
    this._button = null;
    this._button1=null;
    this._button2=null;
  }
  override load() {
      console.log('HandleSelectionExtension has been loaded');
      return true;
    }

    override unload() {
      // Clean our UI elements if we added any
      if (this._group) {
        this._group.removeControl(this._button);
        if (this._group.getNumberOfControls() === 0) {
          this.viewer.toolbar.removeControl(this._group);
        }
      }
      console.log('HandleSelectionExtension has been unloaded');
      return true;
    }
    ////////////////
    // creando una barra paara los botrotnes
    //
    ///////////////
    override onToolbarCreated() {
      this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
      // if (!this._group) {
        // crea una nueva barra reciebe un string unico
        this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
        this.viewer.toolbar.addControl(this._group);
        //}

        // Add a new button to the toolbar group

        /////////////////////////
        // creando un boton
        //
        //////////////////////////
        this._button = new Autodesk.Viewing.UI.Button('handleSelectionExtensionButton');
        // recibe un string unico para nombrar al botton
        this._button.onClick = (ev: any) => {
          console.log("SEGUNDA EXTENCION")
          // Get current selection
          const selection = this.viewer.getSelection();
          this.viewer.clearSelection();
          console.log(selection)
          // Anything selected?
          if (selection.length > 0)   {
            let isolated = new Array();


            // Iterate through the list of selected dbIds
            selection.forEach((dbId) => {
              // Get properties of each dbId
              //  this.viewer.model.getBulkProperties(dbId,);

              this.viewer.getProperties(dbId, (props) => {
                // Output properties to console

              // Ask if want to isolate

              //   console.log(props.properties[8].displayValue);
              console.log(props);

              // isolated.push(dbId);
              // this.viewer.isolate(isolated);
              // this.viewer.select(dbId);

              // const pintar=[9159,8908]
              // for (let i=0;i<pintar.length;i++){
                //     dbId=pintar[i];


                this.viewer.setThemingColor(dbId, new THREE.Vector4(250, 15, 255, 0.1));

                // }

                //this.viewer.fitToView([dbId]);

              });
            });
          } else {
            // If nothing selected, restore
            this.viewer.isolate(0);
          }
        };
        // se define la tarea a realiazar al hacer click
        this._button.setToolTip('Handle Selection Extension');
        // describe el nombre que va tener el boton
        this._button.addClass('handleSelectionExtensionIcon');
        // usando ::ng-deep .nombreDeClase le da esrilos al bototn
        this._group.addControl(this._button);
        // añade el btoton  a la barra creada


        ///////////////////////////////////////////////////////////////////////
        this._button1 = new Autodesk.Viewing.UI.Button('handleSelectionExtension');
        this._button1.onClick = (ev: any) => {
          console.log("SEGUNDA EXTENCION2.0")
          const selection = this.viewer.getSelection();
          this.viewer.clearSelection();
          console.log(selection)
          // Anything selected?
          if (selection.length > 0)   {
            let isolated = new Array();


            // Iterate through the list of selected dbIds
            selection.forEach((dbId) => {
              // Get properties of each dbId
              //  this.viewer.model.getBulkProperties(dbId,);

              this.viewer.getProperties(dbId, (props) => {
                // Output properties to console

              // Ask if want to isolate

           //   console.log(props.properties[8].displayValue);
           console.log(props);

              isolated.push(dbId);
              this.viewer.isolate(isolated);
              this.viewer.select(dbId);

              // const pintar=[9159,8908]
              // for (let i=0;i<pintar.length;i++){
                //     dbId=pintar[i];


                // this.viewer.setThemingColor(dbId, new THREE.Vector4(250, 15, 255, 0.1));

                // }

                //this.viewer.fitToView([dbId]);

              });
            });
                } else {
                 // If nothing selected, restore
                 this.viewer.isolate(0);
                }
              };
              this._button1.setToolTip('Handle Selection');
              this._button1.addClass('handleSelectionExtensionIcon');
              this._group.addControl(this._button1);


              ///////////////////////////////////////////////////////////////////////
              this._button2 = new Autodesk.Viewing.UI.Button('work');
              this._button2.onClick = (ev: any) => {
                let num :number ;
                console.log("Colorear AREA")
                const selection = this.viewer.getSelection();
                this.viewer.clearSelection();
                num=selection[0];
                console.log(selection)
                function getLeafNodes( viewer: { getData: () => { (): any; new(): any; instanceTree: any; }; }, dbIds: number[] ) {

                  return new Promise( ( resolve, reject ) => {

             try {

               const instanceTree = viewer.getData().instanceTree

               dbIds = dbIds || instanceTree.getRootId();

              const dbIdArray = Array.isArray( dbIds ) ? dbIds : [dbIds]
              let leafIds:any = [];

              const getLeafNodesRec = ( id: any ) => {
                let childCount = 0;

                instanceTree.enumNodeChildren( id, ( childId: any ) => {
                  getLeafNodesRec( childId );

                  ++childCount;
                })

                if( childCount == 0 ) {
                  leafIds.push( id );
                }
              }

              for( let i = 0; i < dbIdArray.length; ++i ) {
                getLeafNodesRec( dbIdArray[i] );
                console.log(instanceTree);
              }

              return resolve( leafIds );

            } catch (ex) {

              return reject(ex)
            }
          })
        }
        const color = new THREE.Vector4( 255/255, 0, 0, 1 );



        getLeafNodes( this.viewer.model, [num] )
        .then( ( leafNodes:any ) => {

          // Call setThemingColor for every leaf node.
          for( let i = 0; i < leafNodes.length; i++ ) {
          this.viewer.setThemingColor( leafNodes[i], color );
        }

      })
      .catch( ( error ) => console.warn( error ) );


    };
    this._button2.setToolTip('Handle Selection');
    this._button2.addClass('handleSelection');
    this._group.addControl(this._button2);
  }
  }


Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);
