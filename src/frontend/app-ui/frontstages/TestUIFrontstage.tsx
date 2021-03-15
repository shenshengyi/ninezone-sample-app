import * as React from "react";
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  IModelApp,
  IModelConnection,
  ScreenViewport,
  ViewState,
} from "@bentley/imodeljs-frontend";
import {
  BadgeType,
  StagePanelLocation,
  StageUsage,
  WidgetState,
} from "@bentley/ui-abstract";
import {
  BasicNavigationWidget,
  BasicToolWidget,
  CommandItemDef,
  ContentGroup,
  ContentLayoutDef,
  ContentLayoutManager,
  ContentProps,
  CoreTools,
  CustomItemDef,
  Frontstage,
  FrontstageManager,
  FrontstageProvider,
  GroupItemDef,
  IModelConnectedViewSelector,
  IModelViewportControl,
  StagePanel,
  StagePanelHeader,
  StagePanelState,
  SyncUiEventArgs,
  SyncUiEventDispatcher,
  ToolbarHelper,
  UiFramework,
  Widget,
  Zone,
  ZoneLocation,
  ZoneState,
} from "@bentley/ui-framework";
import { AppStatusBarWidgetControl } from "../statusbars/AppStatusBar";
import {
  NineZoneSampleApp,
  SampleAppUiActionId,
} from "../../app/NineZoneSampleApp";
import { VisibilityTreeWidgetControl } from "../widgets/TreeWidget";
import { UnifiedSelectionPropertyGridWidgetControl } from "./UnifiedSelectionPropertyGridWidget";
import { VerticalPropertyGridWidgetControl } from "../../components/PropertyGridDemoWidget";
import { UnifiedSelectionTableWidgetControl } from "./UnifiedSelectionTableWidget";

/* eslint-disable react/jsx-key */
export function MyCustomViewOverlay() {
  const [syncIdsOfInterest] = React.useState([
    SampleAppUiActionId.setTestProperty,
  ]);
  const [showOverlay, setShowOverlay] = React.useState(
    NineZoneSampleApp.getTestProperty() !== "HIDE"
  );

  React.useEffect(() => {
    const handleSyncUiEvent = (args: SyncUiEventArgs) => {
      if (0 === syncIdsOfInterest.length) return;

      // istanbul ignore else
      if (
        syncIdsOfInterest.some((value: string): boolean =>
          args.eventIds.has(value)
        )
      ) {
        const show = NineZoneSampleApp.getTestProperty() !== "HIDE";
        if (show !== showOverlay) setShowOverlay(show);
      }
    };

    // Note: that items with conditions have condition run when loaded into the items manager
    SyncUiEventDispatcher.onSyncUiEvent.addListener(handleSyncUiEvent);
    return () => {
      SyncUiEventDispatcher.onSyncUiEvent.removeListener(handleSyncUiEvent);
    };
  }, [setShowOverlay, showOverlay, syncIdsOfInterest]);

  return showOverlay ? (
    <div className="uifw-view-overlay">
      <div
        className="my-custom-control"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "rgba(144, 238 ,144, 0.5)",
        }}
      >
        <h1>hello,world</h1>
        <h2>(在左上角的水平工具栏中禁用“隐藏/显示项目”工具)</h2>
      </div>
    </div>
  ) : null;
}
export class TestUIFrontstage extends FrontstageProvider {
  public static stageId = "TestUIFrontstage";
  public static unifiedSelectionPropertyGridId = "UnifiedSelectionPropertyGrid";
  private _supplyViewOverlay = (viewport: ScreenViewport) => {
    if (viewport.view) {
      return <MyCustomViewOverlay />;
    }
    return null;
  };
  public static savedViewLayoutProps: string;
  private _leftPanel = {
    widgets: [
      <Widget
        iconSpec="icon-placeholder"
        labelKey="SampleApp:widgets.VisibilityTree"
        control={VisibilityTreeWidgetControl}
      />,
    ],
  };
  private _rightPanel = {
    allowedZones: [2, 6, 9],
  };
  constructor(
    public viewStates: ViewState[],
    public iModelConnection: IModelConnection
  ) {
    super();
  }

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

  /** Commands that opens switches the content layout */
  private get _switchLayout1() {
    return new CommandItemDef({
      iconSpec: "icon-placeholder",
      label: "Horizontal Layout",
      execute: async () => {
        // const activeFrontstageDef = FrontstageManager.activeFrontstageDef;
        // if (activeFrontstageDef) {
        //   const contentLayout = ContentLayoutManager.findLayout(
        //     "TwoHalvesHorizontal"
        //   );
        //   if (contentLayout && activeFrontstageDef.contentGroup) {
        //     await ContentLayoutManager.setActiveLayout(
        //       contentLayout,
        //       activeFrontstageDef.contentGroup
        //     );
        //   }
        // }
        NineZoneSampleApp.setTestProperty(
          NineZoneSampleApp.getTestProperty() === "HIDE" ? "" : "HIDE"
        );
        // demonstrate how tool could dispatch its own event.
        //   IModelApp.toolAdmin.dispatchUiSyncEvent(toolSyncUiEventId);
      },
    });
  }

