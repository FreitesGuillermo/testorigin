
export class MyAwesomeExtension extends Autodesk.Viewing.Extension {
  _group: any;
  _button: any;
  public static extensionName: string = 'MyAwesomeExtension';

  override load() {
      console.log('MyAwesomeExtensions has been loaded');
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
      console.log('MyAwesomeExtensions has been unloaded');
      return true;
  }

  override onToolbarCreated() {
      // Create a new toolbar group if it doesn't exist
      this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
      if (!this._group) {
          this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
          this.viewer.toolbar.addControl(this._group);
      }

      // Add a new button to the toolbar group
      this._button = new Autodesk.Viewing.UI.Button('myAwesomeExtensionButton');
      this._button.onClick = (ev: any) => {
       console.log("PRIMERA EXTENSION ")
      };
      this._button.setToolTip('My Awesome Extension');
      this._button.addClass('myAwesomeExtensionIcon');
      this._group.addControl(this._button);
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);
