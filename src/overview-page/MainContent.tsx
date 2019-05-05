import { Button, ButtonGroup, Colors, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ItemListRenderer, ItemPredicate, ItemRenderer, MultiSelect } from "@blueprintjs/select";
import { LatLng } from "leaflet";
import { DivIcon as LeafletIcon } from "leaflet";
import * as React from "react";
import { renderToString } from 'react-dom/server'
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { WirePost } from "../data/WirePost";
import { AppState } from "../redux/state";
import { NEIGHBORHOODS } from "../static/constants";
import { Post } from "./Post";

export namespace MainContent {

  interface StoreProps {
    authedUsername?: string;
    postMap: { [postId: number]: WirePost };
  }

  export type Props = StoreProps;

  export interface State {
    activePostId?: number;
    appliedFilters: Array<{ type: string, label: string }>;
    isListViewActive: boolean;
  }

}

const EMPTY_ARRAY: Array<{ type: string, label: string }> = [];

export const mapIcon = new LeafletIcon({
  html: renderToString(<Icon icon="map-marker" iconSize={24} color={Colors.GOLD3} />),
  iconAnchor: [14, 22],
  popupAnchor: [0, -22],
})

const renderFilterList: ItemListRenderer<{ type: string, label: string }> = ({ items, itemsParentRef, query, renderItem }) => {
  const neighborhoodFilters = items.filter(filter => filter.type === "neighborhood").map(renderItem);
  return (
      <Menu ulRef={itemsParentRef}>
        { neighborhoodFilters.length > 0 && <MenuItem text={"Neighborhood"} disabled={true} /> }
        {neighborhoodFilters}
        { neighborhoodFilters.length > 0 &&  <MenuDivider /> }
      </Menu>
  );
};

const renderTag = (item: { type: string, label: string }) => {
  if (item.type === "neighborhood") {
    return NEIGHBORHOODS.get(item.label);
  } else {
    return item.label;
  }
};

const getFilterItems = () => {
  const items: Array<{ type: string, label: string }> = [];
  for (const key of Array.from(NEIGHBORHOODS.keys())) {
    items.push({ type: "neighborhood", label: key });
  }
  return items;
}

const filterItemPredicate: ItemPredicate<{ type: string, label: string }> = (query: string, item: { type: string, label: string }) => {
  const filterableLabel: string = item.type === "neighborhood" ? NEIGHBORHOODS.get(item.label)! : item.label;
  return filterableLabel.toLowerCase().indexOf(query.toLowerCase()) !== -1;
}

class MainContentInternal extends React.PureComponent<MainContent.Props, MainContent.State> {
  public state: MainContent.State = { appliedFilters: EMPTY_ARRAY, isListViewActive: true }

