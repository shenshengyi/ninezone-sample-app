import * as React from "react";
import {
  ColorTheme,
  ModalFrontstageInfo,
  SYSTEM_PREFERRED_COLOR_THEME,
  UiFramework,
} from "@bentley/ui-framework";
import { connect } from "react-redux";
import { OptionType, ThemedSelect, ThemedSelectProps } from "@bentley/ui-core";
import { NineZoneSampleApp } from "../../app/NineZoneSampleApp";

interface SettingsPageProps {
  dragInteraction: boolean;
  onToggleDragInteraction: () => void;
  frameworkVersion: string;
  onToggleFrameworkVersion: () => void;
}

function isOptionType(
  value: OptionType | ReadonlyArray<OptionType>
): value is OptionType {
  if (Array.isArray(value)) return false;
  return true;
}

class SettingsPageComponent extends React.Component {
  private _darkLabel = UiFramework.i18n.translate(
    "SampleApp:settingsStage.dark"
  );
  private _lightLabel = UiFramework.i18n.translate(
    "SampleApp:settingsStage.light"
  );
  private _systemPreferredLabel = UiFramework.i18n.translate(
    "SampleApp:settingsStage.systemPreferred"
  );
  private _defaultThemeOption = {
    label: this._systemPreferredLabel,
    value: SYSTEM_PREFERRED_COLOR_THEME,
  };
  private _themeOptions: Array<OptionType> = [
    this._defaultThemeOption,
    { label: this._lightLabel, value: ColorTheme.Light },
    { label: this._darkLabel, value: ColorTheme.Dark },
  ];
  private _onThemeChange: ThemedSelectProps["onChange"] = async (value) => {
    if (!value) return;
    if (!isOptionType(value)) return;
    UiFramework.setColorTheme(value.value);

    await NineZoneSampleApp.appUiSettings.colorTheme.saveSetting(
      NineZoneSampleApp.uiSettings
    );
  };
  private _getDefaultThemeOption() {
    const theme = UiFramework.getColorTheme();
    for (const option of this._themeOptions) {
      if (option.value === theme) return option;
    }
    return this._defaultThemeOption;
  }
  private onclick1 = async () => {
    await UiFramework.setColorTheme(ColorTheme.Dark);

    // await SampleAppIModelApp.appUiSettings.colorTheme.saveSetting(
    //   SampleAppIModelApp.uiSettings
    // );
  };
  private onclick2 = async () => {
    await UiFramework.setColorTheme(ColorTheme.Light);

    // await SampleAppIModelApp.appUiSettings.colorTheme.saveSetting(
    //   SampleAppIModelApp.uiSettings
    // );
  };
  public render() {
    return (
      <div>
        <button onClick={this.onclick1}>hello,Dark</button>
        <button onClick={this.onclick2}>hello,Light</button>
        <ThemedSelect
          defaultValue={this._getDefaultThemeOption()}
          isSearchable={false}
          onChange={this._onThemeChange}
          options={this._themeOptions}
        />
      </div>
    );
  }
}
// const SettingsPage = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(SettingsPageComponent);
export class SettingsModalFrontstage implements ModalFrontstageInfo {
  // public title: string = UiFramework.i18n.translate("SampleApp:settingsStage.settings");
  public title: string = "美国职业篮球联赛";
  public get content(): React.ReactNode {
    return (
      <div>
        <SettingsPageComponent />
      </div>
    );
  }
}
