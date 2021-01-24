import { Config } from "@bentley/bentleyjs-core";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { SavedView, SavedViewProps, UiFramework } from "@bentley/ui-framework";
import SVTRpcInterface from "../../common/SVTRpcInterface";

export async function TestSerializationView() {
  const vp = IModelApp.viewManager.selectedView!.view;
  const viewProp = SavedView.viewStateToProps(vp);
  const strViewProp = JSON.stringify(viewProp);
  const savedViewFilePath = Config.App.get("imjs_savedview_file");
  await SVTRpcInterface.getClient().writeExternalSavedViews(
    savedViewFilePath,
    strViewProp
  );
}
export async function TestDeSerializationView() {
  const savedViewFilePath = Config.App.get("imjs_savedview_file");
  const strViewProp = await SVTRpcInterface.getClient().readExternalSavedViews(
    savedViewFilePath
  );
  if (strViewProp === "") {
    return;
  }
  const vp = IModelApp.viewManager.selectedView!;
  const viewProp: SavedViewProps = JSON.parse(strViewProp);
  const imodel = UiFramework.getIModelConnection()!;
  const viewState = await SavedView.viewStateFromProps(imodel, viewProp);
  if (viewState) {
    vp.changeView(viewState);
  }
}
