import { CommandItemDef, ItemList } from "@bentley/ui-framework";

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
      "addFeatureSymbology",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology1",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology2",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology3",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology4",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology5",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology6",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology7",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology8",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology9",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology10",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbolog11",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology712",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
    TestFeature.createCommand(
      "addFeatureSymbology37",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
  ]);
}

async function addFeatureSymbology() {
  alert("test wven");
}
