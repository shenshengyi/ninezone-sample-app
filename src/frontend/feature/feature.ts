import { CommandItemDef, ItemList } from "@bentley/ui-framework";
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
    TestFeature.createCommand("TeskWalkRound", "漫游", TeskWalkRound),
    TestFeature.createCommand(
      "addFeatureSymbology1",
      "测试AddFeatureSymbology",
      addFeatureSymbology
    ),
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
