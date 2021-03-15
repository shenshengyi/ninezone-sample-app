/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelApp,
  IModelConnection,
  ViewState,
} from "@bentley/imodeljs-frontend";
import { Presentation } from "@bentley/presentation-frontend/lib/presentation-frontend/Presentation";
import {
  BackstageManager,
  CommandItemDef,
  ConfigurableUiManager,
  ContentLayoutProps,
  FrontstageManager,
  SyncUiEventDispatcher,
  UiFramework,
} from "@bentley/ui-framework";
import { testEvent } from "../feature/ContentTest";
import { TestDeSerializationView } from "../feature/SavedView";
import { NBAFrontstage } from "./frontstages/NBAFrontstage";
import { SampleFrontstage } from "./frontstages/SampleFrontstage";
import { SampleFrontstage2 } from "./frontstages/SampleFrontstage2";
import { TestUIFrontstage } from "./frontstages/TestUIFrontstage";

/**
 * Example Ui Configuration for an iModel.js App
 */
export class AppUi {
  // Initialize the ConfigurableUiManager
  public static async initialize() {
    // initialize UiFramework
    await UiFramework.initialize(undefined);

    // initialize Presentation
    await Presentation.initialize({
      activeLocale: IModelApp.i18n.languageList()[0],
    });
    Presentation.selection.selectionChange.addListener(testEvent);
    ConfigurableUiManager.initialize();
    AppUi.defineContentLayouts();
  }

  // Command that toggles the backstage
  public static get backstageToggleCommand(): CommandItemDef {
    return BackstageManager.getBackstageToggleCommand();
  }

  /** Handle when an iModel and the views have been selected  */
  public static handleIModelViewsSelected(
    iModelConnection: IModelConnection,
    viewStates: ViewState[]
  ): void {
    // Set the iModelConnection in the Redux store
    UiFramework.setIModelConnection(iModelConnection);
    UiFramework.setDefaultViewState(viewStates[0]);

    // Tell the SyncUiEventDispatcher about the iModelConnection
    SyncUiEventDispatcher.initializeConnectionEvents(iModelConnection);

    // We create a FrontStage that contains the views that we want.
    const frontstageProvider = new SampleFrontstage(viewStates);
    FrontstageManager.addFrontstageProvider(frontstageProvider);

    const nbaProvider = new NBAFrontstage(viewStates);
    FrontstageManager.addFrontstageProvider(nbaProvider);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FrontstageManager.setActiveFrontstageDef(
      frontstageProvider.frontstageDef
    ).then(() => {
      // Frontstage is ready
      TestDeSerializationView();
    });

    // We create a FrontStage that contains the views that we want.
    const frontstageProvider2 = new SampleFrontstage2(viewStates);
    FrontstageManager.addFrontstageProvider(frontstageProvider2);

    const testuiF = new TestUIFrontstage(viewStates, iModelConnection);
    FrontstageManager.addFrontstageProvider(testuiF);

    // FrontstageManager.setActiveFrontstageDef(testuiF.frontstageDef).then(() => {
    //   // Frontstage is ready
    // });
  }

  /** Define Content Layouts referenced by Frontstages.
   */
  private static defineContentLayouts() {
    const contentLayouts: ContentLayoutProps[] = AppUi.getContentLayouts();
    ConfigurableUiManager.loadContentLayouts(contentLayouts);
  }

  private static getContentLayouts(): ContentLayoutProps[] {
    const fourQuadrants: ContentLayoutProps = {
      id: "FourQuadrants",
      horizontalSplit: {
        percentage: 0.5,
        minSizeTop: 100,
        minSizeBottom: 100,
        top: {
          verticalSplit: {
            percentage: 0.5,
            left: 0,
            right: 1,
            minSizeLeft: 100,
            minSizeRight: 100,
          },
        },
        bottom: {
          verticalSplit: {
            percentage: 0.5,
            left: 2,
            right: 3,
            minSizeLeft: 100,
            minSizeRight: 100,
          },
        },
      },
    };

    const twoHalvesVertical: ContentLayoutProps = {
      id: "TwoHalvesVertical",
      verticalSplit: {
        percentage: 0.5,
        left: 0,
        right: 1,
        minSizeLeft: 100,
        minSizeRight: 100,
      },
    };

    const twoHalvesHorizontal: ContentLayoutProps = {
      id: "TwoHalvesHorizontal",
      horizontalSplit: {
        percentage: 0.5,
        top: 0,
        bottom: 1,
        minSizeTop: 100,
        minSizeBottom: 100,
      },
    };

    const singleContent: ContentLayoutProps = {
      id: "SingleContent",
    };

    const threeRightStacked: ContentLayoutProps = {
      // Three Views, one on the left, two stacked on the right.
      id: "ThreeRightStacked",
      verticalSplit: {
        id: "ThreeRightStacked.MainVertical",
        percentage: 0.5,
        minSizeLeft: 100,
        minSizeRight: 100,
        left: 0,
        right: {
          horizontalSplit: {
            percentage: 0.5,
            top: 1,
            bottom: 2,
            minSizeTop: 100,
            minSizeBottom: 100,
          },
        },
      },
    };

    const contentLayouts: ContentLayoutProps[] = [];
    // in order to pick out by number of views for convenience.
    contentLayouts.push(
      singleContent,
      twoHalvesVertical,
      threeRightStacked,
      fourQuadrants,
      singleContent,
      twoHalvesHorizontal
    );
    return contentLayouts;
  }
}
