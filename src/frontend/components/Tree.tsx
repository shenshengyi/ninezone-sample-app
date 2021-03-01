/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelConnection } from "@bentley/imodeljs-frontend";
import {
  ChildNodeSpecificationTypes,
  RelationshipDirection,
  Ruleset,
  RuleTypes,
} from "@bentley/presentation-common";
import {
  usePresentationTreeNodeLoader,
  useUnifiedSelectionTreeEventHandler,
} from "@bentley/presentation-components";
import {
  ControlledTree,
  SelectionMode,
  useVisibleTreeNodes,
} from "@bentley/ui-components";
import * as React from "react";
const RULESET_TREE = require("./Tree.ruleset.json"); // eslint-disable-line @typescript-eslint/no-var-requires

/** React properties for the tree component */
export interface Props {
  /** iModel whose contents should be displayed in the tree */
  imodel: IModelConnection;
}

/** Tree component for the viewer app */
export default function SimpleTreeComponent(props: Props) {
  // eslint-disable-line @typescript-eslint/naming-convention
  const nodeLoader = usePresentationTreeNodeLoader({
    imodel: props.imodel,
    ruleset: ruleset,
    pagingSize: 20,
  });
  return (
    <ControlledTree
      nodeLoader={nodeLoader}
      visibleNodes={useVisibleTreeNodes(nodeLoader.modelSource)}
      treeEvents={useUnifiedSelectionTreeEventHandler({ nodeLoader })}
      selectionMode={SelectionMode.Extended}
    />
  );
}
const ruleset: Ruleset = {
  id: "ninezone-sample-app/Tree",
  rules: [
    {
      ruleType: RuleTypes.RootNodes,
      autoExpand: true,
      specifications: [
        {
          specType: ChildNodeSpecificationTypes.InstanceNodesOfSpecificClasses,
          classes: [
            {
              schemaName: "BisCore",
              classNames: ["Subject"],
            },
          ],
          instanceFilter: "this.Parent = NULL",
          arePolymorphic: true,
          groupByClass: false,
          groupByLabel: false,
        },
      ],
    },
    {
      ruleType: RuleTypes.ChildNodes,
      condition: 'ParentNode.IsOfClass("Subject", "BisCore")',
      onlyIfNotHandled: true,
      specifications: [
        {
          specType: ChildNodeSpecificationTypes.RelatedInstanceNodes,
          relationshipPaths: [
            {
              relationship: {
                schemaName: "BisCore",
                className: "SubjectOwnsSubjects",
              },
              direction: RelationshipDirection.Forward,
            },
          ],
          groupByClass: true,
          groupByLabel: false,
        },
        {
          specType: ChildNodeSpecificationTypes.InstanceNodesOfSpecificClasses,
          classes: {
            schemaName: "BisCore",
            classNames: ["Model"],
          },
          arePolymorphic: true,
          relatedInstances: [
            {
              relationshipPath: {
                relationship: {
                  schemaName: "BisCore",
                  className: "ModelModelsElement",
                },
                direction: RelationshipDirection.Forward,
                targetClass: {
                  schemaName: "BisCore",
                  className: "InformationPartitionElement",
                },
              },
              alias: "partition",
              isRequired: true,
            },
          ],
          instanceFilter:
            "partition.Parent.Id = parent.ECInstanceId AND NOT this.IsPrivate",
          groupByClass: true,
          groupByLabel: false,
        },
      ],
    },
    {
      ruleType: RuleTypes.ChildNodes,
      condition: 'ParentNode.IsOfClass("Model", "BisCore")',
      onlyIfNotHandled: true,
      specifications: [
        {
          specType: ChildNodeSpecificationTypes.RelatedInstanceNodes,
          relationshipPaths: [
            {
              relationship: {
                schemaName: "BisCore",
                className: "ModelContainsElements",
              },
              direction: RelationshipDirection.Forward,
            },
          ],
          instanceFilter: "this.Parent = NULL",
          groupByClass: false,
          groupByLabel: false,
        },
      ],
    },
    {
      ruleType: RuleTypes.ChildNodes,
      condition: 'ParentNode.IsOfClass("Element", "BisCore")',
      onlyIfNotHandled: true,
      specifications: [
        {
          specType: ChildNodeSpecificationTypes.RelatedInstanceNodes,
          relationshipPaths: [
            {
              relationship: {
                schemaName: "BisCore",
                className: "ElementOwnsChildElements",
              },
              direction: RelationshipDirection.Forward,
            },
          ],
          groupByClass: false,
          groupByLabel: false,
        },
      ],
    },
    {
      ruleType: RuleTypes.ImageIdOverride,
      condition: 'ThisNode.IsOfClass("Subject", "BisCore")',
      imageIdExpression:
        'IIF(this.Parent.Id = NULL, "icon-imodel-hollow-2", "icon-folder")',
    },
    {
      ruleType:RuleTypes.ImageIdOverride,
      condition: 'ThisNode.IsOfClass("Model", "BisCore")',
      imageIdExpression: '"icon-model"',
    },
    {
      ruleType: RuleTypes.ImageIdOverride,
      condition: 'ThisNode.IsOfClass("Element", "BisCore")',
      imageIdExpression: '"icon-item"',
    },
  ],
};
// const ruleset: Ruleset = {
//   id: "hongqi",
//   rules: [
//     {
//       ruleType: RuleTypes.RootNodes,
//       specifications: [
//         {
//           specType: ChildNodeSpecificationTypes.InstanceNodesOfSpecificClasses,
//           classes: { schemaName: "BisCore", classNames: ["RepositoryModel"] },
//           arePolymorphic: true,
//           groupByClass: true,
// groupByLabel: false,
//           nestedRules: [
//             {
//               ruleType: RuleTypes.ChildNodes,
//               specifications: [
//                 {
//                   specType: ChildNodeSpecificationTypes.RelatedInstanceNodes,
//                   classes: { schemaName: "BisCore", classNames: ["Model"] },
//                   arePolymorphic: true,
//                   groupByClass: false,
//                   nestedRules: [
//                     {
//                       ruleType: RuleTypes.ChildNodes,
//                       specifications: [
//                         {
//                           specType:
//                             ChildNodeSpecificationTypes.RelatedInstanceNodes,
//                           classes: {
//                             schemaName: "BisCore",
//                             classNames: ["Element"],
//                           },
//                           arePolymorphic: true,
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
