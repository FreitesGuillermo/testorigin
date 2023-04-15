import { BaseExtension } from './BaseExtension';

export class LoggerExtension extends BaseExtension {

  public static extensionName: string = 'LoggerExtension';

    override load() {
        super.load();
        console.log('LoggerExtension loaded.');
        return true;
    }

    override unload() {
        super.unload();
        console.log('LoggerExtension unloaded.');
        return true;
    }

    override async onModelLoaded(model:any) {
        super.onModelLoaded(model);
        const props = await this.findPropertyNames(this.viewer.model);
        console.log('New model has been loaded. Its objects contain the following properties:', props);
    }

    override async onSelectionChanged(model:any, dbids:number) {
        super.onSelectionChanged(model, dbids);
        console.log('Selection has changed', dbids);
    }

    override onIsolationChanged(model: any, dbids: number) {
        super.onIsolationChanged(model, dbids);
        console.log('Isolation has changed', dbids);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('LoggerExtension', LoggerExtension);