  public render() {

    const clearFiltersButton = this.state.appliedFilters.length > 0 ? <Button icon="filter-remove" minimal={true} onClick={this.handleRemoveAllFilters} /> : undefined;
    const position = [51.505, -0.09]

    return (
      <div className="content">
        <div className="all-posts">
          <div className="content-header">
            <div className="filters">
              <Icon className="filter-icon" icon="filter" />
              <MultiSelect
                className="filters-multi-select"
                itemListRenderer={renderFilterList}
                tagRenderer={renderTag}
                items={getFilterItems()}
                itemRenderer={this.renderFilterItem}
                onItemSelect={this.handleItemSelect}
                popoverProps={{ minimal: true }}
                selectedItems={this.state.appliedFilters}
                tagInputProps={{ className: "filters-input", placeholder: "Filter...", onRemove: this.handleFilterRemove, rightElement: clearFiltersButton }}
                itemPredicate={filterItemPredicate}
                resetOnSelect={true}
              />
            </div>
            <div className="content-view-chooser">
                <ButtonGroup>
                  <Button icon={IconNames.LIST} active={this.state.isListViewActive} onClick={this.setListViewActive} />
                  <Button icon={IconNames.MAP} active={!this.state.isListViewActive} onClick={this.setMapViewActive} />
                </ButtonGroup>
              </div>
          </div>
          {this.state.isListViewActive ? (
            <div className="post-list">
              { Object.keys(this.props.postMap)
                  .filter(key => this.postPassesFilters(this.props.postMap[key]))
                  .sort((a, b) => this.props.postMap[a].dateVisited > this.props.postMap[b].dateVisited ? -1 : 1)
                  .map((postMapKey: string) => {
                    return (
                      <Post
                        key={postMapKey}
                        postId={this.props.postMap[postMapKey].id}
                        setActivePost={this.setActivePost}
                        onAddLocationFilter={this.handleNeighborhoodSelect}
                      />);
                }) }
              <div className="post -dummy" />
              <div className="post -dummy" />
            </div>
          ) : (
            <div id="map-container">
              <LeafletMap center={new LatLng(40.7685, -73.9809)} position={position} zoom={13}>
                <TileLayer
                  url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
                  attribution="Map tiles by <a href=&quot;http://stamen.com&quot;>Stamen Design</a>, <a href=&quot;http://creativecommons.org/licenses/by/3.0&quot;>CC BY 3.0</a> &mdash; Map data &copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                { Object.keys(this.props.postMap)
                    .filter(key => this.postPassesFilters(this.props.postMap[key]))
                    .map(key => {
                      return (
                        <Marker
                          key={key}
                          position={[this.props.postMap[key].latitude, this.props.postMap[key].longitude]}
                          icon={mapIcon}
                        >
                          <Popup>
                            <div>
                              <Link className="map-popup-address" to={`/post/${key}`}>{this.props.postMap[key].restaurantName}</Link>
                              <div className="map-popup-address">{this.props.postMap[key].addressStreet}</div>
                              <div className="map-popup-address">{this.props.postMap[key].addressCity}, {this.props.postMap[key].addressState} {this.props.postMap[key].addressZip}</div>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    })}
              </LeafletMap>
            </div>
          )}
        </div>
      </div>
    );
  }

  public setListViewActive = () => {
    this.setState({ isListViewActive: true });
  }

  public setMapViewActive = () => {
    this.setState({ isListViewActive: false });
  }

  private setActivePost = (postId: number) => {
    this.setState({ activePostId: postId });
  }

  private handleNeighborhoodSelect = (neighborhood: string) => {
    const selectedFilter = { type: "neighborhood", label: neighborhood };
    if (!this.isFilterSelected(selectedFilter)) {
      this.setState({ appliedFilters: [...this.state.appliedFilters, selectedFilter] });
    } else {
      this.setState({ appliedFilters: this.state.appliedFilters.filter(filter => filter.type !== selectedFilter.type || filter.label !== selectedFilter.label) });
    }
  }

  private handleItemSelect = (item: { type: string, label: string }) => {
    if (item.type === "neighborhood") {
      this.handleNeighborhoodSelect(item.label);
    }
  }

  private handleFilterRemove = (tag: string, index: number) => {
    this.setState({ appliedFilters: this.state.appliedFilters.filter((filter, i) => i !== index) });
  }

  private isFilterSelected(filter: { type: string, label: string }) {
    for (const appliedFilter of this.state.appliedFilters) {
      if (appliedFilter.type === filter.type && appliedFilter.label === filter.label) {
        return true;
      }
    }
    return false;
  }

  private renderFilterItem: ItemRenderer<{ type: string, label: string }> = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    const text = item.type === "neighborhood" ? NEIGHBORHOODS.get(item.label) : item.label;
    return (
        <MenuItem
          active={modifiers.active}
          key={item.label}
          onClick={handleClick}
          icon={this.isFilterSelected(item) ? "tick" : "blank"}
          text={text}
        />
    );
  };

  private handleRemoveAllFilters = () => {
    this.setState({ appliedFilters: EMPTY_ARRAY });
  }

  private postPassesFilters = (post: WirePost) => {
    let neighborhoodFilterExists = false;
    let passesNeighborhoodFilter = false;
    for (const filter of this.state.appliedFilters) {
      if (filter.type === "neighborhood") {
        neighborhoodFilterExists = true;
        if (filter.label === post.neighborhood) {
          passesNeighborhoodFilter = true;
        }
      }
    }
    return !neighborhoodFilterExists || passesNeighborhoodFilter;
  }

}

const mapStateToProps = (state: AppState) => {
  return {
    authedUsername: state.authedUsername,
    postMap: state.postMap,
  };
}

export const MainContent = connect(mapStateToProps)(MainContentInternal);
