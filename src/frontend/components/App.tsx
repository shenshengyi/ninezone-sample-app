/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// make sure webfont brings in the icons and css files.
import { Config } from "@bentley/bentleyjs-core";
import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import {
  IModelApp,
  IModelConnection,
  SnapshotConnection,
  ViewState,
} from "@bentley/imodeljs-frontend";
import { Presentation } from "@bentley/presentation-frontend";
import {
  ConfigurableUiContent,
  ThemeManager,
  UiFramework,
} from "@bentley/ui-framework";
import * as React from "react";
import { Provider } from "react-redux";
import { AppUi } from "../app-ui/AppUi";
import { AppBackstageComposer } from "../app-ui/backstage/AppBackstageComposer";
import { onSelectionChanged } from "../app-ui/widgets/TreeWidget";
import { NineZoneSampleApp } from "../app/NineZoneSampleApp";
import "./App.css";

/** React state of the App component */
export interface AppState {
  user: {
    isLoading?: boolean;
  };
  offlineIModel: boolean;
  imodel?: IModelConnection;
  viewStates?: ViewState[];
}

/** A component the renders the whole application UI */
export default class App extends React.Component<{}, AppState> {
  /** Creates an App instance */
  constructor(props?: any, context?: any) {
    super(props, context);
    this.state = {
      user: {
        isLoading: false,
      },
      offlineIModel: false,
      imodel: undefined,
      viewStates: undefined,
    };
  }

  public componentDidMount() {
    (async () => {
      this.OpenIModel();
    })();
  }
  private async OpenIModel() {
    let imodel: IModelConnection | undefined;
    try {
      // attempt to open the imodel
      {
        // const contextId = "9374a302-8743-403e-ad03-6c49ef13c15e";
        // const imodelId = "d477f96a-b21f-4e7b-9865-d6df63bb9e3b";

        // const imjs_test_context_id = "a3e76ac4-5222-4274-97f8-8fb7b60602f5";
        // const imjs_test_imodel_id = "16af800a-a81f-4a72-82cc-011b7875a3b1";

        // imodel = await RemoteBriefcaseConnection.open(
        //   imjs_test_context_id,
        //   imjs_test_imodel_id,
        //   OpenMode.ReadWrite
        // );
        //  const offlineIModel = Config.App.getString("imjs_offline_imodel");iModel2.0-MaterialTexture-Test.i.bim
        // const offlineIModel = "D://work_2021//d//h.bim";
        // const offlineIModel =
        //   "D://work_2021//d//iModel2.0-MaterialTexture-Test.i.bim";
        //  const offlineIModel = "D://3.3//d//0Y0Z.i.bim";D:\3.3\new\1\2
        // const offlineIModel = "D://3.3//b//tie.bim";
        const offlineIModel = "..//data//tie1.bim";
        imodel = await SnapshotConnection.openFile(offlineIModel);
        this._onIModelSelected(imodel);
      }
    } catch (e) {
      alert(e.message);
    }
  }

  /** Pick the first two available spatial, orthographic or drawing view definitions in the imodel */
  private async getFirstTwoViewDefinitions(
    imodel: IModelConnection
  ): Promise<ViewState[]> {
    const viewSpecs = await imodel.views.queryProps({});
    const acceptedViewClasses = [
      "BisCore:SpatialViewDefinition",
      "BisCore:DrawingViewDefinition",
      "BisCore:OrthographicViewDefinition",
    ];
    const acceptedViewSpecs = viewSpecs.filter(
      (spec) => -1 !== acceptedViewClasses.indexOf(spec.classFullName)
    );
    if (1 > acceptedViewSpecs.length)
      throw new Error("No valid view definitions in imodel");

    const viewStates: ViewState[] = [];
    for (const viewDef of acceptedViewSpecs) {
      const viewState = await imodel.views.load(viewDef.id!);
      viewStates.push(viewState);
    }

    if (1 === acceptedViewSpecs.length) {
      const viewState = await imodel.views.load(acceptedViewSpecs[0].id!);
      viewStates.push(viewState);
    }

    return viewStates;
  }

  /** Handle iModel open event */
  private _onIModelSelected = async (imodel: IModelConnection | undefined) => {
    if (!imodel) {
      // reset the state when imodel is closed
      this.setState({ imodel: undefined, viewStates: undefined });
      UiFramework.setIModelConnection(undefined);
      return;
    }
    try {
      // attempt to get ViewState for the first two available view definitions
      const viewStates = await this.getFirstTwoViewDefinitions(imodel);
      if (viewStates) {
        this.setState({ imodel, viewStates }, () => {
          AppUi.handleIModelViewsSelected(imodel, viewStates);
        });
      }
    } catch (e) {
      // if failed, close the imodel and reset the state
      await imodel.close();
      this.setState({ imodel: undefined, viewStates: undefined });
      alert(e.message);
    }
  };

  private delayedInitialization() {
    if (this.state.offlineIModel) {
      // WORKAROUND: Clear authorization client if operating in offline mode
      IModelApp.authorizationClient = undefined;
    }
  }

  /** The component's render method */
  public render() {
    let ui: React.ReactNode;
    let style: React.CSSProperties = {};

    if (!this.state.imodel || !this.state.viewStates) {
      // NOTE: We needed to delay some initialization until now so we know if we are opening a snapshot or an imodel.
      this.delayedInitialization();
      // if we don't have an imodel / view definition id - render a button that initiates imodel open
      ui = <div>正在打开imodel.....</div>;
    } else {
      // if we do have an imodel and view definition id - render imodel components
      ui = <IModelComponents />;
      style = { display: "none" };
    }

    // render the app
    return (
      <Provider store={NineZoneSampleApp.store}>
        <ThemeManager>
          <div className="App">
            <div className="Header" style={style}>
              <h2>
                {IModelApp.i18n.translate("NineZoneSample:welcome-message")}
              </h2>
            </div>
            {ui}
          </div>
        </ThemeManager>
      </Provider>
    );
  }
}

/** Renders a viewport, a tree, a property grid and a table */
class IModelComponents extends React.PureComponent {
  public render() {
    return <ConfigurableUiContent appBackstage={<AppBackstageComposer />} />;
  }
}
