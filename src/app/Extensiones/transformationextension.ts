export class Edit2dExtension extends Autodesk.Viewing.Extension {
  _edit2D!: any;
  _group: any;
  public static extensionName: string = 'Edit2dExtension';
  constructor(viewer: Autodesk.Viewing.GuiViewer3D, options: any) {
    super(viewer, options);
  }

  override async load() {
    this._edit2D = await this.viewer.loadExtension('Autodesk.Edit2D');
    this._edit2D.registerDefaultTools();

    return true;
  }

  override unload() {
    this.stopTool();

    if (this._group) {
      this.viewer.toolbar.removeControl(this._group);
    }

    return true;
  }

  override onToolbarCreated() {
    // Create a new toolbar group if it doesn't exist
    this._group = this.viewer.toolbar.getControl('Edit2dExtensionsToolbar');
    if (!this._group) {
        this._group = new Autodesk.Viewing.UI.ControlGroup('Edit2dExtensionsToolbar');
        this.viewer.toolbar.addControl(this._group);
    }

    // Polygon Button
    let polygonButton = new Autodesk.Viewing.UI.Button('PolygonButton');
    polygonButton.onClick = (ev) => {
      if (polygonButton.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        this.stopTool();
      } else {
        this.startTool("polygonTool");
        polygonButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE)
      }
    };
    polygonButton.setToolTip('Draw Polygon');
    polygonButton.icon.classList.add("fas", "fa-draw-polygon");
    this._group.addControl(polygonButton);

    // Edit Button
    let editButton = new Autodesk.Viewing.UI.Button('EditButton');
    editButton.onClick = (ev) => {
      if (editButton.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        this.stopTool();
      } else {
        this.startTool("polygonEditTool");
        editButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE)
      }
    };
    editButton.setToolTip('Edit Polygon');
    editButton.icon.classList.add("fas", "fa-edit");
    this._group.addControl(editButton);

    // Move Button
    let moveButton = new Autodesk.Viewing.UI.Button('MoveButton');
    moveButton.onClick = (ev) => {
      if (moveButton.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        this.stopTool();
      } else {
        this.startTool("moveTool");
        moveButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE)
      }
    };
    moveButton.setToolTip('Move Polygon');
    moveButton.icon.classList.add("fas", "fa-arrows-alt");
    this._group.addControl(moveButton);
  }

  startTool(toolName: string) {
    this.stopTool();

    let controller = this.viewer.toolController;
    controller.activateTool(this._edit2D.defaultTools[toolName].getName());
  }

  stopTool() {
    for (let button of this._group._controls) {
      button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    }

    let activeTool = this.viewer.toolController.getActiveTool();
    var isEdit2DTool = activeTool && activeTool.getName().startsWith("Edit2");
    if (isEdit2DTool) {
      //activeTool.selection?.clear();
      this.viewer.toolController.deactivateTool(activeTool.getName());
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension('Edit2dExtension', Edit2dExtension);
