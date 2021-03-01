import { ConfigurableCreateInfo, WidgetControl } from "@bentley/ui-framework";
import React from "react";
import { TooltipCustomizeUI } from "../../feature/SampleToolAdmin";
import { BasicTree } from "./Tree/BasicTree";
import  { PresentationTree, SimpleTreeComponent } from "./Tree/PresentationTree";

/** A widget control for displaying the Tree React component */
// export class TooltipeWidget extends WidgetControl {
//   constructor(info: ConfigurableCreateInfo, options: any) {
//     super(info, options);
//     if (options.iModelConnection) {
//       this.reactNode = <TooltipCustomizeUI />;
//     }
//   }
// }
export class TooltipeWidget extends WidgetControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);
    if (options.iModelConnection) {
      this.reactNode = (
        <div>
          <SimpleTreeComponent imodel={options.iModelConnection} />
        </div>
      );
    }
  }
}
