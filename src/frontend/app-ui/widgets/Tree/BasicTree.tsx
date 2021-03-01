import { BeEvent } from "@bentley/bentleyjs-core";
import { PropertyRecord } from "@bentley/ui-abstract";
import {
  ControlledTree,
  DelayLoadedTreeNodeItem,
  ITreeDataProvider,
  SelectionMode,
  TreeDataChangesListener,
  TreeNodeItem,
  useTreeEventsHandler,
  useTreeModelSource,
  useTreeNodeLoader,
  useVisibleTreeNodes,
} from "@bentley/ui-components";
import React from "react";

export function BasicTree() {
  // create data provider to get some nodes to show in tree
  // `React.useMemo' is used avoid creating new object on each render
  //创建数据提供程序以获取要在树种显示的某些节点；
  //useMemo（使用备忘录）用于避免在每个渲染上创建新对象。
  const dataProvider = React.useMemo(() => new SampleDataProvider(), []);

  // create model source for tree. Model source contains tree model and provides an API to modify
  // model and listen for changes in tree model.
  // `useTreeModelSource` creates new model source when 'dataProvider' object changes
  //为树创建模型源，模型源包含树模型，并提供了可修改的API
  //建模并侦听树模型种的更改
  //当dataProvider对象更改时，“useTreeModelSource”创建新的模型源。
  const modelSource = useTreeModelSource(dataProvider);

  // create tree node loader to load nodes to tree model. It uses 'dataProvider' to get
  // nodes and adds them to tree model using 'modelSource'
  //创建树节点加载器，以将节点加载到树模型。它使用“dataProvider”获取节点，并使用“modelSource”将它们添加到树模型中。
  const nodeLoader = useTreeNodeLoader(dataProvider, modelSource);

  // create parameters for default tree event handler. It needs 'nodeLoader' to load child nodes when parent node
  // is expanded and 'modelSource' to modify nodes' state in tree model. 'collapsedChildrenDisposalEnabled' flag
  // specifies that child nodes should be removed from tree model when parent node is collapsed.
  // `React.useMemo' is used to avoid creating new params object on each render
  //为默认树事件处理程序创建参数，展开父节点时，需要nodeLoader加载子节点，需要“modelSource”修改树模型中节点的状态collapsedChildrenDisposalEnabled标志
  //折叠父节点时从树模型中移除子节点。使用useMemo用于避免在每次渲染时创建新的params对象。
  const eventHandlerParams = React.useMemo(
    () => ({ nodeLoader, modelSource, collapsedChildrenDisposalEnabled: true }),
    [nodeLoader, modelSource]
  );

  // create default event handler. It handles tree events: expanding/collapsing, selecting/deselecting nodes,
  // checking/unchecking checkboxes. It also initiates child nodes loading when parent node is expanded.
  // `useTreeEventsHandler` created new event handler when 'eventHandlerParams' object changes
  //创建默认事件处理程序。它处理树事件：折叠/展开，选择/取消选择节点，
  //选中/取消选中复选框，当父节点展开时，它还启动子节点加载。
  //useTreeEventsHandler在eventHandlerParams对象更改时创建了新的事件处理程序。
  const eventHandler = useTreeEventsHandler(eventHandlerParams);

  // get list of visible nodes to render in `ControlledTree`. This is a flat list of nodes in tree model.
  // `useVisibleTreeNodes` uses 'modelSource' to get flat list of nodes and listens for model changes to
  // re-render component with updated nodes list
  //获取要在“ControlledTree”中呈现的可见节点列表。这事树模型中节点的平面列表。
  //useVisbleTreeNodes使用modelSource获取节点的平面列表，并侦听模型更改以使用更新的节点列表重写呈现组件。
  const visibleNodes = useVisibleTreeNodes(modelSource);

  return (
    <>
      <div className="tree">
        nodeLoader={nodeLoader}
        selectionMode={SelectionMode.None}
        treeEvents={eventHandler}
        visibleNodes={visibleNodes}
      </div>
    </>
  );
}
/**
 * Data provider that returns some fake nodes to show in tree.
 */
export class SampleDataProvider implements ITreeDataProvider {
  public onTreeNodeChanged = new BeEvent<TreeDataChangesListener>();

  public async getNodesCount(parent?: TreeNodeItem) {
    if (parent === undefined) return 5;

    switch (parent.id) {
      case "TestNode-1":
        return 3;
      case "TestNode-2":
        return 3;
      case "TestNode-2-2":
        return 2;
      case "TestNode-2-3":
        return 2;
      case "TestNode-3":
        return 3;
      case "TestNode-5":
        return 1;
      default:
        return 0;
    }
  }

  public async getNodes(parent?: TreeNodeItem) {
    if (parent === undefined) {
      return [
        createNode("TestNode-1", "TestNode 1", true),
        createNode("TestNode-2", "TestNode 2", true),
        createNode("TestNode-3", "TestNode 3", true),
        createNode("TestNode-4", "TestNode 4"),
        createNode("TestNode-5", "TestNode 5", true),
      ];
    }

    switch (parent.id) {
      case "TestNode-1":
        return [
          createNode("TestNode-1-1", "TestNode 1-1"),
          createNode("TestNode-1-2", "TestNode 1-2"),
          createNode("TestNode-1-3", "TestNode 1-3"),
        ];
      case "TestNode-2":
        return [
          createNode("TestNode-2-1", "TestNode 2-1"),
          createNode("TestNode-2-2", "TestNode 2-2", true),
          createNode("TestNode-2-3", "TestNode 2-3", true),
        ];
      case "TestNode-2-2":
        return [
          createNode("TestNode-2-2-1", "TestNode 2-2-1"),
          createNode("TestNode-2-2-2", "TestNode 2-2-2"),
        ];
      case "TestNode-2-3":
        return [
          createNode("TestNode-2-3-1", "TestNode 2-3-1"),
          createNode("TestNode-2-3-2", "TestNode 2-3-2"),
        ];
      case "TestNode-3":
        return [
          createNode("TestNode-3-1", "TestNode 3-1"),
          createNode("TestNode-3-2", "TestNode 3-2"),
          createNode("TestNode-3-3", "TestNode 3-3"),
        ];
      case "TestNode-5":
        return [createNode("TestNode-5-1", "TestNode 5-1")];
      default:
        return [];
    }
  }
}

const createNode = (
  id: string,
  label: string,
  hasChildren?: boolean
): DelayLoadedTreeNodeItem => {
  return {
    id,
    label: PropertyRecord.fromString(label),
    hasChildren,
  };
};
