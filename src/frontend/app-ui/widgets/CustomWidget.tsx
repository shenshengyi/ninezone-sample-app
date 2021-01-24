import { ConfigurableCreateInfo, WidgetControl } from "@bentley/ui-framework";
import React from "react";
import { TooltipCustomizeUI } from "../../feature/SampleToolAdmin";

/** A widget control for displaying the Tree React component */
export class TooltipeWidget extends WidgetControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);
    if (options.iModelConnection) {
      this.reactNode = <TooltipCustomizeUI />;
    }
  }
}
