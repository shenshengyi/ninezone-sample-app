import {
  PrimitiveValue,
  PropertyDescription,
  PropertyEditorInfo,
  PropertyRecord,
  PropertyValueFormat,
  StandardTypeNames,
} from "@bentley/ui-abstract";
import {
  PropertyValueRendererContext,
  PropertyValueRendererManager,
} from "@bentley/ui-components";
import React from "react";

export async function PropertyValueRendererManagerTestFunc() {
  let propertyRecord: PropertyRecord;
  propertyRecord = createPrimitiveStringProperty("Label", "Model");
  propertyRecord.property.typename = "mycustom";

  const myCustomRenderer = {
    canRender: (
      _record: PropertyRecord,
      _context?: PropertyValueRendererContext
    ) => {
      //console.log(_record.value);
      // if (_record.value.valueFormat === PropertyValueFormat.Primitive) {
      //   if (_record.value.displayValue) {
      //     console.log(_record.value.displayValue);
      //   }
      // }
      return true;
    },
    render: (
      _record: PropertyRecord,
      _context?: PropertyValueRendererContext
    ) => (
      <p>
        {_record.description}
        <img src="jgl.jpg" width="64" height="64" />
      </p>
    ), // eslint-disable-line react/display-name
  };

  PropertyValueRendererManager.defaultManager.registerRenderer(
    "string",
    myCustomRenderer
  );
  // PropertyValueRendererManager.defaultManager.registerRenderer(
  //   "Category",
  //   myCustomRenderer
  // );
  // PropertyValueRendererManager.defaultManager.unregisterRenderer("navigation");
  // PropertyValueRendererManager.defaultManager.registerRenderer(
  //   "navigation",
  //   myCustomRenderer
  // );
}

function createPrimitiveStringProperty(
  name: string,
  rawValue: string,
  displayValue: string = rawValue.toString(),
  editorInfo?: PropertyEditorInfo,
  autoExpand?: boolean
) {
  const value: PrimitiveValue = {
    displayValue,
    value: rawValue,
    valueFormat: PropertyValueFormat.Primitive,
  };

  const description: PropertyDescription = {
    displayLabel: name,
    name,
    typename: StandardTypeNames.String,
  };

  if (editorInfo) description.editor = editorInfo;

  const property = new PropertyRecord(value, description);
  property.isReadonly = false;
  property.autoExpand = autoExpand;
  if (property.autoExpand === undefined) delete property.autoExpand;

  return property;
}
