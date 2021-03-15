/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Guid } from "@bentley/bentleyjs-core";
import { IModelApp, IModelConnection } from "@bentley/imodeljs-frontend";
import {
  Content,
  ContentSpecificationTypes,
  DisplayValue,
  Field,
  KeySet,
  NodeKey,
  Ruleset,
  RuleTypes,
} from "@bentley/presentation-common";
import {
  ISelectionProvider,
  Presentation,
  SelectionChangeEventArgs,
} from "@bentley/presentation-frontend";
import { PropertyRecord } from "@bentley/ui-abstract";
import {
  SelectionMode,
  SimpleTableDataProvider,
  Table,
} from "@bentley/ui-components";
import {
  ConfigurableCreateInfo,
  ConfigurableUiManager,
  IModelConnectedModelsTree,
  ModelsTree,
  ModelsTreeNodeType,
  UiFramework,
  WidgetControl,
} from "@bentley/ui-framework";
import * as React from "react";
export class VisibilityTreeWidgetControl extends WidgetControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);
    this.reactNode = <IModelConnectedModelsTree />;
  }
}

ConfigurableUiManager.registerControl(
  "VisibilityTreeWidget",
  VisibilityTreeWidgetControl
);
/** A widget control for displaying the Tree React component */
export class TreeWidget extends WidgetControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    if (options.iModelConnection) {
      // this.reactNode = <SimpleTreeComponent imodel={options.iModelConnection} />;
      this.reactNode = (
        <ModelsTree
          iModel={options.iModelConnection}
          selectionMode={SelectionMode.Single}
          activeView={IModelApp.viewManager.selectedView}
          enableHierarchyAutoUpdate={true}
          selectionPredicate={(_key: NodeKey, type: ModelsTreeNodeType) =>
            type === ModelsTreeNodeType.Model
          }
          // enableElementsClassGrouping={ClassGroupingOption.YesWithCounts}
        />
      );
    }
  }
}

/** A widget control for displaying the Tree React component */
export class PropertyWidget extends WidgetControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    if (options.iModelConnection) {
      this.reactNode = <PropertyCommpoment imodel={options.iModelConnection} />;
    }
  }
}
interface PropertyCommpomentProp {
  imodel: IModelConnection;
}
interface PropertyCommpomentState {
  keys: KeySet;
  records: OverlySimplePropertyRecord[];
}

class PropertyCommpoment extends React.Component<
  PropertyCommpomentProp,
  PropertyCommpomentState
> {
  public constructor(prop: PropertyCommpomentProp) {
    super(prop);
    this.state = { records: [], keys: new KeySet() };
  }
  public render() {
    if (this.state.records) {
      const dataProvider = this.createDataProvider(this.state.records);
      return (
        <Table
          dataProvider={dataProvider}
          selectionMode={SelectionMode.Single}
        />
      );
    } else {
      return <div>hello,world</div>;
    }
  }
  componentWillMount() {
    Presentation.selection.selectionChange.addListener(
      this._onSelectionChanged
    );
  }
  componentDidMount() {}
  public componentDidUpdate() {}

  private _onSelectionChanged = async (
    evt: SelectionChangeEventArgs,
    selectionProvider: ISelectionProvider
  ) => {
    const selection = selectionProvider.getSelection(evt.imodel, evt.level);
    const keys = new KeySet(selection);
    this.setState({ keys });
    const records = await createOverlySimplePropertyRecords(
      keys,
      this.props.imodel,
      []
    );
    this.setState({ records });
  };

  private createDataProvider(records: OverlySimplePropertyRecord[]) {
    const columns = [
      { key: "Name", label: "Property" },
      { key: "Value", label: "Value" },
    ];
    const data = new SimpleTableDataProvider(columns);

    records.forEach((record) => {
      const cells = [
        { key: "Name", record: PropertyRecord.fromString(record.displayLabel) },
        {
          key: "Value",
          record: PropertyRecord.fromString(record.displayValue),
        },
      ];
      data.addRow({ key: "record.name", cells });
    });

    return data;
  }
}
export interface OverlySimplePropertyRecord {
  name: string;
  displayLabel: string;
  displayValue: string;
}
export async function onSelectionChanged(
  evt: SelectionChangeEventArgs,
  selectionProvider: ISelectionProvider
) {
  const selection = selectionProvider.getSelection(evt.imodel, evt.level);
  const keys = new KeySet(selection);

  const imodel = UiFramework.getIModelConnection()!;
  await createOverlySimplePropertyRecords(keys, imodel, [
    // "pc_bis_Element_Model",
    // "pc_bis_Element_CodeValue",
    // "pc_bis_Element_UserLabel",
  ]);
}
async function queryForContent(
  keys: KeySet,
  imodel: IModelConnection
): Promise<Content | undefined> {
  //const options = { imodel, keys, rulesetOrId: ruleset };
  const ruleset: Ruleset = {
    id: Guid.createValue(),
    rules: [
      {
        ruleType: RuleTypes.Content,
        specifications: [
          {
            specType: ContentSpecificationTypes.ContentRelatedInstances,
            classes: { schemaName: "BisCore", classNames: ["Element"] },
            handleInstancesPolymorphically: true,
            instanceFilter: `this.ECInstanceId = 1`,
          },
        ],
      },
    ],
  };
  // const options = { imodel, keys, rulesetOrId: DEFAULT_PROPERTY_GRID_RULESET };
  const options = {
    imodel,
    keys,
    rulesetOrId: ruleset,
  };
  const descriptor = await Presentation.presentation.getContentDescriptor({
    ...options,
    displayType: "Grid",
  });
  if (undefined === descriptor) return;

  return Presentation.presentation.getContent({ ...options, descriptor });
}
async function createOverlySimplePropertyRecords(
  keys: KeySet,
  imodel: IModelConnection,
  propertyNameFilter: string[] = []
) {
  const content = await queryForContent(keys, imodel);

  if (!content) return [];
  const item = content.contentSet[0];
  const data: OverlySimplePropertyRecord[] = [];
  let fields = content.descriptor.fields;
  console.log(content);
  if (0 !== propertyNameFilter.length) {
    fields = fields.filter((f: Field) => propertyNameFilter.includes(f.name));
  }
  fields.forEach((f: Field) => {
    const fieldName = f.name; // Unique name for this field
    const fieldLabel = f.label; // User facing label for this field
    const displayValue = item.displayValues[f.name]; // Value to display to user

    if (DisplayValue.isPrimitive(displayValue)) {
      const displayValueString =
        undefined !== displayValue ? displayValue.toString() : "";
      data.push({
        name: fieldName,
        displayLabel: fieldLabel,
        displayValue: displayValueString,
      });
    } else if (DisplayValue.isArray(displayValue)) {
      data.push({
        name: fieldName,
        displayLabel: fieldLabel,
        displayValue: `[${displayValue.length}] ${f.type.typeName}`,
      });
    } else if (DisplayValue.isMap(displayValue)) {
      data.push({
        name: fieldName,
        displayLabel: fieldLabel,
        displayValue: f.type.typeName,
      });
    }
  });
  return data;
}
