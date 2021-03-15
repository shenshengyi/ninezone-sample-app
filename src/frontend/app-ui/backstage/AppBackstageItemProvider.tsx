/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import {
  BackstageItem,
  BackstageItemUtilities,
  ConditionalBooleanValue,
} from "@bentley/ui-abstract";
import { FrontstageManager } from "@bentley/ui-framework";
import {
  NineZoneSampleApp,
  SampleAppUiActionId,
} from "../../app/NineZoneSampleApp";
import { NBAFrontstage } from "../frontstages/NBAFrontstage";
import { SettingsModalFrontstage } from "../frontstages/Settings";
import { TestUIFrontstage } from "../frontstages/TestUIFrontstage";

export class AppBackstageItemProvider {
  /** id of provider */
  public readonly id = "ninezone-sample-app.AppBackstageItemProvider";

  private _backstageItems: ReadonlyArray<BackstageItem> | undefined = undefined;

  public get backstageItems(): ReadonlyArray<BackstageItem> {
    const notUi2Condition = new ConditionalBooleanValue(
      () => NineZoneSampleApp.getUiFrameworkProperty() === "2",
      [
        SampleAppUiActionId.toggleFrameworkVersion,
        SampleAppUiActionId.setFrameworkVersion,
      ]
    );
    //  const hiddenCondition3 = new ConditionalBooleanValue(
    //    () => NineZoneSampleApp.getTestProperty() === "HIDE",
    //    [SampleAppUiActionId.setTestProperty]
    //  );
    if (!this._backstageItems) {
      this._backstageItems = [
        BackstageItemUtilities.createStageLauncher(
          "SampleFrontstage",
          100,
          10,
          IModelApp.i18n.translate("NineZoneSample:backstage.sampleFrontstage"),
          undefined,
          "icon-placeholder"
        ),
        BackstageItemUtilities.createStageLauncher(
          "SampleFrontstage2",
          100,
          20,
          IModelApp.i18n.translate(
            "NineZoneSample:backstage.sampleFrontstage2"
          ),
          undefined,
          "icon-placeholder"
        ),
        BackstageItemUtilities.createStageLauncher(
          TestUIFrontstage.stageId,
          100,
          30,
          "测试UI",
          undefined,
          "icon-placeholder"
          // { isHidden: hiddenCondition3 }
        ),
        BackstageItemUtilities.createActionItem(
          TestUIFrontstage.stageId,
          100,
          40,
          () =>
            FrontstageManager.openModalFrontstage(
              new SettingsModalFrontstage()
            ),
          "设置",
          undefined,
          "icon-placeholder"
          // { isHidden: hiddenCondition3 }
        ),
        BackstageItemUtilities.createStageLauncher(
          NBAFrontstage.stageId,
          100,
          50,
          "NBA Frontstage",
          undefined,
          "icon-placeholder",
          { isHidden: notUi2Condition }
        ),
      ];
    }
    return this._backstageItems;
  }
}
