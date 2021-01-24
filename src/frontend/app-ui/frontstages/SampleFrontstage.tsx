/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ViewState } from "@bentley/imodeljs-frontend";
import {
  BasicNavigationWidget,
  BasicToolWidget,
  CommandItemDef,
  ContentGroup,
  ContentLayoutDef,
  ContentViewManager,
  CoreTools,
  CustomItemDef,
  Frontstage,
  FrontstageProvider,
  IModelConnectedNavigationWidget,
  IModelConnectedViewSelector,
  IModelViewportControl,
  ItemList,
  ReviewToolWidget,
  StagePanel,
  SyncUiEventId,
  ToolbarHelper,
  ToolWidget,
  ToolWidgetComposer,
  UiFramework,
  Widget,
  WidgetState,
  Zone,
  ZoneState,
} from "@bentley/ui-framework";
import * as React from "react";
import { TestFeature } from "../../api/feature";
import { AppUi } from "../AppUi";
import { TableContent } from "../contentviews/TableContent";
import { AppStatusBarWidget } from "../statusbars/AppStatusBar";
import { PropertyGridWidget } from "../widgets/PropertyGridWidget";
import { TreeWidget } from "../widgets/TreeWidget";

/* eslint-disable react/jsx-key */

/**
 * Sample Frontstage for 9-Zone sample application
 */
export class SampleFrontstage extends FrontstageProvider {
  // Content layout for content views
  private _contentLayoutDef: ContentLayoutDef;

  // Content group for both layouts
  private _contentGroup: ContentGroup;

  constructor(public viewStates: ViewState[]) {
    super();

    // Create the content layouts.
    this._contentLayoutDef = new ContentLayoutDef({
      // horizontalSplit: { percentage: 0.75, top: 0, bottom: 1 },
    });

    // Create the content group.
    this._contentGroup = new ContentGroup({
      contents: [
        {
          classId: IModelViewportControl,
          applicationData: {
            viewState: this.viewStates[0],
            iModelConnection: UiFramework.getIModelConnection(),
          },
        },
        // {
        //   classId: TableContent,
        //   applicationData: {
        //     iModelConnection: UiFramework.getIModelConnection(),
        //   },
        // },
      ],
    });
  }

  /** Define the Frontstage properties */
  public get frontstage() {
    return (
      <Frontstage
        /**Frontstage的id*/
        id="SampleFrontstage"
        /**启动前台后启动的工具*/
        defaultTool={CoreTools.selectElementCommand}
        /**使用的默认内容布局*/
        defaultLayout={this._contentLayoutDef}
        /**提供内容视图的内容组*/
        contentGroup={this._contentGroup}
        /**指示状态栏是处于页脚模式还是小部件模式。默认为true。*/
        isInFooterMode={true}
        /**右上角的区域。@不推荐使用“viewNavigationTools”属性。*/
        topLeft={
          <Zone
            widgets={[
              <Widget isFreeform={true} element={<SampleToolWidget />} />,
            ]}
          />
        }
        /**沿顶部中心边缘的区域。@不推荐使用“toolSettings”属性。*/
        topCenter={<Zone widgets={[<Widget isToolSettings={true} />]} />}
        /**右上角的区域。@不推荐使用“viewNavigationTools”属性。*/
        topRight={
          <Zone
            widgets={[
              /** Use standard NavigationWidget delivered in ui-framework */
              <Widget
                isFreeform={true}
                element={
                  <BasicNavigationWidget
                    additionalVerticalItems={ToolbarHelper.createToolbarItemsFromItemDefs(
                      [this._viewSelectorItemDef],30
                    )}
                  />
                }
              />,
            ]}
          />
        }
        /**沿中心右边缘的区域。@不推荐将小部件放置在适当的阶段面板区域中。*/
        centerLeft={
          <Zone
            defaultState={ZoneState.Minimized}
            allowsMerging={true}
            widgets={[
              <Widget
                control={TreeWidget}
                fillZone={true}
                iconSpec="icon-tree"
                labelKey="NineZoneSample:components.tree"
                applicationData={{
                  iModelConnection: UiFramework.getIModelConnection(),
                }}
              />,
            ]}
          />
        }
        centerRight={
          <Zone
            defaultState={ZoneState.Minimized}
            allowsMerging={true}
            widgets={[
              <Widget
                control={TreeWidget}
                fillZone={true}
                iconSpec="icon-tree"
                labelKey="NineZoneSample:components.tree"
                applicationData={{
                  iModelConnection: UiFramework.getIModelConnection(),
                }}
              />,
            ]}
          />
        }
        /**沿底部中心边缘的区域。@不推荐使用statusBar属性*/
        bottomCenter={
          <Zone
            widgets={[
              <Widget isStatusBar={true} control={AppStatusBarWidget} />,
            ]}
          />
        }
        /**右下角的区域。@不推荐将小部件放置在适当的阶段面板区域中。*/
        bottomRight={
          <Zone
            defaultState={ZoneState.Open}
            allowsMerging={true}
            widgets={[
              <Widget
                id="Properties"
                control={PropertyGridWidget}
                defaultState={WidgetState.Closed}
                fillZone={true}
                iconSpec="icon-properties-list"
                labelKey="NineZoneSample:components.properties"
                applicationData={{
                  iModelConnection: UiFramework.getIModelConnection(),
                }}
                syncEventIds={[SyncUiEventId.SelectionSetChanged]}
                stateFunc={this._determineWidgetStateForSelectionSet}
              />,
            ]}
          />
        }
        /**右边的panel. @beta  */
        rightPanel={<StagePanel allowedZones={[2, 4]} />}
      />
    );
  }

  /** Determine the WidgetState based on the Selection Set */
  private _determineWidgetStateForSelectionSet = (): WidgetState => {
    const activeContentControl = ContentViewManager.getActiveContentControl();
    if (
      activeContentControl &&
      activeContentControl.viewport &&
      activeContentControl.viewport.view.iModel.selectionSet.size > 0
    )
      return WidgetState.Open;
    return WidgetState.Closed;
  };

  /** Get the CustomItemDef for ViewSelector  */
  private get _viewSelectorItemDef() {
    return new CustomItemDef({
      customId: "sampleApp:viewSelector",
      reactElement: (
        <IModelConnectedViewSelector
          listenForShowUpdates={false} // Demo for showing only the same type of view in ViewSelector - See IModelViewport.tsx, onActivated
        />
      ),
    });
  }
}

/**
 * Define a ToolWidget with Buttons to display in the TopLeft zone.
 */
class SampleToolWidget extends React.Component {
  public render(): React.ReactNode {
    const horizontalItems = new ItemList([
      CoreTools.selectElementCommand,
      ...TestFeature.itemLists,
    ]);
    return <ReviewToolWidget suffixVerticalItems={horizontalItems} />;
  }
}