  private get _switchLayout2() {
    return new CommandItemDef({
      iconSpec: "icon-placeholder",
      label: "Vertical Layout",
      execute: async () => {
        const activeFrontstageDef = FrontstageManager.activeFrontstageDef;
        if (activeFrontstageDef) {
          const contentLayout = ContentLayoutManager.findLayout(
            "TwoHalvesVertical"
          );
          if (contentLayout && activeFrontstageDef.contentGroup) {
            await ContentLayoutManager.setActiveLayout(
              contentLayout,
              activeFrontstageDef.contentGroup
            );
          }
        }
      },
    });
  }

  private get _additionalNavigationVerticalToolbarItems() {
    return [
      ToolbarHelper.createToolbarItemFromItemDef(
        200,
        this._viewSelectorItemDef
      ),
      ToolbarHelper.createToolbarItemFromItemDef(
        210,
        new GroupItemDef({
          label: "Layout Demos",
          panelLabel: "Layout Demos",
          iconSpec: "icon-placeholder",
          items: [this._switchLayout1, this._switchLayout2],
        })
      ),
    ];
  }

  public get frontstage() {
    const contentLayoutDef: ContentLayoutDef = new ContentLayoutDef({});

    // create the content props that specifies an iModelConnection and a viewState entry in the application data.
    const contentProps: ContentProps[] = [];
    const viewState = this.viewStates[0];
    const thisContentProps: ContentProps = {
      classId: IModelViewportControl,
      applicationData: {
        viewState,
        iModelConnection: this.iModelConnection,
      },
    };
    contentProps.push(thisContentProps);

    const myContentGroup: ContentGroup = new ContentGroup({
      contents: [
        {
          id: "primaryContent",
          classId: IModelViewportControl.id,
          applicationData: {
            viewState: UiFramework.getDefaultViewState,
            iModelConnection: UiFramework.getIModelConnection,
            supplyViewOverlay: this._supplyViewOverlay,
          },
        },
      ],
    });
    return (
      <Frontstage
        id={TestUIFrontstage.stageId}
        defaultTool={CoreTools.selectElementCommand}
        defaultLayout="SingleContent"
        //////////////////////////////////////
        contentGroup={myContentGroup}
        isInFooterMode={true}
        applicationData={{ key: "value" }}
        usage={StageUsage.General}
        version={1.1} // Defaults to 0. Increment this when Frontstage changes are meaningful enough to reinitialize saved user layout settings.
        contentManipulationTools={
          <Zone
            widgets={[
              <Widget
                isFreeform={true}
                element={
                  <BasicToolWidget showCategoryAndModelsContextTools={true} />
                }
              />,
            ]}
          />
        }
        toolSettings={
          <Zone
            allowsMerging
            widgets={[
              <Widget
                iconSpec="icon-placeholder"
                isToolSettings={true}
                preferredPanelSize="fit-content"
              />,
            ]}
          />
        }
        viewNavigationTools={
          <Zone
            widgets={[
              <Widget
                isFreeform={true}
                element={
                  <BasicNavigationWidget
                    additionalVerticalItems={
                      this._additionalNavigationVerticalToolbarItems
                    }
                  />
                }
              />,
            ]}
          />
        }
        statusBar={
          <Zone
            widgets={[
              <Widget isStatusBar={true} control={AppStatusBarWidgetControl} />,
            ]}
          />
        }
        leftPanel={
          <StagePanel
            header={<h3>hello,world</h3>}
            // header={
            //   <StagePanelHeader
            //     collapseButton
            //     collapseButtonTitle="Collapse"
            //     location={StagePanelLocation.Right}
            //     title="Visibility tree 2021年"
            //   />
            // }
            allowedZones={[ZoneLocation.TopCenter]}
            defaultState={StagePanelState.Open}
            pinned={true}
            resizable={false}
            size={400}
            minSize={150}
            maxSize={800}
            // widgets={this._leftPanel.widgets}
            panelZones={{
              start: {
                widgets: this._leftPanel.widgets,
              },
              middle: { widgets: this._leftPanel.widgets },
              end: { widgets: this._leftPanel.widgets },
            }}
          />
        }
        topPanel={
          <StagePanel
            size={90}
            defaultState={StagePanelState.Open}
            panelZones={{
              start: {
                widgets: [
                  <Widget
                    id="TopStart1"
                    label="Start1"
                    defaultState={WidgetState.Open}
                    element={<h2>Top Start1 widget</h2>}
                  />,
                  <Widget
                    id="TopStart2"
                    label="Start2"
                    element={<h2>Top Start2 widget</h2>}
                  />,
                ],
              },
              middle: {
                widgets: [
                  <Widget
                    id="2023t"
                    label="nihao"
                    element={<h2>大江大河2</h2>}
                  />,
                ],
              },
              end: {
                widgets: [
                  <Widget
                    id="TopEnd1"
                    label="End1"
                    element={<h2>Top End1 widget</h2>}
                  />,
                  <Widget
                    id="TopEnd2"
                    label="End2"
                    defaultState={WidgetState.Open}
                    element={<h2>Top End2 widget</h2>}
                  />,
                ],
              },
            }}
          />
        }
        // leftPanel={
        //   <StagePanel
        //     header={
        //       <StagePanelHeader
        //         collapseButton
        //         collapseButtonTitle="Collapse"
        //         location={StagePanelLocation.Right}
        //         title="Visibility tree 2021年"
        //       />
        //     }
        //     size={300}
        //     defaultState={StagePanelState.Minimized}
        //     panelZones={{
        //       start: {
        //         widgets: [
        //           <Widget
        //             id="LeftStart1"
        //             label="美国"
        //             defaultState={WidgetState.Open}
        //             element={<h2>美国</h2>}
        //           />,
        //           <Widget
        //             id="LeftStart3"
        //             label="NBA"
        //             element={<h2>这里是NBA</h2>}
        //           />,
        //           <Widget
        //             id="LeftStart4"
        //             label="CBA"
        //             element={<h2>这里是CBA</h2>}
        //           />,
        //           <Widget
        //             id="LeftStart5"
        //             label="湖北"
        //             element={<h2>这里是湖北</h2>}
        //           />,
        //         ],
        //       },
        //       middle: {
        //         widgets: [
        //           <Widget
        //             id="LeftMiddle1"
        //             label="Middle1"
        //             element={<h2>Left Middle1 widget</h2>}
        //           />,
        //           <Widget
        //             id="LeftMiddle2"
        //             label="Middle2"
        //             defaultState={WidgetState.Open}
        //             element={<h2>Left Middle2 widget</h2>}
        //           />,
        //         ],
        //       },
        //       end: {
        //         widgets: [
        //           <Widget
        //             id="LeftEnd1"
        //             label="End1"
        //             defaultState={WidgetState.Open}
        //             element={<h2>Left End1 widget</h2>}
        //           />,
        //           <Widget
        //             id="LeftEnd2"
        //             label="End2"
        //             element={<h2>Left End2 widget</h2>}
        //           />,
        //         ],
        //       },
        //     }}
        //   />
        // }
        // rightPanel={
        //   <StagePanel
        //     allowedZones={this._rightPanel.allowedZones}
        //     maxSize={{ percentage: 50 }}
        //   />
        // }
        // bottomLeft={
        //   <Zone
        //     allowsMerging
        //     defaultState={ZoneState.Minimized}
        //     initialWidth={400}
        //     widgets={[
        //       <Widget
        //         iconSpec="icon-placeholder"
        //         labelKey="SampleApp:widgets.UnifiedSelectionTable"
        //         control={UnifiedSelectionTableWidgetControl}
        //         applicationData={{ iModelConnection: this.iModelConnection }}
        //         fillZone={true}
        //         badgeType={BadgeType.New}
        //       />,
        //       /* <Widget iconSpec="icon-placeholder" label="External iModel View" control={ViewportWidgetControl} fillZone={true} badgeType={BadgeType.TechnicalPreview}
        //            applicationData={{ projectName: "iModelHubTest", imodelName: "GrandCanyonTerrain" }} />, */
        //     ]}
        //   />
        // }
        rightPanel={
          <StagePanel
            defaultState={StagePanelState.Open}
            panelZones={{
              start: {
                widgets: [
                  <Widget
                    id="RightStart1"
                    label="Start1"
                    element={<h2>Right Start1 widget</h2>}
                  />,
                  <Widget
                    id="RightStart2"
                    label="Start2"
                    defaultState={WidgetState.Open}
                    element={<h2>Right Start2 widget</h2>}
                  />,
                ],
              },
              middle: {
                widgets: [
                  <Widget
                    id="RightMiddle1"
                    label="Middle1"
                    defaultState={WidgetState.Open}
                    element={<h2>Right Middle1 widget</h2>}
                  />,
                  <Widget
                    id="RightMiddle2"
                    label="Middle2"
                    element={<h2>Right Middle2 widget</h2>}
                  />,
                ],
              },
              end: {
                widgets: [
                  <Widget
                    id="RightEnd1"
                    label="End1"
                    element={<h2>Right End1 widget</h2>}
                  />,
                  <Widget
                    id="RightEnd2"
                    label="End2"
                    defaultState={WidgetState.Open}
                    element={<h2>Right End2 widget</h2>}
                  />,
                ],
              },
            }}
          />
        }
      />
    );
  }
}
