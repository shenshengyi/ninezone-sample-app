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
  ]);
}
