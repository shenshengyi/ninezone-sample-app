/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import {
  PresentationPropertyDataProvider,
  usePropertyDataProviderWithUnifiedSelection,
} from "@bentley/presentation-components";
import { FillCentered, Orientation, useDisposable } from "@bentley/ui-core";
import {
  PropertyCategory,
  PropertyData,
  VirtualizedPropertyGridWithDataProvider,
} from "@bentley/ui-components";

/** React properties for the property grid component */
export interface Props {
  /** iModel whose contents should be displayed in the property grid */
  imodel: IModelConnection;
  /** Orientation of the PropertyGrid rows */
  orientation: Orientation;
}

/** Property grid component for the viewer app */
export default function SimplePropertiesComponent(props: Props) {
  // eslint-disable-line @typescript-eslint/naming-convention
  const dataProvider = useDisposable(
    React.useCallback(
      () => new AutoExpandingPropertyDataProvider({ imodel: props.imodel }),
      [props.imodel]
    )
  );
  const { isOverLimit } = usePropertyDataProviderWithUnifiedSelection({
    dataProvider,
  });
  let content: JSX.Element;
  if (isOverLimit) {
    content = <FillCentered>{"Too many elements."}</FillCentered>;
  } else {
    content = (
      <VirtualizedPropertyGridWithDataProvider
        dataProvider={dataProvider}
        isPropertyHoverEnabled={true}
        orientation={Orientation.Horizontal}
        horizontalOrientationMinWidth={500}
      />
    );
  }

  return content;
}
class AutoExpandingPropertyDataProvider extends PresentationPropertyDataProvider {
  public async getData(): Promise<PropertyData> {
    const result = await super.getData();
    // console.log(result.records);
    this.expandCategories(result.categories);
    // console.log(result.records);
    // const co =
    //   result.records[
    //     "/selected-item/-DgnCustomItemTypes_LevelPro__x003A__LevelName"
    //   ];
    // console.log(co);
    // const s = new Set<string>();
    // for (const c of result.categories) {
    //   s.add(c.name);
    // }
    // s.forEach((n) => {
    //   const r = result.records[n];
    //   for (const i of r) {
    //     console.log(i.value + "===" + i.description);
    //   }
    // });
    console.log(result);
    return result;
  }

  private expandCategories(categories: PropertyCategory[]) {
    categories.forEach((category: PropertyCategory) => {
      category.expand = true;
      if (category.childCategories)
        this.expandCategories(category.childCategories);
    });
  }
}
