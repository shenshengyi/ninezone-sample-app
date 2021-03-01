import { IModelConnection } from "@bentley/imodeljs-frontend";
import { Ruleset } from "@bentley/presentation-common";
import {
  IPresentationTreeDataProvider,
  PresentationTreeDataProvider,
  usePresentationTreeNodeLoader,
  useUnifiedSelectionTreeEventHandler,
} from "@bentley/presentation-components";
import {
  ControlledTree,
  SelectionMode,
  usePagedTreeNodeLoader,
  useTreeEventsHandler,
  useTreeModelSource,
  useVisibleTreeNodes,
} from "@bentley/ui-components";
import { useDisposable, useOptionalDisposable } from "@bentley/ui-core";
import React, { useCallback } from "react";
const PAGING_SIZE = 20;
const RULESET_TREE_HIERARCHY: Ruleset = require("./TreeHierarchy.json"); // eslint-disable-line @typescript-eslint/no-var-requires

/**
 * This component demonstrates how to use `ControlledTree` with presentation rules.
 * It uses presentation rules defined in '../TreeHierarchy.json' to load
 * data from supplied iModel.
 */
export interface PresentationTreeProps {
  imodel: IModelConnection;
}
export function PresentationTree(props: PresentationTreeProps) {
  // create tree node loader to load data using presentation rules. It loads nodes to tree model
  // in pages using supplied iModel and presentation ruleset.
  // 'usePresentationTreeNodeLoader' creates tree model source and paged tree node loader.
  // Tree model source can be accessed through node loader. New model source and node loader
  // is created when any property of object passed to `usePresentationTreeNodeLoader` changes
  const nodeLoader = usePresentationTreeNodeLoader({
    imodel: props.imodel,
    ruleset: RULESET_TREE_HIERARCHY,
    pagingSize: PAGING_SIZE,
  });

  // create parameters for default tree event handler. It needs 'nodeLoader' to load child nodes when parent node
  // is expanded and 'modelSource' to modify nodes' state in tree model. 'collapsedChildrenDisposalEnabled' flag
  // specifies that child nodes should be removed from tree model when parent node is collapsed.
  // `React.useMemo' is used to avoid creating new params object on each render
  const eventHandlerParams = React.useMemo(
    () => ({
      nodeLoader,
      modelSource: nodeLoader.modelSource,
      collapsedChildrenDisposalEnabled: true,
    }),
    [nodeLoader]
  );

  // create default event handler. It handles tree events: expanding/collapsing, selecting/deselecting nodes,
  // checking/unchecking checkboxes. It also initiates child nodes loading when parent node is expanded.
  // `useTreeEventsHandler` created new event handler when 'eventHandlerParams' object changes
  const eventHandler = useTreeEventsHandler(eventHandlerParams);

  // get list of visible nodes to render in `ControlledTree`. This is a flat list of nodes in tree model.
  // `useVisibleTreeNodes` uses 'modelSource' to get flat list of nodes and listens for model changes to
  // re-render component with updated nodes list
  const visibleNodes = useVisibleTreeNodes(nodeLoader.modelSource);
  console.log(visibleNodes);
  return (
    <>
      <div className="tree">
        <ControlledTree
          nodeLoader={nodeLoader}
          selectionMode={SelectionMode.Single}
          treeEvents={eventHandler}
          visibleNodes={visibleNodes}
        />
      </div>
    </>
  );
}
////////////////////////////////////////////////////
export interface DataProviderProps {
  /** Custom tree data provider. */
  dataProvider: IPresentationTreeDataProvider;
}

/** Tree component for the viewer app */
export  function SimpleTreeComponent(props: PresentationTreeProps) {
  // eslint-disable-line @typescript-eslint/naming-convention
  const imodel = props.imodel;
  const pagingSize = 20;
  const imodelDataProvider = useOptionalDisposable(
    useCallback(() => {
      if (imodel)
        return new PresentationTreeDataProvider({
          imodel,
          ruleset: RULESET_TREE_HIERARCHY,
          pagingSize,
        });
      return undefined;
    }, [imodel])
  );
  const dataProvider = imodelDataProvider;
  const modelSource = useTreeModelSource(dataProvider!);
  const nodeLoader = usePagedTreeNodeLoader(dataProvider!, 20, modelSource);
  const eventsHandler = useUnifiedSelectionTreeEventHandler({
    nodeLoader,
    collapsedChildrenDisposalEnabled: true,
  });
  return (
    <>
      <div style={{ flex: "1" }}>
        <ControlledTree
          nodeLoader={nodeLoader}
          visibleNodes={useVisibleTreeNodes(modelSource)}
          treeEvents={eventsHandler}
          selectionMode={SelectionMode.Extended}
          iconsEnabled={true}
        />
      </div>
    </>
  );
}
