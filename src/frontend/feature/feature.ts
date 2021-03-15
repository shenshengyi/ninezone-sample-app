import { RenderMode } from "@bentley/imodeljs-common";
import {
  BeButtonEvent,
  HitDetail,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import {
  ChildNodeSpecificationTypes,
  NodePathElement,
  Ruleset,
  RuleTypes,
} from "@bentley/presentation-common";
import { Presentation } from "@bentley/presentation-frontend";
import {
  CommandItemDef,
  ItemList,
  SyncUiEventDispatcher,
  UiFramework,
} from "@bentley/ui-framework";
import {
  NineZoneSampleApp,
  SampleAppUiActionId,
} from "../app/NineZoneSampleApp";
import { TestContent } from "./ContentTest";
import { PropertyValueRendererManagerTestFunc } from "./PropertyValueRendererManagerTest";
import { TestDeSerializationView, TestSerializationView } from "./SavedView";
import { TeskWalkRound } from "./WalkRound";

export class TestFeature {
  public static createCommand(
    id: string,
    des: string,
    func: (args?: any) => any
  ): CommandItemDef {
    const testV1Def = new CommandItemDef({
      commandId: id,
      execute: func,
      iconSpec: "icon-developer",
      label: des,
      description: des,
      tooltip: des,
    });
    return testV1Def;
  }
  public static itemLists = new ItemList([
    TestFeature.createCommand(
      "TestDeSerializationView",
      "切换到保存视图",
      TestDeSerializationView
    ),
    TestFeature.createCommand(
      "TestSerializationView",
      "保存当前视图至外部文件",
      TestSerializationView
    ),
    TestFeature.createCommand("TeskWalkRound", "漫游", TeskWalkRound),
    TestFeature.createCommand("TestContent", "测试TestContent", TestContent),
    TestFeature.createCommand("TestPresent", "测试Rule", TestPresent),
    TestFeature.createCommand("HideOrShow", "控制选项卡显隐", HideOrShow),
    TestFeature.createCommand("PropsTest", "自定义属性", PropsTest),
  ]);
}
async function PropsTest() {
  await PropertyValueRendererManagerTestFunc();
}
async function HideOrShow() {
  const vp = IModelApp.viewManager.selectedView!;
  vp.viewFlags.renderMode = RenderMode.SmoothShade;
  // alert(NineZoneSampleApp.getUiFrameworkProperty());
  // SyncUiEventDispatcher.dispatchSyncUiEvent(
  //   SampleAppUiActionId.toggleFrameworkVersion
  // );
  // await NineZoneSampleApp.appUiSettings.frameworkVersion.saveSetting(
  //   NineZoneSampleApp.uiSettings
  // );
  // alert(NineZoneSampleApp.getUiFrameworkProperty());
}
export async function SelectElement(_ev: BeButtonEvent, currHit?: HitDetail) {
  if (currHit) {
    const imodel = UiFramework.getIModelConnection()!;
    const p = await imodel.elements.getProps(currHit.sourceId);
    if (p && p.length > 0) {
      // console.log(p[0]);
    }
  }

  const vp = IModelApp.viewManager.selectedView!;
  const v = vp.displayStyle.backgroundColor;
  if (currHit) {
    // alert(currHit.sourceId);
  }
}
async function TestPresent() {
  const ruleset: Ruleset = {
    id: "getFilteredNodePaths",
    rules: [
      {
        ruleType: RuleTypes.RootNodes,
        specifications: [
          {
            specType: ChildNodeSpecificationTypes.CustomNode,
            type: "nodeType",
            label: "filter r1",
            nestedRules: [
              {
                ruleType: RuleTypes.ChildNodes,
                specifications: [
                  {
                    specType: ChildNodeSpecificationTypes.CustomNode,
                    type: "nodeType",
                    label: "filter ch1",
                  },
                  {
                    specType: ChildNodeSpecificationTypes.CustomNode,
                    type: "nodeType",
                    label: "other ch2",
                  },
                  {
                    specType: ChildNodeSpecificationTypes.CustomNode,
                    type: "nodeType",
                    label: "other ch3",
                    nestedRules: [
                      {
                        ruleType: RuleTypes.ChildNodes,
                        specifications: [
                          {
                            specType: ChildNodeSpecificationTypes.CustomNode,
                            type: "nodeType",
                            label: "filter ch4",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            specType: ChildNodeSpecificationTypes.CustomNode,
            type: "nodeType",
            label: "other r2",
          },
          {
            specType: ChildNodeSpecificationTypes.CustomNode,
            type: "nodeType",
            label: "other r3",
            nestedRules: [
              {
                ruleType: RuleTypes.ChildNodes,
                specifications: [
                  {
                    specType: ChildNodeSpecificationTypes.CustomNode,
                    type: "nodeType",
                    label: "other ch5",
                  },
                  {
                    specType: ChildNodeSpecificationTypes.CustomNode,
                    type: "nodeType",
                    label: "filter ch6",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  const imodel = UiFramework.getIModelConnection()!;
  const result = await Presentation.presentation.getFilteredNodePaths(
    { imodel, rulesetOrId: ruleset },
    "filter"
  );
  for (const r of result) {
    console.log(NodePathElement.toJSON(r));
  }
  console.log(result);
}
