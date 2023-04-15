import { BaseExtension } from './BaseExtension';
import { SummaryPanel } from './SummaryPanel';

const SUMMARY_PROPS = ['Length', 'Area', 'Volume', 'Density', 'Mass', 'Price'];

export  class SummaryExtension extends BaseExtension {

  public static extensionName: string = 'SummaryExtension';
  _panel: any;
    constructor(viewer: Autodesk.Viewing.GuiViewer3D, options: any) {
        super(viewer, options);
        //this.button = null;
        this._panel = null;

    }

    override load() {
        super.load();
        console.log('SummaryExtension loaded.');
        return true;
    }

    override unload() {
        super.unload();
        if (this.button) {
          this.removeToolbarButton(this.button);
          this.button = null;
      }
      if (this._panel) {
        this._panel.setVisible(false);
        this._panel.uninitialize();
        this._panel = null;
    }
        console.log('SummaryExtension unloaded.');
        return true;
    }
    override onToolbarCreated() {
      this._panel = new SummaryPanel(this, 'model-summary-panel', 'Model Summary');
      this.button = this.createToolbarButton('summary-button', 'https://img.icons8.com/small/32/brief.png', 'Show Model Summary');
      this.button.onClick = () => {
          this._panel.setVisible(!this._panel.isVisible());
          this.button.setState(this._panel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
          if (this._panel.isVisible()) {
              this.update();
          }
      };
  }

    override onModelLoaded(model: any) {
        super.onModelLoaded(model);
        this.update();
    }

    override onSelectionChanged(model: any, dbids: number) {
        super.onSelectionChanged(model, dbids);
        this.update();
    }

    override onIsolationChanged(model: any, dbids: number) {
        super.onIsolationChanged(model, dbids);
        this.update();
    }

    async update() {
      if (this._panel) {
        const selectedIds = this.viewer.getSelection();
        const isolatedIds = this.viewer.getIsolatedNodes();
        if (selectedIds.length > 0) { // If any nodes are selected, compute the aggregates for them
            this._panel.update(this.viewer.model, selectedIds, SUMMARY_PROPS);
        } else if (isolatedIds.length > 0) { // Or, if any nodes are isolated, compute the aggregates for those
            this._panel.update(this.viewer.model, isolatedIds, SUMMARY_PROPS);
        } else { // Otherwise compute the aggregates for all nodes
            const dbids = await this.findLeafNodes(this.viewer.model);
            this._panel.update(this.viewer.model, dbids, SUMMARY_PROPS);
        }
    }

    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('SummaryExtension', SummaryExtension);
