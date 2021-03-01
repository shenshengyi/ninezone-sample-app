import { DbOpcode, Guid, Id64 } from "@bentley/bentleyjs-core";
import { ElementState, IModelApp } from "@bentley/imodeljs-frontend";
import {
  ContentFlags,
  ContentSpecificationTypes,
  DefaultContentDisplayTypes,
  DescriptorOverrides,
  InstanceKey,
  KeySet,
  PropertyValueFormat,
  Ruleset,
  RuleTypes,
} from "@bentley/presentation-common";
import { DEFAULT_PROPERTY_GRID_RULESET } from "@bentley/presentation-components";
import {
  ISelectionProvider,
  Presentation,
  SelectionChangeEventArgs,
} from "@bentley/presentation-frontend";
import { UiFramework } from "@bentley/ui-framework";
export async function testEvent(
  _args: SelectionChangeEventArgs,
  _provider: ISelectionProvider
) {
  // console.log(args);
  // // console.log(provider);
  // const hiliteSet = await Presentation.selection.getHiliteSet(_args.imodel);
  // console.log(hiliteSet);
  // const vp = IModelApp.viewManager.selectedView!;
  // vp.zoomToElements(hiliteSet.elements!);
  // const s = _provider.getSelection(args.imodel, 0);
  // console.log(s);
}
export async function TestContent() {
  // const id = "0x9451";
  const imodel = UiFramework.getIModelConnection()!;
  // imodel.selectionSet.add(id);
  const ids = await imodel.queryEntityIds({
    from:
      "DgnCustomItemTypes___x673A____x67DC____x8BBE____x5907____x5C5E____x6027__:__x9644____x52A0____x5C5E____x6027__ElementAspect",
  });
  console.log(ids.size);
  const idList: string[] = [];
  ids.forEach(async (id) => {
    const e = await imodel.elements.getProps(id);
    if (e && e.length > 0) {
      console.log(e[0]);
    }
  });
  
  // const RULESET: Ruleset = {
  //   id: `properties`,
  //   rules: [
  //     {
  //       ruleType: RuleTypes.Content,
  //       specifications: [
  //         {
  //           specType: ContentSpecificationTypes.SelectedNodeInstances,
  //           acceptablePolymorphically: true,
  //           acceptableClassNames: ["Element"],
  //           acceptableSchemaName: "BisCore",
  //         },
  //       ],
  //     },
  //   ],
  // };

  // const id = "0x94ed";
  // const imodel = UiFramework.getIModelConnection()!;

  // const s = await Presentation.selection.scopes.computeSelection(
  //   imodel,
  //   [id],
  //   "element"
  // );

  // const overrides: DescriptorOverrides = {
  //   displayType: DefaultContentDisplayTypes.PropertyPane,
  //   hiddenFieldNames: [],
  //   contentFlags: ContentFlags.MergeResults,
  // };
  // const c = await Presentation.presentation.getContent({
  //   imodel,
  //   rulesetOrId: RULESET,
  //   descriptor: overrides,
  //   keys: s,
  // });
  // const f = c!.descriptor.fields;
  // for (const i of f) {
  //  console.log(i.name);
  // }
}
