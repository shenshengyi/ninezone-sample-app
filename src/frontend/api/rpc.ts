/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  BentleyCloudRpcManager,
  RpcConfiguration,
} from "@bentley/imodeljs-common";
import { getSupportedRpcs } from "../../common/rpcs";

/**
 * Initializes RPC communication based on the platform
 */
export function initRpc(): RpcConfiguration {
  let config: RpcConfiguration;
  const rpcInterfaces = getSupportedRpcs();
  const rpcParams = {
    info: { title: "ninezone-sample-app", version: "v1.0" },
    uriPrefix: "http://localhost:3001",
  };
  config = BentleyCloudRpcManager.initializeClient(rpcParams, rpcInterfaces);
  return config;
}
