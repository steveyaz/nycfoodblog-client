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
import { Dispatch } from "redux";
import { PostForm } from "../admin-page/PostForm";
import { ReviewForm } from "../admin-page/ReviewForm";
import { RequestClient } from "../data/RequestClient";
import { WirePost } from "../data/WirePost";
import { WireReview } from "../data/WireReview";
import { setAllPosts, setAllReviews, setUsernames, setView } from "../redux/action";
import { AppState, VIEW_TYPE } from "../redux/state";
import { NEIGHBORHOODS } from "../static/constants";
import { Post } from "./Post";

export namespace MainContent {

  interface StoreProps {
    view: VIEW_TYPE;
    authedUsername?: string;
    postMap: { [postId: number]: WirePost };
    setView: (viewType: VIEW_TYPE) => void;
    setUsernames: (usernames: Array<string>) => void;
    setAllPosts: (postMap: { [postId: number]: WirePost }) => void;
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => void;
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
        { (this.props.view === "ALL_POSTS") &&
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
                { this.props.authedUsername && 
                  <div className="post -add-post">
                    <Button text="Add Post" icon="add" onClick={this.handleAddPost} />
                  </div> }
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
        }
        { (this.props.view === "ADD_OR_EDIT_POST") &&
          <PostForm
            postId={this.state.activePostId}
          />
        }
        { (this.props.view === "ADD_OR_EDIT_REVIEW") &&
          <ReviewForm
            postId={this.state.activePostId!}
          />
        }
      </div>
    );
  }

  public componentDidMount() {
    const usernamesPromise = RequestClient.getInstance().getAllUsernames();
    const postsPromise = RequestClient.getInstance().getAllPostsIds();
    Promise.all([postsPromise, usernamesPromise])
      .then(postIdsAndUsernames => {
        this.props.setUsernames(postIdsAndUsernames[1]);
        const postPromises = [];
        const reviewPromises = [];
        for (const postId of postIdsAndUsernames[0]) {
          postPromises.push(RequestClient.getInstance().getPost(postId));
          reviewPromises.push(RequestClient.getInstance().getReviews(postId));
        }
        Promise.all([Promise.all(postPromises), Promise.all(reviewPromises)])
          .then(postsAndReviews => {
            const postMap = {};
            for (const post of postsAndReviews[0]) {
              postMap[post.id!] = post;
            }
            this.props.setAllPosts(postMap);
            const reviewMap = {};
            for (const reviews of postsAndReviews[1]) {
              if (reviews.length > 0) {
                reviewMap[reviews[0].postId] = reviews;
              }
            }
            this.props.setAllReviews(reviewMap);
          });
      });
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

  private handleAddPost = () => {
    this.setState({ activePostId: undefined });
    this.props.setView("ADD_OR_EDIT_POST");
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
    view: state.view,
    authedUsername: state.authedUsername,
    postMap: state.postMap,
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setView: (viewType: VIEW_TYPE) => dispatch(setView(viewType)),
    setUsernames: (usernames: Array<string>) => dispatch(setUsernames(usernames)),
    setAllPosts: (postMap: { [postId: number]: WirePost }) => dispatch(setAllPosts(postMap)),
    setAllReviews: (reviewMap: { [postId: number]: Array<WireReview> }) => dispatch(setAllReviews(reviewMap)),
  };
};

export const MainContent = connect(mapStateToProps, mapDispatchToProps)(MainContentInternal);
