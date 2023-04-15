/* global THREE */
export class BaseExtension extends Autodesk.Viewing.Extension {
  _onObjectTreeCreated: (ev: any) => void;
  _onSelectionChanged: (ev: any) => void;
  _onIsolationChanged: (ev: any) => void;
  group: any;
  button: any;
  constructor(viewer: Autodesk.Viewing.GuiViewer3D, options: any) {
      super(viewer, options);
      this.group=null;
      this.button=null;
      this._onObjectTreeCreated = (ev) => this.onModelLoaded(ev.model);
      this._onSelectionChanged = (ev) => this.onSelectionChanged(ev.model, ev.dbIdArray);
      this._onIsolationChanged = (ev) => this.onIsolationChanged(ev.model, ev.nodeIdArray);
  }

  override load() {
      this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this._onObjectTreeCreated);
      this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this._onSelectionChanged);
      this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this._onIsolationChanged);
      return true;
  }

  override unload() {
      this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this._onObjectTreeCreated);
      this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this._onSelectionChanged);
      this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this._onIsolationChanged);
      return true;
  }

  onModelLoaded(model: any) {}

  onSelectionChanged(model: any, dbids: any) {}

  onIsolationChanged(model: any, dbids: any) {}

  findLeafNodes(model:any) {
    return new Promise(function (resolve, reject) {
        model.getObjectTree(function (tree:any) {
            let leaves = new Array();
            tree.enumNodeChildren(tree.getRootId(), function (dbid:number) {
                if (tree.getChildCount(dbid) === 0) {
                    leaves.push(dbid);
                }
            }, true /* recursively enumerate children's children as well */);
            resolve(leaves);
        }, reject);
    });
}

async findPropertyNames(model:any) {
    const dbids = await this.findLeafNodes(model);
    return new Promise(function (resolve, reject) {
        model.getBulkProperties(dbids, {}, function (results: any) {
            let propNames = new Set();
            for (const result of results) {
                for (const prop of result.properties) {
                    propNames.add(prop.displayName);
                }
            }
            resolve(Array.from(propNames.values()));
        }, reject);
    });
}

    createToolbarButton(buttonId: any, buttonIconUrl: any, buttonTooltip: any) {
        this.group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        if (!this.group) {
            this.group = new Autodesk.Viewing.UI.ControlGroup('dashboard-toolbar-group');
            this.viewer.toolbar.addControl(this.group);
        }
        const button = new Autodesk.Viewing.UI.Button(buttonId);
        button.setToolTip(buttonTooltip);
        this.group.addControl(button);
        const icon = this.button.container.querySelector('.adsk-button-icon');
        if (icon) {
            icon.style.backgroundImage = `url(${buttonIconUrl})`;
            icon.style.backgroundSize = `24px`;
            icon.style.backgroundRepeat = `no-repeat`;
            icon.style.backgroundPosition = `center`;
        }
        return this.button;
    }

    removeToolbarButton(button: any) {
        this.group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        this.group.removeControl(button);
    }

}
