import { Point3d, XAndY, XYAndZ } from "@bentley/geometry-core";
import { IModel, RenderMode } from "@bentley/imodeljs-common";
import {
  BeButtonEvent,
  BeWheelEvent,
  EventHandled,
  GeometricModel2dState,
  GeometricModel3dState,
  GeometricModelState,
  HitDetail,
  IModelApp,
  LocateFilterStatus,
  LocateResponse,
  PerModelCategoryVisibility,
  PrimitiveTool,
  ViewGlobeLocationTool,
  ViewPose,
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
    TestFeature.createCommand("TestGeo", "测试坐标系", TestGeo),
    TestFeature.createCommand("TestCategories", "测试Category", TestCategories),
  ]);
}
const show = PerModelCategoryVisibility.Override.Show;
const hide = PerModelCategoryVisibility.Override.Hide;
async function TestCategories() {
 
  const imodel = UiFramework.getIModelConnection()!;
  const usedCatIds = ["0x17", "0x2d", "0x2f", "0x31"];
  await imodel.subcategories.load(usedCatIds);
  const c1 = imodel.subcategories.getSubCategories("0x2d");
  console.log(c1);

  const vp = IModelApp.viewManager.selectedView!;
  vp.invalidateScene();
  // const usedCatIds = ["0x17", "0x2d", "0x2f", "0x31"];
  // vp.changeCategoryDisplay(usedCatIds, true,true);
  // const pmcv = vp.perModelCategoryVisibility;
  // pmcv.setOverride("0x1f", "0x17", hide);
  // pmcv.setOverride("0x24", "0x17", hide);
  // pmcv.setOverride("0x22", "0x17", hide);
  // pmcv.setOverride("0x23", "0x17", hide);

  // pmcv.setOverride("0x23", "0x17", show);
  // const ids = await imodel.queryEntityIds({ from: "bis:Category" });
  // ids.forEach(async (id) => {
  //   const p = await imodel.elements.getProps(id);
  //   if (p && p.length > 0) {
  //     console.log(p[0]);
  //   }
  // });
  // 0x19
  // 0x17
  // 0x2d
  // 0x2f
  // 0x31

  // // // Make sure all subcategories we need are loaded ahead of time.
  // // const req = await imodel.subcategories.load(usedCatIds);
  // // console.log(req);
  // // const p = await imodel.elements.getProps("0x18");
  // // if (p && p.length > 0) {
  // //   console.log(p[0]);
  // // }
  // const subids = await imodel.queryEntityIds({
  //   from: "bis:GeometricElement",
  // });
  // subids.forEach(async (id) => {
  //   const p = await imodel.elements.getProps(id);
  //   if (p && p.length > 0) {
  //     console.log(p[0]);
  //   }
  // });
  // for (const usedCatId of usedCatIds) {
  //   // expect(imodel.subcategories.getSubCategories(usedCatId)).not.to.be
  //   //   .undefined;
  //   const cat = imodel.subcategories.getSubCategories(usedCatId);
  //   if (cat) {
  //     console.log(cat);
  //   } else {
  //     console.log("没有找到");
  //   }
  // }
  // // Turn off all categories
  // //关闭所有类别;
  // const vp = IModelApp.viewManager.selectedView!;
  // vp.changeCategoryDisplay(usedCatIds, false);
  // for (const catId of usedCatIds) {
  //   // expect(vp.view.viewsCategory(catId)).to.be.false;
  //   const c = vp.view.viewsCategory(catId);
  //   if (c) {
  //     console.log("可以找到category" + catId);
  //   } else {
  //     console.log("找不到cateogry" + catId);
  //   }
  // }
  // // expect(vp.view.viewsModel("0x1c"));
  // // expect(vp.view.viewsModel("0x1f"));

  // if (vp.view.viewsModel("0x1c")) {
  //   console.log("可以找到" + "0x1c");
  // } else {
  //   console.log("找不到" + "0x1c");
  // }
  // if (vp.view.viewsModel("0x1c")) {
  //   console.log("可以找到" + "0x1f");
  // } else {
  //   console.log("找不到" + "0x1f");
  // }
  // const pmcv = vp.perModelCategoryVisibility;
  // pmcv.setOverride("0x1c", "0x2f", show);
  // pmcv.setOverride("0x1f", "0x17", hide);

  // // expect(pmcv.getOverride("0x1c", "0x2f")).to.equal(show);
  // // expect(pmcv.getOverride("0x1f", "0x17")).to.equal(hide);
  // if (pmcv.getOverride("0x1c", "0x2f") === show) {
  //   console.log("可以找到show");
  // }
  // if (pmcv.getOverride("0x1f", "0x17") === hide) {
  //   console.log("可以找到hide");
  // }

  // //只记录实际覆盖可见性的每模型覆盖。
}
async function TestGeo() {
  const r = IModelApp.tools.run(ViewGlobeLocationTool.toolId);
  if (r) {
  }
  // const imodel = UiFramework.getIModelConnection()!;
  // // imodel.geoServices.getConverter()?.getIModelCoordinatesFromGeoCoordinates();
  // const xyz: XYAndZ = {
  //   x: -430642.7374439969,
  //   y: 413642.40694772755,
  //   z: 0.7620000000000006,
  // };
  // const geoservice = imodel.geoServices;
  // if (geoservice) {
  //   const conver = geoservice.getConverter();
  //   if (conver) {
  //     const r = await conver.getGeoCoordinatesFromIModelCoordinates([xyz]);
  //     console.log(r);
  //   } else {
  //     alert("没有转化器");
  //   }
  // } else {
  //   alert("没有地理服务");
  // }
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
  // IModelApp.iModelClient.users.get();
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
export class DivisionTool extends PrimitiveTool {
  public static toolId = "DivisionTool";
  public readonly points: Point3d[] = [];
  private _elementIds: string[] = [];
  public requireWriteableTarget(): boolean {
    return false;
  }
  public onPostInstall() {
    super.onPostInstall();
    IModelApp.viewManager.setViewCursor(IModelApp.viewManager.grabbingCursor);
    this.setupAndPromptForNextAction();
  }
  public setupAndPromptForNextAction(): void {
    IModelApp.notifications.outputPromptByKey("SelectSignalTool run");
  }
  public async filterHit(
    _hit: HitDetail,
    _out?: LocateResponse
  ): Promise<LocateFilterStatus> {
    return LocateFilterStatus.Accept;
  }
  public async onMouseWheel(_ev: BeWheelEvent): Promise<EventHandled> {
    return EventHandled.No;
  }
  public async onDataButtonDown(ev: BeButtonEvent): Promise<EventHandled> {
    await IModelApp.locateManager.doLocate(
      new LocateResponse(),
      true,
      ev.point,
      ev.viewport,
      ev.inputSource
    );
    this.points.push(ev.point);
    const hit = await IModelApp.locateManager.doLocate(
      new LocateResponse(),
      true,
      ev.point,
      ev.viewport,
      ev.inputSource
    );
    if (undefined === hit || !hit.isElementHit) return EventHandled.No;

    if (hit.isElementHit) {
      this._elementIds.push(hit.sourceId);
      const imodel = UiFramework.getIModelConnection();
      if (imodel) {
        const prop = await imodel.elements.getProps(hit.sourceId);
        if (prop && prop.length > 0) {
          const geop: GeometricModel3dState = (prop[0] as unknown) as GeometricModel3dState;
          if (geop) {
            console.log(geop);
          }
        }
      }
    }

    console.log(ev.point);
    return EventHandled.No;
  }
  public async onResetButtonUp(_ev: BeButtonEvent): Promise<EventHandled> {
    // if (this._elementIds.length !== 0) {
    //   await MoveElementFunction(this._elementIds);
    // }
    // if (this.points.length > 0) {
    //   await MarkerTest(this.points);
    // }
    IModelApp.toolAdmin.startDefaultTool();
    return EventHandled.No;
  }

  public onRestartTool(): void {
    const tool = new DivisionTool();
    if (!tool.run()) this.exitTool();
  }
}
