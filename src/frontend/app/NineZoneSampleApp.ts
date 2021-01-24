/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Config } from "@bentley/bentleyjs-core";
import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
import { BentleyCloudRpcParams } from "@bentley/imodeljs-common";
import {
  FrontendRequestContext,
  IModelApp,
  IModelAppOptions,
} from "@bentley/imodeljs-frontend";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import {
  AppNotificationManager,
  FrameworkReducer,
  FrameworkRootState,
  StateManager,
} from "@bentley/ui-framework";
import { initRpc } from "../api/rpc";
import { Store } from "redux";
import { WalkRoundTool } from "../feature/WalkRound";
import { SampleToolAdmin } from "../feature/SampleToolAdmin";

export type RootState = FrameworkRootState;

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

  public static get oidcClient(): FrontendAuthorizationClient {
    return IModelApp.authorizationClient as FrontendAuthorizationClient;
  }

  public static async startup(): Promise<void> {
    // use new state manager that allows dynamic additions from extensions and snippets
    if (!this._appStateManager) {
      this._appStateManager = new StateManager({
        frameworkState: FrameworkReducer,
      });
    }

    // Use the AppNotificationManager subclass from ui-framework to get prompts and messages
    const opts: IModelAppOptions = {};
    opts.notifications = new AppNotificationManager();
    opts.applicationVersion = "1.0.0";
    opts.toolAdmin = new SampleToolAdmin();

    await IModelApp.startup(opts);

    // initialize RPC communication
    await NineZoneSampleApp.initializeRpc();
    await this.registerTool();
  }
  private static async registerTool() {
    await IModelApp.i18n.registerNamespace("NineZoneSample").readFinished;
    WalkRoundTool.register(IModelApp.i18n.getNamespace("NineZoneSample"));
  }
  private static async initializeRpc(): Promise<void> {
    const rpcParams = await this.getConnectionInfo();
    initRpc(rpcParams);
  }

  private static async getConnectionInfo(): Promise<
    BentleyCloudRpcParams | undefined
  > {
    const usedBackend = Config.App.getNumber("imjs_backend", UseBackend.Local);

    if (usedBackend === UseBackend.GeneralPurpose) {
      const urlClient = new UrlDiscoveryClient();
      const requestContext = new FrontendRequestContext();
      const orchestratorUrl = await urlClient.discoverUrl(
        requestContext,
        "iModelJsOrchestrator.K8S",
        undefined
      );
      return {
        info: { title: "general-purpose-imodeljs-backend", version: "v2.0" },
        uriPrefix: orchestratorUrl,
      };
    }

    if (usedBackend === UseBackend.Local) return undefined;

    throw new Error(
      `Invalid backend "${usedBackend}" specified in configuration`
    );
  }
}
