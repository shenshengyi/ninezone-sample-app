/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
import { IModelApp, IModelAppOptions } from "@bentley/imodeljs-frontend";
import {
  ActionsUnion,
  AppNotificationManager,
  createAction,
  DeepReadonly,
  FrameworkReducer,
  FrameworkRootState,
  StateManager,
  UiFramework,
} from "@bentley/ui-framework";
import { initRpc } from "../api/rpc";
import { Store } from "redux";
import { WalkRoundTool } from "../feature/WalkRound";
import { ITwinWebAccuSnap } from "./ITwinWebAccuSnap";
import { SelectElement } from "../feature/feature";
import { AppUiSettings } from "./AppUiSettings";
import { UiSettings } from "@bentley/ui-core";
export interface SampleAppState {
  testProperty: string;
  animationViewId: string;
  dragInteraction: boolean;
  frameworkVersion: string;
  isIModelLocal: boolean;
}
export const initialState: SampleAppState = {
  testProperty: "",
  animationViewId: "",
  dragInteraction: true,
  frameworkVersion: "1",
  isIModelLocal: false,
};
// export type RootState = FrameworkRootState;
export interface RootState extends FrameworkRootState {
  sampleAppState: SampleAppState;
}

/**
 * List of possible backends that ninezone-sample-app can use
 */
export enum UseBackend {
  /** Use local ninezone-sample-app backend */
  Local = 0,

  /** Use deployed general-purpose backend */
  GeneralPurpose = 1,
}

// subclass of IModelApp needed to use imodeljs-frontend
export class NineZoneSampleApp {
  private static _appStateManager: StateManager | undefined;

  public static get store(): Store<RootState> {
    return StateManager.store as Store<RootState>;
  }
  public static get uiSettings(): UiSettings {
    return UiFramework.getUiSettings();
  }
  public static getUiFrameworkProperty(): string {
    return NineZoneSampleApp.store.getState().sampleAppState.frameworkVersion;
  }

  public static get oidcClient(): FrontendAuthorizationClient {
    return IModelApp.authorizationClient as FrontendAuthorizationClient;
  }
  private static _appUiSettings = new AppUiSettings();
  public static get appUiSettings(): AppUiSettings {
    return NineZoneSampleApp._appUiSettings;
  }
  public static async startup(): Promise<void> {
    // use new state manager that allows dynamic additions from extensions and snippets
    if (!this._appStateManager) {
      this._appStateManager = new StateManager({
        frameworkState: FrameworkReducer,
        sampleAppState: SampleAppReducer,
      });
    }

    // Use the AppNotificationManager subclass from ui-framework to get prompts and messages
    const opts: IModelAppOptions = {};
    opts.notifications = new AppNotificationManager();
    opts.applicationVersion = "1.0.0";
    //opts.toolAdmin = new SampleToolAdmin();
    const accuSnap = new ITwinWebAccuSnap();
    opts.accuSnap = accuSnap;
    await IModelApp.startup(opts);

    // initialize RPC communication
    await NineZoneSampleApp.initializeRpc();
    await this.registerTool();
    (IModelApp.accuSnap as ITwinWebAccuSnap).onDataButtonDown.addListener(
      SelectElement
    );
  }
  private static async registerTool() {
    await IModelApp.i18n.registerNamespace("NineZoneSample").readFinished;
    WalkRoundTool.register(IModelApp.i18n.getNamespace("NineZoneSample"));
  }
  private static async initializeRpc(): Promise<void> {
    initRpc();
  }
  public static setTestProperty(value: string, immediateSync = false) {
    if (value !== NineZoneSampleApp.getTestProperty()) {
      UiFramework.dispatchActionToStore(
        SampleAppUiActionId.setTestProperty,
        value,
        immediateSync
      );
    }
  }
  public static getTestProperty(): string {
    return NineZoneSampleApp.store.getState().sampleAppState.testProperty;
  }
}
export enum SampleAppUiActionId {
  setTestProperty = "sampleapp:settestproperty",
  setAnimationViewId = "sampleapp:setAnimationViewId",
  setIsIModelLocal = "sampleapp:setisimodellocal",
  toggleDragInteraction = "sampleapp:toggledraginteraction",
  toggleFrameworkVersion = "sampleapp:toggleframeworkversion",
  setDragInteraction = "sampleapp:setdraginteraction",
  setFrameworkVersion = "sampleapp:setframeworkversion",
}
// An object with a function that creates each OpenIModelAction that can be handled by our reducer.
export const SampleAppActions = {
  setTestProperty: (testProperty: string) =>
    createAction(SampleAppUiActionId.setTestProperty, testProperty),
  setAnimationViewId: (viewId: string) =>
    createAction(SampleAppUiActionId.setAnimationViewId, viewId),
  setIsIModelLocal: (isIModelLocal: boolean) =>
    createAction(SampleAppUiActionId.setIsIModelLocal, isIModelLocal),
  toggleDragInteraction: () =>
    createAction(SampleAppUiActionId.toggleDragInteraction),
  toggleFrameworkVersion: () =>
    createAction(SampleAppUiActionId.toggleFrameworkVersion),
  setDragInteraction: (dragInteraction: boolean) =>
    createAction(SampleAppUiActionId.setDragInteraction, dragInteraction),
  setFrameworkVersion: (frameworkVersion: string) =>
    createAction(SampleAppUiActionId.setFrameworkVersion, frameworkVersion),
};

export type SampleAppActionsUnion = ActionsUnion<typeof SampleAppActions>;

export function SampleAppReducer(
  state: SampleAppState = initialState,
  action: SampleAppActionsUnion
): DeepReadonly<SampleAppState> {
  switch (action.type) {
    case SampleAppUiActionId.setTestProperty: {
      return { ...state, testProperty: action.payload };
    }
    case SampleAppUiActionId.setAnimationViewId: {
      return { ...state, animationViewId: action.payload };
    }
    case SampleAppUiActionId.setIsIModelLocal: {
      return { ...state, isIModelLocal: action.payload };
    }
    case SampleAppUiActionId.toggleDragInteraction: {
      return { ...state, dragInteraction: !state.dragInteraction };
    }
    case SampleAppUiActionId.toggleFrameworkVersion: {
      return {
        ...state,
        frameworkVersion: state.frameworkVersion === "1" ? "2" : "1",
      };
    }
    case SampleAppUiActionId.setDragInteraction: {
      return { ...state, dragInteraction: action.payload };
    }
    case SampleAppUiActionId.setFrameworkVersion: {
      return { ...state, frameworkVersion: action.payload };
    }
  }
  return state;
}
