/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  ConditionalBooleanValue,
  StatusBarSection,
} from "@bentley/ui-abstract";
import {
  ActivityCenterField,
  ClearEmphasisStatusField,
  ConfigurableUiManager,
  FooterModeField,
  MessageCenterField,
  SectionsStatusField,
  SelectionInfoField,
  SelectionScopeField,
  SnapModeField,
  StatusBarComposer,
  StatusBarItem,
  StatusBarItemUtilities,
  StatusBarWidgetControl,
  StatusBarWidgetControlArgs,
  TileLoadingIndicator,
  ToolAssistanceField,
  ViewAttributesStatusField,
  withMessageCenterFieldProps,
  withStatusFieldProps,
} from "@bentley/ui-framework";
import { FooterSeparator } from "@bentley/ui-ninezone";
import * as React from "react";
import {
  NineZoneSampleApp,
  SampleAppUiActionId,
} from "../../app/NineZoneSampleApp";

/**
 * Status Bar example widget
 */
export class AppStatusBarWidget extends StatusBarWidgetControl {
  public getReactNode(
    controlArgs: StatusBarWidgetControlArgs
  ): React.ReactNode {
    const {
      isInFooterMode,
      onOpenWidget,
      openWidget,
      toastTargetRef,
    } = controlArgs;

    return (
      <>
        <ToolAssistanceField
          isInFooterMode={isInFooterMode}
          onOpenWidget={onOpenWidget}
          openWidget={openWidget}
        />
        <MessageCenterField
          isInFooterMode={isInFooterMode}
          onOpenWidget={onOpenWidget}
          openWidget={openWidget}
          targetRef={toastTargetRef}
        />
        <ActivityCenterField
          isInFooterMode={isInFooterMode}
          onOpenWidget={onOpenWidget}
          openWidget={openWidget}
        />
      </>
    );
  }
}

//////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/naming-convention
const ToolAssistance = withStatusFieldProps(ToolAssistanceField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const MessageCenter = withMessageCenterFieldProps(MessageCenterField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const SnapMode = withStatusFieldProps(SnapModeField);
// eslint-disable-next-line @typescript-eslint/naming-convention
// const DisplayStyle = withStatusFieldProps(DisplayStyleField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const ActivityCenter = withStatusFieldProps(ActivityCenterField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const ViewAttributes = withStatusFieldProps(ViewAttributesStatusField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const Sections = withStatusFieldProps(SectionsStatusField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const SelectionInfo = withStatusFieldProps(SelectionInfoField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const SelectionScope = withStatusFieldProps(SelectionScopeField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const ClearEmphasis = withStatusFieldProps(ClearEmphasisStatusField);
// eslint-disable-next-line @typescript-eslint/naming-convention
const TileLoadIndicator = withStatusFieldProps(TileLoadingIndicator);
// eslint-disable-next-line @typescript-eslint/naming-convention
const FooterMode = withStatusFieldProps(FooterModeField);

export class AppStatusBarWidgetControl extends StatusBarWidgetControl {
  private _statusBarItems: StatusBarItem[] | undefined;

  public get statusBarItems(): StatusBarItem[] {
    if (!this._statusBarItems) {
      const isHiddenCondition = new ConditionalBooleanValue(() => {
        return NineZoneSampleApp.getTestProperty() === "HIDE";
      }, [SampleAppUiActionId.setTestProperty]);

      this._statusBarItems = [
        StatusBarItemUtilities.createStatusBarItem(
          "ToolAssistance",
          StatusBarSection.Left,
          10,
          <ToolAssistance style={{ minWidth: "21em" }} />
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "ToolAssistanceSeparator",
          StatusBarSection.Left,
          15,
          <FooterMode>
            {" "}
            <FooterSeparator />{" "}
          </FooterMode>
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "MessageCenter",
          StatusBarSection.Left,
          20,
          <MessageCenter />
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "MessageCenterSeparator",
          StatusBarSection.Left,
          20,
          <FooterMode>
            {" "}
            <FooterSeparator />
            {" "}
          </FooterMode>
        ),
        // StatusBarItemUtilities.createStatusBarItem(
        //   "DisplayStyle",
        //   StatusBarSection.Center,
        //   40,
        //   <DisplayStyle />
        // ),
        // StatusBarItemUtilities.createStatusBarItem(
        //   "ActivityCenter",
        //   StatusBarSection.Center,
        //   20,
        //   <ActivityCenter />
        // ),
        StatusBarItemUtilities.createStatusBarItem(
          "SnapMode",
          StatusBarSection.Left,
          30,
          <SnapMode />,
          { isHidden: isHiddenCondition }
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "ViewAttributes",
          StatusBarSection.Center,
          40,
          <ViewAttributes />
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "Sections",
          StatusBarSection.Center,
          50,
          <Sections hideWhenUnused={false} />
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "ClearEmphasis",
          StatusBarSection.Center,
          60,
          <ClearEmphasis hideWhenUnused={false} />
        ),

        StatusBarItemUtilities.createStatusBarItem(
          "TileLoadIndicator",
          StatusBarSection.Right,
          70,
          <TileLoadIndicator />
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "SelectionInfo",
          StatusBarSection.Right,
          80,
          <SelectionInfo />
        ),
        StatusBarItemUtilities.createStatusBarItem(
          "SelectionScope",
          StatusBarSection.Right,
          90,
          <SelectionScope />
        ),
      ];
    }
    return this._statusBarItems;
  }

  public getReactNode(_args: StatusBarWidgetControlArgs): React.ReactNode {
    return <StatusBarComposer items={this.statusBarItems} />;
  }
}

ConfigurableUiManager.registerControl(
  "AppStatusBar",
  AppStatusBarWidgetControl
);
