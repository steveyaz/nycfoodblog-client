import { Button, ButtonGroup, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ItemListRenderer, ItemPredicate, ItemRenderer, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { connect } from "react-redux";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { AppState } from "../redux/state";
import { NEIGHBORHOODS } from "../static/constants";
import { OverviewList } from "./OverviewList";
import { OverviewMap } from "./OverviewMap";
import { isPostComplete } from "./Post";

export namespace OverviewPage {

  interface StoreProps {
    postMap: { [postId: number]: WirePost };
    reviewMap: { [postId: number]: ReadonlyArray<WireReview> };
  }

  export type Props = StoreProps;

  export interface State {
    appliedFilters: Array<{ type: string, label: string }>;
    activeView: "LIST" | "MAP";
  }

}

const EMPTY_ARRAY: Array<{ type: string, label: string }> = [];

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

class OverviewPageInternal extends React.PureComponent<OverviewPage.Props, OverviewPage.State> {
  public state: OverviewPage.State = { appliedFilters: EMPTY_ARRAY, activeView: "LIST" }

  public render() {
    const clearFiltersButton = this.state.appliedFilters.length > 0 ? <Button icon="filter-remove" minimal={true} onClick={this.handleRemoveAllFilters} /> : undefined;
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
                  <Button icon={IconNames.LIST} active={this.state.activeView === "LIST"} onClick={this.setListViewActive} />
                  <Button icon={IconNames.MAP} active={this.state.activeView === "MAP"} onClick={this.setMapViewActive} />
                </ButtonGroup>
              </div>
          </div>
          {this.state.activeView === "LIST" ? (
            <OverviewList posts={this.getFilteredOrderedPosts()} handleNeighborhoodSelect={this.handleNeighborhoodSelect} />
          ) : (
            <OverviewMap posts={this.getFilteredOrderedPosts()} />
          )}
        </div>
      </div>
    );
  }

  public setListViewActive = () => {
    this.setState({ activeView: "LIST" });
  }

  public setMapViewActive = () => {
    this.setState({ activeView: "MAP" });
  }

  private getFilteredOrderedPosts = (): ReadonlyArray<WirePost> => {
    return Object.keys(this.props.postMap)
      .filter(key => isPostComplete(this.props.postMap[key], this.props.reviewMap[key] || []))
      .filter(key => this.postPassesFilters(this.props.postMap[key]))
      .sort((a, b) => this.props.postMap[a].dateVisited > this.props.postMap[b].dateVisited ? -1 : 1)
      .map((key: string) => this.props.postMap[key]);
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
    postMap: state.postMap,
    reviewMap: state.reviewMap,
  };
}

export const OverviewPage = connect(mapStateToProps)(OverviewPageInternal);
