import {
  HitDetail,
  ToolAdmin,
  tryImageElementFromUrl,
} from "@bentley/imodeljs-frontend";
import { Input, Select, Toggle } from "@bentley/ui-core";
import React from "react";
export enum ElemProperty {
  Origin = "Origin",
  LastModified = "LastMod",
  CodeValue = "CodeValue",
}
export interface TooltipCustomizeSettings {
  showImage: boolean;
  showCustomText: boolean;
  showElementProperty: boolean;
  showDefaultToolTip: boolean;
  customText: string;
  elemProperty: ElemProperty;
}
export class SampleToolAdmin extends ToolAdmin {
  public static settings: TooltipCustomizeSettings = {
    showImage: true,
    showCustomText: false,
    showElementProperty: true,
    showDefaultToolTip: true,
    customText: "用户自定义字符串",
    elemProperty: ElemProperty.Origin,
  };
  public async getToolTip(hit: HitDetail): Promise<HTMLElement | string> {
    if (
      !SampleToolAdmin.settings.showImage &&
      !SampleToolAdmin.settings.showCustomText &&
      !SampleToolAdmin.settings.showElementProperty &&
      !SampleToolAdmin.settings.showDefaultToolTip
    )
      return "";

    const tip = document.createElement("div");
    let needHR = false;

    if (SampleToolAdmin.settings.showImage) {
      const img = await tryImageElementFromUrl(".//iModeljs-logo.png");
      if (img) {
        tip.appendChild(img);
        needHR = true;
      } else {
        alert("图片获取失败");
      }
    }
    if (SampleToolAdmin.settings.showCustomText) {
      if (needHR) tip.appendChild(document.createElement("hr"));
      const customText = document.createElement("span");
      customText.innerHTML = SampleToolAdmin.settings.customText;
      tip.appendChild(customText);
      needHR = true;
    }

    if (SampleToolAdmin.settings.showElementProperty) {
      if (needHR) tip.appendChild(document.createElement("hr"));

      const propertyName = SampleToolAdmin.settings.elemProperty as string;
      let msg = `<b>${propertyName}:</b> `;

      if (hit.isElementHit) {
        const query = `SELECT ${propertyName} AS val FROM BisCore.SpatialElement
                       WHERE ECInstanceId = ${hit.sourceId}`;

        const rows = hit.viewport.iModel.query(query);
        for await (const row of rows) {
          switch (SampleToolAdmin.settings.elemProperty) {
            default:
              msg += row.val;
              break;
            case ElemProperty.LastModified:
              const date = new Date(row.val);
              msg += date.toLocaleString();
              break;
            case ElemProperty.Origin:
              msg += "<ul>";
              msg += `<li><b>x:</b> ${row.val.x}</li>`;
              msg += `<li><b>y:</b> ${row.val.y}</li>`;
              msg += `<li><b>z:</b> ${row.val.z}</li>`;
              msg += "</ul>";
              break;
          }
        }
      }

      const htmlTip = document.createElement("span");
      htmlTip.innerHTML = msg;
      tip.appendChild(htmlTip);
      needHR = true;
    }

    if (SampleToolAdmin.settings.showDefaultToolTip) {
      if (needHR) tip.appendChild(document.createElement("hr"));
      let defaultTip = await super.getToolTip(hit);
      if (typeof defaultTip === "string") {
        const htmlTip = document.createElement("span");
        htmlTip.innerHTML = defaultTip;
        defaultTip = htmlTip;
      }
      tip.appendChild(defaultTip);
    }

    return tip;
  }
}

/** A React component that renders the UI specific for this sample */
export class TooltipCustomizeUI extends React.Component<
  {},
  TooltipCustomizeSettings
> {
  /** Creates a Sample instance */
  constructor(props?: any) {
    super(props);
    // Use "IModelApp.toolAdmin as YourToolAdmin" see Notes at bottom of TooltipCustomizeApp.tsx.
    this.state = { ...SampleToolAdmin.settings };
  }

  public componentDidUpdate(
    _prevProps: {},
    prevState: TooltipCustomizeSettings
  ) {
    // Use "IModelApp.toolAdmin as YourToolAdmin" see Notes at bottom of TooltipCustomizeApp.tsx.
    if (prevState !== this.state) SampleToolAdmin.settings = this.state;
  }

  private _onChangeShowImage = (checked: boolean) => {
    this.setState({ showImage: checked });
  };

  private _onChangeShowCustomText = (checked: boolean) => {
    this.setState({ showCustomText: checked });
  };

  private _onChangeShowElementProperty = (checked: boolean) => {
    this.setState({ showElementProperty: checked });
  };

  private _onChangeShowDefaultToolTip = (checked: boolean) => {
    this.setState({ showDefaultToolTip: checked });
  };

  private _onChangeCustomText = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value: string = event.target.value;
    this.setState({ customText: value });
  };

  private _onChangeElementProperty = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value as ElemProperty;
    this.setState({ elemProperty: value });
  };

  public render() {
    const options = {
      [ElemProperty.Origin]: "Origin",
      [ElemProperty.LastModified]: "Last Modified",
      [ElemProperty.CodeValue]: "Code value",
    };
    return (
      <>
        <div className="sample-options-3col">
          <Toggle
            isOn={this.state.showImage}
            onChange={this._onChangeShowImage}
          />
          <span>Show Image</span>
          <span></span>
          <Toggle
            isOn={this.state.showCustomText}
            onChange={this._onChangeShowCustomText}
          />
          <span>Show Custom Text</span>
          <Input
            type="text"
            value={this.state.customText}
            onChange={this._onChangeCustomText}
            disabled={!this.state.showCustomText}
          />
          <Toggle
            isOn={this.state.showElementProperty}
            onChange={this._onChangeShowElementProperty}
          />
          <span>Show Element Property</span>
          <Select
            onChange={this._onChangeElementProperty}
            value={this.state.elemProperty}
            disabled={!this.state.showElementProperty}
            options={options}
          />
          <Toggle
            isOn={this.state.showDefaultToolTip}
            onChange={this._onChangeShowDefaultToolTip}
          />
          <span>Show Default ToolTip</span>
          <span></span>
        </div>
      </>
    );
  }
}
